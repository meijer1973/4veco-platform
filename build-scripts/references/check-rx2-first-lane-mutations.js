#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Update REQUIRED_UNITS when a later first-lane mutation set changes.
 * - Keep this checker read-only. It verifies that the protected machine catalog
 *   reflects CLI-applied mutations and that non-interactive generator blocks are
 *   still recorded outside references/machine/.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REQUIRED_UNITS = ['A61', 'A66', 'A67', 'A70', 'A72', 'A74'];
const EXPECTED_NEEDS = {
  A61: [],
  A66: ['A61'],
  A67: ['A38', 'A61', 'A66'],
  A70: ['A38'],
  A72: ['A39', 'A61'],
  A74: ['A38', 'A39', 'A66'],
};
const EXPECTED_GENERATORS = {
  A61: 'GEN_A61',
  A66: 'GEN_A66',
  A67: 'GEN_A67',
  A70: 'GEN_A70',
  A72: 'GEN_A72',
  A74: 'GEN_A74',
};

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function fail(message) {
  console.error(`RX.2 mutation check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function sameArray(actual, expected) {
  return JSON.stringify(actual || []) === JSON.stringify(expected || []);
}

function main() {
  const closure = readJson('reports/review-gates/GATE-RX2-first-lane-mutation-review/gate-closure.json');
  assert(closure.status === 'pass_with_conditions', 'gate closure must be pass_with_conditions');
  assert(closure.cli_unit_mutation_authorized === true, 'gate closure must authorize CLI mutation');
  assert(sameArray(closure.required_execution_order, REQUIRED_UNITS), 'gate closure required execution order mismatch');

  const log = readJson('reports/review-gates/GATE-RX2-first-lane-mutation-review/RX.2-mutation-log.json');
  assert(log.status === 'completed', 'mutation log must be completed');
  assert(log.execution_mode === 'CLI-only via build-scripts/references/unit-add.js', 'mutation log execution mode mismatch');
  assert(sameArray(log.applied.units_added, REQUIRED_UNITS), 'mutation log units_added mismatch');

  const block = readJson('references/data/sprints/RX.2-generator-blocked-units.json');
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
    assert(Array.isArray(unit.procedure) && unit.procedure.length > 0, `${id} must have procedure steps`);
    const blocked = blockById.get(id);
    assert(blocked, `${id} missing from generator block tracking`);
    assert(blocked.generator === EXPECTED_GENERATORS[id], `${id} generator block mismatch`);
    assert(blocked.generator_implemented === false, `${id} generator_implemented must be false`);
    assert(blocked.student_facing_skilltree_use_allowed === false, `${id} student-facing skill-tree use must be blocked`);
  }

  const a61 = byId.get('A61');
  assert(a61.zero_needs_status === 'underbouw_assumed', 'A61 zero_needs_status mismatch');
  assert(
    a61.zero_needs_review &&
      /economic source-value selection/.test(a61.zero_needs_review.rationale) &&
      /not generic table reading/.test(a61.zero_needs_review.rationale),
    'A61 zero-needs rationale must mention economic source-value selection, not generic table reading'
  );

  console.log(`OK RX.2 first-lane mutations: ${REQUIRED_UNITS.length} units and generator blocks verified`);
}

if (require.main === module) main();
