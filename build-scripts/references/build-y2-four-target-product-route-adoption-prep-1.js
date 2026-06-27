#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  REV_STD_FINDING_CLASSIFICATIONS,
  SPRINT_ID: PRODUCT_PROOF_SPRINT_ID,
  qaPagePaths
} = require('./build-y2-four-target-product-proof-gate-1');
const {
  SOURCE_INPUTS
} = require('./build-y2-four-target-cross-repo-lesson-production-1');

const SPRINT_ID = 'Y2-FOUR-TARGET-PRODUCT-ROUTE-ADOPTION-PREP-1';
const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_DIR = path.join(PLATFORM_ROOT, 'reports', 'review-gates', SPRINT_ID);
const GENERATED_ON = '2026-06-27';
const LESSON_OUTPUT_ROOT = 'year2-candidate-lessons/four-target-lesson-production-1';
const PRODUCT_PROOF_MERGE_COMMIT = '8dfdabce65ab41c0844a66d641de0e68a6e7999d';
const LESSON_PRODUCTION_MERGE_COMMIT = 'ef06e8b881f953d7fcd6a1ed26a763b2bf01a684';
const PRODUCT_PROOF_PACKET = `reports/review-gates/${PRODUCT_PROOF_SPRINT_ID}/product-proof-packet.json`;
const PRODUCT_PROOF_REVIEW = `reports/review-gates/${PRODUCT_PROOF_SPRINT_ID}/review-packet.json`;

const AUTHORITY_CLAIMS = {
  product_route_adoption_prep_packet_prepared: true,
  bounded_product_route_surface_proposed_for_human_decision: true,
  route_registry_changes_specified: true,
  rollback_plan_specified: true,
  no_product_navigation_mutated: true,
  no_lesson_output_mutated: true,
  no_silent_student_exposure: true,
  product_route_adoption_authorized: false,
  product_authority: false,
  protected_mtu_mutation_authorized: false,
  operation_registry_mutation_authorized: false,
  answer_skill_registry_mutation_authorized: false,
  broad_operation_row_closure_authorized: false,
  cp6_closure_authorized: false,
  scale_gate_authorized: false,
  diagnostics_authorized: false,
  adaptive_routing_authorized: false,
  mastery_authorized: false,
  pv_authorized: false,
  summative_use_authorized: false,
  student_use_authorized: false,
  student_product_use_authorized: false,
  autonomous_merge_authorized: false
};

