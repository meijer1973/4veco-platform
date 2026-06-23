const {
  classifyBaseDrift,
  summarizeLineage,
  summarizeFromGit,
} = require('./check-integration-lineage');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const payloadSha = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const integrationSha = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

function base(overrides = {}) {
  return {
    reviewed_payload_head_sha: payloadSha,
    integration_head_sha: integrationSha,
    base_sha_at_review: '1111111111111111111111111111111111111111',
    current_main_sha: '2222222222222222222222222222222222222222',
    payload_ancestor_of_integration_head: true,
    payload_paths: ['src/payload.js'],
    base_delta_paths: ['docs/other.md'],
    intervening_commits: [],
    ...overrides,
  };
}

function git(cwd, args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${(result.stderr || result.stdout).trim()}`);
  }
  return result.stdout.trim();
}

describe('integration lineage', () => {
  test('main advances only on unrelated paths inherits authorization', () => {
    const summary = summarizeLineage(base());

    expect(summary.ok).toBe(true);
    expect(summary.authorization_inherited).toBe(true);
    expect(summary.base_drift.classification).toBe('no_substantive_overlap');
  });

  test('main advances repeatedly and conflict-free base sync commits remain valid', () => {
    const summary = summarizeLineage(base({
      base_delta_paths: ['docs/a.md', 'docs/b.md'],
      intervening_commits: [
        { sha: 'cccccccccccccccccccccccccccccccccccccccc', parents: [payloadSha, '1111111111111111111111111111111111111111'], changed_paths: ['docs/a.md'] },
        { sha: integrationSha, parents: ['cccccccccccccccccccccccccccccccccccccccc', '2222222222222222222222222222222222222222'], changed_paths: ['docs/b.md'] },
      ],
    }));

    expect(summary.ok).toBe(true);
    expect(summary.intervening_commits.every((commit) => commit.classification === 'conflict_free_main_base_sync_merge')).toBe(true);
  });

  test('two serialized PRs refresh later PR against earlier merged paths', () => {
    const summary = summarizeLineage(base({
      payload_paths: ['feature/b.js'],
      base_delta_paths: ['feature/a.js'],
      intervening_commits: [
        { sha: integrationSha, parents: [payloadSha, '3333333333333333333333333333333333333333'], changed_paths: ['feature/a.js'] },
      ],
    }));

    expect(summary.ok).toBe(true);
    expect(summary.base_drift.classification).toBe('no_substantive_overlap');
  });

  test('rebase or force-push after authorization rejects lineage', () => {
    const summary = summarizeLineage(base({ payload_ancestor_of_integration_head: false }));

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('reviewed_payload_head_not_ancestor');
  });

  test('new substantive commit after authorization rejects lineage', () => {
    const summary = summarizeLineage(base({
      intervening_commits: [
        { sha: integrationSha, parents: [payloadSha], changed_paths: ['src/new-work.js'] },
      ],
    }));

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('substantive_pr_authored_commit_after_authorization');
  });

  test('conflict-free base merge is accepted', () => {
    const summary = summarizeLineage(base({
      base_delta_paths: ['docs/main.md'],
      intervening_commits: [
        { sha: integrationSha, parents: [payloadSha, '2222222222222222222222222222222222222222'], changed_paths: ['docs/main.md'] },
      ],
    }));

    expect(summary.ok).toBe(true);
    expect(summary.intervening_commits[0].classification).toBe('conflict_free_main_base_sync_merge');
  });

  test('manual conflict resolution is rejected', () => {
    const summary = summarizeLineage(base({
      intervening_commits: [
        { sha: integrationSha, parents: [payloadSha, '2222222222222222222222222222222222222222'], changed_paths: ['src/payload.js'], manual_conflict_resolution: true },
      ],
    }));

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('manual_conflict_resolution');
  });

  test('non-overlapping base delta is accepted automatically', () => {
    const drift = classifyBaseDrift(['src/payload.js'], ['docs/main.md']);

    expect(drift.classification).toBe('no_substantive_overlap');
    expect(drift.requires_integration_delta_lead_review).toBe(false);
  });

  test('substantive overlapping paths require integration-delta lead review', () => {
    const summary = summarizeLineage(base({
      payload_paths: ['src/shared.js'],
      base_delta_paths: ['src/shared.js'],
    }));

    expect(summary.ok).toBe(true);
    expect(summary.requires_integration_delta_lead_review).toBe(true);
  });

  test('changed effective product or authority decision requires human re-review', () => {
    const summary = summarizeLineage(base({ authority_scope_changed: true }));

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('authority_or_scope_change');
  });

  test('generated index and evidence-only refresh is accepted only through allowlist', () => {
    const summary = summarizeLineage(base({
      intervening_commits: [
        { sha: integrationSha, parents: [payloadSha], changed_paths: ['reports/github-agent-index-platform.md'] },
      ],
    }));

    expect(summary.ok).toBe(true);
    expect(summary.intervening_commits[0].classification).toBe('allowlisted_deterministic_evidence_refresh');
  });

  test('PR head changes immediately before merge is represented as a stale integration head', () => {
    const summary = summarizeLineage(base({
      integration_head_sha: 'cccccccccccccccccccccccccccccccccccccccc',
      expected_integration_head_sha: integrationSha,
      payload_ancestor_of_integration_head: false,
    }));

    expect(summary.ok).toBe(false);
    expect(summary.failures).toContain('reviewed_payload_head_not_ancestor');
  });

  test('main changes immediately before merge remains retryable when payload lineage is intact', () => {
    const summary = summarizeLineage(base({
      current_main_sha: 'dddddddddddddddddddddddddddddddddddddddd',
      base_delta_paths: ['docs/new-main.md'],
    }));

    expect(summary.ok).toBe(true);
    expect(summary.base_drift.classification).toBe('no_substantive_overlap');
  });

  test('git mode ignores commits reachable only through a base-sync merge second parent', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), '4veco-lineage-'));
    git(dir, ['init', '-b', 'main']);
    git(dir, ['config', 'user.email', 'codex@example.invalid']);
    git(dir, ['config', 'user.name', 'Codex']);
    fs.writeFileSync(path.join(dir, 'README.md'), 'base\n');
    git(dir, ['add', '.']);
    git(dir, ['commit', '-m', 'base']);
    const baseSha = git(dir, ['rev-parse', 'HEAD']);

    git(dir, ['checkout', '-b', 'pr']);
    fs.mkdirSync(path.join(dir, 'src'));
    fs.writeFileSync(path.join(dir, 'src', 'payload.js'), 'payload\n');
    git(dir, ['add', '.']);
    git(dir, ['commit', '-m', 'payload']);
    const payloadHead = git(dir, ['rev-parse', 'HEAD']);

    git(dir, ['checkout', 'main']);
    fs.mkdirSync(path.join(dir, 'docs'));
    fs.writeFileSync(path.join(dir, 'docs', 'main.md'), 'main\n');
    git(dir, ['add', '.']);
    git(dir, ['commit', '-m', 'main advance']);
    const mainHead = git(dir, ['rev-parse', 'HEAD']);

    git(dir, ['checkout', 'pr']);
    git(dir, ['merge', '--no-ff', 'main', '-m', 'Merge main into pr']);
    const integrationHead = git(dir, ['rev-parse', 'HEAD']);

    const summary = summarizeFromGit({
      cwd: dir,
      payloadSha: payloadHead,
      headSha: integrationHead,
      baseShaAtReview: baseSha,
      currentMainSha: mainHead,
    });

    expect(summary.ok).toBe(true);
    expect(summary.intervening_commits).toHaveLength(1);
    expect(summary.intervening_commits[0]).toMatchObject({
      sha: integrationHead,
      classification: 'conflict_free_main_base_sync_merge',
      invalidating: false,
    });
  });
});
