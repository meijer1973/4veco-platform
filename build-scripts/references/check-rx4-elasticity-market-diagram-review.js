#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Update CANDIDATES only after GATE-RX4 or a later human gate changes the
 *   elasticity representation queue.
 * - This checker is read-only. It verifies RX.4 review artifacts before any
 *   unit-add.js execution is allowed.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GATE_DIR = 'reports/review-gates/GATE-RX4-elasticity-market-diagram-review';
const PACKET_JSON = `${GATE_DIR}/review-packet.json`;
const PACKET_MD = `${GATE_DIR}/review-packet.md`;
const CANDIDATE_SPECS_JSON = `${GATE_DIR}/candidate-specs.json`;
const CANDIDATE_SPECS_MD = `${GATE_DIR}/candidate-specs.md`;
const CLI_PLAN_JSON = `${GATE_DIR}/cli-mutation-plan.json`;
const CLI_PLAN_MD = `${GATE_DIR}/cli-mutation-plan.md`;
const GENERATOR_BLOCK_JSON = `${GATE_DIR}/RX.4-generator-blocked-units.json`;
const GENERATOR_BLOCK_MD = `${GATE_DIR}/RX.4-generator-blocked-units.md`;
const RX1_CLOSURE = 'reports/review-gates/GATE-RX1-representation-unit-scope/gate-closure.json';
const RX2B_RESULT = 'references/data/sprints/RX.2b.result.json';
const RX3B_RESULT = 'references/data/sprints/RX.3b.result.json';
const PV_G1_CLOSURE = 'reports/review-gates/GATE-PV-G1-schema/technical-closure.json';
const INVENTORY = 'references/data/sprints/RX.1-representation-operation-inventory.json';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';

