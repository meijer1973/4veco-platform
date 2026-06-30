#!/usr/bin/env node
const { spawnSync } = require('child_process');
const { summarizeProtection } = require('../ci/check-branch-protection');

/*
HOW TO ADAPT:
- This checker is read-only. It never changes branch protection, repository
  settings, pull requests, or commit statuses.
- It answers which serialized integration lane can safely validate the current
  repository shape with the currently authenticated `gh` context.
- A branch-protection HTTP 403 is a recognized GitHub permission boundary, not
  a reason to bypass the lane.
*/

const DEFAULT_REPO = 'meijer1973/4veco-platform';
const DEFAULT_BRANCH = 'main';
const OWNER_AUTHENTICATED_LOCAL_LANE = 'owner_authenticated_local_lane';

function fail(message) {
  console.error(`Integration lane capability check failed: ${message}`);
  process.exit(1);
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (!args[index + 1]) fail(`missing value for ${name}`);
  return args[index + 1];
}

function runGh(args) {
  const result = spawnSync('gh', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });
  if (result.error) {
    throw new Error(`gh ${args.join(' ')} failed: ${result.error.message}`);
  }
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`gh ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return result.stdout;
}

function safeRun(runner, args) {
  try {
    return { ok: true, stdout: runner(args) };
  } catch (error) {
    return { ok: false, error };
  }
}

function errorMessage(error) {
  return String(error && error.message ? error.message : error || '');
}

function isBranchProtectionReadForbiddenError(error) {
  const message = errorMessage(error);
  return (
    /\bHTTP\s*403\b/i.test(message) ||
    /Resource not accessible by integration/i.test(message) ||
    /must have admin rights/i.test(message) ||
    /administration(?:\s+permission)?/i.test(message)
  );
}

function isAuthMissingError(error) {
  const message = errorMessage(error);
  return (
    /not logged in|not logged into|no authentication|requires authentication/i.test(message) ||
    /\bHTTP\s*401\b/i.test(message) ||
    /Bad credentials/i.test(message) ||
    /gh auth login/i.test(message) ||
    /could not prompt/i.test(message) ||
    /ENOENT|not recognized|cannot find/i.test(message)
  );
}

function localLaneCommand(repo, prNumber = '<PR>', authorizationCommentId = '<COMMENT_ID>') {
  return [
    'npm.cmd run integrate:authorized-pr --',
    '--repo',
    repo,
    '--pr',
    String(prNumber),
    '--authorization-comment-id',
    String(authorizationCommentId),
  ].join(' ');
}

function failureResult(classification, options = {}) {
  return {
    ok: false,
    classification,
    phase: classification,
    repository: options.repo || DEFAULT_REPO,
    branch: options.branch || DEFAULT_BRANCH,
    recommended_next_path: options.recommendedNextPath || null,
    handoff_command: options.handoffCommand || null,
    failures: options.failures || [classification],
    error: options.error || null,
    branch_protection: options.branchProtection || null,
    auth: options.auth || null,
  };
}

function checkIntegrationLaneCapability(options = {}, deps = {}) {
  const repo = options.repo || DEFAULT_REPO;
  const branch = options.branch || DEFAULT_BRANCH;
  const env = options.env || process.env;
  const runner = deps.runGh || runGh;
  const inGitHubActions = env.GITHUB_ACTIONS === 'true';
  const hasWorkflowToken = Boolean(env.GH_TOKEN || env.GITHUB_TOKEN);
  const handoffCommand = localLaneCommand(repo, options.prNumber, options.authorizationCommentId);

  const authStatus = safeRun(runner, ['auth', 'status', '--hostname', 'github.com']);
  if (!authStatus.ok && !hasWorkflowToken) {
    return failureResult('auth_missing', {
      repo,
      branch,
      recommendedNextPath: OWNER_AUTHENTICATED_LOCAL_LANE,
      handoffCommand,
      failures: ['auth_missing'],
      error: errorMessage(authStatus.error),
      auth: { status: 'unavailable' },
    });
  }

  const protectionRead = safeRun(runner, ['api', `repos/${repo}/branches/${branch}/protection`]);
  if (!protectionRead.ok) {
    if (isBranchProtectionReadForbiddenError(protectionRead.error)) {
      return failureResult('branch_protection_read_forbidden', {
        repo,
        branch,
        recommendedNextPath: OWNER_AUTHENTICATED_LOCAL_LANE,
        handoffCommand,
        failures: ['branch_protection_read_forbidden'],
        error: errorMessage(protectionRead.error),
        auth: {
          status: authStatus.ok ? 'available' : 'token_only_or_unverified',
          github_actions: inGitHubActions,
        },
      });
    }
    if (isAuthMissingError(protectionRead.error)) {
      return failureResult('auth_missing', {
        repo,
        branch,
        recommendedNextPath: OWNER_AUTHENTICATED_LOCAL_LANE,
        handoffCommand,
        failures: ['auth_missing'],
        error: errorMessage(protectionRead.error),
        auth: { status: 'unavailable' },
      });
    }
    return failureResult('unexpected_branch_protection_shape', {
      repo,
      branch,
      failures: ['branch_protection_read_failed'],
      error: errorMessage(protectionRead.error),
      auth: {
        status: authStatus.ok ? 'available' : 'token_only_or_unverified',
        github_actions: inGitHubActions,
      },
    });
  }

  let protection;
  try {
    protection = JSON.parse(protectionRead.stdout);
  } catch (error) {
    return failureResult('unexpected_branch_protection_shape', {
      repo,
      branch,
      failures: ['branch_protection_json_invalid'],
      error: error.message,
    });
  }

  const reviewRead = safeRun(runner, [
    'api',
    `repos/${repo}/branches/${branch}/protection/required_pull_request_reviews`,
  ]);
  let reviews = null;
  if (reviewRead.ok) {
    try {
      reviews = JSON.parse(reviewRead.stdout);
    } catch (error) {
      return failureResult('unexpected_branch_protection_shape', {
        repo,
        branch,
        failures: ['pull_request_review_json_invalid'],
        error: error.message,
      });
    }
  }

  const branchProtection = summarizeProtection(protection, {
    repo,
    branch,
    pullRequestReviews: reviews,
    pullRequestReviewFetch: reviewRead.ok
      ? { status: 'available', limitation: null }
      : { status: 'unavailable', limitation: errorMessage(reviewRead.error) || 'pull-request review endpoint unavailable' },
  });

  if (!branchProtection.ok) {
    return failureResult('unexpected_branch_protection_shape', {
      repo,
      branch,
      failures: branchProtection.failures,
      branchProtection,
      auth: {
        status: authStatus.ok ? 'available' : 'token_only_or_unverified',
        github_actions: inGitHubActions,
      },
    });
  }

  const classification = inGitHubActions ? 'cloud_lane_supported' : 'local_owner_lane_required';
  return {
    ok: true,
    classification,
    phase: 'capability_verified',
    repository: repo,
    branch,
    recommended_next_path: inGitHubActions ? 'github_hosted_workflow' : OWNER_AUTHENTICATED_LOCAL_LANE,
    handoff_command: handoffCommand,
    auth: {
      status: authStatus.ok ? 'available' : 'token_only_or_unverified',
      github_actions: inGitHubActions,
      workflow_token_present: hasWorkflowToken,
    },
    branch_protection: branchProtection,
    validated_checks: [
      'branch_protection',
      'required_status_contexts',
      'approval_count_zero',
      'conversation_resolution',
      'admin_enforcement',
      'force_push_and_deletion_protection',
      'pull_request_review_bypass_allowances_when_observable',
    ],
  };
}

function runCli(argv) {
  const result = checkIntegrationLaneCapability({
    repo: optionValue(argv, '--repo') || DEFAULT_REPO,
    branch: optionValue(argv, '--branch') || DEFAULT_BRANCH,
    prNumber: optionValue(argv, '--pr') || '<PR>',
    authorizationCommentId: optionValue(argv, '--authorization-comment-id') || '<COMMENT_ID>',
  });
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  DEFAULT_REPO,
  DEFAULT_BRANCH,
  OWNER_AUTHENTICATED_LOCAL_LANE,
  checkIntegrationLaneCapability,
  isAuthMissingError,
  isBranchProtectionReadForbiddenError,
  localLaneCommand,
};
