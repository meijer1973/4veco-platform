#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const PACKAGE_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q27-incidence-scaling-levy-capacity-package-1.json');
const PACKAGE_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q27-incidence-scaling-levy-capacity-package-1.md');
const GATE_ID = 'GATE-MTU-H5-Q27-incidence-scaling-levy-capacity-package-1';
const GATE_DIR = path.join(ROOT, 'reports', 'review-gates', GATE_ID);
const GATE_JSON = path.join(GATE_DIR, 'review-packet.json');
const GATE_MD = path.join(GATE_DIR, 'review-packet.md');
const GATE_BUNDLE = path.join(GATE_DIR, 'bundle-urls.md');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const REPORT_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.json');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');
const MTUS = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const URL_INDEX = path.join(ROOT, 'reports', 'url-index.md');
const AGENT_INDEX = path.join(ROOT, 'reports', 'github-agent-index-platform.md');
const AGENT_INDEX_JSON = path.join(ROOT, 'reports', 'github-agent-index-platform.json');

const {
  buildRawReferenceUrl,
  buildRawUrl,
  parseRepoFromPackageJson,
} = require('../sprints/emit-gate-bundle-urls.js');

const PACKAGE_ID = 'MTU-H5-Q27-INCIDENCE-SCALING-LEVY-CAPACITY-PACKAGE-1';
const PRE_STATUS = 'prepared_for_subagent_lead_review_before_scaling_execution';
const POST_STATUS = 'executed_after_subagent_lead_approval_scaling_only';
const GATE_PRE_STATUS = 'pending_subagent_lead_review';
const GATE_POST_STATUS = 'pending_human_review';
const Q27_RECORD_ID = 'vw-1022-a-25-2-o:opgave-6:question-27';
const Q19_RECORD_ID = 'vw-1022-a-25-1-o:opgave-4:question-19';
const SCALING_REF = 'reports/mtu-hardening/mtu-h5-q27-incidence-scaling-levy-capacity-package-1.json#Q27_STEP1_A88_PER_1000_LITER_SCALE';
const INCIDENCE_LEVY_CAPACITY_REF = 'reports/mtu-hardening/mtu-h5-q27-incidence-levy-capacity-package-2.json#Q27_STEP1_D41_D05_A88_LEVY_EQUILIBRIUM_REVIEWED_EQUIVALENT';
const STEP2_REF = 'reports/mtu-hardening/mtu-h5-q27-step2-q15-closure-readiness-bundle-1.json#Q27_STEP2_CAPACITY_OVERCONSUMPTION_TAXONOMY_REVIEWED_EQUIVALENT';
const SCALE_HOOK = 'review whether per-1,000-liter scale/unit handling needs a dedicated MTU or reviewed equivalent';
const D07_HOOK = 'review whether D07 tax-burden percentage is insufficient for levy price/quantity/capacity operation';
const STEP2_HOOK = 'review whether this is an incidence/pass-through family case or a distinct levy-capacity operation';

const EXPECTED_POST_Q27_FAILED = [
  `${Q27_RECORD_ID}:q27-step-1:ASSERT-INCIDENCE-MISSING`,
  `${Q27_RECORD_ID}:q27-step-2:ASSERT-INCIDENCE-MISSING`,
];

const EXPECTED_POST_Q27_REVIEW = [
  `${Q27_RECORD_ID}:q27-step-1:ASSERT-PROCEDURE-REVIEW-D07`,
  `${Q27_RECORD_ID}:q27-step-1:ASSERT-REVIEW-${D07_HOOK}`,
  `${Q27_RECORD_ID}:q27-step-2:ASSERT-PROCEDURE-REVIEW-D07`,
  `${Q27_RECORD_ID}:q27-step-2:ASSERT-REVIEW-${STEP2_HOOK}`,
];

const EXPECTED_PACKAGE2_Q27_FAILED = [
  `${Q27_RECORD_ID}:q27-step-2:ASSERT-INCIDENCE-MISSING`,
];

const EXPECTED_PACKAGE2_Q27_REVIEW = [
  `${Q27_RECORD_ID}:q27-step-2:ASSERT-PROCEDURE-REVIEW-D07`,
  `${Q27_RECORD_ID}:q27-step-2:ASSERT-REVIEW-${STEP2_HOOK}`,
];

