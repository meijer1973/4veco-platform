const { integrateBundle, PLATFORM_REPO, LESSON_REPO } = require('./integrate-authorized-bundle');

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

function compatibility(order = 'lesson-first') {
  return {
    ok: true,
    bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
    exact_members: {
      platform_base_sha: platformBase,
      platform_candidate_sha: platformHead,
      lesson_base_sha: lessonBase,
      lesson_candidate_sha: lessonHead,
    },
    permitted_merge_orders: order === 'both' ? ['platform-first', 'lesson-first'] : [order],
    recommended_merge_order: order === 'both' ? 'lesson-first' : order,
    failures: [],
  };
}

function harness(overrides = {}) {
  const calls = { merges: [], ciTriggers: [], ciWaits: [], refreshes: [] };
  const fetchPr = jest.fn((repo) => {
    if (repo === PLATFORM_REPO) return pr(repo, 140, platformHead);
    return pr(repo, 34, lessonHead);
  });
  const deps = {
    fetchMainSha: jest.fn((repo) => (repo === PLATFORM_REPO ? platformBase : lessonBase)),
    fetchPr,
    recomputeCompatibility: jest.fn(() => compatibility('lesson-first')),
    mergePr: jest.fn((repo, prNumber, headSha) => {
      calls.merges.push({ repo, prNumber, headSha });
      return { merged: true };
    }),
    fetchMergedPr: jest.fn((repo) => ({
      state: 'MERGED',
      mergeCommit: { oid: repo === PLATFORM_REPO ? platformMerge : lessonMerge },
    })),
    triggerPlatformCi: jest.fn(() => {
      calls.ciTriggers.push(true);
      return { triggered: true };
    }),
    waitForPlatformMainCi: jest.fn((headSha) => {
      calls.ciWaits.push(headSha);
      return { ok: true, run: { conclusion: 'success' } };
    }),
    refreshPlatformPrCi: jest.fn((platformPr) => {
      calls.refreshes.push(platformPr.headRefOid);
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
    expect(calls.refreshes).toEqual([platformHead]);
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
          calls.refreshes.push(platformHead);
          return { ok: true, run: { conclusion: 'success' } };
        }),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: true, phase: 'merged_bundle', order: 'lesson-first' });
    expect(calls.merges.map((item) => item.repo)).toEqual([LESSON_REPO, PLATFORM_REPO]);
    expect(calls.refreshes).toEqual([platformHead]);
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
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase: 'preflight' });
    expect(result.failures).toContain('lesson:pr_head_mismatch');
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
});
