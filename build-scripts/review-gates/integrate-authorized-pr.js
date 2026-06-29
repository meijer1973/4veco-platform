#!/usr/bin/env node
const fs = require('fs');
const { spawnSync } = require('child_process');
const {
  fetchAuthorizationComment,
  validateAuthorizationRecord,
} = require('./check-human-payload-authorization');
const { summarizeLineage } = require('./check-integration-lineage');
const {
  contextsFromProtection,
  summarizeProtection,
} = require('../ci/check-branch-protection');
const { applyLiveDecision } = require('./apply-pr-readiness-decision');
const { parseRenderedDecisionMarkdown } = require('./pr-readiness-router');
const { runReview } = require('./review-pr-readiness');

const DEFAULT_REPO = 'meijer1973/4veco-platform';
const INTEGRATION_CONTEXT = 'integration-authorized';
const READY_READINESS_ROUTES = new Set(['READY_FOR_LEAD_ONLY', 'READY_FOR_HUMAN_REVIEW']);

function fail(message) {
  console.error(`Authorized PR integration failed: ${message}`);
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

function runGh(args, options = {}) {
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

function successStatus(value) {
  return /^(success|succeeded|passed|pass|ok)$/i.test(String(value || '').trim());
}

function parseChecks(statusCheckRollup) {
  return (statusCheckRollup || []).map((check) => ({
    name: check.name || check.context || check.workflowName || 'unknown',
    conclusion: check.conclusion || check.status || check.state || null,
    status: check.status || check.state || check.conclusion || null,
    details_url: check.detailsUrl || check.targetUrl || null,
  }));
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
    'reviewDecision',
    'statusCheckRollup',
  ].join(',');
  return JSON.parse(runGh(['pr', 'view', String(prNumber), '--repo', repo, '--json', fields]));
}

function fetchMainSha(repo) {
  const raw = runGh(['api', `repos/${repo}/git/ref/heads/main`]);
  return JSON.parse(raw).object.sha;
}

function summarizeIntegrationBranchProtection(protection, options = {}) {
  const requireIntegrationAuthorized =
    options.requireIntegrationAuthorized === true ||
    contextsFromProtection(protection).includes(INTEGRATION_CONTEXT);
  return {
    ...summarizeProtection(protection, {
      ...options,
      requireIntegrationAuthorized,
    }),
    integration_authorized_required: requireIntegrationAuthorized,
  };
}

function fetchBranchProtectionSummary(repo, options = {}, runner = runGh) {
  const rawProtection = runner(['api', `repos/${repo}/branches/main/protection`]);
  const reviewRead = runner(['api', `repos/${repo}/branches/main/protection/required_pull_request_reviews`], {
    optional: true,
  });
  return summarizeIntegrationBranchProtection(JSON.parse(rawProtection), {
    repo,
    branch: 'main',
    requireIntegrationAuthorized: options.requireIntegrationAuthorized === true,
    pullRequestReviews: reviewRead ? JSON.parse(reviewRead) : null,
    pullRequestReviewFetch: reviewRead
      ? { status: 'available', limitation: null }
      : { status: 'unavailable', limitation: 'pull-request review endpoint unavailable' },
  });
}

function isHeadCurrentWithMain(repo, mainSha, headSha) {
  const compare = fetchCompareStatus(repo, mainSha, headSha);
  return {
    ok: ['ahead', 'identical'].includes(compare.status),
    compare,
  };
}

function readinessMarkerFor(repo, prNumber, headSha) {
  return `<!-- 4veco-pr-readiness:${repo}:${prNumber}:${headSha} -->`;
}

function routeFromReadinessComment(body) {
  const match = String(body || '').match(/-\s*Route:\s*`?([A-Z_]+)`?/i);
  return match ? match[1].toUpperCase() : null;
}

function readinessCommentFromComments(comments, repo, prNumber, headSha) {
  const marker = readinessMarkerFor(repo, prNumber, headSha);
  const comment = (comments || []).find((item) => String(item.body || '').includes(marker));
  if (!comment) {
    return { ok: false, marker, failure: 'exact_head_readiness_comment_missing' };
  }
  let parsed;
  try {
    parsed = parseRenderedDecisionMarkdown(comment.body);
  } catch (error) {
    return {
      ok: false,
      marker,
      comment_id: comment.id || null,
      failure: 'exact_head_readiness_machine_decision_invalid',
      detail: error.message,
    };
  }
  const { decision, digest } = parsed;
  const route = decision.route;
  if (
    decision.reviewed_pr.repo !== repo ||
    decision.reviewed_pr.number !== Number(prNumber) ||
    decision.reviewed_pr.head_sha !== headSha
  ) {
    return {
      ok: false,
      marker,
      comment_id: comment.id || null,
      route,
      failure: 'exact_head_readiness_decision_target_mismatch',
    };
  }
  if (!READY_READINESS_ROUTES.has(route)) {
    return {
      ok: false,
      marker,
      comment_id: comment.id || null,
      route,
      failure: 'exact_head_readiness_comment_not_ready',
    };
  }
  return {
    ok: true,
    marker,
    comment_id: comment.id || null,
    route,
    digest,
    decision,
    url: comment.html_url || comment.url || null,
  };
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

function fetchComparePaths(repo, baseSha, headSha) {
  if (!baseSha || !headSha || baseSha === headSha) return [];
  const raw = runGh(['api', `repos/${repo}/compare/${baseSha}...${headSha}`]);
  return (JSON.parse(raw).files || []).map((file) => file.filename).filter(Boolean);
}

function fetchCompareStatus(repo, baseSha, headSha) {
  const raw = runGh(['api', `repos/${repo}/compare/${baseSha}...${headSha}`], { optional: true });
  if (!raw) return { status: 'unavailable', ahead_by: null, behind_by: null };
  const data = JSON.parse(raw);
  return {
    status: data.status,
    ahead_by: data.ahead_by,
    behind_by: data.behind_by,
    merge_base_commit_sha: data.merge_base_commit && data.merge_base_commit.sha,
  };
}

function fetchInterveningCommits(repo, baseSha, headSha) {
  if (!baseSha || !headSha || baseSha === headSha) return [];
  const commits = [];
  const seen = new Set();
  let currentSha = headSha;
  for (let depth = 0; depth < 100 && currentSha && currentSha !== baseSha; depth += 1) {
    if (seen.has(currentSha)) throw new Error('cycle detected while walking PR first-parent chain');
    seen.add(currentSha);
    const detail = JSON.parse(runGh(['api', `repos/${repo}/commits/${currentSha}`]));
    const parents = (detail.parents || []).map((parent) => parent.sha).filter(Boolean);
    commits.unshift({
      sha: currentSha,
      parents,
      changed_paths: (detail.files || []).map((file) => file.filename).filter(Boolean),
    });
    currentSha = parents[0] || null;
  }
  if (currentSha !== baseSha) {
    throw new Error('reviewed payload head was not reached on PR first-parent chain');
  }
  return commits;
}

function fetchReviewThreadState(repo, prNumber) {
  const [owner, name] = repo.split('/');
  const query = `
    query($owner: String!, $name: String!, $number: Int!) {
      repository(owner: $owner, name: $name) {
        pullRequest(number: $number) {
          reviewDecision
          reviewThreads(first: 100) {
            nodes { isResolved }
            pageInfo { hasNextPage endCursor }
          }
          reviews(first: 100, states: [CHANGES_REQUESTED]) {
            nodes { state }
            pageInfo { hasNextPage endCursor }
          }
        }
      }
    }
  `;
  const raw = runGh([
    'api',
    'graphql',
    '-f',
    `query=${query}`,
    '-F',
    `owner=${owner}`,
    '-F',
    `name=${name}`,
    '-F',
    `number=${prNumber}`,
  ]);
  const pr = JSON.parse(raw).data.repository.pullRequest;
  const threads = pr.reviewThreads;
  const reviews = pr.reviews;
  if (threads.pageInfo.hasNextPage || reviews.pageInfo.hasNextPage) {
    return { available: false, unresolved_count: null, requested_changes_count: null };
  }
  return {
    available: true,
    unresolved_count: threads.nodes.filter((thread) => thread && thread.isResolved === false).length,
    requested_changes_count: reviews.nodes.filter((review) => review && review.state === 'CHANGES_REQUESTED').length,
  };
}

function setCommitStatus(repo, sha, state, description, targetUrl, options = {}) {
  if (options.dryRun) {
    return { dry_run: true, state, sha, context: INTEGRATION_CONTEXT };
  }
  const payload = {
    state,
    context: INTEGRATION_CONTEXT,
    description: description.slice(0, 140),
    target_url: targetUrl || undefined,
  };
  const input = JSON.stringify(payload);
  const result = spawnSync('gh', ['api', '-X', 'POST', `repos/${repo}/statuses/${sha}`, '--input', '-'], {
    input,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`unable to set ${INTEGRATION_CONTEXT} status${detail ? `: ${detail}` : ''}`);
  }
  return JSON.parse(result.stdout || '{}');
}

function updateBranch(repo, prNumber, expectedHeadSha, options = {}) {
  if (options.dryRun) return { dry_run: true, expected_head_sha: expectedHeadSha };
  const payload = JSON.stringify({ expected_head_sha: expectedHeadSha });
  const result = spawnSync(
    'gh',
    ['api', '-X', 'PUT', `repos/${repo}/pulls/${prNumber}/update-branch`, '--input', '-'],
    {
      input: payload,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 20,
    }
  );
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`update-branch failed${detail ? `: ${detail}` : ''}`);
  }
  return JSON.parse(result.stdout || '{}');
}

