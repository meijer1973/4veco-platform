#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  ValidationError,
  assertFutureStorageAbsent,
  validateSourceExtractionDocument,
} = require('./lib/exam-ingestion-candidate-validation');
const {
  buildRawReferenceUrl,
  buildRawUrl,
  parseRepoFromPackageJson,
} = require('../sprints/emit-gate-bundle-urls.js');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-source-graph-extraction-execution-gate-1.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-source-graph-extraction-execution-gate-1.md');
const GATE_DIR = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-source-graph-extraction-execution-gate-1');
const GATE_JSON = path.join(GATE_DIR, 'review-packet.json');
const GATE_MD = path.join(GATE_DIR, 'review-packet.md');
const GATE_BUNDLE = path.join(GATE_DIR, 'bundle-urls.md');
const URL_INDEX = path.join(ROOT, 'reports', 'url-index.md');
const AGENT_INDEX = path.join(ROOT, 'reports', 'github-agent-index-platform.md');

const PRIOR_SOURCE_GATE_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-source-graph-extraction-gate-1.json');
const PRIOR_SOURCE_GATE_REVIEW = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-source-graph-extraction-gate-1', 'review-packet.json');
const PRIOR_Q19_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-repair-gate-1.json');
const Q19_PLANNING_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-rp003-rp004-q19-planning-packet.json');
const Q19_PLANNING_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-RP003-RP004-q19-planning-packet', 'gate-closure.json');
const REGRESSION_REPORT_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.json');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');
const CONTRACT = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'operation-answer-skill-contract.json');

const Q19_RECORD_ID = 'vw-1022-a-25-1-o:opgave-4:question-19';
const Q3_RECORD_ID = 'vw-1022-a-25-1-o:opgave-1:question-3';
const START_COMMIT = '9ba8cea614356dbf7a23c252d0262fde328a21d3';
const PRIOR_SOURCE_GATE_COMMIT = '9ba8cea614356dbf7a23c252d0262fde328a21d3';
const EXPECTED_GATE = 'GATE-MTU-H5-Q19-source-graph-extraction-execution-gate-1';
const EXPECTED_PACKET = 'MTU-H5-Q19-source-graph-extraction-execution-gate-1';
const REVIEW_BRANCH = 'codex/mtu-h5-q19-source-graph-extraction-execution-gate-1-20260615';
const STORAGE_PATH = 'references/data/exam-ingestion/source-annex-extraction-overlays.json';

const REQUIRED_RECORD_IDS = [
  'EX_SRC_Q19_SOURCE_FIGURE',
  'EX_SRC_Q19_UITWERKBIJLAGE',
  'EX_SRC_Q19_CURACAO_LABOR_MARKET_GRAPH',
  'EX_SRC_Q19_CURACAO_GOODS_MARKET_GRAPH',
  'EX_SRC_Q19_ARUBA_GOODS_MARKET_GRAPH',
];

const REQUIRED_GRAPH_FIELDS = [
  'source_material_id',
  'source_page_or_locator',
  'graph_type',
  'axis_labels',
  'axis_units',
  'scale_or_tick_marks',
  'curve_or_series_labels',
  'coordinates_or_reconstructable_geometry',
  'legend_mapping',
  'student_action_regions',
  'extraction_status',
  'review_state',
  'blocking_gap_ids',
];

const REQUIRED_GRAPH_USER_TERMS = [
  'source locator',
  'graph type',
  'axis labels',
  'axis units',
  'scale or tick marks',
  'curve labels',
  'reconstructable geometry or reviewed limitations',
  'legend mapping',
  'student-action regions',
  'extraction status',
  'review state',
  'blocking-gap ids',
];

const REQUIRED_SOURCE_FIELDS = [
  'source_material_id',
  'annex_type',
  'source_page_or_locator',
  'prompt_reference',
  'worksheet_regions',
  'required_student_marks',
  'extraction_status',
  'review_state',
  'blocking_gap_ids',
];

