import { normalizeStatutes, normalizeActName, mapSectionsToNewCodes } from '../lib/statutes.js';
import assert from 'node:assert';

console.log('--- Testing Task T6: lib/statutes.js ---');

// 1. Alias normalization test
const alias1 = normalizeActName('I.P.C.');
const alias2 = normalizeActName('IPC');
const alias3 = normalizeActName('Indian Penal Code');
console.log(`Aliases resolved: [${alias1}], [${alias2}], [${alias3}]`);
assert.strictEqual(alias1, 'Indian Penal Code, 1860');
assert.strictEqual(alias2, 'Indian Penal Code, 1860');
assert.strictEqual(alias3, 'Indian Penal Code, 1860');

// 2. Multi-alias consolidation and BNS mapping test
const testInput = [
  { act: 'I.P.C.', sections: ['420'], page: 2, evidence: 'Section 420 IPC' },
  { act: 'IPC', sections: ['34'], page: 2, evidence: 'Section 34 IPC' },
  { act: 'Indian Penal Code', sections: ['302'], page: 5, evidence: 'Section 302 of the Indian Penal Code' },
  { act: 'Cr.P.C.', sections: ['438', '482'], page: 1, evidence: 'u/s 438 CrPC' }
];

const normalized = normalizeStatutes(testInput);
console.log('Normalized output count:', normalized.length);

// Assert I.P.C., IPC, and Indian Penal Code merged into single entry
const ipcEntry = normalized.find(n => n.act === 'Indian Penal Code, 1860');
assert(ipcEntry, 'IPC entries must be merged into "Indian Penal Code, 1860"');
assert(ipcEntry.sections.includes('420'), 'Must include 420');
assert(ipcEntry.sections.includes('34'), 'Must include 34');
assert(ipcEntry.sections.includes('302'), 'Must include 302');

// Check IPC 420 mapped to BNS 318(4)
const sec420Mapping = ipcEntry.sectionMappings.find(s => s.section === '420');
assert(sec420Mapping, 'Mapping for 420 must exist');
console.log('Section 420 Mapping Note:', sec420Mapping.newCodeNote);
assert(sec420Mapping.newCodeNote.includes('BNS (2023) Section 318(4)'), 'Must map to BNS 318');

// Check CrPC 438 mapped to BNSS 482
const crpcEntry = normalized.find(n => n.act.includes('Code of Criminal Procedure'));
assert(crpcEntry, 'CrPC must be normalized');
const sec438Mapping = crpcEntry.sectionMappings.find(s => s.section === '438');
assert(sec438Mapping, 'Mapping for 438 must exist');
console.log('Section 438 Mapping Note:', sec438Mapping.newCodeNote);
assert(sec438Mapping.newCodeNote.includes('BNSS (2023) Section 482'), 'Must map to BNSS 482');

console.log('✓ Task T6 Acceptance Test PASSED successfully!');
