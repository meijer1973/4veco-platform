#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen');
const BOOK_ROOT = path.join(LESSON_ROOT, 'Boek 1 - Grondslagen, vraag en aanbod');
const CHAPTER = '1.1 Hoofdstuk Economisch denken en rekenen';
const WAVE_ID = 'Y1-GOLDEN-ROLLOUT-WAVE-1';
const wavePath = 'references/data/exercises/y1-golden-rollout-wave-1.json';
const surfaceManifestPath = 'references/data/exercise-surface-manifest.json';
const scaleProofPath = 'reports/json/scale-proof-3p-readiness-product-path-proof-1-proof.json';
const reviewPacketPath = 'reports/review-gates/Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json';

const paragraphs = ['1.1.1', '1.1.2', '1.1.3'];
const expectedSurfaceIds = [
  '1.1.1-korte-check',
  '1.1.1-exit-ticket',
  '1.1.2-korte-check',
  '1.1.2-exit-ticket',
  '1.1.3-korte-check',
  '1.1.3-exit-ticket',
];
const requiredScaleProofFlags = [
  'all_required_route_families_present',
  'all_landing_links_resolve',
  'exit_tickets_target_readiness_approved',
  'short_checks_advisory_only',
  'all_first_three_check_exit_surfaces_golden',
  'start_learn_oefen_skill_practice_captured',
  'rendered_desktop_mobile_dark_coverage',
  'completed_feedback_states_captured',
  'advisory_feedback_states_captured',
  'target_completion_language_held_in_completed_exit_routes',
  'no_broad_authority_terms_in_captures',
  'first_three_landing_authority_copy_neutral',
  'same_copy_hygiene_114_neutral_not_gate_claim',
];
const falseAuthorityKeys = [
  'product_route_adoption_authorized',
  'product_use_authorized',
  'student_product_use_authorized',
  'scale_gate_1_authorized',
  'diagnostics_authorized',
  'mastery_or_sequencing_authorized',
  'adaptive_routing_authorized',
  'summative_use_authorized',
  'pv_authorized',
  'target_equivalent_completion_language_authorized',
];

