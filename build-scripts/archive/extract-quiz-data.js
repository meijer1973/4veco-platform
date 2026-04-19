#!/usr/bin/env node
/**
 * extract-quiz-data.js
 *
 * One-time migration script: reads all 20 instapquiz HTML files,
 * extracts questionBank, userProgress keys, catNames, catColors,
 * title, subtitle, and test topics, then writes per-quiz JS data
 * files to shared/questions/X.Y.Z.js.
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/extract-quiz-data.js
 */

const fs = require('fs');
const path = require('path');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '..');
const SHARED_DIR = path.join(MODULE_ROOT, 'shared', 'questions');

// Find all instapquiz files
function findQuizFiles(dir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...findQuizFiles(fullPath));
        } else if (entry.name.includes('instapquiz') && entry.name.endsWith('.html')) {
            results.push(fullPath);
        }
    }
    return results.sort();
}

// Extract data from a single quiz HTML file
function extractQuizData(filePath) {
    const html = fs.readFileSync(filePath, 'utf8');

    // Extract paragraph number from filename (e.g. "3.1.1")
    const parMatch = filePath.match(/(\d+\.\d+\.\d+)/);
    if (!parMatch) throw new Error('Cannot extract paragraph number from: ' + filePath);
    const parNr = parMatch[1];

    // Extract chapter prefix for domain colors (e.g. "3.1")
    const chapterPrefix = parNr.split('.').slice(0, 2).join('.');

    // Extract title from <title> tag
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const fullTitle = titleMatch ? titleMatch[1].replace(' - Instapquiz', '').trim() : parNr;

    // Extract subtitle from start-screen <p>
    const subtitleMatch = html.match(/<div id="start-screen"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/);
    const subtitle = subtitleMatch ? subtitleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    // Extract test topics from <li> items in the bullseye section
    const topicsMatch = html.match(/Wat we gaan toetsen[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/);
    const topics = [];
    if (topicsMatch) {
        const liRegex = /<li>(.*?)<\/li>/g;
        let m;
        while ((m = liRegex.exec(topicsMatch[1])) !== null) {
            topics.push(m[1].replace(/<[^>]+>/g, '').trim());
        }
    }

    // Extract questionBank array
    const qbMatch = html.match(/const questionBank\s*=\s*(\[[\s\S]*?\]);/);
    if (!qbMatch) throw new Error('Cannot find questionBank in: ' + filePath);
    let questionBank;
    try {
        questionBank = JSON.parse(qbMatch[1]);
    } catch (e) {
        // Try eval as fallback (the JSON might have trailing commas or single quotes)
        questionBank = eval('(' + qbMatch[1] + ')');
    }

    // Extract userProgress keys (category identifiers)
    const upMatch = html.match(/let userProgress\s*=\s*(\{[\s\S]*?\});/);
    if (!upMatch) throw new Error('Cannot find userProgress in: ' + filePath);
    const categoryKeys = [];
    const keyRegex = /"([^"]+)":\s*\{/g;
    let km;
    while ((km = keyRegex.exec(upMatch[1])) !== null) {
        categoryKeys.push(km[1]);
    }

    // Extract catNames
    const cnMatch = html.match(/const catNames\s*=\s*(\{[\s\S]*?\});/);
    if (!cnMatch) throw new Error('Cannot find catNames in: ' + filePath);
    let catNames;
    try {
        catNames = JSON.parse(cnMatch[1]);
    } catch (e) {
        catNames = eval('(' + cnMatch[1] + ')');
    }

    // Extract catColors
    const ccMatch = html.match(/const catColors\s*=\s*(\{[\s\S]*?\});/);
    if (!ccMatch) throw new Error('Cannot find catColors in: ' + filePath);
    let catColors;
    try {
        catColors = JSON.parse(ccMatch[1]);
    } catch (e) {
        catColors = eval('(' + ccMatch[1] + ')');
    }

    // Build categories object
    const categories = {};
    for (const key of categoryKeys) {
        categories[key] = {
            name: catNames[key] || key,
            colors: catColors[key] || { bg: '#f1f5f9', text: '#334155', bar: '#17A2B8' }
        };
    }

    return {
        meta: {
            parNr: parNr,
            parName: fullTitle,
            subtitle: subtitle,
            testTopics: topics
        },
        categories: categories,
        questions: questionBank
    };
}

// Write data file
function writeDataFile(data) {
    const parNr = data.meta.parNr;
    const outPath = path.join(SHARED_DIR, parNr + '.js');
    const content = 'var QUIZ_DATA = ' + JSON.stringify(data, null, 2) + ';\n';
    fs.writeFileSync(outPath, content, 'utf8');
    console.log('  Written: ' + outPath);
}

// Main
function main() {
    console.log('Extracting quiz data from instapquiz HTML files...\n');

    // Ensure output directory exists
    if (!fs.existsSync(SHARED_DIR)) {
        fs.mkdirSync(SHARED_DIR, { recursive: true });
    }

    const quizFiles = findQuizFiles(MODULE_ROOT);
    console.log('Found ' + quizFiles.length + ' quiz files.\n');

    let success = 0;
    let errors = 0;

    for (const filePath of quizFiles) {
        const relPath = path.relative(MODULE_ROOT, filePath);
        try {
            const data = extractQuizData(filePath);
            writeDataFile(data);
            console.log('  OK: ' + data.meta.parNr + ' — ' + data.meta.parName + ' (' + data.questions.length + ' questions, ' + Object.keys(data.categories).length + ' categories)\n');
            success++;
        } catch (e) {
            console.error('  ERROR in ' + relPath + ': ' + e.message + '\n');
            errors++;
        }
    }

    console.log('\nDone. Success: ' + success + ', Errors: ' + errors);
}

main();
