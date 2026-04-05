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

// ─── Unicode colon (U+F03A) ───
const UC = "\uF03A";

const OUT_DIR = `C:\\Users\\meije\\Documents\\0. claude - under construction\\3. Module 3 ${UC} Markt en overheid\\3.1 Hoofdstuk 1 ${UC} Markten\\3.1.1 Paragraaf 1 ${UC} Markt en marktstructuur`;
const OUT_FILE = path.join(OUT_DIR, "3.1.1 Markt en marktstructuur \u2013 uitleg vaardigheden.docx");

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
  markt:   { label: "Marktanalyse",     color: "1A5276", light: "EBF5FB", dark: "154360" },
  bedrijf: { label: "Bedrijfseconomie", color: "E67E22", light: "FEF5E7", dark: "BA6A1C" },
  arbeid:  { label: "Arbeidsmarkt",     color: "1E8449", light: "E8F8F0", dark: "186A3B" },
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
  { nr: "1", title: "Concrete en Abstracte Markten", desc: "Fysieke vs niet-fysieke markten", domain: "markt" },
  { nr: "2", title: "Homogeen versus Heterogeen", desc: "Productperceptie door consumenten", domain: "markt" },
  { nr: "3", title: "Toetredingsdrempels", desc: "Obstakels voor nieuwe aanbieders", domain: "markt" },
  { nr: "4", title: "De Redeneerketen", desc: "Van drempels naar prijs", domain: "markt" },
  { nr: "5", title: "Netwerksectoren", desc: "Rol van de overheid", domain: "markt" },
];

// ════════════════════════════════════════════════════
// BUILD SECTION CHILDREN
// ════════════════════════════════════════════════════
const children = [];

// ── Title + TOC (single page) ──
children.push(...titleBlock(
  "Markt en marktstructuur \u2014 Vaardigheden",
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
// SKILL 1 — Concrete en Abstracte Markten
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("markt", 1, "Concrete en Abstracte Markten"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.markt.color));
children.push(p("Eerste stap in het begrijpen van markten is weten wat een markt is."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.markt.color));
children.push(p("Er zijn twee soorten markten:"));
children.push(bullet("Concrete markt = een fysieke plek waar vragers en aanbieders elkaar ontmoeten (vismarkt, veiling, straatmarkt)."));
children.push(bullet("Abstracte markt = geen fysieke plek \u2014 handel verloopt via communicatie (huizenmarkt, wereldgraanmarkt, oliemarkt)."));
children.push(sp(40));
children.push(p("Kernvraag: Is er een fysieke ontmoetingsplek?"));
children.push(sp(60));

children.push(tipBox("Stel jezelf altijd de kernvraag: Is er een fysieke ontmoetingsplek? Zo ja \u2192 concreet. Zo nee \u2192 abstract."));
children.push(sp(60));

children.push(checkBox("Kun je bij een gegeven markt bepalen of deze concreet of abstract is?"));
children.push(sp(60));

children.push(summarySchema([
  ["Concreet", "Fysieke plek waar vragers en aanbieders samenkomen"],
  ["Abstract", "Geen vaste plek \u2014 handel via communicatie"],
  ["Kernvraag", "Is er een fysieke ontmoetingsplek?"],
  ["Voorbeeld", "Vismarkt (concreet) vs huizenmarkt (abstract)"],
  ["Verband met", "\u2192 Vaardigheid 2 (producttype bepaalt marktdynamiek)"],
], DOMAINS.markt.color));

// ════════════════════════════════════════════════════
// SKILL 2 — Homogeen versus Heterogeen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("markt", 2, "Homogeen versus Heterogeen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.markt.color));
children.push(p("Producttype bepaalt hoe concurrentie werkt."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.markt.color));
children.push(bullet("Homogeen = consument ziet geen verschil (stroom, benzine, prei) \u2192 alleen prijs telt."));
children.push(bullet("Heterogeen = consument ziet wel verschil (smartphones, auto\u2019s, caf\u00e9s) \u2192 merk/kwaliteit spelen mee."));
children.push(sp(60));

children.push(warningBox("Het gaat om de perceptie van de consument, niet om objectieve verschillen. Taxi\u2019s kunnen identiek zijn maar toch heterogeen in de ogen van de consument."));
children.push(sp(60));

children.push(checkBox("Kun je bij een product bepalen of het homogeen of heterogeen is vanuit consumentenperspectief?"));
children.push(sp(60));

children.push(summarySchema([
  ["Homogeen", "Consument ziet geen verschil \u2014 alleen prijs telt"],
  ["Heterogeen", "Consument ziet verschil \u2014 merk/kwaliteit spelen mee"],
  ["Criterium", "Perceptie van de consument, niet objectieve kenmerken"],
  ["Gevolg", "Homogeen \u2192 prijsconcurrentie; heterogeen \u2192 productdifferentiatie"],
  ["Verband met", "\u2192 Vaardigheid 1 (markttype) en 3 (drempels)"],
], DOMAINS.markt.color));

// ════════════════════════════════════════════════════
// SKILL 3 — Toetredingsdrempels
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("markt", 3, "Toetredingsdrempels"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.markt.color));
children.push(p("Drempels bepalen hoeveel bedrijven er op een markt zijn."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.markt.color));
children.push(p("Toetredingsdrempels zijn obstakels die nieuwe bedrijven verhinderen om toe te treden tot een markt."));
children.push(sp(40));
children.push(p("Voorbeelden van hoge drempels:", { bold: true }));
children.push(bullet("Hoog startkapitaal nodig"));
children.push(bullet("Bestaand netwerk van klanten vereist"));
children.push(bullet("Naamsbekendheid van gevestigde bedrijven"));
children.push(bullet("Vergunningen en regelgeving"));
children.push(bullet("Specifieke kennis of technologie"));
children.push(sp(40));
children.push(p("Voorbeelden van lage drempels:", { bold: true }));
children.push(bullet("Bijles geven"));
children.push(bullet("Freelance werk"));
children.push(bullet("Straatverkoop"));
children.push(sp(60));

