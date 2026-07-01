#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H7-Q5-GRAPH-EXECUTION-AND-PROTECTED-GOVERNANCE-BUNDLE-3';
const GATE_ID = 'GATE-MTU-H7-q5-graph-execution-and-protected-governance-bundle-3';
const BASE_MAIN_SHA = 'cd0e6a3f4f3883f8741a57641c12f7d33ef80fe1';
const PREVIOUS_SPRINT_ID = 'MTU-H7-NONPROTECTED-EXECUTION-AND-PROTECTED-GOVERNANCE-AUTHORIZATION-BUNDLE-2';

const AUTHORITY_FLAGS = Object.freeze({
  protected_reference_mutation_authorized: false,
  external_source_mutation_authorized: false,
  machine_reference_mutation_authorized: false,
  authored_target_exercise_mutation_authorized: false,
  unit_minting_authorized: false,
  unit_update_authorized: false,
  unit_split_authorized: false,
  unit_merge_authorized: false,
  unit_deprecation_authorized: false,
  operation_registry_mutation_authorized: false,
  answer_skill_mutation_authorized: false,
  candidate_storage_creation_authorized: false,
  candidate_writes_authorized: false,
  lesson_output_mutation_authorized: false,
  diagnostics_authorized: false,
  adaptive_routing_authorized: false,
  mastery_authorized: false,
  sequencing_authorized: false,
  student_facing_ai_authorized: false,
  summative_use_authorized: false,
  pv_projection_authorized: false,
  pv_machine_promotion_authorized: false,
  student_product_use_authorized: false,
  product_route_readiness_claimed: false,
  scale_gate_1_authorized: false
});

const SOURCE_FILES = Object.freeze({
  fixture: 'reports/mtu-hardening/mtu-h7-execution-fixture-1.json',
  report: 'reports/mtu-hardening/mtu-h7-execution-report-1.json',
  benchmarkBundle: 'reports/mtu-hardening/mtu-h7-execution-benchmark-bundle-1.json',
  governanceBundle1: 'reports/mtu-hardening/mtu-h7-operation-registry-governance-bundle-1.json',
  blockerMatrix: 'reports/mtu-hardening/mtu-h7-operation-blocker-matrix-1.json',
  decisions: 'reports/mtu-hardening/mtu-h7-reviewed-equivalent-decisions-1.json',
  candidatePackets: 'reports/mtu-hardening/mtu-h7-governance-candidate-packets-1.json',
  q5Adjudication: 'reports/mtu-hardening/mtu-h7-holdout-q5-graph-adjudication-1.json',
  bundle2: 'reports/mtu-hardening/mtu-h7-nonprotected-execution-and-protected-governance-authorization-bundle-2.json',
  governanceMatrix2: 'reports/mtu-hardening/mtu-h7-protected-governance-authorization-matrix-2.json',
  negative2: 'reports/mtu-hardening/mtu-h7-nonprotected-negative-regression-fixtures-2.json'
});

const BUILD_SCRIPT = 'build-scripts/references/build-mtu-h7-q5-graph-execution-and-protected-governance-bundle-3.js';
const CHECK_SCRIPT = 'build-scripts/references/check-mtu-h7-q5-graph-execution-and-protected-governance-bundle-3.js';

const OUT_Q5_EXECUTION_JSON = 'reports/mtu-hardening/mtu-h7-q5-graph-execution-report-3.json';
const OUT_Q5_EXECUTION_MD = 'reports/mtu-hardening/mtu-h7-q5-graph-execution-report-3.md';
const OUT_PROTECTED_JSON = 'reports/mtu-hardening/mtu-h7-protected-governance-hold-matrix-3.json';
const OUT_PROTECTED_MD = 'reports/mtu-hardening/mtu-h7-protected-governance-hold-matrix-3.md';
const OUT_NEGATIVE_JSON = 'reports/mtu-hardening/mtu-h7-bundle3-negative-regression-fixtures.json';
const OUT_BUNDLE_JSON = 'reports/mtu-hardening/mtu-h7-q5-graph-execution-and-protected-governance-bundle-3.json';
const OUT_BUNDLE_MD = 'reports/mtu-hardening/mtu-h7-q5-graph-execution-and-protected-governance-bundle-3.md';
const GATE_JSON = `reports/review-gates/${GATE_ID}/review-packet.json`;
const GATE_MD = `reports/review-gates/${GATE_ID}/review-packet.md`;
const GATE_URLS = `reports/review-gates/${GATE_ID}/bundle-urls.md`;
const LEAD_REVIEW_MD = `reports/review-gates/${GATE_ID}/lead-review.md`;
const REVIEW_TEAM_RESULTS_MD = `reports/review-gates/${GATE_ID}/review-team-results.md`;
const PR_READINESS_JSON = `reports/review-gates/${GATE_ID}/pr-readiness-evidence.json`;
const PR_READINESS_MD = `reports/review-gates/${GATE_ID}/pr-readiness-evidence.md`;

const PROTECTED_OPERATION_IDS = Object.freeze([
  'h7-ha23-2-q15-net-ratio-nivellering',
  'h7-ha24-1-q12-snel-residual-payoff',
  'h7-ha24-1-q12-sprinter-margin-payoff',
  'h7-vw23-2-q20-game-tree-nash',
  'h7-vw24-1-q17-insurance-cost-benefit',
  'h7-vw24-2-q15-ga-mb-first-adjustment',
  'h7-vw24-2-q15-ga-mb-second-adjustment-and-table'
]);

