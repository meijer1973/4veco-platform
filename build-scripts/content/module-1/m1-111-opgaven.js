// m1-111-opgaven.js - Opgavensets (basis, midden, verrijking) for 1.1.1 Kiezen is kostbaar
// Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-111-opgaven.js
var path = require("path");
var fs = require("fs");
var NODE_PATH = path.join(process.env.APPDATA, "npm", "node_modules");
process.env.NODE_PATH = NODE_PATH;
require("module").Module._initPaths();

var docx = require("docx");
var Document = docx.Document, Packer = docx.Packer, Paragraph = docx.Paragraph, TextRun = docx.TextRun;
var Table = docx.Table, TableRow = docx.TableRow, TableCell = docx.TableCell;
var WidthType = docx.WidthType, AlignmentType = docx.AlignmentType, HeadingLevel = docx.HeadingLevel;
var BorderStyle = docx.BorderStyle, ShadingType = docx.ShadingType;
var Header = docx.Header, Footer = docx.Footer, PageNumber = docx.PageNumber, PageBreak = docx.PageBreak;

var BASE_DIR = "C:/Projects/4veco/module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.1 Paragraaf 1 - Kiezen is kostbaar/3. Oefenen";
var PREFIX = "1.1.1 Kiezen is kostbaar";
var PAGE = { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } };
var CW = 9026;
var CL = { navy: "1E2761", white: "FFFFFF", dark: "2D3748", gray: "718096", lightGray: "F7F8FA", borderGray: "CBD5E0", red: "D9534F", lightRed: "FDE8E8", teal: "17A2B8", tealLt: "E8F8F5", tealDk: "117A65", amber: "E67E22", amberLt: "FEF5E7", green: "1E8449", greenLt: "E8F5E9", rowAlt: "F7FAFC" };

function sp(after) { return new Paragraph({ spacing: { after: after || 80 }, children: [] }); }
function p(text, opts) { return new Paragraph({ spacing: { after: 120 }, children: [new TextRun(Object.assign({ text: text, font: "Arial", size: 22, color: CL.dark }, opts || {}))] }); }
function h2d(text, color) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 120 }, children: [new TextRun({ text: text, bold: true, font: "Arial", size: 24, color: color || CL.teal })] }); }
function titleBlock(title, subtitle) {
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: title, bold: true, font: "Arial", size: 48, color: CL.navy })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: subtitle, font: "Arial", size: 26, color: CL.gray })] }),
  ];
}
function makeHeader(text) { return new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: text, font: "Arial", size: 18, color: CL.gray, italics: true })] })] }); }
function makeFooter() { return new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pagina ", font: "Arial", size: 18, color: CL.gray }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: CL.gray })] })] }); }
function instructionBox(text) {
  return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [CW], rows: [new TableRow({ children: [new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: CL.tealLt }, bottom: { style: BorderStyle.SINGLE, size: 1, color: CL.tealLt }, left: { style: BorderStyle.SINGLE, size: 12, color: CL.teal }, right: { style: BorderStyle.SINGLE, size: 1, color: CL.tealLt } }, shading: { fill: CL.tealLt, type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 200, right: 200 }, width: { size: CW, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "\uD83D\uDCD6 ", bold: true, font: "Arial", size: 22, color: CL.teal }), new TextRun({ text: text, font: "Arial", size: 22, color: CL.dark })] })] })] })] });
}
function answerBox(lines) {
  return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [CW], rows: [new TableRow({ children: [new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: CL.greenLt }, bottom: { style: BorderStyle.SINGLE, size: 1, color: CL.greenLt }, left: { style: BorderStyle.SINGLE, size: 8, color: CL.green }, right: { style: BorderStyle.SINGLE, size: 1, color: CL.greenLt } }, shading: { fill: CL.greenLt, type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 200, right: 200 }, width: { size: CW, type: WidthType.DXA }, children: lines.map(function(line) { return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: line, font: "Arial", size: 22, color: CL.dark })] }); }) })] })] });
}
function answerSpace(n) {
  var out = [];
  for (var i = 0; i < n; i++) {
    out.push(new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: " ", font: "Arial", size: 22 })], border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: CL.borderGray, space: 1 } } }));
    out.push(sp(120));
  }
  return out;
}
function question(label, text) { return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: label + "  ", bold: true, font: "Arial", size: 22, color: CL.dark }), new TextRun({ text: text, font: "Arial", size: 22, color: CL.dark })] }); }

