#!/usr/bin/env node
/**
 * rewire-skilltree.js
 *
 * One-shot: rewire the skilltree engine to consume the machine-managed
 * micro-teaching-units catalog. Executes three changes atomically:
 *
 *   1. Extract GEN.* functions from engines/skilltree/base-elements.js into
 *      engines/skilltree/generators.js, renaming keys F1→A01, B3→A09, …
 *      per build-scripts/references/math-migration-map.json.
 *   2. Rewrite engines/skilltree/base-elements.js to load SKILLS data from
 *      references/machine/micro-teaching-units.json (filtered to A-domain),
 *      import GEN from ./generators, keep LAYER_NAMES / LAYER_COLORS inline.
 *   3. Rewrite every source-data/module-N/skilltree/X.Y.Z.js file's
 *      activeSkills and newSkills arrays via the same migration map.
 *
 * Idempotency guard: refuses to run if engines/skilltree/generators.js
 * already exists, so re-runs don't corrupt a rewired state.
 *
 * See knowledge/micro-teaching-units-plan.md §6.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT      = path.resolve(__dirname, '..', '..');
const BASE_ELEMENTS  = path.join(REPO_ROOT, 'engines/skilltree/base-elements.js');
const GENERATORS     = path.join(REPO_ROOT, 'engines/skilltree/generators.js');
const MAP_PATH       = path.join(__dirname, 'math-migration-map.json');

function applyGenKeyMap(code, map) {
  // Replace `GEN.<oldId> =` (key defs) and `GEN.<oldId>(` (recursive calls)
  // with their new IDs. Use word boundary to avoid GEN.B1 matching GEN.B10.
  let out = code;
  // Longer keys first to prevent B1 matching inside B10
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const oldId of keys) {
    const newId = map[oldId];
    out = out.replace(new RegExp(`GEN\\.${oldId}(?![A-Z0-9])`, 'g'), `GEN.${newId}`);
  }
  return out;
}

function applyActiveSkillsMap(code, map) {
  // Replace bare `"<oldId>"` (double-quoted, word-boundary) for every entry.
  let out = code;
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const oldId of keys) {
    const newId = map[oldId];
    out = out.replace(new RegExp(`"${oldId}"`, 'g'), `"${newId}"`);
    out = out.replace(new RegExp(`'${oldId}'`, 'g'), `'${newId}'`);
  }
  return out;
}

function extractGeneratorsSection(base) {
  const genStart = base.indexOf('var GEN = {};');
  if (genStart === -1) throw new Error('cannot locate "var GEN = {};"');
  const returnStart = base.indexOf('\n    return {', genStart);
  if (returnStart === -1) throw new Error('cannot locate return {...} block');
  return base.slice(genStart, returnStart);
}

function buildGeneratorsFile(base, map) {
  const genSection = extractGeneratorsSection(base);
  const renamedSection = applyGenKeyMap(genSection, map);

  // Lift the helpers block from base-elements.js (between /* helpers */ and
  // /* skill definitions */ comment markers).
  const helpersStart = base.indexOf('/* \u2500\u2500 helpers');
  const helpersEnd   = base.indexOf('/* \u2500\u2500 skill definitions');
  if (helpersStart === -1 || helpersEnd === -1) throw new Error('cannot locate helpers block');
  const helpersBlock = base.slice(helpersStart, helpersEnd);

  return [
    '/**',
    ' * SkillTree Generators — 37 exercise randomizers, one per unit.',
    ' * Extracted from base-elements.js during the unit-catalog rewire.',
    ' * Keyed by A01–A37 (CvTE domain A). Generator behaviour is unchanged;',
    ' * only the key names differ from the legacy F/B/S/E scheme.',
    ' */',
    '(function (root, factory) {',
    '    if (typeof module !== \'undefined\' && module.exports) {',
    '        module.exports = factory();',
    '    } else {',
    '        root.SKILL_TREE_GENERATORS = factory();',
    '    }',
    '})(typeof self !== \'undefined\' ? self : this, function () {',
    '    \'use strict\';',
    '',
    '    ' + helpersBlock.trim(),
    '',
    '    ' + renamedSection.trim(),
    '',
    '    return {',
    '        GEN: GEN,',
    '        helpers: { ri: ri, pick: pick, round1: round1, round2: round2, mcStep: mcStep }',
    '    };',
    '});',
    '',
  ].join('\n');
}

