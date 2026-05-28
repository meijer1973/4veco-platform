#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const { validate, loadTerminology, loadEindtermen } = require('./build-unit-index');

const ROOT = process.cwd();
const H3B_CLOSURE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3B-incidence-cli-execution', 'gate-closure.json');
const H3B_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h3b-incidence-cli-execution-packet.json');
const EXEC_LOG = path.join(ROOT, 'reports', 'sprints', 'MTU-H3C-execution-log.json');
const RESULT_JSON = path.join(ROOT, 'references', 'data', 'sprints', 'MTU-H3C.result.json');
const UNITS_JSON = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const TARGET_EXERCISES = path.join(ROOT, 'references', 'authored', 'course-target-exercises.json');
const ROADMAP = path.join(ROOT, 'references', 'reference-team-roadmap.md');

function fail(message) {
  console.error(`MTU-H3C incidence CLI execution check failed: ${message}`);
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
  const lane = packet.unit_lanes.find((entry) => entry.unit_id === id);
  if (!lane) fail(`missing H3B packet unit lane ${id}`);
  return lane;
}

function expectedSpec(packet, id) {
  const spec = JSON.parse(JSON.stringify(unitLane(packet, id).reviewed_spec));
  if (id === 'D42') {
    spec.zero_needs_status = 'true_zero';
    spec.zero_needs_review = {
      reviewed_on: '2026-05-28',
      reviewer: 'GATE-MTU-H3B',
      rationale: 'D42 is an economics-specific root operation from available P0/Pc/Pp/t values. It must not force graphical D41; graph contexts map D41 separately and calculation contexts can supply prices directly.',
      recommended_needs: [],
      severity: 'medium',
      h3c_execution_decision: 'fixed from underbouw_assumed to true_zero per GATE-MTU-H3B condition',
    };
  }
  return spec;
}

function mappingPatch(packet, id) {
  const patch = packet.target_exercise_mapping_patch_plan.find((entry) => entry.record_id === id);
  if (!patch) fail(`missing H3B packet mapping patch ${id}`);
  return patch;
}

function assertUnitMatches(unit, spec, id) {
  if (unit.name !== spec.name) fail(`${id} name mismatch`);
  if (unit.kern !== spec.kern) fail(`${id} kern mismatch`);
  sameArray(unit.needs, spec.needs, `${id} needs`);
  sameArray(unit.exam_codes, spec.exam_codes, `${id} exam_codes`);
  sameArray(unit.aspects, spec.aspects, `${id} aspects`);
  sameArray(unit.terms, spec.terms, `${id} terms`);
  if ((unit.procedure || []).join('\n') !== (spec.procedure || []).join('\n')) fail(`${id} procedure mismatch`);
  if ((unit.pitfalls || []).join('\n') !== (spec.pitfalls || []).join('\n')) fail(`${id} pitfalls mismatch`);
}

const closure = readJson(H3B_CLOSURE);
const packet = readJson(H3B_PACKET);
const executionLog = readJson(EXEC_LOG);
const result = fs.existsSync(RESULT_JSON) ? readJson(RESULT_JSON) : null;
const units = readJson(UNITS_JSON);
const targetData = readJson(TARGET_EXERCISES);
const roadmap = readText(ROADMAP);

if (closure.status !== 'pass_with_conditions') fail('H3B closure must be pass_with_conditions');
if (!closure.authorized_next || closure.authorized_next.sprint_id !== 'MTU-H3C' || closure.authorized_next.execution_authorized !== true) {
  fail('H3B closure must authorize MTU-H3C execution');
}
if (executionLog.status !== 'passed') fail('MTU-H3C execution log must have status passed');
if (executionLog.reviewed_remote_commit !== closure.reviewed_remote_commit) fail('execution log reviewed commit must match closure');
if (executionLog.d42_zero_needs_execution_decision !== 'true_zero') fail('execution log must record D42 true_zero decision');
if (!Array.isArray(executionLog.extracted_specs) || executionLog.extracted_specs.length !== 6) {
  fail('execution log must include six extracted specs');
}
for (const id of ['D41', 'D42', 'D43', 'D45', 'D46', 'D07']) {
  if (!executionLog.extracted_specs.some((entry) => entry.unit_id === id)) fail(`execution log missing extracted spec for ${id}`);
}

