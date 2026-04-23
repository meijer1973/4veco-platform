/**
 * Tests for check-book.js Green Gate command wiring.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CHECK_BOOK = path.resolve(__dirname, '..', 'check-book.js');
const TMP = path.resolve(__dirname, '..', '..', 'tmp', 'test-check-book');
const DASH = '\u2013';

function run(args) {
  const result = spawnSync(process.execPath, [CHECK_BOOK, ...args], {
    encoding: 'utf8',
    timeout: 20000,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return {
    exitCode: result.status,
    output: `${result.stdout || ''}${result.stderr || ''}`,
  };
}

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function writeBlob(filePath, size) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, 'x'.repeat(size));
}

function setupBook() {
  const book = path.join(TMP, 'Boek 9 - Test');
  const chapter = path.join(book, '9.9 Hoofdstuk Test');
  const paragraph = path.join(chapter, '9.9.1 Theory');
  const prefix = '9.9.1 Theory';

  fs.mkdirSync(path.join(paragraph, '_assets'), { recursive: true });
  for (const suffix of ['paragraaf', 'opgaven', 'antwoorden']) {
    writeText(
      path.join(paragraph, `${prefix} ${DASH} ${suffix}.md`),
      `# ${suffix}\n\n![Figure](_assets/9.9.1_fig_1.svg)\n`
    );
    writeBlob(path.join(paragraph, `${prefix} ${DASH} ${suffix}.pdf`), 15000);
  }

  writeText(path.join(paragraph, 'build_pdf.py'), 'BASE = Path(__file__).parent\n');
  writeText(path.join(paragraph, '_assets', '9.9.1_fig_1.svg'), '<svg></svg>');
  writeText(path.join(paragraph, '_assets', '9.9.1_fig_1.png'), 'png');
  writeText(path.join(paragraph, '9.9.1-review.md'), '# Review\nNo unresolved problems.\n');
  writeText(
    path.join(paragraph, '9.9.1-quality-ref.yaml'),
    [
      'assets:',
      '  missing: []',
      '  svgpng_paired: true',
      '  naming_compliant: true',
    ].join('\n')
  );

  fs.mkdirSync(path.join(chapter, '_assets'), { recursive: true });
  writeText(path.join(chapter, '9.9 Test hoofdstuk.md'), '# Chapter\n');
  writeBlob(path.join(chapter, '9.9 Test hoofdstuk.pdf'), 120000);
  writeText(path.join(chapter, '9.9 Test antwoorden.md'), '# Answers\n');
  writeBlob(path.join(chapter, '9.9 Test antwoorden.pdf'), 20000);
  writeText(path.join(chapter, 'build_chapter.py'), 'BASE = Path(__file__).parent\n');
  writeText(path.join(chapter, '_chapter-plan.md'), '# Chapter plan\n');

  return book;
}

beforeEach(() => {
  fs.rmSync(TMP, { recursive: true, force: true });
  fs.mkdirSync(TMP, { recursive: true });
});

afterAll(() => {
  fs.rmSync(TMP, { recursive: true, force: true });
});

describe('check-book.js', () => {
  test('runs chapter and paragraph validators for a flat book', () => {
    const book = setupBook();
    const { exitCode, output } = run([book]);

    expect(exitCode).toBe(0);
    expect(output).toContain('OK chapter 9.9');
    expect(output).toContain('OK paragraph 9.9.1');
    expect(output).toContain('BOOK HEALTH CHECK PASSED');
  });

  test('fails clearly when a book has no chapter folders', () => {
    const emptyBook = path.join(TMP, 'Boek 0 - Empty');
    fs.mkdirSync(emptyBook, { recursive: true });
    const { exitCode, output } = run([emptyBook]);

    expect(exitCode).not.toBe(0);
    expect(output).toContain('No chapter folders found');
  });
});
