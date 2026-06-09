#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-sample-selection-packet.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-sample-selection-packet.md');
const RESULT_LOG = path.join(ROOT, 'reports', 'sprints', 'MTU-H5-blocked-stop-result.md');
const REVIEW_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-mapping-regression', 'review-packet.json');
const REVIEW_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-mapping-regression', 'review-packet.md');
const MAPPING_CHECKER = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');
const FIXTURE_TEMPLATE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.template.json');
const REVIEW_CANDIDATE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.review-candidate.json');
const REVIEW_CANDIDATE_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.review-candidate.md');
const APPROVED_FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const REGRESSION_REPORT_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.json');
const REGRESSION_REPORT_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.md');
const GATE_CLOSURE_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-mapping-regression', 'gate-closure.json');
const GATE_CLOSURE_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-mapping-regression', 'gate-closure.md');
const BENCHMARK = path.join(ROOT, 'reports', 'mtu-hardening', 'benchmark-sample-v1.json');
const TAXONOMY = path.join(ROOT, 'reports', 'mtu-hardening', 'failure-taxonomy-v1.md');
const H2_CHECKER = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h2-solo-cases.js');
const H3_CHECKER = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h3-incidence-pass-through-review.js');
const H4_CHECKER = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h4-answer-form-question-type-routing.js');

const H1_SEED_CASES = [
  'vwo-economie-2026-solo:q1',
  'vwo-economie-2026-solo:q2',
  'vwo-economie-2026-solo:q3',
];

const REVIEW_CANDIDATE_RECORD_IDS = [
  'vw-1022-a-25-1-o:opgave-1:question-3',
  'vw-1022-a-25-1-o:opgave-3:question-15',
  'vw-1022-a-25-1-o:opgave-4:question-19',
  'vw-1022-a-25-2-o:opgave-6:question-27',
];

const REVIEW_CANDIDATE_FAILED_DEFECT_CLASSES = [
  'missing_mtu_for_correction_model_operation',
  'over_triggered_prerequisite_not_required_by_answer_model',
  'question_word_without_answer_form_mtu',
  'incidence_pass_through_task_without_incidence_mtu',
  'scale_factor_usage_without_scaling_unit_mtu',
];

const AUTHORITY_FALSE_KEYS = [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'authored_target_exercise_mutation_authorized',
  'unit_minting_authorized',
  'unit_update_authorized',
  'unit_split_authorized',
  'unit_merge_authorized',
  'unit_deprecation_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_mutation_authorized',
  'candidate_storage_creation_authorized',
  'candidate_writes_authorized',
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
  'product_route_readiness_claimed',
];

const REQUIRED_DEFECT_CLASSES = [
  'missing_mtu_for_correction_model_operation',
  'over_triggered_prerequisite_not_required_by_answer_model',
  'calculus_route_triggered_where_non_calculus_route_intended',
  'function_construction_route_triggered_when_point_calculation_enough',
  'incidence_pass_through_task_without_incidence_mtu',
  'question_word_without_answer_form_mtu',
  'scale_factor_usage_without_scaling_unit_mtu',
  'predictable_misconception_without_tag_or_equivalent_evidence',
  'apply_analyze_unit_without_usable_canonical_procedure',
];

