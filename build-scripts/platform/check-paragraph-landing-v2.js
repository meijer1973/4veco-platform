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
  if (rowCount !== 6) fail(`${context} must render 6 learning rows; found ${rowCount}`);

  const tileCount = countMatches(html, /data-tile-id="/g);
  if (tileCount !== 16) fail(`${context} must render 16 tile IDs; found ${tileCount}`);

  for (const tileId of REQUIRED_TILE_IDS) {
    if (!html.includes(`data-tile-id="${tileId}"`)) fail(`${context} missing tile ID ${tileId}`);
  }

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
