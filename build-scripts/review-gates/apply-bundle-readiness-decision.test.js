const fs = require('fs');
const path = require('path');

jest.mock('child_process', () => ({
  spawnSync: jest.fn(),
}));

const { spawnSync } = require('child_process');
const {
  classifyPrReadiness,
  renderDecisionMarkdown,
  validateDecision,
} = require('./pr-readiness-router');
const {
  applyBundleReadiness,
  generateBundleMemberDecisions,
  postOrUpdateComment,
} = require('./apply-bundle-readiness-decision');
const { stateResult, summarizeCompatibility } = require('./cross-repo-bundle-compatibility');

const FIXTURE_DIR = path.join(process.cwd(), 'reports', 'fixtures', 'pr-readiness-router');
const PLATFORM_REPO = 'meijer1973/4veco-platform';
const LESSON_REPO = 'meijer1973/4veco-lessen';
const platformHead = '2'.repeat(40);
const lessonHead = '4'.repeat(40);

function readFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), 'utf8'));
}

function exactMembers() {
  return {
    platform_base_sha: '1'.repeat(40),
    platform_candidate_sha: platformHead,
    lesson_base_sha: '3'.repeat(40),
    lesson_candidate_sha: lessonHead,
  };
}

function bundleCompatibility() {
  const exact = exactMembers();
  const state = (name, status) => stateResult({
    bundleId: 'PRESENTATION-V2-PPTX-DERIVATIVE-111-113-1',
    state: name,
    platformBaseSha: exact.platform_base_sha,
    platformCandidateSha: exact.platform_candidate_sha,
    lessonBaseSha: exact.lesson_base_sha,
    lessonCandidateSha: exact.lesson_candidate_sha,
    platformStateSha: name === 'lesson-first' ? exact.platform_base_sha : exact.platform_candidate_sha,
    lessonStateSha: name === 'platform-first' ? exact.lesson_base_sha : exact.lesson_candidate_sha,
    status,
  });
  return summarizeCompatibility({
    states: [
      state('platform-first', 'failure'),
      state('lesson-first', 'success'),
      state('bundle-final', 'success'),
    ],
  });
}

function controllerDecision(overrides = {}) {
  const fixture = readFixture('live-governance-human.json');
  const decision = classifyPrReadiness({
    ...fixture,
    reviewed_pr: {
      ...fixture.reviewed_pr,
      number: 147,
      url: `https://github.com/${PLATFORM_REPO}/pull/147`,
      was_draft: true,
      head_sha: platformHead,
    },
    pr_throughput_class: 'cross_repo_bundle',
    throughput: {
      ...fixture.throughput,
      class: 'cross_repo_bundle',
    },
    proof: {
      ...fixture.proof,
      ci: overrides.ci || {
        head_sha: platformHead,
        conclusion: 'success',
        required_contexts: ['validate-platform'],
        checks: [{ name: 'validate-platform', conclusion: 'SUCCESS' }],
      },
      lead_review: {
        ...fixture.proof.lead_review,
        reviewed_commit_sha: platformHead,
        paired_member_reviews: [
          {
            repository: LESSON_REPO,
            pr_number: 35,
            reviewed_commit_sha: lessonHead,
            review_result: 'PASS',
            review_path: 'subagent:paired-bundle-review',
          },
        ],
      },
      bundle: {
        bundle_id: 'PRESENTATION-V2-PPTX-DERIVATIVE-111-113-1',
        controller: {
          repository: PLATFORM_REPO,
          pr_number: 147,
          head_sha: platformHead,
          reviewed_payload_head_sha: platformHead,
          is_draft: true,
          substantively_ready: true,
        },
        exact_members: exactMembers(),
        paired_prs: [
          {
            repo: LESSON_REPO,
            number: 35,
            open: true,
            mergeable: true,
            current: true,
            ready: false,
            is_draft: true,
            base: 'main',
            head_sha: lessonHead,
            reviewed_payload_head_sha: lessonHead,
            substantively_ready: true,
          },
        ],
        readiness_operation: {
          operation: 'coordinated_mark_ready',
          both_draft_substantively_ready: true,
          members: [
            {
              repository: PLATFORM_REPO,
              pr_number: 147,
              head_sha: platformHead,
              reviewed_payload_head_sha: platformHead,
              substantively_ready: true,
            },
            {
              repository: LESSON_REPO,
              pr_number: 35,
              head_sha: lessonHead,
              reviewed_payload_head_sha: lessonHead,
              substantively_ready: true,
            },
          ],
        },
        compatibility: bundleCompatibility(),
      },
    },
  });
  expect(decision.route).toBe('READY_FOR_HUMAN_REVIEW');
  return decision;
}

