#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine'));
const TaskShellUI = require(path.join(ROOT, 'engines', 'task-shell-ui'));

function fail(message) {
  console.error(`TASK-FAMILY-MATCH-1 check failed: ${message}`);
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

const matchingPairsTask = {
  id: 'matching-pairs-concepts',
  family: 'matching_pairs',
  skillLabel: 'Begrippen koppelen',
  purpose: 'Koppel begrippen aan de juiste betekenis.',
  prompt: 'Welke betekenis hoort bij elk begrip?',
  interaction: {
    leftBankLabel: 'Begrippen',
    rightBankLabel: 'Betekenissen',
    pairLabel: 'Gemaakte koppels',
    placeholder: 'Kies een begrip en daarna de passende betekenis.',
    leftItems: [
      {
        id: 'schaarste',
        label: 'Schaarste',
        description: 'Begrip over beperkte middelen.',
        kind: 'answer'
      },
      {
        id: 'alternatieve-kosten',
        label: 'Alternatieve kosten',
        description: 'Begrip over het beste niet-gekozen alternatief.',
        kind: 'answer'
      },
      {
        id: 'onbeperkte-middelen',
        label: 'Onbeperkte middelen',
        description: 'Afleider: dit is het tegenovergestelde van schaarste.',
        kind: 'distractor',
        distractorFor: 'schaarste'
      }
    ],
    rightItems: [
      {
        id: 'behoeften-middelen',
        label: 'Behoeften zijn groter dan middelen',
        description: 'Betekenis van schaarste.',
        kind: 'answer'
      },
      {
        id: 'beste-alternatief',
        label: 'Beste niet-gekozen alternatief',
        description: 'Betekenis van alternatieve kosten.',
        kind: 'answer'
      },
      {
        id: 'geen-keuze-nodig',
        label: 'Er is geen keuze nodig',
        description: 'Afleider: dit past niet bij kiezen onder schaarste.',
        kind: 'distractor',
        distractorFor: 'behoeften-middelen'
      }
    ]
  },
  expected: {
    kind: 'matching_pairs',
    pairs: [
      ['schaarste', 'behoeften-middelen'],
      ['alternatieve-kosten', 'beste-alternatief']
    ],
    partialFeedback: 'practice_only'
  },
  feedback: {
    matchTitle: 'Koppels kloppen',
    matchText: 'Je koppelt begrip en betekenis correct.',
    retryTitle: 'Controleer je koppels',
    retryText: 'Kies voor elk begrip de passende betekenis.'
  },
  practiceRoute: {
    label: 'Oefen verder met begrippen',
    href: 'redeneer-spel.html'
  }
};

assert(TaskShellEngine.FAMILIES.matching_pairs, 'TaskShellEngine must declare matching_pairs');
assert(TaskShellEngine.FAMILIES.matching_pairs.deterministic === true, 'matching_pairs must be deterministic');
assert(TaskShellEngine.validateTask(matchingPairsTask) === true, 'matching-pairs fixture must validate');
assert(TaskShellEngine.findStudentTextViolations(matchingPairsTask).length === 0, 'matching-pairs fixture must not expose internal codes or restricted claims');
assert(
  !matchingPairsTask.interaction.leftItems.some((item) => item.id === 'winst') &&
    !matchingPairsTask.interaction.rightItems.some((item) => item.id === 'opbrengst-kosten'),
  'matching-pairs fixture distractors must not form a correct hidden pair'
);

assert(TaskShellEngine.evaluateTask(matchingPairsTask, {
  pairs: [
    ['alternatieve-kosten', 'beste-alternatief'],
    ['schaarste', 'behoeften-middelen']
  ]
}).matched === true, 'matching_pairs must match exact pair set order-insensitively');
assert(TaskShellEngine.evaluateTask(matchingPairsTask, {
  pairs: [
    ['schaarste', 'behoeften-middelen']
  ]
}).matched === false, 'matching_pairs must fail omitted pairs');
assert(TaskShellEngine.evaluateTask(matchingPairsTask, {
  pairs: [
    ['schaarste', 'beste-alternatief'],
    ['alternatieve-kosten', 'behoeften-middelen']
  ]
}).matched === false, 'matching_pairs must fail swapped right items');
assert(TaskShellEngine.evaluateTask(matchingPairsTask, {
  pairs: [
    ['schaarste', 'behoeften-middelen'],
    ['alternatieve-kosten', 'beste-alternatief'],
    ['onbeperkte-middelen', 'geen-keuze-nodig']
  ]
}).matched === false, 'matching_pairs must fail selected distractors');
assert(TaskShellEngine.evaluateTask(matchingPairsTask, {
  pairs: [
    ['schaarste', 'behoeften-middelen'],
    ['schaarste', 'beste-alternatief']
  ]
}).matched === false, 'matching_pairs must fail duplicate left ids');
assert(TaskShellEngine.evaluateTask(matchingPairsTask, {
  pairs: [
    ['schaarste', 'behoeften-middelen'],
    ['alternatieve-kosten', 'behoeften-middelen']
  ]
}).matched === false, 'matching_pairs must fail duplicate right ids');
assert(TaskShellEngine.evaluateTask(matchingPairsTask, {
  pairs: [
    ['schaarste', 'behoeften-middelen'],
    ['onbekend', 'beste-alternatief']
  ]
}).matched === false, 'matching_pairs must fail unknown left ids');
assert(TaskShellEngine.evaluateTask(matchingPairsTask, {
  pairs: [
    ['schaarste', 'behoeften-middelen'],
    ['alternatieve-kosten', 'onbekend']
  ]
}).matched === false, 'matching_pairs must fail unknown right ids');
assert(TaskShellEngine.evaluateTask(matchingPairsTask, {
  pairs: [
    ['schaarste', 'behoeften-middelen'],
    ['alternatieve-kosten', 'beste-alternatief']
  ],
  extra: 'ignored'
}).matched === false, 'matching_pairs must fail extra response keys');
assert(TaskShellEngine.evaluateTask(matchingPairsTask, [
  ['schaarste', 'behoeften-middelen'],
  ['alternatieve-kosten', 'beste-alternatief']
]).matched === false, 'matching_pairs must fail raw arrays');
const arrayWithPairs = [];
arrayWithPairs.pairs = [
  ['schaarste', 'behoeften-middelen'],
  ['alternatieve-kosten', 'beste-alternatief']
];
assert(TaskShellEngine.evaluateTask(matchingPairsTask, arrayWithPairs).matched === false, 'matching_pairs must fail arrays with a pairs property');
assert(TaskShellEngine.evaluateTask(matchingPairsTask, {
  pairs: [
    { leftId: 'schaarste', rightId: 'behoeften-middelen' },
    ['alternatieve-kosten', 'beste-alternatief']
  ]
}).matched === false, 'matching_pairs must fail object pair entries');
assert(TaskShellEngine.evaluateTask(matchingPairsTask, {
  pairs: [
    ['schaarste', 'behoeften-middelen', 'extra'],
    ['alternatieve-kosten', 'beste-alternatief']
  ]
}).matched === false, 'matching_pairs must fail wrong-length pair arrays');
assert(TaskShellEngine.evaluateTask(matchingPairsTask, {
  pairs: [
    ['schaarste', 'behoeften-middelen'],
    [42, 'beste-alternatief']
  ]
}).matched === false, 'matching_pairs must fail non-string left ids');
assert(TaskShellEngine.evaluateTask(matchingPairsTask, {
  pairs: [
    ['schaarste', 'behoeften-middelen'],
    ['alternatieve-kosten', 42]
  ]
}).matched === false, 'matching_pairs must fail non-string right ids');

const retry = TaskShellEngine.evaluateTask(matchingPairsTask, {
  pairs: [
    ['schaarste', 'beste-alternatief'],
    ['onbeperkte-middelen', 'geen-keuze-nodig']
  ]
});
assert(retry.matchingPairsFeedback.mode === 'practice_only', 'matching-pairs feedback must be practice_only');
assert(retry.matchingPairsFeedback.missingLeftItems.length === 1, 'matching-pairs feedback must report missing left items');
assert(retry.matchingPairsFeedback.missingRightItems.length === 1, 'matching-pairs feedback must report missing right items');
assert(retry.matchingPairsFeedback.misplacedPairs.length === 1, 'matching-pairs feedback must report misplaced pairs');
assert(retry.matchingPairsFeedback.selectedDistractorLeftItems.length === 1, 'matching-pairs feedback must report selected left distractors');
assert(retry.matchingPairsFeedback.selectedDistractorRightItems.length === 1, 'matching-pairs feedback must report selected right distractors');

const duplicateLeft = clone(matchingPairsTask);
duplicateLeft.interaction.leftItems[1].id = 'schaarste';
assertThrows(() => TaskShellEngine.validateTask(duplicateLeft), 'duplicate left item ids must be rejected');

const duplicateRight = clone(matchingPairsTask);
duplicateRight.interaction.rightItems[1].id = 'behoeften-middelen';
assertThrows(() => TaskShellEngine.validateTask(duplicateRight), 'duplicate right item ids must be rejected');

const missingDescription = clone(matchingPairsTask);
delete missingDescription.interaction.leftItems[0].description;
assertThrows(() => TaskShellEngine.validateTask(missingDescription), 'item descriptions must be required');

const missingDistractorFor = clone(matchingPairsTask);
delete missingDistractorFor.interaction.leftItems[2].distractorFor;
assertThrows(() => TaskShellEngine.validateTask(missingDistractorFor), 'distractor items must require distractorFor');

const wrongBankDistractorFor = clone(matchingPairsTask);
wrongBankDistractorFor.interaction.rightItems[2].distractorFor = 'schaarste';
assertThrows(() => TaskShellEngine.validateTask(wrongBankDistractorFor), 'distractorFor must point to same-bank answer items');

const noLeftDistractor = clone(matchingPairsTask);
noLeftDistractor.interaction.leftItems = noLeftDistractor.interaction.leftItems.filter((item) => item.kind !== 'distractor');
assertThrows(() => TaskShellEngine.validateTask(noLeftDistractor), 'left bank must include a distractor');

const unequalAnswers = clone(matchingPairsTask);
unequalAnswers.interaction.rightItems.push({
  id: 'vraag',
  label: 'Gevraagde hoeveelheid',
  description: 'Extra antwoordbetekenis.',
  kind: 'answer'
});
assertThrows(() => TaskShellEngine.validateTask(unequalAnswers), 'one-to-one answer counts must match');

const unknownExpectedLeft = clone(matchingPairsTask);
unknownExpectedLeft.expected.pairs[1][0] = 'onbekend';
assertThrows(() => TaskShellEngine.validateTask(unknownExpectedLeft), 'expected pairs must reject unknown left ids');

const unknownExpectedRight = clone(matchingPairsTask);
unknownExpectedRight.expected.pairs[1][1] = 'onbekend';
assertThrows(() => TaskShellEngine.validateTask(unknownExpectedRight), 'expected pairs must reject unknown right ids');

const expectedDistractorLeft = clone(matchingPairsTask);
expectedDistractorLeft.expected.pairs[1][0] = 'onbeperkte-middelen';
assertThrows(() => TaskShellEngine.validateTask(expectedDistractorLeft), 'expected pairs must reject left distractors');

const expectedDistractorRight = clone(matchingPairsTask);
expectedDistractorRight.expected.pairs[0][1] = 'geen-keuze-nodig';
assertThrows(() => TaskShellEngine.validateTask(expectedDistractorRight), 'expected pairs must reject right distractors');

const omittedAnswerLeft = clone(matchingPairsTask);
omittedAnswerLeft.interaction.leftItems.push({
  id: 'vraag',
  label: 'Vraag',
  description: 'Extra antwoordbegrip.',
  kind: 'answer'
});
omittedAnswerLeft.interaction.rightItems.push({
  id: 'gevraagde-hoeveelheid',
  label: 'Aantal dat consumenten willen kopen',
  description: 'Extra antwoordbetekenis.',
  kind: 'answer'
});
assertThrows(() => TaskShellEngine.validateTask(omittedAnswerLeft), 'expected pairs must include all answer items');

const duplicateExpectedLeft = clone(matchingPairsTask);
duplicateExpectedLeft.expected.pairs[1][0] = 'schaarste';
assertThrows(() => TaskShellEngine.validateTask(duplicateExpectedLeft), 'expected pairs must reject duplicate left ids');

const duplicateExpectedRight = clone(matchingPairsTask);
duplicateExpectedRight.expected.pairs[1][1] = 'behoeften-middelen';
assertThrows(() => TaskShellEngine.validateTask(duplicateExpectedRight), 'expected pairs must reject duplicate right ids');

const wrongLengthExpected = clone(matchingPairsTask);
wrongLengthExpected.expected.pairs[1] = ['alternatieve-kosten'];
assertThrows(() => TaskShellEngine.validateTask(wrongLengthExpected), 'expected pairs must reject wrong-length arrays');

const badFeedback = clone(matchingPairsTask);
badFeedback.expected.partialFeedback = 'diagnostic';
assertThrows(() => TaskShellEngine.validateTask(badFeedback), 'matching-pairs partial feedback must be practice_only');

for (const fragment of [
  '[data-task-id="matching-pairs-concepts"][data-match-left-id]',
  '[data-task-id="matching-pairs-concepts"][data-match-right-id]',
  '[data-task-id="matching-pairs-concepts"][data-match-pair-summary]'
]) {
  assert(TaskShellEngine.focusPlan(matchingPairsTask).includes(fragment), `matching-pairs focus plan missing ${fragment}`);
}

const rendered = TaskShellUI.renderTask(matchingPairsTask, 0);
for (const fragment of [
  'data-task-family="matching_pairs"',
  'class="ts-matching-pairs"',
  'data-match-left-id="schaarste"',
  'data-match-right-id="behoeften-middelen"',
  'data-match-pair-summary',
  'role="group" aria-label="Begrippen"',
  'role="group" aria-label="Betekenissen"',
  'aria-label="Schaarste: Begrip over beperkte middelen."',
  'aria-label="Behoeften zijn groter dan middelen: Betekenis van schaarste."'
]) {
  assert(rendered.includes(fragment), `rendered matching-pairs fixture missing ${fragment}`);
}

const feedbackHtml = TaskShellUI.renderFeedback(retry);
for (const fragment of [
  'class="ts-match-feedback"',
  'Koppel controleren',
  'verwacht Behoeften zijn groter dan middelen',
  'Afleider links gekozen',
  'Afleider rechts gekozen',
  'Onbeperkte middelen',
  'Er is geen keuze nodig'
]) {
  assert(feedbackHtml.includes(fragment), `matching-pairs feedback HTML missing ${fragment}`);
}

assert(typeof TaskShellUI.collectMatchingPairsResponse === 'function', 'TaskShellUI must export collectMatchingPairsResponse');
assert(typeof TaskShellUI.handleMatchingPairsClick === 'function', 'TaskShellUI must export handleMatchingPairsClick');

const engineSource = read('engines/task-shell-engine.js');
const uiSource = read('engines/task-shell-ui.js');
const cssSource = read('engines/task-shell.css');
const exitTicketSource = read('engines/exit-ticket-ui.js');
const skilltreeSource = read('engines/skilltree-ui.js');
const graphSource = read('engines/graphical-ui.js');

for (const [label, source, fragments] of [
  ['engine', engineSource, ['matching_pairs', 'validateMatchingPairsInteraction', 'matchingPairsMatches', 'matchingPairsFeedback', 'validateMatchingItemBank']],
  ['ui', uiSource, ['renderMatchingPairs', 'collectMatchingPairsResponse', 'handleMatchingPairsClick', 'updateMatchingPairsState']],
  ['css', cssSource, ['.ts-matching-pairs', '.ts-match-banks', '.ts-match-left', '.ts-match-feedback']],
  ['exit-ticket', exitTicketSource, ['handleMatchingPairsClick(app, event)', 'collectMatchingPairsResponse(wrapper, task)', "task.family === 'matching_pairs'"]],
  ['skilltree', skilltreeSource, ['handleMatchingPairsClick(els.exStepSlot, e)', 'collectMatchingPairsResponse(root, task)', "task.family === 'matching_pairs'", "e.target.closest('.ts-matching-pairs')"]],
  ['graphical', graphSource, ['handleMatchingPairsClick(rootEl, event)', 'collectMatchingPairsResponse(rootEl, task)', 'task.family === "matching_pairs"', '.ts-matching-pairs']]
]) {
  for (const fragment of fragments) {
    assert(source.includes(fragment), `${label} source missing ${fragment}`);
  }
}

const proof = readJson('reports/json/task-family-match1-proof.json');
assert(proof.sprint_id === 'TASK-FAMILY-MATCH-1', 'proof JSON has wrong sprint_id');
assert(proof.family === 'matching_pairs', 'proof JSON must name matching_pairs');
assert(proof.runtime_support.exact_pair_set === true, 'proof JSON must cover exact pair matching');
assert(proof.runtime_support.order_insensitive === true, 'proof JSON must cover order-insensitive matching');
assert(proof.runtime_support.one_to_one_only === true, 'proof JSON must cover one-to-one only');
assert(proof.runtime_support.full_answer_left_coverage_required === true, 'proof JSON must cover all answer left items');
assert(proof.runtime_support.full_answer_right_coverage_required === true, 'proof JSON must cover all answer right items');
assert(proof.runtime_support.description_required === true, 'proof JSON must cover descriptions');
assert(proof.runtime_support.same_bank_distractor_for_required === true, 'proof JSON must cover same-bank distractorFor');
assert(proof.planning_flags.array_with_key_rejected === true, 'proof JSON must cover array-with-key rejection');
assert(proof.planning_flags.object_pair_entries_rejected === true, 'proof JSON must cover object pair rejection');
assert(proof.planning_flags.wrong_length_pair_arrays_rejected === true, 'proof JSON must cover wrong-length pair rejection');
assert(proof.boundary_flags.generated_lesson_output_changed === false, 'proof JSON must block generated output changes');
assert(proof.boundary_flags.target_equivalent_reliance === false, 'proof JSON must block target-equivalent reliance');
assert(proof.boundary_flags.old_exit_ticket_archive_changed === false, 'proof JSON must record old archive no-change');
assert(proof.wrapper_collection.exit_ticket === true, 'proof JSON must cover exit-ticket wrapper');
assert(proof.wrapper_collection.skilltree === true, 'proof JSON must cover skilltree wrapper');
assert(proof.wrapper_collection.graphical === true, 'proof JSON must cover graphical wrapper');

const fixtureHtml = read('reports/sprints/TASK-FAMILY-MATCH-1-rendered-fixture.html');
for (const fragment of [
  'data-task-family="matching_pairs"',
  'class="ts-matching-pairs"',
  'data-match-left-id="schaarste"',
  'data-match-right-id="behoeften-middelen"',
  'data-match-pair-summary',
  'data-match-paired-left-id="schaarste"',
  'data-match-paired-right-id="behoeften-middelen"',
  'class="ts-match-feedback"',
  'data-fixture-viewport="narrow"',
  'data-fixture-theme="dark"',
  'data-fixture-state="after-click"',
  'aria-label="Aanwijzingen bij je koppels"'
]) {
  assert(fixtureHtml.includes(fragment), `rendered fixture artifact missing ${fragment}`);
}

const manifest = read('reports/sprints/TASK-FAMILY-MATCH-1-screenshot-manifest.md');
assert(/standard/i.test(manifest) && /narrow/i.test(manifest) && /dark/i.test(manifest), 'screenshot manifest must describe standard/narrow/dark fixture proof');
assert(/after-click/i.test(manifest), 'screenshot manifest must describe after-click interaction proof');
assert(/keyboard/i.test(manifest) && /screen-reader/i.test(manifest), 'screenshot manifest must describe keyboard/screen-reader proof');
assert(/no generated lesson output/i.test(manifest), 'screenshot manifest must preserve generated-output boundary');

console.log('TASK-FAMILY-MATCH-1 check OK');
