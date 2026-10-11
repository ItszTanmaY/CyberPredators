/**
 * NyayaLens Indian Statutory Normalizer & Colonial-to-New Code Bridge
 * 
 * 1. Resolves colloquial aliases ("IPC", "I.P.C.", "CrPC") to full official titles.
 * 2. Maps legacy colonial provisions (IPC, CrPC, IEA) to modern Bharatiya Sanhitas:
 *    - IPC (1860) <-> BNS (Bharatiya Nyaya Sanhita, 2023)
 *    - CrPC (1973) <-> BNSS (Bharatiya Nagarik Suraksha Sanhita, 2023)
 *    - Evidence Act (1872) <-> BSA (Bharatiya Sakshya Adhiniyam, 2023)
 */

export const STATUTE_ALIASES = {
  // Indian Penal Code
  'ipc': 'Indian Penal Code, 1860',
  'i.p.c.': 'Indian Penal Code, 1860',
  'i.p.c': 'Indian Penal Code, 1860',
  'indian penal code': 'Indian Penal Code, 1860',
  'indian penal code, 1860': 'Indian Penal Code, 1860',
  'penal code': 'Indian Penal Code, 1860',

  // Code of Criminal Procedure
  'crpc': 'Code of Criminal Procedure, 1973',
  'cr.p.c.': 'Code of Criminal Procedure, 1973',
  'cr.p.c': 'Code of Criminal Procedure, 1973',
  'code of criminal procedure': 'Code of Criminal Procedure, 1973',
  'code of criminal procedure, 1973': 'Code of Criminal Procedure, 1973',

  // Code of Civil Procedure
  'cpc': 'Code of Civil Procedure, 1908',
  'c.p.c.': 'Code of Civil Procedure, 1908',
  'c.p.c': 'Code of Civil Procedure, 1908',
  'code of civil procedure': 'Code of Civil Procedure, 1908',
  'code of civil procedure, 1908': 'Code of Civil Procedure, 1908',

  // Indian Evidence Act
  'evidence act': 'Indian Evidence Act, 1872',
  'indian evidence act': 'Indian Evidence Act, 1872',
  'indian evidence act, 1872': 'Indian Evidence Act, 1872',
  'iea': 'Indian Evidence Act, 1872',

  // Negotiable Instruments Act
  'ni act': 'Negotiable Instruments Act, 1881',
  'n.i. act': 'Negotiable Instruments Act, 1881',
  'negotiable instruments act': 'Negotiable Instruments Act, 1881',
  'negotiable instruments act, 1881': 'Negotiable Instruments Act, 1881',

  // Constitution of India
  'constitution': 'Constitution of India, 1950',
  'constitution of india': 'Constitution of India, 1950',
  'constitution of india, 1950': 'Constitution of India, 1950',

  // Bharatiya Nyaya Sanhita (New)
  'bns': 'Bharatiya Nyaya Sanhita, 2023',
  'bharatiya nyaya sanhita': 'Bharatiya Nyaya Sanhita, 2023',
  'bharatiya nyaya sanhita, 2023': 'Bharatiya Nyaya Sanhita, 2023',

  // Bharatiya Nagarik Suraksha Sanhita (New)
  'bnss': 'Bharatiya Nagarik Suraksha Sanhita, 2023',
  'bharatiya nagarik suraksha sanhita': 'Bharatiya Nagarik Suraksha Sanhita, 2023',
  'bharatiya nagarik suraksha sanhita, 2023': 'Bharatiya Nagarik Suraksha Sanhita, 2023',

  // Bharatiya Sakshya Adhiniyam (New)
  'bsa': 'Bharatiya Sakshya Adhiniyam, 2023',
  'bharatiya sakshya adhiniyam': 'Bharatiya Sakshya Adhiniyam, 2023',
  'bharatiya sakshya adhiniyam, 2023': 'Bharatiya Sakshya Adhiniyam, 2023',
};

/**
 * IPC (1860) to BNS (2023) Section Mapping Table
 */
export const IPC_TO_BNS_MAP = {
  '34': { bns: '3(5)', description: 'Joint liability / Common intention' },
  '120B': { bns: '61(2)', description: 'Criminal conspiracy' },
  '124A': { bns: '152', description: 'Acts endangering sovereignty / unity of India' },
  '149': { bns: '190', description: 'Unlawful assembly common object' },
  '302': { bns: '103(1)', description: 'Punishment for murder' },
  '304': { bns: '105', description: 'Culpable homicide not amounting to murder' },
  '304A': { bns: '106(1)', description: 'Causing death by negligence' },
  '304B': { bns: '80', description: 'Dowry death' },
  '307': { bns: '109', description: 'Attempt to murder' },
  '323': { bns: '115(2)', description: 'Voluntarily causing hurt' },
  '324': { bns: '117', description: 'Voluntarily causing hurt by dangerous weapons' },
  '326': { bns: '118(1)', description: 'Voluntarily causing grievous hurt by dangerous weapons' },
  '354': { bns: '74', description: 'Assault / criminal force to woman with intent to outrage modesty' },
  '363': { bns: '137(2)', description: 'Punishment for kidnapping' },
  '376': { bns: '64', description: 'Punishment for rape' },
  '377': { bns: 'N/A (Decriminalized)', description: 'Unnatural offences' },
  '379': { bns: '303(2)', description: 'Punishment for theft' },
  '392': { bns: '309', description: 'Punishment for robbery' },
  '395': { bns: '310(2)', description: 'Punishment for dacoity' },
  '406': { bns: '316(2)', description: 'Punishment for criminal breach of trust' },
  '420': { bns: '318(4)', description: 'Cheating and dishonestly inducing delivery of property' },
  '467': { bns: '338', description: 'Forgery of valuable security / will' },
  '468': { bns: '336(3)', description: 'Forgery for purpose of cheating' },
  '471': { bns: '340(2)', description: 'Using as genuine a forged document' },
  '498A': { bns: '85', description: 'Husband or relative of husband subjecting woman to cruelty' },
  '499': { bns: '356', description: 'Defamation' },
  '500': { bns: '356(2)', description: 'Punishment for defamation' },
  '506': { bns: '351(2)', description: 'Punishment for criminal intimidation' },
  '511': { bns: '62', description: 'Attempt to commit offences' },
};

