/**
 * Book 1 - Paragraph 1.1.1 Schaarste en economisch denken
 * Uitleg vaardigheden (Template A)
 *
 * Two skill sections anchored to unit registry:
 *   - Skill 1: Schaarste herkennen in een situatie (B01, understand, teal)
 *   - Skill 2: Alternatieve kosten berekenen (B02, apply, blue)
 *
 * Skill 2's "Hoe werkt het?" procedure is taken VERBATIM from
 * references/machine/micro-teaching-units.json B02.procedure (4 steps).
 *
 * Dual coding: doc-adapted visual variants embedded in Word; HTML uses themed web variants.
 *
 * Output: flat paragraph-root layout (no "2. Leren" subfolder).
 *
 * Run from 4veco-platform/:
 *   node build-scripts/content/book-1/b1-111-vaardigheden.js
 */
const path = require("path");
const fs = require("fs");

// Global npm modules path
const NODE_PATH = path.join(process.env.APPDATA, "npm", "node_modules");
process.env.NODE_PATH = NODE_PATH;
require("module").Module._initPaths();

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType,
  Header, Footer, PageNumber, LevelFormat, PageBreak, ImageRun,
} = require("docx");

// ─── Paths ───
const PARAGRAPH_DIR = path.resolve(
  __dirname, "..", "..", "..", "..",
  "4veco-lessen",
  "Boek 1 - Grondslagen, vraag en aanbod",
  "1.1 Hoofdstuk Economisch denken en rekenen",
  "1.1.1 Schaarste en economisch denken"
);
const ASSETS_DIR = path.join(PARAGRAPH_DIR, "_assets");
const OUT_DIR = PARAGRAPH_DIR; // flat layout at paragraph root
const OUT_FILE = path.join(OUT_DIR, "1.1.1 Schaarste en economisch denken – uitleg vaardigheden.docx");

// ─── Alt-text registry for §1.1.1 (L1.5V Bucket A4) ───
const ALT = require("./b1-111-alt-text");

// ─── Dual coding: embed adapted PNG variants from _assets/ ───
// L1.5V Bucket A4: altText is required (>= 10 chars). Builder fails loudly
// when missing. descr prefix `asset-alt:` is the convention recognised by
// convert_vaardigheden.py for meaningful alt-text passthrough.
function embedAssetImage(filename, width, height, htmlAssetName, altText) {
  if (!altText || altText.length < 10) {
    throw new Error(`embedAssetImage: altText required (>=10 chars) for ${htmlAssetName}, got: ${JSON.stringify(altText)}`);
  }
  const imgPath = path.join(ASSETS_DIR, filename + ".png");
  if (!fs.existsSync(imgPath)) {
    console.warn("WARNING: asset missing:", imgPath);
    return null;
  }
  const buf = fs.readFileSync(imgPath);
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    alignment: AlignmentType.CENTER,
    children: [new ImageRun({
      data: buf, transformation: { width, height }, type: "png",
      altText: { title: htmlAssetName, description: "asset-alt:" + altText, name: htmlAssetName },
    })],
  });
}

// ─── Page setup ───
const PAGE = { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } };
const CW = 9026;

// ─── Color palette ───
const C = {
  navy: "1E2761", white: "FFFFFF", dark: "2D3748", gray: "718096",
  lightGray: "F7F8FA", borderGray: "CBD5E0", red: "D9534F", lightRed: "FDE8E8",
  blue: "1A5276", lightBlue: "EBF5FB", green: "1E8449", lightGreen: "E8F5E9",
  rowAlt: "F7FAFC",
};

// ─── Domain system ───
// Two "economisch" domains — colour-coded so B01 (teal) and B02 (blue) are
// visually distinct while both clearly belonging to the economic-thinking cluster.
const DOMAINS = {
  economischTeal: { label: "Economisch denken", color: "17A2B8", light: "E8F8FB", dark: "117A8B" },
  economischBlue: { label: "Economisch rekenen", color: "1A5276", light: "EBF5FB", dark: "154360" },
};

// ─── Basic helpers ───
const sp = (after = 80) => new Paragraph({ spacing: { after }, children: [] });

const p = (text, opts = {}) => new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({ text, font: "Arial", size: 22, color: C.dark, ...opts })],
});

const h2d = (text, domainColor) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 200, after: 120 },
  children: [new TextRun({ text, bold: true, font: "Arial", size: 24, color: domainColor })],
});

