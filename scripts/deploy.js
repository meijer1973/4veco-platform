#!/usr/bin/env node
/**
 * deploy.js — Deploy engines and generated content to a module repo.
 *
 * Copies engine files, runs build scripts, and verifies the result.
 *
 * Usage:
 *   node scripts/deploy.js <target-book-path>
 *   node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
 *
 * The target must contain a deploy-config.json manifest at its root; see
 * build-scripts/lib/lib-deploy-config.js. Paragraph layout is flat: all
 * companion files live at the paragraph root, no phase subfolders.
 *
 * Steps:
 *   1. Copy engine files → <target>/shared/
 *   2. Run build scripts with MODULE_ROOT=<target>
 *   3. Run link checker against <target>
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PLATFORM_ROOT = path.resolve(__dirname, '..');
const ENGINES_DIR = path.join(PLATFORM_ROOT, 'engines');

// ── Parse arguments ──────────────────────────────────────────────

const targetArg = process.argv[2];
if (!targetArg) {
    console.error('Usage: node scripts/deploy.js <target-book-path>');
    console.error('Example: node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"');
    process.exit(1);
}

const MODULE_ROOT = path.resolve(targetArg);
if (!fs.existsSync(MODULE_ROOT)) {
    console.error(`Target does not exist: ${MODULE_ROOT}`);
    process.exit(1);
}

const HEADER_JS  = '// AUTO-COPIED FROM 4veco-platform/engines/ \u2014 DO NOT EDIT HERE\n';
const HEADER_CSS = '/* AUTO-COPIED FROM 4veco-platform/engines/ \u2014 DO NOT EDIT HERE */\n';
function headerFor(file) { return file.endsWith('.css') ? HEADER_CSS : HEADER_JS; }
const HEADER = HEADER_JS;

// ── Step 1: Copy engine files ────────────────────────────────────

function copyEngines() {
    console.log('\n\u2501\u2501 Step 1: Copying engine files \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n');
    const sharedDir = path.join(MODULE_ROOT, 'shared');
    if (!fs.existsSync(sharedDir)) fs.mkdirSync(sharedDir, { recursive: true });

    // Flat engine files (JS + CSS)
    const flatFiles = [
        'quiz-engine.js', 'quiz-ui.js', 'quiz.css',
        'reasoning-engine.js', 'reasoning-ui.js', 'reasoning.css',
        'skilltree-engine.js', 'skilltree-ui.js', 'skilltree.css',
        'newsdetective-engine.js', 'newsdetective-ui.js', 'newsdetective.css',
        'procedure-engine.js', 'procedure-ui.js', 'procedure.css',
        'voorkennis.css', 'voorkennis.js',
        'theme.js'
    ];

    for (const file of flatFiles) {
        const src = path.join(ENGINES_DIR, file);
        const dst = path.join(sharedDir, file);
        if (!fs.existsSync(src)) {
            console.warn(`  WARN: ${file} not found in engines/, skipping`);
            continue;
        }
        const content = fs.readFileSync(src, 'utf8');
        fs.writeFileSync(dst, headerFor(file) + content, 'utf8');
        console.log(`  \u2713 ${file}`);
    }

    // Skilltree reusable files
    const skilltreeDir = path.join(sharedDir, 'skilltree');
    if (!fs.existsSync(skilltreeDir)) fs.mkdirSync(skilltreeDir, { recursive: true });

    // Reasoning shared metadata
    const reasoningDir = path.join(sharedDir, 'reasoning');
    if (!fs.existsSync(reasoningDir)) fs.mkdirSync(reasoningDir, { recursive: true });
    const reasoningMetaSrc = path.join(PLATFORM_ROOT, 'source-data', 'legacy-target', 'reasoning', 'meta-categories.js');
    const reasoningMetaDst = path.join(reasoningDir, 'meta-categories.js');
    if (fs.existsSync(reasoningMetaSrc)) {
        fs.writeFileSync(reasoningMetaDst, HEADER + fs.readFileSync(reasoningMetaSrc, 'utf8'), 'utf8');
        console.log(`  ✓ reasoning/meta-categories.js`);
    } else {
        console.warn(`  WARN: reasoning/meta-categories.js source not found, skipping`);
    }

    // explanations.js: straight copy.
    {
        const src = path.join(ENGINES_DIR, 'skilltree', 'explanations.js');
        const dst = path.join(skilltreeDir, 'explanations.js');
        if (fs.existsSync(src)) {
            fs.writeFileSync(dst, HEADER + fs.readFileSync(src, 'utf8'), 'utf8');
            console.log(`  \u2713 skilltree/explanations.js`);
        } else {
            console.warn(`  WARN: skilltree/explanations.js not found, skipping`);
        }
    }

    // base-elements.js: bundle catalog + generators inline so the browser
    // gets a self-contained file with no further dependencies.
    bundleSkilltreeBaseElements(skilltreeDir);

    console.log('  Done: engine files copied.\n');
}

