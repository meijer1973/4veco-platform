#!/usr/bin/env node
/**
 * term-add.js — mint a new begrip.
 *
 * Usage:
 *   node build-scripts/references/term-add.js \
 *     --id marktevenwicht --term-nl "marktevenwicht" \
 *     --domain D --syllabus-clause D1.23 \
 *     --definition-nl "De situatie waarin ..."
 *   node build-scripts/references/term-add.js --spec '<JSON>'
 *
 * Fields: id, term_nl, definition_nl, domain are required; everything else
 * defaults. After writing, invokes build-begrippen-index.js to regenerate
 * markdown + coverage and run the full validator.
 */

const {
  DOMAINS,
  slugify,
  loadRegistry,
  parseFlagArgs,
  buildPatchFromFlags,
  mergeEntry,
  saveAtomically,
  reportErrors,
} = require('./term-lib');

function main() {
  const { flags, spec: specArg } = parseFlagArgs(process.argv);
  const spec = specArg ? { ...specArg } : buildPatchFromFlags(flags);

  // Derive id from term_nl if not explicitly given.
  if (!spec.id && spec.term_nl) spec.id = slugify(spec.term_nl);

  const errors = [];
  if (!spec.id) errors.push('missing --id (or --term-nl to auto-slug)');
  if (!spec.term_nl) errors.push('missing --term-nl');
  if (!spec.domain) errors.push('missing --domain');
  else if (!DOMAINS.includes(spec.domain)) errors.push(`--domain "${spec.domain}" not in {${DOMAINS.join(',')}}`);
  if (errors.length) {
    for (const e of errors) console.error('SPEC  ' + e);
    process.exit(1);
  }

  const registry = loadRegistry();
  if (registry.terms[spec.id]) {
    console.error(`ERROR  id "${spec.id}" already exists in registry`);
    process.exit(1);
  }

  registry.terms[spec.id] = mergeEntry(null, { ...spec, id: spec.id });

  try {
    saveAtomically(registry);
  } catch (err) {
    if (err && err.errors) reportErrors(err.errors);
    else console.error('ERROR  ' + err.message);
    process.exit(1);
  }
  console.log(`OK  added "${spec.id}" (${spec.term_nl})`);
}

if (require.main === module) main();
