/**
 * Samenvatting rebuild for 3.5.1 Afsluiting and 3.5.2 Naar het examen
 * Table-based infographic layout matching build-infographic-311.js pattern.
 *
 * HOW TO ADAPT
 * ════════════
 * 1. Copy this script
 * 2. Change the content sections below the ════ lines
 * 3. Update OUTPUT_DIR and file names
 * 4. Run: NODE_PATH="$(npm root -g)" node samenvatting-351-352-rebuild.js
 */
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType,
} = require("docx");

// ── PAGE SETUP ──
const PAGE = {
  size: { width: 11906, height: 16838 },
  margin: { top: 720, right: 720, bottom: 720, left: 720 },
};
const CW = 10466;
const halfW = Math.floor((CW - 200) / 2);
const quarterW = Math.floor((CW - 300) / 4);

// ── COLORS ──
const C = {
  // Chapter 5 accent
  purple:     "7D3C98",
  purpleLt:   "F4ECF7",
  purpleDk:   "6C3483",
  // Chapter colors (for 3.5.1 per-chapter sections)
  teal:       "117A65",
  tealLt:     "E8F6F3",
  tealDk:     "0E6655",
  blue:       "1A5276",
  blueLt:     "EBF5FB",
  blueDk:     "154360",
  amber:      "E67E22",
  amberLt:    "FEF5E7",
  amberDk:    "BA6A1C",
  green:      "1E8449",
  greenLt:    "E8F8F0",
  greenDk:    "186A3B",
  // Neutral
  navy:       "1E2761",
  white:      "FFFFFF",
  dark:       "2D3748",
  gray:       "718096",
  lightGray:  "F7F8FA",
  red:        "D9534F",
  lightRed:   "FDE8E8",
};

const noBorder = {
  top: { style: BorderStyle.NONE, size: 0, color: C.white },
  bottom: { style: BorderStyle.NONE, size: 0, color: C.white },
  left: { style: BorderStyle.NONE, size: 0, color: C.white },
  right: { style: BorderStyle.NONE, size: 0, color: C.white },
};

function colorBorder(color) {
  return {
    top: { style: BorderStyle.SINGLE, size: 1, color },
    bottom: { style: BorderStyle.SINGLE, size: 1, color },
    left: { style: BorderStyle.SINGLE, size: 1, color },
    right: { style: BorderStyle.SINGLE, size: 1, color },
  };
}

const sp = (after = 60) => new Paragraph({ spacing: { after }, children: [] });

// ── HELPER: Title banner ──
function titleBanner(number, title, subtitle) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: colorBorder(C.purple),
      shading: { fill: C.purple, type: ShadingType.CLEAR },
      margins: { top: 160, bottom: 160, left: 300, right: 300 },
      width: { size: CW, type: WidthType.DXA },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: `${number}  `, font: "Arial", size: 36, color: C.amberLt, bold: true }),
            new TextRun({ text: title, font: "Arial", size: 36, color: C.white, bold: true }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { before: 60 },
          children: [new TextRun({ text: subtitle, font: "Arial", size: 22, color: C.purpleLt, italics: true })],
        }),
      ],
    })] })],
  });
}

// ── HELPER: Section header with colored underline ──
function sectionHeader(emoji, title, subtitle, color) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: { ...noBorder, bottom: { style: BorderStyle.SINGLE, size: 4, color } },
        margins: { top: 40, bottom: 60, left: 100, right: 100 },
        width: { size: CW, type: WidthType.DXA },
        children: [new Paragraph({
          children: [
            new TextRun({ text: `${emoji}  `, font: "Arial", size: 24 }),
            new TextRun({ text: title, font: "Arial", size: 24, bold: true, color }),
            new TextRun({ text: `   \u2014   ${subtitle}`, font: "Arial", size: 20, color: C.gray }),
          ],
        })],
      }),
    ] })],
  });
}

