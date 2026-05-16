#!/usr/bin/env node
/**
 * build-newsdetective-shells.js (flat layout)
 *
 * Generates slim HTML shell files for the Nieuws-detective game.
 * Reads paragraph info from <MODULE_ROOT>/shared/newsdetective/X.Y.Z.js data
 * files and writes HTML shells directly to each paragraph's root folder.
 *
 * Run: MODULE_ROOT="<book-path>" node build-scripts/platform/build-newsdetective-shells.js
 */

const fs = require('fs');
const path = require('path');
const { loadConfig } = require('../lib/lib-deploy-config');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '../..');
const CONFIG = loadConfig(MODULE_ROOT);
const DATA_DIR = path.join(MODULE_ROOT, 'shared', 'newsdetective');

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateShell(parNr, parName) {
    // Flat layout: paragraph root → shared/ is 2 levels up.
    const sharedPath = '../../shared';

    return `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(parName)} – Nieuws-detective</title>
    <link rel="stylesheet" href="${sharedPath}/newsdetective.css">
</head>
<body>
<a class="back-to-overview" href="index.html">&larr; Terug naar overzicht</a>
<div class="nd-app" id="nd-app"></div>

<script src="${sharedPath}/theme.js"></script>
<script src="${sharedPath}/newsdetective/${parNr}.js"></script>
<script src="${sharedPath}/adaptive-seam.js"></script>
<script src="${sharedPath}/newsdetective-engine.js"></script>
<script src="${sharedPath}/newsdetective-ui.js"></script>
</body>
</html>`;
}

function main() {
    if (!fs.existsSync(DATA_DIR)) {
        console.log('No newsdetective data directory — nothing to generate.');
        return;
    }

    const dataFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.js')).sort();
    console.log(`Found ${dataFiles.length} newsdetective data file(s)\n`);

    let generated = 0, errors = 0;

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

        const fileName = `${parNr} ${p.name} – nieuws-detective.html`;
        const filePath = path.join(found.fullPath, fileName);
        fs.writeFileSync(filePath, generateShell(parNr, p.name), 'utf8');
        console.log(`  [write] ${fileName}`);
        generated++;
    }

    console.log(`\nDone: ${generated} generated, ${errors} errors`);
}

main();
