#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const { buildArtifacts, wrongOrder } = require('./generate-reason-std1-proof');

function fail(message) {
  console.error(`REASON-STD-1 check failed: ${message}`);
  process.exit(1);
}

function read(rel) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) fail(`missing required file: ${rel}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(rel) {
  try {
    return JSON.parse(read(rel));
  } catch (error) {
    fail(`${rel} is not valid JSON: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function requireText(rel, pattern, label) {
  const text = read(rel);
  assert(pattern.test(text), `${rel} missing ${label}`);
  return text;
}

const requiredFiles = [
  'reports/sprints/REASON-STD-1-plan.md',
  'reports/sprints/REASON-STD-1-baseline.md',
  'reports/sprints/REASON-STD-1-planning-review.md',
  'reports/sprints/REASON-STD-1-standard-family-map.md',
  'reports/sprints/REASON-STD-1-build-vs-rebuild-note.md',
  'reports/sprints/REASON-STD-1-rendered-fixture.html',
  'reports/sprints/REASON-STD-1-screenshot-manifest.md',
  'reports/json/reason-std1-standard-family-map.json',
  'reports/json/reason-std1-proof.json',
  'references/data/sprints/REASON-STD-1.plan.json',
  'build-scripts/sprints/generate-reason-std1-proof.js',
];

requiredFiles.forEach(read);

const plan = readJson('references/data/sprints/REASON-STD-1.plan.json');
assert(plan.lead_review_required === true, 'plan JSON must require lead review');
assert(plan.generated_lesson_output_allowed === false, 'generated lesson output must be disallowed');
assert(plan.authority.generated_output_authorized === false, 'generated output authority must be false');
assert(plan.authority.source_data_mutation_authorized === false, 'source data mutation authority must be false');
assert(plan.authority.target_equivalent_claims_authorized === false, 'target-equivalent claims authority must be false');
assert(plan.authority.student_or_product_use_authorized === false, 'product use authority must be false');

requireText('reports/sprints/REASON-STD-1-planning-review.md', /PASS WITH FLAGS/i, 'planning-review verdict');
requireText('reports/sprints/REASON-STD-1-standard-family-map.md', /step_ordering[\s\S]*claim_reason_evidence[\s\S]*flow_diagram_build/i, 'reasoning standard mapping');
requireText('reports/sprints/REASON-STD-1-standard-family-map.md', /source_based_explanation[\s\S]*source_value_selection[\s\S]*source_chain_builder[\s\S]*structured_short_response/i, 'source-based explanation composed pattern');
requireText('reports/sprints/REASON-STD-1-build-vs-rebuild-note.md', /thin wrapper/i, 'thin-wrapper decision');
requireText('reports/sprints/REASON-STD-1-build-vs-rebuild-note.md', /REASON-ADOPT-1/i, 'later adoption sprint');
requireText('reports/sprints/REASON-STD-1-build-vs-rebuild-note.md', /GATE-REASON-STD-1/i, 'later human evidence gate');
requireText('reports/sprints/REASON-STD-1-screenshot-manifest.md', /rendered fixture/i, 'rendered fixture proof');
requireText('reports/sprints/REASON-STD-1-screenshot-manifest.md', /no generated lesson output/i, 'generated-output boundary');
requireText('reports/sprints/REASON-STD-1-screenshot-manifest.md', /no actual product-route screenshots/i, 'product-route screenshot boundary');

const engineSource = requireText('engines/reasoning-engine.js', /buildStepOrderingTask[\s\S]*buildClaimReasonEvidenceTask[\s\S]*buildFlowOrderingTask/i, 'standard task builders');
assert(/getStandardFamilyMap/.test(engineSource), 'reasoning engine must expose getStandardFamilyMap');
assert(/reasoningStandardDisposition/.test(engineSource), 'reasoning engine must expose standard dispositions');

const testSource = read('engines/tests/reasoning-engine.test.js');
[
  'step_ordering',
  'claim_reason_evidence',
  'flow_diagram_build',
  'classification_with_explanation',
  'source_based_explanation',
].forEach((term) => {
  assert(testSource.includes(term), `reasoning-engine tests must mention ${term}`);
});

const ReasoningEngine = require(path.join(ROOT, 'engines', 'reasoning-engine.js'));
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine.js'));
const csv = read('source-data/book-1/reasoning/1.1.1.csv');
const engine = new ReasoningEngine({
  csvString: csv,
  domain: 'economics',
  parNr: '1.1.1',
  roundsPerGame: 1,
});

const map = engine.getStandardFamilyMap();
function mapRow(mode) {
  return map.find((row) => row.mode === mode);
}
assert(mapRow(0).candidateFamily === 'step_ordering', 'mode 0 must map to step_ordering');
assert(mapRow(1).candidateFamily === 'claim_reason_evidence', 'mode 1 must map to claim_reason_evidence');
assert(mapRow(2).disposition === 'defer_mapping', 'mode 2 must be deferred');
assert(mapRow(3).candidateFamily === 'flow_diagram_build', 'mode 3 must map to flow_diagram_build');
assert(mapRow(4).disposition === 'refactor_before_adoption', 'mode 4 must be refactor before adoption');
assert(mapRow(5).candidateFamily === 'structured_reasoning', 'mode 5 must remain structured_reasoning');
assert(map.some((row) => row.candidateFamily === 'source_based_explanation'), 'source_based_explanation follow-up must be named');

[0, 1, 3, 5].forEach((mode) => {
  const instance = new ReasoningEngine({
    csvString: csv,
    domain: 'economics',
    parNr: '1.1.1',
    roundsPerGame: 1,
  });
  instance.startGame(mode);
  const round = instance.getRound();
  assert(round.taskShellTask, `mode ${mode} must expose taskShellTask`);
  TaskShellEngine.validateTask(round.taskShellTask);
  if (mode === 5) {
    const result = TaskShellEngine.evaluateTask(round.taskShellTask, 'Oorzaak, tussenstap en conclusie.');
    assert(result.state === 'self_check', 'mode 5 must remain self-check');
    assert(result.boundaryFlags.targetEquivalentProof === false, 'mode 5 must not claim target-equivalent proof');
  } else {
    const result = TaskShellEngine.evaluateTask(round.taskShellTask, {
      order: round.taskShellTask.expected.order,
    });
    assert(result.state === 'matched', `mode ${mode} expected order must match`);
    const wrong = TaskShellEngine.evaluateTask(round.taskShellTask, {
      order: wrongOrder(round.taskShellTask.expected.order),
    });
    assert(wrong.state === 'retry', `mode ${mode} wrong order must retry`);
    assert(wrong.matched === false, `mode ${mode} wrong order must not match`);
  }
});

[2, 4].forEach((mode) => {
  const instance = new ReasoningEngine({
    csvString: csv,
    domain: 'economics',
    parNr: '1.1.1',
    roundsPerGame: 1,
  });
  instance.startGame(mode);
  const round = instance.getRound();
  assert(!round.taskShellTask, `mode ${mode} must not pretend to have a task-shell task yet`);
  assert(round.standardFamily, `mode ${mode} must have an explicit disposition`);
});

const mapJson = readJson('reports/json/reason-std1-standard-family-map.json');
assert(Array.isArray(mapJson.modes) && mapJson.modes.length >= 6, 'standard family map JSON must list modes');
assert(mapJson.boundaries.generated_lesson_output_authorized === false, 'map JSON must block generated lesson output');
assert(mapJson.boundaries.product_route_adoption_authorized === false, 'map JSON must block product-route adoption');

const proofJson = readJson('reports/json/reason-std1-proof.json');
assert(Array.isArray(proofJson.validated_modes) && proofJson.validated_modes.includes(0), 'proof JSON must include mode 0');
assert(proofJson.validated_modes.includes(1), 'proof JSON must include mode 1');
assert(proofJson.validated_modes.includes(3), 'proof JSON must include mode 3');
assert(proofJson.validated_modes.includes(5), 'proof JSON must include mode 5');
assert(proofJson.deferred_modes.includes(2), 'proof JSON must defer mode 2');
assert(proofJson.deferred_modes.includes(4), 'proof JSON must defer mode 4');

const fixture = read('reports/sprints/REASON-STD-1-rendered-fixture.html');
const expectedArtifacts = buildArtifacts();
assert(
  fixture === expectedArtifacts.fixtureHtml,
  'rendered fixture must be generated from current reasoning-engine taskShellTask objects'
);
assert(
  read('reports/json/reason-std1-standard-family-map.json') === expectedArtifacts.mapJsonText,
  'standard-family map JSON must match generated current-engine proof'
);
assert(
  read('reports/json/reason-std1-proof.json') === expectedArtifacts.proofJsonText,
  'proof JSON must match generated current-engine proof'
);
assert(/data-task-family="step_ordering"/.test(fixture), 'fixture must render step_ordering task(s)');
assert(/data-task-family="structured_reasoning"/.test(fixture), 'fixture must render structured_reasoning task');
assert(/REASON-STD-1/.test(fixture), 'fixture must identify sprint');
assert(!/beheerst|diagnose|summatief|aangetoond|bewezen/i.test(fixture), 'fixture must not contain forbidden product claims');

console.log('REASON-STD-1 check OK');
