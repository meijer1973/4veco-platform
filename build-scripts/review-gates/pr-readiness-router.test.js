const fs = require('fs');
const path = require('path');
const {
  classifyPrReadiness,
  decisionMarker,
  parseRenderedDecisionMarkdown,
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
  verifyPairedTransitionPreconditions,
  verifyTransitionPreconditions,
} = require('./apply-pr-readiness-decision');
const { stateResult, summarizeCompatibility } = require('./cross-repo-bundle-compatibility');
const { collectReviewThreadState, mergeSupplementalEvidence, runReview } = require('./review-pr-readiness');
const { GOVERNANCE_SURFACE_TEST_PATHS } = require('./pr-readiness-governance-surfaces');

const FIXTURE_DIR = path.join(process.cwd(), 'reports', 'fixtures', 'pr-readiness-router');
const DECISION_SCHEMA_PATH = path.join(process.cwd(), 'docs', 'review', 'pr-readiness-decision.schema.json');

function readFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), 'utf8'));
}

function readDecisionSchema() {
  return JSON.parse(fs.readFileSync(DECISION_SCHEMA_PATH, 'utf8'));
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
    branch_protection: {
      required_approving_review_count: 0,
    },
  };
}

function withBranchProtection(fixture, branchProtection) {
  return {
    ...fixture,
    proof: {
      ...fixture.proof,
      branch_protection: branchProtection,
    },
  };
}

function bundleExactMembers(overrides = {}) {
  return {
    platform_base_sha: overrides.platform_base_sha || overrides.platformBaseSha || '1'.repeat(40),
    platform_candidate_sha: overrides.platform_candidate_sha || overrides.platformCandidateSha || '2'.repeat(40),
    lesson_base_sha: overrides.lesson_base_sha || overrides.lessonBaseSha || '3'.repeat(40),
    lesson_candidate_sha: overrides.lesson_candidate_sha || overrides.lessonCandidateSha || '4'.repeat(40),
  };
}

