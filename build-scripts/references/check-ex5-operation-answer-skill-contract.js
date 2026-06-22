#!/usr/bin/env node
/**
 * check-ex5-operation-answer-skill-contract.js
 *
 * Validates the EX-5 operation/answer-skill design contract. This checker is
 * read-only: it proves that EX-5 created a contract and GATE packet, not
 * operation records, answer-skill records, q19 extraction records, or mutation
 * tooling.
 *
 * HOW TO ADAPT:
 * - Keep mutation and product-use flags false until a later human-reviewed
 *   sprint deliberately creates a different execution checker.
 * - If future candidate-storage files are added after GATE-EX5, update this
 *   checker to require that gate's explicit closure and the future validators.
 */

const fs = require('fs');
const path = require('path');
const {
  assertBlockedSourceAnnexStorage,
} = require('./lib/exam-ingestion-candidate-validation');

const ROOT = path.resolve(__dirname, '..', '..');

const SCHEMA = 'references/schemas/operation-answer-skill-contract.schema.json';
const CONTRACT_JSON = 'references/data/exam-ingestion/operation-answer-skill-contract.json';
const CONTRACT_MD = 'references/data/exam-ingestion/operation-answer-skill-contract.md';
const GATE_DIR = 'reports/review-gates/GATE-EX5-operation-answer-skill-contract';
const REVIEW_JSON = `${GATE_DIR}/review-packet.json`;
const REVIEW_MD = `${GATE_DIR}/review-packet.md`;
const GATE_CLOSURE = `${GATE_DIR}/gate-closure.json`;
const EX4_CLOSURE = 'reports/review-gates/GATE-EX4-mutation-planning/gate-closure.json';
const EX4_CANDIDATES = 'reports/review-gates/GATE-EX4-mutation-planning/mutation-candidates.json';
const EX4_READINESS = 'reports/review-gates/GATE-EX4-mutation-planning/cli-readiness-plan.json';

const FUTURE_STORAGE = [
  'references/data/exam-ingestion/operation-candidates.json',
  'references/data/exam-ingestion/answer-skill-candidates.json',
  'references/data/exam-ingestion/source-annex-extraction-overlays.json',
];
const SOURCE_ANNEX_STORAGE = 'references/data/exam-ingestion/source-annex-extraction-overlays.json';

const FALSE_BOUNDARY_FIELDS = [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'unit_minting_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_mutation_authorized',
  'source_annex_extraction_execution_authorized',
  'pv_graph_mutation_authorized',
  'target_exercise_promotion_authorized',
  'lesson_output_mutation_authorized',
  'cp6_closure_authorized',
  'year1_closure_authorized',
  'student_product_use_authorized',
];