const EXPECTED_Q19_REVIEW = [
  `${Q19_RECORD_ID}:q19-step-1:ASSERT-REVIEW-q19-source-annex-gap remains blocking`,
  `${Q19_RECORD_ID}:q19-step-1:ASSERT-REVIEW-q19-graph-object-gap remains blocking`,
  `${Q19_RECORD_ID}:q19-step-2:ASSERT-REVIEW-q19 chained multi-market reasoning remains operation_registry_need with D10/D13 partial support`,
  `${Q19_RECORD_ID}:q19-step-3:ASSERT-REVIEW-q19-source-annex-gap remains blocking`,
  `${Q19_RECORD_ID}:q19-step-3:ASSERT-REVIEW-q19-graph-object-gap remains blocking`,
  `${Q19_RECORD_ID}:q19-step-3:ASSERT-REVIEW-q19 third graph-shift element is now modeled but still depends on blocked graph/source reconstruction`,
];

const ALLOWED_CHANGED_PATHS = new Set([
  'build-scripts/references/check-mtu-h5-q27-incidence-scaling-levy-capacity-package-1.js',
  'build-scripts/references/check-mtu-h5-q27-incidence-levy-capacity-package-2.js',
  'build-scripts/references/check-mtu-h5-q27-step2-q15-closure-readiness-bundle-1.js',
  'build-scripts/references/check-mtu-h5-rp005-q27-planning-packet.js',
  'build-scripts/references/check-mtu-h5-rp006-q15-planning-packet.js',
  'build-scripts/references/check-mtu-h5-q19-source-graph-reasoning-package-1.js',
  'build-scripts/references/build-mtu-h5-regression-report.js',
  'build-scripts/reports/github-agent-index.js',
  'reports/mtu-hardening/mtu-h5-q27-incidence-scaling-levy-capacity-package-1.json',
  'reports/mtu-hardening/mtu-h5-q27-incidence-scaling-levy-capacity-package-1.md',
  'reports/mtu-hardening/mtu-h5-q27-incidence-levy-capacity-package-2.json',
  'reports/mtu-hardening/mtu-h5-q27-incidence-levy-capacity-package-2.md',
  'reports/mtu-hardening/mtu-h5-q27-step2-q15-closure-readiness-bundle-1.json',
  'reports/mtu-hardening/mtu-h5-q27-step2-q15-closure-readiness-bundle-1.md',
  'reports/mtu-hardening/mtu-h5-regression-fixture.json',
  'reports/mtu-hardening/mtu-h5-regression-report.json',
  'reports/mtu-hardening/mtu-h5-regression-report.md',
  'reports/review-gates/GATE-MTU-H5-Q27-incidence-scaling-levy-capacity-package-1/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q27-incidence-scaling-levy-capacity-package-1/review-packet.md',
  'reports/review-gates/GATE-MTU-H5-Q27-incidence-scaling-levy-capacity-package-1/bundle-urls.md',
  'reports/review-gates/GATE-MTU-H5-Q27-incidence-levy-capacity-package-2/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q27-incidence-levy-capacity-package-2/review-packet.md',
  'reports/review-gates/GATE-MTU-H5-Q27-incidence-levy-capacity-package-2/bundle-urls.md',
  'reports/review-gates/GATE-MTU-H5-Q27-step2-q15-closure-readiness-bundle-1/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q27-step2-q15-closure-readiness-bundle-1/review-packet.md',
  'reports/review-gates/GATE-MTU-H5-Q27-step2-q15-closure-readiness-bundle-1/bundle-urls.md',
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

function requireNotIncludes(values, value, context) {
  if (Array.isArray(values) && values.includes(value)) fail(`${context} must not include ${value}`);
}

function requireExact(values, expected, context) {
  const actual = [...(values || [])].sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((value, index) => value !== wanted[index])) {
    fail(`${context} mismatch; expected ${wanted.join(', ')}, got ${actual.join(', ')}`);
  }
}

function requireText(text, needle, context) {
  if (!text.includes(needle)) fail(`${context} must include ${needle}`);
}

function git(args) {
  return spawnSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
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
  return (result.buckets?.[bucket] || []).filter((item) => !recordId || item.record_id === recordId).map((item) => item.assertion_id);
}

function isExecuted(packageStatus) {
  return packageStatus === POST_STATUS;
}

function isStep1IncidenceRepaired(step1) {
  return step1.missing_incidence_expected === false &&
    Array.isArray(step1.reviewed_equivalent_refs) &&
    step1.reviewed_equivalent_refs.includes(INCIDENCE_LEVY_CAPACITY_REF);
}

function requirePackage(packet, gate) {
  if (packet.schema_version !== 1 || packet.sprint_id !== 'MTU-H5') fail('package header mismatch');
  if (packet.package_id !== PACKAGE_ID || packet.gate_id !== GATE_ID) fail('package id mismatch');
  if (![PRE_STATUS, POST_STATUS].includes(packet.status)) fail('package status mismatch');
  if (![GATE_PRE_STATUS, GATE_POST_STATUS].includes(gate.status)) fail('gate status mismatch');
  if (gate.review_standard !== 'REV-STD-1') fail('gate must use REV-STD-1');
  const evidence = packet.reviewed_equivalent_evidence || [];
  const scale = evidence.find((item) => item.anchor_id === 'Q27_STEP1_A88_PER_1000_LITER_SCALE');
  if (!scale) fail('package must expose Q27_STEP1_A88_PER_1000_LITER_SCALE');
  if (scale.unit_id !== 'A88' || scale.decision !== 'approved_scaling_support_only') fail('A88 scaling evidence mismatch');
  for (const forbidden of ['incidence/pass-through', 'q27 closure']) {
    requireIncludes(scale.does_not_cover || [], forbidden, 'A88 scaling does_not_cover');
  }
  if (packet.exact_write_surface?.operation_id !== 'q27-step-1') fail('write surface must be q27-step-1 only');
  requireIncludes(packet.exact_write_surface?.fields || [], 'q27-step-1.expected_scaling_mtu_ids', 'write surface fields');
  requireIncludes(packet.exact_write_surface?.forbidden_fixture_changes || [], 'q27-step-2 any field', 'forbidden fixture changes');
  for (const result of packet.pre_execution_review_team_results || []) {
    if (result.verdict !== 'MORE_THAN_SATISFIED_EXECUTE_SCALING_ONLY') fail(`${result.agent} review verdict mismatch`);
  }
  if (isExecuted(packet.status)) {
    if (packet.subagent_lead_review?.status !== 'approved') fail('lead review must be approved after execution');
    if (packet.subagent_lead_review?.lead_verdict !== 'APPROVE_SCALING_ONLY_EXECUTION') fail('lead verdict mismatch');
  }
}

function requireFixtureShape(fixture, executed) {
  const q27 = findRecord(fixture, Q27_RECORD_ID);
  const step1 = findOperation(q27, 'q27-step-1');
  const step2 = findOperation(q27, 'q27-step-2');

  const step1IncidenceRepaired = isStep1IncidenceRepaired(step1);
  if (step1.incidence_or_pass_through_expected !== true) fail('q27-step-1 incidence expectation must remain present');
  if (!step1IncidenceRepaired && step1.missing_incidence_expected !== true) {
    fail('q27-step-1 incidence missing expectation must remain true until package 2 repair');
  }
  const step2Resolved = (step2.reviewed_equivalent_refs || []).includes(STEP2_REF);
  if (step2Resolved) {
    if (step2.incidence_or_pass_through_expected !== false || step2.missing_incidence_expected !== false) {
      fail('q27-step-2 incidence missing expectation must be cleared after later execution');
    }
  } else if (step2.incidence_or_pass_through_expected !== true || step2.missing_incidence_expected !== true) {
    fail('q27-step-2 incidence missing expectation must remain true until later execution');
  }
  requireExact(step1.expected_incidence_mtu_ids || [], [], 'q27-step-1 incidence MTUs');
  requireExact(step2.expected_incidence_mtu_ids || [], [], 'q27-step-2 incidence MTUs');
  if (step2Resolved) {
    requireExact(step2.procedure_review_required_unit_ids || [], [], 'q27-step-2 procedure review after later execution');
    requireExact(step2.review_required_hooks || [], [], 'q27-step-2 review hooks after later execution');
    requireNotIncludes(step2.mapped_mtu_ids || [], 'D07', 'q27-step-2 mapped MTUs after later execution');
    requireNotIncludes(step2.mapped_mtu_ids || [], 'D08', 'q27-step-2 mapped MTUs after later execution');
  } else {
    requireIncludes(step2.procedure_review_required_unit_ids || [], 'D07', 'q27-step-2 procedure review');
    requireIncludes(step2.review_required_hooks || [], STEP2_HOOK, 'q27-step-2 review hooks');
  }

  if (step1IncidenceRepaired) {
    requireIncludes(step1.mapped_mtu_ids || [], 'D41', 'q27-step-1 mapped MTUs after package 2');
    requireIncludes(step1.mapped_mtu_ids || [], 'D05', 'q27-step-1 mapped MTUs after package 2');
    requireIncludes(step1.expected_required_mtu_ids || [], 'D41', 'q27-step-1 expected required MTUs after package 2');
    requireIncludes(step1.expected_required_mtu_ids || [], 'D05', 'q27-step-1 expected required MTUs after package 2');
    requireNotIncludes(step1.mapped_mtu_ids || [], 'D07', 'q27-step-1 mapped MTUs after package 2');
    requireNotIncludes(step1.expected_procedure_unit_ids || [], 'D07', 'q27-step-1 procedure units after package 2');
    requireExact(step1.procedure_review_required_unit_ids || [], [], 'q27-step-1 procedure review after package 2');
    requireExact(step1.review_required_hooks || [], [], 'q27-step-1 review hooks after package 2');
  } else {
    requireIncludes(step1.procedure_review_required_unit_ids || [], 'D07', 'q27-step-1 procedure review');
    requireIncludes(step1.review_required_hooks || [], D07_HOOK, 'q27-step-1 review hooks');
  }

  if (executed) {
    requireIncludes(step1.mapped_mtu_ids || [], 'A88', 'q27-step-1 mapped MTUs');
    requireExact(step1.expected_scaling_mtu_ids || [], ['A88'], 'q27-step-1 expected scaling MTUs');
    requireExact(step1.scaling_reviewed_equivalent_refs || [], [SCALING_REF], 'q27-step-1 scaling refs');
    if (step1.missing_scaling_expected !== false) fail('q27-step-1 missing_scaling_expected must be false after execution');
    requireNotIncludes(step1.review_required_hooks || [], SCALE_HOOK, 'q27-step-1 review hooks');
  } else {
    requireNotIncludes(step1.mapped_mtu_ids || [], 'A88', 'q27-step-1 mapped MTUs before execution');
    requireExact(step1.expected_scaling_mtu_ids || [], [], 'q27-step-1 expected scaling MTUs before execution');
    if (step1.missing_scaling_expected !== true) fail('q27-step-1 missing_scaling_expected must be true before execution');
    requireIncludes(step1.review_required_hooks || [], SCALE_HOOK, 'q27-step-1 review hooks before execution');
  }
}

function cloneWithScalingExecuted(fixture) {
  const clone = JSON.parse(JSON.stringify(fixture));
  const q27 = findRecord(clone, Q27_RECORD_ID);
  const step1 = findOperation(q27, 'q27-step-1');
  if (!step1.mapped_mtu_ids.includes('A88')) step1.mapped_mtu_ids.push('A88');
  step1.expected_scaling_mtu_ids = ['A88'];
  step1.scaling_reviewed_equivalent_refs = [SCALING_REF];
  step1.missing_scaling_expected = false;
  step1.review_required_hooks = (step1.review_required_hooks || []).filter((hook) => hook !== SCALE_HOOK);
  return clone;
}

function requireValidatorState(executed) {
  const result = runValidator();
  const q19Review = bucketIds(result, 'review_required', Q19_RECORD_ID);
  requireExact(q19Review, EXPECTED_Q19_REVIEW, 'q19 held review assertions');
  const step1IncidenceRepaired = isStep1IncidenceRepaired(findOperation(findRecord(readJson(FIXTURE), Q27_RECORD_ID), 'q27-step-1'));

  const q27Failed = bucketIds(result, 'failed', Q27_RECORD_ID);
  const q27Review = bucketIds(result, 'review_required', Q27_RECORD_ID);
  const step2Resolved = (findOperation(findRecord(readJson(FIXTURE), Q27_RECORD_ID), 'q27-step-2').reviewed_equivalent_refs || []).includes(STEP2_REF);
  if (executed) {
    if (step2Resolved) {
      requireExact(q27Failed, [], 'q27 final failed assertions');
      requireExact(q27Review, [], 'q27 final review assertions');
    } else if (step1IncidenceRepaired) {
      requireExact(q27Failed, EXPECTED_PACKAGE2_Q27_FAILED, 'q27 package 2 failed assertions');
      requireExact(q27Review, EXPECTED_PACKAGE2_Q27_REVIEW, 'q27 package 2 review assertions');
    } else {
      requireExact(q27Failed, EXPECTED_POST_Q27_FAILED, 'q27 post failed assertions');
      requireExact(q27Review, EXPECTED_POST_Q27_REVIEW, 'q27 post review assertions');
    }
  } else {
    requireIncludes(q27Failed, `${Q27_RECORD_ID}:q27-step-1:ASSERT-SCALING-MISSING`, 'q27 pre failed assertions');
    requireIncludes(q27Review, `${Q27_RECORD_ID}:q27-step-1:ASSERT-REVIEW-${SCALE_HOOK}`, 'q27 pre review assertions');

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'q27-scaling-dry-run-'));
    const tempFixture = path.join(tempDir, 'fixture.json');
    try {
      fs.writeFileSync(tempFixture, JSON.stringify(cloneWithScalingExecuted(readJson(FIXTURE)), null, 2));
      const dry = runValidator(tempFixture, true);
      requireExact(bucketIds(dry, 'failed', Q27_RECORD_ID), EXPECTED_POST_Q27_FAILED, 'q27 dry-run failed assertions');
      requireExact(bucketIds(dry, 'review_required', Q27_RECORD_ID), EXPECTED_POST_Q27_REVIEW, 'q27 dry-run review assertions');
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

function requireReportState(executed) {
  const report = readJson(REPORT_JSON);
  const reportMd = readText(path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.md'));
  const reportText = `${JSON.stringify(report)}\n${reportMd}`;
  const counts = report.question_bucket_counts || {};
  if (counts.q19?.failed !== 0 || counts.q19?.review_required !== 6) fail('report q19 must remain 0/6');
  const q15Carried = counts.q15?.failed === 0 && counts.q15?.review_required === 4;
  const q15Clean = counts.q15?.failed === 0 && counts.q15?.review_required === 0;
  if (!q15Carried && !q15Clean) fail('report q15 must be carried 0/4 or clean 0/0');
  if (executed) {
    const package1PostState = counts.q27?.failed === 2 &&
      counts.q27?.review_required === 4 &&
      report.bucket_totals?.failed === 2 &&
      report.bucket_totals?.review_required === 14;
    const package2PostState = counts.q27?.failed === 1 &&
      counts.q27?.review_required === 2 &&
      report.bucket_totals?.failed === 1 &&
      report.bucket_totals?.review_required === 12;
    const finalState = counts.q15?.failed === 0 &&
      counts.q15?.review_required === 0 &&
      counts.q27?.failed === 0 &&
      counts.q27?.review_required === 0 &&
      report.bucket_totals?.failed === 0 &&
      report.bucket_totals?.review_required === 6;
    if (!package1PostState && !package2PostState && !finalState) {
      fail('report q27/totals must be package-1 post-state 2/4 + 2/14, package-2 post-state 1/2 + 1/12, or final clean state 0/6');
    }
    if (package1PostState) {
      requireText(reportText, 'incidence_levy_capacity_procedure_blocker_scaling_repaired', 'post-execution report');
      requireText(reportText, 'scaling repaired', 'post-execution report');
    } else if (package2PostState) {
      requireText(reportText, 'step1_levy_equilibrium_repaired_step2_capacity_governance_blocker', 'package-2 report');
      requireText(reportText, 'q27-step-1 D41/D05/A88 reviewed equivalent accepted', 'package-2 report');
    } else {
      requireText(reportText, 'clean_after_q27_step2_capacity_taxonomy_reviewed_equivalent', 'final report');
      requireText(reportText, 'clean_after_q15_two_step_answer_skill_reviewed_equivalent', 'final report');
    }
    for (const stale of [
      'per-1,000-liter scaling missing',
      'incidence_scaling_levy_capacity_procedure_blocker',
    ]) {
      if (reportText.includes(stale)) fail(`post-execution report must not include stale q27 text: ${stale}`);
    }
  } else {
    if (counts.q27?.failed !== 3 || counts.q27?.review_required !== 5) fail('report q27 must be 3/5 before execution');
    if (report.bucket_totals?.failed !== 3 || report.bucket_totals?.review_required !== 15) fail('report totals must be 3/15 before execution');
  }
}

function requireUnits() {
  const units = readJson(MTUS);
  const byId = new Map(units.map((unit) => [unit.id, unit]));
  const a88 = byId.get('A88');
  if (!a88) fail('A88 missing from registry');
  requireText(`${a88.kern} ${(a88.procedure || []).join(' ')}`, 'schaal', 'A88 registry evidence');
  requireText(`${a88.kern} ${(a88.procedure || []).join(' ')}`, '1.000', 'A88 registry evidence');
}

function changedPaths() {
  const paths = new Set();
  for (const args of [
    ['diff', '--name-only', '--diff-filter=ACMRT', 'origin/main...HEAD'],
    ['diff', '--name-only', '--diff-filter=ACMRT'],
    ['diff', '--cached', '--name-only', '--diff-filter=ACMRT'],
    ['ls-files', '--others', '--exclude-standard'],
  ]) {
    const run = git(args);
    if (run.status === 0) for (const line of run.stdout.split(/\r?\n/).filter(Boolean)) paths.add(line.replace(/\\/g, '/'));
  }
  return [...paths];
}

function requireChangedPaths() {
  for (const file of changedPaths()) {
    if (!ALLOWED_CHANGED_PATHS.has(file)) fail(`unexpected changed path: ${file}`);
    if (FORBIDDEN_CHANGED_PREFIXES.some((prefix) => file.startsWith(prefix))) fail(`forbidden changed path: ${file}`);
  }
}

function requireRemoteDiscoverability(packet, gate, executed) {
  if (!executed) return;
  const bundle = readText(GATE_BUNDLE);
  const urlIndex = readText(URL_INDEX);
  const agentMd = readText(AGENT_INDEX);
  const agentJson = readJson(AGENT_INDEX_JSON);
  const agentFiles = new Set(Object.values(agentJson.groups || {}).flat());
  const { owner, repo } = parseRepoFromPackageJson();
  const refs = new Set([...(gate.must_review || []), rel(GATE_JSON), rel(GATE_MD), rel(GATE_BUNDLE)]);
  for (const ref of refs) requireText(bundle, buildRawReferenceUrl(owner, repo, packet.review_branch, ref), 'bundle URLs');
  requireText(urlIndex, buildRawUrl(owner, repo, 'main', rel(GATE_BUNDLE)), 'url index');
  for (const ref of [rel(PACKAGE_JSON), rel(PACKAGE_MD), rel(__filename), rel(GATE_JSON), rel(GATE_MD), rel(GATE_BUNDLE)]) {
    requireText(agentMd, ref, 'agent index markdown');
    if (!agentFiles.has(ref)) fail(`agent index JSON missing ${ref}`);
  }
}

function main() {
  const packet = readJson(PACKAGE_JSON);
  const gate = readJson(GATE_JSON);
  const executed = isExecuted(packet.status);
  requirePackage(packet, gate);
  requireFixtureShape(readJson(FIXTURE), executed);
  requireValidatorState(executed);
  requireReportState(executed);
  requireUnits();
  requireChangedPaths();
  requireRemoteDiscoverability(packet, gate, executed);
  for (const [text, context] of [[readText(PACKAGE_MD), 'package markdown'], [readText(GATE_MD), 'gate markdown']]) {
    for (const needle of ['q27', 'A88', '2 failed / 4 review_required', 'student/product use']) requireText(text, needle, context);
  }
  console.log(`OK MTU-H5 q27 scaling package 1: ${executed ? 'executed scaling-only' : 'prepared for lead review'}`);
}

try {
  main();
} catch (error) {
  console.error(`MTU-H5 q27 scaling package 1 check failed: ${error.message}`);
  process.exit(1);
}
