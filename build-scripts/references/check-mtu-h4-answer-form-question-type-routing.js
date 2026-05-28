#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep this checker non-mutating. It validates the MTU-H4 answer-form and
 *   question-type routing packet, not a mutation or candidate-write sprint.
 * - If accepted answer-form planning labels change, update the lane checks and
 *   review questions together.
 * - Do not use this checker to create candidate storage, write target
 *   exercises, or edit references/machine or references/external.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h4-answer-form-question-type-routing.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h4-answer-form-question-type-routing.md');
const REVIEW_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H4-answer-form-question-type-routing', 'review-packet.json');
const REVIEW_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H4-answer-form-question-type-routing', 'review-packet.md');
const BUNDLE_URLS = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H4-answer-form-question-type-routing', 'bundle-urls.md');
const PLAN_JSON = path.join(ROOT, 'references', 'data', 'sprints', 'MTU-H4.plan.json');
const PLAN_MD = path.join(ROOT, 'reports', 'sprints', 'MTU-H4-plan.md');
const BASELINE_MD = path.join(ROOT, 'reports', 'sprints', 'MTU-H4-baseline.md');
const TARGET_EXERCISES = path.join(ROOT, 'references', 'authored', 'course-target-exercises.json');
const QUESTION_TYPE_GAPS = path.join(ROOT, 'reports', 'json', 'exam-question-extraction-gaps.json');
const ANSWER_SKILL_STORAGE = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'answer-skill-candidates.json');
const ANSWER_SKILL_CLI = path.join(ROOT, 'build-scripts', 'references', 'answer-skill-candidate-add.js');
const ANSWER_SKILL_CHECKER = path.join(ROOT, 'build-scripts', 'references', 'check-operation-answer-skill-candidates.js');
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
  'student_product_use_authorized',
];

const EXPECTED_COUNTS = {
  uitleg_dat: 32,
  uitleg_of: 10,
  bron: 8,
  berekenen: 2,
  noem: 2,
};

const REQUIRED_LANES = [
  'ANS_BEREKEN',
  'ANS_LEG_UIT_DAT',
  'ANS_LEG_UIT_OF',
  'ANS_LEG_UIT_MET_VOORBEELD',
  'ANS_NOEM_GEEF_AAN',
  'ANS_BRON_GEBRUIKEN',
  'ANS_GRAFISCH_ARCEER_TEKEN',
  'ANS_ANALYSEER_BEOORDEEL',
];

function fail(message) {
  console.error(`MTU-H4 answer-form/question-type routing check failed: ${message}`);
  process.exit(1);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function readText(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${rel(file)}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  const text = readText(file);
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(`invalid JSON in ${rel(file)}: ${error.message}`);
  }
}

function requireFalse(object, key, context) {
  if (!object || object[key] !== false) fail(`${context}.${key} must be false`);
}

function requireIncludes(text, needle, context) {
  if (!text.includes(needle)) fail(`${context} must include ${needle}`);
}

function walkQuestionTypes(value, counts = {}) {
  if (Array.isArray(value)) {
    for (const item of value) walkQuestionTypes(item, counts);
  } else if (value && typeof value === 'object') {
    if (typeof value.question_type === 'string') {
      counts[value.question_type] = (counts[value.question_type] || 0) + 1;
    }
    for (const item of Object.values(value)) walkQuestionTypes(item, counts);
  }
  return counts;
}

function exercisesList(data) {
  return Array.isArray(data) ? data : data.exercises;
}

function hasQuestionTypeOrAnswerFormFields(exercises) {
  return exercises.some((exercise) => (
    Object.prototype.hasOwnProperty.call(exercise, 'question_type')
    || Object.prototype.hasOwnProperty.call(exercise, 'question_types')
    || Object.prototype.hasOwnProperty.call(exercise, 'answer_form')
    || Object.prototype.hasOwnProperty.call(exercise, 'answer_forms')
  ));
}

function byPlanningLabel(records, label) {
  const record = records.find((item) => item.planning_label === label);
  if (!record) fail(`missing lane ${label}`);
  return record;
}

function assertCounts(actual, expected, context) {
  const a = JSON.stringify(actual, Object.keys(expected).sort());
  const e = JSON.stringify(expected, Object.keys(expected).sort());
  if (a !== e) fail(`${context} mismatch: actual ${a}, expected ${e}`);
}

