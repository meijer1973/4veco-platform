/**
 * PPTX: 3.5.2 Naar het examen – presentatie met grafieken
 * Exam preparation presentation: question types, strategies, common mistakes.
 * 18 slides including 4 economic graphs (V/A equilibrium calculation,
 * monopoly profit maximization, tax effect DWL, surplus & welfare loss).
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/pptx-352-naar-het-examen.js
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
// GRAPH 1: V/A EQUILIBRIUM — BEREKENING
// Qv = -Q + 80, Qa = 2Q - 40 → Qv=Qa: -Q+80 = 2Q-40 → 3Q=120 → Q*=40, p*=40
// ═══════════════════════════════════════════════════════════════════════════
function buildVACalculationSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 60, pMax = 110;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  // V: p = -2Q + 100 → intercepts: (0,100) and (50,0)
  const v1x = qToX(0), v1y = pToY(100);
  const v2x = qToX(50), v2y = pToY(0);
  // A: p = Q + 10 → starts at (0,10), positive Y-intercept
  const a1x = qToX(0), a1y = pToY(10);
  const a2x = qToX(55), a2y = pToY(65);
  // Equilibrium: -2Q + 100 = Q + 10 → 3Q = 90 → Q*=30, p*=40
  const eqx = qToX(30), eqy = pToY(40);

  // Surplus areas
  const pStarY = pToY(40);
  const vAtYaxis = pToY(100);  // demand Y-intercept
  const aAtYaxis = pToY(10);   // supply Y-intercept

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Marktevenwicht berekenen: Qv = Qa</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="${px + pw/2}" y="350" text-anchor="middle" font-size="12" fill="${GC.label}">Hoeveelheid (Q)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- CS area: triangle between demand Y-intercept, equilibrium, and p* on Y-axis -->
  <polygon points="${px},${vAtYaxis} ${eqx},${eqy} ${px},${pStarY}" fill="${GC.surplus}" fill-opacity="0.40"/>
  <text x="${px + 25}" y="${(vAtYaxis + pStarY) / 2 + 5}" font-size="11" font-weight="bold" fill="${GC.demand}">CS</text>

  <!-- PS area: triangle between supply Y-intercept, equilibrium, and p* on Y-axis -->
  <polygon points="${px},${aAtYaxis} ${eqx},${eqy} ${px},${pStarY}" fill="${GC.prodSurplus}" fill-opacity="0.40"/>
  <text x="${px + 25}" y="${(aAtYaxis + pStarY) / 2 - 3}" font-size="11" font-weight="bold" fill="${GC.supply}">PS</text>

  <!-- Dashed reference lines -->
  <line x1="${px}" y1="${eqy}" x2="${eqx}" y2="${eqy}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <line x1="${eqx}" y1="${eqy}" x2="${eqx}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>

  <!-- Axis value labels -->
  <text x="72" y="${eqy+4}" text-anchor="end" font-size="11" fill="${GC.axis}">P* = 40</text>
  <text x="${eqx}" y="325" text-anchor="middle" font-size="11" fill="${GC.axis}">Q* = 30</text>
  <text x="72" y="${v1y+4}" text-anchor="end" font-size="10" fill="${GC.label}">100</text>
  <text x="72" y="${a1y+4}" text-anchor="end" font-size="10" fill="${GC.label}">10</text>

  <!-- Demand curve (V) -->
  <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v2x-15}" y="${v2y-12}" font-size="12" font-weight="bold" fill="${GC.demand}">V</text>

  <!-- Supply curve (A) -->
  <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${GC.supply}" stroke-width="2.5"/>
  <text x="${a2x+8}" y="${a2y+4}" font-size="12" font-weight="bold" fill="${GC.supply}">A</text>

  <!-- Equilibrium dot -->
  <circle cx="${eqx}" cy="${eqy}" r="5" fill="${GC.demand}"/>

  <!-- Calculation annotation -->
  <text x="530" y="75" font-size="11" fill="${GC.title}" font-weight="bold">Berekening:</text>
  <text x="530" y="95" font-size="10" fill="${GC.axis}">Qv: p = \u22122Q + 100</text>
  <text x="530" y="112" font-size="10" fill="${GC.axis}">Qa: p = Q + 10</text>
  <text x="530" y="132" font-size="10" fill="${GC.axis}" font-weight="bold">Qv = Qa:</text>
  <text x="530" y="149" font-size="10" fill="${GC.axis}">\u22122Q+100 = Q+10</text>
  <text x="530" y="166" font-size="10" fill="${GC.axis}">3Q = 90 \u2192 Q* = 30</text>
  <text x="530" y="183" font-size="10" fill="${GC.axis}">p* = 30+10 = 40</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 2: MONOPOLIE WINSTMAXIMALISATIE
// V: p = -0.5Q + 50, MO: p = -Q + 50, MK: p = 0.5Q + 10
// MO=MK: -Q+50 = 0.5Q+10 → 1.5Q=40 → Q*≈26.7
// p*(V) = -0.5(26.7)+50 = 36.65, MK(26.7) = 0.5(26.7)+10 = 23.35
// ═══════════════════════════════════════════════════════════════════════════
function buildMonopolyProfitSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 110, pMax = 55;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  // V: p = -0.5Q + 50
  const v1x = qToX(0), v1y = pToY(50);
  const v2x = qToX(100), v2y = pToY(0);
  // MO: p = -Q + 50
  const mo1x = qToX(0), mo1y = pToY(50);
  const mo2x = qToX(50), mo2y = pToY(0);
  // MK: p = 0.5Q + 10
  const mk1x = qToX(0), mk1y = pToY(10);
  const mk2x = qToX(90), mk2y = pToY(55);

  const qStar = 26.7;
  const pStar = 36.65;
  const mkAtQ = 23.35;
  const qStarX = qToX(qStar);
  const pStarY = pToY(pStar);
  const mkAtQY = pToY(mkAtQ);
  const moEqY = pToY(23.35);

  // VC equilibrium: V=MK → Q=40, p=30
  const vcEqX = qToX(40);
  const vcEqY = pToY(30);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Monopolie: winstmaximalisatie bij MO = MK</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs / Kosten</text>
  <text x="${px + pw/2}" y="350" text-anchor="middle" font-size="12" fill="${GC.label}">Hoeveelheid (Q)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Profit rectangle -->
  <rect x="${px}" y="${pStarY}" width="${qStarX - px}" height="${mkAtQY - pStarY}" fill="${GC.tax}" fill-opacity="0.35"/>
  <text x="${(px + qStarX)/2}" y="${(pStarY + mkAtQY)/2 + 4}" text-anchor="middle" font-size="11" font-weight="bold" fill="#BA6A1C">Winst</text>

  <!-- DWL triangle -->
  <polygon points="${qStarX},${pStarY} ${vcEqX},${vcEqY} ${qStarX},${mkAtQY}" fill="${GC.loss}" fill-opacity="0.45"/>
  <text x="${qStarX+18}" y="${vcEqY}" font-size="10" font-weight="bold" fill="#D9534F">DWL</text>

  <!-- Dashed reference lines -->
  <line x1="${px}" y1="${pStarY}" x2="${qStarX}" y2="${pStarY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <line x1="${qStarX}" y1="${moEqY}" x2="${qStarX}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <line x1="${qStarX}" y1="${moEqY}" x2="${qStarX}" y2="${pStarY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${mkAtQY}" x2="${qStarX}" y2="${mkAtQY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="3,3"/>

  <!-- Demand curve (V) -->
  <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v2x-15}" y="${v2y-12}" font-size="12" font-weight="bold" fill="${GC.demand}">V</text>

  <!-- MO curve -->
  <line x1="${mo1x}" y1="${mo1y}" x2="${mo2x}" y2="${mo2y}" stroke="${GC.revenue}" stroke-width="2"/>
  <text x="${mo2x+5}" y="${mo2y-6}" font-size="12" font-weight="bold" fill="${GC.revenue}">MO</text>

  <!-- MK curve -->
  <line x1="${mk1x}" y1="${mk1y}" x2="${mk2x}" y2="${mk2y}" stroke="${GC.cost}" stroke-width="2.5"/>
  <text x="${mk2x+5}" y="${mk2y+4}" font-size="12" font-weight="bold" fill="${GC.cost}">MK</text>

  <!-- MO=MK dot -->
  <circle cx="${qStarX}" cy="${moEqY}" r="4" fill="${GC.revenue}"/>

  <!-- P* dot on demand curve -->
  <circle cx="${qStarX}" cy="${pStarY}" r="5" fill="${GC.demand}"/>
  <text x="${qStarX+10}" y="${pStarY-8}" font-size="10" fill="${GC.demand}" font-style="italic">P* van V!</text>

  <!-- Axis labels -->
  <text x="72" y="${pStarY+4}" text-anchor="end" font-size="10" fill="${GC.axis}">P*\u224837</text>
  <text x="72" y="${mkAtQY+4}" text-anchor="end" font-size="10" fill="${GC.axis}">MK*\u224823</text>
  <text x="72" y="${v1y+4}" text-anchor="end" font-size="10" fill="${GC.label}">50</text>
  <text x="72" y="${mk1y+4}" text-anchor="end" font-size="10" fill="${GC.label}">10</text>
  <text x="${qStarX}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">Q*\u224827</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 3: BELASTINGEFFECT OP MARKT — DEADWEIGHT LOSS
// V: p = -0.5Q + 60, A: p = 0.5Q + 10
// Eq1: Q=50, p*=35. Tax=10 → A2: p=0.5Q+20 → Eq2: Q=40, p2=40, Pprod=30
// ═══════════════════════════════════════════════════════════════════════════
function buildTaxEffectSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 100, pMax = 65;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  const v1x = qToX(0), v1y = pToY(60);
  const v2x = qToX(100), v2y = pToY(10);
  const a1x = qToX(0), a1y = pToY(10);
  const a2x = qToX(100), a2y = pToY(60);
  const a2_1x = qToX(0), a2_1y = pToY(20);
  const a2_2x = qToX(90), a2_2y = pToY(65);

  const eq1x = qToX(50), eq1y = pToY(35);
  const eq2x = qToX(40), eq2y = pToY(40);
  const pprodY = pToY(30);

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
  <text x="${px + pw/2}" y="350" text-anchor="middle" font-size="12" fill="${GC.label}">Hoeveelheid (Q)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Tax revenue area -->
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

  <!-- Tax bracket -->
  <line x1="65" y1="${eq2y}" x2="65" y2="${pprodY}" stroke="${GC.cost}" stroke-width="2"/>
  <line x1="60" y1="${eq2y}" x2="70" y2="${eq2y}" stroke="${GC.cost}" stroke-width="1.5"/>
  <line x1="60" y1="${pprodY}" x2="70" y2="${pprodY}" stroke="${GC.cost}" stroke-width="1.5"/>
  <text x="50" y="${(eq2y + pprodY)/2 + 4}" text-anchor="middle" font-size="9" font-weight="bold" fill="${GC.cost}">t=10</text>

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
  <text x="72" y="${eq1y+4}" text-anchor="end" font-size="10" fill="${GC.label}">P\u2081=35</text>
  <text x="72" y="${eq2y+4}" text-anchor="end" font-size="10" fill="${GC.axis}">P\u2082=40</text>
  <text x="72" y="${pprodY+4}" text-anchor="end" font-size="10" fill="${GC.axis}">P\u2083=30</text>
  <text x="${eq1x}" y="325" text-anchor="middle" font-size="10" fill="${GC.label}">Q\u2081=50</text>
  <text x="${eq2x}" y="338" text-anchor="middle" font-size="10" fill="${GC.axis}">Q\u2082=40</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 4: SURPLUS EN WELVAARTSVERLIES — VC vs MONOPOLIE
// V: p = -0.8q + 48, A/MK: p = 0.4q + 6
// VC eq: q=35, p=20. MO: p=-1.6q+48, MO=MK: q=21, p*(V)=31.2, MK=14.4
// ═══════════════════════════════════════════════════════════════════════════
function buildSurplusComparisonSVG() {
  const lx = 55, ly = 55, lw = 270, lh = 225;
  const lqMax = 60, lpMax = 50;
  const lqToX = q => Math.round(lx + (q / lqMax) * lw);
  const lpToY = p => Math.round(ly + lh - (p / lpMax) * lh);

  const lv1x = lqToX(0), lv1y = lpToY(48);
  const lv2x = lqToX(60), lv2y = lpToY(0);
  const la1x = lqToX(0), la1y = lpToY(6);
  const la2x = lqToX(60), la2y = lpToY(30);
  const leqx = lqToX(35), leqy = lpToY(20);
  const lpStarY = lpToY(20);

  const rx = 395, ry = 55, rw = 270, rh = 225;
  const rqMax = 60, rpMax = 50;
  const rqToX = q => Math.round(rx + (q / rqMax) * rw);
  const rpToY = p => Math.round(ry + rh - (p / rpMax) * rh);

  const rv1x = rqToX(0), rv1y = rpToY(48);
  const rv2x = rqToX(60), rv2y = rpToY(0);
  const rmo1x = rqToX(0), rmo1y = rpToY(48);
  const rmo2x = rqToX(30), rmo2y = rpToY(0);
  const rmk1x = rqToX(0), rmk1y = rpToY(6);
  const rmk2x = rqToX(60), rmk2y = rpToY(30);
  const rqStar = rqToX(21);
  const rpStarY = rpToY(31.2);
  const rMKatQ = rpToY(14.4);
  const rMOeqY = rpToY(14.4);
  const rVCeqx = rqToX(35);
  const rVCeqy = rpToY(20);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- LEFT PANEL: Volkomen concurrentie -->
  <text x="${lx + lw/2}" y="25" text-anchor="middle" font-size="13" font-weight="bold" fill="${GC.title}">VC: maximaal surplus</text>

  <line x1="${lx}" y1="${ly+lh}" x2="${lx}" y2="${ly-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${lx}" y1="${ly+lh}" x2="${lx+lw+5}" y2="${ly+lh}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="170" transform="rotate(-90, 15, 170)" text-anchor="middle" font-size="10" fill="${GC.label}">P</text>
  <text x="${lx + lw/2}" y="305" text-anchor="middle" font-size="10" fill="${GC.label}">Q</text>
  <text x="${lx-8}" y="292" text-anchor="end" font-size="9" fill="${GC.label}">0</text>

  <polygon points="${lx},${lv1y} ${leqx},${leqy} ${lx},${lpStarY}" fill="${GC.surplus}" fill-opacity="0.45"/>
  <text x="${lx+18}" y="${(lv1y + leqy + lpStarY)/3 + 3}" font-size="10" font-weight="bold" fill="${GC.demand}">CS</text>

  <polygon points="${lx},${la1y} ${leqx},${leqy} ${lx},${lpStarY}" fill="${GC.prodSurplus}" fill-opacity="0.45"/>
  <text x="${lx+18}" y="${(la1y + leqy + lpStarY)/3 - 2}" font-size="10" font-weight="bold" fill="${GC.supply}">PS</text>

  <line x1="${lx}" y1="${leqy}" x2="${leqx}" y2="${leqy}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${leqx}" y1="${leqy}" x2="${leqx}" y2="${ly+lh}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <line x1="${lv1x}" y1="${lv1y}" x2="${lv2x}" y2="${lv2y}" stroke="${GC.demand}" stroke-width="2"/>
  <text x="${lv2x-12}" y="${lv2y-8}" font-size="10" font-weight="bold" fill="${GC.demand}">V</text>
  <line x1="${la1x}" y1="${la1y}" x2="${la2x}" y2="${la2y}" stroke="${GC.supply}" stroke-width="2"/>
  <text x="${la2x-12}" y="${la2y+14}" font-size="10" font-weight="bold" fill="${GC.supply}">A</text>

  <circle cx="${leqx}" cy="${leqy}" r="4" fill="${GC.demand}"/>
  <text x="${lx-8}" y="${leqy+4}" text-anchor="end" font-size="9" fill="${GC.axis}">P*=20</text>
  <text x="${leqx}" y="292" text-anchor="middle" font-size="9" fill="${GC.axis}">Q*=35</text>

  <text x="${lx + lw/2}" y="325" text-anchor="middle" font-size="10" fill="${GC.title}" font-weight="bold">Totaal surplus = CS + PS (maximaal)</text>

  <!-- RIGHT PANEL: Monopolie -->
  <text x="${rx + rw/2}" y="25" text-anchor="middle" font-size="13" font-weight="bold" fill="${GC.title}">Monopolie: welvaartsverlies</text>

  <line x1="${rx}" y1="${ry+rh}" x2="${rx}" y2="${ry-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${rx}" y1="${ry+rh}" x2="${rx+rw+5}" y2="${ry+rh}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="380" y="170" transform="rotate(-90, 380, 170)" text-anchor="middle" font-size="10" fill="${GC.label}">P</text>
  <text x="${rx + rw/2}" y="305" text-anchor="middle" font-size="10" fill="${GC.label}">Q</text>
  <text x="${rx-8}" y="292" text-anchor="end" font-size="9" fill="${GC.label}">0</text>

  <polygon points="${rx},${rv1y} ${rqStar},${rpStarY} ${rx},${rpStarY}" fill="${GC.surplus}" fill-opacity="0.45"/>
  <text x="${rx+12}" y="${(rv1y + rpStarY*2)/3 + 5}" font-size="9" font-weight="bold" fill="${GC.demand}">CS</text>

  <polygon points="${rqStar},${rpStarY} ${rVCeqx},${rVCeqy} ${rqStar},${rMKatQ}" fill="${GC.loss}" fill-opacity="0.45"/>
  <text x="${rqStar+15}" y="${(rpStarY + rVCeqy + rMKatQ)/3 + 2}" font-size="9" font-weight="bold" fill="#D9534F">DWL</text>

  <rect x="${rx}" y="${rpStarY}" width="${rqStar - rx}" height="${rMKatQ - rpStarY}" fill="${GC.tax}" fill-opacity="0.35"/>
  <text x="${(rx + rqStar)/2}" y="${(rpStarY + rMKatQ)/2 + 4}" text-anchor="middle" font-size="9" font-weight="bold" fill="#BA6A1C">Winst</text>

  <line x1="${rv1x}" y1="${rv1y}" x2="${rv2x}" y2="${rv2y}" stroke="${GC.demand}" stroke-width="2"/>
  <text x="${rv2x-12}" y="${rv2y-8}" font-size="10" font-weight="bold" fill="${GC.demand}">V</text>

  <line x1="${rmo1x}" y1="${rmo1y}" x2="${rmo2x}" y2="${rmo2y}" stroke="${GC.revenue}" stroke-width="2"/>
  <text x="${rmo2x+5}" y="${rmo2y-6}" font-size="10" font-weight="bold" fill="${GC.revenue}">MO</text>

  <line x1="${rmk1x}" y1="${rmk1y}" x2="${rmk2x}" y2="${rmk2y}" stroke="${GC.cost}" stroke-width="2"/>
  <text x="${rmk2x+5}" y="${rmk2y+4}" font-size="10" font-weight="bold" fill="${GC.cost}">MK</text>

  <circle cx="${rqStar}" cy="${rMOeqY}" r="4" fill="${GC.revenue}"/>

  <line x1="${rqStar}" y1="${rMOeqY}" x2="${rqStar}" y2="${rpStarY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${rx}" y1="${rpStarY}" x2="${rqStar}" y2="${rpStarY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${rqStar}" y1="${rpStarY}" x2="${rqStar}" y2="${ry+rh}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${rx}" y1="${rMKatQ}" x2="${rqStar}" y2="${rMKatQ}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="3,3"/>

  <circle cx="${rqStar}" cy="${rpStarY}" r="4" fill="${GC.demand}"/>

  <text x="${rx-8}" y="${rpStarY+4}" text-anchor="end" font-size="9" fill="${GC.axis}">P*</text>
  <text x="${rx-8}" y="${rMKatQ+4}" text-anchor="end" font-size="9" fill="${GC.axis}">MK*</text>
  <text x="${rqStar}" y="292" text-anchor="middle" font-size="9" fill="${GC.axis}">Q*</text>

  <text x="${rx + rw/2}" y="325" text-anchor="middle" font-size="10" fill="#D9534F" font-weight="bold">DWL = verloren surplus door monopolie</text>
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
  pres.title = "3.5.2 Naar het examen";

  addTitleMaster(pres);
  addContentMaster(pres);

  // Generate graph PNGs
  const [g1Buf, g2Buf, g3Buf, g4Buf] = await Promise.all([
    svgToPng(buildVACalculationSVG()),
    svgToPng(buildMonopolyProfitSVG()),
    svgToPng(buildTaxEffectSVG()),
    svgToPng(buildSurplusComparisonSVG()),
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
    slide.addText("Naar het examen", {
      x: 0.7, y: 1.0, w: 8.6, h: 1.4,
      fontSize: 40, fontFace: "Arial", color: C.white, bold: true,
    });
    slide.addText("Examenvoorbereiding economie \u2014 strategie\u00ebn en rekenroutes", {
      x: 0.7, y: 2.4, w: 8.6, h: 0.6,
      fontSize: 22, fontFace: "Arial", color: C.gray,
    });
    slide.addText("3.5.2 Naar het examen  |  Economie VWO", {
      x: 0.7, y: 5.15, w: 8.6, h: 0.475,
      fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle",
    });
    slide.addNotes("Openingsslide. Dit is de examenvoorbereiding: we behandelen de vier vraagtypen, laten zien hoe je ze aanpakt, en lopen de belangrijkste rekenroutes door met voorbeelden.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 2: Examenoverzicht
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Het centraal examen economie");
    drawCard(slide, 0.5, 1.1, 4.3, 3.5, C.primary, C.primaryLt, "Opbouw CE", DOMAIN.color, [
      { text: "Tijdsduur: 180 minuten\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Totaal: \u00b1100 punten\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Mix van korte en lange vragen\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Contextrijk: teksten, tabellen, grafieken\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Alle domeinen komen aan bod", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
    ]);
    drawCard(slide, 5.2, 1.1, 4.3, 3.5, C.primary, C.primaryLt, "Domeinen Module 3", DOMAIN.color, [
      { text: "A  Vaardigheden (altijd)\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "D  Markt (H1 + H2)\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "E  Overheid (H3)\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "H  Internationale handel (H4)\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Module 3 \u2248 40% van het examen", options: { fontSize: 14, fontFace: "Arial", color: DOMAIN.color, bold: true } },
    ]);
    slide.addNotes("Overzicht van het CE economie. Module 3 is een zwaar onderdeel: markt, overheid en internationale handel vormen samen circa 40% van het examen.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 3: Vraagtypen overzicht
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Vier examenvraagtypen");
    const types = [
      { title: "Bereken", color: C.blue, bg: C.blueLt, desc: "Reken uit met formules.\nToon altijd je berekening.\nEenheid + afronden!" },
      { title: "Verklaar", color: C.amber, bg: C.amberLt, desc: "Leg oorzaak-gevolg uit.\nGebruik economische\nbegrippen in je redenering." },
      { title: "Toon aan", color: C.green, bg: C.greenLt, desc: "Bewijs met cijfers dat\niets klopt. Het antwoord\nis al gegeven!" },
      { title: "Leg uit", color: C.teal, bg: C.tealLt, desc: "Beschrijf het mechanisme\nstap voor stap.\nGrafiek als dat helpt." },
    ];
    const cardW = 2.1;
    const gap = 0.2;
    const startX = 0.5;
    types.forEach((t, i) => {
      const x = startX + i * (cardW + gap);
      slide.addShape("rect", {
        x, y: 1.1, w: cardW, h: 3.6,
        fill: { color: t.bg }, rectRadius: 0.05, shadow: makeShadow(),
      });
      slide.addShape("rect", {
        x, y: 1.1, w: cardW, h: 0.06,
        fill: { color: t.color },
      });
      slide.addText(t.title, {
        x, y: 1.2, w: cardW, h: 0.7,
        fontSize: 16, fontFace: "Arial", color: t.color, bold: true,
        align: "center", valign: "middle",
      });
      slide.addShape("line", {
        x: x + 0.2, y: 1.95, w: cardW - 0.4, h: 0,
        line: { color: C.borderGray, width: 0.5 },
      });
      slide.addText(t.desc, {
        x: x + 0.15, y: 2.05, w: cardW - 0.3, h: 2.5,
        fontSize: 13, fontFace: "Arial", color: C.dark,
        valign: "top", align: "center", lineSpacingMultiple: 1.35,
      });
    });
    slide.addNotes("De vier hoofdvraagtypen op het examen. Elk type vereist een andere aanpak. Bereken-vragen leveren de meeste punten op als je de stappen goed doet. Toon aan is tricky: het antwoord staat er al, jij moet laten zien hoe je er komt.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 4: Bereken-vragen theorie
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Bereken-vragen: de aanpak");
    drawCard(slide, 0.5, 1.1, 9, 1.5, C.blue, C.blueLt, "Stappenplan", C.blue, [
      { text: "1. ", options: { fontSize: 14, fontFace: "Arial", color: C.blue, bold: true } },
      { text: "Schrijf de juiste formule op\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "2. ", options: { fontSize: 14, fontFace: "Arial", color: C.blue, bold: true } },
      { text: "Vul de getallen in\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "3. ", options: { fontSize: 14, fontFace: "Arial", color: C.blue, bold: true } },
      { text: "Reken stap voor stap uit (toon tussenstappen)\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "4. ", options: { fontSize: 14, fontFace: "Arial", color: C.blue, bold: true } },
      { text: "Noteer het antwoord met eenheid en juiste afronding", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(slide, 0.5, 2.9, 9, 2.0, C.blue, C.cream, "Voorbeeld: evenwichtsprijs", C.blue, [
      { text: "Gegeven: ", options: { fontSize: 13, fontFace: "Arial", color: C.gray } },
      { text: "Qv = \u2212P + 80  en  Qa = 2P \u2212 40\n", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
      { text: "Stap 1: Qv = Qa \u2192 \u2212P + 80 = 2P \u2212 40\n", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
      { text: "Stap 2: 3P = 120 \u2192 P* = 40\n", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
      { text: "Stap 3: Q* = \u221240 + 80 = 40\n", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
      { text: "Antwoord: De evenwichtsprijs is \u20ac40 bij een hoeveelheid van 40 stuks.", options: { fontSize: 13, fontFace: "Arial", color: C.blue, bold: true } },
    ]);
    slide.addNotes("Bereken-vragen: altijd de volledige berekening opschrijven. Tussenstappen leveren punten op, zelfs als het eindantwoord fout is. Vergeet de eenheid niet!");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 5: GRAPH — V/A Equilibrium berekening
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Grafiek: marktevenwicht berekenen");
    slide.addImage({
      data: g1,
      x: 0.75, y: 0.9, w: 8.5, h: 4.25,
    });
    slide.addNotes("V/A-diagram met de uitgewerkte berekening. De vraaglijn (V) is dalend, de aanbodlijn (A) stijgend. Het snijpunt geeft het evenwicht: Q*=40, P*=40. Let op: de aanbodlijn begint pas bij Q=20 (daar wordt de prijs positief). CS en PS zijn de gekleurde gebieden.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 6: Verklaar-vragen theorie
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Verklaar-vragen: oorzaak-gevolg");
    drawCard(slide, 0.5, 1.1, 9, 1.3, C.amber, C.amberLt, "De structuur", C.amber, [
      { text: "Een verklaar-vraag verwacht een ", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "causale redenering", options: { fontSize: 14, fontFace: "Arial", color: C.amber, bold: true } },
      { text: ":\noorzaak \u2192 economisch mechanisme \u2192 gevolg", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    slide.addText("Voorbeeld: \u201cVerklaar waarom een subsidie op zonnepanelen leidt tot een lagere prijs.\u201d", {
      x: 0.5, y: 2.6, w: 9, h: 0.4,
      fontSize: 13, fontFace: "Arial", color: C.gray, italic: true,
    });
    flowChain(slide, [
      "Subsidie verlaagt productiekosten",
      "Aanbodlijn verschuift naar rechts",
      "Bij zelfde vraag: meer aanbod",
      "Evenwichtsprijs daalt",
    ], 2.5, 3.1, 5, C.amber);
    slide.addNotes("Verklaar-vragen: altijd de keten oorzaak \u2192 mechanisme \u2192 gevolg. Gebruik economische begrippen (aanbodlijn, evenwicht, surplus). Zonder begrippen krijg je geen punten, ook als de redenering klopt.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 7: GRAPH — Monopolie winstmaximalisatie
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Grafiek: monopolie winstmaximalisatie");
    slide.addImage({
      data: g2,
      x: 0.75, y: 0.9, w: 8.5, h: 4.25,
    });
    slide.addNotes("Monopolie-grafiek met MO=MK-regel. Let op de drie cruciale stappen: (1) vind Q* waar MO=MK, (2) ga omhoog naar de vraaglijn voor P*, (3) winst = (P* \u2212 MK) \u00d7 Q*. De DWL-driehoek toont het welvaartsverlies ten opzichte van volkomen concurrentie.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 8: Toon aan-vragen theorie
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Toon aan-vragen: bewijs het");
    drawCard(slide, 0.5, 1.1, 9, 1.5, C.green, C.greenLt, "Wat is anders?", C.green, [
      { text: "Bij \u2018toon aan\u2019 is het antwoord al gegeven.\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Jij moet laten zien ", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "hoe je daar komt", options: { fontSize: 14, fontFace: "Arial", color: C.green, bold: true } },
      { text: ".\nDat betekent: volledige berekening, alle tussenstappen, uitkomst = het gegeven getal.", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(slide, 0.5, 2.9, 9, 2.0, C.green, C.cream, "Voorbeeld", C.green, [
      { text: "\u201cToon aan dat het consumentensurplus 800 bedraagt.\u201d\n\n", options: { fontSize: 13, fontFace: "Arial", color: C.gray, italic: true } },
      { text: "CS = \u00bd \u00d7 basis \u00d7 hoogte\n", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
      { text: "CS = \u00bd \u00d7 40 \u00d7 (80 \u2212 40)\n", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
      { text: "CS = \u00bd \u00d7 40 \u00d7 40 = 800\n", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
      { text: "Conclusie: het CS bedraagt inderdaad 800. \u2713", options: { fontSize: 13, fontFace: "Arial", color: C.green, bold: true } },
    ]);
    slide.addNotes("Toon aan: het antwoord staat er al! Je moet de volledige berekening opschrijven zodat de uitkomst klopt met het gegeven getal. Tip: werk altijd toe naar het getal dat in de vraag staat.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 9: GRAPH — Belastingeffect
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Grafiek: belastingeffect op de markt");
    slide.addImage({
      data: g3,
      x: 0.75, y: 0.9, w: 8.5, h: 4.25,
    });
    slide.addNotes("Belasting verschuift A omhoog naar A+t. Consument betaalt meer (P2=40), producent ontvangt minder (P3=30). De overheid int de belastingopbrengst (gele vlak). Het rode driehoekje (DWL) is welvaartsverlies: transacties die niet meer plaatsvinden.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 10: Grafiekvragen theorie
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Grafiekvragen: wat verwacht de examinator?");
    drawCard(slide, 0.5, 1.1, 4.3, 3.5, C.primary, C.primaryLt, "Bij tekenen", DOMAIN.color, [
      { text: "Assen benoemen (P en Q)\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Lijnen benoemen (V, A, MO, MK)\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Snijpunten en waarden aangeven\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Gebieden arceren en benoemen\n  (CS, PS, DWL, winst)\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Verschuivingen met pijl\n  en oorzaak", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
    ]);
    drawCard(slide, 5.2, 1.1, 4.3, 3.5, C.primary, C.primaryLt, "Bij aflezen", DOMAIN.color, [
      { text: "Lees af op de juiste as\n  (prijs = Y-as, hoeveelheid = X-as)\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Gebruik stippellijnen naar\n  het evenwichtspunt\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Let op schaalverdeling\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
      { text: "Benoem altijd wat je\n  afleest: \u201cUit de grafiek\n  volgt dat P* = ...\u201d", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bullet: true } },
    ]);
    slide.addNotes("Grafiekvragen: de examinator let op nauwkeurigheid. Assen benoemen, lijnen labelen, waarden aangeven. Vergeet niet te arceren en te benoemen wat elk gebied voorstelt.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 11: GRAPH — Surplus vergelijking
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Surplus: VC versus monopolie");
    slide.addImage({
      data: g4,
      x: 0.75, y: 0.9, w: 8.5, h: 4.25,
    });
    slide.addNotes("Vergelijking VC en monopolie. Links: bij VC is het totale surplus (CS+PS) maximaal. Rechts: bij monopolie is er minder CS, de monopolist pakt winst, en er ontstaat DWL. Dit is een klassieke examenvraag: teken en benoem de surplusgebieden.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 12: Uitgewerkt voorbeeld 1 — Berekening
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Uitgewerkt voorbeeld: monopoliewinst berekenen");
    drawCard(slide, 0.5, 1.0, 9, 4.0, C.blue, C.cream, "Examenopgave", C.blue, [
      { text: "Gegeven: ", options: { fontSize: 13, fontFace: "Arial", color: C.gray } },
      { text: "V: p = \u22120,5Q + 50   MK: p = 0,5Q + 10\n\n", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
      { text: "Stap 1: ", options: { fontSize: 13, fontFace: "Arial", color: C.blue, bold: true } },
      { text: "MO afleiden \u2192 MO: p = \u2212Q + 50\n", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
      { text: "Stap 2: ", options: { fontSize: 13, fontFace: "Arial", color: C.blue, bold: true } },
      { text: "MO = MK \u2192 \u2212Q + 50 = 0,5Q + 10 \u2192 1,5Q = 40 \u2192 Q* \u2248 26,7\n", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
      { text: "Stap 3: ", options: { fontSize: 13, fontFace: "Arial", color: C.blue, bold: true } },
      { text: "Prijs van V: p* = \u22120,5(26,7) + 50 = \u20ac36,65\n", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
      { text: "Stap 4: ", options: { fontSize: 13, fontFace: "Arial", color: C.blue, bold: true } },
      { text: "MK bij Q*: 0,5(26,7) + 10 = \u20ac23,35\n", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
      { text: "Stap 5: ", options: { fontSize: 13, fontFace: "Arial", color: C.blue, bold: true } },
      { text: "Winst = (P* \u2212 MK*) \u00d7 Q* = (36,65 \u2212 23,35) \u00d7 26,7 = \u20ac355,11\n\n", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
      { text: "De monopoliewinst bedraagt circa \u20ac355.", options: { fontSize: 14, fontFace: "Arial", color: C.blue, bold: true } },
    ]);
    slide.addNotes("Volledig uitgewerkt voorbeeld van een monopolie-berekening. Vijf stappen: MO afleiden, MO=MK oplossen, prijs van vraaglijn, MK bij Q*, dan winst berekenen.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 13: Uitgewerkt voorbeeld 2 — Verklaar
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Uitgewerkt voorbeeld: verklaar-vraag");
    drawCard(slide, 0.5, 1.0, 9, 1.2, C.amber, C.amberLt, "Vraag", C.amber, [
      { text: "\u201cVerklaar waarom een monopolist een hogere prijs vraagt dan bij\nvolkomen concurrentie het geval zou zijn.\u201d", options: { fontSize: 14, fontFace: "Arial", color: C.dark, italic: true } },
    ]);
    drawCard(slide, 0.5, 2.5, 9, 2.5, C.amber, C.cream, "Modelantwoord (3 punten)", C.amber, [
      { text: "1. ", options: { fontSize: 13, fontFace: "Arial", color: C.amber, bold: true } },
      { text: "Een monopolist is prijszetter: er zijn geen concurrenten.\n\n", options: { fontSize: 13, fontFace: "Arial", color: C.dark } },
      { text: "2. ", options: { fontSize: 13, fontFace: "Arial", color: C.amber, bold: true } },
      { text: "De monopolist maximaliseert winst bij MO = MK. Omdat de MO-lijn\n   sneller daalt dan de vraaglijn, is de optimale Q lager dan bij VC.\n\n", options: { fontSize: 13, fontFace: "Arial", color: C.dark } },
      { text: "3. ", options: { fontSize: 13, fontFace: "Arial", color: C.amber, bold: true } },
      { text: "Een lagere Q betekent (bij dalende vraaglijn) een hogere P.\n   De monopolist produceert dus minder en vraagt meer.", options: { fontSize: 13, fontFace: "Arial", color: C.dark } },
    ]);
    slide.addNotes("Modelantwoord bij een verklaar-vraag. Drie punten, drie stappen: (1) positie monopolist, (2) MO=MK mechanisme, (3) gevolg voor prijs. Gebruik altijd economische begrippen.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 14: Tijdmanagement
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Tijdmanagement op het examen");
    const headers = ["Vraagtype", "Punten", "Tijd (richtlijn)", "Strategie"];
    const rows = [
      ["Bereken", "2\u20134 pt", "3\u20135 min", "Formule \u2192 invullen \u2192 uitwerken"],
      ["Verklaar", "2\u20133 pt", "3\u20134 min", "Oorzaak \u2192 mechanisme \u2192 gevolg"],
      ["Toon aan", "2\u20134 pt", "3\u20135 min", "Berekening tonen, uitkomst = gegeven"],
      ["Leg uit", "2\u20133 pt", "2\u20134 min", "Stap voor stap mechanisme beschrijven"],
    ];
    const colW = [1.8, 1.5, 2.0, 4.2];
    const rowH = 0.65;
    let y = 1.1;
    let x = 0.25;
    headers.forEach((h, i) => {
      slide.addShape("rect", { x, y, w: colW[i], h: 0.50, fill: { color: DOMAIN.color } });
      slide.addText(h, { x, y, w: colW[i], h: 0.50, fontSize: 13, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });
      x += colW[i] + 0.05;
    });
    y += 0.55;
    rows.forEach((row, ri) => {
      x = 0.25;
      row.forEach((cell, ci) => {
        const bg = ri % 2 === 0 ? C.rowAlt : C.white;
        slide.addShape("rect", { x, y, w: colW[ci], h: rowH, fill: { color: bg } });
        slide.addText(cell, { x, y, w: colW[ci], h: rowH, fontSize: 12, fontFace: "Arial", color: ci === 0 ? DOMAIN.color : C.dark, bold: ci === 0, align: "center", valign: "middle" });
        x += colW[ci] + 0.05;
      });
      y += rowH + 0.02;
    });
    drawCard(slide, 0.5, y + 0.15, 9, 0.8, C.primary, C.primaryLt, "Vuistregel", DOMAIN.color, [
      { text: "1 punt \u2248 1,5 minuut. Houd 10 minuten over voor controle.", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    slide.addNotes("Tijdmanagement: de vuistregel is 1,5 minuut per punt. Bij 100 punten en 180 minuten houd je dan 30 minuten over voor lezen en controleren.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 15: Top 5 examenfouten
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Top 5 examenfouten");
    const fouten = [
      { fout: "Geen eenheid bij het antwoord", fix: "Altijd \u20ac, stuks, % of andere eenheid noteren" },
      { fout: "Beweging l\u00e1ngs vs verschuiving v\u00e1n de lijn verwarren", fix: "Prijsverandering = langs; andere factoren = verschuiving" },
      { fout: "MO niet afleiden bij monopolie", fix: "MO heeft dubbele helling van de vraaglijn (lineair geval)" },
      { fout: "Tussenstappen overslaan", fix: "Elke tussenstap kan een punt opleveren" },
      { fout: "Grafiek niet volledig labelen", fix: "Assen, lijnen, snijpunten, gebieden altijd benoemen" },
    ];
    const startY = 1.05;
    const boxH = 0.75;
    const gap = 0.08;
    fouten.forEach((f, i) => {
      const y = startY + i * (boxH + gap);
      slide.addShape("rect", {
        x: 0.5, y, w: 0.5, h: boxH,
        fill: { color: C.lightRed }, rectRadius: 0.03,
      });
      slide.addText(`${i + 1}`, {
        x: 0.5, y, w: 0.5, h: boxH,
        fontSize: 18, fontFace: "Arial", color: C.red, bold: true,
        align: "center", valign: "middle",
      });
      slide.addShape("rect", {
        x: 1.05, y, w: 4.2, h: boxH,
        fill: { color: C.lightRed }, rectRadius: 0.03,
      });
      slide.addText(f.fout, {
        x: 1.15, y, w: 4.0, h: boxH,
        fontSize: 13, fontFace: "Arial", color: C.red,
        valign: "middle",
      });
      slide.addShape("rect", {
        x: 5.3, y, w: 4.2, h: boxH,
        fill: { color: C.greenLt }, rectRadius: 0.03,
      });
      slide.addText(f.fix, {
        x: 5.4, y, w: 4.0, h: boxH,
        fontSize: 13, fontFace: "Arial", color: C.green,
        valign: "middle",
      });
    });
    slide.addNotes("De vijf meest voorkomende examenfouten. Elke fout kost punten die je makkelijk kunt voorkomen.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 16: Formule-overzicht
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Formule-overzicht Module 3");
    const formulas = [
      { name: "Evenwicht", formula: "Qv = Qa  (of: Pv = Pa)" },
      { name: "CS", formula: "\u00bd \u00d7 Q* \u00d7 (Pmax \u2212 P*)" },
      { name: "PS", formula: "\u00bd \u00d7 Q* \u00d7 (P* \u2212 Pmin)" },
      { name: "Winst (monopolie)", formula: "(P* \u2212 GK) \u00d7 Q*  of  TO \u2212 TK" },
      { name: "TO", formula: "P \u00d7 Q" },
      { name: "MO (lineair)", formula: "Dubbele helling van V-lijn" },
      { name: "Winstmax", formula: "MO = MK  \u2192 Q*" },
      { name: "Alternatieve kosten", formula: "AK = wat je opgeeft / wat je krijgt" },
      { name: "Ruilvoet", formula: "AK(land 1) < ruilvoet < AK(land 2)" },
      { name: "Belastingdruk", formula: "Verschil Pconsument \u2212 Pproducent = t" },
    ];
    const colW_name = 3.2;
    const colW_formula = 6.3;
    const rowH = 0.38;
    let y = 1.0;
    slide.addShape("rect", { x: 0.25, y, w: colW_name, h: 0.4, fill: { color: DOMAIN.color } });
    slide.addText("Concept", { x: 0.25, y, w: colW_name, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });
    slide.addShape("rect", { x: 0.25 + colW_name + 0.05, y, w: colW_formula, h: 0.4, fill: { color: DOMAIN.color } });
    slide.addText("Formule / Regel", { x: 0.25 + colW_name + 0.05, y, w: colW_formula, h: 0.4, fontSize: 12, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle" });
    y += 0.45;
    formulas.forEach((f, i) => {
      const bg = i % 2 === 0 ? C.rowAlt : C.white;
      slide.addShape("rect", { x: 0.25, y, w: colW_name, h: rowH, fill: { color: bg } });
      slide.addText(f.name, { x: 0.35, y, w: colW_name - 0.2, h: rowH, fontSize: 12, fontFace: "Arial", color: DOMAIN.color, bold: true, valign: "middle" });
      slide.addShape("rect", { x: 0.25 + colW_name + 0.05, y, w: colW_formula, h: rowH, fill: { color: bg } });
      slide.addText(f.formula, { x: 0.35 + colW_name + 0.05, y, w: colW_formula - 0.2, h: rowH, fontSize: 12, fontFace: "Consolas", color: C.dark, valign: "middle" });
      y += rowH + 0.01;
    });
    slide.addNotes("Alle formules die je moet kennen voor Module 3. Op het examen staan de formules NIET in een bijlage \u2014 je moet ze zelf kennen.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 17: Examen-checklist
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = addContentSlide(pres, "Examen-checklist");
    drawCard(slide, 0.5, 1.1, 4.3, 3.5, C.green, C.greenLt, "Meenemen", C.green, [
      { text: "\u2713  Rekenmachine (toegestaan type)\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "\u2713  Pen (blauw of zwart)\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "\u2713  Potlood + gum (voor grafieken)\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "\u2713  Liniaal (voor grafieken)\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "\u2713  Legitimatiebewijs\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "\u2713  Oproepbrief", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(slide, 5.2, 1.1, 4.3, 3.5, C.teal, C.tealLt, "Nog even herhalen", C.teal, [
      { text: "\u25b6  Formules uit het hoofd\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "\u25b6  Vier marktvormen + kenmerken\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "\u25b6  MO = MK rekenroute\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "\u25b6  Surplus berekenen + tekenen\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "\u25b6  Belasting- en subsidie-effecten\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "\u25b6  Comparatief voordeel berekenen", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    slide.addNotes("Praktische checklist voor de examendag. Links: wat je meeneemt. Rechts: de zes onderwerpen die je nog even moet doornemen.");
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 18: Afsluiting
  // ════════════════════════════════════════════════════════════════════════
  {
    const slide = pres.addSlide({ masterName: "TITLE_DARK" });
    slide.addText("Je bent er klaar voor!", {
      x: 0.7, y: 1.2, w: 8.6, h: 1.4,
      fontSize: 38, fontFace: "Arial", color: C.white, bold: true,
    });
    slide.addText("Kennis \u00d7 strategie \u00d7 oefening = succes", {
      x: 0.7, y: 2.6, w: 8.6, h: 0.6,
      fontSize: 22, fontFace: "Arial", color: C.gray,
    });
    slide.addText([
      { text: "\u2022  Lees de vraag twee keer\n", options: { fontSize: 15, fontFace: "Arial", color: C.white } },
      { text: "\u2022  Schrijf altijd iets op (ook als je twijfelt)\n", options: { fontSize: 15, fontFace: "Arial", color: C.white } },
      { text: "\u2022  Controleer eenheden en afrondingen\n", options: { fontSize: 15, fontFace: "Arial", color: C.white } },
      { text: "\u2022  Vertrouw op je voorbereiding", options: { fontSize: 15, fontFace: "Arial", color: C.white } },
    ], {
      x: 0.7, y: 3.4, w: 8.6, h: 1.6,
      valign: "top", lineSpacingMultiple: 1.5,
    });
    slide.addText("3.5.2 Naar het examen  |  Succes!", {
      x: 0.7, y: 5.15, w: 8.6, h: 0.475,
      fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle",
    });
    slide.addNotes("Sluitdia. Eindig de les positief. De leerlingen hebben alle theorie behandeld, de rekenroutes geoefend, en weten welke fouten ze moeten vermijden.");
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  const outDir = "C:/Projects/4veco/3. Module 3 - Markt en overheid/3.5 Hoofdstuk 5 - Afsluiting/3.5.2 Paragraaf 2 - Naar het examen/2. Leren";
  const outFile = path.join(outDir, "3.5.2 Naar het examen \u2013 presentatie.pptx");

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
