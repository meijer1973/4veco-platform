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

const SPRINT_ID = 'Y2-FOUR-TARGET-BOUNDED-ROUTE-POST-ADOPTION-PROOF-AND-SCALE-PRECHECK-1';
const ADOPTION_SPRINT_ID = 'Y2-FOUR-TARGET-BOUNDED-ROUTE-ADOPTION-1';
const PRODUCT_PROOF_SPRINT_ID = 'Y2-FOUR-TARGET-PRODUCT-PROOF-GATE-1';
const ADOPTION_PREP_SPRINT_ID = 'Y2-FOUR-TARGET-PRODUCT-ROUTE-ADOPTION-PREP-1';
const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_DIR = path.join(PLATFORM_ROOT, 'reports', 'review-gates', SPRINT_ID);
const GENERATED_ON = '2026-06-30';
const PLATFORM_ADOPTION_MERGE_COMMIT = '3e31e3582faf9df794e6d13865efdd5e20367366';
const LESSON_ADOPTION_MERGE_COMMIT = 'aefab74fb4d609e42140723b3e01db61e1f3644e';

const AUTHORITY_CLAIMS = {
  post_adoption_proof_packet_prepared: true,
  bounded_product_route_preview_authorized: true,
  bounded_product_route_preview_live: true,
  product_route_adoption_registry_record_live: true,
  scale_gate_precheck_prepared: true,
  scale_gate_review_authorized: false,
  scale_gate_authorized: false,
  cp6_closure_authorized: false,
  diagnostics_authorized: false,
  adaptive_routing_authorized: false,
  mastery_authorized: false,
  pv_authorized: false,
  summative_use_authorized: false,
  broad_student_rollout_authorized: false,
  default_book_navigation_mutated: false,
  active_curriculum_sequence_mutated: false,
  broad_product_route_rollout_authorized: false,
  student_use_authorized: false,
  student_product_use_authorized: false,
  protected_mtu_mutation_authorized: false,
  operation_registry_mutation_authorized: false,
  answer_skill_registry_mutation_authorized: false,
  broad_operation_row_closure_authorized: false,
  autonomous_merge_authorized: false
};

