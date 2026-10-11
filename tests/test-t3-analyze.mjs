import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { POST } from '../app/api/analyze/route.js';

console.log('--- Testing Task T3: /api/analyze Endpoint ---');

// Load sample case 1 data
const sampleCasePath = path.join(process.cwd(), 'samples', 'case01_criminal_bail.json');
const sampleData = JSON.parse(fs.readFileSync(sampleCasePath, 'utf8'));

// Mock Next.js Request
const mockRequest = {
  json: async () => ({
    fileName: sampleData.fileName,
    totalPages: sampleData.pages.length,
    pages: sampleData.pages
  })
};

const response = await POST(mockRequest);
const status = response.status;
const json = await response.json();

console.log(`Endpoint HTTP Status: ${status}`);
console.log('Returned JSON Keys:', Object.keys(json));
console.log(`Extracted Case Type: ${json.case_type?.category} (${json.case_type?.sub_type})`);
console.log(`Extracted Outcome: ${json.outcome?.result} - ${json.outcome?.detail}`);
console.log(`Statutes Found: ${json.statutes?.length}`);
console.log(`Cached: ${json.meta?.cached}, Latency: ${json.meta?.latencyMs}ms`);

// Acceptance checks
assert.strictEqual(status, 200, 'HTTP status must be 200');
assert(json.file, 'Field "file" must exist');
assert(json.case_type?.category, 'Field "case_type.category" must exist');
assert(json.case_type?.sub_type, 'Field "case_type.sub_type" must exist');
assert(Array.isArray(json.parties?.petitioner), '"parties.petitioner" must be an array');
assert(Array.isArray(json.parties?.respondent), '"parties.respondent" must be an array');
assert(Array.isArray(json.parties?.judges), '"parties.judges" must be an array');
assert(Array.isArray(json.statutes), '"statutes" must be an array');
assert(json.outcome?.result, 'Field "outcome.result" must exist');
assert(json.outcome?.detail, 'Field "outcome.detail" must exist');
assert(json.summary, 'Field "summary" must exist');
assert(json.meta?.pagesSent, 'Field "meta.pagesSent" must exist');

// Verifications embedded in pipeline
assert(json.outcome.verified !== undefined, 'Outcome must have verified flag');
assert(json.statutes[0].verified !== undefined, 'Statutes must have verified flag');
assert(json.statutes[0].sectionMappings !== undefined, 'Statutes must include BNS/BNSS mappings');

console.log('✓ Task T3 Acceptance Test PASSED successfully!');
