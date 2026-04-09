/**
 * PPTX: 1.1.1 Kiezen is kostbaar - presentatie
 * Intro economics: schaarste, behoeften, middelen, alternatieve kosten, nettobaten.
 * 12 slides with 3 SVG graphs.
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-111-presentatie.js
 */
process.env.NODE_PATH = "C:/Users/meije/AppData/Roaming/npm/node_modules";
require("module").Module._initPaths();

const PptxGenJS = require("pptxgenjs");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { saveSvgFiles } = require("./lib-svg-save");

const C = {
  primary: "17A2B8", primaryDk: "117A8B", primaryLt: "E8F8FB",
  navy: "1E2761", white: "FFFFFF", dark: "2D3748", gray: "718096",
  cream: "F9F6F1", rowAlt: "F7FAFC", borderGray: "CBD5E0",
  amber: "E67E22", amberLt: "FEF5E7",
  green: "1E8449", greenLt: "E8F8F0",
  red: "D9534F",
};

const DOMAIN = { color: C.primary, light: C.primaryLt, dark: C.primaryDk };

const GC = {
  axis: "#2D3748", grid: "#CBD5E0", label: "#718096",
  title: "#1E2761", bg: "#F7FAFC",
  teal: "#17A2B8", tealDk: "#117A8B",
  amber: "#E67E22", green: "#1E8449", red: "#D9534F",
};

const makeShadow = () => ({
  type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.10,
});

async function svgToPng(svgStr, width = 720) {
  return sharp(Buffer.from(svgStr)).resize(width).png().toBuffer();
}
function pngToBase64(buf) {
  return "image/png;base64," + buf.toString("base64");
}

// GRAPH 1: Schaarste concept
function buildSchaarseSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect width="720" height="360" rx="8" fill="${GC.bg}"/>
  <text x="360" y="30" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">Schaarste: behoeften vs. middelen</text>
  <defs><marker id="arr" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="${GC.red}"/></marker></defs>
  <circle cx="200" cy="195" r="120" fill="${GC.amber}" fill-opacity="0.2" stroke="${GC.amber}" stroke-width="2"/>
  <text x="200" y="140" text-anchor="middle" font-size="16" font-weight="bold" fill="${GC.amber}">Behoeften</text>
  <text x="200" y="165" text-anchor="middle" font-size="12" fill="${GC.label}">onbeperkt</text>
  <text x="200" y="195" text-anchor="middle" font-size="11" fill="${GC.axis}">telefoon, vakantie,</text>
  <text x="200" y="210" text-anchor="middle" font-size="11" fill="${GC.axis}">eten, wonen, sport,</text>
  <text x="200" y="225" text-anchor="middle" font-size="11" fill="${GC.axis}">uitgaan, kleding...</text>
  <circle cx="520" cy="195" r="75" fill="${GC.teal}" fill-opacity="0.2" stroke="${GC.teal}" stroke-width="2"/>
  <text x="520" y="175" text-anchor="middle" font-size="16" font-weight="bold" fill="${GC.tealDk}">Middelen</text>
  <text x="520" y="195" text-anchor="middle" font-size="12" fill="${GC.label}">beperkt</text>
  <text x="520" y="215" text-anchor="middle" font-size="11" fill="${GC.axis}">geld, tijd, arbeid</text>
  <line x1="330" y1="195" x2="430" y2="195" stroke="${GC.red}" stroke-width="3" marker-end="url(#arr)"/>
  <text x="380" y="180" text-anchor="middle" font-size="13" font-weight="bold" fill="${GC.red}">SCHAARSTE</text>
  <text x="360" y="340" text-anchor="middle" font-size="13" fill="${GC.title}" font-weight="bold">Schaarste = behoeften > middelen \u2192 je moet kiezen</text>
