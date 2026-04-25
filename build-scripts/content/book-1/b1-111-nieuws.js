/**
 * Boek 1, §1.1.1 Schaarste en economisch denken — Nieuws met visual
 * ══════════════════════════════════════════════════════════════════════
 * Topic: Woningschaarste in Nederland (wachttijden sociale huur,
 * vraag >> aanbod). Introduceert schaarste en alternatieve kosten
 * via een concreet, herkenbaar maatschappelijk probleem.
 *
 * Based on nieuws-351-352-afsluiting.js template.
 * Domain: markt (blue #1A5276) — het centrale verdelingsprobleem
 * in H1 is de markt.
 *
 * Run (from platform root):
 *   NODE_PATH="$(npm root -g)" node build-scripts/content/book-1/b1-111-nieuws.js
 * ══════════════════════════════════════════════════════════════════════
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { saveSvgFiles } = require("../../lib/lib-svg-save");
const { SURFACES, THEMES } = require("../../lib/lib-visual-surfaces");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak,
} = require("docx");

// ── COLORS (Domain: markt = blue) ──
const C = {
  navy:     "1E2761",
  dark:     "2D3748",
  gray:     "718096",
  white:    "FFFFFF",
  accent:   "1A5276",   // markt blue
  accentLt: "EBF5FB",
  accentDk: "154360",
};

// ── PAGE SETUP (tight margins) ──
const PAGE_TIGHT = {
  size:   { width: 11906, height: 16838 },
  margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
};
const CW_TIGHT    = 9638;
const IMG_WIDTH_PT = 482;

// ── SVG → PNG ──
async function svgToPng(svgStr, width = 720) {
  return await sharp(Buffer.from(svgStr)).resize(width).png().toBuffer();
}

// ── HELPERS ──
function noBorders() {
  const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  return { top: none, bottom: none, left: none, right: none };
}

function domainBanner(title) {
  const accentWidth = 180;
  return new Table({
    rows: [new TableRow({ children: [
      new TableCell({
        width:    { size: accentWidth, type: WidthType.DXA },
        shading:  { type: ShadingType.CLEAR, fill: C.accent },
        borders:  noBorders(),
        children: [new Paragraph({ text: "" })],
      }),
      new TableCell({
        width:    { size: CW_TIGHT - accentWidth, type: WidthType.DXA },
        shading:  { type: ShadingType.CLEAR, fill: C.accentLt },
        borders:  noBorders(),
        margins:  { top: 80, bottom: 80, left: 160, right: 160 },
        children: [new Paragraph({
          spacing: { before: 0, after: 0 },
          children: [new TextRun({
            text: title, bold: true, size: 24, font: "Arial", color: C.accentDk,
          })],
        })],
      }),
    ] })],
    width: { size: CW_TIGHT, type: WidthType.DXA },
  });
}

function headlinePara(text) {
  return new Paragraph({
    spacing: { before: 0, after: 160 },
    children: [new TextRun({
      text, bold: true, size: 32, font: "Arial", color: C.navy,
    })],
  });
}

function articlePara(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({
      text, size: 22, font: "Arial", color: C.dark,
    })],
  });
}

function sourcePara(text) {
  return new Paragraph({
    spacing: { before: 40, after: 160 },
    children: [new TextRun({
      text, italics: true, size: 18, font: "Arial", color: C.gray,
    })],
  });
}

function questionPara(label, text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({ text: label + "  ", bold: true, size: 22, font: "Arial", color: C.accent }),
      new TextRun({ text, size: 22, font: "Arial", color: C.dark }),
    ],
  });
}

function answerPara(label, text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({ text: label + "  ", bold: true, size: 22, font: "Arial", color: C.accent }),
      new TextRun({ text, size: 22, font: "Arial", color: C.dark }),
    ],
  });
}

function spacer(twips = 120) {
  return new Paragraph({ spacing: { before: twips, after: 0 }, text: "" });
}

// ══════════════════════════════════════════════════════════════════════
// SVG — Woningtekort bar chart (jaarlijkse vraag vs aanbod sociale huur)
// ══════════════════════════════════════════════════════════════════════
// Fictieve maar plausibele cijfers op basis van CBS / ministerie BZK:
//   - Wachtenden op sociale huurwoning: ~400.000 (indicatief landelijk)
//   - Jaarlijks vrijkomende / opgeleverde sociale huurwoningen: ~80.000
// Toont schaarste visueel: vraag staat ver boven aanbod.
// Groeps-titel noemt beide staven: "Vraag" (wachtenden) en
// "Aanbod" (jaarlijks vrijkomend). Getallen × 1.000.
//
// Theme-aware: reads its palette from THEMES[cfg.theme] so the same
// composition can be emitted for light (doc, web_light) and dark
// (web_dark) surfaces. ViewBox stays at 720×360 regardless of surface;
// resolution scales via svgToPng(svg, surface.pngW).
function renderWoningtekort(cfg) {
  const t = THEMES[cfg.theme];
  const W = 720, H = 360;

  const bars = [
    { label: "Vraag (wachtenden)",     value: 400, color: t.blue },
    { label: "Aanbod (per jaar vrij)", value:  80, color: t.green },
  ];
  const maxValue = 450; // round y-max with headroom
  const plotLeft = 120, plotRight = 620, plotTop = 80, plotBottom = 300;
  const plotH = plotBottom - plotTop;
  const barW = 120;
  const gap  = (plotRight - plotLeft - bars.length * barW) / (bars.length + 1);

  let grid = "";
  for (let v = 0; v <= maxValue; v += 100) {
    const y = plotBottom - (v / maxValue) * plotH;
    grid += `<line x1="${plotLeft}" y1="${y}" x2="${plotRight}" y2="${y}" stroke="${t.grid}" stroke-width="1" />`;
    grid += `<text x="${plotLeft - 10}" y="${y + 4}" font-family="Inter, Arial, sans-serif" font-size="12" fill="${t.muted}" text-anchor="end">${v}</text>`;
  }

  const axes = `
    <line x1="${plotLeft}" y1="${plotTop}"    x2="${plotLeft}"  y2="${plotBottom}" stroke="${t.soft}" stroke-width="1.5" />
    <line x1="${plotLeft}" y1="${plotBottom}" x2="${plotRight}" y2="${plotBottom}" stroke="${t.soft}" stroke-width="1.5" />
  `;

  let barsSvg = "";
  bars.forEach((b, i) => {
    const x = plotLeft + gap + i * (barW + gap);
    const h = (b.value / maxValue) * plotH;
    const y = plotBottom - h;
    barsSvg += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="3" fill="${b.color}" />`;
    barsSvg += `<text x="${x + barW / 2}" y="${y - 8}" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="bold" fill="${b.color}" text-anchor="middle">${b.value}</text>`;
    barsSvg += `<text x="${x + barW / 2}" y="${plotBottom + 22}" font-family="Inter, Arial, sans-serif" font-size="13" fill="${t.ink}" text-anchor="middle">${b.label}</text>`;
  });

  const tekort = bars[0].value - bars[1].value; // 320
  const annoX = plotLeft + gap + barW + gap / 2;
  const topBarY    = plotBottom - (bars[0].value / maxValue) * plotH;
  const bottomBarY = plotBottom - (bars[1].value / maxValue) * plotH;
  const annotation = `
    <line x1="${annoX}" y1="${topBarY}"    x2="${annoX}" y2="${bottomBarY}" stroke="${t.red}" stroke-width="2" stroke-dasharray="4,4" />
    <line x1="${annoX - 6}" y1="${topBarY}"    x2="${annoX + 6}" y2="${topBarY}"    stroke="${t.red}" stroke-width="2" />
    <line x1="${annoX - 6}" y1="${bottomBarY}" x2="${annoX + 6}" y2="${bottomBarY}" stroke="${t.red}" stroke-width="2" />
    <rect x="${annoX + 10}" y="${(topBarY + bottomBarY) / 2 - 14}" width="160" height="28" rx="4" fill="${t.redSoft}" stroke="${t.red}" stroke-width="1" />
    <text x="${annoX + 90}" y="${(topBarY + bottomBarY) / 2 + 5}" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="bold" fill="${t.red}" text-anchor="middle">Tekort: ${tekort}</text>
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" rx="8" fill="${t.bg}" />
  <text x="${W / 2}" y="30" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="bold" fill="${t.ink}" text-anchor="middle">Woningmarkt Nederland: vraag en aanbod sociale huur</text>
  <text x="${W / 2}" y="50" font-family="Inter, Arial, sans-serif" font-size="12" fill="${t.muted}" text-anchor="middle">Aantal woningen (× 1.000) — indicatief 2024</text>
  <text x="${plotLeft - 70}" y="${plotTop + plotH / 2}" font-family="Inter, Arial, sans-serif" font-size="12" fill="${t.soft}" text-anchor="middle" transform="rotate(-90 ${plotLeft - 70} ${plotTop + plotH / 2})">Woningen (× 1.000)</text>
  ${grid}
  ${axes}
  ${barsSvg}
  ${annotation}
  <text x="${plotLeft}" y="${H - 10}" font-family="Inter, Arial, sans-serif" font-size="10" fill="${t.muted}">Bron: CBS / ministerie BZK — orde-van-grootte (onderwijsmateriaal)</text>
</svg>`;
}

// News-asset registration. Mirrors the VISUALS shape used in
// b1-111-visual-variants.js: asset base → surfaces it supports + render fn.
// News does not appear on the presentation or in the summary, so slide
// and summary surfaces are skipped (mirrors how ex_1 is scoped in the
// visual-variants builder).
const NEWS_VISUALS = {
  "1.1.1_news_woningtekort": {
    surfaces: ["doc", "web_light", "web_dark"],
    render: renderWoningtekort,
  },
};

// ══════════════════════════════════════════════════════════════════════
// CONTENT
// ══════════════════════════════════════════════════════════════════════

const OUTPUT_DIR = path.resolve(__dirname,
  "../../../../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken"
);
const ASSETS_DIR = path.join(OUTPUT_DIR, "_assets");
const OUTPUT_FILE = path.join(OUTPUT_DIR,
  "1.1.1 Schaarste en economisch denken – nieuws met visual.docx"
);

const DOC = {
  nr:      "1.1.1",
  naam:    "Schaarste en economisch denken",
  headline: "Honderdduizenden Nederlanders wachten jaren op een sociale huurwoning",
  article: [
    "In heel Nederland staan zo’n 400.000 mensen op de wachtlijst voor een sociale huurwoning, terwijl er jaarlijks maar rond de 80.000 van zulke woningen vrijkomen of nieuw worden opgeleverd. In de Randstad lopen de wachttijden op tot tien jaar of meer. De **vraag** naar betaalbare woningen is dus veel groter dan het **aanbod** — een schoolvoorbeeld van schaarste.",
    "Omdat niet iedereen tegelijk een woning kan krijgen, moeten er keuzes worden gemaakt. Gemeenten geven voorrang aan bepaalde groepen (statushouders, mantelzorgers, mensen met medische urgentie) en de overheid moet kiezen waar zij haar geld aan besteedt: meer nieuwbouw, hogere huurtoeslag, of andere maatschappelijke uitgaven zoals onderwijs. Elke euro die naar wonen gaat, kan niet meer naar iets anders — dat zijn de **alternatieve kosten** van het beleid.",
    "Ook individuele woningzoekenden maken voortdurend keuzes: blijven wachten op een goedkope huurwoning, duurder particulier huren, of langer bij ouders blijven wonen. Elke optie heeft zijn eigen opbrengst en zijn eigen alternatieve kosten.",
  ],
  source:  "Bron: NOS, 2024 — https://nos.nl/collectie/13871-wonen-crisis",
  sourceUrl: "https://nos.nl/collectie/13871-wonen-crisis",
  questions: [
    "Lees de eerste alinea en bekijk de visual. Wat is in dit nieuwsbericht het schaarse middel, en welke twee groepen hebben er behoefte aan?",
    "Gebruik de cijfers uit de visual (×1.000). Hoeveel mensen staan er meer op de wachtlijst dan er jaarlijks woningen vrijkomen? Hoeveel jaar wachten zou dit gemiddeld opleveren als alle wachtenden in de rij blijven en er niemand bijkomt?",
    "De overheid moet kiezen waaraan zij haar budget besteedt. Noem twee concrete alternatieven waartussen de overheid kan kiezen binnen het woonbeleid, en geef per alternatief aan wat de alternatieve kosten zijn.",
    "Een individuele woningzoekende besluit te blijven wachten op een sociale huurwoning in plaats van duurder particulier te gaan huren. Leg uit wat voor deze woningzoekende de alternatieve kosten van het blijven wachten zijn.",
    "Stel: jij bent wethouder Wonen in een grote stad. Welke van de alternatieven uit vraag c zou jij kiezen, en waarom? Onderbouw je keuze met de begrippen “schaarste” en “alternatieve kosten”.",
  ],
  answers: [
    "Het schaarse middel is de (betaalbare) sociale huurwoning. De twee groepen met behoefte zijn: (1) woningzoekenden die op de wachtlijst staan — ongeveer 400.000 mensen — en (2) nieuwe instromers die er elk jaar bij komen (jongeren die zelfstandig willen gaan wonen, gescheiden mensen, statushouders, enzovoort). Samengevat: er zijn veel meer mensen die een sociale huurwoning willen dan er woningen beschikbaar zijn — dat is schaarste.",
    "Verschil = 400.000 − 80.000 = 320.000 mensen extra vraag per jaar. Als we alle 400.000 wachtenden moeten bedienen met slechts 80.000 woningen per jaar (en er komt niemand bij), duurt dat 400.000 ÷ 80.000 = 5 jaar. In werkelijkheid stromen er elk jaar nieuwe wachtenden in, dus kan de wachttijd in dichtbevolkte regio’s oplopen tot 10 jaar of meer.",
    "Twee alternatieven (voorbeelden): (1) Extra geld in **nieuwbouw** van sociale huurwoningen — alternatieve kosten: dat geld kan niet meer naar bijvoorbeeld het onderwijs of de zorg, of naar hogere huurtoeslag voor huurders die nu al een woning hebben. (2) Extra geld in **huurtoeslag** verhogen — alternatieve kosten: er komt geen extra woning bij (het aanbod blijft gelijk), dus het geld had ook aan nieuwbouw besteed kunnen worden om de schaarste zelf te verkleinen. Andere correcte paren (bv. nieuwbouw vs. sociale huur optrekken, bouw in buitengebied vs. in binnenstad) zijn ook goed, mits het niet-gekozen alternatief expliciet als alternatieve kost wordt benoemd.",
    "De alternatieve kosten van blijven wachten zijn de opbrengst van het beste niet-gekozen alternatief — in dit geval: het comfort en de zelfstandigheid van particulier huren (of thuis blijven wonen). Concreet: de jaren woonplezier, zelfstandigheid en locatievoordelen die de woningzoekende **nu opgeeft** door te blijven wachten. Let op: de alternatieve kosten zijn niet de prijs van de sociale woning en ook niet het verschil in huur — het is de waarde van het beste alternatief dat je laat schieten.",
    "Voorbeeldantwoord (open): “Ik kies voor extra **nieuwbouw** van sociale huurwoningen. De kern van het probleem is schaarste: er zijn veel meer woningzoekenden dan woningen. Huurtoeslag verhogen maakt bestaande woningen voor meer mensen betaalbaar, maar voegt geen enkele woning toe — de schaarste blijft dus even groot. De alternatieve kosten van nieuwbouw zijn hoog (geld dat niet naar onderwijs of zorg kan), maar alleen door het aanbod te vergroten wordt het fundamentele schaarsteprobleem kleiner.” Een andere onderbouwde keuze (bv. huurtoeslag of voorrangsregels) is ook goed, zolang “schaarste” en “alternatieve kosten” expliciet gebruikt worden.",
  ],
};

// ══════════════════════════════════════════════════════════════════════
// BUILD — variants first, then the docx embeds the _doc PNG
// ══════════════════════════════════════════════════════════════════════

/**
 * Render all news-asset surface variants (doc / web_light / web_dark)
 * plus the canonical base file. Returns the base SVG string so buildNieuws
 * can store a copy next to the docx.
 */
