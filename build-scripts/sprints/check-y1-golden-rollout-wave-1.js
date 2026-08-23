#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen');
const BOOK_REL = 'Boek 1 - Grondslagen, vraag en aanbod';
const BOOK_ROOT = path.join(LESSON_ROOT, BOOK_REL);
const CHAPTER = '1.1 Hoofdstuk Economisch denken en rekenen';
const WAVE_ID = 'Y1-GOLDEN-ROLLOUT-WAVE-1';

const PATHS = {
  wave: 'references/data/exercises/y1-golden-rollout-wave-1.json',
  surfaceManifest: 'references/data/exercise-surface-manifest.json',
  scaleProof: 'reports/json/scale-proof-3p-readiness-product-path-proof-1-proof.json',
  scaleManifest: 'reports/sprints/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1-screenshots/manifest.json',
  scaleManifestMd: 'reports/sprints/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1-screenshot-manifest.md',
  scaleRouteInventory: 'reports/sprints/SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1-route-inventory.md',
  proof: 'reports/json/y1-golden-rollout-wave-1-proof.json',
  deltaProof: 'reports/json/y1-golden-rollout-wave-1-rendered-delta-proof.json',
  packet: 'reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/review-packet.json',
  bundleUrls: 'reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/bundle-urls.md',
  goldenRoadmap: 'docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md',
  referenceRoadmap: 'references/reference-team-roadmap.md',
};

const CAPTURE_PLATFORM_SHA = '5e3fa0d972992cf11568c4f86bf4f5f09c0f11c7';
const CAPTURE_LESSON_SHA = '071a465a03e287bc5768d88aabbec3e63b15ee09';
const OLD_CI_PLATFORM_SHA = '571d435a172240524ed96394a41682ef003bfcad';
const OLD_CI_LESSON_SHA = 'ba08b9c2e033a877c0d1b57952055ce697912a22';

const PARAGRAPHS = ['1.1.1', '1.1.2', '1.1.3'];
const EXPECTED_SURFACES = [
  '1.1.1-korte-check',
  '1.1.1-exit-ticket',
  '1.1.2-korte-check',
  '1.1.2-exit-ticket',
  '1.1.3-korte-check',
  '1.1.3-exit-ticket',
];

const REQUIRED_SCALE_FLAGS = [
  'all_required_route_families_present',
  'all_landing_links_resolve',
  'exit_tickets_target_readiness_approved',
  'short_checks_advisory_only',
  'all_first_three_check_exit_surfaces_golden',
  'start_learn_oefen_skill_practice_captured',
  'rendered_desktop_mobile_dark_coverage',
  'completed_feedback_states_captured',
  'advisory_feedback_states_captured',
  'a96_dedicated_rendered_states_ready',
  'a96_calculation_answer_form_refinement_ready',
  'target_completion_language_held_in_completed_exit_routes',
  'no_broad_authority_terms_in_captures',
  'first_three_landing_authority_copy_neutral',
  'same_copy_hygiene_114_neutral_not_gate_claim',
];

const HELD_AUTHORITY_KEYS = [
  'actual_rollout_or_adoption_authorized',
  'automatic_repository_wide_migration_authorized',
  'product_route_adoption_authorized',
  'broad_product_use_authorized',
  'product_use_authorized',
  'student_product_use_authorized',
  'completion_language_authorized',
  'diagnostics_authorized',
  'mastery_or_sequencing_authorized',
  'adaptive_routing_authorized',
  'summative_use_authorized',
  'pv_authorized',
];

const PLATFORM_RENDER_INPUTS = [
  ...EXPECTED_SURFACES.map((id) => `source-data/book-1/exit-ticket/${id}.json`),
  'engines/golden-ticket-layout.css',
  'engines/golden-ticket-layout.js',
  'engines/golden-ticket-graph.js',
  'build-scripts/platform/build-exit-ticket-shells.js',
  'build-scripts/platform/build-landing-page.js',
  'references/ui/golden-exercise-checker-fixtures.json',
  PATHS.scaleProof,
  PATHS.scaleManifest,
  PATHS.scaleManifestMd,
  PATHS.scaleRouteInventory,
  'build-scripts/sprints/capture-scale-proof-3p-readiness-product-path-proof-1.js',
  'build-scripts/sprints/check-scale-proof-3p-readiness-product-path-proof-1.js',
];

const EVIDENCE_TAIL_EXACT = [
  'AGENT_GITHUB_ENTRY.md',
  'RESEARCH_AGENT_MAP.md',
  'RESEARCH_AGENT_MAP_REFERENCES.md',
  'references/data/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1.result.json',
  PATHS.proof,
  PATHS.deltaProof,
  'reports/url-index.md',
  'reports/github-agent-index-platform.json',
  'reports/github-agent-index-platform.md',
  'reports/github-agent-index-lessen.json',
  'reports/github-agent-index-lessen.md',
  'reports/internal-dashboard/dashboard-data.json',
  'reports/internal-dashboard/index.html',
];

const EVIDENCE_TAIL_PREFIXES = [
  'reports/review-gates/GATE-Y1-GOLDEN-ROLLOUT-WAVE-1/',
  'reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-',
];

class CheckError extends Error {}

function check(condition, message) {
  if (!condition) throw new CheckError(message);
}

function normalizePath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/\/+$/, '');
}

