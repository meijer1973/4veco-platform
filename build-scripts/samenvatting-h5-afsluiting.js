/**
 * samenvatting-h5-afsluiting.js
 *
 * Generates: 3.5 Afsluiting – samenvatting.docx
 * A comprehensive module-level review covering all 4 chapters of Module 3.
 *
 * HOW TO ADAPT:
 * This script is specific to Module 3 Chapter 5 (Afsluiting).
 * It is NOT a reusable template — it synthesizes all 4 chapters into one review document.
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/samenvatting-h5-afsluiting.js
 */

const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat,
} = require("docx");

// ═══════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════

const PAGE = {
  size: { width: 11906, height: 16838 },
  margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
};
const CW = 9026;

const C = {
  dTeal:      "17A2B8",
  dTealLt:    "E8F8FB",
  dTealDk:    "117A8B",
  dBlue:      "1A5276",
  dBlueLt:    "EBF5FB",
  dBlueDk:    "154360",
  dAmber:     "E67E22",
  dAmberLt:   "FEF5E7",
  dAmberDk:   "BA6A1C",
  dGreen:     "1E8449",
  dGreenLt:   "E8F8F0",
  dGreenDk:   "186A3B",
  navy:       "1E2761",
  white:      "FFFFFF",
  dark:       "2D3748",
  gray:       "718096",
  lightGray:  "F7F8FA",
  borderGray: "CBD5E0",
  red:        "D9534F",
  lightRed:   "FDE8E8",
  blue:       "1A5276",
  lightBlue:  "EBF5FB",
  green:      "1E8449",
  lightGreen: "E8F5E9",
  rowAlt:     "F7FAFC",
};

const DOC_STYLES = {
  default: { document: { run: { font: "Arial", size: 22 } } },
  paragraphStyles: [
    {
      id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
      quickFormat: true,
      run: { size: 30, bold: true, font: "Arial", color: C.navy },
      paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
    },
    {
      id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
      quickFormat: true,
      run: { size: 24, bold: true, font: "Arial", color: C.blue },
      paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 },
    },
  ],
};

const CHECKLIST_NUMBERING = {
  reference: "checklist",
  levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2610",
    alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 720, hanging: 360 } } },
  }],
};

// ═══════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════

const sp = (after = 80) => new Paragraph({ spacing: { after }, children: [] });

const p = (text, opts = {}) => new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({ text, font: "Arial", size: 22, color: C.dark, ...opts })],
});

const rp = (runs) => new Paragraph({
  spacing: { after: 120 },
  children: runs.map(r => new TextRun({ font: "Arial", size: 22, color: C.dark, ...r })),
});

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 30, color: C.navy })],
  });
}

function h2(text, color = C.blue) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 24, color })],
  });
}

function makeHeader(text) {
  return new Header({ children: [
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text, font: "Arial", size: 18, color: C.gray, italics: true })],
    }),
  ]});
}

function makeFooter() {
  return new Footer({ children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Pagina ", font: "Arial", size: 18, color: C.gray }),
        new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: C.gray }),
      ],
    }),
  ]});
}

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

function checklistItem(text) {
  return new Paragraph({
    numbering: { reference: "checklist", level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22 })],
  });
}

// Chapter banner (colored strip for each chapter section)
function chapterBanner(chNr, chTitle, color, lightColor, darkColor) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [700, CW - 700],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: {
          top:    { style: BorderStyle.SINGLE, size: 1, color },
          bottom: { style: BorderStyle.SINGLE, size: 1, color },
          left:   { style: BorderStyle.SINGLE, size: 1, color },
          right:  { style: BorderStyle.NONE, size: 0, color },
        },
        shading: { fill: color, type: ShadingType.CLEAR },
        margins: { top: 140, bottom: 140, left: 120, right: 80 },
        width: { size: 700, type: WidthType.DXA },
        verticalAlign: "center",
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `H${chNr}`, bold: true, font: "Arial", size: 28, color: C.white })],
        })],
      }),
      new TableCell({
        borders: {
          top:    { style: BorderStyle.SINGLE, size: 1, color },
          bottom: { style: BorderStyle.SINGLE, size: 1, color },
          left:   { style: BorderStyle.NONE, size: 0, color },
          right:  { style: BorderStyle.SINGLE, size: 1, color },
        },
        shading: { fill: lightColor, type: ShadingType.CLEAR },
        margins: { top: 140, bottom: 140, left: 200, right: 200 },
        width: { size: CW - 700, type: WidthType.DXA },
        verticalAlign: "center",
        children: [new Paragraph({
          children: [new TextRun({ text: chTitle, bold: true, font: "Arial", size: 26, color: darkColor })],
        })],
      }),
    ] })],
  });
}

// Definition table: 3-column (Begrip, Definitie, Voorbeeld)
function defTable3(rows) {
  const col1W = Math.round(CW * 0.22);
  const col2W = Math.round(CW * 0.40);
  const col3W = CW - col1W - col2W;
  const hdrBrd = { top: { style: BorderStyle.SINGLE, size: 1, color: C.navy }, bottom: { style: BorderStyle.SINGLE, size: 1, color: C.navy }, left: { style: BorderStyle.SINGLE, size: 1, color: C.navy }, right: { style: BorderStyle.SINGLE, size: 1, color: C.navy } };
  const rowBrd = { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } };
  const cellM = { top: 80, bottom: 80, left: 120, right: 120 };

  function hdrCell(text, w) {
    return new TableCell({
      borders: hdrBrd, shading: { fill: C.navy, type: ShadingType.CLEAR },
      margins: cellM, width: { size: w, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text, bold: true, font: "Arial", size: 20, color: C.white })] })],
    });
  }

  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [col1W, col2W, col3W],
    rows: [
      new TableRow({ children: [hdrCell("Begrip", col1W), hdrCell("Definitie", col2W), hdrCell("Voorbeeld", col3W)] }),
      ...rows.map((r, i) => new TableRow({ children: [
        new TableCell({ borders: rowBrd, shading: { fill: i % 2 === 0 ? C.rowAlt : C.white, type: ShadingType.CLEAR }, margins: cellM, width: { size: col1W, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: r[0], bold: true, font: "Arial", size: 20 })] })], }),
        new TableCell({ borders: rowBrd, shading: { fill: i % 2 === 0 ? C.rowAlt : C.white, type: ShadingType.CLEAR }, margins: cellM, width: { size: col2W, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: r[1], font: "Arial", size: 20 })] })], }),
        new TableCell({ borders: rowBrd, shading: { fill: i % 2 === 0 ? C.rowAlt : C.white, type: ShadingType.CLEAR }, margins: cellM, width: { size: col3W, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: r[2], font: "Arial", size: 20, color: C.gray })] })], }),
      ]})),
    ],
  });
}