// Produce a self-contained base-elements.js that inlines the catalog's
// A-domain units + all GEN functions, so the deployed module loads in the
// browser with a single <script src="shared/skilltree/base-elements.js">.
function bundleSkilltreeBaseElements(skilltreeDir) {
    const catalogPath = path.join(PLATFORM_ROOT, 'references/machine/micro-teaching-units.json');
    const generatorsPath = path.join(ENGINES_DIR, 'skilltree/generators.js');
    const dst = path.join(skilltreeDir, 'base-elements.js');

    if (!fs.existsSync(catalogPath)) {
        console.warn(`  WARN: catalog not found at ${path.relative(PLATFORM_ROOT, catalogPath)} — falling back to plain copy`);
        const src = path.join(ENGINES_DIR, 'skilltree/base-elements.js');
        if (fs.existsSync(src)) fs.writeFileSync(dst, HEADER + fs.readFileSync(src, 'utf8'), 'utf8');
        return;
    }
    if (!fs.existsSync(generatorsPath)) {
        console.warn(`  WARN: generators.js not found — falling back to plain copy`);
        const src = path.join(ENGINES_DIR, 'skilltree/base-elements.js');
        if (fs.existsSync(src)) fs.writeFileSync(dst, HEADER + fs.readFileSync(src, 'utf8'), 'utf8');
        return;
    }

    const units = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    const generatorsSrc = fs.readFileSync(generatorsPath, 'utf8');

    // Extract the inner guts of generators.js (between `'use strict';` and
    // the module-level closing `return { GEN: ... }`). The generator
    // function bodies contain many nested return statements, so we use
    // lastIndexOf to find the outermost module-level return at 4-space
    // indentation — that's always at the tail of the factory body.
    const startMarker = "'use strict';";
    const endMarker = '\n    return {';
    const startIdx = generatorsSrc.indexOf(startMarker);
    const returnIdx = generatorsSrc.lastIndexOf(endMarker);
    if (startIdx === -1 || returnIdx === -1 || returnIdx < startIdx) {
        throw new Error('deploy: cannot extract generators from generators.js (missing markers)');
    }
    const innerGuts = generatorsSrc.slice(startIdx + startMarker.length, returnIdx).trim();

    // Build SKILLS array literal from the A-domain slice of the catalog.
    const skillIds = new Set(
        units
            .filter(u => u.id.charAt(0) === 'A' && !u.deprecated)
            .map(u => u.id)
    );
    const skills = units
        .filter(u => skillIds.has(u.id))
        .map(u => ({
            id: u.id,
            name: u.name,
            layer: u.layer,
            needs: (u.needs || []).filter(id => skillIds.has(id)),
            desc: u.kern || (u.procedure && u.procedure[0]) || ''
        }));

    const bundle = [
        HEADER.trimEnd(),
        '/**',
        ' * SkillTree Base Elements (bundled).',
        ' * Self-contained: catalog SKILLS + generators + layer display data.',
        ' * Bundled at deploy time from references/machine/micro-teaching-units.json',
        ' * and engines/skilltree/generators.js.',
        ' */',
        '(function (root, factory) {',
        '    if (typeof module !== \'undefined\' && module.exports) {',
        '        module.exports = factory();',
        '    } else {',
        '        root.SKILL_TREE_ELEMENTS = factory();',
        '    }',
        '})(typeof self !== \'undefined\' ? self : this, function () {',
        '    \'use strict\';',
        '',
        '    ' + innerGuts,
        '',
        '    var SKILLS = ' + JSON.stringify(skills, null, 8).replace(/\n/g, '\n    ') + ';',
        '',
        '    var LAYER_NAMES = [\'Fundament\', \'Bouwstenen\', \'Marginale grootheden\', \'Samengesteld\', \'Gevorderd\', \'Eindbazen\'];',
        '    var LAYER_COLORS = [',
        '        { bg:\'#1a3353\', text:\'#7cb9e8\', glow:\'rgba(26,82,118,0.35)\' },',
        '        { bg:\'#2a1f4e\', text:\'#b8a9e8\', glow:\'rgba(136,78,160,0.3)\' },',
        '        { bg:\'#1a3a3a\', text:\'#7dcec0\', glow:\'rgba(30,132,120,0.3)\' },',
        '        { bg:\'#1a3a2a\', text:\'#7dcea0\', glow:\'rgba(30,132,73,0.3)\' },',
        '        { bg:\'#3a1a2a\', text:\'#e07a9a\', glow:\'rgba(180,60,100,0.3)\' },',
        '        { bg:\'#4a2a1a\', text:\'#f0b27a\', glow:\'rgba(230,126,34,0.3)\' }',
        '    ];',
        '',
        '    return {',
        '        SKILLS: SKILLS,',
        '        LAYER_NAMES: LAYER_NAMES,',
        '        LAYER_COLORS: LAYER_COLORS,',
        '        GEN: GEN,',
        '        helpers: { ri: ri, pick: pick, round1: round1, round2: round2, mcStep: mcStep }',
        '    };',
        '});',
        '',
    ].join('\n');

    fs.writeFileSync(dst, bundle, 'utf8');
    console.log(`  \u2713 skilltree/base-elements.js (bundled ${skills.length} units + generators)`);
}

