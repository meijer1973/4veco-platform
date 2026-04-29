#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep this checker read-only.
 * - RX.2 first-lane review may validate candidate specs and command templates,
 *   but must not execute unit-add.js or write protected reference data.
 */

const fs = require('fs');
const path = require('path');
const { validateSpec } = require('./unit-add');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const RX1_CLOSURE = 'reports/review-gates/GATE-RX1-representation-unit-scope/gate-closure.json';
const SPECS = 'references/data/sprints/RX.2-first-lane-candidate-specs.json';
const REVIEW_PACKET = 'reports/review-gates/GATE-RX2-first-lane-mutation-review/review-packet.json';
const CLI_PLAN = 'reports/review-gates/GATE-RX2-first-lane-mutation-review/cli-mutation-plan.json';
const UNITS = 'references/machine/micro-teaching-units.json';

function fail(message) {
  console.error(`RX.2 first-lane review check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  const full = repoPath(relPath);
  assert(fs.existsSync(full), `missing ${relPath}`);
  try {
    return JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function exists(relPath) {
  assert(fs.existsSync(repoPath(relPath)), `missing ${relPath}`);
}

function sameArray(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((value, index) => value === b[index]);
}

function main() {
  const closure = readJson(RX1_CLOSURE);
  const specs = readJson(SPECS);
  const reviewPacket = readJson(REVIEW_PACKET);
  const cliPlan = readJson(CLI_PLAN);
  const units = readJson(UNITS);
  const liveIds = new Set(units.map((unit) => unit.id));

  assert(closure.status === 'pass_with_conditions', 'RX.1 gate must be pass_with_conditions');
  assert(closure.rx2_planning_authorized === true, 'RX.1 gate must authorize RX.2 planning');
  assert(closure.mutation_authorized === false, 'RX.1 gate must not authorize mutation');
  assert(specs.sprint_id === 'RX.2', 'candidate specs sprint_id must be RX.2');
  assert(specs.status === 'prepared_for_mutation_review', 'candidate specs status must be prepared_for_mutation_review');
  assert(specs.policy.mutation_authorized === false, 'candidate specs must not authorize mutation');
  assert(specs.policy.cli_execution_authorized === false, 'candidate specs must not authorize CLI execution');
  assert(specs.policy.protected_reference_data_changed === false, 'candidate specs must preserve protected_reference_data_changed false');
  assert(sameArray(specs.policy.first_lane_scope, closure.rx2_first_lane), 'first lane scope must match RX.1 closure');
  assert(Array.isArray(specs.candidates) && specs.candidates.length === closure.rx2_first_lane.length, 'candidate count must equal first lane count');

  const firstLaneSet = new Set(closure.rx2_first_lane);
  const existingPlusPrior = new Set(liveIds);
  for (const expectedId of closure.rx2_first_lane) {
    assert(specs.candidates.some((candidate) => candidate.candidate_id === expectedId), `missing first-lane candidate ${expectedId}`);
  }

  for (const candidate of specs.candidates) {
    const label = candidate.candidate_id;
    assert(firstLaneSet.has(label), `${label} is outside first lane`);
    assert(candidate.mutation_authorized === false, `${label} must not authorize mutation`);
    assert(candidate.cli_execution_authorized === false, `${label} must not authorize CLI execution`);
    assert(candidate.live_numbering_status === 'available_at_review_generation', `${label} must be available at review generation`);
    assert(!liveIds.has(label), `${label} already exists in live catalog`);

    const spec = candidate.rx2_draft_spec;
    const specErrors = validateSpec(spec, liveIds);
    assert(specErrors.length === 0, `${label} draft spec failed validateSpec: ${specErrors.join('; ')}`);
    assert(Array.isArray(spec.procedure) && spec.procedure.length >= 4, `${label} needs a concrete procedure`);
    assert(Array.isArray(spec.pitfalls) && spec.pitfalls.length >= 1, `${label} needs at least one pitfall`);
    assert(candidate.generator_followup_required === true, `${label} generator follow-up should be tracked`);

    for (const need of spec.needs || []) {
      assert(existingPlusPrior.has(need), `${label} has unresolved need ${need} for current sequence`);
    }
    existingPlusPrior.add(label);
  }

  const a70 = specs.candidates.find((candidate) => candidate.candidate_id === 'A70');
  assert(a70, 'A70 candidate missing');
  assert(a70.rx2_draft_spec.needs.includes('A38'), 'A70 must propose A38 dependency');
  assert(!a70.rx2_draft_spec.needs.includes('A64'), 'A70 first-lane draft must not depend on deferred A64');
  assert(Array.isArray(a70.rx2_draft_spec.review_flags) && a70.rx2_draft_spec.review_flags.length > 0, 'A70 must flag dependency adjustment');

  for (const blocked of ['A62', 'A63', 'A64', 'A68', 'A69', 'A71', 'A73', 'A82', 'A83', 'A84']) {
    assert(!specs.candidates.some((candidate) => candidate.candidate_id === blocked), `${blocked} must remain deferred`);
  }

  assert(reviewPacket.gate_id === 'GATE-RX2-first-lane-mutation-review', 'review packet gate_id mismatch');
  assert(reviewPacket.status === 'prepared_for_human_review', 'review packet must be prepared_for_human_review');
  assert(reviewPacket.mutation_authorized === false, 'review packet must not authorize mutation');
  assert(reviewPacket.cli_execution_authorized === false, 'review packet must not authorize CLI execution');
  assert(Array.isArray(reviewPacket.review_questions) && reviewPacket.review_questions.length === 10, 'review packet must list 10 questions');
  for (const artifact of reviewPacket.artifacts || []) exists(artifact);

  assert(cliPlan.status === 'draft_pending_human_review', 'CLI plan must be draft_pending_human_review');
  assert(cliPlan.execution_authorized === false, 'CLI plan must not authorize execution');
  assert(cliPlan.mutation_authorized === false, 'CLI plan must not authorize mutation');
  assert(Array.isArray(cliPlan.ordered_steps) && cliPlan.ordered_steps.length === closure.rx2_first_lane.length, 'CLI plan step count mismatch');
  for (const step of cliPlan.ordered_steps) {
    assert(step.execution_authorized === false, `${step.candidate_id} command must not be executable yet`);
    assert(/^node build-scripts\/references\/unit-add\.js --spec /.test(step.command_template), `${step.candidate_id} command template must use unit-add.js`);
  }

  for (const relPath of [
    'reports/review-gates/GATE-RX2-first-lane-mutation-review/review-packet.md',
    'reports/review-gates/GATE-RX2-first-lane-mutation-review/candidate-specs.md',
    'reports/review-gates/GATE-RX2-first-lane-mutation-review/cli-mutation-plan.md',
  ]) {
    exists(relPath);
  }

  console.log(`OK RX.2 first-lane review: ${specs.candidates.length} candidates, mutation_authorized=false`);
}

if (require.main === module) main();
