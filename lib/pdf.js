/**
 * NyayaLens PDF Ingestion & Intelligent Page Selection Engine
 * Extracts text from multipage Indian court judgments and selectively isolates
 * high-signal pages (cause title, operative order, statutory arguments) to keep
 * token count lean and eliminate latency.
 */

/**
 * Configure PDF.js worker for client-side execution in Next.js
 */
export async function getPdfJs() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');
  if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
    // Use stable unpkg CDN worker to prevent Webpack bundling breakage
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version || '3.11.174'}/legacy/build/pdf.worker.min.js`;
  }
  return pdfjs;
}

/**
 * Reads all pages of a PDF File/Blob or ArrayBuffer
 * @param {File | Blob | ArrayBuffer} fileData 
 * @returns {Promise<{ totalPages: number, pages: Array<{ page: number, text: string }> }>}
 */
export async function readPages(fileData) {
  let arrayBuffer;
  if (fileData instanceof ArrayBuffer) {
    arrayBuffer = fileData;
  } else if (fileData?.arrayBuffer) {
    arrayBuffer = await fileData.arrayBuffer();
  } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(fileData)) {
    arrayBuffer = fileData.buffer.slice(fileData.byteOffset, fileData.byteOffset + fileData.byteLength);
  } else {
    throw new Error('Unsupported file format for PDF ingestion. Provide File, Blob, or Buffer.');
  }

  const pdfjs = await getPdfJs();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  const pages = [];
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const content = await page.getTextContent();
    
    // Group text items with appropriate spacing to preserve clause readability
    let lastY;
    let pageText = '';
    for (const item of content.items) {
      if (lastY !== undefined && Math.abs(item.transform[5] - lastY) > 5) {
        pageText += '\n';
      } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
        pageText += ' ';
      }
      pageText += item.str;
      lastY = item.transform[5];
    }

    pages.push({
      page: pageNum,
      text: pageText.trim()
    });
  }

  return { totalPages, pages };
}

/**
 * Intelligent Legal Page Selector
 * Selects at most `maxPages` (default 12) from an Indian judgment:
 * 1. Header (pages 1 to 3): Cause title, Court, Bench, Parties, FIR/Case details.
 * 2. Operative Order (last 4 pages): Court findings, final disposition, sentences/relief.
 * 3. High-signal middle pages: Ranked by statutory and operative keyword density.
 * 
 * @param {Array<{ page: number, text: string }>} pages 
 * @param {number} maxPages Maximum number of pages to select (default: 12)
 * @returns {{ selectedPages: Array<{ page: number, text: string }>, totalPages: number, pagesSent: number[] }}
 */
export function selectPages(pages, maxPages = 12) {
  const totalPages = pages.length;

  // If judgment is already short, send all pages
  if (totalPages <= maxPages) {
    return {
      selectedPages: pages,
      totalPages,
      pagesSent: pages.map(p => p.page)
    };
  }

  const selectedPageNumbers = new Set();

  // 1. Mandatory Header Pages (first 3 pages for cause title and party identity)
  for (let i = 1; i <= Math.min(3, totalPages); i++) {
    selectedPageNumbers.add(i);
  }

  // 2. Mandatory Final Order Pages (last 4 pages for final decree/disposition)
  for (let i = Math.max(1, totalPages - 3); i <= totalPages; i++) {
    selectedPageNumbers.add(i);
  }

  // 3. Middle pages: score by Indian legal keywords
  const legalKeywordPatterns = [
    /\b(section|u\/s|sec\.)\s+\d+/gi,
    /\b(IPC|BNS|CrPC|BNSS|CPC|Evidence Act|BSA|Constitution|Article|NDPS|NI Act)\b/gi,
    /\b(quashed|set aside|acquitted|convicted|bail granted|bail rejected|remanded|allowed|dismissed)\b/gi,
    /\b(operative order|directions|punishment|sentenced to|decree|impugned)\b/gi,
  ];

  const middlePages = pages.filter(p => !selectedPageNumbers.has(p.page));
  const scoredMiddlePages = middlePages.map(p => {
    let score = 0;
    for (const pattern of legalKeywordPatterns) {
      const matches = p.text.match(pattern);
      if (matches) {
        score += matches.length;
      }
    }
    return { page: p.page, text: p.text, score };
  });

  // Sort middle pages by density of legal citations
  scoredMiddlePages.sort((a, b) => b.score - a.score);

  // Fill remaining budget
  const remainingSlots = maxPages - selectedPageNumbers.size;
  for (let i = 0; i < Math.min(remainingSlots, scoredMiddlePages.length); i++) {
    selectedPageNumbers.add(scoredMiddlePages[i].page);
  }

  // Sort final selected pages chronologically by original document order
  const finalSelectedPages = pages
    .filter(p => selectedPageNumbers.has(p.page))
    .sort((a, b) => a.page - b.page);

  return {
    selectedPages: finalSelectedPages,
    totalPages,
    pagesSent: finalSelectedPages.map(p => p.page)
  };
}
