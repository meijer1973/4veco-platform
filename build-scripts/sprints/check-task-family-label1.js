#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine'));
const TaskShellUI = require(path.join(ROOT, 'engines', 'task-shell-ui'));

function fail(message) {
  console.error(`TASK-FAMILY-LABEL-1 check failed: ${message}`);
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

const labelPlacementTask = {
  id: 'label-placement-axis',
  family: 'label_placement',
  skillLabel: 'Grafieklabels plaatsen',
  purpose: 'Plaats labels bij de juiste onderdelen van een grafiek.',
  prompt: 'Welke labels horen bij de assen van deze grafiek?',
  interaction: {
    labelBankLabel: 'Labelbank',
    targetRegionLabel: 'Grafiekvlak',
    placementLabel: 'Geplaatste labels',
    visual: {
      kind: 'coordinate_plane',
      title: 'Leeg assenstelsel',
      description: 'Plaats de grootheden op het juiste onderdeel van het grafiekvlak.',
      showLine: false,
      showGrid: false
    },
    labels: [
      {
        id: 'prijs',
        label: 'Prijs',
        description: 'Grootheid uit een prijs-hoeveelheidgrafiek.',
        kind: 'answer'
      },
      {
        id: 'hoeveelheid',
        label: 'Hoeveelheid',
        description: 'Grootheid uit een prijs-hoeveelheidgrafiek.',
        kind: 'answer'
      },
      {
        id: 'omzet',
        label: 'Omzet',
        description: 'Berekende uitkomst, geen asgrootheid in dit assenstelsel.',
        kind: 'distractor',
        distractorFor: 'prijs'
      }
    ],
    targets: [
      {
        id: 'y-as',
        label: 'As links',
        description: 'De verticale as van het grafiekvlak.',
        kind: 'answer',
        targetRole: 'axis',
        x: 18,
        y: 48
      },
      {
        id: 'x-as',
        label: 'As onder',
        description: 'De horizontale as van het grafiekvlak.',
        kind: 'answer',
        targetRole: 'axis',
        x: 64,
        y: 82
      },
      {
        id: 'caption',
        label: 'Los vak',
        description: 'Een los tekstvak buiten de assen.',
        kind: 'distractor',
        targetRole: 'structure_part',
        distractorFor: 'y-as',
        x: 78,
        y: 18
      }
    ]
  },
  expected: {
    kind: 'label_placement',
    placements: [
      { labelId: 'prijs', targetId: 'y-as' },
      { labelId: 'hoeveelheid', targetId: 'x-as' }
    ],
    partialFeedback: 'practice_only'
  },
  feedback: {
    matchTitle: 'Labels kloppen',
    matchText: 'Je koppelt prijs en hoeveelheid aan de juiste assen.',
    retryTitle: 'Controleer de assen',
    retryText: 'Prijs staat op de verticale as; hoeveelheid staat op de horizontale as.'
  },
  practiceRoute: {
    label: 'Oefen verder met grafieken',
    href: 'grafiekenspel.html'
  }
};

assert(TaskShellEngine.FAMILIES.label_placement, 'TaskShellEngine must declare label_placement');
assert(TaskShellEngine.FAMILIES.label_placement.deterministic === true, 'label_placement must be deterministic');
assert(TaskShellEngine.validateTask(labelPlacementTask) === true, 'label placement fixture must validate');
assert(TaskShellEngine.findStudentTextViolations(labelPlacementTask).length === 0, 'label placement fixture must not expose internal codes or restricted claims');

assert(TaskShellEngine.evaluateTask(labelPlacementTask, {
  placements: [
    { labelId: 'hoeveelheid', targetId: 'x-as' },
    { labelId: 'prijs', targetId: 'y-as' }
  ]
}).matched === true, 'label_placement must match exact placement set order-insensitively');
assert(TaskShellEngine.evaluateTask(labelPlacementTask, {
  placements: [
    { labelId: 'prijs', targetId: 'y-as' }
  ]
}).matched === false, 'label_placement must fail omitted labels');
assert(TaskShellEngine.evaluateTask(labelPlacementTask, {
  placements: [
    { labelId: 'prijs', targetId: 'x-as' },
    { labelId: 'hoeveelheid', targetId: 'y-as' }
  ]
}).matched === false, 'label_placement must fail swapped targets');
assert(TaskShellEngine.evaluateTask(labelPlacementTask, {
  placements: [
    { labelId: 'prijs', targetId: 'y-as' },
    { labelId: 'hoeveelheid', targetId: 'x-as' },
    { labelId: 'omzet', targetId: 'caption' }
  ]
}).matched === false, 'label_placement must fail selected distractor labels and targets');
assert(TaskShellEngine.evaluateTask(labelPlacementTask, {
  placements: [
    { labelId: 'prijs', targetId: 'y-as' },
    { labelId: 'prijs', targetId: 'x-as' }
  ]
}).matched === false, 'label_placement must fail duplicate labels');
assert(TaskShellEngine.evaluateTask(labelPlacementTask, {
  placements: [
    { labelId: 'prijs', targetId: 'y-as' },
    { labelId: 'hoeveelheid', targetId: 'y-as' }
  ]
}).matched === false, 'label_placement must fail duplicate targets');
assert(TaskShellEngine.evaluateTask(labelPlacementTask, {
  placements: [
    { labelId: 'prijs', targetId: 'y-as' },
    { labelId: 'onbekend', targetId: 'x-as' }
  ]
}).matched === false, 'label_placement must fail unknown label ids');
assert(TaskShellEngine.evaluateTask(labelPlacementTask, {
  placements: [
    { labelId: 'prijs', targetId: 'y-as' },
    { labelId: 'hoeveelheid', targetId: 'onbekend' }
  ]
}).matched === false, 'label_placement must fail unknown target ids');
assert(TaskShellEngine.evaluateTask(labelPlacementTask, {
  placements: [
    { labelId: 'prijs', targetId: 'y-as', extra: 'ignored' },
    { labelId: 'hoeveelheid', targetId: 'x-as' }
  ]
}).matched === false, 'label_placement must fail extra keys inside placements');
assert(TaskShellEngine.evaluateTask(labelPlacementTask, {
  placements: [
    { labelId: 'prijs', targetId: 'y-as' },
    { labelId: 'hoeveelheid', targetId: 'x-as' }
  ],
  extra: 'ignored'
}).matched === false, 'label_placement must fail extra response keys');
assert(TaskShellEngine.evaluateTask(labelPlacementTask, [
  { labelId: 'prijs', targetId: 'y-as' },
  { labelId: 'hoeveelheid', targetId: 'x-as' }
]).matched === false, 'label_placement must fail raw arrays');
const arrayWithPlacements = [];
arrayWithPlacements.placements = [
  { labelId: 'prijs', targetId: 'y-as' },
  { labelId: 'hoeveelheid', targetId: 'x-as' }
];
assert(TaskShellEngine.evaluateTask(labelPlacementTask, arrayWithPlacements).matched === false, 'label_placement must fail arrays with a placements property');
assert(TaskShellEngine.evaluateTask(labelPlacementTask, {
  placements: [
    { labelId: 'prijs', targetId: 'y-as' },
    { labelId: 42, targetId: 'x-as' }
  ]
}).matched === false, 'label_placement must fail non-string label ids');
assert(TaskShellEngine.evaluateTask(labelPlacementTask, {
  placements: [
    { labelId: 'prijs', targetId: 'y-as' },
    { labelId: 'hoeveelheid', targetId: 42 }
  ]
}).matched === false, 'label_placement must fail non-string target ids');

const retry = TaskShellEngine.evaluateTask(labelPlacementTask, {
  placements: [
    { labelId: 'prijs', targetId: 'x-as' },
    { labelId: 'omzet', targetId: 'caption' }
  ]
});
assert(retry.labelPlacementFeedback.mode === 'practice_only', 'label placement feedback must be practice_only');
assert(retry.labelPlacementFeedback.missingLabels.length === 1, 'label placement feedback must report missing labels');
assert(retry.labelPlacementFeedback.missingTargets.length === 1, 'label placement feedback must report missing targets');
assert(retry.labelPlacementFeedback.misplacedLabels.length === 1, 'label placement feedback must report misplaced labels');
assert(retry.labelPlacementFeedback.selectedDistractorLabels.length === 1, 'label placement feedback must report selected distractor labels');
assert(retry.labelPlacementFeedback.selectedDistractorTargets.length === 1, 'label placement feedback must report selected distractor targets');

const duplicateLabel = clone(labelPlacementTask);
duplicateLabel.interaction.labels[1].id = 'prijs';
assertThrows(() => TaskShellEngine.validateTask(duplicateLabel), 'duplicate label ids must be rejected');

const missingLabelDescription = clone(labelPlacementTask);
delete missingLabelDescription.interaction.labels[0].description;
assertThrows(() => TaskShellEngine.validateTask(missingLabelDescription), 'label descriptions must be required');

const missingLabelDistractorFor = clone(labelPlacementTask);
delete missingLabelDistractorFor.interaction.labels[2].distractorFor;
assertThrows(() => TaskShellEngine.validateTask(missingLabelDistractorFor), 'label distractors must require distractorFor');

const duplicateTarget = clone(labelPlacementTask);
duplicateTarget.interaction.targets[1].id = 'y-as';
assertThrows(() => TaskShellEngine.validateTask(duplicateTarget), 'duplicate target ids must be rejected');

const missingTargetDescription = clone(labelPlacementTask);
delete missingTargetDescription.interaction.targets[0].description;
assertThrows(() => TaskShellEngine.validateTask(missingTargetDescription), 'target descriptions must be required');

const missingTargetDistractorFor = clone(labelPlacementTask);
delete missingTargetDistractorFor.interaction.targets[2].distractorFor;
assertThrows(() => TaskShellEngine.validateTask(missingTargetDistractorFor), 'target distractors must require distractorFor');

const badRole = clone(labelPlacementTask);
badRole.interaction.targets[2].targetRole = 'caption';
assertThrows(() => TaskShellEngine.validateTask(badRole), 'unknown target roles must be rejected');

const badCoordinate = clone(labelPlacementTask);
badCoordinate.interaction.targets[1].x = 120;
assertThrows(() => TaskShellEngine.validateTask(badCoordinate), 'out-of-range coordinates must be rejected');

const expectedDistractorLabel = clone(labelPlacementTask);
expectedDistractorLabel.expected.placements[1].labelId = 'omzet';
assertThrows(() => TaskShellEngine.validateTask(expectedDistractorLabel), 'expected placements must reject distractor labels');

const expectedDistractorTarget = clone(labelPlacementTask);
expectedDistractorTarget.expected.placements[0].targetId = 'caption';
assertThrows(() => TaskShellEngine.validateTask(expectedDistractorTarget), 'expected placements must reject distractor targets');

const unknownExpectedLabel = clone(labelPlacementTask);
unknownExpectedLabel.expected.placements[1].labelId = 'onbekend';
assertThrows(() => TaskShellEngine.validateTask(unknownExpectedLabel), 'expected placements must reject unknown label ids');

const unknownExpectedTarget = clone(labelPlacementTask);
unknownExpectedTarget.expected.placements[1].targetId = 'onbekend';
assertThrows(() => TaskShellEngine.validateTask(unknownExpectedTarget), 'expected placements must reject unknown target ids');

const omittedAnswerLabel = clone(labelPlacementTask);
omittedAnswerLabel.interaction.labels.push({
  id: 'vraaglijn',
  label: 'Vraaglijn',
  description: 'Extra antwoordlabel.',
  kind: 'answer'
});
assertThrows(() => TaskShellEngine.validateTask(omittedAnswerLabel), 'expected placements must include all answer labels');

const omittedAnswerTarget = clone(labelPlacementTask);
omittedAnswerTarget.interaction.targets.push({
  id: 'snijpunt',
  label: 'Snijpunt',
  description: 'Extra antwoordplek.',
  kind: 'answer',
  targetRole: 'intersection',
  x: 44,
  y: 42
});
assertThrows(() => TaskShellEngine.validateTask(omittedAnswerTarget), 'expected placements must include all answer targets');

const duplicateExpectedLabel = clone(labelPlacementTask);
duplicateExpectedLabel.expected.placements[1].labelId = 'prijs';
assertThrows(() => TaskShellEngine.validateTask(duplicateExpectedLabel), 'expected placements must reject duplicate labels');

const duplicateExpectedTarget = clone(labelPlacementTask);
duplicateExpectedTarget.expected.placements[1].targetId = 'y-as';
assertThrows(() => TaskShellEngine.validateTask(duplicateExpectedTarget), 'expected placements must reject duplicate targets');

const badFeedback = clone(labelPlacementTask);
badFeedback.expected.partialFeedback = 'diagnostic';
assertThrows(() => TaskShellEngine.validateTask(badFeedback), 'label placement partial feedback must be practice_only');

for (const fragment of [
  '[data-task-id="label-placement-axis"][data-label-id]',
  '[data-task-id="label-placement-axis"][data-label-target-id]',
  '[data-task-id="label-placement-axis"][data-label-placement-summary]'
]) {
  assert(TaskShellEngine.focusPlan(labelPlacementTask).includes(fragment), `label placement focus plan missing ${fragment}`);
}

const rendered = TaskShellUI.renderTask(labelPlacementTask, 0);
for (const fragment of [
  'data-task-family="label_placement"',
  'class="ts-label-placement"',
  'class="ts-label-target-region ts-label-target-region-clean"',
  'class="ts-label-visual-axis ts-label-visual-axis-x"',
  'data-label-id="prijs"',
  'data-label-target-id="y-as"',
  'data-label-target-role="axis"',
  'data-label-placement-summary',
  'aria-label="Prijs: Grootheid uit een prijs-hoeveelheidgrafiek."',
  'aria-label="As links: De verticale as van het grafiekvlak."'
]) {
  assert(rendered.includes(fragment), `rendered label-placement fixture missing ${fragment}`);
}
assert(!/prijslabel|hoeveelheidlabel/i.test(rendered), 'rendered label-placement fixture must not give away answers in target text');
assert(!rendered.includes('ts-label-visual-line'), 'empty-axis label-placement fixture must not render a default graph line');
assert(rendered.includes('ts-label-target-region-clean'), 'empty-axis label-placement fixture must suppress the center guide grid');

const feedbackHtml = TaskShellUI.renderFeedback(retry);
for (const fragment of [
  'class="ts-label-feedback"',
  'Label controleren',
  'verwacht As links',
  'Afleidend label gekozen',
  'Afleidende plek gekozen',
  'Omzet',
  'Los vak'
]) {
  assert(feedbackHtml.includes(fragment), `label-placement feedback HTML missing ${fragment}`);
}

assert(typeof TaskShellUI.collectLabelPlacementResponse === 'function', 'TaskShellUI must export collectLabelPlacementResponse');
assert(typeof TaskShellUI.handleLabelPlacementClick === 'function', 'TaskShellUI must export handleLabelPlacementClick');

const engineSource = read('engines/task-shell-engine.js');
const uiSource = read('engines/task-shell-ui.js');
const cssSource = read('engines/task-shell.css');
const exitTicketSource = read('engines/exit-ticket-ui.js');
const skilltreeSource = read('engines/skilltree-ui.js');
const graphSource = read('engines/graphical-ui.js');

for (const [label, source, fragments] of [
  ['engine', engineSource, ['label_placement', 'validateLabelPlacementInteraction', 'labelPlacementMatches', 'labelPlacementFeedback', 'LABEL_TARGET_ROLES']],
  ['ui', uiSource, ['renderLabelPlacement', 'collectLabelPlacementResponse', 'handleLabelPlacementClick', 'updateLabelPlacementState']],
  ['css', cssSource, ['.ts-label-placement', '.ts-label-target-region', '.ts-label-token', '.ts-label-feedback']],
  ['exit-ticket', exitTicketSource, ['handleLabelPlacementClick(app, event)', 'collectLabelPlacementResponse(wrapper, task)', "task.family === 'label_placement'"]],
  ['skilltree', skilltreeSource, ['handleLabelPlacementClick(els.exStepSlot, e)', 'collectLabelPlacementResponse(root, task)', "task.family === 'label_placement'", "e.target.closest('.ts-label-placement')"]],
  ['graphical', graphSource, ['handleLabelPlacementClick(rootEl, event)', 'collectLabelPlacementResponse(rootEl, task)', 'task.family === "label_placement"', '.ts-label-placement']]
]) {
  for (const fragment of fragments) {
    assert(source.includes(fragment), `${label} source missing ${fragment}`);
  }
}

const proof = readJson('reports/json/task-family-label1-proof.json');
assert(proof.sprint_id === 'TASK-FAMILY-LABEL-1', 'proof JSON has wrong sprint_id');
assert(proof.family === 'label_placement', 'proof JSON must name label_placement');
assert(proof.runtime_support.exact_placement_set === true, 'proof JSON must cover exact placement matching');
assert(proof.runtime_support.order_insensitive === true, 'proof JSON must cover order-insensitive placement sets');
assert(proof.runtime_support.full_answer_label_coverage_required === true, 'proof JSON must cover all answer labels');
assert(proof.runtime_support.full_answer_target_coverage_required === true, 'proof JSON must cover all answer targets');
assert(proof.runtime_support.description_required === true, 'proof JSON must cover label/target descriptions');
assert(proof.runtime_support.distractor_for_required === true, 'proof JSON must cover distractorFor requirements');
assert(proof.runtime_support.target_role_enum === true, 'proof JSON must cover target role enum');
assert(proof.runtime_support.coordinate_bounds === true, 'proof JSON must cover coordinate bounds');
assert(proof.planning_flags.array_with_key_rejected === true, 'proof JSON must cover array-with-key rejection');
assert(proof.planning_flags.visual_keyboard_screen_reader_proof === true, 'proof JSON must cover visual/keyboard/screen-reader proof');
assert(proof.boundary_flags.generated_lesson_output_changed === false, 'proof JSON must block generated output changes');
assert(proof.boundary_flags.target_equivalent_reliance === false, 'proof JSON must block target-equivalent reliance');
assert(proof.wrapper_collection.exit_ticket === true, 'proof JSON must cover exit-ticket wrapper');
assert(proof.wrapper_collection.skilltree === true, 'proof JSON must cover skilltree wrapper');
assert(proof.wrapper_collection.graphical === true, 'proof JSON must cover graphical wrapper');

const fixtureHtml = read('reports/sprints/TASK-FAMILY-LABEL-1-rendered-fixture.html');
for (const fragment of [
  'data-task-family="label_placement"',
  'class="ts-label-placement"',
  'class="ts-label-target-region ts-label-target-region-clean"',
  'data-label-id="prijs"',
  'data-label-target-id="y-as"',
  'data-label-placement-summary',
  'data-label-placed-label-id="prijs"',
  'data-label-placed-target-id="y-as"',
  'class="ts-label-feedback"',
  'data-fixture-viewport="narrow"',
  'data-fixture-theme="dark"',
  'data-fixture-state="after-click"',
  'aria-label="Aanwijzingen bij je labels"'
]) {
  assert(fixtureHtml.includes(fragment), `rendered fixture artifact missing ${fragment}`);
}
assert(!fixtureHtml.includes('ts-label-visual-line'), 'rendered fixture artifact must not include a default graph line');
assert(fixtureHtml.includes('ts-label-target-region-clean'), 'rendered fixture artifact must suppress the center guide grid');

const manifest = read('reports/sprints/TASK-FAMILY-LABEL-1-screenshot-manifest.md');
assert(/standard/i.test(manifest) && /narrow/i.test(manifest) && /dark/i.test(manifest), 'screenshot manifest must describe standard/narrow/dark fixture proof');
assert(/after-click/i.test(manifest), 'screenshot manifest must describe after-click interaction proof');
assert(/keyboard/i.test(manifest) && /screen-reader/i.test(manifest), 'screenshot manifest must describe keyboard/screen-reader proof');
assert(/no generated lesson output/i.test(manifest), 'screenshot manifest must preserve generated-output boundary');

console.log('TASK-FAMILY-LABEL-1 check OK');
