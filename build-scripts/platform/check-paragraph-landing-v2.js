#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const PLATFORM_ROOT = path.resolve(__dirname, "..", "..");
const BUILDER = path.join(PLATFORM_ROOT, "build-scripts", "platform", "build-landing-page.js");
const LESSON_ROOT = path.resolve(process.env.LESSEN_ROOT || path.join(PLATFORM_ROOT, "..", "4veco-lessen"));
const DASH = "\u2013";

const REQUIRED_GENERATOR_MARKERS = [
  "PARAGRAPH_V2_FIXTURE_DIR",
  "approved-light.html",
  "approved-dark.html",
  "paragraphPrototypeCSS",
  "function renderParagraafPage",
  "app-shell",
  "route-strip",
  "learning-row",
  "row-label",
  "tile-grid",
  "tile",
];

const FORBIDDEN_GENERATOR_MARKERS = [
  "function renderParagraafPageLegacy",
  "resourceCardWithSource",
  "route-secondary-group",
  "data-layout=\"paragraaf-v2\"",
  "../../shared/voorkennis.css",
  "controlled route with Start / Leer / Oefen / Check / Verdiep",
  "paragraaf-level index.html is generated against that stylesheet",
];

const REQUIRED_HTML_MARKERS = [
  "app-shell",
  "route-strip",
  "learning-row",
  "row-label",
  "tile-grid",
  "tile",
  "html[data-theme=\"dark\"]",
];

const REQUIRED_ROW_IDS = [
  "start",
  "leer",
  "check",
  "oefen",
  "exit-ticket",
  "open",
  "skills",
];

const REQUIRED_LESSON_ROUTE_IDS = [
  "start",
  "leer",
  "check",
  "oefen",
  "exit-ticket",
];

const FORBIDDEN_HTML_MARKERS = [
  "page-layout",
  "sidebar-toggle",
  "sidebar-overlay",
  "resource-card",
  "route-secondary-group",
  "landing-v2-",
  "data-layout=\"paragraaf-v2\"",
  "../../shared/voorkennis.css",
  "href=\"#\"",
];

const REQUIRED_TILE_IDS = [
  "instapquiz",
  "nieuwsdetective",
  "redeneren",
  "rekenen",
  "grafieken",
  "uitleg-vaardigheden",
  "presentatie",
  "skill-engine",
  "begeleide-oefeningen",
  "zelfstandige-oefeningen",
  "adaptieve-oefenroute",
  "korte-check",
  "exit-ticket",
  "lesboek-openen",
  "opgaven-antwoorden",
  "aanvullend-materiaal",
];

const DEFAULT_SYNTHETIC_FILES = [
  "instapquiz.html",
  "nieuws-detective.html",
  "uitleg voorkennis.html",
  "uitleg voorkennis.docx",
  "uitleg vaardigheden.html",
  "uitleg vaardigheden.docx",
  "presentatie.html",
  "presentatie.pptx",
  "stappenplan.html",
  "redeneer-spel.html",
  "wiskundevaardigheden.html",
  "grafiekenspel.html",
  "begeleide inoefening.html",
  "korte-check.html",
  "exit-ticket.html",
  "paragraaf.html",
  "paragraaf.pdf",
  "opgaven.html",
  "opgaven.pdf",
  "antwoorden.html",
  "antwoorden.pdf",
  "samenvatting.html",
  "nieuws met visual.html",
  "youtube-videos.html",
];

const SPARSE_SYNTHETIC_FILES = [
  "instapquiz.html",
  "redeneer-spel.html",
  "uitleg vaardigheden.html",
];

const BOOK_1_PARAGRAPHS = [
  path.join(
    "Boek 1 - Grondslagen, vraag en aanbod",
    "1.1 Hoofdstuk Economisch denken en rekenen",
    "1.1.1 Schaarste en economisch denken",
    "index.html",
  ),
  path.join(
    "Boek 1 - Grondslagen, vraag en aanbod",
    "1.1 Hoofdstuk Economisch denken en rekenen",
    "1.1.2 Percentages en indexcijfers",
    "index.html",
  ),
  path.join(
    "Boek 1 - Grondslagen, vraag en aanbod",
    "1.1 Hoofdstuk Economisch denken en rekenen",
    "1.1.3 Grafieken en tabellen",
    "index.html",
  ),
  path.join(
    "Boek 1 - Grondslagen, vraag en aanbod",
    "1.1 Hoofdstuk Economisch denken en rekenen",
    "1.1.4 Gemengde opgaven",
    "index.html",
  ),
];

function fail(message) {
  console.error(`Paragraph Landing V2 guard failed: ${message}`);
  process.exit(1);
}

function rel(filePath) {
  return path.relative(PLATFORM_ROOT, filePath).replace(/\\/g, "/");
}

