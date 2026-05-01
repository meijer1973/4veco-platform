#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Update candidate expectations only after a later human gate changes the
 *   RX.3 producer-representation scope.
 * - Keep this checker read-only; RX.3 review preparation does not mutate
 *   references/machine or references/external.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GATE_DIR = 'reports/review-gates/GATE-RX3-producer-representation';
const PACKET_JSON = `${GATE_DIR}/review-packet.json`;
const PACKET_MD = `${GATE_DIR}/review-packet.md`;
const QUEUE_JSON = `${GATE_DIR}/proposed-mutation-queue.json`;
const QUEUE_MD = `${GATE_DIR}/proposed-mutation-queue.md`;
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const RX1_QUEUE_PATH = 'reports/review-gates/GATE-RX1-representation-unit-scope/proposed-mutation-queue.json';
const PVG1_TECHNICAL_CLOSURE = 'reports/review-gates/GATE-PV-G1-schema/technical-closure.json';

const REQUIRED_CANDIDATES = ['A75', 'A76', 'A77', 'A78', 'A79', 'A80', 'A81'];
const FIRST_LANE = ['A75', 'A76', 'A79'];
const GRAPH_LANE = ['A77', 'A78', 'A80', 'A81'];
const REQUIRED_HOLD = 'HOLD_GRAPHICAL_MO_MK_OPTIMUM';

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function fail(message) {
  console.error(`RX.3 producer review check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readJson(relPath) {
  try {
    return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function exists(relPath) {
  return fs.existsSync(repoPath(relPath));
}

function sameArray(actual, expected, label) {
  assert(Array.isArray(actual), `${label} must be an array`);
  assert(actual.length === expected.length, `${label} length mismatch`);
  for (let index = 0; index < expected.length; index += 1) {
    assert(actual[index] === expected[index], `${label}[${index}] expected ${expected[index]}, got ${actual[index]}`);
  }
}

function main() {
  for (const relPath of [PACKET_JSON, PACKET_MD, QUEUE_JSON, QUEUE_MD, UNITS_PATH, RX1_QUEUE_PATH, PVG1_TECHNICAL_CLOSURE]) {
    assert(exists(relPath), `missing ${relPath}`);
  }

  const packet = readJson(PACKET_JSON);
  const queue = readJson(QUEUE_JSON);
  const units = readJson(UNITS_PATH);
  const rx1Queue = readJson(RX1_QUEUE_PATH);
  const pvg1 = readJson(PVG1_TECHNICAL_CLOSURE);
  const unitIds = new Set(units.map((unit) => unit.id));

  assert(packet.gate_id === 'GATE-RX3-producer-representation', 'wrong packet gate_id');
  assert(packet.sprint_id === 'RX.3', 'wrong packet sprint_id');
  assert(packet.status === 'prepared_for_human_review', 'packet must stop at prepared_for_human_review');
  assert(packet.mutation_authorized === false, 'packet must not authorize mutation');
  assert(Array.isArray(packet.review_questions) && packet.review_questions.length >= 8, 'packet must list review questions');

  assert(queue.gate_id === packet.gate_id, 'queue gate_id mismatch');
  assert(queue.sprint_id === 'RX.3', 'queue sprint_id mismatch');
  assert(queue.mutation_authorized === false, 'queue must not authorize mutation');
  sameArray(queue.recommended_lanes.first_mutation_review, FIRST_LANE, 'first mutation lane');
  sameArray(queue.recommended_lanes.graph_lane_review, GRAPH_LANE, 'graph lane');
  assert(queue.recommended_lanes.held_records.includes(REQUIRED_HOLD), 'graphical MO=MK hold must remain blocked');

  const candidateIds = new Set(queue.candidates.map((candidate) => candidate.candidate_unit_id));
  for (const id of REQUIRED_CANDIDATES) {
    assert(candidateIds.has(id), `missing candidate ${id}`);
    assert(!unitIds.has(id), `${id} is already live; RX.3 numbering plan must be revised`);
  }

  for (const dep of ['A04', 'A14', 'A29', 'A45', 'A61', 'A63']) {
    assert(unitIds.has(dep), `required live dependency missing: ${dep}`);
  }

  const rx1CandidateIds = new Set((rx1Queue.records || []).map((record) => record.candidate_unit_id).filter(Boolean));
  for (const id of REQUIRED_CANDIDATES) {
    assert(rx1CandidateIds.has(id), `candidate ${id} must trace back to RX.1 proposed queue`);
  }

  assert(pvg1.status === 'pass', 'PV-G1 technical closure must pass before RX.3 review');
  assert((pvg1.not_authorized || []).includes('PV machine registry promotion'), 'PV-G1 must keep machine promotion blocked');

  const packetMd = fs.readFileSync(repoPath(PACKET_MD), 'utf8');
  for (const question of packet.review_questions) {
    assert(packetMd.includes(question.id), `Markdown packet missing ${question.id}`);
  }
  assert(packetMd.includes('no mutation is authorized'), 'Markdown packet must state that no mutation is authorized');

  const queueMd = fs.readFileSync(repoPath(QUEUE_MD), 'utf8');
  for (const id of REQUIRED_CANDIDATES) {
    assert(queueMd.includes(id), `queue Markdown missing ${id}`);
  }
  assert(queueMd.includes(REQUIRED_HOLD), `queue Markdown missing ${REQUIRED_HOLD}`);

  console.log(`OK RX.3 producer review: ${REQUIRED_CANDIDATES.length} candidates, first lane ${FIRST_LANE.join(', ')}`);
}

if (require.main === module) main();
