#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H7-NONPROTECTED-EXECUTION-AND-PROTECTED-GOVERNANCE-AUTHORIZATION-BUNDLE-2';
const GATE_ID = 'GATE-MTU-H7-nonprotected-execution-and-protected-governance-authorization-bundle-2';

const EXPECTED_PR166 = {
  approval_comment_url: 'https://github.com/meijer1973/4veco-platform/pull/166#issuecomment-4825233240',
  reviewed_head_sha: 'b504e15270c43b9c86ecadba60f8e19968b66d53',
  merge_commit_sha: 'f9c0c027cbfeab2de2aa498db7ab0d6ce2851ad4'
};

const BUNDLE_JSON = 'reports/mtu-hardening/mtu-h7-nonprotected-execution-and-protected-governance-authorization-bundle-2.json';
const BUNDLE_MD = 'reports/mtu-hardening/mtu-h7-nonprotected-execution-and-protected-governance-authorization-bundle-2.md';
const EXECUTION_JSON = 'reports/mtu-hardening/mtu-h7-nonprotected-execution-report-2.json';
const EXECUTION_MD = 'reports/mtu-hardening/mtu-h7-nonprotected-execution-report-2.md';
const GOVERNANCE_JSON = 'reports/mtu-hardening/mtu-h7-protected-governance-authorization-matrix-2.json';
const GOVERNANCE_MD = 'reports/mtu-hardening/mtu-h7-protected-governance-authorization-matrix-2.md';
const NEGATIVE_JSON = 'reports/mtu-hardening/mtu-h7-nonprotected-negative-regression-fixtures-2.json';
const GATE_JSON = `reports/review-gates/${GATE_ID}/review-packet.json`;
const GATE_MD = `reports/review-gates/${GATE_ID}/review-packet.md`;
const GATE_URLS = `reports/review-gates/${GATE_ID}/bundle-urls.md`;
const LEAD_REVIEW_MD = `reports/review-gates/${GATE_ID}/lead-review.md`;
const REVIEW_TEAM_RESULTS_MD = `reports/review-gates/${GATE_ID}/review-team-results.md`;
const BUILD_SCRIPT = 'build-scripts/references/build-mtu-h7-nonprotected-execution-and-protected-governance-authorization-bundle-2.js';
const CHECK_SCRIPT = 'build-scripts/references/check-mtu-h7-nonprotected-execution-and-protected-governance-authorization-bundle-2.js';

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

const EXPECTED_Q4 = {
  'h7-vw25-2-q4-go-line-with-consumer-subsidy': {
    required_mtu_ids: ['A27', 'A42', 'A40', 'A89', 'A81'],
    answer_form_mtu_ids: ['A40'],
    forbidden_mtu_ids: ['A15'],
    route_tags: ['graph_drawing', 'subsidy_shift', 'go_line', 'source_reading', 'answer_form', 'procedure'],
    misconception_ref: 'reports/mtu-hardening/mtu-h7-execution-benchmark-bundle-1.json#H7_MISCONCEPTION_Q4_SHIFT_ONLY_ONE_REVENUE_LINE'
  },
  'h7-vw25-2-q4-mo-line-with-consumer-subsidy': {
    required_mtu_ids: ['A27', 'A42', 'A40', 'A90', 'A81'],
    answer_form_mtu_ids: ['A40'],
    forbidden_mtu_ids: ['A15'],
    route_tags: ['graph_drawing', 'subsidy_shift', 'mo_line', 'source_reading', 'answer_form', 'procedure'],
    misconception_ref: 'reports/mtu-hardening/mtu-h7-execution-benchmark-bundle-1.json#H7_MISCONCEPTION_Q4_MO_NOT_SHIFTED_WITH_GO'
  }
};