function fail(message) {
  console.error(`Y1-GOLDEN-ROLLOUT-WAVE-1 check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function full(file) {
  return path.resolve(ROOT, file);
}

function exists(file, cwd = ROOT) {
  return fs.existsSync(path.resolve(cwd, file));
}

function read(file) {
  const filePath = full(file);
  if (!fs.existsSync(filePath)) fail(`missing file: ${file}`);
  return fs.readFileSync(filePath, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^\.\//, '').replace(/\/+$/, '');
}

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function assertSameSet(actual, expected, label) {
  const left = sorted(actual);
  const right = sorted(expected);
  assert(
    left.length === right.length && left.every((value, index) => value === right[index]),
    `${label} mismatch: expected ${right.join(', ')}, got ${left.join(', ')}`
  );
}

function assertFalseAuthority(authority, label) {
  for (const key of falseAuthorityKeys) {
    assert(authority && authority[key] === false, `${label}.${key} must be false`);
  }
}

function gitStatusClean(repoCwd, paths, label) {
  const result = spawnSync('git', ['status', '--porcelain', '--', ...paths], {
    cwd: repoCwd,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    fail(`git status failed for ${label}`);
  }
  if (result.stdout.trim()) fail(`${label} has changes:\n${result.stdout.trim()}`);
}

function paragraphDirForSource(sourceData) {
  return path.join(BOOK_ROOT, CHAPTER, `${sourceData.parNr} ${sourceData.parName}`);
}

function routeTargetExists(paragraphDir, href) {
  const cleanHref = String(href || '').split('#')[0];
  if (!cleanHref) return true;
  const decoded = decodeURIComponent(cleanHref);
  return fs.existsSync(path.resolve(paragraphDir, decoded));
}

function checkSourceSurface(surface) {
  assert(surface.source_path, `${surface.id} must name source_path`);
  assert(surface.generated_path, `${surface.id} must name generated_path`);
  assert(exists(surface.source_path), `${surface.id} source path missing: ${surface.source_path}`);
  assert(exists(surface.generated_path, BOOK_ROOT), `${surface.id} generated path missing: ${surface.generated_path}`);

  const source = readJson(surface.source_path);
  assert(source.parNr === surface.paragraph, `${surface.id} parNr mismatch`);
  assert(source.layout && source.layout.framework === 'golden_exercise_workbench', `${surface.id} must use Golden Workbench layout`);
  assert(source.targetEquivalent && source.targetEquivalent.completionLanguageEligible === false, `${surface.id} completion language must remain held`);

  if (surface.surface === 'advisory_short_check') {
    assert(source.surface === 'advisory_short_check', `${surface.id} source must be advisory_short_check`);
    assert(source.targetEquivalent.candidate === false, `${surface.id} advisory candidate must be false`);
    assert(source.targetEquivalent.gateApproved === false, `${surface.id} advisory gateApproved must be false`);
    assert(source.metadataAlignment && source.metadataAlignment.targetReadinessEvidence === false, `${surface.id} advisory target readiness must be false`);
  } else if (surface.surface === 'target_equivalent_exit_ticket') {
    assert(source.surface === 'target_equivalent_exit_ticket', `${surface.id} source must be target_equivalent_exit_ticket`);
    assert(source.targetEquivalent.candidate === true, `${surface.id} exit candidate must be true`);
    assert(source.targetEquivalent.gateApproved === true, `${surface.id} exit gateApproved must be true`);
    assert(source.metadataAlignment && source.metadataAlignment.targetReadinessEvidence === true, `${surface.id} exit target readiness evidence must be true`);
  } else {
    fail(`${surface.id} unsupported surface type ${surface.surface}`);
  }

  const paragraphDir = paragraphDirForSource(source);
  assert(fs.existsSync(paragraphDir), `${surface.id} paragraph directory missing: ${paragraphDir}`);
  for (const route of (source.skillMap && source.skillMap.routes) || []) {
    assert(route.href, `${surface.id} skill-map route missing href`);
    assert(routeTargetExists(paragraphDir, route.href), `${surface.id} skill-map href does not resolve: ${route.href}`);
  }
}

function checkWaveManifest() {
  const wave = readJson(wavePath);
  assert(wave.schema_version === 1, 'wave schema_version must be 1');
  assert(wave.wave_id === WAVE_ID, `wave_id must be ${WAVE_ID}`);
  assert(wave.status === 'ready_for_human_review', 'wave status must be ready_for_human_review');
  assert(wave.scope === 'first_three_workflow_availability', 'wave scope mismatch');
  assertSameSet(wave.paragraphs || [], paragraphs, 'wave paragraphs');
  assertSameSet(wave.surface_ids || [], expectedSurfaceIds, 'wave surface_ids');
  assert(wave.surface_source === surfaceManifestPath, 'wave must cite exercise surface manifest');
  assert(wave.rendered_product_path_proof === scaleProofPath, 'wave must cite Scale proof JSON');
  assertSameSet(wave.same_copy_hygiene_not_gate_claim || [], ['1.1.4'], 'same-copy hygiene paragraphs');
  assertFalseAuthority(wave.authority, 'wave.authority');
  assert(wave.authority.generated_lesson_output_changed === false, 'wave must not change generated lesson output');
  assert(wave.authority.source_data_changed === false, 'wave must not change source data');
  assert(wave.authority.engine_behavior_changed === false, 'wave must not change engine behavior');
  assert(Array.isArray(wave.next_expansion_candidates) && wave.next_expansion_candidates.length >= 2, 'wave must name next expansion candidates');
  return wave;
}

function checkSurfaceManifest(wave) {
  const manifest = readJson(surfaceManifestPath);
  assert(manifest.schema_version === 1, 'surface manifest schema_version must be 1');
  assert(manifest.status === 'current', 'surface manifest must be current');

  const firstThree = (manifest.surfaces || []).filter((surface) => surface.scope === 'first_three_product_proof');
  assertSameSet(firstThree.map((surface) => surface.id), expectedSurfaceIds, 'first-three manifest surfaces');
  assertSameSet(firstThree.map((surface) => surface.id), wave.surface_ids, 'wave/manifest surfaces');

  for (const surface of firstThree) {
    assert(surface.current === true, `${surface.id} must be current`);
    assert(surface.legacy_unsuffixed_allowed === false, `${surface.id} must reject legacy unsuffixed paths`);
    assert(surface.completion_language_eligible === false, `${surface.id} completion language must be false`);
    checkSourceSurface(surface);
  }

  const hygiene = (manifest.surfaces || []).filter((surface) => surface.scope === 'same_copy_hygiene');
  assertSameSet(hygiene.map((surface) => surface.paragraph), ['1.1.4'], 'same-copy hygiene manifest paragraphs');
  for (const surface of hygiene) {
    assert(surface.gate_claim === false, `${surface.id} must not be a gate claim`);
  }

  const sourceFiles = fs
    .readdirSync(path.join(ROOT, 'source-data', 'book-1', 'exit-ticket'))
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''));
  assertSameSet(sourceFiles, expectedSurfaceIds, 'current source-data check surfaces');
}

function checkScaleProof() {
  const proof = readJson(scaleProofPath);
  assert(proof.schema_version === 1, 'Scale proof schema_version must be 1');
  assert(proof.sprint_id === 'SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1', 'Scale proof sprint_id mismatch');
  assert(proof.status === 'scale_gate_1_ready_for_human_review', 'Scale proof status must remain ready for human review');
  assert(proof.lead_recommendation === 'READY_FOR_HUMAN_SCALE_GATE_1_REVIEW', 'Scale proof lead recommendation mismatch');
  assertFalseAuthority(proof.authority, 'scaleProof.authority');
  assert(Array.isArray(proof.authority_issues) && proof.authority_issues.length === 0, 'Scale proof must have zero authority issues');
  for (const flag of requiredScaleProofFlags) {
    assert(proof.proof && proof.proof[flag] === true, `Scale proof flag must be true: ${flag}`);
  }
  assert(proof.proof.authority_copy_issue_count === 0, 'Scale proof authority issue count must be zero');
  assert(typeof proof.next_gate_action === 'string' && /Human Scale Gate 1 review/.test(proof.next_gate_action), 'Scale proof must route next gate action to human review');

  assertSameSet((proof.route_inventory.paragraphs || []).map((item) => item.paragraph), paragraphs, 'Scale proof route inventory paragraphs');
  for (const paragraph of paragraphs) {
    const route = proof.route_inventory.paragraphs.find((item) => item.paragraph === paragraph);
    assert(route.all_required_families_present === true, `${paragraph} route families must be present`);
    assert(route.link_resolution && route.link_resolution.unresolved.length === 0, `${paragraph} route links must resolve`);

    const surfaceData = proof.surface_data[paragraph];
    assert(surfaceData, `${paragraph} surface data missing from Scale proof`);
    assert(surfaceData.exit_ticket.rendered_shell === 'golden_exercise_workbench', `${paragraph} exit must be Golden`);
    assert(surfaceData.short_check.rendered_shell === 'golden_exercise_workbench', `${paragraph} short check must be Golden`);
    assert(surfaceData.exit_ticket.links_resolve === true, `${paragraph} exit links must resolve`);
    assert(surfaceData.short_check.links_resolve === true, `${paragraph} short-check links must resolve`);
  }

  const firstThreeCopy = proof.authority_copy_audit && proof.authority_copy_audit.first_three_gate_claim;
  assert(Array.isArray(firstThreeCopy), 'Scale proof authority copy audit missing first-three claim');
  assertSameSet(firstThreeCopy.map((item) => item.paragraph), paragraphs, 'Scale proof authority copy paragraphs');
  for (const item of firstThreeCopy) {
    assert(item.gate_claim === true, `${item.paragraph} must be first-three gate claim in Scale proof`);
    assert(item.forbidden_authority_copy_absent === true, `${item.paragraph} forbidden authority copy must be absent`);
  }
  const hygiene = proof.authority_copy_audit.same_copy_hygiene_not_gate_claim || [];
  assertSameSet(hygiene.map((item) => item.paragraph), ['1.1.4'], 'Scale proof same-copy hygiene paragraphs');
  assert(hygiene[0].gate_claim === false, '1.1.4 same-copy hygiene must not be gate claim');
}

function checkReviewPacket() {
  const packet = readJson(reviewPacketPath);
  assert(packet.schema_version === 1, 'review packet schema_version must be 1');
  assert(packet.sprint_id === WAVE_ID, `review packet sprint_id must be ${WAVE_ID}`);
  assert(packet.route === 'READY_FOR_HUMAN_REVIEW', 'review packet route must be READY_FOR_HUMAN_REVIEW');
  assert(packet.human_decision_required === true, 'review packet must require human decision');
  assert(packet.auto_merge_allowed_after_ci === false, 'review packet must not allow auto-merge');
  assertFalseAuthority(packet.authority_claims, 'reviewPacket.authority_claims');
  assert(packet.authority_claims.generated_lesson_output_changed === false, 'review packet must record no generated lesson output');
  assert(packet.authority_claims.source_data_changed === false, 'review packet must record no source-data change');
  assert(packet.authority_claims.engine_behavior_changed === false, 'review packet must record no engine behavior change');
  assert(packet.core_requirement_checklist && typeof packet.core_requirement_checklist === 'object', 'review packet checklist missing');
  for (const [key, value] of Object.entries(packet.core_requirement_checklist)) {
    assert(value === true, `review packet checklist item must be true: ${key}`);
  }
  assert(Array.isArray(packet.carried_issues), 'review packet carried_issues must be an array');
  for (const issue of packet.carried_issues) {
    assert(issue.classification, `${issue.issue_id || '<issue>'} missing classification`);
    assert(issue.blocks, `${issue.issue_id || '<issue>'} missing blocks`);
    assert(issue.does_not_block, `${issue.issue_id || '<issue>'} missing does_not_block`);
    assert(issue.proof_required_to_close, `${issue.issue_id || '<issue>'} missing proof_required_to_close`);
  }
}

function checkProofJson() {
  const proof = readJson('reports/json/y1-golden-rollout-wave-1-proof.json');
  assert(proof.schema_version === 1, 'wave proof schema_version must be 1');
  assert(proof.sprint_id === WAVE_ID, `wave proof sprint_id must be ${WAVE_ID}`);
  assert(proof.status === 'ready_for_human_review', 'wave proof status must be ready_for_human_review');
  assertSameSet(proof.paragraphs || [], paragraphs, 'wave proof paragraphs');
  assertSameSet(proof.surface_ids || [], expectedSurfaceIds, 'wave proof surface ids');
  assert(proof.workflow_availability && proof.workflow_availability.first_three_rendered_product_path_proof_current === true, 'wave proof must record current rendered product path proof');
  assert(proof.workflow_availability.all_skill_map_route_hrefs_resolve === true, 'wave proof must record resolved skill-map hrefs');
  assert(proof.boundaries && proof.boundaries.not_year1_complete === true, 'wave proof must record not_year1_complete boundary');
  assert(proof.boundaries.scale_gate_1_authorized === false, 'wave proof must keep Scale Gate 1 unauthorized');
  assertFalseAuthority(proof.authority, 'waveProof.authority');
}

function checkWiring() {
  const packageJson = readJson('package.json');
  assert(
    packageJson.scripts['check:y1-golden-rollout-wave-1'] ===
      'node build-scripts/sprints/check-y1-golden-rollout-wave-1.js',
    'package.json must define check:y1-golden-rollout-wave-1'
  );
  const ciWorkflow = read('.github/workflows/platform-ci.yml');
  assert(ciWorkflow.includes('npm run check:y1-golden-rollout-wave-1'), 'platform CI must run check:y1-golden-rollout-wave-1');
  const referenceRoadmap = read('references/reference-team-roadmap.md');
  assert(referenceRoadmap.includes(WAVE_ID), 'reference roadmap must include wave row');
  const goldenRoadmap = read('docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md');
  assert(goldenRoadmap.includes(WAVE_ID), 'Golden rollout roadmap must mention wave');
}

const wave = checkWaveManifest();
checkSurfaceManifest(wave);
checkScaleProof();
checkProofJson();
checkReviewPacket();
checkWiring();

gitStatusClean(
  ROOT,
  [
    'source-data/book-1/exit-ticket',
    'engines',
    'references/machine',
    'references/external',
    'references/authored/course-target-exercises.json',
    'references/data/exam-ingestion/answer-skill-candidates.json',
  ],
  'forbidden platform source/engine/protected surfaces'
);
gitStatusClean(LESSON_ROOT, ['Boek 1 - Grondslagen, vraag en aanbod'], 'generated Book 1 lesson output');

console.log('OK Y1-GOLDEN-ROLLOUT-WAVE-1 first-three workflow availability guard');
