#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine'));
const TaskShellUI = require(path.join(ROOT, 'engines', 'task-shell-ui'));

function fail(message) {
  console.error(`TASK-FAMILY-SOURCE-1 check failed: ${message}`);
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

const sourceValueTask = {
  id: 'source-values-procent',
  family: 'source_value_selection',
  skillLabel: 'Bronwaarden kiezen',
  purpose: 'Kies de twee bronregels voor hetzelfde product en wijs beginwaarde en eindwaarde toe.',
  prompt: 'Een fietsenwinkel vergelijkt de prijs van e-bike model Stad in 2024 en 2025. Welke bronwaarden gebruik je voor de procentuele prijsverandering?',
  interaction: {
    valueBankLabel: 'Bronwaarden',
    roleLabel: 'Rol',
    values: [
      { id: 'oud', label: 'EUR 800', kind: 'answer', sourceLabel: 'E-bike model Stad', unit: 'euro', period: '2024' },
      { id: 'nieuw', label: 'EUR 920', kind: 'answer', sourceLabel: 'E-bike model Stad', unit: 'euro', period: '2025' },
      { id: 'accessoires', label: 'EUR 120', kind: 'distractor', sourceLabel: 'Accessoirespakket', unit: 'euro', period: '2025', distractorFor: 'nieuw' }
    ],
    roles: [
      { id: 'old', label: 'beginwaarde' },
      { id: 'new', label: 'eindwaarde' }
    ]
  },
  expected: {
    kind: 'source_value_selection',
    selections: [
      { valueId: 'oud', role: 'old' },
      { valueId: 'nieuw', role: 'new' }
    ],
    partialFeedback: 'practice_only'
  },
  feedback: {
    matchTitle: 'Bronwaarden kloppen',
    matchText: 'Je kiest oude en nieuwe waarde controleerbaar uit de bron.',
    retryTitle: 'Controleer je bronwaarden',
    retryText: 'Kies alleen de waarden die nodig zijn voor deze berekening.'
  },
  practiceRoute: {
    label: 'Oefen verder met bronnen',
    href: 'grafiekenspel.html'
  }
};

const sourceChainTask = {
  id: 'source-chain-procent',
  family: 'source_chain_builder',
  skillLabel: 'Bronketen bouwen',
  purpose: 'Bouw de route van bron naar berekening naar conclusie.',
  prompt: 'Bron 1 geeft de prijzen van e-bike model Stad: 2024 = EUR 800 en 2025 = EUR 920. Bouw de bronketen voor deze procentuele verandering.',
  interaction: {
    nodeBankLabel: 'Bronketen onderdelen',
    sequenceLabel: 'Opgebouwde bronketen',
    placeholder: 'Bouw de keten.',
    separator: ' -> ',
    nodes: [
      { id: 'bron', label: 'Lees bron 1: model Stad in 2024 en 2025', kind: 'answer', nodeRole: 'source' },
      { id: 'waarden', label: 'Gebruik 2024 EUR 800 en 2025 EUR 920', kind: 'answer', nodeRole: 'value' },
      { id: 'bewerking', label: '(920 - 800) / 800 x 100%', kind: 'answer', nodeRole: 'operation' },
      { id: 'antwoord', label: '15%', kind: 'answer', nodeRole: 'answer' },
      { id: 'conclusie', label: 'De prijs van model Stad stijgt met 15%', kind: 'answer', nodeRole: 'conclusion' },
      { id: 'accessoires', label: 'Gebruik accessoirespakket 2025 EUR 120', kind: 'distractor', nodeRole: 'value', distractorFor: 'waarden' },
      { id: 'deel-door-nieuw', label: 'Deel door 920', kind: 'distractor', nodeRole: 'operation', distractorFor: 'bewerking' }
    ]
  },
  expected: {
    kind: 'source_chain_builder',
    chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie'],
    partialFeedback: 'practice_only'
  },
  feedback: {
    matchTitle: 'Bronketen klopt',
    matchText: 'Je koppelt bron, waarden, bewerking, antwoord en conclusie.',
    retryTitle: 'Controleer de bronketen',
    retryText: 'Begin bij de bron en eindig met de conclusie.'
  },
  practiceRoute: {
    label: 'Oefen verder met bronnen',
    href: 'grafiekenspel.html'
  }
};

assert(TaskShellEngine.FAMILIES.source_value_selection, 'TaskShellEngine must declare source_value_selection');
assert(TaskShellEngine.FAMILIES.source_chain_builder, 'TaskShellEngine must declare source_chain_builder');
assert(TaskShellEngine.FAMILIES.source_value_selection.deterministic === true, 'source_value_selection must be deterministic');
assert(TaskShellEngine.FAMILIES.source_chain_builder.deterministic === true, 'source_chain_builder must be deterministic');
assert(TaskShellEngine.validateTask(sourceValueTask) === true, 'source value fixture must validate');
assert(TaskShellEngine.validateTask(sourceChainTask) === true, 'source chain fixture must validate');

assert(TaskShellEngine.evaluateTask(sourceValueTask, {
  selections: [
    { valueId: 'nieuw', role: 'new' },
    { valueId: 'oud', role: 'old' }
  ]
}).matched === true, 'source_value_selection must match exact value-role set order-insensitively');
assert(TaskShellEngine.evaluateTask(sourceValueTask, {
  selections: [
    { valueId: 'oud', role: 'old' }
  ]
}).matched === false, 'source_value_selection must fail when an answer value is omitted');
assert(TaskShellEngine.evaluateTask(sourceValueTask, {
  selections: [
    { valueId: 'oud', role: 'old' },
    { valueId: 'nieuw', role: 'old' }
  ]
}).matched === false, 'source_value_selection must fail wrong roles');
assert(TaskShellEngine.evaluateTask(sourceValueTask, {
  selections: [
    { valueId: 'oud', role: 'old' },
    { valueId: 'nieuw', role: 'new' },
    { valueId: 'accessoires', role: 'new' }
  ]
}).matched === false, 'source_value_selection must fail selected distractors');
assert(TaskShellEngine.evaluateTask(sourceValueTask, {
  selections: [
    { valueId: 'oud', role: 'old' },
    { valueId: 'oud', role: 'new' }
  ]
}).matched === false, 'source_value_selection must fail duplicate selected values');
assert(TaskShellEngine.evaluateTask(sourceValueTask, {
  selections: [
    { valueId: 'oud', role: 'old' },
    { valueId: 'onbekend', role: 'new' }
  ]
}).matched === false, 'source_value_selection must fail unknown value ids');
assert(TaskShellEngine.evaluateTask(sourceValueTask, {
  selections: [
    { valueId: 'oud', role: 'old' },
    { valueId: 'nieuw', role: 'basis' }
  ]
}).matched === false, 'source_value_selection must fail unknown roles');
assert(TaskShellEngine.evaluateTask(sourceValueTask, {
  selections: [
    { valueId: 'oud', role: 'old', extra: 'ignored' },
    { valueId: 'nieuw', role: 'new' }
  ]
}).matched === false, 'source_value_selection must fail extra keys inside entries');
assert(TaskShellEngine.evaluateTask(sourceValueTask, {
  selections: [
    { valueId: 'oud', role: 'old' },
    { valueId: 'nieuw', role: 'new' }
  ],
  extra: 'ignored'
}).matched === false, 'source_value_selection must fail extra response keys');
assert(TaskShellEngine.evaluateTask(sourceValueTask, [
  { valueId: 'oud', role: 'old' },
  { valueId: 'nieuw', role: 'new' }
]).matched === false, 'source_value_selection must fail raw arrays');
const arrayWithSelections = [];
arrayWithSelections.selections = [
  { valueId: 'oud', role: 'old' },
  { valueId: 'nieuw', role: 'new' }
];
assert(TaskShellEngine.evaluateTask(sourceValueTask, arrayWithSelections).matched === false, 'source_value_selection must fail arrays with a selections property');
assert(TaskShellEngine.evaluateTask(sourceValueTask, {
  selections: [
    { valueId: 'oud', role: 'old' },
    { valueId: 920, role: 'new' }
  ]
}).matched === false, 'source_value_selection must fail non-string value ids');

const sourceValueRetry = TaskShellEngine.evaluateTask(sourceValueTask, {
  selections: [
    { valueId: 'oud', role: 'new' },
    { valueId: 'accessoires', role: 'new' }
  ]
});
assert(sourceValueRetry.sourceValueFeedback.mode === 'practice_only', 'source value feedback must be practice_only');
assert(sourceValueRetry.sourceValueFeedback.missingRequired.length === 1, 'source value feedback must report missing values');
assert(sourceValueRetry.sourceValueFeedback.wrongRoles.length === 1, 'source value feedback must report wrong roles');
assert(sourceValueRetry.sourceValueFeedback.selectedDistractors.length === 1, 'source value feedback must report distractors');

const duplicateValue = JSON.parse(JSON.stringify(sourceValueTask));
duplicateValue.interaction.values[1].id = 'oud';
assertThrows(() => TaskShellEngine.validateTask(duplicateValue), 'duplicate source values must be rejected');

const noSourceValueDistractor = JSON.parse(JSON.stringify(sourceValueTask));
noSourceValueDistractor.interaction.values[2].kind = 'answer';
assertThrows(() => TaskShellEngine.validateTask(noSourceValueDistractor), 'source values without a distractor must be rejected');

const omittedExpectedValue = JSON.parse(JSON.stringify(sourceValueTask));
omittedExpectedValue.interaction.values.push({ id: 'actie', label: 'EUR 1000', kind: 'answer' });
assertThrows(() => TaskShellEngine.validateTask(omittedExpectedValue), 'expected source selections must cover all answer values');

const expectedDistractorValue = JSON.parse(JSON.stringify(sourceValueTask));
expectedDistractorValue.expected.selections[1].valueId = 'accessoires';
assertThrows(() => TaskShellEngine.validateTask(expectedDistractorValue), 'expected source selections must reject distractors');

const duplicateExpectedValue = JSON.parse(JSON.stringify(sourceValueTask));
duplicateExpectedValue.expected.selections[1].valueId = 'oud';
assertThrows(() => TaskShellEngine.validateTask(duplicateExpectedValue), 'expected source selections must reject duplicate values');

const badSourceValueFeedback = JSON.parse(JSON.stringify(sourceValueTask));
badSourceValueFeedback.expected.partialFeedback = 'diagnostic';
assertThrows(() => TaskShellEngine.validateTask(badSourceValueFeedback), 'source value partial feedback must be practice_only');

assert(TaskShellEngine.evaluateTask(sourceChainTask, {
  chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie']
}).matched === true, 'source_chain_builder must match exact ordered chain');
assert(TaskShellEngine.evaluateTask(sourceChainTask, {
  chain: ['bron', 'waarden', 'antwoord', 'bewerking', 'conclusie']
}).matched === false, 'source_chain_builder must fail wrong order');
assert(TaskShellEngine.evaluateTask(sourceChainTask, {
  chain: ['bron', 'waarden', 'bewerking', 'antwoord']
}).matched === false, 'source_chain_builder must fail omitted answer nodes');
assert(TaskShellEngine.evaluateTask(sourceChainTask, {
  chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie', 'deel-door-nieuw']
}).matched === false, 'source_chain_builder must fail selected distractors');
assert(TaskShellEngine.evaluateTask(sourceChainTask, {
  chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'antwoord']
}).matched === false, 'source_chain_builder must fail duplicate nodes');
assert(TaskShellEngine.evaluateTask(sourceChainTask, {
  chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'onbekend']
}).matched === false, 'source_chain_builder must fail unknown nodes');
assert(TaskShellEngine.evaluateTask(sourceChainTask, {
  chain: ['bron', 'waarden', 'bewerking', 'antwoord', 15]
}).matched === false, 'source_chain_builder must fail non-string ids');
assert(TaskShellEngine.evaluateTask(sourceChainTask, {
  chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie'],
  extra: 'ignored'
}).matched === false, 'source_chain_builder must fail extra response keys');
assert(TaskShellEngine.evaluateTask(sourceChainTask, [
  'bron',
  'waarden',
  'bewerking',
  'antwoord',
  'conclusie'
]).matched === false, 'source_chain_builder must fail raw arrays');
const arrayWithChain = [];
arrayWithChain.chain = ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie'];
assert(TaskShellEngine.evaluateTask(sourceChainTask, arrayWithChain).matched === false, 'source_chain_builder must fail arrays with a chain property');

