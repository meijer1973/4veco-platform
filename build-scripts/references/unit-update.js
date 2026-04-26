#!/usr/bin/env node
/**
 * unit-update.js — merge-patch fields on an existing unit.
 *
 * Usage:
 *   node build-scripts/references/unit-update.js --id <ID> --spec '<JSON-patch>'
 *
 * Fields in <JSON-patch> overwrite the existing entry. `id` cannot be
 * changed via this command (use unit-split or unit-merge for lifecycle
 * moves). `layer` passes through the stored-layer validator.
 */

const { loadCatalog, saveCatalog, parseFlagArgs, requireUnit, reportValidationErrors } = require('./unit-lib');

const FORBIDDEN_KEYS = new Set(['id']);

function main() {
  const { flags, spec } = parseFlagArgs(process.argv);
  if (!flags.id || typeof flags.id !== 'string') { console.error('missing --id'); process.exit(1); }
  if (!spec || typeof spec !== 'object') { console.error('missing --spec <JSON-patch>'); process.exit(1); }

  for (const k of Object.keys(spec)) {
    if (FORBIDDEN_KEYS.has(k)) {
      console.error(`ERROR  field "${k}" cannot be changed via unit-update`);
      process.exit(1);
    }
  }

  const { preamble, units, byId } = loadCatalog();
  const u = requireUnit(byId, flags.id);
  const changedKeys = Object.keys(spec);
  for (const k of changedKeys) u[k] = spec[k];

  try {
    saveCatalog({ preamble, units, dryRun: flags['dry-run'] === true });
  } catch (err) {
    reportValidationErrors(err);
    process.exit(1);
  }
  if (flags['dry-run'] === true) {
    console.log(`DRY RUN  would update ${flags.id}: ${changedKeys.join(', ')}`);
    return;
  }
  console.log(`OK  updated ${flags.id}: ${changedKeys.join(', ')}`);
}

if (require.main === module) main();
