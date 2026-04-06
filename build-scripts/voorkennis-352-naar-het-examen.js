/**
 * Uitleg Voorkennis — 3.5.2 Naar het examen
 *
 * EXAM PREP paragraph: covers exam-specific skills, formulas,
 * graph skills, common mistakes, and question-type recognition.
 *
 * Run: NODE_PATH="$(npm root -g)" node voorkennis-352-naar-het-examen.js
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

const OUT_DIR = `C:\\Projects\\4veco\\3. Module 3 - Markt en overheid\\3.5 Hoofdstuk 5 - Afsluiting\\3.5.2 Paragraaf 2 - Naar het examen\\1. Voorbereiden`;
const OUT_FILE = path.join(OUT_DIR, "3.5.2 Naar het examen \u2013 uitleg voorkennis.docx");

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

// ─── Domain Banner ───
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

// ─── Domain legend ───
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
// CHAPTER DATA — Examenvaardigheden
// ════════════════════════════════════════════════════
const chapters = [
  { nr: "1", title: "Formules die je moet kennen", desc: "MO=MK, evenwicht, surplus, elasticiteit, ruilvoet", domain: "wiskunde" },
  { nr: "2", title: "Grafiekvaardigheden", desc: "V/A-diagram lezen, tekenen, surplus arceren, verschuivingen", domain: "grafisch" },
  { nr: "3", title: "Redeneervaardigheden", desc: "Oorzaak-gevolg, marktvorm herkennen, beleidsinstrumenten", domain: "economisch" },
  { nr: "4", title: "Vraagtypen herkennen", desc: "Bereken, leg uit, verklaar, toon aan \u2014 wat wordt er verwacht?", domain: "economisch" },
  { nr: "5", title: "Veelgemaakte fouten", desc: "De meest voorkomende valkuilen op het examen", domain: "economisch" },
];

// ════════════════════════════════════════════════════
// BUILD SECTION CHILDREN
// ════════════════════════════════════════════════════
const children = [];

// ── Title + TOC (single page) ──
children.push(...titleBlock(
  "Naar het examen \u2014 Voorkennis",
  "Welke vaardigheden heb je nodig om het examen goed te maken?"
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
// SECTION 1 — Formules die je moet kennen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("wiskunde", 1, "Formules die je moet kennen"));
children.push(sp(120));

children.push(h2d("Marktevenwicht", VK_DOMAINS.wiskunde.color));
children.push(p("Het marktevenwicht vind je door de vraaglijn gelijk te stellen aan de aanbodlijn. Bij het evenwicht is er geen tekort en geen overschot."));
children.push(formulaBox([
  "Evenwicht: Qv = Qa",
  "",
  "Voorbeeld:",
  "Qv = \u2212\u00bd p + 100    Qa = 2p \u2212 20",
  "\u2212\u00bd p + 100 = 2p \u2212 20",
  "120 = 2\u00bd p   \u2192   p* = 48",
  "Q* = \u2212\u00bd(48) + 100 = 76",
], VK_DOMAINS.wiskunde.color));
children.push(sp(60));

children.push(h2d("Winstmaximalisatie", VK_DOMAINS.wiskunde.color));
children.push(p("Elk bedrijf maximaliseert winst bij de hoeveelheid waar MO = MK. De winst bereken je daarna met TO \u2212 TK."));
children.push(formulaBox([
  "Winstmaximalisatie: MO = MK",
  "Totale winst: W = TO \u2212 TK = (p \u2212 GTK) \u00d7 Q",
  "",
  "MO = \u0394TO / \u0394Q",
  "MK = \u0394TK / \u0394Q",
], VK_DOMAINS.wiskunde.color));
children.push(sp(60));

children.push(h2d("Surplus berekenen", VK_DOMAINS.wiskunde.color));
children.push(p("Consumentensurplus en producentensurplus bereken je als driehoeken in het V/A-diagram:"));
children.push(formulaBox([
  "CS = \u00bd \u00d7 Q* \u00d7 (Pmax \u2212 P*)",
  "PS = \u00bd \u00d7 Q* \u00d7 (P* \u2212 Pmin)",
  "Totaal surplus = CS + PS",
], VK_DOMAINS.wiskunde.color));
children.push(sp(60));

children.push(h2d("Elasticiteit", VK_DOMAINS.wiskunde.color));
children.push(p("De prijselasticiteit van de vraag geeft aan hoe sterk de gevraagde hoeveelheid reageert op een prijsverandering:"));
children.push(formulaBox([
  "Ev = (%\u0394Qv) / (%\u0394p)",
  "",
  "|Ev| > 1  \u2192  elastische vraag (sterke reactie)",
  "|Ev| < 1  \u2192  inelastische vraag (zwakke reactie)",
  "|Ev| = 1  \u2192  unitair elastisch",
], VK_DOMAINS.wiskunde.color));
children.push(sp(60));

children.push(h2d("Ruilvoet", VK_DOMAINS.wiskunde.color));
children.push(p("De ruilvoet geeft de verhouding tussen export- en importprijzen weer:"));
children.push(formulaBox([
  "Ruilvoet = (exportprijsindex / importprijsindex) \u00d7 100",
  "",
  "Ruilvoet stijgt \u2192 gunstig (meer import per export)",
  "Ruilvoet daalt  \u2192 ongunstig",
], VK_DOMAINS.wiskunde.color));
children.push(sp(60));

children.push(checkBox("Kun je al deze formules uit je hoofd opschrijven en toepassen met getallen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Qv = Qa", "Marktevenwicht \u2014 vraaglijn = aanbodlijn"],
  ["MO = MK", "Winstmaximalisatie \u2014 extra opbrengst = extra kosten"],
  ["CS / PS", "Surplus \u2014 driehoek in V/A-diagram"],
  ["Ev", "Prijselasticiteit van de vraag: %\u0394Q / %\u0394p"],
  ["Ruilvoet", "Exportprijsindex / importprijsindex \u00d7 100"],
], VK_DOMAINS.wiskunde.color));

// ════════════════════════════════════════════════════
// SECTION 2 — Grafiekvaardigheden
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("grafisch", 2, "Grafiekvaardigheden"));
children.push(sp(120));

children.push(h2d("V/A-diagram lezen", VK_DOMAINS.grafisch.color));
children.push(p("In een vraag-en-aanboddiagram staat de prijs (p) op de verticale as en de hoeveelheid (Q) op de horizontale as. De vraaglijn loopt dalend (hoe hoger de prijs, hoe minder vraag), de aanbodlijn loopt stijgend."));
children.push(bullet("Evenwicht: snijpunt van vraag- en aanbodlijn"));
children.push(bullet("Tekort: bij een prijs onder het evenwicht (Qv > Qa)"));
children.push(bullet("Overschot: bij een prijs boven het evenwicht (Qa > Qv)"));
children.push(sp(60));

children.push(h2d("Verschuivingen herkennen", VK_DOMAINS.grafisch.color));
children.push(p("Het is cruciaal om het verschil te kennen tussen een verschuiving langs de lijn en een verschuiving van de lijn:"));
children.push(bullet("Langs de lijn: prijsverandering \u2192 beweging over de bestaande curve"));
children.push(bullet("Van de lijn: verandering in een andere factor \u2192 hele curve schuift"));
children.push(tipBox("Vraag: inkomen, voorkeuren, prijs substituten/complementen. Aanbod: kosten, technologie, belasting."));
children.push(sp(60));

children.push(h2d("Surplus arceren", VK_DOMAINS.grafisch.color));
children.push(p("Op het examen moet je surplus kunnen arceren. Gebruik de volgende vuistregels:"));
children.push(bullet("CS: driehoek boven evenwichtsprijs, onder vraaglijn, links van Q*"));
children.push(bullet("PS: driehoek onder evenwichtsprijs, boven aanbodlijn, links van Q*"));
children.push(bullet("Welvaartsverlies: driehoek tussen vraag- en aanbodlijn, rechts van de verhandelde hoeveelheid"));
children.push(warningBox("Arceer altijd tot aan de verhandelde hoeveelheid, NIET tot aan het oude evenwicht."));
children.push(sp(60));

children.push(h2d("Belasting/subsidie in een diagram", VK_DOMAINS.grafisch.color));
children.push(p("Bij een belasting verschuift de aanbodlijn omhoog (producenten rekenen de belasting door). Bij een subsidie verschuift de aanbodlijn omlaag. De afstand tussen oude en nieuwe aanbodlijn is precies het belasting- of subsidiebedrag."));
children.push(sp(60));

children.push(checkBox("Kun je in een V/A-diagram het evenwicht vinden, surplus arceren en verschuivingen tekenen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Vraaglijn", "Dalend verloop \u2014 hogere prijs = minder vraag"],
  ["Aanbodlijn", "Stijgend verloop \u2014 hogere prijs = meer aanbod"],
  ["Langs vs. van", "Prijsverandering = langs; andere factoren = hele lijn verschuift"],
  ["CS arceren", "Boven prijs, onder vraaglijn, links van Q*"],
  ["PS arceren", "Onder prijs, boven aanbodlijn, links van Q*"],
], VK_DOMAINS.grafisch.color));

// ════════════════════════════════════════════════════
// SECTION 3 — Redeneervaardigheden
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 3, "Redeneervaardigheden"));
children.push(sp(120));

children.push(h2d("Oorzaak-gevolgketens", VK_DOMAINS.economisch.color));
children.push(p("Op het examen moet je economische redeneringen stap voor stap opbouwen. Gebruik altijd een logische keten: oorzaak \u2192 gevolg \u2192 conclusie. Sla geen stappen over."));
children.push(formulaBox([
  "Stap 1: Benoem de verandering (bijv. 'de grondstofprijs stijgt')",
  "Stap 2: Verklaar het directe gevolg (bijv. 'de productiekosten stijgen')",
  "Stap 3: Koppel aan het economisch model (bijv. 'aanbodlijn verschuift links')",
  "Stap 4: Trek de conclusie (bijv. 'de evenwichtsprijs stijgt')",
], VK_DOMAINS.economisch.color));
children.push(sp(60));

children.push(h2d("Marktvorm herkennen", VK_DOMAINS.economisch.color));
children.push(p("Lees de context zorgvuldig en let op de signaalwoorden:"));
children.push(bullet("\"Veel kleine aanbieders, identiek product\" \u2192 volkomen concurrentie"));
children.push(bullet("\"Enkele grote spelers, onderlinge afhankelijkheid\" \u2192 oligopolie"));
children.push(bullet("\"Veel aanbieders, elk met een eigen merk\" \u2192 monopolistische concurrentie"));
children.push(bullet("\"E\u00e9n aanbieder, geen alternatieven\" \u2192 monopolie"));
children.push(tipBox("Let op het verschil tussen heterogeen oligopolie en monopolistische concurrentie: bij oligopolie is het marktaandeel van de grote spelers hoog."));
children.push(sp(60));

children.push(h2d("Beleidsinstrumenten koppelen", VK_DOMAINS.economisch.color));
children.push(p("Bij examenvragen over overheidsbeleid moet je het juiste instrument koppelen aan het probleem:"));
children.push(bullet("Negatief extern effect \u2192 Pigouviaanse heffing of regulering"));
children.push(bullet("Positief extern effect \u2192 subsidie"));
children.push(bullet("Monopoliemacht \u2192 mededingingsautoriteit (ACM), prijsregulering"));
children.push(bullet("Ongelijkheid \u2192 minimumprijs (bijv. minimumloon), inkomensbeleid"));
children.push(sp(60));

children.push(checkBox("Kun je een economische redenering in stappen opbouwen en de juiste marktvorm en het juiste beleidsinstrument herkennen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Oorzaak-gevolg", "Bouw redeneringen stap voor stap op, sla niets over"],
  ["Marktvorm herkennen", "Let op: aantal aanbieders, producttype, toetredingsdrempels"],
  ["Beleidsinstrument", "Koppel het probleem aan het juiste overheidsinstrument"],
], VK_DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// SECTION 4 — Vraagtypen herkennen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 4, "Vraagtypen herkennen"));
children.push(sp(120));

children.push(h2d("Bereken", VK_DOMAINS.economisch.color));
children.push(p("Bij \"bereken\" moet je een getal uitrekenen. Laat altijd je berekening zien, ook als je het antwoord uit je hoofd weet. Rond af zoals gevraagd (of op twee decimalen als er niets staat)."));
children.push(formulaBox([
  "Bereken de evenwichtsprijs.",
  "\u2192 Stel Qv = Qa, los op, noteer p* EN Q*",
], VK_DOMAINS.economisch.color));
children.push(sp(60));

children.push(h2d("Leg uit / Verklaar", VK_DOMAINS.economisch.color));
children.push(p("Bij \"leg uit\" of \"verklaar\" moet je een redenering geven. Gebruik economische begrippen en bouw je antwoord op in logische stappen."));
children.push(formulaBox([
  "Verklaar waarom de prijs stijgt.",
  "\u2192 Oorzaak noemen + gevolg + koppeling aan model",
  "\u2192 Voorbeeld: 'Door hogere grondstofprijzen stijgen de",
  "   productiekosten. Hierdoor verschuift de aanbodlijn",
  "   naar links. Bij gelijkblijvende vraag stijgt de",
  "   evenwichtsprijs.'",
], VK_DOMAINS.economisch.color));
children.push(sp(60));

children.push(h2d("Toon aan", VK_DOMAINS.economisch.color));
children.push(p("Bij \"toon aan\" weet je al wat het antwoord is \u2014 je moet bewijzen dat het klopt. Gebruik berekeningen of logische stappen die leiden tot het gegeven antwoord."));
children.push(formulaBox([
  "Toon aan dat de evenwichtsprijs 48 euro is.",
  "\u2192 Stel Qv = Qa, reken uit, laat zien dat p* = 48",
], VK_DOMAINS.economisch.color));
children.push(sp(60));

children.push(h2d("Geef twee argumenten / Noem een voor- en nadeel", VK_DOMAINS.economisch.color));
children.push(p("Bij dit type vraag moet je het gevraagde aantal argumenten geven. Elk argument is een aparte redenering. Herhaal niet hetzelfde punt in andere woorden."));
children.push(warningBox("\"De prijs stijgt\" en \"het wordt duurder\" zijn hetzelfde argument. Geef echt verschillende redeneringen!"));
children.push(sp(60));

children.push(checkBox("Kun je bij elk vraagtype het juiste antwoordformat gebruiken?"));
children.push(sp(60));
children.push(summarySchema([
  ["Bereken", "Getal uitrekenen, berekening laten zien, afronden"],
  ["Leg uit / Verklaar", "Redenering in stappen, met economische begrippen"],
  ["Toon aan", "Bewijs dat een gegeven antwoord klopt"],
  ["Argumenten geven", "Verschillende redeneringen, niet hetzelfde in andere woorden"],
], VK_DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// SECTION 5 — Veelgemaakte fouten
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 5, "Veelgemaakte fouten"));
children.push(sp(120));

children.push(h2d("Top 10 examenvalkuilen", VK_DOMAINS.economisch.color));
children.push(p("Dit zijn de meest voorkomende fouten die leerlingen maken op het economie-examen. Ken ze, herken ze, en vermijd ze."));
children.push(sp(60));

children.push(warningBox("MO is NIET de gemiddelde opbrengst. MO = extra opbrengst van \u00e9\u00e9n extra eenheid."));
children.push(sp(60));
children.push(warningBox("Bij monopolie: lees de prijs af op de VRAAGLIJN bij Q*, niet bij het snijpunt MO = MK."));
children.push(sp(60));
children.push(warningBox("Comparatief voordeel gaat over ALTERNATIEVE kosten, niet over absolute kosten."));
children.push(sp(60));
children.push(warningBox("Een maximumprijs ligt ONDER de evenwichtsprijs. Een minimumprijs ligt BOVEN de evenwichtsprijs."));
children.push(sp(60));
children.push(warningBox("Bij \"verklaar\" moet je een redenering geven, niet alleen het gevolg noemen. Noem ook de oorzaak en het mechanisme."));
children.push(sp(60));
children.push(warningBox("Welvaartsverlies arceer je tussen de vraag- en aanbodlijn bij de hoeveelheid die NIET meer verhandeld wordt."));
children.push(sp(60));
children.push(warningBox("Heterogeen oligopolie is NIET hetzelfde als monopolistische concurrentie. Bij oligopolie domineren enkele grote spelers."));
children.push(sp(60));
children.push(warningBox("Bij elasticiteit: gebruik PROCENTUELE veranderingen, niet absolute. Ev = %\u0394Q / %\u0394p."));
children.push(sp(60));
children.push(warningBox("De ruilvoet vergelijk je met 100 (basisjaar), niet met een ander land. Ruilvoet > 100 = verbetering t.o.v. het basisjaar."));
children.push(sp(60));
children.push(warningBox("Bij twee argumenten: geef ECHT twee verschillende redeneringen. Dezelfde redenering in andere woorden telt als \u00e9\u00e9n."));
children.push(sp(60));

children.push(checkBox("Herken je deze valkuilen? Ga ze na bij je oefenexamens."));

// ════════════════════════════════════════════════════
// CHECKLIST PAGE
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 200 },
  children: [new TextRun({ text: "Checklist examenvoorbereiding", bold: true, font: "Arial", size: 36, color: C.navy })],
}));
children.push(p("Controleer of je de volgende vaardigheden beheerst voordat je aan het examen begint:"));
children.push(sp(100));

children.push(new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 160, after: 80 },
  children: [new TextRun({ text: "Formules", bold: true, font: "Arial", size: 24, color: C.navy })],
}));
children.push(checklistItem("Ik kan het marktevenwicht berekenen (Qv = Qa)"));
children.push(checklistItem("Ik kan de winstmaximaliserende hoeveelheid vinden (MO = MK)"));
children.push(checklistItem("Ik kan totale winst berekenen (TO \u2212 TK)"));
children.push(checklistItem("Ik kan consumentensurplus en producentensurplus berekenen"));
children.push(checklistItem("Ik kan de prijselasticiteit van de vraag berekenen en interpreteren"));
children.push(checklistItem("Ik kan de ruilvoet berekenen en interpreteren"));
children.push(sp(60));

children.push(new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 160, after: 80 },
  children: [new TextRun({ text: "Grafieken", bold: true, font: "Arial", size: 24, color: C.navy })],
}));
children.push(checklistItem("Ik kan een V/A-diagram lezen en het evenwicht aflezen"));
children.push(checklistItem("Ik kan surplus arceren in een V/A-diagram"));
children.push(checklistItem("Ik kan verschuivingen tekenen (vraag/aanbod, belasting/subsidie)"));
children.push(checklistItem("Ik herken het verschil tussen verschuiving langs en van de lijn"));
children.push(sp(60));

children.push(new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 160, after: 80 },
  children: [new TextRun({ text: "Redeneren en vraagtypen", bold: true, font: "Arial", size: 24, color: C.navy })],
}));
children.push(checklistItem("Ik kan een oorzaak-gevolgketen opbouwen in stappen"));
children.push(checklistItem("Ik kan een marktvorm herkennen aan de hand van signaalwoorden"));
children.push(checklistItem("Ik weet welk antwoordformat bij welk vraagtype hoort"));
children.push(checklistItem("Ik kan het juiste beleidsinstrument koppelen aan een probleem"));
children.push(sp(60));

children.push(new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 160, after: 80 },
  children: [new TextRun({ text: "Valkuilen vermijden", bold: true, font: "Arial", size: 24, color: C.navy })],
}));
children.push(checklistItem("Ik ken het verschil tussen MO en gemiddelde opbrengst"));
children.push(checklistItem("Ik weet dat ik bij monopolie de prijs aflees op de vraaglijn"));
children.push(checklistItem("Ik weet dat comparatief voordeel over alternatieve kosten gaat"));
children.push(checklistItem("Ik weet dat een maximumprijs ONDER het evenwicht ligt"));
children.push(checklistItem("Ik gebruik procentuele veranderingen bij elasticiteit"));

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
      headers: { default: makeHeader("Naar het examen \u2014 Voorkennis") },
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
