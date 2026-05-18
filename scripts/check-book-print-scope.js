#!/usr/bin/env node
/**
 * check-book-print-scope.js
 *
 * Focused L1.5P guard for the printed Book 1 scope. This does not replace
 * check-book.js; it verifies the assembled book output follows the print
 * manifest: exactly 12 count-bearing paragraphs, no printed test-prep chapter,
 * and no excluded cost/revenue/marginal-analysis TOC rows.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REQUIRED_PARAGRAPHS = [
  '1.1.1',
  '1.1.2',
  '1.1.3',
  '1.1.4',
  '1.2.1',
  '1.2.2',
  '1.2.3',
  '1.2.4',
  '1.3.1',
  '1.3.2',
  '1.3.3',
  '1.3.4',
];

const FORBIDDEN_TOC_PATTERNS = [
  /\b1\.4\.\d\b/,
  /\b1\.5\.\d\b/,
  /Toetsvoorbereiding/i,
  /Kostenstructuren/i,
  /Opbrengsten/i,
  /Marginale kosten/i,
  /Marginale opbrengsten/i,
  /Winstmaximalisatie/i,
];

function usage() {
  console.error('Usage: node scripts/check-book-print-scope.js <book-folder-path>');
}

function findBookMd(bookRoot) {
  const candidates = fs.readdirSync(bookRoot)
    .filter(name => /boek\.md$/i.test(name))
    .map(name => path.join(bookRoot, name))
    .sort();
  if (candidates.length === 0) {
    throw new Error(`No '*boek.md' found in ${bookRoot}`);
  }
  if (candidates.length > 1) {
    throw new Error(`Multiple '*boek.md' files found in ${bookRoot}: ${candidates.map(p => path.basename(p)).join(', ')}`);
  }
  return candidates[0];
}

function extractBookToc(md) {
  const match = md.match(/<div class="book-toc">([\s\S]*?)<\/div>/);
  if (!match) {
    throw new Error('Book TOC block not found');
  }
  return match[1];
}

function extractParagraphNumbers(tocHtml) {
  const numbers = [];
  const rowRe = /<tr class="toc-paragraph">[\s\S]*?<td class="toc-nr">§?([^<]+)<\/td>/g;
  let match;
  while ((match = rowRe.exec(tocHtml)) !== null) {
    numbers.push(match[1].trim());
  }
  return numbers;
}

function assertBookPrintScope(bookRoot) {
  const bookMd = findBookMd(bookRoot);
  const md = fs.readFileSync(bookMd, 'utf8');
  const toc = extractBookToc(md);
  const numbers = extractParagraphNumbers(toc);
  const errors = [];

  if (numbers.length !== REQUIRED_PARAGRAPHS.length) {
    errors.push(`Expected ${REQUIRED_PARAGRAPHS.length} print paragraphs, found ${numbers.length}: ${numbers.join(', ')}`);
  }

  for (const nr of REQUIRED_PARAGRAPHS) {
    if (!numbers.includes(nr)) {
      errors.push(`Missing print paragraph ${nr}`);
    }
  }

  for (const nr of numbers) {
    if (!REQUIRED_PARAGRAPHS.includes(nr)) {
      errors.push(`Unexpected print paragraph ${nr}`);
    }
  }

  for (const pattern of FORBIDDEN_TOC_PATTERNS) {
    if (pattern.test(toc)) {
      errors.push(`Forbidden print TOC content matched ${pattern}`);
    }
  }

  if (/vijf hoofdstukken/i.test(md)) {
    errors.push('Voorwoord still says "vijf hoofdstukken"');
  }
  if (/laatste hoofdstuk[^.]*toetsvoorbereiding/i.test(md)) {
    errors.push('Voorwoord still presents test preparation as the final printed chapter');
  }
  if (!/toetsvoorbereiding[^.]*website/i.test(md) && !/website[^.]*toetsvoorbereiding/i.test(md)) {
    errors.push('Voorwoord does not clearly say toetsvoorbereiding is on the website');
  }
  if (!/De toets gaat over Boek 1/i.test(md)) {
    errors.push('Voorwoord does not state: "De toets gaat over Boek 1"');
  }

  return { bookMd, numbers, errors };
}

function main() {
  const bookArg = process.argv[2];
  if (!bookArg || bookArg === '--help' || bookArg === '-h') {
    usage();
    process.exit(bookArg ? 0 : 1);
  }
  const bookRoot = path.resolve(bookArg);
  if (!fs.existsSync(bookRoot) || !fs.statSync(bookRoot).isDirectory()) {
    console.error(`Book folder not found: ${bookRoot}`);
    process.exit(1);
  }

  try {
    const result = assertBookPrintScope(bookRoot);
    if (result.errors.length) {
      console.error(`FAIL Book print scope: ${path.basename(result.bookMd)}`);
      for (const error of result.errors) console.error(`- ${error}`);
      process.exit(1);
    }
    console.log(`OK Book print scope: ${result.numbers.length}/12 paragraphs (${result.numbers.join(', ')})`);
  } catch (err) {
    console.error(`FAIL Book print scope: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  REQUIRED_PARAGRAPHS,
  assertBookPrintScope,
  extractBookToc,
  extractParagraphNumbers,
};
