#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const PLATFORM_ROOT = path.resolve(__dirname, "..", "..");
const BUILDER = path.join(PLATFORM_ROOT, "build-scripts", "platform", "build-landing-page.js");
const LESSON_ROOT = path.resolve(process.env.LESSEN_ROOT || path.join(PLATFORM_ROOT, "..", "4veco-lessen"));
const DASH = "\u2013";

const REQUIRED_SOURCE_MARKERS = [
  "CHAPTER_V2_FIXTURE_DIR",
  "approved-minimal.html",
  "chapterMinimalCSS",
  "function renderChapterPage",
  "data-layout=\"chapter-landing-v2\"",
  "chapter-paragraph-card",
  "paragraph-route-tags",
];

const REQUIRED_HTML_MARKERS = [
  "app-shell",
  "sidebar",
  "content",
  "topbar",
  "hero",
  "hero-grid",
  "target-panel",
  "chapter-overview",
  "chapter-paragraph-card",
  "paragraph-route-tags",
  "footer-note",
  "html[data-theme=\"dark\"]",
];

const FORBIDDEN_HTML_MARKERS = [
  "page-layout",
  "sidebar-toggle",
  "sidebar-overlay",
  "viewer-panel",
  "../../shared/voorkennis.css",
  "href=\"#\"",
];

const FORBIDDEN_RESOURCE_HREFS = [
  "opgaven.html",
  "antwoorden.html",
  "paragraaf.html",
  "instapquiz.html",
  "korte-check.html",
  "exit-ticket.html",
  "redeneer-spel.html",
  "wiskundevaardigheden.html",
  "grafiekenspel.html",
  ".docx",
  ".pptx",
];

const BOOK_1_CHAPTER = path.join(
  "Boek 1 - Grondslagen, vraag en aanbod",
  "1.1 Hoofdstuk Economisch denken en rekenen",
  "index.html",
);

function fail(message) {
  console.error(`Chapter Landing V2 guard failed: ${message}`);
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

function paragraphCards(html) {
  return Array.from(html.matchAll(/<a class="[^"]*\bchapter-paragraph-card\b[^"]*"[^>]*data-paragraph-id="([^"]+)"[^>]*href="([^"]+)"/g))
    .map(match => ({ id: match[1], href: match[2] }));
}

function routeTagBlocks(html) {
  return Array.from(html.matchAll(/<div class="[^"]*\bparagraph-route-tags\b[^"]*"[^>]*>([\s\S]*?)<\/div>/g))
    .map(match => match[1]);
}

function verifyChapterHtml(html, context, expectedCards) {
  requireIncludes(html, REQUIRED_HTML_MARKERS, context);
  requireExcludes(html, FORBIDDEN_HTML_MARKERS, context);

  if (/<span class="[^"]*para-card-domain[^"]*">/.test(html)) {
    fail(`${context} must not render student-facing aspect/domain labels on paragraph cards`);
  }
  if (/<span class="[^"]*para-card-domain[^"]*">Rekenen<\/span>/.test(html)) {
    fail(`${context} must not render misleading fallback label Rekenen`);
  }

  const cards = paragraphCards(html);
  if (cards.length !== expectedCards.length) {
    fail(`${context} must render ${expectedCards.length} visible paragraph card(s); found ${cards.length}`);
  }
  for (let index = 0; index < expectedCards.length; index += 1) {
    const expected = expectedCards[index];
    const actual = cards[index];
    if (!actual || actual.id !== expected.id || actual.href !== expected.href) {
      fail(`${context} card ${index + 1} must be ${expected.id} -> ${expected.href}; found ${JSON.stringify(actual)}`);
    }
    if (!actual.href.endsWith("/index.html")) {
      fail(`${context} card ${actual.id} must link only to paragraph index.html`);
    }
  }

  for (const forbidden of FORBIDDEN_RESOURCE_HREFS) {
    if (html.includes(forbidden)) fail(`${context} must not link directly to ${forbidden}`);
  }

  const tagBlocks = routeTagBlocks(html);
  if (!tagBlocks.length) fail(`${context} must include informational route tags`);
  for (const block of tagBlocks) {
    if (/<a\b/.test(block)) fail(`${context} route tags must be informational spans, not links`);
    for (const label of ["Start", "Leer", "Check", "Oefen", "Exit ticket"]) {
      if (!block.includes(`>${label}<`)) fail(`${context} route tags must include ${label}`);
    }
  }

  if (!html.includes("Paragraaf ") || !html.includes("Lesroute")) {
    fail(`${context} paragraph cards must use neutral Paragraaf/Lesroute labels`);
  }
}

function writeFile(filePath, body = "stub") {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, body);
}

