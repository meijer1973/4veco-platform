#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H7-Q5-GRAPH-EXECUTION-AND-PROTECTED-GOVERNANCE-BUNDLE-3';
const GATE_ID = 'GATE-MTU-H7-q5-graph-execution-and-protected-governance-bundle-3';
const BASE_MAIN_SHA = 'cd0e6a3f4f3883f8741a57641c12f7d33ef80fe1';

const BUILD_SCRIPT = 'build-scripts/references/build-mtu-h7-q5-graph-execution-and-protected-governance-bundle-3.js';
const CHECK_SCRIPT = 'build-scripts/references/check-mtu-h7-q5-graph-execution-and-protected-governance-bundle-3.js';
const BUNDLE_JSON = 'reports/mtu-hardening/mtu-h7-q5-graph-execution-and-protected-governance-bundle-3.json';
const BUNDLE_MD = 'reports/mtu-hardening/mtu-h7-q5-graph-execution-and-protected-governance-bundle-3.md';
const Q5_EXECUTION_JSON = 'reports/mtu-hardening/mtu-h7-q5-graph-execution-report-3.json';
const Q5_EXECUTION_MD = 'reports/mtu-hardening/mtu-h7-q5-graph-execution-report-3.md';
const PROTECTED_JSON = 'reports/mtu-hardening/mtu-h7-protected-governance-hold-matrix-3.json';
const PROTECTED_MD = 'reports/mtu-hardening/mtu-h7-protected-governance-hold-matrix-3.md';
const NEGATIVE_JSON = 'reports/mtu-hardening/mtu-h7-bundle3-negative-regression-fixtures.json';
const GATE_JSON = `reports/review-gates/${GATE_ID}/review-packet.json`;
const GATE_MD = `reports/review-gates/${GATE_ID}/review-packet.md`;
const GATE_URLS = `reports/review-gates/${GATE_ID}/bundle-urls.md`;
const PR_READINESS_JSON = `reports/review-gates/${GATE_ID}/pr-readiness-evidence.json`;
const PR_READINESS_MD = `reports/review-gates/${GATE_ID}/pr-readiness-evidence.md`;
const LEAD_REVIEW_MD = `reports/review-gates/${GATE_ID}/lead-review.md`;
const REVIEW_TEAM_RESULTS_MD = `reports/review-gates/${GATE_ID}/review-team-results.md`;

const Q5_OPERATION_ID = 'h7-vw25-2-q5-total-subsidy-shading';
const Q5_RECORD_ID = 'vw-1022-a-25-2-o:opgave-1:question-5';

const PROTECTED_OPERATION_IDS = Object.freeze([
  'h7-ha23-2-q15-net-ratio-nivellering',
  'h7-ha24-1-q12-snel-residual-payoff',
  'h7-ha24-1-q12-sprinter-margin-payoff',
  'h7-vw23-2-q20-game-tree-nash',
  'h7-vw24-1-q17-insurance-cost-benefit',
  'h7-vw24-2-q15-ga-mb-first-adjustment',
  'h7-vw24-2-q15-ga-mb-second-adjustment-and-table'
]);

const EXPECTED_Q5 = Object.freeze({
  required_mtu_ids: ['A27', 'A40', 'A58', 'A81'],
  answer_form_mtu_ids: ['A40'],
  forbidden_mtu_ids: ['A15', 'A45'],
  forbidden_route_tags: ['elasticity_only', 'full_graph_construction'],
  route_tags: ['graph_shading', 'producer_subsidy', 'subsidy_area', 'source_reading', 'answer_form', 'procedure'],
  misconception_ref: 'reports/mtu-hardening/mtu-h7-execution-benchmark-bundle-1.json#H7_MISCONCEPTION_Q5_TOTAL_SUBSIDY_AREA_NOT_DWL'
});

const EXPECTED_Q5_NEGATIVES = Object.freeze([
  'h7-bundle3-negative-q5-dwl-instead-of-total-subsidy',
  'h7-bundle3-negative-q5-forbidden-elasticity-or-full-graph-overtrigger'
]);

const EXPECTED_PROTECTED_NEGATIVES = Object.freeze([
  'h7-governance-negative-q15-denivellering-label-reversal',
  'h7-governance-negative-q12-f12-overtrigger-residual',
  'h7-governance-negative-q12-cost-omitted-margin',
  'h7-governance-negative-q20-matrix-shortcut',
  'h7-governance-negative-q17-premium-month-factor-omitted',
  'h7-governance-negative-q15-macro-one-step-only',
  'h7-governance-negative-q15-final-r-pi-omitted'
]);

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

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

function ids(rows, key) {
  return asArray(rows).map((row) => row[key]).sort();
}

function sameSet(actual, expected) {
  return JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort());
}

