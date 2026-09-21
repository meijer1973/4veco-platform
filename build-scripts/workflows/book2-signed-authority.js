'use strict';

// A finite content successor. Historical owner/integration decisions are never
// rewritten or treated as approval of later text. Review changes to the ledger.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../..');
const LEDGER_PATH = 'references/authored/book2-signed-20260921-authority.json';
const ledger = require(path.join(ROOT, LEDGER_PATH));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const canonicalHash = value => hash(JSON.stringify(value));
const textHash = value => hash(value.replace(/\r\n?/g, '\n'));
const META = 'references/authored/book-outlines/book-2-outline.meta.json';
const REGISTRY = 'references/authored/course-target-exercises.json';
const OUTLINE = 'references/authored/book-outlines/book-2-outline.md';

function matchesMeta(meta) { return canonicalHash(meta) === ledger.meta_sha256; }
function targetSuccessor(id, before, after) {
  return ledger.target_transitions.some(t => t.id === id && t.before === before && t.after === after);
}
function matchesRecords(records, meta) {
  return matchesMeta(meta) && canonicalHash(records) === ledger.book2_records_sha256;
}
function matchesBook12(records) { return canonicalHash(records) === ledger.book12_records_sha256; }
function matchesFile(file, bytes) {
  return ledger.files.some(r => r.path === file && r.after_sha256 === textHash(String(bytes)));
}
function expectedFiles(root = ROOT) {
  const files = {};
  for (const record of ledger.files) {
    const source = execFileSync('git', ['show', `${ledger.baseline_platform_commit}:${record.path}`],
      { cwd: root, encoding: 'utf8', maxBuffer: 20e6 }).replace(/\r\n?/g, '\n');
    if (textHash(source) !== record.before_sha256) throw Error(`Immutable baseline mismatch: ${record.path}`);
    files[record.path] = source;
  }
  const registry = JSON.parse(files[REGISTRY]);
  for (const change of ledger.target_changes) {
    let target = registry.exercises.find(r => r.id === change.id);
    for (const key of change.field.slice(0, -1)) target = target[key];
    const key = change.field.at(-1);
    if (target[key] !== change.before) throw Error(`Target delta precondition: ${change.id}`);
    target[key] = change.after;
  }
  files[REGISTRY] = JSON.stringify(registry, null, 2) + '\n';
  for (const op of ledger.text_changes) {
    if (files[op.file].split(op.before).length !== 2) throw Error(`Text delta precondition: ${op.file}`);
    files[op.file] = files[op.file].replace(op.before, op.after);
  }
  const meta = JSON.parse(files[META]);
  // Only derived currentness is projected. All lifecycle fields, holds and
  // immutable evidence come verbatim from the pinned baseline.
  meta.semantic_authority.sha256 = ledger.outline_semantic_sha256;
  for (const pin of meta.target_registry_pins) {
    pin.target_record_sha256 = canonicalHash(registry.exercises.find(r => r.id === pin.id));
  }
  meta.authority_sources = ledger.projected_authority_sources;
  files[META] = JSON.stringify(meta, null, 2) + '\n';
  for (const record of ledger.files) {
    if (textHash(files[record.path]) !== record.after_sha256) throw Error(`Successor identity mismatch: ${record.path}`);
  }
  if (!matchesMeta(meta) || !matchesRecords(registry.exercises.filter(r => r.module === 2), meta)) {
    throw Error('Derived metadata/package does not match the finite successor');
  }
  return files;
}

function apply(root = ROOT) {
  const files = expectedFiles(root);
  // Validate every precondition before any write, rejecting concurrent edits.
  for (const record of ledger.files) {
    const current = textHash(fs.readFileSync(path.join(root, record.path), 'utf8'));
    if (![record.before_sha256, record.after_sha256].includes(current)) throw Error(`Unlisted current edit: ${record.path}`);
  }
  for (const [file, content] of Object.entries(files)) fs.writeFileSync(path.join(root, file), content);
}
if (require.main === module) {
  if (process.argv.includes('--apply')) apply(); else expectedFiles();
  console.log('PASS bounded Book 2 signed authority successor; historical lifecycle preserved');
}
module.exports = { ledger, META, REGISTRY, OUTLINE, matchesMeta, matchesRecords, matchesBook12, matchesFile, targetSuccessor, expectedFiles, apply };
