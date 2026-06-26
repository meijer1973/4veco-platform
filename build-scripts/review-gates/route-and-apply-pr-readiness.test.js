const fs = require('fs');
const os = require('os');
const path = require('path');
const { runRouteAndApply } = require('./route-and-apply-pr-readiness');
const { stateResult, summarizeCompatibility } = require('./cross-repo-bundle-compatibility');

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

function exactMembers() {
  return {
    platform_base_sha: '1'.repeat(40),
    platform_candidate_sha: '2'.repeat(40),
    lesson_base_sha: '3'.repeat(40),
    lesson_candidate_sha: '4'.repeat(40),
  };
}

function platformFirstCompatibility(exact = exactMembers()) {
  const state = (name, status) => stateResult({
    bundleId: 'PRESENTATION-V2-DRAFT-TRANSITION-1',
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

function controllerFirstFixture(tempDir, { alreadyReady = false } = {}) {
  const exact = exactMembers();
  const remoteEvidence = {
    reviewed_pr: {
      repo: 'meijer1973/4veco-platform',
      number: 147,
      url: 'https://github.com/meijer1973/4veco-platform/pull/147',
      state: 'OPEN',
      was_draft: true,
      base: 'main',
      head_sha: exact.platform_candidate_sha,
      merge_state: 'CLEAN',
      mergeable: true,
    },
    changed_paths: ['package.json'],
    proof: {
      ci: {
        head_sha: exact.platform_candidate_sha,
        conclusion: 'success',
        required_contexts: ['validate-platform'],
        checks: [{ name: 'validate-platform', conclusion: 'SUCCESS' }],
      },
      changed_paths_verified: true,
    },
  };
  const supplemental = {
    throughput: {
      class: 'cross_repo_bundle',
      authority_class: 'generated_output',
      level: 'L4',
      human_decision_required: true,
    },
    human_review_payload: 'consequential_exception',
    consequence: 'high',
    proof: {
      checkers: [{ command: 'npm.cmd run check:platform', status: 'passed' }],
      lead_review: {
        path: 'subagent:paired-bundle-review',
        result: 'PASS',
        reviewed_commit_sha: exact.platform_candidate_sha,
        paired_member_reviews: [
          {
            repository: 'meijer1973/4veco-lessen',
            pr_number: 35,
            reviewed_commit_sha: exact.lesson_candidate_sha,
            review_result: 'PASS',
            review_path: 'subagent:paired-bundle-review',
          },
        ],
      },
      branch_protection: {
        required_approving_review_count: 0,
      },
    },
    bundle: {
      bundle_id: 'PRESENTATION-V2-DRAFT-TRANSITION-1',
      controller: {
        repository: 'meijer1973/4veco-platform',
        pr_number: 147,
        reviewed_payload_head_sha: exact.platform_candidate_sha,
      },
      exact_members: exact,
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
          head_sha: exact.lesson_candidate_sha,
          reviewed_payload_head_sha: exact.lesson_candidate_sha,
        },
      ],
      compatibility: platformFirstCompatibility(exact),
    },
  };
  const fixturePr = {
    repo: 'meijer1973/4veco-platform',
    number: 147,
    state: 'OPEN',
    is_draft: !alreadyReady,
    base: 'main',
    head_sha: exact.platform_candidate_sha,
    comments: [],
  };
  const fixturePath = path.join(tempDir, `remote-${alreadyReady ? 'ready' : 'draft'}.json`);
  const evidencePath = path.join(tempDir, `supplemental-${alreadyReady ? 'ready' : 'draft'}.json`);
  const fixturePrPath = path.join(tempDir, `pr-${alreadyReady ? 'ready' : 'draft'}.json`);
  writeJson(fixturePath, remoteEvidence);
  writeJson(evidencePath, supplemental);
  writeJson(fixturePrPath, fixturePr);
  return { fixturePath, evidencePath, fixturePrPath };
}

describe('route-and-apply-pr-readiness', () => {
  test('collects live readiness and applies the allowed transition in one operation', () => {
    const decision = {
      route: 'READY_FOR_HUMAN_REVIEW',
      allowed_transition: 'MARK_READY',
      reviewed_pr: {
        repo: 'meijer1973/4veco-platform',
        number: 146,
        base: 'main',
        head_sha: 'a'.repeat(40),
      },
    };
    const runReview = jest.fn(() => ({ decision, markdown: 'ready\n' }));
    const applyLiveDecision = jest.fn(() => ({
      ok: true,
      route: 'READY_FOR_HUMAN_REVIEW',
      allowed_transition: 'MARK_READY',
      transition_action: 'marked_ready',
    }));

    const result = runRouteAndApply(
      {
        repo: 'meijer1973/4veco-platform',
        prNumber: 146,
        evidence: 'evidence.json',
        expectTransition: 'MARK_READY',
      },
      { runReview, applyDecision: applyLiveDecision }
    );

    expect(runReview).toHaveBeenCalledWith({
      repo: 'meijer1973/4veco-platform',
      prNumber: 146,
      evidence: 'evidence.json',
    });
    expect(applyLiveDecision).toHaveBeenCalledWith(decision, {
      dryRun: false,
      fixturePr: undefined,
    });
    expect(result.application.transition_action).toBe('marked_ready');
    expect(result.markdown).toBe('ready\n');
  });

  test('requires supplemental evidence before reporting successful routing', () => {
    expect(() =>
      runRouteAndApply({ repo: 'meijer1973/4veco-platform', prNumber: 146 })
    ).toThrow(/--evidence <file> is required/);
  });

  test('requires expected MARK_READY before collecting or applying evidence', () => {
    const runReview = jest.fn();
    const applyDecision = jest.fn();

    expect(() =>
      runRouteAndApply(
        {
          repo: 'meijer1973/4veco-platform',
          prNumber: 146,
          evidence: 'evidence.json',
        },
        { runReview, applyDecision }
      )
    ).toThrow(/--expect-transition MARK_READY is required/);

    expect(runReview).not.toHaveBeenCalled();
    expect(applyDecision).not.toHaveBeenCalled();
  });

  test('rejects non-MARK_READY expected transitions', () => {
    expect(() =>
      runRouteAndApply({
        repo: 'meijer1973/4veco-platform',
        prNumber: 146,
        evidence: 'evidence.json',
        expectTransition: 'NONE',
      })
    ).toThrow(/--expect-transition MARK_READY is required/);
  });

  test('runs real review and fixture-state application with expected MARK_READY', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'route-apply-'));
    const fixture = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'reports/fixtures/pr-readiness-router/l0-mechanical-ready.json'),
        'utf8'
      )
    );
    const supplemental = {
      proof: {
        checkers: fixture.proof.checkers,
        lead_review: fixture.proof.lead_review,
        branch_protection: fixture.proof.branch_protection,
      },
    };
    const remoteEvidence = {
      ...fixture,
      proof: {
        ci: fixture.proof.ci,
        changed_paths_verified: true,
      },
    };
    const fixturePath = path.join(tempDir, 'remote-evidence.json');
    const evidencePath = path.join(tempDir, 'supplemental-evidence.json');
    const fixturePrPath = path.join(tempDir, 'fixture-pr.json');
    writeJson(fixturePath, remoteEvidence);
    writeJson(evidencePath, supplemental);
    writeJson(fixturePrPath, {
      repo: fixture.reviewed_pr.repo,
      number: fixture.reviewed_pr.number,
      state: 'OPEN',
      is_draft: true,
      base: fixture.reviewed_pr.base,
      head_sha: fixture.reviewed_pr.head_sha,
      comments: [],
    });

    const result = runRouteAndApply({
      repo: fixture.reviewed_pr.repo,
      prNumber: fixture.reviewed_pr.number,
      fixture: fixturePath,
      fixturePr: fixturePrPath,
      evidence: evidencePath,
      expectTransition: 'MARK_READY',
    });

    expect(result.decision.route).toBe('READY_FOR_LEAD_ONLY');
    expect(result.decision.allowed_transition).toBe('MARK_READY');
    expect(result.application.transition_action).toBe('marked_ready');
  });

  test('routes and marks the platform controller ready with a transitionable draft lesson member', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'route-apply-bundle-'));
    const { fixturePath, evidencePath, fixturePrPath } = controllerFirstFixture(tempDir);

    const result = runRouteAndApply({
      repo: 'meijer1973/4veco-platform',
      prNumber: 147,
      fixture: fixturePath,
      fixturePr: fixturePrPath,
      evidence: evidencePath,
      expectTransition: 'MARK_READY',
    });

    expect(result.decision.route).toBe('READY_FOR_HUMAN_REVIEW');
    expect(result.decision.proof.bundle.merge_ready).toBe(false);
    expect(result.decision.proof.bundle.transitionable_draft_members).toHaveLength(1);
    expect(result.application.transition_action).toBe('marked_ready');
  });

  test('safely retries after a partial controller-first mark-ready transition', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'route-apply-bundle-retry-'));
    const { fixturePath, evidencePath, fixturePrPath } = controllerFirstFixture(tempDir, { alreadyReady: true });

    const result = runRouteAndApply({
      repo: 'meijer1973/4veco-platform',
      prNumber: 147,
      fixture: fixturePath,
      fixturePr: fixturePrPath,
      evidence: evidencePath,
      expectTransition: 'MARK_READY',
    });

    expect(result.decision.route).toBe('READY_FOR_HUMAN_REVIEW');
    expect(result.application.transition_action).toBe('already_ready');
  });

  test('fails when expected MARK_READY is not routed', () => {
    const decision = {
      route: 'KEEP_DRAFT_REVISE',
      allowed_transition: 'NONE',
      reviewed_pr: {
        repo: 'meijer1973/4veco-platform',
        number: 148,
        base: 'main',
        head_sha: 'b'.repeat(40),
      },
    };

    expect(() =>
      runRouteAndApply(
        {
          repo: 'meijer1973/4veco-platform',
          prNumber: 148,
          evidence: 'evidence.json',
          expectTransition: 'MARK_READY',
        },
        {
          runReview: () => ({ decision, markdown: 'revise\n' }),
          applyDecision: () => ({
            ok: true,
            route: 'KEEP_DRAFT_REVISE',
            allowed_transition: 'NONE',
            transition_action: 'none',
          }),
        }
      )
    ).toThrow(/expected transition MARK_READY, got NONE/);
  });
});
