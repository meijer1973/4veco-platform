#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  ValidationError,
  validateSourceExtractionDocument,
} = require('./lib/exam-ingestion-candidate-validation');
const {
  buildRawReferenceUrl,
  buildRawUrl,
  parseRepoFromPackageJson,
} = require('../sprints/emit-gate-bundle-urls.js');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-answer-form-equivalent-execution-gate-1.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-answer-form-equivalent-execution-gate-1.md');
const GATE_DIR = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-answer-form-equivalent-execution-gate-1');
const GATE_JSON = path.join(GATE_DIR, 'review-packet.json');
const GATE_MD = path.join(GATE_DIR, 'review-packet.md');
const GATE_BUNDLE = path.join(GATE_DIR, 'bundle-urls.md');
const URL_INDEX = path.join(ROOT, 'reports', 'url-index.md');
const AGENT_INDEX = path.join(ROOT, 'reports', 'github-agent-index-platform.md');
const AGENT_INDEX_JSON = path.join(ROOT, 'reports', 'github-agent-index-platform.json');

const PRIOR_CHECKER = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-q19-answer-form-gate-1.js');
const PRIOR_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-answer-form-gate-1.json');
const PRIOR_REVIEW = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-answer-form-gate-1', 'review-packet.json');
const SOURCE_OVERLAY = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'source-annex-extraction-overlays.json');
const REGRESSION_REPORT_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.json');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');
const ITEM_OVERLAY = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'exam-item-overlays.json');

const EXPECTED_GATE = 'GATE-MTU-H5-Q19-answer-form-equivalent-execution-gate-1';
const EXPECTED_PACKET = 'MTU-H5-Q19-answer-form-equivalent-execution-gate-1';
const REVIEW_BRANCH = 'codex/mtu-h5-q19-answer-form-equivalent-execution-gate-1-20260616';
const TARGET_SURFACE = 'reports/mtu-hardening/mtu-h5-regression-fixture.json';
const Q19_RECORD_ID = 'vw-1022-a-25-1-o:opgave-4:question-19';
const Q3_RECORD_ID = 'vw-1022-a-25-1-o:opgave-1:question-3';
const ANSWER_SKILL_ID = 'EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION';
const ANSWER_REF = 'reports/mtu-hardening/mtu-h5-q19-answer-form-equivalent-execution-gate-1.json#EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION';
const ANSWER_HOOK = 'graph/draw/teken answer-form MTU or reviewed equivalent still needed';
const AGGREGATE_SUPPLY_CAVEAT =
  'Correct aggregate-supply shifts for q19-step-2 and q19-step-3 are accepted as an alternative in the official correction model.';

const GRAPH_IDS = [
  'EX_SRC_Q19_CURACAO_LABOR_MARKET_GRAPH',
  'EX_SRC_Q19_CURACAO_GOODS_MARKET_GRAPH',
  'EX_SRC_Q19_ARUBA_GOODS_MARKET_GRAPH',
];

const SOURCE_IDS = [
  'EX_SRC_Q19_SOURCE_FIGURE',
  'EX_SRC_Q19_UITWERKBIJLAGE',
];

const Q19_STEPS = ['q19-step-1', 'q19-step-2', 'q19-step-3'];
const FORBIDDEN_ROUTE_TAGS = ['full_graph_construction', 'calculus_route', 'function_construction'];
const REQUIRED_Q19_FAILED_ASSERTIONS = Q19_STEPS.map((step) => (
  `${Q19_RECORD_ID}:${step}:ASSERT-ANSWER-FORM-MISSING`
));

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
  'source_annex_extraction_execution_authorized',
  'graph_object_extraction_execution_authorized',
  'fixture_mutation_authorized',
  'mapper_repair_authorized',
  'checker_repair_authorized',
  'lesson_output_mutation_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'sequencing_authorized',
  'student_facing_ai_authorized',
  'summative_use_authorized',
  'pv_projection_authorized',
  'pv_machine_promotion_authorized',
  'pv_graph_mutation_authorized',
  'target_exercise_promotion_authorized',
  'cp6_closure_authorized',
  'year1_closure_authorized',
  'student_product_use_authorized',
  'product_route_readiness_claimed',
  'execution_authorized_now',
];

