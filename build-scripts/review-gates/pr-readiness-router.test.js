const fs = require('fs');
const path = require('path');
const {
  classifyPrReadiness,
  decisionMarker,
  renderDecisionMarkdown,
  validateDecision,
} = require('./pr-readiness-router');
const {
  leadReviewAutonomousThroughputFields,
  mechanicalAutonomousThroughputFields,
  ownerPreapprovedAutonomousThroughputFields,
} = require('./review-throughput-fields');
const {
  applyDecisionToState,
  verifyTransitionPreconditions,
} = require('./apply-pr-readiness-decision');
const { collectReviewThreadState, mergeSupplementalEvidence, runReview } = require('./review-pr-readiness');
const { GOVERNANCE_SURFACE_TEST_PATHS } = require('./pr-readiness-governance-surfaces');

const FIXTURE_DIR = path.join(process.cwd(), 'reports', 'fixtures', 'pr-readiness-router');

function readFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), 'utf8'));
}

function explicitProof(sha) {
  return {
    ci: {
      head_sha: sha,
      conclusion: 'success',
      required_contexts: ['validate-platform'],
      checks: [{ name: 'validate-platform', conclusion: 'SUCCESS' }],
    },
    checkers: [
      {
        command: 'npm.cmd run check:platform',
        status: 'passed',
      },
    ],
    lead_review: {
      path: 'reports/sprints/REVIEW-THROUGHPUT-2-lead-review-round2.md',
      result: 'PASS',
      reviewed_commit_sha: sha,
    },
    changed_paths_verified: true,
  };
}

const ROUTER_CASES = [
  'l0-mechanical-ready.json',
  'l1-checker-ready-branch-protection.json',
  'l3-thin-batch.json',
  'l2-owner-preapproved-ready.json',
  'l3-substantial-human.json',
  'l4-small-spec-human.json',
  'l4-router-self-human.json',
  'workflow-permission-human.json',
  'missing-stale-ci-revise.json',
  'lead-stale-substantive-revise.json',
  'evidence-tail-ready.json',
  'unresolved-review-revise.json',
  'cross-repo-incomplete-revise.json',
  'pause-escalate-blocker.json',
  'live-l1-ready.json',
  'live-governance-human.json',
  'merge-conflict-revise.json',
];

