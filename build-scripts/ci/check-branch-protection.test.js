const {
  contextsFromProtection,
  summarizeProtection,
  summarizePullRequestReviews,
} = require('./check-branch-protection');

function validProtection(overrides = {}) {
  return {
    required_status_checks: {
      strict: true,
      contexts: ['validate-platform'],
    },
    enforce_admins: {
      enabled: true,
    },
    allow_force_pushes: {
      enabled: false,
    },
    allow_deletions: {
      enabled: false,
    },
    ...overrides,
  };
}

describe('check-branch-protection', () => {
  test('passes expected policy', () => {
    const summary = summarizeProtection(validProtection(), {
      repo: 'meijer1973/4veco-platform',
      branch: 'main',
    });

    expect(summary.ok).toBe(true);
    expect(summary.failures).toEqual([]);
    expect(summary.observed.required_status_checks.contexts).toContain('validate-platform');
  });

  test('extracts contexts from modern checks shape', () => {
    const contexts = contextsFromProtection({
      required_status_checks: {
        checks: [{ context: 'validate-platform' }, { name: 'lint' }],
      },
    });

    expect(contexts).toEqual(['validate-platform', 'lint']);
  });

  test('reports pull-request review settings without making them required failures', () => {
    const summary = summarizeProtection(validProtection(), {
      pullRequestReviews: {
        dismiss_stale_reviews: false,
        require_code_owner_reviews: false,
        require_last_push_approval: false,
        required_approving_review_count: 1,
      },
    });

    expect(summary.ok).toBe(true);
    expect(summary.observed.required_pull_request_reviews.required).toBe(true);
    expect(summary.observed.required_pull_request_reviews.required_approving_review_count).toBe(1);
    expect(summary.observed.required_pull_request_reviews.bypass_disabled).toBeNull();
  });

  test('reports pull-request review limitation when settings are absent', () => {
    const summary = summarizePullRequestReviews(null, {
      limitation: 'endpoint unavailable',
    });

    expect(summary.required).toBe(false);
    expect(summary.limitation).toBe('endpoint unavailable');
  });

  test.each([
    [
      'admin enforcement false',
      validProtection({ enforce_admins: { enabled: false } }),
      'enforce_admins.enabled must be true',
    ],
    [
      'strict false',
      validProtection({ required_status_checks: { strict: false, contexts: ['validate-platform'] } }),
      'required_status_checks.strict must be true',
    ],
    [
      'missing context',
      validProtection({ required_status_checks: { strict: true, contexts: ['other-check'] } }),
      'required status context missing: validate-platform',
    ],
    [
      'force pushes allowed',
      validProtection({ allow_force_pushes: { enabled: true } }),
      'allow_force_pushes.enabled must be false',
    ],
    [
      'deletions allowed',
      validProtection({ allow_deletions: { enabled: true } }),
      'allow_deletions.enabled must be false',
    ],
  ])('fails when %s', (_label, protection, expectedFailure) => {
    const summary = summarizeProtection(protection);

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain(expectedFailure);
  });
});
