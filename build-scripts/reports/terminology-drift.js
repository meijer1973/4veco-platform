#!/usr/bin/env node
/**
 * terminology-drift.js
 *
 * Cross-checks every unit's `terms` field against the canonical term registry.
 * The current canon is `references/machine/begrippen.json`, where stable slug
 * IDs are the preferred unit references. During the R4 migration period, the
 * authored terminology markdown is still accepted as a fallback for terms that
 * have not yet been seeded into the machine registry.
 */

const fs = require('fs');
const path = require('path');
const { parseMarkdown } = require('../references/build-unit-index');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const UNITS_MD = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.md');
const BEGRIPPEN_JSON = path.join(REPO_ROOT, 'references/machine/begrippen.json');
const TERMS_MD = path.join(REPO_ROOT, 'references/authored/economie-terminologie.md');
const REPORT = path.join(REPO_ROOT, 'reports/terminology-drift.md');

function addTerm(terms, value) {
  if (typeof value !== 'string') return;
  const term = value.trim();
  if (!term || term.length <= 2) return;
  terms.add(term);
  const stripped = term.replace(/\s*\(=?[^)]*\)\s*$/, '').trim();
  if (stripped && stripped !== term && stripped.length > 2) terms.add(stripped);
}

function loadMachineTerms() {
  const terms = new Set();
  let count = 0;
  if (!fs.existsSync(BEGRIPPEN_JSON)) return { terms, count, available: false };
  const data = JSON.parse(fs.readFileSync(BEGRIPPEN_JSON, 'utf8'));
  for (const [id, entry] of Object.entries(data.terms || {})) {
    if (entry && entry.deprecated) continue;
    count++;
    addTerm(terms, id);
    addTerm(terms, entry && entry.term_nl);
    for (const synonym of (entry && entry.synonyms_nl) || []) addTerm(terms, synonym);
    for (const deprecated of (entry && entry.deprecated_forms) || []) addTerm(terms, deprecated);
  }
  return { terms, count, available: true };
}

function loadAuthoredTerms() {
  const terms = new Set();
  if (!fs.existsSync(TERMS_MD)) return { terms, available: false };
  const content = fs.readFileSync(TERMS_MD, 'utf8');

  for (const m of content.matchAll(/^##+\s+(.+?)\s*$/gm)) addTerm(terms, m[1]);
  for (const m of content.matchAll(/^-\s+\*\*(.+?)\*\*/gm)) addTerm(terms, m[1]);

  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^\|\s*(?:\d+(?:\.\d+[a-z]?)?|[\u2013\u2014-])\s*\|\s*([^|]+?)\s*\|/);
    if (!m) continue;
    for (const part of m[1].trim().split(/\s*[/,]\s*/)) addTerm(terms, part);
  }

  return { terms, available: true };
}

function loadCanonicalIndex() {
  const machine = loadMachineTerms();
  const authored = loadAuthoredTerms();
  const terms = new Set([...machine.terms, ...authored.terms]);
  return { terms, machine, authored };
}

function loadCanonicalTerms() {
  return loadCanonicalIndex().terms;
}

function main() {
  const units = parseMarkdown(fs.readFileSync(UNITS_MD, 'utf8'));
  const canonical = loadCanonicalIndex();

  const lines = [
    '# Terminology Drift Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Units:     ${units.length}`,
    `Canonical machine registry: ${canonical.machine.available ? `${canonical.machine.count} live terms in references/machine/begrippen.json` : 'MISSING'}`,
    `Authored fallback: ${canonical.authored.available ? `${canonical.authored.terms.size} terms in references/authored/economie-terminologie.md` : 'MISSING'}`,
    `Accepted term references: ${canonical.terms.size}`,
    '',
  ];

  if (!canonical.machine.available && !canonical.authored.available) {
    lines.push('## Status: **SKIP**', '');
    lines.push('No term registry or authored fallback found; nothing to check against.');
    fs.writeFileSync(REPORT, lines.join('\n') + '\n');
    console.log(`SKIP  terminology sources missing. Report: ${path.relative(REPO_ROOT, REPORT)}`);
    process.exit(0);
  }

  const missing = [];
  let totalTerms = 0;
  for (const u of units) {
    if (!Array.isArray(u.terms)) continue;
    for (const t of u.terms) {
      totalTerms++;
      if (!canonical.terms.has(t)) missing.push({ id: u.id, term: t });
    }
  }

  const discouraged = [
    { bad: 'prijsdifferentiatie', good: 'prijsdiscriminatie' },
    { bad: 'opportuniteitskosten', good: 'alternatieve kosten' },
    { bad: 'consumers', good: 'consumenten' },
    { bad: 'beinvloedt', good: 'beinvloedt (with diaeresis)' },
    { bad: 'strategieen', good: 'strategieen (with diaeresis)' },
    { bad: 'efficientie', good: 'efficientie (with diaeresis)' },
  ];
  const discouragedHits = [];
  for (const u of units) {
    const hay = (u.name || '') + ' ' + (u.kern || '');
    for (const d of discouraged) {
      const re = new RegExp(`\\b${d.bad}\\b`, 'i');
      if (re.test(hay)) discouragedHits.push({ id: u.id, bad: d.bad, good: d.good });
    }
  }

  lines.push(`Term citations across all units: ${totalTerms}`);
  lines.push(`Discouraged-form hits in name/kern: ${discouragedHits.length}`);
  lines.push('');

  const totalProblems = missing.length + discouragedHits.length;
  if (totalProblems === 0) {
    lines.push('## Status: **PASS**', '');
    if (totalTerms === 0) {
      lines.push('No units cite any terms yet. Discouraged-form sweep of `name`/`kern` also clean.');
    } else {
      lines.push('Every cited term resolves to the machine term registry or authored fallback. Discouraged-form sweep of `name`/`kern` clean.');
    }
    fs.writeFileSync(REPORT, lines.join('\n') + '\n');
    console.log(`OK  ${totalTerms} term citation(s), 0 drift. Report: ${path.relative(REPO_ROOT, REPORT)}`);
    process.exit(0);
  }

  lines.push(`## Status: **FAIL** - ${totalProblems} issue(s)`, '');

  if (missing.length > 0) {
    lines.push(`### ${missing.length} non-canonical term(s) in \`terms\` field`, '');
    const byUnit = {};
    for (const m of missing) (byUnit[m.id] = byUnit[m.id] || []).push(m.term);
    for (const id of Object.keys(byUnit).sort()) {
      lines.push(`- **${id}** -> ${byUnit[id].map(t => `"${t}"`).join(', ')}`);
    }
    lines.push('', 'Add each term to `begrippen.json` through the term CLI, keep it explicitly in authored fallback, or fix the unit through `unit-update`.', '');
  }

  if (discouragedHits.length > 0) {
    lines.push(`### ${discouragedHits.length} discouraged form(s) in \`name\`/\`kern\``, '');
    for (const d of discouragedHits) {
      lines.push(`- **${d.id}** uses "${d.bad}" - prefer "${d.good}"`);
    }
    lines.push('', 'Fix via `unit-update --id <ID> --spec \'{"kern":"...","name":"..."}\'` or `unit-rename`.', '');
  }

  fs.writeFileSync(REPORT, lines.join('\n') + '\n');
  console.error(`${totalProblems} terminology issue(s). Report: ${path.relative(REPO_ROOT, REPORT)}`);
  process.exit(1);
}

if (require.main === module) main();

module.exports = { main, loadCanonicalTerms, loadCanonicalIndex };
