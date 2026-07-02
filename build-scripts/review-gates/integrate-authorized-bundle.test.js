const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  integrateBundle,
  INTEGRATION_CONTEXT,
  PLATFORM_REPO,
  LESSON_REPO,
  selectLatestRunForHead,
  setPlatformIntegrationStatus,
  validateCompatibilityWorkflowProvenance,
  validatePlatformCiEvidence,
} = require('./integrate-authorized-bundle');

const platformBase = '1'.repeat(40);
const platformHead = '2'.repeat(40);
const lessonBase = '3'.repeat(40);
const lessonHead = '4'.repeat(40);
const platformMerge = '5'.repeat(40);
const lessonMerge = '6'.repeat(40);

function authorization() {
  return {
    schema_version: 1,
    decision: 'APPROVE_BUNDLE_AND_MERGE',
    bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
    controller: {
      repository: PLATFORM_REPO,
      pr_number: 140,
      reviewed_payload_head_sha: platformHead,
    },
    members: [
      {
        repository: LESSON_REPO,
        pr_number: 34,
        reviewed_payload_head_sha: lessonHead,
      },
    ],
    decision_scope: 'Graph-transfer bundle.',
    merge_order: 'CI_SELECTED',
    invalidation_conditions: [
      'member_payload_not_ancestor',
      'substantive_member_change',
      'bundle_membership_change',
      'effective_product_change',
      'no_green_intermediate_order',
    ],
  };
}

function pr(repo, number, head, overrides = {}) {
  return {
    number,
    url: `https://github.com/${repo}/pull/${number}`,
    state: 'OPEN',
    isDraft: false,
    baseRefName: 'main',
    headRefName: `codex/pr-${number}`,
    headRefOid: head,
    mergeStateStatus: 'CLEAN',
    mergeable: true,
    statusCheckRollup: repo === PLATFORM_REPO ? [{ name: 'validate-platform', conclusion: 'SUCCESS' }] : [],
    ...overrides,
  };
}

function compatibility(order = 'lesson-first', overrides = {}) {
  const exactMembers = {
    platform_base_sha: platformBase,
    platform_candidate_sha: platformHead,
    lesson_base_sha: lessonBase,
    lesson_candidate_sha: lessonHead,
    ...(overrides.exact_members || {}),
  };
  return {
    ok: true,
    bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
    exact_members: exactMembers,
    permitted_merge_orders: order === 'both' ? ['platform-first', 'lesson-first'] : [order],
    recommended_merge_order: order === 'both' ? 'lesson-first' : order,
    failures: [],
    ...overrides,
    exact_members: exactMembers,
  };
}

function compatibilitySummary(overrides = {}) {
  return {
    ...compatibility('lesson-first'),
    provenance: {
      workflow: 'cross-repo-bundle-compatibility',
      workflow_ref: `${PLATFORM_REPO}/.github/workflows/cross-repo-bundle-compatibility.yml@refs/heads/main`,
      workflow_sha: platformBase,
      run_id: '123',
      event_name: 'workflow_dispatch',
      inputs: {
        bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
        ...compatibility('lesson-first').exact_members,
      },
    },
    ...overrides,
  };
}

function branchProtectionSummary(activated = false) {
  return {
    ok: true,
    failures: [],
    integration_authorized_required: activated,
    observed: {
      required_status_checks: {
        contexts: activated ? ['validate-platform', 'integration-authorized'] : ['validate-platform'],
      },
    },
  };
}

