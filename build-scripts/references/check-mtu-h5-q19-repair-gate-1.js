#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const { assertFutureStorageAbsent } = require('./lib/exam-ingestion-candidate-validation');
const {
  buildRawReferenceUrl,
  buildRawUrl,
  parseRepoFromPackageJson,
} = require('../sprints/emit-gate-bundle-urls.js');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-repair-gate-1.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-repair-gate-1.md');
const GATE_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-repair-gate-1', 'review-packet.json');
const GATE_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-repair-gate-1', 'review-packet.md');
const GATE_BUNDLE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-repair-gate-1', 'bundle-urls.md');
const URL_INDEX = path.join(ROOT, 'reports', 'url-index.md');
const AGENT_INDEX = path.join(ROOT, 'reports', 'github-agent-index-platform.md');
const REGRESSION_REPORT_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.json');
const POST_Q3_EVIDENCE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-post-q3-evidence-refresh-1.json');
const Q19_PLANNING_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-rp003-rp004-q19-planning-packet.json');
const Q19_PLANNING_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-RP003-RP004-q19-planning-packet', 'gate-closure.json');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');

const Q19_RECORD_ID = 'vw-1022-a-25-1-o:opgave-4:question-19';
const Q3_RECORD_ID = 'vw-1022-a-25-1-o:opgave-1:question-3';
const START_COMMIT = '1069f64d2314d073e9f4015ed08ffabb87e9b3e6';
const START_BRANCH = 'codex/mtu-h5-q19-repair-gate-1-20260612';

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

const REQUIRED_Q19_A45_NEGATIVE_ASSERTIONS = [
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-1:ASSERT-OVER-TRIGGER',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-2:ASSERT-OVER-TRIGGER',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-3:ASSERT-OVER-TRIGGER',
];

const REQUIRED_Q19_REVIEW_MARKERS = [
  'q19-source-annex-gap remains blocking',
  'q19-graph-object-gap remains blocking',
  'graph/draw/teken answer-form MTU or reviewed equivalent still needed',
  'q19 chained multi-market reasoning remains operation_registry_need with D10/D13 partial support',
  'q19 third graph-shift element is now modeled but still depends on blocked graph/source reconstruction',
];

const REQUIRED_FORBIDDEN_ROUTE_TAGS = [
  'full_graph_construction',
  'calculus_route',
  'function_construction',
];

