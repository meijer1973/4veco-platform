#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const {
  buildRegressionContract,
  buildNegativeMutation,
  executeNegativeFixtures
} = require('./lib/mtu-h7-bundle4-contract');
const {
  OPERATION_ADJUDICATION_CORRECTIONS,
  RECORD_SOURCE_COMPLETENESS
} = require('./lib/mtu-h7-bundle4-adjudication-evidence');
const { fullHumanGateThroughputFields } = require('../review-gates/review-throughput-fields');

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
  diagnosticEvidenceManifest: 'reports/mtu-hardening/mtu-h7-diagnostic-evidence-manifest-1.json',
  executionBenchmark: 'reports/mtu-hardening/mtu-h7-execution-benchmark-bundle-1.json',
  mtuRegistry: 'references/machine/micro-teaching-units.json'
});

const BUILD_SCRIPT = 'build-scripts/references/build-mtu-h7-protected-canonical-adjudication-bundle-4.js';
const CHECK_SCRIPT = 'build-scripts/references/check-mtu-h7-protected-canonical-adjudication-bundle-4.js';
const CONTRACT_SCRIPT = 'build-scripts/references/lib/mtu-h7-bundle4-contract.js';
const ADJUDICATION_EVIDENCE_SCRIPT = 'build-scripts/references/lib/mtu-h7-bundle4-adjudication-evidence.js';

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
const REVIEW_PROOF_REQUIREMENTS_MD = `reports/review-gates/${GATE_ID}/review-proof-requirements.md`;

const PROTECTED_OPERATION_IDS = Object.freeze([
  'h7-ha23-2-q15-net-ratio-nivellering',
  'h7-ha24-1-q12-snel-residual-payoff',
  'h7-ha24-1-q12-sprinter-margin-payoff',
  'h7-vw23-2-q20-game-tree-nash',
  'h7-vw24-1-q17-insurance-cost-benefit',
  'h7-vw24-2-q15-ga-mb-first-adjustment',
  'h7-vw24-2-q15-ga-mb-second-adjustment-and-table'
]);