function buildBaseElementsFile() {
  return [
    '/**',
    ' * SkillTree Base Elements — thin adapter that joins the canonical',
    ' * micro-teaching-units catalog with the generator functions.',
    ' *',
    ' * SKILLS data is authoritatively sourced from',
    ' *   references/machine/micro-teaching-units.json',
    ' * (A-domain slice, edited only via CLI scripts under build-scripts/references/).',
    ' *',
    ' * GEN functions live in ./generators.js. LAYER_NAMES and LAYER_COLORS stay',
    ' * inline here because they are presentation-layer concerns, not curriculum data.',
    ' */',
    '(function (root, factory) {',
    '    if (typeof module !== \'undefined\' && module.exports) {',
    '        module.exports = factory();',
    '    } else {',
    '        root.SKILL_TREE_ELEMENTS = factory();',
    '    }',
    '})(typeof self !== \'undefined\' ? self : this, function () {',
    '    \'use strict\';',
    '',
    '    // Load catalog + generators. Both require synchronous availability.',
    '    var units, generators;',
    '    if (typeof module !== \'undefined\' && module.exports) {',
    '        units = require(\'../../references/machine/micro-teaching-units.json\');',
    '        generators = require(\'./generators\');',
    '    } else {',
    '        units = (root.MICRO_TEACHING_UNITS || []);',
    '        generators = (root.SKILL_TREE_GENERATORS || { GEN: {}, helpers: {} });',
    '    }',
    '',
    '    var SKILLS = [];',
    '    for (var i = 0; i < units.length; i++) {',
    '        var u = units[i];',
    '        if (u.id.charAt(0) !== \'A\') continue;',
    '        if (u.deprecated) continue;',
    '        SKILLS.push({',
    '            id: u.id,',
    '            name: u.name,',
    '            layer: u.layer,',
    '            needs: u.needs || [],',
    '            desc: u.kern || (u.procedure && u.procedure[0]) || \'\'',
    '        });',
    '    }',
    '',
    '    var LAYER_NAMES = [\'Fundament\', \'Bouwstenen\', \'Marginale grootheden\', \'Samengesteld\', \'Gevorderd\', \'Eindbazen\'];',
    '    var LAYER_COLORS = [',
    '        { bg:\'#1a3353\', text:\'#7cb9e8\', glow:\'rgba(26,82,118,0.35)\' },',
    '        { bg:\'#2a1f4e\', text:\'#b8a9e8\', glow:\'rgba(136,78,160,0.3)\' },',
    '        { bg:\'#1a3a3a\', text:\'#7dcec0\', glow:\'rgba(30,132,120,0.3)\' },',
    '        { bg:\'#1a3a2a\', text:\'#7dcea0\', glow:\'rgba(30,132,73,0.3)\' },',
    '        { bg:\'#3a1a2a\', text:\'#e07a9a\', glow:\'rgba(180,60,100,0.3)\' },',
    '        { bg:\'#4a2a1a\', text:\'#f0b27a\', glow:\'rgba(230,126,34,0.3)\' }',
    '    ];',
    '',
    '    return {',
    '        SKILLS: SKILLS,',
    '        LAYER_NAMES: LAYER_NAMES,',
    '        LAYER_COLORS: LAYER_COLORS,',
    '        GEN: generators.GEN,',
    '        helpers: generators.helpers',
    '    };',
    '});',
    '',
  ].join('\n');
}

function rewireActiveSkillsFiles(map) {
  const dirs = ['source-data/module-1/skilltree', 'source-data/module-3/skilltree'];
  const paths = [];
  for (const dir of dirs) {
    const abs = path.join(REPO_ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs)) {
      if (f.endsWith('.js')) paths.push(path.join(abs, f));
    }
  }
  let totalReplaced = 0;
  for (const p of paths) {
    const before = fs.readFileSync(p, 'utf8');
    const after = applyActiveSkillsMap(before, map);
    if (after !== before) {
      fs.writeFileSync(p, after);
      totalReplaced++;
    }
  }
  return { count: paths.length, rewritten: totalReplaced };
}

function main() {
  if (fs.existsSync(GENERATORS)) {
    console.error(`refuse to re-run: ${path.relative(REPO_ROOT, GENERATORS)} already exists.`);
    console.error('delete it manually if you want to re-rewire (destructive).');
    process.exit(1);
  }
  if (!fs.existsSync(MAP_PATH)) {
    console.error(`missing migration map: ${MAP_PATH}`);
    console.error('run seed-math-units.js first.');
    process.exit(1);
  }
  const map = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));
  const base = fs.readFileSync(BASE_ELEMENTS, 'utf8');

  const generatorsContent = buildGeneratorsFile(base, map);
  const baseElementsContent = buildBaseElementsFile();

  fs.writeFileSync(GENERATORS, generatorsContent);
  fs.writeFileSync(BASE_ELEMENTS, baseElementsContent);

  const { count, rewritten } = rewireActiveSkillsFiles(map);

  console.log('OK  skilltree rewired:');
  console.log(`    wrote ${path.relative(REPO_ROOT, GENERATORS)} (${generatorsContent.split('\n').length} lines)`);
  console.log(`    wrote ${path.relative(REPO_ROOT, BASE_ELEMENTS)} (thin adapter)`);
  console.log(`    rewrote activeSkills/newSkills in ${rewritten}/${count} per-paragraph files`);
}

if (require.main === module) main();

module.exports = { applyGenKeyMap, applyActiveSkillsMap, buildGeneratorsFile, buildBaseElementsFile };
