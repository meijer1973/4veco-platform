/**
 * PPTX: 1.1.3 Toepassen - presentatie
 * Alles komt samen: schaarste, opofferingskosten, budgetlijnen, arbeidsmarkt.
 * 8 slides with 4 SVG graphs.
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-113-presentatie.js
 */
process.env.NODE_PATH = "C:/Users/meije/AppData/Roaming/npm/node_modules";
require("module").Module._initPaths();

const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const { svgToPng, pngToBase64, GRAPH_COLORS } = require("./lib-svg-utils");

// Check for pre-built PNGs in _assets/
const ASSETS_DIR = path.join(__dirname, "_assets");
async function loadOrRender(assetName, svgBuilder) {
  const assetPath = path.join(ASSETS_DIR, assetName);
  if (fs.existsSync(assetPath)) {
    console.log("  Using pre-built asset:", assetName);
    return fs.readFileSync(assetPath);
  }
  return svgToPng(svgBuilder());
}

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
  teal: "#17A2B8", tealDk: "#0E6B7A",
  amber: "#E67E22", green: "#1E8449", red: "#D9534F",
};

const makeShadow = () => ({
  type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.10,
});

// ═══════════════════════════════════════════════════════════════════════════
// SVG GRAPH BUILDERS
// ═══════════════════════════════════════════════════════════════════════════

const PX = 80, PY = 45, PW = 600, PH = 265;
const PX2 = PX + PW, PY2 = PY + PH;

function svgHead() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect width="720" height="360" rx="8" fill="${GC.bg}"/>`;
}

function axisLines() {
  return `<line x1="${PX}" y1="${PY}" x2="${PX}" y2="${PY2}" stroke="${GC.axis}" stroke-width="1.5"/>
  <line x1="${PX}" y1="${PY2}" x2="${PX2}" y2="${PY2}" stroke="${GC.axis}" stroke-width="1.5"/>`;
}

function mapX(val, maxVal) { return PX + (val / maxVal) * PW; }
function mapY(val, maxVal) { return PY2 - (val / maxVal) * PH; }

function gridLines(xMax, xStep, yMax, yStep) {
  let svg = "";
  for (let v = yStep; v <= yMax; v += yStep) {
    const y = Math.round(mapY(v, yMax));
    svg += `<line x1="${PX}" y1="${y}" x2="${PX2}" y2="${y}" stroke="${GC.grid}" stroke-width="0.5" stroke-dasharray="4,3"/>`;
    svg += `<text x="${PX - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="${GC.label}">${v}</text>`;
  }
  for (let v = xStep; v <= xMax; v += xStep) {
    const x = Math.round(mapX(v, xMax));
    svg += `<line x1="${x}" y1="${PY}" x2="${x}" y2="${PY2}" stroke="${GC.grid}" stroke-width="0.5" stroke-dasharray="4,3"/>`;
    svg += `<text x="${x}" y="${PY2 + 16}" text-anchor="middle" font-size="10" fill="${GC.label}">${v}</text>`;
  }
  return svg;
}

