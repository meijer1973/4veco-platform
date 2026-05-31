#!/usr/bin/env node
/**
 * Validate REASON-UX-2 generated reasoning/task-shell output.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.argv[2] || path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);

const CHAPTER = '1.1 Hoofdstuk Economisch denken en rekenen';
const PARAGRAPHS = [
  { parNr: '1.1.1', dir: '1.1.1 Schaarste en economisch denken', name: 'Schaarste en economisch denken' },
  { parNr: '1.1.2', dir: '1.1.2 Percentages en indexcijfers', name: 'Percentages en indexcijfers' },
  { parNr: '1.1.3', dir: '1.1.3 Grafieken en tabellen', name: 'Grafieken en tabellen' }
];

const DEPLOYED_REASONING_ENGINE = path.join(bookRoot, 'shared', 'reasoning-engine.js');
const DEPLOYED_REASONING_UI = path.join(bookRoot, 'shared', 'reasoning-ui.js');
const DEPLOYED_REASONING_CSS = path.join(bookRoot, 'shared', 'reasoning.css');
const DEPLOYED_TASK_SHELL_ENGINE = path.join(bookRoot, 'shared', 'task-shell-engine.js');
const DEPLOYED_TASK_SHELL_UI = path.join(bookRoot, 'shared', 'task-shell-ui.js');
const TARGET_EXERCISES = path.join(platformRoot, 'references', 'authored', 'course-target-exercises.json');
const CANDIDATE_STORAGE = path.join(platformRoot, 'references', 'data', 'exam-ingestion', 'answer-skill-candidates.json');
const EXIT_112_SOURCE = path.join(platformRoot, 'source-data', 'book-1', 'exit-ticket', '1.1.2.json');
const EXIT_113_SOURCE = path.join(platformRoot, 'source-data', 'book-1', 'exit-ticket', '1.1.3.json');

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
  assert(!/\b(?:[A-Z]\d{2}|MTU|PV|GEN_[A-Z]\d{2})\b/.test(text), `${label}: visible text leaks internal code`);
}

function checkNoProductClaim(text, label) {
  const prohibited = /Je hebt laten zien dat je de eindopgave|eindopgave.*aankunt|beheerst|bewezen|aangetoond|\bcijfer\b|summatief|adaptief|diagnose|diagnostisch|automatische route|student-facing AI|PV projection/i;
  assert(!prohibited.test(text), `${label}: prohibited product claim found`);
}

function loadReasoningData(parNr) {
  const dataPath = path.join(bookRoot, 'shared', 'reasoning', `${parNr}.js`);
  const context = {};
  vm.createContext(context);
  vm.runInContext(read(dataPath), context, { filename: dataPath });
  return { csv: context.REASONING_CSV, meta: context.REASONING_META, dataPath };
}

function shellPath(item) {
  return path.join(bookRoot, CHAPTER, item.dir, `${item.parNr} ${item.name} \u2013 redeneer-spel.html`);
}

function checkTargetFieldsStillAbsent() {
  const data = JSON.parse(read(TARGET_EXERCISES));
  const records = data.exercises || data.paragraphs || data;
  for (const parNr of ['1.1.1', '1.1.2', '1.1.3']) {
    const record = records.find(item => item.id === parNr);
    assert(record, `missing target-exercise record ${parNr}`);
    assert(record.question_type === undefined, `${parNr} target exercise must not receive question_type in REASON-UX-2`);
    assert(record.answer_form === undefined, `${parNr} target exercise must not receive answer_form in REASON-UX-2`);
  }
}

function main() {
  const ReasoningEngine = requireFresh(DEPLOYED_REASONING_ENGINE);
  const TaskShellEngine = requireFresh(DEPLOYED_TASK_SHELL_ENGINE);
  const TaskShellUI = requireFresh(DEPLOYED_TASK_SHELL_UI);

  const deployedUi = read(DEPLOYED_REASONING_UI);
  assert(deployedUi.includes('data-reasoning-task-shell="REASON-UX-2"'), 'deployed reasoning UI must render REASON-UX-2 task-shell marker');
  assert(deployedUi.includes('TaskShellUI.renderTask'), 'deployed reasoning UI must render TaskShellUI tasks');
  assert(deployedUi.includes('TaskShellUI.renderFeedback'), 'deployed reasoning UI must render TaskShellUI feedback');
  assert(deployedUi.includes('for (var i = 0; i < modeNames.length; i++)'), 'deployed reasoning UI must render modes dynamically');
  assert(deployedUi.includes('formatReasoningGuide'), 'deployed reasoning UI must render reasoning repair guide');

  const deployedCss = read(DEPLOYED_REASONING_CSS);
  assert(deployedCss.includes('.r-task-shell-mode'), 'deployed reasoning CSS must style embedded task-shell mode');
  assert(deployedCss.includes('.r-feedback-chain'), 'deployed reasoning CSS must style reasoning feedback chains');

  assert(!fs.existsSync(EXIT_112_SOURCE), 'REASON-UX-2 must not write source-data/book-1/exit-ticket/1.1.2.json');
  assert(!fs.existsSync(EXIT_113_SOURCE), 'REASON-UX-2 must not write source-data/book-1/exit-ticket/1.1.3.json');
  assert(!fs.existsSync(CANDIDATE_STORAGE), 'REASON-UX-2 must not create answer-skill candidate storage');
  checkTargetFieldsStillAbsent();

  assert(ReasoningEngine.MODE_NAMES_NL.length === 6, 'ReasoningEngine must expose six modes after REASON-UX-2');
  assert(ReasoningEngine.MODE_NAMES_NL[5] === 'Redeneerantwoord opbouwen', 'mode 5 must be the structured reasoning answer mode');

  const taskHtml = [];
  for (const item of PARAGRAPHS) {
    const page = read(shellPath(item));
    assert(page.includes('task-shell.css'), `${item.parNr} reasoning page must load task-shell.css`);
    assert(page.includes('task-shell-engine.js'), `${item.parNr} reasoning page must load task-shell-engine.js`);
    assert(page.includes('task-shell-ui.js'), `${item.parNr} reasoning page must load task-shell-ui.js`);
    assert(page.includes('skill-map-route-ui.js'), `${item.parNr} reasoning page must load skill-map-route-ui.js`);
    checkNoStudentCodeLeak(visibleText(page), `${item.parNr} reasoning page static HTML`);
    checkNoProductClaim(visibleText(page), `${item.parNr} reasoning page static HTML`);

    const data = loadReasoningData(item.parNr);
    const engine = new ReasoningEngine({
      csvString: data.csv,
      domain: data.meta.domain,
      parNr: data.meta.parNr,
      roundsPerGame: 3
    });
    const info = engine.startGame(5);
    assert(info.modeName === 'Redeneerantwoord opbouwen', `${item.parNr} mode 5 start info mismatch`);
    const round = engine.getRound();
    assert(round && round.mode === 5, `${item.parNr} mode 5 round missing`);
    assert(round.taskShellTask.family === 'structured_reasoning', `${item.parNr} mode 5 must use structured_reasoning`);
    TaskShellEngine.validateTask(round.taskShellTask);
    assert(TaskShellEngine.findStudentTextViolations(round.taskShellTask).length === 0, `${item.parNr} task shell text violation`);

    const rendered = TaskShellUI.renderTask(round.taskShellTask, 0);
    taskHtml.push(rendered);
    assert(rendered.includes('data-task-family="structured_reasoning"'), `${item.parNr} rendered task missing structured_reasoning marker`);
    checkNoStudentCodeLeak(visibleText(rendered), `${item.parNr} structured reasoning task`);
    checkNoProductClaim(visibleText(rendered), `${item.parNr} structured reasoning task`);

    const result = engine.submitAnswer('Ik noem de oorzaak, leg een tussenstap uit en sluit af met de conclusie.');
    assert(result.correct === true, `${item.parNr} non-empty reasoning response must complete local self-check`);
    assert(result.feedback.taskShellResult.state === 'self_check', `${item.parNr} task-shell result must be self_check`);
    const feedbackHtml = TaskShellUI.renderFeedback(result.feedback.taskShellResult);
    assert(feedbackHtml.includes('data-feedback-state="self_check"'), `${item.parNr} feedback missing self_check marker`);
    checkNoStudentCodeLeak(visibleText(feedbackHtml), `${item.parNr} structured reasoning feedback`);
    checkNoProductClaim(visibleText(feedbackHtml), `${item.parNr} structured reasoning feedback`);
  }

  assert(taskHtml.join('\n').includes('data-input-role="answer"'), 'rendered structured reasoning tasks must include answer textarea');
  console.log(`REASON-UX-2 route output OK (${PARAGRAPHS.length} reasoning pages; six modes; structured_reasoning task shell)`);
}

try {
  main();
} catch (error) {
  console.error(`REASON-UX-2 route output check failed: ${error.message}`);
  process.exit(1);
}