const REQUIRED_FALSE_FLAGS = [
  'scale_gate_review_authorized',
  'scale_gate_authorized',
  'cp6_closure_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'pv_authorized',
  'summative_use_authorized',
  'broad_student_rollout_authorized',
  'default_book_navigation_mutated',
  'active_curriculum_sequence_mutated',
  'broad_product_route_rollout_authorized',
  'student_use_authorized',
  'student_product_use_authorized',
  'protected_mtu_mutation_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_registry_mutation_authorized',
  'broad_operation_row_closure_authorized',
  'autonomous_merge_authorized'
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

function productProofPath() {
  return path.join(PLATFORM_ROOT, 'reports', 'review-gates', PRODUCT_PROOF_SPRINT_ID, 'product-proof-packet.json');
}

function adoptionPrepPath() {
  return path.join(PLATFORM_ROOT, 'reports', 'review-gates', ADOPTION_PREP_SPRINT_ID, 'route-adoption-prep-packet.json');
}

function adoptionReviewPath() {
  return path.join(PLATFORM_ROOT, 'reports', 'review-gates', ADOPTION_SPRINT_ID, 'review-packet.json');
}

function registryPath() {
  return path.join(PLATFORM_ROOT, REGISTRY_FILE);
}

function fileEvidence(root, relPath) {
  const abs = path.join(root, relPath);
  return {
    path: relPath,
    exists: fs.existsSync(abs),
    bytes: fs.existsSync(abs) ? fs.statSync(abs).size : 0
  };
}

function lessonIndexEvidence(lessonRoot) {
  const rootIndex = fileEvidence(lessonRoot, 'index.html');
  const bundleIndex = fileEvidence(lessonRoot, `${LESSON_OUTPUT_ROOT}/index.html`);
  const rootText = rootIndex.exists ? readText(path.join(lessonRoot, rootIndex.path)) : '';
  const bundleText = bundleIndex.exists ? readText(path.join(lessonRoot, bundleIndex.path)) : '';
  return {
    root_index: {
      ...rootIndex,
      bounded_entry_link_present: rootText.includes(`href="${LESSON_OUTPUT_ROOT}/index.html"`),
      adoption_marker_present: rootText.includes('data-route-adoption-id="Y2-FOUR-TARGET-BOUNDED-ROUTE-ADOPTION-1"'),
      broad_student_rollout_copy_absent: !/broad student rollout|student-productgebruik vrijgegeven/i.test(rootText),
      boundary_copy_present: rootText.includes('geen CP-6, Scale Gate, diagnostiek of summatieve status')
    },
    bundle_index: {
      ...bundleIndex,
      bounded_state_marker_present: bundleText.includes('data-adoption-state="bounded-route-adopted"'),
      bounded_heading_present: bundleText.includes('Bounded Year 2 routepreview'),
      advisory_boundary_copy_present: bundleText.includes('Advisory short checks blijven oefenfeedback'),
      downstream_boundary_copy_present: bundleText.includes('geen CP-6, Scale Gate, diagnostiek, mastery, PV, summatieve inzet of student-productgebruik')
    }
  };
}

function productRecord(productProof, recordId) {
  return (productProof.records || []).find((record) => record.record_id === recordId) || null;
}

function routeContractEvidence(lessonRoot, relPath) {
  const evidence = fileEvidence(lessonRoot, relPath);
  const contract = evidence.exists ? readJson(path.join(lessonRoot, relPath)) : {};
  return {
    ...evidence,
    authority_boundary: contract.authority_boundary || null,
    generated_candidate_boundary_retained:
      contract.authority_boundary === 'generated_candidate_lesson_output_for_review_only_no_product_route_adoption_no_student_product_use',
    required_surfaces: Array.isArray(contract.required_surfaces) ? contract.required_surfaces : []
  };
}

function routeRecord(registryRecord, productProof, lessonRoot) {
  const product = productRecord(productProof, registryRecord.route_id);
  const surfaces = {
    route: fileEvidence(lessonRoot, registryRecord.surfaces.route),
    advisory_short_check: fileEvidence(lessonRoot, registryRecord.surfaces.advisory_short_check),
    target_equivalent_exit_ticket_candidate: fileEvidence(
      lessonRoot,
      registryRecord.surfaces.target_equivalent_exit_ticket_candidate
    )
  };
  const contract = routeContractEvidence(lessonRoot, registryRecord.surfaces.route_contract);
  const screenshotCount = product && product.screenshot_evidence ? product.screenshot_evidence.count : 0;
  const core = {
    registry_record_adopted: registryRecord.adoption_state === 'bounded_product_route_adopted_after_owner_merge',
    bounded_entry_point_exists: fileEvidence(lessonRoot, registryRecord.bounded_entry_point).exists,
    source_first_route_exists: surfaces.route.exists,
    advisory_short_check_exists: surfaces.advisory_short_check.exists,
    exit_ticket_candidate_exists: surfaces.target_equivalent_exit_ticket_candidate.exists,
    route_contract_present: contract.exists,
    route_contract_boundary_retained: contract.generated_candidate_boundary_retained,
    inherited_product_proof_screenshots_complete: screenshotCount === 12,
    advisory_short_check_still_not_completion_proof:
      registryRecord.safety_contract.advisory_short_check_is_not_completion_proof === true,
    exit_ticket_still_candidate_only:
      registryRecord.safety_contract.exit_ticket_is_target_equivalent_candidate_only === true,
    downstream_authority_blocked:
      registryRecord.safety_contract.diagnostics_mastery_pv_summative_student_use_blocked === true
  };
  return {
    route_id: registryRecord.route_id,
    target_owner_candidate_id: registryRecord.target_owner_candidate_id,
    paragraph_code: registryRecord.paragraph_code,
    route_label: registryRecord.route_label,
    adoption_state: registryRecord.adoption_state,
    bounded_entry_point: registryRecord.bounded_entry_point,
    surfaces,
    route_contract: contract,
    inherited_product_proof: {
      product_proof_record_present: Boolean(product),
      screenshot_count: screenshotCount,
      screenshot_expected_count: 12,
      screenshot_files: product && product.screenshot_evidence ? product.screenshot_evidence.files : []
    },
    core_requirement_checklist: core,
    carried_issues: [
      {
        issue_id: 'scale-gate-and-student-use-still-blocked',
        classification: 'scale_blocker',
        blocks: 'CP-6, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, student use, and student/product use',
        does_not_block: 'post-adoption proof that the bounded route preview is live and rollbackable',
        proof_required_to_close: 'separate owner-authorized Scale Gate / student-use packet with refreshed route-use evidence and explicit downstream authority'
      }
    ]
  };
}

function scaleGatePrecheck(records) {
  return {
    status: 'not_ready_for_scale_gate_authority',
    result: 'PRECHECK_ONLY_BLOCKED_FOR_SCALE_GATE',
    ready_inputs: {
      bounded_route_preview_live: true,
      all_four_routes_adopted: records.length === 4,
      route_surfaces_exist: records.every((record) =>
        record.core_requirement_checklist.source_first_route_exists &&
        record.core_requirement_checklist.advisory_short_check_exists &&
        record.core_requirement_checklist.exit_ticket_candidate_exists
      ),
      inherited_rendered_product_proof_complete: records.every((record) =>
        record.core_requirement_checklist.inherited_product_proof_screenshots_complete
      ),
      rollback_plan_inherited_from_adoption_registry: true
    },
    blockers: [
      {
        issue_id: 'scale-gate-owner-review-not-opened',
        classification: 'scale_blocker',
        blocks: 'Scale Gate 1, CP-6 closure, broad rollout, and student/product use',
        does_not_block: 'bounded route-preview operation under the already-authorized adoption boundary',
        proof_required_to_close: 'a separate exact-head Scale Gate packet with owner authorization and route-specific product-use evidence'
      },
      {
        issue_id: 'diagnostics-mastery-pv-summative-authority-still-false',
        classification: 'scale_blocker',
        blocks: 'diagnostics, mastery/sequencing, PV, summative use, and student-facing product decisions',
        does_not_block: 'teacher/owner review of the bounded route preview surface',
        proof_required_to_close: 'separate downstream evidence and human decision explicitly enabling each authority'
      },
      {
        issue_id: 'exit-ticket-candidate-not-summative-closure',
        classification: 'scale_blocker',
        blocks: 'target-equivalent completion language, summative status, and Scale Gate reliance on exit tickets alone',
        does_not_block: 'maintaining exit tickets as candidate evidence inside the bounded preview',
        proof_required_to_close: 'renewed human review proving target-equivalent closure and allowed completion language'
      }
    ],
    next_gate_action:
      'Prepare a separate human-review packet before any CP-6, Scale Gate, diagnostics, mastery, PV, summative, broad rollout, student-use, or student/product-use decision.'
  };
}

function coreChecklist(packet) {
  return {
    product_end_state_and_original_specs_cited: true,
    bounded_adoption_registry_cited: true,
    product_proof_packet_cited: true,
    adoption_prep_packet_cited: true,
    platform_adoption_merge_commit_is_ancestor: packet.merged_state.platform_adoption_merge_commit_is_ancestor === true,
    lesson_adoption_merge_commit_is_ancestor: packet.merged_state.lesson_adoption_merge_commit_is_ancestor === true,
    all_four_routes_present: packet.records.length === 4,
    all_bounded_entry_points_exist: packet.records.every((record) => record.core_requirement_checklist.bounded_entry_point_exists),
    all_required_route_surfaces_exist: packet.records.every((record) =>
      record.core_requirement_checklist.source_first_route_exists &&
      record.core_requirement_checklist.advisory_short_check_exists &&
      record.core_requirement_checklist.exit_ticket_candidate_exists
    ),
    all_route_contract_boundaries_retained: packet.records.every((record) => record.core_requirement_checklist.route_contract_boundary_retained),
    inherited_product_proof_screenshots_complete: packet.records.every((record) => record.core_requirement_checklist.inherited_product_proof_screenshots_complete),
    lesson_root_index_bounded_marker_present:
      packet.lesson_index_evidence.root_index.bounded_entry_link_present &&
      packet.lesson_index_evidence.root_index.adoption_marker_present,
    lesson_bundle_index_bounded_marker_present:
      packet.lesson_index_evidence.bundle_index.bounded_state_marker_present &&
      packet.lesson_index_evidence.bundle_index.bounded_heading_present,
    scale_gate_precheck_blocks_downstream_authority: packet.scale_gate_precheck.blockers.length >= 3,
    downstream_authority_flags_false: REQUIRED_FALSE_FLAGS.every((flag) => packet.authority_claims[flag] === false)
  };
}

function findings() {
  return [
    {
      finding: 'The bounded Year 2 route preview is live after the authorized lesson-first/platform-second adoption bundle merge.',
      classification: 'core_requirement_met',
      blocks: 'none for maintaining the bounded preview',
      does_not_block: 'post-adoption proof review',
      proof_required_to_close: 'current-main merge ancestry, registry/index markers, and route-surface existence checks'
    },
    {
      finding: 'The inherited rendered product proof remains complete for all four routes and all three surfaces per route.',
      classification: 'core_requirement_met',
      blocks: 'none for post-adoption proof',
      does_not_block: 'bounded route-preview operation',
      proof_required_to_close: 'existing 48-screenshot product proof plus live route-contract and surface checks'
    },
    {
      finding: 'Scale Gate, CP-6, diagnostics, mastery, PV, summative use, broad rollout, and student/product use remain blocked.',
      classification: 'scale_blocker',
      blocks: 'Scale Gate 1, CP-6 closure, diagnostics, mastery, PV, summative use, broad rollout, student use, and student/product use',
      does_not_block: 'bounded Year 2 route preview and post-adoption evidence review',
      proof_required_to_close: 'separate exact-head human review packet that explicitly grants the relevant downstream authority'
    }
  ];
}

function postAdoptionPacket(options = {}) {
  const lessonRoot = resolveLessonRoot(options.lessonRoot);
  if (!lessonRoot) throw new Error('LESSON_REPO_ROOT, --lesson-root, or sibling ../4veco-lessen is required');
  const registry = readJson(registryPath());
  const productProof = readJson(productProofPath());
  const adoptionPrep = readJson(adoptionPrepPath());
  const adoptionReview = readJson(adoptionReviewPath());
  const platformHead = gitRev(PLATFORM_ROOT, 'origin/main') || gitRev(PLATFORM_ROOT);
  const lessonHead = gitRev(lessonRoot, 'origin/main') || gitRev(lessonRoot);
  const records = registry.records.map((record) => routeRecord(record, productProof, lessonRoot));
  const packet = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated_on: GENERATED_ON,
    status: 'post_adoption_proof_and_scale_precheck_ready_for_human_review',
    product_end_state:
      'Prove the authorized bounded Year 2 route preview is live after merge and prepare a Scale Gate precheck while keeping CP-6, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, and student/product use blocked.',
    original_sprint_gate_spec: {
      product_end_state_baseline: '4veco-lessen/specifications/product-end-state.md',
      companion_core_specification: '4veco-lessen/specifications/companion-core-specifications.md',
      bounded_adoption_registry: REGISTRY_FILE,
      bounded_adoption_packet: `reports/review-gates/${ADOPTION_SPRINT_ID}/bounded-route-adoption-packet.json`,
      bounded_adoption_review_packet: `reports/review-gates/${ADOPTION_SPRINT_ID}/review-packet.json`,
      product_proof_packet: `reports/review-gates/${PRODUCT_PROOF_SPRINT_ID}/product-proof-packet.json`,
      product_proof_review_packet: `reports/review-gates/${PRODUCT_PROOF_SPRINT_ID}/review-packet.json`,
      adoption_prep_packet: `reports/review-gates/${ADOPTION_PREP_SPRINT_ID}/route-adoption-prep-packet.json`,
      lesson_manifest: registry.original_sprint_gate_spec.lesson_manifest,
      route_contracts: registry.original_sprint_gate_spec.route_contracts
    },
    merged_state: {
      platform_current_main_head_sha: platformHead,
      lesson_current_main_head_sha: lessonHead,
      platform_adoption_merge_commit: PLATFORM_ADOPTION_MERGE_COMMIT,
      lesson_adoption_merge_commit: LESSON_ADOPTION_MERGE_COMMIT,
      platform_adoption_merge_commit_is_ancestor: gitContains(PLATFORM_ROOT, PLATFORM_ADOPTION_MERGE_COMMIT, 'origin/main'),
      lesson_adoption_merge_commit_is_ancestor: gitContains(lessonRoot, LESSON_ADOPTION_MERGE_COMMIT, 'origin/main')
    },
    adopted_surface: {
      registry_id: registry.registry_id,
      registry_status: registry.status,
      adoption_review_status: adoptionReview.status,
      adoption_prep_status: adoptionPrep.status,
      route_count: registry.records.length,
      navigation_tier: registry.adoption_surface.navigation_tier,
      lesson_output_root: LESSON_OUTPUT_ROOT,
      bounded_root_link_href: registry.adoption_surface.root_link_href,
      default_book_navigation_mutated: false,
      active_curriculum_sequence_mutated: false
    },
    inherited_product_proof: {
      sprint_id: productProof.sprint_id,
      status: productProof.status,
      screenshot_manifest: productProof.rendered_screenshot_proof.manifest_json,
      screenshot_count: productProof.rendered_screenshot_proof.screenshot_count,
      expected_screenshot_count: productProof.rendered_screenshot_proof.expected_count,
      qa_page_paths_from_lesson_repo_root: productProof.rendered_screenshot_proof.qa_page_paths_from_lesson_repo_root
    },
    lesson_index_evidence: lessonIndexEvidence(lessonRoot),
    records,
    scale_gate_precheck: scaleGatePrecheck(records),
    authority_claims: AUTHORITY_CLAIMS
  };
  packet.core_requirement_checklist = coreChecklist(packet);
  packet.findings = findings();
  packet.recommended_next_action =
    'Send this post-adoption proof/precheck packet to human review. Do not proceed to CP-6, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, student use, or student/product use without a separate owner authorization.';
  return packet;
}

