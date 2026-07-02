#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  ACTIVE_PRESENTATION_V2_DECK_SLUGS,
  PRESENTATION_V2_DECKS,
  loadDeck,
  moduleRootFrom,
  presentationOutputPaths,
} = require('../content/book-1/presentation-v2-registry');

const ROOT = path.resolve(__dirname, '..', '..');

function parseArgs(argv) {
  const options = {
    output: null,
    moduleRoot: null,
  };
  const args = [...argv];
  while (args.length) {
    const arg = args.shift();
    if (arg === '--output') {
      const value = args.shift();
      if (!value) throw new Error('--output requires a path');
      options.output = path.resolve(value);
    } else if (arg === '--module-root') {
      const value = args.shift();
      if (!value) throw new Error('--module-root requires a path');
      options.moduleRoot = path.resolve(value);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function fail(message) {
  console.error(`presentation-v2 legacy guard failed: ${message}`);
  process.exit(1);
}

function walkHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '_archive' || entry.name.includes('presentation-legacy')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(full, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const moduleRoot = moduleRootFrom(options);
  const activeFindings = [];
  const checkedDecks = [];

  if (PRESENTATION_V2_DECKS.map(deck => deck.slug).join('|') !== ACTIVE_PRESENTATION_V2_DECK_SLUGS.join('|')) {
    fail('registry order does not match ACTIVE_PRESENTATION_V2_DECK_SLUGS');
  }

  for (const entry of PRESENTATION_V2_DECKS) {
    if (!entry.modelPath.endsWith('-presentation-v2-model.js')) {
      fail(`${entry.slug} model path must be a presentation-v2 model: ${entry.modelPath}`);
    }
    if (entry.modelPath.includes('-presentatie.js') || entry.modelPath.includes('convert_presentatie')) {
      fail(`${entry.slug} points at a legacy presentation source: ${entry.modelPath}`);
    }
    const deck = loadDeck(entry);
    const paths = presentationOutputPaths(deck, { moduleRoot });
    if (fs.existsSync(paths.htmlOut)) {
      const html = fs.readFileSync(paths.htmlOut, 'utf8');
      if (!html.includes('data-layout="presentation-v2"')) {
        activeFindings.push({ deck: entry.slug, file: rel(paths.htmlOut), issue: 'missing presentation-v2 layout marker' });
      }
      if (html.includes('data-layout="presentatie-v1"')) {
        activeFindings.push({ deck: entry.slug, file: rel(paths.htmlOut), issue: 'contains legacy presentatie-v1 layout marker' });
      }
    }
    checkedDecks.push({
      id: entry.id,
      slug: entry.slug,
      model: rel(entry.modelPath),
      html: rel(paths.htmlOut),
      html_exists: fs.existsSync(paths.htmlOut),
    });
  }

  for (const htmlFile of walkHtmlFiles(moduleRoot)) {
    const html = fs.readFileSync(htmlFile, 'utf8');
    if (html.includes('data-layout="presentatie-v1"')) {
      activeFindings.push({
        file: rel(htmlFile),
        issue: 'active lesson HTML still uses legacy presentatie-v1 layout',
      });
    }
  }

  const report = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    module_root: rel(moduleRoot),
    active_deck_slugs: ACTIVE_PRESENTATION_V2_DECK_SLUGS,
    checked_decks: checkedDecks,
    allowed_legacy_surfaces: [
      {
        path: 'build-scripts/lib/convert_presentatie.py',
        status: 'quarantined legacy converter for historical Office/full-package surfaces',
      },
      {
        path: 'engines/voorkennis.css',
        status: 'retains presentatie-v1 selectors only for archived or legacy pages',
      },
    ],
    active_legacy_findings: activeFindings,
  };

  if (options.output) {
    fs.mkdirSync(path.dirname(options.output), { recursive: true });
    fs.writeFileSync(options.output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }

  if (activeFindings.length) {
    console.error(JSON.stringify(report, null, 2));
    fail(`${activeFindings.length} active legacy finding(s)`);
  }

  console.log(`OK presentation-v2 legacy guard: ${checkedDecks.length} registered deck(s), no active v1 output`);
  if (options.output) console.log(`  report: ${options.output}`);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
