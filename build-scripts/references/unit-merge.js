#!/usr/bin/env node
/**
 * unit-merge.js — merge several units into one. One of the sources (or
 * an optional new unit) becomes the target; the others are deprecated
 * with replaced_by pointing at the target.
 *
 * Usage:
 *   node build-scripts/references/unit-merge.js --from <ID1,ID2,...> --into <target-ID>
 *   node build-scripts/references/unit-merge.js --from <ID1,ID2,...> --into <target-ID> --spec '<JSON>'
 *
 * The <target-ID> must be one of the --from IDs (existing survivor that
 * absorbs the others) OR a fresh ID defined in the optional --spec. The
 * optional --spec follows the same JSON shape as unit-add.
 *
 * Effects (atomic):
 * - If target is a new ID: mint it from --spec
 * - If target is an existing ID from --from: keep it unchanged (unless
 *   --spec is supplied, in which case patch the target with those fields)
 * - Every other --from ID is marked
 *     deprecated: true
 *     deprecated_in_favor_of: [<target-ID>]
 */

const {
  loadCatalog, saveCatalog, parseFlagArgs,
  requireUnit, reportValidationErrors,
} = require('./unit-lib');
const { validateSpec } = require('./unit-add');

function main() {
  const { flags, spec } = parseFlagArgs(process.argv);
  if (!flags.from || typeof flags.from !== 'string') { console.error('missing --from <ID1,ID2,...>'); process.exit(1); }
  if (!flags.into || typeof flags.into !== 'string') { console.error('missing --into <target-ID>'); process.exit(1); }

  const fromIds = String(flags.from).split(',').map(s => s.trim()).filter(Boolean);
  if (fromIds.length < 2) { console.error('--from must list at least two IDs'); process.exit(1); }
  if (new Set(fromIds).size !== fromIds.length) { console.error('--from contains duplicate IDs'); process.exit(1); }

  const { preamble, units, byId } = loadCatalog();
  const sources = fromIds.map(id => requireUnit(byId, id));
  for (const u of sources) {
    if (u.deprecated) { console.error(`ERROR  source unit ${u.id} is already deprecated`); process.exit(1); }
  }

  const targetId = flags.into;
  const targetIsNew = !byId.has(targetId);
  const targetIsSource = fromIds.includes(targetId);

  if (targetIsNew) {
    // Target is a freshly minted unit; spec is required.
    if (!spec || typeof spec !== 'object') {
      console.error(`--into ${targetId} does not exist; supply --spec to mint it`);
      process.exit(1);
    }
    const specWithId = { ...spec, id: targetId };
    const existingIds = new Set(byId.keys());
    const errs = validateSpec(specWithId, existingIds);
    if (errs.length) { for (const e of errs) console.error('SPEC  ' + e); process.exit(1); }
    units.push(specWithId);
  } else if (targetIsSource) {
    // Target is one of the sources — it survives. Optional spec can patch it.
    if (spec) {
      const t = byId.get(targetId);
      for (const k of Object.keys(spec)) {
        if (k === 'id') continue;
        t[k] = spec[k];
      }
    }
  } else {
    console.error(`--into ${targetId} must be one of --from or a new ID`);
    process.exit(1);
  }

  // Deprecate the non-target sources.
  for (const u of sources) {
    if (u.id === targetId) continue;
    u.deprecated = true;
    u.deprecated_in_favor_of = [targetId];
  }

  try {
    saveCatalog({ preamble, units });
  } catch (err) {
    reportValidationErrors(err);
    process.exit(1);
  }

  const deprecatedIds = sources.filter(u => u.id !== targetId).map(u => u.id).join(', ');
  console.log(`OK  merged [${deprecatedIds}] → ${targetId}${targetIsNew ? ' (new)' : ' (absorbed)'}`);
}

if (require.main === module) main();