const sourceChainRetry = TaskShellEngine.evaluateTask(sourceChainTask, {
  chain: ['bron', 'waarden', 'deel-door-nieuw']
});
assert(sourceChainRetry.sourceChainFeedback.mode === 'practice_only', 'source chain feedback must be practice_only');
assert(sourceChainRetry.sourceChainFeedback.firstMisplaced.expectedId === 'bewerking', 'source chain feedback must identify first misplaced expected node');
assert(sourceChainRetry.sourceChainFeedback.selectedDistractors.length === 1, 'source chain feedback must report selected distractor');
assert(sourceChainRetry.sourceChainFeedback.correctPrefix.length === 2, 'source chain feedback must report correct prefix');
assert(sourceChainRetry.sourceChainFeedback.missingRequiredRoles.some((role) => role.id === 'answer'), 'source chain feedback must report missing answer role');

const duplicateNode = JSON.parse(JSON.stringify(sourceChainTask));
duplicateNode.interaction.nodes[1].id = 'bron';
assertThrows(() => TaskShellEngine.validateTask(duplicateNode), 'duplicate source chain node ids must be rejected');

const missingConclusion = JSON.parse(JSON.stringify(sourceChainTask));
missingConclusion.interaction.nodes = missingConclusion.interaction.nodes.map((node) => (
  node.id === 'conclusie' ? { ...node, kind: 'distractor', distractorFor: 'antwoord' } : node
));
assertThrows(() => TaskShellEngine.validateTask(missingConclusion), 'source chain must include every required answer node role');

