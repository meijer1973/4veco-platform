const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const verifier = require('./check-y1-golden-rollout-wave-1-current');
const historical = require('./check-y1-golden-rollout-wave-1');
const writer = require('./write-y1-golden-rollout-wave-1-current-evidence');

jest.setTimeout(120000);
const root = verifier.ROOT;
const lessonRoot = verifier.LESSON_ROOT;
const MERGED_LESSON = '57b31a1f4a3d2aa0da3945abbc5a7a0ee5d05e6a';
const clone = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function git(args, cwd = root, input, env = {}) {
  const result = spawnSync('git', args, { cwd, input, encoding: 'utf8', env: { ...process.env, ...env } });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  return result.stdout.trim();
}

// Git objects only: no checkout or branch changes in either owned worktree.
function synthetic(parent, files, cwd = root) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'y1-current-test-'));
  const env = {
    GIT_INDEX_FILE: path.join(temp, 'index'),
    GIT_AUTHOR_NAME: 'Y1 current verifier test', GIT_AUTHOR_EMAIL: 'test@example.com',
    GIT_COMMITTER_NAME: 'Y1 current verifier test', GIT_COMMITTER_EMAIL: 'test@example.com',
  };
  try {
    git(['read-tree', parent], cwd, undefined, env);
    for (const [file, content] of Object.entries(files)) {
      if (content === null) git(['update-index', '--force-remove', '--', file], cwd, undefined, env);
      else {
        const oid = git(['hash-object', '-w', '--stdin'], cwd, content, env);
        git(['update-index', '--add', '--cacheinfo', '100644', oid, file], cwd, undefined, env);
      }
    }
    const tree = git(['write-tree'], cwd, undefined, env);
    return git(['commit-tree', tree, '-p', parent], cwd, 'current verifier test\n', env);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}

describe('historical renewal reused only for unchanged current lesson descendants', () => {
  test('validates the real merged AGENTS-only descendant and retains both refs', () => {
    const result = verifier.validateLesson(MERGED_LESSON);
    expect(result.historical_lesson_snapshot_sha).toBe(verifier.SNAPSHOT);
    expect(result.current_lesson_sha).toBe(MERGED_LESSON);
    expect(result.rendered_input_count).toBe(78);
    expect(result.route_target_count).toBe(55);
    expect(result.rendered_inputs.every((item) => item.status === 'equal')).toBe(true);
  });

  test('allows a later docs-only descendant without renewing historical evidence', () => {
    const head = synthetic(MERGED_LESSON, { 'docs/y1-unrelated-test.md': 'unrelated\n' }, lessonRoot);
    expect(verifier.validateLesson(head).current_lesson_sha).toBe(head);
  });

  test('rejects a non-descendant with identical rendering blobs', () => {
    expect(() => verifier.validateLesson(`${verifier.SNAPSHOT}^`)).toThrow(/must descend/);
  });

  test('rejects changed captured content and newly referenced assets', () => {
    const proof = JSON.parse(read(historical.PATHS.scaleProof));
    const page = historical.lessonCapturePaths(proof)[0];
    const previous = historical.gitShow(MERGED_LESSON, page, lessonRoot);
    const head = synthetic(MERGED_LESSON, { [page]: `${previous}\n<img src="new-unreviewed.svg">` }, lessonRoot);
    expect(() => verifier.validateLesson(head)).toThrow(/rendered inputs changed or missing/);
  });

  test('rejects a missing captured page', () => {
    const page = historical.lessonCapturePaths(JSON.parse(read(historical.PATHS.scaleProof)))[0];
    const head = synthetic(MERGED_LESSON, { [page]: null }, lessonRoot);
    expect(() => verifier.validateLesson(head)).toThrow(/capture page missing/);
  });

  test('rejects drift in a loaded rendering asset', () => {
    const dependencies = historical.deriveLessonDependencies(JSON.parse(read(historical.PATHS.scaleProof)), verifier.SNAPSHOT, MERGED_LESSON);
    const asset = dependencies.equal_paths.find((file) => /\.(css|js)$/.test(file));
    expect(asset).toBeDefined();
    const head = synthetic(MERGED_LESSON, { [asset]: 'changed\n' }, lessonRoot);
    expect(() => verifier.validateLesson(head)).toThrow(/rendered inputs changed or missing/);
  });

  test('rejects missing routes while allowing changed existence-only destination content', () => {
    const dependencies = historical.deriveLessonDependencies(JSON.parse(read(historical.PATHS.scaleProof)), verifier.SNAPSHOT, MERGED_LESSON);
    const route = dependencies.existence_only_paths[0];
    const missing = synthetic(MERGED_LESSON, { [route]: null }, lessonRoot);
    expect(() => verifier.validateLesson(missing)).toThrow(/route destination missing/);
    const changed = synthetic(MERGED_LESSON, { [route]: 'existence-only content\n' }, lessonRoot);
    expect(verifier.validateLesson(changed).route_destinations_present).toBe(true);
  });
});

