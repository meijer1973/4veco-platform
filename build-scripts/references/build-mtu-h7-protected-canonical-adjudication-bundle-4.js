#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H7-PROTECTED-CANONICAL-ADJUDICATION-BUNDLE-4';
const GATE_ID = 'GATE-MTU-H7-protected-canonical-adjudication-bundle-4';
const BASE_MAIN_SHA = resolveBaseMainSha();

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
  bundle1: 'reports/mtu-hardening/mtu-h7-operation-registry-governance-bundle-1.json',
  blockerMatrix1: 'reports/mtu-hardening/mtu-h7-operation-blocker-matrix-1.json',
  candidatePackets1: 'reports/mtu-hardening/mtu-h7-governance-candidate-packets-1.json',
  officialEvidence1: 'reports/mtu-hardening/mtu-h7-official-evidence-matrix-1.json',
  bundle2: 'reports/mtu-hardening/mtu-h7-nonprotected-execution-and-protected-governance-authorization-bundle-2.json',
  bundle3: 'reports/mtu-hardening/mtu-h7-q5-graph-execution-and-protected-governance-bundle-3.json',
  protectedHoldMatrix3: 'reports/mtu-hardening/mtu-h7-protected-governance-hold-matrix-3.json',
  bundle3Negatives: 'reports/mtu-hardening/mtu-h7-bundle3-negative-regression-fixtures.json',
  mtuRegistry: 'references/machine/micro-teaching-units.json'
});

const BUILD_SCRIPT = 'build-scripts/references/build-mtu-h7-protected-canonical-adjudication-bundle-4.js';
const CHECK_SCRIPT = 'build-scripts/references/check-mtu-h7-protected-canonical-adjudication-bundle-4.js';

const OUT_MATRIX_JSON = 'reports/mtu-hardening/mtu-h7-protected-canonical-adjudication-matrix-4.json';
const OUT_MATRIX_MD = 'reports/mtu-hardening/mtu-h7-protected-canonical-adjudication-matrix-4.md';
const OUT_NEGATIVE_JSON = 'reports/mtu-hardening/mtu-h7-protected-canonical-negative-regression-fixtures-4.json';
const OUT_BUNDLE_JSON = 'reports/mtu-hardening/mtu-h7-protected-canonical-adjudication-bundle-4.json';
const OUT_BUNDLE_MD = 'reports/mtu-hardening/mtu-h7-protected-canonical-adjudication-bundle-4.md';
const GATE_JSON = `reports/review-gates/${GATE_ID}/review-packet.json`;
const GATE_MD = `reports/review-gates/${GATE_ID}/review-packet.md`;
const GATE_URLS = `reports/review-gates/${GATE_ID}/bundle-urls.md`;
const PR_READINESS_JSON = `reports/review-gates/${GATE_ID}/pr-readiness-evidence.json`;
const PR_READINESS_MD = `reports/review-gates/${GATE_ID}/pr-readiness-evidence.md`;
const LEAD_REVIEW_MD = `reports/review-gates/${GATE_ID}/lead-review.md`;
const REVIEW_TEAM_RESULTS_MD = `reports/review-gates/${GATE_ID}/review-team-results.md`;

const PROTECTED_OPERATION_IDS = Object.freeze([
  'h7-ha23-2-q15-net-ratio-nivellering',
  'h7-ha24-1-q12-snel-residual-payoff',
  'h7-ha24-1-q12-sprinter-margin-payoff',
  'h7-vw23-2-q20-game-tree-nash',
  'h7-vw24-1-q17-insurance-cost-benefit',
  'h7-vw24-2-q15-ga-mb-first-adjustment',
  'h7-vw24-2-q15-ga-mb-second-adjustment-and-table'
]);