describe('pr-readiness-router', () => {
  test.each(ROUTER_CASES)('classifies %s', (fixtureName) => {
    const fixture = readFixture(fixtureName);
    const decision = classifyPrReadiness(fixture);

    expect(decision.route).toBe(fixture.expected_route);
    expect(validateDecision(decision)).toBe(true);
    if (fixture.expected_reason) {
      expect(decision.reason_codes).toContain(fixture.expected_reason);
    }
    expect(renderDecisionMarkdown(decision)).toContain(decisionMarker(decision));
  });

  test('marks ready routes as transitionable when the reviewed PR was draft', () => {
    const decision = classifyPrReadiness(readFixture('l0-mechanical-ready.json'));
    expect(decision.allowed_transition).toBe('MARK_READY');
  });

  test('does not allow a transition for revise, batch, or pause routes', () => {
    for (const name of ['l3-thin-batch.json', 'missing-stale-ci-revise.json', 'pause-escalate-blocker.json']) {
      const decision = classifyPrReadiness(readFixture(name));
      expect(decision.allowed_transition).toBe('NONE');
    }
  });

  test('read-only wrapper emits JSON and Markdown from fixture evidence', () => {
    const result = runReview({
      fixture: path.join(FIXTURE_DIR, 'live-governance-human.json'),
      format: 'both',
    });
    expect(result.decision.route).toBe('READY_FOR_HUMAN_REVIEW');
    expect(result.markdown).toContain('PR Readiness Decision');
    expect(result.markdown).toContain('human_authority_consequential_exception');
  });

  test('router consumes direct L0/L1/L2 throughput helper packet shapes', () => {
    const reviewedPr = {
      repo: 'meijer1973/4veco-platform',
      number: 130,
      url: 'https://github.com/meijer1973/4veco-platform/pull/130',
      state: 'OPEN',
      was_draft: true,
      base: 'main',
      head_sha: 'abababababababababababababababababababab',
    };
    const common = {
      proof: explicitProof(reviewedPr.head_sha),
    };
    const packets = [
      mechanicalAutonomousThroughputFields({
        packetId: 'HELPER-L0',
        changedPaths: ['reports/url-index.md'],
        ...common,
      }),
      leadReviewAutonomousThroughputFields({
        packetId: 'HELPER-L1',
        changedPaths: ['build-scripts/review-gates/example.js'],
        ...common,
      }),
      ownerPreapprovedAutonomousThroughputFields({
        packetId: 'HELPER-L2',
        changedPaths: ['reports/fixtures/generated-output-refresh.json'],
        ownerPreapproval: { lane: 'fixture-lane', evidence: 'owner approval' },
        ...common,
      }),
    ];

    for (const packet of packets) {
      const decision = classifyPrReadiness({
        ...packet,
        reviewed_pr: reviewedPr,
        human_review_payload: 'none',
        consequence: 'low',
        proof: {
          ...packet.proof,
          changed_paths_verified: true,
        },
      });
      expect(decision.route).toBe('READY_FOR_LEAD_ONLY');
    }
  });

  test('missing review-thread evidence fails closed', () => {
    const fixture = readFixture('live-l1-ready.json');
    const decision = classifyPrReadiness({
      ...fixture,
      proof: {
        ...fixture.proof,
        review_threads_unavailable: true,
      },
    });
    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('review_threads_unavailable');
  });

  test('supplemental evidence cannot replace remote-derived PR facts', () => {
    const remote = {
      ...readFixture('live-l1-ready.json'),
      proof: {
        ...readFixture('live-l1-ready.json').proof,
        requested_changes: true,
        unresolved_review_threads: true,
      },
    };
    const merged = mergeSupplementalEvidence(remote, {
      reviewed_pr: {
        head_sha: 'ffffffffffffffffffffffffffffffffffffffff',
        state: 'MERGED',
      },
      changed_paths: ['docs/review/pr-throughput-policy.md'],
      proof: {
        ci: {
          head_sha: 'ffffffffffffffffffffffffffffffffffffffff',
          conclusion: 'success',
        },
        requested_changes: false,
        unresolved_review_threads: false,
        checkers: [{ command: 'npm.cmd run check:platform', status: 'passed' }],
      },
    });

    expect(merged.reviewed_pr.head_sha).toBe(remote.reviewed_pr.head_sha);
    expect(merged.reviewed_pr.state).toBe('OPEN');
    expect(merged.changed_paths).toEqual(remote.changed_paths);
    expect(merged.proof.ci.head_sha).toBe(remote.proof.ci.head_sha);
    expect(merged.proof.requested_changes).toBe(true);
    expect(merged.proof.unresolved_review_threads).toBe(true);
  });

  test('L0-L2 lanes reject CI and checker waivers', () => {
    const fixture = readFixture('l0-mechanical-ready.json');
    const ciWaived = classifyPrReadiness({
      ...fixture,
      proof: {
        ...fixture.proof,
        ci_waiver: true,
      },
    });
    expect(ciWaived.route).toBe('KEEP_DRAFT_REVISE');
    expect(ciWaived.reason_codes).toContain('ci_waiver_not_allowed_for_autonomous_lane');

    const checkerWaived = classifyPrReadiness({
      ...fixture,
      proof: {
        ...fixture.proof,
        checkers_required: false,
      },
    });
    expect(checkerWaived.route).toBe('KEEP_DRAFT_REVISE');
    expect(checkerWaived.reason_codes).toContain('checker_waiver_not_allowed_for_autonomous_lane');
  });

  test('L0-L2 lanes reject missing explicit checker proof', () => {
    const fixture = readFixture('l1-checker-ready-branch-protection.json');
    const decision = classifyPrReadiness({
      ...fixture,
      proof: {
        ...fixture.proof,
        checkers: [],
      },
    });
    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('checker_proof_missing_or_not_successful');
  });

  test('evidence-only tails use actual changed paths, not self-declared labels', () => {
    const fixture = readFixture('evidence-tail-ready.json');
    const decision = classifyPrReadiness({
      ...fixture,
      proof: {
        ...fixture.proof,
        post_lead_review_changes: [
          {
            path: 'build-scripts/review-gates/pr-readiness-router.js',
            kind: 'evidence',
            evidence_only: true,
          },
        ],
        post_lead_review_changed_paths: ['build-scripts/review-gates/pr-readiness-router.js'],
      },
    });
    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('lead_review_stale_after_substantive_change');
  });

  test('missing validate-platform is rejected even when another check is green', () => {
    const fixture = readFixture('live-l1-ready.json');
    const decision = classifyPrReadiness({
      ...fixture,
      proof: {
        ...fixture.proof,
        ci: {
          ...fixture.proof.ci,
          checks: [{ name: 'lint', conclusion: 'SUCCESS' }],
        },
      },
    });
    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('required_ci_context_missing_or_not_successful');
  });

  test('validate-platform cannot be removed from ready decision proof', () => {
    const decision = classifyPrReadiness(readFixture('live-l1-ready.json'));
    expect(() =>
      validateDecision({
        ...decision,
        proof: {
          ...decision.proof,
          ci_required_contexts: [],
        },
      })
    ).toThrow('READY_FOR_LEAD_ONLY requires validate-platform CI context');
  });

  test('decision validator rejects inconsistent route and transition combinations', () => {
    const decision = classifyPrReadiness(readFixture('live-l1-ready.json'));
    expect(() =>
      validateDecision({
        ...decision,
        route: 'KEEP_DRAFT_REVISE',
        allowed_transition: 'MARK_READY',
      })
    ).toThrow('KEEP_DRAFT_REVISE must have allowed_transition NONE');
    expect(() =>
      validateDecision({
        ...decision,
        route: 'READY_FOR_LEAD_ONLY',
        throughput: { ...decision.throughput, level: 'L4' },
      })
    ).toThrow('READY_FOR_LEAD_ONLY requires L0-L2 with no human payload');
  });

  test('rendered decision comment includes concise proof summary', () => {
    const decision = classifyPrReadiness(readFixture('live-l1-ready.json'));
    const markdown = renderDecisionMarkdown(decision);
    expect(markdown).toContain('## Proof Summary');
    expect(markdown).toContain('validate-platform');
    expect(markdown).toContain('reports/sprints/LIVE-L1-lead-review-round2.md');
  });

  test.each(GOVERNANCE_SURFACE_TEST_PATHS)('governance surface %s forces human review', (changedPath) => {
    const fixture = readFixture('live-l1-ready.json');
    const decision = classifyPrReadiness({
      ...fixture,
      changed_paths: [changedPath],
    });
    expect(decision.route).toBe('READY_FOR_HUMAN_REVIEW');
    expect(decision.reason_codes).toContain('review_autonomy_governance_change');
  });
});

