const {
  findViolationsInText,
  scanFiles,
  shouldExcludePath,
} = require('./check-active-governance-wording');

describe('check-active-governance-wording', () => {
  test('flags stale owner-ready and exact-head authorization wording', () => {
    const text = [
      'Owner authorization required before marking ready.',
      'Owner approval tied to exact PR head.',
      'The human decision must identify the PR number, exact head SHA.',
      'owner_authorization_exact_sha',
      'after exact-head human merge',
      'do not mark ready or merge until owner authorization',
      'marking ready still requires owner authorization',
      'authorization for the exact platform and lesson heads',
    ].join('\n');

    const violations = findViolationsInText('AGENTS.md', text);

    expect(violations.map((item) => item.pattern)).toEqual([
      'owner-authorization-before-ready',
      'owner-approval-tied-to-exact-head',
      'human-decision-exact-head-sha',
      'owner-authorization-exact-sha-field',
      'exact-head-human-merge',
      'do-not-ready-or-merge-until-owner',
      'marking-ready-requires-owner',
      'authorization-exact-platform-lesson-heads',
    ]);
  });

  test('flags line-wrapped exact-head authorization instructions', () => {
    const text = [
      'Agents must obtain explicit human/owner authorization for the exact',
      'head SHA before marking ready.',
    ].join('\n');

    expect(findViolationsInText('CLAUDE.md', text).map((item) => item.pattern)).toEqual([
      'obtain-authorization-exact-head-sha',
    ]);
  });

  test('allows payload-lineage authorization wording', () => {
    const text = 'Human authorization binds to the reviewed payload head, not to every later base-sync head.';

    expect(findViolationsInText('AGENTS.md', text)).toEqual([]);
  });

  test('ignores archived and report paths', () => {
    const violations = scanFiles([
      {
        path: 'reports/old-review.md',
        text: 'Owner authorization required before marking ready.',
      },
      {
        path: 'docs/review/archive/old-review.md',
        text: 'Owner approval tied to exact PR head.',
      },
    ]);

    expect(violations).toEqual([]);
    expect(shouldExcludePath('docs/review/archive/old-review.md')).toBe(true);
  });
});
