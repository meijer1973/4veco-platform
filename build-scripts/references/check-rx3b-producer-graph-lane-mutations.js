#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Update REQUIRED_UNITS only after a later human gate changes the RX.3b
 *   producer TO-TK graph-lane mutation set.
 * - Keep this checker read-only. It verifies that protected machine catalog
 *   changes were CLI-applied and that generator/product-use blocks are tracked
 *   outside references/machine/.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REQUIRED_UNITS = ['A77', 'A78'];
const EXPECTED_NEEDS = {
  A77: ['A63', 'A29'],
  A78: ['A63', 'A75', 'A77'],
};
const EXPECTED_GENERATORS = {
  A77: 'GEN_A77',
  A78: 'GEN_A78',
};
const BLOCKED_ABSENT_UNITS = ['A80', 'A81'];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function fail(message) {
  console.error(`RX.3b mutation check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function sameArray(actual, expected) {
  return JSON.stringify(actual || []) === JSON.stringify(expected || []);
}

function procedureHasToTkGraphSteps(unit) {
  const text = (unit.procedure || []).join(' ').toLowerCase();
  return [
    /titel|context/,
    /horizontale as/,
    /verticale as/,
    /eenhed|schaal/,
    /\bto\b/,
    /\btk\b/,
    /label|legenda/,
  ].every((pattern) => pattern.test(text));
}

function main() {
  const closure = readJson('reports/review-gates/GATE-RX3b-producer-graph-lane-review/gate-closure.json');
  assert(closure.status === 'pass_with_conditions', 'gate closure must be pass_with_conditions');
  assert(closure.cli_unit_mutation_authorized === true, 'gate closure must authorize CLI mutation');
  assert(sameArray(closure.required_execution_order, REQUIRED_UNITS), 'gate closure required execution order mismatch');
  for (const id of REQUIRED_UNITS) {
    assert(sameArray(closure.required_dependencies[id], EXPECTED_NEEDS[id]), `${id} closure dependency mismatch`);
  }
  assert(closure.a78_dependency_decision.decision === 'add_A77', 'A78 dependency decision must be recorded');
  assert(closure.pv_projection_authorized === false, 'PV projection must remain unauthorized');

  const log = readJson('reports/review-gates/GATE-RX3b-producer-graph-lane-review/RX.3b-mutation-log.json');
  assert(log.status === 'completed', 'mutation log must be completed');
  assert(log.execution_mode === 'CLI-only via build-scripts/references/unit-add.js', 'mutation log execution mode mismatch');
  assert(sameArray(log.applied.units_added, REQUIRED_UNITS), 'mutation log units_added mismatch');
  assert(log.a78_dependency_decision.decision === 'add_A77', 'mutation log must record A78 dependency decision');

  const block = readJson('reports/review-gates/GATE-RX3b-producer-graph-lane-review/RX.3b-generator-blocked-units.json');
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
    assert(Array.isArray(unit.procedure) && unit.procedure.length >= 6, `${id} must have procedure steps`);
    assert(procedureHasToTkGraphSteps(unit), `${id} must encode TO-TK graph-reading procedure discipline`);
    const blocked = blockById.get(id);
    assert(blocked, `${id} missing from generator block tracking`);
    assert(blocked.generator === EXPECTED_GENERATORS[id], `${id} generator block mismatch`);
    assert(blocked.generator_implemented === false, `${id} generator_implemented must be false`);
    assert(blocked.student_facing_skilltree_use_allowed === false, `${id} student-facing skill-tree use must be blocked`);
    assert(blocked.pv_projection_allowed === false, `${id} PV projection must be blocked`);
  }

  for (const id of BLOCKED_ABSENT_UNITS) {
    assert(!byId.has(id), `${id} must remain held and absent from live catalog`);
  }

  console.log(`OK RX.3b producer TO-TK graph-lane mutations: ${REQUIRED_UNITS.join(', ')} verified`);
}

if (require.main === module) main();
