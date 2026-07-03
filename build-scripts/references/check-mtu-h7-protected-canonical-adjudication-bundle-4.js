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

const REQUIRED_OPERATION_IDS = Object.freeze([
  'h7-ha23-2-q15-net-ratio-nivellering',
  'h7-ha24-1-q12-snel-residual-payoff',
  'h7-ha24-1-q12-sprinter-margin-payoff',
  'h7-vw23-2-q20-game-tree-nash',
  'h7-vw24-1-q17-insurance-cost-benefit',
  'h7-vw24-2-q15-ga-mb-first-adjustment',
  'h7-vw24-2-q15-ga-mb-second-adjustment-and-table'
]);

const EXPECTED_AUTHORITY_FLAGS = Object.freeze({
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

const EXPECTED_SOURCE_FILES = Object.freeze([
  'reports/mtu-hardening/mtu-h7-operation-registry-governance-bundle-1.json',
  'reports/mtu-hardening/mtu-h7-operation-blocker-matrix-1.json',
  'reports/mtu-hardening/mtu-h7-governance-candidate-packets-1.json',
  'reports/mtu-hardening/mtu-h7-official-evidence-matrix-1.json',
  'reports/mtu-hardening/mtu-h7-nonprotected-execution-and-protected-governance-authorization-bundle-2.json',
  'reports/mtu-hardening/mtu-h7-q5-graph-execution-and-protected-governance-bundle-3.json',
  'reports/mtu-hardening/mtu-h7-protected-governance-hold-matrix-3.json',
  'reports/mtu-hardening/mtu-h7-bundle3-negative-regression-fixtures.json',
  'references/machine/micro-teaching-units.json'
]);

const REQUIRED_FILES = Object.freeze([
  'build-scripts/references/build-mtu-h7-protected-canonical-adjudication-bundle-4.js',
  'build-scripts/references/check-mtu-h7-protected-canonical-adjudication-bundle-4.js',
  'reports/mtu-hardening/mtu-h7-protected-canonical-adjudication-bundle-4.json',
  'reports/mtu-hardening/mtu-h7-protected-canonical-adjudication-bundle-4.md',
  'reports/mtu-hardening/mtu-h7-protected-canonical-adjudication-matrix-4.json',
  'reports/mtu-hardening/mtu-h7-protected-canonical-adjudication-matrix-4.md',
  'reports/mtu-hardening/mtu-h7-protected-canonical-negative-regression-fixtures-4.json',
  `reports/review-gates/${GATE_ID}/review-packet.json`,
  `reports/review-gates/${GATE_ID}/review-packet.md`,
  `reports/review-gates/${GATE_ID}/bundle-urls.md`,
  `reports/review-gates/${GATE_ID}/pr-readiness-evidence.json`,
  `reports/review-gates/${GATE_ID}/pr-readiness-evidence.md`,
  `reports/review-gates/${GATE_ID}/lead-review.md`,
  `reports/review-gates/${GATE_ID}/review-team-results.md`
]);

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

function exactAuthorityFlags(flags) {
  return JSON.stringify(Object.keys(flags || {}).sort()) === JSON.stringify(Object.keys(EXPECTED_AUTHORITY_FLAGS).sort()) &&
    Object.entries(EXPECTED_AUTHORITY_FLAGS).every(([key, value]) => flags[key] === value);
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
  for (const file of REQUIRED_FILES) {
    if (!fs.existsSync(repoPath(file))) failures.push(`missing artifact: ${file}`);
  }
  if (failures.length > 0) return { ok: false, failures, summary: {} };

  const bundle = readJson('reports/mtu-hardening/mtu-h7-protected-canonical-adjudication-bundle-4.json');
  const matrix = readJson('reports/mtu-hardening/mtu-h7-protected-canonical-adjudication-matrix-4.json');
  const negatives = readJson('reports/mtu-hardening/mtu-h7-protected-canonical-negative-regression-fixtures-4.json');
  const gate = readJson(`reports/review-gates/${GATE_ID}/review-packet.json`);
  const prReadiness = readJson(`reports/review-gates/${GATE_ID}/pr-readiness-evidence.json`);
  const leadReview = readText(`reports/review-gates/${GATE_ID}/lead-review.md`);
  const reviewTeam = readText(`reports/review-gates/${GATE_ID}/review-team-results.md`);
  const urls = readText(`reports/review-gates/${GATE_ID}/bundle-urls.md`);

  for (const [name, doc] of [
    ['bundle', bundle],
    ['matrix', matrix],
    ['negatives', negatives],
    ['gate', gate],
    ['prReadiness', prReadiness]
  ]) {
    if (doc.sprint_id !== SPRINT_ID) failures.push(`${name} sprint_id mismatch`);
    if (doc.review_standard !== 'REV-STD-1') failures.push(`${name} review_standard must be REV-STD-1`);
    if (doc.base_main_sha !== BASE_MAIN_SHA) failures.push(`${name} base_main_sha mismatch`);
    if (!allFalse(doc.authority_flags)) failures.push(`${name} authority flags must all be false`);
    if (!exactAuthorityFlags(doc.authority_flags)) failures.push(`${name} authority flags must match exact expected key set`);
  }

  if (bundle.bundle_id !== 'mtu-h7-protected-canonical-adjudication-bundle-4') failures.push('bundle_id mismatch');
  if (bundle.status !== 'PROTECTED_CANONICAL_ADJUDICATION_PREP_READY_FOR_HUMAN_REVIEW_NOT_EXECUTED') {
    failures.push(`bundle status mismatch: ${bundle.status}`);
  }
  if (gate.gate_id !== GATE_ID || gate.route !== 'READY_FOR_HUMAN_REVIEW') failures.push('gate route/id mismatch');
  if (prReadiness.route !== 'READY_FOR_HUMAN_REVIEW') failures.push('PR readiness route mismatch');
  if (prReadiness.pilot_data?.branch_protection_ok_required !== true) failures.push('branch protection ok:true requirement missing');
  if (prReadiness.pilot_data?.owner_authorization_required !== true) failures.push('payload authorization requirement missing');
  if (prReadiness.status === 'PENDING_EXACT_REMOTE_PR_READINESS_PROOF') {
    if (prReadiness.pilot_data?.exact_remote_head_sha !== null) failures.push('pending PR readiness must not record exact_remote_head_sha');
    if (prReadiness.pilot_data?.pr_number !== null) failures.push('pending PR readiness must not record pr_number');
    if (prReadiness.pilot_data?.exact_remote_proof_state !== 'not_recorded_pre_pr') failures.push('pending PR readiness exact_remote_proof_state mismatch');
  } else {
    if (!/^[a-f0-9]{40}$/i.test(String(prReadiness.pilot_data?.exact_remote_head_sha || ''))) failures.push('recorded PR readiness requires exact remote head SHA');
    if (!Number.isInteger(prReadiness.pilot_data?.pr_number)) failures.push('recorded PR readiness requires PR number');
  }
  if (prReadiness.prior_checker_boundary?.bundle1_checker_current_status !== 'historical_hash_locked_mtu_registry_drift_not_current_proof') {
    failures.push('Bundle 1 historical checker boundary missing');
  }
  if (prReadiness.prior_checker_boundary?.bundle2_checker_current_status !== 'historical_hash_locked_mtu_registry_drift_not_current_proof') {
    failures.push('Bundle 2 historical checker boundary missing');
  }

  const operations = asArray(matrix.operations);
  if (!sameSet(operations.map((row) => row.operation_id), REQUIRED_OPERATION_IDS)) {
    failures.push('protected operation set drifted');
  }
  if (matrix.summary?.protected_operations_prepared !== 7) failures.push('matrix must prepare seven operations');
  if (matrix.summary?.executed_in_this_bundle !== 0) failures.push('matrix must execute zero operations');
  if (matrix.summary?.h7_full_closure_claimed !== false) failures.push('matrix must not claim H7 closure');
  if (bundle.summary?.executed_in_this_bundle !== 0) failures.push('bundle must execute zero operations');
  if (bundle.summary?.h7_full_closure_claimed !== false) failures.push('bundle must not claim H7 closure');
  if (bundle.summary?.product_route_readiness_claimed !== false) failures.push('bundle must not claim product readiness');
  if (bundle.summary?.student_product_use_authorized !== false) failures.push('bundle must not authorize student/product use');

  for (const row of operations) {
    if (row.adjudication_status !== 'prepared_for_human_protected_canonical_adjudication_not_executed') {
      failures.push(`operation not prep-only: ${row.operation_id}`);
    }
    if (!['canonical_mtu_governance', 'operation_registry_governance', 'procedure_or_operation_registry_governance'].includes(row.decision_family)) {
      failures.push(`unexpected decision family: ${row.operation_id}`);
    }
    if (!row.requested_human_decision) failures.push(`requested human decision missing: ${row.operation_id}`);
    if (!row.proof_required_to_close) failures.push(`proof required missing: ${row.operation_id}`);
    if (!row.safe_interim_action) failures.push(`safe interim action missing: ${row.operation_id}`);
    if (!row.negative_guard?.fixture_id) failures.push(`negative guard missing: ${row.operation_id}`);
    if (row.candidate_packet_id && !/^H7-CAND-/.test(row.candidate_packet_id)) failures.push(`candidate id malformed: ${row.operation_id}`);
    if (!asArray(row.permissible_owner_decisions).includes('APPROVE_FOR_LATER_BOUNDED_PROTECTED_GOVERNANCE_EXECUTION')) {
      failures.push(`owner decision options missing bounded execution option: ${row.operation_id}`);
    }
    for (const prohibited of ['execution', 'operation_registry_mutation', 'canonical_mtu_mutation', 'candidate_write']) {
      if (!asArray(row.non_authorized_in_this_bundle).includes(prohibited)) failures.push(`non-authorized marker missing ${prohibited}: ${row.operation_id}`);
    }
    for (const ref of asArray(row.official_evidence_refs)) {
      if (!evidenceExists(ref)) failures.push(`official evidence ref missing: ${row.operation_id} ${ref}`);
    }
  }

  const fixtureIds = asArray(negatives.fixtures).map((row) => row.fixture_id);
  const guardIds = operations.map((row) => row.negative_guard.fixture_id);
  if (!sameSet(fixtureIds, guardIds)) failures.push('negative fixtures must exactly match operation guards');
  if (negatives.summary?.total !== 7 || negatives.summary?.detection_rate !== 1) failures.push('negative fixture summary mismatch');
  for (const fixture of asArray(negatives.fixtures)) {
    if (fixture.observed_status !== 'prepared_not_executed') failures.push(`negative fixture should remain prep-only: ${fixture.fixture_id}`);
    if (fixture.detected_with_intended_defect_class !== true) failures.push(`negative fixture not pinned: ${fixture.fixture_id}`);
  }

  if (!sameSet(asArray(bundle.source_files), EXPECTED_SOURCE_FILES)) failures.push('bundle source_files must match exact expected source set');
  const sourceHashPaths = asArray(bundle.source_hashes).map((entry) => entry.path);
  if (!sameSet(sourceHashPaths, EXPECTED_SOURCE_FILES)) failures.push('bundle source_hashes must match exact expected source set');
  if (asArray(bundle.source_hashes).length !== EXPECTED_SOURCE_FILES.length) failures.push('bundle source_hash count mismatch');
  for (const entry of asArray(bundle.source_hashes)) {
    if (!entry.path || entry.sha256 !== sha256File(entry.path)) failures.push(`source hash mismatch: ${entry.path}`);
  }
  if (bundle.hashes?.adjudication_matrix !== sha256Object(matrix)) failures.push('matrix hash mismatch');
  if (bundle.hashes?.negative_regression_fixtures !== sha256Object(negatives)) failures.push('negative hash mismatch');
  if (bundle.hashes?.pr_readiness_evidence !== sha256Object(prReadiness)) failures.push('PR readiness hash mismatch');

  for (const file of REQUIRED_FILES) {
    if (!urls.includes(file)) failures.push(`bundle urls missing: ${file}`);
  }
  for (const requiredText of [
    'Review standard: REV-STD-1',
    'Teacher reviewer: `MORE_THAN_SATISFIED`',
    'Economist reviewer: `MORE_THAN_SATISFIED`',
    'Quality inspection reviewer: `MORE_THAN_SATISFIED`',
    'This packet does not close H7'
  ]) {
    if (!leadReview.includes(requiredText) && !reviewTeam.includes(requiredText)) failures.push(`review text missing: ${requiredText}`);
  }
  for (const staleText of ['PENDING_SUBAGENT_REVIEW', 'Teacher reviewer: `PENDING`', 'Economist reviewer: `PENDING`', 'Quality inspection reviewer: `PENDING`']) {
    if (leadReview.includes(staleText) || reviewTeam.includes(staleText)) failures.push(`stale review text present: ${staleText}`);
  }

  const serialized = JSON.stringify({ bundle, matrix, negatives, gate, prReadiness }).replace(/\s/g, '');
  for (const forbidden of [
    '"protected_reference_mutation_authorized":true',
    '"external_source_mutation_authorized":true',
    '"machine_reference_mutation_authorized":true',
    '"operation_registry_mutation_authorized":true',
    '"candidate_writes_authorized":true',
    '"lesson_output_mutation_authorized":true',
    '"h7_full_closure_claimed":true',
    '"product_route_readiness_claimed":true',
    '"student_product_use_authorized":true',
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
      protected_operations_prepared: operations.length,
      negative_guards: asArray(negatives.fixtures).length,
      route: gate.route
    }
  };
}

const result = validate();
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else if (result.ok) {
  console.log(`OK ${SPRINT_ID}: Bundle 4 checked (${result.summary.protected_operations_prepared} protected operations prepared, route ${result.summary.route})`);
} else {
  console.error(`FAIL ${SPRINT_ID}: ${result.failures.length} issue(s)`);
  for (const failure of result.failures) console.error(`- ${failure}`);
}
process.exit(result.ok ? 0 : 1);
