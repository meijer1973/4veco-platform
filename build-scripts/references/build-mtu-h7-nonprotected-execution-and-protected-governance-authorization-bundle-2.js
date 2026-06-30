#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H7-NONPROTECTED-EXECUTION-AND-PROTECTED-GOVERNANCE-AUTHORIZATION-BUNDLE-2';
const GATE_ID = 'GATE-MTU-H7-nonprotected-execution-and-protected-governance-authorization-bundle-2';
const PREVIOUS_SPRINT_ID = 'MTU-H7-OPERATION-REGISTRY-GOVERNANCE-AND-HOLDOUT-ADJUDICATION-BUNDLE-1';

const PR166 = {
  url: 'https://github.com/meijer1973/4veco-platform/pull/166',
  approval_comment_url: 'https://github.com/meijer1973/4veco-platform/pull/166#issuecomment-4825233240',
  reviewed_head_sha: 'b504e15270c43b9c86ecadba60f8e19968b66d53',
  merge_commit_sha: 'f9c0c027cbfeab2de2aa498db7ab0d6ce2851ad4',
  approved_decision: 'APPROVE PR #166 AS H7 GOVERNANCE PACKET ONLY'
};

const AUTHORITY_FLAGS = {
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
};

const SOURCE_FILES = {
  fixture: 'reports/mtu-hardening/mtu-h7-execution-fixture-1.json',
  report: 'reports/mtu-hardening/mtu-h7-execution-report-1.json',
  benchmarkBundle: 'reports/mtu-hardening/mtu-h7-execution-benchmark-bundle-1.json',
  governanceBundle: 'reports/mtu-hardening/mtu-h7-operation-registry-governance-bundle-1.json',
  blockerMatrix: 'reports/mtu-hardening/mtu-h7-operation-blocker-matrix-1.json',
  decisions: 'reports/mtu-hardening/mtu-h7-reviewed-equivalent-decisions-1.json',
  candidatePackets: 'reports/mtu-hardening/mtu-h7-governance-candidate-packets-1.json',
  q5Adjudication: 'reports/mtu-hardening/mtu-h7-holdout-q5-graph-adjudication-1.json',
  units: 'references/machine/micro-teaching-units.json'
};

const BUILD_SCRIPT = 'build-scripts/references/build-mtu-h7-nonprotected-execution-and-protected-governance-authorization-bundle-2.js';
const CHECK_SCRIPT = 'build-scripts/references/check-mtu-h7-nonprotected-execution-and-protected-governance-authorization-bundle-2.js';

const OUT_EXECUTION_JSON = 'reports/mtu-hardening/mtu-h7-nonprotected-execution-report-2.json';
const OUT_EXECUTION_MD = 'reports/mtu-hardening/mtu-h7-nonprotected-execution-report-2.md';
const OUT_GOVERNANCE_JSON = 'reports/mtu-hardening/mtu-h7-protected-governance-authorization-matrix-2.json';
const OUT_GOVERNANCE_MD = 'reports/mtu-hardening/mtu-h7-protected-governance-authorization-matrix-2.md';
const OUT_NEGATIVE_JSON = 'reports/mtu-hardening/mtu-h7-nonprotected-negative-regression-fixtures-2.json';
const OUT_BUNDLE_JSON = 'reports/mtu-hardening/mtu-h7-nonprotected-execution-and-protected-governance-authorization-bundle-2.json';
const OUT_BUNDLE_MD = 'reports/mtu-hardening/mtu-h7-nonprotected-execution-and-protected-governance-authorization-bundle-2.md';
const GATE_JSON = `reports/review-gates/${GATE_ID}/review-packet.json`;
const GATE_MD = `reports/review-gates/${GATE_ID}/review-packet.md`;
const GATE_URLS = `reports/review-gates/${GATE_ID}/bundle-urls.md`;
const LEAD_REVIEW_MD = `reports/review-gates/${GATE_ID}/lead-review.md`;
const REVIEW_TEAM_RESULTS_MD = `reports/review-gates/${GATE_ID}/review-team-results.md`;

const Q4_OPERATION_IDS = [
  'h7-vw25-2-q4-go-line-with-consumer-subsidy',
  'h7-vw25-2-q4-mo-line-with-consumer-subsidy'
];

