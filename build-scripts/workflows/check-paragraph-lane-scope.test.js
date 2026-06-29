'use strict';

const path = require('path');
const {
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

describe('check-paragraph-lane-scope', () => {
  test('classifies representative paragraph outputs', () => {
    expect(classifyPath('Boek 1/1.1/1.1.1 Test/1.1.1 Test – paragraaf.md').category).toBe('partA_textbook');
    expect(classifyPath('Boek 1/1.1/1.1.1 Test/1.1.1 Test – instapquiz.html').category).toBe('partB_companion');
    expect(classifyPath('Boek 1/shared/reasoning/1.1.1.js').category).toBe('partB_companion');
    expect(classifyPath('build-scripts/workflows/check-paragraph-lane-scope.js').category).toBe('shared_platform');
    expect(classifyPath('RESEARCH_AGENT_MAP.md').category).toBe('generated_indexes');
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
    expect(parseArgs(['--lane', 'shared'])).toMatchObject({
      lane: 'shared',
      base: 'origin/main',
      head: 'HEAD',
    });
  });
});
