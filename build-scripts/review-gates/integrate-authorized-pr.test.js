const {
  enforceLineagePolicy,
  integrate,
  readinessCommentFromComments,
  readinessMarkerFor,
  runIntegrationAttempts,
  setCommitStatus,
  supplementalFromReadinessDecision,
  validatePrState,
  waitForMainCi,
} = require('./integrate-authorized-pr');
const { renderDecisionMarkdown } = require('./pr-readiness-router');

const headSha = 'a'.repeat(40);
const payloadSha = 'b'.repeat(40);
const integrationSha = 'c'.repeat(40);
const mainSha = 'd'.repeat(40);
const mergeSha = 'e'.repeat(40);

function readyDecision(overrides = {}) {
  return {
    schema_version: 1,
    reviewed_pr: {
      repo: 'meijer1973/4veco-platform',
      number: 136,
      url: 'https://github.com/meijer1973/4veco-platform/pull/136',
      base: 'main',
      head_sha: headSha,
      was_draft: false,
    },
    throughput: {
      class: 'normal_sprint',
      authority_class: 'high_authority',
      level: 'L4',
    },
    human_review_payload: 'consequential_exception',
    consequence: 'high',
    batching: { viable: false, target: null, reason: null },
    route: 'READY_FOR_HUMAN_REVIEW',
    reason_codes: ['human_authority_consequential_exception'],
    proof: {
      ci_head_sha: headSha,
      ci_status: 'success',
      ci_required_contexts: ['validate-platform'],
      ci_missing_contexts: [],
      ci_checks: [{ name: 'validate-platform', conclusion: 'SUCCESS' }],
      lead_review_path: 'subagent:lead-review',
      lead_review_result: 'PASS',
      lead_reviewed_sha: headSha,
      lead_review_evidence_tail_allowed: false,
      lead_review_integration_authorization_inherited: false,
      post_lead_review_changed_paths: [],
      changed_paths_verified: true,
      checkers: [{ command: 'npm.cmd run check:platform', status: 'success' }],
      branch_protection: {
        required_approving_review_count: 0,
        approval_count_observable: true,
      },
      human_authorization: null,
      integration: null,
    },
    allowed_transition: 'NONE',
    human_notification_required: true,
    ...overrides,
  };
}

function authorizationRecord(overrides = {}) {
  return {
    repository: 'meijer1973/4veco-platform',
    pr_number: 136,
    reviewed_payload_head_sha: payloadSha,
    base_sha_at_review: 'f'.repeat(40),
    decision: 'APPROVE_AND_MERGE',
    decision_scope: 'Test payload authorization.',
    authorization_comment_id: 12345,
    permitted_integration_descendants: [
      'conflict_free_main_base_sync_merge',
      'allowlisted_deterministic_evidence_refresh',
    ],
    invalidation_conditions: [
      'reviewed_payload_not_ancestor',
      'manual_conflict_resolution',
      'substantive_pr_authored_commit_after_authorization',
      'authority_or_scope_change',
      'changed_effective_payload',
    ],
    ...overrides,
  };
}

function cleanPr(sha = integrationSha, overrides = {}) {
  return {
    number: 136,
    url: 'https://github.com/meijer1973/4veco-platform/pull/136',
    state: 'OPEN',
    isDraft: false,
    baseRefName: 'main',
    headRefName: 'test-branch',
    headRefOid: sha,
    mergeStateStatus: 'CLEAN',
    mergeable: true,
    reviewDecision: 'REVIEW_REQUIRED',
    statusCheckRollup: [{ name: 'validate-platform', conclusion: 'SUCCESS' }],
    ...overrides,
  };
}

function okLineage(sha = integrationSha) {
  return {
    ok: true,
    reviewed_payload_head_sha: payloadSha,
    integration_head_sha: sha,
    authorization_inherited: true,
    requires_integration_delta_lead_review: false,
    requires_deterministic_refresh: false,
    failures: [],
    base_drift: { classification: 'no_substantive_overlap' },
  };
}

function sequence(values) {
  let index = 0;
  return jest.fn(() => {
    const value = values[Math.min(index, values.length - 1)];
    index += 1;
    return value;
  });
}

