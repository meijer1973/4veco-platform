#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

function fail(message) {
  console.error(`Sprint command runner failed: ${message}`);
  process.exit(1);
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function sha256(value) {
  return crypto.createHash('sha256').update(value || '', 'utf8').digest('hex');
}

function excerpt(value) {
  const text = String(value || '');
  const limit = 4000;
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}\n...[truncated ${text.length - limit} chars]`;
}

function quoteArg(arg) {
  if (/^[A-Za-z0-9_./:+=@%-]+$/.test(arg)) return arg;
  return JSON.stringify(arg);
}

function commandString(args) {
  return args.map(quoteArg).join(' ');
}

const sprintId = process.argv[2];
if (!sprintId) fail('missing sprint id');

const separatorIndex = process.argv.indexOf('--', 3);
if (separatorIndex === -1) fail('missing -- separator before command');

const commandArgs = process.argv.slice(separatorIndex + 1);
if (commandArgs.length === 0) fail('missing command after --');

const command = commandString(commandArgs);
const cwd = process.cwd();
const startedAt = new Date();

const result = spawnSync(commandArgs[0], commandArgs.slice(1), {
  cwd,
  encoding: 'utf8',
  shell: process.platform === 'win32',
  maxBuffer: 1024 * 1024 * 50,
  env: {
    ...process.env,
    SPRINT_COMMAND_UNDER_RUN: command,
  },
});

const finishedAt = new Date();
let stdout = result.stdout || '';
let stderr = result.stderr || '';
if (result.error) {
  stderr = `${stderr}${stderr ? '\n' : ''}${result.error.stack || result.error.message}`;
}

const exitCode = typeof result.status === 'number' ? result.status : 1;
const entry = {
  schema_version: 1,
  sprint_id: sprintId,
  command,
  cwd,
  started_at: startedAt.toISOString(),
  finished_at: finishedAt.toISOString(),
  duration_ms: finishedAt.getTime() - startedAt.getTime(),
  exit_code: exitCode,
  stdout_sha256: sha256(stdout),
  stderr_sha256: sha256(stderr),
  stdout_excerpt: excerpt(stdout),
  stderr_excerpt: excerpt(stderr),
};

const jsonlPath = path.join('reports', 'sprints', `${sprintId}-command-log.jsonl`);
const markdownPath = path.join('reports', 'sprints', `${sprintId}-command-log.md`);
ensureDir(jsonlPath);
fs.appendFileSync(jsonlPath, `${JSON.stringify(entry)}\n`);

if (!fs.existsSync(markdownPath)) {
  fs.writeFileSync(markdownPath, `# Sprint ${sprintId}: Command Log\n\n`);
}

fs.appendFileSync(
  markdownPath,
  [
    `## ${command}`,
    '',
    `- cwd: \`${cwd}\``,
    `- started_at: \`${entry.started_at}\``,
    `- finished_at: \`${entry.finished_at}\``,
    `- duration_ms: \`${entry.duration_ms}\``,
    `- exit_code: \`${entry.exit_code}\``,
    `- stdout_sha256: \`${entry.stdout_sha256}\``,
    `- stderr_sha256: \`${entry.stderr_sha256}\``,
    '',
    '### stdout excerpt',
    '',
    '```text',
    entry.stdout_excerpt,
    '```',
    '',
    '### stderr excerpt',
    '',
    '```text',
    entry.stderr_excerpt,
    '```',
    '',
  ].join('\n')
);

if (stdout) process.stdout.write(stdout);
if (stderr) process.stderr.write(stderr);
process.exit(exitCode);
