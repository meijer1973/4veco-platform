const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const os = require('os');
const { spawnSync } = require('child_process');
const { classify, packageOnlyCiChanges, plan, jestArgs } = require('./maintenance-ci');
const options = { active: true, packageOnlyCi: true };
describe('bounded maintenance CI selection', () => {
  test.each([
    ['AGENTS.md'], ['.github/workflows/platform-ci.yml'], ['build-scripts/ci/maintenance-ci.js'],
    ['build-scripts/review-gates/integrate-authorized-pr.js'], ['docs/review/pr-integration-lane-policy.md'],
    ['reports/github-agent-index-platform.json'], ['package.json'],
  ])('maintenance scope: %s', file => expect(classify([file], options)).toBe('maintenance'));
  test.each([
    ['engines/reasoning-composer.js'], ['references/machine/target.json'], ['scripts/deploy.js'],
    ['build-scripts/content/book-1/b1-111-presentation-v2.js'], ['.github/workflows/deploy.yml'],
    ['package-lock.json'], ['.gitattributes'], ['unrecognized.js'], ['BUILD-PARAGRAPH.md'],
  ])('product or unknown scope: %s', file => expect(classify(['AGENTS.md', file], options)).toBe('product'));
  test('disabled, forced-full, empty and non-CI package changes use product checks', () => {
    expect(classify(['AGENTS.md'], { active: false })).toBe('product');
    expect(classify(['AGENTS.md'], { ...options, forceFull: true })).toBe('product');
    expect(classify([], options)).toBe('product');
    expect(classify(['package.json'], { active: true, packageOnlyCi: false })).toBe('product');
  });
  test('deleted or renamed product paths cannot disappear from mixed scope', () => {
    expect(classify(['engines/removed.js', 'build-scripts/ci/moved.js'], options)).toBe('product');
  });
  test('package scope allows CI scripts but rejects deployment and dependency changes', () => {
    const original = { scripts: { test: 'jest', 'deploy:m3': 'deploy' }, devDependencies: { jest: '30.3.0' } };
    const before = JSON.stringify(original);
    expect(packageOnlyCiChanges(before, JSON.stringify({ ...original, scripts: { ...original.scripts, 'ci:maintenance': 'node ci.js' } }))).toBe(true);
    expect(packageOnlyCiChanges(before, JSON.stringify({ ...original, scripts: { ...original.scripts, 'deploy:m3': 'different' } }))).toBe(false);
    expect(packageOnlyCiChanges(before, JSON.stringify({ ...original, devDependencies: { jest: 'different' } }))).toBe(false);
    expect(() => packageOnlyCiChanges(before, '{bad')).toThrow();
  });
  test('missing, zero, abbreviated and unexpected head coordinates fail instead of choosing lean checks', () => {
    for (const refs of [[undefined, undefined], ['main', 'HEAD'], ['0'.repeat(40), 'a'.repeat(40)], ['a'.repeat(40), 'b'.repeat(40)]]) {
      expect(() => plan(...refs)).toThrow();
    }
  });
});
describe('affected tests survive missing import edges and file-based inputs', () => {
  const root = path.resolve(__dirname, '../..');
  const jest = require.resolve('jest/bin/jest');
  function list(paths) {
    const result = spawnSync(process.execPath, [jest, ...jestArgs(paths), '--listTests', '--json'], { cwd: root, encoding: 'utf8' });
    if (result.status !== 0) throw new Error(result.stderr);
    return JSON.parse(result.stdout).map(file => path.relative(root, file).replace(/\\/g, '/'));
  }
  test('deleting a helper still executes and fails its surviving importer', () => {
    const fixture = fs.mkdtempSync(path.join(os.tmpdir(), '4veco-deleted-ci-helper-'));
    try {
      fs.writeFileSync(path.join(fixture, 'helper.js'), 'module.exports = 42;');
      fs.writeFileSync(path.join(fixture, 'surviving.test.js'), "const value = require('./helper'); test('surviving importer', () => expect(value).toBe(42));");
      const invoke = paths => spawnSync(process.execPath, [jest, ...jestArgs(paths, fixture),
        '--config', JSON.stringify({ rootDir: fixture, testEnvironment: 'node' })], { cwd: fixture, encoding: 'utf8' });
      expect(invoke(['helper.js']).status).toBe(0);
      fs.unlinkSync(path.join(fixture, 'helper.js'));
      const result = invoke(['helper.js']);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('surviving.test.js');
      expect(result.stderr).toContain("Cannot find module './helper'");
    } finally { fs.rmSync(fixture, { recursive: true, force: true }); }
  }, 30000);
  test.each([
    ['.github/workflows/authorized-pr-integration.yml', 'build-scripts/review-gates/authorized-pr-integration-workflow.test.js'],
    ['.github/workflows/authorized-bundle-integration.yml', 'build-scripts/review-gates/cross-repo-bundle-workflow.test.js'],
    ['.github/workflows/platform-ci.yml', 'build-scripts/ci/platform-ci-evidence.test.js'],
    ['docs/review/pr-readiness-decision.schema.json', 'build-scripts/review-gates/pr-readiness-router.test.js'],
    ['build-scripts/ci/fixtures/branch-protection-activated.json', 'build-scripts/ci/check-branch-protection.test.js'],
  ])('%s executes its file-based consumer suite', (file, expected) => {
    const tests = list([file]);
    expect(tests).toContain(expected);
    expect(tests.some(test => /check-y1-golden-rollout-wave-1(-current)?\.test\.js$/.test(test))).toBe(false);
  }, 30000);
});
describe('required workflow reports and runs the selected checks', () => {
  const workflow = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../.github/workflows/platform-ci.yml'), 'utf8'));
  const job = workflow.jobs['validate-platform'];
  const steps = job.steps;
  test('required job is unconditional; selection and focused checks can fail it', () => {
    expect(job.name).toBe('validate-platform');
    expect(job.if).toBeUndefined();
    const selected = steps.find(s => s.id === 'ci-scope');
    expect(selected.run).toContain('maintenance-ci.js plan');
    expect(selected['continue-on-error']).toBeUndefined();
    const focused = steps.find(s => s.name === 'Run focused maintenance checks');
    expect(focused.if).toBe("steps.ci-scope.outputs.maintenance == 'true'");
    expect(focused['continue-on-error']).toBeUndefined();
  });
  test.each(['Install presentation proof tools', 'Validate platform Jest suite', 'Build presentation-v2 registered decks',
    'Validate presentation-v2 HTML QA', 'Validate presentation-v2 PPTX proof', 'Validate Y1 Golden rollout wave'])('%s is product-only', name => {
    expect(steps.find(s => s.name === name).if).toBe("steps.ci-scope.outputs.maintenance != 'true'");
  });
  test('index freshness is advisory and the full suite names suspended historical tests', () => {
    expect(steps.find(s => s.name === 'Check GitHub agent indexes against repository heads')['continue-on-error']).toBe(true);
    expect(steps.find(s => s.name === 'Validate platform Jest suite').run).toContain('testPathIgnorePatterns');
    expect(steps.find(s => s.name === 'Validate Y1 Golden rollout wave').run).toContain('check:y1-golden-rollout-wave-1-product');
  });
});
