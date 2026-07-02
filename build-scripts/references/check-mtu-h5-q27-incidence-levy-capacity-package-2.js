#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const PACKAGE_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q27-incidence-levy-capacity-package-2.json');
const PACKAGE_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q27-incidence-levy-capacity-package-2.md');
const GATE_ID = 'GATE-MTU-H5-Q27-incidence-levy-capacity-package-2';
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
const URL_INDEX = path.join(ROOT, 'reports', 'url-index.md');
const AGENT_INDEX = path.join(ROOT, 'reports', 'github-agent-index-platform.md');
const AGENT_INDEX_JSON = path.join(ROOT, 'reports', 'github-agent-index-platform.json');

const {
  buildRawReferenceUrl,
  buildRawUrl,
  parseRepoFromPackageJson,
} = require('../sprints/emit-gate-bundle-urls.js');

const PACKAGE_ID = 'MTU-H5-Q27-INCIDENCE-LEVY-CAPACITY-PACKAGE-2';
const STATUS = 'executed_after_subagent_lead_approval_option_2';
const GATE_STATUS = 'pending_human_review';
const Q27_RECORD_ID = 'vw-1022-a-25-2-o:opgave-6:question-27';
const Q19_RECORD_ID = 'vw-1022-a-25-1-o:opgave-4:question-19';
const REF = 'reports/mtu-hardening/mtu-h5-q27-incidence-levy-capacity-package-2.json#Q27_STEP1_D41_D05_A88_LEVY_EQUILIBRIUM_REVIEWED_EQUIVALENT';
const STEP2_REF = 'reports/mtu-hardening/mtu-h5-q27-step2-q15-closure-readiness-bundle-1.json#Q27_STEP2_CAPACITY_OVERCONSUMPTION_TAXONOMY_REVIEWED_EQUIVALENT';
const STEP2_HOOK = 'review whether this is an incidence/pass-through family case or a distinct levy-capacity operation';
const STEP1_D07_HOOK = 'review whether D07 tax-burden percentage is insufficient for levy price/quantity/capacity operation';

const EXPECTED_Q19_REVIEW = [
  `${Q19_RECORD_ID}:q19-step-1:ASSERT-REVIEW-q19-source-annex-gap remains blocking`,
  `${Q19_RECORD_ID}:q19-step-1:ASSERT-REVIEW-q19-graph-object-gap remains blocking`,
  `${Q19_RECORD_ID}:q19-step-2:ASSERT-REVIEW-q19 chained multi-market reasoning remains operation_registry_need with D10/D13 partial support`,
  `${Q19_RECORD_ID}:q19-step-3:ASSERT-REVIEW-q19-source-annex-gap remains blocking`,
  `${Q19_RECORD_ID}:q19-step-3:ASSERT-REVIEW-q19-graph-object-gap remains blocking`,
  `${Q19_RECORD_ID}:q19-step-3:ASSERT-REVIEW-q19 third graph-shift element is now modeled but still depends on blocked graph/source reconstruction`,
];

const EXPECTED_Q27_FAILED = [
  `${Q27_RECORD_ID}:q27-step-2:ASSERT-INCIDENCE-MISSING`,
];

const EXPECTED_Q27_REVIEW = [
  `${Q27_RECORD_ID}:q27-step-2:ASSERT-PROCEDURE-REVIEW-D07`,
  `${Q27_RECORD_ID}:q27-step-2:ASSERT-REVIEW-${STEP2_HOOK}`,
];