/**
 * CrPC (1973) to BNSS (2023) Section Mapping Table
 */
export const CRPC_TO_BNSS_MAP = {
  '154': { bnss: '173', description: 'Information in cognizable cases (FIR)' },
  '156': { bnss: '175', description: 'Police officer power to investigate cognizable case' },
  '161': { bnss: '180', description: 'Examination of witnesses by police' },
  '164': { bnss: '183', description: 'Recording of confessions and statements' },
  '167': { bnss: '187', description: 'Procedure when investigation cannot be completed in 24 hours' },
  '173': { bnss: '193', description: 'Report of police officer on completion of investigation (Charge sheet)' },
  '200': { bnss: '223', description: 'Examination of complainant' },
  '207': { bnss: '230', description: 'Supply to accused of copy of police report' },
  '227': { bnss: '250', description: 'Discharge in Sessions trial' },
  '239': { bnss: '262', description: 'Discharge in Warrant case' },
  '311': { bnss: '348', description: 'Power to summon material witness or examine person present' },
  '313': { bnss: '351', description: 'Power to examine the accused' },
  '437': { bnss: '480', description: 'Bail in non-bailable offences' },
  '438': { bnss: '482', description: 'Direction for grant of bail to person apprehending arrest (Anticipatory Bail)' },
  '439': { bnss: '483', description: 'Special powers of High Court or Court of Session regarding bail' },
  '482': { bnss: '528', description: 'Saving of inherent powers of High Court' },
};

/**
 * Normalizes an Act name to its canonical form
 * @param {string} actName 
 * @returns {string} Canonical Act name
 */
export function normalizeActName(actName) {
  if (!actName) return 'Other Act';
  const clean = actName.trim().toLowerCase();
  return STATUTE_ALIASES[clean] || actName.trim();
}

/**
 * Attaches modern code mapping notes to cited sections
 * @param {string} canonicalAct 
 * @param {string[]} sections 
 * @returns {Array<{ section: string, newCodeNote: string | null }>}
 */
export function mapSectionsToNewCodes(canonicalAct, sections = []) {
  const isIpc = canonicalAct.includes('Indian Penal Code');
  const isCrpc = canonicalAct.includes('Code of Criminal Procedure');

  return sections.map(sec => {
    const cleanSec = sec.replace(/[^\w]/g, '').trim();
    let note = null;

    if (isIpc && IPC_TO_BNS_MAP[cleanSec]) {
      const match = IPC_TO_BNS_MAP[cleanSec];
      note = `Mapped to BNS (2023) Section ${match.bns} (${match.description})`;
    } else if (isCrpc && CRPC_TO_BNSS_MAP[cleanSec]) {
      const match = CRPC_TO_BNSS_MAP[cleanSec];
      note = `Mapped to BNSS (2023) Section ${match.bnss} (${match.description})`;
    }

    return {
      section: sec,
      newCodeNote: note
    };
  });
}

/**
 * Processes a list of raw statute extractions into normalized, deduplicated entities
 * @param {Array<{ act: string, sections: string[], page?: number, evidence?: string }>} statutes 
 * @returns {Array<object>}
 */
export function normalizeStatutes(statutes = []) {
  if (!Array.isArray(statutes)) return [];

  const grouped = new Map();

  for (const item of statutes) {
    if (!item?.act) continue;
    const canonicalAct = normalizeActName(item.act);

    if (!grouped.has(canonicalAct)) {
      grouped.set(canonicalAct, {
        act: canonicalAct,
        rawAct: item.act,
        sections: new Set(),
        page: item.page || null,
        evidence: item.evidence || null,
        verified: item.verified ?? null,
      });
    }

    const entry = grouped.get(canonicalAct);
    if (Array.isArray(item.sections)) {
      item.sections.forEach(s => entry.sections.add(s));
    }
    if (!entry.page && item.page) entry.page = item.page;
    if (!entry.evidence && item.evidence) entry.evidence = item.evidence;
  }

  // Convert Sets to arrays with mapping annotations
  return Array.from(grouped.values()).map(entry => {
    const sectionList = Array.from(entry.sections);
    const mappedDetails = mapSectionsToNewCodes(entry.act, sectionList);
    return {
      act: entry.act,
      sections: sectionList,
      sectionMappings: mappedDetails,
      page: entry.page,
      evidence: entry.evidence,
      verified: entry.verified
    };
  });
}
