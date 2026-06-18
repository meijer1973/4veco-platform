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
const PACKAGE_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-source-graph-reasoning-package-1.json');
const PACKAGE_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-source-graph-reasoning-package-1.md');
const GATE_ID = 'GATE-MTU-H5-Q19-source-graph-reasoning-package-1';
const GATE_DIR = path.join(ROOT, 'reports', 'review-gates', GATE_ID);
const GATE_JSON = path.join(GATE_DIR, 'review-packet.json');
const GATE_MD = path.join(GATE_DIR, 'review-packet.md');
const GATE_BUNDLE = path.join(GATE_DIR, 'bundle-urls.md');
const URL_INDEX = path.join(ROOT, 'reports', 'url-index.md');
const AGENT_INDEX = path.join(ROOT, 'reports', 'github-agent-index-platform.md');
const AGENT_INDEX_JSON = path.join(ROOT, 'reports', 'github-agent-index-platform.json');

const REGRESSION_REPORT_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.json');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');
const SOURCE_OVERLAY = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'source-annex-extraction-overlays.json');
const EXAM_ITEM_OVERLAY = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'exam-item-overlays.json');
const UNIT_REGISTRY = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');

const PACKAGE_ID = 'MTU-H5-Q19-SOURCE-GRAPH-REASONING-PACKAGE-1';
const REVIEW_BRANCH = 'codex/mtu-h5-q19-source-graph-reasoning-package-1-20260617';
const START_COMMIT = '1104325a066bec624eb4af66bfe968e0ceed8921';
const Q19_RECORD_ID = 'vw-1022-a-25-1-o:opgave-4:question-19';
const Q3_RECORD_ID = 'vw-1022-a-25-1-o:opgave-1:question-3';
const ANSWER_REF = 'reports/mtu-hardening/mtu-h5-q19-answer-form-equivalent-execution-gate-1.json#EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION';

const PACKAGE_PRE_STATUS = 'prepared_for_subagent_lead_review_hold_no_fixture_mutation';
const PACKAGE_FINAL_STATUS = 'ready_for_remote_human_review_after_subagent_lead_hold_no_fixture_mutation';
const GATE_PRE_STATUS = 'pending_subagent_lead_review';
const GATE_FINAL_STATUS = 'pending_human_review';

const EXPECTED_Q19_HOOKS = {
  'q19-step-1': [
    'q19-source-annex-gap remains blocking',
    'q19-graph-object-gap remains blocking',
  ],
  'q19-step-2': [
    'q19 chained multi-market reasoning remains operation_registry_need with D10/D13 partial support',
  ],
  'q19-step-3': [
    'q19-source-annex-gap remains blocking',
    'q19-graph-object-gap remains blocking',
    'q19 third graph-shift element is now modeled but still depends on blocked graph/source reconstruction',
  ],
};

const EXPECTED_Q19_ASSERTIONS = Object.entries(EXPECTED_Q19_HOOKS).flatMap(([operationId, hooks]) => (
  hooks.map((hook) => `${Q19_RECORD_ID}:${operationId}:ASSERT-REVIEW-${hook}`)
));

const GRAPH_IDS = [
  'EX_SRC_Q19_CURACAO_LABOR_MARKET_GRAPH',
  'EX_SRC_Q19_CURACAO_GOODS_MARKET_GRAPH',
  'EX_SRC_Q19_ARUBA_GOODS_MARKET_GRAPH',
];

const SOURCE_IDS = [
  'EX_SRC_Q19_SOURCE_FIGURE',
  'EX_SRC_Q19_UITWERKBIJLAGE',
];

const FORBIDDEN_ROUTE_TAGS = [
  'full_graph_construction',
  'calculus_route',
  'function_construction',
];

const REQUIRED_UNITS = ['A42', 'D10', 'D13', 'A81'];

const AUTHORITY_FALSE_KEYS = [
  'fixture_mutation_authorized',
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
  'source_overlay_mutation_authorized',
  'mapper_repair_authorized',
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
  'q19_closure_claimed',
  'mtu_h5_closure_claimed',
  'execution_authorized_now',
];

const SOURCE_RECORD_FALSE_KEYS = [
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
  'student_product_use_authorized',
];

