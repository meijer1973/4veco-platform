#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep this validator read-only. It checks the RX.1 inventory and review
 *   packet but never mutates machine references, external sources, or lesson
 *   targets.
 * - If RX.1 candidate rules change, update both the builder and this checker
 *   together so the review packet stays reproducible.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const INVENTORY_PATH = 'references/data/sprints/RX.1-representation-operation-inventory.json';
const REVIEW_PACKET_PATH = 'reports/review-gates/GATE-RX1-representation-unit-scope/review-packet.json';
const DUPLICATE_REPORT_PATH = 'reports/review-gates/GATE-RX1-representation-unit-scope/duplicate-overlap-report.json';
const MUTATION_QUEUE_PATH = 'reports/review-gates/GATE-RX1-representation-unit-scope/proposed-mutation-queue.json';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';

const ALLOWED_EVIDENCE_TYPES = new Set([
  'target_exercise',
  'exam_question',
  'didactic_prior_rationale',
]);

function fail(message) {
  console.error(`Representation-operation inventory check failed: ${message}`);
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

function fileExists(relPath) {
  assert(fs.existsSync(repoPath(relPath)), `missing ${relPath}`);
}

function main() {
  const inventory = readJson(INVENTORY_PATH);
  const reviewPacket = readJson(REVIEW_PACKET_PATH);
  const duplicateReport = readJson(DUPLICATE_REPORT_PATH);
  const mutationQueue = readJson(MUTATION_QUEUE_PATH);
  const units = readJson(UNITS_PATH);
  const liveUnitIds = new Set(units.map((unit) => unit.id));

  assert(inventory.schema_version === 1, 'inventory schema_version must be 1');
  assert(inventory.sprint_id === 'RX.1', 'inventory sprint_id must be RX.1');
  assert(inventory.status === 'prepared_for_human_review', 'inventory status must be prepared_for_human_review');
  assert(inventory.policy.mutation_authorized === false, 'inventory must not authorize mutation');
  assert(inventory.policy.no_machine_edits === true, 'inventory must preserve no_machine_edits');
  assert(inventory.policy.no_external_edits === true, 'inventory must preserve no_external_edits');
  assert(inventory.policy.no_syllabus_only_candidates === true, 'inventory must reject syllabus-only candidates');
  assert(Array.isArray(inventory.records) && inventory.records.length >= 20, 'inventory records unexpectedly small');

  for (const sourceFile of inventory.source_files || []) {
    fileExists(sourceFile);
  }

  const seenOperationIds = new Set();
  const candidates = [];
  const holds = [];

  for (const record of inventory.records) {
    assert(typeof record.operation_id === 'string' && record.operation_id.length > 0, 'record missing operation_id');
    assert(!seenOperationIds.has(record.operation_id), `duplicate operation_id ${record.operation_id}`);
    seenOperationIds.add(record.operation_id);

    for (const field of ['base_operation', 'representation', 'economic_context', 'source_values_task', 'composition_pattern']) {
      assert(typeof record[field] === 'string' && record[field].length > 0, `${record.operation_id} missing ${field}`);
    }

    assert(Array.isArray(record.evidence_refs) && record.evidence_refs.length > 0, `${record.operation_id} missing evidence_refs`);
    for (const ref of record.evidence_refs) {
      assert(ALLOWED_EVIDENCE_TYPES.has(ref.source_type), `${record.operation_id} has unsupported evidence type ${ref.source_type}`);
      assert(!/syllabus/i.test(ref.source_type), `${record.operation_id} may not use syllabus-only evidence`);
      assert(typeof ref.path === 'string' && ref.path.length > 0, `${record.operation_id} evidence ref missing path`);
      assert(typeof ref.note === 'string' && ref.note.length > 0, `${record.operation_id} evidence ref missing note`);
    }

    assert(record.mutation_authorized === false, `${record.operation_id} must not authorize mutation`);

    if (record.mint_decision === 'candidate_pending_human_review') {
      candidates.push(record);
      assert(/^A\d{2}$/.test(record.candidate_unit_id || ''), `${record.operation_id} candidate must have provisional A-domain id`);
      assert(!liveUnitIds.has(record.candidate_unit_id), `${record.operation_id} candidate id ${record.candidate_unit_id} already exists`);
      assert(record.candidate_id_status === 'provisional_available_at_generation', `${record.operation_id} candidate id status must be provisional`);
      assert(!record.classification.includes('hold'), `${record.operation_id} candidate cannot be classified as hold`);
    } else if (record.mint_decision === 'hold') {
      holds.push(record);
      assert(record.candidate_unit_id === null, `${record.operation_id} hold record must not carry candidate_unit_id`);
      assert(record.duplicate_overlap.verdict !== 'no_direct_duplicate_found_in_current_a_units', `${record.operation_id} hold record must explain overlap`);
    } else {
      fail(`${record.operation_id} has unsupported mint_decision ${record.mint_decision}`);
    }
  }

  assert(candidates.length === mutationQueue.records.length, 'mutation queue candidate count mismatch');
  assert(holds.length === duplicateReport.records.length, 'duplicate report hold count mismatch');
  assert(mutationQueue.mutation_authorized === false, 'mutation queue must not authorize mutation');
  assert(mutationQueue.status === 'proposed_pending_human_review', 'mutation queue status must be proposed_pending_human_review');

  const queuedIds = new Set(mutationQueue.records.map((record) => record.operation_id));
  for (const candidate of candidates) {
    assert(queuedIds.has(candidate.operation_id), `${candidate.operation_id} missing from mutation queue`);
  }
  for (const held of holds) {
    assert(!queuedIds.has(held.operation_id), `${held.operation_id} hold record must not appear in mutation queue`);
  }

  assert(reviewPacket.gate_id === 'GATE-RX1-representation-unit-scope', 'review packet gate_id mismatch');
  assert(reviewPacket.status === 'prepared_for_human_review', 'review packet status must be prepared_for_human_review');
  assert(reviewPacket.review_scope.mutation_authorized === false, 'review packet must not authorize mutation');
  assert(Array.isArray(reviewPacket.review_questions) && reviewPacket.review_questions.length >= 8, 'review packet must list all review questions');

  for (const artifact of reviewPacket.artifacts || []) {
    fileExists(artifact);
  }

  for (const relPath of [
    'reports/markdown/representation-operation-inventory.md',
    'reports/review-gates/GATE-RX1-representation-unit-scope/review-packet.md',
    'reports/review-gates/GATE-RX1-representation-unit-scope/duplicate-overlap-report.md',
    'reports/review-gates/GATE-RX1-representation-unit-scope/proposed-mutation-queue.md',
  ]) {
    fileExists(relPath);
  }

  console.log(`OK representation-operation inventory: ${inventory.records.length} records, ${candidates.length} candidates, ${holds.length} holds`);
}

if (require.main === module) main();
