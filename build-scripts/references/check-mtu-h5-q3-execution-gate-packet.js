#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const crypto = require('crypto');

const { assertFutureStorageAbsent } = require('./lib/exam-ingestion-candidate-validation');
const {
  buildRawReferenceUrl,
  buildRawUrl,
  parseRepoFromPackageJson,
} = require('../sprints/emit-gate-bundle-urls.js');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q3-execution-gate-packet.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q3-execution-gate-packet.md');
const GATE_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-q3-execution', 'review-packet.json');
const GATE_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-q3-execution', 'review-packet.md');
const GATE_BUNDLE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-q3-execution', 'bundle-urls.md');
const URL_INDEX = path.join(ROOT, 'reports', 'url-index.md');
const AGENT_INDEX = path.join(ROOT, 'reports', 'github-agent-index-platform.md');
const FU_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-fu001-q3-execution-readiness-packet.json');
const FU_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-FU001-q3-execution-readiness-packet', 'gate-closure.json');
const RP_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-rp001-rp002-q3-repair-packet.json');
const RP_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-RP001-RP002-q3-repair-packet', 'gate-closure.json');
const EX2_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-EX2-exam-to-mtu-mapping', 'gate-closure.json');
const EX5_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-EX5-operation-answer-skill-contract', 'gate-closure.json');
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
];

const REQUIRED_Q3_FAILED_ASSERTIONS = [
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-1:ASSERT-MISSING-OPERATION-MTU',
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-1:ASSERT-OVER-TRIGGER',
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-2:ASSERT-MISSING-OPERATION-MTU',
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-2:ASSERT-OVER-TRIGGER',
];

const REQUIRED_Q3_OVERTRIGGER_ASSERTIONS = [
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-1:ASSERT-OVER-TRIGGER',
  'vw-1022-a-25-1-o:opgave-1:question-3:q3-step-2:ASSERT-OVER-TRIGGER',
];

const REQUIRED_Q3_REVIEW_MARKERS = [
  'review whether annual insurance cost threshold is a missing operation unit or strengthened existing arithmetic route',
  'review threshold-conclusion wording as answer-skill need or governed MTU procedure',
];

const SOLO_NEGATIVE_ASSERTION = 'MTUH5-NEGATIVE-negative-solo-q2-function-construction-overtrigger-FAILS-AS-EXPECTED';
const Q3_RECORD_ID = 'vw-1022-a-25-1-o:opgave-1:question-3';
const FIXTURE_PATH = 'reports/mtu-hardening/mtu-h5-regression-fixture.json';

