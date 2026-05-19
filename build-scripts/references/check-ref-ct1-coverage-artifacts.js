#!/usr/bin/env node
/**
 * Validate REF-CT1 Year-1 coverage artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this validator read-only.
 * - For a later sprint, update expected counts only after the sprint plan
 *   changes the authoritative source and records why the counts changed.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const COVERAGE_JSON = 'references/data/sprints/REF-CT1-year1-coverage.json';
const COVERAGE_REPORT = 'reports/reference-planning/REF-CT1-year1-coverage.md';
const GAP_REPORT = 'reports/reference-planning/REF-CT1-mtu-gap-classification.md';
const REVIEW_PACKET = 'reports/reference-planning/REF-CT1-cp6-review-packet.md';

function fail(message) {
  console.error(`REF-CT1 coverage check failed: ${message}`);
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

const coverage = readJson(COVERAGE_JSON);
const coverageReport = read(COVERAGE_REPORT);
const gapReport = read(GAP_REPORT);
const reviewPacket = read(REVIEW_PACKET);

assertEqual(coverage.schema_version, 1, 'schema_version');
assertEqual(coverage.sprint_id, 'REF-CT1', 'sprint_id');
assertEqual(coverage.authority_level, 'non_mutating_year1_coverage_baseline', 'authority_level');
assertEqual(coverage.protected_reference_data_changed, false, 'protected_reference_data_changed');
assertEqual(coverage.no_cli_mutation_authorized, true, 'no_cli_mutation_authorized');

if (!coverage.source_paths || coverage.source_paths.targetExercises !== 'references/authored/course-target-exercises.json') {
  fail('source_paths.targetExercises must name the active target-exercise registry');
}
if (coverage.source_paths.blueprint !== 'references/owned/course-blueprint-v5.md') {
  fail('source_paths.blueprint must name active v5');
}
if (coverage.source_paths.ct0Classification !== 'references/data/sprints/REF-CT0-mtu-classification.json') {
  fail('source_paths.ct0Classification must name REF-CT0 classification');
}

assertEqual(coverage.summary.book1_count_bearing_paragraphs, 12, 'Book 1 paragraph count');
assertEqual(coverage.summary.migrated_needs_review_count, 9, 'migrated count');
assertEqual(coverage.summary.placeholder_needs_review_count, 3, 'placeholder count');
assertEqual(coverage.summary.reviewed_final_count, 0, 'reviewed_final count');
assertEqual(coverage.summary.year1_confirmed_unit_count, 19, 'Book 1 confirmed unit count');
assertEqual(coverage.summary.book1_missing_flag_count, 9, 'Book 1 missing flag count');
assertEqual(coverage.summary.placeholder_needs_evidence_count, 3, 'placeholder needs-evidence count');
assertEqual(coverage.summary.final_coverage_claim_count, 0, 'final coverage claim count');

if (!Array.isArray(coverage.paragraphs) || coverage.paragraphs.length !== 12) {
  fail('paragraphs must contain exactly 12 records');
}

const expectedParagraphs = [
  '1.1.1',
  '1.1.2',
  '1.1.3',
  '1.1.4',
  '1.2.1',
  '1.2.2',
  '1.2.3',
  '1.2.4',
  '1.3.1',
  '1.3.2',
  '1.3.3',
  '1.3.4',
];
for (const id of expectedParagraphs) {
  if (!coverage.paragraphs.some((record) => record.paragraph_id === id)) fail(`missing paragraph ${id}`);
}

const placeholderIds = coverage.placeholders.map((record) => record.paragraph_id).sort();
if (placeholderIds.join(',') !== '1.1.4,1.2.4,1.3.4') {
  fail(`unexpected placeholders: ${placeholderIds.join(',')}`);
}
for (const record of coverage.placeholders) {
  if (record.classification !== 'needs_evidence') fail(`${record.paragraph_id} placeholder must be needs_evidence`);
  if (record.may_count_as_final_coverage_claim !== false) {
    fail(`${record.paragraph_id} placeholder may not count as final coverage`);
  }
}

for (const record of coverage.missing_flags) {
  if (record.classification !== 'year_1_backfill_candidate') {
    fail(`${record.record_id} must be a year_1_backfill_candidate`);
  }
}

for (const record of coverage.paragraphs) {
  if (record.record_status === 'placeholder_needs_review' && record.may_count_as_final_coverage_claim !== false) {
    fail(`${record.paragraph_id} placeholder paragraph may not count as final coverage`);
  }
  if (record.coverage_status === 'final_reviewed') {
    fail(`${record.paragraph_id} must not be marked final_reviewed in REF-CT1`);
  }
}

if (coverage.coverage_decision.final_year1_closure_status !== 'blocked_pending_cp6_human_review') {
  fail('Year 1 closure must remain blocked pending CP-6 human review');
}
if (coverage.coverage_decision.cp6_status !== 'review_packet_ready_not_closed') {
  fail('CP-6 must be packet-ready, not closed');
}
if (coverage.coverage_decision.may_mutate_protected_references !== false) {
  fail('protected mutation must not be allowed');
}
if (!coverage.coverage_decision.blockers.some((blocker) => blocker.includes('1.1.3'))) {
  fail('coverage blockers must mention 1.1.3');
}

const l113 = coverage.lesson_evidence.find((record) => record.paragraph_id === '1.1.3');
if (!l113 || l113.present !== true) fail('1.1.3 lesson evidence must be present');
if (l113.partA_verdict !== 'FLAG') fail('1.1.3 Part A verdict must remain FLAG');
if (l113.companion_human_review_status !== 'l16r_visual_remediated_pending_human_review') {
  fail('1.1.3 human review status must remain pending');
}
if (l113.l16r_dual_coding_status !== 'visual_remediated_pending_human_review') {
  fail('1.1.3 L1.6R status must remain pending human review');
}

for (const text of [coverageReport, gapReport, reviewPacket]) {
  assertIncludes(text, 'No CLI mutation authorized', 'report mutation boundary');
  assertIncludes(text, 'placeholder', 'report placeholder visibility');
}
assertIncludes(coverageReport, 'blocked_pending_cp6_human_review', 'coverage report closure status');
assertIncludes(gapReport, 'year_1_backfill_candidate', 'gap report classification');
assertIncludes(reviewPacket, 'CP-6 not closed', 'review packet status');

const serialized = JSON.stringify(coverage);
for (const forbidden of [
  'Year-1 final closure"',
  '"CP-6 closure"',
  '"student diagnostics"',
  '"adaptive routing"',
  '"student-facing AI"',
]) {
  if (!serialized.includes(forbidden)) fail(`not_allowed_use must include ${forbidden}`);
}

console.log('OK REF-CT1 coverage artifacts');
