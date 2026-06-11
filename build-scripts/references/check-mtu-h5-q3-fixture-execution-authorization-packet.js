#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const { assertFutureStorageAbsent } = require('./lib/exam-ingestion-candidate-validation');
const {
  buildRawReferenceUrl,
  buildRawUrl,
  parseRepoFromPackageJson,
} = require('../sprints/emit-gate-bundle-urls.js');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q3-fixture-execution-authorization-packet.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q3-fixture-execution-authorization-packet.md');
const REVIEW_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-q3-fixture-execution', 'review-packet.json');
const REVIEW_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-q3-fixture-execution', 'review-packet.md');
const BUNDLE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-q3-fixture-execution', 'bundle-urls.md');
const URL_INDEX = path.join(ROOT, 'reports', 'url-index.md');
const AGENT_INDEX = path.join(ROOT, 'reports', 'github-agent-index-platform.md');
const GATE_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q3-execution-gate-packet.json');
const GATE_REVIEW = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-q3-execution', 'review-packet.json');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');

const START_COMMIT = '4ba9084d6a9725d6082b0e21ac39a391832dfb30';
const Q3_RECORD_ID = 'vw-1022-a-25-1-o:opgave-1:question-3';
const FIXTURE_PATH = 'reports/mtu-hardening/mtu-h5-regression-fixture.json';
const BRANCH = 'codex/mtu-h5-q3-fixture-execution-gate';
const SOLO_NEGATIVE_ASSERTION = 'MTUH5-NEGATIVE-negative-solo-q2-function-construction-overtrigger-FAILS-AS-EXPECTED';

const REQUIRED_Q3_FAILED_ASSERTIONS = [
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-1:ASSERT-MISSING-OPERATION-MTU',
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-1:ASSERT-OVER-TRIGGER',
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-2:ASSERT-MISSING-OPERATION-MTU',
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-2:ASSERT-OVER-TRIGGER',
];

const REQUIRED_Q3_REVIEW_MARKERS = [
  'review whether annual insurance cost threshold is a missing operation unit or strengthened existing arithmetic route',
  'review threshold-conclusion wording as answer-skill need or governed MTU procedure',
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
  'q3_fixture_mutation_authorized_now',
];

const EXACT_APPROVAL_TEXT = 'APPROVE q3-only fixture mutation for GATE-MTU-H5-q3-fixture-execution. Authorized write surface: reports/mtu-hardening/mtu-h5-regression-fixture.json, q3 record and q3-step-1/q3-step-2 fields only. Authorized execution: remove A15 from q3 mappings, retain A61/A96 support, retain A15 as forbidden, set q3 missing_mtu_expected false only with reviewed-equivalent refs, attach EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON refs, attach EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION refs for q3-step-2, keep scale and incidence false, and preserve a negative A15 regression guard. No protected-reference mutation, candidate storage, candidate writes, authored target-exercise mutation, MTU mutation, operation-registry mutation, answer-skill mutation, lesson output, PV, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, product-route readiness claim, or student/product use is authorized.';
const EXACT_DENIAL_SENTENCE = 'No protected-reference mutation, candidate storage, candidate writes, authored target-exercise mutation, MTU mutation, operation-registry mutation, answer-skill mutation, lesson output, PV, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, product-route readiness claim, or student/product use is authorized.';

