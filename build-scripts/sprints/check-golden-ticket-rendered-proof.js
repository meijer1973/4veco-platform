#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const noLegacy = require('./check-golden-ticket-no-legacy');

const ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_BOOK_ROOT = path.resolve(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');
const SCREENSHOT_DIR = path.join(ROOT, 'reports', 'sprints', 'GOLDEN-TICKET-LAYOUT-RESET-1-screenshots');
const MANIFEST_MD = path.join(ROOT, 'reports', 'sprints', 'GOLDEN-TICKET-LAYOUT-RESET-1-screenshot-manifest.md');
const MANIFEST_JSON = path.join(SCREENSHOT_DIR, 'manifest.json');
const SIDE_BY_SIDE = path.join(ROOT, 'reports', 'sprints', 'GOLDEN-TICKET-LAYOUT-RESET-1-side-by-side.md');

const REQUIRED_SCREENSHOTS = [
  'golden-reference-desktop-light.png',
  'implemented-desktop-light-initial.png',
  'implemented-desktop-light-after-graph.png',
  'implemented-desktop-light-feedback.png',
  'implemented-desktop-light-completed.png',
  'implemented-mobile-light-initial.png',
  'implemented-mobile-light-after-graph.png',
  'implemented-desktop-dark-initial.png',
  'implemented-mobile-dark-initial.png',
  'implemented-routing-after-reload.png',
];

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function fail(message) {
  throw new Error(message);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${rel(file)}`);
  return fs.readFileSync(file, 'utf8');
}

function assertFile(file) {
  if (!fs.existsSync(file)) fail(`missing rendered proof file: ${rel(file)}`);
  const size = fs.statSync(file).size;
  if (size < 1000) fail(`rendered proof file is unexpectedly small: ${rel(file)} (${size} bytes)`);
  return size;
}

function loadManifestJson() {
  if (!fs.existsSync(MANIFEST_JSON)) return null;
  return JSON.parse(fs.readFileSync(MANIFEST_JSON, 'utf8'));
}

function checkManifestJson(manifest) {
  if (!manifest) fail(`missing machine-readable proof manifest: ${rel(MANIFEST_JSON)}`);
  const files = new Set((manifest.screenshots || []).map((item) => path.basename(item.file || '')));
  for (const name of REQUIRED_SCREENSHOTS) {
    if (!files.has(name)) fail(`manifest.json missing screenshot entry: ${name}`);
  }
  const mobileAfterGraph = (manifest.screenshots || []).find((item) => path.basename(item.file || '') === 'implemented-mobile-light-after-graph.png');
  if (!mobileAfterGraph || !mobileAfterGraph.proof || mobileAfterGraph.proof.graphOk !== true) {
    fail('mobile after-graph proof must record graphOk=true');
  }
  const graphPoints = new Set(mobileAfterGraph.proof.graphPoints || []);
  if (!graphPoints.has('350,1') || !graphPoints.has('150,3')) {
    fail('mobile after-graph proof must record graphPoints including 350,1 and 150,3');
  }
  if (mobileAfterGraph.proof.lineShape !== 'decreasing') {
    fail('mobile after-graph proof must record rendered lineShape=decreasing');
  }
  if (mobileAfterGraph.proof.autoLineDrawn !== true) {
    fail('mobile after-graph proof must record autoLineDrawn=true after the second point');
  }
  if (mobileAfterGraph.proof.afterFirstLineCount !== 0) {
    fail('mobile after-graph proof must record afterFirstLineCount=0 before the second point');
  }
  if (mobileAfterGraph.proof.afterSecondLineCount !== 1) {
    fail('mobile after-graph proof must record afterSecondLineCount=1 immediately after the second point');
  }
  if (mobileAfterGraph.proof.checkboxCount !== 0) {
    fail('mobile after-graph proof must record checkboxCount=0');
  }
  if (mobileAfterGraph.proof.connectControlCount !== 0) {
    fail('mobile after-graph proof must record connectControlCount=0');
  }
  if (mobileAfterGraph.proof.lineShapeControlCount !== 0) {
    fail('mobile after-graph proof must record lineShapeControlCount=0');
  }
  if (mobileAfterGraph.proof.readingLocked !== false) {
    fail('mobile after-graph proof must record readingLocked=false');
  }
  const reload = (manifest.screenshots || []).find((item) => path.basename(item.file || '') === 'implemented-routing-after-reload.png');
  if (!reload || !reload.proof || reload.proof.goldenRoot !== true || reload.proof.exitTicketAppCount !== 0 || reload.proof.legacyAssetCount !== 0) {
    fail('routing-after-reload proof must record golden root and no legacy route assets');
  }
}

function checkTextProof() {
  const manifestMd = read(MANIFEST_MD);
  const sideBySide = read(SIDE_BY_SIDE);
  [
    'main.ge-page[data-golden-ticket-root]',
    '#exit-ticket-app`: absent',
    'legacy CSS scripts loaded by target route: none',
    'legacy UI scripts loaded by target route: none',
    'graph id: `golden-ticket-113`',
    'graph expected points: `350,1;300,1.5;250,2;200,2.5;150,3`',
    'line count was `0` after point 1 and `1` immediately after point 2 before checking',
    'no checkbox',
    'no connect checkbox',
    'no slope-choice controls',
    'completed browser flow produced graph points `350,1` and `150,3`',
  ].forEach((needle) => {
    if (!manifestMd.includes(needle)) fail(`screenshot manifest missing proof text: ${needle}`);
  });
  [
    'implemented-desktop-light-after-graph.png',
    'implemented-mobile-light-after-graph.png',
    'implemented-routing-after-reload.png',
    'DOM Verdict',
    'svg.ge-graph[data-graph-id="golden-ticket-113"]',
  ].forEach((needle) => {
    if (!sideBySide.includes(needle)) fail(`side-by-side proof missing: ${needle}`);
  });
}

function checkRenderedProof(options = {}) {
  const bookRoot = options.bookRoot || DEFAULT_BOOK_ROOT;
  const targetFile = noLegacy.readTarget({ bookRoot }).file;
  const html = fs.readFileSync(targetFile, 'utf8');
  noLegacy.checkHtml(html, { label: rel(targetFile) });

  const screenshots = REQUIRED_SCREENSHOTS.map((name) => {
    const file = path.join(SCREENSHOT_DIR, name);
    return { name, size: assertFile(file), file: rel(file) };
  });
  checkManifestJson(loadManifestJson());
  checkTextProof();

  return {
    ok: true,
    target: rel(targetFile),
    screenshot_count: screenshots.length,
    screenshots,
  };
}

function parseArgs(argv) {
  const args = { bookRoot: DEFAULT_BOOK_ROOT };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--book-root') {
      args.bookRoot = path.resolve(argv[i + 1]);
      i += 1;
    }
  }
  return args;
}

function main() {
  try {
    const result = checkRenderedProof(parseArgs(process.argv.slice(2)));
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  REQUIRED_SCREENSHOTS,
  checkRenderedProof,
  checkManifestJson,
};
