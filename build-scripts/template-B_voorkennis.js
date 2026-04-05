/**
 * Template B: Uitleg Voorkennis
 * Reference implementation from 3.1.1 Markt en marktstructuur.
 *
 * COMPLIANT with econ-word-templates skill — all tables use WidthType.DXA,
 * 4-column visualTOC, correct summarySchema with header row, correct
 * domainBanner, formulaBox, checkBox, tipBox, warningBox, domainLegend.
 *
 * HOW TO ADAPT FOR ANOTHER PARAGRAPH:
 * 1. Change OUT_DIR and OUT_FILE to point to the new paragraph folder
 * 2. Update the CHAPTER DATA section (search for "════") with new chapters/domains
 * 3. Replace the BUILD SECTION CHILDREN content with new paragraph text
 * 4. Update the header text in makeHeader() call at the bottom
 * 5. Update the checklist items at the end
 *
 * Run: NODE_PATH="$(npm root -g)" node template-B_voorkennis.js
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

// ─── Unicode colon (U+F03A) ───
const UC = "\uF03A";

const OUT_DIR = `C:\\Users\\meije\\Documents\\0. claude\\3. Module 3 ${UC} Markt en overheid\\3.1 Hoofdstuk 1 ${UC} Markten\\3.1.1 Paragraaf 1 ${UC} Markt en marktstructuur`;
const OUT_FILE = path.join(OUT_DIR, "3.1.1 Markt en marktstructuur \u2013 uitleg voorkennis.docx");

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

// ════════════════════════════════════════════════════
// CHAPTER DATA
// ════════════════════════════════════════════════════
const chapters = [
  { nr: "1", title: "Basis economische concepten", desc: "Vraag, aanbod en consumentengedrag", domain: "economisch" },
  { nr: "2", title: "Bedrijfseconomie", desc: "Bedrijf, winst en kosten", domain: "economisch" },
  { nr: "3", title: "Wiskundige vaardigheden", desc: "Functies invullen en grafieken lezen", domain: "wiskunde" },
  { nr: "4", title: "Maatschappelijk inzicht", desc: "Sectoren en de rol van de overheid", domain: "economisch" },
  { nr: "5", title: "Leesvaardigheden", desc: "Contexten herkennen en koppelen", domain: "grafisch" },
];

// ════════════════════════════════════════════════════
// BUILD SECTION CHILDREN
// ════════════════════════════════════════════════════
const children = [];

// ── Title + TOC (single page) ──
children.push(...titleBlock(
  "Markt en marktstructuur \u2014 Voorkennis",
  "Wat moet je al weten voordat je aan deze paragraaf begint?"
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
// CHAPTER 1 — Basis economische concepten
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 1, "Basis economische concepten"));
children.push(sp(120));

children.push(h2d("Vraag en aanbod", VK_DOMAINS.economisch.color));
children.push(p("Markten bestaan uit vragers (consumenten) en aanbieders (producenten). De prijs komt tot stand door de interactie tussen vraag en aanbod. Wanneer de vraag stijgt en het aanbod gelijk blijft, zal de prijs stijgen. Omgekeerd geldt dat een groter aanbod bij gelijkblijvende vraag de prijs doet dalen."));
children.push(tipBox("Denk aan een markt als een plek waar kopers en verkopers samenkomen \u2014 dat kan ook online zijn!"));
children.push(sp(60));

children.push(h2d("Consumentengedrag", VK_DOMAINS.economisch.color));
children.push(p("Consumenten maken bewuste keuzes op basis van prijs en kwaliteit. Ze vergelijken producten en kiezen het alternatief dat het beste bij hun behoeften en budget past."));
children.push(sp(60));

children.push(checkBox("Kun je uitleggen wat vraag en aanbod zijn en hoe ze de prijs be\u00efnvloeden?"));
children.push(sp(60));
children.push(summarySchema([
  ["Vraag", "Hoeveelheid die consumenten willen kopen bij een prijs"],
  ["Aanbod", "Hoeveelheid die producenten willen verkopen bij een prijs"],
  ["Prijs", "Komt tot stand door interactie vraag en aanbod"],
], VK_DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// CHAPTER 2 — Bedrijfseconomie
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 2, "Bedrijfseconomie"));
children.push(sp(120));

children.push(h2d("Wat is een bedrijf?", VK_DOMAINS.economisch.color));
children.push(p("Een bedrijf is een organisatie die producten of diensten levert met als doel winst te maken. Bedrijven combineren productiefactoren (arbeid, kapitaal, natuur en ondernemerschap) om goederen en diensten voort te brengen."));
children.push(sp(60));

children.push(h2d("Wat is winst?", VK_DOMAINS.economisch.color));
children.push(p("Winst is het verschil tussen de inkomsten (omzet) en de kosten van een bedrijf:"));
children.push(formulaBox(["Winst = Inkomsten \u2212 Kosten"], VK_DOMAINS.economisch.color));
children.push(sp(60));

children.push(checkBox("Kun je berekenen hoeveel winst een bedrijf maakt als je de inkomsten en kosten kent?"));
children.push(sp(60));
children.push(summarySchema([
  ["Bedrijf", "Organisatie die producten/diensten levert voor winst"],
  ["Winst", "Winst = Inkomsten \u2212 Kosten"],
], VK_DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// CHAPTER 3 — Wiskundige vaardigheden
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("wiskunde", 3, "Wiskundige vaardigheden"));
children.push(sp(120));

children.push(h2d("Functies lezen", VK_DOMAINS.wiskunde.color));
children.push(p("In de economie gebruiken we wiskundige functies om verbanden weer te geven. Bij vraag en aanbod zie je vaak lineaire functies:"));
children.push(formulaBox(["Qv = \u22125p + 100  (vraagfunctie)", "Qa = 2p \u2212 10  (aanbodfunctie)"], VK_DOMAINS.wiskunde.color));
children.push(p("Je moet getallen in deze formules kunnen invullen en de uitkomst berekenen."));
children.push(sp(60));

children.push(h2d("Grafieken lezen", VK_DOMAINS.wiskunde.color));
children.push(p("Economische grafieken hebben meestal de hoeveelheid (Q) op de horizontale as en de prijs (p) op de verticale as. Je moet punten kunnen aflezen en het snijpunt van twee lijnen kunnen bepalen."));
children.push(tipBox("Let op: in de economie staat de prijs op de verticale as, anders dan in de wiskunde!"));
children.push(sp(60));

children.push(checkBox("Kun je getallen invullen in een functie en een grafiek met prijs en hoeveelheid lezen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Vraagfunctie", "Qv = \u22125p + 100 \u2014 verband prijs en gevraagde hoeveelheid"],
  ["Aanbodfunctie", "Qa = 2p \u2212 10 \u2014 verband prijs en aangeboden hoeveelheid"],
  ["Grafiek", "Horizontale as = hoeveelheid (Q), verticale as = prijs (p)"],
], VK_DOMAINS.wiskunde.color));

// ════════════════════════════════════════════════════
// CHAPTER 4 — Maatschappelijk inzicht
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 4, "Maatschappelijk inzicht"));
children.push(sp(120));

children.push(h2d("Sectoren", VK_DOMAINS.economisch.color));
children.push(p("De economie is opgedeeld in drie sectoren:"));
children.push(bullet("Primaire sector: landbouw, visserij, mijnbouw (grondstoffen)"));
children.push(bullet("Secundaire sector: industrie (verwerking van grondstoffen tot producten)"));
children.push(bullet("Tertiaire sector: diensten (transport, onderwijs, zorg, financi\u00ebn)"));
children.push(sp(60));

children.push(h2d("Rol van de overheid", VK_DOMAINS.economisch.color));
children.push(p("De overheid speelt een belangrijke rol in de economie door regels te stellen, publieke diensten aan te bieden en toezicht te houden op markten. De overheid grijpt in wanneer de markt niet goed functioneert."));
children.push(sp(60));

children.push(checkBox("Weet je welke drie sectoren er zijn en wat de rol van de overheid is?"));
children.push(sp(60));
children.push(summarySchema([
  ["Sectoren", "Primair (landbouw), secundair (industrie), tertiair (diensten)"],
  ["Overheid", "Stelt regels, biedt diensten, houdt toezicht"],
], VK_DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// CHAPTER 5 — Leesvaardigheden
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("grafisch", 5, "Leesvaardigheden"));
children.push(sp(120));

children.push(h2d("Context begrijpen", VK_DOMAINS.grafisch.color));
children.push(p("Bij economie is het belangrijk om real-world voorbeelden te herkennen en te koppelen aan economische concepten. Als je een nieuwsbericht leest over stijgende prijzen, moet je dat kunnen verbinden met vraag en aanbod."));
children.push(tipBox("Probeer bij elk economisch concept een voorbeeld uit het dagelijks leven te bedenken."));
children.push(sp(60));

children.push(checkBox("Kun je een situatie uit het dagelijks leven koppelen aan economische begrippen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Context", "Herken real-world voorbeelden en koppel ze aan economische concepten"],
], VK_DOMAINS.grafisch.color));

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

children.push(checklistItem("Kan ik uitleggen wat vraag en aanbod zijn?"));
children.push(checklistItem("Begrijp ik dat consumenten kiezen op basis van prijs en kwaliteit?"));
children.push(checklistItem("Kan ik berekenen: winst = inkomsten \u2212 kosten?"));
children.push(checklistItem("Kan ik getallen in formules invullen?"));
children.push(checklistItem("Kan ik grafieken met prijs en hoeveelheid lezen?"));
children.push(checklistItem("Weet ik welke sectoren in Nederland er zijn?"));

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
      headers: { default: makeHeader("Markt en marktstructuur \u2014 Voorkennis") },
      footers: { default: makeFooter() },
      children,
    },
  ],
});

// ─── Write to file ───
(async () => {
  try {
    // Verify output directory
    if (!fs.existsSync(OUT_DIR)) {
      console.error("ERROR: Output directory does not exist:", OUT_DIR);
      process.exit(1);
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
