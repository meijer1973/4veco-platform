const {
  enforceLineagePolicy,
  fetchBranchProtectionSummary,
  integrate,
  branchProtectionReadForbiddenSummary,
  readinessCommentFromComments,
  readinessMarkerFor,
  runIntegrationAttempts,
  setCommitStatus,
  summarizeIntegrationBranchProtection,
  supplementalFromReadinessDecision,
  isBranchProtectionReadForbiddenSummary,
  localLaneHandoffCommand,
  parseIntegrationLeadReview,
  validatePrState,
  validateIntegrationLeadReview,
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
    payload_ancestor_of_integration_head: true,
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

function branchProtectionWithContexts(contexts) {
  return {
    required_status_checks: {
      strict: true,
      contexts,
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
  };
}

function integrationHarness(overrides = {}) {
  const calls = {
    events: [],
    statuses: [],
    updates: [],
    readiness: [],
    merges: [],
    autoMerges: [],
    disableAutoMerges: [],
    autoMergeStates: [],
    waitForPrMerge: [],
    postMergeCi: [],
  };
  const deps = {
    fetchAuthorizationComment: jest.fn(() => authorizationRecord()),
    validateAuthorizationRecord: jest.fn(() => ({ ok: true, failures: [] })),
    fetchPr: sequence([cleanPr()]),
    setCommitStatus: jest.fn((repo, sha, state, description, targetUrl, statusOptions = {}) => {
      calls.statuses.push({ repo, sha, state, description, dryRun: statusOptions.dryRun === true });
      calls.events.push({ type: 'status', repo, sha, state, description, dryRun: statusOptions.dryRun === true });
      return { ok: true };
    }),
    fetchMainSha: jest.fn(() => mainSha),
    fetchBranchProtectionSummary: jest.fn(() => ({ ok: true, required_approving_review_count: 0 })),
    fetchRepositoryMergeSettings: jest.fn(() => ({
      repo: 'meijer1973/4veco-platform',
      allow_auto_merge: true,
      allow_merge_commit: true,
    })),
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
    generateAndApplyReadiness: jest.fn((repo, prNumber, authorization, lineage, branchProtection, readinessOptions = {}) => {
      calls.readiness.push({ repo, prNumber, authorization, lineage, branchProtection, options: readinessOptions });
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
    scheduleAutoMergePr: jest.fn((repo, prNumber, sha) => {
      calls.autoMerges.push({ repo, prNumber, sha });
      calls.events.push({ type: 'auto_merge', repo, prNumber, sha });
      return { auto_merge_scheduled: true, head_sha: sha };
    }),
    disableAutoMergePr: jest.fn((repo, prNumber) => {
      calls.disableAutoMerges.push({ repo, prNumber });
      return { ok: true, disabled: true };
    }),
    fetchAutoMergeState: jest.fn((repo, prNumber) => {
      calls.autoMergeStates.push({ repo, prNumber });
      calls.events.push({ type: 'auto_merge_state', repo, prNumber });
      return {
        ...cleanPr(integrationSha),
        autoMergeRequest: { enabledAt: '2026-06-29T00:00:00Z' },
        mergeStateStatus: 'BLOCKED',
      };
    }),
    fetchCombinedCommitStatus: jest.fn((repo, sha) => ({
      state: 'success',
      sha,
      statuses: [{ context: 'integration-authorized', state: 'success' }],
      repository: { full_name: repo },
    })),
    waitForPrMerge: jest.fn((repo, prNumber, sha) => {
      calls.waitForPrMerge.push({ repo, prNumber, sha });
      return { ok: true, pr: { state: 'MERGED', mergeCommit: { oid: mergeSha }, headRefOid: sha } };
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

  test('integration-head lead review supersedes stale payload readiness lead proof', () => {
    const payloadDecision = readyDecision({
      proof: {
        ...readyDecision().proof,
        lead_review_path: 'reports/sprints/OLD-lead-review-round2.md',
        lead_reviewed_sha: headSha,
      },
    });
    const review = {
      result: 'PASS',
      review_path: 'reports/sprints/NEW-lead-review-round3.md',
      reviewed_payload_head_sha: payloadSha,
      integration_head_sha: integrationSha,
      scope: 'integration-head lineage/effective-payload review',
    };
    const supplemental = supplementalFromReadinessDecision(
      payloadDecision,
      authorizationRecord(),
      okLineage(integrationSha),
      { ok: true, required_approving_review_count: 0 },
      { integrationLeadReview: review }
    );

    expect(supplemental.proof.payload_readiness_lead_review).toMatchObject({
      path: 'reports/sprints/OLD-lead-review-round2.md',
      reviewed_commit_sha: headSha,
    });
    expect(supplemental.proof.lead_review).toEqual({
      path: 'reports/sprints/NEW-lead-review-round3.md',
      result: 'PASS',
      reviewed_commit_sha: integrationSha,
    });
  });

  test('integration-head lead review parser accepts markdown review records', () => {
    const parsed = parseIntegrationLeadReview([
      '# Lead Review',
      'Verdict: **PASS**',
      `Reviewed integration head: \`${integrationSha}\``,
      `Reviewed payload head: \`${payloadSha}\``,
    ].join('\n'), 'reports/sprints/example-lead-review-round3.md');

    expect(parsed).toMatchObject({
      result: 'PASS',
      integration_head_sha: integrationSha,
      reviewed_payload_head_sha: payloadSha,
      path: 'reports/sprints/example-lead-review-round3.md',
    });
  });

  test('integration-head lead review requires refresh verification for allowlisted evidence tail', () => {
    const reviewedIntegrationHead = '1'.repeat(40);
    const finalHead = '2'.repeat(40);
    const lineage = {
      ...okLineage(finalHead),
      requires_deterministic_refresh: false,
      intervening_commits: [
        { sha: reviewedIntegrationHead, classification: 'conflict_free_main_base_sync_merge', invalidating: false },
        {
          sha: finalHead,
          classification: 'allowlisted_deterministic_evidence_refresh',
          invalidating: false,
          changed_paths: ['reports/github-agent-index-platform.md'],
        },
      ],
    };
    const review = {
      result: 'PASS',
      review_path: 'reports/sprints/example-lead-review-round3.md',
      reviewed_payload_head_sha: payloadSha,
      integration_head_sha: reviewedIntegrationHead,
    };

    expect(validateIntegrationLeadReview(review, lineage, { deterministicRefreshVerified: true })).toMatchObject({
      ok: true,
      failures: [],
    });
    expect(validateIntegrationLeadReview(review, lineage)).toMatchObject({
      ok: false,
      failures: expect.arrayContaining(['integration_lead_review_deterministic_refresh_not_verified']),
    });
  });

  test('integration-head lead review rejects wrong payload, wrong head, and non-passing result', () => {
    const review = {
      result: 'REQUEST_CHANGES',
      review_path: 'reports/sprints/example-lead-review-round3.md',
      reviewed_payload_head_sha: '9'.repeat(40),
      integration_head_sha: '8'.repeat(40),
    };

    expect(validateIntegrationLeadReview(review, okLineage(integrationSha))).toMatchObject({
      ok: false,
      failures: expect.arrayContaining([
        'integration_lead_review_result_not_passing',
        'integration_lead_review_payload_mismatch',
        'integration_lead_review_head_not_in_lineage',
      ]),
    });
  });

  test('integration-head lead review fails closed when supplied review is stale after non-evidence tail', () => {
    const reviewedIntegrationHead = '1'.repeat(40);
    const finalHead = '2'.repeat(40);
    const lineage = {
      ...okLineage(finalHead),
      intervening_commits: [
        { sha: reviewedIntegrationHead, classification: 'conflict_free_main_base_sync_merge', invalidating: false },
        {
          sha: finalHead,
          classification: 'substantive_pr_authored_commit_after_authorization',
          invalidating: true,
          changed_paths: ['build-scripts/review-gates/integrate-authorized-pr.js'],
        },
      ],
    };

    expect(validateIntegrationLeadReview({
      result: 'PASS',
      review_path: 'reports/sprints/example-lead-review-round3.md',
      reviewed_payload_head_sha: payloadSha,
      integration_head_sha: reviewedIntegrationHead,
    }, lineage)).toMatchObject({
      ok: false,
      failures: expect.arrayContaining(['integration_lead_review_tail_not_evidence_only']),
    });
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

  test('does not auto-detect integration-authorized as activation authority', () => {
    const summary = summarizeIntegrationBranchProtection(
      branchProtectionWithContexts(['validate-platform', 'integration-authorized'])
    );

    expect(summary.ok).toBe(false);
    expect(summary.integration_authorized_required).toBe(false);
    expect(summary.observed_integration_authorized_required).toBe(true);
    expect(summary.expected.required_status_checks.contexts).toEqual(['validate-platform']);
    expect(summary.failures).toContain('unexpected required status context: integration-authorized');
  });

  test('forced activated branch protection fails when integration-authorized is missing', () => {
    const summary = summarizeIntegrationBranchProtection(
      branchProtectionWithContexts(['validate-platform']),
      { requireIntegrationAuthorized: true }
    );

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('required status context missing: integration-authorized');
  });

  test('live branch-protection fetch forwards forced activated mode', () => {
    const protection = branchProtectionWithContexts(['validate-platform']);
    const runner = jest.fn((args) => {
      const endpoint = args[1];
      if (endpoint.endsWith('/required_pull_request_reviews')) {
        return JSON.stringify(protection.required_pull_request_reviews);
      }
      return JSON.stringify(protection);
    });

    const summary = fetchBranchProtectionSummary(
      'meijer1973/4veco-platform',
      { requireIntegrationAuthorized: true },
      runner
    );

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('required status context missing: integration-authorized');
    expect(summary.expected.required_status_checks.contexts).toEqual([
      'validate-platform',
      'integration-authorized',
    ]);
  });

  test('live branch-protection fetch recognizes workflow-token HTTP 403', () => {
    const runner = jest.fn(() => {
      throw new Error('gh api repos/meijer1973/4veco-platform/branches/main/protection failed: Resource not accessible by integration (HTTP 403)');
    });

    const summary = fetchBranchProtectionSummary('meijer1973/4veco-platform', {}, runner);

    expect(summary).toMatchObject({
      ok: false,
      phase: 'branch_protection_read_forbidden',
      recommended_next_path: 'owner_authenticated_local_lane',
      failures: ['branch_protection_read_forbidden'],
    });
    expect(isBranchProtectionReadForbiddenSummary(summary)).toBe(true);
  });

  test('legacy activated branch-protection shape is only accepted by explicit checker request', () => {
    const summary = summarizeIntegrationBranchProtection(
      branchProtectionWithContexts(['validate-platform', 'integration-authorized']),
      { requireIntegrationAuthorized: true }
    );

    expect(summary.ok).toBe(true);
    expect(summary.integration_authorized_required).toBe(true);
    expect(summary.observed_integration_authorized_required).toBe(true);
  });

  test('runner rejects observed integration-authorized required context before merge', () => {
    const { options } = integrationHarness({
      deps: {
        fetchBranchProtectionSummary: jest.fn(() => summarizeIntegrationBranchProtection(
          branchProtectionWithContexts(['validate-platform', 'integration-authorized'])
        )),
      },
      options: { noMerge: true },
    });

    const result = integrate(options);

    expect(result).toMatchObject({ ok: false, phase: 'branch_protection' });
    expect(result.branch_protection.failures).toContain('unexpected required status context: integration-authorized');
  });

  test('runner returns a local-lane handoff when branch-protection read is forbidden', () => {
    const forbidden = branchProtectionReadForbiddenSummary(
      'meijer1973/4veco-platform',
      'main',
      new Error('Resource not accessible by integration (HTTP 403)')
    );
    const { calls, deps, options } = integrationHarness({
      deps: {
        fetchBranchProtectionSummary: jest.fn(() => forbidden),
      },
    });

    const result = integrate(options);

    expect(result).toMatchObject({
      ok: false,
      phase: 'branch_protection_read_forbidden',
      checkpoint: 'initial_branch_protection',
      recommended_next_path: 'owner_authenticated_local_lane',
      failures: ['branch_protection_read_forbidden'],
    });
    expect(result.handoff_command).toBe(
      localLaneHandoffCommand('meijer1973/4veco-platform', 136, 12345)
    );
    expect(calls.statuses.map((status) => status.state)).toEqual(['pending', 'failure']);
    expect(calls.merges).toEqual([]);
    expect(deps.mergePr).not.toHaveBeenCalled();
  });

  test('runner rejects forced retired activated mode before scheduling auto-merge', () => {
    const { calls, deps, options } = integrationHarness({
      deps: {
        fetchBranchProtectionSummary: jest.fn(() => summarizeIntegrationBranchProtection(
          branchProtectionWithContexts(['validate-platform', 'integration-authorized']),
          { requireIntegrationAuthorized: true }
        )),
      },
      options: { requireIntegrationAuthorized: true },
    });

    const result = integrate(options);

    expect(result).toMatchObject({ ok: false, phase: 'retired_activated_mode' });
    expect(result.failures).toContain('integration-authorized required-context activation is retired; keep it optional audit evidence');
    expect(calls.autoMerges).toEqual([]);
    expect(calls.merges).toEqual([]);
    expect(deps.mergePr).not.toHaveBeenCalled();
    expect(deps.scheduleAutoMergePr).not.toHaveBeenCalled();
  });

  test('current live branch protection keeps the trusted direct merge path', () => {
    const { calls, deps, options } = integrationHarness();

    const result = integrate(options);

    expect(result).toMatchObject({ ok: true, phase: 'merged', activated_merge: false });
    expect(result.payload_integration_state).toMatchObject({
      payload_state: 'PAYLOAD_AUTHORIZED',
      integration_state: 'READY_TO_MERGE_VIA_LANE',
      reviewed_payload_head_sha: payloadSha,
      current_pr_head_sha: integrationSha,
      integration_head_sha: integrationSha,
      lineage_status: 'valid',
      effective_payload_status: 'unchanged',
      renewed_owner_authorization: 'not_required_unless_payload_changes',
    });
    expect(calls.merges).toEqual([
      { repo: 'meijer1973/4veco-platform', prNumber: 136, sha: integrationSha },
    ]);
    expect(calls.autoMerges).toEqual([]);
    expect(deps.scheduleAutoMergePr).not.toHaveBeenCalled();
  });

  test('owner-authenticated local lane still validates authorization, lineage, readiness, review state, and post-merge CI', () => {
    const { calls, deps, options } = integrationHarness();

    const result = integrate(options);

    expect(result).toMatchObject({ ok: true, phase: 'merged' });
    expect(deps.fetchAuthorizationComment).toHaveBeenCalledWith(
      'meijer1973/4veco-platform',
      12345,
      { expectedPr: 136 }
    );
    expect(deps.validateAuthorizationRecord).toHaveBeenCalled();
    expect(deps.fetchBranchProtectionSummary).toHaveBeenCalledTimes(2);
    expect(deps.summarizeLineage).toHaveBeenCalled();
    expect(deps.fetchReviewThreadState).toHaveBeenCalledTimes(2);
    expect(deps.generateAndApplyReadiness).toHaveBeenCalledTimes(1);
    expect(calls.postMergeCi).toEqual([
      { repo: 'meijer1973/4veco-platform', sha: mergeSha },
    ]);
  });

  test('lane passes validated integration-head lead review into readiness generation', () => {
    const { calls, options } = integrationHarness({
      options: {
        integrationLeadReview: {
          result: 'PASS',
          review_path: 'reports/sprints/example-lead-review-round3.md',
          reviewed_payload_head_sha: payloadSha,
          integration_head_sha: integrationSha,
        },
      },
    });

    const result = integrate(options);

    expect(result).toMatchObject({ ok: true, phase: 'merged' });
    expect(calls.readiness[0].options.integrationLeadReview).toMatchObject({
      path: 'reports/sprints/example-lead-review-round3.md',
      result: 'PASS',
      reviewed_payload_head_sha: payloadSha,
      integration_head_sha: integrationSha,
    });
  });

  test('lane fails closed when supplied integration-head lead review is invalid', () => {
    const { calls, options } = integrationHarness({
      options: {
        integrationLeadReview: {
          result: 'REQUEST_CHANGES',
          review_path: 'reports/sprints/example-lead-review-round3.md',
          reviewed_payload_head_sha: payloadSha,
          integration_head_sha: integrationSha,
        },
      },
    });

    const result = integrate(options);

    expect(result).toMatchObject({ ok: false, phase: 'integration_head_lead_review_invalid' });
    expect(calls.statuses).toContainEqual(expect.objectContaining({
      state: 'failure',
      description: expect.stringContaining('Integration-head lead review invalid'),
    }));
    expect(calls.merges).toEqual([]);
  });

  test('runner fails when activated branch protection has an extra required context', () => {
    const { options } = integrationHarness({
      deps: {
        fetchBranchProtectionSummary: jest.fn(() => summarizeIntegrationBranchProtection(
          branchProtectionWithContexts(['validate-platform', 'integration-authorized', 'unexpected-extra'])
        )),
      },
      options: { noMerge: true },
    });

    const result = integrate(options);

    expect(result).toMatchObject({ ok: false, phase: 'branch_protection' });
    expect(result.branch_protection.failures).toContain('unexpected required status context: unexpected-extra');
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
    expect(result.payload_integration_state).toMatchObject({
      integration_validation: 'passed',
      required_next_action: 'merge through the serialized integration lane',
    });
    expect(deps.updateBranch).not.toHaveBeenCalled();
    expect(calls.statuses.map((status) => status.state)).toContain('success');
  });

  test('updated branch result reports pending refreshed head instead of stale ready state', () => {
    const refreshedSha = '1'.repeat(40);
    const harness = integrationHarness({
      deps: {
        isHeadCurrentWithMain: jest.fn(() => ({ ok: false, compare: { status: 'behind' } })),
      },
      options: { maxAttempts: 1 },
    });
    const { calls, deps, options } = harness;
    deps.updateBranch.mockImplementation((repo, prNumber, expectedHeadSha) => {
      calls.updates.push({ repo, prNumber, expectedHeadSha });
      return { ok: true, head_sha: refreshedSha };
    });

    const result = integrate(options);

    expect(result).toMatchObject({
      ok: true,
      phase: 'updated_branch',
      retry_required: true,
      previous_head_sha: integrationSha,
      pending_head_sha: refreshedSha,
    });
    expect(result.payload_integration_state).toMatchObject({
      current_pr_head_sha: refreshedSha,
      integration_head_sha: integrationSha,
      pending_integration_head_sha: refreshedSha,
      integration_state: 'BRANCH_UPDATE_PENDING',
      integration_validation: 'pending_branch_update',
      required_next_action: 'wait for the branch update to finish, then rerun the serialized integration lane',
    });
    expect(result.payload_integration_state).not.toMatchObject({
      integration_state: 'READY_TO_MERGE_VIA_LANE',
      integration_validation: 'passed',
    });
    expect(calls.updates).toEqual([
      { repo: 'meijer1973/4veco-platform', prNumber: 136, expectedHeadSha: integrationSha },
    ]);
    expect(calls.merges).toEqual([]);
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
    expect(result.payload_integration_state).toMatchObject({
      reviewed_payload_head_sha: payloadSha,
      current_pr_head_sha: refreshedSha,
      integration_head_sha: refreshedSha,
      payload_authorization: 'inherited',
      integration_validation: 'passed',
    });
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