children.push(tipBox("Bij examenvragen over toetredingsdrempels: noem altijd het type drempel (financieel, juridisch, technisch) \u00e9n een concreet voorbeeld."));
children.push(sp(60));

children.push(checkBox("Kun je in een beschrijving van een markt de toetredingsdrempels herkennen en benoemen?"));
children.push(sp(60));

children.push(summarySchema([
  ["Definitie", "Obstakels die nieuwe bedrijven verhinderen om toe te treden"],
  ["Hoge drempels", "Startkapitaal, netwerk, naamsbekendheid, vergunningen"],
  ["Lage drempels", "Weinig investering nodig \u2014 bijles, freelance, straatverkoop"],
  ["Gevolg", "Hoge drempels \u2192 weinig aanbieders; lage \u2192 veel aanbieders"],
  ["Verband met", "\u2192 Vaardigheid 4 (redeneerketen) en 5 (netwerksectoren)"],
], DOMAINS.markt.color));

// ════════════════════════════════════════════════════
// SKILL 4 — De Redeneerketen: Van Drempels naar Prijs
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("markt", 4, "De Redeneerketen: Van Drempels naar Prijs"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.markt.color));
children.push(p("Dit is de kern van het hele verhaal \u2014 de logische keten."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.markt.color));
children.push(p("Er zijn twee ketens:"));
children.push(sp(40));
children.push(formulaBox([
  "Hoge drempels \u2192 Weinig aanbieders \u2192 Minder concurrentie \u2192 Hogere prijzen",
], DOMAINS.markt.color));
children.push(sp(60));
children.push(formulaBox([
  "Lage drempels \u2192 Veel aanbieders \u2192 Veel concurrentie \u2192 Lagere prijzen",
], DOMAINS.markt.color));
children.push(sp(60));

children.push(p("Voorbeeld: de telecommarkt. Toen KPN een monopolie had, waren de prijzen hoog. Na toetreding van Vodafone en T-Mobile ontstond concurrentie en zijn de prijzen gedaald."));
children.push(sp(60));

children.push(tipBox("Bij examenvragen: doorloop altijd de hele keten. Begin bij de drempels, niet bij de prijs."));
children.push(sp(60));

