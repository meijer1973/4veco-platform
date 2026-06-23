const {
  readinessCommentFromComments,
  readinessMarkerFor,
  validatePrState,
} = require('./integrate-authorized-pr');

describe('authorized PR integration runner', () => {
  test('refuses a stale or missing validate-platform check before merge', () => {
    const failures = validatePrState({
      state: 'OPEN',
      isDraft: false,
      mergeable: true,
      mergeStateStatus: 'CLEAN',
      statusCheckRollup: [{ name: 'lint', conclusion: 'SUCCESS' }],
    });

    expect(failures).toContain('validate_platform_missing_or_not_successful');
  });

  test('accepts open clean PR state with successful validate-platform', () => {
    const failures = validatePrState({
      state: 'OPEN',
      isDraft: false,
      mergeable: true,
      mergeStateStatus: 'CLEAN',
      statusCheckRollup: [{ name: 'validate-platform', conclusion: 'SUCCESS' }],
    });

    expect(failures).toEqual([]);
  });

  test('accepts an exact-head ready PR-readiness comment', () => {
    const marker = readinessMarkerFor('meijer1973/4veco-platform', 136, 'a'.repeat(40));
    const readiness = readinessCommentFromComments(
      [{ id: 12, body: `${marker}\n- Route: \`READY_FOR_HUMAN_REVIEW\`` }],
      'meijer1973/4veco-platform',
      136,
      'a'.repeat(40)
    );

    expect(readiness).toMatchObject({
      ok: true,
      comment_id: 12,
      route: 'READY_FOR_HUMAN_REVIEW',
    });
  });

  test('rejects a stale PR-readiness comment for a previous head', () => {
    const marker = readinessMarkerFor('meijer1973/4veco-platform', 136, 'a'.repeat(40));
    const readiness = readinessCommentFromComments(
      [{ id: 12, body: `${marker}\n- Route: \`READY_FOR_HUMAN_REVIEW\`` }],
      'meijer1973/4veco-platform',
      136,
      'b'.repeat(40)
    );

    expect(readiness).toMatchObject({
      ok: false,
      failure: 'exact_head_readiness_comment_missing',
    });
  });

  test('rejects an exact-head PR-readiness comment that is not ready', () => {
    const marker = readinessMarkerFor('meijer1973/4veco-platform', 136, 'a'.repeat(40));
    const readiness = readinessCommentFromComments(
      [{ id: 12, body: `${marker}\n- Route: \`KEEP_DRAFT_REVISE\`` }],
      'meijer1973/4veco-platform',
      136,
      'a'.repeat(40)
    );

    expect(readiness).toMatchObject({
      ok: false,
      comment_id: 12,
      route: 'KEEP_DRAFT_REVISE',
      failure: 'exact_head_readiness_comment_not_ready',
    });
  });
});
