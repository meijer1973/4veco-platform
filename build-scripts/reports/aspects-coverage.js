#!/usr/bin/env node
/**
 * aspects-coverage.js
 *
 * Summarises the distribution of the `aspects` field across the catalog.
 * Intended as diagnostic signal for downstream game / exercise routing:
 * e.g. the math-training game covers `rekenen`, the reasoning game covers
 * `verbaal`, and the graphical-interpretation game covers `grafisch`.
 *
 * Also surfaces units whose aspects were heuristically backfilled (i.e.
 * have no exam-question coverage yet) as a review backlog.
 */

const fs = require('fs');
const path = require('path');
const { parseMarkdown } = require('../references/build-unit-index');

const REPO_ROOT  = path.resolve(__dirname, '..', '..');
const UNITS_MD   = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.md');
const QUESTIONS  = path.join(REPO_ROOT, 'references/external/exam-questions.json');
const REPORT     = path.join(REPO_ROOT, 'reports/aspects-coverage.md');

function main() {
  const units = parseMarkdown(fs.readFileSync(UNITS_MD, 'utf8'));
  const live = units.filter(u => !u.deprecated);

  // Collect exam-citation evidence per unit (for the "no exam coverage" flag).
  let questions = [];
  try { questions = JSON.parse(fs.readFileSync(QUESTIONS, 'utf8')); } catch { /* ok */ }
  const citedInExam = new Set();
  for (const r of questions) for (const s of r.required_skills || []) citedInExam.add(s);

  const totals = { verbaal: 0, grafisch: 0, rekenen: 0 };
  const byCombo = {};
  const byDomain = {};
  const noExam = [];

  for (const u of live) {
    const aspects = Array.isArray(u.aspects) ? u.aspects : [];
    for (const a of aspects) if (totals[a] !== undefined) totals[a]++;
    const combo = aspects.slice().sort().join('+') || '(none)';
    byCombo[combo] = (byCombo[combo] || 0) + 1;
    const d = u.id[0];
    if (!byDomain[d]) byDomain[d] = { verbaal: 0, grafisch: 0, rekenen: 0 };
    for (const a of aspects) if (byDomain[d][a] !== undefined) byDomain[d][a]++;
    if (!citedInExam.has(u.id)) noExam.push(u);
  }

  const lines = [
    '# Aspects-Coverage Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Live units: ${live.length}`,
    '',
    '## Status: **INFORMATIONAL**',
    '',
    'The `aspects` field records whether mastery requires **verbaal** reasoning, **grafisch** interpretation, **rekenen** calculation, or a combination. Downstream game/exercise routing filters on this.',
    '',
    '## Totals',
    '',
    '| Aspect | Units |',
    '|---|---|',
    `| verbaal | ${totals.verbaal} |`,
    `| grafisch | ${totals.grafisch} |`,
    `| rekenen | ${totals.rekenen} |`,
    '',
    '## Combinations',
    '',
    '| Combination | Units |',
    '|---|---|',
  ];
  for (const [combo, n] of Object.entries(byCombo).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${combo} | ${n} |`);
  }
  lines.push('', '## By domain', '', '| Domain | verbaal | grafisch | rekenen |', '|---|---:|---:|---:|');
  for (const d of Object.keys(byDomain).sort()) {
    const r = byDomain[d];
    lines.push(`| ${d} | ${r.verbaal} | ${r.grafisch} | ${r.rekenen} |`);
  }

  if (noExam.length > 0) {
    lines.push('', `## Review backlog: ${noExam.length} unit(s) with no exam citation`, '');
    lines.push('These units\' aspects were inferred from `kern`/`name` text, not from real exam coverage. Review on next curriculum pass.', '');
    const byDom = {};
    for (const u of noExam) (byDom[u.id[0]] = byDom[u.id[0]] || []).push(u);
    for (const d of Object.keys(byDom).sort()) {
      lines.push(`### Domain ${d} (${byDom[d].length})`, '');
      for (const u of byDom[d]) lines.push(`- **${u.id}** ${u.name} — aspects: \`[${(u.aspects || []).join(', ')}]\``);
      lines.push('');
    }
  }

  fs.writeFileSync(REPORT, lines.join('\n') + '\n');
  console.log(`OK  v=${totals.verbaal} g=${totals.grafisch} r=${totals.rekenen}; ${noExam.length} without exam citation. Report: ${path.relative(REPO_ROOT, REPORT)}`);
}

if (require.main === module) main();
module.exports = { main };
