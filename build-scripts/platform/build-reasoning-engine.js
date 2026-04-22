#!/usr/bin/env node
/**
 * build-reasoning-engine.js (flat layout)
 *
 * Generates slim HTML shell files for the Reasoning Game.
 * Reads paragraph info from <MODULE_ROOT>/shared/reasoning/X.Y.Z.js data files
 * and writes HTML shells directly to each paragraph's root folder.
 *
 * Run: MODULE_ROOT="<book-path>" node build-scripts/platform/build-reasoning-engine.js
 */

const fs = require('fs');
const path = require('path');
const { loadConfig } = require('../lib/lib-deploy-config');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '../..');
const CONFIG = loadConfig(MODULE_ROOT);
const REASONING_DIR = path.join(MODULE_ROOT, 'shared', 'reasoning');

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
    <title>${escapeHtml(parName)} – Redeneer-spel</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="${sharedPath}/reasoning.css">
</head>
<body>
<div class="r-app">
    <div class="r-header">
        <a class="back-to-overview" href="index.html">&larr; Terug naar overzicht</a>
        <h1><span class="par-badge">${escapeHtml(parNr)}</span> ${escapeHtml(parName)} – Redeneer-spel</h1>
    </div>

    <div class="r-content-layout">
    <div class="r-main-area">

    <!-- Menu Screen -->
    <div id="r-menu" class="r-screen active">
        <h2 class="r-menu-title">${escapeHtml(parName)}</h2>
        <p class="r-menu-subtitle">Train je redeneervaardigheid. Kies een spelmodus om te beginnen.</p>
        <div class="r-mode-grid" id="r-mode-btns"></div>
        <div class="r-info-box" id="r-structure-info"></div>
    </div>

    <!-- Game Screen -->
    <div id="r-game" class="r-screen">
        <div class="r-game-bar" id="r-game-bar">
            <button class="r-back-btn" id="r-back-btn">← Menu</button>
            <span class="r-mode-badge" id="r-mode-badge"></span>
            <span class="r-round-badge" id="r-round-badge">1/5</span>
        </div>
        <div class="r-problem-box" id="r-problem-box"></div>
        <div id="r-game-content"></div>
        <div class="r-feedback" id="r-feedback">
            <div class="r-feedback-title" id="r-feedback-title"></div>
            <div class="r-feedback-detail" id="r-feedback-detail"></div>
        </div>
        <div class="r-btn-row">
            <button class="r-btn" id="r-check-btn" disabled>Controleer</button>
            <button class="r-btn" id="r-next-btn" style="display:none">Volgende →</button>
        </div>
    </div>

    <!-- Results Screen -->
    <div id="r-results" class="r-screen r-results">
        <div class="r-results-emoji" id="r-results-emoji"></div>
        <h2 class="r-results-title" id="r-results-title"></h2>
        <p class="r-results-score" id="r-results-score"></p>
        <div class="r-progress-bar"><div class="r-progress-fill" id="r-progress-fill"></div></div>
        <div id="r-session-breakdown" class="r-session-breakdown"></div>
        <div class="r-results-btns">
            <button class="r-btn" id="r-replay-btn">Opnieuw (andere opgaven) <i class="fa-solid fa-rotate-right"></i></button>
            <button class="r-btn" id="r-menu-btn" style="background:#64748b">Ander spel →</button>
        </div>
    </div>

    </div><!-- /r-main-area -->

    <div class="r-sidebar" id="r-sidebar">
        <h3 class="r-sidebar-title"><i class="fa-solid fa-gamepad"></i> Deze sessie</h3>
        <div id="r-session-progress" class="r-session-progress"></div>
        <h3 class="r-sidebar-title" style="margin-top:20px"><i class="fa-solid fa-chart-pie"></i> Jouw Voortgang</h3>
        <div id="r-progress-dashboard" class="r-progress-dashboard"></div>
    </div>

    </div><!-- /r-content-layout -->
</div>
<script src="${sharedPath}/theme.js"></script>
<script src="${sharedPath}/reasoning/${parNr}.js"></script>
<script src="${sharedPath}/reasoning/meta-categories.js"></script>
<script src="${sharedPath}/reasoning-engine.js"></script>
<script src="${sharedPath}/reasoning-ui.js"></script>
</body>
</html>`;
}

function main() {
    console.log('Generating Reasoning Game HTML shells...\n');

    if (!fs.existsSync(REASONING_DIR)) {
        console.log('No reasoning data directory — nothing to generate.');
        return;
    }

    const dataFiles = fs.readdirSync(REASONING_DIR)
        .filter(f => f.endsWith('.js') && f !== 'meta-categories.js')
        .map(f => f.replace('.js', ''))
        .sort();

    if (dataFiles.length === 0) {
        console.log('No data files found in shared/reasoning/. Nothing to generate.');
        return;
    }

    console.log(`Found ${dataFiles.length} data files.\n`);

    let success = 0, errors = 0;

    for (const parNr of dataFiles) {
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
        try {
            const shell = generateShell(parNr, p.name);
            const outPath = path.join(found.fullPath, `${parNr} ${p.name} – redeneer-spel.html`);
            fs.writeFileSync(outPath, shell, 'utf8');
            console.log(`  OK: ${parNr} → ${path.relative(MODULE_ROOT, outPath)}`);
            success++;
        } catch (e) {
            console.error(`  ERROR for ${parNr}: ${e.message}`);
            errors++;
        }
    }

    console.log(`\nDone. Success: ${success}, Errors: ${errors}`);
}

main();