const EXPECTED_NEGATIVES = {
  'h7-bundle2-negative-q4-go-without-mo-pair': {
    defect_class: 'answer_form_gap',
    mutation: 'Accept GO subsidy-line drawing while omitting the paired MO-line shift.',
    detection_rule: 'q4 execution requires both GO and MO operations plus A89/A90 and go_line/mo_line evidence.'
  },
  'h7-bundle2-negative-q4-mo-left-original': {
    defect_class: 'answer_form_gap',
    mutation: 'Move GO correctly but leave MO in its original position.',
    detection_rule: 'MO must shift consistently with the subsidy-adjusted GO line.'
  },
  'h7-bundle2-negative-q4-elasticity-overtrigger': {
    defect_class: 'over_trigger',
    mutation: 'Add forbidden A15 elasticity coverage to close the graph-line drawing operation.',
    detection_rule: 'A15 remains forbidden for both q4 operations and cannot be used as a subsidy-line drawing shortcut.'
  }
};

const EXPECTED_CANDIDATE_GUARDS = [
  'h7-governance-negative-q4-only-one-revenue-line-shifted',
  'h7-governance-negative-q4-mo-not-shifted-with-go'
];

function repoPath(relativePath) {
  return path.join(ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), 'utf8'));
}

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), 'utf8');
}

function sha256File(relativePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(repoPath(relativePath))).digest('hex');
}

