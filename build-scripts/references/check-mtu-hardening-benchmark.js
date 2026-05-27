#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BENCHMARK_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'benchmark-sample-v1.json');
const MAP_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-operation-map.md');
const TAXONOMY_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'failure-taxonomy-v1.md');

function fail(message) {
  console.error(`MTU hardening benchmark check failed: ${message}`);
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

function readMarkdown(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${path.relative(ROOT, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function requireFalse(object, key, context) {
  if (!object || object[key] !== false) {
    fail(`${context}.${key} must be false`);
  }
}

function requireArray(object, key, context, minItems = 1) {
  if (!Array.isArray(object[key]) || object[key].length < minItems) {
    fail(`${context}.${key} must be an array with at least ${minItems} item(s)`);
  }
  return object[key];
}

function requireIncludes(items, expected, context) {
  for (const value of expected) {
    if (!items.includes(value)) fail(`${context} must include ${value}`);
  }
}

function flattenIds(records, key) {
  return records.flatMap((record) =>
    Array.isArray(record[key])
      ? record[key].map((item) => item.candidate_id || item.flag_id || item.issue_id || item.slot_id)
      : []
  );
}

const benchmark = readJson(BENCHMARK_PATH);
const operationMap = readMarkdown(MAP_PATH);
const taxonomy = readMarkdown(TAXONOMY_PATH);

if (benchmark.schema_version !== 1) fail('schema_version must be 1');
if (benchmark.sprint_id !== 'MTU-H1') fail('sprint_id must be MTU-H1');
if (benchmark.status !== 'seed_benchmark_non_mutating') {
  fail('status must be seed_benchmark_non_mutating');
}

requireFalse(benchmark.source_basis, 'official_source_refresh_performed', 'source_basis');
requireFalse(benchmark.source_basis, 'external_source_mutated', 'source_basis');

const authority = benchmark.authority_boundary || {};
for (const key of [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'unit_minting_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_mutation_authorized',
  'candidate_storage_creation_authorized',
  'candidate_writes_authorized',
  'lesson_output_mutation_authorized',
  'student_product_use_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'sequencing_authorized',
  'student_facing_ai_authorized',
  'summative_use_authorized',
  'pv_projection_authorized',
  'pv_machine_promotion_authorized',
]) {
  requireFalse(authority, key, 'authority_boundary');
}

const slots = requireArray(benchmark, 'stratified_sample_slots', 'benchmark', 6);
const slotTypes = slots.map((slot) => slot.question_type);
requireIncludes(
  slotTypes,
  ['berekenen', 'leg_uit', 'analyseer', 'arceer_grafisch', 'bron', 'classificatie'],
  'stratified_sample_slots.question_type'
);

const questions = requireArray(benchmark, 'questions', 'benchmark', 3);
const questionIds = questions.map((question) => question.question_id);
requireIncludes(
  questionIds,
  ['vwo-economie-2026-solo:q1', 'vwo-economie-2026-solo:q2', 'vwo-economie-2026-solo:q3'],
  'questions.question_id'
);

for (const question of questions) {
  const context = `question ${question.question_id}`;
  if (!question.prompt_excerpt) fail(`${context} must include prompt_excerpt`);
  if (!question.answer_type) fail(`${context} must include answer_type`);
  requireArray(question, 'official_correction_model_operations', context);
  requireArray(question, 'content_mtus', context);
  requireArray(question, 'answer_form_mtus', context);
  requireArray(question, 'misconception_targets', context);
  requireArray(question, 'missing_unit_flags', context);
  requireArray(question, 'over_trigger_flags', context);
  requireFalse(question, 'mutation_authorized', context);
  requireFalse(question, 'student_product_use_authorized', context);
}

const q1 = questions.find((question) => question.question_id.endsWith(':q1'));
const q2 = questions.find((question) => question.question_id.endsWith(':q2'));
const q3 = questions.find((question) => question.question_id.endsWith(':q3'));

requireIncludes(
  flattenIds([q1], 'missing_unit_flags'),
  [
    'F_NEW_VERBAL_EXTERNAL_COST_RECOGNITION',
    'F_NEW_EXTERNAL_COST_EXAMPLE_EXPLANATION',
    'A_ANSWER_LEG_UIT_WITH_EXAMPLE',
  ],
  'q1 missing_unit_flags'
);
requireIncludes(
  flattenIds([q1], 'over_trigger_flags'),
  ['q1-F16-formal-mpc-msc-overtrigger', 'q1-welfare-loss-externality-overtrigger'],
  'q1 over_trigger_flags'
);

requireIncludes(
  flattenIds([q2], 'missing_unit_flags'),
  [
    'A_NEW_TO_POINT_CALCULATION',
    'A_NEW_TVK_CONSTANT_VARIABLE_COST',
    'A_NEW_UNKNOWN_FIXED_COST_FROM_PROFIT',
    'A_NEW_SCALE_FACTOR_UNIT_HANDLING',
    'A_ANSWER_BEREKEN_QUESTION',
  ],
  'q2 missing_unit_flags'
);
requireIncludes(
  flattenIds([q2], 'over_trigger_flags'),
  ['q2-A21-too-broad-profit-concept', 'q2-TO-function-construction-overtrigger'],
  'q2 over_trigger_flags'
);

requireIncludes(
  flattenIds([q3], 'missing_unit_flags'),
  [
    'A_NEW_MO_WITHOUT_DERIVATIVES',
    'A_NEW_MO_WITH_DERIVATIVE',
    'A_NEW_MO_EQUALS_GIVEN_MK',
    'A_NEW_NEW_MONOPOLY_PRICE_AFTER_Q',
    'A_NEW_PERCENTAGE_PRICE_CHANGE_AFTER_COST_CHANGE',
    'D07C_COST_SHOCK_PASS_THROUGH',
    'D07D_INCIDENCE_AMOUNT_NOT_FULL_PRICE_CHANGE',
  ],
  'q3 missing_unit_flags'
);
requireIncludes(
  flattenIds([q3], 'over_trigger_flags'),
  [
    'q3-A20-too-broad-mo-mk',
    'q3-A13-mk-derivation-overtrigger',
    'q3-calculus-only-mo-route-overtrigger',
    'q3-pass-through-vs-price-percentage-confusion',
  ],
  'q3 over_trigger_flags'
);

const futureRoutes = requireArray(benchmark, 'future_sprint_routing', 'benchmark', 5);
requireIncludes(
  futureRoutes.map((route) => route.sprint_id),
  ['MTU-H2', 'MTU-H3', 'MTU-H4', 'MTU-H5', 'MTU-H6'],
  'future_sprint_routing.sprint_id'
);
for (const route of futureRoutes) {
  requireFalse(route, 'mutation_authorized_by_mtu_h1', `future_sprint_routing ${route.sprint_id}`);
}

const qualityLog = requireArray(benchmark, 'quality_log', 'benchmark', 9);
requireIncludes(
  qualityLog.map((item) => item.issue),
  [
    'Verbal external-cost MTU missing',
    'A21 too broad for q2',
    'TO-function over-trigger',
    'MO=MK path too derivative-heavy',
    'MO = given MK missing',
    'Incidence/pass-through under-specified',
    'Question words not taught as answer forms',
    'Scale factors weakly represented',
    'Regression gate absent',
  ],
  'quality_log.issue'
);

for (const [label, markdown] of [
  ['solo-q1-q3-operation-map.md', operationMap],
  ['failure-taxonomy-v1.md', taxonomy],
]) {
  for (const required of [
    'No protected reference mutation authorized',
    'No machine-reference mutation authorized',
    'No student/product use authorized',
  ]) {
    if (!markdown.includes(required)) fail(`${label} must include "${required}"`);
  }
}

for (const required of [
  'q1-F16-formal-mpc-msc-overtrigger',
  'q2-TO-function-construction-overtrigger',
  'q3-A13-mk-derivation-overtrigger',
  'MTU-H5',
]) {
  if (!operationMap.includes(required) && !taxonomy.includes(required)) {
    fail(`markdown reports must include ${required}`);
  }
}

console.log('OK MTU hardening benchmark: reports/mtu-hardening/benchmark-sample-v1.json');
