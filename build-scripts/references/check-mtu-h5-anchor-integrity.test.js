const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('MTU-H5 anchor integrity audit', () => {
  test('runs read-only under platform validation', () => {
    const script = path.join(process.cwd(), 'build-scripts', 'references', 'check-mtu-h5-anchor-integrity.js');
    const auditJson = path.join(process.cwd(), 'reports', 'mtu-hardening', 'mtu-h5-anchor-integrity-audit.json');
    const auditMd = path.join(process.cwd(), 'reports', 'mtu-hardening', 'mtu-h5-anchor-integrity-audit.md');
    const before = {
      json: fs.readFileSync(auditJson, 'utf8'),
      md: fs.readFileSync(auditMd, 'utf8'),
    };
    const result = spawnSync(process.execPath, [script], {
      cwd: process.cwd(),
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 20,
    });

    if (result.status !== 0) {
      throw new Error(`H5 anchor integrity checker failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
    }
    expect(result.stdout).toContain('OK MTU-H5 anchor integrity audit');
    expect(fs.readFileSync(auditJson, 'utf8')).toBe(before.json);
    expect(fs.readFileSync(auditMd, 'utf8')).toBe(before.md);
  });
});
