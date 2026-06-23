#!/usr/bin/env node
/**
 * Build Book 1 paragraph 1.1.3 student-web companion artifacts.
 *
 * Web-first profile: no Word exports. Publisher-print Part A remains separate.
 */

const fs = require("fs");
const path = require("path");
const { writeDeckHtml } = require("../../lib/render-presentation-v2-html");
const graphTransferPresentationDeck = require("./b1-113-presentation-v2-model");

const NODE_PATH = path.join(process.env.APPDATA || "", "npm", "node_modules");
if (NODE_PATH) {
  process.env.NODE_PATH = NODE_PATH;
  require("module").Module._initPaths();
}

const PptxGenJS = require("pptxgenjs");

const PAR_NR = "1.1.3";
const PAR_NAME = "Grafieken en tabellen";
const DASH = "\u2013";

const PLATFORM_ROOT = path.resolve(__dirname, "..", "..", "..");
const BOOK_ROOT = process.env.MODULE_ROOT
  ? path.resolve(process.env.MODULE_ROOT)
  : path.resolve(PLATFORM_ROOT, "..", "4veco-lessen", "Boek 1 - Grondslagen, vraag en aanbod");
const PAR_DIR = path.join(
  BOOK_ROOT,
  "1.1 Hoofdstuk Economisch denken en rekenen",
  "1.1.3 Grafieken en tabellen"
);
const SHARED_DIR = path.join(BOOK_ROOT, "shared");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
  console.log("write " + path.relative(path.resolve(PLATFORM_ROOT, ".."), filePath));
}

function copyEngine(file) {
  const src = path.join(PLATFORM_ROOT, "engines", file);
  const dst = path.join(SHARED_DIR, file);
  if (!fs.existsSync(src)) throw new Error("Missing engine file: " + src);
  const header = file.endsWith(".css")
    ? "/* AUTO-COPIED FROM 4veco-platform/engines/ - DO NOT EDIT HERE */\n"
    : "// AUTO-COPIED FROM 4veco-platform/engines/ - DO NOT EDIT HERE\n";
  writeFile(dst, header + fs.readFileSync(src, "utf8"));
}

function fileName(surface, ext = "html") {
  return `${PAR_NR} ${PAR_NAME} ${DASH} ${surface}.${ext}`;
}

