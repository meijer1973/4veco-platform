/**
 * Samenvatting — Boek 1, paragraaf 1.1.1 Schaarste en economisch denken
 *
 * TABLE-BASED infographic layout (§B9 hard rule) — paragraph plan prescribes a
 * 3-row × 2-column cell layout:
 *
 *   Rij 1 | Wat is schaarste? (def + fig_1)      | Schaarste in de praktijk
 *   Rij 2 | Alternatieve kosten (def + fig_2)    | Pitfalls (warning)
 *   Rij 3 | Economisch denken 3-stappen (fig_3)  | Mini-worked-example (we_1)
 *
 * Domain colours:
 *   - Row 1   teal   (economisch / schaarste-domein)
 *   - Row 2a  blue   (alternatieve kosten)
 *   - Row 2b  amber  (pitfalls / warning)
 *   - Row 3   green  (procedure)
 *
 * Four summary-adapted visuals embedded from ../_assets/ (fig_1, fig_2, fig_3, we_1).
 * Single page A4 portrait.
 *
 * Run from C:/Projects/4veco/4veco-platform:
 *   node build-scripts/content/book-1/b1-111-samenvatting.js
 *
 * Adapted from build-scripts/content/module-3/samenvatting-351-352-rebuild.js.
 */
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, ImageRun,
} = require(path.join(process.env.NODE_PATH || require("child_process").execSync("npm root -g").toString().trim(), "docx"));

// ── PAGE SETUP (A4 portrait, narrow margins) ──
const PAGE = {
  size: { width: 11906, height: 16838 },
  margin: { top: 540, right: 540, bottom: 540, left: 540 },
};
const CW = 10826;                              // content width in dxa
const halfW = Math.floor((CW - 200) / 2);      // two-column width (200 spacer)

// ── COLOURS (same palette family as module-3 samenvatting) ──
const C = {
  teal:      "117A65",
  tealLt:    "E8F6F3",
  tealDk:    "0E6655",
  blue:      "1A5276",
  blueLt:    "EBF5FB",
  blueDk:    "154360",
  amber:     "E67E22",
  amberLt:   "FEF5E7",
  amberDk:   "BA6A1C",
  green:     "1E8449",
  greenLt:   "E8F8F0",
  greenDk:   "186A3B",
  navy:      "1E2761",
  white:     "FFFFFF",
  dark:      "2D3748",
  gray:      "718096",
  lightGray: "F7F8FA",
  red:       "D9534F",
  lightRed:  "FDE8E8",
};

const noBorder = {
  top:    { style: BorderStyle.NONE, size: 0, color: C.white },
  bottom: { style: BorderStyle.NONE, size: 0, color: C.white },
  left:   { style: BorderStyle.NONE, size: 0, color: C.white },
  right:  { style: BorderStyle.NONE, size: 0, color: C.white },
};

function colorBorder(color) {
  return {
    top:    { style: BorderStyle.SINGLE, size: 1, color },
    bottom: { style: BorderStyle.SINGLE, size: 1, color },
    left:   { style: BorderStyle.SINGLE, size: 1, color },
    right:  { style: BorderStyle.SINGLE, size: 1, color },
  };
}

const sp = (after = 60) => new Paragraph({ spacing: { after }, children: [] });

// ── ASSETS ──
const ASSETS_DIR = path.resolve(
  "C:/Projects/4veco/4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/" +
  "1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/_assets"
);

function embeddedImage(filename, width, height, htmlAssetName = filename.replace(/\.png$/i, "")) {
  const buf = fs.readFileSync(path.join(ASSETS_DIR, filename));
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 40 },
    children: [new ImageRun({
      data: buf,
      transformation: { width, height },
      type: "png",
      altText: { title: htmlAssetName, description: "asset:" + htmlAssetName, name: htmlAssetName },
    })],
  });
}

// ── TITLE BANNER ──
function titleBanner(number, title, subtitle) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: colorBorder(C.teal),
      shading: { fill: C.teal, type: ShadingType.CLEAR },
      margins: { top: 140, bottom: 140, left: 280, right: 280 },
      width: { size: CW, type: WidthType.DXA },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: `${number}  `, font: "Arial", size: 32, color: C.tealLt, bold: true }),
            new TextRun({ text: title, font: "Arial", size: 32, color: C.white, bold: true }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { before: 40 },
          children: [new TextRun({ text: subtitle, font: "Arial", size: 20, color: C.tealLt, italics: true })],
        }),
      ],
    })] })],
  });
}

