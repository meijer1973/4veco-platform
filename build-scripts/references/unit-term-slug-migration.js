#!/usr/bin/env node
/**
 * unit-term-slug-migration.js
 *
 * Migrates safe unit `terms` values from Dutch display strings to
 * `references/machine/begrippen.json` slug IDs. Missing or ambiguous terms
 * are reported and left unchanged.
 *
 * Usage:
 *   node build-scripts/references/unit-term-slug-migration.js
 *   node build-scripts/references/unit-term-slug-migration.js --write
 */

const fs = require('fs');
const path = require('path');
const { parseMarkdown } = require('./build-unit-index');
const { saveCatalog, REPO_ROOT, UNITS_MD } = require('./unit-lib');
const { slugify } = require('./term-lib');

const BEGRIPPEN_JSON = path.join(REPO_ROOT, 'references/machine/begrippen.json');
const REPORT_MD = path.join(REPO_ROOT, 'reports/unit-term-slug-migration.md');
const REPORT_JSON = path.join(REPO_ROOT, 'reports/json/unit-term-slug-migration.json');

function parseArgs(argv) {
  return { write: argv.includes('--write') };
}

function normalize(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function stripGloss(value) {
  return normalize(value).replace(/\s*\(=?[^)]*\)\s*$/, '').trim();
}

function addLookup(lookup, key, id, via) {
  const normalized = normalize(key);
  if (!normalized) return;
  if (!lookup.has(normalized)) lookup.set(normalized, []);
  lookup.get(normalized).push({ id, via, key });
}

function buildLookup(registry) {
  const lookup = new Map();
  for (const [id, entry] of Object.entries(registry.terms || {})) {
    if (entry.deprecated) continue;
    addLookup(lookup, id, id, 'id');
    addLookup(lookup, entry.term_nl, id, 'term_nl');
    addLookup(lookup, slugify(entry.term_nl), id, 'slugify(term_nl)');
    for (const synonym of entry.synonyms_nl || []) addLookup(lookup, synonym, id, 'synonym');
    for (const deprecated of entry.deprecated_forms || []) addLookup(lookup, deprecated, id, 'deprecated_form');
  }
  return lookup;
}

function classifyTerm(term, lookup) {
  const keys = [...new Set([normalize(term), stripGloss(term), normalize(slugify(term))])].filter(Boolean);
  const hits = [];
  for (const key of keys) {
    for (const hit of lookup.get(key) || []) hits.push(hit);
  }
  const uniqueIds = [...new Set(hits.map(hit => hit.id))];
  if (uniqueIds.length === 1) {
    const id = uniqueIds[0];
    return {
      status: id === term ? 'already_slug' : 'safe',
      id,
      via: [...new Set(hits.filter(hit => hit.id === id).map(hit => hit.via))],
    };
  }
  if (uniqueIds.length > 1) return { status: 'ambiguous', candidate_ids: uniqueIds };
  return { status: 'unresolved', candidate_ids: [] };
}

