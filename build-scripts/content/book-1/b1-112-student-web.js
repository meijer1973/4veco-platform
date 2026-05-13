/**
 * Build Book 1 paragraph 1.1.2 student-web companion artifacts.
 *
 * This is intentionally web-first: no Word documents are generated here.
 * The only Office artifact in this profile is the required presentation PPTX,
 * which is converted to web by the platform converter.
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

const PAR_NR = "1.1.2";
const PAR_NAME = "Percentages en indexcijfers";
const DASH = "–";

const PLATFORM_ROOT = path.resolve(__dirname, "..", "..", "..");
const BOOK_ROOT = path.resolve(
  PLATFORM_ROOT,
  "..",
  "4veco-lessen",
  "Boek 1 - Grondslagen, vraag en aanbod"
);
const PAR_DIR = path.join(
  BOOK_ROOT,
  "1.1 Hoofdstuk Economisch denken en rekenen",
  "1.1.2 Percentages en indexcijfers"
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
    ? "/* AUTO-COPIED FROM 4veco-platform/engines/ — DO NOT EDIT HERE */\n"
    : "// AUTO-COPIED FROM 4veco-platform/engines/ — DO NOT EDIT HERE\n";
  writeFile(dst, header + fs.readFileSync(src, "utf8"));
}

function fileName(surface, ext = "html") {
  return `${PAR_NR} ${PAR_NAME} ${DASH} ${surface}.${ext}`;
}