// ── CELL HELPERS ──
function heading(text, color) {
  return new Paragraph({
    alignment: AlignmentType.LEFT, spacing: { after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 20, bold: true, color })],
  });
}

function bodyLine(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.LEFT, spacing: { after: opts.after ?? 30 },
    children: [new TextRun({
      text,
      font: opts.font || "Arial",
      size: opts.size || 17,
      color: opts.color || C.dark,
      bold: !!opts.bold,
      italics: !!opts.italics,
    })],
  });
}

function bullet(text, bulletChar = "•") {
  return new Paragraph({
    alignment: AlignmentType.LEFT, spacing: { after: 20 },
    children: [new TextRun({ text: `${bulletChar}  ${text}`, font: "Arial", size: 17, color: C.dark })],
  });
}

function coloredCell(accentColor, bgColor, children) {
  return new TableCell({
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 6, color: accentColor },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: bgColor },
      left:   { style: BorderStyle.SINGLE, size: 1, color: bgColor },
      right:  { style: BorderStyle.SINGLE, size: 1, color: bgColor },
    },
    shading: { fill: bgColor, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    width: { size: halfW, type: WidthType.DXA },
    children,
  });
}

function spacerCell(width = 200) {
  return new TableCell({
    borders: noBorder,
    width: { size: width, type: WidthType.DXA },
    children: [sp(0)],
  });
}

// ════════════════════════════════════════════════════════════════════
//  CELL BUILDERS — 3 rows × 2 columns
// ════════════════════════════════════════════════════════════════════

// ── Rij 1 · Kolom 1 — Wat is schaarste? (teal + fig_1 thumbnail) ──
function cell_R1C1() {
  return coloredCell(C.teal, C.tealLt, [
    heading("Wat is schaarste?", C.tealDk),
    bodyLine(
      "Onze behoeften zijn groter dan de middelen die we hebben " +
      "(tijd, geld, grondstoffen). Daardoor moeten we kiezen."
    ),
    bodyLine("→  Schaarste is het startpunt van elk economisch probleem.",
      { italics: true, color: C.tealDk, after: 40 }),
    embeddedImage("1.1.1_fig_1_summary.png", 230, 133, "1.1.1_fig_1"),
    bodyLine("Behoeften (onbegrensd) → schaarste-filter → keuze.",
      { size: 14, color: C.gray, italics: true, after: 0 }),
  ]);
}

// ── Rij 1 · Kolom 2 — Schaarste in de praktijk (teal, mini-tabel) ──
function cell_R1C2() {
  const innerCol = Math.floor((halfW - 300) / 3);

  function head(text) {
    return new TableCell({
      borders: colorBorder(C.teal),
      shading: { fill: C.teal, type: ShadingType.CLEAR },
      margins: { top: 30, bottom: 30, left: 50, right: 50 },
      width: { size: innerCol, type: WidthType.DXA },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text, font: "Arial", size: 15, bold: true, color: C.white }),
      ]})],
    });
  }
  function cel(text, fill) {
    return new TableCell({
      borders: colorBorder(C.tealLt),
      shading: { fill: fill || C.white, type: ShadingType.CLEAR },
      margins: { top: 25, bottom: 25, left: 50, right: 50 },
      width: { size: innerCol, type: WidthType.DXA },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text, font: "Arial", size: 14, color: C.dark }),
      ]})],
    });
  }

  return coloredCell(C.teal, C.tealLt, [
    heading("Schaarste in de praktijk", C.tealDk),
    bodyLine("Voor iedereen — niet alleen voor wie „weinig heeft”.", { after: 80 }),
    new Table({
      width: { size: halfW - 280, type: WidthType.DXA },
      columnWidths: [innerCol, innerCol, innerCol],
      rows: [
        new TableRow({ children: [head("Wie?"), head("Schaars middel"), head("Keuze")] }),
        new TableRow({ children: [
          cel("Scholier (Lisa)", C.lightGray), cel("€20 zakgeld"), cel("Film óf boek"),
        ]}),
        new TableRow({ children: [
          cel("Boer", C.lightGray), cel("10 ha land"), cel("Tarwe óf maïs"),
        ]}),
        new TableRow({ children: [
          cel("Overheid", C.lightGray), cel("Belastinggeld"), cel("Onderwijs óf zorg"),
        ]}),
      ],
    }),
    bodyLine("Schaarste ≠ weinig. Ook €20 of 10 ha is schaars zodra je moet kiezen.",
      { size: 14, italics: true, color: C.tealDk, after: 0 }),
  ]);
}

