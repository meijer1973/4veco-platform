/**
 * Template A: Uitleg Vaardigheden
 * Adapted from m1-112-vaardigheden.js for paragraph 1.1.3 Toepassen.
 * Review paragraph synthesizing Chapter 1 concepts.
 *
 * COMPLIANT with econ-word-templates skill — all tables use WidthType.DXA,
 * 4-column visualTOC, correct summarySchema with header row, correct
 * domainBanner, formulaBox, checkBox, tipBox, warningBox, domainLegend.
 *
 * Run: NODE_PATH="$(npm root -g)" node m1-113-vaardigheden.js
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

const OUT_DIR = "C:\\Projects\\4veco\\module one claude\\1.1 Hoofdstuk 1 - Voor niks gaat de zon op\\1.1.3 Paragraaf 3 - Toepassen\\2. Leren";
const OUT_FILE = path.join(OUT_DIR, "1.1.3 Toepassen \u2013 uitleg vaardigheden.docx");

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

// ─── Embed asset image ───
function embedAssetImage(filename, width, height) {
  const assetsDir = path.resolve(OUT_DIR, '..', '_assets');
  const imgPath = path.join(assetsDir, filename + '.png');
  if (!fs.existsSync(imgPath)) return null;
  const buf = fs.readFileSync(imgPath);
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    alignment: AlignmentType.CENTER,
    children: [new ImageRun({
      data: buf, transformation: { width, height }, type: 'png',
      altText: { title: filename, description: 'asset:' + filename, name: filename },
    })],
  });
}

// ════════════════════════════════════════════════════
// SKILLS DATA (Visual TOC)
// ════════════════════════════════════════════════════
const skills = [
  { nr: "1", title: "Schaarste herkennen in context",            desc: "Schaarste identificeren in een casus",            domain: "economisch" },
  { nr: "2", title: "Opofferingskosten bepalen uit tekst",       desc: "Beste alternatief herkennen en berekenen",         domain: "economisch" },
  { nr: "3", title: "Begrippen correct toepassen op casus",      desc: "Kernbegrippen H1 koppelen aan situaties",         domain: "economisch" },
  { nr: "4", title: "Gecombineerde budgetverschuiving analyseren", desc: "Verschuiving en kanteling samen analyseren",     domain: "grafisch" },
  { nr: "5", title: "Arbeidsmarkt-keuze analyseren",             desc: "Werken vs. vrije tijd met uurloon en budget",     domain: "economisch" },
  { nr: "6", title: "Bronnen economisch analyseren met kernbegrippen", desc: "Nieuwsbron koppelen aan economische begrippen", domain: "economisch" },
];

// ════════════════════════════════════════════════════
// BUILD SECTION CHILDREN
// ════════════════════════════════════════════════════
const children = [];

// ── Title + TOC (single page) ──
children.push(...titleBlock(
  "1.1.3 Toepassen \u2013 Uitleg vaardigheden",
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
// SKILL 1 — Schaarste herkennen in context
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 1, "Schaarste herkennen in context"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.economisch.color));
children.push(p("In het examen en in opgaven moet je schaarste kunnen herkennen in een tekst of situatie. Je moet kunnen aanwijzen wat het schaarse middel is en welke behoeften er tegenover staan."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.economisch.color));
children.push(p("Zoek in de tekst naar het beperkte middel (geld, tijd, grondstoffen) en de concurrerende behoeften. Schaarste is er als de middelen niet toereikend zijn om alle behoeften te vervullen."));
children.push(sp(40));
children.push(formulaBox([
  "Stappenplan schaarste herkennen:",
  "1. Identificeer het schaarse middel",
  "2. Benoem de concurrerende behoeften",
  "3. Leg uit waarom er een keuze nodig is",
], DOMAINS.economisch.color));
children.push(sp(60));

children.push(tipBox("Schaarste kan ook tijd of ruimte zijn, niet alleen geld. Kijk breder dan alleen financieel."));
children.push(sp(60));
children.push(checkBox("Kun je in een nieuwsbericht of casus het schaarse middel en de behoeften aanwijzen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Stap 1", "Welk middel is beperkt?"],
  ["Stap 2", "Welke behoeften concurreren om dat middel?"],
  ["Stap 3", "Waarom is een keuze noodzakelijk?"],
  ["Signaalwoorden", "beperkt, niet genoeg, tekort, moet kiezen, verdelen"],
], DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// SKILL 2 — Opofferingskosten bepalen uit tekst
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 2, "Opofferingskosten bepalen uit tekst"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.economisch.color));
children.push(p("Je moet opofferingskosten niet alleen kunnen berekenen, maar ook kunnen herkennen in een tekstuele casus. Dit is een veelgevraagde examenvaardigheid."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.economisch.color));
children.push(p("Lees de tekst en bepaal welke keuze wordt gemaakt. Identificeer het beste alternatief dat wordt opgegeven. De waarde daarvan zijn de opofferingskosten."));
children.push(sp(40));
children.push(formulaBox([
  "Stappen:",
  "1. Welke keuze wordt gemaakt?",
  "2. Welke alternatieven zijn er?",
  "3. Wat is het BESTE alternatief dat wordt opgegeven?",
  "4. Opofferingskosten = waarde van dat beste alternatief",
], DOMAINS.economisch.color));
children.push(sp(60));

children.push(warningBox("Tel niet alle gemiste alternatieven op! Opofferingskosten = alleen het BESTE gemiste alternatief."));
children.push(sp(60));
children.push(checkBox("Kun je in een tekst de opofferingskosten van een keuze identificeren?"));
children.push(sp(60));
children.push(summarySchema([
  ["Keuze", "Wat wordt er gekozen?"],
  ["Alternatieven", "Welke opties worden opgegeven?"],
  ["Beste alternatief", "Alleen de waarde van de op-\u00e9\u00e9n-na-beste optie telt"],
  ["Verband met", "\u2192 Vaardigheid 1 (schaarste) en 3 (begrippen toepassen)"],
], DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// SKILL 3 — Begrippen correct toepassen op casus
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 3, "Begrippen correct toepassen op casus"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.economisch.color));
children.push(p("Bij het examen moet je economische begrippen niet alleen kennen, maar ook correct toepassen op een nieuwe situatie. Dit vereist dat je de definitie koppelt aan concrete feiten uit de casus."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.economisch.color));
children.push(p("Gebruik de drieslag: (1) noem het begrip, (2) geef de definitie, (3) koppel aan de casus met een concreet voorbeeld uit de tekst."));
children.push(sp(40));
children.push(formulaBox([
  "Drieslag toepassen:",
  "1. Begrip: [naam van het begrip]",
  "2. Definitie: [korte definitie in eigen woorden]",
  "3. Toepassing: [concrete link naar de casus]",
], DOMAINS.economisch.color));
children.push(sp(60));

children.push(tipBox("Begin altijd met het begrip en de definitie, en koppel dan pas aan de casus. Zo voorkom je dat je te vaag antwoordt."));
children.push(sp(60));
children.push(checkBox("Kun je de drieslag (begrip \u2192 definitie \u2192 toepassing) toepassen op een nieuwe casus?"));
children.push(sp(60));
children.push(summarySchema([
  ["Drieslag", "Begrip \u2192 Definitie \u2192 Toepassing"],
  ["Begrip noemen", "Gebruik de exacte economische term"],
  ["Definitie geven", "In eigen woorden, niet letterlijk uit het boek"],
  ["Toepassing", "Concrete feiten uit de casus benoemen"],
], DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// SKILL 4 — Gecombineerde budgetverschuiving analyseren
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("grafisch", 4, "Gecombineerde budgetverschuiving analyseren"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.grafisch.color));
children.push(p("In de praktijk veranderen vaak meerdere factoren tegelijk: zowel het budget als een prijs. Je moet dan een gecombineerde verschuiving kunnen analyseren."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.grafisch.color));
children.push(p("Analyseer de veranderingen stap voor stap: (1) bereken het effect van de budgetverandering, (2) bereken het effect van de prijsverandering, (3) combineer beide effecten."));
children.push(sp(40));
children.push(formulaBox([
  "Gecombineerde verschuiving:",
  "Stap 1: Bereken nieuwe snijpunten met nieuwe B en/of p",
  "Stap 2: Vergelijk met oude snijpunten",
  "Stap 3: Beschrijf het gecombineerde effect",
  "",
  "Let op: het resultaat is g\u00e9\u00e9n zuivere evenwijdige",
  "verschuiving en g\u00e9\u00e9n zuivere kanteling!",
], DOMAINS.grafisch.color));
children.push(sp(60));

// ── Embedded image: budgetlijn-gecombineerd ──
const imgSkill4 = embedAssetImage('budgetlijn-gecombineerd', 500, 250);
if (imgSkill4) children.push(imgSkill4);

children.push(tipBox("Teken altijd de oude en de nieuwe budgetlijn in dezelfde grafiek om het verschil te zien."));
children.push(sp(60));
children.push(checkBox("Kun je een gecombineerde verschuiving analyseren en de nieuwe snijpunten berekenen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Budget + prijs", "Beide snijpunten veranderen"],
  ["Analyse", "Bereken elk effect apart, combineer dan"],
  ["Tekening", "Teken oude en nieuwe lijn in \u00e9\u00e9n grafiek"],
  ["Verband met", "\u2192 Vaardigheid 5 (arbeidsmarkt) en 6 (bronanalyse)"],
], DOMAINS.grafisch.color));

// ════════════════════════════════════════════════════
// SKILL 5 — Arbeidsmarkt-keuze analyseren
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 5, "Arbeidsmarkt-keuze analyseren"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.economisch.color));
children.push(p("De keuze tussen werken en vrije tijd is een veelvoorkomend examenvraagstuk. Je moet de budgetlijn kunnen toepassen op arbeid en vrije tijd."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.economisch.color));
children.push(p("De opofferingskosten van een uur vrije tijd zijn gelijk aan het uurloon. Bij een hoger uurloon kantelt de budgetlijn omhoog en wordt vrije tijd duurder."));
children.push(sp(40));
children.push(formulaBox([
  "Opofferingskosten 1 uur vrije tijd = uurloon",
  "Inkomen = (beschikbare uren \u2212 vrije uren) \u00D7 uurloon",
  "",
  "Uurloon stijgt \u2192 vrije tijd wordt duurder",
  "\u2192 budgetlijn kantelt omhoog rond x-snijpunt (max vrije tijd)",
], DOMAINS.economisch.color));
children.push(sp(60));

// ── Embedded image: arbeidsmarkt-vacatures ──
const imgSkill5 = embedAssetImage('arbeidsmarkt-vacatures', 500, 250);
if (imgSkill5) children.push(imgSkill5);

children.push(tipBox("Op de arbeidsmarkt is vrije tijd het 'goed' waarvan je de prijs berekent (= het uurloon)."));
children.push(sp(60));
children.push(checkBox("Kun je de opofferingskosten van vrije tijd berekenen bij een gegeven uurloon?"));
children.push(sp(60));
children.push(summarySchema([
  ["Opofferingskosten", "Uurloon = prijs van vrije tijd"],
  ["Budgetlijn", "X-as: vrije tijd, Y-as: inkomen"],
  ["Loonverhoging", "Budgetlijn kantelt omhoog \u2192 vrije tijd duurder"],
  ["Verband met", "\u2192 Vaardigheid 4 (gecombineerde verschuiving)"],
], DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// SKILL 6 — Bronnen economisch analyseren met kernbegrippen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 6, "Bronnen economisch analyseren met kernbegrippen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.economisch.color));
children.push(p("Bij het examen krijg je bronnen (nieuwsartikelen, grafieken, tabellen) die je moet analyseren met economische begrippen. Dit combineert leesvaardigheden met economische kennis."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.economisch.color));
children.push(p("Lees de bron en markeer economische verschijnselen. Koppel elk verschijnsel aan een begrip met de drieslag. Onderbouw je analyse met concrete gegevens uit de bron."));
children.push(sp(40));
children.push(formulaBox([
  "Bronanalyse stappenplan:",
  "1. Lees de bron en markeer economische verschijnselen",
  "2. Koppel elk verschijnsel aan een begrip (drieslag)",
  "3. Gebruik concrete cijfers/feiten uit de bron",
  "4. Trek een economische conclusie",
], DOMAINS.economisch.color));
children.push(sp(60));

children.push(tipBox("Citeer altijd concrete gegevens uit de bron. 'Uit de bron blijkt dat...' is sterker dan 'het is zo dat...'."));
children.push(sp(60));
children.push(checkBox("Kun je een nieuwsbron analyseren met de begrippen schaarste, opofferingskosten en budgetlijn?"));
children.push(sp(60));
children.push(summarySchema([
  ["Stap 1", "Markeer economische verschijnselen in de bron"],
  ["Stap 2", "Koppel aan begrippen met de drieslag"],
  ["Stap 3", "Gebruik concrete cijfers/feiten uit de bron"],
  ["Stap 4", "Trek een economische conclusie"],
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
children.push(p("Let op deze veelgemaakte fouten bij het toepassen van de begrippen uit hoofdstuk 1:"));
children.push(sp(100));

children.push(warningBox("\"Schaarste = zeldzaamheid\" \u2192 Onjuist! Schaarste gaat over de verhouding tussen middelen en behoeften, niet over hoe zeldzaam iets is."));
children.push(sp(80));
children.push(warningBox("\"Opofferingskosten = alle gemiste alternatieven\" \u2192 Onjuist! Je vergelijkt alleen met het BESTE alternatief."));
children.push(sp(80));
children.push(warningBox("\"Begrip noemen zonder definitie en toepassing\" \u2192 Gebruik altijd de drieslag bij toepassingsvragen."));

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

children.push(checklistItem("Schaarste herkennen in een casus of nieuwsbericht"));
children.push(checklistItem("Opofferingskosten bepalen uit een tekst (beste alternatief)"));
children.push(checklistItem("Begrippen toepassen met de drieslag (begrip \u2192 definitie \u2192 toepassing)"));
children.push(checklistItem("Gecombineerde budgetverschuiving analyseren en tekenen"));
children.push(checklistItem("Arbeidsmarkt-keuze analyseren met uurloon en opofferingskosten"));
children.push(checklistItem("Bronnen analyseren met economische kernbegrippen"));

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
      headers: { default: makeHeader("1.1.3 Toepassen \u2013 Uitleg vaardigheden") },
      footers: { default: makeFooter() },
      children,
    },
  ],
});

// ─── Write to file ───
(async () => {
  try {
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(OUT_FILE, buffer);
    console.log("SUCCESS: Document written to", OUT_FILE);
    console.log("Size:", (buffer.length / 1024).toFixed(0), "KB");
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
})();