// GRAPH 1: Schaarste samenhang (conceptual flowchart as SVG)
function buildSchaarteSamenhangSVG() {
  return `${svgHead()}
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Samenhang: schaarste, keuze en opofferingskosten</text>
  <!-- Boxes -->
  <rect x="250" y="50" width="220" height="45" rx="8" fill="${GC.teal}" fill-opacity="0.15" stroke="${GC.teal}" stroke-width="2"/>
  <text x="360" y="78" text-anchor="middle" font-size="13" font-weight="bold" fill="${GC.tealDk}">Schaarste</text>
  <rect x="100" y="130" width="200" height="45" rx="8" fill="${GC.amber}" fill-opacity="0.15" stroke="${GC.amber}" stroke-width="2"/>
  <text x="200" y="158" text-anchor="middle" font-size="13" font-weight="bold" fill="${GC.amber}">Keuze maken</text>
  <rect x="420" y="130" width="200" height="45" rx="8" fill="${GC.amber}" fill-opacity="0.15" stroke="${GC.amber}" stroke-width="2"/>
  <text x="520" y="158" text-anchor="middle" font-size="13" font-weight="bold" fill="${GC.amber}">Opofferingskosten</text>
  <rect x="100" y="220" width="200" height="45" rx="8" fill="${GC.green}" fill-opacity="0.15" stroke="${GC.green}" stroke-width="2"/>
  <text x="200" y="248" text-anchor="middle" font-size="13" font-weight="bold" fill="${GC.green}">Budgetlijn</text>
  <rect x="420" y="220" width="200" height="45" rx="8" fill="${GC.green}" fill-opacity="0.15" stroke="${GC.green}" stroke-width="2"/>
  <text x="520" y="248" text-anchor="middle" font-size="13" font-weight="bold" fill="${GC.green}">Arbeidsmarkt</text>
  <!-- Arrows -->
  <defs><marker id="arr" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="${GC.axis}"/></marker></defs>
  <line x1="310" y1="95" x2="230" y2="128" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="410" y1="95" x2="490" y2="128" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="200" y1="175" x2="200" y2="218" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="520" y1="175" x2="520" y2="218" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="300" y1="242" x2="418" y2="242" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#arr)"/>
  <!-- Caption -->
  <text x="360" y="300" text-anchor="middle" font-size="12" fill="${GC.label}">Middelen beperkt \u2192 keuzes nodig \u2192 elke keuze heeft opofferingskosten</text>
  <text x="360" y="320" text-anchor="middle" font-size="11" fill="${GC.label}">Budgetlijn toont haalbare combinaties | Arbeidsmarkt: vrije tijd vs. inkomen</text>
</svg>`;
}

// GRAPH 2: Gecombineerde budgetverschuiving (B stijgt + p1 stijgt)
function buildGecombineerdeSVG() {
  const xMax = 30, yMax = 12;
  // Old: B=200, p1=10, p2=20 => q1max=20, q2max=10
  // New: B=240, p1=15, p2=20 => q1max=16, q2max=12
  return `${svgHead()}
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Gecombineerde verschuiving: B stijgt + p\u2081 stijgt</text>
  <defs><marker id="arr2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="${GC.red}"/></marker></defs>
  ${axisLines()}
  ${gridLines(xMax, 5, yMax, 2)}
  <text x="${PX + PW/2}" y="${PY2 + 32}" text-anchor="middle" font-size="12" fill="${GC.axis}">Goed 1 (q\u2081)</text>
  <text x="20" y="${PY + PH/2}" text-anchor="middle" font-size="12" fill="${GC.axis}" transform="rotate(-90,20,${PY + PH/2})">Goed 2 (q\u2082)</text>
  <!-- Old line (dashed) B=200 p1=10 p2=20 -->
  <line x1="${Math.round(mapX(0, xMax))}" y1="${Math.round(mapY(10, yMax))}" x2="${Math.round(mapX(20, xMax))}" y2="${Math.round(mapY(0, yMax))}" stroke="${GC.teal}" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="${Math.round(mapX(20, xMax)) + 5}" y="${Math.round(mapY(0, yMax)) - 10}" font-size="10" fill="${GC.teal}">Oud: B=200, p\u2081=10</text>
  <!-- New line (solid) B=240 p1=15 p2=20 -->
  <line x1="${Math.round(mapX(0, xMax))}" y1="${Math.round(mapY(12, yMax))}" x2="${Math.round(mapX(16, xMax))}" y2="${Math.round(mapY(0, yMax))}" stroke="${GC.tealDk}" stroke-width="2.5"/>
  <text x="${Math.round(mapX(16, xMax)) + 5}" y="${Math.round(mapY(0, yMax)) - 10}" font-size="10" font-weight="bold" fill="${GC.tealDk}">Nieuw: B=240, p\u2081=15</text>
  <!-- Intercept dots -->
  <circle cx="${Math.round(mapX(0, xMax))}" cy="${Math.round(mapY(10, yMax))}" r="3.5" fill="${GC.teal}"/>
  <circle cx="${Math.round(mapX(20, xMax))}" cy="${Math.round(mapY(0, yMax))}" r="3.5" fill="${GC.teal}"/>
  <circle cx="${Math.round(mapX(0, xMax))}" cy="${Math.round(mapY(12, yMax))}" r="4" fill="${GC.tealDk}"/>
  <circle cx="${Math.round(mapX(16, xMax))}" cy="${Math.round(mapY(0, yMax))}" r="4" fill="${GC.tealDk}"/>
  <!-- Annotations -->
  <text x="${Math.round(mapX(0, xMax)) + 8}" y="${Math.round(mapY(10, yMax)) + 4}" font-size="10" fill="${GC.teal}">(0, 10)</text>
  <text x="${Math.round(mapX(0, xMax)) + 8}" y="${Math.round(mapY(12, yMax)) + 4}" font-size="10" font-weight="bold" fill="${GC.tealDk}">(0, 12)</text>
  <text x="${Math.round(mapX(20, xMax))}" y="${Math.round(mapY(0, yMax)) + 16}" text-anchor="middle" font-size="10" fill="${GC.teal}">(20, 0)</text>
  <text x="${Math.round(mapX(16, xMax))}" y="${Math.round(mapY(0, yMax)) + 16}" text-anchor="middle" font-size="10" font-weight="bold" fill="${GC.tealDk}">(16, 0)</text>
  <!-- Arrow explanation -->
  <text x="${Math.round(mapX(22, xMax))}" y="${Math.round(mapY(8, yMax))}" font-size="11" fill="${GC.red}" font-weight="bold">y-snijpunt \u2191</text>
  <text x="${Math.round(mapX(22, xMax))}" y="${Math.round(mapY(7, yMax))}" font-size="11" fill="${GC.red}" font-weight="bold">x-snijpunt \u2193</text>
  <text x="${Math.round(mapX(22, xMax))}" y="${Math.round(mapY(6, yMax))}" font-size="10" fill="${GC.red}">Niet evenwijdig,</text>
  <text x="${Math.round(mapX(22, xMax))}" y="${Math.round(mapY(5.2, yMax))}" font-size="10" fill="${GC.red}">niet zuiver kantelen</text>
</svg>`;
}

