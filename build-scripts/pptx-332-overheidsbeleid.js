/**
 * PPTX Build: 3.3.2 Overheidsbeleid — presentatie met dual coding
 *
 * 17 dia's met 6 economische grafieken:
 *   1. Overzicht prijsbeleid-instrumenten
 *   2. Minimumprijs (aanbodoverschot)
 *   3. Maximumprijs (vraagoverschot)
 *   4. Minimumloon (werkloosheid op arbeidsmarkt)
 *   5. Accijns (supply shift up + burden split)
 *   6. Subsidie (supply shift down + gains)
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/pptx-332-overheidsbeleid.js
 */
process.env.NODE_PATH = "C:/Users/meije/AppData/Roaming/npm/node_modules";
require("module").Module._initPaths();

const PptxGenJS = require("pptxgenjs");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { saveSvgFiles } = require("./lib-svg-save");

// ═══════════════════════════════════════════════════════════════════════════
// PALETTE + HELPERS
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
const GC = {
  demand: "#1A5276", supply: "#1E8449", supplyNew: "#E67E22",
  cost: "#E67E22", axis: "#2D3748", grid: "#CBD5E0",
  label: "#718096", title: "#1E2761", bg: "#F7FAFC",
  surplus: "#85C1E9", prodSurplus: "#82E0AA", loss: "#F1948A", tax: "#F8C471",
  shortage: "#F1948A",
};
const makeShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.10 });
async function svgToPng(svg, w = 720) { return sharp(Buffer.from(svg)).resize(w).png().toBuffer(); }
function pngToBase64(buf) { return "image/png;base64," + buf.toString("base64"); }

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 1: Overzicht prijsbeleid (infographic)
// ═══════════════════════════════════════════════════════════════════════════
function buildOverzichtSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <text x="360" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">Vier instrumenten van prijsbeleid</text>

  <!-- Axis: Prijsingreep (horizontaal) -->
  <line x1="80" y1="330" x2="680" y2="330" stroke="#CBD5E0" stroke-width="1.5"/>
  <text x="80" y="348" text-anchor="start" font-size="11" fill="${GC.label}">prijs LAGER dan markt</text>
  <text x="680" y="348" text-anchor="end" font-size="11" fill="${GC.label}">prijs HOGER dan markt</text>
  <line x1="380" y1="325" x2="380" y2="335" stroke="${GC.label}" stroke-width="1"/>
  <text x="380" y="348" text-anchor="middle" font-size="11" fill="${GC.label}">marktprijs P*</text>

  <!-- 4 instrumentkaarten -->
  <rect x="60"  y="75" width="150" height="230" rx="8" fill="#FFFFFF" stroke="#1A5276" stroke-width="1.5"/>
  <rect x="60"  y="75" width="150" height="34" fill="#1A5276"/>
  <text x="135" y="97" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">Maximumprijs</text>
  <text x="135" y="140" text-anchor="middle" font-size="12" font-weight="bold" fill="#1A5276">Pmax &lt; P*</text>
  <text x="135" y="165" text-anchor="middle" font-size="11" fill="#2D3748">tekort</text>
  <text x="135" y="182" text-anchor="middle" font-size="11" fill="#2D3748">(vraagoverschot)</text>
  <text x="135" y="220" text-anchor="middle" font-size="11" fill="#718096" font-style="italic">voorbeeld:</text>
  <text x="135" y="237" text-anchor="middle" font-size="11" fill="#2D3748">huurplafond</text>
  <text x="135" y="275" text-anchor="middle" font-size="10" fill="#718096">doel: consument</text>
  <text x="135" y="290" text-anchor="middle" font-size="10" fill="#718096">beschermen</text>

  <rect x="220" y="75" width="150" height="230" rx="8" fill="#FFFFFF" stroke="#E67E22" stroke-width="1.5"/>
  <rect x="220" y="75" width="150" height="34" fill="#E67E22"/>
  <text x="295" y="97" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">Subsidie</text>
  <text x="295" y="140" text-anchor="middle" font-size="12" font-weight="bold" fill="#E67E22">A verschuift omlaag</text>
  <text x="295" y="165" text-anchor="middle" font-size="11" fill="#2D3748">prijs daalt,</text>
  <text x="295" y="182" text-anchor="middle" font-size="11" fill="#2D3748">hoeveelheid stijgt</text>
  <text x="295" y="220" text-anchor="middle" font-size="11" fill="#718096" font-style="italic">voorbeeld:</text>
  <text x="295" y="237" text-anchor="middle" font-size="11" fill="#2D3748">elektrische auto</text>
  <text x="295" y="275" text-anchor="middle" font-size="10" fill="#718096">doel: positieve externe</text>
  <text x="295" y="290" text-anchor="middle" font-size="10" fill="#718096">effecten stimuleren</text>

  <rect x="380" y="75" width="150" height="230" rx="8" fill="#FFFFFF" stroke="#7B2D8E" stroke-width="1.5"/>
  <rect x="380" y="75" width="150" height="34" fill="#7B2D8E"/>
  <text x="455" y="97" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">Accijns</text>
  <text x="455" y="140" text-anchor="middle" font-size="12" font-weight="bold" fill="#7B2D8E">A verschuift omhoog</text>
  <text x="455" y="165" text-anchor="middle" font-size="11" fill="#2D3748">prijs stijgt,</text>
  <text x="455" y="182" text-anchor="middle" font-size="11" fill="#2D3748">hoeveelheid daalt</text>
  <text x="455" y="220" text-anchor="middle" font-size="11" fill="#718096" font-style="italic">voorbeeld:</text>
  <text x="455" y="237" text-anchor="middle" font-size="11" fill="#2D3748">tabak, alcohol</text>
  <text x="455" y="275" text-anchor="middle" font-size="10" fill="#718096">doel: negatieve externe</text>
  <text x="455" y="290" text-anchor="middle" font-size="10" fill="#718096">effecten afremmen</text>

  <rect x="540" y="75" width="150" height="230" rx="8" fill="#FFFFFF" stroke="#186A3B" stroke-width="1.5"/>
  <rect x="540" y="75" width="150" height="34" fill="#186A3B"/>
  <text x="615" y="97" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">Minimumprijs</text>
  <text x="615" y="140" text-anchor="middle" font-size="12" font-weight="bold" fill="#186A3B">Pmin &gt; P*</text>
  <text x="615" y="165" text-anchor="middle" font-size="11" fill="#2D3748">overschot</text>
  <text x="615" y="182" text-anchor="middle" font-size="11" fill="#2D3748">(aanbodoverschot)</text>
  <text x="615" y="220" text-anchor="middle" font-size="11" fill="#718096" font-style="italic">voorbeeld:</text>
  <text x="615" y="237" text-anchor="middle" font-size="11" fill="#2D3748">minimumloon, melk</text>
  <text x="615" y="275" text-anchor="middle" font-size="10" fill="#718096">doel: producent/</text>
  <text x="615" y="290" text-anchor="middle" font-size="10" fill="#718096">werknemer beschermen</text>

  <!-- Indicator arrows below axis showing direction -->
  <line x1="135" y1="315" x2="135" y2="325" stroke="#1A5276" stroke-width="2"/>
  <line x1="615" y1="315" x2="615" y2="325" stroke="#186A3B" stroke-width="2"/>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 2: MINIMUMPRIJS (S/D met Pmin > P* → aanbodoverschot)
