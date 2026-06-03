#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function fail(message) {
  console.error(`Sprint command-log check failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (!args[index + 1]) fail(`missing value for ${name}`);
  return args[index + 1];
}

function readEntries(jsonlPath, sprintId) {
  if (!fs.existsSync(jsonlPath)) fail(`missing command log: ${jsonlPath}`);
  const lines = fs.readFileSync(jsonlPath, 'utf8').split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) fail(`${jsonlPath} has no command entries`);
  return lines.map((line, index) => {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch (error) {
      fail(`${jsonlPath}:${index + 1} invalid JSON: ${error.message}`);
    }
    validateEntry(entry, sprintId, `${jsonlPath}:${index + 1}`);
    return entry;
  });
}

function validateEntry(entry, sprintId, label) {
  if (entry.schema_version !== 1) fail(`${label} schema_version must be 1`);
  if (entry.sprint_id !== sprintId) fail(`${label} sprint_id must be ${sprintId}`);
  for (const key of ['command', 'cwd', 'started_at', 'finished_at', 'stdout_sha256', 'stderr_sha256']) {
    if (typeof entry[key] !== 'string' || !entry[key].trim()) {
      fail(`${label} ${key} must be a non-empty string`);
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}T/.test(entry.started_at)) fail(`${label} started_at must be an ISO timestamp`);
  if (!/^\d{4}-\d{2}-\d{2}T/.test(entry.finished_at)) fail(`${label} finished_at must be an ISO timestamp`);
  if (typeof entry.duration_ms !== 'number' || entry.duration_ms < 0) {
    fail(`${label} duration_ms must be a non-negative number`);
  }
  if (typeof entry.exit_code !== 'number') fail(`${label} exit_code must be a number`);
  if (!/^[a-f0-9]{64}$/.test(entry.stdout_sha256)) fail(`${label} stdout_sha256 must be sha256 hex`);
  if (!/^[a-f0-9]{64}$/.test(entry.stderr_sha256)) fail(`${label} stderr_sha256 must be sha256 hex`);
  if (typeof entry.stdout_excerpt !== 'string') fail(`${label} stdout_excerpt must be a string`);
  if (typeof entry.stderr_excerpt !== 'string') fail(`${label} stderr_excerpt must be a string`);
}

function hasSuccessfulCommand(entries, command) {
  return entries.some((entry) => entry.command === command && entry.exit_code === 0);
}

function validateResultCommands(entries, resultJsonPath) {
  const resultJson = readJson(resultJsonPath);
  if (!Array.isArray(resultJson.acceptance_tests)) {
    fail(`${resultJsonPath} must include acceptance_tests`);
  }
  for (const [index, test] of resultJson.acceptance_tests.entries()) {
    if (!test || test.status !== 'passed') continue;
    if (typeof test.command !== 'string' || !test.command.trim()) {
      fail(`${resultJsonPath} acceptance_tests[${index}].command must be a non-empty string`);
    }
    if (canSkipCurrentlyRunningCommand(test.command)) continue;
    if (!hasSuccessfulCommand(entries, test.command)) {
      fail(`${resultJsonPath} passed command lacks command-log exit_code 0 evidence: ${test.command}`);
    }
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

const args = process.argv.slice(2);
const sprintId = args.find((arg) => !arg.startsWith('--'));
if (!sprintId) fail('missing sprint id');

const jsonlPath =
  optionValue(args, '--jsonl') || path.join('reports', 'sprints', `${sprintId}-command-log.jsonl`);
const markdownPath =
  optionValue(args, '--markdown') || path.join('reports', 'sprints', `${sprintId}-command-log.md`);
const resultJsonPath =
  optionValue(args, '--result-json') || path.join('references', 'data', 'sprints', `${sprintId}.result.json`);
const requireResultTests = args.includes('--require-result-tests') || fs.existsSync(resultJsonPath);

const entries = readEntries(jsonlPath, sprintId);
if (!fs.existsSync(markdownPath)) fail(`missing markdown command log: ${markdownPath}`);
const markdown = fs.readFileSync(markdownPath, 'utf8');
if (!markdown.includes(`# Sprint ${sprintId}: Command Log`)) {
  fail(`${markdownPath} must start with sprint command-log title`);
}
for (const entry of entries) {
  if (!markdown.includes(entry.command)) {
    fail(`${markdownPath} must include command: ${entry.command}`);
  }
}

if (requireResultTests) {
  if (!fs.existsSync(resultJsonPath)) fail(`missing result JSON: ${resultJsonPath}`);
  validateResultCommands(entries, resultJsonPath);
}

console.log(`OK sprint command log: ${sprintId} (${entries.length} entries)`);