const packet = readJson(PACKET_JSON);
const packetMd = readText(PACKET_MD);
const review = readJson(REVIEW_JSON);
const reviewMd = readText(REVIEW_MD);
const plan = readJson(PLAN_JSON);
const planMd = readText(PLAN_MD);
const baselineMd = readText(BASELINE_MD);
const targetData = readJson(TARGET_EXERCISES);
const questionTypeGaps = readJson(QUESTION_TYPE_GAPS);
const answerSkillCli = readText(ANSWER_SKILL_CLI);
const answerSkillChecker = readText(ANSWER_SKILL_CHECKER);
const roadmap = readText(ROADMAP);

if (packet.schema_version !== 1) fail('packet schema_version must be 1');
if (packet.sprint_id !== 'MTU-H4') fail('packet sprint_id must be MTU-H4');
if (packet.gate_id !== 'GATE-MTU-H4-answer-form-question-type-routing') fail('packet gate_id mismatch');
if (packet.status !== 'routing_packet_ready_no_mutation') fail('packet status mismatch');
if (packet.remote_publication_required_before_review !== true) fail('packet must require remote publication');
if (!String(packet.remote_publication_status || '').includes('push')) fail('packet remote status must mention push');

if (plan.sprint_id !== 'MTU-H4') fail('plan sprint_id mismatch');
if (plan.gate_id !== packet.gate_id) fail('plan gate_id mismatch');
if (plan.packet !== 'reports/mtu-hardening/mtu-h4-answer-form-question-type-routing.json') {
  fail('plan packet path mismatch');
}

for (const key of FALSE_KEYS) {
  requireFalse(packet.authority_boundary, key, 'packet.authority_boundary');
  requireFalse(review.authority_boundary, key, 'review.authority_boundary');
}
if (packet.routing_boundary.current_packet_authorizes_writes !== false) {
  fail('routing boundary must not authorize writes');
}

const exercises = exercisesList(targetData);
if (!Array.isArray(exercises)) fail('target exercise data must contain exercises array');
if (exercises.length !== packet.baseline.target_exercise_records) fail('target exercise count mismatch');
if (hasQuestionTypeOrAnswerFormFields(exercises)) fail('target exercises must not already have question_type/answer_form fields');
if (packet.baseline.target_exercise_question_type_or_answer_form_fields_present !== false) {
  fail('packet baseline must record absent target question_type/answer_form fields');
}

const questionTypeCounts = walkQuestionTypes(questionTypeGaps);
assertCounts(questionTypeCounts, EXPECTED_COUNTS, 'question_type counts');
assertCounts(packet.baseline.exam_question_type_counts, EXPECTED_COUNTS, 'packet baseline question_type counts');
assertCounts(plan.known_question_type_values, EXPECTED_COUNTS, 'plan question_type counts');

if (fs.existsSync(ANSWER_SKILL_STORAGE)) {
  fail('answer-skill-candidates.json must remain absent for MTU-H4');
}
if (packet.baseline.answer_skill_candidate_storage_exists !== false) {
  fail('packet must record absent answer-skill candidate storage');
}
requireIncludes(answerSkillCli, 'dry-run-only', 'answer-skill candidate CLI');
requireIncludes(answerSkillCli, 'assertFutureStorageAbsent', 'answer-skill candidate CLI');
requireIncludes(answerSkillChecker, 'assertFutureStorageAbsent', 'operation/answer-skill checker');

for (const label of REQUIRED_LANES) {
  const lane = byPlanningLabel(packet.reusable_answer_form_lane_candidates, label);
  if (lane.live_unit_id !== null) fail(`${label} must not assign a live unit id in H4`);
  if (lane.mutation_authorized_now !== false) fail(`${label} mutation must not be authorized`);
}
if (!byPlanningLabel(packet.reusable_answer_form_lane_candidates, 'ANS_BEREKEN').maps_question_types.includes('berekenen')) {
  fail('ANS_BEREKEN must map berekenen');
}
if (!byPlanningLabel(packet.reusable_answer_form_lane_candidates, 'ANS_LEG_UIT_DAT').maps_question_types.includes('uitleg_dat')) {
  fail('ANS_LEG_UIT_DAT must map uitleg_dat');
}
if (!byPlanningLabel(packet.reusable_answer_form_lane_candidates, 'ANS_LEG_UIT_OF').maps_question_types.includes('uitleg_of')) {
  fail('ANS_LEG_UIT_OF must map uitleg_of');
}
if (!byPlanningLabel(packet.reusable_answer_form_lane_candidates, 'ANS_BRON_GEBRUIKEN').maps_question_types.includes('bron')) {
  fail('ANS_BRON_GEBRUIKEN must map bron');
}
if (!byPlanningLabel(packet.reusable_answer_form_lane_candidates, 'ANS_NOEM_GEEF_AAN').maps_question_types.includes('noem')) {
  fail('ANS_NOEM_GEEF_AAN must map noem');
}
if (byPlanningLabel(packet.reusable_answer_form_lane_candidates, 'ANS_ANALYSEER_BEOORDEEL').status !== 'held_for_later_evidence') {
  fail('ANS_ANALYSEER_BEOORDEEL must be held');
}

