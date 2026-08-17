#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const PLATFORM_REPO = 'meijer1973/4veco-platform';
const LESSON_REPO = 'meijer1973/4veco-lessen';
const INDEX_PATHS = Object.freeze([
  'reports/github-agent-index-lessen.json',
  'reports/github-agent-index-lessen.md',
  'reports/github-agent-index-platform.json',
  'reports/github-agent-index-platform.md',
]);
const TRUSTED_GENERATOR = 'build-scripts/reports/github-agent-index.js';
const TRUSTED_FRESHNESS_CHECKER = 'build-scripts/reports/check-agent-index-freshness.js';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || process.cwd(),
    env: options.env || process.env,
    encoding: options.encoding || 'utf8',
    maxBuffer: 1024 * 1024 * 50,
  });
  if (result.status !== 0) {
    const detail = String(result.stderr || result.stdout || '').trim();
    throw new Error(`${command} ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return String(result.stdout || '').trim();
}

function git(args, cwd, options = {}) {
  return run('git', args, { ...options, cwd });
}

function normalizePaths(values) {
  return [...new Set((values || []).map((item) => String(item).replace(/\\/g, '/')).filter(Boolean))].sort();
}

function samePaths(left, right) {
  return JSON.stringify(normalizePaths(left)) === JSON.stringify(normalizePaths(right));
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function fileHashes(root) {
  return Object.fromEntries(INDEX_PATHS.map((relativePath) => [
    relativePath,
    sha256(fs.readFileSync(path.join(root, relativePath))),
  ]));
}

function canonicalGeneratedAt(lessonRoot, lessonMergeSha) {
  const value = git(['show', '-s', '--format=%cI', lessonMergeSha], lessonRoot);
  if (!value || Number.isNaN(Date.parse(value))) {
    throw new Error('lesson merge commit has no canonical committer timestamp');
  }
  return new Date(value).toISOString();
}

function cloneAt(remote, repo, target, sha) {
  if (remote) {
    run('git', ['clone', '--no-checkout', remote, target]);
  } else {
    run('gh', ['repo', 'clone', repo, target, '--', '--no-checkout']);
  }
  git(['fetch', '--no-tags', 'origin', sha], target);
  git(['checkout', '--detach', sha], target);
}

function trustedRefreshEnv(input) {
  return {
    ...process.env,
    FOURVECO_PLATFORM_ROOT: input.platformRoot,
    FOURVECO_REPORTS_DIR: path.join(input.platformRoot, 'reports'),
    FOURVECO_LESSEN_ROOT: input.lessonRoot,
    FOURVECO_PLATFORM_SOURCE_REF: 'HEAD',
    FOURVECO_PLATFORM_SOURCE_BRANCH: input.platformBranch,
    FOURVECO_LESSEN_SOURCE_REF: 'HEAD',
    FOURVECO_LESSEN_SOURCE_BRANCH: 'origin/main',
    FOURVECO_INDEX_GENERATED_AT: input.generatedAt,
  };
}

function runTrustedGeneration(input) {
  const generator = path.join(input.trustedRoot, TRUSTED_GENERATOR);
  const checker = path.join(input.trustedRoot, TRUSTED_FRESHNESS_CHECKER);
  const env = trustedRefreshEnv(input);
  run(process.execPath, [generator], { cwd: input.trustedRoot, env });
  run(process.execPath, [checker], { cwd: input.trustedRoot, env });
}

function readJson(root, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function validateGeneratedMetadata(input) {
  const platform = readJson(input.platformRoot, 'reports/github-agent-index-platform.json');
  const lesson = readJson(input.platformRoot, 'reports/github-agent-index-lessen.json');
  const failures = [];
  if (platform.source_commit !== input.platformSourceSha) failures.push('platform_source_commit_mismatch');
  if (platform.source_branch !== input.platformBranch) failures.push('platform_source_branch_mismatch');
  if (platform.generated_at !== input.generatedAt) failures.push('platform_generated_at_mismatch');
  if (lesson.source_commit !== input.lessonMergeSha) failures.push('lesson_source_commit_mismatch');
  if (lesson.source_branch !== 'origin/main') failures.push('lesson_source_branch_mismatch');
  if (lesson.generated_at !== input.generatedAt) failures.push('lesson_generated_at_mismatch');
  if (failures.length > 0) throw new Error(failures.join(', '));
  return {
    platform_source_commit: platform.source_commit,
    platform_source_branch: platform.source_branch,
    lesson_source_commit: lesson.source_commit,
    lesson_source_branch: lesson.source_branch,
    generated_at: input.generatedAt,
  };
}

function generateCanonicalIndexes(input) {
  const generate = input.runTrustedGeneration || runTrustedGeneration;
  generate(input);
  const firstHashes = fileHashes(input.platformRoot);
  generate(input);
  const secondHashes = fileHashes(input.platformRoot);
  if (JSON.stringify(firstHashes) !== JSON.stringify(secondHashes)) {
    throw new Error('agent index generation is not deterministic for canonical inputs');
  }
  const metadata = validateGeneratedMetadata(input);
  return { hashes: secondHashes, metadata };
}

function worktreeChangedPaths(repoRoot) {
  const tracked = git(['diff', '--name-only'], repoRoot).split(/\r?\n/).filter(Boolean);
  const untracked = git(['ls-files', '--others', '--exclude-standard'], repoRoot).split(/\r?\n/).filter(Boolean);
  return normalizePaths([...tracked, ...untracked]);
}

function commitGeneratedIndexes(input) {
  const commitEnv = {
    ...process.env,
    GIT_AUTHOR_DATE: input.generatedAt,
    GIT_COMMITTER_DATE: input.generatedAt,
  };
  git([
    '-c', 'user.name=4veco integration lane',
    '-c', 'user.email=integration@4veco.invalid',
    '-c', 'commit.gpgSign=false',
    'commit', '--no-verify', '-m', `chore: refresh agent indexes for lesson main ${input.lessonMergeSha.slice(0, 12)}`,
  ], input.platformRoot, { env: commitEnv });
}

function commitPaths(repoRoot, commitSha) {
  const parentLine = git(['show', '-s', '--format=%P', commitSha], repoRoot);
  const parents = parentLine ? parentLine.split(/\s+/).filter(Boolean) : [];
  const paths = parents.length === 1
    ? git(['diff', '--name-only', `${parents[0]}..${commitSha}`], repoRoot).split(/\r?\n/).filter(Boolean)
    : [];
  return { parents, paths: normalizePaths(paths) };
}

function compareGeneratedToCommit(generatedRoot, commitRoot, commitSha) {
  return INDEX_PATHS.every((relativePath) => {
    const expected = fs.readFileSync(path.join(generatedRoot, relativePath));
    const result = spawnSync('git', ['show', `${commitSha}:${relativePath}`], {
      cwd: commitRoot,
      encoding: null,
      maxBuffer: 1024 * 1024 * 50,
    });
    if (result.status !== 0) return false;
    const actual = result.stdout;
    return expected.equals(actual);
  });
}

function verifyExistingRefresh(input) {
  const shape = commitPaths(input.platformRoot, input.currentHeadSha);
  const indexOnly = shape.paths.length > 0 && shape.paths.every((item) => INDEX_PATHS.includes(item));
  if (shape.parents.length !== 1 || !indexOnly) return null;
  if (!samePaths(shape.paths, INDEX_PATHS)) {
    throw new Error('existing index-only refresh descendant is stale or tampered');
  }
  const parentSha = shape.parents[0];
  const verificationRoot = path.join(input.tempRoot, 'platform-refresh-verification');
  cloneAt(input.platformRemote, PLATFORM_REPO, verificationRoot, parentSha);
  const generated = generateCanonicalIndexes({
    ...input,
    platformRoot: verificationRoot,
    platformSourceSha: parentSha,
  });
  if (!compareGeneratedToCommit(verificationRoot, input.platformRoot, input.currentHeadSha)) {
    throw new Error('existing index-only refresh descendant is stale or tampered');
  }
  return {
    status: 'reused',
    previous_platform_head_sha: parentSha,
    platform_integration_head_sha: input.currentHeadSha,
    hashes: generated.hashes,
    metadata: generated.metadata,
  };
}

function remoteBranchHead(input) {
  if (input.fetchPlatformPr) {
    const observed = input.fetchPlatformPr();
    return observed && observed.headRefOid;
  }
  const output = git(['ls-remote', '--heads', 'origin', `refs/heads/${input.platformBranch}`], input.platformRoot);
  return output ? output.split(/\s+/)[0] : null;
}

function refreshBundleAgentIndexes(options) {
  const platformPr = options.platformPr || {};
  const currentHeadSha = platformPr.headRefOid;
  const platformBranch = platformPr.headRefName;
  const lessonMergeSha = options.lessonMergeSha;
  if (!/^[a-f0-9]{40}$/i.test(String(currentHeadSha || ''))) throw new Error('platform PR head is missing or invalid');
  if (!platformBranch) throw new Error('platform PR branch is missing');
  if (!/^[a-f0-9]{40}$/i.test(String(lessonMergeSha || ''))) throw new Error('lesson merge SHA is missing or invalid');
  if (options.dryRun) {
    return {
      ok: true,
      status: 'would_refresh',
      previous_platform_head_sha: currentHeadSha,
      platform_integration_head_sha: currentHeadSha,
      lesson_merge_commit_sha: lessonMergeSha,
      changed_paths: [...INDEX_PATHS],
      trusted_executor: 'platform-main',
    };
  }

  const trustedRoot = options.trustedRoot || path.resolve(__dirname, '..', '..');
  const tempRoot = fs.mkdtempSync(path.join(options.tempRoot || os.tmpdir(), '4veco-bundle-index-refresh-'));
  const platformRoot = path.join(tempRoot, 'platform');
  const lessonRoot = path.join(tempRoot, 'lesson');
  try {
    cloneAt(options.platformRemote, PLATFORM_REPO, platformRoot, currentHeadSha);
    cloneAt(options.lessonRemote, LESSON_REPO, lessonRoot, lessonMergeSha);
    const payloadSha = options.reviewedPlatformPayloadSha || currentHeadSha;
    const ancestor = spawnSync('git', ['merge-base', '--is-ancestor', payloadSha, currentHeadSha], {
      cwd: platformRoot,
      encoding: 'utf8',
    });
    if (ancestor.status !== 0) throw new Error('reviewed platform payload is not an ancestor of the refresh source head');
    const generatedAt = canonicalGeneratedAt(lessonRoot, lessonMergeSha);
    const common = {
      trustedRoot,
      tempRoot,
      platformRoot,
      lessonRoot,
      platformRemote: options.platformRemote,
      lessonRemote: options.lessonRemote,
      platformBranch,
      currentHeadSha,
      lessonMergeSha,
      generatedAt,
      runTrustedGeneration: options.runTrustedGeneration,
    };
    const existing = currentHeadSha !== payloadSha ? verifyExistingRefresh(common) : null;
    if (existing) {
      return {
        ok: true,
        ...existing,
        lesson_merge_commit_sha: lessonMergeSha,
        changed_paths: [...INDEX_PATHS],
        trusted_executor: 'platform-main',
      };
    }

    const generated = generateCanonicalIndexes({
      ...common,
      platformSourceSha: currentHeadSha,
    });
    const changedPaths = worktreeChangedPaths(platformRoot);
    if (!samePaths(changedPaths, INDEX_PATHS)) {
      throw new Error(`trusted refresh changed unexpected paths: ${normalizePaths(changedPaths).join(', ') || 'none'}`);
    }
    git(['add', '--', ...INDEX_PATHS], platformRoot);
    (options.commitGeneratedIndexes || commitGeneratedIndexes)({
      platformRoot,
      generatedAt,
      lessonMergeSha,
    });
    const newHeadSha = git(['rev-parse', 'HEAD'], platformRoot);
    git(['push', 'origin', `${newHeadSha}:refs/heads/${platformBranch}`], platformRoot);
    const observedHead = remoteBranchHead({
      platformRoot,
      platformBranch,
      fetchPlatformPr: options.fetchPlatformPr,
    });
    if (observedHead !== newHeadSha) throw new Error('platform refresh push/refetch head mismatch');
    return {
      ok: true,
      status: 'created',
      previous_platform_head_sha: currentHeadSha,
      platform_integration_head_sha: newHeadSha,
      lesson_merge_commit_sha: lessonMergeSha,
      changed_paths: [...INDEX_PATHS],
      trusted_executor: 'platform-main',
      hashes: generated.hashes,
      metadata: generated.metadata,
    };
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

module.exports = {
  INDEX_PATHS,
  TRUSTED_FRESHNESS_CHECKER,
  TRUSTED_GENERATOR,
  canonicalGeneratedAt,
  commitGeneratedIndexes,
  generateCanonicalIndexes,
  refreshBundleAgentIndexes,
  runTrustedGeneration,
  samePaths,
  worktreeChangedPaths,
};
