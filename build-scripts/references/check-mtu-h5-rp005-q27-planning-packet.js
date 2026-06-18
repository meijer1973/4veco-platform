#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const crypto = require('crypto');

const {
  validateOperationCandidate,
} = require('./lib/exam-ingestion-candidate-validation');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-rp005-q27-planning-packet.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-rp005-q27-planning-packet.md');
const SOURCE_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-next-repair-packet', 'gate-closure.json');
const PREVIOUS_LANE_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-RP003-RP004-q19-planning-packet', 'gate-closure.json');
const NEXT_REPAIR_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-next-repair-packet.json');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');
const MTUS = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const H3_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3-incidence-pass-through', 'gate-closure.json');
const H3A_GATE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3A-incidence-cli-mutation-plan', 'gate-closure.json');
const OPERATION_CANDIDATES = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'operation-candidates.json');
const ANSWER_SKILL_CANDIDATES = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'answer-skill-candidates.json');

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

const REQUIRED_Q27_FAILED_ASSERTIONS_ALWAYS = [
  'vw-1022-a-25-2-o:opgave-6:question-27:q27-step-1:ASSERT-INCIDENCE-MISSING',
  'vw-1022-a-25-2-o:opgave-6:question-27:q27-step-2:ASSERT-INCIDENCE-MISSING',
];

const PRE_SCALING_Q27_FAILED_ASSERTION =
  'vw-1022-a-25-2-o:opgave-6:question-27:q27-step-1:ASSERT-SCALING-MISSING';

const REQUIRED_Q27_FAILED_ASSERTIONS = [
  ...REQUIRED_Q27_FAILED_ASSERTIONS_ALWAYS,
  PRE_SCALING_Q27_FAILED_ASSERTION,
];

const REQUIRED_Q27_REVIEW_MARKERS_ALWAYS = [
  'review whether D07 tax-burden percentage is insufficient for levy price/quantity/capacity operation',
  'review whether this is an incidence/pass-through family case or a distinct levy-capacity operation',
];

const PRE_SCALING_Q27_REVIEW_MARKER =
  'review whether per-1,000-liter scale/unit handling needs a dedicated MTU or reviewed equivalent';

const REQUIRED_Q27_REVIEW_MARKERS = [
  ...REQUIRED_Q27_REVIEW_MARKERS_ALWAYS,
  PRE_SCALING_Q27_REVIEW_MARKER,
];

const Q27_SCALING_REF =
  'reports/mtu-hardening/mtu-h5-q27-incidence-scaling-levy-capacity-package-1.json#Q27_STEP1_A88_PER_1000_LITER_SCALE';

