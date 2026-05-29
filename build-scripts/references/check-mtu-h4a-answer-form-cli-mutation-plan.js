#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep this checker non-mutating. It validates the H4A answer-form planning
 *   packet, review packet, held-lane boundaries, and simulated catalog specs.
 * - If reviewed answer-form IDs change, update EXPECTED_LANES and the review
 *   questions together.
 * - Do not use this checker to write references/machine or references/external.
 */

const fs = require('fs');
const path = require('path');
const { validateSpec } = require('./unit-add');
const {
  validate,
  loadTerminology,
  loadEindtermen,
} = require('./build-unit-index');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h4a-answer-form-cli-mutation-plan.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h4a-answer-form-cli-mutation-plan.md');
const REVIEW_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H4A-answer-form-cli-mutation-plan', 'review-packet.json');
const REVIEW_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H4A-answer-form-cli-mutation-plan', 'review-packet.md');
const BUNDLE_URLS = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H4A-answer-form-cli-mutation-plan', 'bundle-urls.md');
const H4_CLOSURE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H4-answer-form-question-type-routing', 'gate-closure.json');
const H4_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h4-answer-form-question-type-routing.json');
const UNITS_JSON = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const TARGET_EXERCISES = path.join(ROOT, 'references', 'authored', 'course-target-exercises.json');
const ANSWER_SKILL_STORAGE = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'answer-skill-candidates.json');
const ROADMAP = path.join(ROOT, 'references', 'reference-team-roadmap.md');

const FALSE_KEYS = [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'unit_minting_authorized',
  'unit_update_execution_authorized',
  'unit_split_execution_authorized',
  'unit_deprecation_authorized',
  'target_exercise_mutation_authorized',
  'target_exercise_promotion_authorized',
  'candidate_storage_creation_authorized',
  'candidate_writes_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_mutation_authorized',
  'generated_projection_refresh_authorized',
  'lesson_output_mutation_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'sequencing_authorized',
  'student_facing_ai_authorized',
  'summative_use_authorized',
  'pv_projection_authorized',
  'pv_machine_promotion_authorized',
  'scale_gate_1_authorized',
  'student_product_use_authorized',
];

const EXPECTED_LANES = new Map([
  ['ANS_NOEM_GEEF_AAN', 'A80'],
  ['ANS_BRON_GEBRUIKEN', 'A81'],
  ['ANS_BEREKEN', 'A96'],
  ['ANS_LEG_UIT_DAT', 'A97'],
  ['ANS_LEG_UIT_OF', 'A98'],
  ['ANS_LEG_UIT_MET_VOORBEELD', 'A99'],
]);

const HELD_LANES = [
  'ANS_GRAFISCH_ARCEER_TEKEN',
  'ANS_MOTIVEER_CLASSIFICATIE',
  'ANS_ANALYSEER_BEOORDEEL',
];

function fail(message) {
  console.error(`MTU-H4A answer-form CLI-mutation plan check failed: ${message}`);
  process.exit(1);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function readJson(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${rel(file)}`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${rel(file)}: ${error.message}`);
  }
}

