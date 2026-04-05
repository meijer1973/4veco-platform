#!/usr/bin/env node
/**
 * check-links.js — Verify all internal links and shared resource references
 * within the quiz HTML files. Runs locally (no HTTP server needed).
 *
 * Usage: node scripts/check-links.js
 */

const fs = require('fs');
const path = require('path');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '..');

let errors = 0;
let checked = 0;

function findHtmlFiles(dir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...findHtmlFiles(full));
        } else if (entry.name.endsWith('.html')) {
            results.push(full);
        }
    }
    return results;
}

function checkFile(htmlPath) {
    const content = fs.readFileSync(htmlPath, 'utf8');
    const dir = path.dirname(htmlPath);
    const rel = path.relative(MODULE_ROOT, htmlPath);

    // Find all src="..." and href="..." references (local only)
    const refRegex = /(?:src|href)="([^"]+)"/g;
    let match;
    while ((match = refRegex.exec(content)) !== null) {
        const ref = match[1];
        // Skip external URLs, anchors, javascript:, and false positives from inline JS
        if (ref.startsWith('http://') || ref.startsWith('https://') || ref.startsWith('#') || ref.startsWith('javascript:') || ref.startsWith('mailto:') || ref.startsWith('data:')) continue;
        if (ref.includes('encodeURIComponent') || ref.includes('document.') || ref.includes('function') || ref.trim().startsWith('+')) continue;

        // Decode URL-encoded characters (e.g. %20 → space, %E2%80%93 → –)
        const decoded = decodeURIComponent(ref);
        const resolved = path.resolve(dir, decoded);
        checked++;

        if (!fs.existsSync(resolved)) {
            console.error(`  ✗ BROKEN: ${rel} → ${ref}`);
            console.error(`    Expected at: ${resolved}`);
            errors++;
        }
    }
}

// ── Reachability check ──────────────────────────────────────────────
// Verifies that interactive HTML files in content folders (instapquiz,
// redeneer-spel, youtube-videos, etc.) are linked from their paragraph's
// index.html. Catches the case where a file exists but no user can reach it.

function checkReachability() {
    let reachErrors = 0;

    // Find all interactive HTML files in paragraph subfolders
    const interactiveFiles = findHtmlFiles(MODULE_ROOT).filter(f => {
        const rel = path.relative(MODULE_ROOT, f);
        const name = path.basename(f);
        // Skip index.html files and navigation pages
        if (name === 'index.html') return false;
        // Only check files inside numbered paragraph folders (e.g. "3.1.1 ...")
        return /\d+\.\d+\.\d+/.test(rel) && !rel.includes('node_modules');
    });

    for (const file of interactiveFiles) {
        const fileName = path.basename(file);
        const fileDir = path.dirname(file);

        // Walk up to find the paragraph index.html
        // Interactive files are in subfolders like "1. Voorbereiden/", "3. Oefenen/", etc.
        const parDir = path.dirname(fileDir); // go up from e.g. "3. Oefenen" to paragraph root
        const parIndex = path.join(parDir, 'index.html');

        if (!fs.existsSync(parIndex)) continue; // no index.html to check against

        const indexContent = fs.readFileSync(parIndex, 'utf8');

        // Check if the file is referenced anywhere in the index.
        // Links use URL-encoding: spaces → %20, en-dash → %E2%80%93, etc.
        const fullyEncoded = encodeURIComponent(fileName);
        const found = indexContent.includes(fullyEncoded)
            || indexContent.includes(fileName)
            || indexContent.includes(fileName.replace(/ /g, '%20'));
        if (!found) {
            const rel = path.relative(MODULE_ROOT, file);
            const indexRel = path.relative(MODULE_ROOT, parIndex);
            console.error(`  ✗ UNREACHABLE: ${rel}`);
            console.error(`    Not linked from: ${indexRel}`);
            console.error(`    Users cannot navigate to this file.`);
            reachErrors++;
        }
    }

    return reachErrors;
}

// Main
console.log('Checking local file references in all HTML files...\n');

const htmlFiles = findHtmlFiles(MODULE_ROOT);
console.log(`Found ${htmlFiles.length} HTML files.\n`);

for (const file of htmlFiles) {
    checkFile(file);
}

console.log(`\nChecked ${checked} references across ${htmlFiles.length} files.`);

if (errors > 0) {
    console.error(`\n✗ Found ${errors} broken references.`);
}

// Run reachability check
console.log('\nChecking reachability of interactive files...\n');
const reachErrors = checkReachability();

if (reachErrors > 0) {
    console.error(`\n✗ Found ${reachErrors} unreachable file(s). Add links from the paragraph index.html.`);
}

const totalErrors = errors + reachErrors;
if (totalErrors > 0) {
    process.exit(1);
} else {
    console.log('\n✓ All local references are valid.');
    console.log('✓ All interactive files are reachable from navigation.');
    process.exit(0);
}
