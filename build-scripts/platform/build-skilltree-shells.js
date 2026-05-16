#!/usr/bin/env node
/**
 * build-skilltree-shells.js (flat layout)
 *
 * Generates HTML shells for the wiskundevaardigheden skill tree, plus a
 * per-paragraph SKILL_TREE_DATA file in <MODULE_ROOT>/shared/skilltree/.
 *
 * A paragraph participates iff it carries a `skilltree` object in the
 * manifest (deploy-config.json):
 *   { "id": "1.1.1", ..., "skilltree": { "skills": ["A01","A02","A03"] } }
 * Use `"skills": null` only when all skills should be visible in paragraph mode.
 * Optional `"chapterSkills"` drives the broader Hoofdstuk toggle.
 *
 * Shells are written to the paragraph root (flat layout); the data file
 * lives in <MODULE_ROOT>/shared/skilltree/<parNr>.js.
 *
 * Run: MODULE_ROOT="<book-path>" node build-scripts/platform/build-skilltree-shells.js
 */

const fs = require('fs');
const path = require('path');
const { loadConfig } = require('../lib/lib-deploy-config');
const baseElements = require('../../engines/skilltree/base-elements');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '../..');
const CONFIG = loadConfig(MODULE_ROOT);

// ── Compute newSkills per paragraph (in manifest order) ──────────────

function participatingParagraphs() {
    return CONFIG.paragraphs.filter(p => p.skilltree !== undefined);
}

function computeNewSkills(participants) {
    const allSkillIds = baseElements.SKILLS.map(s => s.id);
    const seen = new Set();
    const out = [];
    for (const p of participants) {
        const active = p.skilltree.skills ? p.skilltree.skills : allSkillIds;
        const newSkills = active.filter(id => !seen.has(id));
        active.forEach(id => seen.add(id));
        out.push({ ...p, _newSkills: newSkills, _activeSkills: p.skilltree.skills });
    }
    return out;
}

// ── Data file ───────────────────────────────────────────────────────

function generateDataFile(par) {
    const activeSkills = par._activeSkills ? JSON.stringify(par._activeSkills) : 'null';
    const chapterSkills = par.skilltree && par.skilltree.chapterSkills
        ? JSON.stringify(par.skilltree.chapterSkills)
        : activeSkills;
    const newSkills = JSON.stringify(par._newSkills || []);
    return `/**\n * Skill Tree data for ${par.id} ${par.name}\n * activeSkills: null = all skills visible\n */\nwindow.SKILL_TREE_DATA = {\n    parNr: "${par.id}",\n    parName: "${par.name}",\n    activeSkills: ${activeSkills},\n    chapterSkills: ${chapterSkills},\n    newSkills: ${newSkills}\n};\n`;
}

// ── HTML shell ──────────────────────────────────────────────────────

