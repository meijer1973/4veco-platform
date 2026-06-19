#!/usr/bin/env node
/**
 * build-newsdetective-shells.js (flat layout)
 *
 * Generates Nieuws-detective V2 HTML pages from paragraph newsdetective data.
 * Also copies the production NewsDetective engine/UI/CSS assets into the
 * target book's shared directory.
 *
 * Run: MODULE_ROOT="<book-path>" node build-scripts/platform/build-newsdetective-shells.js
 */

const fs = require("fs");
const path = require("path");
const { loadConfig } = require("../lib/lib-deploy-config");

const PLATFORM_ROOT = path.resolve(__dirname, "../..");
const ENGINES_DIR = path.join(PLATFORM_ROOT, "engines");
const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, "../..");
const CONFIG = loadConfig(MODULE_ROOT);
const DATA_DIR = path.join(MODULE_ROOT, "shared", "newsdetective");
const SHARED_DIR = path.join(MODULE_ROOT, "shared");
const DASH = "\u2013";

const HEADER_JS = "// AUTO-COPIED FROM 4veco-platform/engines/ - DO NOT EDIT HERE\n";
const HEADER_CSS = "/* AUTO-COPIED FROM 4veco-platform/engines/ - DO NOT EDIT HERE */\n";

function escapeHtml(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
}

function headerFor(file) {
    return file.endsWith(".css") ? HEADER_CSS : HEADER_JS;
}

function copyProductionAssets() {
    fs.mkdirSync(SHARED_DIR, { recursive: true });
    for (const file of ["newsdetective-engine.js", "newsdetective-ui.js", "newsdetective.css"]) {
        const src = path.join(ENGINES_DIR, file);
        const dst = path.join(SHARED_DIR, file);
        if (!fs.existsSync(src)) {
            throw new Error(`Missing production NewsDetective asset: ${src}`);
        }
        fs.writeFileSync(dst, headerFor(file) + fs.readFileSync(src, "utf8"), "utf8");
        console.log(`  [asset] ${file}`);
    }
}

function loadNewsDetectiveData(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    return new Function(`${content}\nreturn NEWS_DETECTIVE_DATA;`)();
}

function renderFacts(article) {
    if (!Array.isArray(article.facts) || article.facts.length === 0) return "";
    const facts = article.facts.map(fact => {
        const strong = fact && (fact.value || fact.title || fact.label || fact.strong || fact.key || "");
        const detail = fact && (fact.detail || fact.caption || fact.text || fact.description || fact.span || "");
        if (!strong && !detail) return "";
        return `<div class="fact"><strong>${escapeHtml(strong)}</strong><span>${escapeHtml(detail)}</span></div>`;
    }).filter(Boolean).join("");
    return facts ? `<div class="article-facts">${facts}</div>` : "";
}

function renderArticleCard(article, options = {}) {
    const heading = options.heading || "h2";
    const kicker = options.kicker || "Economisch nieuws";
    const aria = options.aria || "Nieuwsartikel";
    const source = article.source || "Bron";
    const sourceDate = article.sourceDate || "";
    const facts = renderFacts(article);
    const sourceHtml = article.sourceUrl
        ? `<a href="${escapeAttr(article.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(source)}</a>`
        : `<span>${escapeHtml(source)}</span>`;

    return `<article class="article-card" aria-label="${escapeAttr(aria)}">
              <div class="article-kicker">${escapeHtml(kicker)}</div>
              <div class="article-meta"><span>${sourceHtml}</span><span>${escapeHtml(sourceDate)}</span></div>
              <${heading}>${escapeHtml(article.headline)}</${heading}>
              <p class="article-body" data-article-body="full">${escapeHtml(article.body)}</p>${facts ? `
              ${facts}` : ""}
            </article>`;
}

