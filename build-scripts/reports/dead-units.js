#!/usr/bin/env node
/**
 * dead-units.js
 *
 * For every live unit in the registry, count how many source-tree files
 * cite it. Units with zero citations are "dead" — candidates for
 * deprecation. Informational only; never fails CI (some units are
 * intentionally ahead of the curriculum and may be cited only after
 * the next paragraph build).
 */

const fs = require('fs');
const path = require('path');
const { parseMarkdown } = require('../references/build-unit-index');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const UNITS_MD  = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.md');
const REPORT    = path.join(REPO_ROOT, 'reports/dead-units.md');

const SCAN_DIRS = [
  'source-data',
  'knowledge',
  '.claude/plans',
  'skills',
  '.claude/commands',
  'build-scripts/templates',
];

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
  const live = units.filter(u => !u.deprecated);

  const citations = new Map(live.map(u => [u.id, new Set()]));
  const files = [];
  for (const d of SCAN_DIRS) walk(d, files);

  for (const rel of files) {
    const content = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8');
    const seen = new Set();
    let match;
    while ((match = ID_PATTERN.exec(content)) !== null) {
      const id = match[0];
      if (seen.has(id)) continue;
      seen.add(id);
      if (citations.has(id)) citations.get(id).add(rel);
    }
  }

  const dead = live.filter(u => citations.get(u.id).size === 0);
  const alive = live.filter(u => citations.get(u.id).size > 0);

  const lines = [
    '# Dead Units Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Live units:   ${live.length}`,
    `Files scanned: ${files.length}`,
    `Cited:        ${alive.length}`,
    `Dead:         ${dead.length}`,
    '',
  ];

  if (dead.length === 0) {
    lines.push('## Status: **CLEAN**', '');
    lines.push('Every live unit is cited at least once in the source tree.');
  } else {
    lines.push(`## Dead units (${dead.length})`, '');
    lines.push('These units exist in the catalog but no source file cites them. Candidates for deprecation via `unit-deprecate` unless the catalog is intentionally ahead of the curriculum.', '');
    for (const u of dead) {
      lines.push(`- **${u.id}** ${u.name}${u.deprecated ? ' [deprecated]' : ''}`);
    }
    lines.push('');
  }

  if (alive.length > 0) {
    lines.push('## Citation counts (top 10 most cited)', '');
    const sorted = alive.map(u => ({ id: u.id, name: u.name, count: citations.get(u.id).size }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    lines.push('| Unit | Name | Files citing |');
    lines.push('|---|---|---|');
    for (const r of sorted) lines.push(`| ${r.id} | ${r.name} | ${r.count} |`);
    lines.push('');
  }

  fs.writeFileSync(REPORT, lines.join('\n') + '\n');
  console.log(`OK  ${dead.length} dead, ${alive.length} cited. Report: ${path.relative(REPO_ROOT, REPORT)}`);
}

if (require.main === module) main();

module.exports = { main };