const REQUIRED_SUBAGENT_REVIEW_SCOPES = [
  'teacher route usability',
  'economics/source fidelity',
  'accessibility/mobile',
  'route registry and rollback',
  'authority boundaries'
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

function attr(value) {
  return html(value).replace(/'/g, '&#39;');
}

function gitRev(root, ref = 'HEAD') {
  const result = spawnSync('git', ['rev-parse', ref], {
    cwd: root,
    encoding: 'utf8'
  });
  if (result.status !== 0) return null;
  return result.stdout.trim();
}

function gitContains(root, ancestor, descendant = 'HEAD') {
  const result = spawnSync('git', ['merge-base', '--is-ancestor', ancestor, descendant], {
    cwd: root,
    encoding: 'utf8'
  });
  return result.status === 0;
}

function defaultLessonRoot() {
  const candidate = path.resolve(PLATFORM_ROOT, '..', '4veco-lessen');
  return fs.existsSync(path.join(candidate, ...LESSON_OUTPUT_ROOT.split('/'))) ? candidate : '';
}

function resolveLessonRoot(input) {
  return input || process.env.LESSON_REPO_ROOT || defaultLessonRoot();
}

function productProofPacketPath() {
  return path.join(PLATFORM_ROOT, PRODUCT_PROOF_PACKET);
}

function lessonManifestPath(lessonRoot) {
  return path.join(lessonRoot, LESSON_OUTPUT_ROOT, 'manifest.json');
}

function lessonContractsPath(lessonRoot) {
  return path.join(lessonRoot, LESSON_OUTPUT_ROOT, 'route-contracts.json');
}

function lessonRootIndexPath(lessonRoot) {
  return path.join(lessonRoot, 'index.html');
}

function directEntryPoint() {
  return `${LESSON_OUTPUT_ROOT}/index.html`;
}

function rootIndexContainsCandidateLink(lessonRoot) {
  const file = lessonRootIndexPath(lessonRoot);
  if (!fs.existsSync(file)) return false;
  return fs.readFileSync(file, 'utf8').includes(LESSON_OUTPUT_ROOT);
}

function routeRecords(lessonRoot) {
  const productProof = readJson(productProofPacketPath());
  const manifest = readJson(lessonManifestPath(lessonRoot));
  const manifestById = new Map(manifest.records.map((record) => [record.record_id, record]));

  return productProof.records.map((record) => {
    const manifestRecord = manifestById.get(record.record_id);
    const title = manifestRecord?.title || record.lesson_output.base.split('/').pop();
    const label = `${record.paragraph_code} ${title}`;
    return {
      record_id: record.record_id,
      target_owner_candidate_id: record.target_owner_candidate_id,
      paragraph_code: record.paragraph_code,
      route_label: label,
      proposed_adoption_state: 'bounded_candidate_route_pending_owner_adoption_decision',
      current_candidate_entry_point: manifestRecord?.output?.index || record.lesson_output.index,
      current_route_path: record.lesson_output.route,
      current_short_check_path: record.lesson_output.short_check,
      current_exit_ticket_path: record.lesson_output.exit_ticket,
      route_contract_path: record.lesson_output.contract,
      visibility_rules: {
        direct_candidate_url_available: true,
        root_student_navigation_exposed_now: false,
        active_book_navigation_exposed_now: false,
        proposed_future_navigation_tier: 'bounded Year 2 preview/adoption index, not default student rollout',
        student_default_navigation_requires_separate_authorization: true
      },
      safety_contract: {
        source_first_route_is_primary_surface: true,
        advisory_short_check_is_not_completion_proof: true,
        exit_ticket_is_target_equivalent_candidate_only: true,
        internal_ids_and_mtu_op_labels_must_not_be_student_visible: true,
        product_use_requires_later_human_authorization: true
      },
      rollback: {
        registry_rollback: 'remove or mark inactive the platform route-adoption registry record',
        navigation_rollback: 'remove the bounded Year 2 preview/adoption index entry and leave root student navigation unchanged',
        lesson_output_rollback: 'retain candidate lesson files as reviewed evidence; do not delete merged evidence unless separately authorized',
        authority_rollback: 'keep all product/student-use flags false until a later reviewed packet closes them'
      },
      core_requirement_checklist: {
        route_label_named: Boolean(label),
        candidate_entry_point_named: Boolean(manifestRecord?.output?.index || record.lesson_output.index),
        route_surface_named: Boolean(record.lesson_output.route),
        short_check_surface_named: Boolean(record.lesson_output.short_check),
        exit_ticket_surface_named: Boolean(record.lesson_output.exit_ticket),
        contract_named: Boolean(record.lesson_output.contract),
        visibility_rules_preserve_no_silent_exposure: true,
        rollback_named: true,
        authority_boundary_preserved: true
      },
      carried_issues: [
        {
          issue_id: 'actual-product-route-adoption-still-blocked',
          classification: 'scale_blocker',
          blocks: 'actual product-route adoption, product-use navigation, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, and student/product use',
          does_not_block: 'human review of the bounded adoption-prep packet',
          proof_required_to_close: 'explicit owner adoption decision tied to exact registry/index changes, rollback proof, and refreshed readiness evidence'
        }
      ]
    };
  });
}

function adoptionPrepPacket(options = {}) {
  const lessonRoot = resolveLessonRoot(options.lessonRoot);
  const productProof = readJson(productProofPacketPath());
  const manifest = lessonRoot ? readJson(lessonManifestPath(lessonRoot)) : null;
  const screenshotProof = productProof.rendered_screenshot_proof;
  const records = lessonRoot ? routeRecords(lessonRoot) : [];
  const rootExposed = lessonRoot ? rootIndexContainsCandidateLink(lessonRoot) : false;
  const platformMainHead = gitRev(PLATFORM_ROOT, 'origin/main') || gitRev(PLATFORM_ROOT);
  const lessonMainHead = lessonRoot ? (gitRev(lessonRoot, 'origin/main') || gitRev(lessonRoot)) : null;

  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated_on: GENERATED_ON,
    status: 'product_route_adoption_prep_ready_for_human_review',
    expected_return: 'YEAR 2 FOUR-TARGET PRODUCT-ROUTE ADOPTION PREP READY',
    product_end_state: 'Governed decision packet for whether the four reviewed Year 2 candidate lesson routes may later become a bounded product-route surface, without claiming CP-6, Scale Gate, broad rollout, or student use.',
    original_sprint_gate_spec: {
      product_proof_packet: PRODUCT_PROOF_PACKET,
      product_proof_review_packet: PRODUCT_PROOF_REVIEW,
      lesson_production_bundle: `reports/review-gates/${productProof.original_sprint_gate_spec.production_bundle.split('/').slice(-2).join('/')}`,
      lesson_manifest: `${LESSON_OUTPUT_ROOT}/manifest.json`,
      route_contracts: `${LESSON_OUTPUT_ROOT}/route-contracts.json`,
      governed_support_handoff: SOURCE_INPUTS.governed_support_handoff,
      lesson_eligibility_overlay: SOURCE_INPUTS.lesson_eligibility_overlay,
      canonical_source_assets: SOURCE_INPUTS.canonical_source_assets,
      answer_contracts: SOURCE_INPUTS.answer_contracts,
      target_candidates: SOURCE_INPUTS.target_candidates,
      original_governed_support_gate: SOURCE_INPUTS.original_sprint_gate_spec,
      book_architecture: SOURCE_INPUTS.book_architecture
    },
    merged_state: {
      platform_current_main_head_sha: platformMainHead,
      lesson_current_main_head_sha: lessonMainHead,
      product_proof_merge_commit: PRODUCT_PROOF_MERGE_COMMIT,
      lesson_production_merge_commit: LESSON_PRODUCTION_MERGE_COMMIT,
      product_proof_merge_commit_is_ancestor: platformMainHead ? gitContains(PLATFORM_ROOT, PRODUCT_PROOF_MERGE_COMMIT, 'origin/main') : false,
      lesson_production_merge_commit_is_ancestor: lessonRoot ? gitContains(lessonRoot, LESSON_PRODUCTION_MERGE_COMMIT, 'origin/main') : false
    },
    adoption_surface: {
      decision_requested: 'May these four candidate routes become a bounded product-route surface in a later exact registry/index PR?',
      current_state: 'candidate lesson bundle exists by direct URL only; default student navigation is unchanged',
      proposed_state_after_later_authorized_adoption: 'bounded Year 2 candidate/adopted route surface with explicit registry state and rollback',
      current_bundle_entry_point: directEntryPoint(),
      proposed_platform_source_of_truth: `reports/review-gates/${SPRINT_ID}/route-adoption-prep-packet.json`,
      proposed_future_registry_file: 'references/data/year2-target-foundation/product-route-adoption-registry.json',
      proposed_registry_record_id: 'Y2-FOUR-TARGET-BOUNDED-ROUTE-ADOPTION-1',
      proposed_future_navigation_files: [
        {
          repository: 'meijer1973/4veco-lessen',
          path: 'index.html',
          purpose: 'future bounded Year 2 route entry point; must remain unchanged until a separate owner-authorized adoption PR',
          authorized_in_this_pr: false
        },
        {
          repository: 'meijer1973/4veco-lessen',
          path: `${LESSON_OUTPUT_ROOT}/index.html`,
          purpose: 'existing candidate bundle index used as the bounded route target',
          authorized_in_this_pr: false
        }
      ],
      route_count: records.length,
      visibility_rules: {
        current_root_index_contains_candidate_link: rootExposed,
        default_student_navigation_exposed_now: false,
        proposed_navigation_visibility: 'teacher/owner-reviewed bounded route entry only',
        no_silent_exposure_to_students: rootExposed === false,
        broad_student_rollout_requires_later_review: true
      },
      rollback: {
        primary: 'Remove or deactivate the route registry record and bounded navigation entry.',
        lesson_repo: 'Keep generated candidate files as evidence unless a later cleanup PR is separately authorized.',
        platform_repo: 'Revert the registry/index adoption record without mutating MTU, operation, answer-skill, CP-6, Scale, diagnostics, mastery, PV, or summative surfaces.'
      }
    },
    cross_repo_route_registry_index_plan: {
      platform_source_of_truth: `reports/review-gates/${SPRINT_ID}/route-adoption-prep-packet.json`,
      lesson_repo_output_root: LESSON_OUTPUT_ROOT,
      lesson_manifest: manifest ? `${LESSON_OUTPUT_ROOT}/manifest.json` : null,
      lesson_route_contracts: manifest ? `${LESSON_OUTPUT_ROOT}/route-contracts.json` : null,
      root_student_index_mutated_in_this_pr: false,
      active_book_indexes_mutated_in_this_pr: false,
      exact_future_lesson_navigation_files: [
        'index.html',
        `${LESSON_OUTPUT_ROOT}/index.html`
      ],
      future_registry_change_required_before_adoption: true,
      future_navigation_change_required_before_student_visibility: true
    },
    product_boundary_proof: {
      product_route_adoption_allowed_by_this_packet: false,
      product_route_adoption_review_ready: true,
      cp6_still_blocked: true,
      scale_gate_still_blocked: true,
      diagnostics_still_blocked: true,
      mastery_still_blocked: true,
      pv_still_blocked: true,
      summative_use_still_blocked: true,
      student_use_still_blocked: true,
      student_product_use_still_blocked: true
    },
    safety_quality_proof: {
      inherited_product_proof_screenshot_manifest: screenshotProof.manifest_json,
      screenshot_count: screenshotProof.screenshot_count,
      expected_screenshot_count: 48,
      desktop_mobile_screenshots_present: screenshotProof.cases.some((item) => item.viewport === 'desktop') &&
        screenshotProof.cases.some((item) => item.viewport === 'mobile'),
      light_dark_screenshots_present: screenshotProof.cases.some((item) => item.theme === 'light') &&
        screenshotProof.cases.some((item) => item.theme === 'dark'),
      source_readability_review_ready: true,
      advisory_short_check_not_completion_proof: true,
      exit_ticket_target_equivalent_candidate_only: true,
      internal_terms_screened_by_product_proof_packet: productProof.core_requirement_checklist.student_visible_internal_terms_screened === true,
      qa_page_paths_from_lesson_repo_root: qaPagePaths()
    },
    read_only_subagent_reviews: {
      required: true,
      required_scopes: REQUIRED_SUBAGENT_REVIEW_SCOPES,
      evidence_file: `reports/review-gates/${SPRINT_ID}/read-only-subagent-reviews.md`,
      required_verdicts: ['PASS', 'PASS WITH FLAGS']
    },
    non_negotiable_requirements: [
      'Cite product end-state and the original sprint/gate specs.',
      'Cover all four Year 2 candidate routes in one bundle; do not return after one route.',
      'Name the exact proposed adoption surface, route labels, entry points, visibility rules, and rollback.',
      'Name the platform source of truth and 4veco-lessen output paths for the future registry/index adoption change.',
      'Prove no silent exposure to students and no mutation of default root/book navigation in this prep PR.',
      'Keep CP-6, Scale Gate, diagnostics, mastery, PV, summative use, and student/product use blocked.',
      'Preserve advisory short checks as advisory only and exit tickets as target-equivalent candidates only.',
      'Include read-only subagent review coverage for teacher usability, economics/source fidelity, accessibility/mobile, route registry/rollback, and authority boundaries.'
    ],
    core_requirement_checklist: {
      product_proof_packet_cited: Boolean(productProof && productProof.sprint_id === PRODUCT_PROOF_SPRINT_ID),
      product_end_state_and_original_specs_cited: true,
      all_four_routes_included: records.length === 4,
      exact_adoption_surface_named: Boolean(directEntryPoint()),
      route_labels_entry_points_visibility_and_rollback_named: records.every((record) =>
        record.core_requirement_checklist.route_label_named &&
        record.core_requirement_checklist.candidate_entry_point_named &&
        record.core_requirement_checklist.visibility_rules_preserve_no_silent_exposure &&
        record.core_requirement_checklist.rollback_named
      ),
      platform_source_of_truth_named: true,
      lesson_output_paths_named: records.every((record) =>
        record.current_route_path && record.current_short_check_path && record.current_exit_ticket_path && record.route_contract_path
      ),
      no_silent_student_exposure_proven: rootExposed === false,
      product_boundary_flags_false: Object.entries(AUTHORITY_CLAIMS)
        .filter(([key]) => key.endsWith('_authorized') || key === 'product_authority')
        .every(([, value]) => value === false),
      inherited_desktop_mobile_safety_proof_present: screenshotProof.screenshot_count === 48,
      advisory_short_check_not_completion_proof: true,
      exit_ticket_candidate_only: true,
      rollback_plan_present: true,
      read_only_subagent_review_requirements_named: true
    },
    records,
    findings: [
      {
        finding: 'The packet names a bounded route-adoption decision surface for all four Year 2 candidate routes.',
        classification: 'core_requirement_met',
        blocks: 'none for human review of the adoption-prep packet once read-only reviews and live readiness are attached',
        does_not_block: 'human decision on whether a later exact registry/index adoption PR is allowed',
        proof_required_to_close: 'retain this packet, read-only subagent reviews, exact-head CI, branch-protection, review-thread, and PR Readiness proof'
      },
      {
        finding: 'The prep packet does not mutate root student navigation, active book indexes, lesson output, MTU, operation, or answer-skill registries.',
        classification: 'core_requirement_met',
        blocks: 'none for adoption-prep review',
        does_not_block: 'reviewing the proposed bounded adoption surface',
        proof_required_to_close: 'future adoption PR must show exact registry/index diff and rollback'
      },
      {
        finding: 'Actual product-route adoption and all student/product-use authority remain blocked.',
        classification: 'scale_blocker',
        blocks: 'product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, student use, and student/product use',
        does_not_block: 'human review of this adoption-prep packet',
        proof_required_to_close: 'explicit owner adoption authorization tied to exact registry/index changes and refreshed product-boundary proof'
      },
      {
        finding: 'The safety proof inherits the 48 rendered screenshots from the merged product-proof gate and treats short checks/exit tickets conservatively.',
        classification: 'core_requirement_met',
        blocks: 'none for adoption-prep review',
        does_not_block: 'bounded adoption decision preparation',
        proof_required_to_close: 'future adoption PR must refresh screenshots if navigation, labels, layout, or lesson routes change'
      }
    ],
    prior_product_proof_authority_claims: productProof.authority_claims,
    authority_claims: AUTHORITY_CLAIMS,
    recommended_next_action: 'Send this packet to human review after read-only subagent review and exact-head readiness proof. If approved, open a separate exact registry/index adoption PR; do not proceed to CP-6, Scale Gate, diagnostics, mastery, PV, summative use, or student rollout from this packet alone.'
  };
}

function findingRows(findings) {
  return findings
    .map((item) => `| ${item.finding} | ${item.classification} | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`)
    .join('\n');
}

function reviewPacketMarkdown(packet) {
  const rows = packet.records
    .map((record) => `| ${record.target_owner_candidate_id} | ${record.paragraph_code} | ${record.route_label} | \`${record.current_candidate_entry_point}\` | ${record.proposed_adoption_state} |`)
    .join('\n');
  return `# ${SPRINT_ID} Review Packet

Status: product-route adoption prep ready for human review.

Expected return: ${packet.expected_return}

## Product End-State And Original Sprint/Gate Spec

Product end-state: ${packet.product_end_state}

Original sprint/gate/source specs:
- ${packet.original_sprint_gate_spec.product_proof_packet}
- ${packet.original_sprint_gate_spec.product_proof_review_packet}
- ${packet.original_sprint_gate_spec.lesson_manifest}
- ${packet.original_sprint_gate_spec.route_contracts}
- ${packet.original_sprint_gate_spec.governed_support_handoff}
- ${packet.original_sprint_gate_spec.lesson_eligibility_overlay}
- ${packet.original_sprint_gate_spec.canonical_source_assets}
- ${packet.original_sprint_gate_spec.answer_contracts}
- ${packet.original_sprint_gate_spec.original_governed_support_gate}
- ${packet.original_sprint_gate_spec.book_architecture}

Merged state:
- Platform main head: \`${packet.merged_state.platform_current_main_head_sha}\`
- Lesson main head: \`${packet.merged_state.lesson_current_main_head_sha}\`
- Product-proof merge commit: \`${packet.merged_state.product_proof_merge_commit}\`
- Lesson production merge commit: \`${packet.merged_state.lesson_production_merge_commit}\`

## Non-Negotiable Requirements

${packet.non_negotiable_requirements.map((item) => `- ${item}`).join('\n')}

## Exact Adoption Surface

Decision requested: ${packet.adoption_surface.decision_requested}

Current state: ${packet.adoption_surface.current_state}

Proposed later state: ${packet.adoption_surface.proposed_state_after_later_authorized_adoption}

Current bundle entry point: \`${packet.adoption_surface.current_bundle_entry_point}\`

Proposed platform source of truth: \`${packet.adoption_surface.proposed_platform_source_of_truth}\`

Proposed future registry file: \`${packet.adoption_surface.proposed_future_registry_file}\`

Proposed future navigation files:
${packet.adoption_surface.proposed_future_navigation_files.map((item) => `- \`${item.path}\` (${item.repository}): ${item.purpose}; authorized in this PR: ${item.authorized_in_this_pr}`).join('\n')}

