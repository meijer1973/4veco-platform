#!/usr/bin/env node
/**
 * build-newsdetective-shells.js
 *
 * Generates slim HTML shell files for the Nieuws-detective game.
 * Reads paragraph info from shared/newsdetective/*.js data files
 * and writes HTML shells to each paragraph's 1. Voorbereiden/ folder.
 *
 * Run: node build-scripts/build-newsdetective-shells.js
 *
 * HOW TO ADAPT:
 * - Add new paragraphs by creating their data file in shared/newsdetective/X.Y.Z.js
 * - Re-run this script to generate the HTML shell
 */

const fs = require('fs');
const path = require('path');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '..');
const DATA_DIR = path.join(MODULE_ROOT, 'shared', 'newsdetective');

// Paragraph name lookup (walks directory tree)
function findParagraphInfo(parNr) {
    function walk(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory() && entry.name.startsWith(parNr + ' ')) {
                const parDir = path.join(dir, entry.name);
                const voorbereidenDir = path.join(parDir, '1. Voorbereiden');
                // Extract name: "3.1.1 Paragraaf 1 - Markt en marktstructuur" → "Markt en marktstructuur"
                const nameMatch = entry.name.match(/- (.+)$/);
                const parName = nameMatch ? nameMatch[1] : parNr;
                return { parDir, voorbereidenDir, parName };
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
    // Path from 1. Voorbereiden/ to shared/ (3 levels up)
    // Structure: 3.X Hoofdstuk / 3.X.Y Paragraaf / 1. Voorbereiden / file.html
    const sharedPath = '../../../shared';

    return `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(parName)} \u2013 Nieuws-detective</title>
    <link rel="stylesheet" href="${sharedPath}/newsdetective.css">
</head>
<body>
<div class="nd-app" id="nd-app"></div>

<script src="${sharedPath}/theme.js"></script>
<script src="${sharedPath}/newsdetective/${parNr}.js"></script>
<script src="${sharedPath}/newsdetective-engine.js"></script>
<script src="${sharedPath}/newsdetective-ui.js"></script>
</body>
</html>`;
}

// ── Main ────────────────────────────────────────────────────────────

function main() {
    if (!fs.existsSync(DATA_DIR)) {
        console.error('Data directory not found:', DATA_DIR);
        process.exit(1);
    }

    const dataFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.js')).sort();
    console.log(`Found ${dataFiles.length} data file(s)\n`);

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

        // Ensure 1. Voorbereiden/ exists
        if (!fs.existsSync(info.voorbereidenDir)) {
            fs.mkdirSync(info.voorbereidenDir, { recursive: true });
            console.log(`  [mkdir] ${info.voorbereidenDir}`);
        }

        const fileName = `${parNr} ${info.parName} \u2013 nieuws-detective.html`;
        const filePath = path.join(info.voorbereidenDir, fileName);
        const html = generateShell(parNr, info.parName);

        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`  [write] ${fileName}`);
        generated++;
    }

    console.log(`\nDone: ${generated} generated, ${errors} errors`);
}

main();
