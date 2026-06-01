#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine'));
const TaskShellUI = require(path.join(ROOT, 'engines', 'task-shell-ui'));

function fail(message) {
  console.error(`TASK-FAMILY-CLOZE-1 check failed: ${message}`);
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
  id: 'cloze-text-indexpoints',
  family: 'cloze_text',
  skillLabel: 'Indexpunten invullen',
  purpose: 'Vul de ontbrekende waarden in een begrensde economische zin in.',
  prompt: 'Vul de indexpunten en basis in.',
  interaction: {
    segments: [
      { type: 'text', text: 'De stijging is ' },
      { type: 'blank', blankId: 'indexpunten' },
      { type: 'text', text: ' indexpunten. Je deelt door ' },
      { type: 'blank', blankId: 'basis' },
      { type: 'text', text: ', omdat ' },
      { type: 'blank', blankId: 'reden' },
      { type: 'text', text: '.' }
    ],
    blanks: [
      { id: 'indexpunten', label: 'Stijging in indexpunten', placeholder: 'bijv. 4', inputMode: 'decimal', width: 'short' },
      { id: 'basis', label: 'Oude index als basis', placeholder: 'bijv. 108', inputMode: 'decimal', width: 'short' },
      { id: 'reden', label: 'Waarom 108 de basis is', placeholder: 'oude index is de basis', width: 'wide' }
    ]
  },
  expected: {
    kind: 'cloze_text',
    blanks: {
      indexpunten: { accepted: ['4', '4 indexpunten'], rejectText: ['4%'] },
      basis: { accepted: ['108', 'index 108'] },
      reden: {
        requiredTextGroups: [
          ['108', 'oude index'],
          ['basis', 'deler', 'delen']
        ],
        rejectText: ['altijd delen door 100']
      }
    }
  },
  feedback: {
    matchTitle: 'Invulling klopt',
    matchText: 'Je gebruikt indexpunten en de oude index als basis.',
    retryTitle: 'Controleer de invulling',
    retryText: 'Vul indexpunten, basis en reden opnieuw in.'
  },
  practiceRoute: {
    label: 'Oefen verder met indexcijfers',
    href: 'wiskundevaardigheden.html'
  }
};

assert(TaskShellEngine.FAMILIES.cloze_text, 'TaskShellEngine must declare cloze_text');
assert(TaskShellEngine.FAMILIES.cloze_text.deterministic === true, 'cloze_text must be deterministic');
assert(TaskShellEngine.validateTask(fixtureTask) === true, 'fixture task must validate');

assert(TaskShellEngine.evaluateTask(fixtureTask, {
  blanks: {
    indexpunten: '4',
    basis: '108',
    reden: 'De oude index is de basis.'
  }
}).matched === true, 'accepted values and required text groups must match');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  blanks: {
    indexpunten: '4%',
    basis: '108',
    reden: 'De oude index is de basis.'
  }
}).matched === false, 'rejectText must block misconception text');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  blanks: {
    indexpunten: '4',
    basis: '108',
    reden: 'Je moet altijd delen door 100.'
  }
}).matched === false, 'required text group rejectText must block contradictory reason');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  blanks: {
    indexpunten: '4',
    basis: '108'
  }
}).matched === false, 'missing blank must not match');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  indexpunten: '4',
  basis: '108',
  reden: 'De oude index is de basis.'
}).matched === false, 'raw blank map must not match exact response shape');
assert(TaskShellEngine.evaluateTask(fixtureTask, {
  blanks: {
    indexpunten: '4',
    basis: '108',
    reden: 'De oude index is de basis.'
  },
  extra: 'ignored'
}).matched === false, 'response object with extra keys must not match exact response shape');

assert(TaskShellEngine.focusPlan(fixtureTask).includes('[data-task-id="cloze-text-indexpoints"][data-cloze-text-blank-id]'), 'focus plan must include cloze text blanks');

const invalidGroups = JSON.parse(JSON.stringify(fixtureTask));
invalidGroups.expected.blanks.reden.requiredTextGroups = [{ label: 'basis', any: ['basis'] }];
assertThrows(() => TaskShellEngine.validateTask(invalidGroups), 'object-style requiredTextGroups must be rejected for cloze_text');

const invalidExpected = JSON.parse(JSON.stringify(fixtureTask));
invalidExpected.expected.blanks.reden = {};
assertThrows(() => TaskShellEngine.validateTask(invalidExpected), 'blank expected must require accepted values or requiredTextGroups');

