const { spawnSync } = require('child_process');
const path = require('path');

describe('MTU-H6 cross-exam generalization checker', () => {
  test('runs as part of platform validation', () => {
    const script = path.join(
      process.cwd(),
      'build-scripts',
      'references',
      'check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js'
    );

    const result = spawnSync(process.execPath, [script, '--json'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 20,
    });

    expect(result.status).toBe(0);
    const payload = JSON.parse(result.stdout);
    expect(payload.sprint_id).toBe('MTU-H6');
    expect(payload.rendered_evidence_records).toBe(13);
  });
});