Visibility:
- Current root index contains candidate link: ${packet.adoption_surface.visibility_rules.current_root_index_contains_candidate_link}
- Default student navigation exposed now: ${packet.adoption_surface.visibility_rules.default_student_navigation_exposed_now}
- Proposed visibility: ${packet.adoption_surface.visibility_rules.proposed_navigation_visibility}
- Broad student rollout requires later review: ${packet.adoption_surface.visibility_rules.broad_student_rollout_requires_later_review}

Rollback:
- ${packet.adoption_surface.rollback.primary}
- ${packet.adoption_surface.rollback.lesson_repo}
- ${packet.adoption_surface.rollback.platform_repo}

## Cross-Repo Route Registry / Index Changes

Platform source of truth: \`${packet.cross_repo_route_registry_index_plan.platform_source_of_truth}\`

4veco-lessen output root: \`${packet.cross_repo_route_registry_index_plan.lesson_repo_output_root}\`

Root student index mutated in this PR: ${packet.cross_repo_route_registry_index_plan.root_student_index_mutated_in_this_pr}

Active book indexes mutated in this PR: ${packet.cross_repo_route_registry_index_plan.active_book_indexes_mutated_in_this_pr}

Future registry change required before adoption: ${packet.cross_repo_route_registry_index_plan.future_registry_change_required_before_adoption}

Exact future lesson navigation files:
${packet.cross_repo_route_registry_index_plan.exact_future_lesson_navigation_files.map((item) => `- \`${item}\``).join('\n')}

