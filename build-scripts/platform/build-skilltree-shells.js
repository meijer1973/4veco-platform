#!/usr/bin/env node
/**
 * build-skilltree-shells.js
 *
 * Generates thin HTML shells for the reken-spel (wiskundevaardigheden).
 * Each shell loads shared scripts from ../../shared/ (or deeper).
 * Also generates per-paragraph data files in shared/skilltree/.
 *
 * Run: node build-scripts/build-skilltree-shells.js
 */

const fs = require('fs');
const path = require('path');
const baseElements = require('../../engines/skilltree/base-elements');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '../..');

// ── Paragraph definitions ──────────────────────────────────────────

// F5 (oppervlakte driehoek) en F6 (afgeleide) zijn nu laag 1.
// F5 wordt alleen toegevoegd bij paragrafen met surplus (S1).
// F6 wordt alleen toegevoegd bij paragrafen met MO/MK (B5/B6).
const PARAGRAPHS = [
    { parNr:'3.1.1', name:'Markt en marktstructuur', skills:['A01','A02','A03','A04','A05','A15','A16','A17'] },
    { parNr:'3.1.2', name:'Marktvormen', skills:['A01','A02','A03','A04','A05','A15','A16','A17'] },
    { parNr:'3.1.3', name:'Toepassen', skills:['A01','A02','A03','A04','A05','A15','A16','A17'] },
    { parNr:'3.2.1', name:'Marktevenwicht', skills:['A01','A02','A03','A04','A05','A10','A06','A15','A16','A17','A19'] },
    { parNr:'3.2.2', name:'Volkomen concurrentie', skills:['A01','A02','A03','A04','A05','A10','A11','A06','A07','A08','A09','A12','A13','A14','A15','A16','A17','A19','A20','A21','A22','A28','A33','A37'] },
    { parNr:'3.2.3', name:'Monopolie', skills:['A01','A02','A03','A04','A05','A10','A11','A06','A07','A08','A12','A13','A15','A16','A17','A19','A20','A21','A35'] },
    { parNr:'3.2.4', name:'Oligopolie', skills:['A01','A02','A03','A04','A05','A15','A16','A17'] },
    { parNr:'3.2.5', name:'Monopolistische concurrentie', skills:['A01','A02','A03','A04','A05','A11','A07','A08','A12','A13','A14','A15','A16','A17','A20','A21','A22','A29','A33'] },
    { parNr:'3.2.6', name:'Marktvormen en hun economische doelmatigheid', skills:['A01','A02','A03','A04','A05','A10','A11','A06','A07','A08','A12','A13','A14','A15','A16','A17','A19','A20','A21','A22','A28','A29','A30','A33','A35','A37'] },
    { parNr:'3.2.7', name:'Toepassen', skills:null }, // all skills
    { parNr:'3.3.1', name:'De rol van de overheid', skills:['A01','A02','A03','A04','A05','A15','A16','A17'] },
    { parNr:'3.3.2', name:'Overheidsbeleid', skills:['A01','A02','A03','A04','A05','A10','A06','A15','A16','A17','A19','A23','A25','A26','A27','A32'] },
    { parNr:'3.3.3', name:'Collectieve goederen', skills:['A01','A02','A03','A04','A05','A15','A16','A17'] },
    { parNr:'3.3.4', name:'Toepassen', skills:['A01','A02','A03','A04','A05','A10','A06','A15','A16','A17','A19','A23','A25','A26','A27','A32','A34'] },
    { parNr:'3.4.1', name:'Internationale handel', skills:['A01','A02','A03','A04','A05','A15','A16','A17','A18'] },
    { parNr:'3.4.2', name:'Inter-industri\u00EBle handel', skills:['A01','A02','A03','A04','A05','A15','A16','A17','A18'] },
    { parNr:'3.4.3', name:'Intra-industri\u00EBle handel', skills:['A01','A02','A03','A04','A05','A15','A16','A17','A18'] },
    { parNr:'3.4.4', name:'Internationale productieketens', skills:['A01','A02','A03','A04','A05','A15','A16','A17','A18'] },
    { parNr:'3.4.5', name:'Internationaal handelsbeleid', skills:['A01','A02','A03','A04','A05','A10','A06','A15','A16','A17','A18','A19','A23','A32','A34'] },
    { parNr:'3.4.6', name:'Toepassen', skills:['A01','A02','A03','A04','A05','A10','A06','A15','A16','A17','A18','A19','A23','A32','A34'] },
    { parNr:'3.5.1', name:'Afsluiting', skills:null }, // all skills — full review
    { parNr:'3.5.2', name:'Naar het examen', skills:null }, // all skills — exam level
    // Module 1: Schaarste, geld en handel
    { parNr:'1.1.1', name:'Kiezen is kostbaar', skills:['A01','A02','A03','A04','A05'] },
    { parNr:'1.1.2', name:'Kiezen of delen', skills:['A01','A02','A03','A04'] },
    { parNr:'1.1.3', name:'Toepassen', skills:['A01','A02','A03','A04','A05'] },
];

