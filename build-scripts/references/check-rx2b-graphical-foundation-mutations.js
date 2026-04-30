#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Update REQUIRED_UNITS when a later RX.2b-approved mutation set changes.
 * - Keep this checker read-only. It verifies that protected machine catalog
 *   changes were CLI-applied and that generator/product-use blocks are tracked
 *   outside references/machine/.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REQUIRED_UNITS = ['A62', 'A63', 'A64', 'A65', 'A68', 'A69', 'A73'];
const HELD_UNITS = ['A71'];
const EXPECTED_NEEDS = {
  A62: [],
  A63: [],
  A64: [],
  A65: ['A64', 'A04'],
  A68: ['A38', 'A62', 'A66'],
  A69: ['A38', 'A63', 'A66'],
  A73: ['A39', 'A63'],
};
const EXPECTED_GENERATORS = {
  A62: 'GEN_A62',
  A63: 'GEN_A63',
  A64: 'GEN_A64',
  A65: 'GEN_A65',
  A68: 'GEN_A68',
  A69: 'GEN_A69',
  A73: 'GEN_A73',
};

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function fail(message) {
  console.error(`RX.2b mutation check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function sameArray(actual, expected) {
  return JSON.stringify(actual || []) === JSON.stringify(expected || []);
}

function procedureHasFoundationReadingSteps(unit) {
  const text = (unit.procedure || []).join(' ').toLowerCase();
  return [
    /titel|context/,
    /variabele|assen|as|eenheid/,
    /label|legenda|categorie/,
    /schaal/,
    /lees|aflezen/,
    /schat|exact|interpoleer|interpolatie/,
  ].every((pattern) => pattern.test(text));
}

function main() {
  const closure = readJson('reports/review-gates/GATE-RX2b-graphical-foundation/gate-closure.json');
  assert(closure.status === 'pass_with_conditions', 'gate closure must be pass_with_conditions');
  assert(closure.cli_unit_mutation_authorized === true, 'gate closure must authorize CLI mutation');
  assert(sameArray(closure.required_execution_order, REQUIRED_UNITS), 'gate closure required execution order mismatch');
  assert(sameArray(closure.held_candidates, HELD_UNITS), 'gate closure held candidates mismatch');

  const log = readJson('reports/review-gates/GATE-RX2b-graphical-foundation/RX.2b-mutation-log.json');
  assert(log.status === 'completed', 'mutation log must be completed');
  assert(log.execution_mode === 'CLI-only via build-scripts/references/unit-add.js', 'mutation log execution mode mismatch');
  assert(sameArray(log.applied.units_added, REQUIRED_UNITS), 'mutation log units_added mismatch');
  assert(sameArray(log.applied.held_candidates, HELD_UNITS), 'mutation log held_candidates mismatch');

  const block = readJson('references/data/sprints/RX.2b-generator-blocked-units.json');
  assert(block.status === 'active_block', 'generator block status must be active_block');
  assert(block.student_facing_skilltree_use_allowed === false, 'student-facing skill-tree use must remain blocked');

  const blockById = new Map(block.units.map((unit) => [unit.unit_id, unit]));
  const units = readJson('references/machine/micro-teaching-units.json');
  const byId = new Map(units.map((unit) => [unit.id, unit]));

  for (const id of REQUIRED_UNITS) {
    const unit = byId.get(id);
    assert(unit, `${id} missing from micro-teaching-units.json`);
    assert(unit.deprecated !== true, `${id} must be live/non-deprecated`);
    assert(sameArray(unit.needs, EXPECTED_NEEDS[id]), `${id} needs mismatch`);
    assert(unit.generator === EXPECTED_GENERATORS[id], `${id} generator mismatch`);
    assert(Array.isArray(unit.procedure) && unit.procedure.length >= 5, `${id} must have procedure steps`);
    const blocked = blockById.get(id);
    assert(blocked, `${id} missing from generator block tracking`);
    assert(blocked.generator === EXPECTED_GENERATORS[id], `${id} generator block mismatch`);
    assert(blocked.generator_implemented === false, `${id} generator_implemented must be false`);
    assert(blocked.student_facing_skilltree_use_allowed === false, `${id} student-facing skill-tree use must be blocked`);
  }

  for (const id of ['A62', 'A63', 'A64']) {
    const unit = byId.get(id);
    assert(unit.zero_needs_status === 'underbouw_assumed', `${id} zero_needs_status mismatch`);
    assert(procedureHasFoundationReadingSteps(unit), `${id} must encode context/title, labels, units, scale, reading, and exact/estimate/interpolation decisions`);
  }

  for (const id of HELD_UNITS) {
    assert(!byId.has(id), `${id} must remain held and absent from the live catalog`);
  }

  const coverage = readJson('reports/json/graphical-foundation-coverage.json');
  assert(coverage.status === 'updated_after_cli_mutation', 'coverage report must be updated after mutation');
  assert(coverage.summary.held_high_risk_count >= 1, 'coverage must still include held/high-risk count');
  assert(coverage.summary.missing_not_yet_scoped_count >= 1, 'coverage must still include missing/not-yet-scoped count');
  for (const id of REQUIRED_UNITS) {
    const row = coverage.coverage_rows.find((item) => item.unit_id === id);
    assert(row && row.status === 'live_unit', `${id} coverage row must be live_unit`);
    assert(row.generator_blocked === true, `${id} coverage row must be generator-blocked`);
  }
  const a71 = coverage.coverage_rows.find((item) => item.unit_id === 'A71');
  assert(a71 && a71.status === 'held_high_risk_unit', 'A71 coverage row must remain held_high_risk_unit');

  console.log(`OK RX.2b graphical foundation mutations: ${REQUIRED_UNITS.length} units and generator blocks verified`);
}

if (require.main === module) main();