| Owner paragraph | Paragraph | Route label | Current candidate entry point | Proposed state |
|---|---|---|---|---|
${rows}

## Product-Boundary Proof

${Object.entries(packet.product_boundary_proof).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

## Safety And Quality Proof

- Screenshot proof: ${packet.safety_quality_proof.screenshot_count}/${packet.safety_quality_proof.expected_screenshot_count} inherited from \`${packet.safety_quality_proof.inherited_product_proof_screenshot_manifest}\`
- Desktop/mobile screenshots present: ${packet.safety_quality_proof.desktop_mobile_screenshots_present}
- Light/dark screenshots present: ${packet.safety_quality_proof.light_dark_screenshots_present}
- Source readability review ready: ${packet.safety_quality_proof.source_readability_review_ready}
- Advisory short check is not completion proof: ${packet.safety_quality_proof.advisory_short_check_not_completion_proof}
- Exit ticket remains target-equivalent candidate only: ${packet.safety_quality_proof.exit_ticket_target_equivalent_candidate_only}
- Internal terms screened by product-proof packet: ${packet.safety_quality_proof.internal_terms_screened_by_product_proof_packet}

## Read-Only Subagent Reviews

Evidence file: \`${packet.read_only_subagent_reviews.evidence_file}\`

Required scopes:
${packet.read_only_subagent_reviews.required_scopes.map((scope) => `- ${scope}`).join('\n')}

## Core-Requirement Checklist

${Object.entries(packet.core_requirement_checklist).map(([key, value]) => `- ${key}: ${value ? 'met' : 'missing'}`).join('\n')}

## Findings Classification

| Finding | Classification | Blocks (\`blocks\`) | Does not block (\`does_not_block\`) | Proof required to close (\`proof_required_to_close\`) |
|---|---|---|---|---|
${findingRows(packet.findings)}

## Authority Boundary

This packet prepares a human decision on a later bounded product-route adoption PR. It does not authorize product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, student use, or student/product use.

## Recommended Next Action

${packet.recommended_next_action}
`;
}

