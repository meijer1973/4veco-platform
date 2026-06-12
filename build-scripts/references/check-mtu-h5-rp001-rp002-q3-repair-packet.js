#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const crypto = require('crypto');

const {
  assertFutureStorageAbsent,
  validateAnswerSkillCandidate,
  validateOperationAnswerPair,
  validateOperationCandidate,
} = require('./lib/exam-ingestion-candidate-validation');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-rp001-rp002-q3-repair-packet.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-rp001-rp002-q3-repair-packet.md');
const SOURCE_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-next-repair-packet', 'gate-closure.json');
const PLANNING_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-rp001-rp002-q3-planning-packet.json');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');

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

const REQUIRED_Q3_ASSERTIONS = [
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-1:ASSERT-MISSING-OPERATION-MTU',
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-1:ASSERT-OVER-TRIGGER',
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-2:ASSERT-MISSING-OPERATION-MTU',
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-2:ASSERT-OVER-TRIGGER',
];

const REQUIRED_Q3_OVERTRIGGER_ASSERTIONS = [
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-1:ASSERT-OVER-TRIGGER',
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-2:ASSERT-OVER-TRIGGER',
];

function fail(message) {
  console.error(`MTU-H5 RP-001/RP-002 q3 repair packet check failed: ${message}`);
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

function requireIncludes(text, needle, context) {
  if (!text.includes(needle)) fail(`${context} must include ${needle}`);
}

function requireFalseBoundary(boundary, context) {
  for (const key of AUTHORITY_FALSE_KEYS) {
    if (!boundary || boundary[key] !== false) fail(`${context}.${key} must be false`);
  }
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function git(args, options = {}) {
  return spawnSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: options.quiet ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'pipe', 'pipe'],
  });
}

