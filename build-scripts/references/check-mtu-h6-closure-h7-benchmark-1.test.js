#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const { spawnSync } = require('child_process');
const path = require('path');
const { FILES, validate } = require('./check-mtu-h6-closure-h7-benchmark-1');

const root = path.resolve(__dirname, '..', '..');

function runCheckerTest() {
  const result = spawnSync(
    'node',
    ['build-scripts/references/check-mtu-h6-closure-h7-benchmark-1.js', '--json'],
    {
      cwd: root,
      encoding: 'utf8',
      shell: false
    }
  );

  assert.strictEqual(
    result.status,
    0,
    `H6 closure/H7 benchmark checker failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`
  );

  const payload = JSON.parse(result.stdout);
  assert.strictEqual(payload.ok, true);
  assert.strictEqual(payload.summary.h7_records, 24);
  assert.strictEqual(payload.summary.diagnostic_records, 16);
  assert.strictEqual(payload.summary.locked_holdout_records, 8);
}

function readFixture(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function baseOverrides() {
  return Object.fromEntries(Object.values(FILES).map((relativePath) => [relativePath, readFixture(relativePath)]));
}

function runNegative(mutator) {
  const overrides = baseOverrides();
  mutator(overrides);
  return validate({
    overrides,
    skipGitAncestorCheck: true,
    skipSubordinateCheckers: true
  });
}

function runNegativeRegressionTests() {
  const reusedPriorRecord = runNegative((overrides) => {
    overrides[FILES.h7].selected_records[0].sample_id = 'vw-1022-a-25-1-o:opgave-1:question-3';
  });
  assert.strictEqual(reusedPriorRecord.ok, false);
  assert(
    reusedPriorRecord.failures.some((failure) => failure.includes('reuses prior H5/H6 record')),
    `expected prior-record reuse failure, got ${JSON.stringify(reusedPriorRecord.failures)}`
  );

  const leakedOutcome = runNegative((overrides) => {
    overrides[FILES.h7].selected_records[0].evidence_state = 'mapping_outcome_recorded';
  });
  assert.strictEqual(leakedOutcome.ok, false);
  assert(
    leakedOutcome.failures.some((failure) => failure.includes('must not include mapping/outcome state')),
    `expected mapping/outcome leakage failure, got ${JSON.stringify(leakedOutcome.failures)}`
  );

  const overclaimedClosure = runNegative((overrides) => {
    overrides[FILES.closure].closure_claims.h6_full_closure_claimed = true;
  });
  assert.strictEqual(overclaimedClosure.ok, false);
  assert(
    overclaimedClosure.failures.some((failure) => failure.includes('must not claim full H6 closure')),
    `expected closure overclaim failure, got ${JSON.stringify(overclaimedClosure.failures)}`
  );
}

if (typeof test === 'function') {
  test('MTU-H6 closure-readiness and H7 blind-holdout benchmark packet is valid', () => {
    runCheckerTest();
  });
  test('MTU-H6/H7 checker rejects stale, leaked, or overclaiming packet data', () => {
    runNegativeRegressionTests();
  });
} else {
  runCheckerTest();
  runNegativeRegressionTests();
  console.log('OK check-mtu-h6-closure-h7-benchmark-1.test.js');
}
