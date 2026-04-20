#!/usr/bin/env node
/**
 * unit-rename.js — change a unit's display name. ID and references unchanged.
 *
 * Usage:
 *   node build-scripts/references/unit-rename.js --id <ID> --name "<new name>"
 */

const { loadCatalog, saveCatalog, parseFlagArgs, requireUnit, reportValidationErrors } = require('./unit-lib');

function main() {
  const { flags } = parseFlagArgs(process.argv);
  if (!flags.id || typeof flags.id !== 'string') { console.error('missing --id'); process.exit(1); }
  if (!flags.name || typeof flags.name !== 'string') { console.error('missing --name'); process.exit(1); }

  const { preamble, units, byId } = loadCatalog();
  const u = requireUnit(byId, flags.id);
  const oldName = u.name;
  u.name = flags.name;

  try {
    saveCatalog({ preamble, units });
  } catch (err) {
    reportValidationErrors(err);
    process.exit(1);
  }
  console.log(`OK  renamed ${flags.id}: "${oldName}" → "${flags.name}"`);
}

if (require.main === module) main();
