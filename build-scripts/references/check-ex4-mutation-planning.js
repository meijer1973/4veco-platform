#!/usr/bin/env node
/**
 * check-ex4-mutation-planning.js
 *
 * Validates the EX-4 mutation-planning packet. This checker is read-only: it
 * proves that EX-4 is a planning/human-review packet and not a mutation lane.
 *
 * HOW TO ADAPT:
 * - Keep mutation and product-use flags false unless a later human-reviewed
 *   sprint deliberately creates a different checker for execution.
 * - Add new lane checks here when future EX gates add reviewed candidates.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const GATE_DIR = 'reports/review-gates/GATE-EX4-mutation-planning';

const CANDIDATES_JSON = `${GATE_DIR}/mutation-candidates.json`;
const CANDIDATES_MD = `${GATE_DIR}/mutation-candidates.md`;
const CLI_JSON = `${GATE_DIR}/cli-readiness-plan.json`;
const CLI_MD = `${GATE_DIR}/cli-readiness-plan.md`;
const REVIEW_JSON = `${GATE_DIR}/review-packet.json`;
const REVIEW_MD = `${GATE_DIR}/review-packet.md`;
const COVERAGE_JSON = 'reports/json/exam-ingestion-coverage.json';
const EX2_CLOSURE_JSON = 'reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json';

const BLOCKED_OUTCOMES = [
  'protected reference mutation',
  'external-source mutation',
  'machine-reference mutation',
  'unit minting',
  'operation-registry mutation',
  'answer-skill mutation',
  'target-exercise promotion',
  'lesson-output mutation',
  'CP-6 closure',
  'Year-1 closure',
  'student diagnostics',
  'adaptive routing',
  'student-facing AI',
  'summative use',
  'PV projection',
  'PV machine promotion',
  'student-facing output',
];

function fail(message) {
  console.error(`EX-4 mutation-planning check failed: ${message}`);
  process.exit(1);
}

function file(relPath) {
  return path.join(ROOT, relPath);
}

function read(relPath) {
  const full = file(relPath);
  if (!fs.existsSync(full)) fail(`missing ${relPath}`);
  return fs.readFileSync(full, 'utf8');
}

function readJson(relPath) {
  try {
    return JSON.parse(read(relPath));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function assertArray(value, label) {
  assert(Array.isArray(value), `${label} must be an array`);
}

function assertIncludes(list, expected, label) {
  assertArray(list, label);
  for (const item of expected) {
    assert(list.includes(item), `${label} missing ${item}`);
  }
}

function assertTextIncludes(text, needle, label) {
  assert(text.includes(needle), `${label} missing "${needle}"`);
}

function byLane(candidates, laneId) {
  const lane = (candidates.candidate_lanes || []).find((item) => item.lane_id === laneId);
  assert(lane, `missing lane ${laneId}`);
  return lane;
}

function assertNoMutationBoundary(record, label) {
  const fields = [
    'protected_reference_mutation_authorized',
    'external_source_mutation_authorized',
    'machine_reference_mutation_authorized',
    'unit_minting_authorized',
    'operation_registry_mutation_authorized',
    'answer_skill_mutation_authorized',
    'target_exercise_promotion_authorized',
    'lesson_output_mutation_authorized',
    'student_product_use_authorized',
  ];
  for (const field of fields) {
    if (field in record) assert(record[field] === false, `${label}.${field} must be false`);
  }
}

function checkCandidates() {
  const candidates = readJson(CANDIDATES_JSON);
  const markdown = read(CANDIDATES_MD);

  assert(candidates.schema_version === 1, 'candidate schema_version');
  assert(candidates.gate_id === 'GATE-EX4-mutation-planning', 'candidate gate_id');
  assert(candidates.sprint_id === 'EX-4', 'candidate sprint_id');
  assert(candidates.status === 'prepared_for_human_authorization_review', 'candidate status');
  assert(candidates.protected_reference_data_changed === false, 'candidate protected_reference_data_changed');
  assert(candidates.mutation_authorized === false, 'candidate mutation_authorized');
  assert(candidates.cli_execution_authorized === false, 'candidate cli_execution_authorized');
  assertNoMutationBoundary(candidates.authority_boundary || {}, 'candidate authority_boundary');
  assertArray(candidates.candidate_lanes, 'candidate_lanes');
  assert(candidates.candidate_lanes.length >= 6, 'candidate_lanes length');

  for (const lane of candidates.candidate_lanes) {
    assert(lane.direct_mutation_ready === false, `${lane.lane_id} direct_mutation_ready`);
    assert(lane.requires_human_authorization === true, `${lane.lane_id} requires_human_authorization`);
    assert(lane.requires_cli_or_validator_work === true, `${lane.lane_id} requires_cli_or_validator_work`);
    assert(lane.mutation_authorized === false, `${lane.lane_id} mutation_authorized`);
    assert(lane.student_product_use_authorized === false, `${lane.lane_id} student_product_use_authorized`);
  }

  const q3Calc = byLane(candidates, 'EX4-L1-q3-annual-threshold-operation');
  assert(q3Calc.reviewed_classification === 'operation_registry_need', 'q3 calc classification');
  assertIncludes(q3Calc.source_requirement_ids, ['q3-calc-1'], 'q3 calc requirement ids');
  assertIncludes(q3Calc.supporting_unit_ids, ['A61'], 'q3 calc supporting units');
  assertIncludes(q3Calc.stale_or_rejected_unit_ids, ['A15'], 'q3 calc stale/rejected units');

  const q3Answer = byLane(candidates, 'EX4-L2-q3-threshold-answer-skill');
  assert(q3Answer.reviewed_classification === 'answer_skill_need', 'q3 answer classification');
  assertIncludes(q3Answer.source_requirement_ids, ['q3-answer-1'], 'q3 answer requirement ids');

  const q19Extraction = byLane(candidates, 'EX4-L3-q19-source-annex-extraction');
  assert(q19Extraction.reviewed_classification === 'blocking_source_and_graph_gap', 'q19 extraction classification');
  assertIncludes(q19Extraction.blocking_gap_ids, ['q19-source-annex-gap', 'q19-graph-object-gap'], 'q19 extraction blocking gaps');
  assertIncludes(q19Extraction.blocked_by, ['q19-source-annex-gap', 'q19-graph-object-gap'], 'q19 extraction blocked_by');

  const q19Graph = byLane(candidates, 'EX4-L4-q19-graph-pv-route');
  assert(q19Graph.reviewed_classification === 'existing_mtu_but_procedure_too_weak_plus_pv_graph_need', 'q19 graph classification');
  assertIncludes(q19Graph.supporting_unit_ids, ['A42', 'D10'], 'q19 graph supporting units');
  assertIncludes(q19Graph.weak_or_prerequisite_unit_ids, ['A45'], 'q19 graph weak units');
  assertIncludes(q19Graph.blocking_gap_ids, ['q19-source-annex-gap', 'q19-graph-object-gap'], 'q19 graph blocking gaps');

  const q19Reason = byLane(candidates, 'EX4-L5-q19-chained-market-reasoning');
  assert(q19Reason.reviewed_classification === 'operation_registry_need', 'q19 reason classification');
  assertIncludes(q19Reason.partial_support_unit_ids, ['D10', 'D13'], 'q19 reason partial support');
  assertIncludes(q19Reason.blocking_gap_ids, ['q19-source-annex-gap', 'q19-graph-object-gap'], 'q19 reason blocking gaps');

  const q15Answer = byLane(candidates, 'EX4-L6-q15-two-step-answer-skill');
  assert(q15Answer.reviewed_classification === 'answer_skill_need', 'q15 answer classification');
  assertIncludes(q15Answer.source_requirement_ids, ['q15-answer-1'], 'q15 answer requirement ids');
  assertIncludes(q15Answer.content_support_unit_ids, ['D27', 'F03', 'F09'], 'q15 answer content support');
  assert(q15Answer.coverage_scope === 'answer_skill_only_content_already_mapped', 'q15 answer coverage scope');

  const q15Content = (candidates.non_candidate_records || []).find((item) => item.requirement_id === 'q15-content');
  assert(q15Content, 'q15 content non-candidate record');
  assert(q15Content.classification === 'existing_mtu', 'q15 content classification');
  assert(q15Content.coverage_scope === 'content_only', 'q15 content coverage scope');
  assert(q15Content.mutation_candidate === false, 'q15 content mutation_candidate');
  assertIncludes(q15Content.accepted_unit_ids, ['D27', 'F03', 'F09'], 'q15 content accepted units');

  for (const needle of [
    'A61',
    'A15',
    'A42',
    'A45',
    'q19-source-annex-gap',
    'q15-answer-1',
    'No protected reference mutation',
  ]) {
    assertTextIncludes(markdown, needle, 'candidate markdown');
  }
}

function checkCliPlan() {
  const plan = readJson(CLI_JSON);
  const markdown = read(CLI_MD);

  assert(plan.schema_version === 1, 'CLI plan schema_version');
  assert(plan.gate_id === 'GATE-EX4-mutation-planning', 'CLI plan gate_id');
  assert(plan.sprint_id === 'EX-4', 'CLI plan sprint_id');
  assert(plan.status === 'disabled_pending_human_authorization', 'CLI plan status');
  assert(plan.execution_authorized === false, 'CLI plan execution_authorized');
  assert(plan.cli_execution_authorized === false, 'CLI plan cli_execution_authorized');
  assert(plan.protected_reference_data_changed === false, 'CLI plan protected_reference_data_changed');
  assert(plan.current_cli_readiness.operation_registry_cli_exists === false, 'operation registry CLI must not be ready');
  assert(plan.current_cli_readiness.answer_skill_registry_cli_exists === false, 'answer skill registry CLI must not be ready');
  assert(plan.current_cli_readiness.source_annex_extraction_validator_exists_for_q19 === false, 'q19 extraction validator must not be ready');
  assert(plan.current_cli_readiness.lesson_output_mutation_allowed === false, 'lesson output mutation must be disallowed');
  assertArray(plan.preconditions_before_any_mutation, 'preconditions_before_any_mutation');
  assert(plan.preconditions_before_any_mutation.length >= 6, 'precondition count');
  assertArray(plan.lane_readiness, 'lane_readiness');
  assert(plan.lane_readiness.length >= 6, 'lane_readiness count');
  assertArray(plan.forbidden_execution, 'forbidden_execution');
  for (const forbidden of [
    'Do not run unit-add.js from EX-4.',
    'Do not mutate references/data/skill-operation-registry.json.',
    'Do not mutate references/external/.',
    'Do not hand-edit references/machine/.',
    'Do not mutate lesson output.',
    'Do not authorize student/product use.',
  ]) {
    assert(plan.forbidden_execution.includes(forbidden), `forbidden_execution missing ${forbidden}`);
  }
  assert(!('command_templates' in plan), 'CLI plan must not expose executable command_templates');

  for (const needle of [
    'Execution authorized: no',
    'q19 graph/PV or reasoning mutation must stay blocked',
    'Operation-registry CLI exists | false',
    'Answer-skill registry CLI exists | false',
    'Do not mutate lesson output',
  ]) {
    assertTextIncludes(markdown, needle, 'CLI markdown');
  }
}

function checkReviewPacket() {
  const packet = readJson(REVIEW_JSON);
  const markdown = read(REVIEW_MD);

  assert(packet.schema_version === 1, 'review packet schema_version');
  assert(packet.gate_id === 'GATE-EX4-mutation-planning', 'review packet gate_id');
  assert(packet.sprint_id === 'EX-4', 'review packet sprint_id');
  assert(packet.status === 'review_packet_ready_no_mutation_authorized', 'review packet status');
  assert(packet.protected_reference_data_changed === false, 'review packet protected_reference_data_changed');
  assert(packet.external_source_mutation_authorized === false, 'review packet external_source_mutation_authorized');
  assert(packet.machine_reference_mutation_authorized === false, 'review packet machine_reference_mutation_authorized');
  assert(packet.unit_minting_authorized === false, 'review packet unit_minting_authorized');
  assert(packet.operation_registry_mutation_authorized === false, 'review packet operation_registry_mutation_authorized');
  assert(packet.answer_skill_mutation_authorized === false, 'review packet answer_skill_mutation_authorized');
  assert(packet.target_exercise_promotion_authorized === false, 'review packet target_exercise_promotion_authorized');
  assert(packet.lesson_output_mutation_authorized === false, 'review packet lesson_output_mutation_authorized');
  assert(packet.cp6_closed === false, 'review packet cp6_closed');
  assert(packet.year1_closed === false, 'review packet year1_closed');
  assert(packet.human_interview_completed === false, 'review packet human_interview_completed');
  assert(packet.gate_closure_completed === false, 'review packet gate_closure_completed');
  assertArray(packet.review_questions, 'review questions');
  assert(packet.review_questions.length === 10, 'review packet must contain 10 questions');
  for (const question of packet.review_questions) {
    assert(question.open_answer_allowed === true, `${question.id} must allow open answer`);
    assertArray(question.options, `${question.id} options`);
    assert(question.options.length >= 4, `${question.id} must include three choices plus open answer`);
  }
  assertArray(packet.future_interview_protocol, 'future_interview_protocol');
  assert(packet.future_interview_protocol.length >= 7, 'future interview protocol count');
  assertArray(packet.blocked_outcomes, 'blocked_outcomes');
  for (const outcome of BLOCKED_OUTCOMES) {
    assert(packet.blocked_outcomes.includes(outcome), `blocked_outcomes missing ${outcome}`);
  }

  for (const needle of [
    'Full Planned Review Questions',
    'Future Interview Protocol',
    'Current Stop Conditions',
    'Run the formal GATE-EX4 human review',
    'No protected reference mutation authorized',
    'q19-source-annex-gap',
    'q15-answer-1',
  ]) {
    assertTextIncludes(markdown, needle, 'review packet markdown');
  }
}

function checkUpstreamEvidence() {
  const coverage = readJson(COVERAGE_JSON);
  const ex2 = readJson(EX2_CLOSURE_JSON);
  assert(coverage.report_id === 'exam-ingestion-coverage', 'coverage report_id');
  assert(coverage.status === 'warn', 'coverage must still warn while q19 is blocked');
  assert(coverage.summary && coverage.summary.blocked_item_count === 1, 'coverage blocked item count');
  assert(coverage.summary && coverage.summary.blocking_gap_count === 2, 'coverage blocking gap count');
  assert(coverage.summary && coverage.summary.operation_registry_mutation_authorized === false, 'coverage operation mutation flag');
  assert(coverage.summary && coverage.summary.answer_skill_mutation_authorized === false, 'coverage answer mutation flag');
  assert(ex2.status === 'pass_with_conditions', 'EX2 gate closure status');
  assert(ex2.decision_scope === 'classification_and_routing_only', 'EX2 closure decision scope');
  assert(ex2.allowed_next_sprint === 'EX-3', 'EX2 allowed_next_sprint should remain EX-3');
}

function main() {
  checkUpstreamEvidence();
  checkCandidates();
  checkCliPlan();
  checkReviewPacket();
  console.log('OK EX-4 mutation-planning packet');
}

if (require.main === module) main();
