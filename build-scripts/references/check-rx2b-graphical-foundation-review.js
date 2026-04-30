#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep this checker read-only.
 * - RX.2b review may validate coverage, candidate specs, and command
 *   templates, but must not execute unit-add.js or write protected data.
 */

const fs = require('fs');
const path = require('path');
const { validateSpec } = require('./unit-add');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const COVERAGE = 'reports/json/graphical-foundation-coverage.json';
const REVIEW_PACKET = 'reports/review-gates/GATE-RX2b-graphical-foundation/review-packet.json';
const SPECS = 'references/data/sprints/RX.2b-candidate-specs.json';
const CLI_PLAN = 'reports/review-gates/GATE-RX2b-graphical-foundation/cli-mutation-plan.json';
const UNITS = 'references/machine/micro-teaching-units.json';
const RX1_CLOSURE = 'reports/review-gates/GATE-RX1-representation-unit-scope/gate-closure.json';
const RX2_CLOSURE = 'reports/review-gates/GATE-RX2-first-lane-mutation-review/gate-closure.json';

const APPROVED_REVIEW_QUEUE = ['A62', 'A63', 'A64', 'A65', 'A68', 'A69', 'A73'];
const CONDITIONAL_QUEUE = ['A71'];
const FULL_QUEUE = [...APPROVED_REVIEW_QUEUE, ...CONDITIONAL_QUEUE];

