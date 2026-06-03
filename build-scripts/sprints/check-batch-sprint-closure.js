#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function fail(message) {
  console.error(`Batch sprint closure check failed: ${message}`);
  process.exit(1);
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (!args[index + 1]) fail(`missing value for ${name}`);
  return args[index + 1];
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function gitLines(args) {
  const result = spawnSync('git', args, { cwd: process.cwd(), encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || '');
    fail(`git ${args.join(' ')} failed`);
  }
  return (result.stdout || '').split(/\r?\n/).filter(Boolean);
}

function changedFilesFromGit() {
  const tracked = gitLines(['diff', '--name-only', 'HEAD', '--']);
  const untracked = gitLines(['ls-files', '--others', '--exclude-standard']);
  return [...new Set([...tracked, ...untracked])];
}

function changedFilesFromFile(file) {
  return fs.readFileSync(file, 'utf8').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function sprintIdFromResultPath(file) {
  const match = file.replace(/\\/g, '/').match(/^references\/data\/sprints\/(.+)\.result\.json$/);
  return match ? match[1] : null;
}

function validateWaiver(file) {
  if (!fs.existsSync(file)) fail(`missing batch closure waiver: ${file}`);
  const text = fs.readFileSync(file, 'utf8');
  if (!/human|approved|authorized|authorised/i.test(text)) {
    fail(`${file} must include human authorization language`);
  }
  if (!/\d{4}-\d{2}-\d{2}/.test(text)) fail(`${file} must include an authorization date`);
}

const args = process.argv.slice(2);
const root = optionValue(args, '--root') || '.';
const changedFilesPath = optionValue(args, '--changed-files');
const waiverPath = optionValue(args, '--waiver') || path.join(root, 'BATCH-CLOSURE-WAIVER.md');
const changedFiles = changedFilesPath ? changedFilesFromFile(changedFilesPath) : changedFilesFromGit();

const completedSprintIds = [];
for (const file of changedFiles) {
  const id = sprintIdFromResultPath(file);
  if (!id) continue;
  const resultPath = path.join(root, file);
  if (!fs.existsSync(resultPath)) continue;
  const json = readJson(resultPath);
  if (json.status === 'completed') completedSprintIds.push(id);
}

const uniqueCompleted = [...new Set(completedSprintIds)];
if (uniqueCompleted.length > 1) {
  validateWaiver(waiverPath);
}

if (uniqueCompleted.some((id) => /^GATE-/.test(id)) && uniqueCompleted.length > 1) {
  fail(`human gate cannot be batch-closed with other sprints: ${uniqueCompleted.join(', ')}`);
}

console.log(
  `OK batch sprint closure: ${uniqueCompleted.length} completed sprint result${uniqueCompleted.length === 1 ? '' : 's'} in current closure set`
);