function integrationHarness(overrides = {}) {
  const calls = {
    statuses: [],
    updates: [],
    readiness: [],
    merges: [],
    postMergeCi: [],
  };
  const deps = {
    fetchAuthorizationComment: jest.fn(() => authorizationRecord()),
    validateAuthorizationRecord: jest.fn(() => ({ ok: true, failures: [] })),
    fetchPr: sequence([cleanPr()]),
    setCommitStatus: jest.fn((repo, sha, state, description) => {
      calls.statuses.push({ repo, sha, state, description });
      return { ok: true };
    }),
    fetchMainSha: jest.fn(() => mainSha),
    fetchBranchProtectionSummary: jest.fn(() => ({ ok: true, required_approving_review_count: 0 })),
    fetchReviewThreadState: jest.fn(() => ({
      available: true,
      unresolved_count: 0,
      requested_changes_count: 0,
    })),
    buildLineageInput: jest.fn((_repo, authorization, pr) => ({
      authorization,
      pr,
    })),
    summarizeLineage: jest.fn((input) => okLineage(input.pr.headRefOid)),
    enforceLineagePolicy,
    isHeadCurrentWithMain: jest.fn(() => ({ ok: true, compare: { status: 'ahead' } })),
    updateBranch: jest.fn((repo, prNumber, expectedHeadSha) => {
      calls.updates.push({ repo, prNumber, expectedHeadSha });
      return { ok: true };
    }),
    validatePrState,
    generateAndApplyReadiness: jest.fn((repo, prNumber, authorization, lineage) => {
      calls.readiness.push({ repo, prNumber, authorization, lineage });
      return {
        ok: true,
        phase: 'readiness',
        decision: readyDecision({
          reviewed_pr: {
            ...readyDecision().reviewed_pr,
            head_sha: lineage.integration_head_sha,
          },
        }),
      };
    }),
    mergePr: jest.fn((repo, prNumber, sha) => {
      calls.merges.push({ repo, prNumber, sha });
      return { merged: true, head_sha: sha };
    }),
    fetchMergedPr: jest.fn(() => ({ state: 'MERGED', mergeCommit: { oid: mergeSha } })),
    fetchCompareStatus: jest.fn(() => ({ status: 'ahead' })),
    waitForMainCi: jest.fn((repo, sha) => {
      calls.postMergeCi.push({ repo, sha });
      return { ok: true, run: { conclusion: 'success', headSha: sha } };
    }),
    ...(overrides.deps || {}),
  };
  return {
    calls,
    deps,
    options: {
      repo: 'meijer1973/4veco-platform',
      prNumber: 136,
      authorizationCommentId: 12345,
      maxAttempts: 4,
      pollSeconds: 0,
      deps,
      ...(overrides.options || {}),
    },
  };
}

