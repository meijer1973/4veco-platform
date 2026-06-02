#!/usr/bin/env node
/**
 * Validate REASON-ADOPT-1 generated reasoning/shared-shell route output.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.argv[2] || path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);

const CHAPTER = '1.1 Hoofdstuk Economisch denken en rekenen';
const PARAGRAPHS = [
  { parNr: '1.1.1', dir: '1.1.1 Schaarste en economisch denken' },
  { parNr: '1.1.2', dir: '1.1.2 Percentages en indexcijfers' },
  { parNr: '1.1.3', dir: '1.1.3 Grafieken en tabellen' }
];

const DEPLOYED_REASONING_ENGINE = path.join(bookRoot, 'shared', 'reasoning-engine.js');
const DEPLOYED_REASONING_UI = path.join(bookRoot, 'shared', 'reasoning-ui.js');
const DEPLOYED_REASONING_CSS = path.join(bookRoot, 'shared', 'reasoning.css');
const DEPLOYED_TASK_SHELL_ENGINE = path.join(bookRoot, 'shared', 'task-shell-engine.js');
const DEPLOYED_TASK_SHELL_UI = path.join(bookRoot, 'shared', 'task-shell-ui.js');
const TARGET_EXERCISES = path.join(platformRoot, 'references', 'authored', 'course-target-exercises.json');
const CANDIDATE_STORAGE = path.join(platformRoot, 'references', 'data', 'exam-ingestion', 'answer-skill-candidates.json');

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(filePath) {
  assert(fs.existsSync(filePath), `Missing file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function requireFresh(filePath) {
  const resolved = require.resolve(filePath);
  delete require.cache[resolved];
  return require(resolved);
}

function visibleText(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function checkNoStudentCodeLeak(text, label) {
  assert(!/\b(?:[A-Z]\d{2}|MTU|PV|GEN_[A-Z]\d{2}|REASON-ADOPT-1|REASON-STD-1)\b/.test(text), `${label}: visible text leaks internal code`);
}

function checkNoProductClaim(text, label) {
  const prohibited = /Je hebt laten zien dat je de eindopgave|eindopgave.*aankunt|beheerst|bewezen|aangetoond|\bcijfer\b|summatief|adaptief|diagnose|diagnostisch|automatische route|student-facing AI|PV projection/i;
  assert(!prohibited.test(text), `${label}: prohibited product claim found`);
}

function listFilesRecursive(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  entries.forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFilesRecursive(full));
    else files.push(full);
  });
  return files;
}

function shellPath(item) {
  const dir = path.join(bookRoot, CHAPTER, item.dir);
  const matches = listFilesRecursive(dir).filter((file) => /redeneer-spel\.html$/i.test(file));
  assert(matches.length === 1, `${item.parNr}: expected exactly one redeneer-spel HTML file, found ${matches.length}`);
  return matches[0];
}

function loadReasoningData(parNr) {
  const dataPath = path.join(bookRoot, 'shared', 'reasoning', `${parNr}.js`);
  const context = {};
  vm.createContext(context);
  vm.runInContext(read(dataPath), context, { filename: dataPath });
  return { csv: context.REASONING_CSV, meta: context.REASONING_META, dataPath };
}

function legacyAnswerFromTask(round) {
  const labels = {};
  (round.taskShellTask.interaction.steps || []).forEach((step) => {
    labels[step.id] = step.label;
  });
  return round.taskShellTask.expected.order.map((stepId) => labels[stepId] || stepId);
}

function wrongOrder(order) {
  if (!Array.isArray(order) || order.length < 2) return order || [];
  return [order[1], order[0]].concat(order.slice(2));
}

function checkTargetFieldsStillAbsent() {
  const data = JSON.parse(read(TARGET_EXERCISES));
  const records = data.exercises || data.paragraphs || data;
  ['1.1.1', '1.1.2', '1.1.3'].forEach((parNr) => {
    const record = records.find((item) => item.id === parNr);
    assert(record, `missing target-exercise record ${parNr}`);
    assert(record.question_type === undefined, `${parNr} target exercise must not receive question_type in REASON-ADOPT-1`);
    assert(record.answer_form === undefined, `${parNr} target exercise must not receive answer_form in REASON-ADOPT-1`);
  });
}

function checkNoSourceDataWrites() {
  const status = execFileSync('git', [
    'status',
    '--short',
    '--',
    'source-data/book-1/reasoning',
    'source-data/book-1/exit-ticket'
  ], { cwd: platformRoot, encoding: 'utf8' }).trim();
  assert(!status, `REASON-ADOPT-1 must not mutate source-data; git status:\n${status}`);
}

function checkMode(ReasoningEngine, TaskShellEngine, TaskShellUI, item, mode, expectedFamily) {
  const data = loadReasoningData(item.parNr);
  const engine = new ReasoningEngine({
    csvString: data.csv,
    domain: data.meta.domain,
    parNr: data.meta.parNr,
    roundsPerGame: 3
  });
  const info = engine.startGame(mode);
  const round = engine.getRound();
  assert(info && info.modeName, `${item.parNr} mode ${mode}: missing start info`);
  assert(round && round.mode === mode, `${item.parNr} mode ${mode}: round missing`);
  assert(round.taskShellTask, `${item.parNr} mode ${mode}: missing taskShellTask`);
  assert(round.taskShellTask.family === expectedFamily, `${item.parNr} mode ${mode}: expected ${expectedFamily}, got ${round.taskShellTask.family}`);
  TaskShellEngine.validateTask(round.taskShellTask);
  assert(TaskShellEngine.findStudentTextViolations(round.taskShellTask).length === 0, `${item.parNr} mode ${mode}: task shell text violation`);

  const rendered = TaskShellUI.renderTask(round.taskShellTask, 0);
  assert(rendered.includes(`data-task-family="${expectedFamily}"`), `${item.parNr} mode ${mode}: rendered task missing family marker`);
  checkNoStudentCodeLeak(visibleText(rendered), `${item.parNr} mode ${mode} rendered task`);
  checkNoProductClaim(visibleText(rendered), `${item.parNr} mode ${mode} rendered task`);

  if (expectedFamily === 'step_ordering') {
    const correctTaskResult = TaskShellEngine.evaluateTask(round.taskShellTask, { order: round.taskShellTask.expected.order });
    assert(correctTaskResult.state === 'matched', `${item.parNr} mode ${mode}: expected order must match in task shell`);
    const legacyAnswer = legacyAnswerFromTask(round);
    const legacyResult = engine.submitAnswer(legacyAnswer);
    assert(legacyResult.correct === true, `${item.parNr} mode ${mode}: task-shell answer must map to legacy scoring`);

    const wrongEngine = new ReasoningEngine({
      csvString: data.csv,
      domain: data.meta.domain,
      parNr: data.meta.parNr,
      roundsPerGame: 3
    });
    wrongEngine.startGame(mode);
    const wrongRound = wrongEngine.getRound();
    const wrongTaskResult = TaskShellEngine.evaluateTask(wrongRound.taskShellTask, {
      order: wrongOrder(wrongRound.taskShellTask.expected.order)
    });
    assert(wrongTaskResult.state === 'retry', `${item.parNr} mode ${mode}: wrong task-shell order must retry`);
    assert(wrongTaskResult.matched === false, `${item.parNr} mode ${mode}: wrong task-shell order must not match`);
    const wrongLegacy = legacyAnswerFromTask(Object.assign({}, wrongRound, {
      taskShellTask: Object.assign({}, wrongRound.taskShellTask, {
        expected: Object.assign({}, wrongRound.taskShellTask.expected, {
          order: wrongOrder(wrongRound.taskShellTask.expected.order)
        })
      })
    }));
    const wrongLegacyResult = wrongEngine.submitAnswer(wrongLegacy);
    assert(wrongLegacyResult.correct === false, `${item.parNr} mode ${mode}: wrong task-shell order must map to wrong legacy scoring`);
    const feedbackHtml = TaskShellUI.renderFeedback(wrongTaskResult);
    assert(feedbackHtml.includes('data-feedback-state="retry"'), `${item.parNr} mode ${mode}: retry feedback missing`);
    checkNoStudentCodeLeak(visibleText(feedbackHtml), `${item.parNr} mode ${mode} retry feedback`);
    checkNoProductClaim(visibleText(feedbackHtml), `${item.parNr} mode ${mode} retry feedback`);
  }

  if (expectedFamily === 'structured_reasoning') {
    const result = engine.submitAnswer('Ik noem de oorzaak, leg de tussenstap uit en sluit af met de conclusie.');
    assert(result.correct === true, `${item.parNr} mode ${mode}: non-empty reasoning response must complete local self-check`);
    assert(result.selfCheckOnly === true, `${item.parNr} mode ${mode}: structured reasoning must remain self-check only`);
    assert(result.feedback.taskShellResult.state === 'self_check', `${item.parNr} mode ${mode}: task-shell result must be self_check`);
    const feedbackHtml = TaskShellUI.renderFeedback(result.feedback.taskShellResult);
    assert(feedbackHtml.includes('data-feedback-state="self_check"'), `${item.parNr} mode ${mode}: self_check feedback missing`);
    checkNoStudentCodeLeak(visibleText(feedbackHtml), `${item.parNr} mode ${mode} self-check feedback`);
    checkNoProductClaim(visibleText(feedbackHtml), `${item.parNr} mode ${mode} self-check feedback`);
  }
}

function checkHeldModes(ReasoningEngine, item) {
  const data = loadReasoningData(item.parNr);
  [2, 4].forEach((mode) => {
    const engine = new ReasoningEngine({
      csvString: data.csv,
      domain: data.meta.domain,
      parNr: data.meta.parNr,
      roundsPerGame: 3
    });
    engine.startGame(mode);
    const round = engine.getRound();
    assert(round && round.mode === mode, `${item.parNr} mode ${mode}: round missing`);
    assert(!round.taskShellTask, `${item.parNr} mode ${mode}: held mode must not expose taskShellTask`);
    assert(round.standardFamily, `${item.parNr} mode ${mode}: held mode must carry standardFamily disposition`);
  });
}

function main() {
  const ReasoningEngine = requireFresh(DEPLOYED_REASONING_ENGINE);
  const TaskShellEngine = requireFresh(DEPLOYED_TASK_SHELL_ENGINE);
  const TaskShellUI = requireFresh(DEPLOYED_TASK_SHELL_UI);

  const deployedUi = read(DEPLOYED_REASONING_UI);
  assert(deployedUi.includes('data-reasoning-task-shell="REASON-ADOPT-1"'), 'deployed reasoning UI must render REASON-ADOPT-1 task-shell marker');
  assert(deployedUi.includes('data-reasoning-task-shell="REASON-UX-2"'), 'deployed reasoning UI must keep REASON-UX-2 structured reasoning marker');
  assert(deployedUi.includes('bindStandardOrderingTask'), 'deployed reasoning UI must bind standard ordering tasks');
  assert(deployedUi.includes('TaskShellUI.handleStepOrderingClick'), 'deployed reasoning UI must use shared step-order click handler');
  assert(deployedUi.includes('TaskShellUI.collectStepOrderingResponse'), 'deployed reasoning UI must collect shared step-order responses');
  assert(deployedUi.includes('standardOrderingToLegacyAnswer'), 'deployed reasoning UI must map standard order to legacy scoring');
  assert(deployedUi.includes('TaskShellEngine.evaluateTask'), 'deployed reasoning UI must evaluate local task-shell feedback');
  assert(deployedUi.includes('case 2: content = renderFindError(); break;'), 'mode 2 must remain private/held');
  assert(deployedUi.includes('case 4: content = renderMatchStructures(); break;'), 'mode 4 must remain private/held');

  const deployedCss = read(DEPLOYED_REASONING_CSS);
  assert(deployedCss.includes('.r-task-shell-mode'), 'deployed reasoning CSS must style embedded task-shell mode');

  checkNoSourceDataWrites();
  assert(!fs.existsSync(CANDIDATE_STORAGE), 'REASON-ADOPT-1 must not create answer-skill candidate storage');
  checkTargetFieldsStillAbsent();

  PARAGRAPHS.forEach((item) => {
    const page = read(shellPath(item));
    assert(page.includes('task-shell.css'), `${item.parNr} reasoning page must load task-shell.css`);
    assert(page.includes('task-shell-engine.js'), `${item.parNr} reasoning page must load task-shell-engine.js`);
    assert(page.includes('task-shell-ui.js'), `${item.parNr} reasoning page must load task-shell-ui.js`);
    assert(page.includes('reasoning-ui.js'), `${item.parNr} reasoning page must load reasoning-ui.js`);
    assert(page.includes('skill-map-route-ui.js'), `${item.parNr} reasoning page must load skill-map-route-ui.js`);
    checkNoStudentCodeLeak(visibleText(page), `${item.parNr} reasoning page static HTML`);
    checkNoProductClaim(visibleText(page), `${item.parNr} reasoning page static HTML`);

    checkMode(ReasoningEngine, TaskShellEngine, TaskShellUI, item, 0, 'step_ordering');
    checkMode(ReasoningEngine, TaskShellEngine, TaskShellUI, item, 1, 'step_ordering');
    checkMode(ReasoningEngine, TaskShellEngine, TaskShellUI, item, 3, 'step_ordering');
    checkMode(ReasoningEngine, TaskShellEngine, TaskShellUI, item, 5, 'structured_reasoning');
    checkHeldModes(ReasoningEngine, item);
  });

  console.log(`REASON-ADOPT-1 route output OK (${PARAGRAPHS.length} reasoning pages; modes 0/1/3 shared step_ordering; mode 5 self-check preserved)`);
}

try {
  main();
} catch (error) {
  console.error(`REASON-ADOPT-1 route output check failed: ${error.message}`);
  process.exit(1);
}