const invalidSegments = JSON.parse(JSON.stringify(fixtureTask));
invalidSegments.interaction.segments = [{ type: 'text', text: 'Geen invulvak.' }];
assertThrows(() => TaskShellEngine.validateTask(invalidSegments), 'segments must include every interaction blank');

const rendered = TaskShellUI.renderTask(fixtureTask, 0);
for (const fragment of [
  'data-task-family="cloze_text"',
  'class="ts-cloze-typed"',
  'data-cloze-text-blank-id="indexpunten"',
  'data-cloze-text-label="Oude index als basis"',
  'inputmode="decimal"',
  'placeholder="bijv. 108"',
  'aria-label="Waarom 108 de basis is"',
  'aria-live="polite"'
]) {
  assert(rendered.includes(fragment), `rendered fixture missing ${fragment}`);
}

assert(typeof TaskShellUI.collectClozeTextResponse === 'function', 'TaskShellUI must export collectClozeTextResponse');

const engineSource = read('engines/task-shell-engine.js');
const uiSource = read('engines/task-shell-ui.js');
const cssSource = read('engines/task-shell.css');
const exitTicketSource = read('engines/exit-ticket-ui.js');
const skilltreeSource = read('engines/skilltree-ui.js');
const graphSource = read('engines/graphical-ui.js');

for (const [label, source, fragments] of [
  ['engine', engineSource, ['validateClozeTextInteraction', 'clozeTextMatches', 'requiredTextGroups', 'rejectText']],
  ['ui', uiSource, ['renderClozeText', 'collectClozeTextResponse', 'ts-cloze-typed']],
  ['css', cssSource, ['.ts-cloze-typed', '.ts-cloze-text-line', '.ts-cloze-text-input']],
  ['exit-ticket', exitTicketSource, ['collectClozeTextResponse(wrapper, task)', "task.family === 'cloze_text'"]],
  ['skilltree', skilltreeSource, ['collectClozeTextResponse(root, task)', "task.family === 'cloze_text'"]],
  ['graphical', graphSource, ['collectClozeTextResponse(rootEl, task)', 'task.family === "cloze_text"']]
]) {
  for (const fragment of fragments) {
    assert(source.includes(fragment), `${label} source missing ${fragment}`);
  }
}

const proof = readJson('reports/json/task-family-cloze1-proof.json');
assert(proof.sprint_id === 'TASK-FAMILY-CLOZE-1', 'proof JSON has wrong sprint_id');
assert(proof.family === 'cloze_text', 'proof JSON has wrong family');
assert(proof.runtime_support.required_text_groups === true, 'proof JSON must cover required text groups');
assert(proof.runtime_support.extra_response_keys_match === false, 'proof JSON must record exact response-shape rejection');
assert(proof.boundary_flags.target_equivalent_reliance === false, 'proof JSON must block target-equivalent reliance');
assert(proof.boundary_flags.generated_lesson_output_changed === false, 'proof JSON must block generated output changes');
assert(proof.wrapper_collection.exit_ticket === true, 'proof JSON must cover exit-ticket wrapper');
assert(proof.wrapper_collection.skilltree === true, 'proof JSON must cover skilltree wrapper');
assert(proof.wrapper_collection.graphical === true, 'proof JSON must cover graphical wrapper');

const fixtureHtml = read('reports/sprints/TASK-FAMILY-CLOZE-1-rendered-fixture.html');
assert(fixtureHtml.includes('data-task-family="cloze_text"'), 'rendered fixture artifact missing cloze_text family marker');
assert(fixtureHtml.includes('data-cloze-text-blank-id="indexpunten"'), 'rendered fixture artifact missing typed blank marker');
assert(fixtureHtml.includes('class="ts-cloze-typed"'), 'rendered fixture artifact missing typed cloze wrapper');
assert(fixtureHtml.includes('aria-label="Feedback op je antwoord"'), 'rendered fixture artifact missing feedback region');

const manifest = read('reports/sprints/TASK-FAMILY-CLOZE-1-screenshot-manifest.md');
assert(/rendered fixture/i.test(manifest), 'screenshot manifest must describe rendered fixture proof');
assert(/no generated lesson output/i.test(manifest), 'screenshot manifest must preserve generated-output boundary');

console.log('TASK-FAMILY-CLOZE-1 check OK');

function assertThrows(fn, message) {
  let threw = false;
  try {
    fn();
  } catch (error) {
    threw = true;
  }
  assert(threw, message);
}
