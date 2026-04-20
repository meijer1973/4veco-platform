#!/usr/bin/env node
/**
 * unresolved-refs.js
 *
 * Scans the source tree for references to unit IDs (the [A-K]\d\d pattern)
 * and flags any that don't resolve to a live entry in the catalog.
 * Deprecated units produce a warning (migration hint), not an error.
 *
 * Exits non-zero on any unresolved reference, so CI fails the build.
 */

const fs = require('fs');
const path = require('path');
const { parseMarkdown } = require('../references/build-unit-index');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const UNITS_MD  = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.md');
const REPORT    = path.join(REPO_ROOT, 'reports/unresolved-refs.md');

// Directories to scan for unit-ID citations.
const SCAN_DIRS = [
  'source-data',
  'knowledge',
  '.claude/plans',
  'skills',
  '.claude/commands',
];

// Paths that are themselves the registry, its tooling, or documentation of
// it — citations here are meta-references (schema illustrations, migration
// mapping tables, generator function names) and not subject to checking.
const EXCLUDE_PATTERNS = [
  /references[\\/]machine[\\/]micro-teaching-units/,
  /build-scripts[\\/]references[\\/]/,
  /engines[\\/]skilltree[\\/]generators\.js/,
  /reports[\\/]/,
  /knowledge[\\/]micro-teaching-units-plan\.md$/,
  /knowledge[\\/]references-migration-plan\.md$/,
];

const ID_PATTERN = /\b[A-K]\d{2}\b/g;

function walk(dir, acc) {
  const abs = path.join(REPO_ROOT, dir);
  if (!fs.existsSync(abs)) return acc;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name.startsWith('.git')) continue;
      walk(rel, acc);
    } else if (/\.(md|js|json|txt)$/.test(e.name)) {
      if (EXCLUDE_PATTERNS.some(p => p.test(rel))) continue;
      acc.push(rel);
    }
  }
  return acc;
}

function main() {
  const units = parseMarkdown(fs.readFileSync(UNITS_MD, 'utf8'));
  const live = new Set();
  const deprecated = new Set();
  for (const u of units) {
    if (u.deprecated) deprecated.add(u.id);
    else live.add(u.id);
  }

  const files = [];
  for (const d of SCAN_DIRS) walk(d, files);

  const unresolved = [];      // cites something not in catalog at all
  const deprecatedRefs = [];  // cites a deprecated unit

  for (const rel of files) {
    const abs = path.join(REPO_ROOT, rel);
    const content = fs.readFileSync(abs, 'utf8');
    const seen = new Set();
    let match;
    while ((match = ID_PATTERN.exec(content)) !== null) {
      const id = match[0];
      if (seen.has(id)) continue;
      seen.add(id);
      if (!live.has(id) && !deprecated.has(id)) unresolved.push({ file: rel, id });
      else if (deprecated.has(id)) deprecatedRefs.push({ file: rel, id });
    }
  }

  const lines = [
    '# Unresolved References Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Catalog: ${live.size} live, ${deprecated.size} deprecated`,
    `Files scanned: ${files.length}`,
    '',
  ];

  if (unresolved.length === 0 && deprecatedRefs.length === 0) {
    lines.push('## Status: **PASS**', '');
    lines.push('Every unit-ID citation in the source tree resolves to a live catalog entry.');
    fs.writeFileSync(REPORT, lines.join('\n') + '\n');
    console.log(`OK  ${files.length} files scanned, 0 unresolved. Report: ${path.relative(REPO_ROOT, REPORT)}`);
    process.exit(0);
  }

  if (unresolved.length > 0) {
    lines.push(`## Status: **FAIL** — ${unresolved.length} unresolved reference(s)`, '');
    const byFile = {};
    for (const u of unresolved) (byFile[u.file] = byFile[u.file] || []).push(u.id);
    for (const file of Object.keys(byFile).sort()) {
      lines.push(`- **${file}** → ${byFile[file].sort().join(', ')}`);
    }
    lines.push('');
  }

  if (deprecatedRefs.length > 0) {
    lines.push(`## Warnings — ${deprecatedRefs.length} citation(s) of deprecated units`, '');
    lines.push('These do not fail CI but indicate upcoming migration work.', '');
    const byFile = {};
    for (const u of deprecatedRefs) (byFile[u.file] = byFile[u.file] || []).push(u.id);
    for (const file of Object.keys(byFile).sort()) {
      lines.push(`- ${file} → ${byFile[file].sort().join(', ')}`);
    }
    lines.push('');
  }

  fs.writeFileSync(REPORT, lines.join('\n') + '\n');
  if (unresolved.length > 0) {
    console.error(`${unresolved.length} unresolved reference(s). Report: ${path.relative(REPO_ROOT, REPORT)}`);
    process.exit(1);
  }
  console.log(`OK  ${deprecatedRefs.length} deprecated reference(s) (warnings). Report: ${path.relative(REPO_ROOT, REPORT)}`);
  process.exit(0);
}

if (require.main === module) main();

module.exports = { main };