function bundleCompatibility(overrides = {}) {
  const exact = bundleExactMembers(overrides);
  const state = (name, status) => stateResult({
    bundleId: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
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

function bundleCompatibilityPlatformFirst(overrides = {}) {
  const exact = bundleExactMembers(overrides);
  const state = (name, status) => stateResult({
    bundleId: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
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
      state('platform-first', 'success'),
      state('lesson-first', 'failure'),
      state('bundle-final', 'success'),
    ],
  });
}

function pairedLeadReview(repository, prNumber, reviewedSha, overrides = {}) {
  return {
    repository,
    pr_number: prNumber,
    reviewed_commit_sha: reviewedSha,
    review_result: 'PASS',
    review_path: 'subagent:paired-bundle-review',
    ...overrides,
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

  test('base advancement does not block the draft-ready transition', () => {
    const fixture = readFixture('l4-router-self-human.json');
    const decision = classifyPrReadiness({
      ...fixture,
      reviewed_pr: {
        ...fixture.reviewed_pr,
        merge_state: 'BEHIND',
        mergeable: true,
      },
    });

    expect(decision.route).toBe('READY_FOR_HUMAN_REVIEW');
    expect(decision.allowed_transition).toBe('MARK_READY');
    expect(decision.reason_codes).not.toContain('merge_readiness_blocked');
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

  test('cross-repo bundle controller requires green compatibility proof', () => {
    const fixture = readFixture('live-governance-human.json');
    const decision = classifyPrReadiness({
      ...fixture,
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        ...fixture.throughput,
        class: 'cross_repo_bundle',
      },
      bundle: {
        bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
        paired_prs: [
          {
            repo: 'meijer1973/4veco-lessen',
            number: 34,
            open: true,
            mergeable: true,
            is_draft: false,
            head_sha: '4'.repeat(40),
            reviewed_payload_head_sha: '4'.repeat(40),
          },
        ],
      },
    });

    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('bundle_compatibility_missing');
  });

  test('cross-repo bundle controller routes to human review with green matrix proof', () => {
    const fixture = readFixture('live-governance-human.json');
    const lessonHead = '4'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: fixture.reviewed_pr.head_sha,
      lesson_candidate_sha: lessonHead,
    });
    const decision = classifyPrReadiness({
      ...fixture,
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        ...fixture.throughput,
        class: 'cross_repo_bundle',
      },
      proof: {
        ...fixture.proof,
        bundle: {
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: fixture.reviewed_pr.repo,
            pr_number: fixture.reviewed_pr.number,
            reviewed_payload_head_sha: fixture.reviewed_pr.head_sha,
          },
          exact_members: exactMembers,
          paired_prs: [
            {
              repo: 'meijer1973/4veco-lessen',
              number: 34,
              open: true,
              current: true,
              mergeable: true,
              ready: true,
              is_draft: false,
              base: 'main',
              head_sha: lessonHead,
              reviewed_payload_head_sha: lessonHead,
            },
          ],
          compatibility: bundleCompatibility(exactMembers),
        },
      },
    });

    expect(decision.route).toBe('READY_FOR_HUMAN_REVIEW');
    expect(decision.proof.bundle.compatibility.recommended_merge_order).toBe('lesson-first');
  });

  test('controller-first bundle transition treats an exact draft lesson member as transitionable', () => {
    const fixture = readFixture('live-governance-human.json');
    const lessonHead = '4'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: fixture.reviewed_pr.head_sha,
      lesson_candidate_sha: lessonHead,
    });
    const decision = classifyPrReadiness({
      ...fixture,
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        ...fixture.throughput,
        class: 'cross_repo_bundle',
      },
      proof: {
        ...fixture.proof,
        lead_review: {
          ...fixture.proof.lead_review,
          paired_member_reviews: [
            pairedLeadReview('meijer1973/4veco-lessen', 34, lessonHead),
          ],
        },
        bundle: {
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: fixture.reviewed_pr.repo,
            pr_number: fixture.reviewed_pr.number,
            reviewed_payload_head_sha: fixture.reviewed_pr.head_sha,
          },
          exact_members: exactMembers,
          paired_prs: [
            {
              repo: 'meijer1973/4veco-lessen',
              number: 34,
              open: true,
              current: true,
              mergeable: true,
              ready: false,
              is_draft: true,
              base: 'main',
              head_sha: lessonHead,
              reviewed_payload_head_sha: lessonHead,
            },
          ],
          compatibility: bundleCompatibilityPlatformFirst(exactMembers),
        },
      },
    });

    expect(decision.route).toBe('READY_FOR_HUMAN_REVIEW');
    expect(decision.allowed_transition).toBe('MARK_READY');
    expect(decision.reason_codes).not.toContain('paired_pr_draft');
    expect(decision.reason_codes).not.toContain('paired_pr_not_ready');
    expect(decision.proof.bundle.ok).toBe(true);
    expect(decision.proof.bundle.transition_ready).toBe(true);
    expect(decision.proof.bundle.merge_ready).toBe(false);
    expect(decision.proof.bundle.paired_lead_reviews).toEqual([
      pairedLeadReview('meijer1973/4veco-lessen', 34, lessonHead),
    ]);
    expect(decision.proof.bundle.transitionable_draft_members).toEqual([
      expect.objectContaining({
        repository: 'meijer1973/4veco-lessen',
        pr_number: 34,
        base: 'main',
        head_sha: lessonHead,
        reason: 'controller_first_mark_ready',
      }),
    ]);
  });

  test('controller-first draft transition rejects self-attested paired lead-review aliases', () => {
    const fixture = readFixture('live-governance-human.json');
    const lessonHead = '4'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: fixture.reviewed_pr.head_sha,
      lesson_candidate_sha: lessonHead,
    });
    const decision = classifyPrReadiness({
      ...fixture,
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        ...fixture.throughput,
        class: 'cross_repo_bundle',
      },
      proof: {
        ...fixture.proof,
        lead_review: {
          ...fixture.proof.lead_review,
        },
        bundle: {
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: fixture.reviewed_pr.repo,
            pr_number: fixture.reviewed_pr.number,
            reviewed_payload_head_sha: fixture.reviewed_pr.head_sha,
          },
          exact_members: exactMembers,
          paired_prs: [
            {
              repo: 'meijer1973/4veco-lessen',
              number: 34,
              open: true,
              current: true,
              mergeable: true,
              ready: false,
              is_draft: true,
              base: 'main',
              head_sha: lessonHead,
              reviewed_payload_head_sha: lessonHead,
              lead_reviewed_sha: lessonHead,
            },
          ],
          compatibility: bundleCompatibilityPlatformFirst(exactMembers),
        },
      },
    });

    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('paired_pr_draft');
    expect(decision.proof.bundle.transitionable_draft_members).toEqual([]);
    expect(decision.proof.bundle.paired_lead_reviews).toEqual([]);
  });

  test.each([
    ['missing open state', (member) => delete member.open],
    ['null open state', (member) => { member.open = null; }],
    ['unknown mergeability', (member) => { member.mergeable = 'UNKNOWN'; }],
    ['conflicting mergeability', (member) => { member.mergeable = 'CONFLICTING'; }],
    ['closed paired PR', (member) => { member.open = false; }],
    ['missing current state', (member) => delete member.current],
    ['null current state', (member) => { member.current = null; }],
    ['stale current state', (member) => { member.current = false; }],
  ])('controller-first draft transition requires strict paired lifecycle: %s', (_name, mutate) => {
    const fixture = readFixture('live-governance-human.json');
    const lessonHead = '4'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: fixture.reviewed_pr.head_sha,
      lesson_candidate_sha: lessonHead,
    });
    const paired = {
      repo: 'meijer1973/4veco-lessen',
      number: 34,
      open: true,
      current: true,
      mergeable: true,
      ready: false,
      is_draft: true,
      base: 'main',
      head_sha: lessonHead,
      reviewed_payload_head_sha: lessonHead,
    };
    mutate(paired);
    const decision = classifyPrReadiness({
      ...fixture,
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        ...fixture.throughput,
        class: 'cross_repo_bundle',
      },
      proof: {
        ...fixture.proof,
        lead_review: {
          ...fixture.proof.lead_review,
          paired_member_reviews: [
            pairedLeadReview('meijer1973/4veco-lessen', 34, lessonHead),
          ],
        },
        bundle: {
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: fixture.reviewed_pr.repo,
            pr_number: fixture.reviewed_pr.number,
            reviewed_payload_head_sha: fixture.reviewed_pr.head_sha,
          },
          exact_members: exactMembers,
          paired_prs: [paired],
          compatibility: bundleCompatibilityPlatformFirst(exactMembers),
        },
      },
    });

    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.proof.bundle.transitionable_draft_members).toEqual([]);
    expect(decision.proof.bundle.transition_ready).toBe(false);
    expect(decision.proof.bundle.merge_ready).toBe(false);
  });

  test('controller-first draft transition requires platform-first compatibility', () => {
    const fixture = readFixture('live-governance-human.json');
    const lessonHead = '4'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: fixture.reviewed_pr.head_sha,
      lesson_candidate_sha: lessonHead,
    });
    const decision = classifyPrReadiness({
      ...fixture,
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        ...fixture.throughput,
        class: 'cross_repo_bundle',
      },
      proof: {
        ...fixture.proof,
        lead_review: {
          ...fixture.proof.lead_review,
          paired_member_reviews: [
            pairedLeadReview('meijer1973/4veco-lessen', 34, lessonHead),
          ],
        },
        bundle: {
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: fixture.reviewed_pr.repo,
            pr_number: fixture.reviewed_pr.number,
            reviewed_payload_head_sha: fixture.reviewed_pr.head_sha,
          },
          exact_members: exactMembers,
          paired_prs: [
            {
              repo: 'meijer1973/4veco-lessen',
              number: 34,
              open: true,
              current: true,
              mergeable: true,
              ready: false,
              is_draft: true,
              base: 'main',
              head_sha: lessonHead,
              reviewed_payload_head_sha: lessonHead,
            },
          ],
          compatibility: bundleCompatibility(exactMembers),
        },
      },
    });

    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('paired_pr_draft');
    expect(decision.reason_codes).toContain('paired_pr_not_ready');
    expect(decision.proof.bundle.transitionable_draft_members).toEqual([]);
  });

  test('lesson-first controller can reach human review from exact bundle proof when validate-platform is red', () => {
    const fixture = readFixture('live-governance-human.json');
    const lessonHead = '4'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: fixture.reviewed_pr.head_sha,
      lesson_candidate_sha: lessonHead,
    });
    const decision = classifyPrReadiness({
      ...fixture,
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        ...fixture.throughput,
        class: 'cross_repo_bundle',
      },
      proof: {
        ...fixture.proof,
        ci: {
          head_sha: fixture.reviewed_pr.head_sha,
          conclusion: 'failure',
          required_contexts: ['validate-platform'],
          checks: [{ name: 'validate-platform', conclusion: 'FAILURE' }],
        },
        bundle: {
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: fixture.reviewed_pr.repo,
            pr_number: fixture.reviewed_pr.number,
            reviewed_payload_head_sha: fixture.reviewed_pr.head_sha,
          },
          exact_members: exactMembers,
          paired_prs: [
            {
              repo: 'meijer1973/4veco-lessen',
              number: 34,
              open: true,
              current: true,
              mergeable: true,
              ready: true,
              is_draft: false,
              base: 'main',
              head_sha: lessonHead,
              reviewed_payload_head_sha: lessonHead,
            },
          ],
          compatibility: bundleCompatibility(exactMembers),
        },
      },
      reviewed_pr: {
        ...fixture.reviewed_pr,
        merge_state: 'BLOCKED',
        mergeable: true,
      },
    });

    expect(decision.route).toBe('READY_FOR_HUMAN_REVIEW');
    expect(decision.reason_codes).not.toContain('required_ci_context_missing_or_not_successful');
    expect(decision.reason_codes).not.toContain('merge_readiness_blocked');
    expect(decision.proof.bundle_delegated_ci).toBe(true);
  });

  test('decision schema permits delegated lesson-first controller CI proof', () => {
    const schema = readDecisionSchema();
    expect(schema.properties.proof.properties.bundle_delegated_ci).toEqual({ type: 'boolean' });
    const readyRule = schema.allOf.find((rule) =>
      rule.if &&
      rule.if.properties &&
      rule.if.properties.route &&
      rule.if.properties.route.enum &&
      rule.if.properties.route.enum.includes('READY_FOR_HUMAN_REVIEW')
    );
    const readyRuleJson = JSON.stringify(readyRule);
    expect(readyRule.then.properties).toBeUndefined();
    expect(readyRuleJson).toContain('"bundle_delegated_ci"');
    expect(JSON.stringify(schema.properties.proof.properties.bundle)).toContain('"paired_prs"');
    expect(JSON.stringify(schema.properties.proof.properties.bundle)).toContain('"transitionable_draft_members"');
    expect(JSON.stringify(schema.properties.proof.properties.bundle)).toContain('"transition_ready"');
    expect(JSON.stringify(schema.properties.proof.properties.bundle)).toContain('"merge_ready"');
    expect(JSON.stringify(schema.properties.proof.properties.bundle)).toContain('"paired_lead_reviews"');
    expect(readyRuleJson).toContain('"lesson-first"');
    expect(readyRuleJson).toContain('"meijer1973/4veco-lessen"');

    const fixture = readFixture('live-governance-human.json');
    const lessonHead = '4'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: fixture.reviewed_pr.head_sha,
      lesson_candidate_sha: lessonHead,
    });
    const decision = classifyPrReadiness({
      ...fixture,
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        ...fixture.throughput,
        class: 'cross_repo_bundle',
      },
      proof: {
        ...fixture.proof,
        ci: {
          head_sha: fixture.reviewed_pr.head_sha,
          conclusion: 'failure',
          required_contexts: ['validate-platform'],
          checks: [{ name: 'validate-platform', conclusion: 'FAILURE' }],
        },
        bundle: {
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: fixture.reviewed_pr.repo,
            pr_number: fixture.reviewed_pr.number,
            reviewed_payload_head_sha: fixture.reviewed_pr.head_sha,
          },
          exact_members: exactMembers,
          paired_prs: [
            {
              repo: 'meijer1973/4veco-lessen',
              number: 34,
              open: true,
              current: true,
              mergeable: true,
              ready: true,
              is_draft: false,
              base: 'main',
              head_sha: lessonHead,
              reviewed_payload_head_sha: lessonHead,
            },
          ],
          compatibility: bundleCompatibility(exactMembers),
        },
      },
    });

    expect(decision.route).toBe('READY_FOR_HUMAN_REVIEW');
    expect(decision.proof.ci_status).toBe('failure');
    expect(decision.proof.bundle_delegated_ci).toBe(true);
    expect(parseRenderedDecisionMarkdown(renderDecisionMarkdown(decision)).decision).toMatchObject({
      route: 'READY_FOR_HUMAN_REVIEW',
      proof: { bundle_delegated_ci: true },
    });
  });

  test('cross-repo bundle controller rejects incomplete paired metadata', () => {
    const fixture = readFixture('live-governance-human.json');
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: fixture.reviewed_pr.head_sha,
    });
    const decision = classifyPrReadiness({
      ...fixture,
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        ...fixture.throughput,
        class: 'cross_repo_bundle',
      },
      proof: {
        ...fixture.proof,
        bundle: {
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: fixture.reviewed_pr.repo,
            pr_number: fixture.reviewed_pr.number,
            reviewed_payload_head_sha: fixture.reviewed_pr.head_sha,
          },
          exact_members: exactMembers,
          paired_prs: [{}],
          compatibility: bundleCompatibility(exactMembers),
        },
      },
    });

    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('paired_pr_metadata_incomplete');
  });

  test('controller-first bundle transition rejects stale paired lesson head', () => {
    const fixture = readFixture('live-governance-human.json');
    const reviewedLessonHead = '4'.repeat(40);
    const currentLessonHead = '5'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: fixture.reviewed_pr.head_sha,
      lesson_candidate_sha: reviewedLessonHead,
    });
    const decision = classifyPrReadiness({
      ...fixture,
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        ...fixture.throughput,
        class: 'cross_repo_bundle',
      },
      proof: {
        ...fixture.proof,
        lead_review: {
          ...fixture.proof.lead_review,
          paired_member_reviews: [
            pairedLeadReview('meijer1973/4veco-lessen', 34, reviewedLessonHead),
          ],
        },
        bundle: {
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: fixture.reviewed_pr.repo,
            pr_number: fixture.reviewed_pr.number,
            reviewed_payload_head_sha: fixture.reviewed_pr.head_sha,
          },
          exact_members: exactMembers,
          paired_prs: [
            {
              repo: 'meijer1973/4veco-lessen',
              number: 34,
              open: true,
              current: true,
              mergeable: true,
              ready: false,
              is_draft: true,
              base: 'main',
              head_sha: currentLessonHead,
              reviewed_payload_head_sha: reviewedLessonHead,
            },
          ],
          compatibility: bundleCompatibilityPlatformFirst(exactMembers),
        },
      },
    });

    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('paired_pr_head_mismatch');
    expect(decision.proof.bundle.transitionable_draft_members).toEqual([]);
  });

  test('controller-first bundle transition rejects conflicting paired lesson PRs', () => {
    const fixture = readFixture('live-governance-human.json');
    const lessonHead = '4'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: fixture.reviewed_pr.head_sha,
      lesson_candidate_sha: lessonHead,
    });
    const decision = classifyPrReadiness({
      ...fixture,
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        ...fixture.throughput,
        class: 'cross_repo_bundle',
      },
      proof: {
        ...fixture.proof,
        lead_review: {
          ...fixture.proof.lead_review,
          paired_member_reviews: [
            pairedLeadReview('meijer1973/4veco-lessen', 34, lessonHead),
          ],
        },
        bundle: {
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: fixture.reviewed_pr.repo,
            pr_number: fixture.reviewed_pr.number,
            reviewed_payload_head_sha: fixture.reviewed_pr.head_sha,
          },
          exact_members: exactMembers,
          paired_prs: [
            {
              repo: 'meijer1973/4veco-lessen',
              number: 34,
              open: true,
              current: true,
              mergeable: false,
              ready: false,
              is_draft: true,
              base: 'main',
              head_sha: lessonHead,
              reviewed_payload_head_sha: lessonHead,
            },
          ],
          compatibility: bundleCompatibilityPlatformFirst(exactMembers),
        },
      },
    });

    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('paired_pr_not_ready');
  });

  test('cross-repo bundle controller rejects stale exact-member compatibility proof', () => {
    const fixture = readFixture('live-governance-human.json');
    const lessonHead = '4'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: fixture.reviewed_pr.head_sha,
      lesson_candidate_sha: lessonHead,
    });
    const staleCompatibility = bundleCompatibility({
      ...exactMembers,
      platform_candidate_sha: '2'.repeat(40),
    });
    const decision = classifyPrReadiness({
      ...fixture,
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        ...fixture.throughput,
        class: 'cross_repo_bundle',
      },
      proof: {
        ...fixture.proof,
        bundle: {
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: fixture.reviewed_pr.repo,
            pr_number: fixture.reviewed_pr.number,
            reviewed_payload_head_sha: fixture.reviewed_pr.head_sha,
          },
          exact_members: exactMembers,
          paired_prs: [
            {
              repo: 'meijer1973/4veco-lessen',
              number: 34,
              open: true,
              mergeable: true,
              is_draft: false,
              head_sha: lessonHead,
              reviewed_payload_head_sha: lessonHead,
            },
          ],
          compatibility: staleCompatibility,
        },
      },
    });

    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain(`platform_candidate_sha mismatch: expected ${fixture.reviewed_pr.head_sha}`);
  });

  test('cross-repo bundle controller rejects stale declared exact members even when compatibility matches them', () => {
    const fixture = readFixture('live-governance-human.json');
    const lessonHead = '4'.repeat(40);
    const staleExactMembers = bundleExactMembers({
      platform_candidate_sha: '2'.repeat(40),
      lesson_candidate_sha: lessonHead,
    });
    const decision = classifyPrReadiness({
      ...fixture,
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        ...fixture.throughput,
        class: 'cross_repo_bundle',
      },
      proof: {
        ...fixture.proof,
        bundle: {
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: fixture.reviewed_pr.repo,
            pr_number: fixture.reviewed_pr.number,
            reviewed_payload_head_sha: fixture.reviewed_pr.head_sha,
          },
          exact_members: staleExactMembers,
          paired_prs: [
            {
              repo: 'meijer1973/4veco-lessen',
              number: 34,
              open: true,
              mergeable: true,
              is_draft: false,
              head_sha: lessonHead,
              reviewed_payload_head_sha: lessonHead,
            },
          ],
          compatibility: bundleCompatibility(staleExactMembers),
        },
      },
    });

    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('platform_candidate_sha_does_not_match_member_head');
    expect(decision.reason_codes).toContain(`platform_candidate_sha mismatch: expected ${fixture.reviewed_pr.head_sha}`);
  });

  test('lesson bundle member can consume delegated controller proof without lesson branch protection', () => {
    const head = '4'.repeat(40);
    const platformHead = '2'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: platformHead,
      lesson_candidate_sha: head,
    });
    const decision = classifyPrReadiness({
      reviewed_pr: {
        repo: 'meijer1973/4veco-lessen',
        number: 34,
        url: 'https://github.com/meijer1973/4veco-lessen/pull/34',
        state: 'OPEN',
        was_draft: false,
        base: 'main',
        head_sha: head,
      },
      changed_paths: ['Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Grafieken/1.1.3 Grafieken en tabellen/index.html'],
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        class: 'cross_repo_bundle',
        authority_class: 'generated_output',
        level: 'L4',
        human_decision_required: true,
      },
      human_review_payload: 'consequential_exception',
      consequence: 'high',
      proof: {
        ci: {},
        checkers: [{ command: 'delegated bundle controller proof', status: 'passed' }],
        lead_review: {
          path: 'subagent:paired-bundle-review',
          result: 'PASS',
          reviewed_commit_sha: head,
        },
        changed_paths_verified: true,
        branch_protection: {
          ok: false,
          approval_count_observable: false,
        },
        bundle: {
          delegated: true,
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: 'meijer1973/4veco-platform',
            pr_number: 140,
            reviewed_payload_head_sha: platformHead,
          },
          current_member: {
            repository: 'meijer1973/4veco-lessen',
            pr_number: 34,
            head_sha: head,
            reviewed_payload_head_sha: head,
          },
          exact_members: exactMembers,
          paired_prs: [
            {
              repo: 'meijer1973/4veco-platform',
              number: 140,
              open: true,
              current: true,
              mergeable: true,
              ready: true,
              is_draft: false,
              base: 'main',
              head_sha: platformHead,
              reviewed_payload_head_sha: platformHead,
            },
          ],
          compatibility: bundleCompatibility(exactMembers),
        },
      },
    });

    expect(decision.route).toBe('READY_FOR_HUMAN_REVIEW');
    expect(decision.proof.bundle.delegated).toBe(true);
  });

  test('delegated lesson member can mark ready after the platform controller is ready', () => {
    const head = '4'.repeat(40);
    const platformHead = '2'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: platformHead,
      lesson_candidate_sha: head,
    });
    const decision = classifyPrReadiness({
      reviewed_pr: {
        repo: 'meijer1973/4veco-lessen',
        number: 34,
        url: 'https://github.com/meijer1973/4veco-lessen/pull/34',
        state: 'OPEN',
        was_draft: true,
        base: 'main',
        head_sha: head,
      },
      changed_paths: ['Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Grafieken/1.1.3 Grafieken en tabellen/index.html'],
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        class: 'cross_repo_bundle',
        authority_class: 'generated_output',
        level: 'L4',
        human_decision_required: true,
      },
      human_review_payload: 'consequential_exception',
      consequence: 'high',
      proof: {
        ci: {},
        checkers: [{ command: 'delegated bundle controller proof', status: 'passed' }],
        lead_review: {
          path: 'subagent:paired-bundle-review',
          result: 'PASS',
          reviewed_commit_sha: head,
        },
        changed_paths_verified: true,
        branch_protection: {
          ok: false,
          approval_count_observable: false,
        },
        bundle: {
          delegated: true,
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: 'meijer1973/4veco-platform',
            pr_number: 140,
            reviewed_payload_head_sha: platformHead,
          },
          current_member: {
            repository: 'meijer1973/4veco-lessen',
            pr_number: 34,
            head_sha: head,
            reviewed_payload_head_sha: head,
          },
          exact_members: exactMembers,
          paired_prs: [
            {
              repo: 'meijer1973/4veco-platform',
              number: 140,
              open: true,
              current: true,
              mergeable: true,
              ready: true,
              is_draft: false,
              base: 'main',
              head_sha: platformHead,
              reviewed_payload_head_sha: platformHead,
            },
          ],
          compatibility: bundleCompatibilityPlatformFirst(exactMembers),
        },
      },
    });

    expect(decision.route).toBe('READY_FOR_HUMAN_REVIEW');
    expect(decision.allowed_transition).toBe('MARK_READY');
    expect(decision.proof.bundle.delegated).toBe(true);
    expect(decision.proof.bundle.transition_ready).toBe(true);
    expect(decision.proof.bundle.merge_ready).toBe(false);
    expect(decision.proof.bundle_delegated_ci).toBe(true);
  });

  test('delegated lesson bundle is merge-ready only after the current lesson PR is non-draft', () => {
    const head = '4'.repeat(40);
    const platformHead = '2'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: platformHead,
      lesson_candidate_sha: head,
    });
    const decision = classifyPrReadiness({
      reviewed_pr: {
        repo: 'meijer1973/4veco-lessen',
        number: 34,
        url: 'https://github.com/meijer1973/4veco-lessen/pull/34',
        state: 'OPEN',
        was_draft: false,
        base: 'main',
        head_sha: head,
      },
      changed_paths: ['Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Grafieken/1.1.3 Grafieken en tabellen/index.html'],
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        class: 'cross_repo_bundle',
        authority_class: 'generated_output',
        level: 'L4',
        human_decision_required: true,
      },
      human_review_payload: 'consequential_exception',
      consequence: 'high',
      proof: {
        ci: {},
        checkers: [{ command: 'delegated bundle controller proof', status: 'passed' }],
        lead_review: {
          path: 'subagent:paired-bundle-review',
          result: 'PASS',
          reviewed_commit_sha: head,
        },
        changed_paths_verified: true,
        branch_protection: {
          ok: false,
          approval_count_observable: false,
        },
        bundle: {
          delegated: true,
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: 'meijer1973/4veco-platform',
            pr_number: 140,
            reviewed_payload_head_sha: platformHead,
          },
          current_member: {
            repository: 'meijer1973/4veco-lessen',
            pr_number: 34,
            head_sha: head,
            reviewed_payload_head_sha: head,
          },
          exact_members: exactMembers,
          paired_prs: [
            {
              repo: 'meijer1973/4veco-platform',
              number: 140,
              open: true,
              current: true,
              mergeable: true,
              ready: true,
              is_draft: false,
              base: 'main',
              head_sha: platformHead,
              reviewed_payload_head_sha: platformHead,
            },
          ],
          compatibility: bundleCompatibilityPlatformFirst(exactMembers),
        },
      },
    });

    expect(decision.route).toBe('READY_FOR_HUMAN_REVIEW');
    expect(decision.allowed_transition).toBe('NONE');
    expect(decision.proof.bundle.transition_ready).toBe(false);
    expect(decision.proof.bundle.merge_ready).toBe(true);
  });

  test.each([
    ['missing open', (member) => delete member.open],
    ['missing current', (member) => delete member.current],
    ['unknown mergeability', (member) => { member.mergeable = 'UNKNOWN'; }],
  ])('delegated lesson bundle rejects malformed non-draft paired lifecycle: %s', (_name, mutate) => {
    const head = '4'.repeat(40);
    const platformHead = '2'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: platformHead,
      lesson_candidate_sha: head,
    });
    const paired = {
      repo: 'meijer1973/4veco-platform',
      number: 140,
      open: true,
      current: true,
      mergeable: true,
      ready: true,
      is_draft: false,
      base: 'main',
      head_sha: platformHead,
      reviewed_payload_head_sha: platformHead,
    };
    mutate(paired);
    const decision = classifyPrReadiness({
      reviewed_pr: {
        repo: 'meijer1973/4veco-lessen',
        number: 34,
        url: 'https://github.com/meijer1973/4veco-lessen/pull/34',
        state: 'OPEN',
        was_draft: false,
        base: 'main',
        head_sha: head,
      },
      changed_paths: ['Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Grafieken/1.1.3 Grafieken en tabellen/index.html'],
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        class: 'cross_repo_bundle',
        authority_class: 'generated_output',
        level: 'L4',
        human_decision_required: true,
      },
      human_review_payload: 'consequential_exception',
      consequence: 'high',
      proof: {
        ci: {},
        checkers: [{ command: 'delegated bundle controller proof', status: 'passed' }],
        lead_review: {
          path: 'subagent:paired-bundle-review',
          result: 'PASS',
          reviewed_commit_sha: head,
        },
        changed_paths_verified: true,
        branch_protection: {
          ok: false,
          approval_count_observable: false,
        },
        bundle: {
          delegated: true,
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: 'meijer1973/4veco-platform',
            pr_number: 140,
            reviewed_payload_head_sha: platformHead,
          },
          current_member: {
            repository: 'meijer1973/4veco-lessen',
            pr_number: 34,
            head_sha: head,
            reviewed_payload_head_sha: head,
          },
          exact_members: exactMembers,
          paired_prs: [paired],
          compatibility: bundleCompatibilityPlatformFirst(exactMembers),
        },
      },
    });

    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('paired_pr_not_ready');
    expect(decision.proof.bundle.merge_ready).toBe(false);
  });

  test('delegated lesson member cannot mark ready while the platform controller is still draft', () => {
    const head = '4'.repeat(40);
    const platformHead = '2'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: platformHead,
      lesson_candidate_sha: head,
    });
    const decision = classifyPrReadiness({
      reviewed_pr: {
        repo: 'meijer1973/4veco-lessen',
        number: 34,
        url: 'https://github.com/meijer1973/4veco-lessen/pull/34',
        state: 'OPEN',
        was_draft: true,
        base: 'main',
        head_sha: head,
      },
      changed_paths: ['Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Grafieken/1.1.3 Grafieken en tabellen/index.html'],
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        class: 'cross_repo_bundle',
        authority_class: 'generated_output',
        level: 'L4',
        human_decision_required: true,
      },
      human_review_payload: 'consequential_exception',
      consequence: 'high',
      proof: {
        ci: {},
        checkers: [{ command: 'delegated bundle controller proof', status: 'passed' }],
        lead_review: {
          path: 'subagent:paired-bundle-review',
          result: 'PASS',
          reviewed_commit_sha: head,
        },
        changed_paths_verified: true,
        branch_protection: {
          ok: false,
          approval_count_observable: false,
        },
        bundle: {
          delegated: true,
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: 'meijer1973/4veco-platform',
            pr_number: 140,
            reviewed_payload_head_sha: platformHead,
          },
          current_member: {
            repository: 'meijer1973/4veco-lessen',
            pr_number: 34,
            head_sha: head,
            reviewed_payload_head_sha: head,
          },
          exact_members: exactMembers,
          paired_prs: [
            {
              repo: 'meijer1973/4veco-platform',
              number: 140,
              open: true,
              current: true,
              mergeable: true,
              ready: false,
              is_draft: true,
              head_sha: platformHead,
              reviewed_payload_head_sha: platformHead,
            },
          ],
          compatibility: bundleCompatibilityPlatformFirst(exactMembers),
        },
      },
    });

    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('paired_pr_draft');
    expect(decision.reason_codes).toContain('paired_pr_not_ready');
  });

  test('delegated lesson bundle proof rejects incomplete paired metadata', () => {
    const head = '4'.repeat(40);
    const platformHead = '2'.repeat(40);
    const exactMembers = bundleExactMembers({
      platform_candidate_sha: platformHead,
      lesson_candidate_sha: head,
    });
    const decision = classifyPrReadiness({
      reviewed_pr: {
        repo: 'meijer1973/4veco-lessen',
        number: 34,
        url: 'https://github.com/meijer1973/4veco-lessen/pull/34',
        state: 'OPEN',
        was_draft: false,
        base: 'main',
        head_sha: head,
      },
      changed_paths: ['Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Grafieken/1.1.3 Grafieken en tabellen/index.html'],
      pr_throughput_class: 'cross_repo_bundle',
      throughput: {
        class: 'cross_repo_bundle',
        authority_class: 'generated_output',
        level: 'L4',
        human_decision_required: true,
      },
      human_review_payload: 'consequential_exception',
      consequence: 'high',
      proof: {
        ci: {},
        checkers: [{ command: 'delegated bundle controller proof', status: 'passed' }],
        lead_review: {
          path: 'subagent:paired-bundle-review',
          result: 'PASS',
          reviewed_commit_sha: head,
        },
        changed_paths_verified: true,
        branch_protection: {
          ok: false,
          approval_count_observable: false,
        },
        bundle: {
          delegated: true,
          bundle_id: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
          controller: {
            repository: 'meijer1973/4veco-platform',
            pr_number: 140,
            reviewed_payload_head_sha: platformHead,
          },
          current_member: {
            repository: 'meijer1973/4veco-lessen',
            pr_number: 34,
            head_sha: head,
            reviewed_payload_head_sha: head,
          },
          exact_members: exactMembers,
          paired_prs: [{}],
          compatibility: bundleCompatibility(exactMembers),
        },
      },
    });

    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('paired_pr_metadata_incomplete');
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

  test('post-review sprint result changes are substantive by default', () => {
    const fixture = readFixture('evidence-tail-ready.json');
    const decision = classifyPrReadiness({
      ...fixture,
      proof: {
        ...fixture.proof,
        post_lead_review_changed_paths: ['reports/sprints/EXAMPLE-result.md'],
      },
    });
    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('lead_review_stale_after_substantive_change');
  });

  test('inherited integration authorization preserves payload-head lead review for exact integration head', () => {
    const payloadHead = 'a'.repeat(40);
    const integrationHead = 'b'.repeat(40);
    const decision = classifyPrReadiness({
      reviewed_pr: {
        repo: 'meijer1973/4veco-platform',
        number: 136,
        url: 'https://github.com/meijer1973/4veco-platform/pull/136',
        state: 'OPEN',
        was_draft: false,
        base: 'main',
        head_sha: integrationHead,
        merge_state: 'CLEAN',
        mergeable: true,
      },
      changed_paths: ['docs/inspection-standards/england-overlay-deepening.md'],
      throughput: {
        class: 'normal_sprint',
        authority_class: 'protected_reference',
        level: 'L4',
      },
      human_review_payload: 'consequential_exception',
      consequence: 'high',
      batching: { viable: false, target: null, reason: null },
      proof: {
        ...explicitProof(integrationHead),
        lead_review: {
          path: 'subagent:exact-head final lead review',
          result: 'PASS',
          reviewed_commit_sha: payloadHead,
        },
        human_authorization: {
          reviewed_payload_head_sha: payloadHead,
          decision: 'APPROVE_AND_MERGE',
        },
        integration: {
          reviewed_payload_head_sha: payloadHead,
          integration_head_sha: integrationHead,
          authorization_inherited: true,
          requires_integration_delta_lead_review: false,
          failures: [],
          base_drift: {
            classification: 'no_substantive_overlap',
            requires_integration_delta_lead_review: false,
            requires_human_reauthorization: false,
          },
        },
      },
    });

    expect(decision.route).toBe('READY_FOR_HUMAN_REVIEW');
    expect(decision.proof.lead_review_integration_authorization_inherited).toBe(true);
    expect(validateDecision(decision)).toBe(true);
    expect(renderDecisionMarkdown(decision)).toContain('Integration authorization inherited for lead review: `true`');
  });

  test('pending integration-authorized does not turn BLOCKED into a readiness loop', () => {
    const payloadHead = 'a'.repeat(40);
    const integrationHead = 'b'.repeat(40);
    const decision = classifyPrReadiness({
      reviewed_pr: {
        repo: 'meijer1973/4veco-platform',
        number: 136,
        url: 'https://github.com/meijer1973/4veco-platform/pull/136',
        state: 'OPEN',
        was_draft: false,
        base: 'main',
        head_sha: integrationHead,
        merge_state: 'BLOCKED',
        mergeable: true,
      },
      changed_paths: ['docs/inspection-standards/england-overlay-deepening.md'],
      throughput: {
        class: 'normal_sprint',
        authority_class: 'protected_reference',
        level: 'L4',
      },
      human_review_payload: 'consequential_exception',
      consequence: 'high',
      batching: { viable: false, target: null, reason: null },
      proof: {
        ...explicitProof(integrationHead),
        lead_review: {
          path: 'subagent:exact-head final lead review',
          result: 'PASS',
          reviewed_commit_sha: payloadHead,
        },
        integration: {
          reviewed_payload_head_sha: payloadHead,
          integration_head_sha: integrationHead,
          authorization_inherited: true,
          requires_integration_delta_lead_review: false,
          failures: [],
          base_drift: {
            classification: 'no_substantive_overlap',
            requires_integration_delta_lead_review: false,
            requires_human_reauthorization: false,
          },
        },
      },
    });

    expect(decision.route).toBe('READY_FOR_HUMAN_REVIEW');
    expect(decision.reason_codes).not.toContain('merge_readiness_blocked');
  });

  test('integration authorization does not preserve lead review when delta review is required', () => {
    const payloadHead = 'a'.repeat(40);
    const integrationHead = 'b'.repeat(40);
    const decision = classifyPrReadiness({
      reviewed_pr: {
        repo: 'meijer1973/4veco-platform',
        number: 136,
        url: 'https://github.com/meijer1973/4veco-platform/pull/136',
        state: 'OPEN',
        was_draft: false,
        base: 'main',
        head_sha: integrationHead,
        merge_state: 'CLEAN',
        mergeable: true,
      },
      changed_paths: ['docs/inspection-standards/england-overlay-deepening.md'],
      throughput: {
        class: 'normal_sprint',
        authority_class: 'protected_reference',
        level: 'L4',
      },
      human_review_payload: 'consequential_exception',
      consequence: 'high',
      batching: { viable: false, target: null, reason: null },
      proof: {
        ...explicitProof(integrationHead),
        lead_review: {
          path: 'subagent:exact-head final lead review',
          result: 'PASS',
          reviewed_commit_sha: payloadHead,
        },
        integration: {
          reviewed_payload_head_sha: payloadHead,
          integration_head_sha: integrationHead,
          authorization_inherited: true,
          requires_integration_delta_lead_review: true,
          failures: [],
          base_drift: {
            classification: 'substantive_overlap',
            requires_integration_delta_lead_review: true,
            requires_human_reauthorization: false,
          },
        },
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

  test('count zero branch protection does not create a mechanical approval constraint', () => {
    const decision = classifyPrReadiness(readFixture('l1-checker-ready-branch-protection.json'));
    expect(decision.route).toBe('READY_FOR_LEAD_ONLY');
    expect(decision.reason_codes).not.toContain('branch_protection_merge_constraint');
    expect(decision.follow_up || []).toEqual([]);
    expect(decision.proof.branch_protection.required_approving_review_count).toBe(0);
    expect(decision.proof.branch_protection.requires_distinct_approval).toBe(false);
    expect(decision.proof.branch_protection).not.toHaveProperty('lead_review_identity_satisfies');
  });

  test('count one branch protection creates a mechanical approval constraint', () => {
    const fixture = readFixture('l1-checker-ready-branch-protection.json');
    const decision = classifyPrReadiness(withBranchProtection(fixture, {
      required_approving_review_count: 1,
    }));

    expect(decision.route).toBe('READY_FOR_LEAD_ONLY');
    expect(decision.reason_codes).toContain('branch_protection_merge_constraint');
    expect(decision.follow_up || []).toHaveLength(1);
    expect(decision.proof.branch_protection.required_approving_review_count).toBe(1);
    expect(decision.proof.branch_protection.requires_distinct_approval).toBe(true);
  });

  test('missing branch-protection approval count fails closed', () => {
    const fixture = readFixture('l1-checker-ready-branch-protection.json');
    const decision = classifyPrReadiness(withBranchProtection(fixture, {}));

    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('branch_protection_approval_count_unavailable');
    expect(decision.corrections).toContain('branch_protection_approval_count_unavailable');
    expect(decision.proof.branch_protection.approval_count_observable).toBe(false);
  });

  test('nested checker approval count overrides stale self-declared booleans', () => {
    const fixture = readFixture('l1-checker-ready-branch-protection.json');
    const decision = classifyPrReadiness(withBranchProtection(fixture, {
      required_approving_review_count: 0,
      requires_distinct_approval: false,
      lead_review_identity_satisfies: true,
      observed: {
        required_pull_request_reviews: {
          required_approving_review_count: 1,
        },
      },
    }));

    expect(decision.route).toBe('READY_FOR_LEAD_ONLY');
    expect(decision.reason_codes).toContain('branch_protection_merge_constraint');
    expect(decision.proof.branch_protection.required_approving_review_count).toBe(1);
    expect(decision.proof.branch_protection.approval_count_source).toBe('branch-protection-checker');
    expect(decision.proof.branch_protection.requires_distinct_approval).toBe(true);
    expect(decision.proof.branch_protection).not.toHaveProperty('lead_review_identity_satisfies');
  });

  test('missing nested checker approval count does not fall back to flattened proof', () => {
    const fixture = readFixture('l1-checker-ready-branch-protection.json');
    const decision = classifyPrReadiness(withBranchProtection(fixture, {
      required_approving_review_count: 0,
      observed: {
        required_pull_request_reviews: {
          available: false,
          required_approving_review_count: null,
        },
      },
    }));

    expect(decision.route).toBe('KEEP_DRAFT_REVISE');
    expect(decision.reason_codes).toContain('branch_protection_approval_count_unavailable');
    expect(decision.proof.branch_protection.approval_count_source).toBe('branch-protection-checker');
    expect(decision.proof.branch_protection.approval_count_observable).toBe(false);
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

  test('ready decision validation rejects fabricated proof-incomplete decisions', () => {
    const decision = classifyPrReadiness(readFixture('live-l1-ready.json'));
    const malformed = {
      ...decision,
      proof: {
        ...decision.proof,
        ci_status: 'failure',
        ci_required_contexts: ['validate-platform'],
        ci_missing_contexts: [],
        ci_checks: [{ name: 'validate-platform', conclusion: 'FAILURE' }],
        checkers: [],
        lead_review_path: null,
        lead_review_result: null,
        lead_reviewed_sha: null,
        lead_review_evidence_tail_allowed: false,
      },
    };

    expect(() => validateDecision(malformed)).toThrow('READY_FOR_LEAD_ONLY requires successful CI status');
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

  test('rendered decision parser rejects marker and machine-decision disagreement', () => {
    const decision = classifyPrReadiness(readFixture('live-l1-ready.json'));
    const markdown = renderDecisionMarkdown(decision).replace(
      decisionMarker(decision),
      '<!-- 4veco-pr-readiness:meijer1973/4veco-platform:999:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa -->'
    );

    expect(() => parseRenderedDecisionMarkdown(markdown)).toThrow('PR readiness marker does not match machine decision');
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
      data: {
        repository: {
          pullRequest: {
            [connectionName]: {
              nodes,
              pageInfo,
            },
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
  function pairedApplyDecision() {
    const pairedHead = '4'.repeat(40);
    return {
      ...readFixture('apply-ready-decision.json'),
      proof: {
        ...readFixture('apply-ready-decision.json').proof,
        bundle: {
          paired_prs: [
            {
              repo: 'meijer1973/4veco-lessen',
              number: 35,
              open: true,
              current: true,
              mergeable: true,
              ready: false,
              is_draft: true,
              base: 'main',
              head_sha: pairedHead,
              reviewed_payload_head_sha: pairedHead,
            },
          ],
          transitionable_draft_members: [
            {
              repository: 'meijer1973/4veco-lessen',
              pr_number: 35,
              base: 'main',
              head_sha: pairedHead,
              reviewed_payload_head_sha: pairedHead,
              reason: 'controller_first_mark_ready',
            },
          ],
        },
      },
    };
  }

  function exactPairedLiveState(overrides = {}) {
    return {
      repo: 'meijer1973/4veco-lessen',
      number: 35,
      state: 'OPEN',
      is_draft: true,
      base: 'main',
      head_sha: '4'.repeat(40),
      mergeable: true,
      ...overrides,
    };
  }

  test('rejects a head SHA change between review and transition', () => {
    const decision = readFixture('apply-ready-decision.json');
    const currentPr = readFixture('apply-stale-pr.json');

    expect(() => verifyTransitionPreconditions(decision, currentPr)).toThrow('head_sha_changed');
  });

  test('paired transition preconditions accept the exact live paired state', () => {
    expect(
      verifyPairedTransitionPreconditions(pairedApplyDecision(), () => exactPairedLiveState())
    ).toBe(true);
  });

  test.each([
    ['head drift', { head_sha: '5'.repeat(40) }, 'paired_pr_head_sha_changed'],
    ['base drift', { base: 'develop' }, 'paired_pr_base_changed'],
    ['closed paired PR', { state: 'CLOSED' }, 'paired_pr_not_open'],
    ['merge conflict', { mergeable: false }, 'paired_pr_not_mergeable'],
    ['draft state changed', { is_draft: false }, 'paired_pr_draft_state_changed'],
  ])('paired transition preconditions reject %s', (_name, liveOverrides, failure) => {
    expect(() =>
      verifyPairedTransitionPreconditions(pairedApplyDecision(), () => exactPairedLiveState(liveOverrides))
    ).toThrow(failure);
  });

  test('paired transition preconditions require expected paired base proof', () => {
    const decision = pairedApplyDecision();
    delete decision.proof.bundle.paired_prs[0].base;
    delete decision.proof.bundle.transitionable_draft_members[0].base;

    expect(() =>
      verifyPairedTransitionPreconditions(decision, () => exactPairedLiveState())
    ).toThrow('paired_pr_base_missing');
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

  test('dry-run apply aborts before marking ready when paired live state is stale', () => {
    const decision = pairedApplyDecision();
    const currentPr = readFixture('apply-ready-pr.json');

    expect(() =>
      applyDecisionToState(decision, currentPr, {
        dryRun: true,
        fetchPairedPr: () => exactPairedLiveState({ head_sha: '5'.repeat(40) }),
      })
    ).toThrow('paired_pr_head_sha_changed');
    expect(currentPr.comments || []).toHaveLength(0);
    expect(currentPr.is_draft).toBe(true);
  });

  test('partial transition retry is idempotent when the reviewed PR is already ready', () => {
    const decision = pairedApplyDecision();
    const currentPr = {
      ...readFixture('apply-ready-pr.json'),
      is_draft: false,
    };
    const fetchPairedPr = jest.fn(() => {
      throw new Error('paired fetch should not run without a mark-ready mutation');
    });

    const result = applyDecisionToState(decision, currentPr, { dryRun: true, fetchPairedPr });

    expect(result.transition_action).toBe('already_ready');
    expect(fetchPairedPr).not.toHaveBeenCalled();
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

  test('malformed ready decisions are rejected before apply mutations', () => {
    const decision = readFixture('apply-ready-decision.json');
    const currentPr = readFixture('apply-ready-pr.json');
    const malformed = {
      ...decision,
      proof: {
        ...decision.proof,
        ci_status: 'failure',
        ci_required_contexts: ['validate-platform'],
        ci_missing_contexts: [],
        ci_checks: [],
        checkers: [],
        lead_review_path: null,
        lead_review_result: null,
        lead_reviewed_sha: null,
        lead_review_evidence_tail_allowed: false,
      },
    };

    expect(() => applyDecisionToState(malformed, currentPr, { dryRun: true })).toThrow(
      'READY_FOR_LEAD_ONLY requires successful CI status'
    );
    expect(currentPr.comments || []).toHaveLength(0);
    expect(currentPr.is_draft).toBe(true);
  });
});
