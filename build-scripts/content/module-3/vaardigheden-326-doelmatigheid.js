/**
 * Vaardigheden 3.2.6 Economische doelmatigheid
 * 6 skills: CS arceren, PS arceren, Harbergerdriehoek, TS vergelijken,
 * efficiëntie beoordelen, Pareto-efficiëntie.
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/vaardigheden-326-doelmatigheid.js
 */
const path = require("path");
const fs = require("fs");

const NODE_PATH = path.join(process.env.APPDATA, "npm", "node_modules");
process.env.NODE_PATH = NODE_PATH;
require("module").Module._initPaths();

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType,
  Header, Footer, PageNumber, LevelFormat, PageBreak,
} = require("docx");

// ─── Output ───
const MODULE_ROOT = process.env.MODULE_ROOT ? path.resolve(process.env.MODULE_ROOT) : path.resolve(__dirname, "..");
const OUT_DIR = path.resolve(MODULE_ROOT, "3.2 Hoofdstuk 2 - Marktvormen en hun marktevenwicht/3.2.6 Paragraaf 6 - Marktvormen en hun economische doelmatigheid/2. Leren");
const OUT_FILE = path.join(OUT_DIR, "3.2.6 Marktvormen en hun economische doelmatigheid \u2013 uitleg vaardigheden.docx");

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
  overheid:{ label: "Overheid & Handel", color: "1E8449", light: "E8F8F0", dark: "186A3B" },
};

// ─── Basic helpers ───
const sp = (after = 80) => new Paragraph({ spacing: { after }, children: [] });

const p = (text, opts = {}) => new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({ text, font: "Arial", size: 22, color: C.dark, ...opts })],
});

