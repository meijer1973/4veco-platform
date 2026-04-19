/**
 * PPTX: 1.1.2 Kiezen of delen - presentatie
 * Budgetlijnen en keuzes bij beperkt budget.
 * 8 slides with 4 SVG graphs.
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-112-presentatie.js
 */
process.env.NODE_PATH = "C:/Users/meije/AppData/Roaming/npm/node_modules";
require("module").Module._initPaths();

const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const { svgToPng, pngToBase64, GRAPH_COLORS } = require("../../lib/lib-svg-utils");

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

// Plot area constants
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

// Map data coords to plot coords
function mapX(val, maxVal) { return PX + (val / maxVal) * PW; }
function mapY(val, maxVal) { return PY2 - (val / maxVal) * PH; }

// Gridlines helper
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

// GRAPH 1: Basic budget line (B=36, p_kroket=2, p_boek=12)
function buildBudgetLineSVG() {
  const xMax = 24, yMax = 5;
  // Budget line: 2q1 + 12q2 = 36 → q1_max=18, q2_max=3
  const x1 = mapX(0, xMax), y1 = mapY(3, yMax);
  const x2 = mapX(18, xMax), y2 = mapY(0, yMax);
  // Point (6, 2)
  const px = mapX(6, xMax), py = mapY(2, yMax);

  return `${svgHead()}
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Budgetlijn: B = \u20AC36, p\u2081 = \u20AC2 (kroket), p\u2082 = \u20AC12 (boek)</text>
  ${axisLines()}
  ${gridLines(xMax, 3, yMax, 1)}
  <text x="${PX + PW/2}" y="${PY2 + 32}" text-anchor="middle" font-size="12" fill="${GC.axis}">Kroketten (q\u2081)</text>
  <text x="20" y="${PY + PH/2}" text-anchor="middle" font-size="12" fill="${GC.axis}" transform="rotate(-90,20,${PY + PH/2})">Boeken (q\u2082)</text>
  <!-- Feasible area -->
  <polygon points="${Math.round(x1)},${Math.round(y1)} ${Math.round(x2)},${Math.round(y2)} ${Math.round(PX)},${Math.round(PY2)}" fill="${GC.teal}" fill-opacity="0.12"/>
  <!-- Budget line -->
  <line x1="${Math.round(x1)}" y1="${Math.round(y1)}" x2="${Math.round(x2)}" y2="${Math.round(y2)}" stroke="${GC.teal}" stroke-width="2.5"/>
  <!-- Intercept labels -->
  <circle cx="${Math.round(x1)}" cy="${Math.round(y1)}" r="4" fill="${GC.teal}"/>
  <text x="${Math.round(x1) + 8}" y="${Math.round(y1) - 8}" font-size="11" font-weight="bold" fill="${GC.tealDk}">(0, 3)</text>
  <circle cx="${Math.round(x2)}" cy="${Math.round(y2)}" r="4" fill="${GC.teal}"/>
  <text x="${Math.round(x2) - 5}" y="${Math.round(y2) - 10}" text-anchor="end" font-size="11" font-weight="bold" fill="${GC.tealDk}">(18, 0)</text>
  <!-- Point (6,2) -->
  <circle cx="${Math.round(px)}" cy="${Math.round(py)}" r="5" fill="${GC.amber}" stroke="${GC.axis}" stroke-width="1"/>
  <text x="${Math.round(px) + 10}" y="${Math.round(py) - 6}" font-size="11" font-weight="bold" fill="${GC.amber}">Combinatie (6, 2)</text>
  <text x="${Math.round(px) + 10}" y="${Math.round(py) + 10}" font-size="10" fill="${GC.label}">6\u00D72 + 2\u00D712 = \u20AC36 \u2713</text>
  <!-- Labels -->
  <text x="${PX2 - 10}" y="${Math.round(mapY(0.6, yMax))}" text-anchor="end" font-size="11" fill="${GC.teal}" font-style="italic">Budgetlijn</text>
  <text x="${PX + 30}" y="${Math.round(mapY(0.4, yMax))}" font-size="10" fill="${GC.teal}" font-style="italic">Haalbaar gebied</text>
</svg>`;
}

