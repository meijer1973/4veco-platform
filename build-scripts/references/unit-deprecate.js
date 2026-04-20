#!/usr/bin/env node
/**
 * unit-deprecate.js — mark a unit as deprecated, optionally pointing to
 * replacement units. Paragraph plans that still cite the deprecated ID
 * surface in reports/unresolved-refs.md as migration warnings.
 *
 * Usage:
 *   node build-scripts/references/unit-deprecate.js --id <ID> [--replaced-by <ID1,ID2>]
 *   node build-scripts/references/unit-deprecate.js --id <ID> --undo
 */

const { loadCatalog, saveCatalog, parseFlagArgs, requireUnit, reportValidationErrors } = require('./unit-lib');

function main() {
  const { flags } = parseFlagArgs(process.argv);
  if (!flags.id || typeof flags.id !== 'string') { console.error('missing --id'); process.exit(1); }

  const { preamble, units, byId } = loadCatalog();
  const u = requireUnit(byId, flags.id);

  if (flags.undo) {
    delete u.deprecated;
    delete u.deprecated_in_favor_of;
  } else {
    u.deprecated = true;
    if (flags['replaced-by']) {
      const ids = String(flags['replaced-by']).split(',').map(s => s.trim()).filter(Boolean);
      for (const rid of ids) {
        if (!byId.has(rid)) { console.error(`ERROR  replacement unit ${rid} not found`); process.exit(1); }
      }
      u.deprecated_in_favor_of = ids;
    }
  }

  try {
    saveCatalog({ preamble, units });
  } catch (err) {
    reportValidationErrors(err);
    process.exit(1);
  }

  if (flags.undo) {
    console.log(`OK  un-deprecated ${flags.id}`);
  } else {
    const replaced = u.deprecated_in_favor_of ? ` (replaced_by: ${u.deprecated_in_favor_of.join(', ')})` : '';
    console.log(`OK  deprecated ${flags.id}${replaced}`);
  }
}

if (require.main === module) main();
