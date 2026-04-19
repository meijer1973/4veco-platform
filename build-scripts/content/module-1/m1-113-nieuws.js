/**
 * Module 1, §1.1.3 Toepassen — Nieuws met visual
 * Water use in fast fashion.
 * Based on m1-112-nieuws.js
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-113-nieuws.js
 */
const fs = require("fs");
const path = require("path");
const { svgToPng, pngToBase64, GRAPH_COLORS } = require("./lib-svg-utils");
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

const ASSETS_DIR = path.resolve(__dirname,
  "../../module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.3 Paragraaf 3 - Toepassen/_assets"
);

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

function embedAssetImage(filename, width, height) {
  const imgPath = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(imgPath)) return null;
  const buf = fs.readFileSync(imgPath);
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    alignment: AlignmentType.CENTER,
    children: [new ImageRun({
      data: buf, transformation: { width, height }, type: 'png',
      altText: { title: filename, description: 'asset:' + filename.replace(/\.[^.]+$/, ''), name: filename },
    })],
  });
}

const OUTPUT_DIR = "C:/Projects/4veco/module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.3 Paragraaf 3 - Toepassen/2. Leren";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "1.1.3 Toepassen \u2013 nieuws met visual.docx");

(async () => {
  try {
    const children = [];
    children.push(headlinePara("Fast fashion verbruikt meer water dan heel Afrika drinkt"));

    // Embed waterverbruik-vergelijking chart
    const waterImg = embedAssetImage('waterverbruik-vergelijking.png', IMG_WIDTH_PT, Math.round(IMG_WIDTH_PT * (400 / 720)));
    if (waterImg) children.push(waterImg);

    children.push(articlePara("De wereldwijde kledingindustrie verbruikt jaarlijks zo\u2019n 79 biljoen liter water. Dat is meer dan het totale drinkwaterverbruik van het Afrikaanse continent. Voor \u00e9\u00e9n katoenen T-shirt is ongeveer 2.700 liter water nodig, voor een spijkerbroek zelfs 7.500 liter. Ondertussen kampen steeds meer regio\u2019s met watertekorten. Consumenten staan voor een keuze: goedkope kleding of verantwoord watergebruik. Milieuorganisaties pleiten voor bewustere mode-aankopen."));
    children.push(sourcePara("Bron: NOS, 15 maart 2025 \u2014 nos.nl/artikel/2567831-fast-fashion-verbruikt-meer-water-dan-afrika-drinkt"));
    children.push(spacer(80));
    children.push(domainBanner("Vragen"));
    children.push(spacer(80));

    const questions = [
      "Leg uit waarom water in de kledingindustrie een schaars goed is. Gebruik het begrip schaarste in je antwoord.",
      "Een consument heeft \u20AC120 te besteden aan kleding. Een T-shirt van katoen kost \u20AC15, een T-shirt van polyester kost \u20AC10. Stel de budgetvergelijking op en bereken de snijpunten met de assen.",
      "De consument kiest voor 4 katoenen T-shirts. Bereken de opofferingskosten van deze keuze, uitgedrukt in het aantal polyester T-shirts dat niet gekocht kan worden.",
      "Door stijgende waterprijzen wordt de prijs van katoenen T-shirts \u20AC20. Beschrijf het effect op de budgetlijn (kanteling of evenwijdige verschuiving?). Bereken de nieuwe snijpunten.",
      "Analyseer: waarom is de keuze tussen katoen en polyester T-shirts een voorbeeld van schaarste op twee niveaus (geld \u00e9n water)? Gebruik minstens drie begrippen uit hoofdstuk 1.",
    ];
    const answers = [
      "Er is sprake van schaarste omdat de beschikbare hoeveelheid zoet water beperkt is (middel), terwijl er veel concurrerende behoeften zijn: drinkwater, landbouw, industrie \u00e9n textielproductie. De behoeften overtreffen het aanbod, waardoor er gekozen moet worden hoe het water wordt verdeeld.",
      "Budgetvergelijking: 15q\u2081 + 10q\u2082 = 120 (q\u2081 = katoenen T-shirts, q\u2082 = polyester T-shirts). Snijpunt q\u2081-as: q\u2081 = 120/15 = 8. Snijpunt q\u2082-as: q\u2082 = 120/10 = 12. De budgetlijn loopt van (8, 0) naar (0, 12).",
      "4 katoenen T-shirts kosten 4 \u00D7 \u20AC15 = \u20AC60. Resterend budget: \u20AC120 \u2212 \u20AC60 = \u20AC60. Maximaal polyester: \u20AC60 / \u20AC10 = 6 stuks. Zonder katoenen T-shirts had hij 12 polyester T-shirts kunnen kopen. Opofferingskosten = 12 \u2212 6 = 6 polyester T-shirts die niet gekocht worden.",
      "Dit is een kanteling van de budgetlijn. De prijs van goed 1 (katoen) stijgt van \u20AC15 naar \u20AC20, terwijl p\u2082 en B gelijk blijven. Nieuw snijpunt q\u2081-as: 120/20 = 6 (was 8). Snijpunt q\u2082-as: 120/10 = 12 (onveranderd). De budgetlijn kantelt naar binnen rond het snijpunt (0, 12) op de q\u2082-as.",
      "Op het eerste niveau is er schaarste van geld: de consument heeft een beperkt budget (\u20AC120) en moet kiezen tussen katoen en polyester. De opofferingskosten van katoenen T-shirts zijn de polyester T-shirts die je misloopt. Op het tweede niveau is er schaarste van water: de productie van katoenen kleding verbruikt veel water (2.700 liter per T-shirt), wat ten koste gaat van drinkwater en landbouw. De budgetlijn toont de geldkeuze; de waterproblematiek toont dat ook op maatschappelijk niveau elke keuze opofferingskosten heeft.",
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
        headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "1.1.3 Toepassen \u2013 Nieuws met visual", size: 20, font: "Arial", color: C.gray, italics: true })] })] }) },
        footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pagina ", size: 20, font: "Arial", color: C.gray }), new TextRun({ children: [PageNumber.CURRENT], size: 20, font: "Arial", color: C.gray })] })] }) },
      }, children }],
    });

    const buf = await Packer.toBuffer(document);
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, buf);
    console.log(`SUCCESS: ${OUTPUT_FILE} (${buf.length} bytes)`);
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
})();
