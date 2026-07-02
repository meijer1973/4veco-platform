#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  buildRawReferenceUrl,
  buildRawUrl,
  parseRepoFromPackageJson,
} = require('../sprints/emit-gate-bundle-urls.js');
const {
  validateSourceExtractionDocument,
} = require('./lib/exam-ingestion-candidate-validation');

const ROOT = process.cwd();
const PACKAGE_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q27-step2-q15-closure-readiness-bundle-1.json');
const PACKAGE_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q27-step2-q15-closure-readiness-bundle-1.md');
const GATE_ID = 'GATE-MTU-H5-Q27-step2-q15-closure-readiness-bundle-1';
const GATE_DIR = path.join(ROOT, 'reports', 'review-gates', GATE_ID);
const GATE_JSON = path.join(GATE_DIR, 'review-packet.json');
const GATE_MD = path.join(GATE_DIR, 'review-packet.md');
const GATE_BUNDLE = path.join(GATE_DIR, 'bundle-urls.md');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const REPORT_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.json');
const REPORT_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.md');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');
const FINAL_Q19_PACKAGE_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-final-resolution-and-closure-bundle-1.json');
const FINAL_Q19_CHECKER = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-q19-final-resolution-and-closure-bundle-1.js');
const MTUS = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const SOURCE_EXTRACTION_OVERLAY = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'source-annex-extraction-overlays.json');
const OPERATION_CANDIDATES = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'operation-candidates.json');
const ANSWER_SKILL_CANDIDATES = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'answer-skill-candidates.json');
const URL_INDEX = path.join(ROOT, 'reports', 'url-index.md');
const AGENT_INDEX = path.join(ROOT, 'reports', 'github-agent-index-platform.md');
const AGENT_INDEX_JSON = path.join(ROOT, 'reports', 'github-agent-index-platform.json');
const LESSEN_AGENT_INDEX = path.join(ROOT, 'reports', 'github-agent-index-lessen.md');
const LESSEN_AGENT_INDEX_JSON = path.join(ROOT, 'reports', 'github-agent-index-lessen.json');

const PACKAGE_ID = 'MTU-H5-Q27-STEP2-Q15-CLOSURE-READINESS-BUNDLE-1';
const STATUS = 'pending_human_review_after_more_than_satisfied_execution';
const START_COMMIT = '7c3dc631378cf90fcbbfda6ac343db0477557aa7';
const REVIEW_BRANCH = 'codex/mtu-h5-q27-step2-q15-closure-readiness-bundle-1-20260619';
const LESSEN_SOURCE_COMMIT = 'a020f7dece0d9acec7f7376e9bd51e632843902b';
const LESSEN_KNOWN_BOOK2_ANCHOR = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren';
const Q15_RECORD_ID = 'vw-1022-a-25-1-o:opgave-3:question-15';
const Q19_RECORD_ID = 'vw-1022-a-25-1-o:opgave-4:question-19';
const Q27_RECORD_ID = 'vw-1022-a-25-2-o:opgave-6:question-27';
const Q27_STEP1_REF = 'reports/mtu-hardening/mtu-h5-q27-incidence-levy-capacity-package-2.json#Q27_STEP1_D41_D05_A88_LEVY_EQUILIBRIUM_REVIEWED_EQUIVALENT';
const Q27_SCALING_REF = 'reports/mtu-hardening/mtu-h5-q27-incidence-scaling-levy-capacity-package-1.json#Q27_STEP1_A88_PER_1000_LITER_SCALE';
const Q27_STEP2_REF = 'reports/mtu-hardening/mtu-h5-q27-step2-q15-closure-readiness-bundle-1.json#Q27_STEP2_CAPACITY_OVERCONSUMPTION_TAXONOMY_REVIEWED_EQUIVALENT';
const Q15_REF = 'reports/mtu-hardening/mtu-h5-q27-step2-q15-closure-readiness-bundle-1.json#Q15_TWO_STEP_DOMINANT_STRATEGY_PD_REVIEWED_EQUIVALENT';
const GLOBAL_NEGATIVE = 'MTUH5-NEGATIVE-negative-solo-q2-function-construction-overtrigger-FAILS-AS-EXPECTED';

