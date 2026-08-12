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

function directParents(repoRoot, commit) {
  const line = gitValue(repoRoot, ['rev-list', '--parents', '-n', '1', commit]);
  if (!line) return [];
  return line.split(/\s+/).slice(1).filter(Boolean);
}

function isGitAncestor(repoRoot, ancestor, descendant) {
  const result = spawnSync('git', ['merge-base', '--is-ancestor', ancestor, descendant], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return result.status === 0;
}

function findGeneratedIndexTailRef(repoRoot, sourceCommit, head) {
  const parents = directParents(repoRoot, head);
  const candidates = [head, ...(parents.length > 1 ? parents : [])];
  return candidates.find((candidate) => {
    const parent = gitValue(repoRoot, ['rev-parse', `${candidate}^`]);
    if (parent !== sourceCommit || !isGeneratedIndexOnlyTail(repoRoot, sourceCommit, candidate)) return false;
    if (candidate === head) return true;
    return parents
      .filter((mergeParent) => mergeParent !== candidate)
      .every((mergeParent) => isGitAncestor(repoRoot, mergeParent, sourceCommit));
  }) || null;
}

function checkIndex({
  label,
  indexPath,
  repoRoot,
  required = true,
  sourceRef = 'HEAD',
  expectedSourceBranch = null,
  allowGeneratedIndexTail = sourceRef === 'HEAD',
}) {
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
  const targetCommit = gitValue(repoRoot, ['rev-parse', sourceRef]);
  if (!targetCommit) {
    return { label, ok: false, skipped: false, failures: [`${label} ${sourceRef} could not be read`] };
  }

  const index = readJson(indexPath);
  const sourceCommit = String(index.source_commit || '').trim();
  const failures = [];
  const warnings = [];
  let accepted_parent_generated_tail = false;
  let accepted_generated_index_tail_ref = null;
  if (!sourceCommit) failures.push(`${label} index has no source_commit`);
  else if (sourceCommit !== targetCommit) {
    const generatedTailRef = allowGeneratedIndexTail && head
      ? findGeneratedIndexTailRef(repoRoot, sourceCommit, head)
      : null;
    if (generatedTailRef) {
      accepted_parent_generated_tail = true;
      accepted_generated_index_tail_ref = generatedTailRef;
      warnings.push(`${label} index source_commit precedes generated-index-only ref ${generatedTailRef}`);
    } else {
      failures.push(`${label} index source_commit ${sourceCommit} does not match ${sourceRef} ${targetCommit}`);
    }
  }
  if (expectedSourceBranch && index.source_branch !== expectedSourceBranch) {
    failures.push(`${label} index source_branch ${index.source_branch || 'missing'} does not match ${expectedSourceBranch}`);
  }

  return {
    label,
    ok: failures.length === 0,
    skipped: false,
    failures,
    warnings,
    source_commit: sourceCommit,
    head,
    source_ref: sourceRef,
    target_commit: targetCommit,
    accepted_parent_generated_tail,
    accepted_generated_index_tail_ref,
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
      sourceRef: (options.env || process.env).FOURVECO_LESSEN_SOURCE_REF || 'origin/main',
      expectedSourceBranch: (options.env || process.env).FOURVECO_LESSEN_SOURCE_REF || 'origin/main',
      allowGeneratedIndexTail: false,
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
  directParents,
  isGitAncestor,
  findGeneratedIndexTailRef,
  checkIndex,
  checkAgentIndexFreshness,
  runCli,
};
