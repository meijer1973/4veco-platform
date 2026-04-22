#!/usr/bin/env node
/**
 * reskin-vaardigheden.js — Migrate `uitleg vaardigheden.html` files from
 * per-page inline <style>/<script> to the shared editorial voorkennis.css/js
 * token system. Idempotent: running twice on the same file is a no-op.
 *
 * What it does, per file:
 *  1. Detect the paragraph's chapter-theme color from `--<name>-primary: #xxxxxx`
 *     in the inline <style> block. Map that color to one of the three
 *     voorkennis domain classes:
 *         navy  #1A5276  → `wiskunde`
 *         amber #E67E22  → `economisch`
 *         green #1E8449  → `grafisch`
 *  2. Strip the inline <style> and inline <script> blocks.
 *  3. Add <link rel="stylesheet" href="../../../shared/voorkennis.css"> and
 *     set <html data-theme="light"> + a pre-paint script to restore the saved
 *     theme from localStorage.quizMode.
 *  4. Rename every `domain-*`, `bg-*`, `border-*`, `badge-*`, `card-*`,
 *     `caption-*` class in the body to the mapped voorkennis name.
 *  5. Append <script src="../../../shared/voorkennis.js"></script> before </body>.
 *
 * Run:
 *   node build-scripts/platform/reskin-vaardigheden.js <module-dir>
 *   node build-scripts/platform/reskin-vaardigheden.js "../3-Module-3-rewire-test"
 */

'use strict';

const fs = require('fs');
const path = require('path');

const target = process.argv[2];
if (!target) {
    console.error('Usage: node reskin-vaardigheden.js <module-dir>');
    process.exit(1);
}
const MODULE_ROOT = path.resolve(target);
if (!fs.existsSync(MODULE_ROOT)) {
    console.error(`Target does not exist: ${MODULE_ROOT}`);
    process.exit(1);
}

// ── Find all uitleg-vaardigheden HTML files ──────────────────────
function findFiles(root) {
    const out = [];
    (function walk(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith('uitleg vaardigheden.html')) out.push(full);
        }
    })(root);
    return out;
}

// ── Color → voorkennis domain mapping ────────────────────────────
const COLOR_MAP = {
    '#1a5276': 'wiskunde',
    '#e67e22': 'economisch',
    '#1e8449': 'grafisch',
};

function detectDomain(styleBlock) {
    const match = styleBlock.match(/--[a-z-]+-primary:\s*#([0-9A-Fa-f]{6})/);
    if (!match) return null;
    const hex = ('#' + match[1]).toLowerCase();
    return COLOR_MAP[hex] || null;
}

// ── One-file transform ───────────────────────────────────────────
// Flat layout: paragraph root → shared/ is 2 levels up.
const SHARED_LINK = '<link rel="stylesheet" href="../../shared/voorkennis.css">';
const PREPAINT = "<script>(function(){try{var m=localStorage.getItem('quizMode')||'light';document.documentElement.setAttribute('data-theme',m);}catch(e){}})();</script>";
const SHARED_SCRIPT = '<script src="../../shared/voorkennis.js"></script>';

function transformOne(file) {
    let src = fs.readFileSync(file, 'utf8');

    // Already migrated — skip.
    if (src.includes('shared/voorkennis.css') || src.includes('shared/vaardigheden.css')) {
        return { status: 'skipped (already migrated)', domain: null };
    }

    // 1. Detect theme color from the inline <style> block.
    const styleMatch = src.match(/<style[\s\S]*?<\/style>/i);
    const domain = styleMatch ? detectDomain(styleMatch[0]) : null;
    if (!domain) {
        return { status: 'skipped (no detectable chapter color)', domain: null };
    }

    // 2. Strip inline <style>.
    src = src.replace(/<style[\s\S]*?<\/style>\s*/i, '');

    // 3. Strip trailing inline <script> (after </main>/</body>).
    // The script block is always at the very end, before </body>. It's the
    // only <script> tag in the file.
    src = src.replace(/<script>[\s\S]*?<\/script>\s*/i, '');

    // 4. Add <link> + pre-paint script in <head>.
    src = src.replace(/<head>/i, `<head>\n${PREPAINT}\n${SHARED_LINK}`);

    // 5. Set <html lang="nl"> → <html lang="nl" data-theme="light">.
    src = src.replace(/<html\s+lang="nl">/i, '<html lang="nl" data-theme="light">');

    // 6. Rename all domain-*, bg-*, border-*, badge-*, card-*, caption-* to
    //    the mapped voorkennis name. We match any alphabetic suffix so that
    //    per-paragraph coined names (domain-markt, domain-bedrijf, etc.) all
    //    collapse onto the three voorkennis domains.
    const prefixes = ['domain', 'bg', 'border', 'badge', 'card', 'caption'];
    for (const prefix of prefixes) {
        const re = new RegExp(`\\b${prefix}-[a-z]+\\b`, 'g');
        src = src.replace(re, `${prefix}-${domain}`);
    }

    // 7. Append <script> before </body>.
    src = src.replace(/<\/body>/i, `${SHARED_SCRIPT}\n</body>`);

    fs.writeFileSync(file, src, 'utf8');
    return { status: 'migrated', domain };
}

// ── Main ─────────────────────────────────────────────────────────
function main() {
    const files = findFiles(MODULE_ROOT);
    console.log(`Found ${files.length} uitleg-vaardigheden HTML files.\n`);

    const stats = { migrated: 0, skipped: 0, errors: 0 };
    for (const f of files) {
        try {
            const r = transformOne(f);
            const rel = path.relative(MODULE_ROOT, f);
            if (r.status === 'migrated') {
                console.log(`  OK  [${r.domain}] ${rel}`);
                stats.migrated++;
            } else {
                console.log(`  SKIP ${r.status} ${rel}`);
                stats.skipped++;
            }
        } catch (e) {
            console.error(`  ERR ${path.relative(MODULE_ROOT, f)}: ${e.message}`);
            stats.errors++;
        }
    }
    console.log(`\nDone. migrated=${stats.migrated} skipped=${stats.skipped} errors=${stats.errors}`);
}

main();