function harness(overrides = {}) {
  const calls = {
    events: [],
    statuses: [],
    merges: [],
    autoMerges: [],
    disableAutoMerges: [],
    waitForPrMerge: [],
    ciTriggers: [],
    ciWaits: [],
    refreshes: [],
    updates: [],
  };
  const fetchPr = jest.fn((repo) => {
    if (repo === PLATFORM_REPO) return pr(repo, 140, platformHead);
    return pr(repo, 34, lessonHead);
  });
  const deps = {
    fetchMainSha: jest.fn((repo) => {
      if (
        calls.merges.some((merge) => merge.repo === repo) ||
        calls.autoMerges.some((merge) => merge.repo === repo)
      ) {
        return repo === PLATFORM_REPO ? platformMerge : lessonMerge;
      }
      return repo === PLATFORM_REPO ? platformBase : lessonBase;
    }),
    fetchPr,
    fetchBranchProtectionSummary: jest.fn((_repo, fetchOptions = {}) =>
      branchProtectionSummary(fetchOptions.requireIntegrationAuthorized === true)
    ),
    fetchPlatformBranchProtectionSummary: jest.fn(() => branchProtectionSummary(false)),
    fetchRepositoryMergeSettings: jest.fn(() => ({
      repo: PLATFORM_REPO,
      allow_auto_merge: true,
      allow_merge_commit: true,
    })),
    fetchAutoMergeState: jest.fn((repo, prNumber) => {
      calls.events.push({ type: 'auto_merge_state', repo, prNumber });
      return {
        ...pr(repo, prNumber, repo === PLATFORM_REPO ? platformHead : lessonHead),
        autoMergeRequest: { enabledAt: '2026-06-29T00:00:00Z' },
        mergeStateStatus: 'BLOCKED',
      };
    }),
    fetchCombinedCommitStatus: jest.fn((repo, sha) => ({
      state: 'success',
      sha,
      statuses: [{ context: INTEGRATION_CONTEXT, state: 'success' }],
      repository: { full_name: repo },
    })),
    fetchReadinessComment: jest.fn(() => ({
      ok: true,
      route: 'READY_FOR_HUMAN_REVIEW',
      decision: { route: 'READY_FOR_HUMAN_REVIEW' },
    })),
    fetchComparePaths: jest.fn(() => []),
    fetchCompareStatus: jest.fn(() => ({ status: 'identical', ahead_by: 0, behind_by: 0 })),
    fetchInterveningCommits: jest.fn(() => []),
    fetchReviewThreadState: jest.fn(() => ({
      available: true,
      unresolved_count: 0,
      requested_changes_count: 0,
    })),
    latestWorkflowRunDatabaseId: jest.fn(() => 100),
    preflightCrossRepoPermissions: jest.fn(() => ({ ok: true })),
    recomputeCompatibility: jest.fn(() => compatibility('lesson-first')),
    summarizeLineage: jest.fn((input) => ({
      ok: input.payload_ancestor_of_integration_head === true,
      reviewed_payload_head_sha: input.reviewed_payload_head_sha,
      integration_head_sha: input.integration_head_sha,
      authorization_inherited: input.payload_ancestor_of_integration_head === true,
      requires_integration_delta_lead_review: false,
      requires_deterministic_refresh: false,
      failures: input.payload_ancestor_of_integration_head === true ? [] : ['reviewed_payload_head_not_ancestor'],
      base_drift: { classification: 'no_substantive_overlap' },
    })),
    updateBranch: jest.fn((repo, prNumber, expectedHeadSha) => {
      calls.updates.push({ repo, prNumber, expectedHeadSha });
      return { ok: true };
    }),
    mergePr: jest.fn((repo, prNumber, headSha, mergeOptions = {}) => {
      if (mergeOptions.dryRun) return { dry_run: true, repo, prNumber, head_sha: headSha };
      calls.events.push({ type: 'merge', repo, prNumber, headSha });
      calls.merges.push({ repo, prNumber, headSha });
      return { merged: true };
    }),
    scheduleAutoMergePr: jest.fn((repo, prNumber, headSha, mergeOptions = {}) => {
      if (mergeOptions.dryRun) return { dry_run: true, repo, prNumber, head_sha: headSha, auto_merge: true };
      calls.events.push({ type: 'auto_merge', repo, prNumber, headSha });
      calls.autoMerges.push({ repo, prNumber, headSha });
      return { auto_merge_scheduled: true, repo, prNumber, head_sha: headSha };
    }),
    disableAutoMergePr: jest.fn((repo, prNumber) => {
      calls.disableAutoMerges.push({ repo, prNumber });
      return { ok: true, disabled: true };
    }),
    waitForPrMerge: jest.fn((repo, prNumber, headSha) => {
      calls.waitForPrMerge.push({ repo, prNumber, headSha });
      return {
        ok: true,
        pr: {
          state: 'MERGED',
          headRefOid: headSha,
          mergeCommit: { oid: repo === PLATFORM_REPO ? platformMerge : lessonMerge },
        },
      };
    }),
    setCommitStatus: jest.fn((repo, sha, state, description, targetUrl, statusOptions = {}) => {
      const item = { repo, sha, state, description, targetUrl, dryRun: statusOptions.dryRun === true };
      calls.events.push({ type: 'status', ...item });
      calls.statuses.push(item);
      return { ok: true };
    }),
    fetchMergedPr: jest.fn((repo) => ({
      state: 'MERGED',
      mergeCommit: { oid: repo === PLATFORM_REPO ? platformMerge : lessonMerge },
    })),
    triggerPlatformCi: jest.fn(() => {
      calls.events.push({ type: 'trigger_ci' });
      calls.ciTriggers.push(true);
      return { triggered: true };
    }),
    waitForPlatformMainCi: jest.fn((headSha, waitOptions = {}) => {
      calls.events.push({
        type: 'wait_ci',
        headSha,
        expectedPlatformSha: waitOptions.expectedPlatformSha,
        expectedLessonSha: waitOptions.expectedLessonSha,
      });
      calls.ciWaits.push({
        headSha,
        minDatabaseId: waitOptions.minDatabaseId,
        expectedPlatformSha: waitOptions.expectedPlatformSha,
        expectedLessonSha: waitOptions.expectedLessonSha,
      });
      return { ok: true, run: { conclusion: 'success' } };
    }),
    refreshPlatformPrCi: jest.fn((platformPr, refreshOptions = {}) => {
      calls.events.push({
        type: 'refresh_platform_pr_ci',
        headSha: platformPr.headRefOid,
        expectedLessonSha: refreshOptions.expectedLessonSha,
      });
      calls.refreshes.push({
        headSha: platformPr.headRefOid,
        expectedLessonSha: refreshOptions.expectedLessonSha,
      });
      return { ok: true, run: { conclusion: 'success' } };
    }),
    ...(overrides.deps || {}),
  };
  return {
    calls,
    deps,
    options: {
      repo: PLATFORM_REPO,
      prNumber: 140,
      authorization: authorization(),
      deps,
      ...(overrides.options || {}),
    },
  };
}