// ── Step 2: Run build scripts ────────────────────────────────────

// Walk paragraph folders under <book-root>: <book>/<chapter-dir>/<paragraph-dir>
// (skips '_'-prefixed dirs like _assets and the shared/ engine folder).
function walkParagraphFolders(bookRoot) {
    const folders = [];
    for (const chap of fs.readdirSync(bookRoot, { withFileTypes: true })) {
        if (!chap.isDirectory()) continue;
        if (chap.name.startsWith('_') || chap.name === 'shared') continue;
        const chapPath = path.join(bookRoot, chap.name);
        for (const para of fs.readdirSync(chapPath, { withFileTypes: true })) {
            if (!para.isDirectory()) continue;
            if (para.name.startsWith('_')) continue;
            folders.push(path.join(chapPath, para.name));
        }
    }
    return folders;
}

// Run the Python docx-to-web converters across every paragraph folder
// under MODULE_ROOT. Must run before the landing-page builder so the new
// .html sibling files exist when scanFiles scans the paragraph dir.
function runDocxConverters() {
    const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');

    // Probe Python availability up front. Without Python the docx-as-web
    // pipeline can't run; the paragraph index would link only to .docx.
    try {
        execSync(`${PYTHON} --version`, { stdio: 'ignore' });
    } catch (_e) {
        console.error(`  \u2717 ${PYTHON} not found in PATH.`);
        console.error('    Install Python and `pip install python-docx`, or set the PYTHON env var.');
        process.exit(1);
    }

    const converters = [
        { name: 'voorkennis',           script: 'build-scripts/lib/convert_voorkennis.py' },
        { name: 'vaardigheden',         script: 'build-scripts/lib/convert_vaardigheden.py' },
        { name: 'begeleide-inoefening', script: 'build-scripts/lib/convert_begeleide_inoefening.py' },
        { name: 'samenvatting',         script: 'build-scripts/lib/convert_samenvatting.py' },
        { name: 'nieuws',               script: 'build-scripts/lib/convert_nieuws.py' },
    ];

    console.log(`\n  \u25b6 Docx-as-web converters...`);
    const paragraphFolders = walkParagraphFolders(MODULE_ROOT);
    console.log(`    Walking ${paragraphFolders.length} paragraph folder${paragraphFolders.length === 1 ? '' : 's'} under MODULE_ROOT.`);

    for (const conv of converters) {
        let okCount = 0, skipCount = 0, errCount = 0;
        for (const para of paragraphFolders) {
            try {
                const out = execSync(`${PYTHON} ${conv.script} "${para}"`, {
                    cwd: PLATFORM_ROOT,
                    env: { ...process.env, MODULE_ROOT },
                    encoding: 'utf8',
                });
                if (/^\s*OK\s/m.test(out)) okCount++;
                else if (/^\s*SKIP\s/m.test(out)) skipCount++;
                else okCount++;
            } catch (e) {
                errCount++;
                const stderr = (e.stderr ? e.stderr.toString() : '').trim();
                if (stderr) console.warn(`      WARN ${conv.name} on ${path.basename(para)}: ${stderr.split('\n').pop()}`);
            }
        }
        const summary = `${okCount} OK, ${skipCount} skipped${errCount ? `, ${errCount} errors` : ''}`;
        console.log(`    \u2713 ${conv.name.padEnd(22)} ${summary}`);
        if (errCount > 0) {
            console.error(`  \u2717 ${conv.name} hit ${errCount} errors \u2014 aborting deploy.`);
            process.exit(1);
        }
    }
    console.log(`  \u2713 Docx converters done.`);
}

