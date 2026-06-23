#!/usr/bin/env node
const fs = require('fs');
const { spawnSync } = require('child_process');
const {
  fetchBundleAuthorizationComment,
  validateBundleAuthorizationRecord,
} = require('./check-human-bundle-authorization');
const { validateCompatibilityProof } = require('./cross-repo-bundle-compatibility');

const PLATFORM_REPO = 'meijer1973/4veco-platform';
const LESSON_REPO = 'meijer1973/4veco-lessen';

function fail(message) {
  console.error(`Authorized bundle integration failed: ${message}`);
  process.exit(1);
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (!args[index + 1]) fail(`missing value for ${name}`);
  return args[index + 1];
}

function flag(args, name) {
  return args.includes(name);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function runGh(args, options = {}) {
  if (options.dryRun) return '';
  const result = spawnSync('gh', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    if (options.optional) return null;
    throw new Error(`gh ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return result.stdout;
}

function parseChecks(statusCheckRollup) {
  return (statusCheckRollup || []).map((check) => ({
    name: check.name || check.context || check.workflowName || 'unknown',
    conclusion: check.conclusion || check.status || check.state || null,
  }));
}

function successStatus(value) {
  return /^(success|succeeded|passed|pass|ok)$/i.test(String(value || '').trim());
}

function fetchPr(repo, prNumber) {
  const fields = [
    'number',
    'url',
    'state',
    'isDraft',
    'baseRefName',
    'headRefName',
    'headRefOid',
    'mergeStateStatus',
    'mergeable',
    'statusCheckRollup',
  ].join(',');
  return JSON.parse(runGh(['pr', 'view', String(prNumber), '--repo', repo, '--json', fields]));
}

function fetchMainSha(repo) {
  const raw = runGh(['api', `repos/${repo}/git/ref/heads/main`]);
  return JSON.parse(raw).object.sha;
}

function mergePr(repo, prNumber, headSha, options = {}) {
  if (options.dryRun) return { dry_run: true, repo, prNumber, head_sha: headSha };
  runGh(['pr', 'merge', String(prNumber), '--repo', repo, '--merge', '--match-head-commit', headSha]);
  return { merged: true, repo, prNumber, head_sha: headSha };
}

function fetchMergedPr(repo, prNumber) {
  const fields = ['number', 'state', 'mergedAt', 'mergeCommit', 'headRefOid', 'url'].join(',');
  return JSON.parse(runGh(['pr', 'view', String(prNumber), '--repo', repo, '--json', fields]));
}

function findMainWorkflowRun(repo, headSha) {
  const raw = runGh([
    'run',
    'list',
    '--repo',
    repo,
    '--branch',
    'main',
    '--workflow',
    'platform-ci',
    '--limit',
    '20',
    '--json',
    'databaseId,status,conclusion,headSha,url',
  ]);
  return (JSON.parse(raw) || []).find((run) => run.headSha === headSha) || null;
}

function findWorkflowRunForHead(repo, headSha, options = {}) {
  const raw = runGh([
    'run',
    'list',
    '--repo',
    repo,
    '--workflow',
    'platform-ci',
    '--limit',
    '50',
    '--json',
    'databaseId,status,conclusion,headSha,url',
  ]);
  const minDatabaseId = Number(options.minDatabaseId || 0);
  return (JSON.parse(raw) || [])
    .filter((run) => run.headSha === headSha && Number(run.databaseId || 0) > minDatabaseId)
    .sort((a, b) => Number(b.databaseId || 0) - Number(a.databaseId || 0))[0] || null;
}

function latestWorkflowRunDatabaseId(repo, headSha) {
  const raw = runGh([
    'run',
    'list',
    '--repo',
    repo,
    '--workflow',
    'platform-ci',
    '--limit',
    '50',
    '--json',
    'databaseId,headSha',
  ]);
  return Math.max(
    0,
    ...(JSON.parse(raw) || [])
      .filter((run) => run.headSha === headSha)
      .map((run) => Number(run.databaseId || 0))
  );
}

function triggerPlatformCi(options = {}) {
  if (options.dryRun) return { dry_run: true };
  const raw = runGh(['workflow', 'run', 'platform-ci.yml', '--repo', PLATFORM_REPO, '--ref', 'main']);
  return { triggered: true, output: raw };
}

function triggerPlatformCiForRef(ref, options = {}) {
  if (options.dryRun) return { dry_run: true, ref };
  const raw = runGh(['workflow', 'run', 'platform-ci.yml', '--repo', PLATFORM_REPO, '--ref', ref]);
  return { triggered: true, ref, output: raw };
}

function sleep(ms) {
  if (ms <= 0) return;
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function waitForPlatformMainCi(headSha, options = {}) {
  if (options.dryRun) return { ok: true, dry_run: true, head_sha: headSha };
  const timeoutSeconds = Number(options.timeoutSeconds || 1800);
  const pollSeconds = Number(options.pollSeconds || 20);
  const deadline = Date.now() + timeoutSeconds * 1000;
  let lastRun = null;
  while (Date.now() <= deadline) {
    lastRun = findMainWorkflowRun(PLATFORM_REPO, headSha);
    if (lastRun && lastRun.status === 'completed') {
      return { ok: lastRun.conclusion === 'success', head_sha: headSha, run: lastRun };
    }
    sleep(pollSeconds * 1000);
  }
  return { ok: false, head_sha: headSha, run: lastRun, failure: 'platform_main_ci_timeout' };
}

function waitForPlatformHeadCi(headSha, options = {}) {
  if (options.dryRun) return { ok: true, dry_run: true, head_sha: headSha };
  const timeoutSeconds = Number(options.timeoutSeconds || 1800);
  const pollSeconds = Number(options.pollSeconds || 20);
  const deadline = Date.now() + timeoutSeconds * 1000;
  let lastRun = null;
  while (Date.now() <= deadline) {
    lastRun = findWorkflowRunForHead(PLATFORM_REPO, headSha, options);
    if (lastRun && lastRun.status === 'completed') {
      return { ok: lastRun.conclusion === 'success', head_sha: headSha, run: lastRun };
    }
    sleep(pollSeconds * 1000);
  }
  return { ok: false, head_sha: headSha, run: lastRun, failure: 'platform_head_ci_timeout' };
}

function refreshPlatformPrCi(pr, options = {}) {
  if (options.dryRun) return { ok: true, dry_run: true, head_sha: pr.headRefOid };
  if (!pr || !pr.headRefOid) return { ok: false, failure: 'platform_pr_head_missing' };
  const ref = pr.headRefName || pr.headRefOid;
  const minDatabaseId = latestWorkflowRunDatabaseId(PLATFORM_REPO, pr.headRefOid);
  triggerPlatformCiForRef(ref, options);
  return waitForPlatformHeadCi(pr.headRefOid, { ...options, minDatabaseId });
}


function validatePrState(pr, expectedHeadSha, options = {}) {
  const failures = [];
  if (!pr) failures.push('pr_missing');
  if (pr && pr.state !== 'OPEN') failures.push('pr_not_open');
  if (pr && pr.isDraft === true) failures.push('pr_is_draft');
  if (pr && pr.baseRefName !== 'main') failures.push('pr_base_must_be_main');
  if (pr && pr.headRefOid !== expectedHeadSha) failures.push('pr_head_mismatch');
  if (pr && (pr.mergeable === false || pr.mergeStateStatus === 'DIRTY')) failures.push('merge_conflict');
  if (options.requireValidatePlatform === true) {
    const validatePlatform = parseChecks(pr.statusCheckRollup).find((check) => check.name === 'validate-platform');
    if (!validatePlatform || !successStatus(validatePlatform.conclusion)) {
      failures.push('validate_platform_missing_or_not_successful');
    }
  }
  return failures;
}

function memberByRepo(record, repo) {
  if (record.controller && record.controller.repository === repo) return record.controller;
  return (record.members || []).find((member) => member.repository === repo) || null;
}

function defaultDeps(options = {}) {
  return {
    fetchAuthorization: (repo, commentId, fetchOptions) => fetchBundleAuthorizationComment(repo, commentId, fetchOptions),
    fetchMainSha,
    fetchPr,
    validatePrState,
    recomputeCompatibility: (record, exactMembers = {}) => {
      if (!options.compatibilityProofPath) throw new Error('--compatibility-proof is required');
      return validateCompatibilityProof(readJson(options.compatibilityProofPath), {
        bundleId: options.bundleId || (record && record.bundle_id) || undefined,
        exactMembers,
      });
    },
    mergePr,
    fetchMergedPr,
    triggerPlatformCi,
    waitForPlatformMainCi,
    refreshPlatformPrCi,
  };
}

function validateMergedPr(repo, prNumber, mergedPr) {
  if (mergedPr.state !== 'MERGED' || !mergedPr.mergeCommit || !mergedPr.mergeCommit.oid) {
    return { ok: false, repo, prNumber, failure: 'merge_commit_not_observable', merged_pr: mergedPr };
  }
  return { ok: true, repo, prNumber, merge_commit: mergedPr.mergeCommit.oid, merged_pr: mergedPr };
}

function mergeStepForOrder(order, record) {
  const lesson = memberByRepo(record, LESSON_REPO);
  const platform = record.controller;
  if (order === 'lesson-first') return [lesson, platform];
  return [platform, lesson];
}

function integrateBundle(options = {}) {
  const deps = { ...defaultDeps(options), ...(options.deps || {}) };
  const controllerRepo = options.repo || PLATFORM_REPO;
  const controllerPrNumber = Number(options.prNumber);
  if (!Number.isInteger(controllerPrNumber) || controllerPrNumber < 1) {
    throw new Error('--pr must be a positive integer');
  }
  const auth =
    options.authorization ||
    deps.fetchAuthorization(controllerRepo, options.authorizationCommentId, { expectedPr: controllerPrNumber });
  const record = auth.record || auth;
  const authorization = validateBundleAuthorizationRecord(record, {
    expectedBundleId: options.bundleId || record.bundle_id,
    expectedControllerRepo: controllerRepo,
    expectedControllerPr: controllerPrNumber,
  });
  if (!authorization.ok) return { ok: false, phase: 'authorization', authorization };
  const lessonMember = memberByRepo(record, LESSON_REPO);
  if (!lessonMember) return { ok: false, phase: 'authorization', failures: ['lesson_member_missing'] };

  const platformMainSha = deps.fetchMainSha(PLATFORM_REPO);
  const lessonMainSha = deps.fetchMainSha(LESSON_REPO);
  const platformPr = deps.fetchPr(PLATFORM_REPO, record.controller.pr_number);
  const lessonPr = deps.fetchPr(LESSON_REPO, lessonMember.pr_number);
  const preflight = [
    ...deps.validatePrState(platformPr, record.controller.reviewed_payload_head_sha, { requireValidatePlatform: false }).map((failure) => `platform:${failure}`),
    ...deps.validatePrState(lessonPr, lessonMember.reviewed_payload_head_sha, { requireValidatePlatform: false }).map((failure) => `lesson:${failure}`),
  ];
  if (preflight.length > 0) return { ok: false, phase: 'preflight', failures: preflight, platform_pr: platformPr, lesson_pr: lessonPr };

  const compatibility = deps.recomputeCompatibility(record, {
    platform_base_sha: platformMainSha,
    platform_candidate_sha: record.controller.reviewed_payload_head_sha,
    lesson_base_sha: lessonMainSha,
    lesson_candidate_sha: lessonMember.reviewed_payload_head_sha,
  });
  if (!compatibility.ok) return { ok: false, phase: 'compatibility', compatibility };
  const order = record.merge_order === 'CI_SELECTED' ? compatibility.recommended_merge_order : record.merge_order;
  if (!compatibility.permitted_merge_orders.includes(order)) {
    return { ok: false, phase: 'merge_order', compatibility, requested_order: order };
  }
  if (options.noMerge) {
    return { ok: true, phase: 'authorized_no_merge', order, compatibility, platform_main_sha: platformMainSha, lesson_main_sha: lessonMainSha };
  }

  const steps = mergeStepForOrder(order, record);
  const merges = [];
  for (const [index, member] of steps.entries()) {
    const repo = member.repository;
    let pr = deps.fetchPr(repo, member.pr_number);
    if (repo === PLATFORM_REPO && index > 0 && steps[index - 1].repository === LESSON_REPO) {
      const refreshed = deps.refreshPlatformPrCi(pr, options);
      if (!refreshed.ok) return { ok: false, phase: 'platform_pr_ci_refresh', refreshed, merges };
      pr = deps.fetchPr(repo, member.pr_number);
    }
    const failures = deps.validatePrState(pr, member.reviewed_payload_head_sha, {
      requireValidatePlatform: repo === PLATFORM_REPO,
    });
    if (failures.length > 0) return { ok: false, phase: 'pre_merge', repo, failures, pr };
    const merge = deps.mergePr(repo, member.pr_number, member.reviewed_payload_head_sha, options);
    const merged = validateMergedPr(repo, member.pr_number, deps.fetchMergedPr(repo, member.pr_number));
    if (!merged.ok) return { ok: false, phase: 'merge_verification', merge, merged };
    merges.push({ repo, pr_number: member.pr_number, merge, ...merged });
    if (index === 0) {
      deps.triggerPlatformCi(options);
      const intermediateHead = deps.fetchMainSha(PLATFORM_REPO);
      const intermediateCi = deps.waitForPlatformMainCi(intermediateHead, options);
      if (!intermediateCi.ok) return { ok: false, phase: 'intermediate_ci', order, intermediate_ci: intermediateCi, merges };
    }
  }
  deps.triggerPlatformCi(options);
  const finalPlatformMainSha = deps.fetchMainSha(PLATFORM_REPO);
  const finalCi = deps.waitForPlatformMainCi(finalPlatformMainSha, options);
  if (!finalCi.ok) return { ok: false, phase: 'final_ci', order, final_ci: finalCi, merges };
  return { ok: true, phase: 'merged_bundle', order, compatibility, merges, final_ci: finalCi };
}

function runCli(argv) {
  const prNumber = optionValue(argv, '--pr');
  const authorizationCommentId = optionValue(argv, '--authorization-comment-id');
  if (!prNumber) fail('--pr is required');
  if (!authorizationCommentId) fail('--authorization-comment-id is required');
  let result;
  try {
    result = integrateBundle({
      repo: optionValue(argv, '--repo') || PLATFORM_REPO,
      prNumber,
      authorizationCommentId,
      bundleId: optionValue(argv, '--bundle-id'),
      compatibilityProofPath: optionValue(argv, '--compatibility-proof'),
      dryRun: flag(argv, '--dry-run'),
      noMerge: flag(argv, '--no-merge'),
      timeoutSeconds: Number(optionValue(argv, '--timeout-seconds') || 1800),
      pollSeconds: Number(optionValue(argv, '--poll-seconds') || 20),
    });
  } catch (error) {
    fail(error.message);
  }
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  LESSON_REPO,
  PLATFORM_REPO,
  integrateBundle,
  validatePrState,
};