const Q19_PACKET_AUTHORIZED_PATHS = [
  'build-scripts/references/check-mtu-h5-q19-procedure-semantic-fit-package-1.js',
  'build-scripts/references/check-mtu-h5-q19-source-graph-reasoning-package-1.js',
  'reports/mtu-hardening/mtu-h5-q19-source-graph-reasoning-package-1.json',
  'reports/mtu-hardening/mtu-h5-q19-source-graph-reasoning-package-1.md',
  'reports/review-gates/GATE-MTU-H5-Q19-source-graph-reasoning-package-1/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q19-source-graph-reasoning-package-1/review-packet.md',
  'reports/review-gates/GATE-MTU-H5-Q19-source-graph-reasoning-package-1/bundle-urls.md',
  'reports/url-index.md',
  'reports/github-agent-index-platform.json',
  'reports/github-agent-index-platform.md',
];

const ALLOWED_CHANGED_PATHS = new Set([
  ...Q19_PACKET_AUTHORIZED_PATHS,
  'build-scripts/references/build-mtu-h5-regression-report.js',
  'build-scripts/references/check-mtu-h5-q27-incidence-scaling-levy-capacity-package-1.js',
  'build-scripts/references/check-mtu-h5-rp005-q27-planning-packet.js',
  'reports/mtu-hardening/mtu-h5-q27-incidence-scaling-levy-capacity-package-1.json',
  'reports/mtu-hardening/mtu-h5-q27-incidence-scaling-levy-capacity-package-1.md',
  'reports/mtu-hardening/mtu-h5-regression-fixture.json',
  'reports/mtu-hardening/mtu-h5-regression-report.json',
  'reports/mtu-hardening/mtu-h5-regression-report.md',
  'reports/review-gates/GATE-MTU-H5-Q27-incidence-scaling-levy-capacity-package-1/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q27-incidence-scaling-levy-capacity-package-1/review-packet.md',
  'reports/review-gates/GATE-MTU-H5-Q27-incidence-scaling-levy-capacity-package-1/bundle-urls.md',
]);

const FORBIDDEN_CHANGED_EXACT = new Set([
  'references/data/exam-ingestion/source-annex-extraction-overlays.json',
  'references/data/exam-ingestion/exam-item-overlays.json',
  'references/authored/course-target-exercises.json',
]);

const FORBIDDEN_CHANGED_PREFIXES = [
  'references/machine/',
  'references/external/',
  'references/candidates/',
  'reports/candidates/',
  'lesson-output/',
  'lessons/',
  'product/',
  'diagnostics/',
  'pv/',
];

const REQUIRED_VALIDATION_COMMANDS = [
  'node --check build-scripts/references/check-mtu-h5-q19-source-graph-reasoning-package-1.js',
  'node build-scripts/references/check-mtu-h5-q19-source-graph-reasoning-package-1.js',
  'node build-scripts/references/check-mtu-h5-q19-procedure-semantic-fit-package-1.js',
  'node build-scripts/references/check-mtu-h5-q19-source-graph-procedure-reasoning-gate-1.js',
  'node build-scripts/references/check-mtu-h5-q19-answer-form-equivalent-execution-1.js',
  'node build-scripts/references/build-mtu-h5-regression-report.js --check',
  'node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --expect-fail --json',
  'node build-scripts/reports/validate-report-json.js',
  'node build-scripts/sprints/emit-url-index.js --check',
  'npm run agent:index',
  'npm run check:platform',
];

