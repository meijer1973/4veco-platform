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
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-answer-form-gate-1.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-answer-form-gate-1.md');
const GATE_DIR = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-answer-form-gate-1');
const GATE_JSON = path.join(GATE_DIR, 'review-packet.json');
const GATE_MD = path.join(GATE_DIR, 'review-packet.md');
const GATE_BUNDLE = path.join(GATE_DIR, 'bundle-urls.md');
const URL_INDEX = path.join(ROOT, 'reports', 'url-index.md');
const AGENT_INDEX = path.join(ROOT, 'reports', 'github-agent-index-platform.md');
const AGENT_INDEX_JSON = path.join(ROOT, 'reports', 'github-agent-index-platform.json');

const SOURCE_OVERLAY = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'source-annex-extraction-overlays.json');
const REGRESSION_REPORT_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.json');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');
const CONTRACT = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'operation-answer-skill-contract.json');
const ITEM_OVERLAY = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'exam-item-overlays.json');
const ANSWER_OVERLAY = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'exam-answer-model-overlays.json');
const PROCEDURE_PACKAGE_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-procedure-semantic-fit-package-1.json');
const PROCEDURE_GATE_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-procedure-semantic-fit-execution-gate-1', 'review-packet.json');
const FINAL_Q19_PACKAGE_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-final-resolution-and-closure-bundle-1.json');

const EXPECTED_GATE = 'GATE-MTU-H5-Q19-answer-form-gate-1';
const EXPECTED_PACKET = 'MTU-H5-Q19-answer-form-gate-1';
const REVIEW_BRANCH = 'codex/mtu-h5-q19-answer-form-gate-1-20260615';
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

const REQUIRED_Q19_FAILED_ASSERTIONS = [
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-1:ASSERT-ANSWER-FORM-MISSING',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-2:ASSERT-ANSWER-FORM-MISSING',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-3:ASSERT-ANSWER-FORM-MISSING',
];

const REQUIRED_Q19_REVIEW_MARKERS = [
  'q19-source-annex-gap remains blocking',
  'q19-graph-object-gap remains blocking',
  ANSWER_HOOK,
  'q19 chained multi-market reasoning remains operation_registry_need with D10/D13 partial support',
  'q19 third graph-shift element is now modeled but still depends on blocked graph/source reconstruction',
];

const REQUIRED_Q19_POST_EXECUTION_REVIEW_MARKERS = REQUIRED_Q19_REVIEW_MARKERS
  .filter((marker) => marker !== ANSWER_HOOK);

const FORBIDDEN_ROUTE_TAGS = [
  'full_graph_construction',
  'calculus_route',
  'function_construction',
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
  'node --check build-scripts/references/check-mtu-h5-q19-answer-form-gate-1.js',
  'node build-scripts/references/check-mtu-h5-q19-answer-form-gate-1.js',
  'node build-scripts/references/build-mtu-h5-regression-report.js --check',
  'node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --expect-fail --json',
  'node build-scripts/reports/validate-report-json.js',
  'node build-scripts/sprints/emit-url-index.js --check',
  'npm run agent:index',
  'npm run check:platform',
];

