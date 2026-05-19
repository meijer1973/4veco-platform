#!/usr/bin/env node
/**
 * Validate the CP.6a post-handoff lesson-side recheck record.
 *
 * HOW TO ADAPT:
 * - Keep this validator read-only.
 * - Update expected lesson paths only after a later recorded lesson-team
 *   remediation changes the active Book 1 Chapter 1.3 structure again.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen');
const RECHECK_JSON = 'references/data/sprints/CP.6a-lesson-side-recheck.json';
const RECHECK_MD = 'reports/reference-planning/CP.6a-lesson-side-recheck.md';
const ACTIVE_CHAPTER = path.join(
  LESSON_ROOT,
  'Boek 1 - Grondslagen, vraag en aanbod',
  '1.3 Hoofdstuk Aanbod en marktevenwicht'
);
const OLD_CHAPTER = path.join(
  LESSON_ROOT,
  'Boek 1 - Grondslagen, vraag en aanbod',
  '1.3 Hoofdstuk Aanbod en kosten'
);

function fail(message) {
  console.error(`CP.6a lesson-side recheck failed: ${message}`);
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

function assertFalse(value, label) {
  if (value !== false) fail(`${label}: expected false, got ${value}`);
}

function assertTrue(value, label) {
  if (value !== true) fail(`${label}: expected true, got ${value}`);
}

function assertIncludes(text, needle, label) {
  if (!text.includes(needle)) fail(`${label}: missing "${needle}"`);
}

function assertExists(filePath, label) {
  if (!fs.existsSync(filePath)) fail(`missing ${label}: ${filePath}`);
}

function assertNotExists(filePath, label) {
  if (fs.existsSync(filePath)) fail(`${label} must not exist: ${filePath}`);
}

function lessonPath(...parts) {
  return path.join(LESSON_ROOT, ...parts);
}

const recheck = readJson(RECHECK_JSON);
const markdown = read(RECHECK_MD);

assertEqual(recheck.schema_version, 1, 'schema_version');
assertEqual(recheck.record_id, 'CP.6a-lesson-side-recheck', 'record_id');
assertEqual(recheck.status, 'lesson_side_mismatch_fixed_with_carried_conditions', 'status');
assertEqual(recheck.source_sprint, 'CP.6a', 'source_sprint');
assertEqual(recheck.lesson_ticket, 'L-CP6A', 'lesson_ticket');
assertFalse(recheck.cp6_closed, 'cp6_closed');
assertFalse(recheck.year1_closed, 'year1_closed');
assertTrue(recheck.source_lesson_mismatch_resolved_for_cp6a, 'source_lesson_mismatch_resolved_for_cp6a');
assertFalse(recheck.protected_reference_data_changed, 'protected_reference_data_changed');
assertFalse(recheck.target_exercise_promotions, 'target_exercise_promotions');
assertFalse(recheck.placeholder_finalization, 'placeholder_finalization');
assertFalse(recheck.unit_minting, 'unit_minting');
assertEqual(recheck.platform_commit, '6e2c06684e0c9b782cf005027a3b2ef3fd9fd230', 'platform_commit');
assertEqual(recheck.lesson_commit, '1aa63e4f0968c39141c1a04809f6410b5435ee34', 'lesson_commit');

assertExists(ACTIVE_CHAPTER, 'active Chapter 1.3 folder');
assertNotExists(OLD_CHAPTER, 'old stale Chapter 1.3 folder');

const expectedParagraphs = new Map([
  ['1.3.1', 'Aanbod'],
  ['1.3.2', 'Marktevenwicht'],
  ['1.3.3', 'Verschuivingen en nieuw evenwicht'],
  ['1.3.4', 'Gemengde opgaven'],
]);

for (const [id, title] of expectedParagraphs) {
  assertExists(path.join(ACTIVE_CHAPTER, `${id} ${title}`), `${id} ${title}`);
}

for (const stale of ['1.3.2 Kostenstructuren', '1.3.3 Opbrengsten']) {
  assertNotExists(path.join(ACTIVE_CHAPTER, stale), `stale active chapter paragraph ${stale}`);
}

const activeChapterPlan = fs.readFileSync(path.join(ACTIVE_CHAPTER, '_chapter-plan.md'), 'utf8');
for (const needle of [
  '1.3.2 Marktevenwicht',
  '1.3.3 Verschuivingen en nieuw evenwicht',
  'Costs, revenue, break-even, and marginal analysis are not active Book 1 Chapter 1.3 coverage.',
]) {
  assertIncludes(activeChapterPlan, needle, 'active chapter plan');
}

for (const record of recheck.current_lesson_state.paragraphs) {
  if (record.quality_ref) assertExists(path.resolve(ROOT, record.quality_ref), `${record.paragraph_id} quality-ref`);
  if (record.review) assertExists(path.resolve(ROOT, record.review), `${record.paragraph_id} review`);
}

for (const displaced of recheck.current_lesson_state.displaced_material) {
  assertExists(path.resolve(ROOT, displaced.survival_path), `${displaced.old_book1_slot} survival path`);
}

const handoff = fs.readFileSync(path.resolve(ROOT, recheck.evidence_paths.lesson_handoff), 'utf8');
const closure = fs.readFileSync(path.resolve(ROOT, recheck.evidence_paths.lesson_closure_log), 'utf8');
assertIncludes(handoff, 'fixed with carried', 'lesson handoff');
assertIncludes(handoff, 'This handoff does not close CP-6 or Year 1.', 'lesson handoff');
assertIncludes(closure, 'PASS WITH FLAGS', 'lesson closure log');
assertIncludes(closure, 'This fixes the lesson-side CP.6a mismatch', 'lesson closure log');

const commands = new Set(recheck.local_recheck_validation.map((item) => item.command));
for (const expectedCommand of [
  'node scripts/validate-chapter.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht"',
  'node scripts/check-book.js --paragraph-mode part-a --paragraph-profile publisher-print "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"',
  'node scripts/check-book-print-scope.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"',
  'node scripts/check-course-target-exercises-v5.js',
]) {
  if (!commands.has(expectedCommand)) fail(`local_recheck_validation missing ${expectedCommand}`);
}

for (const item of recheck.local_recheck_validation) {
  assertEqual(item.status, 'passed', `${item.command} status`);
}

for (const blocked of [
  'CP-6 closure',
  'Year-1 closure',
  'target-exercise promotion',
  'placeholder finalization',
  'unit minting',
]) {
  if (!recheck.blocked_outcomes.includes(blocked)) fail(`blocked_outcomes missing ${blocked}`);
}

assertEqual(recheck.next_operational_sprint, 'CP.6b', 'next_operational_sprint');

for (const needle of [
  'lesson-side mismatch fixed with carried conditions',
  'CP-6 not closed',
  'Year 1 not closed',
  'Chapter 1.3 validation passed',
  'Book health passed: 26/26',
  'Book print scope passed: 12/12',
  'Proceed to `CP.6b Year-1 Target-Exercise Review`',
]) {
  assertIncludes(markdown, needle, 'recheck markdown');
}

console.log('OK CP.6a lesson-side recheck');