// V: P = 50 - Q → (0,50)..(50,0) ;  A: P = Q + 10 → (0,10)..(40,50)
// Eq: Q=20, P=30  ;  Pmin = 40: V→Q=10, A→Q=30. Overschot = 20.
// ═══════════════════════════════════════════════════════════════════════════
function buildMinimumprijsSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 55, pMax = 55;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  const v1x = qToX(0), v1y = pToY(50);
  const v2x = qToX(50), v2y = pToY(0);
  const a1x = qToX(0), a1y = pToY(10);
  const a2x = qToX(40), a2y = pToY(50);

  const pMin = 40;
  const qV = 10, qA = 30;   // at Pmin
  const yPmin = pToY(pMin);
  const xV = qToX(qV), xA = qToX(qA);
  const xEq = qToX(20), yEq = pToY(30);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs><marker id="ahm" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/></marker></defs>

  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Minimumprijs boven P*  →  aanbodoverschot</text>

  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ahm)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ahm)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Aanbodoverschot rectangle (between xV and xA at yPmin) -->
  <rect x="${xV}" y="${yPmin - 22}" width="${xA - xV}" height="22" fill="${GC.loss}" fill-opacity="0.55"/>

  <!-- Curves -->
  <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v2x-18}" y="${v2y-6}" font-size="12" font-weight="bold" fill="${GC.demand}">V</text>
  <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${GC.supply}" stroke-width="2.5"/>
  <text x="${a2x+6}" y="${a2y-6}" font-size="12" font-weight="bold" fill="${GC.supply}">A</text>

  <!-- Pmin horizontal line -->
  <line x1="${px}" y1="${yPmin}" x2="${px+pw}" y2="${yPmin}" stroke="#186A3B" stroke-width="2" stroke-dasharray="6,3"/>

  <!-- Evenwichtsstip -->
  <circle cx="${xEq}" cy="${yEq}" r="4" fill="${GC.axis}" opacity="0.5"/>
  <line x1="${xEq}" y1="${yEq}" x2="${xEq}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yEq}" x2="${xEq}" y2="${yEq}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Stippen bij Pmin op V en A -->
  <circle cx="${xV}" cy="${yPmin}" r="5" fill="${GC.demand}"/>
  <circle cx="${xA}" cy="${yPmin}" r="5" fill="${GC.supply}"/>
  <line x1="${xV}" y1="${yPmin}" x2="${xV}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${xA}" y1="${yPmin}" x2="${xA}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Overschot-label (boven de rechthoek) -->
  <text x="${(xV+xA)/2}" y="${yPmin - 28}" text-anchor="middle" font-size="11" font-weight="bold" fill="#922B21">aanbod­overschot = 20</text>

  <!-- Axis labels -->
  <text x="72" y="${yPmin+4}" text-anchor="end" font-size="10" fill="#186A3B" font-weight="bold">Pmin = 40</text>
  <text x="72" y="${yEq+4}" text-anchor="end" font-size="10" fill="${GC.axis}">P* = 30</text>
  <text x="${xV}" y="325" text-anchor="middle" font-size="10" fill="${GC.demand}">Q_V = 10</text>
  <text x="${xEq}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">Q* = 20</text>
  <text x="${xA}" y="325" text-anchor="middle" font-size="10" fill="${GC.supply}">Q_A = 30</text>

  <text x="360" y="348" text-anchor="middle" font-size="10" fill="${GC.label}" font-style="italic">Bij Pmin: aanbieders willen veel produceren, consumenten kopen weinig.</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 3: MAXIMUMPRIJS (Pmax < P* → vraagoverschot)
// Same V, A. Pmax = 20: V→Q=30, A→Q=10. Tekort = 20.
// ═══════════════════════════════════════════════════════════════════════════
function buildMaximumprijsSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 55, pMax = 55;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  const v1x = qToX(0), v1y = pToY(50), v2x = qToX(50), v2y = pToY(0);
  const a1x = qToX(0), a1y = pToY(10), a2x = qToX(40), a2y = pToY(50);

  const pMax_ = 20;
  const qA = 10, qV = 30;
  const yPmax = pToY(pMax_);
  const xA = qToX(qA), xV = qToX(qV);
  const xEq = qToX(20), yEq = pToY(30);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs><marker id="ahmx" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/></marker></defs>

  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Maximumprijs onder P*  →  vraagoverschot (tekort)</text>

  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ahmx)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ahmx)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Tekort (vraagoverschot) rectangle -->
  <rect x="${xA}" y="${yPmax}" width="${xV - xA}" height="22" fill="${GC.shortage}" fill-opacity="0.55"/>

  <!-- Curves -->
  <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v2x-18}" y="${v2y-6}" font-size="12" font-weight="bold" fill="${GC.demand}">V</text>
  <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${GC.supply}" stroke-width="2.5"/>
  <text x="${a2x+6}" y="${a2y-6}" font-size="12" font-weight="bold" fill="${GC.supply}">A</text>

  <!-- Pmax horizontal line -->
  <line x1="${px}" y1="${yPmax}" x2="${px+pw}" y2="${yPmax}" stroke="#1A5276" stroke-width="2" stroke-dasharray="6,3"/>

  <!-- Equilibrium -->
  <circle cx="${xEq}" cy="${yEq}" r="4" fill="${GC.axis}" opacity="0.5"/>
  <line x1="${xEq}" y1="${yEq}" x2="${xEq}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yEq}" x2="${xEq}" y2="${yEq}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Dots at Pmax on A and V -->
  <circle cx="${xA}" cy="${yPmax}" r="5" fill="${GC.supply}"/>
  <circle cx="${xV}" cy="${yPmax}" r="5" fill="${GC.demand}"/>
  <line x1="${xA}" y1="${yPmax}" x2="${xA}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${xV}" y1="${yPmax}" x2="${xV}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <text x="${(xA+xV)/2}" y="${yPmax + 38}" text-anchor="middle" font-size="11" font-weight="bold" fill="#922B21">vraag­overschot = 20  (tekort)</text>

  <text x="72" y="${yEq+4}" text-anchor="end" font-size="10" fill="${GC.axis}">P* = 30</text>
  <text x="72" y="${yPmax+4}" text-anchor="end" font-size="10" fill="#1A5276" font-weight="bold">Pmax = 20</text>
  <text x="${xA}" y="325" text-anchor="middle" font-size="10" fill="${GC.supply}">Q_A = 10</text>
  <text x="${xEq}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">Q* = 20</text>
  <text x="${xV}" y="325" text-anchor="middle" font-size="10" fill="${GC.demand}">Q_V = 30</text>

  <text x="360" y="348" text-anchor="middle" font-size="10" fill="${GC.label}" font-style="italic">Bij Pmax: consumenten willen veel kopen, aanbieders leveren weinig.</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 4: MINIMUMLOON op de arbeidsmarkt
