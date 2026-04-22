#!/usr/bin/env node
/**
 * generate-quiz-shells.js (flat layout)
 *
 * Generates slim HTML shell files for instapquiz pages.
 * Each shell loads shared CSS, per-quiz data, quiz-engine.js, and quiz-ui.js.
 *
 * Scans <MODULE_ROOT>/shared/questions/ for X.Y.Z.js data files, looks up each
 * paragraph in the manifest (deploy-config.json), and writes the shell directly
 * to the paragraph root.
 *
 * Run: MODULE_ROOT="<book-path>" node build-scripts/platform/generate-quiz-shells.js
 */

const fs = require('fs');
const path = require('path');
const { loadConfig } = require('../lib/lib-deploy-config');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '../..');
const CONFIG = loadConfig(MODULE_ROOT);
const QUESTIONS_DIR = path.join(MODULE_ROOT, 'shared', 'questions');

function findQuizDataFiles() {
    if (!fs.existsSync(QUESTIONS_DIR)) return [];
    return fs.readdirSync(QUESTIONS_DIR)
        .filter(f => f.endsWith('.js'))
        .map(f => f.replace('.js', ''))
        .sort();
}

function generateShell(parNr, parName) {
    const dataPath = path.join(QUESTIONS_DIR, parNr + '.js');
    const dataContent = fs.readFileSync(dataPath, 'utf8');

    // Extract metadata by evaluating the data file
    const evalCode = dataContent + '\n QUIZ_DATA;';
    const quizData = eval(evalCode);
    const meta = quizData.meta;

    let topicsHtml = '';
    if (meta.testTopics && meta.testTopics.length > 0) {
        topicsHtml = meta.testTopics.map(t => '                        <li>' + escapeHtml(t) + '</li>').join('\n');
    }

    // Flat layout: paragraph root → shared/ is 2 levels up.
    const sharedPath = '../../shared';

    return `<!DOCTYPE html>
<html lang="nl" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(parName)} — Instapquiz</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="${sharedPath}/quiz.css">
    <script>(function(){try{var m=localStorage.getItem('quizMode')||'light';document.documentElement.setAttribute('data-theme',m);}catch(e){}})();</script>
</head>
<body>
<div class="app-container">
    <header class="header">
        <div class="header-left">
            <a class="back-to-overview" href="index.html"><i class="fa-solid fa-arrow-left"></i> Overzicht</a>
            <span class="header-divider"></span>
            <div class="header-title-group">
                <span class="par-badge">§${escapeHtml(parNr)}</span>
                <h1>${escapeHtml(parName)}</h1>
            </div>
        </div>
        <div class="header-right">
            <div class="stats-bar">
                <div class="stat-tile">
                    <i class="fa-solid fa-bolt stat-icon score"></i>
                    <span class="stat-value" id="score-display">0</span>
                    <span class="stat-label">Score</span>
                </div>
                <div class="stat-tile">
                    <i class="fa-solid fa-circle-check stat-icon closed"></i>
                    <span class="stat-value" id="closed-display">0/0</span>
                    <span class="stat-label">Gesloten</span>
                </div>
            </div>
            <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Licht/donker wisselen"></button>
        </div>
    </header>

    <div class="session-strip" id="session-strip" style="display:none;">
        <span class="strip-label">Sessie</span>
        <div class="session-segments" id="session-segments"></div>
        <span class="session-count" id="session-count">00<span class="sep"> / 10</span></span>
    </div>

    <div class="content-layout">
        <div class="main-area">
            <div id="start-screen" class="screen active">
                <h2>${escapeHtml(parName)}</h2>
                <p>${escapeHtml(meta.subtitle || '')}</p>
                <div class="topics-box">
                    <h3><i class="fa-solid fa-bullseye icon"></i> Wat we gaan toetsen</h3>
                    <ul>
${topicsHtml}
                    </ul>
                </div>
                <button class="btn btn-large" onclick="startGame()">Start de training <i class="fa-solid fa-arrow-right"></i></button>
            </div>

            <div id="game-screen" class="screen">
                <div class="question-meta">
                    <div id="category-display" class="category-badge">Categorie</div>
                    <div id="difficulty-chip" class="difficulty-chip"></div>
                </div>
                <h2 id="question-text" class="question-text">Vraag...</h2>
                <div id="options-container" class="options-grid"></div>
                <div id="feedback-container" class="feedback-box">
                    <div class="feedback-icon" id="feedback-icon"></div>
                    <div class="feedback-body">
                        <div id="feedback-title" class="feedback-title">Feedback</div>
                        <p id="feedback-text" class="feedback-text">Uitleg...</p>
                    </div>
                </div>
                <button id="next-btn" class="btn" style="display: none;" onclick="nextQuestion()">Volgende vraag <i class="fa-solid fa-arrow-right"></i></button>
            </div>

            <div id="end-screen" class="screen">
                <h2>Sessie voltooid <i class="fa-solid fa-trophy trophy"></i></h2>
                <p class="end-summary">In deze sessie heb je <span id="final-score"></span> vragen goed beantwoord.</p>
                <div class="end-callout">
                    <h3>Hoe nu verder?</h3>
                    <p>Bekijk je voortgang in de zijbalk. Bouw per onderwerp een <strong>reeks van 3</strong> op om deze definitief af te sluiten. Maak je een fout? Dan reset de reeks naar nul.</p>
                </div>
                <button class="btn btn-large" onclick="restartSession()">Start volgende sessie <i class="fa-solid fa-rotate-right"></i></button>
            </div>
        </div>

        <aside class="sidebar-area" id="sidebar">
            <h3 class="sidebar-title"><i class="fa-solid fa-chart-simple"></i> Jouw beheersing</h3>
            <div id="mastery-dashboard" class="mastery-container"></div>
        </aside>
    </div>
</div>
<script src="${sharedPath}/theme.js"></script>
<script src="${sharedPath}/questions/${parNr}.js"></script>
<script src="${sharedPath}/quiz-engine.js"></script>
<script src="${sharedPath}/quiz-ui.js"></script>
</body>
</html>`;
}

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function main() {
    console.log('Generating quiz shell HTML files...\n');

    const parNrs = findQuizDataFiles();
    console.log(`Found ${parNrs.length} quiz data files.\n`);

    let success = 0, errors = 0;

    for (const parNr of parNrs) {
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
            const outPath = path.join(found.fullPath, `${parNr} ${p.name} – instapquiz.html`);
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
