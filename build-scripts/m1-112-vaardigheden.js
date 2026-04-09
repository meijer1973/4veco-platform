/**
 * Template A: Uitleg Vaardigheden
 * Adapted from m1-111-vaardigheden.js for paragraph 1.1.2 Kiezen of delen.
 *
 * COMPLIANT with econ-word-templates skill — all tables use WidthType.DXA,
 * 4-column visualTOC, correct summarySchema with header row, correct
 * domainBanner, formulaBox, checkBox, tipBox, warningBox, domainLegend.
 *
 * Run: NODE_PATH="$(npm root -g)" node m1-112-vaardigheden.js
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

const OUT_DIR = "C:\\Projects\\4veco\\module one claude\\1.1 Hoofdstuk 1 - Voor niks gaat de zon op\\1.1.2 Paragraaf 2 - Kiezen of delen\\2. Leren";
const OUT_FILE = path.join(OUT_DIR, "1.1.2 Kiezen of delen \u2013 uitleg vaardigheden.docx");

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
  wiskunde:    { label: "Wiskundig",   color: "1A5276", light: "EBF5FB", dark: "154360" },
  economisch:  { label: "Economisch",  color: "E67E22", light: "FEF5E7", dark: "BA6A1C" },
  grafisch:    { label: "Grafisch",    color: "1E8449", light: "E8F8F0", dark: "186A3B" },
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
  { nr: "1", title: "Budgetvergelijking opstellen", desc: "B = p\u2081q\u2081 + p\u2082q\u2082 invullen", domain: "economisch" },
  { nr: "2", title: "Budgetlijn tekenen", desc: "Snijpunten berekenen en verbinden", domain: "grafisch" },
  { nr: "3", title: "Snijpunten met assen berekenen", desc: "Maximale hoeveelheden per goed", domain: "wiskunde" },
  { nr: "4", title: "Effect inkomensverandering op budgetlijn", desc: "Evenwijdige verschuiving", domain: "economisch" },
  { nr: "5", title: "Effect prijsverandering op budgetlijn", desc: "Kanteling rond vast snijpunt", domain: "economisch" },
  { nr: "6", title: "Opofferingskosten vrije tijd berekenen", desc: "Uurloon als opofferingskosten", domain: "economisch" },
];

// ════════════════════════════════════════════════════
// BUILD SECTION CHILDREN
// ════════════════════════════════════════════════════
const children = [];

// ── Title + TOC (single page) ──
children.push(...titleBlock(
  "1.1.2 Kiezen of delen \u2013 Uitleg vaardigheden",
  "Stap voor stap de vaardigheden van deze paragraaf"
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
// SKILL 1 — Budgetvergelijking opstellen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 1, "Budgetvergelijking opstellen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.economisch.color));
children.push(p("Je moet de budgetvergelijking kunnen opstellen om te berekenen welke combinaties van goederen een consument kan kopen."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.economisch.color));
children.push(p("Vul B = p\u2081q\u2081 + p\u2082q\u2082 in met de gegeven waarden voor budget en prijzen."));
children.push(sp(40));
children.push(formulaBox([
  "B = p\u2081q\u2081 + p\u2082q\u2082",
  "Budget = \u20AC36, prijs kroket = \u20AC2, prijs boek = \u20AC12",
  "\u2192 36 = 2q\u2081 + 12q\u2082",
], DOMAINS.economisch.color));
children.push(sp(60));

children.push(tipBox("Controleer je vergelijking door een bekende combinatie in te vullen."));
children.push(sp(60));
children.push(checkBox("Kun je de budgetvergelijking opstellen als je het budget en de prijzen kent?"));
children.push(sp(60));
children.push(summarySchema([
  ["Formule", "B = p\u2081q\u2081 + p\u2082q\u2082"],
  ["B", "Het beschikbare budget"],
  ["p\u2081, p\u2082", "De prijzen van de twee goederen"],
  ["q\u2081, q\u2082", "De hoeveelheden van de twee goederen"],
  ["Verband met", "\u2192 Vaardigheid 2 (budgetlijn tekenen) en 3 (snijpunten berekenen)"],
], DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// SKILL 2 — Budgetlijn tekenen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("grafisch", 2, "Budgetlijn tekenen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.grafisch.color));
children.push(p("De budgetlijn visualiseert alle mogelijke combinaties van twee goederen."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.grafisch.color));
children.push(p("Bereken de twee snijpunten met de assen en verbind ze met een rechte lijn."));
children.push(sp(40));
children.push(formulaBox([
  "B = 36, p\u2081 = 2, p\u2082 = 12",
  "Snijpunt x-as: q\u2081 = 18 (als q\u2082 = 0)",
  "Snijpunt y-as: q\u2082 = 3  (als q\u2081 = 0)",
  "Verbind (18, 0) met (0, 3) \u2192 budgetlijn",
], DOMAINS.grafisch.color));
children.push(sp(60));

children.push(tipBox("Zet altijd de aantallen bij de snijpunten op de assen."));
children.push(sp(60));
children.push(checkBox("Kun je een budgetlijn tekenen als je de vergelijking kent?"));
children.push(sp(60));
children.push(summarySchema([
  ["Stap 1", "Bereken snijpunt x-as: q\u2081\u1D50\u1D43\u02E3 = B/p\u2081"],
  ["Stap 2", "Bereken snijpunt y-as: q\u2082\u1D50\u1D43\u02E3 = B/p\u2082"],
  ["Stap 3", "Verbind de twee snijpunten met een rechte lijn"],
  ["Lijn", "Alle punten op de lijn = combinaties waarmee je budget precies op is"],
  ["Verband met", "\u2192 Vaardigheid 1 (budgetvergelijking) en 3 (snijpunten berekenen)"],
], DOMAINS.grafisch.color));

// ════════════════════════════════════════════════════
// SKILL 3 — Snijpunten met assen berekenen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("wiskunde", 3, "Snijpunten met assen berekenen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.wiskunde.color));
children.push(p("De snijpunten geven de maximale hoeveelheid van elk goed aan."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.wiskunde.color));
children.push(p("Vul q\u2081 = 0 in voor het y-snijpunt en q\u2082 = 0 voor het x-snijpunt."));
children.push(sp(40));
children.push(formulaBox([
  "q\u2082\u1D50\u1D43\u02E3 = B / p\u2082  (y-snijpunt, vul q\u2081 = 0 in)",
  "q\u2081\u1D50\u1D43\u02E3 = B / p\u2081  (x-snijpunt, vul q\u2082 = 0 in)",
  "",
  "B = 180, p\u2081 = 15, p\u2082 = 30",
  "q\u2081\u1D50\u1D43\u02E3 = 180/15 = 12 T-shirts",
  "q\u2082\u1D50\u1D43\u02E3 = 180/30 = 6 broeken",
], DOMAINS.wiskunde.color));
children.push(sp(60));

children.push(tipBox("q\u2081\u1D50\u1D43\u02E3 = B/p\u2081 is altijd het snijpunt met de horizontale as."));
children.push(sp(60));
children.push(checkBox("Kun je beide snijpunten berekenen?"));
children.push(sp(60));
children.push(summarySchema([
  ["x-snijpunt", "q\u2081\u1D50\u1D43\u02E3 = B / p\u2081 (maximaal goed 1)"],
  ["y-snijpunt", "q\u2082\u1D50\u1D43\u02E3 = B / p\u2082 (maximaal goed 2)"],
  ["Methode", "Vul de andere q op 0 in en los op"],
  ["Voorbeeld", "B=180, p\u2081=15 \u2192 q\u2081\u1D50\u1D43\u02E3 = 12"],
  ["Verband met", "\u2192 Vaardigheid 2 (budgetlijn tekenen) en 4/5 (verschuivingen)"],
], DOMAINS.wiskunde.color));

// ════════════════════════════════════════════════════
// SKILL 4 — Effect inkomensverandering op budgetlijn
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 4, "Effect inkomensverandering op budgetlijn"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.economisch.color));
children.push(p("Als het budget verandert verschuift de hele budgetlijn."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.economisch.color));
children.push(p("Bij budgetstijging schuift de lijn evenwijdig naar buiten. De helling (p\u2081/p\u2082) blijft gelijk."));
children.push(sp(40));
children.push(formulaBox([
  "B stijgt van \u20AC36 naar \u20AC54",
  "Oude snijpunten: q\u2081\u1D50\u1D43\u02E3 = 18, q\u2082\u1D50\u1D43\u02E3 = 3",
  "Nieuwe snijpunten: q\u2081\u1D50\u1D43\u02E3 = 27, q\u2082\u1D50\u1D43\u02E3 = 4,5",
  "\u2192 Lijn verschuift evenwijdig naar buiten",
], DOMAINS.economisch.color));
children.push(sp(60));

children.push(tipBox("Een procentuele daling van beide prijzen met hetzelfde percentage geeft dezelfde verschuiving als een even grote budgetstijging."));
children.push(sp(60));
children.push(checkBox("Kun je uitleggen wat er met de budgetlijn gebeurt als het budget verandert?"));
children.push(sp(60));
children.push(summarySchema([
  ["Budget stijgt", "Lijn verschuift evenwijdig naar buiten"],
  ["Budget daalt", "Lijn verschuift evenwijdig naar binnen"],
  ["Helling", "Blijft gelijk (p\u2081/p\u2082 verandert niet)"],
  ["Equivalent", "Beide prijzen met x% dalen = budget met x% stijgen"],
  ["Verband met", "\u2192 Vaardigheid 3 (snijpunten berekenen) en 5 (prijsverandering)"],
], DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// SKILL 5 — Effect prijsverandering op budgetlijn
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 5, "Effect prijsverandering op budgetlijn"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.economisch.color));
children.push(p("Als de prijs van \u00e9\u00e9n goed verandert, kantelt de budgetlijn."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.economisch.color));
children.push(p("Het snijpunt van het goed waarvan de prijs niet verandert, blijft gelijk. Het andere snijpunt verschuift."));
children.push(sp(40));
children.push(formulaBox([
  "p\u2081 stijgt van \u20AC15 naar \u20AC20 (T-shirts duurder)",
  "y-snijpunt (broeken) blijft: q\u2082\u1D50\u1D43\u02E3 = 6",
  "x-snijpunt daalt: q\u2081\u1D50\u1D43\u02E3 = 180/20 = 9 (was 12)",
  "\u2192 Lijn kantelt naar binnen rond het y-snijpunt",
], DOMAINS.economisch.color));
children.push(sp(60));

children.push(tipBox("Teken altijd eerst het vaste snijpunt, dan het nieuwe snijpunt, en verbind ze."));
children.push(sp(60));
children.push(checkBox("Kun je tekenen hoe de budgetlijn kantelt bij een prijsverandering?"));
children.push(sp(60));
children.push(summarySchema([
  ["Prijs goed 1 stijgt", "x-snijpunt schuift naar binnen, y-snijpunt blijft"],
  ["Prijs goed 2 stijgt", "y-snijpunt schuift naar binnen, x-snijpunt blijft"],
  ["Helling", "Verandert (p\u2081/p\u2082 wijzigt)"],
  ["Tekenstrategie", "Vast snijpunt eerst, dan nieuw snijpunt, verbind"],
  ["Verband met", "\u2192 Vaardigheid 3 (snijpunten berekenen) en 4 (inkomensverandering)"],
], DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// SKILL 6 — Opofferingskosten vrije tijd berekenen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 6, "Opofferingskosten vrije tijd berekenen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.economisch.color));
children.push(p("Het uurloon bepaalt de opofferingskosten van een uur vrije tijd."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.economisch.color));
children.push(p("De opofferingskosten van een uur vrije tijd zijn gelijk aan het uurloon."));
children.push(sp(40));
children.push(formulaBox([
  "Uurloon = \u20AC10",
  "Elk uur vrije tijd kost \u20AC10 aan gemist inkomen",
  "Bij 16 uur vrije tijd: 8 uur werken = \u20AC80 inkomen",
], DOMAINS.economisch.color));
children.push(sp(60));

children.push(tipBox("Als het uurloon stijgt, worden de opofferingskosten van vrije tijd hoger."));
children.push(sp(60));
children.push(checkBox("Kun je berekenen hoeveel een uur vrije tijd kost?"));
children.push(sp(60));
children.push(summarySchema([
  ["Opofferingskosten", "Gelijk aan het uurloon"],
  ["Voorbeeld", "Uurloon \u20AC10 \u2192 1 uur vrije tijd kost \u20AC10"],
  ["Uurloon stijgt", "Vrije tijd wordt duurder"],
  ["Berekening", "Inkomen = (24 \u2212 vrije uren) \u00D7 uurloon"],
  ["Verband met", "\u2192 Vaardigheid 4 en 5 (verschuivingen budgetlijn)"],
], DOMAINS.economisch.color));

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

children.push(warningBox("\"De budgetlijn verschuift altijd evenwijdig\" \u2192 Onjuist! Bij een prijsverandering van \u00e9\u00e9n goed kantelt de lijn. Alleen bij een inkomensverandering verschuift de lijn evenwijdig."));
children.push(sp(80));
children.push(warningBox("\"Het x-snijpunt = B/p\u2082\" \u2192 Onjuist! Het x-snijpunt is B/p\u2081 (prijs van het goed op de x-as). Verwar de assen niet."));
children.push(sp(80));
children.push(warningBox("\"Vrije tijd is gratis\" \u2192 Onjuist! De opofferingskosten van vrije tijd zijn gelijk aan het uurloon dat je had kunnen verdienen."));

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

children.push(checklistItem("De budgetvergelijking opstellen met gegeven budget en prijzen"));
children.push(checklistItem("Een budgetlijn tekenen door de snijpunten met de assen te verbinden"));
children.push(checklistItem("De snijpunten met de assen berekenen (q\u2081\u1D50\u1D43\u02E3 en q\u2082\u1D50\u1D43\u02E3)"));
children.push(checklistItem("Uitleggen hoe de budgetlijn verschuift bij een inkomensverandering"));
children.push(checklistItem("Tekenen hoe de budgetlijn kantelt bij een prijsverandering"));
children.push(checklistItem("De opofferingskosten van vrije tijd berekenen met het uurloon"));

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
      headers: { default: makeHeader("1.1.2 Kiezen of delen \u2013 Uitleg vaardigheden") },
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
