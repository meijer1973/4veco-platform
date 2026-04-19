/**
 * Build Landing Pages + Restructure Folders
 *
 * Generates index.html at three levels:
 * - Module page (overview of all chapters)
 * - Chapter pages (overview of paragrafen in that chapter)
 * - Paragraaf pages (file dashboard with Voorbereiden/Leren/Oefenen)
 *
 * All pages include a left navigation sidebar showing the full book structure.
 *
 * HOW TO ADAPT:
 * - To add a new paragraaf: add an entry to PARAGRAAF_DATA
 * - To change the HTML template: edit renderParagraafPage / renderChapterPage / renderModulePage
 * - To run for a single paragraaf: set ONLY_ID = "3.2.3" (or null for all)
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/build-landing-page.js
 */
const fs = require("fs");
const path = require("path");

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const MODULE_BASE = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.join(__dirname, "..");

const ONLY_ID = null;
const DRY_RUN = false;

// Temporarily hide the task rows (basisopgaven, middenopgaven, verrijkingsopgaven)
// Set to false to show them again
const HIDE_TASK_ROWS = false;

// Temporarily hide specific paragrafen from nav, chapter pages, and generation
// The folder and files remain intact; remove the id from this set to restore
const HIDDEN_PARAGRAFEN = new Set(["3.2.4"]);

// ── Module auto-detection ─────────────────────────────────────────────
// Scan MODULE_ROOT for chapter folders (X.Y Hoofdstuk...) to determine
// which module we're building. This filters all config to only that module.
function detectModulePrefix() {
  const entries = fs.readdirSync(MODULE_BASE, { withFileTypes: true });
  const chapterPattern = /^(\d+)\.\d+\s+Hoofdstuk/;
  const moduleNrs = new Set();
  for (const e of entries) {
    if (e.isDirectory()) {
      const m = e.name.match(chapterPattern);
      if (m) moduleNrs.add(m[1]);
    }
  }
  if (moduleNrs.size === 0) {
    console.error("ERROR: No chapter folders found in", MODULE_BASE);
    process.exit(1);
  }
  if (moduleNrs.size > 1) {
    console.warn("WARNING: Multiple modules detected:", [...moduleNrs].join(", "), "— using first");
  }
  return [...moduleNrs][0]; // e.g., "3" or "1"
}

const MODULE_NR = detectModulePrefix();

// ── Module metadata ───────────────────────────────────────────────────
const MODULE_NAMES = {
  "1": "Schaarste, geld en handel",
  "2": "Vraag en aanbod",
  "3": "Markt en overheid",
};
const MODULE_NAME = MODULE_NAMES[MODULE_NR] || `Module ${MODULE_NR}`;

console.log(`Detected module: ${MODULE_NR} (${MODULE_NAME})`);

// ── All paragraph data (multi-module registry) ────────────────────────
const ALL_PARAGRAAF_DATA = [
  { id: "3.1.1", name: "Markt en marktstructuur", chapter: "3.1", chapterName: "Markten", chapterFull: "Hoofdstuk 1 \u2013 Markten", domain: "teal" },
  { id: "3.1.2", name: "Marktvormen", chapter: "3.1", chapterName: "Markten", chapterFull: "Hoofdstuk 1 \u2013 Markten", domain: "teal" },
  { id: "3.1.3", name: "Toepassen", chapter: "3.1", chapterName: "Markten", chapterFull: "Hoofdstuk 1 \u2013 Markten", domain: "teal" },
  { id: "3.2.1", name: "Marktevenwicht", chapter: "3.2", chapterName: "Marktvormen en hun marktevenwicht", chapterFull: "Hoofdstuk 2 \u2013 Marktvormen en hun marktevenwicht", domain: "blue" },
  { id: "3.2.2", name: "Volkomen concurrentie", chapter: "3.2", chapterName: "Marktvormen en hun marktevenwicht", chapterFull: "Hoofdstuk 2 \u2013 Marktvormen en hun marktevenwicht", domain: "blue" },
  { id: "3.2.3", name: "Monopolie", chapter: "3.2", chapterName: "Marktvormen en hun marktevenwicht", chapterFull: "Hoofdstuk 2 \u2013 Marktvormen en hun marktevenwicht", domain: "blue" },
  { id: "3.2.4", name: "Oligopolie", chapter: "3.2", chapterName: "Marktvormen en hun marktevenwicht", chapterFull: "Hoofdstuk 2 \u2013 Marktvormen en hun marktevenwicht", domain: "blue" },
  { id: "3.2.5", name: "Monopolistische concurrentie", chapter: "3.2", chapterName: "Marktvormen en hun marktevenwicht", chapterFull: "Hoofdstuk 2 \u2013 Marktvormen en hun marktevenwicht", domain: "blue" },
  { id: "3.2.6", name: "Marktvormen en hun economische doelmatigheid", chapter: "3.2", chapterName: "Marktvormen en hun marktevenwicht", chapterFull: "Hoofdstuk 2 \u2013 Marktvormen en hun marktevenwicht", domain: "blue" },
  { id: "3.2.7", name: "Toepassen", chapter: "3.2", chapterName: "Marktvormen en hun marktevenwicht", chapterFull: "Hoofdstuk 2 \u2013 Marktvormen en hun marktevenwicht", domain: "blue" },
  { id: "3.3.1", name: "De rol van de overheid", chapter: "3.3", chapterName: "Overheid", chapterFull: "Hoofdstuk 3 \u2013 Overheid", domain: "amber" },
  { id: "3.3.2", name: "Overheidsbeleid", chapter: "3.3", chapterName: "Overheid", chapterFull: "Hoofdstuk 3 \u2013 Overheid", domain: "amber" },
  { id: "3.3.3", name: "Collectieve goederen", chapter: "3.3", chapterName: "Overheid", chapterFull: "Hoofdstuk 3 \u2013 Overheid", domain: "amber" },
  { id: "3.3.4", name: "Toepassen", chapter: "3.3", chapterName: "Overheid", chapterFull: "Hoofdstuk 3 \u2013 Overheid", domain: "amber" },
  { id: "3.4.1", name: "Internationale handel", chapter: "3.4", chapterName: "Internationale markten", chapterFull: "Hoofdstuk 4 \u2013 Internationale markten", domain: "green" },
  { id: "3.4.2", name: "Inter-industriele handel", chapter: "3.4", chapterName: "Internationale markten", chapterFull: "Hoofdstuk 4 \u2013 Internationale markten", domain: "green" },
  { id: "3.4.3", name: "Intra-industriele handel", chapter: "3.4", chapterName: "Internationale markten", chapterFull: "Hoofdstuk 4 \u2013 Internationale markten", domain: "green" },
  { id: "3.4.4", name: "Internationale productieketens", chapter: "3.4", chapterName: "Internationale markten", chapterFull: "Hoofdstuk 4 \u2013 Internationale markten", domain: "green" },
  { id: "3.4.5", name: "Internationaal handelsbeleid", chapter: "3.4", chapterName: "Internationale markten", chapterFull: "Hoofdstuk 4 \u2013 Internationale markten", domain: "green" },
  { id: "3.4.6", name: "Toepassen", chapter: "3.4", chapterName: "Internationale markten", chapterFull: "Hoofdstuk 4 \u2013 Internationale markten", domain: "green" },
  { id: "3.5.1", name: "Afsluiting", chapter: "3.5", chapterName: "Afsluiting", chapterFull: "Hoofdstuk 5 \u2013 Afsluiting", domain: "purple" },
  { id: "3.5.2", name: "Naar het examen", chapter: "3.5", chapterName: "Afsluiting", chapterFull: "Hoofdstuk 5 \u2013 Afsluiting", domain: "purple" },
  // Module 1: Schaarste, geld en handel
  { id: "1.1.1", name: "Kiezen is kostbaar", chapter: "1.1", chapterName: "Voor niks gaat de zon op", chapterFull: "Hoofdstuk 1 \u2013 Voor niks gaat de zon op", domain: "teal" },
  { id: "1.1.2", name: "Kiezen of delen", chapter: "1.1", chapterName: "Voor niks gaat de zon op", chapterFull: "Hoofdstuk 1 \u2013 Voor niks gaat de zon op", domain: "teal" },
  { id: "1.1.3", name: "Toepassen", chapter: "1.1", chapterName: "Voor niks gaat de zon op", chapterFull: "Hoofdstuk 1 \u2013 Voor niks gaat de zon op", domain: "teal" },
];