// V_arbeid: W = 40 - L/2 → (L=0,W=40)..(L=80,W=0)
// A_arbeid: W = L/2 + 10 → (L=0,W=10)..(L=60,W=40)
// Eq: L=30, W=25  ;  Wmin=30: V_a→L=20 (vraag), A_a→L=40 (aanbod). Werkloosheid=20.
// NB: op arbeidsmarkt is V = vraag naar arbeid door bedrijven, A = aanbod door werknemers
// ═══════════════════════════════════════════════════════════════════════════
function buildMinimumloonSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const lMax = 80, wMax = 45;
  const lToX = l => Math.round(px + (l / lMax) * pw);
  const wToY = w => Math.round(py + ph - (w / wMax) * ph);

  // V_a: W = 40 - L/2 → (0,40)..(80,0)
  const v1x = lToX(0), v1y = wToY(40);
  const v2x = lToX(80), v2y = wToY(0);
  // A_a: W = L/2 + 10 → (0,10)..(60,40)
  const a1x = lToX(0), a1y = wToY(10);
  const a2x = lToX(60), a2y = wToY(40);

  const wMin = 30;
  const lVraag = 20, lAanbod = 40;
  const yWmin = wToY(wMin);
  const xV = lToX(lVraag), xA = lToX(lAanbod);
  const xEq = lToX(30), yEq = wToY(25);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs><marker id="ahml" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/></marker></defs>

  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Minimumloon boven evenwichtsloon  →  werkloosheid</text>

  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ahml)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ahml)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Loon (W)</text>
  <text x="360" y="355" text-anchor="middle" font-size="12" fill="${GC.label}">Arbeid (L)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Werkloosheid rechthoek -->
  <rect x="${xV}" y="${yWmin-22}" width="${xA - xV}" height="22" fill="${GC.loss}" fill-opacity="0.55"/>

  <!-- Curves -->
  <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v2x-20}" y="${v2y-6}" font-size="12" font-weight="bold" fill="${GC.demand}">V_a</text>
  <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${GC.supply}" stroke-width="2.5"/>
  <text x="${a2x+6}" y="${a2y-6}" font-size="12" font-weight="bold" fill="${GC.supply}">A_a</text>

  <!-- Wmin horizontal -->
  <line x1="${px}" y1="${yWmin}" x2="${px+pw}" y2="${yWmin}" stroke="#186A3B" stroke-width="2" stroke-dasharray="6,3"/>

  <!-- Equilibrium -->
  <circle cx="${xEq}" cy="${yEq}" r="4" fill="${GC.axis}" opacity="0.5"/>
  <line x1="${xEq}" y1="${yEq}" x2="${xEq}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yEq}" x2="${xEq}" y2="${yEq}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Dots -->
  <circle cx="${xV}" cy="${yWmin}" r="5" fill="${GC.demand}"/>
  <circle cx="${xA}" cy="${yWmin}" r="5" fill="${GC.supply}"/>
  <line x1="${xV}" y1="${yWmin}" x2="${xV}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${xA}" y1="${yWmin}" x2="${xA}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Werkloosheid-label -->
  <text x="${(xV+xA)/2}" y="${yWmin - 28}" text-anchor="middle" font-size="11" font-weight="bold" fill="#922B21">werkloosheid = 20</text>

  <text x="72" y="${yWmin+4}" text-anchor="end" font-size="10" fill="#186A3B" font-weight="bold">Wmin = 30</text>
  <text x="72" y="${yEq+4}" text-anchor="end" font-size="10" fill="${GC.axis}">W* = 25</text>
  <text x="${xV}" y="${py+ph+16}" text-anchor="middle" font-size="10" fill="${GC.demand}">L_V = 20</text>
  <text x="${xEq}" y="${py+ph+16}" text-anchor="middle" font-size="10" fill="${GC.axis}">L* = 30</text>
  <text x="${xA}" y="${py+ph+16}" text-anchor="middle" font-size="10" fill="${GC.supply}">L_A = 40</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 5: ACCIJNS (A shift up by t, burden split)
