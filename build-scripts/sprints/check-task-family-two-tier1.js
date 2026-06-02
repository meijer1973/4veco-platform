#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine'));
const TaskShellUI = require(path.join(ROOT, 'engines', 'task-shell-ui'));

function fail(message) {
  console.error(`TASK-FAMILY-TWO-TIER-1 check failed: ${message}`);
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

const twoTierTask = {
  id: 'two-tier-indexpunten',
  family: 'two_tier_choice',
  skillLabel: 'Antwoord en reden koppelen',
  purpose: 'Kies een uitspraak en de reden die die uitspraak ondersteunt.',
  prompt: 'Welke uitspraak over indexpunten klopt, en waarom?',
  interaction: {
    answerLabel: 'Kies het antwoord',
    reasonLabel: 'Kies de reden',
    answerOptions: [
      {
        id: 'vier-indexpunten',
        label: 'De stijging is 4 indexpunten.',
        description: 'Dit benoemt het verschil tussen 112 en 108.'
      },
      {
        id: 'vier-procent',
        label: 'De stijging is 4 procent.',
        description: 'Dit verwart punten met procentuele verandering.'
      }
    ],
    reasonOptions: [
      {
        id: 'verschil-in-punten',
        label: 'Je trekt 112 en 108 van elkaar af.',
        description: 'Het verschil is 4 punten.'
      },
      {
        id: 'delen-door-honderd',
        label: 'Je deelt altijd door 100.',
        description: 'Dit is geen goede reden voor deze puntenstap.'
      }
    ]
  },
  expected: {
    kind: 'two_tier_choice',
    answer: 'vier-indexpunten',
    reason: 'verschil-in-punten',
    partialFeedback: 'practice_only'
  },
  feedback: {
    matchTitle: 'Antwoord en reden kloppen',
    matchText: 'Je koppelt uitspraak en reden correct.',
    retryTitle: 'Controleer de koppeling',
    retryText: 'Kijk of je reden je gekozen antwoord ondersteunt.'
  },
  practiceRoute: {
    label: 'Oefen verder met indexpunten',
    href: 'wiskundevaardigheden.html'
  }
};

assert(TaskShellEngine.FAMILIES.two_tier_choice, 'TaskShellEngine must declare two_tier_choice');
assert(TaskShellEngine.FAMILIES.two_tier_choice.deterministic === true, 'two_tier_choice must be deterministic');
assert(TaskShellEngine.validateTask(twoTierTask) === true, 'two-tier fixture must validate');
assert(TaskShellEngine.findStudentTextViolations(twoTierTask).length === 0, 'two-tier fixture must not expose internal codes or restricted claims');

assert(TaskShellEngine.evaluateTask(twoTierTask, {
  answer: 'vier-indexpunten',
  reason: 'verschil-in-punten'
}).matched === true, 'two_tier_choice must match exact answer plus reason');

for (const [response, message] of [
  [{ answer: 'vier-procent', reason: 'verschil-in-punten' }, 'wrong answer with correct reason must fail'],
  [{ answer: 'vier-indexpunten', reason: 'delen-door-honderd' }, 'correct answer with wrong reason must fail'],
  [{ answer: 'vier-procent', reason: 'delen-door-honderd' }, 'wrong answer and wrong reason must fail'],
  [{ answer: 'vier-indexpunten' }, 'answer-only response must fail'],
  [{ reason: 'verschil-in-punten' }, 'reason-only response must fail'],
  [{ answer: 'vier-indexpunten', reason: 'verschil-in-punten', extra: 'ignored' }, 'extra response keys must fail'],
  ['vier-indexpunten', 'raw strings must fail'],
  [['vier-indexpunten', 'verschil-in-punten'], 'raw arrays must fail'],
  [{ answer: { value: 'vier-indexpunten' }, reason: 'verschil-in-punten' }, 'nested answer values must fail'],
  [{ answer: 'vier-indexpunten', reason: { value: 'verschil-in-punten' } }, 'nested reason values must fail'],
  [{ answer: 42, reason: 'verschil-in-punten' }, 'non-string answer ids must fail'],
  [{ answer: 'vier-indexpunten', reason: 42 }, 'non-string reason ids must fail'],
  [{ answer: 'onbekend', reason: 'verschil-in-punten' }, 'unknown answer ids must fail'],
  [{ answer: 'vier-indexpunten', reason: 'onbekend' }, 'unknown reason ids must fail'],
  [{ answer: 'verschil-in-punten', reason: 'vier-indexpunten' }, 'cross-tier response ids must fail']
]) {
  assert(TaskShellEngine.evaluateTask(twoTierTask, response).matched === false, message);
}

const retry = TaskShellEngine.evaluateTask(twoTierTask, {
  answer: 'vier-procent',
  reason: 'verschil-in-punten'
});
assert(retry.twoTierFeedback.mode === 'practice_only', 'two-tier feedback must be practice_only');
assert(retry.twoTierFeedback.answerMatches === false, 'two-tier feedback must report answer mismatch');
assert(retry.twoTierFeedback.reasonMatches === true, 'two-tier feedback must report reason match');
assert(retry.twoTierFeedback.combinationMatches === false, 'two-tier feedback must report combination mismatch');

const duplicateAnswer = clone(twoTierTask);
duplicateAnswer.interaction.answerOptions[1].id = duplicateAnswer.interaction.answerOptions[0].id;
assertThrows(() => TaskShellEngine.validateTask(duplicateAnswer), 'duplicate answer option ids must be rejected');

const duplicateReason = clone(twoTierTask);
duplicateReason.interaction.reasonOptions[1].id = duplicateReason.interaction.reasonOptions[0].id;
assertThrows(() => TaskShellEngine.validateTask(duplicateReason), 'duplicate reason option ids must be rejected');

const crossTierDuplicate = clone(twoTierTask);
crossTierDuplicate.interaction.reasonOptions[0].id = crossTierDuplicate.interaction.answerOptions[0].id;
assertThrows(() => TaskShellEngine.validateTask(crossTierDuplicate), 'cross-tier duplicate ids must be rejected');

const missingAnswerDescription = clone(twoTierTask);
delete missingAnswerDescription.interaction.answerOptions[0].description;
assertThrows(() => TaskShellEngine.validateTask(missingAnswerDescription), 'answer option descriptions must be required');

const missingReasonDescription = clone(twoTierTask);
delete missingReasonDescription.interaction.reasonOptions[0].description;
assertThrows(() => TaskShellEngine.validateTask(missingReasonDescription), 'reason option descriptions must be required');

const oneAnswer = clone(twoTierTask);
oneAnswer.interaction.answerOptions = [oneAnswer.interaction.answerOptions[0]];
assertThrows(() => TaskShellEngine.validateTask(oneAnswer), 'answerOptions must require at least two options');

const oneReason = clone(twoTierTask);
oneReason.interaction.reasonOptions = [oneReason.interaction.reasonOptions[0]];
assertThrows(() => TaskShellEngine.validateTask(oneReason), 'reasonOptions must require at least two options');

const expectedFromReasonTier = clone(twoTierTask);
expectedFromReasonTier.expected.answer = 'verschil-in-punten';
assertThrows(() => TaskShellEngine.validateTask(expectedFromReasonTier), 'expected answer must come from answerOptions');

const expectedFromAnswerTier = clone(twoTierTask);
expectedFromAnswerTier.expected.reason = 'vier-indexpunten';
assertThrows(() => TaskShellEngine.validateTask(expectedFromAnswerTier), 'expected reason must come from reasonOptions');

const badFeedback = clone(twoTierTask);
badFeedback.expected.partialFeedback = 'diagnostic';
assertThrows(() => TaskShellEngine.validateTask(badFeedback), 'two-tier partial feedback must be practice_only');

for (const fragment of [
  '[data-task-id="two-tier-indexpunten"][data-two-tier-answer-id]',
  '[data-task-id="two-tier-indexpunten"][data-two-tier-reason-id]',
  '[data-task-id="two-tier-indexpunten"][data-two-tier-summary]'
]) {
  assert(TaskShellEngine.focusPlan(twoTierTask).includes(fragment), `two-tier focus plan missing ${fragment}`);
}

const rendered = TaskShellUI.renderTask(twoTierTask, 0);
for (const fragment of [
  'data-task-family="two_tier_choice"',
  'class="ts-two-tier-choice"',
  'data-two-tier-answer-id="vier-indexpunten"',
  'data-two-tier-reason-id="verschil-in-punten"',
  'data-two-tier-summary',
  'role="group" aria-label="Kies het antwoord"',
  'role="group" aria-label="Kies de reden"'
]) {
  assert(rendered.includes(fragment), `rendered two-tier fixture missing ${fragment}`);
}

const feedbackHtml = TaskShellUI.renderFeedback(retry);
for (const fragment of [
  'class="ts-two-tier-feedback"',
  'Antwoord',
  'kijk dit na',
  'Reden',
  'past',
  'Controleer of je reden het gekozen antwoord echt ondersteunt.'
]) {
  assert(feedbackHtml.includes(fragment), `two-tier feedback HTML missing ${fragment}`);
}

assert(typeof TaskShellUI.collectTwoTierChoiceResponse === 'function', 'TaskShellUI must export collectTwoTierChoiceResponse');
assert(typeof TaskShellUI.handleTwoTierChoiceClick === 'function', 'TaskShellUI must export handleTwoTierChoiceClick');

const engineSource = read('engines/task-shell-engine.js');
const uiSource = read('engines/task-shell-ui.js');
const cssSource = read('engines/task-shell.css');
const exitTicketSource = read('engines/exit-ticket-ui.js');
const skilltreeSource = read('engines/skilltree-ui.js');
const graphSource = read('engines/graphical-ui.js');

for (const [label, source, fragments] of [
  ['engine', engineSource, ['two_tier_choice', 'validateTwoTierInteraction', 'twoTierChoiceMatches', 'twoTierChoiceFeedback', 'validateTwoTierOptionBank']],
  ['ui', uiSource, ['renderTwoTierChoice', 'collectTwoTierChoiceResponse', 'handleTwoTierChoiceClick', 'updateTwoTierSummary']],
  ['css', cssSource, ['.ts-two-tier-choice', '.ts-two-tier-grid', '.ts-two-tier-option', '.ts-two-tier-feedback']],
  ['exit-ticket', exitTicketSource, ['handleTwoTierChoiceClick(app, event)', 'collectTwoTierChoiceResponse(wrapper, task)', "task.family === 'two_tier_choice'"]],
  ['skilltree', skilltreeSource, ['handleTwoTierChoiceClick(els.exStepSlot, e)', 'collectTwoTierChoiceResponse(root, task)', "task.family === 'two_tier_choice'", "e.target.closest('.ts-two-tier-choice')"]],
  ['graphical', graphSource, ['handleTwoTierChoiceClick(rootEl, event)', 'collectTwoTierChoiceResponse(rootEl, task)', 'task.family === "two_tier_choice"', '.ts-two-tier-choice']]
]) {
  for (const fragment of fragments) {
    assert(source.includes(fragment), `${label} source missing ${fragment}`);
  }
}

const proof = readJson('reports/json/task-family-two-tier1-proof.json');
assert(proof.sprint_id === 'TASK-FAMILY-TWO-TIER-1', 'proof JSON has wrong sprint_id');
assert(proof.family === 'two_tier_choice', 'proof JSON must name two_tier_choice');
assert(proof.runtime_support.answer_tier_required === true, 'proof JSON must cover answer tier');
assert(proof.runtime_support.reason_tier_required === true, 'proof JSON must cover reason tier');
assert(proof.runtime_support.exact_answer_reason_combination === true, 'proof JSON must cover exact answer-reason matching');
assert(proof.runtime_support.cross_tier_duplicate_ids_rejected === true, 'proof JSON must cover cross-tier id rejection');
assert(proof.runtime_support.practice_only_feedback === true, 'proof JSON must cover practice-only feedback');
assert(proof.strict_response_shape.answer_only_rejected === true, 'proof JSON must cover answer-only rejection');
assert(proof.strict_response_shape.reason_only_rejected === true, 'proof JSON must cover reason-only rejection');
assert(proof.strict_response_shape.raw_arrays_rejected === true, 'proof JSON must cover raw array rejection');
assert(proof.strict_response_shape.nested_object_values_rejected === true, 'proof JSON must cover nested value rejection');
assert(proof.boundary_flags.generated_lesson_output_changed === false, 'proof JSON must block generated output changes');
assert(proof.boundary_flags.target_equivalent_reliance === false, 'proof JSON must block target-equivalent reliance');
assert(proof.boundary_flags.old_exit_ticket_archive_changed === false, 'proof JSON must record old archive no-change');
assert(proof.wrapper_collection.exit_ticket === true, 'proof JSON must cover exit-ticket wrapper');
assert(proof.wrapper_collection.skilltree === true, 'proof JSON must cover skilltree wrapper');
assert(proof.wrapper_collection.graphical === true, 'proof JSON must cover graphical wrapper');

const fixtureHtml = read('reports/sprints/TASK-FAMILY-TWO-TIER-1-rendered-fixture.html');
for (const fragment of [
  'data-task-family="two_tier_choice"',
  'class="ts-two-tier-choice"',
  'data-two-tier-answer-id="vier-indexpunten"',
  'data-two-tier-reason-id="verschil-in-punten"',
  'data-two-tier-summary',
  'class="ts-two-tier-feedback"',
  'data-fixture-viewport="narrow"',
  'data-fixture-theme="dark"',
  'data-fixture-state="after-click"',
  'aria-label="Aanwijzingen bij antwoord en reden"'
]) {
  assert(fixtureHtml.includes(fragment), `rendered fixture artifact missing ${fragment}`);
}

const manifest = read('reports/sprints/TASK-FAMILY-TWO-TIER-1-screenshot-manifest.md');
assert(/standard/i.test(manifest) && /narrow/i.test(manifest) && /dark/i.test(manifest), 'screenshot manifest must describe standard/narrow/dark fixture proof');
assert(/after-click/i.test(manifest), 'screenshot manifest must describe after-click interaction proof');
assert(/keyboard/i.test(manifest) && /screen-reader/i.test(manifest), 'screenshot manifest must describe keyboard/screen-reader proof');
assert(/no generated lesson output/i.test(manifest), 'screenshot manifest must preserve generated-output boundary');

assert(fs.existsSync(path.join(ROOT, 'knowledge', 'exit-ticket-game-1.1.1.zip')), 'old exit-ticket archive must remain tracked in the workspace');
gitOutput(['ls-files', '--error-unmatch', 'knowledge/exit-ticket-game-1.1.1.zip']);
assert(gitOutput(['diff', '--name-only', '--', 'knowledge/exit-ticket-game-1.1.1.zip']) === '', 'old exit-ticket archive must have no unstaged diff');
assert(gitOutput(['diff', '--cached', '--name-only', '--', 'knowledge/exit-ticket-game-1.1.1.zip']) === '', 'old exit-ticket archive must have no staged diff');

console.log('TASK-FAMILY-TWO-TIER-1 check OK');
