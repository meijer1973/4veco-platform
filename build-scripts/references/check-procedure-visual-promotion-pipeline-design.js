#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - This checker proves PV.8 is design-only and keeps promotion blocked.
 * - Add stricter checks here when the pipeline design expands, but do not
 *   allow it to accept references/machine writes in PV.8.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const DESIGN_DATA_PATH = 'references/data/procedure-visual/promotion-pipeline-design.json';
const REPORT_JSON_PATH = 'reports/json/procedure-visual-promotion-pipeline-design.json';
const GATE_PACKET_PATH = 'reports/review-gates/GATE-PV8-promotion-pipeline-design/review-packet.json';
const TECHNICAL_CLOSURE_PATH = 'reports/review-gates/GATE-PV8-promotion-pipeline-design/technical-closure.json';

const FORBIDDEN_MACHINE_PV_FILES = [
  'references/machine/procedure-templates.json',
  'references/machine/visual-states.json',
  'references/machine/unit-template-links.json',
  'references/machine/procedure-visual-vocab.json',
  'references/machine/procedure-visual.json',
];

function fail(message) {
  console.error(`PV.8 promotion-pipeline design check failed: ${message}`);
  process.exit(1);
}

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function exists(relPath) {
  return fs.existsSync(repoPath(relPath));
}

function readJson(relPath) {
  if (!exists(relPath)) fail(`missing ${relPath}`);
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function main() {
  const forbiddenExisting = FORBIDDEN_MACHINE_PV_FILES.filter(exists);
  assert(forbiddenExisting.length === 0, `unexpected PV machine registry file(s): ${forbiddenExisting.join(', ')}`);

  const design = readJson(REPORT_JSON_PATH);
  const dataOverlay = readJson(DESIGN_DATA_PATH);
  const packet = readJson(GATE_PACKET_PATH);
  const closure = readJson(TECHNICAL_CLOSURE_PATH);

  assert(design.registry_id === 'procedure-visual-promotion-pipeline-design', 'design registry_id mismatch');
  assert(dataOverlay.registry_id === design.registry_id, 'data overlay and report mismatch');
  assert(design.status === 'design_only', 'PV.8 design must be design_only');
  assert(design.policy.design_only === true, 'design_only policy must be true');
  assert(design.policy.references_machine_write_authorized === false, 'PV.8 must not authorize references/machine writes');
  assert(design.policy.student_facing_projection_authorized === false, 'PV.8 must not authorize student-facing projection');
  assert(design.source_evidence.pv7_machine_promotion_authorized === false, 'PV.8 must inherit PV.7 no-promotion decision');
  assert(Array.isArray(design.forbidden_machine_files_found) && design.forbidden_machine_files_found.length === 0, 'PV.8 must find no forbidden machine PV files');

  assert(design.first_candidate.record_class === 'unit_template_links', 'first candidate must be unit_template_links');
  assert(design.first_candidate.promotion_status === 'not_authorized_in_pv8', 'first candidate must not be authorized in PV.8');
  assert(design.records_to_keep_as_overlay.some((record) => record.record_class === 'procedure_templates'), 'procedure_templates must remain overlay');
  assert(design.records_to_keep_as_overlay.some((record) => record.record_class === 'visual_states'), 'visual_states must remain overlay');

  assert(Array.isArray(design.proposed_cli_contract) && design.proposed_cli_contract.length >= 3, 'must define proposed plan/promote/rollback CLI contracts');
  for (const command of design.proposed_cli_contract) {
    assert(command.implementation_status === 'proposed_not_implemented', `${command.command_name} must remain proposed_not_implemented`);
  }
  assert(Array.isArray(design.proposed_validators) && design.proposed_validators.length >= 3, 'must define proposed validators');
  for (const validator of design.proposed_validators) {
    assert(validator.implementation_status === 'proposed_not_implemented', `${validator.validator} must remain proposed_not_implemented`);
  }
  assert(design.proposed_mutation_log_schema.required_fields.includes('rollback_instructions'), 'mutation log schema must include rollback_instructions');
  assert(design.future_gate_template.required_questions.length >= 6, 'future gate template must include review questions');
  assert(design.future_promotion_sequence.some((phase) => phase.phase_id === 'PVG4_LESSON_REGRESSION'), 'future sequence must require PV-G4 lesson regression');

  assert(packet.machine_promotion_authorized === false, 'technical packet must not authorize machine promotion');
  assert(closure.status === 'pass_with_conditions', 'technical closure status mismatch');
  assert(closure.machine_promotion_authorized === false, 'technical closure must not authorize promotion');
  assert(closure.protected_reference_data_changed === false, 'technical closure must preserve protected reference data');

  console.log('OK PV.8 promotion-pipeline design');
}

if (require.main === module) main();
