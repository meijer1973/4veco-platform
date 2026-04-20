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
  for (const m of content.matchAll(/^##+\s+(.+?)\s*$/gm)) terms.add(m[1].trim());
  for (const m of content.matchAll(/^-\s+\*\*(.+?)\*\*/gm)) terms.add(m[1].trim());
  // Pipe-table row (second column = canonical Dutch term, split on `/`).
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^\|\s*\d+(?:\.\d+[a-z]?)?\s*\|\s*([^|]+?)\s*\|/);
    if (!m) continue;
    for (const part of m[1].trim().split(/\s*\/\s*/)) {
      const p = part.trim();
      if (p && !p.startsWith('(') && p.length > 2) terms.add(p);
    }
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

  // Known discouraged forms from economie-terminologie.md (anglicisms /
  // non-canonical spellings the terminology file explicitly flags).
  // Extended with common drift spotted during audits.
  const discouraged = [
    { bad: 'prijsdifferentiatie', good: 'prijsdiscriminatie' },
    { bad: 'opportuniteitskosten', good: 'alternatieve kosten' },
    { bad: 'consumers', good: 'consumenten' },
    { bad: 'beinvloedt', good: 'beïnvloedt' },
    { bad: 'strategieen', good: 'strategieën' },
    { bad: 'efficientie', good: 'efficiëntie' },
  ];
  const discouragedHits = [];
  for (const u of units) {
    const hay = (u.name || '') + ' ' + (u.kern || '');
    for (const d of discouraged) {
      const re = new RegExp(`\\b${d.bad}\\b`, 'i');
      if (re.test(hay)) discouragedHits.push({ id: u.id, bad: d.bad, good: d.good });
    }
  }

  lines.push(`Term citations across all units: ${totalTerms}`, `Discouraged-form hits in name/kern: ${discouragedHits.length}`, '');

  const totalProblems = missing.length + discouragedHits.length;
  if (totalProblems === 0) {
    lines.push('## Status: **PASS**', '');
    if (totalTerms === 0) {
      lines.push('No units cite any terms yet — nothing to check in `terms` field. Discouraged-form sweep of `name`/`kern` also clean.');
    } else {
      lines.push('Every cited term resolves to a canonical entry. Discouraged-form sweep of `name`/`kern` clean.');
    }
    fs.writeFileSync(REPORT, lines.join('\n') + '\n');
    console.log(`OK  ${totalTerms} term citation(s), 0 drift. Report: ${path.relative(REPO_ROOT, REPORT)}`);
    process.exit(0);
  }

  lines.push(`## Status: **FAIL** — ${totalProblems} issue(s)`, '');

  if (missing.length > 0) {
    lines.push(`### ${missing.length} non-canonical term(s) in \`terms\` field`, '');
    const byUnit = {};
    for (const m of missing) (byUnit[m.id] = byUnit[m.id] || []).push(m.term);
    for (const id of Object.keys(byUnit).sort()) {
      lines.push(`- **${id}** → ${byUnit[id].map(t => `"${t}"`).join(', ')}`);
    }
    lines.push('', 'Either add each term to economie-terminologie.md or fix the unit via `unit-update --id <ID> --spec \'{"terms":[…]}\'`.', '');
  }

  if (discouragedHits.length > 0) {
    lines.push(`### ${discouragedHits.length} discouraged form(s) in \`name\`/\`kern\``, '');
    for (const d of discouragedHits) {
      lines.push(`- **${d.id}** uses "${d.bad}" — prefer "${d.good}"`);
    }
    lines.push('', 'Fix via `unit-update --id <ID> --spec \'{"kern":"…","name":"…"}\'` or `unit-rename`.', '');
  }

  fs.writeFileSync(REPORT, lines.join('\n') + '\n');
  console.error(`${totalProblems} terminology issue(s). Report: ${path.relative(REPO_ROOT, REPORT)}`);
  process.exit(1);
}

if (require.main === module) main();

module.exports = { main, loadCanonicalTerms };
