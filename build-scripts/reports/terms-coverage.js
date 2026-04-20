#!/usr/bin/env node
/**
 * terms-coverage.js
 *
 * Lists units with empty `terms`. Informational — canonical Dutch terms
 * get wired up as paragraph plans cite the unit and the canonical
 * vocabulary surfaces. See economie-terminologie.md for the canonical list.
 */

const fs = require('fs');
const path = require('path');
const { parseMarkdown } = require('../references/build-unit-index');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const UNITS_MD  = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.md');
const REPORT    = path.join(REPO_ROOT, 'reports/terms-coverage.md');

function main() {
  const units = parseMarkdown(fs.readFileSync(UNITS_MD, 'utf8'));
  const live = units.filter(u => !u.deprecated);
  const missing = live.filter(u => !Array.isArray(u.terms) || u.terms.length === 0);

  const lines = [
    '# Terms-Coverage Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Live units:      ${live.length}`,
    `With no terms:   ${missing.length}`,
    '',
    '## Status: **INFORMATIONAL**',
    '',
    'Units with empty `terms` have no canonical-vocabulary links yet. Wire via `unit-update --id <ID> --spec \'{"terms":["...","..."]}\'` when a paragraph plan surfaces which canonical terms the unit anchors.',
    '',
  ];

  if (missing.length === 0) {
    lines.push('Every live unit cites at least one canonical term.');
    fs.writeFileSync(REPORT, lines.join('\n') + '\n');
    console.log(`OK  0 units missing terms. Report: ${path.relative(REPO_ROOT, REPORT)}`);
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
  console.log(`OK  ${missing.length} units with no terms. Report: ${path.relative(REPO_ROOT, REPORT)}`);
}

if (require.main === module) main();
module.exports = { main };
