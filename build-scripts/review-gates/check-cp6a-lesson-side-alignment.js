#!/usr/bin/env node
/**
 * Validate CP.6a lesson-side alignment artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this validator read-only.
 * - Update expected titles only when a later recorded human decision changes
 *   active-v5 Book 1 sequencing.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const ALIGNMENT_JSON = 'references/data/sprints/CP.6a-lesson-side-alignment.json';
const ALIGNMENT_MD = 'reports/reference-planning/CP.6a-lesson-side-alignment.md';

function fail(message) {
  console.error(`CP.6a alignment check failed: ${message}`);
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

function assertTrue(value, label) {
  if (value !== true) fail(`${label}: expected true, got ${value}`);
}

function assertFalse(value, label) {
  if (value !== false) fail(`${label}: expected false, got ${value}`);
}

function assertIncludes(text, needle, label) {
  if (!text.includes(needle)) fail(`${label}: missing "${needle}"`);
}

const alignment = readJson(ALIGNMENT_JSON);
const markdown = read(ALIGNMENT_MD);

assertEqual(alignment.schema_version, 1, 'schema_version');
assertEqual(alignment.sprint_id, 'CP.6a', 'sprint_id');
assertEqual(alignment.status, 'alignment_plan_ready_no_output_mutation', 'status');
assertEqual(alignment.authority_level, 'non_mutating_lesson_side_alignment_plan', 'authority_level');
assertFalse(alignment.cp6_closed, 'cp6_closed');
assertFalse(alignment.year1_closed, 'year1_closed');
assertFalse(alignment.mismatch_resolved, 'mismatch_resolved');
assertFalse(alignment.protected_reference_data_changed, 'protected_reference_data_changed');
assertFalse(alignment.lesson_output_changed, 'lesson_output_changed');
assertTrue(alignment.no_protected_mutation_authorized, 'no_protected_mutation_authorized');
assertTrue(alignment.no_lesson_output_mutation_authorized, 'no_lesson_output_mutation_authorized');
assertTrue(alignment.no_target_exercise_promotion_authorized, 'no_target_exercise_promotion_authorized');
assertTrue(alignment.no_placeholder_finalization_authorized, 'no_placeholder_finalization_authorized');
assertTrue(alignment.no_unit_minting_authorized, 'no_unit_minting_authorized');

if (!alignment.lesson_surface_state || typeof alignment.lesson_surface_state !== 'object') {
  fail('lesson_surface_state must be present');
}
assertEqual(alignment.lesson_surface_state.state, 'mixed_generated_surfaces', 'lesson_surface_state.state');
assertEqual(
  alignment.lesson_surface_state.chapter_folder_state.paragraph_1_3_2,
  '1.3.2 Kostenstructuren',
  'chapter folder 1.3.2 state'
);
assertEqual(
  alignment.lesson_surface_state.chapter_folder_state.paragraph_1_3_3,
  '1.3.3 Opbrengsten',
  'chapter folder 1.3.3 state'
);
assertEqual(
  alignment.lesson_surface_state.chapter_markdown_state.paragraph_1_3_2_heading,
  '1.3.2 Kostenstructuren',
  'chapter markdown 1.3.2 state'
);
assertEqual(
  alignment.lesson_surface_state.chapter_markdown_state.paragraph_1_3_3_heading,
  '1.3.3 Opbrengsten',
  'chapter markdown 1.3.3 state'
);
assertEqual(
  alignment.lesson_surface_state.aggregate_book_markdown_state.paragraph_1_3_2_heading,
  '1.3.2 Marktevenwicht',
  'aggregate book 1.3.2 state'
);
assertEqual(
  alignment.lesson_surface_state.aggregate_book_markdown_state.paragraph_1_3_3_heading,
  '1.3.3 Verschuivingen en nieuw evenwicht',
  'aggregate book 1.3.3 state'
);
assertEqual(
  alignment.lesson_surface_state.aggregate_book_markdown_state.status,
  'already_v5_titled_but_not_sufficient_for_closure',
  'aggregate book status'
);

if (!Array.isArray(alignment.mismatch_records) || alignment.mismatch_records.length !== 2) {
  fail('mismatch_records must contain exactly two records');
}

const records = new Map(alignment.mismatch_records.map((record) => [record.paragraph_id, record]));
const expected = {
  '1.3.2': {
    active: 'Marktevenwicht',
    current: 'Kostenstructuren',
    fromV4: '1.4.1',
    equivalent: '1.4 Hoofdstuk Marktevenwicht en marginale analyse/1.4.1 Marktevenwicht',
  },
  '1.3.3': {
    active: 'Verschuivingen en nieuw evenwicht',
    current: 'Opbrengsten',
    fromV4: '1.4.2',
    equivalent: '1.4 Hoofdstuk Marktevenwicht en marginale analyse/1.4.2 Verschuivingen',
  },
};

for (const [paragraphId, expectation] of Object.entries(expected)) {
  const record = records.get(paragraphId);
  if (!record) fail(`missing mismatch record ${paragraphId}`);
  assertEqual(record.active_v5_title, expectation.active, `${paragraphId} active title`);
  assertEqual(record.current_lesson_title, expectation.current, `${paragraphId} current lesson title`);
  assertEqual(record.v5_migration_from_v4, expectation.fromV4, `${paragraphId} migrated from v4`);
  assertEqual(record.current_lesson_status, 'wrong_topic_for_active_v5_book1', `${paragraphId} current status`);
  assertEqual(record.current_equivalent_lesson_folder, expectation.equivalent, `${paragraphId} equivalent folder`);
  assertEqual(record.current_equivalent_review_verdict, 'PASS WITH FLAGS', `${paragraphId} review verdict`);
}

if (!Array.isArray(alignment.displaced_topics) || alignment.displaced_topics.length !== 2) {
  fail('displaced_topics must contain exactly two records');
}
const displaced = new Map(alignment.displaced_topics.map((topic) => [topic.current_lesson_paragraph, topic]));
assertEqual(displaced.get('1.3.2').active_v5_destination, '2.1.1', 'Kostenstructuren v5 destination');
assertEqual(displaced.get('1.3.3').active_v5_destination, '2.1.2', 'Opbrengsten v5 destination');

if (!Array.isArray(alignment.adjacent_lesson_evidence) || alignment.adjacent_lesson_evidence.length !== 2) {
  fail('adjacent_lesson_evidence must contain exactly two records');
}
for (const item of alignment.adjacent_lesson_evidence) {
  assertEqual(item.review_verdict, 'PASS WITH FLAGS', `${item.lesson_paragraph} review verdict`);
  if (!Array.isArray(item.known_flags) || item.known_flags.length === 0) {
    fail(`${item.lesson_paragraph} must carry known flags`);
  }
}

if (!Array.isArray(alignment.later_implementation_path) || alignment.later_implementation_path.length < 6) {
  fail('later_implementation_path must include at least six steps');
}

const requiredBlocked = [
  'protected reference mutation',
  'lesson output mutation',
  'target-exercise promotion',
  'placeholder finalization',
  'unit minting',
  'CP-6 closure',
  'Year-1 closure',
  'student diagnostics',
  'adaptive routing',
  'student-facing AI',
  'summative use',
  'PV projection',
];

for (const blocked of requiredBlocked) {
  if (!alignment.blocked_outcomes.includes(blocked)) fail(`blocked_outcomes missing ${blocked}`);
}

assertEqual(alignment.next_operational_sprint, 'CP.6b', 'next operational sprint');

for (const needle of [
  'mismatch not resolved',
  'No protected reference mutation authorized',
  'No lesson output mutation authorized',
  'CP-6 not closed',
  'Year 1 not closed',
  'Mixed Lesson-Surface State',
  'already v5-titled, but not enough to prove validated remediation',
  '1.3.2 Kostenstructuren',
  '1.3.3 Opbrengsten',
  '1.4.1',
  '1.4.2',
  'PASS WITH FLAGS',
  '2.1.1',
  '2.1.2',
  'CP.6b',
]) {
  assertIncludes(markdown, needle, 'alignment markdown');
}

console.log('OK CP.6a lesson-side alignment');
