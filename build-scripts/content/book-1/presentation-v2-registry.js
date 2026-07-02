const fs = require('fs');
const path = require('path');
const { writeDeckHtml } = require('../../lib/render-presentation-v2-html');
const { writeDeckPptx } = require('../../lib/render-presentation-v2-pptx');

const PLATFORM_ROOT = path.resolve(__dirname, '../../..');
const DEFAULT_MODULE_ROOT = path.resolve(
  __dirname,
  '../../../../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod',
);

const ACTIVE_PRESENTATION_V2_DECK_SLUGS = ['b1-111', 'b1-112', 'b1-113'];

const PRESENTATION_V2_DECKS = [
  {
    slug: 'b1-111',
    id: '1.1.1',
    modelPath: path.join(__dirname, 'b1-111-presentation-v2-model.js'),
    successMessage: 'OK presentation-v2 implemented web',
  },
  {
    slug: 'b1-112',
    id: '1.1.2',
    modelPath: path.join(__dirname, 'b1-112-presentation-v2-model.js'),
    successMessage: 'OK presentation-v2 percentages and index 1.1.2',
  },
  {
    slug: 'b1-113',
    id: '1.1.3',
    modelPath: path.join(__dirname, 'b1-113-presentation-v2-model.js'),
    successMessage: 'OK presentation-v2 graph transfer 1.1.3',
  },
];

function moduleRootFrom(options = {}) {
  return options.moduleRoot || process.env.MODULE_ROOT || DEFAULT_MODULE_ROOT;
}

function loadDeck(entry) {
  return require(entry.modelPath);
}

function paragraphDir(moduleRoot, deck) {
  return path.join(
    moduleRoot,
    deck.paragraph.chapter,
    `${deck.paragraph.number} ${deck.paragraph.title}`,
  );
}

function presentationOutputPaths(deck, options = {}) {
  const moduleRoot = moduleRootFrom(options);
  const paragraphOutDir = paragraphDir(moduleRoot, deck);
  return {
    moduleRoot,
    paragraphOutDir,
    htmlOut: path.join(paragraphOutDir, `${deck.outputBase}.html`),
    pptxOut: path.join(paragraphOutDir, `${deck.outputBase}.pptx`),
  };
}

function copyEngine(sharedDir, file) {
  const src = path.join(PLATFORM_ROOT, 'engines', file);
  const dst = path.join(sharedDir, file);
  if (!fs.existsSync(src)) throw new Error(`Missing engine file: ${src}`);
  const header = file.endsWith('.css')
    ? '/* AUTO-COPIED FROM 4veco-platform/engines/ - DO NOT EDIT HERE */\n'
    : '// AUTO-COPIED FROM 4veco-platform/engines/ - DO NOT EDIT HERE\n';
  fs.writeFileSync(dst, header + fs.readFileSync(src, 'utf8'), 'utf8');
}

function getPresentationDeck(slugOrId) {
  const entry = PRESENTATION_V2_DECKS.find(deck =>
    deck.slug === slugOrId || deck.id === slugOrId
  );
  if (!entry) {
    const known = PRESENTATION_V2_DECKS.map(deck => `${deck.slug} (${deck.id})`).join(', ');
    throw new Error(`Unknown presentation-v2 deck "${slugOrId}". Known decks: ${known}`);
  }
  return entry;
}

async function buildPresentationDeck(slugOrId, options = {}) {
  const entry = typeof slugOrId === 'string' ? getPresentationDeck(slugOrId) : slugOrId;
  const deck = loadDeck(entry);
  const {
    moduleRoot,
    paragraphOutDir,
    htmlOut,
    pptxOut,
  } = presentationOutputPaths(deck, options);
  const sharedDir = path.join(moduleRoot, 'shared');

  fs.mkdirSync(paragraphOutDir, { recursive: true });
  fs.mkdirSync(sharedDir, { recursive: true });

  copyEngine(sharedDir, 'presentation-v2.css');
  copyEngine(sharedDir, 'presentation-v2.js');

  writeDeckHtml(deck, htmlOut, {
    backHref: 'index.html',
    pptxHref: `${deck.outputBase}.pptx`,
  });
  await writeDeckPptx(deck, pptxOut, {
    roundtrip: options.roundtrip !== undefined
      ? options.roundtrip
      : process.env.PRESENTATION_V2_PPTX_ROUNDTRIP !== '0',
  });

  if (options.log !== false) {
    console.log(entry.successMessage);
    console.log(`  HTML: ${htmlOut}`);
    console.log(`  PPTX: ${pptxOut}`);
  }

  return {
    entry,
    deck,
    htmlOut,
    pptxOut,
    paragraphOutDir,
    moduleRoot,
  };
}

async function buildPresentationDecks(options = {}) {
  const results = [];
  for (const entry of PRESENTATION_V2_DECKS) {
    results.push(await buildPresentationDeck(entry, options));
  }
  return results;
}

module.exports = {
  ACTIVE_PRESENTATION_V2_DECK_SLUGS,
  PRESENTATION_V2_DECKS,
  buildPresentationDeck,
  buildPresentationDecks,
  getPresentationDeck,
  loadDeck,
  moduleRootFrom,
  paragraphDir,
  presentationOutputPaths,
};
