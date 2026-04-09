// m1-112-opgaven.js - Opgavensets (basis, midden, verrijking) for 1.1.2 Kiezen of delen
// Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-112-opgaven.js
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

var BASE_DIR = "C:/Projects/4veco/module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.2 Paragraaf 2 - Kiezen of delen/3. Oefenen";
var PREFIX = "1.1.2 Kiezen of delen";
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

// ====================================================================
// BASISOPGAVEN (10 vragen)
// ====================================================================
function buildBasis(ans) {
  var ch = [];
  ch.push.apply(ch, titleBlock("Kiezen of delen", ans ? "Basisopgaven \u2014 Antwoorden" : "Basisopgaven"));
  ch.push(sp(200)); ch.push(instructionBox("Deze opgaven gaan over budgetlijnen, budgetvergelijkingen en snijpunten met de assen.")); ch.push(sp(400));
  ch.push(new Paragraph({ children: [new PageBreak()] }));

  // Opgave 1: Begrippen
  ch.push(h2d("Opgave 1", CL.teal));
  ch.push(question("a", "Wat is een budgetlijn?"));
  if (ans) ch.push(answerBox(["Een budgetlijn is een lijn die alle combinaties van twee goederen weergeeft die een consument kan kopen als hij zijn hele budget besteedt."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(80));
  ch.push(question("b", "Schrijf de algemene budgetvergelijking op."));
  if (ans) ch.push(answerBox(["p\u2081 \u00b7 q\u2081 + p\u2082 \u00b7 q\u2082 = B"])); else ch.push.apply(ch, answerSpace(2));
  ch.push(sp(80));
  ch.push(question("c", "Wat stellen p\u2081, q\u2081, p\u2082, q\u2082 en B voor in de budgetvergelijking?"));
  if (ans) ch.push(answerBox(["p\u2081 = prijs van goed 1, q\u2081 = hoeveelheid goed 1, p\u2082 = prijs van goed 2, q\u2082 = hoeveelheid goed 2, B = het beschikbare budget."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(200));

  // Opgave 2: Snijpunten berekenen
  ch.push(h2d("Opgave 2", CL.teal));
  ch.push(p("Een consument heeft een budget van \u20AC80. Goed 1 kost \u20AC8 per stuk en goed 2 kost \u20AC10 per stuk."));
  ch.push(question("a", "Bereken het snijpunt van de budgetlijn met de q\u2081-as."));
  if (ans) ch.push(answerBox(["q\u2081 = B / p\u2081 = \u20AC80 / \u20AC8 = 10. Snijpunt: (10, 0)."])); else ch.push.apply(ch, answerSpace(2));
  ch.push(sp(80));
  ch.push(question("b", "Bereken het snijpunt van de budgetlijn met de q\u2082-as."));
  if (ans) ch.push(answerBox(["q\u2082 = B / p\u2082 = \u20AC80 / \u20AC10 = 8. Snijpunt: (0, 8)."])); else ch.push.apply(ch, answerSpace(2));
  ch.push(sp(200));

  // Opgave 3: Punt op de lijn?
  ch.push(h2d("Opgave 3", CL.teal));
  ch.push(p("Budget = \u20AC60, p\u2081 = \u20AC5, p\u2082 = \u20AC10."));
  ch.push(question("a", "Ligt de combinatie q\u2081 = 4, q\u2082 = 4 op de budgetlijn? Reken na."));
  if (ans) ch.push(answerBox(["5 \u00d7 4 + 10 \u00d7 4 = 20 + 40 = 60 = B. Ja, het punt ligt op de budgetlijn."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(80));
  ch.push(question("b", "Ligt de combinatie q\u2081 = 8, q\u2082 = 3 op, onder of boven de budgetlijn? Leg uit."));
  if (ans) ch.push(answerBox(["5 \u00d7 8 + 10 \u00d7 3 = 40 + 30 = 70. Dit is meer dan B (\u20AC60), dus het punt ligt boven de budgetlijn. Deze combinatie is niet betaalbaar."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(200));

  // Opgave 4: Helling
  ch.push(h2d("Opgave 4", CL.amber));
  ch.push(p("Budget = \u20AC100, p\u2081 = \u20AC10, p\u2082 = \u20AC25."));
  ch.push(question("", "Bereken de helling van de budgetlijn en leg uit wat deze helling betekent."));
  if (ans) ch.push(answerBox(["Helling = \u2212p\u2081 / p\u2082 = \u221210 / 25 = \u22120,4.", "Dit betekent: als de consument 1 eenheid meer van goed 1 koopt, moet hij 0,4 eenheid van goed 2 opgeven."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(200));

  // Opgave 5: Evenwijdige verschuiving herkennen
  ch.push(h2d("Opgave 5", CL.amber));
  ch.push(question("a", "Wat gebeurt er met de budgetlijn als het budget stijgt, maar de prijzen gelijk blijven?"));
  if (ans) ch.push(answerBox(["De budgetlijn verschuift evenwijdig naar buiten (naar rechts/boven). De helling verandert niet."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(80));
  ch.push(question("b", "Wat gebeurt er met de budgetlijn als het budget daalt, maar de prijzen gelijk blijven?"));
  if (ans) ch.push(answerBox(["De budgetlijn verschuift evenwijdig naar binnen (naar links/onder). De helling verandert niet."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(200));

  // Opgave 6: Kantelen herkennen
  ch.push(h2d("Opgave 6", CL.amber));
  ch.push(question("a", "Wat gebeurt er met de budgetlijn als de prijs van goed 1 stijgt, terwijl p\u2082 en B gelijk blijven?"));
  if (ans) ch.push(answerBox(["De budgetlijn kantelt naar binnen. Het snijpunt met de q\u2081-as schuift naar links (je kunt minder van goed 1 kopen). Het snijpunt met de q\u2082-as blijft gelijk."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("b", "Welk snijpunt verandert als alleen p\u2082 daalt? Leg uit."));
  if (ans) ch.push(answerBox(["Het snijpunt met de q\u2082-as verandert: q\u2082 = B / p\u2082 wordt groter doordat p\u2082 kleiner wordt. Het snijpunt met de q\u2081-as (= B / p\u2081) blijft gelijk."])); else ch.push.apply(ch, answerSpace(4));

  return ch;
}

// ====================================================================
// MIDDENOPGAVEN (8 vragen)
// ====================================================================
function buildMidden(ans) {
  var ch = [];
  ch.push.apply(ch, titleBlock("Kiezen of delen", ans ? "Middenopgaven \u2014 Antwoorden" : "Middenopgaven"));
  ch.push(sp(200)); ch.push(instructionBox("Deze opgaven vragen om toepassing en analyse van budgetlijnen.")); ch.push(sp(400));
  ch.push(new Paragraph({ children: [new PageBreak()] }));

  // Opgave 1: T-shirts en broeken
  ch.push(h2d("Opgave 1", CL.amber));
  ch.push(p("Lars heeft \u20AC180 te besteden aan kleding. T-shirts kosten \u20AC15 per stuk en broeken kosten \u20AC45 per stuk."));
  ch.push(question("a", "Stel de budgetvergelijking op."));
  if (ans) ch.push(answerBox(["15 \u00b7 q\u2081 + 45 \u00b7 q\u2082 = 180 (met q\u2081 = aantal T-shirts, q\u2082 = aantal broeken)."])); else ch.push.apply(ch, answerSpace(2));
  ch.push(sp(80));
  ch.push(question("b", "Bereken de snijpunten met de assen."));
  if (ans) ch.push(answerBox(["q\u2081-as: 180 / 15 = 12 T-shirts, punt (12, 0).", "q\u2082-as: 180 / 45 = 4 broeken, punt (0, 4)."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(80));
  ch.push(question("c", "Lars koopt 6 T-shirts. Hoeveel broeken kan hij maximaal nog kopen?"));
  if (ans) ch.push(answerBox(["Uitgaven T-shirts: 6 \u00d7 \u20AC15 = \u20AC90. Resterend budget: \u20AC180 \u2212 \u20AC90 = \u20AC90.", "Maximaal broeken: \u20AC90 / \u20AC45 = 2 broeken."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(200));

  // Opgave 2: Budgetstijging
  ch.push(h2d("Opgave 2", CL.amber));
  ch.push(p("Lars' ouders geven hem \u20AC90 extra voor kleding, waardoor zijn budget stijgt van \u20AC180 naar \u20AC270. De prijzen blijven gelijk."));
  ch.push(question("a", "Bereken de nieuwe snijpunten met de assen."));
  if (ans) ch.push(answerBox(["q\u2081-as: 270 / 15 = 18 T-shirts.", "q\u2082-as: 270 / 45 = 6 broeken."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(80));
  ch.push(question("b", "Beschrijf de verschuiving van de budgetlijn. Is het een evenwijdige verschuiving of een kanteling?"));
  if (ans) ch.push(answerBox(["Het is een evenwijdige verschuiving naar buiten. De helling (\u221215/45 = \u2212\u2153) blijft gelijk, want de prijzen zijn niet veranderd. Alleen het budget is gestegen."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(200));

  // Opgave 3: Prijsverandering
  ch.push(h2d("Opgave 3", CL.amber));
  ch.push(p("Terug naar de oude situatie: B = \u20AC180, p\u2081 = \u20AC15, p\u2082 = \u20AC45. De prijs van T-shirts daalt naar \u20AC10."));
  ch.push(question("a", "Bereken de nieuwe snijpunten."));
  if (ans) ch.push(answerBox(["q\u2081-as: 180 / 10 = 18 T-shirts (was 12). q\u2082-as: 180 / 45 = 4 broeken (onveranderd)."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(80));
  ch.push(question("b", "Beschrijf wat er met de budgetlijn gebeurt. Rond welk punt kantelt de lijn?"));
  if (ans) ch.push(answerBox(["De budgetlijn kantelt naar buiten rond het snijpunt (0, 4) op de q\u2082-as. Het snijpunt met de q\u2081-as verschuift van (12, 0) naar (18, 0). T-shirts zijn relatief goedkoper geworden ten opzichte van broeken."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(200));

  // Opgave 4: Gecombineerde verandering
  ch.push(h2d("Opgave 4", CL.green));
  ch.push(p("Budget = \u20AC200, p\u2081 = \u20AC20, p\u2082 = \u20AC50. Door inflatie stijgen beide prijzen met 25%."));
  ch.push(question("a", "Bereken de snijpunten v\u00f3\u00f3r en na de prijsstijging."));
  if (ans) ch.push(answerBox(["V\u00f3\u00f3r: q\u2081 = 200/20 = 10, q\u2082 = 200/50 = 4.", "Na: p\u2081 = \u20AC25, p\u2082 = \u20AC62,50. q\u2081 = 200/25 = 8, q\u2082 = 200/62,50 = 3,2."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("b", "Is dit een evenwijdige verschuiving of een kanteling? Leg uit."));
  if (ans) ch.push(answerBox(["Evenwijdige verschuiving naar binnen. Beide prijzen stijgen met hetzelfde percentage (25%), dus de prijsverhouding p\u2081/p\u2082 = 20/50 = 25/62,50 = 0,4 blijft gelijk. De helling verandert niet, maar de koopkracht daalt."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(200));

  // Opgave 5: Samengesteld
  ch.push(h2d("Opgave 5", CL.green));
  ch.push(p("Eva heeft een weekbudget van \u20AC150 voor eten (\u20AC10/maaltijd) en entertainment (\u20AC30/activiteit)."));
  ch.push(question("a", "Teken de budgetlijn (beschrijf de snijpunten en de helling)."));
  if (ans) ch.push(answerBox(["Snijpunt q\u2081-as (maaltijden): 150/10 = 15, punt (15, 0).", "Snijpunt q\u2082-as (entertainment): 150/30 = 5, punt (0, 5).", "Helling = \u221210/30 = \u2212\u2153."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("b", "Eva krijgt een kortingskaart: entertainment kost nu \u20AC20 per activiteit. Beschrijf het effect op de budgetlijn."));
  if (ans) ch.push(answerBox(["De budgetlijn kantelt naar buiten rond het snijpunt (15, 0) op de q\u2081-as. Nieuw snijpunt q\u2082-as: 150/20 = 7,5. De helling verandert van \u2212\u2153 naar \u221210/20 = \u2212\u00bd."])); else ch.push.apply(ch, answerSpace(4));

  return ch;
}

// ====================================================================
// VERRIJKINGSOPGAVEN (6 vragen)
// ====================================================================
function buildVerrijking(ans) {
  var ch = [];
  ch.push.apply(ch, titleBlock("Kiezen of delen", ans ? "Verrijkingsopgaven \u2014 Antwoorden" : "Verrijkingsopgaven"));
  ch.push(sp(200)); ch.push(instructionBox("Diepgaande analyse: arbeid-vrije-tijd, procentuele vergelijkingen en beleidscasussen.")); ch.push(sp(400));
  ch.push(new Paragraph({ children: [new PageBreak()] }));

  // Opgave 1: Arbeid-vrije-tijd afruil
  ch.push(h2d("Opgave 1 \u2014 Arbeid en vrije tijd", CL.teal));
  ch.push(p("Nadia heeft per week 40 uur beschikbaar voor werken of vrije tijd. Haar uurloon is \u20AC18."));
  ch.push(question("a", "Stel de budgetvergelijking op met inkomen (Y) op de ene as en vrije tijd (V) op de andere."));
  if (ans) ch.push(answerBox(["Gewerkte uren = 40 \u2212 V. Inkomen Y = 18 \u00d7 (40 \u2212 V) = 720 \u2212 18V.", "Of: Y + 18V = 720. Dit is de budgetvergelijking met 'prijs' van vrije tijd = \u20AC18."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("b", "Bereken de snijpunten. Wat betekenen ze economisch?"));
  if (ans) ch.push(answerBox(["V-as (alleen vrije tijd): V = 40 uur, Y = \u20AC0. Nadia werkt niet en heeft geen inkomen.", "Y-as (alleen werken): V = 0, Y = 40 \u00d7 \u20AC18 = \u20AC720. Nadia werkt alle 40 uur.", "De budgetlijn toont de afruil tussen inkomen en vrije tijd."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(80));
  ch.push(question("c", "Wat zijn de opofferingskosten van 1 uur vrije tijd? En van 5 uur extra vrije tijd?"));
  if (ans) ch.push(answerBox(["Opofferingskosten van 1 uur vrije tijd = \u20AC18 (het misgelopen uurloon).", "Opofferingskosten van 5 uur extra vrije tijd = 5 \u00d7 \u20AC18 = \u20AC90 misgelopen inkomen."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(200));

  // Opgave 2: Loonverandering
  ch.push(h2d("Opgave 2 \u2014 Loonsverhoging", CL.amber));
  ch.push(p("Nadia's uurloon stijgt van \u20AC18 naar \u20AC24. Ze heeft nog steeds 40 uur beschikbaar."));
  ch.push(question("a", "Bereken de nieuwe snijpunten en beschrijf de verschuiving van de budgetlijn."));
  if (ans) ch.push(answerBox(["V-as: V = 40 uur, Y = \u20AC0 (onveranderd \u2014 zonder werken geen inkomen).", "Y-as: V = 0, Y = 40 \u00d7 \u20AC24 = \u20AC960 (was \u20AC720).", "De budgetlijn kantelt naar buiten rond het snijpunt (40, 0) op de V-as. Elk uur werken levert nu meer op."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(80));
  ch.push(question("b", "Bereken met hoeveel procent de opofferingskosten van vrije tijd zijn gestegen."));
  if (ans) ch.push(answerBox(["Oude opofferingskosten per uur vrije tijd: \u20AC18. Nieuwe: \u20AC24.", "Procentuele stijging = (24 \u2212 18) / 18 \u00d7 100% = 33,3%.", "De opofferingskosten van vrije tijd zijn met 33,3% gestegen."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(200));

  // Opgave 3: Procentuele vergelijkingen
  ch.push(h2d("Opgave 3 \u2014 Procentuele effecten", CL.amber));
  ch.push(p("Budget = \u20AC240, p\u2081 = \u20AC12, p\u2082 = \u20AC40."));
  ch.push(question("a", "Bereken de snijpunten. Bereken vervolgens de nieuwe snijpunten als het budget met 20% stijgt."));
  if (ans) ch.push(answerBox(["Oud: q\u2081 = 240/12 = 20, q\u2082 = 240/40 = 6.", "Nieuw budget: 240 \u00d7 1,20 = \u20AC288.", "q\u2081 = 288/12 = 24, q\u2082 = 288/40 = 7,2.", "Beide snijpunten stijgen met 20% (24/20 = 1,20 en 7,2/6 = 1,20)."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(80));
  ch.push(question("b", "Bereken de nieuwe snijpunten als (bij het oorspronkelijke budget) p\u2081 met 50% stijgt. Vergelijk de helling voor en na."));
  if (ans) ch.push(answerBox(["Nieuw p\u2081 = 12 \u00d7 1,50 = \u20AC18. q\u2081 = 240/18 = 13,3. q\u2082 = 240/40 = 6 (onveranderd).", "Oude helling: \u221212/40 = \u22120,3. Nieuwe helling: \u221218/40 = \u22120,45.", "De budgetlijn is steiler geworden: goed 1 is relatief duurder, dus je geeft meer van goed 2 op per extra goed 1."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(200));

  // Opgave 4: Subsidie (beleidscase)
  ch.push(h2d("Opgave 4 \u2014 Overheidssubsidie", CL.green));
  ch.push(p("De overheid wil de consumptie van biologisch voedsel stimuleren. Momenteel: B = \u20AC300, prijs biologisch (goed 1) = \u20AC15, prijs regulier (goed 2) = \u20AC10."));
  ch.push(question("a", "De overheid subsidieert biologisch voedsel, waardoor de prijs daalt naar \u20AC10. Beschrijf het effect op de budgetlijn."));
  if (ans) ch.push(answerBox(["Oud: q\u2081 = 300/15 = 20, q\u2082 = 300/10 = 30. Helling = \u221215/10 = \u22121,5.", "Nieuw: q\u2081 = 300/10 = 30, q\u2082 = 300/10 = 30. Helling = \u221210/10 = \u22121.", "De budgetlijn kantelt naar buiten rond het snijpunt (0, 30) op de q\u2082-as. Biologisch voedsel is nu relatief even duur als regulier."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(80));
  ch.push(question("b", "Alternatief: de overheid geeft iedereen \u20AC75 extra budget (geen subsidie op de prijs). Beschrijf het verschil met de subsidie uit vraag a."));
  if (ans) ch.push(answerBox(["Budget wordt \u20AC375, prijzen blijven \u20AC15 en \u20AC10.", "q\u2081 = 375/15 = 25, q\u2082 = 375/10 = 37,5. Evenwijdige verschuiving naar buiten.", "Verschil: bij de subsidie kantelt de lijn (biologisch wordt relatief goedkoper), bij extra budget verschuift de lijn evenwijdig (de consument kan van alles meer kopen, zonder de relatieve prijs te veranderen). De subsidie stuurt richting biologisch; het extra budget niet."])); else ch.push.apply(ch, answerSpace(6));
  ch.push(sp(200));

  // Opgave 5: Complexe arbeid-vrije-tijd case
  ch.push(h2d("Opgave 5 \u2014 Twee banen", CL.green));
  ch.push(p("Daan kan maximaal 30 uur per week werken. Hij overweegt twee banen: barista (\u20AC11/uur) of bijles geven (\u20AC20/uur, max 10 uur/week)."));
  ch.push(question("a", "Bereken Daans maximale weekinkomen als hij de twee banen combineert."));
  if (ans) ch.push(answerBox(["Bijles: 10 uur \u00d7 \u20AC20 = \u20AC200. Barista: resterende 20 uur \u00d7 \u20AC11 = \u20AC220.", "Maximaal weekinkomen = \u20AC200 + \u20AC220 = \u20AC420."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("b", "Bereken de opofferingskosten van het eerste uur vrije tijd (hij werkt nu 30 uur) en van het elfde uur vrije tijd (hij werkt dan 19 uur)."));
  if (ans) ch.push(answerBox(["Als Daan 30 uur werkt (10 bijles + 20 barista), zijn het eerste uur vrije tijd kost hem \u20AC11 (hij laat een barista-uur vallen, want bijles betaalt beter).", "Het elfde uur vrije tijd: hij heeft al 10 barista-uren opgegeven, nu geeft hij een bijles-uur op. Opofferingskosten = \u20AC20.", "De opofferingskosten van vrije tijd zijn hier niet constant: ze stijgen naarmate je meer vrije tijd neemt (van \u20AC11 naar \u20AC20)."])); else ch.push.apply(ch, answerSpace(6));
  ch.push(sp(200));

  // Opgave 6: Belastingbeleid
  ch.push(h2d("Opgave 6 \u2014 Belastingbeleid en budgetlijn", CL.green));
  ch.push(p("De overheid overweegt twee maatregelen om consumenten te helpen bij stijgende energieprijzen:\n\u2022 Maatregel A: BTW op energie verlagen van 21% naar 9%\n\u2022 Maatregel B: elke huishouden \u20AC500 energietoeslag geven"));
  ch.push(question("a", "Leg uit welk effect maatregel A heeft op de budgetlijn (met energie op de q\u2081-as en overige uitgaven op de q\u2082-as)."));
  if (ans) ch.push(answerBox(["De prijs van energie (p\u2081) daalt doordat de BTW wordt verlaagd. Het snijpunt met de q\u2081-as verschuift naar rechts (meer energie betaalbaar). Het snijpunt met de q\u2082-as blijft gelijk. De budgetlijn kantelt naar buiten rond het snijpunt op de q\u2082-as."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(80));
  ch.push(question("b", "Leg uit welk effect maatregel B heeft op de budgetlijn."));
  if (ans) ch.push(answerBox(["Het budget (B) stijgt met \u20AC500. De prijzen veranderen niet. De budgetlijn verschuift evenwijdig naar buiten. Consumenten kunnen van zowel energie als overige goederen meer kopen."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("c", "Beredeneer welke maatregel effectiever is om specifiek het energieverbruik te stimuleren, en welke maatregel de keuzevrijheid van consumenten het meest vergroot."));
  if (ans) ch.push(answerBox(["Maatregel A (BTW-verlaging) maakt energie relatief goedkoper en stimuleert specifiek energieverbruik \u2014 de budgetlijn kantelt richting meer energie.", "Maatregel B (toeslag) vergroot het budget zonder prijzen te veranderen: consumenten kiezen zelf waar ze het aan besteden. Dit vergroot de keuzevrijheid meer.", "Conclusie: A stuurt sterker richting energie, B laat de consument zelf kiezen."])); else ch.push.apply(ch, answerSpace(6));

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
  console.log("Building opgavensets for 1.1.2 Kiezen of delen...\n");
  await buildDoc(buildBasis(false), PREFIX + " \u2013 Basisopgaven", path.join(BASE_DIR, "basisopgaven", PREFIX + " \u2013 basis \u2013 vragen.docx"));
  await buildDoc(buildBasis(true), PREFIX + " \u2013 Basisopgaven", path.join(BASE_DIR, "basisopgaven", PREFIX + " \u2013 basis \u2013 antwoorden.docx"));
  await buildDoc(buildMidden(false), PREFIX + " \u2013 Middenopgaven", path.join(BASE_DIR, "middenopgaven", PREFIX + " \u2013 midden \u2013 vragen.docx"));
  await buildDoc(buildMidden(true), PREFIX + " \u2013 Middenopgaven", path.join(BASE_DIR, "middenopgaven", PREFIX + " \u2013 midden \u2013 antwoorden.docx"));
  await buildDoc(buildVerrijking(false), PREFIX + " \u2013 Verrijkingsopgaven", path.join(BASE_DIR, "verrijkingsopgaven", PREFIX + " \u2013 verrijking \u2013 vragen.docx"));
  await buildDoc(buildVerrijking(true), PREFIX + " \u2013 Verrijkingsopgaven", path.join(BASE_DIR, "verrijkingsopgaven", PREFIX + " \u2013 verrijking \u2013 antwoorden.docx"));
  console.log("\nDone! All 6 files created.");
})();
