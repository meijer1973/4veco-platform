/**
 * Vaardigheden 3.5.2 Naar het examen
 * Exam preparation — covers exam techniques and common pitfalls.
 *
 * Run: NODE_PATH="$(npm root -g)" node vaardigheden-352-naar-het-examen.js
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
const OUT_DIR = `C:\\Projects\\4veco\\3. Module 3 - Markt en overheid\\3.5 Hoofdstuk 5 - Afsluiting\\3.5.2 Paragraaf 2 - Naar het examen\\2. Leren`;
const OUT_FILE = path.join(OUT_DIR, "3.5.2 Naar het examen \u2013 uitleg vaardigheden.docx");

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

// ─── Domain system (exam-specific) ───
const DOMAINS = {
  strategie: { label: "Examenstrategie",  color: "1A5276", light: "EBF5FB", dark: "154360" },
  techniek:  { label: "Antwoordtechniek", color: "E67E22", light: "FEF5E7", dark: "BA6A1C" },
  valkuil:   { label: "Foutenpreventie",  color: "1E8449", light: "E8F8F0", dark: "186A3B" },
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
  { nr: "1", title: "CE-vraagtypen herkennen",          desc: "Bereken, verklaar, toon aan, grafiek", domain: "strategie" },
  { nr: "2", title: "\"Bereken\"-vragen aanpakken",     desc: "Stapsgewijze uitwerking met formules", domain: "techniek" },
  { nr: "3", title: "\"Verklaar\"-vragen aanpakken",    desc: "Oorzaak-gevolg structuur opbouwen", domain: "techniek" },
  { nr: "4", title: "\"Toon aan\"-vragen aanpakken",    desc: "Bewijsvoering met berekening", domain: "techniek" },
  { nr: "5", title: "Grafiekvragen beantwoorden",        desc: "Tekenen, aflezen en interpreteren", domain: "techniek" },
  { nr: "6", title: "Tijdmanagement op het examen",      desc: "Puntenverdeling en planning", domain: "strategie" },
  { nr: "7", title: "Veelgemaakte fouten vermijden",     desc: "Top-5 valkuilen en hoe je ze voorkomt", domain: "valkuil" },
];

// ════════════════════════════════════════════════════
// BUILD SECTION CHILDREN
// ════════════════════════════════════════════════════
const children = [];

// ── Title + TOC (single page) ──
children.push(...titleBlock(
  "Naar het examen \u2014 Vaardigheden",
  "Hoe pak je examenvragen effectief aan?"
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
// SKILL 1 — CE-vraagtypen herkennen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("strategie", 1, "CE-vraagtypen herkennen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.strategie.color));
children.push(p("Het centraal examen economie bevat vier hoofdtypen vragen. Elk type vraagt een andere aanpak. Als je het type herkent, weet je direct welke structuur je antwoord moet hebben."));
children.push(sp(60));

children.push(h2d("De vier vraagtypen", DOMAINS.strategie.color));
children.push(sp(40));
children.push(formulaBox([
  "\"Bereken ...\"       \u2192 Uitwerking met formules en tussenstappen",
  "\"Verklaar ...\"      \u2192 Oorzaak-gevolg redenering",
  "\"Toon aan dat ...\"  \u2192 Bewijs met berekening naar gegeven uitkomst",
  "Grafiekvraag         \u2192 Tekenen, arceren of aflezen in een diagram",
], DOMAINS.strategie.color));
children.push(sp(60));

children.push(h2d("Hoe herken je het type?", DOMAINS.strategie.color));
children.push(bullet("Kijk naar het werkwoord in de vraag: bereken, verklaar, toon aan, teken, lees af."));
children.push(bullet("Het werkwoord bepaalt de structuur van je antwoord."));
children.push(bullet("Bij meerkeuzevragen: elimineer eerst de onmogelijke opties."));
children.push(sp(60));

children.push(tipBox("Onderstreep het werkwoord in de vraag. Dat voorkomt dat je een berekening maakt terwijl er om een verklaring wordt gevraagd.", DOMAINS.strategie.color, DOMAINS.strategie.light));
children.push(sp(60));

children.push(checkBox("Kun je bij een examenvraag direct herkennen welk type het is en welke aanpak daarbij hoort?"));
children.push(sp(60));

children.push(summarySchema([
  ["Bereken", "Formule \u2192 invullen \u2192 tussenstappen \u2192 antwoord + eenheid"],
  ["Verklaar", "Oorzaak \u2192 mechanisme \u2192 gevolg (keten)"],
  ["Toon aan", "Gegeven uitkomst bewijzen met eigen berekening"],
  ["Grafiek", "Tekenen, arceren of aflezen met labels"],
  ["Verband met", "\u2192 Vaardigheden 2\u20135 (specifieke aanpak per type)"],
], DOMAINS.strategie.color));

// ════════════════════════════════════════════════════
// SKILL 2 — "Bereken"-vragen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("techniek", 2, "\"Bereken\"-vragen aanpakken"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.techniek.color));
children.push(p("Bereken-vragen leveren de meeste punten op het examen. Je krijgt alleen alle punten als je de tussenstappen laat zien \u00e9n het antwoord in de juiste eenheid geeft."));
children.push(sp(60));

children.push(h2d("Stappenplan", DOMAINS.techniek.color));
children.push(sp(40));
children.push(formulaBox([
  "Stap 1: Schrijf de formule op",
  "Stap 2: Vul de gegeven waarden in",
  "Stap 3: Werk stap voor stap uit (laat tussenstappen zien!)",
  "Stap 4: Schrijf het antwoord op met de juiste eenheid",
  "Stap 5: Controleer: is het antwoord logisch?",
], DOMAINS.techniek.color));
children.push(sp(60));

children.push(h2d("Voorbeeld", DOMAINS.techniek.color));
children.push(p("Vraag: Bereken de evenwichtsprijs. Gegeven: Qv = 200 \u2013 4P en Qa = \u201340 + 6P."));
children.push(sp(40));
children.push(formulaBox([
  "Qv = Qa                          [formule]",
  "200 \u2013 4P = \u201340 + 6P             [invullen]",
  "240 = 10P                        [uitwerken]",
  "P* = 24                          [antwoord]",
  "De evenwichtsprijs is \u20AC24.        [eenheid]",
], DOMAINS.techniek.color));
children.push(sp(60));

children.push(warningBox("Geen tussenstappen = geen punten. Zelfs als het eindantwoord klopt, krijg je puntenaftrek als de corrector je redenering niet kan volgen."));
children.push(sp(60));

children.push(tipBox("Schrijf elke stap op een nieuwe regel. Dan kan de corrector per stap punten geven, ook als je een rekenfout maakt.", DOMAINS.techniek.color, DOMAINS.techniek.light));
children.push(sp(60));

children.push(checkBox("Kun je een bereken-vraag beantwoorden met formule, tussenstappen, antwoord en eenheid?"));
children.push(sp(60));

children.push(summarySchema([
  ["Structuur", "Formule \u2192 invullen \u2192 uitwerken \u2192 antwoord + eenheid"],
  ["Tussenstappen", "Altijd laten zien \u2014 ook bij eenvoudige berekeningen"],
  ["Eenheid", "Schrijf altijd de eenheid bij het antwoord"],
  ["Controle", "Is het antwoord logisch? Klopt de orde van grootte?"],
  ["Verband met", "\u2192 Vaardigheid 1 (vraagtype herkenning)"],
], DOMAINS.techniek.color));

// ════════════════════════════════════════════════════
// SKILL 3 — "Verklaar"-vragen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("techniek", 3, "\"Verklaar\"-vragen aanpakken"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.techniek.color));
children.push(p("Bij verklaar-vragen moet je een logische keten opbouwen van oorzaak naar gevolg. Veel leerlingen geven alleen het begin\u00f3f het einde, maar missen de tussenschakels."));
children.push(sp(60));

children.push(h2d("Stappenplan", DOMAINS.techniek.color));
children.push(sp(40));
children.push(formulaBox([
  "Stap 1: Noem de oorzaak (wat verandert er?)",
  "Stap 2: Leg het mechanisme uit (waarom leidt dit tot...?)",
  "Stap 3: Noem het gevolg (wat is het effect?)",
  "Stap 4: Gebruik economische begrippen",
], DOMAINS.techniek.color));
children.push(sp(60));

children.push(h2d("Voorbeeld", DOMAINS.techniek.color));
children.push(p("Vraag: Verklaar waarom de prijs stijgt als het minimumloon omhoog gaat."));
children.push(sp(40));
children.push(formulaBox([
  "Oorzaak:   Het minimumloon stijgt",
  "Mechanisme: Bedrijven hebben hogere loonkosten",
  "           \u2192 De productiekosten (TK) stijgen",
  "           \u2192 De aanbodlijn verschuift naar links",
  "Gevolg:    De evenwichtsprijs stijgt",
], DOMAINS.techniek.color));
children.push(sp(60));

children.push(warningBox("\"De prijs stijgt omdat het minimumloon omhoog gaat\" is g\u00e9\u00e9n verklaring. Je mist het mechanisme: hoe leidt het minimumloon tot een hogere prijs?"));
children.push(sp(60));

children.push(tipBox("Gebruik signaalwoorden: \"doordat\", \"waardoor\", \"hierdoor\", \"als gevolg van\". Ze maken je redenering zichtbaar voor de corrector.", DOMAINS.techniek.color, DOMAINS.techniek.light));
children.push(sp(60));

children.push(checkBox("Kun je een volledige oorzaak-mechanisme-gevolg keten opschrijven met economische begrippen?"));
children.push(sp(60));

children.push(summarySchema([
  ["Structuur", "Oorzaak \u2192 mechanisme \u2192 gevolg"],
  ["Signaalwoorden", "Doordat, waardoor, hierdoor, als gevolg van"],
  ["Begrippen", "Gebruik altijd economische vaktermen"],
  ["Valkuil", "Alleen begin en einde noemen, mechanisme overslaan"],
  ["Verband met", "\u2192 Vaardigheid 1 (vraagtype) en 4 (toon aan)"],
], DOMAINS.techniek.color));

// ════════════════════════════════════════════════════
// SKILL 4 — "Toon aan"-vragen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("techniek", 4, "\"Toon aan\"-vragen aanpakken"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.techniek.color));
children.push(p("Bij \"toon aan\"-vragen krijg je de uitkomst al. Je moet bewijzen dat die uitkomst klopt. Het verschil met \"bereken\" is dat je nu naar een bekend antwoord toewerkt."));
children.push(sp(60));

children.push(h2d("Stappenplan", DOMAINS.techniek.color));
children.push(sp(40));
children.push(formulaBox([
  "Stap 1: Schrijf de formule op",
  "Stap 2: Vul de gegevens in",
  "Stap 3: Werk uit tot je bij de gegeven uitkomst komt",
  "Stap 4: Schrijf: \"Dit is gelijk aan [gegeven uitkomst]\"",
], DOMAINS.techniek.color));
children.push(sp(60));

children.push(h2d("Voorbeeld", DOMAINS.techniek.color));
children.push(p("Vraag: Toon aan dat het consumentensurplus 676 bedraagt. Gegeven: P* = 24, Q* = 52, Pmax = 50."));
children.push(sp(40));
children.push(formulaBox([
  "CS = \u00BD \u00D7 Q* \u00D7 (Pmax \u2013 P*)",
  "CS = \u00BD \u00D7 52 \u00D7 (50 \u2013 24)",
  "CS = \u00BD \u00D7 52 \u00D7 26",
  "CS = 676 \u2713",
], DOMAINS.techniek.color));
children.push(sp(60));

children.push(warningBox("Schrijf niet alleen \"CS = 676\". De corrector wil je volledige berekening zien, ook al is de uitkomst gegeven."));
children.push(sp(60));

children.push(tipBox("Het voordeel van toon-aan: je weet waar je naartoe moet. Als je een ander getal krijgt, weet je dat er een fout zit en kun je terugredeneren.", DOMAINS.techniek.color, DOMAINS.techniek.light));
children.push(sp(60));

children.push(checkBox("Kun je een toon-aan-vraag volledig uitwerken met formule, tussenstappen en afsluiting?"));
children.push(sp(60));

children.push(summarySchema([
  ["Doel", "Bewijs dat de gegeven uitkomst klopt"],
  ["Structuur", "Formule \u2192 invullen \u2192 uitwerken \u2192 \"dit is gelijk aan ...\""],
  ["Verschil", "Bij bereken ken je het antwoord niet; bij toon aan wel"],
  ["Voordeel", "Je kunt controleren: kom je niet uit op het getal, dan zit er een fout"],
  ["Verband met", "\u2192 Vaardigheid 2 (bereken) en 1 (vraagtype)"],
], DOMAINS.techniek.color));

// ════════════════════════════════════════════════════
// SKILL 5 — Grafiekvragen
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("techniek", 5, "Grafiekvragen beantwoorden"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.techniek.color));
children.push(p("Grafiekvragen komen op elk examen voor. Je moet grafieken kunnen tekenen, aflezen en interpreteren. Een mooie grafiek zonder labels levert geen punten op."));
children.push(sp(60));

children.push(h2d("Wat moet je laten zien?", DOMAINS.techniek.color));
children.push(sp(40));
children.push(formulaBox([
  "Bij TEKENEN:",
  "  \u2022 Labels op de assen (P, Q of specifieke grootheden)",
  "  \u2022 Naam bij elke lijn (Qv, Qa, MO, MK, etc.)",
  "  \u2022 Evenwichtspunt markeren met stippellijnen naar de assen",
  "  \u2022 Waarden bij de stippellijnen (P*, Q*)",
  "",
  "Bij ARCEREN:",
  "  \u2022 Benoem het gearceerde gebied (CS, PS, WV, etc.)",
  "  \u2022 Arceer duidelijk en netjes",
  "",
  "Bij VERSCHUIVING:",
  "  \u2022 Teken de oude \u00e9n de nieuwe lijn",
  "  \u2022 Geef de richting aan met een pijl",
  "  \u2022 Label: Qa1 \u2192 Qa2",
], DOMAINS.techniek.color));
children.push(sp(60));

children.push(warningBox("Een grafiek zonder aslabels of lijnlabels is waardeloos op het examen. De corrector kan niet raden wat je bedoelt."));
children.push(sp(60));

children.push(tipBox("Gebruik altijd een liniaal voor rechte lijnen. Een slordige grafiek suggereert dat je de stof niet beheerst.", DOMAINS.techniek.color, DOMAINS.techniek.light));
children.push(sp(60));

children.push(checkBox("Kun je een volledige grafiek tekenen met aslabels, lijnlabels, evenwichtspunt en waarden?"));
children.push(sp(60));

children.push(summarySchema([
  ["Tekenen", "Aslabels + lijnlabels + evenwichtspunt + waarden"],
  ["Arceren", "Benoemd gebied + nette arcering"],
  ["Verschuiving", "Oude + nieuwe lijn + pijl + labels"],
  ["Aflezen", "Stippellijnen naar assen + waarden opschrijven"],
  ["Verband met", "\u2192 Vaardigheid 1 (vraagtype) en 2\u20134 (combinatie)"],
], DOMAINS.techniek.color));

// ════════════════════════════════════════════════════
// SKILL 6 — Tijdmanagement
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("strategie", 6, "Tijdmanagement op het examen"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.strategie.color));
children.push(p("Het CE economie duurt 150 minuten. Veel leerlingen besteden te veel tijd aan moeilijke vragen en hebben te weinig tijd over voor de makkelijke. Een goede verdeling levert meer punten op."));
children.push(sp(60));

children.push(h2d("Vuistregels", DOMAINS.strategie.color));
children.push(sp(40));
children.push(formulaBox([
  "Totaal: ~90 punten in 150 minuten",
  "Vuistregel: 1,5 minuut per punt",
  "",
  "2-punts vraag: maximaal 3 minuten",
  "4-punts vraag: maximaal 6 minuten",
  "6-punts vraag: maximaal 9 minuten",
], DOMAINS.strategie.color));
children.push(sp(60));

children.push(h2d("Strategie", DOMAINS.strategie.color));
children.push(bullet("Ronde 1 (45 min): maak alle vragen die je direct kunt beantwoorden."));
children.push(bullet("Ronde 2 (45 min): pak de vragen aan waar je over na moet denken."));
children.push(bullet("Ronde 3 (30 min): werk de moeilijkste vragen uit."));
children.push(bullet("Ronde 4 (30 min): controleer je antwoorden en vul lege vragen in."));
children.push(sp(60));

children.push(tipBox("Laat nooit een vraag leeg! Bij meerkeuzevragen heb je altijd 25% kans. Bij open vragen kan een half antwoord toch een punt opleveren.", DOMAINS.strategie.color, DOMAINS.strategie.light));
children.push(sp(60));

children.push(checkBox("Heb je een tijdverdeling gemaakt en weet je hoeveel tijd je per vraag mag besteden?"));
children.push(sp(60));

children.push(summarySchema([
  ["Vuistregel", "1,5 minuut per punt"],
  ["Ronde 1", "Makkelijke vragen eerst (45 min)"],
  ["Ronde 2", "Gemiddelde vragen (45 min)"],
  ["Ronde 3", "Moeilijke vragen (30 min)"],
  ["Ronde 4", "Controleren + lege vragen invullen (30 min)"],
], DOMAINS.strategie.color));

// ════════════════════════════════════════════════════
// SKILL 7 — Veelgemaakte fouten
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("valkuil", 7, "Veelgemaakte fouten vermijden"));
children.push(sp(120));

children.push(h2d("Waarom is dit belangrijk?", DOMAINS.valkuil.color));
children.push(p("De meeste punten verlies je niet door gebrek aan kennis, maar door slordigheidsfoutjes en valkuilen. Als je de top-5 fouten kent, kun je ze bewust vermijden."));
children.push(sp(60));

children.push(h2d("Top-5 valkuilen op het examen", DOMAINS.valkuil.color));
children.push(sp(40));

children.push(warningBox("Fout 1: Eenheid vergeten. \"De prijs is 24\" in plaats van \"De prijs is \u20AC24.\" Kost bijna altijd een halve punt."));
children.push(sp(80));
children.push(warningBox("Fout 2: De vraag niet beantwoorden. Er wordt gevraagd om een verklaring, maar je geeft een berekening. Lees de vraag altijd twee keer."));
children.push(sp(80));
children.push(warningBox("Fout 3: Mechanisme overslaan bij verklaar-vragen. Je schrijft \"A, dus C\" maar vergeet B. De corrector kan je redenering niet volgen."));
children.push(sp(80));
children.push(warningBox("Fout 4: Grafiek zonder labels. Je tekent een perfect diagram maar vergeet aslabels, lijnbenamingen of waarden. Nul punten."));
children.push(sp(80));
children.push(warningBox("Fout 5: Afrondingsfouten. Je rondt te vroeg af in de berekening. Rond pas af in je eindantwoord, niet in tussenstappen."));
children.push(sp(60));

children.push(tipBox("Maak na het examen een foutendagboek. Noteer welke fouten je maakte en hoe je ze kunt voorkomen. Na drie oefenexamens ken je je eigen valkuilen.", DOMAINS.valkuil.color, DOMAINS.valkuil.light));
children.push(sp(60));

children.push(checkBox("Ken je je eigen top-3 fouten en heb je een strategie om ze te voorkomen?"));
children.push(sp(60));

children.push(summarySchema([
  ["Fout 1", "Eenheid vergeten bij antwoord"],
  ["Fout 2", "Vraag niet beantwoorden (verkeerd type)"],
  ["Fout 3", "Mechanisme overslaan bij verklaring"],
  ["Fout 4", "Grafiek zonder labels"],
  ["Fout 5", "Te vroeg afronden in tussenstappen"],
], DOMAINS.valkuil.color));

// ════════════════════════════════════════════════════
// VALKUILEN (Pitfalls) — Examengerelateerd
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 200 },
  children: [new TextRun({ text: "Veelvoorkomende examenvalkuilen", bold: true, font: "Arial", size: 36, color: C.navy })],
}));
children.push(p("Deze fouten komen elk jaar terug op het centraal examen:"));
children.push(sp(100));

children.push(warningBox("\"Ik schrijf alleen het antwoord op, want dat is toch het belangrijkste\" \u2192 Onjuist! Bij bereken- en toon-aan-vragen geven tussenstappen punten. Zonder tussenstappen verlies je tot 80% van de punten."));
children.push(sp(80));
children.push(warningBox("\"Comparatief voordeel = het meeste produceren\" \u2192 Onjuist! Dat is absoluut voordeel. Comparatief voordeel gaat over de laagste alternatieve kosten."));
children.push(sp(80));
children.push(warningBox("\"Bij een verklaring hoef ik geen economische begrippen te gebruiken\" \u2192 Onjuist! De corrector zoekt naar vaktermen zoals \"vraaglijn\", \"aanbodlijn\", \"evenwichtsprijs\". Alledaags taalgebruik levert minder punten op."));

// ════════════════════════════════════════════════════
// SAMENVATTING CHECKLIST
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 200 },
  children: [new TextRun({ text: "Samenvatting checklist", bold: true, font: "Arial", size: 36, color: C.navy })],
}));
children.push(p("Controleer of je de volgende examenvaardigheden beheerst:"));
children.push(sp(100));

children.push(checklistItem("Ik herken het vraagtype (bereken, verklaar, toon aan, grafiek) en weet welke aanpak daarbij hoort"));
children.push(checklistItem("Ik schrijf bij bereken-vragen altijd de formule, tussenstappen en eenheid op"));
children.push(checklistItem("Ik bouw bij verklaar-vragen een volledige oorzaak-mechanisme-gevolg keten op"));
children.push(checklistItem("Ik werk bij toon-aan-vragen de berekening volledig uit naar de gegeven uitkomst"));
children.push(checklistItem("Ik teken grafieken met aslabels, lijnlabels, evenwichtspunt en waarden"));
children.push(checklistItem("Ik heb een tijdverdeling gemaakt op basis van 1,5 minuut per punt"));
children.push(checklistItem("Ik ken mijn persoonlijke valkuilen en heb een strategie om ze te voorkomen"));

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
      headers: { default: makeHeader("Naar het examen \u2014 Vaardigheden") },
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
