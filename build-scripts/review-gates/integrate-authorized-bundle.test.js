const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  generateBundleIntegrationReadiness,
  integrateBundle,
  INTEGRATION_CONTEXT,
  PLATFORM_REPO,
  refreshPlatformPrCi,
  LESSON_REPO,
  selectLatestRunForHead,
  setPlatformIntegrationStatus,
  validateCompatibilityWorkflowProvenance,
  validatePlatformCiEvidence,
} = require('./integrate-authorized-bundle');
const { lessonFirstIntegrationContract } = require('./cross-repo-bundle-compatibility');
const { INDEX_PATHS, refreshBundleAgentIndexes } = require('./refresh-bundle-agent-indexes');
const { mergeSupplementalEvidence } = require('./review-pr-readiness');
const { classifyPrReadiness, validateDecision } = require('./pr-readiness-router');

const platformBase = '1'.repeat(40);
const platformHead = '2'.repeat(40);
const lessonBase = '3'.repeat(40);
const lessonHead = '4'.repeat(40);
const platformMerge = '5'.repeat(40);
const lessonMerge = '6'.repeat(40);

function refreshResultFixture({
  previousPlatformHeadSha = platformBase,
  integrationHeadSha = platformHead,
  lessonMergeCommitSha = lessonMerge,
  status = 'reused',
  changedPaths = INDEX_PATHS,
  platformBranch = 'codex/pr-140',
  generatedAt = '2026-08-14T00:00:00.000Z',
} = {}) {
  return {
    ok: true,
    status,
    previous_platform_head_sha: previousPlatformHeadSha,
    platform_integration_head_sha: integrationHeadSha,
    lesson_merge_commit_sha: lessonMergeCommitSha,
    changed_paths: [...changedPaths],
    verified_paths: [...INDEX_PATHS],
    trusted_executor: 'platform-main',
    hashes: Object.fromEntries(INDEX_PATHS.map((item) => [item, 'a'.repeat(64)])),
    metadata: {
      platform_source_commit: previousPlatformHeadSha,
      platform_source_branch: platformBranch,
      lesson_source_commit: lessonMergeCommitSha,
      lesson_source_branch: 'origin/main',
      generated_at: generatedAt,
    },
    commit: {
      sha: integrationHeadSha,
      parent_sha: previousPlatformHeadSha,
      changed_paths: [...changedPaths],
    },
  };
}

function platformCiEvidence(platformSha, lessonSha) {
  return {
    workflow: 'platform-ci',
    job: 'validate-platform',
    github_run_id: '202',
    github_run_attempt: '1',
    github_ref: 'refs/heads/main',
    github_sha: platformSha,
    platform: {
      repository: PLATFORM_REPO,
      path: '4veco-platform',
      head_sha: platformSha,
      branch_or_ref: 'main',
    },
    lessen: {
      repository: LESSON_REPO,
      path: '4veco-lessen',
      head_sha: lessonSha,
      branch_or_ref: 'main',
    },
    node_version: 'v20.0.0',
    python_version: 'Python 3.13.0',
    package_lock_sha256: 'a'.repeat(64),
    created_at_utc: '2026-08-14T00:00:00.000Z',
  };
}

