const fs = require('fs');
const path = require('path');
const {
  classifyPrReadiness,
  renderDecisionMarkdown,
  validateDecision,
} = require('./pr-readiness-router');
const {
  applyBundleReadiness,
  generateBundleMemberDecisions,
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

describe('apply-bundle-readiness-decision', () => {
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
    expect(markdown).toContain('member reviewed head');
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
});
