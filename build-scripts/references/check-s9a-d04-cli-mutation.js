#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Update REPLACEMENTS only if a later human gate changes the CP-5 D04
 *   successor mapping.
 * - Keep this checker read-only. It verifies that D04 retirement was applied
 *   through the lifecycle CLI and that active D04 source dependencies were
 *   removed without creating a prerequisite edge or product-use authorization.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GATE_DIR = path.join(REPO_ROOT, 'reports', 'review-gates', 'GATE-CP5-D04-resolution');
const REPLACEMENTS = ['A15', 'D06', 'A17', 'D11', 'A16', 'D12', 'D27'];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function fail(message) {
  console.error(`S9a D04 mutation check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function sameArray(actual, expected) {
  return JSON.stringify(actual || []) === JSON.stringify(expected || []);
}

function targetExerciseItems(data) {
  return Array.isArray(data) ? data : data.exercises || [];
}

function questions(data) {
  return Array.isArray(data) ? data : data.questions || [];
}

function main() {
  for (const relPath of [
    'reports/review-gates/GATE-CP5-D04-resolution/S9a-d04-mutation-plan.json',
    'reports/review-gates/GATE-CP5-D04-resolution/S9a-d04-mutation-log.json',
    'reports/review-gates/GATE-CP5-D04-resolution/S9a-stale-reference-audit.json',
  ]) {
    assert(fs.existsSync(repoPath(relPath)), `missing ${relPath}`);
  }

  const gate = readJson('reports/review-gates/GATE-CP5-D04-resolution/gate-closure.json');
  assert(gate.status === 'pass_with_conditions', 'CP-5 gate must be pass_with_conditions');
  assert(gate.closure_confirmed_by_human === true, 'CP-5 closure must be human-confirmed');
  assert(gate.protected_reference_data_changed === false, 'S9 closure must remain decision-only');
  assert((gate.blocked_outcomes || []).includes('No D04 -> A15 prerequisite edge.'), 'CP-5 must block D04 -> A15 edge');

  const plan = readJson('reports/review-gates/GATE-CP5-D04-resolution/S9a-d04-mutation-plan.json');
  assert(plan.selected_cli_path === 'unit-deprecate.js', 'mutation plan must select unit-deprecate.js');
  assert(sameArray(plan.replacement_unit_ids, REPLACEMENTS), 'mutation plan replacement IDs mismatch');

  const log = readJson('reports/review-gates/GATE-CP5-D04-resolution/S9a-d04-mutation-log.json');
  assert(log.status === 'completed', 'mutation log must be completed');
  assert(log.execution_mode === 'CLI-only via build-scripts/references/unit-deprecate.js', 'mutation log execution mode mismatch');
  assert(log.protected_reference_data_changed === true, 'S9a must record protected reference data changed');
  assert(sameArray(log.replacement_unit_ids, REPLACEMENTS), 'mutation log replacement IDs mismatch');
  assert(sameArray(log.applied && log.applied.deprecated_in_favor_of, REPLACEMENTS), 'mutation log applied replacements mismatch');
  assert((log.commands || []).length === 1 && log.commands[0].exit_code === 0, 'mutation command must pass exactly once');

  const units = readJson('references/machine/micro-teaching-units.json');
  const byId = new Map(units.map((unit) => [unit.id, unit]));
  const d04 = byId.get('D04');
  assert(d04, 'D04 must remain present as deprecated record');
  assert(d04.deprecated === true, 'D04 must be deprecated');
  assert(sameArray(d04.deprecated_in_favor_of, REPLACEMENTS), 'D04 deprecated_in_favor_of mismatch');
  assert((d04.needs || []).length === 0, 'D04 must not gain prerequisite needs');
  for (const id of REPLACEMENTS) {
    const unit = byId.get(id);
    assert(unit, `replacement unit ${id} missing`);
    assert(unit.deprecated !== true, `replacement unit ${id} must be live`);
  }
  for (const unit of units) {
    if (unit.id === 'D04') continue;
    if (unit.deprecated === true) continue;
    assert(!(unit.needs || []).includes('D04'), `live unit ${unit.id} must not depend on D04`);
  }

  const targets = targetExerciseItems(readJson('references/authored/course-target-exercises.json'));
  const target = targets.find((item) => item.id === '2.1.3');
  assert(target, 'target exercise 2.1.3 missing');
  assert(!(target.required_skills || []).includes('D04'), 'target exercise 2.1.3 required_skills must not cite D04');
  assert(!(target.new_skills_introduced || []).includes('D04'), 'target exercise 2.1.3 new_skills_introduced must not cite D04');
  for (const id of ['A16', 'A17', 'D11', 'D12', 'D27']) {
    assert((target.required_skills || []).includes(id), `target exercise 2.1.3 must retain successor ${id}`);
  }

  const exams = questions(readJson('references/external/exam-questions.json'));
  const externalD04 = exams.filter((item) => (item.required_skills || item.skill_ids || []).includes('D04'));
  assert(externalD04.length >= 1, 'external D04 citation should remain preserved/read-only');

  const stale = readJson('reports/review-gates/GATE-CP5-D04-resolution/S9a-stale-reference-audit.json');
  assert(stale.status === 'completed', 'stale-reference audit must be completed');
  assert(stale.summary.active_authored_target_exercise_citations === 0, 'stale audit must show zero active authored target citations');
  assert(stale.conclusion.d04_active_target_exercise_dependency_removed === true, 'stale audit must confirm active target cleanup');
  assert(stale.conclusion.d04_prerequisite_edge_added === false, 'stale audit must reject D04 prerequisite edge');
  assert(stale.conclusion.exercise_promotion_authorized === false, 'stale audit must not authorize promotion');

  const qc = readJson('references/data/qc/reference-quality-issues.json');
  const issue = (qc.issues || []).find((item) => item.issue_id === 'R8-QC-007');
  assert(issue && issue.status === 'resolved', 'R8-QC-007 must be resolved after S9a mutation');
  assert(issue.closed_on === '2026-05-16', 'R8-QC-007 closed_on mismatch');

  console.log(`OK S9a D04 CLI mutation: D04 deprecated in favor of ${REPLACEMENTS.join(', ')}`);
}

if (require.main === module) main();
