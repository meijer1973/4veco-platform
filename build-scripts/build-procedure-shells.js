#!/usr/bin/env node
/**
 * build-procedure-shells.js
 *
 * Generates slim HTML shell files for the Stappenplan (procedure practice) game.
 * Reads paragraph info from shared/procedure/*.js data files
 * and writes HTML shells to each paragraph's 2. Leren/ folder.
 *
 * Run: node build-scripts/build-procedure-shells.js
 *
 * HOW TO ADAPT:
 * - Add new paragraphs by creating their data file in shared/procedure/X.Y.Z.js
 * - Re-run this script to generate the HTML shell
 */

const fs = require('fs');
const path = require('path');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '..');
const DATA_DIR = path.join(MODULE_ROOT, 'shared', 'procedure');

// Paragraph name lookup (walks directory tree)
function findParagraphInfo(parNr) {
    function walk(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory() && entry.name.startsWith(parNr + ' ')) {
                const parDir = path.join(dir, entry.name);
                const lerenDir = path.join(parDir, '2. Leren');
                // Extract name: "3.2.5 Paragraaf 5 - Monopolistische concurrentie" → "Monopolistische concurrentie"
                const nameMatch = entry.name.match(/- (.+)$/);
                const parName = nameMatch ? nameMatch[1] : parNr;
                return { parDir, lerenDir, parName };
            }
            if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.startsWith('node_') && !entry.name.startsWith('shared')) {
                const result = walk(path.join(dir, entry.name));
                if (result) return result;
            }
        }
        return null;
    }
    return walk(MODULE_ROOT);
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateShell(parNr, parName) {
    // Path from 2. Leren/ to shared/ (3 levels up)
    // Structure: 3.X Hoofdstuk / 3.X.Y Paragraaf / 2. Leren / file.html
    const sharedPath = '../../../shared';

    return `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(parName)} \u2013 Stappenplan</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="${sharedPath}/procedure.css">
</head>
<body>
<div class="p-app">
    <div class="p-header">
        <h1><span class="par-badge">${escapeHtml(parNr)}</span> ${escapeHtml(parName)} \u2013 Stappenplan</h1>
    </div>

    <div class="p-content-layout">
    <div class="p-main-area">

    <!-- Menu Screen -->
    <div id="p-menu" class="p-screen active">
        <h2 class="p-menu-title">Stappenplannen oefenen</h2>
        <p class="p-menu-subtitle">Kies een procedure en bouw het stappenplan op. De eerste en laatste stap zijn gegeven \u2014 jij kiest de tussenstappen.</p>
        <div class="p-procedure-grid" id="p-procedure-grid"></div>
    </div>

    <!-- Game Screen -->
    <div id="p-game" class="p-screen">
        <div class="p-game-bar">
            <button class="p-back-btn" id="p-back-btn">\u2190 Menu</button>
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
            <button class="p-btn p-btn-secondary" id="p-menu-btn">Ander stappenplan \u2192</button>
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

// ── Main ────────────────────────────────────────────────────────────

function main() {
    if (!fs.existsSync(DATA_DIR)) {
        console.log('No procedure data directory found — skipping.');
        return;
    }

    const dataFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.js')).sort();
    console.log(`Found ${dataFiles.length} procedure data file(s)\n`);

    let generated = 0;
    let errors = 0;

    for (const file of dataFiles) {
        const parNr = file.replace('.js', '');
        const info = findParagraphInfo(parNr);

        if (!info) {
            console.error(`  [ERROR] Paragraph directory not found for ${parNr}`);
            errors++;
            continue;
        }

        // Ensure 2. Leren/ exists
        if (!fs.existsSync(info.lerenDir)) {
            fs.mkdirSync(info.lerenDir, { recursive: true });
            console.log(`  [mkdir] ${info.lerenDir}`);
        }

        const fileName = `${parNr} ${info.parName} \u2013 stappenplan.html`;
        const filePath = path.join(info.lerenDir, fileName);
        const html = generateShell(parNr, info.parName);

        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`  [write] ${fileName}`);
        generated++;
    }

    console.log(`\nDone: ${generated} generated, ${errors} errors`);
}

main();
