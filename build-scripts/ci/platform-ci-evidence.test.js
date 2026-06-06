const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  isPathInside,
  assertOutputOutsideRepos,
  validateEvidence,
} = require('./platform-ci-evidence');

function sha40(char) {
  return char.repeat(40);
}

function validEvidence(overrides = {}) {
  return {
    workflow: 'platform-ci',
    job: 'validate-platform',
    github_run_id: '123456',
    github_run_attempt: '1',
    github_ref: 'refs/heads/main',
    github_sha: sha40('a'),
    platform: {
      repository: 'meijer1973/4veco-platform',
      path: '4veco-platform',
      head_sha: sha40('b'),
      branch_or_ref: 'main',
    },
    lessen: {
      repository: 'meijer1973/4veco-lessen',
      path: '4veco-lessen',
      head_sha: sha40('c'),
      branch_or_ref: 'main',
    },
    node_version: 'v20.0.0',
    python_version: 'Python 3.13.0',
    package_lock_sha256: 'd'.repeat(64),
    created_at_utc: '2026-06-06T10:00:00.000Z',
    ...overrides,
  };
}

describe('platform-ci-evidence', () => {
  test('detects paths inside and outside repository roots', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'platform-ci-evidence-'));
    const repo = path.join(root, '4veco-platform');
    const sibling = path.join(root, 'ci-artifacts', 'platform-ci-evidence.json');
    const inside = path.join(repo, 'reports', 'platform-ci-evidence.json');

    expect(isPathInside(inside, repo)).toBe(true);
    expect(isPathInside(sibling, repo)).toBe(false);
  });

  test('rejects output inside either checkout', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'platform-ci-evidence-'));
    const platform = path.join(root, '4veco-platform');
    const lessen = path.join(root, '4veco-lessen');
    fs.mkdirSync(platform, { recursive: true });
    fs.mkdirSync(lessen, { recursive: true });

    expect(() =>
      assertOutputOutsideRepos(path.join(platform, 'evidence.json'), platform, lessen)
    ).toThrow(/inside platform checkout/);
    expect(() =>
      assertOutputOutsideRepos(path.join(lessen, 'evidence.json'), platform, lessen)
    ).toThrow(/inside lessen checkout/);
    expect(() =>
      assertOutputOutsideRepos(path.join(root, 'ci-artifacts', 'evidence.json'), platform, lessen)
    ).not.toThrow();
  });

  test('validates required evidence shape and SHAs', () => {
    expect(validateEvidence(validEvidence())).toBe(true);
    expect(() => validateEvidence(validEvidence({ github_sha: 'short' }))).toThrow(/github_sha/);
    expect(() =>
      validateEvidence(validEvidence({ platform: { ...validEvidence().platform, head_sha: 'bad' } }))
    ).toThrow(/platform.head_sha/);
  });
});
