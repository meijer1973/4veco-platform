#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const BOOK_ROOT = path.resolve(
  process.argv[2] || path.join(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const CHAPTER_ROOT = path.join(BOOK_ROOT, '1.1 Hoofdstuk Economisch denken en rekenen');
const proofPath = path.join(ROOT, 'reports', 'json', 'graph-exit-ux1-proof.json');

const ExitTicketEngine = require('../../engines/exit-ticket-engine');
const ExitTicketUI = require('../../engines/exit-ticket-ui');
const TaskShellEngine = require('../../engines/task-shell-engine');

function fail(message) {
  console.error(`GRAPH-EXIT-UX-1 check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(file) {
  assert(fs.existsSync(file), `missing required file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function requireText(content, pattern, label) {
  if (typeof pattern === 'string') {
    assert(content.includes(pattern), `missing ${label}`);
    return;
  }
  assert(pattern.test(content), `missing ${label}`);
}

function rejectText(content, pattern, label) {
  assert(!pattern.test(content), `contains forbidden ${label}`);
}

function sourcePath(key) {
  return path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', `${key}.json`);
}

function taskShells(data) {
  return (data.tasks || []).filter((task) => task.type === 'task_shell').map((task) => task.taskShell);
}

function findTask(data, id) {
  const task = taskShells(data).find((item) => item.id === id);
  assert(task, `missing task ${id}`);
  return task;
}

function findParagraphDir(paragraphId) {
  const entry = fs.readdirSync(CHAPTER_ROOT, { withFileTypes: true })
    .find((item) => item.isDirectory() && item.name.startsWith(`${paragraphId} `));
  assert(entry, `missing generated paragraph directory for ${paragraphId}`);
  return path.join(CHAPTER_ROOT, entry.name);
}

function findGeneratedFile(paragraphId, suffix) {
  const dir = findParagraphDir(paragraphId);
  const match = fs.readdirSync(dir).find((file) => file.endsWith(`${suffix}.html`));
  assert(match, `missing generated ${paragraphId} ${suffix} page`);
  return path.join(dir, match);
}

function checkSource() {
  const data = readJson(sourcePath('1.1.3-exit-ticket'));
  assert(ExitTicketEngine.validateData(data), '1.1.3-exit-ticket must validate');
  assert(data.surface === 'target_equivalent_exit_ticket', '1.1.3 must remain target-equivalent candidate surface');
  assert(data.targetEquivalent.candidate === true, '1.1.3 must remain candidate');
  assert(data.targetEquivalent.gateApproved === false, '1.1.3 must not become gate approved');
  assert(data.targetEquivalent.completionLanguageEligible === false, '1.1.3 completion language must remain held');
  assert(data.metadataAlignment.targetReadinessEvidence === false, '1.1.3 must not claim target readiness');
  assert(data.layout && data.layout.kind === 'source_task_workspace', '1.1.3 exit ticket must opt into source/task workspace');
  assert(Array.isArray(data.contextBlocks) && data.contextBlocks.length === 4, '1.1.3 exit ticket must retain four context blocks');
  assert(data.contextBlocks.some((block) => block.type === 'table'), '1.1.3 exit ticket must include table context');
  assert(data.tasks.every((task) => task.type === 'task_shell'), '1.1.3 exit ticket must use task-shell tasks');

  const families = taskShells(data).map((task) => task.family);
  assert(families.includes('graph_construction_substitute'), '1.1.3 exit ticket must include graph construction');
  assert(families.includes('graph_reading'), '1.1.3 exit ticket must include graph reading');
  assert(families.includes('calculation_work_capture'), '1.1.3 exit ticket must include calculation/halving task');

  const graphTask = findTask(data, 'grafiek-tekenen');
  assert(graphTask.interaction.axes.x.ticks.join(',') === '0,100,200,300,400,500', 'graph x ticks must be table-derived');
  assert(graphTask.interaction.axes.y.ticks.join(',') === '0,1,1.5,2,2.5,3', 'graph y ticks must be table-derived');
  const graphResult = TaskShellEngine.evaluateTask(graphTask, {
    axes: { x: 'Q', y: 'P' },
    points: [{ x: 500, y: 1 }, { x: 100, y: 3 }],
    lineShape: 'decreasing',
  });
  assert(graphResult.matched === true, 'graph task must accept correct axes, points, and line');
  const readingResult = TaskShellEngine.evaluateTask(findTask(data, 'grafiek-aflezen'), '350');
  assert(readingResult.matched === true, 'graph reading must accept 350');
  const halvingResult = TaskShellEngine.evaluateTask(findTask(data, 'halvering-controleren'), {
    work: '400 ijsjes naar 200 ijsjes; de helft van de oude hoeveelheid',
    finalAnswer: 'Q daalt met 50 procent',
    unitNotation: 'Q daalt met 50 procent',
  });
  assert(halvingResult.matched === true, 'halving task must accept interval conclusion');

  return data;
}

function checkRenderer(data) {
  const html = ExitTicketUI.renderStaticHtml(
    data,
    ExitTicketUI.buildSkillView(data, new ExitTicketEngine({ data }), {})
  );
  requireText(html, 'et-hero-compact', 'compact hero for source/task workspace');
  requireText(html, 'data-source-task-workspace', 'source/task workspace');
  requireText(html, 'data-source-pane', 'source pane');
  requireText(html, 'data-task-pane', 'task pane');
  requireText(html, 'data-sticky-question-strip', 'sticky question strip');
  requireText(html, 'data-task-context', 'context region');
  requireText(html, 'data-context-block="ctx-icecream-table"', 'table context block');
  requireText(html, 'data-task-family="graph_construction_substitute"', 'graph task');
  requireText(html, 'class="ts-graph-grid-line"', 'visible graph grid');
  requireText(html, 'data-interval-halving-check', 'interval halving task');
  rejectText(html, /Gemaakte grafiek|data-completed-graph/i, 'separate completed graph block');
  rejectText(html, /\b(?:diagnostisch|mastery|sequencing|Scale Gate|PV)\b/i, 'forbidden authority copy');

  const workspaceIndex = html.indexOf('data-source-task-workspace');
  const sourceIndex = html.indexOf('data-source-pane');
  const taskIndex = html.indexOf('data-task-pane');
  assert(workspaceIndex >= 0 && sourceIndex > workspaceIndex && taskIndex > sourceIndex, 'workspace must contain source pane before task pane');
}

function checkCss() {
  const css = read(path.join(ROOT, 'engines', 'exit-ticket.css'));
  requireText(css, '.et-source-task-workspace', 'source/task workspace CSS');
  requireText(css, '.et-source-pane', 'source pane CSS');
  requireText(css, 'overflow: auto', 'scrollable source pane CSS');
  requireText(css, '.et-task-pane-head', 'sticky question strip CSS');
  requireText(css, '@media (max-width: 980px)', 'mobile stacked workspace CSS');
}

function checkGeneratedOutput() {
  const exitPage = read(findGeneratedFile('1.1.3', 'exit-ticket'));
  const dataFile = read(path.join(BOOK_ROOT, 'shared', 'exit-ticket', '1.1.3-exit-ticket.js'));
  const exitCss = read(path.join(BOOK_ROOT, 'shared', 'exit-ticket.css'));
  requireText(exitPage, 'shared/exit-ticket/1.1.3-exit-ticket.js', 'exit-ticket data loader');
  requireText(dataFile, 'source_task_workspace', 'deployed source/task layout metadata');
  requireText(dataFile, 'graph_construction_substitute', 'deployed graph construction task');
  requireText(exitCss, '.et-source-task-workspace', 'deployed source/task CSS');
}

function checkProof() {
  const proof = readJson(proofPath);
  assert(proof.sprint_id === 'GRAPH-EXIT-UX-1', 'proof sprint id mismatch');
  assert(proof.status === 'complete', 'proof must be complete');
  assert(proof.authority.new_target_equivalent_completion_language_authorized === false, 'proof must keep completion language unauthorized');
  assert(proof.proof.source_task_workspace_present === true, 'proof must record source/task workspace');
  assert(proof.proof.source_pane_constrained === true, 'proof must record constrained source pane');
  assert(proof.proof.first_graph_task_visible_initial === true, 'proof must record initial graph task visibility');
  assert(proof.proof.task_visible_after_source_scroll === true, 'proof must preserve task visibility after source scroll');
  assert(proof.proof.correct_path_draws_line === true, 'proof must draw line in same workspace');
  assert(proof.proof.all_tasks_correct === true, 'proof must complete all task checks');
  assert(proof.proof.completion_language_held === true, 'proof must keep completion language held');

  const requiredCases = [
    'desktop-initial',
    'desktop-source-scrolled',
    'desktop-wrong-retry',
    'desktop-line-confirmed',
    'desktop-completed-held',
    'mobile-initial',
    'mobile-dark-completed-held',
  ];
  for (const id of requiredCases) {
    const item = proof.cases.find((entry) => entry.id === id);
    assert(item, `proof missing case ${id}`);
    assert(item.status === 'PASS', `proof case ${id} must pass`);
    assert(item.screenshot && fs.existsSync(path.join(ROOT, item.screenshot)), `proof case ${id} missing screenshot`);
  }
}

function checkRoadmap() {
  const roadmap = read(path.join(ROOT, 'references', 'reference-team-roadmap.md'));
  requireText(roadmap, 'GRAPH-EXIT-UX-1', 'roadmap GRAPH-EXIT-UX-1 mention');
  requireText(roadmap, '1.1.3` target-equivalent `Exit ticket` now uses split source/task graph workspace', 'roadmap graph-exit result');
  rejectText(roadmap, /GRAPH-EXIT-UX-1[\s\S]{0,700}Scale Gate 1 authorized/i, 'Scale Gate authorization');
}

function main() {
  const data = checkSource();
  checkRenderer(data);
  checkCss();
  checkGeneratedOutput();
  checkProof();
  checkRoadmap();
  console.log('GRAPH-EXIT-UX-1 check passed');
}

main();
