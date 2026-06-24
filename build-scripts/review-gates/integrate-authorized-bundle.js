#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  fetchBundleAuthorizationComment,
  validateBundleAuthorizationRecord,
} = require('./check-human-bundle-authorization');
const { validateCompatibilityProof } = require('./cross-repo-bundle-compatibility');
const { readinessCommentFromComments } = require('./integrate-authorized-pr');
const { collectReviewThreadState } = require('./review-pr-readiness');
const { readEvidence, validateEvidence } = require('../ci/platform-ci-evidence');

const PLATFORM_REPO = 'meijer1973/4veco-platform';
const LESSON_REPO = 'meijer1973/4veco-lessen';
const READY_READINESS_ROUTES = new Set(['READY_FOR_LEAD_ONLY', 'READY_FOR_HUMAN_REVIEW']);

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

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
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

function listIssueComments(repo, prNumber) {
  const comments = [];
  for (let page = 1; page <= 20; page += 1) {
    const raw = runGh(['api', `repos/${repo}/issues/${prNumber}/comments?per_page=100&page=${page}`]);
    const pageComments = JSON.parse(raw);
    if (!Array.isArray(pageComments)) throw new Error('issue comments response must be an array');
    comments.push(...pageComments);
    if (pageComments.length < 100) return comments;
  }
  throw new Error('too_many_issue_comments_to_scan_for_readiness_comment');
}

function fetchReadinessComment(repo, prNumber, headSha) {
  return readinessCommentFromComments(listIssueComments(repo, prNumber), repo, prNumber, headSha);
}

function fetchReviewThreadState(repo, prNumber) {
  return collectReviewThreadState(repo, prNumber, runGh);
}

function repoPermissionOk(repoInfo) {
  const permissions = (repoInfo && repoInfo.permissions) || {};
  return permissions.admin === true || permissions.maintain === true || permissions.push === true;
}

function preflightCrossRepoPermissions(options = {}) {
  if (options.dryRun) return { ok: true, dry_run: true };
  const repos = [PLATFORM_REPO, LESSON_REPO].map((repo) => {
    const info = JSON.parse(runGh(['api', `repos/${repo}`]));
    return {
      repo,
      permissions: info.permissions || null,
      ok: repoPermissionOk(info),
    };
  });
  const failures = repos.filter((item) => !item.ok).map((item) => `${item.repo}:missing_push_permission`);
  return {
    ok: failures.length === 0,
    repos,
    failures,
  };
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

function selectLatestRunForHead(runs, headSha, options = {}) {
  const minDatabaseId = Number(options.minDatabaseId || 0);
  return (runs || [])
    .filter((run) => run.headSha === headSha && Number(run.databaseId || 0) > minDatabaseId)
    .sort((a, b) => Number(b.databaseId || 0) - Number(a.databaseId || 0))[0] || null;
}

function findMainWorkflowRun(repo, headSha, options = {}) {
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
  return selectLatestRunForHead(JSON.parse(raw) || [], headSha, options);
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
  return selectLatestRunForHead(JSON.parse(raw) || [], headSha, options);
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

function findFileRecursive(root, fileName) {
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.name === fileName) return full;
    }
  }
  return null;
}

function downloadPlatformCiEvidence(runId, options = {}) {
  if (options.dryRun) return { ok: true, dry_run: true };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `platform-ci-${runId}-`));
  runGh([
    'run',
    'download',
    String(runId),
    '--repo',
    PLATFORM_REPO,
    '--name',
    'platform-ci-diagnostics',
    '--dir',
    dir,
  ]);
  const evidencePath = findFileRecursive(dir, 'platform-ci-evidence.json');
  if (!evidencePath) return { ok: false, failure: 'platform_ci_evidence_missing', run_id: runId };
  const evidence = readEvidence(evidencePath);
  validateEvidence(evidence);
  return {
    ok: true,
    run_id: runId,
    path: evidencePath,
    sha256: sha256File(evidencePath),
    evidence,
  };
}

function validatePlatformCiEvidence(evidence, expected = {}) {
  const failures = [];
  const item = evidence || {};
  try {
    validateEvidence(item);
  } catch (error) {
    failures.push(error.message);
  }
  if (expected.platformSha && item.platform && item.platform.head_sha !== expected.platformSha) {
    failures.push(`platform_head_mismatch: expected ${expected.platformSha}`);
  }
  if (expected.lessonSha && item.lessen && item.lessen.head_sha !== expected.lessonSha) {
    failures.push(`lesson_head_mismatch: expected ${expected.lessonSha}`);
  }
  return {
    ok: failures.length === 0,
    failures,
    evidence: item,
  };
}