async function buildNewsVariants() {
  if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

  let baseSvg = null;

  for (const [base, entry] of Object.entries(NEWS_VISUALS)) {
    for (const surfaceName of entry.surfaces) {
      const surface = SURFACES[surfaceName];
      const svg = entry.render(surface);
      const stem = `${base}_${surface.suffix}`;
      const svgPath = path.join(ASSETS_DIR, `${stem}.svg`);
      const pngPath = path.join(ASSETS_DIR, `${stem}.png`);
      fs.writeFileSync(svgPath, svg, "utf8");
      fs.writeFileSync(pngPath, await svgToPng(svg, surface.pngW));
      console.log(`wrote ${path.basename(svgPath)} and ${path.basename(pngPath)}`);
    }

    // Canonical base file: same light palette as web_light/doc. Kept so
    // downstream consumers that expect the plain X.Y.Z_news_*.svg name
    // (and the paragraph plan index row) continue to resolve.
    const baseRender = entry.render(SURFACES.web_light);
    const baseSvgPath = path.join(ASSETS_DIR, `${base}.svg`);
    const basePngPath = path.join(ASSETS_DIR, `${base}.png`);
    fs.writeFileSync(baseSvgPath, baseRender, "utf8");
    fs.writeFileSync(basePngPath, await svgToPng(baseRender, 960));
    console.log(`wrote ${path.basename(baseSvgPath)} and ${path.basename(basePngPath)}`);
    if (base === "1.1.1_news_woningtekort") baseSvg = baseRender;
  }

  return baseSvg;
}

