#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_PATH = 'reports/json/procedure-visual-projection-mvp.json';

const REQUIRED_RENDERERS = ['formula_trace', 'flowchart', 'table_trace', 'graph_stage'];
const REQUIRED_SURFACES = ['web_light', 'web_dark', 'slide', 'docx'];
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
  console.error(`Procedure-Visual projection MVP check failed: ${message}`);
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
  assert(report.status === 'passed', 'report status must be passed');
  assert(report.policy.machine_registry_created === false, 'machine registry must not be created');
  assert(report.policy.student_facing_projection_authorized === false, 'student-facing PV projection must be blocked');
  assert(report.policy.dynamic_graph_manipulation_authorized === false, 'dynamic graph manipulation must be blocked');
  assert(report.policy.lesson_target_write_authorized === false, 'lesson target writes must be blocked');

  for (const renderer of REQUIRED_RENDERERS) {
    assert(report.summary.renderer_counts[renderer] > 0, `missing renderer coverage for ${renderer}`);
  }
  for (const surface of REQUIRED_SURFACES) {
    assert(report.summary.surface_counts[surface] > 0, `missing surface coverage for ${surface}`);
  }
  assert(report.summary.one_pilot_all_core_surfaces === true, 'one pilot must render all core surfaces');
  assert(report.summary.mapped_procedure_game_pilot_count >= 1, 'mapped procedure-game pilot proof required');
  assert(report.summary.publication_blocked_template_count === report.summary.template_count, 'all templates must block publication');
  assert(report.summary.publication_blocked_visual_state_count === report.summary.visual_state_count, 'all visual states must block publication');

  for (const model of report.template_projection_models) {
    assert(model.answer_model_step_order.length > 0, `${model.template_id} missing answer model step order`);
    assert(model.all_visual_states_rendered === true, `${model.template_id} has unrendered visual states`);
    assert(model.publication_blocked === true, `${model.template_id} must block publication`);
  }

  for (const result of report.render_results) {
    assert(result.status === 'rendered', `${result.visual_state_id}/${result.surface_id} not rendered`);
    assert(result.publication_allowed === false, `${result.visual_state_id}/${result.surface_id} must not allow publication`);
    assert(result.svg_char_count > 200, `${result.visual_state_id}/${result.surface_id} SVG too small`);
    assert(fs.existsSync(repoPath(result.svg_path)), `missing SVG proof ${result.svg_path}`);
    const svg = fs.readFileSync(repoPath(result.svg_path), 'utf8');
    assert(svg.includes('<svg'), `${result.svg_path} missing svg root`);
    assert(svg.includes('role="img"'), `${result.svg_path} missing accessibility role`);
  }

  const failedChecks = report.checks.filter((check) => check.status !== 'passed');
  assert(failedChecks.length === 0, `failed report checks: ${failedChecks.map((check) => check.id).join(', ')}`);

  console.log('OK Procedure-Visual projection MVP');
}

if (require.main === module) {
  main();
}