function pr(repo, number, head, overrides = {}) {
  return {
    repo,
    number,
    url: `https://github.com/${repo}/pull/${number}`,
    state: 'OPEN',
    is_draft: true,
    base: 'main',
    head_sha: head,
    mergeable: true,
    comments: [],
    ...overrides,
  };
}

function harness(overrides = {}) {
  const states = new Map([
    [`${PLATFORM_REPO}#147`, pr(PLATFORM_REPO, 147, platformHead)],
    [`${LESSON_REPO}#35`, pr(LESSON_REPO, 35, lessonHead)],
  ]);
  const comments = new Map();
  const calls = { comments: [], transitions: [] };
  const deps = {
    fetchPr: jest.fn((repo, number) => ({ ...states.get(`${repo}#${number}`) })),
    listComments: jest.fn((repo, number) => comments.get(`${repo}#${number}`) || []),
    postOrUpdateComment: jest.fn((repo, number, existing, body) => {
      calls.comments.push({ repo, number, existing: Boolean(existing) });
      const key = `${repo}#${number}`;
      comments.set(key, [{ id: comments.size + 1, body }]);
      return { action: existing ? 'updated_comment' : 'created_comment' };
    }),
    markReady: jest.fn((repo, number) => {
      calls.transitions.push({ repo, number });
      const key = `${repo}#${number}`;
      states.set(key, { ...states.get(key), is_draft: false });
      return { action: 'marked_ready' };
    }),
    ...(overrides.deps || {}),
  };
  return { states, comments, calls, deps };
}

function expectJsonTransport(args) {
  expect(args).not.toContain('-f');
  expect(args.some((arg) => String(arg).startsWith('body='))).toBe(false);
  const inputIndex = args.indexOf('--input');
  expect(inputIndex).toBeGreaterThan(-1);
  const inputPath = args[inputIndex + 1];
  const payload = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  return { inputPath, payload };
}