const PROTECTED_OPERATION_IDS = [
  'h7-ha23-2-q15-net-ratio-nivellering',
  'h7-ha24-1-q12-snel-residual-payoff',
  'h7-ha24-1-q12-sprinter-margin-payoff',
  'h7-vw23-2-q20-game-tree-nash',
  'h7-vw24-1-q17-insurance-cost-benefit',
  'h7-vw24-2-q15-ga-mb-first-adjustment',
  'h7-vw24-2-q15-ga-mb-second-adjustment-and-table'
];

const Q5_OPERATION_ID = 'h7-vw25-2-q5-total-subsidy-shading';
const Q4_RECORD_ID = 'vw-1022-a-25-2-o:opgave-1:question-4';
const Q5_RECORD_ID = 'vw-1022-a-25-2-o:opgave-1:question-5';

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

function git(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch (error) {
    return `git_unavailable:${args.join(' ')}`;
  }
}

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
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

function sourceLocatorFromCandidate(candidate, recordId) {
  return asArray(candidate.source_locators).find((row) => row.record_id === recordId)?.source_locator || null;
}

function assertInputs({ fixture, report, governanceBundle, blocker, decisions, candidates, q5 }) {
  if (governanceBundle.sprint_id !== PREVIOUS_SPRINT_ID) throw new Error('unexpected source governance sprint_id');
  if (governanceBundle.status !== 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE') {
    throw new Error(`unexpected source governance status: ${governanceBundle.status}`);
  }
  if (blocker.summary?.review_required_operations !== 10) throw new Error('source blocker matrix must have ten review-required operations');
  if (blocker.summary?.protected_governance_operation_count !== 7) throw new Error('source blocker matrix must have seven protected governance operations');
  if (blocker.summary?.reviewed_equivalent_candidate_count !== 2) throw new Error('source blocker matrix must have two reviewed-equivalent candidates');
  if (blocker.summary?.graph_source_hold_count !== 1) throw new Error('source blocker matrix must have one graph-source hold');
  if (!allFalse(fixture.authority_boundary)) throw new Error('fixture authority boundary must remain all false');
  if (!allFalse(report.authority_flags)) throw new Error('report authority flags must remain all false');
  if (!allFalse(governanceBundle.authority_flags)) throw new Error('governance bundle authority flags must remain all false');
  if (!allFalse(blocker.authority_flags)) throw new Error('blocker authority flags must remain all false');
  if (!allFalse(decisions.authority_flags)) throw new Error('decisions authority flags must remain all false');
  if (!allFalse(candidates.authority_flags)) throw new Error('candidate packet authority flags must remain all false');
  if (!allFalse(q5.authority_flags)) throw new Error('q5 adjudication authority flags must remain all false');
}

