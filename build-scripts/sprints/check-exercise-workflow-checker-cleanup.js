#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  ROOT,
  classifyGeneratedLessonSharedPath,
  currentSourcePaths,
  currentLessonPaths,
  currentValidators,
  loadExerciseSurfaceManifest,
  normalizePath,
  supersededValidators,
} = require('../lib/exercise-currentness');

const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen');
const BOOK_ROOT = path.join(LESSON_ROOT, 'Boek 1 - Grondslagen, vraag en aanbod');
const manifest = loadExerciseSurfaceManifest();

function fail(message) {
  console.error(`EXERCISE-WORKFLOW-CURRENTNESS check failed: ${message}`);
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

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function listJsonFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listJsonFiles(fullPath);
    return entry.isFile() && entry.name.endsWith('.json') ? [fullPath] : [];
  });
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

function assertClassifier(input, expectedCategory, expectedCurrent, expectedLegacy) {
  const result = classifyGeneratedLessonSharedPath(input);
  if (
    result.category !== expectedCategory ||
    result.current !== expectedCurrent ||
    result.legacy !== expectedLegacy
  ) {
    fail(
      `path classifier mismatch for ${input}: expected ${expectedCategory}/${expectedCurrent}/${expectedLegacy}, got ${JSON.stringify(result)}`
    );
  }
}

