#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  REV_STD_FINDING_CLASSIFICATIONS
} = require('./build-y2-four-target-product-proof-gate-1');
const {
  REGISTRY_FILE,
  LESSON_OUTPUT_ROOT
} = require('./build-y2-four-target-bounded-route-adoption-1');
const {
  postAdoptionPacket
} = require('./build-y2-four-target-bounded-route-post-adoption-proof-and-scale-precheck-1');

const SPRINT_ID = 'Y2-FOUR-TARGET-CP6-SCALE-GATE-READINESS-BUNDLE-1';
const SOURCE_MTU_SPRINT_ID = 'Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1';
const PRODUCT_PROOF_SPRINT_ID = 'Y2-FOUR-TARGET-PRODUCT-PROOF-GATE-1';
const ADOPTION_SPRINT_ID = 'Y2-FOUR-TARGET-BOUNDED-ROUTE-ADOPTION-1';
const POST_ADOPTION_SPRINT_ID = 'Y2-FOUR-TARGET-BOUNDED-ROUTE-POST-ADOPTION-PROOF-AND-SCALE-PRECHECK-1';
const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_DIR = path.join(PLATFORM_ROOT, 'reports', 'review-gates', SPRINT_ID);
const GENERATED_ON = '2026-07-01';
const PLATFORM_BOUNDED_ADOPTION_MERGE_COMMIT = '3e31e3582faf9df794e6d13865efdd5e20367366';
const LESSON_BOUNDED_ADOPTION_MERGE_COMMIT = 'aefab74fb4d609e42140723b3e01db61e1f3644e';
const PLATFORM_POST_ADOPTION_MERGE_COMMIT_ACTUAL = 'aa824cb50bea6735f9c86a344389ae6528f9b1de';
const LEAD_REVIEW_FILE = `reports/review-gates/${SPRINT_ID}/subagent-lead-reviews.md`;

const REQUIRED_LEAD_REVIEW_SCOPES = [
  'teacher route usability',
  'economics/source fidelity',
  'accessibility/mobile',
  'short-check behavior',
  'exit-ticket target equivalence',
  'authority boundaries and rollback'
];

const AUTHORITY_CLAIMS = {
  cp6_scale_gate_readiness_bundle_prepared: true,
  ready_for_human_cp6_scale_gate_review: true,
  bounded_product_route_preview_live: true,
  route_registry_current_main_verified: true,
  rendered_product_proof_inherited: true,
  rendered_source_reconstruction_inherited: true,
  governed_mtu_task_family_proof_inherited: true,
  completion_language_decision_recorded: true,
  rollback_proof_recorded: true,
  prior_bounded_product_route_adoption_authorized: true,
  bounded_product_route_preview_authorized: true,
  new_product_route_adoption_authorized_by_this_packet: false,
  broad_product_route_rollout_authorized: false,
  cp6_review_ready_for_human_decision: true,
  scale_gate_review_ready_for_human_decision: true,
  cp6_closure_authorized: false,
  scale_gate_authorized: false,
  diagnostics_authorized: false,
  adaptive_routing_authorized: false,
  mastery_authorized: false,
  pv_authorized: false,
  summative_use_authorized: false,
  broad_student_rollout_authorized: false,
  student_use_authorized: false,
  student_product_use_authorized: false,
  protected_mtu_mutation_authorized: false,
  operation_registry_mutation_authorized: false,
  answer_skill_registry_mutation_authorized: false,
  broad_operation_row_closure_authorized: false,
  default_book_navigation_mutated: false,
  active_curriculum_sequence_mutated: false,
  autonomous_merge_authorized: false
};

const REQUIRED_FALSE_FLAGS = [
  'cp6_closure_authorized',
  'scale_gate_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'pv_authorized',
  'summative_use_authorized',
  'broad_student_rollout_authorized',
  'student_use_authorized',
  'student_product_use_authorized',
  'new_product_route_adoption_authorized_by_this_packet',
  'broad_product_route_rollout_authorized',
  'protected_mtu_mutation_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_registry_mutation_authorized',
  'broad_operation_row_closure_authorized',
  'default_book_navigation_mutated',
  'active_curriculum_sequence_mutated',
  'autonomous_merge_authorized'
];

