const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  TRACKED_PATTERNS,
  containsCrLf,
  isBinaryBuffer,
  checkFiles,
} = require('./check-evidence-line-endings');

function tempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'evidence-line-endings-'));
}

function writeFile(root, relativePath, content, encoding) {
  const file = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, encoding);
  return file;
}

describe('check-evidence-line-endings', () => {
  test('pins and scans every byte-hashed Y1 rendered-renewal text artifact as LF', () => {
    const root = path.resolve(__dirname, '..', '..');
    const renewalPath = 'reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-rendered-renewal.json';
    const renewal = JSON.parse(fs.readFileSync(path.join(root, renewalPath), 'utf8'));
    const byteHashedTextPaths = [
      renewalPath,
      renewal.canonical_process.raw_manifest_path,
      renewal.canonical_process.comparison_path,
      renewal.human_visual_review.review_path,
      renewal.current_visual_review.review_path,
    ];
    const result = spawnSync('git', ['check-attr', 'eol', '--', ...byteHashedTextPaths], {
      cwd: root,
      encoding: 'utf8',
    });
    expect(result.status).toBe(0);
    expect(String(result.stdout || '').trim().split(/\r?\n/))
      .toEqual(byteHashedTextPaths.map((item) => `${item}: eol: lf`));
    for (const item of byteHashedTextPaths) expect(TRACKED_PATTERNS).toContain(item);
  });

  test('detects CRLF in buffers', () => {
    expect(containsCrLf(Buffer.from('a\r\nb\n'))).toBe(true);
    expect(containsCrLf(Buffer.from('a\nb\n'))).toBe(false);
  });

  test('skips binary buffers with NUL bytes', () => {
    expect(isBinaryBuffer(Buffer.from([0x61, 0x00, 0x62]))).toBe(true);
    expect(isBinaryBuffer(Buffer.from('plain text'))).toBe(false);
  });

  test('reports CRLF only for matched text files', () => {
    const root = tempRoot();
    writeFile(root, 'reports/a.md', 'alpha\nbeta\n', 'utf8');
    writeFile(root, 'reports/b.md', 'alpha\r\nbeta\r\n', 'utf8');
    writeFile(root, 'reports/blob.bin', Buffer.from([0x00, 0x01, 0x02]));

    const result = checkFiles(root, ['reports/a.md', 'reports/b.md', 'reports/blob.bin']);

    expect(result.scanned).toBe(2);
    expect(result.skipped).toHaveLength(1);
    expect(result.failures).toEqual(['reports/b.md']);
  });
});