function fail(message) {
  console.error(`MTU-H5 q3 execution-gate packet check failed: ${message}`);
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

function requireFalseBoundary(boundary, context) {
  for (const key of AUTHORITY_FALSE_KEYS) {
    if (!boundary || boundary[key] !== false) fail(`${context}.${key} must be false`);
  }
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
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
  if (run.status !== 0) {
    fail(`${message}: ${(run.stderr || run.stdout || '').trim()}`);
  }
  return run.stdout.trim();
}

function requireCleanPaths(paths) {
  const run = git(['status', '--short', '--', ...paths]);
  if (run.status !== 0) fail(`could not inspect git status: ${(run.stderr || run.stdout || '').trim()}`);
  if (run.stdout.trim()) {
    fail(`pre-execution protected/current surfaces must be clean:\n${run.stdout.trim()}`);
  }
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

function findQ3(fixture) {
  const records = fixture.question_records || fixture.records || [];
  const q3 = records.find((record) => record.record_id === Q3_RECORD_ID);
  if (!q3) fail('fixture must contain q3 record');
  return q3;
}

function requireExcludes(values, forbidden, context) {
  if (values.includes(forbidden)) fail(`${context} must not include ${forbidden}`);
}

function addA15(values) {
  return values.includes('A15') ? values : values.concat('A15');
}

function requireQ3A15NegativeGuard() {
  const fixtureClone = readJson(FIXTURE);
  const q3 = findQ3(fixtureClone);
  q3.mapped_mtu_ids = addA15(q3.mapped_mtu_ids || []);
  for (const operation of q3.official_correction_model_operations || []) {
    operation.mapped_mtu_ids = addA15(operation.mapped_mtu_ids || []);
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mtu-h5-q3-gate-negative-'));
  const tempFixture = path.join(tempDir, 'fixture-with-a15.json');
  try {
    fs.writeFileSync(tempFixture, JSON.stringify(fixtureClone, null, 2));
    const result = runH5Validator(tempFixture);
    const failedIds = new Set((result.buckets.failed || []).map((item) => item.assertion_id));
    for (const assertionId of REQUIRED_Q3_OVERTRIGGER_ASSERTIONS) {
      if (!failedIds.has(assertionId)) fail(`q3 temp negative fixture must expose over-trigger assertion: ${assertionId}`);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function requireCurrentQ3Unrepaired(q3) {
  const q3IsPostExecution = !(q3.mapped_mtu_ids || []).includes('A15');
  requireIncludesAll(q3.mapped_mtu_ids || [], ['A61', 'A96'], 'q3 current mapped MTUs');
  if (q3IsPostExecution) requireExcludes(q3.mapped_mtu_ids || [], 'A15', 'q3 current mapped MTUs');
  else requireIncludesAll(q3.mapped_mtu_ids || [], ['A15'], 'q3 current mapped MTUs');
  const operations = requireArray(q3, 'official_correction_model_operations', 'q3', 2);
  for (const operationId of ['q3-step-1', 'q3-step-2']) {
    const operation = operations.find((item) => item.operation_id === operationId);
    if (!operation) fail(`q3 must include operation ${operationId}`);
    requireIncludesAll(operation.mapped_mtu_ids || [], ['A61', 'A96'], `${operationId}.mapped_mtu_ids`);
    if (q3IsPostExecution) requireExcludes(operation.mapped_mtu_ids || [], 'A15', `${operationId}.mapped_mtu_ids`);
    else requireIncludesAll(operation.mapped_mtu_ids || [], ['A15'], `${operationId}.mapped_mtu_ids`);
    requireIncludesAll(operation.expected_required_mtu_ids || [], ['A61', 'A96'], `${operationId}.expected_required_mtu_ids`);
    requireIncludes(operation.expected_answer_form_mtu_ids || [], 'A96', `${operationId}.expected_answer_form_mtu_ids`);
    requireIncludes(operation.expected_forbidden_mtu_ids || [], 'A15', `${operationId}.expected_forbidden_mtu_ids`);
    if (operation.missing_mtu_expected !== !q3IsPostExecution) {
      fail(`${operationId}.missing_mtu_expected does not match q3 execution state`);
    }
    if (operation.scale_factor_expected !== false) fail(`${operationId}.scale_factor_expected must remain false`);
    if (operation.incidence_or_pass_through_expected !== false) {
      fail(`${operationId}.incidence_or_pass_through_expected must remain false`);
    }
    if (q3IsPostExecution) {
      if (!JSON.stringify(operation.reviewed_equivalent_operation_refs || []).includes('EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON')) {
        fail(`${operationId} must cite reviewed-equivalent annual-threshold operation evidence after execution`);
      }
      if ((operation.review_required_hooks || []).length !== 0) fail(`${operationId} must clear q3 review hooks after execution`);
      if (operationId === 'q3-step-2') {
        if (!JSON.stringify(operation.reviewed_equivalent_answer_skill_refs || []).includes('EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION')) {
          fail('q3-step-2 must cite reviewed-equivalent threshold-conclusion answer-skill evidence after execution');
        }
      }
    }
  }
  if (!q3IsPostExecution) {
    for (const marker of REQUIRED_Q3_REVIEW_MARKERS) {
      if (!operations.some((operation) => (operation.review_required_hooks || []).includes(marker))) {
        fail(`current q3 operation hooks must include: ${marker}`);
      }
    }
  }
  return q3IsPostExecution;
}

function requireExactPatchShape(packet) {
  const shape = packet.future_authorized_patch_shape || {};
  if (shape.status !== 'proposal_only_requires_later_human_execution_approval') fail('future patch shape status mismatch');
  if (shape.execution_authorized_now !== false) fail('future patch shape must not authorize execution now');
  if (shape.target_path !== FIXTURE_PATH) fail('future patch shape must target the H5 fixture only');
  if (shape.record_id !== Q3_RECORD_ID) fail('future patch shape must target q3 only');
  const changes = requireArray(shape, 'exact_field_changes', 'future_authorized_patch_shape', 10);
  const serialized = JSON.stringify(changes);
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
    'review_required_hooks',
    'scale_factor_expected and incidence_or_pass_through_expected'
  ]) {
    if (!serialized.includes(required)) fail(`future patch shape must include ${required}`);
  }
  requireIncludesAll(shape.future_proof_conditions || [], [
    'q3 record and q3 operations do not include A15 in mapped_mtu_ids.',
    'q3 record and q3 operations retain A61 and A96.',
    'q3 operations retain expected_forbidden_mtu_ids containing A15.',
    'q3 operations have missing_mtu_expected false.',
    'q3-step-1 and q3-step-2 have reviewed-equivalent annual-threshold operation refs.',
    'q3-step-2 has reviewed-equivalent threshold-conclusion answer-skill refs.',
    'Reintroducing A15 recreates q3 ASSERT-OVER-TRIGGER failures.',
    'The original Solo function-construction negative fixture remains passing.'
  ], 'future proof conditions');
  requireIncludesAll(shape.rollback_plan || [], [
    'Revert only q3 fixture fields in reports/mtu-hardening/mtu-h5-regression-fixture.json.',
    'Restore A15/A61/A96 in q3 record mapped_mtu_ids.',
    'Restore A15/A61/A96 in q3-step-1 and q3-step-2 mapped_mtu_ids.',
    'Restore missing_mtu_expected true for q3-step-1 and q3-step-2.',
    'Keep expected_forbidden_mtu_ids containing A15.'
  ], 'rollback plan');
}

function requireWriteSurfaceDecision(packet) {
  const decision = packet.write_surface_decision || {};
  if (decision.decision_status !== 'one_minimal_future_write_surface_recommended_requires_human_execution_authority') {
    fail('write surface decision status mismatch');
  }
  if (decision.recommended_minimal_write_surface !== FIXTURE_PATH) {
    fail('recommended minimal write surface must be the H5 fixture');
  }
  if (decision.write_surface_type !== 'non_protected_h5_regression_fixture') {
    fail('write surface type must be non_protected_h5_regression_fixture');
  }
  if (decision.fixture_repair?.mutation_authorized_now !== false) fail('fixture repair must not be authorized now');
  if (decision.mapper_checker_repair?.mutation_authorized_now !== false) fail('mapper/checker repair must not be authorized now');
  if (decision.mapper_checker_repair?.decision !== 'not_the_minimal_next_write_surface') fail('mapper/checker decision mismatch');
  if (decision.generated_overlay?.mutation_authorized_now !== false) fail('generated overlay mutation must not be authorized');
  if (decision.candidate_storage?.mutation_authorized_now !== false) fail('candidate storage mutation must not be authorized');
  if (decision.candidate_storage?.storage_exists_required !== false) fail('candidate storage must not be required');
  if (decision.protected_reference?.mutation_authorized_now !== false) fail('protected reference mutation must not be authorized');
  if (decision.authored_target_exercises?.mutation_authorized_now !== false) {
    fail('authored target-exercise mutation must not be authorized');
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
    FIXTURE_PATH,
    'without creating candidate storage',
    'without changing any protected machine registry',
    'remove A15',
    'retain A61 and A96',
    'EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON',
    'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION',
    'ASSERT-OVER-TRIGGER',
    'npm run check:platform',
    'Restore only q3'
  ]) {
    if (!answerText.includes(required)) fail(`gate answers must include ${required}`);
  }
}

function requireValidatorSurface(packet) {
  const result = runH5Validator();
  const failedIds = new Set((result.buckets?.failed || []).map((item) => item.assertion_id));
  const reviewIds = (result.buckets?.review_required || []).map((item) => item.assertion_id);
  const passedIds = new Set((result.buckets?.passed || []).map((item) => item.assertion_id));
  const currentQ3 = findQ3(readJson(FIXTURE));
  const q3IsPostExecution = !(currentQ3.mapped_mtu_ids || []).includes('A15');

  if (q3IsPostExecution) {
    for (const bucket of ['failed', 'review_required']) {
      const q3Items = (result.buckets[bucket] || []).filter((item) => item.record_id === Q3_RECORD_ID);
      if (q3Items.length !== 0) fail(`q3 must be absent from current validator ${bucket} bucket after execution`);
    }
    requireQ3A15NegativeGuard();
  } else {
    for (const assertionId of REQUIRED_Q3_FAILED_ASSERTIONS) {
      if (!failedIds.has(assertionId)) fail(`current validator result must still expose q3 failed assertion: ${assertionId}`);
    }
    for (const marker of REQUIRED_Q3_REVIEW_MARKERS) {
      if (!reviewIds.some((id) => id.includes(marker))) {
        fail(`current validator result must still expose q3 review marker: ${marker}`);
      }
    }
  }
  if (!passedIds.has(SOLO_NEGATIVE_ASSERTION)) fail('Solo negative fixture guard must remain passing');

  requireIncludesAll(packet.current_live_validator_surface?.q3_failed_assertion_ids || [], REQUIRED_Q3_FAILED_ASSERTIONS, 'packet live q3 assertions');
  requireIncludesAll(packet.current_live_validator_surface?.q3_review_assertion_markers || [], REQUIRED_Q3_REVIEW_MARKERS, 'packet live q3 review markers');
  if (packet.current_live_validator_surface?.global_negative_fixture_guard !== SOLO_NEGATIVE_ASSERTION) {
    fail('packet must record Solo negative fixture guard');
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

  for (const reference of [
    rel(GATE_BUNDLE),
    rel(GATE_JSON),
    rel(GATE_MD),
  ]) {
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

function main() {
  const packet = readJson(PACKET_JSON);
  const packetMd = readText(PACKET_MD);
  const gate = readJson(GATE_JSON);
  const gateMd = readText(GATE_MD);
  const fuPacket = readJson(FU_PACKET);
  const fuGate = readJson(FU_GATE);
  const rpPacket = readJson(RP_PACKET);
  const rpGate = readJson(RP_GATE);
  const ex2Gate = readJson(EX2_GATE);
  const ex5Gate = readJson(EX5_GATE);
  const fixture = readJson(FIXTURE);

  if (packet.schema_version !== 1) fail('packet schema_version must be 1');
  if (packet.sprint_id !== 'MTU-H5') fail('packet sprint_id must be MTU-H5');
  if (packet.packet_id !== 'MTU-H5-Q3-execution-gate-packet') fail('unexpected packet_id');
  if (packet.status !== 'q3_execution_gate_packet_ready_for_human_review_no_execution_authorized') fail('unexpected packet status');
  if (packet.start_commit !== 'edd95014c13d8e0a40576c2839da81a0105e6d7e') fail('packet start commit mismatch');
  if (packet.start_branch !== 'codex/mtu-h5-q3-execution-gate') fail('packet start branch mismatch');
  if (packet.packet_result?.completion_claimed !== false) fail('packet must not claim completion');
  if (packet.packet_result?.next_state !== 'ready_for_human_execution_gate_review') fail('packet next state mismatch');
  requireFalseBoundary(packet.authority_boundary, 'packet.authority_boundary');

  requireGitSuccess(['merge-base', '--is-ancestor', packet.start_commit, 'HEAD'], 'current checkout must descend from start commit');
  requireGitSuccess(
    ['cat-file', '-e', `${packet.source_main_merge_commit}:reports/mtu-hardening/mtu-h5-fu001-q3-execution-readiness-packet.json`],
    'source PR #24 merge commit must contain FU-001 packet'
  );
  requireCleanPaths([
    FIXTURE_PATH,
    'build-scripts/references/check-mtu-h5-mapping-regression.js',
    'references/machine',
    'references/authored/course-target-exercises.json',
    'references/data/exam-ingestion'
  ]);
  assertFutureStorageAbsent();

  for (const source of packet.source_evidence || []) {
    const file = source.split('#')[0];
    if (file && !fs.existsSync(path.join(ROOT, file))) fail(`source evidence path does not exist: ${file}`);
  }

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
  if (Math.round(statutoryTotal) !== values.statutory_annual_cost_eur || values.statutory_annual_cost_eur !== 1684) {
    fail('q3 source values must compute statutory annual cost 1684');
  }
  if (Math.round(higherPremium) !== values.higher_deductible_annual_premium_eur || values.higher_deductible_annual_premium_eur !== 1035) {
    fail('q3 source values must compute higher-deductible annual premium 1035');
  }
  if (Math.round(threshold) !== values.accepted_threshold_eur_per_year || values.accepted_threshold_eur_per_year !== 649) {
    fail('q3 source values must compute threshold 649');
  }
  if (values.scale_factor_required !== false || values.incidence_or_pass_through_required !== false || values.price_elasticity_required !== false) {
    fail('q3 source values must explicitly reject scale/incidence/elasticity');
  }

  if (packet.evidence_inventory?.fixture_builder_found !== false) fail('packet must record no active fixture builder found');
  if (packet.evidence_inventory?.canonical_source_of_current_h5_input !== FIXTURE_PATH) fail('packet canonical input mismatch');
  const q3 = findQ3(fixture);
  requireCurrentQ3Unrepaired(q3);
  const recordedQ3 = packet.evidence_inventory?.current_q3_fixture_state || {};
  requireIncludesAll(recordedQ3.record_mapped_mtu_ids || [], ['A15', 'A61', 'A96'], 'recorded current q3 mapped MTUs');

  if (fuPacket.packet_id !== 'MTU-H5-FU001-q3-execution-readiness-packet') fail('FU packet mismatch');
  if (fuGate.status !== 'approved_more_than_satisfied_no_mutation_authorized') fail('FU gate must be approved');
  if (rpPacket.packet_id !== 'MTU-H5-RP001-RP002-q3-governed-repair-packet') fail('RP packet mismatch');
  if (rpGate.status !== 'approved_more_than_satisfied_no_mutation_authorized') fail('RP gate must be approved');
  if (ex2Gate.status !== 'pass_with_conditions') fail('EX2 gate status mismatch');
  if (ex5Gate.status !== 'pass_with_conditions') fail('EX5 gate status mismatch');
  if (!JSON.stringify(ex2Gate.reviewed_classifications || []).includes('"q3-calc-1"')) fail('EX2 must include q3-calc-1');
  if (!JSON.stringify(ex5Gate.reviewed_routing_facts || []).includes('"q3-answer-1"')) fail('EX5 must include q3-answer-1');

  requireWriteSurfaceDecision(packet);
  requireExactPatchShape(packet);
  requireGateQuestions(packet);
  requireValidatorSurface(packet);

  const negative = packet.negative_regression_requirement || {};
  if (negative.guard_id !== 'q3-a15-overtrigger-regression-guard') fail('negative guard id mismatch');
  if (negative.accepted_negative_fixture_type !== 'live_h5_validator_q3_forbidden_mtu_assertions') fail('negative guard type mismatch');
  requireIncludesAll(negative.live_overtrigger_assertion_ids || [], REQUIRED_Q3_OVERTRIGGER_ASSERTIONS, 'negative guard q3 overtrigger assertions');
  if (negative.global_negative_fixture_guard !== SOLO_NEGATIVE_ASSERTION) fail('negative guard must preserve Solo guard');
  for (const required of [
    'expected_forbidden_mtu_ids includes A15',
    'A15 is rejected as q3 support',
    'A61 source-reading support retained',
    'A96 bereken answer-form support retained',
    'q3 annual-threshold operation visibility retained',
    'q3-step-2 threshold-conclusion answer-skill visibility retained',
    'original Solo function-construction negative guard remains live'
  ]) {
    requireIncludes(negative.must_preserve || [], required, 'negative guard must_preserve');
  }

  if (packet.review_team_threshold?.minimum_verdict !== 'MORE_THAN_SATISFIED') fail('review threshold mismatch');
  requireIncludesAll(packet.review_team_threshold?.required_agents || [], ['teacher', 'economist', 'quality_inspection'], 'review team agents');

  if (gate.schema_version !== 1) fail('gate schema_version must be 1');
  if (gate.gate_id !== 'GATE-MTU-H5-q3-execution') fail('gate id mismatch');
  if (gate.status !== 'pending_human_review') fail('gate must be pending human review');
  if (gate.source_execution_gate_packet_json !== rel(PACKET_JSON)) fail('gate packet JSON link mismatch');
  if (gate.checker !== rel(__filename)) fail('gate checker link mismatch');
  if (gate.requested_decision?.execution_authorized_by_this_packet !== false) fail('gate must not authorize execution');
  requireFalseBoundary(gate.authority_boundary, 'gate.authority_boundary');
  requireIncludesAll(gate.must_review || [], [
    rel(PACKET_MD),
    rel(PACKET_JSON),
    rel(__filename),
    rel(FU_PACKET),
    rel(FU_GATE),
    rel(RP_PACKET),
    rel(RP_GATE),
    `${rel(EX2_GATE)}#q3`,
    `${rel(EX5_GATE)}#q3`,
    rel(FIXTURE),
    rel(H5_VALIDATOR)
  ], 'gate must_review');
  requireRemoteDiscoverability(packet, gate);

  for (const command of [
    'node build-scripts/references/check-mtu-h5-q3-execution-gate-packet.js',
    'node build-scripts/references/check-mtu-h5-fu001-q3-execution-readiness-packet.js',
    'node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --expect-fail --json',
    'node build-scripts/reports/validate-report-json.js',
    'node build-scripts/sprints/emit-url-index.js --check',
    'npm run agent:index',
    'npm run check:platform'
  ]) {
    requireIncludes(packet.validation_commands || [], command, 'packet validation commands');
    requireIncludes(gate.validation_commands || [], command, 'gate validation commands');
  }

  for (const note of [
    'npm run agent:index is a generator',
    'q3 execution-gate packet, checker, and gate paths'
  ]) {
    if (!JSON.stringify(packet.validation_notes || []).includes(note)) fail(`packet validation notes must include ${note}`);
    if (!JSON.stringify(gate.validation_notes || []).includes(note)) fail(`gate validation notes must include ${note}`);
  }

  for (const [text, context] of [
    [packetMd, 'packet markdown'],
    [gateMd, 'gate markdown'],
  ]) {
    for (const required of [
      'MTU-H5',
      'q3',
      'A15',
      'A61',
      'A96',
      'EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON',
      'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION',
      FIXTURE_PATH,
      'No mapper repair',
      'No q3 fixture mutation',
      'student/product use'
    ]) {
      requireTextIncludes(text, required, context);
    }
  }

  console.log('OK MTU-H5 q3 execution-gate packet: ready_for_human_execution_gate_review');
}

main();
