#!/usr/bin/env node
/**
 * check-book.js - Run Green Gate validation for a target 4veco-lessen book.
 *
 * Usage:
 *   node scripts/check-book.js [--paragraph-mode auto|part-a|part-b|complete] [--paragraph-profile student-web|legacy-full|office|publisher-print] [--verbose] <book-folder-path>
 *
 * Default paragraph mode is `part-a`. Book health should stay anchored to the
 * textbook/chapter gate while companion MVP work is still in progress on
 * individual paragraphs. Use `--paragraph-mode complete` explicitly when the
 * goal is to validate a full paragraph pack.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const VALID_PARAGRAPH_MODES = new Set(['auto', 'part-a', 'part-b', 'complete']);
const VALID_PARAGRAPH_PROFILES = new Set(['student-web', 'legacy-full', 'office', 'publisher-print']);
const REPO_ROOT = path.resolve(__dirname, '..');

function usage() {
  console.error('Usage: node scripts/check-book.js [--paragraph-mode auto|part-a|part-b|complete] [--paragraph-profile student-web|legacy-full|office|publisher-print] [--skip-chapters] [--skip-paragraphs] [--verbose] <book-folder-path>');
}

function parseArgs(argv) {
  const options = {
    bookPath: null,
    paragraphMode: 'part-a',
    paragraphProfile: 'publisher-print',
    skipChapters: false,
    skipParagraphs: false,
    verbose: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else if (arg === '--skip-chapters') {
      options.skipChapters = true;
    } else if (arg === '--skip-paragraphs') {
      options.skipParagraphs = true;
    } else if (arg === '--paragraph-mode') {
      options.paragraphMode = argv[++i];
    } else if (arg.startsWith('--paragraph-mode=')) {
      options.paragraphMode = arg.slice('--paragraph-mode='.length);
    } else if (arg === '--paragraph-profile') {
      options.paragraphProfile = argv[++i];
    } else if (arg.startsWith('--paragraph-profile=')) {
      options.paragraphProfile = arg.slice('--paragraph-profile='.length);
    } else if (arg.startsWith('--')) {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(1);
    } else if (!options.bookPath) {
      options.bookPath = arg;
    } else {
      console.error(`Unexpected argument: ${arg}`);
      usage();
      process.exit(1);
    }
  }

  if (!options.bookPath) {
    usage();
    process.exit(1);
  }
  if (!VALID_PARAGRAPH_MODES.has(options.paragraphMode)) {
    console.error(`Invalid paragraph mode: ${options.paragraphMode}`);
    usage();
    process.exit(1);
  }
  if (!VALID_PARAGRAPH_PROFILES.has(options.paragraphProfile)) {
    console.error(`Invalid paragraph profile: ${options.paragraphProfile}`);
    usage();
    process.exit(1);
  }
  if (options.skipChapters && options.skipParagraphs) {
    console.error('Cannot skip both chapter and paragraph validation.');
    usage();
    process.exit(1);
  }

  return options;
}

function listDirs(folder, pattern) {
  return fs.readdirSync(folder, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && pattern.test(entry.name))
    .map(entry => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function runNodeCheck(label, scriptName, args, verbose) {
  const result = spawnSync(process.execPath, [path.join(__dirname, scriptName), ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const output = `${result.stdout || ''}${result.stderr || ''}`.trimEnd();
  const passed = result.status === 0;
  console.log(`${passed ? 'OK' : 'FAIL'} ${label}`);
  if (verbose || !passed) {
    if (output) console.log(output);
    if (output) console.log('');
  }

  return {
    label,
    exitCode: result.status,
    passed,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const bookRoot = path.resolve(options.bookPath);

  if (!fs.existsSync(bookRoot) || !fs.statSync(bookRoot).isDirectory()) {
    console.error(`Book folder not found: ${bookRoot}`);
    process.exit(1);
  }

  const chapters = listDirs(bookRoot, /^\d+\.\d+\s+Hoofdstuk\s+.+/);
  if (chapters.length === 0) {
    console.error(`No chapter folders found in: ${bookRoot}`);
    process.exit(1);
  }

  const results = [];
  console.log(`\nBook health check: ${bookRoot}`);
  console.log(`Chapters found: ${chapters.length}`);
  console.log(`Paragraph mode: ${options.paragraphMode}`);
  console.log(`Paragraph profile: ${options.paragraphProfile}\n`);

  if (!options.skipChapters) {
    console.log('-- Chapter validation --');
    for (const chapter of chapters) {
      const chapterPath = path.join(bookRoot, chapter);
      results.push(runNodeCheck(
        `chapter ${chapter.split(' ')[0]}`,
        'validate-chapter.js',
        [chapterPath],
        options.verbose
      ));
    }
    console.log('');
  }

  if (!options.skipParagraphs) {
    console.log('-- Paragraph validation --');
    for (const chapter of chapters) {
      const chapterPath = path.join(bookRoot, chapter);
      const paragraphs = listDirs(chapterPath, /^\d+\.\d+\.\d+\s+.+/);
      if (paragraphs.length === 0) {
        results.push({
          label: `paragraphs in ${chapter}`,
          exitCode: 1,
          passed: false,
        });
        console.log(`FAIL paragraphs in ${chapter} (none found)`);
        continue;
      }

      for (const paragraph of paragraphs) {
        const paragraphPath = path.join(chapterPath, paragraph);
        results.push(runNodeCheck(
          `paragraph ${paragraph.split(' ')[0]}`,
          'validate-paragraph.js',
          ['--mode', options.paragraphMode, '--profile', options.paragraphProfile, paragraphPath],
          options.verbose
        ));
      }
    }
    console.log('');
  }

  const failed = results.filter(result => !result.passed);
  console.log('==========================================');
  if (failed.length === 0) {
    console.log(`BOOK HEALTH CHECK PASSED: ${results.length}/${results.length} checks passed.`);
    process.exit(0);
  }

  console.log(`BOOK HEALTH CHECK FAILED: ${failed.length}/${results.length} checks failed.`);
  for (const result of failed) {
    console.log(`- ${result.label}`);
  }
  process.exit(1);
}

main();
