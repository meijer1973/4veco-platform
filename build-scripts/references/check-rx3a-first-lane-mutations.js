#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Update REQUIRED_UNITS only after a later human gate changes the RX.3a
 *   first-lane producer table/data mutation set.
 * - Keep this checker read-only. It verifies that protected machine catalog
 *   changes were CLI-applied and that generator/product-use blocks are tracked
 *   outside references/machine/.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REQUIRED_UNITS = ['A75', 'A76', 'A79'];
const EXPECTED_NEEDS = {
  A75: ['A04', 'A61'],
  A76: ['A14', 'A04', 'A61'],
  A79: ['A75', 'A61'],
};
const EXPECTED_GENERATORS = {
  A75: 'GEN_A75',
  A76: 'GEN_A76',
  A79: 'GEN_A79',
};
const BLOCKED_ABSENT_UNITS = ['A77', 'A78', 'A80', 'A81'];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function fail(message) {
  console.error(`RX.3a mutation check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function sameArray(actual, expected) {
  return JSON.stringify(actual || []) === JSON.stringify(expected || []);
}

function main() {
  const closure = readJson('reports/review-gates/GATE-RX3a-first-lane-mutation-review/gate-closure.json');
  assert(closure.status === 'pass_with_conditions', 'gate closure must be pass_with_conditions');
  assert(closure.cli_unit_mutation_authorized === true, 'gate closure must authorize CLI mutation');
  assert(sameArray(closure.required_execution_order, REQUIRED_UNITS), 'gate closure required execution order mismatch');
  for (const id of REQUIRED_UNITS) {
    assert(sameArray(closure.required_dependencies[id], EXPECTED_NEEDS[id]), `${id} closure dependency mismatch`);
  }

  const log = readJson('reports/review-gates/GATE-RX3a-first-lane-mutation-review/RX.3a-mutation-log.json');
  assert(log.status === 'completed', 'mutation log must be completed');
  assert(log.execution_mode === 'CLI-only via build-scripts/references/unit-add.js', 'mutation log execution mode mismatch');
  assert(sameArray(log.applied.units_added, REQUIRED_UNITS), 'mutation log units_added mismatch');

  const block = readJson('reports/review-gates/GATE-RX3a-first-lane-mutation-review/RX.3a-generator-blocked-units.json');
  assert(block.status === 'active_block', 'generator block status must be active_block');
  assert(block.student_facing_skilltree_use_allowed === false, 'student-facing skill-tree use must remain blocked');
  assert(block.pv_projection_allowed === false, 'PV projection must remain blocked');

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
    assert(blocked.pv_projection_allowed === false, `${id} PV projection must be blocked`);
  }

  for (const id of BLOCKED_ABSENT_UNITS) {
    assert(!byId.has(id), `${id} must remain outside RX.3a and absent from live catalog`);
  }

  console.log(`OK RX.3a producer table/data mutations: ${REQUIRED_UNITS.join(', ')} verified`);
}

if (require.main === module) main();
