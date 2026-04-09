/**
 * Module 1, §1.1.1 Kiezen is kostbaar — Nieuws met visual
 * Based on nieuws-351-352-afsluiting.js
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-111-nieuws.js
 */
const fs = require("fs");
const path = require("path");
const { saveSvgFiles } = require("./lib-svg-save");
const sharp = require("sharp");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak,
} = require("docx");

const C = {
  navy: "1E2761", dark: "2D3748", gray: "718096", white: "FFFFFF",
  accent: "17A2B8", accentLt: "E8F8F5", accentDk: "117A65",
};

const PAGE_TIGHT = { size: { width: 11906, height: 16838 }, margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } };
const CW_TIGHT = 9638;
const IMG_WIDTH_PT = 482;

async function svgToPng(svgStr, width = 720) {
  return await sharp(Buffer.from(svgStr)).resize(width).png().toBuffer();
}

function noBorders() {
  const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  return { top: none, bottom: none, left: none, right: none };
}

function domainBanner(title) {
  const accentWidth = 180;
  return new Table({
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: accentWidth, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: C.accent }, borders: noBorders(), children: [new Paragraph({ text: "" })] }),
      new TableCell({ width: { size: CW_TIGHT - accentWidth, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: C.accentLt }, borders: noBorders(), margins: { top: 80, bottom: 80, left: 160, right: 160 }, children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: title, bold: true, size: 24, font: "Arial", color: C.accentDk })] })] }),
    ] })],
    width: { size: CW_TIGHT, type: WidthType.DXA },
  });
}

function headlinePara(text) { return new Paragraph({ spacing: { before: 0, after: 160 }, children: [new TextRun({ text, bold: true, size: 32, font: "Arial", color: C.navy })] }); }
function articlePara(text) { return new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text, size: 22, font: "Arial", color: C.dark })] }); }
function sourcePara(text) { return new Paragraph({ spacing: { before: 40, after: 160 }, children: [new TextRun({ text, italics: true, size: 18, font: "Arial", color: C.gray })] }); }
function questionPara(label, text) { return new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: label + "  ", bold: true, size: 22, font: "Arial", color: C.accent }), new TextRun({ text, size: 22, font: "Arial", color: C.dark })] }); }
function answerPara(label, text) { return new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text: label + "  ", bold: true, size: 22, font: "Arial", color: C.accent }), new TextRun({ text, size: 22, font: "Arial", color: C.dark })] }); }
function spacer(twips = 120) { return new Paragraph({ spacing: { before: twips, after: 0 }, text: "" }); }

