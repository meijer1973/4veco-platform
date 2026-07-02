#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen');

function fail(message) {
  console.error(`STANDARD-EXERCISES-1 coverage check failed: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function requireText(content, pattern, label, file) {
  if (!pattern.test(content)) fail(`${file} missing ${label}`);
}

function rejectText(content, pattern, label, file) {
  if (pattern.test(content)) fail(`${file} contains forbidden ${label}`);
}

function toPosix(file) {
  return file.replace(/\\/g, '/');
}

function resolveRepoPath(file) {
  return path.resolve(ROOT, file);
}

function pathExists(file) {
  const resolved = file.startsWith('../4veco-lessen/')
    ? path.resolve(ROOT, file)
    : resolveRepoPath(file);
  return fs.existsSync(resolved);
}

function gitStatus(repoCwd, args, label) {
  const result = spawnSync('git', ['status', '--porcelain', '--', ...args], {
    cwd: repoCwd,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    fail(`git status failed for ${label}`);
  }
  const changed = result.stdout.trim();
  if (changed) fail(`${label} has changes:\n${changed}`);
}

function requireArrayOfIds(values, required, label) {
  if (!Array.isArray(values)) fail(`${label} must be an array`);
  const set = new Set(values);
  for (const id of required) {
    if (!set.has(id)) fail(`${label} missing ${id}`);
  }
}

const coveragePath = path.join(ROOT, 'reports', 'json', 'standard-exercise-family-coverage.json');
const auditPath = path.join(ROOT, 'reports', 'sprints', 'STANDARD-EXERCISES-1-exercise-family-audit.md');
const planPath = path.join(ROOT, 'reports', 'sprints', 'STANDARD-EXERCISES-1-plan.md');
const resultPath = path.join(ROOT, 'reports', 'sprints', 'STANDARD-EXERCISES-1-result.md');
const resultJsonPath = path.join(ROOT, 'references', 'data', 'sprints', 'STANDARD-EXERCISES-1.result.json');
const taskShellEnginePath = path.join(ROOT, 'engines', 'task-shell-engine.js');
const reasoningEnginePath = path.join(ROOT, 'engines', 'reasoning-engine.js');
const graph113Path = path.join(ROOT, 'build-scripts', 'content', 'book-1', 'b1-113-graphical-data.js');
const exit112Path = path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.2-exit-ticket.json');
const procedureDataPath = path.join(ROOT, 'build-scripts', 'content', 'book-1', 'b1-111-procedure-data.js');
const guidedBuilderPath = path.join(ROOT, 'build-scripts', 'content', 'book-1', 'b1-111-inoefening.js');
const platformRoadmapPath = path.join(ROOT, 'references', 'reference-team-roadmap.md');
const lessonRoadmapPath = path.join(LESSON_ROOT, 'lessen-team-roadmap.md');

const coverage = readJson(coveragePath);
const audit = read(auditPath);
const plan = read(planPath);
const taskShellEngine = read(taskShellEnginePath);
const reasoningEngine = read(reasoningEnginePath);
const graph113 = read(graph113Path);
const exit112 = read(exit112Path);
const procedureData = read(procedureDataPath);
const guidedBuilder = read(guidedBuilderPath);

if (coverage.schema_version !== 1) fail('coverage schema_version must be 1');
if (coverage.sprint_id !== 'STANDARD-EXERCISES-1') fail('coverage sprint_id mismatch');
if (coverage.status !== 'audit_complete_no_implementation') fail('coverage status must be audit_complete_no_implementation');

const requiredRuntimeFamilies = [
  'choice',
  'numeric_input',
  'calculation_work_capture',
  'final_answer_entry',
  'unit_notation_field',
  'short_constructed_response',
  'structured_short_response',
  'table_value_selection',
  'graph_reading',
  'point_placement',
  'graph_construction_substitute',
  'structured_reasoning',
];
requireArrayOfIds(coverage.shared_task_shell_runtime_families, requiredRuntimeFamilies, 'shared_task_shell_runtime_families');
requireArrayOfIds(
  coverage.game_arch_2_documented_families,
  requiredRuntimeFamilies.filter((id) => id !== 'structured_short_response'),
  'game_arch_2_documented_families'
);
if (coverage.game_arch_2_documented_families.includes('structured_short_response')) {
  fail('structured_short_response should remain recorded as runtime-covered but missing from GAME-ARCH-2 documented families');
}

for (const family of requiredRuntimeFamilies) {
  requireText(taskShellEngine, new RegExp(`${family}:\\s*\\{`), `runtime family ${family}`, taskShellEnginePath);
}

const requiredSurfaces = [
  'reasoning_game',
  'math_skilltree',
  'graph_table_game',
  'exit_ticket_checkpoint',
  'guided_practice',
  'procedure_support',
];
if (!Array.isArray(coverage.surfaces)) fail('surfaces must be an array');
const surfaces = new Map(coverage.surfaces.map((row) => [row.surface, row]));
for (const surface of requiredSurfaces) {
  if (!surfaces.has(surface)) fail(`missing surface row ${surface}`);
  const row = surfaces.get(surface);
  for (const key of ['current_state', 'summary', 'coverage_decision', 'follow_up_owner']) {
    if (typeof row[key] !== 'string' || !row[key].trim()) fail(`surface ${surface} missing ${key}`);
  }
}
if (!/requires_standard_expansion/.test(surfaces.get('reasoning_game').coverage_decision)) {
  fail('reasoning_game must require standard expansion');
}

const requiredReasoningDecisions = [
  'structured_reasoning',
  'step_ordering',
  'cause_effect_chain',
  'claim_reason_evidence',
  'flow_diagram_build',
  'classification_with_explanation',
  'short_constructed_response',
  'source_based_explanation',
];
if (!Array.isArray(coverage.reasoning_required_decisions)) fail('reasoning_required_decisions must be an array');
const reasoningDecisions = new Map(coverage.reasoning_required_decisions.map((row) => [row.candidate, row]));
for (const candidate of requiredReasoningDecisions) {
  if (!reasoningDecisions.has(candidate)) fail(`missing reasoning decision ${candidate}`);
  const row = reasoningDecisions.get(candidate);
  if (typeof row.decision !== 'string' || !row.decision.trim()) fail(`${candidate} missing decision`);
  if (row.follow_up_owner !== 'REASON-STD-1') fail(`${candidate} follow_up_owner must be REASON-STD-1`);
}
for (const candidate of ['step_ordering', 'cause_effect_chain', 'claim_reason_evidence', 'flow_diagram_build', 'classification_with_explanation', 'source_based_explanation']) {
  if (reasoningDecisions.get(candidate).decision !== 'requires_standard_expansion') {
    fail(`${candidate} must require standard expansion`);
  }
}
if (reasoningDecisions.get('structured_reasoning').decision !== 'covered_existing_but_self_check_only') {
  fail('structured_reasoning must be recorded as covered existing but self-check only');
}

const requiredFamilyRows = [
  ...requiredRuntimeFamilies,
  'step_ordering',
  'claim_reason_evidence',
  'cause_effect_chain',
  'flow_diagram_build',
  'classification_with_explanation',
  'source_based_explanation',
  'error_detection',
  'guided_open_scaffolded_response',
  'procedure_given_choose_flow',
];
if (!Array.isArray(coverage.family_rows)) fail('family_rows must be an array');
const familyRows = new Map(coverage.family_rows.map((row) => [row.id, row]));
for (const id of requiredFamilyRows) {
  if (!familyRows.has(id)) fail(`missing family row ${id}`);
  const row = familyRows.get(id);
  for (const key of [
    'surface',
    'current_type',
    'student_action',
    'response_shape',
    'feedback_model',
    'feedback_owner',
    'shared_shell_coverage',
    'proposed_standard_family',
    'disposition',
    'dual_coding_policy',
    'follow_up_owner',
  ]) {
    if (typeof row[key] !== 'string' || !row[key].trim()) fail(`family row ${id} missing ${key}`);
  }
  if (!Array.isArray(row.evidence_paths) || row.evidence_paths.length === 0) fail(`family row ${id} missing evidence_paths`);
}

for (const id of ['step_ordering', 'claim_reason_evidence', 'cause_effect_chain', 'flow_diagram_build', 'classification_with_explanation', 'source_based_explanation']) {
  if (familyRows.get(id).shared_shell_coverage !== 'requires_standard_expansion') {
    fail(`${id} family row must require standard expansion`);
  }
  if (familyRows.get(id).follow_up_owner !== 'REASON-STD-1') {
    fail(`${id} family row follow_up_owner must be REASON-STD-1`);
  }
}
if (familyRows.get('structured_short_response').shared_shell_coverage !== 'runtime_covered_but_standard_documentation_gap') {
  fail('structured_short_response must carry runtime/documentation gap');
}
if (!/visual_construction_required/.test(familyRows.get('flow_diagram_build').dual_coding_policy)) {
  fail('flow_diagram_build must require visual construction');
}

for (const evidencePath of coverage.source_evidence) {
  if (!pathExists(evidencePath)) fail(`source evidence path does not exist: ${evidencePath}`);
}

requireText(reasoningEngine, /Stappen ordenen[\s\S]*Deelvragen opbouwen[\s\S]*Vind de fout[\s\S]*Stroomdiagram bouwen[\s\S]*Structuren matchen[\s\S]*Redeneerantwoord opbouwen/, 'six reasoning modes', reasoningEnginePath);
requireText(reasoningEngine, /family:\s*'structured_reasoning'/, 'structured_reasoning task-shell family', reasoningEnginePath);
requireText(graph113, /family:\s*'table_value_selection'/, '1.1.3 table task shell family', graph113Path);
requireText(graph113, /family:\s*'graph_reading'/, '1.1.3 graph reading task shell family', graph113Path);
requireText(graph113, /family:\s*'point_placement'/, '1.1.3 point placement task shell family', graph113Path);
requireText(graph113, /family:\s*'graph_construction_substitute'/, '1.1.3 graph construction substitute task shell family', graph113Path);
requireText(graph113, /family:\s*'calculation_work_capture'/, '1.1.3 calculation work task shell family', graph113Path);
requireText(exit112, /"family":\s*"calculation_work_capture"/, '1.1.2 calculation work exit-ticket family', exit112Path);
requireText(exit112, /"family":\s*"structured_short_response"/, '1.1.2 structured short response exit-ticket family', exit112Path);
requireText(procedureData, /type:\s*'given'[\s\S]*type:\s*'choose'/, 'procedure given/choose flow', procedureDataPath);
requireText(guidedBuilder, /thinkingSteps|hint|answerLines|formulaReminder|scaffoldImage/, 'guided-practice scaffold signals', guidedBuilderPath);

requireText(audit, /PASS WITH FLAGS/i, 'audit verdict', auditPath);
requireText(audit, /step_ordering/i, 'step_ordering decision', auditPath);
requireText(audit, /flow_diagram_build/i, 'flow_diagram_build decision', auditPath);
requireText(audit, /source_based_explanation/i, 'source_based_explanation decision', auditPath);
requireText(audit, /structured_short_response/i, 'structured_short_response documentation flag', auditPath);
requireText(audit, /TASK-SHELL-UX-2/i, 'TASK-SHELL-UX-2 handoff', auditPath);
requireText(audit, /REASON-STD-1/i, 'REASON-STD-1 handoff', auditPath);
requireText(audit, /ENGINE-UNIFY-1/i, 'ENGINE-UNIFY-1 handoff', auditPath);
requireText(audit, /Scale Gate 1 remains blocked/i, 'Scale Gate 1 boundary', auditPath);
rejectText(audit, /authorizes implementation|authorizes generated lesson output|authorizes product-wide use/i, 'implementation/product authority', auditPath);
requireText(plan, /No generated lesson output/i, 'no generated-output boundary in plan', planPath);

if (!Array.isArray(coverage.follow_ups) || coverage.follow_ups.length < 3) fail('coverage must list at least three follow-ups');
for (const id of ['SE1-F1', 'SE1-F2', 'SE1-F3']) {
  if (!coverage.follow_ups.some((row) => row.id === id)) fail(`missing follow-up ${id}`);
}

if (!coverage.product_boundaries || coverage.product_boundaries.implementation_authorized !== false) {
  fail('product_boundaries must block implementation_authorized');
}
for (const [key, value] of Object.entries(coverage.product_boundaries)) {
  if (value !== false) fail(`product_boundaries.${key} must be false`);
}

gitStatus(
  ROOT,
  [
    'engines',
    'source-data',
    'build-scripts/content',
    'references/machine',
    'references/external',
    'references/authored/course-target-exercises.json',
  ],
  'forbidden platform implementation/source/protected surfaces'
);
gitStatus(
  LESSON_ROOT,
  [
    'Boek 1 - Grondslagen, vraag en aanbod',
    'shared',
  ],
  'forbidden lesson generated-output surfaces'
);

if (fs.existsSync(resultJsonPath)) {
  const resultJson = readJson(resultJsonPath);
  if (resultJson.status !== 'completed') fail('result JSON exists but status is not completed');
  const platformRoadmap = read(platformRoadmapPath);
  const lessonRoadmap = read(lessonRoadmapPath);
  requireText(platformRoadmap, /\|\s*STANDARD-EXERCISES-1\s*\|[^\n]*\|\s*yes\s*\|[^\n]*CLOSED AUDIT\/CONTRACT/i, 'closed platform roadmap row', platformRoadmapPath);
  requireText(lessonRoadmap, /\|\s*STANDARD-EXERCISES-1\s*\|[^\n]*\|\s*\*\*2026-06-01\*\*\s*\|[^\n]*CLOSED AUDIT\/CONTRACT/i, 'closed lesson roadmap row', lessonRoadmapPath);
  requireText(platformRoadmap, /\|\s*TASK-SHELL-UX-2\s*\|[^\n]*\|\s*yes\s*\|/i, 'closed TASK-SHELL-UX-2 successor row', platformRoadmapPath);
  requireText(
    platformRoadmap,
    /\|\s*EXERCISE-WORKFLOW-CHECKER-CLEANUP-1\s*\|[^\n]*validation\/evidence hygiene only/i,
    'checker-cleanup roadmap row',
    platformRoadmapPath
  );
  requireText(lessonRoadmap, /TASK-SHELL-UX-2[\s\S]*GAME-ROUTE-AFFORDANCE-1/i, 'lesson product proof sequence after STANDARD', lessonRoadmapPath);
}

console.log('OK STANDARD-EXERCISES-1 coverage audit');