const unitMap = byId(units);
for (const id of ['D07', 'D41', 'D42', 'D43', 'D45', 'D46', 'D05', 'A38', 'A41', 'A93', 'A15']) {
  if (!unitMap.has(id)) fail(`${id} must exist after H3C`);
}
if (unitMap.has('D44')) fail('D44 must remain absent after H3C');

for (const id of ['D41', 'D42', 'D43', 'D45', 'D46']) {
  assertUnitMatches(unitMap.get(id), expectedSpec(packet, id), id);
}
const d42 = unitMap.get('D42');
if (d42.zero_needs_status !== 'true_zero') fail('D42 must use true_zero status');
sameArray(d42.needs, [], 'D42 needs');

const d07 = unitMap.get('D07');
const d07Patch = unitLane(packet, 'D07').reviewed_patch;
if (d07.name !== d07Patch.name) fail('D07 name mismatch');
if (d07.kern !== d07Patch.kern) fail('D07 kern mismatch');
sameArray(d07.needs, ['D42', 'A38'], 'D07 needs');
sameArray(d07.exam_codes, d07Patch.exam_codes, 'D07 exam_codes');
if (d07.needs.includes('A15')) fail('D07 must not retain A15');
if ((d07.procedure || []).some((step) => /elastic/i.test(step))) {
  fail('D07 procedure must not contain hidden elasticity explanation');
}

sameArray(unitMap.get('A93').needs, ['A38', 'A92'], 'A93 needs unchanged');
if (!String(unitMap.get('A93').kern || '').includes('onderscheid dit van pass-through')) {
  fail('A93 must remain bounded to price percentage change');
}

const catalogErrors = validate(units, {
  terms: loadTerminology(),
  eindtermen: loadEindtermen(),
}).errors;
if (catalogErrors.length) fail(`catalog validation errors: ${catalogErrors.join('; ')}`);

const exercises = targetData.exercises || targetData;
for (const id of ['3.1.1', '3.1.2', '3.1.3']) {
  const target = targetById(exercises, id);
  const patch = mappingPatch(packet, id);
  sameArray(target.required_skills, patch.after.required_skills, `${id} required_skills`);
  sameArray(target.prior_knowledge_assumed, patch.after.prior_knowledge_assumed, `${id} prior_knowledge_assumed`);
  sameArray(target.new_skills_introduced, patch.after.new_skills_introduced, `${id} new_skills_introduced`);
  sameArray(target.missing_units_flagged, patch.after.missing_units_flagged, `${id} missing_units_flagged`);
  if (target.record_status !== 'migrated_from_v4_needs_v5_review') fail(`${id} record_status must not change`);
  if (!String(target.source_ref || '').includes(`§${id}`)) fail(`${id} source_ref must remain tied to same paragraph`);
}
if (JSON.stringify(targetById(exercises, '3.1.3')).includes('D44')) fail('3.1.3 must not map D44');

if (result) {
  if (result.sprint_id !== 'MTU-H3C') fail('result JSON sprint_id mismatch');
  if (result.status !== 'completed') fail('result JSON must be completed');
  if (result.protected_reference_data_changed !== true) fail('result JSON must record protected reference change');
  if (result.external_source_changed !== false) fail('result JSON must record no external source change');
  if (result.student_product_use_allowed !== false) fail('result JSON must block student/product use');
}

const firstRowMatch = roadmap.match(/\| Sprint \| Name \| Completed \| Current State \|\s*\n\|[-|]+\|\s*\n(\|[^\n]+\|)/);
if (!firstRowMatch) fail('could not find first Sprint Ledger row in roadmap');
const firstRow = firstRowMatch[1];
if (!/\| (MTU-H4|MTU-H3C) \|/.test(firstRow)) fail('first Sprint Ledger row must be MTU-H4 or MTU-H3C after execution');
if (!firstRow.includes('ACTIVE OPERATIONAL NEXT ACTION')) fail('first row must state ACTIVE OPERATIONAL NEXT ACTION');

console.log('OK MTU-H3C incidence CLI execution');
