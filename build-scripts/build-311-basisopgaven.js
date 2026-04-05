/**
 * Build script: 3.1.1 Basisopgaven (vragen + antwoorden)
 * Generates two documents for the 3.1.1 basisopgaven folder.
 *
 * COMPLIANT with econ-word-templates skill — all tables use WidthType.DXA,
 * answerBox (green accent), answerSpace (dotted lines), tipBox for instructions.
 *
 * HOW TO ADAPT FOR ANOTHER PARAGRAPH:
 * 1. Change OUT_DIR and file names
 * 2. Update titleBlock() title and header text
 * 3. Replace the exercises array with new content
 * 4. Update domain colors if needed
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/build-311-basisopgaven.js
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
  Header, Footer, PageNumber, LevelFormat, PageBreak,
} = require("docx");

// ─── Unicode colon (U+F03A) ───
const UC = "\uF03A";

const OUT_DIR = `C:\\Users\\meije\\Documents\\0. claude - under construction\\3. Module 3 ${UC} Markt en overheid\\3.1 Hoofdstuk 1 ${UC} Markten\\3.1.1 Paragraaf 1 ${UC} Markt en marktstructuur\\basisopgaven`;
const VRAGEN_FILE = path.join(OUT_DIR, "3.1.1 Paragraaf 1 - Markt en marktstructuur \u2013 basis \u2013 vragen.docx");
const ANTWOORDEN_FILE = path.join(OUT_DIR, "3.1.1 Paragraaf 1 - Markt en marktstructuur \u2013 basis \u2013 antwoorden.docx");

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

// ─── Domain system ───
const DOMAINS = {
  markt: { label: "Markt", color: C.dBlue, light: C.dBlueLt, dark: C.dBlueDk },
};

// ─── Basic helpers ───
const sp = (after = 80) => new Paragraph({ spacing: { after }, children: [] });

const p = (text, opts = {}) => new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({ text, font: "Arial", size: 22, color: C.dark, ...opts })],
});

const pRuns = (runs) => new Paragraph({
  spacing: { after: 120 },
  children: runs.map(r => new TextRun({ font: "Arial", size: 22, color: C.dark, ...r })),
});

const h2d = (text, domainColor) => new Paragraph({
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

// ─── Tip / Warning boxes (EXACT skill code) ───
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

// ─── Answer box (green accent, from skill) ───
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

// ─── Question paragraph (bold label + text) ───
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

// ════════════════════════════════════════════════════
// EXERCISE CONTENT
// ════════════════════════════════════════════════════

function buildDocument(includeAnswers) {
  const children = [];
  const domainColor = DOMAINS.markt.color;

  // ── Title Page ──
  children.push(...titleBlock(
    "Markt en marktstructuur",
    includeAnswers ? "Basisopgaven \u2014 Antwoorden" : "Basisopgaven"
  ));
  children.push(sp(400));

  // ── Page break, then exercises ──
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // ════════════════════════════════════════════════════
  // Oefening 1
  // ════════════════════════════════════════════════════
  children.push(h2d("Oefening 1", domainColor));
  children.push(instructionBox("Lees de introductie van het hoofdstuk."));
  children.push(sp(80));

  children.push(question("a", "Wat is een telegram?"));
  if (includeAnswers) {
    children.push(answerBox(["Een kort bericht waarvan alleen de inhoud over langere afstand verzonden werd. Het is daarmee een voorloper van e-mail (of fax)."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(80));

  children.push(question("b", "Waarom biedt KPN geen telegraafdiensten meer aan?"));
  if (includeAnswers) {
    children.push(answerBox(["Berichten worden tegenwoordig op andere manieren verzonden, zoals per e-mail of WhatsApp."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(80));

  children.push(question("c", "Noem drie toetredingsdrempels van de telecommarkt."));
  if (includeAnswers) {
    children.push(answerBox([
      "Bijvoorbeeld:",
      "1. Het netwerk dat de telecomaanbieder nodig heeft om zijn diensten te kunnen aanbieden.",
      "2. De investering in de naamsbekendheid van de telecomaanbieder.",
      "3. De technische dienst van de telecomaanbieder.",
    ]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(80));

  children.push(question("d", "Is er op de telecommarkt sprake van een homogeen of een heterogeen goed?"));
  if (includeAnswers) {
    children.push(answerBox(["Een heterogeen goed. Verschillende telecomaanbieders bieden verschillende versies aan van hetzelfde product, zoals verschillende databundels."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(200));

  // ════════════════════════════════════════════════════
  // Oefening 2
  // ════════════════════════════════════════════════════
  children.push(h2d("Oefening 2", domainColor));
  children.push(p("Is er op de volgende markten sprake van een concrete markt of een abstracte markt?"));
  children.push(sp(40));

  const oef2Items = [
    ["A", "de huizenmarkt in Nederland"],
    ["B", "de markt voor ruwe olie"],
    ["C", "de vismarkt op dinsdagochtend in de binnenstad"],
    ["D", "de wereldgraanmarkt"],
    ["E", "vraag naar en aanbod van groente op een veiling"],
  ];
  for (const [lbl, txt] of oef2Items) {
    children.push(question(lbl, txt));
  }
  children.push(sp(40));

  if (includeAnswers) {
    children.push(answerBox(["C en E zijn concreet. A, B en D zijn abstract."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(200));

  // ════════════════════════════════════════════════════
  // Oefening 3
  // ════════════════════════════════════════════════════
  children.push(h2d("Oefening 3", domainColor));
  children.push(instructionBox("Lees Uit de wetenschap \u2018Marktomvang en levensvatbaarheid\u2019. Welke woorden en cijfers passen in deze samenvatting op plaats A tot en met E?"));
  children.push(sp(80));

  children.push(p("Hoe meer aanbieders op een markt, hoe \u2026A\u2026 de prijs op de markt. Door dit verband zijn er voor twee aanbieders op een markt \u2026B\u2026 dan twee keer zoveel consumenten nodig. Een markt van 710 consumenten heeft voldoende koopkracht voor \u2026C\u2026 aanbieder(s). Een markt met twee aanbieders heeft minimaal \u2026D\u2026 consumenten nodig. Het extra aantal consumenten is \u2026E\u2026."));

  if (includeAnswers) {
    children.push(answerBox(["A = lager; B = meer; C = 710; D = 2.540; E = 258"]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(200));

  // ════════════════════════════════════════════════════
  // Oefening 4
  // ════════════════════════════════════════════════════
  children.push(h2d("Oefening 4", domainColor));
  children.push(instructionBox("Lees In context \u2018Netwerksectoren\u2019."));
  children.push(sp(80));

  children.push(question("a", "Wat gebeurt er als de overheid een netwerk van een netwerksector niet aanlegt?"));
  if (includeAnswers) {
    children.push(answerBox(["Dan komt de dienst die gebruikmaakt van het netwerk niet tot stand, want voor marktpartijen is de aanleg van een netwerk te kostbaar met een onzekere terugverdientijd."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(80));

  children.push(question("b", "Geef een reden waarom de overheid een door haar aangelegd netwerk zou moeten verkopen aan een van de gebruikers van het netwerk."));
  if (includeAnswers) {
    children.push(answerBox(["De markt kan dan zijn werk doen. De overheid hoeft het netwerk niet te onderhouden. Er hoeft geen aparte toezichthouder opgericht te worden. De overheid kan de opbrengsten voor andere doelen gebruiken."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(80));

  children.push(question("c", "Geef een reden waarom de overheid een door haar aangelegd netwerk niet zou moeten verkopen aan een van de gebruikers van het netwerk."));
  if (includeAnswers) {
    children.push(answerBox(["De eigenaar van het netwerk heeft controle over de markt en kan heel hoge prijzen vragen voor gebruik van het netwerk. Dit verhoogt de kosten voor de gebruikers en uiteindelijk voor de consumenten."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(200));

  // ════════════════════════════════════════════════════
  // Oefening 5
  // ════════════════════════════════════════════════════
  children.push(h2d("Oefening 5", domainColor));
  children.push(instructionBox("Lees Uit de wetenschap \u2018Toetredingsdrempels voor de taximarkt in Chicago en New York\u2019."));
  children.push(sp(80));

  children.push(question("a", "Is taxivervoer een homogene of heterogene dienst?"));
  if (includeAnswers) {
    children.push(answerBox(["Een homogene dienst, want er zijn wel wat verschillen tussen taxi\u2019s, maar in de ogen van consumenten is het reizen per taxi toch telkens min of meer hetzelfde."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(80));

  children.push(question("b", "Leg uit dat de toetredingsdrempels voor nieuwe taxichauffeurs in Chicago en New York hoger zijn dan voor de taxichauffeurs die eerder een vergunning hebben verkregen."));
  if (includeAnswers) {
    children.push(answerBox(["Het aanbod van taxivergunningen is nu een stuk lager. Alleen de chauffeurs die van hun vergunning af willen bieden die aan."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(80));

  children.push(question("c", "Bieden Uber en Lyft dezelfde dienst aan als taxichauffeurs?"));
  if (includeAnswers) {
    children.push(answerBox(["Nee. Bij Uber en Lyft moet je van tevoren via een app een afspraak maken voor een ritje. Je kunt de Uber- en Lyftchauffeurs niet op straat aanhouden."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(80));

  children.push(question("d", "Wat is een nadeel van de intrede van Uber en Lyft voor het verkeersbeeld in grote steden?"));
  if (includeAnswers) {
    children.push(answerBox(["Het gaat drukker worden. Het idee van de taxivergunningen was de verkeersdrukte in te perken. Maar iedereen met een auto kan via Uber of Lyft mensen gaan vervoeren."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(200));

  // ════════════════════════════════════════════════════
  // Oefening 6
  // ════════════════════════════════════════════════════
  children.push(h2d("Oefening 6", domainColor));
  children.push(p("Is er op de volgende markten sprake van een homogeen product of een heterogeen product?"));
  children.push(sp(40));

  const oef6Items = [
    ["A", "caf\u00e9s in Amsterdam"],
    ["B", "de automarkt in Nederland"],
    ["C", "restaurants in Maastricht"],
    ["D", "vraag naar en aanbod van biologische prei in Nederland"],
    ["E", "vraag naar en aanbod van elektriciteit"],
    ["F", "vraag naar en aanbod van Euro 95 bij benzinepompen"],
  ];
  for (const [lbl, txt] of oef6Items) {
    children.push(question(lbl, txt));
  }
  children.push(sp(40));

  if (includeAnswers) {
    children.push(answerBox(["Homogeen product: D, E en F; heterogeen product: A, B, C"]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(200));

  // ════════════════════════════════════════════════════
  // Oefening 7
  // ════════════════════════════════════════════════════
  children.push(h2d("Oefening 7", domainColor));
  children.push(question("", "Waarom hebben aanbieders van luxe auto\u2019s meer invloed op de verkoopprijs dan aanbieders van goedkope auto\u2019s?"));

  if (includeAnswers) {
    children.push(answerBox(["De concurrentie bij luxe auto\u2019s is minder. Als een aanbieder van luxe auto\u2019s zijn prijs verhoogt, zal de afzet minder dalen. (Oftewel: de prijselasticiteit van de vraag is kleiner.)"]));
  } else {
    children.push(...answerSpace(4));
  }
  children.push(sp(200));

  // ════════════════════════════════════════════════════
  // Oefening 8
  // ════════════════════════════════════════════════════
  children.push(h2d("Oefening 8", domainColor));
  children.push(instructionBox("Lees In context \u2018De Fairphone\u2019."));
  children.push(sp(80));

  children.push(question("a", "Hoe kun je uit de tekst afleiden dat er sprake is van productdifferentiatie op de markt van smartphones?"));
  if (includeAnswers) {
    children.push(answerBox(["Fairphone produceert in tegenstelling tot de grote aanbieders een zo\u2019n eerlijk mogelijke smartphone. Veel consumenten zullen de smartphone om deze reden als een ander product beschouwen."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(80));

  children.push(question("b", "Zijn de toetredingsdrempels op de markt van mobiele telefoons hoog of laag? Verklaar je antwoord."));
  if (includeAnswers) {
    children.push(answerBox(["Hoog. Er is een groot startkapitaal nodig en specifieke kennis."]));
  } else {
    children.push(...answerSpace(3));
  }
  children.push(sp(200));

  // ════════════════════════════════════════════════════
  // Oefening 9
  // ════════════════════════════════════════════════════
  children.push(h2d("Oefening 9", domainColor));
  children.push(question("", "Leg uit hoe lage toetredingsdrempels de concurrentie op een markt bevorderen."));

  if (includeAnswers) {
    children.push(answerBox(["Als door gebrek aan concurrentie de prijs stijgt, zullen er eerder nieuwe aanbieders op de markt toetreden. Daardoor neemt de concurrentie toe en zal de prijs weer dalen."]));
  } else {
    children.push(...answerSpace(4));
  }

  return children;
}

// ════════════════════════════════════════════════════
// BUILD BOTH DOCUMENTS
// ════════════════════════════════════════════════════

function createDoc(includeAnswers) {
  const headerText = "Markt en marktstructuur \u2014 Basisopgaven";
  return new Document({
    styles: DOC_STYLES,
    sections: [{
      properties: { page: PAGE },
      headers: { default: makeHeader(headerText) },
      footers: { default: makeFooter() },
      children: buildDocument(includeAnswers),
    }],
  });
}

(async () => {
  try {
    if (!fs.existsSync(OUT_DIR)) {
      console.error("ERROR: Output directory does not exist:", OUT_DIR);
      process.exit(1);
    }

    // Build vragen document
    const vragenDoc = createDoc(false);
    const vragenBuf = await Packer.toBuffer(vragenDoc);
    fs.writeFileSync(VRAGEN_FILE, vragenBuf);
    console.log("SUCCESS: Vragen written to", VRAGEN_FILE);
    console.log("  Size:", vragenBuf.length, "bytes");

    // Build antwoorden document
    const antwoordenDoc = createDoc(true);
    const antwoordenBuf = await Packer.toBuffer(antwoordenDoc);
    fs.writeFileSync(ANTWOORDEN_FILE, antwoordenBuf);
    console.log("SUCCESS: Antwoorden written to", ANTWOORDEN_FILE);
    console.log("  Size:", antwoordenBuf.length, "bytes");

    console.log("\nDone! Both documents created successfully.");
  } catch (err) {
    console.error("ERROR:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();