function fail(message) {
  console.error(`RX.2b graphical foundation check failed: ${message}`);
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

function sameMembers(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((value, index) => value === b[index]);
}

function includesAllProcedureStandards(spec) {
  const text = (spec.procedure || []).join(' ').toLowerCase();
  return [
    /titel|context/,
    /variabele|assen|as|eenheid/,
    /label|legenda|categorie/,
    /schaal/,
    /lees|aflezen/,
    /schat|exact|interpoleer|interpolatie/,
  ].every((pattern) => pattern.test(text));
}

function main() {
  const rx1Closure = readJson(RX1_CLOSURE);
  const rx2Closure = readJson(RX2_CLOSURE);
  const coverage = readJson(COVERAGE);
  const packet = readJson(REVIEW_PACKET);
  const specs = readJson(SPECS);
  const cliPlan = readJson(CLI_PLAN);
  const units = readJson(UNITS);
  const liveIds = new Set(units.map((unit) => unit.id));
  const postMutationCoverage = coverage.status === 'updated_after_cli_mutation';

  assert(rx1Closure.status === 'pass_with_conditions', 'RX.1 gate must be pass_with_conditions');
  assert(rx2Closure.status === 'pass_with_conditions', 'RX.2 gate must be pass_with_conditions');

  assert(coverage.sprint_id === 'RX.2b', 'coverage sprint_id must be RX.2b');
  assert(
    coverage.status === 'prepared_for_human_review' || coverage.status === 'updated_after_cli_mutation',
    'coverage must be prepared_for_human_review or updated_after_cli_mutation'
  );
  if (!postMutationCoverage) {
    assert(coverage.policy.mutation_authorized === false, 'coverage must not authorize mutation');
    assert(coverage.policy.cli_execution_authorized === false, 'coverage must not authorize CLI execution');
    assert(coverage.policy.protected_reference_data_changed === false, 'coverage must preserve protected_reference_data_changed false');
  } else {
    assert(coverage.policy.protected_reference_data_changed === true, 'post-mutation coverage must record protected_reference_data_changed true');
  }
  assert(Array.isArray(coverage.coverage_rows) && coverage.coverage_rows.length >= 10, 'coverage rows must be present');

  const requiredCoverageStatuses = postMutationCoverage
    ? ['live_unit', 'held_high_risk_unit', 'missing_not_yet_scoped']
    : ['live_unit', 'candidate_unit', 'held_high_risk_unit', 'missing_not_yet_scoped'];
  for (const status of requiredCoverageStatuses) {
    assert(coverage.coverage_rows.some((row) => row.status === status), `coverage must include status ${status}`);
  }
  assert(coverage.coverage_rows.some((row) => row.generator_blocked === true), 'coverage must include generator-blocked live units');

  assert(specs.sprint_id === 'RX.2b', 'specs sprint_id must be RX.2b');
  assert(specs.status === 'prepared_for_mutation_review', 'specs must be prepared_for_mutation_review');
  assert(specs.policy.mutation_authorized === false, 'specs must not authorize mutation');
  assert(specs.policy.cli_execution_authorized === false, 'specs must not authorize CLI execution');
  assert(sameMembers(specs.policy.approved_review_queue, APPROVED_REVIEW_QUEUE), 'approved review queue mismatch');
  assert(sameMembers(specs.policy.conditional_queue, CONDITIONAL_QUEUE), 'conditional queue mismatch');
  assert(Array.isArray(specs.candidates) && specs.candidates.length === FULL_QUEUE.length, 'candidate count mismatch');

  const existingPlusPrior = new Set([...liveIds].filter((id) => !FULL_QUEUE.includes(id)));
  for (const expectedId of FULL_QUEUE) {
    assert(specs.candidates.some((candidate) => candidate.candidate_id === expectedId), `missing candidate ${expectedId}`);
  }

  for (const candidate of specs.candidates) {
    const id = candidate.candidate_id;
    assert(FULL_QUEUE.includes(id), `${id} is outside RX.2b queue`);
    assert(candidate.mutation_authorized === false, `${id} must not authorize mutation`);
    assert(candidate.cli_execution_authorized === false, `${id} must not authorize CLI execution`);
    assert(candidate.live_numbering_status === 'available_at_review_generation', `${id} must be available at review generation`);
    if (postMutationCoverage && APPROVED_REVIEW_QUEUE.includes(id)) {
      assert(liveIds.has(id), `${id} should exist in live catalog after mutation`);
    } else {
      assert(!liveIds.has(id), `${id} already exists in live catalog`);
    }
    assert(candidate.generator_followup_required === true, `${id} generator follow-up must be tracked`);

    const spec = candidate.rx2b_draft_spec;
    const specErrors = validateSpec(spec, existingPlusPrior);
    assert(specErrors.length === 0, `${id} draft spec failed validateSpec: ${specErrors.join('; ')}`);
    assert(Array.isArray(spec.procedure) && spec.procedure.length >= 5, `${id} must have a concrete procedure`);
    assert(Array.isArray(spec.pitfalls) && spec.pitfalls.length >= 1, `${id} must have pitfalls`);
    assert(Array.isArray(candidate.unresolved_needs_in_sequence) && candidate.unresolved_needs_in_sequence.length === 0, `${id} has unresolved needs in sequence`);

    if (['A62', 'A63', 'A64'].includes(id)) {
      assert(includesAllProcedureStandards(spec), `${id} procedure must encode context, labels, units, scale, reading, and exact/estimate/interpolation decisions`);
      assert(spec.zero_needs_status === 'underbouw_assumed', `${id} should record underbouw_assumed zero-needs status`);
    }
    if (id === 'A71') {
      assert(candidate.lane === 'conditional_high_risk', 'A71 must be conditional high risk');
      assert(Array.isArray(spec.review_flags) && spec.review_flags.length > 0, 'A71 must carry a high-risk review flag');
    }

    existingPlusPrior.add(id);
  }

  assert(packet.gate_id === 'GATE-RX2b-graphical-foundation', 'review packet gate_id mismatch');
  assert(packet.status === 'prepared_for_human_review', 'review packet must be prepared_for_human_review');
  assert(packet.mutation_authorized === false, 'review packet must not authorize mutation');
  assert(packet.cli_execution_authorized === false, 'review packet must not authorize CLI execution');
  assert(Array.isArray(packet.review_questions) && packet.review_questions.length === 10, 'review packet must list all 10 review questions');
  for (const artifact of packet.artifacts || []) exists(artifact);

  assert(cliPlan.status === 'draft_pending_human_review', 'CLI plan must be draft_pending_human_review');
  assert(cliPlan.execution_authorized === false, 'CLI plan must not authorize execution');
  assert(cliPlan.mutation_authorized === false, 'CLI plan must not authorize mutation');
  assert(Array.isArray(cliPlan.ordered_steps) && cliPlan.ordered_steps.length === FULL_QUEUE.length, 'CLI plan step count mismatch');
  for (const step of cliPlan.ordered_steps) {
    assert(step.execution_authorized === false, `${step.candidate_id} command must not be executable yet`);
    assert(/^node build-scripts\/references\/unit-add\.js --spec /.test(step.command_template), `${step.candidate_id} command template must use unit-add.js`);
  }

  for (const relPath of [
    'reports/markdown/graphical-foundation-coverage.md',
    'reports/review-gates/GATE-RX2b-graphical-foundation/review-packet.md',
    'reports/review-gates/GATE-RX2b-graphical-foundation/candidate-specs.md',
    'reports/review-gates/GATE-RX2b-graphical-foundation/cli-mutation-plan.md',
  ]) {
    exists(relPath);
  }

  console.log(`OK RX.2b graphical foundation review: ${specs.candidates.length} candidates, mutation_authorized=false`);
}

if (require.main === module) main();
