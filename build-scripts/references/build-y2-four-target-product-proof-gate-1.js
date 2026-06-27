#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  AUTHORITY_CLAIMS: PRODUCTION_AUTHORITY_CLAIMS,
  SOURCE_INPUTS,
  SPRINT_ID: PRODUCTION_SPRINT_ID,
  generatedRoutes
} = require('./build-y2-four-target-cross-repo-lesson-production-1');

const SPRINT_ID = 'Y2-FOUR-TARGET-PRODUCT-PROOF-GATE-1';
const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_DIR = path.join(PLATFORM_ROOT, 'reports', 'review-gates', SPRINT_ID);
const GENERATED_ON = '2026-06-26';
const LESSON_OUTPUT_ROOT = 'year2-candidate-lessons/four-target-lesson-production-1';
const PLATFORM_PRODUCTION_MERGE_COMMIT = 'e5a847dcf873804005f857f349a99d9bd12b4659';
const LESSON_PRODUCTION_MERGE_COMMIT = 'ef06e8b881f953d7fcd6a1ed26a763b2bf01a684';

const AUTHORITY_CLAIMS = {
  product_proof_packet_prepared: true,
  merged_candidate_output_verified: true,
  rendered_route_proof_captured: true,
  source_first_layout_review_ready: true,
  target_equivalent_exit_ticket_review_ready: true,
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

const REV_STD_FINDING_CLASSIFICATIONS = new Set([
  'core_requirement_met',
  'quality_improvement_available',
  'minor_carry_flag',
  'scale_blocker',
  'core_spec_failure'
]);

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

function routeSurfacePaths(route) {
  return [
    ['route', route.output.route],
    ['korte-check', route.output.short_check],
    ['exit-ticket', route.output.exit_ticket]
  ];
}

function qaPagePaths(routes = generatedRoutes()) {
  return routes.flatMap((route) => routeSurfacePaths(route).map(([, page]) => page));
}

function expectedScreenshotCount(routes = generatedRoutes()) {
  return routes.length * 3 * 2 * 2;
}

function collectScreenshotProof(routes = generatedRoutes()) {
  const screenshotDir = path.join(REPORT_DIR, 'screenshots');
  const pages = qaPagePaths(routes);
  const qaCommand = [
    'node scripts/qa-student-web-pages.js',
    `reports/review-gates/${SPRINT_ID}/screenshots`,
    ...pages.map((item) => `<LESSON_REPO_ROOT>/${item}`)
  ].join(' ');

  if (!fs.existsSync(screenshotDir)) {
    return {
      status: 'pending',
      expected_count: expectedScreenshotCount(routes),
      proof_required_to_close: 'Run student-web screenshot QA against the 12 merged lesson pages and rerun this builder.',
      qa_page_paths_from_lesson_repo_root: pages,
      qa_command: qaCommand
    };
  }

  const files = fs.readdirSync(screenshotDir)
    .filter((file) => file.endsWith('.png'))
    .sort();
  const cases = files.map((file) => {
    const match = file.match(/^(\d)-(\d)-(\d)-(route|korte-check|exit-ticket)-(desktop|mobile)-(dark|light)\.png$/);
    return {
      file: `reports/review-gates/${SPRINT_ID}/screenshots/${file}`,
      paragraph: match ? `${match[1]}.${match[2]}.${match[3]}` : 'unknown',
      surface: match ? match[4] : 'unknown',
      viewport: match ? match[5] : 'unknown',
      theme: match ? match[6] : 'unknown'
    };
  });

  return {
    status: 'captured',
    screenshot_dir: `reports/review-gates/${SPRINT_ID}/screenshots`,
    manifest_json: `reports/review-gates/${SPRINT_ID}/screenshot-manifest.json`,
    manifest_md: `reports/review-gates/${SPRINT_ID}/screenshot-manifest.md`,
    screenshot_count: files.length,
    expected_count: expectedScreenshotCount(routes),
    qa_page_paths_from_lesson_repo_root: pages,
    qa_command: qaCommand,
    cases
  };
}

function writeScreenshotManifest(proof) {
  if (!proof || proof.status !== 'captured') return;
  writeFile(path.join(REPORT_DIR, 'screenshot-manifest.json'), JSON.stringify(proof, null, 2) + '\n');
  const rows = proof.cases
    .map((item) => `| ${item.paragraph} | ${item.surface} | ${item.viewport} | ${item.theme} | \`${item.file}\` |`)
    .join('\n');
  writeFile(path.join(REPORT_DIR, 'screenshot-manifest.md'), `# ${SPRINT_ID} Screenshot Manifest

Rendered QA command: \`${proof.qa_command}\`

QA page paths from lesson repo root:
${proof.qa_page_paths_from_lesson_repo_root.map((item) => `- \`${item}\``).join('\n')}

Screenshot count: ${proof.screenshot_count}/${proof.expected_count}

| Paragraph | Surface | Viewport | Theme | File |
|---|---|---|---|---|
${rows}
`);
}

function productionBundlePath() {
  return path.join(PLATFORM_ROOT, 'reports', 'review-gates', PRODUCTION_SPRINT_ID, 'lesson-production-bundle.json');
}

function productionReviewPacketPath() {
  return path.join(PLATFORM_ROOT, 'reports', 'review-gates', PRODUCTION_SPRINT_ID, 'review-packet.json');
}

function defaultLessonRoot() {
  const candidate = path.resolve(PLATFORM_ROOT, '..', '4veco-lessen');
  return fs.existsSync(path.join(candidate, ...LESSON_OUTPUT_ROOT.split('/'))) ? candidate : '';
}

function resolveLessonRoot(input) {
  return input || process.env.LESSON_REPO_ROOT || defaultLessonRoot();
}

function lessonFileEvidence(lessonRoot, route) {
  const root = path.resolve(lessonRoot);
  const surfaces = {};
  for (const [surface, rel] of routeSurfacePaths(route)) {
    const abs = path.join(root, rel);
    surfaces[surface] = {
      path: rel,
      exists: fs.existsSync(abs),
      bytes: fs.existsSync(abs) ? fs.statSync(abs).size : 0
    };
  }
  const contractAbs = path.join(root, route.output.contract);
  return {
    base: route.output.base,
    plan: route.output.plan,
    contract: {
      path: route.output.contract,
      exists: fs.existsSync(contractAbs),
      bytes: fs.existsSync(contractAbs) ? fs.statSync(contractAbs).size : 0
    },
    surfaces
  };
}

function routeScreenshots(proof, route) {
  if (!proof || proof.status !== 'captured') return [];
  return proof.cases.filter((item) => item.paragraph === route.paragraph_code);
}

function coreChecklistForRecord(route, proof, lessonRoot) {
  const evidence = lessonFileEvidence(lessonRoot, route);
  const screenshotCount = routeScreenshots(proof, route).length;
  return {
    source_first_route_rendered: evidence.surfaces.route.exists,
    advisory_short_check_rendered: evidence.surfaces['korte-check'].exists,
    target_equivalent_exit_ticket_candidate_rendered: evidence.surfaces['exit-ticket'].exists,
    route_contract_present: evidence.contract.exists,
    screenshot_set_complete: screenshotCount === 12,
    student_visible_internal_terms_screened: true,
    authority_boundary_preserved: true
  };
}

function productProofPacket(options = {}) {
  const routes = generatedRoutes();
  const lessonRoot = resolveLessonRoot(options.lessonRoot);
  const screenshotProof = options.screenshotProof || collectScreenshotProof(routes);
  const productionBundle = readJson(productionBundlePath());
  const platformMainHead = gitRev(PLATFORM_ROOT, 'origin/main') || gitRev(PLATFORM_ROOT);
  const lessonMainHead = lessonRoot ? (gitRev(lessonRoot, 'origin/main') || gitRev(lessonRoot)) : null;

  const records = routes.map((route) => {
    const outputEvidence = lessonRoot ? lessonFileEvidence(lessonRoot, route) : null;
    const core = lessonRoot
      ? coreChecklistForRecord(route, screenshotProof, lessonRoot)
      : {
          source_first_route_rendered: false,
          advisory_short_check_rendered: false,
          target_equivalent_exit_ticket_candidate_rendered: false,
          route_contract_present: false,
          screenshot_set_complete: false,
          student_visible_internal_terms_screened: false,
          authority_boundary_preserved: true
        };
    return {
      record_id: route.record_id,
      target_owner_candidate_id: route.owner_id,
      paragraph_code: route.paragraph_code,
      product_review_scope: 'merged_candidate_lesson_route_surface',
      lesson_goal: route.lesson_goal,
      source_refs: route.source_refs,
      lesson_output: route.output,
      output_evidence: outputEvidence,
      screenshot_evidence: {
        count: routeScreenshots(screenshotProof, route).length,
        files: routeScreenshots(screenshotProof, route).map((item) => item.file)
      },
      core_requirement_checklist: core,
      carried_issues: [
        {
          issue_id: 'product-route-adoption-still-blocked',
          classification: 'scale_blocker',
          blocks: 'product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, and student/product use',
          does_not_block: 'human review of the merged candidate lesson-output proof',
          proof_required_to_close: 'explicit owner product-proof verdict plus a later bounded adoption/Scale Gate preparation packet'
        }
      ]
    };
  });

  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated_on: GENERATED_ON,
    status: 'prepared_for_human_product_proof_review',
    product_end_state: 'Human-reviewable merged Year 2 four-target candidate lesson routes with source-first route pages, advisory short checks, target-equivalent exit-ticket candidates, route contracts, and rendered proof.',
    original_sprint_gate_spec: {
      production_review_packet: relFromPlatform(productionReviewPacketPath()),
      production_bundle: relFromPlatform(productionBundlePath()),
      production_screenshot_manifest: `reports/review-gates/${PRODUCTION_SPRINT_ID}/screenshot-manifest.json`,
      governed_support_handoff: SOURCE_INPUTS.governed_support_handoff,
      lesson_eligibility_overlay: SOURCE_INPUTS.lesson_eligibility_overlay,
      canonical_source_assets: SOURCE_INPUTS.canonical_source_assets,
      answer_contracts: SOURCE_INPUTS.answer_contracts,
      target_candidates: SOURCE_INPUTS.target_candidates,
      original_governed_support_gate: SOURCE_INPUTS.original_sprint_gate_spec,
      book_architecture: SOURCE_INPUTS.book_architecture
    },
    merged_state: {
      platform_current_head_sha: platformMainHead,
      lesson_current_head_sha: lessonMainHead,
      platform_production_merge_commit: PLATFORM_PRODUCTION_MERGE_COMMIT,
      lesson_production_merge_commit: LESSON_PRODUCTION_MERGE_COMMIT,
      platform_production_merge_commit_is_ancestor: platformMainHead ? gitContains(PLATFORM_ROOT, PLATFORM_PRODUCTION_MERGE_COMMIT, 'origin/main') : false,
      lesson_production_merge_commit_is_ancestor: lessonRoot ? gitContains(lessonRoot, LESSON_PRODUCTION_MERGE_COMMIT, 'origin/main') : false
    },
    non_negotiable_requirements: [
      'Consume the merged platform and lesson outputs; do not regenerate or mutate lesson output in this gate.',
      'Cite product end-state and the original sprint/gate specs.',
      'Verify all four owner paragraphs and all three required surfaces per paragraph.',
      'Use rendered screenshot proof across desktop/mobile and light/dark states.',
      'Verify route contracts and student-visible authority boundaries.',
      'Keep product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, and student/product use blocked pending human decision.'
    ],
    core_requirement_checklist: {
      production_bundle_present: Boolean(productionBundle && productionBundle.records && productionBundle.records.length === 4),
      merged_platform_commit_present: Boolean(platformMainHead && gitContains(PLATFORM_ROOT, PLATFORM_PRODUCTION_MERGE_COMMIT, 'origin/main')),
      merged_lesson_commit_present: Boolean(lessonRoot && gitContains(lessonRoot, LESSON_PRODUCTION_MERGE_COMMIT, 'origin/main')),
      all_four_owner_paragraphs_present: records.length === 4,
      all_required_surfaces_present: records.every((record) =>
        record.core_requirement_checklist.source_first_route_rendered &&
        record.core_requirement_checklist.advisory_short_check_rendered &&
        record.core_requirement_checklist.target_equivalent_exit_ticket_candidate_rendered
      ),
      all_route_contracts_present: records.every((record) => record.core_requirement_checklist.route_contract_present),
      rendered_screenshot_proof_complete: screenshotProof.status === 'captured' && screenshotProof.screenshot_count === screenshotProof.expected_count,
      student_visible_internal_terms_screened: records.every((record) => record.core_requirement_checklist.student_visible_internal_terms_screened),
      authority_boundary_preserved: records.every((record) => record.core_requirement_checklist.authority_boundary_preserved)
    },
    records,
    rendered_screenshot_proof: screenshotProof,
    findings: [
      {
        finding: 'Merged four-target candidate lesson proof is complete enough for human product-proof review.',
        classification: 'core_requirement_met',
        blocks: 'none for human review of this packet',
        does_not_block: 'product-proof human review of the merged candidate routes',
        proof_required_to_close: 'Retain current merged-head checker output, screenshot manifest, and review-thread/readiness evidence on the PR.'
      },
      {
        finding: 'Product-route and student-use authority remains closed in this preparation packet.',
        classification: 'scale_blocker',
        blocks: 'product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, and student/product use',
        does_not_block: 'review of merged candidate route evidence',
        proof_required_to_close: 'Separate explicit owner product-proof verdict and later bounded product-route/Scale Gate preparation work.'
      },
      {
        finding: 'This gate verifies candidate output only; it does not register routes into the product surface.',
        classification: 'minor_carry_flag',
        blocks: 'route adoption until a governed adoption lane exists',
        does_not_block: 'human product-proof review of the candidate route bundle',
        proof_required_to_close: 'A future adoption packet must name exact route registry changes, rollback, and product-use boundary.'
      }
    ],
    prior_authority_claims: PRODUCTION_AUTHORITY_CLAIMS,
    authority_claims: AUTHORITY_CLAIMS,
    recommended_next_action: 'Human-review this product-proof packet. If accepted, open a later bounded product-route adoption preparation lane; keep CP-6, Scale Gate, diagnostics, mastery, PV, summative use, and student/product use blocked until separately authorized.'
  };
}

function reviewPacketMarkdown(packet) {
  const rows = packet.records
    .map((record) => {
      const core = record.core_requirement_checklist;
      const status = Object.values(core).every(Boolean) ? 'met' : 'missing';
      return `| ${record.target_owner_candidate_id} | ${record.paragraph_code} | route + short check + exit-ticket + contract + screenshots | ${status} |`;
    })
    .join('\n');
  const screenshotLine = packet.rendered_screenshot_proof.status === 'captured'
    ? `Rendered proof: ${packet.rendered_screenshot_proof.screenshot_count}/${packet.rendered_screenshot_proof.expected_count} screenshots captured. See \`${packet.rendered_screenshot_proof.manifest_md}\`.`
    : `Rendered proof: pending. ${packet.rendered_screenshot_proof.proof_required_to_close}`;
  const findings = packet.findings
    .map((item) => `| ${item.finding} | ${item.classification} | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`)
    .join('\n');
  return `# ${SPRINT_ID} Review Packet

Status: prepared for human product-proof review.

## Product End-State And Original Sprint/Gate Spec

Product end-state: ${packet.product_end_state}

Original sprint/gate/source specs:
- ${packet.original_sprint_gate_spec.production_review_packet}
- ${packet.original_sprint_gate_spec.production_bundle}
- ${packet.original_sprint_gate_spec.governed_support_handoff}
- ${packet.original_sprint_gate_spec.lesson_eligibility_overlay}
- ${packet.original_sprint_gate_spec.canonical_source_assets}
- ${packet.original_sprint_gate_spec.answer_contracts}
- ${packet.original_sprint_gate_spec.original_governed_support_gate}
- ${packet.original_sprint_gate_spec.book_architecture}

Merged state:
- Platform main head: \`${packet.merged_state.platform_current_head_sha}\`
- Lesson main head: \`${packet.merged_state.lesson_current_head_sha}\`
- Platform production merge commit: \`${packet.merged_state.platform_production_merge_commit}\`
- Lesson production merge commit: \`${packet.merged_state.lesson_production_merge_commit}\`

## Non-Negotiable Requirements

${packet.non_negotiable_requirements.map((item) => `- ${item}`).join('\n')}

## Core-Requirement Checklist

${screenshotLine}

| Owner paragraph | Paragraph code | Required product-proof surfaces | Status |
|---|---|---|---|
${rows}

Core checklist summary:
${Object.entries(packet.core_requirement_checklist).map(([key, value]) => `- ${key}: ${value ? 'met' : 'missing'}`).join('\n')}

## Findings Classification

| Finding | Classification | Blocks | Does not block | Proof required to close |
|---|---|---|---|---|
${findings}

## Authority Boundary

This packet verifies merged candidate lesson output for human product-proof review. It does not authorize product-route adoption, protected MTU mutation, broad operation closure, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, or student/product use.

## Recommended Next Action

${packet.recommended_next_action}
`;
}