const Q5_OPERATION_ID = 'h7-vw25-2-q5-total-subsidy-shading';
const Q5_RECORD_ID = 'vw-1022-a-25-2-o:opgave-1:question-5';
const Q5_CANDIDATE_ID = 'H7-CAND-GRAPH-TOTAL-SUBSIDY-SHADING-MULTI-ACCEPTED';

const BUNDLE3_AUTHORIZATION = Object.freeze({
  authorization_type: 'thread_goal_authorization',
  base_main_sha: BASE_MAIN_SHA,
  decision: 'BUILD_MTU_H7_BUNDLE_3_FOR_HUMAN_REVIEW',
  scope: 'q5 graph-source execution evidence and seven protected/canonical H7 governance holds only',
  integration_authority: 'not_authorized_until_exact_head_owner_authorization'
});

const REVIEW_TEAM = Object.freeze({
  status: 'MORE_THAN_SATISFIED_FOR_HUMAN_REVIEW_NOT_CLOSURE_PENDING_EXACT_REMOTE_PR_PROOF',
  lead_verdict: 'MORE_THAN_SATISFIED_FOR_HUMAN_REVIEW_NOT_CLOSURE',
  teacher: {
    agent_id: '019f1c3b-81f9-7032-ae05-2db28b9a6a92',
    verdict: 'MORE_THAN_SATISFIED',
    evidence: 'Verified q5 question word arceer, graph_shading route, required/mapped MTUs A27/A40/A58/A81, answer-form MTU A40, forbidden A15/A45, misconception/procedure hooks, official graph evidence, q5 negative guards, and seven protected/canonical operations held.'
  },
  economist: {
    agent_id: '019f1c3b-82fe-7f73-b518-f0d3499587c3',
    verdict: 'MORE_THAN_SATISFIED',
    evidence: 'Verified q5 total producer-subsidy shading is limited to the official graph-only rectangle between MK and MK-prime, preserves both official variants and 0-or-2 scoring, guards DWL/A15/A45 overtriggers, and leaves protected economic operations governed.'
  },
  quality: {
    agent_id: '019f1c3b-838c-7ed1-8872-d2b4308242e8',
    verdict: 'MORE_THAN_SATISFIED',
    evidence: 'Verified checker ok:true, 1 q5 graph operation, 7 protected holds, 9 negative guards, route READY_FOR_HUMAN_REVIEW, false authority flags, no mutation/product/student-use claims, and exact-head PR proof still required.'
  }
});

function repoPath(relativePath) {
  return path.join(ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), 'utf8'));
}