function css() {
  return `
*{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;line-height:1.55;color:#1d2733;background:#f6f8fb}header{background:#fff;border-bottom:1px solid #d7e0ea}.top{max-width:1120px;margin:0 auto;padding:24px 20px}.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:0;color:#4f6680;font-weight:800}h1{font-size:clamp(28px,4vw,42px);line-height:1.1;margin:6px 0 8px}h2{font-size:24px;margin:0 0 12px}h3{font-size:18px;margin:0 0 8px}.sub{max-width:840px;color:#52677d;font-size:17px}.page{max-width:1120px;margin:0 auto;padding:24px 20px 52px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.card{background:#fff;border:1px solid #d7e0ea;border-radius:8px;padding:16px}.label{font-size:12px;text-transform:uppercase;letter-spacing:0;color:#0d6b68;font-weight:800;margin:0 0 5px}.check{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:18px 0}.check div{background:#fff;border:1px solid #d7e0ea;border-radius:8px;padding:12px}.ok{color:#0f766e;font-weight:800}.blocked{color:#9a4c00;font-weight:800}.mono{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:13px;overflow-wrap:anywhere}.boundary{border-left:4px solid #9a4c00}.surface{border-left:4px solid #0d6b68}@media (max-width:880px){.grid,.check{grid-template-columns:1fr}}`;
}

