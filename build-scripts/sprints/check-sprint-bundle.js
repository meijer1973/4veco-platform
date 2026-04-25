#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function fail(message) {
  console.error(`Sprint bundle check failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function readMarkdown(file) {
  return fs.readFileSync(file, 'utf8');
}

function exists(file, label) {
  if (!fs.existsSync(file)) fail(`missing ${label}: ${file}`);
}

function runNode(script, target) {
  const result = spawnSync(process.execPath, [script, target], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    fail(`validator failed: node ${script} ${target}`);
  }
}

function requireBacktickedPath(markdown, sectionHeading, expectedPath) {
  const pattern = new RegExp(`## ${sectionHeading}\\s+([\\s\\S]*?)(?=\\n## |$)`);
  const match = markdown.match(pattern);
  if (!match) fail(`missing ${sectionHeading} section`);
  if (!match[1].includes(`\`${expectedPath}\``)) {
    fail(`${sectionHeading} must reference \`${expectedPath}\``);
  }
}

const args = process.argv.slice(2);
const sprintId = args.find((arg) => !arg.startsWith('--'));
const requireComplete = args.includes('--complete');

if (!sprintId) fail('missing sprint id, for example R2.3');
if (!/^[A-Z]\d+(?:\.\d+)?$/.test(sprintId) && sprintId !== 'EXAMPLE') {
  fail(`unexpected sprint id format: ${sprintId}`);
}

const planPath = path.join('docs', 'sprints', `${sprintId}-plan.md`);
const planJsonPath = path.join('references', 'data', 'sprints', `${sprintId}.plan.json`);
const baselinePath = path.join('reports', 'sprints', `${sprintId}-baseline.md`);
const resultPath = path.join('reports', 'sprints', `${sprintId}-result.md`);
const diffPath = path.join('reports', 'sprints', `${sprintId}-diff-summary.md`);
const resultJsonPath = path.join('references', 'data', 'sprints', `${sprintId}.result.json`);

exists(planPath, 'sprint plan');
exists(planJsonPath, 'sprint plan JSON');
exists(baselinePath, 'sprint baseline');

runNode(path.join('build-scripts', 'sprints', 'check-sprint-plan.js'), planPath);

const planJson = readJson(planJsonPath);
if (planJson.sprint_id !== sprintId) fail(`${planJsonPath} has wrong sprint_id`);
if (planJson.plan !== planPath.replace(/\\/g, '/')) fail(`${planJsonPath} must point to ${planPath}`);
if (!Array.isArray(planJson.acceptance_tests) || planJson.acceptance_tests.length === 0) {
  fail(`${planJsonPath} must include acceptance_tests`);
}
if (typeof planJson.protected_reference_data_changes_allowed !== 'boolean') {
  fail(`${planJsonPath} must declare protected_reference_data_changes_allowed`);
}
if (/human-interview\.md|gate-closure\.json/i.test(readMarkdown(planPath))) {
  if (planJson.human_review_required !== true) fail(`${planJsonPath} must declare human_review_required: true`);
  if (!planJson.gate_id) fail(`${planJsonPath} must declare gate_id`);
  if (!planJson.review_packet) fail(`${planJsonPath} must declare review_packet`);
  if (!Array.isArray(planJson.valid_gate_statuses) || planJson.valid_gate_statuses.length === 0) {
    fail(`${planJsonPath} must declare valid_gate_statuses`);
  }
}

const baseline = readMarkdown(baselinePath);
if (!new RegExp(`# Sprint ${sprintId}: Baseline`).test(baseline)) {
  fail(`${baselinePath} must start with "# Sprint ${sprintId}: Baseline"`);
}
requireBacktickedPath(baseline, 'Plan reference', planPath.replace(/\\/g, '/'));
if (!/## Data integrity notes/.test(baseline)) fail(`${baselinePath} must include Data integrity notes`);
if (!/references\/machine\/|references\/external\/|protected reference data/i.test(baseline)) {
  fail(`${baselinePath} must mention protected reference data status`);
}

if (requireComplete) {
  exists(resultPath, 'sprint result');
  exists(diffPath, 'sprint diff summary');
  exists(resultJsonPath, 'sprint result JSON');

  runNode(path.join('build-scripts', 'sprints', 'check-sprint-result.js'), resultPath);

  const resultJson = readJson(resultJsonPath);
  if (resultJson.sprint_id !== sprintId) fail(`${resultJsonPath} has wrong sprint_id`);
  if (resultJson.status !== 'completed') fail(`${resultJsonPath} must have status "completed"`);
  if (resultJson.plan !== planPath.replace(/\\/g, '/')) fail(`${resultJsonPath} must point to ${planPath}`);
  if (resultJson.baseline !== baselinePath.replace(/\\/g, '/')) fail(`${resultJsonPath} must point to ${baselinePath}`);
  if (resultJson.result !== resultPath.replace(/\\/g, '/')) fail(`${resultJsonPath} must point to ${resultPath}`);
  if (resultJson.diff_summary !== diffPath.replace(/\\/g, '/')) fail(`${resultJsonPath} must point to ${diffPath}`);
  if (!Array.isArray(resultJson.acceptance_tests) || resultJson.acceptance_tests.length === 0) {
    fail(`${resultJsonPath} must include acceptance_tests`);
  }
  for (const [index, test] of resultJson.acceptance_tests.entries()) {
    if (!test || typeof test.command !== 'string' || typeof test.status !== 'string') {
      fail(`${resultJsonPath} acceptance_tests[${index}] must include command and status`);
    }
    if (!/^(passed|failed|skipped_with_reason)$/.test(test.status)) {
      fail(`${resultJsonPath} acceptance_tests[${index}] has unsupported status: ${test.status}`);
    }
  }
  if (typeof resultJson.protected_reference_data_changed !== 'boolean') {
    fail(`${resultJsonPath} must declare protected_reference_data_changed`);
  }

  const diff = readMarkdown(diffPath);
  if (!new RegExp(`# Sprint ${sprintId}: Diff Summary`).test(diff)) {
    fail(`${diffPath} must start with "# Sprint ${sprintId}: Diff Summary"`);
  }
  if (!/references\/machine\/|references\/external\/|Protected surfaces/i.test(diff)) {
    fail(`${diffPath} must mention protected surfaces`);
  }
}

const roadmapPath = path.join('references', 'reference-team-roadmap.md');
if (fs.existsSync(roadmapPath)) {
  const roadmap = readMarkdown(roadmapPath);
  const rowPattern = new RegExp(`\\| ${sprintId.replace('.', '\\.')} \\|[^\\n]+\\| (yes|no) \\|`);
  const row = roadmap.match(rowPattern);
  if (!row) fail(`${roadmapPath} must include ${sprintId} in the sprint ledger`);
  if (requireComplete && row[1] !== 'yes') {
    fail(`${roadmapPath} must mark ${sprintId} completed when --complete is used`);
  }
}

console.log(`OK sprint bundle: ${sprintId}${requireComplete ? ' complete' : ' planned/active'}`);
