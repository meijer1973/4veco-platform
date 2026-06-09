#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const BOOK_ROOT = path.resolve(process.argv[2] || path.join(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod'));
const SOURCE_PATH = path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.3-exit-ticket.json');
const EXEMPLAR_DIR = path.join(ROOT, 'references', 'exemplars', '1.1.3-exit-ticket');
const PROOF_PATH = path.join(ROOT, 'reports', 'json', 'checksurface-113-exemplar-exit1-proof.json');
const CHAPTER_ROOT = path.join(BOOK_ROOT, '1.1 Hoofdstuk Economisch denken en rekenen');

const ExitTicketEngine = require('../../engines/exit-ticket-engine');
const TaskShellEngine = require('../../engines/task-shell-engine');

function fail(message) {
  console.error(`CHECKSURFACE-113-EXEMPLAR-EXIT-1 failed: ${message}`);
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

function taskShells(data) {
  return (data.tasks || [])
    .filter((task) => task && task.taskShell)
    .map((task) => task.taskShell);
}

function findShell(data, family) {
  const shell = taskShells(data).find((entry) => entry.family === family);
  assert(shell, `missing task family: ${family}`);
  return shell;
}

function collectPlaceholders(value, pathParts, out) {
  if (value == null) return;
  if (Array.isArray(value)) {
    value.forEach((item, idx) => collectPlaceholders(item, pathParts.concat(String(idx)), out));
    return;
  }
  if (typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    const nextPath = pathParts.concat(key);
    if (/placeholder/i.test(key) && typeof child === 'string') {
      out.push({ path: nextPath.join('.'), value: child });
    }
    collectPlaceholders(child, nextPath, out);
  }
}

function assertNoAnswerGivingPlaceholders(data) {
  const placeholders = [];
  collectPlaceholders(data, [], placeholders);
  const forbidden = [
    { token: '225', label: 'graph read-off answer' },
    { token: '-50', label: 'percentage answer' },
    { token: '150', label: 'new quantity answer' },
    { token: '300', label: 'old quantity answer' },
  ];
  for (const placeholder of placeholders) {
    for (const item of forbidden) {
      assert(!placeholder.value.includes(item.token), `answer-giving placeholder for ${item.label}: ${placeholder.path}`);
    }
  }
  return placeholders;
}

function assertWorkGroup(shell, label, expectedValues) {
  const groups = shell.expected.requiredWorkText || [];
  const group = groups.find((entry) => entry && entry.label === label);
  assert(group, `calculation requiredWorkText missing group: ${label}`);
  for (const value of expectedValues) {
    assert((group.any || []).includes(value), `calculation requiredWorkText.${label} missing ${value}`);
  }
}

function findParagraphDir() {
  assert(fs.existsSync(CHAPTER_ROOT), `missing chapter root: ${CHAPTER_ROOT}`);
  const entry = fs.readdirSync(CHAPTER_ROOT, { withFileTypes: true })
    .find((item) => item.isDirectory() && item.name.startsWith('1.1.3 '));
  assert(entry, 'missing generated 1.1.3 paragraph directory');
  return path.join(CHAPTER_ROOT, entry.name);
}

function findGeneratedExitPage() {
  const dir = findParagraphDir();
  const entry = fs.readdirSync(dir, { withFileTypes: true })
    .find((item) => item.isFile() && /exit-ticket\.html$/i.test(item.name));
  assert(entry, 'missing generated 1.1.3 exit-ticket HTML page');
  return path.join(dir, entry.name);
}

function requireExemplarFiles() {
  const required = [
    'README.md',
    'candidate-data.json',
    'implementation-handoff.md',
    'package-readme.md',
    'policy-extract.md',
    'prototype.html',
    'quality-brief.md',
    path.join('reviews', 'teacher-learning-quality-review.md'),
    path.join('reviews', 'student-experience-review.md'),
    path.join('reviews', 'visual-interaction-review.md'),
    path.join('reviews', 'testing-regression-review.md'),
    path.join('reviews', 'lead-synthesis.md'),
  ];
  for (const relPath of required) {
    assert(fs.existsSync(path.join(EXEMPLAR_DIR, relPath)), `missing exemplar file: ${relPath}`);
  }
  const lead = read(path.join(EXEMPLAR_DIR, 'reviews', 'lead-synthesis.md'));
  const pending = /PENDING_REVIEW/.test(lead) && /hold_for_exemplar_review/.test(lead);
  const reviewed = /Status:\s*`COMPLETE`/.test(lead) && /Verdict:\s*PASS WITH FLAGS/.test(lead) && /reviewed_with_flags/.test(lead);
  assert(pending || reviewed, 'lead synthesis must be pending hold or reviewed with flags');
  if (reviewed) {
    assert(/target-readiness evidence/i.test(lead), 'reviewed lead synthesis must preserve target-readiness boundary');
    assert(/completion language/i.test(lead), 'reviewed lead synthesis must preserve completion-language boundary');
  }
  return {
    required,
    review_state: reviewed ? 'COMPLETE_PASS_WITH_FLAGS' : 'PENDING_REVIEW',
    next_state: reviewed ? 'reviewed_with_flags' : 'hold_for_exemplar_review',
  };
}

function checkSource() {
  const data = readJson(SOURCE_PATH);
  assert(ExitTicketEngine.validateData(data), '1.1.3 exit-ticket source must validate');
  assert(data.surface === 'target_equivalent_exit_ticket', 'surface must be target_equivalent_exit_ticket');
  assert(data.layout && data.layout.framework === 'golden_exercise_workbench', '1.1.3 exit ticket must opt into the golden exercise workbench framework');
  assert(data.targetEquivalent && data.targetEquivalent.gateApproved === false, 'targetEquivalent gateApproved must remain false');
  assert(data.targetEquivalent.completionLanguageEligible === false, 'completion language must remain held');
  assert(data.metadataAlignment && data.metadataAlignment.targetReadinessEvidence === false, 'target readiness evidence must remain false');
  assert(Array.isArray(data.contextBlocks) && data.contextBlocks.length === 2, 'context must contain exactly source and table');
  assert(data.contextBlocks.some((block) => block.type === 'source_excerpt'), 'context must include source excerpt');
  assert(data.contextBlocks.some((block) => block.type === 'table'), 'context must include table');
  assert(!data.contextBlocks.some((block) => block.type === 'formula'), 'context must not include static formula block');

  const placeholders = assertNoAnswerGivingPlaceholders(data);
  const graph = findShell(data, 'graph_construction_substitute');
  assert(graph.interaction.hideAxisLabelsUntilAxisSelection === true, 'graph task must hide axis labels until selection');
  assert(graph.interaction.pointCount === 2, 'graph task must require two points');
  assert(graph.interaction.pointSnapMode === 'magnetic_table_point', 'graph task must use magnetic snapping');
  assert(graph.interaction.pointSnapTolerancePx >= 35, 'graph snap tolerance must be forgiving');
  assert(Array.isArray(graph.interaction.axisOptions) && graph.interaction.axisOptions.length >= 4, 'graph axis options must include plausible distractors');
  assert(graph.interaction.lineShapeOptions === undefined, 'graph task must not expose student-facing line-shape choices');
  assert(graph.interaction.lineShapeLabel === undefined, 'graph task must not expose a student-facing line-shape label');
  assert(graph.expected.pointPolicy === 'straight_line_two_distinct_table_points', 'graph task must use straight-line two-point policy');
  assert(Array.isArray(graph.expected.acceptedTablePoints) && graph.expected.acceptedTablePoints.length >= 5, 'graph task must accept all table points');
  assert(TaskShellEngine.evaluateTask(graph, {
    axes: { x: 'Q', y: 'P' },
    points: [{ x: '300', y: '1,5' }, { x: '150', y: '3,0' }],
    lineShape: 'decreasing',
  }).matched, 'graph construction must accept two valid points with decreasing line shape');
  const reading = findShell(data, 'graph_reading');
  assert(Array.isArray(reading.interaction.stepOrder), 'graph reading must define stepOrder');
  assert(reading.interaction.stepOrder.join('|') === 'interval_selection|read_q_value', 'graph reading order must be interval then read-off');
  assert(reading.interaction.intervalOptions.some((option) => option.correct === true), 'graph reading must include a correct interval');
  assert(reading.interaction.intervalOptions.some((option) => option.correct === false), 'graph reading must include interval distractors');
  assert(reading.expected.interval && reading.expected.interval.value === '200-250', 'graph reading expected interval must be 200-250');

  const calculation = findShell(data, 'calculation_work_capture');
  assert(calculation.interaction.selectionMode === 'percentage_claim_control', 'calculation must render the structured percentage claim control');
  assert(Array.isArray(calculation.interaction.intervalOptions) && calculation.interaction.intervalOptions.length >= 4, 'calculation must include interval choices');
  assert(calculation.interaction.intervalOptions.some((option) => option.id === '150-300' && option.correct === true), 'calculation must include the correct 1.50 to 3.00 interval');
  assert(calculation.interaction.intervalOptions.some((option) => option.correct === false), 'calculation must include interval distractors');
  assert(calculation.interaction.formula && Array.isArray(calculation.interaction.formula.tokens), 'calculation must embed a formula-builder control');
  assert(calculation.interaction.formula.tokens.some((token) => token.kind === 'answer'), 'embedded formula builder must include answer tokens');
  assert(calculation.interaction.formula.tokens.some((token) => token.kind === 'distractor'), 'embedded formula builder must include distractor tokens');
  assert(Array.isArray(calculation.interaction.conclusionOptions) && calculation.interaction.conclusionOptions.length >= 3, 'calculation must include conclusion choices');
  assert(calculation.interaction.conclusionOptions.some((option) => option.id === 'drop50' && option.correct === true), 'calculation must include the correct 50 percent drop conclusion');
  assert((calculation.interaction.answerParsers || []).includes('number_with_optional_percent'), 'calculation must declare number_with_optional_percent parser');
  assert((calculation.interaction.answerParsers || []).includes('decrease_phrase_to_negative_percent'), 'calculation must declare decrease_phrase_to_negative_percent parser');
  assert(calculation.expected.finalAnswer.kind === 'number', 'calculation final answer must be numeric');
  assert(calculation.expected.finalAnswer.acceptedNotations.includes('-50%'), 'calculation must accept -50%');
  assert(calculation.expected.finalAnswer.acceptedNotations.includes('50% daling'), 'calculation must accept 50% daling');
  assert(calculation.expected.interval && calculation.expected.interval.value === '150-300', 'calculation must require the correct source interval');
  assert(calculation.expected.oldValue && calculation.expected.oldValue.value === 300, 'calculation must require old Q = 300');
  assert(calculation.expected.newValue && calculation.expected.newValue.value === 150, 'calculation must require new Q = 150');
  assert(calculation.expected.formula && calculation.expected.formula.kind === 'formula_builder', 'calculation must validate the embedded formula builder');
  assert(calculation.expected.conclusion && calculation.expected.conclusion.value === 'drop50', 'calculation must validate the conclusion choice');
  assert((calculation.expected.requiredWorkText || []).length === 4, 'calculation must require both interval endpoints and both Q-values');
  assertWorkGroup(calculation, 'startprijs', ['1,50', '1.50']);
  assertWorkGroup(calculation, 'eindprijs', ['3,00', '3.00']);
  assertWorkGroup(calculation, 'oude hoeveelheid', ['300']);
  assertWorkGroup(calculation, 'nieuwe hoeveelheid', ['150']);
  const correctFormula = calculation.expected.formula.tokens.slice();
  assert(TaskShellEngine.evaluateTask(calculation, {
    interval: '150-300',
    oldValue: '300',
    newValue: '150',
    formula: { tokens: correctFormula },
    work: 'van EUR 1,50 naar EUR 3,00: oude hoeveelheid 300, nieuwe hoeveelheid 150',
    finalAnswer: '50 procent gedaald',
    conclusion: 'drop50',
    unitNotation: 'Q daalt met 50 procent',
  }).matched, 'calculation parser must accept natural decrease phrase notation');
  assert(!TaskShellEngine.evaluateTask(calculation, {
    interval: '150-300',
    oldValue: '300',
    newValue: '150',
    formula: { tokens: correctFormula },
    work: 'van EUR 1,50: oude hoeveelheid 300, nieuwe hoeveelheid 150',
    finalAnswer: '-50%',
    conclusion: 'drop50',
    unitNotation: 'Q daalt met 50 procent',
  }).matched, 'calculation work checker must reject missing end price');
  assert(!TaskShellEngine.evaluateTask(calculation, {
    interval: '150-300',
    oldValue: '',
    newValue: '150',
    formula: { tokens: correctFormula },
    work: 'van EUR 1,50 naar EUR 3,00: oude hoeveelheid 300, nieuwe hoeveelheid 150',
    finalAnswer: '-50%',
    conclusion: 'drop50',
    unitNotation: 'Q daalt met 50 procent',
  }).matched, 'calculation must reject a missing old Q field');
  assert(!TaskShellEngine.evaluateTask(calculation, {
    interval: '150-300',
    oldValue: '300',
    newValue: '150',
    formula: { tokens: correctFormula.slice(0, -1).concat(['newQden']) },
    work: 'van EUR 1,50 naar EUR 3,00: oude hoeveelheid 300, nieuwe hoeveelheid 150',
    finalAnswer: '-50%',
    conclusion: 'drop50',
    unitNotation: 'Q daalt met 50 procent',
  }).matched, 'calculation must reject an embedded formula distractor');

  return {
    task_families: taskShells(data).map((shell) => shell.family),
    context_blocks: data.contextBlocks.map((block) => `${block.id}:${block.type}`),
    placeholder_count: placeholders.length,
    structured_claim_control: true,
    graph_line_shape_choices_exposed: false,
  };
}

function checkGeneratedOutput() {
  const sharedPath = path.join(BOOK_ROOT, 'shared', 'exit-ticket', '1.1.3-exit-ticket.js');
  const shared = read(sharedPath);
  const pagePath = findGeneratedExitPage();
  const page = read(pagePath);
  assert(shared.includes('graph_construction_substitute'), 'generated shared data missing graph construction task');
  assert(shared.includes('graph_reading'), 'generated shared data missing graph reading task');
  assert(shared.includes('calculation_work_capture'), 'generated shared data missing calculation task');
  assert(shared.includes('golden_exercise_workbench'), 'generated shared data missing golden exercise framework metadata');
  assert(shared.includes('percentage_claim_control'), 'generated shared data missing structured percentage claim mode');
  assert(!shared.includes('lineShapeOptions'), 'generated shared data must not expose graph line-shape choices');
  assert(shared.includes('newQden'), 'generated shared data missing embedded formula distractor');
  assert(!/"family":\s*"formula_builder"/.test(shared), 'generated shared data must not split the formula into a separate task');
  assert(shared.includes('magnetic_table_point'), 'generated shared data missing magnetic snapping metadata');
  assert(!shared.includes('ctx-stationbroodjes-formula'), 'generated shared data must not include formula context');
  assert(page.includes('shared/exit-ticket/1.1.3-exit-ticket.js'), 'generated page must load 1.1.3 exit-ticket data');
  assert(page.includes('class="ge-topbar"'), 'generated page shell must expose standalone ge-topbar');
  assert(page.includes('class="ge-page" data-golden-ticket-root'), 'generated page shell must expose standalone golden ticket root');
  assert(page.includes('shared/golden-ticket-layout.css'), 'generated page must load golden ticket layout CSS');
  assert(page.includes('shared/golden-ticket-graph.js'), 'generated page must load golden ticket graph runtime');
  assert(page.includes('shared/golden-ticket-layout.js'), 'generated page must load golden ticket layout runtime');
  assert(!page.includes('id="exit-ticket-app"'), 'generated page must not use the old exit-ticket app mount');
  assert(!page.includes('shared/task-shell.css'), 'generated page must not load legacy task-shell CSS');
  assert(!page.includes('shared/exit-ticket.css'), 'generated page must not load legacy exit-ticket CSS');
  assert(!page.includes('shared/skill-map-route.css'), 'generated page must not load legacy route CSS');
  assert(!page.includes('shared/task-shell-ui.js'), 'generated page must not load legacy task-shell UI');
  assert(!page.includes('shared/exit-ticket-ui.js'), 'generated page must not load legacy exit-ticket UI');
  assert(!/\bclass="[^"]*\bge-[^"]*\bet-[^"]*"/.test(page), 'generated page must not mix ge-* and et-* classes');
  assert(page.includes('data-graph-id="golden-ticket-113"'), 'generated page must include the golden graph root');
  return {
    shared_data: path.relative(ROOT, sharedPath).replace(/\\/g, '/'),
    exit_page: path.relative(ROOT, pagePath).replace(/\\/g, '/'),
  };
}

function main() {
  const source = checkSource();
  const exemplarFiles = requireExemplarFiles();
  const generated = checkGeneratedOutput();
  const GoldenTicketLayout = require('../../engines/golden-ticket-layout');
  const rendered = GoldenTicketLayout.renderMain(readJson(SOURCE_PATH));
  assert(rendered.includes('class="ge-workbench"'), 'rendered 1.1.3 output must use ge-workbench');
  assert(rendered.includes('class="ge-source-card"'), 'rendered 1.1.3 output must use ge-source-card');
  assert(rendered.includes('class="ge-task-card"'), 'rendered 1.1.3 output must use ge-task-card');
  assert(!rendered.includes('class="ge-task-header"'), 'rendered 1.1.3 output must not expose the internal workbench header');
  assert(!rendered.includes('>Werkbank<'), 'rendered 1.1.3 output must not show the internal workbench label');
  assert(!rendered.includes('<h2>Werkvragen</h2>'), 'rendered 1.1.3 output must not show the internal work-questions heading');
  assert(rendered.includes('class="ge-step ge-step-graph"'), 'rendered 1.1.3 output must include the graph step');
  assert(rendered.includes('class="ge-step ge-step-reading'), 'rendered 1.1.3 output must include the reading step');
  assert(rendered.includes('class="ge-step ge-step-claim'), 'rendered 1.1.3 output must include the claim step');
  assert(!rendered.includes('id="exit-ticket-app"'), 'rendered 1.1.3 output must not use the old exit-ticket app mount');
  assert(!/\bclass="[^"]*\bet-/.test(rendered), 'rendered 1.1.3 output must not use et-* route shell classes');
  assert(!rendered.includes('et-source-task-workspace'), 'rendered 1.1.3 output must not use the old source/task workspace framework');
  const proof = {
    schema_version: 1,
    sprint_id: 'CHECKSURFACE-113-EXEMPLAR-EXIT-1',
    generated: new Date().toISOString(),
    status: 'passed',
    source,
    generated_output: generated,
    exemplar: {
      directory: path.relative(ROOT, EXEMPLAR_DIR).replace(/\\/g, '/'),
      required_files: exemplarFiles.required.map((file) => file.replace(/\\/g, '/')),
      review_state: exemplarFiles.review_state,
      next_state: exemplarFiles.next_state,
    },
    authority: {
      target_readiness_evidence_authorized: false,
      completion_language_authorized: false,
      human_review_completed: false,
    },
  };
  fs.mkdirSync(path.dirname(PROOF_PATH), { recursive: true });
  fs.writeFileSync(PROOF_PATH, `${JSON.stringify(proof, null, 2)}\n`);
  console.log(`CHECKSURFACE-113-EXEMPLAR-EXIT-1 passed; proof written to ${path.relative(ROOT, PROOF_PATH)}`);
}

main();
