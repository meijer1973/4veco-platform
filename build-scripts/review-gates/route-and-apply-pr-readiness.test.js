const fs = require('fs');
const os = require('os');
const path = require('path');
const { runRouteAndApply } = require('./route-and-apply-pr-readiness');

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
    fs.writeFileSync(fixturePath, JSON.stringify(remoteEvidence, null, 2));
    fs.writeFileSync(evidencePath, JSON.stringify(supplemental, null, 2));
    fs.writeFileSync(
      fixturePrPath,
      JSON.stringify(
        {
          repo: fixture.reviewed_pr.repo,
          number: fixture.reviewed_pr.number,
          state: 'OPEN',
          is_draft: true,
          base: fixture.reviewed_pr.base,
          head_sha: fixture.reviewed_pr.head_sha,
          comments: [],
        },
        null,
        2
      )
    );

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
