#!/usr/bin/env node
/**
 * generate-quiz-shells.js
 *
 * Generates slim HTML shell files for all 20 instapquiz pages.
 * Each shell loads shared CSS, per-quiz data, quiz-engine.js, and quiz-ui.js.
 *
 * Run: node build-scripts/generate-quiz-shells.js
 */

const fs = require('fs');
const path = require('path');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '../..');
const QUESTIONS_DIR = path.join(MODULE_ROOT, 'shared', 'questions');

// Find all quiz data files to determine which quizzes to generate
function findQuizDataFiles() {
    return fs.readdirSync(QUESTIONS_DIR)
        .filter(f => f.endsWith('.js'))
        .map(f => f.replace('.js', ''))
        .sort();
}

// Find the HTML file path for a given paragraph number
function findQuizHtmlPath(parNr) {
    // First try to find an existing instapquiz file
    function walkForExisting(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                const result = walkForExisting(fullPath);
                if (result) return result;
            } else if (entry.name.includes('instapquiz') && entry.name.endsWith('.html') && entry.name.includes(parNr)) {
                return fullPath;
            }
        }
        return null;
    }
    const existing = walkForExisting(MODULE_ROOT);
    if (existing) return existing;

    // No existing file — find the paragraph directory and create path in 1. Voorbereiden/
    function walkForDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory() && entry.name.startsWith(parNr + ' ')) {
                const nameMatch = entry.name.match(/- (.+)$/);
                const parName = nameMatch ? nameMatch[1] : parNr;
                const voorbereidenDir = path.join(dir, entry.name, '1. Voorbereiden');
                if (!fs.existsSync(voorbereidenDir)) fs.mkdirSync(voorbereidenDir, { recursive: true });
                return path.join(voorbereidenDir, parNr + ' ' + parName + ' \u2013 instapquiz.html');
            }
            if (entry.isDirectory()) {
                const result = walkForDir(path.join(dir, entry.name));
                if (result) return result;
            }
        }
        return null;
    }
    return walkForDir(MODULE_ROOT);
}

// Generate HTML shell for a quiz
function generateShell(parNr) {
    // Read the data file to get metadata
    const dataPath = path.join(QUESTIONS_DIR, parNr + '.js');
    const dataContent = fs.readFileSync(dataPath, 'utf8');

    // Extract metadata by evaluating the data file
    let quizData;
    const evalCode = dataContent + '\n QUIZ_DATA;';
    quizData = eval(evalCode);

    const meta = quizData.meta;
    const categories = quizData.categories;

    // Build test topics list
    let topicsHtml = '';
    if (meta.testTopics && meta.testTopics.length > 0) {
        topicsHtml = meta.testTopics.map(t => '                        <li>' + escapeHtml(t) + '</li>').join('\n');
    }

    // Compute relative path to shared/ (all quiz files are 3 levels deep)
    const sharedPath = '../../../shared';

    const html = `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(meta.parName)} - Instapquiz</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="${sharedPath}/quiz.css">
</head>
<body>
<div class="app-container">
    <div class="header">
        <a class="back-to-overview" href="../index.html">&larr; Terug naar overzicht</a>
        <h1><span class="par-badge">${escapeHtml(meta.parNr)}</span> ${escapeHtml(meta.parName)} – Instapquiz</h1>
        <div class="stats-bar" id="game-stats" style="display: none;">
            <div><i class="fa-solid fa-star"></i> Score: <span id="score-display">0</span></div>
            <div><i class="fa-solid fa-list-ol"></i> Vraag: <span id="question-count">0/10</span></div>
        </div>
    </div>
    <div class="content-layout">
        <div class="main-area">
            <div id="start-screen" class="screen active">
                <h2>${escapeHtml(meta.parName)}</h2>
                <p>${escapeHtml(meta.subtitle)}</p>
                <div class="topics-box">
                    <h3><i class="fa-solid fa-bullseye icon"></i> Wat we gaan toetsen:</h3>
                    <ul>
${topicsHtml}
                    </ul>
                </div>
                <button class="btn btn-large" onclick="startGame()">Start de Training</button>
            </div>
            <div id="game-screen" class="screen">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div id="category-display" class="category-badge">Categorie</div>
                    <div id="difficulty-stars" style="color: #fbbf24; margin-bottom: 20px; font-size: 18px;"></div>
                </div>
                <div id="question-text" class="question-text">Vraag...</div>
                <div id="options-container" class="options-grid"></div>
                <div id="feedback-container" class="feedback-box">
                    <div id="feedback-title" class="feedback-title">Feedback</div>
                    <div id="feedback-text">Uitleg...</div>
                </div>
                <button id="next-btn" class="btn" style="display: none;" onclick="nextQuestion()">Volgende Vraag <i class="fa-solid fa-arrow-right"></i></button>
            </div>
            <div id="end-screen" class="screen">
                <h2>Sessie Voltooid! <i class="fa-solid fa-trophy" style="color: #fbbf24;"></i></h2>
                <p style="font-size: 18px; margin-top: 10px; margin-bottom: 30px;">In deze sessie heb je <span id="final-score" style="font-weight: bold; color: var(--domain-primary);"></span> vragen goed beantwoord.</p>
                <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
                    <h3 style="margin-bottom: 10px; font-size: 18px;">Hoe nu verder?</h3>
                    <p style="color: #475569; line-height: 1.6;">Bekijk je actuele voortgang in de zijbalk (of hieronder op mobiel). Bouw per onderwerp een <strong>reeks van 3</strong> op om deze definitief af te sluiten en de balk groen te maken. Maak je een fout? Dan reset de reeks naar nul.</p>
                </div>
                <button class="btn btn-large" onclick="restartSession()">Start Volgende Sessie <i class="fa-solid fa-rotate-right"></i></button>
            </div>
        </div>
        <div class="sidebar-area" id="sidebar">
            <h3 class="sidebar-title"><i class="fa-solid fa-chart-pie"></i> Jouw Voortgang</h3>
            <div id="mastery-dashboard" class="mastery-container"></div>
        </div>
    </div>
</div>
<script src="${sharedPath}/theme.js"></script>
<script src="${sharedPath}/questions/${parNr}.js"></script>
<script src="${sharedPath}/quiz-engine.js"></script>
<script src="${sharedPath}/quiz-ui.js"></script>
</body>
</html>`;

    return html;
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Main
function main() {
    console.log('Generating quiz shell HTML files...\n');

    const parNrs = findQuizDataFiles();
    console.log('Found ' + parNrs.length + ' quiz data files.\n');

    let success = 0;
    let errors = 0;

    for (const parNr of parNrs) {
        try {
            const htmlPath = findQuizHtmlPath(parNr);
            if (!htmlPath) {
                console.error('  SKIP: No HTML file found for ' + parNr);
                errors++;
                continue;
            }

            const shell = generateShell(parNr);
            fs.writeFileSync(htmlPath, shell, 'utf8');
            const relPath = path.relative(MODULE_ROOT, htmlPath);
            console.log('  OK: ' + parNr + ' → ' + relPath);
            success++;
        } catch (e) {
            console.error('  ERROR for ' + parNr + ': ' + e.message);
            errors++;
        }
    }

    console.log('\nDone. Success: ' + success + ', Errors: ' + errors);
}

main();
