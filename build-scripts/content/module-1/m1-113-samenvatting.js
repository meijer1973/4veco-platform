/**
 * Module 1, §1.1.3 Toepassen — Samenvatting (infographic)
 * Table-based infographic. 6 cells covering all H1 concepts.
 * Based on m1-112-samenvatting.js
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-113-samenvatting.js
 */
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, ImageRun,
} = require("docx");

const PAGE = { size: { width: 11906, height: 16838 }, margin: { top: 720, right: 720, bottom: 720, left: 720 } };
const CW = 10466;
const halfW = Math.floor((CW - 200) / 2);

const C = {
  teal: "17A2B8", tealLt: "E8F8FB", tealDk: "117A8B",
  amber: "E67E22", amberLt: "FEF5E7", amberDk: "BA6A1C",
  green: "1E8449", greenLt: "E8F8F0", greenDk: "186A3B",
  navy: "1E2761", white: "FFFFFF", dark: "2D3748", gray: "718096",
  lightGray: "F7F8FA", red: "D9534F", lightRed: "FDE8E8",
};

const noBorder = {
  top: { style: BorderStyle.NONE, size: 0, color: C.white },
  bottom: { style: BorderStyle.NONE, size: 0, color: C.white },
  left: { style: BorderStyle.NONE, size: 0, color: C.white },
  right: { style: BorderStyle.NONE, size: 0, color: C.white },
};

function colorBorder(color) {
  return { top: { style: BorderStyle.SINGLE, size: 1, color }, bottom: { style: BorderStyle.SINGLE, size: 1, color }, left: { style: BorderStyle.SINGLE, size: 1, color }, right: { style: BorderStyle.SINGLE, size: 1, color } };
}

const sp = (after = 60) => new Paragraph({ spacing: { after }, children: [] });

function titleBanner(number, title, subtitle) {
  return new Table({
    width: { size: CW, type: WidthType.DXA }, columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: colorBorder(C.teal),
      shading: { fill: C.teal, type: ShadingType.CLEAR },
      margins: { top: 160, bottom: 160, left: 300, right: 300 },
      width: { size: CW, type: WidthType.DXA },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: `${number}  `, font: "Arial", size: 36, color: C.amberLt, bold: true }),
          new TextRun({ text: title, font: "Arial", size: 36, color: C.white, bold: true }),
        ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 }, children: [new TextRun({ text: subtitle, font: "Arial", size: 22, color: C.tealLt, italics: true })] }),
      ],
    })] })],
  });
}

function sectionHeader(emoji, title, subtitle, color) {
  return new Table({
    width: { size: CW, type: WidthType.DXA }, columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: { ...noBorder, bottom: { style: BorderStyle.SINGLE, size: 4, color } },
      margins: { top: 40, bottom: 60, left: 100, right: 100 },
      width: { size: CW, type: WidthType.DXA },
      children: [new Paragraph({ children: [
        new TextRun({ text: `${emoji}  `, font: "Arial", size: 24 }),
        new TextRun({ text: title, font: "Arial", size: 24, bold: true, color }),
        new TextRun({ text: `   \u2014   ${subtitle}`, font: "Arial", size: 20, color: C.gray }),
      ] })],
    })] })],
  });
}

function colorCard(titleText, bullets, accentColor, bgColor, darkColor) {
  const children = [
    new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 50 }, children: [new TextRun({ text: titleText, font: "Arial", size: 21, bold: true, color: darkColor })] }),
  ];
  for (const b of bullets) {
    children.push(new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 20 }, children: [new TextRun({ text: `\u2022  ${b}`, font: "Arial", size: 18, color: C.dark })] }));
  }
  return new TableCell({
    borders: { top: { style: BorderStyle.SINGLE, size: 6, color: accentColor }, bottom: { style: BorderStyle.SINGLE, size: 1, color: bgColor }, left: { style: BorderStyle.SINGLE, size: 1, color: bgColor }, right: { style: BorderStyle.SINGLE, size: 1, color: bgColor } },
    shading: { fill: bgColor, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    width: { size: halfW, type: WidthType.DXA },
    children,
  });
}

function spacerCell(width = 200) {
  return new TableCell({ borders: noBorder, width: { size: width, type: WidthType.DXA }, children: [sp(0)] });
}

