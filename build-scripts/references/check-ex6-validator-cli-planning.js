#!/usr/bin/env node
/**
 * check-ex6-validator-cli-planning.js
 *
 * Validates the EX-6 validator/CLI planning bundle. This checker is read-only:
 * it proves that EX-6 created schemas, an implementation plan, and a GATE-EX6
 * review packet without creating candidate storage, mutation CLIs, or q19
 * extraction execution.
 *
 * HOW TO ADAPT:
 * - Keep this checker strict while EX-6 remains planning-only.
 * - If a later gate authorizes implementation, create a separate checker for
 *   that gate instead of weakening the no-write assertions here.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const SCHEMAS = [
  'references/schemas/operation-candidates.schema.json',
  'references/schemas/answer-skill-candidates.schema.json',
  'references/schemas/source-annex-extraction-overlays.schema.json',
];

const PLAN_JSON = 'references/data/exam-ingestion/validator-cli-implementation-plan.json';
const PLAN_MD = 'references/data/exam-ingestion/validator-cli-implementation-plan.md';
const EX5_CLOSURE = 'reports/review-gates/GATE-EX5-operation-answer-skill-contract/gate-closure.json';
const EX5_CONTRACT = 'references/data/exam-ingestion/operation-answer-skill-contract.json';
const GATE_DIR = 'reports/review-gates/GATE-EX6-validator-cli-planning';
const REVIEW_JSON = `${GATE_DIR}/review-packet.json`;
const REVIEW_MD = `${GATE_DIR}/review-packet.md`;

const FUTURE_STORAGE = [
  'references/data/exam-ingestion/operation-candidates.json',
  'references/data/exam-ingestion/answer-skill-candidates.json',
  'references/data/exam-ingestion/source-annex-extraction-overlays.json',
];

const FUTURE_CLIS = [
  'build-scripts/references/operation-candidate-add.js',
  'build-scripts/references/answer-skill-candidate-add.js',
  'build-scripts/references/source-annex-extraction-add.js',
];

const FUTURE_VALIDATORS = [
  'build-scripts/references/check-operation-answer-skill-candidates.js',
  'build-scripts/references/check-source-annex-extraction-overlays.js',
];

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

const REQUIRED_REJECTION_RULES = [
  'A15 reused as q3 annual threshold support',
  'A45 treated as primary q19 graph-shift support',
  'q19 graph/PV or reasoning records marked ready while q19-source-annex-gap or q19-graph-object-gap remains unresolved',
  'q3 threshold wording hidden inside calculation procedure only',
  'q15 two-step correction-model explanation hidden inside content MTUs only',
];

function fail(message) {
  console.error(`EX-6 validator/CLI planning check failed: ${message}`);
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

function assertAbsent(relPaths, label) {
  const existing = relPaths.filter((relPath) => fs.existsSync(file(relPath)));
  assert(existing.length === 0, `${label} must not exist in EX-6: ${existing.join(', ')}`);
}

function checkGateAuthority() {
  const closure = readJson(EX5_CLOSURE);
  const contract = readJson(EX5_CONTRACT);

  assert(closure.status === 'pass_with_conditions', 'GATE-EX5 closure status');
  assert(closure.decision_scope === 'design_contract_review_only', 'GATE-EX5 decision scope');
  assert(closure.allowed_next_sprint === 'EX-6', 'GATE-EX5 must authorize EX-6');
  assert(closure.candidate_storage_authorized === false, 'GATE-EX5 candidate storage boundary');
  assert(closure.q19_extraction_execution_authorized === false, 'GATE-EX5 q19 extraction boundary');
  assert(contract.status === 'design_contract_pending_gate_review', 'EX-5 contract status');
}

function checkNoUnauthorizedArtifacts() {
  assertAbsent(FUTURE_STORAGE, 'future candidate storage');
  assertAbsent(FUTURE_CLIS, 'future mutation CLIs');
  assertAbsent(FUTURE_VALIDATORS, 'future candidate validators');
}

function checkSchema(relPath) {
  const schema = readJson(relPath);
  assert(schema.$schema === 'https://json-schema.org/draft/2020-12/schema', `${relPath} draft marker`);
  assert(schema.type === 'object', `${relPath} root type`);
  assert(schema.additionalProperties === false, `${relPath} additionalProperties false`);
  assert((schema.required || []).includes('authority_boundary'), `${relPath} requires authority_boundary`);

  const boundary = schema.$defs?.authority_boundary?.properties || {};
  for (const field of FALSE_BOUNDARY_FIELDS) {
    assert(boundary[field]?.const === false, `${relPath} authority_boundary.${field} must be const false`);
  }

  const serialized = JSON.stringify(schema);
  for (const needle of [
    'mutation_authorized',
    'student_product_use_authorized',
    'source_exam_item_id',
  ]) {
    assert(serialized.includes(needle), `${relPath} missing ${needle}`);
  }
}

function checkSchemas() {
  for (const relPath of SCHEMAS) checkSchema(relPath);

  const operation = readJson('references/schemas/operation-candidates.schema.json');
  assert(
    JSON.stringify(operation).includes('weak_or_rejected_unit_ids'),
    'operation schema must track weak/rejected unit IDs'
  );
  assert(JSON.stringify(operation).includes('required_steps'), 'operation schema must track required steps');

  const answer = readJson('references/schemas/answer-skill-candidates.schema.json');
  assert(JSON.stringify(answer).includes('rewarded_wording'), 'answer schema must track rewarded wording');
  assert(
    JSON.stringify(answer).includes('correction_model_step_refs'),
    'answer schema must track correction model step refs'
  );

  const extraction = readJson('references/schemas/source-annex-extraction-overlays.schema.json');
  for (const field of [
    'source_page_or_locator',
    'axis_units',
    'scale_or_tick_marks',
    'coordinates_or_reconstructable_geometry',
    'legend_mapping',
    'student_action_regions',
    'worksheet_regions',
    'required_student_marks',
  ]) {
    assert(JSON.stringify(extraction).includes(field), `source extraction schema missing ${field}`);
  }
}

function checkPlan() {
  const plan = readJson(PLAN_JSON);
  const markdown = read(PLAN_MD);

  assert(plan.schema_version === 1, 'plan schema_version');
  assert(plan.plan_id === 'validator-cli-implementation-plan', 'plan_id');
  assert(plan.sprint_id === 'EX-6', 'sprint_id');
  assert(plan.status === 'planning_only_pending_gate_review', 'plan status');
  assertBoundaryFalse(plan.authority_boundary || {}, 'plan authority_boundary');

  assertArray(plan.schema_contracts, 'schema_contracts');
  assert(plan.schema_contracts.length === 3, 'schema_contracts length');
  for (const contract of plan.schema_contracts) {
    assert(contract.future_storage_created_now === false, `${contract.storage_family} storage created`);
    assert(contract.candidate_writes_authorized_now === false, `${contract.storage_family} writes`);
    assert(SCHEMAS.includes(contract.schema_path), `${contract.storage_family} schema path`);
    assert(FUTURE_STORAGE.includes(contract.future_storage_path), `${contract.storage_family} future storage path`);
    if (contract.storage_family === 'source_annex_extraction_overlays') {
      assert(contract.q19_extraction_execution_authorized_now === false, 'q19 extraction execution boundary');
    }
  }

  assertArray(plan.future_validators, 'future_validators');
  for (const validator of plan.future_validators) {
    assert(validator.created_now === false, `${validator.validator_id} created_now`);
    assert(FUTURE_VALIDATORS.includes(validator.future_path), `${validator.validator_id} future path`);
  }

  assertArray(plan.future_dry_run_clis, 'future_dry_run_clis');
  for (const cli of plan.future_dry_run_clis) {
    assert(cli.created_now === false, `${cli.cli_id} created_now`);
    assert(cli.dry_run_required_before_write === true, `${cli.cli_id} dry-run`);
    assert(cli.persistent_write_authorized_now === false, `${cli.cli_id} write boundary`);
    assert(FUTURE_CLIS.includes(cli.future_path), `${cli.cli_id} future path`);
  }

  assertIncludes(plan.validator_must_reject, REQUIRED_REJECTION_RULES, 'validator_must_reject');
  assert(plan.dry_run_fixture_policy.non_persistent_only === true, 'dry-run fixture non-persistent');
  assert(plan.dry_run_fixture_policy.test_only === true, 'dry-run fixture test only');
  assertIncludes(
    plan.dry_run_fixture_policy.forbidden_locations,
    FUTURE_STORAGE,
    'dry-run forbidden locations'
  );
  assert(plan.rollback_contract.required_before_any_future_write === true, 'rollback required');
  assert(plan.audit_contract.required_before_any_future_write === true, 'audit required');

  const guardrailText = JSON.stringify(plan.routing_guardrails || []);
  for (const needle of ['q3-calc-1', 'A61', 'A15', 'q19-graph-op-1', 'A42', 'A45', 'q15-answer-1']) {
    assert(guardrailText.includes(needle), `routing guardrails missing ${needle}`);
  }
  assert(plan.next_gate?.gate_id === 'GATE-EX6-validator-cli-planning', 'next gate id');

  for (const needle of [
    'planning-only pending GATE-EX6 review',
    'Future Storage Contracts',
    'future storage not created',
    'A15',
    'A45',
    'q19-source-annex-gap',
    'q15-answer-1',
    'Run `GATE-EX6-validator-cli-planning`',
  ]) {
    assertTextIncludes(markdown, needle, 'plan markdown');
  }
}

function checkReviewPacket() {
  const packet = readJson(REVIEW_JSON);
  const markdown = read(REVIEW_MD);

  assert(packet.schema_version === 1, 'review packet schema_version');
  assert(packet.gate_id === 'GATE-EX6-validator-cli-planning', 'review packet gate_id');
  assert(packet.sprint_id === 'EX-6', 'review packet sprint_id');
  assert(packet.status === 'review_packet_ready_no_implementation_authorized', 'review packet status');
  assert(packet.human_interview_completed === false, 'human interview boundary');
  assert(packet.gate_closure_completed === false, 'gate closure boundary');
  assertBoundaryFalse(packet.authority_boundary || {}, 'review packet authority_boundary');
  assertArray(packet.review_questions, 'review_questions');
  assert(packet.review_questions.length >= 8, 'review packet must include at least 8 questions');
  for (const question of packet.review_questions) {
    assert(question.open_answer_allowed === true, `${question.id} open answer`);
    assertArray(question.options, `${question.id} options`);
    assert(question.options.length >= 4, `${question.id} must include open answer option`);
  }
  assertIncludes(packet.blocked_outcomes, [
    'candidate-storage creation',
    'candidate writes',
    'q19 extraction execution',
    'protected reference mutation',
    'student/product use',
  ], 'review packet blocked outcomes');

  for (const expected of [
    'Show the full question list before starting.',
    'Ask calibration questions before taking binding answers.',
    'Ask one question at a time.',
    'Record each answer before asking the next question.',
    'Require explicit human confirmation before writing a gate closure record or authorizing downstream sprint scope.',
  ]) {
    assert(packet.future_interview_protocol.includes(expected), `future protocol missing ${expected}`);
  }

  for (const needle of [
    'Full Planned Review Questions',
    'Calibration Questions',
    'Current Stop Conditions',
    'No protected reference mutation authorized',
    'q19-source-annex-gap',
    'A15',
    'A45',
    'Run the formal GATE-EX6 human review',
  ]) {
    assertTextIncludes(markdown, needle, 'review packet markdown');
  }
}

function main() {
  checkGateAuthority();
  checkNoUnauthorizedArtifacts();
  checkSchemas();
  checkPlan();
  checkReviewPacket();
  console.log('OK EX-6 validator/CLI planning');
}

if (require.main === module) main();