// ── Rij 2 · Kolom 1 — Alternatieve kosten (blue + fig_2 thumbnail) ──
function cell_R2C1() {
  return coloredCell(C.blue, C.blueLt, [
    heading("Alternatieve kosten", C.blueDk),
    bodyLine(
      "De opbrengst van het één beste alternatief dat je niet gekozen hebt."
    ),
    // Formula strip
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { before: 40, after: 40 },
      children: [new TextRun({
        text: "alt.kosten = opbrengst beste niet-gekozen alternatief",
        font: "Consolas", size: 16, bold: true, color: C.blueDk,
      })],
    }),
    embeddedImage("1.1.1_fig_2_summary.png", 230, 133, "1.1.1_fig_2"),
    bodyLine("Twee alternatieven → pijl wijst het niet-gekozen alternatief aan.",
      { size: 14, color: C.gray, italics: true, after: 0 }),
  ]);
}

// ── Rij 2 · Kolom 2 — Pitfalls (amber / warning) ──
function cell_R2C2() {
  return coloredCell(C.amber, C.amberLt, [
    heading("⚠  Pitfalls", C.amberDk),
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "✘  ", font: "Arial", size: 18, bold: true, color: C.amberDk }),
      new TextRun({ text: "alt.kosten ≠ prijs.  ", font: "Arial", size: 17, bold: true, color: C.dark }),
      new TextRun({
        text: "Het gaat om de opbrengst die je misloopt, niet om wat je betaalt.",
        font: "Arial", size: 17, color: C.dark,
      }),
    ]}),
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "✘  ", font: "Arial", size: 18, bold: true, color: C.amberDk }),
      new TextRun({ text: "Niet alle alternatieven optellen.  ", font: "Arial", size: 17, bold: true, color: C.dark }),
      new TextRun({
        text: "Alleen het beste niet-gekozen alternatief telt, niet de som van alle andere opties.",
        font: "Arial", size: 17, color: C.dark,
      }),
    ]}),
    new Paragraph({ spacing: { after: 0 }, children: [
      new TextRun({ text: "✘  ", font: "Arial", size: 18, bold: true, color: C.amberDk }),
      new TextRun({ text: "Schaarste ≠ zeldzaamheid.  ", font: "Arial", size: 17, bold: true, color: C.dark }),
      new TextRun({
        text: "Iets is schaars zodra er gekozen moet worden, ook als er veel van is.",
        font: "Arial", size: 17, color: C.dark,
      }),
    ]}),
  ]);
}

// ── Rij 3 · Kolom 1 — Economisch denken, 3-stappen (green + fig_3) ──
function cell_R3C1() {
  return coloredCell(C.green, C.greenLt, [
    heading("Economisch denken — 3 stappen", C.greenDk),
    new Paragraph({ spacing: { after: 25 }, children: [
      new TextRun({ text: "1.  ", font: "Arial", size: 17, bold: true, color: C.greenDk }),
      new TextRun({ text: "Welke ", font: "Arial", size: 17, color: C.dark }),
      new TextRun({ text: "alternatieven", font: "Arial", size: 17, bold: true, color: C.dark }),
      new TextRun({ text: " zijn er?", font: "Arial", size: 17, color: C.dark }),
    ]}),
    new Paragraph({ spacing: { after: 25 }, children: [
      new TextRun({ text: "2.  ", font: "Arial", size: 17, bold: true, color: C.greenDk }),
      new TextRun({ text: "Wat ", font: "Arial", size: 17, color: C.dark }),
      new TextRun({ text: "levert", font: "Arial", size: 17, bold: true, color: C.dark }),
      new TextRun({ text: " elk alternatief op?", font: "Arial", size: 17, color: C.dark }),
    ]}),
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "3.  ", font: "Arial", size: 17, bold: true, color: C.greenDk }),
      new TextRun({ text: "Wat ", font: "Arial", size: 17, color: C.dark }),
      new TextRun({ text: "geef je op", font: "Arial", size: 17, bold: true, color: C.dark }),
      new TextRun({ text: " als je kiest? (= alt.kosten)", font: "Arial", size: 17, color: C.dark }),
    ]}),
    embeddedImage("1.1.1_fig_3_summary.png", 230, 133, "1.1.1_fig_3"),
    bodyLine("Alternatieven → Opbrengsten → Wat geef je op?",
      { size: 14, color: C.gray, italics: true, after: 0 }),
  ]);
}

