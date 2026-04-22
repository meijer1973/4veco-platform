#!/usr/bin/env node
/**
 * build-procedure-shells.js (flat layout)
 *
 * Generates slim HTML shell files for the Stappenplan (procedure practice) game.
 * Reads paragraph info from <MODULE_ROOT>/shared/procedure/X.Y.Z.js data files
 * and writes HTML shells directly to each paragraph's root folder.
 *
 * Run: MODULE_ROOT="<book-path>" node build-scripts/platform/build-procedure-shells.js
 */

const fs = require('fs');
const path = require('path');
const { loadConfig } = require('../lib/lib-deploy-config');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '../..');
const CONFIG = loadConfig(MODULE_ROOT);
const DATA_DIR = path.join(MODULE_ROOT, 'shared', 'procedure');

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
    <title>${escapeHtml(parName)} – Stappenplan</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="${sharedPath}/procedure.css">
</head>
<body>
<div class="p-app">
    <div class="p-header">
        <h1><span class="par-badge">${escapeHtml(parNr)}</span> ${escapeHtml(parName)} – Stappenplan</h1>
    </div>

    <div class="p-content-layout">
    <div class="p-main-area">

    <!-- Menu Screen -->
    <div id="p-menu" class="p-screen active">
        <h2 class="p-menu-title">Stappenplannen oefenen</h2>
        <p class="p-menu-subtitle">Kies een procedure en bouw het stappenplan op. De eerste en laatste stap zijn gegeven — jij kiest de tussenstappen.</p>
        <div class="p-procedure-grid" id="p-procedure-grid"></div>
    </div>

    <!-- Game Screen -->
    <div id="p-game" class="p-screen">
        <div class="p-game-bar">
            <button class="p-back-btn" id="p-back-btn">← Menu</button>
            <span class="p-game-title" id="p-game-title"></span>
            <span class="p-step-counter" id="p-step-counter">0/0 gekozen</span>
        </div>
        <div class="p-pipeline-wrapper">
            <div class="p-pipeline" id="p-pipeline"></div>
        </div>
        <div class="p-btn-row">
            <button class="p-btn" id="p-check-btn" disabled><i class="fa-solid fa-check-double"></i> Controleer</button>
            <button class="p-btn" id="p-next-btn" style="display:none"><i class="fa-solid fa-arrow-right"></i> Bekijk resultaat</button>
        </div>
    </div>

    <!-- Results Screen -->
    <div id="p-results" class="p-screen p-results">
        <div class="p-results-emoji" id="p-results-emoji"></div>
        <h2 class="p-results-title" id="p-results-title"></h2>
        <p class="p-results-score" id="p-results-score"></p>
        <div class="p-results-bar"><div class="p-results-fill" id="p-results-fill"></div></div>
        <div class="p-results-detail" id="p-results-detail"></div>
        <div class="p-btn-row">
            <button class="p-btn" id="p-replay-btn"><i class="fa-solid fa-rotate-right"></i> Opnieuw proberen</button>
            <button class="p-btn p-btn-secondary" id="p-menu-btn">Ander stappenplan →</button>
        </div>
    </div>

    </div><!-- /p-main-area -->

    <div class="p-sidebar">
        <h3 class="p-sidebar-title"><i class="fa-solid fa-list-check"></i> Stappenplannen</h3>
        <ul class="p-sidebar-list" id="p-sidebar-list"></ul>
    </div>

    </div><!-- /p-content-layout -->
</div>
<script src="${sharedPath}/theme.js"></script>
<script src="${sharedPath}/procedure/${parNr}.js"></script>
<script src="${sharedPath}/procedure-engine.js"></script>
<script src="${sharedPath}/procedure-ui.js"></script>
</body>
</html>`;
}

function main() {
    if (!fs.existsSync(DATA_DIR)) {
        console.log('No procedure data directory — nothing to generate.');
        return;
    }

    const dataFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.js')).sort();
    console.log(`Found ${dataFiles.length} procedure data file(s)\n`);

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

        const fileName = `${parNr} ${p.name} – stappenplan.html`;
        const filePath = path.join(found.fullPath, fileName);
        fs.writeFileSync(filePath, generateShell(parNr, p.name), 'utf8');
        console.log(`  [write] ${fileName}`);
        generated++;
    }

    console.log(`\nDone: ${generated} generated, ${errors} errors`);
}

main();
