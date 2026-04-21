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
<html lang="nl" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(meta.parName)} — Instapquiz</title>
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
            <a class="back-to-overview" href="../index.html"><i class="fa-solid fa-arrow-left"></i> Overzicht</a>
            <span class="header-divider"></span>
            <div class="header-title-group">
                <span class="par-badge">§${escapeHtml(meta.parNr)}</span>
                <h1>${escapeHtml(meta.parName)}</h1>
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
                <h2>${escapeHtml(meta.parName)}</h2>
                <p>${escapeHtml(meta.subtitle)}</p>
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
