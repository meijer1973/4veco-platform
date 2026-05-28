#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const { validate, loadTerminology, loadEindtermen } = require('./build-unit-index');

const ROOT = process.cwd();
const H2I_CLOSURE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2I-a20-cli-execution', 'gate-closure.json');
const H2I_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-a20-cli-execution-packet.json');
const EXEC_LOG = path.join(ROOT, 'reports', 'sprints', 'MTU-H2J-execution-log.json');
const RESULT_JSON = path.join(ROOT, 'references', 'data', 'sprints', 'MTU-H2J.result.json');
const UNITS_JSON = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const TARGET_EXERCISES = path.join(ROOT, 'references', 'authored', 'course-target-exercises.json');
const GENERATORS_JS = path.join(ROOT, 'engines', 'skilltree', 'generators.js');
const READINESS_JSON = path.join(ROOT, 'reports', 'json', 'skilltree-generator-readiness.json');
const ROADMAP = path.join(ROOT, 'references', 'reference-team-roadmap.md');

function fail(message) {
  console.error(`MTU-H2J A20/A94/A95 execution check failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${path.relative(ROOT, file)}`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${path.relative(ROOT, file)}: ${error.message}`);
  }
}

function readText(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${path.relative(ROOT, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function sameArray(actual, expected, context) {
  if (!Array.isArray(actual) || actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    fail(`${context} must be [${expected.join(', ')}]`);
  }
}

function byId(items) {
  return new Map(items.map((item) => [item.id || item.unit_id, item]));
}

function targetById(exercises, id) {
  const target = exercises.find((record) => record.id === id);
  if (!target) fail(`missing target exercise ${id}`);
  return target;
}

function unitLane(packet, id) {
  const item = (packet.unit_lanes || []).find((entry) => entry.unit_id === id);
  if (!item) fail(`missing H2I packet unit lane ${id}`);
  return item;
}

function mappingPatch(packet, id) {
  const item = (packet.target_exercise_mapping_patch_plan || []).find((entry) => entry.record_id === id);
  if (!item) fail(`missing H2I packet mapping patch ${id}`);
  return item;
}

const closure = readJson(H2I_CLOSURE);
const packet = readJson(H2I_PACKET);
const executionLog = readJson(EXEC_LOG);
const result = fs.existsSync(RESULT_JSON) ? readJson(RESULT_JSON) : null;
const units = readJson(UNITS_JSON);
const targetData = readJson(TARGET_EXERCISES);
const generatorSource = readText(GENERATORS_JS);
const readiness = fs.existsSync(READINESS_JSON) ? readJson(READINESS_JSON) : null;
const roadmap = readText(ROADMAP);

if (closure.status !== 'pass_with_conditions') fail('H2I closure must be pass_with_conditions');
if (!closure.authorized_next || closure.authorized_next.sprint_id !== 'MTU-H2J' || closure.authorized_next.execution_authorized !== true) {
  fail('H2I closure must authorize MTU-H2J execution');
}
if (executionLog.status !== 'passed') fail('MTU-H2J execution log must have status passed');
if (executionLog.reviewed_remote_commit !== closure.reviewed_remote_commit) fail('execution log reviewed commit must match closure');
if (!Array.isArray(executionLog.extracted_specs) || executionLog.extracted_specs.length !== 3) fail('execution log must include three extracted specs');
for (const id of ['A20', 'A94', 'A95']) {
  if (!executionLog.extracted_specs.some((entry) => entry.unit_id === id)) fail(`execution log missing extracted spec for ${id}`);
}
if (!Array.isArray(executionLog.mapping_patches) || executionLog.mapping_patches.length !== 3) fail('execution log must include three mapping patch records');
if (!executionLog.generator_patch || !String(executionLog.generator_patch.route || '').includes('GEN_A20')) {
  fail('execution log must include generator patch summary');
}

const unitMap = byId(units);
for (const id of ['A20', 'A94', 'A95', 'A91', 'A12', 'A13', 'A02']) {
  if (!unitMap.has(id)) fail(`${id} must exist after H2J`);
}

const a20 = unitMap.get('A20');
const a94 = unitMap.get('A94');
const a95 = unitMap.get('A95');
const a20Spec = unitLane(packet, 'A20').reviewed_spec;
const a94Spec = unitLane(packet, 'A94').reviewed_spec;
const a95Spec = unitLane(packet, 'A95').reviewed_spec;

if (a20.name !== a20Spec.name) fail('A20 name mismatch after execution');
sameArray(a20.needs, a20Spec.needs, 'A20 needs');
sameArray(a20.exam_codes, a20Spec.exam_codes, 'A20 exam_codes');
if (!a20.exam_codes.includes('A2.11')) fail('A20 must retain A2.11');
if (a20.generator !== 'GEN_A20') fail('A20 generator field must remain GEN_A20');

for (const [id, unit, spec] of [
  ['A94', a94, a94Spec],
  ['A95', a95, a95Spec],
]) {
  if (unit.name !== spec.name) fail(`${id} name mismatch`);
  if (unit.kern !== spec.kern) fail(`${id} kern mismatch`);
  sameArray(unit.needs, spec.needs, `${id} needs`);
  sameArray(unit.exam_codes, spec.exam_codes, `${id} exam_codes`);
  sameArray(unit.aspects, spec.aspects, `${id} aspects`);
  sameArray(unit.terms, spec.terms, `${id} terms`);
  if (unit.generator !== spec.generator) fail(`${id} generator mismatch`);
}
if ((a94.needs || []).includes('A12')) fail('A94 must not require A12');
if (!JSON.stringify(a94.procedure || []).includes('MO = marktprijs P')) fail('A94 procedure must retain MO = marktprijs P');
if (!JSON.stringify(a95.procedure || []).includes('gegeven MK-functie')) fail('A95 procedure must retain given MK-function route');

const catalogErrors = validate(units, {
  terms: loadTerminology(),
  eindtermen: loadEindtermen(),
}).errors;
if (catalogErrors.length) fail(`catalog validation errors: ${catalogErrors.join('; ')}`);

const exercises = targetData.exercises || targetData;
for (const id of ['3.2.2', '3.3.3', '4.1.2']) {
  const target = targetById(exercises, id);
  const patch = mappingPatch(packet, id);
  sameArray(target.required_skills, patch.after.required_skills, `${id} required_skills`);
  sameArray(target.prior_knowledge_assumed, patch.after.prior_knowledge_assumed, `${id} prior_knowledge_assumed`);
  sameArray(target.new_skills_introduced, patch.after.new_skills_introduced, `${id} new_skills_introduced`);
  if (target.record_status !== 'migrated_from_v4_needs_v5_review') fail(`${id} record_status must not change`);
  if (!String(target.source_ref || '').includes(`§${id}`)) fail(`${id} source_ref must remain tied to same paragraph`);
}

if (generatorSource.includes('GEN.A20 = function ()')) fail('GEN.A20 implementation must be absent/blocked after H2J');
if (!generatorSource.includes('GEN.A95 = function ()')) fail('GEN.A95 implementation must exist after H2J');
if (generatorSource.includes('GEN.A94 = function ()')) fail('GEN.A94 must remain absent unless separately implemented');

if (readiness) {
  if (readiness.status !== 'passed') fail('generator readiness report must pass');
  const rows = byId(readiness.rows || []);
  if (!rows.has('A20') || !rows.has('A94') || !rows.has('A95')) fail('generator readiness must include A20/A94/A95');
  if (!rows.get('A20').generator_blocked) fail('A20 must be generator-blocked after narrowed route');
  if (!rows.get('A94').generator_blocked) fail('A94 must be generator-blocked unless implemented');
  if (rows.get('A95').generator_blocked) fail('A95 must be implemented after GEN.A20 behavior moves');
  if (readiness.summary.blocked_interactive_leak_count !== 0) fail('blocked interactive leak count must be zero');
}

if (result) {
  if (result.sprint_id !== 'MTU-H2J') fail('result JSON sprint_id mismatch');
  if (result.status !== 'completed') fail('result JSON must be completed');
  if (result.protected_reference_data_changed !== true) fail('result JSON must record protected reference change');
  if (result.external_source_changed !== false) fail('result JSON must record no external source change');
}

const firstRowMatch = roadmap.match(/\| Sprint \| Name \| Completed \| Current State \|\s*\n\|[-|]+\|\s*\n(\|[^\n]+\|)/);
if (!firstRowMatch) fail('could not find first Sprint Ledger row in roadmap');
const firstRow = firstRowMatch[1];
if (!/\| (MTU-H3|GATE-MTU-H2J|MTU-H2J) \|/.test(firstRow)) {
  fail('first Sprint Ledger row must be MTU-H3, GATE-MTU-H2J, or MTU-H2J after execution');
}
if (!firstRow.includes('ACTIVE OPERATIONAL NEXT ACTION')) fail('first row must state ACTIVE OPERATIONAL NEXT ACTION');

console.log('OK MTU-H2J A20/A94/A95 execution');
