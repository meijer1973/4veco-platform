'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  resolveLessenRoot,
  checkIndex,
} = require('./check-agent-index-freshness');

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