function readText(filePath) {
  if (!fs.existsSync(filePath)) fail(`missing file: ${rel(filePath)}`);
  return fs.readFileSync(filePath, "utf8");
}

function requireIncludes(text, markers, context) {
  for (const marker of markers) {
    if (!text.includes(marker)) fail(`${context} must include ${marker}`);
  }
}

function requireExcludes(text, markers, context) {
  for (const marker of markers) {
    if (text.includes(marker)) fail(`${context} must not include ${marker}`);
  }
}

function countMatches(text, pattern) {
  return (text.match(pattern) || []).length;
}

function routeRowIds(html) {
  return Array.from(html.matchAll(/<div class="learning-row" id="([^"]+)"/g)).map(match => match[1]);
}

function routeChipIds(html) {
  return Array.from(html.matchAll(/<a class="route-chip" href="#([^"]+)"/g)).map(match => match[1]);
}

function sidebarRouteIds(html) {
  return Array.from(html.matchAll(/<a class="side-link" href="#([^"]+)" data-route-layer=/g)).map(match => match[1]);
}

function rowHtml(html, id, nextId) {
  const start = html.indexOf(`<div class="learning-row" id="${id}"`);
  if (start === -1) fail(`missing row ${id}`);
  const end = nextId
    ? html.indexOf(`<div class="learning-row" id="${nextId}"`, start)
    : html.indexOf("</section>", start);
  if (end === -1) fail(`missing end for row ${id}`);
  return html.slice(start, end);
}

function tileHtml(html, tileId) {
  const markerIndex = html.indexOf(`data-tile-id="${tileId}"`);
  if (markerIndex === -1) return "";
  const start = html.lastIndexOf("<", markerIndex);
  const openEnd = html.indexOf(">", start);
  const tagName = (html.slice(start, openEnd + 1).match(/^<([a-z]+)/) || [])[1];
  if (!tagName) return "";
  const close = `</${tagName}>`;
  const end = html.indexOf(close, openEnd);
  return end === -1 ? html.slice(start) : html.slice(start, end + close.length);
}

function assertExplanationTileHasOwnTarget(html, context) {
  const tile = tileHtml(html, "uitleg-vaardigheden");
  if (!tile) fail(`${context} missing uitleg-vaardigheden tile`);
  if (!tile.includes('data-tile-state="available"')) return;

  const hasPrimaryHref =
    /class="tile-primary" href="[^"]*uitleg%20vaardigheden\.(?:html|docx)"/.test(tile) ||
    /<a class="tile[^"]*"[^>]*href="[^"]*uitleg%20vaardigheden\.(?:html|docx)"/.test(tile);
  if (!hasPrimaryHref) {
    fail(`${context} uitleg-vaardigheden tile must open the uitleg vaardigheden document, not only related links`);
  }
  if (!tile.includes("Open uitleg vaardigheden")) {
    fail(`${context} uitleg-vaardigheden tile primary label must name the uitleg vaardigheden document`);
  }
}

function assertDisabledPlaceholdersHaveNoHref(html, context, { requireAtLeastOne = false } = {}) {
  const disabledBlocks = html.match(/<article\s+class="[^"]*\btile-disabled\b[\s\S]*?<\/article>/g) || [];
  const inPreparationBlocks = html.match(/<article[^>]*data-tile-state="in-preparation"[\s\S]*?<\/article>/g) || [];
  const blocks = [...disabledBlocks, ...inPreparationBlocks];

  if (requireAtLeastOne && blocks.length === 0) {
    fail(`${context} must include at least one disabled placeholder`);
  }

  blocks.forEach((block, index) => {
    if (/\shref=/.test(block)) fail(`${context} disabled placeholder ${index + 1} must not contain href`);
  });
}

