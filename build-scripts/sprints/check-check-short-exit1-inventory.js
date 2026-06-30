#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen');
const BOOK_ROOT = path.join(LESSON_ROOT, 'Boek 1 - Grondslagen, vraag en aanbod');
const CHAPTER_ROOT = path.join(BOOK_ROOT, '1.1 Hoofdstuk Economisch denken en rekenen');
const ExitTicketEngine = require('../../engines/exit-ticket-engine');

const FORBIDDEN_COPY = /doelopgave-niveau|doelopgave op hetzelfde niveau|antwoordvorm aankunt|Je hebt laten zien dat je de eindopgave/i;

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

function sourcePath(paragraphId, kind) {
  return `source-data/book-1/exit-ticket/${paragraphId}-${kind}.json`;
}

const inventoryPath = path.join(ROOT, 'reports', 'json', 'check-short-exit-inventory.json');
const inventoryMdPath = path.join(ROOT, 'reports', 'sprints', 'CHECK-SHORT-EXIT-1-inventory.md');
const inventory = readJson(inventoryPath);
const inventoryMd = read(inventoryMdPath);

if (inventory.schema_version !== 1) fail('inventory schema_version must be 1');
if (inventory.refreshed_by !== 'EXERCISE-WORKFLOW-CHECKER-CLEANUP-1') fail('inventory must record cleanup refresh');
if (inventory.status !== 'current_split_source_inventory_refreshed') fail('inventory status mismatch');
if (!Array.isArray(inventory.paragraphs) || inventory.paragraphs.length !== 3) {
  fail('inventory must contain exactly three paragraph rows');
}

for (const key of Object.keys(inventory.authority || {})) {
  if (inventory.authority[key] !== false) fail(`inventory.authority.${key} must be false`);
}

const byId = Object.fromEntries(inventory.paragraphs.map((row) => [row.paragraph_id, row]));
for (const paragraphId of ['1.1.1', '1.1.2', '1.1.3']) {
  const row = byId[paragraphId];
  if (!row) fail(`inventory missing paragraph ${paragraphId}`);
  if (fs.existsSync(path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', `${paragraphId}.json`))) {
    fail(`legacy unsuffixed source must remain absent for ${paragraphId}`);
  }

  const shortRel = sourcePath(paragraphId, 'korte-check');
  const exitRel = sourcePath(paragraphId, 'exit-ticket');
  if (row.short_check.source_path !== shortRel) fail(`${paragraphId} short check source_path mismatch`);
  if (row.target_equivalent_exit_ticket.source_path !== exitRel) fail(`${paragraphId} exit ticket source_path mismatch`);

  const shortData = readJson(path.join(ROOT, shortRel));
  const exitData = readJson(path.join(ROOT, exitRel));
  if (!ExitTicketEngine.validateData(shortData)) fail(`${shortRel} does not validate`);
  if (!ExitTicketEngine.validateData(exitData)) fail(`${exitRel} does not validate`);

  if (shortData.surface !== 'advisory_short_check') fail(`${shortRel} must remain advisory_short_check`);
  if (shortData.metadataAlignment.targetReadinessEvidence !== false) fail(`${shortRel} targetReadinessEvidence must be false`);
  if (shortData.targetEquivalent?.completionLanguageEligible !== false) fail(`${shortRel} completion language must remain false`);
  if (exitData.surface !== 'target_equivalent_exit_ticket') fail(`${exitRel} must remain target_equivalent_exit_ticket`);
  if (exitData.metadataAlignment.targetReadinessEvidence !== true) fail(`${exitRel} targetReadinessEvidence must be true`);
  if (exitData.targetEquivalent?.gateApproved !== true) fail(`${exitRel} gateApproved must remain true`);
  if (exitData.targetEquivalent?.completionLanguageEligible !== false) fail(`${exitRel} completion language must remain false`);
  rejectText(JSON.stringify(shortData), FORBIDDEN_COPY, 'forbidden completion/readiness language', shortRel);
  rejectText(JSON.stringify(exitData), FORBIDDEN_COPY, 'forbidden completion/readiness language', exitRel);

  if (row.short_check.status !== 'exists_advisory_only') fail(`${paragraphId} short_check status mismatch`);
  if (row.short_check.target_readiness_evidence !== false) fail(`${paragraphId} short_check target readiness must be false`);
  if (row.short_check.completion_language_eligible !== false) fail(`${paragraphId} short_check completion language must be false`);
  if (row.target_equivalent_exit_ticket.status !== 'target_equivalent_gate_approved_completion_held') {
    fail(`${paragraphId} exit-ticket status mismatch`);
  }
  if (row.target_equivalent_exit_ticket.target_readiness_evidence !== true) fail(`${paragraphId} exit-ticket target readiness must be true`);
  if (row.target_equivalent_exit_ticket.gate_approved !== true) fail(`${paragraphId} exit-ticket gate approval must be true`);
  if (row.target_equivalent_exit_ticket.completion_language_eligible !== false) fail(`${paragraphId} exit-ticket completion language must be false`);

  const paragraphDir = findParagraphDir(paragraphId);
  const landing = read(path.join(paragraphDir, 'index.html'));
  const shortPage = read(findFile(paragraphDir, /korte-check\.html$/i, `${paragraphId} short-check page`));
  const exitPage = read(findFile(paragraphDir, /exit-ticket\.html$/i, `${paragraphId} exit-ticket page`));
  requireText(landing, /Korte check/, `${paragraphId} Korte check landing card`, `${paragraphId} index.html`);
  requireText(landing, /Exit ticket/, `${paragraphId} Exit ticket landing card`, `${paragraphId} index.html`);
  requireText(landing, /Maak de aparte eindcontrole wanneer je de paragraaf hebt geoefend\./, `${paragraphId} neutral row copy`, `${paragraphId} index.html`);
  requireText(landing, /Werk de eindcontrole uit en gebruik de feedback om je volgende oefenstap te kiezen\./, `${paragraphId} neutral tile copy`, `${paragraphId} index.html`);
  rejectText(landing, FORBIDDEN_COPY, 'forbidden completion/readiness language', `${paragraphId} index.html`);
  rejectText(shortPage, FORBIDDEN_COPY, 'forbidden completion/readiness language', `${paragraphId} short page`);
  rejectText(exitPage, FORBIDDEN_COPY, 'forbidden completion/readiness language', `${paragraphId} exit page`);

  const sharedShort = path.join(BOOK_ROOT, 'shared', 'exit-ticket', `${paragraphId}-korte-check.js`);
  const sharedExit = path.join(BOOK_ROOT, 'shared', 'exit-ticket', `${paragraphId}-exit-ticket.js`);
  if (!fs.existsSync(sharedShort)) fail(`missing generated shared short check: ${sharedShort}`);
  if (!fs.existsSync(sharedExit)) fail(`missing generated shared exit ticket: ${sharedExit}`);
  if (fs.existsSync(path.join(BOOK_ROOT, 'shared', 'exit-ticket', `${paragraphId}.js`))) {
    fail(`legacy unsuffixed generated data must remain absent for ${paragraphId}`);
  }
}

requireText(inventoryMd, /Status: audit\/contract only/i, 'historical inventory status', inventoryMdPath);
requireText(inventoryMd, /Scale Gate 1 remains blocked/i, 'historical Scale Gate boundary', inventoryMdPath);
rejectText(inventoryMd, /authorizes implementation|authorizes generated output|authorizes product use/i, 'forbidden authority', inventoryMdPath);

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
