#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  ValidationError,
  validateSourceExtractionDocument,
} = require('./lib/exam-ingestion-candidate-validation');
const {
  buildRawReferenceUrl,
  buildRawUrl,
  parseRepoFromPackageJson,
} = require('../sprints/emit-gate-bundle-urls.js');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-source-graph-procedure-reasoning-gate-1.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-source-graph-procedure-reasoning-gate-1.md');
const GATE_DIR = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-source-graph-procedure-reasoning-gate-1');
const GATE_JSON = path.join(GATE_DIR, 'review-packet.json');
const GATE_MD = path.join(GATE_DIR, 'review-packet.md');
const GATE_BUNDLE = path.join(GATE_DIR, 'bundle-urls.md');
const URL_INDEX = path.join(ROOT, 'reports', 'url-index.md');
const AGENT_INDEX = path.join(ROOT, 'reports', 'github-agent-index-platform.md');
const AGENT_INDEX_JSON = path.join(ROOT, 'reports', 'github-agent-index-platform.json');
const PROCEDURE_PACKAGE_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-procedure-semantic-fit-package-1.json');
const PROCEDURE_GATE_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-Q19-procedure-semantic-fit-execution-gate-1', 'review-packet.json');
const FINAL_Q19_PACKAGE_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-final-resolution-and-closure-bundle-1.json');

const REGRESSION_REPORT_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.json');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');
const SOURCE_OVERLAY = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'source-annex-extraction-overlays.json');
const UNIT_REGISTRY = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');

const EXPECTED_GATE = 'GATE-MTU-H5-Q19-source-graph-procedure-reasoning-gate-1';
const EXPECTED_PACKET = 'MTU-H5-Q19-source-graph-procedure-reasoning-gate-1';
const REVIEW_BRANCH = 'codex/mtu-h5-q19-source-graph-procedure-reasoning-gate-1-20260617';
const START_COMMIT = '43b375a3325638983bf55d65714b1c62f1fae843';
const PR69_MERGE = '6c207a758f2278eece39feb8ef757106c4bffa01';
const PR81_MERGE = 'f4931bf347cf92f94bee427c43199253e61a420c';
const Q19_RECORD_ID = 'vw-1022-a-25-1-o:opgave-4:question-19';
const Q3_RECORD_ID = 'vw-1022-a-25-1-o:opgave-1:question-3';
const ANSWER_REF = 'reports/mtu-hardening/mtu-h5-q19-answer-form-equivalent-execution-gate-1.json#EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION';
const AGGREGATE_SUPPLY_CAVEAT =
  'Correct aggregate-supply shifts for q19-step-2 and q19-step-3 are accepted as an alternative in the official correction model.';

const GRAPH_IDS = [
  'EX_SRC_Q19_CURACAO_LABOR_MARKET_GRAPH',
  'EX_SRC_Q19_CURACAO_GOODS_MARKET_GRAPH',
  'EX_SRC_Q19_ARUBA_GOODS_MARKET_GRAPH',
];

const SOURCE_IDS = [
  'EX_SRC_Q19_SOURCE_FIGURE',
  'EX_SRC_Q19_UITWERKBIJLAGE',
];

const EXPECTED_Q19_REVIEW_ASSERTIONS = [
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-1:ASSERT-PROCEDURE-REVIEW-A42',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-1:ASSERT-PROCEDURE-REVIEW-D10',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-1:ASSERT-PROCEDURE-REVIEW-A81',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-1:ASSERT-REVIEW-q19-source-annex-gap remains blocking',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-1:ASSERT-REVIEW-q19-graph-object-gap remains blocking',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-2:ASSERT-PROCEDURE-REVIEW-A42',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-2:ASSERT-PROCEDURE-REVIEW-D10',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-2:ASSERT-PROCEDURE-REVIEW-D13',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-2:ASSERT-PROCEDURE-REVIEW-A81',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-2:ASSERT-REVIEW-q19 chained multi-market reasoning remains operation_registry_need with D10/D13 partial support',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-3:ASSERT-PROCEDURE-REVIEW-A42',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-3:ASSERT-PROCEDURE-REVIEW-D10',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-3:ASSERT-PROCEDURE-REVIEW-D13',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-3:ASSERT-PROCEDURE-REVIEW-A81',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-3:ASSERT-REVIEW-q19-source-annex-gap remains blocking',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-3:ASSERT-REVIEW-q19-graph-object-gap remains blocking',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-3:ASSERT-REVIEW-q19 third graph-shift element is now modeled but still depends on blocked graph/source reconstruction',
];