const pRuns = (runs) => new Paragraph({
  spacing: { after: 120 },
  children: runs.map(r => new TextRun({ font: "Arial", size: 22, color: C.dark, ...r })),
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

const bulletRuns = (runs) => new Paragraph({
  spacing: { after: 80 },
  bullet: { level: 0 },
  children: runs.map(r => new TextRun({ font: "Arial", size: 22, color: C.dark, ...r })),
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
function domainBanner(domain, skillNumber, skillTitle) {
  const d = DOMAINS[domain];
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

// ─── Formula box ───
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

// ─── Visual TOC ───
function visualTOC(skills) {
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
    const d = DOMAINS[s.domain];
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
function domainLegend() {
  const entries = Object.values(DOMAINS);
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

// ─── Checklist ───
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
// SKILLS DATA
// ════════════════════════════════════════════════════
const skills = [
  { nr: "1", title: "CS herkennen en arceren",           desc: "Consumentensurplus in een V/A-diagram aanwijzen en berekenen", domain: "markt" },
  { nr: "2", title: "PS herkennen en arceren",           desc: "Producentensurplus in een V/A-diagram aanwijzen en berekenen", domain: "markt" },
  { nr: "3", title: "Harbergerdriehoek berekenen",      desc: "Welvaartsverlies bij monopolie bepalen en verklaren", domain: "markt" },
  { nr: "4", title: "Totaal surplus vergelijken",        desc: "TS bij VC en monopolie vergelijken", domain: "markt" },
  { nr: "5", title: "Effici\u00ebntie beoordelen",              desc: "Is een markt effici\u00ebnt? P = MK als criterium", domain: "markt" },
  { nr: "6", title: "Pareto-effici\u00ebntie toepassen",        desc: "Pareto-verbetering en Pareto-effici\u00ebntie herkennen", domain: "markt" },
];

// ════════════════════════════════════════════════════
// BUILD SECTION CHILDREN
// ════════════════════════════════════════════════════
const children = [];

// ── Title + TOC ──
children.push(...titleBlock(
  "Economische doelmatigheid \u2014 Vaardigheden",
  "Welke vaardigheden leer je in deze paragraaf?"
));
children.push(sp(80));
children.push(domainLegend());
children.push(sp(120));
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 120 },
  children: [new TextRun({ text: "Inhoudsopgave", bold: true, font: "Arial", size: 36, color: C.navy })],
}));
children.push(sp(60));
children.push(visualTOC(skills));

// ════════════════════════════════════════════════════
// SKILL 1 — CS herkennen en arceren
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("markt", 1, "CS herkennen en arceren"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.markt.color));
children.push(p("Het consumentensurplus (CS) laat zien hoeveel voordeel consumenten hebben doordat ze minder betalen dan ze bereid waren te betalen."));
children.push(p("Door het CS te arceren in een grafiek kun je het verschil tussen marktvormen zichtbaar maken."));
children.push(sp(60));

children.push(h2d("Stappenplan", DOMAINS.markt.color));
children.push(formulaBox([
  "Stap 1: Zoek de evenwichtsprijs (P*) en -hoeveelheid (Q*)",
  "Stap 2: Zoek het snijpunt van de vraaglijn met de P-as (= maximale betalingsbereidheid)",
  "Stap 3: Arceer de driehoek: boven P*, onder V, van Q = 0 tot Q*",
  "Stap 4: Bereken: CS = \u00bd \u00d7 Q* \u00d7 (P_max \u2212 P*)",
], DOMAINS.markt.color));
children.push(sp(60));

children.push(h2d("Voorbeeld", DOMAINS.markt.color));
children.push(p("Bij volkomen concurrentie: V: P = \u221260 + Q, A: P = Q. Evenwicht: Q* = 30, P* = 30."));
children.push(formulaBox([
  "P_max = 60 (snijpunt V met P-as, bij Q = 0)",
  "CS = \u00bd \u00d7 30 \u00d7 (60 \u2212 30)",
  "CS = \u00bd \u00d7 30 \u00d7 30 = 450",
], DOMAINS.markt.color));
children.push(sp(40));
children.push(tipBox("CS is altijd een driehoek bij een lineaire vraaglijn. Gebruik de formule \u00bd \u00d7 basis \u00d7 hoogte."));
children.push(sp(40));
children.push(summarySchema([
  ["Formule", "CS = \u00bd \u00d7 Q* \u00d7 (P_max \u2212 P*)"],
  ["Grafisch", "Driehoek boven P*, onder V"],
  ["Bij VC", "CS = 450"],
], DOMAINS.markt.color));

// ════════════════════════════════════════════════════
// SKILL 2 — PS herkennen en arceren
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("markt", 2, "PS herkennen en arceren"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.markt.color));
children.push(p("Het producentensurplus (PS) is het voordeel voor producenten: het verschil tussen de ontvangen prijs en de minimale prijs waarvoor ze willen produceren (= de MK-lijn)."));
children.push(p("Samen met het CS vormt het PS het totaal surplus."));
children.push(sp(60));

children.push(h2d("Stappenplan", DOMAINS.markt.color));
children.push(formulaBox([
  "Stap 1: Zoek de evenwichtsprijs (P*) en -hoeveelheid (Q*)",
  "Stap 2: Zoek het snijpunt van de aanbodlijn (MK) met de P-as",
  "Stap 3: Arceer de driehoek: onder P*, boven MK, van Q = 0 tot Q*",
  "Stap 4: Bereken: PS = \u00bd \u00d7 Q* \u00d7 (P* \u2212 MK_min)",
], DOMAINS.markt.color));
children.push(sp(60));

children.push(h2d("Voorbeeld", DOMAINS.markt.color));
children.push(p("Bij volkomen concurrentie: MK = Q, Q* = 30, P* = 30."));
children.push(formulaBox([
  "MK_min = 0 (snijpunt MK met P-as, bij Q = 0)",
  "PS = \u00bd \u00d7 30 \u00d7 (30 \u2212 0)",
  "PS = \u00bd \u00d7 30 \u00d7 30 = 450",
], DOMAINS.markt.color));
children.push(sp(40));
children.push(tipBox("Bij een lineaire MK-lijn door de oorsprong is PS = \u00bd \u00d7 Q* \u00d7 P*."));
children.push(sp(40));
children.push(summarySchema([
  ["Formule", "PS = \u00bd \u00d7 Q* \u00d7 (P* \u2212 MK_min)"],
  ["Grafisch", "Driehoek onder P*, boven MK"],
  ["Bij VC", "PS = 450"],
], DOMAINS.markt.color));

// ════════════════════════════════════════════════════
// SKILL 3 — Harbergerdriehoek berekenen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("markt", 3, "Harbergerdriehoek berekenen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.markt.color));
children.push(p("De Harbergerdriehoek (deadweight loss / welvaartsverlies) is het stuk surplus dat verloren gaat bij een monopolie vergeleken met volkomen concurrentie."));
children.push(pRuns([
  { text: "Dit surplus verdwijnt volledig \u2014 het gaat niet naar de producent en niet naar de consument, het is simpelweg ", bold: true },
  { text: "weg", bold: true, color: C.red },
  { text: ". Transacties die voor koper \u00e9n verkoper voordelig waren, vinden niet plaats.", bold: true },
]));
children.push(sp(60));

children.push(h2d("Stappenplan", DOMAINS.markt.color));
children.push(formulaBox([
  "Stap 1: Bereken het VC-evenwicht: V = MK \u2192 Q_vc, P_vc",
  "Stap 2: Bereken de monopolie-uitkomst: MO = MK \u2192 Q_m",
  "Stap 3: Bepaal P_m op de vraaglijn bij Q_m",
  "Stap 4: Bepaal MK_m bij Q_m",
  "Stap 5: Harbergerdriehoek = \u00bd \u00d7 (Q_vc \u2212 Q_m) \u00d7 (P_m \u2212 MK_m)",
], DOMAINS.markt.color));
children.push(sp(60));

children.push(h2d("Voorbeeld", DOMAINS.markt.color));
children.push(p("VC: Q_vc = 30, P_vc = 30. Monopolie: Q_m = 20, P_m = 40, MK_m = 20."));
children.push(formulaBox([
  "V: P = 60 \u2212 Q,  MK: P = Q,  MO: P = 60 \u2212 2Q",
  "",
  "MO = MK:  60 \u2212 2Q = Q  \u2192  Q_m = 20",
  "P_m = 60 \u2212 20 = 40  (afgelezen op V)",
  "MK_m = 20  (ingevuld in MK = Q)",
  "",
  "Harbergerdriehoek = \u00bd \u00d7 (30 \u2212 20) \u00d7 (40 \u2212 20)",
  "                   = \u00bd \u00d7 10 \u00d7 20 = 100",
], DOMAINS.markt.color));
children.push(sp(40));

children.push(h2d("Wat zie je in de grafiek?", DOMAINS.markt.color));
children.push(bulletRuns([
  { text: "Punt B (30, 30)", bold: true },
  { text: " \u2014 het evenwicht bij volkomen concurrentie, waar V = MK." },
]));
children.push(bulletRuns([
  { text: "Punt A (20, 20)", bold: true },
  { text: " \u2014 waar MO = MK; hier bepaalt de monopolist zijn hoeveelheid." },
]));
children.push(bulletRuns([
  { text: "Punt C (20, 40)", bold: true },
  { text: " \u2014 de monopolieprijs, afgelezen op de vraaglijn bij Q = 20." },
]));
children.push(bulletRuns([
  { text: "Driehoek C-B-A", bold: true, color: C.red },
  { text: " is de Harbergerdriehoek: surplus dat bij VC w\u00e9l bestond maar door de lagere productie van de monopolist volledig verdwijnt. Niemand krijgt het." },
]));
children.push(sp(40));

children.push(warningBox("Er vindt \u00f3\u00f3k een herverdeling plaats: een deel van het vroegere CS wordt PS (de monopolist rekent een hogere prijs). Maar dat is geen welvaartsverlies \u2014 het verschuift alleen. De driehoek is wat \u00e9cht weg is."));
children.push(sp(40));

children.push(summarySchema([
  ["Formule", "DWL = \u00bd \u00d7 (Q_vc \u2212 Q_m) \u00d7 (P_m \u2212 MK_m)"],
  ["Grafisch", "Driehoek C-B-A (tussen V, MK, bij Q_m)"],
  ["Rekenvoorbeeld", "\u00bd \u00d7 10 \u00d7 20 = 100"],
  ["Betekenis", "Surplus dat niemand krijgt \u2014 transacties die niet plaatsvinden"],
], DOMAINS.markt.color));

// ════════════════════════════════════════════════════
// SKILL 4 — Totaal surplus vergelijken
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("markt", 4, "Totaal surplus vergelijken"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.markt.color));
children.push(p("Door het totaal surplus (TS = CS + PS) te vergelijken bij verschillende marktvormen kun je beoordelen welke marktvorm effici\u00ebnter is."));
children.push(p("Een hogere TS betekent meer totale welvaart."));
children.push(sp(60));

