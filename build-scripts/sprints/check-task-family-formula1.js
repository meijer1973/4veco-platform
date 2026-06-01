#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine'));
const TaskShellUI = require(path.join(ROOT, 'engines', 'task-shell-ui'));

function fail(message) {
  console.error(`TASK-FAMILY-FORMULA-1 check failed: ${message}`);
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
  id: 'formula-percentage-change',
  family: 'formula_builder',
  skillLabel: 'Formule bouwen',
  purpose: 'Bouw de formule voordat je de berekening uitvoert.',
  prompt: 'Bouw de formule voor procentuele verandering.',
  interaction: {
    tokens: [
      { id: 'nieuw-min-oud', label: 'nieuw - oud', kind: 'answer', category: 'numerator' },
      { id: 'delen-door-oud', label: '/ oud', kind: 'answer', category: 'denominator' },
      { id: 'keer-100-procent', label: 'x 100%', kind: 'answer', category: 'multiplier' },
      { id: 'delen-door-nieuw', label: '/ nieuw', kind: 'distractor', category: 'denominator', distractorFor: 'delen-door-oud' }
    ],
    separator: ' ',
    placeholder: 'Bouw de formule met de blokken.',
    tokenBankLabel: 'Formuleblokken',
    sequenceLabel: 'Opgebouwde formule'
  },
  expected: {
    kind: 'formula_builder',
    tokens: ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent'],
    acceptedSequences: [
      ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent']
    ]
  },
  feedback: {
    matchTitle: 'Formule klopt',
    matchText: 'Je kiest de oude waarde als basis.',
    retryTitle: 'Controleer de basis',
    retryText: 'Bij procentuele verandering deel je door oud.'
  },
  practiceRoute: {
    label: 'Oefen verder met rekenen',
    href: 'wiskundevaardigheden.html'
  }
};

assert(TaskShellEngine.FAMILIES.formula_builder, 'TaskShellEngine must declare formula_builder');
assert(TaskShellEngine.FAMILIES.formula_builder.deterministic === true, 'formula_builder must be deterministic');
assert(TaskShellEngine.validateTask(fixtureTask) === true, 'fixture task must validate');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  tokens: ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent']
}).matched === true, 'correct token sequence must match');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  tokens: ['nieuw-min-oud', 'keer-100-procent', 'delen-door-oud']
}).matched === false, 'wrong order must not match');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  tokens: ['nieuw-min-oud', 'delen-door-oud']
}).matched === false, 'missing token must not match');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  tokens: ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent', 'delen-door-nieuw']
}).matched === false, 'extra distractor token must not match');
assert(TaskShellEngine.evaluateTask(fixtureTask, [
  'nieuw-min-oud',
  'delen-door-oud',
  'keer-100-procent'
]).matched === false, 'raw token array must not match exact response shape');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  tokens: ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent'],
  extra: 'ignored'
}).matched === false, 'response object with extra keys must not match exact response shape');

assert(TaskShellEngine.focusPlan(fixtureTask).includes('[data-task-id="formula-percentage-change"][data-formula-token-id]'), 'focus plan must include formula tokens');
assert(TaskShellEngine.focusPlan(fixtureTask).includes('[data-task-id="formula-percentage-change"][data-formula-sequence]'), 'focus plan must include formula sequence');

for (const badCategory of ['answer', 'formula', '']) {
  const invalid = JSON.parse(JSON.stringify(fixtureTask));
  invalid.interaction.tokens[0].category = badCategory;
  assertThrows(() => TaskShellEngine.validateTask(invalid), 'invalid formula category must be rejected');
}

const missingCategory = JSON.parse(JSON.stringify(fixtureTask));
delete missingCategory.interaction.tokens[0].category;
assertThrows(() => TaskShellEngine.validateTask(missingCategory), 'missing formula category must be rejected');

const rendered = TaskShellUI.renderTask(fixtureTask, 0);
for (const fragment of [
  'data-task-family="formula_builder"',
  'class="ts-formula"',
  'data-formula-token-id="delen-door-nieuw"',
  'data-formula-token-category="denominator"',
  'data-formula-sequence',
  'class="ts-formula-clear"',
  'role="group" aria-label="Formuleblokken"',
  'aria-live="polite"'
]) {
  assert(rendered.includes(fragment), `rendered fixture missing ${fragment}`);
}

