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
      'L0-L2 may merge through the normal merge path.',
      'Agents can call `gh pr merge` directly after CI.',
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
      'normal-merge-path-permission',
      'direct-gh-pr-merge-permission',
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

  test('flags stale lifecycle wording after readiness can mark ready', () => {
    const text = [
      'Draft until paired bundle compatibility is green.',
      'Do not mark ready until owner authorization.',
      'This PR should stay draft while waiting for owner review.',
      'MARK_READY allowed only after explicit owner authorization.',
      'Owner authorization required before marking ready.',
      'Please authorize exact head before routing.',
      'This packet requests exact-head authorization.',
      'Explicit owner authorization naming the exact PR head and selected decision.',
      'Human owner decision tied to exact PR head.',
      'Human owner may review whether to authorize the exact-head contact-stage packet.',
      'Explicit owner authorization that cites the PR head and current green checks.',
      'Route as READY_FOR_HUMAN_REVIEW and require exact-head owner authorization before merge.',
      'Contact text is ready only for exact-head owner-authorized dispatch.',
      'Record explicit owner authorization in the PR thread that names the reviewed PR head SHA before merge.',
    ].join('\n');

    expect(findViolationsInText('AGENTS.md', text).map((item) => item.pattern)).toEqual([
      'draft-until-stale-lifecycle',
      'do-not-mark-ready-until',
      'this-pr-should-stay-draft',
      'mark-ready-owner-authorization',
      'owner-authorization-before-ready',
      'authorize-exact-head',
      'exact-head-authorization',
      'owner-authorization-naming-exact-pr-head',
      'owner-decision-tied-to-exact-pr-head',
      'authorize-exact-head-packet',
      'owner-authorization-cites-head',
      'exact-head-owner-authorization',
      'exact-head-owner-authorized',
      'reviewed-pr-head-sha-authorization',
      'owner-approval-tied-to-exact-head',
    ]);
  });

  test('allows payload-lineage authorization wording', () => {
    const text = 'Human authorization binds to the reviewed payload head, not to every later base-sync head.';

    expect(findViolationsInText('AGENTS.md', text)).toEqual([]);
  });

  test('allows direct-merge wording when it is unconditionally prohibited', () => {
    const text = 'Agents must not call `gh pr merge` directly; use the authorized integration lane.';

    expect(findViolationsInText('AGENTS.md', text)).toEqual([]);
  });

  test('flags cloud workflow fallback wording that permits direct merge', () => {
    const text = 'If the GitHub-hosted workflow fails with 403 because it cannot read branch protection, use `gh pr merge` after CI.';

    expect(findViolationsInText('AGENTS.md', text).map((item) => item.pattern)).toEqual([
      'cloud-workflow-fallback-direct-merge',
    ]);
  });

  test('flags stale activation-as-operating-mode wording', () => {
    const text = [
      'Before activation, the required context is `validate-platform`; after activation, the required contexts are exactly `validate-platform` and `integration-authorized`.',
      'After activation, agents must not call `gh pr merge` directly for normal PRs.',
      'Activated integration also requires repository `allow_auto_merge: true` before the lane can schedule protected-branch-compatible auto-merge.',
    ].join('\n');

    expect(findViolationsInText('AGENTS.md', text).map((item) => item.pattern)).toEqual([
      'activation-required-context-operating-mode',
      'activation-direct-merge-operating-mode',
      'activation-auto-merge-operating-mode',
    ]);
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

  test('flags retired Claude command paths in active metadata', () => {
    const text = '.claude/commands/econ-pptx-templates.md text eol=lf';

    expect(findViolationsInText('.gitattributes', text).map((item) => item.pattern)).toEqual([
      'claude-command-path',
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