children.push(h2d("Stappenplan", DOMAINS.markt.color));
children.push(formulaBox([
  "Stap 1: Bereken CS en PS bij volkomen concurrentie",
  "Stap 2: Bereken CS en PS bij monopolie",
  "Stap 3: Bereken TS = CS + PS voor beide marktvormen",
  "Stap 4: Vergelijk: TS_vc \u2212 TS_m = Harbergerdriehoek",
], DOMAINS.markt.color));
children.push(sp(60));

children.push(h2d("Voorbeeld", DOMAINS.markt.color));
children.push(formulaBox([
  "Volkomen concurrentie:",
  "  CS = \u00bd \u00d7 30 \u00d7 30 = 450",
  "  PS = \u00bd \u00d7 30 \u00d7 30 = 450",
  "  TS = 450 + 450 = 900",
  "",
  "Monopolie (Q_m = 20, P_m = 40):",
  "  CS = \u00bd \u00d7 20 \u00d7 (60 \u2212 40) = 200",
  "  PS = \u00bd \u00d7 20 \u00d7 40 + \u00bd \u00d7 20 \u00d7 20 ... nee:",
  "  PS = oppervlakte onder P_m, boven MK, van 0 tot Q_m",
  "     = rechthoek (40 \u2212 20) \u00d7 20 + driehoek \u00bd \u00d7 20 \u00d7 20",
  "     = 400 + 200 = 600",
  "  TS = 200 + 600 = 800",
  "",
  "Welvaartsverlies = 900 \u2212 800 = 100 = Harbergerdriehoek",
], DOMAINS.markt.color));
children.push(sp(40));
children.push(checkBox("De daling van het CS (\u2212250) is groter dan de stijging van het PS (+150). Het verschil (100) is de Harbergerdriehoek."));
children.push(sp(40));
children.push(summarySchema([
  ["TS bij VC", "CS 450 + PS 450 = 900"],
  ["TS bij monopolie", "CS 200 + PS 600 = 800"],
  ["Verschil", "100 = Harbergerdriehoek"],
  ["Conclusie", "CS daalt meer dan PS stijgt \u2192 netto welvaartsverlies"],
], DOMAINS.markt.color));