// GRAPH 3: Arbeidsmarkt vrije-tijd vs. inkomen (two wages)
function buildArbeidsmarktSVG() {
  const xMax = 24, yMax = 350;
  return `${svgHead()}
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Arbeidsmarkt: vrije tijd vs. daginkomen</text>
  ${axisLines()}
  ${gridLines(xMax, 4, yMax, 50)}
  <text x="${PX + PW/2}" y="${PY2 + 32}" text-anchor="middle" font-size="12" fill="${GC.axis}">Vrije tijd (uren per dag)</text>
  <text x="20" y="${PY + PH/2}" text-anchor="middle" font-size="12" fill="${GC.axis}" transform="rotate(-90,20,${PY + PH/2})">Daginkomen (\u20AC)</text>
  <!-- Wage 12 line -->
  <line x1="${Math.round(mapX(0, xMax))}" y1="${Math.round(mapY(288, yMax))}" x2="${Math.round(mapX(24, xMax))}" y2="${Math.round(mapY(0, yMax))}" stroke="${GC.teal}" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="${Math.round(mapX(1, xMax))}" y="${Math.round(mapY(288, yMax)) - 8}" font-size="10" fill="${GC.teal}">Loon = \u20AC12/uur (\u20AC288/dag)</text>
  <!-- Wage 15 line -->
  <line x1="${Math.round(mapX(0, xMax))}" y1="${Math.round(mapY(340, yMax))}" x2="${Math.round(mapX(24, xMax))}" y2="${Math.round(mapY(0, yMax))}" stroke="${GC.tealDk}" stroke-width="2.5"/>
  <text x="${Math.round(mapX(1, xMax))}" y="${Math.round(mapY(340, yMax)) - 8}" font-size="10" font-weight="bold" fill="${GC.tealDk}">Loon = \u20AC15/uur (\u20AC360\u2192max)</text>
  <!-- Mark 8 uur werken = 16 uur vrije tijd -->
  <circle cx="${Math.round(mapX(16, xMax))}" cy="${Math.round(mapY(96, yMax))}" r="4" fill="${GC.amber}" stroke="${GC.axis}" stroke-width="1"/>
  <line x1="${Math.round(mapX(16, xMax))}" y1="${Math.round(mapY(96, yMax))}" x2="${Math.round(mapX(16, xMax))}" y2="${Math.round(mapY(0, yMax))}" stroke="${GC.amber}" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="${Math.round(mapX(16, xMax)) + 8}" y="${Math.round(mapY(96, yMax)) - 6}" font-size="10" font-weight="bold" fill="${GC.amber}">8u werken: \u20AC96</text>
  <circle cx="${Math.round(mapX(16, xMax))}" cy="${Math.round(mapY(120, yMax))}" r="4" fill="${GC.green}" stroke="${GC.axis}" stroke-width="1"/>
  <text x="${Math.round(mapX(16, xMax)) + 8}" y="${Math.round(mapY(120, yMax)) + 4}" font-size="10" fill="${GC.green}">8u werken: \u20AC120</text>
  <!-- Pivot -->
  <circle cx="${Math.round(mapX(24, xMax))}" cy="${Math.round(mapY(0, yMax))}" r="3.5" fill="${GC.axis}"/>
  <!-- Annotation -->
  <text x="360" y="350" text-anchor="middle" font-size="11" fill="${GC.title}" font-weight="bold">Opofferingskosten vrije tijd = uurloon | Hoger loon \u2192 vrije tijd duurder</text>
</svg>`;
}

