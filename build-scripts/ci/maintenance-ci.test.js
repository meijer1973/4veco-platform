const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { classify, packageOnlyCiChanges, plan } = require('./maintenance-ci');
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
