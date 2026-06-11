#!/usr/bin/env node
const checks = require('../lib/golden-exercise-policy-checks');

function main() {
  const spec = checks.validateShortCheckPolicySpec();
  const proof = checks.validateShortCheckPolicyProof();
  console.log(JSON.stringify({
    ok: true,
    check: 'short-check-workbench-policy1',
    spec,
    proof,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(`check-short-check-workbench-policy1 failed: ${error.message}`);
  process.exit(1);
}
