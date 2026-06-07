#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  DEFAULT_PREFIXES,
  parsePrefixList,
  parseStatusPorcelain,
} = require('./check-agent-branch-safety');

/*
HOW TO ADAPT:
- This checker is a local/agent preflight. It is intentionally not wired into
  default platform-ci because CI checkouts do not have durable agent worktree
  ownership locks.
- Keep the lock in the per-worktree Git metadata directory returned by
  `git rev-parse --git-dir`. Never write the lock into the tracked worktree.
- Add new failure modes through summarizeWorktreeSafety first, then cover them
  in focused Jest tests.
*/

const LOCK_SCHEMA = '4veco-agent-worktree-lock.v1';
const LOCK_FILENAME = '4veco-agent-worktree-lock.json';
const DEFAULT_STALE_WARNING_MS = 8 * 60 * 60 * 1000;
const DEFAULT_ANCHOR_CLONES = [
  'C:/Projects/4veco/4veco-platform',
  'C:/Projects/4veco/4veco-lessen',
];

function splitLines(text) {
  return String(text || '')
    .split(/\r?\n/)
    .filter((line) => line.length > 0);
}

function normalizePath(value) {
  return path.resolve(String(value || '')).replace(/\\/g, '/').toLowerCase();
}

function repositoryName(repositoryRoot) {
  if (!repositoryRoot) return null;
  return path.basename(path.resolve(repositoryRoot));
}

function isAnchorClone(repositoryRoot, anchors = DEFAULT_ANCHOR_CLONES) {
  const normalized = normalizePath(repositoryRoot);
  return anchors.some((anchor) => normalizePath(anchor) === normalized);
}

function lockPathForGitDir(gitDir) {
  return path.join(path.resolve(gitDir), LOCK_FILENAME);
}

function parseArgs(argv) {
  const options = {
    mode: null,
    taskId: null,
    agentId: null,
    requirePrefix: false,
    prefixes: DEFAULT_PREFIXES,
    requireClean: false,
    allowAnchorReadOnly: false,
    forceOwnerOverride: false,
    reason: null,
    worktreePath: null,
    staleWarningMs: DEFAULT_STALE_WARNING_MS,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--claim' || arg === '--check' || arg === '--release') {
      if (options.mode) throw new Error('pass exactly one mode: --claim, --check, or --release');
      options.mode = arg.slice(2);
    } else if (arg === '--task') {
      const value = argv[index + 1];
      if (!value) throw new Error('missing value for --task');
      options.taskId = value;
      index += 1;
    } else if (arg === '--agent') {
      const value = argv[index + 1];
      if (!value) throw new Error('missing value for --agent');
      options.agentId = value;
      index += 1;
    } else if (arg === '--require-prefix') {
      const value = argv[index + 1];
      if (!value) throw new Error('missing value for --require-prefix');
      options.requirePrefix = true;
      options.prefixes = parsePrefixList(value);
      index += 1;
    } else if (arg === '--require-clean') {
      options.requireClean = true;
    } else if (arg === '--allow-anchor-read-only') {
      options.allowAnchorReadOnly = true;
    } else if (arg === '--force-owner-override') {
      options.forceOwnerOverride = true;
    } else if (arg === '--reason') {
      const value = argv[index + 1];
      if (!value) throw new Error('missing value for --reason');
      options.reason = value;
      index += 1;
    } else if (arg === '--worktree') {
      const value = argv[index + 1];
      if (!value) throw new Error('missing value for --worktree');
      options.worktreePath = value;
      index += 1;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }

  if (!options.help) {
    if (!options.mode) throw new Error('missing mode: pass --claim, --check, or --release');
    if (!options.taskId) throw new Error('missing required --task <task-id>');
    if (!options.agentId) throw new Error('missing required --agent <agent-id>');
    if (options.forceOwnerOverride && !options.reason) {
      throw new Error('--force-owner-override requires --reason');
    }
  }

  return options;
}

function hasRequiredPrefix(branch, prefixes) {
  return Boolean(branch && prefixes.some((prefix) => branch.startsWith(prefix)));
}