const EXPECTED_Q19_POST_PROCEDURE_REVIEW_ASSERTIONS = EXPECTED_Q19_REVIEW_ASSERTIONS
  .filter((assertionId) => !assertionId.includes(':ASSERT-PROCEDURE-REVIEW-'));

const FORBIDDEN_Q19_ANSWER_FORM_ASSERTIONS = [
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-1:ASSERT-ANSWER-FORM-MISSING',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-2:ASSERT-ANSWER-FORM-MISSING',
  'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-3:ASSERT-ANSWER-FORM-MISSING',
];

const FORBIDDEN_ROUTE_TAGS = [
  'full_graph_construction',
  'calculus_route',
  'function_construction',
];

const REQUIRED_UNITS = ['A42', 'D10', 'D13', 'A81'];

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
  'source_overlay_mutation_authorized',
  'fixture_mutation_authorized',
  'mapper_repair_authorized',
  'lesson_output_mutation_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'sequencing_authorized',
  'student_facing_ai_authorized',
  'summative_use_authorized',
  'pv_projection_authorized',
  'pv_machine_promotion_authorized',
  'pv_graph_mutation_authorized',
  'target_exercise_promotion_authorized',
  'student_product_use_authorized',
  'product_route_readiness_claimed',
  'q19_closure_claimed',
  'mtu_h5_closure_claimed',
  'execution_authorized_now',
];

const REQUIRED_VALIDATION_COMMANDS = [
  'node --check build-scripts/references/check-mtu-h5-q19-source-graph-procedure-reasoning-gate-1.js',
  'node build-scripts/references/check-mtu-h5-q19-source-graph-procedure-reasoning-gate-1.js',
  'node build-scripts/references/check-mtu-h5-q19-answer-form-equivalent-execution-1.js',
  'node build-scripts/references/build-mtu-h5-regression-report.js --check',
  'node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --expect-fail --json',
  'node build-scripts/reports/validate-report-json.js',
  'node build-scripts/sprints/emit-url-index.js --check',
  'npm run agent:index',
  'npm run check:platform',
];

