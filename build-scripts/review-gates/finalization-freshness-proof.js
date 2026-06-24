#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const DEFAULT_FILES = Object.freeze([
  'AGENTS.md',
  'docs/review/pr-readiness-routing-policy.md',
  'docs/review/pr-integration-lane-policy.md',
]);

function runGit(args, cwd = process.cwd()) {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`git ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return result.stdout.trim();
}

function fileSha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function buildFreshnessProof(options = {}) {
  const cwd = options.cwd || process.cwd();
  const files = options.files || DEFAULT_FILES;
  return {
    schema_version: 1,
    generated_at_utc: new Date().toISOString(),
    repository: options.repository || 'meijer1973/4veco-platform',
    head_sha: options.headSha || runGit(['rev-parse', 'HEAD'], cwd),
    origin_main_sha: options.originMainSha || runGit(['rev-parse', 'origin/main'], cwd),
    files: files.map((file) => ({
      path: file,
      sha256: fileSha256(path.resolve(cwd, file)),
    })),
  };
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (!args[index + 1]) throw new Error(`missing value for ${name}`);
  return args[index + 1];
}

function runCli(argv) {
  try {
    const output = optionValue(argv, '--output');
    const proof = buildFreshnessProof();
    const json = `${JSON.stringify(proof, null, 2)}\n`;
    if (output) {
      fs.mkdirSync(path.dirname(output), { recursive: true });
      fs.writeFileSync(output, json);
    }
    process.stdout.write(json);
  } catch (error) {
    console.error(`Finalization freshness proof failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  buildFreshnessProof,
  fileSha256,
};