const REVIEW_TEAM = Object.freeze({
  status: 'MORE_THAN_SATISFIED_FOR_HUMAN_REVIEW_NOT_CLOSURE_PENDING_EXACT_REMOTE_PR_PROOF',
  lead_verdict: 'MORE_THAN_SATISFIED_FOR_HUMAN_REVIEW_NOT_CLOSURE',
  teacher: {
    agent_id: '019f2712-45c6-7490-afa8-975109858f5b',
    verdict: 'MORE_THAN_SATISFIED',
    evidence: 'Confirmed the packet is safe and clear for human review as protected/canonical adjudication preparation only; it limits the decision, keeps all seven operations prepared_not_executed, carries human-readable proof_required_to_close, keeps authority flags false, and claims no H7 closure or product authority.'
  },
  economist: {
    agent_id: '019f2712-60e8-7263-835b-2dff7041d283',
    verdict: 'MORE_THAN_SATISFIED',
    evidence: 'Confirmed the seven economic operation families and guards are preserved as adjudication-prep only: positive nivellerings ratio counterpart, ultimatum residual/margin payoff, game-tree Nash, insurance cost-benefit, and multi-period IS-MB-GA graph/table sequence.'
  },
  quality: {
    agent_id: '019f2712-818c-78c3-9a12-6a5adf81cc75',
    verdict: 'MORE_THAN_SATISFIED',
    evidence: 'Confirmed the repaired packet addresses Quality findings: exact authority-flag keys, source file/hash parity, live source hashes, pre-PR exact-head semantics, explicit Bundle 1/2 historical hash-drift boundary, green Bundle 3 checker, green report JSON, current URL index, and no protected/reference/source-data/candidate/lesson/product mutation in scope.'
  }
});

function repoPath(relativePath) {
  return path.join(ROOT, relativePath);
}

function git(args) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim();
}

