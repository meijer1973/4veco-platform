#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  AUTHORITY_CLAIMS: READINESS_AUTHORITY_CLAIMS,
  REQUIRED_FALSE_FLAGS: READINESS_REQUIRED_FALSE_FLAGS,
  REQUIRED_LEAD_REVIEW_SCOPES: READINESS_REQUIRED_LEAD_REVIEW_SCOPES,
  REV_STD_FINDING_CLASSIFICATIONS,
  SPRINT_ID: READINESS_SPRINT_ID,
  LEAD_REVIEW_FILE: READINESS_LEAD_REVIEW_FILE,
  readinessBundle
} = require('./build-y2-four-target-cp6-scale-gate-readiness-bundle-1');
const {
  REGISTRY_FILE,
  LESSON_OUTPUT_ROOT
} = require('./build-y2-four-target-bounded-route-adoption-1');

const SPRINT_ID = 'Y2-FOUR-TARGET-CP6-SCALE-GATE-DECISION-BUNDLE-1';
const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_DIR = path.join(PLATFORM_ROOT, 'reports', 'review-gates', SPRINT_ID);
const GENERATED_ON = '2026-07-02';
const PLATFORM_BOUNDED_ROUTE_ADOPTION_AND_POST_ADOPTION_PROOF_MERGE_COMMIT =
  'a44678734809025656b4200cebe0061f61e8e597';
const LEAD_REVIEW_FILE = `reports/review-gates/${SPRINT_ID}/subagent-lead-reviews.md`;

const REQUIRED_LEAD_REVIEW_SCOPES = [
  'teacher decision usability',
  'economics/source fidelity',
  'accessibility/mobile',
  'short-check and exit-ticket behavior',
  'exit-ticket target-equivalence decision',
  'CP-6 / Scale Gate authority boundaries',
  'rollback and scope control'
];

const AUTHORITY_CLAIMS = {
  cp6_scale_gate_decision_bundle_prepared: true,
  ready_for_owner_cp6_scale_gate_decision: true,
  readiness_bundle_inherited: true,
  current_main_proof_recorded: true,
  bounded_product_route_preview_live: true,
  source_reconstruction_proof_inherited: true,
  governed_mtu_task_family_proof_inherited: true,
  product_route_use_evidence_recorded: true,
  exit_ticket_equivalence_decision_recorded: true,
  teacher_economics_review_requirements_recorded: true,
  rollback_and_scope_control_recorded: true,
  cp6_decision_authorized_by_this_packet: false,
  cp6_closure_authorized: false,
  scale_gate_decision_authorized_by_this_packet: false,
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
  product_route_adoption_mutation_authorized_by_this_packet: false,
  default_book_navigation_mutated: false,
  active_curriculum_sequence_mutated: false,
  autonomous_merge_authorized: false
};

const REQUIRED_FALSE_FLAGS = [
  'cp6_decision_authorized_by_this_packet',
  'cp6_closure_authorized',
  'scale_gate_decision_authorized_by_this_packet',
  'scale_gate_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'pv_authorized',
  'summative_use_authorized',
  'broad_student_rollout_authorized',
  'student_use_authorized',
  'student_product_use_authorized',
  'protected_mtu_mutation_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_registry_mutation_authorized',
  'broad_operation_row_closure_authorized',
  'product_route_adoption_mutation_authorized_by_this_packet',
  'default_book_navigation_mutated',
  'active_curriculum_sequence_mutated',
  'autonomous_merge_authorized'
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content);
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

