#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  REV_STD_FINDING_CLASSIFICATIONS
} = require('./build-y2-four-target-product-proof-gate-1');

const SPRINT_ID = 'Y2-FOUR-TARGET-BOUNDED-ROUTE-ADOPTION-1';
const PREP_SPRINT_ID = 'Y2-FOUR-TARGET-PRODUCT-ROUTE-ADOPTION-PREP-1';
const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_DIR = path.join(PLATFORM_ROOT, 'reports', 'review-gates', SPRINT_ID);
const PREP_PACKET = `reports/review-gates/${PREP_SPRINT_ID}/route-adoption-prep-packet.json`;
const REGISTRY_FILE = 'references/data/year2-target-foundation/product-route-adoption-registry.json';
const LESSON_OUTPUT_ROOT = 'year2-candidate-lessons/four-target-lesson-production-1';
const PRODUCT_END_STATE_SPEC = '4veco-lessen/specifications/product-end-state.md';
const COMPANION_CORE_SPEC = '4veco-lessen/specifications/companion-core-specifications.md';
const GENERATED_ON = '2026-06-29';
const RECORD_ID = SPRINT_ID;

const AUTHORITY_CLAIMS = {
  bounded_route_adoption_bundle_prepared: true,
  product_route_adoption_registry_record_created: true,
  lesson_root_bounded_entry_created: true,
  lesson_bundle_index_adoption_state_updated: true,
  all_four_routes_adopted_as_bounded_surface_after_owner_merge: true,
  product_route_adoption_authorized_before_owner_merge: false,
  product_route_adoption_authorized_on_owner_merge: true,
  product_authority_change_requires_human_review: true,
  default_book_navigation_mutated: false,
  active_curriculum_sequence_mutated: false,
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
  broad_student_rollout_authorized: false,
  student_use_authorized: false,
  student_product_use_authorized: false,
  autonomous_merge_authorized: false
};