const bullet = (text, opts = {}) => new Paragraph({
  spacing: { after: 80 },
  bullet: { level: 0 },
  children: [new TextRun({ text, font: "Arial", size: 22, color: C.dark, ...opts })],
});

// ─── Title block ───
function titleBlock(title, subtitle) {
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
      children: [new TextRun({ text: title, bold: true, font: "Arial", size: 48, color: C.navy })],
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
      children: [new TextRun({ text: subtitle, font: "Arial", size: 26, color: C.gray })],
    }),
  ];
}

// ─── Header / Footer ───
function makeHeader(text) {
  return new Header({ children: [
    new Paragraph({ alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text, font: "Arial", size: 18, color: C.gray, italics: true })],
    }),
  ]});
}
function makeFooter() {
  return new Footer({ children: [
    new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "Pagina ", font: "Arial", size: 18, color: C.gray }),
      new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: C.gray }),
    ]}),
  ]});
}

// ─── Domain Banner ───
function domainBanner(domainKey, skillNumber, skillTitle, domainSet = DOMAINS) {
  const d = domainSet[domainKey];
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [600, CW - 600],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: {
          top:    { style: BorderStyle.SINGLE, size: 1, color: d.color },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: d.color },
          left:   { style: BorderStyle.SINGLE, size: 1, color: d.color },
          right:  { style: BorderStyle.NONE, size: 0, color: d.color },
        },
        shading: { fill: d.color, type: ShadingType.CLEAR },
        margins: { top: 140, bottom: 140, left: 120, right: 80 },
        width: { size: 600, type: WidthType.DXA },
        verticalAlign: "center",
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: String(skillNumber), bold: true, font: "Arial", size: 32, color: C.white })],
        })],
      }),
      new TableCell({
        borders: {
          top:    { style: BorderStyle.SINGLE, size: 1, color: d.color },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: d.color },
          left:   { style: BorderStyle.NONE, size: 0, color: d.color },
          right:  { style: BorderStyle.SINGLE, size: 1, color: d.color },
        },
        shading: { fill: d.light, type: ShadingType.CLEAR },
        margins: { top: 140, bottom: 140, left: 200, right: 200 },
        width: { size: CW - 600, type: WidthType.DXA },
        verticalAlign: "center",
        children: [
          new Paragraph({
            children: [new TextRun({ text: skillTitle, bold: true, font: "Arial", size: 28, color: d.dark })],
          }),
          new Paragraph({
            spacing: { before: 40 },
            children: [new TextRun({ text: d.label, font: "Arial", size: 18, color: d.color, italics: true })],
          }),
        ],
      }),
    ] })],
  });
}

// ─── Formula / step box ───
function formulaBox(lines, accentColor = C.borderGray) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 1, color: C.borderGray },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: C.borderGray },
        left:   { style: BorderStyle.SINGLE, size: 8, color: accentColor },
        right:  { style: BorderStyle.SINGLE, size: 1, color: C.borderGray },
      },
      shading: { fill: C.lightGray, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 240, right: 200 },
      width: { size: CW, type: WidthType.DXA },
      children: lines.map(line => new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: line, font: "Consolas", size: 22, color: C.dark })],
      })),
    })] })],
  });
}

// ─── Tip / Warning / Check boxes ───
function tipBox(text, color = C.blue, bg = C.lightBlue, label = "✨ Tip: ") {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 1, color: bg },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: bg },
        left:   { style: BorderStyle.SINGLE, size: 12, color: color },
        right:  { style: BorderStyle.SINGLE, size: 1, color: bg },
      },
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      width: { size: CW, type: WidthType.DXA },
      children: [new Paragraph({ children: [
        new TextRun({ text: label, bold: true, font: "Arial", size: 22, color }),
        new TextRun({ text, font: "Arial", size: 22, color: C.dark }),
      ]})],
    })] })],
  });
}

function warningBox(text) {
  return tipBox(text, C.red, C.lightRed, "⚠ Let op: ");
}

function checkBox(text) {
  return tipBox(text, C.green, C.lightGreen, "✅ Controle: ");
}

