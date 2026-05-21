#!/usr/bin/env node
/**
 * Validate EX-0 exam-ingestion contract artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this checker read-only.
 * - It validates the EX-0 contract, not future EX-1 pilot overlay records.
 * - When EX-1 creates real overlays, this checker verifies the closed GATE-EX0
 *   authorization and the existence of the separate pilot-overlay validator
 *   rather than weakening this contract check.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const SCHEMA = 'references/schemas/exam-ingestion.schema.json';
const README = 'references/data/exam-ingestion/README.md';
const PROCEDURE = 'references/data/exam-ingestion/review-procedure.md';
const PACKET_MD = 'reports/review-gates/GATE-EX0-exam-ingestion-contract/review-packet.md';
const PACKET_JSON = 'reports/review-gates/GATE-EX0-exam-ingestion-contract/review-packet.json';
const GATE_CLOSURE = 'reports/review-gates/GATE-EX0-exam-ingestion-contract/gate-closure.json';
const PILOT_VALIDATOR = 'build-scripts/references/check-exam-ingestion-pilots.js';

const FORBIDDEN_PILOT_FILES = [
  'references/data/exam-ingestion/exam-item-overlays.json',
  'references/data/exam-ingestion/exam-answer-model-overlays.json',
  'references/data/exam-ingestion/exam-source-annex-overlays.json',
];

function fail(message) {
  console.error(`Exam-ingestion contract check failed: ${message}`);
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

function hasRequired(object, required, label) {
  for (const field of required) {
    assert(object && Object.prototype.hasOwnProperty.call(object, field), `${label} missing ${field}`);
  }
}

function assertIncludes(text, needle, label) {
  assert(text.includes(needle), `${label} missing "${needle}"`);
}

function assertFalseConst(schema, pathLabel, field) {
  const actual = schema.properties?.[field]?.const;
  assert(actual === false, `${pathLabel}.${field} must be const false`);
}

function checkSchema() {
  const schema = readJson(SCHEMA);
  assert(schema.$schema === 'https://json-schema.org/draft/2020-12/schema', 'schema draft marker');
  assert(schema.$id && schema.$id.includes('exam-ingestion.schema.json'), 'schema useful $id');
  assert(schema.type === 'object', 'schema root type');
  assert(schema.additionalProperties === false, 'schema additionalProperties false');
  hasRequired(schema.properties, ['schema_version', 'overlay_id', 'overlay_status', 'authority_boundary', 'records'], 'schema root properties');
  const defs = schema.$defs || {};
  hasRequired(defs, [
    'exam_ingestion_record',
    'source_table',
    'source_figure',
    'source_graph',
    'source_annex',
    'extraction_gap',
    'answer_step',
    'point_rule',
    'accepted_alternative',
    'partial_credit_rule',
    'graph_requirement',
    'decomposition_item',
    'mtu_gap_classification',
  ], 'schema $defs');

  const recordRequired = defs.exam_ingestion_record.required || [];
  for (const field of [
    'prompt_metadata',
    'prompt',
    'source_material',
    'official_answer_model',
    'skill_decomposition',
    'mtu_gap_classification',
    'lesson_build_handoff',
    'product_boundary',
  ]) {
    assert(recordRequired.includes(field), `exam_ingestion_record must require ${field}`);
  }

  const answerModelRequired = defs.exam_ingestion_record.properties.official_answer_model.required || [];
  for (const field of [
    'answer_steps',
    'point_rules',
    'mandatory_terms',
    'accepted_alternatives',
    'partial_credit_rules',
    'calculation_precision',
    'unit_requirements',
    'graph_requirements',
    'answer_model_gaps',
  ]) {
    assert(answerModelRequired.includes(field), `official_answer_model must require ${field}`);
  }

  const decompositionRequired = defs.exam_ingestion_record.properties.skill_decomposition.required || [];
  for (const field of [
    'content_units',
    'calculation_operations',
    'graph_operations',
    'source_reading_operations',
    'reasoning_operations',
    'answer_writing_operations',
  ]) {
    assert(decompositionRequired.includes(field), `skill_decomposition must require ${field}`);
  }

  const boundary = defs.exam_ingestion_record.properties.product_boundary;
  for (const field of [
    'student_diagnostics_authorized',
    'adaptive_routing_authorized',
    'mastery_decisions_authorized',
    'automatic_sequencing_authorized',
    'student_facing_ai_authorized',
    'summative_use_authorized',
    'pv_projection_authorized',
    'pv_machine_promotion_authorized',
    'student_facing_output_authorized',
  ]) {
    assertFalseConst(boundary, 'product_boundary', field);
  }

  const mtuClassifications = defs.mtu_gap_classification.properties.classification.enum || [];
  for (const value of [
    'existing_mtu',
    'existing_mtu_but_procedure_too_weak',
    'missing_mtu',
    'merge_split_candidate',
    'operation_registry_need',
    'pv_graph_need',
    'answer_skill_need',
    'source_annex_gap',
    'answer_model_extraction_gap',
    'defer',
  ]) {
    assert(mtuClassifications.includes(value), `mtu classification missing ${value}`);
  }
}

function checkDocs() {
  const readme = read(README);
  const procedure = read(PROCEDURE);

  for (const text of [readme, procedure]) {
    assertIncludes(text, 'Do not hand-edit `references/external/`', 'exam-ingestion docs');
    assertIncludes(text, 'student diagnostics', 'exam-ingestion docs');
    assertIncludes(text, 'adaptive routing', 'exam-ingestion docs');
    assertIncludes(text, 'summative use', 'exam-ingestion docs');
    assertIncludes(text, 'student-facing AI', 'exam-ingestion docs');
    assertIncludes(text, 'PV projection', 'exam-ingestion docs');
  }

  for (const needle of [
    'prompt metadata',
    'source annexes',
    'official correction models',
    'answer steps',
    'point rules',
    'MTU gap classifications',
    'lesson-build handoff',
  ]) {
    assertIncludes(readme, needle, 'README');
  }

  for (const needle of [
    'Prompt metadata and prompt text are separately traceable.',
    'Official correction-model steps are first-class records',
    'Every requirement is classified for MTU/operation coverage before mutation.',
    'Future Interview Protocol',
    'Stop Conditions',
  ]) {
    assertIncludes(procedure, needle, 'review procedure');
  }
}

function checkReviewPacket() {
  const packet = readJson(PACKET_JSON);
  const markdown = read(PACKET_MD);
  assert(packet.schema_version === 1, 'review packet schema_version');
  assert(packet.gate_id === 'GATE-EX0-exam-ingestion-contract', 'review packet gate_id');
  assert(packet.sprint_id === 'EX-0', 'review packet sprint_id');
  assert(packet.status === 'review_packet_ready_not_closed', 'review packet status');
  assert(packet.protected_reference_data_changed === false, 'review packet protected_reference_data_changed');
  assert(packet.external_source_mutation_authorized === false, 'review packet external_source_mutation_authorized');
  assert(packet.unit_minting_authorized === false, 'review packet unit_minting_authorized');
  assert(packet.cp6_closed === false, 'review packet cp6_closed');
  assert(packet.year1_closed === false, 'review packet year1_closed');
  assert(Array.isArray(packet.review_questions) && packet.review_questions.length >= 8, 'review packet question count');
  for (const question of packet.review_questions) {
    assert(question.open_answer_allowed === true, `${question.id} must allow open answer`);
    assert(Array.isArray(question.options) && question.options.length >= 3, `${question.id} must have options`);
  }
  for (const blocked of [
    'protected reference mutation',
    'external-source mutation',
    'unit minting',
    'CP-6 closure',
    'Year-1 closure',
    'student diagnostics',
    'adaptive routing',
    'student-facing AI',
    'summative use',
    'PV projection',
  ]) {
    assert(packet.blocked_outcomes.includes(blocked), `review packet blocked_outcomes missing ${blocked}`);
  }
  assertIncludes(markdown, 'Full Planned Review Questions', 'review packet markdown');
  assertIncludes(markdown, 'Future Interview Protocol', 'review packet markdown');
  assertIncludes(markdown, 'Current Stop Conditions', 'review packet markdown');
  assertIncludes(markdown, 'Run the formal GATE-EX0 human review', 'review packet markdown');
}

function checkPilotDataAuthorization() {
  const existing = FORBIDDEN_PILOT_FILES.filter((relPath) => fs.existsSync(file(relPath)));
  if (existing.length === 0) return;

  assert(
    existing.length === FORBIDDEN_PILOT_FILES.length,
    `authorized EX-1 pilot data must be complete; found only ${existing.join(', ')}`
  );
  assert(fs.existsSync(file(GATE_CLOSURE)), `pilot overlay data requires closed gate: ${GATE_CLOSURE}`);
  assert(fs.existsSync(file(PILOT_VALIDATOR)), `pilot overlay data requires validator: ${PILOT_VALIDATOR}`);

  const closure = readJson(GATE_CLOSURE);
  assert(closure.status === 'pass_with_conditions', 'GATE-EX0 must be pass_with_conditions before pilot overlays exist');
  assert(closure.allowed_next_sprint === 'EX-1', 'GATE-EX0 must authorize EX-1 before pilot overlays exist');
  assert(Array.isArray(closure.allowed_next_sprint_scope), 'GATE-EX0 must carry allowed_next_sprint_scope');
  for (const scope of [
    'three bounded exam-ingestion pilot overlays under references/data',
    'pilot-overlay validator for real EX-1 records',
  ]) {
    assert(closure.allowed_next_sprint_scope.includes(scope), `GATE-EX0 missing EX-1 allowed scope: ${scope}`);
  }
}

function main() {
  checkSchema();
  checkDocs();
  checkReviewPacket();
  checkPilotDataAuthorization();
  console.log('OK exam-ingestion contract: schema, procedure, packet, and boundaries validated.');
}

if (require.main === module) main();