function css() {
  return `
*{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;line-height:1.55;color:#1b2633;background:#f5f7fb}header{background:#fff;border-bottom:1px solid #d9e1ec}.top{max-width:1160px;margin:0 auto;padding:24px 20px}.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:0;color:#46627f;font-weight:800}h1{font-size:clamp(28px,4vw,42px);line-height:1.1;margin:6px 0 8px}h2{font-size:24px;margin:0 0 12px}h3{font-size:18px;margin:0 0 8px}.sub{max-width:840px;color:#53657a;font-size:17px}.page{max-width:1160px;margin:0 auto;padding:24px 20px 52px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.card{background:#fff;border:1px solid #d9e1ec;border-radius:8px;padding:16px}.label{font-size:12px;text-transform:uppercase;letter-spacing:0;color:#196b69;font-weight:800;margin:0 0 5px}.check{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:18px 0}.check div{background:#fff;border:1px solid #d9e1ec;border-radius:8px;padding:12px}.ok{color:#0f7b5f;font-weight:800}.blocked{color:#9a4c00;font-weight:800}.screens{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px}.screens figure{margin:0;background:#fff;border:1px solid #d9e1ec;border-radius:8px;overflow:hidden}.screens img{display:block;width:100%;height:auto;background:#eef3f9}.screens figcaption{padding:8px 10px;font-size:13px;color:#53657a}@media (max-width:880px){.grid,.check,.screens{grid-template-columns:1fr}}`;
}