// ─── Summary schema ───
function summarySchema(rows, domainColor) {
  const col1W = Math.round(CW * 0.28);
  const col2W = CW - col1W;
  const hdrBrd = {
    top:    { style: BorderStyle.SINGLE, size: 1, color: domainColor },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: domainColor },
    left:   { style: BorderStyle.SINGLE, size: 1, color: domainColor },
    right:  { style: BorderStyle.SINGLE, size: 1, color: domainColor },
  };
  const rowBrd = {
    top:    { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
    left:   { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
    right:  { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
  };
  const cellM = { top: 80, bottom: 80, left: 140, right: 140 };

  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [col1W, col2W],
    rows: [
      new TableRow({ children: [
        new TableCell({
          borders: hdrBrd,
          shading: { fill: domainColor, type: ShadingType.CLEAR },
          margins: cellM, width: { size: CW, type: WidthType.DXA },
          columnSpan: 2,
          children: [new Paragraph({ children: [
            new TextRun({ text: "📋 Samenvatting", bold: true, font: "Arial", size: 22, color: C.white }),
          ]})],
        }),
      ]}),
      ...rows.map((r, i) => new TableRow({ children: [
        new TableCell({
          borders: rowBrd,
          shading: { fill: i % 2 === 0 ? C.rowAlt : C.white, type: ShadingType.CLEAR },
          margins: cellM, width: { size: col1W, type: WidthType.DXA },
          children: [new Paragraph({ children: [
            new TextRun({ text: r[0], bold: true, font: "Arial", size: 20, color: domainColor }),
          ]})],
        }),
        new TableCell({
          borders: rowBrd,
          shading: { fill: i % 2 === 0 ? C.rowAlt : C.white, type: ShadingType.CLEAR },
          margins: cellM, width: { size: col2W, type: WidthType.DXA },
          children: [new Paragraph({ children: [
            new TextRun({ text: r[1], font: "Arial", size: 20, color: C.dark }),
          ]})],
        }),
      ]})),
    ],
  });
}

// ─── Visual TOC (4 columns) ───
function visualTOC(skills, domainSet = DOMAINS) {
  const colNr = 500, colTitle = 3200, colDesc = 3726, colDomain = 1600;
  const rowBrd = { top: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" }, left: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" }, right: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" } };
  const hdrBrd = { top: { style: BorderStyle.SINGLE, size: 1, color: C.navy }, bottom: { style: BorderStyle.SINGLE, size: 2, color: C.navy }, left: { style: BorderStyle.SINGLE, size: 1, color: C.navy }, right: { style: BorderStyle.SINGLE, size: 1, color: C.navy } };
  const cellM = { top: 100, bottom: 100, left: 120, right: 120 };

  const headerRow = new TableRow({ children: [
    ...[["Nr.", colNr], ["Vaardigheid", colTitle], ["Omschrijving", colDesc], ["Domein", colDomain]].map(([txt, w]) =>
      new TableCell({
        borders: hdrBrd, shading: { fill: C.navy, type: ShadingType.CLEAR },
        margins: cellM, width: { size: w, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: txt, bold: true, font: "Arial", size: 20, color: C.white })] })],
      })
    ),
  ]});

  const dataRows = skills.map((s, i) => {
    const d = domainSet[s.domain];
    return new TableRow({ children: [
      new TableCell({ borders: rowBrd, shading: { fill: d.light, type: ShadingType.CLEAR }, margins: cellM, width: { size: colNr, type: WidthType.DXA }, verticalAlign: "center",
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s.nr, bold: true, font: "Arial", size: 22, color: d.color })] })], }),
      new TableCell({ borders: rowBrd, shading: { fill: i % 2 === 0 ? "FAFBFC" : C.white, type: ShadingType.CLEAR }, margins: cellM, width: { size: colTitle, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: s.title, bold: true, font: "Arial", size: 21, color: C.dark })] })], }),
      new TableCell({ borders: rowBrd, shading: { fill: i % 2 === 0 ? "FAFBFC" : C.white, type: ShadingType.CLEAR }, margins: cellM, width: { size: colDesc, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: s.desc, font: "Arial", size: 20, color: C.gray })] })], }),
      new TableCell({ borders: rowBrd, shading: { fill: d.light, type: ShadingType.CLEAR }, margins: cellM, width: { size: colDomain, type: WidthType.DXA }, verticalAlign: "center",
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: d.label, bold: true, font: "Arial", size: 18, color: d.color })] })], }),
    ]});
  });

  return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [colNr, colTitle, colDesc, colDomain], rows: [headerRow, ...dataRows] });
}