const noChainDistractor = JSON.parse(JSON.stringify(sourceChainTask));
noChainDistractor.interaction.nodes = noChainDistractor.interaction.nodes.map((node) => (
  node.kind === 'distractor' ? { ...node, kind: 'answer' } : node
));
assertThrows(() => TaskShellEngine.validateTask(noChainDistractor), 'source chain without a distractor must be rejected');

const expectedDistractorNode = JSON.parse(JSON.stringify(sourceChainTask));
expectedDistractorNode.expected.chain[2] = 'deel-door-nieuw';
assertThrows(() => TaskShellEngine.validateTask(expectedDistractorNode), 'expected source chain must reject distractors');

const omittedExpectedNode = JSON.parse(JSON.stringify(sourceChainTask));
omittedExpectedNode.interaction.nodes.push({ id: 'controle', label: 'Controleer notatie', kind: 'answer', nodeRole: 'conclusion' });
assertThrows(() => TaskShellEngine.validateTask(omittedExpectedNode), 'expected source chain must cover all answer nodes');

const duplicateExpectedNode = JSON.parse(JSON.stringify(sourceChainTask));
duplicateExpectedNode.expected.chain[4] = 'antwoord';
assertThrows(() => TaskShellEngine.validateTask(duplicateExpectedNode), 'expected source chain must reject duplicate nodes');