function normalizeRunField(run, snakeKey, camelKey) {
  return run && (run[snakeKey] !== undefined ? run[snakeKey] : run[camelKey]);
}

function validateCompatibilityWorkflowProvenance(run, artifact, compatibility, expected = {}) {
  const failures = [];
  const runId = String(expected.runId || '');
  if (!run || typeof run !== 'object') failures.push('compatibility_workflow_run_missing');
  const runDatabaseId = String(normalizeRunField(run, 'id', 'databaseId') || normalizeRunField(run, 'database_id', 'databaseId') || '');
  if (runId && runDatabaseId && runDatabaseId !== runId) failures.push(`compatibility_run_id_mismatch: expected ${runId}`);
  const pathValue = normalizeRunField(run, 'path', 'path');
  if (pathValue !== '.github/workflows/cross-repo-bundle-compatibility.yml') {
    failures.push('compatibility_workflow_path_mismatch');
  }
  if (normalizeRunField(run, 'event', 'event') !== 'workflow_dispatch') {
    failures.push('compatibility_workflow_event_mismatch');
  }
  if (normalizeRunField(run, 'status', 'status') !== 'completed') failures.push('compatibility_workflow_not_completed');
  if (normalizeRunField(run, 'conclusion', 'conclusion') !== 'success') failures.push('compatibility_workflow_not_successful');
  const runHeadSha = normalizeRunField(run, 'head_sha', 'headSha');
  if (expected.exactMembers && runHeadSha !== expected.exactMembers.platform_base_sha) {
    failures.push(`compatibility_workflow_sha_mismatch: expected ${expected.exactMembers.platform_base_sha}`);
  }
  const artifactName = normalizeRunField(artifact, 'name', 'name');
  if (artifactName !== 'bundle-summary') failures.push('compatibility_artifact_name_mismatch');
  if (artifact && artifact.expired === true) failures.push('compatibility_artifact_expired');
  const artifactDigest = normalizeRunField(artifact, 'digest', 'digest');
  if (typeof artifactDigest !== 'string' || !artifactDigest.trim()) failures.push('compatibility_artifact_digest_missing');
  const provenance = compatibility.provenance || {};
  if (runId && String(provenance.run_id || '') !== runId) failures.push('compatibility_summary_run_id_mismatch');
  if (expected.exactMembers && provenance.workflow_sha && provenance.workflow_sha !== expected.exactMembers.platform_base_sha) {
    failures.push(`compatibility_summary_workflow_sha_mismatch: expected ${expected.exactMembers.platform_base_sha}`);
  }
  if (provenance.event_name && provenance.event_name !== 'workflow_dispatch') {
    failures.push('compatibility_summary_event_mismatch');
  }
  const inputs = provenance.inputs || {};
  if (expected.bundleId && inputs.bundle_id && inputs.bundle_id !== expected.bundleId) {
    failures.push(`compatibility_input_bundle_id_mismatch: expected ${expected.bundleId}`);
  }
  for (const [key, expectedSha] of Object.entries((expected && expected.exactMembers) || {})) {
    if (inputs[key] && inputs[key] !== expectedSha) {
      failures.push(`compatibility_input_${key}_mismatch: expected ${expectedSha}`);
    }
  }
  return {
    ok: failures.length === 0,
    failures,
    run: run || null,
    artifact: artifact || null,
  };
}

function fetchCompatibilityArtifact(runId) {
  const raw = runGh(['api', `repos/${PLATFORM_REPO}/actions/runs/${runId}/artifacts`]);
  const artifacts = JSON.parse(raw).artifacts || [];
  return artifacts.find((artifact) => artifact.name === 'bundle-summary') || null;
}

function verifyCompatibilityWorkflowRun(runId, compatibility, expected = {}, options = {}) {
  if (!runId) {
    return { ok: false, failures: ['compatibility_workflow_run_id_required'] };
  }
  if (options.dryRun) return { ok: true, dry_run: true, run_id: String(runId) };
  const run = JSON.parse(runGh(['api', `repos/${PLATFORM_REPO}/actions/runs/${runId}`]));
  const artifact = fetchCompatibilityArtifact(runId);
  return validateCompatibilityWorkflowProvenance(run, artifact, compatibility, {
    runId: String(runId),
    bundleId: expected.bundleId,
    exactMembers: expected.exactMembers,
  });
}

function verifyPlatformCiRun(run, expected = {}, options = {}) {
  if (!run || run.status !== 'completed') return { ok: false, failure: 'platform_ci_run_not_completed', run };
  if (run.conclusion !== 'success') return { ok: false, failure: 'platform_ci_run_not_successful', run };
  if (!expected.platformSha && !expected.lessonSha) return { ok: true, run };
  const downloaded = downloadPlatformCiEvidence(run.databaseId, options);
  if (!downloaded.ok) return { ok: false, failure: downloaded.failure, run, downloaded };
  const evidence = validatePlatformCiEvidence(downloaded.evidence, expected);
  return {
    ok: evidence.ok,
    failure: evidence.ok ? null : 'platform_ci_evidence_mismatch',
    run,
    artifact: {
      path: downloaded.path,
      sha256: downloaded.sha256,
    },
    evidence,
  };
}

