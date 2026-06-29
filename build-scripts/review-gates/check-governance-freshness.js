#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const DEFAULT_FILES = Object.freeze([
  'AGENTS.md',
  'docs/review/pr-readiness-routing-policy.md',
  'docs/review/pr-integration-lane-policy.md',
  'docs/review/pr-throughput-policy.md',
  'package.json',
  '.github/workflows/platform-ci.yml',
  'build-scripts/ci/check-branch-protection.js',
]);

function defaultGitRunner(args, cwd) {
  return spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });
}

function normalizeGitResult(result) {
  if (typeof result === 'string') return { status: 0, stdout: result, stderr: '' };
  return {
    status: Number.isInteger(result.status) ? result.status : 0,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function runGitResult(args, cwd = process.cwd(), runner = defaultGitRunner) {
  return normalizeGitResult(runner(args, cwd));
}

function runGit(args, cwd = process.cwd(), runner = defaultGitRunner) {
  const result = runGitResult(args, cwd, runner);
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`git ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return result.stdout.trim();
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (!args[index + 1]) throw new Error(`missing value for ${name}`);
  return args[index + 1];
}

function flag(args, name) {
  return args.includes(name);
}

function readLocalFile(cwd, file) {
  const filePath = path.resolve(cwd, file);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

function readRemoteFile(cwd, file, ref, runner) {
  const result = runGitResult(['show', `${ref}:${file}`], cwd, runner);
  if (result.status !== 0) return null;
  return result.stdout;
}

function checkGovernanceFreshness(options = {}) {
  const cwd = options.cwd || process.cwd();
  const remote = options.remote || 'origin';
  const remoteRef = options.remoteRef || `${remote}/main`;
  const runner = options.gitRunner || defaultGitRunner;
  const files = options.files || DEFAULT_FILES;
  const allowPolicyEdit = options.allowPolicyEdit === true;
  const failures = [];
  const differing_files = [];

  if (options.fetch !== false) {
    const fetchResult = runGitResult(['fetch', '--prune', remote], cwd, runner);
    if (fetchResult.status !== 0) {
      const detail = (fetchResult.stderr || fetchResult.stdout || '').trim();
      failures.push(`git fetch --prune ${remote} failed${detail ? `: ${detail}` : ''}`);
    }
  }

  let originMainSha = null;
  let headSha = null;
  try {
    originMainSha = runGit(['rev-parse', remoteRef], cwd, runner);
    headSha = runGit(['rev-parse', 'HEAD'], cwd, runner);
  } catch (error) {
    failures.push(error.message);
  }

  for (const file of files) {
    const localText = readLocalFile(cwd, file);
    const remoteText = readRemoteFile(cwd, file, remoteRef, runner);
    if (localText === null) {
      differing_files.push({ path: file, reason: 'missing_local_file' });
      continue;
    }
    if (remoteText === null) {
      differing_files.push({ path: file, reason: 'missing_origin_main_file' });
      continue;
    }
    if (localText !== remoteText) {
      differing_files.push({ path: file, reason: 'differs_from_origin_main' });
    }
  }

  if (differing_files.length > 0 && !allowPolicyEdit) {
    failures.push('governance files differ from origin/main; rerun from current main or use --allow-policy-edit for an intentional policy-edit task');
  }

  return {
    ok: failures.length === 0,
    remote,
    remote_ref: remoteRef,
    origin_main_sha: originMainSha,
    head_sha: headSha,
    allow_policy_edit: allowPolicyEdit,
    files,
    differing_files,
    failures,
  };
}

function runCli(argv) {
  try {
    const files = optionValue(argv, '--files')
      ? optionValue(argv, '--files').split(',').map((item) => item.trim()).filter(Boolean)
      : DEFAULT_FILES;
    const summary = checkGovernanceFreshness({
      cwd: optionValue(argv, '--cwd') || process.cwd(),
      remote: optionValue(argv, '--remote') || 'origin',
      allowPolicyEdit: flag(argv, '--allow-policy-edit'),
      fetch: !flag(argv, '--no-fetch'),
      files,
    });
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
    if (!summary.ok) process.exit(1);
  } catch (error) {
    console.error(`Governance freshness check failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  DEFAULT_FILES,
  checkGovernanceFreshness,
};