const badNodeRole = JSON.parse(JSON.stringify(sourceChainTask));
badNodeRole.interaction.nodes[2].nodeRole = 'formula';
assertThrows(() => TaskShellEngine.validateTask(badNodeRole), 'source chain must reject unknown node roles');

const badChainFeedback = JSON.parse(JSON.stringify(sourceChainTask));
badChainFeedback.expected.partialFeedback = 'diagnostic';
assertThrows(() => TaskShellEngine.validateTask(badChainFeedback), 'source chain partial feedback must be practice_only');

for (const fragment of [
  '[data-task-id="source-values-procent"][data-source-value-id]',
  '[data-task-id="source-values-procent"][data-source-role-value-id]'
]) {
  assert(TaskShellEngine.focusPlan(sourceValueTask).includes(fragment), `source value focus plan missing ${fragment}`);
}
for (const fragment of [
  '[data-task-id="source-chain-procent"][data-source-node-id]',
  '[data-task-id="source-chain-procent"][data-source-chain-sequence]'
]) {
  assert(TaskShellEngine.focusPlan(sourceChainTask).includes(fragment), `source chain focus plan missing ${fragment}`);
}

const sourceValueRendered = TaskShellUI.renderTask(sourceValueTask, 0);
const sourceChainRendered = TaskShellUI.renderTask(sourceChainTask, 1);
for (const fragment of [
  'data-task-family="source_value_selection"',
  'class="ts-source-values"',
  'data-source-value-id="accessoires"',
  'data-source-role-value-id="oud"',
  'role="group" aria-label="Bronwaarden"',
  'aria-label="Rol voor EUR 800"',
  'aria-live="polite"'
]) {
  assert(sourceValueRendered.includes(fragment), `rendered source-value fixture missing ${fragment}`);
}
assert(!/oude prijs|nieuwe prijs/i.test(sourceValueRendered), 'source-value rendered fixture must not label rows as old/new price');
assert(sourceValueRendered.includes('E-bike model Stad') && sourceValueRendered.includes('2024') && sourceValueRendered.includes('2025'), 'source-value rendered fixture must show product/year context');
for (const fragment of [
  'data-task-family="source_chain_builder"',
  'class="ts-source-chain"',
  'data-source-node-id="deel-door-nieuw"',
  'data-source-node-role="operation"',
  'data-source-chain-sequence',
  'role="group" aria-label="Bronketen onderdelen"',
  'aria-label="Opgebouwde bronketen"',
  'aria-live="polite"'
]) {
  assert(sourceChainRendered.includes(fragment), `rendered source-chain fixture missing ${fragment}`);
}
assert(sourceChainRendered.includes('Bron 1') && sourceChainRendered.includes('2024 EUR 800 en 2025 EUR 920'), 'source-chain rendered fixture must show visible source data');

