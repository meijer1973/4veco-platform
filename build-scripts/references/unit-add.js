#!/usr/bin/env node
/**
 * unit-add.js
 *
 * Mint a new unit into references/machine/micro-teaching-units.md.
 * Validates the full catalog (not just the new entry) via build-unit-index
 * before writing, then writes the markdown + regenerates the JSON atomically.
 *
 * Usage:
 *   node build-scripts/references/unit-add.js --spec '<JSON>'
 *   node build-scripts/references/unit-add.js \
 *       --id D05 --name "Marktevenwicht (begrip)" \
 *       --kern "..." --needs D01,D02 --mastery-target understand \
 *       --prior-learning new_this_year --terms "marktevenwicht,evenwichtsprijs"
 *
 * See knowledge/micro-teaching-units-plan.md §5.
 */

const fs = require('fs');
const path = require('path');
const {
  parseMarkdown,
  validate,
  computeLayers,
  buildJsonEntry,
  sortUnits,
  BLOOM_LEVELS,
  PRIOR_LEARNING,
  APPLY_OR_HIGHER,
} = require('./build-unit-index');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const UNITS_MD   = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.md');
const UNITS_JSON = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.json');
const UNITS_MARKER = '<!-- UNIT ENTRIES BELOW THIS LINE';
const ID_RE = /^[A-K]\d{2}$/;

// ----- arg parsing -----

function parseArgs(argv) {
  const args = argv.slice(2);
  const out = { flags: {}, spec: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--spec') {
      out.spec = JSON.parse(args[++i]);
    } else if (a.startsWith('--')) {
      const key = a.slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true;
      out.flags[key] = value;
    }
  }
  return out;
}

function buildSpecFromFlags(flags) {
  const spec = {};
  const map = {
    'id': 'id', 'name': 'name', 'kern': 'kern',
    'mastery-target': 'mastery_target', 'prior-learning': 'prior_learning',
    'duration-min': 'duration_min', 'generator': 'generator',
  };
  for (const [k, v] of Object.entries(flags)) {
    if (map[k]) spec[map[k]] = v;
  }
  if (flags.needs) spec.needs = String(flags.needs).split(',').map(s => s.trim()).filter(Boolean);
  if (flags['exam-codes']) spec.exam_codes = String(flags['exam-codes']).split(',').map(s => s.trim()).filter(Boolean);
  if (flags.terms) spec.terms = String(flags.terms).split(',').map(s => s.trim()).filter(Boolean);
  if (flags['duration-min']) spec.duration_min = parseInt(spec.duration_min, 10);
  return spec;
}

// ----- spec-level pre-validation -----

function validateSpec(spec, existingIds) {
  const errors = [];
  if (!spec.id) errors.push('missing --id');
  else if (!ID_RE.test(spec.id)) errors.push(`invalid ID "${spec.id}" (expected [A-K]\\d\\d)`);
  else if (existingIds.has(spec.id)) errors.push(`ID "${spec.id}" already exists in the catalog`);

  if (!spec.name || typeof spec.name !== 'string') errors.push('missing --name');
  if (!spec.kern || typeof spec.kern !== 'string') errors.push('missing --kern');
  if (!Array.isArray(spec.needs)) errors.push('needs must be an array (use --needs A01,A02 or JSON)');
  if (!spec.mastery_target) errors.push('missing --mastery-target');
  else if (!BLOOM_LEVELS.includes(spec.mastery_target))
    errors.push(`mastery_target "${spec.mastery_target}" not in ${BLOOM_LEVELS.join('|')}`);
  if (!spec.prior_learning) errors.push('missing --prior-learning');
  else if (!PRIOR_LEARNING.includes(spec.prior_learning))
    errors.push(`prior_learning "${spec.prior_learning}" not in ${PRIOR_LEARNING.join('|')}`);
  if (!Array.isArray(spec.terms)) errors.push('terms must be an array (use --terms "a,b" or JSON)');

  if (spec.id && APPLY_OR_HIGHER.has(spec.mastery_target)) {
    if (!spec.procedure || !Array.isArray(spec.procedure) || spec.procedure.length === 0)
      errors.push(`mastery_target=${spec.mastery_target} requires a non-empty procedure array`);
  }
  if (spec.id && spec.generator && !spec.id.startsWith('A'))
    errors.push('generator is only valid for A-domain units');
  if (spec.id && spec.id.startsWith('A') && !spec.generator && !spec.deprecated)
    errors.push('A-domain units require a generator');

  return errors;
}

// ----- markdown formatting -----

