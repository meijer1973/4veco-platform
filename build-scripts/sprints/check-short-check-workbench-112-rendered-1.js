#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'SHORT-CHECK-WORKBENCH-112-RENDERED-1';
const DEFAULT_BOOK_ROOT = path.resolve(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');
const PAGE_REL = path.join(
  '1.1 Hoofdstuk Economisch denken en rekenen',
  '1.1.2 Percentages en indexcijfers',
  '1.1.2 Percentages en indexcijfers \u2013 korte-check.html'
);
const DATA_REL = path.join('shared', 'exit-ticket', '1.1.2-korte-check.js');
const PROOF_JSON = path.join(ROOT, 'reports', 'json', 'short-check-workbench-112-rendered-1-proof.json');
const SCREENSHOT_DIR = path.join(ROOT, 'reports', 'sprints', `${SPRINT_ID}-screenshots`);
const MANIFEST_JSON = path.join(SCREENSHOT_DIR, 'manifest.json');
const MANIFEST_MD = path.join(ROOT, 'reports', 'sprints', `${SPRINT_ID}-screenshot-manifest.md`);
const PROOF_MD = path.join(ROOT, 'reports', 'sprints', `${SPRINT_ID}-rendered-proof.md`);

const REQUIRED_CASES = new Map([
  ['desktop-light-initial', { width: 1280, theme: 'light' }],
  ['desktop-light-wrong-retry', { width: 1280, theme: 'light' }],
  ['desktop-light-local-success', { width: 1280, theme: 'light' }],
  ['desktop-light-completed-advisory', { width: 1280, theme: 'light' }],
  ['mobile-light-initial', { width: 390, theme: 'light' }],
  ['mobile-light-local-success', { width: 390, theme: 'light' }],
  ['mobile-dark-initial', { width: 390, theme: 'dark' }],
  ['mobile-dark-local-success', { width: 390, theme: 'dark' }],
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

function studentText(data) {
  const out = [];
  function push(value) {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach(push);
      return;
    }
    if (typeof value === 'object') return;
    const text = String(value).trim();
    if (text) out.push(text);
  }
  push(data.title);
  push(data.intro);
  push(data.parName);
  if (data.layout) {
    push(data.layout.kicker);
    push(data.layout.sourceNote);
  }
  if (data.skillMap) {
    push(data.skillMap.title);
    (data.skillMap.routes || []).forEach((route) => {
      push(route.label);
      push(route.surface);
    });
  }
  (data.contextBlocks || []).forEach((block) => {
    push(block.sourceLabel);
    push(block.caption);
    push(block.bodyMarkdown);
    push(block.altText);
    push(block.columns);
    push(block.rows);
  });
  (data.tasks || []).forEach((task) => {
    push(task.skillLabel);
    push(task.prompt);
    (task.options || []).forEach((option) => push(option.label));
    if (task.feedback) {
      push(task.feedback.matchTitle);
      push(task.feedback.matchText);
      push(task.feedback.retryTitle);
      push(task.feedback.retryText);
    }
    if (task.practiceRoute) push(task.practiceRoute.label);
  });
  if (data.completion) {
    push(data.completion.title);
    push(data.completion.text);
  }
  return out.join('\n');
}

function assertNoOverclaim(text, label) {
  assert(
    !/(eindopgave|aankunt|bewezen|aangetoond|beheerst|diagnos|mastery|summatief|Scale Gate 1|productgebruik|doel gehaald|target-equivalent)/i.test(text),
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
  assertContains(html, 'data-source-key="1.1.2-korte-check"', label);
  assertContains(html, 'Korte check - paragraaf 1.1.2', label);
  assertContains(html, 'ge-workbench-advisory', label);
  assertContains(html, 'data-ge-choice-option', label);
  assertContains(html, 'data-ge-check-all', label);
  assertContains(html, 'data-ge-completion', label);
  assertContains(html, 'data-context-block="ctx-112-short-prijs"', label);
  assertContains(html, '1.1.2%20Percentages%20en%20indexcijfers%20%E2%80%93%20wiskundevaardigheden.html', label);
  assertContains(html, '1.1.2%20Percentages%20en%20indexcijfers%20%E2%80%93%20redeneer-spel.html', label);

  ['golden-ticket-layout.css', '1.1.2-korte-check.js', 'golden-ticket-layout.js'].forEach((fileName) => {
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
    'data-ge-work',
    'data-ge-structured-choice',
    'ge-locked',
  ].forEach((needle) => assertNotContains(html, needle, label));
  assertNoOverclaim(html, label);
}

function checkData(data, dataFile) {
  assert(data.parNr === '1.1.2', `${rel(dataFile)} parNr mismatch`);
  assert(data.surface === 'advisory_short_check', '1.1.2 short check must remain advisory');
  assert(data.layout && data.layout.framework === 'golden_exercise_workbench', 'deployed short check must use Golden Workbench framework');
  assert(data.layout.variant === 'golden_advisory_short_check_v1', 'deployed short check variant mismatch');
  assert(data.targetEquivalent && data.targetEquivalent.candidate === false, 'targetEquivalent candidate flag must remain false');
  assert(data.targetEquivalent.gateApproved === false, 'gate approval must remain false');
  assert(data.targetEquivalent.completionLanguageEligible === false, 'completion language must remain false');
  assert(data.metadataAlignment && data.metadataAlignment.targetReadinessEvidence === false, 'target readiness evidence must remain false');
  assert(data.advisory && data.advisory.intent, 'advisory intent is required');
  assert(data.advisory.hintsAbsent === true, 'hintsAbsent must be true for this route');
  assert(Array.isArray(data.contextBlocks) && data.contextBlocks.length === 3, 'short check must contain three context blocks');
  const contextIds = new Set(data.contextBlocks.map((block) => block.id));
  const tasks = (data.tasks || []).filter((item) => item && item.type === 'choice');
  assert(tasks.length === 3, 'short check must contain three choice tasks');
  assert((data.tasks || []).every((item) => item.type !== 'task_shell'), 'short check must not contain task_shell tasks');
  tasks.forEach((task) => {
    assert(Array.isArray(task.options) && task.options.length === 3, `${task.id} must contain three options`);
    assert(task.options.some((option) => option.id === task.answer), `${task.id} answer must match an option`);
    assert(Array.isArray(task.contextRefs) && task.contextRefs.length > 0, `${task.id} must reference context blocks`);
    task.contextRefs.forEach((ref) => assert(contextIds.has(ref), `${task.id} has unknown context ref ${ref}`));
    assert(task.practiceRoute && task.practiceRoute.href, `${task.id} must keep advisory practice route`);
  });
  assertNoOverclaim(studentText(data), 'deployed 1.1.2 short-check student text');
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
  assert(proof.sourceKey === '1.1.2-korte-check', `${capture.case}: source key mismatch`);
  assert(proof.framework === 'golden_exercise_workbench', `${capture.case}: framework mismatch`);
  assert(proof.variant === 'golden_advisory_short_check_v1', `${capture.case}: variant mismatch`);
  assert(proof.surface === 'advisory_short_check', `${capture.case}: surface mismatch`);
  assert(proof.targetEquivalentCandidate === false, `${capture.case}: targetEquivalent candidate must be false`);
  assert(proof.targetReadinessEvidence === false, `${capture.case}: target readiness evidence must be false`);
  assert(proof.hintsAbsent === true, `${capture.case}: hintsAbsent must be true`);
  assert(proof.graphRuntimeLoaded === false, `${capture.case}: graph runtime must not load`);
  assert(proof.legacyAssetCount === 0, `${capture.case}: legacy assets loaded`);
  assert(proof.exitTicketAppCount === 0, `${capture.case}: legacy #exit-ticket-app present`);
  assert(proof.taskCount === 3, `${capture.case}: expected three rendered tasks`);
  assert(proof.choiceTaskCount === 3, `${capture.case}: expected three choice tasks`);
  assert(proof.choiceOptionCount === 9, `${capture.case}: expected nine choice options`);
  assert(proof.contextBlockCount === 3, `${capture.case}: expected three context blocks`);
  assert(proof.workFieldCount === 0, `${capture.case}: work fields must be absent`);
  assert(proof.structuredChoiceCount === 0, `${capture.case}: structured choices must be absent`);
  assert(proof.lockCount === 0, `${capture.case}: independent questions must not be hard-locked`);
  assert(proof.overclaimVisible === false, `${capture.case}: held authority language visible`);

  if (capture.case === 'desktop-light-wrong-retry') {
    assert(proof.firstTaskRetry === true, 'wrong/retry case must show retry feedback');
    assert(proof.completionVisible === false, 'wrong/retry case must not complete');
  }
  if (/local-success$/.test(capture.case)) {
    assert(proof.firstTaskGood === true, `${capture.case}: first task must show local success`);
    assert(proof.completionVisible === false, `${capture.case}: local success must not complete all tasks`);
  }
  if (capture.case === 'desktop-light-completed-advisory') {
    assert(proof.allTaskFeedbackGood === true, 'completed case must show all local checks green');
    assert(proof.completionVisible === true, 'completed case must show advisory completion');
  }
  if (capture.case === 'route-reload') {
    assert(proof.theme === 'dark', 'reload proof must preserve dark theme');
    assert(proof.sourceKey === '1.1.2-korte-check', 'reload proof must keep source key');
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
  assert(proof.static_contract.advisory_authority_passed === true, 'proof JSON must record advisory authority pass');
  assert(proof.rendered_states && proof.rendered_states.hintsAbsent === true, 'proof JSON must record hintsAbsent true');
  assert(proof.authority && proof.authority.generated_lesson_output_changed === true, 'proof JSON must record generated lesson output change');
  [
    'broad_rollout_authorized',
    'target_equivalent_proof_authorized',
    'paragraph_completion_authorized',
    'completion_language_authorized',
    'diagnostics_authorized',
    'mastery_or_sequencing_authorized',
    'grading_authorized',
    'summative_use_authorized',
    'pv_authorized',
    'student_product_use_authorized',
    'product_use_authorized',
    'scale_gate_1_authorized',
  ].forEach((key) => assert(proof.authority[key] === false, `proof JSON authority.${key} must be false`));
  assert(Array.isArray(proof.authority.migrated_routes) && proof.authority.migrated_routes.join(',') === '1.1.2-korte-check', 'proof must migrate only 1.1.2-korte-check');

  assert(manifest.schema_version === 1, 'manifest JSON schema_version must be 1');
  assert(manifest.sprint_id === SPRINT_ID, 'manifest JSON sprint_id mismatch');
  assert(Array.isArray(manifest.cases), 'manifest JSON must list cases');
  const seen = new Set(manifest.cases.map((item) => item.case));
  REQUIRED_CASES.forEach((_expected, id) => assert(seen.has(id), `manifest missing case ${id}`));
  manifest.cases.forEach(checkCase);

  [
    'desktop-light-wrong-retry',
    'desktop-light-local-success',
    'desktop-light-completed-advisory',
    'mobile-dark-local-success',
    'route-reload',
    'no graph runtime',
    'no legacy route assets',
    'hintsAbsent: true',
  ].forEach((needle) => assert(manifestMd.includes(needle), `screenshot manifest missing ${needle}`));
  [
    'Rendered proof complete pending lead review',
    'Advisory only',
    'No broad rollout',
    'No target-equivalent proof',
    'No paragraph completion',
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
  const html = read(pageFile);
  const data = loadDeployedData(dataFile);
  checkHtml(html, pageFile);
  checkData(data, dataFile);
  checkRenderedProof();
  console.log(JSON.stringify({
    ok: true,
    check: SPRINT_ID,
    page: pageFile,
    proof: PROOF_JSON,
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(`${SPRINT_ID} failed: ${error.message}`);
  process.exit(1);
}
