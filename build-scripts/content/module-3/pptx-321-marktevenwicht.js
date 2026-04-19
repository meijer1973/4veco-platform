/**
 * PPTX Build: 3.2.1 Marktevenwicht – presentatie met grafieken
 *
 * 16 dia's: 13 origineel + 3 grafiekdia's (V/A-evenwicht, MO-vergelijking, arbeidsmarkt)
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/pptx-321-marktevenwicht.js
 */
process.env.NODE_PATH = "C:/Users/meije/AppData/Roaming/npm/node_modules";
require("module").Module._initPaths();

const PptxGenJS = require("pptxgenjs");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { saveSvgFiles } = require("./lib-svg-save");

// ═══════════════════════════════════════════════════════════════════════════
// COLOR PALETTE
// ═══════════════════════════════════════════════════════════════════════════
const C = {
  dBlue: "1A5276", dBlueLt: "EBF5FB", dBlueDk: "154360",
  dAmber: "E67E22", dAmberLt: "FEF5E7", dAmberDk: "BA6A1C",
  dGreen: "1E8449", dGreenLt: "E8F8F0", dGreenDk: "186A3B",
  navy: "1E2761", white: "FFFFFF", dark: "2D3748", gray: "718096",
  lightGray: "F7F8FA", borderGray: "CBD5E0", red: "D9534F", lightRed: "FDE8E8",
  cream: "F9F6F1", rowAlt: "F7FAFC",
  purple: "7B2D8E", lightPurple: "F3E8F9",
};
const DOMAIN = { color: C.dBlue, light: C.dBlueLt, dark: C.dBlueDk };

// SVG colors (with #)
const GC = {
  demand: "#1A5276", supply: "#1E8449", cost: "#E67E22",
  revenue: "#7B2D8E", axis: "#2D3748", grid: "#CBD5E0",
  label: "#718096", title: "#1E2761", bg: "#F7FAFC",
  surplus: "#85C1E9", prodSurplus: "#82E0AA",
};

const makeShadow = () => ({
  type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.10,
});

// ═══════════════════════════════════════════════════════════════════════════
// SVG → PNG PIPELINE
// ═══════════════════════════════════════════════════════════════════════════
async function svgToPng(svgStr, width = 720) {
  return sharp(Buffer.from(svgStr)).resize(width).png().toBuffer();
}
function pngToBase64(buf) {
  return "image/png;base64," + buf.toString("base64");
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 1: V/A EQUILIBRIUM
// V: p = -0.5Q + 50, A: p = 0.5Q + 10 → Q*=40, p*=30
// ═══════════════════════════════════════════════════════════════════════════
function buildVAEquilibriumSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 100, pMax = 55;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  // Curve endpoints
  const v1x = qToX(0), v1y = pToY(50);    // demand start
  const v2x = qToX(100), v2y = pToY(0);   // demand end
  const a1x = qToX(0), a1y = pToY(10);    // supply start
  const a2x = qToX(90), a2y = pToY(55);   // supply end (clip at top)
  const eqx = qToX(40), eqy = pToY(30);   // equilibrium

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Marktevenwicht: Qv = Qa</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="380" y="350" text-anchor="middle" font-size="12" fill="${GC.label}">Hoeveelheid (Q)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Dashed reference lines -->
  <line x1="${px}" y1="${eqy}" x2="${eqx}" y2="${eqy}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <line x1="${eqx}" y1="${eqy}" x2="${eqx}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>

  <!-- Axis value labels -->
  <text x="72" y="${eqy+4}" text-anchor="end" font-size="11" fill="${GC.axis}">p* = 30</text>
  <text x="${eqx}" y="325" text-anchor="middle" font-size="11" fill="${GC.axis}">Q* = 40</text>
  <text x="72" y="${v1y+4}" text-anchor="end" font-size="10" fill="${GC.label}">50</text>
  <text x="72" y="${a1y+4}" text-anchor="end" font-size="10" fill="${GC.label}">10</text>

  <!-- Demand curve (V) -->
  <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v2x-15}" y="${v2y-12}" font-size="12" font-weight="bold" fill="${GC.demand}">V</text>

  <!-- Supply curve (A) -->
  <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${GC.supply}" stroke-width="2.5"/>
  <text x="${a2x+8}" y="${a2y+14}" font-size="12" font-weight="bold" fill="${GC.supply}">A</text>

  <!-- Equilibrium dot -->
  <circle cx="${eqx}" cy="${eqy}" r="5" fill="${GC.demand}"/>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 2: MO COMPARISON (side-by-side)