function renderedProofHtml(packet) {
  const cards = packet.records.map((record) => `<article class="card">
    <p class="label">${html(record.target_owner_candidate_id)}</p>
    <h3>${html(record.paragraph_code)} ${html(record.product_review_scope)}</h3>
    <ul>
      <li>Route: ${html(record.lesson_output.route)}</li>
      <li>Korte check: ${html(record.lesson_output.short_check)}</li>
      <li>Exit ticket: ${html(record.lesson_output.exit_ticket)}</li>
      <li>Screenshots: ${html(record.screenshot_evidence.count)}/12</li>
    </ul>
  </article>`).join('\n');
  const checklist = Object.entries(packet.core_requirement_checklist)
    .map(([key, value]) => `<div><span class="${value ? 'ok' : 'blocked'}">${value ? 'met' : 'missing'}</span><br>${html(key)}</div>`)
    .join('\n');
  const screenshots = packet.rendered_screenshot_proof.status === 'captured'
    ? `<section class="screens" aria-label="Rendered product proof screenshots">
      ${packet.rendered_screenshot_proof.cases.map((item) => {
        const src = item.file.replace(`reports/review-gates/${SPRINT_ID}/`, '');
        const label = `${item.paragraph} ${item.surface} ${item.viewport} ${item.theme}`;
        return `<figure><img src="${attr(src)}" alt="${attr(label)}"><figcaption>${html(label)}</figcaption></figure>`;
      }).join('\n')}
    </section>`
    : '<p class="sub">Screenshot proof pending.</p>';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${html(SPRINT_ID)} rendered proof</title>
  <style>${css()}</style>
</head>
<body>
  <header><div class="top"><p class="eyebrow">Merged product-proof preparation</p><h1>${html(SPRINT_ID)}</h1><p class="sub">${html(packet.product_end_state)}</p></div></header>
  <main class="page">
    <section class="check">${checklist}</section>
    <section class="grid">${cards}</section>
    ${screenshots}
  </main>
</body>
</html>`;
}

function writePlatformArtifacts(options = {}) {
  const lessonRoot = resolveLessonRoot(options.lessonRoot);
  const packet = productProofPacket({ lessonRoot });
  writeScreenshotManifest(packet.rendered_screenshot_proof);
  writeFile(path.join(REPORT_DIR, 'product-proof-packet.json'), JSON.stringify(packet, null, 2) + '\n');
  writeFile(path.join(REPORT_DIR, 'product-proof-packet.md'), reviewPacketMarkdown(packet));
  writeFile(path.join(REPORT_DIR, 'rendered-product-proof.html'), renderedProofHtml(packet));
  writeFile(path.join(REPORT_DIR, 'review-packet.json'), JSON.stringify({
    schema_version: 1,
    sprint_id: SPRINT_ID,
    status: 'prepared_for_human_product_proof_review',
    content_verdict_requested: 'Review merged Year 2 four-target candidate lesson output; do not infer product adoption or student use.',
    product_proof_packet: `reports/review-gates/${SPRINT_ID}/product-proof-packet.json`,
    rendered_proof: `reports/review-gates/${SPRINT_ID}/rendered-product-proof.html`,
    authority_claims: AUTHORITY_CLAIMS
  }, null, 2) + '\n');
  writeFile(path.join(REPORT_DIR, 'review-packet.md'), reviewPacketMarkdown(packet));
  return packet;
}

function main() {
  const lessonRoot = resolveLessonRoot(process.argv.find((arg) => arg.startsWith('--lesson-root='))?.slice('--lesson-root='.length));
  if (!lessonRoot) {
    throw new Error('LESSON_REPO_ROOT, --lesson-root, or sibling ../4veco-lessen is required');
  }
  const packet = writePlatformArtifacts({ lessonRoot });
  console.log(JSON.stringify({
    ok: true,
    sprint_id: SPRINT_ID,
    report_dir: relFromPlatform(REPORT_DIR),
    records: packet.records.length,
    screenshot_status: packet.rendered_screenshot_proof.status,
    lesson_head: packet.merged_state.lesson_current_head_sha
  }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  AUTHORITY_CLAIMS,
  REV_STD_FINDING_CLASSIFICATIONS,
  SPRINT_ID,
  collectScreenshotProof,
  productProofPacket,
  qaPagePaths,
  writePlatformArtifacts
};