function fail(message) {
  console.error(`MTU-H5 q19 repair gate 1 check failed: ${message}`);
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

function requireArray(object, key, context, minItems = 1) {
  if (!Array.isArray(object[key]) || object[key].length < minItems) {
    fail(`${context}.${key} must be an array with at least ${minItems} item(s)`);
  }
  return object[key];
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

function records(fixture) {
  return fixture.records || fixture.question_records || [];
}

function findRecord(fixture, recordId) {
  const record = records(fixture).find((item) => item.record_id === recordId);
  if (!record) fail(`fixture missing record: ${recordId}`);
  return record;
}

function assertionIds(result, bucket) {
  return (result.buckets?.[bucket] || []).map((item) => item.assertion_id);
}

function requireLiveValidatorSurface(packet) {
  const result = runH5Validator();
  const failedIds = assertionIds(result, 'failed');
  const reviewIds = assertionIds(result, 'review_required');
  const passedIds = assertionIds(result, 'passed');

  requireIncludesAll(failedIds, REQUIRED_Q19_FAILED_ASSERTIONS, 'live validator failed assertions');
  requireIncludesAll(packet.q19_live_failed_assertion_ids || [], REQUIRED_Q19_FAILED_ASSERTIONS, 'packet q19 live failed assertions');
  requireIncludesAll(packet.q19_live_review_markers || [], REQUIRED_Q19_REVIEW_MARKERS, 'packet q19 review markers');
  for (const marker of REQUIRED_Q19_REVIEW_MARKERS) {
    if (!reviewIds.some((id) => id.includes(marker))) fail(`live validator must expose q19 review marker: ${marker}`);
  }
  for (const bucket of ['failed', 'review_required']) {
    const q3Items = result.buckets[bucket].filter((item) => item.record_id === Q3_RECORD_ID);
    if (q3Items.length !== 0) fail(`q3 must remain absent from validator ${bucket} bucket`);
  }
  if (!passedIds.includes('MTUH5-NEGATIVE-negative-solo-q2-function-construction-overtrigger-FAILS-AS-EXPECTED')) {
    fail('global Solo negative fixture guard must remain passing');
  }
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

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mtu-h5-q19-a45-negative-'));
  const tempFixture = path.join(tempDir, 'fixture-with-a45.json');
  try {
    fs.writeFileSync(tempFixture, JSON.stringify(fixtureClone, null, 2));
    const result = runH5Validator(tempFixture);
    const failedIds = assertionIds(result, 'failed');
    requireIncludesAll(failedIds, REQUIRED_Q19_A45_NEGATIVE_ASSERTIONS, 'temporary A45 negative failed assertions');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function requireCurrentQ19FixtureShape(fixture) {
  const q19 = findRecord(fixture, Q19_RECORD_ID);
  if (q19.question_word !== 'teken') fail('q19 question_word must remain teken');
  requireIncludesAll(q19.mapped_mtu_ids || [], ['A42', 'D10', 'D13', 'A81'], 'q19 mapped MTUs');
  if ((q19.mapped_mtu_ids || []).includes('A45')) fail('q19 mapped MTUs must not include A45');
  const operations = requireArray(q19, 'official_correction_model_operations', 'q19', 3);
  for (const operation of operations) {
    if (operation.missing_answer_form_expected !== true) fail(`${operation.operation_id} must keep missing_answer_form_expected true`);
    requireIncludes(operation.expected_forbidden_mtu_ids || [], 'A45', `${operation.operation_id}.expected_forbidden_mtu_ids`);
    requireIncludesAll(operation.expected_forbidden_route_tags || [], REQUIRED_FORBIDDEN_ROUTE_TAGS, `${operation.operation_id}.expected_forbidden_route_tags`);
    if (operation.scale_factor_expected !== false) fail(`${operation.operation_id}.scale_factor_expected must be false`);
    if (operation.incidence_or_pass_through_expected !== false) fail(`${operation.operation_id}.incidence_or_pass_through_expected must be false`);
    if (!JSON.stringify(operation.review_required_hooks || []).includes('answer-form MTU')) {
      fail(`${operation.operation_id} must keep graph/draw answer-form hook`);
    }
  }
}

function requireDiagnosticReport(packet) {
  const report = readJson(REGRESSION_REPORT_JSON);
  const counts = report.question_bucket_counts || {};
  if (counts.q3?.failed !== 0 || counts.q3?.review_required !== 0) fail('report q3 counts must remain 0/0');
  if (counts.q19?.failed !== 3 || counts.q19?.review_required !== 20) fail('report q19 counts must remain 3/20');
  if (counts.q27?.failed !== 3 || counts.q27?.review_required !== 5) fail('report q27 counts must remain 3/5');
  if (counts.q15?.failed !== 0 || counts.q15?.review_required !== 4) fail('report q15 counts must remain 0/4');
  if (report.remaining_lane_status?.q19?.status !== 'graph_draw_source_answer_form_procedure_blocker') {
    fail('report q19 lane status mismatch');
  }
  if (packet.current_diagnostic_state?.q19?.failed !== 3 || packet.current_diagnostic_state?.q19?.review_required !== 20) {
    fail('packet q19 diagnostic counts mismatch');
  }
  const postQ3 = readJson(POST_Q3_EVIDENCE);
  if (postQ3.completion_claimed !== false) fail('post-q3 evidence must not claim completion');
}

function requireQ19PlanningContinuity() {
  const planningPacket = readJson(Q19_PLANNING_PACKET);
  const planningGate = readJson(Q19_PLANNING_GATE);
  if (planningGate.status !== 'approved_more_than_satisfied_no_mutation_authorized') {
    fail('q19 planning gate must remain MORE_THAN_SATISFIED approved');
  }
  if (planningGate.verdict !== 'APPROVE_MORE_THAN_SATISFIED') fail('q19 planning gate verdict mismatch');
  if (planningPacket.packet_result?.completion_claimed !== false) fail('q19 planning packet must not claim completion');
  if (planningPacket.answer_form_and_misconception_evidence?.question_word !== 'teken') {
    fail('q19 planning packet must preserve teken answer-form evidence');
  }
  if (planningPacket.answer_form_and_misconception_evidence?.expected_answer_form?.status !== 'missing_reviewed_equivalent') {
    fail('q19 planning packet must keep answer form missing reviewed equivalent');
  }
  if (planningPacket.negative_regression_requirement?.guard_id !== 'q19-teken-answer-form-and-a45-primary-guard') {
    fail('q19 planning packet negative guard mismatch');
  }
}

function requireWriteSurfaceDecision(packet) {
  const decision = packet.write_surface_decision || {};
  if (decision.decision_status !== 'source_graph_extraction_gate_first_no_mutation_authorized') {
    fail('write surface decision status mismatch');
  }
  if (decision.recommended_next_gate !== 'MTU-H5-Q19-SOURCE-GRAPH-EXTRACTION-GATE-1') {
    fail('recommended next gate mismatch');
  }
  if (decision.fixture_only_repair_possible_now !== false) fail('fixture-only q19 repair must be rejected now');
  if (decision.source_annex_extraction_needed_before_fixture_repair !== true) fail('source-annex extraction must be needed');
  if (decision.graph_object_extraction_needed_before_fixture_repair !== true) fail('graph-object extraction must be needed');
  if (decision.graph_draw_teken_answer_form_required !== true) fail('graph/draw/teken answer form must be required');
  if (decision.a45_overtrigger_guard_required !== true) fail('A45 over-trigger guard must be required');
  for (const key of [
    'future_mapper_or_checker_repair_allowed_now',
    'future_fixture_mutation_allowed_now',
    'future_candidate_storage_allowed_now',
    'future_protected_reference_mutation_allowed_now',
  ]) {
    if (decision[key] !== false) fail(`write_surface_decision.${key} must be false`);
  }
}

function requireGateQuestions(packet) {
  const answers = requireArray(packet, 'answers_to_gate_questions', 'packet', 10);
  const ids = answers.map((item) => item.question_id).sort((a, b) => a - b);
  for (let id = 1; id <= 10; id += 1) {
    if (ids[id - 1] !== id) fail(`answers_to_gate_questions must include question_id ${id}`);
  }
  const answerText = JSON.stringify(answers);
  for (const required of [
    'ASSERT-ANSWER-FORM-MISSING',
    'Twenty q19 review_required hooks remain',
    'Fixture-only repair is not acceptable',
    'source-annex extraction',
    'graph-object extraction',
    'graph/draw/teken',
    'A45',
    'ASSERT-OVER-TRIGGER',
    'source/graph extraction gate packet',
    'q27 and q15 also remain carried blockers',
  ]) {
    if (!answerText.includes(required)) fail(`gate answers must include ${required}`);
  }
}

function requireRemoteDiscoverability(packet, gate) {
  const bundleMd = readText(GATE_BUNDLE);
  const urlIndexMd = readText(URL_INDEX);
  const agentIndexMd = readText(AGENT_INDEX);
  const { owner, repo } = parseRepoFromPackageJson();
  const reviewBranch = packet.start_branch;

  for (const reference of gate.must_review || []) {
    const url = buildRawReferenceUrl(owner, repo, reviewBranch, reference);
    requireTextIncludes(bundleMd, url, 'gate bundle must_review URLs');
  }
  for (const reference of [rel(GATE_BUNDLE), rel(GATE_JSON), rel(GATE_MD)]) {
    const url = buildRawReferenceUrl(owner, repo, reviewBranch, reference);
    requireTextIncludes(bundleMd, url, 'gate bundle self URLs');
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

function requireGatePacket(gate) {
  if (gate.schema_version !== 1) fail('gate schema_version must be 1');
  if (gate.gate_id !== 'GATE-MTU-H5-Q19-repair-gate-1') fail('gate id mismatch');
  if (gate.status !== 'pending_human_review') fail('gate must be pending human review');
  if (gate.source_repair_gate_packet_json !== rel(PACKET_JSON)) fail('gate packet JSON link mismatch');
  if (gate.checker !== rel(__filename)) fail('gate checker link mismatch');
  if (gate.requested_decision?.execution_authorized_by_this_packet !== false) fail('gate must not authorize execution');
  requireFalseBoundary(gate.authority_boundary, 'gate.authority_boundary');
  requireIncludesAll(gate.must_review || [], [
    rel(PACKET_MD),
    rel(PACKET_JSON),
    rel(__filename),
    rel(REGRESSION_REPORT_JSON),
    rel(POST_Q3_EVIDENCE),
    rel(Q19_PLANNING_PACKET),
    rel(Q19_PLANNING_GATE),
    rel(FIXTURE),
    rel(H5_VALIDATOR),
  ], 'gate must_review');
  if (gate.required_review_team_threshold?.minimum_verdict !== 'MORE_THAN_SATISFIED') {
    fail('gate review threshold mismatch');
  }
}

function main() {
  const packet = readJson(PACKET_JSON);
  const packetMd = readText(PACKET_MD);
  const gate = readJson(GATE_JSON);
  const gateMd = readText(GATE_MD);
  const fixture = readJson(FIXTURE);

  if (packet.schema_version !== 1) fail('packet schema_version must be 1');
  if (packet.sprint_id !== 'MTU-H5') fail('packet sprint_id must be MTU-H5');
  if (packet.packet_id !== 'MTU-H5-Q19-repair-gate-1') fail('unexpected packet_id');
  if (packet.status !== 'q19_repair_gate_ready_for_human_review_no_execution_authorized') fail('unexpected packet status');
  if (packet.start_commit !== START_COMMIT) fail('packet start_commit mismatch');
  if (packet.source_pr51_merge_commit !== START_COMMIT) fail('packet source_pr51_merge_commit mismatch');
  if (packet.start_branch !== START_BRANCH) fail('packet start_branch mismatch');
  if (packet.packet_result?.completion_claimed !== false) fail('packet must not claim completion');
  if (packet.packet_result?.next_state !== 'ready_for_human_repair_gate_review') fail('packet next_state mismatch');
  if (!String(packet.index_artifact_decision || '').includes('generated platform index also includes pre-existing current-main inventory catch-up entries')) {
    fail('packet must explain generated platform-index catch-up scope');
  }
  requireFalseBoundary(packet.authority_boundary, 'packet.authority_boundary');
  requireGitSuccess(['merge-base', '--is-ancestor', START_COMMIT, 'HEAD'], 'current checkout must descend from PR #51 merge commit');
  requireGitSuccess(
    ['cat-file', '-e', `${START_COMMIT}:reports/mtu-hardening/mtu-h5-post-q3-evidence-refresh-1.json`],
    'PR #51 merge commit must contain post-q3 evidence refresh result'
  );

  requireDiagnosticReport(packet);
  requireQ19PlanningContinuity();
  requireCurrentQ19FixtureShape(fixture);
  requireLiveValidatorSurface(packet);
  requireA45NegativeGuard();
  assertFutureStorageAbsent();
  requireWriteSurfaceDecision(packet);
  requireGateQuestions(packet);

  const negative = packet.negative_regression_requirement || {};
  if (negative.guard_id !== 'q19-a45-and-forbidden-route-regression-guard') fail('negative guard id mismatch');
  requireIncludesAll(
    negative.temp_fixture_expected_failed_assertion_ids || [],
    REQUIRED_Q19_A45_NEGATIVE_ASSERTIONS,
    'negative guard temp fixture assertions'
  );
  for (const required of [
    'expected_forbidden_mtu_ids includes A45 for every q19 operation',
    'expected_forbidden_route_tags includes full_graph_construction, calculus_route, and function_construction for every q19 operation',
    'missing_answer_form_expected remains true until reviewed graph/draw coverage exists',
    'q19-source-annex-gap and q19-graph-object-gap remain visible until separately reviewed',
  ]) {
    requireIncludes(negative.must_preserve || [], required, 'negative guard must_preserve');
  }

  requireGatePacket(gate);
  requireRemoteDiscoverability(packet, gate);

  for (const command of [
    'node build-scripts/references/check-mtu-h5-q19-repair-gate-1.js',
    'node build-scripts/references/check-mtu-h5-rp003-rp004-q19-planning-packet.js',
    'node build-scripts/references/build-mtu-h5-regression-report.js --check',
    'node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --expect-fail --json',
    'node build-scripts/reports/validate-report-json.js',
    'node build-scripts/sprints/emit-url-index.js --check',
    'npm run agent:index',
    'npm run check:platform',
  ]) {
    requireIncludes(packet.validation_commands || [], command, 'packet validation commands');
    requireIncludes(gate.validation_commands || [], command, 'gate validation commands');
  }

  for (const [text, context] of [[packetMd, 'packet markdown'], [gateMd, 'gate markdown']]) {
    for (const required of [
      'MTU-H5',
      'q19',
      'teken',
      'A45',
      'source/graph extraction gate',
      'No q19 fixture mutation',
      'student/product use',
    ]) {
      requireTextIncludes(text, required, context);
    }
  }

  console.log('OK MTU-H5 q19 repair gate 1: ready_for_human_repair_gate_review');
}

main();