const sourceValueFeedbackHtml = TaskShellUI.renderFeedback(sourceValueRetry);
for (const fragment of [
  'class="ts-source-value-feedback"',
  'Rol controleren',
  'EUR 800',
  'EUR 120'
]) {
  assert(sourceValueFeedbackHtml.includes(fragment), `source-value feedback HTML missing ${fragment}`);
}
const sourceChainFeedbackHtml = TaskShellUI.renderFeedback(sourceChainRetry);
for (const fragment of [
  'class="ts-source-chain-feedback"',
  'Eerste onderdeel om te controleren',
  '(920 - 800) / 800 x 100%',
  'Ontbrekend type onderdeel',
  'antwoord'
]) {
  assert(sourceChainFeedbackHtml.includes(fragment), `source-chain feedback HTML missing ${fragment}`);
}

assert(typeof TaskShellUI.collectSourceValueSelectionResponse === 'function', 'TaskShellUI must export collectSourceValueSelectionResponse');
assert(typeof TaskShellUI.handleSourceValueSelectionClick === 'function', 'TaskShellUI must export handleSourceValueSelectionClick');
assert(typeof TaskShellUI.collectSourceChainBuilderResponse === 'function', 'TaskShellUI must export collectSourceChainBuilderResponse');
assert(typeof TaskShellUI.handleSourceChainBuilderClick === 'function', 'TaskShellUI must export handleSourceChainBuilderClick');

const engineSource = read('engines/task-shell-engine.js');
const uiSource = read('engines/task-shell-ui.js');
const cssSource = read('engines/task-shell.css');
const exitTicketSource = read('engines/exit-ticket-ui.js');
const skilltreeSource = read('engines/skilltree-ui.js');
const graphSource = read('engines/graphical-ui.js');

for (const [label, source, fragments] of [
  ['engine', engineSource, ['source_value_selection', 'source_chain_builder', 'validateSourceValueInteraction', 'validateSourceChainInteraction', 'sourceValueSelectionMatches', 'sourceChainMatches']],
  ['ui', uiSource, ['renderSourceValueSelection', 'renderSourceChainBuilder', 'collectSourceValueSelectionResponse', 'collectSourceChainBuilderResponse', 'handleSourceValueSelectionClick', 'handleSourceChainBuilderClick']],
  ['css', cssSource, ['.ts-source-values', '.ts-source-value-card', '.ts-source-chain', '.ts-source-chain-feedback']],
  ['exit-ticket', exitTicketSource, ['handleSourceValueSelectionClick(app, event)', 'collectSourceValueSelectionResponse(wrapper, task)', "task.family === 'source_value_selection'", 'handleSourceChainBuilderClick(app, event)', 'collectSourceChainBuilderResponse(wrapper, task)', "task.family === 'source_chain_builder'"]],
  ['skilltree', skilltreeSource, ['handleSourceValueSelectionClick(els.exStepSlot, e)', 'collectSourceValueSelectionResponse(root, task)', "task.family === 'source_value_selection'", 'handleSourceChainBuilderClick(els.exStepSlot, e)', 'collectSourceChainBuilderResponse(root, task)', "task.family === 'source_chain_builder'"]],
  ['graphical', graphSource, ['handleSourceValueSelectionClick(rootEl, event)', 'collectSourceValueSelectionResponse(rootEl, task)', 'task.family === "source_value_selection"', 'handleSourceChainBuilderClick(rootEl, event)', 'collectSourceChainBuilderResponse(rootEl, task)', 'task.family === "source_chain_builder"']]
]) {
  for (const fragment of fragments) {
    assert(source.includes(fragment), `${label} source missing ${fragment}`);
  }
}

