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

  test('flags retired Claude policy and command surfaces in active guidance', () => {
    const text = [
      'Use `../CLAUDE.md` before every task.',
      '`CLAUDE.md` contains the operating rules.',
      'Use `skills/` and `.claude/commands/` for content-production workflows.',
      'Create scratch output under `/tmp/claude-work/qc-YYYY-MM-DD/`.',
    ].join('\n');

    expect(findViolationsInText('AGENTS.md', text).map((item) => item.pattern)).toEqual([
      'claude-md-read-first',
      'claude-md-operating-rules',
      'claude-command-skill-surface',
      'claude-work-temp-path',
    ]);
  });

  test('flags stale Claude entrypoint guidance in research prompts', () => {
    const violations = scanFiles([
      {
        path: 'RESEARCH_AGENT_PROMPT.md',
        text: '- `AGENTS.md` and `CLAUDE.md` for operating rules',
      },
      {
        path: '../4veco-lessen/RESEARCH_AGENT_PROMPT.md',
        text: 'Use `skills/` and `.claude/commands/` for content-production workflows.',
      },
    ]);

    expect(violations.map((item) => item.pattern)).toEqual([
      'claude-md-operating-rules',
      'claude-command-skill-surface',
    ]);
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