// ── Filter to active module only ──────────────────────────────────────
const PARAGRAAF_DATA = ALL_PARAGRAAF_DATA.filter(p => p.id.startsWith(MODULE_NR + "."));

const DOMAIN_COLORS = {
  teal:  { main: "#17A2B8", light: "#E8F8FB", dark: "#117A8B" },
  blue:  { main: "#1A5276", light: "#EBF5FB", dark: "#154360" },
  amber: { main: "#E67E22", light: "#FEF5E7", dark: "#BA6A1C" },
  green: { main: "#1E8449", light: "#E8F8F0", dark: "#186A3B" },
  purple: { main: "#7D3C98", light: "#F4ECF7", dark: "#6C3483" },
};

const ALL_CHAPTER_FOLDERS = {
  "3.1": "3.1 Hoofdstuk 1 - Markten",
  "3.2": "3.2 Hoofdstuk 2 - Marktvormen en hun marktevenwicht",
  "3.3": "3.3 Hoofdstuk 3 - Overheid",
  "3.4": "3.4 Hoofdstuk 4 - Internationale markten",
  "3.5": "3.5 Hoofdstuk 5 - Afsluiting",
  "1.1": "1.1 Hoofdstuk 1 - Voor niks gaat de zon op",
};

const ALL_CHAPTER_NUMBERS = { "3.1": "1", "3.2": "2", "3.3": "3", "3.4": "4", "3.5": "5", "1.1": "1" };

// Filter to active module
const CHAPTER_FOLDERS = {};
const CHAPTER_NUMBERS = {};
const CHAPTER_ORDER = [];
for (const [key, val] of Object.entries(ALL_CHAPTER_FOLDERS)) {
  if (key.startsWith(MODULE_NR + ".")) {
    CHAPTER_FOLDERS[key] = val;
    CHAPTER_NUMBERS[key] = ALL_CHAPTER_NUMBERS[key];
    CHAPTER_ORDER.push(key);
  }
}
CHAPTER_ORDER.sort();

// ═══════════════════════════════════════════════════════════════════════════
// SECTION RULES
// ═══════════════════════════════════════════════════════════════════════════

const VOORBEREIDEN_PATTERNS = [/instapquiz\.html$/i, /nieuws-detective\.html$/i, /uitleg voorkennis\.docx$/i, /^Lees dit.*\.docx$/i];
const LEREN_PATTERNS = [/presentatie\.pptx$/i, /uitleg vaardigheden\.docx$/i, /youtube.videos\.html$/i, /nieuws met visual\.docx$/i, /samenvatting\.docx$/i];
const OEFENEN_DIRS = ["basisopgaven", "middenopgaven", "verrijkingsopgaven", "begeleide inoefening"];
const DELETE_PATTERNS = [/^desktop\.ini$/i, /\.zip$/i, /\.tmp$/i];

// Filter out Office temp/lock files (~$...) and other junk from directory listings
function cleanDir(files) {
  return files.filter(f => !f.startsWith("~$") && !f.startsWith("."));
}

// ═══════════════════════════════════════════════════════════════════════════
// FOLDER DISCOVERY
// ═══════════════════════════════════════════════════════════════════════════

function findParagraafFolder(chapterId, paragraafId) {
  const chapterFolder = CHAPTER_FOLDERS[chapterId];
  if (!chapterFolder) return null;
  const chapterPath = path.join(MODULE_BASE, chapterFolder);
  if (!fs.existsSync(chapterPath)) return null;
  const entries = fs.readdirSync(chapterPath, { withFileTypes: true });
  const match = entries.find(e => e.isDirectory() && e.name.startsWith(paragraafId + " "));
  return match ? { fullPath: path.join(chapterPath, match.name), folderName: match.name } : null;
}

// ═══════════════════════════════════════════════════════════════════════════
// RESTRUCTURE (unchanged)
// ═══════════════════════════════════════════════════════════════════════════

