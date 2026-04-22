#!/usr/bin/env node
/**
 * term-rename.js — mint a new id for a term, mark the old id as deprecated
 * pointing at the new one. The new id inherits all fields from the old.
 *
 * Usage:
 *   node build-scripts/references/term-rename.js --id old-id --new-id new-id
 *   node build-scripts/references/term-rename.js --id old-id --new-id new-id --new-term-nl "nieuwe canonieke term"
 *
 * Existing references in related_terms across the registry are rewritten
 * from old-id → new-id to keep cross-links intact.
 */

const { parseFlagArgs, loadRegistry, mergeEntry, slugify, saveAtomically, reportErrors } = require('./term-lib');

function main() {
  const { flags } = parseFlagArgs(process.argv);
  if (!flags.id || typeof flags.id !== 'string') {
    console.error('missing --id');
    process.exit(1);
  }
  const newId = flags['new-id'] && flags['new-id'] !== true
    ? String(flags['new-id'])
    : (flags['new-term-nl'] && flags['new-term-nl'] !== true ? slugify(String(flags['new-term-nl'])) : null);
  if (!newId) {
    console.error('missing --new-id (or --new-term-nl to auto-slug)');
    process.exit(1);
  }
  if (newId === flags.id) {
    console.error(`ERROR  --new-id must differ from --id`);
    process.exit(1);
  }

  const registry = loadRegistry();
  const existing = registry.terms[flags.id];
  if (!existing) {
    console.error(`ERROR  id "${flags.id}" not found`);
    process.exit(1);
  }
  if (registry.terms[newId]) {
    console.error(`ERROR  id "${newId}" already exists`);
    process.exit(1);
  }

  const newTermNl = flags['new-term-nl'] && flags['new-term-nl'] !== true
    ? String(flags['new-term-nl'])
    : existing.term_nl;

  // Clone the old entry under the new id.
  registry.terms[newId] = mergeEntry(null, {
    ...existing,
    id: newId,
    term_nl: newTermNl,
    deprecated: false,
    deprecated_in_favor_of: null,
  });

  // Old entry becomes a redirect stub.
  registry.terms[flags.id] = mergeEntry(existing, {
    deprecated: true,
    deprecated_in_favor_of: newId,
  });

  // Rewrite cross-links: anywhere related_terms mentions the old id, swap in the new id.
  for (const [id, entry] of Object.entries(registry.terms)) {
    if (id === flags.id || id === newId) continue;
    if (Array.isArray(entry.related_terms) && entry.related_terms.includes(flags.id)) {
      entry.related_terms = entry.related_terms.map(r => (r === flags.id ? newId : r));
    }
  }

  try {
    saveAtomically(registry);
  } catch (err) {
    if (err && err.errors) reportErrors(err.errors);
    else console.error('ERROR  ' + err.message);
    process.exit(1);
  }
  console.log(`OK  renamed ${flags.id} → ${newId} (old id kept as redirect)`);
}

if (require.main === module) main();
