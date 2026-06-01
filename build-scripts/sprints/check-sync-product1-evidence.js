#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen');

const PRODUCT_TRACK_SPRINTS = [
  'SYNC-PRODUCT-1',
  'CHECK-SHORT-EXIT-1',
  'STANDARD-EXERCISES-1',
  'TASK-SHELL-UX-2',
  'GAME-ROUTE-AFFORDANCE-1',
  'SKILLMAP-PRODUCT-1',
  'REASON-STD-1',
  'DUAL-CODING-STD-1',
  'ENGINE-UNIFY-1',
  'CHECK-SHORT-EXIT-2',
  'SCALE-PROOF-3P',
  'GATE-PRODUCT-3P',
  'Scale Gate 1',
];

function fail(message) {
  console.error(`SYNC-PRODUCT-1 evidence check failed: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function requireText(content, pattern, label, file) {
  if (!pattern.test(content)) fail(`${file} missing ${label}`);
}

function rejectText(content, pattern, label, file) {
  if (pattern.test(content)) fail(`${file} contains ${label}`);
}

function requireIncludes(content, text, label, file) {
  if (!content.includes(text)) fail(`${file} missing ${label}: ${text}`);
}

function requireAllSprints(content, file) {
  requireIncludes(content, '## Product Proof Track Before Scale Gate 1', 'Product Proof Track section', file);
  for (const sprint of PRODUCT_TRACK_SPRINTS) {
    requireIncludes(content, sprint, `Product Proof Track row for ${sprint}`, file);
  }
}

function requireOrderedProductTrack(content, file) {
  let last = -1;
  for (const sprint of PRODUCT_TRACK_SPRINTS) {
    const index = content.indexOf(`| ${sprint} |`);
    if (index < 0) fail(`${file} missing Product Proof Track table row for ${sprint}`);
    if (index < last) fail(`${file} Product Proof Track row out of order at ${sprint}`);
    last = index;
  }
}

function statusPorcelain(repoCwd, args, label) {
  const result = spawnSync('git', ['status', '--porcelain', '--', ...args], {
    cwd: repoCwd,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    fail(`git status failed for ${label}`);
  }
  const changed = result.stdout.trim();
  if (changed) fail(`${label} has staged, unstaged, or untracked changes:\n${changed}`);
}

const files = {
  productSpec: path.join(LESSON_ROOT, 'specifications', 'product-end-state.md'),
  companionSpec: path.join(LESSON_ROOT, 'specifications', 'companion-core-specifications.md'),
  lessonRoadmap: path.join(LESSON_ROOT, 'lessen-team-roadmap.md'),
  platformRoadmap: path.join(ROOT, 'references', 'reference-team-roadmap.md'),
  roadmapIndexJson: path.join(ROOT, 'docs', 'roadmaps', 'roadmap-version-index.json'),
  roadmapIndexMd: path.join(ROOT, 'docs', 'roadmaps', 'roadmap-version-index.md'),
  planJson: path.join(ROOT, 'references', 'data', 'sprints', 'SYNC-PRODUCT-1.plan.json'),
};

const productSpec = read(files.productSpec);
const companionSpec = read(files.companionSpec);
const lessonRoadmap = read(files.lessonRoadmap);
const platformRoadmap = read(files.platformRoadmap);
const roadmapIndexJson = readJson(files.roadmapIndexJson);
const roadmapIndexMd = read(files.roadmapIndexMd);
const planJson = readJson(files.planJson);

requireAllSprints(platformRoadmap, files.platformRoadmap);
requireAllSprints(lessonRoadmap, files.lessonRoadmap);
requireOrderedProductTrack(platformRoadmap, files.platformRoadmap);
requireOrderedProductTrack(lessonRoadmap, files.lessonRoadmap);

requireText(
  platformRoadmap,
  /Roadmap version:\s*`v3\.39-sync-product1-product-proof-track`/,
  'v3.39 active roadmap version',
  files.platformRoadmap
);
requireText(
  platformRoadmap,
  /Acceptance baseline:[\s\S]*product-end-state\.md[\s\S]*companion-core-specifications\.md/i,
  'stable spec acceptance baseline',
  files.platformRoadmap
);

for (const [label, roadmap, file] of [
  ['platform roadmap', platformRoadmap, files.platformRoadmap],
  ['lesson roadmap', lessonRoadmap, files.lessonRoadmap],
]) {
  requireText(roadmap, /advisory short check/i, `${label} advisory short-check requirement`, file);
  requireText(roadmap, /target-equivalent exit ticket/i, `${label} target-equivalent exit-ticket requirement`, file);
  requireText(roadmap, /shared task(?:-type)? UI|shared task shell/i, `${label} shared task UI`, file);
  requireText(roadmap, /route items?[\s\S]{0,120}actionable/i, `${label} route affordance requirement`, file);
  requireText(roadmap, /skill map[\s\S]{0,120}(student|visible|product surface)/i, `${label} skill-map product surface`, file);
  requireText(roadmap, /dual coding|dual-coding/i, `${label} dual-coding requirement`, file);
  requireText(roadmap, /first three paragraphs|first-three-paragraph|1\.1\.1[\s\S]*1\.1\.2[\s\S]*1\.1\.3/i, `${label} three-paragraph proof`, file);
  requireText(roadmap, /Scale Gate 1[\s\S]{0,600}GATE-PRODUCT-3P|GATE-PRODUCT-3P[\s\S]{0,600}Scale Gate 1/i, `${label} Scale Gate 1 block behind GATE-PRODUCT-3P`, file);
  requireText(roadmap, /Scale Gate 1[\s\S]{0,900}REV-STD-1|REV-STD-1[\s\S]{0,900}Scale Gate 1/i, `${label} Scale Gate 1 block behind REV-STD-1`, file);
  requireText(roadmap, /waiver[\s\S]{0,160}consequences|consequences[\s\S]{0,160}waiver/i, `${label} explicit waiver consequences`, file);
  requireText(roadmap, /no .*generated|No .*generated/i, `${label} no generated-output authority`, file);
  requireText(roadmap, /student-facing AI|student\/product use|product-wide use/i, `${label} product authority blocks`, file);
}

for (const [label, spec, file] of [
  ['product spec', productSpec, files.productSpec],
  ['companion spec', companionSpec, files.companionSpec],
]) {
  requireText(spec, /2026-06-01/, `${label} 2026-06-01 change note`, file);
  requireText(spec, /advisory short check/i, `${label} advisory short-check term`, file);
  requireText(spec, /target-equivalent exit ticket/i, `${label} target-equivalent exit-ticket term`, file);
  requireText(spec, /hidden|clickable|collapsed|collapsible/i, `${label} hidden/clickable hint policy`, file);
  requireText(spec, /learning hints|answer-revealing|hint-heavy/i, `${label} exit-ticket hint restriction`, file);
  requireText(spec, /route items?[\s\S]{0,160}actionable|actionable[\s\S]{0,160}route items?/i, `${label} actionable route items`, file);
  requireText(spec, /skill[- ]map/i, `${label} skill-map term`, file);
  requireText(spec, /student product surface|student-facing product surface|student-facing route product surface/i, `${label} skill-map product surface`, file);
  requireText(spec, /dual[- ]coding/i, `${label} dual-coding standard`, file);
  requireText(spec, /first[- ]three[- ]paragraph|first three paragraphs/i, `${label} first-three-paragraph proof`, file);
}

for (const family of [
  'numeric input',
  'calculation/work capture',
  'final-answer entry',
  'unit/notation',
  'short constructed response',
  'table-value selection',
  'graph reading',
  'point placement',
  'structured reasoning',
  'flow-diagram',
]) {
  requireText(companionSpec, new RegExp(family.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `task family ${family}`, files.companionSpec);
}

if (!Array.isArray(roadmapIndexJson.roadmaps)) fail('roadmap version index JSON must include roadmaps array');
const active = roadmapIndexJson.roadmaps.find((roadmap) => roadmap.status === 'active' && roadmap.path === 'references/reference-team-roadmap.md');
if (!active) fail('roadmap version index JSON missing active reference roadmap');
if (active.version !== 'v3.39-sync-product1-product-proof-track') {
  fail(`roadmap version index active version must be v3.39-sync-product1-product-proof-track, found ${active.version}`);
}
requireText(roadmapIndexMd, /v3\.39-sync-product1-product-proof-track/, 'roadmap index markdown active v3.39 row', files.roadmapIndexMd);
requireText(roadmapIndexMd, /Product Proof Track/i, 'roadmap index markdown Product Proof note', files.roadmapIndexMd);

if (planJson.sprint_id !== 'SYNC-PRODUCT-1') fail('SYNC-PRODUCT-1 plan JSON has wrong sprint_id');
if (planJson.generated_lesson_output_allowed !== false) fail('plan JSON must block generated lesson output');
if (planJson.protected_reference_data_changes_allowed !== false) fail('plan JSON must block protected reference data changes');
for (const forbidden of [
  /No source exit-ticket data writes/i,
  /student-facing AI/i,
  /Scale Gate 1/i,
  /knowledge\/exit-ticket-game-1\.1\.1\.zip/i,
]) {
  if (!planJson.forbidden.some((item) => forbidden.test(item))) {
    fail(`plan JSON forbidden list missing ${forbidden}`);
  }
}

const combined = [productSpec, companionSpec, lessonRoadmap, platformRoadmap, JSON.stringify(planJson)].join('\n');
for (const pattern of [
  /SYNC-PRODUCT-1[\s\S]{0,300}(authorizes|authorized)[\s\S]{0,120}(generated output|implementation|diagnostics|adaptive routing|mastery|student-facing AI|summative|PV projection|Scale Gate 1|product-wide use)/i,
  /short check\s+(is|=)\s+(a\s+)?target-equivalent proof/i,
]) {
  rejectText(combined, pattern, `forbidden weakening pattern ${pattern}`, 'combined SYNC-PRODUCT-1 evidence');
}

statusPorcelain(
  ROOT,
  [
    'references/machine',
    'references/external',
    'references/authored/course-target-exercises.json',
    'references/data/exam-ingestion/answer-skill-candidates.json',
    'source-data/book-1/exit-ticket',
    'source-data/book-1/reasoning',
    'engines',
  ],
  'forbidden platform implementation/source surfaces'
);
statusPorcelain(
  LESSON_ROOT,
  ['Boek 1 - Grondslagen, vraag en aanbod'],
  'generated Book 1 lesson output'
);

console.log('SYNC-PRODUCT-1 evidence OK');
