const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  LOCK_FILENAME,
  applyLockMode,
  lockPathForGitDir,
  readLock,
  summarizeWorktreeSafety,
} = require('./check-agent-worktree-safety');

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'agent-worktree-safety-'));
}

function removeDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function state({
  root,
  gitDir,
  branch = 'codex/task-20260607',
  statusText = '## codex/task-20260607...origin/main\n',
  headSha = 'abc123',
} = {}) {
  return {
    missingGitRepository: false,
    repositoryRoot: root || path.join(os.tmpdir(), '4veco-platform-worktree'),
    gitDir: gitDir || path.join(os.tmpdir(), 'git-dir'),
    branch,
    headSha,
    statusText,
    gitFailures: [],
  };
}

function options(overrides = {}) {
  return {
    mode: 'claim',
    taskId: 'TASK-1',
    agentId: 'agent-a',
    requirePrefix: true,
    prefixes: ['codex/', 'agent/'],
    requireClean: false,
    allowAnchorReadOnly: false,
    staleWarningMs: 60 * 60 * 1000,
    ...overrides,
  };
}

function writeExistingLock(lockPath, overrides = {}) {
  const record = {
    schema: '4veco-agent-worktree-lock.v1',
    task_id: 'TASK-1',
    agent_id: 'agent-a',
    created_at_utc: '2026-06-07T10:00:00Z',
    updated_at_utc: '2026-06-07T10:00:00Z',
    repo: '4veco-platform',
    worktree_path: 'C:\\wt\\TASK-1\\4veco-platform',
    git_dir: path.dirname(lockPath),
    branch: 'codex/task-20260607',
    head_sha: 'abc123',
    pid: 1,
    hostname: 'test-host',
    status: 'active',
    ...overrides,
  };
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  fs.writeFileSync(lockPath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
  return record;
}

describe('check-agent-worktree-safety', () => {
  test('claim succeeds with no existing lock', () => {
    const dir = tempDir();
    try {
      const gitDir = path.join(dir, '.git', 'worktrees', 'task');
      const summary = applyLockMode(state({ root: path.join(dir, 'repo'), gitDir }), options());

      expect(summary.ok).toBe(true);
      expect(summary.lock.present).toBe(true);
      expect(fs.existsSync(lockPathForGitDir(gitDir))).toBe(true);
      expect(readLock(lockPathForGitDir(gitDir)).record.agent_id).toBe('agent-a');
    } finally {
      removeDir(dir);
    }
  });

  test('claim fails when another agent owns the lock', () => {
    const dir = tempDir();
    try {
      const gitDir = path.join(dir, '.git', 'worktrees', 'task');
      const lockPath = lockPathForGitDir(gitDir);
      const original = writeExistingLock(lockPath, { agent_id: 'agent-b' });

      const summary = applyLockMode(state({ root: path.join(dir, 'repo'), gitDir }), options());

      expect(summary.ok).toBe(false);
      expect(summary.failures).toContain('worktree lock is owned by another agent');
      expect(readLock(lockPath).record.agent_id).toBe(original.agent_id);
    } finally {
      removeDir(dir);
    }
  });

  test('check succeeds for same owner', () => {
    const dir = tempDir();
    try {
      const gitDir = path.join(dir, '.git', 'worktrees', 'task');
      writeExistingLock(lockPathForGitDir(gitDir));

      const summary = applyLockMode(state({ root: path.join(dir, 'repo'), gitDir }), options({ mode: 'check' }));

      expect(summary.ok).toBe(true);
      expect(summary.lock.same_owner).toBe(true);
      expect(summary.lock.same_task).toBe(true);
    } finally {
      removeDir(dir);
    }
  });

  test('check fails when lock is missing', () => {
    const summary = applyLockMode(state(), options({ mode: 'check' }));

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('worktree lock is missing');
  });

  test('check fails when lock belongs to another task', () => {
    const dir = tempDir();
    try {
      const gitDir = path.join(dir, '.git', 'worktrees', 'task');
      writeExistingLock(lockPathForGitDir(gitDir), { task_id: 'OTHER-TASK' });

      const summary = applyLockMode(state({ root: path.join(dir, 'repo'), gitDir }), options({ mode: 'check' }));

      expect(summary.ok).toBe(false);
      expect(summary.failures).toContain('worktree lock belongs to another task');
    } finally {
      removeDir(dir);
    }
  });

  test('release succeeds for same owner', () => {
    const dir = tempDir();
    try {
      const gitDir = path.join(dir, '.git', 'worktrees', 'task');
      const lockPath = lockPathForGitDir(gitDir);
      writeExistingLock(lockPath);

      const summary = applyLockMode(state({ root: path.join(dir, 'repo'), gitDir }), options({ mode: 'release' }));

      expect(summary.ok).toBe(true);
      expect(summary.lock.present).toBe(false);
      expect(fs.existsSync(lockPath)).toBe(false);
    } finally {
      removeDir(dir);
    }
  });

  test('release fails for different owner', () => {
    const dir = tempDir();
    try {
      const gitDir = path.join(dir, '.git', 'worktrees', 'task');
      const lockPath = lockPathForGitDir(gitDir);
      writeExistingLock(lockPath, { agent_id: 'agent-b' });

      const summary = applyLockMode(state({ root: path.join(dir, 'repo'), gitDir }), options({ mode: 'release' }));

      expect(summary.ok).toBe(false);
      expect(summary.failures).toContain('worktree lock is owned by another agent');
      expect(fs.existsSync(lockPath)).toBe(true);
    } finally {
      removeDir(dir);
    }
  });

  test('stale lock is reported but not overwritten', () => {
    const dir = tempDir();
    try {
      const gitDir = path.join(dir, '.git', 'worktrees', 'task');
      const lockPath = lockPathForGitDir(gitDir);
      writeExistingLock(lockPath, {
        agent_id: 'agent-b',
        updated_at_utc: '2026-06-07T00:00:00Z',
      });
      const before = fs.readFileSync(lockPath, 'utf8');

      const summary = summarizeWorktreeSafety({
        ...state({ root: path.join(dir, 'repo'), gitDir }),
        lockPath,
        lockState: readLock(lockPath),
        now: new Date('2026-06-07T12:00:00Z'),
        options: options(),
      });

      expect(summary.ok).toBe(false);
      expect(summary.lock.stale).toBe(true);
      expect(summary.failures).toContain('worktree lock is owned by another agent');
      expect(fs.readFileSync(lockPath, 'utf8')).toBe(before);
    } finally {
      removeDir(dir);
    }
  });

  test('anchor clone mutating mode fails', () => {
    const summary = summarizeWorktreeSafety({
      ...state({ root: 'C:\\Projects\\4veco\\4veco-platform' }),
      lockPath: 'C:\\git\\lock.json',
      lockState: { present: false, record: null, parseError: null },
      options: options(),
    });

    expect(summary.ok).toBe(false);
    expect(summary.anchor_clone).toBe(true);
    expect(summary.failures).toContain('current path is an anchor clone');
  });

  test('allow-anchor-read-only does not permit claim on anchor main clone', () => {
    const summary = summarizeWorktreeSafety({
      ...state({
        root: 'C:\\Projects\\4veco\\4veco-platform',
        branch: 'main',
        statusText: '## main...origin/main\n',
      }),
      lockPath: 'C:\\git\\lock.json',
      lockState: { present: false, record: null, parseError: null },
      options: options({ allowAnchorReadOnly: true }),
    });

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('current branch is main');
    expect(summary.failures).toContain('current path is an anchor clone');
  });

  test('allow-anchor-read-only permits clean check on anchor main clone with same owner lock', () => {
    const summary = summarizeWorktreeSafety({
      ...state({
        root: 'C:\\Projects\\4veco\\4veco-platform',
        branch: 'main',
        statusText: '## main...origin/main\n',
      }),
      lockPath: 'C:\\git\\lock.json',
      lockState: {
        present: true,
        record: {
          task_id: 'TASK-1',
          agent_id: 'agent-a',
          updated_at_utc: new Date().toISOString(),
        },
        parseError: null,
      },
      options: options({ mode: 'check', allowAnchorReadOnly: true }),
    });

    expect(summary.ok).toBe(true);
    expect(summary.warnings).toContain('on main only allowed because --allow-anchor-read-only was passed');
  });

  test('main branch fails', () => {
    const summary = summarizeWorktreeSafety({
      ...state({ branch: 'main', statusText: '## main...origin/main\n' }),
      lockState: { present: false, record: null, parseError: null },
      options: options(),
    });

    expect(summary.ok).toBe(false);
    expect(summary.on_main).toBe(true);
    expect(summary.failures).toContain('current branch is main');
  });

  test('detached HEAD fails', () => {
    const summary = summarizeWorktreeSafety({
      ...state({ branch: '', statusText: '## HEAD (no branch)\n' }),
      lockState: { present: false, record: null, parseError: null },
      options: options(),
    });

    expect(summary.ok).toBe(false);
    expect(summary.detached_head).toBe(true);
    expect(summary.failures).toContain('HEAD is detached');
  });

  test('diverged branch fails', () => {
    const summary = summarizeWorktreeSafety({
      ...state({
        statusText: '## codex/task-20260607...origin/codex/task-20260607 [ahead 1, behind 2]\n',
      }),
      lockState: { present: false, record: null, parseError: null },
      options: options(),
    });

    expect(summary.ok).toBe(false);
    expect(summary.diverged).toBe(true);
    expect(summary.failures).toContain('local branch has diverged from remote');
  });

  test('invalid prefix fails when required', () => {
    const summary = summarizeWorktreeSafety({
      ...state({ branch: 'feature/random', statusText: '## feature/random...origin/feature/random\n' }),
      lockState: { present: false, record: null, parseError: null },
      options: options(),
    });

    expect(summary.ok).toBe(false);
    expect(summary.prefix_ok).toBe(false);
    expect(summary.failures).toContain('branch name does not start with required prefix: codex/,agent/');
  });

  test('dirty worktree fails when require-clean is passed', () => {
    const summary = summarizeWorktreeSafety({
      ...state({ statusText: '## codex/task-20260607...origin/main\n M AGENTS.md\n' }),
      lockState: { present: false, record: null, parseError: null },
      options: options({ requireClean: true }),
    });

    expect(summary.ok).toBe(false);
    expect(summary.dirty).toBe(true);
    expect(summary.failures).toContain('working tree is dirty');
  });

  test('ahead and behind states warn when not diverged', () => {
    const ahead = summarizeWorktreeSafety({
      ...state({
        statusText: '## codex/task-20260607...origin/codex/task-20260607 [ahead 2]\n',
      }),
      lockState: { present: false, record: null, parseError: null },
      options: options(),
    });
    const behind = summarizeWorktreeSafety({
      ...state({
        statusText: '## codex/task-20260607...origin/codex/task-20260607 [behind 3]\n',
      }),
      lockState: { present: false, record: null, parseError: null },
      options: options(),
    });

    expect(ahead.ok).toBe(true);
    expect(ahead.warnings).toContain('local branch is ahead of remote by 2');
    expect(behind.ok).toBe(true);
    expect(behind.warnings).toContain('local branch is behind remote by 3');
  });

  test('dirty worktree warns when require-clean is not passed', () => {
    const summary = summarizeWorktreeSafety({
      ...state({ statusText: '## codex/task-20260607...origin/main\n M AGENTS.md\n' }),
      lockState: { present: false, record: null, parseError: null },
      options: options(),
    });

    expect(summary.ok).toBe(true);
    expect(summary.warnings).toContain('working tree is dirty (1 item)');
  });

  test('old same-owner lock warns but remains valid', () => {
    const summary = summarizeWorktreeSafety({
      ...state(),
      lockState: {
        present: true,
        record: {
          task_id: 'TASK-1',
          agent_id: 'agent-a',
          updated_at_utc: '2026-06-07T00:00:00Z',
        },
        parseError: null,
      },
      now: new Date('2026-06-07T12:00:00Z'),
      options: options({ mode: 'check' }),
    });

    expect(summary.ok).toBe(true);
    expect(summary.lock.stale).toBe(true);
    expect(summary.warnings).toContain('worktree lock is older than 1 hours');
  });

  test('lock path is computed from git dir, not repository root', () => {
    const gitDir = path.join(os.tmpdir(), 'repo-root', '.git', 'worktrees', 'task-worktree');

    expect(lockPathForGitDir(gitDir)).toBe(path.join(gitDir, LOCK_FILENAME));
  });
});
