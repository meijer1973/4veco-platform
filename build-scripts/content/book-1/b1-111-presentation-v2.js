#!/usr/bin/env node
/**
 * Build the implemented §1.1.1 Golden web presentation.
 *
 * HTML and PowerPoint derivatives both consume the same semantic model.
 */

const fs = require('fs');
const path = require('path');
const deck = require('./b1-111-presentation-v2-model');
const { writeDeckHtml } = require('../../lib/render-presentation-v2-html');
const { writeDeckPptx } = require('../../lib/render-presentation-v2-pptx');

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

async function main() {
  fs.mkdirSync(PARAGRAPH_DIR, { recursive: true });
  fs.mkdirSync(SHARED_DIR, { recursive: true });

  copyEngine('presentation-v2.css');
  copyEngine('presentation-v2.js');

  const htmlOut = path.join(PARAGRAPH_DIR, `${deck.outputBase}.html`);
  const pptxOut = path.join(PARAGRAPH_DIR, `${deck.outputBase}.pptx`);
  writeDeckHtml(deck, htmlOut, {
    backHref: 'index.html',
    pptxHref: `${deck.outputBase}.pptx`,
  });
  await writeDeckPptx(deck, pptxOut, {
    roundtrip: process.env.PRESENTATION_V2_PPTX_ROUNDTRIP !== '0',
  });

  console.log('OK presentation-v2 implemented web');
  console.log(`  HTML: ${htmlOut}`);
  console.log(`  PPTX: ${pptxOut}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
