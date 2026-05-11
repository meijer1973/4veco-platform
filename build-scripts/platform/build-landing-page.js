/**
 * Build Landing Pages (flat layout)
 *
 * Generates index.html at three levels:
 * - Book page      (overview of all chapters)
 * - Chapter pages  (overview of paragrafen in that chapter)
 * - Paragraaf pages (file dashboard with Voorbereiden / Oefenen / Leren)
 *
 * All pages include a left navigation sidebar showing the full book structure.
 *
 * Target metadata — chapter list, paragraph list, domain assignments — comes
 * from the target's own deploy-config.json manifest. See
 * build-scripts/lib/lib-deploy-config.js.
 *
 * Paragraph layout is flat: all companion files sit directly at the paragraph
 * root (no 1. Voorbereiden / 2. Leren / 3. Oefenen subfolders). Section
 * membership is derived from filename patterns only.
 *
 * Run: MODULE_ROOT="<target-book-path>" node build-scripts/platform/build-landing-page.js
 */
const fs = require("fs");
const path = require("path");
const { loadConfig } = require("../lib/lib-deploy-config");

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const MODULE_BASE = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.join(__dirname, "../..");

const CONFIG = loadConfig(MODULE_BASE);

const ONLY_ID = null;
const DRY_RUN = false;

// Temporarily hide the task rows (basisopgaven, middenopgaven, verrijkingsopgaven)
const HIDE_TASK_ROWS = false;

console.log(`Target: ${CONFIG.displayLabel} (${CONFIG.moduleRoot})`);

// ═══════════════════════════════════════════════════════════════════════════
// DOMAIN COLORS — platform-universal palette
// ═══════════════════════════════════════════════════════════════════════════

const DOMAIN_COLORS = {
  teal:   { main: "#17A2B8", light: "#E8F8FB", dark: "#117A8B" },
  blue:   { main: "#1A5276", light: "#EBF5FB", dark: "#154360" },
  amber:  { main: "#E67E22", light: "#FEF5E7", dark: "#BA6A1C" },
  green:  { main: "#1E8449", light: "#E8F8F0", dark: "#186A3B" },
  purple: { main: "#7D3C98", light: "#F4ECF7", dark: "#6C3483" },
};

