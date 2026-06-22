#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const GoldenTicketLayout = require('../../engines/golden-ticket-layout');

const SPRINT_ID = 'GOLDEN-GRAPH-ADVISORY-113-BUNDLE-1';
const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.GOLDEN_GRAPH_ADVISORY_113_BOOK_ROOT ||
    process.env.LESSON_BOOK_ROOT ||
    path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const chapterDir = '1.1 Hoofdstuk Economisch denken en rekenen';
const proofPath = path.join(platformRoot, 'reports', 'json', 'golden-graph-advisory-113-bundle-1-proof.json');

const routes = {
  '1.1.1': { dir: '1.1.1 Schaarste en economisch denken' },
  '1.1.2': { dir: '1.1.2 Percentages en indexcijfers' },
  '1.1.3': { dir: '1.1.3 Grafieken en tabellen' },
};

const expectedVariants = {
  '1.1.1-exit-ticket': 'golden_calculation_structured_v1',
  '1.1.1-korte-check': 'golden_advisory_short_check_v1',
  '1.1.2-exit-ticket': 'golden_calculation_structured_v1',
  '1.1.2-korte-check': 'golden_advisory_short_check_v1',
  '1.1.3-exit-ticket': 'golden_graph_reading_claim_v1',
  '1.1.3-korte-check': 'golden_graph_advisory_v1',
};

const falseAuthorityKeys = [
  'target_equivalent_completion_language_authorized',
  'product_route_adoption_authorized',
  'diagnostics_authorized',
  'mastery_or_sequencing_authorized',
  'pv_authorized',
  'summative_use_authorized',
  'scale_gate_1_authorized',
  'broad_product_use_authorized',
  'student_product_use_authorized',
];

const requiredScreenshotIds = [
  'desktop-light-initial',
  'desktop-light-wrong-retry',
  'desktop-light-graph-after-action',
  'desktop-light-local-success-advisory-complete',
  'mobile-light-initial',
  'mobile-dark-initial',
  'mobile-dark-local-success',
  'route-reload-desktop-light',
  'landing-to-short-check-route',
];