// GRAPH 2: Budget change - parallel shift (B=36 → B=54)
function buildBudgetShiftSVG() {
  const xMax = 30, yMax = 6;
  // Original: B=36 → (18,0) and (0,3)
  const ox1 = mapX(0, xMax), oy1 = mapY(3, yMax);
  const ox2 = mapX(18, xMax), oy2 = mapY(0, yMax);
  // New: B=54 → (27,0) and (0,4.5)
  const nx1 = mapX(0, xMax), ny1 = mapY(4.5, yMax);
  const nx2 = mapX(27, xMax), ny2 = mapY(0, yMax);

  return `${svgHead()}
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Budget verandert: B = \u20AC36 \u2192 \u20AC54 (parallelle verschuiving)</text>
  <defs><marker id="arr1" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="${GC.red}"/></marker></defs>
  ${axisLines()}
  ${gridLines(xMax, 3, yMax, 1)}
  <text x="${PX + PW/2}" y="${PY2 + 32}" text-anchor="middle" font-size="12" fill="${GC.axis}">Kroketten (q\u2081)</text>
  <text x="20" y="${PY + PH/2}" text-anchor="middle" font-size="12" fill="${GC.axis}" transform="rotate(-90,20,${PY + PH/2})">Boeken (q\u2082)</text>
  <!-- Original (dashed) -->
  <line x1="${Math.round(ox1)}" y1="${Math.round(oy1)}" x2="${Math.round(ox2)}" y2="${Math.round(oy2)}" stroke="${GC.teal}" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="${Math.round(ox2) - 20}" y="${Math.round(oy2) - 12}" text-anchor="end" font-size="10" fill="${GC.teal}">B = \u20AC36</text>
  <!-- New (solid) -->
  <line x1="${Math.round(nx1)}" y1="${Math.round(ny1)}" x2="${Math.round(nx2)}" y2="${Math.round(ny2)}" stroke="${GC.tealDk}" stroke-width="2.5"/>
  <text x="${Math.round(nx2) - 10}" y="${Math.round(ny2) - 12}" text-anchor="end" font-size="10" font-weight="bold" fill="${GC.tealDk}">B = \u20AC54</text>
  <!-- Intercept dots -->
  <circle cx="${Math.round(ox1)}" cy="${Math.round(oy1)}" r="3.5" fill="${GC.teal}"/>
  <circle cx="${Math.round(ox2)}" cy="${Math.round(oy2)}" r="3.5" fill="${GC.teal}"/>
  <circle cx="${Math.round(nx1)}" cy="${Math.round(ny1)}" r="4" fill="${GC.tealDk}"/>
  <circle cx="${Math.round(nx2)}" cy="${Math.round(ny2)}" r="4" fill="${GC.tealDk}"/>
  <!-- Arrow showing shift -->
  <line x1="${Math.round(mapX(9, xMax))}" y1="${Math.round(mapY(1.5, yMax))}" x2="${Math.round(mapX(13.5, xMax))}" y2="${Math.round(mapY(2.25, yMax))}" stroke="${GC.red}" stroke-width="2" marker-end="url(#arr1)"/>
  <text x="${Math.round(mapX(12, xMax)) + 10}" y="${Math.round(mapY(2.25, yMax)) - 8}" font-size="11" font-weight="bold" fill="${GC.red}">Meer budget \u2192</text>
  <text x="${Math.round(mapX(12, xMax)) + 10}" y="${Math.round(mapY(2.25, yMax)) + 8}" font-size="10" fill="${GC.red}">parallelle verschuiving naar rechts</text>
</svg>`;
}

