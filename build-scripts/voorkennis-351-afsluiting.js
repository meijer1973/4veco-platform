/**
 * Uitleg Voorkennis — 3.5.1 Afsluiting
 *
 * REVIEW paragraph: covers all key concepts from chapters 1-4.
 * Students should know these before starting the final review chapter.
 *
 * Run: NODE_PATH="$(npm root -g)" node voorkennis-351-afsluiting.js
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

const OUT_DIR = `C:\\Projects\\4veco\\3. Module 3 - Markt en overheid\\3.5 Hoofdstuk 5 - Afsluiting\\3.5.1 Paragraaf 1 - Afsluiting\\1. Voorbereiden`;
const OUT_FILE = path.join(OUT_DIR, "3.5.1 Afsluiting \u2013 uitleg voorkennis.docx");

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
// CHAPTER DATA — Module 3 totaaloverzicht
// ════════════════════════════════════════════════════
const chapters = [
  { nr: "1", title: "Markten en marktstructuur", desc: "Concrete/abstracte markten, homogeen/heterogeen, toetredingsdrempels", domain: "economisch" },
  { nr: "2", title: "Marktvormen en evenwicht", desc: "Volkomen concurrentie, monopolie, oligopolie, monopolistische concurrentie", domain: "economisch" },
  { nr: "3", title: "Surplus en welvaart", desc: "Consumentensurplus, producentensurplus, welvaartsverlies", domain: "grafisch" },
  { nr: "4", title: "Winstmaximalisatie", desc: "MO = MK, totale winst, break-even", domain: "wiskunde" },
  { nr: "5", title: "Overheid en marktfalen", desc: "Externe effecten, collectieve goederen, maximum-/minimumprijs", domain: "economisch" },
  { nr: "6", title: "Belasting, subsidie en heffingen", desc: "Pigouviaanse heffing, belastingdruk, subsidie-effect", domain: "wiskunde" },
  { nr: "7", title: "Internationale handel", desc: "Comparatief voordeel, ruilvoet, protectionisme, WTO", domain: "economisch" },
];

// ════════════════════════════════════════════════════
// BUILD SECTION CHILDREN
// ════════════════════════════════════════════════════
const children = [];

// ── Title + TOC (single page) ──
children.push(...titleBlock(
  "Afsluiting \u2014 Voorkennis",
  "Alles wat je moet weten uit hoofdstuk 1 t/m 4 op een rij"
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
// SECTION 1 — Markten en marktstructuur (H1)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 1, "Markten en marktstructuur"));
children.push(sp(120));

children.push(h2d("Wat is een markt?", VK_DOMAINS.economisch.color));
children.push(p("Een markt is elke situatie waarin vragers en aanbieders met elkaar in contact komen. Een markt hoeft geen fysieke plek te zijn: de huizenmarkt, de arbeidsmarkt en online marktplaatsen zijn allemaal markten."));
children.push(bullet("Concrete markt: een fysieke locatie (bijv. de Albert Cuypmarkt)"));
children.push(bullet("Abstracte markt: geen fysieke plek, maar wel vraag en aanbod (bijv. de valutamarkt)"));
children.push(sp(60));

children.push(h2d("Homogeen vs. heterogeen", VK_DOMAINS.economisch.color));
children.push(p("Producten zijn homogeen als consumenten geen verschil zien tussen aanbieders (bijv. aandelen, graan). Producten zijn heterogeen als er merkbare verschillen zijn (bijv. smartphones, kleding)."));
children.push(tipBox("Homogeen = identiek product, heterogeen = onderscheidend product. Denk aan H van Hetzelfde."));
children.push(sp(60));

children.push(h2d("Toetredingsdrempels", VK_DOMAINS.economisch.color));
children.push(p("Toetredingsdrempels zijn obstakels die het moeilijk maken voor nieuwe bedrijven om een markt te betreden. Hoe hoger de drempels, hoe minder concurrentie er is."));
children.push(bullet("Hoge investeringskosten (bijv. een olieraffinaderij bouwen)"));
children.push(bullet("Patenten en licenties (bijv. medicijnen)"));
children.push(bullet("Schaalvoordelen van bestaande bedrijven"));
children.push(sp(60));

children.push(h2d("De vier marktvormen", VK_DOMAINS.economisch.color));
children.push(p("Op basis van het aantal aanbieders, producttype en toetredingsdrempels onderscheiden we vier marktvormen:"));
children.push(bullet("Volkomen concurrentie: veel aanbieders, homogeen product, vrije toetreding"));
children.push(bullet("Monopolistische concurrentie: veel aanbieders, heterogeen product, vrije toetreding"));
children.push(bullet("Oligopolie: weinig aanbieders, homogeen of heterogeen, hoge drempels"));
children.push(bullet("Monopolie: \u00e9\u00e9n aanbieder, uniek product, zeer hoge drempels"));
children.push(sp(60));

children.push(checkBox("Kun je de vier marktvormen benoemen en uitleggen wat ze onderscheidt?"));
children.push(sp(60));
children.push(summarySchema([
  ["Concrete markt", "Fysieke locatie waar kopers en verkopers samenkomen"],
  ["Abstracte markt", "Geen fysieke plek, wel vraag en aanbod (bijv. valutamarkt)"],
  ["Homogeen", "Identieke producten \u2014 consumenten zien geen verschil"],
  ["Heterogeen", "Onderscheidende producten \u2014 merk, kwaliteit, design"],
  ["Toetredingsdrempels", "Obstakels voor nieuwe aanbieders (kosten, patenten, schaal)"],
], VK_DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// SECTION 2 — Marktvormen en evenwicht (H2)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 2, "Marktvormen en evenwicht"));
children.push(sp(120));

children.push(h2d("Volkomen concurrentie", VK_DOMAINS.economisch.color));
children.push(p("Bij volkomen concurrentie zijn er zoveel aanbieders dat geen enkel bedrijf invloed heeft op de prijs. De marktprijs wordt bepaald door vraag en aanbod samen. Op lange termijn maken bedrijven nulwinst: de prijs is precies gelijk aan de gemiddelde totale kosten."));
children.push(formulaBox([
  "Marktevenwicht: Qv = Qa",
  "Lange termijn: p = GTK (nulwinst)",
], VK_DOMAINS.economisch.color));
children.push(sp(60));

children.push(h2d("Monopolie", VK_DOMAINS.economisch.color));
children.push(p("Een monopolist is de enige aanbieder. Hij kan de prijs be\u00efnvloeden door meer of minder aan te bieden. De monopolist maximaliseert zijn winst door te produceren waar MO = MK. De prijs leest hij af op de vraaglijn."));
children.push(warningBox("Bij een monopolie lees je de prijs NIET af bij MO = MK, maar op de vraaglijn bij die hoeveelheid!"));
children.push(sp(60));

children.push(h2d("Oligopolie", VK_DOMAINS.economisch.color));
children.push(p("Bij een oligopolie zijn er slechts enkele grote aanbieders. Bedrijven houden rekening met elkaars gedrag (strategische interactie). Ze kunnen een kartel vormen (prijsafspraken), maar dat is verboden."));
children.push(tipBox("Speltheorie helpt verklaren waarom kartels instabiel zijn: elk bedrijf heeft een prikkel om vals te spelen."));
children.push(sp(60));

children.push(h2d("Monopolistische concurrentie", VK_DOMAINS.economisch.color));
children.push(p("Veel aanbieders bieden een heterogeen product aan. Elk bedrijf heeft een kleine mate van marktmacht door productdifferentiatie (merk, kwaliteit, locatie). Op lange termijn: nulwinst, net als bij volkomen concurrentie."));
children.push(sp(60));

children.push(checkBox("Kun je voor elke marktvorm uitleggen hoe de prijs tot stand komt en of er winst wordt gemaakt?"));
children.push(sp(60));
children.push(summarySchema([
  ["Volkomen concurrentie", "Veel aanbieders, prijs = marktprijs, lange termijn nulwinst"],
  ["Monopolie", "E\u00e9n aanbieder, winstmaximalisatie bij MO = MK, prijs op vraaglijn"],
  ["Oligopolie", "Weinig aanbieders, strategische interactie, kartelvorming mogelijk"],
  ["Monopol. concurrentie", "Veel aanbieders, heterogeen product, lange termijn nulwinst"],
], VK_DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// SECTION 3 — Surplus en welvaart (grafisch)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("grafisch", 3, "Surplus en welvaart"));
children.push(sp(120));

children.push(h2d("Consumentensurplus (CS)", VK_DOMAINS.grafisch.color));
children.push(p("Het consumentensurplus is het verschil tussen wat consumenten bereid zijn te betalen (hun maximale betalingsbereidheid) en de werkelijke prijs. In een V/A-diagram is het CS het driehoekige gebied boven de prijs en onder de vraaglijn."));
children.push(formulaBox([
  "CS = \u00bd \u00d7 basis \u00d7 hoogte",
  "CS = \u00bd \u00d7 Q* \u00d7 (Pmax \u2212 P*)",
], VK_DOMAINS.grafisch.color));
children.push(sp(60));

children.push(h2d("Producentensurplus (PS)", VK_DOMAINS.grafisch.color));
children.push(p("Het producentensurplus is het verschil tussen de werkelijke prijs en de minimale prijs waartegen producenten bereid zijn te leveren. In het diagram: het driehoekige gebied onder de prijs en boven de aanbodlijn."));
children.push(formulaBox([
  "PS = \u00bd \u00d7 Q* \u00d7 (P* \u2212 Pmin)",
], VK_DOMAINS.grafisch.color));
children.push(sp(60));

children.push(h2d("Welvaartsverlies", VK_DOMAINS.grafisch.color));
children.push(p("Welvaartsverlies (deadweight loss) ontstaat wanneer de markt niet in het vrije-marktevenwicht is. Bij een monopolie, belasting, maximumprijs of minimumprijs wordt er minder verhandeld dan optimaal. Het verloren surplus is het welvaartsverlies."));
children.push(tipBox("Welvaartsverlies herken je als een driehoek tussen de vraag- en aanbodlijn, bij de hoeveelheid die niet meer wordt verhandeld."));
children.push(sp(60));

children.push(checkBox("Kun je CS en PS arceren in een V/A-diagram en uitleggen wanneer welvaartsverlies ontstaat?"));
children.push(sp(60));
children.push(summarySchema([
  ["CS", "Driehoek boven prijs, onder vraaglijn \u2014 voordeel voor kopers"],
  ["PS", "Driehoek onder prijs, boven aanbodlijn \u2014 voordeel voor verkopers"],
  ["Welvaartsverlies", "Verloren surplus door marktverstoringen (belasting, monopolie, prijsregulering)"],
], VK_DOMAINS.grafisch.color));

// ════════════════════════════════════════════════════
// SECTION 4 — Winstmaximalisatie (wiskundig)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("wiskunde", 4, "Winstmaximalisatie"));
children.push(sp(120));

children.push(h2d("De gouden regel: MO = MK", VK_DOMAINS.wiskunde.color));
children.push(p("Elk bedrijf maximaliseert zijn winst door te produceren bij de hoeveelheid waar de marginale opbrengst (MO) gelijk is aan de marginale kosten (MK). Dit geldt voor \u00e1lle marktvormen."));
children.push(formulaBox([
  "Winstmaximalisatie: MO = MK",
  "",
  "MO = \u0394TO / \u0394Q  (extra opbrengst per extra eenheid)",
  "MK = \u0394TK / \u0394Q  (extra kosten per extra eenheid)",
], VK_DOMAINS.wiskunde.color));
children.push(sp(60));

children.push(h2d("Winst berekenen", VK_DOMAINS.wiskunde.color));
children.push(p("De totale winst bereken je door de totale opbrengst te verminderen met de totale kosten:"));
children.push(formulaBox([
  "Winst = TO \u2212 TK",
  "TO = p \u00d7 Q",
  "Winst per eenheid = p \u2212 GTK",
  "Totale winst = (p \u2212 GTK) \u00d7 Q",
], VK_DOMAINS.wiskunde.color));
children.push(sp(60));

children.push(h2d("Voorbeeld", VK_DOMAINS.wiskunde.color));
children.push(p("Stel: MO = 120 \u2212 2Q en MK = 20 + Q. Bij MO = MK:"));
children.push(formulaBox([
  "120 \u2212 2Q = 20 + Q",
  "100 = 3Q",
  "Q* = 33,3  \u2192 afgerond Q* = 33",
], VK_DOMAINS.wiskunde.color));
children.push(warningBox("MO is NIET de gemiddelde opbrengst. MO is de extra opbrengst van \u00e9\u00e9n extra eenheid."));
children.push(sp(60));

children.push(checkBox("Kun je bij gegeven MO- en MK-functies de winstmaximaliserende hoeveelheid berekenen?"));
children.push(sp(60));
children.push(summarySchema([
  ["MO = MK", "De gouden regel: produceer tot de extra opbrengst gelijk is aan de extra kosten"],
  ["TO", "Totale opbrengst = prijs \u00d7 hoeveelheid"],
  ["TK", "Totale kosten = vaste kosten + variabele kosten"],
  ["Winst", "TO \u2212 TK, of (p \u2212 GTK) \u00d7 Q"],
], VK_DOMAINS.wiskunde.color));

// ════════════════════════════════════════════════════
// SECTION 5 — Overheid en marktfalen (H3)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 5, "Overheid en marktfalen"));
children.push(sp(120));

children.push(h2d("Waarom grijpt de overheid in?", VK_DOMAINS.economisch.color));
children.push(p("De markt werkt niet altijd perfect. Marktfalen ontstaat wanneer de vrije markt niet leidt tot een effici\u00ebnte uitkomst. De overheid grijpt dan in om de welvaart te vergroten."));
children.push(sp(60));

children.push(h2d("Externe effecten", VK_DOMAINS.economisch.color));
children.push(p("Externe effecten zijn gevolgen van productie of consumptie die niet in de prijs zijn verwerkt. Bij negatieve externe effecten (bijv. vervuiling) is de maatschappelijke kost hoger dan de private kost. Bij positieve externe effecten (bijv. onderwijs) is het maatschappelijke voordeel groter."));
children.push(bullet("Negatief extern effect \u2192 overheid heft belasting (Pigouviaanse heffing)"));
children.push(bullet("Positief extern effect \u2192 overheid geeft subsidie"));
children.push(sp(60));

children.push(h2d("Collectieve goederen", VK_DOMAINS.economisch.color));
children.push(p("Collectieve goederen zijn niet-uitsluitbaar en niet-rivaliserend. Omdat niemand kan worden buitengesloten, wil niemand vrijwillig betalen (free-riderprobleem). De overheid moet deze goederen daarom zelf aanbieden."));
children.push(bullet("Niet-uitsluitbaar: je kunt niemand uitsluiten van gebruik (bijv. dijken)"));
children.push(bullet("Niet-rivaliserend: gebruik door de een gaat niet ten koste van de ander (bijv. straatverlichting)"));
children.push(sp(60));

children.push(h2d("Maximumprijs en minimumprijs", VK_DOMAINS.economisch.color));
children.push(p("De overheid kan ingrijpen in de prijsvorming:"));
children.push(bullet("Maximumprijs: onder de evenwichtsprijs \u2192 tekort op de markt (bijv. huurplafond)"));
children.push(bullet("Minimumprijs: boven de evenwichtsprijs \u2192 overschot op de markt (bijv. minimumloon)"));
children.push(warningBox("Een maximumprijs ligt ONDER de evenwichtsprijs, een minimumprijs BOVEN. Omgekeerd heeft het geen effect!"));
children.push(sp(60));

children.push(checkBox("Kun je uitleggen wat marktfalen is en welke instrumenten de overheid inzet?"));
children.push(sp(60));
children.push(summarySchema([
  ["Marktfalen", "De vrije markt leidt niet tot een effici\u00ebnte uitkomst"],
  ["Negatief extern effect", "Maatschappelijke kosten > private kosten \u2192 heffing"],
  ["Positief extern effect", "Maatschappelijk voordeel > privaat voordeel \u2192 subsidie"],
  ["Collectief goed", "Niet-uitsluitbaar + niet-rivaliserend \u2192 overheid biedt aan"],
  ["Maximumprijs", "Onder evenwichtsprijs \u2192 tekort"],
  ["Minimumprijs", "Boven evenwichtsprijs \u2192 overschot"],
], VK_DOMAINS.economisch.color));

// ════════════════════════════════════════════════════
// SECTION 6 — Belasting, subsidie en heffingen (wiskundig)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("wiskunde", 6, "Belasting, subsidie en heffingen"));
children.push(sp(120));

children.push(h2d("Belasting op een markt", VK_DOMAINS.wiskunde.color));
children.push(p("Wanneer de overheid een belasting per eenheid heft, verschuift de aanbodlijn omhoog met het belastingbedrag. De evenwichtsprijs stijgt, maar meestal minder dan de belasting. De belastingdruk wordt verdeeld over consumenten en producenten."));
children.push(formulaBox([
  "Nieuwe aanbodlijn: Qa' = Qa(p \u2212 belasting)",
  "Consument betaalt: P_nieuw (hogere prijs)",
  "Producent ontvangt: P_nieuw \u2212 belasting",
], VK_DOMAINS.wiskunde.color));
children.push(sp(60));

children.push(h2d("Subsidie", VK_DOMAINS.wiskunde.color));
children.push(p("Een subsidie werkt tegengesteld: de aanbodlijn verschuift omlaag. De prijs daalt voor consumenten, en producenten ontvangen effectief meer. Subsidies worden ingezet bij positieve externe effecten."));
children.push(sp(60));

children.push(h2d("Pigouviaanse heffing", VK_DOMAINS.wiskunde.color));
children.push(p("Een Pigouviaanse heffing is een belasting die precies gelijk is aan de externe kosten. Door deze heffing worden de private kosten gelijk aan de maatschappelijke kosten, zodat de markt het effici\u00ebnte niveau bereikt."));
children.push(formulaBox([
  "Pigouviaanse heffing = externe kosten per eenheid",
  "Na heffing: private kosten + heffing = maatschappelijke kosten",
], VK_DOMAINS.wiskunde.color));
children.push(tipBox("De Pigouviaanse heffing is precies zo hoog als het externe effect. Niet meer, niet minder."));
children.push(sp(60));

children.push(checkBox("Kun je het effect van een belasting en een subsidie op het marktevenwicht berekenen en tekenen?"));
children.push(sp(60));
children.push(summarySchema([
  ["Belasting", "Aanbodlijn verschuift omhoog \u2192 hogere prijs, lagere Q"],
  ["Subsidie", "Aanbodlijn verschuift omlaag \u2192 lagere prijs, hogere Q"],
  ["Pigouviaanse heffing", "Belasting = externe kosten, corrigeert marktfalen"],
  ["Belastingdruk", "Verdeeld over consumenten en producenten (afhankelijk van elasticiteit)"],
], VK_DOMAINS.wiskunde.color));

// ════════════════════════════════════════════════════
// SECTION 7 — Internationale handel (H4)
// ════════════════════════════════════════════════════
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(domainBanner("economisch", 7, "Internationale handel"));
children.push(sp(120));

children.push(h2d("Comparatief voordeel", VK_DOMAINS.economisch.color));
children.push(p("Een land heeft een comparatief voordeel in een product als het dat product kan maken tegen lagere alternatieve kosten dan een ander land. Zelfs als een land in alles minder effici\u00ebnt is, loont handel op basis van comparatief voordeel."));
children.push(warningBox("Comparatief voordeel gaat over alternatieve kosten, NIET over absolute kosten. Een land kan in alles duurder zijn en toch comparatief voordeel hebben."));
children.push(sp(60));

children.push(h2d("Soorten handel", VK_DOMAINS.economisch.color));
children.push(p("Er zijn twee soorten internationale handel:"));
children.push(bullet("Inter-industri\u00eble handel: landen ruilen verschillende producten (bijv. wijn tegen kaas)"));
children.push(bullet("Intra-industri\u00eble handel: landen ruilen soortgelijke producten (bijv. Duitse auto\u2019s tegen Franse auto\u2019s)"));
children.push(sp(60));

children.push(h2d("Ruilvoet", VK_DOMAINS.economisch.color));
children.push(p("De ruilvoet geeft aan hoeveel importgoederen een land kan kopen met zijn exportgoederen. Een stijgende ruilvoet is gunstig: je krijgt meer import voor dezelfde export."));
children.push(formulaBox([
  "Ruilvoet = (exportprijsindex / importprijsindex) \u00d7 100",
], VK_DOMAINS.economisch.color));
children.push(sp(60));

children.push(h2d("Protectionisme vs. vrijhandel", VK_DOMAINS.economisch.color));
children.push(p("Protectionisme beschermt de binnenlandse markt via invoertarieven, quota of subsidies. Vrijhandel laat goederen en diensten ongehinderd over grenzen stromen. De WTO bevordert vrijhandel en beslecht handelsconflicten."));
children.push(bullet("Invoertarief: belasting op import \u2192 hogere prijs voor consument"));
children.push(bullet("Quotum: maximale hoeveelheid import"));
children.push(bullet("WTO: Wereldhandelsorganisatie, bevordert vrijhandel"));
children.push(sp(60));

children.push(checkBox("Kun je uitleggen waarom landen handelen en wat het effect is van protectionisme?"));
children.push(sp(60));
children.push(summarySchema([
  ["Comparatief voordeel", "Lagere alternatieve kosten \u2192 specialisatie loont"],
  ["Inter-industri\u00eble handel", "Ruil van verschillende producten tussen landen"],
  ["Intra-industri\u00eble handel", "Ruil van soortgelijke producten (productdifferentiatie)"],
  ["Ruilvoet", "(Exportprijsindex / importprijsindex) \u00d7 100"],
  ["Protectionisme", "Bescherming binnenlandse markt via tarieven, quota, subsidies"],
  ["WTO", "Wereldhandelsorganisatie \u2014 bevordert vrijhandel"],
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
children.push(p("Controleer of je de volgende zaken beheerst voordat je aan de afsluiting begint:"));
children.push(sp(100));

children.push(new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 160, after: 80 },
  children: [new TextRun({ text: "Markten en marktvormen (H1 + H2)", bold: true, font: "Arial", size: 24, color: C.navy })],
}));
children.push(checklistItem("Ik kan uitleggen wat een concrete en abstracte markt is"));
children.push(checklistItem("Ik kan de vier marktvormen benoemen en hun kenmerken beschrijven"));
children.push(checklistItem("Ik kan uitleggen wat homogene en heterogene producten zijn"));
children.push(checklistItem("Ik weet hoe de prijs tot stand komt bij elke marktvorm"));
children.push(checklistItem("Ik kan uitleggen wat een kartel is en waarom het instabiel is"));
children.push(sp(60));

children.push(new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 160, after: 80 },
  children: [new TextRun({ text: "Surplus en winstmaximalisatie", bold: true, font: "Arial", size: 24, color: C.navy })],
}));
children.push(checklistItem("Ik kan consumentensurplus en producentensurplus berekenen en arceren"));
children.push(checklistItem("Ik kan uitleggen wanneer welvaartsverlies ontstaat"));
children.push(checklistItem("Ik kan de regel MO = MK toepassen om de winstmaximaliserende hoeveelheid te vinden"));
children.push(checklistItem("Ik kan de totale winst berekenen met TO \u2212 TK"));
children.push(sp(60));

children.push(new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 160, after: 80 },
  children: [new TextRun({ text: "Overheid (H3)", bold: true, font: "Arial", size: 24, color: C.navy })],
}));
children.push(checklistItem("Ik kan uitleggen wat marktfalen is en drie vormen noemen"));
children.push(checklistItem("Ik kan het verschil uitleggen tussen positieve en negatieve externe effecten"));
children.push(checklistItem("Ik kan uitleggen wat collectieve goederen zijn en waarom de markt ze niet levert"));
children.push(checklistItem("Ik kan het effect van een maximumprijs en minimumprijs beschrijven"));
children.push(checklistItem("Ik kan uitleggen wat een Pigouviaanse heffing is"));
children.push(sp(60));

children.push(new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 160, after: 80 },
  children: [new TextRun({ text: "Internationale handel (H4)", bold: true, font: "Arial", size: 24, color: C.navy })],
}));
children.push(checklistItem("Ik kan uitleggen wat comparatief voordeel is"));
children.push(checklistItem("Ik kan het verschil uitleggen tussen inter- en intra-industri\u00eble handel"));
children.push(checklistItem("Ik kan de ruilvoet berekenen en interpreteren"));
children.push(checklistItem("Ik kan voor- en nadelen van protectionisme noemen"));

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
      headers: { default: makeHeader("Afsluiting \u2014 Voorkennis") },
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
