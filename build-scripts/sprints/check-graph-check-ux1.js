#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const BOOK_ROOT = path.resolve(
  process.argv[2] || path.join(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const CHAPTER_ROOT = path.join(BOOK_ROOT, '1.1 Hoofdstuk Economisch denken en rekenen');
const proofPath = path.join(ROOT, 'reports', 'json', 'graph-check-ux1-proof.json');

const ExitTicketEngine = require('../../engines/exit-ticket-engine');
const ExitTicketUI = require('../../engines/exit-ticket-ui');
const TaskShellEngine = require('../../engines/task-shell-engine');

function fail(message) {
  console.error(`GRAPH-CHECK-UX-1 check failed: ${message}`);
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

function visibleText(html) {
  return html
    .replace(/<caption class="ts-visually-hidden">[\s\S]*?<\/caption>/gi, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ');
}

function assertSingleVisibleContextLabel(html, contextId, label) {
  const match = html.match(new RegExp(`data-context-block="${contextId}"[\\s\\S]*?<\\/section>`));
  assert(match, `rendered short check missing context block ${contextId}`);
  const text = visibleText(match[0]);
  const count = (text.match(new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  assert(count === 1, `rendered short check must show ${label} once in ${contextId}, found ${count}`);
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

function checkSource() {
  const data = readJson(sourcePath('1.1.3-korte-check'));
  assert(ExitTicketEngine.validateData(data), '1.1.3-korte-check must validate');
  assert(data.surface === 'advisory_short_check', '1.1.3 short check must remain advisory');
  assert(!data.targetEquivalent, '1.1.3 short check must not have targetEquivalent metadata');
  assert(data.metadataAlignment.targetReadinessEvidence === false, '1.1.3 short check must not claim target readiness');
  assert(Array.isArray(data.contextBlocks) && data.contextBlocks.length >= 2, '1.1.3 short check must include source/table context');
  assert(data.contextBlocks.some((block) => block.type === 'table'), '1.1.3 short check must include table context');
  assert(data.tasks.every((task) => task.type === 'task_shell'), '1.1.3 short check must not be ordinary choice-only');

  const shells = taskShells(data);
  const families = shells.map((task) => task.family);
  assert(families.includes('graph_construction_substitute'), '1.1.3 short check must include graph construction');
  assert(families.includes('graph_reading'), '1.1.3 short check must include graph reading');
  assert(families.includes('table_value_selection'), '1.1.3 short check must include route choice through task shell');

  const graphTask = findTask(data, 'grafiekroute-starten');
  assert(graphTask.practiceRoute.label === 'Oefen tabel naar grafiek', 'graph task must route to table-to-graph practice');
  assert(graphTask.interaction.axes.x.ticks.join(',') === '0,100,200,300,400,500', 'short-check x ticks must be table-derived');
  assert(graphTask.interaction.axes.y.ticks.join(',') === '0,1,1.5,2,2.5,3', 'short-check y ticks must be table-derived');
  assert((graphTask.interaction.axisOptions || []).some((option) => option.label === 'Prijs P'), 'axis options must include Prijs P');
  assert((graphTask.interaction.axisOptions || []).some((option) => option.label === 'Hoeveelheid Q'), 'axis options must include Hoeveelheid Q');

  const graphResult = TaskShellEngine.evaluateTask(graphTask, {
    axes: { x: 'Q', y: 'P' },
    points: [{ x: 400, y: 1.5 }, { x: 200, y: 2.5 }],
    lineShape: 'decreasing',
  });
  assert(graphResult.matched === true, 'short-check graph task must accept correct axes, points, and line');
  const wrongGraph = TaskShellEngine.evaluateTask(graphTask, {
    axes: { x: 'P', y: 'Q' },
    points: [{ x: 400, y: 1.5 }, { x: 200, y: 2.5 }],
    lineShape: 'decreasing',
  });
  assert(wrongGraph.matched === false, 'short-check graph task must reject swapped axes');

  const readingResult = TaskShellEngine.evaluateTask(findTask(data, 'grafiekroute-aflezen'), '350');
  assert(readingResult.matched === true, 'short-check graph reading must accept 350');
  const routeResult = TaskShellEngine.evaluateTask(findTask(data, 'grafiekroute-kiezen'), 'tabel-naar-grafiek');
  assert(routeResult.matched === true, 'short-check route task must accept table-to-graph route');

  return data;
}

function checkRendered(data) {
  const html = ExitTicketUI.renderStaticHtml(
    data,
    ExitTicketUI.buildSkillView(data, new ExitTicketEngine({ data }), {})
  );
  requireText(html, 'data-task-context', 'context region');
  requireText(html, 'data-context-block="ctx-icecream-short-table"', 'table context block');
  requireText(html, 'class="ts-context-table"', 'rendered table');
  requireText(html, 'class="ts-graph-construction"', 'graph construction workspace');
  requireText(html, 'class="ts-graph-grid-line"', 'graph grid lines');
  requireText(html, 'data-graph-line-confirmation', 'line confirmation button');
  requireText(html, 'data-task-family="graph_reading"', 'graph reading task');
  requireText(html, 'data-task-family="table_value_selection"', 'table-value route task');
  assertSingleVisibleContextLabel(html, 'ctx-icecream-short-source', 'Bron 1');
  assertSingleVisibleContextLabel(html, 'ctx-icecream-short-table', 'Tabel 1');
  rejectText(html, /class="et-option"/i, 'ordinary choice-only controls');
  rejectText(html, /\b(?:diagnostisch|mastery|sequencing|Scale Gate|PV)\b/i, 'forbidden authority copy');
}

function checkGeneratedOutput() {
  const shortPage = read(findGeneratedFile('1.1.3', 'korte-check'));
  const dataFile = read(path.join(BOOK_ROOT, 'shared', 'exit-ticket', '1.1.3-korte-check.js'));
  const taskShellCss = read(path.join(BOOK_ROOT, 'shared', 'task-shell.css'));
  requireText(shortPage, 'shared/exit-ticket/1.1.3-korte-check.js', 'short-check data loader');
  requireText(dataFile, 'graph_construction_substitute', 'deployed graph task family');
  requireText(dataFile, 'ctx-icecream-short-table', 'deployed short-check table context');
  requireText(taskShellCss, '.ts-graph-grid-line', 'deployed graph grid CSS');
}

function checkProof() {
  const proof = readJson(proofPath);
  assert(proof.sprint_id === 'GRAPH-CHECK-UX-1', 'proof sprint id mismatch');
  assert(proof.status === 'complete', 'proof must be complete');
  assert(proof.authority.product_route_adoption_authorized === false, 'proof must not authorize product route adoption');
  assert(proof.authority.new_target_equivalent_completion_language_authorized === false, 'proof must not authorize new completion language');
  assert(proof.proof.short_check_task_shell_count === 3, 'proof must record three task-shell tasks');
  assert(proof.proof.short_check_context_block_count >= 2, 'proof must record context blocks');
  assert(proof.proof.graph_workspace_present === true, 'proof must record graph workspace');
  assert(proof.proof.grid_visible === true, 'proof must record visible grid');
  assert(proof.proof.choice_only === false, 'proof must reject choice-only state');
  assert(proof.proof.correct_path_reaches_route_advice === true, 'proof must reach route advice');

  const requiredCases = [
    'desktop-initial',
    'desktop-wrong-retry',
    'desktop-route-advice',
    'mobile-initial',
    'mobile-dark-route-advice',
  ];
  for (const id of requiredCases) {
    const item = proof.cases.find((entry) => entry.id === id);
    assert(item, `proof missing case ${id}`);
    assert(item.status === 'PASS', `proof case ${id} must pass`);
    assert(item.screenshot && fs.existsSync(path.join(ROOT, item.screenshot)), `proof case ${id} missing screenshot`);
  }
}

function checkRoadmapAndBoundary() {
  const roadmap = read(path.join(ROOT, 'references', 'reference-team-roadmap.md'));
  requireText(roadmap, 'GRAPH-CHECK-UX-1', 'roadmap GRAPH-CHECK-UX-1 mention');
  requireText(roadmap, '1.1.3` advisory `Korte check` now uses graph/table task-shell interaction', 'roadmap graph-check result');
  rejectText(roadmap, /GRAPH-CHECK-UX-1[\s\S]{0,700}Scale Gate 1 authorized/i, 'Scale Gate authorization');
}

function main() {
  const data = checkSource();
  checkRendered(data);
  checkGeneratedOutput();
  checkProof();
  checkRoadmapAndBoundary();
  console.log('GRAPH-CHECK-UX-1 check passed');
}

main();
