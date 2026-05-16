#!/usr/bin/env node
/**
 * build-graphical-shells.js (flat layout)
 *
 * Generates slim HTML shell files for the Grafiekenspel MVP.
 * Reads data from <MODULE_ROOT>/shared/graphical/X.Y.Z.js and writes a shell
 * to each paragraph root.
 *
 * Run: MODULE_ROOT="<book-path>" node build-scripts/platform/build-graphical-shells.js
 */

const fs = require('fs');
const path = require('path');
const { loadConfig } = require('../lib/lib-deploy-config');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '../..');
const CONFIG = loadConfig(MODULE_ROOT);
const DATA_DIR = path.join(MODULE_ROOT, 'shared', 'graphical');
const DASH = '\u2013';

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function generateShell(parNr, parName) {
    const sharedPath = '../../shared';
    const title = `${parName} - Grafiekenspel`;

    return `<!DOCTYPE html>
<html lang="nl" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${sharedPath}/graphical.css">
    <script>(function(){try{var m=localStorage.getItem('quizMode')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',m);}catch(e){}})();</script>
</head>
<body>
    <header class="g-topbar">
        <a class="g-back" href="index.html">&larr; Overzicht</a>
        <strong>&sect;${escapeHtml(parNr)} ${escapeHtml(parName)}</strong>
        <button type="button" class="g-theme-toggle" id="theme-toggle" aria-label="Licht/donker wisselen">Donkere modus</button>
    </header>
    <div id="g-app"></div>
    <script src="${sharedPath}/theme.js"></script>
    <script src="${sharedPath}/graphical/${parNr}.js"></script>
    <script src="${sharedPath}/adaptive-seam.js"></script>
    <script src="${sharedPath}/graphical-engine.js"></script>
    <script src="${sharedPath}/graphical-ui.js"></script>
</body>
</html>`;
}

function main() {
    if (!fs.existsSync(DATA_DIR)) {
        console.log('No graphical data directory - nothing to generate.');
        return;
    }

    const dataFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.js')).sort();
    console.log(`Found ${dataFiles.length} graphical data file(s)\n`);

    let generated = 0;
    let errors = 0;

    for (const file of dataFiles) {
        const parNr = file.replace('.js', '');
        const p = CONFIG.paragraphIndex[parNr];
        if (!p) {
            console.warn(`  [skip] ${parNr}: not declared in manifest`);
            continue;
        }
        const found = CONFIG.findParagraphFolder(parNr);
        if (!found) {
            console.error(`  [error] ${parNr}: paragraph folder not found on disk`);
            errors++;
            continue;
        }

        const fileName = `${parNr} ${p.name} ${DASH} grafiekenspel.html`;
        const filePath = path.join(found.fullPath, fileName);
        fs.writeFileSync(filePath, generateShell(parNr, p.name), 'utf8');
        console.log(`  [write] ${fileName}`);
        generated++;
    }

    console.log(`\nDone: ${generated} generated, ${errors} errors`);
    if (errors > 0) process.exit(1);
}

main();