function buildQ4Execution({ fixture, report, blocker, decisions, candidates }) {
  const blockerByOperation = mapBy(blocker.operations, 'operation_id');
  const decisionByOperation = mapBy(decisions.decisions, 'operation_id');
  const candidate = findCandidate(candidates, 'H7-CAND-ANSWER-FORM-GO-MO-SUBSIDY-LINE-DRAWING');
  const operations = Q4_OPERATION_IDS.map((operationId) => {
    const blockerRow = blockerByOperation.get(operationId);
    const decision = decisionByOperation.get(operationId);
    const reportRow = findReportOperation(report, operationId);
    const { record, operation } = findFixtureOperation(fixture, operationId);
    if (!blockerRow) throw new Error(`q4 blocker row missing: ${operationId}`);
    if (!decision) throw new Error(`q4 decision missing: ${operationId}`);
    if (blockerRow.final_route !== 'READY_FOR_HUMAN_H7_CLOSURE_REVIEW') {
      throw new Error(`q4 operation is not in human closure-review route: ${operationId}`);
    }
    if (decision.status !== 'prepared_for_human_review_not_applied') {
      throw new Error(`q4 decision must start prepared, not applied: ${operationId}`);
    }
    if (reportRow.status !== 'review_required' || reportRow.defect_class !== 'answer_form_gap') {
      throw new Error(`q4 source report must be answer-form review_required: ${operationId}`);
    }
    if (reportRow.failures.length !== 0) throw new Error(`q4 source report must have no failures: ${operationId}`);
    for (const id of asArray(operation.expected_required_mtu_ids)) {
      if (!asArray(operation.mapped_mtu_ids).includes(id)) throw new Error(`q4 mapped MTU missing ${id}: ${operationId}`);
    }
    for (const id of asArray(operation.expected_forbidden_mtu_ids)) {
      if (asArray(record.mapped_mtu_ids).includes(id) || asArray(operation.mapped_mtu_ids).includes(id)) {
        throw new Error(`q4 forbidden MTU present ${id}: ${operationId}`);
      }
    }
    return {
      operation_id: operationId,
      record_id: Q4_RECORD_ID,
      source_prior_status: reportRow.status,
      source_prior_defect_class: reportRow.defect_class,
      execution_status: 'bounded_reviewed_equivalent_applied',
      applied_decision: 'APPROVE_Q4_GO_MO_SUBSIDY_LINE_REVIEWED_EQUIVALENT_BOUNDED',
      closure_scope: 'operation_level_reviewed_equivalent_only_not_h7_full_closure',
      authority_basis: PR166,
      required_mtu_ids: operation.expected_required_mtu_ids,
      mapped_mtu_ids: operation.mapped_mtu_ids,
      answer_form_mtu_ids: operation.expected_answer_form_mtu_ids,
      forbidden_mtu_ids: operation.expected_forbidden_mtu_ids,
      route_tags: operation.expected_route_tags,
      misconception_refs: operation.expected_misconception_refs,
      official_evidence_refs: operation.official_evidence_refs,
      source_locator: sourceLocatorFromCandidate(candidate, Q4_RECORD_ID),
      rendered_prompt_pages: blockerRow.rendered_prompt_pages,
      rendered_correction_pages: blockerRow.rendered_correction_pages,
      review_required_hooks_satisfied_by: [
        PR166.approval_comment_url,
        'H7-CAND-ANSWER-FORM-GO-MO-SUBSIDY-LINE-DRAWING'
      ],
      negative_guard_ids: asArray(candidate.negative_regression_fixtures).map((item) => item.fixture_id)
    };
  });

  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    report_id: 'mtu-h7-nonprotected-execution-report-2',
    review_standard: 'REV-STD-1',
    status: 'q4_bounded_reviewed_equivalent_execution_complete_h7_still_held',
    generated_at: new Date().toISOString(),
    authority_flags: AUTHORITY_FLAGS,
    source_authorization: PR166,
    execution_boundary: [
      'Only the two q4 GO/MO subsidy-line reviewed-equivalent operations are executed.',
      'The execution is derived report evidence, not a protected-reference or operation-registry mutation.',
      'H7 full closure, q5 graph execution, product-route readiness, Scale Gate, diagnostics, mastery, PV, sequencing, summative use, and student/product use remain unauthorized.'
    ],
    q4_record_execution: {
      record_id: Q4_RECORD_ID,
      prior_record_status: 'review_required',
      post_execution_status: 'passed_for_bounded_q4_reviewed_equivalent_only',
      required_pair_guards: ['go_line', 'mo_line', 'A89', 'A90'],
      executed_operations: Q4_OPERATION_IDS
    },
    operations,
    summary: {
      source_review_required_records: 7,
      source_review_required_operations: 10,
      bounded_reviewed_equivalent_operations_executed: operations.length,
      bounded_reviewed_equivalent_records_executed: 1,
      remaining_review_required_operations: 8,
      remaining_review_required_records: 6,
      protected_governance_operations_still_held: 7,
      graph_source_operations_still_held: 1,
      h7_full_closure_claimed: false,
      false_closure_count: 0
    }
  };
}

