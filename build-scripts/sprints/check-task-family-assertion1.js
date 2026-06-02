#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine'));
const TaskShellUI = require(path.join(ROOT, 'engines', 'task-shell-ui'));

function fail(message) {
  console.error(`TASK-FAMILY-ASSERTION-1 check failed: ${message}`);
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
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

function gitOutput(args) {
  return childProcess.execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

const assertionTask = {
  id: 'assertion-price-demand',
  family: 'assertion_reason',
  skillLabel: 'Stelling en reden beoordelen',
  purpose: 'Beoordeel of de reden de stelling economisch ondersteunt.',
  prompt: 'Kies de juiste relatie tussen stelling en reden.',
  interaction: {
    assertionLabel: 'Stelling',
    assertionText: 'Als de prijs stijgt, daalt de gevraagde hoeveelheid.',
    reasonLabel: 'Reden',
    reasonText: 'Bij een hogere prijs kopen consumenten meestal minder.',
    optionLabel: 'Kies de juiste relatie',
    options: [
      {
        id: 'both-correct-explains',
        label: 'Stelling en reden zijn juist, en de reden ondersteunt de stelling.',
        description: 'De reden legt uit waarom de gevraagde hoeveelheid daalt.'
      },
      {
        id: 'both-correct-no-explain',
        label: 'Stelling en reden zijn juist, maar de reden ondersteunt de stelling niet.',
        description: 'Gebruik dit alleen wanneer de reden losstaat van de stelling.'
      },
      {
        id: 'assertion-correct-reason-wrong',
        label: 'De stelling is juist, maar de reden is onjuist.',
        description: 'De richting klopt, maar de uitleg niet.'
      },
      {
        id: 'assertion-wrong-reason-correct',
        label: 'De stelling is onjuist, maar de reden is juist.',
        description: 'De uitleg kan kloppen, terwijl de stelling niet klopt.'
      },
      {
        id: 'both-wrong',
        label: 'Stelling en reden zijn allebei onjuist.',
        description: 'Kies dit als beide onderdelen niet kloppen.'
      }
    ]
  },
  expected: {
    kind: 'assertion_reason',
    value: 'both-correct-explains',
    partialFeedback: 'practice_only'
  },
  feedback: {
    matchTitle: 'Relatie klopt',
    matchText: 'Je beoordeelt stelling en reden samen.',
    retryTitle: 'Controleer de relatie',
    retryText: 'Kijk of de gekozen relatie de stelling en reden goed verbindt.'
  },
  practiceRoute: {
    label: 'Oefen verder met redeneren',
    href: 'redeneer-spel.html'
  }
};

assert(TaskShellEngine.FAMILIES.assertion_reason, 'TaskShellEngine must declare assertion_reason');
assert(TaskShellEngine.FAMILIES.assertion_reason.deterministic === true, 'assertion_reason must be deterministic');
assert(TaskShellEngine.validateTask(assertionTask) === true, 'assertion fixture must validate');
assert(TaskShellEngine.findStudentTextViolations(assertionTask).length === 0, 'assertion fixture must not expose internal codes or restricted claims');

assert(TaskShellEngine.evaluateTask(assertionTask, {
  value: 'both-correct-explains'
}).matched === true, 'assertion_reason must match the exact relation option id');

for (const [response, message] of [
  [{ value: 'both-correct-no-explain' }, 'wrong relation option must fail'],
  [{}, 'missing value must fail'],
  [{ value: '' }, 'empty value must fail'],
  [{ value: 'both-correct-explains', extra: 'ignored' }, 'extra response keys must fail'],
  ['both-correct-explains', 'raw strings must fail'],
  [['both-correct-explains'], 'raw arrays must fail'],
  [{ value: ['both-correct-explains'] }, 'array-with-value responses must fail'],
  [{ value: { id: 'both-correct-explains' } }, 'nested value objects must fail'],
  [{ value: 42 }, 'non-string values must fail'],
  [{ answer: 'both-correct-explains' }, 'answer-key response must fail'],
  [{ value: 'unknown-option' }, 'unknown option ids must fail']
]) {
  assert(TaskShellEngine.evaluateTask(assertionTask, response).matched === false, message);
}

const retry = TaskShellEngine.evaluateTask(assertionTask, {
  value: 'both-correct-no-explain'
});
assert(retry.assertionReasonFeedback.mode === 'practice_only', 'assertion feedback must be practice_only');
assert(retry.assertionReasonFeedback.selected.id === 'both-correct-no-explain', 'assertion feedback must report selected relation');
assert(retry.assertionReasonFeedback.expected.id === 'both-correct-explains', 'assertion feedback must report expected relation');
assert(retry.assertionReasonFeedback.relationMatches === false, 'assertion feedback must report relation mismatch');

for (const field of ['assertionLabel', 'assertionText', 'reasonLabel', 'reasonText', 'optionLabel']) {
  const missing = clone(assertionTask);
  delete missing.interaction[field];
  assertThrows(() => TaskShellEngine.validateTask(missing), `${field} must be required`);
}

const duplicateOption = clone(assertionTask);
duplicateOption.interaction.options[1].id = duplicateOption.interaction.options[0].id;
assertThrows(() => TaskShellEngine.validateTask(duplicateOption), 'duplicate assertion option ids must be rejected');

const missingDescription = clone(assertionTask);
delete missingDescription.interaction.options[0].description;
assertThrows(() => TaskShellEngine.validateTask(missingDescription), 'assertion option descriptions must be required');

const tooFewOptions = clone(assertionTask);
tooFewOptions.interaction.options = tooFewOptions.interaction.options.slice(0, 3);
assertThrows(() => TaskShellEngine.validateTask(tooFewOptions), 'assertion options must require at least four options');

const wrongExpectedKind = clone(assertionTask);
wrongExpectedKind.expected.kind = 'choice';
assertThrows(() => TaskShellEngine.validateTask(wrongExpectedKind), 'assertion expected.kind must be assertion_reason');

const unknownExpectedValue = clone(assertionTask);
unknownExpectedValue.expected.value = 'unknown-option';
assertThrows(() => TaskShellEngine.validateTask(unknownExpectedValue), 'assertion expected value must come from option bank');

const badFeedback = clone(assertionTask);
badFeedback.expected.partialFeedback = 'diagnostic';
assertThrows(() => TaskShellEngine.validateTask(badFeedback), 'assertion partial feedback must be practice_only');

for (const fragment of [
  '[data-task-id="assertion-price-demand"][data-assertion-option-id]',
  '[data-task-id="assertion-price-demand"][data-assertion-summary]'
]) {
  assert(TaskShellEngine.focusPlan(assertionTask).includes(fragment), `assertion focus plan missing ${fragment}`);
}

const rendered = TaskShellUI.renderTask(assertionTask, 0);
for (const fragment of [
  'data-task-family="assertion_reason"',
  'class="ts-assertion"',
  'class="ts-assertion-card"',
  'data-assertion-option-id="both-correct-explains"',
  'data-assertion-summary',
  'role="group" aria-label="Kies de juiste relatie"',
  'Als de prijs stijgt, daalt de gevraagde hoeveelheid.',
  'Bij een hogere prijs kopen consumenten meestal minder.'
]) {
  assert(rendered.includes(fragment), `rendered assertion fixture missing ${fragment}`);
}

const feedbackHtml = TaskShellUI.renderFeedback(retry);
for (const fragment of [
  'class="ts-assertion-feedback"',
  'Gekozen relatie',
  'Verwachte relatie',
  'kijk dit na',
  'Controleer of de gekozen relatie klopt bij stelling en reden.'
]) {
  assert(feedbackHtml.includes(fragment), `assertion feedback HTML missing ${fragment}`);
}

assert(typeof TaskShellUI.collectAssertionReasonResponse === 'function', 'TaskShellUI must export collectAssertionReasonResponse');
assert(typeof TaskShellUI.handleAssertionReasonClick === 'function', 'TaskShellUI must export handleAssertionReasonClick');

const engineSource = read('engines/task-shell-engine.js');
const uiSource = read('engines/task-shell-ui.js');
const cssSource = read('engines/task-shell.css');
const exitTicketSource = read('engines/exit-ticket-ui.js');
const skilltreeSource = read('engines/skilltree-ui.js');
const graphSource = read('engines/graphical-ui.js');

for (const [label, source, fragments] of [
  ['engine', engineSource, ['assertion_reason', 'validateAssertionReasonInteraction', 'validateAssertionReasonOptions', 'assertionReasonMatches', 'assertionReasonFeedback']],
  ['ui', uiSource, ['renderAssertionReason', 'collectAssertionReasonResponse', 'handleAssertionReasonClick', 'updateAssertionSummary']],
  ['css', cssSource, ['.ts-assertion', '.ts-assertion-panel', '.ts-assertion-option', '.ts-assertion-feedback']],
  ['exit-ticket', exitTicketSource, ['handleAssertionReasonClick(app, event)', 'collectAssertionReasonResponse(wrapper, task)', "task.family === 'assertion_reason'"]],
  ['skilltree', skilltreeSource, ['handleAssertionReasonClick(els.exStepSlot, e)', 'collectAssertionReasonResponse(root, task)', "task.family === 'assertion_reason'", "e.target.closest('.ts-assertion')"]],
  ['graphical', graphSource, ['handleAssertionReasonClick(rootEl, event)', 'collectAssertionReasonResponse(rootEl, task)', 'task.family === "assertion_reason"', '.ts-assertion']]
]) {
  for (const fragment of fragments) {
    assert(source.includes(fragment), `${label} source missing ${fragment}`);
  }
}

const proof = readJson('reports/json/task-family-assertion1-proof.json');
assert(proof.sprint_id === 'TASK-FAMILY-ASSERTION-1', 'proof JSON has wrong sprint_id');
assert(proof.family === 'assertion_reason', 'proof JSON must name assertion_reason');
assert(proof.runtime_support.first_class_family === true, 'proof JSON must cover first-class family');
assert(proof.runtime_support.statement_and_reason_text_required === true, 'proof JSON must require statement/reason text');
assert(proof.runtime_support.minimum_four_relation_options === true, 'proof JSON must cover minimum relation options');
assert(proof.runtime_support.practice_only_feedback === true, 'proof JSON must cover practice-only feedback');
assert(proof.strict_response_shape.expected_shape === '{ value: optionId }', 'proof JSON must record expected response shape');
assert(proof.strict_response_shape.raw_strings_rejected === true, 'proof JSON must cover raw string rejection');
assert(proof.strict_response_shape.raw_arrays_rejected === true, 'proof JSON must cover raw array rejection');
assert(proof.strict_response_shape.array_with_value_rejected === true, 'proof JSON must cover array-with-value rejection');
assert(proof.strict_response_shape.nested_object_values_rejected === true, 'proof JSON must cover nested value rejection');
assert(proof.boundary_flags.generated_lesson_output_changed === false, 'proof JSON must block generated output changes');
assert(proof.boundary_flags.target_equivalent_reliance === false, 'proof JSON must block target-equivalent reliance');
assert(proof.boundary_flags.old_exit_ticket_archive_changed === false, 'proof JSON must record old archive no-change');
assert(proof.learning_quality.sparse_reviewed_relation_judgement === true, 'proof JSON must preserve sparse reviewed use');
assert(proof.learning_quality.not_generic_quiz_variety === true, 'proof JSON must block generic quiz variety');
assert(proof.learning_quality.not_constructed_reasoning_replacement === true, 'proof JSON must block constructed-reasoning substitution');
assert(proof.wrapper_collection.exit_ticket === true, 'proof JSON must cover exit-ticket wrapper');
assert(proof.wrapper_collection.skilltree === true, 'proof JSON must cover skilltree wrapper');
assert(proof.wrapper_collection.graphical === true, 'proof JSON must cover graphical wrapper');

const fixtureHtml = read('reports/sprints/TASK-FAMILY-ASSERTION-1-rendered-fixture.html');
for (const fragment of [
  'data-task-family="assertion_reason"',
  'class="ts-assertion"',
  'class="ts-assertion-card"',
  'data-assertion-option-id="both-correct-explains"',
  'data-assertion-summary',
  'class="ts-assertion-feedback"',
  'data-fixture-viewport="narrow"',
  'data-fixture-theme="dark"',
  'data-fixture-state="after-click"',
  'aria-label="Aanwijzingen bij stelling en reden"'
]) {
  assert(fixtureHtml.includes(fragment), `rendered fixture artifact missing ${fragment}`);
}

const manifest = read('reports/sprints/TASK-FAMILY-ASSERTION-1-screenshot-manifest.md');
assert(/standard/i.test(manifest) && /narrow/i.test(manifest) && /dark/i.test(manifest), 'screenshot manifest must describe standard/narrow/dark fixture proof');
assert(/after-click/i.test(manifest), 'screenshot manifest must describe after-click interaction proof');
assert(/keyboard/i.test(manifest) && /screen-reader/i.test(manifest), 'screenshot manifest must describe keyboard/screen-reader proof');
assert(/no generated lesson output/i.test(manifest), 'screenshot manifest must preserve generated-output boundary');

for (const protectedPath of [
  'references/machine',
  'references/external',
  'source-data/book-1/exit-ticket',
  'source-data/book-1/reasoning'
]) {
  assert(gitOutput(['diff', '--name-only', '--', protectedPath]) === '', `${protectedPath} must have no unstaged diff`);
  assert(gitOutput(['diff', '--cached', '--name-only', '--', protectedPath]) === '', `${protectedPath} must have no staged diff`);
}

assert(fs.existsSync(path.join(ROOT, 'knowledge', 'exit-ticket-game-1.1.1.zip')), 'old exit-ticket archive must remain tracked in the workspace');
gitOutput(['ls-files', '--error-unmatch', 'knowledge/exit-ticket-game-1.1.1.zip']);
assert(gitOutput(['diff', '--name-only', '--', 'knowledge/exit-ticket-game-1.1.1.zip']) === '', 'old exit-ticket archive must have no unstaged diff');
assert(gitOutput(['diff', '--cached', '--name-only', '--', 'knowledge/exit-ticket-game-1.1.1.zip']) === '', 'old exit-ticket archive must have no staged diff');

console.log('TASK-FAMILY-ASSERTION-1 check OK');
