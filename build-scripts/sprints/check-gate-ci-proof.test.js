const path = require('path');
const { spawnSync } = require('child_process');

const checker = path.resolve(__dirname, 'check-gate-ci-proof.js');
const fixtureDir = path.resolve(__dirname, '..', '..', 'reports', 'fixtures', 'gate-ci-proof1');

function runFixture(name) {
  return spawnSync(process.execPath, [checker, path.join(fixtureDir, name)], {
    cwd: path.resolve(__dirname, '..', '..'),
    encoding: 'utf8',
  });
}

describe('check-gate-ci-proof', () => {
  test('accepts a markdown packet with reviewed commit and passing CI proof', () => {
    const result = runFixture('positive-markdown.md');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('OK gate CI proof: ci-proof');
  });

  test('accepts a JSON packet with reviewed commit and passing CI proof', () => {
    const result = runFixture('positive-json.json');
    expect(result.status).toBe(0);
  });

  test.each([
    ['negative-missing-run-id.md', 'missing run ID'],
    ['negative-missing-commit.md', 'missing reviewed commit SHA'],
    ['negative-conclusion-failure.md', 'CI conclusion must be success'],
    ['negative-vague-waiver.md', 'vague CI waiver'],
    ['negative-run-no-reviewed-commit.md', 'missing reviewed commit SHA'],
    ['negative-local-command-log.md', 'local-only command log'],
  ])('rejects %s for the intended reason', (file, expected) => {
    const result = runFixture(file);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain(expected);
  });
});
