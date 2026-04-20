#!/usr/bin/env node
/**
 * migrate-paths.js
 *
 * One-shot rewrite of reference-file path citations across the repo.
 * Maps `references/<name>` to `references/<bucket>/<name>` for every file
 * in the hand-authored catalog. Safe to re-run (idempotent).
 *
 * Usage:
 *   node build-scripts/references/migrate-paths.js          # dry run
 *   node build-scripts/references/migrate-paths.js --write  # apply
 *
 * See knowledge/references-migration-plan.md for rationale and impact list.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const WRITE = process.argv.includes('--write');

// Mapping: old path fragment -> new path fragment.
// Ordered most-specific-first to avoid partial-match collisions.
const REWRITES = [
  ['references/syllabus-economie-vwo-2026-versie-2.pdf', 'references/external/syllabus-economie-vwo-2026-versie-2.pdf'],
  ['references/inspectie-standaarden.md',                'references/external/inspectie-standaarden.md'],
  ['references/amstelveencollege_quality_standards.md',  'references/external/amstelveencollege_quality_standards.md'],
  ['references/economie-terminologie.md',                'references/authored/economie-terminologie.md'],
  ['references/vraagtypen-en-opgaveontwerp.md',          'references/authored/vraagtypen-en-opgaveontwerp.md'],
  ['references/economic_mathematical_precision_reference.md', 'references/authored/economic_mathematical_precision_reference.md'],
  ['references/didactiek-principes.md',                  'references/authored/didactiek-principes.md'],
  ['references/skill-categories.md',                     'references/authored/skill-categories.md'],
];

// Directories to walk. Excludes references/ itself (the files there move via git mv,
// and their content rewrites happen in-place via the mapping above).
const TARGET_DIRS = [
  'skills',
  '.claude/commands',
  '.claude/plans',
  'knowledge',
  'build-scripts',
  'source-data',
  'engines',
];

// Also include top-level docs that cite references.
const EXTRA_FILES = ['CLAUDE.md', 'AGENTS.md', 'BUILD-PARAGRAPH.md', 'BUILD-CHAPTER.md'];

// Files that DOCUMENT the mapping and must retain the old paths as reference.
// Excluded from rewriting.
const EXCLUDE_FILES = new Set([
  'build-scripts/references/migrate-paths.js',
  'knowledge/references-migration-plan.md',
].map(p => p.replace(/\//g, path.sep)));

function walk(dir, acc) {
  const abs = path.join(REPO_ROOT, dir);
  if (!fs.existsSync(abs)) return acc;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(rel, acc);
    } else if (entry.isFile()) {
      if (/\.(md|txt|json|js|py)$/.test(entry.name)) acc.push(rel);
    }
  }
  return acc;
}

function collectFiles() {
  const files = [];
  for (const d of TARGET_DIRS) walk(d, files);
  for (const f of EXTRA_FILES) {
    if (fs.existsSync(path.join(REPO_ROOT, f))) files.push(f);
  }
  // Also include references/*.md that cite each other (intra-bucket links).
  walk('references', files);
  return files;
}

function rewriteFile(relPath) {
  if (EXCLUDE_FILES.has(relPath)) return null;
  const abs = path.join(REPO_ROOT, relPath);
  const original = fs.readFileSync(abs, 'utf8');
  let next = original;
  const hits = [];
  for (const [from, to] of REWRITES) {
    // Only rewrite paths that aren't already in a sub-bucket.
    // Match "references/<file>" but NOT "references/external/<file>", "references/authored/<file>", "references/machine/<file>".
    const pattern = new RegExp(`(?<!/external/|/authored/|/machine/)${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    const before = next;
    next = next.replace(pattern, to);
    if (before !== next) {
      const count = (before.match(pattern) || []).length;
      hits.push([from, count]);
    }
  }
  if (hits.length === 0) return null;
  return { relPath, hits, original, next };
}

function main() {
  const files = collectFiles();
  const results = [];
  for (const f of files) {
    const r = rewriteFile(f);
    if (r) results.push(r);
  }

  if (results.length === 0) {
    console.log('No rewrites needed — every citation already uses a sub-bucket path.');
    return;
  }

  let total = 0;
  for (const r of results) {
    const fileTotal = r.hits.reduce((s, [, c]) => s + c, 0);
    total += fileTotal;
    console.log(`${r.relPath} — ${fileTotal} rewrite(s)`);
    for (const [from, count] of r.hits) {
      console.log(`  ${count} × ${from}`);
    }
  }
  console.log(`\n${results.length} files, ${total} rewrites total.`);

  if (WRITE) {
    for (const r of results) {
      fs.writeFileSync(path.join(REPO_ROOT, r.relPath), r.next);
    }
    console.log('\nWrote all changes.');
  } else {
    console.log('\nDry run. Re-run with --write to apply.');
  }
}

main();
