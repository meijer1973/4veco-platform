#!/usr/bin/env node
/**
 * term-deprecate.js — mark a begrip as deprecated, optionally pointing to
 * a replacement. Paragraphs and skills that still cite the deprecated id
 * surface in future QA reports.
 *
 * Usage:
 *   node build-scripts/references/term-deprecate.js --id opportuniteitskosten --in-favor-of alternatieve-kosten
 *   node build-scripts/references/term-deprecate.js --id foo --undo
 */

const { parseFlagArgs, loadRegistry, mergeEntry, saveAtomically, reportErrors } = require('./term-lib');

function main() {
  const { flags } = parseFlagArgs(process.argv);
  if (!flags.id || typeof flags.id !== 'string') {
    console.error('missing --id');
    process.exit(1);
  }
  const registry = loadRegistry();
  const existing = registry.terms[flags.id];
  if (!existing) {
    console.error(`ERROR  id "${flags.id}" not found in registry`);
    process.exit(1);
  }

  if (flags.undo) {
    registry.terms[flags.id] = mergeEntry(existing, { deprecated: false, deprecated_in_favor_of: null });
  } else {
    const target = flags['in-favor-of'] && flags['in-favor-of'] !== true ? String(flags['in-favor-of']) : null;
    if (target) {
      if (!registry.terms[target]) {
        console.error(`ERROR  replacement id "${target}" not found`);
        process.exit(1);
      }
      if (registry.terms[target].deprecated) {
        console.error(`ERROR  replacement id "${target}" is itself deprecated`);
        process.exit(1);
      }
    }
    registry.terms[flags.id] = mergeEntry(existing, { deprecated: true, deprecated_in_favor_of: target });
  }

  try {
    saveAtomically(registry);
  } catch (err) {
    if (err && err.errors) reportErrors(err.errors);
    else console.error('ERROR  ' + err.message);
    process.exit(1);
  }
  if (flags.undo) {
    console.log(`OK  un-deprecated ${flags.id}`);
  } else {
    const tail = registry.terms[flags.id].deprecated_in_favor_of
      ? ` (in favor of ${registry.terms[flags.id].deprecated_in_favor_of})` : '';
    console.log(`OK  deprecated ${flags.id}${tail}`);
  }
}

if (require.main === module) main();