function fail(message) {
  console.error(`${SPRINT_ID} check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (error) {
    fail(`cannot read ${file}: ${error.message}`);
  }
}

function readJson(file) {
  try {
    return JSON.parse(readText(file));
  } catch (error) {
    fail(`cannot parse JSON ${file}: ${error.message}`);
  }
}

function requireGeneratedData(sourceKey) {
  const file = path.join(bookRoot, 'shared', 'exit-ticket', `${sourceKey}.js`);
  try {
    const resolved = require.resolve(file);
    delete require.cache[resolved];
    return require(resolved);
  } catch (error) {
    fail(`cannot require generated data ${file}: ${error.message}`);
  }
}

function sourceData(sourceKey) {
  return readJson(path.join(platformRoot, 'source-data', 'book-1', 'exit-ticket', `${sourceKey}.json`));
}

function paragraphDir(paragraph) {
  return path.join(bookRoot, chapterDir, routes[paragraph].dir);
}

function pageFile(sourceKey) {
  const [paragraph] = sourceKey.split('-');
  const suffix = sourceKey.endsWith('exit-ticket') ? 'exit-ticket' : 'korte-check';
  return path.join(paragraphDir(paragraph), `${routes[paragraph].dir} \u2013 ${suffix}.html`);
}

function pngDimensions(file) {
  const buffer = fs.readFileSync(file);
  assert(buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG', `${file} must be a PNG`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function dataFacts(data) {
  const target = data.targetEquivalent || {};
  const alignment = data.metadataAlignment || {};
  return {
    surface: data.surface,
    variant: data.layout && data.layout.variant,
    candidate: target.candidate,
    gateApproved: target.gateApproved,
    completionLanguageEligible: target.completionLanguageEligible,
    targetReadinessEvidence: alignment.targetReadinessEvidence,
  };
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((acc, key) => {
      acc[key] = canonical(value[key]);
      return acc;
    }, {});
  }
  return value;
}

function canonicalString(value) {
  return JSON.stringify(canonical(value));
}

function assertFalseAuthorityFlags(data, label) {
  const facts = dataFacts(data);
  assert(facts.surface === 'advisory_short_check', `${label} must remain advisory_short_check`);
  assert(facts.candidate === false, `${label} targetEquivalent.candidate must be false`);
  assert(facts.gateApproved === false, `${label} targetEquivalent.gateApproved must be false`);
  assert(facts.completionLanguageEligible === false, `${label} completionLanguageEligible must be false`);
  assert(facts.targetReadinessEvidence === false, `${label} targetReadinessEvidence must be false`);
}

function assertNoFakeGraphControls(data, label) {
  const text = JSON.stringify(data);
  [
    /lineConfirmationLabel/,
    /lineShapeLabel/,
    /lineShapeOptions/,
    /Trek lijn door punten/,
    /Lijnvorm/,
    /doelopgave-niveau/,
    /doelopgave op hetzelfde niveau/,
    /antwoordvorm aankunt/,
  ].forEach((pattern) => assert(!pattern.test(text), `${label} contains forbidden ${pattern}`));
}

function assertGoldenHtml(file, label, needsGraph) {
  const html = readText(file);
  assert(/<header class="ge-topbar">/.test(html), `${label} must render ge-topbar`);
  assert(/data-golden-ticket-root/.test(html), `${label} must render data-golden-ticket-root`);
  assert(/golden-ticket-layout\.css/.test(html), `${label} must load Golden CSS`);
  assert(/golden-ticket-layout\.js/.test(html), `${label} must load Golden runtime`);
  if (needsGraph) assert(/golden-ticket-graph\.js/.test(html), `${label} must load graph runtime`);
  [
    /id="exit-ticket-app"/,
    /class="et-page"/,
    /class="et-topbar"/,
    /task-shell\.css/,
    /exit-ticket\.css/,
    /task-shell-ui\.js/,
    /exit-ticket-ui\.js/,
  ].forEach((pattern) => assert(!pattern.test(html), `${label} contains legacy shell marker ${pattern}`));
}

function resolveHref(paragraph, href) {
  const clean = decodeURIComponent(String(href || '').split('#')[0].split('?')[0]);
  if (!clean) return null;
  return path.resolve(paragraphDir(paragraph), clean);
}

function assertRouteLinksResolve(data, paragraph, label) {
  const hrefs = [];
  ((data.skillMap || {}).routes || []).forEach((route) => hrefs.push(route.href));
  (data.tasks || []).forEach((task) => {
    const shell = task.taskShell || task;
    if (shell.practiceRoute && shell.practiceRoute.href) hrefs.push(shell.practiceRoute.href);
    (((shell.interaction || {}).options) || []).forEach((option) => {
      if (option && option.href) hrefs.push(option.href);
    });
    Object.values(shell.feedbackByOption || {}).forEach((feedback) => {
      if (feedback && feedback.route && feedback.route.href) hrefs.push(feedback.route.href);
    });
  });
  hrefs.forEach((href) => {
    const target = resolveHref(paragraph, href);
    assert(target && fs.existsSync(target), `${label} unresolved route link ${href}`);
  });
}

function checkSourceAndGeneratedData() {
  Object.entries(expectedVariants).forEach(([sourceKey, expectedVariant]) => {
    const source = sourceData(sourceKey);
    const generated = requireGeneratedData(sourceKey);
    assert(GoldenTicketLayout.supportedVariantFor(source) === expectedVariant, `${sourceKey} source variant mismatch`);
    assert(GoldenTicketLayout.supportedVariantFor(generated) === expectedVariant, `${sourceKey} generated variant mismatch`);
    const needsGraph = expectedVariant === 'golden_graph_reading_claim_v1' || expectedVariant === 'golden_graph_advisory_v1';
    assertGoldenHtml(pageFile(sourceKey), sourceKey, needsGraph);
  });

  const shortSource = sourceData('1.1.3-korte-check');
  const shortGenerated = requireGeneratedData('1.1.3-korte-check');
  assertFalseAuthorityFlags(shortSource, '1.1.3 source short check');
  assertFalseAuthorityFlags(shortGenerated, '1.1.3 generated short check');
  assert(canonicalString(shortSource) === canonicalString(shortGenerated), '1.1.3 short source/generated data must be deeply equal');
  assert(JSON.stringify(dataFacts(shortSource)) === JSON.stringify(dataFacts(shortGenerated)), '1.1.3 short source/generated authority facts must match');
  assertNoFakeGraphControls(shortSource, '1.1.3 source short check');
  assertNoFakeGraphControls(shortGenerated, '1.1.3 generated short check');
  assertRouteLinksResolve(shortGenerated, '1.1.3', '1.1.3 generated short check');

  const exitSource = sourceData('1.1.3-exit-ticket');
  assert((exitSource.targetEquivalent || {}).gateApproved === true, '1.1.3 exit ticket gateApproved must remain true');
  assert((exitSource.metadataAlignment || {}).targetReadinessEvidence === true, '1.1.3 exit targetReadinessEvidence must remain true');
  assert((exitSource.targetEquivalent || {}).completionLanguageEligible === false, '1.1.3 exit completionLanguageEligible must remain false');
}

function checkProof() {
  const proof = readJson(proofPath);
  assert(proof.schema_version === 1, 'proof schema_version must be 1');
  assert(proof.sprint_id === SPRINT_ID, 'proof sprint_id mismatch');
  assert(
    proof.status === 'rendered_proof_ready_for_lead_review' ||
      proof.status === 'ready_for_human_golden_graph_advisory_113_review',
    `unsupported proof status ${proof.status}`
  );
  assert(fs.existsSync(path.join(platformRoot, proof.screenshot_manifest)), 'screenshot manifest markdown missing');
  assert(fs.existsSync(path.join(platformRoot, proof.screenshot_manifest_json)), 'screenshot manifest JSON missing');
  falseAuthorityKeys.forEach((key) => assert((proof.authority || {})[key] === false, `authority.${key} must be false`));

  const summary = proof.proof || {};
  [
    'golden_graph_advisory_variant_source',
    'golden_graph_advisory_variant_generated',
    'source_generated_deep_equal',
    'source_generated_authority_flags_match',
    'false_authority_flags_preserved',
    'no_fake_graph_controls',
    'rendered_desktop_mobile_dark_coverage',
    'rendered_wrong_retry_captured',
    'rendered_graph_after_action_captured',
    'rendered_local_success_captured',
    'rendered_mobile_dark_success_captured',
    'landing_to_short_check_route_captured',
    'route_reload_captured',
    'rendered_no_horizontal_overflow',
    'rendered_no_legacy_shell',
    'rendered_forbidden_terms_absent',
  ].forEach((key) => assert(summary[key] === true, `proof.${key} must be true`));

  assert(Array.isArray(proof.screenshots), 'proof.screenshots missing');
  requiredScreenshotIds.forEach((id) => assert(proof.screenshots.some((item) => item.id === id), `missing screenshot ${id}`));
  proof.screenshots.forEach((item) => {
    const file = path.join(platformRoot, item.file);
    assert(fs.existsSync(file), `missing screenshot file ${item.file}`);
    const dimensions = pngDimensions(file);
    assert(dimensions.width === item.viewport.width, `${item.id} PNG width mismatch`);
    assert(dimensions.height === item.viewport.height, `${item.id} PNG height mismatch`);
    assert(item.inspection.horizontal_overflow === false, `${item.id} has horizontal overflow`);
    assert(Array.isArray(item.inspection.forbidden_terms) && item.inspection.forbidden_terms.length === 0, `${item.id} has forbidden terms`);
    if (item.inspection.golden_root) {
      assert(Array.isArray(item.inspection.legacy_markers) && item.inspection.legacy_markers.length === 0, `${item.id} has legacy markers`);
      assert(item.inspection.data_flags.variant === 'golden_graph_advisory_v1', `${item.id} data variant mismatch`);
      assert(item.inspection.data_flags.completionLanguageEligible === false, `${item.id} completionLanguageEligible must be false`);
      assert(item.inspection.data_flags.targetReadinessEvidence === false, `${item.id} targetReadinessEvidence must be false`);
    }
  });
}

function main() {
  checkSourceAndGeneratedData();
  checkProof();
  console.log(`OK ${SPRINT_ID} checker passed`);
}

main();