function esc(text) {
  return String(text == null ? "" : text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pageTemplate({ title, subtitle, active, body, accent = "grafisch" }) {
  const nav = [
    ["uitleg voorkennis", "Voorkennis"],
    ["uitleg vaardigheden", "Vaardigheden"],
    ["samenvatting", "Samenvatting"],
    ["begeleide inoefening", "Oefenen"],
    ["nieuws met visual", "Nieuws"],
    ["youtube-videos", "Video's"],
  ];
  const navHtml = nav.map(([surface, label]) => {
    const href = surface === active ? "#" : fileName(surface);
    const cls = surface === active ? " class=\"active\"" : "";
    return `<a${cls} href="${esc(href)}">${esc(label)}</a>`;
  }).join("\n");

  return `<!doctype html>
<html lang="nl" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(PAR_NAME)} - ${esc(title)}</title>
  <link rel="stylesheet" href="../../shared/voorkennis.css">
  <script>(function(){try{var m=localStorage.getItem("quizMode");if(!m&&matchMedia("(prefers-color-scheme: dark)").matches)m="dark";if(m==="dark")document.documentElement.setAttribute("data-theme","dark");}catch(e){}})();</script>
  <style>
    .lesson-shell{max-width:1180px;margin:0 auto;padding:28px 24px 56px}
    .back-row{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px}
    .back-row a{color:var(--accent);font-weight:800;text-decoration:none}
    .lesson-hero{padding:26px 0 20px;border-bottom:1px solid var(--border);margin-bottom:24px}
    .lesson-kicker{font:700 .78rem var(--mono);text-transform:uppercase;color:var(--accent);letter-spacing:.08em}
    .lesson-hero h1{margin:.45rem 0 .4rem;font-size:clamp(2rem,4vw,3.3rem);line-height:1.05;letter-spacing:0}
    .lesson-sub{max-width:830px;color:var(--ink-soft);font-size:1.03rem;line-height:1.55}
    .lesson-nav{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
    .lesson-nav a{padding:8px 12px;border:1px solid var(--border);border-radius:8px;text-decoration:none;color:var(--ink);background:var(--bg-card);font-weight:700;font-size:.9rem}
    .lesson-nav a.active{background:var(--accent);border-color:var(--accent);color:#fff}
    .content-grid{display:grid;grid-template-columns:minmax(0,1fr) 310px;gap:24px;align-items:start}
    .main-flow{display:grid;gap:18px}
    .side-note{position:sticky;top:20px;border:1px solid var(--border);border-radius:8px;padding:16px;background:var(--bg-card)}
    .side-note h2{font-size:1.05rem;margin:0 0 8px}
    .lesson-card,.step-card,.example-card{border:1px solid var(--border);border-radius:8px;padding:16px;background:var(--bg-card);box-shadow:var(--shadow-card)}
    .lesson-card h2,.step-card h3,.example-card h3{margin-top:0}
    .card-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .triple-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
    .step-list{counter-reset:step;display:grid;gap:10px;padding:0;margin:0;list-style:none}
    .step-list li{counter-increment:step;position:relative;padding:12px 12px 12px 48px;border:1px solid var(--border);border-radius:8px;background:var(--bg)}
    .step-list li:before{content:counter(step);position:absolute;left:12px;top:12px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:#fff;font-weight:800}
    .data-table{width:100%;border-collapse:collapse;background:var(--bg);border-radius:8px;overflow:hidden}
    .data-table th,.data-table td{border:1px solid var(--border);padding:10px;text-align:left;vertical-align:top}
    .data-table th{background:var(--bg-lift)}
    .formula{font-family:var(--mono);background:var(--bg-lift);border-radius:8px;padding:12px;overflow:auto}
    .callout{border-left:5px solid var(--accent);background:var(--accent-soft);padding:14px 16px;border-radius:8px}
    .warning{border-left-color:var(--letop-ink);background:var(--letop-bg)}
    .dual-card{display:grid;grid-template-columns:minmax(280px,.95fr) minmax(0,1.05fr);gap:16px;align-items:start}
    .visual-object{border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--bg);min-width:0}
    .visual-object h3{margin:0 0 8px;font-size:1rem}
    .visual-object p{margin:8px 0 0;color:var(--ink-soft);font-size:.92rem;line-height:1.45}
    .visual-object img{display:block;width:100%;height:auto;max-height:360px;object-fit:contain;border:1px solid var(--border);border-radius:8px;background:#fff}
    .source-table td.is-highlighted,.source-table th.is-highlighted{background:color-mix(in oklab,var(--accent) 22%,var(--bg-lift));font-weight:900}
    .inline-graph{display:block;width:100%;height:auto;max-height:300px}
    .inline-graph .axis{stroke:var(--ink);stroke-width:2}
    .inline-graph .grid{stroke:var(--border);stroke-width:1}
    .inline-graph .curve{fill:none;stroke:var(--accent);stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
    .inline-graph .guide{stroke:var(--letop-ink);stroke-width:2;stroke-dasharray:6 5}
    .inline-graph .point{fill:var(--economisch);stroke:var(--bg-card);stroke-width:2}
    .inline-graph text{fill:var(--ink-soft);font:700 13px system-ui,sans-serif}
    .axis-compare{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    .axis-panel{border:1px solid var(--border);border-radius:8px;padding:10px;background:var(--bg)}
    .axis-bars{height:150px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:end;border-left:2px solid var(--ink);border-bottom:2px solid var(--ink);padding:10px 10px 0;margin-top:8px}
    .axis-bar{display:grid;align-items:end;justify-items:center;gap:4px;height:100%;font-size:.8rem;font-weight:800;color:var(--ink-soft)}
    .axis-bar span:nth-child(2){width:46px;border-radius:6px 6px 0 0;background:var(--accent);display:block}
    .guided-source{margin-top:12px}
    .mini-chart{display:grid;gap:10px}
    .bar-row{display:grid;grid-template-columns:96px 1fr 62px;gap:10px;align-items:center}
    .bar-track{height:18px;border-radius:999px;background:color-mix(in oklab,var(--accent) 14%,var(--bg-lift));overflow:hidden}
    .bar-fill{height:100%;border-radius:999px;background:var(--accent)}
    details.lesson-card summary{cursor:pointer;font-weight:800}
    @media(max-width:980px){.content-grid{grid-template-columns:1fr}.side-note{position:static}.triple-grid,.card-grid,.dual-card,.axis-compare{grid-template-columns:1fr}}
  </style>
</head>
<body data-accent-domain="${esc(accent)}">
  <main class="lesson-shell">
    <div class="back-row">
      <a href="index.html">&larr; Terug naar overzicht</a>
      <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Licht/donker wisselen"></button>
    </div>
    <header class="lesson-hero">
      <span class="lesson-kicker">&sect;${PAR_NR} - ${esc(title)}</span>
      <h1>${esc(PAR_NAME)}</h1>
      <p class="lesson-sub">${esc(subtitle)}</p>
      <nav class="lesson-nav" aria-label="Companion onderdelen">
${navHtml}
      </nav>
    </header>
    ${body}
  </main>
  <script src="../../shared/theme.js"></script>
  <script src="../../shared/voorkennis.js"></script>
</body>
</html>`;
}

function dualCard(visual, stepsHtml) {
  return `<div class="dual-card">${visual}<div>${stepsHtml}</div></div>`;
}

function ijsTableVisual() {
  const rows = [
    ["EUR 1,00", "500 ijsjes"],
    ["EUR 1,50", "400 ijsjes"],
    ["EUR 2,00", "300 ijsjes"],
    ["EUR 2,50", "200 ijsjes"],
    ["EUR 3,00", "100 ijsjes"],
  ];
  return `<figure class="visual-object" data-visual-id="ice_table">
    <h3>IJsjesverkoop: brongegevens</h3>
    <table class="data-table source-table">
      <thead><tr><th class="is-highlighted">Prijs per ijsje</th><th class="is-highlighted">Aantal verkocht</th></tr></thead>
      <tbody>
        ${rows.map(([p, q], i) => `<tr><td class="${i === 0 || i === 2 ? "is-highlighted" : ""}">${p}</td><td class="${i === 0 || i === 2 ? "is-highlighted" : ""}">${q}</td></tr>`).join("")}
      </tbody>
    </table>
    <p>Lees eerst kop, rij en eenheid. Pas daarna kies je waarden voor een berekening.</p>
  </figure>`;
}

function assetSourceVisual({ id, title, asset, caption, alt }) {
  return `<figure class="visual-object" data-visual-id="${esc(id)}" data-source-asset="${esc(asset)}">
    <h3>${esc(title)}</h3>
    <img src="_assets/${esc(asset)}" alt="${esc(alt || title)}">
    <p>${esc(caption)}</p>
  </figure>`;
}

function coffeeTableVisual() {
  const rows = [
    ["EUR 1,00", "200 bekers"],
    ["EUR 1,50", "160 bekers"],
    ["EUR 2,00", "120 bekers"],
    ["EUR 2,50", "80 bekers"],
    ["EUR 3,00", "40 bekers"],
  ];
  return `<figure class="visual-object" data-visual-id="guided_coffee_table">
    <h3>Koffieverkoop: bron-tabel</h3>
    <table class="data-table source-table">
      <thead><tr><th class="is-highlighted">Prijs per beker</th><th class="is-highlighted">Verkocht per dag</th></tr></thead>
      <tbody>
        ${rows.map(([p, q]) => `<tr><td>${p}</td><td>${q}</td></tr>`).join("")}
      </tbody>
    </table>
    <p>Gebruik deze tabel voor Opgave 2: punten als (200; 1,00), (160; 1,50), (120; 2,00), (80; 2,50), (40; 3,00).</p>
  </figure>`;
}

function pqGraphVisual({ id = "pq_graph", title = "P-Q-grafiek", interpolation = false, caption = "Prijs staat verticaal; hoeveelheid staat horizontaal." } = {}) {
  const points = [
    [112, 60, "500;1,00"],
    [172, 95, "400;1,50"],
    [232, 130, "300;2,00"],
    [292, 165, "200;2,50"],
    [352, 200, "100;3,00"],
  ];
  const interpolationMarkup = interpolation
    ? `\n      <line class="guide" x1="68" y1="112" x2="262" y2="112"></line><line class="guide" x1="262" y1="112" x2="262" y2="220"></line><circle class="point" cx="262" cy="112" r="6"></circle><text x="78" y="104">EUR 1,75</text><text x="270" y="214">ongeveer 350</text>`
    : "";
  return `<figure class="visual-object" data-visual-id="${esc(id)}">
    <h3>${esc(title)}</h3>
    <svg class="inline-graph" viewBox="0 0 430 270" role="img" aria-label="${esc(title)} met prijs op de verticale as en hoeveelheid op de horizontale as">
      <line class="axis" x1="68" y1="220" x2="386" y2="220"></line>
      <line class="axis" x1="68" y1="220" x2="68" y2="36"></line>
      <line class="grid" x1="68" y1="164" x2="386" y2="164"></line>
      <line class="grid" x1="68" y1="108" x2="386" y2="108"></line>
      <text x="360" y="248">Q</text>
      <text x="18" y="50">P</text>
      <text x="40" y="64">EUR 1</text>
      <text x="40" y="134">EUR 2</text>
      <text x="40" y="204">EUR 3</text>
      <text x="108" y="246">500</text>
      <text x="228" y="246">300</text>
      <text x="348" y="246">100</text>
      <polyline class="curve" points="${points.map(([x, y]) => `${x},${y}`).join(" ")}"></polyline>
      ${points.map(([x, y, label], i) => `<circle class="point" cx="${x}" cy="${y}" r="5"></circle>${i === 2 ? `<text x="${x + 8}" y="${y - 8}">(${label})</text>` : ""}`).join("")}${interpolationMarkup}
    </svg>
    <p>${esc(caption)}</p>
  </figure>`;
}

function waterGraphVisual() {
  return `<figure class="visual-object" data-visual-id="guided_water_two_point">
    <h3>Waterverkoop: twee punten en interpolatie</h3>
    <svg class="inline-graph" viewBox="0 0 430 270" role="img" aria-label="Waterverkoop met punten januari en juni en interpolatie bij EUR 1,00">
      <line class="axis" x1="68" y1="220" x2="386" y2="220"></line>
      <line class="axis" x1="68" y1="220" x2="68" y2="36"></line>
      <line class="grid" x1="68" y1="188" x2="386" y2="188"></line>
      <line class="grid" x1="68" y1="126" x2="386" y2="126"></line>
      <line class="grid" x1="68" y1="64" x2="386" y2="64"></line>
      <text x="360" y="248">Q</text>
      <text x="18" y="50">P</text>
      <text x="31" y="192">EUR 0,80</text>
      <text x="31" y="130">EUR 1,00</text>
      <text x="31" y="68">EUR 1,20</text>
      <text x="142" y="246">350</text>
      <text x="232" y="246">425</text>
      <text x="322" y="246">500</text>
      <polyline class="curve" points="328,188 148,64"></polyline>
      <circle class="point" cx="328" cy="188" r="6"></circle><text x="230" y="181">(500; 0,80)</text>
      <circle class="point" cx="148" cy="64" r="6"></circle><text x="156" y="57">(350; 1,20)</text>
      <line class="guide" x1="68" y1="126" x2="238" y2="126"></line><line class="guide" x1="238" y1="126" x2="238" y2="220"></line>
      <circle class="point" cx="238" cy="126" r="6"></circle><text x="246" y="119">EUR 1,00 -> 425</text>
    </svg>
    <p>Deze visual hoort bij Opgave 4: januari 500 bij EUR 0,80, juni 350 bij EUR 1,20, en bij EUR 1,00 lees je ongeveer 425 flesjes af.</p>
  </figure>`;
}

function blankAxesVisual() {
  return `<figure class="visual-object" data-visual-id="blank_axes_template">
    <h3>Assen-template voor tekenen</h3>
    <svg class="inline-graph" viewBox="0 0 430 270" role="img" aria-label="Lege P-Q assen om punten uit een tabel te tekenen">
      <line class="axis" x1="68" y1="220" x2="386" y2="220"></line>
      <line class="axis" x1="68" y1="220" x2="68" y2="36"></line>
      <line class="grid" x1="68" y1="164" x2="386" y2="164"></line>
      <line class="grid" x1="68" y1="108" x2="386" y2="108"></line>
      <text x="360" y="248">Q</text>
      <text x="18" y="50">P</text>
      <circle class="point" cx="118" cy="188" r="5"></circle><text x="126" y="180">(40;3,00)</text>
      <circle class="point" cx="352" cy="76" r="5"></circle><text x="250" y="68">(200;1,00)</text>
    </svg>
    <p>Zet punten uit als (Q; P), dus hoeveelheid eerst en prijs daarna.</p>
  </figure>`;
}

function axisComparisonVisual() {
  return `<figure class="visual-object" data-visual-id="misleading_axis_comparison">
    <h3>Zelfde data, andere schaal</h3>
    <div class="axis-compare">
      <section class="axis-panel">
        <strong>Y-as vanaf 0</strong>
        <div class="axis-bars">
          <div class="axis-bar"><span>Week 1</span><span style="height:96%"></span><b>520</b></div>
          <div class="axis-bar"><span>Week 2</span><span style="height:92%"></span><b>500</b></div>
        </div>
      </section>
      <section class="axis-panel">
        <strong>Y-as vanaf 490</strong>
        <div class="axis-bars">
          <div class="axis-bar"><span>Week 1</span><span style="height:96%"></span><b>520</b></div>
          <div class="axis-bar"><span>Week 2</span><span style="height:34%"></span><b>500</b></div>
        </div>
      </section>
    </div>
    <p>De waarden zijn gelijk, maar de ingezoomde as maakt het verschil groter.</p>
  </figure>`;
}

function writeParagraphPlan() {
  writeFile(path.join(PAR_DIR, "_paragraph-plan.md"), `# Paragraph Plan - ${PAR_NR} ${PAR_NAME}

Generated: 2026-05-19
Sprint: L1.6R Dual-Coding Remediation
Profile: student-web, no default Word exports

## Learning Goals

Students can:

- read economic tables by checking column headings, row labels and units
- draw a price-quantity graph with the economics axis convention
- read and interpolate values from a graph
- use graph/table values in percentage and index calculations from section 1.1.2
- judge whether a graph or percentage claim is misleading

## Narrative

The lesson starts with an ice-cream stand: different prices lead to different
sales quantities. Students first read the table, then turn it into a graph,
then read values back from the graph. The final move is critical reading: every
claim about a graph needs a comparison basis and a scale check.

## Student-Web Outputs

- Instapquiz: table labels, axes, graph reading and critical data claims
- Uitleg voorkennis: variables, units, coordinate reading and prior percentage/index knowledge
- Uitleg vaardigheden: table-value selection, economics axis convention, graph reading and interpolation
- Begeleide inoefening: the textbook exercises converted into guided steps with revealable answers
- Nieuws met visual: a generic news-graph example about misleading vertical-axis choices
- Nieuws-detective: interactive checks on graph claims and scale choices
- Presentation: classroom deck with speaker notes for later TTS/video use
- Samenvatting: table/graph checklist and misconception map
- Stappenplan: table-value selection and graph-reading procedure practice
- Redeneer-spel: source-value reasoning and claim checking
- Wiskundevaardigheden: paragraph mode for graph/table and supporting calculation skills
- Grafiekenspel: fresh graphical-game data for this paragraph

## Procedure-Stappen-Plan

1. Tabelwaarden selecteren voor een berekening:
   - lees de vraag en bepaal welke grootheid, periode, rij of kolom nodig is
   - controleer bron, tabelkop, rijlabel, kolomlabel en eenheid
   - selecteer de oude waarde, nieuwe waarde of gevraagde waarde voordat je rekent
   - noteer de gekozen waarden met label zodat de berekening controleerbaar is
2. Grafiek tekenen van tabeldata:
   - bepaal de variabelen
   - kies de assen volgens de economie-conventie
   - kies een schaalverdeling
   - zet de punten uit en verbind ze passend
3. Waarden aflezen en interpoleren:
   - lees titel, assen en eenheden
   - zoek de gevraagde waarde op de juiste as
   - lees de bijbehorende waarde af op de andere as
   - schat tussen bekende punten als dat nodig is

## Procedure Contract

The table-value route is internally mapped to the existing A61 table-trace
template. Student-facing pages use only the full skill name and normal learning
language; no internal unit code or PV label is shown.

## Visuelen-Toewijzing

- Tabellen: ijsjesverkoop bij verschillende prijzen, met nadruk op rij-,
  kolom- en eenheidslabels.
- Staafdiagram: discrete prijs-aantalcombinaties voor het aflezen van waarden.
- Lijngrafiek: doorlopende prijs-aantalrelaties en interpolatie tussen punten.
- Nieuwsvisual: askeuze en afgesneden assen als bron van misleiding.
- Grafiekenspel: dezelfde tabel/grafiekvaardigheden als interactieve oefenroute.

## Dual-Coding Contract

Required learning objects:

- ice_table:
  - type: table
  - must appear in: uitleg vaardigheden, presentatie, begeleide inoefening
  - semantic anchors: prijs per ijsje, aantal verkocht, EUR 1,00, EUR 2,00,
    500 ijsjes, 300 ijsjes
- pq_graph:
  - type: graph
  - must appear in: uitleg voorkennis, uitleg vaardigheden, presentatie,
    samenvatting
  - semantic anchors: P vertical, Q horizontal, (300; 2,00)
- interpolation_graph:
  - type: graph
  - must appear in: uitleg vaardigheden, presentatie, begeleide inoefening
  - semantic anchors: EUR 1,75, ongeveer 350, guide lines
- misleading_axis_comparison:
  - type: graph_pair
  - must appear in: uitleg vaardigheden, presentatie, nieuws met visual,
    samenvatting, begeleide inoefening
  - semantic anchors: y-axis from 0, y-axis from 490, same data different scale

Closure rule:

For this paragraph, a procedure route without the required visual learning
object is a companion hard fail, even if procedure-contract validation passes.

## Terminologie

- tabelkop, rijlabel, kolomlabel en eenheid
- onafhankelijke variabele en afhankelijke variabele
- horizontale as en verticale as
- schaalverdeling, punt, lijn en interpoleren
- misleidende grafiek en vergelijkingsbasis

## Rounding Policy

- Graph-reading answers may be exact or approximate; use "ongeveer" when a
  value is interpolated or visually estimated.
- Percentages are rounded to 1 decimal unless the task says otherwise.
- Index numbers are written as whole numbers when exact.

## Skilltree Mapping

- A61: tabelwaarden selecteren voor berekening
- A62: waarden aflezen uit staafdiagram
- A63: waarden aflezen uit lijngrafiek
- A38: procentuele verandering berekenen when graph/table values are used
- A39: indexcijfer berekenen where the Part A opgaven connect to 1.1.2

The v5 target exercise remains migrated from v4 and needs later v5 review; this
sprint does not mark it final-reviewed.

## Acceptance Tests

- Complete student-web validator passes for 1.1.3.
- Part A publisher-print validator remains green.
- Graphical-game data validates and renders on desktop/mobile in light/dark.
- Procedure-contract validator passes, including the 1.1.3 table-value route.
- Semantic visual QA confirms required graph/table learning objects are present
  in the generated companion surfaces.
- No student-facing internal code or blocked-use claim appears.
- Student-experience and teacher-learning-quality review records exist before closure.
`);
}

function writeRichPages() {
  writeFile(path.join(PAR_DIR, fileName("uitleg voorkennis")), pageTemplate({
    title: "Uitleg voorkennis",
    active: "uitleg voorkennis",
    subtitle: "De basis die je nodig hebt voordat je tabellen en grafieken economisch gaat gebruiken.",
    body: `<div class="content-grid">
      <section class="main-flow">
        <article class="lesson-card">
          <h2>1. Variabelen, labels en eenheden</h2>
          <p>Een tabel of grafiek is pas bruikbaar als je weet wat de getallen voorstellen. Lees daarom eerst de titel, kolomkoppen, aslabels en eenheden.</p>
          <table class="data-table">
            <thead><tr><th>Onderdeel</th><th>Vraag die je stelt</th><th>Voorbeeld</th></tr></thead>
            <tbody>
              <tr><td>Titel</td><td>Waar gaat de bron over?</td><td>IJsjesverkoop bij verschillende prijzen</td></tr>
              <tr><td>Kolomkop</td><td>Welke variabele staat hier?</td><td>Prijs, aantal verkocht</td></tr>
              <tr><td>Eenheid</td><td>Hoe meet je de variabele?</td><td>euro, stuks, procent</td></tr>
            </tbody>
          </table>
        </article>
        <article class="lesson-card">
          <h2>2. Coördinaten lezen</h2>
          ${dualCard(pqGraphVisual({
            id: "voorkennis_pq_point",
            title: "Punt in een P-Q-grafiek",
            caption: "(300; 2,00) betekent 300 ijsjes bij een prijs van EUR 2,00."
          }), `<p>Een punt in een economische P-Q grafiek schrijf je vaak als <strong>(Q; P)</strong>: hoeveelheid horizontaal, prijs verticaal.</p>
          <div class="callout">Voorbeeld: (300; 2,00) betekent 300 ijsjes bij een prijs van EUR 2,00.</div>`)}
        </article>
        <article class="lesson-card">
          <h2>3. Herhaling uit percentages en indexcijfers</h2>
          <p>Soms lees je eerst waarden uit een tabel of grafiek en reken je daarna verder.</p>
          <p class="formula">(nieuw - oud) / oud x 100%</p>
          <p class="formula">index = waarde doeljaar / waarde basisjaar x 100</p>
        </article>
      </section>
      <aside class="side-note">
        <h2>Startcheck</h2>
        <ol>
          <li>Kan ik titel en eenheid aanwijzen?</li>
          <li>Weet ik welke as prijs en welke as hoeveelheid toont?</li>
          <li>Kan ik uitleggen wat een punt in de grafiek betekent?</li>
        </ol>
      </aside>
    </div>`
  }));

  writeFile(path.join(PAR_DIR, fileName("uitleg vaardigheden")), pageTemplate({
    title: "Uitleg vaardigheden",
    active: "uitleg vaardigheden",
    subtitle: "Drie routes: waarden uit bronnen kiezen, P-Q grafieken tekenen, en waarden aflezen of interpoleren.",
    body: `<div class="content-grid">
      <section class="main-flow">
        <article class="lesson-card">
          <h2>Tabelwaarden selecteren voor een berekening</h2>
          ${dualCard(ijsTableVisual(), `<ol class="step-list">
            <li><strong>Lees de vraag.</strong> Bepaal welke grootheid, periode, rij of kolom nodig is.</li>
            <li><strong>Controleer de bron.</strong> Kijk naar tabelkop, rijlabel, kolomlabel en eenheid.</li>
            <li><strong>Selecteer de waarden.</strong> Kies de oude waarde, nieuwe waarde of gevraagde waarde voordat je rekent.</li>
            <li><strong>Label je waarden.</strong> Noteer bijvoorbeeld: oud = 500 ijsjes, nieuw = 300 ijsjes.</li>
          </ol>`)}
        </article>
        <article class="lesson-card">
          <h2>Grafiek tekenen van tabeldata</h2>
          ${dualCard(pqGraphVisual({ id: "vaardigheden_pq_graph", title: "Tabelpunten als P-Q-grafiek" }), `<ol class="step-list">
            <li>Bepaal welke variabelen in de tabel staan.</li>
            <li>Zet in economie de prijs op de verticale as en hoeveelheid op de horizontale as.</li>
            <li>Kies een schaalverdeling die alle punten netjes laat passen.</li>
            <li>Zet de punten uit en verbind ze passend.</li>
          </ol>`)}
        </article>
        <article class="lesson-card">
          <h2>Waarden aflezen en interpoleren</h2>
          ${dualCard(pqGraphVisual({
            id: "vaardigheden_interpolation_graph",
            title: "Interpoleren bij EUR 1,75",
            interpolation: true,
            caption: "Gebruik hulplijnen: van prijs naar grafiek, daarna naar hoeveelheid."
          }), `<ol class="step-list">
            <li>Lees titel, assen en eenheden.</li>
            <li>Zoek de gevraagde waarde op de juiste as.</li>
            <li>Lees de bijbehorende waarde op de andere as.</li>
            <li>Schat tussen twee bekende punten als de waarde niet exact in de tabel staat.</li>
          </ol>`)}
        </article>
        <article class="lesson-card warning">
          <h2>Valkuil</h2>
          ${dualCard(axisComparisonVisual(), `<p>Een grafiek kan een verschil groter laten lijken door de as niet bij nul te laten beginnen. Kijk daarom altijd naar de schaal voordat je een conclusie trekt.</p>`)}
        </article>
      </section>
      <aside class="side-note">
        <h2>Welke route kies je?</h2>
        <p><strong>Tabelvraag?</strong> Eerst waarden selecteren en labelen.</p>
        <p><strong>Grafiek tekenen?</strong> Eerst assen en schaal kiezen.</p>
        <p><strong>Grafiek aflezen?</strong> Eerst titel, as en eenheid controleren.</p>
      </aside>
    </div>`
  }));

  writeFile(path.join(PAR_DIR, fileName("samenvatting")), pageTemplate({
    title: "Samenvatting",
    active: "samenvatting",
    subtitle: "De kern van tabellen en grafieken: eerst lezen, dan tekenen of rekenen.",
    body: `<section class="main-flow">
      <article class="lesson-card">
        <h2>Onthoudschema</h2>
        <div class="triple-grid">
          <div class="step-card"><h3>Tabel</h3><p>Lees kolomkoppen, rijlabels en eenheden voordat je een getal kiest.</p></div>
          <div class="step-card"><h3>Grafiek</h3><p>In economie staat prijs op de verticale as en hoeveelheid op de horizontale as.</p></div>
          <div class="step-card"><h3>Claim</h3><p>Vraag bij elk percentage: vergeleken met wat?</p></div>
        </div>
        <div class="card-grid" style="margin-top:14px">
          ${pqGraphVisual({ id: "summary_pq_graph", title: "P-Q herinnering", caption: "P verticaal, Q horizontaal." })}
          ${axisComparisonVisual()}
        </div>
      </article>
      <article class="lesson-card">
        <h2>Veelgemaakte fouten</h2>
        <table class="data-table">
          <thead><tr><th>Fout</th><th>Hoe voorkom je die?</th></tr></thead>
          <tbody>
            <tr><td>Prijs op de horizontale as zetten</td><td>Controleer de economie-conventie: P verticaal, Q horizontaal.</td></tr>
            <tr><td>Een zichtbaar getal pakken zonder label</td><td>Schrijf altijd de eenheid en het label naast het getal.</td></tr>
            <tr><td>Een grafiek geloven zonder schaalcheck</td><td>Bekijk of de as bij nul begint en welke stappen de schaal gebruikt.</td></tr>
          </tbody>
        </table>
      </article>
    </section>`
  }));

  writeFile(path.join(PAR_DIR, fileName("begeleide inoefening")), pageTemplate({
    title: "Begeleide inoefening",
    active: "begeleide inoefening",
    subtitle: "De opgaven uit het lesboek met extra tussenstappen, hints en controle-antwoorden.",
    body: `<section class="main-flow">
      <article class="lesson-card">
        <h2>Vaste bronroute bij elke opgave</h2>
        <ol class="step-list">
          <li>Lees de vraag: welke grootheid, periode, rij of kolom heb je nodig?</li>
          <li>Controleer de bron: tabelkop, rijlabel, kolomlabel en eenheid.</li>
          <li>Selecteer de oude waarde, nieuwe waarde of gevraagde waarde voordat je rekent.</li>
          <li>Label de gekozen waarden zodat je berekening controleerbaar blijft.</li>
        </ol>
      </article>
      ${guidedExercise("Opgave 1 - Broodjesgrafiek", assetSourceVisual({
        id: "guided_bread_graph",
        title: "Broodjesverkoop: bron-grafiek",
        asset: "1.1.3_ex_1.svg",
        alt: "Broodjesgrafiek met prijs op de verticale as en hoeveelheid broodjes op de horizontale as",
        caption: "Gebruik deze bron bij Opgave 1: EUR 3,00 hoort bij 200 broodjes; 150 broodjes hoort bij EUR 3,50."
      }), [
        "Zoek eerst de prijs op de verticale as.",
        "Ga horizontaal naar de lijn en daarna verticaal naar de hoeveelheid.",
        "Beschrijf daarna het verband in woorden."
      ], "Bij EUR 3,00 worden 200 broodjes verkocht. Bij 150 broodjes hoort EUR 3,50. Het verband is negatief: hogere prijs, lagere verkoop.")}
      ${guidedExercise("Opgave 2 - Koffie tekenen", `${coffeeTableVisual()}<div class="guided-source">${blankAxesVisual()}</div>`, [
        "Zet hoeveelheid op de horizontale as en prijs op de verticale as.",
        "Kies een schaal die 40 tot 200 bekers en EUR 1,00 tot EUR 3,00 laat passen.",
        "Zet de punten uit als (Q; P), bijvoorbeeld (200; 1,00)."
      ], "De grafiek is een dalende rechte lijn. Bij elke prijsstijging van EUR 0,50 daalt de verkoop met 40 bekers.")}
      ${guidedExercise("Opgave 3 - Bioscoop interpoleren", assetSourceVisual({
        id: "guided_cinema_interpolation",
        title: "Bioscoopbezoekers interpoleren",
        asset: "1.1.3_ex_2.svg",
        alt: "Bioscoopgrafiek met bezoekers op de horizontale as en prijs op de verticale as",
        caption: "Gebruik deze bron bij Opgave 3: EUR 9,00 hoort bij 500 bezoekers; EUR 11,00 ligt tussen EUR 10,00 en EUR 12,00 en hoort bij ongeveer 300 bezoekers."
      }), [
        "Lees EUR 9,00 direct af.",
        "EUR 11,00 ligt midden tussen EUR 10,00 en EUR 12,00.",
        "Voor de procentuele verandering gebruik je de oude waarde als basis."
      ], "Bij EUR 9,00 komen 500 bezoekers. Bij EUR 11,00 ongeveer 300 bezoekers. Van 600 naar 200 is -66,7%.")}
      ${guidedExercise("Opgave 4 - Water en index", waterGraphVisual(), [
        "Teken de twee punten (500; 0,80) en (350; 1,20).",
        "EUR 1,00 ligt midden tussen beide prijzen.",
        "Gebruik januari als basis voor het indexcijfer."
      ], "Bij EUR 1,00 lees je 425 flesjes af. Index juni = 350 / 500 x 100 = 70. De daling is 30%, niet een derde.")}
      ${guidedExercise("Opgave 5 - Misleidende assen", axisComparisonVisual(), [
        "Vergelijk een grafiek die bij nul start met een ingezoomde as.",
        "Let op hoe steil of dramatisch de daling lijkt.",
        "Noem in je antwoord altijd de schaalkeuze."
      ], "De grafiek met y-as vanaf EUR 4,50 laat de daling groter lijken. Dat komt doordat de schaal is ingezoomd.")}
    </section>`
  }));

  writeFile(path.join(PAR_DIR, fileName("nieuws met visual")), pageTemplate({
    title: "Nieuws met visual",
    active: "nieuws met visual",
    subtitle: "Een nieuwsachtige grafiek kan overtuigend lijken, maar je moet titel, schaal en vergelijking controleren.",
    body: `<div class="content-grid">
      <section class="main-flow">
        <article class="lesson-card">
          <h2>Kop: verkoop lijkt plotseling ingestort</h2>
          <p>Stel dat een bericht laat zien dat de verkoop van een product van 520 naar 500 daalt. In een grafiek die bij 0 begint is dat een kleine daling. In een grafiek die bij 490 begint lijkt dezelfde daling groot.</p>
          ${axisComparisonVisual()}
        </article>
        <article class="lesson-card warning">
          <h2>Controleer de schaal</h2>
          <p>Een grafiek liegt niet automatisch, maar een schaalkeuze kan wel sturen wat jij voelt. Vraag daarom: begint de as bij nul, of is er ingezoomd?</p>
        </article>
      </section>
      <aside class="side-note">
        <h2>Nieuwscheck</h2>
        <ol>
          <li>Wat is de bron?</li>
          <li>Welke periode wordt vergeleken?</li>
          <li>Welke schaal gebruikt de grafiek?</li>
          <li>Past de kop bij de data?</li>
        </ol>
      </aside>
    </div>`
  }));

  writeFile(path.join(PAR_DIR, fileName("youtube-videos")), pageTemplate({
    title: "Video's",
    active: "youtube-videos",
    subtitle: "Kijk gericht: gebruik video's om een vaardigheid te oefenen, niet als losse herhaling.",
    body: `<section class="main-flow">
      <article class="lesson-card">
        <h2>Zoekopdrachten die passen bij deze paragraaf</h2>
        <table class="data-table">
          <thead><tr><th>Doel</th><th>Zoekterm</th><th>Waar let je op?</th></tr></thead>
          <tbody>
            <tr><td>Tabel naar grafiek</td><td>economie prijs hoeveelheid grafiek tekenen</td><td>Prijs hoort op de verticale as.</td></tr>
            <tr><td>Interpoleren</td><td>waarden aflezen uit grafiek interpoleren</td><td>Zoek of de uitleg met stippellijnen werkt.</td></tr>
            <tr><td>Misleidende grafieken</td><td>misleidende grafieken assen schaal</td><td>Let op grafieken die niet bij nul beginnen.</td></tr>
          </tbody>
        </table>
      </article>
    </section>`
  }));
}

function guidedExercise(title, visual, steps, answer) {
  return `<details class="lesson-card">
    <summary>${esc(title)}</summary>
    <div class="guided-source">${visual}</div>
    <ol>${steps.map(step => `<li>${esc(step)}</li>`).join("")}</ol>
    <div class="callout"><strong>Controle:</strong> ${esc(answer)}</div>
  </details>`;
}

function writeQuizData() {
  const data = {
    meta: {
      parNr: PAR_NR,
      parName: PAR_NAME,
      subtitle: "Test of je tabellen, assen, grafieken en data-claims goed leest.",
      testTopics: [
        "Tabelkoppen en eenheden herkennen",
        "Prijs en hoeveelheid op de juiste as zetten",
        "Waarden aflezen en interpoleren",
        "Misleidende grafieken herkennen"
      ]
    },
    categories: {
      tabel: { name: "Tabellen", colors: { bg: "#E8F8F5", text: "#0B5E5A", bar: "#148F83" } },
      grafiek: { name: "Grafieken", colors: { bg: "#EBF5FB", text: "#154360", bar: "#1A5276" } },
      interpolatie: { name: "Interpoleren", colors: { bg: "#FEF5E7", text: "#BA6A1C", bar: "#E67E22" } },
      kritisch: { name: "Kritisch kijken", colors: { bg: "#F9EBEA", text: "#922B21", bar: "#C0392B" } }
    },
    questions: [
      q("tabel", 1, "Waar kijk je eerst naar bij een tabel?", ["Kolomkoppen en eenheden", "Alleen het grootste getal", "De kleur van de tabel", "De laatste rij"], 0, "De koppen en eenheden vertellen wat de getallen betekenen."),
      q("grafiek", 1, "Welke as gebruikt economie meestal voor prijs P?", ["Verticale as", "Horizontale as", "Legenda", "Geen as"], 0, "In P-Q grafieken staat prijs op de verticale as."),
      q("grafiek", 2, "Een punt (300; 2,00) in een P-Q grafiek betekent:", ["Q = 300 en P = 2,00", "P = 300 en Q = 2,00", "Index 300", "2 procent"], 0, "Hoeveelheid staat horizontaal, prijs verticaal."),
      q("interpolatie", 2, "Wat doe je bij interpoleren?", ["Een waarde tussen twee bekende punten schatten", "Een waarde buiten de grafiek verzinnen", "Altijd afronden op nul", "De assen omdraaien"], 0, "Interpolatie ligt tussen bekende punten."),
      q("kritisch", 2, "Waarom kan een grafiek misleidend lijken?", ["De as begint niet bij nul", "De titel staat bovenaan", "De tabel heeft rijen", "De lijn heeft punten"], 0, "Een ingezoomde as kan een klein verschil groot laten lijken."),
      q("tabel", 3, "Een claim vergelijkt 500 met 300. Welke basis gebruik je voor procentuele verandering?", ["500", "300", "200", "800"], 0, "De oude waarde staat in de noemer."),
      q("interpolatie", 3, "Tussen 400 bij EUR 1,50 en 300 bij EUR 2,00 ligt EUR 1,75. Welke hoeveelheid past bij een rechte lijn?", ["350", "375", "300", "400"], 0, "EUR 1,75 ligt precies in het midden, dus de hoeveelheid ook."),
      q("kritisch", 3, "Een kop zegt: verkoop daalt 50%. Wat moet je vragen?", ["Tussen welke twee waarden wordt vergeleken?", "Welke kleur heeft de staaf?", "Is de titel kort genoeg?", "Wie tekende de lijn?"], 0, "Een percentage heeft altijd een vergelijkingsbasis nodig."),
      q("grafiek", 3, "Welke fout maakt een leerling die prijs P op de horizontale as zet in een P-Q grafiek?", ["De economie-conventie wordt omgedraaid", "De tabel wordt automatisch fout", "De eenheid euro verdwijnt", "De lijn moet altijd stijgen"], 0, "In economie staat P verticaal en Q horizontaal."),
      q("tabel", 2, "Waarom schrijf je 'oud = 500 ijsjes' in plaats van alleen '500'?", ["Het label maakt de berekening controleerbaar", "Het antwoord wordt dan altijd positief", "Je hoeft dan geen formule te gebruiken", "De grafiek wordt dan overbodig"], 0, "Een getal zonder label is moeilijk te controleren.")
    ]
  };
  writeJSVar(path.join(SHARED_DIR, "questions", `${PAR_NR}.js`), "QUIZ_DATA", data);
}

function q(category, difficulty, text, options, answer, rationale) {
  return { category, difficulty, q: text, options, answer, rationale };
}

function writeNewsDetectiveData() {
  const data = {
    meta: { parNr: PAR_NR, parName: PAR_NAME },
    article: {
      headline: "Grafiek laat kleine daling groot lijken",
      body: "Een winkelketen toont twee weken verkoopcijfers. Week 1 heeft 520 verkopen en week 2 heeft 500 verkopen. De grafiek begint op 490, waardoor de daling veel groter lijkt dan in een grafiek die bij nul begint.",
      source: "Oefenbron",
      sourceDate: "fictieve lessituatie",
      sourceUrl: "https://example.com/oefenbron-grafieken",
      visualAlt: "Twee staafgrafieken met dezelfde data maar verschillende verticale schaal"
    },
    rounds: [
      {
        type: "concept",
        question: "Welke controle is hier het belangrijkst?",
        options: [
          { text: "Controleren waar de verticale as begint", correct: true, feedback: "Juist. De schaal bepaalt hoe groot het verschil lijkt." },
          { text: "Alleen kijken welke staaf hoger is", correct: false, feedback: "Dat is te snel; kijk eerst naar de schaal." },
          { text: "De grafiek negeren", correct: false, feedback: "Grafieken zijn nuttig, maar je moet ze kritisch lezen." },
          { text: "Alleen de kleur van de staaf vergelijken", correct: false, feedback: "Kleur kan helpen, maar de schaal en eenheid bepalen de betekenis." }
        ]
      },
      {
        type: "consequence",
        question: "Zet de controle in de juiste volgorde.",
        chain: [
          { text: "Lees de titel en bron", position: 0 },
          { text: "Controleer de as en eenheid", position: 1 },
          { text: "Lees de waarden af", position: 2 },
          { text: "Beoordeel of de kop bij de data past", position: 3 }
        ],
        distractors: [
          { text: "Begin met het percentage gokken" },
          { text: "Kijk alleen naar de langste staaf" }
        ]
      },
      {
        type: "model",
        question: "Welke aanpak past bij 520 naar 500?",
        options: [
          { id: "procentuele-verandering", label: "Procentuele verandering berekenen", description: "Je vergelijkt nieuw met oud.", correct: true, feedback: "Ja. Het verschil is -20 en de basis is 520." },
          { id: "assen-omdraaien", label: "Assen omdraaien", description: "Je wisselt x en y.", correct: false, feedback: "Dat lost de claim niet op." },
          { id: "alleen-aflezen", label: "Alleen de hoogste waarde noemen", description: "Je noemt alleen week 1.", correct: false, feedback: "Je moet vergelijken." }
        ]
      },
      {
        type: "error",
        fakeAnalysis: "De grafiek begint bij 490, dus de verkoop is bijna helemaal ingestort.",
        errorPhrase: "bijna helemaal ingestort",
        errorExplanation: "De verkoop daalt van 520 naar 500. Dat is 20 minder, dus ongeveer 3,8% daling. De ingezoomde as maakt het beeld dramatischer dan de data.",
        distractorPhrases: ["begint bij 490", "verkoop", "grafiek"]
      }
    ],
    lesLink: "Gebruik de grafiekcheck: titel, as, eenheid, waarde, conclusie."
  };
  writeJSVar(path.join(SHARED_DIR, "newsdetective", `${PAR_NR}.js`), "NEWS_DETECTIVE_DATA", data);
}

function writeProcedureData() {
  const procedures = {
    meta: { parNr: PAR_NR, parName: PAR_NAME },
    procedures: [
      {
        id: "tabelwaarden-selecteren",
        title: "Tabelwaarden selecteren voor een berekening",
        icon: "fa-table",
        description: "Kies de juiste bronwaarden voordat je met procenten, indexcijfers of grafieken rekent.",
        procedure_template_id: "select_table_values_trace",
        steps: [
          given("Gegeven", "Een vraag met een tabel of bron."),
          choose("Stap 1", "read_question_target", "Lees de vraag en bepaal welke grootheid, periode, rij of kolom nodig is", [
            "Pak het eerste getal dat je ziet",
            "Begin direct met procenten rekenen"
          ]),
          choose("Stap 2", "check_table_headers_units", "Controleer bron, tabelkop, rijlabel, kolomlabel en eenheid", [
            "Negeer de eenheid als het getal duidelijk is",
            "Gebruik alleen de tabeltitel"
          ]),
          choose("Stap 3", "select_needed_values", "Selecteer de oude waarde, nieuwe waarde of gevraagde waarde voordat je rekent", [
            "Selecteer alle waarden in de tabel",
            "Kies altijd de grootste waarde"
          ]),
          choose("Stap 4", "label_selected_values", "Noteer de gekozen waarden met label zodat de berekening controleerbaar is", [
            "Schrijf alleen het eindantwoord op",
            "Laat de labels weg om sneller te werken"
          ]),
          given("Resultaat", "Je hebt controleerbare bronwaarden voor je berekening.")
        ]
      },
      {
        id: "grafiek-aflezen",
        title: "Waarden aflezen uit een grafiek",
        icon: "fa-chart-line",
        description: "Lees een waarde af door titel, assen, schaal en eenheid te controleren.",
        steps: [
          given("Gegeven", "Een economische grafiek en een gevraagde waarde."),
          choose("Stap 1", "read_graph_title_axes", "Lees titel, assen en eenheden", ["Begin bij het hoogste punt", "Negeer de aslabels"]),
          choose("Stap 2", "find_requested_value", "Zoek de gevraagde waarde op de juiste as", ["Zoek de waarde op een willekeurige as", "Gebruik de legenda als antwoord"]),
          choose("Stap 3", "trace_to_graph", "Trek denkbeeldig een lijn naar de grafiek en naar de andere as", ["Schat zonder naar de schaal te kijken", "Draai de assen om"]),
          choose("Stap 4", "estimate_or_interpolate", "Bepaal of je exact afleest of moet interpoleren", ["Rond altijd naar het dichtstbijzijnde honderd", "Noem elke schatting exact"]),
          given("Resultaat", "Je hebt een waarde met eenheid en eventueel ongeveer-teken.")
        ]
      }
    ]
  };
  writeJSVar(path.join(SHARED_DIR, "procedure", `${PAR_NR}.js`), "PROCEDURE_DATA", procedures);
}

function given(label, text) {
  return { type: "given", label, text };
}

function choose(label, formalStepId, correctText, wrongTexts) {
  return {
    type: "choose",
    label,
    formal_step_id: formalStepId,
    options: [
      { text: correctText, correct: true },
      ...wrongTexts.map(text => ({
        text,
        correct: false,
        feedback: "Deze stap klinkt snel, maar je mist dan bron, label of eenheid."
      }))
    ]
  };
}

function writeReasoningData() {
  const csv = `id;structure_type;structure_label;problem_text;step_1_label;step_1_detail;step_1_formula;step_2_label;step_2_detail;step_2_formula;step_3_label;step_3_detail;step_3_formula;distractor_1_label;distractor_1_detail;distractor_1_formula;distractor_2_label;distractor_2_detail;distractor_2_formula;distractor_3_label;distractor_3_detail;distractor_3_formula;subq_1;subq_2;subq_3;subq_distractor_1;subq_distractor_2;error_step_index;error_wrong_label;error_wrong_detail;error_wrong_formula;flow_1_type;flow_1_text;flow_2_type;flow_2_text;flow_3_type;flow_3_text;flow_4_type;flow_4_text;flow_5_type;flow_5_text;flow_6_type;flow_6_text
1;A;Vraag lezen -> tabelkop controleren -> waarden labelen;Een tabel toont prijs en verkochte ijsjes. Welke waarden heb je nodig om de daling van EUR 1,00 naar EUR 2,00 te berekenen?;Lees de vraag;De vraag vergelijkt EUR 1,00 met EUR 2,00.;target=prijzen;Controleer tabelkop en eenheid;Prijs staat in euro en verkoop in stuks.;prijs/euro, verkoop/stuks;Label de waarden;Oud = 500 ijsjes en nieuw = 300 ijsjes.;oud=500, nieuw=300;Pak het laagste getal;Dat is geen bronselectie.;100;Gebruik de prijs als verkoop;Prijs en hoeveelheid zijn verschillende variabelen.;2;Reken zonder labels;Dan is je berekening niet controleerbaar.;;Welke prijzen worden vergeleken?;Welke verkoopwaarden horen daarbij?;Welke labels schrijf je bij de waarden?;Welke kleur heeft de tabel?;Welke week was het warmst?;2;Gebruik de prijswaarden als verkoopwaarden;Je gebruikt dan euro's alsof het stuks zijn.;oud=1, nieuw=2;given;Vraag vergelijkt twee prijzen;step;Controleer kolommen en eenheden;step;Selecteer 500 en 300;result;Label oud en nieuw;result;Nu pas rekenen;;
2;B;As lezen -> punt zoeken -> waarde aflezen;Lees uit een P-Q grafiek hoeveel ijsjes worden verkocht bij EUR 1,75.;Lees de assen;Prijs staat verticaal en hoeveelheid horizontaal.;P=y, Q=x;Zoek EUR 1,75;Ga vanaf de prijsas naar de lijn.;P=1.75;Lees de hoeveelheid;Ga naar de horizontale as en lees ongeveer 350.;Q=350;Zoek EUR 1,75 op de Q-as;Dan gebruik je de verkeerde as.;Q=1.75;Neem het dichtstbijzijnde tabelpunt;Dan mis je interpolatie.;Q=300 of 400;Gebruik de hoogste hoeveelheid;Dat beantwoordt de vraag niet.;500;Welke as gebruik je voor prijs?;Waarom is dit interpoleren?;Welke hoeveelheid lees je af?;Wat is de titel van het boek?;Welke kleur heeft de lijn?;1;Zoek de prijs op de horizontale as;In economie staat prijs op de verticale as.;P op x;given;Gevraagd: prijs EUR 1,75;step;Zoek prijs op y-as;step;Trek lijn naar grafiek;result;Lees Q af;result;Ongeveer 350 ijsjes;;
3;C;Claim lezen -> basis vinden -> procent controleren;Een kop zegt: verkoop daalt 50%. De tabel vergelijkt 400 met 200. Controleer de claim.;Lees de claim;De claim zegt dat er een daling van 50% is.;claim=50%;Vind de basis;De oude waarde is 400.;oud=400;Controleer de berekening;(200 - 400) / 400 x 100 = -50%.;-50%;Deel door 200;Dan gebruik je de nieuwe waarde als basis.;-100%;Gebruik 200 als procentpunten;Dit is geen index of procentpunt.;200 punten;Kijk alleen naar de grafiekhelling;De helling geeft nog geen percentage.;helling;Welke oude waarde gebruik je?;Wat is het verschil?;Klopt de kop?;Welke krant schreef dit?;Hoeveel assen heeft de grafiek?;1;Gebruik de nieuwe waarde als basis;Bij procentuele verandering hoort oud in de noemer.;basis=200;given;Claim 50% daling;step;Oud = 400, nieuw = 200;step;Bereken verschil en deel door oud;result;-50%;result;De claim klopt voor deze vergelijking;;
4;A;Vraag lezen -> tabelkop controleren -> waarden labelen;Een tabel toont bezoekers bij kaartprijzen. Welke waarden heb je nodig voor EUR 8 naar EUR 12?;Lees de vraag;De vraag vergelijkt EUR 8 met EUR 12.;target=prijzen;Controleer tabelkop en eenheid;Prijs staat in euro en bezoekers in personen.;prijs/euro, bezoekers/personen;Label de waarden;Oud = 600 bezoekers en nieuw = 200 bezoekers.;oud=600, nieuw=200;Pak de hoogste prijs;Dat is geen bronselectie.;12;Gebruik euro als bezoekers;Prijs en bezoekers zijn verschillende variabelen.;8;Reken zonder labels;Dan is je berekening niet controleerbaar.;;Welke prijzen worden vergeleken?;Welke bezoekerswaarden horen daarbij?;Welke labels schrijf je bij de waarden?;Welke bioscoop is het?;Welke film draait er?;2;Gebruik de prijswaarden als bezoekerswaarden;Je gebruikt dan euro's alsof het personen zijn.;oud=8, nieuw=12;given;Vraag vergelijkt twee prijzen;step;Controleer kolommen en eenheden;step;Selecteer 600 en 200;result;Label oud en nieuw;result;Nu pas rekenen;;
5;B;As lezen -> punt zoeken -> waarde aflezen;Lees uit een grafiek hoeveel bezoekers horen bij EUR 9,00.;Lees de assen;Prijs staat verticaal en bezoekers horizontaal.;P=y, Q=x;Zoek EUR 9,00;Ga vanaf de prijsas naar de lijn.;P=9;Lees de hoeveelheid;Ga naar de horizontale as en lees 500.;Q=500;Zoek EUR 9,00 op de bezoekersas;Dan gebruik je de verkeerde as.;Q=9;Neem het hoogste punt;Dan beantwoord je niet de vraag.;600;Gebruik de laagste prijs;De gevraagde prijs is EUR 9,00.;8;Welke as gebruik je voor prijs?;Welke hoeveelheid lees je af?;Waarom controleer je de schaal?;Welke kleur heeft de lijn?;Hoe lang duurt de film?;1;Zoek de prijs op de horizontale as;In economie staat prijs op de verticale as.;P op x;given;Gevraagd: prijs EUR 9,00;step;Zoek prijs op y-as;step;Trek lijn naar grafiek;result;Lees Q af;result;500 bezoekers;;
6;C;Claim lezen -> basis vinden -> procent controleren;Een journalist schrijft dat waterverkoop met een derde daalt. De data gaan van 500 naar 350. Controleer dit.;Lees de claim;De claim zegt dat de daling ongeveer een derde is.;claim=een derde;Vind de basis;De oude waarde is 500.;oud=500;Controleer de berekening;(350 - 500) / 500 x 100 = -30%.;-30%;Deel door 350;Dan gebruik je de nieuwe waarde als basis.;-42.9%;Noem 150 een procent;Het verschil in stuks is geen percentage.;150%;Kijk alleen naar de lijn;De lijn vertelt nog niet het percentage.;lijn;Welke oude waarde gebruik je?;Wat is het verschil?;Klopt de claim precies?;Welke winkel is dit?;Welke maand is warmer?;1;Gebruik de nieuwe waarde als basis;Bij procentuele verandering hoort oud in de noemer.;basis=350;given;Claim: een derde daling;step;Oud = 500, nieuw = 350;step;Bereken verschil en deel door oud;result;-30%;result;Niet precies een derde;;`;
  const content = `// Reasoning Game data for ${PAR_NR} ${PAR_NAME}
var REASONING_CSV = ${JSON.stringify(csv)};

var REASONING_META = {
  "parNr": "${PAR_NR}",
  "parName": "${PAR_NAME}",
  "domain": "math-economics"
};
`;
  writeFile(path.join(SHARED_DIR, "reasoning", `${PAR_NR}.js`), content);
}

function writeReviewAndQuality() {
  writeFile(path.join(PAR_DIR, "1.1.3-companion-visual-review.md"), `# Companion Visual Review - 1.1.3 Grafieken en tabellen

Date: 2026-05-19
Sprint: L1.6R

## Verdict

PASS WITH FLAGS

## Scope

Reviewed generated student-web companion surfaces after the L1.6R dual-coding
remediation and focused visual-value concordance correction. L1.6R is closed
PASS WITH FLAGS after human review accepted the correction.

## Current Judgment

- Presentation, vaardigheden, begeleide inoefening, voorkennis, samenvatting,
  and nieuws met visual now show concrete graph/table learning objects.
- Each core procedure is paired with a worked visual example and a student
  action route.
- The guided-practice source visuals now match the exercise-specific values,
  labels, and answer routes instead of reusing generic graph examples.
- The A61-style table-value route uses ordinary student language and avoids
  internal code exposure.
- Grafiekenspel remains graph-based and still carries the MVP/scaffolded flag.
- The v5 target exercise remains migrated and requires later v5 quality review.

## Semantic Visual Evidence

- ice_table appears in vaardigheden, presentation, and begeleide inoefening.
- pq_graph appears in voorkennis, vaardigheden, presentation, and samenvatting.
- interpolation_graph appears in vaardigheden, presentation, and begeleide
  inoefening.
- misleading_axis_comparison appears in vaardigheden, presentation,
  nieuws met visual, samenvatting, and begeleide inoefening.
- Guided-practice source concordance:
  - Opgave 1 uses the actual broodjesverkoop source asset.
  - Opgave 2 uses the coffee table with 200, 160, 120, 80 and 40 bekers.
  - Opgave 3 uses the actual bioscoopbezoekers source asset.
  - Opgave 4 uses a water graph with 500, 350, EUR 0,80, EUR 1,20,
    EUR 1,00 and 425.

## Remaining Flags

- The graphical game and several visuals are still scaffolded MVP surfaces.
- Harder unlabeled graph-reading variants remain later work.
- Rendered screenshot QA passed after remediation: presentation-v2
  desktop/fullscreen/notes/mobile/dark scenarios and rich student-web page
  desktop/mobile light/dark scenarios.
- Human review accepted the remediation and focused concordance correction.
  L1.6R closes PASS WITH FLAGS.
`);

  writeFile(path.join(PAR_DIR, "1.1.3-quality-ref.yaml"), `# Quality Reference - 1.1.3 Grafieken en tabellen
# Refreshed: 2026-05-21 (L-CP6E Part A figure-numbering remediation)

paragraph: "1.1.3"
title: "Grafieken en tabellen"
type: theory
schema_version: 2

partA:
  content:
    paragraaf_md: true
    opgaven_md: true
    antwoorden_md: true
    paragraaf_pdf: true
    opgaven_pdf: true
    antwoorden_pdf: true
    build_pdf_py: true
  assets:
    total_referenced: 6
    total_present: 6
    missing: []
    svgpng_paired: true
    naming_compliant: true
  review:
    file: "1.1.3-review.md"
    unresolved_fails: 0
    verdict: "PASS WITH FLAGS"
    last_reviewed: "2026-05-21"
    flags:
      - "Opgaven.md repeats the worked example for standalone exercise use; CP.6e accepts this as non-blocking standalone-exercise scaffolding."
    fixed_flags:
      - "L-CP6E fixed Part A figure first-use order to Figuur 1 -> Figuur 2 -> Figuur 3."

companion:
  review_file: "1.1.3-companion-visual-review.md"
  review_verdict: "PASS WITH FLAGS"
  last_reviewed: "2026-05-19"
  hard_fails_open: 0
  human_review_status: "pass_with_flags"
  default_office_exports: false
  student_facing_internal_codes: false
  l16r_dual_coding:
    status: "pass_with_flags"
    required_objects_present:
      ice_table: true
      pq_graph: true
      interpolation_graph: true
      misleading_axis_comparison: true
    guided_visual_concordance:
      opgave_1_broodjes: true
      opgave_2_koffie: true
      opgave_3_bioscoop: true
      opgave_4_water: true
      opgave_5_misleidende_assen: true
    closure_note: "Procedure parity is not treated as sufficient without visible learning objects."
  procedures:
    tabelwaarden_selecteren_step_count: 4
    grafiek_aflezen_step_count: 4
  skilltree_mapping:
    active_skills: ["A61", "A62", "A63", "A38", "A39"]
    coverage_note: "A61/A62/A63 cover table and graph reading; A38/A39 support percentage and index use with graph/table values."
  surfaces:
    voorkennis_html: pass_with_flags
    vaardigheden_html: pass_with_flags
    presentatie_pptx: pass_with_flags
    presentatie_html: pass_with_flags
    nieuws_html: pass_with_flags
    samenvatting_html: pass_with_flags
    begeleide_inoefening_html: pass_with_flags
    youtube_videos_html: pass_with_flags
    games:
      instapquiz: pass_with_flags
      nieuws_detective: pass_with_flags
      stappenplan: pass_with_flags
      redeneer_spel: pass_with_flags
      wiskundevaardigheden: pass_with_flags
      grafiekenspel: pass_with_flags
`);
}

async function writePresentation() {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "4VECO";
  pptx.subject = `${PAR_NR} ${PAR_NAME}`;
  pptx.title = PAR_NAME;
  pptx.company = "4VECO";
  pptx.lang = "nl-NL";
  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
    lang: "nl-NL"
  };
  pptx.defineLayout({ name: "LAYOUT_WIDE", width: 13.333, height: 7.5 });

  const colors = { ink: "102A43", teal: "0F766E", pale: "ECFEFF", amber: "B45309", green: "2F7D4A", coral: "8A2D0E", white: "FFFFFF" };
  function visualSlide(title, subtitle, bullets, notes, drawVisual) {
    const s = pptx.addSlide();
    s.background = { color: "F8FAFC" };
    s.addText(`\u00A7${PAR_NR}`, { x: 0.7, y: 0.35, w: 1.2, h: 0.25, fontSize: 12, bold: true, color: colors.teal, margin: 0 });
    s.addText(title, { x: 0.7, y: 0.8, w: 11.8, h: 0.55, fontSize: 30, bold: true, color: colors.ink, margin: 0, fit: "shrink" });
    s.addText(subtitle, { x: 0.72, y: 1.43, w: 10.8, h: 0.35, fontSize: 15, color: "52606D", margin: 0 });
    drawVisual(s);
    bullets.forEach((b, i) => {
      const y = 4.9 + i * 0.56;
      s.addShape(pptx.ShapeType.roundRect, { x: 0.85, y, w: 11.7, h: 0.42, rectRadius: 0.06, fill: { color: i % 2 ? "FFFFFF" : colors.pale }, line: { color: "BAE6FD" } });
      s.addText(b, { x: 1.1, y: y + 0.1, w: 11.1, h: 0.18, fontSize: 12.5, color: colors.ink, margin: 0, fit: "shrink" });
    });
    s.addNotes(notes);
  }

  function addIceTable(s, x, y, w, h) {
    const rows = [["Prijs", "Verkoop"], ["EUR 1,00", "500"], ["EUR 1,50", "400"], ["EUR 2,00", "300"], ["EUR 2,50", "200"], ["EUR 3,00", "100"]];
    const rowH = h / rows.length;
    const colW = w / 2;
    rows.forEach((row, ri) => row.forEach((cell, ci) => {
      const fill = ri === 0 || ri === 1 || ri === 3 ? (ri === 0 ? "DDF7EF" : "FFF4CC") : "FFFFFF";
      s.addShape(pptx.ShapeType.rect, { x: x + ci * colW, y: y + ri * rowH, w: colW, h: rowH, fill: { color: fill }, line: { color: "CBD5E1" } });
      s.addText(cell, { x: x + ci * colW + 0.06, y: y + ri * rowH + 0.07, w: colW - 0.12, h: rowH - 0.08, fontSize: ri === 0 ? 11 : 10, bold: ri === 0 || ri === 1 || ri === 3, color: colors.ink, margin: 0, fit: "shrink" });
    }));
  }

  function addPqGraph(s, x, y, w, h, interpolation = false) {
    s.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: "FFFFFF" }, line: { color: "CBD5E1" } });
    s.addShape(pptx.ShapeType.line, { x: x + 0.55, y: y + h - 0.45, w: w - 0.85, h: 0, line: { color: colors.ink, width: 1.4 } });
    s.addShape(pptx.ShapeType.line, { x: x + 0.55, y: y + h - 0.45, w: 0, h: -h + 0.75, line: { color: colors.ink, width: 1.4 } });
    s.addText("P", { x: x + 0.15, y: y + 0.16, w: 0.25, h: 0.2, fontSize: 12, bold: true, color: colors.ink, margin: 0 });
    s.addText("Q", { x: x + w - 0.42, y: y + h - 0.28, w: 0.25, h: 0.2, fontSize: 12, bold: true, color: colors.ink, margin: 0 });
    const pts = [
      [x + 0.98, y + 0.62],
      [x + 1.88, y + 1.02],
      [x + 2.78, y + 1.42],
      [x + 3.68, y + 1.82],
      [x + 4.58, y + 2.22],
    ];
    for (let i = 0; i < pts.length - 1; i++) {
      s.addShape(pptx.ShapeType.line, { x: pts[i][0], y: pts[i][1], w: pts[i + 1][0] - pts[i][0], h: pts[i + 1][1] - pts[i][1], line: { color: colors.green, width: 2.4 } });
    }
    pts.forEach(([px, py], i) => {
      s.addShape(pptx.ShapeType.ellipse, { x: px - 0.045, y: py - 0.045, w: 0.09, h: 0.09, fill: { color: colors.amber }, line: { color: colors.white } });
      if (i === 2) s.addText("(300; 2,00)", { x: px + 0.12, y: py - 0.2, w: 1.2, h: 0.2, fontSize: 9, color: colors.ink, margin: 0 });
    });
    if (interpolation) {
      const gx = x + 3.18;
      const gy = y + 1.26;
      s.addShape(pptx.ShapeType.line, { x: x + 0.55, y: gy, w: gx - (x + 0.55), h: 0, line: { color: colors.coral, width: 1.6, dash: "dash" } });
      s.addShape(pptx.ShapeType.line, { x: gx, y: gy, w: 0, h: y + h - 0.45 - gy, line: { color: colors.coral, width: 1.6, dash: "dash" } });
      s.addText("EUR 1,75", { x: x + 0.7, y: gy - 0.24, w: 0.9, h: 0.18, fontSize: 8.5, color: colors.coral, margin: 0 });
      s.addText("Q ~ 350", { x: gx + 0.08, y: y + h - 0.68, w: 0.9, h: 0.18, fontSize: 8.5, color: colors.coral, margin: 0 });
    }
  }

  function addAxisComparison(s, x, y, w, h) {
    [["as vanaf 0", 0.92, 0.88], ["as vanaf 490", 0.92, 0.34]].forEach(([title, a, b], idx) => {
      const px = x + idx * (w / 2 + 0.12);
      const pw = w / 2 - 0.12;
      s.addShape(pptx.ShapeType.rect, { x: px, y, w: pw, h, fill: { color: "FFFFFF" }, line: { color: "CBD5E1" } });
      s.addText(title, { x: px + 0.12, y: y + 0.12, w: pw - 0.24, h: 0.2, fontSize: 10, bold: true, color: colors.ink, margin: 0 });
      [[0.38, a, "520"], [1.23, b, "500"]].forEach(([off, height, label]) => {
        s.addShape(pptx.ShapeType.rect, { x: px + off, y: y + h - 0.35 - height * 1.5, w: 0.46, h: height * 1.5, fill: { color: colors.green }, line: { color: colors.green } });
        s.addText(label, { x: px + off - 0.03, y: y + h - 0.26, w: 0.55, h: 0.16, fontSize: 8.5, color: colors.ink, margin: 0 });
      });
    });
  }

  visualSlide("Van tabel naar verhaal", "Eerst de bron lezen, daarna pas tekenen of rekenen.", [
    "Prijs en aantal verkochte ijsjes staan in verschillende kolommen.",
    "Een tabel ordent de data; een grafiek maakt het verband zichtbaar.",
    "De eerste vraag is steeds: wat betekenen deze getallen?"
  ], "Start met de ijskraam. Laat leerlingen hardop noemen wat de twee kolommen betekenen. Maak duidelijk dat een grafiek pas betrouwbaar is als de bron goed gelezen is.", (s) => { addIceTable(s, 0.9, 2.05, 4.4, 2.45); addPqGraph(s, 6.2, 2.05, 5.5, 2.45); });
  visualSlide("Tabelwaarden kiezen", "Kies niet zomaar een zichtbaar getal.", [
    "Lees de vraag: welke rij, kolom of periode heb je nodig?",
    "Controleer tabelkop, rijlabel, kolomlabel en eenheid.",
    "Label je waarden: oud = 500 ijsjes, nieuw = 300 ijsjes."
  ], "Dit is de bronwaarde-route. De kern is dat leerlingen eerst labelen. Zonder labels zijn latere berekeningen moeilijk te controleren.", (s) => addIceTable(s, 3.2, 2.0, 6.4, 2.55));
  visualSlide("De economie-conventie", "In P-Q grafieken staat prijs verticaal.", [
    "P staat op de verticale as.",
    "Q staat op de horizontale as.",
    "Een punt schrijf je als (Q; P), bijvoorbeeld (300; 2,00)."
  ], "Benadruk dat dit anders voelt dan bij wiskunde, maar in economie heel bewust gebeurt. Laat leerlingen de assen aanwijzen voordat ze een punt tekenen.", (s) => addPqGraph(s, 3.4, 2.0, 6.2, 2.6));
  visualSlide("Interpoleren", "Schatten tussen twee bekende punten.", [
    "Zoek EUR 1,75 op de prijsas.",
    "Trek een lijn naar de grafiek en lees Q af.",
    "Tussen 400 en 300 ligt ongeveer 350."
  ], "Interpoleren is hier niet gokken. Het is schatten met informatie: de prijs ligt in het midden, dus bij een rechte lijn ligt de hoeveelheid ook in het midden.", (s) => addPqGraph(s, 3.4, 2.0, 6.2, 2.6, true));
  visualSlide("Kritisch kijken", "Een grafiek kan sturen hoe groot een verschil voelt.", [
    "Controleer altijd of de as bij nul begint.",
    "Vraag welke twee waarden worden vergeleken.",
    "Een kop met procenten klopt alleen met de juiste basis."
  ], "Sluit af met grafiekgeletterdheid. Een schaalkeuze kan een klein verschil dramatischer laten lijken. Dat maakt de broncheck economisch belangrijk.", (s) => addAxisComparison(s, 2.0, 2.05, 8.9, 2.45));

  const pptxPath = path.join(PAR_DIR, fileName("presentatie", "pptx"));
  await pptx.writeFile({ fileName: pptxPath });
  console.log("write " + path.relative(path.resolve(PLATFORM_ROOT, ".."), pptxPath));

  copyEngine("presentation-v2.css");
  copyEngine("presentation-v2.js");
  writeDeckHtml(presentationV2Deck(), path.join(PAR_DIR, fileName("presentatie")), {
    pptxHref: fileName("presentatie", "pptx"),
    backHref: "index.html"
  });
  console.log("write " + path.relative(path.resolve(PLATFORM_ROOT, ".."), path.join(PAR_DIR, fileName("presentatie"))));
}