function formatEntry(u) {
  const lines = [`### ${u.id} ${u.name}`];
  if (typeof u.layer === 'number') lines.push(`- layer: ${u.layer}`);
  if (u.duration_min !== undefined) lines.push(`- duration_min: ${u.duration_min}`);
  lines.push(`- kern: ${JSON.stringify(u.kern)}`);
  lines.push(`- needs: [${(u.needs || []).join(', ')}]`);
  if (Array.isArray(u.exam_codes) && u.exam_codes.length)
    lines.push(`- exam_codes: [${u.exam_codes.join(', ')}]`);
  lines.push(`- mastery_target: ${u.mastery_target}`);
  lines.push(`- prior_learning: ${u.prior_learning}`);
  lines.push(`- terms: [${(u.terms || []).join(', ')}]`);
  if (Array.isArray(u.procedure) && u.procedure.length) {
    lines.push('- procedure:');
    u.procedure.forEach((step, idx) => lines.push(`  ${idx + 1}. ${step}`));
  }
  if (Array.isArray(u.pitfalls) && u.pitfalls.length) {
    lines.push('- pitfalls:');
    u.pitfalls.forEach(p => lines.push(`  - ${p}`));
  }
  if (u.generator) lines.push(`- generator: ${u.generator}`);
  if (u.deprecated) lines.push(`- deprecated: true`);
  if (Array.isArray(u.deprecated_in_favor_of) && u.deprecated_in_favor_of.length)
    lines.push(`- deprecated_in_favor_of: [${u.deprecated_in_favor_of.join(', ')}]`);
  return lines.join('\n') + '\n';
}

// ----- insertion -----

function insertEntry(content, newEntry, newId) {
  const markerIdx = content.indexOf(UNITS_MARKER);
  if (markerIdx === -1) throw new Error(`cannot find units marker "${UNITS_MARKER}" in markdown`);
  const endOfMarkerLine = content.indexOf('\n', markerIdx);
  const prefix = content.slice(0, endOfMarkerLine + 1);
  const suffix = content.slice(endOfMarkerLine + 1);

  // Split suffix by `### ` to find insertion point
  const blocks = suffix.split(/^### /m);
  const leadingWhitespace = blocks.shift() || '';
  const existing = blocks.map(b => {
    const firstLine = b.split('\n')[0] || '';
    const id = (firstLine.match(/^(\S+)/) || [])[1] || '';
    return { id, text: `### ${b}` };
  });

  // Insert at sorted position
  existing.push({ id: newId, text: newEntry });
  existing.sort((a, b) => a.id.localeCompare(b.id));
  // dedupe accidental duplicates (safety net — should be caught in validation earlier)
  const seen = new Set();
  const deduped = [];
  for (const e of existing) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    deduped.push(e);
  }

  // Ensure each block ends with exactly one trailing blank line for readability
  const rebuilt = deduped.map(e => e.text.replace(/\n+$/, '') + '\n').join('\n');
  return prefix + leadingWhitespace + rebuilt;
}

// ----- main -----

function main() {
  const { flags, spec: specArg } = parseArgs(process.argv);
  const spec = specArg || buildSpecFromFlags(flags);

  // Read current catalog
  if (!fs.existsSync(UNITS_MD)) {
    console.error(`missing: ${UNITS_MD}`);
    process.exit(1);
  }
  const original = fs.readFileSync(UNITS_MD, 'utf8');
  const existingUnits = parseMarkdown(original);
  const existingIds = new Set(existingUnits.map(u => u.id));

  // Pre-flight validation of spec
  const specErrors = validateSpec(spec, existingIds);
  if (specErrors.length) {
    for (const e of specErrors) console.error('SPEC  ' + e);
    process.exit(1);
  }

  // Format + insert
  const entry = formatEntry(spec);
  const next = insertEntry(original, entry, spec.id);

  // Full catalog validation (would-be state, without writing yet)
  const nextUnits = parseMarkdown(next);
  const { errors } = validate(nextUnits, {});
  if (errors.length) {
    for (const e of errors) console.error('CATALOG  ' + e);
    console.error(`\n${errors.length} validation error(s). Markdown NOT written.`);
    process.exit(1);
  }

  // Atomic write of markdown + JSON
  fs.writeFileSync(UNITS_MD, next);
  const byId = new Map(nextUnits.map(u => [u.id, u]));
  computeLayers(nextUnits, byId);
  const jsonEntries = sortUnits(nextUnits).map(buildJsonEntry);
  fs.writeFileSync(UNITS_JSON, JSON.stringify(jsonEntries, null, 2) + '\n');

  console.log(`OK  minted ${spec.id} "${spec.name}" (catalog now ${nextUnits.length} units)`);
}

if (require.main === module) main();

module.exports = {
  parseArgs,
  buildSpecFromFlags,
  validateSpec,
  formatEntry,
  insertEntry,
};