function waitForPlatformMainCi(headSha, options = {}) {
  if (options.dryRun) return { ok: true, dry_run: true, head_sha: headSha };
  const timeoutSeconds = Number(options.timeoutSeconds || 1800);
  const pollSeconds = Number(options.pollSeconds || 20);
  const deadline = Date.now() + timeoutSeconds * 1000;
  let lastRun = null;
  while (Date.now() <= deadline) {
    lastRun = findMainWorkflowRun(PLATFORM_REPO, headSha, options);
    if (lastRun && lastRun.status === 'completed') {
      return {
        head_sha: headSha,
        ...verifyPlatformCiRun(lastRun, {
          platformSha: options.expectedPlatformSha,
          lessonSha: options.expectedLessonSha,
        }, options),
      };
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
      return {
        head_sha: headSha,
        ...verifyPlatformCiRun(lastRun, {
          platformSha: options.expectedPlatformSha || headSha,
          lessonSha: options.expectedLessonSha,
        }, options),
      };
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
  return waitForPlatformHeadCi(pr.headRefOid, {
    ...options,
    minDatabaseId,
    expectedPlatformSha: pr.headRefOid,
  });
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

function validateReadiness(readiness) {
  if (!readiness || readiness.ok !== true) return ['exact_head_readiness_missing_or_invalid'];
  if (!READY_READINESS_ROUTES.has(readiness.route)) return ['exact_head_readiness_not_ready'];
  return [];
}

function validateReviewThreadState(reviewThreads) {
  if (!reviewThreads || reviewThreads.available !== true) return ['review_threads_unavailable'];
  if (Number(reviewThreads.unresolved_count || 0) > 0) return ['unresolved_review_threads'];
  if (Number(reviewThreads.requested_changes_count || 0) > 0) return ['requested_changes_unresolved'];
  return [];
}

function validateMemberPreflight(repo, pr, expectedHeadSha, deps, options = {}) {
  const stateFailures = deps.validatePrState(pr, expectedHeadSha, options);
  const readiness = deps.fetchReadinessComment(repo, pr.number, expectedHeadSha);
  const reviewThreads = deps.fetchReviewThreadState(repo, pr.number);
  return {
    ok:
      stateFailures.length === 0 &&
      validateReadiness(readiness).length === 0 &&
      validateReviewThreadState(reviewThreads).length === 0,
    failures: [
      ...stateFailures,
      ...validateReadiness(readiness),
      ...validateReviewThreadState(reviewThreads),
    ],
    readiness,
    reviewThreads,
  };
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
    fetchReadinessComment,
    fetchReviewThreadState,
    latestWorkflowRunDatabaseId,
    preflightCrossRepoPermissions,
    validatePrState,
    recomputeCompatibility: (record, exactMembers = {}) => {
      if (!options.compatibilityProofPath) throw new Error('--compatibility-proof is required');
      const compatibility = validateCompatibilityProof(readJson(options.compatibilityProofPath), {
        bundleId: options.bundleId || (record && record.bundle_id) || undefined,
        exactMembers,
      });
      const verifier = options.verifyCompatibilityWorkflowRun || verifyCompatibilityWorkflowRun;
      const provenance = verifier(options.compatibilityRunId, compatibility, {
        bundleId: options.bundleId || (record && record.bundle_id) || undefined,
        exactMembers,
      }, options);
      return {
        ...compatibility,
        provenance_check: provenance,
        ok: compatibility.ok && provenance.ok,
        failures: [...compatibility.failures, ...((provenance && provenance.failures) || [])],
      };
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
  if (options.requireCrossRepoPermissions === true) {
    const permissions = deps.preflightCrossRepoPermissions(options);
    if (!permissions.ok) return { ok: false, phase: 'cross_repo_permissions', permissions };
  }
  const lessonMember = memberByRepo(record, LESSON_REPO);
  if (!lessonMember) return { ok: false, phase: 'authorization', failures: ['lesson_member_missing'] };

  const platformMainSha = deps.fetchMainSha(PLATFORM_REPO);
  const lessonMainSha = deps.fetchMainSha(LESSON_REPO);
  const platformPr = deps.fetchPr(PLATFORM_REPO, record.controller.pr_number);
  const lessonPr = deps.fetchPr(LESSON_REPO, lessonMember.pr_number);
  const platformPreflight = validateMemberPreflight(
    PLATFORM_REPO,
    platformPr,
    record.controller.reviewed_payload_head_sha,
    deps,
    { requireValidatePlatform: false }
  );
  const lessonPreflight = validateMemberPreflight(
    LESSON_REPO,
    lessonPr,
    lessonMember.reviewed_payload_head_sha,
    deps,
    { requireValidatePlatform: false }
  );
  const preflight = [
    ...platformPreflight.failures.map((failure) => `platform:${failure}`),
    ...lessonPreflight.failures.map((failure) => `lesson:${failure}`),
  ];
  if (preflight.length > 0) {
    return {
      ok: false,
      phase: 'preflight',
      failures: preflight,
      platform_pr: platformPr,
      lesson_pr: lessonPr,
      platform_preflight: platformPreflight,
      lesson_preflight: lessonPreflight,
    };
  }

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
  const expectedMain = {
    [PLATFORM_REPO]: platformMainSha,
    [LESSON_REPO]: lessonMainSha,
  };
  for (const [index, member] of steps.entries()) {
    const repo = member.repository;
    const currentPlatformMain = deps.fetchMainSha(PLATFORM_REPO);
    const currentLessonMain = deps.fetchMainSha(LESSON_REPO);
    if (currentPlatformMain !== expectedMain[PLATFORM_REPO] || currentLessonMain !== expectedMain[LESSON_REPO]) {
      return {
        ok: false,
        phase: 'base_changed_before_merge',
        failures: ['compatibility_recompute_required'],
        expected_main: { ...expectedMain },
        current_main: {
          [PLATFORM_REPO]: currentPlatformMain,
          [LESSON_REPO]: currentLessonMain,
        },
        merges,
      };
    }
    let pr = deps.fetchPr(repo, member.pr_number);
    if (repo === PLATFORM_REPO && index > 0 && steps[index - 1].repository === LESSON_REPO) {
      const refreshed = deps.refreshPlatformPrCi(pr, {
        ...options,
        expectedLessonSha: currentLessonMain,
      });
      if (!refreshed.ok) return { ok: false, phase: 'platform_pr_ci_refresh', refreshed, merges };
      pr = deps.fetchPr(repo, member.pr_number);
    }
    const preMerge = validateMemberPreflight(repo, pr, member.reviewed_payload_head_sha, deps, {
      requireValidatePlatform: repo === PLATFORM_REPO,
    });
    if (!preMerge.ok) return { ok: false, phase: 'pre_merge', repo, failures: preMerge.failures, pr, pre_merge: preMerge };
    const merge = deps.mergePr(repo, member.pr_number, member.reviewed_payload_head_sha, options);
    const merged = validateMergedPr(repo, member.pr_number, deps.fetchMergedPr(repo, member.pr_number));
    if (!merged.ok) return { ok: false, phase: 'merge_verification', merge, merged };
    merges.push({ repo, pr_number: member.pr_number, merge, ...merged });
    expectedMain[repo] = deps.fetchMainSha(repo);
    if (index === 0) {
      const expectedPlatformSha = deps.fetchMainSha(PLATFORM_REPO);
      const expectedLessonSha = deps.fetchMainSha(LESSON_REPO);
      const minDatabaseId = deps.latestWorkflowRunDatabaseId(PLATFORM_REPO, expectedPlatformSha);
      deps.triggerPlatformCi(options);
      const intermediateCi = deps.waitForPlatformMainCi(expectedPlatformSha, {
        ...options,
        minDatabaseId,
        expectedPlatformSha,
        expectedLessonSha,
      });
      if (!intermediateCi.ok) return { ok: false, phase: 'intermediate_ci', order, intermediate_ci: intermediateCi, merges };
    }
  }
  const expectedFinalPlatformSha = deps.fetchMainSha(PLATFORM_REPO);
  const expectedFinalLessonSha = deps.fetchMainSha(LESSON_REPO);
  const minDatabaseId = deps.latestWorkflowRunDatabaseId(PLATFORM_REPO, expectedFinalPlatformSha);
  deps.triggerPlatformCi(options);
  const finalCi = deps.waitForPlatformMainCi(expectedFinalPlatformSha, {
    ...options,
    minDatabaseId,
    expectedPlatformSha: expectedFinalPlatformSha,
    expectedLessonSha: expectedFinalLessonSha,
  });
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
      compatibilityRunId: optionValue(argv, '--compatibility-run-id'),
      requireCrossRepoPermissions: flag(argv, '--require-cross-repo-permissions'),
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
  preflightCrossRepoPermissions,
  selectLatestRunForHead,
  validateCompatibilityWorkflowProvenance,
  validatePlatformCiEvidence,
  validatePrState,
};