describe('active Y1 workflow wiring', () => {
  const packageText = () => read('package.json');
  const workflow = () => read('.github/workflows/platform-ci.yml');

  test('accepts exact active wiring and unrelated package/workflow additions', () => {
    expect(() => verifier.validateWiring(packageText(), workflow())).not.toThrow();
    const pkg = JSON.parse(packageText());
    pkg.scripts['unrelated:check'] = 'node other.js';
    const withStep = workflow().replace('      - name: Validate report JSON', '      - name: Unrelated step\n        run: echo unrelated\n\n      - name: Validate report JSON');
    expect(() => verifier.validateWiring(JSON.stringify(pkg), withStep)).not.toThrow();
  });

  test('rejects mapping changes', () => {
    const pkg = JSON.parse(packageText());
    pkg.scripts['check:y1-golden-rollout-wave-1-current'] = 'node bypass.js';
    expect(() => verifier.validateWiring(JSON.stringify(pkg), workflow())).toThrow(/npm mapping changed/);
  });

  test.each([
    ['historical-only command', (text) => text.replace('npm run check:y1-golden-rollout-wave-1-current --', 'npm run check:y1-golden-rollout-wave-1 --')],
    ['comment-only command', (text) => text.replace('          npm run check:y1', '          # npm run check:y1')],
    ['missing step', (text) => text.replace('      - name: Validate Y1 Golden rollout wave', '      - name: Other')],
    ['duplicate command', (text) => text.replace('      - name: Validate report JSON', '      - name: Extra Y1\n        run: npm run check:y1-golden-rollout-wave-1-current --\n\n      - name: Validate report JSON')],
    ['skip condition', (text) => text.replace('      - name: Validate Y1 Golden rollout wave', '      - name: Validate Y1 Golden rollout wave\n        if: false')],
    ['ignored error', (text) => text.replace('      - name: Validate Y1 Golden rollout wave', '      - name: Validate Y1 Golden rollout wave\n        continue-on-error: true')],
    ['scope-only flag', (text) => text.replace('--scope-mode auto', '--scope-only --scope-mode auto')],
    ['historical lesson substitution', (text) => text.replace('--lesson-head HEAD', `--lesson-head ${verifier.SNAPSHOT}`)],
    ['platform event substitution', (text) => text.replace('--head $head', '--head HEAD')],
    ['job condition', (text) => text.replace('    name: validate-platform', '    if: false\n    name: validate-platform')],
    ['late job condition', (text) => `${text}\n    if: false\n`],
    ['late ignored job errors', (text) => `${text}\n    continue-on-error: true\n`],
    ['workflow permission escalation', (text) => text.replace('  contents: read', '  contents: write')],
    ['lesson checkout substitution', (text) => text.replace('          path: 4veco-lessen', '          ref: stale\n          path: 4veco-lessen')],
    ['partial runtime normalization', (text) => text.replace('checkout-index -f --all', 'checkout-index -f -- reports/url-index.md')],
    ['skipped runtime normalization', (text) => text.replace('      - name: Normalize repository line endings', '      - name: Normalize repository line endings\n        if: false')],
    ['late runtime normalization', (text) => {
      const block = text.match(/      - name: Normalize repository line endings[\s\S]*?(?=      - name:)/)[0];
      return text.replace(block, '').replace('      - name: Validate report JSON', `${block}      - name: Validate report JSON`);
    }],
    ['runtime normalization before checkout', (text) => {
      const block = text.match(/      - name: Normalize repository line endings[\s\S]*?(?=      - name:)/)[0];
      return text.replace(block, '').replace('      - name: Checkout platform repository', `${block}      - name: Checkout platform repository`);
    }],
    ['duplicate job', (text) => `${text}\n  validate-platform:\n    steps: []\n`],
    ['quoted duplicate job', (text) => `${text}\n  "validate-platform":\n    steps: []\n`],
    ['unresolved YAML alias', (text) => text.replace('jobs:', 'jobs:\n  <<: *other')],
  ])('rejects %s', (_label, mutate) => {
    expect(() => verifier.validateWiring(packageText(), mutate(workflow()))).toThrow();
  });

  test('allows unrelated step ampersands, aliases, and unrelated dependency changes', () => {
    const expanded = workflow().replace('      - name: Validate report JSON',
      '      - &unrelated\n        name: Unrelated URL\n        run: echo https://example.test/?a=1&b=2\n      - *unrelated\n\n      - name: Validate report JSON');
    const pkg = JSON.parse(packageText());
    pkg.devDependencies.unrelated = '1.0.0';
    const lock = JSON.parse(read('package-lock.json'));
    lock.packages[''].devDependencies.unrelated = '1.0.0';
    lock.packages['node_modules/unrelated'] = { version: '1.0.0' };
    expect(() => verifier.validateWiring(JSON.stringify(pkg), expanded, JSON.stringify(lock))).not.toThrow();
  });

  test.each(['version', 'resolved', 'integrity'])('rejects parser lock %s drift', (field) => {
    const lock = JSON.parse(read('package-lock.json'));
    lock.packages['node_modules/js-yaml'][field] = 'changed';
    expect(() => verifier.validateWiring(packageText(), workflow(), JSON.stringify(lock))).toThrow(/parser lock binding changed/);
  });

  test('rejects parser declaration drift and duplicate protected steps', () => {
    const pkg = JSON.parse(packageText());
    pkg.devDependencies['js-yaml'] = '^3.14.2';
    expect(() => verifier.validateWiring(JSON.stringify(pkg), workflow())).toThrow(/parser dependency pin/);
    const duplicate = workflow().replace('      - name: Validate report JSON',
      '      - name: Checkout lessen repository\n        run: echo duplicate\n\n      - name: Validate report JSON');
    expect(() => verifier.validateWiring(packageText(), duplicate)).toThrow(/step missing or duplicated/);
  });
});