function runGit(args, cwd) {
  return spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
  });
}

function resolveGitDir(cwd, gitDir) {
  if (path.isAbsolute(gitDir)) return path.resolve(gitDir);
  return path.resolve(cwd, gitDir);
}

function inspectGitState(cwd) {
  const rootResult = runGit(['rev-parse', '--show-toplevel'], cwd);
  if (rootResult.status !== 0) {
    return {
      missingGitRepository: true,
      repositoryRoot: null,
      gitDir: null,
      branch: null,
      headSha: null,
      statusText: '',
      gitFailures: ['missing Git repository'],
    };
  }

  const repositoryRoot = rootResult.stdout.trim();
  const gitDirResult = runGit(['rev-parse', '--git-dir'], cwd);
  const branchResult = runGit(['branch', '--show-current'], cwd);
  const headResult = runGit(['rev-parse', 'HEAD'], cwd);
  const statusResult = runGit(['status', '--porcelain=v1', '--branch'], cwd);
  const gitFailures = [];

  if (gitDirResult.status !== 0) gitFailures.push(`unable to read Git directory: ${(gitDirResult.stderr || '').trim()}`);
  if (branchResult.status !== 0) gitFailures.push(`unable to read current branch: ${(branchResult.stderr || '').trim()}`);
  if (headResult.status !== 0) gitFailures.push(`unable to read HEAD: ${(headResult.stderr || '').trim()}`);
  if (statusResult.status !== 0) gitFailures.push(`unable to read git status: ${(statusResult.stderr || '').trim()}`);

  return {
    missingGitRepository: false,
    repositoryRoot,
    gitDir: gitDirResult.status === 0 ? resolveGitDir(repositoryRoot, gitDirResult.stdout.trim()) : null,
    branch: branchResult.status === 0 ? branchResult.stdout.trim() : null,
    headSha: headResult.status === 0 ? headResult.stdout.trim() : null,
    statusText: statusResult.status === 0 ? statusResult.stdout : '',
    gitFailures,
  };
}

function readLock(lockPath) {
  if (!lockPath || !fs.existsSync(lockPath)) {
    return {
      present: false,
      record: null,
      parseError: null,
      raw: null,
    };
  }

  const raw = fs.readFileSync(lockPath, 'utf8');
  try {
    return {
      present: true,
      record: JSON.parse(raw),
      parseError: null,
      raw,
    };
  } catch (error) {
    return {
      present: true,
      record: null,
      parseError: error.message,
      raw,
    };
  }
}

function lockAgeMs(lockRecord, now = new Date()) {
  if (!lockRecord || !lockRecord.updated_at_utc) return null;
  const timestamp = Date.parse(lockRecord.updated_at_utc);
  if (Number.isNaN(timestamp)) return null;
  return now.getTime() - timestamp;
}

function buildLockPayload(gitState, options, existingRecord = null, now = new Date()) {
  const nowText = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
  return {
    schema: LOCK_SCHEMA,
    task_id: options.taskId,
    agent_id: options.agentId,
    created_at_utc: existingRecord && existingRecord.created_at_utc ? existingRecord.created_at_utc : nowText,
    updated_at_utc: nowText,
    repo: repositoryName(gitState.repositoryRoot),
    worktree_path: gitState.repositoryRoot,
    git_dir: gitState.gitDir,
    branch: gitState.branch,
    head_sha: gitState.headSha,
    pid: process.pid,
    hostname: os.hostname(),
    status: 'active',
  };
}