function fail(message) {
  console.error(`MTU-H5 RP-005 q27 planning packet check failed: ${message}`);
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

function assertQ27CandidateStoresAbsent() {
  for (const file of [OPERATION_CANDIDATES, ANSWER_SKILL_CANDIDATES]) {
    if (fs.existsSync(file)) fail(`q27 planning packet must not create candidate storage: ${rel(file)}`);
  }
}

function unitById(units, id) {
  const list = units.units || units;
  return list.find((unit) => unit.id === id);
}

function main() {
  const packet = readJson(PACKET_JSON);
  const packetMd = readText(PACKET_MD);
  const sourceGate = readJson(SOURCE_GATE);
  const previousLaneGate = readJson(PREVIOUS_LANE_GATE);
  const nextRepairPacket = readJson(NEXT_REPAIR_PACKET);
  const fixture = readJson(FIXTURE);
  const units = readJson(MTUS);
  const h3Gate = readJson(H3_GATE);
  const h3aGate = readJson(H3A_GATE);

  if (packet.schema_version !== 1) fail('packet schema_version must be 1');
  if (packet.sprint_id !== 'MTU-H5') fail('packet sprint_id must be MTU-H5');
  if (packet.status !== 'q27_planning_packet_ready_for_three_agent_review_no_mutation_authorized') {
    fail('unexpected packet status');
  }
  requireIncludesAll(packet.repair_ids || [], ['MTU-H5-RP-005'], 'packet.repair_ids');
  if (packet.packet_result?.completion_claimed !== false) fail('packet must not claim lane completion');
  if (packet.packet_result?.next_state !== 'ready_for_three_agent_review') fail('packet next_state mismatch');
  requireFalseBoundary(packet.authority_boundary, 'packet.authority_boundary');

  if (sourceGate.status !== 'approved_triage_review_packet') fail('source gate must be approved');
  if (previousLaneGate.status !== 'approved_more_than_satisfied_no_mutation_authorized') {
    fail('previous q19 lane gate must be MORE_THAN_SATISFIED approved');
  }
  if (sourceGate.reviewed_remote_commit !== packet.source_next_repair_packet_commit) {
    fail('packet source_next_repair_packet_commit must match source gate reviewed_remote_commit');
  }
  if (previousLaneGate.reviewed_remote_commit !== packet.previous_lane_reviewed_commit) {
    fail('packet previous_lane_reviewed_commit must match q19 closure reviewed commit');
  }
  requireGitSuccess(
    ['cat-file', '-e', `${packet.previous_lane_remote_commit}:reports/review-gates/GATE-MTU-H5-RP003-RP004-q19-planning-packet/gate-closure.json`],
    'previous lane remote commit must contain q19 gate closure'
  );

  const q27Lane = (nextRepairPacket.repair_lanes || []).find((lane) => lane.repair_id === 'MTU-H5-RP-005');
  if (!q27Lane) fail('source next repair packet must contain q27 RP-005 lane');
  requireIncludesAll(q27Lane.validator_assertion_ids || [], REQUIRED_Q27_FAILED_ASSERTIONS, 'RP-005 validator assertions');
  for (const marker of REQUIRED_Q27_REVIEW_MARKERS) {
    if (!(q27Lane.validator_assertion_ids || []).some((id) => id.includes(marker))) {
      fail(`source next repair packet missing q27 review marker: ${marker}`);
    }
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
  if (!String(officialEvidence.question_pdf).includes('page=12')) fail('question_pdf must cite q27 page 12');
  if (!String(officialEvidence.correction_pdf).includes('page=13')) fail('correction_pdf must cite q27 correction page 13');
  const values = officialEvidence.source_values || {};
  if (values.levy_eur_per_1000_liter !== 1) fail('q27 levy must be EUR 1 per 1,000 liter');
  if (values.new_price_eur_per_1000_liter !== 2) fail('q27 new price must be EUR 2 per 1,000 liter');
  if (values.new_equilibrium_quantity !== 14000) fail('q27 new equilibrium quantity must be 14000');
  if (values.quantity_equals_capacity !== true) fail('q27 must preserve capacity equality');

  const d07 = unitById(units, 'D07');
  const d08 = unitById(units, 'D08');
  const a88 = unitById(units, 'A88');
  const a98 = unitById(units, 'A98');
  const d41 = unitById(units, 'D41');
  const d05 = unitById(units, 'D05');
  for (const [id, unit] of Object.entries({ D07: d07, D08: d08, A88: a88, A98: a98, D41: d41, D05: d05 })) {
    if (!unit) fail(`expected live unit missing: ${id}`);
  }
  if (!/percentage|afwentelingspercentage/i.test(`${d07.name} ${d07.kern}`)) fail('D07 must be a percentage pass-through unit');
  if (!(d08.needs || []).includes('A15')) fail('D08 must still expose A15 elasticity dependency risk');
  if (!/schaalvermeldingen|x 1\.000/i.test(a88.kern)) fail('A88 must be scale-factor support');
  if (!/Leg-uit-of|leg-uit-of/i.test(a98.name)) fail('A98 must be leg-uit-of answer form');

  if (h3Gate.status !== 'pass_with_conditions') fail('H3 gate must remain pass_with_conditions');
  if (h3aGate.status !== 'pass_with_conditions') fail('H3A gate must remain pass_with_conditions');
  if (h3Gate.authority_boundary?.d07_mutation_authorized !== false) fail('H3 gate must not authorize D07 mutation execution');
  if (h3aGate.authority_boundary?.d07_mutation_authorized !== false) fail('H3A gate must not authorize D07 mutation execution');

  const records = fixture.question_records || fixture.records || [];
  const q27 = records.find((record) => record.record_id === 'vw-1022-a-25-2-o:opgave-6:question-27');
  if (!q27) fail('fixture must contain q27 record');
  if (q27.question_word !== 'leg_uit_of') fail('q27 fixture question_word must be leg_uit_of');
  requireIncludesAll(q27.mapped_mtu_ids || [], ['D07', 'A98'], 'q27 mapped MTUs');
  for (const operation of requireArray(q27, 'official_correction_model_operations', 'q27', 2)) {
    if (!operation.expected_answer_form_mtu_ids?.includes('A98')) fail(`${operation.operation_id} must keep A98 answer form`);
    if (operation.missing_incidence_expected !== true) fail(`${operation.operation_id} must keep missing_incidence_expected true`);
    if (!operation.expected_misconception_refs?.length) fail(`${operation.operation_id} must keep misconception refs`);
    if (!operation.procedure_review_required_unit_ids?.includes('D07')) fail(`${operation.operation_id} must keep D07 procedure review`);
    if (operation.operation_id === 'q27-step-1') {
      if (operation.scale_factor_expected !== true) fail('q27-step-1 must keep scale_factor_expected true');
      if (operation.missing_scaling_expected === false) {
        requireIncludesAll(operation.mapped_mtu_ids || [], ['A88'], 'q27-step-1 mapped MTUs after scaling execution');
        requireIncludesAll(operation.expected_scaling_mtu_ids || [], ['A88'], 'q27-step-1 expected scaling MTUs after scaling execution');
        requireIncludesAll(operation.scaling_reviewed_equivalent_refs || [], [Q27_SCALING_REF], 'q27-step-1 scaling refs after scaling execution');
      } else if (operation.missing_scaling_expected !== true) {
        fail('q27-step-1 missing_scaling_expected must be true before execution or false after approved A88 execution');
      }
    }
  }

  const result = runH5Validator();
  const failedIds = new Set(result.buckets.failed.map((item) => item.assertion_id));
  const reviewIds = (result.buckets.review_required || []).map((item) => item.assertion_id);
  const q27Step1 = q27.official_correction_model_operations.find((operation) => operation.operation_id === 'q27-step-1');
  const scalingExecuted = q27Step1?.missing_scaling_expected === false;

  for (const assertionId of REQUIRED_Q27_FAILED_ASSERTIONS_ALWAYS) {
    if (!failedIds.has(assertionId)) fail(`current validator result must still expose q27 assertion: ${assertionId}`);
  }
  if (!scalingExecuted && !failedIds.has(PRE_SCALING_Q27_FAILED_ASSERTION)) {
    fail(`current validator result must still expose q27 assertion: ${PRE_SCALING_Q27_FAILED_ASSERTION}`);
  }
  if (scalingExecuted && failedIds.has(PRE_SCALING_Q27_FAILED_ASSERTION)) {
    fail(`current validator result must not expose repaired q27 scaling assertion: ${PRE_SCALING_Q27_FAILED_ASSERTION}`);
  }
  for (const marker of REQUIRED_Q27_REVIEW_MARKERS_ALWAYS) {
    if (!reviewIds.some((id) => id.includes(marker))) fail(`current validator result must still expose q27 review marker: ${marker}`);
  }
  if (!scalingExecuted && !reviewIds.some((id) => id.includes(PRE_SCALING_Q27_REVIEW_MARKER))) {
    fail(`current validator result must still expose q27 review marker: ${PRE_SCALING_Q27_REVIEW_MARKER}`);
  }
  if (scalingExecuted && reviewIds.some((id) => id.includes(PRE_SCALING_Q27_REVIEW_MARKER))) {
    fail(`current validator result must not expose repaired q27 scaling review marker: ${PRE_SCALING_Q27_REVIEW_MARKER}`);
  }

  assertQ27CandidateStoresAbsent();
  validateOperationCandidate(packet.dry_run_operation_candidate, 'packet.dry_run_operation_candidate');
  if (packet.dry_run_operation_candidate.operation_id !== 'EX_OP_Q27_LEVY_CAPACITY_OVERCONSUMPTION_CHECK') {
    fail('unexpected dry-run operation candidate');
  }
  requireIncludesAll(
    packet.dry_run_operation_candidate.supporting_unit_ids || [],
    ['D41', 'D05', 'A88'],
    'q27 dry-run supporting units'
  );
  const assessments = packet.dry_run_operation_candidate.unit_support_assessments || [];
  if (!assessments.some((item) => item.unit_id === 'D08' && item.assessment === 'weak_prerequisite')) {
    fail('D08 must be weak_prerequisite in q27 dry-run candidate');
  }
  if (!assessments.some((item) => item.unit_id === 'D07' && item.assessment === 'rejected')) {
    fail('D07 must be rejected in q27 dry-run candidate');
  }
  requireIncludesAll(
    packet.dry_run_operation_candidate.blocking_gap_ids || [],
    ['q27-incidence-capacity-gap', 'q27-per-1000-liter-scaling-gap', 'q27-d08-semantic-fit-gap'],
    'q27 dry-run blocking gaps'
  );

  if (packet.negative_regression_requirement?.guard_id !== 'q27-incidence-scaling-and-d07-overclaim-guard') {
    fail('negative regression requirement must preserve q27 guard');
  }
  requireIncludesAll(
    packet.negative_regression_requirement.live_failed_assertion_ids || [],
    REQUIRED_Q27_FAILED_ASSERTIONS,
    'negative regression live failed assertions'
  );
  const liveNegativeAssertions = scalingExecuted
    ? REQUIRED_Q27_FAILED_ASSERTIONS_ALWAYS
    : REQUIRED_Q27_FAILED_ASSERTIONS;
  for (const assertionId of liveNegativeAssertions) {
    if (!failedIds.has(assertionId)) fail(`live negative q27 assertion is absent from validator output: ${assertionId}`);
  }
  if (packet.review_team_threshold?.minimum_verdict !== 'MORE_THAN_SATISFIED') {
    fail('review team threshold must require MORE_THAN_SATISFIED');
  }

  for (const required of [
    'MTU-H5 RP-005',
    'q27',
    'D07',
    'A88',
    'D08',
    'EX_OP_Q27_LEVY_CAPACITY_OVERCONSUMPTION_CHECK',
    'ready_for_three_agent_review',
    'No protected reference mutation',
  ]) {
    requireIncludes(packetMd, required, 'packet markdown');
  }

  console.log('OK MTU-H5 RP-005 q27 planning packet: ready_for_three_agent_review');
}

main();