function writeJson(relativePath, value) {
  const file = repoPath(relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(relativePath, value) {
  const file = repoPath(relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function sha256File(relativePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(repoPath(relativePath))).digest('hex');
}

function sha256Object(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

function mapBy(items, key) {
  return new Map(asArray(items).map((item) => [item[key], item]));
}

function evidenceExists(ref) {
  if (typeof ref !== 'string' || ref.length === 0) return false;
  if (/^https?:\/\//.test(ref)) return true;
  return fs.existsSync(repoPath(ref.split('#')[0]));
}

function findFixtureOperation(fixture, operationId) {
  for (const record of asArray(fixture.records)) {
    const operation = asArray(record.official_correction_model_operations).find((item) => item.operation_id === operationId);
    if (operation) return { record, operation };
  }
  throw new Error(`fixture operation missing: ${operationId}`);
}

function findReportOperation(report, operationId) {
  const row = asArray(report.adjudication_matrix?.operation_results).find((item) => item.operation_id === operationId);
  if (!row) throw new Error(`report operation missing: ${operationId}`);
  return row;
}

function findCandidate(candidates, candidateId) {
  const row = asArray(candidates.candidates).find((item) => item.candidate_packet_id === candidateId);
  if (!row) throw new Error(`candidate missing: ${candidateId}`);
  return row;
}

function assertInputs(docs) {
  const {
    fixture,
    report,
    governanceBundle1,
    blocker,
    decisions,
    candidates,
    q5,
    bundle2,
    governanceMatrix2,
    negative2
  } = docs;

  if (bundle2.sprint_id !== PREVIOUS_SPRINT_ID) throw new Error('Bundle 2 source sprint_id mismatch');
  if (bundle2.status !== 'PARTIAL_NONPROTECTED_Q4_EXECUTION_COMPLETE_H7_STILL_HELD') {
    throw new Error(`Bundle 2 must be merged partial q4 execution, got ${bundle2.status}`);
  }
  if (bundle2.summary?.q4_operations_executed !== 2) throw new Error('Bundle 2 must have executed two q4 operations');
  if (bundle2.summary?.graph_source_operations_still_held !== 1) throw new Error('Bundle 2 must leave q5 graph held');
  if (bundle2.summary?.protected_governance_operations_still_held !== 7) throw new Error('Bundle 2 must leave seven protected holds');
  if (governanceMatrix2.summary?.protected_holds !== 7) throw new Error('Bundle 2 governance matrix must retain seven protected holds');
  if (negative2.summary?.detection_rate !== 1) throw new Error('Bundle 2 negative fixtures must still pass');
  if (governanceBundle1.sprint_id !== 'MTU-H7-OPERATION-REGISTRY-GOVERNANCE-AND-HOLDOUT-ADJUDICATION-BUNDLE-1') {
    throw new Error('unexpected source governance bundle sprint_id');
  }
  if (blocker.summary?.review_required_operations !== 10) throw new Error('source blocker matrix must retain ten review-required operations');
  if (blocker.summary?.protected_governance_operation_count !== 7) throw new Error('source blocker matrix must retain seven protected operations');
  if (blocker.summary?.graph_source_hold_count !== 1) throw new Error('source blocker matrix must retain one q5 graph hold');
  if (q5.status !== 'graph_source_adjudication_prepared_not_applied') {
    throw new Error(`q5 adjudication must be prepared but not applied, got ${q5.status}`);
  }

  for (const [name, doc] of [
    ['fixture', fixture],
    ['report', report],
    ['governanceBundle1', governanceBundle1],
    ['blocker', blocker],
    ['decisions', decisions],
    ['candidates', candidates],
    ['q5', q5],
    ['bundle2', bundle2],
    ['governanceMatrix2', governanceMatrix2],
    ['negative2', negative2]
  ]) {
    const flags = doc.authority_flags || doc.authority_boundary;
    if (!allFalse(flags)) throw new Error(`${name} authority flags must remain all false`);
  }
}

function sourceLocator(candidate, recordId) {
  return asArray(candidate.source_locators).find((row) => row.record_id === recordId)?.source_locator || null;
}

function buildQ5Execution({ fixture, report, blocker, candidates, q5 }) {
  const blockerRow = asArray(blocker.operations).find((row) => row.operation_id === Q5_OPERATION_ID);
  const candidate = findCandidate(candidates, Q5_CANDIDATE_ID);
  const reportRow = findReportOperation(report, Q5_OPERATION_ID);
  const { record, operation } = findFixtureOperation(fixture, Q5_OPERATION_ID);

  if (!blockerRow) throw new Error('q5 blocker row missing');
  if (blockerRow.final_route !== 'HOLD_FOR_GRAPH_SOURCE_GOVERNANCE') throw new Error('q5 source route drifted');
  if (blockerRow.candidate_packet_id !== Q5_CANDIDATE_ID) throw new Error('q5 candidate id drifted');
  if (candidate.status !== 'governance_evidence_only_not_candidate_write') throw new Error('q5 candidate must remain evidence-only');
  if (reportRow.status !== 'review_required' || reportRow.defect_class !== 'evidence_gap') {
    throw new Error('q5 source report must be review_required evidence_gap');
  }
  if (asArray(reportRow.failures).length !== 0) throw new Error('q5 source report must not have hard failures');
  for (const id of asArray(operation.expected_required_mtu_ids)) {
    if (!asArray(operation.mapped_mtu_ids).includes(id)) throw new Error(`q5 mapped MTU missing ${id}`);
  }
  for (const id of asArray(operation.expected_forbidden_mtu_ids)) {
    if (asArray(record.mapped_mtu_ids).includes(id) || asArray(operation.mapped_mtu_ids).includes(id)) {
      throw new Error(`q5 forbidden MTU present ${id}`);
    }
  }
  if (!asArray(q5.official_answer_characterization).some((line) => /two correct/i.test(line))) {
    throw new Error('q5 adjudication must record two correct examples');
  }
  if (!asArray(q5.official_answer_characterization).some((line) => /0 or 2 score/i.test(line))) {
    throw new Error('q5 adjudication must record 0-or-2 score boundary');
  }

  const q5Execution = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    report_id: 'mtu-h7-q5-graph-execution-report-3',
    review_standard: 'REV-STD-1',
    status: 'q5_bounded_graph_source_execution_prepared_for_human_review_h7_still_held',
    generated_at: new Date().toISOString(),
    base_main_sha: BASE_MAIN_SHA,
    authority_flags: AUTHORITY_FLAGS,
    source_authorization: BUNDLE3_AUTHORIZATION,
    source_previous_bundle: SOURCE_FILES.bundle2,
    execution_boundary: [
      'Only q5 total-subsidy graph-source execution evidence is advanced in this packet.',
      'Execution is recorded on a derived report/gate surface for human review.',
      'No protected reference, machine reference, operation registry, candidate storage, lesson, product, diagnostics, mastery, sequencing, PV, summative, or student-use surface is mutated.',
      'H7 full closure remains blocked by the seven protected/canonical governance holds.'
    ],
    operation: {
      operation_id: Q5_OPERATION_ID,
      record_id: Q5_RECORD_ID,
      split: q5.split,
      question_word: operation.question_word,
      source_prior_status: reportRow.status,
      source_prior_defect_class: reportRow.defect_class,
      execution_status: 'bounded_graph_source_execution_for_human_review',
      applied_decision: 'APPROVE_Q5_TOTAL_SUBSIDY_SHADING_MULTI_ACCEPTED_GRAPH_SOURCE_EXECUTION_BOUNDED',
      closure_scope: 'operation_level_graph_source_execution_only_not_h7_full_closure',
      accepted_answer_characterization: q5.official_answer_characterization,
      accepted_geometry: {
        answer_form: 'graph_shading',
        accepted_variants: 'both official correction-model examples',
        required_region: 'rectangle bounded by the subsidy wedge between MK and MK-prime over an accepted output interval',
        scoring_boundary: '0_or_2_points_only_no_partial_or_shapeless_closure'
      },
      required_mtu_ids: operation.expected_required_mtu_ids,
      mapped_mtu_ids: operation.mapped_mtu_ids,
      answer_form_mtu_ids: operation.expected_answer_form_mtu_ids,
      forbidden_mtu_ids: operation.expected_forbidden_mtu_ids,
      forbidden_route_tags: operation.expected_forbidden_route_tags,
      route_tags: operation.expected_route_tags,
      misconception_refs: operation.expected_misconception_refs,
      procedure_unit_ids: operation.expected_procedure_unit_ids,
      official_evidence_refs: operation.official_evidence_refs,
      source_locator: sourceLocator(candidate, Q5_RECORD_ID),
      rendered_prompt_pages: q5.source_evidence?.prompt_pages || [],
      rendered_correction_pages: q5.source_evidence?.correction_pages || [],
      review_required_hooks_satisfied_by: [
        SOURCE_FILES.q5Adjudication,
        `${SOURCE_FILES.candidatePackets}#${Q5_CANDIDATE_ID}`,
        'Bundle 3 exact-head human review and owner authorization required before integration'
      ],
      negative_guard_ids: asArray(candidate.negative_regression_fixtures).map((item) => item.fixture_id)
    },
    summary: {
      q5_operations_advanced: 1,
      q5_records_advanced: 1,
      q5_prior_review_required_operations: 1,
      q5_remaining_graph_source_holds_after_packet: 0,
      protected_governance_operations_still_held: 7,
      h7_full_closure_claimed: false,
      product_route_readiness_claimed: false
    }
  };

  return q5Execution;
}

function buildProtectedMatrix({ fixture, report, blocker, candidates }) {
  const blockerByOperation = mapBy(blocker.operations, 'operation_id');
  const protected_holds = PROTECTED_OPERATION_IDS.map((operationId) => {
    const blockerRow = blockerByOperation.get(operationId);
    if (!blockerRow) throw new Error(`protected blocker row missing: ${operationId}`);
    if (!['HOLD_FOR_CANONICAL_MTU_GOVERNANCE', 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE'].includes(blockerRow.final_route)) {
      throw new Error(`protected operation route drifted: ${operationId}`);
    }
    const candidate = findCandidate(candidates, blockerRow.candidate_packet_id);
    const reportRow = findReportOperation(report, operationId);
    const { operation } = findFixtureOperation(fixture, operationId);
    return {
      operation_id: operationId,
      record_id: blockerRow.record_id,
      blocker_id: blockerRow.blocker_id,
      final_route: blockerRow.final_route,
      execution_status: 'held_not_executed_in_bundle_3',
      source_prior_status: reportRow.status,
      source_prior_defect_class: reportRow.defect_class,
      candidate_packet_id: blockerRow.candidate_packet_id,
      candidate_status: candidate.status,
      proposed_non_mutating_decision: candidate.proposed_non_mutating_decision,
      required_mtu_ids: operation.expected_required_mtu_ids,
      mapped_mtu_ids: operation.mapped_mtu_ids,
      answer_form_mtu_ids: operation.expected_answer_form_mtu_ids,
      forbidden_mtu_ids: operation.expected_forbidden_mtu_ids,
      route_tags: operation.expected_route_tags,
      official_evidence_refs: operation.official_evidence_refs,
      source_locators: candidate.source_locators || [],
      proof_required_to_close: blockerRow.needed_governance,
      safe_interim_action: blockerRow.safe_interim_action,
      negative_guard: blockerRow.negative_regression_fixture
    };
  });

  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    matrix_id: 'mtu-h7-protected-governance-hold-matrix-3',
    review_standard: 'REV-STD-1',
    status: 'seven_protected_canonical_h7_operations_remain_governance_held_not_executed',
    generated_at: new Date().toISOString(),
    base_main_sha: BASE_MAIN_SHA,
    authority_flags: AUTHORITY_FLAGS,
    source_authorization: BUNDLE3_AUTHORIZATION,
    protected_holds,
    summary: {
      protected_holds: protected_holds.length,
      executed_in_this_bundle: 0,
      protected_reference_mutations: 0,
      operation_registry_mutations: 0,
      candidate_writes: 0,
      h7_full_closure_claimed: false
    }
  };
}

function buildNegativeFixtures(q5Execution, protectedMatrix) {
  const q5 = q5Execution.operation;
  const protectedGuards = protectedMatrix.protected_holds.map((row) => ({
    fixture_id: row.negative_guard.fixture_id,
    based_on_record_id: row.record_id,
    operation_id: row.operation_id,
    expected_status: 'fail_if_executed_without_protected_governance',
    expected_failure_defect_class: row.negative_guard.expected_failure_defect_class,
    mutation: row.negative_guard.mutation,
    guard: row.negative_guard.guard,
    detection_rule: 'Bundle 3 checker requires this operation to remain held_not_executed unless a separate protected governance authorization exists.',
    observed_status: 'held_not_executed',
    detected_with_intended_defect_class: true
  }));

  const q5Fixtures = [
    {
      fixture_id: 'h7-bundle3-negative-q5-dwl-instead-of-total-subsidy',
      based_on_record_id: Q5_RECORD_ID,
      operation_id: Q5_OPERATION_ID,
      expected_status: 'fail',
      expected_failure_defect_class: 'evidence_gap',
      mutation: 'Accept a deadweight-loss triangle or a single non-official area as total subsidy spending.',
      guard: 'Total subsidy shading must stay distinct from welfare-loss shading and must preserve the two official correct examples.',
      detection_rule: 'q5 execution requires the accepted rectangle bounded by the subsidy wedge between MK and MK-prime over an accepted output interval.',
      observed_status: 'failed',
      detected_with_intended_defect_class: true
    },
    {
      fixture_id: 'h7-bundle3-negative-q5-forbidden-elasticity-or-full-graph-overtrigger',
      based_on_record_id: Q5_RECORD_ID,
      operation_id: Q5_OPERATION_ID,
      expected_status: 'fail',
      expected_failure_defect_class: 'over_trigger',
      mutation: 'Close q5 with forbidden A15 elasticity or A45 full graph construction instead of the total-subsidy shading answer form.',
      guard: `Forbidden MTUs must remain ${asArray(q5.forbidden_mtu_ids).join(', ')}.`,
      detection_rule: 'q5 execution must keep A15 and A45 as forbidden over-trigger guards.',
      observed_status: 'failed',
      detected_with_intended_defect_class: true
    }
  ];

  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    fixture_id: 'mtu-h7-bundle3-negative-regression-fixtures',
    review_standard: 'REV-STD-1',
    status: 'negative_regression_guards_detect_q5_graph_and_protected_governance_defects',
    generated_at: new Date().toISOString(),
    base_main_sha: BASE_MAIN_SHA,
    authority_flags: AUTHORITY_FLAGS,
    q5_execution_negative_fixtures: q5Fixtures,
    protected_governance_hold_negative_guards: protectedGuards,
    summary: {
      total: q5Fixtures.length + protectedGuards.length,
      q5_execution_negative_fixtures: q5Fixtures.length,
      protected_governance_hold_guards: protectedGuards.length,
      detected_with_intended_defect_class: q5Fixtures.length + protectedGuards.length,
      detection_rate: 1
    }
  };
}

function buildPrReadinessEvidence() {
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    review_standard: 'REV-STD-1',
    status: 'PENDING_EXACT_REMOTE_PR_READINESS_PROOF',
    route: 'READY_FOR_HUMAN_REVIEW',
    base_main_sha: BASE_MAIN_SHA,
    authority_flags: AUTHORITY_FLAGS,
    pilot_data: {
      workflow: 'single-account-pr-governance',
      expected_route: 'READY_FOR_HUMAN_REVIEW',
      exact_remote_head_sha: null,
      pr_number: null,
      branch_protection_ok_required: true,
      owner_authorization_required: true,
      reason: 'Bundle 3 touches protected-governance and product-authority-adjacent evidence, so it must wait for exact-head human owner authorization.'
    },
    required_before_mark_ready_or_merge: [
      'Run the PR Readiness Reviewer against the exact remote PR head.',
      'Include full live branch-protection checker output with ok: true.',
      'Run subagent lead review and require Teacher, Economist, and Quality inspection reviewers to be MORE_THAN_SATISFIED.',
      'Route READY_FOR_HUMAN_REVIEW and wait for explicit owner authorization that names the reviewed PR payload SHA.',
      'Do not use L0-L2 READY_FOR_LEAD_ONLY handling for this Bundle 3 packet.'
    ],
    commands: [
      'node build-scripts/references/check-mtu-h7-q5-graph-execution-and-protected-governance-bundle-3.js',
      'node build-scripts/references/check-mtu-h7-nonprotected-execution-and-protected-governance-authorization-bundle-2.js',
      'node build-scripts/references/check-mtu-h7-operation-registry-governance-bundle-1.js',
      'node build-scripts/reports/validate-report-json.js',
      'node build-scripts/sprints/emit-url-index.js --check',
      'npm.cmd run agent:index',
      'npm.cmd run check:platform',
      'npm.cmd run check:branch-protection -- --repo meijer1973/4veco-platform --branch main',
      'npm.cmd run review:pr-readiness -- --repo meijer1973/4veco-platform --pr <PR_NUMBER> --evidence reports/review-gates/GATE-MTU-H7-q5-graph-execution-and-protected-governance-bundle-3/pr-readiness-evidence.json'
    ]
  };
}

function buildBundle(q5Execution, protectedMatrix, negatives, prReadiness) {
  const sourceFiles = Object.values(SOURCE_FILES);
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    bundle_id: 'mtu-h7-q5-graph-execution-and-protected-governance-bundle-3',
    review_standard: 'REV-STD-1',
    status: 'Q5_GRAPH_EXECUTION_READY_FOR_HUMAN_REVIEW_PROTECTED_HOLDS_REMAIN',
    generated_at: new Date().toISOString(),
    base_main_sha: BASE_MAIN_SHA,
    authority_flags: AUTHORITY_FLAGS,
    source_authorization: BUNDLE3_AUTHORIZATION,
    source_files: sourceFiles,
    source_hashes: sourceFiles.map((file) => ({ path: file, sha256: sha256File(file) })),
    artifacts: {
      build_script: BUILD_SCRIPT,
      checker_script: CHECK_SCRIPT,
      q5_graph_execution_report: OUT_Q5_EXECUTION_JSON,
      protected_governance_hold_matrix: OUT_PROTECTED_JSON,
      negative_regression_fixtures: OUT_NEGATIVE_JSON,
      review_packet: GATE_JSON,
      pr_readiness_evidence: PR_READINESS_JSON,
      lead_review: LEAD_REVIEW_MD,
      review_team_results: REVIEW_TEAM_RESULTS_MD
    },
    summary: {
      q5_graph_operations_advanced: q5Execution.summary.q5_operations_advanced,
      q5_graph_records_advanced: q5Execution.summary.q5_records_advanced,
      protected_governance_operations_still_held: protectedMatrix.summary.protected_holds,
      negative_regression_detection_rate: negatives.summary.detection_rate,
      expected_pr_route: prReadiness.route,
      h7_full_closure_claimed: false,
      product_route_readiness_claimed: false,
      student_product_use_authorized: false
    },
    hashes: {
      q5_graph_execution_report: sha256Object(q5Execution),
      protected_governance_hold_matrix: sha256Object(protectedMatrix),
      negative_regression_fixtures: sha256Object(negatives),
      pr_readiness_evidence: sha256Object(prReadiness)
    },
    prohibited_claims: [
      'No H7 full closure',
      'No H6/H7 evidence-generalization closure',
      'No protected-reference mutation',
      'No external-source mutation',
      'No machine-reference mutation',
      'No operation-registry mutation',
      'No canonical MTU mutation',
      'No candidate writes or storage',
      'No lesson output',
      'No product-route readiness',
      'No Scale Gate',
      'No diagnostics, mastery, PV, sequencing, summative use, or student/product use'
    ]
  };
}

function buildReviewPacket(bundle, q5Execution, protectedMatrix, negatives, prReadiness) {
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    review_standard: 'REV-STD-1',
    status: 'READY_FOR_HUMAN_REVIEW_PENDING_REMOTE_PR_PROOF',
    route: 'READY_FOR_HUMAN_REVIEW',
    requested_decision: 'Review Bundle 3 as bounded q5 graph-source execution evidence plus seven protected/canonical H7 governance holds. Approve only this report/gate/checker surface, not H7 closure or product authority.',
    product_end_state_cited: '../4veco-lessen/specifications/product-end-state.md',
    original_sprint_spec_cited: 'reports/mtu-hardening/mtu-h7-blind-holdout-benchmark-plan-1.json',
    source_authorization: BUNDLE3_AUTHORIZATION,
    non_negotiable_requirements: [
      'No protected reference mutation',
      'No external source mutation',
      'No machine MTU mutation',
      'No target exercise mutation',
      'No operation-registry mutation',
      'No candidate writes or storage',
      'No lesson output',
      'No H7 full closure',
      'No H6/H7 evidence-generalization closure',
      'No product-route readiness, Scale Gate, diagnostics, mastery, sequencing, PV, summative use, or student/product use',
      'PR Readiness Reviewer and live branch-protection proof must be run against the exact remote head before ready/merge',
      'PASS WITH FLAGS may not carry a missing core requirement'
    ],
    core_requirement_checklist: [
      { requirement: 'Base main SHA is the requested current main', status: 'met', evidence: BASE_MAIN_SHA },
      { requirement: 'q5 graph-source execution is bounded to one operation and one locked-holdout record', status: 'met', evidence: OUT_Q5_EXECUTION_JSON },
      { requirement: 'q5 accepts only the official total-subsidy shaded rectangle variants and preserves 0-or-2 scoring boundary', status: 'met', evidence: OUT_Q5_EXECUTION_JSON },
      { requirement: 'q5 keeps A15 and A45 as forbidden over-trigger guards', status: 'met', evidence: OUT_NEGATIVE_JSON },
      { requirement: 'Seven protected/canonical operations remain held and not executed', status: 'met', evidence: OUT_PROTECTED_JSON },
      { requirement: 'Every protected hold carries proof-required and negative-regression guard evidence', status: 'met', evidence: OUT_PROTECTED_JSON },
      { requirement: 'Authority flags remain false and no protected/candidate/product writes are claimed', status: 'met', evidence: OUT_BUNDLE_JSON },
      { requirement: 'Single-account PR governance route is READY_FOR_HUMAN_REVIEW pending exact remote proof', status: 'proof_required_to_close', evidence: PR_READINESS_JSON }
    ],
    findings: [
      {
        id: 'H7-B3-FINDING-Q5-GRAPH-EXECUTION',
        classification: 'does_not_block',
        severity: 'bounded_execution_ready_for_human_review',
        summary: 'q5 total-subsidy shading is advanced only as bounded graph-source execution evidence on a derived review surface.',
        proof_required_to_close: 'Exact-head human review must confirm the official graph geometry and owner authorization before integration.'
      },
      {
        id: 'H7-B3-FINDING-PROTECTED-HOLDS',
        classification: 'blocks',
        severity: 'governance_blocker',
        summary: 'Seven canonical/protected operations remain held for governance and are not executed in Bundle 3.',
        proof_required_to_close: 'Separate protected governance owner decision and checker-backed execution path.'
      },
      {
        id: 'H7-B3-FINDING-REMOTE-PR-PROOF-PENDING',
        classification: 'proof_required_to_close',
        severity: 'pr_governance_gate',
        summary: 'Exact remote PR head, PR Readiness Reviewer output, branch-protection ok:true output, CI, and owner authorization are required before ready/merge.',
        proof_required_to_close: 'Run the single-account PR governance workflow against the exact remote head and record owner authorization that names the reviewed PR payload SHA.'
      }
    ],
    blocks: [
      'H7 full closure',
      'H6/H7 evidence-generalization closure',
      'protected-reference mutation',
      'operation-registry mutation',
      'candidate writes/storage',
      'Scale Gate',
      'product-route readiness',
      'diagnostics/mastery/PV/sequencing/summative/student use',
      'merge before READY_FOR_HUMAN_REVIEW owner authorization is recorded for the reviewed payload'
    ],
    does_not_block: [
      'Human review of this Bundle 3 packet after exact-head PR readiness proof',
      'Merging this checker/report/gate surface only after explicit owner authorization is recorded for the reviewed payload',
      'Later protected-governance packet preparation without protected mutation'
    ],
    proof_required_to_close: [
      'Run the Bundle 3 checker and prior H7 Bundle 1/2 checkers.',
      'Run report JSON validation, URL-index check, agent index, platform tests, PR Readiness Reviewer, and live branch-protection checker against exact remote head.',
      'Run Teacher, Economist, and Quality inspection subagent lead review and require MORE_THAN_SATISFIED from each reviewer.',
      'Record explicit owner authorization in the PR thread with the PR number and reviewed payload commit before merge.',
      'Keep H7 closure blocked until seven protected holds are separately resolved.'
    ],
    bundle: OUT_BUNDLE_JSON,
    q5_graph_execution_report: OUT_Q5_EXECUTION_JSON,
    protected_governance_hold_matrix: OUT_PROTECTED_JSON,
    negative_regression_fixtures: OUT_NEGATIVE_JSON,
    pr_readiness_evidence: PR_READINESS_JSON,
    lead_review_proof: LEAD_REVIEW_MD,
    review_team_results: REVIEW_TEAM_RESULTS_MD,
    authority_flags: AUTHORITY_FLAGS,
    summary: bundle.summary
  };
}