function writeLockExclusive(lockPath, payload) {
  const bytes = Buffer.from(`${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  const handle = fs.openSync(lockPath, 'wx');
  try {
    fs.writeSync(handle, bytes, 0, bytes.length);
  } finally {
    fs.closeSync(handle);
  }
}

function writeLock(lockPath, payload) {
  fs.writeFileSync(lockPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function summarizeWorktreeSafety(input) {
  const options = {
    mode: 'check',
    requireClean: false,
    requirePrefix: false,
    prefixes: DEFAULT_PREFIXES,
    allowAnchorReadOnly: false,
    forceOwnerOverride: false,
    staleWarningMs: DEFAULT_STALE_WARNING_MS,
    ...(input.options || {}),
  };
  const status = parseStatusPorcelain(input.statusText || '');
  const branch = input.branch || '';
  const detachedHead = !branch || status.detached_head;
  const onMain = branch === 'main';
  const prefixOk = hasRequiredPrefix(branch, options.prefixes);
  const anchorClone = Boolean(input.repositoryRoot && isAnchorClone(input.repositoryRoot, input.anchorClones));
  const allowReadOnlyAnchor = options.allowAnchorReadOnly && options.mode === 'check';
  const warnings = [];
  const failures = [];
  const lockState = input.lockState || { present: false, record: null, parseError: null };
  const lockRecord = lockState.record;

  if (input.missingGitRepository) {
    failures.push('missing Git repository');
  }

  for (const failure of input.gitFailures || []) {
    failures.push(failure);
  }

  if (!input.missingGitRepository && detachedHead) {
    failures.push('HEAD is detached');
  }

  if (!input.missingGitRepository && onMain) {
    if (allowReadOnlyAnchor) {
      warnings.push('on main only allowed because --allow-anchor-read-only was passed');
      if (status.dirty) failures.push('main has uncommitted changes');
      if (status.ahead > 0) failures.push('main has local commits ahead of remote');
    } else {
      failures.push('current branch is main');
    }
  }

  if (!input.missingGitRepository && anchorClone && !allowReadOnlyAnchor) {
    failures.push('current path is an anchor clone');
  }

  if (!input.missingGitRepository && !detachedHead && !onMain && !prefixOk) {
    const message = `branch name does not start with required prefix: ${options.prefixes.join(',')}`;
    if (options.requirePrefix) failures.push(message);
    else warnings.push(message);
  }

  if (status.diverged) failures.push('local branch has diverged from remote');
  if (status.ahead > 0 && !status.diverged && !(onMain && options.allowAnchorReadOnly)) {
    warnings.push(`local branch is ahead of remote by ${status.ahead}`);
  }
  if (status.behind > 0 && !status.diverged) {
    warnings.push(`local branch is behind remote by ${status.behind}`);
  }
  if (status.dirty) {
    if (options.requireClean) failures.push('working tree is dirty');
    else warnings.push(`working tree is dirty (${status.dirty_count} item${status.dirty_count === 1 ? '' : 's'})`);
  }

  if (lockState.parseError) {
    failures.push(`unable to parse worktree lock: ${lockState.parseError}`);
  }

  const lockPresent = Boolean(lockState.present && lockRecord);
  const sameOwner = lockPresent && lockRecord.agent_id === options.agentId;
  const sameTask = lockPresent && lockRecord.task_id === options.taskId;
  const age = lockPresent ? lockAgeMs(lockRecord, input.now || new Date()) : null;
  const stale = typeof age === 'number' && age > options.staleWarningMs;

  if (stale) {
    warnings.push(`worktree lock is older than ${Math.round(options.staleWarningMs / 3600000)} hours`);
  }

  if (options.mode === 'check' || options.mode === 'release') {
    if (!lockPresent) failures.push('worktree lock is missing');
  }

  if (lockPresent) {
    if (!sameTask) failures.push('worktree lock belongs to another task');
    if (!sameOwner) {
      if (options.forceOwnerOverride && options.mode === 'claim') {
        warnings.push(`overriding worktree lock owned by ${lockRecord.agent_id}: ${options.reason}`);
      } else {
        failures.push('worktree lock is owned by another agent');
      }
    }
    if (stale && (!sameOwner || !sameTask) && !(options.forceOwnerOverride && options.mode === 'claim')) {
      failures.push('stale worktree lock requires explicit owner override');
    }
  }

  return {
    ok: failures.length === 0,
    mode: options.mode,
    repository: repositoryName(input.repositoryRoot),
    worktree_path: input.repositoryRoot || null,
    git_dir: input.gitDir || null,
    anchor_clone: anchorClone,
    task_id: options.taskId,
    agent_id: options.agentId,
    lock: {
      present: lockPresent,
      same_owner: Boolean(lockPresent && sameOwner),
      same_task: Boolean(lockPresent && sameTask),
      stale,
      path: input.lockPath || null,
      owner: lockPresent ? lockRecord.agent_id || null : null,
      task_id: lockPresent ? lockRecord.task_id || null : null,
    },
    branch: branch || null,
    head_sha: input.headSha || null,
    on_main: onMain,
    detached_head: detachedHead,
    dirty: status.dirty,
    dirty_count: status.dirty_count,
    ahead: status.ahead,
    behind: status.behind,
    diverged: status.diverged,
    prefix_ok: prefixOk,
    required_prefixes: options.prefixes,
    warnings,
    failures,
  };
}

function applyLockMode(gitState, options) {
  const lockPath = gitState.gitDir ? lockPathForGitDir(gitState.gitDir) : null;
  const beforeLockState = readLock(lockPath);
  const beforeSummary = summarizeWorktreeSafety({
    ...gitState,
    lockPath,
    lockState: beforeLockState,
    options,
  });

  if (!beforeSummary.ok) return beforeSummary;

  if (options.mode === 'claim') {
    fs.mkdirSync(path.dirname(lockPath), { recursive: true });
    const existingRecord = beforeLockState.present ? beforeLockState.record : null;
    const payload = buildLockPayload(gitState, options, existingRecord);
    if (beforeLockState.present) {
      writeLock(lockPath, payload);
    } else {
      writeLockExclusive(lockPath, payload);
    }
    const afterLockState = readLock(lockPath);
    return summarizeWorktreeSafety({
      ...gitState,
      lockPath,
      lockState: afterLockState,
      options,
    });
  }

  if (options.mode === 'release') {
    fs.unlinkSync(lockPath);
    return {
      ...beforeSummary,
      ok: true,
      lock: {
        ...beforeSummary.lock,
        present: false,
        same_owner: false,
        same_task: false,
        stale: false,
      },
      warnings: [...beforeSummary.warnings, 'worktree lock released'],
      failures: [],
    };
  }

  return beforeSummary;
}

function inspectRepository(cwd, options = {}) {
  const gitState = inspectGitState(cwd);
  if (gitState.missingGitRepository || gitState.gitFailures.length > 0 || !gitState.gitDir) {
    return summarizeWorktreeSafety({
      ...gitState,
      lockPath: null,
      lockState: { present: false, record: null, parseError: null },
      options,
    });
  }
  return applyLockMode(gitState, options);
}

function printHelp() {
  console.log(`Usage:
  node build-scripts/ci/check-agent-worktree-safety.js --claim --task <task-id> --agent <agent-id>
  node build-scripts/ci/check-agent-worktree-safety.js --check --task <task-id> --agent <agent-id>
  node build-scripts/ci/check-agent-worktree-safety.js --release --task <task-id> --agent <agent-id>
  node build-scripts/ci/check-agent-worktree-safety.js --require-prefix codex/,agent/
  node build-scripts/ci/check-agent-worktree-safety.js --require-clean
  node build-scripts/ci/check-agent-worktree-safety.js --allow-anchor-read-only
  node build-scripts/ci/check-agent-worktree-safety.js --worktree C:/wt/task/4veco-lessen
`);
}

function runCli(argv) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    console.error(`Agent worktree-safety check failed: ${error.message}`);
    process.exit(2);
  }

  if (options.help) {
    printHelp();
    return;
  }

  const summary = inspectRepository(options.worktreePath || process.cwd(), options);
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.ok) process.exit(1);
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  LOCK_SCHEMA,
  LOCK_FILENAME,
  DEFAULT_ANCHOR_CLONES,
  DEFAULT_STALE_WARNING_MS,
  parseArgs,
  lockPathForGitDir,
  readLock,
  buildLockPayload,
  writeLockExclusive,
  summarizeWorktreeSafety,
  applyLockMode,
  inspectGitState,
  inspectRepository,
};
