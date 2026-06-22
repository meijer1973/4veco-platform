#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const PACKAGE_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-procedure-semantic-fit-package-1.json');
const PACKAGE_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-procedure-semantic-fit-package-1.md');
const GATE_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-procedure-semantic-fit-execution-gate-1', 'review-packet.json');
const GATE_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-procedure-semantic-fit-execution-gate-1', 'review-packet.md');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const REPORT_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.json');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');
const UNIT_REGISTRY = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const FINAL_Q19_PACKAGE_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-final-resolution-and-closure-bundle-1.json');

const PACKAGE_ID = 'MTU-H5-Q19-PROCEDURE-SEMANTIC-FIT-PACKAGE-1';
const GATE_ID = 'GATE-MTU-H5-Q19-procedure-semantic-fit-execution-gate-1';
const PRE_PACKAGE_STATUS = 'prepared_for_subagent_lead_review_before_fixture_execution';
const PRE_GATE_STATUS = 'pending_subagent_lead_review';
const POST_STATUS = 'executed_after_subagent_lead_approval';
const Q19_RECORD_ID = 'vw-1022-a-25-1-o:opgave-4:question-19';
const ANSWER_REF = 'reports/mtu-hardening/mtu-h5-q19-answer-form-equivalent-execution-gate-1.json#EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION';

const EXPECTED_WRITE_SURFACE_FIELDS = [
  'q19-step-1.procedure_review_required_unit_ids',
  'q19-step-2.procedure_review_required_unit_ids',
  'q19-step-3.procedure_review_required_unit_ids',
];

const EXPECTED_ADMIN_GENERATED_PATHS = [
  'build-scripts/references/build-mtu-h5-regression-report.js',
  'build-scripts/references/check-mtu-h5-q19-answer-form-equivalent-execution-1.js',
  'build-scripts/references/check-mtu-h5-q19-answer-form-equivalent-execution-gate-1.js',
  'build-scripts/references/check-mtu-h5-q19-answer-form-gate-1.js',
  'build-scripts/references/check-mtu-h5-q19-procedure-semantic-fit-package-1.js',
  'build-scripts/references/check-mtu-h5-q19-source-graph-procedure-reasoning-gate-1.js',
  'reports/mtu-hardening/mtu-h5-q19-procedure-semantic-fit-package-1.json',
  'reports/mtu-hardening/mtu-h5-q19-procedure-semantic-fit-package-1.md',
  'reports/mtu-hardening/mtu-h5-regression-report.json',
  'reports/mtu-hardening/mtu-h5-regression-report.md',
  'reports/review-gates/GATE-MTU-H5-Q19-procedure-semantic-fit-execution-gate-1/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q19-procedure-semantic-fit-execution-gate-1/review-packet.md',
  'reports/review-gates/GATE-MTU-H5-Q19-procedure-semantic-fit-execution-gate-1/bundle-urls.md',
  'reports/github-agent-index-platform.json',
  'reports/github-agent-index-platform.md',
  'reports/url-index.md',
];

const ALLOWED_CHANGED_PATHS = [
  ...EXPECTED_ADMIN_GENERATED_PATHS,
  'reports/mtu-hardening/mtu-h5-regression-fixture.json',
  'build-scripts/references/check-mtu-h5-q19-source-graph-reasoning-package-1.js',
  'reports/mtu-hardening/mtu-h5-q19-source-graph-reasoning-package-1.json',
  'reports/mtu-hardening/mtu-h5-q19-source-graph-reasoning-package-1.md',
  'reports/review-gates/GATE-MTU-H5-Q19-source-graph-reasoning-package-1/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q19-source-graph-reasoning-package-1/review-packet.md',
  'reports/review-gates/GATE-MTU-H5-Q19-source-graph-reasoning-package-1/bundle-urls.md',
];

