#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const {
  PREP_STATUS,
  executeNegativeFixtures
} = require('./lib/mtu-h7-bundle4-contract');

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
  'reports/mtu-hardening/mtu-h7-diagnostic-evidence-manifest-1.json',
  'reports/mtu-hardening/mtu-h7-execution-benchmark-bundle-1.json',
  'references/machine/micro-teaching-units.json'
]);

const REQUIRED_FILES = Object.freeze([
  'build-scripts/references/build-mtu-h7-protected-canonical-adjudication-bundle-4.js',
  'build-scripts/references/check-mtu-h7-protected-canonical-adjudication-bundle-4.js',
  'build-scripts/references/lib/mtu-h7-bundle4-contract.js',
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
  `reports/review-gates/${GATE_ID}/review-proof-requirements.md`
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
  return JSON.stringify([...asArray(actual)].sort()) === JSON.stringify([...asArray(expected)].sort());
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function indexBy(items, key) {
  return new Map(asArray(items).map((item) => [item[key], item]));
}

function semanticUnitSnapshot(unit) {
  return {
    id: unit.id,
    name: unit.name,
    kern: unit.kern,
    mastery_target: unit.mastery_target,
    procedure: asArray(unit.procedure)
  };
}

function resolveEvidenceRef(ref) {
  if (typeof ref !== 'string' || !ref.includes('#')) return null;
  const splitAt = ref.indexOf('#');
  const file = ref.slice(0, splitAt);
  const fragment = ref.slice(splitAt + 1);
  if (!file || !fragment || !fs.existsSync(repoPath(file))) return null;
  const doc = readJson(file);
  if (Object.prototype.hasOwnProperty.call(doc, fragment)) {
    return { file, fragment, record: doc[fragment] };
  }
  for (const value of Object.values(doc)) {
    if (!Array.isArray(value)) continue;
    const record = value.find((item) => item && (
      item.record_id === fragment || item.operation_id === fragment ||
      item.anchor_id === fragment || item.fixture_id === fragment
    ));
    if (record) return { file, fragment, record };
  }
  return null;
}

function validateRenderedEvidence(record, operationId, failures) {
  for (const page of [...asArray(record.rendered_prompt_pages), ...asArray(record.rendered_correction_pages)]) {
    if (!page.rendered_png_path || !fs.existsSync(repoPath(page.rendered_png_path))) {
      failures.push(`rendered evidence missing: ${operationId} ${page.rendered_png_path}`);
    } else if (page.rendered_png_sha256 && sha256File(page.rendered_png_path) !== page.rendered_png_sha256) {
      failures.push(`rendered evidence hash drift: ${operationId} ${page.rendered_png_path}`);
    }
  }
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
  const reviewProofRequirements = readText(`reports/review-gates/${GATE_ID}/review-proof-requirements.md`);
  const urls = readText(`reports/review-gates/${GATE_ID}/bundle-urls.md`);
  const blockerMatrix = readJson('reports/mtu-hardening/mtu-h7-operation-blocker-matrix-1.json');
  const candidatePackets = readJson('reports/mtu-hardening/mtu-h7-governance-candidate-packets-1.json');
  const officialEvidence = readJson('reports/mtu-hardening/mtu-h7-official-evidence-matrix-1.json');
  const holdMatrix = readJson('reports/mtu-hardening/mtu-h7-protected-governance-hold-matrix-3.json');
  const bundle3Negatives = readJson('reports/mtu-hardening/mtu-h7-bundle3-negative-regression-fixtures.json');
  const diagnosticManifest = readJson('reports/mtu-hardening/mtu-h7-diagnostic-evidence-manifest-1.json');
  const executionBenchmark = readJson('reports/mtu-hardening/mtu-h7-execution-benchmark-bundle-1.json');
  const mtuRegistry = readJson('references/machine/micro-teaching-units.json');

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
  if (prReadiness.throughput?.level !== 'L4' || prReadiness.throughput?.class !== 'high_authority') failures.push('PR readiness L4 throughput schema missing');
  if (prReadiness.human_review_payload !== 'substantial' || prReadiness.human_decision_required !== true) failures.push('PR readiness human-review fields missing');
  if (prReadiness.authorization_boundaries?.payload_authorization_does_not_imply_candidate_authorization !== true) failures.push('payload/candidate authority separation missing');
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
  if (prReadiness.proof?.lead_review?.path !== null || prReadiness.proof?.lead_review?.result !== null || prReadiness.proof?.lead_review?.reviewed_commit_sha !== null) {
    failures.push('generated PR evidence must not self-attest lead-review proof');
  }
  if (!reviewProofRequirements.includes('builder does not generate reviewer identities, verdicts, or lead-review approval') ||
      !reviewProofRequirements.includes('`PASS` or `PASS WITH FLAGS`') ||
      !reviewProofRequirements.includes('exact remote payload head')) {
    failures.push('external exact-head review proof requirements missing');
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

  const blockerByOperation = indexBy(blockerMatrix.operations, 'operation_id');
  const candidateById = indexBy(candidatePackets.candidates, 'candidate_packet_id');
  const officialByOperation = indexBy(officialEvidence.operation_evidence, 'operation_id');
  const holdByOperation = indexBy(holdMatrix.protected_holds, 'operation_id');
  const manifestByRecord = indexBy(diagnosticManifest.records, 'record_id');
  const registryById = indexBy(mtuRegistry, 'id');
  const bundle3NegativeByFixture = indexBy(bundle3Negatives.protected_governance_hold_negative_guards, 'fixture_id');

  for (const row of operations) {
    if (row.adjudication_status !== PREP_STATUS) {
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

    const blocker = blockerByOperation.get(row.operation_id);
    const candidate = candidateById.get(row.candidate_packet_id);
    const official = officialByOperation.get(row.operation_id);
    const hold = holdByOperation.get(row.operation_id);
    const manifest = manifestByRecord.get(row.record_id);
    const priorNegative = bundle3NegativeByFixture.get(row.negative_guard?.fixture_id);
    if (!blocker || !candidate || !official || !hold || !manifest || !priorNegative) {
      failures.push(`semantic source object missing: ${row.operation_id}`);
      continue;
    }

    for (const source of [blocker, official, hold]) {
      if (source.operation_id !== row.operation_id || source.record_id !== row.record_id || source.blocker_id !== row.blocker_id) {
        failures.push(`operation/blocker/record association drifted: ${row.operation_id}`);
      }
    }
    if (row.source_route !== hold.final_route || row.source_prior_status !== hold.source_prior_status ||
        row.source_prior_defect_class !== hold.source_prior_defect_class ||
        row.proposed_non_mutating_decision !== hold.proposed_non_mutating_decision ||
        row.proof_required_to_close !== hold.proof_required_to_close ||
        row.safe_interim_action !== hold.safe_interim_action ||
        !sameJson(row.source_blocker_evidence, {
          needed_governance: blocker.needed_governance,
          safe_interim_action: blocker.safe_interim_action,
          final_route: blocker.final_route
        })) {
      failures.push(`held-operation governance fields drifted: ${row.operation_id}`);
    }
    if (row.candidate_packet_id !== hold.candidate_packet_id ||
        !asArray(candidate.affected_operations).includes(row.operation_id) ||
        !asArray(candidate.affected_records).includes(row.record_id) ||
        candidate.route !== row.source_route) {
      failures.push(`candidate association drifted: ${row.operation_id}`);
    }
    if (!sameSet(row.required_mtu_ids, blocker.expected_required_mtu_ids) ||
        !sameSet(row.mapped_mtu_ids, blocker.expected_required_mtu_ids) ||
        !sameSet(row.answer_form_mtu_ids, blocker.expected_answer_form_mtu_ids) ||
        !sameSet(row.forbidden_mtu_ids, blocker.expected_forbidden_mtu_ids) ||
        !sameSet(row.route_tags, blocker.expected_route_tags)) {
      failures.push(`operation contract drifted from blocker evidence: ${row.operation_id}`);
    }
    if (!sameSet(official.expected_answer_form_mtu_ids, blocker.expected_answer_form_mtu_ids) ||
        !sameSet(official.expected_procedure_unit_ids, blocker.expected_procedure_unit_ids) ||
        !sameSet(official.expected_forbidden_mtu_ids, blocker.expected_forbidden_mtu_ids) ||
        row.question_word !== official.question_word || row.answer_model_summary !== official.answer_model_summary) {
      failures.push(`official decomposition drifted: ${row.operation_id}`);
    }
    if (!sameJson(row.negative_guard, hold.negative_guard) ||
        !sameJson(row.negative_guard, blocker.negative_regression_fixture) ||
        !sameJson(row.negative_guard, {
          fixture_id: priorNegative.fixture_id,
          expected_failure_defect_class: priorNegative.expected_failure_defect_class,
          mutation: priorNegative.mutation,
          guard: priorNegative.guard
        }) ||
        !asArray(candidate.negative_regression_fixtures).some((item) => sameJson(item, row.negative_guard))) {
      failures.push(`negative guard association drifted: ${row.operation_id}`);
    }

    for (const ref of asArray(row.official_evidence_refs)) {
      const resolved = resolveEvidenceRef(ref);
      if (!resolved || resolved.file !== 'reports/mtu-hardening/mtu-h7-diagnostic-evidence-manifest-1.json' ||
          resolved.fragment !== row.record_id || resolved.record.record_id !== row.record_id) {
        failures.push(`official evidence fragment misbound: ${row.operation_id} ${ref}`);
      }
    }
    if (!sameSet(row.official_evidence_refs, blocker.official_evidence_refs) ||
        !sameSet(row.official_evidence_refs, official.official_evidence_refs) ||
        !asArray(row.official_evidence_refs).every((ref) => asArray(candidate.official_evidence_refs).includes(ref))) {
      failures.push(`official evidence association drifted: ${row.operation_id}`);
    }
    if (!sameJson(manifest.source_locator, blocker.source_locator) ||
        !sameJson(manifest.source_locator, official.source_locator) ||
        !asArray(row.source_locators).every((item) => item.record_id === row.record_id && sameJson(item.source_locator, manifest.source_locator)) ||
        row.semantic_binding?.source_locator_sha256 !== sha256Object(manifest.source_locator)) {
      failures.push(`source locator association drifted: ${row.operation_id}`);
    }
    for (const key of ['prompt_pdf_path', 'correction_pdf_path']) {
      if (!manifest.source_locator[key] || !fs.existsSync(repoPath(manifest.source_locator[key]))) {
        failures.push(`source locator file missing: ${row.operation_id} ${manifest.source_locator[key]}`);
      }
    }
    validateRenderedEvidence(manifest, row.operation_id, failures);

    if (!sameSet(row.misconception_evidence_refs, blocker.expected_misconception_refs)) {
      failures.push(`misconception refs drifted: ${row.operation_id}`);
    }
    for (const ref of asArray(row.misconception_evidence_refs)) {
      const resolved = resolveEvidenceRef(ref);
      if (!resolved || resolved.file !== 'reports/mtu-hardening/mtu-h7-execution-benchmark-bundle-1.json' ||
          !sameJson(executionBenchmark[resolved.fragment], resolved.record) ||
          !asArray(resolved.record.operation_ids).includes(row.operation_id) ||
          !asArray(resolved.record.record_ids).includes(row.record_id)) {
        failures.push(`misconception evidence misbound: ${row.operation_id} ${ref}`);
      }
    }

    const binding = row.semantic_binding || {};
    if (binding.blocker_id !== blocker.blocker_id || binding.official_evidence_operation_id !== official.operation_id ||
        binding.manifest_record_id !== manifest.record_id || binding.candidate_packet_id !== candidate.candidate_packet_id ||
        !sameSet(binding.expected_required_mtu_ids, blocker.expected_required_mtu_ids) ||
        !sameSet(binding.expected_answer_form_mtu_ids, blocker.expected_answer_form_mtu_ids) ||
        !sameSet(binding.expected_procedure_unit_ids, blocker.expected_procedure_unit_ids) ||
        !sameSet(binding.expected_forbidden_mtu_ids, blocker.expected_forbidden_mtu_ids) ||
        !sameSet(binding.expected_route_tags, blocker.expected_route_tags)) {
      failures.push(`semantic binding contract drifted: ${row.operation_id}`);
    }
    const expectedBindingIds = new Set([
      ...asArray(row.required_mtu_ids),
      ...asArray(row.mapped_mtu_ids),
      ...asArray(row.answer_form_mtu_ids),
      ...asArray(blocker.expected_procedure_unit_ids),
      ...asArray(row.forbidden_mtu_ids)
    ]);
    if (!sameSet(asArray(binding.mtu_objects).map((item) => item.id), [...expectedBindingIds])) {
      failures.push(`semantic MTU binding set drifted: ${row.operation_id}`);
    }
    for (const item of asArray(binding.mtu_objects)) {
      const liveUnit = registryById.get(item.id);
      const sourceUnit = item.role === 'forbidden_over_trigger_guard'
        ? asArray(blocker.forbidden_unit_guards).find((unit) => unit.id === item.id)
        : asArray(blocker.canonical_unit_fits).find((unit) => unit.id === item.id);
      if (!liveUnit || !sourceUnit ||
          !sameJson(semanticUnitSnapshot(sourceUnit), semanticUnitSnapshot(liveUnit)) ||
          !sameJson(item.semantic_snapshot, semanticUnitSnapshot(liveUnit)) ||
          item.live_registry_sha256 !== sha256Object(liveUnit)) {
        failures.push(`live MTU semantic binding drifted: ${row.operation_id} ${item.id}`);
      }
    }
  }

  const fixtureIds = asArray(negatives.fixtures).map((row) => row.fixture_id);
  const guardIds = operations.map((row) => row.negative_guard.fixture_id);
  if (!sameSet(fixtureIds, guardIds)) failures.push('negative fixtures must exactly match operation guards');
  const executedNegativeResults = executeNegativeFixtures(matrix, negatives.fixtures);
  const detectedCount = executedNegativeResults.filter((result) => result.detected_with_intended_defect_class).length;
  if (negatives.summary?.total !== 7 || negatives.summary?.executed !== 7 ||
      negatives.summary?.detected_with_intended_defect_class !== detectedCount ||
      negatives.summary?.detection_rate !== detectedCount / 7 ||
      detectedCount !== 7 || !sameJson(negatives.execution_results, executedNegativeResults)) {
    failures.push('executable negative fixture proof mismatch');
  }
  for (const fixture of asArray(negatives.fixtures)) {
    if (fixture.observed_status !== 'prepared_not_executed') failures.push(`negative fixture should remain prep-only: ${fixture.fixture_id}`);
    if (!fixture.mutation_patch?.type || fixture.proof_kind !== 'executable_in_memory_contract_mutation') failures.push(`negative fixture is not executable: ${fixture.fixture_id}`);
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
  for (const staleGeneratedReview of [
    `reports/review-gates/${GATE_ID}/lead-review.md`,
    `reports/review-gates/${GATE_ID}/review-team-results.md`
  ]) {
    if (fs.existsSync(repoPath(staleGeneratedReview))) failures.push(`generated reviewer verdict artifact must be removed: ${staleGeneratedReview}`);
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
      negative_mutations_executed: asArray(negatives.execution_results).length,
      negative_mutations_detected: asArray(negatives.execution_results).filter((result) => result.detected_with_intended_defect_class).length,
      semantically_bound_operations: operations.filter((row) => row.semantic_binding).length,
      route: gate.route
    }
  };
}

const result = validate();
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else if (result.ok) {
  console.log(`OK ${SPRINT_ID}: Bundle 4 checked (${result.summary.protected_operations_prepared} operations semantically bound, ${result.summary.negative_mutations_detected}/${result.summary.negative_mutations_executed} negative mutations detected, route ${result.summary.route})`);
} else {
  console.error(`FAIL ${SPRINT_ID}: ${result.failures.length} issue(s)`);
  for (const failure of result.failures) console.error(`- ${failure}`);
}
process.exit(result.ok ? 0 : 1);