const BLOCKED_OUTCOMES = [
  'protected reference mutation',
  'external-source mutation',
  'machine-reference mutation',
  'unit minting',
  'operation-registry mutation',
  'answer-skill mutation',
  'q19 source-annex extraction execution',
  'PV/graph mutation',
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
  console.error(`EX-5 operation/answer-skill contract check failed: ${message}`);
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

function assertBoundaryFalse(record, label) {
  for (const field of FALSE_BOUNDARY_FIELDS) {
    assert(record[field] === false, `${label}.${field} must be false`);
  }
}

function byRequirement(contract, requirementId) {
  const fact = (contract.candidate_routing_facts || []).find(
    (item) => item.requirement_id === requirementId
  );
  assert(fact, `missing routing fact ${requirementId}`);
  return fact;
}

function checkSchema() {
  const schema = readJson(SCHEMA);
  assert(schema.$schema === 'https://json-schema.org/draft/2020-12/schema', 'schema draft marker');
  assert(schema.$id && schema.$id.includes('operation-answer-skill-contract.schema.json'), 'schema $id');
  assert(schema.type === 'object', 'schema root type');
  assert(schema.additionalProperties === false, 'schema additionalProperties false');
  for (const field of [
    'authority_boundary',
    'storage_contracts',
    'q19_extraction_contract',
    'validator_cli_contract',
    'rollback_contract',
    'audit_contract',
    'candidate_routing_facts',
    'gate_review_requirements',
    'blocked_outcomes',
  ]) {
    assert((schema.required || []).includes(field), `schema must require ${field}`);
  }
  const boundary = schema.$defs?.authority_boundary?.properties || {};
  for (const field of FALSE_BOUNDARY_FIELDS) {
    assert(boundary[field]?.const === false, `schema authority_boundary.${field} must be const false`);
  }
}

function checkUpstreamEvidence() {
  const closure = readJson(EX4_CLOSURE);
  const candidates = readJson(EX4_CANDIDATES);
  const readiness = readJson(EX4_READINESS);

  assert(closure.status === 'pass_with_conditions', 'GATE-EX4 closure status');
  assert(closure.allowed_next_sprint === 'EX-5', 'GATE-EX4 must authorize EX-5');
  assert(closure.decision_scope === 'routing_and_design_only', 'GATE-EX4 decision scope');
  assert(readiness.execution_authorized === false, 'EX4 readiness execution_authorized');
  assert(readiness.current_cli_readiness.operation_registry_cli_exists === false, 'operation CLI must be absent at EX4');
  assert(readiness.current_cli_readiness.answer_skill_registry_cli_exists === false, 'answer skill CLI must be absent at EX4');
  assert(
    readiness.current_cli_readiness.source_annex_extraction_validator_exists_for_q19 === false,
    'q19 extraction validator must be absent at EX4'
  );

  const laneIds = new Set((candidates.candidate_lanes || []).map((lane) => lane.lane_id));
  for (const laneId of [
    'EX4-L1-q3-annual-threshold-operation',
    'EX4-L2-q3-threshold-answer-skill',
    'EX4-L3-q19-source-annex-extraction',
    'EX4-L4-q19-graph-pv-route',
    'EX4-L5-q19-chained-market-reasoning',
    'EX4-L6-q15-two-step-answer-skill',
  ]) {
    assert(laneIds.has(laneId), `EX4 candidates missing ${laneId}`);
  }
}

function checkFutureStorageNotCreated() {
  const existing = FUTURE_STORAGE.filter((relPath) => fs.existsSync(file(relPath)));
  const disallowed = existing.filter((relPath) => relPath !== SOURCE_ANNEX_STORAGE);
  assert(disallowed.length === 0, `operation/answer candidate storage must not exist: ${disallowed.join(', ')}`);

  if (existing.includes(SOURCE_ANNEX_STORAGE)) {
    const doc = readJson(SOURCE_ANNEX_STORAGE);
    assertBlockedSourceAnnexStorage(doc, SOURCE_ANNEX_STORAGE);
  }
}

function checkContract() {
  const contract = readJson(CONTRACT_JSON);
  const markdown = read(CONTRACT_MD);

  assert(contract.schema_version === 1, 'contract schema_version');
  assert(contract.contract_id === 'operation-answer-skill-contract', 'contract_id');
  assert(contract.sprint_id === 'EX-5', 'sprint_id');
  assert(contract.status === 'design_contract_pending_gate_review', 'contract status');
  assertBoundaryFalse(contract.authority_boundary || {}, 'authority_boundary');

  const operation = contract.storage_contracts?.operation_candidates;
  const answer = contract.storage_contracts?.answer_skill_candidates;
  assert(operation?.storage_path === 'references/data/exam-ingestion/operation-candidates.json', 'operation storage path');
  assert(answer?.storage_path === 'references/data/exam-ingestion/answer-skill-candidates.json', 'answer storage path');
  for (const [label, storage] of [
    ['operation', operation],
    ['answer', answer],
  ]) {
    assert(storage.storage_status === 'future_storage_not_created', `${label} storage status`);
    assert(storage.creation_authorized_now === false, `${label} creation_authorized_now`);
    assert(storage.write_authorized_now === false, `${label} write_authorized_now`);
    assert(storage.schema_required_before_write === true, `${label} schema_required`);
    assert(storage.validator_required_before_write === true, `${label} validator_required`);
    assert(storage.cli_required_before_write === true, `${label} cli_required`);
    assert(storage.rollback_required_before_write === true, `${label} rollback_required`);
    assert(storage.audit_log_required_before_write === true, `${label} audit_required`);
    assertIncludes(storage.forbidden_record_fields, ['mastery_decision', 'adaptive_route'], `${label} forbidden fields`);
  }
  assertIncludes(operation.required_record_fields, ['operation_id', 'required_steps', 'mutation_authorized'], 'operation required fields');
  assertIncludes(answer.required_record_fields, ['answer_skill_id', 'rewarded_wording', 'mutation_authorized'], 'answer required fields');

  const q19 = contract.q19_extraction_contract;
  assert(q19.storage_path === 'references/data/exam-ingestion/source-annex-extraction-overlays.json', 'q19 storage path');
  assert(q19.execution_authorized_now === false, 'q19 execution_authorized_now');
  assert(q19.source_exam_item_id === 'vw-1022-a-25-1-o:opgave-4:question-19', 'q19 source_exam_item_id');
  assertIncludes(q19.blocking_gap_ids, ['q19-source-annex-gap', 'q19-graph-object-gap'], 'q19 blocking gaps');
  assertIncludes(
    q19.required_graph_fields,
    ['axis_labels', 'axis_units', 'scale_or_tick_marks', 'coordinates_or_reconstructable_geometry'],
    'q19 required graph fields'
  );
  assertIncludes(
    q19.blocked_downstream_uses,
    ['lesson_build_handoff', 'pv_projection', 'student_facing_output'],
    'q19 blocked downstream uses'
  );

  const cli = contract.validator_cli_contract;
  assert(cli.implementation_authorized_now === false, 'validator CLI implementation_authorized_now');
  assertIncludes(
    cli.future_validator_paths,
    [
      'build-scripts/references/check-operation-answer-skill-candidates.js',
      'build-scripts/references/check-source-annex-extraction-overlays.js',
    ],
    'future validators'
  );
  assertIncludes(
    cli.validator_must_reject,
    ['A15 reused as q3 annual threshold support', 'A45 treated as primary q19 graph-shift support'],
    'validator rejection rules'
  );
  assertIncludes(cli.cli_must_require, ['read-only dry-run mode', 'mutation log entry'], 'CLI requirements');
  assert(contract.rollback_contract.required_before_any_write === true, 'rollback required');
  assert(contract.audit_contract.required_before_any_write === true, 'audit required');

  const q3Calc = byRequirement(contract, 'q3-calc-1');
  assert(q3Calc.classification === 'operation_registry_design_candidate', 'q3 calc classification');
  assertIncludes(q3Calc.supporting_unit_ids, ['A61'], 'q3 support');
  assertIncludes(q3Calc.rejected_or_weak_unit_ids, ['A15'], 'q3 rejected');

  const q3Answer = byRequirement(contract, 'q3-answer-1');
  assert(q3Answer.classification === 'answer_skill_design_candidate', 'q3 answer classification');
  assert(q3Answer.candidate_record_id === 'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION', 'q3 answer candidate id');

  const q19Graph = byRequirement(contract, 'q19-graph-op-1');
  assertIncludes(q19Graph.supporting_unit_ids, ['A42', 'D10'], 'q19 graph support');
  assertIncludes(q19Graph.rejected_or_weak_unit_ids, ['A45'], 'q19 graph weak support');
  assertIncludes(q19Graph.blocking_gap_ids, ['q19-source-annex-gap', 'q19-graph-object-gap'], 'q19 graph gaps');

  const q19Reason = byRequirement(contract, 'q19-reason-1');
  assert(q19Reason.classification === 'provisional_operation_design_candidate_blocked', 'q19 reason classification');
  assertIncludes(q19Reason.supporting_unit_ids, ['D10', 'D13'], 'q19 reason support');

  const q15Answer = byRequirement(contract, 'q15-answer-1');
  assert(q15Answer.classification === 'answer_skill_design_candidate', 'q15 answer classification');
  assertIncludes(q15Answer.supporting_unit_ids, ['D27', 'F03', 'F09'], 'q15 content support');

  assertIncludes(contract.blocked_outcomes, BLOCKED_OUTCOMES, 'blocked_outcomes');
  assertIncludes(contract.next_allowed_actions, ['Run GATE-EX5 human review.'], 'next_allowed_actions');

  for (const needle of [
    'design contract pending GATE-EX5 review',
    'future storage not created',
    'A61',
    'A15',
    'A42',
    'A45',
    'q19-source-annex-gap',
    'q15-answer-1',
    'Run the formal GATE-EX5 human review',
  ]) {
    assertTextIncludes(markdown, needle, 'contract markdown');
  }
}

function checkReviewPacket() {
  const packet = readJson(REVIEW_JSON);
  const markdown = read(REVIEW_MD);

  assert(packet.schema_version === 1, 'review packet schema_version');
  assert(packet.gate_id === 'GATE-EX5-operation-answer-skill-contract', 'review packet gate_id');
  assert(packet.sprint_id === 'EX-5', 'review packet sprint_id');
  assert(packet.status === 'review_packet_ready_no_mutation_authorized', 'review packet status');
  assertBoundaryFalse(packet.authority_boundary || {}, 'review packet authority_boundary');
  assert(packet.human_interview_completed === false, 'human_interview_completed');
  assert(packet.gate_closure_completed === false, 'gate_closure_completed');
  assertArray(packet.review_questions, 'review_questions');
  assert(packet.review_questions.length >= 8, 'review packet must contain at least 8 questions');
  for (const question of packet.review_questions) {
    assert(question.open_answer_allowed === true, `${question.id} must allow open answer`);
    assertArray(question.options, `${question.id} options`);
    assert(question.options.length >= 4, `${question.id} must include three choices plus open answer`);
  }
  assertArray(packet.future_interview_protocol, 'future_interview_protocol');
  for (const expected of [
    'Show the full question list before starting.',
    'Ask calibration questions before taking binding answers.',
    'Record each answer before asking the next question.',
    'Run pattern analysis after initial answers.',
    'Ask targeted follow-ups for ambiguity or conflicting authority.',
    'Draft a closure proposal only after evidence is complete.',
    'Require explicit human confirmation before writing a gate closure record or authorizing downstream sprint scope.',
  ]) {
    assert(packet.future_interview_protocol.includes(expected), `future_interview_protocol missing ${expected}`);
  }
  assertIncludes(packet.blocked_outcomes, BLOCKED_OUTCOMES, 'review packet blocked_outcomes');

  for (const needle of [
    'Full Planned Review Questions',
    'Calibration Questions',
    'Future Interview Protocol',
    'Current Stop Conditions',
    'Run the formal GATE-EX5 human review',
    'No protected reference mutation authorized',
    'q19-source-annex-gap',
    'q15-answer-1',
  ]) {
    assertTextIncludes(markdown, needle, 'review packet markdown');
  }
}

function main() {
  checkSchema();
  checkUpstreamEvidence();
  checkFutureStorageNotCreated();
  checkContract();
  checkReviewPacket();
  console.log('OK EX-5 operation/answer-skill contract');
}

if (require.main === module) main();
