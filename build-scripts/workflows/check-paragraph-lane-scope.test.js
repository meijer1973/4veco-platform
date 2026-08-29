'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  changedQualityRefBlocks,
  classifyPath,
  checkLaneScope,
  parseArgs,
  runCli,
} = require('./check-paragraph-lane-scope');

const FIXTURE_DIR = path.join(__dirname, 'fixtures', 'paragraph-lane-scope');

function fixture(name) {
  return path.join(FIXTURE_DIR, name);
}

function runCliQuiet(args) {
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    return runCli(args);
  } finally {
    log.mockRestore();
    error.mockRestore();
  }
}

function git(args, cwd) {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${(result.stderr || result.stdout || '').trim()}`);
  }
  return result.stdout;
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

describe('check-paragraph-lane-scope', () => {
  test('classifies representative paragraph outputs', () => {
    expect(classifyPath('Boek 1/1.1/1.1.1 Test/1.1.1 Test – paragraaf.md').category).toBe('partA_textbook');
    expect(classifyPath('Boek 1/1.1/1.1.1 Test/1.1.1 Test – instapquiz.html').category).toBe('partB_companion');
    expect(classifyPath('Boek 1/shared/reasoning/1.1.1.js').category).toBe('partB_companion');
    expect(classifyPath('build-scripts/workflows/check-paragraph-lane-scope.js').category).toBe('shared_platform');
    expect(classifyPath('RESEARCH_AGENT_MAP.md').category).toBe('generated_indexes');
    expect(classifyPath('reports/review-gates/PR200/plan.md').category).toBe('review_evidence');
    expect(classifyPath('reports/review-gates/PR200/run.js').category).toBe('unknown');
    expect(classifyPath('reports/review-gates/PR200/packet.pdf').category).toBe('unknown');
  });

  test('accepts wider-route short-check and exit-ticket outputs in the companion lane', () => {
    const changedPaths = [
      'Boek 1/1.1/1.1.1 Test/1.1.1 Test \u2013 korte-check.html',
      'Boek 1/1.1/1.1.1 Test/1.1.1 Test \u2013 exit-ticket.html',
    ];

    expect(changedPaths.map((filePath) => classifyPath(filePath).category)).toEqual([
      'partB_companion',
      'partB_companion',
    ]);
    expect(checkLaneScope({ lane: 'companion', changedPaths })).toMatchObject({
      ok: true,
      failures: [],
    });
  });

  test('classifies chapter and book aggregate outputs as textbook artifacts', () => {
    expect(classifyPath('Boek 1/1.1 Hoofdstuk Test/1.1 Test - hoofdstuk.md').category).toBe('partA_textbook');
    expect(classifyPath('Boek 1/1.1 Hoofdstuk Test/build_chapter.py').category).toBe('partA_textbook');
    expect(classifyPath('Boek 1/Boek 1 Test - boek.pdf').category).toBe('partA_textbook');
    expect(classifyPath('Boek 1/_assets/book-1-cover.png').category).toBe('partA_textbook');
  });

  test('keeps PDF output out of the companion lane by default', () => {
    expect(classifyPath('Boek 1/1.1/1.1.1 Test/1.1.1 Test - samenvatting.pdf').category).toBe('partA_textbook');
    expect(classifyPath('Boek 1/1.1/1.1.1 Test/1.1.1 Test - uitleg vaardigheden.pdf').category).toBe('unknown');

    const companionPdf = checkLaneScope({
      lane: 'companion',
      changedPaths: ['Boek 1/1.1/1.1.1 Test/1.1.1 Test - uitleg vaardigheden.pdf'],
    });

    expect(companionPdf.ok).toBe(false);
    expect(companionPdf.failures.join('\n')).toMatch(/unknown paths require explicit classification/);
  });

  test('textbook-only fixture passes textbook and fails companion', () => {
    const textbook = runCliQuiet(['--lane', 'textbook', '--fixture', fixture('textbook-only.json'), '--json']);
    const companion = runCliQuiet(['--lane', 'companion', '--fixture', fixture('textbook-only.json'), '--json']);

    expect(textbook).toBe(0);
    expect(companion).toBe(1);
  });

  test('companion-only fixture passes companion and fails textbook', () => {
    const companion = runCliQuiet(['--lane', 'companion', '--fixture', fixture('companion-only.json'), '--json']);
    const textbook = runCliQuiet(['--lane', 'textbook', '--fixture', fixture('companion-only.json'), '--json']);

    expect(companion).toBe(0);
    expect(textbook).toBe(1);
  });

  test('textbook lane rejects companion leaks', () => {
    const summary = checkLaneScope({
      lane: 'textbook',
      changedPaths: require('./fixtures/paragraph-lane-scope/textbook-with-companion-leak.json').changed_paths,
    });

    expect(summary.ok).toBe(false);
    expect(summary.failures.join('\n')).toMatch(/may not change companion files/);
  });

  test('companion lane rejects Part A textbook leaks', () => {
    const summary = checkLaneScope({
      lane: 'companion',
      changedPaths: require('./fixtures/paragraph-lane-scope/companion-with-textbook-leak.json').changed_paths,
    });

    expect(summary.ok).toBe(false);
    expect(summary.failures.join('\n')).toMatch(/may not change Part A textbook files/);
  });

  test('mixed Part A and Part B can pass only with a valid exception', () => {
    const fixtureData = require('./fixtures/paragraph-lane-scope/mixed-with-exception.json');
    const withoutException = checkLaneScope({
      lane: 'companion',
      changedPaths: fixtureData.changed_paths,
    });
    const withException = checkLaneScope({
      lane: 'companion',
      changedPaths: fixtureData.changed_paths,
      exception: { lane_scope_exception: fixtureData.lane_scope_exception },
    });

    expect(withoutException.ok).toBe(false);
    expect(withException.ok).toBe(true);
    expect(withException.warnings.join('\n')).toMatch(/exception accepted/);
  });

  test('shared platform fixture passes shared and fails lesson lanes', () => {
    const shared = runCliQuiet(['--lane', 'shared', '--fixture', fixture('shared-platform-with-declared-scope.json'), '--json']);
    const textbook = runCliQuiet(['--lane', 'textbook', '--fixture', fixture('shared-platform-with-declared-scope.json'), '--json']);
    const companion = runCliQuiet(['--lane', 'companion', '--fixture', fixture('shared-platform-with-declared-scope.json'), '--json']);

    expect(shared).toBe(0);
    expect(textbook).toBe(1);
    expect(companion).toBe(1);
  });

  test('generated index/report tail is allowed only with lane-owned changes', () => {
    const onlyTail = runCliQuiet(['--lane', 'shared', '--fixture', fixture('generated-tail-only.json'), '--json']);
    const withShared = checkLaneScope({
      lane: 'shared',
      changedPaths: [
        'build-scripts/workflows/check-paragraph-lane-scope.js',
        'RESEARCH_AGENT_MAP.md',
        'reports/url-index.md',
      ],
    });

    expect(onlyTail).toBe(1);
    expect(withShared.ok).toBe(true);
  });

  test('quality-ref companion block only is lane-owned in companion lane', () => {
    const data = require('./fixtures/paragraph-lane-scope/companion-with-quality-ref-companion-block-only.json');
    const summary = checkLaneScope({
      lane: 'companion',
      changedPaths: data.changed_paths,
      qualityRefChanges: data.quality_ref_changes,
    });

    expect(summary.ok).toBe(true);
  });

  test('companion lane rejects quality-ref partA block edits', () => {
    const data = require('./fixtures/paragraph-lane-scope/companion-with-quality-ref-partA-block-leak.json');
    const summary = checkLaneScope({
      lane: 'companion',
      changedPaths: data.changed_paths,
      qualityRefChanges: data.quality_ref_changes,
    });

    expect(summary.ok).toBe(false);
    expect(summary.failures.join('\n')).toMatch(/quality-ref partA block/);
  });

  test('quality-ref partA block only is lane-owned in textbook lane', () => {
    const data = require('./fixtures/paragraph-lane-scope/textbook-with-quality-ref-partA-block-only.json');
    const summary = checkLaneScope({
      lane: 'textbook',
      changedPaths: data.changed_paths,
      qualityRefChanges: data.quality_ref_changes,
    });

    expect(summary.ok).toBe(true);
  });

  test('textbook lane rejects quality-ref companion block edits', () => {
    const data = require('./fixtures/paragraph-lane-scope/textbook-with-quality-ref-companion-block-leak.json');
    const summary = checkLaneScope({
      lane: 'textbook',
      changedPaths: data.changed_paths,
      qualityRefChanges: data.quality_ref_changes,
    });

    expect(summary.ok).toBe(false);
    expect(summary.failures.join('\n')).toMatch(/quality-ref companion block/);
  });

  test('detects changed quality-ref blocks from YAML content', () => {
    const before = [
      'schema_version: 2',
      'partA:',
      '  review_verdict: "PASS"',
      'companion:',
      '  review_verdict: "PASS"',
      '  hard_fails_open: 0',
      '',
    ].join('\n');
    const after = before.replace('hard_fails_open: 0', 'hard_fails_open: 1');

    expect(changedQualityRefBlocks(before, after)).toEqual(['companion']);
  });

  test('runCli --cwd checks the target repository git range', () => {
    const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'lane-scope-cwd-'));
    try {
      git(['init', '-b', 'main'], repo);
      writeFile(path.join(repo, 'README.md'), '# temp\n');
      git(['add', 'README.md'], repo);
      git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'initial'], repo);
      writeFile(path.join(repo, 'docs', 'workflows', 'lane.md'), '# lane\n');
      git(['add', 'docs/workflows/lane.md'], repo);
      git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'add lane doc'], repo);

      const code = runCliQuiet(['--cwd', repo, '--lane', 'shared', '--base', 'HEAD~1', '--head', 'HEAD']);

      expect(code).toBe(0);
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });

  test('runCli preserves non-ASCII textbook paths from git ranges', () => {
    const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'lane-scope-unicode-'));
    try {
      git(['init', '-b', 'main'], repo);
      writeFile(path.join(repo, 'README.md'), '# temp\n');
      git(['add', 'README.md'], repo);
      git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'initial'], repo);
      writeFile(path.join(repo, 'Boek 1', 'Boek 1 Test – boek.md'), '# book\n');
      git(['add', '.'], repo);
      git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'add book'], repo);

      const code = runCliQuiet(['--cwd', repo, '--lane', 'textbook', '--base', 'HEAD~1', '--head', 'HEAD']);

      expect(code).toBe(0);
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });

  test('companion lane rejects deleted Part A textbook files from git range', () => {
    const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'lane-scope-delete-part-a-'));
    try {
      git(['init', '-b', 'main'], repo);
      const textbookPath = path.join(
        repo,
        'Boek 1',
        '1.1 Hoofdstuk Test',
        '1.1.1 Test',
        '1.1.1 Test - paragraaf.md',
      );
      const companionPath = path.join(
        repo,
        'Boek 1',
        '1.1 Hoofdstuk Test',
        '1.1.1 Test',
        '1.1.1 Test - instapquiz.html',
      );
      writeFile(textbookPath, '# textbook\n');
      git(['add', '.'], repo);
      git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'add textbook'], repo);
      fs.rmSync(textbookPath);
      writeFile(companionPath, '<!doctype html>\n');
      git(['add', '-A'], repo);
      git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'replace with companion'], repo);

      const code = runCliQuiet(['--cwd', repo, '--lane', 'companion', '--base', 'HEAD~1', '--head', 'HEAD']);

      expect(code).toBe(1);
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });

  test('textbook lane rejects deleted companion files from git range', () => {
    const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'lane-scope-delete-companion-'));
    try {
      git(['init', '-b', 'main'], repo);
      const companionPath = path.join(
        repo,
        'Boek 1',
        '1.1 Hoofdstuk Test',
        '1.1.1 Test',
        '1.1.1 Test - instapquiz.html',
      );
      const textbookPath = path.join(
        repo,
        'Boek 1',
        '1.1 Hoofdstuk Test',
        '1.1.1 Test',
        '1.1.1 Test - paragraaf.md',
      );
      writeFile(companionPath, '<!doctype html>\n');
      git(['add', '.'], repo);
      git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'add companion'], repo);
      fs.rmSync(companionPath);
      writeFile(textbookPath, '# textbook\n');
      git(['add', '-A'], repo);
      git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'replace with textbook'], repo);

      const code = runCliQuiet(['--cwd', repo, '--lane', 'textbook', '--base', 'HEAD~1', '--head', 'HEAD']);

      expect(code).toBe(1);
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });

  test('textbook lane rejects shared game data changes', () => {
    const summary = checkLaneScope({
      lane: 'textbook',
      changedPaths: [
        'Boek 1/1.1 Hoofdstuk Test/shared/reasoning/1.1.1.js',
        'Boek 1/1.1 Hoofdstuk Test/1.1.1 Test/1.1.1 Test – paragraaf.md',
      ],
    });

    expect(summary.ok).toBe(false);
    expect(summary.failures.join('\n')).toMatch(/may not change companion files/);
  });

  test('parseArgs accepts required lane and defaults git range', () => {
    expect(parseArgs(['--lane', 'shared', '--cwd', '..\\4veco-lessen'])).toMatchObject({
      lane: 'shared',
      cwd: '..\\4veco-lessen',
      base: 'origin/main',
      head: 'HEAD',
    });
  });
});