const REQUIRED_VALIDATION_COMMANDS = [
  'node --check build-scripts/references/check-mtu-h5-q19-answer-form-equivalent-execution-gate-1.js',
  'node build-scripts/references/check-mtu-h5-q19-answer-form-equivalent-execution-gate-1.js',
  'node build-scripts/references/check-mtu-h5-q19-answer-form-gate-1.js',
  'node build-scripts/references/build-mtu-h5-regression-report.js --check',
  'node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --expect-fail --json',
  'node build-scripts/reports/validate-report-json.js',
  'node build-scripts/sprints/emit-url-index.js --check',
  'npm run agent:index',
  'npm run check:platform',
];

function fail(message) {
  console.error(`MTU-H5 q19 answer-form equivalent execution gate 1 check failed: ${message}`);
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
  try {
    return JSON.parse(readText(file));
  } catch (error) {
    fail(`invalid JSON in ${rel(file)}: ${error.message}`);
  }
}

function requireIncludes(values, value, context) {
  if (!Array.isArray(values) || !values.includes(value)) fail(`${context} must include ${value}`);
}

function requireIncludesAll(values, required, context) {
  for (const value of required) requireIncludes(values, value, context);
}

function requireTextIncludes(text, needle, context) {
  if (!text.includes(needle)) fail(`${context} must include ${needle}`);
}

function requireFalseBoundary(boundary, context) {
  for (const key of AUTHORITY_FALSE_KEYS) {
    if (!boundary || boundary[key] !== false) fail(`${context}.${key} must be false`);
  }
}

function records(fixture) {
  return fixture.records || fixture.question_records || [];
}

function findRecord(fixture, recordId) {
  const record = records(fixture).find((item) => item.record_id === recordId);
  if (!record) fail(`fixture missing record: ${recordId}`);
  return record;
}

function findOperation(q19, operationId) {
  const operation = (q19.official_correction_model_operations || []).find((item) => item.operation_id === operationId);
  if (!operation) fail(`q19 fixture missing operation ${operationId}`);
  return operation;
}

