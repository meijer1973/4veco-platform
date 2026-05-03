#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep this checker conservative. PV.7 is a human review gate, not an
 *   automatic promotion mechanism.
 * - If a future gate authorizes promotion, add a separate checker for the
 *   promoted state instead of weakening this one.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const READINESS_JSON = 'reports/json/procedure-visual-machine-promotion-readiness.json';
const REVIEW_PACKET_JSON = 'reports/review-gates/GATE-PV7-machine-promotion-review/review-packet.json';
const REVIEW_PACKET_MD = 'reports/review-gates/GATE-PV7-machine-promotion-review/review-packet.md';
const GATE_READINESS_JSON = 'reports/review-gates/GATE-PV7-machine-promotion-review/promotion-readiness.json';
const GATE_READINESS_MD = 'reports/review-gates/GATE-PV7-machine-promotion-review/promotion-readiness.md';
const FORBIDDEN_MACHINE_PV_FILES = [
  'references/machine/procedure-templates.json',
  'references/machine/visual-states.json',
  'references/machine/procedure-visual-vocab.json',
  'references/machine/procedure-visual.json',
  'references/machine/unit-template-links.json',
];

function fail(message) {
  console.error(`PV.7 machine-promotion review check failed: ${message}`);
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

  const readiness = readJson(READINESS_JSON);
  const gateReadiness = readJson(GATE_READINESS_JSON);
  const packet = readJson(REVIEW_PACKET_JSON);
  assert(exists(REVIEW_PACKET_MD), `missing ${REVIEW_PACKET_MD}`);
  assert(exists(GATE_READINESS_MD), `missing ${GATE_READINESS_MD}`);
  assert(gateReadiness.report_id === readiness.report_id, 'gate-local readiness report mismatch');

  assert(readiness.gate_id === 'GATE-PV7-machine-promotion-review', 'readiness gate_id mismatch');
  assert(readiness.sprint_id === 'PV.7', 'readiness sprint_id mismatch');
  assert(readiness.status === 'promotion_not_ready', 'PV.7 should currently report promotion_not_ready');
  assert(readiness.summary.recommended_decision === 'do_not_promote_yet', 'PV.7 must recommend no promotion yet');
  assert(readiness.summary.machine_registry_created === false, 'PV.7 must not create a machine registry');
  assert(readiness.policy.references_machine_promotion_authorized === false, 'PV.7 must not authorize references/machine promotion');
  assert(readiness.policy.student_facing_projection_authorized === false, 'PV.7 must not authorize student-facing projection');
  assert(readiness.summary.machine_promotion_cli_count === 0, 'PV.7 should detect no PV machine-edit CLI yet');
  assert(readiness.summary.machine_promotion_mutation_log_count === 0, 'PV.7 should detect no PV machine-promotion mutation logs yet');
  assert(readiness.summary.lesson_regression_proof_count < 2, 'PV.7 should detect fewer than two lesson-regression proofs');
  assert(Array.isArray(readiness.summary.blocking_preconditions) && readiness.summary.blocking_preconditions.length > 0, 'PV.7 must list blocking preconditions');
  assert(
    readiness.summary.blocking_preconditions.includes('pv_machine_edit_cli_exists') &&
      readiness.summary.blocking_preconditions.includes('pv_machine_mutation_logs_exist') &&
      readiness.summary.blocking_preconditions.includes('two_lesson_side_regressions_recorded'),
    'PV.7 must block on CLI, mutation logs, and lesson regressions'
  );

  const unitLinks = readiness.candidate_records.find((record) => record.record_class === 'unit_template_links');
  assert(unitLinks && unitLinks.readiness === 'not_ready', 'unit-template links must remain not_ready in PV.7');
  assert(readiness.candidate_records.every((record) => record.current_decision_recommendation === 'Do not promote in PV.7.'), 'all candidate records must remain unpromoted in PV.7');

  assert(packet.gate_id === 'GATE-PV7-machine-promotion-review', 'review packet gate_id mismatch');
  assert(packet.status === 'prepared_for_human_review', 'review packet must be prepared_for_human_review');
  assert(packet.gate_readiness_report === GATE_READINESS_JSON, 'review packet must point to gate-local readiness JSON');
  assert(packet.machine_promotion_authorized_by_packet === false, 'review packet must not authorize promotion');
  assert(Array.isArray(packet.review_questions) && packet.review_questions.length >= 8, 'review packet must include PV7 review questions');
  assert(
    packet.required_conditions_if_passes.some((condition) => /Do not create or edit any references\/machine Procedure-Visual registry/.test(condition)),
    'review packet must preserve references/machine block'
  );
  assert(
    packet.required_conditions_if_passes.some((condition) => /at least two lesson-side PV regression proofs/.test(condition)),
    'review packet must require lesson-side regression proof before reopening promotion'
  );

  console.log('OK PV.7 machine-promotion review readiness');
}

if (require.main === module) main();
