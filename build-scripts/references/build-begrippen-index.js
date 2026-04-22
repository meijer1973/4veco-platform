#!/usr/bin/env node
/**
 * build-begrippen-index.js
 *
 * Validate references/machine/begrippen.json, compute the reverse index
 * teaching_units (from micro-teaching-units.json), and emit:
 *   - references/machine/begrippen.json  (rewritten in canonical shape)
 *   - references/machine/begrippen.md    (human-readable projection)
 *   - reports/begrippen-coverage.md      (migration backlog report)
 *
 * Every term-* CLI invokes this at the end of its write. Can also run
 * standalone as a full-registry check.
 *
 * Flags:
 *   --allow-empty-definitions   treat empty definition_nl as warning (migration mode)
 *   --quiet                     suppress non-error output
 *
 * Exit code 0 on success, 1 on any validation failure.
 */

const fs = require('fs');
const path = require('path');

const {
  REPO_ROOT,
  BEGRIPPEN_JSON,
  BEGRIPPEN_MD,
  EINDTERMEN_JSON,
  UNITS_JSON,
  COVERAGE_REPORT,
  VERSION,
  DOMAINS,
  DOMAIN_TITLES,
  NOTATION_MARKERS,
  loadRegistry,
  normalizeEntry,
  parseFlagArgs,
} = require('./term-lib');

// ----- cross-reference loaders -----

function loadEindtermen() {
  if (!fs.existsSync(EINDTERMEN_JSON)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(EINDTERMEN_JSON, 'utf8'));
    const set = new Set();
    if (Array.isArray(data)) for (const e of data) if (e && e.code) set.add(e.code);
    return set;
  } catch (err) {
    console.warn(`[warn] failed to parse ${EINDTERMEN_JSON}: ${err.message}`);
    return null;
  }
}

function loadUnits() {
  if (!fs.existsSync(UNITS_JSON)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(UNITS_JSON, 'utf8'));
    if (!Array.isArray(data)) return null;
    return data;
  } catch (err) {
    console.warn(`[warn] failed to parse ${UNITS_JSON}: ${err.message}`);
    return null;
  }
}

// ----- reverse index -----

// For each term id, collect the unit ids whose `terms` field cites either
// the id, the canonical term_nl, or any synonym. The unit catalog stores
// the Dutch term string (not the slug), so we need the term→id reverse map.
function computeTeachingUnits(registry, units) {
  if (!units) return;
  const reverseMap = new Map(); // lowercase term/synonym → id
  for (const [id, entry] of Object.entries(registry.terms)) {
    const keys = [entry.term_nl, ...(entry.synonyms_nl || [])];
    for (const k of keys) {
      if (typeof k !== 'string' || !k) continue;
      reverseMap.set(k.trim().toLowerCase(), id);
    }
    // Also allow unit-catalog authors to cite a term by its id directly.
    reverseMap.set(id.toLowerCase(), id);
  }
  const unitsByTerm = new Map(); // term id → Set<unit id>
  for (const u of units) {
    if (!u || !Array.isArray(u.terms)) continue;
    for (const t of u.terms) {
      const key = String(t).trim().toLowerCase();
      // Try exact match first, then gloss-stripped (e.g. "x (= y)" → "x").
      const stripped = key.replace(/\s*\(=?[^)]*\)\s*$/, '').trim();
      const hit = reverseMap.get(key) || (stripped && reverseMap.get(stripped));
      if (!hit) continue;
      if (!unitsByTerm.has(hit)) unitsByTerm.set(hit, new Set());
      unitsByTerm.get(hit).add(u.id);
    }
  }
  for (const [id, entry] of Object.entries(registry.terms)) {
    const s = unitsByTerm.get(id);
    entry.teaching_units = s ? [...s].sort() : [];
  }
}

// ----- validation -----

