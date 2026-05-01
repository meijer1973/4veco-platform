#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Update GRAPH_LANE only after GATE-RX3-producer-representation or a later
 *   human gate changes the authorized producer graph lane.
 * - This checker is read-only. It verifies mutation-review artifacts before
 *   any unit-add.js execution is allowed.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GATE_DIR = 'reports/review-gates/GATE-RX3b-producer-graph-lane-review';
const PACKET_JSON = `${GATE_DIR}/review-packet.json`;
const PACKET_MD = `${GATE_DIR}/review-packet.md`;
const CANDIDATE_SPECS_JSON = `${GATE_DIR}/candidate-specs.json`;
const CANDIDATE_SPECS_MD = `${GATE_DIR}/candidate-specs.md`;
const CLI_PLAN_JSON = `${GATE_DIR}/cli-mutation-plan.json`;
const CLI_PLAN_MD = `${GATE_DIR}/cli-mutation-plan.md`;
const GENERATOR_BLOCK_JSON = `${GATE_DIR}/RX.3b-generator-blocked-units.json`;
const GENERATOR_BLOCK_MD = `${GATE_DIR}/RX.3b-generator-blocked-units.md`;
const RX3_CLOSURE = 'reports/review-gates/GATE-RX3-producer-representation/gate-closure.json';
const RX3A_RESULT = 'references/data/sprints/RX.3a.result.json';
const PV_G1_CLOSURE = 'reports/review-gates/GATE-PV-G1-schema/technical-closure.json';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';