// V: P = 20 - Q ;  A: P = Q  → Eq: Q=10, P=10
// Accijns t=6: A' = Q+6  → New Eq: Q=7, P=13
// Consumer pays 13 (+3), producer receives 7 (-3). Tax revenue = 6×7 = 42.
// ═══════════════════════════════════════════════════════════════════════════
function buildAccijnsSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 22, pMax = 22;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  const v1x = qToX(0), v1y = pToY(20);
  const v2x = qToX(20), v2y = pToY(0);
  const a1x = qToX(0), a1y = pToY(0);
  const a2x = qToX(20), a2y = pToY(20);
  const an1x = qToX(0), an1y = pToY(6);
  const an2x = qToX(14), an2y = pToY(20);

  const qOld = 10, pOld = 10;
  const qNew = 7,  pNew = 13;
  const pProd = 7; // producer receives
  const xOld = qToX(qOld), yOld = pToY(pOld);
  const xNew = qToX(qNew), yNew = pToY(pNew);
  const yProd = pToY(pProd);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs><marker id="aha" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/></marker></defs>

  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Accijns: aanbod omhoog, prijs stijgt, last gedeeld</text>

  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#aha)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#aha)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Belastingopbrengst rechthoek (0..Qn, tussen Pn en Pprod) -->
  <rect x="${px}" y="${yNew}" width="${xNew - px}" height="${yProd - yNew}" fill="${GC.tax}" fill-opacity="0.60"/>

  <!-- Consumer burden (boven evenwicht): tussen Pold en Pnew, 0..Qn -->
  <rect x="${px}" y="${yNew}" width="${xNew - px}" height="${yOld - yNew}" fill="${GC.loss}" fill-opacity="0.35"/>
  <text x="${(px + xNew)/2}" y="${(yNew + yOld)/2 + 4}" text-anchor="middle" font-size="10" font-weight="bold" fill="#922B21">consument (+3)</text>

  <!-- Producer burden: tussen Pold en Pprod -->
  <rect x="${px}" y="${yOld}" width="${xNew - px}" height="${yProd - yOld}" fill="${GC.prodSurplus}" fill-opacity="0.40"/>
  <text x="${(px + xNew)/2}" y="${(yOld + yProd)/2 + 4}" text-anchor="middle" font-size="10" font-weight="bold" fill="#186A3B">producent (-3)</text>

  <!-- Dashed refs -->
  <line x1="${xOld}" y1="${yOld}" x2="${xOld}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yOld}" x2="${xOld}" y2="${yOld}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${xNew}" y1="${yNew}" x2="${xNew}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yNew}" x2="${xNew}" y2="${yNew}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yProd}" x2="${xNew}" y2="${yProd}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Curves -->
  <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v2x+6}" y="${v2y-6}" font-size="12" font-weight="bold" fill="${GC.demand}">V</text>
  <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${GC.supply}" stroke-width="2" stroke-dasharray="6,4" opacity="0.75"/>
  <text x="${a2x+6}" y="${a2y+4}" font-size="11" font-weight="bold" fill="${GC.supply}" opacity="0.85">A (oud)</text>
  <line x1="${an1x}" y1="${an1y}" x2="${an2x}" y2="${an2y}" stroke="${GC.supplyNew}" stroke-width="2.5"/>
  <text x="${an2x+6}" y="${an2y-6}" font-size="12" font-weight="bold" fill="${GC.supplyNew}">A + accijns</text>

  <!-- Shift arrow -->
  <line x1="${qToX(14)}" y1="${pToY(16)}" x2="${qToX(14)-52}" y2="${pToY(16)}" stroke="${GC.supplyNew}" stroke-width="1.8" marker-end="url(#aha)"/>

  <!-- Dots -->
  <circle cx="${xOld}" cy="${yOld}" r="5" fill="${GC.supply}" opacity="0.85"/>
  <circle cx="${xNew}" cy="${yNew}" r="5" fill="${GC.supplyNew}"/>

  <!-- Axis labels -->
  <text x="72" y="${pToY(20)+4}" text-anchor="end" font-size="10" fill="${GC.label}">20</text>
  <text x="72" y="${yNew+4}" text-anchor="end" font-size="10" fill="${GC.axis}" font-weight="bold">13</text>
  <text x="72" y="${yOld+4}" text-anchor="end" font-size="10" fill="${GC.axis}">10</text>
  <text x="72" y="${yProd+4}" text-anchor="end" font-size="10" fill="${GC.axis}">7</text>
  <text x="${xNew}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}" font-weight="bold">7</text>
  <text x="${xOld}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">10</text>

  <text x="360" y="348" text-anchor="middle" font-size="10" fill="${GC.label}" font-style="italic">Accijns t = €6 per eenheid   |   consument betaalt 3, producent draagt 3</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 6: SUBSIDIE (A shift down by s, CS + PS gains)
// V: P = 20 - Q ;  A: P = Q  → Eq: Q=10, P=10
// Subsidie s=4: A' = Q-4 → New Eq: 20-Q = Q-4 → Q=12, P=8
// Consumer pays 8 (-2), producer receives 8+4=12 (+2). Gov cost = 4*12 = 48.
// ═══════════════════════════════════════════════════════════════════════════
function buildSubsidieSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 22, pMax = 22;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  const v1x = qToX(0), v1y = pToY(20), v2x = qToX(20), v2y = pToY(0);
  const a1x = qToX(0), a1y = pToY(0),  a2x = qToX(20), a2y = pToY(20);
  // A_new: P = Q - 4 → (0,-4) invalid so start at Q=4 where P=0 → (4,0)..(22,18)
  // But for drawing: from (4,0) to (20,16) or similar
  const an1x = qToX(4), an1y = pToY(0);
  const an2x = qToX(20), an2y = pToY(16);

  const qOld = 10, pOld = 10;
  const qNew = 12, pNew = 8;
  const pProd = 12; // producer receives
  const xOld = qToX(qOld), yOld = pToY(pOld);
  const xNew = qToX(qNew), yNew = pToY(pNew);
  const yProd = pToY(pProd);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs><marker id="ahs" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/></marker></defs>

  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Subsidie: aanbod omlaag, prijs daalt, hoeveelheid stijgt</text>

  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ahs)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ahs)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Subsidiekosten rechthoek (0..Qn, tussen Pprod en Pn) -->
  <rect x="${px}" y="${yProd}" width="${xNew - px}" height="${yNew - yProd}" fill="${GC.tax}" fill-opacity="0.55"/>
  <text x="${(px + xNew)/2}" y="${(yProd + yNew)/2 + 4}" text-anchor="middle" font-size="11" font-weight="bold" fill="#7B4A12">subsidiekosten</text>

  <!-- Dashed refs -->
  <line x1="${xOld}" y1="${yOld}" x2="${xOld}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yOld}" x2="${xOld}" y2="${yOld}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${xNew}" y1="${yNew}" x2="${xNew}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yNew}" x2="${xNew}" y2="${yNew}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yProd}" x2="${xNew}" y2="${yProd}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Curves -->
  <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v2x+6}" y="${v2y-6}" font-size="12" font-weight="bold" fill="${GC.demand}">V</text>
  <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${GC.supply}" stroke-width="2" stroke-dasharray="6,4" opacity="0.75"/>
  <text x="${a2x+6}" y="${a2y+4}" font-size="11" font-weight="bold" fill="${GC.supply}" opacity="0.85">A (oud)</text>
  <line x1="${an1x}" y1="${an1y}" x2="${an2x}" y2="${an2y}" stroke="${GC.supplyNew}" stroke-width="2.5"/>
  <text x="${an2x+6}" y="${an2y-6}" font-size="12" font-weight="bold" fill="${GC.supplyNew}">A  subsidie</text>

  <!-- Shift arrow down -->
  <line x1="${qToX(14)}" y1="${pToY(14)}" x2="${qToX(14)}" y2="${pToY(14)+30}" stroke="${GC.supplyNew}" stroke-width="1.8" marker-end="url(#ahs)"/>

  <!-- Dots -->
  <circle cx="${xOld}" cy="${yOld}" r="5" fill="${GC.supply}" opacity="0.85"/>
  <circle cx="${xNew}" cy="${yNew}" r="5" fill="${GC.supplyNew}"/>

  <!-- Subsidiebedrag bracket (far left, outside label zone) -->
  <line x1="35" y1="${yNew}" x2="35" y2="${yProd}" stroke="#7B4A12" stroke-width="1.5"/>
  <line x1="31" y1="${yNew}" x2="39" y2="${yNew}" stroke="#7B4A12" stroke-width="1.5"/>
  <line x1="31" y1="${yProd}" x2="39" y2="${yProd}" stroke="#7B4A12" stroke-width="1.5"/>
  <text x="30" y="${(yNew + yProd)/2 + 4}" text-anchor="end" font-size="10" fill="#7B4A12" font-weight="bold">s=4</text>

  <!-- Axis labels -->
  <text x="72" y="${pToY(20)+4}" text-anchor="end" font-size="10" fill="${GC.label}">20</text>
  <text x="72" y="${yProd+4}" text-anchor="end" font-size="10" fill="${GC.axis}">12</text>
  <text x="72" y="${yOld+4}" text-anchor="end" font-size="10" fill="${GC.axis}">10</text>
  <text x="72" y="${yNew+4}" text-anchor="end" font-size="10" fill="${GC.axis}" font-weight="bold">8</text>
  <text x="${xOld}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">10</text>
  <text x="${xNew}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}" font-weight="bold">12</text>

  <text x="360" y="348" text-anchor="middle" font-size="10" fill="${GC.label}" font-style="italic">Subsidie s = €4 per eenheid   |   consument betaalt €8, producent ontvangt €12</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE HELPERS
