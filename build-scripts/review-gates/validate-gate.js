#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const VALID_STATUSES = new Set(['pass', 'pass_with_conditions', 'hold', 'fail']);

function fail(message) {
  console.error(`Gate validation failed: ${message}`);
  process.exit(1);
}

const file = process.argv[2];
if (!file) fail('missing gate closure path');
if (!fs.existsSync(file)) fail(`file not found: ${file}`);

let gate;
try {
  gate = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (error) {
  fail(`invalid JSON: ${error.message}`);
}

for (const field of ['gate_id', 'sprint_id', 'status', 'closed_on', 'human_interview', 'review_packet', 'summary']) {
  if (!gate[field]) fail(`missing required field: ${field}`);
}

if (!VALID_STATUSES.has(gate.status)) fail(`invalid status: ${gate.status}`);
if (gate.closure_confirmed_by_human !== true) fail('closure_confirmed_by_human must be true');
if (gate.protected_reference_data_changed !== false) fail('protected_reference_data_changed must be false for gate closure');

for (const relPath of [gate.human_interview, gate.review_packet, gate.audit].filter(Boolean)) {
  if (!fs.existsSync(relPath)) fail(`referenced file does not exist: ${relPath}`);
}

for (const field of ['accepted_outcomes', 'blocked_outcomes', 'explicit_decisions', 'conditions_to_reopen_or_pass']) {
  if (!Array.isArray(gate[field]) || gate[field].length === 0) {
    fail(`${field} must be a non-empty array`);
  }
}

if (gate.status === 'hold') {
  if (!gate.allowed_next_sprint) fail('hold status must declare allowed_next_sprint');
  if (gate.gate_id === 'GATE-R2-empty-needs' && gate.allowed_next_sprint !== 'R2.4') {
    fail('GATE-R2 hold must allow R2.4 as the next sprint');
  }
  if (!Array.isArray(gate.blocked_next_sprints) || !gate.blocked_next_sprints.includes('R3.2')) {
    fail('hold status must block R3.2');
  }
}

console.log(`OK gate closure: ${path.normalize(file)} (${gate.status})`);
