#!/usr/bin/env node
/**
 * Compatibility entrypoint for the implemented section 1.1.3 presentation.
 *
 * HTML and PowerPoint derivatives both consume the same semantic model.
 */

const { buildPresentationDeck } = require('./presentation-v2-registry');

async function main() {
  await buildPresentationDeck('b1-113');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
