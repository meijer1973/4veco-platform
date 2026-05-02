#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_PATH = 'reports/json/procedure-visual-coverage.json';
const FORBIDDEN_MACHINE_PV_FILES = [
  'references/machine/procedure-templates.json',
  'references/machine/visual-states.json',
  'references/machine/procedure-visual-vocab.json',
  'references/machine/procedure-visual.json',
];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function fail(message) {
  console.error(`Procedure-Visual coverage check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readJson(relPath) {
  if (!fs.existsSync(repoPath(relPath))) fail(`missing ${relPath}`);
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function main() {
  for (const relPath of FORBIDDEN_MACHINE_PV_FILES) {
    assert(!fs.existsSync(repoPath(relPath)), `forbidden machine PV file exists: ${relPath}`);
  }

  const report = readJson(REPORT_PATH);
  assert(report.status === 'passed', 'coverage report must pass');
  assert(report.policy.diagnostic_only === true, 'PV coverage must be diagnostic only');
  assert(report.policy.curriculum_authority === false, 'PV coverage must not be curriculum authority');
  assert(report.policy.machine_registry_created === false, 'PV coverage must not create machine registry');
  assert(report.policy.student_facing_projection_authorized === false, 'student-facing projection must be blocked');
  assert(report.policy.generator_exposure_authorized === false, 'generator exposure must be blocked');
  assert(report.summary.pv_linked_unit_count >= 6, 'PV coverage must include linked pilot units');
  assert(report.summary.linked_units_with_visual_state_sequence >= 6, 'all linked pilot units should expose visual-state sequence');
  assert(report.summary.linked_units_with_surface_variants >= 6, 'all linked pilot units should expose surface variants');
  assert(report.summary.linked_units_with_game_mapping >= 1, 'PV.4 game mapping proof must be visible');
  assert(report.summary.linked_units_with_answer_model_projection >= 6, 'answer-model step order must be visible');
  assert(report.summary.linked_units_generator_blocked >= 1, 'generator-blocked units must remain visible');
  assert(report.summary.linked_units_publication_allowed === 0, 'no linked PV unit may allow publication');

  const requiredUnits = ['B02', 'A07', 'A61', 'A82', 'A83', 'A84'];
  for (const unitId of requiredUnits) {
    const row = report.linked_unit_coverage.find((item) => item.unit_id === unitId);
    assert(row, `missing linked unit coverage for ${unitId}`);
    assert(row.has_procedure_template === true, `${unitId} must have procedure template`);
    assert(row.has_visual_state_sequence === true, `${unitId} must have visual-state sequence`);
    assert(row.has_surface_variants === true, `${unitId} must have surface variants`);
    assert(row.has_answer_model_projection === true, `${unitId} must have answer-model step order`);
    assert(row.publication_allowed === false, `${unitId} must block publication`);
  }

  const failedChecks = report.checks.filter((check) => check.status !== 'passed');
  assert(failedChecks.length === 0, `failed coverage checks: ${failedChecks.map((check) => check.id).join(', ')}`);

  console.log('OK Procedure-Visual coverage');
}

if (require.main === module) {
  main();
}