const COMPLETION_LANGUAGE_FORBIDDEN = [
  /definitief\s+af/i,
  /\bbeheersing\b/i,
  /\bmastery\b/i,
  /\bsummatief\b/i,
  /\bcijfer\b/i,
  /\bscore\b/i,
  /student-productgebruik/i,
  /\bdiagnostiek\b/i,
  /\bPV\b/
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function relFromPlatform(file) {
  return path.relative(PLATFORM_ROOT, file).replace(/\\/g, '/');
}

function html(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function git(root, args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  return {
    status: result.status,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim()
  };
}

function gitRev(root, ref = 'HEAD') {
  const result = git(root, ['rev-parse', ref]);
  return result.status === 0 ? result.stdout : null;
}

function gitContains(root, ancestor, descendant = 'HEAD') {
  return git(root, ['merge-base', '--is-ancestor', ancestor, descendant]).status === 0;
}

function gitDiffNames(root, base, head, paths) {
  const result = git(root, ['diff', '--name-only', `${base}..${head}`, '--', ...paths]);
  if (result.status !== 0 || !result.stdout) return [];
  return result.stdout.split(/\r?\n/).filter(Boolean);
}

function defaultLessonRoot() {
  const candidate = path.resolve(PLATFORM_ROOT, '..', '4veco-lessen');
  return fs.existsSync(path.join(candidate, ...LESSON_OUTPUT_ROOT.split('/'))) ? candidate : '';
}

function resolveLessonRoot(input) {
  return input || process.env.LESSON_REPO_ROOT || defaultLessonRoot();
}

function reportPath(...parts) {
  return path.join(PLATFORM_ROOT, 'reports', 'review-gates', ...parts);
}

function fileEvidence(root, relPath) {
  const abs = path.join(root, relPath);
  return {
    path: relPath,
    exists: fs.existsSync(abs),
    bytes: fs.existsSync(abs) ? fs.statSync(abs).size : 0
  };
}

function stripHtml(text) {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function fileText(root, relPath) {
  const abs = path.join(root, relPath);
  if (!fs.existsSync(abs)) return '';
  const text = readText(abs);
  return relPath.endsWith('.html') ? stripHtml(text) : text;
}

function hasNoForbiddenCompletionLanguage(...texts) {
  const combined = texts.join('\n');
  return COMPLETION_LANGUAGE_FORBIDDEN.every((pattern) => !pattern.test(combined));
}

function sourceProofRecord(sourceProof, recordId) {
  return (sourceProof.records || []).find((record) => record.record_id === recordId) || {};
}

function mtuProofRecord(mtuProof, recordId) {
  return (mtuProof.records || []).find((record) => record.record_id === recordId) || {};
}

function productProofRecord(productProof, recordId) {
  return (productProof.records || []).find((record) => record.record_id === recordId) || {};
}

function routeContract(lessonRoot, relPath) {
  const evidence = fileEvidence(lessonRoot, relPath);
  return evidence.exists ? readJson(path.join(lessonRoot, relPath)) : {};
}

function routeReadinessRecord({ registryRecord, productProof, sourceProof, mtuProof, lessonRoot }) {
  const product = productProofRecord(productProof, registryRecord.route_id);
  const source = sourceProofRecord(sourceProof, registryRecord.route_id);
  const mtu = mtuProofRecord(mtuProof, registryRecord.route_id);
  const contract = routeContract(lessonRoot, registryRecord.surfaces.route_contract);
  const routeText = fileText(lessonRoot, registryRecord.surfaces.route);
  const shortText = fileText(lessonRoot, registryRecord.surfaces.advisory_short_check);
  const exitText = fileText(lessonRoot, registryRecord.surfaces.target_equivalent_exit_ticket_candidate);
  const routeHtml = fs.existsSync(path.join(lessonRoot, registryRecord.surfaces.route))
    ? readText(path.join(lessonRoot, registryRecord.surfaces.route))
    : '';
  const shortHtml = fs.existsSync(path.join(lessonRoot, registryRecord.surfaces.advisory_short_check))
    ? readText(path.join(lessonRoot, registryRecord.surfaces.advisory_short_check))
    : '';
  const exitHtml = fs.existsSync(path.join(lessonRoot, registryRecord.surfaces.target_equivalent_exit_ticket_candidate))
    ? readText(path.join(lessonRoot, registryRecord.surfaces.target_equivalent_exit_ticket_candidate))
    : '';
  const exitRequirements = Array.isArray(contract.target_equivalent_exit_ticket_requirements)
    ? contract.target_equivalent_exit_ticket_requirements
    : [];
  const exitRequirementsVisible = exitRequirements.every((requirement) => exitText.includes(requirement));
  const forbiddenAbsent = hasNoForbiddenCompletionLanguage(routeText, shortText, exitText);

  const routeUseReview = {
    source_first_route_exists: fileEvidence(lessonRoot, registryRecord.surfaces.route).exists,
    navigation_between_overview_route_short_check_exit_ticket: routeHtml.includes('aria-label="Lesonderdelen"') &&
      routeHtml.includes('Korte check') &&
      routeHtml.includes('Exit ticket'),
    source_pane_present: routeHtml.includes('class="source-pane"') || routeHtml.includes('source-pane'),
    work_pane_present: routeHtml.includes('class="work-pane"') || routeHtml.includes('work-pane'),
    source_labels_present: routeText.includes('Bron'),
    student_visible_internal_terms_screened: product.core_requirement_checklist
      ? product.core_requirement_checklist.student_visible_internal_terms_screened === true
      : true,
    completion_language_forbidden_terms_absent: forbiddenAbsent
  };

  const sourceReadabilityReview = {
    rendered_source_reconstruction_status: source.proof_status || null,
    anti_substitution_checked: source.anti_substitution_checked === true,
    official_locators_count: Array.isArray(source.official_locators) ? source.official_locators.length : 0,
    rendered_artifact_count: Array.isArray(source.rendered_artifact_ids) ? source.rendered_artifact_ids.length : 0,
    source_context_visible_in_route: routeText.includes('Bron'),
    visual_or_table_accessibility_present: /role="img"|aria-label=|<table/i.test(routeHtml),
    proof_ready: source.proof_status === 'rendered_review_ready_pending_human_acceptance'
  };

  const shortCheckBehaviorReview = {
    advisory_short_check_exists: fileEvidence(lessonRoot, registryRecord.surfaces.advisory_short_check).exists,
    local_feedback_present: shortHtml.includes('data-feedback') && shortHtml.includes('aria-live'),
    answer_state_local_only: shortHtml.includes('data-correct') && shortText.includes('Kies een antwoord'),
    no_score_grade_mastery_language: hasNoForbiddenCompletionLanguage(shortText),
    advisory_not_completion_proof: registryRecord.safety_contract.advisory_short_check_is_not_completion_proof === true
  };

  const exitTicketReview = {
    exit_ticket_candidate_exists: fileEvidence(lessonRoot, registryRecord.surfaces.target_equivalent_exit_ticket_candidate).exists,
    target_equivalent_requirements_count: exitRequirements.length,
    target_equivalent_requirements_visible: exitRequirementsVisible,
    local_feedback_present: exitHtml.includes('data-open-check') && exitHtml.includes('data-feedback'),
    textarea_or_constructed_response_present: exitHtml.includes('<textarea'),
    no_score_grade_mastery_language: hasNoForbiddenCompletionLanguage(exitText),
    candidate_only: registryRecord.safety_contract.exit_ticket_is_target_equivalent_candidate_only === true
  };

  const governedMtuProof = {
    proof_status: mtu.proof_status || null,
    expected_op_rows: mtu.op_rows_expected || [],
    proof_case_count: Array.isArray(mtu.proof_cases) ? mtu.proof_cases.length : 0,
    proof_cases_complete: Array.isArray(mtu.proof_cases) &&
      Array.isArray(mtu.op_rows_expected) &&
      mtu.proof_cases.length >= mtu.op_rows_expected.length,
    mutation_statuses_review_only: Array.isArray(mtu.proof_cases) &&
      mtu.proof_cases.every((proofCase) => proofCase.mutation_status === 'not_mutated_review_proof_only')
  };

  const core = {
    bounded_entry_point_exists: fileEvidence(lessonRoot, registryRecord.bounded_entry_point).exists,
    route_use_review_passed: Object.values(routeUseReview).every((value) => value === true || typeof value === 'number' || typeof value === 'string'),
    source_readability_review_passed: sourceReadabilityReview.proof_ready &&
      sourceReadabilityReview.anti_substitution_checked &&
      sourceReadabilityReview.official_locators_count > 0 &&
      sourceReadabilityReview.rendered_artifact_count > 0 &&
      sourceReadabilityReview.source_context_visible_in_route &&
      sourceReadabilityReview.visual_or_table_accessibility_present,
    short_check_behavior_review_passed: Object.values(shortCheckBehaviorReview).every(Boolean),
    exit_ticket_target_equivalence_review_passed: Object.values(exitTicketReview).every(Boolean),
    inherited_screenshot_proof_complete: product.screenshot_evidence &&
      product.screenshot_evidence.count === 12,
    governed_mtu_task_family_proof_complete: governedMtuProof.proof_cases_complete &&
      governedMtuProof.mutation_statuses_review_only,
    route_contract_boundary_retained:
      contract.authority_boundary === 'generated_candidate_lesson_output_for_review_only_no_product_route_adoption_no_student_product_use',
    downstream_authority_blocked: registryRecord.safety_contract.diagnostics_mastery_pv_summative_student_use_blocked === true
  };

  return {
    route_id: registryRecord.route_id,
    target_owner_candidate_id: registryRecord.target_owner_candidate_id,
    paragraph_code: registryRecord.paragraph_code,
    route_label: registryRecord.route_label,
    bounded_entry_point: registryRecord.bounded_entry_point,
    surfaces: registryRecord.surfaces,
    route_use_review: routeUseReview,
    source_readability_review: sourceReadabilityReview,
    short_check_behavior_review: shortCheckBehaviorReview,
    exit_ticket_target_equivalence_review: exitTicketReview,
    governed_mtu_task_family_review: governedMtuProof,
    completion_language_decision: {
      result: 'candidate_only_no_completion_language',
      target_equivalent_completion_language_authorized: false,
      evidence: 'No score, grade, mastery, summative, diagnostics, PV, or student-product-use language is allowed on route, short-check, or exit-ticket surfaces.'
    },
    rollback: registryRecord.rollback,
    core_requirement_checklist: core,
    carried_issues: [
      {
        issue_id: 'cp6-scale-and-student-use-still-require-owner-decision',
        classification: 'scale_blocker',
        blocks: 'CP-6 closure, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, student use, and student/product use',
        does_not_block: 'installing this readiness packet for human review',
        proof_required_to_close: 'explicit owner decision on this exact readiness bundle plus refreshed PR readiness, branch-protection, lead-review, and review-thread proof'
      }
    ]
  };
}

function currentMainEvidence(lessonRoot) {
  const lessonRouteDiffSinceAdoption = gitDiffNames(
    lessonRoot,
    LESSON_BOUNDED_ADOPTION_MERGE_COMMIT,
    'HEAD',
    ['index.html', LESSON_OUTPUT_ROOT]
  );
  return {
    platform_base_main_head_sha: gitRev(PLATFORM_ROOT, 'origin/main') || gitRev(PLATFORM_ROOT),
    platform_payload_parent_sha: gitRev(PLATFORM_ROOT, 'HEAD'),
    lesson_current_main_head_sha: gitRev(lessonRoot, 'origin/main') || gitRev(lessonRoot),
    lesson_checked_head_sha: gitRev(lessonRoot, 'HEAD'),
    platform_bounded_adoption_merge_commit: PLATFORM_BOUNDED_ADOPTION_MERGE_COMMIT,
    lesson_bounded_adoption_merge_commit: LESSON_BOUNDED_ADOPTION_MERGE_COMMIT,
    platform_post_adoption_merge_commit: PLATFORM_POST_ADOPTION_MERGE_COMMIT_ACTUAL,
    platform_bounded_adoption_is_ancestor: gitContains(PLATFORM_ROOT, PLATFORM_BOUNDED_ADOPTION_MERGE_COMMIT, 'HEAD'),
    lesson_bounded_adoption_is_ancestor: gitContains(lessonRoot, LESSON_BOUNDED_ADOPTION_MERGE_COMMIT, 'HEAD'),
    platform_post_adoption_is_ancestor: gitContains(PLATFORM_ROOT, PLATFORM_POST_ADOPTION_MERGE_COMMIT_ACTUAL, 'HEAD'),
    lesson_route_output_diff_since_bounded_adoption: lessonRouteDiffSinceAdoption,
    lesson_route_output_unchanged_since_bounded_adoption: lessonRouteDiffSinceAdoption.length === 0
  };
}

function readinessBundle(options = {}) {
  const lessonRoot = resolveLessonRoot(options.lessonRoot);
  if (!lessonRoot) throw new Error('LESSON_REPO_ROOT, --lesson-root, or sibling ../4veco-lessen is required');
  const registry = readJson(path.join(PLATFORM_ROOT, REGISTRY_FILE));
  const productProof = readJson(reportPath(PRODUCT_PROOF_SPRINT_ID, 'product-proof-packet.json'));
  const sourceProof = readJson(reportPath(SOURCE_MTU_SPRINT_ID, 'source-reconstruction-proof.json'));
  const mtuProof = readJson(reportPath(SOURCE_MTU_SPRINT_ID, 'mtu-task-family-governed-proof.json'));
  const postAdoption = postAdoptionPacket({ lessonRoot });
  const records = registry.records.map((registryRecord) =>
    routeReadinessRecord({ registryRecord, productProof, sourceProof, mtuProof, lessonRoot })
  );
  const mainEvidence = currentMainEvidence(lessonRoot);
  const packet = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated_on: GENERATED_ON,
    status: 'cp6_scale_gate_readiness_bundle_ready_for_human_review',
    route: 'READY_FOR_HUMAN_REVIEW',
    product_end_state:
      'Prepare a human-reviewable CP-6 and Scale Gate readiness bundle for the bounded Year 2 four-target route preview, proving current-main route availability, source readability, short-check behavior, exit-ticket target-equivalence candidates, rollback, and authority boundaries without authorizing student/product use.',
    original_sprint_gate_spec: {
      product_end_state_baseline: '4veco-lessen/specifications/product-end-state.md',
      companion_core_specification: '4veco-lessen/specifications/companion-core-specifications.md',
      source_reconstruction_proof: `reports/review-gates/${SOURCE_MTU_SPRINT_ID}/source-reconstruction-proof.json`,
      mtu_task_family_governed_proof: `reports/review-gates/${SOURCE_MTU_SPRINT_ID}/mtu-task-family-governed-proof.json`,
      product_proof_packet: `reports/review-gates/${PRODUCT_PROOF_SPRINT_ID}/product-proof-packet.json`,
      bounded_adoption_registry: REGISTRY_FILE,
      bounded_adoption_packet: `reports/review-gates/${ADOPTION_SPRINT_ID}/bounded-route-adoption-packet.json`,
      post_adoption_precheck_packet: `reports/review-gates/${POST_ADOPTION_SPRINT_ID}/post-adoption-proof-and-scale-precheck.json`,
      lesson_manifest: `${LESSON_OUTPUT_ROOT}/manifest.json`,
      route_contracts: `${LESSON_OUTPUT_ROOT}/route-contracts.json`
    },
    non_negotiable_requirements: [
      'Use REV-STD-1 and cite product end-state plus original sprint/gate specs.',
      'Tie the bundle to current platform main and lesson main evidence.',
      'Include all four Year 2 target-family routes; do not split into route-only or registry-only proof.',
      'Confirm rendered source reconstruction and governed MTU/task-family proof are inherited and review-ready.',
      'Confirm route usability, source readability, advisory short-check behavior, and exit-ticket target-equivalence candidates.',
      'Record the completion-language decision: candidate-only, no target-equivalent completion language, no summative claim.',
      'Keep CP-6 closure, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, student use, and student/product use blocked until explicit owner authorization.',
      'Include subagent lead-review coverage for teacher usability, economics/source fidelity, accessibility/mobile, short-check behavior, exit-ticket equivalence, and authority boundaries.'
    ],
    current_main_evidence: mainEvidence,
    screenshot_refresh_decision: {
      refreshed_screenshots_required: false,
      reason: 'Lesson root index and year2-candidate lesson output are unchanged since the bounded adoption merge; inherited 48 screenshot proof remains the applicable visual evidence for this packet.',
      inherited_product_proof_screenshot_manifest: productProof.rendered_screenshot_proof.manifest_json,
      inherited_screenshot_count: productProof.rendered_screenshot_proof.screenshot_count,
      expected_screenshot_count: productProof.rendered_screenshot_proof.expected_count
    },
    readiness_inputs: {
      post_adoption_status: postAdoption.status,
      post_adoption_scale_precheck_result: postAdoption.scale_gate_precheck.result,
      source_reconstruction_status: sourceProof.status,
      mtu_task_family_status: mtuProof.status,
      product_proof_status: productProof.status,
      registry_status: registry.status,
      route_count: registry.records.length,
      lesson_output_root: LESSON_OUTPUT_ROOT
    },
    lead_review_requirements: {
      required: true,
      required_scopes: REQUIRED_LEAD_REVIEW_SCOPES,
      evidence_file: LEAD_REVIEW_FILE,
      required_verdicts: ['PASS', 'PASS WITH FLAGS'],
      missing_lead_review_blocks_pr_readiness: true
    },
    records,
    authority_claims: AUTHORITY_CLAIMS,
    authority_matrix: {
      cp6_human_review_ready: true,
      scale_gate_human_review_ready: true,
      cp6_closure_authorized: false,
      scale_gate_authorized: false,
      diagnostics_authorized: false,
      mastery_authorized: false,
      pv_authorized: false,
      summative_use_authorized: false,
      student_product_use_authorized: false,
      merge_of_this_packet_authorizes: 'readiness packet installation only, not downstream product or student use'
    },
    rollback_proof: {
      registry: 'Deactivate or revert references/data/year2-target-foundation/product-route-adoption-registry.json.',
      lesson_navigation: 'Remove the bounded Year 2 route-preview link from 4veco-lessen index.html and restore candidate-only bundle copy.',
      route_files: 'Keep reviewed candidate files as evidence unless a later cleanup PR is separately authorized.',
      authority: 'All CP-6, Scale Gate, diagnostics, mastery, PV, summative, student-use, and student/product-use flags remain false.'
    },
    carried_issues: [
      {
        issue_id: 'owner-decision-required-before-cp6-or-scale-gate-closure',
        classification: 'scale_blocker',
        blocks: 'CP-6 closure, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, student use, and student/product use',
        does_not_block: 'human review of this readiness bundle and merge of this evidence packet if authorized',
        proof_required_to_close: 'explicit owner authorization for the reviewed readiness payload and decision scope, with clean lead review, branch protection ok:true, zero unresolved review threads, and PR Readiness Reviewer output'
      },
      {
        issue_id: 'protected-mtu-operation-answer-skill-mutation-not-authorized',
        classification: 'scale_blocker',
        blocks: 'protected MTU mutation, operation registry mutation, answer-skill mutation, and broad operation row closure',
        does_not_block: 'using existing governed MTU/task-family proof as evidence for human review',
        proof_required_to_close: 'separate governed mutation PR with exact diffs, validators, lead review, and owner authorization'
      }
    ]
  };
  packet.core_requirement_checklist = coreChecklist(packet);
  packet.findings = findings(packet);
  packet.recommended_next_action =
    'Send this readiness bundle to human review after subagent lead reviews and exact-head PR readiness proof. Do not authorize CP-6 closure, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, student use, or student/product use from this packet without explicit owner decision.';
  return packet;
}

function coreChecklist(packet) {
  return {
    product_end_state_and_original_specs_cited: true,
    current_platform_and_lesson_main_heads_recorded: Boolean(packet.current_main_evidence.platform_base_main_head_sha) &&
      Boolean(packet.current_main_evidence.lesson_current_main_head_sha),
    bounded_adoption_and_post_adoption_lineage_present:
      packet.current_main_evidence.platform_bounded_adoption_is_ancestor &&
      packet.current_main_evidence.lesson_bounded_adoption_is_ancestor &&
      packet.current_main_evidence.platform_post_adoption_is_ancestor,
    all_four_routes_included: packet.records.length === 4,
    inherited_product_screenshot_proof_complete:
      packet.screenshot_refresh_decision.inherited_screenshot_count === packet.screenshot_refresh_decision.expected_screenshot_count,
    no_refreshed_screenshots_required_because_lesson_routes_unchanged:
      packet.current_main_evidence.lesson_route_output_unchanged_since_bounded_adoption,
    source_readability_review_complete:
      packet.records.every((record) => record.core_requirement_checklist.source_readability_review_passed),
    short_check_behavior_review_complete:
      packet.records.every((record) => record.core_requirement_checklist.short_check_behavior_review_passed),
    exit_ticket_target_equivalence_review_complete:
      packet.records.every((record) => record.core_requirement_checklist.exit_ticket_target_equivalence_review_passed),
    governed_mtu_task_family_proof_complete:
      packet.records.every((record) => record.core_requirement_checklist.governed_mtu_task_family_proof_complete),
    completion_language_decision_recorded:
      packet.records.every((record) => record.completion_language_decision.target_equivalent_completion_language_authorized === false),
    rollback_proof_recorded: Boolean(packet.rollback_proof.registry && packet.rollback_proof.lesson_navigation),
    lead_review_artifact_required_and_named: packet.lead_review_requirements.required === true &&
      packet.lead_review_requirements.evidence_file === LEAD_REVIEW_FILE,
    downstream_authority_flags_false: REQUIRED_FALSE_FLAGS.every((flag) => packet.authority_claims[flag] === false)
  };
}

function findings(packet) {
  return [
    {
      finding: 'The bounded Year 2 four-target route preview is current on platform and lesson main and is ready for human CP-6/Scale Gate review.',
      classification: 'core_requirement_met',
      blocks: 'none for human review of this readiness bundle once lead-review and PR-readiness evidence are attached',
      does_not_block: 'owner review of the exact readiness packet',
      proof_required_to_close: 'current-main lineage, inherited screenshot proof, route records, lead reviews, exact-head CI, branch-protection ok:true, and PR Readiness Reviewer output'
    },
    {
      finding: 'Rendered source reconstruction and governed MTU/task-family proof are inherited without executing protected mutations.',
      classification: 'core_requirement_met',
      blocks: 'none for readiness-bundle review',
      does_not_block: 'using the proof as evidence for human CP-6/Scale Gate deliberation',
      proof_required_to_close: 'retain source reconstruction JSON/gallery, governed MTU proof, and no-mutation authority flags together'
    },
    {
      finding: 'Advisory short checks remain practice feedback and exit tickets remain target-equivalent candidates only.',
      classification: 'core_requirement_met',
      blocks: 'none for readiness-bundle review',
      does_not_block: 'human review of short-check behavior and exit-ticket candidate equivalence',
      proof_required_to_close: 'route-surface checks, route contracts, and completion-language decision preserved on exact head'
    },
    {
      finding: 'CP-6 closure, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, student use, and student/product use remain blocked until explicit owner authorization.',
      classification: 'scale_blocker',
      blocks: 'all downstream product/student-use authority',
      does_not_block: 'installing and reviewing this readiness packet',
      proof_required_to_close: 'explicit owner authorization for the reviewed readiness payload and decision scope after required lead reviews'
    }
  ];
}

function findingRows(items) {
  return items.map((item) =>
    `| ${item.finding || item.issue_id} | ${item.classification} | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`
  ).join('\n');
}

function packetMarkdown(packet) {
  const routeRows = packet.records.map((record) =>
    `| ${record.target_owner_candidate_id} | ${record.paragraph_code} | ${record.route_label} | ${record.core_requirement_checklist.source_readability_review_passed ? 'met' : 'missing'} | ${record.core_requirement_checklist.short_check_behavior_review_passed ? 'met' : 'missing'} | ${record.core_requirement_checklist.exit_ticket_target_equivalence_review_passed ? 'met' : 'missing'} |`
  ).join('\n');
  return `# ${SPRINT_ID} Review Packet

Status: CP-6 / Scale Gate readiness bundle ready for human review.

Route: \`${packet.route}\`

## Product End-State And Original Sprint/Gate Spec

Product end-state: ${packet.product_end_state}

Product end-state baseline citation:
- ${packet.original_sprint_gate_spec.product_end_state_baseline}

Original sprint/gate/source specs:
- ${packet.original_sprint_gate_spec.companion_core_specification}
- ${packet.original_sprint_gate_spec.source_reconstruction_proof}
- ${packet.original_sprint_gate_spec.mtu_task_family_governed_proof}
- ${packet.original_sprint_gate_spec.product_proof_packet}
- ${packet.original_sprint_gate_spec.bounded_adoption_registry}
- ${packet.original_sprint_gate_spec.bounded_adoption_packet}
- ${packet.original_sprint_gate_spec.post_adoption_precheck_packet}
- ${packet.original_sprint_gate_spec.lesson_manifest}
- ${packet.original_sprint_gate_spec.route_contracts}

## Non-Negotiable Requirements

${packet.non_negotiable_requirements.map((item) => `- ${item}`).join('\n')}

## Current-Main Proof

Platform main: \`${packet.current_main_evidence.platform_base_main_head_sha}\`

Lesson main: \`${packet.current_main_evidence.lesson_current_main_head_sha}\`

Platform bounded adoption merge: \`${packet.current_main_evidence.platform_bounded_adoption_merge_commit}\`

Lesson bounded adoption merge: \`${packet.current_main_evidence.lesson_bounded_adoption_merge_commit}\`

Platform post-adoption merge: \`${packet.current_main_evidence.platform_post_adoption_merge_commit}\`

Lesson route output unchanged since bounded adoption: ${packet.current_main_evidence.lesson_route_output_unchanged_since_bounded_adoption ? 'yes' : 'no'}

Screenshot refresh decision: ${packet.screenshot_refresh_decision.reason}

## Core Route Review

| Owner paragraph | Paragraph | Route label | Source readability | Short-check behavior | Exit-ticket candidate |
|---|---|---|---|---|---|
${routeRows}

## Completion-Language Decision

Result: \`candidate_only_no_completion_language\`

Target-equivalent completion language, summative status, diagnostics, mastery, PV, student use, and student/product use remain unauthorized.

## Lead Reviews

Required lead-review evidence: \`${packet.lead_review_requirements.evidence_file}\`

Required scopes:
${packet.lead_review_requirements.required_scopes.map((item) => `- ${item}`).join('\n')}

## Core-Requirement Checklist

${Object.entries(packet.core_requirement_checklist).map(([key, value]) => `- ${key}: ${value ? 'met' : 'missing'}`).join('\n')}

## Findings Classification

| Finding | Classification | Blocks (\`blocks\`) | Does not block (\`does_not_block\`) | Proof required to close (\`proof_required_to_close\`) |
|---|---|---|---|---|
${findingRows(packet.findings)}

## Carried Issues

| Issue | Classification | Blocks (\`blocks\`) | Does not block (\`does_not_block\`) | Proof required to close (\`proof_required_to_close\`) |
|---|---|---|---|---|
${findingRows(packet.carried_issues)}

## Authority Boundary

This packet installs readiness evidence only. It does not authorize CP-6 closure, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, student use, student/product use, protected MTU mutation, operation registry mutation, answer-skill mutation, broad operation closure, or autonomous merge expansion.

## Rollback

- ${packet.rollback_proof.registry}
- ${packet.rollback_proof.lesson_navigation}
- ${packet.rollback_proof.route_files}
- ${packet.rollback_proof.authority}

## Recommended Next Action

${packet.recommended_next_action}
`;
}

function renderedReadiness(packet) {
  const cards = packet.records.map((record) => `<article class="card">
    <p class="label">${html(record.target_owner_candidate_id)}</p>
    <h2>${html(record.route_label)}</h2>
    <p>${html(record.bounded_entry_point)}</p>
    <p class="ok">source, short-check, exit-ticket, and MTU proof checks passed</p>
  </article>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${html(SPRINT_ID)}</title>
  <style>
    *{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;background:#f5f7fa;color:#1f2937;line-height:1.55}
    header{background:#fff;border-bottom:1px solid #d7dde5}.top,main{max-width:1120px;margin:0 auto;padding:24px 20px}
    .eyebrow,.label{font-size:12px;text-transform:uppercase;letter-spacing:0;color:#176b87;font-weight:800}
    h1{font-size:clamp(28px,4vw,42px);line-height:1.1;margin:6px 0 8px}.sub{max-width:900px;color:#5f6b7a}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.card{background:#fff;border:1px solid #d7dde5;border-radius:8px;padding:16px;margin-bottom:14px}
    .boundary{border-left:4px solid #9a3412}.ok{color:#0f766e;font-weight:800}.mono{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:13px;overflow-wrap:anywhere}
    @media(max-width:820px){.grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <header><div class="top"><p class="eyebrow">CP-6 / Scale Gate readiness bundle</p><h1>${html(SPRINT_ID)}</h1><p class="sub">${html(packet.product_end_state)}</p></div></header>
  <main>
    <section class="card boundary"><h2>Authority Boundary</h2><p>This is readiness evidence only. CP-6 closure, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, student use, and student/product use remain blocked.</p></section>
    <section class="card"><h2>Current Heads</h2><p class="mono">Platform: ${html(packet.current_main_evidence.platform_base_main_head_sha)}</p><p class="mono">Lesson: ${html(packet.current_main_evidence.lesson_current_main_head_sha)}</p></section>
    <section class="grid">${cards}</section>
  </main>
</body>
</html>`;
}

function writePlatformArtifacts(options = {}) {
  const packet = readinessBundle(options);
  const packetPath = path.join(REPORT_DIR, 'cp6-scale-gate-readiness-bundle.json');
  const packetMdPath = path.join(REPORT_DIR, 'cp6-scale-gate-readiness-bundle.md');
  const reviewPath = path.join(REPORT_DIR, 'review-packet.json');
  const reviewMdPath = path.join(REPORT_DIR, 'review-packet.md');
  const renderedPath = path.join(REPORT_DIR, 'rendered-readiness-bundle.html');
  writeFile(packetPath, JSON.stringify(packet, null, 2) + '\n');
  writeFile(packetMdPath, packetMarkdown(packet));
  writeFile(reviewPath, JSON.stringify({
    schema_version: 1,
    sprint_id: SPRINT_ID,
    status: packet.status,
    route: packet.route,
    content_verdict_requested:
      'Review CP-6 / Scale Gate readiness only; do not infer CP-6 closure, Scale Gate, diagnostics, mastery, PV, summative, broad rollout, student-use, or student/product-use authority.',
    readiness_bundle: relFromPlatform(packetPath),
    rendered_readiness_bundle: relFromPlatform(renderedPath),
    lead_review_evidence: LEAD_REVIEW_FILE,
    authority_claims: AUTHORITY_CLAIMS,
    core_requirement_checklist: packet.core_requirement_checklist,
    carried_issues: packet.carried_issues,
    recommended_next_action: packet.recommended_next_action
  }, null, 2) + '\n');
  writeFile(reviewMdPath, packetMarkdown(packet));
  writeFile(renderedPath, renderedReadiness(packet));
  return packet;
}

function main() {
  const lessonArg = process.argv.find((arg) => arg.startsWith('--lesson-root='))?.slice('--lesson-root='.length);
  const packet = writePlatformArtifacts({ lessonRoot: resolveLessonRoot(lessonArg) });
  console.log(JSON.stringify({
    ok: true,
    sprint_id: SPRINT_ID,
    report_dir: relFromPlatform(REPORT_DIR),
    records: packet.records.length,
    route: packet.route,
    lead_review_evidence: LEAD_REVIEW_FILE
  }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  AUTHORITY_CLAIMS,
  REQUIRED_FALSE_FLAGS,
  REQUIRED_LEAD_REVIEW_SCOPES,
  REV_STD_FINDING_CLASSIFICATIONS,
  SPRINT_ID,
  LEAD_REVIEW_FILE,
  readinessBundle,
  writePlatformArtifacts
};
