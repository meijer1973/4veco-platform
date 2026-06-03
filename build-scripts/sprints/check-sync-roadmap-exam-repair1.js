#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PLATFORM_ROADMAP = path.join('references', 'reference-team-roadmap.md');
const LESSON_ROADMAP = path.join('..', '4veco-lessen', 'lessen-team-roadmap.md');

const REQUIRED_REPAIR_SEQUENCE = [
  'SPRINT-PROTOCOL-HARDEN-2',
  'SYNC-ROADMAP-EXAM-REPAIR-1',
  'EXAM-SOURCE-AUTH-1',
  'TASK-CONTEXT-SPEC-1',
  'TASK-CONTEXT-RUNTIME-1',
  'CONTEXT-VISUAL-STD-1',
  'SOURCE-RECONSTRUCT-2-ACTUAL-EXAM',
  'TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM',
  'TASK-INGEST-TRANSFORM-3-TEXTBOOK',
  'GATE-SHARED-TASK-INGEST-REPAIR-1',
];

const OPEN_IMPLEMENTATION_ROWS = [
  'EXAM-SOURCE-AUTH-1',
  'SYNC-TASK-CONTEXT-INGEST-1',
  'TASK-CONTEXT-SPEC-1',
  'TASK-CONTEXT-RUNTIME-1',
  'CONTEXT-VISUAL-STD-1',
  'SOURCE-RECONSTRUCT-2-ACTUAL-EXAM',
  'TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM',
  'TASK-INGEST-TRANSFORM-3-TEXTBOOK',
  'GATE-SHARED-TASK-INGEST-REPAIR-1',
];

const OLD_ACTIVE_ROWS = [
  'SOURCE-RECONSTRUCT-1',
  'TASK-INGEST-TRANSFORM-1',
  'GATE-SHARED-TASK-INGEST-1',
];

function fail(message) {
  console.error(`Roadmap exam repair sync check failed: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseRows(markdown, label) {
  const rows = new Map();
  const allRows = [];
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith('| ')) continue;
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 4) continue;
    const [id, name, completed, state] = cells;
    if (!id || id === 'Sprint' || /^-+$/.test(id)) continue;
    const row = { id, name, completed, state, line };
    allRows.push(row);
    if (!rows.has(id)) rows.set(id, row);
  }
  if (rows.size === 0) fail(`${label} has no parseable roadmap rows`);
  rows.all = allRows;
  return rows;
}

function normalizeStatus(row) {
  const value = String(row.completed || '').replace(/\*/g, '').trim().toLowerCase();
  if (value === 'yes' || /^\d{4}-\d{2}-\d{2}$/.test(value)) return 'closed';
  if (value === 'no') return 'open';
  return 'unknown';
}

function requireRow(rows, id, label) {
  const row = rows.get(id);
  if (!row) fail(`${label} missing active row ${id}`);
  return row;
}

function requireStatus(rows, id, label, expected) {
  const row = requireRow(rows, id, label);
  const actual = normalizeStatus(row);
  if (actual !== expected) {
    fail(`${label} row ${id} must be ${expected}, found ${row.completed}`);
  }
  return row;
}

function requireInOrder(markdown, ids, label) {
  let previousIndex = -1;
  for (const id of ids) {
    const match = markdown.match(new RegExp(`^\\| ${escapeRegex(id)} \\|`, 'm'));
    if (!match || typeof match.index !== 'number') fail(`${label} missing sequence id ${id}`);
    if (match.index <= previousIndex) {
      fail(`${label} repair sequence is out of order at ${id}`);
    }
    previousIndex = match.index;
  }
}

function requireText(row, patterns, label) {
  const text = `${row.name} ${row.state}`.toLowerCase();
  for (const pattern of patterns) {
    if (!text.includes(pattern.toLowerCase())) {
      fail(`${label} row ${row.id} must mention ${pattern}`);
    }
  }
}

function requireNotText(row, pattern, label) {
  const text = `${row.name} ${row.state}`;
  if (text.includes(pattern)) {
    fail(`${label} row ${row.id} must not reference ${pattern}`);
  }
}

function rowsById(rows, id) {
  return rows.all.filter((row) => row.id === id);
}

const platform = read(PLATFORM_ROADMAP);
const lesson = read(LESSON_ROADMAP);
const platformRows = parseRows(platform, 'platform roadmap');
const lessonRows = parseRows(lesson, 'lesson roadmap');

for (const [label, markdown, rows] of [
  ['platform roadmap', platform, platformRows],
  ['lesson roadmap', lesson, lessonRows],
]) {
  requireInOrder(markdown, REQUIRED_REPAIR_SEQUENCE, label);
  requireStatus(rows, 'SPRINT-PROTOCOL-HARDEN-2', label, 'closed');

  const syncStatus = normalizeStatus(requireRow(rows, 'SYNC-ROADMAP-EXAM-REPAIR-1', label));
  if (!['open', 'closed'].includes(syncStatus)) {
    fail(`${label} row SYNC-ROADMAP-EXAM-REPAIR-1 has invalid status`);
  }

  const superseded = requireStatus(rows, 'SYNC-TASK-CONTEXT-INGEST-1', label, 'open');
  requireText(superseded, ['superseded', 'SYNC-ROADMAP-EXAM-REPAIR-1', 'not completed evidence'], label);

  for (const id of OPEN_IMPLEMENTATION_ROWS) {
    requireStatus(rows, id, label, 'open');
  }

  for (const id of OLD_ACTIVE_ROWS) {
    if (rows.has(id)) fail(`${label} still has old active row ${id}`);
  }

  const auth = requireStatus(rows, 'EXAM-SOURCE-AUTH-1', label, 'open');
  requireText(
    auth,
    [
      'external_primary',
      'official exam item id',
      'overlay path',
      'prompt pdf',
      'correction pdf',
      'source material id',
      'answer-model references',
      'official-style',
      'exam-style',
      'local review data',
      'local official-style source',
      'reconstructed local source',
    ],
    label
  );

  for (const id of ['CHECK-SHORT-EXIT-2', 'SCALE-PROOF-3P', 'Scale Gate 1']) {
    const row = requireStatus(rows, id, label, 'open');
    requireText(row, ['GATE-SHARED-TASK-INGEST-REPAIR-1'], label);
    requireNotText(row, 'GATE-SHARED-TASK-INGEST-1', label);
    for (const duplicate of rowsById(rows, id).slice(1)) {
      if (normalizeStatus(duplicate) === 'open') {
        requireText(duplicate, ['GATE-SHARED-TASK-INGEST-REPAIR-1'], label);
        requireNotText(duplicate, 'GATE-SHARED-TASK-INGEST-1', label);
      }
    }
  }

  const gate = requireStatus(rows, 'GATE-SHARED-TASK-INGEST-REPAIR-1', label, 'open');
  requireText(gate, ['external-primary', 'reviewed remote commit', 'no Scale Gate 1'], label);
}

const platformSync = normalizeStatus(requireRow(platformRows, 'SYNC-ROADMAP-EXAM-REPAIR-1', 'platform roadmap'));
const lessonSync = normalizeStatus(requireRow(lessonRows, 'SYNC-ROADMAP-EXAM-REPAIR-1', 'lesson roadmap'));
if (platformSync !== lessonSync) {
  fail(`SYNC-ROADMAP-EXAM-REPAIR-1 status mismatch: platform=${platformSync}, lesson=${lessonSync}`);
}

console.log('OK roadmap exam repair sync: platform and lesson roadmaps agree on repaired source-ingestion authority');
