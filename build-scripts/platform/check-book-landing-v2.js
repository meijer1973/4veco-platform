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
  "BOOK_V2_FIXTURE_DIR",
  "approved-minimal.html",
  "bookMinimalCSS",
  "function renderBookPage",
  "data-layout=\"book-landing-v2\"",
  "book-chapter-card",
  "chapter-list",
];

const FORBIDDEN_SOURCE_MARKERS = [
  "function renderBookPageLegacy",
  "<span class=\"chapter-card-domain\">${domainLabel(token)}</span>",
  "data-layout=\"landing-book-v1\"",
  "renderNav(resolvedMap, \"book\", null)",
];

const FORBIDDEN_FIXTURE_MARKERS = [
  "chapter-card-domain",
  ">Rekenen</span>",
  "landing-book-v1",
  "page-layout",
  "sidebar-toggle",
  "sidebar-overlay",
  "viewer-panel",
];

const REQUIRED_HTML_MARKERS = [
  "app-shell",
  "sidebar",
  "content",
  "topbar",
  "hero",
  "hero-grid",
  "target-panel",
  "book-overview",
  "chapter-list",
  "book-chapter-card",
  "footer-note",
  "html[data-theme=\"dark\"]",
];

const FORBIDDEN_HTML_MARKERS = [
  "page-layout",
  "sidebar-toggle",
  "sidebar-overlay",
  "viewer-panel",
  "../../shared/voorkennis.css",
  "shared/voorkennis.js",
  "href=\"#\"",
  "landing-book-v1",
  "chapter-card-domain",
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
  ".pdf",
];

const BOOK_1_INDEX = path.join("Boek 1 - Grondslagen, vraag en aanbod", "index.html");

