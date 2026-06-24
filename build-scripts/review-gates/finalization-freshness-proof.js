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

function defaultGitRunner(args, cwd) {
  return spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });
}

function normalizeGitResult(result) {
  if (typeof result === 'string') {
    return { status: 0, stdout: result, stderr: '' };
  }
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

function gitSucceeds(args, cwd = process.cwd(), runner = defaultGitRunner) {
  return runGitResult(args, cwd, runner).status === 0;
}

function fileSha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function textSha256(text) {
  return crypto.createHash('sha256').update(String(text), 'utf8').digest('hex');
}

function remoteMainSha(remote, cwd, runner) {
  const output = runGit(['ls-remote', '--heads', remote, 'refs/heads/main'], cwd, runner);
  const [sha] = output.split(/\s+/);
  if (!/^[a-f0-9]{40}$/i.test(sha || '')) {
    throw new Error(`unable to resolve remote main from ${remote}`);
  }
  return sha;
}

function remoteBlobSha256(ref, file, cwd, runner) {
  const result = runGitResult(['show', `${ref}:${file}`], cwd, runner);
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`git show ${ref}:${file} failed${detail ? `: ${detail}` : ''}`);
  }
  return textSha256(result.stdout);
}

function buildFreshnessProof(options = {}) {
  const cwd = options.cwd || process.cwd();
  const files = options.files || DEFAULT_FILES;
  const remote = options.remote || 'origin';
  const runner = options.gitRunner || defaultGitRunner;
  const headSha = options.headSha || runGit(['rev-parse', 'HEAD'], cwd, runner);
  const observedRemoteMainSha =
    options.remoteMainSha || remoteMainSha(remote, cwd, runner);
  const localOriginMainSha =
    options.originMainSha || runGit(['rev-parse', `${remote}/main`], cwd, runner);
  const remoteMatchesLocal = observedRemoteMainSha === localOriginMainSha;
  if (!remoteMatchesLocal && options.allowStaleTracking !== true) {
    throw new Error(
      `stale ${remote}/main: remote main is ${observedRemoteMainSha}, local ${remote}/main is ${localOriginMainSha}`
    );
  }
  const remoteMainIsAncestor =
    options.remoteMainIsAncestorOfHead !== undefined
      ? Boolean(options.remoteMainIsAncestorOfHead)
      : gitSucceeds(['merge-base', '--is-ancestor', observedRemoteMainSha, headSha], cwd, runner);
  return {
    schema_version: 1,
    generated_at_utc: new Date().toISOString(),
    repository: options.repository || 'meijer1973/4veco-platform',
    head_sha: headSha,
    remote,
    remote_main_sha: observedRemoteMainSha,
    origin_main_sha: localOriginMainSha,
    remote_main_matches_origin_main: remoteMatchesLocal,
    remote_main_is_ancestor_of_head: remoteMainIsAncestor,
    files: files.map((file) => ({
      path: file,
      working_tree_sha256: fileSha256(path.resolve(cwd, file)),
      remote_main_sha256: remoteBlobSha256(observedRemoteMainSha, file, cwd, runner),
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
