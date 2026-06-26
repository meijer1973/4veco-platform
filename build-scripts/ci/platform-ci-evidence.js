#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

/*
HOW TO ADAPT:
- Keep the evidence file outside both checked-out repositories. CI writes it
  under $GITHUB_WORKSPACE/ci-artifacts so diff hygiene cannot be dirtied.
- Add fields only when they are deterministic in local and GitHub Actions runs.
- The checker validates shape and SHA formats; remote run verification belongs
  to gate-specific tooling.
*/

const DEFAULT_PLATFORM_REPO = 'meijer1973/4veco-platform';
const DEFAULT_LESSEN_REPO = 'meijer1973/4veco-lessen';
const DEFAULT_WORKFLOW = 'platform-ci';
const DEFAULT_JOB = 'validate-platform';

function fail(message) {
  console.error(`Platform CI evidence failed: ${message}`);
  process.exit(1);
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (!args[index + 1]) fail(`missing value for ${name}`);
  return args[index + 1];
}

function optionValues(args, name) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] !== name) continue;
    if (!args[index + 1]) fail(`missing value for ${name}`);
    values.push(args[index + 1]);
  }
  return values;
}

function allowedSet(defaultValue, additions = []) {
  return new Set([defaultValue, ...additions.filter(Boolean)]);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: 'utf8',
    shell: false,
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`${command} ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return result.stdout.trim() || result.stderr.trim();
}

function git(repoPath, args) {
  return run('git', ['-C', repoPath, ...args]);
}

function gitHeadSha(repoPath) {
  return git(repoPath, ['rev-parse', 'HEAD']);
}

function gitBranchOrRef(repoPath) {
  const branch = spawnSync('git', ['-C', repoPath, 'rev-parse', '--abbrev-ref', 'HEAD'], {
    encoding: 'utf8',
  });
  if (branch.status === 0 && branch.stdout.trim() && branch.stdout.trim() !== 'HEAD') {
    return branch.stdout.trim();
  }
  return git(repoPath, ['describe', '--all', '--always']);
}

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function pythonVersion() {
  for (const candidate of [
    ['python', ['--version']],
    ['py', ['-3', '--version']],
  ]) {
    const result = spawnSync(candidate[0], candidate[1], { encoding: 'utf8' });
    if (result.status === 0) return (result.stdout || result.stderr).trim();
  }
  return 'unavailable';
}

function isPathInside(childPath, parentPath) {
  const relative = path.relative(path.resolve(parentPath), path.resolve(childPath));
  return relative === '' || (!!relative && !relative.startsWith('..') && !path.isAbsolute(relative));
}

function assertOutputOutsideRepos(outputPath, platformPath, lessenPath) {
  if (isPathInside(outputPath, platformPath)) {
    throw new Error(`output path is inside platform checkout: ${outputPath}`);
  }
  if (isPathInside(outputPath, lessenPath)) {
    throw new Error(`output path is inside lessen checkout: ${outputPath}`);
  }
}

function makeEvidence({ platformPath, lessenPath }) {
  const platformRoot = path.resolve(platformPath);
  const lessenRoot = path.resolve(lessenPath);
  const platformSha = gitHeadSha(platformRoot);
  const lessenSha = gitHeadSha(lessenRoot);
  const githubSha = process.env.GITHUB_SHA || platformSha;

  return {
    workflow: process.env.GITHUB_WORKFLOW || DEFAULT_WORKFLOW,
    job: process.env.GITHUB_JOB || DEFAULT_JOB,
    github_run_id: process.env.GITHUB_RUN_ID || 'local',
    github_run_attempt: process.env.GITHUB_RUN_ATTEMPT || 'local',
    github_ref: process.env.GITHUB_REF || gitBranchOrRef(platformRoot),
    github_sha: githubSha,
    platform: {
      repository: process.env.GITHUB_REPOSITORY || DEFAULT_PLATFORM_REPO,
      path: path.basename(platformRoot),
      head_sha: platformSha,
      branch_or_ref: gitBranchOrRef(platformRoot),
    },
    lessen: {
      repository: process.env.LESSEN_REPOSITORY || DEFAULT_LESSEN_REPO,
      path: path.basename(lessenRoot),
      head_sha: lessenSha,
      branch_or_ref: gitBranchOrRef(lessenRoot),
    },
    node_version: process.version,
    python_version: pythonVersion(),
    package_lock_sha256: sha256File(path.join(platformRoot, 'package-lock.json')),
    created_at_utc: new Date().toISOString(),
  };
}

function validateSha(value, label) {
  if (typeof value !== 'string' || !/^[a-f0-9]{40}$/i.test(value)) {
    throw new Error(`${label} must be a 40-character Git SHA`);
  }
}

function validateEvidence(evidence, options = {}) {
  for (const key of [
    'workflow',
    'job',
    'github_run_id',
    'github_run_attempt',
    'github_ref',
    'github_sha',
    'node_version',
    'python_version',
    'package_lock_sha256',
    'created_at_utc',
  ]) {
    if (typeof evidence[key] !== 'string' || !evidence[key].trim()) {
      throw new Error(`${key} must be a non-empty string`);
    }
  }
  const allowedWorkflows = allowedSet(DEFAULT_WORKFLOW, options.allowedWorkflows || []);
  const allowedJobs = allowedSet(DEFAULT_JOB, options.allowedJobs || []);
  if (!allowedWorkflows.has(evidence.workflow)) {
    throw new Error(`workflow must be one of: ${[...allowedWorkflows].join(', ')}`);
  }
  if (!allowedJobs.has(evidence.job)) {
    throw new Error(`job must be one of: ${[...allowedJobs].join(', ')}`);
  }
  validateSha(evidence.github_sha, 'github_sha');
  if (!/^[a-f0-9]{64}$/i.test(evidence.package_lock_sha256)) {
    throw new Error('package_lock_sha256 must be a SHA-256 hex digest');
  }
  if (!/^\d{4}-\d{2}-\d{2}T/.test(evidence.created_at_utc)) {
    throw new Error('created_at_utc must be an ISO UTC timestamp');
  }

  for (const repoKey of ['platform', 'lessen']) {
    const repo = evidence[repoKey];
    if (!repo || typeof repo !== 'object') throw new Error(`${repoKey} block is required`);
    for (const key of ['repository', 'path', 'head_sha', 'branch_or_ref']) {
      if (typeof repo[key] !== 'string' || !repo[key].trim()) {
        throw new Error(`${repoKey}.${key} must be a non-empty string`);
      }
    }
    validateSha(repo.head_sha, `${repoKey}.head_sha`);
  }

  return true;
}

function writeEvidence(outputPath, platformPath, lessenPath, options = {}) {
  assertOutputOutsideRepos(outputPath, platformPath, lessenPath);
  const evidence = makeEvidence({ platformPath, lessenPath });
  validateEvidence(evidence, options);
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
  return evidence;
}

function readEvidence(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function runCli(argv) {
  const command = argv[0];
  if (!command || !['write', 'check'].includes(command)) {
    fail('usage: platform-ci-evidence.js write --output <file> --platform-path <path> --lessen-path <path> [--allow-workflow <name>] [--allow-job <name>] | check <file> --platform-path <path> --lessen-path <path> [--allow-workflow <name>] [--allow-job <name>]');
  }

  const platformPath = path.resolve(optionValue(argv, '--platform-path') || '.');
  const lessenPath = path.resolve(optionValue(argv, '--lessen-path') || '../4veco-lessen');
  const validationOptions = {
    allowedWorkflows: optionValues(argv, '--allow-workflow'),
    allowedJobs: optionValues(argv, '--allow-job'),
  };

  try {
    if (command === 'write') {
      const outputPath = path.resolve(optionValue(argv, '--output') || '');
      if (!outputPath) throw new Error('missing --output');
      const evidence = writeEvidence(outputPath, platformPath, lessenPath, validationOptions);
      console.log(
        `OK wrote platform CI evidence: ${outputPath} platform=${evidence.platform.head_sha} lessen=${evidence.lessen.head_sha}`
      );
      return;
    }

    const file = path.resolve(argv[1] || '');
    if (!file) throw new Error('missing evidence file');
    assertOutputOutsideRepos(file, platformPath, lessenPath);
    const evidence = readEvidence(file);
    validateEvidence(evidence, validationOptions);
    console.log(
      `OK platform CI evidence: workflow=${evidence.workflow} platform=${evidence.platform.head_sha} lessen=${evidence.lessen.head_sha}`
    );
  } catch (error) {
    fail(error.message);
  }
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  DEFAULT_PLATFORM_REPO,
  DEFAULT_LESSEN_REPO,
  isPathInside,
  assertOutputOutsideRepos,
  makeEvidence,
  validateEvidence,
  writeEvidence,
  readEvidence,
};