function evidenceExists(ref) {
  if (typeof ref !== 'string' || ref.length === 0) return false;
  if (/^https?:\/\//.test(ref)) return true;
  return fs.existsSync(repoPath(ref.split('#')[0]));
}

function validate() {
  const failures = [];
  const requiredFiles = [
    BUILD_SCRIPT,
    CHECK_SCRIPT,
    BUNDLE_JSON,
    BUNDLE_MD,
    Q5_EXECUTION_JSON,
    Q5_EXECUTION_MD,
    PROTECTED_JSON,
    PROTECTED_MD,
    NEGATIVE_JSON,
    GATE_JSON,
    GATE_MD,
    GATE_URLS,
    PR_READINESS_JSON,
    PR_READINESS_MD,
    LEAD_REVIEW_MD,
    REVIEW_TEAM_RESULTS_MD
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(repoPath(file))) failures.push(`missing artifact: ${file}`);
  }
  if (failures.length) return { ok: false, failures, summary: {} };

  const bundle = readJson(BUNDLE_JSON);
  const q5 = readJson(Q5_EXECUTION_JSON);
  const protectedMatrix = readJson(PROTECTED_JSON);
  const negatives = readJson(NEGATIVE_JSON);
  const gate = readJson(GATE_JSON);
  const prReadiness = readJson(PR_READINESS_JSON);
  const gateMd = readText(GATE_MD);
  const urls = readText(GATE_URLS);
  const leadReview = readText(LEAD_REVIEW_MD);
  const reviewTeam = readText(REVIEW_TEAM_RESULTS_MD);

  for (const [name, doc] of [
    ['bundle', bundle],
    ['q5', q5],
    ['protectedMatrix', protectedMatrix],
    ['negatives', negatives],
    ['gate', gate],
    ['prReadiness', prReadiness]
  ]) {
    if (doc.sprint_id !== SPRINT_ID) failures.push(`${name} sprint_id mismatch`);
    if (doc.review_standard !== 'REV-STD-1') failures.push(`${name} review_standard must be REV-STD-1`);
    if (doc.base_main_sha && doc.base_main_sha !== BASE_MAIN_SHA) failures.push(`${name} base_main_sha mismatch`);
    if (!allFalse(doc.authority_flags)) failures.push(`${name} authority flags must all be false`);
  }

  if (bundle.bundle_id !== 'mtu-h7-q5-graph-execution-and-protected-governance-bundle-3') failures.push('bundle_id mismatch');
  if (bundle.status !== 'Q5_GRAPH_EXECUTION_READY_FOR_HUMAN_REVIEW_PROTECTED_HOLDS_REMAIN') failures.push(`bundle status mismatch: ${bundle.status}`);
  if (gate.gate_id !== GATE_ID) failures.push('gate_id mismatch');
  if (gate.route !== 'READY_FOR_HUMAN_REVIEW') failures.push(`gate route mismatch: ${gate.route}`);
  if (gate.status !== 'READY_FOR_HUMAN_REVIEW_PENDING_REMOTE_PR_PROOF') failures.push(`gate status mismatch: ${gate.status}`);
  if (prReadiness.status !== 'PENDING_EXACT_REMOTE_PR_READINESS_PROOF') failures.push(`PR readiness status mismatch: ${prReadiness.status}`);
  if (prReadiness.route !== 'READY_FOR_HUMAN_REVIEW') failures.push('PR readiness route mismatch');
  if (prReadiness.pilot_data?.branch_protection_ok_required !== true) failures.push('branch protection ok:true requirement missing');
  if (prReadiness.pilot_data?.owner_authorization_required !== true) failures.push('owner authorization requirement missing');

  const q5Row = q5.operation || {};
  if (q5Row.operation_id !== Q5_OPERATION_ID) failures.push('q5 operation id mismatch');
  if (q5Row.record_id !== Q5_RECORD_ID) failures.push('q5 record id mismatch');
  if (q5Row.source_prior_status !== 'review_required') failures.push('q5 prior status must be review_required');
  if (q5Row.source_prior_defect_class !== 'evidence_gap') failures.push('q5 prior defect must be evidence_gap');
  if (q5Row.execution_status !== 'bounded_graph_source_execution_for_human_review') failures.push('q5 execution status mismatch');
  if (!sameSet(asArray(q5Row.required_mtu_ids), EXPECTED_Q5.required_mtu_ids)) failures.push('q5 required MTU set drifted');
  if (!sameSet(asArray(q5Row.mapped_mtu_ids), EXPECTED_Q5.required_mtu_ids)) failures.push('q5 mapped MTU set drifted');
  if (!sameSet(asArray(q5Row.answer_form_mtu_ids), EXPECTED_Q5.answer_form_mtu_ids)) failures.push('q5 answer-form MTU set drifted');
  if (!sameSet(asArray(q5Row.forbidden_mtu_ids), EXPECTED_Q5.forbidden_mtu_ids)) failures.push('q5 forbidden MTU set drifted');
  if (!sameSet(asArray(q5Row.forbidden_route_tags), EXPECTED_Q5.forbidden_route_tags)) failures.push('q5 forbidden route tags drifted');
  if (!sameSet(asArray(q5Row.route_tags), EXPECTED_Q5.route_tags)) failures.push('q5 route tags drifted');
  if (!asArray(q5Row.misconception_refs).includes(EXPECTED_Q5.misconception_ref)) failures.push('q5 misconception ref missing');
  if (!asArray(q5Row.accepted_answer_characterization).some((line) => /two correct/i.test(line))) failures.push('q5 two-correct-example text missing');
  if (!asArray(q5Row.accepted_answer_characterization).some((line) => /0 or 2 score/i.test(line))) failures.push('q5 0-or-2 scoring text missing');
  if (!/subsidy wedge between MK and MK-prime/.test(q5Row.accepted_geometry?.required_region || '')) failures.push('q5 accepted geometry text missing');
  if (!asArray(q5Row.review_required_hooks_satisfied_by).some((item) => /exact-head human review/i.test(item))) failures.push('q5 exact-head review hook missing');

  for (const ref of asArray(q5Row.official_evidence_refs)) {
    if (!evidenceExists(ref)) failures.push(`q5 official evidence ref missing: ${ref}`);
  }
  for (const page of [...asArray(q5Row.rendered_prompt_pages), ...asArray(q5Row.rendered_correction_pages)]) {
    if (!evidenceExists(page.rendered_png_path)) failures.push(`q5 rendered evidence missing: ${page.rendered_png_path}`);
  }

  if (q5.summary?.q5_operations_advanced !== 1) failures.push('q5 advanced operation count must be 1');
  if (q5.summary?.protected_governance_operations_still_held !== 7) failures.push('q5 summary must retain seven protected holds');
  if (q5.summary?.h7_full_closure_claimed !== false) failures.push('q5 report must not claim H7 closure');
  if (q5.summary?.product_route_readiness_claimed !== false) failures.push('q5 report must not claim product readiness');

  const protectedHolds = asArray(protectedMatrix.protected_holds);
  if (!sameSet(ids(protectedHolds, 'operation_id'), PROTECTED_OPERATION_IDS)) failures.push('protected hold operation ids drifted');
  if (protectedMatrix.summary?.protected_holds !== 7) failures.push('protected hold count must be 7');
  if (protectedMatrix.summary?.executed_in_this_bundle !== 0) failures.push('protected executions must be zero');
  for (const row of protectedHolds) {
    if (row.execution_status !== 'held_not_executed_in_bundle_3') failures.push(`protected operation not held: ${row.operation_id}`);
    if (!['HOLD_FOR_CANONICAL_MTU_GOVERNANCE', 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE'].includes(row.final_route)) {
      failures.push(`protected route mismatch: ${row.operation_id}`);
    }
    if (!row.proof_required_to_close) failures.push(`protected proof requirement missing: ${row.operation_id}`);
    if (!row.safe_interim_action) failures.push(`protected safe interim action missing: ${row.operation_id}`);
    if (!row.negative_guard?.fixture_id) failures.push(`protected negative guard missing: ${row.operation_id}`);
    if (row.candidate_status !== 'governance_evidence_only_not_candidate_write') failures.push(`protected candidate status drifted: ${row.operation_id}`);
    for (const ref of asArray(row.official_evidence_refs)) {
      if (!evidenceExists(ref)) failures.push(`protected official evidence ref missing: ${row.operation_id} ${ref}`);
    }
  }

  const q5Negatives = asArray(negatives.q5_execution_negative_fixtures);
  const protectedNegatives = asArray(negatives.protected_governance_hold_negative_guards);
  if (!sameSet(ids(q5Negatives, 'fixture_id'), EXPECTED_Q5_NEGATIVES)) failures.push('q5 negative fixture ids drifted');
  if (!sameSet(ids(protectedNegatives, 'fixture_id'), EXPECTED_PROTECTED_NEGATIVES)) failures.push('protected negative fixture ids drifted');
  if (negatives.summary?.total !== 9) failures.push('Bundle 3 must carry 9 negative guards');
  if (negatives.summary?.detection_rate !== 1) failures.push('negative detection rate must be 1');
  for (const fixture of q5Negatives) {
    if (fixture.observed_status !== 'failed') failures.push(`q5 negative fixture did not fail: ${fixture.fixture_id}`);
    if (fixture.detected_with_intended_defect_class !== true) failures.push(`q5 negative fixture not detected: ${fixture.fixture_id}`);
  }
  for (const fixture of protectedNegatives) {
    if (fixture.observed_status !== 'held_not_executed') failures.push(`protected negative guard should remain held: ${fixture.fixture_id}`);
    if (fixture.detected_with_intended_defect_class !== true) failures.push(`protected negative guard not pinned: ${fixture.fixture_id}`);
  }

  for (const entry of asArray(bundle.source_hashes)) {
    if (!entry.path || entry.sha256 !== sha256File(entry.path)) failures.push(`source hash mismatch: ${entry.path}`);
  }
  if (bundle.hashes?.q5_graph_execution_report !== sha256Object(q5)) failures.push('q5 execution hash mismatch');
  if (bundle.hashes?.protected_governance_hold_matrix !== sha256Object(protectedMatrix)) failures.push('protected matrix hash mismatch');
  if (bundle.hashes?.negative_regression_fixtures !== sha256Object(negatives)) failures.push('negative fixtures hash mismatch');
  if (bundle.hashes?.pr_readiness_evidence !== sha256Object(prReadiness)) failures.push('PR readiness hash mismatch');
  if (bundle.summary?.h7_full_closure_claimed !== false) failures.push('bundle must not claim H7 closure');
  if (bundle.summary?.product_route_readiness_claimed !== false) failures.push('bundle must not claim product readiness');
  if (bundle.summary?.student_product_use_authorized !== false) failures.push('bundle must not authorize student/product use');

  for (const file of requiredFiles) {
    if (!urls.includes(file)) failures.push(`bundle URLs missing: ${file}`);
  }
  for (const command of [
    CHECK_SCRIPT,
    'node build-scripts/reports/validate-report-json.js',
    'node build-scripts/sprints/emit-url-index.js --check',
    'npm.cmd run agent:index',
    'npm.cmd run check:platform',
    'npm.cmd run check:branch-protection',
    'npm.cmd run review:pr-readiness'
  ]) {
    if (!JSON.stringify(prReadiness.commands).includes(command)) failures.push(`PR readiness command missing: ${command}`);
  }

  const combinedText = [gateMd, leadReview, reviewTeam].join('\n');
  for (const requiredText of [
    'Review standard: REV-STD-1',
    'Lead verdict: `MORE_THAN_SATISFIED_FOR_HUMAN_REVIEW_NOT_CLOSURE`',
    'Teacher reviewer: `MORE_THAN_SATISFIED`',
    'Economist reviewer: `MORE_THAN_SATISFIED`',
    'Quality inspection reviewer: `MORE_THAN_SATISFIED`',
    'No protected reference mutation',
    'does not close H7',
    'student/product use'
  ]) {
    if (!combinedText.includes(requiredText)) failures.push(`review text missing: ${requiredText}`);
  }
  for (const staleText of [
    'PENDING_SUBAGENT_LEAD_REVIEW',
    'Teacher reviewer: `PENDING`',
    'Economist reviewer: `PENDING`',
    'Quality inspection reviewer: `PENDING`'
  ]) {
    if (combinedText.includes(staleText)) failures.push(`stale review text present: ${staleText}`);
  }

  const serialized = JSON.stringify({ bundle, q5, protectedMatrix, negatives, gate, prReadiness }).replace(/\s/g, '');
  for (const forbidden of [
    '"h7_full_closure_claimed":true',
    '"product_route_readiness_claimed":true',
    '"student_product_use_authorized":true',
    '"protected_reference_mutation_authorized":true',
    '"external_source_mutation_authorized":true',
    '"machine_reference_mutation_authorized":true',
    '"operation_registry_mutation_authorized":true',
    '"candidate_writes_authorized":true',
    '"lesson_output_mutation_authorized":true',
    '"diagnostics_authorized":true',
    '"mastery_authorized":true',
    '"sequencing_authorized":true',
    '"summative_use_authorized":true'
  ]) {
    if (serialized.includes(forbidden)) failures.push(`forbidden true claim present: ${forbidden}`);
  }

  return {
    ok: failures.length === 0,
    failures,
    summary: {
      q5_operations_advanced: q5.summary?.q5_operations_advanced,
      protected_holds: protectedHolds.length,
      negative_guards: negatives.summary?.total,
      route: gate.route,
      lead_review_status: 'MORE_THAN_SATISFIED_FOR_HUMAN_REVIEW_NOT_CLOSURE'
    }
  };
}

const result = validate();
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else if (result.ok) {
  console.log(
    `OK ${SPRINT_ID}: Bundle 3 checked (${result.summary.q5_operations_advanced} q5 graph operation, ${result.summary.protected_holds} protected holds, route ${result.summary.route})`
  );
} else {
  console.error(`FAIL ${SPRINT_ID}: ${result.failures.length} issue(s)`);
  for (const failure of result.failures) console.error(`- ${failure}`);
}
process.exit(result.ok ? 0 : 1);
