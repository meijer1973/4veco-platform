const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  buildFreshnessProof,
  fileSha256,
} = require('./finalization-freshness-proof');

describe('finalization-freshness-proof', () => {
  test('hashes files and records origin main freshness inputs', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'freshness-proof-'));
    const file = path.join(dir, 'AGENTS.md');
    fs.writeFileSync(file, 'payload-lineage\n');
    const expectedHash = crypto.createHash('sha256').update('payload-lineage\n').digest('hex');

    const proof = buildFreshnessProof({
      cwd: dir,
      files: ['AGENTS.md'],
      headSha: 'a'.repeat(40),
      originMainSha: 'b'.repeat(40),
    });

    expect(fileSha256(file)).toBe(expectedHash);
    expect(proof.origin_main_sha).toBe('b'.repeat(40));
    expect(proof.files).toEqual([{ path: 'AGENTS.md', sha256: expectedHash }]);
  });
});
