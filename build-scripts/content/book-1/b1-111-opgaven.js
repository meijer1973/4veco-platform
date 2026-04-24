/**
 * Build script: 1.1.1 Schaarste en economisch denken — Opgavensets
 * Generates 6 documents: vragen + antwoorden for basis, midden, verrijking.
 *
 * Basis (8): MC schaarste herkennen, term-matching, eenvoudige alt.kosten, pitfall.
 * Midden (6): 3+ alternatieven, winst op schaarse middelen, 3-stappen-procedure toepassen.
 * Verrijking (4): gemengde allocatie, gratis-is-niet-gratis, claim beoordelen, overheidskeuze.
 *
 * Output: flat layout at paragraph root.
 *
 * Run from 4veco-platform/: node build-scripts/content/book-1/b1-111-opgaven.js
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

// ─── Base path (flat layout at paragraph root) ───
const BASE_DIR = `C:\\Projects\\4veco\\4veco-lessen\\Boek 1 - Grondslagen, vraag en aanbod\\1.1 Hoofdstuk Economisch denken en rekenen\\1.1.1 Schaarste en economisch denken`;
const PREFIX = "1.1.1 Schaarste en economisch denken";

// ─── Page setup ───
const PAGE = { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } };
const CW = 9026;

// ─── Color palette (teal dominant — markt-domain) ───
const C = {
  dBlue: "1A5276", dBlueLt: "EBF5FB", dBlueDk: "154360",
  dTeal: "0F766E", dTealLt: "CCFBF1", dTealDk: "0B5E58",
  dAmber: "E67E22", dAmberLt: "FEF5E7", dAmberDk: "BA6A1C",
  dGreen: "1E8449", dGreenLt: "E8F8F0", dGreenDk: "186A3B",
  navy: "1E2761", white: "FFFFFF", dark: "2D3748", gray: "718096",
  lightGray: "F7F8FA", borderGray: "CBD5E0", red: "D9534F", lightRed: "FDE8E8",
  blue: "1A5276", lightBlue: "EBF5FB", green: "1E8449", lightGreen: "E8F5E9",
  rowAlt: "F7FAFC",
};

// ─── Basic helpers (font 16/11/9pt → 32/22/18 half-points) ───
const sp = (after = 80) => new Paragraph({ spacing: { after }, children: [] });

const p = (text, opts = {}) => new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({ text, font: "Arial", size: 22, color: C.dark, ...opts })],
});

const pBold = (text) => p(text, { bold: true });

const h2d = (text, domainColor = C.dTeal) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 200, after: 120 },
  children: [new TextRun({ text, bold: true, font: "Arial", size: 24, color: domainColor })],
});

// ─── Title block (32pt / 16pt subtitle) ───
function titleBlock(title, subtitle) {
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
      children: [new TextRun({ text: title, bold: true, font: "Arial", size: 32, color: C.navy })],
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
      children: [new TextRun({ text: subtitle, font: "Arial", size: 22, color: C.gray })],
    }),
  ];
}

// ─── Header / Footer (9pt = 18 half-points) ───
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

// ─── Instruction box ───
function tipBox(text, color, bg, label) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 1, color: bg },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: bg },
        left:   { style: BorderStyle.SINGLE, size: 12, color },
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
function instructionBox(text) { return tipBox(text, C.dTeal, C.dTealLt, "📖 "); }

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

// ─── Answer space (dotted lines) ───
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
      new TextRun({ text: label ? label + "  " : "", bold: true, font: "Arial", size: 22, color: C.dark }),
      new TextRun({ text, font: "Arial", size: 22, color: C.dark }),
    ],
  });
}

// ─── MC option list ───
function mcOptions(options) {
  // options: array of strings; render each as "A. ..." etc.
  const letters = ["A", "B", "C", "D"];
  return options.map((opt, i) => new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: letters[i] + ".  ", bold: true, font: "Arial", size: 22, color: C.dark }),
      new TextRun({ text: opt, font: "Arial", size: 22, color: C.dark }),
    ],
  }));
}

// ─── DOC_STYLES ───
const DOC_STYLES = {
  default: { document: { run: { font: "Arial", size: 22 } } },
  paragraphStyles: [
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 28, bold: true, font: "Arial", color: C.navy },
      paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 24, bold: true, font: "Arial", color: C.dTeal },
      paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
  ],
};

// ════════════════════════════════════════════════════════════════════════════════
// BASIS (8 vragen) — knowledge recall, MC + korte vragen
// ════════════════════════════════════════════════════════════════════════════════

function buildBasis(includeAnswers) {
  const children = [];

  children.push(...titleBlock("1.1.1 Schaarste en economisch denken", includeAnswers ? "Basisopgaven — Antwoorden" : "Basisopgaven"));
  children.push(sp(200));
  children.push(instructionBox("Deze opgavenset oefent de kernbegrippen: schaarste herkennen, canonical termen, en eenvoudige berekeningen van alternatieve kosten bij twee alternatieven. Gebruik de samenvatting als naslag."));
  children.push(sp(400));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ── MC 1: schaarste herkennen ──
  children.push(h2d("Opgave 1 — Schaarste herkennen", C.dTeal));
  children.push(p("In de schoolkantine staan 80 broodjes klaar. Er komen 55 leerlingen langs die elk één broodje willen."));
  children.push(p("Is hier sprake van schaarste?"));
  children.push(...mcOptions([
    "Ja, want er zijn broodjes nodig.",
    "Ja, want broodjes zijn niet gratis.",
    "Nee, want de beschikbare hoeveelheid (80) is groter dan de behoefte (55).",
    "Nee, want broodjes zijn niet zeldzaam.",
  ]));
  if (includeAnswers) {
    children.push(answerBox([
      "Juiste antwoord: C.",
      "Schaarste ontstaat pas als de behoeften groter zijn dan de beschikbare middelen. Hier is het aanbod (80) groter dan de behoefte (55), dus geen schaarste.",
      "Let op: antwoord D lijkt goed maar is onjuist. Schaarste ≠ zeldzaamheid. De kern is de verhouding behoeften/middelen.",
    ]));
  } else {
    children.push(...answerSpace(2));
  }
  children.push(sp(160));

  // ── MC 2: schaarste herkennen ──
  children.push(h2d("Opgave 2 — Schaarste herkennen", C.dTeal));
  children.push(p("De gemeente heeft een budget van €4 miljoen. Voor de plannen (nieuwe school, fietspaden én zwembad) is in totaal €7 miljoen nodig."));
  children.push(p("Welke uitspraak is juist?"));
  children.push(...mcOptions([
    "Er is geen schaarste: de gemeente kan gewoon meer belasting heffen.",
    "Er is schaarste: de behoeften (€7 miljoen aan plannen) zijn groter dan het beschikbare middel (€4 miljoen budget).",
    "Er is schaarste, maar alleen als de plannen duurder worden.",
    "Er is geen schaarste, want geld is geen schaars goed.",
  ]));
  if (includeAnswers) {
    children.push(answerBox([
      "Juiste antwoord: B.",
      "Schaarste: behoeften (€7 miljoen) > middelen (€4 miljoen). De gemeente moet kiezen welke plannen doorgaan — precies waar economisch denken over gaat.",
    ]));
  } else {
    children.push(...answerSpace(2));
  }
  children.push(sp(160));

  // ── MC 3: schaarste herkennen (pitfall-rijk) ──
  children.push(h2d("Opgave 3 — Schaarste herkennen", C.dTeal));
  children.push(p("Welke situatie is GEEN voorbeeld van schaarste?"));
  children.push(...mcOptions([
    "Een scholier heeft €20 en wil zowel een boek (€15) als een bioscoopkaartje (€12).",
    "Een boer heeft 10 hectare land en wil zowel tarwe als maïs op al zijn land verbouwen.",
    "In een bibliotheek zijn 200 boeken beschikbaar en er zijn 50 lezers die elk één boek willen lenen.",
    "Eva heeft 4 uur vrije tijd en wil sporten (2 uur), studeren (2 uur) én een film kijken (2 uur).",
  ]));
  if (includeAnswers) {
    children.push(answerBox([
      "Juiste antwoord: C.",
      "In de bibliotheek is het aanbod (200 boeken) ruim groter dan de behoefte (50 lezers). Geen schaarste.",
      "Bij A, B en D zijn de behoeften groter dan de middelen — daar is wél sprake van schaarste.",
    ]));
  } else {
    children.push(...answerSpace(2));
  }
  children.push(sp(160));

  // ── MC 4: canonical term matching ──
  children.push(h2d("Opgave 4 — Begrippen", C.dTeal));
  children.push(p("Vul de juiste term in: \"Alternatieve kosten zijn de opbrengst van het _____ niet-gekozen alternatief.\""));
  children.push(...mcOptions([
    "gemiddelde",
    "goedkoopste",
    "beste",
    "som van alle",
  ]));
  if (includeAnswers) {
    children.push(answerBox([
      "Juiste antwoord: C — beste.",
      "Canonical definitie: alternatieve kosten = de opbrengst van het BESTE niet-gekozen alternatief. Niet de som, niet het gemiddelde, niet het goedkoopste.",
    ]));
  } else {
    children.push(...answerSpace(2));
  }
  children.push(sp(160));

  // ── MC 5: canonical term matching ──
  children.push(h2d("Opgave 5 — Begrippen", C.dTeal));
  children.push(p("Welke uitspraak past bij de canonical definitie van schaarste?"));
  children.push(...mcOptions([
    "Schaarste betekent dat iets zeldzaam is.",
    "Schaarste betekent dat er een tekort is omdat iets duur is.",
    "Schaarste betekent dat de behoeften groter zijn dan de beschikbare middelen.",
    "Schaarste betekent dat er ergens niets meer van te krijgen is.",
  ]));
  if (includeAnswers) {
    children.push(answerBox([
      "Juiste antwoord: C.",
      "Schaarste = behoeften > middelen. Zeldzaamheid (A) is iets anders: iets kan zeldzaam zijn zonder dat er schaarste is (bijv. zeldzame postzegels die niemand wil). En D beschrijft uitverkocht-zijn, niet schaarste.",
    ]));
  } else {
    children.push(...answerSpace(2));
  }
  children.push(sp(160));

  // ── Rekenopgave 1: 2 alternatieven ──
  children.push(h2d("Opgave 6 — Alternatieve kosten berekenen", C.dTeal));
  children.push(p("Milan heeft een zaterdag beschikbaar. Hij kan vakkenvullen bij de supermarkt (hij verdient dan €45) of voetballen in het eerste elftal (waarde voor hem: €25 aan plezier)."));
  children.push(p("Hij kiest voor voetballen. Bereken zijn alternatieve kosten."));
  if (includeAnswers) {
    children.push(answerBox([
      "Stap 1 — Alternatieven: vakkenvullen (€45) of voetballen (€25).",
      "Stap 2 — Keuze: voetballen.",
      "Stap 3 — Beste niet-gekozen alternatief: vakkenvullen.",
      "Alternatieve kosten = €45.",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(160));

  // ── Rekenopgave 2: 2 alternatieven ──
  children.push(h2d("Opgave 7 — Alternatieve kosten berekenen", C.dTeal));
  children.push(p("Een tuinder heeft 6 hectare kasruimte. Hij kan tomaten telen (winst €1.200 per hectare) of komkommers (winst €900 per hectare)."));
  children.push(p("Hij kiest voor tomaten."));
  children.push(question("a", "Bereken zijn totale winst."));
  children.push(question("b", "Bereken zijn alternatieve kosten."));
  if (includeAnswers) {
    children.push(answerBox([
      "a) Totale winst = 6 × €1.200 = €7.200.",
      "b) Alternatief: 6 × €900 = €5.400 (komkommers). Dit is het beste niet-gekozen alternatief.",
      "Alternatieve kosten = €5.400.",
    ]));
  } else {
    children.push(...answerSpace(5));
  }
  children.push(sp(160));

  // ── Ja/nee + korte uitleg: pitfall schaarste ≠ weinig ──
  children.push(h2d("Opgave 8 — Pitfall: schaarste ≠ weinig", C.dTeal));
  children.push(p("Stelling: \"Er zijn in Nederland maar drie officiële exemplaren van een bepaalde zeldzame postzegel. Er is dus schaarste aan deze postzegel.\""));
  children.push(p("Ja of nee? Leg kort uit."));
  if (includeAnswers) {
    children.push(answerBox([
      "Nee — niet noodzakelijk.",
      "Zeldzaamheid is niet hetzelfde als schaarste. Schaarste vereist dat de behoeften groter zijn dan de beschikbare middelen. Als niemand deze postzegel wil hebben, is er geen schaarste — ondanks dat hij zeldzaam is.",
      "Pas als er bijvoorbeeld twintig verzamelaars elk zo'n postzegel willen, is er wél schaarste: de behoefte (20) is dan groter dan de beschikbare middelen (3).",
    ]));
  } else {
    children.push(...answerSpace(4));
  }

  return children;
}

// ════════════════════════════════════════════════════════════════════════════════
// MIDDEN (6 vragen) — application
// ════════════════════════════════════════════════════════════════════════════════

function buildMidden(includeAnswers) {
  const children = [];

  children.push(...titleBlock("1.1.1 Schaarste en economisch denken", includeAnswers ? "Middenopgaven — Antwoorden" : "Middenopgaven"));
  children.push(sp(200));
  children.push(instructionBox("Deze opgaven vragen om volledige berekeningen met drie of meer alternatieven, winst bij inzet van een schaars middel en zelfstandig toepassen van de 3-stappen-procedure in nieuwe contexten."));
  children.push(sp(400));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ── Rekenopgave 1: 3 alternatieven ──
  children.push(h2d("Opgave 1 — Alternatieve kosten bij drie alternatieven", C.dTeal));
  children.push(p("Sanne heeft op vrijdagavond 3 uur beschikbaar. Ze heeft drie opties:"));
  children.push(p("• Bijbaantje bij de bakker: €36 verdienen."));
  children.push(p("• Leren voor haar wiskundetoets: waarde €28 (hoger cijfer)."));
  children.push(p("• Met vrienden afspreken: waarde €20 (sociaal)."));
  children.push(p("Ze kan maar één activiteit kiezen."));
  children.push(sp(40));
  children.push(question("a", "Sanne kiest voor het bijbaantje. Bereken haar alternatieve kosten. Laat de stappen zien."));
  children.push(question("b", "Waarom tel je de waarde van de niet-gekozen alternatieven niet bij elkaar op?"));
  if (includeAnswers) {
    children.push(answerBox([
      "a) Stap 1 — Alternatieven: bijbaan (€36), leren (€28), vrienden (€20).",
      "Stap 2 — Keuze: bijbaan.",
      "Stap 3 — Beste niet-gekozen alternatief: leren (€28).",
      "Alternatieve kosten = €28.",
      "",
      "b) Sanne kon sowieso maar één alternatief kiezen (de drie opties sluiten elkaar uit, elk duurt 3 uur). Door voor bijbaan te kiezen, mist ze alléén het beste alternatief — ze zou leren én vrienden niet allebei gedaan hebben. Alternatieve kosten = opbrengst van het BESTE niet-gekozen alternatief, niet de som.",
    ]));
  } else {
    children.push(...answerSpace(7));
  }
  children.push(sp(160));

  // ── Rekenopgave 2: 4 alternatieven ──
  children.push(h2d("Opgave 2 — Vergelijking met vier alternatieven", C.dTeal));
  children.push(p("Een startend bedrijf heeft €80.000 beschikbaar voor één project. Vier projecten komen in aanmerking:"));
  children.push(p("• Project A — webshop: verwachte opbrengst €96.000."));
  children.push(p("• Project B — app-ontwikkeling: verwachte opbrengst €110.000."));
  children.push(p("• Project C — winkel: verwachte opbrengst €88.000."));
  children.push(p("• Project D — franchise: verwachte opbrengst €102.000."));
  children.push(sp(40));
  children.push(question("a", "Bereken de alternatieve kosten als het bedrijf project A kiest."));
  children.push(question("b", "Wat is economisch gezien de beste keuze? Onderbouw."));
  if (includeAnswers) {
    children.push(answerBox([
      "a) Beste niet-gekozen alternatief bij keuze voor A: project B (€110.000), want dat is het hoogste van de niet-gekozen projecten.",
      "Alternatieve kosten van A = €110.000.",
      "",
      "b) Project B is economisch de beste keuze: daar is de opbrengst het hoogst (€110.000). Kies je B, dan zijn de alternatieve kosten het laagst: het beste niet-gekozen alternatief is project D (€102.000). Bij elke andere keuze geef je een hogere opbrengst op.",
    ]));
  } else {
    children.push(...answerSpace(6));
  }
  children.push(sp(160));

  // ── Context-opgave 1: boer met N ha, winst op schaars middel ──
  children.push(h2d("Opgave 3 — Winst op een schaars middel (boer)", C.dTeal));
  children.push(p("Een boer heeft 15 hectare land. Hij vergelijkt twee gewassen:"));
  children.push(p("• Aardappelen: winst €650 per hectare."));
  children.push(p("• Suikerbieten: winst €480 per hectare."));
  children.push(sp(40));
  children.push(question("a", "Bereken de totale winst als hij al zijn land voor aardappelen gebruikt."));
  children.push(question("b", "Bereken de alternatieve kosten van deze keuze."));
  children.push(question("c", "De boer koopt er 5 hectare bij, totaal dus 20 hectare, en gebruikt alles voor aardappelen. Met hoeveel euro stijgt zijn totale winst door deze uitbreiding?"));
  if (includeAnswers) {
    children.push(answerBox([
      "a) Totale winst = 15 × €650 = €9.750.",
      "",
      "b) Alternatief = 15 × €480 = €7.200 (suikerbieten).",
      "Alternatieve kosten = €7.200.",
      "",
      "c) Nieuwe winst = 20 × €650 = €13.000.",
      "Winststijging = €13.000 − €9.750 = €3.250.",
      "(Dit is precies 5 × €650: de extra opbrengst op de extra 5 hectare.)",
    ]));
  } else {
    children.push(...answerSpace(7));
  }
  children.push(sp(160));

  // ── Context-opgave 2: ondernemer met uren ──
  children.push(h2d("Opgave 4 — Winst op een schaars middel (uren)", C.dTeal));
  children.push(p("Yara runt een eigen kapsalon. Ze heeft per week 40 werkuren beschikbaar. Ze kan per uur klanten knippen (€32 per uur) of aan sociale media werken om nieuwe klanten te krijgen (schatting: €20 per uur aan extra omzet op termijn)."));
  children.push(sp(40));
  children.push(question("a", "Bereken haar totale opbrengst als ze al haar 40 uur besteedt aan knippen."));
  children.push(question("b", "Wat zijn dan haar alternatieve kosten?"));
  children.push(question("c", "Yara besluit 10 van haar 40 uur te besteden aan sociale media en 30 uur aan knippen. Bereken haar nieuwe totale opbrengst en vergelijk met onderdeel a."));
  if (includeAnswers) {
    children.push(answerBox([
      "a) 40 × €32 = €1.280.",
      "",
      "b) Alternatief = 40 × €20 = €800.",
      "Alternatieve kosten = €800.",
      "",
      "c) Gemengde inzet:",
      "Knippen: 30 × €32 = €960.",
      "Sociale media: 10 × €20 = €200.",
      "Totaal = €1.160.",
      "",
      "Vergelijking met a): de gemengde inzet levert €120 minder op (€1.280 − €1.160).",
      "Opmerking: ze kiest hier bewust voor lagere korte-termijn-opbrengst omdat sociale media toekomstige klanten oplevert — maar met deze gegevens is puur economisch 100% knippen beter.",
    ]));
  } else {
    children.push(...answerSpace(9));
  }
  children.push(sp(160));

  // ── 3-stappen-procedure in nieuwe context 1: scholier ──
  children.push(h2d("Opgave 5 — Procedure toepassen: scholier", C.dTeal));
  children.push(p("Tom heeft in de zomervakantie 4 weken volledig vrij. Hij overweegt drie dingen:"));
  children.push(p("• Stage lopen bij een architectenbureau: €0 loon, maar ervaring (waarde €400)."));
  children.push(p("• Werken in een supermarkt: €800 verdienen."));
  children.push(p("• Op vakantie gaan: waarde €300 aan plezier."));
  children.push(sp(40));
  children.push(question("", "Pas de 3-stappen-procedure toe. Adviseer Tom wat economisch de beste keuze is en bereken de alternatieve kosten van die keuze."));
  if (includeAnswers) {
    children.push(answerBox([
      "Stap 1 — Alternatieven: stage (€400), supermarkt (€800), vakantie (€300).",
      "Stap 2 — Opbrengsten: supermarkt levert het meeste op (€800).",
      "Stap 3 — Beste niet-gekozen alternatief bij keuze voor supermarkt: stage (€400).",
      "Alternatieve kosten = €400.",
      "",
      "Advies: Tom kan het beste in de supermarkt werken (€800). De alternatieve kosten (€400) zijn dan lager dan de opbrengst van de gekozen optie. Bij elke andere keuze zou hij de €800-opbrengst opgeven, wat tot hogere alternatieve kosten leidt.",
    ]));
  } else {
    children.push(...answerSpace(8));
  }
  children.push(sp(160));

  // ── 3-stappen-procedure in nieuwe context 2: overheid ──
  children.push(h2d("Opgave 6 — Procedure toepassen: overheid", C.dTeal));
  children.push(p("Een gemeente heeft een eenmalig budget van €500.000 over. Drie projecten dingen mee (elk kost exact €500.000):"));
  children.push(p("• Nieuwe speeltuin: geschatte maatschappelijke baten €750.000."));
  children.push(p("• Renovatie bibliotheek: geschatte maatschappelijke baten €620.000."));
  children.push(p("• Zonnepanelen op gemeentelijk dak: geschatte baten €840.000."));
  children.push(sp(40));
  children.push(question("", "Pas de 3-stappen-procedure toe. Welk project moet de gemeente kiezen en wat zijn de alternatieve kosten van die keuze?"));
  if (includeAnswers) {
    children.push(answerBox([
      "Stap 1 — Alternatieven: speeltuin (€750.000), bibliotheek (€620.000), zonnepanelen (€840.000).",
      "Stap 2 — Baten per alternatief zijn hierboven.",
      "Stap 3 — Rangorde: zonnepanelen (€840.000) > speeltuin (€750.000) > bibliotheek (€620.000).",
      "",
      "Keuze: zonnepanelen. Beste niet-gekozen alternatief = speeltuin.",
      "Alternatieve kosten = €750.000.",
      "",
      "Toelichting: ook voor een overheid geldt schaarste. Het budget (€500.000) is kleiner dan de gezamenlijke behoeften (€1,5 miljoen voor drie projecten). De gemeente moet kiezen. Economisch denken: kies het alternatief met de hoogste baten.",
    ]));
  } else {
    children.push(...answerSpace(9));
  }

  return children;
}

// ════════════════════════════════════════════════════════════════════════════════
// VERRIJKING (4 vragen) — analysis / evaluation, open
// ════════════════════════════════════════════════════════════════════════════════

function buildVerrijking(includeAnswers) {
  const children = [];

  children.push(...titleBlock("1.1.1 Schaarste en economisch denken", includeAnswers ? "Verrijkingsopgaven — Antwoorden" : "Verrijkingsopgaven"));
  children.push(sp(200));
  children.push(instructionBox("Deze opgaven vragen om analyse en evaluatie. Je beoordeelt claims, combineert begrippen en beredeneert een oordeel. Baseer je antwoorden op de canonical definities uit de samenvatting."));
  children.push(sp(400));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ── Verrijking 1: gemengde allocatie (andere setup dan textbook 4) ──
  children.push(h2d("Opgave 1 — Gemengde allocatie op één schaars middel", C.dTeal));
  children.push(p("Een glastuinder heeft 12 kassen. Ze kan haar kassen inzetten voor paprika's (winst €2.500 per kas) of voor aardbeien (winst €1.800 per kas)."));
  children.push(p("Ze twijfelt tussen drie strategieën:"));
  children.push(p("• Strategie I: 12 kassen paprika."));
  children.push(p("• Strategie II: 12 kassen aardbeien."));
  children.push(p("• Strategie III: 8 kassen paprika + 4 kassen aardbeien."));
  children.push(sp(40));
  children.push(question("a", "Bereken de totale winst voor elk van de drie strategieën."));
  children.push(question("b", "Bereken de alternatieve kosten van strategie III ten opzichte van strategie I."));
  children.push(question("c", "Beredeneer vanuit schaarste en alternatieve kosten waarom strategie III economisch gezien minder opbrengt dan strategie I. Verwijs naar het concept \"beste alternatief\"."));
  if (includeAnswers) {
    children.push(answerBox([
      "a) Strategie I: 12 × €2.500 = €30.000.",
      "   Strategie II: 12 × €1.800 = €21.600.",
      "   Strategie III: (8 × €2.500) + (4 × €1.800) = €20.000 + €7.200 = €27.200.",
      "",
      "b) Bij keuze voor strategie III is het beste niet-gekozen alternatief strategie I (€30.000).",
      "   Alternatieve kosten III = €30.000.",
      "   Nettoverlies van III t.o.v. I = €30.000 − €27.200 = €2.800.",
      "",
      "c) De 12 kassen zijn schaars: de tuinder kan elke kas maar voor één gewas gebruiken. Elke kas die ze voor aardbeien inzet, kan ze niet meer voor paprika inzetten. Omdat paprika per kas €700 méér opbrengt dan aardbeien (€2.500 − €1.800), verliest ze bij elke aardbeienkas €700 aan alternatieve kosten. Over 4 aardbeienkassen: 4 × €700 = €2.800 verlies. Economisch denken zegt: kies altijd het beste alternatief per eenheid van het schaarse middel — dat is paprika.",
    ]));
  } else {
    children.push(...answerSpace(10));
  }
  children.push(sp(160));

  // ── Verrijking 2: gratis-is-niet-gratis (andere setup dan textbook 5) ──
  children.push(h2d("Opgave 2 — \"Gratis\" toegang tot een festival", C.dTeal));
  children.push(p("De gemeente organiseert een cultureel stadsfestival. De toegang is gratis voor iedere bezoeker. Een opiniestuk in de krant stelt: \"Dit festival kost niemand iets — het is puur winst voor de stad.\""));
  children.push(sp(40));
  children.push(question("a", "Leg uit waarom een econoom het niet eens is met deze uitspraak. Gebruik het begrip alternatieve kosten en onderscheid daarbij minstens twee partijen (bijv. bezoekers en de gemeente)."));
  children.push(question("b", "Geef aan wat de alternatieve kosten zijn voor (i) een bezoeker die naar het festival gaat, (ii) de gemeente die het organiseert."));
  if (includeAnswers) {
    children.push(answerBox([
      "a) \"Gratis\" betekent hier \"geen entreegeld\", maar niet \"zonder alternatieve kosten\". Elke betrokken partij geeft iets op:",
      "• Bezoekers geven tijd op (en daarmee de activiteit die ze anders hadden gedaan — bijv. bijbaan, sport, leren).",
      "• De gemeente geeft geld op (het festivalbudget had naar onderwijs, wegen of sociale voorzieningen kunnen gaan).",
      "Zelfs zonder geldprijs bestaan er alternatieve kosten in de vorm van tijd, middelen of gemiste kansen. De claim \"het kost niemand iets\" klopt economisch dus niet.",
      "",
      "b) (i) Bezoeker: de opbrengst van de beste alternatieve tijdsbesteding (bijv. €40 bijbaan als dat zijn beste alternatief is).",
      "   (ii) Gemeente: de maatschappelijke baten van het beste niet-gekozen project waar het festivalbudget naartoe had gekund (bijv. renovatie buurthuis).",
    ]));
  } else {
    children.push(...answerSpace(9));
  }
  children.push(sp(160));

  // ── Verrijking 3: schaarste-claim kritisch beoordelen ──
  children.push(h2d("Opgave 3 — Schaarste-claim beoordelen", C.dTeal));
  children.push(p("Stelling: \"Er is schaarste aan drinkwater, want bij ons huis stroomt er alleen drinkwater uit de kraan als je hem opendraait.\""));
  children.push(sp(40));
  children.push(question("", "Beoordeel deze stelling. Gebruik de canonical definitie van schaarste en leg uit welk denkfout er gemaakt wordt."));
  if (includeAnswers) {
    children.push(answerBox([
      "De stelling is onjuist — er wordt een denkfout gemaakt.",
      "",
      "Canonical definitie: schaarste = behoeften groter dan beschikbare middelen.",
      "",
      "Denkfout: \"moeten werken om iets te krijgen\" ≠ schaarste. Dat je de kraan moet opendraaien betekent niet dat er schaarste is. In Nederland is de waterlevering zo ruim dat alle huishoudens onbeperkt water kunnen tappen binnen normaal gebruik — de beschikbare middelen zijn (veel) groter dan de behoeften.",
      "",
      "Om schaarste te kunnen vaststellen moet je kijken of de behoefte daadwerkelijk groter is dan het beschikbare. In bijvoorbeeld een droogtegebied, of in periodes van extreme droogte, kan er wél schaarste aan drinkwater ontstaan. In Nederland is dat dagelijks niet zo.",
      "",
      "Extra pitfall: schaarste ≠ dat iets geld kost. Ook gratis dingen (zonlicht, lucht) zijn niet automatisch schaars of niet-schaars — het gaat puur om de verhouding behoefte/middelen.",
    ]));
  } else {
    children.push(...answerSpace(8));
  }
  children.push(sp(160));

  // ── Verrijking 4: overheid kiest tussen 3 beleidsopties ──
  children.push(h2d("Opgave 4 — Overheidskeuze tussen drie beleidsopties", C.dTeal));
  children.push(p("De rijksoverheid heeft €200 miljoen over voor één van drie klimaatprojecten:"));
  children.push(p("• Optie A — Subsidie elektrische auto's: geschatte CO₂-reductie ter waarde van €240 miljoen aan maatschappelijke baten."));
  children.push(p("• Optie B — Isolatie van sociale huurwoningen: geschatte baten €310 miljoen (lagere energierekening + CO₂-reductie)."));
  children.push(p("• Optie C — Aanleg windmolenpark op zee: geschatte baten €280 miljoen."));
  children.push(sp(40));
  children.push(question("a", "Welke optie kiest de overheid volgens de 3-stappen-procedure? Bereken ook de alternatieve kosten van die keuze."));
  children.push(question("b", "Verwijs expliciet naar de 4-stappen-procedure voor alternatieve kosten (B02 uit het unit-register): (1) benoem alternatieven, (2) bereken opbrengst per alternatief, (3) rangschik — hoogste niet-gekozen = alternatieve kosten, (4) vergelijk gekozen alternatief met alternatieve kosten voor nettowaarde. Bereken de nettowaarde voor de aanbevolen keuze."));
  children.push(question("c", "Bedenk één niet-economisch argument dat de overheid zou kunnen doen besluiten om tóch niet voor de economisch beste optie te kiezen. Wat is het risico van dat argument?"));
  if (includeAnswers) {
    children.push(answerBox([
      "a) Stap 1 — Alternatieven: A (€240 mln), B (€310 mln), C (€280 mln).",
      "   Stap 2 — Baten hierboven.",
      "   Stap 3 — Keuze: B (isolatie, hoogste baten €310 mln).",
      "   Beste niet-gekozen alternatief: C (€280 mln).",
      "   Alternatieve kosten = €280 miljoen.",
      "",
      "b) Volgens de canonical B02-procedure (uit het unit-register):",
      "   Stap 1 — Alternatieven voor het schaarse middel (€200 mln budget): A, B, C.",
      "   Stap 2 — Opbrengst per alternatief: A=€240 mln, B=€310 mln, C=€280 mln.",
      "   Stap 3 — Rangschikking + alternatieve kosten: keuze B. Beste niet-gekozen = C. Alternatieve kosten = €280 mln.",
      "   Stap 4 — Nettowaarde = opbrengst gekozen − alternatieve kosten = €310 mln − €280 mln = €30 miljoen.",
      "   Bij elke andere keuze (A of C) is de nettowaarde negatief (alternatieve kosten zouden dan €310 mln zijn).",
      "",
      "c) Mogelijke niet-economische argumenten (één voorbeeld is voldoende):",
      "• Rechtvaardigheid: isolatie helpt vooral bewoners van sociale huurwoningen, maar andere groepen profiteren niet — politieke druk om elektrische auto's te subsidiëren kan zwaarder wegen.",
      "• Zichtbaarheid: windmolens zijn zichtbaarder beleid dan isolatie.",
      "• Strategische autonomie: eigen energieproductie (C) kan in crisistijd waardevoller zijn dan de schattingen suggereren.",
      "",
      "Risico: wie afwijkt van de economisch beste keuze, moet de alternatieve kosten kennen en bewust accepteren. Kiezen voor A betekent €70 mln aan baten opgeven t.o.v. B. Zonder die afweging riskeer je verborgen welvaartsverlies — precies wat economisch denken moet voorkomen.",
    ]));
  } else {
    children.push(...answerSpace(12));
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
  { name: "basis", label: "Basisopgaven", buildFn: buildBasis },
  { name: "midden", label: "Middenopgaven", buildFn: buildMidden },
  { name: "verrijking", label: "Verrijkingsopgaven", buildFn: buildVerrijking },
];

(async () => {
  try {
    if (!fs.existsSync(BASE_DIR)) {
      throw new Error("Base directory does not exist: " + BASE_DIR);
    }

    for (const level of LEVELS) {
      const headerText = `1.1.1 Schaarste en economisch denken — ${level.label}`;

      // Vragen
      const vragenFile = path.join(BASE_DIR, `${PREFIX} – ${level.name} – vragen.docx`);
      const vragenDoc = createDoc(level.buildFn, false, headerText);
      const vragenBuf = await Packer.toBuffer(vragenDoc);
      fs.writeFileSync(vragenFile, vragenBuf);
      console.log(`OK: ${path.basename(vragenFile)} (${vragenBuf.length} bytes)`);

      // Antwoorden
      const answersFile = path.join(BASE_DIR, `${PREFIX} – ${level.name} – antwoorden.docx`);
      const answersDoc = createDoc(level.buildFn, true, headerText);
      const answersBuf = await Packer.toBuffer(answersDoc);
      fs.writeFileSync(answersFile, answersBuf);
      console.log(`OK: ${path.basename(answersFile)} (${answersBuf.length} bytes)`);
    }

    console.log("\nDone! All 6 documents for 1.1.1 created.");
  } catch (err) {
    console.error("ERROR:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();