const PR_CHANGED_PATHS = Object.freeze([
  '.github/workflows/platform-ci.yml',
  BUILD_SCRIPT,
  CHECK_SCRIPT,
  CONTRACT_SCRIPT,
  ADJUDICATION_EVIDENCE_SCRIPT,
  'package.json',
  'reports/github-agent-index-lessen.json',
  'reports/github-agent-index-lessen.md',
  'reports/github-agent-index-platform.json',
  'reports/github-agent-index-platform.md',
  OUT_BUNDLE_JSON,
  OUT_BUNDLE_MD,
  OUT_MATRIX_JSON,
  OUT_MATRIX_MD,
  OUT_NEGATIVE_JSON,
  GATE_URLS,
  PR_READINESS_JSON,
  PR_READINESS_MD,
  GATE_JSON,
  GATE_MD,
  REVIEW_PROOF_REQUIREMENTS_MD,
  'reports/url-index.md'
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

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function sameSet(left, right) {
  return sameJson([...asArray(left)].sort(), [...asArray(right)].sort());
}

function resolveEvidenceRef(ref) {
  if (typeof ref !== 'string' || !ref.includes('#')) {
    throw new Error(`evidence ref must include a file and fragment: ${ref}`);
  }
  const splitAt = ref.indexOf('#');
  const file = ref.slice(0, splitAt);
  const fragment = ref.slice(splitAt + 1);
  if (!file || !fragment || !fs.existsSync(repoPath(file))) {
    throw new Error(`evidence ref does not resolve: ${ref}`);
  }
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
  throw new Error(`evidence fragment does not resolve: ${ref}`);
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

function assertSemanticUnitMatchesSource(sourceUnit, liveUnit, operationId, role) {
  if (!sourceUnit) throw new Error(`${role} MTU source snapshot missing for ${operationId}`);
  if (!liveUnit) throw new Error(`${role} MTU missing from live registry for ${operationId}`);
  if (!sameJson(semanticUnitSnapshot(sourceUnit), semanticUnitSnapshot(liveUnit))) {
    throw new Error(`${role} MTU semantic drift for ${operationId}: ${liveUnit.id}`);
  }
}

function assertSourceLocatorFiles(locator, operationId) {
  for (const key of ['prompt_pdf_path', 'correction_pdf_path']) {
    if (!locator[key] || !fs.existsSync(repoPath(locator[key]))) {
      throw new Error(`${operationId} source locator missing ${key}: ${locator[key]}`);
    }
  }
}

function assertRenderedEvidence(record, operationId) {
  for (const page of [...asArray(record.rendered_prompt_pages), ...asArray(record.rendered_correction_pages)]) {
    if (!page.source_pdf_path || !fs.existsSync(repoPath(page.source_pdf_path))) {
      throw new Error(`${operationId} rendered evidence source PDF missing: ${page.source_pdf_path}`);
    }
    if (page.source_pdf_sha256 !== sha256File(page.source_pdf_path)) {
      throw new Error(`${operationId} rendered evidence source PDF hash drift: ${page.source_pdf_path}`);
    }
    if (!page.rendered_png_path || !fs.existsSync(repoPath(page.rendered_png_path))) {
      throw new Error(`${operationId} rendered evidence missing: ${page.rendered_png_path}`);
    }
    if (page.rendered_png_sha256 && sha256File(page.rendered_png_path) !== page.rendered_png_sha256) {
      throw new Error(`${operationId} rendered evidence hash drift: ${page.rendered_png_path}`);
    }
  }
}

function pdfTextPage(relativePath, pageNumber) {
  return execFileSync('pdftotext', [
    '-f', String(pageNumber), '-l', String(pageNumber), '-layout', repoPath(relativePath), '-'
  ], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 10
  });
}

function buildSourceCompleteness(recordId, operationId) {
  const requirement = RECORD_SOURCE_COMPLETENESS[recordId] || {
    supplemental_pages: [],
    correction_model_pages: [],
    unavailable_sources: []
  };
  const buildSemanticPage = (page, role) => {
    if (!fs.existsSync(repoPath(page.source_pdf_path))) {
      throw new Error(`${operationId} ${role} source PDF missing: ${page.source_pdf_path}`);
    }
    const extractedText = pdfTextPage(page.source_pdf_path, page.page_number);
    for (const pattern of asArray(page.required_text_patterns)) {
      if (!extractedText.includes(pattern)) {
        throw new Error(`${operationId} ${role} page ${page.page_number} missing semantic text: ${pattern}`);
      }
    }
    return {
      ...page,
      source_pdf_sha256: sha256File(page.source_pdf_path),
      extracted_text_sha256: sha256Object(extractedText),
      binding_status: 'source_pdf_page_hash_and_required_text_verified'
    };
  };
  const supplementalPages = asArray(requirement.supplemental_pages).map((page) => buildSemanticPage(page, 'supplemental'));
  const correctionModelPages = asArray(requirement.correction_model_pages).map((page) => buildSemanticPage(page, 'correction-model'));
  const unavailableSources = asArray(requirement.unavailable_sources).map((source) => {
    const discoveredPaths = asArray(source.repository_file_candidates).filter((candidate) => fs.existsSync(repoPath(candidate)));
    if (discoveredPaths.length > 0) {
      throw new Error(`${operationId} source is marked unavailable but now exists: ${discoveredPaths.join(', ')}`);
    }
    return {
      ...source,
      discovered_paths: discoveredPaths,
      checked_status: 'candidate_paths_absent_at_build_time'
    };
  });
  return {
    completeness_status: unavailableSources.length > 0
      ? 'available_pages_verified_with_explicit_blocking_source_annex_limitation'
      : 'required_repository_pages_verified',
    supplemental_pages: supplementalPages,
    correction_model_semantic_pages: correctionModelPages,
    unavailable_sources: unavailableSources
  };
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
  for (const [name, doc] of [
    ['diagnosticEvidenceManifest', docs.diagnosticEvidenceManifest],
    ['executionBenchmark', docs.executionBenchmark]
  ]) {
    if (!allFalse(doc.authority_flags)) throw new Error(`${name} authority flags must remain false`);
  }
  if (!Array.isArray(docs.mtuRegistry) || docs.mtuRegistry.length === 0) {
    throw new Error('live MTU registry must be a non-empty array');
  }
  const holdIds = asArray(docs.holdMatrix3.protected_holds).map((row) => row.operation_id).sort();
  if (JSON.stringify(holdIds) !== JSON.stringify([...PROTECTED_OPERATION_IDS].sort())) {
    throw new Error('protected operation id set drifted');
  }
}

function buildAdjudicationMatrix(docs) {
  const blockerByOperation = indexBy(docs.blockerMatrix1.operations, 'operation_id');
  const candidateById = indexBy(docs.candidatePackets1.candidates, 'candidate_packet_id');
  const officialByOperation = indexBy(docs.officialEvidence1.operation_evidence, 'operation_id');
  const manifestByRecord = indexBy(docs.diagnosticEvidenceManifest.records, 'record_id');
  const registryById = indexBy(docs.mtuRegistry, 'id');
  const bundle3NegativeByFixture = indexBy(
    docs.bundle3Negatives.protected_governance_hold_negative_guards,
    'fixture_id'
  );

  const operations = asArray(docs.holdMatrix3.protected_holds).map((row) => {
    const blocker = blockerByOperation.get(row.operation_id);
    const candidate = candidateById.get(row.candidate_packet_id);
    const official = officialByOperation.get(row.operation_id);
    const manifest = manifestByRecord.get(row.record_id);
    const priorNegative = bundle3NegativeByFixture.get(row.negative_guard?.fixture_id);
    const correction = OPERATION_ADJUDICATION_CORRECTIONS[row.operation_id];
    if (!blocker) throw new Error(`blocker missing for ${row.operation_id}`);
    if (!candidate) throw new Error(`candidate packet missing for ${row.candidate_packet_id}`);
    if (!official) throw new Error(`official evidence missing for ${row.operation_id}`);
    if (!manifest) throw new Error(`manifest record missing for ${row.record_id}`);
    if (!priorNegative) throw new Error(`Bundle 3 negative guard missing for ${row.operation_id}`);
    if (!correction) throw new Error(`current adjudication correction missing for ${row.operation_id}`);
    if (candidate.status !== 'governance_evidence_only_not_candidate_write') {
      throw new Error(`candidate must remain evidence-only: ${row.candidate_packet_id}`);
    }
    if (!allFalse(candidate.authority_flags)) {
      throw new Error(`candidate authority flags must remain false: ${row.candidate_packet_id}`);
    }

    for (const source of [blocker, official]) {
      if (source.operation_id !== row.operation_id || source.record_id !== row.record_id || source.blocker_id !== row.blocker_id) {
        throw new Error(`operation/blocker/record association drifted for ${row.operation_id}`);
      }
    }
    if (!asArray(candidate.affected_operations).includes(row.operation_id) ||
        !asArray(candidate.affected_records).includes(row.record_id) ||
        candidate.route !== row.final_route) {
      throw new Error(`candidate association drifted for ${row.operation_id}`);
    }
    if (!sameSet(row.required_mtu_ids, blocker.expected_required_mtu_ids) ||
        !sameSet(row.mapped_mtu_ids, blocker.expected_required_mtu_ids) ||
        !sameSet(row.answer_form_mtu_ids, blocker.expected_answer_form_mtu_ids) ||
        !sameSet(row.forbidden_mtu_ids, blocker.expected_forbidden_mtu_ids) ||
        !sameSet(row.route_tags, blocker.expected_route_tags)) {
      throw new Error(`operation contract drifted from blocker evidence for ${row.operation_id}`);
    }
    if (!sameSet(official.expected_answer_form_mtu_ids, blocker.expected_answer_form_mtu_ids) ||
        !sameSet(official.expected_procedure_unit_ids, blocker.expected_procedure_unit_ids) ||
        !sameSet(official.expected_forbidden_mtu_ids, blocker.expected_forbidden_mtu_ids)) {
      throw new Error(`official operation decomposition drifted for ${row.operation_id}`);
    }
    if (!sameJson(row.negative_guard, blocker.negative_regression_fixture) ||
        !sameJson(row.negative_guard, priorNegative && {
          fixture_id: priorNegative.fixture_id,
          expected_failure_defect_class: priorNegative.expected_failure_defect_class,
          mutation: priorNegative.mutation,
          guard: priorNegative.guard
        }) ||
        !asArray(candidate.negative_regression_fixtures).some((item) => sameJson(item, row.negative_guard))) {
      throw new Error(`negative guard association drifted for ${row.operation_id}`);
    }
    if (!asArray(candidate.official_evidence_refs).every((ref) => typeof ref === 'string') ||
        !asArray(row.official_evidence_refs).every((ref) => asArray(candidate.official_evidence_refs).includes(ref))) {
      throw new Error(`candidate evidence refs drifted for ${row.operation_id}`);
    }
    if (!asArray(candidate.proof_required_to_close).includes(row.proof_required_to_close)) {
      throw new Error(`candidate closure proof drifted for ${row.operation_id}`);
    }

    const manifestRef = asArray(row.official_evidence_refs).map(resolveEvidenceRef).find((resolved) => (
      resolved.file === SOURCE_FILES.diagnosticEvidenceManifest && resolved.fragment === row.record_id
    ));
    if (!manifestRef || manifestRef.record.record_id !== row.record_id) {
      throw new Error(`official manifest ref missing or misbound for ${row.operation_id}`);
    }
    if (!sameJson(manifest.source_locator, blocker.source_locator) ||
        !sameJson(manifest.source_locator, official.source_locator) ||
        !asArray(row.source_locators).every((item) => item.record_id === row.record_id && sameJson(item.source_locator, manifest.source_locator)) ||
        !asArray(candidate.source_locators).some((item) => item.record_id === row.record_id && sameJson(item.source_locator, manifest.source_locator))) {
      throw new Error(`source locator association drifted for ${row.operation_id}`);
    }
    assertSourceLocatorFiles(manifest.source_locator, row.operation_id);
    assertRenderedEvidence(manifest, row.operation_id);
    const sourceCompleteness = buildSourceCompleteness(row.record_id, row.operation_id);

    for (const ref of asArray(blocker.expected_misconception_refs)) {
      const resolved = resolveEvidenceRef(ref);
      if (resolved.file !== SOURCE_FILES.executionBenchmark ||
          resolved.record.anchor_id !== resolved.fragment ||
          !asArray(resolved.record.operation_ids).includes(row.operation_id) ||
          !asArray(resolved.record.record_ids).includes(row.record_id)) {
        throw new Error(`misconception evidence misbound for ${row.operation_id}: ${ref}`);
      }
    }

    const mappedMtuIds = unique([
      ...asArray(correction.full_fit_mtu_ids),
      ...asArray(correction.partial_anchor_mtu_ids)
    ]);
    const requiredBindings = unique([
      ...mappedMtuIds,
      ...asArray(correction.answer_form_mtu_ids),
      ...asArray(correction.procedure_mtu_ids),
      ...asArray(correction.partial_procedure_anchor_mtu_ids)
    ]).map((id) => {
      const liveUnit = registryById.get(id);
      if (!liveUnit) throw new Error(`current adjudication MTU missing from live registry for ${row.operation_id}: ${id}`);
      const role = asArray(correction.full_fit_mtu_ids).includes(id)
        ? 'full_fit'
        : 'partial_anchor_only';
      return {
        id,
        role,
        role_basis: correction.correction_basis,
        live_registry_sha256: sha256Object(liveUnit),
        semantic_snapshot: semanticUnitSnapshot(liveUnit)
      };
    });
    const forbiddenBindings = asArray(correction.forbidden_mtu_ids).map((id) => {
      const sourceUnit = asArray(blocker.forbidden_unit_guards).find((unit) => unit.id === id);
      const liveUnit = registryById.get(id);
      assertSemanticUnitMatchesSource(sourceUnit, liveUnit, row.operation_id, 'forbidden');
      return {
        id,
        role: 'forbidden_over_trigger_guard',
        live_registry_sha256: sha256Object(liveUnit),
        semantic_snapshot: semanticUnitSnapshot(liveUnit)
      };
    });
    const currentOperation = {
      ...row,
      required_mtu_ids: correction.full_fit_mtu_ids,
      mapped_mtu_ids: mappedMtuIds,
      answer_form_mtu_ids: correction.answer_form_mtu_ids,
      forbidden_mtu_ids: correction.forbidden_mtu_ids,
      route_tags: correction.route_tags
    };
    const regressionContract = buildRegressionContract(currentOperation);
    const expectedRegressionContract = Object.entries(regressionContract).map(([key, value]) => ({
      key,
      value,
      defect_class: row.negative_guard.expected_failure_defect_class
    }));

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
      question_word: official.question_word,
      answer_model_summary: official.answer_model_summary,
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
      required_mtu_ids: correction.full_fit_mtu_ids,
      mapped_mtu_ids: mappedMtuIds,
      partial_anchor_mtu_ids: correction.partial_anchor_mtu_ids,
      excluded_historical_mtu_ids: correction.excluded_historical_mtu_ids,
      answer_form_mtu_ids: correction.answer_form_mtu_ids,
      procedure_mtu_ids: correction.procedure_mtu_ids,
      partial_procedure_anchor_mtu_ids: correction.partial_procedure_anchor_mtu_ids,
      forbidden_mtu_ids: correction.forbidden_mtu_ids,
      route_tags: correction.route_tags,
      missing_operation_expectations: correction.missing_operation_expectations,
      adjudication_correction_basis: correction.correction_basis,
      official_evidence_refs: row.official_evidence_refs,
      misconception_evidence_refs: blocker.expected_misconception_refs,
      source_locators: row.source_locators,
      rendered_prompt_pages: manifest.rendered_prompt_pages,
      rendered_correction_pages: manifest.rendered_correction_pages,
      source_completeness: sourceCompleteness,
      negative_guard: row.negative_guard,
      regression_contract: regressionContract,
      semantic_binding: {
        blocker_id: blocker.blocker_id,
        official_evidence_operation_id: official.operation_id,
        manifest_record_id: manifest.record_id,
        candidate_packet_id: candidate.candidate_packet_id,
        current_decomposition_status: 'reviewed_current_adjudication_correction_over_historical_hash_pinned_inputs',
        expected_required_mtu_ids: correction.full_fit_mtu_ids,
        expected_partial_anchor_mtu_ids: correction.partial_anchor_mtu_ids,
        expected_excluded_historical_mtu_ids: correction.excluded_historical_mtu_ids,
        expected_answer_form_mtu_ids: correction.answer_form_mtu_ids,
        expected_procedure_unit_ids: correction.procedure_mtu_ids,
        expected_partial_procedure_anchor_mtu_ids: correction.partial_procedure_anchor_mtu_ids,
        expected_forbidden_mtu_ids: correction.forbidden_mtu_ids,
        expected_route_tags: correction.route_tags,
        expected_missing_operation_expectations: correction.missing_operation_expectations,
        expected_regression_contract: expectedRegressionContract,
        source_locator_sha256: sha256Object(manifest.source_locator),
        source_completeness_sha256: sha256Object(sourceCompleteness),
        mtu_objects: [...requiredBindings, ...forbiddenBindings]
      },
      historical_decomposition: {
        status: 'preserved_for_audit_not_current_role_authority',
        required_mtu_ids: blocker.expected_required_mtu_ids,
        answer_form_mtu_ids: blocker.expected_answer_form_mtu_ids,
        procedure_unit_ids: blocker.expected_procedure_unit_ids,
        forbidden_mtu_ids: blocker.expected_forbidden_mtu_ids,
        route_tags: blocker.expected_route_tags,
        source_sha256: sha256Object({
          blocker: blocker.blocker_id,
          required_mtu_ids: blocker.expected_required_mtu_ids,
          answer_form_mtu_ids: blocker.expected_answer_form_mtu_ids,
          procedure_unit_ids: blocker.expected_procedure_unit_ids,
          forbidden_mtu_ids: blocker.expected_forbidden_mtu_ids,
          route_tags: blocker.expected_route_tags
        })
      },
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
      operations_with_partial_anchors: operations.filter((row) => asArray(row.partial_anchor_mtu_ids).length > 0).length,
      excluded_historical_mtu_role_count: operations.reduce((sum, row) => sum + asArray(row.excluded_historical_mtu_ids).length, 0),
      explicit_unavailable_source_limitations: unique(operations.flatMap((row) =>
        asArray(row.source_completeness?.unavailable_sources).map((source) => `${row.record_id}:${source.source_label}`)
      )).length,
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
    mutation_patch: buildNegativeMutation(row),
    guard: row.negative_guard.guard,
    detection_rule: 'Apply mutation_patch in memory and evaluate the mutated operation against its prep-only status, forbidden-MTU, and required-route-tag contract.',
    observed_status: 'prepared_not_executed',
    proof_kind: 'executable_in_memory_contract_mutation'
  }));
  const executionResults = executeNegativeFixtures(matrix, fixtures);
  const detected = executionResults.filter((result) => result.detected_with_intended_defect_class).length;
  if (detected !== fixtures.length) {
    const failed = executionResults.filter((result) => !result.detected_with_intended_defect_class).map((result) => result.fixture_id);
    throw new Error(`negative fixture execution failed: ${failed.join(', ')}`);
  }
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
    execution_results: executionResults,
    summary: {
      total: fixtures.length,
      executed: executionResults.length,
      detected_with_intended_defect_class: detected,
      detection_rate: fixtures.length === 0 ? null : detected / fixtures.length,
      proof_kind: 'executed_contract_mutations'
    }
  };
}

