#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine'));
const TaskShellUI = require(path.join(ROOT, 'engines', 'task-shell-ui'));

function fail(message) {
  console.error(`TASK-FAMILY-MULTI-1 check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function readJson(file) {
  return JSON.parse(read(file));
}

function assertThrows(fn, message) {
  let threw = false;
  try {
    fn();
  } catch (error) {
    threw = true;
  }
  assert(threw, message);
}

const fixtureTask = {
  id: 'multi-select-schaarste',
  family: 'multi_select',
  skillLabel: 'Schaarste herkennen',
  purpose: 'Kies de complete set uitspraken die bij schaarste hoort.',
  prompt: 'Welke uitspraken horen bij schaarste?',
  interaction: {
    inputLabel: 'Uitspraken over schaarste',
    options: [
      { id: 'behoeften', label: 'Behoeften zijn groter dan beschikbare middelen.' },
      { id: 'keuze', label: 'Je moet kiezen tussen alternatieven.' },
      { id: 'alles-kan', label: 'Iedereen kan alles krijgen wat hij wil.' }
    ]
  },
  expected: {
    kind: 'multi_select',
    mode: 'exact_set',
    values: ['behoeften', 'keuze'],
    partialFeedback: 'practice_only'
  },
  feedback: {
    matchTitle: 'Set klopt',
    matchText: 'Je kiest beide kenmerken van schaarste.',
    retryTitle: 'Controleer je set',
    retryText: 'Kies alle uitspraken die nodig zijn, en laat afleiders weg.'
  },
  practiceRoute: {
    label: 'Oefen verder met schaarste',
    href: 'redeneer-spel.html'
  }
};

assert(TaskShellEngine.FAMILIES.multi_select, 'TaskShellEngine must declare multi_select');
assert(TaskShellEngine.FAMILIES.multi_select.deterministic === true, 'multi_select must be deterministic');
assert(TaskShellEngine.validateTask(fixtureTask) === true, 'fixture task must validate');

assert(TaskShellEngine.evaluateTask(fixtureTask, {
  values: ['keuze', 'behoeften']
}).matched === true, 'multi_select must match exact set order-insensitively');

const retry = TaskShellEngine.evaluateTask(fixtureTask, {
  values: ['behoeften', 'alles-kan']
});
assert(retry.matched === false, 'selected distractor must fail exact-set match');
assert(retry.selectionFeedback.mode === 'practice_only', 'partial feedback must be practice_only');
assert(retry.selectionFeedback.missingRequired.length === 1, 'partial feedback must report missing required option');
assert(retry.selectionFeedback.selectedDistractors.length === 1, 'partial feedback must report selected distractor');
assert(retry.selectionFeedback.correctSelected.length === 1, 'partial feedback must report correct selected option');

assert(TaskShellEngine.evaluateTask(fixtureTask, {
  values: ['behoeften', 'keuze'],
  extra: 'ignored'
}).matched === false, 'extra response keys must not match exact response shape');
assert(TaskShellEngine.evaluateTask(fixtureTask, ['behoeften', 'keuze']).matched === false, 'raw arrays must not match exact response shape');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  values: ['behoeften', 'behoeften', 'keuze']
}).matched === false, 'duplicate selected values must not match');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  values: ['behoeften', 'onbekend']
}).matched === false, 'unknown selected values must not match');

const numericIdTask = JSON.parse(JSON.stringify(fixtureTask));
numericIdTask.id = 'multi-select-numeric-string-ids';
numericIdTask.interaction.options = [
  { id: '1', label: 'Eerste juiste optie' },
  { id: '2', label: 'Tweede juiste optie' },
  { id: '3', label: 'Afleider' }
];
numericIdTask.expected.values = ['1', '2'];
assert(TaskShellEngine.validateTask(numericIdTask) === true, 'numeric-string id fixture must validate');
assert(TaskShellEngine.evaluateTask(numericIdTask, { values: ['1', '2'] }).matched === true, 'string ids must match when selected as strings');
assert(TaskShellEngine.evaluateTask(numericIdTask, { values: [1, '2'] }).matched === false, 'numeric response id must not coerce to string option id');
assert(TaskShellEngine.evaluateTask(numericIdTask, { values: [{ id: '1' }, '2'] }).matched === false, 'object response id must not coerce to string option id');

assert(TaskShellEngine.focusPlan(fixtureTask).includes('[data-task-id="multi-select-schaarste"][data-multi-option-id]'), 'focus plan must include multi-select options');

const oneAnswer = JSON.parse(JSON.stringify(fixtureTask));
oneAnswer.expected.values = ['behoeften'];
assertThrows(() => TaskShellEngine.validateTask(oneAnswer), 'single-answer multi_select must be rejected');

const noDistractor = JSON.parse(JSON.stringify(fixtureTask));
noDistractor.expected.values = ['behoeften', 'keuze', 'alles-kan'];
assertThrows(() => TaskShellEngine.validateTask(noDistractor), 'multi_select without distractor option must be rejected');

const missingLabel = JSON.parse(JSON.stringify(fixtureTask));
missingLabel.interaction.inputLabel = '';
assertThrows(() => TaskShellEngine.validateTask(missingLabel), 'multi_select inputLabel must be required');

const rendered = TaskShellUI.renderTask(fixtureTask, 0);
for (const fragment of [
  'data-task-family="multi_select"',
  'class="ts-multi-select"',
  'data-multi-option-id="alles-kan"',
  'aria-pressed="false"',
  'role="group" aria-label="Uitspraken over schaarste"',
  'aria-live="polite"'
]) {
  assert(rendered.includes(fragment), `rendered fixture missing ${fragment}`);
}

const feedbackHtml = TaskShellUI.renderFeedback(retry);
for (const fragment of [
  'class="ts-selection-feedback"',
  'Nog nodig',
  'Niet nodig gekozen',
  'Al goed gekozen',
  'Je moet kiezen tussen alternatieven.',
  'Iedereen kan alles krijgen wat hij wil.'
]) {
  assert(feedbackHtml.includes(fragment), `partial feedback HTML missing ${fragment}`);
}

assert(typeof TaskShellUI.collectMultiSelectResponse === 'function', 'TaskShellUI must export collectMultiSelectResponse');
assert(typeof TaskShellUI.handleMultiSelectClick === 'function', 'TaskShellUI must export handleMultiSelectClick');

const engineSource = read('engines/task-shell-engine.js');
const uiSource = read('engines/task-shell-ui.js');
const cssSource = read('engines/task-shell.css');
const exitTicketSource = read('engines/exit-ticket-ui.js');
const skilltreeSource = read('engines/skilltree-ui.js');
const graphSource = read('engines/graphical-ui.js');

for (const [label, source, fragments] of [
  ['engine', engineSource, ['multi_select', 'multiSelectMatches', 'selectionFeedback', 'partialFeedback']],
  ['ui', uiSource, ['renderMultiSelect', 'collectMultiSelectResponse', 'handleMultiSelectClick', 'data-multi-option-id']],
  ['css', cssSource, ['.ts-multi-select', '.ts-multi-option', '.ts-selection-feedback']],
  ['exit-ticket', exitTicketSource, ['handleMultiSelectClick(app, event)', 'collectMultiSelectResponse(wrapper, task)', "task.family === 'multi_select'"]],
  ['skilltree', skilltreeSource, ['handleMultiSelectClick(els.exStepSlot, e)', 'collectMultiSelectResponse(root, task)', "task.family === 'multi_select'"]],
  ['graphical', graphSource, ['handleMultiSelectClick(rootEl, event)', 'collectMultiSelectResponse(rootEl, task)', 'task.family === "multi_select"']]
]) {
  for (const fragment of fragments) {
    assert(source.includes(fragment), `${label} source missing ${fragment}`);
  }
}

assert(!uiSource.includes('collectMultiSelectResponse(rootEl, task) {\n    var selected = rootEl.querySelector'), 'multi_select must not reuse single selected choice collection');

const proof = readJson('reports/json/task-family-multi1-proof.json');
assert(proof.sprint_id === 'TASK-FAMILY-MULTI-1', 'proof JSON has wrong sprint_id');
assert(proof.family === 'multi_select', 'proof JSON has wrong family');
assert(proof.runtime_support.exact_set_matching === true, 'proof JSON must cover exact-set matching');
assert(proof.runtime_support.extra_response_keys_match === false, 'proof JSON must record exact response-shape rejection');
assert(proof.runtime_support.practice_only_partial_feedback === true, 'proof JSON must cover practice-only partial feedback');
assert(proof.boundary_flags.target_equivalent_reliance === false, 'proof JSON must block target-equivalent reliance');
assert(proof.boundary_flags.generated_lesson_output_changed === false, 'proof JSON must block generated output changes');
assert(proof.wrapper_collection.exit_ticket === true, 'proof JSON must cover exit-ticket wrapper');
assert(proof.wrapper_collection.skilltree === true, 'proof JSON must cover skilltree wrapper');
assert(proof.wrapper_collection.graphical === true, 'proof JSON must cover graphical wrapper');

const fixtureHtml = read('reports/sprints/TASK-FAMILY-MULTI-1-rendered-fixture.html');
assert(fixtureHtml.includes('data-task-family="multi_select"'), 'rendered fixture artifact missing multi_select family marker');
assert(fixtureHtml.includes('data-multi-option-id="alles-kan"'), 'rendered fixture artifact missing multi option marker');
assert(fixtureHtml.includes('class="ts-selection-feedback"'), 'rendered fixture artifact missing partial feedback proof');
assert(fixtureHtml.includes('aria-label="Feedback op je antwoord"'), 'rendered fixture artifact missing feedback region');

const manifest = read('reports/sprints/TASK-FAMILY-MULTI-1-screenshot-manifest.md');
assert(/rendered fixture/i.test(manifest), 'screenshot manifest must describe rendered fixture proof');
assert(/no generated lesson output/i.test(manifest), 'screenshot manifest must preserve generated-output boundary');

console.log('TASK-FAMILY-MULTI-1 check OK');
