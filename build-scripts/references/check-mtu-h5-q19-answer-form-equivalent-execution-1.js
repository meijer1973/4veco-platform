#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const GATE_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-answer-form-equivalent-execution-gate-1.json');
const GATE_REVIEW = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-answer-form-equivalent-execution-gate-1', 'review-packet.json');
const REGRESSION_REPORT_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.json');
const REGRESSION_REPORT_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.md');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');
const PROCEDURE_PACKAGE_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-procedure-semantic-fit-package-1.json');
const PROCEDURE_GATE_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-procedure-semantic-fit-execution-gate-1', 'review-packet.json');
const FINAL_Q19_PACKAGE_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-final-resolution-and-closure-bundle-1.json');

const Q3_RECORD_ID = 'vw-1022-a-25-1-o:opgave-1:question-3';
const Q15_RECORD_ID = 'vw-1022-a-25-1-o:opgave-3:question-15';
const Q19_RECORD_ID = 'vw-1022-a-25-1-o:opgave-4:question-19';
const Q27_RECORD_ID = 'vw-1022-a-25-2-o:opgave-6:question-27';
const Q19_STEPS = ['q19-step-1', 'q19-step-2', 'q19-step-3'];
const ANSWER_REF = 'reports/mtu-hardening/mtu-h5-q19-answer-form-equivalent-execution-gate-1.json#EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION';
const ANSWER_HOOK = 'graph/draw/teken answer-form MTU or reviewed equivalent still needed';
const FORBIDDEN_ROUTE_TAGS = ['full_graph_construction', 'calculus_route', 'function_construction'];

const EXPECTED_COUNTS = {
  q3: { failed: 0, review_required: 0 },
  q19: { failed: 0, review_required: 17 },
  q27: { failed: 3, review_required: 5 },
  q15: { failed: 0, review_required: 4 },
  overall: { failed: 3, review_required: 26 },
};

const REQUIRED_REMAINING_HOOKS = new Map([
  ['q19-step-1', ['q19-source-annex-gap remains blocking', 'q19-graph-object-gap remains blocking']],
  ['q19-step-2', ['q19 chained multi-market reasoning remains operation_registry_need with D10/D13 partial support']],
  ['q19-step-3', [
    'q19-source-annex-gap remains blocking',
    'q19-graph-object-gap remains blocking',
    'q19 third graph-shift element is now modeled but still depends on blocked graph/source reconstruction',
  ]],
]);

function fail(message) {
  console.error(`MTU-H5 q19 answer-form equivalent execution 1 check failed: ${message}`);
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

function q19FinalClosureActive() {
  if (!fs.existsSync(FINAL_Q19_PACKAGE_JSON) || !fs.existsSync(REGRESSION_REPORT_JSON)) return false;
  const report = readJson(REGRESSION_REPORT_JSON);
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
  if (!record) fail(`fixture missing record: ${recordId}`);
  return record;
}

function findOperation(record, operationId) {
  const operation = (record.official_correction_model_operations || []).find((item) => item.operation_id === operationId);
  if (!operation) fail(`${record.record_id} missing operation ${operationId}`);
  return operation;
}

function requireIncludes(values, value, context) {
  if (!Array.isArray(values) || !values.includes(value)) fail(`${context} must include ${value}`);
}

function requireExcludes(values, value, context) {
  if (Array.isArray(values) && values.includes(value)) fail(`${context} must not include ${value}`);
}

function requireExactSingleRef(values, context) {
  if (!Array.isArray(values) || values.length !== 1 || values[0] !== ANSWER_REF) {
    fail(`${context} must be exactly [${ANSWER_REF}]`);
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
    fail(`${rel(H5_VALIDATOR)} failed`);
  }
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    fail(`MTU-H5 validator did not emit JSON: ${error.message}`);
  }
}

function countForRecord(result, bucket, recordId) {
  return (result.buckets?.[bucket] || []).filter((item) => item.record_id === recordId).length;
}