const ALLOWED_CHANGED_PATHS = new Set([
  'build-scripts/references/check-mtu-h5-q27-incidence-levy-capacity-package-2.js',
  'build-scripts/references/check-mtu-h5-q27-incidence-scaling-levy-capacity-package-1.js',
  'build-scripts/references/check-mtu-h5-q27-step2-q15-closure-readiness-bundle-1.js',
  'build-scripts/references/check-mtu-h5-rp005-q27-planning-packet.js',
  'build-scripts/references/check-mtu-h5-rp006-q15-planning-packet.js',
  'build-scripts/references/check-mtu-h5-q19-answer-form-equivalent-execution-1.js',
  'build-scripts/references/check-mtu-h5-q19-answer-form-equivalent-execution-gate-1.js',
  'build-scripts/references/check-mtu-h5-q19-answer-form-gate-1.js',
  'build-scripts/references/check-mtu-h5-q19-procedure-semantic-fit-package-1.js',
  'build-scripts/references/check-mtu-h5-q19-source-graph-procedure-reasoning-gate-1.js',
  'build-scripts/references/check-mtu-h5-q19-source-graph-reasoning-package-1.js',
  'build-scripts/references/check-mtu-h5-q19-final-resolution-and-closure-bundle-1.js',
  'build-scripts/references/build-mtu-h5-regression-report.js',
  'build-scripts/reports/github-agent-index.js',
  'reports/mtu-hardening/mtu-h5-q27-incidence-levy-capacity-package-2.json',
  'reports/mtu-hardening/mtu-h5-q27-incidence-levy-capacity-package-2.md',
  'reports/mtu-hardening/mtu-h5-q27-step2-q15-closure-readiness-bundle-1.json',
  'reports/mtu-hardening/mtu-h5-q27-step2-q15-closure-readiness-bundle-1.md',
  'reports/mtu-hardening/mtu-h5-q19-source-graph-reasoning-package-1.json',
  'reports/mtu-hardening/mtu-h5-q19-source-graph-reasoning-package-1.md',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1.json',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1.md',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-opgave-08.png',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-opgave-09.png',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-correction-13.png',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-correction-14.png',
  'reports/mtu-hardening/mtu-h5-regression-fixture.json',
  'reports/mtu-hardening/mtu-h5-regression-report.json',
  'reports/mtu-hardening/mtu-h5-regression-report.md',
  'reports/review-gates/GATE-MTU-H5-Q27-incidence-levy-capacity-package-2/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q27-incidence-levy-capacity-package-2/review-packet.md',
  'reports/review-gates/GATE-MTU-H5-Q27-incidence-levy-capacity-package-2/bundle-urls.md',
  'reports/review-gates/GATE-MTU-H5-Q27-step2-q15-closure-readiness-bundle-1/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q27-step2-q15-closure-readiness-bundle-1/review-packet.md',
  'reports/review-gates/GATE-MTU-H5-Q27-step2-q15-closure-readiness-bundle-1/bundle-urls.md',
  'reports/review-gates/GATE-MTU-H5-Q19-source-graph-reasoning-package-1/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q19-source-graph-reasoning-package-1/review-packet.md',
  'reports/review-gates/GATE-MTU-H5-Q19-final-resolution-and-closure-bundle-1/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q19-final-resolution-and-closure-bundle-1/review-packet.md',
  'reports/review-gates/GATE-MTU-H5-Q19-final-resolution-and-closure-bundle-1/bundle-urls.md',
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

function requireText(text, needle, context) {
  if (!text.includes(needle)) fail(`${context} must include ${needle}`);
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

function git(args) {
  return spawnSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function runValidator(fixturePath = FIXTURE, expectFail = false) {
  const args = [rel(H5_VALIDATOR), '--fixture', path.isAbsolute(fixturePath) ? fixturePath : rel(fixturePath)];
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
  if (packet.status !== STATUS || gate.status !== GATE_STATUS) fail('package/gate status mismatch');
  if (gate.review_standard !== 'REV-STD-1') fail('gate must use REV-STD-1');
  for (const reference of [
    'references/external/exams/vw-1022-a-25-2-o.pdf#page=12&question=27',
    'references/external/exams/vw-1022-a-25-2-c.pdf#page=13&question=27',
    'references/machine/micro-teaching-units.json#A98',
  ]) {
    requireIncludes(packet.source_evidence || [], reference, 'package source evidence');
    requireIncludes(gate.must_review || [], reference, 'gate must_review');
  }
  const evidence = packet.reviewed_equivalent_evidence || [];
  const step1 = evidence.find((item) => item.anchor_id === 'Q27_STEP1_D41_D05_A88_LEVY_EQUILIBRIUM_REVIEWED_EQUIVALENT');
  if (!step1) fail('package missing q27 step1 reviewed-equivalent anchor');
  requireExact(step1.supporting_unit_ids || [], ['A98', 'A88', 'D41', 'D05'], 'step1 supporting units');
  if (step1.decision !== 'approved_step1_reviewed_equivalent_only') fail('step1 reviewed-equivalent decision mismatch');
  for (const forbidden of ['q27-step-2 capacity/overconsumption conclusion', 'D08 semantic fit', 'D07 semantic fit', 'q27 closure']) {
    requireIncludes(step1.does_not_cover || [], forbidden, 'step1 does_not_cover');
  }
  const lead = packet.subagent_lead_review || {};
  if (lead.status !== 'approved' || lead.lead_verdict !== 'APPROVE_OPTION_2_EXECUTION') fail('lead approval mismatch');
  const verdicts = Object.fromEntries((packet.subagent_review_results || []).map((row) => [row.agent, row.verdict]));
  if (verdicts.teacher !== 'MORE_THAN_SATISFIED_EXECUTE_OPTION_2') fail('teacher verdict mismatch');
  if (verdicts.economist !== 'MORE_THAN_SATISFIED_EXECUTE_OPTION_2') fail('economist verdict mismatch');
  if (verdicts.quality_inspection !== 'MORE_THAN_SATISFIED_EXECUTE_OPTION_3') fail('quality verdict mismatch');
}

function requireFixtureShape(fixture) {
  const q27 = findRecord(fixture, Q27_RECORD_ID);
  const step1 = findOperation(q27, 'q27-step-1');
  const step2 = findOperation(q27, 'q27-step-2');

  requireExact(step1.reviewed_equivalent_refs || [], [REF], 'q27-step-1 reviewed refs');
  requireIncludes(step1.mapped_mtu_ids || [], 'D41', 'q27-step-1 mapped MTUs');
  requireIncludes(step1.mapped_mtu_ids || [], 'D05', 'q27-step-1 mapped MTUs');
  requireIncludes(step1.mapped_mtu_ids || [], 'A88', 'q27-step-1 mapped MTUs');
  requireIncludes(step1.mapped_mtu_ids || [], 'A98', 'q27-step-1 mapped MTUs');
  requireNotIncludes(step1.mapped_mtu_ids || [], 'D07', 'q27-step-1 mapped MTUs');
  requireIncludes(step1.expected_required_mtu_ids || [], 'D41', 'q27-step-1 expected required MTUs');
  requireIncludes(step1.expected_required_mtu_ids || [], 'D05', 'q27-step-1 expected required MTUs');
  requireNotIncludes(step1.expected_procedure_unit_ids || [], 'D07', 'q27-step-1 expected procedure units');
  requireExact(step1.procedure_review_required_unit_ids || [], [], 'q27-step-1 procedure review units');
  requireExact(step1.review_required_hooks || [], [], 'q27-step-1 review hooks');
  if (step1.missing_incidence_expected !== false) fail('q27-step-1 missing_incidence_expected must be false');
  if (step1.missing_scaling_expected !== false) fail('q27-step-1 scaling repair must remain');
  requireExact(step1.expected_scaling_mtu_ids || [], ['A88'], 'q27-step-1 scaling MTUs');

  const step2Resolved = (step2.reviewed_equivalent_refs || []).includes(STEP2_REF);
  if (step2Resolved) {
    requireExact(step2.reviewed_equivalent_refs || [], [STEP2_REF], 'q27-step-2 reviewed refs after later execution');
    if (step2.missing_incidence_expected !== false || step2.incidence_or_pass_through_expected !== false) {
      fail('q27-step-2 incidence expectation must be cleared after later execution');
    }
    requireNotIncludes(step2.mapped_mtu_ids || [], 'D07', 'q27-step-2 mapped MTUs after later execution');
    requireNotIncludes(step2.mapped_mtu_ids || [], 'D08', 'q27-step-2 mapped MTUs after later execution');
    requireExact(step2.procedure_review_required_unit_ids || [], [], 'q27-step-2 procedure review units after later execution');
    requireExact(step2.review_required_hooks || [], [], 'q27-step-2 review hooks after later execution');
  } else {
    requireExact(step2.reviewed_equivalent_refs || [], [], 'q27-step-2 reviewed refs');
    if (step2.missing_incidence_expected !== true) fail('q27-step-2 missing_incidence_expected must remain true');
    requireIncludes(step2.mapped_mtu_ids || [], 'D07', 'q27-step-2 mapped MTUs');
    requireIncludes(step2.procedure_review_required_unit_ids || [], 'D07', 'q27-step-2 procedure review units');
    requireIncludes(step2.review_required_hooks || [], STEP2_HOOK, 'q27-step-2 review hooks');
    requireNotIncludes(step2.mapped_mtu_ids || [], 'D08', 'q27-step-2 mapped MTUs');
  }
}

function requireValidatorState() {
  const result = runValidator();
  const step2 = findOperation(findRecord(readJson(FIXTURE), Q27_RECORD_ID), 'q27-step-2');
  const step2Resolved = (step2.reviewed_equivalent_refs || []).includes(STEP2_REF);
  requireExact(bucketIds(result, 'failed', Q27_RECORD_ID), step2Resolved ? [] : EXPECTED_Q27_FAILED, 'q27 failed assertions');
  requireExact(bucketIds(result, 'review_required', Q27_RECORD_ID), step2Resolved ? [] : EXPECTED_Q27_REVIEW, 'q27 review assertions');
  requireExact(bucketIds(result, 'review_required', Q19_RECORD_ID), q19FinalClosureActive() ? [] : EXPECTED_Q19_REVIEW, 'q19 held or closed review assertions');

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'q27-package2-negative-'));
  const tempFixture = path.join(tempDir, 'fixture.json');
  try {
    const clone = readJson(FIXTURE);
    const step1 = findOperation(findRecord(clone, Q27_RECORD_ID), 'q27-step-1');
    step1.reviewed_equivalent_refs = [];
    step1.missing_incidence_expected = true;
    fs.writeFileSync(tempFixture, JSON.stringify(clone, null, 2));
    const negative = runValidator(tempFixture, true);
    requireIncludes(bucketIds(negative, 'failed', Q27_RECORD_ID), `${Q27_RECORD_ID}:q27-step-1:ASSERT-INCIDENCE-MISSING`, 'negative q27 failed assertions');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function requireReportState() {
  const report = readJson(REPORT_JSON);
  const reportText = `${JSON.stringify(report)}\n${readText(REPORT_MD)}`;
  const counts = report.question_bucket_counts || {};
  const q19Closed = q19FinalClosureActive();
  if (counts.q19?.failed !== 0 || counts.q19?.review_required !== (q19Closed ? 0 : 6)) {
    fail(q19Closed ? 'report q19 must be 0/0 after final closure' : 'report q19 must remain 0/6');
  }
  const package2State = counts.q15?.failed === 0 &&
    counts.q15?.review_required === 4 &&
    counts.q27?.failed === 1 &&
    counts.q27?.review_required === 2 &&
    report.bucket_totals?.failed === 1 &&
    report.bucket_totals?.review_required === 12;
  const finalState = counts.q15?.failed === 0 &&
    counts.q15?.review_required === 0 &&
    counts.q27?.failed === 0 &&
    counts.q27?.review_required === 0 &&
    report.bucket_totals?.failed === 0 &&
    report.bucket_totals?.review_required === (q19Closed ? 0 : 6);
  if (!package2State && !finalState) fail('report must be package-2 post-state 1/12 or final q27/q15 clean state 0/6');
  if (package2State) {
    requireText(reportText, 'step1_levy_equilibrium_repaired_step2_capacity_governance_blocker', 'report');
    requireText(reportText, 'q27-step-1 D41/D05/A88 reviewed equivalent accepted', 'report');
  } else {
    requireText(reportText, 'clean_after_q27_step2_capacity_taxonomy_reviewed_equivalent', 'report');
    requireText(reportText, 'clean_after_q15_two_step_answer_skill_reviewed_equivalent', 'report');
    if (q19Closed) requireText(reportText, 'clean_after_q19_final_resolution_reviewed_equivalent', 'report');
  }
  const staleFragments = finalState
    ? [
      'q27 closure',
      'q27 remains clean',
      'per-1,000-liter scaling missing',
    ]
    : [
    'q27 closure',
    '| q27 | 0 | 0 |',
    'q27 is clean',
    'q27 remains clean',
    'per-1,000-liter scaling missing',
    ];
  for (const stale of staleFragments) {
    if (reportText.includes(stale)) fail(`report must not include stale/overclaim text: ${stale}`);
  }
}

function requireUnits() {
  const units = readJson(MTUS);
  const byId = new Map(units.map((unit) => [unit.id, unit]));
  for (const id of ['D41', 'D05', 'A88', 'A98', 'D08', 'D07']) {
    if (!byId.get(id)) fail(`missing registry unit ${id}`);
  }
  requireText(`${byId.get('D41').kern} ${(byId.get('D41').procedure || []).join(' ')}`, 'belastingwig', 'D41 evidence');
  requireText(`${byId.get('D05').kern} ${(byId.get('D05').procedure || []).join(' ')}`, 'heffing', 'D05 evidence');
  requireText(`${byId.get('D08').kern} ${(byId.get('D08').procedure || []).join(' ')}`, 'elasticiteit', 'D08 overclaim evidence');
  requireText(`${byId.get('D07').kern} ${(byId.get('D07').procedure || []).join(' ')}`, 'percentage', 'D07 rejection evidence');
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

function requireRemoteDiscoverability(packet, gate) {
  const bundle = readText(GATE_BUNDLE);
  const urlIndex = readText(URL_INDEX);
  const agentMd = readText(AGENT_INDEX);
  const agentJson = readJson(AGENT_INDEX_JSON);
  const agentFiles = new Set(Object.values(agentJson.groups || {}).flat());
  const { owner, repo } = parseRepoFromPackageJson();
  const refs = new Set([
    ...(gate.must_review || []),
    ...(packet.source_evidence || []),
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

function requireMarkdown() {
  for (const [text, context] of [[readText(PACKAGE_MD), 'package markdown'], [readText(GATE_MD), 'gate markdown']]) {
    for (const needle of ['q27', '1 failed / 2 review_required', 'D41', 'D05', 'D08', 'student/product use']) {
      requireText(text, needle, context);
    }
  }
}

function main() {
  const packet = readJson(PACKAGE_JSON);
  const gate = readJson(GATE_JSON);
  requirePackage(packet, gate);
  requireFixtureShape(readJson(FIXTURE));
  requireValidatorState();
  requireReportState();
  requireUnits();
  requireMarkdown();
  requireChangedPaths();
  requireRemoteDiscoverability(packet, gate);
  console.log('OK MTU-H5 q27 incidence/levy-capacity package 2: option 2 executed, step2 held');
}

try {
  main();
} catch (error) {
  console.error(`MTU-H5 q27 incidence/levy-capacity package 2 check failed: ${error.message}`);
  process.exit(1);
}