const CANDIDATES = ['A82', 'A83', 'A84'];
const LOWER_RISK = ['A82', 'A84'];
const CONDITIONAL_GRAPH = ['A83'];
const REQUIRED_DEPS = ['A15', 'A46', 'A61', 'A66', 'A67'];
const DUPLICATE_AUDIT_IDS = ['A19', 'A32', 'A40', 'D39', 'D40', 'A51', 'A56', 'A59'];
const EXPECTED_NEEDS = {
  A82: ['A15', 'A61', 'A66'],
  A83: ['A15', 'A46', 'A66'],
  A84: ['A15', 'A67'],
};

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function fail(message) {
  console.error(`RX.4 elasticity market-diagram review check failed: ${message}`);
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

function containsAll(actual, expected, label) {
  assert(Array.isArray(actual), `${label} must be an array`);
  for (const value of expected) {
    assert(actual.includes(value), `${label} missing ${value}`);
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
    RX1_CLOSURE,
    RX2B_RESULT,
    RX3B_RESULT,
    PV_G1_CLOSURE,
    INVENTORY,
    UNITS_PATH,
  ]) {
    assert(exists(relPath), `missing ${relPath}`);
  }

  const packet = readJson(PACKET_JSON);
  const specs = readJson(CANDIDATE_SPECS_JSON);
  const cliPlan = readJson(CLI_PLAN_JSON);
  const generatorBlock = readJson(GENERATOR_BLOCK_JSON);
  const rx1Closure = readJson(RX1_CLOSURE);
  const rx2bResult = readJson(RX2B_RESULT);
  const rx3bResult = readJson(RX3B_RESULT);
  const pvClosure = readJson(PV_G1_CLOSURE);
  const inventory = readJson(INVENTORY);
  const units = readJson(UNITS_PATH);
  const unitIds = new Set(units.map((unit) => unit.id));

  assert(rx1Closure.status === 'pass_with_conditions', 'RX.1 gate must be closed as pass_with_conditions');
  assert(rx1Closure.accepted_outcomes.includes('A82 and A84 may move earlier than the full producer-graph lane.'), 'RX.1 closure must allow A82/A84 earlier');
  assert(rx1Closure.blocked_outcomes.includes('Do not mutate A83 until graph/source-value readiness is confirmed.'), 'RX.1 closure must keep A83 conditional');
  assert(rx2bResult.status === 'completed', 'RX.2b must be completed before RX.4');
  containsAll(rx2bResult.units_added, ['A63'], 'RX.2b units_added');
  assert(rx3bResult.status === 'completed', 'RX.3b must be completed before RX.4');
  assert(pvClosure.status === 'pass', 'PV-G1 schema closure must pass before RX.4');

  for (const dep of REQUIRED_DEPS) {
    assert(unitIds.has(dep), `required live dependency missing: ${dep}`);
  }
  for (const id of DUPLICATE_AUDIT_IDS) {
    assert(unitIds.has(id), `duplicate-audit reference unit missing: ${id}`);
  }
  for (const id of CANDIDATES) {
    assert(!unitIds.has(id), `${id} already exists; live numbering plan must be revised`);
  }

  const inventoryRecords = new Map(inventory.records.map((record) => [record.candidate_unit_id, record]));
  for (const id of CANDIDATES) {
    assert(inventoryRecords.has(id), `RX.1 inventory missing ${id}`);
    assert(inventoryRecords.get(id).mutation_authorized === false, `${id} inventory record must not authorize mutation`);
  }

  assert(packet.gate_id === 'GATE-RX4-elasticity-market-diagram-review', 'wrong packet gate_id');
  assert(packet.sprint_id === 'RX.4', 'wrong packet sprint_id');
  assert(packet.status === 'prepared_for_human_review', 'packet must stop at prepared_for_human_review');
  assert(packet.cli_unit_mutation_authorized === false, 'packet must not authorize CLI mutation yet');
  sameArray(packet.summary.candidate_ids, CANDIDATES, 'packet candidate ids');
  sameArray(packet.summary.lower_risk_first_lane, LOWER_RISK, 'packet lower-risk lane');
  sameArray(packet.summary.conditional_graph_lane, CONDITIONAL_GRAPH, 'packet conditional graph lane');
  assert(Array.isArray(packet.review_questions) && packet.review_questions.length >= 9, 'packet must list RX4-Q1 through RX4-Q9');

  assert(specs.status === 'prepared_for_mutation_review', 'candidate specs must be prepared_for_mutation_review');
  assert(specs.policy.mutation_authorized === false, 'candidate specs must not authorize mutation');
  assert(specs.policy.cli_execution_authorized === false, 'candidate specs must not authorize CLI execution');
  sameArray(specs.policy.lower_risk_first_lane, LOWER_RISK, 'candidate lower-risk lane');
  sameArray(specs.policy.conditional_graph_lane, CONDITIONAL_GRAPH, 'candidate conditional graph lane');
  containsAll(specs.market_welfare_duplicate_audit.existing_surplus_welfare_units, ['A19', 'A32', 'A40', 'D39', 'D40'], 'market/welfare audit');
  containsAll(specs.market_welfare_duplicate_audit.existing_intervention_graph_units, ['A51', 'A56', 'A59'], 'intervention audit');
  assert(specs.market_welfare_duplicate_audit.decision_for_this_gate === 'hold_new_market_welfare_units', 'market/welfare audit must hold new units');

  const specById = new Map(specs.candidates.map((candidate) => [candidate.candidate_id, candidate]));
  for (const id of CANDIDATES) {
    assert(specById.has(id), `missing candidate spec ${id}`);
    const spec = specById.get(id).rx4_draft_spec;
    assert(spec.id === id, `${id} draft spec id mismatch`);
    assert(spec.generator === `GEN_${id}`, `${id} must track missing generator GEN_${id}`);
    sameArray(spec.needs, EXPECTED_NEEDS[id], `${id} draft needs`);
    assert(Array.isArray(spec.procedure) && spec.procedure.length >= 6, `${id} must include a teachable procedure`);
    const procedureText = spec.procedure.join(' ').toLowerCase();
    assert(procedureText.includes('procentuele'), `${id} procedure must mention percentage changes`);
    assert(procedureText.includes('teken') || procedureText.includes('absolute waarde'), `${id} procedure must preserve sign or absolute-value interpretation`);
  }
  assert(specById.get('A83').naming_evidence_question, 'A83 must carry explicit naming/evidence question');

  assert(cliPlan.status === 'draft_pending_human_review', 'CLI plan must be draft_pending_human_review');
  assert(cliPlan.execution_authorized === false, 'CLI plan must not authorize execution');
  assert(cliPlan.mutation_authorized === false, 'CLI plan must not authorize mutation');
  sameArray(cliPlan.lower_risk_first_lane_order, LOWER_RISK, 'CLI lower-risk order');
  sameArray(cliPlan.conditional_graph_lane, CONDITIONAL_GRAPH, 'CLI conditional graph lane');
  for (const step of cliPlan.ordered_steps) {
    assert(step.execution_authorized === false, `${step.candidate_id} execution must be false`);
    assert(step.command_template.includes('unit-add.js'), `${step.candidate_id} command must use unit-add.js`);
  }

  sameArray(generatorBlock.generator_blocked_units, CANDIDATES, 'generator blocked units');
  assert(generatorBlock.student_facing_use_authorized === false, 'student-facing use must stay blocked');
  assert(generatorBlock.pv_projection_authorized === false, 'PV projection must stay blocked');

  const packetMd = fs.readFileSync(repoPath(PACKET_MD), 'utf8');
  for (const question of packet.review_questions) {
    assert(packetMd.includes(question.id), `Markdown packet missing ${question.id}`);
  }
  assert(packetMd.includes('No CLI mutation is authorized'), 'review packet must state no CLI mutation is authorized');
  assert(packetMd.includes('PV And Graph Constraints'), 'review packet must include PV graph constraints');

  const specMd = fs.readFileSync(repoPath(CANDIDATE_SPECS_MD), 'utf8');
  const planMd = fs.readFileSync(repoPath(CLI_PLAN_MD), 'utf8');
  for (const id of CANDIDATES) {
    assert(specMd.includes(id), `candidate specs Markdown missing ${id}`);
    assert(planMd.includes(id), `CLI plan Markdown missing ${id}`);
  }
  assert(specMd.includes('A19') && specMd.includes('A59'), 'candidate specs Markdown must mention duplicate audit references');

  console.log(`OK RX.4 elasticity market-diagram review: ${CANDIDATES.join(', ')} prepared, execution blocked`);
}

if (require.main === module) main();
