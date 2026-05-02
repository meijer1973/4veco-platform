#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Update REQUIRED_UNITS only after a later human gate changes the RX.4
 *   elasticity mutation set.
 * - Keep this checker read-only. It verifies that protected machine catalog
 *   changes were CLI-applied and that generator/product-use blocks are tracked
 *   outside references/machine/.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REQUIRED_UNITS = ['A82', 'A84', 'A83'];
const EXPECTED_NEEDS = {
  A82: ['A15', 'A61', 'A66'],
  A83: ['A15', 'A46', 'A66'],
  A84: ['A15', 'A67'],
};
const EXPECTED_GENERATORS = {
  A82: 'GEN_A82',
  A83: 'GEN_A83',
  A84: 'GEN_A84',
};
const A83_NAME = 'Prijselasticiteit van de vraag berekenen uit P-Q-grafiek';

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function fail(message) {
  console.error(`RX.4 mutation check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function sameArray(actual, expected) {
  return JSON.stringify(actual || []) === JSON.stringify(expected || []);
}

function procedureText(unit) {
  return (unit.procedure || []).join(' ').toLowerCase();
}

function procedureHasElasticityInterpretation(unit) {
  const text = procedureText(unit);
  return /teken/.test(text)
    && /absolute waarde/.test(text)
    && /elastisch/.test(text)
    && /inelastisch/.test(text);
}

function procedureHasA82Pairing(unit) {
  const text = procedureText(unit);
  return /oude prijs/.test(text)
    && /oude hoeveelheid/.test(text)
    && /nieuwe prijs/.test(text)
    && /nieuwe hoeveelheid/.test(text)
    && /dezelfde situatie/.test(text);
}

function procedureHasA83GraphDiscipline(unit) {
  const text = procedureText(unit);
  return /titel/.test(text)
    && /horizontale as/.test(text)
    && /verticale as/.test(text)
    && /eenheden/.test(text)
    && /schaal/.test(text)
    && /labels|legenda/.test(text)
    && /exact of geschat/.test(text)
    && /p,q-paren/.test(text);
}

function procedureHasA84RevenueLogic(unit) {
  const text = procedureText(unit);
  return /elastische vraag beweegt omzet tegengesteld aan de prijs/.test(text)
    && /inelastische vraag beweegt omzet mee met de prijs/.test(text)
    && /unitair elastische vraag blijft omzet ongeveer gelijk/.test(text)
    && /to = p maal q/.test(text);
}

function main() {
  const closure = readJson('reports/review-gates/GATE-RX4-elasticity-market-diagram-review/gate-closure.json');
  assert(closure.status === 'pass_with_conditions', 'gate closure must be pass_with_conditions');
  assert(closure.cli_unit_mutation_authorized === true, 'gate closure must authorize CLI mutation');
  assert(sameArray(closure.required_execution_order, REQUIRED_UNITS), 'gate closure required execution order mismatch');
  assert(closure.a83_naming_decision.preferred_name === A83_NAME, 'A83 naming decision mismatch');
  assert(closure.pv_projection_authorized === false, 'PV projection must remain unauthorized');
  for (const id of REQUIRED_UNITS) {
    assert(sameArray(closure.required_dependencies[id], EXPECTED_NEEDS[id]), `${id} closure dependency mismatch`);
  }

  const log = readJson('reports/review-gates/GATE-RX4-elasticity-market-diagram-review/RX.4-mutation-log.json');
  assert(log.status === 'completed', 'mutation log must be completed');
  assert(log.execution_mode === 'CLI-only via build-scripts/references/unit-add.js', 'mutation log execution mode mismatch');
  assert(sameArray(log.applied.units_added, REQUIRED_UNITS), 'mutation log units_added mismatch');
  assert(log.a83_naming_decision.final_name === A83_NAME, 'mutation log must record A83 final name');

  const block = readJson('reports/review-gates/GATE-RX4-elasticity-market-diagram-review/RX.4-generator-blocked-units.json');
  assert(block.status === 'active_block', 'generator block status must be active_block');
  assert(block.student_facing_skilltree_use_allowed === false, 'student-facing skill-tree use must remain blocked');
  assert(block.pv_projection_allowed === false, 'PV projection must remain blocked');

  const blockById = new Map(block.units.map((unit) => [unit.unit_id, unit]));
  const units = readJson('references/machine/micro-teaching-units.json');
  const byId = new Map(units.map((unit) => [unit.id, unit]));

  for (const id of REQUIRED_UNITS) {
    const unit = byId.get(id);
    assert(unit, `${id} missing from micro-teaching-units.json`);
    assert(unit.deprecated !== true, `${id} must be live/non-deprecated`);
    assert(sameArray(unit.needs, EXPECTED_NEEDS[id]), `${id} needs mismatch`);
    assert(unit.generator === EXPECTED_GENERATORS[id], `${id} generator mismatch`);
    assert(Array.isArray(unit.procedure) && unit.procedure.length >= 7, `${id} must have procedure steps`);
    assert(procedureHasElasticityInterpretation(unit), `${id} must preserve elasticity sign/absolute-value interpretation`);
    const blocked = blockById.get(id);
    assert(blocked, `${id} missing from generator block tracking`);
    assert(blocked.generator === EXPECTED_GENERATORS[id], `${id} generator block mismatch`);
    assert(blocked.generator_implemented === false, `${id} generator_implemented must be false`);
    assert(blocked.student_facing_skilltree_use_allowed === false, `${id} student-facing skill-tree use must be blocked`);
    assert(blocked.pv_projection_allowed === false, `${id} PV projection must be blocked`);
  }

  assert(procedureHasA82Pairing(byId.get('A82')), 'A82 must explicitly pair old/new P and Q values');
  assert(byId.get('A83').name === A83_NAME, 'A83 live name mismatch');
  assert(procedureHasA83GraphDiscipline(byId.get('A83')), 'A83 must encode P-Q graph-source discipline');
  assert(procedureHasA84RevenueLogic(byId.get('A84')), 'A84 must encode elasticity-to-omzet reasoning');

  for (const blockedScope of [
    'market/welfare duplicate areas',
    'new welfare/surplus units overlapping A19',
    'new short-side/intervention units overlapping A59',
  ]) {
    assert(closure.held_scope.includes(blockedScope), `closure held_scope missing ${blockedScope}`);
  }

  console.log(`OK RX.4 elasticity market-diagram mutations: ${REQUIRED_UNITS.join(', ')} verified`);
}

if (require.main === module) main();