// GRAPH 3: Price change - pivot (B=180, p1=15→20, p2=30)
function buildPricePivotSVG() {
  const xMax = 15, yMax = 8;
  // Y-intercept: B/p2 = 180/30 = 6 (stays the same)
  // Original: x-intercept = 180/15 = 12
  // New: x-intercept = 180/20 = 9
  const yInt = mapY(6, yMax);
  const ox = mapX(12, xMax), nx = mapX(9, xMax);
  const baseY = mapY(0, yMax);
  const topX = mapX(0, xMax);

  return `${svgHead()}
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Prijs verandert: p\u2081 = \u20AC15 \u2192 \u20AC20 (draaien rond y-snijpunt)</text>
  <defs><marker id="arr2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="${GC.red}"/></marker></defs>
  ${axisLines()}
  ${gridLines(xMax, 1, yMax, 1)}
  <text x="${PX + PW/2}" y="${PY2 + 32}" text-anchor="middle" font-size="12" fill="${GC.axis}">Goed 1 (q\u2081)</text>
  <text x="20" y="${PY + PH/2}" text-anchor="middle" font-size="12" fill="${GC.axis}" transform="rotate(-90,20,${PY + PH/2})">Goed 2 (q\u2082)</text>
  <!-- Original (dashed) -->
  <line x1="${Math.round(topX)}" y1="${Math.round(yInt)}" x2="${Math.round(ox)}" y2="${Math.round(baseY)}" stroke="${GC.teal}" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="${Math.round(ox) + 5}" y="${Math.round(baseY) - 10}" font-size="10" fill="${GC.teal}">p\u2081 = \u20AC15 \u2192 q\u2081\u1D50\u1D43\u02E3 = 12</text>
  <!-- New (solid) -->
  <line x1="${Math.round(topX)}" y1="${Math.round(yInt)}" x2="${Math.round(nx)}" y2="${Math.round(baseY)}" stroke="${GC.tealDk}" stroke-width="2.5"/>
  <text x="${Math.round(nx) + 5}" y="${Math.round(baseY) - 26}" font-size="10" font-weight="bold" fill="${GC.tealDk}">p\u2081 = \u20AC20 \u2192 q\u2081\u1D50\u1D43\u02E3 = 9</text>
  <!-- Y-intercept (pivot point) -->
  <circle cx="${Math.round(topX)}" cy="${Math.round(yInt)}" r="5" fill="${GC.amber}" stroke="${GC.axis}" stroke-width="1"/>
  <text x="${Math.round(topX) + 10}" y="${Math.round(yInt) - 6}" font-size="11" font-weight="bold" fill="${GC.amber}">Draaipunt (0, 6)</text>
  <text x="${Math.round(topX) + 10}" y="${Math.round(yInt) + 10}" font-size="10" fill="${GC.label}">q\u2082\u1D50\u1D43\u02E3 = B/p\u2082 = 180/30 = 6</text>
  <!-- Intercept dots -->
  <circle cx="${Math.round(ox)}" cy="${Math.round(baseY)}" r="3.5" fill="${GC.teal}"/>
  <circle cx="${Math.round(nx)}" cy="${Math.round(baseY)}" r="4" fill="${GC.tealDk}"/>
  <!-- Pivot arrow -->
  <path d="M${Math.round(mapX(10.5, xMax))},${Math.round(mapY(1.5, yMax))} Q${Math.round(mapX(9, xMax))},${Math.round(mapY(1, yMax))} ${Math.round(mapX(7.5, xMax))},${Math.round(mapY(1.8, yMax))}" fill="none" stroke="${GC.red}" stroke-width="2" marker-end="url(#arr2)"/>
  <text x="${Math.round(mapX(10, xMax))}" y="${Math.round(mapY(2.2, yMax))}" font-size="10" font-weight="bold" fill="${GC.red}">Lijn draait naar binnen</text>
</svg>`;
}