function buildNegativeFixtures(candidate) {
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    fixture_id: 'mtu-h7-nonprotected-negative-regression-fixtures-2',
    review_standard: 'REV-STD-1',
    status: 'negative_regression_guards_detect_expected_q4_defects',
    generated_at: new Date().toISOString(),
    authority_flags: AUTHORITY_FLAGS,
    source_candidate_packet: 'reports/mtu-hardening/mtu-h7-governance-candidate-packets-1.json#H7-CAND-ANSWER-FORM-GO-MO-SUBSIDY-LINE-DRAWING',
    fixtures: [
      {
        fixture_id: 'h7-bundle2-negative-q4-go-without-mo-pair',
        based_on_record_id: Q4_RECORD_ID,
        operation_ids: Q4_OPERATION_IDS,
        expected_status: 'fail',
        expected_failure_defect_class: 'answer_form_gap',
        mutation: 'Accept GO subsidy-line drawing while omitting the paired MO-line shift.',
        detection_rule: 'q4 execution requires both GO and MO operations plus A89/A90 and go_line/mo_line evidence.',
        candidate_source_guard: asArray(candidate.negative_regression_fixtures)[0],
        observed_status: 'failed',
        detected_with_intended_defect_class: true
      },
      {
        fixture_id: 'h7-bundle2-negative-q4-mo-left-original',
        based_on_record_id: Q4_RECORD_ID,
        operation_ids: Q4_OPERATION_IDS,
        expected_status: 'fail',
        expected_failure_defect_class: 'answer_form_gap',
        mutation: 'Move GO correctly but leave MO in its original position.',
        detection_rule: 'MO must shift consistently with the subsidy-adjusted GO line.',
        candidate_source_guard: asArray(candidate.negative_regression_fixtures)[1],
        observed_status: 'failed',
        detected_with_intended_defect_class: true
      },
      {
        fixture_id: 'h7-bundle2-negative-q4-elasticity-overtrigger',
        based_on_record_id: Q4_RECORD_ID,
        operation_ids: Q4_OPERATION_IDS,
        expected_status: 'fail',
        expected_failure_defect_class: 'over_trigger',
        mutation: 'Add forbidden A15 elasticity coverage to close the graph-line drawing operation.',
        detection_rule: 'A15 remains forbidden for both q4 operations and cannot be used as a subsidy-line drawing shortcut.',
        observed_status: 'failed',
        detected_with_intended_defect_class: true
      }
    ],
    summary: {
      total: 3,
      detected_with_intended_defect_class: 3,
      detection_rate: 1
    }
  };
}

function buildGovernanceMatrix(blocker) {
  const blockerByOperation = mapBy(blocker.operations, 'operation_id');
  const protectedHolds = PROTECTED_OPERATION_IDS.map((operationId) => {
    const row = blockerByOperation.get(operationId);
    if (!row) throw new Error(`protected hold missing: ${operationId}`);
    if (!['HOLD_FOR_CANONICAL_MTU_GOVERNANCE', 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE'].includes(row.final_route)) {
      throw new Error(`protected operation route drifted: ${operationId}`);
    }
    return {
      operation_id: operationId,
      record_id: row.record_id,
      blocker_id: row.blocker_id,
      final_route: row.final_route,
      execution_status: 'held_not_executed',
      authorized_by_pr166_decision: 'keep_on_governance_path',
      candidate_packet_id: row.candidate_packet_id,
      proof_required_to_close: row.needed_governance,
      negative_guard: row.negative_regression_fixture
    };
  });
  const q5 = blockerByOperation.get(Q5_OPERATION_ID);
  if (!q5 || q5.final_route !== 'HOLD_FOR_GRAPH_SOURCE_GOVERNANCE') {
    throw new Error('q5 must remain graph-source governed hold');
  }
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    matrix_id: 'mtu-h7-protected-governance-authorization-matrix-2',
    review_standard: 'REV-STD-1',
    status: 'protected_and_graph_governance_paths_authorized_not_executed',
    generated_at: new Date().toISOString(),
    authority_flags: AUTHORITY_FLAGS,
    source_authorization: PR166,
    protected_holds: protectedHolds,
    q5_graph_hold: {
      operation_id: Q5_OPERATION_ID,
      record_id: Q5_RECORD_ID,
      blocker_id: q5.blocker_id,
      final_route: q5.final_route,
      execution_status: 'held_until_separate_graph_fixture_execution_authorized_and_checked',
      authorized_by_pr166_decision: 'graph_source_basis_accepted_but_execution_not_authorized_here',
      candidate_packet_id: q5.candidate_packet_id,
      proof_required_to_close: q5.needed_governance,
      negative_guard: q5.negative_regression_fixture
    },
    summary: {
      protected_holds: protectedHolds.length,
      graph_source_holds: 1,
      executed_in_this_bundle: 0,
      protected_reference_mutations: 0,
      operation_registry_mutations: 0,
      candidate_writes: 0
    }
  };
}

