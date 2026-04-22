#!/usr/bin/env node
/**
 * migrate-l0-to-l1-economic.js — one-time migration applying the PART 8
 * layer-semantics formalisation.
 *
 * Rule (see skills/manage-references.md PART 8):
 *   L0 is reserved for mathematical / calculation skills (onderbouw-wiskunde
 *   the course uses but doesn't teach). Economic concepts — even with
 *   needs=[] — belong at L1 or higher.
 *
 * This script:
 *   1. Promotes every L0 unit that is NOT in STAY_L0 from layer 0 to layer 1.
 *   2. Recomputes consistent stored layers for all dependents (cascade bump):
 *      if a unit's stored layer is less than max(needs.layer)+1, raise it.
 *   3. Saves atomically via unit-lib's saveCatalog (which runs the full
 *      validator first — if anything is off, nothing is written).
 *
 * The STAY_L0 set was determined by classifying each current L0 unit as
 * mathematical (M) or economic (E) under the new rule. The 7 units kept
 * at L0 are A-domain math primitives. Everything else is economic content
 * and promotes to L1.
 *
 * This is a one-shot migration. Kept in-tree for reviewability of what
 * changed; running it a second time is a no-op (all economic L0 candidates
 * are already gone).
 */

'use strict';

const { loadCatalog, saveCatalog, reportValidationErrors } = require('./unit-lib');

// Mathematical primitives that legitimately stay at L0.
// Every other current-L0 unit is economic in character and moves to L1.
const STAY_L0 = new Set([
  'A01', // Lineaire functie opstellen
  'A02', // Vergelijking oplossen
  'A03', // Functie omschrijven (P↔Q)
  'A04', // Substitueren
  'A05', // Snijpunt met P-as berekenen
  'A38', // Procentuele verandering berekenen
  'A43', // Totale winst uit gemengde allocatie berekenen (pure calc)
]);

function main() {
  const { preamble, units } = loadCatalog();
  const byId = Object.fromEntries(units.map(u => [u.id, u]));

  // Effective-layer helper: stored layer if set; else derived from needs.
  // For needs=[], derived is 0. For non-empty needs, derived is max(dep.effective)+1.
  const effCache = new Map();
  function eff(id) {
    if (effCache.has(id)) return effCache.get(id);
    const u = byId[id];
    if (!u) return 0;
    if (typeof u.layer === 'number') { effCache.set(id, u.layer); return u.layer; }
    const needs = u.needs || [];
    if (needs.length === 0) { effCache.set(id, 0); return 0; }
    let max = -1;
    for (const n of needs) {
      const v = eff(n);
      if (v > max) max = v;
    }
    const derived = max + 1;
    effCache.set(id, derived);
    return derived;
  }

  // Step 1: promote economic effective-L0 units (needs=[], not STAY_L0) to L1
  // by writing layer=1 explicitly.
  const promoted = [];
  for (const u of units) {
    if (u.deprecated) continue;
    if (STAY_L0.has(u.id)) continue;
    const needs = u.needs || [];
    if (needs.length > 0) continue;
    if (eff(u.id) !== 0) continue;
    u.layer = 1;
    effCache.set(u.id, 1);
    promoted.push(u.id);
  }

  // Step 2: cascade. For units with stored layer that now sit below their
  // derived minimum (because a prereq was promoted), bump stored to derived.
  // Units without stored layer auto-derive; the validator/computeLayers will
  // pick that up — we don't need to write anything.
  const bumped = new Map();
  let changed = true;
  let iterations = 0;
  while (changed && iterations < 20) {
    changed = false;
    iterations++;
    effCache.clear();
    for (const u of units) {
      if (u.deprecated) continue;
      if (typeof u.layer !== 'number') continue; // skip layer-less units
      const needs = u.needs || [];
      if (needs.length === 0) continue;
      let maxNeed = -1;
      for (const n of needs) {
        const v = eff(n);
        if (v > maxNeed) maxNeed = v;
      }
      const derived = maxNeed + 1;
      if (u.layer < derived) {
        const prior = bumped.get(u.id) ?? u.layer;
        bumped.set(u.id, prior);
        u.layer = derived;
        changed = true;
      }
    }
  }

  try {
    saveCatalog({ preamble, units });
  } catch (err) {
    reportValidationErrors(err);
    process.exit(1);
  }

  console.log(`OK  promoted ${promoted.length} economic L0 units to L1:`);
  console.log('    ' + promoted.join(', '));
  if (bumped.size) {
    console.log(`OK  cascade-bumped ${bumped.size} dependent units:`);
    const entries = [...bumped.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    for (const [id, prior] of entries) {
      const now = byId[id].layer;
      console.log(`    ${id}: L${prior} → L${now}`);
    }
  } else {
    console.log('OK  no dependent layer bumps needed');
  }
}

if (require.main === module) main();