describe('runtime checkout byte integrity', () => {
  test('forced LF checkout restores text and preserves committed binary bytes', () => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'y1-runtime-checkout-'));
    const text = Buffer.from('first\nsecond\n');
    const binary = Buffer.from([0, 10, 13, 10, 255, 1]);
    try {
      git(['init', '--quiet'], temp);
      git(['config', 'core.autocrlf', 'true'], temp);
      fs.writeFileSync(path.join(temp, 'source.js'), text);
      fs.writeFileSync(path.join(temp, 'capture.png'), binary);
      git(['-c', 'core.autocrlf=false', 'add', '.'], temp);
      git(['-c', 'user.name=Y1 test', '-c', 'user.email=test@example.com', 'commit', '--quiet', '-m', 'fixture'], temp);
      fs.unlinkSync(path.join(temp, 'source.js'));
      fs.unlinkSync(path.join(temp, 'capture.png'));
      git(['checkout-index', '-f', '--all'], temp);
      expect(fs.readFileSync(path.join(temp, 'source.js'), 'utf8')).toBe('first\r\nsecond\r\n');
      // Execute the committed workflow's explicit normalization command. No
      // global configuration or owned worktree files are changed by this test.
      const command = verifier.workflowContract(read('.github/workflows/platform-ci.yml'))
        .runtime_normalization.run.split('\n').find((line) => line.includes('checkout-index'));
      git(command.trim().split(/\s+/).slice(1), temp);
      expect(fs.readFileSync(path.join(temp, 'source.js'))).toEqual(text);
      expect(fs.readFileSync(path.join(temp, 'capture.png'))).toEqual(binary);
    } finally { fs.rmSync(temp, { recursive: true, force: true }); }
  });

  test.each(['content', 'CRLF'])('rejects %s runtime drift with diagnostic hashes', (kind) => {
    const head = git(['rev-parse', 'HEAD']);
    const file = verifier.SOURCE_PATHS[0];
    const original = fs.readFileSync;
    const committed = historical.gitShow(head, file, root);
    const replacement = Buffer.from(kind === 'CRLF' ? committed.replace(/\n/g, '\r\n') : 'changed\n');
    const spy = jest.spyOn(fs, 'readFileSync').mockImplementation((target, ...args) =>
      target === path.join(root, file) ? replacement : original(target, ...args));
    try {
      expect(() => verifier.verifyRuntimeCheckout({}, head)).toThrow(new RegExp(
        `runtime checkout differs.*expected_sha256=[a-f0-9]{64}; actual_sha256=[a-f0-9]{64}; matches_lf_to_crlf_conversion=${kind === 'CRLF'}`));
    } finally { spy.mockRestore(); }
  });

  test('rejects a missing runtime source', () => {
    const original = fs.existsSync;
    const file = path.join(root, verifier.SOURCE_PATHS[0]);
    const spy = jest.spyOn(fs, 'existsSync').mockImplementation((target) => target === file ? false : original(target));
    try { expect(() => verifier.verifyRuntimeCheckout({}, git(['rev-parse', 'HEAD']))).toThrow(/runtime checkout file missing/); }
    finally { spy.mockRestore(); }
  });
});