function requireCounts(result, label, expected = EXPECTED_COUNTS) {
  const actual = {
    q3: {
      failed: countForRecord(result, 'failed', Q3_RECORD_ID),
      review_required: countForRecord(result, 'review_required', Q3_RECORD_ID),
    },
    q19: {
      failed: countForRecord(result, 'failed', Q19_RECORD_ID),
      review_required: countForRecord(result, 'review_required', Q19_RECORD_ID),
    },
    q27: {
      failed: countForRecord(result, 'failed', Q27_RECORD_ID),
      review_required: countForRecord(result, 'review_required', Q27_RECORD_ID),
    },
    q15: {
      failed: countForRecord(result, 'failed', Q15_RECORD_ID),
      review_required: countForRecord(result, 'review_required', Q15_RECORD_ID),
    },
    overall: {
      failed: result.buckets.failed.length,
      review_required: result.buckets.review_required.length,
    },
  };
  for (const [surface, counts] of Object.entries(expected)) {
    for (const [bucket, value] of Object.entries(counts)) {
      if (actual[surface][bucket] !== value) {
        fail(`${label} ${surface}.${bucket} expected ${value}, got ${actual[surface][bucket]}`);
      }
    }
  }
}

function q19ProcedurePackageExecuted() {
  if (!fs.existsSync(PROCEDURE_PACKAGE_JSON)) return false;
  const packet = readJson(PROCEDURE_PACKAGE_JSON);
  if (packet.status !== 'executed_after_subagent_lead_approval') return false;
  const gate = readJson(PROCEDURE_GATE_JSON);
  if (gate.status !== 'executed_after_subagent_lead_approval') {
    fail('q19 procedure package is executed but gate packet is not');
  }
  if (packet.subagent_lead_review?.lead_verdict !== 'APPROVE_EXECUTION' ||
      gate.subagent_lead_review?.lead_verdict !== 'APPROVE_EXECUTION') {
    fail('q19 procedure package execution must have lead approval');
  }
  return true;
}

function currentExpectedCounts() {
  const expected = JSON.parse(JSON.stringify(EXPECTED_COUNTS));
  if (q19ProcedurePackageExecuted()) {
    expected.q19.review_required = 6;
    expected.overall.review_required = 15;
  }
  return expected;
}

function requireApprovalContinuity() {
  const packet = readJson(GATE_PACKET);
  const review = readJson(GATE_REVIEW);
  const plan = packet.future_exact_write_plan || {};
  if (plan.target_surface !== 'reports/mtu-hardening/mtu-h5-regression-fixture.json') fail('gate plan target surface mismatch');
  if (plan.target_record_id !== Q19_RECORD_ID) fail('gate plan target record mismatch');
  if (plan.reviewed_equivalent_ref_to_add !== ANSWER_REF) fail('gate plan reviewed equivalent ref mismatch');
  if ((plan.operation_updates || []).length !== 3) fail('gate plan must contain exactly three q19 operation updates');
  for (const step of Q19_STEPS) {
    const update = plan.operation_updates.find((item) => item.operation_id === step);
    if (!update) fail(`gate plan missing update for ${step}`);
    requireExactSingleRef(update.add_fields?.answer_form_reviewed_equivalent_refs, `${step}.add_fields.answer_form_reviewed_equivalent_refs`);
    if (update.update_fields?.missing_answer_form_expected !== false) fail(`${step}.missing_answer_form_expected approval mismatch`);
    requireIncludes(update.remove_review_required_hooks || [], ANSWER_HOOK, `${step}.remove_review_required_hooks`);
  }
  requireIncludes(
    review.requested_decision?.valid_decisions || [],
    'approve_later_exact_answer_form_equivalent_execution_pr',
    'review packet valid_decisions'
  );
  if (review.requested_decision?.execution_authorized_by_this_packet !== false) {
    fail('review packet must not authorize execution by itself');
  }
  if (review.requested_decision?.fixture_mutation_authorized_by_this_packet !== false) {
    fail('review packet must not mutate the fixture by itself');
  }
}

function requireFixturePostState(fixture) {
  const q19 = findRecord(fixture, Q19_RECORD_ID);
  for (const step of Q19_STEPS) {
    const operation = findOperation(q19, step);
    requireExactSingleRef(operation.answer_form_reviewed_equivalent_refs, `${step}.answer_form_reviewed_equivalent_refs`);
    if (operation.missing_answer_form_expected !== false) fail(`${step}.missing_answer_form_expected must be false`);
    requireExcludes(operation.review_required_hooks || [], ANSWER_HOOK, `${step}.review_required_hooks`);
    for (const hook of REQUIRED_REMAINING_HOOKS.get(step)) {
      requireIncludes(operation.review_required_hooks || [], hook, `${step}.review_required_hooks`);
    }
    requireIncludes(operation.expected_forbidden_mtu_ids || [], 'A45', `${step}.expected_forbidden_mtu_ids`);
    requireExcludes(operation.mapped_mtu_ids || [], 'A45', `${step}.mapped_mtu_ids`);
    for (const routeTag of FORBIDDEN_ROUTE_TAGS) {
      requireIncludes(operation.expected_forbidden_route_tags || [], routeTag, `${step}.expected_forbidden_route_tags`);
    }
    if ((operation.expected_answer_form_mtu_ids || []).length !== 0) fail(`${step}.expected_answer_form_mtu_ids must remain empty`);
  }
}