function validate(registry, { eindtermen, allowEmptyDefinitions }) {
  const errors = [];
  const warnings = [];
  const ids = new Set(Object.keys(registry.terms));

  for (const [id, entry] of Object.entries(registry.terms)) {
    if (!entry.id) {
      errors.push(`${id}: missing id`);
    } else if (entry.id !== id) {
      errors.push(`${id}: entry.id "${entry.id}" does not match key`);
    }
    if (!entry.term_nl) errors.push(`${id}: missing term_nl`);
    if (!entry.domain || !DOMAINS.includes(entry.domain)) {
      errors.push(`${id}: domain "${entry.domain}" not in {${DOMAINS.join(',')}}`);
    }
    if (!entry.deprecated) {
      if (!entry.definition_nl || !entry.definition_nl.trim()) {
        const msg = `${id}: definition_nl is empty`;
        if (allowEmptyDefinitions) warnings.push(msg);
        else errors.push(msg);
      }
    }
    if (entry.syllabus_clause && eindtermen && !eindtermen.has(entry.syllabus_clause)) {
      errors.push(`${id}: syllabus_clause "${entry.syllabus_clause}" not found in syllabus-eindtermen.json`);
    }
    for (const rel of entry.related_terms || []) {
      if (!ids.has(rel)) errors.push(`${id}: related_terms references unknown id "${rel}"`);
    }
    for (const syn of entry.synonyms_nl || []) {
      if (typeof syn !== 'string' || !syn.trim()) {
        errors.push(`${id}: synonyms_nl contains empty value`);
      }
    }
    for (const marker of entry.notation_markers || []) {
      if (!NOTATION_MARKERS.includes(marker)) {
        errors.push(`${id}: notation_marker "${marker}" not in ${NOTATION_MARKERS.join('|')}`);
      }
    }
    if (entry.deprecated) {
      if (entry.deprecated_in_favor_of) {
        if (!ids.has(entry.deprecated_in_favor_of)) {
          errors.push(`${id}: deprecated_in_favor_of references unknown id "${entry.deprecated_in_favor_of}"`);
        } else if (registry.terms[entry.deprecated_in_favor_of].deprecated) {
          errors.push(`${id}: deprecated_in_favor_of points at deprecated term "${entry.deprecated_in_favor_of}"`);
        }
      }
    }
  }

  return { errors, warnings };
}

// ----- markdown projection -----

function renderMarkdown(registry) {
  const lines = [];
  lines.push('# Begrippen — Canonieke Registratie');
  lines.push('');
  lines.push('**Niet met de hand bewerken.** Alle mutaties gaan via `build-scripts/references/term-*.js`.');
  lines.push('Regenereer met `node build-scripts/references/build-begrippen-index.js`.');
  lines.push('');
  lines.push(`*Versie ${registry.version} — gegenereerd ${registry.generated_at.slice(0, 10)}.*`);
  lines.push('');
  lines.push('Elk begrip heeft een stabiele id (slug van de Nederlandse term), een student-facing Nederlandse definitie, een syllabus-clause (indien van toepassing), en cross-links naar gerelateerde termen en teaching-units.');
  lines.push('');

  const byDomain = new Map();
  for (const [id, entry] of Object.entries(registry.terms)) {
    const d = entry.domain || '?';
    if (!byDomain.has(d)) byDomain.set(d, []);
    byDomain.get(d).push({ id, entry });
  }
  for (const list of byDomain.values()) list.sort((a, b) => a.id.localeCompare(b.id));

  for (const letter of [...DOMAINS, '?']) {
    const list = byDomain.get(letter);
    if (!list || list.length === 0) continue;
    const title = DOMAIN_TITLES[letter] || 'Overig';
    lines.push(`## Domein ${letter === '?' ? '?' : letter}: ${title}`);
    lines.push('');
    const live = list.filter(x => !x.entry.deprecated);
    const dep  = list.filter(x =>  x.entry.deprecated);
    for (const { id, entry } of live) lines.push(...renderTermBlock(id, entry));
    if (dep.length) {
      lines.push('### (gedeprecieerde termen)');
      lines.push('');
      for (const { id, entry } of dep) lines.push(...renderTermBlock(id, entry));
    }
  }
  return lines.join('\n').replace(/\n+$/, '') + '\n';
}