// ── Rij 3 · Kolom 2 — Mini-worked-example tarwe vs maïs (green + we_1) ──
function cell_R3C2() {
  const innerCol = Math.floor((halfW - 300) / 3);

  function head(text) {
    return new TableCell({
      borders: colorBorder(C.green),
      shading: { fill: C.green, type: ShadingType.CLEAR },
      margins: { top: 25, bottom: 25, left: 40, right: 40 },
      width: { size: innerCol, type: WidthType.DXA },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text, font: "Arial", size: 14, bold: true, color: C.white }),
      ]})],
    });
  }
  function cel(text, bold = false, fill) {
    return new TableCell({
      borders: colorBorder(C.greenLt),
      shading: { fill: fill || C.white, type: ShadingType.CLEAR },
      margins: { top: 25, bottom: 25, left: 40, right: 40 },
      width: { size: innerCol, type: WidthType.DXA },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text, font: "Arial", size: 14, color: C.dark, bold }),
      ]})],
    });
  }

  return coloredCell(C.green, C.greenLt, [
    heading("Mini-voorbeeld — tarwe vs maïs", C.greenDk),
    bodyLine("Boer met 10 ha, opbrengst per ha:", { after: 50 }),
    new Table({
      width: { size: halfW - 280, type: WidthType.DXA },
      columnWidths: [innerCol, innerCol, innerCol],
      rows: [
        new TableRow({ children: [head("Gewas"), head("€/ha"), head("Totaal × 10 ha")] }),
        new TableRow({ children: [
          cel("Tarwe", true, C.greenLt), cel("€ 500"), cel("€ 5.000", true),
        ]}),
        new TableRow({ children: [
          cel("Maïs"), cel("€ 350"), cel("€ 3.500"),
        ]}),
      ],
    }),
    new Paragraph({ spacing: { before: 60, after: 30 }, children: [
      new TextRun({ text: "Kies tarwe → alt.kosten = ", font: "Arial", size: 15, color: C.dark }),
      new TextRun({ text: "€ 3.500", font: "Consolas", size: 15, bold: true, color: C.greenDk }),
      new TextRun({ text: " (gemiste maïsopbrengst).", font: "Arial", size: 15, color: C.dark }),
    ]}),
    embeddedImage("1.1.1_we_1_summary.png", 230, 133, "1.1.1_we_1"),
    bodyLine("Vergelijking tarwe vs maïs met alt.kosten-annotatie.",
      { size: 14, color: C.gray, italics: true, after: 0 }),
  ]);
}

// ════════════════════════════════════════════════════════════════════
//  BUILD
// ════════════════════════════════════════════════════════════════════

async function buildChildren() {
  const children = [];

  children.push(titleBanner(
    "1.1.1",
    "Schaarste en economisch denken",
    "Samenvatting — één A4 met de kern van deze paragraaf"
  ));
  children.push(sp(80));

  // 3-row × 2-column infographic table
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [halfW, 200, halfW],
    rows: [
      new TableRow({ children: [cell_R1C1(), spacerCell(), cell_R1C2()] }),
    ],
  }));
  children.push(sp(80));
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [halfW, 200, halfW],
    rows: [
      new TableRow({ children: [cell_R2C1(), spacerCell(), cell_R2C2()] }),
    ],
  }));
  children.push(sp(80));
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [halfW, 200, halfW],
    rows: [
      new TableRow({ children: [cell_R3C1(), spacerCell(), cell_R3C2()] }),
    ],
  }));

  return children;
}

async function build() {
  const OUTPUT_DIR =
    "C:/Projects/4veco/4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/" +
    "1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken";
  const OUTPUT_PATH = path.join(
    OUTPUT_DIR,
    "1.1.1 Schaarste en economisch denken – samenvatting.docx"
  );

  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
    sections: [{
      properties: { page: PAGE },
      children: await buildChildren(),
    }],
  });

  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(OUTPUT_PATH, buf);
  console.log(`Generated: ${path.basename(OUTPUT_PATH)} (${(buf.length / 1024).toFixed(1)} KB)`);
  console.log(`Path: ${OUTPUT_PATH}`);
}

build().catch(err => { console.error(err); process.exit(1); });