function fail(message) {
  console.error(`MTU-H5 q19 answer-form gate 1 check failed: ${message}`);
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

function q19FinalClosureActive() {
  if (!fs.existsSync(FINAL_Q19_PACKAGE_JSON) || !fs.existsSync(REGRESSION_REPORT_JSON)) return false;
  const report = readJson(REGRESSION_REPORT_JSON);
  return report.status === 'passed' &&
    report.question_bucket_counts?.q19?.failed === 0 &&
    report.question_bucket_counts?.q19?.review_required === 0 &&
    report.bucket_totals?.failed === 0 &&
    report.bucket_totals?.review_required === 0;
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

function runH5Validator(fixturePath = FIXTURE) {
  const fixtureArg = path.isAbsolute(fixturePath) ? fixturePath : rel(fixturePath);
  const run = spawnSync(process.execPath, [
    rel(H5_VALIDATOR),
    '--fixture',
    fixtureArg,
    '--expect-fail',
    '--json',
  ], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (run.status !== 0) {
    process.stderr.write(run.stdout || '');
    process.stderr.write(run.stderr || '');
    fail('MTU-H5 validator failed');
  }
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    fail(`MTU-H5 validator did not emit JSON: ${error.message}`);
  }
}

function assertionIds(result, bucket) {
  return (result.buckets?.[bucket] || []).map((item) => item.assertion_id);
}

function records(fixture) {
  return fixture.records || fixture.question_records || [];
}

function findRecord(fixture, recordId) {
  const record = records(fixture).find((item) => item.record_id === recordId);
  if (!record) fail(`fixture missing record: ${recordId}`);
  return record;
}

function allQ19SourceRecords(doc) {
  return [...(doc.graph_overlays || []), ...(doc.source_annex_overlays || [])]
    .filter((record) => record.source_exam_item_id === Q19_RECORD_ID);
}

function q19ProcedurePackageExecuted() {
  if (!fs.existsSync(PROCEDURE_PACKAGE_JSON)) return false;
  const packet = readJson(PROCEDURE_PACKAGE_JSON);
  if (packet.status !== 'executed_after_subagent_lead_approval') return false;
  const gate = readJson(PROCEDURE_GATE_JSON);
  if (gate.status !== 'executed_after_subagent_lead_approval') {
    fail('q19 procedure package is executed but gate packet is not');
  }
  if (packet.subagent_lead_review?.lead_verdict !== 'APPROVE_EXECUTION' ||
      gate.subagent_lead_review?.lead_verdict !== 'APPROVE_EXECUTION') {
    fail('q19 procedure package execution must have lead approval');
  }
  return true;
}

function requireCurrentDiagnosticState(packet) {
  const report = readJson(REGRESSION_REPORT_JSON);
  const counts = report.question_bucket_counts || {};
  if (counts.q3?.failed !== 0 || counts.q3?.review_required !== 0) fail('report q3 counts must remain 0/0');
  const q19IsPreExecution = counts.q19?.failed === 3 && counts.q19?.review_required === 20;
  const q19IsPostExecution = counts.q19?.failed === 0 && counts.q19?.review_required === 17;
  const q19IsPostProcedureExecution = q19ProcedurePackageExecuted() &&
    counts.q19?.failed === 0 &&
    counts.q19?.review_required === 6;
  if (!q19IsPreExecution && !q19IsPostExecution && !q19IsPostProcedureExecution) {
    fail('report q19 counts must be pre-execution 3/20, post-answer-form 0/17, or post-procedure 0/6');
  }
  if (counts.q27?.failed !== 3 || counts.q27?.review_required !== 5) fail('report q27 counts must remain 3/5');
  if (counts.q15?.failed !== 0 || counts.q15?.review_required !== 4) fail('report q15 counts must remain 0/4');
  if (packet.current_diagnostic_state?.q19?.failed !== 3 || packet.current_diagnostic_state?.q19?.review_required !== 20) {
    fail('historical packet q19 diagnostic state must remain 3/20');
  }

  const result = runH5Validator();
  if (q19IsPreExecution) {
    requireIncludesAll(assertionIds(result, 'failed'), REQUIRED_Q19_FAILED_ASSERTIONS, 'live validator failed assertions');
  } else {
    for (const assertionId of REQUIRED_Q19_FAILED_ASSERTIONS) {
      if (assertionIds(result, 'failed').includes(assertionId)) fail(`post-execution validator must clear ${assertionId}`);
    }
    if (assertionIds(result, 'review_required').some((id) => id.includes(ANSWER_HOOK))) {
      fail('post-execution validator must clear q19 answer-form-needed review hooks');
    }
  }
  const expectedMarkers = q19IsPreExecution ? REQUIRED_Q19_REVIEW_MARKERS : REQUIRED_Q19_POST_EXECUTION_REVIEW_MARKERS;
  for (const marker of expectedMarkers) {
    if (!assertionIds(result, 'review_required').some((id) => id.includes(marker))) {
      fail(`live validator must expose q19 review marker: ${marker}`);
    }
  }
  for (const bucket of ['failed', 'review_required']) {
    const q3Items = (result.buckets?.[bucket] || []).filter((item) => item.record_id === Q3_RECORD_ID);
    if (q3Items.length !== 0) fail(`q3 must remain absent from validator ${bucket} bucket`);
  }
  if (!assertionIds(result, 'passed').includes('MTUH5-NEGATIVE-negative-solo-q2-function-construction-overtrigger-FAILS-AS-EXPECTED')) {
    fail('inherited Solo q1-q3 negative fixture guard must remain passing');
  }
}

function requireSourceOverlay(packet) {
  const overlay = readJson(SOURCE_OVERLAY);
  try {
    validateSourceExtractionDocument(overlay, 'source-annex extraction overlay');
  } catch (error) {
    fail(error instanceof ValidationError ? error.message : String(error));
  }
  if (packet.source_overlay_state?.storage_expected_to_exist !== true) fail('packet must state source overlay now exists');
  if (packet.source_overlay_state?.storage_status !== 'future_candidate_storage') fail('packet source overlay storage status mismatch');
  if (overlay.storage_status !== 'future_candidate_storage') fail('source overlay storage_status must be future_candidate_storage');

  const graphIds = (overlay.graph_overlays || []).map((record) => record.extraction_id);
  const sourceIds = (overlay.source_annex_overlays || []).map((record) => record.extraction_id);
  requireIncludesAll(graphIds, GRAPH_IDS, 'source overlay graph ids');
  requireIncludesAll(sourceIds, SOURCE_IDS, 'source overlay source-annex ids');
  if (graphIds.length !== GRAPH_IDS.length || sourceIds.length !== SOURCE_IDS.length) {
    fail('source overlay must contain exactly the three q19 graph records and two q19 source records');
  }
  requireIncludesAll(packet.source_overlay_state?.required_graph_record_ids || [], GRAPH_IDS, 'packet source overlay graph ids');
  requireIncludesAll(packet.source_overlay_state?.required_source_record_ids || [], SOURCE_IDS, 'packet source overlay source ids');

  for (const record of allQ19SourceRecords(overlay)) {
    if (record.extraction_status !== 'partial_with_blocking_gap') fail(`${record.extraction_id}.extraction_status must remain partial_with_blocking_gap`);
    if (record.review_state !== 'blocked') fail(`${record.extraction_id}.review_state must remain blocked`);
    requireIncludesAll(record.blocking_gap_ids || [], ['q19-source-annex-gap', 'q19-graph-object-gap'], `${record.extraction_id}.blocking_gap_ids`);
    if (record.authority_boundary?.student_product_use_authorized !== false) fail(`${record.extraction_id}.student_product_use_authorized must be false`);
  }
}

function requireFixtureQ19Shape() {
  const fixture = readJson(FIXTURE);
  const q19 = findRecord(fixture, Q19_RECORD_ID);
  if (q19.question_word !== 'teken') fail('q19 question_word must remain teken');
  requireIncludesAll(q19.mapped_mtu_ids || [], ['A42', 'D10', 'D13', 'A81'], 'q19 mapped_mtu_ids');
  if ((q19.mapped_mtu_ids || []).includes('A45')) fail('q19 mapped_mtu_ids must not include A45');

  for (const operation of q19.official_correction_model_operations || []) {
    if (!/^q19-step-[123]$/.test(operation.operation_id || '')) fail('unexpected q19 operation id');
    const postExecution = operation.missing_answer_form_expected === false;
    if (operation.missing_answer_form_expected !== true && operation.missing_answer_form_expected !== false) {
      fail(`${operation.operation_id}.missing_answer_form_expected must be a boolean`);
    }
    if ((operation.expected_answer_form_mtu_ids || []).length !== 0) fail(`${operation.operation_id}.expected_answer_form_mtu_ids must remain empty`);
    if (postExecution) {
      if (!Array.isArray(operation.answer_form_reviewed_equivalent_refs) ||
          operation.answer_form_reviewed_equivalent_refs.length !== 1 ||
          operation.answer_form_reviewed_equivalent_refs[0] !== ANSWER_REF) {
        fail(`${operation.operation_id}.answer_form_reviewed_equivalent_refs must contain the reviewed q19 answer-form equivalent after execution`);
      }
      if ((operation.review_required_hooks || []).includes(ANSWER_HOOK)) {
        fail(`${operation.operation_id}.review_required_hooks must not include the answer-form-needed hook after execution`);
      }
    } else if ((operation.answer_form_reviewed_equivalent_refs || []).length) {
      fail(`${operation.operation_id}.answer_form_reviewed_equivalent_refs must not be present before execution`);
    }
    requireIncludes(operation.expected_forbidden_mtu_ids || [], 'A45', `${operation.operation_id}.expected_forbidden_mtu_ids`);
    requireIncludesAll(operation.expected_forbidden_route_tags || [], FORBIDDEN_ROUTE_TAGS, `${operation.operation_id}.expected_forbidden_route_tags`);
    if (['q19-step-2', 'q19-step-3'].includes(operation.operation_id)) {
      requireIncludes(operation.expected_required_mtu_ids || [], 'D13', `${operation.operation_id}.expected_required_mtu_ids`);
    }
  }
}

function requireAnswerFormHooks(packet) {
  if (packet.answer_form_decision_surface?.question_word !== 'teken') fail('answer-form surface question word must be teken');
  if (packet.answer_form_decision_surface?.candidate_answer_skill_id !== ANSWER_SKILL_ID) fail('candidate answer skill id mismatch');
  requireIncludesAll(packet.answer_form_decision_surface?.not_covered_by || [], ['A42', 'D10', 'D13', 'A81'], 'answer-form not_covered_by');
  const drawingConstraint = packet.answer_form_decision_surface?.graph_drawing_constraint_evidence;
  if (drawingConstraint?.status !== 'carried_blocked_graph_drawing_constraint_not_numeric_scale_factor') {
    fail('answer-form graph drawing constraint status mismatch');
  }
  if (!String(drawingConstraint?.instruction || '').includes('about 1 cm')) {
    fail('answer-form graph drawing constraint must carry the about 1 cm instruction');
  }
  if (!String(drawingConstraint?.rationale || '').includes('not a numeric scale-factor MTU need')) {
    fail('answer-form graph drawing constraint must state this is not a numeric scale-factor MTU need');
  }
  if (!Array.isArray(packet.operation_answer_form_hooks) || packet.operation_answer_form_hooks.length !== 3) {
    fail('packet must contain three q19 operation answer-form hooks');
  }
  for (const hook of packet.operation_answer_form_hooks) {
    if (!/^q19-step-[123]$/.test(hook.operation_id || '')) fail('unexpected q19 answer-form hook id');
    if (hook.expected_missing_answer_form_candidate !== ANSWER_SKILL_ID) fail(`${hook.operation_id}.expected_missing_answer_form_candidate mismatch`);
    requireIncludes(hook.forbidden_mtu_ids || [], 'A45', `${hook.operation_id}.forbidden_mtu_ids`);
    requireIncludes(hook.required_route_tags || [], 'answer_form', `${hook.operation_id}.required_route_tags`);
    requireIncludes(hook.required_route_tags || [], 'non_calculus', `${hook.operation_id}.required_route_tags`);
    requireIncludesAll(hook.forbidden_route_tags || [], FORBIDDEN_ROUTE_TAGS, `${hook.operation_id}.forbidden_route_tags`);
    if (hook.source_graph_dependency && !GRAPH_IDS.includes(hook.source_graph_dependency)) {
      fail(`${hook.operation_id}.source_graph_dependency must be a q19 graph extraction id`);
    }
    if (['q19-step-2', 'q19-step-3'].includes(hook.operation_id)) {
      if (hook.accepted_alternative_caveat !== AGGREGATE_SUPPLY_CAVEAT) fail(`${hook.operation_id} aggregate-supply caveat mismatch`);
      if (!String(hook.answer_model_summary || '').includes('aggregate-supply shift alternative')) {
        fail(`${hook.operation_id} answer model summary must mention aggregate-supply alternative`);
      }
    }
  }
}

function requirePrematureAnswerFormClosureNegativeGuard() {
  const fixtureClone = readJson(FIXTURE);
  const q19 = findRecord(fixtureClone, Q19_RECORD_ID);
  for (const operation of q19.official_correction_model_operations || []) {
    operation.missing_answer_form_expected = false;
    operation.answer_form_reviewed_equivalent_refs = [
      'reports/mtu-hardening/mtu-h5-q19-answer-form-gate-1.json#EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION',
    ];
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mtu-h5-q19-answer-form-negative-'));
  const tempFixture = path.join(tempDir, 'fixture-premature-answer-form.json');
  try {
    fs.writeFileSync(tempFixture, JSON.stringify(fixtureClone, null, 2));
    const result = runH5Validator(tempFixture);
    const q19Failed = (result.buckets?.failed || []).filter((item) => item.record_id === Q19_RECORD_ID);
    if (q19Failed.some((item) => String(item.assertion_id).includes('ANSWER-FORM-MISSING'))) {
      fail('temporary premature answer-form fixture should clear validator answer-form assertions before custom gate rejection');
    }
    const stillHasSourceHooks = (result.buckets?.review_required || []).some((item) => (
      item.record_id === Q19_RECORD_ID &&
      String(item.assertion_id).includes('q19-source-annex-gap remains blocking')
    ));
    if (!stillHasSourceHooks) fail('temporary premature answer-form fixture must still expose q19 source/graph hooks');
    if (!detectPrematureAnswerFormClosure(fixtureClone)) {
      fail('temporary premature answer-form fixture did not exercise the answer-form closure guard');
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function detectPrematureAnswerFormClosure(fixture) {
  const q19 = findRecord(fixture, Q19_RECORD_ID);
  const overlay = readJson(SOURCE_OVERLAY);
  const q19OverlayBlocked = allQ19SourceRecords(overlay).some((record) => (
    (record.blocking_gap_ids || []).includes('q19-source-annex-gap') ||
    (record.blocking_gap_ids || []).includes('q19-graph-object-gap')
  ));
  if (!q19OverlayBlocked) return false;
  for (const operation of q19.official_correction_model_operations || []) {
    const refs = operation.answer_form_reviewed_equivalent_refs || [];
    if (refs.length > 0 && operation.missing_answer_form_expected !== true) {
      return true;
    }
  }
  return false;
}

function requireA45NegativeGuard() {
  const fixtureClone = readJson(FIXTURE);
  const q19 = findRecord(fixtureClone, Q19_RECORD_ID);
  function addA45(values) {
    if (Array.isArray(values) && !values.includes('A45')) values.push('A45');
  }
  addA45(q19.mapped_mtu_ids);
  for (const operation of q19.official_correction_model_operations || []) addA45(operation.mapped_mtu_ids);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mtu-h5-q19-answer-form-a45-negative-'));
  const tempFixture = path.join(tempDir, 'fixture-with-a45.json');
  try {
    fs.writeFileSync(tempFixture, JSON.stringify(fixtureClone, null, 2));
    const result = runH5Validator(tempFixture);
    const failedIds = assertionIds(result, 'failed');
    for (const id of [
      'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-1:ASSERT-OVER-TRIGGER',
      'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-2:ASSERT-OVER-TRIGGER',
      'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-3:ASSERT-OVER-TRIGGER',
    ]) {
      requireIncludes(failedIds, id, 'temporary A45 negative failed assertions');
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function requireSourceOfficialContinuity() {
  const itemDoc = readJson(ITEM_OVERLAY);
  const answerDoc = readJson(ANSWER_OVERLAY);
  const contract = readJson(CONTRACT);
  const item = (itemDoc.records || []).find((record) => record.exam_item_id === Q19_RECORD_ID);
  if (!item) fail('exam-item overlays must contain q19');
  if (item.prompt_metadata?.instruction_word !== 'teken') fail('q19 item overlay instruction_word must be teken');
  if (item.question_classification?.graph_required !== true) fail('q19 item overlay must require graph work');
  const alternatives = item.official_answer_model?.accepted_alternatives || [];
  const aggregateSupplyAlternative = alternatives.find((alternative) => (
    String(alternative.description || '').includes('aggregate-supply')
  ));
  if (!aggregateSupplyAlternative) fail('q19 item overlay must preserve aggregate-supply accepted alternative');
  requireIncludesAll(
    aggregateSupplyAlternative.applies_to_step_ids || [],
    ['q19-step-2', 'q19-step-3'],
    'q19 aggregate-supply accepted alternative operation ids'
  );
  const answer = (answerDoc.records || []).find((record) => record.exam_item_id === Q19_RECORD_ID);
  if (!answer) fail('answer-model overlay must contain q19');
  requireIncludesAll(answer.official_answer_model?.answer_step_ids || [], ['q19-step-1', 'q19-step-2', 'q19-step-3'], 'answer overlay q19 steps');
  if (contract.q19_extraction_contract?.storage_path !== 'references/data/exam-ingestion/source-annex-extraction-overlays.json') {
    fail('q19 extraction contract storage path mismatch');
  }
  requireIncludesAll(contract.q19_extraction_contract?.blocking_gap_ids || [], ['q19-source-annex-gap', 'q19-graph-object-gap'], 'q19 extraction contract gaps');
}

function requirePacket(packet) {
  if (packet.schema_version !== 1) fail('packet schema_version must be 1');
  if (packet.sprint_id !== 'MTU-H5') fail('packet sprint_id must be MTU-H5');
  if (packet.packet_id !== EXPECTED_PACKET) fail('packet_id mismatch');
  if (packet.gate_id !== EXPECTED_GATE) fail('packet gate_id mismatch');
  if (packet.status !== 'q19_answer_form_gate_ready_for_human_review_no_mutation_authorized') fail('packet status mismatch');
  if (packet.review_branch !== REVIEW_BRANCH) fail('packet review_branch mismatch');
  if (packet.packet_result?.completion_claimed !== false) fail('packet must not claim completion');
  if (packet.packet_result?.next_state !== 'ready_for_human_q19_answer_form_decision_gate_review') fail('packet next_state mismatch');
  requireFalseBoundary(packet.authority_boundary, 'packet.authority_boundary');
  requireIncludesAll(packet.non_negotiable_requirements || [], [
    'The existing source-annex-extraction-overlays.json file must remain exactly a partial blocked evidence surface for q19, not closure evidence.',
    'q19 must remain 3 failed / 20 review_required in this PR.',
    'A42, D10, D13, and A81 may be treated only as content/procedure/source/reasoning support and not as graph/draw/teken answer-form closure.',
    'A45 must remain forbidden as primary q19 support.',
    'full_graph_construction, calculus_route, and function_construction remain forbidden route tags for q19.',
    'The official aggregate-supply alternative for q19-step-2 and q19-step-3 must remain visible alongside the primary rightward demand-shift route.',
  ], 'packet non-negotiable requirements');
  const decisionIds = (packet.decision_options || []).map((item) => item.decision_id);
  requireIncludesAll(decisionIds, [
    'approve_reviewed_equivalent_candidate_path',
    'require_new_mtu_governance_lane',
    'revise_before_any_downstream_write',
    'reject_answer_form_lane',
  ], 'packet decision options');
  requireAnswerFormHooks(packet);
  const negativeIds = (packet.negative_regression_requirements || []).map((item) => item.guard_id);
  requireIncludesAll(negativeIds, [
    'q19-premature-answer-form-closure-negative-guard',
    'q19-a45-primary-support-negative-guard',
    'solo-q1-q3-original-defect-class-guard',
  ], 'packet negative guards');
  for (const issue of packet.carried_issues || []) {
    if (!Array.isArray(issue.blocks) || issue.blocks.length === 0) fail(`${issue.issue_id}.blocks must be populated`);
    if (!Array.isArray(issue.does_not_block) || issue.does_not_block.length === 0) fail(`${issue.issue_id}.does_not_block must be populated`);
    if (!issue.proof_required_to_close) fail(`${issue.issue_id}.proof_required_to_close must be populated`);
  }
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
  const checklist = gate.core_requirement_checklist || [];
  if (checklist.length < 9) fail('gate core requirement checklist is incomplete');
  for (const item of checklist) {
    if (item.status !== 'met') fail(`core requirement ${item.requirement_id} must be met; PASS WITH FLAGS cannot carry missing core`);
  }
  requireIncludesAll(checklist.map((item) => item.requirement_id), [
    'core-1-non-mutating-boundary',
    'core-2-current-source-overlay-recognized',
    'core-3-live-q19-diagnostic-state',
    'core-4-answer-form-gap-visible',
    'core-5-support-units-not-overclaimed',
    'core-5a-graph-spacing-constraint-carried',
    'core-6-negative-guards',
    'core-7-aggregate-supply-alternative-preserved',
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
    rel(SOURCE_OVERLAY),
    rel(REGRESSION_REPORT_JSON),
    rel(FIXTURE),
    `${rel(CONTRACT)}#q19_extraction_contract`,
  ], 'gate must_review');
  if (gate.required_review_team_threshold?.minimum_verdict !== 'MORE_THAN_SATISFIED') fail('review threshold mismatch');
  if (gate.required_review_team_threshold?.all_three_required !== true) fail('all three review agents must be required');
  const reviewResults = gate.pre_human_review_team_results || [];
  requireIncludesAll(reviewResults.map((item) => item.agent), ['teacher', 'economist', 'quality_inspection'], 'pre-human review agents');
  for (const result of reviewResults) {
    if (result.verdict !== 'MORE_THAN_SATISFIED') fail(`pre-human review ${result.agent} must be MORE_THAN_SATISFIED`);
    if (!result.summary) fail(`pre-human review ${result.agent} summary missing`);
  }
}

function requireRemoteDiscoverability(packet, gate) {
  const bundleMd = readText(GATE_BUNDLE);
  const urlIndexMd = readText(URL_INDEX);
  const agentIndexMd = readText(AGENT_INDEX);
  const agentIndexJson = readJson(AGENT_INDEX_JSON);
  const agentIndexFiles = new Set(Object.values(agentIndexJson.groups || {}).flat());
  const { owner, repo } = parseRepoFromPackageJson();
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
    if (!agentIndexFiles.has(reference)) {
      fail(`reports/github-agent-index-platform.json must include ${reference}`);
    }
  }
}

function main() {
  if (q19FinalClosureActive()) {
    console.log('OK MTU-H5 q19 answer-form gate 1: historical gate superseded by final q19 closure');
    return;
  }

  const packet = readJson(PACKET_JSON);
  const packetMd = readText(PACKET_MD);
  const gate = readJson(GATE_JSON);
  const gateMd = readText(GATE_MD);

  requirePacket(packet);
  requireGatePacket(gate);
  requireCurrentDiagnosticState(packet);
  requireSourceOverlay(packet);
  requireFixtureQ19Shape();
  requireSourceOfficialContinuity();
  requirePrematureAnswerFormClosureNegativeGuard();
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
      'teken',
      ANSWER_SKILL_ID,
      'partial_with_blocking_gap',
      'aggregate-supply',
      'A45',
      'student/product use',
    ]) {
      requireTextIncludes(text, required, context);
    }
  }

  console.log('OK MTU-H5 q19 answer-form gate 1: ready_for_human_review_no_mutation_authorized');
}

main();
