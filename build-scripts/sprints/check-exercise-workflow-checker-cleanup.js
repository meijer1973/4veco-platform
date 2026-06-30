#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen');
const BOOK_ROOT = path.join(LESSON_ROOT, 'Boek 1 - Grondslagen, vraag en aanbod');

const CURRENT_SOURCE_FILES = [
  'source-data/book-1/exit-ticket/1.1.1-korte-check.json',
  'source-data/book-1/exit-ticket/1.1.1-exit-ticket.json',
  'source-data/book-1/exit-ticket/1.1.2-korte-check.json',
  'source-data/book-1/exit-ticket/1.1.2-exit-ticket.json',
  'source-data/book-1/exit-ticket/1.1.3-korte-check.json',
  'source-data/book-1/exit-ticket/1.1.3-exit-ticket.json',
];

const CURRENT_LESSON_FILES = [
  'shared/exit-ticket/1.1.1-korte-check.js',
  'shared/exit-ticket/1.1.1-exit-ticket.js',
  'shared/exit-ticket/1.1.2-korte-check.js',
  'shared/exit-ticket/1.1.2-exit-ticket.js',
  'shared/exit-ticket/1.1.3-korte-check.js',
  'shared/exit-ticket/1.1.3-exit-ticket.js',
];

const LEGACY_PLATFORM_FILES = [
  'source-data/book-1/exit-ticket/1.1.1.json',
  'source-data/book-1/exit-ticket/1.1.2.json',
  'source-data/book-1/exit-ticket/1.1.3.json',
];

const LEGACY_LESSON_FILES = [
  'shared/exit-ticket/1.1.1.js',
  'shared/exit-ticket/1.1.2.js',
  'shared/exit-ticket/1.1.3.js',
];

const ACTIVE_EVIDENCE_FILES = [
  'reports/json/standard-exercise-family-coverage.json',
  'reports/json/check-short-exit-inventory.json',
  'reports/json/procedure-visual-inventory.json',
  'references/data/procedure-visual/inventory.json',
  'reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/review-packet.json',
  'reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/review-packet.md',
  'reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/live-output-evidence.json',
  'reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/live-output-evidence.md',
];

const TARGETED_CHECKER_FILES = [
  'build-scripts/sprints/check-standard-exercises1-coverage.js',
  'build-scripts/sprints/check-task-shell-ux2.js',
  'build-scripts/sprints/check-check-short-exit1-inventory.js',
  'build-scripts/sprints/check-l1-7b-q2-implementation.js',
  'build-scripts/sprints/check-l1-7b-q2-copy.js',
  'build-scripts/sprints/check-l1-7b-q2-d31-struct.js',
  'build-scripts/sprints/check-math-ux2-route-output.js',
  'build-scripts/sprints/check-reason-ux2-route-output.js',
  'build-scripts/review-gates/check-gate-l1-7b-q2-review-packet.js',
];

function fail(message) {
  console.error(`EXERCISE-WORKFLOW-CHECKER-CLEANUP-1 check failed: ${message}`);
  process.exit(1);
}

function exists(file, cwd = ROOT) {
  return fs.existsSync(path.resolve(cwd, file));
}

function read(file) {
  const fullPath = path.resolve(ROOT, file);
  if (!fs.existsSync(fullPath)) fail(`missing file: ${file}`);
  return fs.readFileSync(fullPath, 'utf8');
}

function runGitStatus(repoCwd, args, label) {
  const result = spawnSync('git', ['status', '--porcelain', '--', ...args], {
    cwd: repoCwd,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    fail(`git status failed for ${label}`);
  }
  if (result.stdout.trim()) fail(`${label} has changes:\n${result.stdout.trim()}`);
}

for (const file of CURRENT_SOURCE_FILES) {
  if (!exists(file)) fail(`current split source file missing: ${file}`);
}
for (const file of CURRENT_LESSON_FILES) {
  if (!exists(file, BOOK_ROOT)) fail(`current split lesson file missing: ${file}`);
}
for (const file of LEGACY_PLATFORM_FILES) {
  if (exists(file)) fail(`legacy unsuffixed platform source exists: ${file}`);
}
for (const file of LEGACY_LESSON_FILES) {
  if (exists(file, BOOK_ROOT)) fail(`legacy unsuffixed lesson output exists: ${file}`);
}

const legacyEvidencePattern = /source-data\/book-1\/exit-ticket\/1\.1\.[123]\.json|shared\/exit-ticket\/1\.1\.[123]\.js/;
for (const file of ACTIVE_EVIDENCE_FILES) {
  const content = read(file);
  if (legacyEvidencePattern.test(content)) {
    fail(`${file} still cites legacy unsuffixed source/generated path as active evidence`);
  }
}

const legacyCheckerPattern = /exit-ticket.*1\.1\.[123]\.(?:json|js)|1\.1\.[123]\.(?:json|js).*exit-ticket/;
for (const file of TARGETED_CHECKER_FILES) {
  const lines = read(file).split(/\r?\n/);
  lines.forEach((line, index) => {
    if (legacyCheckerPattern.test(line) && !/legacy|unsuffixed/i.test(line)) {
      fail(`${file}:${index + 1} cites legacy unsuffixed path without an explicit legacy/unsuffixed guard`);
    }
  });
}

for (const file of ACTIVE_EVIDENCE_FILES) {
  if (/completionLanguageEligible"?\s*:\s*true/.test(read(file))) {
    fail(`${file} must not record active completionLanguageEligible true`);
  }
}

runGitStatus(
  ROOT,
  [
    'source-data/book-1/exit-ticket',
    'source-data/book-1/reasoning',
    'engines',
    'references/machine',
    'references/external',
    'references/authored/course-target-exercises.json',
    'references/data/exam-ingestion/answer-skill-candidates.json',
  ],
  'forbidden platform source/engine/protected surfaces'
);
runGitStatus(LESSON_ROOT, ['Boek 1 - Grondslagen, vraag en aanbod'], 'generated Book 1 lesson output');

console.log('OK EXERCISE-WORKFLOW-CHECKER-CLEANUP-1 stale-path sweep');
