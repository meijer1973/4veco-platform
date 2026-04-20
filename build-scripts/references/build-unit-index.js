#!/usr/bin/env node
/**
 * build-unit-index.js
 *
 * Parse `references/machine/micro-teaching-units.md`, validate, emit
 * `references/machine/micro-teaching-units.json`. Every `unit-*` CLI
 * command invokes this at the end of its write. Can also run standalone
 * as a full-catalog check.
 *
 * Exit code 0 on success, 1 on any validation failure.
 *
 * See knowledge/micro-teaching-units-plan.md §3 for the schema and §5
 * for the machine-only-editing contract.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const UNITS_MD   = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.md');
const UNITS_JSON = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.json');
const TERMINOLOGY_MD = path.join(REPO_ROOT, 'references/authored/economie-terminologie.md');
const EINDTERMEN_JSON = path.join(REPO_ROOT, 'references/external/syllabus-eindtermen.json');

const UNITS_MARKER = '<!-- UNIT ENTRIES BELOW THIS LINE';
const ID_RE = /^[A-K]\d{2}$/;
const CATEGORY = {
  A: 'vaardigheden',
  B: 'schaarste',
  C: 'ruil',
  D: 'markt',
  E: 'ruilen over tijd',
  F: 'samenwerken en onderhandelen',
  G: 'risico en informatie',
  H: 'welvaart en groei',
  I: 'goede en slechte tijden',
  J: 'onderzoek en experiment',
  K: 'keuzeonderwerpen',
};
const BLOOM_LEVELS = ['remember', 'understand', 'apply', 'analyze', 'evaluate'];
const APPLY_OR_HIGHER = new Set(['apply', 'analyze', 'evaluate']);
const PRIOR_LEARNING = ['previously_taught', 'new_this_year', 'review_and_extend'];
const REQUIRED_FIELDS = ['kern', 'needs', 'mastery_target', 'prior_learning', 'terms'];

// ----- parsing -----

function parseMarkdown(content) {
  const markerIdx = content.indexOf(UNITS_MARKER);
  if (markerIdx === -1) return [];
  const section = content.slice(markerIdx);
  const blocks = section.split(/^### /m).slice(1);
  return blocks.map(parseBlock).filter(Boolean);
}

function parseBlock(raw) {
  const lines = raw.split(/\r?\n/);
  const header = lines[0] || '';
  const headerMatch = header.match(/^(\S+)(?:\s+(.*))?$/);
  if (!headerMatch) return null;
  const id = headerMatch[1].trim();
  const name = (headerMatch[2] || '').trim();
  if (!id) return null;

  const unit = { id, name };
  let i = 1;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) { i++; continue; }
    const fieldMatch = line.match(/^- (\w+):(.*)$/);
    if (!fieldMatch) { i++; continue; }
    const [, key, tail] = fieldMatch;
    const value = tail.trim();
    if (value.length > 0) {
      unit[key] = parseInlineValue(value);
      i++;
    } else {
      // multi-line field; consume indented continuation
      const sub = [];
      i++;
      while (i < lines.length && /^\s+\S/.test(lines[i])) {
        sub.push(lines[i].replace(/^\s+(?:[-\d]+\.?\s+)?/, '').trim());
        i++;
      }
      unit[key] = sub;
    }
  }
  return unit;
}

function parseInlineValue(raw) {
  // List form: [a, b, c]
  if (/^\[.*\]$/.test(raw)) {
    const inner = raw.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
  }
  // Quoted string
  if (/^".*"$/.test(raw) || /^'.*'$/.test(raw)) return raw.slice(1, -1);
  // Boolean
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  // Integer
  if (/^-?\d+$/.test(raw)) return parseInt(raw, 10);
  // Plain string
  return raw;
}

// ----- validation -----

function validate(units, { terms, eindtermen }) {
  const errors = [];
  const byId = new Map();

  for (const u of units) {
    if (!ID_RE.test(u.id)) {
      errors.push(`${u.id}: invalid ID format (expected [A-K]\\d\\d)`);
      continue;
    }
    if (byId.has(u.id)) {
      errors.push(`${u.id}: duplicate ID`);
      continue;
    }
    byId.set(u.id, u);

    for (const f of REQUIRED_FIELDS) {
      if (u[f] === undefined || u[f] === null) {
        errors.push(`${u.id}: missing required field "${f}"`);
      }
    }

    if (!Array.isArray(u.needs)) {
      errors.push(`${u.id}: needs must be a list`);
    }
    if (u.mastery_target && !BLOOM_LEVELS.includes(u.mastery_target)) {
      errors.push(`${u.id}: mastery_target "${u.mastery_target}" not in ${BLOOM_LEVELS.join('|')}`);
    }
    if (u.prior_learning && !PRIOR_LEARNING.includes(u.prior_learning)) {
      errors.push(`${u.id}: prior_learning "${u.prior_learning}" not in ${PRIOR_LEARNING.join('|')}`);
    }
    if (u.duration_min !== undefined && (u.duration_min < 3 || u.duration_min > 7)) {
      // warning, not a fatal error — log to stderr but don't fail
      console.warn(`[warn] ${u.id}: duration_min=${u.duration_min} outside 3-7 range`);
    }
    if (APPLY_OR_HIGHER.has(u.mastery_target)) {
      if (!u.procedure || (Array.isArray(u.procedure) && u.procedure.length === 0)) {
        errors.push(`${u.id}: mastery_target=${u.mastery_target} requires non-empty procedure`);
      }
    }
    if (u.generator && !u.id.startsWith('A')) {
      errors.push(`${u.id}: generator field is only valid for A-domain units`);
    }
    if (u.id.startsWith('A') && u.generator === undefined && !u.deprecated) {
      errors.push(`${u.id}: A-domain units require a generator field`);
    }

    if (Array.isArray(u.terms) && terms) {
      for (const t of u.terms) {
        if (!terms.has(t)) errors.push(`${u.id}: term "${t}" not found in economie-terminologie.md`);
      }
    }
    if (Array.isArray(u.exam_codes) && eindtermen) {
      for (const code of u.exam_codes) {
        if (!eindtermen.has(code)) errors.push(`${u.id}: exam_code "${code}" not found in syllabus-eindtermen.json`);
      }
    }
  }

  // cross-ref needs and cycle detect
  for (const u of units) {
    if (!Array.isArray(u.needs)) continue;
    for (const n of u.needs) {
      if (!byId.has(n)) errors.push(`${u.id}: needs references unknown unit "${n}"`);
    }
  }
  const cycles = findCycles(units, byId);
  for (const c of cycles) errors.push(`cycle detected: ${c.join(' -> ')}`);

  return { errors, byId };
}

function findCycles(units, byId) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map();
  for (const u of units) color.set(u.id, WHITE);
  const cycles = [];
  function visit(id, stack) {
    if (color.get(id) === BLACK) return;
    if (color.get(id) === GRAY) {
      const idx = stack.indexOf(id);
      cycles.push(stack.slice(idx).concat(id));
      return;
    }
    color.set(id, GRAY);
    stack.push(id);
    const u = byId.get(id);
    if (u && Array.isArray(u.needs)) {
      for (const n of u.needs) if (byId.has(n)) visit(n, stack);
    }
    stack.pop();
    color.set(id, BLACK);
  }
  for (const u of units) visit(u.id, []);
  return cycles;
}

function computeLayers(units, byId) {
  const memo = new Map();
  function layerOf(id, path) {
    if (memo.has(id)) return memo.get(id);
    if (path.includes(id)) return 0; // cycle handled separately; avoid infinite recursion
    const u = byId.get(id);
    if (!u || !Array.isArray(u.needs) || u.needs.length === 0) { memo.set(id, 0); return 0; }
    let max = -1;
    for (const n of u.needs) {
      if (!byId.has(n)) continue;
      max = Math.max(max, layerOf(n, [...path, id]));
    }
    const v = max + 1;
    memo.set(id, v);
    return v;
  }
  for (const u of units) u.layer = layerOf(u.id, []);
  return units;
}

// ----- cross-reference loaders -----

function loadTerminology() {
  if (!fs.existsSync(TERMINOLOGY_MD)) return null;
  const content = fs.readFileSync(TERMINOLOGY_MD, 'utf8');
  const terms = new Set();
  // Heuristic: every ## or ### heading is a canonical term. Tolerant — we'd
  // tighten this once the terminology file has a machine-editing pipeline.
  for (const m of content.matchAll(/^##+\s+(.+)$/gm)) {
    terms.add(m[1].trim());
  }
  return terms;
}

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

// ----- emit -----

function buildJsonEntry(u) {
  const entry = {
    id: u.id,
    name: u.name,
    category: CATEGORY[u.id[0]],
    layer: u.layer,
  };
  const passthrough = [
    'duration_min', 'kern', 'needs', 'exam_codes', 'mastery_target',
    'prior_learning', 'terms', 'procedure', 'pitfalls', 'generator',
    'deprecated', 'deprecated_in_favor_of',
  ];
  for (const k of passthrough) if (u[k] !== undefined) entry[k] = u[k];
  return entry;
}

function sortUnits(units) {
  return units.slice().sort((a, b) => a.id.localeCompare(b.id));
}

function emitJson(units) {
  const sorted = sortUnits(units).map(buildJsonEntry);
  fs.writeFileSync(UNITS_JSON, JSON.stringify(sorted, null, 2) + '\n');
  return sorted.length;
}

// ----- main -----

function main() {
  if (!fs.existsSync(UNITS_MD)) {
    console.error(`missing: ${UNITS_MD}`);
    process.exit(1);
  }
  const content = fs.readFileSync(UNITS_MD, 'utf8');
  const units = parseMarkdown(content);
  const { errors, byId } = validate(units, {
    terms: loadTerminology(),
    eindtermen: loadEindtermen(),
  });

  if (errors.length > 0) {
    for (const e of errors) console.error('ERROR  ' + e);
    console.error(`\n${errors.length} validation error(s). JSON not written.`);
    process.exit(1);
  }

  computeLayers(units, byId);
  const count = emitJson(units);
  console.log(`OK  ${count} unit(s) validated; wrote ${path.relative(REPO_ROOT, UNITS_JSON)}`);
}

if (require.main === module) main();

module.exports = {
  parseMarkdown,
  parseBlock,
  parseInlineValue,
  validate,
  findCycles,
  computeLayers,
  buildJsonEntry,
  sortUnits,
  CATEGORY,
  BLOOM_LEVELS,
  PRIOR_LEARNING,
  APPLY_OR_HIGHER,
};
