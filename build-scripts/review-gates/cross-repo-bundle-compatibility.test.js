const {
  stateResult,
  summarizeCompatibility,
  validateCompatibilityProof,
} = require('./cross-repo-bundle-compatibility');

const pBase = '1'.repeat(40);
const pHead = '2'.repeat(40);
const lBase = '3'.repeat(40);
const lHead = '4'.repeat(40);

function state(name, status) {
  return stateResult({
    bundleId: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
    state: name,
    platformBaseSha: pBase,
    platformCandidateSha: pHead,
    lessonBaseSha: lBase,
    lessonCandidateSha: lHead,
    platformStateSha: name === 'lesson-first' ? pBase : pHead,
    lessonStateSha: name === 'platform-first' ? lBase : lHead,
    status,
    commands: [`check ${name}`],
  });
}

function matrix(platformFirst, lessonFirst, bundleFinal = 'success') {
  return summarizeCompatibility({
    states: [
      state('platform-first', platformFirst),
      state('lesson-first', lessonFirst),
      state('bundle-final', bundleFinal),
    ],
  });
}

describe('cross-repo bundle compatibility', () => {
  test('platform candidate plus paired lesson candidate green does not allow platform-first when lesson main is red', () => {
    const summary = matrix('failure', 'success');
    expect(summary.ok).toBe(true);
    expect(summary.permitted_merge_orders).toEqual(['lesson-first']);
    expect(summary.recommended_merge_order).toBe('lesson-first');
  });

  test('platform-first state green allows platform to merge first', () => {
    const summary = matrix('success', 'failure');
    expect(summary.ok).toBe(true);
    expect(summary.permitted_merge_orders).toEqual(['platform-first']);
    expect(summary.recommended_merge_order).toBe('platform-first');
  });

  test('both intermediate states green choose deterministic lesson-first default', () => {
    const summary = matrix('success', 'success');
    expect(summary.ok).toBe(true);
    expect(summary.permitted_merge_orders).toEqual(['platform-first', 'lesson-first']);
    expect(summary.recommended_merge_order).toBe('lesson-first');
  });

  test('bundle-final green but both intermediate states red is blocked', () => {
    const summary = matrix('failure', 'failure');
    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('no_green_intermediate_order');
    expect(summary.permitted_merge_orders).toEqual([]);
  });

  test('red bundle-final blocks even when an intermediate is green', () => {
    const summary = matrix('success', 'success', 'failure');
    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('bundle_final_not_green');
    expect(summary.permitted_merge_orders).toEqual([]);
  });

  test('validates exact bundle id and members', () => {
    const summary = matrix('success', 'success');
    expect(validateCompatibilityProof(summary, {
      bundleId: 'PRESENTATION-V2-113-GRAPH-TRANSFER-1',
      exactMembers: {
        platform_base_sha: pBase,
        platform_candidate_sha: pHead,
        lesson_base_sha: lBase,
        lesson_candidate_sha: lHead,
      },
    }).ok).toBe(true);

    expect(validateCompatibilityProof(summary, {
      exactMembers: { lesson_candidate_sha: '5'.repeat(40) },
    }).failures).toContain(`lesson_candidate_sha mismatch: expected ${'5'.repeat(40)}`);
  });
});
