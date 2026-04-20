#!/usr/bin/env node
/**
 * dag-integrity.js
 *
 * Re-runs the full unit-registry validator (parse + schema + cross-refs +
 * cycle detection + layer invariant) and writes a markdown report to
 * reports/dag-integrity.md. Exits non-zero if any structural error is
 * detected, so CI fails the build.
 */

const fs = require('fs');
const path = require('path');
const {
  parseMarkdown,
  validate,
  computeLayers,
} = require('../references/build-unit-index');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const UNITS_MD  = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.md');
const REPORT    = path.join(REPO_ROOT, 'reports/dag-integrity.md');

function main() {
  const content = fs.readFileSync(UNITS_MD, 'utf8');
  const units = parseMarkdown(content);
  const { errors, byId } = validate(units, {});

  const lines = [
    '# DAG Integrity Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Source:    references/machine/micro-teaching-units.md`,
    `Units:     ${units.length}`,
    '',
  ];

  if (errors.length === 0) {
    computeLayers(units, byId);
    const byLayer = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (const u of units) if (typeof u.layer === 'number') byLayer[u.layer]++;
    const nonZero = byLayer.filter(c => c > 0).length;

    lines.push('## Status: **PASS**', '');
    lines.push(`All ${units.length} units validate. DAG is acyclic. Every \`needs\` reference resolves.`);
    if (nonZero > 0) {
      lines.push('', '## Layer distribution', '');
      lines.push('| Layer | Count |');
      lines.push('|---|---|');
      for (let i = 0; i < byLayer.length; i++) {
        if (byLayer[i] > 0) lines.push(`| ${i} | ${byLayer[i]} |`);
      }
    }
    fs.writeFileSync(REPORT, lines.join('\n') + '\n');
    console.log(`OK  ${units.length} units validated. Report: ${path.relative(REPO_ROOT, REPORT)}`);
    process.exit(0);
  }

  lines.push(`## Status: **FAIL** (${errors.length} error(s))`, '');
  for (const e of errors) lines.push(`- ${e}`);
  lines.push('');
  fs.writeFileSync(REPORT, lines.join('\n') + '\n');
  for (const e of errors) console.error('ERROR  ' + e);
  console.error(`\n${errors.length} validation error(s). Report: ${path.relative(REPO_ROOT, REPORT)}`);
  process.exit(1);
}

if (require.main === module) main();

module.exports = { main };