// ─── Domain legend ───
function domainLegend(domainSet = DOMAINS) {
  const entries = Object.values(domainSet);
  const colW = Math.floor(CW / entries.length);
  const lastColW = CW - colW * (entries.length - 1);
  const cellM = { top: 80, bottom: 80, left: 100, right: 100 };
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: entries.map((_, i) => i === entries.length - 1 ? lastColW : colW),
    rows: [new TableRow({ children: entries.map((d, i) =>
      new TableCell({
        borders: {
          top:    { style: BorderStyle.SINGLE, size: 6, color: d.color },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: d.light },
          left:   { style: BorderStyle.SINGLE, size: 1, color: d.light },
          right:  { style: BorderStyle.SINGLE, size: 1, color: d.light },
        },
        shading: { fill: d.light, type: ShadingType.CLEAR },
        margins: cellM,
        width: { size: i === entries.length - 1 ? lastColW : colW, type: WidthType.DXA },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: d.label, bold: true, font: "Arial", size: 20, color: d.color }),
        ]})],
      })
    ) })],
  });
}

// ─── DOC_STYLES ───
// Run formatting + paragraph spacing for headings is set inline on every
// Paragraph/TextRun. The custom paragraphStyles with id "Heading1"/"Heading2"
// collided with Word's built-in style IDs and broke the artifact-tool renderer
// (L1.5V QA-1). Removed; inline overrides preserve the rendered look.
const DOC_STYLES = {
  default: { document: { run: { font: "Arial", size: 22 } } },
};

// ─── Checklist numbering / item ───
const CHECKLIST_NUMBERING = {
  reference: "checklist",
  levels: [{ level: 0, format: LevelFormat.BULLET, text: "☐",
    alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 720, hanging: 360 } } },
  }],
};

function checklistItem(text) {
  return new Paragraph({
    numbering: { reference: "checklist", level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22 })],
  });
}

// ════════════════════════════════════════════════════
// B02 PROCEDURE — verbatim from micro-teaching-units.json
// ════════════════════════════════════════════════════
// DO NOT EDIT — these four strings must stay identical to
// references/machine/micro-teaching-units.json → B02.procedure.
const B02_PROCEDURE = [
  "Benoem alle beschikbare alternatieven voor de middelen (tijd, geld, grondstoffen).",
  "Bereken voor elk alternatief de opbrengst (of verwachte opbrengst).",
  "Rangschik de alternatieven; het niet-gekozen alternatief met de hoogste opbrengst zijn de alternatieve kosten.",
  "Vergelijk de opbrengst van de daadwerkelijke keuze met deze alternatieve kosten om de nettowaarde van de keuze te beoordelen.",
];

// ════════════════════════════════════════════════════
// SKILLS DATA (Visual TOC)
// ════════════════════════════════════════════════════
const skills = [
  { nr: "1", title: "Schaarste herkennen in een situatie", desc: "Behoeften vs. middelen — wanneer moet je kiezen?", domain: "economischTeal" },
  { nr: "2", title: "Alternatieve kosten berekenen",       desc: "De opbrengst van het beste niet-gekozen alternatief", domain: "economischBlue" },
];

// ════════════════════════════════════════════════════
// BUILD SECTION CHILDREN
// ════════════════════════════════════════════════════
const children = [];

// ── Title + TOC (single page) ──
children.push(...titleBlock(
  "Schaarste en economisch denken — Vaardigheden",
  "Welke vaardigheden leer je in deze paragraaf?"
));
children.push(sp(80));
children.push(domainLegend(DOMAINS));
children.push(sp(120));
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 120 },
  children: [new TextRun({ text: "Inhoudsopgave", bold: true, font: "Arial", size: 36, color: C.navy })],
}));
children.push(sp(60));
children.push(visualTOC(skills, DOMAINS));

// ════════════════════════════════════════════════════
// SKILL 1 — Schaarste herkennen in een situatie  (B01, understand)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economischTeal", 1, "Schaarste herkennen in een situatie"));
children.push(sp(120));

// Waarom
children.push(h2d("Waarom is dit belangrijk?", DOMAINS.economischTeal.color));
children.push(p("Schaarste is het startpunt van élk economisch probleem. Zolang je alles kunt hebben, hoef je niet te kiezen — en is er geen economie. Zodra middelen (tijd, geld, grondstoffen) beperkt zijn ten opzichte van wat mensen willen, ontstaan keuzes, alternatieve kosten en handel. Wie schaarste kan herkennen, snapt waarom een onderwerp überhaupt economisch is."));
children.push(sp(40));

