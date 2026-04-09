/**
 * nieuws-351-352-afsluiting.js
 * ══════════════════════════════════════════════════════════════════════
 * Generates "nieuws met visual" documents for:
 *   - 3.5.1 Afsluiting (Booking.com EU boete)
 *   - 3.5.2 Naar het examen (NS treinkaartprijs stijging)
 *
 * Uses real SVG → Sharp → PNG pipeline for visuals.
 * Domain: purple (#7D3C98) for Chapter 5.
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/nieuws-351-352-afsluiting.js
 *
 * HOW TO ADAPT:
 * - Update the DOCUMENTS content sections (search for ════)
 * - Change OUTPUT_BASE for a different module
 * - Swap SVG functions for different chart types
 *
 * NOTE FOR NEW PARAGRAPHS: This script predates the Phase 4a/4b/4c workflow.
 * New paragraph scripts should:
 *   - Read _paragraph-plan.md for article choice and chart type
 *   - Read pre-built PNG from _assets/ instead of generating SVG inline
 *   - Use: const { svgToPng, pngToBase64, GRAPH_COLORS } = require('./lib-svg-utils')
 * ══════════════════════════════════════════════════════════════════════
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak,
} = require("docx");

// ── COLORS (Domain: purple for H5 Afsluiting) ──
const C = {
  navy:      "1E2761",
  dark:      "2D3748",
  gray:      "718096",
  white:     "FFFFFF",
  // Domain purple
  accent:    "7D3C98",
  accentLt:  "F4ECF7",
  accentDk:  "6C3483",
};

// ── PAGE SETUP (tight margins, per econ-nieuws-exercise skill) ──
const PAGE_TIGHT = {
  size: { width: 11906, height: 16838 },
  margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
};
const CW_TIGHT = 9638; // content width in DXA
const IMG_WIDTH_PT = 482; // full content width in points

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
  const accentWidth = 180; // ~12pt
  return new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: accentWidth, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: C.accent },
            borders: noBorders(),
            children: [new Paragraph({ text: "" })],
          }),
          new TableCell({
            width: { size: CW_TIGHT - accentWidth, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: C.accentLt },
            borders: noBorders(),
            margins: { top: 80, bottom: 80, left: 160, right: 160 },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 24,   // 12pt banner title
                    font: "Arial",
                    color: C.accentDk,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
    width: { size: CW_TIGHT, type: WidthType.DXA },
  });
}

function headlinePara(text) {
  return new Paragraph({
    spacing: { before: 0, after: 160 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 32,   // 16pt — matches reference
        font: "Arial",
        color: C.navy,
      }),
    ],
  });
}

function articlePara(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [
      new TextRun({
        text,
        size: 22,   // 11pt — matches reference
        font: "Arial",
        color: C.dark,
      }),
    ],
  });
}

function sourcePara(text) {
  return new Paragraph({
    spacing: { before: 40, after: 160 },
    children: [
      new TextRun({
        text,
        italics: true,
        size: 18,   // 9pt — matches reference
        font: "Arial",
        color: C.gray,
      }),
    ],
  });
}

function questionPara(label, text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({
        text: label + "  ",
        bold: true,
        size: 22,   // 11pt — matches reference
        font: "Arial",
        color: C.accent,
      }),
      new TextRun({
        text,
        size: 22,   // 11pt
        font: "Arial",
        color: C.dark,
      }),
    ],
  });
}

function answerPara(label, text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({
        text: label + "  ",
        bold: true,
        size: 22,   // 11pt
        font: "Arial",
        color: C.accent,
      }),
      new TextRun({
        text,
        size: 22,   // 11pt
        font: "Arial",
        color: C.dark,
      }),
    ],
  });
}

function spacer(twips = 120) {
  return new Paragraph({ spacing: { before: twips, after: 0 }, text: "" });
}

// ── SVG GRAPHS ──

function svgBookingMarketShares() {
  // Horizontal bar chart: market shares online travel platforms
  // viewBox "0 0 720 360", bg #F7FAFC
  const bars = [
    { label: "Booking.com", pct: 66, y: 70 },
    { label: "Expedia", pct: 15, y: 145 },
    { label: "Airbnb", pct: 12, y: 220 },
    { label: "Overig", pct: 7, y: 295 },
  ];
  const maxW = 480; // max bar width in SVG units
  const barH = 45;
  const labelX = 150; // left edge of bars
  const purple = "#7D3C98";
  const purpleLt = "#9B59B6";

  let barsSvg = "";
  for (const b of bars) {
    const w = Math.round((b.pct / 66) * maxW); // scale to largest
    barsSvg += `
      <text x="${labelX - 10}" y="${b.y + barH / 2 + 5}" font-family="Arial" font-size="14" fill="#2D3748" text-anchor="end">${b.label}</text>
      <rect x="${labelX}" y="${b.y}" width="${w}" height="${barH}" rx="3" fill="${purple}" />
      <text x="${labelX + w + 8}" y="${b.y + barH / 2 + 5}" font-family="Arial" font-size="14" font-weight="bold" fill="${purple}">${b.pct}%</text>`;
  }

  // Grid lines
  let gridLines = "";
  for (let pct = 0; pct <= 70; pct += 10) {
    const x = labelX + Math.round((pct / 66) * maxW);
    gridLines += `<line x1="${x}" y1="50" x2="${x}" y2="340" stroke="#E2E8F0" stroke-width="1" />`;
    if (pct % 20 === 0) {
      gridLines += `<text x="${x}" y="355" font-family="Arial" font-size="11" fill="#718096" text-anchor="middle">${pct}%</text>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360">
  <rect width="720" height="360" rx="8" fill="#F7FAFC" />
  <text x="360" y="32" font-family="Arial" font-size="16" font-weight="bold" fill="#2D3748" text-anchor="middle">Marktaandelen online reisplatforms in Nederland</text>
  ${gridLines}
  ${barsSvg}
</svg>`;
}

function svgNSCostBreakdown() {
  // Stacked bar chart: NS cost breakdown 2023 vs 2025
  // viewBox "0 0 720 360"
  const categories = [
    { name: "Energie",         color2023: "#E67E22", pct2023: 15, pct2025: 22 },
    { name: "Personeel",       color2023: "#1A5276", pct2023: 35, pct2025: 36 },
    { name: "Infrastructuur",  color2023: "#1E8449", pct2023: 25, pct2025: 24 },
    { name: "Winst",           color2023: "#7D3C98", pct2023: 10, pct2025: 6 },
    { name: "Belasting",       color2023: "#718096", pct2023: 15, pct2025: 12 },
  ];

  const barW = 140;
  const maxH = 220;
  const x2023 = 185;
  const x2025 = 395;
  const baseY = 300;

  function buildStack(cats, field, x) {
    let svg = "";
    let cumY = 0;
    for (const c of cats) {
      const pct = c[field];
      const h = Math.round((pct / 100) * maxH);
      const y = baseY - cumY - h;
      svg += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="0" fill="${c.color2023}" />`;
      if (pct >= 8) {
        svg += `<text x="${x + barW / 2}" y="${y + h / 2 + 5}" font-family="Arial" font-size="12" fill="white" text-anchor="middle">${c.name} ${pct}%</text>`;
      }
      cumY += h;
    }
    return svg;
  }

  // Legend
  let legend = "";
  let lx = 100;
  for (const c of categories) {
    legend += `<rect x="${lx}" y="340" width="12" height="12" rx="2" fill="${c.color2023}" />`;
    legend += `<text x="${lx + 16}" y="351" font-family="Arial" font-size="10" fill="#2D3748">${c.name}</text>`;
    lx += c.name.length * 7 + 30;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360">
  <rect width="720" height="360" rx="8" fill="#F7FAFC" />
  <text x="360" y="32" font-family="Arial" font-size="16" font-weight="bold" fill="#2D3748" text-anchor="middle">Kostenopbouw NS per reizigerskilometer</text>
  <line x1="130" y1="${baseY}" x2="590" y2="${baseY}" stroke="#CBD5E0" stroke-width="1" />
  ${buildStack(categories, "pct2023", x2023)}
  ${buildStack(categories, "pct2025", x2025)}
  <text x="${x2023 + barW / 2}" y="${baseY + 20}" font-family="Arial" font-size="14" font-weight="bold" fill="#2D3748" text-anchor="middle">2023</text>
  <text x="${x2025 + barW / 2}" y="${baseY + 20}" font-family="Arial" font-size="14" font-weight="bold" fill="#2D3748" text-anchor="middle">2025</text>
  ${legend}
</svg>`;
}

// ── BUILD DOCUMENT ──

async function buildNieuws(doc) {
  const headerText = `${doc.nr} ${doc.naam} \u2013 Nieuws met visual`;

  // Render SVG to PNG
  const pngBuf = await svgToPng(doc.svg, 720);
  // viewBox is 0 0 720 360 → aspect ratio 0.5
  const IMG_HEIGHT_PT = Math.round(IMG_WIDTH_PT * (360 / 720));

  const children = [];

  // Headline
  children.push(headlinePara(doc.headline));

  // Image (full content width)
  children.push(
    new Paragraph({
      spacing: { before: 80, after: 160 },
      children: [
        new ImageRun({
          data: pngBuf,
          transformation: { width: IMG_WIDTH_PT, height: IMG_HEIGHT_PT },
          type: "png",
        }),
      ],
    })
  );

  // Article paragraphs
  for (const p of doc.article) {
    children.push(articlePara(p));
  }

  // Source
  children.push(sourcePara(doc.source));

  // Vragen banner
  children.push(spacer(80));
  children.push(domainBanner("Vragen"));
  children.push(spacer(80));

  // Questions
  const labels = "abcdefgh".split("");
  for (let i = 0; i < doc.questions.length; i++) {
    children.push(questionPara(labels[i] + ")", doc.questions[i]));
  }

  // Page break
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // Antwoordmodel banner
  children.push(domainBanner("Antwoordmodel"));
  children.push(spacer(80));

  // Answers
  for (let i = 0; i < doc.answers.length; i++) {
    children.push(answerPara(labels[i] + ")", doc.answers[i]));
  }

  const document = new Document({
    sections: [{
      properties: {
        page: PAGE_TIGHT,
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: headerText,
                    size: 20,
                    font: "Arial",
                    color: C.gray,
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Pagina ",
                    size: 20,
                    font: "Arial",
                    color: C.gray,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 20,
                    font: "Arial",
                    color: C.gray,
                  }),
                ],
              }),
            ],
          }),
        },
      },
      children,
    }],
  });

  const buf = await Packer.toBuffer(document);
  const outDir = path.dirname(doc.outputPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(doc.outputPath, buf);
  console.log(`Created: ${doc.outputPath} (${buf.length} bytes)`);
}

// ══════════════════════════════════════════════════════════════════════
// CONTENT — 3.5.1 Afsluiting: Booking.com EU boete
// ══════════════════════════════════════════════════════════════════════

const OUTPUT_BASE = path.resolve(__dirname,
  "../../3. Module 3 - Markt en overheid/3.5 Hoofdstuk 5 - Afsluiting"
);

const DOC_351 = {
  nr: "3.5.1",
  naam: "Afsluiting",
  outputPath: path.join(OUTPUT_BASE,
    "3.5.1 Paragraaf 1 - Afsluiting/2. Leren",
    "3.5.1 Afsluiting \u2013 nieuws met visual.docx"
  ),
  headline: "EU beboet Booking.com voor \u20AC413 miljoen",
  svg: svgBookingMarketShares(),
  article: [
    "De Europese Commissie heeft Booking.com een boete opgelegd van \u20AC413 miljoen wegens misbruik van haar dominante marktpositie. Het platform verplichtte hotels om via prijspariteitclausules hun laagste prijs exclusief op Booking aan te bieden. Hierdoor konden concurrenten zoals Expedia niet op prijs concurreren.",

    "De zaak raakt kernthema\u2019s uit de hele module: marktconcentratie, mededingingsbeleid en internationale digitale markten. Booking.com heeft aangekondigd in beroep te gaan tegen het besluit.",
  ],
  source: "Bron: Europese Commissie / NOS, november 2024",
  questions: [
    "Is de markt voor online hotelboekingen een concrete of abstracte markt?",
    "Bekijk de visual. Welke marktvorm past het beste bij deze markt? Gebruik de marktaandelen als argument.",
    "Leg uit waarom de prijspariteitclausule van Booking.com nadelig is voor consumenten.",
    "De EU greep in met een boete. Noem een ander instrument waarmee de overheid marktmacht kan beperken.",
    "Booking.com opereert in heel Europa. Leg uit waarom internationale samenwerking nodig is om dit soort marktmacht aan te pakken.",
  ],
  answers: [
    "Een abstracte markt \u2014 er is geen fysieke plek waar vragers en aanbieders samenkomen.",
    "Oligopolie (heterogeen). Booking.com heeft 66% marktaandeel, met slechts drie andere grote spelers. De producten zijn gedifferentieerd (verschillende platforms bieden andere service/interface).",
    "Hotels mogen nergens een lagere prijs aanbieden dan op Booking.com. Daardoor is er geen prijsconcurrentie tussen platforms, en betalen consumenten een hogere prijs dan nodig.",
    "Bijvoorbeeld: het verbieden van de prijspariteitclausule, het opleggen van gedragsregels, of het opsplitsen van het bedrijf.",
    "Booking.com opereert grensoverschrijdend. E\u00E9n land kan het gedrag niet effectief aanpakken omdat het bedrijf kan uitwijken. De EU kan als supranationale organisatie regels opleggen die in alle lidstaten gelden.",
  ],
};

// ══════════════════════════════════════════════════════════════════════
// CONTENT — 3.5.2 Naar het examen: NS treinkaartprijs stijging
// ══════════════════════════════════════════════════════════════════════

const DOC_352 = {
  nr: "3.5.2",
  naam: "Naar het examen",
  outputPath: path.join(OUTPUT_BASE,
    "3.5.2 Paragraaf 2 - Naar het examen/2. Leren",
    "3.5.2 Naar het examen \u2013 nieuws met visual.docx"
  ),
  headline: "NS verhoogt treinkaartprijs met 8,6%",
  svg: svgNSCostBreakdown(),
  article: [
    "De NS verhoogt per januari 2025 de treinkaartprijzen met gemiddeld 8,6% \u2014 de grootste stijging in jaren. Een enkele reis van \u20AC20 kost straks \u20AC21,72. De NS wijst op fors gestegen energiekosten en hogere infrastructuurheffingen van ProRail.",

    "Consumentenorganisaties protesteren tegen de verhoging. De NS is de enige aanbieder op het hoofdrailnet: een concessiemonopolie. De overheid bepaalt de maximale prijsstijging via de concessievoorwaarden.",
  ],
  source: "Bron: NS Jaarverslag / NOS, januari 2025",
  questions: [
    "NS is de enige aanbieder van treinvervoer op het hoofdrailnet. Welke marktvorm is dit?",
    "Bekijk de visual. Welke kostenpost steeg het sterkst tussen 2023 en 2025?",
    "De overheid verleent NS een concessie voor het hoofdrailnet. Leg uit waarom de overheid dit doet in plaats van vrije concurrentie toe te staan.",
    "Bereken hoeveel een treinkaartje van \u20AC20 kost na de prijsverhoging van 8,6%.",
    "Consumentenorganisaties protesteren. Leg uit waarom de prijselasticiteit van de vraag naar treinreizen relatief laag is.",
    "De overheid overweegt een maximumprijs in te stellen. Leg uit welk effect dit heeft op het aanbod van NS.",
  ],
  answers: [
    "Een monopolie \u2014 NS is de enige aanbieder op het hoofdrailnet (concessiemonopolie).",
    "Energie \u2014 deze steeg van circa 15% naar circa 22% van de totale kosten.",
    "Het spoornetwerk is een natuurlijk monopolie (hoge vaste kosten, \u00E9\u00E9n netwerk). Vrije concurrentie zou leiden tot ineffici\u00EBntie of onveiligheid. Via een concessie kan de overheid voorwaarden stellen aan prijs en kwaliteit.",
    "\u20AC20 \u00D7 1,086 = \u20AC21,72.",
    "Veel reizigers hebben geen goed alternatief (woon-werkverkeer, geen auto). De vraag reageert daarom weinig op prijsveranderingen \u2014 de prijselasticiteit is inelastisch (Ev < 1).",
    "Als de maximumprijs lager is dan de huidige prijs, zal NS minder aanbieden (minder treinen, minder onderhoud) omdat de opbrengst per reiziger daalt terwijl de kosten gelijk blijven. Er kan een vraagoverschot ontstaan (volle treinen).",
  ],
};

// ── MAIN ──

(async () => {
  try {
    await buildNieuws(DOC_351);
    await buildNieuws(DOC_352);
    console.log("\nDone! Both files created with real SVG-rendered visuals.");
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
})();