// Left: Volkomen concurrentie (P=MO horizontal, MK rising)
// Right: Monopolie (V, MO double slope, MK, p* from V)
// ═══════════════════════════════════════════════════════════════════════════
function buildMOComparisonSVG() {
  // --- Left panel (Volkomen concurrentie) ---
  const lx = 60, ly = 55, lw = 270, lh = 225; // plot area
  const lqMax = 50, lpMax = 35;
  const lqToX = q => Math.round(lx + (q / lqMax) * lw);
  const lpToY = p => Math.round(ly + lh - (p / lpMax) * lh);

  // P=MO=20 horizontal, MK = 0.5q + 5, q*=30
  const lpLine = lpToY(20);
  const lmk1x = lqToX(0), lmk1y = lpToY(5);
  const lmk2x = lqToX(50), lmk2y = lpToY(30);
  const lqStar = lqToX(30);

  // --- Right panel (Monopolie) ---
  const rx = 400, ry = 55, rw = 270, rh = 225;
  const rqMax = 50, rpMax = 55;
  const rqToX = q => Math.round(rx + (q / rqMax) * rw);
  const rpToY = p => Math.round(ry + rh - (p / rpMax) * rh);

  // V: p=-q+50, MO: p=-2q+50, MK: p=0.5q
  // MO=MK: -2q+50=0.5q → q*=20, MO(20)=10, p*(V)=30
  const rv1x = rqToX(0), rv1y = rpToY(50);
  const rv2x = rqToX(50), rv2y = rpToY(0);
  const rmo1x = rqToX(0), rmo1y = rpToY(50);
  const rmo2x = rqToX(25), rmo2y = rpToY(0);
  const rmk1x = rqToX(0), rmk1y = rpToY(0);
  const rmk2x = rqToX(50), rmk2y = rpToY(25);
  const rqStar = rqToX(20);
  const rMOeqY = rpToY(10);  // MO=MK point
  const rpStarY = rpToY(30); // price from demand curve

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- ═══ LEFT PANEL: Volkomen concurrentie ═══ -->
  <text x="195" y="22" text-anchor="middle" font-size="13" font-weight="bold" fill="${GC.title}">Volkomen concurrentie</text>

  <!-- Left axes -->
  <line x1="${lx}" y1="${ly+lh}" x2="${lx}" y2="${ly-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${lx}" y1="${ly+lh}" x2="${lx+lw+5}" y2="${ly+lh}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="170" transform="rotate(-90, 15, 170)" text-anchor="middle" font-size="10" fill="${GC.label}">P</text>
  <text x="195" y="305" text-anchor="middle" font-size="10" fill="${GC.label}">q</text>
  <text x="52" y="295" text-anchor="end" font-size="9" fill="${GC.label}">0</text>

  <!-- P=MO horizontal line -->
  <line x1="${lx}" y1="${lpLine}" x2="${lx+lw-10}" y2="${lpLine}" stroke="${GC.demand}" stroke-width="2"/>
  <text x="${lx+lw-5}" y="${lpLine-6}" font-size="10" font-weight="bold" fill="${GC.demand}">P = MO</text>

  <!-- MK curve -->
  <line x1="${lmk1x}" y1="${lmk1y}" x2="${lmk2x}" y2="${lmk2y}" stroke="${GC.cost}" stroke-width="2"/>
  <text x="${lmk2x+5}" y="${lmk2y+4}" font-size="10" font-weight="bold" fill="${GC.cost}">MK</text>

  <!-- q* intersection -->
  <circle cx="${lqStar}" cy="${lpLine}" r="4" fill="${GC.demand}"/>
  <line x1="${lqStar}" y1="${lpLine}" x2="${lqStar}" y2="${ly+lh}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="${lqStar}" y="295" text-anchor="middle" font-size="9" fill="${GC.axis}">q*</text>
  <text x="52" y="${lpLine+4}" text-anchor="end" font-size="9" fill="${GC.axis}">p*</text>

  <!-- ═══ RIGHT PANEL: Monopolie ═══ -->
  <text x="535" y="22" text-anchor="middle" font-size="13" font-weight="bold" fill="${GC.title}">Monopolie</text>

  <!-- Right axes -->
  <line x1="${rx}" y1="${ry+rh}" x2="${rx}" y2="${ry-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${rx}" y1="${ry+rh}" x2="${rx+rw+5}" y2="${ry+rh}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="385" y="170" transform="rotate(-90, 385, 170)" text-anchor="middle" font-size="10" fill="${GC.label}">P</text>
  <text x="535" y="305" text-anchor="middle" font-size="10" fill="${GC.label}">Q</text>
  <text x="392" y="295" text-anchor="end" font-size="9" fill="${GC.label}">0</text>

  <!-- Demand curve (V) -->
  <line x1="${rv1x}" y1="${rv1y}" x2="${rv2x}" y2="${rv2y}" stroke="${GC.demand}" stroke-width="2"/>
  <text x="${rv2x-12}" y="${rv2y-8}" font-size="10" font-weight="bold" fill="${GC.demand}">V</text>

  <!-- MO curve (double slope, same intercept) -->
  <line x1="${rmo1x}" y1="${rmo1y}" x2="${rmo2x}" y2="${rmo2y}" stroke="${GC.revenue}" stroke-width="2"/>
  <text x="${rmo2x+5}" y="${rmo2y-8}" font-size="10" font-weight="bold" fill="${GC.revenue}">MO</text>

  <!-- MK curve -->
  <line x1="${rmk1x}" y1="${rmk1y}" x2="${rmk2x}" y2="${rmk2y}" stroke="${GC.cost}" stroke-width="2"/>
  <text x="${rmk2x+5}" y="${rmk2y+4}" font-size="10" font-weight="bold" fill="${GC.cost}">MK</text>

  <!-- MO=MK intersection dot -->
  <circle cx="${rqStar}" cy="${rMOeqY}" r="4" fill="${GC.revenue}"/>

  <!-- Dashed path: MO=MK → up to V → left to P-axis -->
  <line x1="${rqStar}" y1="${rMOeqY}" x2="${rqStar}" y2="${rpStarY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${rx}" y1="${rpStarY}" x2="${rqStar}" y2="${rpStarY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${rqStar}" y1="${rpStarY}" x2="${rqStar}" y2="${ry+rh}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- p* dot on demand curve -->
  <circle cx="${rqStar}" cy="${rpStarY}" r="4" fill="${GC.demand}"/>

  <!-- Axis labels -->
  <text x="392" y="${rpStarY+4}" text-anchor="end" font-size="9" fill="${GC.axis}">p*</text>
  <text x="${rqStar}" y="295" text-anchor="middle" font-size="9" fill="${GC.axis}">Q*</text>

  <!-- Annotation: "p* van V, niet MK!" -->
  <text x="${rqStar+12}" y="${rpStarY-4}" font-size="9" fill="${GC.demand}" font-style="italic">p* van V!</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 3: LABOR MARKET WITH DEMAND SHIFT
// A: w = 0.4L + 10, V1: w = -0.4L + 50, V2: w = -0.4L + 38
// Eq1: L=50, w=30   Eq2: L=35, w=24
// ═══════════════════════════════════════════════════════════════════════════
function buildLaborMarketSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const lMax = 100, wMax = 55;
  const lToX = l => Math.round(px + (l / lMax) * pw);
  const wToY = w => Math.round(py + ph - (w / wMax) * ph);

  // Supply (A): w = 0.4L + 10
  const a1x = lToX(0), a1y = wToY(10);
  const a2x = lToX(100), a2y = wToY(50);

  // Demand V1: w = -0.4L + 50
  const v1_1x = lToX(0), v1_1y = wToY(50);
  const v1_2x = lToX(100), v1_2y = wToY(10);

  // Demand V2 (shifted): w = -0.4L + 38
  const v2_1x = lToX(0), v2_1y = wToY(38);
  const v2_2x = lToX(95), v2_2y = wToY(0);

  // Eq1: L=50, w=30
  const eq1x = lToX(50), eq1y = wToY(30);
  // Eq2: L=35, w=24
  const eq2x = lToX(35), eq2y = wToY(24);

  // Shift arrow: at w=38, V1 at L=30, short arrow to the left
  const arrowY = wToY(38);
  const arrow1x = lToX(32);
  const arrow2x = lToX(22);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
    <marker id="sa" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="${GC.demand}"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Technologische verandering op de arbeidsmarkt</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Loon (w)</text>
  <text x="380" y="350" text-anchor="middle" font-size="12" fill="${GC.label}">Arbeid (L)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Supply curve (A - werknemers) -->
  <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${GC.supply}" stroke-width="2.5"/>
  <text x="${a2x-10}" y="${a2y-6}" font-size="11" font-weight="bold" fill="${GC.supply}">A</text>

  <!-- Demand V1 (original - werkgevers) -->
  <line x1="${v1_1x}" y1="${v1_1y}" x2="${v1_2x}" y2="${v1_2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v1_2x-10}" y="${v1_2y+16}" font-size="11" font-weight="bold" fill="${GC.demand}">V\u2081</text>

  <!-- Demand V2 (shifted - dashed) -->
  <line x1="${v2_1x}" y1="${v2_1y}" x2="${v2_2x}" y2="${v2_2y}" stroke="${GC.demand}" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="${v2_2x-10}" y="${v2_2y-8}" font-size="11" font-weight="bold" fill="${GC.demand}">V\u2082</text>

  <!-- Shift arrow (horizontal, short, leftward) -->
  <line x1="${arrow1x}" y1="${arrowY}" x2="${arrow2x}" y2="${arrowY}" stroke="${GC.demand}" stroke-width="1.5" marker-end="url(#sa)"/>

  <!-- Eq1 dashed lines -->
  <line x1="${px}" y1="${eq1y}" x2="${eq1x}" y2="${eq1y}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <line x1="${eq1x}" y1="${eq1y}" x2="${eq1x}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <circle cx="${eq1x}" cy="${eq1y}" r="5" fill="${GC.demand}"/>

  <!-- Eq2 dashed lines -->
  <line x1="${px}" y1="${eq2y}" x2="${eq2x}" y2="${eq2y}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,2"/>
  <line x1="${eq2x}" y1="${eq2y}" x2="${eq2x}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,2"/>
  <circle cx="${eq2x}" cy="${eq2y}" r="4" fill="${GC.demand}" opacity="0.7"/>

  <!-- Axis labels -->
  <text x="72" y="${eq1y+4}" text-anchor="end" font-size="10" fill="${GC.axis}">w\u2081</text>
  <text x="72" y="${eq2y+4}" text-anchor="end" font-size="10" fill="${GC.axis}">w\u2082</text>
  <text x="${eq1x}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">L\u2081</text>
  <text x="${eq2x}" y="338" text-anchor="middle" font-size="10" fill="${GC.axis}">L\u2082</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE MASTERS
// ═══════════════════════════════════════════════════════════════════════════
function addTitleMaster(pres) {
  pres.defineSlideMaster({
    title: "TITLE_DARK",
    background: { color: C.navy },
    objects: [
      { rect: { x: 0, y: 0, w: 10, h: 0.06, fill: { color: DOMAIN.color } } },
      { rect: { x: 0, y: 5.15, w: 10, h: 0.475, fill: { color: "151D4A" } } },
    ],
  });
}
function addContentMaster(pres) {
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: C.white },
    objects: [
      { rect: { x: 0, y: 0, w: 10, h: 0.75, fill: { color: DOMAIN.color } } },
    ],
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE HELPERS
// ═══════════════════════════════════════════════════════════════════════════
function addContentSlide(pres, title) {
  const slide = pres.addSlide({ masterName: "CONTENT" });
  slide.addText(title, {
    x: 0.5, y: 0, w: 9, h: 0.75,
    fontSize: 24, fontFace: "Arial", color: C.white, bold: true, valign: "middle",
  });
  return slide;
}

function drawCard(slide, x, y, w, h, accentColor, bgColor, title, titleColor, bodyParts, extra) {
  slide.addShape("rect", {
    x, y, w, h, fill: { color: bgColor }, rectRadius: 0.05, shadow: makeShadow(),
  });
  slide.addShape("rect", {
    x, y, w: 0.06, h, fill: { color: accentColor },
  });
  slide.addText(title, {
    x: x + 0.2, y: y + 0.15, w: w - 0.35, h: 0.4,
    fontSize: 20, fontFace: "Arial", color: titleColor, bold: true, valign: "top",
  });
  if (bodyParts && bodyParts.length > 0) {
    slide.addText(bodyParts, {
      x: x + 0.2, y: y + 0.6, w: w - 0.35, h: h - 0.75,
      fontSize: 14, fontFace: "Arial", color: C.dark, valign: "top", align: "left",
      lineSpacingMultiple: 1.15,
      ...(extra || {}),
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD
// ═══════════════════════════════════════════════════════════════════════════
async function build() {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: "CUSTOM_16x9", width: 10, height: 5.625 });
  pres.layout = "CUSTOM_16x9";
  pres.author = "Economie VWO";
  pres.title = "3.2.1 Marktevenwicht";

  addTitleMaster(pres);
  addContentMaster(pres);

  // Generate graph PNGs
  const svgEntries = [
    { name: "va-equilibrium", svg: buildVAEquilibriumSVG() },
    { name: "mo-comparison", svg: buildMOComparisonSVG() },
    { name: "labor-market", svg: buildLaborMarketSVG() },
  ];
  const [g1Buf, g2Buf, g3Buf] = await Promise.all(
    svgEntries.map(e => svgToPng(e.svg))
  );
  const g1 = pngToBase64(g1Buf);
  const g2 = pngToBase64(g2Buf);
  const g3 = pngToBase64(g3Buf);

  // ────────────────────────────────────────────────────────────────────
  // DIA 1: Titel
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Marktevenwicht", {
      x: 0.7, y: 1.2, w: 8.6, h: 2,
      fontSize: 40, fontFace: "Arial", color: C.white, bold: true,
    });
    s.addText("Paragraaf 3.2.1", {
      x: 0.7, y: 3.2, w: 8.6, h: 0.5,
      fontSize: 20, fontFace: "Arial", color: C.gray,
    });
    s.addText("Hoofdstuk 2: Marktvormen en hun marktevenwicht  |  Economie VWO", {
      x: 0.7, y: 5.15, w: 8.6, h: 0.475,
      fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle",
    });
    s.addNotes("Welkom bij paragraaf 3.2.1 over marktevenwicht. We behandelen de twee voorwaarden voor evenwicht, de logica van MO = MK, en passen dit toe op de arbeidsmarkt.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 2: Leerdoelen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Wat ga je leren?");
    const bullets = [
      "De twee voorwaarden voor marktevenwicht benoemen (Qv = Qa en MO = MK)",
      "Uitleggen waarom MO = MK geldt voor alle marktvormen",
      "Het verschil tussen MO = p en MO < p toepassen",
      "Marktevenwicht toepassen op de arbeidsmarkt",
    ];
    s.addText(
      bullets.map(b => ({ text: b, options: { fontSize: 15, fontFace: "Arial", color: C.dark, bullet: true, breakType: "none" } })),
      { x: 0.7, y: 1.2, w: 8.6, h: 3.5, valign: "top", lineSpacingMultiple: 1.5, paraSpaceAfter: 8 }
    );
    s.addNotes("Dit zijn de vier leerdoelen. Na deze les kunnen leerlingen de voorwaarden voor evenwicht benoemen, MO = MK toepassen, en het verschil tussen prijsnemers en prijszetters uitleggen.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 3: Voorwaarde 1 — Qv = Qa
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Voorwaarde 1: Qv = Qa");
    // Subtitle
    s.addText("Hoeveelheid vraag = Hoeveelheid aanbod", {
      x: 0.7, y: 0.95, w: 8.6, h: 0.45,
      fontSize: 18, fontFace: "Arial", color: DOMAIN.color, bold: true,
    });
    // Main card
    drawCard(s, 0.5, 1.6, 9, 2.8, DOMAIN.color, C.cream, "Evenwicht", DOMAIN.color, [
      { text: "Op het evenwichtspunt zijn beide partijen tevreden: geen overschot, geen schaarste.\nDit is de eerste voorwaarde voor marktevenwicht.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Het snijpunt van de vraag- en aanbodcurve bepaalt de evenwichtsprijs en -hoeveelheid.", options: { fontSize: 14, fontFace: "Arial", color: C.dark, italic: true } },
    ]);
    s.addNotes("De eerste voorwaarde is dat de gevraagde hoeveelheid gelijk is aan de aangeboden hoeveelheid. Op dat punt is er geen overschot en geen tekort.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 4: GRAFIEK — V/A-evenwicht ★ NIEUW
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Marktevenwicht in de grafiek");
    s.addImage({ data: g1, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("In de grafiek is het marktevenwicht het snijpunt van V en A. Hier lees je p* en Q* af. Dit is voorwaarde 1: Qv = Qa.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 5: Voorwaarde 2 — MO = MK (drie kaarten)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Voorwaarde 2: MO = MK");
    s.addText("Marginale Opbrengst = Marginale Kosten", {
      x: 0.7, y: 0.85, w: 8.6, h: 0.35,
      fontSize: 16, fontFace: "Arial", color: C.gray, italic: true,
    });
    s.addText("Dit is het winstmaximalisatiepunt voor een producent.", {
      x: 0.7, y: 1.2, w: 8.6, h: 0.3,
      fontSize: 14, fontFace: "Arial", color: C.dark,
    });
    // Three concept cards
    const cardY = 1.7, cardH = 2.5, cardW = 2.85;
    drawCard(s, 0.4, cardY, cardW, cardH, DOMAIN.color, C.cream, "MO", DOMAIN.color, [
      { text: "Extra opbrengst per extra eenheid", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(s, 3.55, cardY, cardW, cardH, C.dAmber, C.cream, "MK", C.dAmber, [
      { text: "Extra kosten per extra eenheid", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(s, 6.7, cardY, cardW, cardH, C.dGreen, C.cream, "Optimaal", C.dGreen, [
      { text: "Winst is maximaal wanneer MO = MK", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
    ]);
    s.addNotes("De tweede voorwaarde is MO = MK. MO is de extra opbrengst van \u00e9\u00e9n extra eenheid, MK de extra kosten. Zolang MO > MK loont het om meer te produceren. Pas bij MO = MK is de winst maximaal.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 6: Waarom MO = MK? (stroomdiagram)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Waarom MO = MK?");
    s.addText("Beslissingslogica van de producent:", {
      x: 0.7, y: 0.9, w: 8.6, h: 0.35,
      fontSize: 16, fontFace: "Arial", color: C.dark, bold: true,
    });
    const steps = [
      { text: "MO > MK  \u2192  Produceer meer!", bg: C.dBlueLt, color: C.dark },
      { text: "MO < MK  \u2192  Stop met produceren!", bg: C.lightRed, color: C.dark },
      { text: "MO = MK  \u2192  Optimaal! Winst is maximaal", bg: DOMAIN.color, color: C.white },
    ];
    const boxW = 7, boxH = 0.65, boxX = 1.5, startY = 1.6, gap = 0.25;
    steps.forEach((step, i) => {
      const y = startY + i * (boxH + gap);
      s.addShape("rect", {
        x: boxX, y, w: boxW, h: boxH,
        fill: { color: step.bg }, rectRadius: 0.05, shadow: makeShadow(),
      });
      s.addText((i > 0 ? "\u2193  " : "") + step.text, {
        x: boxX + 0.3, y, w: boxW - 0.6, h: boxH,
        fontSize: 18, fontFace: "Arial", color: step.color,
        bold: i === 2, valign: "middle",
      });
    });
    s.addNotes("Dit is de kernlogica. Als MO groter is dan MK, verdien je meer dan het kost: produceer meer. Als MO kleiner is, verlies je op de laatste eenheid: stop. Bij MO = MK is de winst maximaal. Dit geldt voor alle marktvormen.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 7: Volledige mededinging — MO = p
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Volledige mededinging: MO = p");
    drawCard(s, 0.5, 1.1, 4.3, 3.3, DOMAIN.color, C.cream, "Prijsnemer (price taker)", DOMAIN.color, [
      { text: "Het bedrijf is zo klein dat het de prijs niet kan be\u00efnvloeden.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Marginale opbrengst = marktprijs\nMO = p (horizontale MO-curve)\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: "Voorbeeld: boer op de groentemarkt", options: { fontSize: 13, fontFace: "Arial", color: C.gray, italic: true } },
    ]);
    drawCard(s, 5.2, 1.1, 4.3, 3.3, C.dAmber, C.cream, "Waarom?", C.dAmber, [
      { text: "E\u00e9n boer verkoopt 100 kilo aardappelen.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "De marktprijs is \u20ac2 per kilo.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Of hij nu 100 of 101 kilo verkoopt, de prijs blijft \u20ac2.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Dus: MO = p = \u20ac2", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
    ]);
    s.addNotes("Bij volledige mededinging is het bedrijf een prijsnemer. Het is zo klein ten opzichte van de markt dat het de prijs niet be\u00efnvloedt. De marginale opbrengst is dus gelijk aan de marktprijs: MO = p.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 8: Monopolie/Oligopolie — MO < p
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Monopolie/Oligopolie: MO < p");
    drawCard(s, 0.5, 1.1, 4.3, 3.3, C.purple, C.cream, "Prijszetter (price maker)", C.purple, [
      { text: "Het bedrijf is groot genoeg om de prijs te be\u00efnvloeden.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Meer verkoop = lagere prijs\nMO < p (dalende MO-curve)\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: "Voorbeeld: telefoonprovider", options: { fontSize: 13, fontFace: "Arial", color: C.gray, italic: true } },
    ]);
    drawCard(s, 5.2, 1.1, 4.3, 3.3, C.dAmber, C.cream, "Waarom MO < p?", C.dAmber, [
      { text: "Om meer te verkopen moet de monopolist de prijs verlagen.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Die lagere prijs geldt ook voor alle vorige eenheden.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "De extra opbrengst (MO) is dus lager dan de verkoopprijs (p).", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
    ]);
    s.addNotes("Bij monopolie en oligopolie is het bedrijf een prijszetter. Het moet de prijs verlagen om meer te verkopen, en die lagere prijs geldt ook voor alle eerdere eenheden. Daarom is MO altijd lager dan p.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 9: GRAFIEK — MO prijsnemer vs. prijszetter ★ NIEUW
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "MO in de grafiek: prijsnemer vs. prijszetter");
    s.addImage({ data: g2, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("Links: prijsnemer. MO is horizontaal en gelijk aan de marktprijs. Rechts: prijszetter. MO daalt en ligt onder de vraaglijn. Let op: de prijs lees je af op de vraaglijn, niet op MK.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 10: Vergelijking MO=p vs MO<p (tabel)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Vergelijking: MO = p vs MO < p");

    const headerOpts = { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 14, fontFace: "Arial", valign: "middle" };
    const cellL = (text, i) => ({ text, options: { fill: { color: i % 2 === 0 ? C.rowAlt : C.white }, bold: true, fontSize: 13, fontFace: "Arial", valign: "middle" } });
    const cellR = (text, i) => ({ text, options: { fill: { color: i % 2 === 0 ? C.rowAlt : C.white }, fontSize: 13, fontFace: "Arial", valign: "middle" } });

    const rows = [
      [{ text: "", options: headerOpts }, { text: "Volledige mededinging", options: headerOpts }, { text: "Monopolie / Oligopolie", options: headerOpts }],
      [cellL("Prijsgedrag", 0), cellR("Prijsnemer", 0), cellR("Prijszetter", 0)],
      [cellL("MO-curve", 1), cellR("Horizontaal (MO = p)", 1), cellR("Dalend (MO < p)", 1)],
      [cellL("Winstmax", 0), cellR("MO = MK (= p)", 0), cellR("MO = MK (\u2260 p)", 0)],
      [cellL("Voorbeeld", 1), cellR("Boer, groentemarkt", 1), cellR("Telecomprovider, NS", 1)],
    ];

    s.addTable(rows, {
      x: 0.5, y: 1.1, w: 9,
      border: { pt: 0.5, color: C.borderGray },
      colW: [2.2, 3.4, 3.4],
      rowH: [0.45, 0.5, 0.5, 0.5, 0.5],
    });

    s.addText("Kernpunt: MO = MK geldt in BEIDE gevallen! Het verschil zit in de relatie tussen MO en p.", {
      x: 0.5, y: 3.8, w: 9, h: 0.5,
      fontSize: 14, fontFace: "Arial", color: C.dark, bold: true,
    });
    s.addNotes("Deze vergelijkingstabel maakt het verschil helder. MO = MK is universeel. Het verschil is of MO gelijk is aan p (prijsnemer) of lager dan p (prijszetter).");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 11: Arbeidsmarkt
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Toepassing: de arbeidsmarkt");
    s.addText("Loon = prijs van arbeid", {
      x: 0.7, y: 0.85, w: 8.6, h: 0.35,
      fontSize: 16, fontFace: "Arial", color: C.gray, italic: true,
    });
    s.addText("Op de arbeidsmarkt werkt hetzelfde mechanisme: vraag en aanbod bepalen het evenwichtsloon.", {
      x: 0.7, y: 1.2, w: 8.6, h: 0.35,
      fontSize: 14, fontFace: "Arial", color: C.dark,
    });
    drawCard(s, 0.5, 1.8, 4.3, 2.5, C.dGreen, C.cream, "Aanbodcurve", C.dGreen, [
      { text: "Meer loon \u2192 meer mensen willen werken", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(s, 5.2, 1.8, 4.3, 2.5, DOMAIN.color, C.cream, "Vraagcurve", DOMAIN.color, [
      { text: "Meer loon \u2192 bedrijven willen minder mensen", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    s.addNotes("De arbeidsmarkt is een toepassing van het evenwichtsmodel. Het loon is de prijs van arbeid. Het aanbod stijgt als het loon stijgt. De vraag daalt als het loon stijgt.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 12: Verstoringen van het evenwicht
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Verstoringen van het evenwicht");
    drawCard(s, 0.5, 1.1, 4.3, 3.4, C.dAmber, C.cream, "Technologische verandering", C.dAmber, [
      { text: "Robots \u2192 vraag naar arbeid verschuift naar links\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: "\u2022 Bedrijven hebben minder arbeiders nodig\n\u2022 Evenwichtsloon daalt\n\u2022 Sommige arbeiders raken zonder werk", options: { fontSize: 13, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(s, 5.2, 1.1, 4.3, 3.4, C.red, C.cream, "Wettelijk minimumloon", C.red, [
      { text: "Minimumloon boven evenwicht \u2192 werkloosheid\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: "\u2022 Aanbod: meer mensen willen werken (hoger loon)\n\u2022 Vraag: bedrijven willen minder (hoger loon)\n\u2022 Verschil = werkloosheid", options: { fontSize: 13, fontFace: "Arial", color: C.dark } },
    ]);
    s.addNotes("Twee verstoringen: technologie en minimumloon. Bij technologische verandering verschuift de vraagcurve naar links. Bij een minimumloon boven het evenwichtsloon is het aanbod groter dan de vraag, wat leidt tot werkloosheid.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 13: GRAFIEK — Arbeidsmarkt verschuiving ★ NIEUW
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Arbeidsmarkt: verschuiving vraaglijn");
    s.addImage({ data: g3, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("Robots nemen werk over. De vraag naar arbeid verschuift naar links: V1 naar V2. Het evenwichtsloon daalt van w1 naar w2 en de werkgelegenheid neemt af van L1 naar L2.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 14: Soorten werkloosheid
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Soorten werkloosheid");
    drawCard(s, 0.5, 1.1, 4.3, 3.3, C.dAmber, C.cream, "Structurele werkloosheid", C.dAmber, [
      { text: "Vaardigheden matchen niet met de vraag.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: "\u2022 Duurt lang\n\u2022 Oorzaak: technologische verandering\n\u2022 Oplossing: omscholing, onderwijs", options: { fontSize: 13, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(s, 5.2, 1.1, 4.3, 3.3, DOMAIN.color, C.cream, "Conjuncturele werkloosheid", DOMAIN.color, [
      { text: "Economie draait slecht \u2192 veel ontslagen.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: "\u2022 Tijdelijk\n\u2022 Oorzaak: recessie, dalende bestedingen\n\u2022 Verdwijnt als economie aantrekt", options: { fontSize: 13, fontFace: "Arial", color: C.dark } },
    ]);
    s.addNotes("Twee soorten werkloosheid. Structurele werkloosheid is langdurig, door een mismatch van vaardigheden. Conjuncturele werkloosheid is tijdelijk en hangt samen met de conjunctuur.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 15: Veelgemaakte fouten
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Veelgemaakte fouten");
    const fouten = [
      { title: '"MO = MK geldt alleen bij volledige mededinging"', body: "Onjuist! MO = MK geldt voor alle marktvormen. Het is altijd het winstmaximalisatiepunt." },
      { title: '"Evenwicht = eerlijk of optimaal"', body: "Nee, evenwicht is economisch neutraal \u2014 het zegt niets over rechtvaardigheid." },
      { title: '"MO = p in alle marktvormen"', body: "Nee, alleen bij volledige mededinging. Bij monopolie/oligopolie: MO < p." },
    ];
    const cardH = 1.05, gap = 0.15, startY = 1.05;
    fouten.forEach((f, i) => {
      const y = startY + i * (cardH + gap);
      s.addShape("rect", {
        x: 0.5, y, w: 9, h: cardH,
        fill: { color: C.lightRed }, rectRadius: 0.05, shadow: makeShadow(),
      });
      s.addShape("rect", { x: 0.5, y, w: 0.06, h: cardH, fill: { color: C.red } });
      s.addText(f.title, {
        x: 0.72, y: y + 0.08, w: 8.6, h: 0.35,
        fontSize: 14, fontFace: "Arial", color: C.red, bold: true, valign: "top",
      });
      s.addText(f.body, {
        x: 0.72, y: y + 0.42, w: 8.6, h: 0.55,
        fontSize: 13, fontFace: "Arial", color: C.dark, valign: "top",
      });
    });
    s.addNotes("Drie veelgemaakte fouten. Bespreek ze klassikaal: MO = MK is universeel, evenwicht is niet per se eerlijk, en MO = p geldt alleen bij volledige mededinging.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 16: Samenvatting
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Samenvatting", {
      x: 0.7, y: 0.5, w: 8.6, h: 0.7,
      fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
    });
    s.addText("Beheers je dit voordat je gaat oefenen?", {
      x: 0.7, y: 1.15, w: 8.6, h: 0.4,
      fontSize: 14, fontFace: "Arial", color: C.gray, italic: true,
    });
    const bullets = [
      "Marktevenwicht: Qv = Qa \u00e9n MO = MK",
      "MO = MK is winstmaximalisatie (alle marktvormen)",
      "Volledige mededinging: MO = p (prijsnemer)",
      "Monopolie/Oligopolie: MO < p (prijszetter)",
      "Arbeidsmarkt: loon regelt vraag en aanbod",
      "Verstoringen (minimumloon, robots) \u2192 werkloosheid",
    ];
    s.addText(
      bullets.map(b => ({ text: b, options: { fontSize: 15, fontFace: "Arial", color: C.white, bullet: true, breakType: "none" } })),
      { x: 0.7, y: 1.7, w: 8.6, h: 3.2, valign: "top", lineSpacingMultiple: 1.6, paraSpaceAfter: 6 }
    );
    s.addNotes("Loop deze zes punten na voordat leerlingen gaan oefenen. Controleer of ze de logica van MO = MK kunnen uitleggen en het verschil tussen prijsnemer en prijszetter begrijpen.");
  }

  // ── Save ──────────────────────────────────────────────────────────────
  const MODULE_ROOT = process.env.MODULE_ROOT ? path.resolve(process.env.MODULE_ROOT) : path.resolve(__dirname, "..");
  const outDir = path.resolve(MODULE_ROOT, "3.2 Hoofdstuk 2 - Marktvormen en hun marktevenwicht/3.2.1 Paragraaf 1 - Marktevenwicht/2. Leren");
  const outFile = path.join(outDir, "3.2.1 Marktevenwicht \u2013 presentatie.pptx");

  await pres.writeFile({ fileName: outFile });
  console.log("Saved:", outFile);
  saveSvgFiles(svgEntries, outDir);
  const stats = fs.statSync(outFile);
  console.log("Size:", (stats.size / 1024).toFixed(1), "KB");
  console.log("Slides: 16 (13 original + 3 graphs)");
}

build().catch(err => { console.error("ERROR:", err); process.exit(1); });