// Comparison table: multi-column
function comparisonTable(headers, rows) {
  const colW = Math.floor(CW / headers.length);
  const lastColW = CW - colW * (headers.length - 1);
  const hdrBrd = { top: { style: BorderStyle.SINGLE, size: 1, color: C.navy }, bottom: { style: BorderStyle.SINGLE, size: 2, color: C.navy }, left: { style: BorderStyle.SINGLE, size: 1, color: C.navy }, right: { style: BorderStyle.SINGLE, size: 1, color: C.navy } };
  const rowBrd = { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } };
  const cellM = { top: 80, bottom: 80, left: 100, right: 100 };

  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: headers.map((_, i) => i === headers.length - 1 ? lastColW : colW),
    rows: [
      new TableRow({ children: headers.map((h, i) =>
        new TableCell({
          borders: hdrBrd, shading: { fill: C.navy, type: ShadingType.CLEAR },
          margins: cellM, width: { size: i === headers.length - 1 ? lastColW : colW, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, font: "Arial", size: 20, color: C.white })] })],
        })
      ) }),
      ...rows.map((r, i) => new TableRow({ children: r.map((cell, j) =>
        new TableCell({
          borders: rowBrd,
          shading: { fill: j === 0 ? C.lightGray : (i % 2 === 0 ? C.rowAlt : C.white), type: ShadingType.CLEAR },
          margins: cellM,
          width: { size: j === headers.length - 1 ? lastColW : colW, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 19, color: C.dark, bold: j === 0 })] })],
        })
      ) })),
    ],
  });
}

// Reasoning chain box
function reasoningBox(lines, accentColor = C.dBlue) {
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
      shading: { fill: C.white, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      width: { size: CW, type: WidthType.DXA },
      children: lines.map(line => new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: line, font: "Arial", size: 21, color: C.dark })],
      })),
    })] })],
  });
}

// Error box (fout / correct)
function errorBox(fout, correct) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 1, color: C.lightRed },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: C.lightRed },
        left:   { style: BorderStyle.SINGLE, size: 8, color: C.red },
        right:  { style: BorderStyle.SINGLE, size: 1, color: C.lightRed },
      },
      shading: { fill: "FFFBFB", type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 200, right: 200 },
      width: { size: CW, type: WidthType.DXA },
      children: [
        new Paragraph({ spacing: { after: 60 }, children: [
          new TextRun({ text: "\u274C ", font: "Arial", size: 22, color: C.red }),
          new TextRun({ text: fout, font: "Arial", size: 21, color: C.dark }),
        ]}),
        new Paragraph({ spacing: { after: 40 }, children: [
          new TextRun({ text: "\u2705 ", font: "Arial", size: 22, color: C.green }),
          new TextRun({ text: correct, font: "Arial", size: 21, color: C.dark }),
        ]}),
      ],
    })] })],
  });
}


// ═══════════════════════════════════════════════════════════════
// CONTENT — MODULE 3 COMPLETE REVIEW
// ═══════════════════════════════════════════════════════════════