function renderTermBlock(id, entry) {
  const out = [];
  out.push(`### ${id}`);
  out.push(`- **Term:** ${entry.term_nl}`);
  if (entry.definition_nl && entry.definition_nl.trim()) {
    out.push(`- **Definitie:** ${entry.definition_nl}`);
  } else {
    out.push(`- **Definitie:** _(definitie volgt)_`);
  }
  if (Array.isArray(entry.formulas) && entry.formulas.length) {
    const label = entry.formulas.length === 1 ? 'Formule' : 'Formules';
    const rendered = entry.formulas.map(f => '`' + f + '`').join(' · ');
    out.push(`- **${label}:** ${rendered}`);
  }
  if (entry.syllabus_clause) out.push(`- **Syllabus:** ${entry.syllabus_clause}`);
  if (entry.abbreviation)    out.push(`- **Afkorting:** ${entry.abbreviation}`);
  if (entry.english_equivalent) out.push(`- **Engels:** ${entry.english_equivalent}`);
  if (entry.synonyms_nl && entry.synonyms_nl.length) {
    out.push(`- **Synoniemen:** ${entry.synonyms_nl.join(', ')}`);
  }
  if (entry.related_terms && entry.related_terms.length) {
    out.push(`- **Gerelateerd:** ${entry.related_terms.join(', ')}`);
  }
  if (entry.notation_markers && entry.notation_markers.length) {
    out.push(`- **Notatie:** ${entry.notation_markers.join(', ')}`);
  }
  if (entry.example_nl) out.push(`- **Voorbeeld:** ${entry.example_nl}`);
  if (entry.pitfall_nl) out.push(`- **Let op:** ${entry.pitfall_nl}`);
  if (entry.deprecated_forms && entry.deprecated_forms.length) {
    out.push(`- **Vermijd:** ${entry.deprecated_forms.join(', ')}`);
  }
  if (entry.teaching_units && entry.teaching_units.length) {
    out.push(`- **Teaching-units:** ${entry.teaching_units.join(', ')}`);
  }
  if (entry.deprecated) {
    const tail = entry.deprecated_in_favor_of ? ` → ${entry.deprecated_in_favor_of}` : '';
    out.push(`- **Status:** deprecated${tail}`);
  }
  out.push('');
  return out;
}

// ----- coverage report -----

