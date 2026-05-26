#!/usr/bin/env node
/**
 * build-exit-ticket-shells.js (flat layout)
 *
 * Generates data files and slim HTML shell files for bounded exit-ticket
 * checkpoint surfaces. Source data lives in source-data/book-N/exit-ticket/.
 *
 * Run: MODULE_ROOT="<book-path>" node build-scripts/platform/build-exit-ticket-shells.js
 */

const fs = require('fs');
const path = require('path');
const { loadConfig } = require('../lib/lib-deploy-config');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const MODULE_ROOT = process.env.MODULE_ROOT
  ? path.resolve(process.env.MODULE_ROOT)
  : path.resolve(__dirname, '../..');
const DASH = '\u2013';
const ExitTicketEngine = require('../../engines/exit-ticket-engine');

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeDataFile(config, parNr, data) {
  const targetDataDir = path.join(config.moduleRoot, 'shared', 'exit-ticket');
  fs.mkdirSync(targetDataDir, { recursive: true });
  const body = [
    '// AUTO-GENERATED FROM 4veco-platform/source-data/book-' + config.nr + '/exit-ticket/' + parNr + '.json -- DO NOT EDIT HERE',
    '(function (root) {',
    '  root.EXIT_TICKET_DATA = ' + JSON.stringify(data, null, 2).replace(/\n/g, '\n  ') + ';',
    "  if (typeof module !== 'undefined' && module.exports) module.exports = root.EXIT_TICKET_DATA;",
    "})(typeof self !== 'undefined' ? self : this);",
    ''
  ].join('\n');
  fs.writeFileSync(path.join(targetDataDir, `${parNr}.js`), body, 'utf8');
}

function generateShell(parNr, parName) {
  const sharedPath = '../../shared';
  const title = `${parName} - Korte check`;

  return `<!DOCTYPE html>
<html lang="nl" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${sharedPath}/skill-map-route.css">
    <link rel="stylesheet" href="${sharedPath}/exit-ticket.css">
    <script>(function(){try{var m=localStorage.getItem('quizMode')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',m);}catch(e){}})();</script>
</head>
<body>
    <header class="et-topbar">
        <a class="et-back" href="index.html">&larr; Overzicht</a>
        <strong>&sect;${escapeHtml(parNr)} ${escapeHtml(parName)}</strong>
        <button type="button" class="et-theme-toggle" id="theme-toggle" aria-label="Licht/donker wisselen">Donkere modus</button>
    </header>
    <main class="et-page" id="exit-ticket-app"></main>
    <script src="${sharedPath}/theme.js"></script>
    <script src="${sharedPath}/skill-map-engine.js"></script>
    <script src="${sharedPath}/skilltree/base-elements.js"></script>
    <script src="${sharedPath}/skilltree/${parNr}.js"></script>
    <script src="${sharedPath}/skill-map-route-ui.js"></script>
    <script src="${sharedPath}/exit-ticket/${parNr}.js"></script>
    <script src="${sharedPath}/exit-ticket-engine.js"></script>
    <script src="${sharedPath}/exit-ticket-ui.js"></script>
</body>
</html>`;
}

function main() {
  const config = loadConfig(MODULE_ROOT);
  const sourceDir = path.join(PLATFORM_ROOT, 'source-data', `book-${config.nr}`, 'exit-ticket');
  if (!fs.existsSync(sourceDir)) {
    console.log(`No exit-ticket source data directory at ${path.relative(PLATFORM_ROOT, sourceDir)} - nothing to generate.`);
    return;
  }

  const sourceFiles = fs.readdirSync(sourceDir).filter(f => f.endsWith('.json')).sort();
  console.log(`Found ${sourceFiles.length} exit-ticket source file(s)\n`);

  let generated = 0;
  let errors = 0;

  for (const file of sourceFiles) {
    const parNr = file.replace(/\.json$/, '');
    const p = config.paragraphIndex[parNr];
    if (!p) {
      console.warn(`  [skip] ${parNr}: not declared in manifest`);
      continue;
    }
    const found = config.findParagraphFolder(parNr);
    if (!found) {
      console.error(`  [error] ${parNr}: paragraph folder not found on disk`);
      errors++;
      continue;
    }

    const sourcePath = path.join(sourceDir, file);
    const data = readJson(sourcePath);
    try {
      ExitTicketEngine.validateData(data);
    } catch (error) {
      console.error(`  [error] ${parNr}: ${error.message}`);
      errors++;
      continue;
    }

    writeDataFile(config, parNr, data);
    const fileName = `${parNr} ${p.name} ${DASH} exit-ticket.html`;
    const filePath = path.join(found.fullPath, fileName);
    fs.writeFileSync(filePath, generateShell(parNr, p.name), 'utf8');
    console.log(`  [write] shared/exit-ticket/${parNr}.js`);
    console.log(`  [write] ${fileName}`);
    generated++;
  }

  console.log(`\nDone: ${generated} generated, ${errors} errors`);
  if (errors > 0) process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = {
  generateShell,
  main
};
