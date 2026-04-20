#!/usr/bin/env node
/**
 * refresh-math-procedures.js
 *
 * Enrich the seeded A01–A37 units with proper multi-step procedures and
 * pitfalls extracted from engines/skilltree/explanations.js. The initial
 * seed-math-units.js copied `skill.desc` into a one-line procedure, which
 * loses the structured content already authored in explanations.js.
 *
 * Algorithm per old-ID skill:
 *   1. Pull the explanation section list.
 *   2. Try to extract procedure steps, in order:
 *      a. Numbered lines ("1. Stap X") from the `formule` section.
 *      b. "Stap N:" lines from the `voorbeeld` section.
 *      c. Fall back to the existing desc as a single-step procedure.
 *   3. Pull pitfall from the `valkuil` section (first sentence).
 *   4. Use unit-update to patch the unit.
 *
 * One-shot refresh; idempotent (running twice re-applies the same content).
 *
 * Usage:
 *   node build-scripts/references/refresh-math-procedures.js
 */

const fs = require('fs');
const path = require('path');
const { loadCatalog, saveCatalog } = require('./unit-lib');

const REPO_ROOT    = path.resolve(__dirname, '..', '..');
const EXPLANATIONS = path.join(REPO_ROOT, 'engines/skilltree/explanations.js');
const MAP_PATH     = path.join(__dirname, 'math-migration-map.json');

function extractNumberedSteps(content) {
  if (!content) return [];
  const lines = content.split('\n');
  const steps = [];
  for (const line of lines) {
    const m = line.match(/^\s*(\d+)\.\s+(.+?)\s*$/);
    if (m) steps.push(m[2].trim());
  }
  return steps;
}

function extractStapLines(content) {
  if (!content) return [];
  const lines = content.split('\n');
  const steps = [];
  for (const line of lines) {
    const m = line.match(/^\s*Stap\s+(\d+):\s*(.+?)\s*$/i);
    if (m) steps.push(m[2].trim());
  }
  return steps;
}

function firstSentence(text) {
  if (!text) return null;
  const m = text.match(/^(.+?[.!?])(\s|$)/);
  return m ? m[1].trim() : text.trim().slice(0, 200);
}

function sectionByType(sections, type) {
  if (!Array.isArray(sections)) return null;
  return sections.find(s => s.type === type) || null;
}

function deriveProcedureAndPitfalls(exp, fallbackDesc) {
  if (!exp || !Array.isArray(exp.sections)) return { procedure: [fallbackDesc], pitfalls: undefined };

  const formule = sectionByType(exp.sections, 'formule');
  const valkuil = sectionByType(exp.sections, 'valkuil');

  // Only accept numbered abstract steps in the formule section.
  // The voorbeeld section contains concrete worked examples with specific
  // numbers; those are exercise instances, not canonical procedures, so
  // leaving them out preserves the "procedure = abstract recipe" contract.
  let procedure = extractNumberedSteps(formule ? formule.content : '');
  if (procedure.length === 0) procedure = [fallbackDesc];

  const pitfallText = valkuil ? firstSentence(valkuil.content) : null;
  const pitfalls = pitfallText ? [pitfallText] : undefined;
  return { procedure, pitfalls };
}

function main() {
  if (!fs.existsSync(EXPLANATIONS)) {
    console.error(`missing: ${EXPLANATIONS}`);
    process.exit(1);
  }
  if (!fs.existsSync(MAP_PATH)) {
    console.error(`missing: ${MAP_PATH}`);
    process.exit(1);
  }

  const explanations = require(EXPLANATIONS);
  const mapping = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));  // { "F1": "A01", ... }

  const { preamble, units, byId } = loadCatalog();
  let enrichedCount = 0;
  let skippedCount = 0;

  for (const [oldId, newId] of Object.entries(mapping)) {
    const exp = explanations[oldId];
    const unit = byId.get(newId);
    if (!unit) { skippedCount++; continue; }
    if (!exp) { skippedCount++; continue; }

    const fallbackDesc = unit.kern || '';
    const { procedure, pitfalls } = deriveProcedureAndPitfalls(exp, fallbackDesc);

    if (procedure.length <= 1 && !pitfalls) { skippedCount++; continue; }

    unit.procedure = procedure;
    if (pitfalls) unit.pitfalls = pitfalls;
    enrichedCount++;
  }

  try {
    saveCatalog({ preamble, units });
  } catch (err) {
    if (err.errors) for (const e of err.errors) console.error('CATALOG  ' + e);
    else console.error('ERROR  ' + err.message);
    process.exit(1);
  }

  console.log(`OK  enriched ${enrichedCount} units; ${skippedCount} skipped (no richer content found)`);
}

if (require.main === module) main();

module.exports = { extractNumberedSteps, extractStapLines, firstSentence, deriveProcedureAndPitfalls };
