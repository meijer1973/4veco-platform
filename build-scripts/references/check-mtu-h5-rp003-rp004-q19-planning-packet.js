#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const crypto = require('crypto');

const {
  assertFutureStorageAbsent,
  validateAnswerSkillCandidate,
  validateOperationCandidate,
  validateSourceExtractionDocument,
} = require('./lib/exam-ingestion-candidate-validation');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-rp003-rp004-q19-planning-packet.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-rp003-rp004-q19-planning-packet.md');
const SOURCE_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-next-repair-packet', 'gate-closure.json');
const PREVIOUS_LANE_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-RP001-RP002-q3-repair-packet', 'gate-closure.json');
const NEXT_REPAIR_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-next-repair-packet.json');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');
const EXAM_ITEM_OVERLAYS = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'exam-item-overlays.json');
const ANSWER_MODEL_OVERLAYS = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'exam-answer-model-overlays.json');
const SOURCE_ANNEX_OVERLAYS = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'exam-source-annex-overlays.json');
const OPERATION_ANSWER_CONTRACT = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'operation-answer-skill-contract.json');
const EX2_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-EX2-exam-to-mtu-mapping', 'gate-closure.json');
const EX5_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-EX5-operation-answer-skill-contract', 'gate-closure.json');

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
];

function fail(message) {
  console.error(`MTU-H5 RP-003/RP-004 q19 planning packet check failed: ${message}`);
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

function findQ19Overlay(doc) {
  const records = doc.items || doc.records || [];
  return records.find((record) => record.exam_item_id === 'vw-1022-a-25-1-o:opgave-4:question-19');
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

  if (packet.schema_version !== 1) fail('packet schema_version must be 1');
  if (packet.sprint_id !== 'MTU-H5') fail('packet sprint_id must be MTU-H5');
  if (packet.status !== 'q19_planning_packet_ready_for_three_agent_review_no_mutation_authorized') {
    fail('unexpected packet status');
  }
  requireIncludesAll(packet.repair_ids || [], ['MTU-H5-RP-003', 'MTU-H5-RP-004'], 'packet.repair_ids');
  if (packet.packet_result?.completion_claimed !== false) fail('packet must not claim lane completion');
  if (packet.packet_result?.next_state !== 'ready_for_three_agent_review') fail('packet next_state mismatch');
  requireFalseBoundary(packet.authority_boundary, 'packet.authority_boundary');

  if (sourceGate.status !== 'approved_triage_review_packet') fail('source gate must be approved');
  if (previousLaneGate.status !== 'approved_more_than_satisfied_no_mutation_authorized') {
    fail('previous q3 lane gate must be MORE_THAN_SATISFIED approved');
  }
  if (sourceGate.reviewed_remote_commit !== packet.source_next_repair_packet_commit) {
    fail('packet source_next_repair_packet_commit must match source gate reviewed_remote_commit');
  }
  if (previousLaneGate.reviewed_remote_commit !== packet.previous_lane_reviewed_commit) {
    fail('packet previous_lane_reviewed_commit must match q3 closure reviewed commit');
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
    ['cat-file', '-e', `${packet.previous_lane_remote_commit}:reports/review-gates/GATE-MTU-H5-RP001-RP002-q3-repair-packet/gate-closure.json`],
    'previous lane remote commit must contain q3 gate closure'
  );
  requireGitSuccess(
    ['merge-base', '--is-ancestor', packet.source_next_repair_packet_commit, packet.next_repair_gate_commit],
    'source packet commit must be an ancestor of next repair gate commit'
  );
  requireGitSuccess(
    ['merge-base', '--is-ancestor', packet.next_repair_gate_commit, packet.previous_lane_remote_commit],
    'next repair gate commit must be an ancestor of previous lane remote commit'
  );

  const q19Lane = (nextRepairPacket.repair_lanes || []).find((lane) => lane.repair_id === 'MTU-H5-RP-003');
  const q19ProcedureLane = (nextRepairPacket.repair_lanes || []).find((lane) => lane.repair_id === 'MTU-H5-RP-004');
  if (!q19Lane || !q19ProcedureLane) fail('source next repair packet must contain q19 RP-003 and RP-004 lanes');
  requireIncludesAll(q19Lane.validator_assertion_ids || [], REQUIRED_Q19_FAILED_ASSERTIONS, 'RP-003 validator assertions');
  for (const marker of REQUIRED_Q19_REVIEW_MARKERS) {
    const found = (q19Lane.validator_assertion_ids || []).concat(q19ProcedureLane.validator_assertion_ids || []).some((id) => id.includes(marker));
    if (!found) fail(`source next repair packet missing q19 review marker: ${marker}`);
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
  if (!String(officialEvidence.question_pdf).includes('page=8')) fail('question_pdf must cite q19 page 8');
  if (!String(officialEvidence.source_figure_pdf).includes('page=9')) fail('source_figure_pdf must cite source figure page 9');
  if (!String(officialEvidence.correction_pdf).includes('page=13-14')) fail('correction_pdf must cite q19 correction pages 13-14');
  const values = officialEvidence.source_values || {};
  if (values.total_points !== 2 || values.required_elements !== 3) fail('q19 official source values must preserve 2 points and 3 elements');
  if (values.partial_credit_two_elements !== 1 || values.partial_credit_one_or_zero_elements !== 0) {
    fail('q19 partial-credit values must be 1 and 0');
  }

  const q19Overlay = findQ19Overlay(examItemOverlays);
  if (!q19Overlay) fail('exam-item overlays must contain q19');
  if (q19Overlay.ingestion_status !== 'reviewed_with_gaps') fail('q19 overlay must remain reviewed_with_gaps');
  if (q19Overlay.prompt_metadata?.instruction_word !== 'teken') fail('q19 instruction word must be teken');
  if (q19Overlay.question_classification?.graph_required !== true) fail('q19 must require graph work');
  if (q19Overlay.question_classification?.source_reading_required !== true) fail('q19 must require source reading');
  const overlayGaps = (q19Overlay.source_material?.gaps || []).map((gap) => gap.gap_id);
  requireIncludesAll(overlayGaps, ['q19-source-annex-gap', 'q19-graph-object-gap'], 'q19 overlay gaps');
  const answerSteps = q19Overlay.official_answer_model?.answer_steps || [];
  requireIncludesAll(answerSteps.map((step) => step.step_id), ['q19-step-1', 'q19-step-2', 'q19-step-3'], 'q19 answer steps');
  requireIncludesAll(q19Overlay.official_answer_model?.mandatory_terms || [], ['vraaglijn naar rechts', 'loonniveau stijgt', 'inflatie stijgt'], 'q19 mandatory terms');
  const graphRequirements = q19Overlay.official_answer_model?.graph_requirements || [];
  if (graphRequirements.length !== 3) fail('q19 must have three graph requirements');
  const q19SkillGraph = (q19Overlay.skill_decomposition?.graph_operations || []).find((item) => item.item_id === 'q19-graph-op-1');
  if (!q19SkillGraph) fail('q19 graph operation missing from overlay');
  requireIncludesAll(q19SkillGraph.candidate_unit_ids || [], ['A45', 'D10'], 'q19 overlay graph candidate units');
  const q19SkillReason = (q19Overlay.skill_decomposition?.reasoning_operations || []).find((item) => item.item_id === 'q19-reason-1');
  if (!q19SkillReason) fail('q19 reasoning operation missing from overlay');
  requireIncludesAll(q19SkillReason.candidate_unit_ids || [], ['D10', 'D13'], 'q19 overlay reason candidate units');

  const q19AnswerOverlay = findQ19Overlay(answerModelOverlays);
  if (!q19AnswerOverlay) fail('answer-model overlay must contain q19');
  requireIncludesAll(q19AnswerOverlay.official_answer_model?.answer_step_ids || [], ['q19-step-1', 'q19-step-2', 'q19-step-3'], 'answer overlay q19 answer steps');
  requireIncludesAll(q19AnswerOverlay.official_answer_model?.point_rule_ids || [], ['q19-pr-1', 'q19-pr-2', 'q19-pr-3'], 'answer overlay q19 point rules');

  const q19SourceOverlay = findQ19Overlay(sourceAnnexOverlays);
  if (!q19SourceOverlay) fail('source-annex overlay must contain q19');
  if (q19SourceOverlay.source_material_status !== 'partially_extracted') fail('q19 source material must remain partially_extracted');
  requireIncludesAll(q19SourceOverlay.blocking_gaps || [], ['q19-source-annex-gap', 'q19-graph-object-gap'], 'source-annex overlay q19 gaps');

  const q19Contract = operationAnswerContract.q19_extraction_contract || {};
  if (q19Contract.execution_authorized_now !== false) fail('q19 extraction execution must remain unauthorized');
  requireIncludesAll(q19Contract.blocking_gap_ids || [], ['q19-source-annex-gap', 'q19-graph-object-gap'], 'q19 extraction contract gaps');
  for (const use of ['accepted_mtu_mapping', 'graph_pv_route_execution', 'lesson_build_handoff', 'student_facing_output']) {
    if (!(q19Contract.blocked_downstream_uses || []).includes(use)) fail(`q19 contract must block ${use}`);
  }

  const ex2Q19 = ex2Gate.reviewed_routing_facts || ex2Gate.explicit_decisions || [];
  const ex2Text = JSON.stringify(ex2Q19);
  for (const marker of ['q19-source-annex-gap', 'q19-graph-object-gap', 'A42', 'D10', 'A45']) {
    if (!ex2Text.includes(marker)) fail(`EX2 gate must preserve q19 marker ${marker}`);
  }
  const ex5Facts = JSON.stringify(ex5Gate.reviewed_routing_facts || []);
  for (const marker of ['q19-source-annex-gap', 'q19-graph-object-gap', 'A42', 'D10', 'A45']) {
    if (!ex5Facts.includes(marker)) fail(`EX5 gate must preserve q19 marker ${marker}`);
  }

  const records = fixture.question_records || fixture.records || [];
  const q19 = records.find((record) => record.record_id === 'vw-1022-a-25-1-o:opgave-4:question-19');
  if (!q19) fail('fixture must contain q19 record');
  if (q19.question_word !== 'teken') fail('q19 fixture question_word must be teken');
  requireIncludesAll(q19.mapped_mtu_ids || [], ['A42', 'D10', 'D13', 'A81'], 'q19 mapped MTUs');
  if ((q19.mapped_mtu_ids || []).includes('A45')) fail('q19 fixture must not map A45');
  for (const operation of requireArray(q19, 'official_correction_model_operations', 'q19', 3)) {
    if (operation.missing_answer_form_expected !== true) fail(`${operation.operation_id} must keep missing_answer_form_expected true`);
    if (!operation.expected_forbidden_mtu_ids?.includes('A45')) fail(`${operation.operation_id} must forbid A45`);
    if (operation.scale_factor_expected !== false) fail(`${operation.operation_id} must not expect scale factor`);
    if (operation.incidence_or_pass_through_expected !== false) fail(`${operation.operation_id} must not expect incidence/pass-through`);
    if (operation.predictable_misconception_expected !== true) fail(`${operation.operation_id} must expect misconception evidence`);
    requireArray(operation, 'expected_misconception_refs', operation.operation_id, 1);
    requireArray(operation, 'procedure_review_required_unit_ids', operation.operation_id, 1);
    const hooks = operation.review_required_hooks || [];
    if (!hooks.some((hook) => hook.includes('answer-form MTU'))) fail(`${operation.operation_id} must keep graph/draw answer-form hook`);
  }

  const result = runH5Validator();
  const failedIds = new Set(result.buckets.failed.map((item) => item.assertion_id));
  const reviewItems = result.buckets.review_required || [];
  const reviewIds = reviewItems.map((item) => item.assertion_id);
  for (const assertionId of REQUIRED_Q19_FAILED_ASSERTIONS) {
    if (!failedIds.has(assertionId)) fail(`current validator result must still expose q19 assertion: ${assertionId}`);
  }
  for (const marker of REQUIRED_Q19_REVIEW_MARKERS) {
    if (!reviewIds.some((id) => id.includes(marker))) fail(`current validator result must still expose q19 review marker: ${marker}`);
  }

  assertFutureStorageAbsent();
  const operationCandidates = requireArray(packet, 'dry_run_operation_candidates', 'packet', 2);
  for (const [index, candidate] of operationCandidates.entries()) {
    validateOperationCandidate(candidate, `packet.dry_run_operation_candidates[${index}]`);
    if (candidate.operation_status !== 'blocked_by_source_gap') fail(`${candidate.operation_id} must be blocked_by_source_gap`);
    requireIncludesAll(candidate.blocking_gap_ids || [], ['q19-source-annex-gap', 'q19-graph-object-gap'], `${candidate.operation_id}.blocking_gap_ids`);
    if ((candidate.supporting_unit_ids || []).includes('A45')) fail(`${candidate.operation_id} must not support A45`);
  }
  const graphCandidate = operationCandidates.find((candidate) => candidate.operation_id === 'EX_OP_Q19_MARKET_SHIFT_GRAPH_ROUTE');
  if (!graphCandidate) fail('missing graph dry-run operation candidate');
  requireIncludesAll(graphCandidate.supporting_unit_ids || [], ['A42', 'D10'], 'graph candidate supporting units');
  if (!graphCandidate.unit_support_assessments.some((item) => item.unit_id === 'A45' && item.assessment === 'weak_prerequisite')) {
    fail('graph candidate must mark A45 weak_prerequisite');
  }
  const reasonCandidate = operationCandidates.find((candidate) => candidate.operation_id === 'EX_OP_Q19_CHAINED_MARKET_INFLATION_REASONING');
  if (!reasonCandidate) fail('missing reasoning dry-run operation candidate');
  requireIncludesAll(reasonCandidate.supporting_unit_ids || [], ['D10', 'D13'], 'reason candidate supporting units');

  validateAnswerSkillCandidate(packet.dry_run_answer_skill_candidate, 'packet.dry_run_answer_skill_candidate');
  if (packet.dry_run_answer_skill_candidate.answer_skill_status !== 'blocked_by_source_gap') {
    fail('q19 answer-skill candidate must be blocked_by_source_gap');
  }
  if (packet.dry_run_answer_skill_candidate.review_state !== 'blocked_by_source_gap_not_reviewed_equivalent') {
    fail('q19 answer-skill candidate must not claim reviewed-equivalent status');
  }
  requireIncludesAll(
    packet.dry_run_answer_skill_candidate.blocking_gap_ids || [],
    ['q19-source-annex-gap', 'q19-graph-object-gap'],
    'q19 answer-skill candidate gaps'
  );

  validateSourceExtractionDocument(packet.dry_run_source_extraction_document, 'packet.dry_run_source_extraction_document');
  if (packet.dry_run_source_extraction_document.storage_status !== 'dry_run_embedded_not_persistent') {
    fail('source extraction document must be embedded dry-run only');
  }
  if ((packet.dry_run_source_extraction_document.graph_overlays || []).length !== 3) {
    fail('source extraction document must carry three q19 graph overlays');
  }
  if ((packet.dry_run_source_extraction_document.source_annex_overlays || []).length !== 2) {
    fail('source extraction document must carry source figure and worksheet overlays');
  }
  for (const overlay of packet.dry_run_source_extraction_document.graph_overlays || []) {
    if (overlay.extraction_status !== 'partial_with_blocking_gap') fail(`${overlay.extraction_id} must remain partial_with_blocking_gap`);
    requireIncludesAll(overlay.blocking_gap_ids || [], ['q19-source-annex-gap', 'q19-graph-object-gap'], `${overlay.extraction_id}.blocking_gap_ids`);
  }
  for (const overlay of packet.dry_run_source_extraction_document.source_annex_overlays || []) {
    if (overlay.extraction_status !== 'partial_with_blocking_gap') fail(`${overlay.extraction_id} must remain partial_with_blocking_gap`);
    requireIncludesAll(overlay.blocking_gap_ids || [], ['q19-source-annex-gap', 'q19-graph-object-gap'], `${overlay.extraction_id}.blocking_gap_ids`);
  }

  const answerEvidence = packet.answer_form_and_misconception_evidence || {};
  if (answerEvidence.question_word !== 'teken') fail('answer-form evidence must preserve teken');
  if (answerEvidence.expected_answer_form?.status !== 'missing_reviewed_equivalent') fail('answer-form status must remain missing_reviewed_equivalent');
  requireIncludesAll(answerEvidence.expected_answer_form?.not_covered_by || [], ['A42', 'D10', 'D13', 'A81'], 'answer-form not_covered_by units');
  if (answerEvidence.scale_factor_evidence?.status !== 'not_applicable') fail('scale-factor evidence must be not_applicable');
  if (answerEvidence.procedure_expectation?.status !== 'procedure_review_required') fail('procedure expectation must require review');

  if (packet.negative_regression_requirement?.guard_id !== 'q19-teken-answer-form-and-a45-primary-guard') {
    fail('negative regression requirement must preserve q19 answer-form and A45 guard');
  }
  requireIncludesAll(
    packet.negative_regression_requirement.live_answer_form_assertion_ids || [],
    REQUIRED_Q19_FAILED_ASSERTIONS,
    'negative regression live answer-form assertions'
  );
  for (const assertionId of REQUIRED_Q19_FAILED_ASSERTIONS) {
    if (!failedIds.has(assertionId)) fail(`live negative answer-form assertion is absent from validator output: ${assertionId}`);
  }
  for (const marker of REQUIRED_Q19_REVIEW_MARKERS.slice(0, 3)) {
    if (!(packet.negative_regression_requirement.live_review_assertion_markers || []).includes(marker)) {
      fail(`negative regression requirement missing review marker ${marker}`);
    }
  }

  for (const option of requireArray(packet, 'repair_options_matrix', 'packet', 4)) {
    if (option.mutation_authorized_now !== false) fail(`${option.option_id} must not authorize mutation`);
    requireArray(option, 'proof_required', option.option_id, 2);
  }
  if (packet.review_team_threshold?.minimum_verdict !== 'MORE_THAN_SATISFIED') {
    fail('review team threshold must require MORE_THAN_SATISFIED');
  }

  for (const required of [
    'MTU-H5 RP-003/RP-004',
    'teken',
    'A45',
    'q19-source-annex-gap',
    'q19-graph-object-gap',
    'EX_OP_Q19_MARKET_SHIFT_GRAPH_ROUTE',
    'EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION',
    'ready_for_three_agent_review',
    'No protected reference mutation',
  ]) {
    requireIncludes(packetMd, required, 'packet markdown');
  }

  console.log('OK MTU-H5 RP-003/RP-004 q19 planning packet: ready_for_three_agent_review');
}

main();