// GRAPH 4: Waterverbruik vergelijking (bar chart)
function buildWaterverbruikSVG() {
  const bars = [
    { label: "1 T-shirt\nkatoen", value: 2700, color: GC.teal },
    { label: "1 T-shirt\npolyester", value: 500, color: GC.amber },
    { label: "1 spijker-\nbroek", value: 7500, color: GC.red },
    { label: "1 dag\ndrinkwater", value: 120, color: GC.green },
  ];
  const maxVal = 8000;
  const barW = 100, gap = 50, startX = 140;
  let svg = `${svgHead()}
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Waterverbruik: kleding vs. dagelijks gebruik (liter)</text>
  ${axisLines()}`;
  // Y-axis labels
  for (let v = 0; v <= maxVal; v += 1000) {
    const y = Math.round(PY2 - (v / maxVal) * PH);
    svg += `<line x1="${PX}" y1="${y}" x2="${PX2}" y2="${y}" stroke="${GC.grid}" stroke-width="0.5" stroke-dasharray="4,3"/>`;
    svg += `<text x="${PX - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="${GC.label}">${v}</text>`;
  }
  svg += `<text x="20" y="${PY + PH/2}" text-anchor="middle" font-size="12" fill="${GC.axis}" transform="rotate(-90,20,${PY + PH/2})">Liter water</text>`;
  bars.forEach((b, i) => {
    const x = startX + i * (barW + gap);
    const barH = (b.value / maxVal) * PH;
    const y = PY2 - barH;
    svg += `<rect x="${x}" y="${Math.round(y)}" width="${barW}" height="${Math.round(barH)}" rx="4" fill="${b.color}" fill-opacity="0.8"/>`;
    svg += `<text x="${x + barW/2}" y="${Math.round(y) - 6}" text-anchor="middle" font-size="11" font-weight="bold" fill="${b.color}">${b.value.toLocaleString('nl-NL')}</text>`;
    const lines = b.label.split('\n');
    lines.forEach((line, li) => {
      svg += `<text x="${x + barW/2}" y="${PY2 + 16 + li * 14}" text-anchor="middle" font-size="10" fill="${GC.label}">${line}</text>`;
    });
  });
  svg += `<text x="360" y="350" text-anchor="middle" font-size="11" fill="${GC.title}" font-weight="bold">Fast fashion verbruikt enorm veel water \u2014 een schaars goed</text>`;
  svg += `</svg>`;
  return svg;
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE HELPERS
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// BUILD
// ═══════════════════════════════════════════════════════════════════════════

async function build() {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: "CUSTOM_10x5625", width: 10, height: 5.625 });
  pres.layout = "CUSTOM_10x5625";
  pres.author = "Economie VWO";
  pres.title = "1.1.3 Toepassen";

  addTitleMaster(pres);
  addContentMaster(pres);

  // Render all graphs (use pre-built PNGs if available)
  const [g1Buf, g2Buf, g3Buf, g4Buf] = await Promise.all([
    loadOrRender("m1-113-schaarste-samenhang.png", buildSchaarteSamenhangSVG),
    loadOrRender("m1-113-gecombineerde-verschuiving.png", buildGecombineerdeSVG),
    loadOrRender("m1-113-arbeidsmarkt.png", buildArbeidsmarktSVG),
    loadOrRender("m1-113-waterverbruik.png", buildWaterverbruikSVG),
  ]);
  const g1 = pngToBase64(g1Buf);
  const g2 = pngToBase64(g2Buf);
  const g3 = pngToBase64(g3Buf);
  const g4 = pngToBase64(g4Buf);

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 1: Title (dark navy)
  // ─────────────────────────────────────────────────────────────────────
  { const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Toepassen", { x: 0.7, y: 1.0, w: 8.6, h: 1.4, fontSize: 40, fontFace: "Arial", color: C.white, bold: true });
    s.addText("Alles komt samen", { x: 0.7, y: 2.4, w: 8.6, h: 0.6, fontSize: 22, fontFace: "Arial", color: C.gray });
    s.addText("Paragraaf 1.1.3  |  Economie VWO", { x: 0.7, y: 5.15, w: 8.6, h: 0.475, fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle" }); }

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 2: Samenhang kernbegrippen
  // ─────────────────────────────────────────────────────────────────────
  { const s = addContentSlide(pres, "Samenhang kernbegrippen");
    s.addImage({ data: g1, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("Overzicht hoe de kernbegrippen van hoofdstuk 1 samenhangen: schaarste leidt tot keuzes, keuzes hebben opofferingskosten, budgetlijnen tonen de haalbare combinaties, en op de arbeidsmarkt geldt dezelfde logica voor werken vs. vrije tijd."); }

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 3: Schaarste herkennen
  // ─────────────────────────────────────────────────────────────────────
  { const s = addContentSlide(pres, "Schaarste herkennen in context");
    drawCard(s, 0.5, 1.1, 4.3, 2.0, C.primary, C.primaryLt, "Stappenplan", C.primaryDk, [
      { text: "1. Identificeer het schaarse middel\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "2. Benoem concurrerende behoeften\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "3. Leg uit waarom er gekozen moet worden", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(s, 5.2, 1.1, 4.3, 2.0, C.amber, C.amberLt, "Voorbeeld", C.amber, [
      { text: "Water is schaars in droge gebieden.\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Middel: water | Behoeften: landbouw,\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "drinkwater, industrie, textiel.\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Keuze: verdeling over toepassingen.", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(s, 0.5, 3.4, 9, 1.3, C.green, C.greenLt, "Signaalwoorden", C.green, [
      { text: "beperkt | niet genoeg | tekort | moet kiezen | verdelen | schaars | concurrerend", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    s.addNotes("In het examen moet je schaarste kunnen herkennen. Let op: schaarste is niet hetzelfde als zeldzaamheid. Het gaat om de verhouding middelen vs. behoeften."); }

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 4: Opofferingskosten in de praktijk
  // ─────────────────────────────────────────────────────────────────────
  { const s = addContentSlide(pres, "Opofferingskosten in de praktijk");
    drawCard(s, 0.5, 1.1, 9, 1.6, C.primary, C.primaryLt, "Drieslag", C.primaryDk, [
      { text: "1. Welke keuze wordt gemaakt?\n", options: { fontSize: 15, fontFace: "Arial", color: C.dark } },
      { text: "2. Wat is het beste alternatief?\n", options: { fontSize: 15, fontFace: "Arial", color: C.dark } },
      { text: "3. Opofferingskosten = waarde van dat beste alternatief", options: { fontSize: 15, fontFace: "Arial", color: C.dark, bold: true } },
    ]);
    drawCard(s, 0.5, 3.0, 4.3, 1.8, C.amber, C.amberLt, "Voorbeeld 1: Tijd", C.amber, [
      { text: "Sophie werkt 3 uur i.p.v. vrije tijd.\n", options: { fontSize: 13, fontFace: "Arial", color: C.dark } },
      { text: "Uurloon = \u20AC15.\n", options: { fontSize: 13, fontFace: "Arial", color: C.dark } },
      { text: "Opofferingskosten vrije tijd = \u20AC45", options: { fontSize: 13, fontFace: "Arial", color: C.dark, bold: true } },
    ]);
    drawCard(s, 5.2, 3.0, 4.3, 1.8, C.green, C.greenLt, "Voorbeeld 2: Geld", C.green, [
      { text: "Met \u20AC200: laptop OF fiets + kleding.\n", options: { fontSize: 13, fontFace: "Arial", color: C.dark } },
      { text: "Keuze: laptop.\n", options: { fontSize: 13, fontFace: "Arial", color: C.dark } },
      { text: "Opofferingskosten = fiets + kleding", options: { fontSize: 13, fontFace: "Arial", color: C.dark, bold: true } },
    ]);
    s.addNotes("Opofferingskosten = alleen het BESTE gemiste alternatief. Niet alle alternatieven optellen!"); }

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 5: GRAPH - Gecombineerde verschuiving
  // ─────────────────────────────────────────────────────────────────────
  { const s = addContentSlide(pres, "Gecombineerde budgetverschuiving");
    s.addImage({ data: g2, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("Als zowel het budget als een prijs verandert, krijg je een gecombineerde verschuiving. Dit is geen zuivere evenwijdige verschuiving en geen zuivere kanteling. Bereken beide nieuwe snijpunten en teken de nieuwe lijn."); }

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 6: GRAPH - Arbeidsmarkt
  // ─────────────────────────────────────────────────────────────────────
  { const s = addContentSlide(pres, "Arbeidsmarkt: werken vs. vrije tijd");
    s.addImage({ data: g3, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("De keuze tussen werken en vrije tijd is een budgetlijnvraagstuk. X-as = vrije tijd, Y-as = inkomen. Opofferingskosten van 1 uur vrije tijd = uurloon. Bij loonverhoging kantelt de lijn omhoog en wordt vrije tijd duurder."); }

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 7: GRAPH - Waterverbruik
  // ─────────────────────────────────────────────────────────────────────
  { const s = addContentSlide(pres, "Schaarste in de praktijk: water en kleding");
    s.addImage({ data: g4, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("Fast fashion verbruikt enorm veel water. Een katoenen T-shirt kost 2.700 liter, een spijkerbroek 7.500 liter. Water is schaars - er moet gekozen worden: kleding, landbouw, drinkwater?"); }

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 8: Samenvatting
  // ─────────────────────────────────────────────────────────────────────
  { const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Samenvatting", { x: 0.7, y: 0.4, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Arial", color: C.white, bold: true });
    s.addText([
      "\u2610 Schaarste: middelen beperkt \u2192 keuzes nodig",
      "\u2610 Opofferingskosten: waarde beste gemiste alternatief",
      "\u2610 Budgetlijn: alle haalbare combinaties bij een budget",
      "\u2610 Gecombineerde verschuiving: budget \u00e9n prijs veranderen",
      "\u2610 Arbeidsmarkt: opofferingskosten vrije tijd = uurloon",
      "\u2610 Drieslag: begrip \u2192 definitie \u2192 toepassing op casus",
    ].map(c => ({ text: c + "\n", options: { fontSize: 14, fontFace: "Arial", color: C.white } })), { x: 0.7, y: 1.3, w: 8.6, h: 4.0, valign: "top", lineSpacingMultiple: 1.45 }); }

  // ─────────────────────────────────────────────────────────────────────
  // SAVE
  // ─────────────────────────────────────────────────────────────────────
  const outDir = "C:/Projects/4veco/module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.3 Paragraaf 3 - Toepassen/2. Leren";
  const outFile = path.join(outDir, "1.1.3 Toepassen \u2013 presentatie.pptx");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  await pres.writeFile({ fileName: outFile });
  console.log("Saved:", outFile);
  const stats = fs.statSync(outFile);
  console.log("Size:", (stats.size / 1024).toFixed(1), "KB, Slides: 8 (incl. 4 graphs)");
}

build().catch(err => { console.error("ERROR:", err); process.exit(1); });