const REQUIRED_SOURCE_USER_TERMS = [
  'source locator',
  'prompt reference',
  'worksheet regions',
  'required student marks',
  'extraction status',
  'review state',
  'blocking-gap ids',
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

const REQUIRED_Q19_FAILED_ASSERTIONS = [
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-1:ASSERT-ANSWER-FORM-MISSING',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-2:ASSERT-ANSWER-FORM-MISSING',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-3:ASSERT-ANSWER-FORM-MISSING',
];

const REQUIRED_Q19_REVIEW_MARKERS = [
  'q19-source-annex-gap remains blocking',
  'q19-graph-object-gap remains blocking',
  'graph/draw/teken answer-form MTU or reviewed equivalent still needed',
  'q19 chained multi-market reasoning remains operation_registry_need with D10/D13 partial support',
  'q19 third graph-shift element is now modeled but still depends on blocked graph/source reconstruction',
];

const FORBIDDEN_ROUTE_TAGS = [
  'full_graph_construction',
  'calculus_route',
  'function_construction',
];

const AGGREGATE_SUPPLY_CAVEAT =
  'Correct aggregate-supply shifts for q19-step-2 and q19-step-3 are accepted as an alternative in the official correction model.';

const REQUIRED_VALIDATION_COMMANDS = [
  'node --check build-scripts/references/check-mtu-h5-q19-source-graph-extraction-execution-gate-1.js',
  'node build-scripts/references/check-mtu-h5-q19-source-graph-extraction-execution-gate-1.js',
  'node build-scripts/references/check-mtu-h5-q19-source-graph-extraction-gate-1.js',
  'node build-scripts/references/check-mtu-h5-q19-repair-gate-1.js',
  'node build-scripts/references/check-mtu-h5-rp003-rp004-q19-planning-packet.js',
  'node build-scripts/references/build-mtu-h5-regression-report.js --check',
  'node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --expect-fail --json',
  'node build-scripts/reports/validate-report-json.js',
  'node build-scripts/sprints/emit-url-index.js --check',
  'npm run agent:index',
  'npm run check:platform',
];

function fail(message) {
  console.error(`MTU-H5 q19 source/graph extraction execution gate 1 check failed: ${message}`);
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
  return run.stdout.trim();
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

function requireCurrentDiagnosticState(packet) {
  const report = readJson(REGRESSION_REPORT_JSON);
  const counts = report.question_bucket_counts || {};
  if (counts.q3?.failed !== 0 || counts.q3?.review_required !== 0) fail('report q3 counts must remain 0/0');
  if (counts.q19?.failed !== 3 || counts.q19?.review_required !== 20) fail('report q19 counts must remain 3/20');
  if (counts.q27?.failed !== 3 || counts.q27?.review_required !== 5) fail('report q27 counts must remain 3/5');
  if (counts.q15?.failed !== 0 || counts.q15?.review_required !== 4) fail('report q15 counts must remain 0/4');
  if (packet.current_diagnostic_state?.q19?.failed !== 3 || packet.current_diagnostic_state?.q19?.review_required !== 20) {
    fail('packet q19 diagnostic state must be 3/20');
  }

  const result = runH5Validator();
  requireIncludesAll(assertionIds(result, 'failed'), REQUIRED_Q19_FAILED_ASSERTIONS, 'live validator failed assertions');
  for (const marker of REQUIRED_Q19_REVIEW_MARKERS) {
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

function requirePriorGateContinuity(packet) {
  const priorSourceGate = readJson(PRIOR_SOURCE_GATE_PACKET);
  const priorSourceReview = readJson(PRIOR_SOURCE_GATE_REVIEW);
  const priorRepairGate = readJson(PRIOR_Q19_PACKET);

  if (priorSourceGate.status !== 'q19_source_graph_extraction_gate_ready_for_human_review_no_execution_authorized') {
    fail('prior q19 source/graph gate status mismatch');
  }
  if (priorSourceReview.status !== 'pending_human_review') {
    fail('prior q19 source/graph review packet status mismatch');
  }
  if (priorRepairGate.write_surface_decision?.recommended_next_gate !== 'MTU-H5-Q19-SOURCE-GRAPH-EXTRACTION-GATE-1') {
    fail('prior q19 repair gate must still point to the source/graph gate');
  }
  if (packet.original_sprint_gate_spec?.source_gate !== 'GATE-MTU-H5-Q19-source-graph-extraction-gate-1') {
    fail('packet original sprint/gate spec must cite the source/graph extraction gate');
  }
  if (packet.source_pr62_merge_commit !== PRIOR_SOURCE_GATE_COMMIT) {
    fail('packet must record PR #62 merge commit');
  }
  if (packet.prior_gate_evidence?.source_graph_gate_packet !== rel(PRIOR_SOURCE_GATE_PACKET)) {
    fail('packet must cite prior source/graph gate packet');
  }
}

function requireStoragePlan(packet) {
  const plan = packet.future_exact_write_plan || {};
  if (plan.storage_path !== STORAGE_PATH) fail('future write plan storage path mismatch');
  if (plan.storage_must_remain_absent_in_this_pr !== true) fail('this PR must keep future storage absent');
  if (plan.execution_pr_required_after_human_approval !== true) fail('future execution PR requirement missing');
  if (plan.this_packet_executes_extraction !== false) fail('packet must not execute extraction');
  if (plan.this_packet_writes_storage !== false) fail('packet must not write storage');

  const recordsToWrite = plan.records_to_write || [];
  const ids = recordsToWrite.map((record) => record.extraction_id);
  requireIncludesAll(ids, REQUIRED_RECORD_IDS, 'future records to write');
  if (new Set(ids).size !== REQUIRED_RECORD_IDS.length || recordsToWrite.length !== REQUIRED_RECORD_IDS.length) {
    fail('future write plan must contain exactly the five q19 extraction records');
  }

  for (const record of recordsToWrite) {
    if (record.source_exam_item_id !== Q19_RECORD_ID) fail(`${record.extraction_id}.source_exam_item_id mismatch`);
    if (record.allowed_write_status_before_review !== 'partial_with_blocking_gap') {
      fail(`${record.extraction_id}.allowed_write_status_before_review must be partial_with_blocking_gap`);
    }
    requireIncludesAll(record.blocking_gap_ids || [], ['q19-source-annex-gap', 'q19-graph-object-gap'], `${record.extraction_id}.blocking_gap_ids`);
    if (record.kind === 'graph_object') {
      requireIncludesAll(record.required_fields || [], REQUIRED_GRAPH_FIELDS, `${record.extraction_id}.required_fields`);
    } else if (record.kind === 'source_annex') {
      requireIncludesAll(record.required_fields || [], REQUIRED_SOURCE_FIELDS, `${record.extraction_id}.required_fields`);
    } else {
      fail(`${record.extraction_id}.kind must be graph_object or source_annex`);
    }
  }
}

function requireFieldContracts(packet) {
  const contract = readJson(CONTRACT).q19_extraction_contract;
  if (!contract) fail('operation-answer-skill contract missing q19_extraction_contract');
  if (contract.storage_path !== STORAGE_PATH) fail('q19 extraction contract storage path mismatch');
  if (contract.execution_authorized_now !== false) fail('q19 extraction contract must not authorize execution now');
  if (contract.storage_status !== 'future_storage_not_created') fail('q19 extraction contract must keep future storage absent');
  requireIncludesAll(packet.required_graph_fields || [], REQUIRED_GRAPH_FIELDS, 'packet required graph fields');
  requireIncludesAll(packet.required_graph_fields_user_terms || [], REQUIRED_GRAPH_USER_TERMS, 'packet required graph user terms');
  requireIncludesAll(packet.required_source_annex_fields || [], REQUIRED_SOURCE_FIELDS, 'packet required source-annex fields');
  requireIncludesAll(packet.required_source_annex_fields_user_terms || [], REQUIRED_SOURCE_USER_TERMS, 'packet required source-annex user terms');

  const contractSourceFields = (contract.required_source_annex_fields || []).map((field) => (
    field === 'prompt_ref' ? 'prompt_reference' : field
  ));
  requireIncludesAll(packet.required_graph_fields || [], contract.required_graph_fields || [], 'packet graph fields from contract');
  requireIncludesAll(packet.required_source_annex_fields || [], contractSourceFields, 'packet source fields from contract');
}

function requirePlanningDryRun(packet) {
  const planning = readJson(Q19_PLANNING_PACKET);
  const planningGate = readJson(Q19_PLANNING_GATE);
  if (planningGate.status !== 'approved_more_than_satisfied_no_mutation_authorized') {
    fail('q19 planning gate must remain approved MORE_THAN_SATISFIED');
  }
  const dryRun = planning.dry_run_source_extraction_document;
  try {
    validateSourceExtractionDocument(dryRun, 'q19 planning dry-run source extraction document');
  } catch (error) {
    fail(error instanceof ValidationError ? error.message : String(error));
  }
  if (dryRun.storage_status !== 'dry_run_embedded_not_persistent') fail('dry-run extraction document must be embedded only');
  const graphIds = (dryRun.graph_overlays || []).map((item) => item.extraction_id);
  const sourceIds = (dryRun.source_annex_overlays || []).map((item) => item.extraction_id);
  requireIncludesAll([...graphIds, ...sourceIds], REQUIRED_RECORD_IDS, 'dry-run q19 extraction ids');

  const packetIds = (packet.future_exact_write_plan?.records_to_write || []).map((item) => item.extraction_id);
  requireIncludesAll(packetIds, REQUIRED_RECORD_IDS, 'packet future write record ids');
}

function requireFalseReconstructableNegative() {
  const planning = readJson(Q19_PLANNING_PACKET);
  const dryRun = JSON.parse(JSON.stringify(planning.dry_run_source_extraction_document));
  for (const record of [...(dryRun.graph_overlays || []), ...(dryRun.source_annex_overlays || [])]) {
    record.extraction_status = 'reconstructable_pending_review';
  }
  let rejected = false;
  try {
    validateSourceExtractionDocument(dryRun, 'negative q19 false reconstructable document');
  } catch (error) {
    rejected = error instanceof ValidationError || error instanceof Error;
  }
  if (!rejected) fail('negative q19 false reconstructable document must be rejected');
}

function requireA45NegativeGuard() {
  const fixtureClone = readJson(FIXTURE);
  const q19 = findRecord(fixtureClone, Q19_RECORD_ID);
  function addA45(values) {
    if (Array.isArray(values) && !values.includes('A45')) values.push('A45');
  }
  addA45(q19.mapped_mtu_ids);
  for (const operation of q19.official_correction_model_operations || []) {
    addA45(operation.mapped_mtu_ids);
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mtu-h5-q19-execution-gate-a45-negative-'));
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

function requireOperationHooks(packet) {
  if (!Array.isArray(packet.operation_answer_form_hooks) || packet.operation_answer_form_hooks.length !== 3) {
    fail('packet must contain three q19 operation answer-form hooks');
  }
  for (const hook of packet.operation_answer_form_hooks) {
    if (!/^q19-step-[123]$/.test(hook.operation_id || '')) fail('unexpected q19 operation hook id');
    requireIncludes(hook.forbidden_mtu_ids || [], 'A45', `${hook.operation_id}.forbidden_mtu_ids`);
    requireIncludes(hook.required_route_tags || [], 'graph_shift', `${hook.operation_id}.required_route_tags`);
    requireIncludes(hook.required_route_tags || [], 'non_calculus', `${hook.operation_id}.required_route_tags`);
    requireIncludesAll(hook.forbidden_route_tags || [], FORBIDDEN_ROUTE_TAGS, `${hook.operation_id}.forbidden_route_tags`);
    if (hook.expected_missing_answer_form_candidate !== 'EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION') {
      fail(`${hook.operation_id} must keep missing answer-form candidate`);
    }
    if (hook.source_graph_dependency && !REQUIRED_RECORD_IDS.includes(hook.source_graph_dependency)) {
      fail(`${hook.operation_id}.source_graph_dependency must be one of the q19 extraction ids`);
    }
    if (['q19-step-2', 'q19-step-3'].includes(hook.operation_id)) {
      if (hook.accepted_alternative_caveat !== AGGREGATE_SUPPLY_CAVEAT) {
        fail(`${hook.operation_id} must preserve aggregate-supply alternative caveat`);
      }
      if (!String(hook.answer_model_summary || '').includes('aggregate-supply shift alternative')) {
        fail(`${hook.operation_id} answer model summary must mention aggregate-supply alternative`);
      }
    }
  }
}

function requirePacket(packet) {
  if (packet.schema_version !== 1) fail('packet schema_version must be 1');
  if (packet.sprint_id !== 'MTU-H5') fail('packet sprint_id must be MTU-H5');
  if (packet.packet_id !== EXPECTED_PACKET) fail('packet_id mismatch');
  if (packet.gate_id !== EXPECTED_GATE) fail('packet gate_id mismatch');
  if (packet.status !== 'q19_source_graph_extraction_execution_gate_ready_for_human_review_no_execution_authorized') {
    fail('packet status mismatch');
  }
  if (packet.start_commit !== START_COMMIT) fail('packet start_commit mismatch');
  if (packet.review_branch !== REVIEW_BRANCH) fail('packet review_branch mismatch');
  if (packet.packet_result?.completion_claimed !== false) fail('packet must not claim completion');
  if (packet.packet_result?.next_state !== 'ready_for_human_source_graph_extraction_execution_gate_review') fail('packet next_state mismatch');
  requireFalseBoundary(packet.authority_boundary, 'packet.authority_boundary');
  requireIncludesAll(packet.non_negotiable_requirements || [], [
    'No source-annex extraction execution is performed or authorized by this packet.',
    'No graph-object extraction execution is performed or authorized by this packet.',
    'No q19 fixture mutation, mapper repair, candidate storage creation, candidate writes, protected-reference mutation, machine-reference mutation, external-source mutation, authored target-exercise mutation, MTU mutation, operation-registry mutation, answer-skill mutation, lesson output, PV, diagnostics, adaptive routing, mastery, sequencing, product-route readiness claim, or student/product use is authorized.',
    'q19 must remain 3 failed / 20 review_required until extraction evidence is actually written and reviewed in a later authorized execution lane.',
    'A45 must remain forbidden as primary q19 support.',
    'full_graph_construction, calculus_route, and function_construction remain forbidden route tags for q19.',
    'The official aggregate-supply alternative for q19-step-2 and q19-step-3 must remain visible alongside the primary rightward demand-shift route.',
  ], 'packet non-negotiable requirements');
  if (packet.official_correction_model_caveats?.q19_steps_2_3_accepted_alternative !== AGGREGATE_SUPPLY_CAVEAT) {
    fail('packet must preserve q19 aggregate-supply alternative caveat');
  }
  requireIncludesAll(packet.official_correction_model_caveats?.applies_to_operation_ids || [], ['q19-step-2', 'q19-step-3'], 'packet caveat operation ids');
  requireStoragePlan(packet);
  requireFieldContracts(packet);
  requireOperationHooks(packet);

  const negativeIds = (packet.negative_regression_requirements || []).map((item) => item.guard_id);
  requireIncludesAll(negativeIds, [
    'q19-source-graph-false-reconstructable-negative-guard',
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
  if (gate.requested_decision?.later_execution_pr_may_write_if_approved !== true) {
    fail('gate must explicitly ask whether later execution PR may write exact overlay records');
  }
  const checklist = gate.core_requirement_checklist || [];
  if (checklist.length < 8) fail('gate core requirement checklist is incomplete');
  for (const item of checklist) {
    if (item.status !== 'met') fail(`core requirement ${item.requirement_id} must be met; PASS WITH FLAGS cannot carry missing core`);
  }
  requireIncludesAll(
    checklist.map((item) => item.requirement_id),
    [
      'core-1-non-executing-boundary',
      'core-2-future-write-surface-exact',
      'core-3-required-fields-exact',
      'core-4-live-q19-diagnostic-state',
      'core-5-negative-guards',
      'core-6-aggregate-supply-alternative-preserved',
      'core-7-carried-blockers-classified',
      'core-8-remote-discoverability',
    ],
    'gate core checklist'
  );
  for (const finding of gate.findings || []) {
    if (!finding.classification) fail(`${finding.finding_id}.classification missing`);
    if (!Array.isArray(finding.blocks)) fail(`${finding.finding_id}.blocks must be an array`);
    if (!Array.isArray(finding.does_not_block) || finding.does_not_block.length === 0) {
      fail(`${finding.finding_id}.does_not_block must be populated`);
    }
    if (!finding.proof_required_to_close) fail(`${finding.finding_id}.proof_required_to_close missing`);
  }
  requireIncludesAll(gate.must_review || [], [
    rel(PACKET_MD),
    rel(PACKET_JSON),
    rel(__filename),
    rel(PRIOR_SOURCE_GATE_PACKET),
    rel(PRIOR_SOURCE_GATE_REVIEW),
    rel(Q19_PLANNING_PACKET),
    rel(REGRESSION_REPORT_JSON),
    rel(FIXTURE),
    rel(H5_VALIDATOR),
    `${rel(CONTRACT)}#q19_extraction_contract`,
  ], 'gate must_review');
  if (gate.required_review_team_threshold?.minimum_verdict !== 'MORE_THAN_SATISFIED') fail('review threshold mismatch');
  if (gate.required_review_team_threshold?.all_three_required !== true) fail('all three review agents must be required');
}

function requireRemoteDiscoverability(packet, gate) {
  const bundleMd = readText(GATE_BUNDLE);
  const urlIndexMd = readText(URL_INDEX);
  const agentIndexMd = readText(AGENT_INDEX);
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
  }
}

function main() {
  const packet = readJson(PACKET_JSON);
  const packetMd = readText(PACKET_MD);
  const gate = readJson(GATE_JSON);
  const gateMd = readText(GATE_MD);

  requireGitSuccess(['merge-base', '--is-ancestor', START_COMMIT, 'HEAD'], 'current checkout must descend from PR #62 merge commit');
  requireGitSuccess(
    ['cat-file', '-e', `${START_COMMIT}:reports/mtu-hardening/mtu-h5-q19-source-graph-extraction-gate-1.json`],
    'PR #62 merge commit must contain q19 source/graph extraction gate packet'
  );

  requirePacket(packet);
  requireGatePacket(gate);
  requirePriorGateContinuity(packet);
  requireCurrentDiagnosticState(packet);
  requirePlanningDryRun(packet);
  requireFalseReconstructableNegative();
  requireA45NegativeGuard();
  assertFutureStorageAbsent();
  requireRemoteDiscoverability(packet, gate);

  for (const command of REQUIRED_VALIDATION_COMMANDS) {
    requireIncludes(packet.validation_commands || [], command, 'packet validation commands');
    requireIncludes(gate.validation_commands || [], command, 'gate validation commands');
  }

  for (const [text, context] of [[packetMd, 'packet markdown'], [gateMd, 'gate markdown']]) {
    for (const required of [
      'MTU-H5',
      'q19',
      'source/graph extraction execution gate',
      'source-annex-extraction-overlays.json',
      'teken',
      'aggregate-supply',
      'A45',
      'No source-annex',
      'student/product use',
    ]) {
      requireTextIncludes(text, required, context);
    }
  }

  console.log('OK MTU-H5 q19 source/graph extraction execution gate 1: ready_for_human_review_no_execution_authorized');
}

main();