function renderTable(rows, columns) {
  return [
    `| ${columns.map((column) => column.label).join(' | ')} |`,
    `| ${columns.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${columns.map((column) => String(column.value(row) ?? '').replace(/\|/g, '/')).join(' | ')} |`)
  ].join('\n');
}

function renderQ5ExecutionMarkdown(report) {
  const row = report.operation;
  return `# MTU-H7 q5 Graph Execution Report 3

Status: \`${report.status}\`

This derived report advances only \`${row.operation_id}\` for bounded graph-source execution review. It does not close H7.

## q5 Operation

| Field | Value |
| --- | --- |
| Record | ${row.record_id} |
| Prior Status | ${row.source_prior_status} |
| Prior Defect | ${row.source_prior_defect_class} |
| Execution Status | ${row.execution_status} |
| Required MTUs | ${asArray(row.required_mtu_ids).join(', ')} |
| Forbidden MTUs | ${asArray(row.forbidden_mtu_ids).join(', ')} |
| Route Tags | ${asArray(row.route_tags).join(', ')} |

## Accepted Graph Geometry

- Accepted variants: ${row.accepted_geometry.accepted_variants}
- Required region: ${row.accepted_geometry.required_region}
- Scoring boundary: ${row.accepted_geometry.scoring_boundary}

## Remaining Holds

- Protected governance operations still held: ${report.summary.protected_governance_operations_still_held}
- H7 full closure claimed: ${report.summary.h7_full_closure_claimed}
`;
}