function verifyParagraphHtml(html, context, { requireDisabledPlaceholder = false } = {}) {
  requireIncludes(html, REQUIRED_HTML_MARKERS, context);
  requireExcludes(html, FORBIDDEN_HTML_MARKERS, context);

  const rowCount = countMatches(html, /class="[^"]*\blearning-row\b/g);
  if (rowCount !== 7) fail(`${context} must render 7 learning rows; found ${rowCount}`);

  const rowIds = routeRowIds(html);
  if (rowIds.join(" > ") !== REQUIRED_ROW_IDS.join(" > ")) {
    fail(`${context} row order must be ${REQUIRED_ROW_IDS.join(" > ")}; found ${rowIds.join(" > ")}`);
  }

  const chipIds = routeChipIds(html);
  if (chipIds.join(" > ") !== REQUIRED_LESSON_ROUTE_IDS.join(" > ")) {
    fail(`${context} route chips must be ${REQUIRED_LESSON_ROUTE_IDS.join(" > ")}; found ${chipIds.join(" > ")}`);
  }

  const sidebarIds = sidebarRouteIds(html);
  if (sidebarIds.join(" > ") !== REQUIRED_LESSON_ROUTE_IDS.join(" > ")) {
    fail(`${context} sidebar route must be ${REQUIRED_LESSON_ROUTE_IDS.join(" > ")}; found ${sidebarIds.join(" > ")}`);
  }

  for (const [id, nextId] of [["check", "oefen"], ["exit-ticket", "open"]]) {
    if (!rowHtml(html, id, nextId).includes('class="tile-grid single"')) {
      fail(`${context} ${id} row must use full-width single-tile grid`);
    }
  }

  const tileCount = countMatches(html, /data-tile-id="/g);
  if (tileCount !== 16) fail(`${context} must render 16 tile IDs; found ${tileCount}`);

  for (const tileId of REQUIRED_TILE_IDS) {
    if (!html.includes(`data-tile-id="${tileId}"`)) fail(`${context} missing tile ID ${tileId}`);
  }

  assertExplanationTileHasOwnTarget(html, context);

  assertDisabledPlaceholdersHaveNoHref(html, context, {
    requireAtLeastOne: requireDisabledPlaceholder,
  });
}

function writeFile(filePath, body = "stub") {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, body);
}

function writeSyntheticModule(root, files = DEFAULT_SYNTHETIC_FILES) {
  fs.mkdirSync(path.join(root, "1.1 Hoofdstuk Test"), { recursive: true });
  fs.writeFileSync(path.join(root, "deploy-config.json"), JSON.stringify({
    nr: 9,
    name: "Fixture",
    chapters: [
      {
        id: "1.1",
        folder: "1.1 Hoofdstuk Test",
        name: "Test",
        number: "1",
        domain: "amber",
        landing: {
          summary: "Korte route door de teststof.",
          pitfalls: ["Verwar oefenen niet met nakijken."],
        },
      },
    ],
    paragraphs: [
      {
        id: "1.1.1",
        name: "Testparagraaf",
        chapter: "1.1",
        domain: "amber",
        skilltree: {
          skills: ["A38", "A39"],
        },
        landing: {
          summary: "Web-first lesmateriaal voor deze paragraaf.",
          pitfalls: ["Gebruik de oude waarde als basis."],
        },
      },
    ],
  }, null, 2));

  const paragraph = path.join(root, "1.1 Hoofdstuk Test", "1.1.1 Testparagraaf");
  fs.mkdirSync(paragraph, { recursive: true });
  const prefix = "1.1.1 Testparagraaf";
  for (const file of files) {
    writeFile(path.join(paragraph, `${prefix} ${DASH} ${file}`));
  }

  return path.join(paragraph, "index.html");
}

function runBuilder(moduleRoot) {
  const run = spawnSync(process.execPath, [BUILDER], {
    cwd: PLATFORM_ROOT,
    env: { ...process.env, MODULE_ROOT: moduleRoot },
    encoding: "utf8",
  });

  if (run.status !== 0) {
    fail(`synthetic builder failed:\n${run.stdout}\n${run.stderr}`);
  }
}

function checkGeneratorSource() {
  const source = readText(BUILDER);
  requireIncludes(source, REQUIRED_GENERATOR_MARKERS, "build-landing-page.js");
  requireExcludes(source, FORBIDDEN_GENERATOR_MARKERS, "build-landing-page.js");
}

function checkSyntheticOutput() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "landing-v2-guard-"));
  try {
    const output = writeSyntheticModule(tmpDir);
    runBuilder(tmpDir);
    verifyParagraphHtml(readText(output), "synthetic paragraph index.html");
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function checkSparseSyntheticOutput() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "landing-v2-sparse-guard-"));
  try {
    const output = writeSyntheticModule(tmpDir, SPARSE_SYNTHETIC_FILES);
    runBuilder(tmpDir);
    verifyParagraphHtml(readText(output), "sparse synthetic paragraph index.html", {
      requireDisabledPlaceholder: true,
    });
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function checkLessonOutput() {
  if (!fs.existsSync(LESSON_ROOT)) {
    fail(`lesson root not found: ${LESSON_ROOT}`);
  }

  for (const relativePath of BOOK_1_PARAGRAPHS) {
    const filePath = path.join(LESSON_ROOT, relativePath);
    verifyParagraphHtml(readText(filePath), relativePath.replace(/\\/g, "/"));
  }
}

function main() {
  checkGeneratorSource();
  checkSyntheticOutput();
  checkSparseSyntheticOutput();
  checkLessonOutput();
  console.log("OK paragraph landing V2 guardrails");
}

main();
