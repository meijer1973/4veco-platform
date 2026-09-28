'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '../..');
const files = [
  'build-scripts/books/exercise-route-revision-pin.json',
  'build-scripts/books/book2-signed-revision-pin.json',
  'build-scripts/books/books34-signed-revision-pin.json',
  'references/data/procedure-visual/procedure-templates.json'
];
const git = (cwd, args) => execFileSync('git', args, { cwd, maxBuffer: 4 * 1024 * 1024 });

// Reproduce a stat-clean Windows checkout: changing autocrlf and forcing
// checkout-index afterwards does not reliably replace existing CRLF bytes.
// The initial checkout itself must preserve the sealed evidence.
test.each([false, true])('historical evidence survives Windows checkout with byte rules=%s', protectedBytes => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'b34-historical-checkout-'));
  try {
    git(fixture, ['init', '--quiet']);
    git(fixture, ['config', 'core.autocrlf', 'true']);
    let attributes = fs.readFileSync(path.join(root, '.gitattributes'), 'utf8');
    if (!protectedBytes) attributes = attributes.split('\n').filter(line =>
      !files.some(file => line.startsWith(file + ' '))).join('\n');
    fs.writeFileSync(path.join(fixture, '.gitattributes'), attributes);
    const expected = new Map();
    for (const file of files) {
      const bytes = git(root, ['show', 'HEAD:' + file]);
      expected.set(file, bytes);
      fs.mkdirSync(path.dirname(path.join(fixture, file)), { recursive: true });
      fs.writeFileSync(path.join(fixture, file), bytes);
    }
    git(fixture, ['-c', 'core.autocrlf=false', 'add', '.']);
    git(fixture, ['-c', 'user.name=Checkout test', '-c', 'user.email=test@example.invalid',
      'commit', '--quiet', '-m', 'sealed evidence fixture']);
    for (const file of files) fs.unlinkSync(path.join(fixture, file));
    git(fixture, ['checkout-index', '-f', '-u', '--all']);
    const aged = new Date(Date.now() - 10000);
    for (const file of files) fs.utimesSync(path.join(fixture, file), aged, aged);
    git(fixture, ['update-index', '--refresh']);
    git(fixture, ['-c', 'core.autocrlf=false', 'reset', '--hard']);
    git(fixture, ['-c', 'core.autocrlf=false', 'checkout-index', '-f', '--all']);
    for (const [file, bytes] of expected) {
      const actual = fs.readFileSync(path.join(fixture, file));
      expect(actual.equals(bytes)).toBe(protectedBytes);
      // The negative case demonstrates line-ending conversion only.
      expect(actual.toString().replace(/\r\n/g, '\n')).toBe(bytes.toString());
    }
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});