function findingRows(items) {
  return items.map((item) =>
    `| ${item.finding} | ${item.classification} | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`
  ).join('\n');
}

function packetMarkdown(packet) {
  const routeRows = packet.records.map((record) =>
    `| ${record.target_owner_candidate_id} | ${record.paragraph_code} | ${record.route_label} | ${record.adoption_state} | ${record.inherited_product_proof.screenshot_count}/${record.inherited_product_proof.screenshot_expected_count} |`
  ).join('\n');
  const blockerRows = packet.scale_gate_precheck.blockers.map((item) =>
    `| ${item.issue_id} | ${item.classification} | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`
  ).join('\n');
  return `# ${SPRINT_ID} Review Packet

Status: post-adoption proof and Scale Gate precheck ready for human review.

## Product End-State And Original Sprint/Gate Spec

Product end-state: ${packet.product_end_state}

Product end-state baseline citation:
- ${packet.original_sprint_gate_spec.product_end_state_baseline}

Original sprint/gate/source specs:
- ${packet.original_sprint_gate_spec.bounded_adoption_registry}
- ${packet.original_sprint_gate_spec.bounded_adoption_packet}
- ${packet.original_sprint_gate_spec.bounded_adoption_review_packet}
- ${packet.original_sprint_gate_spec.product_proof_packet}
- ${packet.original_sprint_gate_spec.product_proof_review_packet}
- ${packet.original_sprint_gate_spec.adoption_prep_packet}
- ${packet.original_sprint_gate_spec.lesson_manifest}
- ${packet.original_sprint_gate_spec.route_contracts}
- ${packet.original_sprint_gate_spec.companion_core_specification}

## Non-Negotiable Requirements

- Verify the already-merged bounded route preview; do not mutate lesson output in this lane.
- Tie proof to current platform and lesson main heads and the two adoption merge commits.
- Confirm all four routes, route contracts, and inherited rendered product proof remain present.
- Preserve advisory short checks as practice feedback only and exit tickets as target-equivalent candidates only.
- Keep CP-6, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, student use, and student/product use blocked.
- Include REV-STD-1 findings with blocks, does_not_block, and proof_required_to_close.

## Post-Adoption Proof Surface

Platform main: \`${packet.merged_state.platform_current_main_head_sha}\`

Lesson main: \`${packet.merged_state.lesson_current_main_head_sha}\`

Platform adoption merge commit: \`${packet.merged_state.platform_adoption_merge_commit}\`

Lesson adoption merge commit: \`${packet.merged_state.lesson_adoption_merge_commit}\`

Registry: \`${packet.original_sprint_gate_spec.bounded_adoption_registry}\`

Lesson bounded root link: \`${packet.adopted_surface.bounded_root_link_href}\`

Inherited screenshot proof: ${packet.inherited_product_proof.screenshot_count}/${packet.inherited_product_proof.expected_screenshot_count}

| Owner paragraph | Paragraph | Route label | Adoption state | Screenshots |
|---|---|---|---|---|
${routeRows}

## Scale Gate Precheck

Precheck result: \`${packet.scale_gate_precheck.result}\`

Next gate action: ${packet.scale_gate_precheck.next_gate_action}

| Issue | Classification | Blocks (\`blocks\`) | Does not block (\`does_not_block\`) | Proof required to close (\`proof_required_to_close\`) |
|---|---|---|---|---|
${blockerRows}

## Core-Requirement Checklist

${Object.entries(packet.core_requirement_checklist).map(([key, value]) => `- ${key}: ${value ? 'met' : 'missing'}`).join('\n')}

## Findings Classification

| Finding | Classification | Blocks (\`blocks\`) | Does not block (\`does_not_block\`) | Proof required to close (\`proof_required_to_close\`) |
|---|---|---|---|---|
${findingRows(packet.findings)}

## Authority Boundary

This packet proves the bounded route preview after merge and prepares a precheck only. It does not authorize CP-6, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, student use, student/product use, protected MTU mutation, operation registry mutation, answer-skill mutation, broad operation closure, or autonomous merge expansion.

## Recommended Next Action

${packet.recommended_next_action}
`;
}

