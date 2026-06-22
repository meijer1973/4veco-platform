#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'B1-TARGET-EVIDENCE-111-RENDERED-CLOSURE-AND-FLAG-BUNDLE-1';
const LESSON_BOOK_ROOT = path.resolve(
  process.env.B1_111_BOOK_ROOT ||
    process.env.LESSON_BOOK_ROOT ||
    process.env.MODULE_ROOT ||
    path.join(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const SOURCE_PATH = path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.1-exit-ticket.json');
const PAGE_REL = path.join(
  '1.1 Hoofdstuk Economisch denken en rekenen',
  '1.1.1 Schaarste en economisch denken',
  '1.1.1 Schaarste en economisch denken \u2013 exit-ticket.html'
);
const LANDING_REL = path.join(
  '1.1 Hoofdstuk Economisch denken en rekenen',
  '1.1.1 Schaarste en economisch denken',
  'index.html'
);
const DATA_REL = path.join('shared', 'exit-ticket', '1.1.1-exit-ticket.js');
const PROOF_JSON = path.join(ROOT, 'reports', 'json', 'b1-target-evidence-111-rendered-closure-and-flag-bundle-1-proof.json');
const SCREENSHOT_DIR = path.join(ROOT, 'reports', 'sprints', `${SPRINT_ID}-screenshots`);
const MANIFEST_JSON = path.join(SCREENSHOT_DIR, 'manifest.json');
const MANIFEST_MD = path.join(ROOT, 'reports', 'sprints', `${SPRINT_ID}-screenshot-manifest.md`);
const PROOF_MD = path.join(ROOT, 'reports', 'sprints', `${SPRINT_ID}-rendered-proof.md`);

const REQUIRED_CASES = new Map([
  ['desktop-light-initial', { width: 1280, theme: 'light', route: 'exit-ticket' }],
  ['desktop-light-wrong-retry', { width: 1280, theme: 'light', route: 'exit-ticket' }],
  ['desktop-light-completed-held', { width: 1280, theme: 'light', route: 'exit-ticket' }],
  ['mobile-light-initial', { width: 390, theme: 'light', route: 'exit-ticket' }],
  ['mobile-light-completed-held', { width: 390, theme: 'light', route: 'exit-ticket' }],
  ['mobile-dark-initial', { width: 390, theme: 'dark', route: 'exit-ticket' }],
  ['mobile-dark-completed-held', { width: 390, theme: 'dark', route: 'exit-ticket' }],
  ['route-reload-completed-held', { width: 1280, theme: 'dark', route: 'exit-ticket' }],
  ['landing-mobile-light-neutral', { width: 390, theme: 'light', route: 'landing' }],
  ['landing-desktop-dark-neutral', { width: 1280, theme: 'dark', route: 'landing' }],
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
  assert(fs.existsSync(file), `missing file: ${rel(file)}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON ${rel(file)}: ${error.message}`);
  }
}

function loadGeneratedExitTicketData(file) {
  const source = read(file);
  const context = { module: { exports: {} } };
  context.exports = context.module.exports;
  context.self = context;
  vm.createContext(context);
  vm.runInContext(source, context, { filename: file });
  return context.module.exports;
}

function assertContains(text, needle, label) {
  assert(text.includes(needle), `${label} missing: ${needle}`);
}

function assertNotContains(text, needle, label) {
  assert(!text.includes(needle), `${label} must not contain: ${needle}`);
}

function assertNoOverclaim(text, label) {
  assert(
    !/(aankunt|bewezen|aangetoond|beheerst|diagnos|mastery|summatief|Scale Gate 1|productgebruik|doelopgave-niveau|doelopgave op hetzelfde niveau)/i.test(text),
    `${label} contains held-authority language`
  );
}

function loadedHrefOrSrc(html, fileName) {
  const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp('<(?:link|script)\\b[^>]*(?:href|src)=["\'][^"\']*' + escaped + '["\'][^>]*>', 'i');
  return pattern.test(html);
}

function flattenStudentText(data) {
  const out = [];
  function push(value) {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach(push);
      return;
    }
    if (typeof value === 'object') return;
    const str = String(value).trim();
    if (str) out.push(str);
  }
  push(data.title);
  push(data.intro);
  push(data.parName);
  if (data.skillMap) {
    push(data.skillMap.title);
    (data.skillMap.routes || []).forEach((route) => {
      push(route.label);
      push(route.surface);
    });
  }
  (data.tasks || []).forEach((task) => {
    if (task.type === 'task_shell' && task.taskShell) {
      push(task.taskShell.skillLabel);
      push(task.taskShell.purpose);
      push(task.taskShell.prompt);
      if (task.taskShell.interaction) {
        push(task.taskShell.interaction.workLabel);
        push(task.taskShell.interaction.finalAnswerLabel);
        push(task.taskShell.interaction.placeholder);
        push(task.taskShell.interaction.finalAnswerPlaceholder);
        push(task.taskShell.interaction.unitNotationLabel);
        push(task.taskShell.interaction.unitNotationPlaceholder);
        (task.taskShell.interaction.fields || []).forEach((field) => {
          push(field.label);
          push(field.placeholder);
        });
        (task.taskShell.interaction.options || []).forEach((option) => push(option.label));
      }
      if (task.taskShell.feedback) {
        push(task.taskShell.feedback.matchTitle);
        push(task.taskShell.feedback.matchText);
        push(task.taskShell.feedback.retryTitle);
        push(task.taskShell.feedback.retryText);
      }
      if (task.taskShell.practiceRoute) push(task.taskShell.practiceRoute.label);
    }
  });
  if (data.completion) {
    push(data.completion.title);
    push(data.completion.text);
  }
  return out.join('\n');
}

function checkApprovedSourceAndGeneratedData(source, generated) {
  assert(JSON.stringify(generated) === JSON.stringify(source), 'generated 1.1.1 lesson data must match platform source');
  assert(source.surface === 'target_equivalent_exit_ticket', '1.1.1 keeps target-equivalent exit-ticket surface');
  assert(source.targetEquivalent && source.targetEquivalent.candidate === true, '1.1.1 remains a candidate');
  assert(source.targetEquivalent.gateApproved === true, '1.1.1 gateApproved must record narrow readiness approval');
  assert(source.targetEquivalent.completionLanguageEligible === false, '1.1.1 completionLanguageEligible must remain false');
  assert(source.metadataAlignment.status === 'target_equivalent_aligned', '1.1.1 status must record target-equivalent alignment');
  assert(source.metadataAlignment.targetReadinessEvidence === true, '1.1.1 targetReadinessEvidence must record narrow readiness approval');
  assert(
    JSON.stringify(source.metadataAlignment.notes || []).includes('B1-TARGET-EVIDENCE-111-RENDERED-CLOSURE-AND-FLAG-BUNDLE-1') &&
      JSON.stringify(source.metadataAlignment.notes || []).includes('Completion language remains held'),
    '1.1.1 notes must record narrow readiness approval while holding completion language'
  );
  const tasks = (source.tasks || []).filter((task) => task && task.type === 'task_shell' && task.taskShell);
  assert(tasks.length === 4, '1.1.1 must contain four task shell tasks');
  assert(tasks.filter((task) => task.taskShell.family === 'calculation_work_capture').length === 3, '1.1.1 must contain three calculation tasks');
  assert(tasks.filter((task) => task.taskShell.family === 'structured_short_response').length === 1, '1.1.1 must contain one structured task');
  const studentText = flattenStudentText(source);
  assert(/\bwinst\b/i.test(studentText), '1.1.1 student text must use winst wording');
  assert(!/\bopbrengst\b/i.test(studentText), '1.1.1 student text must not use opbrengst wording');
  assert(!/Bijvoorbeeld\s*(?:5000|3500|4400|euro|de grond is beperkt)/i.test(studentText), '1.1.1 must not leak answer examples in student text');
  assert(!/\b(?:A43|B01|B02|PV|MTU)\b/.test(studentText), '1.1.1 student text must not expose internal codes');
  assertNoOverclaim(studentText, '1.1.1 student text');
}

function checkHtml(html, landing) {
  const label = rel(path.join(LESSON_BOOK_ROOT, PAGE_REL));
  assert(/<main\b[^>]*class=["'][^"']*\bet-page\b[^"']*["'][^>]*id=["']exit-ticket-app["']/i.test(html), `${label}: legacy exit-ticket root required`);
  ['task-shell.css', 'exit-ticket.css', 'task-shell-ui.js', '1.1.1-exit-ticket.js', 'exit-ticket-engine.js', 'exit-ticket-ui.js'].forEach((fileName) => {
    assert(loadedHrefOrSrc(html, fileName), `${label}: must load ${fileName}`);
  });
  ['golden-ticket-layout.js', 'golden-ticket-layout.css', 'golden-ticket-graph.js'].forEach((fileName) => {
    assert(!loadedHrefOrSrc(html, fileName), `${label}: must not load ${fileName}`);
  });
  assertNoOverclaim(html, label);

  const landingLabel = rel(path.join(LESSON_BOOK_ROOT, LANDING_REL));
  assertContains(landing, 'Werk de eindcontrole uit en gebruik de feedback om je volgende oefenstap te kiezen.', landingLabel);
  assertContains(landing, 'box-sizing: border-box', landingLabel);
  assertNoOverclaim(landing, landingLabel);
}

function pngDimensions(file) {
  const buffer = fs.readFileSync(file);
  assert(buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG', `${rel(file)} is not a PNG`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function checkExitTicketCase(capture) {
  const proof = capture.proof || {};
  assert(proof.route === 'exit-ticket', `${capture.case}: route mismatch`);
  assert(proof.parNr === '1.1.1', `${capture.case}: parNr mismatch`);
  assert(proof.surface === 'target_equivalent_exit_ticket', `${capture.case}: surface mismatch`);
  assert(proof.dataLoaded === true && proof.engineLoaded === true && proof.uiLoaded === true, `${capture.case}: route did not load required runtimes`);
  assert(proof.legacyRoot === true, `${capture.case}: legacy root missing`);
  assert(proof.goldenRoot === false, `${capture.case}: unexpected Golden root`);
  assert(proof.taskShellRuntimeLoaded === true, `${capture.case}: task shell runtime missing`);
  assert(proof.taskCount === 4, `${capture.case}: expected four tasks`);
  assert(proof.calculationTaskCount === 3, `${capture.case}: expected three calculation tasks`);
  assert(proof.structuredTaskCount === 1, `${capture.case}: expected one structured task`);
  assert(proof.workFieldCount === 3, `${capture.case}: expected three work fields`);
  assert(proof.finalAnswerFieldCount === 3, `${capture.case}: expected three final answer fields`);
  assert(proof.unitNotationFieldCount === 3, `${capture.case}: expected three unit fields`);
  assert(proof.structuredFieldCount === 3, `${capture.case}: expected three structured fields`);
  assert(proof.structuredChoiceCount === 3, `${capture.case}: expected three structured choices`);
  assert(proof.gateApproved === true, `${capture.case}: gateApproved must record narrow readiness approval`);
  assert(proof.targetReadinessEvidence === true, `${capture.case}: targetReadinessEvidence must record narrow readiness approval`);
  assert(proof.completionLanguageEligible === false, `${capture.case}: completionLanguageEligible must remain false`);
  assert(proof.metadataStatus === 'target_equivalent_aligned', `${capture.case}: metadata status must record target-equivalent alignment`);
  assert(proof.visibleWinst === true, `${capture.case}: winst wording missing`);
  assert(proof.visibleOpbrengst === false, `${capture.case}: opbrengst wording visible`);
  assert(proof.answerRevealingPlaceholderCount === 0, `${capture.case}: answer-revealing placeholders visible`);
  assert(proof.studentVisibleInternalCode === false, `${capture.case}: internal code visible`);
  assert(proof.overclaimVisible === false, `${capture.case}: held-authority language visible`);
  assert(proof.horizontalOverflow === false, `${capture.case}: horizontal overflow detected`);
  assert(proof.engineProgressProbe.finalAnswerOnlyRejected === true, `${capture.case}: final-answer-only attempt must be rejected`);
  assert(proof.engineProgressProbe.completeCorrectProgress.proofCandidate === true, `${capture.case}: complete correct attempt must be a proof candidate`);
  assert(proof.engineProgressProbe.completeCorrectProgress.gateApproved === true, `${capture.case}: complete correct attempt must report approved gate`);
  assert(proof.engineProgressProbe.completeCorrectProgress.completionLanguageEligible === false, `${capture.case}: complete correct attempt must keep completion held`);
  if (capture.case === 'desktop-light-wrong-retry') {
    assert(proof.retryFeedbackCount > 0, 'wrong/retry case must show retry feedback');
    assert(proof.completionVisible === false, 'wrong/retry case must not show completion');
  }
  if (/completed-held$/.test(capture.case)) {
    assert(proof.allTaskFeedbackMatch === true, `${capture.case}: all task feedback must match`);
    assert(proof.matchFeedbackCount === 4, `${capture.case}: expected four match feedback cards`);
    assert(proof.completionHidden === true, `${capture.case}: completion must stay hidden`);
    assert(proof.completionVisible === false, `${capture.case}: completion must not become visible`);
  }
  if (capture.case === 'route-reload-completed-held') {
    assert(proof.theme === 'dark', 'route reload proof must preserve dark theme');
  }
}

function checkLandingCase(capture) {
  const proof = capture.proof || {};
  assert(proof.route === 'landing', `${capture.case}: route mismatch`);
  assert(proof.neutralExitTicketCopyPresent === true, `${capture.case}: neutral exit-ticket copy missing`);
  assert(proof.contentBoxSizingPresent === true, `${capture.case}: content box-sizing proof missing`);
  assert(proof.overclaimVisible === false, `${capture.case}: held-authority language visible`);
  assert(proof.horizontalOverflow === false, `${capture.case}: horizontal overflow detected`);
  assert(Array.isArray(proof.exitTicketLinks) && proof.exitTicketLinks.length >= 1, `${capture.case}: exit-ticket link missing`);
}

function checkCase(capture) {
  const expected = REQUIRED_CASES.get(capture.case);
  assert(expected, `unexpected screenshot case ${capture.case}`);
  assert(capture.route === expected.route, `${capture.case}: expected route ${expected.route}`);
  assert(capture.theme === expected.theme, `${capture.case}: expected theme ${expected.theme}`);
  assert(capture.viewport && capture.viewport.width === expected.width, `${capture.case}: expected viewport width ${expected.width}`);
  const file = path.join(ROOT, capture.file || '');
  assert(fs.existsSync(file), `${capture.case}: missing screenshot ${capture.file}`);
  assert(fs.statSync(file).size > 5000, `${capture.case}: screenshot too small`);
  const dimensions = pngDimensions(file);
  assert(dimensions.width === expected.width, `${capture.case}: screenshot width ${dimensions.width}, expected ${expected.width}`);
  assert(capture.screenshot_dimensions && capture.screenshot_dimensions.width === dimensions.width, `${capture.case}: recorded width mismatch`);
  if (expected.route === 'landing') checkLandingCase(capture);
  else checkExitTicketCase(capture);
}

function checkRenderedProof() {
  const proof = readJson(PROOF_JSON);
  const manifest = readJson(MANIFEST_JSON);
  const manifestMd = read(MANIFEST_MD);
  const proofMd = read(PROOF_MD);

  assert(proof.schema_version === 1, 'proof JSON schema_version must be 1');
  assert(proof.sprint_id === SPRINT_ID, 'proof JSON sprint_id mismatch');
  assert(proof.status === 'rendered_proof_complete_readiness_approved_completion_held', 'proof JSON status mismatch');
  assert(proof.readiness_at_capture.gate_approved === true, 'proof JSON must record gate approval at capture');
  assert(proof.readiness_at_capture.target_readiness_evidence === true, 'proof JSON must record target readiness at capture');
  assert(proof.readiness_at_capture.completion_language_eligible === false, 'proof JSON must keep completion language false at capture');
  assert(proof.readiness_at_capture.complete_correct_attempt_is_proof_candidate === true, 'proof JSON must record complete correct proof candidate');
  assert(proof.readiness_at_capture.final_answer_only_rejected === true, 'proof JSON must record final-answer-only rejection');
  [
    'broad_rollout_authorized',
    'product_route_adoption_authorized',
    'product_use_authorized',
    'scale_gate_1_authorized',
    'target_equivalent_completion_language_authorized',
    'diagnostics_authorized',
    'mastery_or_sequencing_authorized',
    'summative_use_authorized',
    'pv_authorized',
    'student_product_use_authorized',
  ].forEach((key) => assert(proof.authority[key] === false, `proof JSON authority.${key} must be false`));

  assert(manifest.schema_version === 1, 'manifest JSON schema_version must be 1');
  assert(manifest.sprint_id === SPRINT_ID, 'manifest JSON sprint_id mismatch');
  assert(Array.isArray(manifest.cases), 'manifest JSON must list cases');
  const seen = new Set(manifest.cases.map((item) => item.case));
  REQUIRED_CASES.forEach((_expected, id) => assert(seen.has(id), `manifest missing case ${id}`));
  manifest.cases.forEach(checkCase);

  [
    'desktop-light-wrong-retry',
    'desktop-light-completed-held',
    'mobile-dark-completed-held',
    'route-reload-completed-held',
    'landing-mobile-light-neutral',
    'completion block stays hidden',
  ].forEach((needle) => assert(manifestMd.includes(needle), `screenshot manifest missing ${needle}`));
  [
    'Rendered proof complete',
    'narrow target-readiness flags are approved and completion remains held',
    '`targetEquivalent.gateApproved`: true',
    'No product-route adoption',
  ].forEach((needle) => assert(proofMd.includes(needle), `rendered proof report missing ${needle}`));
}

function main() {
  const source = readJson(SOURCE_PATH);
  const generated = loadGeneratedExitTicketData(path.join(LESSON_BOOK_ROOT, DATA_REL));
  checkApprovedSourceAndGeneratedData(source, generated);
  checkHtml(read(path.join(LESSON_BOOK_ROOT, PAGE_REL)), read(path.join(LESSON_BOOK_ROOT, LANDING_REL)));
  checkRenderedProof();
  console.log(`${SPRINT_ID} passed: rendered 1.1.1 proof, approved readiness flags, hidden completion, neutral landing copy, and authority boundaries verified`);
}

try {
  main();
} catch (error) {
  console.error(`check-b1-target-evidence-111-rendered-closure-and-flag-bundle-1 failed: ${error.message}`);
  process.exit(1);
}
