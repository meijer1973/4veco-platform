const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const checker = path.resolve(__dirname, 'check-scope-language.js');

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'scope-language-'));
}

function writeFixture(root, relativePath, content) {
  const file = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  return file;
}

function runChecker(args) {
  return spawnSync(process.execPath, [checker, ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
}

describe('check-scope-language', () => {
  test('fails when a sprint plan title contains MVP without authorization', () => {
    const root = tempDir();
    const file = writeFixture(
      root,
      'reports/sprints/TEST-1-plan.md',
      '# Sprint TEST-1: Exit Ticket MVP\n\n## Goal\nBuild the thing.\n'
    );

    const result = runChecker([file]);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('MVP');
    expect(result.stderr).toContain('Scope Language Authorization');
  });

  test('fails when a roadmap row introduces pilot without authorization', () => {
    const root = tempDir();
    const file = writeFixture(
      root,
      'roadmap.md',
      '| Sprint | Name | Completed | Current State |\n|--------|------|-----------|---------------|\n| T1 | Pilot Row | no | Build it. |\n'
    );

    const result = runChecker([file]);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('Pilot');
  });

  test('passes when an archived historical file contains MVP', () => {
    const root = tempDir();
    const file = writeFixture(root, 'archive/sprints/OLD/OLD-plan.md', '# Sprint OLD: MVP Record\n');

    const result = runChecker(['--root', root, file]);

    expect(result.status).toBe(0);
  });

  test('passes when active text contains an authorized term with required fields', () => {
    const root = tempDir();
    const file = writeFixture(
      root,
      'active-plan.md',
      [
        '# Sprint TEST-2: Authorized wording',
        '',
        '## Scope Language Authorization',
        '',
        '- Authorized term: pilot',
        '- Authorizing source: Human decision 2026-05-26',
        '- Reason the term is necessary: traceability to source wording only.',
        '- Quality floor: all scoped requirements must still pass review.',
        '- Missing full-spec requirements / follow-up: none.',
        '',
        'This paragraph uses pilot only because the authorizing source does.',
      ].join('\n')
    );

    const result = runChecker([file]);

    expect(result.status).toBe(0);
  });

  test('fails when authorization omits the quality-floor statement', () => {
    const root = tempDir();
    const file = writeFixture(
      root,
      'active-plan.md',
      [
        '# Sprint TEST-3: Authorized wording',
        '',
        '## Scope Language Authorization',
        '',
        '- Authorized term: prototype',
        '- Authorizing source: Human decision 2026-05-26',
        '- Reason the term is necessary: traceability to source wording only.',
        '- Missing full-spec requirements / follow-up: none.',
        '',
        'This paragraph uses prototype only because the authorizing source does.',
      ].join('\n')
    );

    const result = runChecker([file]);

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('Quality floor:');
  });
});