const EXPECTED_Q19_REVIEW = [
  `${Q19_RECORD_ID}:q19-step-1:ASSERT-REVIEW-q19-source-annex-gap remains blocking`,
  `${Q19_RECORD_ID}:q19-step-1:ASSERT-REVIEW-q19-graph-object-gap remains blocking`,
  `${Q19_RECORD_ID}:q19-step-2:ASSERT-REVIEW-q19 chained multi-market reasoning remains operation_registry_need with D10/D13 partial support`,
  `${Q19_RECORD_ID}:q19-step-3:ASSERT-REVIEW-q19-source-annex-gap remains blocking`,
  `${Q19_RECORD_ID}:q19-step-3:ASSERT-REVIEW-q19-graph-object-gap remains blocking`,
  `${Q19_RECORD_ID}:q19-step-3:ASSERT-REVIEW-q19 third graph-shift element is now modeled but still depends on blocked graph/source reconstruction`,
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
  'source_overlay_mutation_authorized',
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
  'q27_closure_claimed',
  'q15_closure_claimed',
  'mtu_h5_closure_claimed',
];

const ALLOWED_CHANGED_PATHS = new Set([
  'build-scripts/references/build-mtu-h5-regression-report.js',
  'build-scripts/reports/github-agent-index.js',
  'build-scripts/references/check-mtu-h5-q19-answer-form-equivalent-execution-1.js',
  'build-scripts/references/check-mtu-h5-q19-answer-form-equivalent-execution-gate-1.js',
  'build-scripts/references/check-mtu-h5-q19-answer-form-gate-1.js',
  'build-scripts/references/check-mtu-h5-q19-source-graph-reasoning-package-1.js',
  'build-scripts/references/check-mtu-h5-q19-final-resolution-and-closure-bundle-1.js',
  'build-scripts/references/check-mtu-h5-q19-procedure-semantic-fit-package-1.js',
  'build-scripts/references/check-mtu-h5-q19-source-graph-procedure-reasoning-gate-1.js',
  'build-scripts/references/check-mtu-h5-q27-incidence-levy-capacity-package-2.js',
  'build-scripts/references/check-mtu-h5-q27-incidence-scaling-levy-capacity-package-1.js',
  'build-scripts/references/check-mtu-h5-q27-step2-q15-closure-readiness-bundle-1.js',
  'build-scripts/references/check-mtu-h5-rp005-q27-planning-packet.js',
  'build-scripts/references/check-mtu-h5-rp006-q15-planning-packet.js',
  'reports/mtu-hardening/mtu-h5-q27-step2-q15-closure-readiness-bundle-1.json',
  'reports/mtu-hardening/mtu-h5-q27-step2-q15-closure-readiness-bundle-1.md',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1.json',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1.md',
  'reports/mtu-hardening/mtu-h5-q19-source-graph-reasoning-package-1.json',
  'reports/mtu-hardening/mtu-h5-q19-source-graph-reasoning-package-1.md',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-opgave-08.png',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-opgave-09.png',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-correction-13.png',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-correction-14.png',
  'reports/mtu-hardening/mtu-h5-regression-fixture.json',
  'reports/mtu-hardening/mtu-h5-regression-report.json',
  'reports/mtu-hardening/mtu-h5-regression-report.md',
  'reports/review-gates/GATE-MTU-H5-Q27-step2-q15-closure-readiness-bundle-1/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q27-step2-q15-closure-readiness-bundle-1/review-packet.md',
  'reports/review-gates/GATE-MTU-H5-Q27-step2-q15-closure-readiness-bundle-1/bundle-urls.md',
  'reports/review-gates/GATE-MTU-H5-Q19-final-resolution-and-closure-bundle-1/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q19-final-resolution-and-closure-bundle-1/review-packet.md',
  'reports/review-gates/GATE-MTU-H5-Q19-final-resolution-and-closure-bundle-1/bundle-urls.md',
  'reports/review-gates/GATE-MTU-H5-Q19-source-graph-reasoning-package-1/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q19-source-graph-reasoning-package-1/review-packet.md',
  'reports/url-index.md',
  'reports/github-agent-index-platform.json',
  'reports/github-agent-index-platform.md',
  'reports/github-agent-index-lessen.json',
  'reports/github-agent-index-lessen.md',
]);

const FORBIDDEN_CHANGED_PREFIXES = [
  'references/machine/',
  'references/external/',
  'references/authored/',
  'references/data/exam-ingestion/',
  'reports/candidates/',
  'lesson-output/',
  'lessons/',
  'product/',
  'diagnostics/',
  'pv/',
];