// ════════════════════════════════════════════════════
// SKILL 5 — Effici\u00ebntie beoordelen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("markt", 5, "Effici\u00ebntie beoordelen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.markt.color));
children.push(p("In de economie beoordeel je of een markt effici\u00ebnt is door te kijken of het totaal surplus maximaal is."));
children.push(p("Dit helpt bij het analyseren van beleidsmaatregelen en marktstructuren."));
children.push(sp(60));

children.push(h2d("Wanneer is een markt effici\u00ebnt?", DOMAINS.markt.color));
children.push(bullet("P = MK (prijs is gelijk aan marginale kosten)"));
children.push(bullet("Het totaal surplus is maximaal"));
children.push(bullet("Er is geen welvaartsverlies (Harbergerdriehoek = 0)"));
children.push(bullet("Dit geldt bij volkomen concurrentie"));
children.push(sp(40));

children.push(h2d("Wanneer is een markt ineffici\u00ebnt?", DOMAINS.markt.color));
children.push(bullet("P > MK (monopolist vraagt meer dan de marginale kosten)"));
children.push(bullet("Het totaal surplus is niet maximaal"));
children.push(bullet("Er is een Harbergerdriehoek > 0"));
children.push(bullet("Hoge toetredingsdrempels houden de ineffici\u00ebntie in stand"));
children.push(sp(60));

children.push(h2d("Voorbeeld", DOMAINS.markt.color));
children.push(p("Het elektriciteitsduopolie in Groot-Brittanni\u00eb: de prijs ligt 25% boven de GTK. Omdat P > MK is het TS niet maximaal. De markt is dus ineffici\u00ebnt."));
children.push(p("Toetreding vindt niet plaats omdat de drempels hoog zijn."));
children.push(sp(40));
children.push(summarySchema([
  ["Effici\u00ebnt", "P = MK, TS maximaal, geen DWL"],
  ["Ineffici\u00ebnt", "P > MK, TS niet maximaal, DWL > 0"],
  ["Oorzaak", "Marktmacht + hoge toetredingsdrempels"],
], DOMAINS.markt.color));

// ════════════════════════════════════════════════════
// SKILL 6 — Pareto-effici\u00ebntie toepassen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("markt", 6, "Pareto-effici\u00ebntie toepassen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.markt.color));
children.push(p("Pareto-effici\u00ebntie is een andere manier om naar effici\u00ebntie te kijken: niet via surplus, maar via individuele voor- en nadelen."));
children.push(sp(60));

children.push(h2d("De begrippen", DOMAINS.markt.color));
children.push(bulletRuns([
  { text: "Pareto-effici\u00ebnt: ", bold: true },
  { text: "een situatie waarbij het niet mogelijk is om iemand erop vooruit te laten gaan zonder dat iemand anders erop achteruitgaat." },
]));
children.push(bulletRuns([
  { text: "Pareto-verbetering: ", bold: true },
  { text: "een verandering waarbij minstens \u00e9\u00e9n persoon erop vooruitgaat en niemand erop achteruitgaat." },
]));
children.push(sp(40));