describe('authorized cross-repo bundle integration', () => {
  test('lesson-first state green merges lesson first, then platform', () => {
    const { calls, options } = harness();
    const result = integrateBundle(options);

    expect(result).toMatchObject({ ok: true, phase: 'merged_bundle', order: 'lesson-first' });
    expect(calls.merges.map((item) => item.repo)).toEqual([LESSON_REPO, PLATFORM_REPO]);
    expect(calls.ciTriggers).toHaveLength(2);
    expect(calls.refreshes).toEqual([{ headSha: platformHead, expectedLessonSha: lessonMerge }]);
    expect(calls.ciWaits[0]).toMatchObject({
      headSha: platformBase,
      expectedPlatformSha: platformBase,
      expectedLessonSha: lessonMerge,
      minDatabaseId: 100,
    });
    expect(calls.statuses.map((status) => status.state)).toEqual(['pending', 'success']);
    expect(calls.statuses[calls.statuses.length - 1]).toMatchObject({
      repo: PLATFORM_REPO,
      sha: platformHead,
      state: 'success',
    });
  });

  test('lesson-first can recover an initially red platform validate-platform check', () => {
    let refreshed = false;
    const { calls, options, deps } = harness({
      deps: {
        fetchPr: jest.fn((repo) => {
          if (repo === PLATFORM_REPO) {
            return pr(repo, 140, platformHead, {
              statusCheckRollup: refreshed
                ? [{ name: 'validate-platform', conclusion: 'SUCCESS' }]
                : [{ name: 'validate-platform', conclusion: 'FAILURE' }],
            });
          }
          return pr(repo, 34, lessonHead);
        }),
        refreshPlatformPrCi: jest.fn(() => {
          refreshed = true;
          calls.refreshes.push({ headSha: platformHead, expectedLessonSha: lessonMerge });
          return { ok: true, run: { conclusion: 'success' } };
        }),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: true, phase: 'merged_bundle', order: 'lesson-first' });
    expect(calls.merges.map((item) => item.repo)).toEqual([LESSON_REPO, PLATFORM_REPO]);
    expect(calls.refreshes).toEqual([{ headSha: platformHead, expectedLessonSha: lessonMerge }]);
  });

  test('lesson-first partial resume continues after the lesson member is already merged', () => {
    let callsRef;
    const setup = harness({
      deps: {
        fetchMainSha: jest.fn((repo) => {
          if (repo === LESSON_REPO) return lessonMerge;
          if (callsRef && callsRef.merges.some((merge) => merge.repo === PLATFORM_REPO)) return platformMerge;
          return platformBase;
        }),
        fetchPr: jest.fn((repo) => {
          if (repo === PLATFORM_REPO) return pr(repo, 140, platformHead);
          return pr(repo, 34, lessonHead, {
            state: 'MERGED',
            mergeCommit: { oid: lessonMerge },
          });
        }),
      },
      options: {
        allowPartialResume: true,
      },
    });
    callsRef = setup.calls;
    const result = integrateBundle({ ...setup.options, deps: setup.deps });

    expect(result).toMatchObject({ ok: true, phase: 'merged_bundle', order: 'lesson-first' });
    expect(result.merges[0]).toMatchObject({
      repo: LESSON_REPO,
      pr_number: 34,
      resumed: true,
      merge_commit: lessonMerge,
    });
    expect(setup.calls.merges.map((item) => item.repo)).toEqual([PLATFORM_REPO]);
    expect(setup.calls.refreshes).toEqual([{ headSha: platformHead, expectedLessonSha: lessonMerge }]);
    expect(setup.calls.ciTriggers).toHaveLength(2);
    expect(setup.calls.ciWaits[1]).toMatchObject({
      headSha: platformMerge,
      expectedPlatformSha: platformMerge,
      expectedLessonSha: lessonMerge,
    });
    const platformSuccessIndex = setup.calls.events.findIndex(
      (event) => event.type === 'status' && event.state === 'success'
    );
    const platformMergeIndex = setup.calls.events.findIndex(
      (event) => event.type === 'merge' && event.repo === PLATFORM_REPO
    );
    expect(platformSuccessIndex).toBeGreaterThan(-1);
    expect(platformSuccessIndex).toBeLessThan(platformMergeIndex);
  });

  test('partial resume fails closed without the explicit resume option', () => {
    const { calls, options, deps } = harness({
      deps: {
        fetchMainSha: jest.fn((repo) => (repo === LESSON_REPO ? lessonMerge : platformBase)),
        fetchPr: jest.fn((repo) => {
          if (repo === PLATFORM_REPO) return pr(repo, 140, platformHead);
          return pr(repo, 34, lessonHead, {
            state: 'MERGED',
            mergeCommit: { oid: lessonMerge },
          });
        }),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase: 'preflight' });
    expect(result.failures).toContain('lesson:pr_not_open');
    expect(calls.merges).toEqual([]);
  });

  test('partial resume rejects an already-merged lesson member at the wrong head', () => {
    const wrongLessonHead = '7'.repeat(40);
    const { calls, options, deps } = harness({
      deps: {
        fetchMainSha: jest.fn((repo) => (repo === LESSON_REPO ? lessonMerge : platformBase)),
        fetchPr: jest.fn((repo) => {
          if (repo === PLATFORM_REPO) return pr(repo, 140, platformHead);
          return pr(repo, 34, wrongLessonHead, {
            state: 'MERGED',
            mergeCommit: { oid: lessonMerge },
          });
        }),
      },
      options: {
        allowPartialResume: true,
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase: 'partial_resume' });
    expect(result.failures).toEqual(expect.arrayContaining([
      'partial_resume_lesson_candidate_mismatch',
      'partial_resume_head_mismatch',
    ]));
    expect(calls.merges).toEqual([]);
  });

  test('partial resume rejects a lesson merge commit that is not current main', () => {
    const staleLessonMain = '8'.repeat(40);
    const { calls, options, deps } = harness({
      deps: {
        fetchMainSha: jest.fn((repo) => (repo === LESSON_REPO ? staleLessonMain : platformBase)),
        fetchPr: jest.fn((repo) => {
          if (repo === PLATFORM_REPO) return pr(repo, 140, platformHead);
          return pr(repo, 34, lessonHead, {
            state: 'MERGED',
            mergeCommit: { oid: lessonMerge },
          });
        }),
      },
      options: {
        allowPartialResume: true,
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase: 'partial_resume' });
    expect(result.failures).toContain('partial_resume_merge_commit_not_current_main');
    expect(calls.merges).toEqual([]);
  });

  test('partial resume rejects platform main advancing beyond the compatibility base', () => {
    const advancedPlatformMain = '9'.repeat(40);
    const { calls, options, deps } = harness({
      deps: {
        fetchMainSha: jest.fn((repo) => (repo === LESSON_REPO ? lessonMerge : advancedPlatformMain)),
        fetchPr: jest.fn((repo) => {
          if (repo === PLATFORM_REPO) return pr(repo, 140, platformHead);
          return pr(repo, 34, lessonHead, {
            state: 'MERGED',
            mergeCommit: { oid: lessonMerge },
          });
        }),
      },
      options: {
        allowPartialResume: true,
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase: 'partial_resume' });
    expect(result.failures).toContain('partial_resume_platform_main_advanced');
    expect(calls.merges).toEqual([]);
  });

  test('partial resume requires fresh platform PR CI after the lesson merge', () => {
    const { calls, options, deps } = harness({
      deps: {
        fetchMainSha: jest.fn((repo) => {
          if (repo === LESSON_REPO) return lessonMerge;
          if (calls.merges.some((merge) => merge.repo === PLATFORM_REPO)) return platformMerge;
          return platformBase;
        }),
        fetchPr: jest.fn((repo) => {
          if (repo === PLATFORM_REPO) return pr(repo, 140, platformHead);
          return pr(repo, 34, lessonHead, {
            state: 'MERGED',
            mergeCommit: { oid: lessonMerge },
          });
        }),
        refreshPlatformPrCi: jest.fn(() => ({ ok: false, failure: 'platform_ci_run_not_successful' })),
      },
      options: {
        allowPartialResume: true,
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase: 'platform_pr_ci_refresh' });
    expect(result.refreshed).toMatchObject({ failure: 'platform_ci_run_not_successful' });
    expect(result.merges).toHaveLength(1);
    expect(result.merges[0]).toMatchObject({ repo: LESSON_REPO, resumed: true });
    expect(calls.merges).toEqual([]);
    expect(calls.statuses.some((status) => status.state === 'success')).toBe(false);
  });

  test('platform-first state green merges platform first, then lesson', () => {
    const { calls, options, deps } = harness({
      deps: {
        recomputeCompatibility: jest.fn(() => compatibility('platform-first')),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: true, phase: 'merged_bundle', order: 'platform-first' });
    expect(calls.merges.map((item) => item.repo)).toEqual([PLATFORM_REPO, LESSON_REPO]);
    expect(calls.refreshes).toEqual([]);
    expect(calls.ciWaits[0]).toMatchObject({
      headSha: platformMerge,
      expectedPlatformSha: platformMerge,
      expectedLessonSha: lessonBase,
    });
    expect(calls.events.findIndex((event) => event.type === 'status' && event.state === 'success')).toBeLessThan(
      calls.events.findIndex((event) => event.type === 'merge' && event.repo === PLATFORM_REPO)
    );
  });

  test('retired activated platform protection blocks bundle merge before auto-merge', () => {
    const { calls, options, deps } = harness({
      deps: {
        fetchPlatformBranchProtectionSummary: jest.fn(() => branchProtectionSummary(true)),
        recomputeCompatibility: jest.fn(() => compatibility('platform-first')),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase: 'retired_activated_mode' });
    expect(result.failures).toContain('integration-authorized required-context activation is retired; keep it optional audit evidence');
    expect(calls.autoMerges).toEqual([]);
    expect(calls.merges).toEqual([]);
    expect(calls.waitForPrMerge).toEqual([]);
    expect(calls.statuses.map((status) => status.state)).toEqual(['failure']);
  });

  test('lesson-first does not mint platform success before lesson merge and intermediate CI', () => {
    const { calls, options } = harness();
    const result = integrateBundle(options);

    expect(result).toMatchObject({ ok: true, phase: 'merged_bundle', order: 'lesson-first' });
    const lessonMergeIndex = calls.events.findIndex((event) => event.type === 'merge' && event.repo === LESSON_REPO);
    const platformSuccessIndex = calls.events.findIndex((event) => event.type === 'status' && event.state === 'success');
    const platformMergeIndex = calls.events.findIndex((event) => event.type === 'merge' && event.repo === PLATFORM_REPO);

    expect(lessonMergeIndex).toBeGreaterThan(-1);
    expect(platformSuccessIndex).toBeGreaterThan(lessonMergeIndex);
    expect(platformSuccessIndex).toBeLessThan(platformMergeIndex);
  });

  test('dry-run bundle path does not mint a reusable integration-authorized success status', () => {
    const { calls, options, deps } = harness({
      deps: {
        fetchMergedPr: jest.fn(() => ({ state: 'OPEN', mergeCommit: null })),
      },
      options: { dryRun: true },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: true, phase: 'merged_bundle' });
    expect(calls.statuses).toEqual([]);
    expect(deps.fetchMergedPr).not.toHaveBeenCalled();
    expect(result.merges.every((merge) => merge.dry_run === true)).toBe(true);
  });

  test('platform status helper reports dry-run success without calling GitHub', () => {
    const result = setPlatformIntegrationStatus(
      { setCommitStatus: jest.fn() },
      platformHead,
      'success',
      'Would authorize bundle integration',
      `https://github.com/${PLATFORM_REPO}/pull/140`,
      { dryRun: true }
    );

    expect(result).toEqual({
      ok: true,
      dry_run: true,
      state: 'success',
      sha: platformHead,
      context: INTEGRATION_CONTEXT,
    });
  });

  test('bundle lane fails before platform merge when integration-authorized cannot be minted', () => {
    const { calls, options, deps } = harness({
      deps: {
        recomputeCompatibility: jest.fn(() => compatibility('platform-first')),
        setCommitStatus: jest
          .fn()
          .mockReturnValueOnce({ ok: true })
          .mockImplementationOnce(() => {
            throw new Error('statuses permission denied');
          }),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({
      ok: false,
      phase: 'integration_status',
      integration_status: {
        failure: 'platform_integration_status_update_failed',
        state: 'success',
      },
    });
    expect(calls.merges).toEqual([]);
  });

  test('platform-first behind branch updates exact head and stops for renewed compatibility', () => {
    const { calls, options, deps } = harness({
      deps: {
        recomputeCompatibility: jest.fn(() => compatibility('platform-first')),
        fetchCompareStatus: jest
          .fn()
          .mockReturnValueOnce({ status: 'identical', ahead_by: 0, behind_by: 0 })
          .mockReturnValueOnce({ status: 'identical', ahead_by: 0, behind_by: 0 })
          .mockReturnValueOnce({ status: 'behind', ahead_by: 0, behind_by: 1 }),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({
      ok: true,
      phase: 'member_branch_updated',
      retry_required: true,
      repo: PLATFORM_REPO,
      pr_number: 140,
      previous_head_sha: platformHead,
    });
    expect(calls.updates).toEqual([
      { repo: PLATFORM_REPO, prNumber: 140, expectedHeadSha: platformHead },
    ]);
    expect(calls.merges).toEqual([]);
  });

  test('refreshed integration head can merge when renewed compatibility is exact', () => {
    const refreshedPlatformHead = '8'.repeat(40);
    const { calls, options, deps } = harness({
      deps: {
        fetchPr: jest.fn((repo) => {
          if (repo === PLATFORM_REPO) return pr(repo, 140, refreshedPlatformHead);
          return pr(repo, 34, lessonHead);
        }),
        fetchCompareStatus: jest
          .fn()
          .mockReturnValueOnce({ status: 'ahead', ahead_by: 1, behind_by: 0 })
          .mockReturnValueOnce({ status: 'diverged', ahead_by: 1, behind_by: 1, merge_base_commit_sha: '9'.repeat(40) })
          .mockReturnValueOnce({ status: 'identical', ahead_by: 0, behind_by: 0 })
          .mockReturnValueOnce({ status: 'ahead', ahead_by: 1, behind_by: 0 })
          .mockReturnValueOnce({ status: 'identical', ahead_by: 0, behind_by: 0 }),
        recomputeCompatibility: jest.fn((_record, exactMembers) => compatibility('platform-first', {
          exact_members: exactMembers,
        })),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: true, phase: 'merged_bundle', order: 'platform-first' });
    expect(deps.recomputeCompatibility).toHaveBeenCalledWith(expect.any(Object), {
      platform_base_sha: platformBase,
      platform_candidate_sha: refreshedPlatformHead,
      lesson_base_sha: lessonBase,
      lesson_candidate_sha: lessonHead,
    });
    expect(calls.merges).toEqual([
      { repo: PLATFORM_REPO, prNumber: 140, headSha: refreshedPlatformHead },
      { repo: LESSON_REPO, prNumber: 34, headSha: lessonHead },
    ]);
  });

  test('both intermediate states green uses deterministic lesson-first default', () => {
    const { calls, options, deps } = harness({
      deps: {
        recomputeCompatibility: jest.fn(() => compatibility('both')),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: true, order: 'lesson-first' });
    expect(calls.merges.map((item) => item.repo)).toEqual([LESSON_REPO, PLATFORM_REPO]);
  });

  test('missing or stale lesson member blocks before merge', () => {
    const { calls, options, deps } = harness({
      deps: {
        fetchPr: jest.fn((repo) => {
          if (repo === PLATFORM_REPO) return pr(repo, 140, platformHead);
          return pr(repo, 34, '7'.repeat(40));
        }),
        fetchCompareStatus: jest
          .fn()
          .mockReturnValueOnce({ status: 'identical', ahead_by: 0, behind_by: 0 })
          .mockReturnValueOnce({ status: 'diverged', ahead_by: 1, behind_by: 1 }),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase: 'preflight' });
    expect(result.failures).toContain('lesson:member_payload_not_ancestor');
    expect(calls.merges).toEqual([]);
  });

  test('paired PR draft blocks controller integration', () => {
    const { calls, options, deps } = harness({
      deps: {
        fetchPr: jest.fn((repo) => {
          if (repo === PLATFORM_REPO) return pr(repo, 140, platformHead);
          return pr(repo, 34, lessonHead, { isDraft: true });
        }),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase: 'preflight' });
    expect(result.failures).toContain('lesson:pr_is_draft');
    expect(calls.merges).toEqual([]);
  });

  test('bundle-final green with no intermediate order blocks before merge', () => {
    const { calls, options, deps } = harness({
      deps: {
        recomputeCompatibility: jest.fn(() => ({
          ok: false,
          failures: ['no_green_intermediate_order'],
          permitted_merge_orders: [],
        })),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase: 'compatibility' });
    expect(calls.merges).toEqual([]);
  });

  test('default compatibility loader rejects stale exact member proof', () => {
    const staleProof = compatibility('lesson-first');
    staleProof.exact_members = {
      ...staleProof.exact_members,
      lesson_candidate_sha: '7'.repeat(40),
    };
    const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-proof-'));
    const proofPath = path.join(fixtureDir, 'compatibility.json');
    fs.writeFileSync(proofPath, `${JSON.stringify(staleProof, null, 2)}\n`);
    const { calls, options, deps } = harness();
    const { recomputeCompatibility, ...depsWithoutRecompute } = deps;
    const result = integrateBundle({
      ...options,
      noMerge: true,
      compatibilityProofPath: proofPath,
      verifyCompatibilityWorkflowRun: jest.fn(() => ({ ok: true })),
      compatibilityRunId: '123',
      deps: depsWithoutRecompute,
    });

    expect(recomputeCompatibility).not.toHaveBeenCalled();
    expect(result).toMatchObject({ ok: false, phase: 'compatibility' });
    expect(result.compatibility.failures).toContain(`lesson_candidate_sha mismatch: expected ${lessonHead}`);
    expect(calls.merges).toEqual([]);
  });

  test('final platform main plus lesson main CI failure fails bundle closure', () => {
    const { calls, options, deps } = harness({
      deps: {
        waitForPlatformMainCi: jest
          .fn()
          .mockReturnValueOnce({ ok: true })
          .mockReturnValueOnce({ ok: false, failure: 'platform_main_ci_failed' }),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase: 'final_ci' });
    expect(calls.merges.map((item) => item.repo)).toEqual([LESSON_REPO, PLATFORM_REPO]);
  });

  test('old green platform-ci run with same platform SHA is ignored by minimum run id', () => {
    const selected = selectLatestRunForHead([
      { databaseId: 100, headSha: platformBase, status: 'completed', conclusion: 'success' },
      { databaseId: 101, headSha: platformBase, status: 'completed', conclusion: 'failure' },
    ], platformBase, { minDatabaseId: 100 });

    expect(selected.databaseId).toBe(101);
    expect(selectLatestRunForHead([
      { databaseId: 100, headSha: platformBase, status: 'completed', conclusion: 'success' },
    ], platformBase, { minDatabaseId: 100 })).toBeNull();
  });

  test('platform-ci evidence rejects old lesson SHA for same platform SHA', () => {
    const result = validatePlatformCiEvidence({
      workflow: 'platform-ci',
      job: 'validate-platform',
      github_run_id: '1',
      github_run_attempt: '1',
      github_ref: 'refs/heads/main',
      github_sha: platformBase,
      platform: {
        repository: PLATFORM_REPO,
        path: '4veco-platform',
        head_sha: platformBase,
        branch_or_ref: 'main',
      },
      lessen: {
        repository: LESSON_REPO,
        path: '4veco-lessen',
        head_sha: lessonBase,
        branch_or_ref: 'main',
      },
      node_version: 'v20.0.0',
      python_version: 'Python 3.13.0',
      package_lock_sha256: 'a'.repeat(64),
      created_at_utc: '2026-06-24T00:00:00.000Z',
    }, {
      platformSha: platformBase,
      lessonSha: lessonMerge,
    });

    expect(result.ok).toBe(false);
    expect(result.failures).toContain(`lesson_head_mismatch: expected ${lessonMerge}`);
  });

  test('trusted compatibility workflow provenance is accepted when fully bound', () => {
    const proofSha256 = '7'.repeat(64);
    const result = validateCompatibilityWorkflowProvenance(
      {
        id: 123,
        workflow_id: 456,
        path: '.github/workflows/cross-repo-bundle-compatibility.yml',
        event: 'workflow_dispatch',
        status: 'completed',
        conclusion: 'success',
        head_sha: platformBase,
      },
      { name: 'bundle-summary', expired: false, digest: `sha256:${proofSha256}` },
      compatibilitySummary(),
      {
        runId: '123',
        workflowId: 456,
        bundleId: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
        exactMembers: compatibility('lesson-first').exact_members,
        artifactZipSha256: proofSha256,
        proofSha256,
        downloadedProofSha256: proofSha256,
      }
    );

    expect(result.ok).toBe(true);
  });

  test('wrong compatibility workflow run, digest, or downloaded summary is rejected', () => {
    const artifactSha256 = '7'.repeat(64);
    const result = validateCompatibilityWorkflowProvenance(
      {
        id: 123,
        workflow_id: 456,
        path: '.github/workflows/other.yml',
        event: 'push',
        status: 'completed',
        conclusion: 'success',
        head_sha: platformBase,
      },
      { name: 'bundle-summary', expired: false, digest: `sha256:${artifactSha256}` },
      {
        provenance: {
          run_id: '999',
          event_name: 'workflow_dispatch',
          workflow_sha: platformBase,
          inputs: compatibility('lesson-first').exact_members,
        },
      },
      {
        runId: '123',
        workflowId: 999,
        bundleId: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
        exactMembers: compatibility('lesson-first').exact_members,
        artifactZipSha256: '8'.repeat(64),
        proofSha256: '9'.repeat(64),
        downloadedProofSha256: 'a'.repeat(64),
      }
    );

    expect(result.ok).toBe(false);
    expect(result.failures).toContain('compatibility_workflow_id_mismatch: expected 999');
    expect(result.failures).toContain('compatibility_workflow_path_mismatch');
    expect(result.failures).toContain('compatibility_workflow_event_mismatch');
    expect(result.failures).toContain('compatibility_artifact_digest_mismatch');
    expect(result.failures).toContain('compatibility_artifact_summary_mismatch');
    expect(result.failures).toContain('compatibility_summary_run_id_mismatch');
    expect(result.failures).toContain('compatibility_summary_workflow_name_mismatch');
    expect(result.failures).toContain(
      `compatibility_summary_workflow_ref_mismatch: expected ${PLATFORM_REPO}/.github/workflows/cross-repo-bundle-compatibility.yml@refs/heads/main`
    );
    expect(result.failures).toContain('compatibility_input_bundle_id_mismatch: expected PRESENTATION-V2-113-GRAPH-TRANSFER-1');
  });

  test('missing compatibility provenance fields fail closed', () => {
    const result = validateCompatibilityWorkflowProvenance(
      {
        id: 123,
        workflow_id: 456,
        path: '.github/workflows/cross-repo-bundle-compatibility.yml',
        event: 'workflow_dispatch',
        status: 'completed',
        conclusion: 'success',
        head_sha: platformBase,
      },
      { name: 'bundle-summary', expired: false, digest: `sha256:${'7'.repeat(64)}` },
      { provenance: { run_id: '123', inputs: {} } },
      {
        runId: '123',
        workflowId: 456,
        bundleId: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
        exactMembers: compatibility('lesson-first').exact_members,
      }
    );

    expect(result.ok).toBe(false);
    expect(result.failures).toContain('compatibility_artifact_digest_unverified');
    expect(result.failures).toContain('compatibility_artifact_summary_unverified');
    expect(result.failures).toContain('compatibility_summary_workflow_name_mismatch');
    expect(result.failures).toContain('compatibility_summary_event_mismatch');
    expect(result.failures).toContain(`compatibility_summary_workflow_sha_mismatch: expected ${platformBase}`);
    expect(result.failures).toContain(`compatibility_input_platform_base_sha_mismatch: expected ${platformBase}`);
  });

  test('unresolved threads on either member block merging', () => {
    const { calls, options, deps } = harness({
      deps: {
        fetchReviewThreadState: jest.fn((repo) => ({
          available: true,
          unresolved_count: repo === LESSON_REPO ? 1 : 0,
          requested_changes_count: 0,
        })),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase: 'preflight' });
    expect(result.failures).toContain('lesson:unresolved_review_threads');
    expect(calls.merges).toEqual([]);
  });

  test('main advancing before a member merge invalidates compatibility proof', () => {
    let platformMainReads = 0;
    const { calls, options, deps } = harness({
      deps: {
        fetchMainSha: jest.fn((repo) => {
          if (repo === PLATFORM_REPO) {
            platformMainReads += 1;
            return platformMainReads >= 2 ? '7'.repeat(40) : platformBase;
          }
          return lessonBase;
        }),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase: 'base_changed_before_merge' });
    expect(result.failures).toContain('compatibility_recompute_required');
    expect(calls.merges).toEqual([]);
  });
});
