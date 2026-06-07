#!/usr/bin/env node
const path = require('path');
const { spawnSync } = require('child_process');

/*
HOW TO ADAPT:
- This checker is a local/agent preflight. It is intentionally not wired into
  default platform-ci because GitHub Actions PR checkouts can use merge refs or
  detached HEAD.
- Keep repository-state parsing pure and tested. The CLI should only read Git
  state and print a JSON summary; it must not mutate files or Git settings.
*/

const DEFAULT_PREFIXES = ['codex/', 'agent/'];

function splitLines(text) {
  return String(text || '')
    .split(/\r?\n/)
    .filter((line) => line.length > 0);
}

function parsePrefixList(value) {
  if (!value) return DEFAULT_PREFIXES;
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseArgs(argv) {
  const options = {
    allowMainReadOnly: false,
    requireClean: false,
    requirePrefix: false,
    prefixes: DEFAULT_PREFIXES,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--allow-main-read-only') {
      options.allowMainReadOnly = true;
    } else if (arg === '--require-clean') {
      options.requireClean = true;
    } else if (arg === '--require-prefix') {
      const value = argv[index + 1];
      if (!value) throw new Error('missing value for --require-prefix');
      options.requirePrefix = true;
      options.prefixes = parsePrefixList(value);
      index += 1;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }

  return options;
}

function parseStatusPorcelain(statusText) {
  const lines = splitLines(statusText);
  const branchLine = lines[0] && lines[0].startsWith('## ') ? lines[0] : '';
  const dirtyLines = branchLine ? lines.slice(1) : lines;
  const branchStatus = branchLine.replace(/^##\s*/, '');
  const trackingMatch = branchStatus.match(/\[(.+)\]\s*$/);
  const trackingText = trackingMatch ? trackingMatch[1] : '';
  const aheadMatch = trackingText.match(/ahead\s+(\d+)/);
  const behindMatch = trackingText.match(/behind\s+(\d+)/);
  const ahead = aheadMatch ? Number(aheadMatch[1]) : 0;
  const behind = behindMatch ? Number(behindMatch[1]) : 0;

  return {
    branch_line: branchLine || null,
    dirty: dirtyLines.length > 0,
    dirty_count: dirtyLines.length,
    ahead,
    behind,
    diverged: ahead > 0 && behind > 0,
    detached_head: /^HEAD \(no branch\)/.test(branchStatus) || /^HEAD detached/.test(branchStatus),
  };
}

function repositoryName(repositoryRoot) {
  if (!repositoryRoot) return null;
  return path.basename(path.resolve(repositoryRoot));
}

function hasRequiredPrefix(branch, prefixes) {
  return Boolean(branch && prefixes.some((prefix) => branch.startsWith(prefix)));
}

function summarizeBranchSafety(input) {
  const options = {
    allowMainReadOnly: false,
    requireClean: false,
    requirePrefix: false,
    prefixes: DEFAULT_PREFIXES,
    ...(input.options || {}),
  };
  const status = parseStatusPorcelain(input.statusText || '');
  const branch = input.branch || '';
  const detachedHead = !branch || status.detached_head;
  const onMain = branch === 'main';
  const prefixOk = hasRequiredPrefix(branch, options.prefixes);
  const warnings = [];
  const failures = [];

  if (input.missingGitRepository) {
    failures.push('missing Git repository');
  } else if (detachedHead) {
    failures.push('HEAD is detached');
  } else if (onMain) {
    if (!options.allowMainReadOnly) {
      failures.push('current branch is main');
    } else {
      warnings.push('on main only allowed because --allow-main-read-only was passed');
      if (status.dirty) failures.push('main has uncommitted changes');
      if (status.ahead > 0) failures.push('main has local commits ahead of remote');
    }
  }

  if (!input.missingGitRepository && !detachedHead && !onMain && !prefixOk) {
    const message = `branch name does not start with required prefix: ${options.prefixes.join(',')}`;
    if (options.requirePrefix) failures.push(message);
    else warnings.push(message);
  }

  if (status.diverged) failures.push('local branch has diverged from remote');
  if (status.ahead > 0 && !status.diverged && !(onMain && options.allowMainReadOnly)) {
    warnings.push(`local branch is ahead of remote by ${status.ahead}`);
  }
  if (status.behind > 0 && !status.diverged) {
    warnings.push(`local branch is behind remote by ${status.behind}`);
  }
  if (status.dirty) {
    if (options.requireClean) failures.push('working tree is dirty');
    else warnings.push(`working tree is dirty (${status.dirty_count} item${status.dirty_count === 1 ? '' : 's'})`);
  }

  return {
    ok: failures.length === 0,
    repository: repositoryName(input.repositoryRoot),
    branch: branch || null,
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

function runGit(args, cwd) {
  return spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
  });
}

function inspectRepository(cwd, options = {}) {
  const rootResult = runGit(['rev-parse', '--show-toplevel'], cwd);
  if (rootResult.status !== 0) {
    return summarizeBranchSafety({
      repositoryRoot: null,
      branch: null,
      statusText: '',
      missingGitRepository: true,
      options,
    });
  }

  const repositoryRoot = rootResult.stdout.trim();
  const branchResult = runGit(['branch', '--show-current'], cwd);
  const statusResult = runGit(['status', '--porcelain=v1', '--branch'], cwd);

  if (branchResult.status !== 0) {
    return {
      ok: false,
      repository: repositoryName(repositoryRoot),
      branch: null,
      on_main: false,
      detached_head: false,
      dirty: false,
      dirty_count: 0,
      ahead: 0,
      behind: 0,
      diverged: false,
      prefix_ok: false,
      required_prefixes: options.prefixes || DEFAULT_PREFIXES,
      warnings: [],
      failures: [`unable to read current branch: ${(branchResult.stderr || '').trim()}`],
    };
  }

  if (statusResult.status !== 0) {
    return {
      ok: false,
      repository: repositoryName(repositoryRoot),
      branch: branchResult.stdout.trim() || null,
      on_main: branchResult.stdout.trim() === 'main',
      detached_head: false,
      dirty: false,
      dirty_count: 0,
      ahead: 0,
      behind: 0,
      diverged: false,
      prefix_ok: hasRequiredPrefix(branchResult.stdout.trim(), options.prefixes || DEFAULT_PREFIXES),
      required_prefixes: options.prefixes || DEFAULT_PREFIXES,
      warnings: [],
      failures: [`unable to read git status: ${(statusResult.stderr || '').trim()}`],
    };
  }

  return summarizeBranchSafety({
    repositoryRoot,
    branch: branchResult.stdout.trim(),
    statusText: statusResult.stdout,
    options,
  });
}

function printHelp() {
  console.log(`Usage:
  node build-scripts/ci/check-agent-branch-safety.js
  node build-scripts/ci/check-agent-branch-safety.js --allow-main-read-only
  node build-scripts/ci/check-agent-branch-safety.js --require-prefix codex/,agent/
  node build-scripts/ci/check-agent-branch-safety.js --require-clean
`);
}

function runCli(argv) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    console.error(`Agent branch-safety check failed: ${error.message}`);
    process.exit(2);
  }

  if (options.help) {
    printHelp();
    return;
  }

  const summary = inspectRepository(process.cwd(), options);
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.ok) process.exit(1);
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  DEFAULT_PREFIXES,
  parseArgs,
  parsePrefixList,
  parseStatusPorcelain,
  summarizeBranchSafety,
  inspectRepository,
};