const REQUIRED_FALSE_FLAGS = [
  'product_route_adoption_authorized_before_owner_merge',
  'default_book_navigation_mutated',
  'active_curriculum_sequence_mutated',
  'protected_mtu_mutation_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_registry_mutation_authorized',
  'broad_operation_row_closure_authorized',
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

function defaultLessonRoot() {
  const candidate = path.resolve(PLATFORM_ROOT, '..', '4veco-lessen');
  return fs.existsSync(path.join(candidate, ...LESSON_OUTPUT_ROOT.split('/'))) ? candidate : '';
}

function resolveLessonRoot(input) {
  return input || process.env.LESSON_REPO_ROOT || defaultLessonRoot();
}

function prepPacketPath() {
  return path.join(PLATFORM_ROOT, PREP_PACKET);
}

function lessonManifestPath(lessonRoot) {
  return path.join(lessonRoot, LESSON_OUTPUT_ROOT, 'manifest.json');
}

function routeRecords(prep) {
  return prep.records.map((record) => ({
    route_id: record.record_id,
    target_owner_candidate_id: record.target_owner_candidate_id,
    paragraph_code: record.paragraph_code,
    route_label: record.route_label,
    adoption_state: 'bounded_product_route_adopted_after_owner_merge',
    bounded_entry_point: record.current_candidate_entry_point,
    surfaces: {
      route: record.current_route_path,
      advisory_short_check: record.current_short_check_path,
      target_equivalent_exit_ticket_candidate: record.current_exit_ticket_path,
      route_contract: record.route_contract_path
    },
    visibility: {
      root_year2_bounded_entry: true,
      default_book_navigation: false,
      active_curriculum_sequence: false,
      broad_student_rollout: false,
      visible_label: record.route_label
    },
    safety_contract: {
      source_first_route_is_primary_surface: true,
      advisory_short_check_is_not_completion_proof: true,
      exit_ticket_is_target_equivalent_candidate_only: true,
      generated_candidate_contract_retained_as_lineage: true,
      diagnostics_mastery_pv_summative_student_use_blocked: true
    },
    rollback: {
      registry: `remove route ${record.record_id} from ${REGISTRY_FILE} or set adoption_state to rollback_inactive`,
      lesson_root_index: `remove the ${LESSON_OUTPUT_ROOT}/index.html link from 4veco-lessen index.html`,
      lesson_bundle_index: 'restore candidate-only bundle heading and status text',
      downstream_authority: 'no MTU, operation, answer-skill, CP-6, Scale Gate, diagnostics, mastery, PV, summative, student-use, or student-product-use closure is implied'
    },
    carried_issues: [
      {
        issue_id: 'downstream-scale-and-student-use-still-blocked',
        classification: 'scale_blocker',
        blocks: 'CP-6, Scale Gate, diagnostics, mastery, PV, summative use, broad student rollout, and student/product use',
        does_not_block: 'bounded route adoption as an owner-reviewed Year 2 route preview surface',
        proof_required_to_close: 'separate exact-head human review with route-specific product-use evidence, refreshed screenshots, and downstream authority packet'
      }
    ]
  }));
}

function coreChecklist(registry) {
  return {
    product_end_state_and_original_specs_cited: true,
    adoption_prep_packet_cited: true,
    all_four_routes_included: registry.records.length === 4,
    platform_registry_record_created: true,
    lesson_root_index_entry_required: true,
    lesson_bundle_index_state_required: true,
    no_default_book_navigation_mutation: true,
    rollback_plan_present: registry.records.every((record) => record.rollback.registry && record.rollback.lesson_root_index),
    advisory_short_checks_remain_advisory: registry.records.every((record) => record.safety_contract.advisory_short_check_is_not_completion_proof),
    exit_tickets_remain_candidate_only: registry.records.every((record) => record.safety_contract.exit_ticket_is_target_equivalent_candidate_only),
    downstream_authority_flags_blocked: REQUIRED_FALSE_FLAGS.every((flag) => registry.authority_claims[flag] === false)
  };
}

function adoptionRegistry(options = {}) {
  const lessonRoot = resolveLessonRoot(options.lessonRoot);
  if (!lessonRoot) throw new Error('LESSON_REPO_ROOT, --lesson-root, or sibling ../4veco-lessen is required');
  const prep = readJson(prepPacketPath());
  const manifest = readJson(lessonManifestPath(lessonRoot));
  const records = routeRecords(prep);
  const registry = {
    schema_version: 1,
    registry_id: 'year2-target-foundation-product-route-adoption-registry',
    sprint_id: SPRINT_ID,
    generated_on: GENERATED_ON,
    status: 'bounded_product_route_adoption_ready_for_human_review',
    product_end_state: 'Adopt the four reviewed Year 2 candidate lesson routes as a bounded, teacher/owner-reviewed product-route preview surface while keeping CP-6, Scale Gate, diagnostics, mastery, PV, summative use, broad student rollout, and student/product use blocked.',
    product_end_state_baseline: PRODUCT_END_STATE_SPEC,
    companion_core_specification: COMPANION_CORE_SPEC,
    original_sprint_gate_spec: {
      adoption_prep_packet: PREP_PACKET,
      product_proof_packet: prep.original_sprint_gate_spec.product_proof_packet,
      product_proof_review_packet: prep.original_sprint_gate_spec.product_proof_review_packet,
      lesson_manifest: prep.original_sprint_gate_spec.lesson_manifest,
      route_contracts: prep.original_sprint_gate_spec.route_contracts,
      governed_support_handoff: prep.original_sprint_gate_spec.governed_support_handoff,
      original_governed_support_gate: prep.original_sprint_gate_spec.original_governed_support_gate,
      book_architecture: prep.original_sprint_gate_spec.book_architecture
    },
    source_lineage: {
      platform_main_head_sha: gitRev(PLATFORM_ROOT, 'origin/main') || gitRev(PLATFORM_ROOT),
      lesson_main_head_sha: gitRev(lessonRoot, 'origin/main') || gitRev(lessonRoot),
      adoption_prep_expected_return: prep.expected_return,
      lesson_manifest_status: manifest.status,
      lesson_output_root: LESSON_OUTPUT_ROOT
    },
    adoption_surface: {
      registry_file: REGISTRY_FILE,
      registry_record_id: RECORD_ID,
      lesson_root_index: 'index.html',
      lesson_bundle_index: `${LESSON_OUTPUT_ROOT}/index.html`,
      root_link_href: `${LESSON_OUTPUT_ROOT}/index.html`,
      navigation_tier: 'bounded Year 2 route preview, not default book navigation or broad student rollout',
      route_count: records.length
    },
    records,
    rollback: {
      primary: 'Remove or deactivate this registry record and remove the bounded Year 2 route link from the lesson root index.',
      lesson_repo: 'Restore the root and bundle indexes to candidate-only/direct-URL exposure; keep generated candidate lesson files as evidence unless separately authorized.',
      platform_repo: 'Revert this registry file and review-gate artifacts without mutating MTU, operation, answer-skill, CP-6, Scale Gate, diagnostics, mastery, PV, summative, or student-use surfaces.'
    },
    authority_claims: AUTHORITY_CLAIMS
  };
  registry.core_requirement_checklist = coreChecklist(registry);
  registry.findings = [
    {
      finding: 'The registry adopts all four reviewed Year 2 candidate routes as one bounded product-route preview surface.',
      classification: 'core_requirement_met',
      blocks: 'none for owner review of this bounded adoption bundle',
      does_not_block: 'human decision on the exact platform registry and lesson index diff',
      proof_required_to_close: 'exact-head PR readiness proof, lead review, branch-protection ok:true, and owner authorization before merge'
    },
    {
      finding: 'The lesson root index and candidate bundle index are both required by this bundle.',
      classification: 'core_requirement_met',
      blocks: 'registry-only or index-only partial adoption',
      does_not_block: 'a coordinated cross-repo adoption PR pair',
      proof_required_to_close: 'platform checker must confirm both lesson index files contain the bounded adoption markers'
    },
    {
      finding: 'The bundle does not authorize CP-6, Scale Gate, diagnostics, mastery, PV, summative use, broad student rollout, or student/product use.',
      classification: 'scale_blocker',
      blocks: 'downstream closure and broad student/product-use claims',
      does_not_block: 'bounded route preview adoption',
      proof_required_to_close: 'separate downstream review with refreshed product-use evidence and explicit owner authority'
    }
  ];
  return registry;
}

function findingRows(findings) {
  return findings.map((item) =>
    `| ${item.finding} | ${item.classification} | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`
  ).join('\n');
}

function registryMarkdown(registry) {
  const rows = registry.records.map((record) =>
    `| ${record.target_owner_candidate_id} | ${record.paragraph_code} | ${record.route_label} | \`${record.bounded_entry_point}\` | ${record.adoption_state} |`
  ).join('\n');
  return `# ${SPRINT_ID} Review Packet

Status: bounded product-route adoption ready for human review.

## Product End-State And Original Sprint/Gate Spec

Product end-state: ${registry.product_end_state}

Product end-state baseline citation:
- ${registry.product_end_state_baseline}

Original sprint/gate/source specs:
- ${registry.original_sprint_gate_spec.adoption_prep_packet}
- ${registry.original_sprint_gate_spec.product_proof_packet}
- ${registry.original_sprint_gate_spec.product_proof_review_packet}
- ${registry.original_sprint_gate_spec.lesson_manifest}
- ${registry.original_sprint_gate_spec.route_contracts}
- ${registry.original_sprint_gate_spec.governed_support_handoff}
- ${registry.original_sprint_gate_spec.original_governed_support_gate}
- ${registry.original_sprint_gate_spec.book_architecture}
- ${registry.companion_core_specification}

## Non-Negotiable Requirements

- Implement the platform registry record and both 4veco-lessen index changes in one coordinated bundle.
- Include all four Year 2 target routes; do not return with a single-route, registry-only, or index-only adoption.
- Keep advisory short checks advisory and exit tickets target-equivalent candidates only.
- Do not mutate default book navigation or active curriculum sequencing.
- Keep CP-6, Scale Gate, diagnostics, mastery, PV, summative use, broad student rollout, and student/product use blocked.
- Include rollback for platform registry and lesson index changes.
- Route as READY_FOR_HUMAN_REVIEW and require exact-head owner authorization before merge.

## Exact Registry / Index Adoption Surface

Platform registry file: \`${registry.adoption_surface.registry_file}\`

Registry record id: \`${registry.adoption_surface.registry_record_id}\`

Lesson root index: \`${registry.adoption_surface.lesson_root_index}\`

Lesson bundle index: \`${registry.adoption_surface.lesson_bundle_index}\`

Root link href: \`${registry.adoption_surface.root_link_href}\`

Navigation tier: ${registry.adoption_surface.navigation_tier}

| Owner paragraph | Paragraph | Route label | Bounded entry point | Adoption state |
|---|---|---|---|---|
${rows}

## Core-Requirement Checklist

${Object.entries(registry.core_requirement_checklist).map(([key, value]) => `- ${key}: ${value ? 'met' : 'missing'}`).join('\n')}

## Findings Classification

| Finding | Classification | Blocks (\`blocks\`) | Does not block (\`does_not_block\`) | Proof required to close (\`proof_required_to_close\`) |
|---|---|---|---|---|
${findingRows(registry.findings)}

## Authority Boundary

This bundle authorizes only a bounded Year 2 route preview after exact-head owner-approved merge. It does not authorize CP-6, Scale Gate, diagnostics, mastery, PV, summative use, broad student rollout, student use, or student/product use.

## Rollback

- ${registry.rollback.primary}
- ${registry.rollback.lesson_repo}
- ${registry.rollback.platform_repo}
`;
}

function renderedRegistry(registry) {
  const cards = registry.records.map((record) => `<article class="card">
    <p class="label">${html(record.target_owner_candidate_id)}</p>
    <h2>${html(record.route_label)}</h2>
    <p class="mono">${html(record.bounded_entry_point)}</p>
    <p>${html(record.adoption_state)}</p>
  </article>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${html(SPRINT_ID)}</title>
  <style>
    *{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;background:#f6f8fb;color:#1f2937;line-height:1.55}
    header{background:#fff;border-bottom:1px solid #d7dde5}.top,main{max-width:1120px;margin:0 auto;padding:24px 20px}
    .eyebrow,.label{font-size:12px;text-transform:uppercase;letter-spacing:0;color:#176b87;font-weight:800}
    h1{font-size:clamp(28px,4vw,42px);line-height:1.1;margin:6px 0 8px}.sub{max-width:840px;color:#5f6b7a}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.card{background:#fff;border:1px solid #d7dde5;border-radius:8px;padding:16px}
    .boundary{border-left:4px solid #9a3412}.ok{color:#0f766e;font-weight:800}.mono{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:13px;overflow-wrap:anywhere}
    @media(max-width:820px){.grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <header><div class="top"><p class="eyebrow">Bounded route adoption</p><h1>${html(SPRINT_ID)}</h1><p class="sub">${html(registry.product_end_state)}</p></div></header>
  <main>
    <section class="card boundary"><h2>Authority Boundary</h2><p>Bounded route preview only. CP-6, Scale Gate, diagnostics, mastery, PV, summative use, broad student rollout, student use, and student/product use remain blocked.</p></section>
    <p class="ok">Registry/index bundle includes ${registry.records.length} routes and both lesson index files.</p>
    <section class="grid">${cards}</section>
  </main>
</body>
</html>`;
}

function writePlatformArtifacts(options = {}) {
  const registry = adoptionRegistry(options);
  writeFile(path.join(PLATFORM_ROOT, REGISTRY_FILE), JSON.stringify(registry, null, 2) + '\n');
  writeFile(path.join(REPORT_DIR, 'bounded-route-adoption-packet.json'), JSON.stringify(registry, null, 2) + '\n');
  writeFile(path.join(REPORT_DIR, 'bounded-route-adoption-packet.md'), registryMarkdown(registry));
  writeFile(path.join(REPORT_DIR, 'review-packet.json'), JSON.stringify({
    schema_version: 1,
    sprint_id: SPRINT_ID,
    status: registry.status,
    content_verdict_requested: 'Review the exact platform registry plus 4veco-lessen index adoption bundle; do not infer CP-6, Scale Gate, diagnostics, mastery, PV, summative, broad student rollout, or student/product-use authority.',
    bounded_route_adoption_packet: `reports/review-gates/${SPRINT_ID}/bounded-route-adoption-packet.json`,
    product_route_adoption_registry: REGISTRY_FILE,
    rendered_registry_map: `reports/review-gates/${SPRINT_ID}/rendered-registry-map.html`,
    lesson_index_files: [
      'index.html',
      `${LESSON_OUTPUT_ROOT}/index.html`
    ],
    authority_claims: AUTHORITY_CLAIMS
  }, null, 2) + '\n');
  writeFile(path.join(REPORT_DIR, 'review-packet.md'), registryMarkdown(registry));
  writeFile(path.join(REPORT_DIR, 'rendered-registry-map.html'), renderedRegistry(registry));
  return registry;
}

function main() {
  const lessonRoot = resolveLessonRoot(process.argv.find((arg) => arg.startsWith('--lesson-root='))?.slice('--lesson-root='.length));
  const registry = writePlatformArtifacts({ lessonRoot });
  console.log(JSON.stringify({
    ok: true,
    sprint_id: SPRINT_ID,
    registry: REGISTRY_FILE,
    report_dir: relFromPlatform(REPORT_DIR),
    records: registry.records.length,
    route_count: registry.adoption_surface.route_count
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
  REGISTRY_FILE,
  LESSON_OUTPUT_ROOT,
  adoptionRegistry,
  writePlatformArtifacts
};