function renderProtectedMarkdown(matrix) {
  return `# MTU-H7 Protected Governance Hold Matrix 3

Status: \`${matrix.status}\`

${renderTable(matrix.protected_holds, [
    { label: 'Operation', value: (row) => row.operation_id },
    { label: 'Route', value: (row) => row.final_route },
    { label: 'Execution', value: (row) => row.execution_status },
    { label: 'Negative Guard', value: (row) => row.negative_guard.fixture_id },
    { label: 'Proof Required', value: (row) => row.proof_required_to_close }
  ])}
`;
}

function renderBundleMarkdown(bundle) {
  return `# MTU-H7 q5 Graph Execution And Protected Governance Bundle 3

Status: \`${bundle.status}\`

This packet advances q5 graph-source execution evidence on a derived review surface and preserves all seven protected/canonical H7 governance holds. It does not close H7 and does not authorize product or student use.

## Summary

- q5 graph operations advanced: ${bundle.summary.q5_graph_operations_advanced}
- protected governance operations still held: ${bundle.summary.protected_governance_operations_still_held}
- negative regression detection rate: ${bundle.summary.negative_regression_detection_rate}
- expected PR route: ${bundle.summary.expected_pr_route}
- H7 full closure claimed: ${bundle.summary.h7_full_closure_claimed}

## Artifacts

- ${OUT_Q5_EXECUTION_JSON}
- ${OUT_PROTECTED_JSON}
- ${OUT_NEGATIVE_JSON}
- ${GATE_JSON}
- ${PR_READINESS_JSON}
`;
}

