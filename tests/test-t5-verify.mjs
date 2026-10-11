import { verifyRecord, checkEvidence } from '../lib/verify.js';
import assert from 'node:assert';

console.log('--- Testing Task T5: lib/verify.js (Evidence Verification) ---');

const mockPages = [
  {
    page: 1,
    text: `IN THE SUPREME COURT OF INDIA. CRIMINAL APPELLATE JURISDICTION.
    Criminal Appeal No. 1024 of 2024.
    Anand Kumar ... Appellant
    VERSUS
    State of Uttar Pradesh & Another ... Respondents.
    Hon'ble Mr. Justice D.Y. Chandrachud and Hon'ble Mr. Justice P.S. Narasimha.`
  },
  {
    page: 2,
    text: `The FIR No. 89/2021 was registered under Section 420 and Section 34 of the Indian Penal Code, 1860 at Police Station Gomti Nagar.`
  },
  {
    page: 12,
    text: `Operative Order: In view of the above discussions, the criminal appeal is allowed. The judgment and conviction order passed by the High Court is hereby quashed and set aside. The appellant is acquitted of all charges.`
  }
];

// Test record with both REAL and DELIBERATELY WRONG / HALLUCINATED items
const recordToVerify = {
  file: 'test_judgment.pdf',
  parties: {
    petitioner: ['Anand Kumar', 'John Doe (Fake Party)'],
    respondent: ['State of Uttar Pradesh'],
    judges: ['Justice D.Y. Chandrachud']
  },
  statutes: [
    {
      act: 'Indian Penal Code, 1860',
      sections: ['420', '34'],
      page: 2,
      evidence: 'Section 420 and Section 34 of the Indian Penal Code, 1860'
    },
    {
      // DELIBERATELY WRONG STATUTE
      act: 'Narcotic Drugs and Psychotropic Substances Act, 1985',
      sections: ['21', '29'],
      page: 2,
      evidence: 'Section 21 and Section 29 of the NDPS Act'
    }
  ],
  outcome: {
    result: 'Allowed',
    detail: 'The criminal appeal is allowed and conviction is quashed.',
    page: 12,
    evidence: 'the criminal appeal is allowed. The judgment and conviction order passed by the High Court is hereby quashed and set aside'
  }
};

const verifiedRecord = verifyRecord(recordToVerify, mockPages);

console.log('Verified Record Summary:');
console.log('Statute 1 (Real IPC):', verifiedRecord.statutes[0].verified);
console.log('Statute 2 (Fake NDPS):', verifiedRecord.statutes[1].verified);
console.log('Outcome Verified:', verifiedRecord.outcome.verified);
console.log('Party Real (Anand Kumar):', verifiedRecord.verified_parties.petitioner[0].verified);
console.log('Party Fake (John Doe):', verifiedRecord.verified_parties.petitioner[1].verified);

// Acceptance check
assert.strictEqual(verifiedRecord.statutes[0].verified, true, 'Genuine statute must be verified true');
assert.strictEqual(verifiedRecord.statutes[1].verified, false, 'Deliberately wrong statute MUST be flagged verified: false');
assert.strictEqual(verifiedRecord.outcome.verified, true, 'Operative outcome must be verified true');
assert.strictEqual(verifiedRecord.verified_parties.petitioner[0].verified, true, 'Real petitioner must be verified true');
assert.strictEqual(verifiedRecord.verified_parties.petitioner[1].verified, false, 'Fake petitioner must be flagged verified: false');

console.log('✓ Task T5 Acceptance Test PASSED successfully!');
