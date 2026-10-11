import { execSync } from 'node:child_process';

console.log('====================================================');
console.log('   NYAYALENS CORE INTEGRITY & VERIFICATION SUITE    ');
console.log('====================================================\n');

const testSuites = [
  { name: 'Task T2: PDF Ingestion & Key-Page Selector', script: 'tests/test-t2-pdf.mjs' },
  { name: 'Task T3: LLM Extraction & API Contract (/api/analyze)', script: 'tests/test-t3-analyze.mjs' },
  { name: 'Task T5: Evidence Verification & Hallucination Guard', script: 'tests/test-t5-verify.mjs' },
  { name: 'Task T6: Indian Statutory Normalizer & BNS Bridge', script: 'tests/test-t6-statutes.mjs' },
];

let allPassed = true;
const results = [];

for (const suite of testSuites) {
  process.stdout.write(`▶ Running ${suite.name}... `);
  try {
    const output = execSync(`node ${suite.script}`, { encoding: 'utf8' });
    results.push({ name: suite.name, status: 'PASSED', output: output.trim() });
    console.log('✓ PASSED');
  } catch (err) {
    allPassed = false;
    results.push({ name: suite.name, status: 'FAILED', output: err.message });
    console.log('✗ FAILED');
  }
}

console.log('\n====================================================');
console.log('                 VERIFICATION SUMMARY               ');
console.log('====================================================');

results.forEach((r, idx) => {
  console.log(`${idx + 1}. [${r.status === 'PASSED' ? '✓' : '✗'}] ${r.name}`);
});

if (allPassed) {
  console.log('\n🎉 ALL 4 CORE VERIFICATION TEST SUITES PASSED WITH ZERO ERRORS!');
  process.exit(0);
} else {
  console.error('\n⚠️ Some tests failed.');
  process.exit(1);
}
