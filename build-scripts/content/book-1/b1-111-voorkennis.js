/**
 * Voorkennis builder for §1.1.1 Schaarste en economisch denken (Boek 1).
 *
 * First paragraph of the book — prior knowledge is LIGHT:
 *   1. Basale rekenvaardigheden (vermenigvuldigen, aftrekken)    — wiskunde (blue)
 *   2. Staafdiagrammen lezen (x-as, y-as, balk, hoogte)           — grafisch (green)
 *   3. Intuïtie voor kiezen bij beperkte middelen                — economisch (amber)
 *
 * NO A-unit vaardigheden cited (this is the first paragraph).
 *
 * Adapted from build-scripts/templates/template-B_voorkennis.js.
 * Run from 4veco-platform/ directory:
 *   node build-scripts/content/book-1/b1-111-voorkennis.js
 */
const path = require("path");
const fs = require("fs");

// Global npm modules path (docx is installed globally for this project)
const NODE_PATH = path.join(process.env.APPDATA, "npm", "node_modules");
process.env.NODE_PATH = NODE_PATH;
require("module").Module._initPaths();

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType,
  Header, Footer, PageNumber, LevelFormat, PageBreak, ImageRun,
} = require("docx");

// ─── Dual coding: embed pre-built PNGs from _assets/ ───
function embedAssetImage(assetsDir, filename, width, height) {
  const imgPath = path.join(assetsDir, filename + ".png");
  if (!fs.existsSync(imgPath)) return null;
  const buf = fs.readFileSync(imgPath);
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    alignment: AlignmentType.CENTER,
    children: [new ImageRun({
      data: buf, transformation: { width, height }, type: "png",
      altText: { title: filename, description: "asset:" + filename, name: filename },
    })],
  });
}

// ─── Output paths (flat layout — no subfolder) ───
const PARAGRAPH_DIR = path.resolve(
  __dirname, "..", "..", "..", "..",
  "4veco-lessen",
  "Boek 1 - Grondslagen, vraag en aanbod",
  "1.1 Hoofdstuk Economisch denken en rekenen",
  "1.1.1 Schaarste en economisch denken"
);
const OUT_DIR = PARAGRAPH_DIR;
const OUT_FILE = path.join(OUT_DIR, "1.1.1 Schaarste en economisch denken – uitleg voorkennis.docx");
const ASSETS_DIR = path.join(PARAGRAPH_DIR, "_assets");

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
function tipBox(text, color = C.blue, bg = C.lightBlue, label = "✨ Tip: ") {
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
  return tipBox(text, C.red, C.lightRed, "⚠ Let op: ");
}