function gitExec(args, cwd) {
  const result = require('child_process').spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${(result.stderr || result.stdout || '').trim()}`);
  }
  return result.stdout.trim();
}

function initGitRemote(root, name) {
  const work = path.join(root, `${name}-work`);
  const bare = path.join(root, `${name}.git`);
  fs.mkdirSync(work, { recursive: true });
  gitExec(['init', '-b', 'main'], work);
  gitExec(['config', 'core.autocrlf', 'false'], work);
  gitExec(['init', '--bare', bare], root);
  gitExec(['remote', 'add', 'origin', bare], work);
  return { work, bare };
}

function gitCommit(cwd, message) {
  gitExec(['add', '.'], cwd);
  gitExec(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', message], cwd);
  return gitExec(['rev-parse', 'HEAD'], cwd);
}

function setupRealBundleRepos() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-integration-git-'));
  const platform = initGitRemote(root, 'platform');
  const lesson = initGitRemote(root, 'lesson');
  fs.writeFileSync(path.join(platform.work, 'README.md'), '# platform\n');
  for (const relativePath of INDEX_PATHS) {
    const absolutePath = path.join(platform.work, relativePath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, relativePath.endsWith('.json') ? '{}\n' : '# stale\n');
  }
  const platformBaseSha = gitCommit(platform.work, 'platform base');
  gitExec(['checkout', '-b', 'codex/controller'], platform.work);
  fs.writeFileSync(path.join(platform.work, 'controller.txt'), 'payload\n');
  const platformPayloadSha = gitCommit(platform.work, 'platform payload');
  gitExec(['push', '-u', 'origin', 'main'], platform.work);
  gitExec(['push', '-u', 'origin', 'codex/controller'], platform.work);

  fs.writeFileSync(path.join(lesson.work, 'AGENTS.md'), 'old route\n');
  const lessonBaseSha = gitCommit(lesson.work, 'lesson base');
  gitExec(['checkout', '-b', 'agent/lesson-payload'], lesson.work);
  fs.writeFileSync(path.join(lesson.work, 'AGENTS.md'), 'canonical route\n');
  const lessonPayloadSha = gitCommit(lesson.work, 'lesson payload');
  gitExec(['push', '-u', 'origin', 'main'], lesson.work);
  gitExec(['push', '-u', 'origin', 'agent/lesson-payload'], lesson.work);
  return {
    root,
    platform,
    lesson,
    platformBaseSha,
    platformPayloadSha,
    lessonBaseSha,
    lessonPayloadSha,
  };
}

function bareRef(bare, ref) {
  return gitExec(['--git-dir', bare, 'rev-parse', ref], path.dirname(bare));
}

function mergeRemoteBranch(repo, branch, message) {
  gitExec(['fetch', 'origin'], repo.work);
  gitExec(['checkout', 'main'], repo.work);
  gitExec(['merge', '--ff-only', 'origin/main'], repo.work);
  gitExec([
    '-c', 'user.name=Test',
    '-c', 'user.email=test@example.com',
    'merge', '--no-ff', `origin/${branch}`, '-m', message,
  ], repo.work);
  const mergeSha = gitExec(['rev-parse', 'HEAD'], repo.work);
  gitExec(['push', 'origin', 'main'], repo.work);
  return mergeSha;
}

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
  const state = (name, status, platformSha, lessonSha) => ({
    bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
    state: name,
    status,
    platform_sha: platformSha,
    lesson_sha: lessonSha,
    exact_members: exactMembers,
    commands: [],
    failed_command: status === 'success' ? null : 'expected incompatible order',
  });
  const states = {
    'platform-first': state(
      'platform-first',
      order === 'platform-first' || order === 'both' ? 'success' : 'failure',
      exactMembers.platform_candidate_sha,
      exactMembers.lesson_base_sha
    ),
    'lesson-first': state(
      'lesson-first',
      order === 'lesson-first' || order === 'both' ? 'success' : 'failure',
      exactMembers.platform_base_sha,
      exactMembers.lesson_candidate_sha
    ),
    'bundle-final': state(
      'bundle-final',
      'success',
      exactMembers.platform_candidate_sha,
      exactMembers.lesson_candidate_sha
    ),
  };
  return {
    ok: true,
    schema_version: 2,
    bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
    exact_members: exactMembers,
    permitted_merge_orders: order === 'both' ? ['platform-first', 'lesson-first'] : [order],
    recommended_merge_order: order === 'both' ? 'lesson-first' : order,
    integration_contract: lessonFirstIntegrationContract(),
    states,
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
    required_approving_review_count: 0,
    approval_count_source: 'test-fixture',
    approval_count_observable: true,
    requires_distinct_approval: false,
    observed: {
      required_status_checks: {
        contexts: activated ? ['validate-platform', 'integration-authorized'] : ['validate-platform'],
      },
    },
  };
}

function integrationReadinessEvidence(headSha) {
  const evidence = JSON.parse(fs.readFileSync(path.join(
    process.cwd(),
    'reports',
    'fixtures',
    'pr-readiness-router',
    'live-governance-human.json'
  ), 'utf8'));
  evidence.reviewed_pr = {
    ...evidence.reviewed_pr,
    repo: PLATFORM_REPO,
    number: 140,
    url: `https://github.com/${PLATFORM_REPO}/pull/140`,
    state: 'OPEN',
    was_draft: false,
    base: 'main',
    head_sha: headSha,
  };
  evidence.proof = {
    ...evidence.proof,
    ci: {
      ...evidence.proof.ci,
      head_sha: headSha,
      conclusion: 'success',
      checks: [{ name: 'validate-platform', conclusion: 'SUCCESS', status: 'COMPLETED' }],
    },
    changed_paths_verified: true,
    post_lead_review_changed_paths: [...INDEX_PATHS],
  };
  return evidence;
}

function productionReviewAdapter(headSha) {
  const baseEvidence = integrationReadinessEvidence(headSha);
  const runReview = jest.fn(({ supplemental }) => {
    const decision = classifyPrReadiness(mergeSupplementalEvidence(baseEvidence, supplemental));
    validateDecision(decision);
    return { decision, markdown: 'readiness' };
  });
  return { baseEvidence, runReview };
}

