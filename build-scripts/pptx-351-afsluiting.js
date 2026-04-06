/**
 * PPTX: 3.5.1 Afsluiting – presentatie met grafieken
 * Review presentation summarizing all Module 3 content.
 * 18 slides including 4 economic graphs (V/A equilibrium, VC vs monopoly,
 * tax/subsidy deadweight loss, comparative advantage PPF).
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/pptx-351-afsluiting.js
 */
process.env.NODE_PATH = "C:/Users/meije/AppData/Roaming/npm/node_modules";
require("module").Module._initPaths();

const PptxGenJS = require("pptxgenjs");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// ═══════════════════════════════════════════════════════════════════════════
// COLOR PALETTE
// ═══════════════════════════════════════════════════════════════════════════
const C = {
  primary: "7D3C98", primaryDk: "6C3483", primaryLt: "F4ECF7",
  navy: "1E2761", white: "FFFFFF", dark: "2D3748", gray: "718096",
  cream: "F9F6F1", rowAlt: "F7FAFC", borderGray: "CBD5E0",
  red: "D9534F", lightRed: "FDE8E8", lightGray: "F7F8FA",
  blue: "1A5276", blueLt: "EBF5FB",
  amber: "E67E22", amberLt: "FEF5E7",
  green: "1E8449", greenLt: "E8F8F0",
  teal: "117A65", tealLt: "E8F6F3",
};

const DOMAIN = { color: C.primary, light: C.primaryLt, dark: C.primaryDk };

