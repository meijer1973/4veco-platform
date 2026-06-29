const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  DEFAULT_FILES,
  checkGovernanceFreshness,
} = require('./check-governance-freshness');

function makeTempRoot(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'governance-freshness-'));
  for (const [file, text] of Object.entries(files)) {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text);
  }
  return root;
}

function makeRemoteFiles(overrides = {}) {
  const files = {};
  for (const file of DEFAULT_FILES) files[file] = `${file}\ncurrent\n`;
  return { ...files, ...overrides };
}

function makeGitRunner(remoteFiles) {
  const calls = [];
  const runner = (args) => {
    calls.push(args);
    if (args[0] === 'fetch') return { status: 0, stdout: '', stderr: '' };
    if (args[0] === 'rev-parse' && args[1] === 'origin/main') {
      return { status: 0, stdout: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n', stderr: '' };
    }
    if (args[0] === 'rev-parse' && args[1] === 'HEAD') {
      return { status: 0, stdout: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\n', stderr: '' };
    }
    if (args[0] === 'show') {
      const match = String(args[1]).match(/^origin\/main:(.+)$/);
      const file = match && match[1];
      if (file && Object.prototype.hasOwnProperty.call(remoteFiles, file)) {
        return { status: 0, stdout: remoteFiles[file], stderr: '' };
      }
      return { status: 1, stdout: '', stderr: 'missing file' };
    }
    return { status: 1, stdout: '', stderr: `unexpected git args: ${args.join(' ')}` };
  };
  runner.calls = calls;
  return runner;
}

describe('check-governance-freshness', () => {
  test('passes when current governance files match origin/main', () => {
    const remoteFiles = makeRemoteFiles();
    const root = makeTempRoot(remoteFiles);
    const gitRunner = makeGitRunner(remoteFiles);

    const summary = checkGovernanceFreshness({ cwd: root, gitRunner });

    expect(summary.ok).toBe(true);
    expect(summary.differing_files).toEqual([]);
    expect(gitRunner.calls[0]).toEqual(['fetch', '--prune', 'origin']);
  });

  test('fails when AGENTS.md is stale', () => {
    const remoteFiles = makeRemoteFiles();
    const localFiles = { ...remoteFiles, 'AGENTS.md': 'stale agents guidance\n' };
    const root = makeTempRoot(localFiles);

    const summary = checkGovernanceFreshness({
      cwd: root,
      gitRunner: makeGitRunner(remoteFiles),
    });

    expect(summary.ok).toBe(false);
    expect(summary.differing_files).toContainEqual({
      path: 'AGENTS.md',
      reason: 'differs_from_origin_main',
    });
    expect(summary.failures.join('\n')).toMatch(/governance files differ/);
  });

  test('fails when the GitHub agent entrypoint is stale', () => {
    const remoteFiles = makeRemoteFiles();
    const localFiles = { ...remoteFiles, 'AGENT_GITHUB_ENTRY.md': 'stale GitHub entry guidance\n' };
    const root = makeTempRoot(localFiles);

    const summary = checkGovernanceFreshness({
      cwd: root,
      gitRunner: makeGitRunner(remoteFiles),
    });

    expect(summary.ok).toBe(false);
    expect(summary.differing_files).toContainEqual({
      path: 'AGENT_GITHUB_ENTRY.md',
      reason: 'differs_from_origin_main',
    });
  });

  test('fails when the integration policy is stale', () => {
    const remoteFiles = makeRemoteFiles();
    const policy = 'docs/review/pr-integration-lane-policy.md';
    const localFiles = { ...remoteFiles, [policy]: 'stale integration policy\n' };
    const root = makeTempRoot(localFiles);

    const summary = checkGovernanceFreshness({
      cwd: root,
      gitRunner: makeGitRunner(remoteFiles),
    });

    expect(summary.ok).toBe(false);
    expect(summary.differing_files).toContainEqual({
      path: policy,
      reason: 'differs_from_origin_main',
    });
  });

  test('policy-edit mode allows intended policy differences while reporting them', () => {
    const remoteFiles = makeRemoteFiles();
    const localFiles = {
      ...remoteFiles,
      'AGENTS.md': 'intentional policy edit\n',
    };
    const root = makeTempRoot(localFiles);

    const summary = checkGovernanceFreshness({
      cwd: root,
      gitRunner: makeGitRunner(remoteFiles),
      allowPolicyEdit: true,
    });

    expect(summary.ok).toBe(true);
    expect(summary.allow_policy_edit).toBe(true);
    expect(summary.differing_files).toEqual([
      {
        path: 'AGENTS.md',
        reason: 'differs_from_origin_main',
      },
    ]);
  });

  test('fails closed when git fetch cannot run even in policy-edit mode', () => {
    const remoteFiles = makeRemoteFiles();
    const root = makeTempRoot(remoteFiles);
    const gitRunner = jest.fn((args) => {
      if (args[0] === 'fetch') return { status: null, stdout: '', stderr: '', error: new Error('spawn git ENOENT') };
      return makeGitRunner(remoteFiles)(args);
    });

    const summary = checkGovernanceFreshness({
      cwd: root,
      gitRunner,
      allowPolicyEdit: true,
    });

    expect(summary.ok).toBe(false);
    expect(summary.failures.join('\n')).toMatch(/git fetch --prune origin failed: spawn git ENOENT/);
  });

  test('fails closed when origin main SHA is unavailable in policy-edit mode', () => {
    const remoteFiles = makeRemoteFiles();
    const root = makeTempRoot(remoteFiles);
    const baseRunner = makeGitRunner(remoteFiles);
    const gitRunner = jest.fn((args) => {
      if (args[0] === 'rev-parse' && args[1] === 'origin/main') {
        return { status: 128, stdout: '', stderr: 'unknown revision' };
      }
      return baseRunner(args);
    });

    const summary = checkGovernanceFreshness({
      cwd: root,
      gitRunner,
      allowPolicyEdit: true,
    });

    expect(summary.ok).toBe(false);
    expect(summary.origin_main_sha).toBeNull();
    expect(summary.failures.join('\n')).toMatch(/git rev-parse origin\/main failed: unknown revision/);
    expect(summary.failures).toContain('origin/main SHA missing or invalid');
  });

  test('fails closed when HEAD SHA is malformed in policy-edit mode', () => {
    const remoteFiles = makeRemoteFiles();
    const root = makeTempRoot(remoteFiles);
    const baseRunner = makeGitRunner(remoteFiles);
    const gitRunner = jest.fn((args) => {
      if (args[0] === 'rev-parse' && args[1] === 'HEAD') {
        return { status: 0, stdout: 'not-a-sha\n', stderr: '' };
      }
      return baseRunner(args);
    });

    const summary = checkGovernanceFreshness({
      cwd: root,
      gitRunner,
      allowPolicyEdit: true,
    });

    expect(summary.ok).toBe(false);
    expect(summary.head_sha).toBe('not-a-sha');
    expect(summary.failures).toContain('HEAD SHA missing or invalid');
  });
});