function fail(message) {
  throw new Error(message);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function normalizePath(value) {
  return value.replace(/\\/g, '/').replace(/^"|"$/g, '');
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

function requireExactArray(values, expected, context) {
  if (!Array.isArray(values)) fail(`${context} must be an array`);
  const actual = [...values].sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((value, index) => value !== wanted[index])) {
    fail(`${context} mismatch; expected ${wanted.join(', ')}, got ${actual.join(', ')}`);
  }
}

function requireTextIncludes(text, needle, context) {
  if (!text.includes(needle)) fail(`${context} must include ${needle}`);
}

function requireFalseBoundary(boundary, context) {
  for (const key of AUTHORITY_FALSE_KEYS) {
    if (!boundary || boundary[key] !== false) fail(`${context}.${key} must be false`);
  }
}

function git(args) {
  return spawnSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function requireGitSuccess(args, message) {
  const run = git(args);
  if (run.status !== 0) fail(`${message}: ${(run.stderr || run.stdout || '').trim()}`);
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
    fail(`MTU-H5 validator failed: ${(run.stderr || run.stdout || '').trim()}`);
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

function q19Items(result, bucket) {
  return (result.buckets?.[bucket] || []).filter((item) => item.record_id === Q19_RECORD_ID);
}

function records(fixture) {
  return fixture.records || fixture.question_records || [];
}

function findRecord(fixture, recordId) {
  const record = records(fixture).find((item) => item.record_id === recordId);
  if (!record) fail(`fixture missing record: ${recordId}`);
  return record;
}

function findExamItemOverlay(doc) {
  const rows = doc.items || doc.exam_item_overlays || doc.records || [];
  const item = rows.find((row) => row.exam_item_id === Q19_RECORD_ID || row.record_id === Q19_RECORD_ID);
  if (!item) fail(`exam item overlay missing q19: ${Q19_RECORD_ID}`);
  return item;
}

function allQ19SourceRecords(doc) {
  return [...(doc.graph_overlays || []), ...(doc.source_annex_overlays || [])]
    .filter((record) => record.source_exam_item_id === Q19_RECORD_ID);
}

function expectFailure(fn, context) {
  let rejected = false;
  try {
    fn();
  } catch (_error) {
    rejected = true;
  }
  if (!rejected) fail(`${context} must be rejected`);
}

function requireCurrentDiagnosticState(packet) {
  const report = readJson(REGRESSION_REPORT_JSON);
  const counts = report.question_bucket_counts || {};
  if (counts.q3?.failed !== 0 || counts.q3?.review_required !== 0) fail('report q3 counts must be 0/0');
  if (counts.q19?.failed !== 0 || counts.q19?.review_required !== 6) fail('report q19 counts must be 0/6');
  if (counts.q15?.failed !== 0 || counts.q15?.review_required !== 4) fail('report q15 counts must be 0/4');
  const q27BeforeScalingExecution = counts.q27?.failed === 3 &&
    counts.q27?.review_required === 5 &&
    report.bucket_totals?.failed === 3 &&
    report.bucket_totals?.review_required === 15;
  const q27AfterScalingExecution = counts.q27?.failed === 2 &&
    counts.q27?.review_required === 4 &&
    report.bucket_totals?.failed === 2 &&
    report.bucket_totals?.review_required === 14;
  if (!q27BeforeScalingExecution && !q27AfterScalingExecution) {
    fail('report q27/overall counts must be either pre-q27-scaling 3/5 + 3/15 or post-q27-scaling 2/4 + 2/14');
  }

  if (packet.current_diagnostic_state?.q19?.failed !== 0 ||
      packet.current_diagnostic_state?.q19?.review_required !== 6) {
    fail('packet q19 diagnostic state must be 0/6');
  }
  if (packet.current_diagnostic_state?.overall?.failed !== 3 ||
      packet.current_diagnostic_state?.overall?.review_required !== 15) {
    fail('packet overall diagnostic state must be 3/15');
  }

  const result = runH5Validator();
  if (q19Items(result, 'failed').length !== 0) fail('validator q19 failed bucket must be empty');
  const q19ReviewIds = q19Items(result, 'review_required').map((item) => item.assertion_id);
  requireExactArray(q19ReviewIds, EXPECTED_Q19_ASSERTIONS, 'validator q19 review_required assertions');

  for (const bucket of ['failed', 'review_required']) {
    const q3BucketItems = (result.buckets?.[bucket] || []).filter((item) => item.record_id === Q3_RECORD_ID);
    if (q3BucketItems.length !== 0) fail(`q3 must remain absent from validator ${bucket} bucket`);
  }
  if (!assertionIds(result, 'passed').includes('MTUH5-NEGATIVE-negative-solo-q2-function-construction-overtrigger-FAILS-AS-EXPECTED')) {
    fail('inherited Solo q1-q3 negative fixture guard must remain passing');
  }
}

function requireExactQ19HookShape(q19) {
  const operations = q19.official_correction_model_operations || [];
  if (operations.length !== 3) fail('q19 must have three official correction-model operations');
  for (const operation of operations) {
    const expected = EXPECTED_Q19_HOOKS[operation.operation_id];
    if (!expected) fail(`unexpected q19 operation id: ${operation.operation_id}`);
    requireExactArray(operation.review_required_hooks || [], expected, `${operation.operation_id}.review_required_hooks`);
  }
}

function requireFixtureQ19Shape() {
  const fixture = readJson(FIXTURE);
  const q19 = findRecord(fixture, Q19_RECORD_ID);
  if (q19.question_word !== 'teken') fail('q19 question_word must be teken');
  requireExactArray(q19.mapped_mtu_ids || [], REQUIRED_UNITS, 'q19 mapped_mtu_ids');
  if ((q19.mapped_mtu_ids || []).includes('A45')) fail('q19 mapped_mtu_ids must not include A45');
  requireExactQ19HookShape(q19);

  for (const operation of q19.official_correction_model_operations || []) {
    if (operation.missing_answer_form_expected !== false) {
      fail(`${operation.operation_id}.missing_answer_form_expected must remain false`);
    }
    requireExactArray(operation.answer_form_reviewed_equivalent_refs || [], [ANSWER_REF], `${operation.operation_id}.answer_form_reviewed_equivalent_refs`);
    requireIncludes(operation.expected_forbidden_mtu_ids || [], 'A45', `${operation.operation_id}.expected_forbidden_mtu_ids`);
    requireIncludesAll(operation.expected_forbidden_route_tags || [], FORBIDDEN_ROUTE_TAGS, `${operation.operation_id}.expected_forbidden_route_tags`);
    requireExactArray(operation.procedure_review_required_unit_ids || [], [], `${operation.operation_id}.procedure_review_required_unit_ids`);
  }
}

function requireSourceOverlayShape(overlay) {
  try {
    validateSourceExtractionDocument(overlay, 'source-annex extraction overlay');
  } catch (error) {
    fail(error instanceof ValidationError ? error.message : String(error));
  }

  if (overlay.storage_status !== 'future_candidate_storage') fail('source overlay storage_status must be future_candidate_storage');
  const graphIds = (overlay.graph_overlays || []).map((record) => record.extraction_id);
  const sourceIds = (overlay.source_annex_overlays || []).map((record) => record.extraction_id);
  requireIncludesAll(graphIds, GRAPH_IDS, 'source overlay graph ids');
  requireIncludesAll(sourceIds, SOURCE_IDS, 'source overlay source-annex ids');

  const q19Records = allQ19SourceRecords(overlay);
  if (q19Records.length !== GRAPH_IDS.length + SOURCE_IDS.length) fail('source overlay must expose exactly five q19 records');
  for (const record of q19Records) {
    if (record.extraction_status !== 'partial_with_blocking_gap') {
      fail(`${record.extraction_id}.extraction_status must remain partial_with_blocking_gap`);
    }
    if (record.review_state !== 'blocked') fail(`${record.extraction_id}.review_state must remain blocked`);
    requireIncludesAll(record.blocking_gap_ids || [], ['q19-source-annex-gap', 'q19-graph-object-gap'], `${record.extraction_id}.blocking_gap_ids`);
    for (const key of SOURCE_RECORD_FALSE_KEYS) {
      if (record.authority_boundary?.[key] !== false) fail(`${record.extraction_id}.${key} must be false`);
    }
  }
}

function requireSourceAndExamOverlay(packet) {
  if (packet.source_overlay_state?.storage_path !== rel(SOURCE_OVERLAY)) fail('packet source overlay path mismatch');
  if (packet.source_overlay_state?.storage_status !== 'future_candidate_storage') fail('packet source overlay storage status mismatch');
  requireIncludesAll(packet.source_overlay_state?.required_graph_record_ids || [], GRAPH_IDS, 'packet source overlay graph ids');
  requireIncludesAll(packet.source_overlay_state?.required_source_record_ids || [], SOURCE_IDS, 'packet source overlay source ids');
  requireSourceOverlayShape(readJson(SOURCE_OVERLAY));

  const item = findExamItemOverlay(readJson(EXAM_ITEM_OVERLAY));
  if (item.ingestion_status !== 'reviewed_with_gaps') fail('q19 exam item overlay must remain reviewed_with_gaps');
  if (item.source_material?.source_material_status !== 'partially_extracted') fail('q19 source material must remain partially_extracted');
  const gaps = item.source_material?.gaps || [];
  for (const gapId of ['q19-source-annex-gap', 'q19-graph-object-gap']) {
    const gap = gaps.find((row) => row.gap_id === gapId);
    if (!gap) fail(`q19 exam item overlay missing gap ${gapId}`);
    requireIncludesAll(gap.blocks || [], ['mtu_mapping', 'human_review'], `${gapId}.blocks`);
  }
  const reason = (item.skill_decomposition?.reasoning_operations || []).find((row) => row.item_id === 'q19-reason-1');
  if (!reason) fail('q19 exam item overlay missing q19-reason-1');
  if (reason.status !== 'operation_registry_need') fail('q19-reason-1 must remain operation_registry_need');
  requireExactArray(reason.candidate_unit_ids || [], ['D10', 'D13'], 'q19-reason-1 candidate units');
  const reasonGap = (item.mtu_gap_classification || []).find((row) => row.requirement_id === 'q19-reason-1');
  if (!reasonGap) fail('q19 gap classification missing q19-reason-1');
  if (reasonGap.mutation_authorized !== false) fail('q19-reason-1 mutation_authorized must be false');
  if (item.lesson_build_handoff?.handoff_status !== 'not_ready') fail('q19 lesson handoff must remain not_ready');
  if (item.product_boundary?.student_facing_output_authorized !== false ||
      item.product_boundary?.student_diagnostics_authorized !== false ||
      item.product_boundary?.pv_projection_authorized !== false) {
    fail('q19 product boundary must remain false for student/product/PV use');
  }
}

function requireUnitEvidence() {
  const registry = readJson(UNIT_REGISTRY);
  const units = new Map((Array.isArray(registry) ? registry : registry.units || []).map((unit) => [unit.id, unit]));
  for (const id of [...REQUIRED_UNITS, 'A45']) {
    const unit = units.get(id);
    if (!unit) fail(`unit registry missing ${id}`);
    if (id !== 'A45' && (!Array.isArray(unit.procedure) || unit.procedure.length === 0)) {
      fail(`${id} must have canonical procedure evidence`);
    }
  }
}

function requirePackage(packet) {
  if (packet.schema_version !== 1) fail('package schema_version must be 1');
  if (packet.sprint_id !== 'MTU-H5') fail('package sprint_id must be MTU-H5');
  if (packet.package_id !== PACKAGE_ID) fail('package_id mismatch');
  if (packet.gate_id !== GATE_ID) fail('package gate_id mismatch');
  if (![PACKAGE_PRE_STATUS, PACKAGE_FINAL_STATUS].includes(packet.status)) fail('package status mismatch');
  if (packet.start_commit !== START_COMMIT) fail('package start_commit mismatch');
  if (packet.review_branch !== REVIEW_BRANCH) fail('package review_branch mismatch');
  if (packet.packet_result?.completion_claimed !== false) fail('package must not claim completion');
  requireFalseBoundary(packet.authority_boundary, 'package.authority_boundary');
  if (packet.review_team_threshold?.minimum_verdict !== 'MORE_THAN_SATISFIED') fail('package review threshold mismatch');
  if (packet.review_team_threshold?.packet_accepted_without_all_three !== false) fail('package must require all three review agents');
  requireExactArray(packet.live_q19_remaining_hook_inventory?.assertion_ids || [], EXPECTED_Q19_ASSERTIONS, 'package q19 assertion inventory');
  if (packet.live_q19_remaining_hook_inventory?.count !== EXPECTED_Q19_ASSERTIONS.length) fail('package q19 assertion count mismatch');
  for (const operation of packet.operation_evidence_surface || []) {
    if (!EXPECTED_Q19_HOOKS[operation.operation_id]) fail(`unexpected package operation ${operation.operation_id}`);
    if (operation.hold_decision !== 'hold') fail(`${operation.operation_id}.hold_decision must be hold`);
    requireExactArray(operation.current_procedure_review_required_unit_ids || [], [], `${operation.operation_id}.current_procedure_review_required_unit_ids`);
    requireExactArray(operation.remaining_review_hooks || [], EXPECTED_Q19_HOOKS[operation.operation_id], `${operation.operation_id}.remaining_review_hooks`);
    requireIncludes(operation.forbidden_mtu_ids || [], 'A45', `${operation.operation_id}.forbidden_mtu_ids`);
    requireIncludesAll(operation.forbidden_route_tags || [], FORBIDDEN_ROUTE_TAGS, `${operation.operation_id}.forbidden_route_tags`);
  }
  for (const row of packet.answer_form_and_misconception_evidence || []) {
    if (row.question_word !== 'teken') fail(`${row.operation_id}.question_word must be teken`);
    if (row.answer_form_reviewed_equivalent_ref !== ANSWER_REF) fail(`${row.operation_id}.answer_form ref mismatch`);
    if (!Array.isArray(row.misconception_refs) || row.misconception_refs.length === 0) fail(`${row.operation_id}.misconception refs missing`);
    requireTextIncludes(row.scale_factor_evidence || '', 'not a numeric scaling', `${row.operation_id}.scale_factor_evidence`);
  }
  requireIncludesAll((packet.hold_matrix || []).map((row) => row.hold_id), [
    'q19-source-annex-hold',
    'q19-graph-object-hold',
    'q19-chained-reasoning-hold',
    'q19-third-graph-shift-hold',
  ], 'package hold matrix');
  for (const row of packet.hold_matrix || []) {
    if (row.classification !== 'blocks') fail(`${row.hold_id}.classification must be blocks`);
    if (!Array.isArray(row.held_hooks) || row.held_hooks.length === 0) fail(`${row.hold_id}.held_hooks missing`);
    if (!row.reason_to_hold) fail(`${row.hold_id}.reason_to_hold missing`);
    if (!row.proof_required_to_close) fail(`${row.hold_id}.proof_required_to_close missing`);
  }
  if (packet.exact_write_surface?.fixture_mutation_authorized !== false ||
      packet.exact_write_surface?.source_overlay_mutation_authorized !== false ||
      packet.exact_write_surface?.protected_reference_mutation_authorized !== false) {
    fail('package exact write surface must be non-mutating');
  }
  requireIncludesAll(packet.exact_write_surface?.authorized_paths || [], Q19_PACKET_AUTHORIZED_PATHS, 'package authorized paths');
  for (const command of REQUIRED_VALIDATION_COMMANDS) requireIncludes(packet.validation_commands || [], command, 'package validation commands');
}

function requireSubagentResults(container, context, finalRequired) {
  const results = container.pre_human_review_team_results || [];
  if (!Array.isArray(results)) fail(`${context}.pre_human_review_team_results must be an array`);
  if (!finalRequired && results.length === 0) return;
  requireIncludesAll(results.map((row) => row.agent), ['teacher', 'economist', 'quality_inspection'], `${context} review agents`);
  for (const row of results) {
    if (row.verdict !== 'MORE_THAN_SATISFIED') fail(`${context} ${row.agent} verdict must be MORE_THAN_SATISFIED`);
    if (!row.summary) fail(`${context} ${row.agent} summary missing`);
  }
  if (container.subagent_lead_review?.status !== 'approved') fail(`${context} lead review status must be approved`);
  if (container.subagent_lead_review?.lead_verdict !== 'APPROVE_HOLD_PACKAGE') fail(`${context} lead verdict must be APPROVE_HOLD_PACKAGE`);
  if (!container.subagent_lead_review?.lead_summary) fail(`${context} lead summary missing`);
}

function requireGatePacket(gate) {
  if (gate.schema_version !== 1) fail('gate schema_version must be 1');
  if (gate.gate_id !== GATE_ID) fail('gate id mismatch');
  if (gate.package_id !== PACKAGE_ID) fail('gate package_id mismatch');
  if (![GATE_PRE_STATUS, GATE_FINAL_STATUS].includes(gate.status)) fail('gate status mismatch');
  if (gate.review_standard !== 'REV-STD-1') fail('gate must use REV-STD-1');
  if (!gate.product_end_state || !gate.original_sprint_gate_spec) fail('gate must cite product end-state and original sprint/gate spec');
  requireFalseBoundary(gate.authority_boundary, 'gate.authority_boundary');
  if (gate.requested_decision?.execution_authorized_by_this_packet !== false) fail('gate must not authorize execution');
  if (gate.requested_decision?.fixture_mutation_authorized_by_this_packet !== false) fail('gate must not authorize fixture mutation');
  if (gate.requested_decision?.source_overlay_mutation_authorized_by_this_packet !== false) fail('gate must not authorize source overlay mutation');
  if (gate.requested_decision?.product_or_student_use_authorized_by_this_packet !== false) fail('gate must not authorize product/student use');
  requireIncludesAll(gate.requested_decision?.valid_decisions || [], [
    'APPROVE_HOLD_PACKAGE',
    'REVISE_HOLD_PACKAGE',
    'REJECT_HOLD_PACKAGE_REQUIRES_EXECUTION_GATE',
  ], 'gate requested decisions');

  const checklist = gate.core_requirement_checklist || [];
  requireIncludesAll(checklist.map((item) => item.requirement_id), [
    'core-1-current-live-q19-counts',
    'core-2-rev-std-1-review-surface',
    'core-3-non-mutating-boundary',
    'core-4-current-source-overlay-recognized',
    'core-5-answer-form-and-procedure-execution-preserved',
    'core-6-exact-six-hooks-held',
    'core-7-chained-reasoning-not-overclaimed',
    'core-8-negative-guards',
    'core-9-carried-blockers-classified',
    'core-10-remote-discoverability',
  ], 'gate core checklist');
  for (const item of checklist) {
    if (item.status !== 'met') fail(`core requirement ${item.requirement_id} must be met`);
  }
  for (const finding of gate.findings || []) {
    if (!finding.classification) fail(`${finding.finding_id}.classification missing`);
    if (!Array.isArray(finding.blocks)) fail(`${finding.finding_id}.blocks must be an array`);
    if (!Array.isArray(finding.does_not_block) || finding.does_not_block.length === 0) {
      fail(`${finding.finding_id}.does_not_block must be populated`);
    }
    if (!finding.proof_required_to_close) fail(`${finding.finding_id}.proof_required_to_close missing`);
  }
  requireIncludesAll(gate.must_review || [], [
    rel(PACKAGE_MD),
    rel(PACKAGE_JSON),
    rel(__filename),
    rel(REGRESSION_REPORT_JSON),
    rel(FIXTURE),
    rel(H5_VALIDATOR),
    rel(SOURCE_OVERLAY),
    `${rel(EXAM_ITEM_OVERLAY)}#${Q19_RECORD_ID}`,
  ], 'gate must_review');
  if (gate.required_review_team_threshold?.minimum_verdict !== 'MORE_THAN_SATISFIED') fail('gate review threshold mismatch');
  if (gate.required_review_team_threshold?.all_three_required !== true) fail('gate must require all three review agents');
  for (const command of REQUIRED_VALIDATION_COMMANDS) requireIncludes(gate.validation_commands || [], command, 'gate validation commands');
}

function requireNegativeGuards() {
  const fixture = readJson(FIXTURE);
  const q19 = findRecord(fixture, Q19_RECORD_ID);

  const allHooksCleared = JSON.parse(JSON.stringify(q19));
  for (const operation of allHooksCleared.official_correction_model_operations || []) operation.review_required_hooks = [];
  expectFailure(() => requireExactQ19HookShape(allHooksCleared), 'temporary q19 all-hooks-clear clone');

  const chainedCleared = JSON.parse(JSON.stringify(q19));
  const step2 = (chainedCleared.official_correction_model_operations || []).find((operation) => operation.operation_id === 'q19-step-2');
  step2.review_required_hooks = [];
  expectFailure(() => requireExactQ19HookShape(chainedCleared), 'temporary q19 chained-hook-clear clone');

  const overlayClone = readJson(SOURCE_OVERLAY);
  for (const record of allQ19SourceRecords(overlayClone)) record.extraction_status = 'reconstructable_pending_review';
  expectFailure(() => requireSourceOverlayShape(overlayClone), 'temporary false reconstructable q19 source overlay clone');

  const a45Clone = readJson(FIXTURE);
  const a45Q19 = findRecord(a45Clone, Q19_RECORD_ID);
  const addA45 = (values) => {
    if (Array.isArray(values) && !values.includes('A45')) values.push('A45');
  };
  addA45(a45Q19.mapped_mtu_ids);
  for (const operation of a45Q19.official_correction_model_operations || []) addA45(operation.mapped_mtu_ids);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mtu-h5-q19-source-graph-reasoning-a45-'));
  const tempFixture = path.join(tempDir, 'fixture-with-a45.json');
  try {
    fs.writeFileSync(tempFixture, JSON.stringify(a45Clone, null, 2));
    const result = runH5Validator(tempFixture);
    const failedIds = assertionIds(result, 'failed');
    for (const operationId of ['q19-step-1', 'q19-step-2', 'q19-step-3']) {
      requireIncludes(failedIds, `${Q19_RECORD_ID}:${operationId}:ASSERT-OVER-TRIGGER`, 'temporary A45 negative failed assertions');
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function changedPathsFromStatus() {
  const run = git(['status', '--porcelain=v1', '--untracked-files=all']);
  if (run.status !== 0) fail(`git status failed: ${run.stderr.trim()}`);
  const paths = [];
  for (const line of run.stdout.split(/\r?\n/).filter(Boolean)) {
    let value = line.slice(3).trim();
    if (value.includes(' -> ')) value = value.split(' -> ').pop();
    paths.push(normalizePath(value));
  }
  return paths;
}

function changedPathsFromDiff(args) {
  const run = git(args);
  if (run.status !== 0) return [];
  return run.stdout.split(/\r?\n/).filter(Boolean).map(normalizePath);
}

function requireChangedPathBoundary() {
  const paths = new Set([
    ...changedPathsFromDiff(['diff', '--name-only', 'origin/main...HEAD']),
    ...changedPathsFromDiff(['diff', '--name-only']),
    ...changedPathsFromDiff(['diff', '--cached', '--name-only']),
    ...changedPathsFromStatus(),
  ]);

  for (const changedPath of paths) {
    if (FORBIDDEN_CHANGED_EXACT.has(changedPath)) fail(`forbidden protected path changed: ${changedPath}`);
    if (FORBIDDEN_CHANGED_PREFIXES.some((prefix) => changedPath.startsWith(prefix))) {
      fail(`forbidden protected path changed: ${changedPath}`);
    }
    if (!ALLOWED_CHANGED_PATHS.has(changedPath)) fail(`unexpected changed path for this no-mutation package: ${changedPath}`);
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
    rel(PACKAGE_JSON),
    rel(PACKAGE_MD),
    rel(__filename),
    rel(GATE_BUNDLE),
    rel(GATE_JSON),
    rel(GATE_MD),
  ]) {
    requireTextIncludes(agentIndexMd, reference, 'reports/github-agent-index-platform.md');
    if (!agentIndexFiles.has(reference)) fail(`reports/github-agent-index-platform.json must include ${reference}`);
  }
}

function requireMarkdown(packetMd, gateMd) {
  for (const [text, context] of [[packetMd, 'package markdown'], [gateMd, 'gate markdown']]) {
    for (const required of [
      'MTU-H5',
      'q19',
      '0 failed / 6 review_required',
      'source/graph/reasoning',
      'partial_with_blocking_gap',
      'A45',
      'student/product use',
    ]) {
      requireTextIncludes(text, required, context);
    }
  }
}

function main() {
  const packet = readJson(PACKAGE_JSON);
  const gate = readJson(GATE_JSON);
  const packageMd = readText(PACKAGE_MD);
  const gateMd = readText(GATE_MD);
  const finalRequired = packet.status === PACKAGE_FINAL_STATUS || gate.status === GATE_FINAL_STATUS;

  requireGitSuccess(['cat-file', '-e', `${START_COMMIT}:reports/mtu-hardening/mtu-h5-regression-report.json`], 'start commit must contain MTU-H5 report');
  requirePackage(packet);
  requireGatePacket(gate);
  requireCurrentDiagnosticState(packet);
  requireFixtureQ19Shape();
  requireSourceAndExamOverlay(packet);
  requireUnitEvidence();
  requireSubagentResults(packet, 'package', finalRequired);
  requireSubagentResults(gate, 'gate', finalRequired);
  requireNegativeGuards();
  requireMarkdown(packageMd, gateMd);
  requireRemoteDiscoverability(packet, gate);
  requireChangedPathBoundary();

  console.log('OK MTU-H5 q19 source/graph/reasoning package 1: six live hooks held, no fixture/source/reference/product/student mutation authorized');
}

try {
  main();
} catch (error) {
  console.error(`MTU-H5 q19 source/graph/reasoning package 1 check failed: ${error.message}`);
  process.exit(1);
}