function renderedPrecheck(packet) {
  const cards = packet.records.map((record) => `<article class="card">
    <p class="label">${html(record.target_owner_candidate_id)}</p>
    <h2>${html(record.route_label)}</h2>
    <p>${html(record.adoption_state)}</p>
    <p class="mono">${html(record.bounded_entry_point)}</p>
    <p class="ok">${record.inherited_product_proof.screenshot_count}/${record.inherited_product_proof.screenshot_expected_count} screenshots inherited</p>
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
  <header><div class="top"><p class="eyebrow">Post-adoption proof / Scale Gate precheck</p><h1>${html(SPRINT_ID)}</h1><p class="sub">${html(packet.product_end_state)}</p></div></header>
  <main>
    <section class="card boundary"><h2>Authority Boundary</h2><p>Scale Gate, CP-6, diagnostics, mastery, PV, summative use, broad rollout, student use, and student/product use remain blocked. This is a precheck only.</p></section>
    <section class="card"><h2>Current Heads</h2><p class="mono">Platform: ${html(packet.merged_state.platform_current_main_head_sha)}</p><p class="mono">Lesson: ${html(packet.merged_state.lesson_current_main_head_sha)}</p></section>
    <section class="grid">${cards}</section>
  </main>
</body>
</html>`;
}

function writePlatformArtifacts(options = {}) {
  const packet = postAdoptionPacket(options);
  const packetPath = path.join(REPORT_DIR, 'post-adoption-proof-and-scale-precheck.json');
  const packetMdPath = path.join(REPORT_DIR, 'post-adoption-proof-and-scale-precheck.md');
  const reviewPath = path.join(REPORT_DIR, 'review-packet.json');
  const reviewMdPath = path.join(REPORT_DIR, 'review-packet.md');
  const renderedPath = path.join(REPORT_DIR, 'rendered-scale-precheck.html');
  writeFile(packetPath, JSON.stringify(packet, null, 2) + '\n');
  writeFile(packetMdPath, packetMarkdown(packet));
  writeFile(reviewPath, JSON.stringify({
    schema_version: 1,
    sprint_id: SPRINT_ID,
    status: packet.status,
    content_verdict_requested:
      'Review the post-adoption proof and Scale Gate precheck only; do not infer CP-6, Scale Gate, diagnostics, mastery, PV, summative, broad rollout, student-use, or student/product-use authority.',
    post_adoption_proof_packet: relFromPlatform(packetPath),
    rendered_scale_precheck: relFromPlatform(renderedPath),
    adoption_registry: REGISTRY_FILE,
    authority_claims: AUTHORITY_CLAIMS,
    scale_gate_precheck: {
      status: packet.scale_gate_precheck.status,
      result: packet.scale_gate_precheck.result,
      blockers: packet.scale_gate_precheck.blockers
    },
    recommended_next_action: packet.recommended_next_action
  }, null, 2) + '\n');
  writeFile(reviewMdPath, packetMarkdown(packet));
  writeFile(renderedPath, renderedPrecheck(packet));
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
    scale_gate_precheck: packet.scale_gate_precheck.result
  }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  AUTHORITY_CLAIMS,
  REQUIRED_FALSE_FLAGS,
  REV_STD_FINDING_CLASSIFICATIONS,
  SPRINT_ID,
  PLATFORM_ADOPTION_MERGE_COMMIT,
  LESSON_ADOPTION_MERGE_COMMIT,
  postAdoptionPacket,
  writePlatformArtifacts
};