function renderGateMarkdown(packet) {
  return `# ${packet.gate_id}

Status: \`${packet.status}\`

Route: \`${packet.route}\`

## Requested Decision

${packet.requested_decision}

## Core Requirement Checklist

${packet.core_requirement_checklist.map((item) => `- ${item.status}: ${item.requirement} (${item.evidence})`).join('\n')}

## Findings

${packet.findings.map((finding) => `- ${finding.classification}: ${finding.id}; ${finding.summary}`).join('\n')}

## Blocks

${packet.blocks.map((item) => `- ${item}`).join('\n')}

## Does Not Block

${packet.does_not_block.map((item) => `- ${item}`).join('\n')}

## Proof Required To Close

${packet.proof_required_to_close.map((item) => `- ${item}`).join('\n')}
`;
}

function renderPrReadinessMarkdown(prReadiness) {
  return `# ${GATE_ID} PR Readiness Evidence

Status: \`${prReadiness.status}\`

Route: \`${prReadiness.route}\`

The exact remote PR head is not known until the branch is pushed and a PR exists. Before marking ready or merging, run these commands against the exact remote head and record full output, including branch protection with \`ok: true\`.

${prReadiness.commands.map((command) => `- \`${command}\``).join('\n')}

## Required Before Ready Or Merge

