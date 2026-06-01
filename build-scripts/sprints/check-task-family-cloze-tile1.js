#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine'));
const TaskShellUI = require(path.join(ROOT, 'engines', 'task-shell-ui'));

function fail(message) {
  console.error(`TASK-FAMILY-CLOZE-TILE-1 check failed: ${message}`);
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

const fixtureTask = {
  id: 'cloze-indexpunten',
  family: 'cloze_tile_select',
  skillLabel: 'Indexpunten invullen',
  purpose: 'Vul een gecontroleerde indexzin aan met tegels.',
  prompt: 'Maak de zin over indexpunten af.',
  interaction: {
    segments: [
      { type: 'text', text: 'De stijging van 108 naar 112 is ' },
      { type: 'blank', blankId: 'indexpunten' },
      { type: 'text', text: ' indexpunten. De procentuele stijging deel je door ' },
      { type: 'blank', blankId: 'basis' },
      { type: 'text', text: '.' }
    ],
    blanks: [
      { id: 'indexpunten', label: 'Stijging in indexpunten' },
      { id: 'basis', label: 'Basis voor procentuele stijging' }
    ],
    tiles: [
      { id: 'vier', label: '4', kind: 'answer' },
      { id: 'honderdacht', label: '108', kind: 'answer' },
      { id: 'vier-procent', label: '4%', kind: 'distractor', distractorFor: 'indexpunten' },
      { id: 'honderd', label: '100', kind: 'distractor', distractorFor: 'basis' }
    ]
  },
  expected: {
    kind: 'cloze_tile_select',
    blanks: {
      indexpunten: 'vier',
      basis: 'honderdacht'
    }
  },
  feedback: {
    matchTitle: 'Zin klopt',
    matchText: 'Je maakt onderscheid tussen indexpunten en procenten.',
    retryTitle: 'Controleer je tegels',
    retryText: 'Let op het verschil tussen indexpunten en procenten.'
  },
  practiceRoute: {
    label: 'Oefen verder met indexcijfers',
    href: 'wiskundevaardigheden.html#indexpunten'
  }
};

assert(TaskShellEngine.FAMILIES.cloze_tile_select, 'TaskShellEngine must declare cloze_tile_select');
assert(TaskShellEngine.FAMILIES.cloze_tile_select.deterministic === true, 'cloze_tile_select must be deterministic');
assert(TaskShellEngine.validateTask(fixtureTask) === true, 'fixture task must validate');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  blanks: { indexpunten: 'vier', basis: 'honderdacht' }
}).matched === true, 'correct blank-to-tile mapping must match');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  blanks: { indexpunten: 'vier-procent', basis: 'honderdacht' }
}).matched === false, 'distractor tile must not match');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  blanks: { indexpunten: 'vier' }
}).matched === false, 'missing blank must not match');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  indexpunten: 'vier',
  basis: 'honderdacht'
}).matched === false, 'raw blank map must not match exact response shape');

assert(TaskShellEngine.focusPlan(fixtureTask).includes('[data-task-id="cloze-indexpunten"][data-cloze-tile-id]'), 'focus plan must include cloze tiles');
assert(TaskShellEngine.focusPlan(fixtureTask).includes('[data-task-id="cloze-indexpunten"][data-cloze-blank-id]'), 'focus plan must include cloze blanks');

const rendered = TaskShellUI.renderTask(fixtureTask, 0);
for (const fragment of [
  'data-task-family="cloze_tile_select"',
  'class="ts-cloze"',
  'data-cloze-blank-id="indexpunten"',
  'data-cloze-tile-id="vier-procent"',
  'class="ts-cloze-clear"',
  'role="group" aria-label="Tegelbank"',
  'aria-live="polite"'
]) {
  assert(rendered.includes(fragment), `rendered fixture missing ${fragment}`);
}

assert(typeof TaskShellUI.collectClozeTileResponse === 'function', 'TaskShellUI must export collectClozeTileResponse');
assert(typeof TaskShellUI.handleClozeTileClick === 'function', 'TaskShellUI must export handleClozeTileClick');

const engineSource = read('engines/task-shell-engine.js');
const uiSource = read('engines/task-shell-ui.js');
const cssSource = read('engines/task-shell.css');
const exitTicketSource = read('engines/exit-ticket-ui.js');
const skilltreeSource = read('engines/skilltree-ui.js');
const graphSource = read('engines/graphical-ui.js');

for (const [label, source, fragments] of [
  ['engine', engineSource, ['validateClozeInteraction', 'clozeTileMatches', 'allowReuse']],
  ['ui', uiSource, ['renderClozeTileSelect', 'collectClozeTileResponse', 'handleClozeTileClick']],
  ['css', cssSource, ['.ts-cloze-bank', '.ts-cloze-blank', '.ts-cloze-tile']],
  ['exit-ticket', exitTicketSource, ['handleClozeTileClick(app, event)', 'collectClozeTileResponse(wrapper, task)']],
  ['skilltree', skilltreeSource, ['handleClozeTileClick(els.exStepSlot, e)', 'collectClozeTileResponse(root, task)']],
  ['graphical', graphSource, ['handleClozeTileClick(rootEl, event)', 'collectClozeTileResponse(rootEl, task)']]
]) {
  for (const fragment of fragments) {
    assert(source.includes(fragment), `${label} source missing ${fragment}`);
  }
}

const proof = readJson('reports/json/task-family-cloze-tile1-proof.json');
assert(proof.sprint_id === 'TASK-FAMILY-CLOZE-TILE-1', 'proof JSON has wrong sprint_id');
assert(proof.family === 'cloze_tile_select', 'proof JSON has wrong family');
assert(proof.boundary_flags.target_equivalent_reliance === false, 'proof JSON must block target-equivalent reliance');
assert(proof.boundary_flags.generated_lesson_output_changed === false, 'proof JSON must block generated output changes');
assert(proof.wrapper_collection.exit_ticket === true, 'proof JSON must cover exit-ticket wrapper');
assert(proof.wrapper_collection.skilltree === true, 'proof JSON must cover skilltree wrapper');
assert(proof.wrapper_collection.graphical === true, 'proof JSON must cover graphical wrapper');

const fixtureHtml = read('reports/sprints/TASK-FAMILY-CLOZE-TILE-1-rendered-fixture.html');
assert(fixtureHtml.includes('data-task-family="cloze_tile_select"'), 'rendered fixture artifact missing cloze family marker');
assert(fixtureHtml.includes('data-cloze-tile-id="vier-procent"'), 'rendered fixture artifact missing distractor tile');
assert(fixtureHtml.includes('data-cloze-blank-id="basis"'), 'rendered fixture artifact missing blank target');

const manifest = read('reports/sprints/TASK-FAMILY-CLOZE-TILE-1-screenshot-manifest.md');
assert(/rendered fixture/i.test(manifest), 'screenshot manifest must describe rendered fixture proof');
assert(/no generated lesson output/i.test(manifest), 'screenshot manifest must preserve generated-output boundary');

console.log('TASK-FAMILY-CLOZE-TILE-1 check OK');
