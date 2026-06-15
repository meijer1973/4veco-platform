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
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-source-graph-extraction-gate-1.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-source-graph-extraction-gate-1.md');
const GATE_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-source-graph-extraction-gate-1', 'review-packet.json');
const GATE_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-source-graph-extraction-gate-1', 'review-packet.md');
const GATE_BUNDLE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-source-graph-extraction-gate-1', 'bundle-urls.md');
const URL_INDEX = path.join(ROOT, 'reports', 'url-index.md');
const AGENT_INDEX = path.join(ROOT, 'reports', 'github-agent-index-platform.md');
const PRIOR_Q19_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-repair-gate-1.json');
const PRIOR_Q19_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-repair-gate-1', 'review-packet.json');
const Q19_PLANNING_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-rp003-rp004-q19-planning-packet.json');
const Q19_PLANNING_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-RP003-RP004-q19-planning-packet', 'gate-closure.json');
const REGRESSION_REPORT_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.json');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');
const CONTRACT = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'operation-answer-skill-contract.json');

const Q19_RECORD_ID = 'vw-1022-a-25-1-o:opgave-4:question-19';
const Q3_RECORD_ID = 'vw-1022-a-25-1-o:opgave-1:question-3';
const START_COMMIT = 'cee6bb40adf2b855854b28245ca49cc6543fc6cb';
const START_BRANCH = 'codex/mtu-h5-q19-source-graph-extraction-gate-1-20260615';
const EXPECTED_GATE = 'GATE-MTU-H5-Q19-source-graph-extraction-gate-1';
const EXPECTED_PACKET = 'MTU-H5-Q19-source-graph-extraction-gate-1';

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

const REQUIRED_SOURCE_IDS = [
  'EX_SRC_Q19_SOURCE_FIGURE',
  'EX_SRC_Q19_UITWERKBIJLAGE',
  'EX_SRC_Q19_CURACAO_LABOR_MARKET_GRAPH',
  'EX_SRC_Q19_CURACAO_GOODS_MARKET_GRAPH',
  'EX_SRC_Q19_ARUBA_GOODS_MARKET_GRAPH',
];

const AGGREGATE_SUPPLY_CAVEAT =
  'Correct aggregate-supply shifts for q19-step-2 and q19-step-3 are accepted as an alternative in the official correction model.';