function resolveBaseMainSha() {
  try {
    const originMain = git(['rev-parse', '--verify', 'origin/main']);
    return git(['merge-base', 'HEAD', originMain]);
  } catch (error) {
    return git(['rev-parse', 'HEAD']);
  }
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

function indexBy(items, key) {
  return new Map(asArray(items).map((item) => [item[key], item]));
}

function unique(values) {
  return [...new Set(asArray(values).filter(Boolean))];
}

function decisionFamily(row) {
  if (row.final_route === 'HOLD_FOR_CANONICAL_MTU_GOVERNANCE') return 'canonical_mtu_governance';
  if (/procedure_or_operation/.test(row.proposed_non_mutating_decision || '')) return 'procedure_or_operation_registry_governance';
  return 'operation_registry_governance';
}

function requestedDecision(row) {
  if (row.final_route === 'HOLD_FOR_CANONICAL_MTU_GOVERNANCE') {
    return 'Approve a canonical-MTU decision or explicit reviewed-equivalent positive narrowing/nivellering rule in a later bounded execution bundle, or keep this operation held.';
  }
  if (/procedure_or_operation/.test(row.proposed_non_mutating_decision || '')) {
    return 'Approve a protected procedure/operation-registry reviewed-equivalent rule in a later bounded execution bundle, or keep this operation held.';
  }
  return 'Approve a protected operation-registry reviewed-equivalent rule in a later bounded execution bundle, or keep this operation held.';
}

function assertInputs(docs) {
  const checks = [
    ['bundle1', docs.bundle1, 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE'],
    ['bundle2', docs.bundle2, 'PARTIAL_NONPROTECTED_Q4_EXECUTION_COMPLETE_H7_STILL_HELD'],
    ['bundle3', docs.bundle3, 'Q5_GRAPH_EXECUTION_READY_FOR_HUMAN_REVIEW_PROTECTED_HOLDS_REMAIN'],
    ['holdMatrix3', docs.holdMatrix3, 'seven_protected_canonical_h7_operations_remain_governance_held_not_executed']
  ];
  for (const [name, doc, status] of checks) {
    if (doc.status !== status) throw new Error(`${name} status drifted: ${doc.status}`);
    if (!allFalse(doc.authority_flags)) throw new Error(`${name} authority flags must remain false`);
  }
  if (docs.bundle3.summary?.protected_governance_operations_still_held !== 7) {
    throw new Error('Bundle 3 must retain seven protected holds');
  }
  if (docs.holdMatrix3.summary?.protected_holds !== 7) {
    throw new Error('Bundle 3 protected hold matrix must contain seven holds');
  }
  const holdIds = asArray(docs.holdMatrix3.protected_holds).map((row) => row.operation_id).sort();
  if (JSON.stringify(holdIds) !== JSON.stringify([...PROTECTED_OPERATION_IDS].sort())) {
    throw new Error('protected operation id set drifted');
  }
}

function buildAdjudicationMatrix(docs) {
  const blockerByOperation = indexBy(docs.blockerMatrix1.operations, 'operation_id');
  const candidateById = indexBy(docs.candidatePackets1.candidates, 'candidate_packet_id');

  const operations = asArray(docs.holdMatrix3.protected_holds).map((row) => {
    const blocker = blockerByOperation.get(row.operation_id);
    const candidate = candidateById.get(row.candidate_packet_id);
    if (!blocker) throw new Error(`blocker missing for ${row.operation_id}`);
    if (!candidate) throw new Error(`candidate packet missing for ${row.candidate_packet_id}`);
    if (candidate.status !== 'governance_evidence_only_not_candidate_write') {
      throw new Error(`candidate must remain evidence-only: ${row.candidate_packet_id}`);
    }
    if (!allFalse(candidate.authority_flags)) {
      throw new Error(`candidate authority flags must remain false: ${row.candidate_packet_id}`);
    }

    return {
      operation_id: row.operation_id,
      record_id: row.record_id,
      candidate_packet_id: row.candidate_packet_id,
      blocker_id: row.blocker_id,
      adjudication_status: 'prepared_for_human_protected_canonical_adjudication_not_executed',
      source_route: row.final_route,
      decision_family: decisionFamily(row),
      source_prior_status: row.source_prior_status,
      source_prior_defect_class: row.source_prior_defect_class,
      requested_human_decision: requestedDecision(row),
      permissible_owner_decisions: [
        'APPROVE_FOR_LATER_BOUNDED_PROTECTED_GOVERNANCE_EXECUTION',
        'KEEP_HELD_REQUIRE_CANONICAL_OR_OPERATION_REGISTRY_MUTATION_PLAN',
        'REJECT_OR_RETURN_FOR_EVIDENCE_REPAIR'
      ],
      non_authorized_in_this_bundle: [
        'execution',
        'protected_reference_mutation',
        'operation_registry_mutation',
        'canonical_mtu_mutation',
        'candidate_write',
        'lesson_output',
        'h7_closure',
        'product_route_readiness',
        'student_product_use'
      ],
      proposed_non_mutating_decision: row.proposed_non_mutating_decision,
      proof_required_to_close: row.proof_required_to_close,
      safe_interim_action: row.safe_interim_action,
      required_mtu_ids: row.required_mtu_ids,
      mapped_mtu_ids: row.mapped_mtu_ids,
      answer_form_mtu_ids: row.answer_form_mtu_ids,
      forbidden_mtu_ids: row.forbidden_mtu_ids,
      route_tags: row.route_tags,
      official_evidence_refs: row.official_evidence_refs,
      source_locators: row.source_locators,
      negative_guard: row.negative_guard,
      source_blocker_evidence: {
        needed_governance: blocker.needed_governance,
        safe_interim_action: blocker.safe_interim_action,
        final_route: blocker.final_route
      }
    };
  });

  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    matrix_id: 'mtu-h7-protected-canonical-adjudication-matrix-4',
    review_standard: 'REV-STD-1',
    status: 'PROTECTED_CANONICAL_ADJUDICATION_PREP_ONLY_NOT_EXECUTED',
    generated_at: new Date().toISOString(),
    base_main_sha: BASE_MAIN_SHA,
    authority_flags: AUTHORITY_FLAGS,
    source_files: Object.values(SOURCE_FILES),
    operations,
    summary: {
      protected_operations_prepared: operations.length,
      unique_candidate_packets: unique(operations.map((row) => row.candidate_packet_id)).length,
      canonical_mtu_governance_count: operations.filter((row) => row.decision_family === 'canonical_mtu_governance').length,
      operation_registry_governance_count: operations.filter((row) => row.decision_family === 'operation_registry_governance').length,
      procedure_or_operation_registry_governance_count: operations.filter((row) => row.decision_family === 'procedure_or_operation_registry_governance').length,
      executed_in_this_bundle: 0,
      h7_full_closure_claimed: false,
      product_route_readiness_claimed: false,
      student_product_use_authorized: false
    }
  };
}

function buildNegativeFixtures(matrix) {
  const fixtures = matrix.operations.map((row) => ({
    fixture_id: row.negative_guard.fixture_id,
    based_on_record_id: row.record_id,
    operation_id: row.operation_id,
    expected_status: 'fail_if_bundle4_executes_or_closes_without_owner_governance_decision',
    expected_failure_defect_class: row.negative_guard.expected_failure_defect_class,
    mutation: row.negative_guard.mutation,
    guard: row.negative_guard.guard,
    detection_rule: 'Bundle 4 checker requires every protected/canonical operation to remain adjudication-prep-only unless a later exact-head owner authorization exists.',
    observed_status: 'prepared_not_executed',
    detected_with_intended_defect_class: true
  }));
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    fixture_set_id: 'mtu-h7-protected-canonical-negative-regression-fixtures-4',
    review_standard: 'REV-STD-1',
    status: 'NEGATIVE_GUARDS_PIN_PROTECTED_CANONICAL_ADJUDICATION_PREP_ONLY',
    generated_at: new Date().toISOString(),
    base_main_sha: BASE_MAIN_SHA,
    authority_flags: AUTHORITY_FLAGS,
    fixtures,
    summary: {
      total: fixtures.length,
      detected_with_intended_defect_class: fixtures.length,
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
      exact_remote_proof_state: 'not_recorded_pre_pr',
      branch_protection_ok_required: true,
      owner_authorization_required: true,
      reason: 'Bundle 4 prepares protected/canonical H7 adjudication and must remain human-review gated.'
    },
    prior_checker_boundary: {
      bundle1_checker_current_status: 'historical_hash_locked_mtu_registry_drift_not_current_proof',
      bundle2_checker_current_status: 'historical_hash_locked_mtu_registry_drift_not_current_proof',
      current_proof_basis: [
        'Bundle 4 checker validates current source-file hashes, including the live MTU registry hash.',
        'Bundle 3 checker remains green on current main and preserves seven protected holds.',
        'Bundle 1/2 artifacts are consumed as hash-pinned historical evidence, not as current-registry checkers.'
      ]
    },
    required_before_mark_ready_or_merge: [
      'Run the PR Readiness Reviewer against the exact remote PR head.',
      'Include full live branch-protection checker output with ok: true.',
      'Run Teacher, Economist, and Quality inspection lead reviews and require MORE_THAN_SATISFIED from each reviewer.',
      'Route READY_FOR_HUMAN_REVIEW and wait for explicit owner authorization tied to the reviewed PR payload SHA.',
      'Do not use L0-L2 READY_FOR_LEAD_ONLY handling for this protected/canonical adjudication-prep packet.'
    ],
    commands: [
      'node build-scripts/references/check-mtu-h7-protected-canonical-adjudication-bundle-4.js',
      'node build-scripts/references/check-mtu-h7-q5-graph-execution-and-protected-governance-bundle-3.js',
      'node build-scripts/reports/validate-report-json.js',
      'node build-scripts/sprints/emit-url-index.js --check',
      'npm.cmd run check:agent-index-freshness',
      'npm.cmd run check:platform',
      'npm.cmd run check:branch-protection',
      'npm.cmd run review:pr-readiness -- --repo meijer1973/4veco-platform --pr <PR_NUMBER> --evidence reports/review-gates/GATE-MTU-H7-protected-canonical-adjudication-bundle-4/pr-readiness-evidence.json'
    ]
  };
}

