/**
 * NyayaLens Evidence Verification Engine
 * Verifies extracted parties, cited statutes, and operative outcome phrases
 * directly against the raw text of the submitted judgment pages.
 * Eliminates LLM hallucinations and flags unverified items with amber chips.
 */

/**
 * Normalizes text for robust substring matching:
 * - Collapses repeated whitespace & newlines to single space
 * - Removes non-alphanumeric punctuation variations (smart quotes, em-dashes)
 * - Lowercases for case-insensitivity
 */
export function normalizeText(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D]/g, '"')
    .replace(/[—–]/g, '-')
    .replace(/[\s\r\n\t]+/g, ' ')
    .trim();
}

/**
 * Checks if a target phrase or entity exists within a page's text
 * Supports fuzzy word-token containment for party names & phrases
 */
export function checkEvidence(targetPhrase, pages) {
  if (!targetPhrase || typeof targetPhrase !== 'string') {
    return { verified: false, page: null };
  }

  const cleanTarget = normalizeText(targetPhrase);
  if (cleanTarget.length < 3) {
    return { verified: false, page: null };
  }

  // 1. Direct normalized substring match
  for (const p of pages) {
    const cleanDoc = normalizeText(p.text);
    if (cleanDoc.includes(cleanTarget)) {
      return { verified: true, page: p.page, matchType: 'exact' };
    }
  }

  // 2. Token overlap match (e.g. for multi-word party names with slight OCR/spacing diffs)
  const targetTokens = cleanTarget.split(' ').filter(t => t.length > 2);
  if (targetTokens.length >= 2) {
    for (const p of pages) {
      const cleanDoc = normalizeText(p.text);
      let matchCount = 0;
      for (const token of targetTokens) {
        if (cleanDoc.includes(token)) {
          matchCount++;
        }
      }
      // If >= 75% of meaningful tokens exist in the page
      if (matchCount / targetTokens.length >= 0.75) {
        return { verified: true, page: p.page, matchType: 'fuzzy' };
      }
    }
  }

  return { verified: false, page: null, matchType: 'none' };
}

/**
 * Verifies all items within an extraction record against sent pages
 * @param {object} record JSON output from LLM
 * @param {Array<{ page: number, text: string }>} pages Sent excerpts
 * @returns {object} Record with verification flags attached
 */
export function verifyRecord(record, pages) {
  if (!record) return record;

  // 1. Verify outcome
  if (record.outcome) {
    const outcomeCheck = checkEvidence(record.outcome.evidence || record.outcome.detail, pages);
    record.outcome.verified = outcomeCheck.verified;
    if (outcomeCheck.page && !record.outcome.page) {
      record.outcome.page = outcomeCheck.page;
    }
  }

  // 2. Verify statutes
  if (Array.isArray(record.statutes)) {
    record.statutes = record.statutes.map(statute => {
      // Check evidence string first, fallback to Act + section
      const check = checkEvidence(statute.evidence || `${statute.act} ${statute.sections?.join(' ')}`, pages);
      return {
        ...statute,
        verified: check.verified,
        page: check.page || statute.page || null
      };
    });
  }

  // 3. Verify parties
  if (record.parties) {
    record.verified_parties = {
      petitioner: (record.parties.petitioner || []).map(p => ({
        name: p,
        verified: checkEvidence(p, pages).verified
      })),
      respondent: (record.parties.respondent || []).map(r => ({
        name: r,
        verified: checkEvidence(r, pages).verified
      })),
      judges: (record.parties.judges || []).map(j => ({
        name: j,
        verified: checkEvidence(j, pages).verified
      }))
    };
  }

  // 4. Verify directions
  if (Array.isArray(record.directions)) {
    record.directions = record.directions.map(dir => {
      const check = checkEvidence(dir.evidence || dir.action, pages);
      return {
        ...dir,
        verified: check.verified,
        page: check.page || dir.page || 1
      };
    });
  }

  // 5. Verify precedents
  if (Array.isArray(record.precedents)) {
    record.precedents = record.precedents.map(prec => {
      const check = checkEvidence(prec.evidence || prec.name, pages);
      return {
        ...prec,
        verified: check.verified,
        page: check.page || prec.page || 1
      };
    });
  }

  return record;
}
