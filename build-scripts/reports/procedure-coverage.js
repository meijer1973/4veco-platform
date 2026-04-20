#!/usr/bin/env node
/**
 * procedure-coverage.js
 *
 * Lists apply+ units (mastery_target in apply|analyze|evaluate) that have no
 * canonical procedure. The validator warns on these but does not fail; this
 * report is where they become visible backlog.
 *
 * A-domain units are listed separately because their executable "procedure"
 * is the generator (GEN_A*), so a missing step list there is expected.
 */

const fs = require('fs');
const path = require('path');
const { parseMarkdown, APPLY_OR_HIGHER } = require('../references/build-unit-index');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const UNITS_MD  = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.md');
const REPORT    = path.join(REPO_ROOT, 'reports/procedure-coverage.md');

function hasProcedure(u) {
  return Array.isArray(u.procedure) && u.procedure.length > 0;
}

function main() {
  const units = parseMarkdown(fs.readFileSync(UNITS_MD, 'utf8'));
  const live = units.filter(u => !u.deprecated);
  const applyPlus = live.filter(u => APPLY_OR_HIGHER.has(u.mastery_target));
  const missing = applyPlus.filter(u => !hasProcedure(u));

  const aMissing = missing.filter(u => u.id.startsWith('A'));
  const nonAMissing = missing.filter(u => !u.id.startsWith('A'));

  const lines = [
    '# Procedure-Coverage Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Apply+ units:            ${applyPlus.length}`,
    `With procedure:          ${applyPlus.length - missing.length}`,
    `Without procedure:       ${missing.length} (A: ${aMissing.length}, non-A: ${nonAMissing.length})`,
    '',
    '## Status: **INFORMATIONAL**',
    '',
    'A canonical procedure is the step sequence every downstream material (voorkennis, vaardigheden, answer model, slide deck) cites verbatim. A missing procedure means the unit minted without an abstract recipe; each still-missing unit should get one written when the next paragraph build cites it.',
    '',
    'A-domain units are listed separately: their executable recipe is the `GEN_*` randomizer, so a missing step list is lower-priority than for non-A units.',
    '',
  ];

  if (nonAMissing.length === 0 && aMissing.length === 0) {
    lines.push('Every apply+ unit has a procedure.');
    fs.writeFileSync(REPORT, lines.join('\n') + '\n');
    console.log(`OK  0 missing procedures. Report: ${path.relative(REPO_ROOT, REPORT)}`);
    return;
  }

  if (nonAMissing.length > 0) {
    lines.push(`## Non-A units missing procedure (${nonAMissing.length})`, '');
    const byDomain = {};
    for (const u of nonAMissing) (byDomain[u.id[0]] = byDomain[u.id[0]] || []).push(u);
    for (const letter of Object.keys(byDomain).sort()) {
      lines.push(`### Domain ${letter} (${byDomain[letter].length})`, '');
      for (const u of byDomain[letter]) lines.push(`- **${u.id}** ${u.name} — _${u.mastery_target}_`);
      lines.push('');
    }
  }

  if (aMissing.length > 0) {
    lines.push(`## A-domain units missing procedure (${aMissing.length})`, '');
    lines.push('These are math-skilltree units; their executable recipe is the generator. Lower priority.', '');
    for (const u of aMissing) lines.push(`- **${u.id}** ${u.name} — _${u.mastery_target}_`);
    lines.push('');
  }

  fs.writeFileSync(REPORT, lines.join('\n') + '\n');
  console.log(`OK  ${missing.length} missing procedures (${nonAMissing.length} non-A, ${aMissing.length} A). Report: ${path.relative(REPO_ROOT, REPORT)}`);
}

if (require.main === module) main();
module.exports = { main };
