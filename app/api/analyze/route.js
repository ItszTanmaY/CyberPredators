import { NextResponse } from 'next/server.js';
import { callLLM, computeHash, getFromCache, saveToCache } from '../../../lib/llm.js';
import { buildAnalysisPrompt } from '../../../lib/prompts.js';
import { verifyRecord } from '../../../lib/verify.js';
import { normalizeStatutes } from '../../../lib/statutes.js';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { fileName, totalPages, pages } = body;

    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json(
        { error: 'No extracted pages provided. Upload a valid text PDF document.' },
        { status: 400 }
      );
    }

    // Compute deterministic cache key from document text and file name
    const docSignature = `${fileName || 'judgment'}-${pages.map(p => `${p.page}:${p.text.slice(0, 100)}`).join('|')}`;
    const cacheKey = computeHash(docSignature);

    // Check disk cache first (ensures offline reliability for demo)
    const cachedRecord = getFromCache(cacheKey);
    if (cachedRecord) {
      return NextResponse.json({
        ...cachedRecord,
        meta: {
          ...cachedRecord.meta,
          cached: true,
          latencyMs: Date.now() - startTime
        }
      });
    }

    // Build the expert Indian legal extraction prompt
    const prompt = buildAnalysisPrompt(pages);

    // Call LLM provider with single automatic retry on JSON parse issue
    let rawRecord;
    try {
      rawRecord = await callLLM(prompt);
    } catch (llmErr) {
      // 1. Try filename hash fallback
      const fallbackKey = fileName ? computeHash(fileName) : null;
      let fallbackRecord = fallbackKey ? getFromCache(fallbackKey) : null;

      // 2. Try content signature fallback if user renamed demo file
      if (!fallbackRecord) {
        const sampleCaseNames = ['case01_criminal_bail.pdf', 'case02_cheating_quashing.pdf'];
        for (const sampleName of sampleCaseNames) {
          const sampleRecord = getFromCache(computeHash(sampleName));
          if (sampleRecord) {
            // Check if page 1 text overlaps with this sample
            const sampleParty = sampleRecord.parties?.petitioner?.[0] || '';
            const page1Text = pages[0]?.text || '';
            if (sampleParty && page1Text.toLowerCase().includes(sampleParty.toLowerCase())) {
              fallbackRecord = sampleRecord;
              break;
            }
          }
        }
      }

      if (fallbackRecord) {
        return NextResponse.json({
          ...fallbackRecord,
          meta: {
            ...fallbackRecord.meta,
            cached: true,
            demoFallback: true,
            latencyMs: Date.now() - startTime
          }
        });
      }

      // If genuinely no API key and no sample match
      if (llmErr.message?.includes('API_KEY is not defined')) {
        return NextResponse.json(
          {
            error: 'AI Provider Key Missing: Please add your Gemini API key to .env.local (API_KEY=...) to analyze custom PDF judgments, or test with the Quick Demo Judgments below.',
            code: 'MISSING_API_KEY'
          },
          { status: 401 }
        );
      }

      throw llmErr;
    }

    // Step 5: Verification (verify each party, statute, and outcome against source pages)
    const verifiedRecord = verifyRecord(rawRecord, pages);

    // Step 6: Normalization (IPC/BNS and CrPC/BNSS mapping)
    if (verifiedRecord.statutes) {
      verifiedRecord.statutes = normalizeStatutes(verifiedRecord.statutes);
    }

    // Attach metadata
    const finalRecord = {
      file: fileName || 'Court_Judgment.pdf',
      ...verifiedRecord,
      meta: {
        latencyMs: Date.now() - startTime,
        pagesSent: pages.map(p => p.page),
        totalPages: totalPages || pages.length,
        model: process.env.MODEL_NAME || 'gemini-2.5-flash',
        cached: false
      }
    };

    // Save to disk cache for instantaneous repeat queries
    saveToCache(cacheKey, finalRecord);
    if (fileName) {
      // Also cache by filename for direct demo fallback
      saveToCache(computeHash(fileName), finalRecord);
    }

    return NextResponse.json(finalRecord);
  } catch (err) {
    console.error('[NyayaLens /api/analyze Error]:', err);
    return NextResponse.json(
      { 
        error: err.message || 'An error occurred while analyzing the court document.',
        help: 'Ensure API_KEY is configured in .env.local or use cached sample judgments.'
      },
      { status: 500 }
    );
  }
}
