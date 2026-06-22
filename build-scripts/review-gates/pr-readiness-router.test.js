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
const { runReview } = require('./review-pr-readiness');

const FIXTURE_DIR = path.join(process.cwd(), 'reports', 'fixtures', 'pr-readiness-router');

function readFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), 'utf8'));
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
      reviewedCommitSha: reviewedPr.head_sha,
      leadReviewPath: 'reports/sprints/REVIEW-THROUGHPUT-2-lead-review-round2.md',
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
});