function fail(message) {
  console.error(`MTU-H5 sample-selection packet check failed: ${message}`);
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

function requireArray(object, key, context, minItems = 1) {
  if (!Array.isArray(object[key]) || object[key].length < minItems) {
    fail(`${context}.${key} must be an array with at least ${minItems} item(s)`);
  }
  return object[key];
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function evidenceExists(evidencePath) {
  if (!hasText(evidencePath)) return false;
  if (/^https?:\/\//.test(evidencePath)) return true;
  return fs.existsSync(path.resolve(ROOT, evidencePath.split('#')[0]));
}

const packet = readJson(PACKET_JSON);
const packetMd = readText(PACKET_MD);
const resultLog = readText(RESULT_LOG);
const review = readJson(REVIEW_JSON);
const reviewMd = readText(REVIEW_MD);
const fixtureTemplate = readJson(FIXTURE_TEMPLATE);
const reviewCandidate = readJson(REVIEW_CANDIDATE);
const reviewCandidateMd = readText(REVIEW_CANDIDATE_MD);
const benchmark = readJson(BENCHMARK);
const taxonomy = readText(TAXONOMY);
readText(MAPPING_CHECKER);
readText(H2_CHECKER);
readText(H3_CHECKER);
readText(H4_CHECKER);

if (packet.schema_version !== 1) fail('packet schema_version must be 1');
if (packet.sprint_id !== 'MTU-H5') fail('packet sprint_id must be MTU-H5');
if (![
  'blocked_no_approved_fresh_sample',
  'approved_with_administrative_remote_closure_repair',
].includes(packet.status)) {
  fail('packet status must be blocked_no_approved_fresh_sample or approved_with_administrative_remote_closure_repair');
}
if (packet.blocked_stop_result_log !== 'reports/sprints/MTU-H5-blocked-stop-result.md') {
  fail('packet.blocked_stop_result_log must point to reports/sprints/MTU-H5-blocked-stop-result.md');
}
if (packet.validator_scaffold !== 'build-scripts/references/check-mtu-h5-mapping-regression.js') {
  fail('packet.validator_scaffold must point to build-scripts/references/check-mtu-h5-mapping-regression.js');
}
if (packet.human_review_packet !== 'reports/review-gates/GATE-MTU-H5-mapping-regression/review-packet.json') {
  fail('packet.human_review_packet must point to GATE-MTU-H5 review-packet.json');
}
if (packet.fixture_template !== 'reports/mtu-hardening/mtu-h5-regression-fixture.template.json') {
  fail('packet.fixture_template must point to mtu-h5-regression-fixture.template.json');
}
if (packet.review_candidate_fixture !== 'reports/mtu-hardening/mtu-h5-regression-fixture.review-candidate.json') {
  fail('packet.review_candidate_fixture must point to mtu-h5-regression-fixture.review-candidate.json');
}
if (packet.review_candidate_summary !== 'reports/mtu-hardening/mtu-h5-regression-fixture.review-candidate.md') {
  fail('packet.review_candidate_summary must point to mtu-h5-regression-fixture.review-candidate.md');
}
if (packet.status !== 'blocked_no_approved_fresh_sample') {
  if (packet.approved_fresh_sample_fixture !== 'reports/mtu-hardening/mtu-h5-regression-fixture.json') {
    fail('packet.approved_fresh_sample_fixture must point to mtu-h5-regression-fixture.json');
  }
  if (packet.regression_report_json !== 'reports/mtu-hardening/mtu-h5-regression-report.json') {
    fail('packet.regression_report_json must point to mtu-h5-regression-report.json');
  }
  if (packet.regression_report_markdown !== 'reports/mtu-hardening/mtu-h5-regression-report.md') {
    fail('packet.regression_report_markdown must point to mtu-h5-regression-report.md');
  }
}

for (const key of AUTHORITY_FALSE_KEYS) {
  requireFalse(packet.authority_boundary, key, 'authority_boundary');
}

if (benchmark.status !== 'seed_benchmark_non_mutating') fail('H1 benchmark status mismatch');
const futureSlots = requireArray(benchmark, 'stratified_sample_slots', 'benchmark', 6);
if (!futureSlots.every((slot) => slot.status === 'future_sample_required')) {
  fail('H1 benchmark sample slots must still be future_sample_required for blocked H5 packet');
}
if (!Array.isArray(benchmark.questions) || benchmark.questions.length !== 3) {
  fail('H1 benchmark must contain exactly the three Solo seed questions');
}
if (!benchmark.questions.every((question) => String(question.question_id || '').includes('solo:'))) {
  fail('H1 benchmark questions must be Solo seed cases, not a fresh sample');
}

if (packet.status === 'blocked_no_approved_fresh_sample') {
  for (const check of requireArray(packet, 'approved_sample_absence_checks', 'packet', 4)) {
    if (check.expected_current_state !== 'absent') fail(`${check.path} expected_current_state must be absent`);
    if (fs.existsSync(path.join(ROOT, check.path))) {
      fail(`${check.path} now exists; replace sample-selection packet with MTU-H5 validator planning`);
    }
  }
} else {
  for (const check of requireArray(packet, 'approved_sample_presence_checks', 'packet', 3)) {
    if (check.expected_current_state !== 'present') fail(`${check.path} expected_current_state must be present`);
    if (!fs.existsSync(path.join(ROOT, check.path))) {
      fail(`${check.path} must exist after REVISE repairs and local approval`);
    }
  }
}

const inspectedPaths = requireArray(packet, 'evidence_inspected', 'packet', 8).map((item) => item.path);
for (const requiredPath of [
  'reports/mtu-hardening/benchmark-sample-v1.json',
  'reports/mtu-hardening/failure-taxonomy-v1.md',
  'build-scripts/references/check-mtu-h2-solo-cases.js',
  'build-scripts/references/check-mtu-h3-incidence-pass-through-review.js',
  'build-scripts/references/check-mtu-h4-answer-form-question-type-routing.js',
  'references/machine/micro-teaching-units.json',
  'references/authored/course-target-exercises.json',
]) {
  if (!inspectedPaths.includes(requiredPath)) fail(`evidence_inspected missing ${requiredPath}`);
}

const evidenceRequirements = requireArray(packet, 'exact_evidence_needed_to_proceed', 'packet', 4);
for (const id of ['H5-EVID-001', 'H5-EVID-002', 'H5-EVID-003', 'H5-EVID-004']) {
  const record = evidenceRequirements.find((item) => item.requirement_id === id);
  if (!record) fail(`missing evidence requirement ${id}`);
  requireArray(record, 'must_include', id, 3);
}

const hooks = requireArray(packet, 'defect_class_hooks', 'packet', REQUIRED_DEFECT_CLASSES.length);
const hookIds = hooks.map((hook) => hook.defect_class);
for (const defectClass of REQUIRED_DEFECT_CLASSES) {
  if (!hookIds.includes(defectClass)) fail(`missing defect class hook ${defectClass}`);
}
for (const hook of hooks) {
  if (hook.status_until_sample_exists !== 'review_required') {
    fail(`${hook.defect_class} status_until_sample_exists must be review_required`);
  }
  if (!hook.mechanical_assertion) fail(`${hook.defect_class} missing mechanical_assertion`);
  if (!hook.next_validator_hook) fail(`${hook.defect_class} missing next_validator_hook`);
}

const schema = packet.proposed_fixture_schema || {};
for (const field of ['sample_id', 'status', 'review_packet', 'authority_boundary', 'records', 'negative_fixtures']) {
  if (!(field in schema)) fail(`proposed_fixture_schema missing ${field}`);
}
const policy = packet.sample_selection_policy || {};
if (!(policy.minimum_records >= 3)) fail('sample_selection_policy.minimum_records must be at least 3');
for (const source of ['real exam questions with official correction-model evidence', 'official correction models', 'reviewed target exercises with explicit review provenance']) {
  if (!policy.allowed_sources.includes(source)) fail(`allowed_sources missing ${source}`);
}
for (const source of ['syllabus prose alone', 'generated reports alone']) {
  if (!policy.forbidden_sources.includes(source)) fail(`forbidden_sources missing ${source}`);
}

if (review.schema_version !== 1) fail('review schema_version must be 1');
if (review.gate_id !== 'GATE-MTU-H5-mapping-regression') fail('review gate_id mismatch');
if (review.sprint_id !== 'MTU-H5') fail('review sprint_id must be MTU-H5');
if (![
  'sample_selection_review_packet_ready_no_mutation',
  'approved_with_administrative_remote_closure_repair_no_mutation',
].includes(review.status)) {
  fail('review status must be sample_selection_review_packet_ready_no_mutation or approved_with_administrative_remote_closure_repair_no_mutation');
}
if (review.source_packet !== 'reports/mtu-hardening/mtu-h5-sample-selection-packet.json') {
  fail('review source_packet mismatch');
}
if (review.validator_scaffold !== 'build-scripts/references/check-mtu-h5-mapping-regression.js') {
  fail('review validator_scaffold mismatch');
}
if (review.fixture_template !== 'reports/mtu-hardening/mtu-h5-regression-fixture.template.json') {
  fail('review fixture_template mismatch');
}
if (review.review_candidate_fixture !== 'reports/mtu-hardening/mtu-h5-regression-fixture.review-candidate.json') {
  fail('review review_candidate_fixture mismatch');
}
if (review.review_candidate_summary !== 'reports/mtu-hardening/mtu-h5-regression-fixture.review-candidate.md') {
  fail('review review_candidate_summary mismatch');
}
if (packet.status !== 'blocked_no_approved_fresh_sample') {
  if (review.approved_fresh_sample_present !== true) fail('review must record approved_fresh_sample_present true');
  if (review.approved_fresh_sample_fixture !== 'reports/mtu-hardening/mtu-h5-regression-fixture.json') {
    fail('review approved_fresh_sample_fixture must point to mtu-h5-regression-fixture.json');
  }
} else {
  if (review.approved_fresh_sample_present !== false) fail('review must record approved_fresh_sample_present false');
  if (review.approved_fresh_sample_fixture !== null) fail('review approved_fresh_sample_fixture must be null');
}
for (const key of AUTHORITY_FALSE_KEYS) {
  requireFalse(review.authority_boundary, key, 'review.authority_boundary');
}
requireArray(review, 'evidence_required_to_close_gate', 'review', 8);
requireArray(review, 'calibration_questions', 'review', 3);
requireArray(review, 'planned_questions', 'review', 10);
for (let index = 1; index <= 10; index += 1) {
  requireIncludes(reviewMd, `MTUH5-Q${index}`, 'review markdown');
}
for (const required of [
  'approved_for_mtu_h5_regression',
  'Full Planned Review Questions',
  'No protected reference mutation authorized',
]) {
  requireIncludes(reviewMd, required, 'review markdown');
}
if (packet.status !== 'blocked_no_approved_fresh_sample') {
  requireIncludes(reviewMd, 'approved with administrative remote-closure repair', 'review markdown');
} else {
  requireIncludes(reviewMd, 'does not approve a fresh sample', 'review markdown');
}

if (fixtureTemplate.schema_version !== 1) fail('fixture template schema_version must be 1');
if (fixtureTemplate.sprint_id !== 'MTU-H5') fail('fixture template sprint_id must be MTU-H5');
if (fixtureTemplate.status !== 'template_not_evidence_do_not_run') {
  fail('fixture template status must be template_not_evidence_do_not_run');
}
if (!fixtureTemplate.template_policy || fixtureTemplate.template_policy.do_not_treat_as_approved_sample !== true) {
  fail('fixture template must explicitly say it is not approved evidence');
}
if (fixtureTemplate.template_policy.required_status_after_human_approval !== 'approved_for_mtu_h5_regression') {
  fail('fixture template must name approved_for_mtu_h5_regression as post-review status');
}
for (const key of AUTHORITY_FALSE_KEYS) {
  requireFalse(fixtureTemplate.authority_boundary, key, 'fixture_template.authority_boundary');
}
const templateDefects = requireArray(fixtureTemplate, 'required_defect_classes', 'fixture template', REQUIRED_DEFECT_CLASSES.length);
for (const defectClass of REQUIRED_DEFECT_CLASSES) {
  if (!templateDefects.includes(defectClass)) fail(`fixture template missing defect class ${defectClass}`);
}
requireArray(fixtureTemplate, 'records', 'fixture template');
requireArray(fixtureTemplate, 'negative_fixtures', 'fixture template');

if (reviewCandidate.schema_version !== 1) fail('review candidate schema_version must be 1');
if (reviewCandidate.sprint_id !== 'MTU-H5') fail('review candidate sprint_id must be MTU-H5');
if (reviewCandidate.status !== 'review_candidate_for_mtu_h5_regression') {
  fail('review candidate status must be review_candidate_for_mtu_h5_regression');
}
if (reviewCandidate.review_packet !== 'reports/review-gates/GATE-MTU-H5-mapping-regression/review-packet.json') {
  fail('review candidate review_packet mismatch');
}
if (reviewCandidate.source_basis?.fresh_relative_to_h1 !== true) {
  fail('review candidate must declare fresh_relative_to_h1 true');
}
for (const seedCase of H1_SEED_CASES) {
  if (!reviewCandidate.source_basis.h1_seed_cases_excluded.includes(seedCase)) {
    fail(`review candidate h1_seed_cases_excluded missing ${seedCase}`);
  }
}
for (const key of AUTHORITY_FALSE_KEYS) {
  requireFalse(reviewCandidate.authority_boundary, key, 'review_candidate.authority_boundary');
}
const candidateRecords = requireArray(reviewCandidate, 'records', 'review candidate', 4);
const candidateRecordIds = candidateRecords.map((record) => record.record_id);
for (const recordId of REVIEW_CANDIDATE_RECORD_IDS) {
  if (!candidateRecordIds.includes(recordId)) fail(`review candidate missing record ${recordId}`);
}
let candidateHasMissingMtuExpectation = false;
let candidateHasForbiddenMtu = false;
let candidateHasAnswerFormGap = false;
let candidateHasScaleHook = false;
let candidateHasIncidenceHook = false;
let candidateHasProcedureHook = false;
let candidateHasForbiddenRouteTag = false;
let candidateHasMissingAnswerFormExpected = false;
let candidateHasUnitPeriodConversion = false;
let candidateHasProcedureUnitIds = false;
for (const record of candidateRecords) {
  if (String(record.record_id || '').includes('solo:')) fail(`review candidate contains H1 Solo seed case: ${record.record_id}`);
  if (!hasText(record.question_word)) fail(`${record.record_id} must include question_word`);
  if (!record.source_locator || !record.source_locator.exam || !record.source_locator.question_num) {
    fail(`${record.record_id} must include source_locator exam and question_num`);
  }
  const evidencePaths = requireArray(record, 'source_evidence_paths', record.record_id, 2);
  for (const evidencePath of evidencePaths) {
    if (!evidenceExists(evidencePath)) fail(`${record.record_id} missing evidence path ${evidencePath}`);
  }
  const operations = requireArray(record, 'official_correction_model_operations', record.record_id, 1);
  for (const operation of operations) {
    if (!hasText(operation.operation_id)) fail(`${record.record_id} operation missing operation_id`);
    if (!hasText(operation.description) && !hasText(operation.answer_model_summary)) {
      fail(`${record.record_id}:${operation.operation_id} must include description or answer_model_summary`);
    }
    if (operation.missing_mtu_expected === true) candidateHasMissingMtuExpectation = true;
    if (operation.expected_forbidden_mtu_ids?.length > 0) candidateHasForbiddenMtu = true;
    if (Array.isArray(operation.expected_answer_form_mtu_ids) && operation.expected_answer_form_mtu_ids.length === 0) {
      candidateHasAnswerFormGap = true;
    }
    if (operation.scale_factor_expected === true) candidateHasScaleHook = true;
    if (operation.unit_period_conversion_expected === true) candidateHasUnitPeriodConversion = true;
    if (operation.incidence_or_pass_through_expected === true) candidateHasIncidenceHook = true;
    if (operation.expected_route_tags?.includes('procedure')) candidateHasProcedureHook = true;
    if (operation.expected_forbidden_route_tags?.length > 0) candidateHasForbiddenRouteTag = true;
    if (operation.missing_answer_form_expected === true) candidateHasMissingAnswerFormExpected = true;
    if (operation.expected_procedure_unit_ids?.length > 0) candidateHasProcedureUnitIds = true;
    requireArray(operation, 'expected_route_tags', `${record.record_id}:${operation.operation_id}`, 2);
    if (!Array.isArray(operation.expected_required_mtu_ids)) {
      fail(`${record.record_id}:${operation.operation_id} must include expected_required_mtu_ids array`);
    }
    if (!Array.isArray(operation.expected_forbidden_mtu_ids)) {
      fail(`${record.record_id}:${operation.operation_id} must include expected_forbidden_mtu_ids array`);
    }
    if (!Array.isArray(operation.expected_forbidden_route_tags)) {
      fail(`${record.record_id}:${operation.operation_id} must include expected_forbidden_route_tags array`);
    }
    if (!Array.isArray(operation.expected_answer_form_mtu_ids)) {
      fail(`${record.record_id}:${operation.operation_id} must include expected_answer_form_mtu_ids array`);
    }
    if (!Array.isArray(operation.expected_misconception_refs)) {
      fail(`${record.record_id}:${operation.operation_id} must include expected_misconception_refs array`);
    }
  }
}
const q19Record = candidateRecords.find((record) => record.record_id === 'vw-1022-a-25-1-o:opgave-4:question-19');
if (!q19Record) fail('review candidate missing q19 record');
const q19OperationIds = q19Record.official_correction_model_operations.map((operation) => operation.operation_id);
for (const q19OperationId of ['q19-step-1', 'q19-step-2', 'q19-step-3']) {
  if (!q19OperationIds.includes(q19OperationId)) fail(`q19 operation decomposition missing ${q19OperationId}`);
}
if (!candidateHasMissingMtuExpectation) fail('review candidate must include an explicit missing-MTU expectation');
if (!candidateHasForbiddenMtu) fail('review candidate must include forbidden MTU over-trigger evidence');
if (!candidateHasAnswerFormGap) fail('review candidate must include a reviewed answer-form gap');
if (!candidateHasMissingAnswerFormExpected) fail('review candidate must include missing_answer_form_expected for the q19 teken gap');
if (!candidateHasScaleHook) fail('review candidate must include scale-factor evidence');
if (!candidateHasUnitPeriodConversion) fail('review candidate must distinguish q3 unit/period conversion from scale-factor evidence');
if (!candidateHasIncidenceHook) fail('review candidate must include incidence/pass-through evidence');
if (!candidateHasProcedureHook) fail('review candidate must include procedure route hooks');
if (!candidateHasProcedureUnitIds) fail('review candidate must include expected_procedure_unit_ids');
if (!candidateHasForbiddenRouteTag) fail('review candidate must include explicit expected_forbidden_route_tags');
const negativeFixtures = requireArray(reviewCandidate, 'negative_fixtures', 'review candidate', 1);
const negativeFixture = negativeFixtures.find((fixture) => fixture.fixture_id === 'negative-solo-q2-function-construction-overtrigger');
if (!negativeFixture) fail('review candidate missing negative-solo-q2-function-construction-overtrigger');
if (negativeFixture.expected_status !== 'fail') fail('negative fixture expected_status must be fail');
if (negativeFixture.mutated_fixture_only !== true) fail('negative fixture mutated_fixture_only must be true');
if (!negativeFixture.reintroduced_defect_classes.includes('function_construction_route_triggered_when_point_calculation_enough')) {
  fail('negative fixture must reintroduce function_construction_route_triggered_when_point_calculation_enough');
}
const negativeOperation = negativeFixture.records?.[0]?.official_correction_model_operations?.[0];
if (!negativeOperation?.expected_forbidden_route_tags?.includes('function_construction')) {
  fail('negative fixture must explicitly forbid function_construction route tag');
}
for (const required of [
  'review_candidate_for_mtu_h5_regression',
  'approved_for_mtu_h5_regression',
  'q3',
  'q15',
  'q19',
  'q27',
  'No protected reference mutation',
]) {
  requireIncludes(reviewCandidateMd, required, 'review candidate markdown');
}

if (packet.status === 'blocked_no_approved_fresh_sample') {
  const scaffold = spawnSync(process.execPath, [rel(MAPPING_CHECKER), '--allow-blocked', '--json'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (scaffold.status !== 0) {
    process.stderr.write(scaffold.stdout || '');
    process.stderr.write(scaffold.stderr || '');
    fail('mapping regression scaffold must pass in --allow-blocked mode');
  }
  let scaffoldResult;
  try {
    scaffoldResult = JSON.parse(scaffold.stdout);
  } catch (error) {
    fail(`mapping regression scaffold did not emit JSON: ${error.message}`);
  }
  if (scaffoldResult.status !== 'blocked') fail('mapping regression scaffold must report blocked without approved fixture');
  if (!scaffoldResult.buckets || !Array.isArray(scaffoldResult.buckets.blocked) || scaffoldResult.buckets.blocked.length === 0) {
    fail('mapping regression scaffold must include blocked bucket entries');
  }
}

const candidateCheck = spawnSync(process.execPath, [
  rel(MAPPING_CHECKER),
  '--fixture',
  rel(REVIEW_CANDIDATE),
  '--allow-review-candidate',
  '--expect-fail',
  '--json',
], {
  cwd: ROOT,
  encoding: 'utf8',
});
if (candidateCheck.status !== 0) {
  process.stderr.write(candidateCheck.stdout || '');
  process.stderr.write(candidateCheck.stderr || '');
  fail('mapping regression checker must validate the review-candidate fixture in expected-fail mode');
}
let candidateResult;
try {
  candidateResult = JSON.parse(candidateCheck.stdout);
} catch (error) {
  fail(`mapping regression review-candidate check did not emit JSON: ${error.message}`);
}
if (candidateResult.status !== 'failed') fail('review-candidate fixture must currently produce failed status');
if (candidateResult.buckets.blocked.length !== 0) fail('review-candidate fixture must not produce blocked assertions');
const candidateFailedDefects = new Set(candidateResult.buckets.failed.map((entry) => entry.defect_class));
for (const defectClass of REVIEW_CANDIDATE_FAILED_DEFECT_CLASSES) {
  if (!candidateFailedDefects.has(defectClass)) fail(`review-candidate checker output missing failed defect ${defectClass}`);
}
const negativePass = candidateResult.buckets.passed.find((entry) => (
  entry.assertion_id === 'MTUH5-NEGATIVE-negative-solo-q2-function-construction-overtrigger-FAILS-AS-EXPECTED'
));
if (!negativePass) fail('review-candidate checker output missing negative fixture pass record');
if (!negativePass.defect_classes.includes('function_construction_route_triggered_when_point_calculation_enough')) {
  fail('negative fixture pass record must name the reintroduced function-construction defect class');
}
if (candidateResult.buckets.review_required.length === 0) {
  fail('review-candidate checker output must include review_required hooks');
}
const procedureStatuses = new Set(candidateResult.procedure_checks.map((entry) => entry.status));
for (const status of ['procedure_present', 'procedure_review_required']) {
  if (!procedureStatuses.has(status)) fail(`review-candidate procedure checks missing ${status}`);
}

if (packet.status !== 'blocked_no_approved_fresh_sample') {
  const approved = readJson(APPROVED_FIXTURE);
  if (approved.status !== 'approved_for_mtu_h5_regression') {
    fail('approved fixture status must be approved_for_mtu_h5_regression');
  }
  if (approved.sample_id !== reviewCandidate.sample_id) {
    fail('approved fixture sample_id must match repaired review candidate');
  }
  const approvedCheck = spawnSync(process.execPath, [
    rel(MAPPING_CHECKER),
    '--fixture',
    rel(APPROVED_FIXTURE),
    '--expect-fail',
    '--json',
  ], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (approvedCheck.status !== 0) {
    process.stderr.write(approvedCheck.stdout || '');
    process.stderr.write(approvedCheck.stderr || '');
    fail('mapping regression checker must validate approved fixture in expected-fail diagnostic mode');
  }
  let approvedResult;
  try {
    approvedResult = JSON.parse(approvedCheck.stdout);
  } catch (error) {
    fail(`mapping regression approved fixture check did not emit JSON: ${error.message}`);
  }
  if (approvedResult.status !== 'failed') fail('approved fixture must currently produce diagnostic failed status');
  if (approvedResult.buckets.blocked.length !== 0) fail('approved fixture must not produce blocked assertions');
  const approvedProcedureStatuses = new Set(approvedResult.procedure_checks.map((entry) => entry.status));
  for (const status of ['procedure_present', 'procedure_review_required']) {
    if (!approvedProcedureStatuses.has(status)) fail(`approved procedure checks missing ${status}`);
  }
  const reportJson = readJson(REGRESSION_REPORT_JSON);
  if (reportJson.status !== approvedResult.status) fail('regression report JSON status must match approved checker status');
  if (reportJson.fixture_id !== approvedResult.fixture_id) fail('regression report JSON fixture_id must match approved checker output');
  const reportMd = readText(REGRESSION_REPORT_MD);
  for (const required of ['MTU-H5 Regression Report', 'procedure_present', 'procedure_review_required', 'No protected reference mutation']) {
    requireIncludes(reportMd, required, 'regression report markdown');
  }
  const closure = readJson(GATE_CLOSURE_JSON);
  if (closure.verdict !== 'APPROVED_WITH_ADMINISTRATIVE_REMOTE_CLOSURE_REPAIR') fail('gate closure verdict mismatch');
  if (!/^[0-9a-f]{40}$/.test(String(closure.remote_evidence_closure?.reviewed_remote_commit_hash || ''))) {
    fail('gate closure must record a 40-character reviewed remote commit hash');
  }
  if (closure.remote_evidence_closure?.status !== 'recorded') fail('gate closure remote evidence status must be recorded');
  requireIncludes(readText(GATE_CLOSURE_MD), 'Reviewed remote commit', 'gate closure markdown');
}

for (const required of [
  'Exact Evidence Needed',
  'Required Defect-Class Hooks',
  'No protected reference mutation',
  'Review Candidate Fixture',
  'MTU-H5-blocked-stop-result.md',
  'GATE-MTU-H5-mapping-regression',
  'check-mtu-h5-mapping-regression.js',
  'mtu-h5-regression-fixture.template.json',
]) {
  requireIncludes(packetMd, required, 'packet markdown');
}
if (packet.status !== 'blocked_no_approved_fresh_sample') {
  requireIncludes(packetMd, 'Approved Fixture', 'packet markdown');
} else {
  requireIncludes(packetMd, 'No approved fresh MTU-H5 sample', 'packet markdown');
}
for (const required of [
  'Required Evidence To Proceed',
  'node build-scripts/references/check-mtu-h5-sample-selection-packet.js',
  'node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.review-candidate.json --allow-review-candidate --expect-fail --json',
  'mtu-h5-regression-fixture.template.json',
  'node build-scripts/reports/validate-report-json.js',
  'npm.cmd run check:platform',
  'No protected reference mutation authorized',
  'No authored',
  'target-exercise mutation authorized',
  'No candidate storage or candidate writes authorized',
]) {
  requireIncludes(resultLog, required, 'blocked-stop result log');
}
if (packet.status !== 'blocked_no_approved_fresh_sample') {
  for (const required of [
    'approved_with_administrative_remote_closure_repair',
    'reports/mtu-hardening/mtu-h5-regression-fixture.json',
    'node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --expect-fail --json',
    'reviewed remote commit/hash is recorded',
  ]) {
    requireIncludes(resultLog, required, 'MTU-H5 result log');
  }
} else {
  for (const required of [
    'blocked_no_approved_fresh_sample',
    'No approved fresh MTU-H5 sample',
    'node build-scripts/references/check-mtu-h5-mapping-regression.js --allow-blocked --json',
  ]) {
    requireIncludes(resultLog, required, 'blocked-stop result log');
  }
}
for (const taxonomyTerm of [
  'operation_unit_missing',
  'answer_form_missing',
  'over_trigger_function_construction',
  'over_trigger_derivative_route',
  'scale_factor_handling_missing',
  'misconception_tag_missing',
]) {
  requireIncludes(taxonomy, taxonomyTerm, 'failure taxonomy');
}

console.log(`OK MTU-H5 sample-selection packet: ${packet.status}`);
