#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'EXIT-TICKET-WORKBENCH-112-RENDERED-1';
const DEFAULT_BOOK_ROOT = path.resolve(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');
const PAGE_REL = path.join(
  '1.1 Hoofdstuk Economisch denken en rekenen',
  '1.1.2 Percentages en indexcijfers',
  '1.1.2 Percentages en indexcijfers \u2013 exit-ticket.html'
);
const DATA_REL = path.join('shared', 'exit-ticket', '1.1.2-exit-ticket.js');
const PROOF_JSON = path.join(ROOT, 'reports', 'json', 'exit-ticket-workbench-112-rendered-1-proof.json');
const SCREENSHOT_DIR = path.join(ROOT, 'reports', 'sprints', `${SPRINT_ID}-screenshots`);
const MANIFEST_JSON = path.join(SCREENSHOT_DIR, 'manifest.json');
const MANIFEST_MD = path.join(ROOT, 'reports', 'sprints', `${SPRINT_ID}-screenshot-manifest.md`);
const PROOF_MD = path.join(ROOT, 'reports', 'sprints', `${SPRINT_ID}-rendered-proof.md`);

const REQUIRED_CASES = new Map([
  ['desktop-light-initial', { width: 1280, theme: 'light' }],
  ['desktop-light-wrong-retry', { width: 1280, theme: 'light' }],
  ['desktop-light-after-calculation', { width: 1280, theme: 'light' }],
  ['desktop-light-after-structured', { width: 1280, theme: 'light' }],
  ['desktop-light-completed', { width: 1280, theme: 'light' }],
  ['mobile-light-initial', { width: 390, theme: 'light' }],
  ['mobile-light-completed', { width: 390, theme: 'light' }],
  ['mobile-dark-initial', { width: 390, theme: 'dark' }],
  ['mobile-dark-completed', { width: 390, theme: 'dark' }],
  ['route-reload', { width: 1280, theme: 'dark' }],
]);

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${rel(file)}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  return JSON.parse(read(file));
}

function loadDeployedData(dataFile) {
  const sandbox = { self: {} };
  vm.runInNewContext(read(dataFile), sandbox, { filename: dataFile });
  const data = sandbox.self.EXIT_TICKET_DATA;
  assert(data && typeof data === 'object', `${rel(dataFile)} must assign self.EXIT_TICKET_DATA`);
  return data;
}

function assertContains(text, needle, label) {
  assert(text.includes(needle), `${label} missing: ${needle}`);
}

function assertNotContains(text, needle, label) {
  assert(!text.includes(needle), `${label} must not contain: ${needle}`);
}

function loadedHrefOrSrc(html, fileName) {
  const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp('<(?:link|script)\\b[^>]*(?:href|src)=["\'][^"\']*' + escaped + '["\'][^>]*>', 'i');
  return pattern.test(html);
}

function assertNoOverclaim(text, label) {
  assert(
    !/(eindopgave|aankunt|bewezen|aangetoond|beheerst|diagnos|mastery|summatief|Scale Gate 1|productgebruik)/i.test(text),
    `${label} contains held-authority language`
  );
}