async function build() {
  const children = [];

  // ── TITLE PAGE ──
  children.push(sp(800));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 40 },
    children: [new TextRun({ text: "Module 3", bold: true, font: "Arial", size: 52, color: C.navy })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 80 },
    children: [new TextRun({ text: "Markt en overheid", bold: true, font: "Arial", size: 44, color: C.navy })],
  }));
  children.push(sp(60));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 40 },
    children: [new TextRun({ text: "Samenvatting voor toetsvoorbereiding", font: "Arial", size: 28, color: C.gray })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 200 },
    children: [new TextRun({ text: "Hoofdstuk 5 \u2013 Afsluiting", font: "Arial", size: 24, color: C.gray })],
  }));
  children.push(sp(100));

  // Chapter color legend
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [Math.floor(CW/4), Math.floor(CW/4), Math.floor(CW/4), CW - 3*Math.floor(CW/4)],
    rows: [new TableRow({ children:
      [["H1 Markten", C.dTeal, C.dTealLt], ["H2 Marktvormen", C.dBlue, C.dBlueLt], ["H3 Overheid", C.dAmber, C.dAmberLt], ["H4 Internationaal", C.dGreen, C.dGreenLt]].map(([label, color, light], i) =>
        new TableCell({
          borders: { top: { style: BorderStyle.SINGLE, size: 6, color }, bottom: { style: BorderStyle.SINGLE, size: 1, color: light }, left: { style: BorderStyle.SINGLE, size: 1, color: light }, right: { style: BorderStyle.SINGLE, size: 1, color: light } },
          shading: { fill: light, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
          width: { size: i === 3 ? CW - 3*Math.floor(CW/4) : Math.floor(CW/4), type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: label, bold: true, font: "Arial", size: 18, color }),
          ]})],
        })
      ),
    })],
  }));
  children.push(sp(300));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 120 },
    children: [new TextRun({ text: "Dit document bevat een compleet overzicht van alle begrippen, formules,", font: "Arial", size: 22, color: C.gray })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 120 },
    children: [new TextRun({ text: "redeneerschema\u2019s en vergelijkingstabellen uit Module 3.", font: "Arial", size: 22, color: C.gray })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 120 },
    children: [new TextRun({ text: "Gebruik het als naslagwerk bij je toetsvoorbereiding.", font: "Arial", size: 22, color: C.gray })],
  }));

  // ══════════════════════════════════════════════════════════════
  // SECTION 1: OVERZICHT PER HOOFDSTUK
  // ══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(h1("Overzicht: wat moet je kennen en kunnen?"));
  children.push(sp());

  children.push(comparisonTable(
    ["Hoofdstuk", "Kern", "Belangrijkste vaardigheden", "\u2605"],
    [
      ["H1 Markten", "Marktstructuur, marktvormen herkennen, prijselasticiteit", "Marktvorm bepalen, elasticiteit berekenen", "\u2605"],
      ["H2 Marktvormen", "Evenwicht berekenen, winstmaximalisatie, MO=MK, surplus", "MO/MK afleiden, winst berekenen, Cournot, CS/PS", "\u2605\u2605\u2605"],
      ["H3 Overheid", "Marktfalen, belasting, subsidie, max/min-prijs, collectieve goederen", "Belastingeffect berekenen, surplus met beleid, goederen classificeren", "\u2605\u2605"],
      ["H4 Internationaal", "Comparatief voordeel, handel, tarieven, wisselkoersen", "Opofferingskosten, ruilvoet, tarief-effect, wisselkoers", "\u2605\u2605\u2605"],
    ]
  ));
  children.push(sp());
  children.push(tipBox("De sterren geven de rekenzwaarte aan. H2 en H4 vragen de meeste rekenwerk; H1 en H3 zijn meer begripsmatig.", C.blue, C.lightBlue, "\u2728 Tip: "));

  // ══════════════════════════════════════════════════════════════
  // SECTION 2: KERNBEGRIPPEN PER HOOFDSTUK
  // ══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(h1("Kernbegrippen per hoofdstuk"));
  children.push(sp());

  // H1
  children.push(chapterBanner("1", "Markten", C.dTeal, C.dTealLt, C.dTealDk));
  children.push(sp());
  children.push(defTable3([
    ["Markt", "Elke situatie waarin vragers en aanbieders contact maken", "Markt voor smartphones"],
    ["Concrete markt", "Fysieke plek waar gehandeld wordt", "Warenmarkt, veiling"],
    ["Abstracte markt", "Handel zonder vaste locatie (online, telefonisch)", "Aandelenmarkt, Booking.com"],
    ["Homogeen product", "Producten zijn in de ogen van de consument identiek", "Benzine, graan, suiker"],
    ["Heterogeen product", "Producten verschillen in de ogen van de consument", "Smartphones, restaurants"],
    ["Toetredingsdrempel", "Obstakels die nieuwe aanbieders tegenhouden", "Patenten, hoge investeringen"],
    ["Prijselasticiteit (Ev)", "Mate waarin Qv reageert op prijsverandering", "Ev = %\u0394Qv / %\u0394p"],
    ["Marktmacht", "Vermogen van een aanbieder om de prijs te be\u00EFnvloeden", "Monopolist heeft veel marktmacht"],
  ]));
  children.push(sp(200));

  // H2
  children.push(chapterBanner("2", "Marktvormen en hun marktevenwicht", C.dBlue, C.dBlueLt, C.dBlueDk));
  children.push(sp());
  children.push(defTable3([
    ["Marktevenwicht", "Qv = Qa; geen tekort of overschot", "Bij p=10: Qv=40, Qa=40"],
    ["MO (marginale opbrengst)", "Extra opbrengst van \u00E9\u00E9n extra eenheid verkopen", "MO = afgeleide van TO"],
    ["MK (marginale kosten)", "Extra kosten van \u00E9\u00E9n extra eenheid produceren", "MK = afgeleide van TK"],
    ["GTK (gem. totale kosten)", "Kosten per eenheid: TK / Q", "TK=200+5Q \u2192 GTK=200/Q+5"],
    ["Winstmaximalisatie", "Produceer waar MO = MK", "MO=MK oplossen naar Q*"],
    ["Prijszetter", "Aanbieder bepaalt zelf de prijs", "Monopolist, oligopolist"],
    ["Prijsnemer", "Aanbieder neemt marktprijs als gegeven", "Boer op de graanmarkt"],
    ["CS (consumentensurplus)", "Wat consumenten besparen t.o.v. hun max. betalingsbereidheid", "CS = \u00BD \u00D7 (max.prijs \u2212 p*) \u00D7 Q*"],
    ["PS (producentensurplus)", "Winst + vaste kosten; opbrengst boven variabele kosten", "PS = TO \u2212 TVK"],
    ["Welvaartsverlies", "Verlies aan TS doordat Q < Q* bij volkomen concurrentie", "Driehoek bij monopolie"],
    ["Residuele vraag", "Vraag die overblijft voor \u00E9\u00E9n bedrijf (oligopolie)", "q\u2081 = marktvraag \u2212 q\u2082"],
    ["Reactielijn", "Optimale q van bedrijf als functie van concurrent", "q\u2081 = f(q\u2082) via MO=MK"],
    ["Cournot-evenwicht", "Snijpunt reactielijnen; niemand wil afwijken", "Stelsel oplossen"],
  ]));
  children.push(sp(200));

  // H3
  children.push(chapterBanner("3", "Overheid", C.dAmber, C.dAmberLt, C.dAmberDk));
  children.push(sp());
  children.push(defTable3([
    ["Marktfalen", "Vrije markt leidt niet tot effici\u00EBnte uitkomst", "Vervuiling, monopolie"],
    ["Externe effecten", "Kosten/baten die niet in de marktprijs zitten", "Luchtvervuiling (negatief), vaccin (positief)"],
    ["Belasting (accijns)", "Heffing per eenheid; verschuift aanbod omhoog", "Accijns op tabak: +\u20AC2 per pakje"],
    ["Subsidie", "Bijdrage per eenheid; verschuift aanbod omlaag", "Subsidie op zonnepanelen"],
    ["Maximumprijs", "Prijsgrens onder p*; veroorzaakt tekort (Qv > Qa)", "Maximale huurprijs"],
    ["Minimumprijs", "Prijsgrens boven p*; veroorzaakt overschot (Qa > Qv)", "Minimumprijs melk, minimumloon"],
    ["Collectief goed", "Niet-uitsluitbaar \u00E9n niet-rivaliserend", "Dijkbescherming, straatverlichting"],
    ["Quasi-collectief goed", "Niet-rivaliserend maar w\u00E9l uitsluitbaar", "Bioscoop, snelweg met tol"],
    ["Merit good", "Goed dat de overheid stimuleert wegens onderconsumptie", "Onderwijs, sport, cultuur"],
    ["Demerit good", "Goed dat de overheid ontmoedigt wegens overconsumptie", "Tabak, alcohol, gokken"],
    ["Freerider-probleem", "Mensen profiteren zonder te betalen", "Niet betalen voor dijkonderhoud"],
  ]));
  children.push(sp(200));

  // H4
  children.push(chapterBanner("4", "Internationale markten", C.dGreen, C.dGreenLt, C.dGreenDk));
  children.push(sp());
  children.push(defTable3([
    ["Absoluut voordeel", "Land produceert met minder middelen", "NL maakt meer bloemen per ha dan DE"],
    ["Comparatief voordeel", "Land heeft lagere opofferingskosten", "NL: 1 bloem kost 0,5 kaas i.p.v. 1"],
    ["Opofferingskosten", "Wat je opgeeft om 1 eenheid extra te maken", "1 extra bloem = 2 minder kaas"],
    ["Ruilvoet", "Internationale prijs waartegen landen ruilen", "Tussen opofferingskosten van beide landen"],
    ["Inter-industri\u00EBle handel", "Handel in VERSCHILLENDE producten", "NL exporteert bloemen, FR exporteert wijn"],
    ["Intra-industri\u00EBle handel", "Handel in DEZELFDE soort producten", "NL importeert \u00E9n exporteert auto\u2019s"],
    ["Invoerrecht (tarief)", "Belasting op import; verhoogt MK buitenlander", "EU heft 10% op Chinees staal"],
    ["Importquotum", "Maximum aantal toegestane imports", "Max. 1000 ton staal per jaar"],
    ["Wisselkoers", "Prijs van de ene munt in de andere", "1 EUR = 1,10 USD"],
    ["Appreciatie", "Munt wordt meer waard", "EUR stijgt: meer USD per EUR"],
    ["Depreciatie", "Munt wordt minder waard", "EUR daalt: minder USD per EUR"],
    ["Productieketen", "Alle stappen van grondstof tot eindproduct, over landen", "iPhone: ontwerp VS, chips Taiwan"],
  ]));

  // ══════════════════════════════════════════════════════════════
  // SECTION 3: FORMULES EN BEREKENINGEN
  // ══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(h1("Formules en berekeningen"));
  children.push(sp());

  // H2 formulas
  children.push(h2("Winstmaximalisatie (H2)", C.dBlue));
  children.push(formulaBox([
    "Basisregel:  MO = MK",
    "",
    "Volkomen concurrentie: MO = p  (prijs is gegeven)",
    "Monopolie: MO heeft 2\u00D7 de helling van de vraaglijn",
    "  Vraaglijn: p = \u2212aQ + b  \u2192  MO = \u22122aQ + b",
    "",
    "Winst = (p* \u2212 GTK*) \u00D7 Q*",
    "  of: Winst = TO \u2212 TK",
  ], C.dBlue));
  children.push(sp());
  children.push(p("Voorbeeld: Monopolist met p = \u2212Q + 200 en TK = 0,5Q\u00B2 + 20Q + 100"));
  children.push(formulaBox([
    "MO = \u22122Q + 200     MK = Q + 20",
    "MO = MK  \u2192  \u22122Q + 200 = Q + 20  \u2192  3Q = 180  \u2192  Q* = 60",
    "p* = \u221260 + 200 = 140",
    "GTK* = (0,5\u00D760\u00B2 + 20\u00D760 + 100) / 60 = 3100/60 \u2248 51,67",
    "Winst = (140 \u2212 51,67) \u00D7 60 = \u20AC5.300",
  ], C.dBlue));
  children.push(sp());

  children.push(h2("Kostenfuncties (H2)", C.dBlue));
  children.push(formulaBox([
    "TK = VK + CK  (variabele + constante kosten)",
    "MK = afgeleide van TK naar Q  (TK\u2019)",
    "GTK = TK / Q",
    "GVK = TVK / Q",
    "",
    "Aanbodfunctie (volkomen concurrentie):",
    "  = MK-lijn boven het minimum van de GTK-lijn",
  ], C.dBlue));
  children.push(sp());

  children.push(h2("Surplus berekenen (H2 + H3)", C.dAmber));
  children.push(formulaBox([
    "CS = \u00BD \u00D7 (max. betalingsbereidheid \u2212 p*) \u00D7 Q*",
    "PS = \u00BD \u00D7 (p* \u2212 min. aanbodprijs) \u00D7 Q*",
    "TS = CS + PS",
    "",
    "Welvaartsverlies = TS(volkomen conc.) \u2212 TS(marktvorm)",
  ], C.dAmber));
  children.push(sp());

  children.push(h2("Cournot-model (H2)", C.dBlue));
  children.push(formulaBox([
    "Marktvraag: Q = a \u2212 bp,  dus p = (a/b) \u2212 (1/b)Q",
    "Q = q\u2081 + q\u2082  \u2192  p = (a/b) \u2212 (1/b)(q\u2081 + q\u2082)",
    "",
    "Stap 1: TO\u2081 = p \u00D7 q\u2081  \u2192  MO\u2081 (afgeleide naar q\u2081)",
    "Stap 2: MO\u2081 = MK\u2081  \u2192  reactielijn q\u2081 = f(q\u2082)",
    "Stap 3: Idem voor bedrijf 2  \u2192  q\u2082 = f(q\u2081)",
    "Stap 4: Stelsel oplossen  \u2192  q\u2081* en q\u2082*",
  ], C.dBlue));
  children.push(sp());

  children.push(h2("Belasting en subsidie (H3)", C.dAmber));
  children.push(formulaBox([
    "Belasting t per eenheid op producenten:",
    "  Nieuwe aanbod: Qa_nieuw(p) = Qa_oud(p \u2212 t)",
    "  \u2192 aanbodlijn verschuift t omhoog",
    "",
    "Subsidie s per eenheid aan producenten:",
    "  Nieuwe aanbod: Qa_nieuw(p) = Qa_oud(p + s)",
    "  \u2192 aanbodlijn verschuift s omlaag",
    "",
    "Belastingdruk verdeling: hangt af van elasticiteiten",
    "  Inelastische kant draagt het meeste",
  ], C.dAmber));
  children.push(sp());

  children.push(h2("Maximumprijs en minimumprijs (H3)", C.dAmber));
  children.push(formulaBox([
    "Maximumprijs (p_max < p*):",
    "  Tekort = Qv(p_max) \u2212 Qa(p_max)",
    "  Verhandelde hoeveelheid = Qa(p_max)  [= het kleinste]",
    "",
    "Minimumprijs (p_min > p*):",
    "  Overschot = Qa(p_min) \u2212 Qv(p_min)",
    "  Verhandelde hoeveelheid = Qv(p_min)  [= het kleinste]",
  ], C.dAmber));
  children.push(sp());

  children.push(h2("Comparatief voordeel en opofferingskosten (H4)", C.dGreen));
  children.push(formulaBox([
    "Opofferingskosten van 1 extra eenheid goed A:",
    "  = hoeveel eenheden goed B je moet opgeven",
    "  = (productie B) / (productie A)",
    "",
    "Comparatief voordeel: specialiseer in het goed met",
    "de LAAGSTE opofferingskosten",
    "",
    "Ruilvoet: ligt tussen de opofferingskosten van beide landen",
  ], C.dGreen));
  children.push(sp());
  children.push(p("Voorbeeld: NL maakt 100 bloemen of 50 kaas; DE maakt 60 bloemen of 40 kaas"));
  children.push(formulaBox([
    "NL: 1 bloem kost 50/100 = 0,5 kaas",
    "DE: 1 bloem kost 40/60 = 0,67 kaas",
    "\u2192 NL heeft comparatief voordeel in bloemen (lagere opofferingskosten)",
    "",
    "NL: 1 kaas kost 100/50 = 2 bloemen",
    "DE: 1 kaas kost 60/40 = 1,5 bloemen",
    "\u2192 DE heeft comparatief voordeel in kaas",
  ], C.dGreen));
  children.push(sp());

  children.push(h2("Tarief in Cournot-model (H4)", C.dGreen));
  children.push(formulaBox([
    "Tarief t op buitenlandse producent:",
    "  MK_buitenland_nieuw = MK_buitenland + t",
    "  \u2192 reactielijn buitenlander verschuift naar binnen",
    "  \u2192 binnenlands bedrijf produceert meer, buitenlands minder",
    "",
    "Effect: p\u2191, Q\u2193, CS\u2193, PS_binnenland\u2191, overheidsopbrengst\u2191",
  ], C.dGreen));
  children.push(sp());

  children.push(h2("Wisselkoersen (H4)", C.dGreen));
  children.push(formulaBox([
    "Vraag naar euro\u2019s: buitenlanders die EU-producten kopen",
    "Aanbod van euro\u2019s: Europeanen die buitenlandse producten kopen",
    "",
    "Appreciatie EUR: euro wordt duurder \u2192 export daalt, import stijgt",
    "Depreciatie EUR: euro wordt goedkoper \u2192 export stijgt, import daalt",
  ], C.dGreen));

  // ══════════════════════════════════════════════════════════════
  // SECTION 4: VERGELIJKINGSTABELLEN
  // ══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(h1("Vergelijkingstabellen"));
  children.push(sp());

  children.push(h2("Marktvormen vergeleken", C.dBlue));
  children.push(comparisonTable(
    ["Kenmerk", "Volkomen conc.", "Mon. conc.", "Oligopolie", "Monopolie"],
    [
      ["Aanbieders", "Zeer veel", "Veel", "Enkele", "E\u00E9n"],
      ["Product", "Homogeen", "Heterogeen", "Hom. of het.", "Uniek"],
      ["Toetreding", "Vrij", "Vrij", "Beperkt", "Geblokkeerd"],
      ["Prijszetting", "Prijsnemer", "Beperkte macht", "Strategisch", "Prijszetter"],
      ["MO", "MO = p", "MO < p (dalend)", "Afhankelijk model", "MO = 2\u00D7 helling vraaglijn"],
      ["Winst KT", "Mogelijk", "Mogelijk", "Mogelijk", "Mogelijk"],
      ["Winst LT", "Nul", "Nul", "Mogelijk", "Mogelijk"],
      ["CS", "Maximaal", "Lager", "Lager", "Laagst"],
      ["Effici\u00EBntie", "Allocatief + productief", "Geen van beide op LT", "Beperkt", "Geen van beide"],
    ]
  ));
  children.push(sp(200));

  children.push(h2("Overheidsinstrumenten vergeleken", C.dAmber));
  children.push(comparisonTable(
    ["Kenmerk", "Belasting", "Subsidie", "Max.prijs", "Min.prijs"],
    [
      ["Verschuiving", "Aanbod omhoog", "Aanbod omlaag", "Geen (prijsgrens)", "Geen (prijsgrens)"],
      ["Prijs", "Stijgt", "Daalt", "Onder p*", "Boven p*"],
      ["Hoeveelheid", "Daalt", "Stijgt", "Daalt (tekort)", "Daalt (overschot)"],
      ["CS", "Daalt", "Stijgt", "Onduidelijk", "Daalt"],
      ["PS", "Daalt", "Stijgt", "Daalt", "Onduidelijk"],
      ["Welvaartsverlies", "Ja (driehoek)", "Ja (overproductie)", "Ja (tekort)", "Ja (overschot)"],
      ["Overheidsbudget", "Inkomsten", "Uitgaven", "Neutraal", "Neutraal"],
    ]
  ));
  children.push(sp(200));

  children.push(h2("Soorten goederen vergeleken", C.dAmber));
  children.push(comparisonTable(
    ["Kenmerk", "Collectief goed", "Quasi-collectief", "Privaat goed"],
    [
      ["Uitsluitbaar?", "Nee", "Ja (soms deels)", "Ja"],
      ["Rivaliserend?", "Nee", "Nee (tot capaciteit)", "Ja"],
      ["Freerider?", "Ja", "Nee (toegang afdwingbaar)", "Nee"],
      ["Productie door", "Overheid", "Overheid of markt", "Markt"],
      ["Voorbeeld", "Dijkbescherming", "Bioscoop, snelweg", "Brood, fiets"],
    ]
  ));
  children.push(sp(200));

  children.push(h2("Inter- vs. intra-industri\u00EBle handel", C.dGreen));
  children.push(comparisonTable(
    ["Kenmerk", "Inter-industri\u00EBle handel", "Intra-industri\u00EBle handel"],
    [
      ["Wat wordt verhandeld?", "Verschillende producten", "Dezelfde soort producten"],
      ["Verklaring", "Comparatief voordeel", "Schaalvoordelen + productdifferentiatie"],
      ["Voorbeeld", "NL bloemen \u2194 FR wijn", "NL exporteert \u00E9n importeert auto\u2019s"],
      ["Landen", "Vaak ongelijksoortig", "Vaak gelijksoortig (bijv. EU-landen)"],
      ["Model", "Ricardo (opofferingskosten)", "Krugman (schaalvoordelen)"],
    ]
  ));

  // ══════════════════════════════════════════════════════════════
  // SECTION 5: REDENEERSCHEMA'S
  // ══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(h1("Redeneerschema\u2019s"));
  children.push(p("De belangrijkste oorzaak-gevolgketens die je moet kunnen opbouwen:"));
  children.push(sp());

  children.push(h2("H1: Meer concurrentie \u2192 lagere prijs", C.dTeal));
  children.push(reasoningBox([
    "Meer aanbieders treden toe tot de markt",
    "\u2192 doordat toetredingsdrempels laag zijn",
    "\u2192 waardoor de concurrentie toeneemt",
    "\u2192 waardoor aanbieders klanten proberen te winnen met lagere prijzen",
    "\u2192 waardoor de prijs daalt richting de evenwichtsprijs",
  ], C.dTeal));
  children.push(sp());

  children.push(h2("H2: Winst = nul op lange termijn (volkomen conc.)", C.dBlue));
  children.push(reasoningBox([
    "Bedrijven maken winst op korte termijn (p > GTK)",
    "\u2192 doordat winst nieuwe aanbieders aantrekt",
    "\u2192 waardoor het aanbod toeneemt",
    "\u2192 waardoor de marktprijs daalt",
    "\u2192 totdat p = GTK\u2098\u1d62\u2099 en de winst nul is",
  ], C.dBlue));
  children.push(sp());

  children.push(h2("H2: Monopolie \u2192 welvaartsverlies", C.dBlue));
  children.push(reasoningBox([
    "De monopolist produceert waar MO = MK",
    "\u2192 doordat dit de winstmaximaliserende hoeveelheid is",
    "\u2192 waardoor Q_monopolie < Q_volkomen concurrentie",
    "\u2192 waardoor p_monopolie > p_volkomen concurrentie",
    "\u2192 waardoor CS daalt en er een welvaartsverlies ontstaat (driehoek)",
  ], C.dBlue));
  children.push(sp());

  children.push(h2("H3: Belasting \u2192 hogere prijs, minder handel", C.dAmber));
  children.push(reasoningBox([
    "De overheid legt een belasting t per eenheid op aan producenten",
    "\u2192 doordat productiekosten stijgen met t per eenheid",
    "\u2192 waardoor de aanbodlijn t omhoog verschuift",
    "\u2192 waardoor de evenwichtsprijs stijgt en de evenwichtshoeveelheid daalt",
    "\u2192 waardoor CS en PS dalen en er een welvaartsverlies ontstaat",
  ], C.dAmber));
  children.push(sp());

  children.push(h2("H3: Negatief extern effect \u2192 overheidsingrijpen", C.dAmber));
  children.push(reasoningBox([
    "Een fabriek vervuilt de lucht (negatief extern effect)",
    "\u2192 doordat de vervuilingskosten niet in de marktprijs zitten",
    "\u2192 waardoor de maatschappelijke kosten hoger zijn dan de private kosten",
    "\u2192 waardoor er vanuit maatschappelijk oogpunt te veel wordt geproduceerd",
    "\u2192 waardoor de overheid ingrijpt (bijv. belasting op vervuiling)",
  ], C.dAmber));
  children.push(sp());

  children.push(h2("H4: Comparatief voordeel \u2192 handel loont", C.dGreen));
  children.push(reasoningBox([
    "Twee landen hebben verschillende opofferingskosten",
    "\u2192 doordat hun productiemogelijkheden verschillen",
    "\u2192 waardoor elk land een comparatief voordeel heeft in \u00E9\u00E9n goed",
    "\u2192 waardoor specialisatie en handel de totale productie verhoogt",
    "\u2192 waardoor beide landen er op vooruit gaan (mits gunstige ruilvoet)",
  ], C.dGreen));
  children.push(sp());

  children.push(h2("H4: Invoerrecht \u2192 bescherming binnenland", C.dGreen));
  children.push(reasoningBox([
    "De overheid legt een tarief t op ge\u00EFmporteerde producten",
    "\u2192 doordat de MK van de buitenlandse producent stijgt met t",
    "\u2192 waardoor de buitenlander minder produceert (reactielijn verschuift)",
    "\u2192 waardoor het binnenlandse bedrijf meer produceert",
    "\u2192 waardoor de prijs stijgt en het consumentensurplus daalt",
  ], C.dGreen));
  children.push(sp());

  children.push(h2("H4: Appreciatie \u2192 effect op handel", C.dGreen));
  children.push(reasoningBox([
    "De euro apprecieert (wordt meer waard)",
    "\u2192 doordat Europese producten in dollars duurder worden",
    "\u2192 waardoor de vraag naar EU-export daalt",
    "\u2192 tegelijkertijd worden buitenlandse producten in euro\u2019s goedkoper",
    "\u2192 waardoor de import stijgt",
    "\u2192 waardoor de handelsbalans verslechtert",
  ], C.dGreen));

  // ══════════════════════════════════════════════════════════════
  // SECTION 6: VEELGEMAAKTE FOUTEN
  // ══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(h1("Veelgemaakte fouten"));
  children.push(p("De meest voorkomende fouten per hoofdstuk. Leer ze herkennen en vermijden."));
  children.push(sp());

  children.push(h2("H1 Markten", C.dTeal));
  children.push(errorBox(
    "\"Oligopolie = veel aanbieders\"",
    "Oligopolie = ENKELE aanbieders. Veel aanbieders + heterogeen product = monopolistische concurrentie."
  ));
  children.push(sp(60));
  children.push(errorBox(
    "\"Een monopolist kan elke prijs vragen die hij wil\"",
    "Een monopolist kiest de prijs die de winst maximaliseert. De vraaglijn bepaalt hoeveel hij verkoopt bij elke prijs."
  ));
  children.push(sp(120));

  children.push(h2("H2 Marktvormen", C.dBlue));
  children.push(errorBox(
    "\"Bij een monopolie is MO = p\"",
    "Alleen bij volkomen concurrentie is MO = p. Bij een monopolie heeft MO 2\u00D7 de helling van de vraaglijn."
  ));
  children.push(sp(60));
  children.push(errorBox(
    "\"Winst = TO \u2212 TK = p \u00D7 Q \u2212 kosten per stuk\"",
    "Winst = (p* \u2212 GTK*) \u00D7 Q*. De kosten per stuk = GTK, niet TK. Vergeet de vaste kosten niet!"
  ));
  children.push(sp(60));
  children.push(errorBox(
    "\"CS = (max.prijs \u2212 p) \u00D7 Q\"",
    "CS = \u00BD \u00D7 (max.prijs \u2212 p*) \u00D7 Q*. Vergeet de \u00BD niet \u2014 het is een driehoek, geen rechthoek!"
  ));
  children.push(sp(60));
  children.push(errorBox(
    "\"De aanbodfunctie van een monopolist is het stijgende deel van MK\"",
    "Een monopolist heeft GEEN aanbodfunctie. Alleen bij volkomen concurrentie is de aanbodfunctie = MK boven GTK."
  ));
  children.push(sp(120));

  children.push(h2("H3 Overheid", C.dAmber));
  children.push(errorBox(
    "\"Een maximumprijs ligt boven de evenwichtsprijs\"",
    "Een maximumprijs ligt ONDER de evenwichtsprijs (anders heeft hij geen effect). Een MINIMUMprijs ligt erboven."
  ));
  children.push(sp(60));
  children.push(errorBox(
    "\"Bij een belasting verschuift de vraaglijn\"",
    "Bij een belasting op producenten verschuift de AANBODLIJN omhoog. De vraaglijn blijft hetzelfde."
  ));
  children.push(sp(60));
  children.push(errorBox(
    "\"Niet-rivaliserend = niemand kan het gebruiken\"",
    "Niet-rivaliserend = gebruik door de een gaat NIET ten koste van de ander. Iedereen kan het tegelijk gebruiken."
  ));
  children.push(sp(120));

  children.push(h2("H4 Internationaal", C.dGreen));
  children.push(errorBox(
    "\"Absoluut voordeel = comparatief voordeel\"",
    "Een land kan absoluut voordeel hebben in alles, maar comparatief voordeel is relatief (opofferingskosten). Handel is altijd voordelig bij comparatief voordeel."
  ));
  children.push(sp(60));
  children.push(errorBox(
    "\"Als een land overal beter in is, heeft handel geen zin\"",
    "Handel is ALTIJD voordelig zolang de opofferingskosten verschillen (comparatief voordeel). Zelfs als \u00E9\u00E9n land alles beter kan."
  ));
  children.push(sp(60));
  children.push(errorBox(
    "\"Appreciatie van de euro is goed voor de export\"",
    "Appreciatie maakt de euro DUURDER. Dat is SLECHT voor de export (producten worden duurder voor buitenlanders) maar goed voor de import."
  ));
  children.push(sp(60));
  children.push(errorBox(
    "\"Een invoerrecht beschermt de consument\"",
    "Een invoerrecht beschermt de BINNENLANDSE PRODUCENT (hogere prijs, meer productie). De consument betaalt juist meer."
  ));

  // ══════════════════════════════════════════════════════════════
  // SECTION 7: CHECKLIST TOETSVOORBEREIDING
  // ══════════════════════════════════════════════════════════════
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(h1("Checklist toetsvoorbereiding"));
  children.push(p("Vink af wat je beheerst. Waar je twijfelt, ga terug naar het betreffende hoofdstuk."));
  children.push(sp());

  children.push(h2("Begrippen (kennen)", C.navy));
  children.push(checklistItem("Ik kan de vier marktvormen benoemen en hun kenmerken uitleggen"));
  children.push(checklistItem("Ik kan het verschil tussen homogeen en heterogeen product uitleggen"));
  children.push(checklistItem("Ik kan MO, MK, GTK, TO en TK defini\u00EBren en hun onderlinge relatie uitleggen"));
  children.push(checklistItem("Ik kan CS, PS, TS en welvaartsverlies defini\u00EBren"));
  children.push(checklistItem("Ik kan uitleggen wat marktfalen is en drie vormen noemen"));
  children.push(checklistItem("Ik kan het verschil uitleggen tussen collectieve, quasi-collectieve en private goederen"));
  children.push(checklistItem("Ik kan absoluut en comparatief voordeel uitleggen"));
  children.push(checklistItem("Ik kan het verschil uitleggen tussen inter- en intra-industri\u00EBle handel"));
  children.push(checklistItem("Ik kan appreciatie en depreciatie uitleggen en hun gevolgen voor handel"));
  children.push(sp());

  children.push(h2("Berekeningen (kunnen)", C.navy));
  children.push(checklistItem("Ik kan het marktevenwicht berekenen (Qv = Qa)"));
  children.push(checklistItem("Ik kan MO afleiden uit een vraaglijn (dubbele helling)"));
  children.push(checklistItem("Ik kan MK en GTK afleiden uit een kostenfunctie"));
  children.push(checklistItem("Ik kan de winstmaximaliserende Q* en p* berekenen voor elke marktvorm"));
  children.push(checklistItem("Ik kan de winst berekenen: Winst = (p* \u2212 GTK*) \u00D7 Q*"));
  children.push(checklistItem("Ik kan reactielijnen opstellen en het Cournot-evenwicht berekenen"));
  children.push(checklistItem("Ik kan CS en PS berekenen met de driehoeksformule"));
  children.push(checklistItem("Ik kan het effect van een belasting/subsidie op evenwichtsprijs en -hoeveelheid berekenen"));
  children.push(checklistItem("Ik kan opofferingskosten berekenen en comparatief voordeel bepalen"));
  children.push(checklistItem("Ik kan het effect van een tarief in het Cournot-model berekenen"));
  children.push(sp());

  children.push(h2("Redeneren (analyseren)", C.navy));
  children.push(checklistItem("Ik kan uitleggen waarom winst op LT nul is bij volkomen en monopolistische concurrentie"));
  children.push(checklistItem("Ik kan uitleggen waarom monopolie leidt tot welvaartsverlies"));
  children.push(checklistItem("Ik kan uitleggen hoe een belasting de welvaart be\u00EFnvloedt"));
  children.push(checklistItem("Ik kan het freerider-probleem uitleggen bij collectieve goederen"));
  children.push(checklistItem("Ik kan een causale keten opbouwen met signaalwoorden (doordat, waardoor, hierdoor)"));
  children.push(checklistItem("Ik kan uitleggen waarom handel loont bij comparatief voordeel"));
  children.push(checklistItem("Ik kan het effect van een tarief analyseren op prijs, hoeveelheid en surplus"));
  children.push(checklistItem("Ik kan uitleggen hoe wisselkoersveranderingen de handelsbalans be\u00EFnvloeden"));
  children.push(sp());

  children.push(h2("Grafieken (tekenen/interpreteren)", C.navy));
  children.push(checklistItem("Ik kan een V/A-diagram tekenen en het evenwicht aanwijzen"));
  children.push(checklistItem("Ik kan MO, MK en GTK in \u00E9\u00E9n grafiek tekenen voor een monopolist"));
  children.push(checklistItem("Ik kan CS en PS als oppervlakten aanwijzen in een grafiek"));
  children.push(checklistItem("Ik kan het effect van een belasting/subsidie/max.prijs/min.prijs tekenen"));
  children.push(checklistItem("Ik kan de wisselkoersmarkt tekenen (vraag/aanbod van euro\u2019s)"));
  children.push(checklistItem("Ik kan het welvaartsverlies als driehoek aanwijzen"));

  // ── BUILD ──
  const doc = new Document({
    styles: DOC_STYLES,
    numbering: { config: [CHECKLIST_NUMBERING] },
    sections: [{
      properties: { page: PAGE },
      headers: { default: makeHeader("Module 3 \u2013 Markt en overheid \u2013 Samenvatting") },
      footers: { default: makeFooter() },
      children,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = "C:/Projects/4veco/3. Module 3 - Markt en overheid/3.5 Hoofdstuk 5 - Afsluiting/3.5 Afsluiting \u2013 samenvatting.docx";
  fs.writeFileSync(outPath, buffer);
  console.log(`Written: ${outPath} (${(buffer.length/1024).toFixed(0)} KB)`);
}

build().catch(err => { console.error(err); process.exit(1); });