// SVG colors (with #)
const GC = {
  demand: "#1A5276", supply: "#1E8449", supplyNew: "#E67E22",
  cost: "#E67E22", costAvg: "#D9534F", revenue: "#7B2D8E",
  axis: "#2D3748", grid: "#CBD5E0", label: "#718096",
  title: "#1E2761", bg: "#F7FAFC",
  surplus: "#85C1E9", prodSurplus: "#82E0AA",
  loss: "#F1948A", tax: "#F8C471",
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
// GRAPH 1: V/A EQUILIBRIUM WITH CS/PS SURPLUS AREAS
// V: p = -0.5Q + 50, A: p = 0.5Q + 10 → Q*=40, p*=30
// ═══════════════════════════════════════════════════════════════════════════
function buildVAEquilibriumSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 100, pMax = 55;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  // Curve endpoints — extend to Y-axis for surplus triangles
  const v1x = qToX(0), v1y = pToY(50);    // demand start (Y-axis)
  const v2x = qToX(100), v2y = pToY(0);   // demand end
  const a1x = qToX(0), a1y = pToY(10);    // supply start (Y-axis)
  const a2x = qToX(90), a2y = pToY(55);   // supply end
  const eqx = qToX(40), eqy = pToY(30);   // equilibrium

  // Surplus triangle vertices
  // CS: triangle (V at Y-axis, equilibrium, P* on Y-axis)
  const pStarY = pToY(30);
  const vAtYaxis = pToY(50);  // demand intercept
  const aAtYaxis = pToY(10);  // supply intercept

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Marktevenwicht met consumentensurplus en producentensurplus</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- CS area (blue triangle: demand intercept → equilibrium → P* on Y-axis) -->
  <polygon points="${px},${vAtYaxis} ${eqx},${eqy} ${px},${pStarY}" fill="${GC.surplus}" fill-opacity="0.45"/>
  <text x="${px + 25}" y="${(vAtYaxis + eqy + pStarY) / 3 + 5}" font-size="11" font-weight="bold" fill="${GC.demand}">CS</text>

  <!-- PS area (green triangle: supply intercept → equilibrium → P* on Y-axis) -->
  <polygon points="${px},${aAtYaxis} ${eqx},${eqy} ${px},${pStarY}" fill="${GC.prodSurplus}" fill-opacity="0.45"/>
  <text x="${px + 25}" y="${(aAtYaxis + eqy + pStarY) / 3 - 3}" font-size="11" font-weight="bold" fill="${GC.supply}">PS</text>

  <!-- Dashed reference lines -->
  <line x1="${px}" y1="${eqy}" x2="${eqx}" y2="${eqy}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <line x1="${eqx}" y1="${eqy}" x2="${eqx}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>

  <!-- Axis value labels -->
  <text x="72" y="${eqy+4}" text-anchor="end" font-size="11" fill="${GC.axis}">P* = 30</text>
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
// GRAPH 2: VOLKOMEN CONCURRENTIE VS MONOPOLIE (side-by-side)
// Left: VC — P=MO horizontal, MK rising, CS/PS areas
// Right: Monopolie — V, MO (double slope), MK, profit rect, smaller CS, DWL
// ═══════════════════════════════════════════════════════════════════════════
function buildVCvsMonopolieSVG() {
  // --- Left panel (Volkomen concurrentie) ---
  const lx = 55, ly = 55, lw = 270, lh = 225;
  const lqMax = 60, lpMax = 50;
  const lqToX = q => Math.round(lx + (q / lqMax) * lw);
  const lpToY = p => Math.round(ly + lh - (p / lpMax) * lh);

  // V: p = -0.6q + 42, A: p = 0.6q + 6
  // Eq: -0.6q+42 = 0.6q+6 → 1.2q=36 → q*=30, p*=24
  const lv1x = lqToX(0), lv1y = lpToY(42);
  const lv2x = lqToX(60), lv2y = lpToY(6);
  const la1x = lqToX(0), la1y = lpToY(6);
  const la2x = lqToX(60), la2y = lpToY(42);
  const leqx = lqToX(30), leqy = lpToY(24);
  const lpStarY = lpToY(24);

  // CS triangle: (lx, lpToY(42)) → (leqx, leqy) → (lx, lpStarY)
  // PS triangle: (lx, lpToY(6)) → (leqx, leqy) → (lx, lpStarY)

  // --- Right panel (Monopolie) ---
  const rx = 395, ry = 55, rw = 270, rh = 225;
  const rqMax = 60, rpMax = 50;
  const rqToX = q => Math.round(rx + (q / rqMax) * rw);
  const rpToY = p => Math.round(ry + rh - (p / rpMax) * rh);

  // V: p = -0.7q + 42, MO: p = -1.4q + 42, MK: p = 0.5q + 4
  // MO=MK: -1.4q+42 = 0.5q+4 → 1.9q=38 → q*=20, MO(20)=14, p*(V)= -0.7(20)+42=28
  // MK at q*=20: 0.5(20)+4=14
  const rv1x = rqToX(0), rv1y = rpToY(42);
  const rv2x = rqToX(60), rv2y = rpToY(0);
  const rmo1x = rqToX(0), rmo1y = rpToY(42);
  const rmo2x = rqToX(30), rmo2y = rpToY(0);
  const rmk1x = rqToX(0), rmk1y = rpToY(4);
  const rmk2x = rqToX(60), rmk2y = rpToY(34);
  const rqStar = rqToX(20);
  const rMOeqY = rpToY(14);  // MO=MK point
  const rpStarY = rpToY(28); // price from demand curve
  const rMKatQ = rpToY(14);  // MK at Q*

  // VC eq (if it were competitive): V=MK → -0.7q+42=0.5q+4 → 1.2q=38 → q=31.67, p=19.83
  const rVCeqx = rqToX(31.67);
  const rVCeqy = rpToY(19.83);

  // Monopoly CS: triangle from (rx, rpToY(42)) to (rqStar, rpStarY) to (rx, rpStarY)
  // Monopoly profit: rectangle from Q=0 to Q*=20, between p*=28 (top) and MK=14 (bottom)
  // DWL: triangle (rqStar, rpStarY) → (rVCeqx, rVCeqy) → (rqStar, rMKatQ)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- ═══ LEFT PANEL: Volkomen concurrentie ═══ -->
  <text x="${lx + lw/2}" y="25" text-anchor="middle" font-size="13" font-weight="bold" fill="${GC.title}">Volkomen concurrentie</text>

  <!-- Left axes -->
  <line x1="${lx}" y1="${ly+lh}" x2="${lx}" y2="${ly-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${lx}" y1="${ly+lh}" x2="${lx+lw+5}" y2="${ly+lh}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="170" transform="rotate(-90, 15, 170)" text-anchor="middle" font-size="10" fill="${GC.label}">P</text>
  <text x="${lx + lw/2}" y="305" text-anchor="middle" font-size="10" fill="${GC.label}">Q</text>
  <text x="${lx-8}" y="292" text-anchor="end" font-size="9" fill="${GC.label}">0</text>

  <!-- CS area (VC) -->
  <polygon points="${lx},${lv1y} ${leqx},${leqy} ${lx},${lpStarY}" fill="${GC.surplus}" fill-opacity="0.45"/>
  <text x="${lx+18}" y="${(lv1y + leqy + lpStarY)/3 + 3}" font-size="10" font-weight="bold" fill="${GC.demand}">CS</text>

  <!-- PS area (VC) -->
  <polygon points="${lx},${la1y} ${leqx},${leqy} ${lx},${lpStarY}" fill="${GC.prodSurplus}" fill-opacity="0.45"/>
  <text x="${lx+18}" y="${(la1y + leqy + lpStarY)/3 - 2}" font-size="10" font-weight="bold" fill="${GC.supply}">PS</text>

  <!-- Dashed reference lines -->
  <line x1="${lx}" y1="${leqy}" x2="${leqx}" y2="${leqy}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${leqx}" y1="${leqy}" x2="${leqx}" y2="${ly+lh}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Demand (V) and Supply (A) -->
  <line x1="${lv1x}" y1="${lv1y}" x2="${lv2x}" y2="${lv2y}" stroke="${GC.demand}" stroke-width="2"/>
  <text x="${lv2x-12}" y="${lv2y-8}" font-size="10" font-weight="bold" fill="${GC.demand}">V</text>
  <line x1="${la1x}" y1="${la1y}" x2="${la2x}" y2="${la2y}" stroke="${GC.supply}" stroke-width="2"/>
  <text x="${la2x-12}" y="${la2y+14}" font-size="10" font-weight="bold" fill="${GC.supply}">A</text>

  <!-- Equilibrium dot + labels -->
  <circle cx="${leqx}" cy="${leqy}" r="4" fill="${GC.demand}"/>
  <text x="${lx-8}" y="${leqy+4}" text-anchor="end" font-size="9" fill="${GC.axis}">P*</text>
  <text x="${leqx}" y="292" text-anchor="middle" font-size="9" fill="${GC.axis}">Q*</text>

  <!-- ═══ RIGHT PANEL: Monopolie ═══ -->
  <text x="${rx + rw/2}" y="25" text-anchor="middle" font-size="13" font-weight="bold" fill="${GC.title}">Monopolie</text>

  <!-- Right axes -->
  <line x1="${rx}" y1="${ry+rh}" x2="${rx}" y2="${ry-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${rx}" y1="${ry+rh}" x2="${rx+rw+5}" y2="${ry+rh}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="380" y="170" transform="rotate(-90, 380, 170)" text-anchor="middle" font-size="10" fill="${GC.label}">P</text>
  <text x="${rx + rw/2}" y="305" text-anchor="middle" font-size="10" fill="${GC.label}">Q</text>
  <text x="${rx-8}" y="292" text-anchor="end" font-size="9" fill="${GC.label}">0</text>

  <!-- Monopoly CS: smaller triangle above price -->
  <polygon points="${rx},${rv1y} ${rqStar},${rpStarY} ${rx},${rpStarY}" fill="${GC.surplus}" fill-opacity="0.45"/>
  <text x="${rx+12}" y="${(rv1y + rpStarY*2)/3 + 5}" font-size="9" font-weight="bold" fill="${GC.demand}">CS</text>

  <!-- Deadweight loss triangle -->
  <polygon points="${rqStar},${rpStarY} ${rVCeqx},${rVCeqy} ${rqStar},${rMKatQ}" fill="${GC.loss}" fill-opacity="0.45"/>
  <text x="${rqStar+15}" y="${(rpStarY + rVCeqy + rMKatQ)/3 + 2}" font-size="9" font-weight="bold" fill="#D9534F">DWL</text>

  <!-- Profit rectangle: between P* and MK at Q* -->
  <rect x="${rx}" y="${rpStarY}" width="${rqStar - rx}" height="${rMKatQ - rpStarY}" fill="${GC.tax}" fill-opacity="0.35"/>
  <text x="${(rx + rqStar)/2}" y="${(rpStarY + rMKatQ)/2 + 4}" text-anchor="middle" font-size="9" font-weight="bold" fill="#BA6A1C">Winst</text>

  <!-- Demand curve (V) -->
  <line x1="${rv1x}" y1="${rv1y}" x2="${rv2x}" y2="${rv2y}" stroke="${GC.demand}" stroke-width="2"/>
  <text x="${rv2x-12}" y="${rv2y-8}" font-size="10" font-weight="bold" fill="${GC.demand}">V</text>

  <!-- MO curve -->
  <line x1="${rmo1x}" y1="${rmo1y}" x2="${rmo2x}" y2="${rmo2y}" stroke="${GC.revenue}" stroke-width="2"/>
  <text x="${rmo2x+5}" y="${rmo2y-6}" font-size="10" font-weight="bold" fill="${GC.revenue}">MO</text>

  <!-- MK curve -->
  <line x1="${rmk1x}" y1="${rmk1y}" x2="${rmk2x}" y2="${rmk2y}" stroke="${GC.cost}" stroke-width="2"/>
  <text x="${rmk2x+5}" y="${rmk2y+4}" font-size="10" font-weight="bold" fill="${GC.cost}">MK</text>

  <!-- MO=MK dot -->
  <circle cx="${rqStar}" cy="${rMOeqY}" r="4" fill="${GC.revenue}"/>

  <!-- Dashed: MO=MK → up to V → left to P-axis → down to Q-axis -->
  <line x1="${rqStar}" y1="${rMOeqY}" x2="${rqStar}" y2="${rpStarY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${rx}" y1="${rpStarY}" x2="${rqStar}" y2="${rpStarY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${rqStar}" y1="${rpStarY}" x2="${rqStar}" y2="${ry+rh}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${rx}" y1="${rMKatQ}" x2="${rqStar}" y2="${rMKatQ}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="3,3"/>

  <!-- P* dot on demand curve -->
  <circle cx="${rqStar}" cy="${rpStarY}" r="4" fill="${GC.demand}"/>

  <!-- Axis labels -->
  <text x="${rx-8}" y="${rpStarY+4}" text-anchor="end" font-size="9" fill="${GC.axis}">P*</text>
  <text x="${rx-8}" y="${rMKatQ+4}" text-anchor="end" font-size="9" fill="${GC.axis}">MK*</text>
  <text x="${rqStar}" y="292" text-anchor="middle" font-size="9" fill="${GC.axis}">Q*</text>

  <!-- Annotation -->
  <text x="${rqStar+10}" y="${rpStarY-6}" font-size="9" fill="${GC.demand}" font-style="italic">P* van V!</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 3: TAX EFFECT ON MARKET — DEADWEIGHT LOSS
// V: p = -0.4Q + 40, A: p = 0.4Q + 8
// Eq1: Q*=40, p*=24
// Tax = 8 → A2: p = 0.4Q + 16 → Eq2: Q2=30, p2=28
// Producer receives: 28-8=20. DWL triangle between Q=30..40
// ═══════════════════════════════════════════════════════════════════════════
function buildTaxEffectSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 80, pMax = 45;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  // V: p = -0.4Q + 40
  const v1x = qToX(0), v1y = pToY(40);
  const v2x = qToX(80), v2y = pToY(8);

  // A (original): p = 0.4Q + 8
  const a1x = qToX(0), a1y = pToY(8);
  const a2x = qToX(80), a2y = pToY(40);

  // A2 (after tax): p = 0.4Q + 16
  const a2_1x = qToX(0), a2_1y = pToY(16);
  const a2_2x = qToX(72.5), a2_2y = pToY(45);

  // Eq1: Q*=40, p*=24
  const eq1x = qToX(40), eq1y = pToY(24);
  // Eq2: Q2=30, p2=28
  const eq2x = qToX(30), eq2y = pToY(28);
  // Producer price after tax at Q2=30: A(30) = 0.4*30+8 = 20
  const pprodY = pToY(20);

  // DWL triangle: (eq2x, eq2y) → (eq1x, eq1y) → (eq2x, pprodY) — wait, this isn't right
  // DWL is between old eq and new restricted area. It's the triangle:
  // top: point on demand at Q2=30: p=28, bottom: point on supply at Q2=30: p=20, right: old eq
  // Triangle: (eq2x, eq2y) → (eq1x, eq1y) → (eq2x, pprodY)
  // Actually DWL = triangle between the demand, original supply, from Q=30 to Q=40
  // Vertices: (eq2x, eq2y), (eq1x, eq1y), (eq2x, pprodY) — yes

  // Tax revenue rectangle: Q2 * tax = 30 * 8
  // Rectangle from Q=0 to Q2=30, between p_consumer=28 (top) and p_producer=20 (bottom)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Belasting op de markt: deadweight loss</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Tax revenue area (amber rectangle) -->
  <rect x="${px}" y="${eq2y}" width="${eq2x - px}" height="${pprodY - eq2y}" fill="${GC.tax}" fill-opacity="0.40"/>
  <text x="${(px + eq2x)/2}" y="${(eq2y + pprodY)/2 + 4}" text-anchor="middle" font-size="10" font-weight="bold" fill="#BA6A1C">Belasting-</text>
  <text x="${(px + eq2x)/2}" y="${(eq2y + pprodY)/2 + 16}" text-anchor="middle" font-size="10" font-weight="bold" fill="#BA6A1C">opbrengst</text>

  <!-- DWL triangle -->
  <polygon points="${eq2x},${eq2y} ${eq1x},${eq1y} ${eq2x},${pprodY}" fill="${GC.loss}" fill-opacity="0.50"/>
  <text x="${eq2x+18}" y="${eq1y}" font-size="10" font-weight="bold" fill="#D9534F">DWL</text>

  <!-- Old eq dashed lines -->
  <line x1="${px}" y1="${eq1y}" x2="${eq1x}" y2="${eq1y}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <line x1="${eq1x}" y1="${eq1y}" x2="${eq1x}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>

  <!-- New eq dashed lines -->
  <line x1="${px}" y1="${eq2y}" x2="${eq2x}" y2="${eq2y}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,2"/>
  <line x1="${eq2x}" y1="${eq2y}" x2="${eq2x}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,2"/>
  <line x1="${px}" y1="${pprodY}" x2="${eq2x}" y2="${pprodY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,2"/>

  <!-- Tax bracket left of Y-axis -->
  <line x1="65" y1="${eq2y}" x2="65" y2="${pprodY}" stroke="${GC.cost}" stroke-width="2"/>
  <line x1="60" y1="${eq2y}" x2="70" y2="${eq2y}" stroke="${GC.cost}" stroke-width="1.5"/>
  <line x1="60" y1="${pprodY}" x2="70" y2="${pprodY}" stroke="${GC.cost}" stroke-width="1.5"/>
  <text x="50" y="${(eq2y + pprodY)/2 + 4}" text-anchor="middle" font-size="9" font-weight="bold" fill="${GC.cost}">t</text>

  <!-- Demand curve (V) -->
  <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v2x-15}" y="${v2y-10}" font-size="12" font-weight="bold" fill="${GC.demand}">V</text>

  <!-- Original supply (A) — dashed -->
  <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${GC.supply}" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="${a2x-10}" y="${a2y+14}" font-size="11" font-weight="bold" fill="${GC.supply}">A</text>

  <!-- New supply after tax (A + t) -->
  <line x1="${a2_1x}" y1="${a2_1y}" x2="${a2_2x}" y2="${a2_2y}" stroke="${GC.supplyNew}" stroke-width="2.5"/>
  <text x="${a2_2x+5}" y="${a2_2y+4}" font-size="11" font-weight="bold" fill="${GC.supplyNew}">A + t</text>

  <!-- Equilibrium dots -->
  <circle cx="${eq1x}" cy="${eq1y}" r="4" fill="${GC.supply}" opacity="0.6"/>
  <circle cx="${eq2x}" cy="${eq2y}" r="5" fill="${GC.supplyNew}"/>

  <!-- Price labels -->
  <text x="72" y="${eq1y+4}" text-anchor="end" font-size="10" fill="${GC.label}">P\u2081</text>
  <text x="72" y="${eq2y+4}" text-anchor="end" font-size="10" fill="${GC.axis}">P\u2082</text>
  <text x="72" y="${pprodY+4}" text-anchor="end" font-size="10" fill="${GC.axis}">P\u2083</text>
  <text x="${eq1x}" y="325" text-anchor="middle" font-size="10" fill="${GC.label}">Q\u2081</text>
  <text x="${eq2x}" y="338" text-anchor="middle" font-size="10" fill="${GC.axis}">Q\u2082</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 4: COMPARATIVE ADVANTAGE — TWO PPF DIAGRAMS
// Netherlands: 10 cheese or 5 wine (per hour)
// Spain: 4 cheese or 8 wine (per hour)
// AK kaas NL = 5/10 = 0.5 wijn, AK kaas ES = 8/4 = 2 wijn
// NL: comp. voordeel kaas. ES: comp. voordeel wijn.
// ═══════════════════════════════════════════════════════════════════════════
function buildComparativeAdvantageSVG() {
  // Left panel: Nederland
  const lx = 55, ly = 55, lw = 250, lh = 225;
  // Right panel: Spanje
  const rx = 395, ry = 55, rw = 250, rh = 225;

  // NL: max 10 kaas (X) or 5 wijn (Y)
  const nlKaasMax = lx + lw;  // 10 kaas = full X
  const nlWijnMax = ly;        // 5 wijn = top Y
  const nlKaas0 = lx;
  const nlWijn0 = ly + lh;

  // ES: max 4 kaas (X) or 8 wijn (Y)
  const esKaasMax = rx + rw * (4/10);  // scale to same axis range for visual clarity
  const esWijnMax = ry;
  const esKaas0 = rx;
  const esWijn0 = ry + rh;

  // For visual clarity, use proportional coordinates
  // NL: PPF from (lx, ly) to (lx+lw, ly+lh)
  // (0 kaas, 5 wijn) = (lx, ly) → (10 kaas, 0 wijn) = (lx+lw, ly+lh)
  // ES: (0 kaas, 8 wijn) = (rx, ry) → (4 kaas, 0 wijn)
  // Scale: let both axes go to 10 for NL, and to 8 for ES

  const nlPPFx1 = lx, nlPPFy1 = ly; // 0 kaas, 5 wijn (top)
  const nlPPFx2 = lx + lw, nlPPFy2 = ly + lh; // 10 kaas, 0 wijn (right)

  const esPPFx1 = rx, esPPFy1 = ry; // 0 kaas, 8 wijn (top)
  const esPPFx2 = rx + rw * 0.5, esPPFy2 = ry + rh; // 4 kaas, 0 wijn

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- ═══ LEFT PANEL: Nederland ═══ -->
  <text x="${lx + lw/2}" y="25" text-anchor="middle" font-size="13" font-weight="bold" fill="${GC.title}">Nederland</text>

  <!-- Left axes -->
  <line x1="${lx}" y1="${ly+lh}" x2="${lx}" y2="${ly-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${lx}" y1="${ly+lh}" x2="${lx+lw+5}" y2="${ly+lh}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="${ly + lh/2}" transform="rotate(-90, 15, ${ly + lh/2})" text-anchor="middle" font-size="10" fill="${GC.label}">Wijn</text>
  <text x="${lx + lw/2}" y="305" text-anchor="middle" font-size="10" fill="${GC.label}">Kaas</text>
  <text x="${lx-8}" y="${ly+lh+4}" text-anchor="end" font-size="9" fill="${GC.label}">0</text>

  <!-- PPF line -->
  <line x1="${nlPPFx1}" y1="${nlPPFy1}" x2="${nlPPFx2}" y2="${nlPPFy2}" stroke="${GC.demand}" stroke-width="2.5"/>

  <!-- Axis endpoint labels -->
  <text x="${lx-8}" y="${nlPPFy1+4}" text-anchor="end" font-size="10" fill="${GC.axis}">5</text>
  <text x="${nlPPFx2}" y="${nlPPFy2+15}" text-anchor="middle" font-size="10" fill="${GC.axis}">10</text>

  <!-- Shaded area under PPF -->
  <polygon points="${lx},${ly+lh} ${nlPPFx1},${nlPPFy1} ${nlPPFx2},${nlPPFy2}" fill="${GC.surplus}" fill-opacity="0.20"/>

  <!-- AK annotation -->
  <text x="${lx + lw/2}" y="325" text-anchor="middle" font-size="10" fill="${GC.demand}" font-weight="bold">AK kaas = 0,5 wijn</text>

  <!-- ═══ RIGHT PANEL: Spanje ═══ -->
  <text x="${rx + rw/2}" y="25" text-anchor="middle" font-size="13" font-weight="bold" fill="${GC.title}">Spanje</text>

  <!-- Right axes -->
  <line x1="${rx}" y1="${ry+rh}" x2="${rx}" y2="${ry-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${rx}" y1="${ry+rh}" x2="${rx+rw+5}" y2="${ry+rh}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="380" y="${ry + rh/2}" transform="rotate(-90, 380, ${ry + rh/2})" text-anchor="middle" font-size="10" fill="${GC.label}">Wijn</text>
  <text x="${rx + rw/2}" y="305" text-anchor="middle" font-size="10" fill="${GC.label}">Kaas</text>
  <text x="${rx-8}" y="${ry+rh+4}" text-anchor="end" font-size="9" fill="${GC.label}">0</text>

  <!-- PPF line -->
  <line x1="${esPPFx1}" y1="${esPPFy1}" x2="${esPPFx2}" y2="${esPPFy2}" stroke="${GC.supply}" stroke-width="2.5"/>

  <!-- Axis endpoint labels -->
  <text x="${rx-8}" y="${esPPFy1+4}" text-anchor="end" font-size="10" fill="${GC.axis}">8</text>
  <text x="${esPPFx2}" y="${esPPFy2+15}" text-anchor="middle" font-size="10" fill="${GC.axis}">4</text>

  <!-- Shaded area under PPF -->
  <polygon points="${rx},${ry+rh} ${esPPFx1},${esPPFy1} ${esPPFx2},${esPPFy2}" fill="${GC.prodSurplus}" fill-opacity="0.20"/>

  <!-- AK annotation -->
  <text x="${rx + rw/2}" y="325" text-anchor="middle" font-size="10" fill="${GC.supply}" font-weight="bold">AK kaas = 2 wijn</text>

  <!-- Bottom summary -->
  <text x="360" y="348" text-anchor="middle" font-size="11" fill="${GC.title}" font-weight="bold">NL specialiseert in kaas (lage AK) \u2014 Spanje specialiseert in wijn (lage AK)</text>
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
    fontSize: 24, fontFace: "Arial", color: C.white, bold: true,
    valign: "middle",
  });
  return slide;
}

