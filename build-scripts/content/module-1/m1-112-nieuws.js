/**
 * Module 1, §1.1.2 Kiezen of delen — Nieuws met visual
 * Based on m1-111-nieuws.js
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-112-nieuws.js
 */
const fs = require("fs");
const path = require("path");
const { svgToPng, pngToBase64, GRAPH_COLORS } = require("../../lib/lib-svg-utils");
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

function svgBudgetLine() {
  const w = 720, h = 400;
  const mx = 80, my = 40, pw = w - 2 * mx, ph = h - 2 * my - 30;
  const ox = mx, oy = my + ph;

  // Axes: x = Vrije tijd (0-24), y = Daginkomen (0-340)
  const maxX = 24, maxY = 340;
  const toSvgX = (v) => ox + (v / maxX) * pw;
  const toSvgY = (v) => oy - (v / maxY) * ph;

  // Old wage: 13.64/hr => max income = 24 * 13.64 = 327.36
  const oldWage = 13.64;
  const newWage = 14.06;
  const oldMax = oldWage * 24;  // 327.36
  const newMax = newWage * 24;  // 337.44

  // Budget lines pivot at (24, 0) — at 24 hrs free time, income = 0
  // At 0 hrs free time, income = max
  const oldLineStart = { x: toSvgX(0), y: toSvgY(oldMax) };
  const oldLineEnd = { x: toSvgX(24), y: toSvgY(0) };
  const newLineStart = { x: toSvgX(0), y: toSvgY(newMax) };
  const newLineEnd = { x: toSvgX(24), y: toSvgY(0) };

  // Grid lines
  let gridLines = "";
  for (let yVal = 0; yVal <= maxY; yVal += 50) {
    gridLines += `<line x1="${ox}" y1="${toSvgY(yVal)}" x2="${ox + pw}" y2="${toSvgY(yVal)}" stroke="${GRAPH_COLORS.grid}" stroke-width="0.5"/>`;
    if (yVal > 0) gridLines += `<text x="${ox - 8}" y="${toSvgY(yVal) + 4}" font-family="Arial" font-size="10" fill="${GRAPH_COLORS.label}" text-anchor="end">\u20AC${yVal}</text>`;
  }
  for (let xVal = 0; xVal <= 24; xVal += 4) {
    gridLines += `<line x1="${toSvgX(xVal)}" y1="${oy}" x2="${toSvgX(xVal)}" y2="${oy - ph}" stroke="${GRAPH_COLORS.grid}" stroke-width="0.5"/>`;
    gridLines += `<text x="${toSvgX(xVal)}" y="${oy + 16}" font-family="Arial" font-size="10" fill="${GRAPH_COLORS.label}" text-anchor="middle">${xVal}</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="8" fill="${GRAPH_COLORS.bg}"/>
  <text x="${w / 2}" y="22" font-family="Arial" font-size="14" font-weight="bold" fill="${GRAPH_COLORS.title}" text-anchor="middle">Budgetlijn: vrije tijd vs. daginkomen</text>
  ${gridLines}
  <!-- Axes -->
  <line x1="${ox}" y1="${oy}" x2="${ox + pw}" y2="${oy}" stroke="${GRAPH_COLORS.axis}" stroke-width="1.5"/>
  <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${my}" stroke="${GRAPH_COLORS.axis}" stroke-width="1.5"/>
  <!-- Axis labels -->
  <text x="${ox + pw / 2}" y="${h - 5}" font-family="Arial" font-size="12" fill="${GRAPH_COLORS.axis}" text-anchor="middle">Vrije tijd (uren per dag)</text>
  <text x="15" y="${oy - ph / 2}" font-family="Arial" font-size="12" fill="${GRAPH_COLORS.axis}" text-anchor="middle" transform="rotate(-90,15,${oy - ph / 2})">Daginkomen (\u20AC)</text>
  <!-- Old wage line (dashed) -->
  <line x1="${oldLineStart.x}" y1="${oldLineStart.y}" x2="${oldLineEnd.x}" y2="${oldLineEnd.y}" stroke="${GRAPH_COLORS.label}" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="${oldLineStart.x + 5}" y="${oldLineStart.y - 6}" font-family="Arial" font-size="10" fill="${GRAPH_COLORS.label}">\u20AC13,64/uur (\u20AC${oldMax.toFixed(0)})</text>
  <!-- New wage line (solid teal) -->
  <line x1="${newLineStart.x}" y1="${newLineStart.y}" x2="${newLineEnd.x}" y2="${newLineEnd.y}" stroke="#17A2B8" stroke-width="2.5"/>
  <text x="${newLineStart.x + 5}" y="${newLineStart.y - 6}" font-family="Arial" font-size="10" fill="#117A65" font-weight="bold">\u20AC14,06/uur (\u20AC${newMax.toFixed(0)})</text>
  <!-- Pivot point at (24, 0) -->
  <circle cx="${toSvgX(24)}" cy="${toSvgY(0)}" r="4" fill="${GRAPH_COLORS.axis}"/>
  <text x="${toSvgX(24) + 2}" y="${toSvgY(0) - 8}" font-family="Arial" font-size="9" fill="${GRAPH_COLORS.axis}">draaipunt</text>
  <!-- Legend -->
  <line x1="${w - 250}" y1="${my + 10}" x2="${w - 225}" y2="${my + 10}" stroke="${GRAPH_COLORS.label}" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="${w - 220}" y="${my + 14}" font-family="Arial" font-size="10" fill="${GRAPH_COLORS.label}">Oud: \u20AC13,64/uur</text>
  <line x1="${w - 250}" y1="${my + 28}" x2="${w - 225}" y2="${my + 28}" stroke="#17A2B8" stroke-width="2.5"/>
  <text x="${w - 220}" y="${my + 32}" font-family="Arial" font-size="10" fill="#117A65">Nieuw: \u20AC14,06/uur</text>
</svg>`;
}

const OUTPUT_DIR = "C:/Projects/4veco/module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.2 Paragraaf 2 - Kiezen of delen/2. Leren";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "1.1.2 Kiezen of delen \u2013 nieuws met visual.docx");