function fail(message) {
  console.error(`Book Landing V2 guard failed: ${message}`);
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

function bookChapterCards(html) {
  return Array.from(html.matchAll(/<a class="[^"]*\bbook-chapter-card\b[^"]*"[^>]*data-chapter-id="([^"]+)"[^>]*href="([^"]+)"/g))
    .map(match => ({ id: match[1], href: match[2] }));
}

function bookChapterCardBlocks(html) {
  return Array.from(html.matchAll(/<a class="[^"]*\bbook-chapter-card\b[^"]*"[\s\S]*?<\/a>/g))
    .map(match => match[0]);
}

function hrefs(html) {
  return Array.from(html.matchAll(/\shref="([^"]+)"/g)).map(match => match[1]);
}

function verifyBookHtml(html, context, expectedCards) {
  requireIncludes(html, REQUIRED_HTML_MARKERS, context);
  requireExcludes(html, FORBIDDEN_HTML_MARKERS, context);

  if (/<span class="[^"]*chapter-card-domain[^"]*">/.test(html)) {
    fail(`${context} must not render visible chapter domain/aspect labels`);
  }
  if (/<span class="[^"]*chapter-card-domain[^"]*">Rekenen<\/span>/.test(html)) {
    fail(`${context} must not render misleading fallback label Rekenen`);
  }

  const cards = bookChapterCards(html);
  if (cards.length !== expectedCards.length) {
    fail(`${context} must render ${expectedCards.length} visible chapter card(s); found ${cards.length}`);
  }
  for (let index = 0; index < expectedCards.length; index += 1) {
    const expected = expectedCards[index];
    const actual = cards[index];
    if (!actual || actual.id !== expected.id || actual.href !== expected.href) {
      fail(`${context} card ${index + 1} must be ${expected.id} -> ${expected.href}; found ${JSON.stringify(actual)}`);
    }
    if (!actual.href.endsWith("/index.html")) {
      fail(`${context} card ${actual.id} must link only to chapter index.html`);
    }
    if (/\/\d+\.\d+\.\d+/.test(actual.href)) {
      fail(`${context} card ${actual.id} must not link directly to paragraph pages`);
    }
  }

  for (const href of hrefs(html)) {
    for (const forbidden of FORBIDDEN_RESOURCE_HREFS) {
      if (href.includes(forbidden)) fail(`${context} must not link directly to ${forbidden}`);
    }
    if (/\/\d+\.\d+\.\d+/.test(href)) fail(`${context} must not link directly to paragraph pages`);
  }

  for (const block of bookChapterCardBlocks(html)) {
    if (!block.includes("Hoofdstuk ") || !block.includes("Hoofdstukroute")) {
      fail(`${context} chapter cards must use neutral Hoofdstuk/Hoofdstukroute labels`);
    }
    const summaryMatch = block.match(/<div class="[^"]*\bchapter-summary-tags\b[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    if (!summaryMatch) fail(`${context} chapter cards must include informational paragraph spans`);
    if (/<a\b/.test(summaryMatch[1])) {
      fail(`${context} paragraph names inside chapter cards must be spans, not links`);
    }
    if (!/<span class="[^"]*\bchapter-summary-tag\b[^"]*">/.test(summaryMatch[1])) {
      fail(`${context} paragraph names inside chapter cards must use chapter-summary-tag spans`);
    }
  }
}

function writeFile(filePath, body = "stub") {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, body);
}

function writeSyntheticModule(root) {
  fs.mkdirSync(path.join(root, "1.1 Hoofdstuk Test"), { recursive: true });
  fs.mkdirSync(path.join(root, "1.2 Hoofdstuk Empty"), { recursive: true });
  fs.mkdirSync(path.join(root, "1.3 Hoofdstuk Hidden"), { recursive: true });
  fs.writeFileSync(path.join(root, "deploy-config.json"), JSON.stringify({
    nr: 9,
    name: "Fixture",
    hiddenParagraphs: ["1.3.1"],
    chapters: [
      {
        id: "1.1",
        folder: "1.1 Hoofdstuk Test",
        name: "Test",
        number: "1",
        domain: "amber",
        landing: {
          summary: "Boeknavigatie naar het testhoofdstuk.",
        },
      },
      {
        id: "1.2",
        folder: "1.2 Hoofdstuk Empty",
        name: "Leeg hoofdstuk",
        number: "2",
        domain: "blue",
      },
      {
        id: "1.3",
        folder: "1.3 Hoofdstuk Hidden",
        name: "Verborgen hoofdstuk",
        number: "3",
        domain: "green",
      },
    ],
    paragraphs: [
      {
        id: "1.1.1",
        name: "Eerste zichtbare paragraaf",
        chapter: "1.1",
        domain: "amber",
      },
      {
        id: "1.1.2",
        name: "Tweede zichtbare paragraaf",
        chapter: "1.1",
        domain: "blue",
      },
      {
        id: "1.3.1",
        name: "Verborgen paragraaf",
        chapter: "1.3",
        domain: "green",
      },
    ],
  }, null, 2));

  for (const [id, name] of [
    ["1.1.1", "Eerste zichtbare paragraaf"],
    ["1.1.2", "Tweede zichtbare paragraaf"],
    ["1.3.1", "Verborgen paragraaf"],
  ]) {
    const chapter = id.startsWith("1.3.") ? "1.3 Hoofdstuk Hidden" : "1.1 Hoofdstuk Test";
    const paragraph = path.join(root, chapter, `${id} ${name}`);
    fs.mkdirSync(paragraph, { recursive: true });
    const prefix = `${id} ${name}`;
    for (const file of [
      "instapquiz.html",
      "korte-check.html",
      "exit-ticket.html",
      "paragraaf.html",
      "opgaven.html",
      "antwoorden.html",
      "redeneer-spel.html",
      "wiskundevaardigheden.html",
      "presentatie.pptx",
      "paragraaf.pdf",
    ]) {
      writeFile(path.join(paragraph, `${prefix} ${DASH} ${file}`));
    }
  }

  return path.join(root, "index.html");
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
  const builderSource = readText(BUILDER);
  requireIncludes(builderSource, REQUIRED_SOURCE_MARKERS, "build-landing-page.js");
  requireExcludes(builderSource, FORBIDDEN_SOURCE_MARKERS, "build-landing-page.js");

  const fixtureHtml = readText(path.join(PLATFORM_ROOT, "references", "ui", "book-landing-v2", "approved-minimal.html"));
  requireIncludes(fixtureHtml, REQUIRED_HTML_MARKERS, "approved-minimal.html");
  requireExcludes(fixtureHtml, FORBIDDEN_FIXTURE_MARKERS, "approved-minimal.html");
}

function checkSyntheticOutput() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "book-landing-v2-"));
  try {
    const output = writeSyntheticModule(tmpDir);
    runBuilder(tmpDir);
    const html = readText(output);
    verifyBookHtml(html, "synthetic book index.html", [
      { id: "1.1", href: "1.1%20Hoofdstuk%20Test/index.html" },
    ]);
    if (html.includes("Leeg hoofdstuk") || html.includes("Verborgen hoofdstuk") || html.includes("Verborgen paragraaf")) {
      fail("synthetic book index.html must not expose empty or hidden chapters");
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function checkLessonOutput() {
  const filePath = path.join(LESSON_ROOT, BOOK_1_INDEX);
  verifyBookHtml(readText(filePath), BOOK_1_INDEX.replace(/\\/g, "/"), [
    { id: "1.1", href: "1.1%20Hoofdstuk%20Economisch%20denken%20en%20rekenen/index.html" },
  ]);
}

function main() {
  checkGeneratorSource();
  checkSyntheticOutput();
  checkLessonOutput();
  console.log("OK book landing V2 guardrails");
}

main();