// Hoe
children.push(h2d("Hoe werkt het?", DOMAINS.economischTeal.color));
children.push(p("Om te bepalen of er in een situatie sprake is van schaarste, loop je drie checks af:"));
children.push(bullet("Check 1 — Zijn de behoeften groter dan de beschikbare middelen? (willen meer mensen iets dan er beschikbaar is?)"));
children.push(bullet("Check 2 — Moet er gekozen worden? (kan niet iedereen alles krijgen wat hij of zij wil?)"));
children.push(bullet("Check 3 — Welke middelen zijn schaars? (tijd, geld, grond, grondstoffen, aandacht, ruimte …)"));
children.push(sp(40));
children.push(p("Als het antwoord op check 1 en check 2 ja is, is er schaarste. Check 3 benoemt het concrete schaarse middel — dat heb je nodig voor elke vervolganalyse."));
children.push(sp(60));

// Visual — fig_1
const fig1 = embedAssetImage("1.1.1_fig_1_doc", 500, 320, "1.1.1_fig_1", ALT["1.1.1_fig_1"]);
if (fig1) children.push(fig1);
children.push(p("Het diagram toont een breder voorbeeld waarin meerdere wensen tegelijk om hetzelfde budget concurreren — schaarste hoeft niet beperkt te blijven tot twee opties. In het werkbeeld hieronder beperken we ons tot een eenvoudige situatie met twee wensen, om de redenering compact te houden.", { italics: true, color: C.gray, size: 18 }));
children.push(sp(60));

// Voorbeeld
children.push(h2d("Voorbeeld — scholier met €20", DOMAINS.economischTeal.color));
children.push(p("Lisa heeft op zaterdagochtend €20 gekregen. Ze wil naar de bioscoop (€12) én een nieuw boek kopen (€15)."));
children.push(bullet("Check 1: behoeften (€27) > middelen (€20) ✔"));
children.push(bullet("Check 2: Lisa kan niet beide — ze moet kiezen ✔"));
children.push(bullet("Check 3: het schaarse middel is geld (€20)"));
children.push(sp(40));
children.push(p("Conclusie: ja, er is sprake van schaarste. Het schaarse middel is Lisa’s budget."));
children.push(sp(60));

// Tip
children.push(tipBox("Schaarste is niet hetzelfde als weinig. Water is niet zeldzaam, maar op een warme dag met één flesje voor drie dorstige mensen is er wél schaarste. Het gaat om de verhouding behoeften ↔ middelen, niet om het absolute aantal."));
children.push(sp(60));

// Check
children.push(checkBox("Probeer zelf: een klas van 30 leerlingen wil computeren, maar er zijn maar 20 computers. Is er schaarste? Welke drie checks kloppen? Welk middel is schaars?"));
children.push(sp(60));

// Summary
children.push(summarySchema([
  ["Definitie", "Behoeften > beschikbare middelen → keuze onvermijdelijk"],
  ["Check 1", "Meer wensen dan middelen?"],
  ["Check 2", "Moet er gekozen worden?"],
  ["Check 3", "Welk middel is schaars? (tijd, geld, grond, …)"],
  ["Valkuil", "Schaarste ≠ weinig — het gaat om de verhouding"],
  ["Verband met", "→ Vaardigheid 2 (alternatieve kosten berekenen)"],
], DOMAINS.economischTeal.color));

// ════════════════════════════════════════════════════
// SKILL 2 — Alternatieve kosten berekenen  (B02, apply, 4 steps)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economischBlue", 2, "Alternatieve kosten berekenen"));
children.push(sp(120));

// Waarom
children.push(h2d("Waarom is dit belangrijk?", DOMAINS.economischBlue.color));
children.push(p("Wie kiest, geeft iets op. Dat wat je opgeeft — de opbrengst van het beste niet-gekozen alternatief — zijn de alternatieve kosten van je keuze. Alternatieve kosten laten zien wat een beslissing je werkelijk kost, ook als er geen prijskaartje aan hangt. Zonder dit begrip onderschat je stelselmatig de kosten van gemaakte keuzes."));
children.push(sp(40));