function restructureFolder(paragraafPath, paragraaf) {
  const voorbereidenDir = path.join(paragraafPath, "1. Voorbereiden");
  const lerenDir = path.join(paragraafPath, "2. Leren");
  const oefenenDir = path.join(paragraafPath, "3. Oefenen");

  if (fs.existsSync(voorbereidenDir) && fs.existsSync(lerenDir) && fs.existsSync(oefenenDir)) {
    console.log(`  [skip] Already restructured: ${paragraaf.id}`);
    return;
  }

  for (const dir of [voorbereidenDir, lerenDir, oefenenDir]) {
    if (!fs.existsSync(dir)) { if (!DRY_RUN) fs.mkdirSync(dir); console.log(`  [mkdir] ${path.basename(dir)}`); }
  }

  const entries = fs.readdirSync(paragraafPath, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const name = entry.name;
    const src = path.join(paragraafPath, name);
    if (DELETE_PATTERNS.some(p => p.test(name))) { console.log(`  [delete] ${name}`); if (!DRY_RUN) fs.unlinkSync(src); continue; }
    if (VOORBEREIDEN_PATTERNS.some(p => p.test(name))) { console.log(`  [move] ${name} -> 1. Voorbereiden/`); if (!DRY_RUN) fs.renameSync(src, path.join(voorbereidenDir, name)); continue; }
    if (LEREN_PATTERNS.some(p => p.test(name))) { console.log(`  [move] ${name} -> 2. Leren/`); if (!DRY_RUN) fs.renameSync(src, path.join(lerenDir, name)); continue; }
    if (name === "index.html") continue;
    console.log(`  [warn] Unmatched file at root: ${name}`);
  }

  for (const dirName of OEFENEN_DIRS) {
    const src = path.join(paragraafPath, dirName);
    if (fs.existsSync(src)) { console.log(`  [move] ${dirName}/ -> 3. Oefenen/`); if (!DRY_RUN) fs.renameSync(src, path.join(oefenenDir, dirName)); }
  }

  if (!DRY_RUN && fs.existsSync(oefenenDir)) {
    for (const sub of fs.readdirSync(oefenenDir, { withFileTypes: true })) {
      if (!sub.isDirectory()) continue;
      const iniPath = path.join(oefenenDir, sub.name, "desktop.ini");
      if (fs.existsSync(iniPath)) { fs.unlinkSync(iniPath); console.log(`  [delete] 3. Oefenen/${sub.name}/desktop.ini`); }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FILE SCANNER (unchanged)
// ═══════════════════════════════════════════════════════════════════════════

function scanFiles(paragraafPath) {
  const result = {
    voorbereiden: { instapquiz: null, voorkennis: null, leesdit: null, nieuwsdetective: null },
    leren: { presentatie: null, vaardigheden: null, stappenplan: null, youtube: null, nieuws: null, samenvatting: null },
    oefenen: { redeneerSpel: null, wiskundevaardigheden: null, begeleide: null, basis: null, midden: null, verrijking: null },
  };
  const vDir = path.join(paragraafPath, "1. Voorbereiden");
  const lDir = path.join(paragraafPath, "2. Leren");
  const oDir = path.join(paragraafPath, "3. Oefenen");

  if (fs.existsSync(vDir)) {
    const vFiles = cleanDir(fs.readdirSync(vDir));
    for (const f of vFiles) {
      if (/instapquiz\.html$/i.test(f)) result.voorbereiden.instapquiz = f;
      else if (/nieuws-detective\.html$/i.test(f)) result.voorbereiden.nieuwsdetective = f;
      else if (/uitleg voorkennis\.html$/i.test(f)) result.voorbereiden.voorkennis = f;
      else if (/^Lees dit/i.test(f)) result.voorbereiden.leesdit = f;
    }
    // Fallback to .docx if no .html version found
    if (!result.voorbereiden.voorkennis) {
      const docx = vFiles.find(f => /uitleg voorkennis\.docx$/i.test(f));
      if (docx) result.voorbereiden.voorkennis = docx;
    }
  }
  if (fs.existsSync(lDir)) {
    const lFiles = cleanDir(fs.readdirSync(lDir));
    for (const f of lFiles) {
      if (/presentatie\.pptx$/i.test(f)) result.leren.presentatie = f;
      else if (/uitleg vaardigheden\.html$/i.test(f)) result.leren.vaardigheden = f;
      else if (/youtube.videos\.html$/i.test(f)) result.leren.youtube = f;
      else if (/nieuws met visual\.docx$/i.test(f)) result.leren.nieuws = f;
      else if (/samenvatting\.docx$/i.test(f)) result.leren.samenvatting = f;
      else if (/stappenplan\.html$/i.test(f)) result.leren.stappenplan = f;
    }
    // Fallback to .docx if no .html version found
    if (!result.leren.vaardigheden) {
      const docx = lFiles.find(f => /uitleg vaardigheden\.docx$/i.test(f));
      if (docx) result.leren.vaardigheden = docx;
    }
  }
  if (fs.existsSync(oDir)) {
    // Scan for interactive exercise HTML files directly in the oefenen dir
    for (const f of cleanDir(fs.readdirSync(oDir))) {
      if (/redeneer-spel\.html$/i.test(f)) result.oefenen.redeneerSpel = f;
      else if (/wiskundevaardigheden\.html$/i.test(f)) result.oefenen.wiskundevaardigheden = f;
    }

    const scanExerciseDir = (subDir) => {
      const full = path.join(oDir, subDir);
      if (!fs.existsSync(full)) return null;
      const files = cleanDir(fs.readdirSync(full));
      const docxFiles = files.filter(f => f.endsWith(".docx"));
      const questions = docxFiles.find(f => /vragen\.docx$/i.test(f) && !/antwoorden/i.test(f));
      const answers = docxFiles.find(f => /antwoorden\.docx$/i.test(f));
      const interactief = files.find(f => /\.html$/i.test(f));
      if (!questions && !answers && !interactief) return null;
      return { dir: subDir, questions, answers, interactief };
    };
    result.oefenen.begeleide = scanExerciseDir("begeleide inoefening");
    result.oefenen.basis = scanExerciseDir("basisopgaven");
    result.oefenen.midden = scanExerciseDir("middenopgaven");
    result.oefenen.verrijking = scanExerciseDir("verrijkingsopgaven");
  }
  return result;
}

function encPath(segments) { return segments.map(s => encodeURIComponent(s)).join("/"); }

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════

// resolvedMap: { paragraafId: { ...paragraafData, folderName } }
// pageType: "module" | "chapter" | "paragraaf"
// currentId: chapter id (e.g. "3.2") for chapter pages, paragraaf id (e.g. "3.2.3") for paragraaf pages, null for module
// depth: 0 = module, 1 = chapter, 2 = paragraaf

function renderNav(resolvedMap, pageType, currentId) {
  const grouped = {};
  for (const ch of CHAPTER_ORDER) {
    grouped[ch] = PARAGRAAF_DATA.filter(p => p.chapter === ch && !HIDDEN_PARAGRAFEN.has(p.id));
  }

  function navLink(targetType, targetChapter, targetParagraaf) {
    // Build path from current page to target
    const chFolder = encodeURIComponent(CHAPTER_FOLDERS[targetChapter]);
    const pFolder = targetParagraaf ? encodeURIComponent(resolvedMap[targetParagraaf].folderName) : null;

    if (pageType === "module") {
      if (targetType === "module") return "index.html";
      if (targetType === "chapter") return `${chFolder}/index.html`;
      return `${chFolder}/${pFolder}/index.html`;
    }
    if (pageType === "chapter") {
      const curChFolder = encodeURIComponent(CHAPTER_FOLDERS[currentId]);
      if (targetType === "module") return "../index.html";
      if (targetType === "chapter") {
        if (targetChapter === currentId) return "index.html";
        return `../${chFolder}/index.html`;
      }
      if (targetChapter === currentId) return `${pFolder}/index.html`;
      return `../${chFolder}/${pFolder}/index.html`;
    }
    // pageType === "paragraaf"
    const curChapter = currentId.substring(0, 3);
    if (targetType === "module") return "../../index.html";
    if (targetType === "chapter") {
      if (targetChapter === curChapter) return "../index.html";
      return `../../${chFolder}/index.html`;
    }
    if (targetChapter === curChapter) return `../${pFolder}/index.html`;
    return `../../${chFolder}/${pFolder}/index.html`;
  }

  let html = "";

  // Module link
  const isModuleActive = pageType === "module";
  html += `    <a class="nav-module${isModuleActive ? " active" : ""}" href="${navLink("module")}">Module ${MODULE_NR}: ${MODULE_NAME}</a>\n`;

  for (const ch of CHAPTER_ORDER) {
    const paragrafen = grouped[ch];
    if (!paragrafen.length) continue;
    const first = paragrafen[0];
    const dc = DOMAIN_COLORS[first.domain];
    const chNum = CHAPTER_NUMBERS[ch];
    const isCurrentChapter = (pageType === "chapter" && currentId === ch)
      || (pageType === "paragraaf" && currentId.startsWith(ch));
    const expanded = isCurrentChapter;

    html += `    <div class="nav-chapter${expanded ? " expanded" : ""}">\n`;
    html += `      <a class="nav-ch-title${pageType === "chapter" && currentId === ch ? " active" : ""}" href="${navLink("chapter", ch)}" style="--ch-color: ${dc.main}">\n`;
    html += `        <span class="nav-dot"></span>\n`;
    html += `        <span class="nav-ch-label">H${chNum} ${first.chapterName}</span>\n`;
    html += `        <svg class="nav-arrow" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>\n`;
    html += `      </a>\n`;
    html += `      <div class="nav-items">\n`;

    for (const p of paragrafen) {
      if (!resolvedMap[p.id]) continue;
      const isActive = pageType === "paragraaf" && currentId === p.id;
      html += `        <a class="nav-item${isActive ? " active" : ""}" href="${navLink("paragraaf", ch, p.id)}" style="--ch-color: ${dc.main}">${p.id} ${p.name}</a>\n`;
    }

    html += `      </div>\n`;
    html += `    </div>\n`;
  }

  return html;
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED CSS
// ═══════════════════════════════════════════════════════════════════════════

function sharedCSS(dc) {
  return `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Arial, sans-serif;
    background: #F7F8FA;
    color: #2D3748;
    line-height: 1.5;
    min-height: 100vh;
  }
  a { color: inherit; text-decoration: none; }

  :root {
    --navy: #1E2761;
    --domain: ${dc.main};
    --domain-lt: ${dc.light};
    --domain-dk: ${dc.dark};
    --dark: #2D3748;
    --gray: #718096;
    --light-gray: #F7F8FA;
    --border-gray: #CBD5E0;
    --cream: #F9F6F1;
    --white: #FFFFFF;
    --amber: #E67E22;
    --step-bg: #FFF8E1;
    --step-border: #F9A825;
    --sidebar-w: 260px;
  }

  /* ── Layout ── */
  .page-layout { display: flex; min-height: 100vh; }

  /* ── Sidebar ── */
  .sidebar {
    width: var(--sidebar-w); flex-shrink: 0;
    background: var(--white); border-right: 1px solid var(--border-gray);
    position: sticky; top: 0; height: 100vh; overflow-y: auto;
    padding: 1.2rem 0; z-index: 10;
  }
  .sidebar-toggle {
    display: none; position: fixed; top: 0.75rem; left: 0.75rem; z-index: 20;
    width: 36px; height: 36px; border-radius: 6px; border: 1px solid var(--border-gray);
    background: var(--white); cursor: pointer;
    align-items: center; justify-content: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .sidebar-toggle svg { width: 20px; height: 20px; stroke: var(--dark); stroke-width: 2; fill: none; }

  .nav-module {
    display: block; padding: 0.5rem 1rem 0.7rem; font-size: 0.8rem; font-weight: bold;
    color: var(--navy); border-bottom: 1px solid var(--border-gray); margin-bottom: 0.5rem;
  }
  .nav-module:hover { color: var(--domain); }
  .nav-module.active { color: var(--navy); background: var(--light-gray); }

  .nav-chapter { margin-bottom: 0.15rem; }
  .nav-ch-title {
    display: flex; align-items: center; gap: 0.45rem;
    padding: 0.4rem 1rem; font-size: 0.78rem; font-weight: bold; color: var(--dark);
    cursor: pointer; border-left: 3px solid transparent;
  }
  .nav-ch-title:hover { background: #F7FAFC; }
  .nav-ch-title.active { border-left-color: var(--ch-color); background: var(--light-gray); }
  .nav-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
    background: var(--ch-color);
  }
  .nav-ch-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .nav-arrow {
    width: 14px; height: 14px; flex-shrink: 0; stroke: var(--gray); fill: none;
    stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
    transition: transform 0.2s;
  }
  .nav-chapter.expanded .nav-arrow { transform: rotate(180deg); }

  .nav-items { display: none; padding: 0.1rem 0 0.3rem; }
  .nav-chapter.expanded .nav-items { display: block; }
  .nav-item {
    display: block; padding: 0.3rem 1rem 0.3rem 2.2rem;
    font-size: 0.72rem; color: var(--gray); border-left: 3px solid transparent;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .nav-item:hover { color: var(--dark); background: #F7FAFC; }
  .nav-item.active { color: var(--dark); font-weight: bold; border-left-color: var(--ch-color); background: var(--light-gray); }

  /* ── Content area ── */
  .content { flex: 1; min-width: 0; }

  /* ── Hero ── */
  .hero {
    background: var(--navy); color: var(--white);
    padding: 2.5rem 2rem 2rem; position: relative;
  }
  .hero::before {
    content: ""; position: absolute; top: 0; left: 0; right: 0;
    height: 5px; background: var(--domain);
  }
  .hero-inner { max-width: 860px; margin: 0 auto; }
  .back-link {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.82rem; color: rgba(255,255,255,0.7);
    margin-bottom: 0.6rem; transition: color 0.15s;
  }
  .back-link:hover { color: #fff; }
  .back-link svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; }
  .hero-badge {
    display: inline-block; background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2); padding: 0.25rem 0.85rem;
    border-radius: 4px; font-size: 0.85rem; color: rgba(255,255,255,0.85);
  }
  .hero h1 { font-size: 2.1rem; font-weight: bold; margin: 0.6rem 0 0.35rem; }
  .hero-sub { font-size: 0.95rem; color: var(--gray); }

  main { max-width: 860px; margin: 0 auto; padding: 1.5rem 2rem 3rem; }

  /* ── Sections ── */
  .section { margin-bottom: 2.2rem; }
  .section-header { display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.9rem; }
  .step-number {
    display: inline-flex; align-items: center; justify-content: center;
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--domain); color: var(--white);
    font-size: 0.85rem; font-weight: bold; flex-shrink: 0;
  }
  .section-header h2 { font-size: 1.2rem; color: var(--domain-dk); }
  .section-hint {
    font-size: 0.85rem; color: var(--gray);
    margin: -0.5rem 0 0.9rem 2.9rem; font-style: italic;
  }

  /* ── Cards ── */
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 0.85rem;
  }
  .card {
    background: var(--white); border-radius: 8px;
    border-left: 4px solid var(--domain);
    box-shadow: 0 1px 4px rgba(0,0,0,0.07);
    padding: 1rem 1.15rem;
    display: flex; gap: 0.85rem; align-items: flex-start;
    transition: transform 0.15s ease, box-shadow 0.15s ease; cursor: pointer;
  }
  .card:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(0,0,0,0.1); }
  .card-icon {
    flex-shrink: 0; width: 36px; height: 36px; border-radius: 8px;
    background: var(--domain-lt);
    display: flex; align-items: center; justify-content: center; color: var(--domain);
  }
  .card-icon svg {
    width: 20px; height: 20px; fill: none; stroke: currentColor;
    stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
  }
  .card-body h3 { font-size: 0.95rem; font-weight: bold; color: var(--dark); margin-bottom: 0.15rem; }
  .card-body p { font-size: 0.8rem; color: var(--gray); line-height: 1.4; }
  .card-body .file-type {
    display: inline-block; font-size: 0.65rem; text-transform: uppercase;
    letter-spacing: 0.04em; color: var(--gray);
    background: var(--light-gray); border: 1px solid var(--border-gray);
    padding: 0.1rem 0.4rem; border-radius: 3px; margin-top: 0.35rem;
  }
  .card-exercise { grid-column: 1 / -1; border-left-color: var(--step-border); }
  .card-exercise .card-icon { background: var(--step-bg); color: var(--amber); }
  .card-exercise-normal { border-left-color: var(--domain); }
  .card-exercise-normal .card-icon { background: var(--domain-lt); color: var(--domain); }
  .sub-links { display: flex; gap: 0.5rem; margin-top: 0.55rem; flex-wrap: wrap; }
  .sub-link {
    display: inline-block; font-size: 0.75rem;
    padding: 0.3rem 0.7rem; border: 1px solid var(--border-gray);
    border-radius: 5px; color: var(--domain); background: var(--white);
    transition: background 0.12s, border-color 0.12s; cursor: pointer;
  }
  .sub-link:hover { background: var(--domain-lt); border-color: var(--domain); }
  .card-guide { border-left-color: var(--border-gray); background: var(--cream); }
  .card-guide .card-icon { background: rgba(0,0,0,0.04); color: var(--gray); }

  /* ── Chapter card (module page) ── */
  .chapter-card {
    display: block; background: var(--white); border-radius: 10px;
    border-left: 5px solid var(--ch-color, var(--domain));
    box-shadow: 0 1px 6px rgba(0,0,0,0.07); padding: 1.5rem 1.8rem;
    margin-bottom: 1.2rem;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .chapter-card:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(0,0,0,0.1); }
  .chapter-card h3 { font-size: 1.15rem; font-weight: bold; color: var(--dark); margin-bottom: 0.75rem; }
  .chapter-card h3 .ch-num { color: var(--ch-color, var(--domain)); margin-right: 0.3rem; }
  .chapter-card-count { font-size: 0.8rem; color: var(--gray); margin-bottom: 0.75rem; }
  .chapter-card-items { display: flex; flex-wrap: wrap; gap: 0.45rem; }
  .chapter-card-item {
    font-size: 0.75rem; padding: 0.3rem 0.75rem; border-radius: 5px;
    background: var(--light-gray); color: var(--dark);
    border: 1px solid var(--border-gray);
  }

  /* ── Paragraaf card (chapter page) ── */
  .para-card {
    display: flex; align-items: center; gap: 1rem;
    background: var(--white); border-radius: 10px;
    border-left: 5px solid var(--ch-color, var(--domain));
    box-shadow: 0 1px 6px rgba(0,0,0,0.07); padding: 1.2rem 1.5rem;
    margin-bottom: 0.75rem;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .para-card:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(0,0,0,0.1); }
  .para-num {
    flex-shrink: 0; width: 44px; height: 44px; border-radius: 10px;
    background: var(--ch-color, var(--domain)); color: var(--white);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; font-weight: bold;
  }
  .para-info h3 { font-size: 1rem; font-weight: bold; color: var(--dark); margin-bottom: 0.15rem; }
  .para-info p { font-size: 0.8rem; color: var(--gray); }

  footer {
    text-align: center; padding: 1.5rem 2rem; font-size: 0.75rem;
    color: var(--gray); border-top: 1px solid var(--border-gray);
  }

  /* ── Document Viewer ── */
  .viewer-panel {
    display: none; flex-direction: column;
    width: 100%; height: 100vh; position: sticky; top: 0;
  }
  .viewer-panel.active { display: flex; }
  .content.hidden { display: none; }
  .viewer-bar {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.5rem 1rem; background: var(--navy); color: #fff;
    font-size: 0.85rem; min-height: 2.5rem; flex-shrink: 0;
  }
  .viewer-title { flex: 1; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .viewer-download {
    color: #fff; background: var(--domain); padding: 0.3rem 0.8rem;
    border-radius: 4px; font-size: 0.8rem; text-decoration: none;
  }
  .viewer-download:hover { opacity: 0.9; }
  .viewer-close {
    background: none; border: 1px solid rgba(255,255,255,0.3); color: #fff;
    padding: 0.3rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;
  }
  .viewer-close:hover { background: rgba(255,255,255,0.1); }
  .viewer-frame { flex: 1; border: none; width: 100%; background: #fff; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .sidebar {
      position: fixed; left: -280px; top: 0; width: 280px;
      transition: left 0.25s ease; box-shadow: none; z-index: 100;
    }
    .sidebar.open { left: 0; box-shadow: 4px 0 20px rgba(0,0,0,0.15); }
    .sidebar-toggle { display: flex; }
    .content { width: 100%; }
    .hero { padding-left: 3.5rem; }
  }`;
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

function pageShell(title, dc, navHTML, bodyContent) {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>${sharedCSS(dc)}</style>
</head>
<body>
<div class="page-layout">
  <nav class="sidebar" id="sidebar">
    <button class="sidebar-toggle" onclick="document.getElementById('sidebar').classList.toggle('open')">
      <svg viewBox="0 0 24 24">${ICONS.hamburger}</svg>
    </button>
    <div class="sidebar-content">
${navHTML}
    </div>
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
<script>
// Toggle chapter expand/collapse
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

// Office Online viewer for .docx and .pptx on desktop
var BASE_URL = "https://meijer1973.github.io/economie-vwo4-m3/";

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
// MODULE PAGE
// ═══════════════════════════════════════════════════════════════════════════

function renderModulePage(resolvedMap) {
  const dc = { main: "#1E2761", light: "#EBF5FB", dark: "#154360" }; // navy as domain
  const navHTML = renderNav(resolvedMap, "module", null);

  let bodyHTML = `
<header class="hero">
  <div class="hero-inner">
    <span class="hero-badge">Module ${MODULE_NR}</span>
    <h1>${MODULE_NAME}</h1>
    <p class="hero-sub">Praktische Economie VWO 4</p>
  </div>
</header>
<main>`;

  for (const ch of CHAPTER_ORDER) {
    const paragrafen = PARAGRAAF_DATA.filter(p => p.chapter === ch && !HIDDEN_PARAGRAFEN.has(p.id));
    if (!paragrafen.length) continue;
    const first = paragrafen[0];
    const dc2 = DOMAIN_COLORS[first.domain];
    const chNum = CHAPTER_NUMBERS[ch];
    const chFolder = encodeURIComponent(CHAPTER_FOLDERS[ch]);

    bodyHTML += `
  <a class="chapter-card" href="${chFolder}/index.html" style="--ch-color: ${dc2.main}">
    <h3><span class="ch-num">H${chNum}</span>${first.chapterName}</h3>
    <div class="chapter-card-count">${paragrafen.length} paragrafen</div>
    <div class="chapter-card-items">
      ${paragrafen.map(p => `<span class="chapter-card-item">${p.id} ${p.name}</span>`).join("\n      ")}
    </div>
  </a>`;
  }

  bodyHTML += `
</main>
<footer>Economie VWO 4 &middot; Module ${MODULE_NR}: ${MODULE_NAME}</footer>`;

  return pageShell(`Module ${MODULE_NR} \u2013 ${MODULE_NAME}`, dc, navHTML, bodyHTML);
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER PAGE
// ═══════════════════════════════════════════════════════════════════════════

function renderChapterPage(chapterId, resolvedMap) {
  const paragrafen = PARAGRAAF_DATA.filter(p => p.chapter === chapterId && !HIDDEN_PARAGRAFEN.has(p.id));
  const first = paragrafen[0];
  const dc = DOMAIN_COLORS[first.domain];
  const chNum = CHAPTER_NUMBERS[chapterId];
  const navHTML = renderNav(resolvedMap, "chapter", chapterId);

  let bodyHTML = `
<header class="hero">
  <div class="hero-inner">
    <a class="back-link" href="../index.html"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg> Module ${MODULE_NR}</a>
    <span class="hero-badge">Hoofdstuk ${chNum}</span>
    <h1>${first.chapterName}</h1>
    <p class="hero-sub">Module ${MODULE_NR} \u2013 ${MODULE_NAME}</p>
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
<footer>Economie VWO 4 &middot; Module ${MODULE_NR}: ${MODULE_NAME}</footer>`;

  return pageShell(`${first.chapterFull} \u2013 Lesmateriaal`, dc, navHTML, bodyHTML);
}

// ═══════════════════════════════════════════════════════════════════════════
// PARAGRAAF PAGE
// ═══════════════════════════════════════════════════════════════════════════

function renderParagraafPage(paragraaf, files, resolvedMap) {
  const dc = DOMAIN_COLORS[paragraaf.domain];
  const navHTML = renderNav(resolvedMap, "paragraaf", paragraaf.id);

  function card(href, icon, title, desc, fileType, extraClass = "") {
    if (!href) return "";
    return `
      <a class="card ${extraClass}" href="${href}">
        <div class="card-icon"><svg viewBox="0 0 24 24">${icon}</svg></div>
        <div class="card-body"><h3>${title}</h3><p>${desc}</p><span class="file-type">${fileType}</span></div>
      </a>`;
  }

  function exerciseCard(exerciseData, sectionPrefix, icon, title, desc, extraClass = "") {
    if (!exerciseData) return "";
    const vragenHref = exerciseData.questions ? encPath([sectionPrefix, exerciseData.dir, exerciseData.questions]) : null;
    const antwHref = exerciseData.answers ? encPath([sectionPrefix, exerciseData.dir, exerciseData.answers]) : null;
    return `
      <div class="card ${extraClass}">
        <div class="card-icon"><svg viewBox="0 0 24 24">${icon}</svg></div>
        <div class="card-body"><h3>${title}</h3><p>${desc}</p>
          <div class="sub-links">
            ${vragenHref ? `<a class="sub-link" href="${vragenHref}">Vragen</a>` : ""}
            ${antwHref ? `<a class="sub-link" href="${antwHref}">Antwoorden</a>` : ""}
          </div>
        </div>
      </div>`;
  }

  const vP = "1. Voorbereiden", lP = "2. Leren", oP = "3. Oefenen";

  // Helper to detect file type from extension
  const ext = (f) => f ? f.split(".").pop().toLowerCase() : "docx";

  const voorbereidenCards = [
    files.voorbereiden.instapquiz ? card(encPath([vP, files.voorbereiden.instapquiz]), ICONS.quiz, "Instapquiz", "Test wat je al weet over deze stof", "html") : "",
    files.voorbereiden.voorkennis ? card(encPath([vP, files.voorbereiden.voorkennis]), ICONS.book, "Voorkennis", "Herhaal wat je nodig hebt voor deze les", ext(files.voorbereiden.voorkennis)) : "",
    files.voorbereiden.nieuwsdetective ? card(encPath([vP, files.voorbereiden.nieuwsdetective]), ICONS.search, "Nieuws-detective", "Ontdek de economie achter het nieuws", "html") : "",
    // files.voorbereiden.leesdit ? card(encPath([vP, files.voorbereiden.leesdit]), ICONS.info, "Hoe begin ik?", "Wegwijzer als je niet weet waar je moet starten", "docx", "card-guide") : "",
  ].filter(Boolean).join("\n");

  const lerenCards = [
    files.leren.presentatie ? card(encPath([lP, files.leren.presentatie]), ICONS.monitor, "Presentatie", "De les-presentatie met kernpunten", "pptx") : "",
    files.leren.vaardigheden ? card(encPath([lP, files.leren.vaardigheden]), ICONS.doc, "Uitleg vaardigheden", "Stap-voor-stap uitleg van de lesstof", ext(files.leren.vaardigheden)) : "",
    files.leren.stappenplan ? card(encPath([lP, files.leren.stappenplan]), ICONS.steps, "Stappenplan", "Oefen de stappen van elke vaardigheid", "html") : "",
    files.leren.youtube ? card(encPath([lP, files.leren.youtube]), ICONS.play, "YouTube-video\u2019s", "Video-uitleg bij de stof", "html") : "",
    files.leren.nieuws ? card(encPath([lP, files.leren.nieuws]), ICONS.newspaper, "Nieuws", "Actueel artikel met verwerkingsvragen", "docx") : "",
    files.leren.samenvatting ? card(encPath([lP, files.leren.samenvatting]), ICONS.check, "Samenvatting", "Overzicht van deze paragraaf", "docx") : "",
  ].filter(Boolean).join("\n");

  // Interactive exercise cards (full-width flex row)
  function interactiveCard(href, icon, title, desc) {
    return `
        <div class="card card-exercise" style="flex: 1; border-left-color: var(--ch-color, ${dc.main});">
          <div class="card-icon"><svg viewBox="0 0 24 24">${icon}</svg></div>
          <div class="card-body"><h3>${title}</h3><p>${desc}</p>
            <div class="sub-links"><a class="sub-link" href="${href}">Spelen</a></div>
          </div>
        </div>`;
  }

  function begeleidCard(data) {
    if (!data) return "";
    const links = [];
    if (data.interactief) links.push(`<a class="sub-link" href="${encPath([oP, data.dir, data.interactief])}">Interactief</a>`);
    if (data.questions) links.push(`<a class="sub-link" href="${encPath([oP, data.dir, data.questions])}">Vragen (docx)</a>`);
    if (data.answers) links.push(`<a class="sub-link" href="${encPath([oP, data.dir, data.answers])}">Antwoorden (docx)</a>`);
    if (!links.length) return "";
    return `
        <div class="card card-exercise" style="flex: 1;">
          <div class="card-icon"><svg viewBox="0 0 24 24">${ICONS.users}</svg></div>
          <div class="card-body"><h3>Begeleide inoefening</h3><p>Oefenen met denkstappen en hints</p>
            <div class="sub-links">${links.join("")}</div>
          </div>
        </div>`;
  }

  const interactiveRow = [];
  if (files.oefenen.redeneerSpel) interactiveRow.push(interactiveCard(encPath([oP, files.oefenen.redeneerSpel]), ICONS.puzzle, "Redeneer-spel", "Train je redeneervaardigheid met 5 spelmodi"));
  if (files.oefenen.wiskundevaardigheden) interactiveRow.push(interactiveCard(encPath([oP, files.oefenen.wiskundevaardigheden]), ICONS.layers, "Wiskundevaardigheden", "Oefen de wiskundevaardigheden voor deze paragraaf"));
  const begeleidHTML = begeleidCard(files.oefenen.begeleide);
  if (begeleidHTML) interactiveRow.push(begeleidHTML);

  const interactiveRowHTML = interactiveRow.length > 0
    ? `\n      <div style="grid-column: 1 / -1; display: flex; gap: 0.85rem;">${interactiveRow.join("")}\n      </div>`
    : "";

  const oefenenCards = interactiveRowHTML;

  // Task rows (basis/midden/verrijking) — shown as separate section 4 "Opgaven"
  // Can be hidden entirely via HIDE_TASK_ROWS flag
  const taskCards = [
    exerciseCard(files.oefenen.basis, oP, ICONS.star0, "Basisopgaven", "Standaard opgaven", "card-exercise-normal"),
    exerciseCard(files.oefenen.midden, oP, ICONS.star1, "Middenopgaven", "Kortere set, meer zelfstandig", "card-exercise-normal"),
    exerciseCard(files.oefenen.verrijking, oP, ICONS.star2, "Verrijkingsopgaven", "Extra uitdaging", "card-exercise-normal"),
  ].filter(Boolean).join("\n");
  const hasT = !HIDE_TASK_ROWS && taskCards.trim().length > 0;

  const hasV = voorbereidenCards.trim().length > 0;
  const hasL = lerenCards.trim().length > 0;
  const hasO = oefenenCards.trim().length > 0;

  let bodyHTML = `
<header class="hero">
  <div class="hero-inner">
    <a class="back-link" href="../index.html"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg> ${paragraaf.chapterFull}</a>
    <span class="hero-badge">Paragraaf ${paragraaf.id}</span>
    <h1>${paragraaf.name}</h1>
    <p class="hero-sub">${paragraaf.chapterFull}</p>
  </div>
</header>
<main>`;

  if (hasV) bodyHTML += `
  <div class="section">
    <div class="section-header"><span class="step-number">1</span><h2>Voorbereiden</h2></div>
    <p class="section-hint">Check wat je al weet en wat je nog nodig hebt</p>
    <div class="card-grid">${voorbereidenCards}</div>
  </div>`;

  // Section order: Oefenen (2) before Leren (3) — students prefer to practice first
  if (hasO) bodyHTML += `
  <div class="section">
    <div class="section-header"><span class="step-number">2</span><h2>Oefenen</h2></div>
    <p class="section-hint">Kies het niveau dat bij je past</p>
    <div class="card-grid">${oefenenCards}</div>
  </div>`;

  if (hasL) bodyHTML += `
  <div class="section">
    <div class="section-header"><span class="step-number">3</span><h2>Leren</h2></div>
    <p class="section-hint">De les doorwerken: presentatie, uitleg en video\u2019s</p>
    <div class="card-grid">${lerenCards}</div>
  </div>`;

  if (hasT) bodyHTML += `
  <div class="section">
    <div class="section-header"><span class="step-number">4</span><h2>Opgaven</h2></div>
    <p class="section-hint">Oefen op je eigen niveau</p>
    <div class="card-grid">${taskCards}</div>
  </div>`;

  bodyHTML += `
</main>
<footer>Economie VWO 4 &middot; Module ${MODULE_NR}: ${MODULE_NAME}</footer>`;

  return pageShell(`${paragraaf.id} ${paragraaf.name} \u2013 Lesmateriaal`, dc, navHTML, bodyHTML);
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

function main() {
  console.log("Building landing pages...\n");

  // Step 1: Resolve all paragraaf folder names
  const resolvedMap = {};
  for (const p of PARAGRAAF_DATA) {
    const found = findParagraafFolder(p.chapter, p.id);
    if (found) {
      resolvedMap[p.id] = { ...p, folderName: found.folderName, fullPath: found.fullPath };
    } else {
      console.error(`[ERROR] Folder not found for ${p.id} ${p.name}`);
    }
  }

  let success = 0, errors = 0;

  // Step 2: Process paragraaf pages
  const targets = ONLY_ID ? PARAGRAAF_DATA.filter(p => p.id === ONLY_ID) : PARAGRAAF_DATA;

  for (const p of targets) {
    if (HIDDEN_PARAGRAFEN.has(p.id)) { console.log(`=== ${p.id} ${p.name} === [HIDDEN, skipped]`); continue; }
    const resolved = resolvedMap[p.id];
    if (!resolved) { errors++; continue; }

    console.log(`=== ${p.id} ${p.name} ===`);

    try { restructureFolder(resolved.fullPath, p); } catch (err) { console.error(`  [ERROR] ${err.message}`); errors++; continue; }

    const files = scanFiles(resolved.fullPath);
    const html = renderParagraafPage(p, files, resolvedMap);
    if (!DRY_RUN) fs.writeFileSync(path.join(resolved.fullPath, "index.html"), html, "utf8");
    console.log(`  [write] index.html (${(html.length / 1024).toFixed(1)} KB)`);
    success++;
  }

  // Step 3: Generate chapter pages
  if (!ONLY_ID) {
    for (const ch of CHAPTER_ORDER) {
      const chFolder = CHAPTER_FOLDERS[ch];
      const chPath = path.join(MODULE_BASE, chFolder);
      if (!fs.existsSync(chPath)) continue;

      const html = renderChapterPage(ch, resolvedMap);
      if (!DRY_RUN) fs.writeFileSync(path.join(chPath, "index.html"), html, "utf8");
      console.log(`\n[chapter] ${chFolder}/index.html (${(html.length / 1024).toFixed(1)} KB)`);
    }

    // Step 4: Generate module page
    const html = renderModulePage(resolvedMap);
    if (!DRY_RUN) fs.writeFileSync(path.join(MODULE_BASE, "index.html"), html, "utf8");
    console.log(`\n[module] index.html (${(html.length / 1024).toFixed(1)} KB)`);
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Done. ${success} paragraaf pages, ${ONLY_ID ? 0 : 4} chapter pages, ${ONLY_ID ? 0 : 1} module page.`);
  if (errors) console.log(`${errors} errors.`);
  if (DRY_RUN) console.log("(DRY RUN)");
}

main();
