'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  resolveLessenRoot,
  checkIndex,
} = require('./check-agent-index-freshness');
const { buildIndex, resolveSourceRef } = require('./github-agent-index');

function git(args, cwd) {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${(result.stderr || result.stdout || '').trim()}`);
  }
  return result.stdout.trim();
}

function makeRepo() {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-index-freshness-'));
  git(['init', '-b', 'main'], repo);
  fs.writeFileSync(path.join(repo, 'README.md'), '# temp\n');
  git(['add', 'README.md'], repo);
  git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'initial'], repo);
  return repo;
}

describe('check-agent-index-freshness', () => {
  test('lesson generation defaults to live origin/main', () => {
    expect(resolveSourceRef('4veco-lessen', {})).toBe('origin/main');
    expect(resolveSourceRef('4veco-platform', {})).toBe('HEAD');
  });

  test('passes when index source_commit matches repo HEAD', () => {
    const repo = makeRepo();
    try {
      const head = git(['rev-parse', 'HEAD'], repo);
      const indexPath = path.join(repo, 'index.json');
      fs.writeFileSync(indexPath, JSON.stringify({ source_commit: head }), 'utf8');

      expect(checkIndex({ label: 'repo', indexPath, repoRoot: repo }).ok).toBe(true);
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });

  test('fails when index source_commit is stale', () => {
    const repo = makeRepo();
    try {
      const indexPath = path.join(repo, 'index.json');
      fs.writeFileSync(indexPath, JSON.stringify({ source_commit: 'abc123' }), 'utf8');

      const result = checkIndex({ label: 'repo', indexPath, repoRoot: repo });
      expect(result.ok).toBe(false);
      expect(result.failures.join('\n')).toMatch(/does not match HEAD/);
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });

  test('lesson index follows origin/main even when local HEAD is stale', () => {
    const repo = makeRepo();
    try {
      const staleHead = git(['rev-parse', 'HEAD'], repo);
      const year2Path = path.join(repo, 'year2-candidate-lessons', 'four-target-lesson-production-1', 'lesson.md');
      fs.mkdirSync(path.dirname(year2Path), { recursive: true });
      fs.writeFileSync(year2Path, '# live Year 2 lesson\n', 'utf8');
      git(['add', '.'], repo);
      git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'live lesson main'], repo);
      const liveMain = git(['rev-parse', 'HEAD'], repo);
      git(['update-ref', 'refs/remotes/origin/main', liveMain], repo);
      git(['checkout', '--detach', staleHead], repo);

      const index = buildIndex('4veco-lessen', repo, { sourceRef: 'origin/main' });
      const indexPath = path.join(repo, 'index.json');
      fs.writeFileSync(indexPath, JSON.stringify(index), 'utf8');
      const indexedFiles = Object.values(index.groups).flat();

      expect(index.source_branch).toBe('origin/main');
      expect(index.source_commit).toBe(liveMain);
      expect(indexedFiles).toContain('year2-candidate-lessons/four-target-lesson-production-1/lesson.md');
      expect(checkIndex({
        label: '4veco-lessen',
        indexPath,
        repoRoot: repo,
        sourceRef: 'origin/main',
        expectedSourceBranch: 'origin/main',
        allowGeneratedIndexTail: false,
      }).ok).toBe(true);

      fs.writeFileSync(indexPath, JSON.stringify({
        ...index,
        source_branch: 'HEAD',
        source_commit: staleHead,
      }), 'utf8');
      const staleResult = checkIndex({
        label: '4veco-lessen',
        indexPath,
        repoRoot: repo,
        sourceRef: 'origin/main',
        expectedSourceBranch: 'origin/main',
        allowGeneratedIndexTail: false,
      });
      expect(staleResult.ok).toBe(false);
      expect(staleResult.failures.join('\n')).toMatch(/does not match origin\/main/);
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });

  test('accepts a final generated-index-only commit after the source commit', () => {
    const repo = makeRepo();
    try {
      const sourceHead = git(['rev-parse', 'HEAD'], repo);
      const reportsDir = path.join(repo, 'reports');
      fs.mkdirSync(reportsDir);
      const indexPath = path.join(reportsDir, 'github-agent-index-platform.json');
      fs.writeFileSync(indexPath, JSON.stringify({ source_commit: sourceHead }), 'utf8');
      git(['add', 'reports/github-agent-index-platform.json'], repo);
      git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'generated index'], repo);

      const result = checkIndex({ label: 'repo', indexPath, repoRoot: repo });
      expect(result.ok).toBe(true);
      expect(result.accepted_parent_generated_tail).toBe(true);
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });

  test('rejects a stale index when the final commit changes non-index files', () => {
    const repo = makeRepo();
    try {
      const sourceHead = git(['rev-parse', 'HEAD'], repo);
      const indexPath = path.join(repo, 'index.json');
      fs.writeFileSync(indexPath, JSON.stringify({ source_commit: sourceHead }), 'utf8');
      fs.writeFileSync(path.join(repo, 'source.md'), 'changed\n', 'utf8');
      git(['add', 'index.json', 'source.md'], repo);
      git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'mixed tail'], repo);

      const result = checkIndex({ label: 'repo', indexPath, repoRoot: repo });
      expect(result.ok).toBe(false);
      expect(result.accepted_parent_generated_tail).toBe(false);
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });

  test('skips optional lesson index when lesson root is unavailable', () => {
    const result = checkIndex({
      label: '4veco-lessen',
      indexPath: path.join(os.tmpdir(), 'missing-index.json'),
      repoRoot: null,
      required: false,
    });

    expect(result.ok).toBe(true);
    expect(result.skipped).toBe(true);
  });

  test('lesson root resolution uses env or sibling only', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'platform-root-'));
    try {
      const platformRoot = path.join(root, '4veco-platform');
      const siblingLessen = path.join(root, '4veco-lessen');
      fs.mkdirSync(platformRoot);

      expect(resolveLessenRoot(platformRoot, {})).toBe(null);

      fs.mkdirSync(siblingLessen);
      expect(resolveLessenRoot(platformRoot, {})).toBe(siblingLessen);
      expect(resolveLessenRoot(platformRoot, { FOURVECO_LESSEN_ROOT: 'C:/custom/lessen' }))
        .toBe(path.resolve('C:/custom/lessen'));
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