function renderCoverageReport(registry) {
  const entries = Object.values(registry.terms);
  const total = entries.length;
  const live  = entries.filter(e => !e.deprecated);
  const missingDef = live.filter(e => !e.definition_nl || !e.definition_nl.trim()).length;
  const missingExample = live.filter(e => !e.example_nl).length;
  const missingPitfall = live.filter(e => !e.pitfall_nl).length;
  const withFormula = live.filter(e => Array.isArray(e.formulas) && e.formulas.length > 0).length;
  const noUnits = live.filter(e => !e.teaching_units || e.teaching_units.length === 0).length;
  const noClause = live.filter(e => !e.syllabus_clause).length;

  const byDomain = {};
  for (const e of live) {
    const d = e.domain || '?';
    if (!byDomain[d]) byDomain[d] = { total: 0, missingDef: 0 };
    byDomain[d].total++;
    if (!e.definition_nl || !e.definition_nl.trim()) byDomain[d].missingDef++;
  }

  const lines = [];
  lines.push('# Begrippen coverage');
  lines.push('');
  lines.push(`*Gegenereerd ${new Date().toISOString().slice(0, 10)} door \`build-scripts/references/build-begrippen-index.js\`.*`);
  lines.push('');
  lines.push(`Totaal: **${total}** begrippen (${live.length} live, ${total - live.length} deprecated).`);
  lines.push('');
  lines.push('## Backlog per veld (live termen)');
  lines.push('');
  lines.push('| Veld | Ontbreekt | % |');
  lines.push('|---|---:|---:|');
  lines.push(`| definition_nl | ${missingDef} | ${pct(missingDef, live.length)} |`);
  lines.push(`| example_nl | ${missingExample} | ${pct(missingExample, live.length)} |`);
  lines.push(`| pitfall_nl | ${missingPitfall} | ${pct(missingPitfall, live.length)} |`);
  lines.push(`| teaching_units (reverse-link) | ${noUnits} | ${pct(noUnits, live.length)} |`);
  lines.push(`| syllabus_clause | ${noClause} | ${pct(noClause, live.length)} |`);
  lines.push('');
  lines.push(`Terms with at least one formula: **${withFormula}** of ${live.length}. (Not every term carries a formula, so this counts coverage, not a backlog.)`);
  lines.push('');
  lines.push('## Definities per domein');
  lines.push('');
  lines.push('| Domein | Termen | Missend | Dekking |');
  lines.push('|---|---:|---:|---:|');
  for (const d of DOMAINS) {
    const stats = byDomain[d];
    if (!stats) continue;
    const filled = stats.total - stats.missingDef;
    lines.push(`| ${d} — ${DOMAIN_TITLES[d]} | ${stats.total} | ${stats.missingDef} | ${pct(filled, stats.total)} |`);
  }
  lines.push('');
  if (missingDef > 0) {
    lines.push('## Termen zonder definitie');
    lines.push('');
    const noDef = live.filter(e => !e.definition_nl || !e.definition_nl.trim())
      .sort((a, b) => (a.domain + a.id).localeCompare(b.domain + b.id));
    for (const e of noDef) {
      lines.push(`- \`${e.id}\` (${e.domain}${e.syllabus_clause ? ` · ${e.syllabus_clause}` : ''}) — ${e.term_nl}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function pct(num, total) {
  if (!total) return '—';
  return `${Math.round((num / total) * 100)}%`;
}

// ----- main -----

function main() {
  const { flags } = parseFlagArgs(process.argv);
  const allowEmptyDefinitions = !!flags['allow-empty-definitions'];
  const quiet = !!flags.quiet;

  if (!fs.existsSync(BEGRIPPEN_JSON)) {
    console.error(`missing: ${BEGRIPPEN_JSON}`);
    console.error(`(run seed-begrippen.js first, or start fresh with term-add.js)`);
    process.exit(1);
  }

  const registry = loadRegistry();

  // Normalize all entries in place (ensures shape consistency on old files).
  for (const [id, entry] of Object.entries(registry.terms)) {
    registry.terms[id] = normalizeEntry({ ...entry, id });
  }

  const units = loadUnits();
  computeTeachingUnits(registry, units);

  const eindtermen = loadEindtermen();
  const { errors, warnings } = validate(registry, { eindtermen, allowEmptyDefinitions });

  if (warnings.length && !quiet) {
    // Collapse the empty-definition warnings (expected during migration)
    // into a single line; show other warnings verbatim.
    const emptyDef = warnings.filter(w => /definition_nl is empty/.test(w));
    const other    = warnings.filter(w => !/definition_nl is empty/.test(w));
    for (const w of other) console.warn('WARN   ' + w);
    if (emptyDef.length) console.warn(`WARN   ${emptyDef.length} term(s) with empty definition_nl (see reports/begrippen-coverage.md)`);
  }
  if (errors.length) {
    for (const e of errors) console.error('ERROR  ' + e);
    console.error(`\n${errors.length} validation error(s). Files NOT written.`);
    process.exit(1);
  }

  // Write JSON (sorted, normalized shape).
  const ids = Object.keys(registry.terms).sort();
  const outTerms = {};
  for (const id of ids) outTerms[id] = registry.terms[id];
  const outJson = {
    version: registry.version || VERSION,
    generated_at: new Date().toISOString(),
    terms: outTerms,
  };
  fs.writeFileSync(BEGRIPPEN_JSON, JSON.stringify(outJson, null, 2) + '\n');

  // Markdown projection
  fs.writeFileSync(BEGRIPPEN_MD, renderMarkdown(outJson));

  // Coverage report
  fs.mkdirSync(path.dirname(COVERAGE_REPORT), { recursive: true });
  fs.writeFileSync(COVERAGE_REPORT, renderCoverageReport(outJson) + '\n');

  if (!quiet) {
    const total = ids.length;
    const live = ids.filter(id => !outTerms[id].deprecated).length;
    console.log(`OK  ${total} begrippen (${live} live); wrote ${path.relative(REPO_ROOT, BEGRIPPEN_JSON)}, ${path.relative(REPO_ROOT, BEGRIPPEN_MD)}, ${path.relative(REPO_ROOT, COVERAGE_REPORT)}`);
  }
}

if (require.main === module) main();

module.exports = {
  validate,
  computeTeachingUnits,
  renderMarkdown,
  renderCoverageReport,
  loadEindtermen,
  loadUnits,
};
