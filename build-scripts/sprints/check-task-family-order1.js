#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine'));
const TaskShellUI = require(path.join(ROOT, 'engines', 'task-shell-ui'));

function fail(message) {
  console.error(`TASK-FAMILY-ORDER-1 check failed: ${message}`);
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
  id: 'step-order-procent',
  family: 'step_ordering',
  skillLabel: 'Procedure ordenen',
  purpose: 'Zet de berekenprocedure in de juiste volgorde.',
  prompt: 'Orden de stappen voor procentuele verandering.',
  interaction: {
    steps: [
      { id: 'verschil', label: 'Bereken het verschil', kind: 'answer', description: 'Nieuw min oud' },
      { id: 'deel-door-oud', label: 'Deel door de oude waarde', kind: 'answer' },
      { id: 'keer-100', label: 'Vermenigvuldig met 100%', kind: 'answer' },
      { id: 'deel-door-nieuw', label: 'Deel door de nieuwe waarde', kind: 'distractor', distractorFor: 'deel-door-oud' }
    ],
    separator: ' -> ',
    placeholder: 'Orden de stappen.',
    stepBankLabel: 'Stappenbank',
    sequenceLabel: 'Gekozen volgorde'
  },
  expected: {
    kind: 'step_ordering',
    order: ['verschil', 'deel-door-oud', 'keer-100'],
    partialFeedback: 'practice_only'
  },
  feedback: {
    matchTitle: 'Volgorde klopt',
    matchText: 'Je gebruikt de oude waarde als basis.',
    retryTitle: 'Controleer de volgorde',
    retryText: 'Begin met het verschil en deel daarna door oud.'
  },
  practiceRoute: {
    label: 'Oefen verder met rekenen',
    href: 'wiskundevaardigheden.html'
  }
};

assert(TaskShellEngine.FAMILIES.step_ordering, 'TaskShellEngine must declare step_ordering');
assert(TaskShellEngine.FAMILIES.step_ordering.deterministic === true, 'step_ordering must be deterministic');
assert(TaskShellEngine.validateTask(fixtureTask) === true, 'fixture task must validate');

assert(TaskShellEngine.evaluateTask(fixtureTask, {
  order: ['verschil', 'deel-door-oud', 'keer-100']
}).matched === true, 'step_ordering must match the exact ordered response');

const retry = TaskShellEngine.evaluateTask(fixtureTask, {
  order: ['verschil', 'keer-100', 'deel-door-nieuw']
});
assert(retry.matched === false, 'wrong order plus distractor must fail');
assert(retry.orderFeedback.mode === 'practice_only', 'order feedback must be practice_only');
assert(retry.orderFeedback.firstMisplaced.expectedId === 'deel-door-oud', 'order feedback must identify first misplaced expected step');
assert(retry.orderFeedback.firstMisplaced.actualId === 'keer-100', 'order feedback must identify first misplaced actual step');
assert(retry.orderFeedback.missingRequired.length === 1, 'order feedback must report missing required step');
assert(retry.orderFeedback.selectedDistractors.length === 1, 'order feedback must report selected distractor');
assert(retry.orderFeedback.correctPrefix.length === 1, 'order feedback must report correct prefix');

assert(TaskShellEngine.evaluateTask(fixtureTask, {
  order: ['verschil', 'keer-100', 'deel-door-oud']
}).matched === false, 'same set in wrong order must fail');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  order: ['verschil', 'deel-door-oud']
}).matched === false, 'omitted answer step must fail');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  order: ['verschil', 'deel-door-oud', 'keer-100', 'deel-door-nieuw']
}).matched === false, 'selected distractor must fail exact match');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  order: ['verschil', 'deel-door-oud', 'keer-100'],
  extra: 'ignored'
}).matched === false, 'extra response keys must not match');
assert(TaskShellEngine.evaluateTask(fixtureTask, ['verschil', 'deel-door-oud', 'keer-100']).matched === false, 'raw arrays must not match');
const arrayWithOrder = [];
arrayWithOrder.order = ['verschil', 'deel-door-oud', 'keer-100'];
assert(TaskShellEngine.evaluateTask(fixtureTask, arrayWithOrder).matched === false, 'arrays with an order property must not match exact response shape');
assert(TaskShellEngine.evaluateTask(fixtureTask, { order: ['verschil', 'verschil', 'keer-100'] }).matched === false, 'duplicate selected steps must not match');
assert(TaskShellEngine.evaluateTask(fixtureTask, { order: ['verschil', 2, 'keer-100'] }).matched === false, 'non-string response ids must not match');
assert(TaskShellEngine.evaluateTask(fixtureTask, { order: ['verschil', 'onbekend', 'keer-100'] }).matched === false, 'unknown selected steps must not match');

