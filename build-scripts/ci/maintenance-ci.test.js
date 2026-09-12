const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const os = require('os');
const { spawnSync } = require('child_process');
const { classify, packageOnlyCiChanges, exerciseChecksumOnly, plan, jestArgs } = require('./maintenance-ci');
const EXERCISE_SKILL = 'skills/econ-exercise-builder.md';
const BOOK_METADATA = 'references/authored/book-outlines/book-2-outline.meta.json';
const PR242_BASE = 'ce2a88134771ada73d19df370131a217120faa8b';
const PR242_HEAD = 'cb4dfd185b78c8678a5d8668ef44492c5bd05843';
const PR242_PATHS = [
  'build-scripts/templates/template-textbook-paragraph-plan.md',
  'build-scripts/workflows/book2-integration-decision.test.js',
  'build-scripts/workflows/check-book-outline-currentness.test.js',
  'docs/workflows/textbook-paragraph-lane.md', BOOK_METADATA, EXERCISE_SKILL,
  'skills/econ-paragraph-review.md', 'skills/econ-textbook-paragraph.md',
];
function gitAt(root, ...args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trimEnd();
}
const root = path.resolve(__dirname, '../..');
function committed(ref, file) {
  const result = spawnSync('git', ['show', `${ref}:${file}`], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout;
}
const options = { packageOnlyCi: true };
describe('bounded maintenance CI selection', () => {
  test.each([
    ['AGENTS.md'], ['.github/workflows/platform-ci.yml'], ['build-scripts/ci/maintenance-ci.js'],
    ['build-scripts/review-gates/integrate-authorized-pr.js'], ['docs/review/pr-integration-lane-policy.md'],
    ['reports/github-agent-index-platform.json'], ['package.json'],
    ['build-scripts/ci/check-agent-worktree-safety.test.js'],
    ['BUILD-PARAGRAPH.md'], ['BUILD-CHAPTER.md'], ['agents/README.md'],
    ['docs/workflows/textbook-paragraph-lane.md'], ['docs/workflows/part-a-review.md'],
    ['skills/econ-paragraph-review.md'], ['skills/econ-chapter-builder.md'],
    ['skills/econ-textbook-paragraph.md'], ['skills/econ-consolidation-builder.md'],
    ['skills/econ-testprep-builder.md'], ['skills/econ-quality-control.md'],
    [EXERCISE_SKILL], ['build-scripts/templates/template-textbook-paragraph-plan.md'],
    ['build-scripts/workflows/check-book-outline-currentness.test.js'],
    ['build-scripts/workflows/book2-integration-decision.test.js'],
    ['build-scripts/ci/fixtures/branch-protection-activated.json'],
    ['build-scripts/review-gates/check-human-payload-authorization.test.js'],
  ])('maintenance scope: %s', file => expect(classify([file], options)).toBe('maintenance'));
  test.each([
    ['engines/reasoning-composer.js'], ['references/machine/target.json'], ['scripts/deploy.js'],
    ['build-scripts/content/book-1/b1-111-presentation-v2.js'], ['.github/workflows/deploy.yml'],
    ['package-lock.json'], ['.gitattributes'], ['unrecognized.js'],
    ['skills/economic-graph.md'], ['skills/new-skill.md'], ['docs/workflows/new-workflow.md'],
    ['Boek 2 - Markt/2.1/2.1.1-paragraaf.md'], ['scripts/render-textbook.js'],
    ['references/authored/textbook-rendered-page-acceptance-standard.md'],
    ['build-scripts/review-gates/capture-gate-engine1-live-output.js'],
    ['build-scripts/review-gates/emit-gate-task-family1-playable-lab.js'],
    ['build-scripts/review-gates/check-gate-task-family1-review-packet.js'],
    ['build-scripts/review-gates/new-review-tool.js'],
    ['build-scripts/ci/check-y1-product-evidence.js'],
    ['build-scripts/ci/check-y1-product-evidence.test.js'],
    ['build-scripts/ci/new-ci-tool.js'],
    [BOOK_METADATA], ['build-scripts/workflows/check-book-outline-currentness.js'],
    ['build-scripts/workflows/book2-integration-decision.js'], ['build-scripts/workflows/unknown.test.js'],
  ])('product or unknown scope: %s', file => expect(classify(['AGENTS.md', file], options)).toBe('product'));
  test('forced-full, empty and non-CI package changes use product checks', () => {
    expect(classify(['AGENTS.md'], { ...options, forceFull: true })).toBe('product');
    expect(classify([], options)).toBe('product');
    expect(classify(['package.json'], { packageOnlyCi: false })).toBe('product');
  });
  test('main pushes get a smoke check while explicit full validation overrides it', () => {
    expect(classify(['engines/reasoning-composer.js'], { eventName: 'push' })).toBe('smoke');
    expect(classify(['engines/reasoning-composer.js'], { eventName: 'pull_request' })).toBe('product');
    expect(classify(['AGENTS.md'], { eventName: 'push', forceFull: true })).toBe('product');
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
describe('committed exercise-source checksum exception', () => {
  let before, after, oldSkill, newSkill;
  beforeAll(() => {
    before = committed(PR242_BASE, BOOK_METADATA); after = committed(PR242_HEAD, BOOK_METADATA);
    oldSkill = committed(PR242_BASE, EXERCISE_SKILL); newSkill = committed(PR242_HEAD, EXERCISE_SKILL);
  });
  test('accepts the actual #242 checksum refresh and canonical CRLF skill text', () => {
    expect(exerciseChecksumOnly(before, after, oldSkill, newSkill)).toBe(true);
    expect(exerciseChecksumOnly(before, after, oldSkill.replace(/\n/g, '\r\n'), newSkill.replace(/\n/g, '\r\n'))).toBe(true);
  });
  test.each([
    ['hold', meta => { meta.holds[0].status = 'released-without-evidence'; }],
    ['approval', meta => { meta.owner_approval.decided_by = 'someone-else'; }],
    ['target', meta => { meta.target_registry_pins[0].target_status = 'changed'; }],
    ['lifecycle', meta => { meta.status = 'approved'; }],
    ['semantic authority', meta => { meta.semantic_authority.sha256 = '0'.repeat(64); }],
    ['date', meta => { meta.generated_on = '2099-01-01'; }],
    ['source identity', meta => { meta.authority_sources.at(-1).source_kind = 'other'; }],
    ['duplicate source', meta => { meta.authority_sources.push({ ...meta.authority_sources.at(-1) }); }],
    ['wrong hash', meta => { meta.authority_sources.at(-1).sha256 = '0'.repeat(64); }],
  ])('rejects an additional %s change', (_, mutate) => {
    const meta = JSON.parse(after); mutate(meta);
    expect(exerciseChecksumOnly(before, JSON.stringify(meta), oldSkill, newSkill)).toBe(false);
  });
  test('missing, malformed, duplicate-key and unchanged inputs cannot obtain an exception', () => {
    for (const args of [
      [before, after, null, newSkill], [before, after, oldSkill, ''],
      ['{bad', after, oldSkill, newSkill], [before, after.replace('"schema_version": 5', '"schema_version": 1, "schema_version": 5'), oldSkill, newSkill],
      [before, before, oldSkill, oldSkill], [before, after, newSkill, newSkill],
    ]) expect(exerciseChecksumOnly(...args)).toBe(false);
  });
  test('does not hide metadata number changes behind floating-point rounding', () => {
    const withNumber = text => text.replace('"schema_version": 5', '"schema_version": 9007199254740992');
    expect(exerciseChecksumOnly(withNumber(before), withNumber(after).replace('9007199254740992', '9007199254740993'), oldSkill, newSkill)).toBe(false);
  });
  test('rejects pre-existing duplicate keys even when both JSON documents match after pin replacement', () => {
    const duplicate = text => text.replace('"schema_version": 5', '"schema_version": 5, "schema_version": 5');
    expect(exerciseChecksumOnly(duplicate(before), duplicate(after), oldSkill, newSkill)).toBe(false);
    const nested = text => text.replace('"source_kind": "part_a_exercise_contract"', '"source_kind": "part_a_exercise_contract", "source_kind": "part_a_exercise_contract"');
    expect(exerciseChecksumOnly(nested(before), nested(after), oldSkill, newSkill)).toBe(false);
  });
  describe('actual committed footprint and fallback selection', () => {
    let fixture, base, head;
    const write = (file, text) => {
      const full = path.join(fixture, file); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, text);
    };
    const commit = () => {
      gitAt(fixture, 'add', '.'); gitAt(fixture, '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'fixture');
      return gitAt(fixture, 'rev-parse', 'HEAD');
    };
    beforeAll(() => {
      expect(gitAt(root, 'diff', '--name-only', PR242_BASE, PR242_HEAD).split(/\r?\n/)).toEqual(PR242_PATHS);
      fixture = fs.mkdtempSync(path.join(os.tmpdir(), '4veco-instruction-ci-'));
      gitAt(fixture, 'init', '--quiet'); gitAt(fixture, 'config', 'user.email', 'fixture@example.test');
      gitAt(fixture, 'config', 'user.name', 'CI fixture'); gitAt(fixture, 'config', 'core.autocrlf', 'false');
      for (const file of PR242_PATHS) write(file, committed(PR242_BASE, file));
      base = commit();
      for (const file of PR242_PATHS) write(file, committed(PR242_HEAD, file));
      head = commit();
    });
    afterEach(() => {
      // Only the disposable mkdtemp fixture is reset; no developer checkout.
      gitAt(fixture, 'reset', '--hard', head); gitAt(fixture, 'clean', '-fd');
    });
    afterAll(() => fs.rmSync(fixture, { recursive: true, force: true }));
    test('#242 selects maintenance, preserves consumers and ignores dirty working copies', () => {
      write(BOOK_METADATA, '{uncommitted');
      const result = plan(base, head, {}, fixture);
      expect(result.profile).toBe('maintenance');
      expect(result.paths).toEqual(PR242_PATHS);
      expect(result.reasons.join(' ')).toContain('checksum-only refresh verified');
      expect(result.focused_jest_args).toEqual(expect.arrayContaining([
        'build-scripts/workflows/check-book-outline-currentness.test.js',
        'build-scripts/workflows/book2-integration-decision.test.js',
        'build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js',
        'build-scripts/workflows/paragraph-records.test.js', 'scripts/tests/part-a-review-evidence.test.js',
      ]));
      expect(plan(base, head, { forceFull: true }, fixture).profile).toBe('product');
    });
    test('selection works before npm ci with all external modules unavailable', () => {
      const script = `
        const Module = require('module'), path = require('path');
        const load = Module._load;
        Module._load = function(id, ...args) {
          if (!Module.isBuiltin(id) && !id.startsWith('.') && !path.isAbsolute(id)) throw new Error('External modules unavailable: ' + id);
          return load.call(this, id, ...args);
        };
        const result = require(process.argv[1]).plan(process.argv[2], process.argv[3], {}, process.argv[4]);
        console.log(JSON.stringify(result));
      `;
      const result = spawnSync(process.execPath, ['-e', script, path.join(root, 'build-scripts/ci/maintenance-ci.js'), base, head, fixture], { encoding: 'utf8' });
      expect(result.status).toBe(0);
      expect(JSON.parse(result.stdout).profile).toBe('maintenance');
    });
    test.each(['build-scripts/textbook/paragraph_pdf.py', 'engines/reasoning-composer.js', 'package-lock.json', 'unknown.md'])(
      'mixed %s still requires full product validation', file => {
        write(file, 'changed input'); const candidate = commit();
        const result = plan(base, candidate, {}, fixture);
        expect(result.profile).toBe('product');
        expect(result.reasons).toContain(`Full validation required by: ${file}`);
      });
    test.each(['hold', 'wrong hash', 'missing skill', 'metadata only'])('%s cannot be opted into maintenance', change => {
      if (change === 'missing skill') fs.unlinkSync(path.join(fixture, EXERCISE_SKILL));
      else if (change === 'metadata only') write(EXERCISE_SKILL, oldSkill);
      else {
        const meta = JSON.parse(after);
        if (change === 'hold') meta.holds[0].status = 'forged';
        else meta.authority_sources.at(-1).sha256 = '0'.repeat(64);
        write(BOOK_METADATA, JSON.stringify(meta));
      }
      const candidate = commit();
      const result = plan(base, candidate, { exerciseChecksumOnly: true }, fixture);
      expect(result.profile).toBe('product');
      expect(result.reasons.join(' ')).toContain('did not satisfy');
    });
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
    ['AGENTS.md', 'build-scripts/workflows/check-paragraph-workflow-wording.test.js'],
    ['agents/lead-reviewer-agent.md', 'build-scripts/workflows/check-paragraph-workflow-wording.test.js'],
    ['BUILD-PARAGRAPH.md', 'scripts/tests/validate-paragraph-modes.test.js'],
    ['skills/econ-chapter-builder.md', 'scripts/tests/validate-chapter.test.js'],
    ['docs/workflows/textbook-paragraph-lane.md', 'build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js'],
    [EXERCISE_SKILL, 'build-scripts/workflows/check-book-outline-currentness.test.js'],
    [BOOK_METADATA, 'build-scripts/workflows/book2-integration-decision.test.js'],
    ['build-scripts/templates/template-textbook-paragraph-plan.md', 'build-scripts/workflows/paragraph-records.test.js'],
  ])('%s executes its file-based consumer suite', (file, expected) => {
    const tests = list([file]);
    expect(tests).toContain(expected);
    expect(tests.some(test => /check-y1-golden-rollout-wave-1(-current)?\.test\.js$/.test(test))).toBe(false);
  }, 30000);
  test('#242 actual Jest selection contains every required consumer and excludes presentation suites', () => {
    const tests = list(PR242_PATHS);
    for (const consumer of [
      'build-scripts/workflows/check-book-outline-currentness.test.js',
      'build-scripts/workflows/book2-integration-decision.test.js',
      'build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js',
      'build-scripts/workflows/paragraph-records.test.js',
      'build-scripts/workflows/check-paragraph-workflow-wording.test.js',
      'build-scripts/workflows/check-part-a-pdf-readiness.test.js',
      'scripts/tests/validate-paragraph-modes.test.js', 'scripts/tests/validate-chapter.test.js',
      'scripts/tests/part-a-review-evidence.test.js', 'build-scripts/ci/paired-paragraph-ci.test.js',
    ]) expect(tests).toContain(consumer);
    expect(tests.some(file => /presentation|check-y1-golden-rollout/.test(file))).toBe(false);
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
  test('index freshness is advisory; full validation uses two workers and names archived workflow tests', () => {
    expect(steps.find(s => s.name === 'Check GitHub agent indexes against repository heads')['continue-on-error']).toBe(true);
    expect(steps.find(s => s.name === 'Validate platform Jest suite').run).toContain('npm run check:platform');
    const config = require('../../jest.config.cjs');
    expect(config.maxWorkers).toBe(2);
    expect(config.testPathIgnorePatterns).toContain('check-y1-golden-rollout-wave-1(-current)?\\.test\\.js$');
    expect(steps.find(s => s.name === 'Validate platform Jest suite').run).toContain('--outputFile ../ci-artifacts/jest-results.json');
    expect(steps.find(s => s.name === 'Validate Y1 Golden rollout wave').run).toContain('check:y1-golden-rollout-wave-1-product');
  });
});