// ── HELPER: Colored card ──
function colorCard(titleText, bullets, accentColor, bgColor, darkColor) {
  const children = [
    new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 50 }, children: [
      new TextRun({ text: titleText, font: "Arial", size: 21, bold: true, color: darkColor }),
    ]}),
  ];
  for (const b of bullets) {
    children.push(new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 20 }, children: [
      new TextRun({ text: `\u2022  ${b}`, font: "Arial", size: 18, color: C.dark }),
    ]}));
  }
  return new TableCell({
    borders: { top: { style: BorderStyle.SINGLE, size: 6, color: accentColor }, bottom: { style: BorderStyle.SINGLE, size: 1, color: bgColor }, left: { style: BorderStyle.SINGLE, size: 1, color: bgColor }, right: { style: BorderStyle.SINGLE, size: 1, color: bgColor } },
    shading: { fill: bgColor, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    width: { size: halfW, type: WidthType.DXA },
    children,
  });
}

// ── HELPER: Spacer cell ──
function spacerCell(width = 200) {
  return new TableCell({
    borders: noBorder,
    width: { size: width, type: WidthType.DXA },
    children: [sp(0)],
  });
}

// ── HELPER: Full-width card ──
function fullWidthCard(content, accentColor, bgColor) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: { style: BorderStyle.SINGLE, size: 6, color: accentColor }, bottom: { style: BorderStyle.SINGLE, size: 1, color: bgColor }, left: { style: BorderStyle.SINGLE, size: 1, color: bgColor }, right: { style: BorderStyle.SINGLE, size: 1, color: bgColor } },
      shading: { fill: bgColor, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 200, right: 200 },
      width: { size: CW, type: WidthType.DXA },
      children: content,
    })] })],
  });
}

// ════════════════════════════════════════════════════════════════════
//  3.5.1  AFSLUITING — Module 3 overzicht
// ════════════════════════════════════════════════════════════════════