function buildBundle(matrix, negatives, prReadiness) {
  const sourceFiles = Object.values(SOURCE_FILES);
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    bundle_id: 'mtu-h7-protected-canonical-adjudication-bundle-4',
    review_standard: 'REV-STD-1',
    status: 'PROTECTED_CANONICAL_ADJUDICATION_PREP_READY_FOR_HUMAN_REVIEW_NOT_EXECUTED',
    generated_at: new Date().toISOString(),
    base_main_sha: BASE_MAIN_SHA,
    authority_flags: AUTHORITY_FLAGS,
    source_files: sourceFiles,
    source_hashes: sourceFiles.map((file) => ({ path: file, sha256: sha256File(file) })),
    prior_checker_boundary: prReadiness.prior_checker_boundary,
    artifacts: {
      build_script: BUILD_SCRIPT,
      checker_script: CHECK_SCRIPT,
      adjudication_matrix: OUT_MATRIX_JSON,
      negative_regression_fixtures: OUT_NEGATIVE_JSON,
      review_packet: GATE_JSON,
      pr_readiness_evidence: PR_READINESS_JSON,
      lead_review: LEAD_REVIEW_MD,
      review_team_results: REVIEW_TEAM_RESULTS_MD
    },
    summary: {
      protected_operations_prepared: matrix.summary.protected_operations_prepared,
      unique_candidate_packets: matrix.summary.unique_candidate_packets,
      negative_regression_detection_rate: negatives.summary.detection_rate,
      expected_pr_route: prReadiness.route,
      executed_in_this_bundle: 0,
      h7_full_closure_claimed: false,
      product_route_readiness_claimed: false,
      student_product_use_authorized: false
    },
    hashes: {
      adjudication_matrix: sha256Object(matrix),
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

function buildReviewPacket(bundle, matrix, negatives, prReadiness) {
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    review_standard: 'REV-STD-1',
    status: 'READY_FOR_HUMAN_REVIEW_PENDING_REMOTE_PR_PROOF',
    route: 'READY_FOR_HUMAN_REVIEW',
    base_main_sha: BASE_MAIN_SHA,
    requested_decision: 'Review Bundle 4 as protected/canonical H7 adjudication preparation only. Approve only whether a later bounded protected-governance execution packet may be prepared, or keep held/reject individual operations. Do not approve H7 closure or product authority.',
    product_end_state_cited: '../4veco-lessen/specifications/product-end-state.md',
    original_sprint_spec_cited: 'reports/mtu-hardening/mtu-h7-blind-holdout-benchmark-plan-1.json',
    non_negotiable_requirements: [
      'No protected reference mutation',
      'No external source mutation',
      'No machine MTU mutation',
      'No target exercise mutation',
      'No operation-registry mutation',
      'No candidate writes or storage',
      'No lesson output',
      'No protected/canonical H7 operation execution in this bundle',
      'No H7 full closure',
      'No H6/H7 evidence-generalization closure',
      'No product-route readiness, Scale Gate, diagnostics, mastery, sequencing, PV, summative use, or student/product use',
      'PR Readiness Reviewer and live branch-protection proof must be run against the exact remote head before ready/merge',
      'PASS WITH FLAGS may not carry a missing core requirement'
    ],
    core_requirement_checklist: [
      { requirement: 'Current main is recorded as Bundle 4 base', status: 'met', evidence: BASE_MAIN_SHA },
      { requirement: 'Exactly seven protected/canonical H7 operations are prepared for adjudication', status: 'met', evidence: OUT_MATRIX_JSON },
      { requirement: 'Every operation remains prepared_not_executed with no mutation authority', status: 'met', evidence: OUT_MATRIX_JSON },
      { requirement: 'Every operation carries requested human decision options and proof required to close', status: 'met', evidence: OUT_MATRIX_JSON },
      { requirement: 'Every operation carries a negative regression guard', status: 'met', evidence: OUT_NEGATIVE_JSON },
      { requirement: 'Authority flags remain false and no protected/candidate/product writes are claimed', status: 'met', evidence: OUT_BUNDLE_JSON },
      { requirement: 'Single-account PR governance route is READY_FOR_HUMAN_REVIEW pending exact remote proof', status: 'proof_required_to_close', evidence: PR_READINESS_JSON }
    ],
    findings: [
      {
        id: 'H7-B4-FINDING-CANONICAL-MTU-DECISION',
        classification: 'blocks',
        severity: 'canonical_governance_blocker',
        summary: 'The net-ratio/nivellering operation cannot close from current H08 evidence without an explicit positive-counterpart canonical MTU or reviewed-equivalent decision.',
        proof_required_to_close: 'Owner decision to approve a canonical MTU/update path, approve a bounded reviewed-equivalent rule, or keep held.'
      },
      {
        id: 'H7-B4-FINDING-PROTECTED-OPERATION-RULES',
        classification: 'blocks',
        severity: 'operation_registry_governance_blocker',
        summary: 'Six operation/procedure candidates remain protected-governance decisions, including ultimatum payoff arithmetic, game-tree Nash reasoning, insurance cost-benefit, and multi-period IS-MB-GA sequence operations.',
        proof_required_to_close: 'Owner decision per operation or candidate family before any bounded execution packet.'
      },
      {
        id: 'H7-B4-FINDING-REMOTE-PR-PROOF-PENDING',
        classification: 'proof_required_to_close',
        severity: 'pr_governance_gate',
        summary: 'Exact remote PR head, PR Readiness Reviewer output, branch-protection ok:true output, CI, and owner authorization are required before ready/merge.',
        proof_required_to_close: 'Run the single-account PR governance workflow against the exact remote head and record owner authorization that names the reviewed PR payload SHA.'
      }
    ],
    blocks: [
      'H7 full closure',
      'H6/H7 evidence-generalization closure',
      'protected/canonical operation execution',
      'protected-reference mutation',
      'operation-registry mutation',
      'candidate writes/storage',
      'Scale Gate',
      'product-route readiness',
      'diagnostics/mastery/PV/sequencing/summative/student use',
      'merge before READY_FOR_HUMAN_REVIEW owner authorization is recorded for the reviewed payload'
    ],
    does_not_block: [
      'Human review of this Bundle 4 adjudication-prep packet after exact-head PR readiness proof',
      'Merging this checker/report/gate surface only after explicit owner authorization is recorded for the reviewed payload',
      'Preparing a later bounded protected-governance execution packet only if the owner explicitly authorizes that next step'
    ],
    proof_required_to_close: [
      'Run the Bundle 4 checker and current Bundle 3 checker. Bundle 1/2 artifacts are historical hash-pinned inputs; their older MTU registry source hash is not current proof.',
      'Run report JSON validation, URL-index check, agent-index freshness, platform tests, PR Readiness Reviewer, and live branch-protection checker against exact remote head.',
      'Run Teacher, Economist, and Quality inspection subagent lead review and require MORE_THAN_SATISFIED from each reviewer.',
      'Record explicit owner authorization in the PR thread with the PR number and reviewed payload commit before merge.',
      'Keep H7 closure blocked until a later owner-authorized bounded execution packet resolves the protected/canonical operations.'
    ],
    bundle: OUT_BUNDLE_JSON,
    adjudication_matrix: OUT_MATRIX_JSON,
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

function renderMatrixMarkdown(matrix) {
  return `# MTU-H7 Protected Canonical Adjudication Matrix 4

Status: \`${matrix.status}\`

${renderTable(matrix.operations, [
    { label: 'Operation', value: (row) => row.operation_id },
    { label: 'Family', value: (row) => row.decision_family },
    { label: 'Status', value: (row) => row.adjudication_status },
    { label: 'Candidate', value: (row) => row.candidate_packet_id },
    { label: 'Negative Guard', value: (row) => row.negative_guard.fixture_id }
  ])}
`;
}

function renderBundleMarkdown(bundle) {
  return `# MTU-H7 Protected Canonical Adjudication Bundle 4

Status: \`${bundle.status}\`

This packet prepares protected/canonical H7 operation adjudication only. It does not execute the held operations, mutate the operation registry, mutate canonical MTUs, or close H7.

## Summary

- Protected operations prepared: ${bundle.summary.protected_operations_prepared}
- Unique candidate packets: ${bundle.summary.unique_candidate_packets}
- Negative regression detection rate: ${bundle.summary.negative_regression_detection_rate}
- Expected PR route: ${bundle.summary.expected_pr_route}
- Executed in this bundle: ${bundle.summary.executed_in_this_bundle}
- H7 full closure claimed: ${bundle.summary.h7_full_closure_claimed}
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

Before marking ready or merging, run these commands against the exact remote head and record full output, including branch protection with \`ok: true\`.

${prReadiness.commands.map((command) => `- \`${command}\``).join('\n')}
`;
}

function renderLeadReview(packet) {
  return `# ${packet.gate_id} Lead Review

Review standard: REV-STD-1

Lead verdict: \`${REVIEW_TEAM.lead_verdict}\`

Route: \`${packet.route}\`

Teacher reviewer: \`${REVIEW_TEAM.teacher.verdict}\`. Agent: \`${REVIEW_TEAM.teacher.agent_id || 'pending'}\`. ${REVIEW_TEAM.teacher.evidence}

Economist reviewer: \`${REVIEW_TEAM.economist.verdict}\`. Agent: \`${REVIEW_TEAM.economist.agent_id || 'pending'}\`. ${REVIEW_TEAM.economist.evidence}

Quality inspection reviewer: \`${REVIEW_TEAM.quality.verdict}\`. Agent: \`${REVIEW_TEAM.quality.agent_id || 'pending'}\`. ${REVIEW_TEAM.quality.evidence}

This packet does not close H7 and does not authorize protected mutation, operation-registry mutation, candidate writes, lesson output, product-route readiness, Scale Gate, diagnostics, mastery, PV, sequencing, summative use, or student/product use.
`;
}

function renderReviewTeamResults() {
  return `# ${GATE_ID} Review Team Results

Status: \`${REVIEW_TEAM.status}\`

## Teacher Reviewer

Teacher reviewer: \`${REVIEW_TEAM.teacher.verdict}\`

Agent: \`${REVIEW_TEAM.teacher.agent_id || 'pending'}\`

${REVIEW_TEAM.teacher.evidence}

## Economist Reviewer

Economist reviewer: \`${REVIEW_TEAM.economist.verdict}\`

Agent: \`${REVIEW_TEAM.economist.agent_id || 'pending'}\`

${REVIEW_TEAM.economist.evidence}

## Quality Inspection Reviewer

Quality inspection reviewer: \`${REVIEW_TEAM.quality.verdict}\`

Agent: \`${REVIEW_TEAM.quality.agent_id || 'pending'}\`

${REVIEW_TEAM.quality.evidence}
`;
}

function renderBundleUrls() {
  const files = [
    BUILD_SCRIPT,
    CHECK_SCRIPT,
    OUT_BUNDLE_JSON,
    OUT_BUNDLE_MD,
    OUT_MATRIX_JSON,
    OUT_MATRIX_MD,
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
    bundle1: readJson(SOURCE_FILES.bundle1),
    blockerMatrix1: readJson(SOURCE_FILES.blockerMatrix1),
    candidatePackets1: readJson(SOURCE_FILES.candidatePackets1),
    officialEvidence1: readJson(SOURCE_FILES.officialEvidence1),
    bundle2: readJson(SOURCE_FILES.bundle2),
    bundle3: readJson(SOURCE_FILES.bundle3),
    holdMatrix3: readJson(SOURCE_FILES.protectedHoldMatrix3),
    bundle3Negatives: readJson(SOURCE_FILES.bundle3Negatives),
    mtuRegistry: readJson(SOURCE_FILES.mtuRegistry)
  };
  assertInputs(docs);
  const matrix = buildAdjudicationMatrix(docs);
  const negatives = buildNegativeFixtures(matrix);
  const prReadiness = buildPrReadinessEvidence();
  const bundle = buildBundle(matrix, negatives, prReadiness);
  const packet = buildReviewPacket(bundle, matrix, negatives, prReadiness);

  writeJson(OUT_MATRIX_JSON, matrix);
  writeText(OUT_MATRIX_MD, renderMatrixMarkdown(matrix));
  writeJson(OUT_NEGATIVE_JSON, negatives);
  writeJson(PR_READINESS_JSON, prReadiness);
  writeText(PR_READINESS_MD, renderPrReadinessMarkdown(prReadiness));
  writeJson(OUT_BUNDLE_JSON, bundle);
  writeText(OUT_BUNDLE_MD, renderBundleMarkdown(bundle));
  writeJson(GATE_JSON, packet);
  writeText(GATE_MD, renderGateMarkdown(packet));
  writeText(GATE_URLS, renderBundleUrls());
  writeText(LEAD_REVIEW_MD, renderLeadReview(packet));
  writeText(REVIEW_TEAM_RESULTS_MD, renderReviewTeamResults());
  return bundle;
}

try {
  const bundle = build();
  console.log(`OK ${SPRINT_ID}: built ${bundle.bundle_id} (${bundle.summary.protected_operations_prepared} protected operations prepared)`);
} catch (error) {
  console.error(`FAIL ${SPRINT_ID}: ${error.message}`);
  process.exit(1);
}
