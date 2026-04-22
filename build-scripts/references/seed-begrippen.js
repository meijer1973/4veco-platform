#!/usr/bin/env node
/**
 * seed-begrippen.js — one-time migration: parse the legacy markdown
 * reference `references/authored/economie-terminologie.md` and produce
 * initial `references/machine/begrippen.json` entries with empty
 * definitions for editorial filling.
 *
 * Usage:
 *   node build-scripts/references/seed-begrippen.js [--force]
 *
 * Refuses to overwrite an existing begrippen.json unless --force is given.
 * After writing, invokes build-begrippen-index.js --allow-empty-definitions
 * --quiet to validate and regenerate markdown + coverage report.
 */

const fs = require('fs');
const path = require('path');

const {
  REPO_ROOT,
  BEGRIPPEN_JSON,
  VERSION,
  DOMAINS,
  slugify,
  mergeEntry,
  saveAtomically,
  reportErrors,
} = require('./term-lib');

const SOURCE_MD = path.join(REPO_ROOT, 'references/authored/economie-terminologie.md');

function main() {
  const force = process.argv.includes('--force');
  if (fs.existsSync(BEGRIPPEN_JSON) && !force) {
    console.error(`ERROR  ${BEGRIPPEN_JSON} already exists; pass --force to overwrite`);
    process.exit(1);
  }
  if (!fs.existsSync(SOURCE_MD)) {
    console.error(`ERROR  missing source: ${SOURCE_MD}`);
    process.exit(1);
  }

  const content = fs.readFileSync(SOURCE_MD, 'utf8');
  const { entries, skipped } = parseTerminology(content);
  applyPitfalls(entries, content);

  const registry = {
    version: VERSION,
    generated_at: new Date().toISOString(),
    terms: {},
  };
  for (const id of Object.keys(entries).sort()) registry.terms[id] = entries[id];

  try {
    saveAtomically(registry, { allowEmptyDefinitions: true, quiet: true });
  } catch (err) {
    if (err && err.errors) reportErrors(err.errors);
    else console.error('ERROR  ' + err.message);
    process.exit(1);
  }

  console.log(`OK  seeded ${Object.keys(entries).length} begrippen from ${path.relative(REPO_ROOT, SOURCE_MD)}`);
  if (skipped.length) {
    console.log(`    skipped ${skipped.length} rows (cross-domain / non-term / duplicate):`);
    for (const s of skipped.slice(0, 10)) console.log(`      - ${s}`);
    if (skipped.length > 10) console.log(`      ... and ${skipped.length - 10} more`);
  }
  console.log('OK  wrote begrippen.json + begrippen.md + coverage report');
}

// ----- parse state machine -----

// Column layouts seen in economie-terminologie.md:
//   5-col:  | # | Dutch term | Abbreviation | English | Notes |
//   4-col:  | # | Dutch term | English | Notes |
const LAYOUT_5 = ['#', 'term', 'abbr', 'english', 'notes'];
const LAYOUT_4 = ['#', 'term', 'english', 'notes'];