function svgTimeBudget() {
  const categories = [
    { name: "Slapen", hours: 8.0, color: "#1A5276" },
    { name: "Werk/school", hours: 5.5, color: "#17A2B8" },
    { name: "Huishouden", hours: 2.5, color: "#E67E22" },
    { name: "Vrije tijd", hours: 4.5, color: "#1E8449" },
    { name: "Overig", hours: 3.5, color: "#718096" },
  ];
  const totalH = 24;
  const barW = 400, barH = 55, startX = 180, startY = 70;
  let bars = "";
  let cumX = startX;
  for (const c of categories) {
    const w = Math.round((c.hours / totalH) * barW);
    bars += `<rect x="${cumX}" y="${startY}" width="${w}" height="${barH}" fill="${c.color}"/>`;
    if (w > 30) {
      bars += `<text x="${cumX + w / 2}" y="${startY + barH / 2 + 5}" font-family="Arial" font-size="11" fill="white" text-anchor="middle" font-weight="bold">${c.hours}u</text>`;
    }
    cumX += w;
  }
  let legend = "";
  let lx = 80;
  for (const c of categories) {
    legend += `<rect x="${lx}" y="150" width="12" height="12" rx="2" fill="${c.color}"/>`;
    legend += `<text x="${lx + 16}" y="161" font-family="Arial" font-size="11" fill="#2D3748">${c.name} (${c.hours}u)</text>`;
    lx += c.name.length * 7 + 55;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 200">
  <rect width="720" height="200" rx="8" fill="#F7FAFC"/>
  <text x="360" y="32" font-family="Arial" font-size="15" font-weight="bold" fill="#1E2761" text-anchor="middle">Gemiddelde tijdsbesteding Nederlander per dag (24 uur)</text>
  <text x="360" y="52" font-family="Arial" font-size="11" fill="#718096" text-anchor="middle">Bron: CBS Tijdbestedingsonderzoek 2023</text>
  ${bars}
  ${legend}
</svg>`;
}

const OUTPUT_DIR = "C:/Projects/4veco/module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.1 Paragraaf 1 - Kiezen is kostbaar/2. Leren";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "1.1.1 Kiezen is kostbaar \u2013 nieuws met visual.docx");

(async () => {
  try {
    const timeBudgetSvg = svgTimeBudget();
    const pngBuf = await svgToPng(timeBudgetSvg, 720);
    const IMG_HEIGHT_PT = Math.round(IMG_WIDTH_PT * (200 / 720));
    const children = [];
    children.push(headlinePara("Steeds meer Nederlanders werken liever minder uren"));
    children.push(new Paragraph({ spacing: { before: 80, after: 160 }, children: [new ImageRun({ data: pngBuf, transformation: { width: IMG_WIDTH_PT, height: IMG_HEIGHT_PT }, type: "png" })] }));
    children.push(articlePara("Uit het nieuwste CBS-onderzoek blijkt dat steeds meer werkende Nederlanders kiezen voor minder werkuren, ook al betekent dit een lager inkomen. In 2023 gaf 38% van de werknemers aan liever meer vrije tijd te hebben dan meer salaris. Dat is een stijging van 12 procentpunt ten opzichte van vijf jaar geleden."));
    children.push(articlePara("Economen herkennen hierin het keuzeprobleem: tijd is schaars. Elke extra werkuur levert inkomen op, maar kost vrije tijd. De alternatieve kosten van werken \u2014 de vrije tijd die je opgeeft \u2014 worden blijkbaar steeds zwaarder gewogen. Vooral jongeren tussen 25 en 35 jaar kiezen bewust voor een kortere werkweek."));
    children.push(sourcePara("Bron: CBS Tijdbestedingsonderzoek / NOS, maart 2024"));
    children.push(spacer(80));
    children.push(domainBanner("Vragen"));
    children.push(spacer(80));
    const questions = [
      "Bekijk de visual. Hoeveel uur per dag besteedt een Nederlander gemiddeld aan werk of school?",
      "Leg uit waarom tijd een schaars goed is. Gebruik de visual als voorbeeld.",
      "Een werknemer verdient \u20AC25 per uur en overweegt 4 uur minder te werken per week. Bereken de alternatieve kosten van deze keuze in euro\u2019s per week.",
      "Leg uit waarom de keuze om minder te werken een voorbeeld is van het keuzeprobleem.",
      "Welke baten staan tegenover de kosten van minder werken? Geef twee voorbeelden.",
    ];
    const answers = [
      "Gemiddeld 5,5 uur per dag aan werk of school.",
      "Een dag heeft maar 24 uur. Je kunt die uren maar \u00e9\u00e9n keer besteden \u2014 als je werkt, kun je op dat moment niet iets anders doen. Uit de visual blijkt dat de 24 uur verdeeld moeten worden over slapen, werk, huishouden en vrije tijd.",
      "Alternatieve kosten = 4 uur \u00D7 \u20AC25 = \u20AC100 per week aan misgelopen inkomen.",
      "Het is een keuzeprobleem omdat de werknemer schaarse tijd moet verdelen: meer vrije tijd betekent minder inkomen, en meer inkomen betekent minder vrije tijd. Je kunt niet beide tegelijk maximaliseren.",
      "Bijvoorbeeld: (1) meer tijd voor familie, sport of hobby\u2019s, (2) minder stress en beter welzijn. Dit zijn niet-geldelijke baten die tegenover de lagere inkomsten staan.",
    ];
    const labels = "abcdefgh".split("");
    for (let i = 0; i < questions.length; i++) children.push(questionPara(labels[i] + ")", questions[i]));
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(domainBanner("Antwoordmodel"));
    children.push(spacer(80));
    for (let i = 0; i < answers.length; i++) children.push(answerPara(labels[i] + ")", answers[i]));

    const document = new Document({
      sections: [{ properties: {
        page: PAGE_TIGHT,
        headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "1.1.1 Kiezen is kostbaar \u2013 Nieuws met visual", size: 20, font: "Arial", color: C.gray, italics: true })] })] }) },
        footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pagina ", size: 20, font: "Arial", color: C.gray }), new TextRun({ children: [PageNumber.CURRENT], size: 20, font: "Arial", color: C.gray })] })] }) },
      }, children }],
    });

    const buf = await Packer.toBuffer(document);
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, buf);
    console.log(`SUCCESS: ${OUTPUT_FILE} (${buf.length} bytes)`);
    saveSvgFiles([{ name: "time-budget", svg: timeBudgetSvg }], OUTPUT_DIR);
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
})();