function readText(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${rel(file)}`);
  return fs.readFileSync(file, 'utf8');
}

function requireFalse(object, key, context) {
  if (!object || object[key] !== false) fail(`${context}.${key} must be false`);
}

function requireIncludes(text, needle, context) {
  if (!text.includes(needle)) fail(`${context} must include ${needle}`);
}

function byId(records, id, context) {
  const record = records.find((item) => (
    item.id === id ||
    item.unit_id === id ||
    item.lane === id ||
    item.question_type === id ||
    item.answer_skill_id === id
  ));
  if (!record) fail(`missing ${context} ${id}`);
  return record;
}

function asExercises(data) {
  return Array.isArray(data) ? data : data.exercises;
}

const packet = readJson(PACKET_JSON);
const packetMd = readText(PACKET_MD);
const review = readJson(REVIEW_JSON);
const reviewMd = readText(REVIEW_MD);
const h4Closure = readJson(H4_CLOSURE);
const h4Packet = readJson(H4_PACKET);
const units = readJson(UNITS_JSON);
const targetData = readJson(TARGET_EXERCISES);
const roadmap = readText(ROADMAP);

if (packet.schema_version !== 1) fail('packet schema_version must be 1');
if (packet.sprint_id !== 'MTU-H4A') fail('packet sprint_id must be MTU-H4A');
if (packet.gate_id !== 'GATE-MTU-H4A-answer-form-cli-mutation-plan') fail('packet gate_id mismatch');
if (packet.status !== 'cli_mutation_plan_ready_no_mutation') fail('packet status mismatch');
if (packet.remote_publication_required_before_review !== true) fail('packet must require remote publication');
if (!String(packet.remote_publication_status || '').includes('commit')) fail('packet remote status must mention commit');

if (review.gate_id !== packet.gate_id) fail('review gate_id mismatch');
if (review.source_packet !== 'reports/mtu-hardening/mtu-h4a-answer-form-cli-mutation-plan.json') {
  fail('review source_packet mismatch');
}
if (review.remote_publication_required_before_review !== true) fail('review must require remote publication');

for (const key of FALSE_KEYS) {
  requireFalse(packet.authority_boundary, key, 'packet.authority_boundary');
  requireFalse(review.authority_boundary, key, 'review.authority_boundary');
}

if (!Array.isArray(review.calibration_questions) || review.calibration_questions.length !== 3) {
  fail('review must have exactly 3 calibration questions');
}
if (!Array.isArray(review.planned_questions) || review.planned_questions.length !== 10) {
  fail('review must have exactly 10 planned questions');
}
for (let i = 1; i <= 10; i += 1) {
  requireIncludes(reviewMd, `MTUH4A-Q${i}`, 'review packet markdown');
}
if (!fs.existsSync(BUNDLE_URLS)) fail(`missing bundle URLs: ${rel(BUNDLE_URLS)}`);

if (h4Closure.status !== 'pass_with_conditions') fail('source H4 gate must be closed pass_with_conditions');
if (!h4Closure.authorized_next || h4Closure.authorized_next.sprint_id !== 'MTU-H4A') {
  fail('H4 closure must authorize MTU-H4A');
}
if (h4Closure.authorized_next.execution_authorized !== false) fail('H4 closure must not authorize execution');
if (packet.h4_reviewed_remote_commit !== h4Closure.reviewed_remote_commit) fail('H4 reviewed remote commit mismatch');
if (h4Packet.sprint_id !== 'MTU-H4') fail('source H4 packet mismatch');

const unitMap = new Map(units.map((unit) => [unit.id, unit]));
for (const id of ['A71', 'A80', 'A81', 'A96', 'A97', 'A98', 'A99', 'A100']) {
  if (unitMap.has(id)) fail(`${id} must be absent in the pre-H4A planning baseline`);
}
if (packet.baseline_checks.a100_invalid !== undefined) fail('packet should use invalid_ids instead of baseline_checks.a100_invalid');
if (!Array.isArray(packet.baseline_checks.invalid_ids) || !packet.baseline_checks.invalid_ids.includes('A100')) {
  fail('packet baseline must record A100 as invalid');
}
if (packet.baseline_checks.a71_status !== 'held_high_risk_from_prior_graphical_foundation_work_not_used_by_h4a') {
  fail('packet must keep A71 unused');
}

const exercises = asExercises(targetData);
if (!Array.isArray(exercises)) fail('target exercises must be an array or contain exercises array');
const targetFields = ['question_type', 'question_types', 'answer_form', 'answer_forms'];
for (const field of targetFields) {
  const withField = exercises.filter((exercise) => Object.prototype.hasOwnProperty.call(exercise, field));
  if (withField.length !== 0) fail(`target exercises must still have zero ${field} fields`);
}
if (fs.existsSync(ANSWER_SKILL_STORAGE)) fail('answer-skill candidate storage must remain absent');

if (!Array.isArray(packet.proposed_unit_additions) || packet.proposed_unit_additions.length !== EXPECTED_LANES.size) {
  fail('packet must include exactly six proposed unit additions');
}

const existingIds = new Set(units.map((unit) => unit.id));
const additionSpecs = [];
for (const [lane, unitId] of EXPECTED_LANES.entries()) {
  const laneRecord = byId(packet.proposed_unit_additions, lane, 'proposed lane');
  if (laneRecord.unit_id !== unitId) fail(`${lane} must propose ${unitId}`);
  if (laneRecord.action !== 'unit-add') fail(`${lane} action must be unit-add`);
  if (laneRecord.execution_authorized_now !== false) fail(`${lane} execution_authorized_now must be false`);
  if (!String(laneRecord.later_command_template || '').includes(`reviewed ${unitId} spec`)) {
    fail(`${lane} later command template must reference reviewed ${unitId} spec`);
  }
  const spec = laneRecord.reviewed_spec;
  if (!spec || spec.id !== unitId) fail(`${lane} reviewed_spec.id must be ${unitId}`);
  if (!spec.generator) fail(`${unitId} must include generator field`);
  if (spec.zero_needs_status !== 'true_zero') fail(`${unitId} must use true_zero zero_needs_status`);
  if (!spec.zero_needs_review || !String(spec.zero_needs_review.rationale || '').includes('Answer-form')) {
    fail(`${unitId} must include answer-form zero-needs review rationale`);
  }
  const specErrors = validateSpec(spec, existingIds);
  if (specErrors.length) fail(`${unitId} validateSpec errors: ${specErrors.join('; ')}`);
  additionSpecs.push(spec);
}

const a81 = byId(packet.proposed_unit_additions, 'ANS_BRON_GEBRUIKEN', 'proposed lane');
if (a81.standalone_complete_answer_form !== false) fail('ANS_BRON_GEBRUIKEN must not be standalone');
if (!Array.isArray(a81.compatible_underlying_answer_forms) || !a81.compatible_underlying_answer_forms.includes('ANS_BEREKEN')) {
  fail('ANS_BRON_GEBRUIKEN must list compatible underlying answer forms');
}
if (!/not a complete standalone answer form/i.test(packetMd)) fail('markdown must state bron is not standalone');

for (const lane of HELD_LANES) {
  const held = byId(packet.held_lanes, lane, 'held lane');
  if (held.unit_id !== null) fail(`${lane} must not have unit_id`);
  if (held.unit_minting_authorized !== false) fail(`${lane} unit_minting_authorized must be false`);
}

if (packet.id_policy_notes.a100_invalid !== true) fail('id policy must record A100 invalid');
if (packet.id_policy_notes.a71_not_used !== true) fail('id policy must keep A71 unused');
if (packet.id_policy_notes.future_answer_form_growth_requires_review !== true) {
  fail('id policy must require future review');
}

const simulated = units.concat(additionSpecs);
const validation = validate(simulated, {
  terms: loadTerminology(),
  eindtermen: loadEindtermen(),
  skipStoredLayerValidation: true,
});
if (validation.errors.length) fail(`simulated catalog validation errors: ${validation.errors.join('; ')}`);

const mapping = packet.target_question_type_mapping_plan;
if (!mapping || mapping.writes_authorized_now !== false || mapping.target_exercise_fields_authorized_now !== false) {
  fail('target mapping plan must block writes and fields now');
}
for (const [questionType, lane, id] of [
  ['berekenen', 'ANS_BEREKEN', 'A96'],
  ['uitleg_dat', 'ANS_LEG_UIT_DAT', 'A97'],
  ['uitleg_of', 'ANS_LEG_UIT_OF', 'A98'],
  ['noem', 'ANS_NOEM_GEEF_AAN', 'A80'],
  ['bron', 'ANS_BRON_GEBRUIKEN', 'A81'],
]) {
  const record = byId(mapping.mapping_candidates_for_later_packet, questionType, 'mapping candidate');
  if (record.answer_form_lane !== lane) fail(`${questionType} must map to ${lane}`);
  if (record.proposed_unit_id !== id) fail(`${questionType} must map to ${id}`);
}
const bronMapping = byId(mapping.mapping_candidates_for_later_packet, 'bron', 'mapping candidate');
if (bronMapping.modifier !== true || bronMapping.requires_underlying_answer_form !== true) {
  fail('bron mapping must be modifier plus underlying answer form');
}

const overlay = packet.ex_answer_skill_overlay_boundary;
if (!overlay || overlay.storage_created_now !== false || overlay.candidate_writes_authorized_now !== false) {
  fail('EX overlay boundary must block storage and writes');
}
for (const answerSkillId of ['EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION', 'EX_ANS_TWO_STEP_CORRECTION_MODEL_EXPLANATION']) {
  byId(overlay.visible_overlay_needs, answerSkillId, 'visible EX overlay');
}

const commandPlan = packet.command_plan_for_later_execution_packet;
if (!commandPlan || commandPlan.execution_authorized_now !== false) fail('command plan must block execution now');
if (commandPlan.unit_add_has_no_dry_run_support !== true) fail('command plan must disclose unit-add no dry-run');
if (!Array.isArray(commandPlan.commands_to_prepare_later) || commandPlan.commands_to_prepare_later.length !== EXPECTED_LANES.size) {
  fail('command plan must include six later command templates');
}
if (commandPlan.later_packet_must_verify_generators_or_exposure_blocks !== true) {
  fail('command plan must require generator or exposure-block proof');
}

for (const needle of [
  'MTU-H4A',
  'GATE-MTU-H4A',
  'A80',
  'A81',
  'A96',
  'A99',
  'ANS_MOTIVEER_CLASSIFICATIE',
  'GAME-UX-3A',
]) {
  requireIncludes(roadmap, needle, 'reference roadmap');
}

console.log('OK MTU-H4A answer-form CLI-mutation planning packet');
