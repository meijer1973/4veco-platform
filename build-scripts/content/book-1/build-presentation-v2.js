#!/usr/bin/env node
const {
  PRESENTATION_V2_DECKS,
  buildPresentationDeck,
  buildPresentationDecks,
} = require('./presentation-v2-registry');

function printUsage() {
  const decks = PRESENTATION_V2_DECKS.map(deck => `${deck.slug} (${deck.id})`).join(', ');
  console.error('Usage: node build-scripts/content/book-1/build-presentation-v2.js --all');
  console.error('   or: node build-scripts/content/book-1/build-presentation-v2.js --deck <slug-or-id>');
  console.error(`Known decks: ${decks}`);
}

function parseArgs(argv) {
  const args = [...argv];
  const options = { all: false, deck: null };
  while (args.length) {
    const arg = args.shift();
    if (arg === '--all') {
      options.all = true;
    } else if (arg === '--deck') {
      options.deck = args.shift();
    } else if (arg === '--no-roundtrip') {
      options.roundtrip = false;
    } else if (!arg.startsWith('-') && !options.deck) {
      options.deck = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.all && options.deck) throw new Error('Use either --all or --deck, not both.');
  if (options.all) {
    await buildPresentationDecks(options);
    return;
  }
  if (options.deck) {
    await buildPresentationDeck(options.deck, options);
    return;
  }
  printUsage();
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
