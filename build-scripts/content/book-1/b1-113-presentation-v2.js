#!/usr/bin/env node
/**
 * Build the implemented section 1.1.3 graph/table web presentation.
 *
 * PowerPoint export is intentionally not produced here. The existing PPTX
 * remains a secondary legacy download until a separate derivative consumes this
 * semantic model and passes its own QA.
 */

const fs = require('fs');
const path = require('path');
const deck = require('./b1-113-presentation-v2-model');
const { writeDeckHtml } = require('../../lib/render-presentation-v2-html');

const MODULE_ROOT = process.env.MODULE_ROOT || path.resolve(__dirname, '../../../../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod');
const PARAGRAPH_DIR = path.join(
  MODULE_ROOT,
  deck.paragraph.chapter,
  `${deck.paragraph.number} ${deck.paragraph.title}`,
);
const SHARED_DIR = path.join(MODULE_ROOT, 'shared');
const PLATFORM_ROOT = path.resolve(__dirname, '../../..');

function copyEngine(file) {
  const src = path.join(PLATFORM_ROOT, 'engines', file);
  const dst = path.join(SHARED_DIR, file);
  if (!fs.existsSync(src)) throw new Error(`Missing engine file: ${src}`);
  const header = file.endsWith('.css')
    ? '/* AUTO-COPIED FROM 4veco-platform/engines/ - DO NOT EDIT HERE */\n'
    : '// AUTO-COPIED FROM 4veco-platform/engines/ - DO NOT EDIT HERE\n';
  fs.writeFileSync(dst, header + fs.readFileSync(src, 'utf8'), 'utf8');
}

function main() {
  fs.mkdirSync(PARAGRAPH_DIR, { recursive: true });
  fs.mkdirSync(SHARED_DIR, { recursive: true });

  copyEngine('presentation-v2.css');
  copyEngine('presentation-v2.js');

  const htmlOut = path.join(PARAGRAPH_DIR, `${deck.outputBase}.html`);
  writeDeckHtml(deck, htmlOut, {
    backHref: 'index.html',
  });

  console.log('OK presentation-v2 graph transfer 1.1.3');
  console.log(`  HTML: ${htmlOut}`);
}

main();