function checkHtml(html, pageFile) {
  const label = rel(pageFile);
  assert(/<header\b[^>]*class=["'][^"']*\bge-topbar\b/i.test(html), `${label}: header.ge-topbar is required`);
  assert(
    /<main\b[^>]*class=["'][^"']*\bge-page\b[^"']*["'][^>]*data-golden-ticket-root/i.test(html),
    `${label}: main.ge-page[data-golden-ticket-root] is required`
  );
  assertContains(html, 'data-source-key="1.1.2-exit-ticket"', label);
  assertContains(html, 'Exit ticket - paragraaf 1.1.2', label);
  assertContains(html, 'data-ge-work', label);
  assertContains(html, 'data-ge-final-answer', label);
  assertContains(html, 'data-ge-unit-notation', label);
  assertContains(html, 'data-ge-structured-field', label);
  assertContains(html, 'data-ge-structured-choice', label);
  assertContains(html, 'data-ge-check-all', label);
  assertContains(html, 'data-ge-completion', label);
  assertContains(html, '1.1.2%20Percentages%20en%20indexcijfers%20%E2%80%93%20wiskundevaardigheden.html', label);
  assertContains(html, '1.1.2%20Percentages%20en%20indexcijfers%20%E2%80%93%20redeneer-spel.html', label);

  ['golden-ticket-layout.css', '1.1.2-exit-ticket.js', 'golden-ticket-layout.js'].forEach((fileName) => {
    assert(loadedHrefOrSrc(html, fileName), `${label}: must load ${fileName}`);
  });
  [
    'golden-ticket-graph.js',
    'task-shell.css',
    'exit-ticket.css',
    'skill-map-route.css',
    'task-shell-ui.js',
    'exit-ticket-ui.js',
    'exit-ticket-engine.js',
    'skill-map-route-ui.js',
  ].forEach((fileName) => {
    assert(!loadedHrefOrSrc(html, fileName), `${label}: must not load ${fileName}`);
  });
  [
    'id="exit-ticket-app"',
    'class="et-page"',
    'et-topbar',
    'task-shell-card',
    'Exit ticket - transferproof 1.1.2',
    'Bijvoorbeeld 15',
    'Bijvoorbeeld 108',
    'Bijvoorbeeld 3,7',
  ].forEach((needle) => assertNotContains(html, needle, label));
  assertNoOverclaim(html, label);
}

function checkData(data, dataFile) {
  assert(data.parNr === '1.1.2', `${rel(dataFile)} parNr mismatch`);
  assert(data.layout && data.layout.framework === 'golden_exercise_workbench', 'deployed 1.1.2 must use Golden Workbench framework');
  assert(data.layout.kicker === 'Exit ticket - paragraaf 1.1.2', 'deployed 1.1.2 kicker must be student-facing');
  assert(data.targetEquivalent && data.targetEquivalent.candidate === true, 'target-equivalent candidate flag must remain true');
  assert(data.targetEquivalent.gateApproved === true, 'gate approval must record approved readiness evidence');
  assert(data.targetEquivalent.completionLanguageEligible === false, 'completion language must remain held false');
  assert(data.metadataAlignment && data.metadataAlignment.status === 'target_equivalent_aligned', 'target alignment status must be approved');
  assert(data.metadataAlignment && data.metadataAlignment.targetReadinessEvidence === true, 'target readiness evidence must record approved readiness');
  assert(Array.isArray(data.contextBlocks) && data.contextBlocks.length === 3, 'deployed 1.1.2 must contain three context blocks');
  const contextIds = new Set(data.contextBlocks.map((block) => block.id));
  const tasks = (data.tasks || []).filter((item) => item && item.type === 'task_shell' && item.taskShell);
  assert(tasks.length === 4, 'deployed 1.1.2 must contain four task shell entries');
  assert(tasks.filter((item) => item.taskShell.family === 'calculation_work_capture').length === 3, 'must contain three calculation tasks');
  assert(tasks.filter((item) => item.taskShell.family === 'structured_short_response').length === 1, 'must contain one structured task');
  tasks.forEach((item) => {
    const refs = item.taskShell.contextRefs || [];
    assert(refs.length > 0, `${item.id} must reference context blocks`);
    refs.forEach((ref) => assert(contextIds.has(ref), `${item.id} has unknown context ref ${ref}`));
  });
  const serialized = JSON.stringify(data);
  ['transferproof', 'Bijvoorbeeld 15', 'Bijvoorbeeld 108', 'Bijvoorbeeld 3,7'].forEach((needle) => {
    assert(!serialized.includes(needle), `deployed data must not contain ${needle}`);
  });
  assertNoOverclaim(JSON.stringify(data.completion || {}), 'deployed 1.1.2 completion');
}

function pngDimensions(file) {
  const buffer = fs.readFileSync(file);
  assert(buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG', `${rel(file)} is not a PNG`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function checkCase(capture) {
  const expected = REQUIRED_CASES.get(capture.case);
  assert(expected, `unexpected screenshot case ${capture.case}`);
  assert(capture.theme === expected.theme, `${capture.case}: expected theme ${expected.theme}`);
  assert(capture.viewport && capture.viewport.width === expected.width, `${capture.case}: expected viewport width ${expected.width}`);
  const file = path.join(ROOT, capture.file || '');
  assert(fs.existsSync(file), `${capture.case}: missing screenshot ${capture.file}`);
  assert(fs.statSync(file).size > 5000, `${capture.case}: screenshot too small`);
  const dimensions = pngDimensions(file);
  assert(dimensions.width === expected.width, `${capture.case}: screenshot width ${dimensions.width}, expected ${expected.width}`);
  assert(capture.screenshot_dimensions && capture.screenshot_dimensions.width === dimensions.width, `${capture.case}: recorded width mismatch`);

  const proof = capture.proof || {};
  assert(proof.goldenRoot === true, `${capture.case}: missing golden root`);
  assert(proof.graphRuntimeLoaded === false, `${capture.case}: graph runtime must not load`);
  assert(proof.legacyAssetCount === 0, `${capture.case}: legacy assets loaded`);
  assert(proof.exitTicketAppCount === 0, `${capture.case}: legacy #exit-ticket-app present`);
  assert(proof.taskCount === 4, `${capture.case}: expected four rendered tasks`);
  assert(proof.calculationTaskCount === 3, `${capture.case}: expected three calculation tasks`);
  assert(proof.structuredTaskCount === 1, `${capture.case}: expected one structured task`);
  assert(proof.gateApproved === true, `${capture.case}: gate approval must record approved readiness evidence`);
  assert(proof.completionLanguageEligible === false, `${capture.case}: completion language must remain held false`);
  assert(proof.targetReadinessEvidence === true, `${capture.case}: target readiness evidence must record approved readiness`);
  assert(proof.contextBlockCount === 3, `${capture.case}: expected three context blocks`);
  assert(proof.answerRevealingPlaceholderCount === 0, `${capture.case}: answer-revealing placeholders visible`);
  assert(proof.transferproofVisible === false, `${capture.case}: internal transferproof label visible`);

  if (capture.case === 'desktop-light-wrong-retry') {
    assert(proof.retryFeedbackCount > 0, 'wrong/retry case must show retry feedback');
    assert(proof.completionVisible === false, 'wrong/retry case must not complete');
  }
  if (capture.case === 'desktop-light-after-calculation') {
    assert(proof.calculationGoodCount >= 1, 'after-calculation case must show a correct calculation state');
    assert(proof.completionVisible === false, 'after-calculation case must not complete all tasks');
  }
  if (capture.case === 'desktop-light-after-structured') {
    assert(proof.structuredGood === true, 'after-structured case must show correct structured explanation feedback');
    assert(proof.selectedStructuredChoice === 'niet-vier-procent', 'after-structured case must choose the corrective explanation');
  }
  if (/completed$/.test(capture.case)) {
    assert(proof.allTaskFeedbackGood === true, `${capture.case}: all task feedback must be good`);
    assert(proof.completionVisible === true, `${capture.case}: completion must be visible`);
  }
  if (capture.case === 'route-reload') {
    assert(proof.theme === 'dark', 'reload proof must preserve dark theme');
    assert(proof.sourceKey === '1.1.2-exit-ticket', 'reload proof must keep source key');
  }
}

function checkRenderedProof() {
  const proof = readJson(PROOF_JSON);
  const manifest = readJson(MANIFEST_JSON);
  const manifestMd = read(MANIFEST_MD);
  const proofMd = read(PROOF_MD);

  assert(proof.schema_version === 1, 'proof JSON schema_version must be 1');
  assert(proof.sprint_id === SPRINT_ID, 'proof JSON sprint_id mismatch');
  assert(proof.status === 'rendered_proof_complete_pending_review', 'proof JSON status mismatch');
  assert(proof.static_contract && proof.static_contract.html_passed === true, 'proof JSON must record static HTML pass');
  assert(proof.static_contract.shared_data_passed === true, 'proof JSON must record shared data pass');
  assert(proof.static_contract.no_legacy_passed === true, 'proof JSON must record no-legacy pass');
  assert(proof.authority && proof.authority.generated_lesson_output_changed === true, 'proof JSON must record generated lesson output change');
  [
    'broad_rollout_authorized',
    'product_route_adoption_authorized',
    'scale_gate_1_authorized',
    'target_equivalent_completion_language_authorized',
    'diagnostics_authorized',
    'mastery_or_sequencing_authorized',
    'summative_use_authorized',
  ].forEach((key) => assert(proof.authority[key] === false, `proof JSON authority.${key} must be false`));

  assert(manifest.schema_version === 1, 'manifest JSON schema_version must be 1');
  assert(manifest.sprint_id === SPRINT_ID, 'manifest JSON sprint_id mismatch');
  assert(Array.isArray(manifest.cases), 'manifest JSON must list cases');
  const seen = new Set(manifest.cases.map((item) => item.case));
  REQUIRED_CASES.forEach((_expected, id) => assert(seen.has(id), `manifest missing case ${id}`));
  manifest.cases.forEach(checkCase);

  [
    'desktop-light-wrong-retry',
    'desktop-light-after-calculation',
    'desktop-light-after-structured',
    'desktop-light-completed',
    'mobile-dark-completed',
    'route-reload',
    'no graph runtime',
    'no legacy route assets',
  ].forEach((needle) => assert(manifestMd.includes(needle), `screenshot manifest missing ${needle}`));
  [
    'Rendered proof complete pending lead review',
    'generated lesson output changed',
    'No broad rollout',
    'No Scale Gate 1',
  ].forEach((needle) => assert(proofMd.includes(needle), `rendered proof report missing ${needle}`));
}

function parseArgs(argv) {
  const args = { bookRoot: DEFAULT_BOOK_ROOT };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--book-root') {
      args.bookRoot = path.resolve(argv[i + 1]);
      i += 1;
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const pageFile = path.join(args.bookRoot, PAGE_REL);
  const dataFile = path.join(args.bookRoot, DATA_REL);
  checkHtml(read(pageFile), pageFile);
  checkData(loadDeployedData(dataFile), dataFile);
  checkRenderedProof();
  console.log(`${SPRINT_ID} passed: rendered 1.1.2 lesson output, screenshots, approved readiness, and held completion/downstream boundaries verified`);
}

try {
  main();
} catch (error) {
  console.error(`check-exit-ticket-workbench-112-rendered-1 failed: ${error.message}`);
  process.exit(1);
}
