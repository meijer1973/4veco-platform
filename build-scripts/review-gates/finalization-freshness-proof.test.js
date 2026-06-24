const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  buildFreshnessProof,
  fileSha256,
} = require('./finalization-freshness-proof');

describe('finalization-freshness-proof', () => {
  function gitRunner(remoteSha, originSha, headSha = 'c'.repeat(40)) {
    return (args) => {
      const command = args.join(' ');
      if (command === 'rev-parse HEAD') return `${headSha}\n`;
      if (command === 'rev-parse origin/main') return `${originSha}\n`;
      if (command === 'ls-remote --heads origin refs/heads/main') {
        return `${remoteSha}\trefs/heads/main\n`;
      }
      if (command === `merge-base --is-ancestor ${remoteSha} ${headSha}`) {
        return { status: 0, stdout: '', stderr: '' };
      }
      if (command === `show ${remoteSha}:AGENTS.md`) return 'remote-policy\n';
      return { status: 1, stdout: '', stderr: `unexpected git command: ${command}` };
    };
  }

  test('hashes branch and remote-main files and records freshness inputs', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'freshness-proof-'));
    const file = path.join(dir, 'AGENTS.md');
    fs.writeFileSync(file, 'payload-lineage\n');
    const expectedWorkingHash = crypto.createHash('sha256').update('payload-lineage\n').digest('hex');
    const expectedRemoteHash = crypto.createHash('sha256').update('remote-policy\n').digest('hex');
    const sha = 'b'.repeat(40);

    const proof = buildFreshnessProof({
      cwd: dir,
      files: ['AGENTS.md'],
      gitRunner: gitRunner(sha, sha),
    });

    expect(fileSha256(file)).toBe(expectedWorkingHash);
    expect(proof.remote_main_sha).toBe(sha);
    expect(proof.origin_main_sha).toBe(sha);
    expect(proof.remote_main_matches_origin_main).toBe(true);
    expect(proof.remote_main_is_ancestor_of_head).toBe(true);
    expect(proof.files).toEqual([
      {
        path: 'AGENTS.md',
        working_tree_sha256: expectedWorkingHash,
        remote_main_sha256: expectedRemoteHash,
      },
    ]);
  });

  test('fails when local origin main is stale', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'freshness-proof-stale-'));
    fs.writeFileSync(path.join(dir, 'AGENTS.md'), 'payload-lineage\n');

    expect(() =>
      buildFreshnessProof({
        cwd: dir,
        files: ['AGENTS.md'],
        gitRunner: gitRunner('b'.repeat(40), 'a'.repeat(40)),
      })
    ).toThrow(/stale origin\/main/);
  });
});
