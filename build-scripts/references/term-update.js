#!/usr/bin/env node
/**
 * term-update.js — patch fields on an existing begrip.
 *
 * Usage:
 *   node build-scripts/references/term-update.js --id marktevenwicht \
 *     --definition-nl "De situatie waarin ..." \
 *     --related-terms "evenwichtsprijs,evenwichtshoeveelheid"
 *   node build-scripts/references/term-update.js --id marktevenwicht \
 *     --spec '{"example_nl":"Bij €3 en 100 stuks."}'
 *
 * Fields passed overwrite existing values. `id` cannot be changed here —
 * use term-rename.js for that. `teaching_units` is derived; passing it is
 * rejected.
 */

const {
  parseFlagArgs,
  buildPatchFromFlags,
  mergeEntry,
  loadRegistry,
  saveAtomically,
  reportErrors,
} = require('./term-lib');

const FORBIDDEN = new Set(['id', 'teaching_units']);

function main() {
  const { flags, spec: specArg } = parseFlagArgs(process.argv);
  if (!flags.id || typeof flags.id !== 'string') {
    console.error('missing --id');
    process.exit(1);
  }
  const patch = specArg ? { ...specArg } : buildPatchFromFlags(flags);
  delete patch.id;

  for (const k of Object.keys(patch)) {
    if (FORBIDDEN.has(k)) {
      console.error(`ERROR  field "${k}" cannot be changed via term-update`);
      process.exit(1);
    }
  }

  const registry = loadRegistry();
  const existing = registry.terms[flags.id];
  if (!existing) {
    console.error(`ERROR  id "${flags.id}" not found in registry`);
    process.exit(1);
  }

  registry.terms[flags.id] = mergeEntry(existing, patch);

  try {
    saveAtomically(registry);
  } catch (err) {
    if (err && err.errors) reportErrors(err.errors);
    else console.error('ERROR  ' + err.message);
    process.exit(1);
  }
  console.log(`OK  updated ${flags.id}: ${Object.keys(patch).join(', ')}`);
}

if (require.main === module) main();
