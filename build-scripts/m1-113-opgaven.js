// m1-113-opgaven.js - Opgavensets (basis, midden, verrijking) for 1.1.3 Toepassen
// Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-113-opgaven.js
var path = require("path");
var fs = require("fs");
var NODE_PATH = path.join(process.env.APPDATA, "npm", "node_modules");
process.env.NODE_PATH = NODE_PATH;
require("module").Module._initPaths();

var docx = require("docx");
var Document = docx.Document, Packer = docx.Packer, Paragraph = docx.Paragraph, TextRun = docx.TextRun, ImageRun = docx.ImageRun;
var Table = docx.Table, TableRow = docx.TableRow, TableCell = docx.TableCell;
var WidthType = docx.WidthType, AlignmentType = docx.AlignmentType, HeadingLevel = docx.HeadingLevel;
var BorderStyle = docx.BorderStyle, ShadingType = docx.ShadingType;
var Header = docx.Header, Footer = docx.Footer, PageNumber = docx.PageNumber, PageBreak = docx.PageBreak;

var BASE_DIR = "C:/Projects/4veco/module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.3 Paragraaf 3 - Toepassen/3. Oefenen";
var PREFIX = "1.1.3 Toepassen";
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

var ASSETS_DIR = path.resolve(BASE_DIR, '..', '_assets');
function embedAsset(filename, width, height) {
  var imgPath = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(imgPath)) return null;
  var buf = fs.readFileSync(imgPath);
  var ext = filename.split('.').pop();
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    alignment: AlignmentType.CENTER,
    children: [new ImageRun({
      data: buf, transformation: { width: width, height: height }, type: ext === 'jpg' ? 'jpg' : 'png',
      altText: { title: filename, description: 'asset:' + filename.replace(/\.[^.]+$/, ''), name: filename },
    })]
  });
}

