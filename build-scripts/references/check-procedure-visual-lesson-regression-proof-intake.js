#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const reportPath = 'reports/json/procedure-visual-lesson-regression-proof-intake.json';
const requirementsPath = 'references/data/procedure-visual/lesson-regression-proof-requirements.json';
const gateDir = 'reports/review-gates/GATE-PV-G4-lesson-regression';
const forbiddenMachineFiles = [
  'references/machine/procedure-templates.json',
  'references/machine/visual-states.json',
  'references/machine/unit-template-links.json',
  'references/machine/procedure-visual-vocab.json',
  'references/machine/procedure-visual.json',
  'references/machine/procedure-visual-unit-template-links.json',
];

function fail(message) {
  console.error(`PV-G4 proof-intake check failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const report = readJson(reportPath);
const requirements = readJson(requirementsPath);
const packet = readJson(path.join(gateDir, 'review-packet.json'));
const template = readJson(path.join(gateDir, 'proof-template.json'));

assert(report.sprint_id === 'PV-G4', 'report must use sprint_id PV-G4');
assert(report.gate_id === 'GATE-PV-G4-lesson-regression', 'report must use PV-G4 gate id');
assert(report.status === 'blocked_pending_lesson_team_evidence', 'report must remain blocked pending lesson-team evidence');
assert(report.required_proof_count === 2, 'report must require two proofs');
assert(report.recorded_proof_count < report.required_proof_count, 'PV-G4 intake should not claim completion without two proofs');
assert(report.policy.references_machine_write_authorized === false, 'machine writes must be blocked');
assert(report.policy.lesson_target_write_authorized_by_references_team === false, 'references-team lesson writes must be blocked');
assert(report.policy.student_facing_projection_authorized === false, 'student-facing PV projection must be blocked');
assert(packet.ready_for_hcs_closure === false, 'review packet must not be ready for closure');
assert(packet.machine_promotion_authorized === false, 'packet must not authorize machine promotion');
assert(packet.student_facing_projection_authorized === false, 'packet must not authorize student-facing projection');

for (const field of requirements.proof_record_required_fields) {
  assert(Object.prototype.hasOwnProperty.call(template, field), `proof template missing required field ${field}`);
}

const foundForbidden = forbiddenMachineFiles.filter((file) => fs.existsSync(file));
assert(foundForbidden.length === 0, `forbidden PV machine files found: ${foundForbidden.join(', ')}`);

for (const file of ['proof-intake.md', 'proof-intake.json', 'proof-template.md', 'proof-template.json', 'review-packet.md', 'review-packet.json']) {
  assert(fs.existsSync(path.join(gateDir, file)), `missing gate artifact ${file}`);
}

console.log('OK PV-G4 proof-intake packet');
