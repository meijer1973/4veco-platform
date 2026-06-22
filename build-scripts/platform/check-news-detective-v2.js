#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const PLATFORM_ROOT = path.resolve(__dirname, "..", "..");
const BUILDER = path.join(PLATFORM_ROOT, "build-scripts", "platform", "build-newsdetective-shells.js");
const LESSON_ROOT = path.resolve(process.env.LESSEN_ROOT || path.join(PLATFORM_ROOT, "..", "4veco-lessen"));
const DASH = "\u2013";

const REQUIRED_MARKERS = [
  "news-detective-v2",
  "app-shell",
  "sidebar",
  "content",
  "topbar",
  "hero",
  "hero-grid",
  "progress-rail",
  "screen-start",
  "screen-game",
  "game-layout",
  "article-dossier",
  "article-card",
  "round-card",
  "screen-result",
];

const FORBIDDEN_MARKERS = [
  "nd-header",
  "nd-container",
  "nd-start-card",
  "nd-article-compact",
  "renderArticleCompact",
  "-webkit-line-clamp",
  "line-clamp",
  "back-to-overview",
];

const REAL_DATA = path.join(LESSON_ROOT, "Boek 1 - Grondslagen, vraag en aanbod", "shared", "newsdetective", "1.1.1.js");
const REAL_OUTPUT = path.join(
  LESSON_ROOT,
  "Boek 1 - Grondslagen, vraag en aanbod",
  "1.1 Hoofdstuk Economisch denken en rekenen",
  "1.1.1 Schaarste en economisch denken",
  `1.1.1 Schaarste en economisch denken ${DASH} nieuws-detective.html`
);

function fail(message) {
  console.error(`News Detective V2 guard failed: ${message}`);
  process.exit(1);
}

