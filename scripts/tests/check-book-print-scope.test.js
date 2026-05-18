/**
 * Tests for the L1.5P Book 1 print-scope guard.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CHECK = path.resolve(__dirname, '..', 'check-book-print-scope.js');
const TMP = path.resolve(__dirname, '..', '..', 'tmp', 'test-check-book-print-scope');
const DASH = '\u2013';

function run(args) {
  const result = spawnSync(process.execPath, [CHECK, ...args], {
    encoding: 'utf8',
    timeout: 20000,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return {
    exitCode: result.status,
    output: `${result.stdout || ''}${result.stderr || ''}`,
  };
}

function writeBook(numbers, extraToc = '', voorwoord = '') {
  const book = path.join(TMP, 'Boek 1 - Test');
  fs.mkdirSync(book, { recursive: true });
  const rows = numbers.map(nr => (
    `<tr class="toc-paragraph"><td class="toc-nr">§${nr}</td><td class="toc-title">Titel ${nr}</td></tr>`
  )).join('\n');
  const md = [
    '<div class="book-voorwoord">',
    voorwoord || '<p>De toets gaat over Boek 1. De toetsvoorbereiding staat op de website.</p>',
    '</div>',
    '<div class="book-toc">',
    '<h1>Inhoudsopgave</h1>',
    rows,
    extraToc,
    '</div>',
  ].join('\n');
  fs.writeFileSync(path.join(book, `Boek 1 Test ${DASH} boek.md`), md, 'utf8');
  return book;
}

beforeEach(() => {
  fs.rmSync(TMP, { recursive: true, force: true });
  fs.mkdirSync(TMP, { recursive: true });
});

afterAll(() => {
  fs.rmSync(TMP, { recursive: true, force: true });
});

describe('check-book-print-scope.js', () => {
  test('passes a 12-paragraph Book 1 print scope', () => {
    const book = writeBook([
      '1.1.1', '1.1.2', '1.1.3', '1.1.4',
      '1.2.1', '1.2.2', '1.2.3', '1.2.4',
      '1.3.1', '1.3.2', '1.3.3', '1.3.4',
    ]);
    const { exitCode, output } = run([book]);
    expect(exitCode).toBe(0);
    expect(output).toContain('OK Book print scope');
  });

  test('fails when old chapter 1.4 appears in the print TOC', () => {
    const book = writeBook([
      '1.1.1', '1.1.2', '1.1.3', '1.1.4',
      '1.2.1', '1.2.2', '1.2.3', '1.2.4',
      '1.3.1', '1.3.2', '1.3.3', '1.4.1',
    ]);
    const { exitCode, output } = run([book]);
    expect(exitCode).not.toBe(0);
    expect(output).toContain('Missing print paragraph 1.3.4');
    expect(output).toContain('Unexpected print paragraph 1.4.1');
  });

  test('fails when the old preface language remains', () => {
    const book = writeBook([
      '1.1.1', '1.1.2', '1.1.3', '1.1.4',
      '1.2.1', '1.2.2', '1.2.3', '1.2.4',
      '1.3.1', '1.3.2', '1.3.3', '1.3.4',
    ], '', '<p>Het boek bestaat uit vijf hoofdstukken. Het laatste hoofdstuk is bedoeld voor toetsvoorbereiding.</p>');
    const { exitCode, output } = run([book]);
    expect(exitCode).not.toBe(0);
    expect(output).toContain('vijf hoofdstukken');
  });
});
