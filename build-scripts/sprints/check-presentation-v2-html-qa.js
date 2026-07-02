#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  PRESENTATION_V2_DECKS,
  loadDeck,
  presentationOutputPaths,
} = require('../content/book-1/presentation-v2-registry');

const ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_OUT_DIR = path.join(ROOT, 'reports', 'sprints', 'presentation-v2-html-qa');

function parseArgs(argv) {
  const options = {
    outDir: DEFAULT_OUT_DIR,
    moduleRoot: null,
  };
  const args = [...argv];
  while (args.length) {
    const arg = args.shift();
    if (arg === '--output-dir') {
      const value = args.shift();
      if (!value) throw new Error('--output-dir requires a path');
      options.outDir = path.resolve(value);
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
  console.error(`presentation-v2 HTML QA failed: ${message}`);
  process.exit(1);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  fs.rmSync(options.outDir, { recursive: true, force: true });
  fs.mkdirSync(options.outDir, { recursive: true });

  const qaScript = path.join(ROOT, 'scripts', 'qa-presentation-v2-html.js');
  const manifest = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    qa_script: rel(qaScript),
    decks: [],
  };

  for (const entry of PRESENTATION_V2_DECKS) {
    const deck = loadDeck(entry);
    const paths = presentationOutputPaths(deck, { moduleRoot: options.moduleRoot });
    if (!fs.existsSync(paths.htmlOut)) {
      fail(`${entry.id} HTML missing; run npm run build:presentation-v2 first: ${paths.htmlOut}`);
    }
    const deckOutDir = path.join(options.outDir, entry.slug);
    fs.mkdirSync(deckOutDir, { recursive: true });
    const result = spawnSync(process.execPath, [qaScript, paths.htmlOut, deckOutDir], {
      cwd: ROOT,
      stdio: 'inherit',
    });
    if (result.status !== 0) {
      fail(`${entry.id} browser QA exited with ${result.status}`);
    }
    manifest.decks.push({
      id: entry.id,
      slug: entry.slug,
      html: rel(paths.htmlOut),
      screenshot_dir: rel(deckOutDir),
      slide_count: deck.slides.length,
    });
  }

  const manifestPath = path.join(options.outDir, 'manifest.json');
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`OK presentation-v2 HTML QA: ${manifestPath}`);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
