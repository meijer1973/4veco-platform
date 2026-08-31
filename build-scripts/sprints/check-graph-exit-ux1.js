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
const GoldenTicketLayout = require('../../engines/golden-ticket-layout');
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
  assert(data.targetEquivalent.gateApproved === true, '1.1.3 must record human-approved gate evidence');
  assert(data.targetEquivalent.completionLanguageEligible === false, '1.1.3 completion language must remain held');
  assert(data.metadataAlignment.status === 'target_equivalent_aligned', '1.1.3 metadata status must record target-equivalent alignment');
  assert(data.metadataAlignment.targetReadinessEvidence === true, '1.1.3 must record human-approved target readiness evidence');
  assert(data.layout && data.layout.kind === 'source_task_workspace', '1.1.3 exit ticket must opt into source/task workspace');
  assert(data.layout.framework === 'golden_exercise_workbench', '1.1.3 exit ticket must render through the Golden Workbench');
  assert(Array.isArray(data.contextBlocks) && data.contextBlocks.length === 2, '1.1.3 exit ticket must retain source/table context blocks only');
  assert(!data.contextBlocks.some((block) => /procedure|flowchart/i.test(`${block.id} ${block.type} ${block.caption || ''}`)), '1.1.3 exit ticket must not expose procedure context before attempt');
  assert(data.contextBlocks.some((block) => block.id === 'ctx-stationbroodjes-source'), '1.1.3 exit ticket must include station bread-stall source context');
  assert(data.contextBlocks.some((block) => block.id === 'ctx-stationbroodjes-table'), '1.1.3 exit ticket must include station bread-stall table context');
  assert(data.contextBlocks.some((block) => block.type === 'table'), '1.1.3 exit ticket must include table context');
  assert(!data.contextBlocks.some((block) => block.type === 'formula'), '1.1.3 exit ticket must not include a static formula context');
  assert(data.tasks.every((task) => task.type === 'task_shell'), '1.1.3 exit ticket must use task-shell tasks');

  const families = taskShells(data).map((task) => task.family);
  assert(families.includes('graph_construction_substitute'), '1.1.3 exit ticket must include graph construction');
  assert(families.includes('graph_reading'), '1.1.3 exit ticket must include graph reading');
  assert(families.includes('calculation_work_capture'), '1.1.3 exit ticket must include calculation/claim-control task');

  const graphTask = findTask(data, 'pq-grafiek-construeren');
  assert(graphTask.interaction.hideAxisLabelsUntilAxisSelection === true, 'graph task must hide axis labels before student axis selection');
  assert(graphTask.interaction.axes.x.ticks.join(',') === '0,50,100,150,200,250,300,350,400', 'graph x ticks must be table-derived');
  assert(graphTask.interaction.axes.y.ticks.join(',') === '0,0.5,1,1.5,2,2.5,3,3.5', 'graph y ticks must be table-derived');
  const graphResult = TaskShellEngine.evaluateTask(graphTask, {
    axes: { x: 'Q', y: 'P' },
    points: [{ x: 350, y: 1 }, { x: 150, y: 3 }],
    lineShape: 'decreasing',
  });
  assert(graphResult.matched === true, 'graph task must accept correct axes, points, and line');
  const readingResult = TaskShellEngine.evaluateTask(findTask(data, 'interpolatie-225'), {
    interval: '200-250',
    value: '225',
  });
  assert(readingResult.matched === true, 'graph reading must accept interval 200-250 and Q=225');
  const claimTask = findTask(data, 'claim-50-procent-controleren');
  assert(claimTask.interaction.selectionMode === 'percentage_claim_control', 'claim task must use structured percentage-claim control');
  assert(claimTask.interaction.intervalOptions.some((option) => option.correct === false), 'claim task must include distractor intervals');
  assert(claimTask.interaction.conclusionOptions.some((option) => option.correct === false), 'claim task must include distractor conclusions');
  const claimResult = TaskShellEngine.evaluateTask(claimTask, {
    interval: '150-300',
    oldValue: '300',
    newValue: '150',
    formula: { tokens: claimTask.expected.formula.tokens },
    work: 'van EUR 1,50 naar EUR 3,00: oude hoeveelheid 300, nieuwe hoeveelheid 150',
    finalAnswer: '-50%',
    conclusion: 'drop50',
    unitNotation: 'Q daalt met 50 procent',
  });
  assert(claimResult.matched === true, 'claim task must accept the structured 50 percent decrease path');

  return data;
}