function generateShell(parNr, paragraph, chapter, data) {
    const sharedPath = "../../shared";
    const article = data.article || {};
    const bookLabel = `Boek ${CONFIG.nr}`;
    const chapterLabel = chapter ? `Hoofdstuk ${chapter.number}` : "Hoofdstuk";
    const chapterName = chapter ? chapter.name : "";
    const parName = (data.meta && data.meta.parName) || paragraph.name;

    return `<!doctype html>
<html lang="nl" data-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(parNr)} ${escapeHtml(parName)} - Nieuws-detective</title>
    <link rel="stylesheet" href="${sharedPath}/newsdetective.css">
</head>
<body data-layout="news-detective-v2">
  <div class="app-shell" id="nd-app">
    <aside class="sidebar" aria-label="Paragraafnavigatie">
      <div class="brand">
        <div class="brand-mark">4V</div>
        <div>
          <strong>4veco</strong>
          <small>Nieuws-detective</small>
        </div>
      </div>
      <p class="sidebar-section-title">Paragraaf</p>
      <a class="side-link" href="index.html"><span class="side-number">${escapeHtml(parNr)}</span><span>${escapeHtml(parName)}</span></a>
      <p class="sidebar-section-title">Route</p>
      <span class="side-link current" aria-current="page"><span class="side-number">Start</span><span>Nieuws-detective</span></span>
    </aside>

    <main class="content">
      <div class="topbar">
        <nav class="breadcrumb" aria-label="Kruimelpad">
          <span>${escapeHtml(bookLabel)}</span><span>&rsaquo;</span><span>${escapeHtml(chapterLabel)}</span><span>&rsaquo;</span><span>${escapeHtml(parNr)}</span><span>&rsaquo;</span><span>Nieuws-detective</span>
        </nav>
        <button class="theme-note" type="button" id="themeToggle" aria-label="Wissel tussen licht en donker thema">Licht / donker</button>
      </div>

      <section class="hero" aria-labelledby="page-title">
        <div class="hero-grid">
          <div>
            <p class="eyebrow">Start &middot; actuele context</p>
            <h1 id="page-title">Nieuws-detective</h1>
            <p class="lead">Analyseer een economisch nieuwsbericht in vier korte ronden. Het artikel blijft tijdens het spel volledig leesbaar in een vaste dossierkolom.</p>
          </div>
          <aside class="target-panel" aria-label="Voortgang">
            <h2>Onderzoeksroute</h2>
            <p>Lees het dossier, beantwoord vier vragen, en gebruik het artikel steeds als bewijs.</p>
            <div class="progress-rail" id="progressRail"></div>
          </aside>
        </div>
      </section>

      <section id="screen-start" class="screen active">
        <div class="intro-card">
          <div class="start-card">
            <p class="eyebrow">Onderzoek openen</p>
            <h2 id="startTitle">${escapeHtml(article.headline || "Nieuws-detective")}</h2>
            <p>Je onderzoekt of je een nieuwsbericht economisch kunt lezen: welk concept speelt hier, welke gevolgen volgen logisch, welk model past, en welke analysefout zie je?</p>
            <div class="mini-route" aria-label="Rondes">
              <span>Concept</span><span>Gevolg</span><span>Model</span><span>Fout</span>
            </div>
            <div class="actions" style="justify-content:flex-start">
              <button class="btn btn-primary" type="button" id="startBtn">Start het onderzoek &rarr;</button>
            </div>
          </div>
          <div id="startArticle">
            ${renderArticleCard(article, { heading: "h2", kicker: "Economisch nieuws", aria: "Nieuwsartikel" })}
          </div>
        </div>
      </section>

      <section id="screen-game" class="screen">
        <div class="game-layout">
          <div class="article-dossier">
            <div id="gameArticle">
              ${renderArticleCard(article, { heading: "h3", kicker: "Dossier - blijft leesbaar", aria: "Nieuwsartikel blijft leesbaar" })}
            </div>
            <p class="dossier-note">Geen tekstafkap: het artikel is volledig zichtbaar of scrollt in deze dossierkolom.</p>
          </div>
          <div class="round-card" id="roundCard"></div>
        </div>
      </section>

      <section id="screen-result" class="screen">
        <div class="result-card" id="resultCard"></div>
      </section>
    </main>
  </div>

  <script src="${sharedPath}/newsdetective/${parNr}.js"></script>
  <script src="${sharedPath}/adaptive-seam.js"></script>
  <script src="${sharedPath}/newsdetective-engine.js"></script>
  <script src="${sharedPath}/newsdetective-ui.js"></script>
</body>
</html>`;
}

function main() {
    if (!fs.existsSync(DATA_DIR)) {
        console.log("No newsdetective data directory - nothing to generate.");
        return;
    }

    copyProductionAssets();

    const dataFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".js")).sort();
    console.log(`Found ${dataFiles.length} newsdetective data file(s)\n`);

    let generated = 0;
    let errors = 0;

    for (const file of dataFiles) {
        const parNr = file.replace(".js", "");
        const paragraph = CONFIG.paragraphIndex[parNr];
        if (!paragraph) {
            console.warn(`  [skip] ${parNr}: not declared in manifest`);
            continue;
        }
        const found = CONFIG.findParagraphFolder(parNr);
        if (!found) {
            console.error(`  [error] ${parNr}: paragraph folder not found on disk`);
            errors++;
            continue;
        }

        const chapter = CONFIG.chapterOf(parNr);
        const data = loadNewsDetectiveData(path.join(DATA_DIR, file));
        const fileName = `${parNr} ${paragraph.name} ${DASH} nieuws-detective.html`;
        const filePath = path.join(found.fullPath, fileName);
        fs.writeFileSync(filePath, generateShell(parNr, paragraph, chapter, data), "utf8");
        console.log(`  [write] ${fileName}`);
        generated++;
    }

    console.log(`\nDone: ${generated} generated, ${errors} errors`);
}

main();
