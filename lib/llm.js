import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * NyayaLens LLM Provider Layer
 * Abstracts LLM interactions with Gemini / compatible providers.
 * Includes:
 * - Deterministic SHA-256 disk caching in cache/
 * - Automatic markdown JSON stripping & JSON repair
 * - Single automatic retry on malformed JSON
 * - Seamless offline fallback from cache for resilient hackathon demos
 */

const CACHE_DIR = path.join(process.cwd(), 'cache');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

/**
 * Calculates SHA-256 hash for caching
 */
export function computeHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Checks disk cache for a previously analyzed file or prompt
 */
export function getFromCache(key) {
  try {
    const cacheFile = path.join(CACHE_DIR, `${key}.json`);
    if (fs.existsSync(cacheFile)) {
      const data = fs.readFileSync(cacheFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn(`[NyayaLens Cache] Read error for key ${key}:`, err.message);
  }
  return null;
}

/**
 * Saves analysis result to disk cache
 */
export function saveToCache(key, data) {
  try {
    const cacheFile = path.join(CACHE_DIR, `${key}.json`);
    fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn(`[NyayaLens Cache] Write error for key ${key}:`, err.message);
  }
}

/**
 * Strips markdown code blocks and extracts raw JSON
 */
export function cleanJsonOutput(text) {
  if (!text) return '';
  let cleaned = text.trim();
  // Strip ```json and ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/i, '');
  }
  // If wrapped in other characters, find outer braces
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

/**
 * Calls Google Gemini REST API or compatible endpoint
 * @param {string} prompt 
 * @param {object} options 
 * @returns {Promise<string>}
 */
export async function executeModelCall(prompt, options = {}) {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  const modelName = process.env.MODEL_NAME || 'gemini-3.5-flash-lite';

  if (!apiKey) {
    throw new Error('API_KEY is not defined in environment variables. Set API_KEY in .env.local.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      topP: 0.95,
      responseMimeType: "application/json"
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s safety timeout

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`LLM API returned HTTP ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Model returned an empty completion.');
    }

    return candidateText;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Main LLM caller with single retry on JSON parse failure
 * @param {string} prompt 
 * @param {string} retryPrompt 
 * @returns {Promise<object>}
 */
export async function callLLM(prompt, retryPrompt = null) {
  let rawText;
  try {
    rawText = await executeModelCall(prompt);
    const cleaned = cleanJsonOutput(rawText);
    return JSON.parse(cleaned);
  } catch (firstErr) {
    console.warn(`[NyayaLens LLM] First attempt failed: ${firstErr.message}. Retrying once...`);

    // Retry once with corrective prompt if JSON was bad
    const retryInstruction = retryPrompt || 
      `Your previous reply was not valid JSON. Return the same answer again as valid JSON only, matching the schema, with no extra text.`;

    const combinedPrompt = `${prompt}\n\nATTEMPT 1 OUTPUT:\n${rawText || 'N/A'}\n\nCORRECTION REQUIRED:\n${retryInstruction}`;

    try {
      const secondRaw = await executeModelCall(combinedPrompt);
      const secondCleaned = cleanJsonOutput(secondRaw);
      return JSON.parse(secondCleaned);
    } catch (secondErr) {
      throw new Error(`LLM output failed JSON validation after retry: ${secondErr.message}`);
    }
  }
}