describe('apply-bundle-readiness-decision', () => {
  beforeEach(() => {
    spawnSync.mockReset();
  });

  test('marks both draft bundle members ready from one controller decision', () => {
    const { states, calls, deps } = harness();
    const result = applyBundleReadiness({ controllerDecision: controllerDecision(), deps });

    expect(result).toMatchObject({ ok: true, phase: 'ready_bundle', merge_authority: false });
    expect(calls.transitions.map((item) => item.repo)).toEqual([PLATFORM_REPO, LESSON_REPO]);
    expect(calls.comments.map((item) => item.repo)).toEqual([PLATFORM_REPO, LESSON_REPO]);
    expect(states.get(`${PLATFORM_REPO}#147`).is_draft).toBe(false);
    expect(states.get(`${LESSON_REPO}#35`).is_draft).toBe(false);
    const lessonDecision = result.decisions.find((decision) => decision.reviewed_pr.repo === LESSON_REPO);
    expect(lessonDecision.proof.bundle.delegated).toBe(true);
    expect(lessonDecision.proof.bundle_delegated_ci).toBe(true);
    expect(validateDecision(lessonDecision)).toBe(true);
  });

  test('delegated lesson member decision remains valid without standalone lesson CI', () => {
    const decision = controllerDecision({
      ci: {
        head_sha: platformHead,
        conclusion: 'failure',
        required_contexts: ['validate-platform'],
        checks: [{ name: 'validate-platform', conclusion: 'FAILURE' }],
      },
    });
    expect(decision.proof.bundle_delegated_ci).toBe(true);

    const generated = generateBundleMemberDecisions(decision, [
      pr(PLATFORM_REPO, 147, platformHead),
      pr(LESSON_REPO, 35, lessonHead),
    ]);
    const lessonDecision = generated.find((item) => item.reviewed_pr.repo === LESSON_REPO);
    expect(lessonDecision.proof.bundle.delegated).toBe(true);
    expect(lessonDecision.proof.ci_status).toBe('failure');
    expect(validateDecision(lessonDecision)).toBe(true);
  });

  test('rendered delegated lesson member comment names controller proof boundary', () => {
    const generated = generateBundleMemberDecisions(controllerDecision(), [
      pr(PLATFORM_REPO, 147, platformHead),
      pr(LESSON_REPO, 35, lessonHead),
    ]);
    const lessonDecision = generated.find((item) => item.reviewed_pr.repo === LESSON_REPO);
    const markdown = renderDecisionMarkdown(lessonDecision);

    expect(lessonDecision.proof.branch_protection).toEqual({
      delegated: true,
      controller_repository: PLATFORM_REPO,
      controller_pr_number: 147,
      member_repository: LESSON_REPO,
      member_pr_number: 35,
      note: 'lesson branch protection not required; readiness uses delegated controller proof',
    });
    expect(markdown).toContain('Delegated bundle controller proof');
    expect(markdown).toContain('Controller CI head');
    expect(markdown).toContain('Delegated lead review');
    expect(markdown).toContain('member reviewed payload head');
    expect(markdown).toContain('Delegated branch protection');
    expect(markdown).toContain('lesson branch protection not required; readiness uses delegated controller proof');
    expect(markdown).not.toContain('approval_count_source');
  });

  test('head change before mutation blocks all mark-ready transitions', () => {
    const base = harness();
    let fetchCount = 0;
    const deps = {
      ...base.deps,
      fetchPr: jest.fn((repo, number) => {
        fetchCount += 1;
        if (repo === LESSON_REPO && fetchCount > 2) {
          return { ...base.states.get(`${repo}#${number}`), head_sha: '7'.repeat(40) };
        }
        return { ...base.states.get(`${repo}#${number}`) };
      }),
    };

    const result = applyBundleReadiness({ controllerDecision: controllerDecision(), deps });

    expect(result).toMatchObject({ ok: false, phase: 'pre_mutation', merge_authority: false });
    expect(result.failures.join('\n')).toContain('head_sha_changed');
    expect(base.calls.transitions).toEqual([]);
  });

  test('non-mergeable member blocks before comments or transitions', () => {
    const base = harness();
    const key = `${LESSON_REPO}#35`;
    base.states.set(key, { ...base.states.get(key), mergeable: false });

    const result = applyBundleReadiness({ controllerDecision: controllerDecision(), deps: base.deps });

    expect(result).toMatchObject({ ok: false, phase: 'preflight', merge_authority: false });
    expect(result.failures.join('\n')).toContain('mark_ready_pr_not_mergeable');
    expect(base.calls.comments).toEqual([]);
    expect(base.calls.transitions).toEqual([]);
  });

  test('unexpected already-ready member is rejected instead of accepted', () => {
    const base = harness();
    const key = `${LESSON_REPO}#35`;
    base.states.set(key, { ...base.states.get(key), is_draft: false });

    const result = applyBundleReadiness({ controllerDecision: controllerDecision(), deps: base.deps });

    expect(result).toMatchObject({ ok: false, phase: 'preflight', merge_authority: false });
    expect(result.failures.join('\n')).toContain('mark_ready_expected_draft_pr');
    expect(base.calls.transitions).toEqual([]);
  });

  test.each([
    ['missing state', 'state', undefined],
    ['null state', 'state', null],
    ['missing draft state', 'is_draft', undefined],
    ['null draft state', 'is_draft', null],
  ])('rejects %s during preflight', (_label, field, value) => {
    const base = harness();
    const key = `${LESSON_REPO}#35`;
    const current = { ...base.states.get(key) };
    if (value === undefined) delete current[field];
    else current[field] = value;
    base.states.set(key, current);

    const result = applyBundleReadiness({ controllerDecision: controllerDecision(), deps: base.deps });

    expect(result).toMatchObject({ ok: false, phase: 'preflight', merge_authority: false });
    expect(base.calls.comments).toEqual([]);
    expect(base.calls.transitions).toEqual([]);
  });

  test.each([
    ['missing state', 'state', undefined],
    ['null state', 'state', null],
    ['missing draft state', 'is_draft', undefined],
    ['null draft state', 'is_draft', null],
  ])('rejects %s during per-member post-transition verification', (_label, field, value) => {
    const base = harness();
    let platformFetches = 0;
    const deps = {
      ...base.deps,
      fetchPr: jest.fn((repo, number) => {
        const current = { ...base.states.get(`${repo}#${number}`) };
        if (repo !== PLATFORM_REPO) return current;
        platformFetches += 1;
        if (platformFetches !== 4) return current;
        if (value === undefined) delete current[field];
        else current[field] = value;
        return current;
      }),
    };

    const result = applyBundleReadiness({ controllerDecision: controllerDecision(), deps });

    expect(result).toMatchObject({
      ok: false,
      phase: 'partial_transition',
      recovery_required: true,
      merge_authority: false,
    });
    expect(base.calls.transitions.map((item) => item.repo)).toEqual([PLATFORM_REPO]);
    expect(base.states.get(`${LESSON_REPO}#35`).is_draft).toBe(true);
  });

  test.each([
    ['missing state', 'state', undefined],
    ['null state', 'state', null],
    ['missing draft state', 'is_draft', undefined],
    ['null draft state', 'is_draft', null],
  ])('rejects %s during the final bundle re-fetch', (_label, field, value) => {
    const base = harness();
    let platformFetches = 0;
    const deps = {
      ...base.deps,
      fetchPr: jest.fn((repo, number) => {
        const current = { ...base.states.get(`${repo}#${number}`) };
        if (repo !== PLATFORM_REPO) return current;
        platformFetches += 1;
        if (platformFetches !== 6) return current;
        if (value === undefined) delete current[field];
        else current[field] = value;
        return current;
      }),
    };

    const result = applyBundleReadiness({ controllerDecision: controllerDecision(), deps });

    expect(result).toMatchObject({
      ok: false,
      phase: 'post_transition',
      recovery_required: true,
      merge_authority: false,
    });
    expect(base.calls.transitions.map((item) => item.repo)).toEqual([PLATFORM_REPO, LESSON_REPO]);
  });

  test('revalidates controller as newly ready before lesson mutation', () => {
    const base = harness();
    let controllerFetches = 0;
    const deps = {
      ...base.deps,
      fetchPr: jest.fn((repo, number) => {
        const current = { ...base.states.get(`${repo}#${number}`) };
        if (repo === PLATFORM_REPO) {
          controllerFetches += 1;
          if (controllerFetches === 5) return { ...current, is_draft: true };
        }
        return current;
      }),
    };

    const result = applyBundleReadiness({ controllerDecision: controllerDecision(), deps });

    expect(result).toMatchObject({
      ok: false,
      phase: 'partial_transition',
      recovery_required: true,
      merge_authority: false,
    });
    expect(result.failures.join('\n')).toContain('mark_ready_expected_newly_ready_pr');
    expect(base.calls.transitions.map((item) => item.repo)).toEqual([PLATFORM_REPO]);
    expect(base.states.get(`${LESSON_REPO}#35`).is_draft).toBe(true);
  });

  test('partial transition failure records recovery state and grants no merge authority', () => {
    const base = harness();
    base.deps.markReady = jest.fn((repo, number) => {
      base.calls.transitions.push({ repo, number });
      if (repo === LESSON_REPO) throw new Error('lesson_ready_api_failed');
      const key = `${repo}#${number}`;
      base.states.set(key, { ...base.states.get(key), is_draft: false });
      return { action: 'marked_ready' };
    });

    const result = applyBundleReadiness({ controllerDecision: controllerDecision(), deps: base.deps });

    expect(result).toMatchObject({
      ok: false,
      phase: 'partial_transition',
      recovery_required: true,
      merge_authority: false,
    });
    expect(result.failures.join('\n')).toContain('lesson_ready_api_failed');
    expect(base.states.get(`${PLATFORM_REPO}#147`).is_draft).toBe(false);
    expect(base.states.get(`${LESSON_REPO}#35`).is_draft).toBe(true);
  });

  test('creates bundle-member readiness comment through JSON input file and cleans up on success', () => {
    const body = `bundle readiness\n${'x'.repeat(70000)}`;
    const inputPaths = [];
    const apiBodies = [];

    spawnSync.mockImplementation((command, args) => {
      expect(command).toBe('gh');
      const joined = args.join(' ');
      if (joined.startsWith('api -X POST repos/meijer1973/4veco-platform/issues/147/comments')) {
        const { inputPath, payload } = expectJsonTransport(args);
        inputPaths.push(inputPath);
        apiBodies.push(payload.body);
        return { status: 0, stdout: JSON.stringify({ id: 14701 }), stderr: '' };
      }
      throw new Error(`unexpected gh call: ${joined}`);
    });

    const result = postOrUpdateComment(PLATFORM_REPO, 147, null, body);

    expect(result).toEqual({ action: 'created_comment', id: 14701 });
    expect(apiBodies).toEqual([body]);
    expect(inputPaths).toHaveLength(1);
    expect(fs.existsSync(inputPaths[0])).toBe(false);
    expect(fs.existsSync(path.dirname(inputPaths[0]))).toBe(false);
  });

  test('updates bundle-member readiness comment through exact JSON input payload', () => {
    const body = 'bundle readiness update';
    const inputPaths = [];
    const apiBodies = [];

    spawnSync.mockImplementation((command, args) => {
      expect(command).toBe('gh');
      const joined = args.join(' ');
      if (joined.startsWith('api -X PATCH repos/meijer1973/4veco-lessen/issues/comments/8801')) {
        const { inputPath, payload } = expectJsonTransport(args);
        inputPaths.push(inputPath);
        apiBodies.push(payload.body);
        return { status: 0, stdout: '{}', stderr: '' };
      }
      throw new Error(`unexpected gh call: ${joined}`);
    });

    const result = postOrUpdateComment(LESSON_REPO, 35, { id: 8801 }, body);

    expect(result).toEqual({ action: 'updated_comment', id: 8801 });
    expect(apiBodies).toEqual([body]);
    expect(inputPaths).toHaveLength(1);
    expect(fs.existsSync(inputPaths[0])).toBe(false);
    expect(fs.existsSync(path.dirname(inputPaths[0]))).toBe(false);
  });

  test('removes bundle JSON input file after gh api failure', () => {
    const body = 'bundle failure cleanup';
    let inputPath = null;

    spawnSync.mockImplementation((command, args) => {
      expect(command).toBe('gh');
      const joined = args.join(' ');
      if (joined.startsWith('api -X POST repos/meijer1973/4veco-platform/issues/147/comments')) {
        const transport = expectJsonTransport(args);
        inputPath = transport.inputPath;
        expect(transport.payload.body).toBe(body);
        return { status: 1, stdout: '', stderr: 'bundle comment failed' };
      }
      throw new Error(`unexpected gh call: ${joined}`);
    });

    expect(() => postOrUpdateComment(PLATFORM_REPO, 147, null, body)).toThrow(/bundle comment failed/);
    expect(inputPath).toBeTruthy();
    expect(fs.existsSync(inputPath)).toBe(false);
    expect(fs.existsSync(path.dirname(inputPath))).toBe(false);
  });
});