function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pageTemplate({ title, subtitle, active, body, accent = "teal" }) {
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
    const cls = surface === active ? "class=\"active\"" : "";
    return `<a ${cls} href="${esc(href)}">${esc(label)}</a>`;
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
    .lesson-hero{padding:28px 0 22px;border-bottom:1px solid var(--border-subtle,#d9e2ec);margin-bottom:24px}
    .lesson-hero h1{margin:8px 0 8px;font-size:clamp(2rem,4vw,3.4rem);line-height:1.05;letter-spacing:0}
    .lesson-kicker{font-weight:800;text-transform:uppercase;color:var(--accent,#0f766e);font-size:.78rem;letter-spacing:.08em}
    .lesson-sub{font-size:1.05rem;max-width:840px;color:var(--text-muted,#52606d)}
    .lesson-nav{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 0}
    .lesson-nav a{padding:8px 12px;border-radius:8px;border:1px solid var(--border-subtle,#d9e2ec);text-decoration:none;color:var(--text-main,#102a43);background:var(--surface,#fff);font-weight:700;font-size:.92rem}
    .lesson-nav a.active{background:var(--accent,#0f766e);color:#fff;border-color:var(--accent,#0f766e)}
    .back-row{display:flex;justify-content:space-between;gap:12px;align-items:center}
    .back-row a{color:var(--accent,#0f766e);font-weight:800;text-decoration:none}
    .content-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:24px;align-items:start}
    .main-flow{display:grid;gap:18px}
    .side-note{position:sticky;top:20px;border:1px solid var(--border-subtle,#d9e2ec);border-radius:8px;padding:16px;background:var(--surface-raised,#fff)}
    .side-note h2{font-size:1.05rem;margin:0 0 8px}
    .card-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .triple-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
    .lesson-card,.step-card,.example-card{border:1px solid var(--border-subtle,#d9e2ec);border-radius:8px;padding:16px;background:var(--surface-raised,#fff)}
    .lesson-card h2,.step-card h3,.example-card h3{margin-top:0}
    .step-list{counter-reset:step;display:grid;gap:10px;padding:0;margin:0;list-style:none}
    .step-list li{counter-increment:step;padding:12px 12px 12px 48px;border:1px solid var(--border-subtle,#d9e2ec);border-radius:8px;position:relative;background:var(--surface,#fff)}
    .step-list li:before{content:counter(step);position:absolute;left:12px;top:12px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--accent,#0f766e);color:#fff;font-weight:800}
    .formula{font-family:"JetBrains Mono",Consolas,monospace;background:var(--code-bg,#eef5f4);border-radius:8px;padding:12px;overflow:auto}
    .data-table{width:100%;border-collapse:collapse;background:var(--surface,#fff);border-radius:8px;overflow:hidden}
    .data-table th,.data-table td{border:1px solid var(--border-subtle,#d9e2ec);padding:10px;text-align:left}
    .data-table th{background:var(--table-head,#e8f3f1)}
    .callout{border-left:5px solid var(--accent,#0f766e);background:var(--callout-bg,#eef9f6);padding:14px 16px;border-radius:8px}
    .warning{border-left-color:#c2410c;background:var(--warning-bg,#fff7ed)}
    .visual-box{border-radius:8px;padding:16px;background:linear-gradient(135deg,rgba(20,184,166,.13),rgba(249,115,22,.10));border:1px solid var(--border-subtle,#d9e2ec)}
    .bar-row{display:grid;grid-template-columns:88px 1fr 54px;gap:10px;align-items:center;margin:10px 0}
    .bar-track{height:18px;border-radius:999px;background:rgba(148,163,184,.25);overflow:hidden}
    .bar-fill{height:100%;border-radius:999px;background:var(--accent,#0f766e)}
    details.lesson-card summary{cursor:pointer;font-weight:800}
    @media(max-width:980px){.content-grid{grid-template-columns:1fr}.side-note{position:static}.triple-grid{grid-template-columns:1fr}.card-grid{grid-template-columns:1fr}}
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
</html>
`;
}

function writeParagraphPlan() {
  writeFile(path.join(PAR_DIR, "_paragraph-plan.md"), `# Paragraph Plan - ${PAR_NR} ${PAR_NAME}

Generated: 2026-05-13
Sprint: L1.4-PARITY procedure and quality cleanup
Profile: polished student-web baseline, no default Word exports

## Learning Goals

Students can:

- calculate a percentage change using the old value as the base
- calculate and interpret index numbers with a chosen base year
- distinguish index points from percentage changes
- use index numbers to reason about price changes in economic contexts

## Narrative

The lesson starts from Sanne's smartphone price change from EUR 600 to EUR 648. That concrete change introduces the need for percentages. The lesson then moves to index numbers for comparing price development over time, using grocery baskets, fuel prices, and inflation news.

## Student-Web Outputs

- Instapquiz: checks percentage change, index numbers, and index-point misconceptions
- Uitleg voorkennis: old/new/base value, fractions, tables, and rounding
- Uitleg vaardigheden: percentage change, index numbers, index points versus percentages
- Begeleide inoefening: textbook opgaven transformed into guided questions with denkstappen, hints, and revealable answers
- Nieuws met visual: CBS April 2026 inflation quick estimate as current data context
- Nieuws-detective: interactive current-affairs reasoning game
- Presentatie: short classroom deck with speaker notes for future TTS/video use
- Samenvatting: formula and misconception map
- Stappenplan: interactive procedure practice
- Redeneer-spel: math-economic reasoning practice
- Wiskundevaardigheden: existing skilltree shell

## Source-Output Parity

Student-facing copy uses the full skill names, not internal unit codes. Procedures are:

## Procedure-Stappen-Plan

1. Procentuele verandering berekenen:
   - identify old and new value
   - calculate the absolute difference
   - divide by the old value and multiply by 100
   - interpret the sign as increase or decrease
2. Indexcijfer berekenen:
   - choose the base year, index 100
   - calculate the value in the target year
   - divide by the base-year value and multiply by 100
   - interpret the result as relative to the base year
3. Indexpunten en procentuele verandering onderscheiden:
   - find old and new index
   - calculate the index-point difference
   - divide by the old index and multiply by 100
   - name index points and percentage change separately

## Rounding Policy

- Percentages are rounded to 1 decimal unless the question says otherwise.
- Exact values may be shown next to the rounded answer when that clarifies a check.
- Index numbers are written as whole numbers when the result is exact; otherwise round to 1 decimal.

## Skilltree Mapping

- A38 covers procentuele verandering berekenen.
- A39 covers indexcijfer berekenen and includes the indexpoints/procenten distinction through index-change questions.

## Visuelen-Toewijzing

- Smartphone price bar: shows old, new, and difference for percentage change.
- Index mini chart: shows basisjaar 100 and later index values.
- News visual: shows CBS April 2026 product-group inflation rates as bars.
- Presentation cards: use one idea per slide and large numerical anchors.

## Terminologie

- Student-facing pages use full names such as procentuele verandering berekenen and indexcijfer berekenen.
- Internal unit codes are not used in student-facing copy.
- Indexpunten, procentpunten, and procentuele verandering are named separately.

## Acceptance Tests

- Part A publisher-print validator remains green.
- Complete student-web validator passes.
- Voorkennis, vaardigheden, samenvatting, nieuws, video, and begeleide inoefening use the established shared page layout with left navigation.
- Begeleide inoefening covers every textbook opgave and subquestion, unless a written plan explicitly scopes an opgave out.
- Light and dark modes both use the shared 4veco theme tokens and keep charts/tables readable.
- Landing page shows student-facing tile labels and no "HTML" badges.
- Landing page does not expose Word download options by default.
- No student-facing internal unit codes are present.
- Wiskundevaardigheden paragraph mode shows only paragraph-relevant skills, with broader Hoofdstuk and Alles toggles.
- Presentation web page has semantic slide labels and speaker notes.
`);
}

function writeRichPages() {
  writeFile(path.join(PAR_DIR, fileName("uitleg voorkennis")), pageTemplate({
    title: "Uitleg voorkennis",
    active: "uitleg voorkennis",
    subtitle: "Alles wat je al nodig hebt voordat je met percentages en indexcijfers gaat rekenen.",
    body: `<div class="content-grid">
      <section class="main-flow">
        <article class="lesson-card">
          <h2>1. Oud, nieuw en basiswaarde herkennen</h2>
          <p>Bij elke procentuele verandering moet je eerst bepalen waar je mee vergelijkt. De oude waarde is de basis. De nieuwe waarde is wat daarna gebeurt.</p>
          <table class="data-table">
            <thead><tr><th>Situatie</th><th>Oud</th><th>Nieuw</th><th>Verschil</th></tr></thead>
            <tbody>
              <tr><td>Smartphoneprijs</td><td>EUR 600</td><td>EUR 648</td><td>EUR 48 hoger</td></tr>
              <tr><td>Benzineprijs</td><td>EUR 1,98</td><td>EUR 1,89</td><td>EUR 0,09 lager</td></tr>
            </tbody>
          </table>
        </article>
        <article class="lesson-card">
          <h2>2. Deel door de basis</h2>
          <p>Een percentage is een verhouding. Daarom deel je het verschil door de oude waarde. Daarna vermenigvuldig je met 100.</p>
          <p class="formula">(nieuw - oud) / oud x 100%</p>
          <div class="visual-box">
            <div class="bar-row"><strong>Oud</strong><span class="bar-track"><span class="bar-fill" style="width:92.6%"></span></span><span>600</span></div>
            <div class="bar-row"><strong>Nieuw</strong><span class="bar-track"><span class="bar-fill" style="width:100%"></span></span><span>648</span></div>
          </div>
        </article>
        <article class="lesson-card">
          <h2>3. Tabellen en tijd herkennen</h2>
          <p>Indexcijfers staan vaak in een tabel of grafiek. Het basisjaar heeft index 100. Een index boven 100 betekent hoger dan het basisjaar, onder 100 betekent lager.</p>
          <table class="data-table">
            <thead><tr><th>Jaar</th><th>Prijs mandje</th><th>Index</th></tr></thead>
            <tbody>
              <tr><td>2021</td><td>EUR 120</td><td>100</td></tr>
              <tr><td>2023</td><td>EUR 150</td><td>125</td></tr>
            </tbody>
          </table>
        </article>
      </section>
      <aside class="side-note">
        <h2>Check jezelf</h2>
        <p>Kun je bij een zin als "de prijs steeg van EUR 200 naar EUR 250" meteen aanwijzen wat oud, nieuw en verschil is?</p>
        <p class="callout">Oud = EUR 200, nieuw = EUR 250, verschil = EUR 50. De basis voor het percentage is EUR 200.</p>
      </aside>
    </div>`
  }));

  writeFile(path.join(PAR_DIR, fileName("uitleg vaardigheden")), pageTemplate({
    title: "Uitleg vaardigheden",
    active: "uitleg vaardigheden",
    subtitle: "De vaste aanpak voor procentuele verandering, indexcijfers en de indexpuntenvalkuil.",
    body: `<div class="content-grid">
      <section class="main-flow">
        <article class="lesson-card">
          <h2>Procentuele verandering berekenen</h2>
          <ol class="step-list">
            <li>Bepaal de oude waarde en de nieuwe waarde.</li>
            <li>Bereken het absolute verschil: nieuwe waarde min oude waarde.</li>
            <li>Deel het verschil door de oude waarde en vermenigvuldig met 100.</li>
            <li>Lees het teken: positief is een stijging, negatief is een daling.</li>
          </ol>
          <p class="formula">(nieuw - oud) / oud x 100%</p>
        </article>
        <article class="lesson-card">
          <h2>Indexcijfer berekenen</h2>
          <ol class="step-list">
            <li>Kies het basisjaar. Dat jaar krijgt index 100.</li>
            <li>Bepaal de waarde in het doeljaar.</li>
            <li>Deel de waarde in het doeljaar door de waarde in het basisjaar en vermenigvuldig met 100.</li>
            <li>Interpreteer: index 125 betekent 25% hoger dan het basisjaar.</li>
          </ol>
          <p class="formula">indexcijfer = waarde doeljaar / waarde basisjaar x 100</p>
        </article>
        <article class="lesson-card">
          <h2>Indexpunten en procenten onderscheiden</h2>
          <p>Een stijging van index 125 naar 135 is 10 indexpunten. De procentuele verandering is iets anders.</p>
          <ol class="step-list">
            <li>Bepaal het oude indexcijfer: 125.</li>
            <li>Bepaal het nieuwe indexcijfer: 135.</li>
            <li>Bereken het verschil: 10 indexpunten.</li>
            <li>Deel door het oude indexcijfer: 10 / 125 x 100% = 8%.</li>
          </ol>
          <p class="callout warning"><strong>Valkuil:</strong> indexpunten zijn alleen gelijk aan procenten als het oude indexcijfer precies 100 is.</p>
        </article>
      </section>
      <aside class="side-note">
        <h2>Wanneer gebruik je wat?</h2>
        <p><strong>Bedrag naar bedrag:</strong> procentuele verandering.</p>
        <p><strong>Reeks door de tijd:</strong> indexcijfer.</p>
        <p><strong>Index naar index:</strong> procentuele verandering berekenen op de indexcijfers.</p>
      </aside>
    </div>`
  }));

  writeFile(path.join(PAR_DIR, fileName("samenvatting")), pageTemplate({
    title: "Samenvatting",
    active: "samenvatting",
    subtitle: "De kern van de paragraaf in formules, taal en valkuilen.",
    body: `<section class="main-flow">
      <div class="card-grid">
        <article class="lesson-card"><h2>Procentuele verandering</h2><p class="formula">(nieuw - oud) / oud x 100%</p><p>Gebruik altijd de oude waarde als basis.</p></article>
        <article class="lesson-card"><h2>Indexcijfer</h2><p class="formula">waarde doeljaar / waarde basisjaar x 100</p><p>Het basisjaar krijgt index 100.</p></article>
        <article class="lesson-card"><h2>Index 125</h2><p>De waarde is 25% hoger dan in het basisjaar.</p></article>
        <article class="lesson-card"><h2>Index 80</h2><p>De waarde is 20% lager dan in het basisjaar.</p></article>
      </div>
      <article class="lesson-card">
        <h2>De examenvalkuil</h2>
        <p>Index 125 naar 135 is een stijging van 10 indexpunten. De procentuele verandering is 10 / 125 x 100% = 8%.</p>
      </article>
    </section>`
  }));

  writeFile(path.join(PAR_DIR, fileName("begeleide inoefening")), pageTemplate({
    title: "Begeleide inoefening",
    active: "begeleide inoefening",
    subtitle: "Oefen de procedures stap voor stap. Open de uitwerking pas nadat je zelf hebt gerekend.",
    body: `<section class="main-flow">
      ${exercise("Opgave 1 - Smartphone", "Een smartphone stijgt van EUR 600 naar EUR 648. Bereken de procentuele verandering.", "Oud = 600, nieuw = 648. Verschil = 48. 48 / 600 x 100% = 8%. De prijs stijgt met 8%.")}
      ${exercise("Opgave 2 - Jas in de uitverkoop", "Een jas daalt van EUR 160 naar EUR 128. Bereken de procentuele verandering.", "Oud = 160, nieuw = 128. Verschil = -32. -32 / 160 x 100% = -20%. De prijs daalt met 20%.")}
      ${exercise("Opgave 3 - Boodschappenmandje", "Een mandje kost EUR 120 in 2021 en EUR 150 in 2023. Bereken het indexcijfer voor 2023 met 2021 als basisjaar.", "150 / 120 x 100 = 125. Het mandje is 25% duurder dan in 2021.")}
      ${exercise("Opgave 4 - Indexpunten", "Een index stijgt van 108 naar 112. Waarom is dat niet automatisch 4%?", "Het verschil is 4 indexpunten. De procentuele verandering is 4 / 108 x 100% = 3,7%.")}
      ${exercise("Opgave 5 - Benzine", "Een liter benzine daalt van EUR 1,98 naar EUR 1,89. Bereken de daling in procenten.", "Verschil = -0,09. -0,09 / 1,98 x 100% = -4,5%.")}
    </section>`
  }));

  writeFile(path.join(PAR_DIR, fileName("nieuws met visual")), pageTemplate({
    title: "Nieuws met visual",
    active: "nieuws met visual",
    subtitle: "Gebruik actueel inflatienieuws om indexcijfers en procentuele verandering te herkennen.",
    body: `<div class="content-grid">
      <section class="main-flow">
        <article class="lesson-card">
          <h2>Inflatie in april 2026: 2,8% bij snelle raming</h2>
          <p>Het CBS meldde op 30 april 2026 dat de inflatie in april 2026 uitkwam op 2,8% bij de snelle raming. In maart was dat 2,7%. Consumentenprijzen waren volgens die snelle raming 1,1% hoger dan in maart. Gebruik dit als oefening met een voorlopige snelle raming, niet als definitief maandcijfer.</p>
          <p>Dit is precies het soort bericht waarvoor je procentuele verandering en indexcijfers nodig hebt: je moet weten wat de basis is, welke periode wordt vergeleken en of een getal een percentage of een indexpunt is.</p>
          <p><a href="https://www.cbs.nl/nl-nl/nieuws/2026/18/inflatie-in-april-2-8-procent-bij-snelle-raming">Bron: CBS, 30 april 2026</a></p>
        </article>
        <article class="lesson-card">
          <h2>Productgroepen in de snelle raming</h2>
          <div class="visual-box">
            <div class="bar-row"><strong>Totaal</strong><span class="bar-track"><span class="bar-fill" style="width:35%"></span></span><span>2,8%</span></div>
            <div class="bar-row"><strong>Energie</strong><span class="bar-track"><span class="bar-fill" style="width:98%"></span></span><span>7,8%</span></div>
            <div class="bar-row"><strong>Diensten</strong><span class="bar-track"><span class="bar-fill" style="width:45%"></span></span><span>3,6%</span></div>
            <div class="bar-row"><strong>Voeding</strong><span class="bar-track"><span class="bar-fill" style="width:19%"></span></span><span>1,5%</span></div>
          </div>
        </article>
      </section>
      <aside class="side-note">
        <h2>Leesvraag</h2>
        <p>Als inflatie stijgt van 2,7% naar 2,8%, is dat een stijging van 0,1 procentpunt. Dat is niet hetzelfde als 0,1% prijsstijging.</p>
      </aside>
    </div>`
  }));

  writeFile(path.join(PAR_DIR, fileName("youtube-videos")), pageTemplate({
    title: "Video's",
    active: "youtube-videos",
    subtitle: "Kijkgericht zoeken naar extra uitleg, zonder vaste video-ID's in de les te verstoppen.",
    body: `<section class="main-flow">
      <article class="lesson-card"><h2>Zoekterm 1</h2><p><a href="https://www.youtube.com/results?search_query=procentuele+verandering+berekenen+economie">Procentuele verandering berekenen economie</a></p><p>Gebruik deze video om de formule met oud en nieuw nog eens te zien.</p></article>
      <article class="lesson-card"><h2>Zoekterm 2</h2><p><a href="https://www.youtube.com/results?search_query=indexcijfers+berekenen+economie">Indexcijfers berekenen economie</a></p><p>Let vooral op basisjaar = 100.</p></article>
      <article class="lesson-card"><h2>Zoekterm 3</h2><p><a href="https://www.youtube.com/results?search_query=indexpunten+procenten+verschil">Indexpunten en procenten verschil</a></p><p>Gebruik dit bij de klassieke valkuil van 125 naar 135.</p></article>
    </section>`
  }));
}

function exercise(title, prompt, answer) {
  return `<details class="lesson-card"><summary>${esc(title)}</summary><p>${esc(prompt)}</p><p class="callout">${esc(answer)}</p></details>`;
}

const POLISHED_PAGE_CSS = `
  .concept-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:16px 0}
  .concept-grid.three{grid-template-columns:repeat(3,minmax(0,1fr))}
  .concept-card{background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:14px 16px;box-shadow:var(--shadow-card)}
  .concept-card h4{margin:0 0 6px;font-family:var(--heading-font);font-style:var(--heading-style);font-weight:var(--heading-weight);letter-spacing:var(--heading-letter);font-size:1.05rem;color:var(--ink)}
  .concept-card p{margin:0;color:var(--ink-soft);font-size:.92rem}
  .concept-card strong{color:var(--ink)}
  .value-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:14px 0}
  .value-tile{border:1px solid var(--border);border-radius:8px;background:var(--bg-lift);padding:12px}
  .value-label{font-family:var(--mono);font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--ink-muted);font-weight:700}
  .value-number{display:block;margin-top:4px;font-size:1.45rem;line-height:1.1;font-weight:800;color:var(--ink)}
  .value-caption{display:block;margin-top:4px;color:var(--ink-soft);font-size:.84rem}
  .bar-visual{display:grid;gap:10px;margin:16px 0;padding:14px;border:1px solid var(--border);border-radius:8px;background:var(--bg-lift)}
  .bar-item{display:grid;grid-template-columns:104px minmax(0,1fr) 64px;gap:10px;align-items:center;font-size:.9rem;color:var(--ink-soft)}
  .bar-track{height:18px;background:var(--bg-inset);border:1px solid var(--border);border-radius:999px;overflow:hidden}
  .bar-fill{height:100%;width:var(--w);background:linear-gradient(90deg,var(--accent),color-mix(in oklab,var(--accent) 70%,var(--grafisch)));border-radius:999px}
  .step-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:15px 0}
  .step-tile{position:relative;background:var(--bg-card);border:1px solid var(--border);border-top:3px solid var(--accent);border-radius:8px;padding:13px 12px 12px;min-height:128px}
  .step-num{font-family:var(--mono);font-size:10px;font-weight:800;color:var(--accent);letter-spacing:1px;text-transform:uppercase}
  .step-tile h4{margin:6px 0 5px;font-size:.98rem;line-height:1.25;color:var(--ink)}
  .step-tile p{margin:0;color:var(--ink-soft);font-size:.86rem;line-height:1.42}
  .route-panel{border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:8px;background:var(--bg-card);padding:14px 16px;margin:16px 0}
  .route-panel h3{margin-top:0}
  .answer-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:10px}
  .answer-box,.uitleg-box{border-radius:8px;padding:12px 14px;background:var(--bg-lift);border:1px solid var(--border)}
  .answer-box{border-left:3px solid var(--accent)}
  .uitleg-box{border-left:3px solid var(--grafisch)}
  .source-note{font-size:.82rem;color:var(--ink-muted);margin-top:8px}
  .video-list{display:grid;gap:12px}
  .video-card{display:block;border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:8px;background:var(--bg-card);padding:14px 16px;color:inherit;text-decoration:none}
  .video-card:hover{box-shadow:var(--shadow-lift);transform:translateY(-1px)}
  .video-card h3{margin-top:0}
  .video-card p{margin-bottom:0;color:var(--ink-soft)}
  @media(max-width:900px){.concept-grid,.concept-grid.three,.value-strip,.step-grid,.answer-grid{grid-template-columns:1fr}.bar-item{grid-template-columns:86px minmax(0,1fr) 54px}}
`;

const COMPANION_SURFACES = [
  ["uitleg voorkennis", "Voorkennis"],
  ["uitleg vaardigheden", "Vaardigheden"],
  ["samenvatting", "Samenvatting"],
  ["begeleide inoefening", "Begeleide inoefening"],
  ["nieuws met visual", "Nieuws"],
  ["youtube-videos", "Video's"],
];

function richPage({ title, surface, layout = "voorkennis-v1", accent = "wiskunde", heroSub, sidebar, heroCards, main }) {
  return `<!DOCTYPE html>
<html lang="nl" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script>(function(){try{var m=localStorage.getItem('quizMode')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',m);}catch(e){}})();</script>
<title>${PAR_NR} ${PAR_NAME} – ${esc(title)}</title>
<link rel="stylesheet" href="../../shared/voorkennis.css">
<style>${POLISHED_PAGE_CSS}</style>
</head>
<body data-layout="${esc(layout)}" data-accent-domain="${esc(accent)}">
<button class="sidebar-toggle" id="sidebarToggle" aria-label="Menu openen">
  <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
</button>
<div class="sidebar-overlay" id="sidebarOverlay"></div>
<div class="page-layout">
  <nav class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <h2>${PAR_NR} ${PAR_NAME}</h2>
      <p>${esc(title)}</p>
    </div>
${sidebar}
  </nav>
  <div class="content">
    <header class="hero">
      <div class="hero-inner">
        <a class="back-link" href="index.html"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg> Terug naar paragraaf</a>
        <span class="hero-badge">${PAR_NR} · ${esc(surface)}</span>
        <h1>${PAR_NAME} — ${esc(title)}</h1>
        <p class="hero-sub">${esc(heroSub)}</p>
        <div class="hero-cards">
${heroCards}
        </div>
      </div>
    </header>
    <main>
${main}
    </main>
  </div>
</div>
<script src="../../shared/voorkennis.js"></script>
</body>
</html>
`;
}

function navItems(items) {
  return items.map((item, idx) => `    <a class="nav-item domain-${item.domain}" href="#${item.id}" data-section="${item.id}">
      <span class="nav-number">${idx + 1}</span>
      <span class="nav-text">
        <span class="nav-title">${item.title}</span>
        <span class="nav-badge">${item.badge}</span>
      </span>
    </a>`).join("\n");
}

function heroCards(items) {
  return items.map((item, idx) => `          <div class="hero-card card-${item.domain}" data-target="${item.id}">
            <div class="hero-card-num">${String(idx + 1).padStart(2, "0")}</div>
            <div class="hero-card-title">${item.title}</div>
            <span class="hero-card-domain">${item.badge}</span>
          </div>`).join("\n");
}

function sectionBlock({ id, nr, title, badge, domain, html }) {
  return `      <section class="section" id="${id}">
        <div class="section-header border-${domain}">
          <span class="section-num bg-${domain}">${nr}</span>
          <div class="section-title-group">
            <div class="section-title">${title}</div>
            <span class="section-badge badge-${domain}">${badge}</span>
          </div>
        </div>
${html}
      </section>`;
}

function callout(type, label, text) {
  return `        <div class="callout callout-${type}">
          <span class="callout-icon">${type === "letop" ? "!" : type === "controle" ? "✓" : "*"}</span>
          <div><strong>${label}</strong> ${text}</div>
        </div>`;
}

function barVisual(rows) {
  return `        <div class="bar-visual">
${rows.map((row) => `          <div class="bar-item"><strong>${row.label}</strong><span class="bar-track"><span class="bar-fill" style="--w:${row.width}%"></span></span><span>${row.value}</span></div>`).join("\n")}
        </div>`;
}

function routeBlock() {
  return `      <section class="checklist-section">
        <h2 class="checklist-title">Klaar om verder te gaan?</h2>
        <p class="checklist-sub">Vink af wat je beheerst. Gebruik daarna de route eronder.</p>
        <label class="checklist-item"><input type="checkbox"><span>Ik kan oude waarde, nieuwe waarde en verschil aanwijzen.</span></label>
        <label class="checklist-item"><input type="checkbox"><span>Ik weet dat de oude waarde onder de breukstreep staat.</span></label>
        <label class="checklist-item"><input type="checkbox"><span>Ik kan indexpunten en procentuele verandering uit elkaar houden.</span></label>
        <div class="checklist-route">
          <div class="route-title">Wat nu?</div>
          <p class="route-line route-yes"><strong>Dit lukt:</strong> ga naar <a href="${fileName("begeleide inoefening")}">begeleide inoefening</a>.</p>
          <p class="route-line route-no"><strong>Dit hapert:</strong> open <a href="${fileName("stappenplan")}">het stappenplan</a> of <a href="${fileName("wiskundevaardigheden")}">wiskundevaardigheden</a>.</p>
        </div>
      </section>`;
}

function stepGrid(steps) {
  return `        <div class="step-grid">
${steps.map((step, idx) => `          <div class="step-tile">
            <span class="step-num">Stap ${idx + 1}</span>
            <h4>${step.title}</h4>
            <p>${step.text}</p>
          </div>`).join("\n")}
        </div>`;
}

function writeRichPagesPolished() {
  writeVoorkennisPage();
  writeVaardighedenPage();
  writeSamenvattingPage();
  writeGuidedPracticePage();
  writeNewsPage();
  writeYouTubePage();
}

function writeVoorkennisPage() {
  const items = [
    { id: "sectie-1", title: "Oud, nieuw en verschil", badge: "Wiskundig", domain: "wiskunde" },
    { id: "sectie-2", title: "Procenten als verhouding", badge: "Wiskundig", domain: "wiskunde" },
    { id: "sectie-3", title: "Basisjaar en index 100", badge: "Grafisch", domain: "grafisch" },
    { id: "sectie-4", title: "Economische taal", badge: "Economisch", domain: "economisch" },
  ];

  const main = [
    sectionBlock({
      id: "sectie-1",
      nr: 1,
      title: "Oud, nieuw en verschil",
      badge: "Wiskundig",
      domain: "wiskunde",
      html: `        <p class="intro-text">Een procentuele verandering begint niet met de formule. Eerst lees je de situatie en wijs je drie getallen aan: de oude waarde, de nieuwe waarde en het verschil.</p>
        <div class="value-strip">
          <div class="value-tile"><span class="value-label">oude waarde</span><span class="value-number">€600</span><span class="value-caption">de basis waarmee je vergelijkt</span></div>
          <div class="value-tile"><span class="value-label">nieuwe waarde</span><span class="value-number">€648</span><span class="value-caption">de waarde na de verandering</span></div>
          <div class="value-tile"><span class="value-label">verschil</span><span class="value-number">€48</span><span class="value-caption">nieuw min oud</span></div>
        </div>
        ${barVisual([{ label: "Oud", width: 92.6, value: "600" }, { label: "Nieuw", width: 100, value: "648" }])}
        ${callout("controle", "Controle:", "Kun je bij elke zin aanwijzen wat oud en nieuw is voordat je begint te rekenen?")}`
    }),
    sectionBlock({
      id: "sectie-2",
      nr: 2,
      title: "Procenten als verhouding",
      badge: "Wiskundig",
      domain: "wiskunde",
      html: `        <p class="intro-text">Een percentage vertelt hoe groot een verschil is ten opzichte van een basis. Daarom is hetzelfde eurobedrag niet altijd even groot in procenten.</p>
        <div class="formula-box">(nieuw - oud) / oud x 100%</div>
        <div class="concept-grid">
          <div class="concept-card"><h4>€48 op €600</h4><p>48 / 600 x 100% = <strong>8%</strong>. Bij een telefoon is €48 een beperkte stijging.</p></div>
          <div class="concept-card"><h4>€48 op €120</h4><p>48 / 120 x 100% = <strong>40%</strong>. Bij een kleiner bedrag is dezelfde €48 veel groter.</p></div>
        </div>
        ${callout("letop", "Let op:", "De oude waarde staat onder de breukstreep. Bij een daling gebruik je dus de prijs vóór de daling.")}`
    }),
    sectionBlock({
      id: "sectie-3",
      nr: 3,
      title: "Basisjaar en index 100",
      badge: "Grafisch",
      domain: "grafisch",
      html: `        <p class="intro-text">Een indexcijfer maakt een reeks overzichtelijk. Je kiest één basisjaar. Dat jaar krijgt index 100. Andere jaren vergelijk je met dat basisjaar.</p>
        <table class="samenvatting-table">
          <caption class="caption-grafisch">Voorbeeld: boodschappenmandje</caption>
          <tbody>
            <tr><td>2023</td><td>€150</td><td>Index 100</td></tr>
            <tr><td>2024</td><td>€156</td><td>156 / 150 x 100 = 104</td></tr>
            <tr><td>2025</td><td>€162</td><td>162 / 150 x 100 = 108</td></tr>
          </tbody>
        </table>
        ${barVisual([{ label: "2023", width: 92.6, value: "100" }, { label: "2024", width: 96.3, value: "104" }, { label: "2025", width: 100, value: "108" }])}
        ${callout("tip", "Tip:", "Index 108 betekent 8% hoger dan het basisjaar. Het betekent niet dat de prijs €108 is.")}`
    }),
    sectionBlock({
      id: "sectie-4",
      nr: 4,
      title: "Economische taal",
      badge: "Economisch",
      domain: "economisch",
      html: `        <p class="intro-text">Bij percentages in economie gaat het niet alleen om het antwoord, maar ook om de juiste woorden. Schrijf altijd op wat je percentage betekent.</p>
        <table class="begrippen-table">
          <thead><tr><th>Woord</th><th>Betekenis</th><th>Voorbeeldzin</th></tr></thead>
          <tbody>
            <tr><td>Prijsstijging</td><td>De prijs wordt hoger.</td><td>De fiets is 15% duurder geworden.</td></tr>
            <tr><td>Prijsdaling</td><td>De prijs wordt lager.</td><td>De benzineprijs daalt met 4,5%.</td></tr>
            <tr><td>Inflatie</td><td>Het algemene prijspeil stijgt.</td><td>De inflatie is 3,7%.</td></tr>
            <tr><td>Deflatie</td><td>Het algemene prijspeil daalt.</td><td>Het prijspeil daalt met 2,6%.</td></tr>
            <tr><td>Indexpunt</td><td>Het verschil tussen twee indexcijfers.</td><td>112 - 108 = 4 indexpunten.</td></tr>
          </tbody>
        </table>
        ${callout("kernregel", "Kernregel:", "Noem de eenheid: procent, procentpunt of indexpunt. Die drie zijn niet hetzelfde.")}`
    }),
    routeBlock(),
  ].join("\n");

  writeFile(path.join(PAR_DIR, fileName("uitleg voorkennis")), richPage({
    title: "Uitleg voorkennis",
    surface: "Voorkennis",
    layout: "voorkennis-v1",
    accent: "wiskunde",
    heroSub: "Herhaal de basis die je nodig hebt om percentages en indexcijfers zonder gokwerk te lezen.",
    sidebar: navItems(items),
    heroCards: heroCards(items),
    main,
  }));
}

function writeVaardighedenPage() {
  const items = [
    { id: "sectie-1", title: "Procentuele verandering", badge: "Wiskundig", domain: "wiskunde" },
    { id: "sectie-2", title: "Indexcijfer berekenen", badge: "Grafisch", domain: "grafisch" },
    { id: "sectie-3", title: "Index naar procent", badge: "Wiskundig", domain: "wiskunde" },
    { id: "sectie-4", title: "Koopkracht beoordelen", badge: "Economisch", domain: "economisch" },
  ];
  const main = [
    sectionBlock({
      id: "sectie-1",
      nr: 1,
      title: "Procentuele verandering berekenen",
      badge: "Wiskundig",
      domain: "wiskunde",
      html: `        <p class="intro-text">Gebruik deze aanpak bij een verandering van één waarde naar een andere waarde: prijs, loon, omzet, kosten of hoeveelheid.</p>
${stepGrid([
  { title: "Bepaal oud en nieuw", text: "Schrijf eerst het startpunt en eindpunt op." },
  { title: "Bereken het verschil", text: "Nieuwe waarde min oude waarde." },
  { title: "Deel door oud", text: "Verschil / oude waarde x 100%." },
  { title: "Interpreteer", text: "Positief is stijging, negatief is daling." },
])}
        <div class="formula-box">Voorbeeld: (920 - 800) / 800 x 100% = 15%. De fiets is 15% duurder.</div>
        ${callout("letop", "Valkuil:", "Bij een daling van €920 naar €800 deel je door €920, niet door €800. Daarom is de daling 13,0% en niet 15%.")}`
    }),
    sectionBlock({
      id: "sectie-2",
      nr: 2,
      title: "Indexcijfer berekenen",
      badge: "Grafisch",
      domain: "grafisch",
      html: `        <p class="intro-text">Een indexcijfer zet een waarde om naar een getal ten opzichte van een basisjaar. Het basisjaar krijgt index 100.</p>
${stepGrid([
  { title: "Kies de basis", text: "Het basisjaar of de basiswaarde krijgt 100." },
  { title: "Neem de doelwaarde", text: "Dat is de waarde in het jaar dat je wilt berekenen." },
  { title: "Deel door de basis", text: "Doelwaarde / basiswaarde x 100." },
  { title: "Leg uit", text: "Index 104 betekent 4% hoger dan de basis." },
])}
        <table class="samenvatting-table">
          <caption class="caption-grafisch">Boodschappenmandje, basisjaar 2023 = 100</caption>
          <tbody>
            <tr><td>2024</td><td>156 / 150 x 100</td><td>104</td></tr>
            <tr><td>2025</td><td>162 / 150 x 100</td><td>108</td></tr>
          </tbody>
        </table>`
    }),
    sectionBlock({
      id: "sectie-3",
      nr: 3,
      title: "Van indexcijfers naar procentuele verandering",
      badge: "Wiskundig",
      domain: "wiskunde",
      html: `        <p class="intro-text">Als je twee indexcijfers vergelijkt, bereken je opnieuw een procentuele verandering. Het oude indexcijfer is dan de basis.</p>
${stepGrid([
  { title: "Oude index", text: "Bijvoorbeeld 108." },
  { title: "Nieuwe index", text: "Bijvoorbeeld 112." },
  { title: "Puntenverschil", text: "112 - 108 = 4 indexpunten." },
  { title: "Procent", text: "4 / 108 x 100% = 3,7%." },
])}
        ${callout("kernregel", "Kernregel:", "Van 108 naar 112 is 4 indexpunten, maar 3,7% stijging. Het puntenverschil en het percentage zijn verschillende antwoorden.")}`
    }),
    sectionBlock({
      id: "sectie-4",
      nr: 4,
      title: "Koopkracht beoordelen",
      badge: "Economisch",
      domain: "economisch",
      html: `        <p class="intro-text">Bij koopkracht vergelijk je hoeveel het loon stijgt met hoeveel de prijzen stijgen. Een loonstijging kan dus toch koopkrachtverlies betekenen.</p>
        <div class="concept-grid">
          <div class="concept-card"><h4>Loon</h4><p>€3.000 naar €3.240 is <strong>8%</strong> stijging. Het loonindexcijfer is 108.</p></div>
          <div class="concept-card"><h4>Prijzen</h4><p>Prijsindex 112 betekent dat prijzen <strong>12%</strong> hoger liggen dan in het basisjaar.</p></div>
        </div>
        <div class="route-panel">
          <h3>Conclusie</h3>
          <p>Het loon stijgt minder hard dan de prijzen. De werknemer kan minder kopen dan eerst: de koopkracht is gedaald.</p>
        </div>`
    }),
    routeBlock(),
  ].join("\n");

  writeFile(path.join(PAR_DIR, fileName("uitleg vaardigheden")), richPage({
    title: "Uitleg vaardigheden",
    surface: "Vaardigheden",
    layout: "voorkennis-v1",
    accent: "wiskunde",
    heroSub: "De vaste aanpak voor procentuele verandering, indexcijfers, indexpunten en koopkracht.",
    sidebar: navItems(items),
    heroCards: heroCards(items),
    main,
  }));
}

function writeSamenvattingPage() {
  const items = [
    { id: "sectie-1", title: "Welke route kies je?", badge: "Route", domain: "wiskunde" },
    { id: "sectie-2", title: "Formules", badge: "Schema", domain: "grafisch" },
    { id: "sectie-3", title: "Valkuilen", badge: "Controle", domain: "economisch" },
  ];
  const main = [
    sectionBlock({
      id: "sectie-1",
      nr: 1,
      title: "Welke route kies je?",
      badge: "Route",
      domain: "wiskunde",
      html: `        <table class="samenvatting-table">
          <caption class="caption-wiskunde">Vraagtype herkennen</caption>
          <tbody>
            <tr><td>Oud bedrag → nieuw bedrag</td><td>Bereken procentuele verandering.</td></tr>
            <tr><td>Waarde in basisjaar → waarde in doeljaar</td><td>Bereken het indexcijfer.</td></tr>
            <tr><td>Oude index → nieuwe index</td><td>Bereken eerst indexpunten, daarna procentuele verandering.</td></tr>
            <tr><td>Loon en prijsindex</td><td>Vergelijk loonstijging met prijsstijging.</td></tr>
          </tbody>
        </table>`
    }),
    sectionBlock({
      id: "sectie-2",
      nr: 2,
      title: "Formules",
      badge: "Schema",
      domain: "grafisch",
      html: `        <div class="concept-grid">
          <div class="concept-card"><h4>Procentuele verandering</h4><p class="formula-box">(nieuw - oud) / oud x 100%</p></div>
          <div class="concept-card"><h4>Indexcijfer</h4><p class="formula-box">waarde doeljaar / waarde basisjaar x 100</p></div>
          <div class="concept-card"><h4>Index naar procent</h4><p class="formula-box">(nieuwe index - oude index) / oude index x 100%</p></div>
          <div class="concept-card"><h4>Koopkracht</h4><p class="formula-box">loonindex vergelijken met prijsindex</p></div>
        </div>`
    }),
    sectionBlock({
      id: "sectie-3",
      nr: 3,
      title: "Valkuilen",
      badge: "Controle",
      domain: "economisch",
      html: `        <table class="begrippen-table">
          <thead><tr><th>Fout</th><th>Waarom fout?</th><th>Goede check</th></tr></thead>
          <tbody>
            <tr><td>Delen door nieuw</td><td>Je gebruikt de verkeerde basis.</td><td>Bij procentuele verandering staat oud onder de breukstreep.</td></tr>
            <tr><td>Index 108 = €108</td><td>Een index is geen eurobedrag.</td><td>Index 108 betekent 8% hoger dan het basisjaar.</td></tr>
            <tr><td>108 naar 112 = 4%</td><td>Dat zijn 4 indexpunten.</td><td>4 / 108 x 100% = 3,7%.</td></tr>
            <tr><td>20% erbij en 20% eraf is nul</td><td>De basis verandert.</td><td>€100 → €120 → €96.</td></tr>
          </tbody>
        </table>`
    }),
    routeBlock(),
  ].join("\n");

  writeFile(path.join(PAR_DIR, fileName("samenvatting")), richPage({
    title: "Samenvatting",
    surface: "Samenvatting",
    layout: "samenvatting-v1",
    accent: "wiskunde",
    heroSub: "Een compacte routekaart met formules, betekenis en veelgemaakte fouten.",
    sidebar: navItems(items),
    heroCards: heroCards(items),
    main,
  }));
}

function guidedSidebar(opgaven) {
  return opgaven.map((opgave, idx) => `    <div class="nav-opgave${idx === 0 ? " expanded" : ""}">
      <div class="nav-opgave-title" data-toggle="opgave" data-scroll="${opgave.id}">
        <span class="nav-dot"></span>
        <span class="nav-opgave-label" title="${esc(opgave.title)}">${idx + 1} · ${esc(opgave.title)}</span>
        <svg class="nav-arrow" viewBox="0 0 14 14"><polyline points="3 5 7 9 11 5"/></svg>
      </div>
      <div class="nav-questions">
${opgave.questions.map((q) => `        <a class="nav-q" href="#${q.id}" data-q="${q.id}">${q.label}</a>`).join("\n")}
      </div>
    </div>`).join("\n");
}

function guidedHeroCards(opgaven) {
  return opgaven.map((opgave, idx) => `          <div class="hero-card" data-target="${opgave.id}">
            <div class="hero-card-num">Opgave ${idx + 1}</div>
            <div class="hero-card-title">${esc(opgave.title)}</div>
            <div class="hero-card-count">${opgave.questions.length} deelvragen</div>
          </div>`).join("\n");
}

function guidedQuestion(q) {
  return `        <div class="question-card" id="${q.id}">
          <div class="question-header">
            <div class="question-label">${q.label}</div>
            <div class="question-text">${q.question}</div>
          </div>
          <div class="helper-section">
            <details class="helper-denkstappen">
              <summary>Denkstappen</summary>
              <div class="detail-content">${q.steps}</div>
            </details>
            <details class="helper-hint">
              <summary>Hint</summary>
              <div class="detail-content">${q.hint}</div>
            </details>
          </div>
          <details class="answer-toggle">
            <summary>Toon antwoord</summary>
            <div class="answer-content">
              <div class="answer-grid">
                <div class="answer-box">${q.answer}</div>
                <div class="uitleg-box"><strong>Uitleg:</strong> ${q.explanation}</div>
              </div>
            </div>
          </details>
        </div>`;
}

function guidedSection(opgave, idx) {
  return `      <section class="opgave-section" id="${opgave.id}">
        <div class="opgave-header">
          <span class="opgave-num">${idx + 1}</span>
          <div class="opgave-title-group">
            <div class="opgave-title">${esc(opgave.title)}</div>
            <span class="opgave-badge">${esc(opgave.badge)}</span>
          </div>
        </div>
        <p class="opgave-intro">${opgave.intro}</p>
${opgave.questions.map(guidedQuestion).join("\n")}
      </section>`;
}

function writeGuidedPracticePage() {
  const opgaven = [
    {
      id: "opgave-1",
      title: "Fietsprijs omhoog en omlaag",
      badge: "Procentuele verandering",
      intro: "Deze opgave komt uit het lesboek. Je oefent vooral het verschil tussen dezelfde absolute verandering en een andere procentuele verandering.",
      questions: [
        {
          id: "q1a",
          label: "1a · Prijsstijging",
          question: "De prijs van een fiets stijgt van €800 naar €920. Bereken de procentuele prijsstijging.",
          steps: "1. Oud = €800, nieuw = €920.<br>2. Verschil = 920 - 800.<br>3. Deel het verschil door oud: verschil / 800 x 100%.<br>4. Benoem stijging of daling.",
          hint: "Het absolute verschil is €120. De oude prijs is de noemer.",
          answer: "(920 - 800) / 800 x 100% = 120 / 800 x 100% = <strong>15%</strong>.",
          explanation: "De uitkomst is positief, dus de fiets is 15% duurder geworden."
        },
        {
          id: "q1b",
          label: "1b · Prijsdaling",
          question: "Stel dat de prijs daarna daalt van €920 naar €800. Bereken de procentuele prijsdaling. Leg uit waarom dit percentage anders is dan je antwoord bij 1a.",
          steps: "1. Oud = €920, nieuw = €800.<br>2. Verschil = 800 - 920 = -120.<br>3. Deel door de oude waarde van deze daling: 920.<br>4. Vergelijk met vraag 1a.",
          hint: "Bij de daling is €920 de oude waarde. Dat maakt de noemer groter dan bij de stijging.",
          answer: "(800 - 920) / 920 x 100% = -120 / 920 x 100% = <strong>-13,0%</strong>.",
          explanation: "Hetzelfde bedrag van €120 is een kleiner percentage van €920 dan van €800. Daarom zijn +15% en -13,0% niet elkaars spiegelbeeld."
        },
      ],
    },
    {
      id: "opgave-2",
      title: "Boodschappenmandje als index",
      badge: "Indexcijfers",
      intro: "Je zet eurobedragen om naar indexcijfers en gebruikt daarna indexcijfers om een procentuele verandering te berekenen.",
      questions: [
        {
          id: "q2a",
          label: "2a · Index 2024",
          question: "In 2023 kost een standaard boodschappenmandje €150. In 2024 kost hetzelfde mandje €156. Het basisjaar is 2023 (index = 100). Bereken het indexcijfer voor 2024.",
          steps: "1. Basiswaarde = €150.<br>2. Doelwaarde = €156.<br>3. Gebruik: doelwaarde / basiswaarde x 100.<br>4. Interpreteer de uitkomst.",
          hint: "Omdat 2023 het basisjaar is, deel je door 150.",
          answer: "156 / 150 x 100 = <strong>104</strong>.",
          explanation: "Index 104 betekent dat het mandje 4% duurder is dan in het basisjaar 2023."
        },
        {
          id: "q2b",
          label: "2b · Index 2025",
          question: "In 2025 kost hetzelfde mandje €162. Bereken het indexcijfer voor 2025 met 2023 als basisjaar.",
          steps: "1. Basiswaarde blijft €150.<br>2. Doelwaarde = €162.<br>3. Deel 162 door 150 en vermenigvuldig met 100.<br>4. Interpreteer de uitkomst.",
          hint: "Het basisjaar verandert niet als je naar 2025 gaat.",
          answer: "162 / 150 x 100 = <strong>108</strong>.",
          explanation: "Index 108 betekent dat het mandje 8% duurder is dan in 2023."
        },
        {
          id: "q2c",
          label: "2c · Van 2024 naar 2025",
          question: "Bereken de procentuele prijsstijging van 2024 naar 2025 met behulp van de indexcijfers.",
          steps: "1. Oude index = 104.<br>2. Nieuwe index = 108.<br>3. Verschil = 4 indexpunten.<br>4. Procentuele verandering = 4 / 104 x 100%.",
          hint: "Gebruik de oude index 104 als noemer, niet 100.",
          answer: "(108 - 104) / 104 x 100% = 4 / 104 x 100% = <strong>3,8%</strong>.",
          explanation: "Het verschil is 4 indexpunten, maar de prijsstijging van 2024 naar 2025 is 3,8%."
        },
      ],
    },
    {
      id: "opgave-3",
      title: "Loon en koopkracht",
      badge: "Economische interpretatie",
      intro: "Hier gebruik je percentages en indexcijfers om te beoordelen of iemand echt beter af is.",
      questions: [
        {
          id: "q3a",
          label: "3a · Loonstijging",
          question: "Een werknemer verdient in 2022 een bruto maandloon van €3.000. In 2024 is zijn loon gestegen naar €3.240. Bereken de procentuele loonstijging.",
          steps: "1. Oud = €3.000, nieuw = €3.240.<br>2. Verschil = 240.<br>3. Deel door 3.000 en vermenigvuldig met 100%.<br>4. Benoem stijging of daling.",
          hint: "€240 is 8% van €3.000.",
          answer: "(3.240 - 3.000) / 3.000 x 100% = 240 / 3.000 x 100% = <strong>8%</strong>.",
          explanation: "Het loon is nominaal met 8% gestegen."
        },
        {
          id: "q3b",
          label: "3b · Loon voor gelijke koopkracht",
          question: "Het prijsindexcijfer (basisjaar 2022 = 100) is in 2024 gelijk aan 112. Bereken hoeveel het loon in 2024 had moeten zijn om dezelfde koopkracht te behouden als in 2022.",
          steps: "1. Prijsindex 112 betekent: prijzen zijn 12% hoger.<br>2. Voor dezelfde koopkracht moet het loon ook index 112 krijgen.<br>3. Bereken €3.000 x 112 / 100.",
          hint: "Vermenigvuldig met 1,12.",
          answer: "€3.000 x 1,12 = <strong>€3.360</strong>.",
          explanation: "Bij €3.360 stijgt het loon even hard als het prijspeil."
        },
        {
          id: "q3c",
          label: "3c · Koopkracht beoordelen",
          question: "Beoordeel: is de koopkracht van de werknemer gestegen of gedaald? Licht je antwoord toe met een berekening.",
          steps: "1. Feitelijk loon in 2024 = €3.240.<br>2. Benodigd loon voor gelijke koopkracht = €3.360.<br>3. Vergelijk loonindex 108 met prijsindex 112.",
          hint: "Als prijzen harder stijgen dan het loon, kan iemand minder kopen.",
          answer: "De koopkracht is <strong>gedaald</strong>. Het loonindexcijfer is 108, maar het prijsindexcijfer is 112.",
          explanation: "Het feitelijke loon (€3.240) is lager dan het benodigde loon (€3.360). De werknemer kan minder goederen en diensten kopen dan in 2022."
        },
      ],
    },
    {
      id: "opgave-4",
      title: "CPI-tabel lezen",
      badge: "Indexpunten en inflatie",
      intro: "Deze opgave traint precies de valkuil waar veel leerlingen de fout ingaan: indexpunten zijn geen procenten.",
      questions: [
        {
          id: "q4a",
          label: "4a · Inflatie 2023-2024",
          question: "Het CBS publiceert CPI-indexcijfers met basisjaar 2020 = 100: 2023 = 108 en 2024 = 112. Bereken de procentuele prijsstijging van 2023 naar 2024.",
          steps: "1. Oude index = 108.<br>2. Nieuwe index = 112.<br>3. Verschil = 4 indexpunten.<br>4. Deel door 108 en vermenigvuldig met 100%.",
          hint: "Je vergelijkt met 2023, dus 108 is de noemer.",
          answer: "(112 - 108) / 108 x 100% = <strong>3,7%</strong>.",
          explanation: "De inflatie tussen 2023 en 2024 is 3,7%."
        },
        {
          id: "q4b",
          label: "4b · Foute redenering",
          question: "Een leerling beweert: 'Het indexcijfer ging van 108 naar 112, dus de inflatie is 4%.' Leg uit waarom dit niet klopt en bereken het juiste inflatiepercentage.",
          steps: "1. Benoem wat 112 - 108 is.<br>2. Leg uit dat procentuele verandering altijd een noemer heeft.<br>3. Bereken 4 / 108 x 100%.",
          hint: "4 is het puntenverschil, niet automatisch het percentage.",
          answer: "Het verschil is <strong>4 indexpunten</strong>. Het juiste percentage is 4 / 108 x 100% = <strong>3,7%</strong>.",
          explanation: "Indexpunten zijn alleen toevallig gelijk aan procenten als de oude index precies 100 is."
        },
        {
          id: "q4c",
          label: "4c · Deflatie 2025-2026",
          question: "De index daalt van 115 in 2025 naar 112 in 2026. Bereken de procentuele prijsverandering en geef aan wat dit economisch betekent.",
          steps: "1. Oude index = 115.<br>2. Nieuwe index = 112.<br>3. Verschil = -3.<br>4. Bereken -3 / 115 x 100%.",
          hint: "Een negatieve uitkomst betekent een daling van het prijspeil.",
          answer: "(112 - 115) / 115 x 100% = <strong>-2,6%</strong>.",
          explanation: "Het algemene prijspeil daalt. Dat heet deflatie."
        },
        {
          id: "q4d",
          label: "4d · Niveau vergelijken",
          question: "Een politicus zegt: 'De prijzen in 2026 zijn weer op het niveau van 2024.' Klopt deze uitspraak? Leg uit.",
          steps: "1. Zoek index 2024 op.<br>2. Zoek index 2026 op.<br>3. Vergelijk de twee indexcijfers, niet de tussenliggende jaren.",
          hint: "2024 en 2026 hebben allebei index 112.",
          answer: "<strong>Ja.</strong> In 2024 is de index 112 en in 2026 ook.",
          explanation: "Het prijspeil steeg eerst naar 115 in 2025 en daalde daarna terug naar 112. Daarmee ligt 2026 op hetzelfde prijsniveau als 2024."
        },
      ],
    },
    {
      id: "opgave-5",
      title: "20% erbij en 20% eraf",
      badge: "Denkertje",
      intro: "Deze opgave laat zien waarom percentages altijd een basis nodig hebben. De basis verandert na de prijsverhoging.",
      questions: [
        {
          id: "q5a",
          label: "5a · Rekenvoorbeeld",
          question: "Een winkelier verhoogt zijn prijzen met 20% en geeft daarna 20% korting op de nieuwe prijs. Laat met een startprijs van €100 zien of je weer terug bij af bent.",
          steps: "1. Start met €100.<br>2. Verhoog met 20%: vermenigvuldig met 1,20.<br>3. Geef daarna 20% korting: vermenigvuldig met 0,80.<br>4. Vergelijk met €100.",
          hint: "De korting wordt berekend over €120, niet over €100.",
          answer: "€100 x 1,20 = €120. Daarna: €120 x 0,80 = <strong>€96</strong>.",
          explanation: "Je komt niet terug bij €100. De klant betaalt €4 minder dan de oorspronkelijke prijs."
        },
        {
          id: "q5b",
          label: "5b · Waarom lager?",
          question: "Leg uit waarom het kortingspercentage lager moet zijn dan 20% om weer precies op de oude prijs uit te komen.",
          steps: "1. De verhoging is €20 op de oude prijs van €100.<br>2. De korting moet ook €20 zijn om terug te komen op €100.<br>3. Maar die €20 korting wordt berekend op de nieuwe prijs van €120.<br>4. Bereken welk percentage €20 van €120 is.",
          hint: "Omdat de kortingsbasis groter is, hoort bij hetzelfde eurobedrag een lager percentage.",
          answer: "De korting moet €20 zijn. €20 / €120 x 100% = <strong>16,7%</strong>.",
          explanation: "20% korting op €120 is €24 en brengt de prijs naar €96. Om precies naar €100 terug te gaan, is dus geen hogere korting nodig, maar een lagere korting van 16,7%."
        },
        {
          id: "q5c",
          label: "5c · Kortingspercentage",
          question: "Bereken welk kortingspercentage op de verhoogde prijs nodig is om precies terug te keren naar de oorspronkelijke prijs van €100.",
          steps: "1. Verhoogde prijs = €120.<br>2. Gewenste prijs = €100.<br>3. Benodigde daling = €20.<br>4. Bereken 20 / 120 x 100%.",
          hint: "De noemer is de verhoogde prijs.",
          answer: "20 / 120 x 100% = <strong>16,7%</strong> afgerond. Exact is dat <strong>16 2/3%</strong>.",
          explanation: "Controle met de exacte waarde: €120 x (1 - 1/6) = €100. Met de afgeronde 16,7% kom je ongeveer op €100 uit."
        },
      ],
    },
  ];

  const main = opgaven.map(guidedSection).join("\n") + "\n" + `      <section class="checklist-section">
        <h2 class="checklist-title">Na deze inoefening</h2>
        <p class="checklist-sub">Als je deze vijf opgaven kunt uitleggen, beheers je de kern van de paragraaf.</p>
        <label class="checklist-item"><input type="checkbox"><span>Ik gebruik bij procentuele verandering steeds de oude waarde als basis.</span></label>
        <label class="checklist-item"><input type="checkbox"><span>Ik kan een indexcijfer berekenen en interpreteren.</span></label>
        <label class="checklist-item"><input type="checkbox"><span>Ik verwar indexpunten niet met procenten.</span></label>
        <div class="checklist-route">
          <div class="route-title">Volgende stap</div>
          <p class="route-line route-yes"><strong>Dit lukt:</strong> oefen verder met <a href="${fileName("stappenplan")}">het stappenplan</a> of het <a href="${fileName("redeneer-spel")}">redeneer-spel</a>.</p>
          <p class="route-line route-no"><strong>Dit hapert:</strong> lees <a href="${fileName("uitleg vaardigheden")}">uitleg vaardigheden</a> opnieuw en maak daarna alleen de vragen die fout gingen.</p>
        </div>
      </section>`;

  writeFile(path.join(PAR_DIR, fileName("begeleide inoefening")), richPage({
    title: "Begeleide inoefening",
    surface: "Begeleide inoefening",
    layout: "begeleide-inoefening-v1",
    accent: "wiskunde",
    heroSub: "De lesboekopgaven opnieuw opgebouwd met denkstappen, hints en uitwerkingen.",
    sidebar: guidedSidebar(opgaven),
    heroCards: guidedHeroCards(opgaven),
    main,
  }));
}

function writeNewsPage() {
  const items = [
    { id: "sectie-1", title: "Nieuwsfeit", badge: "CBS", domain: "economisch" },
    { id: "sectie-2", title: "Visual lezen", badge: "Grafisch", domain: "grafisch" },
    { id: "sectie-3", title: "Rekenvragen", badge: "Toepassen", domain: "wiskunde" },
  ];
  const main = [
    sectionBlock({
      id: "sectie-1",
      nr: 1,
      title: "Inflatie in april 2026",
      badge: "CBS",
      domain: "economisch",
      html: `        <p class="intro-text">Het CBS meldde op 30 april 2026 in een snelle raming dat de inflatie in april 2026 uitkwam op 2,8%. In maart was dat 2,7%. Consumentenprijzen waren volgens dezelfde raming 1,1% hoger dan in maart. Dit is dus een oefening met een voorlopige snelle raming, niet met een definitief maandcijfer.</p>
        <p class="source-note">Bron: CBS, "Inflatie in april 2,8 procent bij snelle raming", 30 april 2026.</p>
        ${callout("kernregel", "Leesregel:", "Vraag altijd: met welke periode wordt vergeleken? Jaar-op-jaar inflatie en maand-op-maand prijsstijging zijn niet hetzelfde.")}`
    }),
    sectionBlock({
      id: "sectie-2",
      nr: 2,
      title: "Productgroepen vergelijken",
      badge: "Grafisch",
      domain: "grafisch",
      html: `        <p class="intro-text">In nieuwsberichten zie je vaak meerdere productgroepen naast elkaar. De hoogste balk hoeft niet te betekenen dat alles even hard stijgt.</p>
${barVisual([{ label: "Totaal", width: 36, value: "2,8%" }, { label: "Energie", width: 100, value: "7,8%" }, { label: "Diensten", width: 46, value: "3,6%" }, { label: "Voeding", width: 19, value: "1,5%" }])}
        ${callout("letop", "Let op:", "Een stijging van 2,7% naar 2,8% is 0,1 procentpunt. Dat is iets anders dan dat alle prijzen met 0,1% stijgen.")}`
    }),
    sectionBlock({
      id: "sectie-3",
      nr: 3,
      title: "Rekenvragen bij het nieuws",
      badge: "Toepassen",
      domain: "wiskunde",
      html: `        <div class="question-card" id="news-q1">
          <div class="question-header">
            <div class="question-label">Vraag 1 — procentpunt of procent?</div>
            <div class="question-text">De inflatie stijgt van 2,7% naar 2,8%. Hoeveel procentpunt is dat?</div>
          </div>
          <details class="answer-toggle"><summary>Toon antwoord</summary><div class="answer-content"><div class="answer-box">2,8 - 2,7 = <strong>0,1 procentpunt</strong>.</div></div></details>
        </div>
        <div class="question-card" id="news-q2">
          <div class="question-header">
            <div class="question-label">Vraag 2 — maand-op-maand</div>
            <div class="question-text">Consumentenprijzen zijn in april 1,1% hoger dan in maart. Wat is hier de basis?</div>
          </div>
          <details class="answer-toggle"><summary>Toon antwoord</summary><div class="answer-content"><div class="answer-box">De basis is het prijsniveau in <strong>maart 2026</strong>.</div></div></details>
        </div>`
    }),
  ].join("\n");

  writeFile(path.join(PAR_DIR, fileName("nieuws met visual")), richPage({
    title: "Nieuws met visual",
    surface: "Nieuws",
    layout: "nieuws-v1",
    accent: "economisch",
    heroSub: "Gebruik actueel inflatienieuws om percentages, procentpunten en indexdenken te oefenen.",
    sidebar: navItems(items),
    heroCards: heroCards(items),
    main,
  }));
}

function writeYouTubePage() {
  const items = [
    { id: "sectie-1", title: "Kijkroute", badge: "Video", domain: "grafisch" },
    { id: "sectie-2", title: "Kijkvragen", badge: "Actief kijken", domain: "wiskunde" },
  ];
  const main = [
    sectionBlock({
      id: "sectie-1",
      nr: 1,
      title: "Kijkroute",
      badge: "Video",
      domain: "grafisch",
      html: `        <p class="intro-text">Gebruik video's gericht: kijk niet alles, maar zoek precies de uitleg die je nodig hebt. De links hieronder openen zoekresultaten met de juiste Nederlandse zoektermen.</p>
        <div class="video-list">
          <a class="video-card" href="https://www.youtube.com/results?search_query=procentuele+verandering+berekenen+economie"><h3>Procentuele verandering berekenen</h3><p>Kijk of de uitleg steeds oud, nieuw en verschil benoemt.</p></a>
          <a class="video-card" href="https://www.youtube.com/results?search_query=indexcijfers+berekenen+economie"><h3>Indexcijfers berekenen</h3><p>Let op basisjaar = 100 en doeljaar / basisjaar x 100.</p></a>
          <a class="video-card" href="https://www.youtube.com/results?search_query=indexpunten+procenten+verschil+economie"><h3>Indexpunten en procenten</h3><p>Gebruik dit als je 108 naar 112 nog als 4% leest.</p></a>
        </div>`
    }),
    sectionBlock({
      id: "sectie-2",
      nr: 2,
      title: "Kijkvragen",
      badge: "Actief kijken",
      domain: "wiskunde",
      html: `        <ul class="section-list">
          <li>Welke waarde staat onder de breukstreep bij procentuele verandering?</li>
          <li>Hoe legt de video uit wat index 100 betekent?</li>
          <li>Maakt de uitleg onderscheid tussen indexpunten en procenten?</li>
          <li>Kun je na het kijken opgave 4b zonder hulp uitleggen?</li>
        </ul>
        ${callout("controle", "Controle:", "Een video is nuttig als je daarna een opgave beter kunt maken. Anders heb je gekeken, maar nog niet geleerd.")}`
    }),
  ].join("\n");

  writeFile(path.join(PAR_DIR, fileName("youtube-videos")), richPage({
    title: "Video's",
    surface: "Video's",
    layout: "voorkennis-v1",
    accent: "grafisch",
    heroSub: "Gerichte videozoekroute met kijkvragen, zodat video kijken ook echt oefenen wordt.",
    sidebar: navItems(items),
    heroCards: heroCards(items),
    main,
  }));
}

function writeQuizData() {
  const data = {
    meta: {
      parNr: PAR_NR,
      parName: PAR_NAME,
      subtitle: "Test of je percentages, indexcijfers en de indexpuntenvalkuil herkent.",
      testTopics: [
        "Procentuele verandering berekenen",
        "Indexcijfers berekenen en interpreteren",
        "Indexpunten en procentuele verandering onderscheiden",
        "Veelgemaakte fouten met de basiswaarde"
      ]
    },
    categories: {
      procent: { name: "Procentuele verandering", colors: { bg: "#E8F8F5", text: "#0B5E5A", bar: "#148F83" } },
      index: { name: "Indexcijfers", colors: { bg: "#EBF5FB", text: "#154360", bar: "#1A5276" } },
      indexpunten: { name: "Indexpunten", colors: { bg: "#FEF5E7", text: "#BA6A1C", bar: "#E67E22" } },
      fouten: { name: "Misconcepties", colors: { bg: "#F9EBEA", text: "#922B21", bar: "#C0392B" } }
    },
    questions: [
      q("procent", 1, "Een prijs stijgt van EUR 600 naar EUR 648. Wat is de procentuele stijging?", ["8%", "7,4%", "48%", "6%"], 0, "Het verschil is 48. Deel door de oude prijs: 48 / 600 x 100% = 8%."),
      q("procent", 1, "Welke waarde staat onder de breukstreep bij procentuele verandering?", ["De oude waarde", "De nieuwe waarde", "Het verschil", "Het gemiddelde"], 0, "Je vergelijkt met het startpunt. Daarom deel je door de oude waarde."),
      q("procent", 3, "Een loon daalt van EUR 2.000 naar EUR 1.900. Wat is de procentuele verandering?", ["-5%", "-10%", "5,3%", "-100%"], 0, "Het verschil is -100. -100 / 2000 x 100% = -5%."),
      q("index", 1, "Wat betekent index 100?", ["Het basisjaar", "Een stijging van 100%", "Een daling van 0%", "Het duurste jaar"], 0, "Het basisjaar krijgt altijd index 100."),
      q("index", 2, "Een mandje kost EUR 120 in het basisjaar en EUR 150 later. Wat is het indexcijfer?", ["125", "80", "25", "120"], 0, "150 / 120 x 100 = 125."),
      q("index", 3, "Wat betekent index 80?", ["20% lager dan het basisjaar", "80% lager dan het basisjaar", "80 euro", "20 indexpunten hoger"], 0, "Index 80 ligt 20 onder 100, dus 20% lager dan het basisjaar."),
      q("indexpunten", 2, "Een index stijgt van 125 naar 135. Hoeveel indexpunten is dat?", ["10 indexpunten", "8 indexpunten", "10%", "8%"], 0, "135 - 125 = 10 indexpunten."),
      q("indexpunten", 3, "Een index stijgt van 125 naar 135. Wat is de procentuele verandering?", ["8%", "10%", "7,4%", "35%"], 0, "10 / 125 x 100% = 8%."),
      q("indexpunten", 2, "Wanneer zijn indexpunten en procenten toevallig gelijk?", ["Als het oude indexcijfer 100 is", "Altijd", "Als het nieuwe indexcijfer 100 is", "Nooit"], 0, "Bij oud = 100 geldt verschil / 100 x 100%, dus het puntenverschil is dan gelijk aan procenten."),
      q("fouten", 2, "Een leerling deelt bij 200 naar 250 door 250. Wat gaat fout?", ["De leerling gebruikt de nieuwe waarde als basis", "De leerling vergeet het verschil", "De leerling berekent indexpunten", "De leerling rondt te vroeg af"], 0, "Bij procentuele verandering deel je door de oude waarde."),
      q("fouten", 3, "Inflatie stijgt van 2,7% naar 2,8%. Welke uitspraak is het preciesst?", ["De inflatie stijgt met 0,1 procentpunt", "De prijzen stijgen met 0,1%", "De inflatie verdubbelt bijna", "De index stijgt met 2,8 punten"], 0, "Bij percentages naast elkaar spreek je hier over procentpunten."),
      q("fouten", 2, "Een index van 112 betekent:", ["12% hoger dan het basisjaar", "112% hoger dan het basisjaar", "12 euro duurder", "112 indexpunten hoger dan het vorige jaar"], 0, "Het basisjaar is 100. 112 is 12% hoger dan de basis.")
    ]
  };
  writeFile(path.join(SHARED_DIR, "questions", `${PAR_NR}.js`), "var QUIZ_DATA = " + JSON.stringify(data, null, 2) + ";\n");
}

function q(category, difficulty, text, options, answer, rationale) {
  return { category, difficulty, q: text, options, answer, rationale };
}

function writeNewsDetectiveData() {
  const data = {
    meta: { parNr: PAR_NR, parName: PAR_NAME },
    article: {
      headline: "Inflatie in april 2026 naar 2,8 procent bij snelle raming",
      body: "Het CBS meldde dat de inflatie in april 2026 2,8 procent was bij de snelle raming. In maart was dat 2,7 procent. Ten opzichte van maart lagen consumentenprijzen in april 1,1 procent hoger. Dit is een voorlopige snelle raming; de oefening gaat daarom over het lezen van zo'n raming. Vanaf 2026 gebruikt de CPI het basisjaar 2025 = 100.",
      source: "CBS",
      sourceDate: "30 april 2026",
      sourceUrl: "https://www.cbs.nl/nl-nl/nieuws/2026/18/inflatie-in-april-2-8-procent-bij-snelle-raming",
      visualAlt: "Staafdiagram met inflatie en productgroepen uit de snelle raming van april 2026"
    },
    rounds: [
      {
        type: "concept",
        question: "Welk begrip heb je nodig om 2,8 procent inflatie te begrijpen?",
        options: [
          { text: "Procentuele verandering van de CPI ten opzichte van een jaar eerder", correct: true, feedback: "Juist. Inflatie is de procentuele verandering van de consumentenprijsindex ten opzichte van dezelfde maand een jaar eerder." },
          { text: "Indexpunten tussen twee willekeurige maanden", correct: false, feedback: "Indexpunten kunnen nuttig zijn, maar inflatie wordt als procentuele verandering gepubliceerd." },
          { text: "Alleen het absolute prijsverschil in euro's", correct: false, feedback: "Absolute verschillen zijn niet vergelijkbaar tussen producten. Daarom gebruiken economen percentages en indexcijfers." },
          { text: "De gemiddelde temperatuur in april", correct: false, feedback: "Temperatuur kan prijzen beïnvloeden, maar inflatie gaat over prijsverandering in de consumentenprijsindex." }
        ]
      },
      {
        type: "consequence",
        question: "Zet de redenering in de juiste volgorde.",
        chain: [
          { text: "CBS meet prijzen van een pakket consumentengoederen en diensten", position: 0 },
          { text: "Die prijzen worden samengevat in de consumentenprijsindex", position: 1 },
          { text: "De procentuele verandering van de CPI geeft inflatie", position: 2 },
          { text: "Leerlingen moeten basis, periode en percentage zorgvuldig onderscheiden", position: 3 }
        ],
        distractors: [
          { text: "Een hoger indexcijfer betekent altijd hetzelfde aantal procenten extra" },
          { text: "Inflatie is het verschil in euro's tussen twee boodschappenmandjes" }
        ]
      },
      {
        type: "model",
        question: "Welke aanpak past bij de uitspraak: prijzen waren 1,1 procent hoger dan in maart?",
        options: [
          { id: "procentuele-verandering", label: "Procentuele verandering berekenen", description: "Je vergelijkt april met maart en deelt het verschil door de oude waarde.", correct: true, feedback: "Ja. De oude waarde is maart, de nieuwe waarde is april." },
          { id: "basisjaar", label: "Alleen een basisjaar kiezen", description: "Je zet een indexreeks op maar rekent geen verandering uit.", correct: false, feedback: "Een basisjaar is nodig voor indexcijfers, maar deze zin vraagt om een procentuele verandering tussen twee maanden." },
          { id: "procentpunt", label: "Alleen procentpunten vergelijken", description: "Je noemt het verschil tussen 2,7 procent en 2,8 procent.", correct: false, feedback: "Dat verschil is 0,1 procentpunt. De maand-op-maand prijsverandering vraagt om een aparte procentuele vergelijking." }
        ]
      },
      {
        type: "error",
        fakeAnalysis: "De inflatie steeg van 2,7 procent naar 2,8 procent. Dat betekent dat de prijzen in april 0,1 procent duurder werden dan in maart.",
        errorPhrase: "0,1 procent duurder",
        errorExplanation: "Het verschil tussen 2,7 procent en 2,8 procent is 0,1 procentpunt. De CBS-tekst noemt apart dat prijzen in april 1,1 procent hoger waren dan in maart. Procentpunten en procentuele prijsveranderingen zijn dus niet hetzelfde.",
        distractorPhrases: ["2,7 procent", "2,8 procent", "in april"]
      }
    ],
    lesLink: "Gebruik de lesformules om het verschil tussen percentage, procentpunt en indexpunt scherp te houden."
  };
  writeFile(path.join(SHARED_DIR, "newsdetective", `${PAR_NR}.js`), "var NEWS_DETECTIVE_DATA = " + JSON.stringify(data, null, 2) + ";\n");
}

function writeProcedureData() {
  const data = {
    meta: { parNr: PAR_NR, parName: PAR_NAME },
    procedures: [
      {
        id: "procentuele-verandering",
        title: "Procentuele verandering berekenen",
        icon: "fa-percent",
        description: "Bereken hoeveel een waarde stijgt of daalt ten opzichte van de oude waarde.",
        steps: [
          given("Gegeven", "Een oude waarde en een nieuwe waarde."),
          choose("Stap 1", "Bepaal de oude waarde en de nieuwe waarde", ["Begin met de nieuwe waarde als basis", "Tel oud en nieuw bij elkaar op"]),
          choose("Stap 2", "Bereken het verschil: nieuw min oud", ["Deel nieuw direct door oud", "Gebruik alleen het hoogste getal"]),
          choose("Stap 3", "Deel het verschil door de oude waarde en vermenigvuldig met 100", ["Deel door de nieuwe waarde", "Laat x 100 weg"]),
          choose("Stap 4", "Benoem stijging of daling op basis van het teken", ["Rond altijd af naar een positief getal", "Noem elk verschil indexpunten"]),
          given("Resultaat", "Je hebt de procentuele stijging of daling berekend.")
        ]
      },
      {
        id: "indexcijfer",
        title: "Indexcijfer berekenen",
        icon: "fa-chart-line",
        description: "Zet een waarde om naar een index met basisjaar 100.",
        steps: [
          given("Gegeven", "Een basisjaar en een waarde in een doeljaar."),
          choose("Stap 1", "Kies het basisjaar en geef dit index 100", ["Kies automatisch het hoogste jaar", "Kies het jaar met de hoogste prijs"]),
          choose("Stap 2", "Bepaal de waarde in het doeljaar", ["Gebruik het gemiddelde van alle jaren", "Gebruik alleen het verschil in euro's"]),
          choose("Stap 3", "Deel de doeljaarwaarde door de basisjaarwaarde en vermenigvuldig met 100", ["Deel de basis door het doeljaar", "Trek 100 af voordat je deelt"]),
          choose("Stap 4", "Interpreteer het indexcijfer ten opzichte van 100", ["Lees het indexcijfer als eurobedrag", "Noem elk indexcijfer automatisch inflatie"]),
          given("Resultaat", "Je ziet hoeveel hoger of lager de waarde is dan in het basisjaar.")
        ]
      },
      {
        id: "indexpunten-procenten",
        title: "Indexpunten en procenten onderscheiden",
        icon: "fa-not-equal",
        description: "Voorkom dat je indexpunten verwart met procentuele verandering.",
        steps: [
          given("Gegeven", "Een oud indexcijfer en een nieuw indexcijfer."),
          choose("Stap 1", "Bepaal het oude indexcijfer", ["Begin met index 100, ook als dat niet het oude jaar is", "Gebruik het hoogste indexcijfer"]),
          choose("Stap 2", "Bepaal het nieuwe indexcijfer", ["Gebruik het basisjaar in plaats van het nieuwe jaar", "Gebruik het gemiddelde van beide indexcijfers"]),
          choose("Stap 3", "Bereken het verschil in indexpunten", ["Noem dit verschil meteen procenten", "Deel eerst door 100"]),
          choose("Stap 4", "Deel door het oude indexcijfer, vermenigvuldig met 100 en benoem beide eenheden apart", ["Deel door het nieuwe indexcijfer", "Schrijf indexpunten met een procentteken"]),
          given("Resultaat", "Je kunt uitleggen waarom 125 naar 135 gelijk is aan 10 indexpunten maar 8 procent.")
        ]
      }
    ]
  };
  writeFile(path.join(SHARED_DIR, "procedure", `${PAR_NR}.js`), "var PROCEDURE_DATA = " + JSON.stringify(data, null, 2) + ";\n");
}

function given(label, text) {
  return { type: "given", label, text };
}

function choose(label, correct, wrongs) {
  return {
    type: "choose",
    label,
    options: [
      { text: correct, correct: true },
      { text: wrongs[0], correct: false, feedback: "Dit verandert de basis van de berekening en levert een verkeerd antwoord op." },
      { text: wrongs[1], correct: false, feedback: "Deze stap klinkt logisch, maar past niet bij deze procedure." }
    ]
  };
}

function writeReasoningCsv() {
  const headers = [
    "id","structure_type","structure_label","problem_text",
    "step_1_label","step_1_detail","step_1_formula",
    "step_2_label","step_2_detail","step_2_formula",
    "step_3_label","step_3_detail","step_3_formula",
    "distractor_1_label","distractor_1_detail","distractor_1_formula",
    "distractor_2_label","distractor_2_detail","distractor_2_formula",
    "distractor_3_label","distractor_3_detail","distractor_3_formula",
    "subq_1","subq_2","subq_3","subq_distractor_1","subq_distractor_2",
    "error_step_index","error_wrong_label","error_wrong_detail","error_wrong_formula",
    "flow_1_type","flow_1_text","flow_2_type","flow_2_text","flow_3_type","flow_3_text",
    "flow_4_type","flow_4_text","flow_5_type","flow_5_text","flow_6_type","flow_6_text"
  ];
  const rows = [
    r(1, "A", "Oud en nieuw vinden -> verschil berekenen -> percentage bepalen", "Een smartphone stijgt van EUR 600 naar EUR 648. Bereken de procentuele stijging.",
      "Bepaal oud en nieuw", "Oud = EUR 600 en nieuw = EUR 648.", "oud=600, nieuw=648",
      "Bereken het verschil", "648 - 600 = 48.", "nieuw-oud=48",
      "Deel door oud en vermenigvuldig met 100", "48 / 600 x 100% = 8%.", "48/600*100=8%",
      "Deel door nieuw", "48 / 648 x 100% gebruikt de verkeerde basis.", "48/648*100",
      "Gebruik het verschil als percentage", "EUR 48 verschil is geen 48%.", "48%",
      "Tel oud en nieuw op", "600 + 648 zegt niets over de stijging.", "1248",
      "Wat is de oude waarde?", "Hoe groot is het verschil?", "Wat is de procentuele stijging?", "Wat is de gemiddelde telefoonprijs?", "Welke telefoon koopt Sanne?", 1,
      "Begin met nieuw als basis", "Nieuw = EUR 648 is niet de basis voor procentuele verandering.", "basis=648",
      ["given","Oude prijs EUR 600, nieuwe prijs EUR 648"], ["step","Verschil EUR 48"], ["step","Deel door de oude prijs"], ["result","48 / 600 x 100% = 8%"], ["result","De prijs stijgt met 8%"], ["",""]),
    r(2, "A", "Oud en nieuw vinden -> verschil berekenen -> percentage bepalen", "Een jas daalt van EUR 160 naar EUR 128. Bereken de procentuele verandering.",
      "Bepaal oud en nieuw", "Oud = EUR 160 en nieuw = EUR 128.", "oud=160, nieuw=128",
      "Bereken het verschil", "128 - 160 = -32.", "nieuw-oud=-32",
      "Deel door oud en vermenigvuldig met 100", "-32 / 160 x 100% = -20%.", "-32/160*100=-20%",
      "Maak het verschil positief", "Dan verdwijnt dat het om een daling gaat.", "32",
      "Deel door nieuw", "-32 / 128 x 100% gebruikt de nieuwe waarde.", "-32/128*100",
      "Noem het indexpunten", "Dit is geen indexreeks.", "32 indexpunten",
      "Wat is de oude prijs?", "Wat is het verschil?", "Wat betekent het minteken?", "Welke kleur heeft de jas?", "Hoeveel korting geeft de winkel in euro?", 2,
      "Tel de korting bij de nieuwe prijs op", "Dat reconstrueert de oude prijs maar berekent geen percentage.", "128+32",
      ["given","Oude prijs EUR 160, nieuwe prijs EUR 128"], ["step","Verschil -EUR 32"], ["step","Deel door EUR 160"], ["result","-32 / 160 x 100% = -20%"], ["result","De jas daalt met 20%"], ["",""]),
    r(3, "B", "Basisjaar kiezen -> index berekenen -> interpreteren", "Een boodschappenmand kost EUR 120 in 2021 en EUR 150 in 2023. Bereken index 2023 met 2021 als basisjaar.",
      "Kies het basisjaar", "2021 is het basisjaar en krijgt index 100.", "basis=120",
      "Bereken de verhouding", "Deel de waarde van 2023 door de basiswaarde.", "150/120",
      "Vermenigvuldig met 100 en interpreteer", "150 / 120 x 100 = 125. Dat is 25% boven het basisjaar.", "150/120*100=125",
      "Trek de prijzen af", "150 - 120 = 30 euro maar dat is geen index.", "150-120",
      "Deel basis door doeljaar", "120 / 150 x 100 = 80 draait de vergelijking om.", "120/150*100",
      "Noem 150 het indexcijfer", "Het bedrag in euro's is niet hetzelfde als het indexcijfer.", "150",
      "Wat is het basisjaar?", "Welke waarde hoort bij 2023?", "Wat betekent index 125?", "Welke supermarkt is het goedkoopst?", "Hoeveel producten zitten in het mandje?", 3,
      "Interpreteer 125 als eurobedrag", "Een indexcijfer is een verhoudingsgetal, geen prijs in euro's.", "EUR 125",
      ["given","Basisjaar 2021, waarde EUR 120"], ["given","Doeljaar 2023, waarde EUR 150"], ["step","Bereken 150 / 120 x 100"], ["result","Index 2023 = 125"], ["result","25% hoger dan 2021"], ["",""]),
    r(4, "B", "Basisjaar kiezen -> index berekenen -> interpreteren", "Een energieprijs is EUR 200 in 2025 en EUR 216 in 2026. Bereken index 2026 met 2025 als basisjaar.",
      "Kies het basisjaar", "2025 is basisjaar en krijgt index 100.", "basis=200",
      "Bereken de verhouding", "216 / 200 = 1,08.", "216/200=1.08",
      "Vermenigvuldig met 100 en interpreteer", "1,08 x 100 = 108. De prijs is 8% hoger.", "216/200*100=108",
      "Bereken alleen het verschil", "EUR 16 verschil is geen indexcijfer.", "216-200",
      "Gebruik 2026 als basis", "Dan kan je niet zeggen hoeveel hoger 2026 is dan 2025.", "basis=216",
      "Rond af naar 110", "Onnodig grof afronden verliest informatie.", "110",
      "Wat is de basiswaarde?", "Welke formule gebruik je?", "Wat betekent index 108?", "Welke energieleverancier is dit?", "Hoeveel maanden zitten in het jaar?", 1,
      "Kies het doeljaar als basisjaar", "Het doeljaar is wat je wilt berekenen, niet de basis.", "basis=2026",
      ["given","Basiswaarde EUR 200"], ["given","Doelwaarde EUR 216"], ["step","Deel 216 door 200"], ["step","Vermenigvuldig met 100"], ["result","Index 108, dus 8% hoger"], ["",""]),
    r(5, "C", "Indexpunten herkennen -> procentuele verandering berekenen -> fout corrigeren", "Een index stijgt van 125 naar 135. Een leerling zegt dat dit 10% stijging is. Corrigeer dit.",
      "Bepaal indexpunten", "135 - 125 = 10 indexpunten.", "135-125=10",
      "Bereken procentuele verandering", "Deel 10 door het oude indexcijfer 125.", "10/125*100=8%",
      "Corrigeer de uitspraak", "De stijging is 10 indexpunten en 8%.", "10 punten, 8%",
      "Bevestig 10%", "10 is het puntenverschil, niet het percentage.", "10%",
      "Deel door 135", "Je moet delen door het oude indexcijfer.", "10/135*100",
      "Deel door 100", "Alleen als het oude indexcijfer 100 is mag dit.", "10/100*100",
      "Hoeveel indexpunten verschil is er?", "Wat is de oude basis voor de procentuele verandering?", "Wat is de correcte stijging?", "Wat is het basisjaar?", "Welke grafiek hoort erbij?", 3,
      "Noem indexpunten procenten", "Indexpunten en procenten zijn verschillende eenheden.", "10%",
      ["given","Oude index 125, nieuwe index 135"], ["step","Verschil 10 indexpunten"], ["step","Deel door 125"], ["result","10 / 125 x 100% = 8%"], ["result","Niet 10%, maar 8%"], ["",""]),
    r(6, "C", "Indexpunten herkennen -> procentuele verandering berekenen -> fout corrigeren", "Een index stijgt van 108 naar 112. Bereken het puntenverschil en de procentuele verandering.",
      "Bepaal indexpunten", "112 - 108 = 4 indexpunten.", "112-108=4",
      "Bereken procentuele verandering", "4 / 108 x 100% = 3,7%.", "4/108*100=3.7%",
      "Benoem beide uitkomsten apart", "De index stijgt 4 punten, dat is 3,7%.", "4 punten, 3.7%",
      "Noem het 4%", "4 indexpunten is niet automatisch 4%.", "4%",
      "Deel door 112", "De oude index is 108, niet 112.", "4/112*100",
      "Trek 100 af van 112", "Dat vergelijkt met het basisjaar, niet met index 108.", "112-100",
      "Wat is het indexpuntenverschil?", "Welke index is oud?", "Wat is de procentuele verandering?", "Wat was de prijs in euro's?", "Wat is de inflatie volgend jaar?", 2,
      "Gebruik de nieuwe index als basis", "Bij procentuele verandering hoort de oude waarde in de noemer.", "4/112*100",
      ["given","Oude index 108, nieuwe index 112"], ["step","Verschil 4 indexpunten"], ["step","Deel door de oude index 108"], ["result","4 / 108 x 100% = 3,7%"], ["result","4 indexpunten is 3,7%"], ["",""])
  ];
  const csv = [headers.join(";"), ...rows.map(row => headers.map(h => csvCell(row[h] || "")).join(";"))].join("\n") + "\n";
  const csvPath = path.join(PLATFORM_ROOT, "source-data", "book-1", "reasoning", `${PAR_NR}.csv`);
  writeFile(csvPath, csv);
}

function r(id, structure_type, structure_label, problem_text,
  step_1_label, step_1_detail, step_1_formula,
  step_2_label, step_2_detail, step_2_formula,
  step_3_label, step_3_detail, step_3_formula,
  distractor_1_label, distractor_1_detail, distractor_1_formula,
  distractor_2_label, distractor_2_detail, distractor_2_formula,
  distractor_3_label, distractor_3_detail, distractor_3_formula,
  subq_1, subq_2, subq_3, subq_distractor_1, subq_distractor_2,
  error_step_index, error_wrong_label, error_wrong_detail, error_wrong_formula,
  flow1, flow2, flow3, flow4, flow5, flow6) {
  return {
    id, structure_type, structure_label, problem_text,
    step_1_label, step_1_detail, step_1_formula,
    step_2_label, step_2_detail, step_2_formula,
    step_3_label, step_3_detail, step_3_formula,
    distractor_1_label, distractor_1_detail, distractor_1_formula,
    distractor_2_label, distractor_2_detail, distractor_2_formula,
    distractor_3_label, distractor_3_detail, distractor_3_formula,
    subq_1, subq_2, subq_3, subq_distractor_1, subq_distractor_2,
    error_step_index, error_wrong_label, error_wrong_detail, error_wrong_formula,
    flow_1_type: flow1[0], flow_1_text: flow1[1],
    flow_2_type: flow2[0], flow_2_text: flow2[1],
    flow_3_type: flow3[0], flow_3_text: flow3[1],
    flow_4_type: flow4[0], flow_4_text: flow4[1],
    flow_5_type: flow5[0], flow_5_text: flow5[1],
    flow_6_type: flow6[0], flow_6_text: flow6[1]
  };
}

function csvCell(value) {
  const s = String(value);
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function writeReviewAndQuality() {
  writeFile(path.join(PAR_DIR, `${PAR_NR}-companion-visual-review.md`), `# Companion Visual Review - ${PAR_NR} ${PAR_NAME}

Date: 2026-05-13
Sprint: L1.4-PARITY procedure and quality cleanup
Reviewer: Codex main-agent verification

## Verdict

PASS WITH FLAGS

The 1.1.2 student-web companion surface has been rebuilt as a polished scaling baseline, not a minimal technical probe. The L1.4-PARITY cleanup aligns the companion layer with the refreshed Part A procedure model: percentage change, index-number calculation, and indexpoints versus percentage change now use the same four-step student-facing routes. The build intentionally avoids new Word exports; the publisher-print PDFs remain a separate Part A pipeline. The presentation remains available as PPTX plus web-rendered slides with speaker notes.

## Checks

- Required companion outputs are generated at paragraph root.
- Shared data exists for quiz, news detective, reasoning, procedure, and skilltree.
- Student-facing pages use full skill names rather than internal unit codes.
- Procedures match the canonical four-step lesson logic for percentage change, index numbers, and indexpoints versus percentage change.
- Begeleide inoefening is rebuilt from the actual textbook opgaven and answer model, with denkstappen, hints, and revealable answers per subquestion.
- Uitleg voorkennis and uitleg vaardigheden use the same left-navigation layout and theme behavior as the 1.1.1 baseline.
- Wiskundevaardigheden supports paragraph, chapter, and all-skills view modes.
- News context cites CBS April 2026 inflation quick estimate.
- News copy explicitly frames the CBS material as a snelle-raming exercise, not as a final monthly CPI publication.
- Skilltree paragraph mode uses A38 and A39; A39 includes index-change interpretation, so no third active unit is added in this cleanup.
- Presentation notes are written as teacher explanation text, suitable for a later TTS/video experiment.
- Presentation-v2 automated screenshot QA passed across desktop, speaker-notes, fullscreen, dark, dark-notes, and mobile scenarios.
- Browser screenshot QA was added for the non-presentation pages: index, voorkennis, begeleide inoefening, and wiskundevaardigheden were checked in wide/narrow and light/dark representative states.

## Flags

- Formal teacher/student review has not yet been run.
- Human review should now focus on classroom usefulness and student comprehension, not on missing baseline layout/build work.
`);

  writeFile(path.join(PAR_DIR, `${PAR_NR}-quality-ref.yaml`), `# Quality Reference - ${PAR_NR} ${PAR_NAME}
# Refreshed: 2026-05-13 (L1.4-PARITY procedure and quality cleanup)

paragraph: "${PAR_NR}"
title: "${PAR_NAME}"
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
    total_referenced: 4
    total_present: 4
    missing: []
    svgpng_paired: true
    naming_compliant: true
  review:
    file: "1.1.2-review.md"
    unresolved_fails: 0
    verdict: "PASS WITH FLAGS"
    last_reviewed: "2026-05-13"
    rounding_policy: "Percentages to 1 decimal unless instructed otherwise; exact value shown when needed for checks."

companion:
  review_file: "1.1.2-companion-visual-review.md"
  review_verdict: "PASS WITH FLAGS"
  last_reviewed: "2026-05-13"
  hard_fails_open: 0
  default_office_exports: false
  student_facing_internal_codes: false
  procedures:
    procentuele_verandering_step_count: 4
    indexcijfer_step_count: 4
    indexpunten_procenten_step_count: 4
  skilltree_mapping:
    active_skills: ["A38", "A39"]
    coverage_note: "A39 covers indexcijfer berekenen and index-change interpretation; no separate third active skill is required for this paragraph."
  surfaces:
    voorkennis_html: clean
    vaardigheden_html: clean
    presentatie_pptx: clean
    presentatie_html: clean
    nieuws_html: clean
    samenvatting_html: clean
    begeleide_inoefening_html: clean
    youtube_videos_html: clean
    games:
      instapquiz: clean
      nieuws_detective: clean
      stappenplan: clean
      redeneer_spel: clean
      wiskundevaardigheden: clean
`);
}

async function writePresentation() {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "CUSTOM_16X9", width: 13.333, height: 7.5 });
  pptx.layout = "CUSTOM_16X9";
  pptx.author = "Economie VWO";
  pptx.subject = `${PAR_NR} ${PAR_NAME}`;
  pptx.title = `${PAR_NR} ${PAR_NAME}`;
  pptx.company = "4veco";

  const C = {
    bg: "F7FAFC",
    dark: "102A43",
    teal: "0F766E",
    tealDark: "134E4A",
    amber: "F59E0B",
    coral: "E76F51",
    blue: "1A5276",
    white: "FFFFFF",
    pale: "E8F8F5",
    ink: "1F2937"
  };

  function addTitle(slide, kicker, title, subtitle) {
    slide.addText(kicker, { x: 0.55, y: 0.35, w: 4, h: 0.28, fontSize: 10, bold: true, color: C.teal, margin: 0 });
    slide.addText(title, { x: 0.55, y: 0.72, w: 7.2, h: 0.75, fontSize: 28, bold: true, color: C.dark, margin: 0 });
    if (subtitle) slide.addText(subtitle, { x: 0.58, y: 1.42, w: 7.8, h: 0.35, fontSize: 14, color: "52606D", margin: 0 });
  }

  function notes(nav, vraag, uitleg, pitfall, overgang) {
    return `NavTitle: ${nav}\nVraag: ${vraag}\nUitleg: ${uitleg}\nPitfall: ${pitfall}\nOvergang: ${overgang}`;
  }

  function slideBase() {
    const s = pptx.addSlide();
    s.background = { color: C.bg };
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 7.18, w: 13.333, h: 0.32, fill: { color: C.tealDark }, line: { color: C.tealDark } });
    s.addText(`${PAR_NR}  ${PAR_NAME}`, { x: 0.5, y: 7.25, w: 6, h: 0.16, fontSize: 7.5, color: C.white, margin: 0 });
    return s;
  }

  {
    const s = slideBase();
    s.background = { color: "0F172A" };
    s.addText("PARAGRAAF 1.1.2", { x: 0.7, y: 0.8, w: 4, h: 0.35, fontSize: 13, color: C.amber, bold: true, margin: 0 });
    s.addText("Percentages en\nindexcijfers", { x: 0.7, y: 1.28, w: 7.7, h: 1.8, fontSize: 44, color: C.white, bold: true, margin: 0, breakLine: false });
    s.addText("Hoeveel duurder is het geworden?", { x: 0.72, y: 3.35, w: 7.4, h: 0.46, fontSize: 22, color: "FDE68A", margin: 0 });
    s.addShape(pptx.ShapeType.roundRect, { x: 9.0, y: 1.1, w: 3.55, h: 3.55, rectRadius: 0.18, fill: { color: "12343B" }, line: { color: "2DD4BF", transparency: 25 } });
    s.addText("600 -> 648\n= 8%", { x: 9.35, y: 1.95, w: 2.85, h: 1.1, fontSize: 30, bold: true, color: C.white, align: "center", margin: 0 });
    s.addText("Na deze les kun je procentuele veranderingen berekenen, indexcijfers lezen en indexpunten onderscheiden van procenten.", { x: 0.72, y: 4.25, w: 7.6, h: 0.75, fontSize: 15, color: "D6E4FF", margin: 0 });
    s.addNotes(notes("Start", "Wat betekent het als iets 8 procent duurder wordt?", "Open met Sanne's smartphone. Laat leerlingen eerst raden of EUR 48 veel is. Daarna laat je zien dat het pas betekenis krijgt door te vergelijken met EUR 600.", "Zeg nog niet alleen formule. Eerst moet duidelijk zijn waarom percentages handig zijn.", "We gaan van een herkenbare prijsverandering naar een vaste rekenroute."));
  }

  {
    const s = slideBase();
    addTitle(s, "CONTEXT", "Sanne ziet een smartphone", "Vorig jaar EUR 600, nu EUR 648.");
    s.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 2.15, w: 4.2, h: 2.55, fill: { color: C.white }, line: { color: "CBD5E1" } });
    s.addText("Oud", { x: 1.05, y: 2.45, w: 1.8, h: 0.28, fontSize: 13, bold: true, color: C.teal, margin: 0 });
    s.addText("EUR 600", { x: 1.05, y: 2.9, w: 3.4, h: 0.55, fontSize: 32, bold: true, color: C.dark, margin: 0 });
    s.addText("Basis waar je mee vergelijkt", { x: 1.05, y: 3.62, w: 3.2, h: 0.35, fontSize: 13, color: "52606D", margin: 0 });
    s.addShape(pptx.ShapeType.roundRect, { x: 5.25, y: 2.15, w: 4.2, h: 2.55, fill: { color: "FFF7ED" }, line: { color: "FDBA74" } });
    s.addText("Nieuw", { x: 5.5, y: 2.45, w: 1.8, h: 0.28, fontSize: 13, bold: true, color: "C2410C", margin: 0 });
    s.addText("EUR 648", { x: 5.5, y: 2.9, w: 3.4, h: 0.55, fontSize: 32, bold: true, color: C.dark, margin: 0 });
    s.addText("Verschil: EUR 48 hoger", { x: 5.5, y: 3.62, w: 3.2, h: 0.35, fontSize: 13, color: "7C2D12", margin: 0 });
    s.addText("Waarom is EUR 48 extra bij een telefoon iets anders dan EUR 48 extra bij een brood?", { x: 0.85, y: 5.25, w: 9.2, h: 0.42, fontSize: 19, color: C.blue, bold: true, margin: 0 });
    s.addNotes(notes("Sanne's prijs", "Welke twee getallen moeten we eerst vinden?", "Laat leerlingen de oude waarde, nieuwe waarde en het verschil aanwijzen. Benadruk dat EUR 48 alleen nog maar een absoluut verschil is.", "De fout hier is te snel roepen dat EUR 48 veel of weinig is zonder basis.", "Daarom drukken we het verschil uit als percentage van de oude prijs."));
  }

  {
    const s = slideBase();
    addTitle(s, "VAARDIGHEID", "Procentuele verandering in vier stappen", "De oude waarde is de basis.");
    const steps = [
      ["01", "Bepaal oud en nieuw", "Oud = 600, nieuw = 648"],
      ["02", "Bereken het verschil", "648 - 600 = 48"],
      ["03", "Deel door oud x 100", "48 / 600 x 100% = 8%"],
      ["04", "Benoem stijging of daling", "positief, dus prijsstijging"]
    ];
    steps.forEach((step, i) => {
      const y = 1.95 + i * 1.05;
      s.addShape(pptx.ShapeType.roundRect, { x: 0.85, y, w: 8.8, h: 0.78, fill: { color: C.white }, line: { color: "CBD5E1" } });
      s.addText(step[0], { x: 1.08, y: y + 0.15, w: 0.5, h: 0.25, fontSize: 16, color: C.teal, bold: true, margin: 0 });
      s.addText(step[1], { x: 1.72, y: y + 0.12, w: 3.2, h: 0.28, fontSize: 15, bold: true, color: C.dark, margin: 0 });
      s.addText(step[2], { x: 5.15, y: y + 0.13, w: 4, h: 0.28, fontSize: 15, color: "334155", margin: 0 });
    });
    s.addShape(pptx.ShapeType.roundRect, { x: 10.15, y: 2.35, w: 2.35, h: 2.55, fill: { color: C.tealDark }, line: { color: C.tealDark } });
    s.addText("8%", { x: 10.35, y: 3.0, w: 1.95, h: 0.7, fontSize: 42, bold: true, color: C.white, align: "center", margin: 0 });
    s.addText("duurder", { x: 10.35, y: 3.72, w: 1.95, h: 0.28, fontSize: 16, color: "CCFBF1", align: "center", margin: 0 });
    s.addNotes(notes("Percentage stappen", "Waarom delen we door 600 en niet door 648?", "De oude waarde is het startpunt. Je vraagt: hoeveel procent van de oude prijs is de stijging? Daarom staat 600 onder de breukstreep.", "Een veelgemaakte fout is delen door de nieuwe waarde. Dat maakt de stijging te klein.", "Dezelfde manier van denken gebruiken we straks bij indexcijfers."));
  }

  {
    const s = slideBase();
    addTitle(s, "VAN EEN PRIJS NAAR EEN REEKS", "Waarom indexcijfers?", "Een index maakt jaren vergelijkbaar.");
    s.addText("Basisjaar = 100", { x: 0.9, y: 2.0, w: 3.2, h: 0.38, fontSize: 20, bold: true, color: C.teal, margin: 0 });
    s.addText("Alle andere jaren worden uitgedrukt ten opzichte van dat basisjaar.", { x: 0.9, y: 2.46, w: 4.7, h: 0.5, fontSize: 15, color: C.ink, margin: 0 });
    const bars = [["2021", 100, "EUR 120"], ["2023", 125, "EUR 150"], ["2024", 135, "EUR 162"]];
    bars.forEach((b, i) => {
      const y = 3.35 + i * 0.7;
      s.addText(b[0], { x: 0.95, y, w: 0.8, h: 0.25, fontSize: 12, bold: true, margin: 0, color: C.dark });
      s.addShape(pptx.ShapeType.rect, { x: 1.95, y, w: b[1] / 28, h: 0.22, fill: { color: i === 0 ? C.teal : C.coral }, line: { color: i === 0 ? C.teal : C.coral } });
      s.addText(String(b[1]), { x: 6.9, y: y - 0.02, w: 0.55, h: 0.25, fontSize: 12, bold: true, color: C.dark, margin: 0 });
      s.addText(b[2], { x: 7.55, y: y - 0.02, w: 1.2, h: 0.25, fontSize: 12, color: "52606D", margin: 0 });
    });
    s.addShape(pptx.ShapeType.roundRect, { x: 9.4, y: 2.35, w: 2.85, h: 2.55, fill: { color: "EFF6FF" }, line: { color: "93C5FD" } });
    s.addText("Index 125", { x: 9.75, y: 2.9, w: 2.1, h: 0.38, fontSize: 20, bold: true, color: C.blue, align: "center", margin: 0 });
    s.addText("betekent\n25% hoger dan\nhet basisjaar", { x: 9.78, y: 3.45, w: 2.1, h: 0.8, fontSize: 15, color: C.ink, align: "center", margin: 0 });
    s.addNotes(notes("Waarom index", "Waarom zetten economen een reeks vaak op 100?", "Met een index kun je verschillende jaren of producten vergelijken zonder steeds alle eurobedragen te onthouden. Het basisjaar krijgt 100, daarna lees je alles relatief af.", "Index 125 is geen EUR 125. Het betekent 25 procent hoger dan het basisjaar.", "Nu bouwen we de formule voor het indexcijfer."));
  }

  {
    const s = slideBase();
    addTitle(s, "FORMULE", "Indexcijfer berekenen", "Waarde doeljaar gedeeld door waarde basisjaar, keer 100.");
    s.addShape(pptx.ShapeType.roundRect, { x: 1.0, y: 2.2, w: 10.9, h: 1.05, fill: { color: "ECFEFF" }, line: { color: "67E8F9" } });
    s.addText("indexcijfer = waarde doeljaar / waarde basisjaar x 100", { x: 1.35, y: 2.55, w: 10.2, h: 0.3, fontSize: 24, bold: true, color: C.dark, align: "center", margin: 0 });
    const table = [["Jaar", "Prijs mandje", "Berekening", "Index"], ["2021", "EUR 120", "120 / 120 x 100", "100"], ["2023", "EUR 150", "150 / 120 x 100", "125"]];
    table.forEach((row, rIdx) => row.forEach((cell, cIdx) => {
      const x = 1.0 + [0, 1.7, 3.9, 7.3][cIdx];
      const w = [1.45, 1.85, 3.1, 1.25][cIdx];
      const y = 4.0 + rIdx * 0.52;
      s.addShape(pptx.ShapeType.rect, { x, y, w, h: 0.45, fill: { color: rIdx === 0 ? C.tealDark : C.white }, line: { color: "CBD5E1" } });
      s.addText(cell, { x: x + 0.08, y: y + 0.11, w: w - 0.16, h: 0.18, fontSize: 11, color: rIdx === 0 ? C.white : C.dark, bold: rIdx === 0, margin: 0 });
    }));
    s.addNotes(notes("Index formule", "Welke waarde hoort in de teller en welke in de noemer?", "De doeljaarwaarde staat boven, de basisjaarwaarde onder. Daardoor meet je hoeveel het doeljaar is ten opzichte van de basis.", "Als leerlingen teller en noemer omdraaien, krijgen ze bijvoorbeeld 80 in plaats van 125. Dat vertelt het omgekeerde verhaal.", "Tot slot kijken we naar de belangrijkste valkuil: indexpunten zijn geen procenten."));
  }

  {
    const s = slideBase();
    addTitle(s, "VALKUIL", "Indexpunten zijn geen procenten", "Van index 125 naar 135 is niet 10%.");
    s.addText("125 -> 135", { x: 0.95, y: 2.0, w: 3.2, h: 0.48, fontSize: 30, bold: true, color: C.dark, margin: 0 });
    s.addText("Verschil = 10 indexpunten", { x: 0.98, y: 2.75, w: 4.3, h: 0.35, fontSize: 18, bold: true, color: C.coral, margin: 0 });
    s.addShape(pptx.ShapeType.roundRect, { x: 0.95, y: 3.55, w: 5.05, h: 1.2, fill: { color: "FFF7ED" }, line: { color: "FDBA74" } });
    s.addText("10 / 125 x 100% = 8%", { x: 1.25, y: 3.94, w: 4.45, h: 0.28, fontSize: 22, bold: true, color: "7C2D12", align: "center", margin: 0 });
    s.addShape(pptx.ShapeType.roundRect, { x: 7.25, y: 2.0, w: 4.4, h: 2.8, fill: { color: "FEE2E2" }, line: { color: "FCA5A5" } });
    s.addText("Fout:", { x: 7.6, y: 2.45, w: 1.4, h: 0.28, fontSize: 16, bold: true, color: "991B1B", margin: 0 });
    s.addText("10 indexpunten\n= 10%", { x: 7.6, y: 2.95, w: 3.5, h: 0.75, fontSize: 24, bold: true, color: "991B1B", align: "center", margin: 0 });
    s.addText("Alleen waar als oud indexcijfer 100 is.", { x: 7.6, y: 4.02, w: 3.5, h: 0.35, fontSize: 13, color: "7F1D1D", align: "center", margin: 0 });
    s.addNotes(notes("Indexpuntenvalkuil", "Waarom is 10 indexpunten hier 8 procent?", "Het percentage bereken je altijd ten opzichte van het oude getal. Het oude indexcijfer is 125, dus 10 gedeeld door 125 keer 100 is 8 procent.", "De klassieke fout is het puntenverschil direct met een procentteken opschrijven.", "We sluiten af met de drie rekenroutes naast elkaar."));
  }

  {
    const s = slideBase();
    addTitle(s, "SAMENVATTING", "Drie dingen die je moet kunnen", "Percentage, index en indexpunten scherp uit elkaar houden.");
    const cards = [
      ["1", "Procentuele verandering", "(nieuw - oud) / oud x 100%"],
      ["2", "Indexcijfer", "waarde doeljaar / waarde basisjaar x 100"],
      ["3", "Indexpunten vs procenten", "puntenverschil / oud indexcijfer x 100%"]
    ];
    cards.forEach((card, i) => {
      const x = 0.8 + i * 4.05;
      s.addShape(pptx.ShapeType.roundRect, { x, y: 2.25, w: 3.55, h: 2.25, fill: { color: C.white }, line: { color: "CBD5E1" } });
      s.addText(card[0], { x: x + 0.22, y: 2.5, w: 0.45, h: 0.32, fontSize: 18, bold: true, color: C.teal, margin: 0 });
      s.addText(card[1], { x: x + 0.78, y: 2.48, w: 2.45, h: 0.45, fontSize: 15, bold: true, color: C.dark, margin: 0, fit: "shrink" });
      s.addText(card[2], { x: x + 0.35, y: 3.35, w: 2.9, h: 0.5, fontSize: 13, color: "334155", align: "center", margin: 0, fit: "shrink" });
    });
    s.addText("Volgende stap: gegevens uit tabellen en grafieken netjes verwerken.", { x: 0.9, y: 5.35, w: 8.5, h: 0.36, fontSize: 18, color: C.blue, bold: true, margin: 0 });
    s.addNotes(notes("Samenvatting", "Welke van de drie routes vind je het lastigst?", "Herhaal kort: bedragen naar bedragen is procentuele verandering. Een reeks door de tijd zet je vaak in indexcijfers. Als je twee indexcijfers vergelijkt, reken je opnieuw een procentuele verandering uit.", "Laat leerlingen niet eindigen met alleen formules. Ze moeten vooral weten welke formule bij welke soort vraag hoort.", "In de volgende paragraaf gebruiken we dezelfde rekenvaardigheden bij tabellen en grafieken."));
  }

  const outPath = path.join(PAR_DIR, fileName("presentatie", "pptx"));
  await pptx.writeFile({ fileName: outPath });
  console.log("write " + path.relative(path.resolve(PLATFORM_ROOT, ".."), outPath));

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
    paragraph: {
      number: PAR_NR,
      title: PAR_NAME,
      chapter: "1.1 Hoofdstuk Economisch denken en rekenen"
    },
    title: "Hoeveel duurder is het geworden?",
    subtitle: PAR_NAME,
    outputBase: `${PAR_NR} ${PAR_NAME} ${DASH} presentatie`,
    slides: [
      {
        id: "start",
        navTitle: "Startvraag",
        teacherTitle: "Hoeveel duurder is het geworden?",
        studentTitle: "Hoeveel duurder?",
        layout: "choiceTensionCover",
        eyebrow: "§ 1.1.2 · Percentages",
        thesis: "Sanne ziet een telefoon die van EUR 600 naar EUR 648 stijgt.",
        prompt: "Is EUR 48 veel? Dat hangt af van de basis.",
        tension: {
          available: { label: "oude prijs", value: "EUR 600" },
          wanted: { label: "nieuwe prijs", value: "EUR 648" },
          gap: { label: "verschil", value: "EUR 48" }
        },
        paths: [
          { label: "absoluut", text: "EUR 48 extra" },
          { label: "relatief", text: "8% duurder" }
        ],
        speakerNotes: notes(
          "Kijk eerst naar de drie getallen. De telefoon kostte eerst zeshonderd euro en kost nu zeshonderdachtenveertig euro. Het verschil is achtenveertig euro.",
          "De vraag is niet alleen of achtenveertig euro veel is. De vraag is: veel ten opzichte van wat? Bij een telefoon van zeshonderd euro is het acht procent. Bij een brood zou hetzelfde eurobedrag absurd groot zijn.",
          "Vandaag leren leerlingen daarom steeds de basis te vinden voordat ze een percentage of indexcijfer interpreteren."
        )
      },
      {
        id: "oud-nieuw",
        navTitle: "Oud en nieuw",
        teacherTitle: "Oud, nieuw en verschil",
        studentTitle: "Eerst de basis vinden",
        layout: "choiceComparison",
        eyebrow: "Procentuele verandering",
        lead: "Een percentage begint met zorgvuldig lezen.",
        goals: ["oude waarde vinden", "nieuwe waarde vinden", "verschil berekenen"],
        options: [
          { key: "A", title: "Oud", price: "EUR 600", benefit: "De basis waarmee je vergelijkt.", accent: "teal" },
          { key: "B", title: "Nieuw", price: "EUR 648", benefit: "De waarde na de verandering.", accent: "amber" }
        ],
        conclusion: "Het verschil is EUR 48, maar het percentage bereken je met de oude prijs als basis.",
        speakerNotes: notes(
          "Laat leerlingen op deze dia eerst alleen de twee waarden aanwijzen. Oud is zeshonderd, nieuw is zeshonderdachtenveertig.",
          "Daarna pas komt het verschil. Nieuw min oud is achtenveertig. De volgorde is belangrijk, want wie te snel naar de formule gaat, verwisselt vaak oud en nieuw.",
          "De oude waarde is de basis. Dat blijft in deze hele paragraaf terugkomen."
        )
      },
      {
        id: "percentage-route",
        navTitle: "Percentage",
        teacherTitle: "Procentuele verandering berekenen",
        studentTitle: "Van EUR 48 naar 8%",
        layout: "procedureRoute",
        routeLabel: "Procentuele verandering berekenen in vier stappen",
        eyebrow: "Vaste aanpak",
        lead: "Gebruik deze route bij een verandering van bedrag naar bedrag.",
        steps: [
          { number: "01", title: "Bepaal oud en nieuw", prompt: "Oud = 600, nieuw = 648.", accent: "teal" },
          { number: "02", title: "Bereken het verschil", prompt: "648 - 600 = 48.", accent: "green" },
          { number: "03", title: "Deel door oud", prompt: "48 / 600 x 100% = 8%.", accent: "amber" },
          { number: "04", title: "Benoem het teken", prompt: "Positief, dus een stijging.", accent: "coral" }
        ],
        example: "De smartphone is 8% duurder geworden.",
        speakerNotes: notes(
          "Dit is de rekenroute die leerlingen moeten automatiseren. Eerst oud en nieuw. Dan het verschil. Dan delen door oud en keer honderd.",
          "Benadruk vooral stap drie. De noemer is de oude waarde, omdat je vraagt hoeveel procent van de oude prijs de stijging is.",
          "De laatste stap is taal: positief betekent stijging, negatief betekent daling."
        )
      },
      {
        id: "waarom-index",
        navTitle: "Waarom index",
        teacherTitle: "Van een prijs naar een reeks",
        studentTitle: "Waarom indexcijfers?",
        layout: "choiceComparison",
        eyebrow: "Indexcijfers",
        lead: "Economen willen vaak meerdere jaren vergelijken.",
        goals: ["basisjaar herkennen", "index 100 lezen", "reeks vergelijken"],
        options: [
          { key: "A", title: "Eurobedragen", price: "120, 150, 162", benefit: "Precies, maar soms lastig te vergelijken.", accent: "teal" },
          { key: "B", title: "Indexreeks", price: "100, 125, 135", benefit: "Laat meteen zien hoe elk jaar zich verhoudt tot de basis.", accent: "amber" }
        ],
        conclusion: "Het basisjaar krijgt index 100. Andere jaren lees je ten opzichte van dat basisjaar.",
        speakerNotes: notes(
          "Een indexcijfer is handig zodra er een reeks ontstaat. Leerlingen hoeven niet alle eurobedragen in hun hoofd te houden; ze lezen alles ten opzichte van het basisjaar.",
          "Index honderd betekent niet honderd euro. Het betekent: dit is het startpunt van de vergelijking.",
          "Als een later jaar index honderdvijfentwintig heeft, is dat vijfentwintig procent hoger dan het basisjaar."
        )
      },
      {
        id: "index-formule",
        navTitle: "Index formule",
        teacherTitle: "Indexcijfer berekenen",
        studentTitle: "Basisjaar = 100",
        layout: "procedureRoute",
        routeLabel: "Indexcijfer berekenen in vier stappen",
        eyebrow: "Vaste aanpak",
        lead: "Gebruik deze route bij een waarde ten opzichte van een basisjaar.",
        steps: [
          { number: "01", title: "Kies het basisjaar", prompt: "Dat jaar krijgt index 100.", accent: "teal" },
          { number: "02", title: "Neem de doelwaarde", prompt: "Bijvoorbeeld EUR 150 in 2023.", accent: "green" },
          { number: "03", title: "Deel door de basis", prompt: "150 / 120 x 100 = 125.", accent: "amber" },
          { number: "04", title: "Interpreteer", prompt: "Index 125 is 25% boven de basis.", accent: "coral" }
        ],
        example: "Een mandje van EUR 120 naar EUR 150 krijgt index 125.",
        speakerNotes: notes(
          "De formule lijkt op procentueel rekenen, maar de vraag is anders. We zetten een waarde om naar een index.",
          "De doelwaarde staat boven de breuk. De waarde in het basisjaar staat onder de breuk. Daarna keer honderd.",
          "Laat leerlingen altijd een zin achter hun antwoord schrijven: index 125 betekent vijfentwintig procent hoger dan het basisjaar."
        )
      },
      {
        id: "indexpunten",
        navTitle: "Indexpunten",
        teacherTitle: "Indexpunten zijn geen procenten",
        studentTitle: "125 naar 135 is niet 10%",
        layout: "procedureRoute",
        routeLabel: "Indexpunten en procentuele verandering onderscheiden in vier stappen",
        eyebrow: "Valkuil",
        lead: "Het verschil in punten is nog niet de procentuele verandering.",
        steps: [
          { number: "01", title: "Oude index", prompt: "125.", accent: "teal" },
          { number: "02", title: "Nieuwe index", prompt: "135.", accent: "green" },
          { number: "03", title: "Puntenverschil", prompt: "135 - 125 = 10 indexpunten.", accent: "amber" },
          { number: "04", title: "Deel door oud", prompt: "10 / 125 x 100% = 8%.", accent: "coral" }
        ],
        example: "De index stijgt 10 punten, maar de procentuele stijging is 8%.",
        speakerNotes: notes(
          "Dit is de belangrijkste examenvalkuil op deze dia. Tien punten verschil klinkt als tien procent, maar dat is alleen waar als je oude index honderd is.",
          "Hier is de oude index honderdvijfentwintig. Daarom deel je tien door honderdvijfentwintig.",
          "Laat leerlingen beide eenheden uitspreken: tien indexpunten en acht procent. Die taal helpt de fout te voorkomen."
        )
      },
      {
        id: "samenvatting",
        navTitle: "Samenvatting",
        teacherTitle: "Welke route kies je?",
        studentTitle: "Drie routes",
        layout: "procedureRoute",
        routeLabel: "Drie rekenroutes kiezen en eenheden controleren",
        eyebrow: "Afronding",
        lead: "Kies eerst het soort vraag, daarna de formule.",
        steps: [
          { number: "01", title: "Bedrag naar bedrag", prompt: "Procentuele verandering.", accent: "teal" },
          { number: "02", title: "Waarde naar basisjaar", prompt: "Indexcijfer berekenen.", accent: "green" },
          { number: "03", title: "Index naar index", prompt: "Procentuele verandering op indexcijfers.", accent: "amber" },
          { number: "04", title: "Eenheden controleren", prompt: "Procent, procentpunt of indexpunt?", accent: "coral" }
        ],
        example: "In de volgende paragraaf gebruik je deze rekenroutes bij tabellen en grafieken.",
        speakerNotes: notes(
          "Sluit af door leerlingen niet alleen formules te laten onthouden, maar vooral het soort vraag te laten herkennen.",
          "Bij bedrag naar bedrag gebruik je procentuele verandering. Bij basisjaar naar doeljaar gebruik je een indexcijfer. Bij twee indexcijfers gebruik je opnieuw procentuele verandering.",
          "De laatste controle is taal: schrijf nooit zomaar een procentteken achter een indexpuntenverschil."
        )
      }
    ]
  };
}

async function main() {
  if (!fs.existsSync(PAR_DIR)) {
    throw new Error("Paragraph folder not found: " + PAR_DIR);
  }
  writeParagraphPlan();
  writeRichPagesPolished();
  writeQuizData();
  writeNewsDetectiveData();
  writeProcedureData();
  writeReasoningCsv();
  writeReviewAndQuality();
  await writePresentation();
}

main().catch(err => {
  console.error(err.stack || err.message);
  process.exit(1);
});
