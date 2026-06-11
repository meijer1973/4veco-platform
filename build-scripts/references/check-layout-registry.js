#!/usr/bin/env node
const checks = require('../lib/golden-exercise-policy-checks');

function main() {
  const layout = checks.validateLayoutRegistry();
  const shortCheckPolicy = checks.validateShortCheckPolicySpec();
  const snapshot = checks.checkImplementedSnapshotHtml();
  const fixtures = checks.checkNegativeFixtures((fixture) => fixture.category === 'layout');
  console.log(JSON.stringify({
    ok: true,
    check: 'layout-registry',
    layout,
    short_check_policy: shortCheckPolicy,
    snapshot,
    negative_fixtures: fixtures,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(`check-layout-registry failed: ${error.message}`);
  process.exit(1);
}