</svg>`;
}

// GRAPH 2: Kosten-batenanalyse
function buildKBAsvg() {
  const px = 120, py = 55, pw = 520, ph = 230;
  const baseY = py + ph;
  const barW = 50, groupW = 180, maxVal = 100;
  const data = [
    { label: "Studeren", baten: 80, totKosten: 70 },
    { label: "Werken", baten: 60, totKosten: 85 },
    { label: "Gamen", baten: 40, totKosten: 80 },
  ];

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect width="720" height="360" rx="8" fill="${GC.bg}"/>
  <text x="360" y="30" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">Kosten-batenanalyse: drie opties vergeleken</text>
  <line x1="${px}" y1="${baseY}" x2="${px + pw}" y2="${baseY}" stroke="${GC.axis}" stroke-width="1.5"/>
  <text x="50" y="${py + ph/2}" transform="rotate(-90,50,${py + ph/2})" text-anchor="middle" font-size="11" fill="${GC.label}">Waarde (\u20AC)</text>`;

  for (let v = 0; v <= 100; v += 20) {
    const y = Math.round(baseY - (v / maxVal) * ph);
    svg += `<line x1="${px}" y1="${y}" x2="${px+pw}" y2="${y}" stroke="${GC.grid}" stroke-width="1"/>`;
    svg += `<text x="${px-8}" y="${y+4}" text-anchor="end" font-size="10" fill="${GC.label}">${v}</text>`;
  }

  svg += `<rect x="440" y="42" width="12" height="12" rx="2" fill="${GC.teal}"/><text x="456" y="53" font-size="10" fill="${GC.axis}">Baten</text>`;
  svg += `<rect x="510" y="42" width="12" height="12" rx="2" fill="${GC.amber}"/><text x="526" y="53" font-size="10" fill="${GC.axis}">Kosten (incl. AK)</text>`;

  data.forEach((d, i) => {
    const gx = px + 30 + i * groupW;
    const h1 = Math.round((d.baten / maxVal) * ph);
    const h2 = Math.round((d.totKosten / maxVal) * ph);
    svg += `<rect x="${gx}" y="${baseY-h1}" width="${barW}" height="${h1}" rx="3" fill="${GC.teal}"/>`;
    svg += `<text x="${gx+barW/2}" y="${baseY-h1-6}" text-anchor="middle" font-size="11" font-weight="bold" fill="${GC.tealDk}">\u20AC${d.baten}</text>`;
    svg += `<rect x="${gx+barW+10}" y="${baseY-h2}" width="${barW}" height="${h2}" rx="3" fill="${GC.amber}"/>`;
    svg += `<text x="${gx+barW+10+barW/2}" y="${baseY-h2-6}" text-anchor="middle" font-size="11" font-weight="bold" fill="${GC.amber}">\u20AC${d.totKosten}</text>`;
    svg += `<text x="${gx + barW + 5}" y="${baseY+18}" text-anchor="middle" font-size="12" font-weight="bold" fill="${GC.axis}">${d.label}</text>`;
  });

  svg += `<text x="360" y="348" text-anchor="middle" font-size="12" fill="${GC.title}" font-weight="bold">Nettobaten = Baten \u2212 Totale kosten (incl. alternatieve kosten)</text></svg>`;
  return svg;
}

// GRAPH 3: Productiefactoren
function buildProdFactorenSVG() {
  const factors = [
    { label: "Arbeid", sub: "mensen", x: 80, color: GC.teal },
    { label: "Natuur", sub: "grondstoffen", x: 250, color: GC.green },
    { label: "Kapitaal", sub: "machines", x: 420, color: GC.amber },
    { label: "Ondernemerschap", sub: "combineren", x: 590, color: GC.red },
  ];
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect width="720" height="360" rx="8" fill="${GC.bg}"/>
  <text x="360" y="30" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">De vier productiefactoren</text>
  <defs><marker id="arr2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="${GC.axis}"/></marker></defs>`;

  factors.forEach(f => {
    svg += `<rect x="${f.x-50}" y="70" width="100" height="70" rx="8" fill="${f.color}" fill-opacity="0.15" stroke="${f.color}" stroke-width="2"/>`;
    svg += `<text x="${f.x}" y="100" text-anchor="middle" font-size="13" font-weight="bold" fill="${f.color}">${f.label}</text>`;
    svg += `<text x="${f.x}" y="120" text-anchor="middle" font-size="11" fill="${GC.label}">${f.sub}</text>`;
    svg += `<line x1="${f.x}" y1="140" x2="${f.x}" y2="185" stroke="${f.color}" stroke-width="2" marker-end="url(#arr2)"/>`;
  });

  svg += `<rect x="160" y="190" width="400" height="60" rx="10" fill="${GC.teal}" fill-opacity="0.15" stroke="${GC.tealDk}" stroke-width="2"/>`;
  svg += `<text x="360" y="225" text-anchor="middle" font-size="16" font-weight="bold" fill="${GC.tealDk}">Productie van goederen en diensten</text>`;
  svg += `<line x1="360" y1="250" x2="360" y2="290" stroke="${GC.axis}" stroke-width="2" marker-end="url(#arr2)"/>`;
  svg += `<rect x="210" y="295" width="300" height="45" rx="8" fill="${GC.tealDk}" fill-opacity="0.9"/>`;
  svg += `<text x="360" y="323" text-anchor="middle" font-size="14" font-weight="bold" fill="white">Goederen en diensten voor consumenten</text>`;
  svg += `</svg>`;
  return svg;
}

