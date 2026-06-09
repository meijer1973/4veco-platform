#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const crypto = require('crypto');

const {
  assertFutureStorageAbsent,
  validateAnswerSkillCandidate,
} = require('./lib/exam-ingestion-candidate-validation');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-rp006-q15-planning-packet.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-rp006-q15-planning-packet.md');
const SOURCE_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-next-repair-packet', 'gate-closure.json');
const PREVIOUS_LANE_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-RP005-q27-planning-packet', 'gate-closure.json');
const NEXT_REPAIR_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-next-repair-packet.json');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');
const EXAM_ITEM_OVERLAYS = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'exam-item-overlays.json');
const ANSWER_MODEL_OVERLAYS = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'exam-answer-model-overlays.json');
const SOURCE_ANNEX_OVERLAYS = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'exam-source-annex-overlays.json');
const OPERATION_ANSWER_CONTRACT = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'operation-answer-skill-contract.json');
const EX2_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-EX2-exam-to-mtu-mapping', 'gate-closure.json');
const EX5_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-EX5-operation-answer-skill-contract', 'gate-closure.json');
const MTUS = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');

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

const REQUIRED_Q15_REVIEW_ASSERTIONS = [
  'vw-1022-a-25-1-o:opgave-3:question-15:q15-step-1:ASSERT-PROCEDURE-REVIEW-A97',
  'vw-1022-a-25-1-o:opgave-3:question-15:q15-step-1:ASSERT-REVIEW-review whether D27/F03 content coverage plus A97 answer form is enough or whether q15-answer-1 remains a separate answer-skill need',
  'vw-1022-a-25-1-o:opgave-3:question-15:q15-step-2:ASSERT-PROCEDURE-REVIEW-A97',
  'vw-1022-a-25-1-o:opgave-3:question-15:q15-step-2:ASSERT-REVIEW-review q15 two-step correction-model explanation as answer-skill need',
];

const GLOBAL_SOLO_NEGATIVE_ASSERTION = 'MTUH5-NEGATIVE-negative-solo-q2-function-construction-overtrigger-FAILS-AS-EXPECTED';