function assertHistoricalCheckerFailsClosed(validator) {
  const result = spawnSync(process.execPath, [path.resolve(ROOT, validator.path)], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  const output = `${result.stdout || ''}\n${result.stderr || ''}`;
  if (result.status === 0) fail(`${validator.path} must fail closed when invoked as an active validator`);
  if (!/historical|superseded/i.test(output)) {
    fail(`${validator.path} fail-closed output must mention historical/superseded status`);
  }
}

function checkManifest() {
  if (manifest.schema_version !== 1) fail('manifest schema_version must be 1');
  if (manifest.status !== 'current') fail('manifest status must be current');
  for (const surface of manifest.surfaces || []) {
    if (!surface.id || !surface.scope || !surface.surface) fail('manifest surface missing id/scope/surface');
    if (surface.scope === 'same_copy_hygiene' && surface.gate_claim !== false) {
      fail(`${surface.id} same-copy hygiene surface must not be a gate claim`);
    }
    if (surface.current === true && surface.legacy_unsuffixed_allowed !== false) {
      fail(`${surface.id} current surface must reject legacy unsuffixed paths`);
    }
    if (surface.completion_language_eligible === true) {
      fail(`${surface.id} must not record completion_language_eligible true in currentness manifest`);
    }
  }
}

function checkCurrentPaths() {
  for (const file of currentSourcePaths(manifest)) {
    if (!exists(file)) fail(`current split source file missing: ${file}`);
  }
  for (const file of currentLessonPaths(manifest)) {
    if (!exists(file, BOOK_ROOT)) fail(`current lesson file missing: ${file}`);
  }
  for (const file of manifest.legacy_unsuffixed_platform_paths || []) {
    if (exists(file)) fail(`legacy unsuffixed platform source exists: ${file}`);
  }
  for (const file of manifest.legacy_unsuffixed_lesson_paths || []) {
    if (exists(file, BOOK_ROOT)) fail(`legacy unsuffixed lesson output exists: ${file}`);
  }
}

function checkActiveEvidence() {
  const legacyEvidencePattern =
    /source-data\/book-1\/exit-ticket\/1\.1\.[123]\.json|shared\/exit-ticket\/1\.1\.[123]\.js/;
  for (const file of manifest.active_evidence_files || []) {
    const content = read(file);
    if (legacyEvidencePattern.test(content)) {
      fail(`${file} still cites legacy unsuffixed source/generated path as active evidence`);
    }
    if (/completionLanguageEligible"?\s*:\s*true/.test(content)) {
      fail(`${file} must not record active completionLanguageEligible true`);
    }
  }
}

function checkSprintMetadataCurrentness() {
  const legacyEvidencePattern =
    /source-data\/book-1\/exit-ticket\/1\.1\.[123]\.json|shared\/exit-ticket\/1\.1\.[123]\.js/;
  const sprintDir = path.join(ROOT, 'references', 'data', 'sprints');
  const allowed = new Set(manifest.metadata_currentness.allowed_legacy_statuses || []);
  for (const filePath of listJsonFiles(sprintDir)) {
    const relative = normalizePath(path.relative(ROOT, filePath));
    const content = fs.readFileSync(filePath, 'utf8');
    if (!legacyEvidencePattern.test(content)) continue;
    const record = JSON.parse(content);
    if (!allowed.has(record.evidence_status)) {
      fail(`${relative} cites legacy exit-ticket path without historical/superseded evidence_status`);
    }
    if (record.active_for_ci !== false || record.active_for_agent_routing !== false) {
      fail(`${relative} legacy-path metadata must set active_for_ci:false and active_for_agent_routing:false`);
    }
  }
}

function checkValidatorRegistry() {
  const packageJson = read('package.json');
  const ciWorkflow = read('.github/workflows/platform-ci.yml');
  for (const validator of [...currentValidators(manifest), ...supersededValidators(manifest)]) {
    if (!exists(validator.path)) fail(`validator registry path missing: ${validator.path}`);
  }

  const legacyCheckerPattern = /exit-ticket.*1\.1\.[123]\.(?:json|js)|1\.1\.[123]\.(?:json|js).*exit-ticket/;
  for (const validator of currentValidators(manifest)) {
    const lines = read(validator.path).split(/\r?\n/);
    lines.forEach((line, index) => {
      if (legacyCheckerPattern.test(line) && !/legacy|unsuffixed/i.test(line)) {
        fail(`${validator.path}:${index + 1} cites legacy unsuffixed path without an explicit legacy/unsuffixed guard`);
      }
    });
  }

  for (const validator of supersededValidators(manifest)) {
    const content = read(validator.path);
    if (!/guardHistoricalChecker/.test(content)) {
      fail(`${validator.path} must use guardHistoricalChecker`);
    }
    assertHistoricalCheckerFailsClosed(validator);
    const scriptName = path.basename(validator.path);
    if (packageJson.includes(scriptName) || ciWorkflow.includes(scriptName)) {
      fail(`${validator.path} must not be referenced by package.json or platform CI as active`);
    }
  }
}

function checkPathClassifier() {
  assertClassifier('shared/exit-ticket/1.1.2.js', 'legacy_exit_ticket_unsuffixed', false, true);
  assertClassifier('shared/exit-ticket/1.1.2-exit-ticket.js', 'current_exit_ticket', true, false);
  assertClassifier('shared/exit-ticket/1.1.2-korte-check.js', 'current_short_check', true, false);
  assertClassifier('shared/procedure/1.1.2.js', 'current_procedure', true, false);
  assertClassifier('shared/reasoning/1.1.2.js', 'current_reasoning', true, false);
  assertClassifier('shared/skilltree/1.1.2.js', 'current_skilltree', true, false);
  assertClassifier('shared/newsdetective/1.1.2.js', 'current_newsdetective', true, false);
}

function checkCiWiring() {
  const packageJson = readJson('package.json');
  if (
    packageJson.scripts['check:exercise-workflow-currentness'] !==
    'node build-scripts/sprints/check-exercise-workflow-checker-cleanup.js'
  ) {
    fail('package.json must define check:exercise-workflow-currentness');
  }
  const ciWorkflow = read('.github/workflows/platform-ci.yml');
  if (!ciWorkflow.includes('npm run check:exercise-workflow-currentness')) {
    fail('platform CI must run check:exercise-workflow-currentness');
  }
}

checkManifest();
checkCurrentPaths();
checkActiveEvidence();
checkSprintMetadataCurrentness();
checkValidatorRegistry();
checkPathClassifier();
checkCiWiring();

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

console.log('OK EXERCISE-WORKFLOW-CURRENTNESS stale-path/currentness sweep');
