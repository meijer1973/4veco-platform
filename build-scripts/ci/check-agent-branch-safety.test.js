const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  inspectRepository,
  parseStatusPorcelain,
  summarizeBranchSafety,
} = require('./check-agent-branch-safety');

function summarize(branch, statusText, options = {}) {
  return summarizeBranchSafety({
    repositoryRoot: path.join(os.tmpdir(), '4veco-platform'),
    branch,
    statusText,
    options,
  });
}

describe('check-agent-branch-safety', () => {
  test('parses ahead and behind status', () => {
    const status = parseStatusPorcelain('## codex/task...origin/codex/task [ahead 1, behind 2]\n');

    expect(status.ahead).toBe(1);
    expect(status.behind).toBe(2);
    expect(status.diverged).toBe(true);
  });

  test('main branch fails by default', () => {
    const summary = summarize('main', '## main...origin/main\n');

    expect(summary.ok).toBe(false);
    expect(summary.on_main).toBe(true);
    expect(summary.failures).toContain('current branch is main');
  });

  test('main branch can be allowed for clean read-only inspection', () => {
    const summary = summarize('main', '## main...origin/main\n', {
      allowMainReadOnly: true,
    });

    expect(summary.ok).toBe(true);
    expect(summary.warnings).toContain('on main only allowed because --allow-main-read-only was passed');
  });

  test('codex task branch passes', () => {
    const summary = summarize('codex/task-20260607', '## codex/task-20260607...origin/codex/task-20260607\n');

    expect(summary.ok).toBe(true);
    expect(summary.prefix_ok).toBe(true);
    expect(summary.failures).toEqual([]);
  });

  test('agent task branch passes', () => {
    const summary = summarize('agent/task-20260607', '## agent/task-20260607...origin/agent/task-20260607\n');

    expect(summary.ok).toBe(true);
    expect(summary.prefix_ok).toBe(true);
    expect(summary.failures).toEqual([]);
  });

  test('feature branch warns without required prefix enforcement', () => {
    const summary = summarize('feature/random', '## feature/random...origin/feature/random\n');

    expect(summary.ok).toBe(true);
    expect(summary.prefix_ok).toBe(false);
    expect(summary.warnings).toContain('branch name does not start with required prefix: codex/,agent/');
  });

  test('feature branch fails when prefix is required', () => {
    const summary = summarize('feature/random', '## feature/random...origin/feature/random\n', {
      requirePrefix: true,
      prefixes: ['codex/', 'agent/'],
    });

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('branch name does not start with required prefix: codex/,agent/');
  });

  test('detached HEAD fails', () => {
    const summary = summarize('', '## HEAD (no branch)\n');

    expect(summary.ok).toBe(false);
    expect(summary.detached_head).toBe(true);
    expect(summary.failures).toContain('HEAD is detached');
  });

  test('diverged branch fails', () => {
    const summary = summarize(
      'codex/task-20260607',
      '## codex/task-20260607...origin/codex/task-20260607 [ahead 1, behind 2]\n'
    );

    expect(summary.ok).toBe(false);
    expect(summary.diverged).toBe(true);
    expect(summary.failures).toContain('local branch has diverged from remote');
  });

  test('dirty status warns by default', () => {
    const summary = summarize('codex/task-20260607', '## codex/task-20260607\n M AGENTS.md\n');

    expect(summary.ok).toBe(true);
    expect(summary.dirty).toBe(true);
    expect(summary.warnings).toContain('working tree is dirty (1 item)');
  });

  test('dirty status fails when clean tree is required', () => {
    const summary = summarize('codex/task-20260607', '## codex/task-20260607\n M AGENTS.md\n', {
      requireClean: true,
    });

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('working tree is dirty');
  });

  test('missing Git repository fails', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-branch-safety-'));
    try {
      const summary = inspectRepository(dir);

      expect(summary.ok).toBe(false);
      expect(summary.failures).toContain('missing Git repository');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
