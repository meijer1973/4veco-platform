/**
 * Template B: Uitleg Voorkennis — 1.1.2 Kiezen of delen
 * Adapted from m1-111-voorkennis.js (1.1.1 Kiezen is kostbaar).
 *
 * COMPLIANT with econ-word-templates skill — all tables use WidthType.DXA,
 * 4-column visualTOC, correct summarySchema with header row, correct
 * domainBanner, formulaBox, checkBox, tipBox, warningBox, domainLegend.
 *
 * Run: NODE_PATH="$(npm root -g)" node m1-112-voorkennis.js
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

const OUT_DIR = "C:\\Projects\\4veco\\module one claude\\1.1 Hoofdstuk 1 - Voor niks gaat de zon op\\1.1.2 Paragraaf 2 - Kiezen of delen\\1. Voorbereiden";
const OUT_FILE = path.join(OUT_DIR, "1.1.2 Kiezen of delen \u2013 uitleg voorkennis.docx");

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
const VK_DOMAINS = {
  wiskunde:   { label: "Wiskundig",   color: C.dBlue,  light: C.dBlueLt,  dark: C.dBlueDk  },
  economisch: { label: "Economisch",  color: C.dAmber, light: C.dAmberLt, dark: C.dAmberDk },
  grafisch:   { label: "Grafisch",    color: C.dGreen, light: C.dGreenLt, dark: C.dGreenDk },
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
function domainBanner(domain, skillNumber, skillTitle, domainSet = VK_DOMAINS) {
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
function visualTOC(skills, domainSet = VK_DOMAINS) {
  const colNr = 500, colTitle = 3200, colDesc = 3726, colDomain = 1600;
  const rowBrd = { top: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" }, left: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" }, right: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" } };
  const hdrBrd = { top: { style: BorderStyle.SINGLE, size: 1, color: C.navy }, bottom: { style: BorderStyle.SINGLE, size: 2, color: C.navy }, left: { style: BorderStyle.SINGLE, size: 1, color: C.navy }, right: { style: BorderStyle.SINGLE, size: 1, color: C.navy } };
  const cellM = { top: 100, bottom: 100, left: 120, right: 120 };

  const headerRow = new TableRow({ children: [
    ...[["Nr.", colNr], ["Onderwerp", colTitle], ["Omschrijving", colDesc], ["Domein", colDomain]].map(([txt, w]) =>
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
function domainLegend(domainSet = VK_DOMAINS) {
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

// ─── Embed asset image ───
function embedAssetImage(filename, width, height) {
  const assetsDir = path.resolve(OUT_DIR, '..', '_assets');
  const imgPath = path.join(assetsDir, filename + '.png');
  if (!fs.existsSync(imgPath)) return null;
  const buf = fs.readFileSync(imgPath);
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    alignment: AlignmentType.CENTER,
    children: [new ImageRun({ data: buf, transformation: { width, height }, type: 'png' })],
  });
}

// ════════════════════════════════════════════════════
// CHAPTER DATA
// ════════════════════════════════════════════════════
const chapters = [
  { nr: "1", title: "Lineaire functies",                    desc: "Vergelijkingen van de vorm y = ax + b", domain: "wiskunde" },
  { nr: "2", title: "Vergelijkingen oplossen",              desc: "Onbekende variabelen isoleren",         domain: "wiskunde" },
  { nr: "3", title: "Grafiek tekenen van een lineaire functie", desc: "Punten berekenen en lijn tekenen", domain: "grafisch" },
  { nr: "4", title: "Schaarste en keuze",                   desc: "Beperkte middelen, onbeperkte wensen", domain: "economisch" },
  { nr: "5", title: "Opofferingskosten berekenen",          desc: "Waarde van het beste alternatief",     domain: "economisch" },
  { nr: "6", title: "Procentuele verandering berekenen",    desc: "Stijgingen en dalingen in procenten",  domain: "wiskunde" },
];

// ════════════════════════════════════════════════════
// BUILD SECTION CHILDREN
// ════════════════════════════════════════════════════
const children = [];

// ── Title + TOC (single page) ──
children.push(...titleBlock(
  "1.1.2 Kiezen of delen \u2014 Uitleg voorkennis",
  "Wat je al moet weten voor deze paragraaf"
));
children.push(sp(80));
children.push(domainLegend(VK_DOMAINS));
children.push(sp(120));
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 120 },
  children: [new TextRun({ text: "Inhoudsopgave", bold: true, font: "Arial", size: 36, color: C.navy })],
}));
children.push(sp(60));
children.push(visualTOC(chapters, VK_DOMAINS));

// ════════════════════════════════════════════════════
// CHAPTER 1 — Lineaire functies
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("wiskunde", 1, "Lineaire functies"));
children.push(sp(120));

children.push(h2d("Wat is een lineaire functie?", VK_DOMAINS.wiskunde.color));
children.push(p("Een lineaire functie is een vergelijking van de vorm y = ax + b die een rechte lijn oplevert. In de economie gebruik je lineaire functies om verbanden tussen twee grootheden weer te geven, bijvoorbeeld hoeveel van het ene goed je kunt kopen als je meer van het andere koopt."));
children.push(formulaBox(["y = ax + b", "a = richtingsco\u00ebffici\u00ebnt (helling van de lijn)", "b = snijpunt met de y-as"], VK_DOMAINS.wiskunde.color));
children.push(sp(60));

children.push(h2d("Herkennen in de economie", VK_DOMAINS.wiskunde.color));
children.push(p("Bij budgetlijnen en andere economische vergelijkingen herken je vaak de lineaire vorm. Als je weet dat q\u2082 = 3 \u2212 \u2159q\u2081, dan herken je a = \u2212\u2159 en b = 3. De richtingsco\u00ebffici\u00ebnt a geeft aan hoe steil de lijn loopt."));
children.push(tipBox("De richtingsco\u00ebffici\u00ebnt a geeft de helling van de lijn aan. Een negatieve a betekent dat de lijn daalt van links naar rechts."));
children.push(sp(60));

children.push(checkBox("Kun je van een vergelijking als q\u2082 = 3 \u2212 \u2159q\u2081 de waarden van a en b aanwijzen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Lineaire functie", "Vergelijking van de vorm y = ax + b, levert een rechte lijn op"],
  ["Richtingsco\u00ebffici\u00ebnt a", "Geeft de helling (steilheid) van de lijn aan"],
  ["Constante b", "Snijpunt met de y-as (waarde als x = 0)"],
], VK_DOMAINS.wiskunde.color));

// ════════════════════════════════════════════════════
// CHAPTER 2 — Vergelijkingen oplossen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("wiskunde", 2, "Vergelijkingen oplossen"));
children.push(sp(120));

children.push(h2d("De onbekende isoleren", VK_DOMAINS.wiskunde.color));
children.push(p("Een vergelijking oplossen betekent de onbekende variabele isoleren. Je brengt alle termen met de onbekende naar \u00e9\u00e9n kant en de rest naar de andere kant. Dit heb je nodig om bijvoorbeeld de snijpunten van een budgetlijn met de assen te berekenen."));
children.push(formulaBox(["ax + b = c  \u2192  x = (c \u2212 b) / a", "", "Voorbeeld:", "36 = 2q\u2081 + 12\u00d72", "36 = 2q\u2081 + 24", "36 \u2212 24 = 2q\u2081", "12 = 2q\u2081", "q\u2081 = 6"], VK_DOMAINS.wiskunde.color));
children.push(sp(60));

children.push(h2d("Stap voor stap werken", VK_DOMAINS.wiskunde.color));
children.push(p("Bij economische berekeningen zijn vergelijkingen soms wat langer. Werk altijd stap voor stap: eerst vereenvoudigen (haakjes wegwerken, gelijke termen samenvoegen), dan pas isoleren."));
children.push(tipBox("Werk altijd stap voor stap: eerst vereenvoudigen, dan isoleren. Schrijf elke stap op een nieuwe regel."));
children.push(sp(60));

children.push(checkBox("Kun je uit 36 = 2q\u2081 + 12\u00d72 de waarde van q\u2081 berekenen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Isoleren", "Breng de onbekende naar \u00e9\u00e9n kant van het =-teken"],
  ["Vereenvoudigen", "Haakjes wegwerken, gelijke termen samenvoegen"],
  ["Stap voor stap", "Schrijf elke tussenstap op voor overzicht"],
], VK_DOMAINS.wiskunde.color));

// ════════════════════════════════════════════════════
// CHAPTER 3 — Grafiek tekenen van een lineaire functie
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("grafisch", 3, "Grafiek tekenen van een lineaire functie"));
children.push(sp(120));

children.push(h2d("Hoe teken je een rechte lijn?", VK_DOMAINS.grafisch.color));
children.push(p("Een grafiek tekenen van een lineaire functie doe je door twee punten te verbinden met een rechte lijn. De makkelijkste punten om te berekenen zijn de snijpunten met de assen: het punt waar de lijn de horizontale as snijdt (y = 0) en het punt waar de lijn de verticale as snijdt (x = 0)."));
children.push(sp(60));

children.push(h2d("Snijpunten met de assen", VK_DOMAINS.grafisch.color));
children.push(p("Bereken eerst de snijpunten met de assen (q\u2081 = 0 en q\u2082 = 0) en verbind ze met een rechte lijn. Bij een budgetlijn geven deze snijpunten aan hoeveel je maximaal van elk goed kunt kopen als je niets van het andere goed koopt."));
children.push(tipBox("Begin altijd met de snijpunten met de assen \u2014 die zijn het makkelijkst te berekenen."));
children.push(sp(60));

children.push(checkBox("Kun je van een lineaire vergelijking de twee snijpunten met de assen berekenen en de lijn tekenen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Twee punten", "Een rechte lijn is bepaald door twee punten"],
  ["Snijpunt y-as", "Vul x = 0 in om het snijpunt met de y-as te vinden"],
  ["Snijpunt x-as", "Vul y = 0 in om het snijpunt met de x-as te vinden"],
], VK_DOMAINS.grafisch.color));

// ── Embedded graph: budgetlijn-basis ──
const imgCh3 = embedAssetImage('budgetlijn-basis', 500, 250);
if (imgCh3) children.push(imgCh3);

// ════════════════════════════════════════════════════
// CHAPTER 4 — Schaarste en keuze
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 4, "Schaarste en keuze"));
children.push(sp(120));

children.push(h2d("Wat is schaarste?", VK_DOMAINS.economisch.color));
children.push(p("Schaarste betekent dat de beschikbare middelen beperkt zijn ten opzichte van de behoeften, waardoor je moet kiezen. Dit is het kernbegrip van de economie: omdat je niet alles kunt hebben, moet je afwegingen maken."));
children.push(sp(60));

children.push(h2d("Schaarste in het dagelijks leven", VK_DOMAINS.economisch.color));
children.push(p("Met \u20AC36 kun je niet onbeperkt broodjes en boeken kopen \u2014 je moet een keuze maken. Maar schaarste gaat niet alleen over geld; ook tijd en grondstoffen zijn schaars. Een overheid heeft een beperkt budget, een bedrijf beperkte productiemiddelen."));
children.push(tipBox("Schaarste gaat niet alleen over geld; ook tijd en grondstoffen zijn schaars."));
children.push(sp(60));

children.push(checkBox("Kun je uitleggen waarom schaarste leidt tot het maken van keuzes?"));
children.push(sp(60));
children.push(summarySchema([
  ["Schaarste", "Middelen zijn beperkt ten opzichte van behoeften"],
  ["Keuze", "Door schaarste moet je afwegingen maken"],
  ["Niet alleen geld", "Ook tijd, grondstoffen en productiemiddelen zijn schaars"],
], VK_DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// CHAPTER 5 — Opofferingskosten berekenen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 5, "Opofferingskosten berekenen"));
children.push(sp(120));

children.push(h2d("Wat zijn opofferingskosten?", VK_DOMAINS.economisch.color));
children.push(p("Opofferingskosten zijn de waarde van het beste alternatief dat je opgeeft wanneer je een keuze maakt. Elke keuze heeft opofferingskosten, omdat je altijd iets anders had kunnen doen met dezelfde middelen."));
children.push(formulaBox(["Opofferingskosten = waarde beste gemiste alternatief", "", "Voorbeeld:", "Je neemt een uur vrije tijd in plaats van werken voor \u20AC10/uur", "Opofferingskosten = \u20AC10"], VK_DOMAINS.economisch.color));
children.push(sp(60));

children.push(h2d("Het beste alternatief", VK_DOMAINS.economisch.color));
children.push(p("Let op: je vergelijkt altijd met het beste alternatief, niet met alle alternatieven samen. Als je kunt kiezen tussen werken (\u20AC10/uur), studeren of sporten, en je kiest sporten, dan zijn de opofferingskosten gelijk aan de waarde van werken (het beste gemiste alternatief)."));
children.push(tipBox("Vergelijk altijd met het beste alternatief, niet met alle alternatieven samen."));
children.push(sp(60));

children.push(checkBox("Kun je de opofferingskosten berekenen van een keuze als je de waarde van de alternatieven kent?"));
children.push(sp(60));
children.push(summarySchema([
  ["Opofferingskosten", "Waarde van het beste alternatief dat je opgeeft"],
  ["Beste alternatief", "Vergelijk alleen met de op-\u00e9\u00e9n-na-beste optie"],
  ["Altijd aanwezig", "Elke keuze heeft opofferingskosten"],
], VK_DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// CHAPTER 6 — Procentuele verandering berekenen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("wiskunde", 6, "Procentuele verandering berekenen"));
children.push(sp(120));

children.push(h2d("Wat is een procentuele verandering?", VK_DOMAINS.wiskunde.color));
children.push(p("De procentuele verandering geeft aan hoeveel procent een waarde is gestegen of gedaald. Je hebt dit nodig bij prijsveranderingen, budgetwijzigingen en andere economische berekeningen."));
children.push(formulaBox(["%\u0394 = ((nieuw \u2212 oud) / oud) \u00d7 100%", "", "Voorbeeld:", "Prijs stijgt van \u20AC15 naar \u20AC20:", "((20 \u2212 15) / 15) \u00d7 100% = 33\u2153%"], VK_DOMAINS.wiskunde.color));
children.push(sp(60));

children.push(h2d("De oude waarde als basis", VK_DOMAINS.wiskunde.color));
children.push(p("Een veelgemaakte fout is delen door de nieuwe waarde in plaats van de oude. Onthoud: je deelt altijd door de OUDE waarde, want je wilt weten hoeveel procent de verandering is ten opzichte van de uitgangssituatie."));
children.push(warningBox("Deel altijd door de OUDE waarde, niet door de nieuwe. Dit is de meest voorkomende fout bij procentberekeningen."));
children.push(sp(60));

children.push(checkBox("Kun je de procentuele verandering berekenen als een prijs stijgt van \u20AC15 naar \u20AC20?"));
children.push(sp(60));
children.push(summarySchema([
  ["Formule", "%\u0394 = ((nieuw \u2212 oud) / oud) \u00d7 100%"],
  ["Basis = oud", "Deel altijd door de oude waarde"],
  ["Positief/negatief", "Positief = stijging, negatief = daling"],
], VK_DOMAINS.wiskunde.color));

// ════════════════════════════════════════════════════
// CHECKLIST PAGE
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 200 },
  children: [new TextRun({ text: "Checklist voorkennis", bold: true, font: "Arial", size: 36, color: C.navy })],
}));
children.push(p("Controleer of je de volgende zaken beheerst voordat je aan de paragraaf begint:"));
children.push(sp(100));

children.push(checklistItem("Kan ik van een vergelijking y = ax + b de waarden van a en b aanwijzen?"));
children.push(checklistItem("Kan ik een vergelijking oplossen door de onbekende te isoleren?"));
children.push(checklistItem("Kan ik de snijpunten met de assen berekenen en een rechte lijn tekenen?"));
children.push(checklistItem("Kan ik uitleggen waarom schaarste leidt tot het maken van keuzes?"));
children.push(checklistItem("Kan ik de opofferingskosten van een keuze berekenen?"));
children.push(checklistItem("Kan ik een procentuele verandering berekenen met de juiste formule?"));

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
      headers: { default: makeHeader("1.1.2 Kiezen of delen \u2013 Uitleg voorkennis") },
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
