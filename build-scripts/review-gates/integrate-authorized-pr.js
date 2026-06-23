#!/usr/bin/env node
const fs = require('fs');
const { spawnSync } = require('child_process');
const {
  fetchAuthorizationComment,
  validateAuthorizationRecord,
} = require('./check-human-payload-authorization');
const { summarizeLineage } = require('./check-integration-lineage');

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
  const route = routeFromReadinessComment(comment.body);
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

function validatePrState(pr) {
  const failures = [];
  if (pr.state !== 'OPEN') failures.push('pr_not_open');
  if (pr.isDraft === true) failures.push('pr_is_draft');
  if (pr.mergeable === false || pr.mergeStateStatus === 'DIRTY') failures.push('merge_conflict');
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
  const authorization = options.authorization ||
    fetchAuthorizationComment(repo, options.authorizationCommentId);
  const authorizationSummary = validateAuthorizationRecord(authorization, {
    expectedRepo: repo,
    expectedPr: prNumber,
    expectedPayloadSha: options.payloadSha || null,
  });
  if (!authorizationSummary.ok) {
    return { ok: false, phase: 'authorization', authorization: authorizationSummary };
  }

  let pr = fetchPr(repo, prNumber);
  const mainSha = fetchMainSha(repo);
  const preflightFailures = validatePrState(pr);
  const reviewThreads = fetchReviewThreadState(repo, prNumber);
  if (!reviewThreads.available || reviewThreads.unresolved_count > 0 || reviewThreads.requested_changes_count > 0) {
    preflightFailures.push('review_threads_or_requested_changes_not_clean');
  }
  if (
    preflightFailures.length === 1 &&
    preflightFailures[0] === 'validate_platform_missing_or_not_successful'
  ) {
    return { ok: true, phase: 'awaiting_validate_platform', retry_required: true, pr };
  }
  if (preflightFailures.length > 0 && !['BEHIND', 'BLOCKED'].includes(pr.mergeStateStatus)) {
    return { ok: false, phase: 'preflight', failures: preflightFailures, pr };
  }

  const initialLineage = summarizeLineage(buildLineageInput(repo, authorization, pr, mainSha));
  if (!initialLineage.ok) {
    setCommitStatus(repo, pr.headRefOid, 'failure', `Authorization not inherited: ${initialLineage.failures.join(', ')}`, null, options);
    return { ok: false, phase: 'lineage', lineage: initialLineage };
  }

  if (['BEHIND', 'BLOCKED'].includes(pr.mergeStateStatus)) {
    updateBranch(repo, prNumber, pr.headRefOid, options);
    return {
      ok: true,
      phase: 'updated_branch',
      retry_required: true,
      previous_head_sha: pr.headRefOid,
      main_sha: mainSha,
      lineage: initialLineage,
    };
  }

  const finalMainSha = fetchMainSha(repo);
  if (finalMainSha !== mainSha) {
    return { ok: true, phase: 'main_moved_retry', retry_required: true, previous_main_sha: mainSha, current_main_sha: finalMainSha };
  }

  pr = fetchPr(repo, prNumber);
  const finalLineage = summarizeLineage(buildLineageInput(repo, authorization, pr, finalMainSha));
  if (!finalLineage.ok) {
    setCommitStatus(repo, pr.headRefOid, 'failure', `Authorization not inherited: ${finalLineage.failures.join(', ')}`, null, options);
    return { ok: false, phase: 'final_lineage', lineage: finalLineage };
  }

  const readiness = fetchReadinessComment(repo, prNumber, pr.headRefOid);
  if (!readiness.ok) {
    setCommitStatus(repo, pr.headRefOid, 'failure', `Readiness proof not ready: ${readiness.failure}`, null, options);
    return { ok: false, phase: 'readiness', readiness };
  }

  setCommitStatus(repo, pr.headRefOid, 'success', 'Human payload authorization inherited for exact integration head', pr.url, options);
  if (options.noMerge) {
    return { ok: true, phase: 'authorized_no_merge', pr, main_sha: finalMainSha, lineage: finalLineage, readiness };
  }
  const merge = mergePr(repo, prNumber, pr.headRefOid, options);
  return { ok: true, phase: 'merged', pr, main_sha: finalMainSha, lineage: finalLineage, readiness, merge };
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
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      result = integrate({
        repo,
        prNumber,
        authorizationCommentId,
        payloadSha: optionValue(argv, '--payload-sha'),
        dryRun: flag(argv, '--dry-run'),
        noMerge: flag(argv, '--no-merge'),
      });
      result.attempt = attempt;
      if (!result.ok || !result.retry_required) break;
      if (attempt < maxAttempts) sleep(pollSeconds * 1000);
    }
    if (result && result.retry_required) {
      result.ok = false;
      result.failures = [`retry_required_after_${maxAttempts}_attempts`];
    }
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
  integrate,
  parseChecks,
  readinessCommentFromComments,
  readinessMarkerFor,
  validatePrState,
};
