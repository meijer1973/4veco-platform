#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const BOOK_ROOT = path.resolve(
  process.argv[2] || path.join(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const CHAPTER_ROOT = path.join(BOOK_ROOT, '1.1 Hoofdstuk Economisch denken en rekenen');

const ExitTicketEngine = require('../../engines/exit-ticket-engine');
const ExitTicketUI = require('../../engines/exit-ticket-ui');
const TaskShellEngine = require('../../engines/task-shell-engine');

function fail(message) {
  console.error(`CHECK-SHORT-EXIT-2 check failed: ${message}`);
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

function requireText(content, pattern, label, file) {
  if (typeof pattern === 'string') {
    assert(content.includes(pattern), `${file} missing ${label}`);
    return;
  }
  assert(pattern.test(content), `${file} missing ${label}`);
}

function rejectText(content, pattern, label, file) {
  assert(!pattern.test(content), `${file} contains forbidden ${label}`);
}

function visibleText(html) {
  return html
    .replace(/<caption class="ts-visually-hidden">[\s\S]*?<\/caption>/gi, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ');
}

function assertSingleVisibleContextLabel(html, contextId, label, file) {
  const match = html.match(new RegExp(`data-context-block="${contextId}"[\\s\\S]*?<\\/section>`));
  assert(match, `${file} missing context block ${contextId}`);
  const text = visibleText(match[0]);
  const count = (text.match(new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  assert(count === 1, `${file} must render ${label} once in ${contextId}, found ${count}`);
}

function sourcePath(key) {
  return path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', `${key}.json`);
}

function loadSource(key) {
  const data = readJson(sourcePath(key));
  assert(ExitTicketEngine.validateData(data), `${key} must validate through ExitTicketEngine`);
  return data;
}

function taskShells(data) {
  return data.tasks.filter((task) => task.type === 'task_shell').map((task) => task.taskShell);
}

function hasHints(value) {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.some(hasHints);
  return Object.entries(value).some(([key, nested]) => /hints?/i.test(key) || hasHints(nested));
}

function findTask(data, id) {
  const task = taskShells(data).find((item) => item.id === id);
  if (!task) fail(`${data.parNr} missing task ${id}`);
  return task;
}

function findParagraphDir(paragraphId) {
  if (!fs.existsSync(CHAPTER_ROOT)) fail(`missing chapter root: ${CHAPTER_ROOT}`);
  const entry = fs
    .readdirSync(CHAPTER_ROOT, { withFileTypes: true })
    .find((dirent) => dirent.isDirectory() && dirent.name.startsWith(`${paragraphId} `));
  if (!entry) fail(`missing generated paragraph directory for ${paragraphId}`);
  return path.join(CHAPTER_ROOT, entry.name);
}

function findFile(dir, pattern, label) {
  const match = fs.readdirSync(dir).find((file) => pattern.test(file));
  if (!match) fail(`missing ${label} in ${dir}`);
  return path.join(dir, match);
}

function checkSourceFiles() {
  const expected = [
    '1.1.1-korte-check',
    '1.1.1-exit-ticket',
    '1.1.2-korte-check',
    '1.1.2-exit-ticket',
    '1.1.3-korte-check',
    '1.1.3-exit-ticket',
  ];
  for (const key of expected) assert(fs.existsSync(sourcePath(key)), `missing source ${key}.json`);
  for (const legacy of ['1.1.1.json', '1.1.2.json', '1.1.3.json']) {
    assert(!fs.existsSync(path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', legacy)), `legacy source key must be absent: ${legacy}`);
  }

  const data = Object.fromEntries(expected.map((key) => [key, loadSource(key)]));
  for (const key of ['1.1.1-korte-check', '1.1.2-korte-check', '1.1.3-korte-check']) {
    assert(data[key].surface === 'advisory_short_check', `${key} must be advisory`);
    assert(data[key].metadataAlignment.targetReadinessEvidence === false, `${key} must not claim target readiness`);
    assert(!data[key].targetEquivalent, `${key} must not have targetEquivalent metadata`);
  }

  const graphShort = data['1.1.3-korte-check'];
  const graphShortShells = taskShells(graphShort);
  assert(Array.isArray(graphShort.contextBlocks) && graphShort.contextBlocks.length >= 2, '1.1.3 short check must have source/table context blocks');
  assert(graphShort.tasks.every((task) => task.type === 'task_shell'), '1.1.3 graph short check must not be ordinary choice-only');
  assert(graphShortShells.length === graphShort.tasks.length, '1.1.3 graph short check must use task-shell tasks');
  assert(
    graphShortShells.some((task) => task.family === 'graph_construction_substitute'),
    '1.1.3 graph short check must include graph_construction_substitute'
  );
  assert(
    graphShortShells.some((task) => task.family === 'graph_reading'),
    '1.1.3 graph short check must include graph_reading'
  );
  assert(
    graphShortShells.some((task) => task.family === 'table_value_selection'),
    '1.1.3 graph short check must include table_value_selection route advice'
  );
  assert(!hasHints(graphShort), '1.1.3 graph short check must not rely on visible content hints for this proof');
  const shortGraphTask = findTask(graphShort, 'grafiekroute-starten');
  assert(shortGraphTask.family === 'graph_construction_substitute', '1.1.3 short task 1 must be graph construction');
  assert(shortGraphTask.practiceRoute.label === 'Oefen tabel naar grafiek', '1.1.3 short graph task must route to table-to-graph practice');
  assert(shortGraphTask.interaction.axes.x.ticks.join(',') === '0,100,200,300,400,500', '1.1.3 short graph x ticks must be table-derived');
  assert(shortGraphTask.interaction.axes.y.ticks.join(',') === '0,1,1.5,2,2.5,3', '1.1.3 short graph y ticks must be table-derived');
  const shortGraphResult = TaskShellEngine.evaluateTask(shortGraphTask, {
    axes: { x: 'Q', y: 'P' },
    points: [{ x: 400, y: 1.5 }, { x: 200, y: 2.5 }],
    lineShape: 'decreasing',
  });
  assert(shortGraphResult.matched === true, '1.1.3 short graph construction must accept correct axes, points, and line');
  const shortReadingTask = findTask(graphShort, 'grafiekroute-aflezen');
  const shortReadingResult = TaskShellEngine.evaluateTask(shortReadingTask, '350');
  assert(shortReadingResult.matched === true, '1.1.3 short graph reading must accept 350');
  const shortRouteTask = findTask(graphShort, 'grafiekroute-kiezen');
  const shortRouteResult = TaskShellEngine.evaluateTask(shortRouteTask, 'tabel-naar-grafiek');
  assert(shortRouteResult.matched === true, '1.1.3 short route-advice task must accept tabel-naar-grafiek');

  assert(data['1.1.2-exit-ticket'].targetEquivalent.gateApproved === true, 'reviewed 1.1.2 exit ticket must remain gate approved');
  assert(data['1.1.2-exit-ticket'].targetEquivalent.completionLanguageEligible === true, 'reviewed 1.1.2 exit ticket must retain approved completion language');
  for (const key of ['1.1.1-exit-ticket', '1.1.3-exit-ticket']) {
    assert(data[key].surface === 'target_equivalent_exit_ticket', `${key} must be an exit-ticket candidate`);
    assert(data[key].targetEquivalent.candidate === true, `${key} must be a target-equivalent candidate`);
    assert(data[key].targetEquivalent.gateApproved === false, `${key} must not be gate approved yet`);
    assert(data[key].targetEquivalent.completionLanguageEligible === false, `${key} must keep completion language disabled`);
    assert(data[key].metadataAlignment.targetReadinessEvidence === false, `${key} must not claim readiness before human review`);
    rejectText(JSON.stringify(data[key].completion || {}), /laten zien dat|aankunt|bewezen|aangetoond|beheerst/i, 'new candidate completion claim', `${key}.json`);
  }
  for (const key of expected) assert(!hasHints(data[key]), `${key} must not expose content hints`);

  const graphData = data['1.1.3-exit-ticket'];
  assert(Array.isArray(graphData.contextBlocks) && graphData.contextBlocks.length === 4, '1.1.3 exit ticket must have four context blocks');
  assert(graphData.layout && graphData.layout.kind === 'source_task_workspace', '1.1.3 exit ticket must opt into source/task workspace layout');
  assert(!graphData.contextBlocks.some((block) => block.id === 'ctx-icecream-prompt'), '1.1.3 source context must not render prompt block as source');
  for (const id of ['ctx-icecream-source', 'ctx-icecream-table', 'ctx-icecream-formula', 'ctx-icecream-procedure']) {
    assert(graphData.contextBlocks.some((block) => block.id === id), `1.1.3 context missing ${id}`);
  }
  const graphTask = findTask(graphData, 'grafiek-tekenen');
  assert(graphTask.family === 'graph_construction_substitute', '1.1.3 first task must be graph construction');
  assert(graphTask.interaction.axes.x.ticks.join(',') === '0,100,200,300,400,500', '1.1.3 graph x ticks must be table-derived');
  assert(graphTask.interaction.axes.y.ticks.join(',') === '0,1,1.5,2,2.5,3', '1.1.3 graph y ticks must be table-derived');
  assert((graphTask.interaction.axisOptions || []).some((option) => option.label === 'Prijs P'), '1.1.3 graph axis choices must include Prijs P');
  assert((graphTask.interaction.axisOptions || []).some((option) => option.label === 'Hoeveelheid Q'), '1.1.3 graph axis choices must include Hoeveelheid Q');
  const halvingTask = findTask(graphData, 'halvering-controleren');
  assert(halvingTask.interaction.selectionMode === 'interval_halving_check', '1.1.3 task 3 must use interval_halving_check');

  const graphResult = TaskShellEngine.evaluateTask(graphTask, {
    axes: { x: 'Q', y: 'P' },
    points: [{ x: 500, y: 1 }, { x: 100, y: 3 }],
    lineShape: 'decreasing',
  });
  assert(graphResult.matched === true, '1.1.3 graph construction must accept correct axes, points, and line');
  const intervalResult = TaskShellEngine.evaluateTask(halvingTask, {
    work: '400 ijsjes naar 200 ijsjes; de helft van de oude hoeveelheid',
    finalAnswer: 'Q daalt met 50 procent',
    unitNotation: 'Q daalt met 50 procent',
  });
  assert(intervalResult.matched === true, '1.1.3 interval task must accept conclusion, not only interval text');
  const wrongInterval = TaskShellEngine.evaluateTask(halvingTask, {
    work: '400 ijsjes naar 200 ijsjes; het dubbele van de oude hoeveelheid',
    finalAnswer: 'Q daalt met 50 procent',
    unitNotation: 'Q daalt met 50 procent',
  });
  assert(wrongInterval.matched === false, '1.1.3 interval task must reject wrong relation');

  return data;
}

function checkSharedRuntime(data) {
  const taskShellUi = read(path.join(ROOT, 'engines', 'task-shell-ui.js'));
  const taskShellCss = read(path.join(ROOT, 'engines', 'task-shell.css'));
  const exitUi = read(path.join(ROOT, 'engines', 'exit-ticket-ui.js'));
  for (const [content, file] of [
    [taskShellUi, 'engines/task-shell-ui.js'],
    [exitUi, 'engines/exit-ticket-ui.js'],
  ]) {
    requireText(content, 'collectGraphConstructionResponse', 'graph construction response collector', file);
    requireText(content, 'handleGraphConstructionClick', 'graph construction click handler', file);
    requireText(content, 'collectCalculationResponse', 'interval calculation collector', file);
  }
  requireText(taskShellCss, '.ts-graph-construction', 'graph construction CSS', 'engines/task-shell.css');
  requireText(taskShellCss, '.ts-graph-grid-line', 'graph grid CSS', 'engines/task-shell.css');
  requireText(taskShellCss, '.ts-graph-line', 'same-workspace graph line CSS', 'engines/task-shell.css');

  const rendered = ExitTicketUI.renderStaticHtml(
    data['1.1.3-exit-ticket'],
    ExitTicketUI.buildSkillView(data['1.1.3-exit-ticket'], new ExitTicketEngine({ data: data['1.1.3-exit-ticket'] }), {})
  );
  requireText(rendered, 'data-task-context', 'context block region', 'rendered 1.1.3');
  requireText(rendered, 'data-source-task-workspace', 'source/task workspace', 'rendered 1.1.3');
  requireText(rendered, 'data-source-pane', 'scrollable source pane', 'rendered 1.1.3');
  requireText(rendered, 'data-task-pane', 'task pane', 'rendered 1.1.3');
  requireText(rendered, 'data-sticky-question-strip', 'sticky task question strip', 'rendered 1.1.3');
  requireText(rendered, 'data-context-block="ctx-icecream-table"', 'table context block', 'rendered 1.1.3');
  requireText(rendered, 'class="ts-graph-construction"', 'graph construction control', 'rendered 1.1.3');
  requireText(rendered, 'class="ts-graph-grid-line"', 'visible graph grid', 'rendered 1.1.3');
  requireText(rendered, 'data-graph-line-confirmation', 'line confirmation control', 'rendered 1.1.3');
  requireText(rendered, 'data-interval-halving-check', 'interval-halving control', 'rendered 1.1.3');
  requireText(rendered, 'data-context-refs-for="grafiek-tekenen"', 'graph task context refs', 'rendered 1.1.3');
  assertSingleVisibleContextLabel(rendered, 'ctx-icecream-source', 'Bron 1', 'rendered 1.1.3');
  assertSingleVisibleContextLabel(rendered, 'ctx-icecream-table', 'Tabel 1', 'rendered 1.1.3');
  rejectText(rendered, /Gemaakte grafiek|data-completed-graph/i, 'separate completed graph block', 'rendered 1.1.3');
  rejectText(rendered, /class="ts-hints"/i, 'exit-ticket hints', 'rendered 1.1.3');
  rejectText(rendered, /\b(?:PV|MTU)\b/, 'internal code leak', 'rendered 1.1.3');

  const renderedShort = ExitTicketUI.renderStaticHtml(
    data['1.1.3-korte-check'],
    ExitTicketUI.buildSkillView(data['1.1.3-korte-check'], new ExitTicketEngine({ data: data['1.1.3-korte-check'] }), {})
  );
  requireText(renderedShort, 'data-task-context', 'short-check context block region', 'rendered 1.1.3 short');
  requireText(renderedShort, 'data-context-block="ctx-icecream-short-table"', 'short-check table context block', 'rendered 1.1.3 short');
  requireText(renderedShort, 'class="ts-graph-construction"', 'short-check graph construction control', 'rendered 1.1.3 short');
  requireText(renderedShort, 'class="ts-graph-grid-line"', 'short-check visible graph grid', 'rendered 1.1.3 short');
  requireText(renderedShort, 'data-task-family="graph_reading"', 'short-check graph-reading task', 'rendered 1.1.3 short');
  requireText(renderedShort, 'data-task-family="table_value_selection"', 'short-check route-advice task', 'rendered 1.1.3 short');
  assertSingleVisibleContextLabel(renderedShort, 'ctx-icecream-short-source', 'Bron 1', 'rendered 1.1.3 short');
  assertSingleVisibleContextLabel(renderedShort, 'ctx-icecream-short-table', 'Tabel 1', 'rendered 1.1.3 short');
  rejectText(renderedShort, /class="et-option"/i, 'ordinary choice-only controls', 'rendered 1.1.3 short');
}

function checkGeneratedOutput() {
  const sharedExit = path.join(BOOK_ROOT, 'shared', 'exit-ticket');
  const expectedShared = [
    '1.1.1-korte-check.js',
    '1.1.1-exit-ticket.js',
    '1.1.2-korte-check.js',
    '1.1.2-exit-ticket.js',
    '1.1.3-korte-check.js',
    '1.1.3-exit-ticket.js',
  ];
  for (const file of expectedShared) assert(fs.existsSync(path.join(sharedExit, file)), `missing generated shared/${file}`);
  for (const legacy of ['1.1.1.js', '1.1.2.js', '1.1.3.js']) {
    assert(!fs.existsSync(path.join(sharedExit, legacy)), `stale generated shared/${legacy} must be absent`);
  }

  for (const paragraphId of ['1.1.1', '1.1.2', '1.1.3']) {
    const dir = findParagraphDir(paragraphId);
    const landing = read(path.join(dir, 'index.html'));
    const shortPage = findFile(dir, /\u2013 korte-check\.html$/i, `${paragraphId} korte-check page`);
    const exitPage = findFile(dir, /\u2013 exit-ticket\.html$/i, `${paragraphId} exit-ticket page`);
    requireText(landing, /data-section="check"[\s\S]*Korte check/i, `${paragraphId} landing Korte check card`, `${paragraphId}/index.html`);
    requireText(landing, /data-section="check"[\s\S]*Exit ticket/i, `${paragraphId} landing Exit ticket card`, `${paragraphId}/index.html`);
    requireText(read(shortPage), new RegExp(`shared/exit-ticket/${paragraphId.replace(/\./g, '\\.')}-korte-check\\.js`), `${paragraphId} short-check data script`, shortPage);
    requireText(read(exitPage), new RegExp(`shared/exit-ticket/${paragraphId.replace(/\./g, '\\.')}-exit-ticket\\.js`), `${paragraphId} exit-ticket data script`, exitPage);
    assert(!fs.readdirSync(dir).some((file) => /\u2013 afsluitcheck\.html$/i.test(file)), `${paragraphId} stale afsluitcheck page must be absent`);
  }

  const deployedTaskShell = read(path.join(BOOK_ROOT, 'shared', 'task-shell-ui.js'));
  const deployedCss = read(path.join(BOOK_ROOT, 'shared', 'task-shell.css'));
  requireText(deployedTaskShell, 'collectGraphConstructionResponse', 'deployed graph collector', 'shared/task-shell-ui.js');
  requireText(deployedTaskShell, 'collectCalculationResponse', 'deployed interval collector', 'shared/task-shell-ui.js');
  requireText(deployedCss, '.ts-graph-grid-line', 'deployed graph grid CSS', 'shared/task-shell.css');
}

function main() {
  const data = checkSourceFiles();
  checkSharedRuntime(data);
  checkGeneratedOutput();
  console.log('CHECK-SHORT-EXIT-2 check passed');
}

main();