describe('authorized PR integration runner', () => {
  test('refuses a stale or missing validate-platform check before merge', () => {
    const failures = validatePrState({
      state: 'OPEN',
      isDraft: false,
      baseRefName: 'main',
      mergeable: true,
      mergeStateStatus: 'CLEAN',
      statusCheckRollup: [{ name: 'lint', conclusion: 'SUCCESS' }],
    });

    expect(failures).toContain('validate_platform_missing_or_not_successful');
  });

  test('accepts open clean PR state with successful validate-platform', () => {
    const failures = validatePrState({
      state: 'OPEN',
      isDraft: false,
      baseRefName: 'main',
      mergeable: true,
      mergeStateStatus: 'CLEAN',
      statusCheckRollup: [{ name: 'validate-platform', conclusion: 'SUCCESS' }],
    });

    expect(failures).toEqual([]);
  });

  test('rejects a PR whose base is not main', () => {
    const failures = validatePrState({
      state: 'OPEN',
      isDraft: false,
      baseRefName: 'release',
      mergeable: true,
      mergeStateStatus: 'CLEAN',
      statusCheckRollup: [{ name: 'validate-platform', conclusion: 'SUCCESS' }],
    });

    expect(failures).toContain('pr_base_must_be_main');
  });

  test('accepts an exact-head ready PR-readiness comment with a machine decision and digest', () => {
    const decision = readyDecision();
    const readiness = readinessCommentFromComments(
      [{ id: 12, body: renderDecisionMarkdown(decision) }],
      'meijer1973/4veco-platform',
      136,
      headSha
    );

    expect(readiness).toMatchObject({
      ok: true,
      comment_id: 12,
      route: 'READY_FOR_HUMAN_REVIEW',
    });
    expect(readiness.digest).toMatch(/^[a-f0-9]{64}$/);
  });

  test('rejects a minimal exact-head readiness markdown comment', () => {
    const marker = readinessMarkerFor('meijer1973/4veco-platform', 136, headSha);
    const readiness = readinessCommentFromComments(
      [{ id: 12, body: `${marker}\n- Route: \`READY_FOR_HUMAN_REVIEW\`` }],
      'meijer1973/4veco-platform',
      136,
      headSha
    );

    expect(readiness).toMatchObject({
      ok: false,
      failure: 'exact_head_readiness_machine_decision_invalid',
    });
  });

  test('rejects a stale PR-readiness comment for a previous head', () => {
    const readiness = readinessCommentFromComments(
      [{ id: 12, body: renderDecisionMarkdown(readyDecision()) }],
      'meijer1973/4veco-platform',
      136,
      'b'.repeat(40)
    );

    expect(readiness).toMatchObject({
      ok: false,
      failure: 'exact_head_readiness_comment_missing',
    });
  });

  test('rejects an exact-head PR-readiness comment that is not ready', () => {
    const decision = readyDecision({
      route: 'KEEP_DRAFT_REVISE',
      reason_codes: ['checker_proof_missing_or_not_successful'],
      corrections: ['checker_proof_missing_or_not_successful'],
    });
    const readiness = readinessCommentFromComments(
      [{ id: 12, body: renderDecisionMarkdown(decision) }],
      'meijer1973/4veco-platform',
      136,
      headSha
    );

    expect(readiness).toMatchObject({
      ok: false,
      comment_id: 12,
      route: 'KEEP_DRAFT_REVISE',
      failure: 'exact_head_readiness_comment_not_ready',
    });
  });

  test('substantive base overlap requires delta-review evidence', () => {
    const lineage = {
      ok: true,
      reviewed_payload_head_sha: 'b'.repeat(40),
      integration_head_sha: 'c'.repeat(40),
      authorization_inherited: true,
      requires_integration_delta_lead_review: true,
      requires_deterministic_refresh: false,
      failures: [],
      base_drift: { classification: 'substantive_overlap' },
    };

    expect(enforceLineagePolicy(lineage)).toMatchObject({
      ok: false,
      phase: 'integration_delta_lead_review_required',
    });
    expect(enforceLineagePolicy(lineage, {
      deltaReview: {
        result: 'PASS',
        reviewed_payload_head_sha: 'b'.repeat(40),
        integration_head_sha: 'c'.repeat(40),
        path: 'subagent:delta-review',
      },
    })).toMatchObject({ ok: true });
  });

  test('deterministic refresh requirement cannot be ignored', () => {
    const lineage = {
      ok: true,
      reviewed_payload_head_sha: 'b'.repeat(40),
      integration_head_sha: 'c'.repeat(40),
      authorization_inherited: true,
      requires_integration_delta_lead_review: false,
      requires_deterministic_refresh: true,
      failures: [],
      base_drift: { classification: 'allowlisted_generated_or_evidence_overlap' },
    };

    expect(enforceLineagePolicy(lineage)).toMatchObject({
      ok: false,
      phase: 'deterministic_refresh_required',
    });
    expect(enforceLineagePolicy(lineage, { deterministicRefreshVerified: true })).toMatchObject({ ok: true });
  });

  test('supplemental readiness evidence preserves payload lead proof and adds lane checks', () => {
    const supplemental = supplementalFromReadinessDecision(
      readyDecision(),
      { reviewed_payload_head_sha: headSha, decision: 'APPROVE_AND_MERGE' },
      { integration_head_sha: headSha, authorization_inherited: true },
      { ok: true, required_approving_review_count: 0 }
    );

    expect(supplemental.proof.lead_review).toMatchObject({
      result: 'PASS',
      reviewed_commit_sha: headSha,
    });
    expect(supplemental.proof.checkers.map((checker) => checker.command)).toEqual(
      expect.arrayContaining(['check-human-payload-authorization', 'check-integration-lineage', 'check-branch-protection'])
    );
  });

  test('post-merge CI verifier accepts successful main run', () => {
    const result = waitForMainCi('meijer1973/4veco-platform', headSha, { dryRun: true });
    expect(result).toMatchObject({ ok: true, dry_run: true, head_sha: headSha });
  });

  test('dry-run does not mint a reusable integration-authorized success status', () => {
    const result = setCommitStatus(
      'meijer1973/4veco-platform',
      headSha,
      'success',
      'Would authorize integration',
      'https://github.com/meijer1973/4veco-platform/pull/136',
      { dryRun: true }
    );

    expect(result).toEqual({
      dry_run: true,
      state: 'success',
      sha: headSha,
      context: 'integration-authorized',
    });
  });

  test('required-but-missing integration-authorized does not create a BLOCKED update loop', () => {
    const { calls, deps, options } = integrationHarness({
      deps: {
        fetchPr: sequence([cleanPr(integrationSha, { mergeStateStatus: 'BLOCKED' }), cleanPr(integrationSha, { mergeStateStatus: 'BLOCKED' }), cleanPr(integrationSha, { mergeStateStatus: 'BLOCKED' })]),
      },
      options: { noMerge: true },
    });

    const result = integrate(options);

    expect(result.phase).toBe('authorized_no_merge');
    expect(deps.updateBranch).not.toHaveBeenCalled();
    expect(calls.statuses.map((status) => status.state)).toContain('success');
  });

  test('branch update automatically retries through CI, readiness generation, merge, and post-merge main CI', () => {
    const refreshedSha = '1'.repeat(40);
    const { calls, deps, options } = integrationHarness({
      deps: {
        fetchPr: sequence([
          cleanPr(integrationSha),
          cleanPr(refreshedSha),
          cleanPr(refreshedSha),
          cleanPr(refreshedSha),
        ]),
        isHeadCurrentWithMain: sequence([
          { ok: false, compare: { status: 'behind' } },
          { ok: true, compare: { status: 'ahead' } },
          { ok: true, compare: { status: 'ahead' } },
        ]),
      },
      options: { maxAttempts: 2 },
    });

    const result = runIntegrationAttempts(options);

    expect(result).toMatchObject({ ok: true, phase: 'merged', attempt: 2 });
    expect(calls.updates).toEqual([
      { repo: 'meijer1973/4veco-platform', prNumber: 136, expectedHeadSha: integrationSha },
    ]);
    expect(calls.readiness).toHaveLength(1);
    expect(calls.readiness[0].lineage.integration_head_sha).toBe(refreshedSha);
    expect(calls.merges).toEqual([
      { repo: 'meijer1973/4veco-platform', prNumber: 136, sha: refreshedSha },
    ]);
    expect(calls.postMergeCi).toEqual([
      { repo: 'meijer1973/4veco-platform', sha: mergeSha },
    ]);
    expect(deps.generateAndApplyReadiness).toHaveBeenCalledTimes(1);
  });

  test('main advancing after readiness generation retries before setting success status', () => {
    const { calls, deps, options } = integrationHarness({
      deps: {
        fetchMainSha: sequence([mainSha, mainSha, '9'.repeat(40)]),
      },
    });

    const result = integrate(options);

    expect(result).toMatchObject({
      ok: true,
      phase: 'main_moved_before_merge_retry',
      retry_required: true,
    });
    expect(deps.generateAndApplyReadiness).toHaveBeenCalledTimes(1);
    expect(deps.mergePr).not.toHaveBeenCalled();
    expect(calls.statuses.map((status) => status.state)).toEqual(['pending']);
  });

  test('merge rejection clears reusable success authority when main did not move', () => {
    const { calls, options } = integrationHarness({
      deps: {
        mergePr: jest.fn(() => {
          throw new Error('merge blocked by required status');
        }),
      },
    });

    const result = integrate(options);

    expect(result).toMatchObject({ ok: false, phase: 'merge' });
    expect(calls.statuses.map((status) => status.state)).toEqual([
      'pending',
      'success',
      'pending',
      'failure',
    ]);
    expect(calls.statuses[calls.statuses.length - 1].description).toContain('Merge rejected');
  });

  test('merge rejection retries when main moved after the merge attempt', () => {
    const { calls, options } = integrationHarness({
      deps: {
        fetchMainSha: sequence([mainSha, mainSha, mainSha, '8'.repeat(40)]),
        mergePr: jest.fn(() => {
          throw new Error('base branch was modified');
        }),
      },
    });

    const result = integrate(options);

    expect(result).toMatchObject({
      ok: true,
      phase: 'merge_rejected_main_moved_retry',
      retry_required: true,
    });
    expect(calls.statuses.map((status) => status.state)).toEqual(['pending', 'success', 'pending']);
  });
});