// Hoe — VERBATIM B02 procedure (4 steps)
children.push(h2d("Hoe werkt het? (4 stappen)", DOMAINS.economischBlue.color));
children.push(p("Deze vier stappen komen rechtstreeks uit het vaardighedenregister (unit B02) en zijn de standaardprocedure voor elke alternatieve-kosten-opgave:"));
children.push(sp(40));
children.push(formulaBox([
  "Stap 1. " + B02_PROCEDURE[0],
  "Stap 2. " + B02_PROCEDURE[1],
  "Stap 3. " + B02_PROCEDURE[2],
  "Stap 4. " + B02_PROCEDURE[3],
], DOMAINS.economischBlue.color));
children.push(sp(60));

// Visual — fig_2 (procedure diagram)
const fig3 = embedAssetImage("1.1.1_fig_3_doc", 500, 320, "1.1.1_fig_3", ALT["1.1.1_fig_3"]);
if (fig3) children.push(fig3);
children.push(sp(60));

const fig2 = embedAssetImage("1.1.1_fig_2_doc", 500, 320, "1.1.1_fig_2", ALT["1.1.1_fig_2"]);
if (fig2) children.push(fig2);
children.push(sp(60));

// Voorbeeld — boer tarwe vs maïs
children.push(h2d("Voorbeeld — boer: tarwe of maïs op 10 hectare", DOMAINS.economischBlue.color));
children.push(p("Een boer heeft 10 hectare land. Hij kan tarwe verbouwen (winst €500 per hectare) of maïs (winst €350 per hectare). Hij kiest voor tarwe. Wat zijn zijn alternatieve kosten?"));
children.push(sp(40));

children.push(p("Stap 1 — Alternatieven: tarwe of maïs (schaars middel: 10 ha land).", { bold: true }));
children.push(p("Stap 2 — Opbrengst per alternatief:", { bold: true }));
children.push(bullet("Tarwe: 10 ha × €500 = €5.000"));
children.push(bullet("Maïs: 10 ha × €350 = €3.500"));
children.push(p("Stap 3 — Rangschikken: beste niet-gekozen alternatief = maïs met €3.500. Dat zijn de alternatieve kosten.", { bold: true }));
children.push(p("Stap 4 — Nettowaarde van de keuze: €5.000 − €3.500 = €1.500 voordeel door voor tarwe te kiezen.", { bold: true }));
children.push(sp(40));

// L1.5V Bucket C2: explicit calculation table in the verbal channel.
// Mirrors the we_1 visual in text form so the student can reproduce the
// answer without inferring missing arithmetic from the visual.
children.push(p("Berekening op een rij:", { bold: true }));
children.push(summarySchema([
  ["Opbrengst tarwe (10 ha)",          "10 × €500/ha = €5.000"],
  ["Opbrengst maïs (10 ha)",           "10 × €350/ha = €3.500"],
  ["Beste niet-gekozen alternatief",   "maïs (€3.500)"],
  ["Alternatieve kosten",              "€3.500"],
  ["Nettowaarde",                      "€5.000 − €3.500 = €1.500 (voordeel tarwe)"],
], DOMAINS.economischBlue.color));
children.push(sp(40));

// Visual — we_1 (worked example diagram — second of the DUAL CODING visuals)
const we1 = embedAssetImage("1.1.1_we_1_doc", 520, 330, "1.1.1_we_1", ALT["1.1.1_we_1"]);
if (we1) children.push(we1);
children.push(sp(60));

// Tip — pitfalls from B02 registry
children.push(tipBox("Alternatieve kosten zijn niet de prijs die je betaalt. Je betaalt €12 voor de bioscoop, maar je alternatieve kosten zijn de waarde van het boek dat je daardoor niet kunt kopen."));
children.push(sp(60));
children.push(warningBox("Tel de niet-gekozen alternatieven niet bij elkaar op! Alternatieve kosten = alleen het béste niet-gekozen alternatief. Als er drie alternatieven zijn met opbrengsten €40, €30 en €15 en je kiest de eerste, dan zijn je alternatieve kosten €30 — niet €45."));
children.push(sp(60));

// Check — mini exercise
children.push(checkBox("Eva heeft 4 uur vrije tijd. Ze kan bijles geven (€40), studeren (waarde €30) of een film kijken (waarde €15). Ze kiest voor bijles. Loop de vier stappen af: wat zijn haar alternatieve kosten, en wat is de nettowaarde van haar keuze?"));
children.push(sp(60));