function generateHTML(parNr, parName) {
    // Flat layout: paragraph root → shared/ is 2 levels up.
    const sharedPath = '../../shared';

    return `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${parNr} ${parName} – Wiskunde vaardigheden</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="${sharedPath}/skilltree.css">
</head>
<body>
    <a class="back-to-overview" href="index.html">&larr; Terug naar overzicht</a>

    <div class="st-top-strip">
        <a class="st-crumb-back" href="index.html">&larr; Overzicht</a>
        <span class="st-crumb-sep"></span>
        <span class="st-crumb-chip" id="st-crumb-chip">&sect;${parNr}</span>
    </div>

    <div id="skilltree-app">

        <section class="st-view st-view-tree" id="st-view-tree">

            <div class="st-legend" id="st-legend">
                <span><i class="fa-solid fa-circle-info"></i> Info</span>
                <span><i class="fa-solid fa-sitemap"></i> Afhankelijkheden</span>
                <button class="st-view-toggle" id="st-view-toggle" type="button">&sect; Paragraaf</button>
                <button class="st-theme-toggle" id="st-theme-toggle" type="button" aria-label="Wissel licht/donker">
                    <span class="ring"><i class="fa-solid fa-sun"></i></span>
                    <span class="label">Licht</span>
                </button>
            </div>

            <header class="st-header" id="st-header">
                <h1 id="st-header-title">${parName}</h1>
                <p class="st-subtitle"></p>
                <div class="st-progress-summary">
                    <span class="st-stat-tile">
                        <span class="ico" style="color:var(--green)">&#x25CF;</span>
                        <span class="num"><span id="st-stat-mastered-val">0</span><span class="muted">/<span id="st-stat-total-val">0</span></span></span>
                        <span class="lbl">Voltooid</span>
                    </span>
                    <span class="st-stat-tile">
                        <span class="ico" style="color:var(--gold)">&#x2605;</span>
                        <span class="num"><span id="st-stat-stars-val">0</span><span class="muted">/<span id="st-stat-maxstars-val">0</span></span></span>
                        <span class="lbl">Sterren</span>
                    </span>
                </div>
            </header>

            <div class="st-goal-banner-slot" id="st-goal-banner-slot"></div>

            <div class="st-layers" id="st-layers"></div>

            <button class="st-reset-btn" id="st-reset" type="button">
                <i class="fa-solid fa-rotate-left"></i> Reset
            </button>

        </section>

        <section class="st-view st-view-deps" id="st-view-deps" hidden>
            <header class="st-view-header">
                <button class="st-view-back" id="st-deps-back" type="button">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h2 id="st-deps-title">Afhankelijkheden</h2>
            </header>
            <div class="st-view-deps-body" id="st-deps-graph-slot"></div>
            <footer class="st-view-deps-footer">
                <div id="st-deps-goal-btn-slot"></div>
                <div class="st-dep-legend">
                    <span>— <span style="color:var(--green)">groen</span> = beheerst</span>
                    <span>— <span style="color:var(--red)">rood</span> = nog te oefenen</span>
                    <span>Tap = oefenen · <i class="fa-solid fa-sitemap"></i> = afhankelijkheden</span>
                </div>
            </footer>
        </section>

        <section class="st-view st-view-expl" id="st-view-expl" hidden>
            <header class="st-view-header">
                <button class="st-view-back" id="st-expl-back" type="button">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h2 id="st-expl-title"></h2>
            </header>
            <div class="st-view-expl-body" id="st-expl-body"></div>
        </section>

        <div class="st-info-overlay" id="st-info-overlay" hidden>
            <div class="st-info-container" id="st-info-container">
                <div class="st-info-header" id="st-info-header"></div>
                <p class="st-info-desc" id="st-info-desc"></p>
                <div class="st-info-preview" id="st-info-preview"></div>
                <div class="st-info-stars" id="st-info-stars"></div>
            </div>
        </div>

        <section class="st-view st-view-exercise" id="st-view-exercise" hidden>
            <div class="st-exercise" id="st-exercise">
                <div class="st-ex-header">
                    <button class="st-back-btn" id="st-back" type="button">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <div style="flex:1">
                        <div class="st-ex-skill-id" id="st-ex-skill-id"></div>
                        <div class="st-ex-skill-name" id="st-ex-skill-name"></div>
                    </div>
                    <div class="st-step-counter" id="st-step-counter"></div>
                </div>
                <div class="st-progress-bar">
                    <div class="st-progress-fill" id="st-progress-fill"></div>
                </div>
                <div class="st-context" id="st-context"></div>
                <div class="st-completed-list" id="st-completed-list"></div>
                <div class="st-step-card-slot" id="st-step-card-slot"></div>
                <div class="st-score-tracker" id="st-score-tracker"></div>
                <div class="st-result-slot" id="st-result-slot" hidden></div>
            </div>
        </section>

    </div>

    <script src="${sharedPath}/skilltree/base-elements.js"></script>
    <script src="${sharedPath}/skilltree/${parNr}.js"></script>
    <script src="${sharedPath}/skilltree/explanations.js"></script>
    <script src="${sharedPath}/adaptive-seam.js"></script>
    <script src="${sharedPath}/skilltree-engine.js"></script>
    <script src="${sharedPath}/skilltree-ui.js"></script>
</body>
</html>`;
}

// ── Main ────────────────────────────────────────────────────────────

function main() {
    console.log('Generating skilltree HTML shells + data files...\n');

    const dataDir = path.join(MODULE_ROOT, 'shared', 'skilltree');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    const participants = computeNewSkills(participatingParagraphs());
    if (participants.length === 0) {
        console.log('No paragraphs declare a "skilltree" block in the manifest. Nothing to generate.');
        return;
    }

    let success = 0, errors = 0;

    for (const par of participants) {
        try {
            // Data file — canonical location in shared/skilltree/<parNr>.js
            fs.writeFileSync(path.join(dataDir, par.id + '.js'), generateDataFile(par), 'utf8');

            // HTML shell at paragraph root
            const found = CONFIG.findParagraphFolder(par.id);
            if (!found) {
                console.error(`  SKIP: paragraph folder not found for ${par.id}`);
                errors++;
                continue;
            }

            const html = generateHTML(par.id, par.name);
            const outPath = path.join(found.fullPath, `${par.id} ${par.name} – wiskundevaardigheden.html`);
            fs.writeFileSync(outPath, html, 'utf8');

            const skillCount = par._activeSkills ? par._activeSkills.length : 'all';
            console.log(`  OK: ${par.id} (${skillCount} skills)`);
            success++;
        } catch (err) {
            console.error(`  ERROR: ${par.id}: ${err.message}`);
            errors++;
        }
    }

    console.log(`\nDone: ${success} HTML shells + data files generated, ${errors} errors.`);
}

main();
