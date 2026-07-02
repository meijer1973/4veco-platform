#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function gitValue(root, args) {
  const result = spawnSync('git', args, {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status !== 0) return null;
  return result.stdout.trim();
}

function gitLines(root, args) {
  const output = gitValue(root, args);
  if (output === null) return null;
  return output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function resolveLessenRoot(platformRoot, env = process.env) {
  if (env.FOURVECO_LESSEN_ROOT) return path.resolve(env.FOURVECO_LESSEN_ROOT);
  const sibling = path.resolve(platformRoot, '..', '4veco-lessen');
  return fs.existsSync(sibling) ? sibling : null;
}

function normalizeGitPath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function isGeneratedIndexPath(filePath) {
  const normalized = normalizeGitPath(filePath);
  return normalized === 'reports/url-index.md'
    || /^reports\/github-agent-index(?:-[^/]+)?\.(?:json|md)$/.test(normalized);
}

function isGeneratedIndexOnlyTail(repoRoot, parent, head) {
  const changedPaths = gitLines(repoRoot, ['diff', '--name-only', `${parent}..${head}`]);
  return Array.isArray(changedPaths)
    && changedPaths.length > 0
    && changedPaths.every(isGeneratedIndexPath);
}

function checkIndex({ label, indexPath, repoRoot, required = true }) {
  if (!repoRoot || !fs.existsSync(repoRoot)) {
    return required
      ? { label, ok: false, skipped: false, failures: [`${label} repo root not found`] }
      : { label, ok: true, skipped: true, failures: [], warnings: [`${label} repo root not available; skipped`] };
  }
  if (!fs.existsSync(indexPath)) {
    return required
      ? { label, ok: false, skipped: false, failures: [`${label} index missing: ${indexPath}`] }
      : { label, ok: true, skipped: true, failures: [], warnings: [`${label} index missing; skipped`] };
  }

  const head = gitValue(repoRoot, ['rev-parse', 'HEAD']);
  if (!head) {
    return { label, ok: false, skipped: false, failures: [`${label} HEAD could not be read`] };
  }

  const index = readJson(indexPath);
  const sourceCommit = String(index.source_commit || '').trim();
  const failures = [];
  const warnings = [];
  let accepted_parent_generated_tail = false;
  if (!sourceCommit) failures.push(`${label} index has no source_commit`);
  else if (sourceCommit !== head) {
    const parent = gitValue(repoRoot, ['rev-parse', 'HEAD^']);
    if (parent && sourceCommit === parent && isGeneratedIndexOnlyTail(repoRoot, parent, head)) {
      accepted_parent_generated_tail = true;
      warnings.push(`${label} index source_commit matches HEAD^ and HEAD only changes generated index files`);
    } else {
      failures.push(`${label} index source_commit ${sourceCommit} does not match HEAD ${head}`);
    }
  }

  return {
    label,
    ok: failures.length === 0,
    skipped: false,
    failures,
    warnings,
    source_commit: sourceCommit,
    head,
    accepted_parent_generated_tail,
  };
}

function checkAgentIndexFreshness(options = {}) {
  const platformRoot = options.platformRoot || path.resolve(__dirname, '..', '..');
  const reportsDir = options.reportsDir || path.join(platformRoot, 'reports');
  const lessenRoot = options.lessenRoot === undefined
    ? resolveLessenRoot(platformRoot, options.env || process.env)
    : options.lessenRoot;

  const checks = [
    checkIndex({
      label: '4veco-platform',
      indexPath: path.join(reportsDir, 'github-agent-index-platform.json'),
      repoRoot: platformRoot,
      required: true,
    }),
    checkIndex({
      label: '4veco-lessen',
      indexPath: path.join(reportsDir, 'github-agent-index-lessen.json'),
      repoRoot: lessenRoot,
      required: false,
    }),
  ];

  return {
    ok: checks.every((check) => check.ok),
    checks,
    failures: checks.flatMap((check) => check.failures || []),
    warnings: checks.flatMap((check) => check.warnings || []),
  };
}

function runCli() {
  const summary = checkAgentIndexFreshness();
  console.log(JSON.stringify(summary, null, 2));
  return summary.ok ? 0 : 1;
}

if (require.main === module) {
  process.exit(runCli());
}

module.exports = {
  resolveLessenRoot,
  isGeneratedIndexPath,
  isGeneratedIndexOnlyTail,
  checkIndex,
  checkAgentIndexFreshness,
  runCli,
};
