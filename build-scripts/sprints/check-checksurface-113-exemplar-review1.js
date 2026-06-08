#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const platformRoot = path.resolve(__dirname, '..', '..');
const lessonRoot = path.resolve(
  process.argv[2] || path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const sprintId = 'CHECKSURFACE-113-EXEMPLAR-REVIEW-1';
const reviewRoot = path.join(
  platformRoot,
  'references',
  'exemplars',
  'product-excellence',
  'check-surfaces',
  '1.1.3-exit-ticket',
  'reviews'
);
const browserProofPath = path.join(platformRoot, 'reports', 'json', 'checksurface-113-exemplar-review1-browser-proof.json');
const proofPath = path.join(platformRoot, 'reports', 'json', 'checksurface-113-exemplar-review1-proof.json');
const implementationResultPath = path.join(
  platformRoot,
  'references',
  'data',
  'sprints',
  'CHECKSURFACE-113-EXEMPLAR-EXIT-1.result.json'
);
const generatedUiPath = path.join(lessonRoot, 'shared', 'exit-ticket-ui.js');

function fail(message) {
  console.error(`CHECKSURFACE-113 review check failed: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${path.relative(platformRoot, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${path.relative(platformRoot, file)}: ${error.message}`);
  }
}

function rel(file) {
  return path.relative(platformRoot, file).replace(/\\/g, '/');
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const reviewFiles = [
  'teacher-learning-quality-review.md',
  'student-experience-review.md',
  'visual-interaction-review.md',
  'accessibility-review.md',
  'testing-regression-review.md',
  'lead-synthesis.md',
];

const reviewProof = {};
for (const fileName of reviewFiles) {
  const file = path.join(reviewRoot, fileName);
  const markdown = read(file);
  assert(!/PENDING_REVIEW/.test(markdown), `${fileName} still contains PENDING_REVIEW`);
  assert(/Status:\s*`COMPLETE`/.test(markdown), `${fileName} must be complete`);
  assert(/Verdict:\s*PASS WITH FLAGS/.test(markdown), `${fileName} must record PASS WITH FLAGS`);
  reviewProof[fileName] = {
    path: rel(file),
    verdict: 'PASS WITH FLAGS',
  };
}

const browserProof = readJson(browserProofPath);
assert(browserProof.sprint_id === sprintId, 'browser proof has wrong sprint id');
assert(browserProof.in_app_browser_dom, 'browser proof must include in-app browser DOM evidence');
assert(
  browserProof.in_app_browser_dom.toggle_click_result &&
    browserProof.in_app_browser_dom.toggle_click_result.theme === 'dark',
  'browser proof must show rendered toggle click reaching dark theme'
);
assert(
  browserProof.in_app_browser_dom.mobile_dark_after_toggle_reload &&
    browserProof.in_app_browser_dom.mobile_dark_after_toggle_reload.theme === 'dark',
  'browser proof must show mobile reload staying dark'
);
const reviewTaskFamilies = browserProof.in_app_browser_dom.desktop_light.taskFamilies || [];
const hasHistoricalFourCardProof =
  reviewTaskFamilies.includes('graph_construction_substitute') &&
  reviewTaskFamilies.includes('graph_reading') &&
  reviewTaskFamilies.includes('formula_builder') &&
  reviewTaskFamilies.includes('calculation_work_capture');
const hasRepairedThreeCardProof =
  reviewTaskFamilies.includes('graph_construction_substitute') &&
  reviewTaskFamilies.includes('graph_reading') &&
  reviewTaskFamilies.includes('calculation_work_capture') &&
  !reviewTaskFamilies.includes('formula_builder');
assert(
  Array.isArray(reviewTaskFamilies) && (hasHistoricalFourCardProof || hasRepairedThreeCardProof),
  'browser proof must include the historical reviewed task families or the repaired embedded-formula task families'
);
assert(browserProof.in_app_browser_dom.desktop_light.formulaContextPresent === false, 'browser proof must reject formula context');
assert(
  browserProof.in_app_browser_dom.desktop_light.completionDiagnosticTextPresent === false,
  'browser proof must reject completion/diagnostic text'
);

const manifestPath = path.join(platformRoot, browserProof.screenshot_manifest || '');
const manifest = readJson(manifestPath);
assert(Array.isArray(manifest.cases) && manifest.cases.length === 2, 'screenshot manifest must list two cases');
for (const item of manifest.cases) {
  const screenshotPath = path.join(platformRoot, item.screenshot || '');
  assert(fs.existsSync(screenshotPath), `missing screenshot: ${item.screenshot}`);
  assert(fs.statSync(screenshotPath).size > 1000, `screenshot is unexpectedly small: ${item.screenshot}`);
  assert(item.proof && item.proof.title === 'Grafieken en tabellen - Exit ticket', `${item.name} proof has wrong title`);
  assert(item.proof.formulaContextPresent === false, `${item.name} proof found formula context`);
  assert(item.proof.completionDiagnosticTextPresent === false, `${item.name} proof found completion/diagnostic text`);
}

const implementationResult = readJson(implementationResultPath);
assert(implementationResult.authority, 'implementation result must include authority block');
for (const [key, value] of Object.entries(implementationResult.authority)) {
  assert(value === false, `implementation authority boundary must remain false: ${key}`);
}

const platformUi = read(path.join(platformRoot, 'engines', 'exit-ticket-ui.js'));
const generatedUi = read(generatedUiPath);
for (const source of [
  { label: 'platform exit-ticket-ui.js', text: platformUi },
  { label: 'generated shared exit-ticket-ui.js', text: generatedUi },
]) {
  assert(source.text.includes('function bindThemeToggle'), `${source.label} must bind theme toggle`);
  assert(source.text.includes("storage.setItem('quizMode', next)"), `${source.label} must persist quizMode`);
  assert(source.text.includes("button.setAttribute('aria-pressed'"), `${source.label} must update aria-pressed`);
}

const proof = {
  generated: '2026-06-07',
  sprint_id: sprintId,
  status: 'passed',
  lesson_root: lessonRoot,
  reviews: reviewProof,
  browser_proof: rel(browserProofPath),
  screenshot_manifest: rel(manifestPath),
  screenshots: manifest.cases.map((item) => item.screenshot),
  theme_toggle_repair: {
    platform_runtime: 'engines/exit-ticket-ui.js',
    generated_runtime: path.relative(platformRoot, generatedUiPath).replace(/\\/g, '/'),
    rendered_click_reaches_dark: true,
    mobile_reload_stays_dark: true,
  },
  authority: {
    human_review_completed: false,
    target_readiness_evidence_authorized: false,
    completion_language_authorized: false,
    diagnostic_or_mastery_authorized: false,
    pv_or_scale_gate_authorized: false,
  },
};

fs.mkdirSync(path.dirname(proofPath), { recursive: true });
fs.writeFileSync(proofPath, `${JSON.stringify(proof, null, 2)}\n`, 'utf8');
console.log(`OK CHECKSURFACE-113 exemplar review proof: ${rel(proofPath)}`);