function requireGitSuccess(args, message) {
  const run = git(args, { quiet: true });
  if (run.status !== 0) {
    fail(`${message}: ${(run.stderr || run.stdout || '').trim()}`);
  }
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

function requireIncludesAll(values, required, context) {
  for (const value of required) {
    if (!values.includes(value)) fail(`${context} must include ${value}`);
  }
}

function requireExcludes(values, forbidden, context) {
  if (values.includes(forbidden)) fail(`${context} must not include ${forbidden}`);
}

function requireQ3PreExecutionState(q3) {
  requireIncludesAll(q3.mapped_mtu_ids || [], ['A15', 'A61', 'A96'], 'q3 fixture mapped MTUs before execution');
  for (const operation of requireArray(q3, 'official_correction_model_operations', 'q3', 2)) {
    requireIncludesAll(operation.mapped_mtu_ids || [], ['A15', 'A61', 'A96'], `${operation.operation_id}.mapped_mtu_ids`);
    if (!operation.expected_forbidden_mtu_ids?.includes('A15')) fail(`${operation.operation_id} must forbid A15`);
    if (!operation.expected_required_mtu_ids?.includes('A61')) fail(`${operation.operation_id} must require A61 support`);
    if (!operation.expected_answer_form_mtu_ids?.includes('A96')) fail(`${operation.operation_id} must require A96 answer form`);
    if (operation.missing_mtu_expected !== true) fail(`${operation.operation_id} must keep missing_mtu_expected true`);
  }

  const result = runH5Validator();
  const failedIds = new Set(result.buckets.failed.map((item) => item.assertion_id));
  for (const assertionId of REQUIRED_Q3_ASSERTIONS) {
    if (!failedIds.has(assertionId)) fail(`current validator result must still expose q3 assertion: ${assertionId}`);
  }
  return failedIds;
}

function requireQ3PostExecutionState(q3) {
  requireIncludesAll(q3.mapped_mtu_ids || [], ['A61', 'A96'], 'q3 fixture mapped MTUs after execution');
  requireExcludes(q3.mapped_mtu_ids || [], 'A15', 'q3 fixture mapped MTUs after execution');
  for (const operation of requireArray(q3, 'official_correction_model_operations', 'q3', 2)) {
    requireIncludesAll(operation.mapped_mtu_ids || [], ['A61', 'A96'], `${operation.operation_id}.mapped_mtu_ids`);
    requireExcludes(operation.mapped_mtu_ids || [], 'A15', `${operation.operation_id}.mapped_mtu_ids`);
    if (!operation.expected_forbidden_mtu_ids?.includes('A15')) fail(`${operation.operation_id} must keep A15 forbidden`);
    requireIncludesAll(operation.expected_required_mtu_ids || [], ['A61', 'A96'], `${operation.operation_id}.expected_required_mtu_ids`);
    if (!operation.expected_answer_form_mtu_ids?.includes('A96')) fail(`${operation.operation_id} must require A96 answer form`);
    if (operation.missing_mtu_expected !== false) fail(`${operation.operation_id} must have missing_mtu_expected false after execution`);
    if (operation.scale_factor_expected !== false) fail(`${operation.operation_id} must keep scale_factor_expected false`);
    if (operation.incidence_or_pass_through_expected !== false) {
      fail(`${operation.operation_id} must keep incidence_or_pass_through_expected false`);
    }
    if (!JSON.stringify(operation.reviewed_equivalent_operation_refs || []).includes('EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON')) {
      fail(`${operation.operation_id} must cite reviewed-equivalent q3 annual-threshold operation evidence`);
    }
    if ((operation.review_required_hooks || []).length !== 0) fail(`${operation.operation_id} must clear q3 review_required hooks after execution`);
    if (operation.operation_id === 'q3-step-2') {
      if (!JSON.stringify(operation.reviewed_equivalent_answer_skill_refs || []).includes('EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION')) {
        fail('q3-step-2 must cite reviewed-equivalent threshold-conclusion answer-skill evidence');
      }
    }
  }

  const result = runH5Validator();
  for (const bucket of ['failed', 'review_required']) {
    const q3Items = (result.buckets[bucket] || []).filter((item) => item.record_id === q3.record_id);
    if (q3Items.length !== 0) fail(`q3 must be absent from current validator ${bucket} bucket after execution`);
  }
  return requireQ3A15NegativeGuard();
}

function addA15(values) {
  return values.includes('A15') ? values : values.concat('A15');
}

function requireQ3A15NegativeGuard() {
  const fixtureClone = readJson(FIXTURE);
  const records = fixtureClone.question_records || fixtureClone.records || [];
  const q3 = records.find((record) => record.record_id === 'vw-1022-a-25-1-o:opgave-1:question-3');
  if (!q3) fail('temp negative fixture could not find q3 record');
  q3.mapped_mtu_ids = addA15(q3.mapped_mtu_ids || []);
  for (const operation of q3.official_correction_model_operations || []) {
    operation.mapped_mtu_ids = addA15(operation.mapped_mtu_ids || []);
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mtu-h5-q3-negative-'));
  const tempFixture = path.join(tempDir, 'fixture-with-a15.json');
  try {
    fs.writeFileSync(tempFixture, JSON.stringify(fixtureClone, null, 2));
    const result = runH5Validator(tempFixture);
    const failedIds = new Set((result.buckets.failed || []).map((item) => item.assertion_id));
    for (const assertionId of REQUIRED_Q3_OVERTRIGGER_ASSERTIONS) {
      if (!failedIds.has(assertionId)) fail(`q3 temp negative fixture must expose over-trigger assertion: ${assertionId}`);
    }
    return failedIds;
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function main() {
  const packet = readJson(PACKET_JSON);
  const packetMd = readText(PACKET_MD);
  const sourceGate = readJson(SOURCE_GATE);
  const planningPacket = readJson(PLANNING_PACKET);
  const fixture = readJson(FIXTURE);

  if (packet.schema_version !== 1) fail('packet schema_version must be 1');
  if (packet.sprint_id !== 'MTU-H5') fail('packet sprint_id must be MTU-H5');
  if (packet.status !== 'q3_repair_packet_ready_for_three_agent_review_no_mutation_authorized') {
    fail('unexpected packet status');
  }
  if (sourceGate.status !== 'approved_triage_review_packet') fail('source gate must be approved');
  if (planningPacket.status !== 'opened_planning_lane_no_mutation_authorized') fail('source planning packet status mismatch');
  if (sourceGate.reviewed_remote_commit !== packet.reviewed_packet_commit) {
    fail('packet reviewed_packet_commit must match source gate reviewed_remote_commit');
  }
  requireGitSuccess(
    ['cat-file', '-e', `${packet.reviewed_packet_commit}:reports/mtu-hardening/mtu-h5-next-repair-packet.json`],
    'reviewed packet commit must contain source repair packet'
  );
  requireGitSuccess(
    ['cat-file', '-e', `${packet.current_gate_commit}:reports/review-gates/GATE-MTU-H5-next-repair-packet/gate-closure.json`],
    'current gate commit must contain source gate closure'
  );
  requireGitSuccess(
    ['merge-base', '--is-ancestor', packet.reviewed_packet_commit, packet.current_gate_commit],
    'reviewed packet commit must be an ancestor of current gate commit'
  );
  if (packet.packet_result?.completion_claimed !== false) fail('packet must not claim lane completion');
  if (packet.packet_result?.next_state !== 'ready_for_three_agent_review') fail('packet next_state mismatch');
  requireFalseBoundary(packet.authority_boundary, 'packet.authority_boundary');

  const officialEvidence = packet.official_source_evidence || {};
  for (const [pdfRef, expectedHash, label] of [
    [officialEvidence.question_pdf, officialEvidence.question_pdf_sha256, 'question_pdf_sha256'],
    [officialEvidence.correction_pdf, officialEvidence.correction_pdf_sha256, 'correction_pdf_sha256'],
  ]) {
    const file = pdfRef && pdfRef.split('#')[0];
    const absolute = file && path.join(ROOT, file);
    if (!file || !fs.existsSync(absolute)) fail(`missing official source evidence: ${pdfRef}`);
    if (!expectedHash || sha256(absolute) !== expectedHash) fail(`official source hash mismatch for ${label}`);
  }
  const values = officialEvidence.source_values || {};
  const statutoryTotal = (12 * values.statutory_premium_eur_per_month) + values.statutory_deductible_eur_per_year;
  const higherPremium = 12 * values.higher_deductible_premium_eur_per_month;
  const threshold = statutoryTotal - higherPremium;
  if (Math.round(statutoryTotal) !== 1684) fail('official source values must compute statutory annual comparison total 1684');
  if (Math.round(higherPremium) !== 1035) fail('official source values must compute higher-deductible annual premium 1035');
  if (Math.round(threshold) !== values.accepted_threshold_eur_per_year || values.accepted_threshold_eur_per_year !== 649) {
    fail('official source values must compute accepted threshold 649');
  }

  const records = fixture.question_records || fixture.records || [];
  const q3 = records.find((record) => record.record_id === 'vw-1022-a-25-1-o:opgave-1:question-3');
  if (!q3) fail('fixture must contain q3 record');
  const failedIds = (q3.mapped_mtu_ids || []).includes('A15')
    ? requireQ3PreExecutionState(q3)
    : requireQ3PostExecutionState(q3);

  assertFutureStorageAbsent();
  validateOperationCandidate(packet.dry_run_operation_candidate, 'packet.dry_run_operation_candidate');
  validateAnswerSkillCandidate(packet.dry_run_answer_skill_candidate, 'packet.dry_run_answer_skill_candidate');
  validateOperationAnswerPair(
    {
      schema_version: 1,
      storage_id: 'operation-candidates',
      authority_boundary: packet.dry_run_operation_candidate.authority_boundary,
      candidates: [packet.dry_run_operation_candidate],
    },
    {
      schema_version: 1,
      storage_id: 'answer-skill-candidates',
      authority_boundary: packet.dry_run_answer_skill_candidate.authority_boundary,
      candidates: [packet.dry_run_answer_skill_candidate],
    }
  );

  const operationAssessments = packet.dry_run_operation_candidate.unit_support_assessments || [];
  if (!operationAssessments.some((item) => item.unit_id === 'A15' && item.assessment === 'rejected')) {
    fail('dry-run operation candidate must reject A15');
  }
  if (!packet.dry_run_operation_candidate.supporting_unit_ids.includes('A61')) {
    fail('dry-run operation candidate must keep A61 as support');
  }
  if (!packet.dry_run_answer_skill_candidate.operation_support_ids.includes('EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON')) {
    fail('answer skill candidate must point to the q3 annual threshold operation');
  }

  for (const option of requireArray(packet, 'repair_options_matrix', 'packet', 3)) {
    if (option.mutation_authorized_now !== false) fail(`${option.option_id} must not authorize mutation`);
    requireArray(option, 'proof_required', option.option_id, 2);
  }

  if (packet.negative_regression_requirement?.guard_id !== 'q3-a15-overtrigger-guard') {
    fail('negative regression requirement must preserve q3 A15 guard');
  }
  if (packet.negative_regression_requirement.accepted_negative_fixture_type !== 'live_h5_validator_overtrigger_assertions') {
    fail('negative regression requirement must bind to live H5 over-trigger assertions');
  }
  for (const assertionId of [
    'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-1:ASSERT-OVER-TRIGGER',
    'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-2:ASSERT-OVER-TRIGGER',
  ]) {
    if (!packet.negative_regression_requirement.live_overtrigger_assertion_ids?.includes(assertionId)) {
      fail(`negative regression requirement missing live assertion: ${assertionId}`);
    }
    if (!failedIds.has(assertionId)) fail(`live negative guard assertion is absent from validator output: ${assertionId}`);
  }
  if (packet.review_team_threshold?.minimum_verdict !== 'MORE_THAN_SATISFIED') {
    fail('review team threshold must require MORE_THAN_SATISFIED');
  }

  for (const required of [
    'MTU-H5 RP-001/RP-002',
    'A15',
    'EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON',
    'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION',
    'ready_for_three_agent_review',
    'No protected reference mutation',
  ]) {
    requireIncludes(packetMd, required, 'packet markdown');
  }

  console.log('OK MTU-H5 RP-001/RP-002 q3 repair packet: ready_for_three_agent_review');
}

main();
