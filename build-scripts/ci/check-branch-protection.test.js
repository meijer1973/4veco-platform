const {
  contextsFromProtection,
  EXPECTED_APPROVING_REVIEW_COUNT,
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
    required_pull_request_reviews: {
      dismiss_stale_reviews: false,
      require_code_owner_reviews: false,
      require_last_push_approval: false,
      required_approving_review_count: EXPECTED_APPROVING_REVIEW_COUNT,
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
    expect(summary.expected.required_pull_request_reviews.required_approving_review_count).toBe(0);
    expect(summary.observed.required_pull_request_reviews.required_approving_review_count).toBe(0);
  });

  test('extracts contexts from modern checks shape', () => {
    const contexts = contextsFromProtection({
      required_status_checks: {
        checks: [{ context: 'validate-platform' }, { name: 'lint' }],
      },
    });

    expect(contexts).toEqual(['validate-platform', 'lint']);
  });

  test('fails if approving review count returns to one', () => {
    const summary = summarizeProtection(validProtection(), {
      pullRequestReviews: {
        dismiss_stale_reviews: false,
        require_code_owner_reviews: false,
        require_last_push_approval: false,
        required_approving_review_count: 1,
      },
    });

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('required_approving_review_count must be 0');
    expect(summary.observed.required_pull_request_reviews.required).toBe(true);
    expect(summary.observed.required_pull_request_reviews.required_approving_review_count).toBe(1);
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
    [
      'pull-request review settings missing',
      validProtection({ required_pull_request_reviews: null }),
      'pull-request review settings must be available',
    ],
    [
      'stale review dismissal enabled',
      validProtection({
        required_pull_request_reviews: {
          dismiss_stale_reviews: true,
          require_code_owner_reviews: false,
          require_last_push_approval: false,
          required_approving_review_count: 0,
        },
      }),
      'dismiss_stale_reviews must be false',
    ],
    [
      'code-owner reviews enabled',
      validProtection({
        required_pull_request_reviews: {
          dismiss_stale_reviews: false,
          require_code_owner_reviews: true,
          require_last_push_approval: false,
          required_approving_review_count: 0,
        },
      }),
      'require_code_owner_reviews must be false',
    ],
    [
      'last-push approval enabled',
      validProtection({
        required_pull_request_reviews: {
          dismiss_stale_reviews: false,
          require_code_owner_reviews: false,
          require_last_push_approval: true,
          required_approving_review_count: 0,
        },
      }),
      'require_last_push_approval must be false',
    ],
  ])('fails when %s', (_label, protection, expectedFailure) => {
    const summary = summarizeProtection(protection);

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain(expectedFailure);
  });
});
