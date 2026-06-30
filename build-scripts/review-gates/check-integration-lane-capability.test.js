const {
  checkIntegrationLaneCapability,
  localLaneCommand,
} = require('./check-integration-lane-capability');

function branchProtection(overrides = {}) {
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
    required_conversation_resolution: {
      enabled: true,
    },
    required_pull_request_reviews: {
      dismiss_stale_reviews: false,
      require_code_owner_reviews: false,
      require_last_push_approval: false,
      required_approving_review_count: 0,
      bypass_pull_request_allowances: {
        users: [],
        teams: [],
        apps: [],
      },
    },
    ...overrides,
  };
}

function runnerForProtection(protection) {
  return jest.fn((args) => {
    if (args[0] === 'auth') return 'Logged in to github.com as owner';
    const endpoint = args[1];
    if (endpoint.endsWith('/required_pull_request_reviews')) {
      return JSON.stringify(protection.required_pull_request_reviews);
    }
    if (endpoint.endsWith('/protection')) {
      return JSON.stringify(protection);
    }
    throw new Error(`unexpected gh call: ${args.join(' ')}`);
  });
}

describe('check-integration-lane-capability', () => {
  test('cloud token can read branch protection and supports the cloud lane', () => {
    const result = checkIntegrationLaneCapability(
      {
        env: { GITHUB_ACTIONS: 'true', GH_TOKEN: 'token' },
        prNumber: 182,
        authorizationCommentId: 123,
      },
      { runGh: runnerForProtection(branchProtection()) }
    );

    expect(result).toMatchObject({
      ok: true,
      classification: 'cloud_lane_supported',
      recommended_next_path: 'github_hosted_workflow',
      branch_protection: { ok: true },
    });
    expect(result.handoff_command).toBe(
      localLaneCommand('meijer1973/4veco-platform', 182, 123)
    );
  });

  test('local owner-authenticated CLI can read branch protection and supports the local lane', () => {
    const result = checkIntegrationLaneCapability(
      {
        env: {},
        prNumber: 182,
        authorizationCommentId: 123,
      },
      { runGh: runnerForProtection(branchProtection()) }
    );

    expect(result).toMatchObject({
      ok: true,
      classification: 'local_owner_lane_required',
      recommended_next_path: 'owner_authenticated_local_lane',
      branch_protection: { ok: true },
    });
    expect(result.validated_checks).toEqual(expect.arrayContaining([
      'branch_protection',
      'required_status_contexts',
      'approval_count_zero',
    ]));
  });

  test('branch-protection read 403 returns recognized handoff to local lane', () => {
    const runGh = jest.fn((args) => {
      if (args[0] === 'auth') return 'Logged in through workflow token';
      throw new Error('gh api repos/meijer1973/4veco-platform/branches/main/protection failed: Resource not accessible by integration (HTTP 403)');
    });

    const result = checkIntegrationLaneCapability(
      {
        env: { GITHUB_ACTIONS: 'true', GH_TOKEN: 'token' },
        prNumber: 182,
        authorizationCommentId: 123,
      },
      { runGh }
    );

    expect(result).toMatchObject({
      ok: false,
      classification: 'branch_protection_read_forbidden',
      phase: 'branch_protection_read_forbidden',
      recommended_next_path: 'owner_authenticated_local_lane',
      failures: ['branch_protection_read_forbidden'],
    });
    expect(result.handoff_command).toContain('npm.cmd run integrate:authorized-pr');
    expect(result.handoff_command).toContain('--authorization-comment-id 123');
  });

  test('unsafe branch-protection shape fails closed', () => {
    const result = checkIntegrationLaneCapability(
      { env: {} },
      {
        runGh: runnerForProtection(branchProtection({
          required_status_checks: {
            strict: true,
            contexts: ['validate-platform', 'integration-authorized'],
          },
        })),
      }
    );

    expect(result).toMatchObject({
      ok: false,
      classification: 'unexpected_branch_protection_shape',
    });
    expect(result.failures).toContain('unexpected required status context: integration-authorized');
  });

  test('no usable auth fails closed', () => {
    const runGh = jest.fn(() => {
      throw new Error('gh auth status failed: not logged into github.com');
    });

    const result = checkIntegrationLaneCapability({ env: {} }, { runGh });

    expect(result).toMatchObject({
      ok: false,
      classification: 'auth_missing',
      recommended_next_path: 'owner_authenticated_local_lane',
      failures: ['auth_missing'],
    });
  });
});
