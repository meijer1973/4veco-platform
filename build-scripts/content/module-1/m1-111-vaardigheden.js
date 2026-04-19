/**
 * Template A: Uitleg Vaardigheden
 * Reference implementation from 3.1.1 Markt en marktstructuur.
 *
 * COMPLIANT with econ-word-templates skill — all tables use WidthType.DXA,
 * 4-column visualTOC, correct summarySchema with header row, correct
 * domainBanner, formulaBox, checkBox, tipBox, warningBox, domainLegend.
 *
 * HOW TO ADAPT FOR ANOTHER PARAGRAPH:
 * 1. Change OUT_DIR and OUT_FILE to point to the new paragraph folder
 * 2. Update DOMAINS if you need different domains
 * 3. Update the skills array for the Visual TOC
 * 4. Replace the BUILD SECTION CHILDREN content with new skill text
 * 5. Update the header text in makeHeader() call at the bottom
 * 6. Update the checklist items at the end
 * 7. Update the valkuilen (pitfalls) section
 *
 * Run: NODE_PATH="$(npm root -g)" node template-A_vaardigheden.js
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
  Header, Footer, PageNumber, LevelFormat, PageBreak,
} = require("docx");

const OUT_DIR = "C:\\Projects\\4veco\\module one claude\\1.1 Hoofdstuk 1 - Voor niks gaat de zon op\\1.1.1 Paragraaf 1 - Kiezen is kostbaar\\2. Leren";
const OUT_FILE = path.join(OUT_DIR, "1.1.1 Kiezen is kostbaar \u2013 uitleg vaardigheden.docx");

// ─── Page setup ───
const PAGE = { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } };
const CW = 9026;

// ─── Color palette ───
const C = {
  dBlue: "1A5276", dBlueLt: "EBF5FB", dBlueDk: "154360",
  dAmber: "E67E22", dAmberLt: "FEF5E7", dAmberDk: "BA6A1C",
  dGreen: "1E8449", dGreenLt: "E8F8F0", dGreenDk: "186A3B",
  navy: "1E2761", white: "FFFFFF", dark: "2D3748", gray: "718096",
  lightGray: "F7F8FA", borderGray: "CBD5E0", red: "D9534F", lightRed: "FDE8E8",
  blue: "1A5276", lightBlue: "EBF5FB", green: "1E8449", lightGreen: "E8F5E9",
  rowAlt: "F7FAFC",
};

// ─── Domain system ───
const DOMAINS = {
  begrip:    { label: "Begrippenkennis", color: "17A2B8", light: "E8F8FB", dark: "117A8B" },
  redeneer:  { label: "Redeneren",       color: "E67E22", light: "FEF5E7", dark: "BA6A1C" },
  toepas:    { label: "Toepassen",       color: "1E8449", light: "E8F8F0", dark: "186A3B" },
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

// ─── Domain Banner (EXACT skill code) ───
function domainBanner(domain, skillNumber, skillTitle, domainSet = DOMAINS) {
  const d = domainSet[domain];
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

// ─── Formula box (EXACT skill code) ───
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

// ─── Tip / Warning / Check boxes (EXACT skill code) ───
function tipBox(text, color = C.blue, bg = C.lightBlue, label = "\u2728 Tip: ") {
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
  return tipBox(text, C.red, C.lightRed, "\u26A0 Let op: ");
}

function checkBox(text) {
  return tipBox(text, C.green, C.lightGreen, "\u2705 Controle: ");
}

// ─── Summary schema (EXACT skill code) ───
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
      // Header row (spans full width)
      new TableRow({ children: [
        new TableCell({
          borders: hdrBrd,
          shading: { fill: domainColor, type: ShadingType.CLEAR },
          margins: cellM, width: { size: CW, type: WidthType.DXA },
          columnSpan: 2,
          children: [new Paragraph({ children: [
            new TextRun({ text: "\uD83D\uDCCB Samenvatting", bold: true, font: "Arial", size: 22, color: C.white }),
          ]})],
        }),
      ]}),
      // Data rows
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

// ─── Visual TOC (EXACT skill code — 4 columns) ───
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

// ─── Domain legend (EXACT skill code) ───
function domainLegend(domainSet = DOMAINS) {
  const entries = Object.values(domainSet);
  const colW = Math.floor(CW / 3);
  const lastColW = CW - colW * 2;
  const cellM = { top: 80, bottom: 80, left: 100, right: 100 };
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [colW, colW, lastColW],
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
        width: { size: i === 2 ? lastColW : colW, type: WidthType.DXA },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: d.label, bold: true, font: "Arial", size: 20, color: d.color }),
        ]})],
      })
    ) })],
  });
}

// ─── DOC_STYLES ───
const DOC_STYLES = {
  default: { document: { run: { font: "Arial", size: 22 } } },
  paragraphStyles: [
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 30, bold: true, font: "Arial", color: C.navy },
      paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 24, bold: true, font: "Arial", color: C.blue },
      paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
  ],
};

// ─── Checklist numbering / item ───
const CHECKLIST_NUMBERING = {
  reference: "checklist",
  levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2610",
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
// SKILLS DATA (Visual TOC)
// ════════════════════════════════════════════════════
const skills = [
  { nr: "1", title: "Schaarste herkennen", desc: "Behoeften vs. middelen identificeren", domain: "begrip" },
  { nr: "2", title: "Alternatieve kosten bepalen", desc: "Waarde van het beste niet-gekozen alternatief", domain: "redeneer" },
  { nr: "3", title: "Kosten-batenanalyse maken", desc: "Nettobaten berekenen en evalueren", domain: "toepas" },
  { nr: "4", title: "Productiefactoren herkennen", desc: "Arbeid, natuur, kapitaal, ondernemerschap", domain: "begrip" },
  { nr: "5", title: "Rationeel kiezen toepassen", desc: "Trade-offs afwegen in een casus", domain: "toepas" },
];

// ════════════════════════════════════════════════════
// BUILD SECTION CHILDREN
// ════════════════════════════════════════════════════
const children = [];

// ── Title + TOC (single page) ──
children.push(...titleBlock(
  "Kiezen is kostbaar \u2014 Vaardigheden",
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
// SKILL 1 — Schaarste herkennen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("begrip", 1, "Schaarste herkennen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.begrip.color));
children.push(p("Schaarste is het startpunt van alle economie. Zonder schaarste hoef je niet te kiezen."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.begrip.color));
children.push(p("Schaarste ontstaat wanneer de behoeften van mensen groter zijn dan de beschikbare middelen."));
children.push(bullet("Behoeften = alle wensen en verlangens (onbeperkt)"));
children.push(bullet("Middelen = geld, tijd, grondstoffen, arbeid (beperkt)"));
children.push(sp(40));
children.push(p("Schaarste geldt voor iedereen: consumenten, bedrijven en overheden."));
children.push(sp(60));

children.push(tipBox("Stel jezelf de vraag: Kan ik alles krijgen wat ik wil? Zo nee \u2192 er is sprake van schaarste."));
children.push(sp(60));
children.push(checkBox("Kun je in een situatie herkennen of er sprake is van schaarste?"));
children.push(sp(60));
children.push(summarySchema([
  ["Schaarste", "Behoeften > beschikbare middelen"],
  ["Behoeften", "Onbeperkt \u2014 wensen groeien mee met welvaart"],
  ["Middelen", "Beperkt \u2014 geld, tijd, grondstoffen, arbeid"],
  ["Kernvraag", "Kun je alles krijgen wat je wilt?"],
  ["Verband met", "\u2192 Vaardigheid 2 (alternatieve kosten) en 4 (productiefactoren)"],
], DOMAINS.begrip.color));

// ════════════════════════════════════════════════════
// SKILL 2 — Alternatieve kosten bepalen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("redeneer", 2, "Alternatieve kosten bepalen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.redeneer.color));
children.push(p("Elke keuze heeft een prijs \u2014 namelijk wat je opgeeft. Dat heet alternatieve kosten."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.redeneer.color));
children.push(p("Alternatieve kosten = de waarde van het beste niet-gekozen alternatief."));
children.push(sp(40));
children.push(formulaBox([
  "Je kiest optie A (studeren) in plaats van optie B (werken voor \u20AC10/uur).",
  "Alternatieve kosten van studeren = \u20AC10/uur (het gemiste loon)",
], DOMAINS.redeneer.color));
children.push(sp(60));

children.push(warningBox("Alternatieve kosten zijn niet alleen geld! Ook gemiste tijd, plezier of ervaring tellen mee."));
children.push(sp(60));
children.push(checkBox("Kun je bij een gegeven keuze de alternatieve kosten benoemen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Definitie", "Waarde van het beste niet-gekozen alternatief"],
  ["Niet alleen geld", "Ook tijd, plezier en ervaring tellen"],
  ["Voorbeeld", "Studeren i.p.v. werken \u2192 gemist loon"],
  ["Examentip", "Noem altijd het concrete alternatief, niet \u201Calles wat je mist\u201D"],
  ["Verband met", "\u2192 Vaardigheid 1 (schaarste) en 3 (kosten-batenanalyse)"],
], DOMAINS.redeneer.color));

// ════════════════════════════════════════════════════
// SKILL 3 — Kosten-batenanalyse maken
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("toepas", 3, "Kosten-batenanalyse maken"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.toepas.color));
children.push(p("Bij rationeel kiezen weeg je kosten en baten tegen elkaar af."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.toepas.color));
children.push(formulaBox([
  "Nettobaten = Baten \u2212 Kosten",
  "Positief \u2192 keuze is voordelig",
  "Negatief \u2192 keuze is nadelig",
], DOMAINS.toepas.color));
children.push(sp(40));
children.push(p("Baten = alles wat je krijgt (nut, opbrengst, plezier). Kosten = alles wat je opgeeft (geld + alternatieve kosten)."));
children.push(sp(60));

children.push(tipBox("Vergeet de alternatieve kosten niet mee te rekenen bij de totale kosten!"));
children.push(sp(60));
children.push(checkBox("Kun je de nettobaten van een keuze berekenen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Baten", "Wat je krijgt: nut, opbrengst, plezier"],
  ["Kosten", "Wat je opgeeft: geld + alternatieve kosten"],
  ["Nettobaten", "Baten \u2212 kosten (positief = voordelig)"],
  ["Rationeel", "Kies de optie met de hoogste nettobaten"],
  ["Verband met", "\u2192 Vaardigheid 2 (alternatieve kosten) en 5 (rationeel kiezen)"],
], DOMAINS.toepas.color));

// ════════════════════════════════════════════════════
// SKILL 4 — Productiefactoren herkennen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("begrip", 4, "Productiefactoren herkennen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.begrip.color));
children.push(p("Om goederen en diensten te produceren heb je productiefactoren nodig. Die zijn schaars."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.begrip.color));
children.push(p("Er zijn vier productiefactoren:"));
children.push(bullet("Arbeid \u2014 de inzet van mensen (fysiek en mentaal)"));
children.push(bullet("Natuur \u2014 grondstoffen, land, water, energie"));
children.push(bullet("Kapitaal \u2014 machines, gebouwen, gereedschap (niet geld!)"));
children.push(bullet("Ondernemerschap \u2014 het combineren van de andere drie factoren"));
children.push(sp(60));

children.push(warningBox("Kapitaal is niet hetzelfde als geld. Met kapitaal bedoelen economen de fysieke productiemiddelen (machines, gebouwen)."));
children.push(sp(60));
children.push(checkBox("Kun je in een casus de vier productiefactoren benoemen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Arbeid", "Inzet van mensen"],
  ["Natuur", "Grondstoffen, land, water"],
  ["Kapitaal", "Machines, gebouwen (niet geld!)"],
  ["Ondernemerschap", "Het combineren van de andere factoren"],
  ["Verband met", "\u2192 Vaardigheid 1 (schaarste van middelen)"],
], DOMAINS.begrip.color));

// ════════════════════════════════════════════════════
// SKILL 5 — Rationeel kiezen toepassen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("toepas", 5, "Rationeel kiezen toepassen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.toepas.color));
children.push(p("Op het examen moet je keuzes kunnen analyseren en beoordelen."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.toepas.color));
children.push(p("Bij rationeel kiezen doorloop je drie stappen:"));
children.push(bullet("1. Inventariseer de opties"));
children.push(bullet("2. Bepaal per optie de kosten (incl. alternatieve kosten) en de baten"));
children.push(bullet("3. Kies de optie met de hoogste nettobaten"));
children.push(sp(60));

children.push(tipBox("Werk in een tabel: zet de opties naast elkaar met hun kosten en baten. Zo maak je het overzichtelijk."));
children.push(sp(60));
children.push(checkBox("Kun je een keuzeprobleem systematisch analyseren met kosten en baten?"));
children.push(sp(60));
children.push(summarySchema([
  ["Stap 1", "Inventariseer de opties"],
  ["Stap 2", "Bepaal kosten en baten per optie"],
  ["Stap 3", "Kies de optie met de hoogste nettobaten"],
  ["Hulpmiddel", "Gebruik een tabel om opties te vergelijken"],
  ["Verband met", "\u2192 Vaardigheid 2 en 3 (alt. kosten + kosten-batenanalyse)"],
], DOMAINS.toepas.color));

// ════════════════════════════════════════════════════
// VALKUILEN (Pitfalls)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 200 },
  children: [new TextRun({ text: "Veelvoorkomende valkuilen", bold: true, font: "Arial", size: 36, color: C.navy })],
}));
children.push(p("Let op deze veelgemaakte fouten bij het leren van deze paragraaf:"));
children.push(sp(100));

children.push(warningBox("\"Alternatieve kosten = alle kosten\" \u2192 Onjuist! Alternatieve kosten zijn alleen de waarde van het \u00e9\u00e9n-na-beste alternatief, niet van alle gemiste opties."));
children.push(sp(80));
children.push(warningBox("\"Kapitaal = geld\" \u2192 Onjuist! In de economie bedoelen we met kapitaal de fysieke productiemiddelen: machines, gebouwen en gereedschap."));
children.push(sp(80));
children.push(warningBox("\"Schaarste = armoede\" \u2192 Onjuist! Schaarste geldt voor iedereen, ook voor rijke mensen en welvarende landen. Het gaat om het verschil tussen onbeperkte wensen en beperkte middelen."));

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

children.push(checklistItem("Schaarste herkennen in een situatie"));
children.push(checklistItem("Alternatieve kosten benoemen bij een keuze"));
children.push(checklistItem("Een kosten-batenanalyse opstellen en nettobaten berekenen"));
children.push(checklistItem("De vier productiefactoren herkennen in een casus"));
children.push(checklistItem("Rationeel kiezen toepassen met een vergelijkingstabel"));

// ════════════════════════════════════════════════════
// BUILD DOCUMENT
// ════════════════════════════════════════════════════
const doc = new Document({
  styles: DOC_STYLES,
  numbering: { config: [CHECKLIST_NUMBERING] },
  sections: [
    {
      properties: {
        page: PAGE,
      },
      headers: { default: makeHeader("Kiezen is kostbaar \u2014 Vaardigheden") },
      footers: { default: makeFooter() },
      children,
    },
  ],
});

// ─── Write to file ───
(async () => {
  try {
    // Verify output directory
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

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