describe('stable successor source certificate', () => {
  let source;
  let certificate;
  beforeAll(() => {
    source = git(['rev-parse', 'HEAD']);
    certificate = verifier.buildCertificate(source, MERGED_LESSON);
  });

  test('is deterministic and verifies source payload without a self-hash cycle', () => {
    expect(verifier.buildCertificate(source, MERGED_LESSON)).toEqual(certificate);
    expect(certificate.successor_sources.map((item) => item.path)).not.toContain(verifier.CERTIFICATE);
    expect(verifier.validateCertificate(certificate, source).source_payload_sha).toBe(source);
  });

  test('permits unrelated future commits, package scripts and workflow steps', () => {
    const pkg = JSON.parse(read('package.json'));
    pkg.scripts['unrelated:check'] = 'node other.js';
    const head = synthetic(source, {
      'docs/unrelated-current-test.md': 'unrelated\n',
      'package.json': `${JSON.stringify(pkg, null, 2)}\n`,
      '.github/workflows/platform-ci.yml': read('.github/workflows/platform-ci.yml').replace('      - name: Validate report JSON',
        '      - name: Unrelated check\n        run: echo unrelated\n\n      - name: Validate report JSON'),
    });
    expect(verifier.validateCertificate(certificate, head).current_platform_sha).toBe(head);
  });

  test.each([
    ['source digest', (record) => { record.successor_sources[0].sha256 = '0'.repeat(64); }],
    ['missing source', (record) => { record.successor_sources.pop(); }],
    ['extra source', (record) => { record.successor_sources.push(record.successor_sources[0]); }],
    ['historical digest', (record) => { record.retained_historical_artifacts[0].blob_oid = '0'.repeat(40); }],
    ['historical snapshot', (record) => { record.historical_lesson_snapshot_sha = MERGED_LESSON; }],
    ['baseline binding', (record) => { record.baseline_platform_sha = source; }],
    ['unexpected claims', (record) => { record.new_capture_performed = true; }],
    ['malformed payload', (record) => { record.source_payload_sha = 'HEAD'; }],
    ['missing observation', (record) => { delete record.initial_observation; }],
  ])('rejects %s', (_label, mutate) => {
    const changed = clone(certificate);
    mutate(changed);
    expect(() => verifier.validateCertificate(changed, source)).toThrow();
  });

  test.each([
    verifier.SOURCE_PATHS[0], verifier.SOURCE_PATHS[1], verifier.SOURCE_PATHS[2],
    historical.PATHS.sourceManifest, historical.PATHS.renderedRenewal, historical.PATHS.deltaProof,
  ])('rejects drift in bound file %s', (file) => {
    const head = synthetic(source, { [file]: 'changed\n' });
    expect(() => verifier.validateCertificate(certificate, head)).toThrow(/bound current artifact changed/);
  });

  test('rejects missing historical evidence and stale source ancestry', () => {
    const missing = synthetic(source, { [historical.PATHS.renderedRenewal]: null });
    expect(() => verifier.validateCertificate(certificate, missing)).toThrow(/artifact missing/);
    expect(() => verifier.validateCertificate(certificate, verifier.BASELINE)).toThrow(/must descend/);
  });
});

describe('active CLI has no evidence shortcuts', () => {
  const args = ['--event-mode', 'manual', '--base', verifier.BASELINE, '--head', 'HEAD', '--lesson-head', 'HEAD'];
  test('accepts the actual lesson checkout contract', () => {
    expect(verifier.parseArgs(args).lessonHead).toBe('HEAD');
  });
  test.each(['--scope-only', '--write-delta-proof', '--write-delta-proof-only', '--allow-unbound-packet', '--repo-root', '--policy-file', '--seal'])('rejects %s', (flag) => {
    expect(() => verifier.parseArgs([...args, flag, 'value'])).toThrow(/unsupported/);
  });
  test('rejects historical lesson overrides, missing values and duplicate options', () => {
    expect(() => verifier.parseArgs(args.slice(0, -1).concat(verifier.SNAPSHOT))).toThrow(/actual lesson checkout HEAD/);
    expect(() => verifier.parseArgs([...args, '--scope-mode'])).toThrow(/missing value/);
    expect(() => verifier.parseArgs([...args, '--head', 'HEAD'])).toThrow(/duplicate/);
  });
  test('the separate writer requires full immutable SHAs', () => {
    expect(() => writer.write(['--source-head', 'HEAD', '--lesson-head', MERGED_LESSON])).toThrow(/full Platform SHA/);
  });
});