(async () => {
  try {
    const pngBuf = await svgToPng(svgBudgetLine(), 720);
    const IMG_HEIGHT_PT = Math.round(IMG_WIDTH_PT * (400 / 720));
    const children = [];
    children.push(headlinePara("Minimumloon stijgt naar \u20AC14,06 per uur"));
    children.push(new Paragraph({ spacing: { before: 80, after: 160 }, children: [new ImageRun({ data: pngBuf, transformation: { width: IMG_WIDTH_PT, height: IMG_HEIGHT_PT }, type: "png" })] }));
    children.push(articlePara("Per 1 januari 2025 is het minimumloon gestegen naar \u20AC14,06 bruto per uur. Dit is een stijging van 3,1% ten opzichte van het vorige minimumloon van \u20AC13,64. De verhoging raakt vooral jongeren met bijbanen en werkenden in de horeca en detailhandel. Vakbonden pleiten al langer voor een hoger minimumloon om de koopkracht van werkenden te verbeteren. Werkgeversorganisaties waarschuwen dat hogere loonkosten kunnen leiden tot minder banen."));
    children.push(sourcePara("Bron: NOS, 2 januari 2025 \u2014 nos.nl/artikel/2547892-minimumloon-stijgt-per-1-januari-naar-14-06-euro"));
    children.push(spacer(80));
    children.push(domainBanner("Vragen"));
    children.push(spacer(80));
    const questions = [
      "Bereken het maximale daginkomen bij het oude minimumloon (\u20AC13,64) en bij het nieuwe minimumloon (\u20AC14,06). Ga uit van 24 werkbare uren per dag.",
      "Teken de budgetlijn voor een werkdag van maximaal 8 uur bij het nieuwe minimumloon (\u20AC14,06 per uur).",
      "Wat zijn de opofferingskosten van een uur vrije tijd bij het nieuwe minimumloon? Leg uit.",
      "Iemand werkte 6 uur per dag bij het oude minimumloon. Hoeveel minder uren kan diegene werken om hetzelfde daginkomen te behouden bij het nieuwe minimumloon?",
      "Analyseer: waarom waarschuwen werkgevers dat een hoger minimumloon tot minder banen kan leiden? Gebruik het begrip budgetlijn in je antwoord.",
    ];
    const answers = [
      "Oud: 24 \u00D7 \u20AC13,64 = \u20AC327,36 per dag. Nieuw: 24 \u00D7 \u20AC14,06 = \u20AC337,44 per dag. Het maximale daginkomen stijgt met \u20AC10,08.",
      "De budgetlijn loopt van het punt (0 uur vrije tijd, \u20AC112,48) naar (8 uur vrije tijd, \u20AC0). Op de x-as staat vrije tijd (0\u20138 uur), op de y-as het daginkomen. De helling is \u2212\u20AC14,06 per uur.",
      "De opofferingskosten van een uur vrije tijd zijn \u20AC14,06. Elk uur dat je niet werkt, mis je \u20AC14,06 aan inkomen. Het uurloon is de prijs van vrije tijd.",
      "Oud inkomen: 6 \u00D7 \u20AC13,64 = \u20AC81,84. Bij nieuw loon: \u20AC81,84 / \u20AC14,06 = 5,82 uur. Diegene kan 6 \u2212 5,82 = 0,18 uur (\u2248 11 minuten) minder werken en hetzelfde inkomen houden.",
      "Een hoger minimumloon verschuift de budgetlijn van werkgevers naar binnen: bij hetzelfde budget kunnen zij minder werkuren inkopen. De loonkosten per uur stijgen, waardoor werkgevers minder arbeid vragen. Vooral voor laagproductieve banen worden de kosten hoger dan de opbrengsten, waardoor werkgevers die banen schrappen of automatiseren.",
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
        headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "1.1.2 Kiezen of delen \u2013 Nieuws met visual", size: 20, font: "Arial", color: C.gray, italics: true })] })] }) },
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
