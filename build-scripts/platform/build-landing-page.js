/**
 * Build Landing Pages (flat layout)
 *
 * Generates index.html at three levels:
 * - Book page      (overview of all chapters)
 * - Chapter pages  (overview of paragrafen in that chapter)
 * - Paragraaf pages (V2 route with Start / Skill-tree games / Leer / Oefen / Check / Open & verdiep)
 *
 * All pages include a left navigation sidebar showing the full book structure.
 *
 * Target metadata — chapter list, paragraph list, domain assignments — comes
 * from the target's own deploy-config.json manifest. See
 * build-scripts/lib/lib-deploy-config.js.
 *
 * Paragraph layout is flat: all companion files sit directly at the paragraph
 * root (no 1. Voorbereiden / 2. Leren / 3. Oefenen subfolders). Paragraph
 * landing pages follow specifications/paragraph-landing-layout-v2.md.
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

const DOMAIN_LABELS = {
  economisch: "Economisch",
  wiskunde: "Rekenen",
  grafisch: "Grafisch",
};

const GAME_ASPECTS = {
  reasoning: {
    label: "Redeneren",
    token: "economisch",
    summary: "Leg oorzaken, gevolgen en keuzes stap voor stap uit."
  },
  calculation: {
    label: "Rekenen",
    token: "wiskunde",
    summary: "Train de berekeningen die je in deze paragraaf gebruikt."
  },
  graphical: {
    label: "Grafieken",
    token: "grafisch",
    summary: "Lees waarden uit grafieken en reken ermee door."
  }
};

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function domainToken(domain) {
  return DOMAIN_SHARED_TOKEN[domain] || "economisch";
}

function domainLabel(token) {
  return DOMAIN_LABELS[token] || "Les";
}

function landingMeta(item) {
  return item && item.landing && typeof item.landing === "object" ? item.landing : {};
}

function textList(value) {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  return raw
    .map(item => String(item == null ? "" : item).trim())
    .filter(Boolean);
}

function isConsolidationParagraph(item) {
  if (!item) return false;
  const meta = landingMeta(item);
  const type = String(item.type || item.paragraph_type || meta.type || "").toLowerCase();
  const name = `${item.id || ""} ${item.name || ""} ${item.title || ""} ${meta.title || ""}`.toLowerCase();
  return type === "consolidation" || name.includes("gemengde opgaven") || name.includes("consolidatie");
}

function cardPitfalls(item) {
  const meta = landingMeta(item);
  return textList(meta.pitfalls || item.pitfalls || meta.misconceptions || item.misconceptions).slice(0, 2);
}

function renderCardPitfalls(item) {
  const pitfalls = cardPitfalls(item);
  if (!pitfalls.length) return "";
  return `
    <div class="card-pitfalls" aria-label="Veelgemaakte valkuilen">
      <span class="card-pitfalls-label">Let op</span>
      ${pitfalls.map(p => `<span class="card-pitfall">${escapeHtml(p)}</span>`).join("\n      ")}
    </div>`;
}

function sectionAvailability(files, item = null) {
  if (!files) return [];
  return routeRows(files, item).map(row => row.title);
}

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
    oefenen:      { redeneerSpel: null, stappenplan: null, wiskundevaardigheden: null, grafiekenspel: null, begeleide: null, basis: null, midden: null, verrijking: null },
    check:        { shortCheck: null, exitTicket: null },
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
  const findHtmlPptx = (htmlRe, pptxRe) => {
    const html = files.find(f => htmlRe.test(f)) || null;
    const pptx = files.find(f => pptxRe.test(f)) || null;
    if (!html && !pptx) return null;
    return { html, pptx };
  };
  result.leren.presentatie   = findHtmlPptx(/presentatie\.html$/i, /presentatie\.pptx$/i);
  result.leren.vaardigheden  = findHtmlDocx(/uitleg vaardigheden\.html$/i, /uitleg vaardigheden\.docx$/i);
  result.leren.stappenplan   = find(/stappenplan\.html$/i);
  result.leren.youtube       = find(/youtube.videos\.html$/i);
  result.leren.nieuws        = findHtmlDocx(/nieuws met visual\.html$/i, /nieuws met visual\.docx$/i);
  result.leren.samenvatting  = findHtmlDocx(/samenvatting\.html$/i, /samenvatting\.docx$/i);

  // Oefenen — interactive shells sit at paragraph root; opgaven are flat files
  // with "– basis –", "– midden –", "– verrijking –", "– begeleide inoefening –"
  // infix. The interactive begeleide inoefening HTML has no infix before ".html".
  result.oefenen.redeneerSpel          = find(/redeneer-spel\.html$/i);
  result.oefenen.stappenplan           = result.leren.stappenplan;
  result.oefenen.wiskundevaardigheden  = find(/wiskundevaardigheden\.html$/i);
  result.oefenen.grafiekenspel         = find(/grafiekenspel\.html$/i);

  result.check.shortCheck = find(/(?:korte[- ]?check)\.html$/i);
  result.check.exitTicket = find(/(?:exit[- ]?ticket|afsluit(?:ing)?[- ]?check)\.html$/i);

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

function checkSectionHint(files) {
  const hasShort = Boolean(files && files.check && files.check.shortCheck);
  const hasExit = Boolean(files && files.check && files.check.exitTicket);
  if (hasShort && hasExit) return 'Eerst oefenadvies, daarna eindcheck';
  if (hasExit) return 'Maak de eindcheck';
  return 'Krijg lokaal oefenadvies';
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

  body[data-layout="landing-book-v1"],
  body[data-layout="landing-chapter-v1"] {
    --content-max: 1040px;
  }
  body[data-layout="landing-book-v1"] main,
  body[data-layout="landing-chapter-v1"] main {
    display: grid;
    gap: 1rem;
  }

  /* Chapter card (book page) */
  .chapter-card {
    position: relative; overflow: hidden;
    display: grid; gap: 0.9rem;
    min-width: 0;
    background: var(--bg-card); border-radius: 8px;
    border: 1px solid var(--border);
    border-left: 5px solid var(--ch-color, var(--accent));
    box-shadow: var(--shadow-card); padding: 1.35rem 1.5rem;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    text-decoration: none; color: inherit;
  }
  .chapter-card::before,
  .para-card::before {
    content: ""; position: absolute; inset: 0 0 auto 0; height: 3px;
    background: linear-gradient(90deg, var(--ch-color, var(--accent)), transparent);
    opacity: 0.75;
  }
  .chapter-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lift); }
  .chapter-card-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 1rem;
  }
  .chapter-card h3 {
    font-family: var(--heading-font); font-weight: var(--heading-weight); font-style: var(--heading-style);
    font-size: 1.25rem; color: var(--ink); margin: 0;
    line-height: 1.25; letter-spacing: 0;
  }
  .chapter-card h3 .ch-num { color: var(--ch-color, var(--accent)); margin-right: 0.3rem; }
  .chapter-card-count {
    flex-shrink: 0;
    font-family: var(--mono);
    font-size: 0.72rem; font-weight: 700;
    color: var(--ch-color, var(--accent));
    background: color-mix(in oklab, var(--ch-color, var(--accent)) 12%, var(--bg-lift));
    border: 1px solid color-mix(in oklab, var(--ch-color, var(--accent)) 30%, var(--border));
    border-radius: 999px;
    padding: 0.25rem 0.65rem;
    letter-spacing: 0;
    white-space: nowrap;
  }
  .chapter-card-summary {
    max-width: 72ch;
    margin: -0.15rem 0 0;
    color: var(--ink-soft);
    font-size: 0.86rem;
    line-height: 1.45;
    overflow-wrap: anywhere;
    word-break: normal;
  }
  .chapter-card-items { display: flex; flex-wrap: wrap; gap: 0.45rem; }
  .chapter-card-item {
    font-size: 0.75rem; padding: 0.3rem 0.75rem; border-radius: 5px;
    background: var(--bg-lift); color: var(--ink);
    border: 1px solid var(--border);
    min-width: 0;
    max-width: 100%;
    white-space: normal;
    overflow-wrap: anywhere;
  }
  .chapter-card-domain,
  .para-card-domain {
    display: inline-flex; align-items: center;
    font-family: var(--mono); font-size: 0.68rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em;
    color: var(--ch-color, var(--accent));
  }

  /* Paragraaf card (chapter page) */
  .para-card {
    position: relative; overflow: hidden;
    display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 1rem;
    min-width: 0;
    background: var(--bg-card); border-radius: 8px;
    border: 1px solid var(--border);
    border-left: 5px solid var(--ch-color, var(--accent));
    box-shadow: var(--shadow-card); padding: 1.05rem 1.25rem;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    text-decoration: none; color: inherit;
  }
  .para-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lift); }
  .para-num {
    flex-shrink: 0; min-width: 4rem; height: 2.75rem; border-radius: 8px;
    background: var(--ch-color, var(--accent)); color: var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; font-weight: 700;
    font-family: var(--mono);
  }
  .para-info { min-width: 0; display: grid; gap: 0.35rem; }
  .para-info > * {
    min-width: 0;
    max-width: 100%;
  }
  .para-info h3 {
    font-family: var(--heading-font); font-weight: var(--heading-weight); font-style: var(--heading-style);
    font-size: 1.08rem; color: var(--ink); margin: 0;
    line-height: 1.25; letter-spacing: 0;
    overflow-wrap: anywhere;
  }
  .para-info p {
    font-size: 0.8rem; color: var(--ink-soft); margin: 0; line-height: 1.45;
    max-width: 100%;
    overflow-wrap: anywhere;
    word-break: normal;
  }
  .para-card-topline {
    display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;
  }
  .para-card-tags {
    display: flex; flex-wrap: wrap; gap: 0.35rem;
  }
  .para-card-tag {
    display: inline-flex; align-items: center;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0.15rem 0.55rem;
    background: var(--bg-lift);
    color: var(--ink-soft);
    font-size: 0.7rem;
    font-weight: 600;
  }
  .card-pitfalls {
    display: flex; flex-wrap: wrap; gap: 0.35rem 0.45rem;
    align-items: center;
  }
  .card-pitfalls-label {
    font-family: var(--mono); font-size: 0.66rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em;
    color: var(--letop-ink);
  }
  .card-pitfall {
    font-size: 0.74rem;
    color: var(--ink-soft);
    background: color-mix(in oklab, var(--letop-ink) 10%, var(--bg-lift));
    border: 1px solid color-mix(in oklab, var(--letop-ink) 25%, var(--border));
    border-radius: 6px;
    padding: 0.2rem 0.55rem;
  }
  html[data-theme="dark"] .chapter-card-count,
  html[data-theme="dark"] .chapter-card-item,
  html[data-theme="dark"] .para-card-tag,
  html[data-theme="dark"] .card-pitfall {
    background: color-mix(in oklab, var(--ch-color, var(--accent)) 10%, var(--bg-lift));
  }

  @media (max-width: 640px) {
    body[data-layout="landing-book-v1"] .content,
    body[data-layout="landing-chapter-v1"] .content {
      width: 100vw;
      max-width: 100vw;
      overflow-x: hidden;
    }
    body[data-layout="landing-book-v1"] main,
    body[data-layout="landing-chapter-v1"] main {
      width: 100vw;
      max-width: 100vw;
      margin: 0;
      padding-left: 18px; padding-right: 18px;
      overflow-x: hidden;
    }
    body[data-layout="landing-book-v1"] .hero h1,
    body[data-layout="landing-chapter-v1"] .hero h1 {
      font-size: 1.45rem;
      line-height: 1.18;
      max-width: calc(100vw - 36px);
      white-space: normal;
      overflow-wrap: anywhere;
    }
    .chapter-card,
    .para-card {
      width: calc(100vw - 36px);
      max-width: calc(100vw - 36px);
      margin: 0;
    }
    .chapter-card { padding: 1.1rem 1rem; }
    .chapter-card-header { display: grid; gap: 0.5rem; }
    .chapter-card-count { justify-self: start; }
    .chapter-card-items {
      display: grid;
      grid-template-columns: 1fr;
      justify-items: start;
      width: 100%;
      max-width: calc(100vw - 72px);
    }
    .chapter-card-item {
      width: max-content;
      max-width: 100%;
    }
    .para-card {
      grid-template-columns: 1fr;
      padding: 1rem;
    }
    .para-info,
    .para-info h3,
    .para-info p,
    .para-card-tags {
      width: 100%;
      max-width: calc(100vw - 72px);
      overflow-wrap: anywhere;
    }
    .para-info > p {
      max-width: min(32ch, calc(100vw - 72px));
      white-space: normal !important;
      word-break: break-word;
    }
    .para-num { width: max-content; min-width: 0; padding: 0 0.7rem; }
  }

  /* Footer */
  footer {
    text-align: center; padding: 1.5rem 2rem; font-size: 0.75rem;
    color: var(--ink-soft); border-top: 1px solid var(--border);
    overflow-wrap: anywhere;
  }
  @media (max-width: 640px) {
    footer {
      width: min(30ch, calc(100vw - 36px));
      max-width: min(30ch, calc(100vw - 36px));
      margin: 0 auto;
      padding-left: 0;
      padding-right: 0;
      font-size: 0.7rem;
      line-height: 1.45;
      white-space: normal;
      word-break: break-word;
    }
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
  chart:     '<line x1="4" y1="19" x2="20" y2="19"/><line x1="4" y1="19" x2="4" y2="5"/><polyline points="6 15 10 11 13 13 18 7"/><circle cx="10" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="18" cy="7" r="1" fill="currentColor" stroke="none"/>',
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
      <a class="viewer-download" id="viewerDownload" download>Download</a>
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
    const token = domainToken(ch.domain);
    const meta = landingMeta(ch);
    const summary = meta.summary || ch.summary || `${paragrafen.length} paragrafen met lesmateriaal, oefenroutes en lesboekbestanden.`;
    const chFolder = encodeURIComponent(ch.folder);
    const pitfallHTML = renderCardPitfalls(ch);

    bodyHTML += `
  <a class="chapter-card domain-${token}" data-domain="${token}" data-chapter-id="${escapeHtml(ch.id)}" href="${chFolder}/index.html" style="--ch-color: ${dc2.main}">
    <div class="chapter-card-header">
      <div>
        <span class="chapter-card-domain">${domainLabel(token)}</span>
        <h3><span class="ch-num">H${ch.number}</span>${escapeHtml(ch.name)}</h3>
      </div>
      <div class="chapter-card-count">${paragrafen.length} paragrafen</div>
    </div>
    <p class="chapter-card-summary">${escapeHtml(summary)}</p>${pitfallHTML ? `\n    ${pitfallHTML}` : ""}
    <div class="chapter-card-items">
      ${paragrafen.map(p => `<span class="chapter-card-item">${escapeHtml(p.id)} ${escapeHtml(p.name)}</span>`).join("\n      ")}
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
    const token = domainToken(p.domain || ch.domain);
    const meta = landingMeta(p);
    const summary = meta.summary || p.summary || "Open de webpagina's, oefeningen en lesboekbronnen voor deze paragraaf.";
    const availability = sectionAvailability(scanFiles(resolved.fullPath), p);
    const availabilityHTML = availability.length
      ? `<div class="para-card-tags">${availability.map(label => `<span class="para-card-tag">${escapeHtml(label)}</span>`).join("")}</div>`
      : "";
    const pitfallHTML = renderCardPitfalls(p);
    bodyHTML += `
  <a class="para-card domain-${token}" data-domain="${token}" data-paragraph-id="${escapeHtml(p.id)}" href="${pFolder}/index.html" style="--ch-color: ${dc.main}">
    <div class="para-num">${p.id}</div>
    <div class="para-info">
      <div class="para-card-topline">
        <span class="para-card-domain">${domainLabel(token)}</span>
        <p>Paragraaf ${pNum}</p>
      </div>
      <h3>${escapeHtml(p.name)}</h3>
      <p>${escapeHtml(summary)}</p>${availabilityHTML ? `\n      ${availabilityHTML}` : ""}${pitfallHTML ? `\n      ${pitfallHTML}` : ""}
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

function renderParagraafPageLegacy(paragraaf, files, _resolvedMap) {
  const chapterFull = CONFIG.chapterFullLabel(paragraaf.chapter);
  const accentToken = DOMAIN_SHARED_TOKEN[paragraaf.domain] || "economisch";
  const isConsolidation = isConsolidationParagraph(paragraaf);

  const ext = (f) => f ? f.split(".").pop().toLowerCase() : "docx";

  function resourceCard(href, icon, title, desc, _fileType, extraClass = "") {
    if (!href) return "";
    return `
        <a class="resource-card ${extraClass}" href="${href}">
          <div class="resource-card-icon"><svg viewBox="0 0 24 24">${icon}</svg></div>
          <div class="resource-card-body">
            <h3>${title}</h3>
            <p>${desc}</p>
          </div>
        </a>`;
  }

  // Card for resources that have both an .html web companion and an
  // Office source file. Student-facing landing pages should prefer HTML and
  // should not advertise Word downloads. PowerPoint remains available because
  // it is a classroom presentation source, not a student worksheet route.
  function resourceCardWithSource(pair, icon, title, desc) {
    if (!pair) return "";
    const source = pair.docx || pair.pptx || null;
    const sourceLabel = pair.pptx ? "PowerPoint" : "Word";
    const sourceType = pair.pptx ? "pptx" : "docx";
    if (pair.html && !source) return resourceCard(encPath([pair.html]), icon, title, desc, "html");
    if (!pair.html && source) {
      if (pair.docx) return "";
      return resourceCard(encPath([source]), icon, title, desc, sourceType);
    }
    if (pair.docx) return resourceCard(encPath([pair.html]), icon, title, desc, "html");
    // Both formats present — emit primary HTML cover-link + Office sub-link.
    const htmlHref = encPath([pair.html]);
    const sourceHref = encPath([source]);
    return `
        <div class="resource-card resource-card-with-source">
          <a class="resource-card-cover-link" href="${htmlHref}" aria-label="${title} (web)"></a>
          <div class="resource-card-icon"><svg viewBox="0 0 24 24">${icon}</svg></div>
          <div class="resource-card-body">
            <h3>${title}</h3>
            <p>${desc}</p>
            <div class="resource-sub-links">
              <a class="resource-sub-link" href="${sourceHref}" download>&darr; Download als ${sourceLabel}</a>
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

  function aspectRouteCard({ href, icon, title, desc, aspect }) {
    const meta = GAME_ASPECTS[aspect];
    if (!meta) return "";
    return `
        <a class="resource-card resource-card-interactive resource-card-aspect aspect-${meta.token}" data-learning-aspect="${aspect}" href="${href}">
          <div class="resource-card-icon"><svg viewBox="0 0 24 24">${icon}</svg></div>
          <div class="resource-card-body">
            <span class="resource-aspect-label badge-${meta.token}">${meta.label}</span>
            <h3>${title}</h3>
            <p>${desc}</p>
            <span class="resource-card-action">Oefenen &rarr;</span>
          </div>
        </a>`;
  }

  function checkRouteCard(href, kind) {
    if (!href) return "";
    const copy = kind === "short"
      ? {
          route: "advisory",
          purpose: "local-practice-advice",
          className: "resource-card-check-short",
          badge: "advies",
          title: "Korte check",
          desc: "Krijg lokaal oefenadvies. Je ziet welke stap nu handig is; dit is geen eindcheck.",
          action: "Krijg oefenadvies",
        }
      : {
          route: "exit-ticket",
          purpose: "end-check",
          className: "resource-card-check-exit",
          badge: "eindcheck",
          title: "Exit ticket",
          desc: "Maak de eindcheck met dezelfde soort denkstappen als de eindopgave.",
          action: "Maak eindcheck",
        };
    return `
        <a class="resource-card resource-card-check ${copy.className}" data-check-route="${copy.route}" data-check-purpose="${copy.purpose}" href="${href}">
          <div class="resource-card-icon"><svg viewBox="0 0 24 24">${ICONS.check}</svg></div>
          <div class="resource-card-body">
            <span class="resource-aspect-label check-card-kind">${copy.badge}</span>
            <h3>${copy.title}</h3>
            <p class="resource-card-purpose">${copy.desc}</p>
            <span class="resource-card-action">${copy.action} &rarr;</span>
          </div>
        </a>`;
  }

  function begeleidCard(data) {
    if (!data) return "";
    const links = [];
    if (data.interactief) links.push(`<a class="resource-sub-link" href="${encPath([data.interactief])}">Interactief</a>`);
    if (!links.length) return "";
    return `
        <div class="resource-card resource-card-interactive">
          <div class="resource-card-icon"><svg viewBox="0 0 24 24">${ICONS.users}</svg></div>
          <div class="resource-card-body">
            <span class="resource-aspect-label">Begeleid oefenen</span>
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

  const startCardsOld = [
    files.voorbereiden.instapquiz      ? resourceCard(encPath([files.voorbereiden.instapquiz]),      ICONS.quiz,   "Instapquiz",       "Test wat je al weet over deze stof", "html") : "",
    files.voorbereiden.voorkennis      ? resourceCardWithSource(files.voorbereiden.voorkennis,       ICONS.book,   "Voorkennis",       "Herhaal wat je nodig hebt voor deze les") : "",
    files.voorbereiden.nieuwsdetective ? resourceCard(encPath([files.voorbereiden.nieuwsdetective]), ICONS.search, "Nieuws-detective", "Ontdek de economie achter het nieuws", "html") : "",
  ].filter(Boolean).join("\n");

  const lerenCards = [
    files.leren.presentatie  ? resourceCardWithSource(files.leren.presentatie,   ICONS.monitor,   "Presentatie",         "De les-presentatie met kernpunten") : "",
    files.leren.vaardigheden ? resourceCardWithSource(files.leren.vaardigheden,  ICONS.doc,       "Uitleg vaardigheden", "Stap-voor-stap uitleg van de lesstof") : "",
    files.leren.stappenplan  ? resourceCard(encPath([files.leren.stappenplan]),  ICONS.steps,     "Stappenplan",         "Oefen de stappen van elke vaardigheid", "html") : "",
    files.leren.youtube      ? resourceCard(encPath([files.leren.youtube]),      ICONS.play,      "YouTube-video’s", "Video-uitleg bij de stof", "html") : "",
    files.leren.nieuws       ? resourceCardWithSource(files.leren.nieuws,        ICONS.newspaper, "Nieuws",              "Actueel artikel met verwerkingsvragen") : "",
    files.leren.samenvatting ? resourceCardWithSource(files.leren.samenvatting,  ICONS.check,     "Samenvatting",        "Overzicht van deze paragraaf") : "",
  ].filter(Boolean).join("\n");

  const oefenenAspectRoutes = [];
  if (files.oefenen.redeneerSpel) {
    oefenenAspectRoutes.push(aspectRouteCard({
      href: encPath([files.oefenen.redeneerSpel]),
      icon: ICONS.puzzle,
      title: "Redeneer-spel",
      desc: GAME_ASPECTS.reasoning.summary,
      aspect: "reasoning"
    }));
  }
  if (files.oefenen.wiskundevaardigheden) {
    oefenenAspectRoutes.push(aspectRouteCard({
      href: encPath([files.oefenen.wiskundevaardigheden]),
      icon: ICONS.layers,
      title: "Wiskunde vaardigheden",
      desc: GAME_ASPECTS.calculation.summary,
      aspect: "calculation"
    }));
  }
  if (files.oefenen.grafiekenspel) {
    oefenenAspectRoutes.push(aspectRouteCard({
      href: encPath([files.oefenen.grafiekenspel]),
      icon: ICONS.chart,
      title: "Grafiekenspel",
      desc: GAME_ASPECTS.graphical.summary,
      aspect: "graphical"
    }));
  }
  const begeleidHTML = begeleidCard(files.oefenen.begeleide);
  const routeNames = [];
  if (files.oefenen.redeneerSpel) routeNames.push("redeneren");
  if (files.oefenen.wiskundevaardigheden) routeNames.push("rekenen");
  if (files.oefenen.grafiekenspel) routeNames.push("grafieken lezen");
  const routeIntro = routeNames.length
    ? `Deze routes oefenen ${routeNames.join(", ").replace(/, ([^,]*)$/, " en $1")}.`
    : "Kies een oefenroute die past bij deze paragraaf.";
  const aspectBlock = oefenenAspectRoutes.length ? `
        <div class="learning-aspect-block">
          <div class="learning-aspect-copy">
            <span class="resource-aspect-label">Oefenroutes</span>
            <h3>Kies wat je wilt trainen</h3>
            <p>${routeIntro}</p>
          </div>
          <div class="resource-grid learning-aspect-grid">${oefenenAspectRoutes.join("\n")}
          </div>
        </div>` : "";
  const begeleidBlock = begeleidHTML ? `
        <div class="guided-practice-block">
          <div class="learning-aspect-copy">
            <span class="resource-aspect-label">Extra steun</span>
            <h3>Stap voor stap oefenen</h3>
            <p>Gebruik deze route als je eerst met meer begeleiding door de opgaven wilt.</p>
          </div>
          <div class="resource-grid">${begeleidHTML}
          </div>
        </div>` : "";
  const oefenenCards = [aspectBlock, begeleidBlock].filter(Boolean).join("\n");

  const taskCards = [
    exercisePairCard(files.oefenen.basis,      ICONS.star0, "Basisopgaven",       "Standaard opgaven"),
    exercisePairCard(files.oefenen.midden,     ICONS.star1, "Middenopgaven",      "Kortere set, meer zelfstandig"),
    exercisePairCard(files.oefenen.verrijking, ICONS.star2, "Verrijkingsopgaven", "Extra uitdaging"),
  ].filter(Boolean).join("\n");

  const lesboekCards = [
    lesboekCard(files.lesboek.paragraaf, ICONS.book, "Lesboek – uitleg", "De volledige paragraaf uit het lesboek"),
    lesboekPairCard(files.lesboek.opgaven, files.lesboek.antwoorden, ICONS.doc, "Lesboek – opgaven & antwoorden", "De opgaven en uitwerkingen uit het lesboek"),
  ].filter(Boolean).join("\n");

  function secondaryGroup(id, title, desc, body) {
    if (!body || !body.trim()) return "";
    return `
        <details class="route-secondary-group" data-route-secondary="${id}">
          <summary>
            <span class="route-secondary-title">${title}</span>
            <span class="route-secondary-desc">${desc}</span>
          </summary>
          <div class="resource-grid route-secondary-grid">${body}
          </div>
        </details>`;
  }

  const startCards = [
    files.voorbereiden.instapquiz ? resourceCard(encPath([files.voorbereiden.instapquiz]), ICONS.quiz, "Instapquiz", "Check snel wat je al weet", "html") : "",
    files.voorbereiden.voorkennis ? resourceCardWithSource(files.voorbereiden.voorkennis, ICONS.book, "Voorkennis", "Herhaal wat je nodig hebt voor deze les") : "",
  ].filter(Boolean).join("\n");

  const leerCards = [
    files.leren.vaardigheden ? resourceCardWithSource(files.leren.vaardigheden, ICONS.doc, "Uitleg vaardigheden", "Leer de kernstappen met voorbeelden") : "",
  ].filter(Boolean).join("\n");

  const practiceRoutes = [];
  if (files.oefenen.redeneerSpel) {
    practiceRoutes.push(aspectRouteCard({
      href: encPath([files.oefenen.redeneerSpel]),
      icon: ICONS.puzzle,
      title: "Redeneren",
      desc: GAME_ASPECTS.reasoning.summary,
      aspect: "reasoning"
    }));
  }
  const hasScopedMathSkillTree = Boolean(
    files.oefenen.wiskundevaardigheden &&
    paragraaf.skilltree &&
    Array.isArray(paragraaf.skilltree.skills) &&
    paragraaf.skilltree.skills.length > 0
  );
  const mathSkillTreeRoute = hasScopedMathSkillTree ? files.oefenen.wiskundevaardigheden : null;
  const unscopedSkillTreeRoute = files.oefenen.wiskundevaardigheden && !hasScopedMathSkillTree
    ? files.oefenen.wiskundevaardigheden
    : null;
  const procedureSupportRoute = files.oefenen.stappenplan;
  const calculationRoute = mathSkillTreeRoute;
  if (calculationRoute) {
    practiceRoutes.push(aspectRouteCard({
      href: encPath([calculationRoute]),
      icon: ICONS.layers,
      title: "Rekenen",
      desc: GAME_ASPECTS.calculation.summary,
      aspect: "calculation"
    }));
  }
  if (files.oefenen.grafiekenspel) {
    practiceRoutes.push(aspectRouteCard({
      href: encPath([files.oefenen.grafiekenspel]),
      icon: ICONS.chart,
      title: "Grafieken",
      desc: GAME_ASPECTS.graphical.summary,
      aspect: "graphical"
    }));
  }

  const practiceRouteNames = [];
  if (files.oefenen.redeneerSpel) practiceRouteNames.push("redeneren");
  if (calculationRoute) practiceRouteNames.push("rekenen");
  if (files.oefenen.grafiekenspel) practiceRouteNames.push("grafieken lezen");
  const practiceIntro = practiceRouteNames.length
    ? `Kies een oefenroute voor ${practiceRouteNames.join(", ").replace(/, ([^,]*)$/, " of $1")}.`
    : "Kies een oefenroute die past bij deze paragraaf.";
  const practiceRouteBlock = practiceRoutes.length ? `
        <div class="learning-aspect-block">
          <div class="learning-aspect-copy">
            <span class="resource-aspect-label">Oefenroutes</span>
            <h3>Kies wat je wilt trainen</h3>
            <p>${practiceIntro}</p>
          </div>
          <div class="resource-grid learning-aspect-grid">${practiceRoutes.join("\n")}
          </div>
        </div>` : "";
  const procedureSupportCard = procedureSupportRoute
    ? resourceCard(encPath([procedureSupportRoute]), ICONS.steps, "Rekenstappen", "Gebruik extra steun om de procedure stap voor stap te oefenen", "html")
    : "";
  const supportCards = [procedureSupportCard, begeleidHTML].filter(Boolean).join("\n");
  const guidedPracticeBlock = supportCards ? `
        <div class="guided-practice-block">
          <div class="learning-aspect-copy">
            <span class="resource-aspect-label">Eerst steun nodig?</span>
            <h3>Stap voor stap oefenen</h3>
            <p>Gebruik extra steun voordat je zelfstandig oefent.</p>
          </div>
          <div class="resource-grid">${supportCards}
          </div>
        </div>` : "";
  const oefenRouteCards = [practiceRouteBlock, guidedPracticeBlock].filter(Boolean).join("\n");
  const consolidationPracticeCard = isConsolidation && (files.lesboek.opgaven || files.lesboek.antwoorden)
    ? lesboekPairCard(files.lesboek.opgaven, files.lesboek.antwoorden, ICONS.doc, "Gemengde opgaven", "Maak de gemengde opgaven en controleer daarna je uitwerkingen")
    : "";
  const consolidationPracticeBlock = consolidationPracticeCard ? `
        <div class="learning-aspect-block" data-consolidation-practice="true">
          <div class="learning-aspect-copy">
            <span class="resource-aspect-label">Gemengde opgaven</span>
            <h3>Oefen gemengd</h3>
            <p>Gebruik deze route om de vaardigheden uit het hoofdstuk door elkaar te oefenen.</p>
          </div>
          <div class="resource-grid">${consolidationPracticeCard}
          </div>
        </div>` : "";
  const oefenCardsFinal = [consolidationPracticeBlock, oefenRouteCards].filter(Boolean).join("\n");

  const checkCards = [
    files.check && files.check.shortCheck
      ? checkRouteCard(encPath([files.check.shortCheck]), "short")
      : "",
    files.check && files.check.exitTicket
      ? checkRouteCard(encPath([files.check.exitTicket]), "exit")
      : ""
  ].filter(Boolean).join("\n");

  const deepenCards = [
    files.leren.samenvatting ? resourceCardWithSource(files.leren.samenvatting, ICONS.check, "Samenvatting", "Overzicht van deze paragraaf") : "",
    files.leren.nieuws ? resourceCardWithSource(files.leren.nieuws, ICONS.newspaper, "Nieuws met visual", "Context en grafiek bij de stof") : "",
    files.voorbereiden.nieuwsdetective ? resourceCard(encPath([files.voorbereiden.nieuwsdetective]), ICONS.search, "Nieuws-detective", "Ontdek de economie achter het nieuws", "html") : "",
    files.leren.youtube ? resourceCard(encPath([files.leren.youtube]), ICONS.play, "YouTube-video's", "Video-uitleg bij de stof", "html") : "",
    unscopedSkillTreeRoute ? resourceCard(encPath([unscopedSkillTreeRoute]), ICONS.layers, "Brede vaardigheidskaart", "Extra overzicht; niet de start van deze oefenroute", "html") : "",
  ].filter(Boolean).join("\n");
  const sourceLesboekCards = isConsolidation
    ? [lesboekCard(files.lesboek.paragraaf, ICONS.book, "Lesboek - uitleg", "De volledige paragraaf uit het lesboek")].filter(Boolean).join("\n")
    : lesboekCards;
  const sourceCards = [
    files.leren.presentatie ? resourceCardWithSource(files.leren.presentatie, ICONS.monitor, "Presentatie", "De les-presentatie en PowerPoint") : "",
    sourceLesboekCards,
  ].filter(Boolean).join("\n");
  const verdiepenCards = [
    secondaryGroup("deepen", "Verdiep je begrip", "Samenvatting, context en extra uitleg", deepenCards),
    secondaryGroup("sources", "Lesboek en downloads", "Bronnen, presentatie en lesboek", sourceCards),
  ].filter(Boolean).join("\n");

  const hasS = startCards.trim().length > 0;
  const hasLeer = leerCards.trim().length > 0;
  const hasO = oefenCardsFinal.trim().length > 0;
  const hasC = checkCards.trim().length > 0;
  const hasD = verdiepenCards.trim().length > 0;

  // Per-section accent: the four section roles get distinct accents drawn
  // from the three shared tokens (economisch / wiskunde / grafisch) defined
  // in engines/voorkennis.css. The hero gradient and back-link continue to
  // use the paragraph-level accentToken; only the section chrome rotates.
  const SECTION_ACCENT = {
    start:   "wiskunde",
    leer:    "grafisch",
    oefen:   "economisch",
    check:   "wiskunde",
    verdiep: "grafisch",
  };

  const sections = [];
  if (hasS) sections.push({ id: "start", num: 1, title: "Start", hint: "Orienteer en haal voorkennis op", body: startCards, accent: SECTION_ACCENT.start, routeLayer: "start" });
  if (hasLeer) sections.push({ id: "leer", num: 2, title: "Leer", hint: "Leer de kernstappen", body: leerCards, accent: SECTION_ACCENT.leer, routeLayer: "learn" });
  if (hasO) sections.push({
    id: "oefen",
    num: sections.length + 1,
    title: isConsolidation ? "Oefen gemengd" : "Oefen",
    hint: isConsolidation ? "Maak gemengde opgaven" : "Kies steun of een oefenroute",
    body: oefenCardsFinal,
    accent: SECTION_ACCENT.oefen,
    layout: "custom",
    routeLayer: "practice"
  });
  if (hasC) sections.push({ id: "check", num: 4, title: "Check", hint: checkSectionHint(files), body: checkCards, accent: SECTION_ACCENT.check, routeLayer: "check" });
  if (hasD) sections.push({ id: "verdiep", num: sections.length + 1, title: "Verdiep", hint: "Extra context, bronnen en downloads", body: verdiepenCards, accent: SECTION_ACCENT.verdiep, layout: "custom", routeLayer: "deepen" });

  const sidebarItems = sections.map(s => `      <a class="nav-item domain-${s.accent}" href="#${s.id}" data-section="${s.id}" data-route-layer="${s.routeLayer || s.id}">
        <span class="nav-number">${s.num}</span>
        <span class="nav-text">
          <span class="nav-title">${s.title}</span>
          <span class="nav-badge">${s.hint}</span>
        </span>
      </a>`).join("\n");

  const sectionsHTML = sections.map(s => {
    const bodyHTML = s.layout === "custom" ? s.body : `<div class="resource-grid">${s.body}
        </div>`;
    return `
      <section class="section route-section" id="${s.id}" data-route-layer="${s.routeLayer || s.id}">
        <div class="section-header border-${s.accent}">
          <span class="section-num bg-${s.accent}">${s.num}</span>
          <div class="section-title-group">
            <div class="section-title">${s.title}</div>
            <span class="section-badge badge-${s.accent}">${s.hint}</span>
          </div>
        </div>
${bodyHTML}
      </section>`;
  }).join("\n");

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
  .learning-aspect-block,
  .guided-practice-block {
    display: grid;
    gap: 0.85rem;
  }
  .guided-practice-block {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }
  .learning-aspect-copy {
    max-width: 70ch;
  }
  .learning-aspect-copy h3 {
    margin: 0.1rem 0 0.25rem;
    font-size: 1rem;
    color: var(--ink);
  }
  .learning-aspect-copy p {
    margin: 0;
    color: var(--ink-soft);
    font-size: 0.84rem;
    line-height: 1.45;
  }
  .resource-aspect-label {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    margin: 0 0 0.35rem;
    font-family: var(--mono);
    font-size: 0.67rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--ink-soft);
  }
  .resource-card-aspect.aspect-economisch {
    border-left-color: var(--economisch);
  }
  .resource-card-aspect.aspect-wiskunde {
    border-left-color: var(--wiskundig);
  }
  .resource-card-aspect.aspect-grafisch {
    border-left-color: var(--grafisch);
  }
  .resource-card-aspect.aspect-economisch .resource-card-icon {
    color: var(--economisch);
    background: var(--economisch-tint);
  }
  .resource-card-aspect.aspect-wiskunde .resource-card-icon {
    color: var(--wiskundig);
    background: var(--wiskundig-tint);
  }
  .resource-card-aspect.aspect-grafisch .resource-card-icon {
    color: var(--grafisch);
    background: var(--grafisch-tint);
  }
  .resource-card-action {
    display: inline-block;
    font-size: 0.78rem; font-weight: 600;
    color: var(--accent);
  }
  .resource-card-check {
    border-left-width: 5px;
  }
  .resource-card-check-short {
    border-left-color: var(--wiskundig);
  }
  .resource-card-check-exit {
    border-left-color: var(--grafisch);
  }
  .resource-card-check-short .resource-card-icon {
    color: var(--wiskundig);
    background: var(--wiskundig-tint);
  }
  .resource-card-check-exit .resource-card-icon {
    color: var(--grafisch);
    background: var(--grafisch-tint);
  }
  .resource-card-check .check-card-kind {
    margin-bottom: 0.25rem;
  }
  .resource-card-check .resource-card-purpose {
    min-height: 3.45em;
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
  .route-secondary-group {
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-lift);
    margin-bottom: 0.75rem;
    overflow: hidden;
  }
  .route-secondary-group summary {
    position: relative;
    cursor: pointer;
    display: grid;
    gap: 0.18rem;
    padding: 0.9rem 1rem;
    list-style: none;
  }
  .route-secondary-group summary::-webkit-details-marker { display: none; }
  .route-secondary-group summary::after {
    content: "+";
    position: absolute;
    right: 1rem;
    margin-top: 0.05rem;
    color: var(--accent);
    font-weight: 800;
  }
  .route-secondary-group[open] summary::after { content: "-"; }
  .route-secondary-title {
    font-weight: 700;
    color: var(--ink);
    padding-right: 2rem;
  }
  .route-secondary-desc {
    color: var(--ink-soft);
    font-size: 0.82rem;
    line-height: 1.35;
    padding-right: 2rem;
  }
  .route-secondary-grid {
    padding: 0 1rem 1rem;
  }

  @media (max-width: 640px) {
    .resource-grid { grid-template-columns: 1fr; }
    .route-secondary-group summary { padding-right: 0.85rem; }
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
<body data-layout="paragraaf-v2" data-accent-domain="${accentToken}">

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
    <a class="viewer-download" id="viewerDownload" download>Download</a>
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

function fileHref(file) {
  return file ? encPath([file]) : null;
}

function pairFile(pair, keys) {
  if (!pair) return null;
  for (const key of keys) {
    if (pair[key]) return pair[key];
  }
  return null;
}

function pairHref(pair, keys) {
  return fileHref(pairFile(pair, keys));
}

function routeConfig(paragraaf, routeName) {
  const routes = paragraaf && paragraaf.skilltree && paragraaf.skilltree.skillMapRoutes;
  return routes && routes[routeName] ? routes[routeName] : null;
}

function routeIsEnabled(route) {
  return Boolean(route && route.enabled !== false && (route.title || route.routePurpose || route.practiceHref));
}

function hasScopedMathSkillTree(paragraaf) {
  const skills = paragraaf && paragraaf.skilltree && paragraaf.skilltree.skills;
  return (Array.isArray(skills) && skills.length > 0) || routeIsEnabled(routeConfig(paragraaf, "calculation"));
}

function hasVisibleSkillRoute(paragraaf) {
  const routes = paragraaf && paragraaf.skilltree && paragraaf.skilltree.skillMapRoutes;
  if (!routes || typeof routes !== "object") return false;
  return Object.values(routes).some(routeIsEnabled);
}

function tileState(tile) {
  if (tile && tile.state) return tile.state;
  const links = tile && Array.isArray(tile.links) ? tile.links : [];
  const hasLink = Boolean(tile && tile.href) || links.some(link => link && link.href);
  return hasLink ? "available" : "in-preparation";
}

function tileStatusLabel(state) {
  if (state === "available") return "Beschikbaar";
  if (state === "not-scoped") return "Niet nodig";
  return "In voorbereiding";
}

function countRowAvailability(row) {
  return row.tiles.reduce((count, tile) => count + (tileState(tile) === "available" ? 1 : 0), 0);
}

function firstActionableTile(rows) {
  for (const row of rows) {
    for (const tile of row.tiles) {
      if (tileState(tile) !== "available") continue;
      const firstLink = Array.isArray(tile.links) ? tile.links.find(link => link && link.href) : null;
      const href = tile.href || (firstLink && firstLink.href);
      if (href) return { ...tile, href };
    }
  }
  return null;
}

function routeRows(files, paragraaf) {
  const mathRouteAvailable = Boolean(files.oefenen.wiskundevaardigheden && hasScopedMathSkillTree(paragraaf));
  const skillEngineAvailable = Boolean(files.oefenen.wiskundevaardigheden && hasVisibleSkillRoute(paragraaf));
  const presentationHref = pairHref(files.leren.presentatie, ["html", "pptx"]);
  const presentationLinks = [];
  if (files.leren.presentatie && files.leren.presentatie.html && files.leren.presentatie.pptx) {
    presentationLinks.push({ href: fileHref(files.leren.presentatie.pptx), label: "PowerPoint", download: true });
  }
  const explanationLinks = [];
  if (files.voorbereiden.voorkennis && files.voorbereiden.voorkennis.html) {
    explanationLinks.push({ href: fileHref(files.voorbereiden.voorkennis.html), label: "Voorkennis" });
  }
  const guidedLinks = [];
  if (files.oefenen.stappenplan) {
    guidedLinks.push({ href: fileHref(files.oefenen.stappenplan), label: "Stappenplan" });
  }

  const exerciseLinks = [];
  if (files.lesboek.antwoorden && files.lesboek.antwoorden.html) {
    exerciseLinks.push({ href: fileHref(files.lesboek.antwoorden.html), label: "Antwoorden" });
  }
  if (files.lesboek.opgaven && files.lesboek.opgaven.pdf) {
    exerciseLinks.push({ href: fileHref(files.lesboek.opgaven.pdf), label: "Opgaven PDF", download: true });
  }
  if (files.lesboek.antwoorden && files.lesboek.antwoorden.pdf) {
    exerciseLinks.push({ href: fileHref(files.lesboek.antwoorden.pdf), label: "Antwoorden PDF", download: true });
  }

  const textbookLinks = [];
  if (files.lesboek.paragraaf && files.lesboek.paragraaf.pdf) {
    textbookLinks.push({ href: fileHref(files.lesboek.paragraaf.pdf), label: "PDF", download: true });
  }

  const sourceLinks = [];
  if (files.leren.samenvatting && files.leren.samenvatting.html) {
    sourceLinks.push({ href: fileHref(files.leren.samenvatting.html), label: "Samenvatting" });
  }
  if (files.leren.nieuws && files.leren.nieuws.html) {
    sourceLinks.push({ href: fileHref(files.leren.nieuws.html), label: "Nieuws met visual" });
  }
  if (files.leren.youtube) {
    sourceLinks.push({ href: fileHref(files.leren.youtube), label: "YouTube" });
  }

  return [
    {
      id: "start",
      num: 1,
      title: "Start",
      hint: "Begin met voorkennis en context.",
      accent: "wiskunde",
      tiles: [
        {
          id: "instapquiz",
          title: "Instapquiz voorkennis",
          desc: "Check snel wat je al weet voordat je begint.",
          icon: ICONS.quiz,
          href: fileHref(files.voorbereiden.instapquiz),
          action: "Start quiz",
        },
        {
          id: "nieuwsdetective",
          title: "Nieuws-detective",
          desc: "Verken de economische situatie achter een herkenbaar nieuwsvoorbeeld.",
          icon: ICONS.search,
          href: fileHref(files.voorbereiden.nieuwsdetective),
          action: "Open detective",
        },
      ],
    },
    {
      id: "skill-tree-games",
      num: 2,
      title: "Skill-tree games",
      hint: "Train de drie vaardigheidsroutes.",
      accent: "economisch",
      tiles: [
        {
          id: "redeneren",
          title: "Redeneren",
          desc: GAME_ASPECTS.reasoning.summary,
          icon: ICONS.puzzle,
          href: fileHref(files.oefenen.redeneerSpel),
          action: "Oefen redeneren",
        },
        {
          id: "rekenen",
          title: "Rekenen",
          desc: GAME_ASPECTS.calculation.summary,
          icon: ICONS.layers,
          href: mathRouteAvailable ? fileHref(files.oefenen.wiskundevaardigheden) : null,
          action: "Oefen rekenen",
        },
        {
          id: "grafieken",
          title: "Grafieken",
          desc: GAME_ASPECTS.graphical.summary,
          icon: ICONS.chart,
          href: fileHref(files.oefenen.grafiekenspel),
          action: "Oefen grafieken",
        },
      ],
    },
    {
      id: "leer",
      num: 3,
      title: "Leer",
      hint: "Pak de uitleg en het leerpad erbij.",
      accent: "grafisch",
      tiles: [
        {
          id: "uitleg-vaardigheden",
          title: "Uitleg vaardigheden",
          desc: "Leer de kernstappen met voorbeelden en dezelfde aanpak als in de oefeningen.",
          icon: ICONS.doc,
          href: pairHref(files.leren.vaardigheden, ["html"]),
          action: "Open uitleg",
          links: explanationLinks,
        },
        {
          id: "presentatie",
          title: "PowerPoint-presentatie",
          desc: "Gebruik de presentatie om de hoofdlijn en voorbeelden terug te zien.",
          icon: ICONS.monitor,
          href: presentationHref,
          action: "Open presentatie",
          links: presentationLinks,
        },
        {
          id: "skill-engine",
          title: "Skill engine / leerpad",
          desc: "Bekijk de lokale route en de relevante vaardigheden zonder interne codes.",
          icon: ICONS.steps,
          href: skillEngineAvailable ? fileHref(files.oefenen.wiskundevaardigheden) : null,
          action: "Open leerpad",
        },
      ],
    },
    {
      id: "oefen",
      num: 4,
      title: "Oefen",
      hint: "Oefen met steun, zelfstandig, of met lokaal advies.",
      accent: "economisch",
      tiles: [
        {
          id: "begeleide-oefeningen",
          title: "Begeleide oefeningen",
          desc: "Werk stap voor stap met hints en denkstappen.",
          icon: ICONS.users,
          href: fileHref(files.oefenen.begeleide && files.oefenen.begeleide.interactief),
          action: "Open begeleiding",
          links: guidedLinks,
        },
        {
          id: "zelfstandige-oefeningen",
          title: "Zelfstandige oefeningen",
          desc: "Maak de opgaven zelfstandig en controleer daarna je aanpak.",
          icon: ICONS.doc,
          href: pairHref(files.lesboek.opgaven, ["html"]),
          action: "Open opgaven",
          links: exerciseLinks,
        },
        {
          id: "adaptieve-oefenroute",
          title: "Adaptieve oefenroute",
          desc: "Lokaal advies voor de voorgestelde volgende oefening komt hier.",
          icon: ICONS.layers,
          state: "in-preparation",
        },
      ],
    },
    {
      id: "check",
      num: 5,
      title: "Check",
      hint: "Eerst lokaal advies, daarna de eindcheck.",
      accent: "wiskunde",
      tiles: [
        {
          id: "korte-check",
          title: "Korte check",
          desc: "Krijg lokaal oefenadvies. Dit is geen eindcheck en geen cijfer.",
          icon: ICONS.check,
          href: fileHref(files.check && files.check.shortCheck),
          action: "Open korte check",
        },
        {
          id: "exit-ticket",
          title: "Exit ticket",
          desc: "Maak de eindcheck met dezelfde soort denkstappen als de paragraafopgave.",
          icon: ICONS.check,
          href: fileHref(files.check && files.check.exitTicket),
          action: "Open exit ticket",
        },
      ],
    },
    {
      id: "open-verdiep",
      num: 6,
      title: "Open & verdiep",
      hint: "Open het lesboek, antwoorden en extra materiaal.",
      accent: "grafisch",
      tiles: [
        {
          id: "lesboek-openen",
          title: "Lesboek openen",
          desc: "Lees de volledige paragraaf in de webversie.",
          icon: ICONS.book,
          href: pairHref(files.lesboek.paragraaf, ["html", "pdf"]),
          action: "Open lesboek",
          links: textbookLinks,
        },
        {
          id: "opgaven-antwoorden",
          title: "Opgaven & antwoorden",
          desc: "Open de opgaven en de uitwerkingen bij deze paragraaf.",
          icon: ICONS.doc,
          href: pairHref(files.lesboek.opgaven, ["html"]),
          action: "Open opgaven",
          links: exerciseLinks,
        },
        {
          id: "aanvullend-materiaal",
          title: "Aanvullend materiaal",
          desc: "Gebruik samenvatting, context en video wanneer je extra steun wilt.",
          icon: ICONS.newspaper,
          links: sourceLinks,
        },
      ],
    },
  ];
}

function renderTileLink(link, className) {
  if (!link || !link.href) return "";
  const download = link.download ? " download" : "";
  return `<a class="${className}" href="${escapeHtml(link.href)}"${download}>${escapeHtml(link.label)}</a>`;
}

function renderLandingV2Tile(tile, rowAccent) {
  const state = tileState(tile);
  const status = tile.statusLabel || tileStatusLabel(state);
  const links = Array.isArray(tile.links) ? tile.links.filter(link => link && link.href) : [];
  const primary = state === "available" && tile.href
    ? renderTileLink({ href: tile.href, label: tile.action || "Openen", download: tile.download }, "landing-v2-tile-primary")
    : "";
  const secondary = links
    .filter(link => !tile.href || link.href !== tile.href)
    .map(link => renderTileLink(link, "landing-v2-tile-secondary"))
    .join("");
  const actions = state === "available" && (primary || secondary)
    ? `<div class="landing-v2-tile-actions">${primary}${secondary}</div>`
    : `<div class="landing-v2-placeholder">${escapeHtml(status)}</div>`;

  return `
        <article class="landing-v2-tile landing-v2-tile-${state} accent-${rowAccent}" data-tile-id="${escapeHtml(tile.id)}" data-tile-state="${escapeHtml(state)}">
          <div class="landing-v2-tile-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${tile.icon || ICONS.info}</svg></div>
          <div class="landing-v2-tile-body">
            <span class="landing-v2-tile-status">${escapeHtml(status)}</span>
            <h3>${escapeHtml(tile.title)}</h3>
            <p>${escapeHtml(tile.desc)}</p>
            ${actions}
          </div>
        </article>`;
}

function renderLandingV2Row(row) {
  const ready = countRowAvailability(row);
  const total = row.tiles.length;
  return `
      <section class="landing-v2-row" id="${row.id}" data-route-layer="${row.id}" data-row-ready="${ready}" data-row-total="${total}">
        <div class="landing-v2-row-label accent-${row.accent}">
          <span class="landing-v2-row-num">${row.num}</span>
          <div>
            <h2>${escapeHtml(row.title)}</h2>
            <p>${escapeHtml(row.hint)}</p>
          </div>
        </div>
        <div class="landing-v2-tile-grid">
${row.tiles.map(tile => renderLandingV2Tile(tile, row.accent)).join("\n")}
        </div>
      </section>`;
}

function paragraphLandingV2CSS() {
  return `
  body[data-layout="paragraph-landing-v2"] {
    --content-max: 1180px;
    --heading-letter: 0;
    letter-spacing: 0;
  }
  body[data-layout="paragraph-landing-v2"] .content {
    min-width: 0;
  }
  body[data-layout="paragraph-landing-v2"] .sidebar {
    border-right: 1px solid var(--border);
  }
  .landing-v2-sidebar-header {
    padding: 1rem 1rem 0.85rem;
    border-bottom: 1px solid var(--border);
  }
  .landing-v2-sidebar-header h2 {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.25;
    color: var(--ink);
    overflow-wrap: anywhere;
  }
  .landing-v2-sidebar-header p {
    margin: 0.25rem 0 0;
    color: var(--ink-soft);
    font-size: 0.74rem;
  }
  .landing-v2-sidebar-jump {
    display: grid;
    gap: 0.25rem;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid var(--border);
  }
  .landing-v2-sidebar-jump a {
    color: var(--ink-soft);
    text-decoration: none;
    font-size: 0.74rem;
    line-height: 1.3;
  }
  .landing-v2-sidebar-jump a:hover { color: var(--ink); }
  .landing-v2-nav {
    display: grid;
    gap: 0.25rem;
    padding: 0.7rem 0.65rem 1rem;
  }
  .landing-v2-nav-item {
    display: grid;
    grid-template-columns: 1.7rem minmax(0, 1fr);
    align-items: center;
    gap: 0.55rem;
    padding: 0.5rem 0.55rem;
    color: var(--ink-soft);
    text-decoration: none;
    border-radius: 8px;
    border: 1px solid transparent;
  }
  .landing-v2-nav-item:hover,
  .landing-v2-nav-item:focus-visible {
    color: var(--ink);
    background: var(--bg-lift);
    border-color: var(--border);
    outline: none;
  }
  .landing-v2-nav-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.7rem;
    height: 1.7rem;
    border-radius: 8px;
    color: var(--accent);
    background: var(--accent-lt);
    font-family: var(--mono);
    font-size: 0.74rem;
    font-weight: 700;
  }
  .landing-v2-nav-title {
    display: block;
    color: inherit;
    font-size: 0.78rem;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .landing-v2-nav-meta {
    display: block;
    margin-top: 0.05rem;
    font-size: 0.67rem;
    color: var(--ink-muted);
  }
  .landing-v2-hero {
    padding: 0;
    background:
      linear-gradient(135deg, color-mix(in oklab, var(--accent) 10%, transparent), transparent 42%),
      var(--bg-lift);
    border-bottom: 1px solid var(--border);
  }
  .landing-v2-hero::before {
    background: var(--hero-grad);
  }
  .landing-v2-hero-inner {
    max-width: var(--content-max);
    padding: 1.15rem 2rem 1.3rem;
  }
  .landing-v2-topbar {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    flex-wrap: wrap;
    min-height: 2rem;
    padding-right: 7.5rem;
    color: var(--ink-muted);
    font-size: 0.76rem;
  }
  .landing-v2-topbar a {
    color: var(--ink-soft);
    text-decoration: none;
  }
  .landing-v2-topbar a:hover { color: var(--ink); }
  .landing-v2-topbar .back-link {
    margin: 0;
    font-size: 0.76rem;
  }
  .landing-v2-hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(260px, 340px);
    gap: 1.25rem;
    align-items: stretch;
    margin-top: 0.9rem;
  }
  .landing-v2-hero-copy {
    min-width: 0;
    display: grid;
    align-content: center;
  }
  .landing-v2-hero-copy h1 {
    margin-top: 0.85rem;
    max-width: 13ch;
  }
  .landing-v2-hero-copy .hero-sub {
    max-width: 62ch;
  }
  .landing-v2-path-panel {
    display: grid;
    align-content: start;
    gap: 0.7rem;
    min-width: 0;
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: color-mix(in oklab, var(--bg-card) 88%, var(--bg-lift));
    box-shadow: var(--shadow-card);
  }
  .landing-v2-path-kicker,
  .landing-v2-tile-status {
    font-family: var(--mono);
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0;
    color: var(--accent);
  }
  .landing-v2-path-panel h2 {
    margin: 0;
    color: var(--ink);
    font-size: 1.05rem;
    line-height: 1.2;
  }
  .landing-v2-path-panel p {
    margin: 0;
    color: var(--ink-soft);
    font-size: 0.82rem;
    line-height: 1.45;
  }
  .landing-v2-path-button {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    border-radius: 8px;
    padding: 0.48rem 0.75rem;
    color: var(--bg);
    background: var(--ink);
    font-size: 0.8rem;
    font-weight: 700;
    text-decoration: none;
  }
  html[data-theme="dark"] .landing-v2-path-button {
    color: #07100b;
    background: var(--accent);
  }
  .landing-v2-route-strip {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.45rem;
    margin-top: 1.2rem;
  }
  .landing-v2-route-chip {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.45rem;
    align-items: center;
    min-width: 0;
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--ink);
    text-decoration: none;
    box-shadow: var(--shadow-card);
  }
  .landing-v2-route-chip:hover,
  .landing-v2-route-chip:focus-visible {
    border-color: var(--accent);
    outline: none;
  }
  .landing-v2-chip-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.65rem;
    height: 1.65rem;
    border-radius: 8px;
    background: var(--accent-lt);
    color: var(--accent);
    font-family: var(--mono);
    font-weight: 800;
    font-size: 0.72rem;
  }
  .landing-v2-chip-title {
    display: block;
    min-width: 0;
    color: var(--ink);
    font-size: 0.75rem;
    font-weight: 800;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }
  .landing-v2-chip-meta {
    display: block;
    margin-top: 0.05rem;
    color: var(--ink-muted);
    font-size: 0.66rem;
    line-height: 1.15;
  }
  .landing-v2-main {
    display: grid;
    gap: 1rem;
    width: min(var(--content-max), calc(100vw - var(--sidebar-w) - 56px));
    max-width: var(--content-max);
    margin: 0 auto;
    padding: 1.1rem 2rem 2rem;
  }
  .landing-v2-row {
    display: grid;
    grid-template-columns: minmax(150px, 190px) minmax(0, 1fr);
    gap: 1rem;
    align-items: start;
    padding: 1rem 0;
    border-top: 1px solid var(--border);
    scroll-margin-top: 1rem;
  }
  .landing-v2-row:first-child { border-top: 0; }
  .landing-v2-row-label {
    position: sticky;
    top: 1rem;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.65rem;
    align-items: start;
  }
  .landing-v2-row-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 8px;
    color: var(--accent);
    background: var(--accent-lt);
    border: 1px solid color-mix(in oklab, var(--accent) 35%, var(--border));
    font-family: var(--mono);
    font-weight: 800;
    font-size: 0.8rem;
  }
  .landing-v2-row-label h2 {
    margin: 0;
    color: var(--ink);
    font-size: 1rem;
    line-height: 1.2;
  }
  .landing-v2-row-label p {
    margin: 0.25rem 0 0;
    color: var(--ink-soft);
    font-size: 0.78rem;
    line-height: 1.35;
  }
  .landing-v2-tile-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.85rem;
    min-width: 0;
  }
  .landing-v2-tile {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.8rem;
    min-width: 0;
    min-height: 178px;
    padding: 0.95rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    border-top: 4px solid var(--accent);
    background: var(--bg-card);
    box-shadow: var(--shadow-card);
  }
  .landing-v2-tile-available:hover {
    box-shadow: var(--shadow-lift);
    transform: translateY(-1px);
  }
  .landing-v2-tile-in-preparation,
  .landing-v2-tile-not-scoped {
    background: color-mix(in oklab, var(--bg-card) 72%, var(--bg-lift));
    border-style: dashed;
  }
  .landing-v2-tile-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.35rem;
    height: 2.35rem;
    border-radius: 8px;
    color: var(--accent);
    background: var(--accent-lt);
    flex-shrink: 0;
  }
  .landing-v2-tile-icon svg {
    width: 1.15rem;
    height: 1.15rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .landing-v2-tile-body {
    display: grid;
    align-content: start;
    min-width: 0;
  }
  .landing-v2-tile-body h3 {
    margin: 0.25rem 0 0.25rem;
    color: var(--ink);
    font-size: 0.96rem;
    line-height: 1.2;
    overflow-wrap: anywhere;
  }
  .landing-v2-tile-body p {
    margin: 0;
    color: var(--ink-soft);
    font-size: 0.8rem;
    line-height: 1.42;
  }
  .landing-v2-tile-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.75rem;
  }
  .landing-v2-tile-primary,
  .landing-v2-tile-secondary,
  .landing-v2-placeholder {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2rem;
    border-radius: 8px;
    padding: 0.36rem 0.65rem;
    font-size: 0.76rem;
    font-weight: 800;
    text-decoration: none;
    line-height: 1.2;
  }
  .landing-v2-tile-primary {
    color: var(--bg);
    background: var(--ink);
    border: 1px solid var(--ink);
  }
  html[data-theme="dark"] .landing-v2-tile-primary {
    color: #07100b;
    background: var(--accent);
    border-color: var(--accent);
  }
  .landing-v2-tile-secondary {
    color: var(--accent);
    background: var(--bg-lift);
    border: 1px solid var(--border);
  }
  .landing-v2-tile-primary:hover,
  .landing-v2-tile-secondary:hover,
  .landing-v2-tile-primary:focus-visible,
  .landing-v2-tile-secondary:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--accent) 55%, transparent);
    outline-offset: 2px;
  }
  .landing-v2-placeholder {
    justify-self: start;
    margin-top: 0.75rem;
    color: var(--ink-muted);
    background: var(--bg-lift);
    border: 1px dashed var(--border-lift);
  }
  .accent-economisch { --accent: var(--economisch); --accent-lt: var(--economisch-tint); }
  .accent-wiskunde { --accent: var(--wiskundig); --accent-lt: var(--wiskundig-tint); }
  .accent-grafisch { --accent: var(--grafisch); --accent-lt: var(--grafisch-tint); }
  html[data-theme="dark"] .landing-v2-path-panel,
  html[data-theme="dark"] .landing-v2-route-chip,
  html[data-theme="dark"] .landing-v2-tile {
    box-shadow: var(--shadow-card);
  }
  @media (max-width: 1100px) {
    .landing-v2-route-strip {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .landing-v2-tile-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 860px) {
    .landing-v2-hero-inner {
      padding: 1rem 1.1rem 1.2rem;
    }
    .landing-v2-topbar {
      padding-right: 0;
      padding-top: 2.2rem;
    }
    .landing-v2-hero-grid {
      grid-template-columns: 1fr;
    }
    .landing-v2-hero-copy h1 {
      max-width: 100%;
      font-size: 1.8rem;
    }
    .landing-v2-route-strip {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .landing-v2-main {
      width: 100%;
      padding: 0.8rem 1.1rem 1.5rem;
    }
    .landing-v2-row {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    .landing-v2-row-label {
      position: static;
    }
  }
  @media (max-width: 620px) {
    .landing-v2-route-strip,
    .landing-v2-tile-grid {
      grid-template-columns: 1fr;
    }
    .landing-v2-tile {
      min-height: 0;
    }
    .landing-v2-chip-title,
    .landing-v2-tile-body h3 {
      word-break: normal;
      overflow-wrap: anywhere;
    }
  }`;
}

function renderRouteChip(row) {
  const ready = countRowAvailability(row);
  return `<a class="landing-v2-route-chip accent-${row.accent}" href="#${row.id}" data-section="${row.id}">
          <span class="landing-v2-chip-num">${row.num}</span>
          <span>
            <span class="landing-v2-chip-title">${escapeHtml(row.title)}</span>
            <span class="landing-v2-chip-meta">${ready}/${row.tiles.length} beschikbaar</span>
          </span>
        </a>`;
}

function renderParagraphLandingV2(paragraaf, files) {
  const chapterFull = CONFIG.chapterFullLabel(paragraaf.chapter);
  const accentToken = DOMAIN_SHARED_TOKEN[paragraaf.domain] || "economisch";
  const rows = routeRows(files, paragraaf);
  const nextTile = firstActionableTile(rows);
  const chapterBackHref = "../index.html";
  const bookBackHref = "../../index.html";
  const routeChips = rows.map(renderRouteChip).join("\n        ");
  const sidebarItems = rows.map(row => {
    const ready = countRowAvailability(row);
    return `      <a class="landing-v2-nav-item accent-${row.accent}" href="#${row.id}" data-section="${row.id}">
        <span class="landing-v2-nav-num">${row.num}</span>
        <span>
          <span class="landing-v2-nav-title">${escapeHtml(row.title)}</span>
          <span class="landing-v2-nav-meta">${ready}/${row.tiles.length} beschikbaar</span>
        </span>
      </a>`;
  }).join("\n");
  const nextAction = nextTile
    ? `<a class="landing-v2-path-button" href="${escapeHtml(nextTile.href)}">${escapeHtml(nextTile.action || "Openen")} &rarr;</a>`
    : `<span class="landing-v2-placeholder">In voorbereiding</span>`;
  const nextTitle = nextTile ? nextTile.title : "Route in voorbereiding";
  const nextDesc = nextTile
    ? nextTile.desc
    : "De route blijft zichtbaar terwijl ontbrekende onderdelen worden opgebouwd.";

  return `<!DOCTYPE html>
<html lang="nl" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script>(function(){try{var m=localStorage.getItem('quizMode')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',m);}catch(e){}})();</script>
<title>${escapeHtml(paragraaf.id)} ${escapeHtml(paragraaf.name)} - Lesmateriaal</title>
<link rel="stylesheet" href="../../shared/voorkennis.css">
<style>${paragraphLandingV2CSS()}</style>
</head>
<body data-layout="paragraph-landing-v2" data-accent-domain="${accentToken}">

<button class="sidebar-toggle" id="sidebarToggle" aria-label="Menu openen">
  <svg viewBox="0 0 24 24">${ICONS.hamburger}</svg>
</button>
<div class="sidebar-overlay" id="sidebarOverlay"></div>

<div class="page-layout">
  <nav class="sidebar" id="sidebar" aria-label="Paragraafroute">
    <div class="landing-v2-sidebar-header">
      <h2>${escapeHtml(paragraaf.id)} ${escapeHtml(paragraaf.name)}</h2>
      <p>Lesroute</p>
    </div>
    <div class="landing-v2-sidebar-jump">
      <a href="${chapterBackHref}">${escapeHtml(chapterFull)}</a>
      <a href="${bookBackHref}">${escapeHtml(CONFIG.displayLabel)}</a>
    </div>
    <div class="landing-v2-nav">
${sidebarItems}
    </div>
  </nav>

  <div class="content">
    <header class="hero landing-v2-hero">
      <div class="hero-inner landing-v2-hero-inner">
        <div class="landing-v2-topbar">
          <a class="back-link" href="${chapterBackHref}"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>${escapeHtml(chapterFull)}</a>
          <span>${escapeHtml(CONFIG.displayLabel)}</span>
        </div>
        <div class="landing-v2-hero-grid">
          <div class="landing-v2-hero-copy">
            <span class="hero-badge">Paragraaf ${escapeHtml(paragraaf.id)}</span>
            <h1>${escapeHtml(paragraaf.name)}</h1>
            <p class="hero-sub">Start bij wat je al weet, kies de juiste oefenroute, en sluit af met checkmateriaal zodra dat klaarstaat.</p>
          </div>
          <aside class="landing-v2-path-panel" aria-label="Leerpad">
            <span class="landing-v2-path-kicker">Leerpad</span>
            <h2>${escapeHtml(nextTitle)}</h2>
            <p>${escapeHtml(nextDesc)}</p>
            ${nextAction}
          </aside>
        </div>
        <nav class="landing-v2-route-strip" aria-label="Route stappen">
        ${routeChips}
        </nav>
      </div>
    </header>

    <main class="landing-v2-main">
${rows.map(renderLandingV2Row).join("\n")}
    </main>
  </div>
</div>

<div class="viewer-panel" id="viewerPanel">
  <div class="viewer-bar">
    <span class="viewer-title" id="viewerTitle"></span>
    <a class="viewer-download" id="viewerDownload" download>Download</a>
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

function renderParagraafPage(paragraaf, files, _resolvedMap) {
  return renderParagraphLandingV2(paragraaf, files);
}

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
