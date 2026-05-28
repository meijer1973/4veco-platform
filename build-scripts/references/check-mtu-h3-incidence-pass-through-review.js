#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep this checker non-mutating: it verifies review artifacts and current
 *   evidence only.
 * - If GATE-MTU-H3 closes with different accepted lane labels, update the
 *   planning-only candidate list here and in the packet together.
 * - Do not use this checker to write references/machine or references/external.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h3-incidence-pass-through-family-review.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h3-incidence-pass-through-family-review.md');
const REVIEW_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3-incidence-pass-through', 'review-packet.json');
const REVIEW_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3-incidence-pass-through', 'review-packet.md');
const BUNDLE_URLS = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3-incidence-pass-through', 'bundle-urls.md');
const HUMAN_INTERVIEW_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3-incidence-pass-through', 'human-interview.json');
const GATE_CLOSURE_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3-incidence-pass-through', 'gate-closure.json');
const H2J_RESULT = path.join(ROOT, 'reports', 'sprints', 'MTU-H2J-result.md');
const UNITS_JSON = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const TARGET_EXERCISES = path.join(ROOT, 'references', 'authored', 'course-target-exercises.json');
const ROADMAP = path.join(ROOT, 'references', 'reference-team-roadmap.md');

const AUTHORITY_FALSE_KEYS = [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'unit_minting_authorized',
  'unit_update_execution_authorized',
  'unit_split_execution_authorized',
  'unit_deprecation_authorized',
  'target_exercise_mutation_authorized',
  'candidate_storage_creation_authorized',
  'candidate_writes_authorized',
  'lesson_output_mutation_authorized',
  'target_exercise_promotion_authorized',
  'generated_projection_refresh_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'sequencing_authorized',
  'student_facing_ai_authorized',
  'summative_use_authorized',
  'pv_projection_authorized',
  'pv_machine_promotion_authorized',
  'student_product_use_authorized',
];

function fail(message) {
  console.error(`MTU-H3 incidence/pass-through review check failed: ${message}`);
  process.exit(1);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function readJson(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${rel(file)}`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${rel(file)}: ${error.message}`);
  }
}