function mergePr(repo, prNumber, headSha, options = {}) {
  if (options.dryRun) return { dry_run: true, head_sha: headSha };
  runGh(['pr', 'merge', String(prNumber), '--repo', repo, '--merge', '--match-head-commit', headSha]);
  return { merged: true, head_sha: headSha };
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

function waitForMainCi(repo, headSha, options = {}) {
  if (options.dryRun) return { ok: true, dry_run: true, head_sha: headSha };
  const timeoutSeconds = Number(options.postMergeCiTimeoutSeconds || 1800);
  const pollSeconds = Number(options.postMergeCiPollSeconds || options.pollSeconds || 20);
  const deadline = Date.now() + timeoutSeconds * 1000;
  let lastRun = null;
  while (Date.now() <= deadline) {
    lastRun = findMainWorkflowRun(repo, headSha);
    if (lastRun && lastRun.status === 'completed') {
      return {
        ok: lastRun.conclusion === 'success',
        head_sha: headSha,
        run: lastRun,
      };
    }
    sleep(pollSeconds * 1000);
  }
  return {
    ok: false,
    head_sha: headSha,
    run: lastRun,
    failure: 'post_merge_main_ci_timeout',
  };
}

function defaultIntegrationDeps() {
  return {
    buildLineageInput,
    enforceLineagePolicy,
    fetchAuthorizationComment,
    fetchBranchProtectionSummary,
    fetchCompareStatus,
    fetchMainSha,
    fetchMergedPr,
    fetchPr,
    fetchReviewThreadState,
    generateAndApplyReadiness,
    isHeadCurrentWithMain,
    mergePr,
    setCommitStatus,
    summarizeLineage,
    updateBranch,
    validateAuthorizationRecord,
    validatePrState,
    waitForMainCi,
  };
}

function integrationDeps(options = {}) {
  return {
    ...defaultIntegrationDeps(),
    ...(options.deps || {}),
  };
}

function buildLineageInput(repo, authorization, pr, mainSha) {
  const reviewedPayload = authorization.reviewed_payload_head_sha;
  const integrationHead = pr.headRefOid;
  const payloadCompare = fetchCompareStatus(repo, reviewedPayload, integrationHead);
  return {
    reviewed_payload_head_sha: reviewedPayload,
    integration_head_sha: integrationHead,
    base_sha_at_review: authorization.base_sha_at_review,
    current_main_sha: mainSha,
    payload_ancestor_of_integration_head: ['ahead', 'identical'].includes(payloadCompare.status),
    payload_paths: fetchComparePaths(repo, authorization.base_sha_at_review, reviewedPayload),
    base_delta_paths: fetchComparePaths(repo, authorization.base_sha_at_review, mainSha),
    intervening_commits: fetchInterveningCommits(repo, reviewedPayload, integrationHead),
  };
}

function readJsonIfPresent(file) {
  if (!file) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function validateIntegrationDeltaReview(record, lineage) {
  const failures = [];
  const item = record || {};
  const result = String(item.result || item.verdict || '').trim().replace(/_/g, ' ').toUpperCase();
  if (!['PASS', 'PASS WITH FLAGS'].includes(result)) failures.push('integration_delta_review_result_not_passing');
  if (item.reviewed_payload_head_sha !== lineage.reviewed_payload_head_sha) {
    failures.push('integration_delta_review_payload_mismatch');
  }
  if (item.integration_head_sha !== lineage.integration_head_sha && item.reviewed_integration_head_sha !== lineage.integration_head_sha) {
    failures.push('integration_delta_review_head_mismatch');
  }
  if (!item.path && !item.review_path) failures.push('integration_delta_review_path_missing');
  return {
    ok: failures.length === 0,
    failures,
    review: item,
  };
}

function enforceLineagePolicy(lineage, options = {}) {
  if (!lineage.ok) {
    return {
      ok: false,
      phase: 'authorization_invalidated',
      status_state: 'failure',
      status_description: `Authorization not inherited: ${lineage.failures.join(', ')}`,
      lineage,
    };
  }
  if (lineage.requires_integration_delta_lead_review === true) {
    const delta = validateIntegrationDeltaReview(options.deltaReview, lineage);
    if (!delta.ok) {
      return {
        ok: false,
        phase: 'integration_delta_lead_review_required',
        status_state: 'failure',
        status_description: 'Integration delta lead review required before merge',
        lineage,
        delta_review: delta,
      };
    }
    return { ok: true, lineage, delta_review: delta };
  }
  if (lineage.requires_deterministic_refresh === true && options.deterministicRefreshVerified !== true) {
    return {
      ok: false,
      phase: 'deterministic_refresh_required',
      status_state: 'failure',
      status_description: 'Deterministic evidence refresh required before merge',
      lineage,
    };
  }
  return { ok: true, lineage };
}

function supplementalFromReadinessDecision(payloadDecision, authorization, lineage, branchProtection, options = {}) {
  const proof = payloadDecision.proof || {};
  const checkers = [
    ...((proof.checkers || []).map((checker) => ({ ...checker }))),
    {
      command: 'check-human-payload-authorization',
      status: 'success',
      reviewed_commit_sha: lineage.integration_head_sha,
    },
    {
      command: 'check-integration-lineage',
      status: 'success',
      reviewed_commit_sha: lineage.integration_head_sha,
    },
    {
      command: 'check-branch-protection',
      status: branchProtection.ok ? 'success' : 'failure',
      reviewed_commit_sha: lineage.integration_head_sha,
    },
  ];
  const integrationProof = {
    ...lineage,
  };
  if (options.deltaReview) integrationProof.delta_review = options.deltaReview;
  if (options.deterministicRefreshVerified === true) {
    integrationProof.deterministic_refresh_verified = true;
  }
  return {
    throughput: payloadDecision.throughput,
    human_review_payload: payloadDecision.human_review_payload,
    consequence: payloadDecision.consequence,
    batching: payloadDecision.batching,
    proof: {
      checkers,
      lead_review: {
        path: proof.lead_review_path,
        result: proof.lead_review_result,
        reviewed_commit_sha: proof.lead_reviewed_sha,
      },
      branch_protection: branchProtection,
      human_authorization: authorization,
      integration: integrationProof,
    },
  };
}

function payloadReadinessDecisionFromComments(comments, repo, prNumber, payloadSha) {
  const parsed = readinessCommentFromComments(comments, repo, prNumber, payloadSha);
  if (!parsed.ok) {
    return {
      ok: false,
      failure: 'payload_readiness_decision_missing_or_invalid',
      detail: parsed,
    };
  }
  return parsed;
}

function fetchPayloadReadinessDecision(repo, prNumber, payloadSha) {
  return payloadReadinessDecisionFromComments(listIssueComments(repo, prNumber), repo, prNumber, payloadSha);
}

function generateAndApplyReadiness(repo, prNumber, authorization, lineage, branchProtection, options = {}) {
  const payloadReadiness = options.payloadReadinessDecision
    ? { ok: true, decision: options.payloadReadinessDecision }
    : fetchPayloadReadinessDecision(repo, prNumber, authorization.reviewed_payload_head_sha);
  if (!payloadReadiness.ok) {
    return {
      ok: false,
      phase: 'payload_readiness',
      readiness: payloadReadiness,
    };
  }
  const supplemental = supplementalFromReadinessDecision(
    payloadReadiness.decision,
    authorization,
    lineage,
    branchProtection,
    options
  );
  const review = runReview({
    repo,
    prNumber,
    supplemental,
  });
  const apply = options.dryRun
    ? { ok: true, dry_run: true, comment_action: 'would_apply_comment', transition_action: 'none' }
    : applyLiveDecision(review.decision, { dryRun: false });
  return {
    ok: READY_READINESS_ROUTES.has(review.decision.route),
    phase: 'readiness',
    decision: review.decision,
    markdown: review.markdown,
    apply,
  };
}

function validatePrState(pr, options = {}) {
  const failures = [];
  if (pr.state !== 'OPEN') failures.push('pr_not_open');
  if (pr.isDraft === true) failures.push('pr_is_draft');
  if (pr.baseRefName !== 'main') failures.push('pr_base_must_be_main');
  if (pr.mergeable === false || pr.mergeStateStatus === 'DIRTY') failures.push('merge_conflict');
  if (options.requireValidatePlatform === false) return failures;
  const checks = parseChecks(pr.statusCheckRollup);
  const validatePlatform = checks.find((check) => check.name === 'validate-platform');
  if (!validatePlatform || !successStatus(validatePlatform.conclusion || validatePlatform.status)) {
    failures.push('validate_platform_missing_or_not_successful');
  }
  return failures;
}

function sleep(ms) {
  if (ms <= 0) return;
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function integrate(options) {
  const repo = options.repo || DEFAULT_REPO;
  const prNumber = Number(options.prNumber);
  if (!Number.isInteger(prNumber) || prNumber < 1) throw new Error('--pr must be a positive integer');
  const deps = integrationDeps(options);
  const deltaReview = options.deltaReview || readJsonIfPresent(options.deltaReviewPath);
  const authorization = options.authorization ||
    deps.fetchAuthorizationComment(repo, options.authorizationCommentId, { expectedPr: prNumber });
  const authorizationSummary = deps.validateAuthorizationRecord(authorization, {
    expectedRepo: repo,
    expectedPr: prNumber,
    expectedPayloadSha: options.payloadSha || null,
  });
  if (!authorizationSummary.ok) {
    return { ok: false, phase: 'authorization', authorization: authorizationSummary };
  }

  let pr = deps.fetchPr(repo, prNumber);
  if (pr.headRefOid) {
    deps.setCommitStatus(repo, pr.headRefOid, 'pending', 'Authorized integration lane running', pr.url, options);
  }
  const mainSha = deps.fetchMainSha(repo);
  const branchProtection = deps.fetchBranchProtectionSummary(repo, {
    requireIntegrationAuthorized: options.requireIntegrationAuthorized,
  });
  if (!branchProtection.ok) {
    deps.setCommitStatus(repo, pr.headRefOid, 'failure', `Branch protection mismatch: ${branchProtection.failures.join(', ')}`, pr.url, options);
    return { ok: false, phase: 'branch_protection', branch_protection: branchProtection };
  }

  const preflightFailures = deps.validatePrState(pr, { requireValidatePlatform: false });
  const reviewThreads = deps.fetchReviewThreadState(repo, prNumber);
  if (!reviewThreads.available || reviewThreads.unresolved_count > 0 || reviewThreads.requested_changes_count > 0) {
    preflightFailures.push('review_threads_or_requested_changes_not_clean');
  }
  if (preflightFailures.length > 0) {
    deps.setCommitStatus(repo, pr.headRefOid, 'failure', `Preflight failed: ${preflightFailures.join(', ')}`, pr.url, options);
    return { ok: false, phase: 'preflight', failures: preflightFailures, pr };
  }

  const initialLineage = deps.summarizeLineage(deps.buildLineageInput(repo, authorization, pr, mainSha));
  const initialPolicy = deps.enforceLineagePolicy(initialLineage, {
    deltaReview,
    deterministicRefreshVerified: options.deterministicRefreshVerified,
  });
  if (!initialPolicy.ok) {
    deps.setCommitStatus(repo, pr.headRefOid, initialPolicy.status_state, initialPolicy.status_description, pr.url, options);
    return { ok: false, phase: initialPolicy.phase, lineage: initialLineage, policy: initialPolicy };
  }

  const currentWithMain = deps.isHeadCurrentWithMain(repo, mainSha, pr.headRefOid);
  if (!currentWithMain.ok) {
    deps.updateBranch(repo, prNumber, pr.headRefOid, options);
    return {
      ok: true,
      phase: 'updated_branch',
      retry_required: true,
      previous_head_sha: pr.headRefOid,
      main_sha: mainSha,
      main_compare: currentWithMain.compare,
      lineage: initialLineage,
    };
  }

  const ciFailures = deps.validatePrState(pr).filter((failure) => failure === 'validate_platform_missing_or_not_successful');
  if (ciFailures.length > 0) {
    return { ok: true, phase: 'awaiting_validate_platform', retry_required: true, pr };
  }

  const finalMainSha = deps.fetchMainSha(repo);
  if (finalMainSha !== mainSha) {
    return { ok: true, phase: 'main_moved_retry', retry_required: true, previous_main_sha: mainSha, current_main_sha: finalMainSha };
  }

  pr = deps.fetchPr(repo, prNumber);
  if (pr.headRefOid !== initialLineage.integration_head_sha) {
    return {
      ok: true,
      phase: 'head_moved_retry',
      retry_required: true,
      previous_head_sha: initialLineage.integration_head_sha,
      current_head_sha: pr.headRefOid,
    };
  }
  const finalPreflight = deps.validatePrState(pr);
  const finalReviewThreads = deps.fetchReviewThreadState(repo, prNumber);
  if (!finalReviewThreads.available || finalReviewThreads.unresolved_count > 0 || finalReviewThreads.requested_changes_count > 0) {
    finalPreflight.push('review_threads_or_requested_changes_not_clean');
  }
  if (finalPreflight.length > 0) {
    deps.setCommitStatus(repo, pr.headRefOid, 'failure', `Final preflight failed: ${finalPreflight.join(', ')}`, pr.url, options);
    return { ok: false, phase: 'final_preflight', failures: finalPreflight, pr };
  }
  const finalBranchProtection = deps.fetchBranchProtectionSummary(repo, {
    requireIntegrationAuthorized: options.requireIntegrationAuthorized,
  });
  if (!finalBranchProtection.ok) {
    deps.setCommitStatus(repo, pr.headRefOid, 'failure', `Branch protection mismatch: ${finalBranchProtection.failures.join(', ')}`, pr.url, options);
    return { ok: false, phase: 'final_branch_protection', branch_protection: finalBranchProtection };
  }
  const finalLineage = deps.summarizeLineage(deps.buildLineageInput(repo, authorization, pr, finalMainSha));
  const finalPolicy = deps.enforceLineagePolicy(finalLineage, {
    deltaReview,
    deterministicRefreshVerified: options.deterministicRefreshVerified,
  });
  if (!finalPolicy.ok) {
    deps.setCommitStatus(repo, pr.headRefOid, finalPolicy.status_state, finalPolicy.status_description, pr.url, options);
    return { ok: false, phase: finalPolicy.phase, lineage: finalLineage, policy: finalPolicy };
  }

  const readiness = deps.generateAndApplyReadiness(repo, prNumber, authorization, finalLineage, finalBranchProtection, {
    deltaReview,
    deterministicRefreshVerified: options.deterministicRefreshVerified,
    dryRun: options.dryRun,
    payloadReadinessDecision: options.payloadReadinessDecision,
  });
  if (!readiness.ok) {
    deps.setCommitStatus(repo, pr.headRefOid, 'failure', `Readiness not ready: ${readiness.phase}`, pr.url, options);
    return { ok: false, phase: 'readiness', readiness };
  }

  const preMergeMainSha = deps.fetchMainSha(repo);
  if (preMergeMainSha !== finalMainSha) {
    return {
      ok: true,
      phase: 'main_moved_before_merge_retry',
      retry_required: true,
      previous_main_sha: finalMainSha,
      current_main_sha: preMergeMainSha,
    };
  }
  const preMergePr = deps.fetchPr(repo, prNumber);
  if (preMergePr.headRefOid !== pr.headRefOid) {
    return {
      ok: true,
      phase: 'head_moved_before_merge_retry',
      retry_required: true,
      previous_head_sha: pr.headRefOid,
      current_head_sha: preMergePr.headRefOid,
    };
  }
  const preMergeCurrent = deps.isHeadCurrentWithMain(repo, preMergeMainSha, preMergePr.headRefOid);
  if (!preMergeCurrent.ok) {
    return {
      ok: true,
      phase: 'main_not_ancestor_before_merge_retry',
      retry_required: true,
      main_compare: preMergeCurrent.compare,
    };
  }

  deps.setCommitStatus(repo, pr.headRefOid, 'success', 'Human payload authorization inherited for exact integration head', pr.url, options);
  if (options.noMerge) {
    return { ok: true, phase: 'authorized_no_merge', pr, main_sha: finalMainSha, lineage: finalLineage, readiness };
  }
  let merge;
  try {
    merge = deps.mergePr(repo, prNumber, pr.headRefOid, options);
  } catch (error) {
    deps.setCommitStatus(repo, pr.headRefOid, 'pending', 'Merge rejected; integration lane will retry if safe', pr.url, options);
    const nowMainSha = deps.fetchMainSha(repo);
    if (nowMainSha !== preMergeMainSha) {
      return {
        ok: true,
        phase: 'merge_rejected_main_moved_retry',
        retry_required: true,
        previous_main_sha: preMergeMainSha,
        current_main_sha: nowMainSha,
        error: error.message,
      };
    }
    deps.setCommitStatus(repo, pr.headRefOid, 'failure', `Merge rejected: ${error.message}`, pr.url, options);
    return { ok: false, phase: 'merge', error: error.message };
  }
  const mergedPr = options.dryRun ? { state: 'MERGED', mergeCommit: { oid: pr.headRefOid } } : deps.fetchMergedPr(repo, prNumber);
  if (mergedPr.state !== 'MERGED' || !mergedPr.mergeCommit || !mergedPr.mergeCommit.oid) {
    deps.setCommitStatus(repo, pr.headRefOid, 'failure', 'Merge commit was not observable after merge', pr.url, options);
    return { ok: false, phase: 'merge_verification', merge, merged_pr: mergedPr };
  }
  const mergeSha = mergedPr.mergeCommit.oid;
  const currentMainAfterMerge = deps.fetchMainSha(repo);
  const mergeContained = deps.fetchCompareStatus(repo, mergeSha, currentMainAfterMerge);
  if (!['ahead', 'identical'].includes(mergeContained.status)) {
    return {
      ok: false,
      phase: 'merge_not_contained_in_main',
      merge,
      merged_pr: mergedPr,
      current_main_sha: currentMainAfterMerge,
      merge_compare: mergeContained,
    };
  }
  const postMergeCi = deps.waitForMainCi(repo, mergeSha, options);
  if (!postMergeCi.ok) {
    return { ok: false, phase: 'post_merge_ci', merge, merged_pr: mergedPr, post_merge_ci: postMergeCi };
  }
  return { ok: true, phase: 'merged', pr, main_sha: finalMainSha, lineage: finalLineage, readiness, merge, merged_pr: mergedPr, post_merge_ci: postMergeCi };
}

function runIntegrationAttempts(options) {
  let result;
  const maxAttempts = Number(options.maxAttempts || 4);
  const pollSeconds = Number(options.pollSeconds || 30);
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    result = integrate(options);
    result.attempt = attempt;
    if (!result.ok || !result.retry_required) break;
    if (attempt < maxAttempts) sleep(pollSeconds * 1000);
  }
  if (result && result.retry_required) {
    result.ok = false;
    result.failures = [`retry_required_after_${maxAttempts}_attempts`];
  }
  return result;
}

function runCli(argv) {
  const repo = optionValue(argv, '--repo') || DEFAULT_REPO;
  const prNumber = optionValue(argv, '--pr');
  const authorizationCommentId = optionValue(argv, '--authorization-comment-id');
  if (!prNumber) fail('--pr is required');
  if (!authorizationCommentId) fail('--authorization-comment-id is required');
  let result;
  try {
    const maxAttempts = Number(optionValue(argv, '--max-attempts') || 4);
    const pollSeconds = Number(optionValue(argv, '--poll-seconds') || 30);
    result = runIntegrationAttempts({
      repo,
      prNumber,
      authorizationCommentId,
      payloadSha: optionValue(argv, '--payload-sha'),
      deltaReviewPath: optionValue(argv, '--delta-review'),
      deterministicRefreshVerified: flag(argv, '--deterministic-refresh-verified'),
      requireIntegrationAuthorized: flag(argv, '--require-integration-authorized'),
      postMergeCiTimeoutSeconds: Number(optionValue(argv, '--post-merge-ci-timeout-seconds') || 1800),
      postMergeCiPollSeconds: Number(optionValue(argv, '--post-merge-ci-poll-seconds') || pollSeconds),
      maxAttempts,
      pollSeconds,
      dryRun: flag(argv, '--dry-run'),
      noMerge: flag(argv, '--no-merge'),
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
  INTEGRATION_CONTEXT,
  buildLineageInput,
  enforceLineagePolicy,
  generateAndApplyReadiness,
  fetchBranchProtectionSummary,
  integrate,
  isHeadCurrentWithMain,
  parseChecks,
  payloadReadinessDecisionFromComments,
  readinessCommentFromComments,
  readinessMarkerFor,
  runIntegrationAttempts,
  setCommitStatus,
  summarizeIntegrationBranchProtection,
  supplementalFromReadinessDecision,
  validateIntegrationDeltaReview,
  validatePrState,
  waitForMainCi,
};
