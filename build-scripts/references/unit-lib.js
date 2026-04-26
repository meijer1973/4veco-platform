/**
 * unit-lib.js — shared helpers for unit-* mutation commands.
 *
 * Each unit-* CLI (rename, update, deprecate, add-dep, remove-dep, split,
 * merge) loads the catalog, mutates in memory, runs the full validator, and
 * writes markdown + regenerated JSON atomically. This module centralises
 * those steps so each command stays small.
 */

const fs = require('fs');
const path = require('path');
const {
  parseMarkdown,
  validate,
  computeLayers,
  buildJsonEntry,
  sortUnits,
  loadTerminology,
  loadEindtermen,
} = require('./build-unit-index');
const { formatEntry } = require('./unit-add');

const REPO_ROOT  = path.resolve(__dirname, '..', '..');
const UNITS_MD   = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.md');
const UNITS_JSON = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.json');
const UNITS_MARKER = '<!-- UNIT ENTRIES BELOW THIS LINE';

function loadCatalog() {
  if (!fs.existsSync(UNITS_MD)) throw new Error(`missing: ${UNITS_MD}`);
  const content = fs.readFileSync(UNITS_MD, 'utf8');
  const markerIdx = content.indexOf(UNITS_MARKER);
  if (markerIdx === -1) throw new Error(`cannot find units marker in ${UNITS_MD}`);
  const endOfMarker = content.indexOf('\n', markerIdx);
  const preamble = content.slice(0, endOfMarker + 1);
  const units = parseMarkdown(content);
  const byId = new Map(units.map(u => [u.id, u]));
  return { preamble, units, byId };
}

function buildStatsLine(units) {
  const live = units.filter(u => !u.deprecated);
  const byLetter = {};
  for (const u of live) byLetter[u.id[0]] = (byLetter[u.id[0]] || 0) + 1;
  const order = ['A','B','C','D','E','F','G','H','I','J','K','L'];
  const parts = order.filter(l => byLetter[l]).map(l => `${l}=${byLetter[l]}`);
  const date = new Date().toISOString().slice(0, 10);
  return `*${live.length} live units as of ${date} — ${parts.join(', ')}.*`;
}

function renderPreamble(preamble, units) {
  const statsLine = buildStatsLine(units);
  // Paired markers bound the stats block exactly. Replace everything between
  // <!-- STATS LINE --> and <!-- STATS END --> inclusive, so nothing below
  // the close marker (e.g. the B/C/J/K design note) is consumed, and any
  // orphan stats lines left by earlier narrower regexes get flushed.
  return preamble.replace(
    /<!-- STATS LINE -->[\s\S]*?<!-- STATS END -->/,
    `<!-- STATS LINE -->\n${statsLine}\n<!-- STATS END -->`
  );
}

function rebuildMarkdown(preamble, units) {
  const sorted = sortUnits(units);
  const blocks = sorted.map(u => formatEntry(u).trim());
  return renderPreamble(preamble, units) + '\n' + blocks.join('\n\n') + '\n';
}

function saveCatalog({ preamble, units, dryRun = false }) {
  const newContent = rebuildMarkdown(preamble, units);
  const nextUnits = parseMarkdown(newContent);
  const storedLayerIds = new Set(nextUnits.filter(u => typeof u.layer === 'number').map(u => u.id));
  const context = {
    terms: loadTerminology(),
    eindtermen: loadEindtermen(),
  };
  const initial = validate(nextUnits, {
    ...context,
    skipStoredLayerValidation: true,
  });
  if (initial.errors.length) {
    const err = new Error('validation failed');
    err.errors = initial.errors;
    throw err;
  }
  computeLayers(nextUnits, initial.byId);
  const final = validate(nextUnits, context);
  if (final.errors.length) {
    const err = new Error('validation failed');
    err.errors = final.errors;
    throw err;
  }
  const jsonEntries = sortUnits(nextUnits).map(buildJsonEntry);
  const markdownUnits = nextUnits.map((u) => {
    if (storedLayerIds.has(u.id)) return u;
    const copy = { ...u };
    delete copy.layer;
    return copy;
  });
  const finalContent = rebuildMarkdown(preamble, markdownUnits);
  if (dryRun) return nextUnits.length;
  fs.writeFileSync(UNITS_MD, finalContent);
  fs.writeFileSync(UNITS_JSON, JSON.stringify(jsonEntries, null, 2) + '\n');
  return nextUnits.length;
}

function parseFlagArgs(argv) {
  const args = argv.slice(2);
  const flags = {};
  let spec = null;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--spec') {
      spec = JSON.parse(args[++i]);
    } else if (a.startsWith('--')) {
      const key = a.slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true;
      flags[key] = value;
    }
  }
  return { flags, spec };
}

function requireUnit(byId, id) {
  const u = byId.get(id);
  if (!u) {
    console.error(`ERROR  unit ${id} not found in catalog`);
    process.exit(1);
  }
  return u;
}

function reportValidationErrors(err) {
  if (err && err.errors) {
    for (const e of err.errors) console.error('CATALOG  ' + e);
    console.error(`\n${err.errors.length} validation error(s). Catalog NOT written.`);
  } else {
    console.error('ERROR  ' + err.message);
  }
}

module.exports = {
  loadCatalog,
  saveCatalog,
  rebuildMarkdown,
  renderPreamble,
  buildStatsLine,
  parseFlagArgs,
  requireUnit,
  reportValidationErrors,
  UNITS_MD,
  UNITS_JSON,
  REPO_ROOT,
};