function requireRegressionReport() {
  const procedurePackageExecuted = q19ProcedurePackageExecuted();
  const expectedQ19ReviewRequired = procedurePackageExecuted ? 6 : 17;
  const expectedStatus = procedurePackageExecuted
    ? 'source_graph_reasoning_review_blocker'
    : 'source_graph_procedure_reasoning_review_blocker';
  const expectedBlockerText = procedurePackageExecuted
    ? 'q19 remains a source/graph/reasoning review blocker: 0 failed / 6 review_required'
    : 'q19 remains a source/graph/procedure/reasoning review blocker: 0 failed / 17 review_required';
  const report = readJson(REGRESSION_REPORT_JSON);
  const reportMd = readText(REGRESSION_REPORT_MD);
  if (report.question_bucket_counts?.q19?.failed !== 0) fail('report q19 failed count must be 0');
  if (report.question_bucket_counts?.q19?.review_required !== expectedQ19ReviewRequired) {
    fail(`report q19 review_required count must be ${expectedQ19ReviewRequired}`);
  }
  if (report.remaining_lane_status?.q19?.status !== expectedStatus) {
    fail('report q19 lane status must reflect post-answer-form execution state');
  }
  for (const text of [
    `q19 | 0 | ${expectedQ19ReviewRequired} | ${expectedStatus}`,
    expectedBlockerText,
    'answer-form equivalent accepted by PR #80',
  ]) {
    if (!reportMd.includes(text)) fail(`report markdown must include ${text}`);
  }
  if (procedurePackageExecuted && reportMd.includes('A42/D10/D13/A81 procedure semantic-fit review')) {
    fail('report markdown must not claim q19 procedure semantic-fit review after procedure package execution');
  }
  for (const stale of ['3 failed / 20 review_required', 'graph/draw/teken answer-form gap']) {
    if (reportMd.includes(stale)) fail(`report markdown must not include stale q19 text: ${stale}`);
  }
}

function requireNegativeAnswerFormRegression(fixture) {
  const clone = JSON.parse(JSON.stringify(fixture));
  const q19 = findRecord(clone, Q19_RECORD_ID);
  for (const step of Q19_STEPS) {
    const operation = findOperation(q19, step);
    delete operation.answer_form_reviewed_equivalent_refs;
    operation.missing_answer_form_expected = true;
    if (!(operation.review_required_hooks || []).includes(ANSWER_HOOK)) {
      operation.review_required_hooks = [...(operation.review_required_hooks || []), ANSWER_HOOK];
    }
  }
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mtu-h5-q19-answer-form-negative-'));
  const tempFixture = path.join(tempDir, 'fixture.json');
  fs.writeFileSync(tempFixture, `${JSON.stringify(clone, null, 2)}\n`, 'utf8');
  const result = runH5Validator(tempFixture);
  const q19Failed = countForRecord(result, 'failed', Q19_RECORD_ID);
  const q19Review = countForRecord(result, 'review_required', Q19_RECORD_ID);
  const expectedQ19Review = q19ProcedurePackageExecuted() ? 9 : 20;
  if (q19Failed !== 3 || q19Review !== expectedQ19Review) {
    fail(`negative answer-form regression must restore q19 3 failed / ${expectedQ19Review} review_required, got ${q19Failed} / ${q19Review}`);
  }
}

function main() {
  if (q19FinalClosureActive()) {
    console.log('OK MTU-H5 q19 answer-form equivalent execution 1: historical checker superseded by final q19 closure');
    return;
  }

  requireApprovalContinuity();
  const fixture = readJson(FIXTURE);
  requireFixturePostState(fixture);
  const result = runH5Validator();
  requireCounts(result, 'current fixture', currentExpectedCounts());
  requireRegressionReport();
  requireNegativeAnswerFormRegression(fixture);
  const expected = currentExpectedCounts();
  console.log(`OK MTU-H5 q19 answer-form equivalent execution 1: q19 0 failed / ${expected.q19.review_required} review_required; q27/q15 carried`);
}

main();