async function buildNieuws(doc, baseSvg) {
  const headerText = `${doc.nr} ${doc.naam} – Nieuws met visual`;

  // Embed the adapted _doc PNG (higher resolution than the old 720-wide
  // base render) so the Word document carries the surface variant, not
  // a raw screenshot of the neutral source.
  const docPngPath = path.join(ASSETS_DIR, "1.1.1_news_woningtekort_doc.png");
  const pngBuf = fs.readFileSync(docPngPath);
  // viewBox 720×360 → aspect 0.5; held constant across surfaces so the
  // docx layout geometry does not change when the PNG resolution does.
  const IMG_HEIGHT_PT = Math.round(IMG_WIDTH_PT * (360 / 720));

  const children = [];
  children.push(headlinePara(doc.headline));
  children.push(new Paragraph({
    spacing: { before: 80, after: 160 },
    children: [new ImageRun({
      data: pngBuf,
      transformation: { width: IMG_WIDTH_PT, height: IMG_HEIGHT_PT },
      type: "png",
    })],
  }));
  for (const p of doc.article) children.push(articlePara(p));
  children.push(sourcePara(doc.source));
  children.push(spacer(80));
  children.push(domainBanner("Vragen"));
  children.push(spacer(80));
  const labels = "abcdefgh".split("");
  for (let i = 0; i < doc.questions.length; i++) {
    children.push(questionPara(labels[i] + ")", doc.questions[i]));
  }
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(domainBanner("Antwoordmodel"));
  children.push(spacer(80));
  for (let i = 0; i < doc.answers.length; i++) {
    children.push(answerPara(labels[i] + ")", doc.answers[i]));
  }

  const document = new Document({
    sections: [{
      properties: {
        page: PAGE_TIGHT,
        headers: { default: new Header({ children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({
            text: headerText, size: 20, font: "Arial", color: C.gray, italics: true,
          })],
        })] }) },
        footers: { default: new Footer({ children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Pagina ", size: 20, font: "Arial", color: C.gray }),
            new TextRun({ children: [PageNumber.CURRENT], size: 20, font: "Arial", color: C.gray }),
          ],
        })] }) },
      },
      children,
    }],
  });

  const buf = await Packer.toBuffer(document);
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, buf);
  console.log(`Created: ${OUTPUT_FILE} (${buf.length} bytes)`);

  // Also keep a copy of the SVG next to the docx via saveSvgFiles (svg/ subdir)
  saveSvgFiles([{ name: "1.1.1-nieuws-visual", svg: baseSvg }], OUTPUT_DIR);
}

// ── MAIN ──
(async () => {
  try {
    const baseSvg = await buildNewsVariants();
    await buildNieuws(DOC, baseSvg);
    console.log("\nDone! Nieuws met visual for 1.1.1 created.");
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
})();