const FORBIDDEN_CHANGED_PATH_PATTERNS = [
  { label: 'machine reference', pattern: /^references\/machine\// },
  { label: 'external source', pattern: /^references\/external\// },
  { label: 'authored target exercise', pattern: /^references\/authored\/course-target-exercises\.json$/ },
  { label: 'source overlay', pattern: /^references\/data\/exam-ingestion\/source-annex-extraction-overlays\.json$/ },
  { label: 'candidate store', pattern: /(^|\/)(candidates?|candidate-store|candidate-storage|review-candidate)(\/|\.|$)/ },
  { label: 'lesson output', pattern: /(^|\/)(lesson-output|generated-lesson-output|student-output|output|outputs)(\/|\.|$)/ },
  { label: 'PV surface', pattern: /(^|\/)(pv|pv-g4-proof-records)(\/|\.|$)/ },
  { label: 'diagnostics/mastery/sequencing surface', pattern: /(^|\/)(diagnostics?|mastery|sequencing|adaptive-routing)(\/|\.|$)/ },
  { label: 'product route', pattern: /(^|\/)(product-routes?|routes)(\/|\.|$)/ },
  { label: 'student-facing surface', pattern: /(^|\/)(student-facing|student)(\/|\.|$)/ },
];

const EXPECTED_Q19_PROCEDURE_UNITS = {
  'q19-step-1': ['A42', 'D10', 'A81'],
  'q19-step-2': ['A42', 'D10', 'D13', 'A81'],
  'q19-step-3': ['A42', 'D10', 'D13', 'A81'],
};

const EXPECTED_Q19_REMAINING_HOOKS = {
  'q19-step-1': [
    'q19-source-annex-gap remains blocking',
    'q19-graph-object-gap remains blocking',
  ],
  'q19-step-2': [
    'q19 chained multi-market reasoning remains operation_registry_need with D10/D13 partial support',
  ],
  'q19-step-3': [
    'q19-source-annex-gap remains blocking',
    'q19-graph-object-gap remains blocking',
    'q19 third graph-shift element is now modeled but still depends on blocked graph/source reconstruction',
  ],
};

const EXPECTED_Q19_REMAINING_ASSERTIONS = Object.entries(EXPECTED_Q19_REMAINING_HOOKS)
  .flatMap(([operationId, hooks]) => hooks.map((hook) => `${Q19_RECORD_ID}:${operationId}:ASSERT-REVIEW-${hook}`));

const EXPECTED_Q19_PROCEDURE_ASSERTIONS = Object.entries(EXPECTED_Q19_PROCEDURE_UNITS)
  .flatMap(([operationId, unitIds]) => unitIds.map((unitId) => `${Q19_RECORD_ID}:${operationId}:ASSERT-PROCEDURE-REVIEW-${unitId}`));

const FALSE_AUTHORITY_KEYS = [
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
  'mapper_repair_authorized',
  'lesson_output_mutation_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'sequencing_authorized',
  'student_facing_ai_authorized',
  'summative_use_authorized',
  'pv_projection_authorized',
  'student_product_use_authorized',
  'product_route_readiness_claimed',
  'q19_closure_claimed',
  'mtu_h5_closure_claimed',
];

function fail(message) {
  console.error(`MTU-H5 q19 procedure semantic-fit package 1 check failed: ${message}`);
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
  if (!fs.existsSync(FINAL_Q19_PACKAGE_JSON) || !fs.existsSync(REPORT_JSON)) return false;
  const report = readJson(REPORT_JSON);
  return report.status === 'passed' &&
    report.question_bucket_counts?.q19?.failed === 0 &&
    report.question_bucket_counts?.q19?.review_required === 0 &&
    report.bucket_totals?.failed === 0 &&
    report.bucket_totals?.review_required === 0;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function requireIncludes(values, value, context) {
  if (!Array.isArray(values) || !values.includes(value)) fail(`${context} must include ${value}`);
}

function requireIncludesAll(values, required, context) {
  for (const value of required) requireIncludes(values, value, context);
}

function requireTextIncludes(text, value, context) {
  if (!text.includes(value)) fail(`${context} must include ${value}`);
}

function sameSet(actual, expected, context) {
  const left = [...actual].sort();
  const right = [...expected].sort();
  if (JSON.stringify(left) !== JSON.stringify(right)) {
    fail(`${context} mismatch: expected ${JSON.stringify(right)}, got ${JSON.stringify(left)}`);
  }
}

function q19Record(fixture) {
  const record = asArray(fixture.records).find((item) => item.record_id === Q19_RECORD_ID);
  if (!record) fail('fixture missing q19 record');
  return record;
}

function q19Operation(fixture, operationId) {
  const operation = asArray(q19Record(fixture).official_correction_model_operations)
    .find((item) => item.operation_id === operationId);
  if (!operation) fail(`fixture missing ${operationId}`);
  return operation;
}

function runValidator(fixturePath = FIXTURE) {
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

function assertionIds(result, bucket) {
  return asArray(result.buckets?.[bucket]).map((item) => item.assertion_id);
}

function q19Items(result, bucket) {
  return asArray(result.buckets?.[bucket]).filter((item) => item.record_id === Q19_RECORD_ID);
}

function git(args) {
  return spawnSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function gitOutput(args, context) {
  const run = git(args);
  if (run.status !== 0) fail(`${context}: ${(run.stderr || run.stdout || '').trim()}`);
  return run.stdout;
}

function determinePhase(packet, gate) {
  if (packet.status === PRE_PACKAGE_STATUS && gate.status === PRE_GATE_STATUS) return 'pre';
  if (packet.status === POST_STATUS && gate.status === POST_STATUS) return 'post';
  fail(`package/gate status mismatch: ${packet.status} / ${gate.status}`);
}

function requirePackage(packet, gate) {
  if (packet.schema_version !== 1) fail('package schema_version must be 1');
  if (packet.package_id !== PACKAGE_ID) fail('package_id mismatch');
  if (packet.execution_gate_id !== GATE_ID) fail('package execution_gate_id mismatch');
  if (gate.schema_version !== 1) fail('gate schema_version must be 1');
  if (gate.gate_id !== GATE_ID) fail('gate_id mismatch');
  if (gate.package_id !== PACKAGE_ID) fail('gate package_id mismatch');

  const phase = determinePhase(packet, gate);
  if (phase === 'pre') {
    if (packet.subagent_lead_review?.lead_verdict !== 'pending') fail('package lead verdict must be pending before execution');
    if (gate.subagent_lead_review?.lead_verdict !== 'pending') fail('gate lead verdict must be pending before execution');
  } else {
    if (packet.subagent_lead_review?.lead_verdict !== 'APPROVE_EXECUTION') fail('package lead verdict must approve execution');
    if (gate.subagent_lead_review?.lead_verdict !== 'APPROVE_EXECUTION') fail('gate lead verdict must approve execution');
    for (const role of ['teacher', 'economist', 'quality']) {
      if (packet.subagent_lead_review?.[`${role}_verdict`] !== 'MORE_THAN_SATISFIED') {
        fail(`package ${role} verdict must be MORE_THAN_SATISFIED`);
      }
      if (gate.subagent_lead_review?.[`${role}_verdict`] !== 'MORE_THAN_SATISFIED') {
        fail(`gate ${role} verdict must be MORE_THAN_SATISFIED`);
      }
    }
  }

  const writeSurface = packet.exact_write_surface || {};
  if (writeSurface.path !== rel(FIXTURE)) fail('package write surface path mismatch');
  if (writeSurface.record_id !== Q19_RECORD_ID) fail('package write surface record_id mismatch');
  sameSet(writeSurface.fields || [], EXPECTED_WRITE_SURFACE_FIELDS, 'package write surface fields');
  if (JSON.stringify(writeSurface.new_value_for_each_field) !== '[]') fail('write surface new value must be []');

  sameSet(packet.administrative_and_generated_write_surface?.paths || [], EXPECTED_ADMIN_GENERATED_PATHS, 'package administrative/generated write surface paths');
  sameSet(gate.administrative_and_generated_write_surface?.paths || [], EXPECTED_ADMIN_GENERATED_PATHS, 'gate administrative/generated write surface paths');

  for (const container of [packet, gate]) {
    if (container.authority_boundary?.fixture_mutation_authorized_if_subagent_lead_approves !== true) {
      fail('fixture mutation must be authorized only through subagent lead approval');
    }
    for (const key of FALSE_AUTHORITY_KEYS) {
      if (container.authority_boundary?.[key] !== false) fail(`${key} must be false`);
    }
  }
}

function requireFixtureShape(fixture, phase) {
  const record = q19Record(fixture);
  sameSet(record.mapped_mtu_ids || [], ['A42', 'D10', 'D13', 'A81'], 'q19 mapped_mtu_ids');
  if ((record.mapped_mtu_ids || []).includes('A45')) fail('q19 mapped_mtu_ids must not include A45');

  for (const [operationId, expectedUnits] of Object.entries(EXPECTED_Q19_PROCEDURE_UNITS)) {
    const operation = q19Operation(fixture, operationId);
    sameSet(operation.expected_procedure_unit_ids || [], expectedUnits, `${operationId}.expected_procedure_unit_ids`);
    sameSet(operation.expected_required_mtu_ids || [], expectedUnits, `${operationId}.expected_required_mtu_ids`);
    const expectedProcedureReviewUnits = phase === 'post' ? [] : expectedUnits;
    sameSet(operation.procedure_review_required_unit_ids || [], expectedProcedureReviewUnits, `${operationId}.procedure_review_required_unit_ids`);
    requireRemainingHooksOnFixture(fixture);
    requireIncludes(operation.expected_forbidden_mtu_ids || [], 'A45', `${operationId}.expected_forbidden_mtu_ids`);
    requireIncludesAll(operation.expected_forbidden_route_tags || [], [
      'full_graph_construction',
      'calculus_route',
      'function_construction',
    ], `${operationId}.expected_forbidden_route_tags`);
    if (operation.missing_answer_form_expected !== false) fail(`${operationId}.missing_answer_form_expected must remain false`);
    sameSet(operation.answer_form_reviewed_equivalent_refs || [], [ANSWER_REF], `${operationId}.answer_form_reviewed_equivalent_refs`);
  }
}

function requireRemainingHooksOnFixture(fixture) {
  for (const [operationId, expectedHooks] of Object.entries(EXPECTED_Q19_REMAINING_HOOKS)) {
    const operation = q19Operation(fixture, operationId);
    sameSet(operation.review_required_hooks || [], expectedHooks, `${operationId}.review_required_hooks`);
  }
}

function requireRegistryProcedures() {
  const registry = readJson(UNIT_REGISTRY);
  const units = new Map((registry.units || registry).map((unit) => [unit.id, unit]));
  for (const unitId of ['A42', 'D10', 'D13', 'A81']) {
    const unit = units.get(unitId);
    if (!unit) fail(`unit registry missing ${unitId}`);
    if (!['apply', 'analyze', 'analyse'].includes(String(unit.mastery_target || '').toLowerCase())) {
      fail(`${unitId} mastery target must require procedure`);
    }
    if (!Array.isArray(unit.procedure) || unit.procedure.length === 0) fail(`${unitId} must have canonical procedure`);
  }
}

function requireReportAndValidator(phase) {
  const report = readJson(REPORT_JSON);
  const counts = report.question_bucket_counts || {};
  const expectedQ19ReviewRequired = phase === 'post' ? 6 : 17;
  const expectedOverallReviewRequired = phase === 'post' ? 15 : 26;
  if (counts.q3?.failed !== 0 || counts.q3?.review_required !== 0) fail('q3 must remain 0/0');
  if (counts.q19?.failed !== 0 || counts.q19?.review_required !== expectedQ19ReviewRequired) {
    fail(`q19 report counts must be 0/${expectedQ19ReviewRequired}`);
  }
  if (counts.q27?.failed !== 3 || counts.q27?.review_required !== 5) fail('q27 report counts must remain 3/5');
  if (counts.q15?.failed !== 0 || counts.q15?.review_required !== 4) fail('q15 report counts must remain 0/4');
  if (report.bucket_totals?.failed !== 3 || report.bucket_totals?.review_required !== expectedOverallReviewRequired) {
    fail(`overall report counts must be 3 failed / ${expectedOverallReviewRequired} review_required`);
  }

  const result = runValidator();
  if (q19Items(result, 'failed').length !== 0) fail('q19 failed bucket must remain empty');
  const expectedQ19Assertions = phase === 'post'
    ? EXPECTED_Q19_REMAINING_ASSERTIONS
    : [...EXPECTED_Q19_PROCEDURE_ASSERTIONS, ...EXPECTED_Q19_REMAINING_ASSERTIONS];
  sameSet(q19Items(result, 'review_required').map((item) => item.assertion_id), expectedQ19Assertions, 'q19 review_required assertions');
  if (phase === 'post') {
    for (const id of EXPECTED_Q19_PROCEDURE_ASSERTIONS) {
      if (assertionIds(result, 'review_required').includes(id)) fail(`procedure assertion must be cleared: ${id}`);
    }
  }
  const q19ProcedureChecks = asArray(result.procedure_checks).filter((item) => item.record_id === Q19_RECORD_ID);
  if (q19ProcedureChecks.length !== 11) fail('q19 must still have 11 procedure checks');
  for (const item of q19ProcedureChecks) {
    const expectedStatus = phase === 'post' ? 'procedure_present' : 'procedure_review_required';
    if (item.status !== expectedStatus) fail(`${item.operation_id}/${item.unit_id} must be ${expectedStatus}`);
  }
}

function requireFixtureDiffWhitelist(phase) {
  const baseText = gitOutput(['show', `origin/main:${rel(FIXTURE)}`], 'read origin/main fixture');
  const baseFixture = JSON.parse(baseText);
  const currentFixture = readJson(FIXTURE);
  const expectedFixture = JSON.parse(JSON.stringify(baseFixture));
  if (phase === 'post') {
    for (const operationId of Object.keys(EXPECTED_Q19_PROCEDURE_UNITS)) {
      q19Operation(expectedFixture, operationId).procedure_review_required_unit_ids = [];
    }
  }
  if (JSON.stringify(currentFixture) !== JSON.stringify(expectedFixture)) {
    fail(`fixture diff must be limited to q19 procedure_review_required_unit_ids for ${phase} phase`);
  }

  const changed = new Set([
    ...gitOutput(['diff', '--name-only', '--diff-filter=ACMRT', 'origin/main...HEAD'], 'read committed changed paths')
      .split(/\r?\n/).filter(Boolean),
    ...gitOutput(['diff', '--name-only', '--diff-filter=ACMRT'], 'read unstaged changed paths')
      .split(/\r?\n/).filter(Boolean),
    ...gitOutput(['diff', '--cached', '--name-only', '--diff-filter=ACMRT'], 'read staged changed paths')
      .split(/\r?\n/).filter(Boolean),
    ...gitOutput(['ls-files', '--others', '--exclude-standard'], 'read untracked changed paths')
      .split(/\r?\n/).filter(Boolean),
  ]);
  for (const file of changed) {
    if (!ALLOWED_CHANGED_PATHS.includes(file)) {
      fail(`changed path is outside q19 procedure package write surface: ${file}`);
    }
    for (const forbidden of FORBIDDEN_CHANGED_PATH_PATTERNS) {
      if (forbidden.pattern.test(file)) fail(`${forbidden.label} path changed: ${file}`);
    }
  }
}

function writeTempFixture(fixture, label) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `mtu-h5-${label}-`));
  const file = path.join(dir, 'fixture.json');
  fs.writeFileSync(file, JSON.stringify(fixture, null, 2));
  return { dir, file };
}

function requireProcedureReintroductionNegative(baseFixture) {
  const clone = JSON.parse(JSON.stringify(baseFixture));
  for (const [operationId, unitIds] of Object.entries(EXPECTED_Q19_PROCEDURE_UNITS)) {
    q19Operation(clone, operationId).procedure_review_required_unit_ids = [...unitIds];
  }
  const temp = writeTempFixture(clone, 'q19-procedure-reintro');
  try {
    const result = runValidator(temp.file);
    for (const id of EXPECTED_Q19_PROCEDURE_ASSERTIONS) {
      requireIncludes(assertionIds(result, 'review_required'), id, 'reintroduced q19 procedure assertions');
    }
  } finally {
    fs.rmSync(temp.dir, { recursive: true, force: true });
  }
}

function requirePrematureClosureNegative(baseFixture) {
  const clone = JSON.parse(JSON.stringify(baseFixture));
  for (const operationId of Object.keys(EXPECTED_Q19_PROCEDURE_UNITS)) {
    const operation = q19Operation(clone, operationId);
    operation.procedure_review_required_unit_ids = [];
    operation.review_required_hooks = [];
  }
  const rejected = Object.entries(EXPECTED_Q19_REMAINING_HOOKS).some(([operationId, expectedHooks]) => {
    const actual = [...asArray(q19Operation(clone, operationId).review_required_hooks)].sort();
    const expected = [...expectedHooks].sort();
    return JSON.stringify(actual) !== JSON.stringify(expected);
  });
  if (!rejected) fail('premature closure negative clone must be rejected by remaining-hook guard');
}

function requireA45Negative(baseFixture) {
  const clone = JSON.parse(JSON.stringify(baseFixture));
  const record = q19Record(clone);
  if (!record.mapped_mtu_ids.includes('A45')) record.mapped_mtu_ids.push('A45');
  for (const operation of record.official_correction_model_operations) {
    if (!operation.mapped_mtu_ids.includes('A45')) operation.mapped_mtu_ids.push('A45');
  }
  const temp = writeTempFixture(clone, 'q19-a45');
  try {
    const result = runValidator(temp.file);
    for (const operationId of Object.keys(EXPECTED_Q19_PROCEDURE_UNITS)) {
      requireIncludes(assertionIds(result, 'failed'), `${Q19_RECORD_ID}:${operationId}:ASSERT-OVER-TRIGGER`, 'A45 negative failed assertions');
    }
  } finally {
    fs.rmSync(temp.dir, { recursive: true, force: true });
  }
}

function requireMarkdown() {
  for (const [file, label] of [[PACKAGE_MD, 'package markdown'], [GATE_MD, 'gate markdown']]) {
    const text = readText(file);
    for (const required of [
      'approve_exact_procedure_semantic_fit_execution_gate',
      'q19',
      '0 | 6',
      'A42',
      'D10',
      'D13',
      'A81',
      'A45',
      'student/product use',
    ]) {
      requireTextIncludes(text, required, label);
    }
  }
}

function main() {
  if (q19FinalClosureActive()) {
    console.log('OK MTU-H5 q19 procedure semantic-fit package 1: historical package superseded by final q19 closure');
    return;
  }

  const packet = readJson(PACKAGE_JSON);
  const gate = readJson(GATE_JSON);
  const fixture = readJson(FIXTURE);
  const phase = determinePhase(packet, gate);

  requirePackage(packet, gate);
  requireFixtureShape(fixture, phase);
  requireFixtureDiffWhitelist(phase);
  requireRegistryProcedures();
  requireReportAndValidator(phase);
  requireProcedureReintroductionNegative(fixture);
  requirePrematureClosureNegative(fixture);
  requireA45Negative(fixture);
  requireMarkdown();

  if (phase === 'post') {
    console.log('OK MTU-H5 q19 procedure semantic-fit package 1: q19 0 failed / 6 review_required; procedure hooks cleared');
  } else {
    console.log('OK MTU-H5 q19 procedure semantic-fit package 1: ready for subagent lead review; q19 remains 0 failed / 17 review_required');
  }
}

main();