function fail(message) {
  console.error(`MTU-H5 q19 source/graph/procedure/reasoning gate 1 check failed: ${message}`);
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

function git(args) {
  return spawnSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function requireGitSuccess(args, message) {
  const run = git(args);
  if (run.status !== 0) fail(`${message}: ${(run.stderr || run.stdout || '').trim()}`);
}

function runH5Validator(fixturePath = FIXTURE) {
  const fixtureArg = path.isAbsolute(fixturePath) ? fixturePath : rel(fixturePath);
  const run = spawnSync(process.execPath, [
    rel(H5_VALIDATOR),
    '--fixture',
    fixtureArg,
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
  return (result.buckets?.[bucket] || []).map((item) => item.assertion_id);
}

function q19Items(result, bucket) {
  return (result.buckets?.[bucket] || []).filter((item) => item.record_id === Q19_RECORD_ID);
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
  for (const role of ['teacher', 'economist', 'quality']) {
    if (packet.subagent_lead_review?.[`${role}_verdict`] !== 'MORE_THAN_SATISFIED' ||
        gate.subagent_lead_review?.[`${role}_verdict`] !== 'MORE_THAN_SATISFIED') {
      fail(`q19 procedure package ${role} verdict must be MORE_THAN_SATISFIED`);
    }
  }
  return true;
}

function records(fixture) {
  return fixture.records || fixture.question_records || [];
}

function findRecord(fixture, recordId) {
  const record = records(fixture).find((item) => item.record_id === recordId);
  if (!record) fail(`fixture missing record: ${recordId}`);
  return record;
}

function allQ19SourceRecords(doc) {
  return [...(doc.graph_overlays || []), ...(doc.source_annex_overlays || [])]
    .filter((record) => record.source_exam_item_id === Q19_RECORD_ID);
}

function requireCurrentDiagnosticState(packet) {
  const procedurePackageExecuted = q19ProcedurePackageExecuted();
  const expectedQ19ReviewRequired = procedurePackageExecuted ? 6 : 17;
  const expectedOverallReviewRequired = procedurePackageExecuted ? 15 : 26;
  const expectedQ19ReviewAssertions = procedurePackageExecuted
    ? EXPECTED_Q19_POST_PROCEDURE_REVIEW_ASSERTIONS
    : EXPECTED_Q19_REVIEW_ASSERTIONS;
  const report = readJson(REGRESSION_REPORT_JSON);
  const counts = report.question_bucket_counts || {};
  if (counts.q3?.failed !== 0 || counts.q3?.review_required !== 0) fail('report q3 counts must be 0/0');
  if (counts.q19?.failed !== 0 || counts.q19?.review_required !== expectedQ19ReviewRequired) {
    fail(`report q19 counts must be live 0/${expectedQ19ReviewRequired}`);
  }
  if (counts.q27?.failed !== 3 || counts.q27?.review_required !== 5) fail('report q27 counts must remain 3/5');
  if (counts.q15?.failed !== 0 || counts.q15?.review_required !== 4) fail('report q15 counts must remain 0/4');
  if (report.bucket_totals?.failed !== 3 || report.bucket_totals?.review_required !== expectedOverallReviewRequired) {
    fail(`report overall counts must be 3 failed / ${expectedOverallReviewRequired} review_required`);
  }

  if (packet.current_diagnostic_state?.q19?.failed !== 0 ||
      packet.current_diagnostic_state?.q19?.review_required !== 17) {
    fail('packet q19 diagnostic state must remain historical 0/17');
  }
  if (packet.current_diagnostic_state?.overall?.failed !== 3 ||
      packet.current_diagnostic_state?.overall?.review_required !== 26) {
    fail('packet overall diagnostic state must remain historical 3 failed / 26 review_required');
  }

  const result = runH5Validator();
  if (q19Items(result, 'failed').length !== 0) fail('validator q19 failed bucket must be empty');
  const q19ReviewIds = q19Items(result, 'review_required').map((item) => item.assertion_id);
  if (q19ReviewIds.length !== expectedQ19ReviewAssertions.length) {
    fail(`validator q19 review_required count must be ${expectedQ19ReviewAssertions.length}`);
  }
  requireIncludesAll(q19ReviewIds, expectedQ19ReviewAssertions, 'validator q19 review_required assertions');
  for (const assertionId of FORBIDDEN_Q19_ANSWER_FORM_ASSERTIONS) {
    if (assertionIds(result, 'failed').includes(assertionId)) fail(`answer-form assertion must remain cleared: ${assertionId}`);
  }
  if (assertionIds(result, 'review_required').some((id) => String(id).includes('graph/draw/teken answer-form MTU'))) {
    fail('answer-form-needed review hook must remain cleared after PR #81');
  }
  for (const bucket of ['failed', 'review_required']) {
    const q3Items = (result.buckets?.[bucket] || []).filter((item) => item.record_id === Q3_RECORD_ID);
    if (q3Items.length !== 0) fail(`q3 must remain absent from validator ${bucket} bucket`);
  }
  if (!assertionIds(result, 'passed').includes('MTUH5-NEGATIVE-negative-solo-q2-function-construction-overtrigger-FAILS-AS-EXPECTED')) {
    fail('inherited Solo q1-q3 negative fixture guard must remain passing');
  }
}

function requireFixtureQ19Shape(packet) {
  const procedurePackageExecuted = q19ProcedurePackageExecuted();
  const fixture = readJson(FIXTURE);
  const q19 = findRecord(fixture, Q19_RECORD_ID);
  if (q19.question_word !== 'teken') fail('q19 question_word must be teken');
  requireIncludesAll(q19.mapped_mtu_ids || [], ['A42', 'D10', 'D13', 'A81'], 'q19 mapped_mtu_ids');
  if ((q19.mapped_mtu_ids || []).includes('A45')) fail('q19 mapped_mtu_ids must not include A45');

  for (const operation of q19.official_correction_model_operations || []) {
    if (!/^q19-step-[123]$/.test(operation.operation_id || '')) fail('unexpected q19 operation id');
    if (operation.missing_answer_form_expected !== false) {
      fail(`${operation.operation_id}.missing_answer_form_expected must remain false after PR #81`);
    }
    if (!Array.isArray(operation.answer_form_reviewed_equivalent_refs) ||
        operation.answer_form_reviewed_equivalent_refs.length !== 1 ||
        operation.answer_form_reviewed_equivalent_refs[0] !== ANSWER_REF) {
      fail(`${operation.operation_id}.answer_form_reviewed_equivalent_refs must preserve PR #81 ref`);
    }
    if ((operation.review_required_hooks || []).some((hook) => String(hook).includes('graph/draw/teken answer-form MTU'))) {
      fail(`${operation.operation_id} must not restore answer-form-needed hook`);
    }
    requireIncludes(operation.expected_forbidden_mtu_ids || [], 'A45', `${operation.operation_id}.expected_forbidden_mtu_ids`);
    requireIncludesAll(operation.expected_forbidden_route_tags || [], FORBIDDEN_ROUTE_TAGS, `${operation.operation_id}.expected_forbidden_route_tags`);
    if (procedurePackageExecuted) {
      if (!Array.isArray(operation.procedure_review_required_unit_ids) ||
          operation.procedure_review_required_unit_ids.length !== 0) {
        fail(`${operation.operation_id}.procedure_review_required_unit_ids must be cleared by approved procedure package`);
      }
    } else if (!Array.isArray(operation.procedure_review_required_unit_ids) ||
        operation.procedure_review_required_unit_ids.length === 0) {
      fail(`${operation.operation_id}.procedure_review_required_unit_ids must remain visible before procedure package execution`);
    }
  }

  const packetOps = packet.operation_evidence_surface || [];
  if (packetOps.length !== 3) fail('packet must contain three q19 operation evidence rows');
  for (const operation of packetOps) {
    if (!/^q19-step-[123]$/.test(operation.operation_id || '')) fail('unexpected packet operation id');
    requireIncludes(operation.forbidden_mtu_ids || [], 'A45', `${operation.operation_id}.forbidden_mtu_ids`);
    requireIncludesAll(operation.forbidden_route_tags || [], FORBIDDEN_ROUTE_TAGS, `${operation.operation_id}.forbidden_route_tags`);
    if (['q19-step-2', 'q19-step-3'].includes(operation.operation_id) &&
        operation.accepted_alternative_caveat !== AGGREGATE_SUPPLY_CAVEAT) {
      fail(`${operation.operation_id} must preserve aggregate-supply caveat`);
    }
  }
}

function requireSourceOverlay(packet) {
  const overlay = readJson(SOURCE_OVERLAY);
  try {
    validateSourceExtractionDocument(overlay, 'source-annex extraction overlay');
  } catch (error) {
    fail(error instanceof ValidationError ? error.message : String(error));
  }
  if (overlay.storage_status !== 'future_candidate_storage') fail('source overlay storage_status must be future_candidate_storage');
  if (packet.source_overlay_state?.storage_expected_to_exist !== true) fail('packet must state source overlay exists');
  if (packet.source_overlay_state?.storage_status !== 'future_candidate_storage') fail('packet source overlay storage status mismatch');

  const graphIds = (overlay.graph_overlays || []).map((record) => record.extraction_id);
  const sourceIds = (overlay.source_annex_overlays || []).map((record) => record.extraction_id);
  requireIncludesAll(graphIds, GRAPH_IDS, 'source overlay graph ids');
  requireIncludesAll(sourceIds, SOURCE_IDS, 'source overlay source-annex ids');
  requireIncludesAll(packet.source_overlay_state?.required_graph_record_ids || [], GRAPH_IDS, 'packet source overlay graph ids');
  requireIncludesAll(packet.source_overlay_state?.required_source_record_ids || [], SOURCE_IDS, 'packet source overlay source ids');

  const q19Records = allQ19SourceRecords(overlay);
  if (q19Records.length !== GRAPH_IDS.length + SOURCE_IDS.length) fail('source overlay must expose exactly five q19 records');
  for (const record of q19Records) {
    if (record.extraction_status !== 'partial_with_blocking_gap') fail(`${record.extraction_id}.extraction_status must remain partial_with_blocking_gap`);
    if (record.review_state !== 'blocked') fail(`${record.extraction_id}.review_state must remain blocked`);
    requireIncludesAll(record.blocking_gap_ids || [], ['q19-source-annex-gap', 'q19-graph-object-gap'], `${record.extraction_id}.blocking_gap_ids`);
    for (const key of [
      'protected_reference_mutation_authorized',
      'external_source_mutation_authorized',
      'machine_reference_mutation_authorized',
      'unit_minting_authorized',
      'operation_registry_mutation_authorized',
      'answer_skill_mutation_authorized',
      'source_annex_extraction_execution_authorized',
      'pv_graph_mutation_authorized',
      'target_exercise_promotion_authorized',
      'lesson_output_mutation_authorized',
      'student_product_use_authorized',
    ]) {
      if (record.authority_boundary?.[key] !== false) fail(`${record.extraction_id}.${key} must be false`);
    }
  }
}

function requireUnitsAndEvidence(packet) {
  const registry = readJson(UNIT_REGISTRY);
  const units = new Map((registry.units || registry).map((unit) => [unit.id, unit]));
  for (const id of [...REQUIRED_UNITS, 'A45']) {
    const unit = units.get(id);
    if (!unit) fail(`unit registry missing ${id}`);
    if (!Array.isArray(unit.procedure) || unit.procedure.length === 0) fail(`${id} must have canonical procedure evidence`);
  }

  const matrix = packet.unit_semantic_fit_matrix || [];
  requireIncludesAll(matrix.map((item) => item.unit_id), REQUIRED_UNITS, 'packet unit semantic fit matrix');
  for (const row of matrix) {
    if (!row.fit_question) fail(`${row.unit_id}.fit_question missing`);
    if (!row.proof_required_to_close) fail(`${row.unit_id}.proof_required_to_close missing`);
  }

  const evidence = packet.exact_evidence_needed_to_decide || [];
  requireIncludesAll(evidence.map((item) => item.evidence_id), [
    'q19-source-annex-decision-evidence',
    'q19-graph-object-decision-evidence',
    'q19-procedure-semantic-fit-evidence',
    'q19-chained-market-reasoning-evidence',
    'q19-third-graph-shift-evidence',
  ], 'packet exact evidence needed');
  for (const item of evidence) {
    if (!Array.isArray(item.covers_hooks) || item.covers_hooks.length === 0) fail(`${item.evidence_id}.covers_hooks missing`);
    if (!item.missing_or_review_needed) fail(`${item.evidence_id}.missing_or_review_needed missing`);
    if (!item.proof_required_to_close) fail(`${item.evidence_id}.proof_required_to_close missing`);
  }
}

function requirePrematureClosureNegativeGuard() {
  const fixtureClone = readJson(FIXTURE);
  const q19 = findRecord(fixtureClone, Q19_RECORD_ID);
  for (const operation of q19.official_correction_model_operations || []) {
    operation.review_required_hooks = [];
    operation.procedure_review_required_unit_ids = [];
  }
  if (!detectPrematureQ19Closure(fixtureClone)) {
    fail('temporary q19 fixture clone must trigger premature closure detector');
  }
}

function detectPrematureQ19Closure(fixture) {
  const q19 = findRecord(fixture, Q19_RECORD_ID);
  return (q19.official_correction_model_operations || []).some((operation) => (
    (operation.review_required_hooks || []).length === 0 &&
    (operation.procedure_review_required_unit_ids || []).length === 0
  ));
}

function requireFalseReconstructableNegativeGuard() {
  const overlayClone = readJson(SOURCE_OVERLAY);
  for (const record of allQ19SourceRecords(overlayClone)) {
    record.extraction_status = 'reconstructable_pending_review';
  }
  let rejected = false;
  try {
    validateSourceExtractionDocument(overlayClone, 'negative q19 false reconstructable overlay');
  } catch (error) {
    rejected = error instanceof ValidationError || error instanceof Error;
  }
  if (!rejected) fail('negative q19 false reconstructable overlay must be rejected');
}

function requireA45NegativeGuard() {
  const fixtureClone = readJson(FIXTURE);
  const q19 = findRecord(fixtureClone, Q19_RECORD_ID);
  function addA45(values) {
    if (Array.isArray(values) && !values.includes('A45')) values.push('A45');
  }
  addA45(q19.mapped_mtu_ids);
  for (const operation of q19.official_correction_model_operations || []) addA45(operation.mapped_mtu_ids);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mtu-h5-q19-current-gate-a45-negative-'));
  const tempFixture = path.join(tempDir, 'fixture-with-a45.json');
  try {
    fs.writeFileSync(tempFixture, JSON.stringify(fixtureClone, null, 2));
    const result = runH5Validator(tempFixture);
    const failedIds = assertionIds(result, 'failed');
    for (const id of [
      'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-1:ASSERT-OVER-TRIGGER',
      'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-2:ASSERT-OVER-TRIGGER',
      'vw-1022-a-25-1-o:opgave-4:question-19:q19-step-3:ASSERT-OVER-TRIGGER',
    ]) {
      requireIncludes(failedIds, id, 'temporary A45 negative failed assertions');
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function requireHistoricalBoundary(packet) {
  requireGitSuccess(['merge-base', '--is-ancestor', PR69_MERGE, 'HEAD'], 'current checkout must descend from PR #69 merge');
  requireGitSuccess(['merge-base', '--is-ancestor', PR81_MERGE, 'HEAD'], 'current checkout must descend from PR #81 merge');
  requireGitSuccess(['cat-file', '-e', `${START_COMMIT}:reports/mtu-hardening/mtu-h5-regression-report.json`], 'start commit must contain MTU-H5 report');
  const historical = packet.known_historical_or_stale_surfaces || [];
  for (const file of [
    'reports/mtu-hardening/mtu-h5-q19-source-graph-extraction-gate-1.json',
    'reports/mtu-hardening/mtu-h5-q19-source-graph-extraction-execution-gate-1.json',
    'references/data/exam-ingestion/operation-answer-skill-contract.json#q19_extraction_contract',
  ]) {
    const row = historical.find((item) => item.path === file);
    if (!row) fail(`packet must list historical/stale surface ${file}`);
    if (row.live_authoritative_for_current_counts !== false) fail(`${file} must not be live-authoritative for current counts`);
  }
}

function requirePacket(packet) {
  if (packet.schema_version !== 1) fail('packet schema_version must be 1');
  if (packet.sprint_id !== 'MTU-H5') fail('packet sprint_id must be MTU-H5');
  if (packet.packet_id !== EXPECTED_PACKET) fail('packet_id mismatch');
  if (packet.gate_id !== EXPECTED_GATE) fail('packet gate_id mismatch');
  if (packet.status !== 'q19_source_graph_procedure_reasoning_gate_ready_for_human_review_no_mutation_authorized') {
    fail('packet status mismatch');
  }
  if (packet.start_commit !== START_COMMIT) fail('packet start_commit mismatch');
  if (packet.review_branch !== REVIEW_BRANCH) fail('packet review_branch mismatch');
  if (packet.packet_result?.completion_claimed !== false) fail('packet must not claim completion');
  if (packet.packet_result?.next_state !== 'ready_for_human_q19_source_graph_procedure_reasoning_gate_review') {
    fail('packet next_state mismatch');
  }
  requireFalseBoundary(packet.authority_boundary, 'packet.authority_boundary');
  if (packet.review_team_threshold?.minimum_verdict !== 'MORE_THAN_SATISFIED') fail('packet review threshold mismatch');
  if (packet.review_team_threshold?.packet_accepted_without_all_three !== false) fail('packet must require all three review agents');
  const assertions = packet.current_q19_review_required_inventory?.assertion_ids || [];
  requireIncludesAll(assertions, EXPECTED_Q19_REVIEW_ASSERTIONS, 'packet q19 assertion inventory');
  if (packet.current_q19_review_required_inventory?.count !== EXPECTED_Q19_REVIEW_ASSERTIONS.length) {
    fail('packet q19 assertion inventory count mismatch');
  }
  requireIncludesAll((packet.decision_options || []).map((item) => item.decision_id), [
    'approve_exact_procedure_semantic_fit_execution_gate',
    'approve_exact_source_graph_limitation_acceptance_gate',
    'approve_exact_chained_reasoning_reviewed_equivalent_gate',
    'keep_all_remaining_q19_hooks_blocked',
    'revise_this_gate_before_any_execution_planning',
  ], 'packet decision options');
  for (const issue of packet.carried_issues || []) {
    if (!Array.isArray(issue.blocks) || issue.blocks.length === 0) fail(`${issue.issue_id}.blocks must be populated`);
    if (!Array.isArray(issue.does_not_block) || issue.does_not_block.length === 0) fail(`${issue.issue_id}.does_not_block must be populated`);
    if (!issue.proof_required_to_close) fail(`${issue.issue_id}.proof_required_to_close must be populated`);
  }
}

function requireReviewTeamResults(container, context) {
  const results = container.pre_human_review_team_results || [];
  if (!Array.isArray(results)) fail(`${context} review agents must be an array`);
  if (results.length === 0) return;
  requireIncludesAll(results.map((item) => item.agent), ['teacher', 'economist', 'quality_inspection'], `${context} review agents`);
  for (const result of results) {
    if (result.verdict !== 'MORE_THAN_SATISFIED') fail(`${context} ${result.agent} verdict must be MORE_THAN_SATISFIED`);
    if (!result.summary) fail(`${context} ${result.agent} summary missing`);
  }
}

function requireGatePacket(gate) {
  if (gate.schema_version !== 1) fail('gate schema_version must be 1');
  if (gate.gate_id !== EXPECTED_GATE) fail('gate id mismatch');
  if (gate.status !== 'pending_human_review') fail('gate status mismatch');
  if (gate.review_standard !== 'REV-STD-1') fail('gate must use REV-STD-1');
  if (!gate.product_end_state || !gate.original_sprint_gate_spec) fail('gate must cite product end-state and original sprint/gate spec');
  requireFalseBoundary(gate.authority_boundary, 'gate.authority_boundary');
  if (gate.requested_decision?.execution_authorized_by_this_packet !== false) fail('gate must not authorize execution');
  if (gate.requested_decision?.fixture_mutation_authorized_by_this_packet !== false) fail('gate must not authorize fixture mutation');
  if (gate.requested_decision?.source_overlay_mutation_authorized_by_this_packet !== false) fail('gate must not authorize source overlay mutation');
  const checklist = gate.core_requirement_checklist || [];
  if (checklist.length < 10) fail('gate core requirement checklist is incomplete');
  for (const item of checklist) {
    if (item.status !== 'met') fail(`core requirement ${item.requirement_id} must be met; PASS WITH FLAGS cannot carry missing core`);
  }
  requireIncludesAll(checklist.map((item) => item.requirement_id), [
    'core-1-current-live-q19-counts',
    'core-2-rev-std-1-review-surface',
    'core-3-non-mutating-boundary',
    'core-4-current-source-overlay-recognized',
    'core-5-answer-form-execution-preserved',
    'core-6-evidence-needed-named',
    'core-7-procedure-fit-matrix',
    'core-8-negative-guards',
    'core-9-carried-blockers-classified',
    'core-10-remote-discoverability',
  ], 'gate core checklist');
  for (const finding of gate.findings || []) {
    if (!finding.classification) fail(`${finding.finding_id}.classification missing`);
    if (!Array.isArray(finding.blocks)) fail(`${finding.finding_id}.blocks must be an array`);
    if (!Array.isArray(finding.does_not_block) || finding.does_not_block.length === 0) {
      fail(`${finding.finding_id}.does_not_block must be populated`);
    }
    if (!finding.proof_required_to_close) fail(`${finding.finding_id}.proof_required_to_close missing`);
  }
  requireIncludesAll(gate.must_review || [], [
    rel(PACKET_MD),
    rel(PACKET_JSON),
    rel(__filename),
    rel(REGRESSION_REPORT_JSON),
    rel(FIXTURE),
    rel(H5_VALIDATOR),
    rel(SOURCE_OVERLAY),
  ], 'gate must_review');
  if (gate.required_review_team_threshold?.minimum_verdict !== 'MORE_THAN_SATISFIED') fail('gate review threshold mismatch');
  if (gate.required_review_team_threshold?.all_three_required !== true) fail('gate must require all three review agents');
}

function requireRemoteDiscoverability(packet, gate) {
  const bundleMd = readText(GATE_BUNDLE);
  const urlIndexMd = readText(URL_INDEX);
  const agentIndexMd = readText(AGENT_INDEX);
  const agentIndexJson = readJson(AGENT_INDEX_JSON);
  const agentIndexFiles = new Set(Object.values(agentIndexJson.groups || {}).flat());
  const { owner, repo } = parseRepoFromPackageJson();
  const references = new Set([
    ...(gate.must_review || []),
    ...(gate.evidence_base || []),
    rel(GATE_BUNDLE),
    rel(GATE_JSON),
    rel(GATE_MD),
  ]);
  for (const reference of references) {
    const url = buildRawReferenceUrl(owner, repo, packet.review_branch, reference);
    requireTextIncludes(bundleMd, url, 'gate bundle URLs');
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
    if (!agentIndexFiles.has(reference)) fail(`reports/github-agent-index-platform.json must include ${reference}`);
  }
}

function main() {
  if (q19FinalClosureActive()) {
    console.log('OK MTU-H5 q19 source/graph/procedure/reasoning gate 1: historical gate superseded by final q19 closure');
    return;
  }

  const packet = readJson(PACKET_JSON);
  const packetMd = readText(PACKET_MD);
  const gate = readJson(GATE_JSON);
  const gateMd = readText(GATE_MD);

  requirePacket(packet);
  requireGatePacket(gate);
  requireReviewTeamResults(packet, 'packet');
  requireReviewTeamResults(gate, 'gate');
  requireCurrentDiagnosticState(packet);
  requireFixtureQ19Shape(packet);
  requireSourceOverlay(packet);
  requireUnitsAndEvidence(packet);
  requireHistoricalBoundary(packet);
  requirePrematureClosureNegativeGuard();
  requireFalseReconstructableNegativeGuard();
  requireA45NegativeGuard();
  requireRemoteDiscoverability(packet, gate);

  for (const command of REQUIRED_VALIDATION_COMMANDS) {
    requireIncludes(packet.validation_commands || [], command, 'packet validation commands');
    requireIncludes(gate.validation_commands || [], command, 'gate validation commands');
  }

  for (const [text, context] of [[packetMd, 'packet markdown'], [gateMd, 'gate markdown']]) {
    for (const required of [
      'MTU-H5',
      'q19',
      '0 failed / 17 review_required',
      'source/graph/procedure/reasoning',
      'partial_with_blocking_gap',
      'aggregate-supply',
      'A45',
      'student/product use',
    ]) {
      requireTextIncludes(text, required, context);
    }
  }

  console.log('OK MTU-H5 q19 source/graph/procedure/reasoning gate 1: ready_for_human_review_no_mutation_authorized');
}

main();