assert(uiSource.includes('data-source-selected-node-id'), 'source_chain_builder must use distinct selected-node selectors');
assert(uiSource.includes('data-source-role-value-id'), 'source_value_selection must use distinct role selectors');

const proof = readJson('reports/json/task-family-source1-proof.json');
assert(proof.sprint_id === 'TASK-FAMILY-SOURCE-1', 'proof JSON has wrong sprint_id');
assert(proof.families.includes('source_value_selection'), 'proof JSON missing source_value_selection');
assert(proof.families.includes('source_chain_builder'), 'proof JSON missing source_chain_builder');
assert(proof.runtime_support.source_value_selection.exact_value_role_set === true, 'proof JSON must cover source value exact matching');
assert(proof.runtime_support.source_value_selection.full_answer_value_coverage_required === true, 'proof JSON must cover all source answer values');
assert(proof.runtime_support.source_chain_builder.exact_ordered_chain === true, 'proof JSON must cover exact source chain');
assert(proof.runtime_support.source_chain_builder.required_node_roles === true, 'proof JSON must cover required source chain node roles');
assert(proof.planning_flags.array_with_key_rejected === true, 'proof JSON must cover array-with-key rejection');
assert(proof.planning_flags.keyboard_screen_reader_proof === true, 'proof JSON must cover keyboard/screen-reader proof');
assert(proof.planning_flags.narrow_fixture_mobile_substitute === true, 'proof JSON must record narrow fixture substitute');
assert(proof.boundary_flags.generated_lesson_output_changed === false, 'proof JSON must block generated output changes');
assert(proof.wrapper_collection.exit_ticket === true, 'proof JSON must cover exit-ticket wrapper');
assert(proof.wrapper_collection.skilltree === true, 'proof JSON must cover skilltree wrapper');
assert(proof.wrapper_collection.graphical === true, 'proof JSON must cover graphical wrapper');

const fixtureHtml = read('reports/sprints/TASK-FAMILY-SOURCE-1-rendered-fixture.html');
for (const fragment of [
  'data-task-family="source_value_selection"',
  'data-task-family="source_chain_builder"',
  'data-source-value-id="accessoires"',
  'data-source-role-value-id="oud"',
  'data-source-selected-node-id="bron"',
  'data-source-chain-sequence',
  'class="ts-source-value-feedback"',
  'class="ts-source-chain-feedback"',
  'data-fixture-viewport="narrow"',
  'data-fixture-theme="dark"',
  'data-fixture-state="after-click"',
  'aria-label="Feedback op je antwoord"'
]) {
  assert(fixtureHtml.includes(fragment), `rendered fixture artifact missing ${fragment}`);
}

const manifest = read('reports/sprints/TASK-FAMILY-SOURCE-1-screenshot-manifest.md');
assert(/standard/i.test(manifest) && /narrow/i.test(manifest) && /dark/i.test(manifest), 'screenshot manifest must describe standard/narrow/dark fixture proof');
assert(/after-click/i.test(manifest), 'screenshot manifest must describe after-click interaction proof');
assert(/keyboard/i.test(manifest) && /screen-reader/i.test(manifest), 'screenshot manifest must describe keyboard/screen-reader proof');
assert(/no generated lesson output/i.test(manifest), 'screenshot manifest must preserve generated-output boundary');

console.log('TASK-FAMILY-SOURCE-1 check OK');
