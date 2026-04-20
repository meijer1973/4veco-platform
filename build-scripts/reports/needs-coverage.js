#!/usr/bin/env node
/**
 * needs-coverage.js
 *
 * Lists units with empty `needs`. Informational — the exercise-first
 * principle says prerequisite edges get wired up as paragraph plans cite
 * units and concrete prerequisites surface. Units here are not broken; they
 * are unexplored.
 */

const fs = require('fs');
const path = require('path');
const { parseMarkdown } = require('../references/build-unit-index');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const UNITS_MD  = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.md');
const REPORT    = path.join(REPO_ROOT, 'reports/needs-coverage.md');

function main() {
  const units = parseMarkdown(fs.readFileSync(UNITS_MD, 'utf8'));
  const live = units.filter(u => !u.deprecated);
  const missing = live.filter(u => !Array.isArray(u.needs) || u.needs.length === 0);

  const lines = [
    '# Needs-Coverage Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Live units:      ${live.length}`,
    `With no needs:   ${missing.length}`,
    '',
    '## Status: **INFORMATIONAL**',
    '',
    'Units with empty `needs` are not broken — they simply have no prerequisite edges wired up yet. Wire them via `unit-add-dep` when a paragraph plan, exercise, or explanatory document surfaces a concrete prerequisite.',
    '',
  ];

  if (missing.length === 0) {
    lines.push('Every live unit has at least one prerequisite edge.');
    fs.writeFileSync(REPORT, lines.join('\n') + '\n');
    console.log(`OK  0 units missing needs. Report: ${path.relative(REPO_ROOT, REPORT)}`);
    return;
  }

  const byDomain = {};
  for (const u of missing) (byDomain[u.id[0]] = byDomain[u.id[0]] || []).push(u);
  for (const letter of Object.keys(byDomain).sort()) {
    lines.push(`## Domain ${letter} (${byDomain[letter].length})`, '');
    for (const u of byDomain[letter]) lines.push(`- **${u.id}** ${u.name}`);
    lines.push('');
  }

  fs.writeFileSync(REPORT, lines.join('\n') + '\n');
  console.log(`OK  ${missing.length} units with no needs. Report: ${path.relative(REPO_ROOT, REPORT)}`);
}

if (require.main === module) main();
module.exports = { main };
