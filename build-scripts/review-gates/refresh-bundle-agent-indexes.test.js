const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  INDEX_PATHS,
  refreshBundleAgentIndexes,
  runTrustedGeneration,
} = require('./refresh-bundle-agent-indexes');

const trustedRoot = path.resolve(__dirname, '..', '..');

function git(args, cwd) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${(result.stderr || result.stdout || '').trim()}`);
  }
  return result.stdout.trim();
}

function commit(cwd, message) {
  git(['add', '.'], cwd);
  git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', message], cwd);
  return git(['rev-parse', 'HEAD'], cwd);
}

function initRemote(root, name) {
  const work = path.join(root, `${name}-work`);
  const bare = path.join(root, `${name}.git`);
  fs.mkdirSync(work, { recursive: true });
  git(['init', '-b', 'main'], work);
  git(['config', 'core.autocrlf', 'false'], work);
  git(['init', '--bare', bare], root);
  git(['remote', 'add', 'origin', bare], work);
  return { work, bare };
}

function setupFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-index-refresh-test-'));
  const platform = initRemote(root, 'platform');
  const lesson = initRemote(root, 'lesson');

  fs.writeFileSync(path.join(platform.work, 'README.md'), '# platform\n');
  fs.mkdirSync(path.join(platform.work, 'reports'));
  for (const relativePath of INDEX_PATHS) {
    const absolutePath = path.join(platform.work, relativePath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, relativePath.endsWith('.json') ? '{}\n' : '# stale\n');
  }
  commit(platform.work, 'platform base');
  git(['checkout', '-b', 'codex/controller'], platform.work);
  fs.writeFileSync(path.join(platform.work, 'controller.txt'), 'payload\n');
  const platformPayload = commit(platform.work, 'platform payload');
  git(['push', '-u', 'origin', 'codex/controller'], platform.work);
  git(['push', '-u', 'origin', 'main'], platform.work);

  fs.writeFileSync(path.join(lesson.work, 'AGENTS.md'), 'old route\n');
  commit(lesson.work, 'lesson base');
  git(['checkout', '-b', 'agent/lesson-payload'], lesson.work);
  fs.writeFileSync(path.join(lesson.work, 'AGENTS.md'), 'canonical route\n');
  const lessonPayload = commit(lesson.work, 'lesson payload');
  git(['checkout', 'main'], lesson.work);
  git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'merge', '--no-ff', 'agent/lesson-payload', '-m', 'merge lesson payload'], lesson.work);
  const lessonMerge = git(['rev-parse', 'HEAD'], lesson.work);
  git(['push', '-u', 'origin', 'main'], lesson.work);

  return {
    root,
    platform,
    lesson,
    platformPayload,
    lessonPayload,
    lessonMerge,
  };
}

describe('trusted bundle agent-index refresh', () => {
  test('creates one canonical refresh commit for a distinct lesson merge commit and reuses it', () => {
    const fixture = setupFixture();
    try {
      expect(fixture.lessonMerge).not.toBe(fixture.lessonPayload);
      const first = refreshBundleAgentIndexes({
        trustedRoot,
        platformRemote: fixture.platform.bare,
        lessonRemote: fixture.lesson.bare,
        reviewedPlatformPayloadSha: fixture.platformPayload,
        lessonMergeSha: fixture.lessonMerge,
        platformPr: {
          headRefName: 'codex/controller',
          headRefOid: fixture.platformPayload,
        },
      });

      expect(first).toMatchObject({
        ok: true,
        status: 'created',
        previous_platform_head_sha: fixture.platformPayload,
        lesson_merge_commit_sha: fixture.lessonMerge,
        changed_paths: INDEX_PATHS,
        trusted_executor: 'platform-main',
      });
      expect(first.platform_integration_head_sha).not.toBe(fixture.platformPayload);
      expect(git(['--git-dir', fixture.platform.bare, 'rev-parse', 'refs/heads/codex/controller'], fixture.root))
        .toBe(first.platform_integration_head_sha);
      const lessonIndex = JSON.parse(git([
        '--git-dir', fixture.platform.bare,
        'show', `${first.platform_integration_head_sha}:reports/github-agent-index-lessen.json`,
      ], fixture.root));
      expect(lessonIndex.source_commit).toBe(fixture.lessonMerge);
      expect(lessonIndex.source_branch).toBe('origin/main');

      const second = refreshBundleAgentIndexes({
        trustedRoot,
        platformRemote: fixture.platform.bare,
        lessonRemote: fixture.lesson.bare,
        reviewedPlatformPayloadSha: fixture.platformPayload,
        lessonMergeSha: fixture.lessonMerge,
        platformPr: {
          headRefName: 'codex/controller',
          headRefOid: first.platform_integration_head_sha,
        },
      });
      expect(second).toMatchObject({
        ok: true,
        status: 'reused',
        platform_integration_head_sha: first.platform_integration_head_sha,
        lesson_merge_commit_sha: fixture.lessonMerge,
      });
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  }, 30000);

  test('rejects a tampered index-only descendant instead of stacking another refresh', () => {
    const fixture = setupFixture();
    try {
      const first = refreshBundleAgentIndexes({
        trustedRoot,
        platformRemote: fixture.platform.bare,
        lessonRemote: fixture.lesson.bare,
        reviewedPlatformPayloadSha: fixture.platformPayload,
        lessonMergeSha: fixture.lessonMerge,
        platformPr: {
          headRefName: 'codex/controller',
          headRefOid: fixture.platformPayload,
        },
      });
      const tamperWork = path.join(fixture.root, 'tamper-work');
      git(['clone', '--branch', 'codex/controller', fixture.platform.bare, tamperWork], fixture.root);
      fs.writeFileSync(path.join(tamperWork, INDEX_PATHS[0]), '{"tampered":true}\n');
      const tampered = commit(tamperWork, 'tamper generated indexes');
      git(['push', 'origin', 'codex/controller'], tamperWork);

      expect(() => refreshBundleAgentIndexes({
        trustedRoot,
        platformRemote: fixture.platform.bare,
        lessonRemote: fixture.lesson.bare,
        reviewedPlatformPayloadSha: fixture.platformPayload,
        lessonMergeSha: fixture.lessonMerge,
        platformPr: {
          headRefName: 'codex/controller',
          headRefOid: tampered,
        },
      })).toThrow(/stale or tampered|unexpected paths/);
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  }, 30000);

  test('fails closed at clone/fetch and lineage boundaries', () => {
    const fixture = setupFixture();
    try {
      expect(() => refreshBundleAgentIndexes({
        trustedRoot,
        platformRemote: fixture.platform.bare,
        lessonRemote: fixture.lesson.bare,
        reviewedPlatformPayloadSha: fixture.platformPayload,
        lessonMergeSha: 'f'.repeat(40),
        platformPr: {
          headRefName: 'codex/controller',
          headRefOid: fixture.platformPayload,
        },
      })).toThrow(/fetch|failed/);

      expect(() => refreshBundleAgentIndexes({
        trustedRoot,
        platformRemote: fixture.platform.bare,
        lessonRemote: fixture.lesson.bare,
        reviewedPlatformPayloadSha: 'e'.repeat(40),
        lessonMergeSha: fixture.lessonMerge,
        platformPr: {
          headRefName: 'codex/controller',
          headRefOid: fixture.platformPayload,
        },
      })).toThrow(/not an ancestor/);
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  }, 30000);

  test('fails closed on generator errors, unexpected files, and nondeterminism', () => {
    for (const mode of ['error', 'unexpected', 'nondeterministic']) {
      const fixture = setupFixture();
      try {
        let generation = 0;
        const injectedGeneration = (input) => {
          if (mode === 'error') throw new Error('injected generation failure');
          runTrustedGeneration(input);
          generation += 1;
          if (mode === 'unexpected') {
            fs.writeFileSync(path.join(input.platformRoot, 'unexpected.txt'), 'unexpected\n');
          }
          if (mode === 'nondeterministic') {
            fs.appendFileSync(
              path.join(input.platformRoot, INDEX_PATHS[0]),
              `\n${generation}\n`
            );
          }
        };
        expect(() => refreshBundleAgentIndexes({
          trustedRoot,
          platformRemote: fixture.platform.bare,
          lessonRemote: fixture.lesson.bare,
          reviewedPlatformPayloadSha: fixture.platformPayload,
          lessonMergeSha: fixture.lessonMerge,
          runTrustedGeneration: injectedGeneration,
          platformPr: {
            headRefName: 'codex/controller',
            headRefOid: fixture.platformPayload,
          },
        })).toThrow(
          mode === 'error'
            ? /injected generation failure/
            : mode === 'unexpected'
              ? /unexpected paths/
              : /not deterministic/
        );
      } finally {
        fs.rmSync(fixture.root, { recursive: true, force: true });
      }
    }
  }, 60000);

  test('fails closed when push is rejected or the PR refetch observes another head', () => {
    for (const mode of ['push', 'refetch']) {
      const fixture = setupFixture();
      try {
        if (mode === 'push') {
          const hook = path.join(fixture.platform.bare, 'hooks', 'pre-receive');
          fs.writeFileSync(hook, '#!/bin/sh\nexit 1\n');
          fs.chmodSync(hook, 0o755);
        }
        expect(() => refreshBundleAgentIndexes({
          trustedRoot,
          platformRemote: fixture.platform.bare,
          lessonRemote: fixture.lesson.bare,
          reviewedPlatformPayloadSha: fixture.platformPayload,
          lessonMergeSha: fixture.lessonMerge,
          fetchPlatformPr: mode === 'refetch'
            ? () => ({ headRefOid: fixture.platformPayload })
            : undefined,
          platformPr: {
            headRefName: 'codex/controller',
            headRefOid: fixture.platformPayload,
          },
        })).toThrow(mode === 'push' ? /push.*failed/i : /push\/refetch head mismatch/);
      } finally {
        fs.rmSync(fixture.root, { recursive: true, force: true });
      }
    }
  }, 60000);

  test('commit failure leaves the controller branch at the reviewed payload', () => {
    const fixture = setupFixture();
    try {
      expect(() => refreshBundleAgentIndexes({
        trustedRoot,
        platformRemote: fixture.platform.bare,
        lessonRemote: fixture.lesson.bare,
        reviewedPlatformPayloadSha: fixture.platformPayload,
        lessonMergeSha: fixture.lessonMerge,
        commitGeneratedIndexes: () => {
          throw new Error('injected commit failure');
        },
        platformPr: {
          headRefName: 'codex/controller',
          headRefOid: fixture.platformPayload,
        },
      })).toThrow(/injected commit failure/);
      expect(git([
        '--git-dir', fixture.platform.bare,
        'rev-parse', 'refs/heads/codex/controller',
      ], fixture.root)).toBe(fixture.platformPayload);
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  }, 30000);
});