function checkRenderer(data) {
  const html = GoldenTicketLayout.renderMain(data);
  requireText(html, 'class="ge-workbench"', 'Golden Workbench layout');
  requireText(html, 'class="ge-source-card"', 'Golden source card');
  requireText(html, 'class="ge-task-card"', 'Golden task card');
  requireText(html, 'data-context-block="ctx-stationbroodjes-source"', 'station bread-stall source context block');
  requireText(html, 'data-context-block="ctx-stationbroodjes-table"', 'station bread-stall table context block');
  requireText(html, 'data-task-family="graph_construction_substitute"', 'graph task');
  requireText(html, 'data-percentage-claim-control', 'percentage claim control');
  requireText(html, 'data-ge-token-id="times100"', 'formula-builder tokens');
  rejectText(html, /Gemaakte grafiek|data-completed-graph/i, 'separate completed graph block');
  rejectText(html, /ctx-stationbroodjes-formula|data-context-block="[^"]*formula/i, 'static formula context');
  rejectText(html, /\b(?:diagnostisch|mastery|sequencing|Scale Gate|PV)\b/i, 'forbidden authority copy');

  const workspaceIndex = html.indexOf('class="ge-workbench"');
  const sourceIndex = html.indexOf('class="ge-source-card"');
  const taskIndex = html.indexOf('class="ge-task-card"');
  assert(workspaceIndex >= 0 && sourceIndex > workspaceIndex && taskIndex > sourceIndex, 'workspace must contain source pane before task pane');
}

function checkCss() {
  const css = read(path.join(ROOT, 'engines', 'golden-ticket-layout.css'));
  requireText(css, '.ge-workbench', 'Golden Workbench CSS');
  requireText(css, '.ge-source-card', 'source card CSS');
  requireText(css, '.ge-task-card', 'task card CSS');
  requireText(css, '.ge-claim-grid', 'percentage claim grid CSS');
  requireText(css, '@media (max-width: 900px)', 'mobile stacked workspace CSS');
}

function checkGeneratedOutput() {
  const exitPage = read(findGeneratedFile('1.1.3', 'exit-ticket'));
  const dataFile = read(path.join(BOOK_ROOT, 'shared', 'exit-ticket', '1.1.3-exit-ticket.js'));
  const exitCss = read(path.join(BOOK_ROOT, 'shared', 'golden-ticket-layout.css'));
  requireText(exitPage, 'shared/exit-ticket/1.1.3-exit-ticket.js', 'exit-ticket data loader');
  requireText(exitPage, 'data-golden-ticket-root', 'Golden Workbench generated root');
  requireText(exitPage, 'shared/golden-ticket-layout.js', 'Golden Workbench runtime');
  requireText(dataFile, 'source_task_workspace', 'deployed source/task layout metadata');
  requireText(dataFile, 'graph_construction_substitute', 'deployed graph construction task');
  requireText(dataFile, 'percentage_claim_control', 'deployed percentage claim task');
  requireText(dataFile, 'oldQBase', 'deployed repaired old Q base token');
  requireText(dataFile, 'oldQBeforeChange', 'deployed repaired old Q numerator token');
  requireText(dataFile, 'newQBase', 'deployed repaired new Q base token');
  rejectText(dataFile, /\b(?:oldQden|oldQnum|newQden)\b/, 'stale formula-token ids');
  requireText(exitCss, '.ge-workbench', 'deployed Golden Workbench CSS');
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
  assert(proof.proof.percentage_claim_control_present === true, 'proof must record percentage-claim control');
  assert(proof.proof.current_context_blocks === 'ctx-stationbroodjes-source,ctx-stationbroodjes-table', 'proof must record current source/table context ids');
  assert(proof.proof.completion_language_held === true, 'proof must keep completion language held');
  const tokenIds = proof.cases.flatMap((entry) => (entry.inspection && entry.inspection.formulaTokenIds) || []);
  for (const staleId of ['oldQden', 'oldQnum', 'newQden']) {
    assert(!tokenIds.includes(staleId), `proof must not contain stale formula-token id ${staleId}`);
  }
  for (const repairedId of ['oldQBase', 'oldQBeforeChange', 'newQBase']) {
    assert(tokenIds.includes(repairedId), `proof must contain repaired formula-token id ${repairedId}`);
  }

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
  requireText(roadmap, /GRAPH-EXIT-UX-1[\s\S]{0,400}baseline repair evidence|1\.1\.3` target-equivalent `Exit ticket` now uses split source\/task graph workspace/, 'roadmap graph-exit result');
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
