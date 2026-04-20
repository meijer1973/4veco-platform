#!/usr/bin/env node
/**
 * unit-remove-dep.js — remove a prerequisite edge from a unit's needs array.
 * Full validation runs on the new state; layer is recomputed.
 *
 * Usage:
 *   node build-scripts/references/unit-remove-dep.js --from <ID> --to <prereq-ID>
 */

const { loadCatalog, saveCatalog, parseFlagArgs, requireUnit, reportValidationErrors } = require('./unit-lib');

function main() {
  const { flags } = parseFlagArgs(process.argv);
  if (!flags.from || typeof flags.from !== 'string') { console.error('missing --from <ID>'); process.exit(1); }
  if (!flags.to || typeof flags.to !== 'string') { console.error('missing --to <prereq-ID>'); process.exit(1); }

  const { preamble, units, byId } = loadCatalog();
  const u = requireUnit(byId, flags.from);
  u.needs = Array.isArray(u.needs) ? u.needs : [];
  const before = u.needs.length;
  u.needs = u.needs.filter(n => n !== flags.to);
  if (u.needs.length === before) {
    console.log(`OK  ${flags.from} did not depend on ${flags.to} (no-op)`);
    return;
  }

  try {
    saveCatalog({ preamble, units });
  } catch (err) {
    reportValidationErrors(err);
    process.exit(1);
  }
  console.log(`OK  removed ${flags.from} → ${flags.to}`);
}

if (require.main === module) main();
