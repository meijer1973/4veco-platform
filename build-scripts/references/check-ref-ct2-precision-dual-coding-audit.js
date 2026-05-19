#!/usr/bin/env node
/**
 * Validate REF-CT2 precision and dual-coding audit artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this validator read-only.
 * - Update expected counts only when the governing sprint plan changes the
 *   active source baseline and records the reason.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const AUDIT_JSON = 'references/data/sprints/REF-CT2-precision-dual-coding-audit.json';
const AUDIT_REPORT = 'reports/reference-planning/REF-CT2-precision-dual-coding-audit.md';
const EVIDENCE_REPORT = 'reports/reference-planning/REF-CT2-graph-visual-surface-evidence.md';
const CP6_REPORT = 'reports/reference-planning/REF-CT2-cp6-status-update.md';

function fail(message) {
  console.error(`REF-CT2 audit check failed: ${message}`);
  process.exit(1);
}

function read(relPath) {
  const file = path.join(ROOT, relPath);
  if (!fs.existsSync(file)) fail(`missing file: ${relPath}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(relPath) {
  try {
    return JSON.parse(read(relPath));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) fail(`${label}: expected ${expected}, got ${actual}`);
}

function assertIncludes(text, needle, label) {
  if (!text.includes(needle)) fail(`${label}: missing "${needle}"`);
}

const audit = readJson(AUDIT_JSON);
const auditReport = read(AUDIT_REPORT);
const evidenceReport = read(EVIDENCE_REPORT);
const cp6Report = read(CP6_REPORT);

assertEqual(audit.schema_version, 1, 'schema_version');
assertEqual(audit.sprint_id, 'REF-CT2', 'sprint_id');
assertEqual(audit.authority_level, 'non_mutating_precision_dual_coding_audit', 'authority_level');
assertEqual(audit.protected_reference_data_changed, false, 'protected_reference_data_changed');
assertEqual(audit.lesson_output_changed, false, 'lesson_output_changed');
assertEqual(audit.no_cli_mutation_authorized, true, 'no_cli_mutation_authorized');
assertEqual(audit.no_cp6_closure_authorized, true, 'no_cp6_closure_authorized');

assertEqual(audit.summary.active_v5_paragraph_count, 12, 'active v5 paragraph count');
assertEqual(audit.summary.placeholder_count, 3, 'placeholder count');
assertEqual(audit.summary.source_lesson_mismatch_count, 2, 'source/lesson mismatch count');
assertEqual(audit.summary.l16r_pending_count, 0, 'L1.6R pending count');
assertEqual(audit.summary.l16r_pass_with_flags_count, 1, 'L1.6R pass-with-flags count');
assertEqual(audit.summary.cp6_quality_ready_count, 0, 'CP-6 quality-ready count');

if (!Array.isArray(audit.records) || audit.records.length !== 12) fail('records must contain exactly 12 rows');
for (const id of ['1.1.1', '1.1.2', '1.1.3', '1.1.4', '1.2.1', '1.2.2', '1.2.3', '1.2.4', '1.3.1', '1.3.2', '1.3.3', '1.3.4']) {
  if (!audit.records.some((record) => record.paragraph_id === id)) fail(`missing ${id}`);
}

const l113 = audit.records.find((record) => record.paragraph_id === '1.1.3');
if (!l113) fail('missing 1.1.3');
if (l113.l16r_status !== 'pass_with_flags') {
  fail('1.1.3 must preserve current L1.6R pass_with_flags status');
}
if (l113.dual_coding_status !== 'blocked_existing_quality_flag') {
  fail('1.1.3 must remain blocked by existing quality flag');
}
if (l113.cp6_quality_ready !== false) fail('1.1.3 must not be CP-6 quality-ready');
if (!l113.blockers.some((blocker) => blocker.includes('FLAG') || blocker.includes('blocker'))) {
  fail('1.1.3 blockers must preserve Part A FLAG/blocker visibility');
}

for (const id of ['1.1.4', '1.2.4', '1.3.4']) {
  const record = audit.records.find((row) => row.paragraph_id === id);
  if (!record.target_exercise_placeholder) fail(`${id} must remain placeholder`);
  if (record.dual_coding_status !== 'not_auditable_placeholder') fail(`${id} placeholder dual-coding status must be not_auditable_placeholder`);
}

for (const id of ['1.3.2', '1.3.3']) {
  const record = audit.records.find((row) => row.paragraph_id === id);
  if (record.source_lesson_alignment !== 'topic_mismatch') fail(`${id} must record topic_mismatch`);
  if (record.dual_coding_status !== 'blocked_source_lesson_mismatch') fail(`${id} dual-coding status must be blocked_source_lesson_mismatch`);
  if (record.cp6_quality_ready !== false) fail(`${id} must not be CP-6 quality-ready`);
}

for (const record of audit.records) {
  if (record.graph_heavy && record.cp6_quality_ready) {
    fail(`${record.paragraph_id} graph-heavy record must not be marked CP-6 quality-ready in REF-CT2`);
  }
  if (record.visual_reasoning_applies && !record.semantic_evidence) {
    fail(`${record.paragraph_id} must include semantic_evidence object`);
  }
}

if (audit.cp6_decision.status !== 'blocked_not_ready_for_closure') {
  fail('CP-6 decision must remain blocked_not_ready_for_closure');
}

for (const text of [auditReport, evidenceReport, cp6Report]) {
  assertIncludes(text, 'No CLI mutation authorized', 'mutation boundary');
}
assertIncludes(auditReport, 'No lesson output mutation authorized', 'lesson mutation boundary');
assertIncludes(evidenceReport, 'L1.6R', 'L1.6R calibration');
assertIncludes(cp6Report, 'CP-6 not closed', 'CP-6 closure boundary');
assertIncludes(cp6Report, 'Year 1 not closed', 'Year-1 closure boundary');

for (const forbidden of ['student diagnostics', 'adaptive routing', 'student-facing AI', 'summative use', 'PV projection']) {
  if (!JSON.stringify(audit.not_allowed_use).includes(forbidden)) {
    fail(`not_allowed_use must include ${forbidden}`);
  }
}

console.log('OK REF-CT2 precision and dual-coding audit');