function parseTerminology(content) {
  const lines = content.split(/\r?\n/);
  const entries = {};
  const skipped = [];

  let currentDomain = null;   // 'D' / 'E' / ...
  let currentSub = null;      // 'D1' / 'D2' / ...
  let layout = null;
  let inCrossDomain = false;
  let inPitfalls = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Section markers
    const h2 = line.match(/^##\s+Domein\s+([A-Z]):\s*/);
    if (h2) {
      currentDomain = h2[1];
      currentSub = null;
      layout = null;
      inCrossDomain = false;
      inPitfalls = false;
      continue;
    }
    if (/^##\s+Cross-domain\s+terms/i.test(line)) {
      currentDomain = null;
      currentSub = null;
      layout = null;
      inCrossDomain = true;
      inPitfalls = false;
      continue;
    }
    if (/^##\s+Common\s+pitfalls/i.test(line)) {
      inCrossDomain = false;
      inPitfalls = true;
      layout = null;
      continue;
    }
    if (/^##\s/.test(line)) {
      // Other h2 sections (formulas, etc.) — reset
      currentDomain = null;
      currentSub = null;
      layout = null;
      inCrossDomain = false;
      inPitfalls = false;
      continue;
    }

    const h3 = line.match(/^###\s+([A-Z]\d+):\s*(.+)$/);
    if (h3) {
      currentSub = h3[1];
      layout = null;
      continue;
    }

    // Table header / separator
    if (/^\|\s*#\s*\|/.test(line)) {
      // Count cells (minus the leading+trailing pipe guard)
      const cells = splitRow(line);
      if (cells.length === 5) layout = LAYOUT_5;
      else if (cells.length === 4) layout = LAYOUT_4;
      else layout = null;
      continue;
    }
    if (/^\|\s*-+\s*\|/.test(line)) continue;  // separator

    // Data row: only process if we're in a section with a known layout
    if (!/^\|/.test(line)) continue;
    if (!layout || !currentDomain || inCrossDomain || inPitfalls) {
      if ((inCrossDomain || inPitfalls) && /^\|/.test(line)) continue;
      continue;
    }

    const cells = splitRow(line);
    if (cells.length !== layout.length) continue;

    const row = {};
    for (let k = 0; k < layout.length; k++) row[layout[k]] = cells[k];

    // Filter: skip header-repeat rows
    if (row['#'] === '#' || /dutch term/i.test(row.term || '')) continue;

    const termCell = row.term || '';
    if (!termCell || termCell === '—' || termCell === '-') continue;

    const clauseRaw = row['#'] || '';
    const clause = buildClause(currentSub, clauseRaw);
    const abbreviation = parseAbbrCell(row.abbr);
    const english = cleanCell(row.english);
    const notes = cleanCell(row.notes);
    const notationMarkers = extractNotationMarkers(notes);

    // Split term alternatives (e.g. "marktevenwicht / evenwichtsprijs").
    for (const variant of splitTermVariants(termCell)) {
      const { canonical, synonyms } = parseGloss(variant);
      const id = slugify(canonical);
      if (!id) {
        skipped.push(`[${currentSub || currentDomain}] could not slug: ${variant}`);
        continue;
      }
      if (entries[id]) {
        // Already seeded — keep first hit, note duplicate
        skipped.push(`duplicate id "${id}" (second occurrence under ${currentSub || currentDomain}: ${termCell})`);
        continue;
      }

      const entry = mergeEntry(null, {
        id,
        term_nl: canonical,
        definition_nl: '',
        domain: currentDomain,
        syllabus_clause: clause,
        abbreviation,
        english_equivalent: english || null,
        synonyms_nl: synonyms,
        deprecated_forms: [],
        related_terms: [],
        notation_markers: notationMarkers,
        example_nl: null,
        pitfall_nl: notes && !notationMarkers.length ? null : null,
        teaching_units: [],
        deprecated: false,
        deprecated_in_favor_of: null,
      });
      entries[id] = entry;
    }
  }

  return { entries, skipped };
}

function splitRow(line) {
  // Drop leading and trailing pipes, split on inner pipes, trim.
  let l = line.trim();
  if (l.startsWith('|')) l = l.slice(1);
  if (l.endsWith('|')) l = l.slice(0, -1);
  return l.split('|').map(c => c.trim());
}

function buildClause(sub, num) {
  if (!sub || !num || num === '—' || num === '-') return null;
  // Accept only clean "<major>.<minor>" with no alpha suffix — 1.4a style
  // numbers are textbook decompositions that don't map to a single
  // syllabus eindterm, so we leave the clause blank for editorial
  // fix-up later.
  const m = String(num).match(/^(\d+)\.(\d+)$/);
  if (!m) return null;
  return `${sub}.${m[2]}`;
}

function parseAbbrCell(raw) {
  if (!raw) return null;
  const s = raw.trim();
  if (s === '—' || s === '-' || s === '') return null;
  // Discard cells that are clearly not abbreviations (sentences or long formulas)
  if (s.length > 20 || /\s/.test(s) && !/^[A-Z][A-Za-z]*(?:[/,]\s*[A-Z][A-Za-z]*)*$/.test(s)) {
    // Could be a formula like "Y = Af(K, L)" — keep short ones, drop sentences
    if (!/^[A-Z0-9\s,\/\-\.]+$/.test(s)) return null;
  }
  return s;
}

function cleanCell(raw) {
  if (!raw) return null;
  const s = raw.trim();
  if (s === '' || s === '—' || s === '-') return null;
  return s;
}

function extractNotationMarkers(notes) {
  if (!notes) return [];
  const out = [];
  if (/\(1\)/.test(notes)) out.push('(1)');
  if (/\(2\)/.test(notes)) out.push('(2)');
  return out;
}

function splitTermVariants(cell) {
  // Split on " / " (slash surrounded by spaces) — canonical variant delimiter.
  // Do NOT split on "/" without spaces (e.g. "R&D").
  return cell.split(/\s+\/\s+/).map(s => s.trim()).filter(Boolean);
}

function parseGloss(term) {
  // "arbeidsaanbod (= beroepsbevolking)" → canonical = "arbeidsaanbod", synonyms = ["beroepsbevolking"]
  // "monetair beleid (rentebeleid)"       → canonical = "monetair beleid", synonyms = ["rentebeleid"]
  // "*moral hazard*"                       → canonical = "moral hazard", synonyms = []
  let canonical = term.trim();
  const synonyms = [];
  const glossMatch = canonical.match(/^(.+?)\s*\(=?\s*([^)]+?)\)\s*$/);
  if (glossMatch) {
    canonical = glossMatch[1].trim();
    const gloss = glossMatch[2].trim();
    if (gloss) synonyms.push(gloss);
  }
  // Strip italics markers (*...*)
  canonical = canonical.replace(/^\*+|\*+$/g, '').trim();
  // Strip roman-numeral prefix "I " / "II " / "III " / "IV " that appears in
  // marktvorm rows ("I volkomen concurrentie")
  canonical = canonical.replace(/^(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\s+/, '').trim();
  return { canonical, synonyms };
}

// ----- pitfalls → deprecated_forms -----

function applyPitfalls(entries, content) {
  // Find the "Common pitfalls" h2 section; parse each row.
  const startIdx = content.search(/^##\s+Common\s+pitfalls/m);
  if (startIdx === -1) return;
  const rest = content.slice(startIdx);
  const endIdx = rest.search(/^##\s(?!.*Common\s+pitfalls)/m);
  const section = endIdx === -1 ? rest : rest.slice(0, endIdx);

  const lines = section.split(/\r?\n/);
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const cells = splitRow(line);
    if (cells.length !== 2) continue;
    const wrongCell = cells[0];
    const correctCell = cells[1];
    if (!wrongCell || !correctCell) continue;
    if (/wrong\s+or\s+informal/i.test(wrongCell)) continue;
    if (/^-+$/.test(wrongCell)) continue;

    const wrongForm = extractWrongForm(wrongCell);
    if (!wrongForm) continue;

    const targetId = findTargetId(correctCell, entries);
    if (!targetId) continue;

    const e = entries[targetId];
    if (!e.deprecated_forms) e.deprecated_forms = [];
    if (!e.deprecated_forms.includes(wrongForm)) e.deprecated_forms.push(wrongForm);
  }
}

function extractWrongForm(cell) {
  // Cells look like `expansionary fiscal policy (as "expansief begrotingsbeleid")`
  // or plain `supply`. We want the Dutch "(as ...)" form if present, else the
  // cell itself (for pure English→Dutch mistakes like "supply").
  const asMatch = cell.match(/\(as\s+["'](.+?)["']\)/i);
  if (asMatch) return asMatch[1].trim();
  return cell.replace(/[*_`]/g, '').trim();
}

function findTargetId(correctCell, entries) {
  // Strip inline comments after em-dash or en-dash.
  let s = correctCell.replace(/\s+[—–-]\s+.*$/, '').trim();
  // Take the first "/" segment.
  s = s.split(/\s*\/\s*/)[0].trim();
  // Strip parenthetical: "totale kosten (TK)" → "totale kosten"
  s = s.replace(/\s*\([^)]*\)\s*$/, '').trim();
  // Strip leading "*"
  s = s.replace(/^\*+|\*+$/g, '').trim();
  if (!s) return null;
  const slug = slugify(s);
  return entries[slug] ? slug : null;
}

if (require.main === module) main();
