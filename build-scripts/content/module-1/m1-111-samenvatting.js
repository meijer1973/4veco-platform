/**
 * Module 1, §1.1.1 Kiezen is kostbaar — Samenvatting (infographic)
 * Based on samenvatting-351-352-rebuild.js
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-111-samenvatting.js
 */
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType,
} = require("docx");

const PAGE = { size: { width: 11906, height: 16838 }, margin: { top: 720, right: 720, bottom: 720, left: 720 } };
const CW = 10466;
const halfW = Math.floor((CW - 200) / 2);

const C = {
  teal: "17A2B8", tealLt: "E8F8F5", tealDk: "117A65",
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

async function build() {
  const children = [];

  children.push(titleBanner("1.1.1", "Kiezen is kostbaar", "Schaarste, behoeften, middelen en alternatieve kosten"));
  children.push(sp(80));

  // ── Schaarste (teal) ──
  children.push(sectionHeader("\uD83D\uDD11", "Het kernprobleem", "Schaarste en kiezen", C.teal));
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA }, columnWidths: [halfW, 200, halfW],
    rows: [new TableRow({ children: [
      colorCard("Schaarste", [
        "Behoeften zijn onbeperkt",
        "Middelen zijn beperkt (geld, tijd, arbeid)",
        "Schaarste = behoeften > middelen",
        "Daarom moet je kiezen",
      ], C.teal, C.tealLt, C.tealDk),
      spacerCell(),
      colorCard("Middelen", [
        "Geld \u2014 inkomen, budget",
        "Tijd \u2014 24 uur per dag",
        "Arbeid \u2014 energie, vaardigheden",
        "Grondstoffen \u2014 natuur, materialen",
      ], C.teal, C.tealLt, C.tealDk),
    ] })],
  }));
  children.push(sp(80));

  // ── Alternatieve kosten (amber) ──
  children.push(sectionHeader("\uD83D\uDCB0", "Alternatieve kosten", "De prijs van elke keuze", C.amber));
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA }, columnWidths: [halfW, 200, halfW],
    rows: [new TableRow({ children: [
      colorCard("Wat zijn alternatieve kosten?", [
        "Waarde van het beste gemiste alternatief",
        "Niet de geldprijs, maar wat je opgeeft",
        "Alleen het op-\u00e9\u00e9n-na-beste alternatief telt",
      ], C.amber, C.amberLt, C.amberDk),
      spacerCell(),
      colorCard("Voorbeeld", [
        "Werken (\u20AC60) of festival (plezier \u20AC40)",
        "Kies je werken \u2192 AK = \u20AC40 (festival)",
        "Kies je festival \u2192 AK = \u20AC60 (inkomen)",
        "Opofferingskosten = AK + directe kosten",
      ], C.amber, C.amberLt, C.amberDk),
    ] })],
  }));
  children.push(sp(80));

  // ── Nettobaten (green) ──
  children.push(sectionHeader("\u2705", "Keuzeregel", "Nettobaten vergelijken", C.green));
  children.push(fullWidthCard([
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
      new TextRun({ text: "Kernformules", font: "Arial", size: 20, bold: true, color: C.greenDk }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [
      new TextRun({ text: "Nettobaten = Totale baten \u2212 Totale kosten", font: "Consolas", size: 19, color: C.dark }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [
      new TextRun({ text: "Alternatieve kosten = waarde beste gemiste alternatief", font: "Consolas", size: 19, color: C.dark }),
    ] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: "Kies de optie met de hoogste nettobaten", font: "Consolas", size: 19, bold: true, color: C.teal }),
    ] }),
  ], C.green, C.greenLt));
  children.push(sp(80));

  // ── Veelgemaakte fouten (red) ──
  children.push(sectionHeader("\u26A0\uFE0F", "Veelgemaakte fouten", "Vermijd deze valkuilen", C.red));
  children.push(fullWidthCard([
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "\u2718  ", font: "Arial", size: 20, color: C.red, bold: true }),
      new TextRun({ text: "AK verwarren met prijs: ", font: "Arial", size: 19, bold: true, color: C.dark }),
      new TextRun({ text: "Alternatieve kosten \u2260 wat je betaalt, maar wat je opgeeft", font: "Arial", size: 19, color: C.dark }),
    ] }),
    new Paragraph({ spacing: { after: 40 }, children: [
      new TextRun({ text: "\u2718  ", font: "Arial", size: 20, color: C.red, bold: true }),
      new TextRun({ text: "Alle alternatieven optellen: ", font: "Arial", size: 19, bold: true, color: C.dark }),
      new TextRun({ text: "Alleen het BESTE gemiste alternatief telt", font: "Arial", size: 19, color: C.dark }),
    ] }),
    new Paragraph({ children: [
      new TextRun({ text: "\u2718  ", font: "Arial", size: 20, color: C.red, bold: true }),
      new TextRun({ text: "Tijd vergeten: ", font: "Arial", size: 19, bold: true, color: C.dark }),
      new TextRun({ text: "Tijd is een schaars middel en moet meegerekend worden", font: "Arial", size: 19, color: C.dark }),
    ] }),
  ], C.red, C.lightRed));

  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
    sections: [{ properties: { page: PAGE }, children }],
  });

  const outPath = "C:/Projects/4veco/module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.1 Paragraaf 1 - Kiezen is kostbaar/2. Leren/1.1.1 Kiezen is kostbaar \u2013 samenvatting.docx";
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(outPath, buf);
  console.log(`SUCCESS: ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
}

build().catch(err => { console.error(err); process.exit(1); });