assert(TaskShellEngine.focusPlan(fixtureTask).includes('[data-task-id="step-order-procent"][data-step-id]'), 'focus plan must include step bank');
assert(TaskShellEngine.focusPlan(fixtureTask).includes('[data-task-id="step-order-procent"][data-step-sequence]'), 'focus plan must include ordered sequence');

const duplicateStep = JSON.parse(JSON.stringify(fixtureTask));
duplicateStep.interaction.steps[1].id = 'verschil';
assertThrows(() => TaskShellEngine.validateTask(duplicateStep), 'duplicate step ids must be rejected');

const neutralStep = JSON.parse(JSON.stringify(fixtureTask));
neutralStep.interaction.steps[3].kind = 'neutral';
assertThrows(() => TaskShellEngine.validateTask(neutralStep), 'neutral step kind must be rejected');

const noDistractor = JSON.parse(JSON.stringify(fixtureTask));
noDistractor.interaction.steps = noDistractor.interaction.steps.filter((step) => step.kind !== 'distractor');
assertThrows(() => TaskShellEngine.validateTask(noDistractor), 'no-distractor step ordering must be rejected');

const omittedAnswer = JSON.parse(JSON.stringify(fixtureTask));
omittedAnswer.expected.order = ['verschil', 'deel-door-oud'];
assertThrows(() => TaskShellEngine.validateTask(omittedAnswer), 'expected.order must cover all answer steps');

const distractorExpected = JSON.parse(JSON.stringify(fixtureTask));
distractorExpected.expected.order = ['verschil', 'deel-door-nieuw', 'keer-100'];
assertThrows(() => TaskShellEngine.validateTask(distractorExpected), 'expected.order must reject distractor ids');

const duplicateExpected = JSON.parse(JSON.stringify(fixtureTask));
duplicateExpected.expected.order = ['verschil', 'deel-door-oud', 'deel-door-oud'];
assertThrows(() => TaskShellEngine.validateTask(duplicateExpected), 'expected.order must reject duplicates');

const badFeedbackMode = JSON.parse(JSON.stringify(fixtureTask));
badFeedbackMode.expected.partialFeedback = 'diagnostic';
assertThrows(() => TaskShellEngine.validateTask(badFeedbackMode), 'step_ordering partial feedback must be practice_only');

const rendered = TaskShellUI.renderTask(fixtureTask, 0);
for (const fragment of [
  'data-task-family="step_ordering"',
  'class="ts-step-ordering"',
  'data-step-id="deel-door-nieuw"',
  'data-step-sequence',
  'role="group" aria-label="Stappenbank"',
  'aria-label="Gekozen volgorde"',
  'aria-live="polite"'
]) {
  assert(rendered.includes(fragment), `rendered fixture missing ${fragment}`);
}

const feedbackHtml = TaskShellUI.renderFeedback(retry);
for (const fragment of [
  'class="ts-order-feedback"',
  'Eerste plek om te controleren',
  'Deel door de oude waarde',
  'Vermenigvuldig met 100%',
  'Afleider gekozen',
  'Deel door de nieuwe waarde',
  'Begin klopt al',
  'Bereken het verschil'
]) {
  assert(feedbackHtml.includes(fragment), `order feedback HTML missing ${fragment}`);
}

assert(typeof TaskShellUI.collectStepOrderingResponse === 'function', 'TaskShellUI must export collectStepOrderingResponse');
assert(typeof TaskShellUI.handleStepOrderingClick === 'function', 'TaskShellUI must export handleStepOrderingClick');

const engineSource = read('engines/task-shell-engine.js');
const uiSource = read('engines/task-shell-ui.js');
const cssSource = read('engines/task-shell.css');
const exitTicketSource = read('engines/exit-ticket-ui.js');
const skilltreeSource = read('engines/skilltree-ui.js');
const graphSource = read('engines/graphical-ui.js');