// Summary
children.push(summarySchema([
  ["Definitie", "Opbrengst van het beste niet-gekozen alternatief"],
  ["Stap 1", "Benoem alternatieven voor het schaarse middel"],
  ["Stap 2", "Bereken opbrengst per alternatief"],
  ["Stap 3", "Rangschik — beste niet-gekozen = alt. kosten"],
  ["Stap 4", "Nettowaarde = opbrengst keuze − alt. kosten"],
  ["Valkuil", "Alt. kosten ≠ prijs; niet optellen"],
  ["Canonical term", "“alternatieve kosten” (niet opportunity costs)"],
  ["Verband met", "← Vaardigheid 1 (schaarste als voorwaarde)"],
], DOMAINS.economischBlue.color));

// ════════════════════════════════════════════════════
// VALKUILEN (Pitfalls) — uit B01 + B02 registry
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 200 },
  children: [new TextRun({ text: "Veelvoorkomende valkuilen", bold: true, font: "Arial", size: 36, color: C.navy })],
}));
children.push(p("Let op deze veelgemaakte fouten bij het leren van deze paragraaf. De eerste twee horen bij schaarste (B01), de laatste twee bij alternatieve kosten (B02)."));
children.push(sp(100));

children.push(warningBox("“Schaarste = weinig” → Onjuist. Lucht is weinig schaars (er is heel veel van), zand op het strand is plaatselijk niet schaars. Wat telt is: beperkt ten opzichte van de vraag."));
children.push(sp(80));
children.push(warningBox("“Schaarste gaat alleen over geld” → Onjuist. Tijd, ruimte en grondstoffen zijn evengoed schaars en leiden tot alternatieve kosten."));
children.push(sp(80));
children.push(warningBox("“Alle niet-gekozen alternatieven optellen” → Onjuist. Alternatieve kosten zijn alléén het beste niet-gekozen alternatief, niet de som van de rest."));
children.push(sp(80));
children.push(warningBox("“Opportunity costs” of “opportuniteitskosten” gebruiken → Vermijd. In Nederlandse economieteksten is de canonical term “alternatieve kosten”."));

// ════════════════════════════════════════════════════
// SAMENVATTING CHECKLIST
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 200 },
  children: [new TextRun({ text: "Samenvatting checklist", bold: true, font: "Arial", size: 36, color: C.navy })],
}));
children.push(p("Controleer of je de volgende vaardigheden beheerst:"));
children.push(sp(100));

children.push(checklistItem("Ik kan de drie checks voor schaarste toepassen: behoeften > middelen, moet er gekozen worden, welk middel is schaars?"));
children.push(checklistItem("Ik herken dat schaarste niet hetzelfde is als weinig — het gaat om de verhouding."));
children.push(checklistItem("Ik weet wat alternatieve kosten zijn: de opbrengst van het beste niet-gekozen alternatief."));
children.push(checklistItem("Ik kan de 4-stappenprocedure van B02 toepassen: alternatieven benoemen, opbrengsten berekenen, rangschikken, nettowaarde bepalen."));
children.push(checklistItem("Ik tel niet-gekozen alternatieven niet op — alleen het beste niet-gekozen telt."));
children.push(checklistItem("Ik gebruik consequent de Nederlandse term “alternatieve kosten” (niet “opportunity costs”)."));

// ════════════════════════════════════════════════════
// BUILD DOCUMENT
// ════════════════════════════════════════════════════
const doc = new Document({
  styles: DOC_STYLES,
  numbering: { config: [CHECKLIST_NUMBERING] },
  sections: [
    {
      properties: { page: PAGE },
      headers: { default: makeHeader("1.1.1 Schaarste en economisch denken — Vaardigheden") },
      footers: { default: makeFooter() },
      children,
    },
  ],
});

// ─── Write to file ───
(async () => {
  try {
    if (!fs.existsSync(OUT_DIR)) {
      console.error("ERROR: Output directory does not exist:", OUT_DIR);
      process.exit(1);
    }
    if (!fs.existsSync(ASSETS_DIR)) {
      console.warn("WARNING: Assets dir missing:", ASSETS_DIR);
    }
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(OUT_FILE, buffer);
    console.log("SUCCESS: Document written to", OUT_FILE);
    console.log("File size:", buffer.length, "bytes");
  } catch (err) {
    console.error("ERROR:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();