assert(typeof TaskShellUI.collectFormulaBuilderResponse === 'function', 'TaskShellUI must export collectFormulaBuilderResponse');
assert(typeof TaskShellUI.handleFormulaBuilderClick === 'function', 'TaskShellUI must export handleFormulaBuilderClick');

const engineSource = read('engines/task-shell-engine.js');
const uiSource = read('engines/task-shell-ui.js');
const cssSource = read('engines/task-shell.css');
const exitTicketSource = read('engines/exit-ticket-ui.js');
const skilltreeSource = read('engines/skilltree-ui.js');
const graphSource = read('engines/graphical-ui.js');

for (const [label, source, fragments] of [
  ['engine', engineSource, ['validateFormulaInteraction', 'formulaBuilderMatches', 'FORMULA_TOKEN_CATEGORIES', 'acceptedSequences', 'allowReuse']],
  ['ui', uiSource, ['renderFormulaBuilder', 'collectFormulaBuilderResponse', 'handleFormulaBuilderClick', 'moveFormulaItem']],
  ['css', cssSource, ['.ts-formula-bank', '.ts-formula-sequence', '.ts-formula-token', '.ts-formula-item']],
  ['exit-ticket', exitTicketSource, ['handleFormulaBuilderClick(app, event)', 'collectFormulaBuilderResponse(wrapper, task)']],
  ['skilltree', skilltreeSource, ['handleFormulaBuilderClick(els.exStepSlot, e)', 'collectFormulaBuilderResponse(root, task)']],
  ['graphical', graphSource, ['handleFormulaBuilderClick(rootEl, event)', 'collectFormulaBuilderResponse(rootEl, task)']]
]) {
  for (const fragment of fragments) {
    assert(source.includes(fragment), `${label} source missing ${fragment}`);
  }
}

const proof = readJson('reports/json/task-family-formula1-proof.json');
assert(proof.sprint_id === 'TASK-FAMILY-FORMULA-1', 'proof JSON has wrong sprint_id');
assert(proof.family === 'formula_builder', 'proof JSON has wrong family');
assert(proof.runtime_support.category_metadata_required === true, 'proof JSON must require category metadata');
assert(proof.boundary_flags.target_equivalent_reliance === false, 'proof JSON must block target-equivalent reliance');
assert(proof.boundary_flags.generated_lesson_output_changed === false, 'proof JSON must block generated output changes');
assert(proof.wrapper_collection.exit_ticket === true, 'proof JSON must cover exit-ticket wrapper');
assert(proof.wrapper_collection.skilltree === true, 'proof JSON must cover skilltree wrapper');
assert(proof.wrapper_collection.graphical === true, 'proof JSON must cover graphical wrapper');

const fixtureHtml = read('reports/sprints/TASK-FAMILY-FORMULA-1-rendered-fixture.html');
assert(fixtureHtml.includes('data-task-family="formula_builder"'), 'rendered fixture artifact missing formula family marker');
assert(fixtureHtml.includes('data-formula-token-id="delen-door-nieuw"'), 'rendered fixture artifact missing distractor token');
assert(fixtureHtml.includes('data-formula-token-category="denominator"'), 'rendered fixture artifact missing category metadata');
assert(fixtureHtml.includes('data-formula-sequence'), 'rendered fixture artifact missing sequence target');

const manifest = read('reports/sprints/TASK-FAMILY-FORMULA-1-screenshot-manifest.md');
assert(/rendered fixture/i.test(manifest), 'screenshot manifest must describe rendered fixture proof');
assert(/no generated lesson output/i.test(manifest), 'screenshot manifest must preserve generated-output boundary');

console.log('TASK-FAMILY-FORMULA-1 check OK');

function assertThrows(fn, message) {
  let threw = false;
  try {
    fn();
  } catch (error) {
    threw = true;
  }
  assert(threw, message);
}
