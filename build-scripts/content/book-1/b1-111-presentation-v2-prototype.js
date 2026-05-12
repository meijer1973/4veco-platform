#!/usr/bin/env node
/**
 * Build the §1.1.1 presentation-v2 prototype.
 *
 * Outputs are deliberately named `presentatie-v2-prototype` so the current
 * shipped presentation is not overwritten before the prototype passes review.
 */

const fs = require('fs');
const path = require('path');
const deck = require('./b1-111-presentation-v2-model');
const { writeDeckHtml } = require('../../lib/render-presentation-v2-html');
const { writeDeckPptx } = require('../../lib/render-presentation-v2-pptx');

const MODULE_ROOT = process.env.MODULE_ROOT || path.resolve(__dirname, '../../../../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod');
const PARAGRAPH_DIR = path.join(
  MODULE_ROOT,
  '1.1 Hoofdstuk Economisch denken en rekenen',
  '1.1.1 Schaarste en economisch denken',
);
const SHARED_DIR = path.join(MODULE_ROOT, 'shared');
const PLATFORM_ROOT = path.resolve(__dirname, '../../..');

async function main() {
  fs.mkdirSync(PARAGRAPH_DIR, { recursive: true });
  fs.mkdirSync(SHARED_DIR, { recursive: true });

  const htmlOut = path.join(PARAGRAPH_DIR, `${deck.outputBase}.html`);
  const pptxOut = path.join(PARAGRAPH_DIR, `${deck.outputBase}.pptx`);

  copyEngine('presentation-v2.css');
  copyEngine('presentation-v2.js');

  writeDeckHtml(deck, htmlOut, {
    pptxHref: `${deck.outputBase}.pptx`,
  });
  await writeDeckPptx(deck, pptxOut);

  console.log(`OK presentation-v2 prototype`);
  console.log(`  HTML: ${htmlOut}`);
  console.log(`  PPTX: ${pptxOut}`);
}

function copyEngine(file) {
  const src = path.join(PLATFORM_ROOT, 'engines', file);
  const dst = path.join(SHARED_DIR, file);
  if (!fs.existsSync(src)) throw new Error(`Missing engine file: ${src}`);
  const header = file.endsWith('.css')
    ? '/* AUTO-COPIED FROM 4veco-platform/engines/ — DO NOT EDIT HERE */\n'
    : '// AUTO-COPIED FROM 4veco-platform/engines/ — DO NOT EDIT HERE\n';
  fs.writeFileSync(dst, header + fs.readFileSync(src, 'utf8'), 'utf8');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
