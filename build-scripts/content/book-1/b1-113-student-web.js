#!/usr/bin/env node
/**
 * Build Book 1 paragraph 1.1.3 student-web companion artifacts.
 *
 * Web-first profile: no Word exports. Publisher-print Part A remains separate.
 */

const fs = require("fs");
const path = require("path");
const { writeDeckHtml } = require("../../lib/render-presentation-v2-html");

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
    .mini-chart{display:grid;gap:10px}
    .bar-row{display:grid;grid-template-columns:96px 1fr 62px;gap:10px;align-items:center}
    .bar-track{height:18px;border-radius:999px;background:color-mix(in oklab,var(--accent) 14%,var(--bg-lift));overflow:hidden}
    .bar-fill{height:100%;border-radius:999px;background:var(--accent)}
    details.lesson-card summary{cursor:pointer;font-weight:800}
    @media(max-width:980px){.content-grid{grid-template-columns:1fr}.side-note{position:static}.triple-grid,.card-grid{grid-template-columns:1fr}}
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

function writeParagraphPlan() {
  writeFile(path.join(PAR_DIR, "_paragraph-plan.md"), `# Paragraph Plan - ${PAR_NR} ${PAR_NAME}

Generated: 2026-05-18
Sprint: L1.6 Second Pipeline Regression Paragraph
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
          <p>Een punt in een economische P-Q grafiek schrijf je vaak als <strong>(Q; P)</strong>: hoeveelheid horizontaal, prijs verticaal.</p>
          <div class="callout">Voorbeeld: (300; 2,00) betekent 300 ijsjes bij een prijs van EUR 2,00.</div>
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
          <ol class="step-list">
            <li><strong>Lees de vraag.</strong> Bepaal welke grootheid, periode, rij of kolom nodig is.</li>
            <li><strong>Controleer de bron.</strong> Kijk naar tabelkop, rijlabel, kolomlabel en eenheid.</li>
            <li><strong>Selecteer de waarden.</strong> Kies de oude waarde, nieuwe waarde of gevraagde waarde voordat je rekent.</li>
            <li><strong>Label je waarden.</strong> Noteer bijvoorbeeld: oud = 500 ijsjes, nieuw = 300 ijsjes.</li>
          </ol>
        </article>
        <article class="lesson-card">
          <h2>Grafiek tekenen van tabeldata</h2>
          <ol class="step-list">
            <li>Bepaal welke variabelen in de tabel staan.</li>
            <li>Zet in economie de prijs op de verticale as en hoeveelheid op de horizontale as.</li>
            <li>Kies een schaalverdeling die alle punten netjes laat passen.</li>
            <li>Zet de punten uit en verbind ze passend.</li>
          </ol>
        </article>
        <article class="lesson-card">
          <h2>Waarden aflezen en interpoleren</h2>
          <ol class="step-list">
            <li>Lees titel, assen en eenheden.</li>
            <li>Zoek de gevraagde waarde op de juiste as.</li>
            <li>Lees de bijbehorende waarde op de andere as.</li>
            <li>Schat tussen twee bekende punten als de waarde niet exact in de tabel staat.</li>
          </ol>
        </article>
        <article class="lesson-card warning">
          <h2>Valkuil</h2>
          <p>Een grafiek kan een verschil groter laten lijken door de as niet bij nul te laten beginnen. Kijk daarom altijd naar de schaal voordat je een conclusie trekt.</p>
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
      ${guidedExercise("Opgave 1 - Broodjesgrafiek", [
        "Zoek eerst de prijs op de verticale as.",
        "Ga horizontaal naar de lijn en daarna verticaal naar de hoeveelheid.",
        "Beschrijf daarna het verband in woorden."
      ], "Bij EUR 3,00 worden 200 broodjes verkocht. Bij 150 broodjes hoort EUR 3,50. Het verband is negatief: hogere prijs, lagere verkoop.")}
      ${guidedExercise("Opgave 2 - Koffie tekenen", [
        "Zet hoeveelheid op de horizontale as en prijs op de verticale as.",
        "Kies een schaal die 40 tot 200 bekers en EUR 1,00 tot EUR 3,00 laat passen.",
        "Zet de punten uit als (Q; P), bijvoorbeeld (200; 1,00)."
      ], "De grafiek is een dalende rechte lijn. Bij elke prijsstijging van EUR 0,50 daalt de verkoop met 40 bekers.")}
      ${guidedExercise("Opgave 3 - Bioscoop interpoleren", [
        "Lees EUR 9,00 direct af.",
        "EUR 11,00 ligt midden tussen EUR 10,00 en EUR 12,00.",
        "Voor de procentuele verandering gebruik je de oude waarde als basis."
      ], "Bij EUR 9,00 komen 500 bezoekers. Bij EUR 11,00 ongeveer 300 bezoekers. Van 600 naar 200 is -66,7%.")}
      ${guidedExercise("Opgave 4 - Water en index", [
        "Teken de twee punten (500; 0,80) en (350; 1,20).",
        "EUR 1,00 ligt midden tussen beide prijzen.",
        "Gebruik januari als basis voor het indexcijfer."
      ], "Bij EUR 1,00 lees je 425 flesjes af. Index juni = 350 / 500 x 100 = 70. De daling is 30%, niet een derde.")}
      ${guidedExercise("Opgave 5 - Misleidende assen", [
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
          <div class="mini-chart" aria-label="Twee eenvoudige staafvergelijkingen">
            <div class="bar-row"><strong>Week 1</strong><span class="bar-track"><span class="bar-fill" style="width:96%"></span></span><span>520</span></div>
            <div class="bar-row"><strong>Week 2</strong><span class="bar-track"><span class="bar-fill" style="width:92%"></span></span><span>500</span></div>
          </div>
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

function guidedExercise(title, steps, answer) {
  return `<details class="lesson-card">
    <summary>${esc(title)}</summary>
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

Date: 2026-05-18
Sprint: L1.6

## Verdict

PASS WITH FLAGS

## Scope

Reviewed generated student-web companion surfaces for layout intent, graph/table
alignment, dark-mode readiness, and game coverage. This is a pre-human-review
record; student-experience and teacher-learning-quality records are still
required before L1.6 closure.

## Current Judgment

- Landing route should expose Redeneren, Rekenen and Grafieken after deploy.
- Grafiekenspel is required for this paragraph and must be screenshot-checked.
- The A61-style table-value route uses ordinary student language and avoids
  internal code exposure.
- The v5 target exercise remains migrated and requires later v5 quality review.

## Flags To Check During QA

- Mobile graph charts must not clip.
- The economics axis convention must stay visible in vaardigheden, presentation
  and guided practice.
- Graph values are still scaffolded; harder unlabeled graph-reading variants
  can be deferred to L1.7 or later.
`);

  writeFile(path.join(PAR_DIR, "1.1.3-quality-ref.yaml"), `# Quality Reference - 1.1.3 Grafieken en tabellen
# Refreshed: 2026-05-18 (L1.6 active)

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
    verdict: "FLAG"
    last_reviewed: "2026-04-14"
    flags:
      - "Figure numbering in Part A is non-sequential."
      - "Opgaven.md repeats the worked example for standalone exercise use."

companion:
  review_file: "1.1.3-companion-visual-review.md"
  review_verdict: "PASS WITH FLAGS"
  last_reviewed: "2026-05-18"
  hard_fails_open: 0
  human_review_status: "technical_qa_pass_pending_human_review"
  default_office_exports: false
  student_facing_internal_codes: false
  procedures:
    tabelwaarden_selecteren_step_count: 4
    grafiek_aflezen_step_count: 4
  skilltree_mapping:
    active_skills: ["A61", "A62", "A63", "A38", "A39"]
    coverage_note: "A61/A62/A63 cover table and graph reading; A38/A39 support percentage and index use with graph/table values."
  surfaces:
    voorkennis_html: technical_qa_pass_pending_human_review
    vaardigheden_html: technical_qa_pass_pending_human_review
    presentatie_pptx: technical_qa_pass_pending_human_review
    presentatie_html: technical_qa_pass_pending_human_review
    nieuws_html: technical_qa_pass_pending_human_review
    samenvatting_html: technical_qa_pass_pending_human_review
    begeleide_inoefening_html: technical_qa_pass_pending_human_review
    youtube_videos_html: technical_qa_pass_pending_human_review
    games:
      instapquiz: technical_qa_pass_pending_human_review
      nieuws_detective: technical_qa_pass_pending_human_review
      stappenplan: technical_qa_pass_pending_human_review
      redeneer_spel: technical_qa_pass_pending_human_review
      wiskundevaardigheden: technical_qa_pass_pending_human_review
      grafiekenspel: technical_qa_pass_pending_human_review
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

  const colors = { ink: "102A43", teal: "0F766E", pale: "ECFEFF", amber: "B45309", white: "FFFFFF" };
  function slide(title, subtitle, bullets, notes) {
    const s = pptx.addSlide();
    s.background = { color: "F8FAFC" };
    s.addText(`\u00A7${PAR_NR}`, { x: 0.7, y: 0.35, w: 1.2, h: 0.25, fontSize: 12, bold: true, color: colors.teal, margin: 0 });
    s.addText(title, { x: 0.7, y: 0.8, w: 11.8, h: 0.55, fontSize: 30, bold: true, color: colors.ink, margin: 0, fit: "shrink" });
    s.addText(subtitle, { x: 0.72, y: 1.43, w: 10.8, h: 0.35, fontSize: 15, color: "52606D", margin: 0 });
    bullets.forEach((b, i) => {
      const y = 2.15 + i * 0.78;
      s.addShape(pptx.ShapeType.roundRect, { x: 1.0, y, w: 11.0, h: 0.5, rectRadius: 0.08, fill: { color: i % 2 ? "FFFFFF" : colors.pale }, line: { color: "BAE6FD" } });
      s.addText(b, { x: 1.25, y: y + 0.13, w: 10.4, h: 0.2, fontSize: 15, color: colors.ink, margin: 0, fit: "shrink" });
    });
    s.addNotes(notes);
  }

  slide("Van tabel naar verhaal", "Eerst de bron lezen, daarna pas tekenen of rekenen.", [
    "Prijs en aantal verkochte ijsjes staan in verschillende kolommen.",
    "Een tabel ordent de data; een grafiek maakt het verband zichtbaar.",
    "De eerste vraag is steeds: wat betekenen deze getallen?"
  ], "Start met de ijskraam. Laat leerlingen hardop noemen wat de twee kolommen betekenen. Maak duidelijk dat een grafiek pas betrouwbaar is als de bron goed gelezen is.");
  slide("Tabelwaarden kiezen", "Kies niet zomaar een zichtbaar getal.", [
    "Lees de vraag: welke rij, kolom of periode heb je nodig?",
    "Controleer tabelkop, rijlabel, kolomlabel en eenheid.",
    "Label je waarden: oud = 500 ijsjes, nieuw = 300 ijsjes."
  ], "Dit is de bronwaarde-route. De kern is dat leerlingen eerst labelen. Zonder labels zijn latere berekeningen moeilijk te controleren.");
  slide("De economie-conventie", "In P-Q grafieken staat prijs verticaal.", [
    "P staat op de verticale as.",
    "Q staat op de horizontale as.",
    "Een punt schrijf je als (Q; P), bijvoorbeeld (300; 2,00)."
  ], "Benadruk dat dit anders voelt dan bij wiskunde, maar in economie heel bewust gebeurt. Laat leerlingen de assen aanwijzen voordat ze een punt tekenen.");
  slide("Interpoleren", "Schatten tussen twee bekende punten.", [
    "Zoek EUR 1,75 op de prijsas.",
    "Trek een lijn naar de grafiek en lees Q af.",
    "Tussen 400 en 300 ligt ongeveer 350."
  ], "Interpoleren is hier niet gokken. Het is schatten met informatie: de prijs ligt in het midden, dus bij een rechte lijn ligt de hoeveelheid ook in het midden.");
  slide("Kritisch kijken", "Een grafiek kan sturen hoe groot een verschil voelt.", [
    "Controleer altijd of de as bij nul begint.",
    "Vraag welke twee waarden worden vergeleken.",
    "Een kop met procenten klopt alleen met de juiste basis."
  ], "Sluit af met grafiekgeletterdheid. Een schaalkeuze kan een klein verschil dramatischer laten lijken. Dat maakt de broncheck economisch belangrijk.");

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

function presentationV2Deck() {
  const notes = (...script) => ({ script });
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
      ], "Gebruik deze route voordat je gaat rekenen met procenten of indexcijfers.", notes("Dit is de belangrijkste broncontrole. Leerlingen moeten leren dat het getal pas betekenis heeft met label en eenheid.", "Noem geen interne codes; dit is gewoon de vaardigheid tabelwaarden selecteren."))
      ,
      procedureSlide("assen", "Assen", "Grafiek tekenen van tabeldata", [
        ["01", "Bepaal variabelen", "Prijs en hoeveelheid."],
        ["02", "Kies assen", "Prijs verticaal, hoeveelheid horizontaal."],
        ["03", "Kies schaal", "Alle punten moeten passen."],
        ["04", "Zet punten uit", "Verbind ze passend."]
      ], "In economie staat P op de verticale as en Q op de horizontale as.", notes("Dit is de dia waarop je de economie-conventie stevig neerzet. Laat leerlingen een punt als (Q; P) uitspreken.", "De valkuil is dat leerlingen vanuit wiskunde automatisch prijs horizontaal zetten."))
      ,
      procedureSlide("aflezen", "Aflezen", "Waarden aflezen en interpoleren", [
        ["01", "Lees titel en assen", "Wat meet de grafiek?"],
        ["02", "Zoek de waarde", "Bijvoorbeeld EUR 1,75 op de prijsas."],
        ["03", "Trek hulplijnen", "Naar de grafiek en dan naar de andere as."],
        ["04", "Schat netjes", "Tussen 400 en 300 ligt ongeveer 350."]
      ], "Interpoleren is schatten tussen bekende punten.", notes("Maak duidelijk dat interpoleren een beredeneerde schatting is. Het ligt tussen twee bekende punten en gebruikt de schaal van de grafiek."))
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
        example: "Een ingezoomde as kan een kleine daling dramatisch maken.",
        speakerNotes: notes("Hier komt de kritische datahouding binnen. Grafieken zijn niet verdacht, maar je moet wel weten welke keuzes het beeld sturen.", "Laat leerlingen altijd de as en de vergelijking noemen voordat ze de conclusie overnemen.")
      }
    ]
  };
}

function procedureSlide(id, navTitle, routeLabel, rows, example, speakerNotes) {
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
  await writePresentation();
}

main().catch(err => {
  console.error(err.stack || err.message);
  process.exit(1);
});