const GRAPH_LANE = ['A77', 'A78'];
const REQUIRED_ORDER = ['A77', 'A78'];
const DEFERRED = ['A80', 'A81', 'HOLD_GRAPHICAL_MO_MK_OPTIMUM'];
const EXPECTED_NEEDS = {
  A77: ['A63', 'A29'],
  A78: ['A63', 'A75'],
};

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function fail(message) {
  console.error(`RX.3b producer graph-lane review check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readJson(relPath) {
  try {
    return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function exists(relPath) {
  return fs.existsSync(repoPath(relPath));
}

function sameArray(actual, expected, label) {
  assert(Array.isArray(actual), `${label} must be an array`);
  assert(actual.length === expected.length, `${label} length mismatch`);
  for (let index = 0; index < expected.length; index += 1) {
    assert(actual[index] === expected[index], `${label}[${index}] expected ${expected[index]}, got ${actual[index]}`);
  }
}

function main() {
  for (const relPath of [
    PACKET_JSON,
    PACKET_MD,
    CANDIDATE_SPECS_JSON,
    CANDIDATE_SPECS_MD,
    CLI_PLAN_JSON,
    CLI_PLAN_MD,
    GENERATOR_BLOCK_JSON,
    GENERATOR_BLOCK_MD,
    RX3_CLOSURE,
    RX3A_RESULT,
    PV_G1_CLOSURE,
    UNITS_PATH,
  ]) {
    assert(exists(relPath), `missing ${relPath}`);
  }

  const packet = readJson(PACKET_JSON);
  const specs = readJson(CANDIDATE_SPECS_JSON);
  const cliPlan = readJson(CLI_PLAN_JSON);
  const generatorBlock = readJson(GENERATOR_BLOCK_JSON);
  const rx3Closure = readJson(RX3_CLOSURE);
  const rx3aResult = readJson(RX3A_RESULT);
  const pvClosure = readJson(PV_G1_CLOSURE);
  const units = readJson(UNITS_PATH);
  const unitIds = new Set(units.map((unit) => unit.id));

  assert(rx3Closure.status === 'pass_with_conditions', 'RX.3 gate must be closed as pass_with_conditions');
  sameArray(rx3Closure.graph_lane_review_authorized_after_first_lane, GRAPH_LANE, 'RX.3 graph lane authorization');
  sameArray(rx3Closure.held_until_pv_producer_graph_templates, ['A80', 'A81'], 'RX.3 held producer-graph candidates');
  assert(rx3Closure.still_held.includes('HOLD_GRAPHICAL_MO_MK_OPTIMUM'), 'graphical MO=MK must remain held');

  assert(rx3aResult.status === 'completed', 'RX.3a must be completed before RX.3b');
  assert(Array.isArray(rx3aResult.units_added) && rx3aResult.units_added.includes('A75'), 'A75 must be live from RX.3a before RX.3b');
  assert(pvClosure.status === 'pass', 'PV-G1 schema closure must pass before graph-lane review');

  assert(packet.gate_id === 'GATE-RX3b-producer-graph-lane-review', 'wrong packet gate_id');
  assert(packet.sprint_id === 'RX.3b', 'wrong packet sprint_id');
  assert(packet.status === 'prepared_for_human_review', 'packet must stop at prepared_for_human_review');
  assert(packet.cli_unit_mutation_authorized === false, 'packet must not authorize CLI mutation yet');
  assert(Array.isArray(packet.review_questions) && packet.review_questions.length >= 8, 'packet must list review questions');

  assert(specs.status === 'prepared_for_mutation_review', 'candidate specs must be prepared_for_mutation_review');
  assert(specs.policy.mutation_authorized === false, 'candidate specs must not authorize mutation');
  assert(specs.policy.cli_execution_authorized === false, 'candidate specs must not authorize CLI execution');
  sameArray(specs.policy.graph_lane_scope, GRAPH_LANE, 'candidate graph lane scope');

  const specById = new Map(specs.candidates.map((candidate) => [candidate.candidate_id, candidate]));
  for (const id of GRAPH_LANE) {
    assert(specById.has(id), `missing candidate spec ${id}`);
    assert(!unitIds.has(id), `${id} already exists; live numbering plan must be revised`);
    const spec = specById.get(id).rx3b_draft_spec;
    assert(spec.id === id, `${id} draft spec id mismatch`);
    assert(spec.generator === `GEN_${id}`, `${id} must track missing generator GEN_${id}`);
    assert(Array.isArray(spec.procedure) && spec.procedure.length >= 5, `${id} must include a teachable procedure`);
    sameArray(spec.needs, EXPECTED_NEEDS[id], `${id} draft needs`);
  }

  for (const dep of ['A29', 'A63', 'A75']) {
    assert(unitIds.has(dep), `required live dependency missing: ${dep}`);
  }
  for (const id of ['A80', 'A81']) {
    assert(!unitIds.has(id), `${id} must remain held and absent from live catalog`);
  }

  assert(cliPlan.status === 'draft_pending_human_review', 'CLI plan must be draft_pending_human_review');
  assert(cliPlan.execution_authorized === false, 'CLI plan must not authorize execution');
  assert(cliPlan.mutation_authorized === false, 'CLI plan must not authorize mutation');
  sameArray(cliPlan.required_execution_order, REQUIRED_ORDER, 'CLI required execution order');
  for (const step of cliPlan.ordered_steps) {
    assert(step.execution_authorized === false, `${step.candidate_id} execution must be false`);
    assert(step.command_template.includes('unit-add.js'), `${step.candidate_id} command must use unit-add.js`);
  }

  sameArray(generatorBlock.generator_blocked_units, GRAPH_LANE, 'generator blocked units');
  assert(generatorBlock.student_facing_use_authorized === false, 'student-facing use must stay blocked');
  assert(generatorBlock.pv_projection_authorized === false, 'PV projection must stay blocked');

  const packetMd = fs.readFileSync(repoPath(PACKET_MD), 'utf8');
  for (const question of packet.review_questions) {
    assert(packetMd.includes(question.id), `Markdown packet missing ${question.id}`);
  }
  assert(packetMd.includes('No CLI mutation is authorized'), 'review packet must state no CLI mutation is authorized');
  assert(packetMd.includes('PV Constraints'), 'review packet must include PV constraints');

  const specMd = fs.readFileSync(repoPath(CANDIDATE_SPECS_MD), 'utf8');
  const planMd = fs.readFileSync(repoPath(CLI_PLAN_MD), 'utf8');
  for (const id of GRAPH_LANE) {
    assert(specMd.includes(id), `candidate specs Markdown missing ${id}`);
    assert(planMd.includes(id), `CLI plan Markdown missing ${id}`);
  }
  for (const item of DEFERRED) {
    assert(packetMd.includes(item) || specs.blocked_scope.includes(item), `deferred item missing from review artifacts: ${item}`);
  }

  console.log(`OK RX.3b producer graph-lane review: ${GRAPH_LANE.join(', ')} prepared, execution blocked`);
}

if (require.main === module) main();