for (const [label, source, fragments] of [
  ['engine', engineSource, ['step_ordering', 'validateStepOrderingInteraction', 'stepOrderingMatches', 'orderFeedback']],
  ['ui', uiSource, ['renderStepOrdering', 'collectStepOrderingResponse', 'handleStepOrderingClick', 'data-step-id']],
  ['css', cssSource, ['.ts-step-ordering', '.ts-step-token', '.ts-order-feedback']],
  ['exit-ticket', exitTicketSource, ['handleStepOrderingClick(app, event)', 'collectStepOrderingResponse(wrapper, task)', "task.family === 'step_ordering'"]],
  ['skilltree', skilltreeSource, ['handleStepOrderingClick(els.exStepSlot, e)', 'collectStepOrderingResponse(root, task)', "task.family === 'step_ordering'"]],
  ['graphical', graphSource, ['handleStepOrderingClick(rootEl, event)', 'collectStepOrderingResponse(rootEl, task)', 'task.family === "step_ordering"']]
]) {
  for (const fragment of fragments) {
    assert(source.includes(fragment), `${label} source missing ${fragment}`);
  }
}

assert(!uiSource.includes('data-sentence-selected-token-id') || uiSource.includes('data-step-selected-id'), 'step_ordering must use distinct selected-step selectors');

const proof = readJson('reports/json/task-family-order1-proof.json');
assert(proof.sprint_id === 'TASK-FAMILY-ORDER-1', 'proof JSON has wrong sprint_id');
assert(proof.family === 'step_ordering', 'proof JSON has wrong family');
assert(proof.runtime_support.exact_order_matching === true, 'proof JSON must cover exact order matching');
assert(proof.runtime_support.full_answer_step_coverage_required === true, 'proof JSON must cover full answer-step coverage');
assert(proof.runtime_support.neutral_steps_allowed === false, 'proof JSON must reject neutral steps');
assert(proof.runtime_support.no_distractor_exemption === false, 'proof JSON must reject no-distractor exemption');
assert(proof.runtime_support.practice_only_order_feedback === true, 'proof JSON must cover practice-only order feedback');
assert(proof.boundary_flags.target_equivalent_reliance === false, 'proof JSON must block target-equivalent reliance');
assert(proof.boundary_flags.generated_lesson_output_changed === false, 'proof JSON must block generated output changes');
assert(proof.wrapper_collection.exit_ticket === true, 'proof JSON must cover exit-ticket wrapper');
assert(proof.wrapper_collection.skilltree === true, 'proof JSON must cover skilltree wrapper');
assert(proof.wrapper_collection.graphical === true, 'proof JSON must cover graphical wrapper');

const fixtureHtml = read('reports/sprints/TASK-FAMILY-ORDER-1-rendered-fixture.html');
assert(fixtureHtml.includes('data-task-family="step_ordering"'), 'rendered fixture artifact missing step_ordering family marker');
assert(fixtureHtml.includes('data-step-id="deel-door-nieuw"'), 'rendered fixture artifact missing step marker');
assert(fixtureHtml.includes('data-step-selected-id="verschil"'), 'rendered fixture artifact missing after-click selected-step proof');
assert(fixtureHtml.includes('class="ts-order-feedback"'), 'rendered fixture artifact missing order feedback proof');
assert(fixtureHtml.includes('data-fixture-viewport="narrow"'), 'rendered fixture artifact missing narrow proof');
assert(fixtureHtml.includes('data-fixture-theme="dark"'), 'rendered fixture artifact missing dark proof');
assert(fixtureHtml.includes('aria-label="Feedback op je antwoord"'), 'rendered fixture artifact missing feedback region');

const manifest = read('reports/sprints/TASK-FAMILY-ORDER-1-screenshot-manifest.md');
assert(/standard/i.test(manifest) && /narrow/i.test(manifest) && /dark/i.test(manifest), 'screenshot manifest must describe standard/narrow/dark fixture proof');
assert(/after-click/i.test(manifest), 'screenshot manifest must describe after-click interaction proof');
assert(/no generated lesson output/i.test(manifest), 'screenshot manifest must preserve generated-output boundary');

console.log('TASK-FAMILY-ORDER-1 check OK');