// ═══════════════════════════════════════════════════════════════════════════
function addTitleMaster(pres) {
  pres.defineSlideMaster({
    title: "TITLE_DARK", background: { color: C.navy },
    objects: [
      { rect: { x: 0, y: 0, w: 10, h: 0.06, fill: { color: DOMAIN.color } } },
      { rect: { x: 0, y: 5.15, w: 10, h: 0.475, fill: { color: "151D4A" } } },
    ],
  });
}
function addContentMaster(pres) {
  pres.defineSlideMaster({
    title: "CONTENT", background: { color: C.white },
    objects: [{ rect: { x: 0, y: 0, w: 10, h: 0.75, fill: { color: DOMAIN.color } } }],
  });
}
function addContentSlide(pres, title) {
  const slide = pres.addSlide({ masterName: "CONTENT" });
  slide.addText(title, {
    x: 0.5, y: 0, w: 9, h: 0.75,
    fontSize: 24, fontFace: "Arial", color: C.white, bold: true, valign: "middle",
  });
  return slide;
}
function drawCard(slide, x, y, w, h, accentColor, bgColor, title, titleColor, bodyParts) {
  slide.addShape("rect", { x, y, w, h, fill: { color: bgColor }, rectRadius: 0.05, shadow: makeShadow() });
  slide.addShape("rect", { x, y, w: 0.06, h, fill: { color: accentColor } });
  slide.addText(title, {
    x: x + 0.2, y: y + 0.12, w: w - 0.35, h: 0.4,
    fontSize: 18, fontFace: "Arial", color: titleColor, bold: true, valign: "top", margin: 0,
  });
  if (bodyParts && bodyParts.length) {
    slide.addText(bodyParts, {
      x: x + 0.2, y: y + 0.55, w: w - 0.35, h: h - 0.7,
      fontSize: 13, fontFace: "Arial", color: C.dark, valign: "top", align: "left",
      lineSpacingMultiple: 1.2, margin: 0,
    });
  }
}
function drawGraph(slide, img) {
  slide.addImage({ data: img, x: 0.75, y: 0.95, w: 8.5, h: 4.25 });
}
function drawGraphWithLegend(slide, img, items) {
  slide.addImage({ data: img, x: 1.0, y: 0.82, w: 8.0, h: 4.0 });
  const lx = 0.5, ly = 4.90, lw = 9.0, lh = 0.62;
  slide.addShape("rect", { x: lx, y: ly, w: lw, h: lh,
    fill: { color: C.lightGray }, line: { color: C.borderGray, width: 0.5 } });
  const cellW = lw / items.length;
  items.forEach((it, i) => {
    const cx = lx + i * cellW;
    slide.addShape("rect", { x: cx + 0.12, y: ly + 0.17, w: 0.22, h: 0.22, fill: { color: it.color } });
    slide.addText([
      { text: it.abbr, options: { bold: true, color: it.color } },
      { text: "  " + it.desc, options: { color: C.dark } },
    ], {
      x: cx + 0.42, y: ly + 0.08, w: cellW - 0.5, h: lh - 0.16,
      fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
    });
  });
}
function drawFlow(slide, steps, opts = {}) {
  const sx = opts.x ?? 1.3, sy = opts.y ?? 1.1, sw = opts.w ?? 7.4, sh = opts.h ?? 0.6, gap = 0.12;
  const hiColor = opts.hiColor || DOMAIN.color;
  steps.forEach((st, i) => {
    const y = sy + i * (sh + gap);
    slide.addShape("rect", { x: sx, y, w: sw, h: sh,
      fill: { color: st.hi ? hiColor : C.cream }, rectRadius: 0.04, shadow: makeShadow() });
    const pref = i > 0 ? "\u2193  " : "";
    slide.addText(pref + st.t, {
      x: sx + 0.2, y, w: sw - 0.3, h: sh,
      fontSize: 14, fontFace: "Arial", color: st.hi ? C.white : C.dark, bold: st.hi,
      valign: "middle", margin: 0,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD
// ═══════════════════════════════════════════════════════════════════════════
async function build() {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: "CUSTOM_16x9", width: 10, height: 5.625 });
  pres.layout = "CUSTOM_16x9";
  pres.author = "Economie VWO";
  pres.title = "3.3.2 Overheidsbeleid";

  addTitleMaster(pres);
  addContentMaster(pres);

  const svgEntries = [
    { name: "332-overzicht-prijsbeleid",    svg: buildOverzichtSVG() },
    { name: "332-minimumprijs",             svg: buildMinimumprijsSVG() },
    { name: "332-maximumprijs",             svg: buildMaximumprijsSVG() },
    { name: "332-minimumloon",              svg: buildMinimumloonSVG() },
    { name: "332-accijns",                  svg: buildAccijnsSVG() },
    { name: "332-subsidie",                 svg: buildSubsidieSVG() },
  ];
  const bufs = await Promise.all(svgEntries.map(e => svgToPng(e.svg)));
  const [gOv, gMin, gMax, gMl, gAcc, gSub] = bufs.map(pngToBase64);

  // ── DIA 1: Titel ──────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Overheidsbeleid", { x: 0.7, y: 1.2, w: 8.6, h: 2,
      fontSize: 40, fontFace: "Arial", color: C.white, bold: true });
    s.addText("Paragraaf 3.3.2", { x: 0.7, y: 3.2, w: 8.6, h: 0.5,
      fontSize: 20, fontFace: "Arial", color: C.gray });
    s.addText("Hoofdstuk 3: Overheid  |  Economie VWO", { x: 0.7, y: 5.15, w: 8.6, h: 0.475,
      fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle" });
    s.addNotes("In deze paragraaf gaan we kijken naar vier concrete prijsinstrumenten: minimumprijs, maximumprijs, accijns en subsidie. De rode draad: de overheid stuurt markten via de prijs.");
  }

  // ── DIA 2: Leerdoelen ─────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Wat ga je leren?");
    const doelen = [
      "Begrijpen waarom de overheid ingrijpt in markten",
      "Minimumprijs en maximumprijs analyseren in een V/A-grafiek",
      "Minimumloon toepassen op de arbeidsmarkt",
      "Het effect van een accijns uitleggen (burden split)",
      "Het effect van een subsidie op prijs en hoeveelheid analyseren",
    ];
    s.addText(doelen.join("\n"), { x: 0.7, y: 1.15, w: 8.6, h: 3.6,
      bullet: { code: "25A0" }, fontSize: 17, fontFace: "Arial", color: C.dark,
      paraSpaceAfter: 10, lineSpacingMultiple: 1.25 });
    s.addNotes("Kondig de vijf leerdoelen aan. Benadruk dat accijns en subsidie spiegelbeeld zijn.");
  }

  // ── DIA 3: Overzicht prijsbeleid ──────────────────────────────────
  {
    const s = addContentSlide(pres, "Vier instrumenten in \u00E9\u00E9n oogopslag");
    drawGraph(s, gOv);
    s.addNotes("De kapstok. Links: overheid verlaagt de prijs (maximumprijs, subsidie). Rechts: overheid verhoogt de prijs (accijns, minimumprijs). Elk vakje komt in een eigen dia terug.");
  }

  // ── DIA 4: Waarom grijpt de overheid in? ──────────────────────────
  {
    const s = addContentSlide(pres, "Waarom grijpt de overheid in?");
    drawFlow(s, [
      { t: "De markt levert niet altijd het beste resultaat (marktfalen)",         hi: false },
      { t: "Monopolie, externe effecten, ongelijke verdeling",                       hi: false },
      { t: "Overheid zet beleidsinstrumenten in: prijzen, belastingen, subsidies",   hi: true  },
      { t: "Doel: meer welvaart \u00E9n eerlijkere verdeling",                         hi: false },
    ]);
    s.addNotes("Link terug naar §3.3.1: marktfalen is de reden om in te grijpen. Dit hoofdstuk behandelt de concrete prijsinstrumenten.");
  }

  // ── DIA 5: Minimumprijs (theorie) ─────────────────────────────────
  {
    const s = addContentSlide(pres, "Bindende minimumprijs — theorie");
    drawCard(s, 0.5, 1.05, 4.3, 3.9, "#186A3B", "#E8F8F0", "Definitie", "186A3B",
      [
        { text: "Wettelijke minimumprijs", options: { bullet: { code: "25A0" }, bold: true, breakLine: true } },
        { text: "Pmin > P*  \u2192 bindend", options: { bullet: { code: "25A0" }, breakLine: true } },
        { text: "Prijs mag niet onder Pmin", options: { bullet: { code: "25A0" }, breakLine: true } },
        { text: "Gevolg: aanbodoverschot", options: { bullet: { code: "25A0" }, bold: true, color: "922B21", breakLine: true } },
        { text: "\u2192 overheid koopt overschot (bv. melk)", options: { fontSize: 12, italic: true, color: C.gray } },
      ]);
    drawCard(s, 5.2, 1.05, 4.3, 3.9, DOMAIN.color, C.cream, "Voorbeeld: melk", DOMAIN.dark,
      [
        { text: "De overheid beschermt boeren met een garantieprijs boven het evenwicht.", options: { breakLine: true } },
        { text: "Gevolg: boeren produceren meer dan consumenten kopen \u2192 overschot.", options: { breakLine: true } },
        { text: "De overheid koopt het overschot op (boterberg, melkplas in de jaren 80).", options: {} },
      ]);
    s.addNotes("Pmin is alleen bindend als hij BOVEN het marktevenwicht ligt. Vraag de klas: wat gebeurt er als Pmin onder P* ligt? (niets — markt mag boven Pmin uitkomen).");
  }

  // ── DIA 6: Minimumprijs — grafiek ─────────────────────────────────
  {
    const s = addContentSlide(pres, "Minimumprijs in de grafiek");
    drawGraphWithLegend(s, gMin, [
      { color: "1A5276", abbr: "V",    desc: "vraag" },
      { color: "1E8449", abbr: "A",    desc: "aanbod" },
      { color: "186A3B", abbr: "Pmin", desc: "wettelijke ondergrens" },
      { color: "D9534F", abbr: "\u25A0", desc: "aanbodoverschot" },
    ]);
    s.addNotes("Lees samen: bij Pmin=40 vragen consumenten Q_V=10, aanbieders leveren Q_A=30. Het rode blok (20 eenheden) is het aanbodoverschot.");
  }

  // ── DIA 7: Maximumprijs (theorie) ─────────────────────────────────
  {
    const s = addContentSlide(pres, "Bindende maximumprijs — theorie");
    drawCard(s, 0.5, 1.05, 4.3, 3.9, DOMAIN.color, C.dBlueLt, "Definitie", DOMAIN.dark,
      [
        { text: "Wettelijke maximumprijs", options: { bullet: { code: "25A0" }, bold: true, breakLine: true } },
        { text: "Pmax < P*  \u2192 bindend", options: { bullet: { code: "25A0" }, breakLine: true } },
        { text: "Prijs mag niet boven Pmax", options: { bullet: { code: "25A0" }, breakLine: true } },
        { text: "Gevolg: vraagoverschot (tekort)", options: { bullet: { code: "25A0" }, bold: true, color: "922B21", breakLine: true } },
        { text: "\u2192 wachtlijsten, zwarte markt", options: { fontSize: 12, italic: true, color: C.gray } },
      ]);
    drawCard(s, 5.2, 1.05, 4.3, 3.9, C.red, C.lightRed, "Voorbeeld: huurplafond", "922B21",
      [
        { text: "De overheid beschermt huurders met een maximumhuur onder het evenwicht.", options: { breakLine: true } },
        { text: "Gevolg: meer vraag dan aanbod \u2192 woningtekort.", options: { breakLine: true } },
        { text: "Lange wachtlijsten en ongecontroleerde doorverhuur.", options: {} },
      ]);
    s.addNotes("Pmax is alleen bindend als hij ONDER P* ligt. Benadruk de ongewenste neveneffecten: wachtlijsten, zwarte markt, kwaliteitsverlies.");
  }

  // ── DIA 8: Maximumprijs — grafiek ─────────────────────────────────
  {
    const s = addContentSlide(pres, "Maximumprijs in de grafiek");
    drawGraphWithLegend(s, gMax, [
      { color: "1A5276", abbr: "V",    desc: "vraag" },
      { color: "1E8449", abbr: "A",    desc: "aanbod" },
      { color: "1A5276", abbr: "Pmax", desc: "wettelijke bovengrens" },
      { color: "D9534F", abbr: "\u25A0", desc: "vraagoverschot (tekort)" },
    ]);
    s.addNotes("Bij Pmax=20 willen consumenten Q_V=30, aanbieders leveren slechts Q_A=10. Het rode blok is het tekort (20 eenheden).");
  }

  // ── DIA 9: Wanneer bindend? ───────────────────────────────────────
  {
    const s = addContentSlide(pres, "Wanneer is een prijsmaatregel bindend?");
    drawCard(s, 0.5, 1.05, 4.3, 3.9, "#186A3B", "#E8F8F0", "Minimumprijs", "186A3B",
      [
        { text: "Pmin > P*  \u2192 BINDEND", options: { bullet: { code: "25A0" }, bold: true, color: "186A3B", breakLine: true } },
        { text: "Prijs kan niet zakken naar P*", options: { bullet: { code: "25A0" }, breakLine: true } },
        { text: "\u2192 aanbodoverschot", options: { bullet: { code: "25A0" }, bold: true, color: "922B21", breakLine: true } },
        { text: "", options: { breakLine: true } },
        { text: "Pmin < P*  \u2192 niet bindend", options: { bullet: { code: "25A0" }, italic: true, color: C.gray, breakLine: true } },
        { text: "Markt komt boven Pmin uit — geen effect", options: { fontSize: 12, italic: true, color: C.gray } },
      ]);
    drawCard(s, 5.2, 1.05, 4.3, 3.9, DOMAIN.color, C.cream, "Maximumprijs", DOMAIN.dark,
      [
        { text: "Pmax < P*  \u2192 BINDEND", options: { bullet: { code: "25A0" }, bold: true, color: DOMAIN.dark, breakLine: true } },
        { text: "Prijs kan niet stijgen naar P*", options: { bullet: { code: "25A0" }, breakLine: true } },
        { text: "\u2192 vraagoverschot", options: { bullet: { code: "25A0" }, bold: true, color: "922B21", breakLine: true } },
        { text: "", options: { breakLine: true } },
        { text: "Pmax > P*  \u2192 niet bindend", options: { bullet: { code: "25A0" }, italic: true, color: C.gray, breakLine: true } },
        { text: "Markt komt onder Pmax uit — geen effect", options: { fontSize: 12, italic: true, color: C.gray } },
      ]);
    s.addNotes("Ezelsbrug: 'Minimum BOVEN, Maximum ONDER' — alleen dan bijt de maatregel.");
  }

  // ── DIA 10: Minimumloon (theorie) ─────────────────────────────────
  {
    const s = addContentSlide(pres, "Minimumloon op de arbeidsmarkt");
    drawCard(s, 0.5, 1.05, 4.3, 3.9, "#186A3B", "#E8F8F0", "Wat is het?", "186A3B",
      [
        { text: "Minimumloon = minimumprijs op de arbeidsmarkt", options: { bullet: { code: "25A0" }, bold: true, breakLine: true } },
        { text: "Ligt boven het evenwichtsloon", options: { bullet: { code: "25A0" }, breakLine: true } },
        { text: "Bedrijven = vraag naar arbeid (V_a)", options: { bullet: { code: "25A0" }, breakLine: true } },
        { text: "Werknemers = aanbod arbeid (A_a)", options: { bullet: { code: "25A0" }, breakLine: true } },
        { text: "\u2192 aanbod > vraag \u2192 werkloosheid", options: { bold: true, color: "922B21" } },
      ]);
    drawCard(s, 5.2, 1.05, 4.3, 3.9, DOMAIN.color, C.cream, "Voordeel  \u2194  nadeel", DOMAIN.dark,
      [
        { text: "\u2713  Wie werk heeft verdient meer", options: { bullet: false, fontSize: 14, color: "186A3B", bold: true, breakLine: true } },
        { text: "\u2192 bescherming van de onderkant", options: { fontSize: 12, italic: true, color: C.gray, breakLine: true } },
        { text: "", options: { breakLine: true } },
        { text: "\u2717  Meer werkloosheid", options: { bullet: false, fontSize: 14, color: "922B21", bold: true, breakLine: true } },
        { text: "\u2192 vooral jongeren en laagopgeleiden", options: { fontSize: 12, italic: true, color: C.gray } },
      ]);
    s.addNotes("Let op de as-labels op de arbeidsmarkt: W (loon) op verticaal, L (arbeid) op horizontaal. Dit is structureel hetzelfde als een minimumprijs op een goederenmarkt.");
  }

  // ── DIA 11: Minimumloon — grafiek ─────────────────────────────────
  {
    const s = addContentSlide(pres, "Minimumloon in de grafiek");
    drawGraphWithLegend(s, gMl, [
      { color: "1A5276", abbr: "V_a",  desc: "vraag naar arbeid (bedrijven)" },
      { color: "1E8449", abbr: "A_a",  desc: "aanbod arbeid (werknemers)" },
      { color: "186A3B", abbr: "Wmin", desc: "wettelijk minimumloon" },
      { color: "D9534F", abbr: "\u25A0", desc: "werkloosheid" },
    ]);
    s.addNotes("Bij Wmin=30 vragen bedrijven 20 arbeiders, maar 40 willen werken. Het rode blok (20) is de werkloosheid.");
  }

  // ── DIA 12: Accijns (theorie) ─────────────────────────────────────
  {
    const s = addContentSlide(pres, "Accijns — theorie");
    drawFlow(s, [
      { t: "Overheid heft accijns per eenheid", hi: false },
      { t: "Aanbodlijn verschuift parallel omhoog (met de accijns)", hi: false },
      { t: "De evenwichtsprijs stijgt  \u2014  maar MINDER dan de accijns", hi: true },
      { t: "Consumenten kopen minder, hoeveelheid daalt", hi: false },
      { t: "De last wordt gedeeld tussen koper \u00E9n verkoper", hi: true },
    ], { hiColor: "#7B2D8E" });
    s.addNotes("Kernpunt: de prijsstijging is kleiner dan de accijns. Dat komt omdat consumenten minder gaan kopen als de prijs stijgt — dus de producent moet ook een deel van de accijns dragen.");
  }

  // ── DIA 13: Accijns — grafiek ─────────────────────────────────────
  {
    const s = addContentSlide(pres, "Accijns in de grafiek");
    drawGraphWithLegend(s, gAcc, [
      { color: "1A5276", abbr: "V",      desc: "vraag" },
      { color: "E67E22", abbr: "A+acc.", desc: "aanbod na accijns" },
      { color: "F8C471", abbr: "\u25A0", desc: "belastingopbrengst" },
      { color: "D9534F", abbr: "\u25A0", desc: "consumentenlast (+3)" },
    ]);
    s.addNotes("Accijns t=€6. Prijs stijgt van 10 naar 13 (consument +3). Producent ontvangt 7 (-3). De gele rechthoek is de belastingopbrengst (6 × 7 = €42).");
  }

  // ── DIA 14: Subsidie (theorie) ────────────────────────────────────
  {
    const s = addContentSlide(pres, "Subsidie — theorie");
    drawFlow(s, [
      { t: "Subsidie = het spiegelbeeld van een accijns", hi: false },
      { t: "Aanbodlijn verschuift parallel omlaag (met het subsidiebedrag)", hi: false },
      { t: "Prijs voor consument daalt, hoeveelheid stijgt", hi: true },
      { t: "Zowel CS als PS stijgen — beide profiteren", hi: false },
      { t: "Kosten voor de overheid: subsidie \u00D7 nieuwe hoeveelheid", hi: true },
    ], { hiColor: "#E67E22" });
    s.addNotes("Een subsidie heeft omgekeerde effecten: prijs omlaag, hoeveelheid omhoog, beide partijen winnen. De kosten komen uit de schatkist.");
  }

  // ── DIA 15: Subsidie — grafiek ────────────────────────────────────
  {
    const s = addContentSlide(pres, "Subsidie in de grafiek");
    drawGraphWithLegend(s, gSub, [
      { color: "1A5276", abbr: "V",      desc: "vraag" },
      { color: "E67E22", abbr: "A-sub.", desc: "aanbod na subsidie" },
      { color: "F8C471", abbr: "\u25A0", desc: "subsidiekosten" },
      { color: "7B4A12", abbr: "s",      desc: "subsidie per eenheid" },
    ]);
    s.addNotes("Subsidie s=€4. Consument betaalt €8 (was €10), producent ontvangt €12 (was €10). De gele rechthoek = overheidskosten (4 × 12 = €48).");
  }

  // ── DIA 16: Valkuilen ─────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Valkuilen");
    const items = [
      { title: "\u201CEen minimumprijs helpt altijd\u201D",
        body: "Onjuist. Alleen bindend als Pmin > P*. En zelfs dan ontstaat er een aanbodoverschot waar niemand op zit te wachten." },
      { title: "\u201CBij een accijns stijgt de prijs met het volle accijnsbedrag\u201D",
        body: "Onjuist. De prijsstijging is kleiner dan de accijns — de last wordt gedeeld tussen consument en producent." },
      { title: "\u201CEen maximumprijs maakt alles goedkoper voor iedereen\u201D",
        body: "Onjuist. Er ontstaat een tekort: sommigen betalen minder, maar anderen krijgen het product helemaal niet." },
    ];
    const sx = 0.6, sy = 1.05, sw = 8.8, sh = 1.17, gap = 0.14;
    items.forEach((it, i) => {
      const y = sy + i * (sh + gap);
      s.addShape("rect", { x: sx, y, w: sw, h: sh, fill: { color: C.lightRed }, rectRadius: 0.04 });
      s.addShape("rect", { x: sx, y, w: 0.06, h: sh, fill: { color: C.red } });
      s.addText(it.title, { x: sx + 0.25, y: y + 0.1, w: sw - 0.4, h: 0.4,
        fontSize: 16, fontFace: "Arial", color: "922B21", bold: true, margin: 0, valign: "top" });
      s.addText(it.body, { x: sx + 0.25, y: y + 0.48, w: sw - 0.4, h: sh - 0.55,
        fontSize: 13, fontFace: "Arial", color: C.dark, margin: 0, valign: "top", lineSpacingMultiple: 1.2 });
    });
    s.addNotes("Benadruk valkuil 2: dit is een klassieke toetsvraag. De hele truc van de burden split hangt hiervan af.");
  }

  // ── DIA 17: Samenvatting ──────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Samenvatting", { x: 0.7, y: 0.35, w: 8.6, h: 0.6,
      fontSize: 30, fontFace: "Arial", color: C.white, bold: true });
    s.addText("Check: beheers je dit voordat je gaat oefenen?", { x: 0.7, y: 0.95, w: 8.6, h: 0.4,
      fontSize: 14, fontFace: "Arial", color: C.gray, italic: true });
    const punten = [
      "Minimumprijs boven P*  \u2192  aanbodoverschot (bv. melkgarantieprijs)",
      "Maximumprijs onder P*  \u2192  vraagoverschot / tekort (bv. huurplafond)",
      "Minimumloon = minimumprijs op de arbeidsmarkt  \u2192  werkloosheid bij Wmin > W*",
      "Accijns  \u2192  A verschuift omhoog, prijs stijgt, last gedeeld tussen consument en producent",
      "Subsidie  \u2192  A verschuift omlaag, prijs daalt, hoeveelheid stijgt, overheid betaalt",
      "Een prijsmaatregel is alleen bindend als hij het evenwicht blokkeert",
    ];
    s.addText(punten.join("\n"), { x: 0.7, y: 1.55, w: 8.6, h: 3.5,
      bullet: { code: "25A0" }, fontSize: 15, fontFace: "Arial", color: C.white,
      paraSpaceAfter: 8, lineSpacingMultiple: 1.25 });
    s.addNotes("Sluit af met een retrieval-opdracht: laat leerlingen voor elk van de 4 instrumenten tekenen wat er gebeurt met P, Q, CS en PS.");
  }

  const outDir = path.resolve(__dirname, "..", "output-332-pptx");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  saveSvgFiles(svgEntries, outDir);
  const outPath = path.join(outDir, "3.3.2 Overheidsbeleid – presentatie.pptx");
  await pres.writeFile({ fileName: outPath });
  console.log("PPTX written to", outPath);
}

build().catch(e => { console.error(e); process.exit(1); });
