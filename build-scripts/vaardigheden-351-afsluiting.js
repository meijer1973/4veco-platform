/**
 * Vaardigheden 3.5.1 Afsluiting
 * REVIEW paragraph — covers all key skills from chapters 1-4.
 *
 * Run: NODE_PATH="$(npm root -g)" node vaardigheden-351-afsluiting.js
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

// ─── Output ───
const OUT_DIR = `C:\\Projects\\4veco\\3. Module 3 - Markt en overheid\\3.5 Hoofdstuk 5 - Afsluiting\\3.5.1 Paragraaf 1 - Afsluiting\\2. Leren`;
const OUT_FILE = path.join(OUT_DIR, "3.5.1 Afsluiting \u2013 uitleg vaardigheden.docx");

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
  { nr: "1", title: "Marktevenwicht berekenen",       desc: "Qv = Qa oplossen voor prijs en hoeveelheid", domain: "markt" },
  { nr: "2", title: "Winstmaximalisatie (MO = MK)",   desc: "Optimale productie bij monopolie/oligopolie", domain: "bedrijf" },
  { nr: "3", title: "Surplus berekenen",               desc: "CS, PS en totaal surplus bepalen", domain: "markt" },
  { nr: "4", title: "Welvaartsverlies bepalen",        desc: "Deadweight loss bij marktmacht of belasting", domain: "markt" },
  { nr: "5", title: "Belasting en subsidie",           desc: "Effecten op evenwichtsprijs en -hoeveelheid", domain: "overheid" },
  { nr: "6", title: "Comparatief voordeel",            desc: "Wie moet wat produceren?", domain: "overheid" },
  { nr: "7", title: "Ruilvoet berekenen",              desc: "Grenzen van internationale ruil", domain: "overheid" },
];

// ════════════════════════════════════════════════════
// BUILD SECTION CHILDREN
// ════════════════════════════════════════════════════
const children = [];

// ── Title + TOC (single page) ──
children.push(...titleBlock(
  "Afsluiting \u2014 Vaardigheden",
  "Overzicht van alle kernvaardigheden uit module 3"
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
// SKILL 1 — Marktevenwicht berekenen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("markt", 1, "Marktevenwicht berekenen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.markt.color));
children.push(p("Het marktevenwicht is het startpunt van vrijwel elke analyse. Zonder evenwichtsprijs en -hoeveelheid kun je geen surplus, belastingeffecten of welvaartsverlies berekenen."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.markt.color));
children.push(p("Je hebt twee vergelijkingen: een vraaglijn en een aanbodlijn. In het evenwicht geldt Qv = Qa (of Qv = Qa via de prijs)."));
children.push(sp(40));
children.push(formulaBox([
  "Stap 1: Stel Qv = Qa",
  "Stap 2: Los op naar P (evenwichtsprijs)",
  "Stap 3: Vul P in voor Q (evenwichtshoeveelheid)",
], DOMAINS.markt.color));
children.push(sp(60));

children.push(h2d("Voorbeeld", DOMAINS.markt.color));
children.push(p("Gegeven: Qv = 100 \u2013 2P en Qa = \u201320 + 3P"));
children.push(sp(40));
children.push(formulaBox([
  "100 \u2013 2P = \u201320 + 3P",
  "120 = 5P",
  "P* = 24",
  "Q* = 100 \u2013 2(24) = 52",
], DOMAINS.markt.color));
children.push(sp(60));

children.push(tipBox("Controleer altijd je antwoord door P* in beide vergelijkingen in te vullen. Beide moeten dezelfde Q geven.", DOMAINS.markt.color, DOMAINS.markt.light));
children.push(sp(60));

children.push(checkBox("Kun je bij twee lineaire vergelijkingen de evenwichtsprijs en -hoeveelheid berekenen?"));
children.push(sp(60));

children.push(summarySchema([
  ["Evenwicht", "Het punt waar Qv = Qa"],
  ["Methode", "Vergelijkingen gelijkstellen, oplossen naar P, dan Q berekenen"],
  ["Controle", "P* invullen in beide vergelijkingen \u2192 zelfde Q"],
  ["Verband met", "\u2192 Vaardigheid 3 (surplus) en 5 (belasting/subsidie)"],
], DOMAINS.markt.color));

// ════════════════════════════════════════════════════
// SKILL 2 — Winstmaximalisatie (MO = MK)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("bedrijf", 2, "Winstmaximalisatie (MO = MK)"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.bedrijf.color));
children.push(p("Bij marktvormen met prijszettingsmacht (monopolie, oligopolie) kiest het bedrijf zelf hoeveel het produceert. De gouden regel is: produceer tot MO = MK."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.bedrijf.color));
children.push(p("De marginale opbrengst (MO) is de extra opbrengst van \u00e9\u00e9n extra eenheid. De marginale kosten (MK) zijn de extra kosten. Zolang MO > MK levert extra productie winst op."));
children.push(sp(40));
children.push(formulaBox([
  "Stap 1: Bepaal de MO-functie (afgeleide van TO)",
  "Stap 2: Bepaal de MK-functie (afgeleide van TK)",
  "Stap 3: Stel MO = MK en los op naar Q",
  "Stap 4: Lees de prijs af op de vraaglijn (niet op MO!)",
  "Stap 5: Winst = TO \u2013 TK",
], DOMAINS.bedrijf.color));
children.push(sp(60));

children.push(h2d("Voorbeeld", DOMAINS.bedrijf.color));
children.push(p("Gegeven: P = 80 \u2013 2Q (vraaglijn) en TK = Q\u00B2 + 20Q + 100"));
children.push(sp(40));
children.push(formulaBox([
  "TO = P \u00D7 Q = (80 \u2013 2Q) \u00D7 Q = 80Q \u2013 2Q\u00B2",
  "MO = 80 \u2013 4Q",
  "MK = 2Q + 20",
  "MO = MK \u2192 80 \u2013 4Q = 2Q + 20 \u2192 Q* = 10",
  "P* = 80 \u2013 2(10) = 60",
  "Winst = TO \u2013 TK = 600 \u2013 300 = 300",
], DOMAINS.bedrijf.color));
children.push(sp(60));

children.push(warningBox("MO \u2260 gemiddelde opbrengst. MO is de EXTRA opbrengst van de laatst verkochte eenheid. Bij monopolie daalt MO twee keer zo snel als de vraaglijn."));
children.push(sp(60));

children.push(tipBox("De prijs lees je altijd af op de vraaglijn, nooit op de MO-lijn. De MO-lijn geeft alleen de optimale hoeveelheid.", DOMAINS.bedrijf.color, DOMAINS.bedrijf.light));
children.push(sp(60));

children.push(checkBox("Kun je bij een gegeven vraag- en kostenfunctie de winstmaximaliserende prijs, hoeveelheid en winst berekenen?"));
children.push(sp(60));

children.push(summarySchema([
  ["Regel", "Produceer tot MO = MK"],
  ["MO", "Afgeleide van TO (extra opbrengst per eenheid)"],
  ["MK", "Afgeleide van TK (extra kosten per eenheid)"],
  ["Prijs", "Aflezen op vraaglijn bij Q*, niet op MO-lijn"],
  ["Verband met", "\u2192 Vaardigheid 1 (evenwicht) en 4 (welvaartsverlies)"],
], DOMAINS.bedrijf.color));

// ════════════════════════════════════════════════════
// SKILL 3 — Surplus berekenen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("markt", 3, "Surplus berekenen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.markt.color));
children.push(p("Surplus meet de welvaart op een markt. Consumentensurplus (CS) is het voordeel voor kopers, producentensurplus (PS) is het voordeel voor verkopers. Samen vormen ze het totale surplus."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.markt.color));
children.push(p("Bij lineaire vraag- en aanbodlijnen zijn CS en PS driehoeken. Je berekent ze met de driehoeksformule."));
children.push(sp(40));
children.push(formulaBox([
  "CS = \u00BD \u00D7 basis \u00D7 hoogte",
  "    = \u00BD \u00D7 Q* \u00D7 (Pmax \u2013 P*)",
  "",
  "PS = \u00BD \u00D7 basis \u00D7 hoogte",
  "    = \u00BD \u00D7 Q* \u00D7 (P* \u2013 Pmin)",
  "",
  "Totaal surplus = CS + PS",
], DOMAINS.markt.color));
children.push(sp(60));

children.push(h2d("Voorbeeld", DOMAINS.markt.color));
children.push(p("Met P* = 24 en Q* = 52 (uit vaardigheid 1). Pmax = 50 (snijpunt vraaglijn met P-as), Pmin = 6,67 (snijpunt aanbodlijn met P-as)."));
children.push(sp(40));
children.push(formulaBox([
  "CS = \u00BD \u00D7 52 \u00D7 (50 \u2013 24) = \u00BD \u00D7 52 \u00D7 26 = 676",
  "PS = \u00BD \u00D7 52 \u00D7 (24 \u2013 6,67) = \u00BD \u00D7 52 \u00D7 17,33 = 450,58",
  "Totaal surplus = 676 + 450,58 = 1.126,58",
], DOMAINS.markt.color));
children.push(sp(60));

children.push(tipBox("Teken altijd een grafiek bij surplusberekeningen. Dan zie je direct welke driehoek je moet berekenen.", DOMAINS.markt.color, DOMAINS.markt.light));
children.push(sp(60));

children.push(checkBox("Kun je CS, PS en het totale surplus berekenen bij een lineair vraag-aanbodmodel?"));
children.push(sp(60));

children.push(summarySchema([
  ["CS", "Driehoek boven P* en onder de vraaglijn"],
  ["PS", "Driehoek onder P* en boven de aanbodlijn"],
  ["Formule", "\u00BD \u00D7 basis \u00D7 hoogte (driehoeksformule)"],
  ["Totaal surplus", "CS + PS = maximaal bij marktevenwicht"],
  ["Verband met", "\u2192 Vaardigheid 1 (evenwicht) en 4 (welvaartsverlies)"],
], DOMAINS.markt.color));

// ════════════════════════════════════════════════════
// SKILL 4 — Welvaartsverlies bepalen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("markt", 4, "Welvaartsverlies bepalen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.markt.color));
children.push(p("Wanneer een markt niet in het vrije-marktevenwicht is, gaat er welvaart verloren. Dit welvaartsverlies (deadweight loss) is het surplus dat verdwijnt door marktmacht, belasting of regelgeving."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.markt.color));
children.push(p("Het welvaartsverlies is het verschil tussen het totale surplus bij vrije markt en het totale surplus in de werkelijke situatie."));
children.push(sp(40));
children.push(formulaBox([
  "Welvaartsverlies = Totaal surplus (vrije markt) \u2013 Totaal surplus (werkelijk)",
  "",
  "Bij een driehoek: WV = \u00BD \u00D7 (Q_vrij \u2013 Q_werkelijk) \u00D7 (P_hoog \u2013 P_laag)",
], DOMAINS.markt.color));
children.push(sp(60));

children.push(h2d("Wanneer treedt welvaartsverlies op?", DOMAINS.markt.color));
children.push(bullet("Monopolie: het bedrijf produceert minder dan het evenwicht \u2192 driehoek tussen MO=MK en de vraaglijn."));
children.push(bullet("Belasting: wig tussen vraag- en aanbodprijs \u2192 driehoek links van het oude evenwicht."));
children.push(bullet("Minimumprijs: overschot op de markt \u2192 driehoek rechts van de gevraagde hoeveelheid."));
children.push(sp(60));

children.push(tipBox("Het welvaartsverlies is altijd een driehoek. Zoek de drie hoekpunten in je grafiek en bereken de oppervlakte.", DOMAINS.markt.color, DOMAINS.markt.light));
children.push(sp(60));

children.push(checkBox("Kun je het welvaartsverlies berekenen bij monopolie, belasting en minimumprijs?"));
children.push(sp(60));

children.push(summarySchema([
  ["Definitie", "Surplus dat verloren gaat door afwijking van het vrije-marktevenwicht"],
  ["Vorm", "Altijd een driehoek in de grafiek"],
  ["Oorzaken", "Marktmacht, belasting, subsidie, prijsregulering"],
  ["Berekening", "\u00BD \u00D7 basis \u00D7 hoogte van de verloren driehoek"],
  ["Verband met", "\u2192 Vaardigheid 3 (surplus) en 5 (belasting)"],
], DOMAINS.markt.color));

// ════════════════════════════════════════════════════
// SKILL 5 — Effecten van belasting en subsidie
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("overheid", 5, "Effecten van belasting en subsidie"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.overheid.color));
children.push(p("De overheid gebruikt belastingen en subsidies om markten te sturen. Een accijns verhoogt de prijs, een subsidie verlaagt die. In beide gevallen verandert het evenwicht \u00e9n het surplus."));
children.push(sp(60));

children.push(h2d("Hoe werkt het bij een belasting?", DOMAINS.overheid.color));
children.push(p("Een belasting per eenheid (accijns) verschuift de aanbodlijn omhoog met het belastingbedrag."));
children.push(sp(40));
children.push(formulaBox([
  "Nieuwe aanbodlijn: Qa_nieuw = Qa_oud(P \u2013 t)",
  "Of in prijsvorm: Pa_nieuw = Pa_oud + t",
  "",
  "Consument betaalt: Pc (hogere prijs)",
  "Producent ontvangt: Pp = Pc \u2013 t (lagere prijs)",
  "Belastingopbrengst = t \u00D7 Q_nieuw",
], DOMAINS.overheid.color));
children.push(sp(60));

children.push(h2d("Hoe werkt het bij een subsidie?", DOMAINS.overheid.color));
children.push(p("Een subsidie per eenheid verschuift de aanbodlijn omlaag met het subsidiebedrag. Het effect is precies omgekeerd aan een belasting."));
children.push(sp(40));
children.push(formulaBox([
  "Nieuwe aanbodlijn: Pa_nieuw = Pa_oud \u2013 s",
  "Consument betaalt: Pc (lagere prijs)",
  "Producent ontvangt: Pp = Pc + s (hogere prijs)",
  "Subsidiekosten = s \u00D7 Q_nieuw",
], DOMAINS.overheid.color));
children.push(sp(60));

children.push(warningBox("De belasting wordt gedeeld door consument en producent. Wie het meeste betaalt hangt af van de prijselasticiteit: de minst elastische partij draagt het meeste."));
children.push(sp(60));

children.push(checkBox("Kun je het nieuwe evenwicht, de belastingopbrengst en het welvaartsverlies berekenen na invoering van een belasting?"));
children.push(sp(60));

children.push(summarySchema([
  ["Belasting", "Aanbodlijn omhoog \u2192 hogere prijs, lagere hoeveelheid"],
  ["Subsidie", "Aanbodlijn omlaag \u2192 lagere prijs, hogere hoeveelheid"],
  ["Verdeling", "Minst elastische partij draagt het meeste"],
  ["Welvaartsverlies", "Altijd aanwezig bij belasting (driehoek)"],
  ["Verband met", "\u2192 Vaardigheid 1 (evenwicht), 3 (surplus), 4 (welvaartsverlies)"],
], DOMAINS.overheid.color));

// ════════════════════════════════════════════════════
// SKILL 6 — Comparatief voordeel
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("overheid", 6, "Comparatief voordeel bepalen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.overheid.color));
children.push(p("Internationale handel is gebaseerd op comparatief voordeel. Zelfs als een land in alles slechter is dan een ander land, loont specialisatie als de relatieve kosten verschillen."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.overheid.color));
children.push(p("Comparatief voordeel gaat over alternatieve kosten: wat moet je opgeven om \u00e9\u00e9n eenheid extra te produceren?"));
children.push(sp(40));
children.push(formulaBox([
  "Stap 1: Bereken de alternatieve kosten voor elk product in elk land",
  "Stap 2: Vergelijk de alternatieve kosten tussen landen",
  "Stap 3: Elk land specialiseert in het product met de LAAGSTE",
  "         alternatieve kosten",
], DOMAINS.overheid.color));
children.push(sp(60));

children.push(h2d("Voorbeeld", DOMAINS.overheid.color));
children.push(p("Nederland kan 100 kaas of 50 wijn produceren. Frankrijk kan 60 kaas of 80 wijn produceren."));
children.push(sp(40));
children.push(formulaBox([
  "Nederland: 1 kaas kost 50/100 = 0,5 wijn",
  "           1 wijn kost 100/50 = 2 kaas",
  "",
  "Frankrijk: 1 kaas kost 80/60 = 1,33 wijn",
  "           1 wijn kost 60/80 = 0,75 kaas",
  "",
  "Nederland: comparatief voordeel in kaas (0,5 < 1,33)",
  "Frankrijk: comparatief voordeel in wijn (0,75 < 2)",
], DOMAINS.overheid.color));
children.push(sp(60));

children.push(tipBox("Comparatief voordeel \u2260 absoluut voordeel. Een land kan in alles slechter zijn en toch comparatief voordeel hebben in \u00e9\u00e9n product.", DOMAINS.overheid.color, DOMAINS.overheid.light));
children.push(sp(60));

children.push(checkBox("Kun je bij een tabel met productiemogelijkheden bepalen welk land zich in welk product moet specialiseren?"));
children.push(sp(60));

children.push(summarySchema([
  ["Definitie", "Laagste alternatieve kosten voor een product"],
  ["Methode", "Alternatieve kosten berekenen en vergelijken"],
  ["Sleutelregel", "Specialiseer in product met laagste alternatieve kosten"],
  ["Let op", "Comparatief \u2260 absoluut voordeel"],
  ["Verband met", "\u2192 Vaardigheid 7 (ruilvoet)"],
], DOMAINS.overheid.color));

// ════════════════════════════════════════════════════
// SKILL 7 — Ruilvoet berekenen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("overheid", 7, "Ruilvoet berekenen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.overheid.color));
children.push(p("De ruilvoet bepaalt de grenzen van internationale handel. Beide landen moeten er beter van worden, anders is er geen prikkel om te ruilen."));
children.push(sp(60));

children.push(h2d("Hoe werkt het?", DOMAINS.overheid.color));
children.push(p("De ruilvoet ligt altijd tussen de alternatieve kosten van de twee landen. Binnen die grenzen profiteren beide landen."));
children.push(sp(40));
children.push(formulaBox([
  "Ruilvoet voor product X: tussen AK_land1 en AK_land2",
  "",
  "Voorbeeld met kaas en wijn:",
  "AK kaas Nederland = 0,5 wijn",
  "AK kaas Frankrijk = 1,33 wijn",
  "Ruilvoet: 1 kaas wordt geruild voor 0,5 tot 1,33 wijn",
], DOMAINS.overheid.color));
children.push(sp(60));

children.push(h2d("Voorbeeld", DOMAINS.overheid.color));
children.push(p("Bij een ruilvoet van 1 kaas = 0,8 wijn:"));
children.push(bullet("Nederland levert kaas (kost 0,5 wijn) en krijgt 0,8 wijn \u2192 winst van 0,3 wijn per kaas"));
children.push(bullet("Frankrijk krijgt kaas (kost zelf 1,33 wijn) voor 0,8 wijn \u2192 besparing van 0,53 wijn per kaas"));
children.push(sp(60));

children.push(tipBox("Controleer altijd: ligt de ruilvoet tussen de twee alternatieve kosten? Zo niet, dan wil \u00e9\u00e9n van de twee landen niet ruilen.", DOMAINS.overheid.color, DOMAINS.overheid.light));
children.push(sp(60));

children.push(checkBox("Kun je de grenzen van de ruilvoet bepalen en controleren of een gegeven ruilvoet voor beide landen voordelig is?"));
children.push(sp(60));

children.push(summarySchema([
  ["Ruilvoet", "Hoeveel van product Y je krijgt voor 1 eenheid product X"],
  ["Grenzen", "Tussen de alternatieve kosten van beide landen"],
  ["Voorwaarde", "Beide landen moeten beter af zijn dan zonder handel"],
  ["Controle", "Ruilvoet moet tussen AK_land1 en AK_land2 liggen"],
  ["Verband met", "\u2192 Vaardigheid 6 (comparatief voordeel)"],
], DOMAINS.overheid.color));

// ════════════════════════════════════════════════════
// VALKUILEN (Pitfalls)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 200 },
  children: [new TextRun({ text: "Veelvoorkomende valkuilen", bold: true, font: "Arial", size: 36, color: C.navy })],
}));
children.push(p("Let op deze veelgemaakte fouten bij het herhalen van de module:"));
children.push(sp(100));

children.push(warningBox("\"MO = MK geeft de prijs\" \u2192 Onjuist! MO = MK geeft de hoeveelheid. De prijs lees je af op de vraaglijn bij die hoeveelheid."));
children.push(sp(80));
children.push(warningBox("\"CS = prijs \u00D7 hoeveelheid\" \u2192 Onjuist! CS is een driehoek, niet een rechthoek. Gebruik de driehoeksformule: \u00BD \u00D7 basis \u00D7 hoogte."));
children.push(sp(80));
children.push(warningBox("\"Comparatief voordeel = het meeste produceren\" \u2192 Onjuist! Dat is absoluut voordeel. Comparatief voordeel gaat over de laagste alternatieve kosten."));
children.push(sp(80));
children.push(warningBox("\"Bij een belasting draagt de consument alles\" \u2192 Onjuist! De belasting wordt verdeeld op basis van prijselasticiteit. De minst elastische partij draagt het meeste."));
children.push(sp(80));
children.push(warningBox("\"Welvaartsverlies = belastingopbrengst\" \u2192 Onjuist! Belastingopbrengst is een herverdeling (rechthoek). Welvaartsverlies is de driehoek die voor niemand beschikbaar is."));

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

children.push(checklistItem("Marktevenwicht berekenen door Qv = Qa op te lossen"));
children.push(checklistItem("Winstmaximalisatie via MO = MK: optimale Q, prijs en winst bepalen"));
children.push(checklistItem("Consumentensurplus en producentensurplus berekenen als driehoeken"));
children.push(checklistItem("Welvaartsverlies herkennen en berekenen bij monopolie, belasting en minimumprijs"));
children.push(checklistItem("Effect van belasting en subsidie op evenwichtsprijs en -hoeveelheid doorrekenen"));
children.push(checklistItem("Comparatief voordeel bepalen via alternatieve kosten"));
children.push(checklistItem("Ruilvoetgrenzen berekenen en controleren of handel voordelig is"));

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
      headers: { default: makeHeader("Afsluiting \u2014 Vaardigheden") },
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