function fail(message) {
  console.error(`MTU-H5 RP-006 q15 planning packet check failed: ${message}`);
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

function unitById(units, id) {
  const list = units.units || units;
  return list.find((unit) => unit.id === id);
}

function findQ15Overlay(doc) {
  const records = doc.items || doc.records || [];
  return records.find((record) => record.exam_item_id === 'vw-1022-a-25-1-o:opgave-3:question-15');
}

function main() {
  const packet = readJson(PACKET_JSON);
  const packetMd = readText(PACKET_MD);
  const sourceGate = readJson(SOURCE_GATE);
  const previousLaneGate = readJson(PREVIOUS_LANE_GATE);
  const nextRepairPacket = readJson(NEXT_REPAIR_PACKET);
  const fixture = readJson(FIXTURE);
  const examItemOverlays = readJson(EXAM_ITEM_OVERLAYS);
  const answerModelOverlays = readJson(ANSWER_MODEL_OVERLAYS);
  const sourceAnnexOverlays = readJson(SOURCE_ANNEX_OVERLAYS);
  const operationAnswerContract = readJson(OPERATION_ANSWER_CONTRACT);
  const ex2Gate = readJson(EX2_GATE);
  const ex5Gate = readJson(EX5_GATE);
  const units = readJson(MTUS);

  if (packet.schema_version !== 1) fail('packet schema_version must be 1');
  if (packet.sprint_id !== 'MTU-H5') fail('packet sprint_id must be MTU-H5');
  if (packet.status !== 'q15_planning_packet_ready_for_three_agent_review_no_mutation_authorized') {
    fail('unexpected packet status');
  }
  requireIncludesAll(packet.repair_ids || [], ['MTU-H5-RP-006'], 'packet.repair_ids');
  if (packet.packet_result?.completion_claimed !== false) fail('packet must not claim lane completion');
  if (packet.packet_result?.next_state !== 'ready_for_three_agent_review') fail('packet next_state mismatch');
  requireFalseBoundary(packet.authority_boundary, 'packet.authority_boundary');

  if (sourceGate.status !== 'approved_triage_review_packet') fail('source gate must be approved');
  if (previousLaneGate.status !== 'approved_more_than_satisfied_no_mutation_authorized') {
    fail('previous q27 lane gate must be MORE_THAN_SATISFIED approved');
  }
  if (sourceGate.reviewed_remote_commit !== packet.source_next_repair_packet_commit) {
    fail('packet source_next_repair_packet_commit must match source gate reviewed_remote_commit');
  }
  if (previousLaneGate.reviewed_remote_commit !== packet.previous_lane_reviewed_commit) {
    fail('packet previous_lane_reviewed_commit must match q27 closure reviewed commit');
  }
  requireGitSuccess(
    ['cat-file', '-e', `${packet.source_next_repair_packet_commit}:reports/mtu-hardening/mtu-h5-next-repair-packet.json`],
    'source next repair packet commit must contain the next repair packet'
  );
  requireGitSuccess(
    ['cat-file', '-e', `${packet.next_repair_gate_commit}:reports/review-gates/GATE-MTU-H5-next-repair-packet/gate-closure.json`],
    'next repair gate commit must contain source gate closure'
  );
  requireGitSuccess(
    ['cat-file', '-e', `${packet.previous_lane_remote_commit}:reports/review-gates/GATE-MTU-H5-RP005-q27-planning-packet/gate-closure.json`],
    'previous lane remote commit must contain q27 gate closure'
  );
  requireGitSuccess(
    ['merge-base', '--is-ancestor', packet.source_next_repair_packet_commit, packet.next_repair_gate_commit],
    'source packet commit must be an ancestor of next repair gate commit'
  );
  requireGitSuccess(
    ['merge-base', '--is-ancestor', packet.next_repair_gate_commit, packet.previous_lane_remote_commit],
    'next repair gate commit must be an ancestor of q27 lane closure commit'
  );
  requireGitSuccess(
    ['merge-base', '--is-ancestor', packet.previous_lane_remote_commit, 'HEAD'],
    'current checkout must descend from q27 lane closure commit'
  );

  const q15Lane = (nextRepairPacket.repair_lanes || []).find((lane) => lane.repair_id === 'MTU-H5-RP-006');
  if (!q15Lane) fail('source next repair packet must contain q15 RP-006 lane');
  requireIncludesAll(q15Lane.validator_assertion_ids || [], REQUIRED_Q15_REVIEW_ASSERTIONS, 'RP-006 validator assertions');

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
  if (!String(officialEvidence.question_pdf).includes('page=7')) fail('question_pdf must cite q15 page 7');
  if (!String(officialEvidence.correction_pdf).includes('page=11')) fail('correction_pdf must cite q15 correction page 11');
  const values = officialEvidence.source_values || {};
  if (values.total_points !== 2 || values.point_rule_count !== 2) fail('q15 must preserve two points and two point rules');
  for (const key of [
    'context_equal_production_costs',
    'entrant_lower_price',
    'perfect_substitutes',
    'dominant_strategy_price_lowering_required',
    'lower_revenue_or_profit_required',
    'prisoner_dilemma_label_required',
  ]) {
    if (values[key] !== true) fail(`q15 source value ${key} must be true`);
  }
  for (const key of ['calculation_required', 'graph_required', 'scale_factor_required', 'incidence_or_pass_through_required']) {
    if (values[key] !== false) fail(`q15 source value ${key} must be false`);
  }

  const a97 = unitById(units, 'A97');
  const d27 = unitById(units, 'D27');
  const f03 = unitById(units, 'F03');
  const f09 = unitById(units, 'F09');
  for (const [id, unit] of Object.entries({ A97: a97, D27: d27, F03: f03, F09: f09 })) {
    if (!unit) fail(`expected live unit missing: ${id}`);
  }
  if (!/Leg-uit-dat|leg-uit-dat/i.test(a97.name)) fail('A97 must be leg-uit-dat answer form');
  if (!Array.isArray(a97.procedure) || a97.procedure.length < 5) fail('A97 must retain canonical procedure');
  if (d27.mastery_target !== 'understand') fail('D27 must remain content-level understand support');
  if (f03.mastery_target !== 'understand') fail('F03 must remain content-level understand support');
  if (f09.mastery_target !== 'understand') fail('F09 must remain content-level understand support');
  if (!(f09.needs || []).includes('F03')) fail('F09 must retain F03 prior need');

  const q15Overlay = findQ15Overlay(examItemOverlays);
  if (!q15Overlay) fail('exam-item overlays must contain q15');
  if (q15Overlay.ingestion_status !== 'extracted_pending_review') fail('q15 overlay must remain extracted_pending_review');
  if (q15Overlay.prompt_metadata?.instruction_word !== 'leg uit') fail('q15 instruction word must be leg uit');
  if (q15Overlay.prompt_metadata?.question_type !== 'uitleg_dat') fail('q15 question_type must be uitleg_dat');
  if (q15Overlay.question_classification?.calculation_required !== false) fail('q15 must not require calculation');
  if (q15Overlay.question_classification?.graph_required !== false) fail('q15 must not require graph work');
  if (q15Overlay.question_classification?.source_reading_required !== true) fail('q15 must require source reading');
  if (q15Overlay.question_classification?.reasoning_required !== true) fail('q15 must require reasoning');
  if (q15Overlay.question_classification?.answer_writing_required !== true) fail('q15 must require answer writing');
  if ((q15Overlay.source_material?.gaps || []).length !== 0) fail('q15 overlay must not carry source/graph blocking gaps');
  const answerSteps = q15Overlay.official_answer_model?.answer_steps || [];
  requireIncludesAll(answerSteps.map((step) => step.step_id), ['q15-step-1', 'q15-step-2'], 'q15 answer steps');
  requireIncludesAll(q15Overlay.official_answer_model?.mandatory_terms || [], ['perfecte substituten', 'dominante strategie', 'gevangenendilemma', 'omzet of winst'], 'q15 mandatory terms');
  const q15AnswerNeed = (q15Overlay.skill_decomposition?.answer_writing_operations || []).find((item) => item.item_id === 'q15-answer-1');
  if (!q15AnswerNeed || q15AnswerNeed.status !== 'answer_skill_need') fail('q15-answer-1 must remain answer_skill_need in overlay');
  requireIncludesAll(q15AnswerNeed.candidate_unit_ids || [], ['F03', 'F09'], 'q15 answer need candidate units');
  const q15Gap = (q15Overlay.mtu_gap_classification || []).find((item) => item.requirement_id === 'q15-answer-1');
  if (!q15Gap || q15Gap.classification !== 'answer_skill_need') fail('q15 gap classification must remain answer_skill_need');
  if (q15Overlay.lesson_build_handoff?.handoff_status !== 'ready_with_gaps') fail('q15 lesson handoff must remain ready_with_gaps');
  if (q15Overlay.product_boundary?.student_facing_output_authorized !== false) fail('q15 product boundary must remain false');

  const q15AnswerOverlay = findQ15Overlay(answerModelOverlays);
  if (!q15AnswerOverlay) fail('answer-model overlay must contain q15');
  requireIncludesAll(q15AnswerOverlay.official_answer_model?.answer_step_ids || [], ['q15-step-1', 'q15-step-2'], 'answer overlay q15 answer steps');
  requireIncludesAll(q15AnswerOverlay.official_answer_model?.point_rule_ids || [], ['q15-pr-1', 'q15-pr-2'], 'answer overlay q15 point rules');

  const q15SourceOverlay = findQ15Overlay(sourceAnnexOverlays);
  if (!q15SourceOverlay) fail('source-annex overlay must contain q15');
  if (q15SourceOverlay.source_material_status !== 'extracted_pending_review') fail('q15 source material must remain extracted_pending_review');
  if ((q15SourceOverlay.blocking_gaps || []).length !== 0) fail('q15 source-annex overlay must not carry blocking gaps');

  const contractFacts = operationAnswerContract.candidate_routing_facts || [];
  const contractQ15 = contractFacts.find((item) => item.requirement_id === 'q15-answer-1');
  if (!contractQ15) fail('operation-answer-skill contract must contain q15-answer-1');
  if (contractQ15.classification !== 'answer_skill_design_candidate') fail('contract q15-answer-1 must be answer_skill_design_candidate');
  if (contractQ15.candidate_record_id !== 'EX_ANS_TWO_STEP_CORRECTION_MODEL_EXPLANATION') {
    fail('contract q15-answer-1 must preserve EX_ANS_TWO_STEP_CORRECTION_MODEL_EXPLANATION');
  }
  requireIncludesAll(contractQ15.supporting_unit_ids || [], ['D27', 'F03', 'F09'], 'contract q15 supporting units');
  if (contractQ15.mutation_authorized !== false || contractQ15.student_product_use_authorized !== false) {
    fail('contract q15 must not authorize mutation or student/product use');
  }

  const ex2Text = JSON.stringify(ex2Gate.reviewed_classifications || ex2Gate.explicit_decisions || []);
  for (const marker of ['q15-content', 'q15-answer-1', 'D27', 'F03', 'F09', 'answer_skill_need']) {
    if (!ex2Text.includes(marker)) fail(`EX2 gate must preserve q15 marker ${marker}`);
  }
  const ex5Text = JSON.stringify(ex5Gate.reviewed_routing_facts || []);
  for (const marker of ['q15-answer-1', 'answer_skill_candidate', 'D27', 'F03', 'F09', 'content_only_support']) {
    if (!ex5Text.includes(marker)) fail(`EX5 gate must preserve q15 marker ${marker}`);
  }

  const records = fixture.question_records || fixture.records || [];
  const q15 = records.find((record) => record.record_id === 'vw-1022-a-25-1-o:opgave-3:question-15');
  if (!q15) fail('fixture must contain q15 record');
  if (q15.question_word !== 'leg_uit_dat') fail('q15 fixture question_word must be leg_uit_dat');
  requireIncludesAll(q15.mapped_mtu_ids || [], ['D27', 'F03', 'F09', 'A97'], 'q15 mapped MTUs');
  for (const forbidden of ['A15', 'A42', 'A45', 'D07', 'A88']) {
    if ((q15.mapped_mtu_ids || []).includes(forbidden)) fail(`q15 fixture must not map ${forbidden}`);
  }
  if ((q15.mapped_route_tags || []).some((tag) => ['calculus_route', 'function_construction', 'graph_shift', 'incidence', 'scaling'].includes(tag))) {
    fail('q15 fixture must not carry forbidden route tags');
  }
  for (const operation of requireArray(q15, 'official_correction_model_operations', 'q15', 2)) {
    if (!operation.expected_answer_form_mtu_ids?.includes('A97')) fail(`${operation.operation_id} must keep A97 answer form`);
    if (operation.scale_factor_expected !== false) fail(`${operation.operation_id} must not expect scale factor`);
    if (operation.incidence_or_pass_through_expected !== false) fail(`${operation.operation_id} must not expect incidence/pass-through`);
    if (operation.predictable_misconception_expected !== true) fail(`${operation.operation_id} must expect misconception evidence`);
    requireArray(operation, 'expected_misconception_refs', operation.operation_id, 1);
    requireIncludesAll(operation.procedure_review_required_unit_ids || [], ['A97'], `${operation.operation_id}.procedure_review_required_unit_ids`);
    for (const forbiddenTag of ['calculus_route', 'function_construction', 'graph_shift', 'incidence', 'scaling']) {
      if ((operation.expected_route_tags || []).includes(forbiddenTag)) {
        fail(`${operation.operation_id} expected_route_tags must not include ${forbiddenTag}`);
      }
    }
  }

  const result = runH5Validator();
  const failedQ15 = (result.buckets.failed || []).filter((item) => String(item.record_id || '').includes('question-15'));
  if (failedQ15.length !== 0) fail('q15 must not be in failed bucket; this lane is review_required only');
  const reviewIds = (result.buckets.review_required || []).map((item) => item.assertion_id);
  for (const assertionId of REQUIRED_Q15_REVIEW_ASSERTIONS) {
    if (!reviewIds.includes(assertionId)) fail(`current validator result must still expose q15 review assertion: ${assertionId}`);
  }
  const passedIds = (result.buckets.passed || []).map((item) => item.assertion_id);
  if (!passedIds.includes(GLOBAL_SOLO_NEGATIVE_ASSERTION)) {
    fail('global original Solo negative fixture must remain pass-as-fail guard');
  }

  assertFutureStorageAbsent();
  validateAnswerSkillCandidate(packet.dry_run_answer_skill_candidate, 'packet.dry_run_answer_skill_candidate');
  if (packet.dry_run_answer_skill_candidate.answer_skill_id !== 'EX_ANS_TWO_STEP_DOMINANT_STRATEGY_PD_EXPLANATION') {
    fail('unexpected q15 dry-run answer-skill candidate');
  }
  if (packet.dry_run_answer_skill_candidate.answer_skill_status !== 'design_candidate') {
    fail('q15 answer-skill candidate must be design_candidate');
  }
  if (packet.dry_run_answer_skill_candidate.review_state !== 'ready_for_three_agent_review_not_reviewed_equivalent') {
    fail('q15 answer-skill candidate must not claim reviewed-equivalent status');
  }
  requireIncludesAll(
    packet.dry_run_answer_skill_candidate.content_support_unit_ids || [],
    ['D27', 'F03', 'F09'],
    'q15 dry-run content support units'
  );
  requireIncludesAll(
    packet.dry_run_answer_skill_candidate.answer_form_support_unit_ids || [],
    ['A97'],
    'q15 dry-run answer-form support units'
  );
  if ((packet.dry_run_answer_skill_candidate.blocking_gap_ids || []).length !== 0) {
    fail('q15 dry-run candidate should not invent source/graph blocking gaps');
  }

  const answerEvidence = packet.answer_form_and_misconception_evidence || {};
  if (answerEvidence.question_word !== 'leg_uit_dat') fail('answer-form evidence must preserve leg_uit_dat');
  if (answerEvidence.expected_answer_form?.status !== 'present_but_semantic_fit_review_required') {
    fail('answer-form status must require semantic-fit review');
  }
  if (answerEvidence.expected_answer_form?.unit_id !== 'A97') fail('answer-form evidence must cite A97');
  if (answerEvidence.scale_factor_evidence?.status !== 'not_applicable') fail('scale-factor evidence must be not_applicable');
  if (answerEvidence.incidence_pass_through_evidence?.status !== 'not_applicable') fail('incidence evidence must be not_applicable');
  if (answerEvidence.procedure_expectation?.status !== 'procedure_review_required') fail('procedure expectation must require review');

  if (packet.negative_regression_requirement?.guard_id !== 'q15-a97-answer-skill-overclaim-guard') {
    fail('negative regression requirement must preserve q15 A97 overclaim guard');
  }
  requireIncludesAll(
    packet.negative_regression_requirement.live_review_assertion_ids || [],
    REQUIRED_Q15_REVIEW_ASSERTIONS,
    'negative regression q15 live review assertions'
  );
  if (packet.negative_regression_requirement.global_negative_fixture_guard !== GLOBAL_SOLO_NEGATIVE_ASSERTION) {
    fail('negative regression requirement must preserve global original Solo negative fixture guard');
  }
  for (const assertionId of REQUIRED_Q15_REVIEW_ASSERTIONS) {
    if (!reviewIds.includes(assertionId)) fail(`live negative q15 assertion is absent from validator output: ${assertionId}`);
  }

  for (const option of requireArray(packet, 'repair_options_matrix', 'packet', 3)) {
    if (option.mutation_authorized_now !== false) fail(`${option.option_id} must not authorize mutation`);
    requireArray(option, 'proof_required', option.option_id, 2);
  }
  if (packet.review_team_threshold?.minimum_verdict !== 'MORE_THAN_SATISFIED') {
    fail('review team threshold must require MORE_THAN_SATISFIED');
  }

  for (const required of [
    'MTU-H5 RP-006',
    'q15-answer-1',
    'A97',
    'D27',
    'F03',
    'F09',
    'EX_ANS_TWO_STEP_DOMINANT_STRATEGY_PD_EXPLANATION',
    'MTUH5-NEGATIVE-negative-solo-q2-function-construction-overtrigger-FAILS-AS-EXPECTED',
    'ready_for_three_agent_review',
    'No protected reference mutation',
  ]) {
    requireIncludes(packetMd, required, 'packet markdown');
  }

  console.log('OK MTU-H5 RP-006 q15 planning packet: ready_for_three_agent_review');
}

main();
