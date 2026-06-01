#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const BOOK_ROOT = path.resolve(
  process.argv[2] || path.join(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);

const TaskShellEngine = require('../../engines/task-shell-engine');
const ExitTicketEngine = require('../../engines/exit-ticket-engine');
const ExitTicketUI = require('../../engines/exit-ticket-ui');

function fail(message) {
  console.error(`TASK-SHELL-UX-2 check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function requireText(content, needle, label, file) {
  assert(content.includes(needle), `${file} missing ${label}`);
}

function rejectPattern(content, pattern, label, file) {
  assert(!pattern.test(content), `${file} contains forbidden ${label}`);
}

function gitStatus(paths, label) {
  const result = spawnSync('git', ['status', '--porcelain', '--', ...paths], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    fail(`git status failed for ${label}`);
  }
  if (result.stdout.trim()) fail(`${label} has forbidden changes:\n${result.stdout.trim()}`);
}

function hasHints(value) {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.some(hasHints);
  return Object.entries(value).some(([key, nested]) => /hints?/i.test(key) || hasHints(nested));
}

function exitTicketTaskShells(data) {
  return data.tasks
    .filter((task) => task.type === 'task_shell')
    .map((task) => task.taskShell);
}

function checkSourceContracts() {
  const engine = read(path.join(ROOT, 'engines', 'task-shell-engine.js'));
  const ui = read(path.join(ROOT, 'engines', 'task-shell-ui.js'));
  const css = read(path.join(ROOT, 'engines', 'task-shell.css'));
  const exitUi = read(path.join(ROOT, 'engines', 'exit-ticket-ui.js'));
  const skilltreeUi = read(path.join(ROOT, 'engines', 'skilltree-ui.js'));
  const graphUi = read(path.join(ROOT, 'engines', 'graphical-ui.js'));

  requireText(engine, 'unitNotationMatches', 'unit notation matcher', 'engines/task-shell-engine.js');
  requireText(engine, 'validateUnitNotation', 'unit notation validation', 'engines/task-shell-engine.js');
  requireText(engine, 'validateHints', 'hidden hint validation', 'engines/task-shell-engine.js');
  requireText(ui, "'unit-notation'", 'unit notation input', 'engines/task-shell-ui.js');
  requireText(ui, 'class="ts-hints"', 'collapsed hints renderer', 'engines/task-shell-ui.js');
  requireText(ui, 'aria-label="Feedback op je antwoord"', 'feedback accessible label', 'engines/task-shell-ui.js');
  requireText(ui, 'ts-feedback-actions', 'feedback action wrapper', 'engines/task-shell-ui.js');
  requireText(css, '.ts-answer-grid', 'answer grid CSS', 'engines/task-shell.css');
  requireText(css, '.ts-hints', 'hidden hint CSS', 'engines/task-shell.css');
  requireText(css, '.ts-feedback-action', 'feedback action CSS', 'engines/task-shell.css');
  requireText(exitUi, 'unitNotation:', 'exit-ticket unit notation collector', 'engines/exit-ticket-ui.js');
  requireText(exitUi, 'removeTaskShellFeedbackRegion', 'exit-ticket duplicate feedback removal', 'engines/exit-ticket-ui.js');
  requireText(exitUi, 'showCriteriaBeforeCheck = false', 'exit-ticket pre-attempt criteria suppression', 'engines/exit-ticket-ui.js');
  requireText(exitUi, 'feedback.focus', 'exit-ticket feedback focus', 'engines/exit-ticket-ui.js');
  requireText(skilltreeUi, 'unitNotation:', 'skilltree unit notation collector', 'engines/skilltree-ui.js');
  requireText(skilltreeUi, 'removeTaskShellFeedbackRegion', 'skilltree duplicate feedback removal', 'engines/skilltree-ui.js');
  requireText(graphUi, 'unitNotation:', 'graph unit notation collector', 'engines/graphical-ui.js');
  requireText(graphUi, 'removeTaskShellFeedbackRegion', 'graph duplicate feedback removal', 'engines/graphical-ui.js');
}

function checkExitTicketSource() {
  const targetData = readJson(path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.2.json'));
  const advisoryData = readJson(path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.1.json'));

  assert(ExitTicketEngine.validateData(targetData), '1.1.2 exit-ticket source must validate');
  assert(!advisoryData.targetEquivalent, '1.1.1 must not become target-equivalent');
  assert(advisoryData.metadataAlignment.targetReadinessEvidence === false, '1.1.1 must remain advisory target-readiness false');
  assert(!fs.existsSync(path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.3.json')), '1.1.3 exit-ticket source must remain absent');

  const taskShells = exitTicketTaskShells(targetData);
  const calcTasks = taskShells.filter((task) => task.family === 'calculation_work_capture');
  assert(calcTasks.length === 3, '1.1.2 must have three calculation-work tasks');
  for (const task of calcTasks) {
    assert(task.interaction.unitNotationLabel, `${task.id} missing unitNotationLabel`);
    assert(task.expected.unitNotation, `${task.id} missing expected.unitNotation`);
    assert(task.expected.unitNotation.required === false, `${task.id} unit notation must be optional in this sprint`);
    TaskShellEngine.validateTask(task);
  }
  assert(!hasHints(targetData), '1.1.2 exit-ticket source must not expose hints');

  const engine = new ExitTicketEngine({ data: targetData });
  const rendered = ExitTicketUI.renderStaticHtml(targetData, ExitTicketUI.buildSkillView(targetData, engine, {}));
  rejectPattern(rendered, /Bijvoorbeeld\s+(?:15|108|3,7|4 indexpunten)/i, 'answer-revealing exit-ticket placeholders', 'rendered 1.1.2 exit-ticket');
  rejectPattern(rendered, /class="ts-criteria"/i, 'pre-attempt criteria bullets', 'rendered 1.1.2 exit-ticket');
  requireText(rendered, 'Vul je eindantwoord in', 'neutral final answer placeholder', 'rendered 1.1.2 exit-ticket');
  requireText(rendered, 'Vul de notatie in', 'neutral notation placeholder', 'rendered 1.1.2 exit-ticket');

  const compact = engine.checkTask('index-naar-waarde', {
    work: '162 / 150 x 100',
    finalAnswer: '108',
    unitNotation: '',
  });
  assert(compact.matched === true, 'task 2 must accept compact answer 108 with correct work and blank optional notation');

  const withNotation = engine.checkTask('index-naar-waarde', {
    work: '162 / 150 x 100',
    finalAnswer: '108',
    unitNotation: 'indexcijfer',
  });
  assert(withNotation.matched === true, 'task 2 must accept 108 with explicit indexcijfer notation');

  const wrongNotation = engine.checkTask('index-naar-waarde', {
    work: '162 / 150 x 100',
    finalAnswer: '108',
    unitNotation: '%',
  });
  assert(wrongNotation.matched === false, 'task 2 must reject wrong percent notation when filled');
}

function checkGeneratedOutput() {
  const chapter = '1.1 Hoofdstuk Economisch denken en rekenen';
  const par112 = path.join(BOOK_ROOT, chapter, '1.1.2 Percentages en indexcijfers');
  const exitPage = path.join(par112, '1.1.2 Percentages en indexcijfers \u2013 exit-ticket.html');
  const shared = path.join(BOOK_ROOT, 'shared');

  const deployedUi = read(path.join(shared, 'task-shell-ui.js'));
  const deployedEngine = read(path.join(shared, 'task-shell-engine.js'));
  const deployedCss = read(path.join(shared, 'task-shell.css'));
  const exitData = read(path.join(shared, 'exit-ticket', '1.1.2.js'));
  const page = read(exitPage);

  requireText(deployedUi, "'unit-notation'", 'deployed unit notation input', 'shared/task-shell-ui.js');
  requireText(deployedUi, 'class="ts-hints"', 'deployed hidden hints renderer', 'shared/task-shell-ui.js');
  requireText(deployedEngine, 'unitNotationMatches', 'deployed unit notation matcher', 'shared/task-shell-engine.js');
  requireText(deployedCss, '.ts-answer-grid', 'deployed answer grid CSS', 'shared/task-shell.css');
  requireText(exitData, 'unitNotationLabel', 'generated 1.1.2 unit notation labels', 'shared/exit-ticket/1.1.2.js');
  requireText(exitData, '"required": false', 'generated 1.1.2 optional notation', 'shared/exit-ticket/1.1.2.js');
  requireText(page, 'task-shell-ui.js', 'exit-ticket shared task shell UI script', exitPage);
  requireText(page, 'exit-ticket-ui.js', 'exit-ticket UI script', exitPage);
  rejectPattern(exitData, /"hints?"\s*:/i, 'exit-ticket task hints', 'shared/exit-ticket/1.1.2.js');
  assert(!fs.existsSync(path.join(shared, 'exit-ticket', '1.1.3.js')), 'generated 1.1.3 exit-ticket data must remain absent');
}

function checkReports() {
  const plan = read(path.join(ROOT, 'reports', 'sprints', 'TASK-SHELL-UX-2-plan.md'));
  const baseline = read(path.join(ROOT, 'reports', 'sprints', 'TASK-SHELL-UX-2-baseline.md'));
  const planningReview = read(path.join(ROOT, 'reports', 'sprints', 'TASK-SHELL-UX-2-planning-review.md'));
  const contract = read(path.join(ROOT, 'reports', 'sprints', 'TASK-SHELL-UX-2-ui-contract.md'));
  const screenshotManifest = read(path.join(ROOT, 'reports', 'sprints', 'TASK-SHELL-UX-2-screenshot-manifest.md'));
  const captureManifest = readJson(path.join(ROOT, 'reports', 'sprints', 'TASK-SHELL-UX-2-screenshots', 'manifest.json'));
  const proof = readJson(path.join(ROOT, 'reports', 'json', 'task-shell-ux2-proof.json'));

  requireText(plan, 'Quality Standard', 'quality standard', 'TASK-SHELL-UX-2-plan.md');
  requireText(baseline, 'Baseline', 'baseline section', 'TASK-SHELL-UX-2-baseline.md');
  requireText(planningReview, 'PASS', 'planning review pass', 'TASK-SHELL-UX-2-planning-review.md');
  for (const needle of ['structured_short_response', 'unitNotation', 'Hints', 'Feedback']) {
    requireText(contract, needle, `UI contract ${needle}`, 'TASK-SHELL-UX-2-ui-contract.md');
  }
  assert(proof.schema_version === 1, 'proof JSON schema_version must be 1');
  assert(proof.sprint_id === 'TASK-SHELL-UX-2', 'proof JSON sprint id mismatch');
  assert(proof.unit_notation && proof.unit_notation.task_2_accepts_108 === true, 'proof JSON must record task 2 108 acceptance');
  assert(proof.hint_policy && proof.hint_policy.exit_ticket_content_hints === false, 'proof JSON must record exit-ticket no-hint boundary');
  assert(proof.feedback_flow && proof.feedback_flow.single_controlled_region === true, 'proof JSON must record single feedback region');
  requireText(screenshotManifest, 'desktop-light-112-exit-ticket-unit-fields.png', 'exit-ticket screenshot case', 'TASK-SHELL-UX-2-screenshot-manifest.md');
  requireText(screenshotManifest, 'desktop-light-112-math-task-shell.png', 'math screenshot case', 'TASK-SHELL-UX-2-screenshot-manifest.md');
  requireText(screenshotManifest, 'desktop-light-113-graph-task-shell.png', 'graph screenshot case', 'TASK-SHELL-UX-2-screenshot-manifest.md');
  requireText(screenshotManifest, 'desktop-light-112-reasoning-task-shell.png', 'reasoning screenshot case', 'TASK-SHELL-UX-2-screenshot-manifest.md');
  requireText(screenshotManifest, 'mobile-dark-112-exit-ticket-task-shell.png', 'mobile dark screenshot case', 'TASK-SHELL-UX-2-screenshot-manifest.md');
  assert(Array.isArray(captureManifest.cases) && captureManifest.cases.length === 6, 'screenshot capture manifest must record six cases');
  for (const item of captureManifest.cases) {
    assert(fs.existsSync(path.join(ROOT, item.file)), `missing screenshot file: ${item.file}`);
    assert(item.proof && Object.keys(item.proof).length > 0, `${item.case} must include non-empty rendered proof`);
  }
}

function checkForbiddenBoundaries() {
  gitStatus(['references/machine', 'references/external'], 'protected references');
  gitStatus(['references/authored/course-target-exercises.json'], 'target-exercise registry');
  gitStatus(['references/data/exam-ingestion/answer-skill-candidates.json'], 'answer-skill candidate storage');
  gitStatus(['source-data/book-1/exit-ticket/1.1.3.json'], '1.1.3 exit-ticket source');
}

function main() {
  checkSourceContracts();
  checkExitTicketSource();
  checkGeneratedOutput();
  checkReports();
  checkForbiddenBoundaries();
  console.log('TASK-SHELL-UX-2 check passed');
}

main();