// SLIDE HELPERS
function addTitleMaster(pres) {
  pres.defineSlideMaster({ title: "TITLE_DARK", background: { color: C.navy }, objects: [
    { rect: { x: 0, y: 0, w: 10, h: 0.06, fill: { color: DOMAIN.color } } },
    { rect: { x: 0, y: 5.15, w: 10, h: 0.475, fill: { color: "151D4A" } } },
  ] });
}
function addContentMaster(pres) {
  pres.defineSlideMaster({ title: "CONTENT", background: { color: C.white }, objects: [
    { rect: { x: 0, y: 0, w: 10, h: 0.75, fill: { color: DOMAIN.color } } },
  ] });
}
function addContentSlide(pres, title) {
  const slide = pres.addSlide({ masterName: "CONTENT" });
  slide.addText(title, { x: 0.5, y: 0, w: 9, h: 0.75, fontSize: 24, fontFace: "Arial", color: C.white, bold: true, valign: "middle" });
  return slide;
}

function drawCard(slide, x, y, w, h, accentColor, bgColor, title, titleColor, bodyParts, extra) {
  slide.addShape("rect", { x, y, w, h, fill: { color: bgColor }, rectRadius: 0.05, shadow: makeShadow() });
  slide.addShape("rect", { x, y, w: 0.06, h, fill: { color: accentColor } });
  slide.addText(title, { x: x+0.2, y: y+0.12, w: w-0.35, h: 0.38, fontSize: 18, fontFace: "Arial", color: titleColor, bold: true, valign: "top" });
  if (bodyParts && bodyParts.length > 0) {
    slide.addText(bodyParts, { x: x+0.2, y: y+0.52, w: w-0.35, h: h-0.65, fontSize: 14, fontFace: "Arial", color: C.dark, valign: "top", align: "left", lineSpacingMultiple: 1.15, ...(extra || {}) });
  }
}

function flowChain(slide, steps, x, startY, w, color) {
  const boxH = 0.45, gap = 0.18;
  steps.forEach((step, i) => {
    const y = startY + i * (boxH + gap);
    const isLast = i === steps.length - 1;
    slide.addShape("rect", { x, y, w, h: boxH, fill: { color: isLast ? color : C.cream }, rectRadius: 0.05, shadow: makeShadow(), line: { color, width: 1 } });
    slide.addText(step, { x, y, w, h: boxH, fontSize: 14, fontFace: "Arial", color: isLast ? C.white : C.dark, bold: true, align: "center", valign: "middle" });
    if (i < steps.length - 1) {
      slide.addText("\u2193", { x, y: y + boxH, w, h: gap, fontSize: 16, fontFace: "Arial", color, align: "center", valign: "middle", bold: true });
    }
  });
}

