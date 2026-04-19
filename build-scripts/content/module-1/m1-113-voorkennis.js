/**
 * Template B: Uitleg Voorkennis — 1.1.3 Toepassen
 * Adapted from m1-112-voorkennis.js (1.1.2 Kiezen of delen).
 * Review paragraph synthesizing Chapter 1 concepts.
 *
 * COMPLIANT with econ-word-templates skill — all tables use WidthType.DXA,
 * 4-column visualTOC, correct summarySchema with header row, correct
 * domainBanner, formulaBox, checkBox, tipBox, warningBox, domainLegend.
 *
 * Run: NODE_PATH="$(npm root -g)" node m1-113-voorkennis.js
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

const OUT_DIR = "C:\\Projects\\4veco\\module one claude\\1.1 Hoofdstuk 1 - Voor niks gaat de zon op\\1.1.3 Paragraaf 3 - Toepassen\\1. Voorbereiden";
const OUT_FILE = path.join(OUT_DIR, "1.1.3 Toepassen \u2013 uitleg voorkennis.docx");

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
    children: [new ImageRun({
      data: buf, transformation: { width, height }, type: 'png',
      altText: { title: filename, description: 'asset:' + filename, name: filename },
    })],
  });
}

// ════════════════════════════════════════════════════
// CHAPTER DATA
// ════════════════════════════════════════════════════
const chapters = [
  { nr: "1", title: "Schaarste en behoeften",                      desc: "Beperkte middelen, onbeperkte wensen",           domain: "economisch" },
  { nr: "2", title: "Opofferingskosten en alternatieve kosten",    desc: "Waarde van het beste alternatief",               domain: "economisch" },
  { nr: "3", title: "Nettobaten berekenen",                        desc: "Baten minus kosten van een keuze",               domain: "economisch" },
  { nr: "4", title: "Budgetvergelijking opstellen",                desc: "B = p\u2081q\u2081 + p\u2082q\u2082 invullen",   domain: "economisch" },
  { nr: "5", title: "Budgetlijn tekenen en snijpunten berekenen",  desc: "Snijpunten berekenen en lijn tekenen",           domain: "grafisch" },
  { nr: "6", title: "Verschuivingen van de budgetlijn",            desc: "Evenwijdig of kantelen bij veranderingen",       domain: "economisch" },
];

// ════════════════════════════════════════════════════
// BUILD SECTION CHILDREN
// ════════════════════════════════════════════════════
const children = [];

// ── Title + TOC (single page) ──
children.push(...titleBlock(
  "1.1.3 Toepassen \u2014 Uitleg voorkennis",
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
// CHAPTER 1 — Schaarste en behoeften (from 1.1.1)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 1, "Schaarste en behoeften"));
children.push(sp(120));

children.push(h2d("Wat is schaarste?", VK_DOMAINS.economisch.color));
children.push(p("Schaarste is het kernbegrip van de economie: de beschikbare middelen (geld, tijd, grondstoffen) zijn beperkt, terwijl de behoeften onbeperkt zijn. Hierdoor moet je altijd keuzes maken. Schaarste geldt voor consumenten, bedrijven en overheden."));
children.push(sp(60));

children.push(h2d("Behoeften en middelen", VK_DOMAINS.economisch.color));
children.push(p("Behoeften zijn wensen die je wilt vervullen. Middelen zijn de schaarse hulpbronnen waarmee je behoeften vervult. Omdat middelen beperkt zijn, kun je nooit alle behoeften tegelijk bevredigen \u2014 je moet kiezen."));
children.push(tipBox("Schaarste betekent niet dat iets zeldzaam is, maar dat er keuzes nodig zijn omdat middelen beperkt zijn ten opzichte van behoeften."));
children.push(sp(60));

// ── Embedded image: schaarste-samenhang ──
const imgCh1 = embedAssetImage('schaarste-samenhang', 500, 250);
if (imgCh1) children.push(imgCh1);

children.push(checkBox("Kun je uitleggen waarom schaarste leidt tot het maken van keuzes?"));
children.push(sp(60));
children.push(summarySchema([
  ["Schaarste", "Middelen zijn beperkt ten opzichte van behoeften"],
  ["Behoeften", "Onbeperkte wensen die je wilt vervullen"],
  ["Middelen", "Geld, tijd, grondstoffen \u2014 altijd beperkt"],
  ["Gevolg", "Je moet kiezen \u2192 elke keuze heeft opofferingskosten"],
], VK_DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// CHAPTER 2 — Opofferingskosten en alternatieve kosten (from 1.1.1)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 2, "Opofferingskosten en alternatieve kosten"));
children.push(sp(120));

children.push(h2d("Wat zijn opofferingskosten?", VK_DOMAINS.economisch.color));
children.push(p("Opofferingskosten zijn de waarde van het beste alternatief dat je opgeeft wanneer je een keuze maakt. Elke keuze heeft opofferingskosten, omdat je altijd iets anders had kunnen doen met dezelfde middelen."));
children.push(formulaBox(["Opofferingskosten = waarde beste gemiste alternatief", "", "Voorbeeld:", "Je neemt een uur vrije tijd in plaats van werken voor \u20AC10/uur", "Opofferingskosten = \u20AC10"], VK_DOMAINS.economisch.color));
children.push(sp(60));

children.push(h2d("Alternatieve kosten", VK_DOMAINS.economisch.color));
children.push(p("Alternatieve kosten zijn een synoniem voor opofferingskosten. Je vergelijkt altijd met het beste alternatief, niet met alle alternatieven samen. Als je kunt kiezen tussen werken, studeren of sporten, en je kiest sporten, dan zijn de opofferingskosten gelijk aan de waarde van werken (het beste gemiste alternatief)."));
children.push(warningBox("Vergelijk altijd met het beste alternatief, niet met alle alternatieven samen."));
children.push(sp(60));

children.push(checkBox("Kun je de opofferingskosten berekenen van een keuze als je de waarde van de alternatieven kent?"));
children.push(sp(60));
children.push(summarySchema([
  ["Opofferingskosten", "Waarde van het beste alternatief dat je opgeeft"],
  ["Beste alternatief", "Vergelijk alleen met de op-\u00e9\u00e9n-na-beste optie"],
  ["Altijd aanwezig", "Elke keuze heeft opofferingskosten"],
], VK_DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// CHAPTER 3 — Nettobaten berekenen (from 1.1.1)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 3, "Nettobaten berekenen"));
children.push(sp(120));

children.push(h2d("Wat zijn nettobaten?", VK_DOMAINS.economisch.color));
children.push(p("Nettobaten zijn het verschil tussen de totale baten (opbrengsten, voordelen) en de totale kosten van een keuze. Een rationele keuze levert positieve nettobaten op."));
children.push(formulaBox(["Nettobaten = totale baten \u2212 totale kosten", "", "Voorbeeld:", "Baten van werken: \u20AC80 inkomen", "Kosten: 8 uur vrije tijd (\u00d7 \u20AC10 = \u20AC80 opofferingskosten)", "Nettobaten = \u20AC80 \u2212 \u20AC80 = \u20AC0"], VK_DOMAINS.economisch.color));
children.push(sp(60));

children.push(h2d("Rationeel kiezen", VK_DOMAINS.economisch.color));
children.push(p("Een economisch rationele keuze is een keuze waarbij de nettobaten zo groot mogelijk zijn. Je kiest de optie met de hoogste nettobaten. Als de nettobaten negatief zijn, is het beter om de keuze niet te maken."));
children.push(tipBox("Nettobaten kunnen ook niet-geldelijk zijn. Denk aan plezier, gezondheid of toekomstig voordeel."));
children.push(sp(60));

children.push(checkBox("Kun je de nettobaten berekenen van een keuze als je baten en kosten kent?"));
children.push(sp(60));
children.push(summarySchema([
  ["Nettobaten", "Totale baten minus totale kosten"],
  ["Positief", "Keuze is de moeite waard"],
  ["Negatief", "Keuze is niet de moeite waard"],
  ["Rationeel", "Kies de optie met de hoogste nettobaten"],
], VK_DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// CHAPTER 4 — Budgetvergelijking opstellen (from 1.1.2)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 4, "Budgetvergelijking opstellen"));
children.push(sp(120));

children.push(h2d("Wat is een budgetvergelijking?", VK_DOMAINS.economisch.color));
children.push(p("De budgetvergelijking beschrijft alle combinaties van twee goederen die een consument kan kopen als het hele budget wordt besteed. Dit is de wiskundige basis voor de budgetlijn."));
children.push(formulaBox(["B = p\u2081 \u00D7 q\u2081 + p\u2082 \u00D7 q\u2082", "", "B = budget, p = prijs, q = hoeveelheid", "", "Voorbeeld: B = \u20AC36, p\u2081 = \u20AC2, p\u2082 = \u20AC12", "36 = 2q\u2081 + 12q\u2082"], VK_DOMAINS.economisch.color));
children.push(sp(60));

children.push(h2d("Snijpunten met de assen", VK_DOMAINS.economisch.color));
children.push(p("De snijpunten geven aan hoeveel je maximaal van elk goed kunt kopen als je niets van het andere goed koopt."));
children.push(formulaBox(["q\u2081\u1D50\u1D43\u02E3 = B / p\u2081  (x-snijpunt)", "q\u2082\u1D50\u1D43\u02E3 = B / p\u2082  (y-snijpunt)"], VK_DOMAINS.economisch.color));
children.push(sp(60));

children.push(checkBox("Kun je de budgetvergelijking opstellen en de snijpunten berekenen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Formule", "B = p\u2081q\u2081 + p\u2082q\u2082"],
  ["x-snijpunt", "q\u2081\u1D50\u1D43\u02E3 = B / p\u2081"],
  ["y-snijpunt", "q\u2082\u1D50\u1D43\u02E3 = B / p\u2082"],
], VK_DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// CHAPTER 5 — Budgetlijn tekenen en snijpunten berekenen (from 1.1.2)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("grafisch", 5, "Budgetlijn tekenen en snijpunten berekenen"));
children.push(sp(120));

children.push(h2d("Hoe teken je een budgetlijn?", VK_DOMAINS.grafisch.color));
children.push(p("Een budgetlijn is een rechte lijn die alle combinaties van twee goederen toont die een consument met een bepaald budget kan kopen. Je tekent de budgetlijn door de snijpunten met de assen te berekenen en te verbinden."));
children.push(sp(60));

children.push(h2d("Stappenplan", VK_DOMAINS.grafisch.color));
children.push(p("1. Bereken het snijpunt met de x-as: q\u2081\u1D50\u1D43\u02E3 = B / p\u2081. 2. Bereken het snijpunt met de y-as: q\u2082\u1D50\u1D43\u02E3 = B / p\u2082. 3. Zet beide punten uit in het assenstelsel. 4. Verbind ze met een rechte lijn."));
children.push(tipBox("Zet altijd de aantallen bij de snijpunten op de assen. De helling is \u2212p\u2081/p\u2082."));
children.push(sp(60));

// ── Embedded image: budgetlijn-gecombineerd ──
const imgCh5 = embedAssetImage('budgetlijn-gecombineerd', 500, 250);
if (imgCh5) children.push(imgCh5);

children.push(checkBox("Kun je een budgetlijn tekenen en de snijpunten met de assen berekenen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Stap 1", "Bereken x-snijpunt: q\u2081\u1D50\u1D43\u02E3 = B / p\u2081"],
  ["Stap 2", "Bereken y-snijpunt: q\u2082\u1D50\u1D43\u02E3 = B / p\u2082"],
  ["Stap 3", "Verbind de twee snijpunten met een rechte lijn"],
  ["Helling", "\u2212p\u2081/p\u2082 = de ruilvoet tussen de twee goederen"],
], VK_DOMAINS.grafisch.color));

// ════════════════════════════════════════════════════
// CHAPTER 6 — Verschuivingen van de budgetlijn (from 1.1.2)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 6, "Verschuivingen van de budgetlijn"));
children.push(sp(120));

children.push(h2d("Evenwijdige verschuiving", VK_DOMAINS.economisch.color));
children.push(p("Als het budget verandert maar de prijzen gelijk blijven, verschuift de budgetlijn evenwijdig. Meer budget \u2192 de lijn schuift naar buiten. Minder budget \u2192 de lijn schuift naar binnen. De helling blijft gelijk."));
children.push(sp(60));

children.push(h2d("Kanteling (draaien)", VK_DOMAINS.economisch.color));
children.push(p("Als de prijs van \u00e9\u00e9n goed verandert, kantelt de budgetlijn rond het snijpunt van het andere goed. Het snijpunt van het goed waarvan de prijs verandert, verschuift. Het andere snijpunt blijft gelijk."));
children.push(formulaBox([
  "Evenwijdige verschuiving: budget verandert, prijzen niet",
  "Kanteling: \u00e9\u00e9n prijs verandert, budget niet",
  "",
  "Gecombineerd: als \u00e9n budget \u00e9n prijs veranderen,",
  "kun je beide effecten achter elkaar toepassen",
], VK_DOMAINS.economisch.color));
children.push(sp(60));

children.push(warningBox("Verwar een evenwijdige verschuiving niet met een kanteling! Kijk altijd wat er verandert: het budget of een prijs."));
children.push(sp(60));

children.push(checkBox("Kun je het verschil uitleggen tussen een evenwijdige verschuiving en een kanteling van de budgetlijn?"));
children.push(sp(60));
children.push(summarySchema([
  ["Evenwijdige verschuiving", "Budget verandert, prijzen niet \u2192 helling gelijk"],
  ["Kanteling", "E\u00e9n prijs verandert \u2192 lijn draait rond vast snijpunt"],
  ["Gecombineerd", "Beide effecten tegelijk \u2192 beide snijpunten veranderen"],
], VK_DOMAINS.economisch.color));

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

children.push(checklistItem("Kan ik uitleggen wat schaarste is en waarom het leidt tot keuzes?"));
children.push(checklistItem("Kan ik de opofferingskosten van een keuze berekenen?"));
children.push(checklistItem("Kan ik de nettobaten van een keuze berekenen?"));
children.push(checklistItem("Kan ik de budgetvergelijking opstellen en snijpunten berekenen?"));
children.push(checklistItem("Kan ik een budgetlijn tekenen in een assenstelsel?"));
children.push(checklistItem("Kan ik het verschil uitleggen tussen een evenwijdige verschuiving en een kanteling?"));

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
      headers: { default: makeHeader("1.1.3 Toepassen \u2013 Uitleg voorkennis") },
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