function writeGraphTransferPresentation() {
  copyEngine("presentation-v2.css");
  copyEngine("presentation-v2.js");
  writeDeckHtml(graphTransferPresentationDeck, path.join(PAR_DIR, fileName("presentatie")), {
    backHref: "index.html"
  });
  console.log("write " + path.relative(path.resolve(PLATFORM_ROOT, ".."), path.join(PAR_DIR, fileName("presentatie"))));
}

function presentationV2Deck() {
  const notes = (...script) => ({ script });
  const tableVisual = {
    type: "table",
    id: "slide_ice_table",
    title: "IJsjesverkoop",
    headers: ["Prijs", "Aantal verkocht"],
    rows: [
      [{ text: "EUR 1,00", highlight: true }, { text: "500 ijsjes", highlight: true }],
      ["EUR 1,50", "400 ijsjes"],
      [{ text: "EUR 2,00", highlight: true }, { text: "300 ijsjes", highlight: true }],
      ["EUR 2,50", "200 ijsjes"],
      ["EUR 3,00", "100 ijsjes"],
    ],
    caption: "De geselecteerde waarden krijgen pas betekenis met label en eenheid."
  };
  const pqVisual = {
    type: "pqGraph",
    id: "slide_pq_graph",
    title: "P-Q-grafiek",
    alt: "P-Q-grafiek met prijs verticaal en hoeveelheid horizontaal",
    points: [
      { x: 330, y: 62, label: "" },
      { x: 275, y: 94, label: "" },
      { x: 220, y: 126, label: "(300;2,00)" },
      { x: 165, y: 158, label: "" },
      { x: 110, y: 190, label: "" }
    ],
    caption: "Prijs staat verticaal; hoeveelheid staat horizontaal."
  };
  const interpolationVisual = {
    ...pqVisual,
    id: "slide_interpolation_graph",
    title: "Interpoleren bij EUR 1,75",
    guides: { x: 248, y: 112, xLabel: "Q ~ 350", yLabel: "EUR 1,75" },
    caption: "Hulplijnen maken de schatting controleerbaar."
  };
  const axisVisual = {
    type: "axisComparison",
    id: "slide_misleading_axis_comparison",
    title: "Zelfde data, andere schaal",
    panels: [
      { title: "Y-as vanaf 0", values: [{ label: "Week 1", height: 96, value: "520" }, { label: "Week 2", height: 92, value: "500" }] },
      { title: "Y-as vanaf 490", values: [{ label: "Week 1", height: 96, value: "520" }, { label: "Week 2", height: 34, value: "500" }] }
    ],
    caption: "De ingezoomde as maakt dezelfde daling dramatischer."
  };
  return {
    version: "presentation-v2",
    titleLabel: "Presentatie",
    sideLabel: "webpresentatie",
    paragraph: { number: PAR_NR, title: PAR_NAME, chapter: "1.1 Hoofdstuk Economisch denken en rekenen" },
    title: "Wat vertelt de grafiek echt?",
    subtitle: PAR_NAME,
    outputBase: `${PAR_NR} ${PAR_NAME} ${DASH} presentatie`,
    slides: [
      {
        id: "start",
        navTitle: "Startvraag",
        teacherTitle: "Hoeveel ijsjes verkoop je bij welke prijs?",
        studentTitle: "Van tabel naar grafiek",
        layout: "choiceTensionCover",
        eyebrow: "Paragraaf 1.1.3",
        thesis: "Een ijskraam verkoopt bij lagere prijzen meer ijsjes.",
        prompt: "De tabel geeft de data; de grafiek laat het patroon zien.",
        tension: {
          available: { label: "lage prijs", value: "EUR 1,00" },
          wanted: { label: "verkoop", value: "500" },
          gap: { label: "hoge prijs", value: "EUR 3,00 -> 100" }
        },
        visual: { type: "combo", id: "slide_start_table_graph", items: [tableVisual, pqVisual] },
        paths: [
          { label: "tabel", text: "rijen en kolommen" },
          { label: "grafiek", text: "verband in beeld" }
        ],
        speakerNotes: notes("Begin met de concrete ijskraam. Laat leerlingen zien dat de tabel al informatie bevat, maar dat het verband pas snel zichtbaar wordt in de grafiek.", "Vandaag leren ze bronwaarden kiezen, de economie-assen gebruiken en kritisch naar grafieken kijken.")
      },
      procedureSlide("tabelwaarden", "Tabelwaarden", "Tabelwaarden selecteren voor een berekening in vier stappen", [
        ["01", "Lees de vraag", "Welke rij, kolom of periode is nodig?"],
        ["02", "Controleer labels", "Tabelkop, rijlabel, kolomlabel en eenheid."],
        ["03", "Selecteer waarden", "Kies oud, nieuw of de gevraagde waarde."],
        ["04", "Label je waarden", "Schrijf bijvoorbeeld oud = 500 ijsjes."]
      ], "Gebruik deze route voordat je gaat rekenen met procenten of indexcijfers.", notes("Dit is de belangrijkste broncontrole. Leerlingen moeten leren dat het getal pas betekenis heeft met label en eenheid.", "Gebruik de gewone leerlingnaam: tabelwaarden selecteren voor een berekening."), tableVisual)
      ,
      procedureSlide("assen", "Assen", "Grafiek tekenen van tabeldata", [
        ["01", "Bepaal variabelen", "Prijs en hoeveelheid."],
        ["02", "Kies assen", "Prijs verticaal, hoeveelheid horizontaal."],
        ["03", "Kies schaal", "Alle punten moeten passen."],
        ["04", "Zet punten uit", "Verbind ze passend."]
      ], "In economie staat P op de verticale as en Q op de horizontale as.", notes("Dit is de dia waarop je de economie-conventie stevig neerzet. Laat leerlingen een punt als (Q; P) uitspreken.", "De valkuil is dat leerlingen vanuit wiskunde automatisch prijs horizontaal zetten."), pqVisual)
      ,
      procedureSlide("aflezen", "Aflezen", "Waarden aflezen en interpoleren", [
        ["01", "Lees titel en assen", "Wat meet de grafiek?"],
        ["02", "Zoek de waarde", "Bijvoorbeeld EUR 1,75 op de prijsas."],
        ["03", "Trek hulplijnen", "Naar de grafiek en dan naar de andere as."],
        ["04", "Schat netjes", "Tussen 400 en 300 ligt ongeveer 350."]
      ], "Interpoleren is schatten tussen bekende punten.", notes("Maak duidelijk dat interpoleren een beredeneerde schatting is. Het ligt tussen twee bekende punten en gebruikt de schaal van de grafiek."), interpolationVisual)
      ,
      {
        id: "kritisch",
        navTitle: "Kritisch",
        teacherTitle: "Grafieken kunnen sturen",
        studentTitle: "Kijk naar de schaal",
        layout: "procedureRoute",
        routeLabel: "Grafiekclaim controleren in vier checks",
        eyebrow: "Valkuil",
        lead: "Een verschil kan groter lijken door de askeuze.",
        steps: [
          { number: "01", title: "Lees de kop", prompt: "Wat beweert de tekst?", accent: "teal" },
          { number: "02", title: "Controleer de as", prompt: "Begint die bij nul?", accent: "green" },
          { number: "03", title: "Lees waarden", prompt: "Welke getallen worden vergeleken?", accent: "amber" },
          { number: "04", title: "Check basis", prompt: "Past het percentage bij die basis?", accent: "coral" }
        ],
        visual: axisVisual,
        example: "Een ingezoomde as kan een kleine daling dramatisch maken.",
        speakerNotes: notes("Hier komt de kritische datahouding binnen. Grafieken zijn niet verdacht, maar je moet wel weten welke keuzes het beeld sturen.", "Laat leerlingen altijd de as en de vergelijking noemen voordat ze de conclusie overnemen.")
      }
    ]
  };
}

function procedureSlide(id, navTitle, routeLabel, rows, example, speakerNotes, visual) {
  return {
    id,
    navTitle,
    teacherTitle: routeLabel,
    studentTitle: navTitle,
    layout: "procedureRoute",
    routeLabel,
    eyebrow: "Vaste aanpak",
    lead: example,
    steps: rows.map(([number, title, prompt], i) => ({
      number,
      title,
      prompt,
      accent: ["teal", "green", "amber", "coral"][i] || "teal"
    })),
    visual,
    example,
    speakerNotes
  };
}

function writeJSVar(filePath, varName, data) {
  writeFile(filePath, `var ${varName} = ${JSON.stringify(data, null, 2)};\n`);
}

async function main() {
  if (!fs.existsSync(PAR_DIR)) throw new Error("Paragraph folder not found: " + PAR_DIR);
  writeParagraphPlan();
  writeRichPages();
  writeQuizData();
  writeNewsDetectiveData();
  writeProcedureData();
  writeReasoningData();
  writeReviewAndQuality();
  writeGraphTransferPresentation();
}

main().catch(err => {
  console.error(err.stack || err.message);
  process.exit(1);
});