function read(filePath) {
  if (!fs.existsSync(filePath)) fail(`missing file: ${filePath}`);
  return fs.readFileSync(filePath, "utf8");
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function loadData(filePath) {
  return new Function(`${read(filePath)}\nreturn NEWS_DETECTIVE_DATA;`)();
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

function countOccurrences(text, needle) {
  return text.split(needle).length - 1;
}

function verifyOutput(html, css, ui, data, context) {
  requireIncludes(html, REQUIRED_MARKERS, context);
  requireExcludes(html, FORBIDDEN_MARKERS, context);
  requireExcludes(css, FORBIDDEN_MARKERS, `${context} copied CSS`);
  requireExcludes(ui, FORBIDDEN_MARKERS, `${context} copied UI`);
  if (css.includes("calc(100vw - var(--sidebar))")) {
    fail(`${context} copied CSS must not size content with 100vw minus sidebar`);
  }

  if (html.includes('href="#"')) fail(`${context} must not contain fake href="#" links`);
  if (html.includes("theme.js")) fail(`${context} must use the V2 theme controller only`);

  const escapedBody = escapeHtml(data.article.body);
  if (!html.includes(escapedBody)) fail(`${context} must render the complete article body`);
  if (countOccurrences(html, escapedBody) < 2) {
    fail(`${context} must render the complete article in start and active game screens`);
  }
  const gameScreen = html.match(/<section id="screen-game"[\s\S]*?<\/section>/);
  if (!gameScreen || !gameScreen[0].includes(escapedBody)) {
    fail(`${context} screen-game must contain the complete article body`);
  }

  for (const key of ["headline", "source", "sourceDate", "sourceUrl"]) {
    if (data.article[key] && !html.includes(escapeHtml(data.article[key]))) {
      fail(`${context} must render article.${key}`);
    }
  }

  if (Array.isArray(data.article.facts) && data.article.facts.length) {
    if (!html.includes("article-facts")) fail(`${context} must render article.facts when provided`);
    for (const fact of data.article.facts) {
      const value = fact.value || fact.title || fact.label || fact.strong || fact.key || "";
      if (value && !html.includes(escapeHtml(value))) fail(`${context} must render fact ${value}`);
    }
  }

  if (!/\.game-layout\s*\{[\s\S]*grid-template-columns:[\s\S]*\}/.test(css)) {
    fail(`${context} CSS must define the desktop game layout`);
  }
  if (!/@media\s*\(max-width:[\s\S]*\.game-layout\s*\{[\s\S]*grid-template-columns:\s*1fr/.test(css)) {
    fail(`${context} CSS must stack the game layout on mobile`);
  }
  if (!/\.article-dossier\s*\{[\s\S]*position:\s*sticky/.test(css)) {
    fail(`${context} CSS must keep the desktop article dossier sticky`);
  }
}

function writeSyntheticModule(root) {
  fs.mkdirSync(path.join(root, "9.9 Hoofdstuk Test", "9.9.1 Lang artikel"), { recursive: true });
  fs.mkdirSync(path.join(root, "shared", "newsdetective"), { recursive: true });
  fs.writeFileSync(path.join(root, "deploy-config.json"), JSON.stringify({
    nr: 9,
    name: "Fixture",
    chapters: [{ id: "9.9", folder: "9.9 Hoofdstuk Test", name: "Test", number: 9, domain: "teal" }],
    paragraphs: [{ id: "9.9.1", name: "Lang artikel", chapter: "9.9", domain: "teal" }],
  }, null, 2));

  const longBody = [
    "Eerste alinea: dit nieuwsartikel is bewust lang zodat de actieve game niet kan volstaan met een compact kaartje.",
    "Tweede alinea: leerlingen moeten bron, context en formulering opnieuw kunnen lezen tijdens iedere ronde.",
    "Derde alinea: de tekst blijft volledig in het dossier staan, zonder line clamp, ellipsis of samenvatting.",
    "Vierde alinea: op mobiele schermen mag de pagina scrollen, maar de tekst mag niet standaard ingeklapt worden.",
  ].join(" ");

  const data = {
    meta: { parNr: "9.9.1", parName: "Lang artikel" },
    domainColors: { primary: "#17A2B8", primaryDk: "#117A8B", primaryLt: "#E8F8FB", accent: "#F8C471", navy: "#1E2761" },
    article: {
      headline: "Lang nieuwsartikel voor dossiercontrole",
      body: longBody,
      source: "Fixture News",
      sourceDate: "18 juni 2026",
      sourceUrl: "https://example.com/news-detective-fixture",
      visualAlt: "Fixture visual",
      facts: [
        { value: "Lang", detail: "volledige tekst" },
        { value: "Geen clamp", detail: "dossier blijft leesbaar" },
      ],
    },
    rounds: [
      {
        type: "concept",
        question: "Welk concept past?",
        options: [
          { text: "Schaarste", correct: true, feedback: "Goed." },
          { text: "Rente", correct: false, feedback: "Nee." },
          { text: "Inflatie", correct: false, feedback: "Nee." },
          { text: "Export", correct: false, feedback: "Nee." },
        ],
      },
      {
        type: "consequence",
        question: "Zet de keten goed.",
        chain: [
          { text: "Stap 1", position: 0 },
          { text: "Stap 2", position: 1 },
          { text: "Stap 3", position: 2 },
          { text: "Stap 4", position: 3 },
        ],
        distractors: [{ text: "Afleider 1" }, { text: "Afleider 2" }],
      },
      {
        type: "model",
        question: "Welk model past?",
        options: [
          { id: "goed", label: "Goed model", description: "Past.", correct: true, feedback: "Goed." },
          { id: "fout-a", label: "Fout A", description: "Past niet.", correct: false, feedback: "Nee." },
          { id: "fout-b", label: "Fout B", description: "Past niet.", correct: false, feedback: "Nee." },
        ],
      },
      {
        type: "error",
        question: "Welke zin klopt niet?",
        fakeAnalysis: "Een analist zegt dat er geen keuzes nodig zijn en dat elk alternatief gratis blijft.",
        errorPhrase: "geen keuzes nodig",
        errorExplanation: "Er zijn juist keuzes nodig.",
        distractorPhrases: ["elk alternatief gratis blijft", "Een analist zegt"],
      },
    ],
    lesLink: "Terug naar de les.",
  };
  fs.writeFileSync(path.join(root, "shared", "newsdetective", "9.9.1.js"), `var NEWS_DETECTIVE_DATA = ${JSON.stringify(data, null, 2)};\n`);
  return data;
}

function runBuilder(moduleRoot) {
  const run = spawnSync(process.execPath, [BUILDER], {
    cwd: PLATFORM_ROOT,
    env: { ...process.env, MODULE_ROOT: moduleRoot },
    encoding: "utf8",
  });
  if (run.status !== 0) {
    fail(`builder failed:\n${run.stdout}\n${run.stderr}`);
  }
}

function checkSourceAndFixture() {
  const fixture = read(path.join(PLATFORM_ROOT, "references", "ui", "news-detective-v2", "approved.html"));
  requireIncludes(fixture, REQUIRED_MARKERS, "approved.html");

  const source = [
    read(path.join(PLATFORM_ROOT, "engines", "newsdetective-ui.js")),
    read(path.join(PLATFORM_ROOT, "engines", "newsdetective.css")),
    read(BUILDER),
  ].join("\n");
  requireIncludes(source, REQUIRED_MARKERS, "production source");
  requireExcludes(source, FORBIDDEN_MARKERS, "production source");
  if (source.includes("calc(100vw - var(--sidebar))")) {
    fail("production source must not size content with 100vw minus sidebar");
  }
}

function checkSyntheticOutput() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "news-detective-v2-"));
  try {
    const data = writeSyntheticModule(tmp);
    runBuilder(tmp);
    const output = path.join(tmp, "9.9 Hoofdstuk Test", "9.9.1 Lang artikel", `9.9.1 Lang artikel ${DASH} nieuws-detective.html`);
    verifyOutput(
      read(output),
      read(path.join(tmp, "shared", "newsdetective.css")),
      read(path.join(tmp, "shared", "newsdetective-ui.js")),
      data,
      "synthetic output"
    );
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function checkRealOutput() {
  const data = loadData(REAL_DATA);
  verifyOutput(
    read(REAL_OUTPUT),
    read(path.join(LESSON_ROOT, "Boek 1 - Grondslagen, vraag en aanbod", "shared", "newsdetective.css")),
    read(path.join(LESSON_ROOT, "Boek 1 - Grondslagen, vraag en aanbod", "shared", "newsdetective-ui.js")),
    data,
    "real 1.1.1 output"
  );
}

function main() {
  checkSourceAndFixture();
  checkSyntheticOutput();
  checkRealOutput();
  console.log("OK news detective V2 guardrails");
}

main();