function sha256Object(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function evidenceExists(ref) {
  if (typeof ref !== 'string' || ref.length === 0) return false;
  if (/^https?:\/\//.test(ref)) return true;
  return fs.existsSync(repoPath(ref.split('#')[0]));
}

function ids(rows, key) {
  return asArray(rows).map((row) => row[key]).sort();
}

function sameSet(actual, expected) {
  return JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort());
}

function validate() {
  const failures = [];
  const requiredFiles = [
    BUILD_SCRIPT,
    CHECK_SCRIPT,
    BUNDLE_JSON,
    BUNDLE_MD,
    EXECUTION_JSON,
    EXECUTION_MD,
    GOVERNANCE_JSON,
    GOVERNANCE_MD,
    NEGATIVE_JSON,
    GATE_JSON,
    GATE_MD,
    GATE_URLS,
    LEAD_REVIEW_MD,
    REVIEW_TEAM_RESULTS_MD
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(repoPath(file))) failures.push(`missing artifact: ${file}`);
  }
  if (failures.length) return { ok: false, failures, summary: {} };

  const bundle = readJson(BUNDLE_JSON);
  const execution = readJson(EXECUTION_JSON);
  const governance = readJson(GOVERNANCE_JSON);
  const negatives = readJson(NEGATIVE_JSON);
  const gate = readJson(GATE_JSON);
  const leadReview = readText(LEAD_REVIEW_MD);
  const reviewTeam = readText(REVIEW_TEAM_RESULTS_MD);
  const urls = readText(GATE_URLS);

  for (const [name, doc] of [
    ['bundle', bundle],
    ['execution', execution],
    ['governance', governance],
    ['negatives', negatives],
    ['gate', gate]
  ]) {
    if (doc.sprint_id !== SPRINT_ID) failures.push(`${name} sprint_id mismatch`);
    if (doc.review_standard !== 'REV-STD-1') failures.push(`${name} review_standard must be REV-STD-1`);
    if (!allFalse(doc.authority_flags)) failures.push(`${name} authority flags must all be false`);
  }

  if (gate.gate_id !== GATE_ID) failures.push('gate_id mismatch');
  if (gate.route !== 'READY_FOR_HUMAN_REVIEW') failures.push(`gate route mismatch: ${gate.route}`);
  if (bundle.status !== 'PARTIAL_NONPROTECTED_Q4_EXECUTION_COMPLETE_H7_STILL_HELD') {
    failures.push(`bundle status mismatch: ${bundle.status}`);
  }
  if (execution.status !== 'q4_bounded_reviewed_equivalent_execution_complete_h7_still_held') {
    failures.push(`execution status mismatch: ${execution.status}`);
  }
  if (governance.status !== 'protected_and_graph_governance_paths_authorized_not_executed') {
    failures.push(`governance status mismatch: ${governance.status}`);
  }
  if (negatives.status !== 'negative_regression_guards_detect_expected_q4_defects') {
    failures.push(`negative fixture status mismatch: ${negatives.status}`);
  }

  for (const [name, doc] of [
    ['bundle', bundle],
    ['execution', execution],
    ['governance', governance],
    ['gate', gate]
  ]) {
    const source = doc.source_authorization;
    if (!source) failures.push(`${name} missing source_authorization`);
    if (source?.approval_comment_url !== EXPECTED_PR166.approval_comment_url) failures.push(`${name} approval comment mismatch`);
    if (source?.reviewed_head_sha !== EXPECTED_PR166.reviewed_head_sha) failures.push(`${name} reviewed head mismatch`);
    if (source?.merge_commit_sha !== EXPECTED_PR166.merge_commit_sha) failures.push(`${name} merge commit mismatch`);
  }

  const executedOperations = asArray(execution.operations);
  if (!sameSet(ids(executedOperations, 'operation_id'), Q4_OPERATION_IDS)) {
    failures.push('execution must contain exactly the two q4 operations');
  }
  if (execution.summary.bounded_reviewed_equivalent_operations_executed !== 2) failures.push('q4 executed operation count must be 2');
  if (execution.summary.bounded_reviewed_equivalent_records_executed !== 1) failures.push('q4 executed record count must be 1');
  if (execution.summary.remaining_review_required_operations !== 8) failures.push('remaining review-required operations must be 8');
  if (execution.summary.remaining_review_required_records !== 6) failures.push('remaining review-required records must be 6');
  if (execution.summary.protected_governance_operations_still_held !== 7) failures.push('protected operation hold count must be 7');
  if (execution.summary.graph_source_operations_still_held !== 1) failures.push('graph-source hold count must be 1');
  if (execution.summary.h7_full_closure_claimed !== false) failures.push('execution must not claim H7 full closure');

  for (const row of executedOperations) {
    const expected = EXPECTED_Q4[row.operation_id];
    if (!expected) failures.push(`unexpected q4 operation: ${row.operation_id}`);
    if (row.execution_status !== 'bounded_reviewed_equivalent_applied') failures.push(`q4 operation not executed as bounded equivalent: ${row.operation_id}`);
    if (row.source_prior_status !== 'review_required') failures.push(`q4 prior status must be review_required: ${row.operation_id}`);
    if (row.source_prior_defect_class !== 'answer_form_gap') failures.push(`q4 prior defect must be answer_form_gap: ${row.operation_id}`);
    if (!asArray(row.review_required_hooks_satisfied_by).includes(EXPECTED_PR166.approval_comment_url)) {
      failures.push(`q4 operation missing PR #166 approval proof: ${row.operation_id}`);
    }
    if (expected && !sameSet(asArray(row.required_mtu_ids), expected.required_mtu_ids)) {
      failures.push(`q4 required MTU set drifted: ${row.operation_id}`);
    }
    if (expected && !sameSet(asArray(row.mapped_mtu_ids), expected.required_mtu_ids)) {
      failures.push(`q4 mapped MTU set drifted: ${row.operation_id}`);
    }
    if (expected && !sameSet(asArray(row.answer_form_mtu_ids), expected.answer_form_mtu_ids)) {
      failures.push(`q4 answer-form MTU set drifted: ${row.operation_id}`);
    }
    if (expected && !sameSet(asArray(row.forbidden_mtu_ids), expected.forbidden_mtu_ids)) {
      failures.push(`q4 forbidden MTU set drifted: ${row.operation_id}`);
    }
    if (expected && !sameSet(asArray(row.route_tags), expected.route_tags)) {
      failures.push(`q4 route-tag set drifted: ${row.operation_id}`);
    }
    if (expected && !asArray(row.misconception_refs).includes(expected.misconception_ref)) {
      failures.push(`q4 misconception ref missing: ${row.operation_id}`);
    }
    if (!sameSet(asArray(row.negative_guard_ids), EXPECTED_CANDIDATE_GUARDS)) {
      failures.push(`q4 candidate negative guard ids drifted: ${row.operation_id}`);
    }
    if (!asArray(row.forbidden_mtu_ids).includes('A15')) failures.push(`q4 operation must retain A15 forbidden guard: ${row.operation_id}`);
    for (const id of asArray(row.required_mtu_ids)) {
      if (!asArray(row.mapped_mtu_ids).includes(id)) failures.push(`q4 required MTU not mapped: ${row.operation_id} ${id}`);
    }
    for (const ref of asArray(row.official_evidence_refs)) {
      if (!evidenceExists(ref)) failures.push(`q4 official evidence ref missing: ${row.operation_id} ${ref}`);
    }
    for (const page of [...asArray(row.rendered_prompt_pages), ...asArray(row.rendered_correction_pages)]) {
      if (!evidenceExists(page.rendered_png_path)) failures.push(`q4 rendered evidence missing: ${row.operation_id} ${page.rendered_png_path}`);
    }
  }

  if (execution.q4_record_execution?.post_execution_status !== 'passed_for_bounded_q4_reviewed_equivalent_only') {
    failures.push('q4 record must pass only for bounded reviewed-equivalent execution');
  }
  for (const guard of ['go_line', 'mo_line', 'A89', 'A90']) {
    if (!asArray(execution.q4_record_execution?.required_pair_guards).includes(guard)) {
      failures.push(`q4 pair guard missing: ${guard}`);
    }
  }

  const protectedHolds = asArray(governance.protected_holds);
  if (!sameSet(ids(protectedHolds, 'operation_id'), PROTECTED_OPERATION_IDS)) {
    failures.push('protected governance matrix must contain exactly seven protected operations');
  }
  for (const row of protectedHolds) {
    if (row.execution_status !== 'held_not_executed') failures.push(`protected operation was not held: ${row.operation_id}`);
    if (!['HOLD_FOR_CANONICAL_MTU_GOVERNANCE', 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE'].includes(row.final_route)) {
      failures.push(`protected route mismatch: ${row.operation_id}`);
    }
    if (!row.proof_required_to_close) failures.push(`protected hold missing proof requirement: ${row.operation_id}`);
    if (!row.negative_guard?.fixture_id) failures.push(`protected hold missing negative guard: ${row.operation_id}`);
  }

  if (governance.q5_graph_hold?.operation_id !== Q5_OPERATION_ID) failures.push('q5 graph hold operation mismatch');
  if (governance.q5_graph_hold?.final_route !== 'HOLD_FOR_GRAPH_SOURCE_GOVERNANCE') failures.push('q5 route must remain graph-source hold');
  if (governance.q5_graph_hold?.execution_status !== 'held_until_separate_graph_fixture_execution_authorized_and_checked') {
    failures.push('q5 must remain held until separate graph execution authorization/checking');
  }

  const negativeFixtures = asArray(negatives.fixtures);
  if (negativeFixtures.length !== 3) failures.push('expected three Bundle 2 negative fixtures');
  if (!sameSet(ids(negativeFixtures, 'fixture_id'), Object.keys(EXPECTED_NEGATIVES))) {
    failures.push('Bundle 2 negative fixture ids drifted');
  }
  if (negatives.summary?.detection_rate !== 1) failures.push('negative detection rate must be 1');
  for (const fixture of negativeFixtures) {
    const expected = EXPECTED_NEGATIVES[fixture.fixture_id];
    if (!expected) failures.push(`unexpected negative fixture id: ${fixture.fixture_id}`);
    if (fixture.observed_status !== 'failed') failures.push(`negative fixture did not fail: ${fixture.fixture_id}`);
    if (fixture.detected_with_intended_defect_class !== true) failures.push(`negative fixture not detected: ${fixture.fixture_id}`);
    if (expected && fixture.expected_failure_defect_class !== expected.defect_class) {
      failures.push(`negative fixture defect class drifted: ${fixture.fixture_id}`);
    }
    if (expected && fixture.mutation !== expected.mutation) {
      failures.push(`negative fixture mutation text drifted: ${fixture.fixture_id}`);
    }
    if (expected && fixture.detection_rule !== expected.detection_rule) {
      failures.push(`negative fixture detection rule drifted: ${fixture.fixture_id}`);
    }
  }

  for (const entry of asArray(bundle.source_hashes)) {
    if (!entry.path || entry.sha256 !== sha256File(entry.path)) failures.push(`source hash mismatch: ${entry.path}`);
  }
  if (bundle.hashes?.nonprotected_execution_report !== sha256Object(execution)) failures.push('execution report hash mismatch');
  if (bundle.hashes?.protected_governance_authorization_matrix !== sha256Object(governance)) failures.push('governance matrix hash mismatch');
  if (bundle.hashes?.negative_regression_fixtures !== sha256Object(negatives)) failures.push('negative fixtures hash mismatch');
  if (bundle.summary?.h7_full_closure_claimed !== false) failures.push('bundle must not claim H7 full closure');
  if (bundle.summary?.product_route_readiness_claimed !== false) failures.push('bundle must not claim product-route readiness');

  for (const file of [
    BUILD_SCRIPT,
    CHECK_SCRIPT,
    BUNDLE_JSON,
    BUNDLE_MD,
    EXECUTION_JSON,
    EXECUTION_MD,
    GOVERNANCE_JSON,
    GOVERNANCE_MD,
    NEGATIVE_JSON,
    GATE_JSON,
    GATE_MD,
    LEAD_REVIEW_MD,
    REVIEW_TEAM_RESULTS_MD
  ]) {
    if (!urls.includes(file)) failures.push(`bundle URLs missing: ${file}`);
  }

  const combinedText = [leadReview, reviewTeam].join('\n');
  if (/PENDING_AGENT_TEAM_REVIEW/.test(combinedText)) failures.push('review team results must not be pending');
  for (const requiredText of [
    'Teacher reviewer: `MORE_THAN_SATISFIED`',
    'Economist reviewer: `MORE_THAN_SATISFIED`',
    'Quality inspection reviewer: `MORE_THAN_SATISFIED`',
    'does not close H7',
    'No protected reference mutation'
  ]) {
    if (!combinedText.includes(requiredText)) failures.push(`review proof missing text: ${requiredText}`);
  }

  const serialized = JSON.stringify({ bundle, execution, governance, negatives, gate });
  for (const forbidden of [
    '"h7_full_closure_claimed":true',
    '"product_route_readiness_claimed":true',
    '"protected_reference_mutation_authorized":true',
    '"operation_registry_mutation_authorized":true',
    '"candidate_writes_authorized":true',
    '"student_product_use_authorized":true'
  ]) {
    if (serialized.replace(/\s/g, '').includes(forbidden)) failures.push(`forbidden true claim present: ${forbidden}`);
  }

  return {
    ok: failures.length === 0,
    failures,
    summary: {
      q4_operations_executed: executedOperations.length,
      protected_holds: protectedHolds.length,
      negative_fixtures: negativeFixtures.length,
      status: bundle.status
    }
  };
}

const result = validate();
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else if (result.ok) {
  console.log(
    `OK ${SPRINT_ID}: Bundle 2 checked (${result.summary.q4_operations_executed} q4 operations, ${result.summary.protected_holds} protected holds)`
  );
} else {
  console.error(`FAIL ${SPRINT_ID}: ${result.failures.length} issue(s)`);
  for (const failure of result.failures) console.error(`- ${failure}`);
}
process.exit(result.ok ? 0 : 1);