// Collapse the deploy-config domain-color keys onto the three accent tokens
// that engines/voorkennis.css defines (economisch / wiskunde / grafisch).
// The paragraaf-level index.html is generated against that stylesheet, so
// every page needs exactly one of these three as its data-accent-domain.
const DOMAIN_SHARED_TOKEN = {
  amber:  "economisch",
  blue:   "wiskunde",
  green:  "grafisch",
  teal:   "wiskunde",
  purple: "economisch",
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION RULES — filename → section mapping (flat layout)
// ═══════════════════════════════════════════════════════════════════════════

const DELETE_PATTERNS = [/^desktop\.ini$/i, /\.zip$/i, /\.tmp$/i];

function cleanDir(files) {
  return files.filter(f => !f.startsWith("~$") && !f.startsWith("."));
}

// ═══════════════════════════════════════════════════════════════════════════
// FILE SCANNER (flat layout: all companion files at paragraph root)
// ═══════════════════════════════════════════════════════════════════════════

function scanFiles(paragraafPath) {
  const result = {
    voorbereiden: { instapquiz: null, voorkennis: null, leesdit: null, nieuwsdetective: null },
    leren:        { presentatie: null, vaardigheden: null, stappenplan: null, youtube: null, nieuws: null, samenvatting: null },
    oefenen:      { redeneerSpel: null, wiskundevaardigheden: null, begeleide: null, basis: null, midden: null, verrijking: null },
    lesboek:      { paragraaf: null, opgaven: null, antwoorden: null },
  };
  if (!fs.existsSync(paragraafPath)) return result;

  const files = cleanDir(fs.readdirSync(paragraafPath));

  // Housekeeping: delete obvious junk (desktop.ini, .zip, .tmp) at root.
  for (const f of files) {
    if (DELETE_PATTERNS.some(p => p.test(f))) {
      if (!DRY_RUN) fs.unlinkSync(path.join(paragraafPath, f));
      console.log(`  [delete] ${f}`);
    }
  }

  // Helper: find first file matching a pattern.
  const find = (re) => files.find(f => re.test(f)) || null;

  // Helper: capture both .html and .docx for resources that have web
  // companions. Returns null if neither exists, otherwise an object with
  // {html, docx} (either or both may be null).
  const findHtmlDocx = (htmlRe, docxRe) => {
    const html = files.find(f => htmlRe.test(f)) || null;
    const docx = files.find(f => docxRe.test(f)) || null;
    if (!html && !docx) return null;
    return { html, docx };
  };

  // Voorbereiden
  result.voorbereiden.instapquiz      = find(/instapquiz\.html$/i);
  result.voorbereiden.nieuwsdetective = find(/nieuws-detective\.html$/i);
  result.voorbereiden.voorkennis      = findHtmlDocx(/uitleg voorkennis\.html$/i, /uitleg voorkennis\.docx$/i);
  result.voorbereiden.leesdit         = find(/^Lees dit/i);

  // Leren
  result.leren.presentatie   = find(/presentatie\.pptx$/i);
  result.leren.vaardigheden  = findHtmlDocx(/uitleg vaardigheden\.html$/i, /uitleg vaardigheden\.docx$/i);
  result.leren.stappenplan   = find(/stappenplan\.html$/i);
  result.leren.youtube       = find(/youtube.videos\.html$/i);
  result.leren.nieuws        = findHtmlDocx(/nieuws met visual\.html$/i, /nieuws met visual\.docx$/i);
  result.leren.samenvatting  = findHtmlDocx(/samenvatting\.html$/i, /samenvatting\.docx$/i);

  // Oefenen — interactive shells sit at paragraph root; opgaven are flat files
  // with "– basis –", "– midden –", "– verrijking –", "– begeleide inoefening –"
  // infix. The interactive begeleide inoefening HTML has no infix before ".html".
  result.oefenen.redeneerSpel          = find(/redeneer-spel\.html$/i);
  result.oefenen.wiskundevaardigheden  = find(/wiskundevaardigheden\.html$/i);

  const findPair = (label) => {
    const esc = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\u2013 ${esc} \\u2013 (vragen|antwoorden)\\.docx$`, "i");
    const pair = { label, vragen: null, antwoorden: null };
    for (const f of files) {
      const m = f.match(re);
      if (!m) continue;
      if (m[1].toLowerCase() === "vragen") pair.vragen = f;
      else pair.antwoorden = f;
    }
    if (!pair.vragen && !pair.antwoorden) return null;
    return pair;
  };

  const begeleidePair = findPair("begeleide inoefening");
  const begeleideInteractive = find(/– begeleide inoefening\.html$/i);
  if (begeleidePair || begeleideInteractive) {
    result.oefenen.begeleide = {
      vragen: begeleidePair ? begeleidePair.vragen : null,
      antwoorden: begeleidePair ? begeleidePair.antwoorden : null,
      interactief: begeleideInteractive,
    };
  }

  result.oefenen.basis      = findPair("basis");
  result.oefenen.midden     = findPair("midden");
  result.oefenen.verrijking = findPair("verrijking");

  // Lesboek — the textbook source files that sit alongside companion artifacts.
  // Each entry is {html, pdf} (either may be null) so the tile can offer a web
  // view as primary and a PDF as the download option. Filenames match the
  // Part A textbook convention: "<id> <name> – paragraaf.{html,pdf}", same
  // for "– opgaven" and "– antwoorden".
  const findHtmlPdf = (htmlRe, pdfRe) => {
    const html = files.find(f => htmlRe.test(f)) || null;
    const pdf  = files.find(f => pdfRe.test(f)) || null;
    if (!html && !pdf) return null;
    return { html, pdf };
  };
  result.lesboek.paragraaf  = findHtmlPdf(/– paragraaf\.html$/i,  /– paragraaf\.pdf$/i);
  result.lesboek.opgaven    = findHtmlPdf(/– opgaven\.html$/i,    /– opgaven\.pdf$/i);
  result.lesboek.antwoorden = findHtmlPdf(/– antwoorden\.html$/i, /– antwoorden\.pdf$/i);

  return result;
}

function encPath(segments) { return segments.map(s => encodeURIComponent(s)).join("/"); }

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════

function renderNav(resolvedMap, pageType, currentId) {
  const grouped = {};
  for (const ch of CONFIG.chapters) {
    grouped[ch.id] = CONFIG.paragraphs.filter(p => p.chapter === ch.id && !CONFIG.isHidden(p.id));
  }

  function navLink(targetType, targetChapter, targetParagraaf) {
    const ch = CONFIG.chapterIndex[targetChapter];
    const chFolder = ch ? encodeURIComponent(ch.folder) : "";
    const pFolder = targetParagraaf ? encodeURIComponent(resolvedMap[targetParagraaf].folderName) : null;

    if (pageType === "book") {
      if (targetType === "book") return "index.html";
      if (targetType === "chapter") return `${chFolder}/index.html`;
      return `${chFolder}/${pFolder}/index.html`;
    }
    if (pageType === "chapter") {
      if (targetType === "book") return "../index.html";
      if (targetType === "chapter") {
        if (targetChapter === currentId) return "index.html";
        return `../${chFolder}/index.html`;
      }
      if (targetChapter === currentId) return `${pFolder}/index.html`;
      return `../${chFolder}/${pFolder}/index.html`;
    }
    // pageType === "paragraaf"
    const curChapter = currentId.substring(0, currentId.lastIndexOf("."));
    if (targetType === "book") return "../../index.html";
    if (targetType === "chapter") {
      if (targetChapter === curChapter) return "../index.html";
      return `../../${chFolder}/index.html`;
    }
    if (targetChapter === curChapter) return `../${pFolder}/index.html`;
    return `../../${chFolder}/${pFolder}/index.html`;
  }

  let html = "";

  // Book link
  const isBookActive = pageType === "book";
  html += `    <a class="nav-module${isBookActive ? " active" : ""}" href="${navLink("book")}">${CONFIG.displayLabel}</a>\n`;

  for (const ch of CONFIG.chapters) {
    const paragrafen = grouped[ch.id];
    if (!paragrafen.length) continue;
    const dc = DOMAIN_COLORS[ch.domain];
    const isCurrentChapter = (pageType === "chapter" && currentId === ch.id)
      || (pageType === "paragraaf" && currentId.startsWith(ch.id + "."));
    const expanded = isCurrentChapter;

    html += `    <div class="nav-chapter${expanded ? " expanded" : ""}">\n`;
    html += `      <a class="nav-ch-title${pageType === "chapter" && currentId === ch.id ? " active" : ""}" href="${navLink("chapter", ch.id)}" style="--ch-color: ${dc.main}">\n`;
    html += `        <span class="nav-dot"></span>\n`;
    html += `        <span class="nav-ch-label">H${ch.number} ${ch.name}</span>\n`;
    html += `        <svg class="nav-arrow" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>\n`;
    html += `      </a>\n`;
    html += `      <div class="nav-items">\n`;

    for (const p of paragrafen) {
      if (!resolvedMap[p.id]) continue;
      const isActive = pageType === "paragraaf" && currentId === p.id;
      html += `        <a class="nav-item${isActive ? " active" : ""}" href="${navLink("paragraaf", ch.id, p.id)}" style="--ch-color: ${dc.main}">${p.id} ${p.name}</a>\n`;
    }

    html += `      </div>\n`;
    html += `    </div>\n`;
  }

  return html;
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED CSS
// ═══════════════════════════════════════════════════════════════════════════

function sharedCSS() {
  // Book/chapter-page-specific overrides on top of voorkennis.css.
  // The shared editorial stylesheet owns body, hero, sidebar baseline,
  // .content, main, .section, responsive sidebar collapse, and theme tokens.
  // This block only adds selectors voorkennis.css doesn't define:
  // landing-sidebar nav (book + chapter), .chapter-card, .para-card, footer,
  // and the docx/pptx in-browser viewer panel.
  return `
  /* Sidebar — book page top-level + chapter expandable list */
  .nav-module {
    display: block; padding: 0.5rem 1rem 0.7rem; font-size: 0.78rem; font-weight: 700;
    color: var(--ink); border-bottom: 1px solid var(--border); margin-bottom: 0.5rem;
    text-decoration: none;
  }
  .nav-module:hover { color: var(--accent); }
  .nav-module.active { color: var(--ink); background: var(--bg-lift); }

  .nav-chapter { margin-bottom: 0.15rem; }
  .nav-ch-title {
    display: flex; align-items: center; gap: 0.45rem;
    padding: 0.4rem 1rem; font-size: 0.78rem; font-weight: 700; color: var(--ink);
    cursor: pointer; border-left: 3px solid transparent;
    text-decoration: none;
  }
  .nav-ch-title:hover { background: var(--bg-lift); }
  .nav-ch-title.active { border-left-color: var(--ch-color); background: var(--bg-lift); }
  .nav-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
    background: var(--ch-color);
  }
  .nav-ch-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .nav-arrow {
    width: 14px; height: 14px; flex-shrink: 0; stroke: var(--ink-soft); fill: none;
    stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
    transition: transform 0.2s;
  }
  .nav-chapter.expanded .nav-arrow { transform: rotate(180deg); }

  .nav-items { display: none; padding: 0.1rem 0 0.3rem; }
  .nav-chapter.expanded .nav-items { display: block; }
  /* Scope landing-sidebar .nav-item override so editorial .nav-item
     rules in voorkennis.css don't apply to book/chapter sidebar links. */
  .landing-sidebar .nav-item {
    display: block; padding: 0.3rem 1rem 0.3rem 2.2rem;
    font-size: 0.72rem; color: var(--ink-soft); border-left: 3px solid transparent;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    text-decoration: none;
    background: transparent;
  }
  .landing-sidebar .nav-item:hover { color: var(--ink); background: var(--bg-lift); }
  .landing-sidebar .nav-item.active {
    color: var(--ink); font-weight: 700;
    border-left-color: var(--ch-color); background: var(--bg-lift);
  }

  /* Chapter card (book page) */
  .chapter-card {
    display: block; background: var(--bg-card); border-radius: 10px;
    border-left: 5px solid var(--ch-color, var(--accent));
    box-shadow: var(--shadow-card); padding: 1.5rem 1.8rem;
    margin-bottom: 1.2rem;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    text-decoration: none; color: inherit;
  }
  .chapter-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lift); }
  .chapter-card h3 {
    font-family: var(--heading-font); font-weight: var(--heading-weight); font-style: var(--heading-style);
    font-size: 1.3rem; color: var(--ink); margin-bottom: 0.75rem;
  }
  .chapter-card h3 .ch-num { color: var(--ch-color, var(--accent)); margin-right: 0.3rem; }
  .chapter-card-count { font-size: 0.8rem; color: var(--ink-soft); margin-bottom: 0.75rem; }
  .chapter-card-items { display: flex; flex-wrap: wrap; gap: 0.45rem; }
  .chapter-card-item {
    font-size: 0.75rem; padding: 0.3rem 0.75rem; border-radius: 5px;
    background: var(--bg-lift); color: var(--ink);
    border: 1px solid var(--border);
  }

  /* Paragraaf card (chapter page) */
  .para-card {
    display: flex; align-items: center; gap: 1rem;
    background: var(--bg-card); border-radius: 10px;
    border-left: 5px solid var(--ch-color, var(--accent));
    box-shadow: var(--shadow-card); padding: 1.2rem 1.5rem;
    margin-bottom: 0.75rem;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    text-decoration: none; color: inherit;
  }
  .para-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lift); }
  .para-num {
    flex-shrink: 0; width: 44px; height: 44px; border-radius: 10px;
    background: var(--ch-color, var(--accent)); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; font-weight: 700;
  }
  .para-info h3 {
    font-family: var(--heading-font); font-weight: var(--heading-weight); font-style: var(--heading-style);
    font-size: 1.1rem; color: var(--ink); margin-bottom: 0.15rem;
  }
  .para-info p { font-size: 0.8rem; color: var(--ink-soft); }

  /* Footer */
  footer {
    text-align: center; padding: 1.5rem 2rem; font-size: 0.75rem;
    color: var(--ink-soft); border-top: 1px solid var(--border);
  }

  /* Document viewer (chapter page docx/pptx in-browser preview) */
  .viewer-panel {
    display: none; flex-direction: column;
    width: 100%; height: 100vh; position: sticky; top: 0;
  }
  .viewer-panel.active { display: flex; }
  .content.hidden { display: none; }
  .viewer-bar {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.5rem 1rem; background: var(--ink); color: var(--bg);
    font-size: 0.85rem; min-height: 2.5rem; flex-shrink: 0;
  }
  .viewer-title { flex: 1; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .viewer-download {
    color: var(--bg); background: var(--accent); padding: 0.3rem 0.8rem;
    border-radius: 4px; font-size: 0.8rem; text-decoration: none;
  }
  .viewer-download:hover { opacity: 0.9; }
  .viewer-close {
    background: none; border: 1px solid var(--border-lift); color: var(--bg);
    padding: 0.3rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;
  }
  .viewer-close:hover { background: var(--bg-lift); color: var(--ink); }
  .viewer-frame { flex: 1; border: none; width: 100%; background: var(--bg-card); }`;
}

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════

const ICONS = {
  quiz:      '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none"/>',
  book:      '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  info:      '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  monitor:   '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  doc:       '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  play:      '<polygon points="5 3 19 12 5 21 5 3"/>',
  newspaper: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2V9"/><line x1="10" y1="8" x2="18" y2="8"/><line x1="10" y1="12" x2="18" y2="12"/><line x1="10" y1="16" x2="14" y2="16"/>',
  search:    '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  check:     '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  users:     '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  star0:     '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none"/>',
  star1:     '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none"/><polygon points="12 5 13.85 9.26 18.5 9.85 15.25 12.93 16.05 17.55 12 15.36 7.95 17.55 8.75 12.93 5.5 9.85 10.15 9.26 12 5" fill="currentColor" stroke="none"/>',
  star2:     '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>',
  hamburger: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  puzzle:    '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 2 17.5v-1A2.5 2.5 0 0 1 6.44 14H12" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44A2.5 2.5 0 0 0 22 17.5v-1a2.5 2.5 0 0 0-4.44-2.5H12" fill="none" stroke="currentColor" stroke-width="2"/>',
  layers:    '<path d="M12 2L2 7l10 5 10-5-10-5z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 17l10 5 10-5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 12l10 5 10-5" fill="none" stroke="currentColor" stroke-width="2"/>',
  steps:     '<line x1="12" y1="2" x2="12" y2="22"/><polyline points="8 6 12 2 16 6"/><circle cx="12" cy="8" r="2" fill="currentColor" stroke="none"/><circle cx="12" cy="14" r="2" fill="currentColor" stroke="none"/><circle cx="12" cy="20" r="2" fill="currentColor" stroke="none"/>',
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE SHELL — wraps nav + content
// ═══════════════════════════════════════════════════════════════════════════

function pageShell(title, dc, navHTML, bodyContent, sharedPrefix, accentToken) {
  const layoutName = sharedPrefix === "shared" ? "landing-book-v1" : "landing-chapter-v1";
  return `<!DOCTYPE html>
<html lang="nl" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script>(function(){try{var m=localStorage.getItem('quizMode')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',m);}catch(e){}})();</script>
<title>${title}</title>
<link rel="stylesheet" href="${sharedPrefix}/voorkennis.css">
<style>${sharedCSS()}</style>
</head>
<body data-layout="${layoutName}" data-accent-domain="${accentToken}">
<button class="sidebar-toggle" id="sidebarToggle" aria-label="Menu openen">
  <svg viewBox="0 0 24 24">${ICONS.hamburger}</svg>
</button>
<div class="sidebar-overlay" id="sidebarOverlay"></div>
<div class="page-layout">
  <nav class="sidebar landing-sidebar" id="sidebar">
${navHTML}
  </nav>
  <div class="content" id="content">
${bodyContent}
  </div>
  <div class="viewer-panel" id="viewerPanel">
    <div class="viewer-bar">
      <span class="viewer-title" id="viewerTitle"></span>
      <a class="viewer-download" id="viewerDownload" href="#" download>Download</a>
      <button class="viewer-close" onclick="closeViewer()">Sluiten &times;</button>
    </div>
    <iframe id="viewerFrame" class="viewer-frame" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
  </div>
</div>
<script src="${sharedPrefix}/voorkennis.js"></script>
<script>
document.querySelectorAll('.nav-ch-title').forEach(el => {
  el.addEventListener('click', function(e) {
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    this.parentElement.classList.toggle('expanded');
  });
});
document.querySelectorAll('.nav-ch-title').forEach(el => {
  el.addEventListener('dblclick', function() { window.location = this.href; });
});

function openViewer(href, title) {
  var abs = new URL(href, window.location.href).href;
  var viewerURL = "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(abs);
  document.getElementById("viewerTitle").textContent = title;
  document.getElementById("viewerDownload").href = href;
  document.getElementById("viewerFrame").src = viewerURL;
  document.getElementById("viewerPanel").classList.add("active");
  document.getElementById("content").classList.add("hidden");
}
function closeViewer() {
  document.getElementById("viewerPanel").classList.remove("active");
  document.getElementById("content").classList.remove("hidden");
  document.getElementById("viewerFrame").src = "about:blank";
}

if (window.innerWidth > 768) {
  document.addEventListener("click", function(e) {
    var link = e.target.closest("a[href]");
    if (!link) return;
    var href = link.getAttribute("href");
    if (!href) return;
    var lower = href.toLowerCase();
    if (lower.endsWith(".docx") || lower.endsWith(".pptx")) {
      e.preventDefault();
      var name = decodeURIComponent(href.split("/").pop()).replace(/\\.[^.]+$/, "");
      openViewer(href, name);
    }
  });
}
</script>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// BOOK PAGE (top-level index.html at the target root)
// ═══════════════════════════════════════════════════════════════════════════

function renderBookPage(resolvedMap) {
  const dc = { main: "#1E2761", light: "#EBF5FB", dark: "#154360" }; // navy
  const navHTML = renderNav(resolvedMap, "book", null);

  let bodyHTML = `
<header class="hero">
  <div class="hero-inner">
    <span class="hero-badge">Boek ${CONFIG.nr}</span>
    <h1>${CONFIG.name}</h1>
  </div>
</header>
<main>`;

  for (const ch of CONFIG.chapters) {
    const paragrafen = CONFIG.paragraphs.filter(p => p.chapter === ch.id && !CONFIG.isHidden(p.id));
    if (!paragrafen.length) continue;
    const dc2 = DOMAIN_COLORS[ch.domain];
    const chFolder = encodeURIComponent(ch.folder);

    bodyHTML += `
  <a class="chapter-card" href="${chFolder}/index.html" style="--ch-color: ${dc2.main}">
    <h3><span class="ch-num">H${ch.number}</span>${ch.name}</h3>
    <div class="chapter-card-count">${paragrafen.length} paragrafen</div>
    <div class="chapter-card-items">
      ${paragrafen.map(p => `<span class="chapter-card-item">${p.id} ${p.name}</span>`).join("\n      ")}
    </div>
  </a>`;
  }

  bodyHTML += `
</main>
<footer>Economie VWO 4 &middot; ${CONFIG.displayLabel}</footer>`;

  return pageShell(`${CONFIG.displayLabel}`, dc, navHTML, bodyHTML, "shared", "wiskunde");
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER PAGE
// ═══════════════════════════════════════════════════════════════════════════

function renderChapterPage(chapterId, resolvedMap) {
  const ch = CONFIG.chapterIndex[chapterId];
  const paragrafen = CONFIG.paragraphs.filter(p => p.chapter === chapterId && !CONFIG.isHidden(p.id));
  const dc = DOMAIN_COLORS[ch.domain];
  const navHTML = renderNav(resolvedMap, "chapter", chapterId);

  let bodyHTML = `
<header class="hero">
  <div class="hero-inner">
    <a class="back-link" href="../index.html"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg> Boek ${CONFIG.nr}</a>
    <span class="hero-badge">Hoofdstuk ${ch.number}</span>
    <h1>${ch.name}</h1>
    <p class="hero-sub">${CONFIG.displayLabel}</p>
  </div>
</header>
<main>`;

  for (const p of paragrafen) {
    const resolved = resolvedMap[p.id];
    if (!resolved) continue;
    const pFolder = encodeURIComponent(resolved.folderName);
    const pNum = p.id.split(".").pop();
    bodyHTML += `
  <a class="para-card" href="${pFolder}/index.html" style="--ch-color: ${dc.main}">
    <div class="para-num">${p.id}</div>
    <div class="para-info">
      <h3>${p.name}</h3>
      <p>Paragraaf ${pNum}</p>
    </div>
  </a>`;
  }

  bodyHTML += `
</main>
<footer>Economie VWO 4 &middot; ${CONFIG.displayLabel}</footer>`;

  const accentToken = DOMAIN_SHARED_TOKEN[ch.domain] || "wiskunde";
  return pageShell(`${CONFIG.chapterFullLabel(chapterId)} – Lesmateriaal`, dc, navHTML, bodyHTML, "../shared", accentToken);
}

// ═══════════════════════════════════════════════════════════════════════════
// PARAGRAAF PAGE
// ═══════════════════════════════════════════════════════════════════════════

function renderParagraafPage(paragraaf, files, _resolvedMap) {
  const chapterFull = CONFIG.chapterFullLabel(paragraaf.chapter);
  const accentToken = DOMAIN_SHARED_TOKEN[paragraaf.domain] || "economisch";

  const ext = (f) => f ? f.split(".").pop().toLowerCase() : "docx";

  function resourceCard(href, icon, title, desc, fileType, extraClass = "") {
    if (!href) return "";
    return `
        <a class="resource-card ${extraClass}" href="${href}">
          <div class="resource-card-icon"><svg viewBox="0 0 24 24">${icon}</svg></div>
          <div class="resource-card-body">
            <h3>${title}</h3>
            <p>${desc}</p>
            <span class="resource-card-type">${fileType}</span>
          </div>
        </a>`;
  }

  // Card for resources that have both an .html web companion and a .docx
  // download. Primary action: open the HTML (whole card clickable via a
  // cover-link). Secondary action: download the .docx (sub-link with a
  // higher z-index so it's clickable independently of the cover).
  // If only one format exists, falls through to the regular resourceCard.
  function resourceCardWithSource(pair, icon, title, desc) {
    if (!pair) return "";
    if (pair.html && !pair.docx) return resourceCard(encPath([pair.html]), icon, title, desc, "html");
    if (!pair.html && pair.docx) return resourceCard(encPath([pair.docx]), icon, title, desc, "docx");
    // Both formats present — emit primary HTML cover-link + Word sub-link.
    const htmlHref = encPath([pair.html]);
    const docxHref = encPath([pair.docx]);
    return `
        <div class="resource-card resource-card-with-source">
          <a class="resource-card-cover-link" href="${htmlHref}" aria-label="${title} (web)"></a>
          <div class="resource-card-icon"><svg viewBox="0 0 24 24">${icon}</svg></div>
          <div class="resource-card-body">
            <h3>${title}</h3>
            <p>${desc}</p>
            <span class="resource-card-type">html</span>
            <div class="resource-sub-links">
              <a class="resource-sub-link" href="${docxHref}" download>&darr; Download als Word</a>
            </div>
          </div>
        </div>`;
  }

  function exercisePairCard(pair, icon, title, desc) {
    if (!pair) return "";
    const vragenHref = pair.vragen ? encPath([pair.vragen]) : null;
    const antwHref = pair.antwoorden ? encPath([pair.antwoorden]) : null;
    return `
        <div class="resource-card resource-card-pair">
          <div class="resource-card-icon"><svg viewBox="0 0 24 24">${icon}</svg></div>
          <div class="resource-card-body">
            <h3>${title}</h3>
            <p>${desc}</p>
            <div class="resource-sub-links">
              ${vragenHref ? `<a class="resource-sub-link" href="${vragenHref}">Vragen</a>` : ""}
              ${antwHref ? `<a class="resource-sub-link" href="${antwHref}">Antwoorden</a>` : ""}
            </div>
          </div>
        </div>`;
  }

  function interactiveCard(href, icon, title, desc) {
    return `
        <a class="resource-card resource-card-interactive" href="${href}">
          <div class="resource-card-icon"><svg viewBox="0 0 24 24">${icon}</svg></div>
          <div class="resource-card-body">
            <h3>${title}</h3>
            <p>${desc}</p>
            <span class="resource-card-action">Spelen &rarr;</span>
          </div>
        </a>`;
  }

  function begeleidCard(data) {
    if (!data) return "";
    const links = [];
    if (data.interactief) links.push(`<a class="resource-sub-link" href="${encPath([data.interactief])}">Interactief</a>`);
    if (data.vragen)      links.push(`<a class="resource-sub-link" href="${encPath([data.vragen])}">Vragen (docx)</a>`);
    if (data.antwoorden)  links.push(`<a class="resource-sub-link" href="${encPath([data.antwoorden])}">Antwoorden (docx)</a>`);
    if (!links.length) return "";
    return `
        <div class="resource-card resource-card-interactive">
          <div class="resource-card-icon"><svg viewBox="0 0 24 24">${ICONS.users}</svg></div>
          <div class="resource-card-body">
            <h3>Begeleide inoefening</h3>
            <p>Oefenen met denkstappen en hints</p>
            <div class="resource-sub-links">${links.join("")}</div>
          </div>
        </div>`;
  }

  // Lesboek tile: primary opens the textbook HTML; sub-link downloads the PDF.
  // Mirrors resourceCardWithSource but the secondary surface is PDF, not DOCX,
  // so this card does NOT enter the docx/pptx in-browser viewer.
  function lesboekCard(pair, icon, title, desc) {
    if (!pair) return "";
    if (pair.html && !pair.pdf) return resourceCard(encPath([pair.html]), icon, title, desc, "html");
    if (!pair.html && pair.pdf) return resourceCard(encPath([pair.pdf]),  icon, title, desc, "pdf");
    const htmlHref = encPath([pair.html]);
    const pdfHref  = encPath([pair.pdf]);
    return `
        <div class="resource-card resource-card-with-source">
          <a class="resource-card-cover-link" href="${htmlHref}" aria-label="${title} (web)"></a>
          <div class="resource-card-icon"><svg viewBox="0 0 24 24">${icon}</svg></div>
          <div class="resource-card-body">
            <h3>${title}</h3>
            <p>${desc}</p>
            <span class="resource-card-type">html</span>
            <div class="resource-sub-links">
              <a class="resource-sub-link" href="${pdfHref}" download>&darr; Download als PDF</a>
            </div>
          </div>
        </div>`;
  }

  // Combined Lesboek tile for opgaven + antwoorden. Two HTML sub-links open
  // the web views; two PDF sub-links download. No primary cover-link, since
  // there is no single canonical destination for "exercises + answers".
  function lesboekPairCard(opgaven, antwoorden, icon, title, desc) {
    if (!opgaven && !antwoorden) return "";
    const link = (pair, label, kind) => {
      if (!pair) return "";
      const file = pair[kind];
      if (!file) return "";
      const href = encPath([file]);
      const dl = kind === "pdf" ? " download" : "";
      const text = kind === "pdf" ? `&darr; ${label} (PDF)` : label;
      return `<a class="resource-sub-link" href="${href}"${dl}>${text}</a>`;
    };
    const links = [
      link(opgaven,    "Opgaven",    "html"),
      link(antwoorden, "Antwoorden", "html"),
      link(opgaven,    "Opgaven",    "pdf"),
      link(antwoorden, "Antwoorden", "pdf"),
    ].filter(Boolean).join("");
    if (!links) return "";
    return `
        <div class="resource-card resource-card-pair">
          <div class="resource-card-icon"><svg viewBox="0 0 24 24">${icon}</svg></div>
          <div class="resource-card-body">
            <h3>${title}</h3>
            <p>${desc}</p>
            <div class="resource-sub-links">${links}</div>
          </div>
        </div>`;
  }

  const voorbereidenCards = [
    files.voorbereiden.instapquiz      ? resourceCard(encPath([files.voorbereiden.instapquiz]),      ICONS.quiz,   "Instapquiz",       "Test wat je al weet over deze stof", "html") : "",
    files.voorbereiden.voorkennis      ? resourceCardWithSource(files.voorbereiden.voorkennis,       ICONS.book,   "Voorkennis",       "Herhaal wat je nodig hebt voor deze les") : "",
    files.voorbereiden.nieuwsdetective ? resourceCard(encPath([files.voorbereiden.nieuwsdetective]), ICONS.search, "Nieuws-detective", "Ontdek de economie achter het nieuws", "html") : "",
  ].filter(Boolean).join("\n");

  const lerenCards = [
    files.leren.presentatie  ? resourceCard(encPath([files.leren.presentatie]),  ICONS.monitor,   "Presentatie",         "De les-presentatie met kernpunten", "pptx") : "",
    files.leren.vaardigheden ? resourceCardWithSource(files.leren.vaardigheden,  ICONS.doc,       "Uitleg vaardigheden", "Stap-voor-stap uitleg van de lesstof") : "",
    files.leren.stappenplan  ? resourceCard(encPath([files.leren.stappenplan]),  ICONS.steps,     "Stappenplan",         "Oefen de stappen van elke vaardigheid", "html") : "",
    files.leren.youtube      ? resourceCard(encPath([files.leren.youtube]),      ICONS.play,      "YouTube-video’s", "Video-uitleg bij de stof", "html") : "",
    files.leren.nieuws       ? resourceCardWithSource(files.leren.nieuws,        ICONS.newspaper, "Nieuws",              "Actueel artikel met verwerkingsvragen") : "",
    files.leren.samenvatting ? resourceCardWithSource(files.leren.samenvatting,  ICONS.check,     "Samenvatting",        "Overzicht van deze paragraaf") : "",
  ].filter(Boolean).join("\n");

  const oefenenRow = [];
  if (files.oefenen.redeneerSpel)         oefenenRow.push(interactiveCard(encPath([files.oefenen.redeneerSpel]),         ICONS.puzzle, "Redeneer-spel",        "Train je redeneervaardigheid met 5 spelmodi"));
  if (files.oefenen.wiskundevaardigheden) oefenenRow.push(interactiveCard(encPath([files.oefenen.wiskundevaardigheden]), ICONS.layers, "Wiskunde vaardigheden", "Oefen de wiskunde vaardigheden voor deze paragraaf"));
  const begeleidHTML = begeleidCard(files.oefenen.begeleide);
  if (begeleidHTML) oefenenRow.push(begeleidHTML);
  const oefenenCards = oefenenRow.join("\n");

  const taskCards = [
    exercisePairCard(files.oefenen.basis,      ICONS.star0, "Basisopgaven",       "Standaard opgaven"),
    exercisePairCard(files.oefenen.midden,     ICONS.star1, "Middenopgaven",      "Kortere set, meer zelfstandig"),
    exercisePairCard(files.oefenen.verrijking, ICONS.star2, "Verrijkingsopgaven", "Extra uitdaging"),
  ].filter(Boolean).join("\n");

  const lesboekCards = [
    lesboekCard(files.lesboek.paragraaf, ICONS.book, "Lesboek – uitleg", "De volledige paragraaf uit het lesboek"),
    lesboekPairCard(files.lesboek.opgaven, files.lesboek.antwoorden, ICONS.doc, "Lesboek – opgaven & antwoorden", "De opgaven en uitwerkingen uit het lesboek"),
  ].filter(Boolean).join("\n");

  const hasV = voorbereidenCards.trim().length > 0;
  const hasO = oefenenCards.trim().length > 0;
  const hasL = lerenCards.trim().length > 0;
  const hasT = !HIDE_TASK_ROWS && taskCards.trim().length > 0;
  const hasB = lesboekCards.trim().length > 0;

  // Per-section accent: the four section roles get distinct accents drawn
  // from the three shared tokens (economisch / wiskunde / grafisch) defined
  // in engines/voorkennis.css. The hero gradient and back-link continue to
  // use the paragraph-level accentToken; only the section chrome rotates.
  const SECTION_ACCENT = {
    voorbereiden: "wiskunde",
    oefenen:      "economisch",
    leren:        "grafisch",
    opgaven:      "economisch",
    lesboek:      "wiskunde",
  };

  const sections = [];
  if (hasV) sections.push({ id: "voorbereiden", num: 1, title: "Voorbereiden", hint: "Check wat je al weet en wat je nog nodig hebt", body: voorbereidenCards, accent: SECTION_ACCENT.voorbereiden });
  if (hasO) sections.push({ id: "oefenen",      num: 2, title: "Oefenen",      hint: "Kies een interactieve oefening",               body: oefenenCards,      accent: SECTION_ACCENT.oefenen });
  if (hasL) sections.push({ id: "leren",        num: 3, title: "Leren",        hint: "De les doorwerken: presentatie, uitleg en video’s", body: lerenCards,        accent: SECTION_ACCENT.leren });
  if (hasT) sections.push({ id: "opgaven",      num: 4, title: "Opgaven",      hint: "Oefen op je eigen niveau",                     body: taskCards,         accent: SECTION_ACCENT.opgaven });
  if (hasB) sections.push({ id: "lesboek",      num: sections.length + 1, title: "Lesboek", hint: "De originele teksten uit het lesboek", body: lesboekCards, accent: SECTION_ACCENT.lesboek });

  const sidebarItems = sections.map(s => `      <a class="nav-item domain-${s.accent}" href="#${s.id}" data-section="${s.id}">
        <span class="nav-number">${s.num}</span>
        <span class="nav-text">
          <span class="nav-title">${s.title}</span>
          <span class="nav-badge">${s.hint}</span>
        </span>
      </a>`).join("\n");

  const sectionsHTML = sections.map(s => `
      <section class="section" id="${s.id}">
        <div class="section-header border-${s.accent}">
          <span class="section-num bg-${s.accent}">${s.num}</span>
          <div class="section-title-group">
            <div class="section-title">${s.title}</div>
            <span class="section-badge badge-${s.accent}">${s.hint}</span>
          </div>
        </div>
        <div class="resource-grid">${s.body}
        </div>
      </section>`).join("\n");

  const chapterBackHref = "../index.html";
  const bookBackHref = "../../index.html";

  return `<!DOCTYPE html>
<html lang="nl" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script>(function(){try{var m=localStorage.getItem('quizMode')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',m);}catch(e){}})();</script>
<title>${paragraaf.id} ${paragraaf.name} – Lesmateriaal</title>
<link rel="stylesheet" href="../../shared/voorkennis.css">
<style>
  .sidebar-jump {
    display: block; padding: 0.55rem 1.1rem;
    font-size: 0.72rem; color: var(--ink-soft);
    border-bottom: 1px solid var(--border);
  }
  .sidebar-jump a { color: var(--accent); }
  .sidebar-jump a:hover { text-decoration: underline; }

  .resource-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.9rem;
  }
  .resource-card {
    display: flex; gap: 0.85rem; align-items: flex-start;
    background: var(--bg-lift);
    border: 1px solid var(--border);
    border-left: 4px solid var(--accent);
    border-radius: 10px;
    padding: 1rem 1.15rem;
    color: inherit; text-decoration: none;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .resource-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  }
  .resource-card-icon {
    flex-shrink: 0; width: 38px; height: 38px; border-radius: 8px;
    background: var(--accent-lt); color: var(--accent);
    display: flex; align-items: center; justify-content: center;
  }
  .resource-card-icon svg {
    width: 20px; height: 20px; fill: none; stroke: currentColor;
    stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
  }
  .resource-card-body { flex: 1; min-width: 0; }
  .resource-card-body h3 {
    font-size: 0.98rem; font-weight: 600; color: var(--ink);
    margin: 0 0 0.2rem;
  }
  .resource-card-body p {
    font-size: 0.82rem; color: var(--ink-soft);
    line-height: 1.45; margin: 0 0 0.45rem;
  }
  .resource-card-type {
    display: inline-block;
    font-size: 0.62rem; font-family: var(--mono, ui-monospace, monospace);
    text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--ink-soft);
    background: var(--bg); border: 1px solid var(--border);
    padding: 0.1rem 0.45rem; border-radius: 3px;
  }
  .resource-card-action {
    display: inline-block;
    font-size: 0.78rem; font-weight: 600;
    color: var(--accent);
  }
  .resource-sub-links {
    display: flex; gap: 0.45rem; flex-wrap: wrap;
    margin-top: 0.3rem;
  }
  .resource-sub-link {
    display: inline-block;
    font-size: 0.74rem; font-weight: 500;
    padding: 0.25rem 0.65rem;
    border: 1px solid var(--border); border-radius: 5px;
    color: var(--accent); background: var(--bg);
    transition: background 0.12s, border-color 0.12s;
  }
  .resource-sub-link:hover {
    background: var(--accent-lt);
    border-color: var(--accent);
  }
  .resource-card-pair { border-left-color: var(--accent); }
  .resource-card-interactive { border-left-color: var(--accent); }
  .resource-card-with-source { position: relative; border-left-color: var(--accent); }
  .resource-card-with-source:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  }
  .resource-card-cover-link {
    position: absolute; inset: 0;
    z-index: 1;
    text-decoration: none;
    border-radius: 10px;
  }
  .resource-card-with-source > .resource-card-icon,
  .resource-card-with-source > .resource-card-body { position: relative; z-index: 0; pointer-events: none; }
  .resource-card-with-source .resource-sub-links { position: relative; z-index: 2; pointer-events: auto; }

  @media (max-width: 640px) {
    .resource-grid { grid-template-columns: 1fr; }
  }

  /* Document viewer (docx/pptx) */
  .viewer-panel {
    display: none; position: fixed; inset: 0;
    background: var(--bg); z-index: 50; flex-direction: column;
  }
  .viewer-panel.active { display: flex; }
  .viewer-bar {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.55rem 1rem;
    background: var(--ink); color: #fff;
    font-size: 0.85rem;
  }
  .viewer-title { flex: 1; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .viewer-download {
    color: #fff; background: var(--accent);
    padding: 0.28rem 0.75rem; border-radius: 4px;
    text-decoration: none; font-size: 0.8rem;
  }
  .viewer-close {
    background: transparent; border: 1px solid rgba(255,255,255,0.3); color: #fff;
    padding: 0.28rem 0.75rem; border-radius: 4px;
    cursor: pointer; font-size: 0.8rem;
  }
  .viewer-frame { flex: 1; border: none; width: 100%; background: #fff; }
</style>
</head>
<body data-layout="paragraaf-v1" data-accent-domain="${accentToken}">

<button class="sidebar-toggle" id="sidebarToggle" aria-label="Menu openen">
  <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
</button>
<div class="sidebar-overlay" id="sidebarOverlay"></div>

<div class="page-layout">
  <nav class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <h2>${paragraaf.id} ${paragraaf.name}</h2>
      <p>Lesmateriaal</p>
    </div>
    <div class="sidebar-jump">
      <a href="${chapterBackHref}">&larr; ${chapterFull}</a><br>
      <a href="${bookBackHref}">${CONFIG.displayLabel}</a>
    </div>
${sidebarItems}
  </nav>

  <div class="content">
    <header class="hero">
      <div class="hero-inner">
        <a class="back-link" href="${chapterBackHref}"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg> ${chapterFull}</a>
        <span class="hero-badge">Paragraaf ${paragraaf.id}</span>
        <h1>${paragraaf.name}</h1>
        <p class="hero-sub">${chapterFull}</p>
      </div>
    </header>

    <main>${sectionsHTML}
    </main>
  </div>
</div>

<div class="viewer-panel" id="viewerPanel">
  <div class="viewer-bar">
    <span class="viewer-title" id="viewerTitle"></span>
    <a class="viewer-download" id="viewerDownload" href="#" download>Download</a>
    <button class="viewer-close" onclick="closeViewer()">Sluiten &times;</button>
  </div>
  <iframe id="viewerFrame" class="viewer-frame" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
</div>

<script src="../../shared/voorkennis.js"></script>
<script>
function openViewer(href, title) {
  var abs = new URL(href, window.location.href).href;
  var viewerURL = "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(abs);
  document.getElementById("viewerTitle").textContent = title;
  document.getElementById("viewerDownload").href = href;
  document.getElementById("viewerFrame").src = viewerURL;
  document.getElementById("viewerPanel").classList.add("active");
}
function closeViewer() {
  document.getElementById("viewerPanel").classList.remove("active");
  document.getElementById("viewerFrame").src = "about:blank";
}
if (window.innerWidth > 768) {
  document.addEventListener("click", function(e) {
    var link = e.target.closest("a[href]");
    if (!link) return;
    var href = link.getAttribute("href");
    if (!href) return;
    var lower = href.toLowerCase();
    if (lower.endsWith(".docx") || lower.endsWith(".pptx")) {
      e.preventDefault();
      var name = decodeURIComponent(href.split("/").pop()).replace(/\\.[^.]+$/, "");
      openViewer(href, name);
    }
  });
}
</script>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

function main() {
  console.log("Building landing pages...\n");

  // Step 1: Resolve every paragraaf's folder name on disk.
  const resolvedMap = {};
  for (const p of CONFIG.paragraphs) {
    const found = CONFIG.findParagraphFolder(p.id);
    if (found) {
      resolvedMap[p.id] = { ...p, folderName: found.folderName, fullPath: found.fullPath };
    } else {
      console.error(`[ERROR] Folder not found for ${p.id} ${p.name}`);
    }
  }

  let success = 0, errors = 0;

  // Step 2: Process paragraaf pages
  const targets = ONLY_ID ? CONFIG.paragraphs.filter(p => p.id === ONLY_ID) : CONFIG.paragraphs;

  for (const p of targets) {
    if (CONFIG.isHidden(p.id)) { console.log(`=== ${p.id} ${p.name} === [HIDDEN, skipped]`); continue; }
    const resolved = resolvedMap[p.id];
    if (!resolved) { errors++; continue; }

    console.log(`=== ${p.id} ${p.name} ===`);

    const files = scanFiles(resolved.fullPath);
    const html = renderParagraafPage(p, files, resolvedMap);
    if (!DRY_RUN) fs.writeFileSync(path.join(resolved.fullPath, "index.html"), html, "utf8");
    console.log(`  [write] index.html (${(html.length / 1024).toFixed(1)} KB)`);
    success++;
  }

  // Step 3: Generate chapter pages
  if (!ONLY_ID) {
    for (const ch of CONFIG.chapters) {
      const chPath = path.join(MODULE_BASE, ch.folder);
      if (!fs.existsSync(chPath)) continue;

      const html = renderChapterPage(ch.id, resolvedMap);
      if (!DRY_RUN) fs.writeFileSync(path.join(chPath, "index.html"), html, "utf8");
      console.log(`\n[chapter] ${ch.folder}/index.html (${(html.length / 1024).toFixed(1)} KB)`);
    }

    // Step 4: Generate book page
    const html = renderBookPage(resolvedMap);
    if (!DRY_RUN) fs.writeFileSync(path.join(MODULE_BASE, "index.html"), html, "utf8");
    console.log(`\n[book] index.html (${(html.length / 1024).toFixed(1)} KB)`);
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Done. ${success} paragraaf pages, ${ONLY_ID ? 0 : CONFIG.chapters.length} chapter pages, ${ONLY_ID ? 0 : 1} book page.`);
  if (errors) console.log(`${errors} errors.`);
  if (DRY_RUN) console.log("(DRY RUN)");
}

main();
