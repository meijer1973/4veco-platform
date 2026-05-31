#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen');

function fail(message) {
  console.error(`GAME-ARCH-2 evidence check failed: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function assertIncludes(label, content, needles) {
  for (const needle of needles) {
    if (!content.includes(needle)) fail(`${label} must include: ${needle}`);
  }
}

function assertPattern(label, content, pattern, description) {
  if (!pattern.test(content)) fail(`${label} must match ${description}`);
}

const requiredReports = [
  'reports/sprints/GAME-ARCH-2-architecture-map.md',
  'reports/sprints/GAME-ARCH-2-route-api.md',
  'reports/sprints/GAME-ARCH-2-task-shell-api.md',
  'reports/sprints/GAME-ARCH-2-module-boundaries.md',
  'reports/sprints/GAME-ARCH-2-file-disposition.md',
  'reports/sprints/GAME-ARCH-2-state-ownership.md',
  'reports/sprints/GAME-ARCH-2-feedback-ownership.md',
  'reports/sprints/GAME-ARCH-2-target-operation-coverage.md',
  'reports/sprints/GAME-ARCH-2-gate-engine1-checklist.md',
];

for (const report of requiredReports) {
  const content = read(path.join(ROOT, report));
  assertIncludes(report, content, ['GAME-ARCH-2']);
}

const architectureMap = read(path.join(ROOT, 'reports/sprints/GAME-ARCH-2-architecture-map.md'));
assertIncludes('architecture map', architectureMap, [
  'Landing page',
  'shared route panel',
  'shared task shell',
  'short check = advisory local route check',
  'exit ticket = separate target-equivalent proof task',
]);

const routeApi = read(path.join(ROOT, 'reports/sprints/GAME-ARCH-2-route-api.md'));
assertIncludes('route API', routeApi, [
  'Route Request Shape',
  'Route View Shape',
  'targetEquivalentProof',
  'Current implementation evidence',
  'engines/skill-map-engine.js',
]);

const taskApi = read(path.join(ROOT, 'reports/sprints/GAME-ARCH-2-task-shell-api.md'));
assertIncludes('task-shell API', taskApi, [
  'Task Object Shape',
  'Supported Families And Current Proof Status',
  'Feedback Result Shape',
  'Focus And Accessibility Contract',
]);
for (const family of [
  'numeric_input',
  'calculation_work_capture',
  'final_answer_entry',
  'unit_notation_field',
  'table_value_selection',
  'graph_reading',
  'point_placement',
  'graph_construction_substitute',
  'structured_reasoning',
]) {
  assertIncludes('task-shell API', taskApi, [family]);
}

const disposition = read(path.join(ROOT, 'reports/sprints/GAME-ARCH-2-file-disposition.md'));
for (const decision of ['KEEP', 'WRAP', 'DEPRECATE', 'REBUILD']) {
  assertPattern('file disposition', disposition, new RegExp(`\\b${decision}\\b`), `${decision} decision`);
}
for (const file of [
  'engines/skill-map-engine.js',
  'engines/skill-map-route-ui.js',
  'engines/task-shell-engine.js',
  'engines/graphical-engine.js',
  'engines/skilltree-engine.js',
  'engines/reasoning-engine.js',
  'engines/exit-ticket-engine.js',
  'engines/procedure-engine.js',
  'build-scripts/platform/build-landing-page.js',
]) {
  assertIncludes('file disposition', disposition, [file]);
}

const state = read(path.join(ROOT, 'reports/sprints/GAME-ARCH-2-state-ownership.md'));
assertIncludes('state ownership', state, [
  'Route recommendation',
  'Task-shell response state',
  'Advisory short-check result',
  'Target-equivalent checkpoint result',
  'proof.targetEquivalent',
]);

const feedback = read(path.join(ROOT, 'reports/sprints/GAME-ARCH-2-feedback-ownership.md'));
assertIncludes('feedback ownership', feedback, [
  'Canonical Feedback Grammar',
  'Advisory short-check advice',
  'Target-equivalent completion feedback',
  'Current Drift Risks',
]);

const coverage = read(path.join(ROOT, 'reports/sprints/GAME-ARCH-2-target-operation-coverage.md'));
assertIncludes('target-operation coverage', coverage, ['1.1.1', '1.1.2', '1.1.3']);
assertIncludes('target-operation coverage', coverage, [
  'percentage change',
  'axis convention',
  'target-equivalent proof',
]);

const gate = read(path.join(ROOT, 'reports/sprints/GAME-ARCH-2-gate-engine1-checklist.md'));
assertIncludes('GATE-ENGINE-1 checklist', gate, [
  'Live rendered output',
  'Student-path trace',
  'Stop Conditions For GATE-ENGINE-1',
  'Possible Gate Outcomes',
]);

const planReview = read(path.join(ROOT, 'reports/sprints/GAME-ARCH-2-planning-review.md'));
assertIncludes('planning review', planReview, ['PASS WITH FLAGS', 'Dalton']);

const platformRoadmap = read(path.join(ROOT, 'references/reference-team-roadmap.md'));
const lessonRoadmap = read(path.join(LESSON_ROOT, 'lessen-team-roadmap.md'));
for (const [label, content] of [
  ['platform roadmap', platformRoadmap],
  ['lesson roadmap', lessonRoadmap],
]) {
  assertIncludes(label, content, ['GAME-ARCH-2', 'GATE-ENGINE-1']);
  assertPattern(label, content, /live rendered output/i, 'live rendered output gate requirement');
}

const combined = requiredReports.map((report) => read(path.join(ROOT, report))).join('\n');
const forbiddenAuthorityPatterns = [
  /GAME-ARCH-2[^.\n]*(authorizes|grants)[^.\n]*(diagnostics|adaptive routing|mastery|summative|Scale Gate 1|student\/product use)/i,
  /short check = target-equivalent/i,
  /target-equivalent exit ticket = advisory/i,
];
for (const pattern of forbiddenAuthorityPatterns) {
  if (pattern.test(combined)) fail(`forbidden authority pattern found: ${pattern}`);
}

console.log('GAME-ARCH-2 evidence OK');