function checkBox(text) {
  return tipBox(text, C.green, C.lightGreen, "✅ Controle: ");
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
            new TextRun({ text: "📋 Samenvatting", bold: true, font: "Arial", size: 22, color: C.white }),
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
  levels: [{ level: 0, format: LevelFormat.BULLET, text: "☐",
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
// CHAPTER DATA — 3 voorkennis-onderwerpen voor §1.1.1 (intro van het boek)
// ════════════════════════════════════════════════════
const chapters = [
  { nr: "1", title: "Basale rekenvaardigheden",  desc: "Vermenigvuldigen en aftrekken met euro’s",   domain: "wiskunde" },
  { nr: "2", title: "Staafdiagrammen lezen",     desc: "Assen, balken en hoogtes aflezen",                domain: "grafisch" },
  { nr: "3", title: "Intuïtie voor kiezen", desc: "Dagelijkse keuzes bij beperkte tijd of geld",     domain: "economisch" },
];

// ════════════════════════════════════════════════════
// BUILD SECTION CHILDREN
// ════════════════════════════════════════════════════
const children = [];

// ── Title + TOC ──
children.push(...titleBlock(
  "Schaarste en economisch denken — Voorkennis",
  "Wat moet je al kunnen voordat je aan deze paragraaf begint?"
));
children.push(sp(80));
children.push(p("Dit is de eerste paragraaf van het vak economie, dus de voorkennis blijft beperkt tot wat je al uit de onderbouw kent. We kijken naar drie bouwsteentjes: wat eenvoudig rekenwerk met geldbedragen, het lezen van een staafdiagram, en je eigen gevoel voor kiezen als je iets beperkt hebt (tijd, geld, ruimte). Meer heb je niet nodig om aan §1.1.1 te beginnen.", { italics: true, color: C.gray }));
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
// CHAPTER 1 — Basale rekenvaardigheden (wiskunde / blue)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("wiskunde", 1, "Basale rekenvaardigheden"));
children.push(sp(120));

children.push(h2d("Vermenigvuldigen en aftrekken met euro’s", VK_DOMAINS.wiskunde.color));
children.push(p("In de economie reken je voortdurend met bedragen. Meestal gaat het om twee eenvoudige bewerkingen: vermenigvuldigen (bijvoorbeeld een opbrengst per stuk keer het aantal stuks) en aftrekken (bijvoorbeeld om te kijken hoeveel je overhoudt, of wat het verschil is tussen twee opties). Je kent deze operaties natuurlijk allang — we frissen ze kort op in een economische context."));

children.push(p("Vermenigvuldigen gebruik je als je een bedrag per eenheid hebt en je wilt weten wat het in totaal oplevert:", { bold: true }));
children.push(formulaBox([
  "totaal = aantal eenheden × bedrag per eenheid",
  "voorbeeld: 8 hectare × €500 per hectare = €4.000",
], VK_DOMAINS.wiskunde.color));

children.push(p("Aftrekken gebruik je als je het verschil tussen twee bedragen wilt weten — bijvoorbeeld tussen wat een keuze oplevert en wat de andere optie zou hebben opgeleverd:", { bold: true }));
children.push(formulaBox([
  "verschil = bedrag A − bedrag B",
  "voorbeeld: €5.000 − €3.500 = €1.500",
], VK_DOMAINS.wiskunde.color));

children.push(h2d("Uitgewerkt voorbeeld", VK_DOMAINS.wiskunde.color));
children.push(p("Een boer heeft 10 hectare land en verbouwt tarwe met een opbrengst van €500 per hectare. Hoeveel levert het hem in totaal op?"));
children.push(bullet("Stap 1: herken de vermenigvuldiging — aantal hectare × opbrengst per hectare."));
children.push(bullet("Stap 2: reken uit — 10 × €500 = €5.000."));
children.push(bullet("Stap 3: controleer de orde van grootte — €5.000 klinkt redelijk voor 10 hectare tarwe."));

children.push(tipBox("Ken de maaltafels tot 10 uit je hoofd. Zo hoef je je rekenmachine niet te pakken voor “aantal × prijs” — dat scheelt tijd bij een toets of opgave."));
children.push(sp(60));
children.push(checkBox("Kun je zonder rekenmachine uitrekenen: 8 × €500, en daarna €5.000 − €3.500?"));
children.push(sp(60));
children.push(summarySchema([
  ["Vermenigvuldigen", "totaal = aantal × bedrag per eenheid"],
  ["Aftrekken",        "verschil = bedrag A − bedrag B"],
  ["Toepassing",       "totale opbrengst en verschil tussen twee alternatieven uitrekenen"],
], VK_DOMAINS.wiskunde.color));

// ════════════════════════════════════════════════════
// CHAPTER 2 — Staafdiagrammen lezen (grafisch / green)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("grafisch", 2, "Staafdiagrammen lezen"));
children.push(sp(120));

children.push(h2d("Wat is een staafdiagram?", VK_DOMAINS.grafisch.color));
children.push(p("Een staafdiagram is een grafiek waarin je losse categorieën (bijvoorbeeld verschillende gewassen, producten of landen) naast elkaar ziet, elk met een eigen staaf. De hoogte van de staaf laat zien hoeveel er van die categorie is — bijvoorbeeld de opbrengst per hectare of het aantal verkochte eenheden. Je kent dit type grafiek al uit de onderbouw; we gebruiken het in economie om snel alternatieven met elkaar te kunnen vergelijken."));

children.push(p("Drie dingen moet je altijd eerst bekijken voordat je iets aflast:", { bold: true }));
children.push(bullet("De horizontale as (x-as): welke categorieën staan er naast elkaar? Bijvoorbeeld: tarwe, maïs, zonnebloemen."));
children.push(bullet("De verticale as (y-as): wat wordt gemeten, en in welke eenheid? Bijvoorbeeld: winst per hectare in euro’s."));
children.push(bullet("De schaal: gaat de as in stapjes van €50, €100 of €500? Dat bepaalt hoe nauwkeurig je kunt aflezen."));

children.push(h2d("Voorbeeld: winst per hectare", VK_DOMAINS.grafisch.color));
children.push(p("In het staafdiagram hieronder zie je de winst per hectare voor drie gewassen die een boer kan verbouwen. Op de x-as staan de drie gewassen, op de y-as de winst per hectare in euro’s."));

const figExImage = embedAssetImage(ASSETS_DIR, "1.1.1_ex_1", 420, 280);
if (figExImage) children.push(figExImage);
children.push(p("Voorbeeld van aflezen: trek vanaf de top van de maïs-staaf een denkbeeldige horizontale lijn naar de y-as. Daar lees je de winst per hectare van maïs af. Doe hetzelfde voor tarwe en zonnebloemen, en je kunt direct zien welk gewas het meest oplevert per hectare.", { italics: true, color: C.gray }));

children.push(tipBox("Lees de as-labels altijd vóórdat je naar de staven kijkt. Zonder te weten wát de staaf meet (euro’s? aantallen? procenten?), kun je geen zinnige conclusie trekken."));
children.push(sp(60));
children.push(warningBox("Let op bij grafieken waarbij de y-as niet bij 0 begint: een klein verschil lijkt dan opeens enorm. Kijk dus altijd naar de schaal, niet alleen naar de hoogteverhouding tussen de staven."));
children.push(sp(60));
children.push(checkBox("Kun je in een staafdiagram benoemen wat er op de x-as en y-as staat, en de hoogte van een staaf aflezen met de juiste eenheid?"));
children.push(sp(60));
children.push(summarySchema([
  ["X-as",  "De categorieën die je vergelijkt (bijv. gewassen)"],
  ["Y-as",  "De hoeveelheid met eenheid (bijv. € per hectare)"],
  ["Staaf", "Hoogte = de waarde; aflezen naar de y-as"],
  ["Schaal","Let op waar de as begint en in welke stappen hij oploopt"],
], VK_DOMAINS.grafisch.color));

// ════════════════════════════════════════════════════
// CHAPTER 3 — Intuïtie voor kiezen (economisch / amber)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 3, "Intuïtie voor kiezen"));
children.push(sp(120));

children.push(h2d("Je kiest al elke dag — vaak zonder erbij stil te staan", VK_DOMAINS.economisch.color));
children.push(p("Voor de economieles heb je nog geen economische theorie nodig om te snappen wat kiezen onder beperkingen is. Dat doe je al iedere dag. Je zakgeld is beperkt, je vrije tijd is beperkt, de ruimte in je tas is beperkt — en precies daarom moet je voortdurend kleine keuzes maken. Die ervaring vormt de intuïtie die je in §1.1.1 netjes in economische termen leert vangen."));

children.push(p("Drie alledaagse situaties waarin je al onbewust economisch kiest:", { bold: true }));
children.push(bullet("Je hebt €20 zakgeld. Je wilt naar de bioscoop (€12) én een boek kopen (€15). Beide past niet — je moet kiezen."));
children.push(bullet("Je hebt zaterdagmiddag 4 uur vrij. Je wilt sporten, studeren én afspreken met vrienden. Ook hier: je kunt niet alles tegelijk doen."));
children.push(bullet("Je schoolrugzak zit al vol. Je moet kiezen welke map je thuis laat, want er past er maar één bij."));

children.push(h2d("Wat gebeurt er in je hoofd als je kiest?", VK_DOMAINS.economisch.color));
children.push(p("Meestal kijk je eerst wat je opties zijn, daarna schat je in wat elke optie je oplevert (plezier, een goed cijfer, tijd met vrienden), en ten slotte kies je de optie die je het meest waard is. Ondertussen besef je — vaak zonder het bewust uit te spreken — dat je de andere opties opgeeft. Dit gevoel van “ik kan niet alles” is de intuïtie die economen vangen in het begrip schaarste en waarmee je in §1.1.1 gaat leren rekenen via alternatieve kosten."));

children.push(tipBox("Maak het voor jezelf concreet: denk bij elke economische opgave eerst even aan een eigen keuze uit je dagelijks leven. Wat zijn mijn opties? Wat geef ik op? Die reflex helpt je later ook bij abstractere voorbeelden."));
children.push(sp(60));
children.push(checkBox("Kun je drie eigen voorbeelden noemen van situaties waarin je vandaag of deze week iets moest kiezen omdat tijd of geld beperkt was?"));
children.push(sp(60));
children.push(summarySchema([
  ["Beperkte middelen", "Geld, tijd en ruimte zijn nooit onbeperkt"],
  ["Keuze maken",       "Opties vergelijken en de beste kiezen"],
  ["Opgeven",           "Wat je niet kiest, loop je mis — dat hoort erbij"],
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
children.push(p("Controleer of je de volgende zaken beheerst voordat je aan §1.1.1 begint:"));
children.push(sp(100));

children.push(checklistItem("Ik kan uit mijn hoofd uitrekenen: 8 × €500."));
children.push(checklistItem("Ik kan uit mijn hoofd uitrekenen: €5.000 − €3.500."));
children.push(checklistItem("Ik kan in een staafdiagram de x-as en y-as benoemen."));
children.push(checklistItem("Ik kan de hoogte van een staaf aflezen en de eenheid erbij noemen."));
children.push(checklistItem("Ik let op of de y-as bij 0 begint vóórdat ik conclusies trek."));
children.push(checklistItem("Ik kan drie eigen voorbeelden noemen van kiezen bij beperkte tijd of geld."));

// ════════════════════════════════════════════════════
// BUILD DOCUMENT
// ════════════════════════════════════════════════════
const doc = new Document({
  styles: DOC_STYLES,
  numbering: { config: [CHECKLIST_NUMBERING] },
  sections: [
    {
      properties: { page: PAGE },
      headers: { default: makeHeader("1.1.1 Schaarste en economisch denken — Voorkennis") },
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