const REQUIRED_VALIDATION_COMMANDS = [
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
  console.error(`MTU-H5 q19 source/graph extraction gate 1 check failed: ${message}`);
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
  const run = spawnSync(process.execPath, [
    rel(H5_VALIDATOR),
    '--fixture',
    path.isAbsolute(fixturePath) ? fixturePath : rel(fixturePath),
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

function requirePriorGateContinuity() {
  const prior = readJson(PRIOR_Q19_PACKET);
  const priorGate = readJson(PRIOR_Q19_GATE);
  if (prior.status !== 'q19_repair_gate_ready_for_human_review_no_execution_authorized') {
    fail('prior q19 repair gate status mismatch');
  }
  if (prior.write_surface_decision?.recommended_next_gate !== 'MTU-H5-Q19-SOURCE-GRAPH-EXTRACTION-GATE-1') {
    fail('prior q19 repair gate did not recommend this source/graph gate');
  }
  if (prior.write_surface_decision?.source_annex_extraction_needed_before_fixture_repair !== true) {
    fail('prior q19 repair gate must require source-annex extraction before fixture repair');
  }
  if (prior.write_surface_decision?.graph_object_extraction_needed_before_fixture_repair !== true) {
    fail('prior q19 repair gate must require graph-object extraction before fixture repair');
  }
  if (priorGate.requested_decision?.execution_authorized_by_this_packet !== false) {
    fail('prior q19 gate must not authorize execution');
  }
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
  requireIncludesAll([...graphIds, ...sourceIds], REQUIRED_SOURCE_IDS, 'dry-run q19 extraction ids');
  for (const record of [...(dryRun.graph_overlays || []), ...(dryRun.source_annex_overlays || [])]) {
    if (record.extraction_status !== 'partial_with_blocking_gap') fail(`${record.extraction_id} must stay partial_with_blocking_gap`);
    if (record.review_state !== 'blocked') fail(`${record.extraction_id} must stay blocked`);
    requireIncludes(record.blocking_gap_ids || [], 'q19-source-annex-gap', `${record.extraction_id}.blocking_gap_ids`);
    requireIncludes(record.blocking_gap_ids || [], 'q19-graph-object-gap', `${record.extraction_id}.blocking_gap_ids`);
  }
  const packetIds = (packet.q19_extraction_scope?.source_materials_to_review || []).map((item) => item.extraction_id);
  requireIncludesAll(packetIds, REQUIRED_SOURCE_IDS, 'packet source materials to review');
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
    if (!values.includes('A45')) values.push('A45');
  }
  addA45(q19.mapped_mtu_ids);
  for (const operation of q19.official_correction_model_operations || []) {
    addA45(operation.mapped_mtu_ids);
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mtu-h5-q19-source-graph-a45-negative-'));
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

function requireContract(packet) {
  const contract = readJson(CONTRACT).q19_extraction_contract;
  if (!contract) fail('operation-answer-skill contract missing q19_extraction_contract');
  if (contract.execution_authorized_now !== false) fail('q19 extraction contract must not authorize execution now');
  if (contract.storage_status !== 'future_storage_not_created') fail('q19 extraction contract must keep future storage absent');
  const scope = packet.q19_extraction_scope || {};
  if (scope.storage_path_under_review !== contract.storage_path) fail('packet storage path mismatch');
  if (scope.storage_status_required_now !== contract.storage_status) fail('packet storage status mismatch');
  requireIncludesAll(scope.required_graph_fields || [], contract.required_graph_fields || [], 'packet graph fields');
  const sourceFields = (scope.required_source_annex_fields || []).map((field) => field === 'prompt_reference' ? 'prompt_ref' : field);
  requireIncludesAll(sourceFields, contract.required_source_annex_fields || [], 'packet source annex fields');
  requireIncludesAll(scope.source_materials_to_review?.[0]?.blocking_gap_ids || [], contract.blocking_gap_ids || [], 'packet source material blocking gaps');
}

function requirePacket(packet) {
  if (packet.schema_version !== 1) fail('packet schema_version must be 1');
  if (packet.sprint_id !== 'MTU-H5') fail('packet sprint_id must be MTU-H5');
  if (packet.packet_id !== EXPECTED_PACKET) fail('packet_id mismatch');
  if (packet.gate_id !== EXPECTED_GATE) fail('packet gate_id mismatch');
  if (packet.status !== 'q19_source_graph_extraction_gate_ready_for_human_review_no_execution_authorized') fail('packet status mismatch');
  if (packet.start_commit !== START_COMMIT) fail('packet start_commit mismatch');
  if (packet.source_pr56_merge_commit !== START_COMMIT) fail('packet source_pr56_merge_commit mismatch');
  if (packet.start_branch !== START_BRANCH) fail('packet start_branch mismatch');
  if (packet.packet_result?.completion_claimed !== false) fail('packet must not claim completion');
  if (packet.packet_result?.next_state !== 'ready_for_human_source_graph_extraction_gate_review') fail('packet next_state mismatch');
  requireFalseBoundary(packet.authority_boundary, 'packet.authority_boundary');
  requireIncludesAll(packet.non_negotiable_requirements || [], [
    'No source-annex extraction execution is authorized by this gate.',
    'No graph-object extraction execution is authorized by this gate.',
    'q19 must remain 3 failed / 20 review_required until reviewed source/graph and answer-form evidence exists.',
    'A45 must remain forbidden as primary q19 support.',
    'The official aggregate-supply alternative for q19-step-2 and q19-step-3 must remain visible alongside the primary rightward demand-shift route.',
  ], 'packet non-negotiable requirements');
  if (packet.official_correction_model_caveats?.q19_steps_2_3_accepted_alternative?.includes('aggregate-supply shifts') !== true) {
    fail('packet must preserve q19 aggregate-supply alternative caveat');
  }
  requireIncludesAll(
    packet.official_correction_model_caveats?.applies_to_operation_ids || [],
    ['q19-step-2', 'q19-step-3'],
    'packet aggregate-supply alternative operation ids'
  );
  if (packet.q19_extraction_scope?.execution_authorized_by_this_packet !== false) fail('packet extraction scope must not authorize execution');
  if (packet.q19_extraction_scope?.future_storage_must_remain_absent_now !== true) fail('future storage must remain absent now');
  if (packet.gate_decision?.requested_human_decision?.includes('Approve, revise, or reject') !== true) fail('packet must request human decision');
  if (!Array.isArray(packet.operation_answer_form_hooks) || packet.operation_answer_form_hooks.length !== 3) {
    fail('packet must contain three q19 operation answer-form hooks');
  }
  for (const hook of packet.operation_answer_form_hooks) {
    requireIncludes(hook.forbidden_mtu_ids || [], 'A45', `${hook.operation_id}.forbidden_mtu_ids`);
    requireIncludes(hook.route_tags || [], 'graph_shift', `${hook.operation_id}.route_tags`);
    if (hook.expected_missing_answer_form_candidate !== 'EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION') {
      fail(`${hook.operation_id} must keep missing answer-form candidate`);
    }
    if (['q19-step-2', 'q19-step-3'].includes(hook.operation_id)) {
      if (hook.accepted_alternative_caveat !== AGGREGATE_SUPPLY_CAVEAT) {
        fail(`${hook.operation_id} must preserve aggregate-supply alternative caveat`);
      }
      if (!String(hook.answer_model_summary || '').includes('aggregate-supply shift alternative')) {
        fail(`${hook.operation_id} answer model summary must mention aggregate-supply alternative`);
      }
      if (!String(hook.required_student_mark || '').includes('aggregate-supply shift alternative')) {
        fail(`${hook.operation_id} required student mark must mention aggregate-supply alternative`);
      }
    }
  }
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
  if (gate.requested_decision?.execution_authorized_by_this_packet !== false) fail('gate must not authorize execution');
  const checklist = gate.core_requirement_checklist || [];
  if (checklist.length < 7) fail('gate core requirement checklist is incomplete');
  for (const item of checklist) {
    if (item.status !== 'met') fail(`core requirement ${item.requirement_id} must be met; PASS WITH FLAGS cannot carry missing core`);
  }
  if (!checklist.some((item) => item.requirement_id === 'core-7-aggregate-supply-alternative-preserved')) {
    fail('gate core checklist must preserve aggregate-supply alternative caveat');
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
    rel(PACKET_MD),
    rel(PACKET_JSON),
    rel(__filename),
    rel(PRIOR_Q19_PACKET),
    rel(Q19_PLANNING_PACKET),
    rel(REGRESSION_REPORT_JSON),
    rel(FIXTURE),
    rel(H5_VALIDATOR),
  ], 'gate must_review');
  if (gate.required_review_team_threshold?.minimum_verdict !== 'MORE_THAN_SATISFIED') fail('review threshold mismatch');
  if (gate.required_review_team_threshold?.all_three_required !== true) fail('all three review agents must be required');
}

function requireRemoteDiscoverability(packet, gate) {
  const bundleMd = readText(GATE_BUNDLE);
  const urlIndexMd = readText(URL_INDEX);
  const agentIndexMd = readText(AGENT_INDEX);
  const { owner, repo } = parseRepoFromPackageJson();
  const reviewBranch = packet.start_branch;
  const references = new Set([
    ...(gate.must_review || []),
    ...(gate.evidence_base || []),
    rel(GATE_BUNDLE),
    rel(GATE_JSON),
    rel(GATE_MD),
  ]);
  for (const reference of references) {
    const url = buildRawReferenceUrl(owner, repo, reviewBranch, reference);
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

  requireGitSuccess(['merge-base', '--is-ancestor', START_COMMIT, 'HEAD'], 'current checkout must descend from PR #56 merge commit');
  requireGitSuccess(
    ['cat-file', '-e', `${START_COMMIT}:reports/mtu-hardening/mtu-h5-q19-repair-gate-1.json`],
    'PR #56 merge commit must contain q19 repair gate result'
  );

  requirePacket(packet);
  requireGatePacket(gate);
  requirePriorGateContinuity();
  requireCurrentDiagnosticState(packet);
  requirePlanningDryRun(packet);
  requireContract(packet);
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
      'source/graph extraction',
      'teken',
      'aggregate-supply',
      'A45',
      'No source-annex',
      'student/product use',
    ]) {
      requireTextIncludes(text, required, context);
    }
  }

  console.log('OK MTU-H5 q19 source/graph extraction gate 1: ready_for_human_review_no_execution_authorized');
}

main();