// ====================================================================
// BASISOPGAVEN (10 vragen)
// ====================================================================
function buildBasis(ans) {
  var ch = [];
  ch.push.apply(ch, titleBlock("Toepassen", ans ? "Basisopgaven \u2014 Antwoorden" : "Basisopgaven"));
  ch.push(sp(200)); ch.push(instructionBox("Deze opgaven gaan over het toepassen van de kernbegrippen uit hoofdstuk 1: schaarste, opofferingskosten, budgetlijnen en arbeidsmarkt.")); ch.push(sp(400));
  ch.push(new Paragraph({ children: [new PageBreak()] }));

  // Opgave 1: Begrippen invullen
  ch.push(h2d("Opgave 1", CL.teal));
  ch.push(question("a", "Vul in: .......... betekent dat de beschikbare middelen beperkt zijn ten opzichte van de behoeften."));
  if (ans) ch.push(answerBox(["Schaarste"])); else ch.push.apply(ch, answerSpace(1));
  ch.push(sp(80));
  ch.push(question("b", "Vul in: De waarde van het beste alternatief dat je opgeeft bij een keuze, heet .........."));
  if (ans) ch.push(answerBox(["Opofferingskosten (of: alternatieve kosten)"])); else ch.push.apply(ch, answerSpace(1));
  ch.push(sp(80));
  ch.push(question("c", "Vul in: De formule voor de budgetvergelijking is: .........."));
  if (ans) ch.push(answerBox(["B = p\u2081 \u00B7 q\u2081 + p\u2082 \u00B7 q\u2082"])); else ch.push.apply(ch, answerSpace(1));
  ch.push(sp(200));

  // Opgave 2: Schaarste herkennen
  ch.push(h2d("Opgave 2", CL.teal));
  ch.push(p("Een student heeft per week 30 uur beschikbaar voor studie, sport en een bijbaan."));
  ch.push(question("a", "Leg uit waarom er sprake is van schaarste."));
  if (ans) ch.push(answerBox(["De student heeft beperkte tijd (30 uur) voor meerdere behoeften (studie, sport, bijbaan). De behoeften overtreffen het beschikbare middel (tijd), dus er moet gekozen worden."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(80));
  ch.push(question("b", "Noem het schaarse middel en de concurrerende behoeften."));
  if (ans) ch.push(answerBox(["Schaars middel: tijd (30 uur per week). Concurrerende behoeften: studie, sport en werken (bijbaan)."])); else ch.push.apply(ch, answerSpace(2));
  ch.push(sp(200));

  // Opgave 3: Opofferingskosten eenvoudig
  ch.push(h2d("Opgave 3", CL.teal));
  ch.push(p("Emma kan kiezen: 2 uur werken (\u20AC12/uur) of 2 uur studeren."));
  ch.push(question("a", "Wat zijn de opofferingskosten als Emma kiest voor studeren?"));
  if (ans) ch.push(answerBox(["Opofferingskosten = 2 \u00D7 \u20AC12 = \u20AC24. Emma mist \u20AC24 inkomen."])); else ch.push.apply(ch, answerSpace(2));
  ch.push(sp(80));
  ch.push(question("b", "Wat zijn de opofferingskosten als Emma kiest voor werken?"));
  if (ans) ch.push(answerBox(["Opofferingskosten = 2 uur studie (de kennis en voorbereiding die ze mist)."])); else ch.push.apply(ch, answerSpace(2));
  ch.push(sp(200));

  // Opgave 4: Budgetvergelijking
  ch.push(h2d("Opgave 4", CL.amber));
  ch.push(p("Budget = \u20AC90, p\u2081 = \u20AC6, p\u2082 = \u20AC15."));
  ch.push(question("a", "Stel de budgetvergelijking op."));
  if (ans) ch.push(answerBox(["6q\u2081 + 15q\u2082 = 90"])); else ch.push.apply(ch, answerSpace(2));
  ch.push(sp(80));
  ch.push(question("b", "Bereken de snijpunten met de assen."));
  if (ans) ch.push(answerBox(["q\u2081-as: 90/6 = 15, punt (15, 0). q\u2082-as: 90/15 = 6, punt (0, 6)."])); else ch.push.apply(ch, answerSpace(2));
  ch.push(sp(200));

  // Opgave 5: Punt op de lijn?
  ch.push(h2d("Opgave 5", CL.amber));
  ch.push(p("Budget = \u20AC100, p\u2081 = \u20AC10, p\u2082 = \u20AC25."));
  ch.push(question("a", "Ligt de combinatie q\u2081 = 5, q\u2082 = 2 op, onder of boven de budgetlijn?"));
  if (ans) ch.push(answerBox(["10 \u00D7 5 + 25 \u00D7 2 = 50 + 50 = 100 = B. Het punt ligt op de budgetlijn."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(80));
  ch.push(question("b", "Ligt de combinatie q\u2081 = 8, q\u2082 = 1 op, onder of boven de budgetlijn?"));
  if (ans) ch.push(answerBox(["10 \u00D7 8 + 25 \u00D7 1 = 80 + 25 = 105 > 100. Boven de budgetlijn: niet betaalbaar."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(200));

  // Opgave 6: Verschuiving herkennen
  ch.push(h2d("Opgave 6", CL.amber));
  ch.push(question("a", "Het budget stijgt van \u20AC100 naar \u20AC150. De prijzen blijven gelijk. Wat gebeurt er met de budgetlijn?"));
  if (ans) ch.push(answerBox(["De budgetlijn verschuift evenwijdig naar buiten. De helling verandert niet."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(80));
  ch.push(question("b", "De prijs van goed 2 daalt. Budget en p\u2081 blijven gelijk. Wat gebeurt er?"));
  if (ans) ch.push(answerBox(["De budgetlijn kantelt naar buiten rond het snijpunt op de q\u2081-as. Het snijpunt op de q\u2082-as verschuift naar buiten."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(200));

  // Opgave 7: Drieslag
  ch.push(h2d("Opgave 7", CL.amber));
  ch.push(p("\"De gemeente moet kiezen: investeren in een nieuwe sporthal of in extra leraren. Er is maar \u20AC5 miljoen beschikbaar.\""));
  ch.push(question("", "Pas het begrip schaarste toe op deze tekst. Gebruik de drieslag (begrip \u2192 definitie \u2192 toepassing)."));
  if (ans) ch.push(answerBox(["Begrip: Schaarste. Definitie: Middelen zijn beperkt ten opzichte van de behoeften. Toepassing: Het budget van \u20AC5 miljoen (middel) is niet voldoende voor zowel een sporthal als extra leraren (behoeften), dus de gemeente moet kiezen."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(200));

  // Opgave 8: Nettobaten
  ch.push(h2d("Opgave 8", CL.teal));
  ch.push(p("Een boer kan een veld gebruiken voor tarwe (opbrengst \u20AC8.000) of zonnepanelen (opbrengst \u20AC12.000). De kosten zijn in beide gevallen \u20AC5.000."));
  ch.push(question("a", "Bereken de nettobaten van tarwe en van zonnepanelen."));
  if (ans) ch.push(answerBox(["Tarwe: \u20AC8.000 \u2212 \u20AC5.000 = \u20AC3.000. Zonnepanelen: \u20AC12.000 \u2212 \u20AC5.000 = \u20AC7.000."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(80));
  ch.push(question("b", "Welke keuze is rationeel? Wat zijn de opofferingskosten?"));
  if (ans) ch.push(answerBox(["Zonnepanelen is rationeel (hoogste nettobaten: \u20AC7.000). Opofferingskosten = \u20AC8.000 (misgelopen tarwe-opbrengst) of \u20AC3.000 nettobaten tarwe."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(200));

  // Opgave 9: Opofferingskosten vrije tijd
  ch.push(h2d("Opgave 9", CL.teal));
  ch.push(question("", "Bereken de opofferingskosten van 3 uur vrije tijd als het uurloon \u20AC14 is."));
  if (ans) ch.push(answerBox(["3 \u00D7 \u20AC14 = \u20AC42. De opofferingskosten zijn \u20AC42 misgelopen inkomen."])); else ch.push.apply(ch, answerSpace(2));
  ch.push(sp(200));

  // Opgave 10: Helling
  ch.push(h2d("Opgave 10", CL.amber));
  ch.push(p("B = \u20AC120, p\u2081 = \u20AC8, p\u2082 = \u20AC20."));
  ch.push(question("", "Bereken de helling van de budgetlijn en leg uit wat deze betekent."));
  if (ans) ch.push(answerBox(["Helling = \u2212p\u2081/p\u2082 = \u22128/20 = \u22120,4. Dit betekent: voor elk extra goed 1 moet je 0,4 eenheid van goed 2 opgeven."])); else ch.push.apply(ch, answerSpace(4));

  return ch;
}

// ====================================================================
// MIDDENOPGAVEN (8 vragen)
// ====================================================================
function buildMidden(ans) {
  var ch = [];
  ch.push.apply(ch, titleBlock("Toepassen", ans ? "Middenopgaven \u2014 Antwoorden" : "Middenopgaven"));
  ch.push(sp(200)); ch.push(instructionBox("Deze opgaven vragen om toepassing en analyse met de begrippen uit hoofdstuk 1.")); ch.push(sp(400));
  ch.push(new Paragraph({ children: [new PageBreak()] }));

  // Opgave 1: Gecombineerde verschuiving
  ch.push(h2d("Opgave 1", CL.amber));
  ch.push(p("Een consument heeft een budget van \u20AC200. Goed 1 kost \u20AC10 en goed 2 kost \u20AC25. Het budget stijgt naar \u20AC250 en de prijs van goed 1 stijgt naar \u20AC12,50."));
  ch.push(question("a", "Bereken de snijpunten v\u00f3\u00f3r en na de veranderingen."));
  if (ans) { ch.push(answerBox(["V\u00f3\u00f3r: q\u2081 = 200/10 = 20, q\u2082 = 200/25 = 8.", "Na: q\u2081 = 250/12,50 = 20, q\u2082 = 250/25 = 10."])); var img1a = embedAsset('budgetlijn-gecombineerd.png', 450, 225); if (img1a) ch.push(img1a); } else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("b", "Beschrijf de verschuiving. Is het een zuivere kanteling of evenwijdige verschuiving?"));
  if (ans) ch.push(answerBox(["Het x-snijpunt is gelijk gebleven (20), het y-snijpunt steeg van 8 naar 10. De budgetstijging compenseert precies de prijsstijging van goed 1. De lijn verschuift alleen op de y-as naar buiten \u2014 dit is een bijzonder geval: het lijkt op een kanteling, maar het x-snijpunt verandert niet."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(200));

  // Opgave 2: Opofferingskosten in context
  ch.push(h2d("Opgave 2", CL.amber));
  ch.push(p("Lisa kan 8 uur per dag besteden aan werken (\u20AC16/uur), studeren of vrijwilligerswerk. Ze kiest voor 5 uur werken en 3 uur studeren."));
  ch.push(question("a", "Bereken Lisas daginkomen."));
  if (ans) ch.push(answerBox(["5 \u00D7 \u20AC16 = \u20AC80 per dag."])); else ch.push.apply(ch, answerSpace(2));
  ch.push(sp(80));
  ch.push(question("b", "Wat zijn de opofferingskosten van de 3 uur studeren, uitgedrukt in euro\u2019s?"));
  if (ans) ch.push(answerBox(["3 \u00D7 \u20AC16 = \u20AC48 misgelopen inkomen."])); else ch.push.apply(ch, answerSpace(2));
  ch.push(sp(80));
  ch.push(question("c", "Lisa overweegt 1 uur studeren te vervangen door vrijwilligerswerk. Wat zijn de opofferingskosten hiervan?"));
  if (ans) ch.push(answerBox(["De opofferingskosten zijn 1 uur studie (het beste alternatief dat ze opgeeft). In geld uitgedrukt: als ze had kunnen werken, was dat \u20AC16. Maar ze gebruikte die tijd al voor studeren, dus de opofferingskosten zijn de studiewaarde van dat uur."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(200));

  // Opgave 3: Arbeidsmarkt
  ch.push(h2d("Opgave 3", CL.green));
  ch.push(p("Nadia heeft 40 uur per week beschikbaar. Uurloon = \u20AC18. Het uurloon stijgt naar \u20AC22."));
  ch.push(question("a", "Bereken de oude en nieuwe snijpunten van de budgetlijn (vrije tijd vs. inkomen)."));
  if (ans) { ch.push(answerBox(["Oud: V-snijpunt = 40 uur (Y=0), Y-snijpunt = 40\u00D718 = \u20AC720 (V=0).", "Nieuw: V-snijpunt = 40 uur (onveranderd), Y-snijpunt = 40\u00D722 = \u20AC880."])); var img3a = embedAsset('arbeidsmarkt-vacatures.png', 450, 225); if (img3a) ch.push(img3a); } else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("b", "Met hoeveel procent zijn de opofferingskosten van vrije tijd gestegen?"));
  if (ans) ch.push(answerBox(["Oud: \u20AC18/uur. Nieuw: \u20AC22/uur. Stijging: (22\u221218)/18 \u00D7 100% = 22,2%."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(200));

  // Opgave 4: Drieslag op casus
  ch.push(h2d("Opgave 4", CL.amber));
  ch.push(p("\"Door de droogte is de oogst dit jaar 30% lager. Boeren moeten kiezen: minder gewassen telen of meer investeren in irrigatie.\""));
  ch.push(question("a", "Pas het begrip schaarste toe met de drieslag."));
  if (ans) ch.push(answerBox(["Begrip: Schaarste. Definitie: Middelen beperkt t.o.v. behoeften. Toepassing: Door de droogte is water schaars \u2014 de beschikbare hoeveelheid water (middel) is onvoldoende voor de gewenste oogst (behoefte). Boeren moeten kiezen."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(80));
  ch.push(question("b", "Pas het begrip opofferingskosten toe op de keuze van een boer die kiest voor irrigatie."));
  if (ans) ch.push(answerBox(["Begrip: Opofferingskosten. Definitie: Waarde van het beste gemiste alternatief. Toepassing: Als de boer investeert in irrigatie, zijn de opofferingskosten het geld dat niet besteed wordt aan andere investeringen (bijv. nieuwe machines of meer land)."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(200));

  // Opgave 5: Gecombineerde berekening
  ch.push(h2d("Opgave 5", CL.green));
  ch.push(p("B = \u20AC360, p\u2081 = \u20AC12, p\u2082 = \u20AC30. Het budget stijgt met 25% en p\u2081 stijgt naar \u20AC15."));
  ch.push(question("a", "Bereken de oude en nieuwe snijpunten."));
  if (ans) ch.push(answerBox(["Oud: q\u2081 = 360/12 = 30, q\u2082 = 360/30 = 12.", "Nieuw budget = 360 \u00D7 1,25 = \u20AC450. q\u2081 = 450/15 = 30, q\u2082 = 450/30 = 15."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("b", "Beschrijf het gecombineerde effect op de budgetlijn."));
  if (ans) { ch.push(answerBox(["Het x-snijpunt blijft 30 (budgetstijging compenseert prijsstijging p\u2081). Het y-snijpunt stijgt van 12 naar 15 (hogere koopkracht voor goed 2). De lijn kantelt naar buiten rond het x-snijpunt."])); var img5b = embedAsset('budgetlijn-gecombineerd.png', 450, 225); if (img5b) ch.push(img5b); } else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(200));

  // Opgave 6: Bronanalyse
  ch.push(h2d("Opgave 6", CL.green));
  ch.push(p("\"Het minimumloon is gestegen naar \u20AC14,06 per uur. Werkgevers waarschuwen dat dit tot minder banen kan leiden.\""));
  ch.push(question("a", "Leg uit met het begrip opofferingskosten waarom vrije tijd duurder wordt door de minimumloonverhoging."));
  if (ans) ch.push(answerBox(["De opofferingskosten van vrije tijd zijn gelijk aan het uurloon. Als het uurloon stijgt van bijv. \u20AC13,64 naar \u20AC14,06, stijgen de opofferingskosten van elk uur vrije tijd mee. Vrije tijd wordt 'duurder' in termen van misgelopen inkomen."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("b", "Gebruik het begrip budgetlijn om uit te leggen waarom werkgevers minder banen aanbieden bij een hoger minimumloon."));
  if (ans) ch.push(answerBox(["De budgetlijn van werkgevers toont de combinaties van arbeid en andere inputs. Een hoger minimumloon verhoogt de 'prijs' van arbeid (p\u2081 stijgt). De budgetlijn van werkgevers kantelt naar binnen: ze kunnen met hetzelfde budget minder arbeidsuren inkopen. Dit kan leiden tot minder banen."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(200));

  // Opgave 7: Nettobaten vergelijken
  ch.push(h2d("Opgave 7", CL.amber));
  ch.push(p("Een student kan kiezen: bijbaan A (\u20AC11/uur, 15 uur/week, reiskosten \u20AC20/week) of bijbaan B (\u20AC14/uur, 10 uur/week, reiskosten \u20AC5/week)."));
  ch.push(question("a", "Bereken het netto weekinkomen van beide bijbanen."));
  if (ans) ch.push(answerBox(["A: 15 \u00D7 \u20AC11 \u2212 \u20AC20 = \u20AC165 \u2212 \u20AC20 = \u20AC145.", "B: 10 \u00D7 \u20AC14 \u2212 \u20AC5 = \u20AC140 \u2212 \u20AC5 = \u20AC135."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(80));
  ch.push(question("b", "De student kiest bijbaan B vanwege meer vrije tijd. Wat zijn de opofferingskosten (netto)?"));
  if (ans) ch.push(answerBox(["Opofferingskosten = netto inkomen bijbaan A \u2212 netto inkomen bijbaan B = \u20AC145 \u2212 \u20AC135 = \u20AC10 per week. Maar de student wint 5 uur vrije tijd."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(200));

  // Opgave 8: Water en schaarste
  ch.push(h2d("Opgave 8", CL.green));
  ch.push(p("Een katoenen T-shirt kost 2.700 liter water, een polyester T-shirt 500 liter. Een fabrikant heeft 27.000 liter water beschikbaar."));
  ch.push(question("a", "Bereken hoeveel katoenen en hoeveel polyester T-shirts de fabrikant maximaal kan produceren."));
  if (ans) ch.push(answerBox(["Katoen: 27.000/2.700 = 10 stuks. Polyester: 27.000/500 = 54 stuks."])); else ch.push.apply(ch, answerSpace(3));
  ch.push(sp(80));
  ch.push(question("b", "Stel de budgetvergelijking op met water als budget."));
  if (ans) ch.push(answerBox(["2.700q\u2081 + 500q\u2082 = 27.000 (q\u2081 = katoenen T-shirts, q\u2082 = polyester T-shirts)."])); else ch.push.apply(ch, answerSpace(2));

  return ch;
}

// ====================================================================
// VERRIJKINGSOPGAVEN (6 vragen)
// ====================================================================
function buildVerrijking(ans) {
  var ch = [];
  ch.push.apply(ch, titleBlock("Toepassen", ans ? "Verrijkingsopgaven \u2014 Antwoorden" : "Verrijkingsopgaven"));
  ch.push(sp(200)); ch.push(instructionBox("Diepgaande analyse: waterbeleid, gecombineerde oorzaken en arbeidsmarkt.")); ch.push(sp(400));
  ch.push(new Paragraph({ children: [new PageBreak()] }));

  // Opgave 1: Waterbeleid
  ch.push(h2d("Opgave 1 \u2014 Waterbeleid en schaarste", CL.teal));
  ch.push(p("Een gemeente heeft 10 miljoen liter water per maand beschikbaar. Huishoudens verbruiken 4 miljoen liter, de landbouw 5 miljoen, en de industrie vraagt om 3 miljoen extra."));
  ch.push(question("a", "Leg uit waarom er sprake is van schaarste. Bereken het tekort."));
  if (ans) ch.push(answerBox(["Totale vraag: 4 + 5 + 3 = 12 miljoen liter. Aanbod: 10 miljoen. Tekort: 2 miljoen liter.", "Er is schaarste: de beschikbare hoeveelheid water (middel) is onvoldoende voor alle behoeften."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("b", "De gemeente kiest: huishoudens volledig bedienen (4 miljoen) en de rest verdelen. Wat zijn de opofferingskosten als de landbouw prioriteit krijgt (5 miljoen)?"));
  if (ans) ch.push(answerBox(["Na huishoudens: 10 \u2212 4 = 6 miljoen over. Landbouw krijgt 5 miljoen. Rest: 1 miljoen voor industrie.", "Opofferingskosten = 3 \u2212 1 = 2 miljoen liter industriewater dat niet geleverd wordt.", "Het beste gemiste alternatief (volledige industrielevering) wordt niet volledig gerealiseerd."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(200));

  // Opgave 2: Gecombineerde oorzaken
  ch.push(h2d("Opgave 2 \u2014 Gecombineerde prijseffecten", CL.amber));
  ch.push(p("Budget = \u20AC480. Prijs biologisch voedsel (goed 1) = \u20AC12, prijs regulier voedsel (goed 2) = \u20AC8. Door overheidsbeleid: biologisch wordt gesubsidieerd (prijs daalt naar \u20AC8) en het budget stijgt met \u20AC120 (voedselsubsidie)."));
  ch.push(question("a", "Bereken de snijpunten v\u00f3\u00f3r en na het beleid."));
  if (ans) { ch.push(answerBox(["V\u00f3\u00f3r: q\u2081 = 480/12 = 40, q\u2082 = 480/8 = 60.", "Na: B = 600, p\u2081 = 8, p\u2082 = 8. q\u2081 = 600/8 = 75, q\u2082 = 600/8 = 75."])); var imgV2a = embedAsset('budgetlijn-gecombineerd.png', 450, 225); if (imgV2a) ch.push(imgV2a); } else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(80));
  ch.push(question("b", "Beschrijf het gecombineerde effect. Hoe verandert de helling van de budgetlijn?"));
  if (ans) ch.push(answerBox(["Oude helling: \u221212/8 = \u22121,5. Nieuwe helling: \u22128/8 = \u22121.", "De lijn verschuift naar buiten (beide snijpunten groter) en wordt vlakker.", "Dit is een gecombineerd effect: zowel een evenwijdige verschuiving (hoger budget) als een kanteling (lagere prijs goed 1)."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(200));

  // Opgave 3: Arbeidsmarkt analyse
  ch.push(h2d("Opgave 3 \u2014 Arbeidsmarkt en twee banen", CL.green));
  ch.push(p("Daan werkt maximaal 30 uur per week. Bijles: \u20AC22/uur (max 12 uur). Supermarkt: \u20AC13/uur. Zijn uurloon bij bijles stijgt naar \u20AC25."));
  ch.push(question("a", "Bereken Daans maximale weekinkomen v\u00f3\u00f3r en na de loonverhoging."));
  if (ans) { ch.push(answerBox(["V\u00f3\u00f3r: 12\u00D722 + 18\u00D713 = 264 + 234 = \u20AC498.", "Na: 12\u00D725 + 18\u00D713 = 300 + 234 = \u20AC534."])); var imgV3a = embedAsset('arbeidsmarkt-vacatures.png', 450, 225); if (imgV3a) ch.push(imgV3a); } else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("b", "Bereken de opofferingskosten van het eerste en het dertiende uur vrije tijd (als Daan nu 30 uur werkt). Leg uit waarom ze verschillen."));
  if (ans) ch.push(answerBox(["Als Daan 30 uur werkt: 12 uur bijles + 18 uur supermarkt.", "Eerste uur vrije tijd: hij laat een supermarkt-uur vallen. Opofferingskosten = \u20AC13.", "Dertiende uur vrije tijd: alle 12 supermarkt-uren zijn al opgegeven, nu valt een bijles-uur weg. Opofferingskosten = \u20AC25.", "De opofferingskosten stijgen naarmate je meer vrije tijd neemt, omdat je eerst de goedkoopste uren opgeeft."])); else ch.push.apply(ch, answerSpace(6));
  ch.push(sp(200));

  // Opgave 4: Waterverbruik beleid
  ch.push(h2d("Opgave 4 \u2014 Beleid waterverbruik kleding", CL.teal));
  ch.push(p("De overheid wil het waterverbruik in de kledingindustrie verminderen. Ze overweegt:\n\u2022 Maatregel A: belasting op katoen (\u20AC2/T-shirt extra)\n\u2022 Maatregel B: subsidie op polyester (\u20AC3/T-shirt korting)"));
  ch.push(question("a", "Leg uit het effect van maatregel A op de budgetlijn (met katoenen T-shirts op de q\u2081-as)."));
  if (ans) ch.push(answerBox(["De prijs van katoenen T-shirts (p\u2081) stijgt met \u20AC2. Het snijpunt op de q\u2081-as verschuift naar links. Het snijpunt op de q\u2082-as blijft gelijk. De budgetlijn kantelt naar binnen rond het q\u2082-snijpunt."])); else ch.push.apply(ch, answerSpace(4));
  ch.push(sp(80));
  ch.push(question("b", "Vergelijk maatregelen A en B. Welke stimuleert sterker de overstap naar polyester?"));
  if (ans) ch.push(answerBox(["Maatregel A: katoen duurder \u2192 kanteling rond q\u2082-snijpunt, q\u2081-snijpunt naar links.", "Maatregel B: polyester goedkoper \u2192 kanteling rond q\u2081-snijpunt, q\u2082-snijpunt naar rechts.", "Beide stimuleren polyester. Maatregel B vergroot direct de koopkracht voor polyester (meer polyester betaalbaar). Maatregel A maakt katoen relatief duurder. Het effect hangt af van de verhouding: \u20AC3 subsidie op polyester is groter dan \u20AC2 belasting op katoen, dus maatregel B stuurt iets sterker."])); else ch.push.apply(ch, answerSpace(6));
  ch.push(sp(200));

  // Opgave 5: Gecombineerde analyse
  ch.push(h2d("Opgave 5 \u2014 Complexe budgetanalyse", CL.green));
  ch.push(p("Eva heeft \u20AC500 per maand voor sport (p\u2081 = \u20AC25/les) en eten buitenshuis (p\u2082 = \u20AC20/keer). Door inflatie stijgt p\u2082 naar \u20AC25, maar haar werkgever geeft haar \u20AC100 extra per maand."));
  ch.push(question("a", "Bereken de snijpunten v\u00f3\u00f3r en na de veranderingen."));
  if (ans) { ch.push(answerBox(["V\u00f3\u00f3r: q\u2081 = 500/25 = 20, q\u2082 = 500/20 = 25.", "Na: B = 600, p\u2081 = 25, p\u2082 = 25. q\u2081 = 600/25 = 24, q\u2082 = 600/25 = 24."])); var imgV5a = embedAsset('budgetlijn-gecombineerd.png', 450, 225); if (imgV5a) ch.push(imgV5a); } else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(80));
  ch.push(question("b", "Verandert de helling? Beschrijf het gecombineerde effect."));
  if (ans) ch.push(answerBox(["Oude helling: \u221225/20 = \u22121,25. Nieuwe helling: \u221225/25 = \u22121.", "De helling verandert: eten is relatief duurder geworden. De lijn verschuift naar buiten op de q\u2081-as (meer sport mogelijk) maar het q\u2082-snijpunt daalt van 25 naar 24 (net iets minder eten buitenshuis, ondanks hoger budget)."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(200));

  // Opgave 6: Arbeidsmarkt analyse met drieslag
  ch.push(h2d("Opgave 6 \u2014 Arbeidsmarkt analyse", CL.green));
  ch.push(p("\"Het aantal vacatures in de techniek is met 15% gestegen. Tegelijk steeg het startsalaris van technici met 8%. Toch daalde het aantal sollicitanten met 5%.\" \u2014 CBS, 2025"));
  ch.push(question("a", "Analyseer deze bron met het begrip schaarste. Gebruik de drieslag."));
  if (ans) ch.push(answerBox(["Begrip: Schaarste op de arbeidsmarkt.", "Definitie: Het aanbod van werknemers is beperkt ten opzichte van de vraag (vacatures).", "Toepassing: Er zijn 15% meer vacatures (vraag stijgt) terwijl het aantal sollicitanten daalt met 5% (aanbod daalt). De schaarste neemt toe."])); else ch.push.apply(ch, answerSpace(5));
  ch.push(sp(80));
  ch.push(question("b", "Leg uit waarom werkgevers het startsalaris verhogen. Gebruik het begrip budgetlijn en opofferingskosten."));
  if (ans) ch.push(answerBox(["Door de schaarste concurreren werkgevers om werknemers. Ze verhogen het salaris om technici te trekken.", "Voor werknemers stijgen de opofferingskosten van vrije tijd (hoger uurloon = duurder om niet te werken).", "De budgetlijn van werknemers kantelt omhoog: bij hetzelfde aantal werkuren verdienen ze meer.", "Voor werkgevers verschuift hun budgetlijn naar binnen: hogere lonen = minder arbeid betaalbaar bij gelijk budget."])); else ch.push.apply(ch, answerSpace(6));

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
  console.log("Building opgavensets for 1.1.3 Toepassen...\n");
  await buildDoc(buildBasis(false), PREFIX + " \u2013 Basisopgaven", path.join(BASE_DIR, "basisopgaven", PREFIX + " \u2013 basis \u2013 vragen.docx"));
  await buildDoc(buildBasis(true), PREFIX + " \u2013 Basisopgaven", path.join(BASE_DIR, "basisopgaven", PREFIX + " \u2013 basis \u2013 antwoorden.docx"));
  await buildDoc(buildMidden(false), PREFIX + " \u2013 Middenopgaven", path.join(BASE_DIR, "middenopgaven", PREFIX + " \u2013 midden \u2013 vragen.docx"));
  await buildDoc(buildMidden(true), PREFIX + " \u2013 Middenopgaven", path.join(BASE_DIR, "middenopgaven", PREFIX + " \u2013 midden \u2013 antwoorden.docx"));
  await buildDoc(buildVerrijking(false), PREFIX + " \u2013 Verrijkingsopgaven", path.join(BASE_DIR, "verrijkingsopgaven", PREFIX + " \u2013 verrijking \u2013 vragen.docx"));
  await buildDoc(buildVerrijking(true), PREFIX + " \u2013 Verrijkingsopgaven", path.join(BASE_DIR, "verrijkingsopgaven", PREFIX + " \u2013 verrijking \u2013 antwoorden.docx"));
  console.log("\nDone! All 6 files created.");
})();