function runBuildScripts() {
    console.log('\u2501\u2501 Step 2: Running build scripts \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n');

    const env = { ...process.env, MODULE_ROOT };
    const opts = { cwd: PLATFORM_ROOT, env, stdio: 'inherit' };

    // Run docx-to-web converters first so the resulting .html files are on
    // disk when the landing-page builder scans paragraph dirs.
    runDocxConverters();

    const scripts = [
        { name: 'Skilltree shells + data', cmd: 'node build-scripts/platform/build-skilltree-shells.js' },
        { name: 'Reasoning engine shells', cmd: 'node build-scripts/platform/build-reasoning-engine.js' },
        { name: 'Quiz shells', cmd: 'node build-scripts/platform/generate-quiz-shells.js' },
        { name: 'News detective shells', cmd: 'node build-scripts/platform/build-newsdetective-shells.js' },
        { name: 'Procedure shells', cmd: 'node build-scripts/platform/build-procedure-shells.js' },
        { name: 'Landing pages', cmd: 'node build-scripts/platform/build-landing-page.js' },
        // Idempotent: migrates any un-migrated `uitleg vaardigheden.html` files
        // to the shared voorkennis.css/js token system. Safe to re-run; already-
        // migrated files are skipped.
        { name: 'Reskin vaardigheden', cmd: `node build-scripts/platform/reskin-vaardigheden.js "${MODULE_ROOT}"` },
    ];

    for (const script of scripts) {
        console.log(`\n  \u25B6 ${script.name}...`);
        try {
            execSync(script.cmd, opts);
            console.log(`  \u2713 ${script.name} done`);
        } catch (e) {
            console.error(`  \u2717 ${script.name} FAILED (exit code ${e.status})`);
            process.exit(1);
        }
    }

    console.log('\n  Done: all build scripts ran.\n');
}

// ── Step 3: Verify ───────────────────────────────────────────────

function verify() {
    console.log('\u2501\u2501 Step 3: Verification \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n');

    const env = { ...process.env, MODULE_ROOT };
    const opts = { cwd: PLATFORM_ROOT, env, stdio: 'inherit' };

    // Link checker (warns but does not abort — pre-existing unreachable files are common)
    console.log('\n  \u25B6 Running link checker...');
    try {
        execSync('node scripts/check-links.js', opts);
        console.log('  \u2713 Link check passed');
    } catch (e) {
        console.warn('  \u26A0 Link check found issues (see output above). Review before pushing.');
    }

    // Data validation tests
    console.log('\n  \u25B6 Running data validation tests...');
    try {
        execSync('npx jest --testPathPatterns "engines/tests/.*-data\\.test\\.js" --no-coverage', opts);
        console.log('  \u2713 Data tests passed');
    } catch (e) {
        console.error('  \u2717 Data tests FAILED');
        process.exit(1);
    }

    console.log('\n\u2501\u2501 Deploy complete \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n');
    console.log(`Target: ${MODULE_ROOT}`);
    console.log('All checks passed. Ready to commit and push the module repo.\n');
}

// ── Run ──────────────────────────────────────────────────────────

copyEngines();
runBuildScripts();
verify();