// GRAPH 4: Labor-leisure (vrije tijd vs. inkomen)
function buildLaborLeisureSVG() {
  const xMax = 24, yMax = 300;
  // Wage €10: max income = 24*10 = 240; wage €12: max income = 24*12 = 288
  // Line 1: (0, 240) to (24, 0) -- (vrije tijd=0 → work=24 → income=240)
  // Line 2: (0, 288) to (24, 0) -- same x-intercept (24h vrije tijd = 0 income)
  // Mark: 16 uur vrije tijd = 8 uur werken → €80 (wage 10) and €96 (wage 12)

  return `${svgHead()}
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Vrije tijd of inkomen: de keuze tussen werken en vrije tijd</text>
  <defs><marker id="arr3" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="${GC.axis}"/></marker></defs>
  ${axisLines()}
  ${gridLines(xMax, 4, yMax, 50)}
  <text x="${PX + PW/2}" y="${PY2 + 32}" text-anchor="middle" font-size="12" fill="${GC.axis}">Vrije tijd (uren per dag)</text>
  <text x="20" y="${PY + PH/2}" text-anchor="middle" font-size="12" fill="${GC.axis}" transform="rotate(-90,20,${PY + PH/2})">Inkomen (\u20AC per dag)</text>
  <!-- Wage €10 line -->
  <line x1="${Math.round(mapX(0, xMax))}" y1="${Math.round(mapY(240, yMax))}" x2="${Math.round(mapX(24, xMax))}" y2="${Math.round(mapY(0, yMax))}" stroke="${GC.teal}" stroke-width="2.5"/>
  <text x="${Math.round(mapX(1, xMax))}" y="${Math.round(mapY(240, yMax)) - 8}" font-size="10" font-weight="bold" fill="${GC.teal}">Loon = \u20AC10/uur</text>
  <!-- Wage €12 line -->
  <line x1="${Math.round(mapX(0, xMax))}" y1="${Math.round(mapY(288, yMax))}" x2="${Math.round(mapX(24, xMax))}" y2="${Math.round(mapY(0, yMax))}" stroke="${GC.tealDk}" stroke-width="2.5"/>
  <text x="${Math.round(mapX(1, xMax))}" y="${Math.round(mapY(288, yMax)) - 8}" font-size="10" font-weight="bold" fill="${GC.tealDk}">Loon = \u20AC12/uur</text>
  <!-- Mark 8 uur werken = 16 uur vrije tijd -->
  <circle cx="${Math.round(mapX(16, xMax))}" cy="${Math.round(mapY(80, yMax))}" r="5" fill="${GC.amber}" stroke="${GC.axis}" stroke-width="1"/>
  <line x1="${Math.round(mapX(16, xMax))}" y1="${Math.round(mapY(80, yMax))}" x2="${Math.round(mapX(16, xMax))}" y2="${Math.round(mapY(0, yMax))}" stroke="${GC.amber}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${Math.round(mapX(0, xMax))}" y1="${Math.round(mapY(80, yMax))}" x2="${Math.round(mapX(16, xMax))}" y2="${Math.round(mapY(80, yMax))}" stroke="${GC.amber}" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="${Math.round(mapX(16, xMax)) + 8}" y="${Math.round(mapY(80, yMax)) - 8}" font-size="10" font-weight="bold" fill="${GC.amber}">8 uur werken</text>
  <text x="${Math.round(mapX(16, xMax)) + 8}" y="${Math.round(mapY(80, yMax)) + 8}" font-size="10" fill="${GC.amber}">\u20AC80 bij \u20AC10/uur</text>
  <!-- Mark same point on €12 line -->
  <circle cx="${Math.round(mapX(16, xMax))}" cy="${Math.round(mapY(96, yMax))}" r="4" fill="${GC.green}" stroke="${GC.axis}" stroke-width="1"/>
  <text x="${Math.round(mapX(16, xMax)) + 8}" y="${Math.round(mapY(96, yMax)) + 4}" font-size="10" fill="${GC.green}">\u20AC96 bij \u20AC12/uur</text>
  <!-- Common x-intercept -->
  <circle cx="${Math.round(mapX(24, xMax))}" cy="${Math.round(mapY(0, yMax))}" r="3.5" fill="${GC.axis}"/>
  <text x="${Math.round(mapX(24, xMax))}" y="${Math.round(mapY(0, yMax)) + 16}" text-anchor="middle" font-size="10" fill="${GC.axis}">24</text>
  <!-- Annotation -->
  <text x="360" y="350" text-anchor="middle" font-size="11" fill="${GC.title}" font-weight="bold">Opofferingskosten vrije tijd = het uurloon dat je misloopt</text>
</svg>`;
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
  pres.title = "1.1.2 Kiezen of delen";

  addTitleMaster(pres);
  addContentMaster(pres);

  // Render all graphs (use pre-built PNGs if available)
  const [g1Buf, g2Buf, g3Buf, g4Buf] = await Promise.all([
    loadOrRender("m1-112-budgetlijn.png", buildBudgetLineSVG),
    loadOrRender("m1-112-budget-shift.png", buildBudgetShiftSVG),
    loadOrRender("m1-112-price-pivot.png", buildPricePivotSVG),
    loadOrRender("m1-112-labor-leisure.png", buildLaborLeisureSVG),
  ]);
  const g1 = pngToBase64(g1Buf);
  const g2 = pngToBase64(g2Buf);
  const g3 = pngToBase64(g3Buf);
  const g4 = pngToBase64(g4Buf);

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 1: Title (dark navy)
  // ─────────────────────────────────────────────────────────────────────
  { const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Kiezen of delen", { x: 0.7, y: 1.0, w: 8.6, h: 1.4, fontSize: 40, fontFace: "Arial", color: C.white, bold: true });
    s.addText("Budgetlijnen en keuzes bij beperkt budget", { x: 0.7, y: 2.4, w: 8.6, h: 0.6, fontSize: 22, fontFace: "Arial", color: C.gray });
    s.addText("Paragraaf 1.1.2  |  Economie VWO", { x: 0.7, y: 5.15, w: 8.6, h: 0.475, fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle" }); }

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 2: Wat is een budgetlijn?
  // ─────────────────────────────────────────────────────────────────────
  { const s = addContentSlide(pres, "Wat is een budgetlijn?");
    drawCard(s, 0.5, 1.1, 9, 1.6, C.primary, C.primaryLt, "Definitie", C.primaryDk, [
      { text: "Een budgetlijn laat alle combinaties zien van twee goederen die een consument met een bepaald budget kan kopen.", options: { fontSize: 15, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(s, 0.5, 3.0, 9, 1.5, C.amber, C.amberLt, "Budgetvergelijking", C.amber, [
      { text: "B = p", options: { fontSize: 16, fontFace: "Consolas", color: C.dark } },
      { text: "\u2081", options: { fontSize: 16, fontFace: "Consolas", color: C.dark } },
      { text: " \u00B7 q", options: { fontSize: 16, fontFace: "Consolas", color: C.dark } },
      { text: "\u2081", options: { fontSize: 16, fontFace: "Consolas", color: C.dark } },
      { text: " + p", options: { fontSize: 16, fontFace: "Consolas", color: C.dark } },
      { text: "\u2082", options: { fontSize: 16, fontFace: "Consolas", color: C.dark } },
      { text: " \u00B7 q", options: { fontSize: 16, fontFace: "Consolas", color: C.dark } },
      { text: "\u2082", options: { fontSize: 16, fontFace: "Consolas", color: C.dark } },
    ]);
    s.addText([
      { text: "B = budget (beschikbaar geld)    ", options: { fontSize: 12, fontFace: "Arial", color: C.gray } },
      { text: "p = prijs per eenheid    ", options: { fontSize: 12, fontFace: "Arial", color: C.gray } },
      { text: "q = hoeveelheid", options: { fontSize: 12, fontFace: "Arial", color: C.gray } },
    ], { x: 0.7, y: 4.7, w: 8.6, h: 0.4, valign: "top" });
    s.addNotes("De budgetlijn is een grafische weergave van de budgetbeperking. Alle punten OP de lijn besteden het budget precies. Punten ONDER de lijn zijn haalbaar (er blijft geld over). Punten BOVEN de lijn zijn niet haalbaar."); }

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 3: GRAPH - Budgetlijn tekenen
  // ─────────────────────────────────────────────────────────────────────
  { const s = addContentSlide(pres, "Budgetlijn tekenen");
    s.addImage({ data: g1, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("Voorbeeld: Budget = \u20AC36, kroket = \u20AC2, boek = \u20AC12. Snijpunt x-as: 36/2 = 18 kroketten. Snijpunt y-as: 36/12 = 3 boeken. Het gekleurde gebied onder de lijn is het haalbare gebied. De combinatie (6,2) ligt op de lijn: 6\u00D72 + 2\u00D712 = \u20AC36."); }

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 4: Snijpunten berekenen
  // ─────────────────────────────────────────────────────────────────────
  { const s = addContentSlide(pres, "Snijpunten berekenen");
    drawCard(s, 0.5, 1.1, 4.3, 1.8, C.primary, C.primaryLt, "X-as snijpunt", C.primaryDk, [
      { text: "Zet q\u2082 = 0:\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "q\u2081\u1D50\u1D43\u02E3 = B / p\u2081\n", options: { fontSize: 15, fontFace: "Consolas", color: C.primaryDk, bold: true } },
      { text: "= 36 / 2 = 18 kroketten", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(s, 5.2, 1.1, 4.3, 1.8, C.amber, C.amberLt, "Y-as snijpunt", C.amber, [
      { text: "Zet q\u2081 = 0:\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "q\u2082\u1D50\u1D43\u02E3 = B / p\u2082\n", options: { fontSize: 15, fontFace: "Consolas", color: C.amber, bold: true } },
      { text: "= 36 / 12 = 3 boeken", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(s, 0.5, 3.2, 9, 1.5, C.green, C.greenLt, "Stappen", C.green, [
      { text: "1. Bereken beide snijpunten (q\u2081\u1D50\u1D43\u02E3 en q\u2082\u1D50\u1D43\u02E3)\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: false } },
      { text: "2. Zet de snijpunten uit op de assen\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: false } },
      { text: "3. Verbind ze met een rechte lijn \u2192 dit is de budgetlijn", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: false } },
    ]);
    s.addNotes("Stap-voor-stap: (1) bereken hoeveel je maximaal van goed 1 kunt kopen als je niets van goed 2 koopt: q1_max = B/p1. (2) Idem voor goed 2: q2_max = B/p2. (3) Zet beide punten in de grafiek en trek er een rechte lijn doorheen. De helling van de lijn = -p1/p2 = de ruilvoet."); }

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 5: GRAPH - Budget verandert
  // ─────────────────────────────────────────────────────────────────────
  { const s = addContentSlide(pres, "Budget verandert");
    s.addImage({ data: g2, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("Als het budget stijgt (bijv. van \u20AC36 naar \u20AC54) en de prijzen gelijk blijven, verschuift de budgetlijn evenwijdig naar buiten (naar rechts). De helling verandert niet, want de prijsverhouding is hetzelfde. Bij een daling schuift de lijn naar binnen."); }

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 6: GRAPH - Prijs verandert
  // ─────────────────────────────────────────────────────────────────────
  { const s = addContentSlide(pres, "Prijs verandert");
    s.addImage({ data: g3, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("Als de prijs van goed 1 stijgt (van \u20AC15 naar \u20AC20), draait de budgetlijn rond het y-snijpunt (dat blijft gelijk, want p2 en B veranderen niet). Het x-snijpunt verschuift naar links: je kunt minder van goed 1 kopen. De helling wordt steiler."); }

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 7: GRAPH - Vrije tijd of inkomen
  // ─────────────────────────────────────────────────────────────────────
  { const s = addContentSlide(pres, "Vrije tijd of inkomen");
    s.addImage({ data: g4, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("De keuze tussen vrije tijd en werken is ook een budgetlijnvraagstuk. X-as = vrije tijd (0-24 uur), Y-as = inkomen. Bij uurloon \u20AC10: max inkomen = 24 \u00D7 10 = \u20AC240. Bij 8 uur werken (16 uur vrije tijd): inkomen = \u20AC80. De opofferingskosten van een uur vrije tijd = het uurloon. Bij een hoger loon (\u20AC12) draait de lijn omhoog rond het x-snijpunt (24 uur)."); }

  // ─────────────────────────────────────────────────────────────────────
  // SLIDE 8: Samenvatting
  // ─────────────────────────────────────────────────────────────────────
  { const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Samenvatting", { x: 0.7, y: 0.4, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Arial", color: C.white, bold: true });
    s.addText([
      "\u2610 Budgetvergelijking: B = p\u2081 \u00B7 q\u2081 + p\u2082 \u00B7 q\u2082",
      "\u2610 Snijpunten: q\u2081\u1D50\u1D43\u02E3 = B/p\u2081  en  q\u2082\u1D50\u1D43\u02E3 = B/p\u2082",
      "\u2610 Budget omhoog/omlaag \u2192 parallelle verschuiving",
      "\u2610 Prijs verandert \u2192 lijn draait rond het andere snijpunt",
      "\u2610 Opofferingskosten vrije tijd = het uurloon dat je misloopt",
      "\u2610 Haalbaar gebied = alle punten op en onder de budgetlijn",
    ].map(c => ({ text: c + "\n", options: { fontSize: 14, fontFace: "Arial", color: C.white } })), { x: 0.7, y: 1.3, w: 8.6, h: 4.0, valign: "top", lineSpacingMultiple: 1.45 }); }

  // ─────────────────────────────────────────────────────────────────────
  // SAVE
  // ─────────────────────────────────────────────────────────────────────
  const outDir = "C:/Projects/4veco/module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.2 Paragraaf 2 - Kiezen of delen/2. Leren";
  const outFile = path.join(outDir, "1.1.2 Kiezen of delen \u2013 presentatie.pptx");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  await pres.writeFile({ fileName: outFile });
  console.log("Saved:", outFile);
  const stats = fs.statSync(outFile);
  console.log("Size:", (stats.size / 1024).toFixed(1), "KB, Slides: 8 (incl. 4 graphs)");
}

build().catch(err => { console.error("ERROR:", err); process.exit(1); });
