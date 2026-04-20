#!/usr/bin/env node
/**
 * unit-split.js — split one unit into several. Atomic: either all new
 * units are minted and the old one deprecated, or nothing changes.
 *
 * Usage:
 *   node build-scripts/references/unit-split.js --from <old-ID> --spec '<JSON>'
 *
 * <JSON> shape:
 *   {
 *     "new": [ <unit-spec>, <unit-spec>, ... ]   // full specs for the new units
 *   }
 *
 * Each new unit spec follows the same schema as unit-add. After validation
 * succeeds on the combined state, the old unit is marked
 *   deprecated: true
 *   deprecated_in_favor_of: [<new IDs>]
 * so any materials still citing the old ID surface in reports as warnings.
 */

const {
  loadCatalog, saveCatalog, parseFlagArgs,
  requireUnit, reportValidationErrors,
} = require('./unit-lib');
const { validateSpec, formatEntry } = require('./unit-add');

function main() {
  const { flags, spec } = parseFlagArgs(process.argv);
  if (!flags.from || typeof flags.from !== 'string') { console.error('missing --from <old-ID>'); process.exit(1); }
  if (!spec || !Array.isArray(spec.new) || spec.new.length < 2) {
    console.error('missing --spec with at least 2 entries in "new"');
    process.exit(1);
  }

  const { preamble, units, byId } = loadCatalog();
  const oldUnit = requireUnit(byId, flags.from);
  if (oldUnit.deprecated) {
    console.error(`ERROR  ${flags.from} is already deprecated`);
    process.exit(1);
  }

  // Pre-validate each new spec (before any mutation).
  const existingIds = new Set(byId.keys());
  for (const s of spec.new) {
    const errs = validateSpec(s, existingIds);
    if (errs.length) {
      for (const e of errs) console.error('SPEC  ' + e);
      process.exit(1);
    }
    existingIds.add(s.id);   // later specs must not collide with earlier ones
  }

  // Apply: add each new unit, then deprecate the old with replaced_by pointer.
  for (const s of spec.new) units.push(s);
  oldUnit.deprecated = true;
  oldUnit.deprecated_in_favor_of = spec.new.map(s => s.id);

  try {
    saveCatalog({ preamble, units });
  } catch (err) {
    reportValidationErrors(err);
    process.exit(1);
  }

  const newIds = spec.new.map(s => s.id).join(', ');
  console.log(`OK  split ${flags.from} → [${newIds}]; ${flags.from} marked deprecated`);
}

if (require.main === module) main();
