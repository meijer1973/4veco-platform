const fs = require('fs');
const os = require('os');
const path = require('path');

const {
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