function runNode(script, args = []) {
  const run = spawnSync(process.execPath, [rel(script), ...args], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (run.status !== 0) {
    process.stderr.write(run.stdout || '');
    process.stderr.write(run.stderr || '');
    fail(`${rel(script)} failed`);
  }
  return run.stdout;
}

function runH5Validator(fixturePath = FIXTURE) {
  const fixtureArg = path.isAbsolute(fixturePath) ? fixturePath : rel(fixturePath);
  const stdout = runNode(H5_VALIDATOR, ['--fixture', fixtureArg, '--expect-fail', '--json']);
  try {
    return JSON.parse(stdout);
  } catch (error) {
    fail(`MTU-H5 validator did not emit JSON: ${error.message}`);
  }
}

function assertionIds(result, bucket) {
  return (result.buckets?.[bucket] || []).map((item) => item.assertion_id);
}

function countForRecord(result, bucket, recordId) {
  return (result.buckets?.[bucket] || []).filter((item) => item.record_id === recordId).length;
}

function allQ19SourceRecords(doc) {
  return [...(doc.graph_overlays || []), ...(doc.source_annex_overlays || [])]
    .filter((record) => record.source_exam_item_id === Q19_RECORD_ID);
}

function requirePriorGateContinuity(packet) {
  runNode(PRIOR_CHECKER);
  const priorPacket = readJson(PRIOR_PACKET);
  const priorReview = readJson(PRIOR_REVIEW);
  if (priorPacket.gate_id !== 'GATE-MTU-H5-Q19-answer-form-gate-1') fail('prior q19 answer-form gate id mismatch');
  if (priorReview.requested_decision?.valid_decisions?.includes('approve_reviewed_equivalent_candidate_path') !== true) {
    fail('prior q19 answer-form gate must expose approve_reviewed_equivalent_candidate_path');
  }
  if (packet.original_sprint_gate_spec?.immediate_prior_gate_pr !== 73) fail('packet must cite PR #73');
  if (packet.original_sprint_gate_spec?.immediate_prior_gate_merge_commit !== '406f6358f477cfd50361855c45183da8c9f90990') {
    fail('packet must cite PR #73 merge commit');
  }
  if (packet.original_sprint_gate_spec?.approved_decision !== 'approve_reviewed_equivalent_candidate_path') {
    fail('packet must cite approved reviewed-equivalent decision');
  }
}

function requireCurrentDiagnosticState(packet) {
  const report = readJson(REGRESSION_REPORT_JSON);
  const counts = report.question_bucket_counts || {};
  if (counts.q3?.failed !== 0 || counts.q3?.review_required !== 0) fail('report q3 counts must remain 0/0');
  if (counts.q19?.failed !== 3 || counts.q19?.review_required !== 20) fail('report q19 counts must remain 3/20');
  if (counts.q27?.failed !== 3 || counts.q27?.review_required !== 5) fail('report q27 counts must remain 3/5');
  if (counts.q15?.failed !== 0 || counts.q15?.review_required !== 4) fail('report q15 counts must remain 0/4');
  if (packet.current_diagnostic_state?.q19?.failed !== 3 || packet.current_diagnostic_state?.q19?.review_required !== 20) {
    fail('packet q19 current diagnostic state must be 3/20');
  }

  const result = runH5Validator();
  requireIncludesAll(assertionIds(result, 'failed'), REQUIRED_Q19_FAILED_ASSERTIONS, 'live validator failed assertions');
  if (countForRecord(result, 'failed', Q3_RECORD_ID) !== 0 || countForRecord(result, 'review_required', Q3_RECORD_ID) !== 0) {
    fail('q3 must remain clean');
  }
  if (!assertionIds(result, 'passed').includes('MTUH5-NEGATIVE-negative-solo-q2-function-construction-overtrigger-FAILS-AS-EXPECTED')) {
    fail('inherited Solo q1-q3 negative fixture guard must remain passing');
  }
}

function requireSourceOverlay() {
  const overlay = readJson(SOURCE_OVERLAY);
  try {
    validateSourceExtractionDocument(overlay, 'source-annex extraction overlay');
  } catch (error) {
    fail(error instanceof ValidationError ? error.message : String(error));
  }
  const graphIds = (overlay.graph_overlays || []).map((record) => record.extraction_id);
  const sourceIds = (overlay.source_annex_overlays || []).map((record) => record.extraction_id);
  requireIncludesAll(graphIds, GRAPH_IDS, 'source overlay graph ids');
  requireIncludesAll(sourceIds, SOURCE_IDS, 'source overlay source-annex ids');
  for (const record of allQ19SourceRecords(overlay)) {
    if (record.extraction_status !== 'partial_with_blocking_gap') fail(`${record.extraction_id}.extraction_status must remain partial_with_blocking_gap`);
    if (record.review_state !== 'blocked') fail(`${record.extraction_id}.review_state must remain blocked`);
    requireIncludesAll(record.blocking_gap_ids || [], ['q19-source-annex-gap', 'q19-graph-object-gap'], `${record.extraction_id}.blocking_gap_ids`);
  }
}

function requireCurrentFixtureShape() {
  const fixture = readJson(FIXTURE);
  const q19 = findRecord(fixture, Q19_RECORD_ID);
  if (q19.question_word !== 'teken') fail('q19 question_word must remain teken');
  requireIncludesAll(q19.mapped_mtu_ids || [], ['A42', 'D10', 'D13', 'A81'], 'q19 mapped_mtu_ids');
  if ((q19.mapped_mtu_ids || []).includes('A45')) fail('q19 mapped_mtu_ids must not include A45');
  for (const operationId of Q19_STEPS) {
    const operation = findOperation(q19, operationId);
    if (operation.missing_answer_form_expected !== true) fail(`${operationId}.missing_answer_form_expected must remain true in this PR`);
    if ((operation.answer_form_reviewed_equivalent_refs || []).length > 0) fail(`${operationId}.answer_form_reviewed_equivalent_refs must not exist in this PR`);
    requireIncludes(operation.review_required_hooks || [], ANSWER_HOOK, `${operationId}.review_required_hooks`);
    requireIncludes(operation.expected_forbidden_mtu_ids || [], 'A45', `${operationId}.expected_forbidden_mtu_ids`);
    requireIncludesAll(operation.expected_forbidden_route_tags || [], FORBIDDEN_ROUTE_TAGS, `${operationId}.expected_forbidden_route_tags`);
  }
}

function requireOfficialContinuity() {
  const itemDoc = readJson(ITEM_OVERLAY);
  const item = (itemDoc.records || []).find((record) => record.exam_item_id === Q19_RECORD_ID);
  if (!item) fail('exam-item overlays must contain q19');
  if (item.prompt_metadata?.instruction_word !== 'teken') fail('q19 item overlay instruction_word must be teken');
  const alternatives = item.official_answer_model?.accepted_alternatives || [];
  const aggregateSupplyAlternative = alternatives.find((alternative) => (
    String(alternative.description || '').includes('aggregate-supply')
  ));
  if (!aggregateSupplyAlternative) fail('q19 item overlay must preserve aggregate-supply accepted alternative');
  requireIncludesAll(aggregateSupplyAlternative.applies_to_step_ids || [], ['q19-step-2', 'q19-step-3'], 'q19 aggregate-supply accepted alternative operation ids');
}

function requireFuturePlan(packet) {
  const plan = packet.future_exact_write_plan || {};
  if (plan.target_surface !== TARGET_SURFACE) fail('future plan target surface mismatch');
  if (plan.target_record_id !== Q19_RECORD_ID) fail('future plan target q19 record mismatch');
  if (plan.this_packet_writes_target_surface !== false) fail('future plan must not write target surface now');
  if (plan.later_execution_pr_required_after_human_approval !== true) fail('future plan must require a later execution PR');
  if (plan.reviewed_equivalent_ref_to_add !== ANSWER_REF) fail('future plan reviewed equivalent ref mismatch');
  const updates = plan.operation_updates || [];
  if (updates.length !== Q19_STEPS.length) fail('future plan must contain exactly three q19 operation updates');
  for (const operationId of Q19_STEPS) {
    const update = updates.find((item) => item.operation_id === operationId);
    if (!update) fail(`future plan missing ${operationId}`);
    requireIncludes(update.add_fields?.answer_form_reviewed_equivalent_refs || [], ANSWER_REF, `${operationId}.answer_form_reviewed_equivalent_refs`);
    if (update.update_fields?.missing_answer_form_expected !== false) fail(`${operationId}.missing_answer_form_expected future value must be false`);
    requireIncludes(update.remove_review_required_hooks || [], ANSWER_HOOK, `${operationId}.remove_review_required_hooks`);
    requireIncludes(update.must_preserve_forbidden_mtu_ids || [], 'A45', `${operationId}.must_preserve_forbidden_mtu_ids`);
    requireIncludesAll(update.must_preserve_forbidden_route_tags || [], FORBIDDEN_ROUTE_TAGS, `${operationId}.must_preserve_forbidden_route_tags`);
    if (['q19-step-2', 'q19-step-3'].includes(operationId) && update.must_preserve_caveat !== AGGREGATE_SUPPLY_CAVEAT) {
      fail(`${operationId}.must_preserve_caveat mismatch`);
    }
  }
  requireIncludesAll(plan.fields_that_must_not_change_later_under_this_plan || [], [
    'mapped_mtu_ids',
    'expected_forbidden_mtu_ids',
    'expected_forbidden_route_tags',
    'source-annex-extraction-overlays.json',
    'references/machine/micro-teaching-units.json',
    'references/machine/micro-teaching-units.md',
    'references/authored/course-target-exercises.json',
  ], 'future plan forbidden change fields');
}

function applyExactFuturePlan(fixture, packet) {
  const clone = JSON.parse(JSON.stringify(fixture));
  const q19 = findRecord(clone, Q19_RECORD_ID);
  for (const update of packet.future_exact_write_plan.operation_updates) {
    const operation = findOperation(q19, update.operation_id);
    operation.answer_form_reviewed_equivalent_refs = [...update.add_fields.answer_form_reviewed_equivalent_refs];
    operation.missing_answer_form_expected = update.update_fields.missing_answer_form_expected;
    operation.review_required_hooks = (operation.review_required_hooks || [])
      .filter((hook) => !(update.remove_review_required_hooks || []).includes(hook));
  }
  return clone;
}

function missingRequiredHook(fixture) {
  const q19 = findRecord(fixture, Q19_RECORD_ID);
  const requiredByOperation = new Map([
    ['q19-step-1', ['q19-source-annex-gap remains blocking', 'q19-graph-object-gap remains blocking']],
    ['q19-step-2', ['q19 chained multi-market reasoning remains operation_registry_need with D10/D13 partial support']],
    ['q19-step-3', ['q19-source-annex-gap remains blocking', 'q19-graph-object-gap remains blocking', 'q19 third graph-shift element is now modeled but still depends on blocked graph/source reconstruction']],
  ]);
  for (const [operationId, hooks] of requiredByOperation) {
    const operation = findOperation(q19, operationId);
    for (const hook of hooks) {
      if (!(operation.review_required_hooks || []).includes(hook)) return { operationId, hook };
    }
  }
  return null;
}

function requireRequiredHooksPresent(fixture, label) {
  const missing = missingRequiredHook(fixture);
  if (missing) fail(`${label} ${missing.operationId}.review_required_hooks must include ${missing.hook}`);
}

function requireExactFuturePlanDryRun(packet) {
  const fixture = readJson(FIXTURE);
  const clone = applyExactFuturePlan(fixture, packet);
  requireRequiredHooksPresent(clone, 'exact future dry-run');

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mtu-h5-q19-answer-equivalent-dry-run-'));
  const tempFixture = path.join(tempDir, 'fixture.json');
  try {
    fs.writeFileSync(tempFixture, JSON.stringify(clone, null, 2));
    const result = runH5Validator(tempFixture);
    for (const assertionId of REQUIRED_Q19_FAILED_ASSERTIONS) {
      if (assertionIds(result, 'failed').includes(assertionId)) fail(`dry-run must clear ${assertionId}`);
    }
    if (assertionIds(result, 'review_required').some((id) => id.includes(ANSWER_HOOK))) {
      fail('dry-run must clear q19 answer-form-needed review hooks');
    }
    if (countForRecord(result, 'failed', Q19_RECORD_ID) !== 0 || countForRecord(result, 'review_required', Q19_RECORD_ID) !== 17) {
      fail('dry-run q19 counts must be 0 failed / 17 review_required');
    }
    if (countForRecord(result, 'failed', Q3_RECORD_ID) !== 0 || countForRecord(result, 'review_required', Q3_RECORD_ID) !== 0) {
      fail('dry-run q3 must remain clean');
    }
    if (countForRecord(result, 'failed', 'vw-1022-a-25-2-o:opgave-6:question-27') !== 3) {
      fail('dry-run q27 failed count must remain 3');
    }
    if (countForRecord(result, 'review_required', 'vw-1022-a-25-1-o:opgave-3:question-15') !== 4) {
      fail('dry-run q15 review_required count must remain 4');
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function requireSourceGraphHookRemovalNegative(packet) {
  const fixture = readJson(FIXTURE);
  const clone = applyExactFuturePlan(fixture, packet);
  const q19 = findRecord(clone, Q19_RECORD_ID);
  for (const operation of q19.official_correction_model_operations || []) {
    operation.review_required_hooks = (operation.review_required_hooks || [])
      .filter((hook) => !hook.includes('q19-source-annex-gap') && !hook.includes('q19-graph-object-gap'));
  }
  if (!missingRequiredHook(clone)) fail('negative source/graph hook removal fixture must be rejected');
}

function requireA45NegativeGuard() {
  const fixtureClone = readJson(FIXTURE);
  const q19 = findRecord(fixtureClone, Q19_RECORD_ID);
  function addA45(values) {
    if (Array.isArray(values) && !values.includes('A45')) values.push('A45');
  }
  addA45(q19.mapped_mtu_ids);
  for (const operation of q19.official_correction_model_operations || []) addA45(operation.mapped_mtu_ids);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mtu-h5-q19-answer-equivalent-a45-negative-'));
  const tempFixture = path.join(tempDir, 'fixture-with-a45.json');
  try {
    fs.writeFileSync(tempFixture, JSON.stringify(fixtureClone, null, 2));
    const result = runH5Validator(tempFixture);
    const failedIds = assertionIds(result, 'failed');
    for (const id of Q19_STEPS.map((step) => `${Q19_RECORD_ID}:${step}:ASSERT-OVER-TRIGGER`)) {
      requireIncludes(failedIds, id, 'temporary A45 negative failed assertions');
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function requirePacket(packet) {
  if (packet.schema_version !== 1) fail('packet schema_version must be 1');
  if (packet.sprint_id !== 'MTU-H5') fail('packet sprint_id must be MTU-H5');
  if (packet.packet_id !== EXPECTED_PACKET) fail('packet_id mismatch');
  if (packet.gate_id !== EXPECTED_GATE) fail('packet gate_id mismatch');
  if (packet.status !== 'q19_answer_form_equivalent_execution_gate_ready_for_human_review_no_mutation_authorized') fail('packet status mismatch');
  if (packet.review_branch !== REVIEW_BRANCH) fail('packet review_branch mismatch');
  if (packet.packet_result?.completion_claimed !== false) fail('packet must not claim completion');
  if (packet.packet_result?.next_state !== 'ready_for_human_q19_answer_form_equivalent_execution_gate_review') fail('packet next_state mismatch');
  requireFalseBoundary(packet.authority_boundary, 'packet.authority_boundary');
  requireIncludesAll(packet.non_negotiable_requirements || [], [
    'This packet does not mutate reports/mtu-hardening/mtu-h5-regression-fixture.json.',
    'q19 must remain 3 failed / 20 review_required in this PR.',
    'The later exact execution plan may clear only q19 graph/draw/teken answer-form failures and answer-form-needed review hooks.',
    'The later exact execution plan must preserve q19-source-annex-gap and q19-graph-object-gap visibility.',
    'A45 must remain forbidden as primary q19 support.',
  ], 'packet non-negotiable requirements');
  if (packet.reviewed_equivalent_answer_skill?.answer_skill_id !== ANSWER_SKILL_ID) fail('reviewed equivalent answer skill id mismatch');
  if (packet.reviewed_equivalent_answer_skill?.authority_boundary?.fixture_mutation_authorized !== false) fail('answer skill fixture mutation boundary must be false');
  requireFuturePlan(packet);
  const negativeIds = (packet.negative_regression_requirements || []).map((item) => item.guard_id);
  requireIncludesAll(negativeIds, [
    'q19-exact-answer-form-dry-run-positive-guard',
    'q19-source-graph-hook-removal-negative-guard',
    'q19-a45-primary-support-negative-guard',
    'solo-q1-q3-original-defect-class-guard',
  ], 'packet negative guards');
}

function requireGatePacket(gate) {
  if (gate.schema_version !== 1) fail('gate schema_version must be 1');
  if (gate.gate_id !== EXPECTED_GATE) fail('gate id mismatch');
  if (gate.status !== 'pending_human_review') fail('gate status mismatch');
  if (gate.review_standard !== 'REV-STD-1') fail('gate must use REV-STD-1');
  if (!gate.product_end_state || !gate.original_sprint_gate_spec) fail('gate must cite product end-state and original sprint/gate spec');
  requireFalseBoundary(gate.authority_boundary, 'gate.authority_boundary');
  if (gate.requested_decision?.execution_authorized_by_this_packet !== false) fail('gate must not authorize execution by this packet');
  if (gate.requested_decision?.fixture_mutation_authorized_by_this_packet !== false) fail('gate must not authorize fixture mutation');
  if (gate.requested_decision?.later_execution_pr_may_write_if_approved !== true) fail('gate must ask about a later execution PR');
  const checklist = gate.core_requirement_checklist || [];
  if (checklist.length < 9) fail('gate core requirement checklist is incomplete');
  for (const item of checklist) {
    if (item.status !== 'met') fail(`core requirement ${item.requirement_id} must be met; PASS WITH FLAGS cannot carry missing core`);
  }
  requireIncludesAll(checklist.map((item) => item.requirement_id), [
    'core-1-non-mutating-boundary',
    'core-2-prior-human-decision-cited',
    'core-3-exact-future-write-surface',
    'core-4-exact-q19-field-plan',
    'core-5-dry-run-result-bounded',
    'core-6-source-graph-hooks-preserved',
    'core-7-overtrigger-and-route-guards-preserved',
    'core-8-carried-blockers-classified',
    'core-9-remote-discoverability',
  ], 'gate core checklist');
  for (const finding of gate.findings || []) {
    if (!finding.classification) fail(`${finding.finding_id}.classification missing`);
    if (!Array.isArray(finding.blocks)) fail(`${finding.finding_id}.blocks must be an array`);
    if (!Array.isArray(finding.does_not_block) || finding.does_not_block.length === 0) fail(`${finding.finding_id}.does_not_block must be populated`);
    if (!finding.proof_required_to_close) fail(`${finding.finding_id}.proof_required_to_close missing`);
  }
  requireIncludesAll(gate.must_review || [], [
    rel(PACKET_MD),
    rel(PACKET_JSON),
    rel(__filename),
    rel(PRIOR_PACKET),
    rel(SOURCE_OVERLAY),
    rel(REGRESSION_REPORT_JSON),
    rel(FIXTURE),
  ], 'gate must_review');
  if (gate.required_review_team_threshold?.minimum_verdict !== 'MORE_THAN_SATISFIED') fail('review threshold mismatch');
  if (gate.required_review_team_threshold?.all_three_required !== true) fail('all three review agents must be required');
}

function requireRemoteDiscoverability(packet, gate) {
  const bundleMd = readText(GATE_BUNDLE);
  const urlIndexMd = readText(URL_INDEX);
  const agentIndexMd = readText(AGENT_INDEX);
  const agentIndexJson = readJson(AGENT_INDEX_JSON);
  const agentIndexFiles = new Set(Object.values(agentIndexJson.groups || {}).flat());
  const { owner, repo } = parseRepoFromPackageJson();
  if (bundleMd.includes('/https%3A//') || bundleMd.includes('/http%3A//')) {
    fail('gate bundle URLs must preserve external URLs instead of encoding them as raw repository paths');
  }
  const references = new Set([
    ...(gate.must_review || []),
    ...(gate.evidence_base || []),
    rel(GATE_BUNDLE),
    rel(GATE_JSON),
    rel(GATE_MD),
  ]);
  for (const reference of references) {
    const url = buildRawReferenceUrl(owner, repo, packet.review_branch, reference);
    requireTextIncludes(bundleMd, url, 'gate bundle URLs');
  }
  const mainBundleUrl = buildRawUrl(owner, repo, 'main', rel(GATE_BUNDLE));
  requireTextIncludes(urlIndexMd, mainBundleUrl, 'reports/url-index.md');
  for (const reference of [
    rel(PACKET_JSON),
    rel(PACKET_MD),
    rel(__filename),
    rel(GATE_BUNDLE),
    rel(GATE_JSON),
    rel(GATE_MD),
  ]) {
    requireTextIncludes(agentIndexMd, reference, 'reports/github-agent-index-platform.md');
    if (!agentIndexFiles.has(reference)) fail(`reports/github-agent-index-platform.json must include ${reference}`);
  }
}

function main() {
  const packet = readJson(PACKET_JSON);
  const packetMd = readText(PACKET_MD);
  const gate = readJson(GATE_JSON);
  const gateMd = readText(GATE_MD);

  requirePacket(packet);
  requireGatePacket(gate);
  requirePriorGateContinuity(packet);
  requireCurrentDiagnosticState(packet);
  requireSourceOverlay();
  requireCurrentFixtureShape();
  requireOfficialContinuity();
  requireExactFuturePlanDryRun(packet);
  requireSourceGraphHookRemovalNegative(packet);
  requireA45NegativeGuard();
  requireRemoteDiscoverability(packet, gate);

  for (const command of REQUIRED_VALIDATION_COMMANDS) {
    requireIncludes(packet.validation_commands || [], command, 'packet validation commands');
    requireIncludes(gate.validation_commands || [], command, 'gate validation commands');
  }

  for (const [text, context] of [[packetMd, 'packet markdown'], [gateMd, 'gate markdown']]) {
    for (const required of [
      'MTU-H5',
      'q19',
      'answer-form',
      'EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION',
      'future_exact_write_plan',
      '0 failed / 17 review_required',
      'partial_with_blocking_gap',
      'A45',
      'student/product use',
    ]) {
      requireTextIncludes(text, required, context);
    }
  }

  console.log('OK MTU-H5 q19 answer-form equivalent execution gate 1: ready_for_human_review_no_mutation_authorized');
}

main();
