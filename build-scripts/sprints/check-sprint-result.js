#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REQUIRED_HEADINGS = [
  '## Plan reference',
  '## Summary',
  '## Acceptance test results',
  '## Changed files',
  '## Data integrity notes',
  '## Open follow-ups',
  '## Rollback instructions',
];

function fail(message) {
  console.error(`Sprint result check failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function dateOnOrAfter(value, cutoff) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) && value.slice(0, 10) >= cutoff;
}

function readCommandLog(sprintId) {
  const file = path.join('reports', 'sprints', `${sprintId}-command-log.jsonl`);
  if (!fs.existsSync(file)) fail(`missing command log: ${file}`);
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        fail(`${file}:${index + 1} invalid JSON: ${error.message}`);
      }
    });
}

function requireLoggedAcceptanceCommands(sprintId, resultJson) {
  const entries = readCommandLog(sprintId);
  for (const [index, test] of resultJson.acceptance_tests.entries()) {
    if (!test || test.status !== 'passed') continue;
    if (typeof test.command !== 'string' || !test.command.trim()) {
      fail(`result JSON acceptance_tests[${index}].command must be a non-empty string`);
    }
    if (canSkipCurrentlyRunningCommand(test.command)) continue;
    const matched = entries.some((entry) => entry.command === test.command && entry.exit_code === 0);
    if (!matched) fail(`passed command lacks command-log exit_code 0 evidence: ${test.command}`);
  }
}

function quoteArg(arg) {
  if (/^[A-Za-z0-9_./:+=@%-]+$/.test(arg)) return arg;
  return JSON.stringify(arg);
}

function currentInvocationCommand() {
  const script = path.relative(process.cwd(), process.argv[1]).replace(/\\/g, '/');
  return ['node', script, ...process.argv.slice(2)].map(quoteArg).join(' ');
}

function canSkipCurrentlyRunningCommand(command) {
  return process.env.SPRINT_COMMAND_UNDER_RUN === command && currentInvocationCommand() === command;
}

const file = process.argv[2];
if (!file) fail('missing result path');
if (!fs.existsSync(file)) fail(`file not found: ${file}`);

const markdown = fs.readFileSync(file, 'utf8');
const titleMatch = markdown.match(/^# Sprint\s+(\S+):\s+Result/m);
if (!titleMatch) {
  fail('missing title in form "# Sprint <id>: Result"');
}
const sprintId = titleMatch[1];

for (const heading of REQUIRED_HEADINGS) {
  if (!markdown.includes(heading)) fail(`missing required heading: ${heading}`);
}

const planMatch = markdown.match(/## Plan reference\s+([\s\S]*?)(?=\n## |$)/);
if (!planMatch) fail('missing plan reference section');
const planPathMatch = planMatch[1].match(/`([^`]+-plan\.md)`/);
if (!planPathMatch) fail('plan reference must include a backticked *-plan.md path');
const planPath = planPathMatch[1];
if (!fs.existsSync(planPath)) fail(`referenced plan does not exist: ${planPath}`);

const dataNotes = markdown.match(/## Data integrity notes\s+([\s\S]*?)(?=\n## |$)/);
if (!dataNotes || !/protected reference data|No protected reference data|references\/machine|references\/external/i.test(dataNotes[1])) {
  fail('data integrity notes must mention protected reference data status');
}

const planJsonPath = path.join('references', 'data', 'sprints', `${sprintId}.plan.json`);
const resultJsonPath = path.join('references', 'data', 'sprints', `${sprintId}.result.json`);
if (fs.existsSync(planJsonPath) && fs.existsSync(resultJsonPath)) {
  const planJson = readJson(planJsonPath);
  const resultJson = readJson(resultJsonPath);
  if (
    resultJson.status === 'completed' &&
    Array.isArray(resultJson.acceptance_tests) &&
    dateOnOrAfter(planJson.created, '2026-06-03')
  ) {
    requireLoggedAcceptanceCommands(sprintId, resultJson);
  }
}

console.log(`OK sprint result: ${path.normalize(file)}`);
