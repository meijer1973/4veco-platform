#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function textOf(node) {
  return (node?.textContent || '').replace(/\s+/g, ' ').trim();
}

function validateHtml(html, { production = true } = {}) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const failures = [];

  function check(label, fn) {
    try {
      fn();
    } catch (error) {
      failures.push(`${label}: ${error.message}`);
    }
  }

  // Static structural floor only. Rendered interaction, keyboard behavior,
  // dark mode, focus order, and mobile layout require browser QA.
  const slides = Array.from(document.querySelectorAll('[data-slide], [data-pv2-slide], article.slide'));

  check('slide count', () => {
    assert(slides.length > 0, 'no slides found');
  });

  check('navigation', () => {
    const nav = document.querySelector('nav');
    assert(nav, 'missing navigation element');
    assert(
      document.querySelector('[data-slide-link], [data-pv2-link]') ||
        nav.querySelector('a,button') ||
        nav.id,
      'missing static slide navigation target'
    );
  });

  check('notes toggle', () => {
    assert(document.querySelector('[data-notes-toggle], [data-pv2-notes], #notesToggle'), 'missing notes toggle');
  });

  check('progress', () => {
    assert(document.querySelector('[data-current], [data-slide-current], .slide-count, .slide-counter, .progress, #counter'), 'missing visible progress indicator');
  });

  check('first slide route contract', () => {
    const first = slides[0];
    assert(first, 'missing first slide');
    const role = first.getAttribute('data-slide-role') || first.getAttribute('data-role');
    const firstText = textOf(first).toLowerCase();
    assert(role === 'route_contract' || /route|lesdoel|leer je|vandaag/.test(firstText), 'first slide does not expose a route contract');
  });

  check('slide titles and assertions', () => {
    for (const slide of slides) {
      const id = slide.id || slide.getAttribute('data-slide') || slide.getAttribute('data-pv2-slide');
      const title = slide.querySelector('h1,h2,.slide-title');
      assert(title && textOf(title), `${id} missing visible title`);
      const assertion = slide.querySelector('.assertion,.pv2-thesis,.slide-text,.slide-body,.student-action');
      assert(assertion && textOf(assertion), `${id} missing assertion or explanatory text`);
    }
  });

  check('notes on every slide', () => {
    for (const slide of slides) {
      const id = slide.id || slide.getAttribute('data-slide') || slide.getAttribute('data-pv2-slide');
      const notes = slide.querySelector('.notes,.slide-notes,.pv2-notes,.notes-source,[data-notes]');
      assert(notes && textOf(notes).length > 40, `${id} missing readable notes`);
    }
  });

  if (production) {
    check('no unfinished-status wording', () => {
      assert(!/\bprototype\b/i.test(html), 'production artifact contains unfinished-status wording');
    });
  }

  return failures;
}

function main() {
  const htmlPath = path.resolve(process.argv[2] || '');
  if (!htmlPath || !fs.existsSync(htmlPath)) {
    console.error('Usage: node scripts/qa-presentation-web.js <presentation.html>');
    process.exit(2);
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  const failures = validateHtml(html, { production: true });
  if (failures.length) {
    console.error('Presentation web QA failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log(`OK presentation web QA: ${htmlPath}`);
}

if (require.main === module) main();

module.exports = {
  validateHtml,
};