function uniqueSorted(values) {
  return [...new Set(values.map(normalizePath).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function sameSet(actual, expected, label) {
  const left = uniqueSorted(actual);
  const right = uniqueSorted(expected);
  check(
    left.length === right.length && left.every((item, index) => item === right[index]),
    `${label} mismatch: expected ${right.join(', ')}, got ${left.join(', ')}`
  );
}

function filePath(root, relativePath) {
  return path.resolve(root, normalizePath(relativePath));
}

function readText(relativePath, root = ROOT) {
  const target = filePath(root, relativePath);
  check(fs.existsSync(target), `missing file: ${normalizePath(relativePath)}`);
  return fs.readFileSync(target, 'utf8');
}

function readJson(relativePath, root = ROOT) {
  try {
    return JSON.parse(readText(relativePath, root));
  } catch (error) {
    if (error instanceof CheckError) throw error;
    throw new CheckError(`invalid JSON in ${normalizePath(relativePath)}: ${error.message}`);
  }
}

function runGit(args, cwd) {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 30,
  });
  if (result.status !== 0) {
    const detail = String(result.stderr || result.stdout || '').trim();
    throw new CheckError(`git ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return String(result.stdout || '').trim();
}

function resolveRef(ref, cwd) {
  check(ref, 'missing Git ref');
  return runGit(['rev-parse', '--verify', `${ref}^{commit}`], cwd);
}

function gitBlob(ref, relativePath, cwd) {
  const normalized = normalizePath(relativePath);
  const result = spawnSync('git', ['rev-parse', `${ref}:${normalized}`], {
    cwd,
    encoding: 'utf8',
  });
  if (result.status !== 0) return null;
  return String(result.stdout || '').trim() || null;
}

function gitShow(ref, relativePath, cwd) {
  const normalized = normalizePath(relativePath);
  const result = spawnSync('git', ['show', `${ref}:${normalized}`], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });
  if (result.status !== 0) return null;
  return String(result.stdout || '');
}

function parseNameStatus(output) {
  if (!String(output || '').trim()) return [];
  return String(output)
    .trim()
    .split(/\r?\n/)
    .map((line) => {
      const fields = line.split('\t');
      const status = fields[0];
      if (/^[RC]\d+$/.test(status)) {
        check(fields.length >= 3, `invalid rename/copy status line: ${line}`);
        return { status, old_path: normalizePath(fields[1]), path: normalizePath(fields[2]) };
      }
      check(fields.length >= 2, `invalid name-status line: ${line}`);
      return { status, path: normalizePath(fields[1]) };
    });
}

function changedEntries(baseRef, headRef, cwd) {
  const baseSha = resolveRef(baseRef, cwd);
  const headSha = resolveRef(headRef, cwd);
  const output = runGit(['diff', '--name-status', '-M', `${baseSha}..${headSha}`], cwd);
  return { base_sha: baseSha, head_sha: headSha, entries: parseNameStatus(output) };
}

function entryPaths(entry) {
  return uniqueSorted([entry.old_path, entry.path]);
}

function pathMatchesPolicy(relativePath, policy) {
  const normalized = normalizePath(relativePath);
  return (policy.allowed_exact || []).map(normalizePath).includes(normalized)
    || (policy.allowed_prefixes || []).map(normalizePath).some((prefix) => normalized.startsWith(prefix));
}

function pathIsForbidden(relativePath, policy) {
  const normalized = normalizePath(relativePath);
  return (policy.forbidden_exact || []).map(normalizePath).includes(normalized)
    || (policy.forbidden_prefixes || []).map(normalizePath).some((prefix) => normalized.startsWith(prefix));
}

function scopeTriggered(entries, policy, scopeMode) {
  if (scopeMode === 'required') return true;
  check(scopeMode === 'auto', `unsupported scope mode: ${scopeMode}`);
  const paths = entries.flatMap(entryPaths);
  return paths.some((item) => (policy.trigger_exact || []).map(normalizePath).includes(item)
    || (policy.trigger_prefixes || []).map(normalizePath).some((prefix) => item.startsWith(prefix)));
}

function validateChangedEntries(entries, policy, scopeMode) {
  const triggered = scopeTriggered(entries, policy, scopeMode);
  if (!triggered) return { triggered: false, changed_paths: uniqueSorted(entries.flatMap(entryPaths)) };

  for (const entry of entries) {
    check(/^(A|M|D|R\d+|C\d+)$/.test(entry.status), `unsupported Git status ${entry.status}`);
    for (const changedPath of entryPaths(entry)) {
      check(!pathIsForbidden(changedPath, policy), `forbidden committed path changed: ${changedPath}`);
      check(pathMatchesPolicy(changedPath, policy), `unexpected committed path changed: ${changedPath}`);
    }
  }
  return { triggered: true, changed_paths: uniqueSorted(entries.flatMap(entryPaths)) };
}

function validateEventRefs(options, resolved, cwd = ROOT) {
  const mode = options.eventMode;
  check(['pull_request', 'main_push', 'manual'].includes(mode), `unsupported event mode: ${mode}`);
  if (mode === 'manual') return;

  const expectedBase = options.eventBaseSha || process.env.Y1_GOLDEN_EVENT_BASE_SHA;
  const expectedHead = options.eventHeadSha || process.env.Y1_GOLDEN_EVENT_HEAD_SHA;
  check(expectedBase && expectedHead, `${mode} requires exact event base/head SHAs`);
  check(resolveRef(expectedBase, cwd) === resolved.base_sha, `${mode} base does not match exact event base SHA`);
  check(resolveRef(expectedHead, cwd) === resolved.head_sha, `${mode} head does not match exact event head SHA`);
  if (mode === 'pull_request') {
    const synthetic = process.env.Y1_GOLDEN_SYNTHETIC_MERGE_SHA;
    if (synthetic) {
      check(resolveRef(synthetic, cwd) !== resolved.head_sha, 'pull-request payload head must not be the synthetic merge SHA');
    }
  }
  const ancestor = spawnSync('git', ['merge-base', '--is-ancestor', resolved.base_sha, resolved.head_sha], {
    cwd,
    encoding: 'utf8',
  });
  check(ancestor.status === 0, `${mode} base must be an ancestor of head`);
}

function readGeneratedData(relativePath, lessonRoot = LESSON_ROOT) {
  const code = readText(relativePath, lessonRoot);
  const sandbox = {};
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  try {
    vm.runInNewContext(code, sandbox, { timeout: 1000, filename: relativePath });
  } catch (error) {
    throw new CheckError(`cannot evaluate generated data ${relativePath}: ${error.message}`);
  }
  check(sandbox.EXIT_TICKET_DATA && typeof sandbox.EXIT_TICKET_DATA === 'object', `generated data missing EXIT_TICKET_DATA: ${relativePath}`);
  return sandbox.EXIT_TICKET_DATA;
}

function lessonRepoPath(relativePath) {
  return path.posix.join(BOOK_REL, normalizePath(relativePath));
}

function paragraphDirectory(source, lessonRoot = LESSON_ROOT) {
  return path.join(lessonRoot, BOOK_REL, CHAPTER, `${source.parNr} ${source.parName}`);
}

function routeTarget(source, href, lessonRoot = LESSON_ROOT) {
  const clean = String(href || '').split('#')[0];
  check(clean, `${source.parNr} route href is empty`);
  check(!/^[a-z]+:/i.test(clean) && !clean.startsWith('//'), `${source.parNr} route href must be local: ${href}`);
  const paragraphDir = paragraphDirectory(source, lessonRoot);
  const target = path.resolve(paragraphDir, decodeURIComponent(clean));
  const bookRoot = path.resolve(lessonRoot, BOOK_REL);
  const prefix = `${bookRoot}${path.sep}`.toLowerCase();
  check(target.toLowerCase().startsWith(prefix), `${source.parNr} route href escapes Book 1 root: ${href}`);
  check(fs.existsSync(target), `${source.parNr} route href does not resolve: ${href}`);
  return target;
}

function expectedPagePath(source, surfaceId, lessonRoot = LESSON_ROOT) {
  const suffix = surfaceId.endsWith('-korte-check') ? 'korte-check' : 'exit-ticket';
  return path.join(paragraphDirectory(source, lessonRoot), `${source.parNr} ${source.parName} \u2013 ${suffix}.html`);
}

function assertHeldAuthorities(authority, label) {
  for (const key of HELD_AUTHORITY_KEYS) {
    check(authority && authority[key] === false, `${label}.${key} must be false`);
  }
}

function validateSurfaceContract(surface, source, generated) {
  check(surface.current === true, `${surface.id} must be current`);
  check(surface.legacy_unsuffixed_allowed === false, `${surface.id} must reject legacy unsuffixed paths`);
  check(surface.completion_language_eligible === false, `${surface.id} completion language must remain held`);
  check(surface.source_path && surface.generated_path, `${surface.id} source/generated paths are required`);
  check(source.parNr === surface.paragraph, `${surface.id} source paragraph mismatch`);
  check(generated.parNr === source.parNr, `${surface.id} generated paragraph mismatch`);
  check(source.surface === generated.surface, `${surface.id} source/generated surface mismatch`);
  check(source.layout?.framework === 'golden_exercise_workbench', `${surface.id} source must use Golden Workbench`);
  check(generated.layout?.framework === 'golden_exercise_workbench', `${surface.id} generated data must use Golden Workbench`);
  check(source.targetEquivalent?.completionLanguageEligible === false, `${surface.id} source completion language must be false`);
  check(generated.targetEquivalent?.completionLanguageEligible === false, `${surface.id} generated completion language must be false`);

  if (surface.surface === 'advisory_short_check') {
    check(source.surface === 'advisory_short_check', `${surface.id} must be advisory_short_check`);
    check(source.targetEquivalent?.candidate === false, `${surface.id} advisory candidate must be false`);
    check(source.targetEquivalent?.gateApproved === false, `${surface.id} advisory gateApproved must be false`);
    check(source.metadataAlignment?.targetReadinessEvidence === false, `${surface.id} advisory target readiness must be false`);
  } else {
    check(surface.surface === 'target_equivalent_exit_ticket', `${surface.id} unsupported surface type`);
    check(source.targetEquivalent?.candidate === true, `${surface.id} exit candidate must be true`);
    check(source.targetEquivalent?.gateApproved === true, `${surface.id} exit gateApproved must be true`);
    check(source.metadataAlignment?.targetReadinessEvidence === true, `${surface.id} exit target readiness must be true`);
  }

  return { source, generated };
}

function containsLegacyAsset(html) {
  return /(?:^|\/)(?:task-shell|exit-ticket|skill-map-route)\.(?:css|js)(?:["'?#]|$)/m.test(html);
}

function validateSurfaceState(surface, options = {}) {
  const platformRoot = options.platformRoot || ROOT;
  const lessonRoot = options.lessonRoot || LESSON_ROOT;
  const source = readJson(surface.source_path, platformRoot);
  const generated = readGeneratedData(path.posix.join(BOOK_REL, surface.generated_path), lessonRoot);
  validateSurfaceContract(surface, source, generated);

  for (const route of source.skillMap?.routes || []) routeTarget(source, route.href, lessonRoot);

  const pagePath = expectedPagePath(source, surface.id, lessonRoot);
  check(fs.existsSync(pagePath), `${surface.id} generated page is missing`);
  const html = fs.readFileSync(pagePath, 'utf8');
  check(/data-golden-ticket-root/.test(html), `${surface.id} page missing Golden root`);
  check(!/id=["']exit-ticket-app["']/.test(html), `${surface.id} page contains legacy exit-ticket root`);
  check(!containsLegacyAsset(html), `${surface.id} page loads legacy/hybrid assets`);
}

function validateWaveAndSurfaces(options = {}) {
  const wave = options.wave || readJson(PATHS.wave);
  const manifest = options.manifest || readJson(PATHS.surfaceManifest);

  check(wave.schema_version === 2, 'wave schema_version must be 2');
  check(wave.wave_id === WAVE_ID, `wave_id must be ${WAVE_ID}`);
  check(['draft_unbound', 'ready_for_human_review'].includes(wave.status), 'wave status is invalid');
  sameSet(wave.paragraphs || [], PARAGRAPHS, 'wave paragraphs');
  sameSet(wave.surface_ids || [], EXPECTED_SURFACES, 'wave surface ids');
  check(wave.scale_gate_1?.decision === 'PASS_CONTROLLED_ROLLOUT', 'wave must record PASS_CONTROLLED_ROLLOUT');
  check(wave.scale_gate_1?.controlled_wave_eligibility_authorized === true, 'controlled wave eligibility must be true');
  check(wave.scale_gate_1?.automatic_repository_wide_migration_authorized === false, 'automatic repository-wide migration must remain held');
  assertHeldAuthorities(wave.authority, 'wave.authority');
  check(wave.authority?.generated_lesson_output_changed === false, 'wave must record no lesson output changes');
  check(wave.authority?.source_data_changed === false, 'wave must record no source-data changes');
  check(wave.authority?.engine_behavior_changed === false, 'wave must record no engine changes');
  check(wave.owner_decision?.platform_pr === 148 && wave.owner_decision?.comment_id === 4807419611, 'wave owner decision binding mismatch');

  const firstThree = (manifest.surfaces || []).filter((item) => item.scope === 'first_three_product_proof');
  sameSet(firstThree.map((item) => item.id), EXPECTED_SURFACES, 'manifest first-three surfaces');
  sameSet(firstThree.map((item) => item.id), wave.surface_ids, 'wave/manifest surfaces');
  const hygiene = (manifest.surfaces || []).filter((item) => item.scope === 'same_copy_hygiene');
  sameSet(hygiene.map((item) => item.paragraph), ['1.1.4'], 'same-copy hygiene scope');
  check(hygiene.every((item) => item.gate_claim === false), 'same-copy hygiene must not be a gate claim');

  if (!options.skipFiles) firstThree.forEach(validateSurfaceState);
  return { wave, manifest, firstThree };
}

function validateScaleProof(
  proof = readJson(PATHS.scaleProof),
  expectedSprintId = 'SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1'
) {
  check(proof.sprint_id === expectedSprintId, `rendered proof sprint mismatch: expected ${expectedSprintId}`);
  for (const flag of REQUIRED_SCALE_FLAGS) {
    check(proof.proof?.[flag] === true, `Scale proof flag must be true: ${flag}`);
  }
  check(proof.proof?.authority_copy_issue_count === 0, 'Scale proof authority copy issues must be zero');
  sameSet((proof.route_inventory?.paragraphs || []).map((item) => item.paragraph), PARAGRAPHS, 'Scale proof paragraphs');
  for (const paragraph of PARAGRAPHS) {
    const route = proof.route_inventory.paragraphs.find((item) => item.paragraph === paragraph);
    check(route.all_required_families_present === true, `${paragraph} route families are incomplete`);
    check(Array.isArray(route.link_resolution?.unresolved) && route.link_resolution.unresolved.length === 0, `${paragraph} route links are unresolved`);
    const data = proof.surface_data?.[paragraph];
    check(data?.short_check?.rendered_shell === 'golden_exercise_workbench', `${paragraph} short check is not Golden`);
    check(data?.exit_ticket?.rendered_shell === 'golden_exercise_workbench', `${paragraph} exit ticket is not Golden`);
    check(data.short_check.links_resolve === true && data.exit_ticket.links_resolve === true, `${paragraph} surface links do not resolve`);
  }
  validateScreenshotIntegrity(proof);
  return proof;
}

function pngDimensions(file) {
  const buffer = fs.readFileSync(file);
  check(buffer.length >= 24 && buffer.subarray(1, 4).toString('ascii') === 'PNG', `invalid PNG: ${normalizePath(path.relative(ROOT, file))}`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function validateScreenshotIntegrity(proof) {
  const screenshots = proof.screenshots || [];
  check(screenshots.length === 46, `historical Scale Proof must retain 46 screenshot cases, got ${screenshots.length}`);
  const manifest = readJson(PATHS.scaleManifest);
  const manifestScreenshots = manifest.screenshots || [];
  sameSet(screenshots.map((item) => item.id), manifestScreenshots.map((item) => item.id), 'Scale Proof screenshot/manifest ids');
  const manifestById = new Map(manifestScreenshots.map((item) => [item.id, item]));
  const manifestMarkdown = readText(PATHS.scaleManifestMd);

  for (const item of screenshots) {
    const relativePath = normalizePath(item.screenshot?.file);
    check(relativePath, `Scale Proof screenshot file missing for ${item.id}`);
    const target = filePath(ROOT, relativePath);
    check(fs.existsSync(target), `Scale Proof screenshot missing: ${relativePath}`);
    const stats = fs.statSync(target);
    check(stats.size === item.screenshot.bytes, `Scale Proof screenshot byte mismatch: ${relativePath}`);
    const dimensions = pngDimensions(target);
    check(dimensions.width === item.screenshot.dimensions?.width && dimensions.height === item.screenshot.dimensions?.height, `Scale Proof screenshot dimension mismatch: ${relativePath}`);
    const manifestItem = manifestById.get(item.id);
    check(manifestItem?.screenshot?.file === item.screenshot.file, `Scale Proof manifest file mismatch: ${item.id}`);
    check(manifestItem?.screenshot?.bytes === item.screenshot.bytes, `Scale Proof manifest byte mismatch: ${item.id}`);
    check(manifestMarkdown.includes(relativePath), `Scale Proof Markdown manifest missing: ${relativePath}`);
  }
  return true;
}

function resolveLocalHtmlReference(value, pagePath) {
  const clean = String(value || '').split('#')[0].split('?')[0];
  if (!clean || clean.startsWith('#') || /^[a-z]+:/i.test(clean) || clean.startsWith('//')) return null;
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(normalizePath(pagePath)), decodeURIComponent(clean)));
  if (resolved.startsWith('../') || path.posix.isAbsolute(resolved)) return null;
  return resolved;
}

function classifyLocalHtmlReferences(html, pagePath) {
  const renderedInputs = [];
  const navigationTargets = [];
  const tagPattern = /<([a-z][\w:-]*)\b([^>]*)>/gi;
  let tagMatch;
  while ((tagMatch = tagPattern.exec(html))) {
    const tagName = tagMatch[1].toLowerCase();
    const attributes = tagMatch[2];
    const attributePattern = /\b(src|href)\s*=\s*["']([^"']+)["']/gi;
    let attributeMatch;
    while ((attributeMatch = attributePattern.exec(attributes))) {
      const resolved = resolveLocalHtmlReference(attributeMatch[2], pagePath);
      if (!resolved) continue;
      if (attributeMatch[1].toLowerCase() === 'src' || tagName === 'link') renderedInputs.push(resolved);
      else navigationTargets.push(resolved);
    }
  }
  return {
    rendered_inputs: uniqueSorted(renderedInputs),
    navigation_targets: uniqueSorted(navigationTargets),
  };
}

function extractLocalReferences(html, pagePath) {
  const classified = classifyLocalHtmlReferences(html, pagePath);
  return uniqueSorted([...classified.rendered_inputs, ...classified.navigation_targets]);
}

function lessonCaptures(scaleProof) {
  return scaleProof.screenshots || scaleProof.captures || [];
}

function lessonCapturePaths(scaleProof) {
  return uniqueSorted(lessonCaptures(scaleProof).map((capture) => lessonRepoPath(capture.path)));
}

function deriveLessonDependencies(scaleProof, baselineRef, currentRef) {
  const captures = lessonCapturePaths(scaleProof);
  const equal = new Set(captures);
  const existenceOnly = new Set();

  for (const capture of lessonCaptures(scaleProof)) {
    const capturePath = lessonRepoPath(capture.path);
    for (const asset of capture.inspection?.loaded_assets || []) {
      if (!asset || /^[a-z]+:/i.test(asset) || asset.startsWith('//')) continue;
      const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(capturePath), decodeURIComponent(asset)));
      if (!resolved.startsWith('../') && !path.posix.isAbsolute(resolved)) equal.add(resolved);
    }
  }

  for (const pagePath of captures) {
    const baselineHtml = gitShow(baselineRef, pagePath, LESSON_ROOT);
    const currentHtml = gitShow(currentRef, pagePath, LESSON_ROOT);
    check(baselineHtml !== null && currentHtml !== null, `capture page missing from lesson history: ${pagePath}`);
    const baselineRefs = classifyLocalHtmlReferences(baselineHtml, pagePath);
    const currentRefs = classifyLocalHtmlReferences(currentHtml, pagePath);
    for (const dependency of [...baselineRefs.rendered_inputs, ...currentRefs.rendered_inputs]) {
      equal.add(dependency);
    }
    for (const target of [...baselineRefs.navigation_targets, ...currentRefs.navigation_targets]) existenceOnly.add(target);
  }

  for (const route of scaleProof.route_inventory?.paragraphs || []) {
    const landing = lessonRepoPath(route.landing);
    equal.add(landing);
    const baselineHtml = gitShow(baselineRef, landing, LESSON_ROOT);
    const currentHtml = gitShow(currentRef, landing, LESSON_ROOT);
    check(baselineHtml !== null && currentHtml !== null, `landing page missing from lesson history: ${landing}`);
    const baselineRefs = classifyLocalHtmlReferences(baselineHtml, landing);
    const currentRefs = classifyLocalHtmlReferences(currentHtml, landing);
    for (const target of [...baselineRefs.navigation_targets, ...currentRefs.navigation_targets]) {
      existenceOnly.add(target);
    }
  }

  for (const item of equal) existenceOnly.delete(item);
  return { equal_paths: uniqueSorted([...equal]), existence_only_paths: uniqueSorted([...existenceOnly]) };
}

function platformEvidencePaths(scaleProof) {
  const screenshots = lessonCaptures(scaleProof).map((capture) => capture.screenshot?.file).filter(Boolean);
  return uniqueSorted([...PLATFORM_RENDER_INPUTS, ...screenshots]);
}

function attestEqualPaths(paths, refs, cwd, label) {
  return paths.map((relativePath) => {
    const blobs = {};
    for (const [name, ref] of Object.entries(refs)) {
      blobs[name] = gitBlob(ref, relativePath, cwd);
    }
    const values = Object.values(blobs);
    const missingAt = Object.entries(blobs).filter(([, blob]) => !blob).map(([name]) => name);
    const equal = missingAt.length === 0 && values.every((value) => value === values[0]);
    return {
      path: normalizePath(relativePath),
      blobs,
      comparison: 'blob_equality',
      status: equal ? 'equal' : missingAt.length > 0 ? 'missing' : 'changed',
      missing_at: missingAt,
      label,
    };
  });
}

function attestExistencePaths(paths, refs, cwd, label) {
  return paths.map((relativePath) => {
    const blobs = {};
    for (const [name, ref] of Object.entries(refs)) {
      blobs[name] = gitBlob(ref, relativePath, cwd);
    }
    const missingAt = Object.entries(blobs).filter(([, blob]) => !blob).map(([name]) => name);
    return {
      path: normalizePath(relativePath),
      blobs,
      comparison: 'existence_only',
      status: missingAt.length === 0 ? 'present' : 'missing',
      missing_at: missingAt,
      label,
    };
  });
}

function buildDeltaProof(options = {}) {
  const platformCurrent = resolveRef(options.platformHead || 'HEAD', ROOT);
  const lessonCurrent = resolveRef(options.lessonHead || 'origin/main', LESSON_ROOT);
  const platformRefs = {
    capture_payload: resolveRef(CAPTURE_PLATFORM_SHA, ROOT),
    old_pr_ci: resolveRef(OLD_CI_PLATFORM_SHA, ROOT),
    renewal_payload: platformCurrent,
  };
  const lessonRefs = {
    capture_payload: resolveRef(CAPTURE_LESSON_SHA, LESSON_ROOT),
    old_pr_ci: resolveRef(OLD_CI_LESSON_SHA, LESSON_ROOT),
    renewal_snapshot: lessonCurrent,
  };
  const scaleProof = validateScaleProof();
  const lessonDependencies = deriveLessonDependencies(scaleProof, lessonRefs.capture_payload, lessonRefs.renewal_snapshot);
  const platformPaths = platformEvidencePaths(scaleProof);
  const platform = attestEqualPaths(platformPaths, platformRefs, ROOT, 'platform rendered input');
  const lesson = attestEqualPaths(lessonDependencies.equal_paths, lessonRefs, LESSON_ROOT, 'lesson rendered input');
  const lessonExistence = attestExistencePaths(lessonDependencies.existence_only_paths, lessonRefs, LESSON_ROOT, 'lesson route target');
  const changedOrMissing = [
    ...platform.filter((item) => item.status !== 'equal'),
    ...lesson.filter((item) => item.status !== 'equal'),
    ...lessonExistence.filter((item) => item.status !== 'present'),
  ];
  const historicalArtifactPaths = uniqueSorted([
    PATHS.scaleProof,
    PATHS.scaleManifest,
    PATHS.scaleManifestMd,
    PATHS.scaleRouteInventory,
    ...lessonCaptures(scaleProof).map((capture) => capture.screenshot?.file).filter(Boolean),
  ]);
  const historicalArtifacts = platform.filter((item) => historicalArtifactPaths.includes(item.path));
  check(historicalArtifacts.length === historicalArtifactPaths.length, 'historical Scale Proof artifact inventory is incomplete');

  return {
    schema_version: 1,
    sprint_id: WAVE_ID,
    generated: new Date().toISOString(),
    purpose: 'commit-bound rendered proof reuse attestation',
    commit_chain: {
      platform: platformRefs,
      lesson: lessonRefs,
    },
    dependency_discovery: {
      capture_pages_from_scale_proof: true,
      local_browser_assets_from_capture_inspection: true,
      html_src_require_blob_equality: true,
      html_link_href_require_blob_equality: true,
      anchor_href_require_existence_only: true,
      navigation_destination_content_outside_screenshot_claim: true,
      landing_route_targets_exist_at_all_commits: true,
      platform_source_generator_runtime_and_proof_inputs_explicit: true,
      proof_defined_list_accepted_without_cross_check: false,
    },
    platform_equal_paths: platform,
    lesson_equal_paths: lesson,
    lesson_existence_only_paths: lessonExistence,
    summary: {
      platform_equal_path_count: platform.length,
      lesson_equal_path_count: lesson.length,
      lesson_existence_only_path_count: lessonExistence.length,
      changed_or_missing_input_count: changedOrMissing.length,
      changed_or_missing_paths: changedOrMissing.map((item) => item.path),
      screenshots_reusable: changedOrMissing.length === 0,
      recapture_required: changedOrMissing.length > 0,
      historical_artifact_count: historicalArtifacts.length,
      historical_artifacts_blob_equal: historicalArtifacts.every((item) => item.status === 'equal'),
      screenshot_manifest_integrity_passed: true,
    },
  };
}

function validateDeltaProof(recorded, recomputed) {
  check(recorded.schema_version === 1 && recorded.sprint_id === WAVE_ID, 'delta proof identity mismatch');
  check(JSON.stringify(recorded.commit_chain) === JSON.stringify(recomputed.commit_chain), 'delta proof commit chain is stale');
  check(JSON.stringify(recorded.dependency_discovery) === JSON.stringify(recomputed.dependency_discovery), 'delta proof dependency classification is stale');
  check(recorded.summary?.screenshots_reusable === recomputed.summary.screenshots_reusable, 'delta proof reuse decision is stale');
  check(recorded.summary?.changed_or_missing_input_count === recomputed.summary.changed_or_missing_input_count, 'delta proof changed/missing count is stale');
  check(recorded.summary?.historical_artifact_count === recomputed.summary.historical_artifact_count, 'delta proof historical artifact count is stale');
  check(recorded.summary?.historical_artifacts_blob_equal === true && recomputed.summary.historical_artifacts_blob_equal === true, 'historical Scale Proof artifacts must remain blob-equal');
  check(recorded.summary?.screenshot_manifest_integrity_passed === true, 'delta proof screenshot/manifest integrity is missing');
  sameSet(recorded.summary?.changed_or_missing_paths || [], recomputed.summary.changed_or_missing_paths || [], 'delta proof changed/missing paths');
  check(JSON.stringify(recorded.summary) === JSON.stringify(recomputed.summary), 'delta proof complete summary is stale');
  for (const section of ['platform_equal_paths', 'lesson_equal_paths', 'lesson_existence_only_paths']) {
    sameSet((recorded[section] || []).map((item) => item.path), (recomputed[section] || []).map((item) => item.path), `delta proof ${section}`);
    check(JSON.stringify(recorded[section]) === JSON.stringify(recomputed[section]), `delta proof ${section} blob evidence is stale`);
  }
  return true;
}

function evidenceTailPathAllowed(relativePath) {
  const normalized = normalizePath(relativePath);
  return EVIDENCE_TAIL_EXACT.includes(normalized)
    || EVIDENCE_TAIL_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

function validateEvidenceTail(payloadRef, exactHeadRef, repoRoot = ROOT) {
  const delta = changedEntries(payloadRef, exactHeadRef, repoRoot);
  for (const entry of delta.entries) {
    check(/^(A|M)$/.test(entry.status), `evidence tail may only add or modify files: ${entry.status} ${entry.path}`);
    for (const relativePath of entryPaths(entry)) {
      check(evidenceTailPathAllowed(relativePath), `substantive path changed after reviewed payload: ${relativePath}`);
    }
  }
  return delta;
}

function validateExactHeadDelta(recorded, exactPlatformHead, exactLessonHead) {
  const payloadPlatform = resolveRef(recorded.commit_chain?.platform?.renewal_payload, ROOT);
  const snapshotLesson = resolveRef(recorded.commit_chain?.lesson?.renewal_snapshot, LESSON_ROOT);
  const currentPlatform = resolveRef(exactPlatformHead, ROOT);
  const currentLesson = resolveRef(exactLessonHead, LESSON_ROOT);
  const ancestor = spawnSync('git', ['merge-base', '--is-ancestor', payloadPlatform, currentPlatform], { cwd: ROOT });
  check(ancestor.status === 0, 'recorded rendered payload must be an ancestor of exact platform head');

  const proof = validateScaleProof();
  const platform = attestEqualPaths(platformEvidencePaths(proof), {
    renewal_payload: payloadPlatform,
    exact_head: currentPlatform,
  }, ROOT, 'exact-head platform rendered input');
  const lessonDependencies = deriveLessonDependencies(proof, snapshotLesson, currentLesson);
  const lesson = attestEqualPaths(lessonDependencies.equal_paths, {
    renewal_snapshot: snapshotLesson,
    exact_head: currentLesson,
  }, LESSON_ROOT, 'exact-head lesson rendered input');
  const lessonExistence = attestExistencePaths(lessonDependencies.existence_only_paths, {
    renewal_snapshot: snapshotLesson,
    exact_head: currentLesson,
  }, LESSON_ROOT, 'exact-head lesson route target');
  check(platform.every((item) => item.status === 'equal'), 'platform rendered inputs changed after reviewed payload');
  check(lesson.every((item) => item.status === 'equal'), 'lesson rendered inputs changed after recorded snapshot');
  check(lessonExistence.every((item) => item.status === 'present'), 'lesson route destination missing at exact head');

  return {
    platform_payload_sha: payloadPlatform,
    platform_exact_head_sha: currentPlatform,
    lesson_snapshot_sha: snapshotLesson,
    lesson_exact_head_sha: currentLesson,
    platform_equal_path_count: platform.length,
    lesson_equal_path_count: lesson.length,
    lesson_existence_only_path_count: lessonExistence.length,
    rendered_inputs_unchanged: true,
    route_destinations_present: true,
  };
}

function validateRoadmapTexts(goldenText, referenceText) {
  for (const required of [
    'PASS_CONTROLLED_ROLLOUT',
    WAVE_ID,
    'GOLDEN-ROUTE-111-MIGRATION-AND-START-COPY-REPAIR-BUNDLE-1',
    'GOLDEN-GRAPH-ADVISORY-113-BUNDLE-1',
    'A96-CALCULATION-ANSWER-FORM-HARDENING-AND-SCALE-GATE-1-REREVIEW-1',
    'SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1',
  ]) {
    check(goldenText.includes(required), `Golden roadmap missing current fact: ${required}`);
  }
  check(!goldenText.includes('HOLD_FOR_GOLDEN_ROUTE_REPAIR'), 'Golden roadmap retains stale Golden-route hold');
  check(!goldenText.includes('The next roadmap-controlled substantial bundle is\n  `GOLDEN-ROUTE-111'), 'Golden roadmap retains stale next-bundle statement');
  check(/All six surfaces keep `completionLanguageEligible:false`/.test(goldenText), 'Golden roadmap missing completion-language hold');
  check(/Exit tickets record bounded target-readiness evidence/.test(goldenText), 'Golden roadmap missing accepted target-readiness state');

  const proofTrack = referenceText.match(/## Product Proof Track And Scale Gate 1 Decision[\s\S]*?(?=\n## )/)?.[0] || '';
  check(proofTrack.includes('PASS_CONTROLLED_ROLLOUT'), 'reference roadmap Product Proof Track missing controlled-rollout decision');
  check(proofTrack.includes(WAVE_ID), 'reference roadmap Product Proof Track missing current wave');
  check(!/Scale Gate 1 is blocked/i.test(proofTrack), 'reference roadmap Product Proof Track retains stale blocked statement');
  check(/exit tickets remain target-readiness-only with completion language held/i.test(proofTrack), 'reference roadmap Product Proof Track missing current target-readiness/completion boundary');
  const immediate = referenceText.match(/## Immediate Next Sprint[\s\S]*?(?=\n## )/)?.[0] || '';
  check(immediate.includes(WAVE_ID), 'reference roadmap Immediate Next Sprint missing current wave');
  check(!/renewed packet is the next direct human review surface/i.test(immediate), 'reference roadmap retains stale check-surface review action');
  check(!/keeps target-equivalent readiness and\s+completion language held pending review/i.test(immediate), 'reference roadmap incorrectly holds accepted target readiness');
  check(/target-readiness evidence is approved while\s+completion language remains held/i.test(immediate), 'reference roadmap Immediate Next Sprint missing current target-readiness/completion boundary');
}

function validateNavigationTexts(texts) {
  for (const name of ['researchMap', 'referenceMap', 'githubEntry']) {
    check(texts[name]?.includes(WAVE_ID), `${name} missing ${WAVE_ID}`);
    check(texts[name]?.includes('check-y1-golden-rollout-wave-1.js'), `${name} missing Y1 checker path`);
  }
  check(texts.urlIndex?.includes(PATHS.bundleUrls), 'URL index missing Y1 review bundle');
  check(texts.bundleUrls?.includes(PATHS.packet), 'Y1 review bundle missing packet');
  check(texts.bundleUrls?.includes(PATHS.proof), 'Y1 review bundle missing proof');
  check(texts.bundleUrls?.includes(PATHS.deltaProof), 'Y1 review bundle missing delta proof');
  check(texts.platformAgentIndex?.includes(PATHS.packet), 'platform agent index missing Y1 packet');
  check(texts.dashboard?.includes(WAVE_ID), 'internal dashboard missing current Y1 wave');
  check(texts.dashboard?.includes('PASS_CONTROLLED_ROLLOUT'), 'internal dashboard missing controlled-rollout state');
}

function validateWiringTexts(packageJson, workflow) {
  check(packageJson.scripts?.['check:y1-golden-rollout-wave-1'] === 'node build-scripts/sprints/check-y1-golden-rollout-wave-1.js', 'package script wiring missing');
  check(workflow.includes('Validate Y1 Golden rollout wave'), 'CI Y1 step missing');
  check(workflow.includes('github.event.pull_request.base.sha'), 'CI missing exact pull-request base SHA');
  check(workflow.includes('github.event.pull_request.head.sha'), 'CI missing exact pull-request payload head SHA');
  check(workflow.includes('github.event.before'), 'CI missing exact main-push before SHA');
  check(workflow.includes('npm run check:y1-golden-rollout-wave-1'), 'CI command missing');
}

function validateWiring() {
  validateWiringTexts(readJson('package.json'), readText('.github/workflows/platform-ci.yml'));
}

function validatePacketObjects(packet, proof, allowUnbound, deltaProof) {
  check(packet.schema_version === 1 && packet.sprint_id === WAVE_ID, 'review packet identity mismatch');
  check(packet.pr_throughput_class === 'high_authority', 'review packet throughput class must be high_authority');
  check(packet.authority_class === 'product_authority', 'review packet authority class must be product_authority');
  check(packet.review_autonomy?.level === 'L4', 'review packet autonomy must be L4');
  check(packet.human_decision_required === true, 'review packet must require human decision');
  check(packet.auto_merge_allowed_after_ci === false, 'review packet must prohibit auto merge');
  check(packet.route === 'READY_FOR_HUMAN_REVIEW', 'review packet route must be READY_FOR_HUMAN_REVIEW');
  assertHeldAuthorities(packet.authority_claims, 'packet.authority_claims');
  if (!allowUnbound) {
    check(Number.isInteger(packet.pr_number) && packet.pr_number > 0, 'review packet pr_number must be bound');
    check(packet.pr_url === `https://github.com/meijer1973/4veco-platform/pull/${packet.pr_number}`, 'review packet pr_url must match pr_number');
  }
  check(/^[0-9a-f]{40}$/.test(packet.reviewed_payload_head_sha || ''), 'review packet reviewed payload SHA must be bound');
  check(deltaProof?.commit_chain?.platform?.renewal_payload === packet.reviewed_payload_head_sha, 'review packet payload SHA must match delta-proof renewal payload');

  check(proof.schema_version === 2 && proof.sprint_id === WAVE_ID, 'wave proof identity mismatch');
  check(proof.scale_gate_1?.decision === 'PASS_CONTROLLED_ROLLOUT', 'wave proof controlled-rollout decision mismatch');
  check(proof.scale_gate_1?.controlled_wave_eligibility_authorized === true, 'wave proof must record controlled eligibility');
  check(proof.scale_gate_1?.automatic_repository_wide_migration_authorized === false, 'wave proof must hold automatic repository-wide migration');
  check(proof.rendered_evidence?.reviewed_platform_payload_sha === packet.reviewed_payload_head_sha, 'wave proof rendered payload must match review packet payload');
  assertHeldAuthorities(proof.authority, 'proof.authority');
}

function validatePacketAndProof(allowUnbound, deltaProof) {
  validatePacketObjects(readJson(PATHS.packet), readJson(PATHS.proof), allowUnbound, deltaProof);
}

function parseArgs(argv) {
  const options = {
    eventMode: null,
    scopeMode: 'auto',
    base: null,
    head: null,
    lessonBase: CAPTURE_LESSON_SHA,
    lessonHead: 'origin/main',
    allowUnbound: false,
    scopeOnly: false,
    writeDeltaProof: false,
    writeDeltaProofOnly: false,
    repoRoot: ROOT,
    policyFile: null,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--allow-unbound-packet') options.allowUnbound = true;
    else if (arg === '--scope-only') options.scopeOnly = true;
    else if (arg === '--write-delta-proof') options.writeDeltaProof = true;
    else if (arg === '--write-delta-proof-only') options.writeDeltaProofOnly = true;
    else if (arg === '--event-mode') options.eventMode = argv[++i];
    else if (arg === '--scope-mode') options.scopeMode = argv[++i];
    else if (arg === '--base') options.base = argv[++i];
    else if (arg === '--head') options.head = argv[++i];
    else if (arg === '--lesson-base') options.lessonBase = argv[++i];
    else if (arg === '--lesson-head') options.lessonHead = argv[++i];
    else if (arg === '--repo-root') options.repoRoot = path.resolve(argv[++i]);
    else if (arg === '--policy-file') options.policyFile = path.resolve(argv[++i]);
    else throw new CheckError(`unknown argument: ${arg}`);
  }
  check(options.eventMode, '--event-mode is required');
  check(options.base && options.head, '--base and --head are required');
  check(!(options.scopeOnly && options.writeDeltaProofOnly), '--scope-only and --write-delta-proof-only are mutually exclusive');
  return options;
}

function run(options) {
  if (options.writeDeltaProofOnly) {
    const recomputedDelta = buildDeltaProof({ platformHead: options.head, lessonHead: options.lessonHead });
    fs.mkdirSync(path.dirname(filePath(ROOT, PATHS.deltaProof)), { recursive: true });
    fs.writeFileSync(filePath(ROOT, PATHS.deltaProof), `${JSON.stringify(recomputedDelta, null, 2)}\n`, 'utf8');
    return {
      delta: changedEntries(options.base, options.head, options.repoRoot),
      scope: { triggered: false, changed_paths: [] },
      delta_proof: recomputedDelta,
    };
  }
  check(!options.scopeOnly || options.repoRoot, '--scope-only requires a repository root');
  const policyWave = options.policyFile
    ? JSON.parse(fs.readFileSync(options.policyFile, 'utf8'))
    : readJson(PATHS.wave);
  const delta = changedEntries(options.base, options.head, options.repoRoot);
  validateEventRefs(options, delta, options.repoRoot);
  const scope = validateChangedEntries(delta.entries, policyWave.changed_path_policy, options.scopeMode);
  if (options.scopeOnly) return { delta, scope };

  validateWaveAndSurfaces();
  validateScaleProof();
  validateWiring();
  validateRoadmapTexts(readText(PATHS.goldenRoadmap), readText(PATHS.referenceRoadmap));

  let recordedDelta;
  if (options.writeDeltaProof) {
    recordedDelta = buildDeltaProof({ platformHead: options.head, lessonHead: options.lessonHead });
    fs.mkdirSync(path.dirname(filePath(ROOT, PATHS.deltaProof)), { recursive: true });
    fs.writeFileSync(filePath(ROOT, PATHS.deltaProof), `${JSON.stringify(recordedDelta, null, 2)}\n`, 'utf8');
  } else {
    recordedDelta = readJson(PATHS.deltaProof);
  }
  validatePacketAndProof(options.allowUnbound, recordedDelta);
  const recomputedDelta = buildDeltaProof({
    platformHead: recordedDelta.commit_chain?.platform?.renewal_payload,
    lessonHead: recordedDelta.commit_chain?.lesson?.renewal_snapshot,
  });
  validateDeltaProof(recordedDelta, recomputedDelta);
  const exactHeadDelta = validateExactHeadDelta(recordedDelta, options.head, options.lessonHead);
  const evidenceTail = scope.triggered
    ? validateEvidenceTail(recordedDelta.commit_chain.platform.renewal_payload, options.head)
    : { entries: [] };

  validateNavigationTexts({
    researchMap: readText('RESEARCH_AGENT_MAP.md'),
    referenceMap: readText('RESEARCH_AGENT_MAP_REFERENCES.md'),
    githubEntry: readText('AGENT_GITHUB_ENTRY.md'),
    urlIndex: readText('reports/url-index.md'),
    bundleUrls: readText(PATHS.bundleUrls),
    platformAgentIndex: readText('reports/github-agent-index-platform.json'),
    dashboard: readText('reports/internal-dashboard/dashboard-data.json'),
  });

  return { delta, scope, delta_proof: recomputedDelta, exact_head_delta: exactHeadDelta, evidence_tail: evidenceTail };
}

function cli(argv) {
  try {
    const options = parseArgs(argv);
    const result = run(options);
    console.log(JSON.stringify({
      ok: true,
      sprint_id: WAVE_ID,
      event_mode: options.eventMode,
      scope_mode: options.scopeMode,
      base_sha: result.delta.base_sha,
      head_sha: result.delta.head_sha,
      scope_attestation_triggered: result.scope.triggered,
      changed_paths: result.scope.changed_paths,
      screenshots_reusable: result.delta_proof?.summary?.screenshots_reusable ?? null,
      rendered_inputs_unchanged_through_exact_head: result.exact_head_delta?.rendered_inputs_unchanged ?? null,
      evidence_tail_paths: uniqueSorted((result.evidence_tail?.entries || []).flatMap(entryPaths)),
    }, null, 2));
  } catch (error) {
    console.error(`Y1-GOLDEN-ROLLOUT-WAVE-1 check failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) cli(process.argv.slice(2));

module.exports = {
  CAPTURE_LESSON_SHA,
  CAPTURE_PLATFORM_SHA,
  CheckError,
  EXPECTED_SURFACES,
  OLD_CI_LESSON_SHA,
  OLD_CI_PLATFORM_SHA,
  PARAGRAPHS,
  PATHS,
  WAVE_ID,
  attestEqualPaths,
  buildDeltaProof,
  containsLegacyAsset,
  changedEntries,
  deriveLessonDependencies,
  evidenceTailPathAllowed,
  classifyLocalHtmlReferences,
  extractLocalReferences,
  lessonCapturePaths,
  lessonRepoPath,
  parseArgs,
  parseNameStatus,
  run,
  sameSet,
  scopeTriggered,
  validateChangedEntries,
  validateDeltaProof,
  validateEvidenceTail,
  validateEventRefs,
  validateExactHeadDelta,
  validateNavigationTexts,
  validatePacketObjects,
  validateRoadmapTexts,
  validateScaleProof,
  validateScreenshotIntegrity,
  validateSurfaceContract,
  validateSurfaceState,
  validateWiringTexts,
  validateWaveAndSurfaces,
  routeTarget,
};
