'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const { exactCheckout, paragraphDirectory } = require('./paired-paragraph-ci');
const bind = require('../../scripts/tests/helpers/part-a-review-fixture');
const yaml = require('js-yaml');
let root;
test('workflow supplies exact commits as environment data and never runs lesson scripts', () => {
  const workflow = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../.github/workflows/paired-paragraph-ci.yml'), 'utf8'));
  expect(workflow.permissions).toEqual({ contents: 'read' });
  const steps = workflow.jobs['validate-paired-paragraph'].steps;
  const checkouts = steps.filter(step => step.uses === 'actions/checkout@v6');
  expect(checkouts[0].with.ref).toBe('${{ github.sha }}');
  expect(checkouts[1].with.ref).toBe('${{ inputs.lesson_sha }}');
  expect(checkouts.every(step => step.with['persist-credentials'] === false)).toBe(true);
  const commands = steps.filter(step => step.run);
  expect(commands).toHaveLength(1);
  expect(commands[0].run).toBe('node build-scripts/ci/paired-paragraph-ci.js');
  expect(commands[0].env.LESSON_SHA).toBe('${{ inputs.lesson_sha }}');
  expect(commands[0].env.PLATFORM_SHA).toBe('${{ github.sha }}');
  expect(commands[0].run).not.toContain('${{');
});
function git(...args) { return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim(); }
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'paired-paragraph-'));
  git('init', '-q'); git('config', 'user.name', 'Test'); git('config', 'user.email', 'test@example.invalid');
  fs.mkdirSync(path.join(root, '2.1.1 Test'));
  fs.writeFileSync(path.join(root, '2.1.1 Test', 'input.md'), 'test');
  git('add', '.'); git('commit', '-qm', 'fixture');
});
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));
test('actual exact commit required; branch names and different SHAs rejected', () => {
  expect(() => exactCheckout(root, git('rev-parse', 'HEAD'))).not.toThrow();
  expect(() => exactCheckout(root, 'main')).toThrow(/40-character/);
  expect(() => exactCheckout(root, 'a'.repeat(40))).toThrow(/does not match/);
});
test('dirty tracked, staged and untracked evidence rejected', () => {
  const sha = git('rev-parse', 'HEAD');
  fs.appendFileSync(path.join(root, '2.1.1 Test', 'input.md'), 'changed');
  expect(() => exactCheckout(root, sha)).toThrow(/uncommitted/);
  git('add', '.'); expect(() => exactCheckout(root, sha)).toThrow(/uncommitted/);
  git('commit', '-qm', 'changed'); fs.writeFileSync(path.join(root, 'new.md'), 'new');
  expect(() => exactCheckout(root, git('rev-parse', 'HEAD'))).toThrow(/uncommitted/);
});
test('only repository-relative paragraph directories accepted', () => {
  expect(paragraphDirectory(root, '2.1.1 Test')).toBe(path.join(root, '2.1.1 Test'));
  for (const unsafe of ['../2.1.1 Test', '/2.1.1 Test', 'a/../2.1.1 Test', '.git', 'a\\2.1.1 Test']) {
    expect(() => paragraphDirectory(root, unsafe)).toThrow();
  }
});
test('complete paired command checks committed paragraph evidence and rejects a stale reviewed payload', () => {
  const platform = fs.mkdtempSync(path.join(os.tmpdir(), 'paired-platform-'));
  const platformGit = (...args) => execFileSync('git', ['-C', platform, ...args], { encoding: 'utf8' }).trim();
  try {
    for (const file of ['scripts/validate-paragraph.js', 'scripts/lib/paragraph-types.js', 'scripts/lib/part-a-review-evidence.js', 'build-scripts/ci/paired-paragraph-ci.js', 'build-scripts/workflows/check-paragraph-lane-scope.js']) {
      fs.mkdirSync(path.dirname(path.join(platform, file)), { recursive: true });
      fs.copyFileSync(path.resolve(__dirname, '../..', file), path.join(platform, file));
    }
    platformGit('init', '-q'); platformGit('config', 'user.name', 'Test'); platformGit('config', 'user.email', 'test@example.invalid');
    platformGit('add', '.'); platformGit('commit', '-qm', 'validator fixture');
    const base = git('rev-parse', 'HEAD'), folder = path.join(root, '2.1.1 Test');
    for (const suffix of ['paragraaf', 'opgaven', 'antwoorden']) {
      fs.writeFileSync(path.join(folder, `2.1.1 Test – ${suffix}.md`), '# Test\n');
      fs.writeFileSync(path.join(folder, `2.1.1 Test – ${suffix}.html`), '<html><body>Test</body></html>');
      fs.writeFileSync(path.join(folder, `2.1.1 Test – ${suffix}.pdf`), Buffer.alloc(15000));
    }
    fs.mkdirSync(path.join(folder, '_assets'));
    fs.writeFileSync(path.join(folder, 'build_pdf.py'), '# fixture\n');
    fs.writeFileSync(path.join(folder, '2.1.1-review.md'), '## 2. Verdict\nPASS\n');
    fs.writeFileSync(path.join(folder, '2.1.1-quality-ref.yaml'), 'schema_version: 2\npartA:\n  assets:\n    missing: []\n');
    bind(folder); git('add', '.'); git('commit', '-qm', 'reviewed textbook');
    const options = { LESSON_ROOT: root, PLATFORM_SHA: platformGit('rev-parse', 'HEAD'), LESSON_SHA: git('rev-parse', 'HEAD'), LESSON_BASE_SHA: base, PARAGRAPH_PATH: '2.1.1 Test' };
    const execute = env => {
      const result = spawnSync(process.execPath, [path.join(platform, 'build-scripts/ci/paired-paragraph-ci.js')], { cwd: platform, env: { ...process.env, ...env, PARAGRAPH_CI_OUTPUT: '' }, encoding: 'utf8' });
      if (!result.stdout.trim()) throw new Error(result.stderr);
      return { ...JSON.parse(result.stdout), process_exit: result.status };
    };
    const report = execute(options);
    expect(report.process_exit).toBe(0);
    expect(report.validation_exit_code).toBe(0);
    expect(report.decision).toBe('PASS');
    expect(report.lesson_sha).toBe(options.LESSON_SHA);
    fs.appendFileSync(path.join(folder, '2.1.1 Test – paragraaf.md'), 'changed');
    git('add', '.'); git('commit', '-qm', 'unreviewed content');
    const stale = execute({ ...options, LESSON_SHA: git('rev-parse', 'HEAD') });
    expect(stale.process_exit).toBe(1);
    expect(stale.decision).toBe('FAIL');
    expect(stale.review.errors.join(' ')).toMatch(/stale/);
  } finally { fs.rmSync(platform, { recursive: true, force: true }); }
});