function buildReport({ write, units, registry, decisions, changedUnits }) {
  const uniqueTerms = Object.keys(decisions).sort((a, b) => a.localeCompare(b));
  const safe = uniqueTerms.filter(term => decisions[term].status === 'safe');
  const alreadySlug = uniqueTerms.filter(term => decisions[term].status === 'already_slug');
  const unresolved = uniqueTerms.filter(term => decisions[term].status === 'unresolved');
  const ambiguous = uniqueTerms.filter(term => decisions[term].status === 'ambiguous');

  const json = {
    schema_version: '0.1',
    sprint_id: 'R4.1',
    generated_on: new Date().toISOString().slice(0, 10),
    mode: write ? 'write' : 'dry_run',
    unit_count: units.length,
    term_registry_count: Object.keys(registry.terms || {}).length,
    unique_unit_terms: uniqueTerms.length,
    safe_mappings: safe.length,
    already_slug: alreadySlug.length,
    unresolved: unresolved.length,
    ambiguous: ambiguous.length,
    changed_units: changedUnits,
    unresolved_queue: unresolved.map(term => ({ term, next_action: 'review whether term belongs in begrippen.json or should stay authored-only' })),
    ambiguous_queue: ambiguous.map(term => ({ term, candidate_ids: decisions[term].candidate_ids })),
    mapping: Object.fromEntries(uniqueTerms.map(term => [term, decisions[term]])),
  };

  fs.mkdirSync(path.dirname(REPORT_JSON), { recursive: true });
  fs.writeFileSync(REPORT_JSON, JSON.stringify(json, null, 2) + '\n');

  const lines = [];
  lines.push('# Unit-Term Slug Migration');
  lines.push('');
  lines.push(`Generated: ${json.generated_on}`);
  lines.push(`Mode: \`${json.mode}\``);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Unit count: ${json.unit_count}`);
  lines.push(`- Term registry count: ${json.term_registry_count}`);
  lines.push(`- Unique unit term strings: ${json.unique_unit_terms}`);
  lines.push(`- Safe mappings: ${json.safe_mappings}`);
  lines.push(`- Already slug IDs: ${json.already_slug}`);
  lines.push(`- Unresolved: ${json.unresolved}`);
  lines.push(`- Ambiguous: ${json.ambiguous}`);
  lines.push(`- Changed units: ${changedUnits.length}`);
  lines.push('');
  lines.push('## Safe Mappings');
  lines.push('');
  for (const term of safe) lines.push(`- \`${term}\` -> \`${decisions[term].id}\` (${decisions[term].via.join(', ')})`);
  if (!safe.length) lines.push('None.');
  lines.push('');
  lines.push('## Unresolved Queue');
  lines.push('');
  for (const term of unresolved) lines.push(`- \`${term}\` -> no exact unique match in \`begrippen.json\``);
  if (!unresolved.length) lines.push('None.');
  lines.push('');
  lines.push('## Ambiguous Queue');
  lines.push('');
  for (const term of ambiguous) lines.push(`- \`${term}\` -> ${decisions[term].candidate_ids.join(', ')}`);
  if (!ambiguous.length) lines.push('None.');
  lines.push('');
  lines.push('## Changed Units');
  lines.push('');
  for (const item of changedUnits) {
    lines.push(`- \`${item.unit_id}\`: ${item.before.map(t => `\`${t}\``).join(', ')} -> ${item.after.map(t => `\`${t}\``).join(', ')}`);
  }
  if (!changedUnits.length) lines.push('None.');

  fs.writeFileSync(REPORT_MD, lines.join('\n') + '\n');
  return json;
}

function main() {
  const { write } = parseArgs(process.argv.slice(2));
  const registry = JSON.parse(fs.readFileSync(BEGRIPPEN_JSON, 'utf8'));
  const content = fs.readFileSync(UNITS_MD, 'utf8');
  const marker = '<!-- UNIT ENTRIES BELOW THIS LINE';
  const markerIdx = content.indexOf(marker);
  const endOfMarker = content.indexOf('\n', markerIdx);
  const preamble = content.slice(0, endOfMarker + 1);
  const units = parseMarkdown(content);
  const lookup = buildLookup(registry);

  const uniqueTerms = [...new Set(units.flatMap(unit => Array.isArray(unit.terms) ? unit.terms : []))];
  const decisions = {};
  for (const term of uniqueTerms) decisions[term] = classifyTerm(term, lookup);

  const changedUnits = [];
  for (const unit of units) {
    if (!Array.isArray(unit.terms) || !unit.terms.length) continue;
    const before = unit.terms.slice();
    const after = before.map(term => {
      const decision = decisions[term];
      return decision && (decision.status === 'safe' || decision.status === 'already_slug') ? decision.id : term;
    });
    unit.terms = [...new Set(after)];
    if (before.join('\u0000') !== unit.terms.join('\u0000')) {
      changedUnits.push({ unit_id: unit.id, before, after: unit.terms.slice() });
    }
  }

  const report = buildReport({ write, units, registry, decisions, changedUnits });
  if (write) saveCatalog({ preamble, units });

  console.log(`OK  unit-term slug migration ${write ? 'wrote' : 'dry-run'}: ${report.safe_mappings} safe, ${report.unresolved} unresolved, ${report.ambiguous} ambiguous, ${changedUnits.length} unit(s) changed`);
  if (report.unresolved || report.ambiguous) {
    console.log(`NOTE unresolved/ambiguous terms were reported but left unchanged: ${path.relative(REPO_ROOT, REPORT_MD)}`);
  }
}

if (require.main === module) main();