for (const candidateId of [
  'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION',
  'EX_ANS_TWO_STEP_CORRECTION_MODEL_EXPLANATION',
]) {
  const candidate = packet.exam_answer_skill_overlay_lanes.find((item) => item.answer_skill_id === candidateId);
  if (!candidate) fail(`missing EX overlay lane ${candidateId}`);
  if (candidate.candidate_write_authorized_now !== false) fail(`${candidateId} write must not be authorized`);
}

for (const [questionType, count] of Object.entries(EXPECTED_COUNTS)) {
  const mapping = packet.question_type_mapping_candidates.find((item) => item.question_type === questionType);
  if (!mapping) fail(`missing mapping candidate for ${questionType}`);
  if (mapping.current_count !== count) fail(`${questionType} count mismatch in mapping candidate`);
  if (mapping.mapping_write_authorized_now !== false) fail(`${questionType} mapping write must not be authorized`);
}

for (const deferred of [
  'target_exercise_question_type_fields',
  'persistent_answer_skill_candidate_storage',
  'exact_mtu_unit_ids_for_answer_forms',
  'student_facing_answer_form_training',
]) {
  if (!packet.held_or_deferred_routes.some((item) => item.route === deferred)) {
    fail(`missing held/deferred route ${deferred}`);
  }
}

if (review.schema_version !== 1) fail('review schema_version must be 1');
if (review.gate_id !== packet.gate_id) fail('review gate_id mismatch');
if (review.source_packet !== 'reports/mtu-hardening/mtu-h4-answer-form-question-type-routing.json') {
  fail('review source packet mismatch');
}
if (review.remote_publication_required_before_review !== true) fail('review must require remote publication');
if (!Array.isArray(review.calibration_questions) || review.calibration_questions.length !== 3) {
  fail('review must have exactly 3 calibration questions');
}
if (!Array.isArray(review.planned_questions) || review.planned_questions.length !== 10) {
  fail('review must have exactly 10 planned questions');
}
for (let i = 1; i <= 10; i += 1) {
  requireIncludes(reviewMd, `MTUH4-Q${i}`, 'review packet markdown');
}
for (const term of ['ANS_BEREKEN', 'ANS_LEG_UIT_DAT', 'ANS_BRON_GEBRUIKEN', 'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION']) {
  requireIncludes(packetMd, term, 'packet markdown');
  requireIncludes(reviewMd, term === 'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION' ? 'EX answer-skill overlays' : term.replace('ANS_', '').toLowerCase().split('_')[0], 'review markdown');
}
requireIncludes(reviewMd, 'Stop if the packet/evidence has not been pushed before review.', 'review markdown');
requireIncludes(reviewMd, 'answer-skill-candidates.json', 'review markdown');

requireIncludes(planMd, 'answer-form', 'sprint plan');
requireIncludes(planMd, 'candidate writes', 'sprint plan');
requireIncludes(baselineMd, 'question_type', 'sprint baseline');
requireIncludes(baselineMd, 'answer-skill-candidates.json', 'sprint baseline');

const bundle = readText(BUNDLE_URLS);
requireIncludes(bundle, 'review-packet.md', 'bundle urls');
requireIncludes(bundle, 'review-packet.json', 'bundle urls');
requireIncludes(bundle, 'bundle-urls.md', 'bundle urls');

if (!roadmap.includes('MTU-H4 | Answer-Form MTUs And Question-Type Mapping')) {
  fail('roadmap must include MTU-H4 row before or after packet sprint');
}
if (!roadmap.includes('No protected reference mutation') && !roadmap.includes('no protected reference mutation')) {
  fail('roadmap must preserve H4 no protected mutation boundary');
}

console.log('OK MTU-H4 answer-form/question-type routing packet');
