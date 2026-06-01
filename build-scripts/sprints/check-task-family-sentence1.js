#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine'));
const TaskShellUI = require(path.join(ROOT, 'engines', 'task-shell-ui'));

function fail(message) {
  console.error(`TASK-FAMILY-SENTENCE-1 check failed: ${message}`);
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
  id: 'sentence-demand-chain',
  family: 'sentence_builder',
  skillLabel: 'Redenering bouwen',
  purpose: 'Bouw een gecontroleerde oorzaak-gevolg-redenering uit fragmenten.',
  prompt: 'Zet de economische redenering in de juiste volgorde.',
  interaction: {
    tokens: [
      { id: 'prijs-stijgt', label: 'De prijs stijgt', kind: 'answer' },
      { id: 'vraag-daalt', label: 'de gevraagde hoeveelheid daalt', kind: 'answer' },
      { id: 'hogere-prijs', label: 'bij een hogere prijs', kind: 'answer' },
      { id: 'vraag-stijgt', label: 'de gevraagde hoeveelheid stijgt', kind: 'distractor', distractorFor: 'vraag-daalt' }
    ],
    separator: ' -> ',
    placeholder: 'Bouw je redenering met de fragmenten.',
    tokenBankLabel: 'Fragmentbank',
    sequenceLabel: 'Opgebouwde redenering'
  },
  expected: {
    kind: 'sentence_builder',
    tokens: ['prijs-stijgt', 'vraag-daalt', 'hogere-prijs'],
    acceptedSequences: [
      ['prijs-stijgt', 'vraag-daalt', 'hogere-prijs']
    ]
  },
  feedback: {
    matchTitle: 'Redenering klopt',
    matchText: 'Je bouwt oorzaak en gevolg in de juiste volgorde.',
    retryTitle: 'Controleer de volgorde',
    retryText: 'Begin bij de oorzaak en zet daarna het gevolg.'
  },
  practiceRoute: {
    label: 'Oefen verder met redeneren',
    href: 'redeneer-spel.html'
  }
};

assert(TaskShellEngine.FAMILIES.sentence_builder, 'TaskShellEngine must declare sentence_builder');
assert(TaskShellEngine.FAMILIES.sentence_builder.deterministic === true, 'sentence_builder must be deterministic');
assert(TaskShellEngine.validateTask(fixtureTask) === true, 'fixture task must validate');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  tokens: ['prijs-stijgt', 'vraag-daalt', 'hogere-prijs']
}).matched === true, 'correct token sequence must match');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  tokens: ['prijs-stijgt', 'hogere-prijs', 'vraag-daalt']
}).matched === false, 'wrong order must not match');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  tokens: ['prijs-stijgt', 'vraag-daalt']
}).matched === false, 'missing token must not match');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  tokens: ['prijs-stijgt', 'vraag-daalt', 'hogere-prijs', 'vraag-stijgt']
}).matched === false, 'extra distractor token must not match');
assert(TaskShellEngine.evaluateTask(fixtureTask, [
  'prijs-stijgt',
  'vraag-daalt',
  'hogere-prijs'
]).matched === false, 'raw token array must not match exact response shape');

assert(TaskShellEngine.focusPlan(fixtureTask).includes('[data-task-id="sentence-demand-chain"][data-sentence-token-id]'), 'focus plan must include sentence tokens');
assert(TaskShellEngine.focusPlan(fixtureTask).includes('[data-task-id="sentence-demand-chain"][data-sentence-sequence]'), 'focus plan must include sentence sequence');

const rendered = TaskShellUI.renderTask(fixtureTask, 0);
for (const fragment of [
  'data-task-family="sentence_builder"',
  'class="ts-sentence"',
  'data-sentence-token-id="vraag-stijgt"',
  'data-sentence-sequence',
  'class="ts-sentence-clear"',
  'role="group" aria-label="Fragmentbank"',
  'aria-live="polite"'
]) {
  assert(rendered.includes(fragment), `rendered fixture missing ${fragment}`);
}

assert(typeof TaskShellUI.collectSentenceBuilderResponse === 'function', 'TaskShellUI must export collectSentenceBuilderResponse');
assert(typeof TaskShellUI.handleSentenceBuilderClick === 'function', 'TaskShellUI must export handleSentenceBuilderClick');

const engineSource = read('engines/task-shell-engine.js');
const uiSource = read('engines/task-shell-ui.js');
const cssSource = read('engines/task-shell.css');
const exitTicketSource = read('engines/exit-ticket-ui.js');
const skilltreeSource = read('engines/skilltree-ui.js');
const graphSource = read('engines/graphical-ui.js');

for (const [label, source, fragments] of [
  ['engine', engineSource, ['validateSentenceInteraction', 'sentenceBuilderMatches', 'acceptedSequences', 'allowReuse']],
  ['ui', uiSource, ['renderSentenceBuilder', 'collectSentenceBuilderResponse', 'handleSentenceBuilderClick', 'moveSentenceItem']],
  ['css', cssSource, ['.ts-sentence-bank', '.ts-sentence-sequence', '.ts-sentence-token', '.ts-sentence-item']],
  ['exit-ticket', exitTicketSource, ['handleSentenceBuilderClick(app, event)', 'collectSentenceBuilderResponse(wrapper, task)']],
  ['skilltree', skilltreeSource, ['handleSentenceBuilderClick(els.exStepSlot, e)', 'collectSentenceBuilderResponse(root, task)']],
  ['graphical', graphSource, ['handleSentenceBuilderClick(rootEl, event)', 'collectSentenceBuilderResponse(rootEl, task)']]
]) {
  for (const fragment of fragments) {
    assert(source.includes(fragment), `${label} source missing ${fragment}`);
  }
}

const proof = readJson('reports/json/task-family-sentence1-proof.json');
assert(proof.sprint_id === 'TASK-FAMILY-SENTENCE-1', 'proof JSON has wrong sprint_id');
assert(proof.family === 'sentence_builder', 'proof JSON has wrong family');
assert(proof.boundary_flags.target_equivalent_reliance === false, 'proof JSON must block target-equivalent reliance');
assert(proof.boundary_flags.generated_lesson_output_changed === false, 'proof JSON must block generated output changes');
assert(proof.wrapper_collection.exit_ticket === true, 'proof JSON must cover exit-ticket wrapper');
assert(proof.wrapper_collection.skilltree === true, 'proof JSON must cover skilltree wrapper');
assert(proof.wrapper_collection.graphical === true, 'proof JSON must cover graphical wrapper');

const fixtureHtml = read('reports/sprints/TASK-FAMILY-SENTENCE-1-rendered-fixture.html');
assert(fixtureHtml.includes('data-task-family="sentence_builder"'), 'rendered fixture artifact missing sentence family marker');
assert(fixtureHtml.includes('data-sentence-token-id="vraag-stijgt"'), 'rendered fixture artifact missing distractor token');
assert(fixtureHtml.includes('data-sentence-sequence'), 'rendered fixture artifact missing sequence target');

const manifest = read('reports/sprints/TASK-FAMILY-SENTENCE-1-screenshot-manifest.md');
assert(/rendered fixture/i.test(manifest), 'screenshot manifest must describe rendered fixture proof');
assert(/no generated lesson output/i.test(manifest), 'screenshot manifest must preserve generated-output boundary');

console.log('TASK-FAMILY-SENTENCE-1 check OK');
