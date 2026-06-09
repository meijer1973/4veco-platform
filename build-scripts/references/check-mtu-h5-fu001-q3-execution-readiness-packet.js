#!/usr/bin/env node
const fs = require('fs');
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
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-fu001-q3-execution-readiness-packet.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-fu001-q3-execution-readiness-packet.md');
const CLOSEOUT = path.join(ROOT, 'reports', 'sprints', 'MTU-H5-blocked-stop-result.md');
const Q3_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-rp001-rp002-q3-repair-packet.json');
const Q3_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-RP001-RP002-q3-repair-packet', 'gate-closure.json');
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
];

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

const GLOBAL_SOLO_NEGATIVE_ASSERTION = 'MTUH5-NEGATIVE-negative-solo-q2-function-construction-overtrigger-FAILS-AS-EXPECTED';

function fail(message) {
  console.error(`MTU-H5 FU-001 q3 execution-readiness packet check failed: ${message}`);
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

function requireNormalizedIncludes(text, needle, context) {
  const normalizedText = text.replace(/\s+/g, ' ').trim().toLowerCase();
  const normalizedNeedle = needle.replace(/\s+/g, ' ').trim().toLowerCase();
  if (!normalizedText.includes(normalizedNeedle)) fail(`${context} must include ${needle}`);
}

function requireIncludesAll(values, required, context) {
  for (const value of required) {
    if (!values.includes(value)) fail(`${context} must include ${value}`);
  }
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

function main() {
  const packet = readJson(PACKET_JSON);
  const packetMd = readText(PACKET_MD);
  const closeoutMd = readText(CLOSEOUT);
  const q3Packet = readJson(Q3_PACKET);
  const q3Gate = readJson(Q3_GATE);
  const fixture = readJson(FIXTURE);

  if (packet.schema_version !== 1) fail('packet schema_version must be 1');
  if (packet.sprint_id !== 'MTU-H5') fail('packet sprint_id must be MTU-H5');
  if (packet.packet_id !== 'MTU-H5-FU001-q3-execution-readiness-packet') fail('unexpected packet_id');
  if (packet.status !== 'q3_execution_readiness_planning_packet_ready_for_three_agent_review_no_mutation_authorized') {
    fail('unexpected packet status');
  }
  if (packet.start_commit !== 'b0daca213d69157168a24a6d25721c300f93ed40') fail('packet must start from requested commit');
  if (packet.start_branch !== 'codex/running-goals-20260608') fail('packet must cite requested branch');
  if (packet.packet_result?.completion_claimed !== false) fail('packet must not claim completion');
  if (packet.packet_result?.next_state !== 'ready_for_three_agent_review') fail('packet next_state mismatch');
  requireFalseBoundary(packet.authority_boundary, 'packet.authority_boundary');

  requireGitSuccess(
    ['merge-base', '--is-ancestor', packet.start_commit, 'HEAD'],
    'current checkout must descend from requested start commit'
  );
  requireGitSuccess(
    ['cat-file', '-e', `${packet.start_commit}:reports/sprints/MTU-H5-blocked-stop-result.md`],
    'start commit must contain MTU-H5 closeout'
  );
  requireIncludes(closeoutMd, 'q3 annual-threshold and A15 over-trigger defects are routed with proof', 'MTU-H5 closeout');
  requireNormalizedIncludes(closeoutMd, 'Do not proceed directly to mapper repair', 'MTU-H5 closeout');

  if (q3Gate.status !== 'approved_more_than_satisfied_no_mutation_authorized') fail('q3 gate must be MORE_THAN_SATISFIED approved');
  if (q3Gate.reviewed_remote_commit !== 'c444b8368304c83f5e659adc0671a564a6c80169') fail('q3 gate reviewed commit mismatch');
  if (q3Gate.authority_boundary?.candidate_writes_authorized !== false) fail('q3 gate must block candidate writes');
  if (q3Gate.authority_boundary?.operation_registry_mutation_authorized !== false) fail('q3 gate must block operation registry mutation');
  if (q3Packet.status !== 'q3_repair_packet_ready_for_three_agent_review_no_mutation_authorized') fail('q3 packet status mismatch');
  if (q3Packet.dry_run_operation_candidate?.operation_id !== 'EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON') fail('q3 source packet operation candidate mismatch');
  if (q3Packet.dry_run_answer_skill_candidate?.answer_skill_id !== 'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION') fail('q3 source packet answer skill mismatch');

  const laneSelection = packet.lane_selection || {};
  if (laneSelection.selected_lane !== 'MTU-H5-RP-001/RP-002 q3 annual insurance threshold operation plus A15 over-trigger guard') {
    fail('lane selection must choose q3 RP-001/RP-002');
  }
  if (laneSelection.selection_status !== 'selected_for_next_non_mutating_repair_planning') fail('lane selection status mismatch');
  if ((laneSelection.non_selected_lanes || []).length < 3) fail('lane selection must explain non-selected lanes');
  for (const expected of ['q19', 'q27', 'q15']) {
    if (!JSON.stringify(laneSelection.non_selected_lanes).includes(expected)) fail(`lane selection must explain ${expected}`);
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
  if (!String(officialEvidence.question_pdf).includes('page=2')) fail('question_pdf must cite q3 page 2');
  if (!String(officialEvidence.correction_pdf).includes('page=6')) fail('correction_pdf must cite q3 correction page 6');
  const values = officialEvidence.source_values || {};
  const statutoryTotal = (12 * values.statutory_premium_eur_per_month) + values.statutory_deductible_eur_per_year;
  const higherPremium = 12 * values.higher_deductible_premium_eur_per_month;
  const threshold = statutoryTotal - higherPremium;
  if (Math.round(statutoryTotal) !== values.statutory_annual_cost_eur || values.statutory_annual_cost_eur !== 1684) {
    fail('q3 source values must compute statutory annual cost 1684');
  }
  if (Math.round(higherPremium) !== values.higher_deductible_annual_premium_eur || values.higher_deductible_annual_premium_eur !== 1035) {
    fail('q3 source values must compute higher deductible annual premium 1035');
  }
  if (Math.round(threshold) !== values.accepted_threshold_eur_per_year || values.accepted_threshold_eur_per_year !== 649) {
    fail('q3 source values must compute threshold 649');
  }
  if (values.scale_factor_required !== false || values.incidence_or_pass_through_required !== false || values.price_elasticity_required !== false) {
    fail('q3 must explicitly reject scale/incidence/elasticity requirements');
  }

  const records = fixture.question_records || fixture.records || [];
  const q3 = records.find((record) => record.record_id === 'vw-1022-a-25-1-o:opgave-1:question-3');
  if (!q3) fail('fixture must contain q3 record');
  requireIncludesAll(q3.mapped_mtu_ids || [], ['A15', 'A61', 'A96'], 'q3 current mapped MTUs');
  for (const operation of requireArray(q3, 'official_correction_model_operations', 'q3', 2)) {
    if (!operation.expected_forbidden_mtu_ids?.includes('A15')) fail(`${operation.operation_id} must forbid A15`);
    if (!operation.expected_required_mtu_ids?.includes('A61')) fail(`${operation.operation_id} must require A61`);
    if (!operation.expected_answer_form_mtu_ids?.includes('A96')) fail(`${operation.operation_id} must require A96`);
    if (operation.missing_mtu_expected !== true) fail(`${operation.operation_id} must still be missing MTU expected before execution`);
    if (operation.scale_factor_expected !== false) fail(`${operation.operation_id} must not expect scale factor`);
    if (operation.incidence_or_pass_through_expected !== false) fail(`${operation.operation_id} must not expect incidence/pass-through`);
  }

  const result = runH5Validator();
  const failedIds = new Set((result.buckets.failed || []).map((item) => item.assertion_id));
  const reviewIds = (result.buckets.review_required || []).map((item) => item.assertion_id);
  const passedIds = (result.buckets.passed || []).map((item) => item.assertion_id);
  for (const assertionId of REQUIRED_Q3_FAILED_ASSERTIONS) {
    if (!failedIds.has(assertionId)) fail(`current validator result must still expose q3 failed assertion: ${assertionId}`);
  }
  for (const marker of REQUIRED_Q3_REVIEW_MARKERS) {
    if (!reviewIds.some((id) => id.includes(marker))) fail(`current validator result must still expose q3 review marker: ${marker}`);
  }
  if (!passedIds.includes(GLOBAL_SOLO_NEGATIVE_ASSERTION)) fail('global Solo negative fixture must remain live');

  const executionPlan = packet.later_execution_plan || {};
  if (executionPlan.status !== 'planned_only_requires_separate_gate') fail('execution plan status must require separate gate');
  if (executionPlan.execution_authorized_now !== false) fail('execution must not be authorized now');
  for (const forbidden of ['editing the fixture or mapper to clear q3 failures', 'creating candidate storage files', 'mutating references/machine or references/authored']) {
    if (!(executionPlan.forbidden_now || []).includes(forbidden)) fail(`execution plan must forbid ${forbidden}`);
  }
  for (const requiredPatch of [
    'Remove A15 from q3 mapped MTUs or equivalent mapper output.',
    'Keep A61 as source-table reading support.',
    'Keep A96 as bereken answer-form support.',
  ]) {
    if (!(executionPlan.allowed_future_patch_shape_if_authorized_later || []).includes(requiredPatch)) {
      fail(`execution plan must include future patch shape: ${requiredPatch}`);
    }
  }

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
  if (packet.dry_run_operation_candidate.review_state !== 'reviewed_planning_evidence_requires_later_execution_gate') {
    fail('operation candidate must require later execution gate');
  }
  if (packet.dry_run_answer_skill_candidate.review_state !== 'reviewed_planning_evidence_requires_later_execution_gate') {
    fail('answer-skill candidate must require later execution gate');
  }
  const assessments = packet.dry_run_operation_candidate.unit_support_assessments || [];
  if (!assessments.some((item) => item.unit_id === 'A15' && item.assessment === 'rejected')) {
    fail('dry-run operation candidate must reject A15');
  }
  if ((packet.dry_run_operation_candidate.supporting_unit_ids || []).includes('A15')) fail('A15 must not be supporting');

  const negative = packet.negative_regression_requirement || {};
  if (negative.guard_id !== 'fu001-q3-a15-execution-readiness-guard') fail('negative guard id mismatch');
  requireIncludesAll(negative.live_q3_failed_assertion_ids || [], REQUIRED_Q3_FAILED_ASSERTIONS, 'negative guard live q3 assertions');
  if (negative.global_negative_fixture_guard !== GLOBAL_SOLO_NEGATIVE_ASSERTION) fail('negative guard must preserve global Solo fixture');
  for (const must of ['A15 rejected for q3', 'A61 source-reading support retained', 'A96 bereken answer-form support retained']) {
    if (!(negative.must_preserve || []).includes(must)) fail(`negative guard must preserve ${must}`);
  }

  if (packet.review_team_threshold?.minimum_verdict !== 'MORE_THAN_SATISFIED') {
    fail('review team threshold must require MORE_THAN_SATISFIED');
  }

  for (const required of [
    'MTU-H5 FU-001',
    'q3',
    'A15',
    'EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON',
    'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION',
    'Do not proceed directly to mapper repair',
    'No protected reference mutation',
    'ready_for_three_agent_review',
  ]) {
    requireIncludes(packetMd, required, 'packet markdown');
  }

  console.log('OK MTU-H5 FU-001 q3 execution-readiness packet: ready_for_three_agent_review');
}

main();
