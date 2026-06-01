#!/usr/bin/env node
const fs = require('fs');
const { spawnSync } = require('child_process');

function fail(message) {
  console.error(`TASK-FAMILY-CHOICE-1 check failed: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON ${file}: ${error.message}`);
  }
}

function requireText(text, pattern, label) {
  if (!pattern.test(text)) fail(`missing ${label}`);
}

function gitClean(args, label) {
  const result = spawnSync('git', args, { encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    fail(`git status failed for ${label}`);
  }
  if ((result.stdout || '').trim()) {
    fail(`${label} must be clean, found:\n${result.stdout}`);
  }
}

const contractPath = 'reports/sprints/TASK-FAMILY-CHOICE-1-contract.md';
const jsonPath = 'reports/json/task-family-choice-contract.json';
const roadmapPath = 'references/reference-team-roadmap.md';
const lessonRoadmapPath = '../4veco-lessen/lessen-team-roadmap.md';

const markdown = read(contractPath);
const data = readJson(jsonPath);
const roadmap = read(roadmapPath);
const lessonRoadmap = read(lessonRoadmapPath);

const requiredFamilies = [
  'cloze_text',
  'multi_select',
  'matching_pairs',
  'step_ordering',
  'two_tier_choice',
  'assertion_reason',
];

if (data.schema_version !== 1) fail('schema_version must be 1');
if (data.sprint_id !== 'TASK-FAMILY-CHOICE-1') fail('wrong sprint_id');
if (data.contract_type !== 'structured_choice_task_families') fail('wrong contract_type');
if (data.generated_output_allowed !== false) fail('generated_output_allowed must be false');
if (data.implementation_allowed !== false) fail('implementation_allowed must be false');
if (data.product_authority !== false) fail('product_authority must be false');
if (!Array.isArray(data.families)) fail('families must be an array');

const familyMap = new Map(data.families.map((family) => [family.id, family]));
for (const id of requiredFamilies) {
  const family = familyMap.get(id);
  if (!family) fail(`missing family ${id}`);
  requireText(markdown, new RegExp('`' + id + '`'), `markdown family ${id}`);
  for (const key of [
    'student_action',
    'response_shape',
    'expected_shape',
    'validation_owner',
    'feedback_owner',
    'focus_keyboard',
    'target_proof_limit',
    'implementation_sprint',
    'partial_feedback_allowed',
  ]) {
    if (typeof family[key] !== 'string' || !family[key].trim()) {
      fail(`${id}.${key} must be a non-empty string`);
    }
  }
  if (!Array.isArray(family.route_checkpoint_use_cases) || family.route_checkpoint_use_cases.length === 0) {
    fail(`${id}.route_checkpoint_use_cases must be a non-empty array`);
  }
}

for (const key of [
  'diagnostics',
  'adaptive_routing',
  'mastery',
  'sequencing',
  'student_facing_ai',
  'summative_use',
  'pv_projection',
  'pv_machine_promotion',
  'scale_gate_1',
  'product_wide_use',
]) {
  if (!data.boundary_flags || data.boundary_flags[key] !== false) {
    fail(`boundary_flags.${key} must be false`);
  }
}

requireText(markdown, /not quiz variety/i, 'not quiz variety boundary');
requireText(markdown, /may not replace calculation, graph\/table, source, or constructed-response/i, 'target-operation substitution guard');
requireText(markdown, /authorizes no[\s\S]*generated lesson output/i, 'no generated output authority');
requireText(markdown, /GATE-TASK-FAMILY-1/i, 'gate handoff');

requireText(roadmap, /\| TASK-FAMILY-CHOICE-1 \|/i, 'platform roadmap row');
requireText(lessonRoadmap, /\| TASK-FAMILY-CHOICE-1 \|/i, 'lesson roadmap row');

gitClean(['status', '--porcelain', '--', 'engines', 'source-data', 'references/machine', 'references/external', 'references/authored/course-target-exercises.json'], 'forbidden platform implementation/source/protected surfaces');
gitClean(['-C', '../4veco-lessen', 'status', '--porcelain', '--', 'Boek 1 - Grondslagen, vraag en aanbod', 'shared'], 'generated lesson output surfaces');

console.log('OK TASK-FAMILY-CHOICE-1 contract');
