#!/usr/bin/env node
/**
 * unit-add-dep.js — add a prerequisite edge to a unit's needs array.
 * Full DAG + layer validation runs on the new state; rejects cycles.
 *
 * Usage:
 *   node build-scripts/references/unit-add-dep.js --from <ID> --to <prereq-ID>
 */

const { loadCatalog, saveCatalog, parseFlagArgs, requireUnit, reportValidationErrors } = require('./unit-lib');

function main() {
  const { flags } = parseFlagArgs(process.argv);
  if (!flags.from || typeof flags.from !== 'string') { console.error('missing --from <ID>'); process.exit(1); }
  if (!flags.to || typeof flags.to !== 'string') { console.error('missing --to <prereq-ID>'); process.exit(1); }
  if (flags.from === flags.to) { console.error('ERROR  a unit cannot depend on itself'); process.exit(1); }

  const { preamble, units, byId } = loadCatalog();
  const u = requireUnit(byId, flags.from);
  if (!byId.has(flags.to)) { console.error(`ERROR  prerequisite unit ${flags.to} not found`); process.exit(1); }

  u.needs = Array.isArray(u.needs) ? u.needs : [];
  if (u.needs.includes(flags.to)) {
    console.log(`OK  ${flags.from} already depends on ${flags.to} (no-op)`);
    return;
  }
  u.needs = u.needs.concat([flags.to]);

  try {
    saveCatalog({ preamble, units });
  } catch (err) {
    reportValidationErrors(err);
    process.exit(1);
  }
  console.log(`OK  ${flags.from} now depends on ${flags.to}`);
}

if (require.main === module) main();