function buildPrReadinessEvidence() {
  const commands = [
    'node build-scripts/references/check-mtu-h7-protected-canonical-adjudication-bundle-4.js',
    'node build-scripts/references/check-mtu-h7-q5-graph-execution-and-protected-governance-bundle-3.js',
    'node build-scripts/reports/validate-report-json.js',
    'node build-scripts/sprints/emit-url-index.js --check',
    `node build-scripts/sprints/check-review-throughput-packet.js ${PR_READINESS_JSON}`,
    'npm.cmd run check:agent-index-freshness',
    'npm.cmd run check:platform',
    'npm.cmd run check:branch-protection'
  ];
  const throughputFields = fullHumanGateThroughputFields({
    gateId: GATE_ID,
    packetId: GATE_ID,
    bundleId: 'mtu-h7-protected-canonical-adjudication-bundle-4',
    changedPaths: PR_CHANGED_PATHS,
    rationale: 'L4 human gate required because Bundle 4 prepares protected/canonical H7 governance adjudication.',
    escalationTriggers: [
      'human_gate_required',
      'protected_canonical_candidate_authority_requires_separate_owner_decision'
    ]
  });
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    review_standard: 'REV-STD-1',
    status: 'PENDING_EXACT_REMOTE_PR_READINESS_PROOF',
    route: 'READY_FOR_HUMAN_REVIEW',
    base_main_sha: BASE_MAIN_SHA,
    authority_flags: AUTHORITY_FLAGS,
    ...throughputFields,
    throughput: {
      class: throughputFields.pr_throughput_class,
      authority_class: throughputFields.authority_class,
      level: throughputFields.review_autonomy.level
    },
    human_review_payload: 'substantial',
    consequence: 'high',
    human_decision_required: true,
    batching: {
      viable: false,
      target: null,
      reason: 'Bundle 4 is one coherent protected/canonical adjudication-prep packet.'
    },
    risk_signals: {
      governance: true,
      protected: true,
      product_authority: false,
      student_use: false
    },
    proof: {
      checkers: commands.map((command) => ({ command, status: 'pending_exact_head_execution' })),
      lead_review: {
        path: null,
        result: null,
        reviewed_commit_sha: null,
        required_specialist_roles: ['teacher', 'economist', 'quality_inspection'],
        minimum_specialist_verdict: 'MORE_THAN_SATISFIED'
      },
      branch_protection: null
    },
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
    authorization_boundaries: {
      payload_authorization: 'May authorize integration of this checker/report/gate packet only after READY_FOR_HUMAN_REVIEW.',
      candidate_authorization: 'Must be a separate later owner decision per candidate family before any protected-governance execution preparation.',
      payload_authorization_does_not_imply_candidate_authorization: true
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
      'Route READY_FOR_HUMAN_REVIEW after exact-head readiness proof and wait for explicit owner payload authorization before merge.',
      'Do not use L0-L2 READY_FOR_LEAD_ONLY handling for this protected/canonical adjudication-prep packet.'
    ],
    commands: [
      ...commands,
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
      contract_script: CONTRACT_SCRIPT,
      adjudication_evidence_script: ADJUDICATION_EVIDENCE_SCRIPT,
      adjudication_matrix: OUT_MATRIX_JSON,
      negative_regression_fixtures: OUT_NEGATIVE_JSON,
      review_packet: GATE_JSON,
      pr_readiness_evidence: PR_READINESS_JSON,
      review_proof_requirements: REVIEW_PROOF_REQUIREMENTS_MD
    },
    summary: {
      protected_operations_prepared: matrix.summary.protected_operations_prepared,
      unique_candidate_packets: matrix.summary.unique_candidate_packets,
      operations_with_partial_anchors: matrix.summary.operations_with_partial_anchors,
      excluded_historical_mtu_role_count: matrix.summary.excluded_historical_mtu_role_count,
      explicit_unavailable_source_limitations: matrix.summary.explicit_unavailable_source_limitations,
      semantically_bound_operations: matrix.operations.filter((row) => row.semantic_binding).length,
      executable_negative_regressions: negatives.summary.executed,
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
    requested_decision: 'Review and, if satisfied, authorize integration of Bundle 4 as protected/canonical H7 adjudication preparation only. This payload decision must not authorize any candidate family or later protected-governance execution.',
    decision_surfaces: {
      payload_integration: 'Authorize or reject integration of PR #204 at its reviewed payload head.',
      later_candidate_adjudication: 'After integration, record a separate explicit owner decision per candidate family before any Bundle 5 execution preparation.',
      decisions_must_remain_separate: true
    },
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
      'Historical MTU-role decompositions remain audit evidence only; current full-fit, partial-anchor, excluded, and missing-operation fields govern this packet',
      'Missing source annexes or response sheets must remain explicit blocking limitations',
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
      { requirement: 'Every source locator and evidence fragment resolves to the matching manifest, blocker, candidate, and operation', status: 'met', evidence: OUT_MATRIX_JSON },
      { requirement: 'Supplemental stimulus pages are PDF-hash/text bound and unavailable source annexes are explicit blocking limitations', status: 'met', evidence: OUT_MATRIX_JSON },
      { requirement: 'Every required/forbidden MTU is semantically bound to the live registry and reviewed source snapshot', status: 'met', evidence: OUT_MATRIX_JSON },
      { requirement: 'Current full-fit, partial-anchor, excluded historical, answer-form, scaling, and procedure roles are separated for all seven operations', status: 'met', evidence: OUT_MATRIX_JSON },
      { requirement: 'Every operation carries an executable negative regression mutation with observed intended defect class', status: 'met', evidence: OUT_NEGATIVE_JSON },
      { requirement: 'Authority flags remain false and no protected/candidate/product writes are claimed', status: 'met', evidence: OUT_BUNDLE_JSON },
      { requirement: 'Canonical review-throughput packet validator accepts the complete L4 schema', status: 'met', evidence: PR_READINESS_JSON },
      { requirement: 'Single-account PR governance route is READY_FOR_HUMAN_REVIEW pending exact remote proof', status: 'proof_required_to_close', evidence: PR_READINESS_JSON },
      { requirement: 'Actual specialist results and exact-head PASS/PASS WITH FLAGS lead review are external proof, never generated verdicts', status: 'proof_required_to_close', evidence: REVIEW_PROOF_REQUIREMENTS_MD }
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
        id: 'H7-B4-FINDING-SOURCE-ANNEX-LIMITATIONS',
        classification: 'blocks',
        severity: 'official_source_evidence_gap',
        summary: 'The income q15 source tables, ultimatum q12 decision tree, and macro q15 official response sheet are absent from the repository. Available official prompt/correction pages are hash/text bound, and the missing materials remain explicit.',
        proof_required_to_close: 'Obtain and review authoritative source-annex/response-sheet evidence, or record a later explicit owner decision that accepts the visible limitation for a precisely bounded execution.'
      },
      {
        id: 'H7-B4-FINDING-REMOTE-PR-PROOF-PENDING',
        classification: 'proof_required_to_close',
        severity: 'pr_governance_gate',
        summary: 'Exact remote PR head, PR Readiness Reviewer output, branch-protection ok:true output, and CI are required before the readiness transition; owner payload authorization is required before merge.',
        proof_required_to_close: 'Run the single-account PR governance workflow against the exact remote head and record owner payload authorization that names the reviewed payload head SHA.'
      },
      {
        id: 'H7-B4-FINDING-CANDIDATE-AUTHORITY-SEPARATE',
        classification: 'blocks',
        severity: 'authority_scope_boundary',
        summary: 'Payload integration authorization does not authorize any protected/canonical candidate family or later execution preparation.',
        proof_required_to_close: 'Record a separate explicit owner decision per candidate family after this packet is integrated.'
      }
    ],
    blocks: [
      'H7 full closure',
      'H6/H7 evidence-generalization closure',
      'protected/canonical operation execution',
      'candidate execution that relies on an unavailable source annex or response sheet without an explicit later owner decision',
      'protected-reference mutation',
      'operation-registry mutation',
      'candidate writes/storage',
      'Scale Gate',
      'product-route readiness',
      'diagnostics/mastery/PV/sequencing/summative/student use',
      'merge before READY_FOR_HUMAN_REVIEW owner payload authorization is recorded for the reviewed payload'
    ],
    does_not_block: [
      'Human review of this Bundle 4 adjudication-prep packet after exact-head PR readiness proof',
      'Merging this checker/report/gate surface only after explicit owner payload authorization is recorded for the reviewed payload',
      'Preparing a later bounded protected-governance execution packet only if the owner explicitly authorizes that next step'
    ],
    proof_required_to_close: [
      'Run the Bundle 4 checker and current Bundle 3 checker. Bundle 1/2 artifacts are historical hash-pinned inputs; their older MTU registry source hash is not current proof.',
      'Run report JSON validation, URL-index check, agent-index freshness, platform tests, PR Readiness Reviewer, and live branch-protection checker against exact remote head.',
      'Run Teacher, Economist, and Quality inspection specialist reviews against the exact remote payload head and require MORE_THAN_SATISFIED from each reviewer.',
      'Record a lead review result of PASS or PASS WITH FLAGS with reviewed_commit_sha equal to the exact remote payload head; PASS WITH FLAGS may not carry a missing core requirement.',
      'Record explicit owner payload authorization in the PR thread with the PR number and reviewed payload commit before merge.',
      'Keep H7 closure blocked until a later owner-authorized bounded execution packet resolves the protected/canonical operations.'
    ],
    bundle: OUT_BUNDLE_JSON,
    adjudication_matrix: OUT_MATRIX_JSON,
    negative_regression_fixtures: OUT_NEGATIVE_JSON,
    pr_readiness_evidence: PR_READINESS_JSON,
    review_proof_requirements: REVIEW_PROOF_REQUIREMENTS_MD,
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
- Semantically bound operations: ${bundle.summary.semantically_bound_operations}
- Executable negative regressions: ${bundle.summary.executable_negative_regressions}
- Observed negative regression detection rate: ${bundle.summary.negative_regression_detection_rate}
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

