#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen');

function fail(message) {
  console.error(`GAME-ARCH-1 evidence check failed: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function assertIncludes(file, content, needles) {
  for (const needle of needles) {
    if (!content.includes(needle)) {
      fail(`${file} must include: ${needle}`);
    }
  }
}

function assertPattern(file, content, pattern, label) {
  if (!pattern.test(content)) fail(`${file} must match ${label}`);
}

const requiredReports = [
  'reports/sprints/GAME-ARCH-1-student-path-trace.md',
  'reports/sprints/GAME-ARCH-1-operation-chain-coverage.md',
  'reports/sprints/GAME-ARCH-1-component-decision-matrix.md',
  'reports/sprints/GAME-ARCH-1-canonical-ui-model.md',
  'reports/sprints/GAME-ARCH-1-short-check-exit-ticket-boundary.md',
  'reports/sprints/GAME-ARCH-1-architecture-decision.md',
];

for (const report of requiredReports) {
  const content = read(path.join(ROOT, report));
  assertIncludes(report, content, ['GAME-ARCH-1']);
}

const pathTrace = read(path.join(ROOT, 'reports/sprints/GAME-ARCH-1-student-path-trace.md'));
assertIncludes('student-path trace', pathTrace, ['1.1.1', '1.1.2', '1.1.3', 'task shell']);

const coverage = read(path.join(ROOT, 'reports/sprints/GAME-ARCH-1-operation-chain-coverage.md'));
assertIncludes('operation-chain coverage', coverage, [
  'percentage change',
  'price index',
  'axis convention',
  'target-equivalent proof',
]);

const matrix = read(path.join(ROOT, 'reports/sprints/GAME-ARCH-1-component-decision-matrix.md'));
assertIncludes('component decision matrix', matrix, ['Keep', 'Refactor', 'Rebuild']);
assertPattern('component decision matrix', matrix, /short check/i, 'short-check decision');

const boundary = read(path.join(ROOT, 'reports/sprints/GAME-ARCH-1-short-check-exit-ticket-boundary.md'));
assertIncludes('short-check boundary', boundary, [
  'short check = local advice and route guidance',
  'exit ticket = target-equivalent proof task',
  'no automatic sequencing',
]);

const decision = read(path.join(ROOT, 'reports/sprints/GAME-ARCH-1-architecture-decision.md'));
assertIncludes('architecture decision', decision, ['Proceed to `GAME-ARCH-2`', 'GATE-ENGINE-1']);

const productSpecPath = path.join(LESSON_ROOT, 'specifications/product-end-state.md');
const companionSpecPath = path.join(LESSON_ROOT, 'specifications/companion-core-specifications.md');
const productSpec = read(productSpecPath);
const companionSpec = read(companionSpecPath);
assertIncludes(productSpecPath, productSpec, [
  'advisory short checks',
  'target-equivalent proof task',
  'not a target-equivalent proof',
]);
assertIncludes(companionSpecPath, companionSpec, [
  'Advisory Short-Check Specification',
  'target-equivalent exit ticket',
  'non-binding',
]);

const platformRoadmapPath = path.join(ROOT, 'references/reference-team-roadmap.md');
const lessonRoadmapPath = path.join(LESSON_ROOT, 'lessen-team-roadmap.md');
const platformRoadmap = read(platformRoadmapPath);
const lessonRoadmap = read(lessonRoadmapPath);
for (const [file, content] of [
  [platformRoadmapPath, platformRoadmap],
  [lessonRoadmapPath, lessonRoadmap],
]) {
  assertIncludes(file, content, ['GAME-ARCH-2', 'keep/refactor/rebuild', 'short check']);
  assertPattern(file, content, /GATE-ENGINE-1[\s\S]*live rendered output/i, 'GATE-ENGINE-1 live rendered output requirement');
}

const forbiddenAuthorityPatterns = [
  /GAME-ARCH-1[^.\n]*(authorizes|grants)[^.\n]*(diagnostics|adaptive routing|mastery|summative|Scale Gate 1|student\/product use)/i,
  /short check = target-equivalent/i,
];
const combined = requiredReports.map((report) => read(path.join(ROOT, report))).join('\n');
for (const pattern of forbiddenAuthorityPatterns) {
  if (pattern.test(combined)) fail(`forbidden authority pattern found: ${pattern}`);
}

console.log('GAME-ARCH-1 evidence OK');
