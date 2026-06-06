#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

/*
HOW TO ADAPT:
- Keep TRACKED_PATTERNS aligned with the narrow .gitattributes CI/evidence
  policy. Do not add broad repository-wide patterns here without a sprint plan.
- This checker only scans tracked files that Git reports for those patterns.
- Binary and very large files are skipped defensively; evidence/report text
  files should remain small enough to scan fully.
*/

const MAX_BYTES = 10 * 1024 * 1024;

const TRACKED_PATTERNS = [
  '.gitattributes',
  'BATCH-CLOSURE-WAIVER.md',
  'package.json',
  ':(glob).github/workflows/*.yml',
  ':(glob).github/*.txt',
  ':(glob)build-scripts/ci/*.js',
  ':(glob)build-scripts/sprints/check-gate-ci-proof*.js',
  'docs/roadmaps/roadmap-version-index.json',
  'docs/roadmaps/roadmap-version-index.md',
  'references/reference-team-roadmap.md',
  ':(glob)references/data/sprints/CI-LF-HARDEN-1*.json',
  ':(glob)references/data/sprints/CI-EVIDENCE-1*.json',
  ':(glob)references/data/sprints/CI-GATE-PROOF-1*.json',
  ':(glob)references/data/sprints/CI-GOVERNANCE-1*.json',
  'reports/url-index.md',
  ':(glob)reports/github-agent-index-*.md',
  ':(glob)reports/github-agent-index-*.json',
  'reports/internal-dashboard/index.html',
  'reports/internal-dashboard/dashboard-data.json',
  ':(glob)reports/sprints/CI-LF-HARDEN-1-*',
  ':(glob)reports/sprints/CI-EVIDENCE-1-*',
  ':(glob)reports/sprints/CI-GATE-PROOF-1-*',
  ':(glob)reports/sprints/CI-GOVERNANCE-1-*',
  ':(glob)reports/fixtures/gate-ci-proof1/*.md',
  ':(glob)reports/fixtures/gate-ci-proof1/*.json',
];

function fail(message) {
  console.error(`Evidence line-ending check failed: ${message}`);
  process.exit(1);
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (!args[index + 1]) fail(`missing value for ${name}`);
  return args[index + 1];
}

function isBinaryBuffer(buffer) {
  return buffer.includes(0);
}

function containsCrLf(buffer) {
  return buffer.includes(Buffer.from('\r\n'));
}

function listTrackedFiles(root, patterns = TRACKED_PATTERNS) {
  const result = spawnSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', ...patterns], {
    cwd: root,
    encoding: 'buffer',
  });
  if (result.status !== 0) {
    const stderr = result.stderr ? result.stderr.toString('utf8') : '';
    throw new Error(`git ls-files failed: ${stderr.trim()}`);
  }
  return result.stdout
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .sort();
}

function checkFiles(root, files) {
  const failures = [];
  const skipped = [];
  let scanned = 0;

  for (const relativePath of files) {
    const absolutePath = path.resolve(root, relativePath);
    const stat = fs.statSync(absolutePath);
    if (stat.size > MAX_BYTES) {
      skipped.push({ path: relativePath, reason: 'large-file' });
      continue;
    }

    const buffer = fs.readFileSync(absolutePath);
    if (isBinaryBuffer(buffer)) {
      skipped.push({ path: relativePath, reason: 'binary' });
      continue;
    }

    scanned += 1;
    if (containsCrLf(buffer)) failures.push(relativePath);
  }

  return { scanned, skipped, failures };
}

function runCli(argv) {
  const root = path.resolve(optionValue(argv, '--root') || process.cwd());
  let files;
  try {
    files = listTrackedFiles(root);
  } catch (error) {
    fail(error.message);
  }

  if (files.length === 0 && !argv.includes('--allow-empty')) {
    fail('no tracked CI/evidence files matched the configured patterns');
  }

  const result = checkFiles(root, files);
  if (result.failures.length > 0) {
    for (const file of result.failures) console.error(`CRLF found: ${file}`);
    fail(`${result.failures.length} matched text file(s) contain CRLF`);
  }

  console.log(
    `OK evidence line endings: scanned ${result.scanned} text file(s), skipped ${result.skipped.length}, CRLF 0`
  );
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  MAX_BYTES,
  TRACKED_PATTERNS,
  containsCrLf,
  isBinaryBuffer,
  listTrackedFiles,
  checkFiles,
};