async function build351() {
  const children = [];

  // Title banner
  children.push(titleBanner("3.5.1", "Afsluiting", "Module 3 \u2014 Markt en overheid in \u00e9\u00e9n overzicht"));
  children.push(sp(80));

  // ── H1: Markten (teal) ──
  children.push(sectionHeader("\uD83C\uDFEA", "H1 \u2013 Markten", "Hoe werken markten?", C.teal));
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [halfW, 200, halfW],
    rows: [new TableRow({ children: [
      colorCard("Marktstructuur", [
        "Concrete vs. abstracte markt",
        "Homogeen vs. heterogeen product",
        "Toetredingsdrempels bepalen concurrentie",
      ], C.teal, C.tealLt, C.tealDk),
      spacerCell(),
      colorCard("Vraag en aanbod", [
        "Vraaglijn: dalend (prijs \u2191 \u2192 Qv \u2193)",
        "Aanbodlijn: stijgend (prijs \u2191 \u2192 Qa \u2191)",
        "Evenwichtsprijs: Qv = Qa",
      ], C.teal, C.tealLt, C.tealDk),
    ] })],
  }));
  children.push(sp(80));

  // ── H2: Marktvormen (blue) ──
  children.push(sectionHeader("\uD83C\uDFED", "H2 \u2013 Marktvormen", "Vier marktvormen en hun evenwicht", C.blue));

  // Marktvormen comparison mini-table
  const mkCol = Math.floor(CW / 5);
  const mkCols = [mkCol, mkCol, mkCol, mkCol, mkCol];
  function mkHeader(text) {
    return new TableCell({
      borders: colorBorder(C.blue),
      shading: { fill: C.blue, type: ShadingType.CLEAR },
      margins: { top: 40, bottom: 40, left: 60, right: 60 },
      width: { size: mkCol, type: WidthType.DXA },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text, font: "Arial", size: 16, bold: true, color: C.white }),
      ]})],
    });
  }
  function mkCell(text, fill) {
    return new TableCell({
      borders: colorBorder(C.blueLt),
      shading: { fill: fill || C.white, type: ShadingType.CLEAR },
      margins: { top: 30, bottom: 30, left: 60, right: 60 },
      width: { size: mkCol, type: WidthType.DXA },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text, font: "Arial", size: 15, color: C.dark }),
      ]})],
    });
  }

  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: mkCols,
    rows: [
      new TableRow({ children: [
        mkHeader(""), mkHeader("Volkomen\nconcurrentie"), mkHeader("Monopolistische\nconcurrentie"), mkHeader("Oligopolie"), mkHeader("Monopolie"),
      ]}),
      new TableRow({ children: [
        mkHeader("Aanbieders"), mkCell("Zeer veel"), mkCell("Veel"), mkCell("Enkele"), mkCell("E\u00e9n"),
      ]}),
      new TableRow({ children: [
        mkHeader("Product"), mkCell("Homogeen", C.lightGray), mkCell("Heterogeen", C.lightGray), mkCell("Hom./het.", C.lightGray), mkCell("Uniek", C.lightGray),
      ]}),
      new TableRow({ children: [
        mkHeader("Toetreding"), mkCell("Vrij"), mkCell("Vrij"), mkCell("Hoge drempels"), mkCell("Geblokkeerd"),
      ]}),
      new TableRow({ children: [
        mkHeader("Prijszetter?"), mkCell("Nee (prijsnemer)", C.lightGray), mkCell("Beperkt"), mkCell("Ja (afgeknikt)", C.lightGray), mkCell("Ja"),
      ]}),
      new TableRow({ children: [
        mkHeader("MO = ?"), mkCell("MO = p"), mkCell("MO < p"), mkCell("MO < p"), mkCell("MO < p"),
      ]}),
    ],
  }));
  children.push(sp(80));

  // ── H3: Overheid (amber) ──
  children.push(sectionHeader("\uD83C\uDFDB\uFE0F", "H3 \u2013 Overheid", "Ingrijpen in de markt", C.amber));
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [halfW, 200, halfW],
    rows: [new TableRow({ children: [
      colorCard("Marktfalen", [
        "Externe effecten (positief/negatief)",
        "Collectieve goederen (niet-uitsluitbaar)",
        "Informatiegebreken (averechtse selectie)",
        "Marktmacht (monopolie, kartel)",
      ], C.amber, C.amberLt, C.amberDk),
      spacerCell(),
      colorCard("Overheidsinstrumenten", [
        "Belastingen & subsidies",
        "Maximumprijs / minimumprijs",
        "Mededingingsbeleid (NMa/ACM)",
        "Regulering & wetgeving",
      ], C.amber, C.amberLt, C.amberDk),
    ] })],
  }));
  children.push(sp(80));

  // ── H4: Internationale markten (green) ──
  children.push(sectionHeader("\uD83C\uDF0D", "H4 \u2013 Internationale markten", "Handel over de grens", C.green));
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [halfW, 200, halfW],
    rows: [new TableRow({ children: [
      colorCard("Vrijhandel", [
        "Comparatief voordeel \u2192 specialisatie",
        "Welvaart stijgt door ruil",
        "Consumenten: lagere prijzen, meer keuze",
      ], C.green, C.greenLt, C.greenDk),
      spacerCell(),
      colorCard("Protectie", [
        "Invoerrechten (tarief), quota, subsidies",
        "Beschermt binnenlandse producenten",
        "Welvaartsverlies (deadweight loss)",
      ], C.green, C.greenLt, C.greenDk),
    ] })],
  }));
  children.push(sp(60));

  // ── Key formulas strip ──
  children.push(fullWidthCard([
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
      new TextRun({ text: "Kernformules Module 3", font: "Arial", size: 20, bold: true, color: C.purpleDk }),
    ]}),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [
      new TextRun({ text: "TO = p \u00D7 q", font: "Consolas", size: 19, color: C.dark }),
      new TextRun({ text: "     \u2502     ", font: "Consolas", size: 19, color: C.gray }),
      new TextRun({ text: "Winst = TO \u2212 TK", font: "Consolas", size: 19, color: C.dark }),
      new TextRun({ text: "     \u2502     ", font: "Consolas", size: 19, color: C.gray }),
      new TextRun({ text: "MO = \u0394TO / \u0394q", font: "Consolas", size: 19, color: C.dark }),
      new TextRun({ text: "     \u2502     ", font: "Consolas", size: 19, color: C.gray }),
      new TextRun({ text: "MK = \u0394TK / \u0394q", font: "Consolas", size: 19, color: C.dark }),
    ]}),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "Maximale winst: MO = MK", font: "Consolas", size: 19, bold: true, color: C.purple }),
      new TextRun({ text: "     \u2502     ", font: "Consolas", size: 19, color: C.gray }),
      new TextRun({ text: "Consumentensurplus = \u00BD \u00D7 b \u00D7 h", font: "Consolas", size: 19, color: C.dark }),
    ]}),
  ], C.purple, C.purpleLt));

  return children;
}

