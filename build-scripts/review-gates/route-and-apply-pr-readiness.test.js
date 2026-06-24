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
      { repo: 'meijer1973/4veco-platform', prNumber: 146, evidence: 'evidence.json' },
      { runReview, applyLiveDecision }
    );

    expect(runReview).toHaveBeenCalledWith({
      repo: 'meijer1973/4veco-platform',
      prNumber: 146,
      evidence: 'evidence.json',
    });
    expect(applyLiveDecision).toHaveBeenCalledWith(decision, { dryRun: false });
    expect(result.application.transition_action).toBe('marked_ready');
    expect(result.markdown).toBe('ready\n');
  });
});