describe('review thread collection', () => {
  function response(connectionName, nodes, pageInfo) {
    return JSON.stringify({
      repository: {
        pullRequest: {
          [connectionName]: {
            nodes,
            pageInfo,
          },
        },
      },
    });
  }

  test('paginates review threads and change-request reviews', () => {
    const runner = jest.fn((args) => {
      const text = args.join(' ');
      if (text.includes('reviewThreads') && !text.includes('cursor=thread-2')) {
        return response('reviewThreads', [{ isResolved: true }], {
          hasNextPage: true,
          endCursor: 'thread-2',
        });
      }
      if (text.includes('reviewThreads') && text.includes('cursor=thread-2')) {
        return response('reviewThreads', [{ isResolved: false }], {
          hasNextPage: false,
          endCursor: null,
        });
      }
      if (text.includes('reviews')) {
        return response('reviews', [{ state: 'CHANGES_REQUESTED' }], {
          hasNextPage: false,
          endCursor: null,
        });
      }
      throw new Error(`unexpected query: ${text}`);
    });

    const state = collectReviewThreadState('meijer1973/4veco-platform', 137, runner);
    expect(state.available).toBe(true);
    expect(state.unresolved_count).toBe(1);
    expect(state.requested_changes_count).toBe(1);
    expect(runner).toHaveBeenCalledTimes(3);
  });

  test('fails closed when pagination metadata is incomplete', () => {
    const runner = jest.fn((args) => {
      const text = args.join(' ');
      if (text.includes('reviewThreads')) {
        return response('reviewThreads', [{ isResolved: true }], {
          hasNextPage: true,
          endCursor: null,
        });
      }
      return response('reviews', [], {
        hasNextPage: false,
        endCursor: null,
      });
    });

    const state = collectReviewThreadState('meijer1973/4veco-platform', 137, runner);
    expect(state.available).toBe(false);
    expect(state.unresolved_count).toBeNull();
    expect(state.requested_changes_count).toBeNull();
  });
});

describe('apply-pr-readiness-decision', () => {
  test('rejects a head SHA change between review and transition', () => {
    const decision = readFixture('apply-ready-decision.json');
    const currentPr = readFixture('apply-stale-pr.json');

    expect(() => verifyTransitionPreconditions(decision, currentPr)).toThrow('head_sha_changed');
  });

  test('dry-run apply marks ready and creates one idempotent comment action', () => {
    const decision = readFixture('apply-ready-decision.json');
    const currentPr = readFixture('apply-ready-pr.json');
    const result = applyDecisionToState(decision, currentPr, { dryRun: true });

    expect(result.transition_action).toBe('would_mark_ready');
    expect(result.comment_action).toBe('would_create_comment');
    expect(currentPr.comments).toHaveLength(1);
    expect(currentPr.comments[0].body).toContain(decisionMarker(decision));
  });

  test('duplicate apply updates the existing marker comment instead of adding another', () => {
    const decision = readFixture('apply-ready-decision.json');
    const marker = decisionMarker(decision);
    const currentPr = {
      ...readFixture('apply-ready-pr.json'),
      comments: [
        {
          id: 1,
          body: `${marker}\nold body`,
        },
      ],
    };

    const result = applyDecisionToState(decision, currentPr, { dryRun: true });
    expect(result.comment_action).toBe('would_update_comment');
    expect(currentPr.comments).toHaveLength(1);
    expect(currentPr.comments[0].body).toContain('PR Readiness Decision');
  });

  test('head change immediately before mutation prevents marking ready', () => {
    const decision = readFixture('apply-ready-decision.json');
    const currentPr = readFixture('apply-ready-pr.json');
    const finalPr = {
      ...currentPr,
      head_sha: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    };

    expect(() => applyDecisionToState(decision, currentPr, { dryRun: true, finalPr })).toThrow('head_sha_changed');
  });
});