// ════════════════════════════════════════════════════════════════════
//  3.5.2  NAAR HET EXAMEN — Examvoorbereiding
// ════════════════════════════════════════════════════════════════════

async function build352() {
  const children = [];

  // Title banner
  children.push(titleBanner("3.5.2", "Naar het examen", "Alles wat je moet weten, op \u00e9\u00e9n kaart"));
  children.push(sp(80));

  // ── FORMULAS TO KNOW ──
  children.push(sectionHeader("\uD83D\uDCDD", "Formules die je moet kennen", "Uit je hoofd, in monospace", C.purple));
  children.push(fullWidthCard([
    new Paragraph({ spacing: { after: 30 }, children: [
      new TextRun({ text: "TO  = p \u00D7 q", font: "Consolas", size: 19, color: C.dark }),
      new TextRun({ text: "                           ", font: "Consolas", size: 19 }),
      new TextRun({ text: "TK  = TCK + TVK", font: "Consolas", size: 19, color: C.dark }),
    ]}),
    new Paragraph({ spacing: { after: 30 }, children: [
      new TextRun({ text: "MO  = \u0394TO / \u0394q", font: "Consolas", size: 19, color: C.dark }),
      new TextRun({ text: "                       ", font: "Consolas", size: 19 }),
      new TextRun({ text: "MK  = \u0394TK / \u0394q", font: "Consolas", size: 19, color: C.dark }),
    ]}),
    new Paragraph({ spacing: { after: 30 }, children: [
      new TextRun({ text: "GO  = TO / q  = p (bij prijsnemer)", font: "Consolas", size: 19, color: C.dark }),
    ]}),
    new Paragraph({ spacing: { after: 30 }, children: [
      new TextRun({ text: "GTK = TK / q", font: "Consolas", size: 19, color: C.dark }),
      new TextRun({ text: "                          ", font: "Consolas", size: 19 }),
      new TextRun({ text: "GVK = TVK / q", font: "Consolas", size: 19, color: C.dark }),
    ]}),
    new Paragraph({ spacing: { after: 30 }, children: [
      new TextRun({ text: "Winst = TO \u2212 TK  =  (p \u2212 GTK) \u00D7 q", font: "Consolas", size: 19, bold: true, color: C.purple }),
    ]}),
    new Paragraph({ spacing: { after: 30 }, children: [
      new TextRun({ text: "Maximale winst: MO = MK", font: "Consolas", size: 19, bold: true, color: C.purple }),
    ]}),
    new Paragraph({ children: [
      new TextRun({ text: "Consumentensurplus = \u00BD \u00D7 basis \u00D7 hoogte", font: "Consolas", size: 19, color: C.dark }),
    ]}),
  ], C.purple, C.purpleLt));
  children.push(sp(80));

  // ── QUESTION TYPES CHECKLIST ──
  children.push(sectionHeader("\u2705", "Vraagtypen op het examen", "Herken het type, kies de juiste aanpak", C.blue));
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [halfW, 200, halfW],
    rows: [new TableRow({ children: [
      colorCard("Berekeningsvragen", [
        "Evenwichtsprijs/-hoeveelheid berekenen",
        "Winst berekenen (TO \u2212 TK)",
        "MO en MK berekenen uit tabel",
        "Effect belasting/subsidie op prijs",
        "Consumentensurplus berekenen",
      ], C.blue, C.blueLt, C.blueDk),
      spacerCell(),
      colorCard("Redeneervragen", [
        "Marktvormen herkennen + kenmerken noemen",
        "Gevolgen van toetreding/uittreding",
        "Externe effecten verklaren",
        "Voor-/nadelen vrijhandel beargumenteren",
        "Overheidsingrijpen beoordelen",
      ], C.blue, C.blueLt, C.blueDk),
    ] })],
  }));
  children.push(sp(80));

  // ── TOP MISTAKES ──
  children.push(sectionHeader("\u26A0\uFE0F", "Veelgemaakte fouten", "Vermijd deze valkuilen", C.red));
  children.push(fullWidthCard([
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "\u2718  ", font: "Arial", size: 20, color: C.red, bold: true }),
      new TextRun({ text: "MO en MK verwarren: ", font: "Arial", size: 19, bold: true, color: C.dark }),
      new TextRun({ text: "MO = extra opbrengst per eenheid, MK = extra kosten per eenheid", font: "Arial", size: 19, color: C.dark }),
    ]}),
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "\u2718  ", font: "Arial", size: 20, color: C.red, bold: true }),
      new TextRun({ text: "Prijsnemer \u2260 prijszetter: ", font: "Arial", size: 19, bold: true, color: C.dark }),
      new TextRun({ text: "Bij volkomen concurrentie is MO = p (horizontale vraaglijn)", font: "Arial", size: 19, color: C.dark }),
    ]}),
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "\u2718  ", font: "Arial", size: 20, color: C.red, bold: true }),
      new TextRun({ text: "Vergeten eenheid te noemen: ", font: "Arial", size: 19, bold: true, color: C.dark }),
      new TextRun({ text: "Altijd euro's, stuks, procenten, etc. vermelden", font: "Arial", size: 19, color: C.dark }),
    ]}),
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "\u2718  ", font: "Arial", size: 20, color: C.red, bold: true }),
      new TextRun({ text: "Break-even vs. maximale winst: ", font: "Arial", size: 19, bold: true, color: C.dark }),
      new TextRun({ text: "Break-even: TO = TK. Maximale winst: MO = MK", font: "Arial", size: 19, color: C.dark }),
    ]}),
    new Paragraph({ children: [
      new TextRun({ text: "\u2718  ", font: "Arial", size: 20, color: C.red, bold: true }),
      new TextRun({ text: "Marktvormen door elkaar halen: ", font: "Arial", size: 19, bold: true, color: C.dark }),
      new TextRun({ text: "Leer de vergelijkingstabel (aantal aanbieders + product + toetreding)", font: "Arial", size: 19, color: C.dark }),
    ]}),
  ], C.red, C.lightRed));
  children.push(sp(80));

  // ── KEY GRAPHS ──
  children.push(sectionHeader("\uD83D\uDCC8", "Grafieken die je moet kunnen tekenen", "Oefen deze tot je ze droomt", C.green));
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [halfW, 200, halfW],
    rows: [new TableRow({ children: [
      colorCard("Marktgrafieken", [
        "Vraag- en aanboddiagram met evenwicht",
        "Verschuiving V/A-lijn (oorzaak \u2192 gevolg)",
        "Consumentensurplus (driehoek boven p*)",
        "Producentensurplus (driehoek onder p*)",
        "Effect maximum-/minimumprijs",
      ], C.green, C.greenLt, C.greenDk),
      spacerCell(),
      colorCard("Bedrijfsgrafieken", [
        "MO/MK-diagram (snijpunt = max. winst)",
        "GO/GTK/GVK-kostenlijnen",
        "Winstgebied arceren (GO > GTK)",
        "Aanbodlijn = MK-lijn (boven GVK)",
        "Afgeknikt vraaglijn (oligopolie)",
      ], C.green, C.greenLt, C.greenDk),
    ] })],
  }));

  return children;
}

// ── BUILD BOTH DOCUMENTS ──
async function build() {
  const BASE = "C:/Projects/4veco/3. Module 3 - Markt en overheid/3.5 Hoofdstuk 5 - Afsluiting";

  const docs = [
    {
      children: await build351(),
      path: path.join(BASE, "3.5.1 Paragraaf 1 - Afsluiting/2. Leren/3.5.1 Afsluiting \u2013 samenvatting.docx"),
    },
    {
      children: await build352(),
      path: path.join(BASE, "3.5.2 Paragraaf 2 - Naar het examen/2. Leren/3.5.2 Naar het examen \u2013 samenvatting.docx"),
    },
  ];

  for (const { children, path: outPath } of docs) {
    const doc = new Document({
      styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
      sections: [{
        properties: { page: PAGE },
        children,
      }],
    });

    const buf = await Packer.toBuffer(doc);
    fs.writeFileSync(outPath, buf);
    console.log(`Generated: ${path.basename(outPath)} (${(buf.length / 1024).toFixed(0)} KB)`);
  }
}

build().catch(err => { console.error(err); process.exit(1); });
