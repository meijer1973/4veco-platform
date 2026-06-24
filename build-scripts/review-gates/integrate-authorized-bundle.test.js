const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  integrateBundle,
  PLATFORM_REPO,
  LESSON_REPO,
  selectLatestRunForHead,
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

function harness(overrides = {}) {
  const calls = { merges: [], ciTriggers: [], ciWaits: [], refreshes: [] };
  const fetchPr = jest.fn((repo) => {
    if (repo === PLATFORM_REPO) return pr(repo, 140, platformHead);
    return pr(repo, 34, lessonHead);
  });
  const deps = {
    fetchMainSha: jest.fn((repo) => {
      if (calls.merges.some((merge) => merge.repo === repo)) {
        return repo === PLATFORM_REPO ? platformMerge : lessonMerge;
      }
      return repo === PLATFORM_REPO ? platformBase : lessonBase;
    }),
    fetchPr,
    fetchReadinessComment: jest.fn(() => ({
      ok: true,
      route: 'READY_FOR_HUMAN_REVIEW',
      decision: { route: 'READY_FOR_HUMAN_REVIEW' },
    })),
    fetchReviewThreadState: jest.fn(() => ({
      available: true,
      unresolved_count: 0,
      requested_changes_count: 0,
    })),
    latestWorkflowRunDatabaseId: jest.fn(() => 100),
    preflightCrossRepoPermissions: jest.fn(() => ({ ok: true })),
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
    waitForPlatformMainCi: jest.fn((headSha, waitOptions = {}) => {
      calls.ciWaits.push({
        headSha,
        minDatabaseId: waitOptions.minDatabaseId,
        expectedPlatformSha: waitOptions.expectedPlatformSha,
        expectedLessonSha: waitOptions.expectedLessonSha,
      });
      return { ok: true, run: { conclusion: 'success' } };
    }),
    refreshPlatformPrCi: jest.fn((platformPr, refreshOptions = {}) => {
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
