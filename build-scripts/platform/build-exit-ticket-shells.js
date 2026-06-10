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
const GoldenTicketLayout = require('../../engines/golden-ticket-layout');

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

function surfaceSlug(data) {
  if (data && data.surface === 'target_equivalent_exit_ticket') return 'exit-ticket';
  return 'korte-check';
}

function surfaceTitle(data) {
  if (data && data.title) return data.title;
  return surfaceSlug(data) === 'exit-ticket' ? 'Exit ticket' : 'Korte check';
}

function usesGoldenExerciseWorkbench(data) {
  return Boolean(
    data &&
    data.layout &&
    data.layout.framework === 'golden_exercise_workbench'
  );
}

function assertSupportedGoldenExerciseVariant(data) {
  return GoldenTicketLayout.assertSupportedGoldenExerciseVariant(data);
}

function goldenExerciseRendererFor(data) {
  if (!usesGoldenExerciseWorkbench(data)) return null;
  return {
    id: assertSupportedGoldenExerciseVariant(data),
    renderShell: generateGoldenTicketShell,
  };
}

function usesGoldenTicketLayout(data) {
  return Boolean(goldenExerciseRendererFor(data));
}

function writeDataFile(config, sourceKey, data) {
  const targetDataDir = path.join(config.moduleRoot, 'shared', 'exit-ticket');
  fs.mkdirSync(targetDataDir, { recursive: true });
  const body = [
    '// AUTO-GENERATED FROM 4veco-platform/source-data/book-' + config.nr + '/exit-ticket/' + sourceKey + '.json -- DO NOT EDIT HERE',
    '(function (root) {',
    '  root.EXIT_TICKET_DATA = ' + JSON.stringify(data, null, 2).replace(/\n/g, '\n  ') + ';',
    "  if (typeof module !== 'undefined' && module.exports) module.exports = root.EXIT_TICKET_DATA;",
    "})(typeof self !== 'undefined' ? self : this);",
    ''
  ].join('\n');
  fs.writeFileSync(path.join(targetDataDir, `${sourceKey}.js`), body, 'utf8');
}

function generateShell(parNr, parName, data = null, sourceKey = parNr) {
  const goldenRenderer = goldenExerciseRendererFor(data);
  if (goldenRenderer) {
    return goldenRenderer.renderShell(parNr, parName, data, sourceKey);
  }
  const sharedPath = '../../shared';
  const title = `${parName} - ${surfaceTitle(data)}`;

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
    <link rel="stylesheet" href="${sharedPath}/task-shell.css">
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
    <script src="${sharedPath}/task-shell-engine.js"></script>
    <script src="${sharedPath}/task-shell-ui.js"></script>
    <script src="${sharedPath}/exit-ticket/${escapeHtml(sourceKey)}.js"></script>
    <script src="${sharedPath}/exit-ticket-engine.js"></script>
    <script src="${sharedPath}/exit-ticket-ui.js"></script>
</body>
</html>`;
}

function generateGoldenTicketShell(parNr, parName, data, sourceKey) {
  const sharedPath = '../../shared';
  const title = `${parName} - ${surfaceTitle(data)}`;
  const main = GoldenTicketLayout.renderMain(data);

  return `<!DOCTYPE html>
<html lang="nl" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${sharedPath}/golden-ticket-layout.css">
    <script>(function(){try{var m=localStorage.getItem('quizMode')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',m);}catch(e){}})();</script>
</head>
<body>
    <header class="ge-topbar">
        <a class="ge-back" href="index.html">&larr; Overzicht</a>
        <strong>&sect;${escapeHtml(parNr)} ${escapeHtml(parName)}</strong>
        <button type="button" class="ge-theme-toggle" id="theme-toggle" aria-label="Licht/donker wisselen">Donkere modus</button>
    </header>
    <main class="ge-page" data-golden-ticket-root data-source-key="${escapeHtml(sourceKey)}">
${main}
    </main>
    <script src="${sharedPath}/exit-ticket/${escapeHtml(sourceKey)}.js"></script>
    <script src="${sharedPath}/golden-ticket-graph.js"></script>
    <script src="${sharedPath}/golden-ticket-layout.js"></script>
</body>
</html>`;
}

function cleanGeneratedCheckPages(folderPath) {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    if (/\u2013 (?:exit-ticket|korte-check|afsluitcheck)\.html$/i.test(file)) {
      fs.unlinkSync(path.join(folderPath, file));
      console.log(`  [clean] ${file}`);
    }
  }
}

function cleanGeneratedDataFiles(config) {
  const targetDataDir = path.join(config.moduleRoot, 'shared', 'exit-ticket');
  if (!fs.existsSync(targetDataDir)) return;
  for (const file of fs.readdirSync(targetDataDir)) {
    if (/\.js$/i.test(file)) {
      fs.unlinkSync(path.join(targetDataDir, file));
      console.log(`  [clean] shared/exit-ticket/${file}`);
    }
  }
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

  const cleaned = {};
  const seenSurface = {};
  cleanGeneratedDataFiles(config);

  for (const file of sourceFiles) {
    const sourceKey = file.replace(/\.json$/, '');
    const sourcePath = path.join(sourceDir, file);
    const data = readJson(sourcePath);
    const parNr = data.parNr;
    if (!parNr) {
      console.error(`  [error] ${sourceKey}: source data needs parNr`);
      errors++;
      continue;
    }
    const p = config.paragraphIndex[parNr];
    if (!p) {
      console.warn(`  [skip] ${sourceKey}: ${parNr} not declared in manifest`);
      continue;
    }
    const found = config.findParagraphFolder(parNr);
    if (!found) {
      console.error(`  [error] ${parNr}: paragraph folder not found on disk`);
      errors++;
      continue;
    }

    try {
      ExitTicketEngine.validateData(data);
    } catch (error) {
      console.error(`  [error] ${sourceKey}: ${error.message}`);
      errors++;
      continue;
    }

    const slug = surfaceSlug(data);
    const surfaceKey = `${parNr}:${slug}`;
    if (seenSurface[surfaceKey]) {
      console.error(`  [error] duplicate ${slug} source for ${parNr}: ${seenSurface[surfaceKey]} and ${sourceKey}`);
      errors++;
      continue;
    }
    seenSurface[surfaceKey] = sourceKey;

    const fileName = `${parNr} ${p.name} ${DASH} ${slug}.html`;
    let shellHtml;
    try {
      shellHtml = generateShell(parNr, p.name, data, sourceKey);
    } catch (error) {
      console.error(`  [error] ${sourceKey}: ${error.message}`);
      errors++;
      continue;
    }

    if (!cleaned[parNr]) {
      cleanGeneratedCheckPages(found.fullPath);
      cleaned[parNr] = true;
    }

    writeDataFile(config, sourceKey, data);
    const filePath = path.join(found.fullPath, fileName);
    fs.writeFileSync(filePath, shellHtml, 'utf8');
    console.log(`  [write] shared/exit-ticket/${sourceKey}.js`);
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
  generateGoldenTicketShell,
  goldenExerciseRendererFor,
  assertSupportedGoldenExerciseVariant,
  surfaceSlug,
  usesGoldenExerciseWorkbench,
  usesGoldenTicketLayout,
  main
};
