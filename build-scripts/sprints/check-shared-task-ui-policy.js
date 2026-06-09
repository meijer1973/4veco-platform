#!/usr/bin/env node
const checks = require('../lib/golden-exercise-policy-checks');

function main() {
  const sharedTaskPolicy = checks.validateSharedTaskPolicyText();
  const fixtures = checks.checkNegativeFixtures((fixture) => ['interaction', 'proof'].includes(fixture.category));
  console.log(JSON.stringify({
    ok: true,
    check: 'shared-task-ui-policy',
    sharedTaskPolicy,
    negative_fixtures: fixtures,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(`check-shared-task-ui-policy failed: ${error.message}`);
  process.exit(1);
}
