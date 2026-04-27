/**
 * Build script: 3.5.1 Afsluiting — Opgavensets (basis, midden, verrijking)
 * Generates 6 documents: vragen + antwoorden for each of the 3 levels.
 *
 * Content: Review questions across all 4 chapters of Module 3 (Markt en overheid).
 * - Basis: knowledge recall, simple application (10 questions)
 * - Midden: cross-chapter application and analysis (8 questions)
 * - Verrijking: complex synthesis and evaluation (6 questions)
 *
 * HOW TO ADAPT:
 * 1. Change BASE_DIR and file naming
 * 2. Replace exercise content in buildBasis/buildMidden/buildVerrijking
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/opgaven-351-afsluiting.js
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
const BASE_DIR = `C:\\Projects\\4veco\\3. Module 3 - Markt en overheid\\3.5 Hoofdstuk 5 - Afsluiting\\3.5.1 Paragraaf 1 - Afsluiting\\3. Oefenen`;
const PREFIX = "3.5.1 Afsluiting";

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

const pRuns = (runs) => new Paragraph({
  spacing: { after: 120 },
  children: runs.map(r => new TextRun({ font: "Arial", size: 22, color: C.dark, ...r })),
});

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

// ─── Tip / Instruction / Warning boxes ───
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

function warningBox(text) {
  return tipBox(text, C.red, C.lightRed, "\u26A0 Let op: ");
}

// ─── Answer box (green accent) ───
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

// ─── Answer space (dotted lines for vragen doc) ───
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

// ─── Question paragraph ───
function question(label, text) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: label + "  ", bold: true, font: "Arial", size: 22, color: C.dark }),
      new TextRun({ text, font: "Arial", size: 22, color: C.dark }),
    ],
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
// EXERCISE CONTENT — BASIS (10 vragen, per-chapter review)
// ════════════════════════════════════════════════════════════════════════════════

function buildBasis(includeAnswers) {
  const children = [];

  children.push(...titleBlock("Afsluiting", includeAnswers ? "Basisopgaven \u2014 Antwoorden" : "Basisopgaven"));
  children.push(sp(200));
  children.push(instructionBox("Deze opgavenset bevat herhalingsvragen uit alle hoofdstukken van Module 3. Gebruik je samenvatting en aantekeningen als naslagwerk."));
  children.push(sp(400));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ── Hoofdstuk 1: Markten ──
  children.push(h2d("Hoofdstuk 1 \u2014 Markten", C.dBlue));
  children.push(sp(40));

  // Vraag 1
  children.push(h2d("Opgave 1", C.dBlue));
  children.push(question("a", "Leg uit wat het verschil is tussen een concrete markt en een abstracte markt."));
  if (includeAnswers) {
    children.push(answerBox(["Een concrete markt is een fysieke plaats waar kopers en verkopers samenkomen (bijv. de weekmarkt). Een abstracte markt is het geheel van vraag en aanbod zonder vaste locatie (bijv. de woningmarkt in Nederland)."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(80));

  children.push(question("b", "Noem twee voorbeelden van toetredingsdrempels op een markt."));
  if (includeAnswers) {
    children.push(answerBox([
      "Bijvoorbeeld:",
      "1. Hoge investeringskosten (bijv. een eigen netwerk aanleggen).",
      "2. Vergunningen of wettelijke beperkingen (bijv. taxivergunningen).",
    ]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(80));

  children.push(question("c", "Leg uit wat het verschil is tussen een homogeen en een heterogeen product."));
  if (includeAnswers) {
    children.push(answerBox(["Bij een homogeen product zien consumenten de producten van verschillende aanbieders als identiek (bijv. suiker). Bij een heterogeen product zijn er in de ogen van consumenten verschillen tussen aanbieders (bijv. smartphones)."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(200));

  // ── Hoofdstuk 2: Marktvormen ──
  children.push(h2d("Hoofdstuk 2 \u2014 Marktvormen", C.dAmber));
  children.push(sp(40));

  // Vraag 2
  children.push(h2d("Opgave 2", C.dAmber));
  children.push(question("", "Op een markt geldt de volgende vraaglijn: Qv = 200 \u2013 4P en de aanbodfunctie: Qa = \u221240 + 2P. Bereken de evenwichtsprijs en de evenwichtshoeveelheid."));
  if (includeAnswers) {
    children.push(answerBox([
      "In evenwicht geldt: Qv = Qa",
      "200 \u2013 4P = \u221240 + 2P",
      "240 = 6P",
      "P* = 40",
      "Q* = 200 \u2013 4 \u00d7 40 = 40",
      "De evenwichtsprijs is \u20ac40 en de evenwichtshoeveelheid is 40 stuks.",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(80));

  // Vraag 3
  children.push(h2d("Opgave 3", C.dAmber));
  children.push(question("", "Noem de vier marktvormen en geef bij elke marktvorm aan of het product homogeen of heterogeen is."));
  if (includeAnswers) {
    children.push(answerBox([
      "1. Volkomen concurrentie: homogeen product.",
      "2. Monopolistische concurrentie: heterogeen product.",
      "3. Oligopolie: kan homogeen (bijv. staal) of heterogeen (bijv. auto\u2019s) zijn.",
      "4. Monopolie: uniek product (geen substituten).",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(80));

  // Vraag 4
  children.push(h2d("Opgave 4", C.dAmber));
  children.push(question("", "Een monopolist heeft de volgende gegevens: de vraagfunctie is P = 100 \u2013 2Q en de marginale kosten zijn MK = 20 + 2Q. Bereken de winstmaximaliserende prijs en hoeveelheid."));
  if (includeAnswers) {
    children.push(answerBox([
      "De totale opbrengst TO = P \u00d7 Q = (100 \u2013 2Q) \u00d7 Q = 100Q \u2013 2Q\u00b2",
      "Marginale opbrengst MO = dTO/dQ = 100 \u2013 4Q",
      "Winstmaximalisatie: MO = MK",
      "100 \u2013 4Q = 20 + 2Q",
      "80 = 6Q",
      "Q* = 13\u2153 \u2248 13 (afgerond)",
      "P* = 100 \u2013 2 \u00d7 13 = 74",
      "De monopolist produceert circa 13 stuks tegen een prijs van \u20ac74.",
    ]));
  } else {
    children.push(...answerSpace(7));
  }
  children.push(sp(200));

  // ── Hoofdstuk 3: Overheid ──
  children.push(h2d("Hoofdstuk 3 \u2014 Overheid", C.dGreen));
  children.push(sp(40));

  // Vraag 5
  children.push(h2d("Opgave 5", C.dGreen));
  children.push(question("a", "Leg uit wat een maximumprijs is en wanneer de overheid deze instelt."));
  if (includeAnswers) {
    children.push(answerBox(["Een maximumprijs is een door de overheid vastgestelde prijs die lager ligt dan de evenwichtsprijs. De overheid stelt deze in als de marktprijs te hoog wordt geacht voor consumenten, bijvoorbeeld bij huurwoningen."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(80));

  children.push(question("b", "Wat is het gevolg van een maximumprijs voor de markt?"));
  if (includeAnswers) {
    children.push(answerBox(["Er ontstaat een vraagoverschot: de gevraagde hoeveelheid is groter dan de aangeboden hoeveelheid. Aanbieders bieden minder aan tegen de lagere prijs, terwijl consumenten meer willen kopen."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(80));

  // Vraag 6
  children.push(h2d("Opgave 6", C.dGreen));
  children.push(question("", "Leg uit wat een negatief extern effect is en geef een voorbeeld."));
  if (includeAnswers) {
    children.push(answerBox([
      "Een negatief extern effect is een nadeel voor derden dat niet in de prijs van een product is verwerkt.",
      "Voorbeeld: een fabriek die het milieu vervuilt. De kosten van de vervuiling worden niet door de fabriek betaald, maar door de maatschappij gedragen.",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(80));

  // Vraag 7
  children.push(h2d("Opgave 7", C.dGreen));
  children.push(question("", "De overheid heft een belasting van \u20ac5 per eenheid op een product. De vraagfunctie is Qv = 100 \u2013 2P en de aanbodfunctie is Qa = \u221220 + 4P. Bereken de nieuwe evenwichtsprijs die de consument betaalt en de nieuwe evenwichtshoeveelheid."));
  if (includeAnswers) {
    children.push(answerBox([
      "Door de belasting verschuift de aanbodfunctie omhoog met \u20ac5:",
      "Nieuwe aanbodfunctie: Qa = \u221220 + 4(P \u2013 5) = \u221240 + 4P",
      "Evenwicht: 100 \u2013 2P = \u221240 + 4P",
      "140 = 6P",
      "P_consument = 23\u2153 \u2248 \u20ac23,33",
      "Q* = 100 \u2013 2 \u00d7 23,33 = 53,33 \u2248 53 stuks",
      "De producent ontvangt: 23,33 \u2013 5 = \u20ac18,33.",
    ]));
  } else {
    children.push(...answerSpace(7));
  }
  children.push(sp(200));

  // ── Hoofdstuk 4: Internationale markten ──
  children.push(h2d("Hoofdstuk 4 \u2014 Internationale markten", C.dBlueDk));
  children.push(sp(40));

  // Vraag 8
  children.push(h2d("Opgave 8", C.dBlueDk));
  children.push(question("", "Leg uit wat comparatief voordeel is en waarom het leidt tot handelswinst."));
  if (includeAnswers) {
    children.push(answerBox([
      "Een land heeft een comparatief voordeel in een product als het dat product kan maken tegen lagere alternatieve kosten dan het andere land.",
      "Als beide landen zich specialiseren in het product waarin ze een comparatief voordeel hebben en vervolgens handelen, kunnen ze samen meer produceren. Beide landen gaan er dan op vooruit: dat is de handelswinst.",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(80));

  // Vraag 9
  children.push(h2d("Opgave 9", C.dBlueDk));
  children.push(p("Land A en land B produceren twee goederen: fietsen en brood."));
  children.push(p("Land A kan per dag 10 fietsen of 50 broden produceren."));
  children.push(p("Land B kan per dag 8 fietsen of 20 broden produceren."));
  children.push(sp(40));
  children.push(question("a", "Bereken de alternatieve kosten van \u00e9\u00e9n fiets in beide landen."));
  if (includeAnswers) {
    children.push(answerBox([
      "Land A: 1 fiets kost 50/10 = 5 broden.",
      "Land B: 1 fiets kost 20/8 = 2,5 broden.",
    ]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(80));

  children.push(question("b", "Welk land heeft een comparatief voordeel in de productie van fietsen? Verklaar je antwoord."));
  if (includeAnswers) {
    children.push(answerBox(["Land B heeft een comparatief voordeel in fietsen, want de alternatieve kosten van een fiets zijn daar lager (2,5 broden) dan in land A (5 broden)."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(80));

  // Vraag 10
  children.push(h2d("Opgave 10", C.dBlueDk));
  children.push(question("", "Leg uit wat de ruilvoet is en wat het betekent als de ruilvoet van een land daalt."));
  if (includeAnswers) {
    children.push(answerBox([
      "De ruilvoet is de verhouding tussen de prijsindex van de export en de prijsindex van de import, vermenigvuldigd met 100:",
      "Ruilvoet = (exportprijsindex / importprijsindex) \u00d7 100",
      "Als de ruilvoet daalt, moet een land meer exporteren om dezelfde hoeveelheid import te kunnen betalen. Het land gaat er dus op achteruit.",
    ]));
  } else {
    children.push(...answerSpace(4));
  }

  return children;
}

// ════════════════════════════════════════════════════════════════════════════════
// EXERCISE CONTENT — MIDDEN (8 vragen, cross-chapter)
// ════════════════════════════════════════════════════════════════════════════════

function buildMidden(includeAnswers) {
  const children = [];

  children.push(...titleBlock("Afsluiting", includeAnswers ? "Middenopgaven \u2014 Antwoorden" : "Middenopgaven"));
  children.push(sp(200));
  children.push(instructionBox("Deze opgaven combineren stof uit meerdere hoofdstukken. Je moet verbanden leggen en inzichten toepassen."));
  children.push(sp(400));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // Vraag 1
  children.push(h2d("Opgave 1", C.dAmber));
  children.push(p("Op de markt voor biologische melk geldt: Qv = 300 \u2013 5P en Qa = \u221260 + 3P."));
  children.push(sp(40));
  children.push(question("a", "Bereken de evenwichtsprijs en de evenwichtshoeveelheid."));
  if (includeAnswers) {
    children.push(answerBox([
      "300 \u2013 5P = \u221260 + 3P",
      "360 = 8P",
      "P* = 45",
      "Q* = 300 \u2013 5 \u00d7 45 = 75",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(80));

  children.push(question("b", "Bereken het consumentensurplus en het producentensurplus."));
  if (includeAnswers) {
    children.push(answerBox([
      "De maximale betalingsbereidheid (Qv = 0): P = 300/5 = 60",
      "Consumentensurplus = \u00bd \u00d7 75 \u00d7 (60 \u2013 45) = \u00bd \u00d7 75 \u00d7 15 = \u20ac562,50",
      "De minimale aanbodprijs (Qa = 0): P = 60/3 = 20",
      "Producentensurplus = \u00bd \u00d7 75 \u00d7 (45 \u2013 20) = \u00bd \u00d7 75 \u00d7 25 = \u20ac937,50",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(80));

  children.push(question("c", "De overheid stelt een maximumprijs van \u20ac35 in. Bereken het vraagoverschot."));
  if (includeAnswers) {
    children.push(answerBox([
      "Qv bij P = 35: 300 \u2013 5 \u00d7 35 = 125",
      "Qa bij P = 35: \u221260 + 3 \u00d7 35 = 45",
      "Vraagoverschot = 125 \u2013 45 = 80 stuks.",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(200));

  // Vraag 2
  children.push(h2d("Opgave 2", C.dAmber));
  children.push(p("Een oligopolist overweegt zijn prijs te verlagen van \u20ac50 naar \u20ac45."));
  children.push(p("Bij \u20ac50 verkoopt hij 200 stuks. De prijselasticiteit van de vraag is \u22121,5."));
  children.push(sp(40));
  children.push(question("a", "Bereken de verwachte afzetverandering bij de prijsverlaging."));
  if (includeAnswers) {
    children.push(answerBox([
      "Ev = %\u0394Qv / %\u0394P",
      "%\u0394P = (45 \u2013 50) / 50 \u00d7 100% = \u221210%",
      "\u22121,5 = %\u0394Qv / \u221210%",
      "%\u0394Qv = \u22121,5 \u00d7 \u221210% = 15%",
      "Afzetverandering = 15% \u00d7 200 = 30 stuks extra. Nieuwe afzet: 230 stuks.",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(80));

  children.push(question("b", "Leg uit waarom concurrenten op een oligopolie waarschijnlijk ook hun prijs verlagen. Welk marktdilemma speelt hier?"));
  if (includeAnswers) {
    children.push(answerBox([
      "Op een oligopolie zijn er weinig aanbieders die sterk van elkaar afhankelijk zijn. Als \u00e9\u00e9n aanbieder de prijs verlaagt, verliezen de concurrenten klanten. Ze worden gedwongen om ook te volgen.",
      "Dit is het prisoners\u2019 dilemma: individueel lijkt prijsverlaging rationeel, maar collectief zijn alle aanbieders slechter af door lagere marges.",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(200));

  // Vraag 3
  children.push(h2d("Opgave 3", C.dGreen));
  children.push(p("De productie van staal veroorzaakt CO\u2082-uitstoot. De maatschappelijke kosten zijn \u20ac15 per ton hoger dan de priv\u00e9kosten."));
  children.push(p("De vraagfunctie voor staal is: Qv = 500 \u2013 2P"));
  children.push(p("De priv\u00e9-aanbodfunctie is: Qa = \u2013100 + 4P"));
  children.push(sp(40));
  children.push(question("a", "Bereken het marktevenwicht zonder overheidsingrijpen."));
  if (includeAnswers) {
    children.push(answerBox([
      "500 \u2013 2P = \u2013100 + 4P",
      "600 = 6P",
      "P* = 100, Q* = 500 \u2013 200 = 300",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(80));

  children.push(question("b", "De overheid heft een belasting van \u20ac15 per ton. Bereken het nieuwe evenwicht."));
  if (includeAnswers) {
    children.push(answerBox([
      "Nieuwe aanbodfunctie: Qa = \u2013100 + 4(P \u2013 15) = \u2013160 + 4P",
      "500 \u2013 2P = \u2013160 + 4P",
      "660 = 6P",
      "P_consument = 110, Q* = 500 \u2013 220 = 280",
      "P_producent = 110 \u2013 15 = 95",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(80));

  children.push(question("c", "Leg uit waarom deze belasting het welvaartsverlies vermindert."));
  if (includeAnswers) {
    children.push(answerBox([
      "Zonder belasting produceert de markt meer staal dan maatschappelijk optimaal is. De maatschappelijke kosten (inclusief mileuschade) zijn bij die eenheden hoger dan de baten.",
      "De belasting brengt de prijs dichter bij de maatschappelijke kosten, waardoor de productie daalt naar het maatschappelijk optimale niveau. Het welvaartsverlies door het negatieve externe effect wordt zo verminderd.",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(200));

  // Vraag 4
  children.push(h2d("Opgave 4", C.dBlueDk));
  children.push(p("Land X en land Y produceren twee goederen: laptops en t-shirts."));
  children.push(p("Land X kan per maand 60 laptops of 300 t-shirts produceren."));
  children.push(p("Land Y kan per maand 40 laptops of 100 t-shirts produceren."));
  children.push(sp(40));
  children.push(question("a", "Bereken de alternatieve kosten van \u00e9\u00e9n laptop en \u00e9\u00e9n t-shirt in beide landen."));
  if (includeAnswers) {
    children.push(answerBox([
      "Land X: 1 laptop kost 300/60 = 5 t-shirts; 1 t-shirt kost 60/300 = 0,2 laptops.",
      "Land Y: 1 laptop kost 100/40 = 2,5 t-shirts; 1 t-shirt kost 40/100 = 0,4 laptops.",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(80));

  children.push(question("b", "In welk product moet elk land zich specialiseren? Verklaar via comparatief voordeel."));
  if (includeAnswers) {
    children.push(answerBox([
      "Land Y heeft een comparatief voordeel in laptops (alternatieve kosten 2,5 t-shirts vs. 5 t-shirts in land X).",
      "Land X heeft een comparatief voordeel in t-shirts (alternatieve kosten 0,2 laptops vs. 0,4 laptops in land Y).",
      "Land X specialiseert zich in t-shirts, land Y in laptops.",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(80));

  children.push(question("c", "Bij een ruilvoet van 1 laptop = 4 t-shirts: bereken de handelswinst voor beide landen als land Y 30 laptops exporteert."));
  if (includeAnswers) {
    children.push(answerBox([
      "Land Y exporteert 30 laptops en ontvangt 30 \u00d7 4 = 120 t-shirts.",
      "Land Y: zonder handel zou 30 laptops 30 \u00d7 2,5 = 75 t-shirts kosten. Nu krijgt het 120 t-shirts. Handelswinst = 120 \u2013 75 = 45 t-shirts.",
      "Land X: het levert 120 t-shirts en krijgt 30 laptops. Zonder handel zou 30 laptops 30 \u00d7 5 = 150 t-shirts kosten. Handelswinst = 150 \u2013 120 = 30 t-shirts.",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(200));

  // Vraag 5
  children.push(h2d("Opgave 5", C.dAmber));
  children.push(p("Een markt kent de volgende vraag- en aanbodfuncties: Qv = 400 \u2013 10P en Qa = \u221250 + 5P."));
  children.push(sp(40));
  children.push(question("a", "Bereken het consumentensurplus in het evenwicht."));
  if (includeAnswers) {
    children.push(answerBox([
      "Evenwicht: 400 \u2013 10P = \u221250 + 5P \u2192 450 = 15P \u2192 P* = 30, Q* = 100",
      "Maximale betalingsbereidheid (Qv = 0): P = 40",
      "CS = \u00bd \u00d7 100 \u00d7 (40 \u2013 30) = \u20ac500",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(80));

  children.push(question("b", "De overheid verleent een subsidie van \u20ac6 per eenheid aan producenten. Bereken de nieuwe evenwichtsprijs en -hoeveelheid."));
  if (includeAnswers) {
    children.push(answerBox([
      "Met subsidie ontvangt de producent P + 6. Nieuwe aanbodfunctie: Qa = \u221250 + 5(P + 6) = \u221220 + 5P",
      "400 \u2013 10P = \u221220 + 5P",
      "420 = 15P",
      "P_consument = 28, Q* = 400 \u2013 280 = 120",
      "P_producent (incl. subsidie) = 28 + 6 = 34",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(200));

  // Vraag 6
  children.push(h2d("Opgave 6", C.dGreen));
  children.push(question("", "Een monopolist bepaalt de prijs van een product. Leg uit waarom dit leidt tot een welvaartsverlies vergeleken met volkomen concurrentie. Gebruik de begrippen consumentensurplus, producentensurplus en deadweight loss in je antwoord."));
  if (includeAnswers) {
    children.push(answerBox([
      "Bij volkomen concurrentie geldt P = MK. Bij een monopolist geldt MO = MK, waardoor de prijs hoger is en de hoeveelheid lager dan bij volkomen concurrentie.",
      "Door de hogere prijs verschuift een deel van het consumentensurplus naar de monopolist (producentensurplus neemt toe). Maar de eenheden die niet meer geproduceerd worden, leveren noch consumenten- noch producentensurplus op.",
      "Dit verlies heet het deadweight loss (welvaartsverlies). Het is de driehoek tussen de vraagcurve, de MK-curve, en de evenwichtshoeveelheid van de monopolist.",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(200));

  // Vraag 7
  children.push(h2d("Opgave 7", C.dBlueDk));
  children.push(p("De ruilvoet van land Z verandert van 105 naar 95."));
  children.push(sp(40));
  children.push(question("a", "Leg uit wat deze verandering betekent voor de koopkracht van land Z op de wereldmarkt."));
  if (includeAnswers) {
    children.push(answerBox(["De ruilvoet is gedaald van 105 naar 95. Dit betekent dat de exportprijzen relatief minder gestegen zijn dan de importprijzen. Land Z moet nu meer exporteren om dezelfde hoeveelheid goederen te kunnen importeren. De koopkracht van het land op de wereldmarkt is dus afgenomen."]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(80));

  children.push(question("b", "Noem twee mogelijke oorzaken van een dalende ruilvoet."));
  if (includeAnswers) {
    children.push(answerBox([
      "1. De exportprijzen dalen (bijv. door lagere grondstoffenprijzen op de wereldmarkt).",
      "2. De importprijzen stijgen (bijv. door gestegen olieprijzen).",
    ]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(200));

  // Vraag 8
  children.push(h2d("Opgave 8", C.dAmber));
  children.push(p("Een markt met monopolistische concurrentie kent de volgende kenmerken: veel aanbieders, heterogeen product, en vrije toe- en uittreding."));
  children.push(sp(40));
  children.push(question("a", "Leg uit waarom een aanbieder bij monopolistische concurrentie op korte termijn economische winst kan maken, maar op lange termijn niet."));
  if (includeAnswers) {
    children.push(answerBox([
      "Op korte termijn kan een aanbieder economische winst maken door productdifferentiatie: hij heeft een stukje marktmacht doordat zijn product anders is dan dat van de concurrent.",
      "Op lange termijn treden nieuwe aanbieders toe (vrije toetreding), aangetrokken door de winst. Hierdoor verschuift de individuele vraagcurve naar links en daalt de prijs totdat de economische winst nul is.",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(80));

  children.push(question("b", "Vergelijk de effici\u00ebntie op lange termijn van monopolistische concurrentie met volkomen concurrentie."));
  if (includeAnswers) {
    children.push(answerBox([
      "Bij volkomen concurrentie produceert elk bedrijf op het minimum van de GTK-curve (productief effici\u00ebnt) en geldt P = MK (allocatief effici\u00ebnt).",
      "Bij monopolistische concurrentie produceert het bedrijf links van het minimum van de GTK-curve (niet productief effici\u00ebnt) en geldt P > MK (niet allocatief effici\u00ebnt).",
      "Monopolistische concurrentie is dus minder effici\u00ebnt, maar consumenten profiteren wel van productdifferentiatie (meer keuze).",
    ]));
  } else {
    children.push(...answerSpace(5));
  }

  return children;
}

// ════════════════════════════════════════════════════════════════════════════════
// EXERCISE CONTENT — VERRIJKING (6 vragen, synthesis & evaluation)
// ════════════════════════════════════════════════════════════════════════════════

function buildVerrijking(includeAnswers) {
  const children = [];

  children.push(...titleBlock("Afsluiting", includeAnswers ? "Verrijkingsopgaven \u2014 Antwoorden" : "Verrijkingsopgaven"));
  children.push(sp(200));
  children.push(instructionBox("Deze opgaven vragen om diepgaande analyse en het leggen van verbanden tussen verschillende hoofdstukken. Je moet concepten combineren en evalueren."));
  children.push(sp(400));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // Vraag 1
  children.push(h2d("Opgave 1 \u2014 Marktmacht en welvaart", C.dAmber));
  children.push(p("De Nederlandse energiemarkt is geliberaliseerd: consumenten kunnen kiezen uit meerdere aanbieders. Toch is het aantal aanbieders beperkt en domineren drie grote bedrijven de markt."));
  children.push(sp(40));
  children.push(question("a", "Welke marktvorm past het best bij deze beschrijving? Onderbouw je antwoord met kenmerken."));
  if (includeAnswers) {
    children.push(answerBox([
      "Oligopolie. Er zijn weinig aanbieders die een groot marktaandeel hebben, er zijn hoge toetredingsdrempels (infrastructuur, vergunningen), en de aanbieders zijn onderling afhankelijk bij hun prijsbeslissingen.",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(80));

  children.push(question("b", "De vraagfunctie op de energiemarkt is Qv = 1000 \u2013 2P en de aanbodfunctie Qa = \u2013200 + 4P. Bereken de evenwichtsprijs, evenwichtshoeveelheid, het consumentensurplus en het producentensurplus."));
  if (includeAnswers) {
    children.push(answerBox([
      "1000 \u2013 2P = \u2013200 + 4P \u2192 1200 = 6P \u2192 P* = 200, Q* = 600",
      "Max. betalingsbereidheid: P = 500 (bij Qv = 0)",
      "Min. aanbodprijs: P = 50 (bij Qa = 0)",
      "CS = \u00bd \u00d7 600 \u00d7 (500 \u2013 200) = \u20ac90.000",
      "PS = \u00bd \u00d7 600 \u00d7 (200 \u2013 50) = \u20ac45.000",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(80));

  children.push(question("c", "De drie bedrijven sluiten een kartelafspraak en beperken het aanbod tot 400 eenheden. Bereken de nieuwe prijs en het welvaartsverlies."));
  if (includeAnswers) {
    children.push(answerBox([
      "Bij Q = 400: de consument betaalt P = (1000 \u2013 400) / 2 = 300.",
      "De producent ontvangt P = 300, maar de marginale kosten bij Q = 400: Qa = 400 \u2192 400 = \u2013200 + 4P \u2192 P_mk = 150.",
      "Welvaartsverlies (deadweight loss) = \u00bd \u00d7 (600 \u2013 400) \u00d7 (300 \u2013 150) = \u00bd \u00d7 200 \u00d7 150 = \u20ac15.000.",
      "Het kartel leidt tot een hogere prijs (\u20ac300 i.p.v. \u20ac200), lagere productie (400 i.p.v. 600) en een welvaartsverlies van \u20ac15.000.",
    ]));
  } else {
    children.push(...answerSpace(7));
  }
  children.push(sp(200));

  // Vraag 2
  children.push(h2d("Opgave 2 \u2014 Overheid en marktfalen", C.dGreen));
  children.push(p("De gemeente Amsterdam overweegt twee maatregelen om de woningmarkt te reguleren:"));
  children.push(p("Maatregel A: Een maximumhuurprijs voor vrije sector woningen."));
  children.push(p("Maatregel B: Een subsidie voor nieuwbouw van huurwoningen."));
  children.push(sp(40));
  children.push(question("a", "Analyseer met behulp van vraag en aanbod de korte-termijneffecten van maatregel A. Gebruik de begrippen vraagoverschot, consumentensurplus en producentensurplus."));
  if (includeAnswers) {
    children.push(answerBox([
      "Een maximumhuurprijs onder de evenwichtsprijs leidt tot:",
      "\u2022 Een vraagoverschot: meer mensen willen huren dan er woningen beschikbaar zijn.",
      "\u2022 Het consumentensurplus neemt toe voor de huurders die w\u00e9l een woning krijgen (lagere huur), maar de consumenten die geen woning meer vinden, verliezen hun surplus.",
      "\u2022 Het producentensurplus daalt: verhuurders ontvangen minder huur.",
      "\u2022 Er ontstaat een welvaartsverlies (deadweight loss) door de niet-gerealiseerde transacties.",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(80));

  children.push(question("b", "Leg uit hoe maatregel B via een verschuiving van de aanbodcurve het probleem anders aanpakt dan maatregel A."));
  if (includeAnswers) {
    children.push(answerBox([
      "De subsidie voor nieuwbouw verschuift de aanbodcurve naar rechts: bij elke prijs worden meer woningen aangeboden.",
      "Dit leidt tot een nieuw evenwicht met een lagere huurprijs \u00e9n een grotere hoeveelheid woningen. In tegenstelling tot maatregel A ontstaat er geen vraagoverschot.",
      "Het consumentensurplus stijgt door de lagere prijs, en het welvaartsverlies is kleiner dan bij maatregel A. Het nadeel is dat de subsidie geld kost en mogelijk leidt tot ineffici\u00ebnt bouwen.",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(200));

  // Vraag 3
  children.push(h2d("Opgave 3 \u2014 Internationale specialisatie", C.dBlueDk));
  children.push(p("Drie landen produceren twee goederen: chips en textiel."));
  children.push(p("Land A: maximaal 100 chips of 200 textiel per maand."));
  children.push(p("Land B: maximaal 80 chips of 120 textiel per maand."));
  children.push(p("Land C: maximaal 50 chips of 250 textiel per maand."));
  children.push(sp(40));
  children.push(question("a", "Bereken de alternatieve kosten van \u00e9\u00e9n chip in elk land."));
  if (includeAnswers) {
    children.push(answerBox([
      "Land A: 1 chip kost 200/100 = 2 textiel.",
      "Land B: 1 chip kost 120/80 = 1,5 textiel.",
      "Land C: 1 chip kost 250/50 = 5 textiel.",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(80));

  children.push(question("b", "Welk land heeft het comparatief voordeel in chips en welk land in textiel? Verklaar."));
  if (includeAnswers) {
    children.push(answerBox([
      "Land B heeft het comparatief voordeel in chips: de alternatieve kosten zijn het laagst (1,5 textiel per chip).",
      "Land C heeft het comparatief voordeel in textiel: 1 textiel kost 50/250 = 0,2 chips. In land A kost 1 textiel 100/200 = 0,5 chips, in land B kost 1 textiel 80/120 = 0,667 chips. Land C heeft dus de laagste alternatieve kosten voor textiel.",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(80));

  children.push(question("c", "Land A en land B besluiten een vrijhandelsverdrag te sluiten. De ruilvoet wordt 1 chip = 1,8 textiel. Toon aan dat beide landen profiteren als land B 50 chips exporteert."));
  if (includeAnswers) {
    children.push(answerBox([
      "Land B exporteert 50 chips en importeert 50 \u00d7 1,8 = 90 textiel.",
      "Land B: zonder handel kosten 90 textiel hem 90 \u00d7 (80/120) = 60 chips. Nu kost het 50 chips. Winst: 10 chips.",
      "Land A importeert 50 chips en exporteert 90 textiel.",
      "Land A: zonder handel kosten 50 chips hem 50 \u00d7 2 = 100 textiel. Nu kost het 90 textiel. Winst: 10 textiel.",
      "Beide landen profiteren van de handel.",
    ]));
  } else {
    children.push(...answerSpace(7));
  }
  children.push(sp(200));

  // Vraag 4
  children.push(h2d("Opgave 4 \u2014 Externe effecten en beleid", C.dGreen));
  children.push(p("De vliegtuigindustrie veroorzaakt aanzienlijke CO\u2082-uitstoot (negatief extern effect) maar zorgt ook voor economische verbondenheid (positief extern effect)."));
  children.push(sp(40));
  children.push(question("a", "Teken in een vraaag-en-aanboddiagram hoe het marktevenwicht verschilt van het maatschappelijk optimum als alleen het negatieve externe effect wordt meegerekend. Beschrijf de verschuiving die je tekent."));
  if (includeAnswers) {
    children.push(answerBox([
      "De maatschappelijke kostencurve (MKm) ligt boven de priv\u00e9-kostencurve (MKp), omdat de milieukosten niet in de prijs zijn verwerkt.",
      "Het marktevenwicht (waar vraag = MKp) levert een hogere hoeveelheid op dan het maatschappelijk optimum (waar vraag = MKm).",
      "Er wordt te veel gevlogen: de hoeveelheid Q_markt > Q_optimaal. Het verschil veroorzaakt een welvaartsverlies.",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(80));

  children.push(question("b", "De EU voert een CO\u2082-belasting in van \u20ac30 per ton kerosine. De vraagfunctie naar vluchten is Qv = 800 \u2013 4P en de priv\u00e9-aanbodfunctie is Qa = \u2013200 + 2P. Bereken het verschil in consumenten- en producentensurplus v\u00f3\u00f3r en na de belasting."));
  if (includeAnswers) {
    children.push(answerBox([
      "V\u00f3\u00f3r belasting: 800 \u2013 4P = \u2013200 + 2P \u2192 1000 = 6P \u2192 P* = 166,67, Q* = 133,33",
      "Na belasting: Qa = \u2013200 + 2(P \u2013 30) = \u2013260 + 2P",
      "800 \u2013 4P = \u2013260 + 2P \u2192 1060 = 6P \u2192 P_cons = 176,67, Q* = 93,33",
      "",
      "CS v\u00f3\u00f3r: max P = 200 (bij Qv=0). CS = \u00bd \u00d7 133,33 \u00d7 (200 \u2013 166,67) = \u20ac2.222",
      "CS na: CS = \u00bd \u00d7 93,33 \u00d7 (200 \u2013 176,67) = \u20ac1.089",
      "Daling CS: \u20ac2.222 \u2013 \u20ac1.089 = \u20ac1.133",
      "",
      "PS v\u00f3\u00f3r: min P = 100 (bij Qa=0). PS = \u00bd \u00d7 133,33 \u00d7 (166,67 \u2013 100) = \u20ac4.444",
      "PS na: producent ontvangt 176,67 \u2013 30 = 146,67. PS = \u00bd \u00d7 93,33 \u00d7 (146,67 \u2013 100) = \u20ac2.178",
      "Daling PS: \u20ac4.444 \u2013 \u20ac2.178 = \u20ac2.266",
    ]));
  } else {
    children.push(...answerSpace(8));
  }
  children.push(sp(200));

  // Vraag 5
  children.push(h2d("Opgave 5 \u2014 Marktvorm en overheidsingrijpen", C.dAmber));
  children.push(p("De ACM (Autoriteit Consument & Markt) onderzoekt de supermarktbranche. Albert Heijn heeft een marktaandeel van 35%, Jumbo 22%, en de overige aanbieders verdelen de rest."));
  children.push(sp(40));
  children.push(question("a", "Bereken de HHI (Herfindahl-Hirschman Index) als de overige 43% gelijkmatig verdeeld is over 10 supermarktketens."));
  if (includeAnswers) {
    children.push(answerBox([
      "HHI = 35\u00b2 + 22\u00b2 + 10 \u00d7 (4,3)\u00b2",
      "HHI = 1225 + 484 + 10 \u00d7 18,49",
      "HHI = 1225 + 484 + 184,9",
      "HHI = 1893,9",
      "Dit duidt op een geconcentreerde markt (HHI > 1800 volgens de ACM-richtlijnen).",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(80));

  children.push(question("b", "Stel dat Jumbo en een keten met 4,3% marktaandeel willen fuseren. Bereken de nieuwe HHI en beoordeel of de ACM deze fusie waarschijnlijk zal goedkeuren."));
  if (includeAnswers) {
    children.push(answerBox([
      "Na fusie: Jumbo heeft 22 + 4,3 = 26,3% marktaandeel. Er zijn nog 9 overige ketens van 4,3%.",
      "Nieuwe HHI = 35\u00b2 + 26,3\u00b2 + 9 \u00d7 (4,3)\u00b2",
      "= 1225 + 691,69 + 9 \u00d7 18,49",
      "= 1225 + 691,69 + 166,41",
      "= 2083,1",
      "\u0394HHI = 2083,1 \u2013 1893,9 = 189,2",
      "De HHI stijgt met bijna 190 punten. Bij een HHI boven 1800 en een stijging van meer dan 150 punten zal de ACM de fusie waarschijnlijk nader onderzoeken en mogelijk blokkeren.",
    ]));
  } else {
    children.push(...answerSpace(7));
  }
  children.push(sp(200));

  // Vraag 6
  children.push(h2d("Opgave 6 \u2014 Synthese: vrijhandel vs. protectie", C.dBlueDk));
  children.push(p("De EU overweegt een importheffing op Chinese zonnepanelen van 25%."));
  children.push(sp(40));
  children.push(question("a", "Analyseer het effect van deze importheffing op het consumentensurplus en het producentensurplus van Europese zonnepaneelproducenten."));
  if (includeAnswers) {
    children.push(answerBox([
      "De importheffing verhoogt de prijs van Chinese zonnepanelen op de Europese markt. Gevolgen:",
      "\u2022 Consumentensurplus daalt: consumenten betalen een hogere prijs voor zonnepanelen.",
      "\u2022 Producentensurplus van Europese producenten stijgt: zij kunnen meer verkopen tegen een hogere prijs, omdat de concurrentie van Chinese panelen afneemt.",
      "\u2022 De overheid ontvangt belastinginkomsten (de heffing).",
      "\u2022 Er ontstaat een welvaartsverlies: sommige consumenten kopen geen zonnepanelen meer, en Europese producenten zijn minder effici\u00ebnt dan Chinese.",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(80));

  children.push(question("b", "Beoordeel of de importheffing te rechtvaardigen is vanuit het oogpunt van maatschappelijke welvaart. Gebruik ten minste drie economische argumenten."));
  if (includeAnswers) {
    children.push(answerBox([
      "Argumenten v\u00f3\u00f3r de heffing:",
      "1. Bescherming van strategische industrie: Europa wil niet volledig afhankelijk zijn van Chinese productie (infant industry argument).",
      "2. Anti-dumping: als China onder de kostprijs verkoopt, verstoort dit eerlijke concurrentie.",
      "3. Werkgelegenheid: Europese banen in de zonnepaneelindustrie worden beschermd.",
      "",
      "Argumenten tegen de heffing:",
      "1. Welvaartsverlies: consumenten betalen meer, waardoor de energietransitie vertraagt.",
      "2. Het beginsel van comparatief voordeel wordt geschonden: als China goedkoper kan produceren, is handel voor beide partijen voordelig.",
      "3. Vergeldingsmaatregelen: China kan importheffingen instellen op Europese producten, wat een handelsoorlog kan veroorzaken.",
      "",
      "Conclusie: de heffing is economisch gezien ineffici\u00ebnt (welvaartsverlies), maar kan strategisch gerechtvaardigd zijn als China daadwerkelijk dumpt of als Europa strategische autonomie nastreeft.",
    ]));
  } else {
    children.push(...answerSpace(8));
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

      const headerText = `Afsluiting \u2014 ${level.label}`;

      // Vragen
      const vragenFile = path.join(dir, `${PREFIX} \u2013 ${level.name} \u2013 vragen.docx`);
      const vragenDoc = createDoc(level.buildFn, false, headerText);
      const vragenBuf = await Packer.toBuffer(vragenDoc);
      fs.writeFileSync(vragenFile, vragenBuf);
      console.log(`OK: ${path.basename(vragenFile)} (${vragenBuf.length} bytes)`);

      // Antwoorden
      const answersFile = path.join(dir, `${PREFIX} \u2013 ${level.name} \u2013 antwoorden.docx`);
      const answersDoc = createDoc(level.buildFn, true, headerText);
      const answersBuf = await Packer.toBuffer(answersDoc);
      fs.writeFileSync(answersFile, answersBuf);
      console.log(`OK: ${path.basename(answersFile)} (${answersBuf.length} bytes)`);
    }

    console.log("\nDone! All 6 documents for 3.5.1 Afsluiting created.");
  } catch (err) {
    console.error("ERROR:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();