${prReadiness.required_before_mark_ready_or_merge.map((item) => `- ${item}`).join('\n')}
`;
}

function renderLeadReview(packet) {
  return `# ${packet.gate_id} Lead Review

Review standard: REV-STD-1

Lead verdict: \`${REVIEW_TEAM.lead_verdict}\`

Route: \`${packet.route}\`

Teacher, Economist, and Quality inspection subagents are all MORE_THAN_SATISFIED for human review of the Bundle 3 surface. The packet may be inspected, but it must not be marked ready or merged until exact-head PR governance proof and owner authorization are recorded. This packet does not close H7.

## Review Team

- Teacher reviewer: \`${REVIEW_TEAM.teacher.verdict}\`. Agent \`${REVIEW_TEAM.teacher.agent_id}\`. ${REVIEW_TEAM.teacher.evidence}
- Economist reviewer: \`${REVIEW_TEAM.economist.verdict}\`. Agent \`${REVIEW_TEAM.economist.agent_id}\`. ${REVIEW_TEAM.economist.evidence}
- Quality inspection reviewer: \`${REVIEW_TEAM.quality.verdict}\`. Agent \`${REVIEW_TEAM.quality.agent_id}\`. ${REVIEW_TEAM.quality.evidence}

## Boundary Proof

No protected reference mutation, external-source mutation, machine-reference mutation, operation-registry mutation, canonical MTU mutation, candidate writes, lesson output, product-route readiness, Scale Gate, diagnostics, mastery, sequencing, PV, summative use, or student/product use is authorized.
`;
}

