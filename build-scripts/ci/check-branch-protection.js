#!/usr/bin/env node
const fs = require('fs');
const { spawnSync } = require('child_process');

/*
HOW TO ADAPT:
- This checker is read-only. It validates a GitHub branch-protection response
  against the platform policy and never mutates repository settings.
- Live mode uses `gh api repos/<repo>/branches/<branch>/protection`.
- Tests should call the pure validation functions with mocked responses.
*/

const DEFAULT_REPO = 'meijer1973/4veco-platform';
const DEFAULT_BRANCH = 'main';
const DEFAULT_REQUIRED_CONTEXT = 'validate-platform';

function fail(message) {
  console.error(`Branch protection check failed: ${message}`);
  process.exit(1);
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (!args[index + 1]) fail(`missing value for ${name}`);
  return args[index + 1];
}

function booleanValue(value) {
  if (typeof value === 'boolean') return value;
  if (value && typeof value === 'object' && typeof value.enabled === 'boolean') return value.enabled;
  return null;
}

function contextsFromProtection(protection) {
  const checks = protection.required_status_checks || {};
  if (Array.isArray(checks.contexts)) return checks.contexts;
  if (Array.isArray(checks.checks)) {
    return checks.checks.map((check) => check && (check.context || check.name)).filter(Boolean);
  }
  return [];
}

function summarizePullRequestReviews(reviews, fetchState = {}) {
  if (!reviews) {
    return {
      available: false,
      required: false,
      required_approving_review_count: null,
      dismiss_stale_reviews: null,
      require_code_owner_reviews: null,
      require_last_push_approval: null,
      bypass_allowances_observable: false,
      bypass_disabled: null,
      limitation: fetchState.limitation || 'pull-request review settings not present in inspected response',
    };
  }

  const allowances = reviews.bypass_pull_request_allowances;
  const allowanceCounts = allowances
    ? {
        users: Array.isArray(allowances.users) ? allowances.users.length : 0,
        teams: Array.isArray(allowances.teams) ? allowances.teams.length : 0,
        apps: Array.isArray(allowances.apps) ? allowances.apps.length : 0,
      }
    : null;
  const bypassObservable = Boolean(allowances);
  const bypassDisabled = bypassObservable
    ? allowanceCounts.users + allowanceCounts.teams + allowanceCounts.apps === 0
    : null;

  return {
    available: true,
    required: true,
    required_approving_review_count:
      typeof reviews.required_approving_review_count === 'number'
        ? reviews.required_approving_review_count
        : null,
    dismiss_stale_reviews:
      typeof reviews.dismiss_stale_reviews === 'boolean' ? reviews.dismiss_stale_reviews : null,
    require_code_owner_reviews:
      typeof reviews.require_code_owner_reviews === 'boolean' ? reviews.require_code_owner_reviews : null,
    require_last_push_approval:
      typeof reviews.require_last_push_approval === 'boolean' ? reviews.require_last_push_approval : null,
    bypass_allowances_observable: bypassObservable,
    bypass_disabled: bypassDisabled,
    limitation: bypassObservable ? null : 'bypass allowances not exposed in inspected response',
  };
}

function summarizeProtection(protection, options = {}) {
  const requiredContext = options.requiredContext || DEFAULT_REQUIRED_CONTEXT;
  const strict = Boolean(protection.required_status_checks && protection.required_status_checks.strict);
  const contexts = contextsFromProtection(protection);
  const enforceAdmins = booleanValue(protection.enforce_admins);
  const allowForcePushes = booleanValue(protection.allow_force_pushes);
  const allowDeletions = booleanValue(protection.allow_deletions);
  const pullRequestReviews =
    options.pullRequestReviews ||
    protection.required_pull_request_reviews ||
    null;

  const failures = [];
  if (strict !== true) failures.push('required_status_checks.strict must be true');
  if (!contexts.includes(requiredContext)) failures.push(`required status context missing: ${requiredContext}`);
  if (enforceAdmins !== true) failures.push('enforce_admins.enabled must be true');
  if (allowForcePushes !== false) failures.push('allow_force_pushes.enabled must be false');
  if (allowDeletions !== false) failures.push('allow_deletions.enabled must be false');

  return {
    repository: options.repo || DEFAULT_REPO,
    branch: options.branch || DEFAULT_BRANCH,
    ok: failures.length === 0,
    expected: {
      required_status_checks: {
        strict: true,
        contexts: [requiredContext],
      },
      enforce_admins: true,
      allow_force_pushes: false,
      allow_deletions: false,
    },
    observed: {
      required_status_checks: {
        strict,
        contexts,
      },
      enforce_admins: enforceAdmins,
      allow_force_pushes: allowForcePushes,
      allow_deletions: allowDeletions,
      required_pull_request_reviews: summarizePullRequestReviews(
        pullRequestReviews,
        options.pullRequestReviewFetch
      ),
    },
    failures,
  };
}

function readFixture(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function fetchProtection(repo, branch) {
  const result = spawnSync('gh', ['api', `repos/${repo}/branches/${branch}/protection`], {
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(
      `unable to read branch protection through gh api${detail ? `: ${detail}` : ''}`
    );
  }
  return JSON.parse(result.stdout);
}

function fetchPullRequestReviews(repo, branch) {
  const result = spawnSync(
    'gh',
    ['api', `repos/${repo}/branches/${branch}/protection/required_pull_request_reviews`],
    {
      encoding: 'utf8',
    }
  );
  if (result.status === 0) {
    return {
      reviews: JSON.parse(result.stdout),
      fetch: {
        status: 'available',
        limitation: null,
      },
    };
  }
  const detail = (result.stderr || result.stdout || '').trim();
  return {
    reviews: null,
    fetch: {
      status: 'unavailable',
      limitation: detail || 'pull-request review endpoint unavailable',
    },
  };
}

function runCli(argv) {
  const repo = optionValue(argv, '--repo') || DEFAULT_REPO;
  const branch = optionValue(argv, '--branch') || DEFAULT_BRANCH;
  const requiredContext = optionValue(argv, '--required-context') || DEFAULT_REQUIRED_CONTEXT;
  const fixture = optionValue(argv, '--fixture');

  let protection;
  let pullRequestReviewRead = { reviews: null, fetch: {} };
  try {
    protection = fixture ? readFixture(fixture) : fetchProtection(repo, branch);
    if (!fixture) pullRequestReviewRead = fetchPullRequestReviews(repo, branch);
  } catch (error) {
    fail(error.message);
  }

  const summary = summarizeProtection(protection, {
    repo,
    branch,
    requiredContext,
    pullRequestReviews: pullRequestReviewRead.reviews,
    pullRequestReviewFetch: pullRequestReviewRead.fetch,
  });
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.ok) fail(summary.failures.join('; '));
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  DEFAULT_REPO,
  DEFAULT_BRANCH,
  DEFAULT_REQUIRED_CONTEXT,
  contextsFromProtection,
  summarizePullRequestReviews,
  summarizeProtection,
};