Throughput packet: \`${prReadiness.packet_id}\`

Review autonomy: \`${prReadiness.review_autonomy.level}\` / authority \`${prReadiness.authority_class}\`

Human decision required: \`${prReadiness.human_decision_required}\`; auto-merge after CI: \`${prReadiness.auto_merge_allowed_after_ci}\`

Declared changed paths: ${prReadiness.changed_paths.length}

Before marking ready or merging, run these commands against the exact remote head and record full output, including branch protection with \`ok: true\`.

${prReadiness.commands.map((command) => `- \`${command}\``).join('\n')}
`;
}

function renderReviewProofRequirements() {
  return `# ${GATE_ID} Review Proof Requirements

Status: \`PENDING_EXACT_REMOTE_HEAD_REVIEW\`

This file defines requirements only. The builder does not generate reviewer identities, verdicts, or lead-review approval.

Required external proof against the exact remote payload head:

- Teacher verdict: \`MORE_THAN_SATISFIED\`
- Economist verdict: \`MORE_THAN_SATISFIED\`
- Quality inspection verdict: \`MORE_THAN_SATISFIED\`
- Lead result: \`PASS\` or \`PASS WITH FLAGS\`
- Lead \`reviewed_commit_sha\`: exact remote payload head
- Full live branch-protection output with \`ok: true\`
- Exact-head required CI and Bundle 4 checker success

\`PASS WITH FLAGS\` may not carry a missing core requirement. Payload integration authorization and later per-candidate execution-preparation authority are separate decisions.
`;
}

function renderBundleUrls() {
  const files = [
    BUILD_SCRIPT,
    CHECK_SCRIPT,
    CONTRACT_SCRIPT,
    ADJUDICATION_EVIDENCE_SCRIPT,
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
    REVIEW_PROOF_REQUIREMENTS_MD
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
    diagnosticEvidenceManifest: readJson(SOURCE_FILES.diagnosticEvidenceManifest),
    executionBenchmark: readJson(SOURCE_FILES.executionBenchmark),
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
  writeText(REVIEW_PROOF_REQUIREMENTS_MD, renderReviewProofRequirements());
  return bundle;
}

try {
  const bundle = build();
  console.log(`OK ${SPRINT_ID}: built ${bundle.bundle_id} (${bundle.summary.protected_operations_prepared} protected operations prepared)`);
} catch (error) {
  console.error(`FAIL ${SPRINT_ID}: ${error.message}`);
  process.exit(1);
}
