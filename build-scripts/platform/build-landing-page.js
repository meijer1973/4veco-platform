/**
 * Build Landing Pages (flat layout)
 *
 * Generates index.html at three levels:
 * - Book page      (overview of all chapters)
 * - Chapter pages render Chapter Landing V2 Minimal Navigation:
 *   orientation only, with paragraph cards linking to paragraph index.html
 *   pages. Learning-route rows and companion resources stay on paragraph
 *   Landing V2 pages.
 * - Paragraaf pages render Landing V2 rows:
 *   Start / Leer / Check / Oefen / Exit ticket / Open & verdiep / Skill-tree games.
 *   Only Start / Leer / Check / Oefen / Exit ticket are lesson-route navigation.
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

// Collapse deploy-config domain-color keys onto the three shared companion
// accent tokens (economisch / wiskunde / grafisch). Paragraph Landing V2 uses
// approved fixture-owned CSS; these tokens only keep route tile accents aligned
// with companion surfaces.
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
  return lessonRouteRows(routeRows(files, item)).map(row => row.title);
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
  // Paragraph Landing V2 does not use the old shared voorkennis.css shell; it
  // is fixture-owned through references/ui/paragraph-landing-v2/.
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

const CHAPTER_V2_FIXTURE_DIR = path.join(__dirname, "..", "..", "references", "ui", "chapter-landing-v2");

function chapterFixtureStyle() {
  const fixturePath = path.join(CHAPTER_V2_FIXTURE_DIR, "approved-minimal.html");
  const html = fs.readFileSync(fixturePath, "utf8");
  const match = html.match(/<style>([\s\S]*?)<\/style>/i);
  if (!match) throw new Error(`Missing <style> block in ${fixturePath}`);
  return match[1].trim();
}

function chapterMinimalCSS() {
  return `${chapterFixtureStyle()}

    .chapter-paragraph-card,
    .paragraph-route-tags,
    .target-panel,
    .chapter-overview {
      min-width: 0;
    }
    .chapter-paragraph-card .para-card-index + .para-card-index {
      background: transparent;
      border-style: dashed;
    }`;
}

function chapterPageShell(title, bodyContent) {
  return `<!DOCTYPE html>
<html lang="nl" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script>
  (function() {
    try {
      var saved = localStorage.getItem('chapterMinimalTheme');
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      var theme = saved === 'dark' || saved === 'light' ? saved : (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    } catch (error) {}
  })();
</script>
<title>${title}</title>
<style>${chapterMinimalCSS()}</style>
</head>
<body data-layout="chapter-landing-v2">
${bodyContent}
<script>
  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('chapterMinimalTheme', next); } catch (error) {}
  }
</script>
</body>
</html>`;
}

function chapterNavHref(pageType, targetChapter, targetParagraaf, resolvedMap, currentChapterId) {
  const ch = CONFIG.chapterIndex[targetChapter];
  const chFolder = ch ? encodeURIComponent(ch.folder) : "";
  const resolved = targetParagraaf ? resolvedMap[targetParagraaf] : null;
  const pFolder = resolved ? encodeURIComponent(resolved.folderName) : "";

  if (pageType === "book") return "../index.html";
  if (pageType === "chapter") return targetChapter === currentChapterId ? "index.html" : `../${chFolder}/index.html`;
  if (targetChapter === currentChapterId) return `${pFolder}/index.html`;
  return `../${chFolder}/${pFolder}/index.html`;
}

function renderChapterMinimalSidebar(chapterId, resolvedMap) {
  const currentChapter = CONFIG.chapterIndex[chapterId];
  const currentParagraphs = CONFIG.paragraphs.filter(p => p.chapter === chapterId && !CONFIG.isHidden(p.id) && resolvedMap[p.id]);

  const chapterLinks = CONFIG.chapters
    .filter(ch => CONFIG.paragraphs.some(p => p.chapter === ch.id && !CONFIG.isHidden(p.id) && resolvedMap[p.id]))
    .map(ch => {
      const current = ch.id === chapterId ? " current" : "";
      const href = chapterNavHref("chapter", ch.id, null, resolvedMap, chapterId);
      return `<a class="side-link${current}" href="${href}"><span class="side-number">H${escapeHtml(ch.number)}</span><span>${escapeHtml(ch.name)}</span></a>`;
    })
    .join("\n        ");

  const paragraphLinks = currentParagraphs.map(p => {
    const pNum = p.id.split(".").pop();
    const href = chapterNavHref("paragraaf", chapterId, p.id, resolvedMap, chapterId);
    return `<a class="side-link" href="${href}"><span class="side-number">${escapeHtml(pNum)}</span><span>${escapeHtml(p.name)}</span></a>`;
  }).join("\n        ");

  return `    <aside class="sidebar" aria-label="Boeknavigatie">
      <div class="brand">
        <div class="brand-mark">4V</div>
        <div>
          <strong>${escapeHtml(CONFIG.displayLabel)}</strong>
          <span>Hoofdstuknavigatie</span>
        </div>
      </div>

      <section class="sidebar-block" aria-label="Boek">
        <p class="sidebar-section-title">Boek</p>
        <a class="side-link" href="../index.html"><span class="side-number">${escapeHtml(String(CONFIG.nr))}</span><span>${escapeHtml(CONFIG.name)}</span></a>
      </section>

      <section class="sidebar-block" aria-label="Hoofdstukken">
        <p class="sidebar-section-title">Hoofdstukken</p>
        ${chapterLinks}
      </section>

      <section class="sidebar-block" aria-label="Paragrafen in dit hoofdstuk">
        <p class="sidebar-section-title">Paragrafen H${escapeHtml(currentChapter.number)}</p>
        ${paragraphLinks}
      </section>
    </aside>`;
}

function renderChapterPage(chapterId, resolvedMap) {
  const ch = CONFIG.chapterIndex[chapterId];
  const paragrafen = CONFIG.paragraphs.filter(p => p.chapter === chapterId && !CONFIG.isHidden(p.id));
  const visibleParagrafen = paragrafen.filter(p => resolvedMap[p.id]);
  const dc = DOMAIN_COLORS[ch.domain] || DOMAIN_COLORS.blue;
  const meta = landingMeta(ch);
  const summary = meta.summary || ch.summary || "Kies een paragraafpagina voor de leerroute, uitleg, oefeningen en checks.";
  const sidebarHTML = renderChapterMinimalSidebar(chapterId, resolvedMap);

  const chapterChips = visibleParagrafen.map(p => {
    const resolved = resolvedMap[p.id];
    const href = `${encodeURIComponent(resolved.folderName)}/index.html`;
    return `<a class="chapter-chip" href="${href}"><b>${escapeHtml(p.id)}</b><span>${escapeHtml(p.name)}</span></a>`;
  }).join("\n        ");

  let cardHTML = "";

  for (const p of visibleParagrafen) {
    const resolved = resolvedMap[p.id];
    const pFolder = encodeURIComponent(resolved.folderName);
    const pNum = p.id.split(".").pop();
    const token = domainToken(p.domain || ch.domain);
    const meta = landingMeta(p);
    const pSummary = meta.summary || p.summary || "Open de paragraafpagina voor de leerroute, uitleg, oefeningen en checks.";
    const availability = sectionAvailability(scanFiles(resolved.fullPath), p);
    const availabilityHTML = availability.length
      ? `<div class="paragraph-route-tags para-card-tags" aria-label="Beschikbare onderdelen op de paragraafpagina">${availability.map(label => `<span class="paragraph-route-tag para-card-tag">${escapeHtml(label)}</span>`).join("")}</div>`
      : "";
    const pitfallHTML = renderCardPitfalls(p);
    cardHTML += `
          <a class="chapter-paragraph-card para-card domain-${token}" data-domain="${token}" data-paragraph-id="${escapeHtml(p.id)}" href="${pFolder}/index.html">
            <div class="para-num">${escapeHtml(p.id)}</div>
            <div class="para-info">
              <div class="para-card-topline">
                <span class="para-card-index">Paragraaf ${escapeHtml(pNum)}</span>
                <span class="para-card-index">Lesroute</span>
              </div>
              <h3>${escapeHtml(p.name)}</h3>
              <p>${escapeHtml(pSummary)}</p>${availabilityHTML ? `\n              ${availabilityHTML}` : ""}${pitfallHTML ? `\n              ${pitfallHTML}` : ""}
            </div>
            <div class="open-arrow" aria-hidden="true">→</div>
          </a>`;
  }

  const bodyHTML = `
  <div class="app-shell chapter-shell" style="--accent: ${dc.main}; --accent-soft: ${dc.light};">
${sidebarHTML}
    <main class="content">
      <div class="topbar">
        <div>
          <p class="eyebrow">${escapeHtml(CONFIG.displayLabel)}</p>
          <strong>Boek ${escapeHtml(String(CONFIG.nr))} / Hoofdstuk ${escapeHtml(String(ch.number))}</strong>
        </div>
        <button class="theme-note" type="button" onclick="toggleTheme()" aria-label="Wissel tussen licht en donker thema">◐ Licht / donker</button>
      </div>

      <section class="hero chapter-hero" aria-labelledby="chapter-title">
        <div class="hero-grid">
          <div>
            <p class="eyebrow">Hoofdstuk ${escapeHtml(String(ch.number))}</p>
            <h1 id="chapter-title">${escapeHtml(ch.name)}</h1>
            <p>${escapeHtml(summary)}</p>
          </div>
          <aside class="target-panel chapter-panel" aria-label="Hoofdstukinformatie">
            <h2>Hoofdstukinformatie</h2>
            <p>${escapeHtml(CONFIG.displayLabel)}. Deze pagina organiseert het hoofdstuk en stuurt door naar paragraafpagina's.</p>
            <div class="stats">
              <div class="stat"><strong>${visibleParagrafen.length}</strong><span>paragrafen</span></div>
              <div class="stat"><strong>H${escapeHtml(String(ch.number))}</strong><span>hoofdstuk</span></div>
              <div class="stat"><strong>VWO 4</strong><span>niveau</span></div>
            </div>
          </aside>
        </div>
      </section>

      <nav class="chapter-overview chapter-strip" aria-label="Snel naar paragraaf">
        ${chapterChips}
      </nav>

      <section aria-labelledby="paragraphs-title">
        <div class="section-title">
          <div>
            <h2 id="paragraphs-title">Paragrafen in dit hoofdstuk</h2>
            <p>Open een paragraafpagina voor de leerroute, uitleg, oefeningen en checks.</p>
          </div>
        </div>

        <div class="chapter-overview paragraph-list">
${cardHTML}
        </div>
      </section>

      <aside class="chapter-note">
        <strong>Ontwerpprincipe:</strong> deze hoofdstukpagina blijft navigatie en oriëntatie. Leeractiviteiten, checks, games en lesboekbronnen horen op paragraafpagina's.
      </aside>

      <p class="footer-note">Economie VWO 4 · ${escapeHtml(CONFIG.displayLabel)} · hoofdstuknavigatie</p>
    </main>
  </div>`;

  return chapterPageShell(`${CONFIG.chapterFullLabel(chapterId)} - Hoofdstuknavigatie`, bodyHTML);
}

// PARAGRAAF PAGE
// ═══════════════════════════════════════════════════════════════════════════

const PARAGRAPH_V2_FIXTURE_DIR = path.join(__dirname, "..", "..", "references", "ui", "paragraph-landing-v2");

function fixtureStyle(name) {
  const fixturePath = path.join(PARAGRAPH_V2_FIXTURE_DIR, name);
  const html = fs.readFileSync(fixturePath, "utf8");
  const match = html.match(/<style>([\s\S]*?)<\/style>/i);
  if (!match) throw new Error(`Missing <style> block in ${fixturePath}`);
  return match[1].trim();
}

function fixtureRootBlock(css, selector) {
  const match = css.match(/:root\s*\{[\s\S]*?\n\s*\}/);
  if (!match) throw new Error("Missing :root token block in paragraph landing fixture");
  return match[0].replace(/^:root/, selector);
}

function paragraphPrototypeCSS() {
  const lightCSS = fixtureStyle("approved-light.html").replace(/^\s*:root/, "    :root,\n    html[data-theme=\"light\"]");
  const darkCSS = fixtureStyle("approved-dark.html");
  const darkTokens = fixtureRootBlock(darkCSS, "html[data-theme=\"dark\"]");
  return `${lightCSS}

    ${darkTokens}

    html[data-theme="dark"] body {
      background:
        radial-gradient(circle at 8% 0%, rgba(92, 228, 211, 0.14), transparent 34rem),
        radial-gradient(circle at 92% 6%, rgba(241, 163, 79, 0.10), transparent 28rem),
        linear-gradient(140deg, var(--page), var(--page-2));
    }
    html[data-theme="dark"] .sidebar {
      border-right: 1px solid rgba(237, 243, 251, 0.05);
      background: rgba(9, 16, 25, 0.78);
    }
    html[data-theme="dark"] .brand strong { color: var(--ink); }
    html[data-theme="dark"] .brand-mark {
      color: #08121d;
      background: linear-gradient(135deg, #5ce4d3, #6fd29b);
      box-shadow: 0 12px 24px rgba(92, 228, 211, 0.18);
    }
    html[data-theme="dark"] .side-link.current,
    html[data-theme="dark"] .side-link:hover {
      background: rgba(19, 33, 49, 0.98);
      color: var(--ink);
      box-shadow: var(--shadow-small);
    }
    html[data-theme="dark"] .side-number { background: rgba(255, 255, 255, 0.06); }
    html[data-theme="dark"] .side-link.current .side-number { color: #08121d; }
    html[data-theme="dark"] .theme-note {
      background: rgba(19, 33, 49, 0.9);
      border-color: var(--line-soft);
    }
    html[data-theme="dark"] .hero {
      border: 1px solid rgba(255, 255, 255, 0.06);
      background:
        linear-gradient(135deg, rgba(19, 33, 49, 0.96), rgba(13, 24, 39, 0.92)),
        radial-gradient(circle at 20% 20%, rgba(92, 228, 211, 0.10), transparent 24rem),
        radial-gradient(circle at 88% 8%, rgba(241, 163, 79, 0.08), transparent 22rem);
    }
    html[data-theme="dark"] .hero::after {
      background: radial-gradient(circle, rgba(92, 228, 211, 0.12), transparent 68%);
    }
    html[data-theme="dark"] .eyebrow {
      color: #9cf3e7;
      border: 1px solid rgba(92, 228, 211, 0.16);
    }
    html[data-theme="dark"] .target-panel { background: rgba(15, 27, 40, 0.96); }
    html[data-theme="dark"] .meter-track { background: rgba(255, 255, 255, 0.06); }
    html[data-theme="dark"] .meter-fill { background: linear-gradient(90deg, var(--accent), #6fd29b); }
    html[data-theme="dark"] .route-chip {
      background: rgba(19, 33, 49, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
    }
    html[data-theme="dark"] .route-chip:hover { border-color: rgba(92, 228, 211, 0.2); }
    html[data-theme="dark"] .row-label {
      background: rgba(19, 33, 49, 0.76);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    html[data-theme="dark"] .row-label .step {
      color: #08121d;
      box-shadow: 0 10px 20px rgba(92, 228, 211, 0.16);
    }
    html[data-theme="dark"] .tile {
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    html[data-theme="dark"] .tile:hover,
    html[data-theme="dark"] .tile:focus-visible {
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.28);
      border-color: rgba(92, 228, 211, 0.22);
    }
    html[data-theme="dark"] .icon-badge { box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); }
    html[data-theme="dark"] .notice,
    html[data-theme="dark"] .tile-disabled {
      border: 1px solid rgba(255, 188, 102, 0.16);
      background: rgba(255, 188, 102, 0.08);
      color: #ffd391;
    }
    .theme-note {
      border: 1px solid var(--line-soft);
      cursor: pointer;
      font: inherit;
    }
    .route-chip:hover { transform: translateY(-1px); border-color: rgba(31, 111, 120, 0.28); }
    .tile-disabled {
      border: 1px solid rgba(168, 91, 0, 0.20);
      background: #fff6e8;
      color: #69410f;
      box-shadow: none;
    }
    .tile-disabled:hover,
    .tile-disabled:focus-visible {
      transform: none;
      box-shadow: none;
      border-color: rgba(168, 91, 0, 0.20);
    }
    .tile-primary,
    .tile-secondary {
      color: var(--tile-accent, var(--accent));
      font-weight: 800;
      text-decoration: none;
    }
    .tile-secondary-links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
      position: relative;
      z-index: 1;
    }
    .tile-secondary {
      padding: 5px 8px;
      border-radius: 999px;
      background: var(--tile-soft, var(--accent-soft));
      font-size: 0.75rem;
    }
    .tile-status {
      color: var(--warn);
      font-weight: 850;
    }
    @media (max-width: 760px) {
      html,
      body {
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
      }
      .app-shell,
      .content {
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        min-width: 0;
      }
      .app-shell {
        display: block;
      }
      .content {
        margin: 0;
        padding-left: 20px;
        padding-right: 20px;
      }
      .hero,
      .route-strip,
      .rows,
      .learning-row,
      .tile-grid,
      .row-label {
        box-sizing: border-box;
        width: calc(100vw - 40px);
        max-width: calc(100vw - 40px);
        min-width: 0;
      }
      .target-panel,
      .tile {
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        min-width: 0;
      }
      h1 {
        max-width: calc(100vw - 84px);
        font-size: 1.75rem;
        line-height: 1.08;
      }
      .lead,
      .target-panel {
        max-width: calc(100vw - 84px);
      }
      .target-panel {
        overflow: hidden;
      }
      .hero-grid {
        grid-template-columns: 1fr;
        min-width: 0;
      }
      .meter-copy {
        display: grid;
        grid-template-columns: 1fr;
        gap: 4px;
      }
      h1,
      .lead,
      .target-panel p,
      .meter-copy,
      .breadcrumb,
      .route-chip,
      .tile {
        overflow-wrap: anywhere;
      }
    }`;
}

function fileHref(file) {
  return file ? encPath([file]) : null;
}

function pairFile(pair, preferred = ["html", "pdf", "pptx"]) {
  if (!pair) return null;
  for (const key of preferred) {
    if (pair[key]) return pair[key];
  }
  return null;
}

function pairHref(pair, preferred) {
  return fileHref(pairFile(pair, preferred));
}

function hasScopedMathSkillTree(paragraaf) {
  return Boolean(
    paragraaf &&
    paragraaf.skilltree &&
    Array.isArray(paragraaf.skilltree.skills) &&
    paragraaf.skilltree.skills.length > 0
  );
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

function lessonRouteRows(rows) {
  return rows.filter(row => row.lessonRoute !== false);
}

function routeRows(files, paragraaf) {
  const mathRouteAvailable = Boolean(files.oefenen.wiskundevaardigheden && hasScopedMathSkillTree(paragraaf));
  const skillEngineAvailable = mathRouteAvailable;
  const presentationHref = pairHref(files.leren.presentatie, ["html", "pptx"]);
  const skillsExplanationHref = pairHref(files.leren.vaardigheden, ["html", "docx"]);
  const presentationLinks = [];
  if (files.leren.presentatie && files.leren.presentatie.html && files.leren.presentatie.pptx) {
    presentationLinks.push({ href: fileHref(files.leren.presentatie.pptx), label: "PowerPoint", download: true });
  }
  const explanationLinks = [];
  if (files.leren.vaardigheden && files.leren.vaardigheden.html && files.leren.vaardigheden.docx) {
    explanationLinks.push({ href: fileHref(files.leren.vaardigheden.docx), label: "Uitleg vaardigheden (Word)", download: true });
  }
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
  if (files.oefenen.wiskundevaardigheden && !skillEngineAvailable) {
    sourceLinks.push({ href: fileHref(files.oefenen.wiskundevaardigheden), label: "Vaardigheidskaart" });
  }

  return [
    {
      id: "start",
      layer: "start",
      num: 1,
      title: "Start",
      hint: "Oriënteren, voorkennis ophalen en de paragraaf actueel maken.",
      chip: "voorkennis + nieuws",
      grid: "two",
      tiles: [
        {
          id: "instapquiz",
          tone: "start",
          pill: "voorkennis",
          icon: "Q",
          title: "Instapquiz voorkennis",
          desc: "Check snel welke begrippen en basishandelingen je al paraat hebt.",
          href: fileHref(files.voorbereiden.instapquiz),
          action: "Maak quiz",
          aria: "Open de voorkennisquiz",
        },
        {
          id: "nieuwsdetective",
          tone: "econ",
          pill: "context",
          icon: "N",
          title: "Nieuws-detective",
          desc: "Ontdek waar de economie uit deze paragraaf zichtbaar wordt in een actuele bron.",
          href: fileHref(files.voorbereiden.nieuwsdetective),
          action: "Onderzoek bron",
          aria: "Open de nieuws-detective",
        },
      ],
    },
    {
      id: "leer",
      layer: "leer",
      num: 2,
      title: "Leer",
      hint: "Gebruik uitleg en route-inzicht voordat je zelfstandig gaat oefenen.",
      chip: "uitleg + presentatie + leerpad",
      tiles: [
        {
          id: "uitleg-vaardigheden",
          tone: "graph",
          pill: "uitleg",
          icon: "U",
          title: "Uitleg vaardigheden",
          desc: "De kernstappen van deze paragraaf met korte voorbeelden en vaste begrippen.",
          href: skillsExplanationHref,
          links: skillsExplanationHref ? explanationLinks : [],
          action: "Open uitleg vaardigheden",
          aria: "Open uitleg vaardigheden",
        },
        {
          id: "presentatie",
          tone: "econ",
          pill: "klassikaal",
          icon: "P",
          title: "PowerPoint-presentatie",
          desc: "De lespresentatie met de visuele ankers, kernvragen en klassikale uitleg.",
          href: presentationHref,
          links: presentationLinks,
          action: "Open presentatie",
          aria: "Open de PowerPoint-presentatie",
        },
        {
          id: "skill-engine",
          tone: "start",
          pill: "leerpad",
          icon: "L",
          title: "Skill engine / leerpad",
          desc: "Bekijk welke vaardigheden bij deze paragraaf horen en wat je volgende nuttige stap is.",
          href: skillEngineAvailable ? fileHref(files.oefenen.wiskundevaardigheden) : null,
          action: "Bekijk leerpad",
          aria: "Open de skill engine",
        },
      ],
    },
    {
      id: "check",
      layer: "check",
      num: 3,
      title: "Check",
      hint: "Doe een korte lokale check voor oefenadvies voordat je verder oefent.",
      chip: "kort advies",
      grid: "single",
      tiles: [
        {
          id: "korte-check",
          tone: "check",
          pill: "advies",
          icon: "K",
          title: "Korte check",
          desc: "Een lichte lokale check die aangeeft welke route nu verstandig is.",
          href: fileHref(files.check.shortCheck),
          action: "Krijg oefenadvies",
          aria: "Open korte check",
        },
      ],
    },
    {
      id: "oefen",
      layer: "oefen",
      num: 4,
      title: "Oefen",
      hint: "Van steun naar kernopgaven en daarna eventueel routeadvies.",
      chip: "begeleid - zelfstandig - lokaal advies",
      tiles: [
        {
          id: "begeleide-oefeningen",
          tone: "check",
          pill: "met steun",
          icon: "B",
          title: "Begeleide oefeningen",
          desc: "Maak opgaven met hints, tussenstappen en voorbeeldstructuur.",
          href: files.oefenen.begeleide ? fileHref(files.oefenen.begeleide.interactief) : null,
          links: guidedLinks,
          action: "Start begeleid",
          aria: "Open begeleide oefeningen",
        },
        {
          id: "zelfstandige-oefeningen",
          tone: "econ",
          pill: "kern",
          icon: "Z",
          title: "Zelfstandige oefeningen",
          desc: "De normale opgavenroute van de paragraaf: dit is de kern van het oefenen.",
          href: pairHref(files.lesboek.opgaven, ["html", "pdf"]),
          links: exerciseLinks,
          action: "Maak opgaven",
          aria: "Open zelfstandige oefeningen",
        },
        {
          id: "adaptieve-oefenroute",
          tone: "math",
          pill: "lokaal advies",
          icon: "A",
          title: "Adaptieve oefenroute",
          desc: "Een voorgestelde volgende oefening op basis van lokale voortgang komt hier zodra die route klaarstaat.",
          href: null,
          action: "Vraag advies",
          aria: "Open adaptieve oefeningen",
        },
      ],
    },
    {
      id: "exit-ticket",
      layer: "exit-ticket",
      num: 5,
      title: "Exit ticket",
      hint: "Maak de aparte eindcontrole wanneer je klaar bent voor doelopgave-niveau.",
      chip: "eindcontrole",
      grid: "single",
      tiles: [
        {
          id: "exit-ticket",
          tone: "reason",
          pill: "eindcontrole",
          icon: "E",
          title: "Exit ticket",
          desc: "Laat zien dat je de doelopgave op hetzelfde niveau en met dezelfde antwoordvorm aankunt.",
          href: fileHref(files.check.exitTicket),
          action: "Maak exit ticket",
          aria: "Open exit ticket",
        },
      ],
    },
    {
      id: "open",
      layer: "open-verdiep",
      num: 6,
      title: "Open & verdiep",
      hint: "Open het lesboek of aanvullend materiaal wanneer je het nodig hebt.",
      chip: "lesboek + extra",
      lessonRoute: false,
      tiles: [
        {
          id: "lesboek-openen",
          tone: "start",
          pill: "tekstboek",
          icon: "L",
          title: "Lesboek openen",
          desc: "De volledige paragraaf met uitleg, voorbeelden en visuals.",
          href: pairHref(files.lesboek.paragraaf, ["html", "pdf"]),
          links: textbookLinks,
          action: "Open paragraaf",
          aria: "Open het lesboek",
        },
        {
          id: "opgaven-antwoorden",
          tone: "graph",
          pill: "controle",
          icon: "O",
          title: "Opgaven & antwoorden",
          desc: "Open de opgaven, controleer je aanpak en vergelijk met de uitwerkingen.",
          href: pairHref(files.lesboek.opgaven, ["html", "pdf"]),
          links: exerciseLinks,
          action: "Open bronnen",
          aria: "Open opgaven en antwoorden",
        },
        {
          id: "aanvullend-materiaal",
          tone: "econ",
          pill: "extra",
          icon: "+",
          title: "Aanvullend materiaal",
          desc: "Samenvatting, extra context of video zonder de hoofdroute te verstoppen.",
          href: sourceLinks.length ? sourceLinks[0].href : null,
          links: sourceLinks.slice(1),
          action: "Bekijk extra",
          aria: "Open extra materiaal",
        },
      ],
    },
    {
      id: "skills",
      layer: "skill-tree-games",
      num: 7,
      title: "Skill-tree games",
      hint: "Train de drie hoofdvaardigheden als korte, gerichte spelroutes.",
      chip: "redeneren - rekenen - grafieken",
      lessonRoute: false,
      tiles: [
        {
          id: "redeneren",
          tone: "reason",
          pill: "redeneren",
          icon: "R",
          title: "Redeneren",
          desc: GAME_ASPECTS.reasoning.summary,
          href: fileHref(files.oefenen.redeneerSpel),
          action: "Speel route",
          aria: "Open het redeneerspel",
        },
        {
          id: "rekenen",
          tone: "math",
          pill: "rekenen",
          icon: "%",
          title: "Rekenen",
          desc: GAME_ASPECTS.calculation.summary,
          href: mathRouteAvailable ? fileHref(files.oefenen.wiskundevaardigheden) : null,
          action: "Train stappen",
          aria: "Open het rekenspel",
        },
        {
          id: "grafieken",
          tone: "graph",
          pill: "grafieken",
          icon: "G",
          title: "Grafieken",
          desc: GAME_ASPECTS.graphical.summary,
          href: fileHref(files.oefenen.grafiekenspel),
          action: "Lees grafiek",
          aria: "Open het grafiekenspel",
        },
      ],
    },
  ];
}

function renderTile(tile) {
  const state = tileState(tile);
  const disabled = state !== "available";
  const links = Array.isArray(tile.links) ? tile.links.filter(link => link && link.href) : [];
  const hasSecondary = links.length > 0;
  const attrs = `class="tile ${escapeHtml(tile.tone)}${disabled ? " tile-disabled" : ""}" data-tile-id="${escapeHtml(tile.id)}" data-tile-state="${escapeHtml(state)}" aria-label="${escapeHtml(tile.aria || tile.title)}"`;
  const header = `<div class="tile-header"><div class="icon-badge">${escapeHtml(tile.icon)}</div><div><span class="pill">${escapeHtml(disabled ? tileStatusLabel(state).toLowerCase() : tile.pill)}</span><h3>${escapeHtml(tile.title)}</h3><p>${escapeHtml(tile.desc)}</p></div></div>`;
  const secondary = hasSecondary
    ? `<div class="tile-secondary-links">${links.map(link => `<a class="tile-secondary" href="${escapeHtml(link.href)}"${link.download ? " download" : ""}>${escapeHtml(link.label)}</a>`).join("")}</div>`
    : "";
  if (disabled) {
    return `            <article ${attrs} aria-disabled="true">
              ${header}
              <div class="tile-footer"><span class="tile-status">${escapeHtml(tileStatusLabel(state))}</span><span>...</span></div>
            </article>`;
  }
  if (hasSecondary) {
    return `            <article ${attrs}>
              ${header}
              <div class="tile-footer"><a class="tile-primary" href="${escapeHtml(tile.href)}">${escapeHtml(tile.action)}</a><span>&rarr;</span></div>
              ${secondary}
            </article>`;
  }
  return `            <a ${attrs} href="${escapeHtml(tile.href)}">
              ${header}
              <div class="tile-footer"><span>${escapeHtml(tile.action)}</span><span>&rarr;</span></div>
            </a>`;
}

function renderRouteChip(row) {
  return `        <a class="route-chip" href="#${escapeHtml(row.id)}" data-route-layer="${escapeHtml(row.layer)}"><b>${escapeHtml(row.title)}</b><span>${escapeHtml(row.chip)}</span></a>`;
}

function renderLearningRow(row) {
  const gridClass = row.grid === "single" ? "tile-grid single" : (row.grid === "two" ? "tile-grid two" : "tile-grid");
  return `        <div class="learning-row" id="${escapeHtml(row.id)}" data-route-layer="${escapeHtml(row.layer)}" data-row-ready="${countRowAvailability(row)}" data-row-total="${row.tiles.length}">
          <div class="row-label">
            <div class="step">${row.num}</div>
            <div>
              <h2>${escapeHtml(row.title)}</h2>
              <p>${escapeHtml(row.hint)}</p>
            </div>
          </div>
          <div class="${gridClass}">
${row.tiles.map(renderTile).join("\n")}
          </div>
        </div>`;
}

function renderPrototypeSidebar(paragraaf, resolvedMap, rows) {
  const chapter = CONFIG.chapterIndex[paragraaf.chapter];
  const chapterTitle = chapter ? `Hoofdstuk ${chapter.number}` : paragraaf.chapter;
  const chapterParagraphs = CONFIG.paragraphs.filter(p => p.chapter === paragraaf.chapter && !CONFIG.isHidden(p.id));
  const paragraphLinks = chapterParagraphs.map(p => {
    const resolved = resolvedMap && resolvedMap[p.id];
    const href = p.id === paragraaf.id ? "index.html" : `../${encPath([resolved ? resolved.folderName : `${p.id} ${p.name}`])}/index.html`;
    return `      <a class="side-link${p.id === paragraaf.id ? " current" : ""}" href="${href}"><span class="side-number">${escapeHtml(p.id)}</span><span>${escapeHtml(p.name)}</span></a>`;
  }).join("\n");
  const routeLinks = lessonRouteRows(rows).map(row => `      <a class="side-link" href="#${escapeHtml(row.id)}" data-route-layer="${escapeHtml(row.layer)}"><span class="side-number">${row.num}</span><span>${escapeHtml(row.title)}</span></a>`).join("\n");
  return `    <aside class="sidebar" aria-label="Boeknavigatie">
      <div class="brand">
        <div class="brand-mark">4v</div>
        <div><strong>Economie VWO 4</strong><small>${escapeHtml(CONFIG.displayLabel)}</small></div>
      </div>
      <div class="sidebar-section-title">${escapeHtml(chapterTitle)}</div>
${paragraphLinks}
      <div class="sidebar-section-title">Route</div>
${routeLinks}
    </aside>`;
}

function renderParagraafPage(paragraaf, files, resolvedMap) {
  const chapterFull = CONFIG.chapterFullLabel(paragraaf.chapter);
  const rows = routeRows(files, paragraaf);
  const nextTile = firstActionableTile(rows);
  const nextAction = nextTile
    ? `<a class="tile-primary" href="${escapeHtml(nextTile.href)}">${escapeHtml(nextTile.action || "Openen")} &rarr;</a>`
    : `<span class="tile-status">In voorbereiding</span>`;
  const nextTitle = nextTile ? nextTile.title : "Route in voorbereiding";
  const nextDesc = nextTile
    ? nextTile.desc
    : "De route blijft zichtbaar terwijl ontbrekende onderdelen worden opgebouwd.";
  const breadcrumbChapter = CONFIG.chapterIndex[paragraaf.chapter] ? `Hoofdstuk ${CONFIG.chapterIndex[paragraaf.chapter].number}` : chapterFull;

  return `<!doctype html>
<html lang="nl" data-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(paragraaf.id)} ${escapeHtml(paragraaf.name)} - Lesroute</title>
  <script>(function(){try{var q=new URLSearchParams(location.search).get('theme');var m=(q==='dark'||q==='light')?q:(localStorage.getItem('quizMode')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));document.documentElement.setAttribute('data-theme',m);}catch(e){}})();</script>
  <style>
${paragraphPrototypeCSS()}
  </style>
</head>
<body>
  <div class="app-shell">
${renderPrototypeSidebar(paragraaf, resolvedMap, rows)}

    <main class="content">
      <div class="topbar">
        <nav class="breadcrumb" aria-label="Kruimelpad">
          <a href="../../index.html">${escapeHtml(CONFIG.displayLabel)}</a><span>&rsaquo;</span><a href="../index.html">${escapeHtml(breadcrumbChapter)}</a><span>&rsaquo;</span><span>Paragraaf ${escapeHtml(paragraaf.id)}</span>
        </nav>
        <button class="theme-note" id="themeToggle" type="button">Licht thema &middot; duidelijke route</button>
      </div>

      <section class="hero" aria-labelledby="page-title">
        <div class="hero-grid">
          <div>
            <div class="eyebrow">Paragraaf landing</div>
            <h1 id="page-title">${escapeHtml(paragraaf.name)}</h1>
            <p class="lead">Een duidelijke route voor de hele paragraaf: eerst bepalen wat je nodig hebt, daarna trainen, leren, oefenen, controleren en tenslotte het lesboek of extra materiaal openen.</p>
          </div>
          <aside class="target-panel" aria-label="Leerpadstatus">
            <h2>Jouw leerpad</h2>
            <p>${escapeHtml(nextDesc)}</p>
            <div>${nextAction}</div>
            <div class="mini-meter" aria-label="Voorbeeld voortgang">
              <div class="meter-track"><div class="meter-fill"></div></div>
              <div class="meter-copy"><span>${escapeHtml(nextTitle)}</span><span>richting exit ticket</span></div>
            </div>
          </aside>
        </div>
      </section>

      <div class="route-strip" aria-label="Routeoverzicht">
${lessonRouteRows(rows).map(renderRouteChip).join("\n")}
      </div>

      <section class="rows" aria-label="Paragraafroute">
${rows.map(renderLearningRow).join("\n\n")}
      </section>

      <p class="footer-note">Economie VWO 4 &middot; open lesmateriaal &middot; voortgang blijft lokaal op dit apparaat.</p>
    </main>
  </div>
<script>
(function(){
  var button = document.getElementById('themeToggle');
  function applyTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    try { localStorage.setItem('quizMode', mode); } catch (e) {}
    if (button) button.innerHTML = mode === 'dark' ? 'Donker thema &middot; zelfde route' : 'Licht thema &middot; duidelijke route';
  }
  applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
  if (button) button.addEventListener('click', function(){
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
})();
</script>
</body>
</html>`;
}

// u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}u{2550}
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