function writeSyntheticModule(root) {
  fs.mkdirSync(path.join(root, "1.1 Hoofdstuk Test"), { recursive: true });
  fs.writeFileSync(path.join(root, "deploy-config.json"), JSON.stringify({
    nr: 9,
    name: "Fixture",
    hiddenParagraphs: ["1.1.3"],
    chapters: [
      {
        id: "1.1",
        folder: "1.1 Hoofdstuk Test",
        name: "Test",
        number: "1",
        domain: "amber",
        landing: {
          summary: "Hoofdstuknavigatie voor de teststof.",
        },
      },
    ],
    paragraphs: [
      {
        id: "1.1.1",
        name: "Eerste zichtbare paragraaf",
        chapter: "1.1",
        domain: "amber",
        skilltree: { skills: ["A38"] },
      },
      {
        id: "1.1.2",
        name: "Tweede zichtbare paragraaf",
        chapter: "1.1",
        domain: "blue",
        skilltree: { skills: ["A39"] },
      },
      {
        id: "1.1.3",
        name: "Verborgen paragraaf",
        chapter: "1.1",
        domain: "green",
      },
    ],
  }, null, 2));

  for (const [id, name] of [
    ["1.1.1", "Eerste zichtbare paragraaf"],
    ["1.1.2", "Tweede zichtbare paragraaf"],
    ["1.1.3", "Verborgen paragraaf"],
  ]) {
    const paragraph = path.join(root, "1.1 Hoofdstuk Test", `${id} ${name}`);
    fs.mkdirSync(paragraph, { recursive: true });
    const prefix = `${id} ${name}`;
    for (const file of [
      "instapquiz.html",
      "uitleg vaardigheden.html",
      "begeleide inoefening.html",
      "korte-check.html",
      "exit-ticket.html",
      "paragraaf.html",
      "opgaven.html",
      "antwoorden.html",
      "redeneer-spel.html",
      "wiskundevaardigheden.html",
      "grafiekenspel.html",
      "presentatie.pptx",
    ]) {
      writeFile(path.join(paragraph, `${prefix} ${DASH} ${file}`));
    }
  }

  return path.join(root, "1.1 Hoofdstuk Test", "index.html");
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
  requireIncludes(readText(BUILDER), REQUIRED_SOURCE_MARKERS, "build-landing-page.js");
  readText(path.join(PLATFORM_ROOT, "references", "ui", "chapter-landing-v2", "approved-minimal.html"));
}

function checkSyntheticOutput() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "chapter-landing-v2-"));
  try {
    const output = writeSyntheticModule(tmpDir);
    runBuilder(tmpDir);
    verifyChapterHtml(readText(output), "synthetic chapter index.html", [
      { id: "1.1.1", href: "1.1.1%20Eerste%20zichtbare%20paragraaf/index.html" },
      { id: "1.1.2", href: "1.1.2%20Tweede%20zichtbare%20paragraaf/index.html" },
    ]);
    if (readText(output).includes("Verborgen paragraaf")) {
      fail("synthetic chapter index.html must not expose hidden paragraphs");
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function checkLessonOutput() {
  const filePath = path.join(LESSON_ROOT, BOOK_1_CHAPTER);
  verifyChapterHtml(readText(filePath), BOOK_1_CHAPTER.replace(/\\/g, "/"), [
    { id: "1.1.1", href: "1.1.1%20Schaarste%20en%20economisch%20denken/index.html" },
    { id: "1.1.2", href: "1.1.2%20Percentages%20en%20indexcijfers/index.html" },
    { id: "1.1.3", href: "1.1.3%20Grafieken%20en%20tabellen/index.html" },
    { id: "1.1.4", href: "1.1.4%20Gemengde%20opgaven/index.html" },
  ]);
}

function main() {
  checkGeneratorSource();
  checkSyntheticOutput();
  checkLessonOutput();
  console.log("OK chapter landing V2 guardrails");
}

main();