// ── Compute which skills are new per paragraph ───────────────────────

function computeNewSkills() {
    var allSkillIds = baseElements.SKILLS.map(function (s) { return s.id; });
    var seen = new Set();
    for (var i = 0; i < PARAGRAPHS.length; i++) {
        var par = PARAGRAPHS[i];
        var active = par.skills ? par.skills : allSkillIds;
        par.newSkills = active.filter(function (id) { return !seen.has(id); });
        active.forEach(function (id) { seen.add(id); });
    }
}

computeNewSkills();

// ── Find paragraph directory ───────────────────────────────────────

function findParagraphDir(parNr) {
    function walk(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory() && entry.name.startsWith(parNr + ' ')) {
                return path.join(dir, entry.name);
            }
            if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.startsWith('node_')) {
                const result = walk(path.join(dir, entry.name));
                if (result) return result;
            }
        }
        return null;
    }
    return walk(MODULE_ROOT);
}

// ── Compute relative path to shared/ ──────────────────────────────

function relativeToShared(fromDir) {
    const sharedDir = path.join(MODULE_ROOT, 'shared');
    return path.relative(fromDir, sharedDir).replace(/\\/g, '/');
}

// ── Generate per-paragraph data file ──────────────────────────────

function generateDataFile(par) {
    const activeSkills = par.skills ? JSON.stringify(par.skills) : 'null';
    const newSkills = JSON.stringify(par.newSkills || []);
    return `/**\n * Skill Tree data for ${par.parNr} ${par.name}\n * activeSkills: null = all skills visible\n */\nwindow.SKILL_TREE_DATA = {\n    parNr: "${par.parNr}",\n    parName: "${par.name}",\n    activeSkills: ${activeSkills},\n    newSkills: ${newSkills}\n};\n`;
}

// ── Generate HTML shell ───────────────────────────────────────────

function generateHTML(parNr, parName, sharedPath) {
    return `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${parNr} ${parName} \u2013 Wiskundevaardigheden</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="${sharedPath}/skilltree.css">
</head>
<body>
    <a class="back-to-overview" href="../index.html">&larr; Terug naar overzicht</a>

    <div class="st-top-strip">
        <a class="st-crumb-back" href="../index.html">&larr; Overzicht</a>
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
                    <span>&#8212; <span style="color:var(--green)">groen</span> = beheerst</span>
                    <span>&#8212; <span style="color:var(--red)">rood</span> = nog te oefenen</span>
                    <span>Tap = oefenen &middot; <i class="fa-solid fa-sitemap"></i> = afhankelijkheden</span>
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
    <script src="${sharedPath}/skilltree-engine.js"></script>
    <script src="${sharedPath}/skilltree-ui.js"></script>
</body>
</html>`;
}

// ── Main ───────────────────────────────────────────────────────────

function main() {
    console.log('Generating reken-spel HTML shells + data files...\n');

    const dataDir = path.join(MODULE_ROOT, 'shared', 'skilltree');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    let success = 0, errCount = 0;

    for (const par of PARAGRAPHS) {
        try {
            // Generate data file
            const dataContent = generateDataFile(par);
            const dataPath = path.join(dataDir, par.parNr + '.js');
            fs.writeFileSync(dataPath, dataContent, 'utf8');

            // Find paragraph directory and generate HTML shell
            const parDir = findParagraphDir(par.parNr);
            if (!parDir) {
                console.error('  SKIP: No directory for ' + par.parNr);
                errCount++;
                continue;
            }

            const oefenDir = path.join(parDir, '3. Oefenen');
            if (!fs.existsSync(oefenDir)) {
                fs.mkdirSync(oefenDir, { recursive: true });
            }

            const sharedPath = relativeToShared(oefenDir);
            const html = generateHTML(par.parNr, par.name, sharedPath);
            const outPath = path.join(oefenDir, par.parNr + ' ' + par.name + ' \u2013 wiskundevaardigheden.html');
            fs.writeFileSync(outPath, html, 'utf8');

            const size = fs.statSync(outPath).size;
            const skillCount = par.skills ? par.skills.length : 'all';
            console.log('  OK: ' + par.parNr + ' (' + skillCount + ' skills, ' + Math.round(size/1024) + ' KB)');
            success++;
        } catch (err) {
            console.error('  ERROR: ' + par.parNr + ': ' + err.message);
            errCount++;
        }
    }

    console.log('\nDone: ' + success + ' HTML shells + data files generated, ' + errCount + ' errors.');
}

main();
