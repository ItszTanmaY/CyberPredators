/**
 * Client-Side Privacy Masking Utility for Indian Judicial Records
 * 
 * Complies with Section 228A IPC / POSCO guidelines and digital privacy standards.
 * Masks Aadhaar, Indian phone numbers, PAN, email addresses, and optionally minors/victims
 * BEFORE any document text leaves the browser.
 */

// 1. Aadhaar: 12 digits (with optional spaces or hyphens)
const AADHAAR_REGEX = /\b[2-9]{1}[0-9]{3}[ -]?[0-9]{4}[ -]?[0-9]{4}\b/g;

// 2. Indian Phone: +91 or 0 prefix followed by 10 digits starting with 6,7,8,9
const PHONE_REGEX = /(?:\+91[\-\s]?|0)?[6-9]\d{4}[\-\s]?\d{5}\b/g;

// 3. Indian PAN: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
const PAN_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g;

// 4. Email addresses
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

// 5. Minors and Victims sensitive phrasing patterns in Indian judgments
const SENSITIVE_PROTECTED_REGEX = /\b(?:Master\s+[A-Z][a-z]+|Baby\s+[A-Z][a-z]+|Minor\s+[A-Z][a-z]+|Victim\s+[A-Z]|Prosecutrix|Child\s+in\s+conflict\s+with\s+law)\b/gi;

/**
 * Masks sensitive Indian PII identifiers in a string
 * @param {string} text 
 * @param {boolean} maskMinorsVictims 
 * @returns {{ maskedText: string, counts: { aadhaar: number, phone: number, pan: number, email: number, sensitive: number } }}
 */
export function maskSensitiveText(text, maskMinorsVictims = false) {
  if (!text || typeof text !== 'string') {
    return {
      maskedText: '',
      counts: { aadhaar: 0, phone: 0, pan: 0, email: 0, sensitive: 0 },
    };
  }

  let aadhaarCount = 0;
  let phoneCount = 0;
  let panCount = 0;
  let emailCount = 0;
  let sensitiveCount = 0;

  // Mask Aadhaar
  let masked = text.replace(AADHAAR_REGEX, () => {
    aadhaarCount++;
    return '[MASKED-AADHAAR]';
  });

  // Mask PAN
  masked = masked.replace(PAN_REGEX, () => {
    panCount++;
    return '[MASKED-PAN]';
  });

  // Mask Phone numbers
  masked = masked.replace(PHONE_REGEX, () => {
    phoneCount++;
    return '[MASKED-PHONE]';
  });

  // Mask Email
  masked = masked.replace(EMAIL_REGEX, () => {
    emailCount++;
    return '[MASKED-EMAIL]';
  });

  // Optional Minor / Victim masking
  if (maskMinorsVictims) {
    masked = masked.replace(SENSITIVE_PROTECTED_REGEX, () => {
      sensitiveCount++;
      return '[PROTECTED-IDENTITY]';
    });
  }

  return {
    maskedText: masked,
    counts: {
      aadhaar: aadhaarCount,
      phone: phoneCount,
      pan: panCount,
      email: emailCount,
      sensitive: sensitiveCount,
    },
  };
}

/**
 * Masks an entire array of pages before dispatch to /api/analyze
 */
export function maskPagesForAnalysis(pages, maskMinorsVictims = false) {
  const totalCounts = {
    aadhaar: 0,
    phone: 0,
    pan: 0,
    email: 0,
    sensitive: 0,
  };

  const maskedPages = pages.map(p => {
    const { maskedText, counts } = maskSensitiveText(p.text, maskMinorsVictims);
    totalCounts.aadhaar += counts.aadhaar;
    totalCounts.phone += counts.phone;
    totalCounts.pan += counts.pan;
    totalCounts.email += counts.email;
    totalCounts.sensitive += counts.sensitive;

    return {
      page: p.page,
      text: maskedText,
    };
  });

  return {
    maskedPages,
    counts: totalCounts,
    totalMasked: totalCounts.aadhaar + totalCounts.phone + totalCounts.pan + totalCounts.email + totalCounts.sensitive,
  };
}
