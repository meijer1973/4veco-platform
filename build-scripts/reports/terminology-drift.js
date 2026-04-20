#!/usr/bin/env node
/**
 * terminology-drift.js
 *
 * Cross-checks every unit's `terms` field against the canonical entries in
 * references/authored/economie-terminologie.md. Any term that doesn't
 * resolve is flagged; the report fails CI to prevent silent drift from
 * the canonical Dutch term list.
 *
 * Heuristic: a term is canonical if it appears as a heading (## or ### or
 * ####) or a bolded bullet-list lead in economie-terminologie.md. This is
 * intentionally permissive; if the terminology file adopts a stricter
 * machine-editing pipeline later, the loader can tighten.
 */

const fs = require('fs');
const path = require('path');
const { parseMarkdown } = require('../references/build-unit-index');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const UNITS_MD  = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.md');
const TERMS_MD  = path.join(REPO_ROOT, 'references/authored/economie-terminologie.md');
const REPORT    = path.join(REPO_ROOT, 'reports/terminology-drift.md');

function loadCanonicalTerms() {
  if (!fs.existsSync(TERMS_MD)) return null;
  const content = fs.readFileSync(TERMS_MD, 'utf8');
  const terms = new Set();
  // Any heading is a canonical term.
  for (const m of content.matchAll(/^##+\s+(.+?)\s*$/gm)) {
    terms.add(m[1].trim());
  }
  // `- **term**` pattern inside term lists.
  for (const m of content.matchAll(/^-\s+\*\*(.+?)\*\*/gm)) {
    terms.add(m[1].trim());
  }
  return terms;
}

function main() {
  const units = parseMarkdown(fs.readFileSync(UNITS_MD, 'utf8'));
  const canonical = loadCanonicalTerms();

  const lines = [
    '# Terminology Drift Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Units:     ${units.length}`,
  ];

  if (canonical === null) {
    lines.push(`Canonical: references/authored/economie-terminologie.md (MISSING)`, '');
    lines.push('## Status: **SKIP**', '');
    lines.push('Terminology file not found; nothing to check against.');
    fs.writeFileSync(REPORT, lines.join('\n') + '\n');
    console.log(`SKIP  economie-terminologie.md missing. Report: ${path.relative(REPO_ROOT, REPORT)}`);
    process.exit(0);
  }

  lines.push(`Canonical: ${canonical.size} terms in economie-terminologie.md`, '');

  const missing = [];
  let totalTerms = 0;
  for (const u of units) {
    if (!Array.isArray(u.terms)) continue;
    for (const t of u.terms) {
      totalTerms++;
      if (!canonical.has(t)) missing.push({ id: u.id, term: t });
    }
  }

  lines.push(`Term citations across all units: ${totalTerms}`, '');

  if (missing.length === 0) {
    lines.push('## Status: **PASS**', '');
    if (totalTerms === 0) {
      lines.push('No units cite any terms yet — nothing to check.');
    } else {
      lines.push('Every cited term resolves to a canonical entry.');
    }
    fs.writeFileSync(REPORT, lines.join('\n') + '\n');
    console.log(`OK  ${totalTerms} term citation(s), 0 drift. Report: ${path.relative(REPO_ROOT, REPORT)}`);
    process.exit(0);
  }

  lines.push(`## Status: **FAIL** — ${missing.length} non-canonical term(s)`, '');
  const byUnit = {};
  for (const m of missing) (byUnit[m.id] = byUnit[m.id] || []).push(m.term);
  for (const id of Object.keys(byUnit).sort()) {
    lines.push(`- **${id}** → ${byUnit[id].map(t => `"${t}"`).join(', ')}`);
  }
  lines.push('', 'Either add each term to economie-terminologie.md or fix the unit via `unit-update --id <ID> --spec \'{"terms":[…]}\'`.', '');

  fs.writeFileSync(REPORT, lines.join('\n') + '\n');
  console.error(`${missing.length} non-canonical term(s). Report: ${path.relative(REPO_ROOT, REPORT)}`);
  process.exit(1);
}

if (require.main === module) main();

module.exports = { main, loadCanonicalTerms };