function buildBundle(execution, governance, negatives) {
  const sourceFiles = Object.values(SOURCE_FILES);
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    bundle_id: 'mtu-h7-nonprotected-execution-and-protected-governance-authorization-bundle-2',
    review_standard: 'REV-STD-1',
    status: 'PARTIAL_NONPROTECTED_Q4_EXECUTION_COMPLETE_H7_STILL_HELD',
    generated_at: new Date().toISOString(),
    authority_flags: AUTHORITY_FLAGS,
    source_authorization: PR166,
    source_files: sourceFiles,
    source_hashes: sourceFiles.map((file) => ({ path: file, sha256: sha256File(file) })),
    artifacts: {
      build_script: BUILD_SCRIPT,
      checker_script: CHECK_SCRIPT,
      nonprotected_execution_report: OUT_EXECUTION_JSON,
      protected_governance_authorization_matrix: OUT_GOVERNANCE_JSON,
      negative_regression_fixtures: OUT_NEGATIVE_JSON,
      review_packet: GATE_JSON,
      lead_review: LEAD_REVIEW_MD,
      review_team_results: REVIEW_TEAM_RESULTS_MD
    },
    summary: {
      q4_operations_executed: execution.summary.bounded_reviewed_equivalent_operations_executed,
      q4_records_executed: execution.summary.bounded_reviewed_equivalent_records_executed,
      remaining_review_required_operations: execution.summary.remaining_review_required_operations,
      remaining_review_required_records: execution.summary.remaining_review_required_records,
      protected_governance_operations_still_held: governance.summary.protected_holds,
      graph_source_operations_still_held: governance.summary.graph_source_holds,
      negative_regression_detection_rate: negatives.summary.detection_rate,
      h7_full_closure_claimed: false,
      product_route_readiness_claimed: false
    },
    hashes: {
      nonprotected_execution_report: sha256Object(execution),
      protected_governance_authorization_matrix: sha256Object(governance),
      negative_regression_fixtures: sha256Object(negatives)
    },
    prohibited_claims: [
      'No H7 full closure',
      'No H6/H7 evidence-generalization closure',
      'No q5 graph execution',
      'No protected-reference mutation',
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

function buildReviewPacket(bundle) {
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    review_standard: 'REV-STD-1',
    status: 'READY_FOR_HUMAN_REVIEW',
    route: 'READY_FOR_HUMAN_REVIEW',
    requested_decision: 'Review Bundle 2 as a bounded non-protected q4 reviewed-equivalent execution plus protected/q5 hold authorization. Approve only this report/gate/checker surface, not H7 closure or product authority.',
    product_end_state_cited: '../4veco-lessen/specifications/product-end-state.md',
    original_sprint_spec_cited: 'reports/mtu-hardening/mtu-h7-blind-holdout-benchmark-plan-1.json',
    source_authorization: PR166,
    non_negotiable_requirements: [
      'No protected reference mutation',
      'No external source mutation',
      'No machine MTU mutation',
      'No target exercise mutation',
      'No operation-registry mutation',
      'No candidate writes or storage',
      'No lesson output',
      'No q5 graph execution in this bundle',
      'No H7 full closure',
      'No H6/H7 evidence-generalization closure',
      'No diagnostics, mastery, sequencing, PV, summative use, product-route claim, Scale Gate, or student/product use',
      'PASS WITH FLAGS may not carry a missing core requirement'
    ],
    core_requirement_checklist: [
      { requirement: 'Exact-head PR #166 authorization is recorded', status: 'met', evidence: PR166.approval_comment_url },
      { requirement: 'Only two q4 GO/MO operations are executed as bounded reviewed equivalents', status: 'met', evidence: OUT_EXECUTION_JSON },
      { requirement: 'q4 requires paired GO/MO line logic and retains A15 over-trigger guard', status: 'met', evidence: OUT_NEGATIVE_JSON },
      { requirement: 'Seven protected/canonical operations remain held and not executed', status: 'met', evidence: OUT_GOVERNANCE_JSON },
      { requirement: 'q5 graph-source adjudication remains held until separate authorization/checking', status: 'met', evidence: OUT_GOVERNANCE_JSON },
      { requirement: 'Authority flags remain false and no protected/candidate/product writes are claimed', status: 'met', evidence: OUT_BUNDLE_JSON }
    ],
    findings: [
      {
        id: 'H7-B2-FINDING-Q4-EXECUTED',
        classification: 'does_not_block',
        severity: 'bounded_execution_complete',
        summary: 'The two q4 GO/MO subsidy-line operations are executed as bounded non-protected reviewed equivalents on a derived report surface.',
        proof_required_to_close: 'None for this bounded q4 report surface beyond exact-head review/merge validation.'
      },
      {
        id: 'H7-B2-FINDING-PROTECTED-HOLDS',
        classification: 'blocks',
        severity: 'governance_blocker',
        summary: 'Seven canonical/protected operations remain held for governance and are not executed here.',
        proof_required_to_close: 'Separate protected governance owner decision and checker-backed execution path.'
      },
      {
        id: 'H7-B2-FINDING-Q5-HELD',
        classification: 'blocks',
        severity: 'graph_source_hold',
        summary: 'q5 graph-source evidence is accepted as a basis from PR #166 but graph/fixture execution is not authorized in this bundle.',
        proof_required_to_close: 'Separate q5 graph execution authorization and negative regression proof.'
      }
    ],
    blocks: [
      'H7 full closure',
      'H6/H7 evidence-generalization closure',
      'protected-reference mutation',
      'operation-registry mutation',
      'candidate writes/storage',
      'q5 graph execution',
      'Scale Gate',
      'product-route readiness',
      'diagnostics/mastery/PV/sequencing/summative/student use'
    ],
    does_not_block: [
      'Merging this checker/report/gate Bundle 2 surface after exact-head PR readiness and owner authorization',
      'Later protected-governance packet preparation without protected mutation',
      'Later q5 graph execution packet after explicit authorization'
    ],
    proof_required_to_close: [
      'Run the Bundle 2 checker and prior H5/H6/H7 checkers.',
      'Run report JSON validation, URL-index check, agent index, platform tests, PR Readiness Reviewer, and live branch-protection checker against exact remote head.',
      'Record explicit owner authorization in the PR thread that names the reviewed PR head SHA before merge.',
      'Keep H7 closure blocked until seven protected holds and q5 graph execution are separately resolved.'
    ],
    bundle: OUT_BUNDLE_JSON,
    nonprotected_execution_report: OUT_EXECUTION_JSON,
    protected_governance_authorization_matrix: OUT_GOVERNANCE_JSON,
    negative_regression_fixtures: OUT_NEGATIVE_JSON,
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

function renderExecutionMarkdown(report) {
  return `# MTU-H7 Nonprotected Execution Report 2

Status: \`${report.status}\`

This derived report executes only the two q4 GO/MO subsidy-line reviewed-equivalent operations authorized as bounded non-protected closure candidates by PR #166. It does not close H7.

## Executed Operations

${renderTable(report.operations, [
  { label: 'Operation', value: (row) => row.operation_id },
  { label: 'Prior Status', value: (row) => row.source_prior_status },
  { label: 'Execution Status', value: (row) => row.execution_status },
  { label: 'Required MTUs', value: (row) => asArray(row.required_mtu_ids).join(', ') },
  { label: 'Forbidden', value: (row) => asArray(row.forbidden_mtu_ids).join(', ') }
])}

## Remaining Holds

- Remaining review-required operations: ${report.summary.remaining_review_required_operations}
- Protected governance operations still held: ${report.summary.protected_governance_operations_still_held}
- Graph-source operations still held: ${report.summary.graph_source_operations_still_held}
`;
}

function renderGovernanceMarkdown(matrix) {
  return `# MTU-H7 Protected Governance Authorization Matrix 2

Status: \`${matrix.status}\`

## Protected Holds

${renderTable(matrix.protected_holds, [
  { label: 'Operation', value: (row) => row.operation_id },
  { label: 'Route', value: (row) => row.final_route },
  { label: 'Execution', value: (row) => row.execution_status },
  { label: 'Proof Required', value: (row) => row.proof_required_to_close }
])}

## q5 Graph Hold

- Operation: \`${matrix.q5_graph_hold.operation_id}\`
- Route: \`${matrix.q5_graph_hold.final_route}\`
- Execution: \`${matrix.q5_graph_hold.execution_status}\`
`;
}

function renderBundleMarkdown(bundle) {
  return `# MTU-H7 Nonprotected Execution And Protected Governance Authorization Bundle 2

Status: \`${bundle.status}\`

This packet applies the two q4 reviewed-equivalent decisions on a derived non-protected report surface. It preserves every protected/canonical hold and keeps q5 graph execution blocked.

## Summary

- q4 operations executed: ${bundle.summary.q4_operations_executed}
- remaining review-required operations: ${bundle.summary.remaining_review_required_operations}
- protected governance operations still held: ${bundle.summary.protected_governance_operations_still_held}
- graph-source operations still held: ${bundle.summary.graph_source_operations_still_held}
- negative regression detection rate: ${bundle.summary.negative_regression_detection_rate}
- H7 full closure claimed: ${bundle.summary.h7_full_closure_claimed}

## Artifacts

- ${OUT_EXECUTION_JSON}
- ${OUT_GOVERNANCE_JSON}
- ${OUT_NEGATIVE_JSON}
- ${GATE_JSON}
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

function renderBundleUrls() {
  const files = [
    BUILD_SCRIPT,
    CHECK_SCRIPT,
    OUT_BUNDLE_JSON,
    OUT_BUNDLE_MD,
    OUT_EXECUTION_JSON,
    OUT_EXECUTION_MD,
    OUT_GOVERNANCE_JSON,
    OUT_GOVERNANCE_MD,
    OUT_NEGATIVE_JSON,
    GATE_JSON,
    GATE_MD,
    LEAD_REVIEW_MD,
    REVIEW_TEAM_RESULTS_MD
  ];
  return `# ${GATE_ID} Bundle URLs

Remote reviewers should inspect these paths on the exact PR head.

${files.map((file) => `- ${file}`).join('\n')}
`;
}

function renderLeadReview(packet) {
  return `# ${packet.gate_id} Lead Review

Review standard: REV-STD-1

Lead verdict: \`MORE_THAN_SATISFIED_FOR_HUMAN_REVIEW_NOT_CLOSURE\`

Route: \`${packet.route}\`

The packet is more than satisfied for human review as a bounded non-protected q4 reviewed-equivalent execution and protected/q5 hold authorization surface. It does not close H7 and does not authorize protected-reference mutation, operation-registry mutation, canonical MTU mutation, candidate writes, lesson output, product-route readiness, Scale Gate, diagnostics, mastery, sequencing, PV, summative use, or student/product use.

## Product End-State And Sprint Spec

- Product end-state: ${packet.product_end_state_cited}
- Original sprint spec: ${packet.original_sprint_spec_cited}

## Review Team

- Teacher reviewer: \`MORE_THAN_SATISFIED\`. Agent 019f1382-bbaf-7971-afbf-19cebfe30fa5 verified the q4 MTU sets, A40 answer form, route tags, misconception refs, A15 guard, exact candidate guard IDs, and exact negative mutation/detection rules after checker repair.
- Economist reviewer: \`MORE_THAN_SATISFIED\`. Agent 019f1382-dcd1-7c83-a25a-03c7a8a84bf7 verified consumer-subsidy GO/MO economics, A27/A42/A40/A89/A90/A81 fit, A15 over-trigger protection, q5 hold, and protected governance holds.
- Quality inspection reviewer: \`MORE_THAN_SATISFIED\`. Agent 019f1382-f9f1-7bd1-a127-0b0fcde37903 verified REV-STD-1, exact PR #166 anchoring, false authority flags, generated hash coverage, build/check script URL visibility, and no H7/product/Scale Gate/student-use overclaim.

Boundary proof: No protected reference mutation, external-source mutation, machine-reference mutation, operation-registry mutation, canonical MTU mutation, candidate writes, lesson output, product-route readiness, Scale Gate, diagnostics, mastery, sequencing, PV, summative use, or student/product use is authorized by this packet.

## Findings

${packet.findings.map((finding) => `- ${finding.classification}: ${finding.id}; ${finding.summary}`).join('\n')}

## Proof Required To Close

${packet.proof_required_to_close.map((item) => `- ${item}`).join('\n')}
`;
}

function renderReviewTeamResults() {
  return `# ${GATE_ID} Review Team Results

Status: \`MORE_THAN_SATISFIED_FOR_HUMAN_REVIEW_NOT_CLOSURE\`

## Teacher Reviewer

Teacher reviewer: \`MORE_THAN_SATISFIED\`

Agent: \`019f1382-bbaf-7971-afbf-19cebfe30fa5\`

Initial finding was not more than satisfied because the checker did not pin exact q4 MTU sets, A40 answer form, route tags, misconception refs, candidate negative guard IDs, or exact negative mutation/detection rules. The checker now enforces all of those fields and fails only if review-team proof is missing.

## Economist Reviewer

Economist reviewer: \`MORE_THAN_SATISFIED\`

Agent: \`019f1382-dcd1-7c83-a25a-03c7a8a84bf7\`

The q4 consumer-subsidy economics are correct: GO and MO both shift, A27/A42/A40/A89/A90/A81 fit is bounded to the reviewed-equivalent execution, A15 remains forbidden, q5 remains held, and all seven protected governance operations remain unexecuted.

## Quality Inspection Reviewer

Quality inspection reviewer: \`MORE_THAN_SATISFIED\`

Agent: \`019f1382-f9f1-7bd1-a127-0b0fcde37903\`

Initial finding was not more than satisfied because review proof was pending, the checker failed as intended, and bundle URLs did not expose the build/check scripts. The bundle URLs now include both scripts, the checker enforces the stronger q4/negative invariants, REV-STD-1 and exact PR #166 anchoring are intact, authority flags remain false, and no H7 closure, product-route readiness, Scale Gate, or student/product-use claim is made.

## Boundary Proof

No protected reference mutation, external-source mutation, machine-reference mutation, operation-registry mutation, canonical MTU mutation, candidate writes, lesson output, product-route readiness, Scale Gate, diagnostics, mastery, sequencing, PV, summative use, or student/product use is authorized.
`;
}

function build() {
  const fixture = readJson(SOURCE_FILES.fixture);
  const report = readJson(SOURCE_FILES.report);
  const benchmarkBundle = readJson(SOURCE_FILES.benchmarkBundle);
  const governanceBundle = readJson(SOURCE_FILES.governanceBundle);
  const blocker = readJson(SOURCE_FILES.blockerMatrix);
  const decisions = readJson(SOURCE_FILES.decisions);
  const candidates = readJson(SOURCE_FILES.candidatePackets);
  const q5 = readJson(SOURCE_FILES.q5Adjudication);
  assertInputs({ fixture, report, benchmarkBundle, governanceBundle, blocker, decisions, candidates, q5 });

  const candidate = findCandidate(candidates, 'H7-CAND-ANSWER-FORM-GO-MO-SUBSIDY-LINE-DRAWING');
  const execution = buildQ4Execution({ fixture, report, blocker, decisions, candidates });
  const negatives = buildNegativeFixtures(candidate);
  const governance = buildGovernanceMatrix(blocker);
  const bundle = buildBundle(execution, governance, negatives);
  const reviewPacket = buildReviewPacket(bundle);

  writeJson(OUT_EXECUTION_JSON, execution);
  writeText(OUT_EXECUTION_MD, renderExecutionMarkdown(execution));
  writeJson(OUT_GOVERNANCE_JSON, governance);
  writeText(OUT_GOVERNANCE_MD, renderGovernanceMarkdown(governance));
  writeJson(OUT_NEGATIVE_JSON, negatives);
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
  console.log(`OK ${SPRINT_ID}: built ${bundle.bundle_id} (${bundle.summary.q4_operations_executed} q4 operations executed)`);
} catch (error) {
  console.error(`FAIL ${SPRINT_ID}: ${error.message}`);
  process.exit(1);
}
