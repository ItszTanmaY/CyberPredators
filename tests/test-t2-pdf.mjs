import { selectPages } from '../lib/pdf.js';
import assert from 'node:assert';

console.log('--- Testing Task T2: lib/pdf.js (selectPages) ---');

// Simulate a 60-page Indian court judgment
const totalPages = 60;
const mockPages = [];

for (let i = 1; i <= totalPages; i++) {
  let content = `Page ${i} content. `;
  if (i === 1) content += 'IN THE HIGH COURT OF JUDICATURE AT BOMBAY. Criminal Appeal No. 412 of 2023. State of Maharashtra vs Ramesh Patil.';
  else if (i === 2) content += 'Cause Title: Appellant vs Respondent. The appellant has approached this court.';
  else if (i === 3) content += 'FIR registered under Section 420, Section 34 of Indian Penal Code, 1860.';
  else if (i === 25) content += 'Arguments on Section 420 IPC and Section 406 IPC with citations of Supreme Court judgments.';
  else if (i === 38) content += 'Discussion on Section 482 of CrPC and abuse of court process.';
  else if (i === 45) content += 'High statutory density: Section 138 NI Act, Section 420 IPC, Section 34 IPC, Article 226 of the Constitution.';
  else if (i === 57) content += 'Court reasoning and conclusion on evidence.';
  else if (i === 58) content += 'Findings on charges u/s 420 IPC.';
  else if (i === 59) content += 'Operative order: The conviction is set aside and quashed.';
  else if (i === 60) content += 'Appeal is allowed. The appellant is acquitted. Bail bonds cancelled. Order signed.';
  else content += 'General factual narration and witness depositions.';

  mockPages.push({ page: i, text: content });
}

const result = selectPages(mockPages, 12);

console.log(`Input Total Pages: ${result.totalPages}`);
console.log(`Pages Selected Count: ${result.selectedPages.length}`);
console.log(`Pages Sent: ${JSON.stringify(result.pagesSent)}`);

// Acceptance checks
assert(result.selectedPages.length <= 12, 'Must return at most 12 pages');
assert(result.pagesSent.includes(1), 'Must include page 1');
assert(result.pagesSent.includes(2), 'Must include page 2');
assert(result.pagesSent.includes(3), 'Must include page 3');
assert(result.pagesSent.includes(57), 'Must include page 57');
assert(result.pagesSent.includes(58), 'Must include page 58');
assert(result.pagesSent.includes(59), 'Must include page 59');
assert(result.pagesSent.includes(60), 'Must include page 60');

// Middle page check: high-density page 45 must be chosen
assert(result.pagesSent.includes(45), 'Must select high-signal middle page 45');

console.log('✓ Task T2 Acceptance Test PASSED successfully!');