function gitBranch(root) {
  const result = git(root, ['rev-parse', '--abbrev-ref', 'HEAD']);
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

function currentMainDecisionEvidence(lessonRoot, readiness) {
  const decisionSurfaceDiffSincePostAdoption = gitDiffNames(
    PLATFORM_ROOT,
    PLATFORM_BOUNDED_ROUTE_ADOPTION_AND_POST_ADOPTION_PROOF_MERGE_COMMIT,
    'HEAD',
    [
      REGISTRY_FILE,
      'references/navigation',
      'references/data/year2-target-foundation',
      'build-scripts/content',
      'build-scripts/platform'
    ]
  );
  const decisionBundleProtectedSurfaceDiffAgainstCurrentMain = gitDiffNames(
    PLATFORM_ROOT,
    'origin/main',
    'HEAD',
    [
      REGISTRY_FILE,
      'references/navigation',
      'references/data/year2-target-foundation',
      'build-scripts/content',
      'build-scripts/platform'
    ]
  );
  return {
    platform_branch: gitBranch(PLATFORM_ROOT),
    platform_origin_main_sha: gitRev(PLATFORM_ROOT, 'origin/main') || gitRev(PLATFORM_ROOT),
    platform_checked_head_sha: gitRev(PLATFORM_ROOT),
    lesson_origin_main_sha: gitRev(lessonRoot, 'origin/main') || gitRev(lessonRoot),
    lesson_checked_head_sha: gitRev(lessonRoot),
    platform_bounded_route_adoption_and_post_adoption_proof_merge_commit:
      PLATFORM_BOUNDED_ROUTE_ADOPTION_AND_POST_ADOPTION_PROOF_MERGE_COMMIT,
    platform_bounded_route_adoption_and_post_adoption_proof_is_ancestor: gitContains(
      PLATFORM_ROOT,
      PLATFORM_BOUNDED_ROUTE_ADOPTION_AND_POST_ADOPTION_PROOF_MERGE_COMMIT,
      'HEAD'
    ),
    inherited_readiness_current_main_evidence: readiness.current_main_evidence,
    protected_route_adoption_surface_diff_since_post_adoption: decisionSurfaceDiffSincePostAdoption,
    decision_bundle_protected_surface_diff_against_current_main:
      decisionBundleProtectedSurfaceDiffAgainstCurrentMain,
    protected_route_adoption_surfaces_unchanged_by_decision_bundle:
      decisionBundleProtectedSurfaceDiffAgainstCurrentMain.length === 0
  };
}

function routeDecisionRecord(record) {
  return {
    route_id: record.route_id,
    target_owner_candidate_id: record.target_owner_candidate_id,
    paragraph_code: record.paragraph_code,
    route_label: record.route_label,
    bounded_entry_point: record.bounded_entry_point,
    surfaces: record.surfaces,
    route_use_evidence: {
      source_first_route_exists: record.route_use_review.source_first_route_exists,
      source_pane_present: record.route_use_review.source_pane_present,
      work_pane_present: record.route_use_review.work_pane_present,
      source_labels_present: record.route_use_review.source_labels_present,
      advisory_short_check_exists: record.short_check_behavior_review.advisory_short_check_exists,
      exit_ticket_candidate_exists: record.exit_ticket_target_equivalence_review.exit_ticket_candidate_exists,
      student_visible_internal_terms_screened:
        record.route_use_review.student_visible_internal_terms_screened,
      no_completion_or_student_product_use_language:
        record.route_use_review.completion_language_forbidden_terms_absent
    },
    source_and_mtu_evidence: {
      source_reconstruction_status: record.source_readability_review.rendered_source_reconstruction_status,
      source_context_visible_in_route: record.source_readability_review.source_context_visible_in_route,
      official_locators_count: record.source_readability_review.official_locators_count,
      rendered_artifact_count: record.source_readability_review.rendered_artifact_count,
      governed_mtu_proof_status: record.governed_mtu_task_family_review.proof_status,
      governed_mtu_proof_case_count: record.governed_mtu_task_family_review.proof_case_count,
      governed_mtu_proof_cases_complete:
        record.governed_mtu_task_family_review.proof_cases_complete,
      mutation_statuses_review_only:
        record.governed_mtu_task_family_review.mutation_statuses_review_only
    },
    exit_ticket_equivalence_decision: {
      decision_status: 'candidate_only_ready_for_owner_decision_not_completion_proof',
      target_equivalent_requirements_visible:
        record.exit_ticket_target_equivalence_review.target_equivalent_requirements_visible,
      constructed_response_present:
        record.exit_ticket_target_equivalence_review.textarea_or_constructed_response_present,
      local_feedback_present: record.exit_ticket_target_equivalence_review.local_feedback_present,
      target_equivalent_completion_language_authorized: false,
      student_use_authorized: false,
      owner_decision_required_before_any_completion_claim: true,
      negative_guards: [
        'no score, grade, mastery, diagnostics, PV, summative, or student/product-use language',
        'no target-equivalent completion claim',
        'no CP-6 or Scale Gate closure claim',
        'no replacement of teacher/owner judgment with local feedback'
      ]
    },
    core_requirement_checklist: {
      route_use_evidence_complete:
        record.core_requirement_checklist.route_use_review_passed,
      source_readability_evidence_complete:
        record.core_requirement_checklist.source_readability_review_passed,
      short_check_behavior_evidence_complete:
        record.core_requirement_checklist.short_check_behavior_review_passed,
      exit_ticket_candidate_evidence_complete:
        record.core_requirement_checklist.exit_ticket_target_equivalence_review_passed,
      governed_mtu_task_family_proof_complete:
        record.core_requirement_checklist.governed_mtu_task_family_proof_complete,
      completion_language_still_unauthorized:
        record.completion_language_decision.target_equivalent_completion_language_authorized === false,
      downstream_authority_blocked:
        record.core_requirement_checklist.downstream_authority_blocked
    },
    carried_issues: record.carried_issues
  };
}

function decisionMatrix() {
  return [
    {
      decision: 'CP-6 closure',
      status: 'READY_FOR_OWNER_DECISION',
      authorized_by_this_packet: false,
      blocks: 'CP-6 closure and any CP-6-dependent downstream route',
      does_not_block: 'human review of the exact decision bundle',
      proof_required_to_close:
        'explicit owner authorization for the reviewed decision payload lineage and decision scope, supported by exact-head CI, branch-protection ok:true, lead review, review-thread, and PR Readiness Reviewer proof'
    },
    {
      decision: 'Scale Gate',
      status: 'READY_FOR_OWNER_DECISION',
      authorized_by_this_packet: false,
      blocks: 'Scale Gate, broad rollout, and student/product-use reliance',
      does_not_block: 'human review of bounded route readiness and decision evidence',
      proof_required_to_close:
        'explicit owner Scale Gate decision on the reviewed payload lineage with retained scope limits and exact-head PR proof as evidence'
    },
    {
      decision: 'Diagnostics / mastery / adaptive routing / PV',
      status: 'BLOCKED_NOT_REQUESTED',
      authorized_by_this_packet: false,
      blocks: 'diagnostics, mastery, adaptive routing, and PV use',
      does_not_block: 'CP-6 / Scale Gate decision review with these authorities false',
      proof_required_to_close:
        'separate governed product-authority PR and owner authorization'
    },
    {
      decision: 'Summative use and target-equivalent completion language',
      status: 'BLOCKED_NOT_REQUESTED',
      authorized_by_this_packet: false,
      blocks: 'summative use, grades, scores, mastery claims, and completion claims',
      does_not_block: 'reviewing exit-ticket candidates as candidates only',
      proof_required_to_close:
        'separate summative/target-equivalent decision with answer contracts, after-interaction proof, and owner authorization'
    },
    {
      decision: 'Student use / student-product use / broad rollout',
      status: 'BLOCKED_NOT_REQUESTED',
      authorized_by_this_packet: false,
      blocks: 'student use, student/product use, and broad rollout',
      does_not_block: 'owner review of whether the bounded routes are ready for a later authorized gate',
      proof_required_to_close:
        'separate release decision with product routing, support, monitoring, rollback, and owner authorization'
    },
    {
      decision: 'Protected MTU, operation, answer-skill, or broad OP closure mutation',
      status: 'BLOCKED_NOT_REQUESTED',
      authorized_by_this_packet: false,
      blocks: 'protected MTU mutation, operation registry mutation, answer-skill mutation, and broad OP row closure',
      does_not_block: 'using no-mutation governed proof as review evidence',
      proof_required_to_close:
        'separate governed mutation PR with validators, lead review, and owner authorization'
    }
  ];
}

function decisionBundle(options = {}) {
  const lessonRoot = resolveLessonRoot(options.lessonRoot);
  if (!lessonRoot) throw new Error('LESSON_REPO_ROOT, --lesson-root, or sibling ../4veco-lessen is required');
  const readiness = readinessBundle({ lessonRoot });
  const records = readiness.records.map(routeDecisionRecord);
  const packet = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated_on: GENERATED_ON,
    status: 'cp6_scale_gate_decision_bundle_ready_for_human_review',
    route: 'READY_FOR_HUMAN_REVIEW',
    product_end_state:
      'Prepare the owner-facing CP-6 / Scale Gate decision bundle for the four bounded Year 2 product routes, joining current-main proof, route-use evidence, source reconstruction, governed MTU/task-family proof, exit-ticket candidate decisions, rollback, and authority boundaries without closing CP-6, opening Scale Gate, or authorizing student/product use.',
    original_sprint_gate_spec: {
      product_end_state_baseline: readiness.original_sprint_gate_spec.product_end_state_baseline,
      companion_core_specification: readiness.original_sprint_gate_spec.companion_core_specification,
      source_reconstruction_proof: readiness.original_sprint_gate_spec.source_reconstruction_proof,
      mtu_task_family_governed_proof: readiness.original_sprint_gate_spec.mtu_task_family_governed_proof,
      product_proof_packet: readiness.original_sprint_gate_spec.product_proof_packet,
      bounded_adoption_registry: readiness.original_sprint_gate_spec.bounded_adoption_registry,
      bounded_adoption_packet: readiness.original_sprint_gate_spec.bounded_adoption_packet,
      post_adoption_precheck_packet: readiness.original_sprint_gate_spec.post_adoption_precheck_packet,
      readiness_bundle: `reports/review-gates/${READINESS_SPRINT_ID}/cp6-scale-gate-readiness-bundle.json`,
      readiness_review_packet: `reports/review-gates/${READINESS_SPRINT_ID}/review-packet.json`,
      lesson_manifest: readiness.original_sprint_gate_spec.lesson_manifest,
      route_contracts: readiness.original_sprint_gate_spec.route_contracts
    },
    non_negotiable_requirements: [
      'Use REV-STD-1 and cite the product end-state plus original sprint/gate specs.',
      'Preserve the four-route bundle: Book 5, Book 6, Book 7, and Book 8 must be reviewed together.',
      'Tie the decision bundle to exact current platform and lesson main evidence.',
      'Confirm PR #193/post-adoption proof lineage is present before owner decision.',
      'Retain route-use evidence, rendered source reconstruction, governed MTU/task-family proof, and inherited screenshot rationale.',
      'Record an explicit exit-ticket equivalence decision for each route while keeping completion language candidate-only and unauthorized.',
      'Keep CP-6 closure and Scale Gate as owner decisions; this packet may only prepare the decision surface.',
      'Keep diagnostics, mastery, PV, summative use, broad rollout, student use, student/product use, protected MTU mutation, operation mutation, answer-skill mutation, and broad OP closure blocked.',
      'Attach subagent lead-review evidence before PR readiness or merge review.'
    ],
    current_main_evidence: currentMainDecisionEvidence(lessonRoot, readiness),
    inherited_readiness_bundle: {
      sprint_id: READINESS_SPRINT_ID,
      status: readiness.status,
      route: readiness.route,
      lead_review_evidence: READINESS_LEAD_REVIEW_FILE,
      authority_claims: READINESS_AUTHORITY_CLAIMS,
      required_false_flags: READINESS_REQUIRED_FALSE_FLAGS,
      required_lead_review_scopes: READINESS_REQUIRED_LEAD_REVIEW_SCOPES,
      core_requirement_checklist: readiness.core_requirement_checklist,
      findings: readiness.findings,
      carried_issues: readiness.carried_issues
    },
    route_use_evidence_summary: {
      route_count: records.length,
      bounded_entry_points: records.map((record) => record.bounded_entry_point),
      lesson_output_root: LESSON_OUTPUT_ROOT,
      inherited_screenshot_count: readiness.screenshot_refresh_decision.inherited_screenshot_count,
      screenshot_refresh_required: readiness.screenshot_refresh_decision.refreshed_screenshots_required,
      screenshot_refresh_reason: readiness.screenshot_refresh_decision.reason
    },
    exit_ticket_equivalence_decision_summary: {
      decision_status: 'candidate_only_ready_for_owner_decision_not_completion_proof',
      all_requirements_visible: records.every((record) =>
        record.exit_ticket_equivalence_decision.target_equivalent_requirements_visible === true
      ),
      all_constructed_response_present: records.every((record) =>
        record.exit_ticket_equivalence_decision.constructed_response_present === true
      ),
      completion_language_authorized: false,
      owner_decision_required_before_any_completion_claim: true
    },
    cp6_scale_gate_decision_matrix: decisionMatrix(),
    teacher_economics_review_requirements: {
      teacher_review_must_confirm: [
        'the four route pages are understandable as teacher/owner review routes, not as default student sequence',
        'short checks are advisory practice feedback only',
        'exit tickets are usable target-equivalent candidates without summative/completion language',
        'direct deep links are not relied on as broad product exposure proof'
      ],
      economics_review_must_confirm: [
        'source reconstruction remains readable and source-first',
        'answer contracts and route prompts remain aligned',
        'Book 6 revenue derivation/output choice keeps OP-C1 and OP-C2, elasticity explanation keeps OP-E1, and OP-D2 stays excluded',
        'no operation, MTU, or answer-skill mutation is implied by this decision bundle'
      ]
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
    rollback_and_scope_control: {
      registry: 'Revert or deactivate the bounded route records in references/data/year2-target-foundation/product-route-adoption-registry.json only through a separately reviewed rollback PR.',
      lesson_navigation: 'Remove bounded-preview entry points from 4veco-lessen index.html only through a separately reviewed rollback PR.',
      route_files: 'Keep reviewed candidate route files as evidence unless a cleanup PR is explicitly authorized.',
      decision_bundle: 'Revert this report packet without changing route, lesson, MTU, operation, answer-skill, diagnostics, mastery, PV, summative, or student-use surfaces.',
      authority: 'All downstream authority remains false until an explicit owner decision names the reviewed payload lineage and decision scope.'
    },
    carried_issues: [
      {
        issue_id: 'owner-authorization-required-before-cp6-or-scale-gate-effect',
        classification: 'scale_blocker',
        blocks: 'CP-6 closure, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, student use, and student/product use',
        does_not_block: 'human review of this decision bundle and merge of this evidence packet if authorized',
        proof_required_to_close: 'explicit owner authorization tied to the reviewed payload lineage and decision scope, with exact-head CI, branch-protection ok:true, lead-review, review-thread, and PR Readiness Reviewer proof as supporting evidence'
      },
      {
        issue_id: 'direct-route-deep-links-not-standalone-product-use-proof',
        classification: 'minor_carry_flag',
        blocks: 'standalone reliance on route deep links as broad product exposure or student/product-use proof',
        does_not_block: 'owner CP-6 / Scale Gate decision review when the bundle is reviewed through the bounded packet',
        proof_required_to_close: 'visible route-level review-only/no-student-product-use boundary or a separately authorized product-exposure decision'
      },
      {
        issue_id: 'static-screenshots-are-not-after-interaction-proof',
        classification: 'minor_carry_flag',
        blocks: 'interactive behavior reliance for Scale Gate, student/product use, or summative completion claims',
        does_not_block: 'review of the bounded routes as decision candidates',
        proof_required_to_close: 'after-interaction proof for short-check and exit-ticket states before any broader authority is sought'
      },
      {
        issue_id: 'protected-mutation-authority-not-requested',
        classification: 'scale_blocker',
        blocks: 'protected MTU mutation, operation registry mutation, answer-skill mutation, and broad OP row closure',
        does_not_block: 'using existing no-mutation proof as evidence for the owner decision',
        proof_required_to_close: 'separate governed mutation PR with exact diffs, validators, lead review, and owner authorization'
      }
    ]
  };
  packet.core_requirement_checklist = coreChecklist(packet);
  packet.findings = findings(packet);
  packet.recommended_next_action =
    'Send this decision bundle to human review after subagent lead review and exact-head PR readiness proof. Expected owner return: Y2 FOUR-TARGET CP6 / SCALE GATE DECISION READY or Y2 FOUR-TARGET CP6 / SCALE GATE DECISION BLOCKED. Do not treat merge of this packet as CP-6 closure, Scale Gate approval, diagnostics/mastery/PV/summative authorization, student use, or student/product use.';
  return packet;
}

function coreChecklist(packet) {
  return {
    product_end_state_and_original_specs_cited: Boolean(packet.product_end_state) &&
      Boolean(packet.original_sprint_gate_spec.product_end_state_baseline) &&
      Boolean(packet.original_sprint_gate_spec.readiness_bundle),
    non_negotiable_requirements_named: packet.non_negotiable_requirements.length >= 8,
    current_main_proof_recorded: Boolean(packet.current_main_evidence.platform_origin_main_sha) &&
      Boolean(packet.current_main_evidence.lesson_origin_main_sha),
    pr193_post_adoption_lineage_present:
      packet.current_main_evidence.platform_bounded_route_adoption_and_post_adoption_proof_is_ancestor === true,
    decision_bundle_does_not_mutate_route_adoption_surfaces:
      packet.current_main_evidence.protected_route_adoption_surfaces_unchanged_by_decision_bundle === true,
    inherited_readiness_core_requirements_met: Object.values(
      packet.inherited_readiness_bundle.core_requirement_checklist
    ).every(Boolean),
    all_four_route_records_included: packet.records.length === 4,
    route_use_evidence_complete: packet.records.every((record) =>
      Object.values(record.route_use_evidence).every(Boolean)
    ),
    source_and_governed_mtu_evidence_complete: packet.records.every((record) =>
      record.source_and_mtu_evidence.source_context_visible_in_route === true &&
      record.source_and_mtu_evidence.official_locators_count > 0 &&
      record.source_and_mtu_evidence.rendered_artifact_count > 0 &&
      record.source_and_mtu_evidence.governed_mtu_proof_cases_complete === true &&
      record.source_and_mtu_evidence.mutation_statuses_review_only === true
    ),
    exit_ticket_equivalence_decision_recorded:
      packet.exit_ticket_equivalence_decision_summary.all_requirements_visible === true &&
      packet.exit_ticket_equivalence_decision_summary.all_constructed_response_present === true &&
      packet.exit_ticket_equivalence_decision_summary.completion_language_authorized === false,
    cp6_scale_gate_decision_matrix_recorded:
      packet.cp6_scale_gate_decision_matrix.length >= 6 &&
      packet.cp6_scale_gate_decision_matrix.every((item) => item.authorized_by_this_packet === false),
    teacher_and_economics_review_requirements_recorded:
      packet.teacher_economics_review_requirements.teacher_review_must_confirm.length > 0 &&
      packet.teacher_economics_review_requirements.economics_review_must_confirm.length > 0,
    rollback_and_scope_control_recorded:
      Boolean(packet.rollback_and_scope_control.registry) &&
      Boolean(packet.rollback_and_scope_control.lesson_navigation) &&
      Boolean(packet.rollback_and_scope_control.authority),
    lead_review_artifact_required_and_named: packet.lead_review_requirements.required === true &&
      packet.lead_review_requirements.evidence_file === LEAD_REVIEW_FILE,
    downstream_authority_flags_false: REQUIRED_FALSE_FLAGS.every((flag) =>
      packet.authority_claims[flag] === false
    )
  };
}

function findings(packet) {
  return [
    {
      finding: 'The owner-facing CP-6 / Scale Gate decision bundle cites the product end-state, original gate specs, readiness packet, current-main proof, and all four route records.',
      classification: 'core_requirement_met',
      blocks: 'none for human review once lead-review and PR-readiness proof are attached',
      does_not_block: 'owner review of the exact decision bundle',
      proof_required_to_close: 'exact current-main evidence, route records, lead-review evidence, exact-head CI, branch-protection ok:true, zero unresolved review threads, and PR Readiness Reviewer output'
    },
    {
      finding: 'Route-use, source reconstruction, governed MTU/task-family proof, and inherited screenshot rationale are carried forward without protected mutations.',
      classification: 'core_requirement_met',
      blocks: 'none for decision-bundle review',
      does_not_block: 'using the proof as evidence for owner CP-6 / Scale Gate deliberation',
      proof_required_to_close: 'retain the readiness packet, no-mutation proof, and false authority flags together'
    },
    {
      finding: 'Exit tickets are recorded as target-equivalent candidates only; completion, summative, mastery, diagnostic, PV, and student/product-use language remains unauthorized.',
      classification: 'core_requirement_met',
      blocks: 'none for candidate decision review',
      does_not_block: 'owner evaluation of the exit-ticket candidate evidence',
      proof_required_to_close: 'separate explicit owner decision before any completion or student-use claim'
    },
    {
      finding: 'CP-6 closure, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, student use, student/product use, protected MTU mutation, operation mutation, answer-skill mutation, and broad OP closure remain blocked.',
      classification: 'scale_blocker',
      blocks: 'all downstream product/student-use and protected mutation authority',
      does_not_block: 'installing and reviewing this decision evidence packet',
      proof_required_to_close: 'explicit owner authorization tied to the reviewed payload lineage and decision scope'
    }
  ];
}

function findingRows(items) {
  return items.map((item) =>
    `| ${item.finding || item.issue_id} | ${item.classification} | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`
  ).join('\n');
}

function matrixRows(items) {
  return items.map((item) =>
    `| ${item.decision} | ${item.status} | ${item.authorized_by_this_packet ? 'yes' : 'no'} | ${item.blocks} | ${item.proof_required_to_close} |`
  ).join('\n');
}

function packetMarkdown(packet) {
  const routeRows = packet.records.map((record) =>
    `| ${record.target_owner_candidate_id} | ${record.paragraph_code} | ${record.route_label} | ${record.route_use_evidence.source_first_route_exists ? 'met' : 'missing'} | ${record.source_and_mtu_evidence.governed_mtu_proof_cases_complete ? 'met' : 'missing'} | ${record.exit_ticket_equivalence_decision.decision_status} |`
  ).join('\n');
  return `# ${SPRINT_ID} Review Packet

Status: CP-6 / Scale Gate decision bundle ready for human review.

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
- ${packet.original_sprint_gate_spec.readiness_bundle}
- ${packet.original_sprint_gate_spec.readiness_review_packet}
- ${packet.original_sprint_gate_spec.lesson_manifest}
- ${packet.original_sprint_gate_spec.route_contracts}

## Non-Negotiable Requirements

${packet.non_negotiable_requirements.map((item) => `- ${item}`).join('\n')}

## Current-Main Proof

Platform origin/main: \`${packet.current_main_evidence.platform_origin_main_sha}\`

Platform checked head: \`${packet.current_main_evidence.platform_checked_head_sha}\`

Lesson origin/main: \`${packet.current_main_evidence.lesson_origin_main_sha}\`

Lesson checked head: \`${packet.current_main_evidence.lesson_checked_head_sha}\`

PR #193/post-adoption proof merge: \`${packet.current_main_evidence.platform_bounded_route_adoption_and_post_adoption_proof_merge_commit}\`

PR #193/post-adoption proof is ancestor: ${packet.current_main_evidence.platform_bounded_route_adoption_and_post_adoption_proof_is_ancestor ? 'yes' : 'no'}

Protected route-adoption surface drift since post-adoption proof: ${packet.current_main_evidence.protected_route_adoption_surface_diff_since_post_adoption.length ? packet.current_main_evidence.protected_route_adoption_surface_diff_since_post_adoption.join(', ') : 'none'}

Decision bundle protected-surface diff against current main: ${packet.current_main_evidence.decision_bundle_protected_surface_diff_against_current_main.length ? packet.current_main_evidence.decision_bundle_protected_surface_diff_against_current_main.join(', ') : 'none'}

## Route-Use Evidence

| Owner paragraph | Paragraph | Route label | Route page | Governed MTU proof | Exit-ticket decision |
|---|---|---|---|---|---|
${routeRows}

Inherited screenshots: ${packet.route_use_evidence_summary.inherited_screenshot_count}

Screenshot refresh required: ${packet.route_use_evidence_summary.screenshot_refresh_required ? 'yes' : 'no'}

Screenshot rationale: ${packet.route_use_evidence_summary.screenshot_refresh_reason}

## Exit-Ticket Equivalence Decision

Decision status: \`${packet.exit_ticket_equivalence_decision_summary.decision_status}\`

All visible candidate requirements present: ${packet.exit_ticket_equivalence_decision_summary.all_requirements_visible ? 'yes' : 'no'}

All constructed-response prompts present: ${packet.exit_ticket_equivalence_decision_summary.all_constructed_response_present ? 'yes' : 'no'}

Completion language authorized: ${packet.exit_ticket_equivalence_decision_summary.completion_language_authorized ? 'yes' : 'no'}

Owner decision required before any completion claim: ${packet.exit_ticket_equivalence_decision_summary.owner_decision_required_before_any_completion_claim ? 'yes' : 'no'}

## CP-6 / Scale Gate Decision Matrix

| Decision | Status | Authorized by this packet | Blocks | Proof required to close |
|---|---|---|---|---|
${matrixRows(packet.cp6_scale_gate_decision_matrix)}

## Teacher/Economics Review Requirements

Teacher review must confirm:
${packet.teacher_economics_review_requirements.teacher_review_must_confirm.map((item) => `- ${item}`).join('\n')}

Economics review must confirm:
${packet.teacher_economics_review_requirements.economics_review_must_confirm.map((item) => `- ${item}`).join('\n')}

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

## Rollback And Scope Control

- ${packet.rollback_and_scope_control.registry}
- ${packet.rollback_and_scope_control.lesson_navigation}
- ${packet.rollback_and_scope_control.route_files}
- ${packet.rollback_and_scope_control.decision_bundle}
- ${packet.rollback_and_scope_control.authority}

## Authority Boundary

This packet prepares an owner decision surface only. It does not authorize CP-6 closure, Scale Gate, diagnostics, mastery, adaptive routing, PV, summative use, broad rollout, student use, student/product use, protected MTU mutation, operation registry mutation, answer-skill mutation, broad OP closure, product-route adoption mutation, default navigation mutation, active curriculum mutation, or autonomous merge expansion.

## False Authority Flags

${REQUIRED_FALSE_FLAGS.map((flag) => `- ${flag}: ${packet.authority_claims[flag]}`).join('\n')}

## Recommended Next Action

${packet.recommended_next_action}
`;
}

function renderedDecision(packet) {
  const cards = packet.records.map((record) => `<article class="card">
    <p class="label">${html(record.target_owner_candidate_id)}</p>
    <h2>${html(record.route_label)}</h2>
    <p>${html(record.bounded_entry_point)}</p>
    <p class="ok">route-use, source, MTU, and exit-ticket candidate evidence recorded</p>
  </article>`).join('\n');
  const matrix = packet.cp6_scale_gate_decision_matrix.map((item) => `<tr>
    <td>${html(item.decision)}</td>
    <td>${html(item.status)}</td>
    <td>${item.authorized_by_this_packet ? 'yes' : 'no'}</td>
  </tr>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${html(SPRINT_ID)}</title>
  <style>
    *{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;background:#f7f8fb;color:#172033;line-height:1.55}
    header{background:#fff;border-bottom:1px solid #d7dde5}.top,main{max-width:1120px;margin:0 auto;padding:24px 20px}
    .eyebrow,.label{font-size:12px;text-transform:uppercase;letter-spacing:0;color:#176b87;font-weight:800}
    h1{font-size:clamp(28px,4vw,42px);line-height:1.1;margin:6px 0 8px}.sub{max-width:920px;color:#5c6675}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.card{background:#fff;border:1px solid #d7dde5;border-radius:8px;padding:16px;margin-bottom:14px}
    .boundary{border-left:4px solid #9a3412}.ok{color:#0f766e;font-weight:800}.mono{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:13px;overflow-wrap:anywhere}
    table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #d7dde5;border-radius:8px;overflow:hidden}td,th{border-bottom:1px solid #e4e8ef;padding:10px;text-align:left}th{background:#eef3f7}
    @media(max-width:820px){.grid{grid-template-columns:1fr}td,th{display:block;width:100%}}
  </style>
</head>
<body>
  <header><div class="top"><p class="eyebrow">CP-6 / Scale Gate decision bundle</p><h1>${html(SPRINT_ID)}</h1><p class="sub">${html(packet.product_end_state)}</p></div></header>
  <main>
    <section class="card boundary"><h2>Authority Boundary</h2><p>This packet prepares an owner decision surface only. CP-6 closure, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, student use, and student/product use remain blocked.</p></section>
    <section class="card"><h2>Current Heads</h2><p class="mono">Platform: ${html(packet.current_main_evidence.platform_origin_main_sha)}</p><p class="mono">Lesson: ${html(packet.current_main_evidence.lesson_origin_main_sha)}</p></section>
    <section class="grid">${cards}</section>
    <section><h2>Decision Matrix</h2><table><thead><tr><th>Decision</th><th>Status</th><th>Authorized</th></tr></thead><tbody>${matrix}</tbody></table></section>
  </main>
</body>
</html>`;
}

function writePlatformArtifacts(options = {}) {
  const packet = decisionBundle(options);
  const packetPath = path.join(REPORT_DIR, 'cp6-scale-gate-decision-bundle.json');
  const packetMdPath = path.join(REPORT_DIR, 'cp6-scale-gate-decision-bundle.md');
  const reviewPath = path.join(REPORT_DIR, 'review-packet.json');
  const reviewMdPath = path.join(REPORT_DIR, 'review-packet.md');
  const renderedPath = path.join(REPORT_DIR, 'rendered-decision-bundle.html');
  writeFile(packetPath, JSON.stringify(packet, null, 2) + '\n');
  writeFile(packetMdPath, packetMarkdown(packet));
  writeFile(reviewPath, JSON.stringify({
    schema_version: 1,
    sprint_id: SPRINT_ID,
    status: packet.status,
    route: packet.route,
    content_verdict_requested:
      'Review the CP-6 / Scale Gate owner-decision bundle only; do not infer CP-6 closure, Scale Gate, diagnostics, mastery, PV, summative, broad rollout, student-use, student/product-use, or protected mutation authority.',
    decision_bundle: relFromPlatform(packetPath),
    rendered_decision_bundle: relFromPlatform(renderedPath),
    inherited_readiness_bundle: packet.original_sprint_gate_spec.readiness_bundle,
    lead_review_evidence: LEAD_REVIEW_FILE,
    authority_claims: AUTHORITY_CLAIMS,
    core_requirement_checklist: packet.core_requirement_checklist,
    carried_issues: packet.carried_issues,
    recommended_next_action: packet.recommended_next_action,
    expected_human_return: [
      'Y2 FOUR-TARGET CP6 / SCALE GATE DECISION READY',
      'Y2 FOUR-TARGET CP6 / SCALE GATE DECISION BLOCKED'
    ]
  }, null, 2) + '\n');
  writeFile(reviewMdPath, packetMarkdown(packet));
  writeFile(renderedPath, renderedDecision(packet));
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
    lead_review_evidence: LEAD_REVIEW_FILE,
    expected_return: 'Y2 FOUR-TARGET CP6 / SCALE GATE DECISION READY'
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
  decisionBundle,
  writePlatformArtifacts
};
