#!/usr/bin/env node
const checks = require('../lib/golden-exercise-policy-checks');

function main() {
  const interaction = checks.validateInteractionPolicy();
  const exemplarBoundary = checks.validateExemplarIndexFormulaBoundary();
  const a96 = checks.validateA96FixturePolicy();
  const fixtures = checks.checkNegativeFixtures((fixture) => fixture.category === 'interaction' || fixture.category === 'proof');
  console.log(JSON.stringify({
    ok: true,
    check: 'interaction-policy',
    interaction,
    exemplarBoundary,
    a96,
    negative_fixtures: fixtures,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(`check-interaction-policy failed: ${error.message}`);
  process.exit(1);
}