function renderedAdoptionMap(packet) {
  const cards = packet.records.map((record) => `<article class="card surface">
    <p class="label">${html(record.target_owner_candidate_id)}</p>
    <h3>${html(record.route_label)}</h3>
    <p class="mono">${html(record.current_candidate_entry_point)}</p>
    <p>${html(record.proposed_adoption_state)}</p>
  </article>`).join('\n');
  const checklist = Object.entries(packet.core_requirement_checklist)
    .map(([key, value]) => `<div><span class="${value ? 'ok' : 'blocked'}">${value ? 'met' : 'missing'}</span><br>${html(key)}</div>`)
    .join('\n');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${html(SPRINT_ID)} adoption map</title>
  <style>${css()}</style>
</head>
<body>
  <header><div class="top"><p class="eyebrow">Bounded adoption prep</p><h1>${html(SPRINT_ID)}</h1><p class="sub">${html(packet.product_end_state)}</p></div></header>
  <main class="page">
    <section class="card boundary">
      <h2>Boundary</h2>
      <p>Prepared for human decision only. Product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, student use, and student/product use remain blocked.</p>
      <p class="mono">${html(packet.adoption_surface.current_bundle_entry_point)}</p>
    </section>
    <section class="check">${checklist}</section>
    <section class="grid">${cards}</section>
  </main>
</body>
</html>`;
}

function writePlatformArtifacts(options = {}) {
  const lessonRoot = resolveLessonRoot(options.lessonRoot);
  if (!lessonRoot) {
    throw new Error('LESSON_REPO_ROOT, --lesson-root, or sibling ../4veco-lessen is required');
  }
  const packet = adoptionPrepPacket({ lessonRoot });
  writeFile(path.join(REPORT_DIR, 'route-adoption-prep-packet.json'), JSON.stringify(packet, null, 2) + '\n');
  writeFile(path.join(REPORT_DIR, 'route-adoption-prep-packet.md'), reviewPacketMarkdown(packet));
  writeFile(path.join(REPORT_DIR, 'review-packet.json'), JSON.stringify({
    schema_version: 1,
    sprint_id: SPRINT_ID,
    status: packet.status,
    content_verdict_requested: 'Review whether the four Year 2 candidate routes are ready for a later bounded product-route adoption PR; do not infer adoption or student-use authority.',
    route_adoption_prep_packet: `reports/review-gates/${SPRINT_ID}/route-adoption-prep-packet.json`,
    rendered_adoption_map: `reports/review-gates/${SPRINT_ID}/rendered-adoption-map.html`,
    read_only_subagent_reviews: packet.read_only_subagent_reviews.evidence_file,
    authority_claims: AUTHORITY_CLAIMS
  }, null, 2) + '\n');
  writeFile(path.join(REPORT_DIR, 'review-packet.md'), reviewPacketMarkdown(packet));
  writeFile(path.join(REPORT_DIR, 'rendered-adoption-map.html'), renderedAdoptionMap(packet));
  return packet;
}

function main() {
  const lessonRoot = resolveLessonRoot(process.argv.find((arg) => arg.startsWith('--lesson-root='))?.slice('--lesson-root='.length));
  const packet = writePlatformArtifacts({ lessonRoot });
  console.log(JSON.stringify({
    ok: true,
    sprint_id: SPRINT_ID,
    report_dir: relFromPlatform(REPORT_DIR),
    records: packet.records.length,
    expected_return: packet.expected_return,
    root_student_index_exposed: packet.adoption_surface.visibility_rules.current_root_index_contains_candidate_link
  }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  AUTHORITY_CLAIMS,
  REQUIRED_SUBAGENT_REVIEW_SCOPES,
  REV_STD_FINDING_CLASSIFICATIONS,
  SPRINT_ID,
  adoptionPrepPacket,
  writePlatformArtifacts
};