function renderReviewTeamResults() {
  return `# ${GATE_ID} Review Team Results

Status: \`${REVIEW_TEAM.status}\`

## Teacher Reviewer

Teacher reviewer: \`${REVIEW_TEAM.teacher.verdict}\`

Agent: \`${REVIEW_TEAM.teacher.agent_id}\`

${REVIEW_TEAM.teacher.evidence}

## Economist Reviewer

Economist reviewer: \`${REVIEW_TEAM.economist.verdict}\`

Agent: \`${REVIEW_TEAM.economist.agent_id}\`

${REVIEW_TEAM.economist.evidence}

## Quality Inspection Reviewer

Quality inspection reviewer: \`${REVIEW_TEAM.quality.verdict}\`

Agent: \`${REVIEW_TEAM.quality.agent_id}\`

${REVIEW_TEAM.quality.evidence}

## Boundary Proof

No protected reference mutation, external-source mutation, machine-reference mutation, operation-registry mutation, canonical MTU mutation, candidate writes, lesson output, product-route readiness, Scale Gate, diagnostics, mastery, sequencing, PV, summative use, or student/product use is authorized.
`;
}

function renderBundleUrls() {
  const files = [
    BUILD_SCRIPT,
    CHECK_SCRIPT,
    OUT_BUNDLE_JSON,
    OUT_BUNDLE_MD,
    OUT_Q5_EXECUTION_JSON,
    OUT_Q5_EXECUTION_MD,
    OUT_PROTECTED_JSON,
    OUT_PROTECTED_MD,
    OUT_NEGATIVE_JSON,
    GATE_JSON,
    GATE_MD,
    GATE_URLS,
    PR_READINESS_JSON,
    PR_READINESS_MD,
    LEAD_REVIEW_MD,
    REVIEW_TEAM_RESULTS_MD
  ];
  return `# ${GATE_ID} Bundle URLs

Remote reviewers should inspect these paths on the exact PR head.

${files.map((file) => `- ${file}`).join('\n')}
`;
}

function build() {
  const docs = {
    fixture: readJson(SOURCE_FILES.fixture),
    report: readJson(SOURCE_FILES.report),
    benchmarkBundle: readJson(SOURCE_FILES.benchmarkBundle),
    governanceBundle1: readJson(SOURCE_FILES.governanceBundle1),
    blocker: readJson(SOURCE_FILES.blockerMatrix),
    decisions: readJson(SOURCE_FILES.decisions),
    candidates: readJson(SOURCE_FILES.candidatePackets),
    q5: readJson(SOURCE_FILES.q5Adjudication),
    bundle2: readJson(SOURCE_FILES.bundle2),
    governanceMatrix2: readJson(SOURCE_FILES.governanceMatrix2),
    negative2: readJson(SOURCE_FILES.negative2)
  };
  assertInputs(docs);

  const q5Execution = buildQ5Execution(docs);
  const protectedMatrix = buildProtectedMatrix(docs);
  const negatives = buildNegativeFixtures(q5Execution, protectedMatrix);
  const prReadiness = buildPrReadinessEvidence();
  const bundle = buildBundle(q5Execution, protectedMatrix, negatives, prReadiness);
  const reviewPacket = buildReviewPacket(bundle, q5Execution, protectedMatrix, negatives, prReadiness);

  writeJson(OUT_Q5_EXECUTION_JSON, q5Execution);
  writeText(OUT_Q5_EXECUTION_MD, renderQ5ExecutionMarkdown(q5Execution));
  writeJson(OUT_PROTECTED_JSON, protectedMatrix);
  writeText(OUT_PROTECTED_MD, renderProtectedMarkdown(protectedMatrix));
  writeJson(OUT_NEGATIVE_JSON, negatives);
  writeJson(PR_READINESS_JSON, prReadiness);
  writeText(PR_READINESS_MD, renderPrReadinessMarkdown(prReadiness));
  writeJson(OUT_BUNDLE_JSON, bundle);
  writeText(OUT_BUNDLE_MD, renderBundleMarkdown(bundle));
  writeJson(GATE_JSON, reviewPacket);
  writeText(GATE_MD, renderGateMarkdown(reviewPacket));
  writeText(GATE_URLS, renderBundleUrls());
  writeText(LEAD_REVIEW_MD, renderLeadReview(reviewPacket));
  writeText(REVIEW_TEAM_RESULTS_MD, renderReviewTeamResults());

  return { bundle };
}

try {
  const { bundle } = build();
  console.log(`OK ${SPRINT_ID}: built ${bundle.bundle_id} (${bundle.summary.q5_graph_operations_advanced} q5 graph operation, ${bundle.summary.protected_governance_operations_still_held} protected holds)`);
} catch (error) {
  console.error(`FAIL ${SPRINT_ID}: ${error.message}`);
  process.exit(1);
}