children.push(h2d("De test", DOMAINS.markt.color));
children.push(formulaBox([
  "Stap 1: Beschrijf de huidige situatie",
  "Stap 2: Beschrijf de voorgestelde verandering",
  "Stap 3: Bepaal: gaat iemand erop vooruit?",
  "Stap 4: Bepaal: gaat iemand erop achteruit?",
  "Stap 5: Als ja op 3 en nee op 4 \u2192 Pareto-verbetering",
  "Stap 6: Als er g\u00e9\u00e9n verbetering meer mogelijk is \u2192 Pareto-effici\u00ebnt",
], DOMAINS.markt.color));
children.push(sp(60));

children.push(h2d("Voorbeeld", DOMAINS.markt.color));
children.push(p("Esther zit vooraan, Mieke achteraan. Mieke wil graag vooraan zitten, Esther maakt het niet uit."));
children.push(p("Als ze ruilen: Mieke gaat erop vooruit, Esther gaat er niet op achteruit. Dit is een Pareto-verbetering."));
children.push(sp(40));
children.push(warningBox("Pareto-effici\u00ebnt betekent niet eerlijk! Een situatie kan Pareto-effici\u00ebnt zijn terwijl \u00e9\u00e9n persoon alles heeft en de rest niets. Het zegt alleen dat je niemand meer kunt helpen zonder een ander te benadelen."));
children.push(sp(40));
children.push(summarySchema([
  ["Pareto-verbetering", "Iemand beter af, niemand slechter af"],
  ["Pareto-effici\u00ebnt", "Geen Pareto-verbetering meer mogelijk"],
  ["Let op", "Zegt niets over verdeling of eerlijkheid"],
], DOMAINS.markt.color));

// ════════════════════════════════════════════════════
// VALKUILEN
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 200 },
  children: [new TextRun({ text: "Veelvoorkomende valkuilen", bold: true, font: "Arial", size: 36, color: C.navy })],
}));
children.push(p("Hieronder de belangrijkste valkuilen op een rij:"));
children.push(sp(60));
children.push(warningBox("\"Meer PS bij monopolie = beter voor de markt\" \u2014 Onjuist: PS stijgt, maar CS daalt meer. Het TS daalt altijd."));
children.push(sp(40));
children.push(warningBox("\"Pareto-effici\u00ebnt = eerlijk\" \u2014 Onjuist: Pareto zegt niets over verdeling."));
children.push(sp(40));
children.push(warningBox("\"De Harbergerdriehoek is het hele surplus dat verdwijnt\" \u2014 Nee: een deel van het CS wordt PS (herverdeling), maar dat is geen verlies. Alleen de driehoek is echt weg."));
children.push(sp(40));
children.push(warningBox("\"De Harbergerdriehoek meet al het welvaartsverlies\" \u2014 De driehoek meet het allocatieve verlies. Er kan ook dynamisch verlies zijn (minder innovatie door gebrek aan concurrentie)."));

// ════════════════════════════════════════════════════
// SAMENVATTING CHECKLIST
// ════════════════════════════════════════════════════
children.push(sp(200));
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 200 },
  children: [new TextRun({ text: "Samenvatting checklist", bold: true, font: "Arial", size: 36, color: C.navy })],
}));
children.push(p("Controleer of je de volgende vaardigheden beheerst:"));
children.push(sp(40));
children.push(checklistItem("CS herkennen en arceren in een grafiek"));
children.push(checklistItem("PS herkennen en arceren in een grafiek"));
children.push(checklistItem("Harbergerdriehoek herkennen, berekenen en verklaren"));
children.push(checklistItem("Totaal surplus vergelijken bij VC en monopolie"));
children.push(checklistItem("Beoordelen of een markt effici\u00ebnt is"));
children.push(checklistItem("Pareto-effici\u00ebntie en Pareto-verbetering toepassen op een voorbeeld"));

// ════════════════════════════════════════════════════
// WRITE DOCUMENT
// ════════════════════════════════════════════════════
async function writeDoc() {
  const doc = new Document({
    styles: DOC_STYLES,
    numbering: { config: [CHECKLIST_NUMBERING] },
    sections: [{
      properties: {
        page: PAGE,
        titlePage: false,
      },
      headers: { default: makeHeader("3.2.6 Economische doelmatigheid \u2014 Vaardigheden") },
      footers: { default: makeFooter() },
      children,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUT_FILE, buffer);
  console.log("Saved:", OUT_FILE);
  console.log("Size:", (buffer.length / 1024).toFixed(1), "KB");
}

writeDoc().catch(err => { console.error("ERROR:", err); process.exit(1); });