function fail(message) {
  console.error(`MTU-H5 q3 fixture execution authorization check failed: ${message}`);
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

function requireArray(object, key, context, minItems = 1) {
  if (!Array.isArray(object[key]) || object[key].length < minItems) {
    fail(`${context}.${key} must be an array with at least ${minItems} item(s)`);
  }
  return object[key];
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

function normalizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
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

function requireCleanPaths(paths) {
  const run = git(['status', '--short', '--', ...paths]);
  if (run.status !== 0) fail(`could not inspect git status: ${(run.stderr || run.stdout || '').trim()}`);
  if (run.stdout.trim()) fail(`execution-protected surfaces must be clean:\n${run.stdout.trim()}`);
}

function findQ3(fixture) {
  const records = fixture.question_records || fixture.records || [];
  const q3 = records.find((record) => record.record_id === Q3_RECORD_ID);
  if (!q3) fail('fixture must contain q3 record');
  return q3;
}

function requireQ3Unrepaired(q3) {
  requireIncludesAll(q3.mapped_mtu_ids || [], ['A15', 'A61', 'A96'], 'q3 mapped_mtu_ids');
  const operations = requireArray(q3, 'official_correction_model_operations', 'q3', 2);
  for (const operationId of ['q3-step-1', 'q3-step-2']) {
    const operation = operations.find((item) => item.operation_id === operationId);
    if (!operation) fail(`missing q3 operation ${operationId}`);
    requireIncludesAll(operation.mapped_mtu_ids || [], ['A15', 'A61', 'A96'], `${operationId}.mapped_mtu_ids`);
    requireIncludesAll(operation.expected_required_mtu_ids || [], ['A61', 'A96'], `${operationId}.expected_required_mtu_ids`);
    requireIncludes(operation.expected_answer_form_mtu_ids || [], 'A96', `${operationId}.expected_answer_form_mtu_ids`);
    requireIncludes(operation.expected_forbidden_mtu_ids || [], 'A15', `${operationId}.expected_forbidden_mtu_ids`);
    if (operation.missing_mtu_expected !== true) fail(`${operationId}.missing_mtu_expected must remain true before execution`);
    if (operation.scale_factor_expected !== false) fail(`${operationId}.scale_factor_expected must remain false`);
    if (operation.incidence_or_pass_through_expected !== false) {
      fail(`${operationId}.incidence_or_pass_through_expected must remain false`);
    }
  }
  for (const marker of REQUIRED_Q3_REVIEW_MARKERS) {
    if (!operations.some((operation) => (operation.review_required_hooks || []).includes(marker))) {
      fail(`current q3 operation hooks must include: ${marker}`);
    }
  }
}

function runH5Validator() {
  const run = spawnSync(process.execPath, [
    rel(H5_VALIDATOR),
    '--fixture',
    rel(FIXTURE),
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

function requireValidatorStillPreExecution() {
  const result = runH5Validator();
  const failedIds = new Set((result.buckets?.failed || []).map((item) => item.assertion_id));
  const reviewIds = (result.buckets?.review_required || []).map((item) => item.assertion_id);
  const passedIds = new Set((result.buckets?.passed || []).map((item) => item.assertion_id));
  for (const assertionId of REQUIRED_Q3_FAILED_ASSERTIONS) {
    if (!failedIds.has(assertionId)) fail(`current validator result must still expose q3 failed assertion: ${assertionId}`);
  }
  for (const marker of REQUIRED_Q3_REVIEW_MARKERS) {
    if (!reviewIds.some((id) => id.includes(marker))) fail(`current validator result must still expose q3 review marker: ${marker}`);
  }
  if (!passedIds.has(SOLO_NEGATIVE_ASSERTION)) fail('Solo negative fixture guard must remain passing');
}

function approvalBlockFromMarkdown(markdown, context) {
  const blocks = Array.from(markdown.matchAll(/```text\s+([\s\S]*?)```/g)).map((match) => match[1]);
  const block = blocks.find((value) => value.includes('APPROVE q3-only fixture mutation for GATE-MTU-H5-q3-fixture-execution.'));
  if (!block) fail(`${context} must include approval text block`);
  return block;
}

function requireExactApprovalText(value, context) {
  if (normalizeText(value) !== normalizeText(EXACT_APPROVAL_TEXT)) {
    fail(`${context} approval text must match exact normalized authorization text`);
  }
  requireTextIncludes(normalizeText(value), EXACT_DENIAL_SENTENCE, `${context} approval text`);
}

function requireRemoteDiscoverability(review) {
  const bundleMd = readText(BUNDLE);
  const urlIndexMd = readText(URL_INDEX);
  const agentIndexMd = readText(AGENT_INDEX);
  const { owner, repo } = parseRepoFromPackageJson();

  for (const reference of review.must_review || []) {
    const url = buildRawReferenceUrl(owner, repo, BRANCH, reference);
    requireTextIncludes(bundleMd, url, 'gate bundle must_review URLs');
  }

  for (const reference of [rel(BUNDLE), rel(REVIEW_JSON), rel(REVIEW_MD)]) {
    const url = buildRawReferenceUrl(owner, repo, BRANCH, reference);
    requireTextIncludes(bundleMd, url, 'gate bundle self URLs');
  }

  requireTextIncludes(urlIndexMd, buildRawUrl(owner, repo, 'main', rel(BUNDLE)), 'reports/url-index.md');

  for (const reference of [
    rel(PACKET_JSON),
    rel(PACKET_MD),
    rel(__filename),
    rel(BUNDLE),
    rel(REVIEW_JSON),
    rel(REVIEW_MD),
  ]) {
    requireTextIncludes(agentIndexMd, reference, 'reports/github-agent-index-platform.md');
  }
}

function main() {
  const packet = readJson(PACKET_JSON);
  const packetMd = readText(PACKET_MD);
  const review = readJson(REVIEW_JSON);
  const reviewMd = readText(REVIEW_MD);
  const gatePacket = readJson(GATE_PACKET);
  const gateReview = readJson(GATE_REVIEW);
  const fixture = readJson(FIXTURE);

  if (packet.schema_version !== 1) fail('packet schema_version must be 1');
  if (packet.sprint_id !== 'MTU-H5') fail('packet sprint_id must be MTU-H5');
  if (packet.packet_id !== 'MTU-H5-q3-fixture-execution-authorization-packet') fail('unexpected packet_id');
  if (packet.status !== 'pending_explicit_q3_fixture_mutation_authorization_no_execution_performed') fail('unexpected packet status');
  if (packet.start_commit !== START_COMMIT) fail('packet start commit mismatch');
  if (packet.start_branch !== BRANCH) fail('packet branch mismatch');
  if (packet.execution_authorized_now !== false || packet.fixture_mutation_performed !== false) {
    fail('packet must not authorize or perform execution');
  }
  requireFalseBoundary(packet.authority_boundary, 'packet.authority_boundary');
  if (packet.packet_result?.completion_claimed !== false) fail('packet must not claim completion');
  if (packet.packet_result?.next_state !== 'ready_for_explicit_human_q3_fixture_mutation_authorization_review') {
    fail('packet next state mismatch');
  }

  requireGitSuccess(['merge-base', '--is-ancestor', START_COMMIT, 'HEAD'], 'checkout must descend from merged PR #27');
  requireGitSuccess(
    ['cat-file', '-e', `${START_COMMIT}:reports/mtu-hardening/mtu-h5-q3-execution-gate-packet.json`],
    'merged PR #27 commit must contain q3 execution gate packet'
  );
  requireCleanPaths([
    FIXTURE_PATH,
    'references/machine',
    'references/authored/course-target-exercises.json',
    'references/data/exam-ingestion',
    'build-scripts/references/check-mtu-h5-mapping-regression.js',
  ]);
  assertFutureStorageAbsent();

  if (gatePacket.packet_id !== 'MTU-H5-Q3-execution-gate-packet') fail('source q3 execution gate packet mismatch');
  if (gatePacket.authority_boundary?.execution_authorized_now !== false) fail('source q3 gate must not authorize execution');
  if (gateReview.gate_id !== 'GATE-MTU-H5-q3-execution') fail('source q3 gate review mismatch');
  if (gateReview.requested_decision?.execution_authorized_by_this_packet !== false) fail('source q3 gate review must not authorize execution');

  const q3 = findQ3(fixture);
  requireQ3Unrepaired(q3);
  requireValidatorStillPreExecution();

  const authorization = packet.requested_authorization || {};
  if (authorization.gate_id !== 'GATE-MTU-H5-q3-fixture-execution') fail('authorization gate id mismatch');
  if (authorization.authorization_phrase_required !== true) fail('authorization phrase must be required');
  requireExactApprovalText(authorization.exact_approval_text, 'packet JSON');
  requireExactApprovalText(approvalBlockFromMarkdown(packetMd, 'packet markdown'), 'packet markdown');

  const surface = packet.authorized_write_surface_if_approved_later || {};
  if (surface.path !== FIXTURE_PATH) fail('authorized future write path must be H5 fixture');
  if (surface.allowed_record_id !== Q3_RECORD_ID) fail('authorized record must be q3 only');
  requireIncludesAll(surface.allowed_operation_ids || [], ['q3-step-1', 'q3-step-2'], 'authorized operation ids');
  for (const forbidden of [
    'references/machine/',
    'references/authored/course-target-exercises.json',
    'references/data/exam-ingestion/',
    'build-scripts/references/check-mtu-h5-mapping-regression.js',
    'lesson output',
    'product routes',
    'student-facing output'
  ]) {
    requireIncludes(surface.forbidden_write_surfaces || [], forbidden, 'forbidden write surfaces');
  }

  const patchPreview = JSON.stringify(packet.future_patch_preview_if_approved || []);
  for (const required of [
    'remove A15; retain A61 and A96',
    'expected_forbidden_mtu_ids',
    'retain A15',
    'missing_mtu_expected',
    'set false',
    'reviewed_equivalent_operation_refs',
    'EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON',
    'reviewed_equivalent_answer_skill_refs',
    'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION',
    'review_required_hooks'
  ]) {
    if (!patchPreview.includes(required)) fail(`future patch preview must include ${required}`);
  }

  requireIncludesAll(packet.post_authorization_required_proof || [], [
    'the four current q3 failed assertions disappear',
    'the two current q3 review_required markers disappear',
    'non-q3 governed failures remain visible',
    'the Solo negative fixture still passes as fail-as-expected',
    'reintroducing A15 recreates q3 ASSERT-OVER-TRIGGER failures',
    'no protected references, candidate storage, authored target exercises, lessons, PV, diagnostics, product routes, or student surfaces change'
  ], 'post-authorization proof');

  if (review.schema_version !== 1) fail('review schema_version must be 1');
  if (review.gate_id !== 'GATE-MTU-H5-q3-fixture-execution') fail('review gate id mismatch');
  if (review.status !== 'pending_human_review') fail('review status must be pending_human_review');
  if (review.requested_decision?.execution_authorized_by_this_packet !== false) fail('review packet must not authorize execution by itself');
  requireExactApprovalText(review.requested_decision?.exact_approval_text, 'review JSON');
  requireExactApprovalText(approvalBlockFromMarkdown(reviewMd, 'review markdown'), 'review markdown');
  requireFalseBoundary(review.authority_boundary, 'review.authority_boundary');
  requireIncludesAll(review.must_review || [], [
    rel(PACKET_MD),
    rel(PACKET_JSON),
    rel(__filename),
    rel(GATE_PACKET),
    rel(GATE_REVIEW),
    rel(FIXTURE),
    rel(H5_VALIDATOR)
  ], 'review must_review');
  requireRemoteDiscoverability(review);

  for (const command of [
    'node build-scripts/references/check-mtu-h5-q3-fixture-execution-authorization-packet.js',
    'node build-scripts/references/check-mtu-h5-q3-execution-gate-packet.js',
    'node build-scripts/references/check-mtu-h5-fu001-q3-execution-readiness-packet.js',
    'node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --expect-fail --json',
    'node build-scripts/reports/validate-report-json.js',
    'node build-scripts/sprints/emit-url-index.js --check',
    'npm run agent:index',
    'npm run check:platform'
  ]) {
    requireIncludes(packet.validation_commands || [], command, 'packet validation commands');
    requireIncludes(review.validation_commands || [], command, 'review validation commands');
  }

  for (const [text, context] of [
    [packetMd, 'packet markdown'],
    [reviewMd, 'review markdown'],
  ]) {
    for (const required of [
      'GATE-MTU-H5-q3-fixture-execution',
      'APPROVE q3-only fixture mutation',
      FIXTURE_PATH,
      'A15',
      'A61',
      'A96',
      'EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON',
      'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION',
      'No q3 fixture mutation',
      'student/product use'
    ]) {
      requireTextIncludes(text, required, context);
    }
  }

  console.log('OK MTU-H5 q3 fixture execution authorization packet: ready_for_explicit_human_review');
}

main();
