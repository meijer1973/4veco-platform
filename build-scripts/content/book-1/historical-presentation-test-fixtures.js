'use strict';
// Test the frozen first-edition models without republishing retired lesson files.
const fs = require('fs'), path = require('path');
const {getPresentationDeck, loadDeck} = require('./presentation-v2-registry');
const {renderDeckHtml} = require('../../lib/render-presentation-v2-html');
function fixture(id) {
  const deck = loadDeck(getPresentationDeck(id));
  return {deck, html: renderDeckHtml(deck, {backHref: 'index.html', pptxHref: deck.outputBase + '.pptx'}),
    css: fs.readFileSync(path.resolve(__dirname, '../../../engines/presentation-v2.css'), 'utf8'),
    js: fs.readFileSync(path.resolve(__dirname, '../../../engines/presentation-v2.js'), 'utf8')};
}
module.exports = {fixture};