children.push(checkBox("Kun je de volledige redeneerketen opschrijven en toepassen op een voorbeeld?"));
children.push(sp(60));

children.push(summarySchema([
  ["Keten 1", "Hoge drempels \u2192 weinig aanbieders \u2192 minder concurrentie \u2192 hogere prijzen"],
  ["Keten 2", "Lage drempels \u2192 veel aanbieders \u2192 veel concurrentie \u2192 lagere prijzen"],
  ["Voorbeeld", "Telecom: KPN monopolie \u2192 toetreding \u2192 prijsdaling"],
  ["Examentip", "Begin altijd bij de drempels, niet bij het prijseffect"],
  ["Verband met", "\u2192 Vaardigheid 3 (drempels) en 5 (netwerksectoren)"],
], DOMAINS.markt.color));

// ════════════════════════════════════════════════════
// SKILL 5 — Netwerksectoren en de Rol van de Overheid
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("markt", 5, "Netwerksectoren en de Rol van de Overheid"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.markt.color));
children.push(p("Sommige markten hebben zulke hoge drempels dat de overheid moet ingrijpen."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.markt.color));
children.push(p("Netwerksectoren zijn markten met zo hoge drempels dat zelfs grote bedrijven niet kunnen toetreden. Voorbeelden:"));
children.push(bullet("Elektriciteitsnet"));
children.push(bullet("Gasnet"));
children.push(bullet("Waterleidingen"));
children.push(bullet("Spoorwegen"));
children.push(sp(40));
children.push(p("De overheid staat voor een dilemma:"));
children.push(bullet("Verkopen (privatiseren): voordeel is marktwerking, maar risico op monopolistisch gedrag."));
children.push(bullet("Behouden (in overheidshanden): voordeel is eerlijke prijzen, maar de overheid moet zelf onderhouden."));
children.push(sp(60));

children.push(warningBox("Een netwerksector privatiseren betekent niet automatisch meer concurrentie \u2014 de eigenaar van het netwerk kan monopolistisch gedrag vertonen."));
children.push(sp(60));

children.push(checkBox("Kun je uitleggen waarom de overheid bij netwerksectoren voor een dilemma staat?"));
children.push(sp(60));

children.push(summarySchema([
  ["Netwerksector", "Markt met zo hoge drempels dat zelfs grote bedrijven niet kunnen toetreden"],
  ["Voorbeelden", "Elektriciteitsnet, gasnet, waterleidingen, spoorwegen"],
  ["Verkopen", "Pro: marktwerking. Con: monopolie-risico"],
  ["Behouden", "Pro: eerlijke prijzen. Con: overheid moet onderhouden"],
  ["Verband met", "\u2192 Vaardigheid 3 (drempels) en 4 (redeneerketen)"],
], DOMAINS.markt.color));

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

children.push(warningBox("\"Homogeen = identiek product\" \u2192 Onjuist! Homogeen gaat over consumentenperceptie. Taxi\u2019s kunnen fysiek identiek zijn maar toch als heterogeen worden ervaren."));
children.push(sp(80));
children.push(warningBox("\"Abstracte markt = de markt bestaat niet\" \u2192 Onjuist! Abstracte markten zijn heel re\u00ebel. De huizenmarkt is abstract maar wel een van de grootste markten."));
children.push(sp(80));
children.push(warningBox("\"Lage drempels = geen concurrentie\" \u2192 Onjuist! Juist omgekeerd: lage drempels leiden tot meer concurrentie, omdat meer bedrijven kunnen toetreden."));

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

children.push(checklistItem("Concrete vs abstracte markten onderscheiden"));
children.push(checklistItem("Homogeen vs heterogeen \u2014 en waarom consumentenperceptie telt"));
children.push(checklistItem("Toetredingsdrempels herkennen in beschrijvingen"));
children.push(checklistItem("De redeneerketen: drempels \u2192 aanbieders \u2192 concurrentie \u2192 prijs"));
children.push(checklistItem("Rol van de overheid bij netwerksectoren"));

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
      headers: { default: makeHeader("Markt en marktstructuur \u2014 Vaardigheden") },
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