function buildBasis(ans) {
  var ch = [];
  ch.push.apply(ch, titleBlock("Kiezen is kostbaar", ans ? "Basisopgaven \u2014 Antwoorden" : "Basisopgaven"));
  ch.push(sp(200)); ch.push(instructionBox("Deze opgaven gaan over schaarste, alternatieve kosten en nettobaten.")); ch.push(sp(400));
  ch.push(new Paragraph({ children: [new PageBreak()] }));

  ch.push(h2d("Opgave 1", CL.teal));
  ch.push(question("a", "Leg uit wat schaarste is."));
  if (ans) ch.push(answerBox(["Schaarste betekent dat de behoeften groter zijn dan de beschikbare middelen. Daardoor moet je kiezen."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(80));
  ch.push(question("b", "Noem drie voorbeelden van schaarse middelen."));
  if (ans) ch.push(answerBox(["1. Geld (beperkt inkomen/budget).", "2. Tijd (24 uur per dag).", "3. Grondstoffen (olie, water, land)."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(200));

  ch.push(h2d("Opgave 2", CL.teal));
  ch.push(question("", "Leg uit wat het verschil is tussen behoeften en middelen."));
  if (ans) ch.push(answerBox(["Behoeften zijn wensen en verlangens \u2014 ze zijn onbeperkt. Middelen zijn de beschikbare bronnen (geld, tijd, arbeid, grondstoffen) om behoeften te vervullen \u2014 die zijn beperkt."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(200));

  ch.push(h2d("Opgave 3", CL.amber));
  ch.push(p("Emma kan op woensdagmiddag kiezen: 3 uur werken bij een winkel (\u20AC12 per uur) of 3 uur naar een vriendin."));
  ch.push(question("a", "Emma kiest voor de vriendin. Wat zijn haar alternatieve kosten?"));
  if (ans) ch.push(answerBox(["De alternatieve kosten zijn het inkomen dat ze misloopt: 3 \u00d7 \u20AC12 = \u20AC36."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(80));
  ch.push(question("b", "Waarom is het bezoek aan de vriendin niet gratis, ook al betaalt Emma niets?"));
  if (ans) ch.push(answerBox(["Hoewel Emma geen geld uitgeeft, geeft ze wel inkomen op (\u20AC36). Elke keuze heeft alternatieve kosten."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(200));

  ch.push(h2d("Opgave 4", CL.amber));
  ch.push(p("Een leerling heeft \u20AC40 en kiest tussen: een game (\u20AC40, plezier \u20AC55) of twee bioscoopkaartjes (\u20AC30, plezier \u20AC50)."));
  ch.push(question("a", "Bereken de nettobaten van beide opties."));
  if (ans) ch.push(answerBox(["Nettobaten game = \u20AC55 \u2212 \u20AC40 = \u20AC15.", "Nettobaten bioscoop = \u20AC50 \u2212 \u20AC30 = \u20AC20."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("b", "Welke keuze is economisch het meest rationeel? Leg uit."));
  if (ans) ch.push(answerBox(["De bioscoop: nettobaten (\u20AC20) zijn hoger dan die van de game (\u20AC15)."])); else ch.push.apply(ch, answerSpace(3));
  return ch;
}

function buildMidden(ans) {
  var ch = [];
  ch.push.apply(ch, titleBlock("Kiezen is kostbaar", ans ? "Middenopgaven \u2014 Antwoorden" : "Middenopgaven"));
  ch.push(sp(200)); ch.push(instructionBox("Deze opgaven vragen om toepassing en analyse.")); ch.push(sp(400));
  ch.push(new Paragraph({ children: [new PageBreak()] }));

  ch.push(h2d("Opgave 1", CL.amber));
  ch.push(p("Tim heeft 12 uur per week vrij. Hij kan werken (\u20AC14/uur), studeren of sporten."));
  ch.push(question("a", "Bereken de alternatieve kosten van 1 examenpunt als studeren 4 uur kost."));
  if (ans) ch.push(answerBox(["1 examenpunt kost 4 uur. In 4 uur werken verdient Tim 4 \u00d7 \u20AC14 = \u20AC56.", "Alternatieve kosten van 1 examenpunt = \u20AC56."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("b", "Tim kiest voor 8 uur studeren en 4 uur sporten. Bereken zijn alternatieve kosten."));
  if (ans) ch.push(answerBox(["Tim werkt 0 uur en mist 12 \u00d7 \u20AC14 = \u20AC168.", "Alternatieve kosten = \u20AC168."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(200));

  ch.push(h2d("Opgave 2", CL.amber));
  ch.push(p("Een gezin heeft \u20AC3.000 spaargeld. Drie opties:"));
  ch.push(p("A: Vakantie (kosten \u20AC2.500, baten \u20AC3.200). B: Keuken (kosten \u20AC3.000, baten \u20AC3.800). C: Beleggen (kosten \u20AC3.000, baten \u20AC3.300)."));
  ch.push(question("a", "Bereken de nettobaten van elke optie."));
  if (ans) ch.push(answerBox(["A: \u20AC700. B: \u20AC800. C: \u20AC300."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("b", "Het gezin kiest B. Wat zijn de alternatieve kosten?"));
  if (ans) ch.push(answerBox(["Beste gemiste: A met nettobaten \u20AC700. AK = \u20AC700."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(80));
  ch.push(question("c", "Bereken de opofferingskosten van optie B."));
  if (ans) ch.push(answerBox(["Opofferingskosten = \u20AC700 + \u20AC3.000 = \u20AC3.700."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(200));

  ch.push(h2d("Opgave 3", CL.green));
  ch.push(p("Overheid: \u20AC10 mld voor onderwijs (baten \u20AC14 mld) of infrastructuur (baten \u20AC12 mld)."));
  ch.push(question("a", "Bereken nettobaten en AK als de overheid kiest voor onderwijs."));
  if (ans) ch.push(answerBox(["Nettobaten onderwijs = \u20AC4 mld. Nettobaten infra = \u20AC2 mld. AK = \u20AC2 mld."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(80));
  ch.push(question("b", "Leg uit waarom de overheid toch voor infrastructuur zou kunnen kiezen."));
  if (ans) ch.push(answerBox(["Niet-economische factoren: urgentie, politieke beloften, werkgelegenheid, onzekerheid over baten onderwijs."])); else ch.push.apply(ch, answerSpace(4));
  return ch;
}

function buildVerrijking(ans) {
  var ch = [];
  ch.push.apply(ch, titleBlock("Kiezen is kostbaar", ans ? "Verrijkingsopgaven \u2014 Antwoorden" : "Verrijkingsopgaven"));
  ch.push(sp(200)); ch.push(instructionBox("Diepgaande analyse en verbanden leggen.")); ch.push(sp(400));
  ch.push(new Paragraph({ children: [new PageBreak()] }));

  ch.push(h2d("Opgave 1 \u2014 Budgetlijn", CL.teal));
  ch.push(p("Student: 30 uur/week, werken \u20AC15/uur, studeren 1 punt per 6 uur. Minimaal \u20AC150 nodig."));
  ch.push(question("a", "Beschrijf de budgetlijn (inkomen op x-as, studiepunten op y-as)."));
  if (ans) ch.push(answerBox(["Max werken: 30\u00d7\u20AC15=\u20AC450, 0 punten. Max studeren: 30/6=5 punten, \u20AC0. Rechte lijn van (0,5) naar (450,0)."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(80));
  ch.push(question("b", "Hoeveel studiepunten maximaal bij minimaal \u20AC150 inkomen?"));
  if (ans) ch.push(answerBox(["Voor \u20AC150: 10 uur werken. Rest: 20 uur studeren = 20/6 \u2248 3 punten."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("c", "Bereken de alternatieve kosten van het 3e studiepunt."));
  if (ans) ch.push(answerBox(["1 punt = 6 uur. In 6 uur werken: 6\u00d7\u20AC15 = \u20AC90. AK = \u20AC90."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(200));

  ch.push(h2d("Opgave 2 \u2014 Maatschappelijke keuze", CL.green));
  ch.push(p("Nederland: \u20AC5 mld voor dijken of zorginfrastructuur. Baten dijken zijn onzeker."));
  ch.push(question("a", "Waarom is dit keuzeprobleem complexer dan een individuele keuze?"));
  if (ans) ch.push(answerBox(["1. Baten onzeker (klimaat). 2. Collectief goed. 3. Intergenerationeel. 4. Niet in geld uit te drukken."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(80));
  ch.push(question("b", "Waarom omvatten de AK van dijkverhoging meer dan alleen de gemiste zorginvestering?"));
  if (ans) ch.push(answerBox(["Ook indirecte effecten: langere wachtlijsten, minder gezondheidswinst, mogelijk hogere kosten later."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(200));

  ch.push(h2d("Opgave 3 \u2014 Rationele keuze?", CL.amber));
  ch.push(p("Iemand wacht 2 uur op een gratis concert. Hij had \u20AC30 kunnen verdienen."));
  ch.push(question("a", "Bereken de alternatieve kosten van het wachten."));
  if (ans) ch.push(answerBox(["AK = \u20AC30 (misgelopen inkomen)."])); else ch.push.apply(ch, answerSpace(2));
  ch.push(sp(80));
  ch.push(question("b", "Leg uit waarom het concert niet 'gratis' is in economische zin."));
  if (ans) ch.push(answerBox(["De 2 uur wachttijd hebben alternatieve kosten van \u20AC30. Het concert kost dus iets \u2014 in misgelopen inkomen."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("c", "Plezier concert geschat op \u20AC50. Bereken nettobaten en beoordeel of de keuze rationeel was."));
  if (ans) ch.push(answerBox(["Nettobaten = \u20AC50 \u2212 \u20AC30 = \u20AC20. Positief, dus economisch rationeel."])); else ch.push.apply(ch, answerSpace(4));
  return ch;
}

var DOC_STYLES = { default: { document: { run: { font: "Arial", size: 22 } } } };

async function buildDoc(children, headerText, outPath) {
  var doc = new Document({ styles: DOC_STYLES, sections: [{ properties: { page: PAGE }, headers: { default: makeHeader(headerText) }, footers: { default: makeFooter() }, children: children }] });
  var buf = await Packer.toBuffer(doc);
  var dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outPath, buf);
  console.log("  " + path.basename(outPath) + " (" + (buf.length / 1024).toFixed(0) + " KB)");
}

(async function() {
  console.log("Building opgavensets for 1.1.1 Kiezen is kostbaar...\n");
  await buildDoc(buildBasis(false), PREFIX + " \u2013 Basisopgaven", path.join(BASE_DIR, "basisopgaven", PREFIX + " \u2013 basis \u2013 vragen.docx"));
  await buildDoc(buildBasis(true), PREFIX + " \u2013 Basisopgaven", path.join(BASE_DIR, "basisopgaven", PREFIX + " \u2013 basis \u2013 antwoorden.docx"));
  await buildDoc(buildMidden(false), PREFIX + " \u2013 Middenopgaven", path.join(BASE_DIR, "middenopgaven", PREFIX + " \u2013 midden \u2013 vragen.docx"));
  await buildDoc(buildMidden(true), PREFIX + " \u2013 Middenopgaven", path.join(BASE_DIR, "middenopgaven", PREFIX + " \u2013 midden \u2013 antwoorden.docx"));
  await buildDoc(buildVerrijking(false), PREFIX + " \u2013 Verrijkingsopgaven", path.join(BASE_DIR, "verrijkingsopgaven", PREFIX + " \u2013 verrijking \u2013 vragen.docx"));
  await buildDoc(buildVerrijking(true), PREFIX + " \u2013 Verrijkingsopgaven", path.join(BASE_DIR, "verrijkingsopgaven", PREFIX + " \u2013 verrijking \u2013 antwoorden.docx"));
  console.log("\nDone! All 6 files created.");
})();
