/**
 * Module 1, §1.1.2 Kiezen of delen — Samenvatting (infographic)
 * Based on m1-111-samenvatting.js
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-112-samenvatting.js
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

const SAMENV_OUT_DIR = "C:\\Projects\\4veco\\module one claude\\1.1 Hoofdstuk 1 - Voor niks gaat de zon op\\1.1.2 Paragraaf 2 - Kiezen of delen\\2. Leren";

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

  children.push(titleBanner("1.1.2", "Kiezen of delen", "Budgetlijnen, budgetvergelijking en opofferingskosten"));
  children.push(sp(80));

  // -- Budgetlijn (teal) --
  children.push(sectionHeader("\uD83D\uDD11", "De budgetlijn", "Alle mogelijke combinaties bij een gegeven budget", C.teal));
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA }, columnWidths: [halfW, 200, halfW],
    rows: [new TableRow({ children: [
      colorCard("Budgetlijn definitie", [
        "Lijn die alle combinaties van twee goederen toont",
        "die je kunt kopen met je hele budget",
        "Op de lijn: budget volledig besteed",
        "Onder de lijn: budget niet volledig op",
        "Boven de lijn: niet haalbaar",
      ], C.teal, C.tealLt, C.tealDk),
      spacerCell(),
      colorCard("Tekening budgetlijn", [
        "X-as: hoeveelheid goed 1 (q\u2081)",
        "Y-as: hoeveelheid goed 2 (q\u2082)",
        "Snijpunt x-as: q\u2081\u1d50\u1d43\u02e3 = B / p\u2081",
        "Snijpunt y-as: q\u2082\u1d50\u1d43\u02e3 = B / p\u2082",
        "Rechte dalende lijn van y-snijpunt naar x-snijpunt",
      ], C.teal, C.tealLt, C.tealDk),
    ] })],
  }));

  // ── Embedded graph: budgetlijn-basis ──
  const imgBudgetLine = embedAssetImage('budgetlijn-basis', 500, 250);
  if (imgBudgetLine) children.push(imgBudgetLine);

  children.push(sp(80));

  // -- Budgetvergelijking (amber) --
  children.push(sectionHeader("\uD83D\uDCB0", "Budgetvergelijking", "De wiskundige formule achter de budgetlijn", C.amber));
  children.push(fullWidthCard([
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
      new TextRun({ text: "Kernformule", font: "Arial", size: 20, bold: true, color: C.amberDk }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [
      new TextRun({ text: "B = p\u2081 \u00D7 q\u2081 + p\u2082 \u00D7 q\u2082", font: "Consolas", size: 22, bold: true, color: C.dark }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [
      new TextRun({ text: "B = budget  |  p = prijs  |  q = hoeveelheid", font: "Consolas", size: 18, color: C.gray }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [
      new TextRun({ text: "Snijpunten berekenen:", font: "Arial", size: 19, bold: true, color: C.amberDk }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 10 }, children: [
      new TextRun({ text: "q\u2081\u1d50\u1d43\u02e3 = B / p\u2081   (alles aan goed 1)", font: "Consolas", size: 19, color: C.dark }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "q\u2082\u1d50\u1d43\u02e3 = B / p\u2082   (alles aan goed 2)", font: "Consolas", size: 19, color: C.dark }),
    ] }),
  ], C.amber, C.amberLt));
  children.push(sp(80));

  // -- Verschuivingen (green) --
  children.push(sectionHeader("\u2705", "Verschuivingen", "Wat gebeurt er als budget of prijs verandert?", C.green));
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA }, columnWidths: [halfW, 200, halfW],
    rows: [new TableRow({ children: [
      colorCard("Evenwijdige verschuiving", [
        "Oorzaak: inkomen/budget verandert",
        "Prijzen blijven gelijk",
        "Meer budget \u2192 lijn schuift naar rechts",
        "Minder budget \u2192 lijn schuift naar links",
        "Helling verandert niet",
      ], C.green, C.greenLt, C.greenDk),
      spacerCell(),
      colorCard("Kanteling (draaiing)", [
        "Oorzaak: prijs van \u00e9\u00e9n goed verandert",
        "Budget blijft gelijk",
        "Lijn draait rond het snijpunt van het andere goed",
        "Prijs goed 1 stijgt \u2192 x-snijpunt schuift naar links",
        "Prijs goed 1 daalt \u2192 x-snijpunt schuift naar rechts",
      ], C.green, C.greenLt, C.greenDk),
    ] })],
  }));
  children.push(sp(80));

  // -- Opofferingskosten vrije tijd (teal) --
  children.push(sectionHeader("\u23F0", "Opofferingskosten vrije tijd", "De budgetlijn bij arbeid en vrije tijd", C.teal));
  children.push(fullWidthCard([
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
      new TextRun({ text: "Kernregel", font: "Arial", size: 20, bold: true, color: C.tealDk }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [
      new TextRun({ text: "Opofferingskosten van 1 uur vrije tijd = uurloon", font: "Consolas", size: 19, bold: true, color: C.dark }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [
      new TextRun({ text: "Elk uur dat je niet werkt, mis je het uurloon aan inkomen", font: "Arial", size: 19, color: C.dark }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [
      new TextRun({ text: "X-as: vrije tijd (uren)  |  Y-as: inkomen (\u20AC)", font: "Consolas", size: 18, color: C.gray }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "Hoger uurloon \u2192 budgetlijn kantelt omhoog \u2192 vrije tijd wordt duurder", font: "Consolas", size: 18, color: C.teal }),
    ] }),
  ], C.teal, C.tealLt));
  children.push(sp(80));

  // -- Veelgemaakte fouten (red) --
  children.push(sectionHeader("\u26A0\uFE0F", "Veelgemaakte fouten", "Vermijd deze valkuilen", C.red));
  children.push(fullWidthCard([
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "\u2718  ", font: "Arial", size: 20, color: C.red, bold: true }),
      new TextRun({ text: "Verschuiving vs. kanteling verwarren: ", font: "Arial", size: 19, bold: true, color: C.dark }),
      new TextRun({ text: "Evenwijdig = budget verandert, kanteling = prijs verandert", font: "Arial", size: 19, color: C.dark }),
    ] }),
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "\u2718  ", font: "Arial", size: 20, color: C.red, bold: true }),
      new TextRun({ text: "Snijpunten omdraaien: ", font: "Arial", size: 19, bold: true, color: C.dark }),
      new TextRun({ text: "q\u2081\u1d50\u1d43\u02e3 = B/p\u2081 (niet B/p\u2082!). Deel door de prijs van het goed op die as", font: "Arial", size: 19, color: C.dark }),
    ] }),
    new Paragraph({ children: [
      new TextRun({ text: "\u2718  ", font: "Arial", size: 20, color: C.red, bold: true }),
      new TextRun({ text: "Opofferingskosten \u2260 prijs: ", font: "Arial", size: 19, bold: true, color: C.dark }),
      new TextRun({ text: "Bij vrije tijd zijn de opofferingskosten het uurloon, niet de prijs van een product", font: "Arial", size: 19, color: C.dark }),
    ] }),
  ], C.red, C.lightRed));

  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
    sections: [{ properties: { page: PAGE }, children }],
  });

  const outPath = "C:/Projects/4veco/module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.2 Paragraaf 2 - Kiezen of delen/2. Leren/1.1.2 Kiezen of delen \u2013 samenvatting.docx";
  const buf = await Packer.toBuffer(doc);
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, buf);
  console.log(`SUCCESS: ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
}

build().catch(err => { console.error(err); process.exit(1); });
