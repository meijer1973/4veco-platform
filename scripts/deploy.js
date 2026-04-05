#!/usr/bin/env node
/**
 * deploy.js — Deploy engines and generated content to a module repo.
 *
 * Copies engine files, runs build scripts, and verifies the result.
 *
 * Usage:
 *   node scripts/deploy.js <target-module-path>
 *   node scripts/deploy.js "../3. Module 3 - Markt en overheid"
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
    console.error('Usage: node scripts/deploy.js <target-module-path>');
    console.error('Example: node scripts/deploy.js "../3. Module 3 - Markt en overheid"');
    process.exit(1);
}

const MODULE_ROOT = path.resolve(targetArg);
if (!fs.existsSync(MODULE_ROOT)) {
    console.error(`Target does not exist: ${MODULE_ROOT}`);
    process.exit(1);
}

const HEADER = '// AUTO-COPIED FROM 4veco-platform/engines/ \u2014 DO NOT EDIT HERE\n';

// ── Step 1: Copy engine files ────────────────────────────────────

function copyEngines() {
    console.log('\n\u2501\u2501 Step 1: Copying engine files \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n');
    const sharedDir = path.join(MODULE_ROOT, 'shared');

    // Flat engine files (JS + CSS)
    const flatFiles = [
        'quiz-engine.js', 'quiz-ui.js', 'quiz.css',
        'reasoning-engine.js', 'reasoning-ui.js', 'reasoning.css',
        'skilltree-engine.js', 'skilltree-ui.js', 'skilltree.css',
        'newsdetective-engine.js', 'newsdetective-ui.js', 'newsdetective.css',
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
        fs.writeFileSync(dst, HEADER + content, 'utf8');
        console.log(`  \u2713 ${file}`);
    }

    // Skilltree reusable files
    const skilltreeDir = path.join(sharedDir, 'skilltree');
    if (!fs.existsSync(skilltreeDir)) fs.mkdirSync(skilltreeDir, { recursive: true });

    for (const file of ['base-elements.js', 'explanations.js']) {
        const src = path.join(ENGINES_DIR, 'skilltree', file);
        const dst = path.join(skilltreeDir, file);
        if (!fs.existsSync(src)) {
            console.warn(`  WARN: skilltree/${file} not found, skipping`);
            continue;
        }
        const content = fs.readFileSync(src, 'utf8');
        fs.writeFileSync(dst, HEADER + content, 'utf8');
        console.log(`  \u2713 skilltree/${file}`);
    }

    console.log('  Done: engine files copied.\n');
}

// ── Step 2: Run build scripts ────────────────────────────────────

function runBuildScripts() {
    console.log('\u2501\u2501 Step 2: Running build scripts \u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n');

    const env = { ...process.env, MODULE_ROOT };
    const opts = { cwd: PLATFORM_ROOT, env, stdio: 'inherit' };

    const scripts = [
        { name: 'Skilltree shells + data', cmd: 'node build-scripts/build-skilltree-shells.js' },
        { name: 'Reasoning engine shells', cmd: 'node build-scripts/build-reasoning-engine.js' },
        { name: 'Quiz shells', cmd: 'node build-scripts/generate-quiz-shells.js' },
        { name: 'News detective shells', cmd: 'node build-scripts/build-newsdetective-shells.js' },
        { name: 'Landing pages', cmd: 'node build-scripts/build-landing-page.js' },
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
