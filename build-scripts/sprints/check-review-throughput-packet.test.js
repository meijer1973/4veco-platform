const path = require('path');
const { spawnSync } = require('child_process');

const checker = path.resolve(__dirname, 'check-review-throughput-packet.js');
const fixtureDir = path.resolve(__dirname, '..', '..', 'reports', 'fixtures', 'review-throughput-1');

function runFixture(name, extraArgs = []) {
  return spawnSync(process.execPath, [checker, path.join(fixtureDir, name), ...extraArgs], {
    cwd: path.resolve(__dirname, '..', '..'),
    encoding: 'utf8',
  });
}

describe('check-review-throughput-packet', () => {
  test('accepts an autonomous normal sprint packet with complete proof', () => {
    const result = runFixture('positive-autonomous.json');

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('OK review throughput packet');
  });

  test('accepts an autonomous packet when changed_paths matches the changed-paths file', () => {
    const result = runFixture('positive-autonomous.json', [
      '--changed-paths-file',
      path.join(fixtureDir, 'positive-autonomous.changed-paths.txt'),
    ]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('OK review throughput packet');
  });

  test('accepts protected-reference work when routed to a full human gate', () => {
    const result = runFixture('positive-human-gate-protected.json');

    expect(result.status).toBe(0);
  });

  test.each([
    ['negative-protected-reference-autonomous.json', 'protected references touched'],
    ['negative-machine-external-autonomous.json', 'machine/external references touched'],
    ['negative-generated-product-authority.json', 'generated lesson output claims product authority'],
    ['negative-diagnostics-authority.json', 'diagnostics/mastery/PV/student-use authority'],
    ['negative-missing-changed-paths.json', 'changed_paths is missing'],
    ['negative-empty-changed-paths.json', 'changed_paths must be a non-empty array of strings'],
    ['negative-missing-ci-proof.json', 'CI proof is missing'],
    ['negative-ci-success-no-reviewed-sha.json', 'CI proof is missing'],
    ['negative-ci-missing-validate-platform.json', 'required validate-platform CI context is missing'],
    ['negative-ci-validate-platform-failed.json', 'required validate-platform CI context is missing'],
    ['negative-missing-checker-proof.json', 'checker proof is missing'],
    ['negative-missing-lead-review.json', 'lead-review proof is missing'],
    ['negative-lead-review-result-only.json', 'lead-review proof is missing'],
    ['negative-escalation-trigger.json', 'escalation_triggers is non-empty'],
  ])('rejects %s for the intended reason', (file, expected) => {
    const result = runFixture(file);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain(expected);
  });
});
