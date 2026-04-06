/**
 * Build script: 3.5.2 Naar het examen — Opgavensets (basis, midden, verrijking)
 * Generates 6 documents: vragen + antwoorden for each of the 3 levels.
 *
 * Content: Exam-style questions for Module 3 (Markt en overheid).
 * - Basis: simplified exam questions with hints (10 questions)
 * - Midden: exam-level questions without scaffolding (8 questions)
 * - Verrijking: extended exam questions with multiple parts (6 questions)
 *
 * HOW TO ADAPT:
 * 1. Change BASE_DIR and file naming
 * 2. Replace exercise content in buildBasis/buildMidden/buildVerrijking
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/opgaven-352-naar-het-examen.js
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
  Header, Footer, PageNumber, PageBreak,
} = require("docx");

// ─── Base path ───
const BASE_DIR = `C:\\Projects\\4veco\\3. Module 3 - Markt en overheid\\3.5 Hoofdstuk 5 - Afsluiting\\3.5.2 Paragraaf 2 - Naar het examen\\3. Oefenen`;
const PREFIX = "3.5.2 Naar het examen";

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

// ─── Basic helpers ───
const sp = (after = 80) => new Paragraph({ spacing: { after }, children: [] });

const p = (text, opts = {}) => new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({ text, font: "Arial", size: 22, color: C.dark, ...opts })],
});

const pBold = (text) => p(text, { bold: true });

const h2d = (text, domainColor = C.dBlue) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 200, after: 120 },
  children: [new TextRun({ text, bold: true, font: "Arial", size: 24, color: domainColor })],
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

// ─── Boxes ───
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

function instructionBox(text) {
  return tipBox(text, C.blue, C.lightBlue, "\uD83D\uDCD6 ");
}

function hintBox(text) {
  return tipBox(text, C.dAmber, C.dAmberLt, "\uD83D\uDCA1 Hint: ");
}

function answerBox(lines) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 1, color: C.dGreenLt },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: C.dGreenLt },
        left:   { style: BorderStyle.SINGLE, size: 8, color: C.dGreen },
        right:  { style: BorderStyle.SINGLE, size: 1, color: C.dGreenLt },
      },
      shading: { fill: C.lightGreen, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      width: { size: CW, type: WidthType.DXA },
      children: lines.map(line => new Paragraph({
        spacing: { after: 80 },
        children: typeof line === "string"
          ? [new TextRun({ text: line, font: "Arial", size: 22, color: C.dark })]
          : line.map(r => new TextRun({ font: "Arial", size: 22, color: C.dark, ...r })),
      })),
    })] })],
  });
}

function answerSpace(lineCount = 3) {
  const lines = [];
  for (let i = 0; i < lineCount; i++) {
    lines.push(new Paragraph({
      spacing: { after: 0 },
      children: [new TextRun({ text: " ", font: "Arial", size: 22 })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.borderGray, space: 1 } },
    }));
    lines.push(sp(120));
  }
  return lines;
}

function question(label, text) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: label + "  ", bold: true, font: "Arial", size: 22, color: C.dark }),
      new TextRun({ text, font: "Arial", size: 22, color: C.dark }),
    ],
  });
}

// ─── Punten indicator ───
function punten(n) {
  return new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 80 },
    children: [new TextRun({ text: `${n}p`, bold: true, font: "Arial", size: 20, color: C.gray, italics: true })],
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

// ════════════════════════════════════════════════════════════════════════════════
// EXERCISE CONTENT — BASIS (10 vragen, exam-style with hints)
// ════════════════════════════════════════════════════════════════════════════════

function buildBasis(includeAnswers) {
  const children = [];

  children.push(...titleBlock("Naar het examen", includeAnswers ? "Basisopgaven \u2014 Antwoorden" : "Basisopgaven"));
  children.push(sp(200));
  children.push(instructionBox("Examenstijl-vragen met hints. Oefen de manier waarop vragen op het examen gesteld worden. De hints helpen je op weg."));
  children.push(sp(400));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ── Opgave 1: Marktevenwicht ──
  children.push(h2d("Opgave 1 \u2014 De fietsenmarkt", C.dAmber));
  children.push(p("De vraag naar fietsen in Nederland wordt beschreven door: Qv = 500 \u2013 2P"));
  children.push(p("Het aanbod van fietsen wordt beschreven door: Qa = \u2013100 + 3P"));
  children.push(sp(40));
  children.push(punten(3));
  children.push(question("1", "Bereken de evenwichtsprijs en de evenwichtshoeveelheid op de fietsenmarkt."));
  if (!includeAnswers) {
    children.push(hintBox("Stel Qv gelijk aan Qa en los P op."));
    children.push(...answerSpace(5));
  } else {
    children.push(answerBox([
      "Qv = Qa",
      "500 \u2013 2P = \u2013100 + 3P",
      "600 = 5P",
      "P* = \u20ac120 (1p)",
      "Q* = 500 \u2013 2 \u00d7 120 = 260 fietsen (1p)",
      "Evenwichtsprijs is \u20ac120 en evenwichtshoeveelheid is 260 fietsen. (1p voor correcte uitwerking)",
    ]));
  }
  children.push(sp(80));

  children.push(punten(2));
  children.push(question("2", "Bereken het consumentensurplus in het evenwicht."));
  if (!includeAnswers) {
    children.push(hintBox("Het consumentensurplus is de driehoek boven de prijs en onder de vraaglijn. Zoek eerst de maximale betalingsbereidheid (P bij Qv = 0)."));
    children.push(...answerSpace(4));
  } else {
    children.push(answerBox([
      "Max. betalingsbereidheid: P = 500/2 = \u20ac250 (bij Qv = 0) (1p)",
      "CS = \u00bd \u00d7 260 \u00d7 (250 \u2013 120) = \u00bd \u00d7 260 \u00d7 130 = \u20ac16.900 (1p)",
    ]));
  }
  children.push(sp(200));

  // ── Opgave 2: Marktvormen herkennen ──
  children.push(h2d("Opgave 2 \u2014 Marktvormen herkennen", C.dAmber));
  children.push(p("Hieronder staan vier beschrijvingen van markten. Bepaal bij elke beschrijving welke marktvorm het is."));
  children.push(sp(40));
  children.push(punten(4));
  children.push(question("A", "Op de markt voor graan zijn er heel veel boeren die identiek graan verkopen. Geen enkele boer kan de prijs be\u00efnvloeden."));
  children.push(question("B", "In de restaurantsector zijn er veel aanbieders die zich onderscheiden door sfeer, keuken en prijs."));
  children.push(question("C", "Het spoorvervoer in Nederland wordt verzorgd door NS, die als enige partij het hoofdrailnet mag exploiteren."));
  children.push(question("D", "Op de markt voor mobiele telefonie zijn er drie grote aanbieders: KPN, T-Mobile en Vodafone."));

  if (!includeAnswers) {
    children.push(hintBox("Gebruik deze kenmerken: aantal aanbieders, soort product (homogeen/heterogeen), toetredingsdrempels, prijsinvloed."));
    children.push(...answerSpace(5));
  } else {
    children.push(answerBox([
      "A: Volkomen concurrentie \u2014 veel aanbieders, homogeen product, geen prijsinvloed. (1p)",
      "B: Monopolistische concurrentie \u2014 veel aanbieders, heterogeen product, enige prijsinvloed. (1p)",
      "C: Monopolie \u2014 \u00e9\u00e9n aanbieder, uniek product, grote prijsinvloed, hoge toetredingsdrempels. (1p)",
      "D: Oligopolie \u2014 weinig grote aanbieders, onderlinge afhankelijkheid, hoge toetredingsdrempels. (1p)",
    ]));
  }
  children.push(sp(200));

  // ── Opgave 3: Surplus ──
  children.push(h2d("Opgave 3 \u2014 Surplus berekenen", C.dAmber));
  children.push(p("Op een markt geldt: Qv = 160 \u2013 4P en Qa = \u221240 + 2P."));
  children.push(sp(40));
  children.push(punten(2));
  children.push(question("1", "Bereken de evenwichtsprijs en -hoeveelheid."));
  if (!includeAnswers) {
    children.push(...answerSpace(4));
  } else {
    children.push(answerBox([
      "160 \u2013 4P = \u221240 + 2P \u2192 200 = 6P \u2192 P* = 33\u2153 (1p)",
      "Q* = 160 \u2013 4 \u00d7 33\u2153 = 26\u2154 (1p)",
    ]));
  }
  children.push(sp(80));

  children.push(punten(2));
  children.push(question("2", "Bereken het producentensurplus."));
  if (!includeAnswers) {
    children.push(hintBox("Het producentensurplus is de driehoek boven de aanbodlijn en onder de prijs. De minimale aanbodprijs vind je bij Qa = 0."));
    children.push(...answerSpace(3));
  } else {
    children.push(answerBox([
      "Min. aanbodprijs (Qa = 0): P = 40/2 = 20 (1p)",
      "PS = \u00bd \u00d7 26\u2154 \u00d7 (33\u2153 \u2013 20) = \u00bd \u00d7 26\u2154 \u00d7 13\u2153 = \u20ac177,78 (1p)",
    ]));
  }
  children.push(sp(200));

  // ── Opgave 4: Belasting ──
  children.push(h2d("Opgave 4 \u2014 Accijns op tabak", C.dGreen));
  children.push(p("De vraag naar sigaretten is: Qv = 200 \u2013 P. Het aanbod is: Qa = \u221250 + 2P."));
  children.push(p("De overheid heft een accijns van \u20ac9 per pakje."));
  children.push(sp(40));
  children.push(punten(2));
  children.push(question("1", "Bereken het evenwicht v\u00f3\u00f3r de belasting."));
  if (!includeAnswers) {
    children.push(...answerSpace(4));
  } else {
    children.push(answerBox([
      "200 \u2013 P = \u221250 + 2P \u2192 250 = 3P \u2192 P* = 83\u2153 (1p)",
      "Q* = 200 \u2013 83\u2153 = 116\u2154 (1p)",
    ]));
  }
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("2", "Bereken de prijs die de consument betaalt en de prijs die de producent ontvangt na invoering van de accijns."));
  if (!includeAnswers) {
    children.push(hintBox("De aanbodfunctie verschuift omhoog met het belastingbedrag: vervang P door (P \u2013 9) in de aanbodfunctie."));
    children.push(...answerSpace(5));
  } else {
    children.push(answerBox([
      "Nieuwe aanbodfunctie: Qa = \u221250 + 2(P \u2013 9) = \u221268 + 2P (1p)",
      "200 \u2013 P = \u221268 + 2P \u2192 268 = 3P \u2192 P_consument = 89\u2153 (1p)",
      "P_producent = 89\u2153 \u2013 9 = 80\u2153 (1p)",
    ]));
  }
  children.push(sp(200));

  // ── Opgave 5: Maximumprijs ──
  children.push(h2d("Opgave 5 \u2014 Maximumprijs op de huurmarkt", C.dGreen));
  children.push(p("De vraag naar huurwoningen: Qv = 800 \u2013 P. Het aanbod: Qa = \u2013200 + 2P. De overheid stelt een maximumprijs van \u20ac250."));
  children.push(sp(40));
  children.push(punten(2));
  children.push(question("1", "Bereken het evenwicht zonder overheidsingrijpen."));
  if (!includeAnswers) {
    children.push(...answerSpace(4));
  } else {
    children.push(answerBox([
      "800 \u2013 P = \u2013200 + 2P \u2192 1000 = 3P \u2192 P* = 333\u2153 (1p)",
      "Q* = 800 \u2013 333\u2153 = 466\u2154 (1p)",
    ]));
  }
  children.push(sp(80));

  children.push(punten(2));
  children.push(question("2", "Bereken het vraagoverschot bij de maximumprijs van \u20ac250."));
  if (!includeAnswers) {
    children.push(hintBox("Vul P = 250 in bij zowel de vraag- als de aanbodfunctie."));
    children.push(...answerSpace(4));
  } else {
    children.push(answerBox([
      "Qv bij P = 250: 800 \u2013 250 = 550 (1p)",
      "Qa bij P = 250: \u2013200 + 2 \u00d7 250 = 300",
      "Vraagoverschot = 550 \u2013 300 = 250 woningen (1p)",
    ]));
  }
  children.push(sp(200));

  // ── Opgave 6: Externe effecten ──
  children.push(h2d("Opgave 6 \u2014 Externe effecten", C.dGreen));
  children.push(punten(3));
  children.push(question("", "Een chemische fabriek loost afvalwater in de rivier. Hierdoor dalen de vangsten van vissers stroomafwaarts. Leg uit dat hier sprake is van een negatief extern effect. Noem in je antwoord: (1) wie de veroorzaker is, (2) wie de gedupeerde is, (3) waarom dit effect \u2018extern\u2019 is."));

  if (!includeAnswers) {
    children.push(hintBox("Extern betekent: niet verwerkt in de marktprijs van het product."));
    children.push(...answerSpace(5));
  } else {
    children.push(answerBox([
      "(1) De chemische fabriek is de veroorzaker van de vervuiling. (1p)",
      "(2) De vissers stroomafwaarts zijn de gedupeerden: hun vangsten en inkomsten dalen. (1p)",
      "(3) Het effect is \u2018extern\u2019 omdat de kosten van de watervervuiling niet zijn opgenomen in de prijs van de chemische producten. De fabriek betaalt niet voor de schade aan de vissers. (1p)",
    ]));
  }
  children.push(sp(200));

  // ── Opgave 7: Comparatief voordeel ──
  children.push(h2d("Opgave 7 \u2014 Comparatief voordeel", C.dBlueDk));
  children.push(p("Land P kan per dag 20 auto\u2019s of 100 ton graan produceren."));
  children.push(p("Land Q kan per dag 15 auto\u2019s of 45 ton graan produceren."));
  children.push(sp(40));
  children.push(punten(2));
  children.push(question("1", "Bereken de alternatieve kosten van \u00e9\u00e9n auto in beide landen."));
  if (!includeAnswers) {
    children.push(hintBox("Alternatieve kosten van 1 auto = hoeveel graan je opgeeft voor 1 auto."));
    children.push(...answerSpace(3));
  } else {
    children.push(answerBox([
      "Land P: 1 auto kost 100/20 = 5 ton graan. (1p)",
      "Land Q: 1 auto kost 45/15 = 3 ton graan. (1p)",
    ]));
  }
  children.push(sp(80));

  children.push(punten(2));
  children.push(question("2", "Welk land moet zich specialiseren in auto\u2019s en welk land in graan? Verklaar."));
  if (!includeAnswers) {
    children.push(...answerSpace(4));
  } else {
    children.push(answerBox([
      "Land Q specialiseert zich in auto\u2019s: de alternatieve kosten zijn lager (3 ton graan vs. 5 ton graan). (1p)",
      "Land P specialiseert zich in graan: de alternatieve kosten van 1 ton graan zijn lager (0,2 auto\u2019s vs. 0,33 auto\u2019s). (1p)",
    ]));
  }
  children.push(sp(200));

  // ── Opgave 8: Ruilvoet ──
  children.push(h2d("Opgave 8 \u2014 Ruilvoet", C.dBlueDk));
  children.push(p("In 2024 was de exportprijsindex van land Z 108 en de importprijsindex 104 (basisjaar 2020 = 100)."));
  children.push(p("In 2025 is de exportprijsindex 112 en de importprijsindex 116."));
  children.push(sp(40));
  children.push(punten(2));
  children.push(question("1", "Bereken de ruilvoet in 2024 en 2025."));
  if (!includeAnswers) {
    children.push(hintBox("Ruilvoet = (exportprijsindex / importprijsindex) \u00d7 100"));
    children.push(...answerSpace(3));
  } else {
    children.push(answerBox([
      "Ruilvoet 2024 = (108 / 104) \u00d7 100 = 103,8 (1p)",
      "Ruilvoet 2025 = (112 / 116) \u00d7 100 = 96,6 (1p)",
    ]));
  }
  children.push(sp(80));

  children.push(punten(2));
  children.push(question("2", "Leg uit wat de verandering van de ruilvoet betekent voor land Z."));
  if (!includeAnswers) {
    children.push(...answerSpace(4));
  } else {
    children.push(answerBox([
      "De ruilvoet is gedaald van 103,8 naar 96,6. (1p)",
      "Dit betekent dat de importprijzen relatief sterker zijn gestegen dan de exportprijzen. Land Z moet nu meer exporteren om dezelfde hoeveelheid goederen te importeren. De handelspositie van land Z is verslechterd. (1p)",
    ]));
  }
  children.push(sp(200));

  // ── Opgave 9: Welvaartsverlies ──
  children.push(h2d("Opgave 9 \u2014 Welvaartsverlies bij monopolie", C.dAmber));
  children.push(p("Bij volkomen concurrentie geldt op een markt: P = \u20ac30 en Q = 200. Een monopolist zou op dezelfde markt P = \u20ac45 vragen en Q = 140 produceren."));
  children.push(sp(40));
  children.push(punten(2));
  children.push(question("", "Bereken het welvaartsverlies (deadweight loss) door de monopolist."));
  if (!includeAnswers) {
    children.push(hintBox("Het welvaartsverlies is de driehoek met basis (Q_vc \u2013 Q_mon) en hoogte (P_mon \u2013 P_vc)."));
    children.push(...answerSpace(4));
  } else {
    children.push(answerBox([
      "DWL = \u00bd \u00d7 (200 \u2013 140) \u00d7 (45 \u2013 30) (1p)",
      "DWL = \u00bd \u00d7 60 \u00d7 15 = \u20ac450 (1p)",
    ]));
  }
  children.push(sp(200));

  // ── Opgave 10: Subsidie ──
  children.push(h2d("Opgave 10 \u2014 Subsidie op zonnepanelen", C.dGreen));
  children.push(p("De overheid subsidieert zonnepanelen met \u20ac4 per eenheid. De vraagfunctie is Qv = 300 \u2013 5P en de aanbodfunctie Qa = \u221260 + 4P."));
  children.push(sp(40));
  children.push(punten(2));
  children.push(question("1", "Bereken het evenwicht v\u00f3\u00f3r de subsidie."));
  if (!includeAnswers) {
    children.push(...answerSpace(4));
  } else {
    children.push(answerBox([
      "300 \u2013 5P = \u221260 + 4P \u2192 360 = 9P \u2192 P* = 40 (1p)",
      "Q* = 300 \u2013 200 = 100 (1p)",
    ]));
  }
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("2", "Bereken de prijs die de consument betaalt en de hoeveelheid na de subsidie."));
  if (!includeAnswers) {
    children.push(hintBox("De producent ontvangt P + subsidie. Nieuwe aanbodfunctie: vervang P door (P + 4)."));
    children.push(...answerSpace(5));
  } else {
    children.push(answerBox([
      "Met subsidie: Qa = \u221260 + 4(P + 4) = \u221244 + 4P (1p)",
      "300 \u2013 5P = \u221244 + 4P \u2192 344 = 9P \u2192 P_consument = 38,22 (1p)",
      "Q* = 300 \u2013 5 \u00d7 38,22 = 108,9 \u2248 109 (1p)",
    ]));
  }

  return children;
}

// ════════════════════════════════════════════════════════════════════════════════
// EXERCISE CONTENT — MIDDEN (8 vragen, exam-level without scaffolding)
// ════════════════════════════════════════════════════════════════════════════════

function buildMidden(includeAnswers) {
  const children = [];

  children.push(...titleBlock("Naar het examen", includeAnswers ? "Middenopgaven \u2014 Antwoorden" : "Middenopgaven"));
  children.push(sp(200));
  children.push(instructionBox("Examenniveau-vragen zonder hints. Bij elke vraag staat het aantal punten dat je kunt verdienen."));
  children.push(sp(400));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // Opgave 1
  children.push(h2d("Opgave 1 \u2014 De bioscoop", C.dAmber));
  children.push(p("De bioscoopassociatie heeft onderzoek gedaan naar de Nederlandse bioscoopmarkt. Er zijn vier grote ketens (Pathé, Vue, Kinepolis, JT Bioscopen) die samen 75% marktaandeel hebben. De rest is in handen van tientallen kleine zelfstandige bioscopen."));
  children.push(sp(40));
  children.push(punten(2));
  children.push(question("1", "Leg uit bij welke marktvorm de Nederlandse bioscoopmarkt het beste past."));
  if (includeAnswers) {
    children.push(answerBox([
      "Oligopolie. (1p)",
      "Er zijn weinig grote aanbieders die een groot marktaandeel bezitten, het product is heterogeen (verschillende filmzalen, locaties, service), er zijn hoge toetredingsdrempels (investeringen in zalen) en de aanbieders zijn onderling afhankelijk. (1p)",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("2", "Pathé verlaagt de prijs van een kaartje van \u20ac14 naar \u20ac12. De afzet stijgt van 2 miljoen naar 2,5 miljoen per jaar. Bereken de prijselasticiteit van de vraag en beoordeel of de prijsverlaging de totale opbrengst verhoogt."));
  if (includeAnswers) {
    children.push(answerBox([
      "%\u0394Qv = (2,5 \u2013 2) / 2 \u00d7 100% = 25%",
      "%\u0394P = (12 \u2013 14) / 14 \u00d7 100% = \u221214,3%",
      "Ev = 25% / \u221214,3% = \u22121,75 (1p)",
      "De vraag is elastisch (|Ev| > 1). (1p)",
      "TO voor: 14 \u00d7 2.000.000 = \u20ac28.000.000. TO na: 12 \u00d7 2.500.000 = \u20ac30.000.000.",
      "De totale opbrengst stijgt met \u20ac2.000.000. Bij elastische vraag verhoogt een prijsdaling de TO. (1p)",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(200));

  // Opgave 2
  children.push(h2d("Opgave 2 \u2014 Minimumprijs in de landbouw", C.dGreen));
  children.push(p("De Europese Unie hanteert een minimumprijs voor boter. De vraag: Qv = 500 \u2013 2P. Het aanbod: Qa = \u2013100 + 3P. De minimumprijs is \u20ac140."));
  children.push(sp(40));
  children.push(punten(2));
  children.push(question("1", "Bereken het aanbodoverschot bij de minimumprijs."));
  if (includeAnswers) {
    children.push(answerBox([
      "Qv bij P = 140: 500 \u2013 280 = 220 (1p)",
      "Qa bij P = 140: \u2013100 + 420 = 320",
      "Aanbodoverschot = 320 \u2013 220 = 100 eenheden (1p)",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("2", "De EU koopt het overschot op tegen de minimumprijs. Bereken de kosten voor de EU en leg uit waarom dit leidt tot welvaartsverlies."));
  if (includeAnswers) {
    children.push(answerBox([
      "Kosten EU = 100 \u00d7 140 = \u20ac14.000 (1p)",
      "Welvaartsverlies: het evenwicht zonder minimumprijs: P* = 120, Q* = 260. (1p)",
      "Bij de minimumprijs worden 320 eenheden geproduceerd maar slechts 220 verkocht. De 100 overschoteenheden kosten meer om te produceren dan consumenten ervoor willen betalen. Dit is verspilling van productiemiddelen \u2192 welvaartsverlies. (1p)",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(200));

  // Opgave 3
  children.push(h2d("Opgave 3 \u2014 MO = MK bij monopolie", C.dAmber));
  children.push(p("Een monopolist opereert op een markt met vraagfunctie P = 80 \u2013 Q. De totale kostenfunctie is TK = 200 + 10Q + 0,5Q\u00b2."));
  children.push(sp(40));
  children.push(punten(4));
  children.push(question("1", "Bereken de winstmaximaliserende prijs en hoeveelheid, en de maximale winst."));
  if (includeAnswers) {
    children.push(answerBox([
      "TO = P \u00d7 Q = (80 \u2013 Q) \u00d7 Q = 80Q \u2013 Q\u00b2",
      "MO = 80 \u2013 2Q",
      "MK = 10 + Q (1p)",
      "MO = MK: 80 \u2013 2Q = 10 + Q \u2192 70 = 3Q \u2192 Q* = 23\u2153 (1p)",
      "P* = 80 \u2013 23\u2153 = 56\u2154 (1p)",
      "Winst = TO \u2013 TK = (56\u2154 \u00d7 23\u2153) \u2013 (200 + 10 \u00d7 23\u2153 + 0,5 \u00d7 23\u2153\u00b2)",
      "= 1.322,22 \u2013 (200 + 233,33 + 272,22) = 1.322,22 \u2013 705,56 = \u20ac616,67 (1p)",
    ]));
  } else {
    children.push(...answerSpace(7));
  }
  children.push(sp(80));

  children.push(punten(2));
  children.push(question("2", "Bij volkomen concurrentie zou P = MK gelden. Bereken de hoeveelheid en prijs bij volkomen concurrentie."));
  if (includeAnswers) {
    children.push(answerBox([
      "P = MK: 80 \u2013 Q = 10 + Q \u2192 70 = 2Q \u2192 Q = 35 (1p)",
      "P = 80 \u2013 35 = \u20ac45 (1p)",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(200));

  // Opgave 4
  children.push(h2d("Opgave 4 \u2014 Belasting en verdeling", C.dGreen));
  children.push(p("Op de markt voor benzine geldt: Qv = 1000 \u2013 5P en Qa = \u2013500 + 10P. De overheid heft een accijns van \u20ac12 per liter."));
  children.push(sp(40));
  children.push(punten(3));
  children.push(question("1", "Bereken hoeveel van de belasting de consument draagt en hoeveel de producent."));
  if (includeAnswers) {
    children.push(answerBox([
      "V\u00f3\u00f3r: 1000 \u2013 5P = \u2013500 + 10P \u2192 1500 = 15P \u2192 P* = 100 (1p)",
      "Na: Qa = \u2013500 + 10(P \u2013 12) = \u2013620 + 10P",
      "1000 \u2013 5P = \u2013620 + 10P \u2192 1620 = 15P \u2192 P_cons = 108",
      "P_prod = 108 \u2013 12 = 96",
      "Consument draagt: 108 \u2013 100 = \u20ac8 (1p)",
      "Producent draagt: 100 \u2013 96 = \u20ac4 (1p)",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(80));

  children.push(punten(2));
  children.push(question("2", "Leg uit waarom de producent een kleiner deel van de belasting draagt. Gebruik het begrip prijselasticiteit."));
  if (includeAnswers) {
    children.push(answerBox([
      "Het aanbod is relatief elastischer dan de vraag (de aanbodcurve is vlakker dan de vraagcurve). (1p)",
      "Bij een elastischer aanbod kan de producent de belasting gemakkelijker doorberekenen aan de consument. De partij met de meest inelastische curve draagt het grootste deel van de belasting \u2014 in dit geval de consument. (1p)",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(200));

  // Opgave 5
  children.push(h2d("Opgave 5 \u2014 Handelswinst berekenen", C.dBlueDk));
  children.push(p("Land M kan per week 30 machines of 90 ton voedsel produceren."));
  children.push(p("Land N kan per week 20 machines of 40 ton voedsel produceren."));
  children.push(p("De ruilvoet is 1 machine = 2,5 ton voedsel."));
  children.push(sp(40));
  children.push(punten(2));
  children.push(question("1", "Bepaal welk land zich moet specialiseren in machines en welk land in voedsel."));
  if (includeAnswers) {
    children.push(answerBox([
      "Alternatieve kosten 1 machine: Land M = 3 voedsel, Land N = 2 voedsel.",
      "Land N heeft comparatief voordeel in machines (lagere alt. kosten). (1p)",
      "Land M heeft comparatief voordeel in voedsel (alt. kosten 1 voedsel = 1/3 machine vs. 1/2 machine). (1p)",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("2", "Land N exporteert 15 machines. Bereken de handelswinst voor beide landen."));
  if (includeAnswers) {
    children.push(answerBox([
      "Land N exporteert 15 machines en importeert 15 \u00d7 2,5 = 37,5 ton voedsel. (1p)",
      "Land N: zonder handel kosten 37,5 ton voedsel 37,5 \u00d7 0,5 = 18,75 machines. Nu kost het 15 machines. Winst: 3,75 machines. (1p)",
      "Land M: zonder handel kosten 15 machines 15 \u00d7 3 = 45 ton voedsel. Nu kost het 37,5 ton voedsel. Winst: 7,5 ton voedsel. (1p)",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(200));

  // Opgave 6
  children.push(h2d("Opgave 6 \u2014 Ruilvoet en welvaart", C.dBlueDk));
  children.push(p("De tabel toont de export- en importprijsindexen van land K."));
  children.push(sp(40));

  // Simple table
  const tableData = [
    ["Jaar", "Exportprijsindex", "Importprijsindex"],
    ["2022", "100", "100"],
    ["2023", "110", "105"],
    ["2024", "115", "120"],
    ["2025", "120", "135"],
  ];

  const tableRows = tableData.map((row, idx) => new TableRow({
    children: row.map(cell => new TableCell({
      width: { size: Math.floor(CW / 3), type: WidthType.DXA },
      shading: idx === 0
        ? { fill: C.dBlue, type: ShadingType.CLEAR }
        : idx % 2 === 0 ? { fill: C.rowAlt, type: ShadingType.CLEAR } : {},
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({
          text: cell, font: "Arial", size: 20,
          bold: idx === 0, color: idx === 0 ? C.white : C.dark,
        })],
      })],
    })),
  }));

  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    rows: tableRows,
  }));
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("1", "Bereken de ruilvoet voor elk jaar en beschrijf de trend."));
  if (includeAnswers) {
    children.push(answerBox([
      "2022: (100/100) \u00d7 100 = 100,0",
      "2023: (110/105) \u00d7 100 = 104,8",
      "2024: (115/120) \u00d7 100 = 95,8",
      "2025: (120/135) \u00d7 100 = 88,9 (2p voor berekeningen)",
      "De ruilvoet steeg eerst in 2023, maar daalt sindsdien sterk. Vanaf 2024 is de ruilvoet onder 100 gezakt, wat betekent dat land K steeds meer moet exporteren om dezelfde import te bekostigen. (1p)",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(80));

  children.push(punten(2));
  children.push(question("2", "Noem twee beleidsmaatregelen die land K kan nemen om de dalende ruilvoet te verbeteren."));
  if (includeAnswers) {
    children.push(answerBox([
      "1. Investeren in innovatie en productdifferentiatie zodat exportproducten hoogwaardiger worden en hogere prijzen opleveren. (1p)",
      "2. Handelsafspraken sluiten of importsubstitutie bevorderen om de afhankelijkheid van dure importgoederen te verminderen. (1p)",
    ]));
  } else {
    children.push(...answerSpace(4));
  }

  return children;
}

// ════════════════════════════════════════════════════════════════════════════════
// EXERCISE CONTENT — VERRIJKING (6 vragen, extended exam questions)
// ════════════════════════════════════════════════════════════════════════════════

function buildVerrijking(includeAnswers) {
  const children = [];

  children.push(...titleBlock("Naar het examen", includeAnswers ? "Verrijkingsopgaven \u2014 Antwoorden" : "Verrijkingsopgaven"));
  children.push(sp(200));
  children.push(instructionBox("Uitgebreide examenvragen met meerdere deelvragen. Deze vragen vereisen analyse, synthese en evaluatie op hoog niveau."));
  children.push(sp(400));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // Opgave 1
  children.push(h2d("Opgave 1 \u2014 De Nederlandse telecommarkt (14p)", C.dAmber));
  children.push(p("De Nederlandse telecommarkt wordt gedomineerd door drie grote aanbieders: KPN, T-Mobile en Vodafone. Samen hebben zij circa 85% marktaandeel. Daarnaast zijn er kleinere aanbieders zoals Tele2 en budget-merken."));
  children.push(sp(40));

  children.push(punten(2));
  children.push(question("a", "Beredeneer bij welke marktvorm de telecommarkt past. Gebruik ten minste drie kenmerken."));
  if (includeAnswers) {
    children.push(answerBox([
      "Heterogeen oligopolie. (1p)",
      "Kenmerken: (1) weinig grote aanbieders met groot marktaandeel, (2) heterogeen product (verschillende bundels, netwerkkwaliteit, service), (3) hoge toetredingsdrempels (investeringen in netwerk, frequentielicenties), (4) onderlinge afhankelijkheid bij prijsbeslissingen. (1p)",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("b", "KPN overweegt een prijsverlaging. De marktaandelen zijn: KPN 40%, T-Mobile 25%, Vodafone 20%, overig (5 aanbieders) 15%. Bereken de HHI v\u00f3\u00f3r en na een hypothetische fusie van T-Mobile en Vodafone."));
  if (includeAnswers) {
    children.push(answerBox([
      "V\u00f3\u00f3r fusie: HHI = 40\u00b2 + 25\u00b2 + 20\u00b2 + 5 \u00d7 3\u00b2 = 1600 + 625 + 400 + 45 = 2670 (1p)",
      "Na fusie: T-Mobile + Vodafone = 45%. HHI = 40\u00b2 + 45\u00b2 + 5 \u00d7 3\u00b2 = 1600 + 2025 + 45 = 3670 (1p)",
      "\u0394HHI = 3670 \u2013 2670 = 1000 punten. Dit is een zeer grote stijging die de ACM vrijwel zeker zal blokkeren. (1p)",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("c", "Leg uit waarom een prisoners\u2019 dilemma kan ontstaan als KPN zijn prijs verlaagt. Gebruik een concrete rekenvoorbeeld."));
  if (includeAnswers) {
    children.push(answerBox([
      "Stel: alle aanbieders vragen \u20ac25/maand. KPN verlaagt naar \u20ac22 en wint marktaandeel. (1p)",
      "T-Mobile en Vodafone verliezen klanten en worden gedwongen ook te verlagen naar \u20ac22 of lager. (1p)",
      "Resultaat: alle drie verdienen minder per klant. Collectief hadden ze beter af geweest bij \u20ac25. Individueel is verlagen rationeel (je verliest anders klanten), maar collectief zijn alle aanbieders slechter af. Dit is het prisoners\u2019 dilemma. (1p)",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("d", "De vraag naar mobiele abonnementen is: Qv = 20 \u2013 0,5P (in miljoenen). De aanbodcurve is: Qa = \u20134 + 0,25P. De overheid subsidieert mobiel internet voor onderwijsdoeleinden met \u20ac6 per abonnement. Bereken het effect op prijs, hoeveelheid en de totale kosten voor de overheid."));
  if (includeAnswers) {
    children.push(answerBox([
      "V\u00f3\u00f3r subsidie: 20 \u2013 0,5P = \u20134 + 0,25P \u2192 24 = 0,75P \u2192 P* = 32, Q* = 4 miljoen",
      "Na subsidie: Qa = \u20134 + 0,25(P + 6) = \u20132,5 + 0,25P",
      "20 \u2013 0,5P = \u20132,5 + 0,25P \u2192 22,5 = 0,75P \u2192 P_cons = 30 (1p)",
      "Q* = 20 \u2013 0,5 \u00d7 30 = 5 miljoen (1p)",
      "Totale kosten overheid = 6 \u00d7 5.000.000 = \u20ac30.000.000 (1p)",
    ]));
  } else {
    children.push(...answerSpace(7));
  }
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("e", "Beoordeel of de subsidie uit deelvraag d effici\u00ebnt is. Gebruik de begrippen positief extern effect, consumentensurplus en overheidsuitgaven."));
  if (includeAnswers) {
    children.push(answerBox([
      "De subsidie is effici\u00ebnt als het positieve externe effect (beter onderwijs) groter is dan de kosten voor de overheid (\u20ac30 miljoen). (1p)",
      "Het consumentensurplus stijgt: consumenten betalen \u20ac2 minder (\u20ac32 \u2192 \u20ac30) en 1 miljoen extra abonnementen worden afgesloten. CS-stijging = (stijging door lagere prijs) + (extra abonnementen). (1p)",
      "Of de subsidie netto-welvaartsverhogend is, hangt af van de omvang van het externe effect. Als de maatschappelijke baten van beter onderwijs hoger zijn dan \u20ac30 miljoen, is de subsidie effici\u00ebnt. Zo niet, dan is er sprake van overheidsfalen. (1p)",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(200));

  // Opgave 2
  children.push(h2d("Opgave 2 \u2014 Klimaatbeleid en marktwerking (12p)", C.dGreen));
  children.push(p("De Europese Unie heeft een CO\u2082-emissiehandelssysteem (ETS) ingevoerd. Bedrijven moeten emissierechten kopen om CO\u2082 uit te stoten. De prijs van een emissierecht is momenteel \u20ac90 per ton CO\u2082."));
  children.push(sp(40));

  children.push(punten(3));
  children.push(question("a", "Leg uit hoe het ETS-systeem werkt als instrument om een negatief extern effect te internaliseren. Gebruik een vraag-en-aanbodmodel."));
  if (includeAnswers) {
    children.push(answerBox([
      "CO\u2082-uitstoot is een negatief extern effect: de maatschappelijke kosten zijn hoger dan de priv\u00e9kosten. (1p)",
      "Het ETS verplicht bedrijven emissierechten te kopen, waardoor de productiekosten stijgen. De aanbodcurve verschuift omhoog (naar links). (1p)",
      "Het nieuwe evenwicht heeft een hogere prijs en lagere productie. De productie benadert het maatschappelijk optimum (waar vraag = maatschappelijke kosten). Het welvaartsverlies door het externe effect wordt zo verminderd. (1p)",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(80));

  children.push(punten(4));
  children.push(question("b", "De staalindustrie heeft de volgende priv\u00e9-aanbodfunctie: Qa = \u2013200 + 5P. De vraag is: Qv = 800 \u2013 2P. Elke eenheid staal veroorzaakt 2 ton CO\u2082-uitstoot. Bereken: (1) het marktevenwicht zonder ETS, (2) het evenwicht met ETS (\u20ac90/ton), en (3) de daling van de CO\u2082-uitstoot."));
  if (includeAnswers) {
    children.push(answerBox([
      "(1) Zonder ETS: 800 \u2013 2P = \u2013200 + 5P \u2192 1000 = 7P \u2192 P* = 142,86, Q* = 514,3 (1p)",
      "(2) Met ETS: extra kosten = 2 \u00d7 90 = \u20ac180 per eenheid. Nieuwe aanbod: Qa = \u2013200 + 5(P \u2013 180) = \u20131100 + 5P",
      "800 \u2013 2P = \u20131100 + 5P \u2192 1900 = 7P \u2192 P_cons = 271,43, Q* = 257,1 (1p)",
      "(3) CO\u2082-uitstoot v\u00f3\u00f3r: 514,3 \u00d7 2 = 1028,6 ton. Na: 257,1 \u00d7 2 = 514,2 ton. (1p)",
      "Daling = 1028,6 \u2013 514,2 = 514,4 ton (\u221250%). (1p)",
    ]));
  } else {
    children.push(...answerSpace(8));
  }
  children.push(sp(80));

  children.push(punten(2));
  children.push(question("c", "Europese staalproducenten klagen dat het ETS hen benadeelt ten opzichte van Chinese concurrenten die geen emissiekosten betalen. Leg dit uit met het begrip comparatief voordeel."));
  if (includeAnswers) {
    children.push(answerBox([
      "Door het ETS stijgen de productiekosten van Europees staal, waardoor de alternatieve kosten van staalproductie in Europa toenemen. (1p)",
      "China, dat geen vergelijkbare CO\u2082-kosten heeft, krijgt relatief lagere productiekosten. Het comparatief voordeel van China in staal neemt toe. Europese producenten verliezen marktaandeel op de wereldmarkt, wat kan leiden tot \u2018carbon leakage\u2019: productie verhuist naar landen zonder CO\u2082-heffing, waardoor de totale uitstoot niet daalt. (1p)",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("d", "De EU overweegt een Carbon Border Adjustment Mechanism (CBAM): een importheffing op producten uit landen zonder CO\u2082-prijs. Analyseer de voor- en nadelen met behulp van de begrippen welvaartsverlies, handelswinst en protectie."));
  if (includeAnswers) {
    children.push(answerBox([
      "Voordelen:",
      "\u2022 Voorkomt carbon leakage: productie verhuist niet naar landen zonder CO\u2082-prijs. Het milieudoel wordt beter bereikt. (1p)",
      "\u2022 Gelijk speelveld: Europese producenten concurreren niet langer met producenten die hun externe kosten niet internaliseren.",
      "",
      "Nadelen:",
      "\u2022 Welvaartsverlies door protectie: de importheffing verhoogt de prijs voor consumenten en vermindert de handel. Er ontstaat een deadweight loss. (1p)",
      "\u2022 Verminderde handelswinst: landen verliezen de voordelen van specialisatie op basis van comparatief voordeel.",
      "\u2022 Vergeldingsmaatregelen: handelspartners kunnen tegenmaatregelen nemen, wat tot een handelsconflict leidt. (1p)",
    ]));
  } else {
    children.push(...answerSpace(7));
  }
  children.push(sp(200));

  // Opgave 3
  children.push(h2d("Opgave 3 \u2014 De woningmarkt (11p)", C.dGreen));
  children.push(p("De Nederlandse woningmarkt kent al jaren een tekort aan betaalbare woningen. De vraag naar koopwoningen is: Qv = 1200 \u2013 P (in duizenden). Het aanbod: Qa = \u2013300 + 0,5P."));
  children.push(sp(40));

  children.push(punten(2));
  children.push(question("a", "Bereken het evenwicht en het totale surplus (CS + PS)."));
  if (includeAnswers) {
    children.push(answerBox([
      "1200 \u2013 P = \u2013300 + 0,5P \u2192 1500 = 1,5P \u2192 P* = 1000 (\u00d71000 = \u20ac1.000.000), Q* = 200 (duizend) (1p)",
      "CS = \u00bd \u00d7 200 \u00d7 (1200 \u2013 1000) = 20.000. PS = \u00bd \u00d7 200 \u00d7 (1000 \u2013 600) = 40.000.",
      "Totaal surplus = 60.000 (in eenheden \u00d7 duizend euro). (1p)",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("b", "De overheid stelt een overdrachtsbelasting van 8% in (was 2%). Dit verhoogt de effectieve koopprijs. Modelleer dit als een belasting van 60 (\u00d71000) op kopers. Bereken het nieuwe evenwicht en de belastingopbrengst."));
  if (includeAnswers) {
    children.push(answerBox([
      "De koper betaalt P + 60 effectief. Nieuwe vraag: Qv = 1200 \u2013 (P + 60) = 1140 \u2013 P. (1p)",
      "1140 \u2013 P = \u2013300 + 0,5P \u2192 1440 = 1,5P \u2192 P_verkoper = 960. (1p)",
      "Q* = \u2013300 + 480 = 180. P_koper_effectief = 960 + 60 = 1020.",
      "Belastingopbrengst = 60 \u00d7 180 = 10.800 (\u00d71000\u00b2 = \u20ac10,8 miljard). (1p)",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("c", "Bereken het welvaartsverlies door de belasting en leg uit hoe dit verdeeld is."));
  if (includeAnswers) {
    children.push(answerBox([
      "DWL = \u00bd \u00d7 (200 \u2013 180) \u00d7 60 = \u00bd \u00d7 20 \u00d7 60 = 600 (1p)",
      "Koper draagt: 1020 \u2013 1000 = 20 per transactie bij 180 transacties + deel van DWL. (1p)",
      "Verkoper draagt: 1000 \u2013 960 = 40 per transactie bij 180 transacties + deel van DWL.",
      "De verkoper draagt een groter deel van de belasting (40 vs. 20) omdat de aanbodcurve steiler is (minder elastisch) dan de vraagcurve. (1p)",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("d", "Beoordeel of een hogere overdrachtsbelasting een effectief instrument is om de woningmarkt te reguleren. Betrek in je analyse: het effect op woningaanbod, het effect op doorstroming, en mogelijke alternatieven."));
  if (includeAnswers) {
    children.push(answerBox([
      "Effecten op aanbod: de hogere belasting ontmoedigt transacties maar verhoogt het aanbod niet. Het aantal woningen dat gebouwd wordt, hangt af van andere factoren (bouwvergunningen, grondprijzen). (1p)",
      "Effect op doorstroming: hogere transactiekosten ontmoedigen verhuizen. Mensen blijven in te grote of te kleine woningen zitten (\u2018lock-in effect\u2019). Dit vermindert de effici\u00ebntie van de woningmarkt. (1p)",
      "Alternatieven: directe subsidie voor nieuwbouw verschuift de aanbodcurve naar rechts en vergroot het woningaanbod zonder doorstroming te belemmeren. Of: afschaffen van de hypotheekrenteaftrek remt de vraag naar duurdere woningen. (1p)",
    ]));
  } else {
    children.push(...answerSpace(7));
  }
  children.push(sp(200));

  // Opgave 4
  children.push(h2d("Opgave 4 \u2014 Wereldhandel in koffie (10p)", C.dBlueDk));
  children.push(p("Brazili\u00eb en Vietnam zijn de twee grootste koffieproducenten ter wereld. Brazili\u00eb produceert jaarlijks 60 miljoen zakken koffie en kan daarnaast 30 miljoen ton sojabonen produceren. Vietnam produceert 30 miljoen zakken koffie en kan daarnaast 10 miljoen ton rijst produceren."));
  children.push(sp(40));

  children.push(punten(2));
  children.push(question("a", "Bereken de alternatieve kosten van 1 miljoen zakken koffie in beide landen."));
  if (includeAnswers) {
    children.push(answerBox([
      "Brazili\u00eb: 1 miljoen zakken koffie kost 30/60 = 0,5 miljoen ton sojabonen. (1p)",
      "Vietnam: 1 miljoen zakken koffie kost 10/30 = 0,333 miljoen ton rijst. (1p)",
    ]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(80));

  children.push(punten(2));
  children.push(question("b", "Een klimaatschok verwoest 30% van de Braziliaanse koffieoogst. Analyseer het effect op de wereldmarktprijs van koffie met een vraag-en-aanbodmodel."));
  if (includeAnswers) {
    children.push(answerBox([
      "Het wereldaanbod van koffie daalt doordat Brazili\u00eb 30% minder koffie levert (van 60 naar 42 miljoen zakken). De aanbodcurve verschuift naar links. (1p)",
      "Bij gelijkblijvende vraag stijgt de evenwichtsprijs van koffie. De evenwichtshoeveelheid daalt. Het consumentensurplus daalt, en de producenten die nog wel leveren, profiteren van de hogere prijs (PS per eenheid stijgt). (1p)",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("c", "De exportprijsindex van Vietnam stijgt van 100 naar 115 door de hogere koffieprijs. De importprijsindex stijgt van 100 naar 108. Bereken de ruilvoetverandering en leg uit of Vietnam profiteert van de klimaatschok in Brazili\u00eb."));
  if (includeAnswers) {
    children.push(answerBox([
      "Ruilvoet v\u00f3\u00f3r: (100/100) \u00d7 100 = 100.",
      "Ruilvoet na: (115/108) \u00d7 100 = 106,5. (1p)",
      "De ruilvoet is gestegen met 6,5 punten. Vietnam kan met minder export meer importeren. (1p)",
      "Vietnam profiteert: de hogere koffieprijs verhoogt de exportopbrengsten, terwijl de importkosten minder sterk stijgen. Maar dit is op korte termijn \u2014 op lange termijn kan de hogere koffieprijs de wereldvraag doen dalen. (1p)",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(80));

  children.push(punten(3));
  children.push(question("d", "Beoordeel of het voor ontwikkelingslanden als Vietnam verstandig is om sterk afhankelijk te zijn van \u00e9\u00e9n exportproduct. Gebruik de begrippen ruilvoet, comparatief voordeel en diversificatie."));
  if (includeAnswers) {
    children.push(answerBox([
      "Voordelen van specialisatie: door zich te richten op koffie benut Vietnam zijn comparatief voordeel volledig. Dit maximaliseert de handelswinst. (1p)",
      "Nadelen van afhankelijkheid: de ruilvoet is kwetsbaar voor wereldmarktschommelingen. Als de koffieprijs daalt (bijv. door overproductie), daalt de ruilvoet sterk en verslechtert de handelspositie. (1p)",
      "Conclusie: diversificatie is verstandig. Door te investeren in meerdere exportproducten (bijv. elektronica, textiel) wordt de economie minder kwetsbaar voor prijsschommelingen van \u00e9\u00e9n product, ook al gaat dit ten koste van volledige specialisatie. (1p)",
    ]));
  } else {
    children.push(...answerSpace(6));
  }

  return children;
}

// ════════════════════════════════════════════════════════════════════════════════
// BUILD ALL 6 DOCUMENTS
// ════════════════════════════════════════════════════════════════════════════════

function createDoc(buildFn, includeAnswers, headerText) {
  return new Document({
    styles: DOC_STYLES,
    sections: [{
      properties: { page: PAGE },
      headers: { default: makeHeader(headerText) },
      footers: { default: makeFooter() },
      children: buildFn(includeAnswers),
    }],
  });
}

const LEVELS = [
  { name: "basis", label: "Basisopgaven", buildFn: buildBasis, folder: "basisopgaven" },
  { name: "midden", label: "Middenopgaven", buildFn: buildMidden, folder: "middenopgaven" },
  { name: "verrijking", label: "Verrijkingsopgaven", buildFn: buildVerrijking, folder: "verrijkingsopgaven" },
];

(async () => {
  try {
    for (const level of LEVELS) {
      const dir = path.join(BASE_DIR, level.folder);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log("Created directory:", dir);
      }

      const headerText = `Naar het examen \u2014 ${level.label}`;

      // Vragen
      const vragenFile = path.join(dir, `${PREFIX} \u2013 ${level.name} \u2013 vragen.docx`);
      const vragenDoc = createDoc(level.buildFn, false, headerText);
      const vragenBuf = await Packer.toBuffer(vragenDoc);
      fs.writeFileSync(vragenFile, vragenBuf);
      console.log(`OK: ${path.basename(vragenFile)} (${vragenBuf.length} bytes)`);

      // Antwoorden
      const antwoordenFile = path.join(dir, `${PREFIX} \u2013 ${level.name} \u2013 antwoorden.docx`);
      const antwoordenDoc = createDoc(level.buildFn, true, headerText);
      const antwoordenBuf = await Packer.toBuffer(antwoordenDoc);
      fs.writeFileSync(antwoordenFile, antwoordenBuf);
      console.log(`OK: ${path.basename(antwoordenFile)} (${antwoordenBuf.length} bytes)`);
    }

    console.log("\nDone! All 6 documents for 3.5.2 Naar het examen created.");
  } catch (err) {
    console.error("ERROR:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();
