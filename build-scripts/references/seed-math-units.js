#!/usr/bin/env node
/**
 * seed-math-units.js
 *
 * One-shot: migrate the 37 math skills from engines/skilltree/base-elements.js
 * into references/machine/micro-teaching-units.md as A01–A37.
 *
 * Also writes build-scripts/references/math-migration-map.json recording the
 * F/B/S/E → A* mapping. That map is consumed by the follow-up commit that
 * rewires base-elements.js to load the JSON and renames `activeSkills` in the
 * 23 per-paragraph data files.
 *
 * This is the only bulk seeding script in the catalog. Every other unit (D*,
 * E*, H*, ...) gets minted exercise-by-exercise via unit-add during the
 * exam-audit and blueprint target-exercise passes.
 *
 * Usage (one time only):
 *   node build-scripts/references/seed-math-units.js
 *
 * Idempotent safeguard: if any A* unit already exists, the script refuses to
 * run so re-running doesn't corrupt a populated catalog.
 */

const fs = require('fs');
const path = require('path');
const {
  parseMarkdown,
  validate,
  computeLayers,
  buildJsonEntry,
  sortUnits,
} = require('./build-unit-index');
const { formatEntry, insertEntry } = require('./unit-add');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const UNITS_MD        = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.md');
const UNITS_JSON      = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.json');
const BASE_ELEMENTS   = path.join(REPO_ROOT, 'engines/skilltree/base-elements.js');
const MIGRATION_MAP   = path.join(__dirname, 'math-migration-map.json');

function buildMapping(skills) {
  const map = {};
  skills.forEach((s, i) => {
    map[s.id] = `A${String(i + 1).padStart(2, '0')}`;
  });
  return map;
}

function buildSpec(skill, mapping) {
  const newId = mapping[skill.id];
  const needs = (skill.needs || []).map(n => mapping[n]).filter(Boolean);
  return {
    id: newId,
    name: skill.name,
    duration_min: 5,
    kern: skill.desc,
    needs,
    exam_codes: [],
    mastery_target: 'apply',
    prior_learning: skill.id.startsWith('F') ? 'previously_taught' : 'new_this_year',
    terms: [],
    procedure: [skill.desc],
    generator: `GEN_${newId}`,
  };
}

function main() {
  if (!fs.existsSync(BASE_ELEMENTS)) {
    console.error(`missing: ${BASE_ELEMENTS}`);
    process.exit(1);
  }
  const elements = require(BASE_ELEMENTS);
  if (!Array.isArray(elements.SKILLS) || elements.SKILLS.length !== 37) {
    console.error(`unexpected base-elements.SKILLS shape; got ${elements.SKILLS && elements.SKILLS.length} entries`);
    process.exit(1);
  }

  // Idempotency guard: refuse if any A* unit already exists.
  const original = fs.readFileSync(UNITS_MD, 'utf8');
  const existing = parseMarkdown(original);
  const existingA = existing.filter(u => u.id.startsWith('A'));
  if (existingA.length > 0) {
    console.error(`refuse to re-seed: catalog already has ${existingA.length} A-unit(s).`);
    console.error('delete them manually via unit-deprecate or revert the markdown before re-seeding.');
    process.exit(1);
  }

  const mapping = buildMapping(elements.SKILLS);
  const specs = elements.SKILLS.map(s => buildSpec(s, mapping));

  // Insert each spec into the markdown (sorted).
  let content = original;
  for (const spec of specs) {
    const entry = formatEntry(spec);
    content = insertEntry(content, entry, spec.id);
  }

  // Full validation of the would-be catalog.
  const nextUnits = parseMarkdown(content);
  const { errors, byId } = validate(nextUnits, {});
  if (errors.length) {
    for (const e of errors) console.error('VALIDATE  ' + e);
    console.error(`\n${errors.length} validation error(s). Nothing written.`);
    process.exit(1);
  }

  // Atomic write: markdown + JSON + migration map.
  fs.writeFileSync(UNITS_MD, content);
  computeLayers(nextUnits, byId);
  const jsonEntries = sortUnits(nextUnits).map(buildJsonEntry);
  fs.writeFileSync(UNITS_JSON, JSON.stringify(jsonEntries, null, 2) + '\n');
  fs.writeFileSync(MIGRATION_MAP, JSON.stringify(mapping, null, 2) + '\n');

  console.log(`OK  seeded ${specs.length} math units`);
  console.log(`    markdown:      ${path.relative(REPO_ROOT, UNITS_MD)}`);
  console.log(`    json:          ${path.relative(REPO_ROOT, UNITS_JSON)}`);
  console.log(`    migration map: ${path.relative(REPO_ROOT, MIGRATION_MAP)}`);
  console.log(`\nExamples:`);
  for (const [oldId, newId] of Object.entries(mapping).slice(0, 5)) {
    console.log(`    ${oldId.padEnd(4)} → ${newId}`);
  }
  console.log(`    ... (${Object.keys(mapping).length - 5} more)`);
}

if (require.main === module) main();

module.exports = { buildMapping, buildSpec };