function payloadReadinessDecision() {
  return {
    ok: true,
    decision: {
      route: 'READY_FOR_HUMAN_REVIEW',
      throughput: { class: 'cross_repo_bundle', authority_class: 'high_authority', level: 'L4' },
      human_review_payload: 'consequential_exception',
      consequence: 'high',
      batching: {
        viable: false,
        target: null,
        reason: 'This exact two-PR bundle is ready for one coordinated owner review.',
      },
      proof: {
        checkers: [],
        lead_review_path: 'subagent:payload-review',
        lead_review_result: 'PASS',
        lead_reviewed_sha: platformHead,
        bundle: {
          paired_lead_reviews: [{
            repository: LESSON_REPO,
            pr_number: 34,
            reviewed_commit_sha: lessonHead,
            review_result: 'PASS',
            review_path: 'subagent:lesson-review',
          }],
        },
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
    indexRefreshes: [],
    readinessRefreshes: [],
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
      payload_ancestor_of_integration_head: input.payload_ancestor_of_integration_head === true,
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
    refreshBundleAgentIndexes: jest.fn((refreshOptions = {}) => {
      const item = {
        platformHeadSha: refreshOptions.platformPr.headRefOid,
        lessonMergeSha: refreshOptions.lessonMergeSha,
      };
      calls.events.push({ type: 'refresh_agent_indexes', ...item });
      calls.indexRefreshes.push(item);
      return refreshResultFixture({
        integrationHeadSha: refreshOptions.platformPr.headRefOid,
        lessonMergeCommitSha: refreshOptions.lessonMergeSha,
      });
    }),
    generateBundleIntegrationReadiness: jest.fn((readinessOptions = {}) => {
      const item = {
        platformHeadSha: readinessOptions.platformPr.headRefOid,
        lessonMergeSha: readinessOptions.lessonMergeCommitSha,
      };
      calls.events.push({ type: 'integration_head_readiness', ...item });
      calls.readinessRefreshes.push(item);
      return { ok: true, decision: { route: 'READY_FOR_HUMAN_REVIEW' } };
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
  test('real Git lesson-first sequence refreshes the distinct lesson merge before platform merge', () => {
    const fixture = setupRealBundleRepos();
    try {
      let lessonMerged = false;
      let lessonMergeSha = null;
      let platformMergeSha = null;
      let callsRef;
      const record = authorization();
      record.controller.reviewed_payload_head_sha = fixture.platformPayloadSha;
      record.members[0].reviewed_payload_head_sha = fixture.lessonPayloadSha;
      const exactMembers = {
        platform_base_sha: fixture.platformBaseSha,
        platform_candidate_sha: fixture.platformPayloadSha,
        lesson_base_sha: fixture.lessonBaseSha,
        lesson_candidate_sha: fixture.lessonPayloadSha,
      };
      const setup = harness({
        options: { authorization: record },
        deps: {
          fetchMainSha: jest.fn((repo) => {
            if (callsRef && callsRef.events.some((event) => event.type === 'integration_head_readiness')) {
              callsRef.events.push({ type: 'final_main_refetch', repo });
            }
            return bareRef(
              repo === PLATFORM_REPO ? fixture.platform.bare : fixture.lesson.bare,
              'refs/heads/main'
            );
          }),
          fetchPr: jest.fn((repo) => {
            if (repo === PLATFORM_REPO) {
              return pr(repo, 140, bareRef(fixture.platform.bare, 'refs/heads/codex/controller'), {
                headRefName: 'codex/controller',
              });
            }
            return pr(repo, 34, fixture.lessonPayloadSha, lessonMerged ? {
              state: 'MERGED',
              mergeCommit: { oid: lessonMergeSha },
            } : { headRefName: 'agent/lesson-payload' });
          }),
          recomputeCompatibility: jest.fn(() => compatibility('lesson-first', { exact_members: exactMembers })),
          summarizeLineage: jest.fn((input) => {
            if (
              callsRef &&
              input.reviewed_payload_head_sha === fixture.platformPayloadSha &&
              input.integration_head_sha !== fixture.platformPayloadSha
            ) {
              callsRef.events.push({ type: 'rebuilt_lineage', headSha: input.integration_head_sha });
            }
            return {
              ok: true,
              reviewed_payload_head_sha: input.reviewed_payload_head_sha,
              integration_head_sha: input.integration_head_sha,
              payload_ancestor_of_integration_head: true,
              authorization_inherited: true,
              requires_integration_delta_lead_review: false,
              requires_deterministic_refresh: false,
              failures: [],
              base_drift: { classification: 'no_substantive_overlap' },
            };
          }),
          mergePr: jest.fn((repo, prNumber, headSha) => {
            if (repo === LESSON_REPO) {
              lessonMergeSha = mergeRemoteBranch(fixture.lesson, 'agent/lesson-payload', 'merge lesson payload');
              lessonMerged = true;
            } else {
              platformMergeSha = mergeRemoteBranch(fixture.platform, 'codex/controller', 'merge platform controller');
            }
            callsRef.events.push({ type: 'merge', repo, prNumber, headSha });
            callsRef.merges.push({ repo, prNumber, headSha });
            return { merged: true };
          }),
          fetchMergedPr: jest.fn((repo) => ({
            state: 'MERGED',
            mergeCommit: { oid: repo === PLATFORM_REPO ? platformMergeSha : lessonMergeSha },
          })),
          refreshBundleAgentIndexes: jest.fn((refreshOptions) => {
            const result = refreshBundleAgentIndexes({
              ...refreshOptions,
              trustedRoot: path.resolve(__dirname, '..', '..'),
              platformRemote: fixture.platform.bare,
              lessonRemote: fixture.lesson.bare,
              fetchPlatformPr: () => ({
                headRefOid: bareRef(fixture.platform.bare, 'refs/heads/codex/controller'),
              }),
            });
            callsRef.events.push({ type: 'refresh_agent_indexes', headSha: result.platform_integration_head_sha });
            return result;
          }),
          refreshPlatformPrCi: jest.fn((platformPr, refreshOptions) => {
            const evidence = validatePlatformCiEvidence(
              platformCiEvidence(platformPr.headRefOid, refreshOptions.expectedLessonSha),
              { platformSha: platformPr.headRefOid, lessonSha: lessonMergeSha }
            );
            callsRef.events.push({ type: 'refresh_platform_pr_ci', headSha: platformPr.headRefOid });
            return { ok: evidence.ok, run: { conclusion: 'success', databaseId: 204 }, evidence };
          }),
          generateBundleIntegrationReadiness: jest.fn((readinessOptions) => {
            callsRef.events.push({
              type: 'integration_head_readiness',
              headSha: readinessOptions.platformPr.headRefOid,
            });
            return { ok: true, decision: { route: 'READY_FOR_HUMAN_REVIEW' } };
          }),
        },
      });
      callsRef = setup.calls;
      const result = integrateBundle({ ...setup.options, deps: setup.deps });

      expect(fixture.lessonPayloadSha).not.toBe(lessonMergeSha);
      expect(result).toMatchObject({ ok: true, phase: 'merged_bundle', order: 'lesson-first' });
      const refreshedHead = setup.calls.events.find((event) => event.type === 'refresh_agent_indexes').headSha;
      const lessonIndex = JSON.parse(gitExec([
        '--git-dir', fixture.platform.bare,
        'show', `${refreshedHead}:reports/github-agent-index-lessen.json`,
      ], fixture.root));
      expect(lessonIndex.source_commit).toBe(lessonMergeSha);
      expect(bareRef(fixture.platform.bare, 'refs/heads/main')).toBe(platformMergeSha);
      const eventTypes = setup.calls.events.map((event) => event.type);
      expect(eventTypes.indexOf('merge')).toBeLessThan(eventTypes.indexOf('refresh_agent_indexes'));
      expect(eventTypes.indexOf('refresh_agent_indexes')).toBeLessThan(eventTypes.indexOf('rebuilt_lineage'));
      expect(eventTypes.indexOf('rebuilt_lineage')).toBeLessThan(eventTypes.indexOf('refresh_platform_pr_ci'));
      expect(eventTypes.indexOf('refresh_platform_pr_ci')).toBeLessThan(eventTypes.indexOf('integration_head_readiness'));
      const readinessEvent = setup.calls.events.findIndex((event) => event.type === 'integration_head_readiness');
      const finalMainRefetch = setup.calls.events.findIndex((event) => event.type === 'final_main_refetch');
      const successStatus = setup.calls.events.findIndex((event) => event.type === 'status' && event.state === 'success');
      const platformMerge = setup.calls.events.findIndex((event) => event.type === 'merge' && event.repo === PLATFORM_REPO);
      const finalCi = setup.calls.events.findIndex((event) => event.type === 'wait_ci');
      expect(readinessEvent).toBeLessThan(finalMainRefetch);
      expect(finalMainRefetch).toBeLessThan(successStatus);
      expect(successStatus).toBeLessThan(platformMerge);
      expect(platformMerge).toBeLessThan(finalCi);
      expect(setup.calls.ciWaits[0]).toMatchObject({
        headSha: platformMergeSha,
        expectedPlatformSha: platformMergeSha,
        expectedLessonSha: lessonMergeSha,
      });
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  }, 60000);

  test('builds and applies refreshed-head readiness without rewriting payload compatibility', () => {
    const refreshedHead = '8'.repeat(40);
    const refreshResult = refreshResultFixture({
      previousPlatformHeadSha: platformHead,
      integrationHeadSha: refreshedHead,
      status: 'created',
    });
    const { baseEvidence, runReview } = productionReviewAdapter(refreshedHead);
    const applyLiveDecision = jest.fn(() => ({ ok: true, comment_action: 'created' }));
    const result = generateBundleIntegrationReadiness({
      payloadReadiness: payloadReadinessDecision(),
      authorization: authorization(),
      branchProtection: branchProtectionSummary(false),
      compatibility: compatibility('lesson-first'),
      platformPayloadSha: platformHead,
      platformPr: pr(PLATFORM_REPO, 140, refreshedHead),
      lessonPayloadSha: lessonHead,
      lessonMergeCommitSha: lessonMerge,
      lessonPr: pr(LESSON_REPO, 34, lessonHead, {
        state: 'MERGED',
        mergeCommit: { oid: lessonMerge },
      }),
      refreshResult,
      lineage: {
        reviewed_payload_head_sha: platformHead,
        integration_head_sha: refreshedHead,
        payload_ancestor_of_integration_head: true,
        authorization_inherited: true,
        failures: [],
      },
      ci: {
        status: 'success',
        platform_sha: refreshedHead,
        lesson_sha: lessonMerge,
        run_id: 202,
      },
    }, { runReview, applyLiveDecision });

    expect(result).toMatchObject({ ok: true, phase: 'integration_head_readiness' });
    expect(result.decision.route).toBe('READY_FOR_HUMAN_REVIEW');
    expect(result.integration_refresh).toMatchObject({
      platform_payload_sha: platformHead,
      platform_integration_head_sha: refreshedHead,
      lesson_payload_sha: lessonHead,
      lesson_merge_commit_sha: lessonMerge,
    });
    const supplemental = runReview.mock.calls[0][0].supplemental;
    expect(supplemental.bundle.exact_members.platform_candidate_sha).toBe(platformHead);
    expect(supplemental.bundle.controller.integration_head_sha).toBe(refreshedHead);
    expect(supplemental.bundle.integration_refresh).toEqual(result.integration_refresh);
    expect(supplemental.proof).not.toHaveProperty('bundle');
    expect(applyLiveDecision).toHaveBeenCalledTimes(1);

    const legacySupplemental = {
      ...supplemental,
      proof: { ...supplemental.proof, bundle: supplemental.bundle },
    };
    delete legacySupplemental.bundle;
    const legacyDecision = classifyPrReadiness(
      mergeSupplementalEvidence(baseEvidence, legacySupplemental)
    );
    validateDecision(legacyDecision);
    expect(legacyDecision.route).toBe('KEEP_DRAFT_REVISE');
    expect(legacyDecision.reason_codes).toEqual(expect.arrayContaining([
      'bundle_id_missing',
      'bundle_controller_metadata_incomplete',
      'bundle_compatibility_missing',
    ]));

    const mixed = generateBundleIntegrationReadiness({
      payloadReadiness: { ok: true, decision: { route: 'READY_FOR_HUMAN_REVIEW', proof: {} } },
      authorization: authorization(),
      compatibility: compatibility('lesson-first'),
      platformPayloadSha: platformHead,
      platformPr: pr(PLATFORM_REPO, 140, refreshedHead),
      lessonPayloadSha: lessonHead,
      lessonMergeCommitSha: lessonMerge,
      refreshResult: { ...refreshResult, lesson_merge_commit_sha: lessonHead },
      lineage: result.integration_refresh.lineage,
      ci: result.integration_refresh.ci,
    }, { runReview, applyLiveDecision });
    expect(mixed).toMatchObject({ ok: false, phase: 'integration_refresh_proof' });
    expect(mixed.failures).toContain('integration_refresh result lesson mismatch');
    expect(runReview).toHaveBeenCalledTimes(1);

    const publicationFailure = generateBundleIntegrationReadiness({
      payloadReadiness: payloadReadinessDecision(),
      authorization: authorization(),
      branchProtection: branchProtectionSummary(false),
      compatibility: compatibility('lesson-first'),
      platformPayloadSha: platformHead,
      platformPr: pr(PLATFORM_REPO, 140, refreshedHead),
      lessonPayloadSha: lessonHead,
      lessonMergeCommitSha: lessonMerge,
      lessonPr: pr(LESSON_REPO, 34, lessonHead),
      refreshResult,
      lineage: result.integration_refresh.lineage,
      ci: result.integration_refresh.ci,
    }, {
      runReview,
      applyLiveDecision: jest.fn(() => ({ ok: false, failure: 'comment_write_failed' })),
    });
    expect(publicationFailure).toMatchObject({
      ok: false,
      phase: 'integration_head_readiness_publication',
    });
  });

  test('reuses a completed exact-coordinate platform CI run without dispatching another run', () => {
    const refreshedHead = '8'.repeat(40);
    const existingRun = {
      databaseId: 203,
      headSha: refreshedHead,
      status: 'completed',
      conclusion: 'success',
    };
    const trigger = jest.fn();
    const wait = jest.fn();
    const verify = jest.fn((_run, expected) => ({
      ok: expected.platformSha === refreshedHead && expected.lessonSha === lessonMerge,
      run: existingRun,
      evidence: validatePlatformCiEvidence(
        platformCiEvidence(refreshedHead, lessonMerge),
        expected
      ),
    }));
    const result = refreshPlatformPrCi(pr(PLATFORM_REPO, 140, refreshedHead), {
      expectedLessonSha: lessonMerge,
      findWorkflowRunForHead: jest.fn(() => existingRun),
      verifyPlatformCiRun: verify,
      triggerPlatformCiForRef: trigger,
      waitForPlatformHeadCi: wait,
    });

    expect(result).toMatchObject({ ok: true, reused: true, head_sha: refreshedHead });
    expect(verify).toHaveBeenCalledWith(existingRun, {
      platformSha: refreshedHead,
      lessonSha: lessonMerge,
    }, expect.any(Object));
    expect(trigger).not.toHaveBeenCalled();
    expect(wait).not.toHaveBeenCalled();
  });

  test('does not reuse a green platform CI run whose lesson evidence is stale', () => {
    const refreshedHead = '8'.repeat(40);
    const existingRun = {
      databaseId: 203,
      headSha: refreshedHead,
      status: 'completed',
      conclusion: 'success',
    };
    const trigger = jest.fn();
    const wait = jest.fn(() => ({ ok: false, failure: 'replacement_run_failed' }));
    const result = refreshPlatformPrCi(pr(PLATFORM_REPO, 140, refreshedHead), {
      expectedLessonSha: lessonMerge,
      findWorkflowRunForHead: jest.fn(() => existingRun),
      verifyPlatformCiRun: jest.fn(() => ({
        ok: false,
        failure: 'platform_ci_evidence_mismatch',
        evidence: validatePlatformCiEvidence(
          platformCiEvidence(refreshedHead, lessonHead),
          { platformSha: refreshedHead, lessonSha: lessonMerge }
        ),
      })),
      latestWorkflowRunDatabaseId: jest.fn(() => 203),
      triggerPlatformCiForRef: trigger,
      waitForPlatformHeadCi: wait,
    });

    expect(result).toMatchObject({ ok: false, failure: 'replacement_run_failed' });
    expect(trigger).toHaveBeenCalledTimes(1);
    expect(wait).toHaveBeenCalledTimes(1);
  });

  test('lesson-first state green merges lesson first, then platform', () => {
    const { calls, options } = harness();
    const result = integrateBundle(options);

    expect(result).toMatchObject({ ok: true, phase: 'merged_bundle', order: 'lesson-first' });
    expect(result.bundle_state).toMatchObject({
      controller_pr_head: `${PLATFORM_REPO}#140@${platformHead}`,
      member_pr_heads: [`${LESSON_REPO}#34@${lessonHead}`],
      merged_members: [`${LESSON_REPO}#34@${lessonHead}`],
      open_members: [],
      delegated_branch_protection_proof: 'controller',
      merge_order_proof: 'lesson-first',
      residual_integration_mode: 'full bundle',
      controller_state: 'MERGED',
    });
    expect(calls.merges.map((item) => item.repo)).toEqual([LESSON_REPO, PLATFORM_REPO]);
    expect(calls.ciTriggers).toHaveLength(1);
    expect(calls.indexRefreshes).toEqual([{ platformHeadSha: platformHead, lessonMergeSha: lessonMerge }]);
    expect(calls.refreshes).toEqual([{ headSha: platformHead, expectedLessonSha: lessonMerge }]);
    expect(calls.ciWaits[0]).toMatchObject({
      headSha: platformMerge,
      expectedPlatformSha: platformMerge,
      expectedLessonSha: lessonMerge,
    });
    expect(calls.statuses.map((status) => status.state)).toEqual(['pending', 'pending', 'success']);
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

  test('lesson-first validates a distinct index-only integration head before platform merge', () => {
    const refreshedHead = '8'.repeat(40);
    let callsRef;
    let currentPlatformHead = platformHead;
    const setup = harness({
      deps: {
        fetchPr: jest.fn((repo) => {
          if (repo === PLATFORM_REPO) return pr(repo, 140, currentPlatformHead);
          return pr(repo, 34, lessonHead);
        }),
        refreshBundleAgentIndexes: jest.fn((refreshOptions) => {
          callsRef.events.push({ type: 'refresh_agent_indexes', platformHeadSha: refreshOptions.platformPr.headRefOid });
          currentPlatformHead = refreshedHead;
          return refreshResultFixture({
            previousPlatformHeadSha: platformHead,
            integrationHeadSha: refreshedHead,
            status: 'created',
          });
        }),
        refreshPlatformPrCi: jest.fn((platformPr, refreshOptions) => {
          callsRef.events.push({
            type: 'refresh_platform_pr_ci',
            headSha: platformPr.headRefOid,
            expectedLessonSha: refreshOptions.expectedLessonSha,
          });
          const evidence = validatePlatformCiEvidence(
            platformCiEvidence(platformPr.headRefOid, refreshOptions.expectedLessonSha),
            {
              platformSha: platformPr.headRefOid,
              lessonSha: lessonMerge,
            }
          );
          return {
            ok: evidence.ok,
            failure: evidence.ok ? null : 'platform_ci_evidence_mismatch',
            run: { conclusion: evidence.ok ? 'success' : 'failure', databaseId: 202 },
            evidence,
          };
        }),
        generateBundleIntegrationReadiness: jest.fn((readinessOptions) => {
          callsRef.events.push({
            type: 'integration_head_readiness',
            platformHeadSha: readinessOptions.platformPr.headRefOid,
            lessonMergeSha: readinessOptions.lessonMergeCommitSha,
          });
          return { ok: true, decision: { route: 'READY_FOR_HUMAN_REVIEW' } };
        }),
      },
    });
    callsRef = setup.calls;
    const result = integrateBundle({ ...setup.options, deps: setup.deps });

    expect(result).toMatchObject({ ok: true, phase: 'merged_bundle', order: 'lesson-first' });
    expect(setup.calls.merges).toEqual([
      { repo: LESSON_REPO, prNumber: 34, headSha: lessonHead },
      { repo: PLATFORM_REPO, prNumber: 140, headSha: refreshedHead },
    ]);
    const lessonMergeEvent = setup.calls.events.findIndex((event) => event.type === 'merge' && event.repo === LESSON_REPO);
    const refreshEvent = setup.calls.events.findIndex((event) => event.type === 'refresh_agent_indexes');
    const ciEvent = setup.calls.events.findIndex((event) => event.type === 'refresh_platform_pr_ci');
    const readinessEvent = setup.calls.events.findIndex((event) => event.type === 'integration_head_readiness');
    const successEvent = setup.calls.events.findIndex((event) => event.type === 'status' && event.state === 'success');
    const platformMergeEvent = setup.calls.events.findIndex((event) => event.type === 'merge' && event.repo === PLATFORM_REPO);
    expect(lessonMergeEvent).toBeLessThan(refreshEvent);
    expect(refreshEvent).toBeLessThan(ciEvent);
    expect(ciEvent).toBeLessThan(readinessEvent);
    expect(readinessEvent).toBeLessThan(successEvent);
    expect(successEvent).toBeLessThan(platformMergeEvent);
  });

  test.each([
    ['index refresh commit', {
      refreshBundleAgentIndexes: jest.fn(() => { throw new Error('injected commit failure'); }),
    }, 'platform_index_refresh'],
    ['refreshed CI', {
      refreshPlatformPrCi: jest.fn(() => ({ ok: false, failure: 'ci failed' })),
    }, 'platform_pr_ci_refresh'],
    ['integration-head readiness', {
      generateBundleIntegrationReadiness: jest.fn(() => ({ ok: false, failure: 'readiness failed' })),
    }, 'integration_head_readiness'],
  ])('lesson-first %s failure cannot merge platform or mint success', (_label, dependencyOverride, phase) => {
    const { calls, options, deps } = harness({ deps: dependencyOverride });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase });
    expect(calls.merges.some((item) => item.repo === PLATFORM_REPO)).toBe(false);
    expect(calls.statuses.some((item) => item.state === 'success')).toBe(false);
  });

  test('lesson-first rejects refreshed CI bound to the payload lesson SHA', () => {
    const { calls, options, deps } = harness({
      deps: {
        refreshPlatformPrCi: jest.fn((platformPr) => {
          const evidence = validatePlatformCiEvidence(
            platformCiEvidence(platformPr.headRefOid, lessonHead),
            { platformSha: platformPr.headRefOid, lessonSha: lessonMerge }
          );
          return {
            ok: evidence.ok,
            failure: evidence.ok ? null : 'platform_ci_evidence_mismatch',
            evidence,
          };
        }),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase: 'platform_pr_ci_refresh' });
    expect(result.refreshed.failure).toBe('platform_ci_evidence_mismatch');
    expect(calls.merges.map((item) => item.repo)).toEqual([LESSON_REPO]);
    expect(calls.statuses.some((item) => item.state === 'success')).toBe(false);
  });

  test('lesson-first rejects invalid lineage after the refresh push', () => {
    const refreshedHead = '8'.repeat(40);
    let currentPlatformHead = platformHead;
    const { calls, options, deps } = harness({
      deps: {
        fetchPr: jest.fn((repo) => {
          if (repo === PLATFORM_REPO) return pr(repo, 140, currentPlatformHead);
          return pr(repo, 34, lessonHead);
        }),
        refreshBundleAgentIndexes: jest.fn(() => {
          currentPlatformHead = refreshedHead;
          return refreshResultFixture({
            previousPlatformHeadSha: platformHead,
            integrationHeadSha: refreshedHead,
            status: 'created',
          });
        }),
        summarizeLineage: jest.fn((input) => {
          const inherited = input.reviewed_payload_head_sha === input.integration_head_sha;
          return {
            ok: inherited,
            reviewed_payload_head_sha: input.reviewed_payload_head_sha,
            integration_head_sha: input.integration_head_sha,
            payload_ancestor_of_integration_head: true,
            authorization_inherited: inherited,
            failures: inherited ? [] : ['unexpected_integration_delta'],
            base_drift: { classification: 'no_substantive_overlap' },
          };
        }),
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: false, phase: 'platform_index_refresh_lineage' });
    expect(calls.merges.map((item) => item.repo)).toEqual([LESSON_REPO]);
    expect(calls.statuses.some((item) => item.state === 'success')).toBe(false);
  });

  test('lesson-first final PR refetch rejects a head move after readiness publication', () => {
    const movedHead = '7'.repeat(40);
    let callsRef;
    const setup = harness({
      deps: {
        fetchPr: jest.fn((repo) => {
          if (repo === LESSON_REPO) return pr(repo, 34, lessonHead);
          const readinessPublished = callsRef && callsRef.events.some((event) => event.type === 'integration_head_readiness');
          return pr(repo, 140, readinessPublished ? movedHead : platformHead);
        }),
      },
    });
    callsRef = setup.calls;
    const result = integrateBundle({ ...setup.options, deps: setup.deps });

    expect(result).toMatchObject({ ok: false, phase: 'pre_merge' });
    expect(result.failures).toContain('pr_head_mismatch');
    expect(setup.calls.merges.map((item) => item.repo)).toEqual([LESSON_REPO]);
    expect(setup.calls.statuses.some((item) => item.state === 'success')).toBe(false);
  });

  test.each([
    ['platform', PLATFORM_REPO, '7'.repeat(40)],
    ['lesson', LESSON_REPO, '7'.repeat(40)],
  ])('lesson-first blocks when %s main moves after refreshed readiness', (_label, movedRepo, movedSha) => {
    let callsRef;
    const setup = harness({
      deps: {
        fetchMainSha: jest.fn((repo) => {
          const readinessPublished = callsRef && callsRef.events.some((event) => event.type === 'integration_head_readiness');
          if (readinessPublished && repo === movedRepo) return movedSha;
          if (repo === LESSON_REPO && callsRef && callsRef.merges.some((merge) => merge.repo === LESSON_REPO)) {
            return lessonMerge;
          }
          return repo === PLATFORM_REPO ? platformBase : lessonBase;
        }),
      },
    });
    callsRef = setup.calls;
    const result = integrateBundle({ ...setup.options, deps: setup.deps });

    expect(result).toMatchObject({ ok: false, phase: 'base_changed_before_final_merge' });
    expect(result.failures).toContain('compatibility_recompute_required');
    expect(setup.calls.merges.map((item) => item.repo)).toEqual([LESSON_REPO]);
    expect(setup.calls.statuses.some((item) => item.state === 'success')).toBe(false);
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
    expect(setup.calls.ciTriggers).toHaveLength(1);
    expect(setup.calls.ciWaits[0]).toMatchObject({
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

  test('partial resume accepts a repaired platform base with immutable payload candidates', () => {
    const repairedPlatformBase = '9'.repeat(40);
    const synchronizedHead = '7'.repeat(40);
    const refreshedHead = '8'.repeat(40);
    const replacementCompatibility = compatibility('lesson-first', {
      exact_members: {
        platform_base_sha: repairedPlatformBase,
        platform_candidate_sha: platformHead,
        lesson_base_sha: lessonBase,
        lesson_candidate_sha: lessonHead,
      },
    });
    const { runReview } = productionReviewAdapter(refreshedHead);
    const applyLiveDecision = jest.fn(() => ({ ok: true, comment_action: 'created' }));
    let callsRef;
    let integrationDecision = null;
    const setup = harness({
      deps: {
        fetchMainSha: jest.fn((repo) => {
          if (repo === LESSON_REPO) return lessonMerge;
          if (callsRef && callsRef.merges.some((merge) => merge.repo === PLATFORM_REPO)) return platformMerge;
          return repairedPlatformBase;
        }),
        fetchPr: jest.fn((repo) => {
          if (repo === LESSON_REPO) {
            return pr(repo, 34, lessonHead, {
              state: 'MERGED',
              mergeCommit: { oid: lessonMerge },
            });
          }
          const refreshed = callsRef && callsRef.events.some((event) => event.type === 'refresh_agent_indexes');
          return pr(repo, 140, refreshed ? refreshedHead : synchronizedHead);
        }),
        fetchReadinessComment: jest.fn((repo, _prNumber, expectedHeadSha) => {
          if (repo === PLATFORM_REPO && expectedHeadSha === platformHead) return payloadReadinessDecision();
          if (repo === PLATFORM_REPO && expectedHeadSha === refreshedHead && integrationDecision) {
            return {
              ok: true,
              route: integrationDecision.route,
              decision: integrationDecision,
            };
          }
          return {
            ok: true,
            route: 'READY_FOR_HUMAN_REVIEW',
            decision: { route: 'READY_FOR_HUMAN_REVIEW' },
          };
        }),
        recomputeCompatibility: jest.fn(() => replacementCompatibility),
        refreshBundleAgentIndexes: jest.fn((refreshOptions) => {
          callsRef.events.push({
            type: 'refresh_agent_indexes',
            platformHeadSha: refreshOptions.platformPr.headRefOid,
            lessonMergeSha: refreshOptions.lessonMergeSha,
          });
          callsRef.indexRefreshes.push({
            platformHeadSha: refreshOptions.platformPr.headRefOid,
            lessonMergeSha: refreshOptions.lessonMergeSha,
          });
          return refreshResultFixture({
            previousPlatformHeadSha: synchronizedHead,
            integrationHeadSha: refreshedHead,
            status: 'created',
            generatedAt: '2026-08-17T11:26:20.000Z',
          });
        }),
        refreshPlatformPrCi: jest.fn((platformPr, refreshOptions) => {
          callsRef.events.push({
            type: 'refresh_platform_pr_ci',
            headSha: platformPr.headRefOid,
            expectedLessonSha: refreshOptions.expectedLessonSha,
          });
          callsRef.refreshes.push({
            headSha: platformPr.headRefOid,
            expectedLessonSha: refreshOptions.expectedLessonSha,
          });
          return {
            ok: true,
            head_sha: platformPr.headRefOid,
            run: { conclusion: 'success', databaseId: 204 },
          };
        }),
        generateBundleIntegrationReadiness: jest.fn((readinessOptions) => {
          callsRef.events.push({
            type: 'integration_head_readiness',
            platformHeadSha: readinessOptions.platformPr.headRefOid,
            lessonMergeSha: readinessOptions.lessonMergeCommitSha,
          });
          callsRef.readinessRefreshes.push({
            platformHeadSha: readinessOptions.platformPr.headRefOid,
            lessonMergeSha: readinessOptions.lessonMergeCommitSha,
          });
          const readiness = generateBundleIntegrationReadiness(readinessOptions, {
            runReview,
            applyLiveDecision,
          });
          integrationDecision = readiness.decision || null;
          return readiness;
        }),
      },
      options: {
        allowPartialResume: true,
      },
    });
    callsRef = setup.calls;
    const result = integrateBundle({ ...setup.options, deps: setup.deps });

    expect(result).toMatchObject({ ok: true, phase: 'merged_bundle', order: 'lesson-first' });
    expect(setup.deps.recomputeCompatibility).toHaveBeenCalledWith(expect.any(Object), null);
    expect(replacementCompatibility.exact_members).toEqual({
      platform_base_sha: repairedPlatformBase,
      platform_candidate_sha: platformHead,
      lesson_base_sha: lessonBase,
      lesson_candidate_sha: lessonHead,
    });
    expect(result.merges[0]).toMatchObject({
      repo: LESSON_REPO,
      resumed: true,
      merge_commit: lessonMerge,
    });
    expect(setup.calls.merges).toEqual([
      { repo: PLATFORM_REPO, prNumber: 140, headSha: refreshedHead },
    ]);
    expect(setup.calls.indexRefreshes).toEqual([{
      platformHeadSha: synchronizedHead,
      lessonMergeSha: lessonMerge,
    }]);
    expect(setup.calls.refreshes).toEqual([{
      headSha: refreshedHead,
      expectedLessonSha: lessonMerge,
    }]);
    expect(integrationDecision).toMatchObject({
      route: 'READY_FOR_HUMAN_REVIEW',
      reviewed_pr: { head_sha: refreshedHead },
      proof: {
        bundle: {
          integration_refresh: {
            platform_payload_sha: platformHead,
            platform_integration_head_sha: refreshedHead,
            lesson_payload_sha: lessonHead,
            lesson_merge_commit_sha: lessonMerge,
          },
        },
      },
    });
    const eventTypes = setup.calls.events.map((event) => event.type);
    expect(eventTypes.indexOf('refresh_agent_indexes')).toBeLessThan(eventTypes.indexOf('refresh_platform_pr_ci'));
    expect(eventTypes.indexOf('refresh_platform_pr_ci')).toBeLessThan(eventTypes.indexOf('integration_head_readiness'));
    expect(eventTypes.indexOf('integration_head_readiness')).toBeLessThan(
      setup.calls.events.findIndex((event) => event.type === 'status' && event.state === 'success')
    );
    expect(setup.calls.events.findIndex((event) => event.type === 'status' && event.state === 'success')).toBeLessThan(
      setup.calls.events.findIndex((event) => event.type === 'merge' && event.repo === PLATFORM_REPO)
    );
    expect(setup.calls.events.findIndex((event) => event.type === 'merge' && event.repo === PLATFORM_REPO)).toBeLessThan(
      eventTypes.indexOf('wait_ci')
    );
    expect(setup.calls.ciWaits[0]).toMatchObject({
      headSha: platformMerge,
      expectedPlatformSha: platformMerge,
      expectedLessonSha: lessonMerge,
    });
  });

  test('a separate partial-resume invocation reuses an already-pushed refreshed controller head', () => {
    const refreshedHead = '8'.repeat(40);
    const currentPlatformHead = refreshedHead;
    let callsRef;
    const setup = harness({
      deps: {
        fetchMainSha: jest.fn((repo) => {
          if (repo === LESSON_REPO) return lessonMerge;
          if (callsRef && callsRef.merges.some((merge) => merge.repo === PLATFORM_REPO)) return platformMerge;
          return platformBase;
        }),
        fetchPr: jest.fn((repo) => {
          if (repo === PLATFORM_REPO) return pr(repo, 140, currentPlatformHead);
          return pr(repo, 34, lessonHead, {
            state: 'MERGED',
            mergeCommit: { oid: lessonMerge },
          });
        }),
        refreshBundleAgentIndexes: jest.fn((refreshOptions) => {
          callsRef.events.push({ type: 'refresh_agent_indexes', platformHeadSha: refreshOptions.platformPr.headRefOid });
          return refreshResultFixture({
            previousPlatformHeadSha: platformHead,
            integrationHeadSha: refreshedHead,
          });
        }),
        refreshPlatformPrCi: jest.fn((platformPr, refreshOptions) => {
          callsRef.events.push({
            type: 'refresh_platform_pr_ci',
            headSha: platformPr.headRefOid,
            expectedLessonSha: refreshOptions.expectedLessonSha,
          });
          callsRef.refreshes.push({
            headSha: platformPr.headRefOid,
            expectedLessonSha: refreshOptions.expectedLessonSha,
          });
          const evidence = validatePlatformCiEvidence(
            platformCiEvidence(platformPr.headRefOid, refreshOptions.expectedLessonSha),
            {
              platformSha: refreshedHead,
              lessonSha: lessonMerge,
            }
          );
          return {
            ok: evidence.ok,
            failure: evidence.ok ? null : 'platform_ci_evidence_mismatch',
            run: { conclusion: evidence.ok ? 'success' : 'failure', databaseId: 203 },
            evidence,
          };
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
      resumed: true,
      merge_commit: lessonMerge,
    });
    expect(setup.calls.merges).toEqual([
      { repo: PLATFORM_REPO, prNumber: 140, headSha: refreshedHead },
    ]);
    expect(setup.calls.events.find((event) => event.type === 'refresh_agent_indexes')).toMatchObject({
      platformHeadSha: refreshedHead,
    });
    expect(setup.calls.refreshes).toEqual([
      { headSha: refreshedHead, expectedLessonSha: lessonMerge },
    ]);
    expect(setup.calls.readinessRefreshes).toEqual([
      { platformHeadSha: refreshedHead, lessonMergeSha: lessonMerge },
    ]);
  });

  test('partial resume no-merge result identifies the residual platform controller', () => {
    const { options, deps } = harness({
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
      options: {
        allowPartialResume: true,
        noMerge: true,
      },
    });
    const result = integrateBundle({ ...options, deps });

    expect(result).toMatchObject({ ok: true, phase: 'authorized_no_merge', order: 'lesson-first' });
    expect(result.bundle_state).toMatchObject({
      member_pr_heads: [`${LESSON_REPO}#34@${lessonHead}`],
      merged_members: [`${LESSON_REPO}#34@${lessonHead}`],
      open_members: [],
      delegated_branch_protection_proof: 'controller',
      merge_order_proof: 'lesson-first',
      residual_integration_mode: 'platform-only residual controller',
      controller_state: 'OPEN',
    });
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
    const result = validatePlatformCiEvidence(platformCiEvidence(platformBase, lessonBase), {
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