function fail(message) {
  throw new Error(message);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function normalizePath(value) {
  return value.replace(/\\/g, '/').replace(/^"|"$/g, '');
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

function requireText(text, needle, context) {
  if (!text.includes(needle)) fail(`${context} must include ${needle}`);
}

function requireIncludes(values, value, context) {
  if (!Array.isArray(values) || !values.includes(value)) fail(`${context} must include ${value}`);
}

function requireNotIncludes(values, value, context) {
  if (Array.isArray(values) && values.includes(value)) fail(`${context} must not include ${value}`);
}

function requireIncludesAll(values, required, context) {
  for (const value of required) requireIncludes(values, value, context);
}

function requireExact(values, expected, context) {
  const actual = [...(values || [])].sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((value, index) => value !== wanted[index])) {
    fail(`${context} mismatch; expected ${wanted.join(', ')}, got ${actual.join(', ')}`);
  }
}

function requireFalseBoundary(boundary, context) {
  for (const key of AUTHORITY_FALSE_KEYS) {
    if (!boundary || boundary[key] !== false) fail(`${context}.${key} must be false`);
  }
}

function git(args) {
  return spawnSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function requireGitSuccess(args, message) {
  const run = git(args);
  if (run.status !== 0) fail(`${message}: ${(run.stderr || run.stdout || '').trim()}`);
  return run.stdout.trim();
}

function runValidator(fixturePath = FIXTURE, expectFail = false) {
  const args = [
    rel(H5_VALIDATOR),
    '--fixture',
    path.isAbsolute(fixturePath) ? fixturePath : rel(fixturePath),
  ];
  if (expectFail) args.push('--expect-fail');
  args.push('--json');
  const run = spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8' });
  if (run.status !== 0) fail(`validator failed: ${(run.stderr || run.stdout).trim()}`);
  return JSON.parse(run.stdout);
}

function q19FinalClosureActive() {
  if (!fs.existsSync(FINAL_Q19_PACKAGE_JSON) || !fs.existsSync(FINAL_Q19_CHECKER)) return false;
  if (!fs.existsSync(REPORT_JSON)) return false;
  const report = readJson(REPORT_JSON);
  return report.status === 'passed' &&
    report.question_bucket_counts?.q19?.failed === 0 &&
    report.question_bucket_counts?.q19?.review_required === 0 &&
    report.bucket_totals?.failed === 0 &&
    report.bucket_totals?.review_required === 0;
}

function requireSupersededByFinalQ19(container, context) {
  const superseded = container.superseded_by;
  if (!superseded || superseded.package_id !== 'MTU-H5-Q19-FINAL-RESOLUTION-AND-CLOSURE-BUNDLE-1') {
    fail(`${context} must be marked superseded_by MTU-H5-Q19-FINAL-RESOLUTION-AND-CLOSURE-BUNDLE-1`);
  }
}

function records(fixture) {
  return fixture.records || fixture.question_records || [];
}

function findRecord(fixture, recordId) {
  const record = records(fixture).find((item) => item.record_id === recordId);
  if (!record) fail(`missing fixture record ${recordId}`);
  return record;
}

function findOperation(record, operationId) {
  const operation = (record.official_correction_model_operations || []).find((item) => item.operation_id === operationId);
  if (!operation) fail(`missing operation ${operationId}`);
  return operation;
}

function bucketIds(result, bucket, recordId) {
  return (result.buckets?.[bucket] || [])
    .filter((item) => !recordId || item.record_id === recordId)
    .map((item) => item.assertion_id);
}

function requirePackage(packet, gate) {
  if (packet.schema_version !== 1 || packet.sprint_id !== 'MTU-H5') fail('package header mismatch');
  if (packet.package_id !== PACKAGE_ID || packet.gate_id !== GATE_ID) fail('package id mismatch');
  if (packet.status !== STATUS || gate.status !== 'pending_human_review') fail('package/gate status mismatch');
  if (packet.start_commit !== START_COMMIT || packet.review_branch !== REVIEW_BRANCH) fail('package start commit or branch mismatch');
  if (gate.review_standard !== 'REV-STD-1') fail('gate must use REV-STD-1');
  if (!gate.product_end_state || !gate.original_sprint_gate_spec) fail('gate must cite product end-state and original sprint/gate spec');
  if (packet.post_execution_actual_state?.overall?.failed !== 0 ||
      packet.post_execution_actual_state?.overall?.review_required !== 6) {
    fail('package post-execution state must be 0 failed / 6 review_required');
  }
  requireFalseBoundary(packet.authority_boundary, 'package.authority_boundary');
  requireFalseBoundary(gate.authority_boundary, 'gate.authority_boundary');
  if (packet.authority_boundary.fixture_mutation_authorized_after_subagent_lead_approval !== true) {
    fail('package must record bounded fixture mutation authority after lead approval');
  }
  if (gate.requested_decision?.product_or_student_use_authorized_by_this_packet !== false) {
    fail('gate must not authorize product/student use');
  }
  if (q19FinalClosureActive()) {
    requireSupersededByFinalQ19(packet, 'q27-step2/q15 package');
    requireSupersededByFinalQ19(gate, 'q27-step2/q15 gate');
  }
  for (const row of packet.subagent_review_results || []) {
    if (row.verdict !== 'MORE_THAN_SATISFIED_EXECUTE_BOTH') fail(`${row.agent} verdict must be MORE_THAN_SATISFIED_EXECUTE_BOTH`);
  }
  if (packet.subagent_lead_review?.lead_verdict !== 'APPROVE_EXECUTE_BOTH') fail('lead verdict mismatch');

  const q27Evidence = (packet.reviewed_equivalent_evidence || [])
    .find((item) => item.anchor_id === 'Q27_STEP2_CAPACITY_OVERCONSUMPTION_TAXONOMY_REVIEWED_EQUIVALENT');
  if (!q27Evidence) fail('package missing q27 step2 reviewed-equivalent evidence');
  requireIncludesAll(q27Evidence.supporting_unit_ids || [], ['A98', 'A88'], 'q27 step2 supporting units');
  for (const forbidden of ['D07 pass-through percentage', 'D08 elasticity route', 'A15 elasticity prerequisite', 'q27 closure', 'MTU-H5 closure']) {
    requireIncludes(q27Evidence.does_not_cover || [], forbidden, 'q27 step2 does_not_cover');
  }

  const q15Evidence = (packet.reviewed_equivalent_evidence || [])
    .find((item) => item.anchor_id === 'Q15_TWO_STEP_DOMINANT_STRATEGY_PD_REVIEWED_EQUIVALENT');
  if (!q15Evidence) fail('package missing q15 reviewed-equivalent evidence');
  requireIncludesAll(q15Evidence.content_support_unit_ids || [], ['D27', 'F03', 'F09'], 'q15 content support units');
  requireIncludesAll(q15Evidence.answer_form_support_unit_ids || [], ['A97'], 'q15 answer-form support units');
  for (const forbidden of ['A97 alone closing q15', 'D27/F03/F09 content-only support as answer-skill closure', 'graph route', 'calculus route', 'incidence route', 'scaling route']) {
    requireIncludes(q15Evidence.does_not_cover || [], forbidden, 'q15 does_not_cover');
  }
}

function requireFixtureShape(fixture) {
  const q27 = findRecord(fixture, Q27_RECORD_ID);
  const q27Step1 = findOperation(q27, 'q27-step-1');
  const q27Step2 = findOperation(q27, 'q27-step-2');
  requireExact(q27.mapped_mtu_ids || [], ['A98'], 'q27 record mapped MTUs');
  requireNotIncludes(q27.mapped_route_tags || [], 'incidence', 'q27 record route tags');
  requireIncludes(q27.mapped_route_tags || [], 'capacity_constraint', 'q27 record route tags');

  requireExact(q27Step1.reviewed_equivalent_refs || [], [Q27_STEP1_REF], 'q27-step-1 reviewed refs');
  requireExact(q27Step1.scaling_reviewed_equivalent_refs || [], [Q27_SCALING_REF], 'q27-step-1 scaling refs');
  requireIncludesAll(q27Step1.mapped_mtu_ids || [], ['A98', 'A88', 'D41', 'D05'], 'q27-step-1 mapped MTUs');
  requireExact(q27Step1.procedure_review_required_unit_ids || [], [], 'q27-step-1 procedure review units');
  if (q27Step1.missing_incidence_expected !== false || q27Step1.missing_scaling_expected !== false) {
    fail('q27-step-1 package1/package2 repairs must remain executed');
  }

  requireExact(q27Step2.reviewed_equivalent_refs || [], [Q27_STEP2_REF], 'q27-step-2 reviewed refs');
  requireExact(q27Step2.mapped_mtu_ids || [], ['A98', 'A88'], 'q27-step-2 mapped MTUs');
  requireNotIncludes(q27Step2.mapped_mtu_ids || [], 'D07', 'q27-step-2 mapped MTUs');
  requireNotIncludes(q27Step2.mapped_mtu_ids || [], 'D08', 'q27-step-2 mapped MTUs');
  requireExact(q27Step2.expected_procedure_unit_ids || [], ['A98'], 'q27-step-2 procedure units');
  requireExact(q27Step2.procedure_review_required_unit_ids || [], [], 'q27-step-2 procedure review units');
  requireExact(q27Step2.review_required_hooks || [], [], 'q27-step-2 review hooks');
  if (q27Step2.incidence_or_pass_through_expected !== false || q27Step2.missing_incidence_expected !== false) {
    fail('q27-step-2 must no longer be classified as incidence/pass-through missing');
  }
  requireExact(q27Step2.expected_incidence_mtu_ids || [], [], 'q27-step-2 incidence MTUs');
  requireIncludes(q27Step2.expected_route_tags || [], 'capacity_constraint', 'q27-step-2 expected route tags');
  requireNotIncludes(q27Step2.expected_route_tags || [], 'incidence', 'q27-step-2 expected route tags');

  const q15 = findRecord(fixture, Q15_RECORD_ID);
  requireExact(q15.mapped_mtu_ids || [], ['A97', 'D27', 'F03', 'F09'], 'q15 record mapped MTUs');
  for (const forbidden of ['calculus_route', 'function_construction', 'graph_shift', 'incidence', 'scaling']) {
    requireNotIncludes(q15.mapped_route_tags || [], forbidden, 'q15 route tags');
  }
  for (const operationId of ['q15-step-1', 'q15-step-2']) {
    const operation = findOperation(q15, operationId);
    requireExact(operation.reviewed_equivalent_refs || [], [Q15_REF], `${operationId} reviewed refs`);
    requireIncludes(operation.expected_answer_form_mtu_ids || [], 'A97', `${operationId} answer form`);
    requireIncludes(operation.expected_procedure_unit_ids || [], 'A97', `${operationId} procedure units`);
    requireExact(operation.procedure_review_required_unit_ids || [], [], `${operationId} procedure review units`);
    requireExact(operation.review_required_hooks || [], [], `${operationId} review hooks`);
    if (operation.incidence_or_pass_through_expected !== false || operation.scale_factor_expected !== false) {
      fail(`${operationId} must not expect incidence/pass-through or scaling`);
    }
    for (const forbidden of ['calculus_route', 'function_construction', 'graph_shift', 'incidence', 'scaling']) {
      requireNotIncludes(operation.expected_route_tags || [], forbidden, `${operationId} expected route tags`);
      requireNotIncludes(operation.mapped_route_tags || [], forbidden, `${operationId} mapped route tags`);
    }
  }
}

function requireValidatorState() {
  const result = runValidator();
  const finalClosed = q19FinalClosureActive();
  if (finalClosed) {
    if (result.status !== 'passed') fail(`validator status must be passed after q19 final closure, got ${result.status}`);
  } else if (result.status !== 'review_required') {
    fail(`validator status must be review_required, got ${result.status}`);
  }
  if ((result.buckets.failed || []).length !== 0) fail('validator failed bucket must be empty');
  if ((result.buckets.blocked || []).length !== 0) fail('validator blocked bucket must be empty');
  requireExact(bucketIds(result, 'review_required', Q19_RECORD_ID), finalClosed ? [] : EXPECTED_Q19_REVIEW, 'q19 held or closed review assertions');
  requireExact(bucketIds(result, 'review_required', Q15_RECORD_ID), [], 'q15 review assertions');
  requireExact(bucketIds(result, 'review_required', Q27_RECORD_ID), [], 'q27 review assertions');
  requireExact(bucketIds(result, 'failed', Q15_RECORD_ID), [], 'q15 failed assertions');
  requireExact(bucketIds(result, 'failed', Q27_RECORD_ID), [], 'q27 failed assertions');
  requireIncludes(bucketIds(result, 'passed'), GLOBAL_NEGATIVE, 'global negative guard');
}

function requireReportState() {
  const report = readJson(REPORT_JSON);
  const reportText = `${JSON.stringify(report)}\n${readText(REPORT_MD)}`;
  if (report.source_validator_command !== 'node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --json') {
    fail('report source validator command must not include --expect-fail');
  }
  const finalClosed = q19FinalClosureActive();
  if (finalClosed) {
    if (report.status !== 'passed') fail('report status must be passed after q19 final closure');
    if (report.bucket_totals?.failed !== 0 || report.bucket_totals?.review_required !== 0 || report.bucket_totals?.blocked !== 0) {
      fail('report totals must be 0 failed / 0 review_required / 0 blocked after q19 final closure');
    }
    if (report.question_bucket_counts?.q19?.failed !== 0 || report.question_bucket_counts?.q19?.review_required !== 0) fail('report q19 must be 0/0 after q19 final closure');
  } else {
    if (report.status !== 'review_required') fail('report status must be review_required');
    if (report.bucket_totals?.failed !== 0 || report.bucket_totals?.review_required !== 6 || report.bucket_totals?.blocked !== 0) {
      fail('report totals must be 0 failed / 6 review_required / 0 blocked');
    }
    if (report.question_bucket_counts?.q19?.failed !== 0 || report.question_bucket_counts?.q19?.review_required !== 6) fail('report q19 must be 0/6');
  }
  if (report.question_bucket_counts?.q15?.failed !== 0 || report.question_bucket_counts?.q15?.review_required !== 0) fail('report q15 must be 0/0');
  if (report.question_bucket_counts?.q27?.failed !== 0 || report.question_bucket_counts?.q27?.review_required !== 0) fail('report q27 must be 0/0');
  if (report.remaining_lane_status?.q27?.blocks_mtu_h5_closure !== false) fail('report q27 must not block MTU-H5 closure');
  if (report.remaining_lane_status?.q15?.blocks_mtu_h5_closure !== false) fail('report q15 must not block MTU-H5 closure');
  if (report.remaining_lane_status?.q19?.blocks_mtu_h5_closure !== !finalClosed) {
    fail(finalClosed ? 'report q19 must not remain the closure blocker' : 'report q19 must remain the closure blocker');
  }
  const requiredText = finalClosed
    ? ['q27 is clean', 'q15 is clean', 'q19 is clean', 'student/product use remain unauthorized']
    : ['q27 is clean', 'q15 is clean', 'q19 remains', 'product-route readiness remain blocked'];
  for (const required of requiredText) {
    requireText(reportText, required, 'report');
  }
  for (const stale of [
    'q27 remains a step-2 capacity/overconsumption governance blocker',
    'q15 remains an answer-skill/procedure semantic-fit review blocker',
    '--expect-fail --json',
    '| q27 | 1 | 2 |',
    '| q15 | 0 | 4 |',
  ]) {
    if (reportText.includes(stale)) fail(`report must not include stale text: ${stale}`);
  }
}

function requireUnits() {
  const units = readJson(MTUS);
  const byId = new Map((Array.isArray(units) ? units : units.units || []).map((unit) => [unit.id, unit]));
  for (const id of ['A97', 'A98', 'A88', 'D27', 'F03', 'F09', 'D07', 'D08', 'D41', 'D05']) {
    if (!byId.get(id)) fail(`missing registry unit ${id}`);
  }
  if (!/Leg-uit-dat|leg-uit-dat/i.test(byId.get('A97').name)) fail('A97 must remain leg-uit-dat answer form');
  if (!/Leg-uit-of|leg-uit-of/i.test(byId.get('A98').name)) fail('A98 must remain leg-uit-of answer form');
  if (!/schaal|1\.000/i.test(`${byId.get('A88').kern} ${(byId.get('A88').procedure || []).join(' ')}`)) fail('A88 must remain scale/unit support');
  if (!(byId.get('D08').needs || []).includes('A15')) fail('D08 must still expose A15 elasticity dependency risk');
  if (!/percentage|afwentelingspercentage/i.test(`${byId.get('D07').name} ${byId.get('D07').kern}`)) fail('D07 must remain pass-through percentage evidence');
  for (const id of ['D27', 'F03', 'F09']) {
    if (byId.get(id).mastery_target !== 'understand') fail(`${id} must remain content-level support`);
  }
}

function requireCandidateStorageBoundary() {
  for (const file of [OPERATION_CANDIDATES, ANSWER_SKILL_CANDIDATES]) {
    if (fs.existsSync(file)) fail(`candidate storage must not exist: ${rel(file)}`);
  }
  if (fs.existsSync(SOURCE_EXTRACTION_OVERLAY)) {
    const overlay = readJson(SOURCE_EXTRACTION_OVERLAY);
    validateSourceExtractionDocument(overlay, 'source-annex extraction overlay');
    if (overlay.authority_boundary?.student_product_use_authorized !== false) {
      fail('source-annex extraction overlay must not authorize student/product use');
    }
  }
}

function requireNegativeGuards() {
  const fixture = readJson(FIXTURE);

  const q27Negative = JSON.parse(JSON.stringify(fixture));
  const q27Step2 = findOperation(findRecord(q27Negative, Q27_RECORD_ID), 'q27-step-2');
  q27Step2.reviewed_equivalent_refs = [];
  q27Step2.incidence_or_pass_through_expected = true;
  q27Step2.missing_incidence_expected = true;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mtu-h5-q27-step2-negative-'));
  const tempFixture = path.join(tempDir, 'fixture.json');
  try {
    fs.writeFileSync(tempFixture, `${JSON.stringify(q27Negative, null, 2)}\n`, 'utf8');
    const negative = runValidator(tempFixture, true);
    requireIncludes(bucketIds(negative, 'failed', Q27_RECORD_ID), `${Q27_RECORD_ID}:q27-step-2:ASSERT-INCIDENCE-MISSING`, 'q27 negative failed assertions');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  const q15Negative = JSON.parse(JSON.stringify(fixture));
  const q15 = findRecord(q15Negative, Q15_RECORD_ID);
  const step1 = findOperation(q15, 'q15-step-1');
  const step2 = findOperation(q15, 'q15-step-2');
  step1.reviewed_equivalent_refs = [];
  step1.review_required_hooks = ['review whether D27/F03 content coverage plus A97 answer form is enough or whether q15-answer-1 remains a separate answer-skill need'];
  step1.procedure_review_required_unit_ids = ['A97'];
  step2.reviewed_equivalent_refs = [];
  step2.review_required_hooks = ['review q15 two-step correction-model explanation as answer-skill need'];
  step2.procedure_review_required_unit_ids = ['A97'];
  const q15TempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mtu-h5-q15-negative-'));
  const q15TempFixture = path.join(q15TempDir, 'fixture.json');
  try {
    fs.writeFileSync(q15TempFixture, `${JSON.stringify(q15Negative, null, 2)}\n`, 'utf8');
    const negative = runValidator(q15TempFixture);
    requireIncludes(bucketIds(negative, 'review_required', Q15_RECORD_ID), `${Q15_RECORD_ID}:q15-step-1:ASSERT-PROCEDURE-REVIEW-A97`, 'q15 negative review assertions');
    requireIncludes(bucketIds(negative, 'review_required', Q15_RECORD_ID), `${Q15_RECORD_ID}:q15-step-2:ASSERT-PROCEDURE-REVIEW-A97`, 'q15 negative review assertions');
  } finally {
    fs.rmSync(q15TempDir, { recursive: true, force: true });
  }
}

function changedPathsFromStatus() {
  const run = git(['status', '--porcelain=v1', '--untracked-files=all']);
  if (run.status !== 0) fail(`git status failed: ${run.stderr.trim()}`);
  const paths = [];
  for (const line of run.stdout.split(/\r?\n/).filter(Boolean)) {
    let value = line.slice(3).trim();
    if (value.includes(' -> ')) value = value.split(' -> ').pop();
    paths.push(normalizePath(value));
  }
  return paths;
}

function changedPathsFromDiff(args) {
  const run = git(args);
  if (run.status !== 0) return [];
  return run.stdout.split(/\r?\n/).filter(Boolean).map(normalizePath);
}

function requireChangedPathBoundary() {
  const paths = new Set([
    ...changedPathsFromDiff(['diff', '--name-only', 'origin/main...HEAD']),
    ...changedPathsFromDiff(['diff', '--name-only']),
    ...changedPathsFromDiff(['diff', '--cached', '--name-only']),
    ...changedPathsFromStatus(),
  ]);
  for (const changedPath of paths) {
    if (FORBIDDEN_CHANGED_PREFIXES.some((prefix) => changedPath.startsWith(prefix))) {
      fail(`forbidden protected path changed: ${changedPath}`);
    }
    if (!ALLOWED_CHANGED_PATHS.has(changedPath)) fail(`unexpected changed path: ${changedPath}`);
  }
}

function requireRemoteDiscoverability(packet, gate) {
  const bundle = readText(GATE_BUNDLE);
  const urlIndex = readText(URL_INDEX);
  const agentMd = readText(AGENT_INDEX);
  const agentJson = readJson(AGENT_INDEX_JSON);
  const agentFiles = new Set(Object.values(agentJson.groups || {}).flat());
  const { owner, repo } = parseRepoFromPackageJson();
  const refs = new Set([
    ...(gate.must_review || []),
    ...(gate.evidence_base || []),
    rel(GATE_JSON),
    rel(GATE_MD),
    rel(GATE_BUNDLE),
  ]);
  for (const ref of refs) requireText(bundle, buildRawReferenceUrl(owner, repo, packet.review_branch, ref), 'bundle URLs');
  requireText(urlIndex, buildRawUrl(owner, repo, 'main', rel(GATE_BUNDLE)), 'url index');
  for (const ref of [rel(PACKAGE_JSON), rel(PACKAGE_MD), rel(__filename), rel(GATE_JSON), rel(GATE_MD), rel(GATE_BUNDLE)]) {
    requireText(agentMd, ref, 'agent index markdown');
    if (!agentFiles.has(ref)) fail(`agent index JSON missing ${ref}`);
  }
}

function requireLessenIndexProvenance() {
  const lessenMd = readText(LESSEN_AGENT_INDEX);
  const lessenJson = readJson(LESSEN_AGENT_INDEX_JSON);
  const serialized = `${lessenMd}\n${JSON.stringify(lessenJson)}`;
  if (lessenJson.repo !== '4veco-lessen' || lessenJson.available !== true) {
    fail('lessen agent index must be available for 4veco-lessen');
  }
  if (lessenJson.source_branch !== 'origin/main') fail('lessen index source_branch must be origin/main');
  if (lessenJson.source_commit !== LESSEN_SOURCE_COMMIT) {
    fail(`lessen index source_commit must be ${LESSEN_SOURCE_COMMIT}`);
  }
  if (!String(lessenJson.source_remote_url || '').includes('github.com/meijer1973/4veco-lessen')) {
    fail('lessen index source_remote_url must point at meijer1973/4veco-lessen');
  }
  if ((lessenJson.file_count || 0) < 1680) fail('lessen index file_count is unexpectedly low');
  requireText(serialized, LESSEN_KNOWN_BOOK2_ANCHOR, 'lessen agent index');
  requireText(serialized, 'paragraaf.md', 'lessen agent index');
}

function requireMarkdown() {
  for (const [text, context] of [[readText(PACKAGE_MD), 'package markdown'], [readText(GATE_MD), 'gate markdown']]) {
    for (const needle of [
      'MTU-H5',
      'REV-STD-1',
      '0 failed / 6 review_required',
      'q19',
      'q27-step-2',
      'q15',
      'D07',
      'D08',
      'A97 alone',
      'student/product use',
    ]) {
      requireText(text, needle, context);
    }
  }
}

function main() {
  const packet = readJson(PACKAGE_JSON);
  const gate = readJson(GATE_JSON);
  requireGitSuccess(['cat-file', '-e', `${START_COMMIT}:reports/mtu-hardening/mtu-h5-regression-fixture.json`], 'start commit must contain MTU-H5 fixture');
  requirePackage(packet, gate);
  requireFixtureShape(readJson(FIXTURE));
  requireValidatorState();
  requireReportState();
  requireUnits();
  requireCandidateStorageBoundary();
  requireNegativeGuards();
  requireMarkdown();
  requireRemoteDiscoverability(packet, gate);
  requireLessenIndexProvenance();
  requireChangedPathBoundary();
  console.log(q19FinalClosureActive()
    ? 'OK MTU-H5 q27-step2/q15 closure-readiness bundle 1: q27 and q15 clean, historical q19 hold superseded by final closure'
    : 'OK MTU-H5 q27-step2/q15 closure-readiness bundle 1: q27 and q15 clean, q19 remains held');
}

try {
  main();
} catch (error) {
  console.error(`MTU-H5 q27-step2/q15 closure-readiness bundle 1 check failed: ${error.message}`);
  process.exit(1);
}