// BUILD
async function build() {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: "CUSTOM_10x5625", width: 10, height: 5.625 });
  pres.layout = "CUSTOM_10x5625";
  pres.author = "Economie VWO";
  pres.title = "1.1.1 Kiezen is kostbaar";

  addTitleMaster(pres);
  addContentMaster(pres);

  const svgEntries = [
    { name: "schaarste", svg: buildSchaarseSVG() },
    { name: "kba", svg: buildKBAsvg() },
    { name: "productiefactoren", svg: buildProdFactorenSVG() },
  ];
  const [g1Buf, g2Buf, g3Buf] = await Promise.all(
    svgEntries.map(e => svgToPng(e.svg))
  );
  const g1 = pngToBase64(g1Buf);
  const g2 = pngToBase64(g2Buf);
  const g3 = pngToBase64(g3Buf);

  // SLIDE 1: Title
  { const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Kiezen is kostbaar", { x: 0.7, y: 1.0, w: 8.6, h: 1.4, fontSize: 40, fontFace: "Arial", color: C.white, bold: true });
    s.addText("Schaarste, behoeften, middelen en alternatieve kosten", { x: 0.7, y: 2.4, w: 8.6, h: 0.6, fontSize: 22, fontFace: "Arial", color: C.gray });
    s.addText("Paragraaf 1.1.1  |  Economie VWO", { x: 0.7, y: 5.15, w: 8.6, h: 0.475, fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle" }); }

  // SLIDE 2: Leerdoelen
  { const s = addContentSlide(pres, "Wat ga je leren?");
    s.addText("Leerdoelen \u00a71.1.1", { x: 0.5, y: 1.0, w: 9, h: 0.4, fontSize: 20, fontFace: "Arial", color: DOMAIN.color, bold: true });
    s.addText(["Uitleggen wat schaarste is en waarom het de basis is van economie","Het verschil tussen behoeften en middelen beschrijven","Alternatieve kosten herkennen en benoemen bij een keuze","Een kosten-batenanalyse opstellen en nettobaten berekenen","De vier productiefactoren herkennen in een casus","Rationeel kiezen toepassen op alledaagse situaties"].map(b => ({ text: b, options: { fontSize: 15, fontFace: "Arial", color: C.dark, bullet: true, breakType: "none" } })), { x: 0.7, y: 1.5, w: 8.6, h: 3.6, valign: "top", lineSpacingMultiple: 1.45, paraSpaceAfter: 6 }); }

  // SLIDE 3: Schaarste concept
  { const s = addContentSlide(pres, "Schaarste: het kernprobleem");
    drawCard(s, 0.5, 1.1, 4.3, 3.5, C.primary, C.primaryLt, "Behoeften", C.primaryDk, [
      { text: "Onbeperkt \u2014 je wilt altijd meer\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Primair: eten, drinken, wonen\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Secundair: vakantie, telefoon\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Groeien mee met welvaart", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
    ]);
    drawCard(s, 5.2, 1.1, 4.3, 3.5, C.amber, C.amberLt, "Middelen", C.amber, [
      { text: "Beperkt \u2014 je kunt niet alles\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Geld: inkomen, spaargeld\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Tijd: 24 uur per dag\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Grondstoffen en arbeid", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
    ]); }

  // SLIDE 4: GRAPH - Schaarste
  { const s = addContentSlide(pres, "Schaarste in beeld");
    s.addImage({ data: g1, x: 0.75, y: 0.9, w: 8.5, h: 4.25 }); }

  // SLIDE 5: Kiezen = ruilen
  { const s = addContentSlide(pres, "Kiezen is ruilen");
    s.addText("Door schaarste moeten we kiezen", { x: 0.5, y: 1.0, w: 9, h: 0.4, fontSize: 20, fontFace: "Arial", color: DOMAIN.color, bold: true });
    flowChain(s, ["Schaarste (behoeften > middelen)", "Je moet kiezen", "Kiezen = het \u00e9\u00e9n doen, het ander laten", "Elke keuze heeft een prijs (trade-off)"], 2.5, 1.6, 5, C.primary); }

  // SLIDE 6: Alternatieve kosten
  { const s = addContentSlide(pres, "Alternatieve kosten");
    drawCard(s, 0.5, 1.1, 9, 1.5, C.amber, C.amberLt, "Definitie", C.amber, [
      { text: "Alternatieve kosten = ", options: { fontSize: 16, fontFace: "Arial", color: C.dark } },
      { text: "de waarde van het beste niet-gekozen alternatief", options: { fontSize: 16, fontFace: "Arial", color: C.amber, bold: true } },
    ]);
    drawCard(s, 0.5, 2.9, 4.3, 1.8, C.primary, C.cream, "Voorbeeld", C.primaryDk, [
      { text: "Je kiest studeren i.p.v. werken\n", options: { fontSize: 13, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Werkgever betaalt \u20AC10/uur\n", options: { fontSize: 13, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "AK van studeren = \u20AC10/uur", options: { fontSize: 13, fontFace: "Arial", color: C.dark, bullet: true } },
    ]);
    drawCard(s, 5.2, 2.9, 4.3, 1.8, C.red, "FDE8E8", "Let op!", C.red, [
      { text: "Niet alle gemiste opties tellen\n", options: { fontSize: 13, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Alleen het \u00e9\u00e9n-na-beste alternatief\n", options: { fontSize: 13, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "AK is niet altijd in geld uit te drukken", options: { fontSize: 13, fontFace: "Arial", color: C.dark, bullet: true } },
    ]); }

  // SLIDE 7: GRAPH - Kosten-batenanalyse
  { const s = addContentSlide(pres, "Kosten-batenanalyse in beeld");
    s.addImage({ data: g2, x: 0.75, y: 0.9, w: 8.5, h: 4.25 }); }

  // SLIDE 8: Nettobaten
  { const s = addContentSlide(pres, "Nettobaten berekenen");
    drawCard(s, 0.5, 1.1, 9, 1.3, C.green, C.greenLt, "Formule", C.green, [
      { text: "Nettobaten = Baten \u2212 Kosten (incl. alternatieve kosten)", options: { fontSize: 16, fontFace: "Consolas", color: C.dark } },
    ]);
    drawCard(s, 0.5, 2.7, 4.3, 2.0, C.green, C.cream, "Positief = voordelig", C.green, [
      { text: "Baten > kosten\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "De keuze levert meer op dan het kost\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Rationele keuze: optie met hoogste nettobaten", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
    ]);
    drawCard(s, 5.2, 2.7, 4.3, 2.0, C.red, "FDE8E8", "Negatief = nadelig", C.red, [
      { text: "Kosten > baten\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Je geeft meer op dan je krijgt\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Beter een ander alternatief kiezen", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
    ]); }

  // SLIDE 9: Productiefactoren
  { const s = addContentSlide(pres, "De vier productiefactoren");
    const factors = [
      { name: "Arbeid", color: C.primary, bg: C.primaryLt, sub: "De inzet van mensen\n(fysiek en mentaal)" },
      { name: "Natuur", color: C.green, bg: C.greenLt, sub: "Grondstoffen, land,\nwater, energie" },
      { name: "Kapitaal", color: C.amber, bg: C.amberLt, sub: "Machines, gebouwen,\ngereedschap (niet geld!)" },
      { name: "Ondernemerschap", color: C.red, bg: "FDE8E8", sub: "Combineert de andere\ndrie factoren" },
    ];
    const cardW = 2.1, gap = 0.2, startX = 0.5;
    factors.forEach((f, i) => {
      const x = startX + i * (cardW + gap);
      s.addShape("rect", { x, y: 1.1, w: cardW, h: 3.6, fill: { color: f.bg }, rectRadius: 0.05, shadow: makeShadow() });
      s.addShape("rect", { x, y: 1.1, w: cardW, h: 0.06, fill: { color: f.color } });
      s.addText(f.name, { x, y: 1.3, w: cardW, h: 0.6, fontSize: 14, fontFace: "Arial", color: f.color, bold: true, align: "center", valign: "middle" });
      s.addShape("line", { x: x+0.2, y: 2.0, w: cardW-0.4, h: 0, line: { color: C.borderGray, width: 0.5 } });
      s.addText(f.sub, { x: x+0.15, y: 2.1, w: cardW-0.3, h: 2.3, fontSize: 12, fontFace: "Arial", color: C.dark, valign: "top", align: "center", lineSpacingMultiple: 1.4 });
    }); }

  // SLIDE 10: GRAPH - Productiefactoren
  { const s = addContentSlide(pres, "Productiefactoren in beeld");
    s.addImage({ data: g3, x: 0.75, y: 0.9, w: 8.5, h: 4.25 }); }

  // SLIDE 11: Veelgemaakte fouten
  { const s = addContentSlide(pres, "Veelgemaakte fouten");
    const mistakes = [
      ["\u2718  \"Schaarste = armoede\"", "Onjuist! Schaarste geldt voor iedereen, ook rijke mensen."],
      ["\u2718  \"Kapitaal = geld\"", "Nee! Kapitaal = machines, gebouwen, gereedschap."],
      ["\u2718  \"Alternatieve kosten = alle kosten\"", "Nee! Alleen het \u00e9\u00e9n-na-beste alternatief telt."],
    ];
    mistakes.forEach((m, i) => {
      drawCard(s, 0.5, 1.1 + i * 1.4, 9, 1.2, C.red, "FDE8E8", m[0], C.red, [
        { text: m[1], options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      ]);
    }); }

  // SLIDE 12: Samenvatting
  { const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Samenvatting", { x: 0.7, y: 0.4, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Arial", color: C.white, bold: true });
    s.addText([
      "\u2610 Schaarste = behoeften > middelen",
      "\u2610 Kiezen = het \u00e9\u00e9n doen, het ander laten",
      "\u2610 Alternatieve kosten = waarde beste gemiste alternatief",
      "\u2610 Nettobaten = baten \u2212 kosten (incl. AK)",
      "\u2610 Vier productiefactoren: arbeid, natuur, kapitaal, ondernemerschap",
      "\u2610 Rationeel kiezen = optie met hoogste nettobaten",
    ].map(c => ({ text: c + "\n", options: { fontSize: 14, fontFace: "Arial", color: C.white } })), { x: 0.7, y: 1.3, w: 8.6, h: 4.0, valign: "top", lineSpacingMultiple: 1.45 }); }

  // Save
  const outDir = "C:/Projects/4veco/module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.1 Paragraaf 1 - Kiezen is kostbaar/2. Leren";
  const outFile = path.join(outDir, "1.1.1 Kiezen is kostbaar \u2013 presentatie.pptx");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  await pres.writeFile({ fileName: outFile });
  console.log("Saved:", outFile);
  saveSvgFiles(svgEntries, outDir);
  const stats = fs.statSync(outFile);
  console.log("Size:", (stats.size / 1024).toFixed(1), "KB, Slides: 12 (incl. 3 graphs)");
}

build().catch(err => { console.error("ERROR:", err); process.exit(1); });