function readText(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${rel(file)}`);
  return fs.readFileSync(file, 'utf8');
}

function requireFalse(object, key, context) {
  if (!object || object[key] !== false) fail(`${context}.${key} must be false`);
}

function requireIncludes(text, needle, context) {
  if (!text.includes(needle)) fail(`${context} must include ${needle}`);
}

function targetById(exercises, id) {
  const target = exercises.find((record) => record.id === id);
  if (!target) fail(`missing target exercise ${id}`);
  return target;
}

function hasSkill(record, skill) {
  return Array.isArray(record.required_skills) && record.required_skills.includes(skill);
}

const packet = readJson(PACKET_JSON);
const packetMd = readText(PACKET_MD);
const review = readJson(REVIEW_JSON);
const reviewMd = readText(REVIEW_MD);
const bundle = readText(BUNDLE_URLS);
const h2jResult = readText(H2J_RESULT);
const units = readJson(UNITS_JSON);
const targetData = readJson(TARGET_EXERCISES);
const roadmap = readText(ROADMAP);

if (packet.schema_version !== 1) fail('packet schema_version must be 1');
if (packet.sprint_id !== 'MTU-H3') fail('packet sprint_id must be MTU-H3');
if (packet.gate_id !== 'GATE-MTU-H3-incidence-pass-through') fail('packet gate_id mismatch');
if (packet.status !== 'review_packet_ready_no_mutation') fail('packet status mismatch');
if (packet.remote_publication_required_before_review !== true) fail('packet must require remote publication');
if (!String(packet.remote_publication_status || '').includes('push')) fail('packet remote status must mention push');
if (review.gate_id !== packet.gate_id) fail('review gate_id mismatch');
if (review.source_packet !== 'reports/mtu-hardening/mtu-h3-incidence-pass-through-family-review.json') {
  fail('review source_packet mismatch');
}
if (review.remote_publication_required_before_review !== true) fail('review must require remote publication');

for (const key of AUTHORITY_FALSE_KEYS) {
  requireFalse(packet.authority_boundary, key, 'packet.authority_boundary');
  requireFalse(review.authority_boundary, key, 'review.authority_boundary');
}

if (!Array.isArray(review.calibration_questions) || review.calibration_questions.length !== 3) {
  fail('review must have exactly 3 calibration questions');
}
if (!Array.isArray(review.planned_questions) || review.planned_questions.length !== 10) {
  fail('review must have exactly 10 planned questions');
}
for (let i = 1; i <= 10; i += 1) {
  requireIncludes(reviewMd, `MTUH3-Q${i}`, 'review-packet.md');
}

const unitMap = new Map(units.map((unit) => [unit.id, unit]));
for (const id of ['D07', 'D05', 'A23', 'A41', 'A93', 'D19', 'D29']) {
  if (!unitMap.has(id)) fail(`live unit ${id} must exist`);
}
const d07 = unitMap.get('D07');
if (!d07.needs.includes('D05') || !d07.needs.includes('A15')) fail('D07 baseline needs must include D05 and A15');
if (!String(d07.kern).includes('percentage')) fail('D07 baseline kern must mention percentage');
const a93 = unitMap.get('A93');
if (!String(a93.kern).includes('onderscheid dit van pass-through')) {
  fail('A93 baseline must preserve price-change/pass-through boundary');
}

for (const id of ['D41', 'D42', 'D43', 'D44', 'D45', 'D46']) {
  if (unitMap.has(id)) fail(`${id} must remain planning-only and absent before later mutation planning`);
  const lane = packet.planning_only_candidate_lanes.find((item) => item.candidate_id === id);
  if (!lane) fail(`packet missing planning-only lane ${id}`);
  if (!String(lane.status).includes('planning_only_absent_id')) fail(`${id} lane must be marked planning-only absent`);
}

const exercises = targetData.exercises || targetData;
const e311 = targetById(exercises, '3.1.1');
const e312 = targetById(exercises, '3.1.2');
const e313 = targetById(exercises, '3.1.3');
const e416 = targetById(exercises, '4.1.6');
if (!hasSkill(e311, 'D07')) fail('3.1.1 must still show current D07 over-trigger evidence');
if (!hasSkill(e312, 'D07')) fail('3.1.2 must still show current D07 evidence');
if (hasSkill(e313, 'D07')) fail('3.1.3 must not already use D07');
if (hasSkill(e416, 'D07')) fail('4.1.6 must not already use D07');

const e311Evidence = packet.target_exercise_evidence.find((item) => item.record_id === '3.1.1');
if (!e311Evidence || e311Evidence.asks_afwentelingspercentage !== false || e311Evidence.asks_tax_wedge_graph !== true) {
  fail('packet must record 3.1.1 over-trigger evidence');
}
const e312Evidence = packet.target_exercise_evidence.find((item) => item.record_id === '3.1.2');
if (!e312Evidence || e312Evidence.asks_afwentelingspercentage !== true || e312Evidence.asks_tax_burden_amounts !== true) {
  fail('packet must record 3.1.2 tax burden and percentage evidence');
}

requireIncludes(packetMd, 'No protected reference mutation', 'packet markdown');
requireIncludes(reviewMd, 'Stop if the packet/evidence has not been pushed before review.', 'review markdown');
requireIncludes(reviewMd, 'A93', 'review markdown');
requireIncludes(reviewMd, 'D07', 'review markdown');
requireIncludes(reviewMd, 'D41', 'review markdown');
requireIncludes(bundle, 'review-packet.md', 'bundle urls');
requireIncludes(bundle, 'review-packet.json', 'bundle urls');
requireIncludes(h2jResult, 'MTU-H3', 'H2J result');
requireIncludes(roadmap, 'GATE-MTU-H3');
requireIncludes(roadmap, 'MTU-H3 | Incidence Pass-Through Skill Family Review | yes');
if (!/v3\.0[3456]-(?:mtu-h3-review-packet|gate-mtu-h3-pass-with-conditions|mtu-h3a-cli-mutation-plan|gate-mtu-h3a-pass-with-conditions)/.test(roadmap)) {
  fail('roadmap must be in MTU-H3 review or post-GATE-MTU-H3 closure lifecycle state');
}

if (fs.existsSync(GATE_CLOSURE_JSON)) {
  const closure = readJson(GATE_CLOSURE_JSON);
  const interview = readJson(HUMAN_INTERVIEW_JSON);
  if (closure.status !== 'pass_with_conditions') fail('H3 closure status must be pass_with_conditions');
  if (closure.authorized_next.sprint_id !== 'MTU-H3A') fail('H3 closure must authorize MTU-H3A next');
  if (closure.authorized_next.execution_authorized !== false) fail('H3 closure must not authorize execution');
  if (closure.reviewed_remote_commit !== '316c299db215898760e3c6da430b70b055b0b5e2') {
    fail('H3 closure must record reviewed remote commit');
  }
  if (interview.verdict !== 'pass_with_conditions_for_routing_only_no_mutation') {
    fail('H3 human interview verdict mismatch');
  }
  for (const lane of ['D07', 'D41', 'D42', 'D43', 'D44', 'D45', 'D46']) {
    if (!JSON.stringify(closure.accepted_routing).includes(lane)) fail(`H3 closure must mention ${lane}`);
  }
  if (closure.authority_boundary.d07_mutation_authorized !== false) fail('H3 closure must not authorize D07 mutation');
  if (closure.authority_boundary.unit_minting_authorized !== false) fail('H3 closure must not authorize unit minting');
  if (closure.authority_boundary.target_exercise_mutation_authorized !== false) {
    fail('H3 closure must not authorize target-exercise mutation');
  }
  requireIncludes(roadmap, 'MTU-H3A | Incidence Pass-Through CLI-Mutation Planning Packet | yes');
}

console.log('OK MTU-H3 incidence/pass-through review packet');
