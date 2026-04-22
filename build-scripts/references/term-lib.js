/**
 * term-lib.js — shared helpers for term-* mutation commands.
 *
 * The begrippen registry lives as JSON (source of truth) at
 * references/machine/begrippen.json; build-begrippen-index.js regenerates
 * a markdown projection at references/machine/begrippen.md and a coverage
 * report at reports/begrippen-coverage.md.
 *
 * Each term-* CLI (add, update, deprecate, rename) loads the registry,
 * mutates an entry, and invokes the regenerator to validate+write
 * atomically. This module centralises those steps so each command stays
 * small.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const BEGRIPPEN_JSON = path.join(REPO_ROOT, 'references/machine/begrippen.json');
const BEGRIPPEN_MD   = path.join(REPO_ROOT, 'references/machine/begrippen.md');
const EINDTERMEN_JSON = path.join(REPO_ROOT, 'references/external/syllabus-eindtermen.json');
const UNITS_JSON = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.json');
const COVERAGE_REPORT = path.join(REPO_ROOT, 'reports/begrippen-coverage.md');

const VERSION = '1.0.0';

const DOMAINS = ['D', 'E', 'F', 'G', 'H', 'I'];
const DOMAIN_TITLES = {
  D: 'Markt',
  E: 'Ruilen over de tijd',
  F: 'Samenwerken en onderhandelen',
  G: 'Risico en informatie',
  H: 'Welvaart en groei',
  I: 'Goede en slechte tijden',
};

const NOTATION_MARKERS = ['(1)', '(2)'];

// Fields an entry MUST have (empty string allowed for definition during
// migration, gated by --allow-empty-definitions).
const CORE_FIELDS = ['id', 'term_nl', 'definition_nl', 'domain'];

const DEFAULT_ENTRY = {
  id: '',
  term_nl: '',
  definition_nl: '',
  domain: '',
  syllabus_clause: null,
  abbreviation: null,
  english_equivalent: null,
  synonyms_nl: [],
  deprecated_forms: [],
  related_terms: [],
  notation_markers: [],
  formulas: [],            // list of Dutch-convention formula strings (e.g. "TK = TCK + TVK")
  example_nl: null,
  pitfall_nl: null,
  teaching_units: [],      // derived by build-begrippen-index
  deprecated: false,
  deprecated_in_favor_of: null,
};

// ----- id slug -----

function slugify(term) {
  if (typeof term !== 'string') return '';
  let s = term.trim().toLowerCase();
  // Normalize diacritics (ë → e, é → e, etc.)
  s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  // Strip gloss parentheticals: "arbeidsaanbod (= beroepsbevolking)" → "arbeidsaanbod"
  s = s.replace(/\s*\(=?[^)]*\)\s*$/, '');
  // Replace spaces + other non-alphanumerics with hyphens
  s = s.replace(/[^a-z0-9]+/g, '-');
  // Trim leading/trailing hyphens
  s = s.replace(/^-+|-+$/g, '');
  return s;
}

// ----- registry load/save -----

function loadRegistry() {
  if (!fs.existsSync(BEGRIPPEN_JSON)) {
    return {
      version: VERSION,
      generated_at: new Date().toISOString(),
      terms: {},
    };
  }
  const content = fs.readFileSync(BEGRIPPEN_JSON, 'utf8');
  let data;
  try {
    data = JSON.parse(content);
  } catch (err) {
    throw new Error(`failed to parse ${BEGRIPPEN_JSON}: ${err.message}`);
  }
  if (!data || typeof data !== 'object' || typeof data.terms !== 'object') {
    throw new Error(`${BEGRIPPEN_JSON} has unexpected shape (expected {version, terms})`);
  }
  return data;
}

function saveRegistryJson(registry) {
  const out = {
    version: registry.version || VERSION,
    generated_at: new Date().toISOString(),
    terms: {},
  };
  const ids = Object.keys(registry.terms).sort();
  for (const id of ids) out.terms[id] = normalizeEntry(registry.terms[id]);
  fs.writeFileSync(BEGRIPPEN_JSON, JSON.stringify(out, null, 2) + '\n');
  return out;
}

// Merge a partial spec into the default entry shape, preserving existing
// values when the spec key is undefined.
function mergeEntry(existing, patch) {
  const base = existing ? { ...existing } : { ...DEFAULT_ENTRY };
  for (const [k, v] of Object.entries(patch || {})) {
    if (v === undefined) continue;
    base[k] = v;
  }
  return normalizeEntry(base);
}

function normalizeEntry(entry) {
  const out = { ...DEFAULT_ENTRY, ...entry };
  // Coerce array-shaped fields
  for (const k of ['synonyms_nl', 'deprecated_forms', 'related_terms', 'notation_markers', 'formulas', 'teaching_units']) {
    if (!Array.isArray(out[k])) out[k] = [];
  }
  // Null-or-string fields: empty strings → null (except definition_nl which stays '')
  for (const k of ['abbreviation', 'english_equivalent', 'example_nl', 'pitfall_nl', 'syllabus_clause', 'deprecated_in_favor_of']) {
    if (out[k] === '' || out[k] === undefined) out[k] = null;
  }
  // Booleans
  out.deprecated = !!out.deprecated;
  // Trim term_nl / definition_nl
  if (typeof out.term_nl === 'string') out.term_nl = out.term_nl.trim();
  if (typeof out.definition_nl === 'string') out.definition_nl = out.definition_nl.trim();
  return out;
}

// ----- cli helpers -----

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

function splitCsv(v) {
  if (v === undefined || v === null || v === true || v === '') return [];
  return String(v).split(',').map(s => s.trim()).filter(Boolean);
}

// Build an entry-patch from CLI flags. Only sets keys that the user
// actually passed; never overwrites with undefined/null unless explicitly
// requested (e.g. --abbreviation "" clears the field).
function buildPatchFromFlags(flags) {
  const patch = {};
  const simple = {
    'id': 'id',
    'term-nl': 'term_nl',
    'definition-nl': 'definition_nl',
    'domain': 'domain',
    'syllabus-clause': 'syllabus_clause',
    'abbreviation': 'abbreviation',
    'english-equivalent': 'english_equivalent',
    'example-nl': 'example_nl',
    'pitfall-nl': 'pitfall_nl',
  };
  for (const [flag, field] of Object.entries(simple)) {
    if (Object.prototype.hasOwnProperty.call(flags, flag)) {
      const v = flags[flag];
      // Empty string or boolean-true (bare flag) → explicit clear to null
      if (v === '' || v === true) {
        patch[field] = field === 'definition_nl' || field === 'term_nl' || field === 'id' || field === 'domain' ? '' : null;
      } else {
        patch[field] = String(v);
      }
    }
  }
  for (const listFlag of ['synonyms-nl', 'deprecated-forms', 'related-terms', 'notation-markers', 'formulas']) {
    if (Object.prototype.hasOwnProperty.call(flags, listFlag)) {
      const field = listFlag.replace(/-/g, '_');
      patch[field] = splitCsv(flags[listFlag]);
    }
  }
  return patch;
}

function reportErrors(errs) {
  for (const e of errs) console.error('ERROR  ' + e);
  console.error(`\n${errs.length} validation error(s). Registry NOT written.`);
}

// saveAtomically validates + writes all three derived files (begrippen.json,
// begrippen.md, reports/begrippen-coverage.md) in a single in-process pass.
// On any validation error, NOTHING is written (unlike a spawnSync indexer
// which would leave a partially-updated JSON behind). Always safe to call
// from term-*.js after mutating the in-memory registry.
function saveAtomically(registry, { allowEmptyDefinitions = true, quiet = true } = {}) {
  const {
    validate,
    computeTeachingUnits,
    renderMarkdown,
    renderCoverageReport,
    loadEindtermen,
    loadUnits,
  } = require('./build-begrippen-index');

  // Normalize all entries (ensures shape consistency)
  for (const [id, entry] of Object.entries(registry.terms)) {
    registry.terms[id] = normalizeEntry({ ...entry, id });
  }

  const units = loadUnits();
  computeTeachingUnits(registry, units);

  const eindtermen = loadEindtermen();
  const { errors, warnings } = validate(registry, { eindtermen, allowEmptyDefinitions });
  if (errors.length) {
    const e = new Error('validation failed');
    e.errors = errors;
    throw e;
  }
  if (warnings.length && !quiet) {
    const emptyDef = warnings.filter(w => /definition_nl is empty/.test(w));
    const other    = warnings.filter(w => !/definition_nl is empty/.test(w));
    for (const w of other) console.warn('WARN   ' + w);
    if (emptyDef.length) console.warn(`WARN   ${emptyDef.length} term(s) with empty definition_nl (see reports/begrippen-coverage.md)`);
  }

  // Now write atomically: the registry JSON, the markdown projection, the coverage report.
  const ids = Object.keys(registry.terms).sort();
  const outTerms = {};
  for (const id of ids) outTerms[id] = registry.terms[id];
  const outJson = {
    version: registry.version || VERSION,
    generated_at: new Date().toISOString(),
    terms: outTerms,
  };
  fs.writeFileSync(BEGRIPPEN_JSON, JSON.stringify(outJson, null, 2) + '\n');
  fs.writeFileSync(BEGRIPPEN_MD, renderMarkdown(outJson));
  fs.mkdirSync(path.dirname(COVERAGE_REPORT), { recursive: true });
  fs.writeFileSync(COVERAGE_REPORT, renderCoverageReport(outJson) + '\n');
}

module.exports = {
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
  CORE_FIELDS,
  DEFAULT_ENTRY,
  slugify,
  loadRegistry,
  saveRegistryJson,
  mergeEntry,
  normalizeEntry,
  parseFlagArgs,
  splitCsv,
  buildPatchFromFlags,
  reportErrors,
  saveAtomically,
};
