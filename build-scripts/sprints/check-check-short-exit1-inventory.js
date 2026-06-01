#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen');
const BOOK_ROOT = path.join(LESSON_ROOT, 'Boek 1 - Grondslagen, vraag en aanbod');
const CHAPTER_ROOT = path.join(BOOK_ROOT, '1.1 Hoofdstuk Economisch denken en rekenen');

function fail(message) {
  console.error(`CHECK-SHORT-EXIT-1 inventory check failed: ${message}`);
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

function findParagraphDir(paragraphId) {
  if (!fs.existsSync(CHAPTER_ROOT)) fail(`missing chapter root: ${CHAPTER_ROOT}`);
  const entry = fs
    .readdirSync(CHAPTER_ROOT, { withFileTypes: true })
    .find((dirent) => dirent.isDirectory() && dirent.name.startsWith(`${paragraphId} `));
  if (!entry) fail(`missing generated paragraph directory for ${paragraphId}`);
  return path.join(CHAPTER_ROOT, entry.name);
}

function findFile(dir, pattern, label) {
  const match = fs.readdirSync(dir).find((file) => pattern.test(file));
  if (!match) fail(`missing ${label} in ${dir}`);
  return path.join(dir, match);
}

function optionalFile(dir, pattern) {
  const match = fs.readdirSync(dir).find((file) => pattern.test(file));
  return match ? path.join(dir, match) : null;
}

function gitStatus(repoCwd, args, label) {
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

const inventoryPath = path.join(ROOT, 'reports', 'json', 'check-short-exit-inventory.json');
const inventoryMdPath = path.join(ROOT, 'reports', 'sprints', 'CHECK-SHORT-EXIT-1-inventory.md');
const targetExercisePath = path.join(ROOT, 'references', 'authored', 'course-target-exercises.json');
const source111Path = path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.1.json');
const source112Path = path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.2.json');
const source113Path = path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.3.json');
const platformRoadmapPath = path.join(ROOT, 'references', 'reference-team-roadmap.md');
const lessonRoadmapPath = path.join(LESSON_ROOT, 'lessen-team-roadmap.md');

const inventory = readJson(inventoryPath);
const inventoryMd = read(inventoryMdPath);
const targetExercises = readJson(targetExercisePath);
const source111 = readJson(source111Path);
const source112 = readJson(source112Path);
const platformRoadmap = read(platformRoadmapPath);
const lessonRoadmap = read(lessonRoadmapPath);

if (inventory.schema_version !== 1) fail('inventory schema_version must be 1');
if (inventory.sprint_id !== 'CHECK-SHORT-EXIT-1') fail('inventory sprint_id mismatch');
if (!Array.isArray(inventory.paragraphs) || inventory.paragraphs.length !== 3) {
  fail('inventory must contain exactly three paragraph rows');
}
if (fs.existsSync(source113Path)) fail('1.1.3 source exit-ticket data must remain absent in this audit');

const byId = Object.fromEntries(inventory.paragraphs.map((row) => [row.paragraph_id, row]));
for (const paragraphId of ['1.1.1', '1.1.2', '1.1.3']) {
  if (!byId[paragraphId]) fail(`inventory missing paragraph ${paragraphId}`);
  requireText(inventoryMd, new RegExp(paragraphId.replace(/\./g, '\\.')), `markdown row for ${paragraphId}`, inventoryMdPath);
  if (!Array.isArray(byId[paragraphId].missing_work) || byId[paragraphId].missing_work.length === 0) {
    fail(`${paragraphId} must list missing_work`);
  }
}

function findTarget(id) {
  let found = null;
  function walk(value) {
    if (found) return;
    if (Array.isArray(value)) return value.forEach(walk);
    if (value && typeof value === 'object') {
      if (value.id === id) {
        found = value;
        return;
      }
      Object.values(value).forEach(walk);
    }
  }
  walk(targetExercises);
  if (!found) fail(`target exercise registry missing ${id}`);
  return found;
}

const target111 = findTarget('1.1.1');
const target112 = findTarget('1.1.2');
const target113 = findTarget('1.1.3');
if (!target111.required_skills.includes('A43')) fail('1.1.1 target exercise must include A43 context');
if (!target112.required_skills.includes('D31')) fail('1.1.2 target exercise must include D31 context');
if (!/price on the vertical axis/i.test(JSON.stringify(target113.target_exercise))) {
  fail('1.1.3 target exercise must include price vertical axis requirement');
}

if (source111.title !== 'Korte check') fail('1.1.1 source must remain Korte check');
if (source111.surface === 'target_equivalent_exit_ticket') fail('1.1.1 must not be target-equivalent source');
if (source111.metadataAlignment?.targetReadinessEvidence !== false) {
  fail('1.1.1 targetReadinessEvidence must remain false');
}
if (source111.targetEquivalent) fail('1.1.1 must not gain targetEquivalent metadata');
if (source112.surface !== 'target_equivalent_exit_ticket') fail('1.1.2 must remain target-equivalent source');
if (source112.metadataAlignment?.targetReadinessEvidence !== true) {
  fail('1.1.2 targetReadinessEvidence must remain true');
}
if (source112.targetEquivalent?.gateApproved !== true) fail('1.1.2 gateApproved must remain true');
if (source112.targetEquivalent?.completionLanguageEligible !== true) {
  fail('1.1.2 completionLanguageEligible must remain true');
}

const row111 = byId['1.1.1'];
if (row111.short_check.status !== 'exists_advisory_only') fail('1.1.1 short_check status mismatch');
if (row111.target_equivalent_exit_ticket.status !== 'missing') fail('1.1.1 exit-ticket status must be missing');
if (row111.short_check.target_readiness_evidence !== false) fail('1.1.1 inventory target readiness must be false');
if (!row111.missing_work.some((item) => /target-equivalent/i.test(item))) {
  fail('1.1.1 missing_work must name target-equivalent work');
}

const row112 = byId['1.1.2'];
if (row112.short_check.status !== 'missing') fail('1.1.2 short_check must be missing');
if (row112.target_equivalent_exit_ticket.status !== 'target_equivalent_approved_local') {
  fail('1.1.2 exit-ticket status mismatch');
}
if (row112.target_equivalent_exit_ticket.target_readiness_evidence !== true) {
  fail('1.1.2 inventory target readiness must be true');
}
if (!row112.target_equivalent_exit_ticket.task_types.includes('calculation_work_capture')) {
  fail('1.1.2 inventory must include calculation_work_capture');
}
if (!row112.target_equivalent_exit_ticket.task_types.includes('structured_short_response')) {
  fail('1.1.2 inventory must include structured_short_response');
}
if (!/eindopgave van deze paragraaf aankunt/.test(row112.target_equivalent_exit_ticket.completion_copy)) {
  fail('1.1.2 inventory must include approved completion copy');
}

const row113 = byId['1.1.3'];
if (row113.short_check.status !== 'missing') fail('1.1.3 short_check must be missing');
if (row113.target_equivalent_exit_ticket.status !== 'missing') fail('1.1.3 exit-ticket must be missing');
if (row113.short_check.landing_visible !== false || row113.target_equivalent_exit_ticket.landing_visible !== false) {
  fail('1.1.3 inventory must record no check landing visibility');
}
if (!row113.missing_work.some((item) => /graph\/table[\s\S]*target-equivalent exit ticket|target-equivalent graph\/table exit ticket/i.test(item))) {
  fail('1.1.3 missing_work must name graph/table exit ticket');
}

const paragraphDirs = {
  '1.1.1': findParagraphDir('1.1.1'),
  '1.1.2': findParagraphDir('1.1.2'),
  '1.1.3': findParagraphDir('1.1.3'),
};

const landing111 = read(path.join(paragraphDirs['1.1.1'], 'index.html'));
const landing112 = read(path.join(paragraphDirs['1.1.2'], 'index.html'));
const landing113 = read(path.join(paragraphDirs['1.1.3'], 'index.html'));
requireText(landing111, /data-section="check"[\s\S]*Korte check/i, '1.1.1 Check landing card', '1.1.1 index.html');
requireText(landing112, /data-section="check"[\s\S]*Exit ticket/i, '1.1.2 Check landing card', '1.1.2 index.html');
rejectText(landing113, /data-section="check"/i, '1.1.3 Check nav/section', '1.1.3 index.html');
rejectText(landing113, /exit-ticket\.html/i, '1.1.3 exit-ticket link', '1.1.3 index.html');

findFile(paragraphDirs['1.1.1'], /exit-ticket\.html$/i, '1.1.1 generated exit-ticket page');
findFile(paragraphDirs['1.1.2'], /exit-ticket\.html$/i, '1.1.2 generated exit-ticket page');
if (optionalFile(paragraphDirs['1.1.3'], /exit-ticket\.html$/i)) {
  fail('1.1.3 generated exit-ticket page must remain absent');
}

const sharedExitTicketDir = path.join(BOOK_ROOT, 'shared', 'exit-ticket');
if (!fs.existsSync(path.join(sharedExitTicketDir, '1.1.1.js'))) fail('missing generated shared 1.1.1 exit-ticket data');
if (!fs.existsSync(path.join(sharedExitTicketDir, '1.1.2.js'))) fail('missing generated shared 1.1.2 exit-ticket data');
if (fs.existsSync(path.join(sharedExitTicketDir, '1.1.3.js'))) fail('generated shared 1.1.3 exit-ticket data must remain absent');

requireText(inventoryMd, /Scale Gate 1 remains blocked/i, 'Scale Gate boundary', inventoryMdPath);
requireText(inventoryMd, /CHECK-SHORT-EXIT-2/i, 'later implementation handoff', inventoryMdPath);
rejectText(inventoryMd, /authorizes implementation|authorizes generated output|authorizes product use/i, 'forbidden authority', inventoryMdPath);

for (const [label, roadmap] of [
  ['platform roadmap', platformRoadmap],
  ['lesson roadmap', lessonRoadmap],
]) {
  requireText(
    roadmap,
    /\|\s*CHECK-SHORT-EXIT-1\s*\|[^\n]*\|\s*(?:yes|\*\*2026-06-01\*\*)\s*\|[^\n]*CLOSED AUDIT\/CONTRACT/i,
    `${label} closed CHECK-SHORT-EXIT-1 row`,
    label
  );
  requireText(
    roadmap,
    /\|\s*STANDARD-EXERCISES-1\s*\|[^\n]*\|\s*no\s*\|/i,
    `${label} open STANDARD-EXERCISES-1 row`,
    label
  );
  rejectText(
    roadmap,
    /open Product Proof Track:\s*(?:\r?\n\s*)?CHECK-SHORT-EXIT-1/i,
    `${label} stale open Product Proof Track starting with CHECK-SHORT-EXIT-1`,
    label
  );
  rejectText(
    roadmap,
    /Complete the Product Proof Track through CHECK-SHORT-EXIT-1/i,
    `${label} stale instruction to complete through CHECK-SHORT-EXIT-1`,
    label
  );
}

gitStatus(
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
  'forbidden platform source/protected surfaces'
);
gitStatus(LESSON_ROOT, ['Boek 1 - Grondslagen, vraag en aanbod'], 'generated Book 1 lesson output');

console.log('CHECK-SHORT-EXIT-1 inventory OK');