function fullWidthCard(content, accentColor, bgColor) {
  return new Table({
    width: { size: CW, type: WidthType.DXA }, columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: { style: BorderStyle.SINGLE, size: 6, color: accentColor }, bottom: { style: BorderStyle.SINGLE, size: 1, color: bgColor }, left: { style: BorderStyle.SINGLE, size: 1, color: bgColor }, right: { style: BorderStyle.SINGLE, size: 1, color: bgColor } },
      shading: { fill: bgColor, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 200, right: 200 },
      width: { size: CW, type: WidthType.DXA },
      children: content,
    })] })],
  });
}

const SAMENV_OUT_DIR = "C:\\Projects\\4veco\\module one claude\\1.1 Hoofdstuk 1 - Voor niks gaat de zon op\\1.1.3 Paragraaf 3 - Toepassen\\2. Leren";

function embedAssetImage(filename, width, height) {
  const assetsDir = path.resolve(SAMENV_OUT_DIR, '..', '_assets');
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

async function build() {
  const children = [];

  children.push(titleBanner("1.1.3", "Toepassen", "Alles komt samen \u2014 schaarste, opofferingskosten, budgetlijnen en arbeidsmarkt"));
  children.push(sp(80));

  // -- Schaarste (teal) --
  children.push(sectionHeader("\uD83D\uDD11", "Schaarste", "Het fundament van de economie", C.teal));
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA }, columnWidths: [halfW, 200, halfW],
    rows: [new TableRow({ children: [
      colorCard("Schaarste definitie", [
        "Middelen zijn beperkt t.o.v. behoeften",
        "Niet alleen geld: ook tijd, water, grondstoffen",
        "Gevolg: je moet altijd kiezen",
        "Signaalwoorden: beperkt, tekort, verdelen",
      ], C.teal, C.tealLt, C.tealDk),
      spacerCell(),
      colorCard("Behoeften en middelen", [
        "Behoeften: wensen die je wilt vervullen (onbeperkt)",
        "Middelen: geld, tijd, grondstoffen (beperkt)",
        "Schaarste = behoeften > middelen",
        "Geldt voor consumenten, bedrijven en overheid",
      ], C.teal, C.tealLt, C.tealDk),
    ] })],
  }));

  // ── Embedded image: schaarste-samenhang ──
  const imgSchaarste = embedAssetImage('schaarste-samenhang', 500, 250);
  if (imgSchaarste) children.push(imgSchaarste);

  children.push(sp(80));

  // -- Opofferingskosten (amber) --
  children.push(sectionHeader("\uD83D\uDCB0", "Opofferingskosten", "De prijs van elke keuze", C.amber));
  children.push(fullWidthCard([
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
      new TextRun({ text: "Kernformule", font: "Arial", size: 20, bold: true, color: C.amberDk }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [
      new TextRun({ text: "Opofferingskosten = waarde beste gemiste alternatief", font: "Consolas", size: 22, bold: true, color: C.dark }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [
      new TextRun({ text: "Vergelijk alleen met het BESTE alternatief, niet met alle alternatieven", font: "Arial", size: 19, color: C.gray }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [
      new TextRun({ text: "Nettobaten:", font: "Arial", size: 19, bold: true, color: C.amberDk }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "Nettobaten = totale baten \u2212 totale kosten", font: "Consolas", size: 19, color: C.dark }),
    ] }),
  ], C.amber, C.amberLt));
  children.push(sp(80));

  // -- Budgetlijn (green) --
  children.push(sectionHeader("\u2705", "Budgetlijn en verschuivingen", "Haalbare combinaties en veranderingen", C.green));
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA }, columnWidths: [halfW, 200, halfW],
    rows: [new TableRow({ children: [
      colorCard("Budgetlijn en -vergelijking", [
        "B = p\u2081 \u00D7 q\u2081 + p\u2082 \u00D7 q\u2082",
        "x-snijpunt: q\u2081\u1D50\u1D43\u02E3 = B / p\u2081",
        "y-snijpunt: q\u2082\u1D50\u1D43\u02E3 = B / p\u2082",
        "Helling = \u2212p\u2081/p\u2082 (ruilvoet)",
        "Op de lijn: budget precies op",
      ], C.green, C.greenLt, C.greenDk),
      spacerCell(),
      colorCard("Verschuivingen", [
        "Budget verandert \u2192 evenwijdige verschuiving",
        "E\u00e9n prijs verandert \u2192 kanteling",
        "Beide veranderen \u2192 gecombineerd effect",
        "Bereken altijd de nieuwe snijpunten!",
        "Teken oude en nieuwe lijn in \u00e9\u00e9n grafiek",
      ], C.green, C.greenLt, C.greenDk),
    ] })],
  }));

  // ── Embedded image: budgetlijn-gecombineerd ──
  const imgBudget = embedAssetImage('budgetlijn-gecombineerd', 500, 250);
  if (imgBudget) children.push(imgBudget);

  children.push(sp(80));

  // -- Arbeidsmarkt (teal) --
  children.push(sectionHeader("\u23F0", "Arbeidsmarkt en vrije tijd", "De budgetlijn bij arbeid", C.teal));
  children.push(fullWidthCard([
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
      new TextRun({ text: "Kernregel", font: "Arial", size: 20, bold: true, color: C.tealDk }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [
      new TextRun({ text: "Opofferingskosten van 1 uur vrije tijd = uurloon", font: "Consolas", size: 19, bold: true, color: C.dark }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [
      new TextRun({ text: "X-as: vrije tijd (uren)  |  Y-as: inkomen (\u20AC)", font: "Consolas", size: 18, color: C.gray }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "Hoger uurloon \u2192 budgetlijn kantelt omhoog \u2192 vrije tijd wordt duurder", font: "Consolas", size: 18, color: C.teal }),
    ] }),
  ], C.teal, C.tealLt));
  children.push(sp(80));

  // -- Toepassingsstrategie (amber) --
  children.push(sectionHeader("\uD83D\uDCDD", "Toepassingsstrategie", "Hoe pas je begrippen toe?", C.amber));
  children.push(fullWidthCard([
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "Drieslag: ", font: "Arial", size: 20, bold: true, color: C.amberDk }),
      new TextRun({ text: "Begrip \u2192 Definitie \u2192 Toepassing op casus", font: "Arial", size: 20, color: C.dark }),
    ] }),
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "1. ", font: "Arial", size: 19, bold: true, color: C.amberDk }),
      new TextRun({ text: "Noem het begrip (schaarste, opofferingskosten, budgetlijn...)", font: "Arial", size: 19, color: C.dark }),
    ] }),
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "2. ", font: "Arial", size: 19, bold: true, color: C.amberDk }),
      new TextRun({ text: "Geef de definitie in eigen woorden", font: "Arial", size: 19, color: C.dark }),
    ] }),
    new Paragraph({ children: [
      new TextRun({ text: "3. ", font: "Arial", size: 19, bold: true, color: C.amberDk }),
      new TextRun({ text: "Koppel aan concrete feiten/cijfers uit de casus", font: "Arial", size: 19, color: C.dark }),
    ] }),
  ], C.amber, C.amberLt));
  children.push(sp(80));

  // -- Veelgemaakte fouten (red) --
  children.push(sectionHeader("\u26A0\uFE0F", "Veelgemaakte fouten", "Vermijd deze valkuilen", C.red));
  children.push(fullWidthCard([
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "\u2718  ", font: "Arial", size: 20, color: C.red, bold: true }),
      new TextRun({ text: "Schaarste = zeldzaamheid: ", font: "Arial", size: 19, bold: true, color: C.dark }),
      new TextRun({ text: "Schaarste gaat over de verhouding middelen vs. behoeften, niet over hoe zeldzaam iets is", font: "Arial", size: 19, color: C.dark }),
    ] }),
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "\u2718  ", font: "Arial", size: 20, color: C.red, bold: true }),
      new TextRun({ text: "Alle alternatieven optellen: ", font: "Arial", size: 19, bold: true, color: C.dark }),
      new TextRun({ text: "Opofferingskosten = alleen het BESTE alternatief", font: "Arial", size: 19, color: C.dark }),
    ] }),
    new Paragraph({ children: [
      new TextRun({ text: "\u2718  ", font: "Arial", size: 20, color: C.red, bold: true }),
      new TextRun({ text: "Verschuiving en kanteling verwarren: ", font: "Arial", size: 19, bold: true, color: C.dark }),
      new TextRun({ text: "Budget verandert = evenwijdig, prijs verandert = kanteling", font: "Arial", size: 19, color: C.dark }),
    ] }),
  ], C.red, C.lightRed));

  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
    sections: [{ properties: { page: PAGE }, children }],
  });

  const outPath = "C:/Projects/4veco/module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.3 Paragraaf 3 - Toepassen/2. Leren/1.1.3 Toepassen \u2013 samenvatting.docx";
  const buf = await Packer.toBuffer(doc);
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, buf);
  console.log(`SUCCESS: ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
}

build().catch(err => { console.error(err); process.exit(1); });