function drawCard(slide, x, y, w, h, accentColor, bgColor, title, titleColor, bodyParts, extra) {
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: bgColor },
    rectRadius: 0.05,
    shadow: makeShadow(),
  });
  slide.addShape("rect", {
    x, y, w: 0.06, h,
    fill: { color: accentColor },
  });
  slide.addText(title, {
    x: x + 0.2, y: y + 0.12, w: w - 0.35, h: 0.38,
    fontSize: 18, fontFace: "Arial", color: titleColor, bold: true,
    valign: "top",
  });
  if (bodyParts && bodyParts.length > 0) {
    slide.addText(bodyParts, {
      x: x + 0.2, y: y + 0.52, w: w - 0.35, h: h - 0.65,
      fontSize: 14, fontFace: "Arial", color: C.dark,
      valign: "top", align: "left",
      lineSpacingMultiple: 1.15,
      ...(extra || {}),
    });
  }
}

function flowChain(slide, steps, x, startY, w, color) {
  const boxH = 0.45;
  const gap = 0.18;
  steps.forEach((step, i) => {
    const y = startY + i * (boxH + gap);
    const isLast = i === steps.length - 1;
    slide.addShape("rect", {
      x, y, w, h: boxH,
      fill: { color: isLast ? color : C.cream },
      rectRadius: 0.05,
      shadow: makeShadow(),
      line: { color, width: 1 },
    });
    slide.addText(step, {
      x, y, w, h: boxH,
      fontSize: 14, fontFace: "Arial",
      color: isLast ? C.white : C.dark,
      bold: true, align: "center", valign: "middle",
    });
    if (i < steps.length - 1) {
      slide.addText("\u2193", {
        x, y: y + boxH, w, h: gap,
        fontSize: 16, fontFace: "Arial", color,
        align: "center", valign: "middle", bold: true,
      });
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD
// ═══════════════════════════════════════════════════════════════════════════
async function build() {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: "CUSTOM_10x5625", width: 10, height: 5.625 });
  pres.layout = "CUSTOM_10x5625";
  pres.author = "Economie VWO";
  pres.title = "3.5.1 Afsluiting";

  addTitleMaster(pres);
  addContentMaster(pres);

  // Generate graph PNGs
  const [g1Buf, g2Buf, g3Buf, g4Buf] = await Promise.all([
    svgToPng(buildVAEquilibriumSVG()),
    svgToPng(buildVCvsMonopolieSVG()),
    svgToPng(buildTaxEffectSVG()),
    svgToPng(buildComparativeAdvantageSVG()),
  ]);
  const g1 = pngToBase64(g1Buf);
  const g2 = pngToBase64(g2Buf);
  const g3 = pngToBase64(g3Buf);
  const g4 = pngToBase64(g4Buf);

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 1: Title
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide({ masterName: "TITLE_DARK" });
    slide.addText("Afsluiting Module 3", {
      x: 0.7, y: 1.0, w: 8.6, h: 1.4,
      fontSize: 40, fontFace: "Arial", color: C.white, bold: true,
    });
    slide.addText("Markt en overheid \u2014 alle theorie op een rij", {
      x: 0.7, y: 2.4, w: 8.6, h: 0.6,
      fontSize: 22, fontFace: "Arial", color: C.gray,
    });
    slide.addText("Hoofdstuk 5: Afsluiting  |  Economie VWO", {
      x: 0.7, y: 5.15, w: 8.6, h: 0.475,
      fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle",
    });
    slide.addNotes("Welkom bij de afsluitende les van Module 3. We lopen alle hoofdstukken door en zetten de belangrijkste theorie en grafieken op een rij. Geen oefeningen vandaag \u2014 puur herhaling van concepten.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 2: Leerdoelen
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Wat moet je kennen en kunnen?");
    slide.addText("Leerdoelen Module 3", {
      x: 0.5, y: 1.0, w: 9, h: 0.4,
      fontSize: 20, fontFace: "Arial", color: DOMAIN.color, bold: true,
    });
    const bullets = [
      "Vraag en aanbod: evenwichtsprijs en -hoeveelheid bepalen",
      "Consumentensurplus en producentensurplus berekenen en grafisch tonen",
      "De vier marktvormen herkennen en hun kenmerken vergelijken",
      "MO = MK als winstmaximalisatieregel toepassen",
      "Marktfalen verklaren en overheidsingrijpen beoordelen",
      "Belastingeffecten grafisch analyseren (incl. deadweight loss)",
      "Comparatief voordeel berekenen en handelspolitiek analyseren",
    ];
    slide.addText(
      bullets.map(b => ({
        text: b,
        options: { fontSize: 15, fontFace: "Arial", color: C.dark, bullet: true, breakType: "none" },
      })),
      { x: 0.7, y: 1.5, w: 8.6, h: 3.6, valign: "top", lineSpacingMultiple: 1.45, paraSpaceAfter: 6 }
    );
    slide.addNotes("Dit zijn de zeven kernvaardigheden van de hele module. Gebruik dit als checklist: beheers je elk punt? Zo niet, ga terug naar het betreffende hoofdstuk.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 3: H1 Markten — Kernconcepten
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "H1 \u2014 Markten: kernconcepten");
    drawCard(slide, 0.5, 1.1, 4.3, 3.5, C.blue, C.blueLt, "Marktstructuur", C.blue, [
      { text: "Concreet vs abstract\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Homogeen vs heterogeen product\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Toetredingsdrempels\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Netwerksectoren", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
    ]);
    // Right side: reasoning chain
    slide.addText("Redeneerketen", {
      x: 5.2, y: 1.0, w: 4.3, h: 0.35,
      fontSize: 16, fontFace: "Arial", color: C.blue, bold: true, align: "center",
    });
    flowChain(slide, [
      "Toetredingsdrempels",
      "Aantal aanbieders",
      "Mate van concurrentie",
      "Prijsniveau",
    ], 5.5, 1.5, 3.7, C.blue);
    slide.addNotes("Hoofdstuk 1 introduceert de bouwstenen: wat is een markt, welke soorten zijn er, en hoe bepalen drempels het aantal aanbieders en de prijs?");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 4: H1 — Vraag en aanbod theorie
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "H1 \u2014 Vraag en aanbod: theorie");
    drawCard(slide, 0.5, 1.1, 4.3, 3.5, C.blue, C.blueLt, "Vraaglijn (V)", C.blue, [
      { text: "Dalend verloop: P\u2191 \u2192 Qv\u2193\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Beweging l\u00e1ngs de lijn:\n  prijsverandering\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Verschuiving v\u00e1n de lijn:\n  inkomen, voorkeur, prijs\n  substituten/complementen", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
    ]);
    drawCard(slide, 5.2, 1.1, 4.3, 3.5, C.blue, C.blueLt, "Aanbodlijn (A)", C.blue, [
      { text: "Stijgend verloop: P\u2191 \u2192 Qa\u2191\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Beweging l\u00e1ngs de lijn:\n  prijsverandering\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Verschuiving v\u00e1n de lijn:\n  technologie, kosten,\n  aantal aanbieders", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
    ]);
    slide.addNotes("Basiswetten van vraag en aanbod. Het cruciale onderscheid: beweging langs de lijn (prijseffect) versus verschuiving van de lijn (andere factoren). Dit onderscheid is een klassieke examenvraag.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 5: GRAPH — V/A Equilibrium with surplus areas
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "H1 \u2014 Marktevenwicht met surplus");
    slide.addImage({
      data: g1,
      x: 0.75, y: 0.9, w: 8.5, h: 4.25,
    });
    slide.addNotes("V/A-diagram met surplus. CS (blauw) = driehoek boven de prijs, onder de vraaglijn. PS (groen) = driehoek onder de prijs, boven de aanbodlijn. Bij volkomen concurrentie is het totale surplus (CS + PS) maximaal.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 6: H2 — Marktvormen overzicht
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "H2 \u2014 De vier marktvormen");
    const forms = [
      { name: "Volkomen\nconcurrentie", color: C.amber, bg: C.amberLt, sub: "Veel aanbieders\nHomogeen product\nGeen drempels" },
      { name: "Monopolistische\nconcurrentie", color: C.amber, bg: C.amberLt, sub: "Veel aanbieders\nHeterogeen product\nLage drempels" },
      { name: "Oligopolie", color: C.amber, bg: C.amberLt, sub: "Weinig aanbieders\nHomogeen/heterogeen\nHoge drempels" },
      { name: "Monopolie", color: C.amber, bg: C.amberLt, sub: "E\u00e9n aanbieder\nUniek product\nOnoverkomelijke\ndrempels" },
    ];
    const cardW = 2.1;
    const gap = 0.2;
    const startX = 0.5;
    forms.forEach((f, i) => {
      const x = startX + i * (cardW + gap);
      slide.addShape("rect", {
        x, y: 1.1, w: cardW, h: 3.6,
        fill: { color: f.bg }, rectRadius: 0.05, shadow: makeShadow(),
      });
      slide.addShape("rect", {
        x, y: 1.1, w: cardW, h: 0.06,
        fill: { color: f.color },
      });
      slide.addText(f.name, {
        x, y: 1.2, w: cardW, h: 0.9,
        fontSize: 14, fontFace: "Arial", color: f.color, bold: true,
        align: "center", valign: "middle",
      });
      slide.addShape("line", {
        x: x + 0.2, y: 2.15, w: cardW - 0.4, h: 0,
        line: { color: C.borderGray, width: 0.5 },
      });
      slide.addText(f.sub, {
        x: x + 0.15, y: 2.25, w: cardW - 0.3, h: 2.3,
        fontSize: 12, fontFace: "Arial", color: C.dark,
        valign: "top", align: "center", lineSpacingMultiple: 1.4,
      });
    });
    slide.addNotes("De vier marktvormen op een rij. Van links naar rechts neemt de marktmacht toe. De kernvraag: hoeveel aanbieders, welk product, welke drempels?");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 7: H2 — MO = MK regel
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "H2 \u2014 Winstmaximalisatie: MO = MK");
    drawCard(slide, 0.5, 1.1, 9, 1.6, C.amber, C.amberLt, "De gouden regel", C.amber, [
      { text: "Maximale winst bij ", options: { fontSize: 16, fontFace: "Arial", color: C.dark } },
      { text: "MO = MK", options: { fontSize: 16, fontFace: "Consolas", color: C.amber, bold: true } },
      { text: "\nMarginale opbrengst = marginale kosten \u2192 optimale hoeveelheid Q*", options: { fontSize: 14, fontFace: "Arial", color: C.gray } },
    ]);
    drawCard(slide, 0.5, 3.0, 4.3, 1.8, C.amber, C.cream, "Volkomen concurrentie", C.amber, [
      { text: "MO = prijs (prijsnemer)\n", options: { fontSize: 13, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Horizontale prijslijn = MO\n", options: { fontSize: 13, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Winst = 0 op lange termijn", options: { fontSize: 13, fontFace: "Arial", color: C.dark, bullet: true } },
    ]);
    drawCard(slide, 5.2, 3.0, 4.3, 1.8, C.amber, C.cream, "Monopolie / oligopolie", C.amber, [
      { text: "MO < prijs (prijszetter)\n", options: { fontSize: 13, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "MO daalt sneller dan V\n", options: { fontSize: 13, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Winst > 0 mogelijk op LT", options: { fontSize: 13, fontFace: "Arial", color: C.dark, bullet: true } },
    ]);
    slide.addNotes("MO = MK is de universele regel. Het verschil: bij volkomen concurrentie is MO gelijk aan de prijs. Bij monopolie/oligopolie is MO lager dan de prijs, want extra verkoop verlaagt de prijs op alle eenheden.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 8: GRAPH — Volkomen concurrentie vs monopolie
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "H2 \u2014 Grafiek: VC vs monopolie");
    slide.addImage({
      data: g2,
      x: 0.75, y: 0.9, w: 8.5, h: 4.25,
    });
    slide.addNotes("Links: volkomen concurrentie met maximaal surplus (CS+PS). Rechts: monopolie produceert minder (Q*) tegen hogere prijs (P*). Gevolg: kleiner CS, winstrechthoek voor monopolist, en deadweight loss (DWL) \u2014 welvaartsverlies door niet-gerealiseerde transacties.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 9: H2 — Surplus uitleg
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "H2 \u2014 Surplus: theorie");
    drawCard(slide, 0.5, 1.1, 4.3, 3.5, C.amber, C.amberLt, "Consumentensurplus (CS)", C.amber, [
      { text: "Verschil tussen wat consumenten\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "willen betalen", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: " en de\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "marktprijs", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: ".\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Driehoek boven P*, onder V\n", options: { fontSize: 13, fontFace: "Arial", color: C.gray } },
      { text: "CS = \u00bd \u00d7 Q* \u00d7 (Pmax \u2212 P*)", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
    ]);
    drawCard(slide, 5.2, 1.1, 4.3, 3.5, C.amber, C.amberLt, "Producentensurplus (PS)", C.amber, [
      { text: "Verschil tussen de ", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "marktprijs", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: "\nen de ", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "minimale prijs", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: " waarvoor\naanbieders willen verkopen.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Driehoek onder P*, boven A\n", options: { fontSize: 13, fontFace: "Arial", color: C.gray } },
      { text: "PS = \u00bd \u00d7 Q* \u00d7 (P* \u2212 Pmin)", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
    ]);
    slide.addNotes("Surplus = het extra voordeel boven wat je minimaal nodig hebt. Samen vormen CS en PS het totale welvaartssurplus. Bij volkomen concurrentie is dit maximaal.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 10: H3 — Marktfalen
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "H3 \u2014 Marktfalen: vier vormen");
    const items = [
      { title: "Externe effecten", desc: "Kosten/baten buiten de marktprijs\n(vervuiling, vaccinatie)" },
      { title: "Collectieve goederen", desc: "Niet-uitsluitbaar, niet-rivaliserend\n(defensie, dijken)" },
      { title: "Informatiegebreken", desc: "Ongelijke informatie tussen\nkoper en verkoper (asymmetrie)" },
      { title: "Marktmacht", desc: "Monopolie/oligopolie leidt tot\nhogere prijzen, minder welvaart" },
    ];
    const cardW = 4.3;
    const cardH = 1.5;
    items.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.5 + col * 4.7;
      const y = 1.05 + row * 1.7;
      drawCard(slide, x, y, cardW, cardH, C.green, C.greenLt, item.title, C.green, [
        { text: item.desc, options: { fontSize: 13, fontFace: "Arial", color: C.dark } },
      ]);
    });
    slide.addNotes("De vier vormen van marktfalen: externe effecten, collectieve goederen, informatiegebreken en marktmacht. Bij elk type grijpt de overheid op een andere manier in.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 11: H3 — Beleidsinstrumenten
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "H3 \u2014 Overheidsingrijpen: theorie");
    const instruments = [
      { title: "Belastingen / heffingen", desc: "Negatieve externe effecten beprijzen \u2192 aanbodlijn omhoog" },
      { title: "Subsidies", desc: "Positieve externe effecten stimuleren \u2192 aanbodlijn omlaag" },
      { title: "Regulering", desc: "Regels, vergunningen, mededingingsrecht" },
      { title: "Overheidsproductie", desc: "Zelf aanbieden van collectieve goederen" },
      { title: "Minimum-/maximumprijzen", desc: "Directe prijsinterventie op de markt" },
    ];
    const startY = 1.05;
    const boxH = 0.7;
    const gap = 0.12;
    instruments.forEach((inst, i) => {
      const y = startY + i * (boxH + gap);
      slide.addShape("rect", {
        x: 0.5, y, w: 9, h: boxH,
        fill: { color: i % 2 === 0 ? C.greenLt : C.white },
        rectRadius: 0.03,
      });
      slide.addShape("rect", {
        x: 0.5, y, w: 0.06, h: boxH,
        fill: { color: C.green },
      });
      slide.addText(inst.title, {
        x: 0.72, y, w: 3.5, h: boxH,
        fontSize: 14, fontFace: "Arial", color: C.green, bold: true,
        valign: "middle",
      });
      slide.addText(inst.desc, {
        x: 4.3, y, w: 5, h: boxH,
        fontSize: 13, fontFace: "Arial", color: C.dark,
        valign: "middle",
      });
    });
    slide.addNotes("Vijf instrumenten die de overheid kan inzetten. Het kernidee: de overheid corrigeert de markt waar deze faalt. Belastingen en subsidies werken via de V/A-grafiek.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 12: GRAPH — Tax effect with deadweight loss
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "H3 \u2014 Grafiek: belastingeffect op de markt");
    slide.addImage({
      data: g3,
      x: 0.75, y: 0.9, w: 8.5, h: 4.25,
    });
    slide.addNotes("Belasting verschuift de aanbodlijn omhoog (A \u2192 A+t). Gevolgen: hogere consumentenprijs (P2), lagere producentenprijs (P3), minder transacties (Q2 < Q1). De overheid int belastingopbrengst (gele rechthoek). Het rode driehoekje (DWL) = welvaartsverlies door niet-gerealiseerde transacties.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 13: H4 — Comparatief voordeel theorie
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "H4 \u2014 Comparatief voordeel: theorie");
    drawCard(slide, 0.5, 1.1, 9, 1.6, C.teal, C.tealLt, "Kernprincipe", C.teal, [
      { text: "Een land specialiseert in het product met de ", options: { fontSize: 15, fontFace: "Arial", color: C.dark } },
      { text: "laagste alternatieve kosten", options: { fontSize: 15, fontFace: "Arial", color: C.teal, bold: true } },
      { text: ".\nOok als het in alles slechter is \u2192 handel is altijd voordelig.", options: { fontSize: 14, fontFace: "Arial", color: C.gray } },
    ]);
    slide.addText("Rekenstappen", {
      x: 0.5, y: 3.0, w: 9, h: 0.35,
      fontSize: 16, fontFace: "Arial", color: C.teal, bold: true,
    });
    const steps = [
      "1.  Bereken de alternatieve kosten per product per land",
      "2.  Vergelijk: laagste AK \u2192 comparatief voordeel",
      "3.  Elk land specialiseert in zijn voordeel-product",
      "4.  Ruilvoet ligt tussen beide alternatieve kosten",
    ];
    slide.addText(
      steps.map(s => ({
        text: s + "\n",
        options: { fontSize: 14, fontFace: "Arial", color: C.dark },
      })),
      { x: 0.7, y: 3.4, w: 8.6, h: 1.8, valign: "top", lineSpacingMultiple: 1.5 }
    );
    slide.addNotes("Comparatief voordeel is het kernargument voor internationale handel. Belangrijk: het gaat om alternatieve kosten, NIET om absolute productiviteit.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 14: GRAPH — Comparative advantage PPF
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "H4 \u2014 Grafiek: transformatiecurves");
    slide.addImage({
      data: g4,
      x: 0.75, y: 0.9, w: 8.5, h: 4.25,
    });
    slide.addNotes("Twee PPF-diagrammen. Nederland: steil (veel kaas, weinig wijn) \u2192 lage AK kaas (0,5 wijn). Spanje: vlak (weinig kaas, veel wijn) \u2192 lage AK wijn. Elk land specialiseert in het product met de laagste alternatieve kosten.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 15: H4 — Handelspolitiek
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "H4 \u2014 Vrijhandel vs protectionisme");
    drawCard(slide, 0.5, 1.1, 4.3, 3.5, C.teal, C.tealLt, "Vrijhandel", C.teal, [
      { text: "Geen handelsbelemmeringen\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Maximale welvaart (theorie)\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "EU interne markt\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "WTO bevordert vrijhandel", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
    ]);
    drawCard(slide, 5.2, 1.1, 4.3, 3.5, C.teal, C.tealLt, "Protectionisme", C.teal, [
      { text: "Invoertarieven / quota\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Bescherming eigen industrie\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Hogere prijzen consument\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Welvaartsverlies (deadweight loss)", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
    ]);
    slide.addNotes("Het debat vrijhandel vs protectionisme. Vrijhandel maximalisert welvaart maar kan sectoren schaden. Protectionisme beschermt, maar tegen een prijs.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 16: Vergelijkingstabel marktvormen (1/2)
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Vergelijkingstabel marktvormen (1/2)");
    const headers = ["", "Volkomen\nconcurrentie", "Monopolistische\nconcurrentie", "Oligopolie", "Monopolie"];
    const rows = [
      ["Aanbieders", "Zeer veel", "Veel", "Weinig", "E\u00e9n"],
      ["Product", "Homogeen", "Heterogeen", "Hom./het.", "Uniek"],
      ["Drempels", "Geen", "Laag", "Hoog", "Absoluut"],
      ["Prijszetting", "Prijsnemer", "Beperkte\nmarge", "Strategisch", "Prijszetter"],
    ];
    const colW = [1.8, 2.0, 2.0, 2.0, 2.0];
    const rowH = 0.65;
    let y = 1.05;
    let x = 0.1;
    headers.forEach((h, i) => {
      slide.addShape("rect", { x, y, w: colW[i], h: 0.55, fill: { color: DOMAIN.color } });
      slide.addText(h, { x, y, w: colW[i], h: 0.55, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });
      x += colW[i] + 0.05;
    });
    y += 0.6;
    rows.forEach((row, ri) => {
      x = 0.1;
      row.forEach((cell, ci) => {
        const bg = ci === 0 ? DOMAIN.light : (ri % 2 === 0 ? C.rowAlt : C.white);
        slide.addShape("rect", { x, y, w: colW[ci], h: rowH, fill: { color: bg } });
        slide.addText(cell, { x, y, w: colW[ci], h: rowH, fontSize: ci === 0 ? 12 : 11, fontFace: "Arial", color: ci === 0 ? DOMAIN.color : C.dark, bold: ci === 0, align: "center", valign: "middle" });
        x += colW[ci] + 0.05;
      });
      y += rowH + 0.02;
    });
    slide.addNotes("Eerste deel vergelijkingstabel: structuurkenmerken. Dit is examenstof \u2014 je moet elke marktvorm snel kunnen herkennen aan deze vier kenmerken.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 17: Vergelijkingstabel marktvormen (2/2)
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Vergelijkingstabel marktvormen (2/2)");
    const headers = ["", "Volkomen\nconcurrentie", "Monopolistische\nconcurrentie", "Oligopolie", "Monopolie"];
    const rows = [
      ["Winst LT", "Normaal (0)", "Normaal (0)", "> 0 mogelijk", "> 0 mogelijk"],
      ["MO vs P", "MO = P", "MO < P", "MO < P", "MO < P"],
      ["Voorbeeld", "Groentemarkt", "Restaurants", "Telecom", "NS (spoor)"],
      ["Effici\u00ebntie", "Maximaal", "Bijna max.", "Beperkt", "Minimaal"],
    ];
    const colW = [1.8, 2.0, 2.0, 2.0, 2.0];
    const rowH = 0.65;
    let y = 1.05;
    let x = 0.1;
    headers.forEach((h, i) => {
      slide.addShape("rect", { x, y, w: colW[i], h: 0.55, fill: { color: DOMAIN.color } });
      slide.addText(h, { x, y, w: colW[i], h: 0.55, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });
      x += colW[i] + 0.05;
    });
    y += 0.6;
    rows.forEach((row, ri) => {
      x = 0.1;
      row.forEach((cell, ci) => {
        const bg = ci === 0 ? DOMAIN.light : (ri % 2 === 0 ? C.rowAlt : C.white);
        slide.addShape("rect", { x, y, w: colW[ci], h: rowH, fill: { color: bg } });
        slide.addText(cell, { x, y, w: colW[ci], h: rowH, fontSize: ci === 0 ? 12 : 11, fontFace: "Arial", color: ci === 0 ? DOMAIN.color : C.dark, bold: ci === 0, align: "center", valign: "middle" });
        x += colW[ci] + 0.05;
      });
      y += rowH + 0.02;
    });
    slide.addNotes("Tweede deel: uitkomsten en effici\u00ebntie. Let op MO vs P \u2014 dit bepaalt of een bedrijf prijsnemer of prijszetter is. Onthoud: alleen bij volkomen concurrentie geldt MO = P.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 18: Samenvatting / Checklist
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide({ masterName: "TITLE_DARK" });
    slide.addText("Checklist: beheers je alles?", {
      x: 0.7, y: 0.4, w: 8.6, h: 0.7,
      fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
    });
    const checks = [
      "\u2610  V/A-diagram tekenen met evenwicht, CS en PS",
      "\u2610  Vier marktvormen herkennen en kenmerken noemen",
      "\u2610  MO = MK toepassen bij prijsnemer \u00e9n prijszetter",
      "\u2610  Surplus berekenen (driehoeksformule)",
      "\u2610  Monopoliewinst en deadweight loss in grafiek aanwijzen",
      "\u2610  Vier vormen van marktfalen uitleggen",
      "\u2610  Belastingeffect grafisch tonen (verschuiving + DWL)",
      "\u2610  Comparatief voordeel berekenen en ruilvoet bepalen",
      "\u2610  Vrijhandel vs protectionisme afwegen met argumenten",
    ];
    slide.addText(
      checks.map(c => ({
        text: c + "\n",
        options: { fontSize: 14, fontFace: "Arial", color: C.white },
      })),
      { x: 0.7, y: 1.3, w: 8.6, h: 4.0, valign: "top", lineSpacingMultiple: 1.45 }
    );
    slide.addNotes("Sluitdia. Laat leerlingen deze checklist zelf invullen. Alles aangevinkt? Dan beheers je de theorie. Open vakjes? Ga die onderwerpen opnieuw bestuderen.");
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  const outDir = "C:/Projects/4veco/3. Module 3 - Markt en overheid/3.5 Hoofdstuk 5 - Afsluiting/3.5.1 Paragraaf 1 - Afsluiting/2. Leren";
  const outFile = path.join(outDir, "3.5.1 Afsluiting \u2013 presentatie.pptx");

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
    console.log("Created directory:", outDir);
  }

  await pres.writeFile({ fileName: outFile });
  console.log("Presentation saved to:", outFile);

  const stats = fs.statSync(outFile);
  console.log("File size:", (stats.size / 1024).toFixed(1), "KB");
  console.log("Slides: 18 (incl. 4 graph slides)");
}

build().catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});
