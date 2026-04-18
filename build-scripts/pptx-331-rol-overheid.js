/**
 * PPTX Build: 3.3.1 De rol van de overheid — presentatie met dual coding
 *
 * Rijk visueel deck: 17 dia's, 6 SVG-visuals.
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/pptx-331-rol-overheid.js
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
// Chapter 3 is "Overheid" — use the blue (markt) domain to match the prior deck + skill library
const DOMAIN = { color: C.dBlue, light: C.dBlueLt, dark: C.dBlueDk };

const GC = {
  demand: "#1A5276", supply: "#1E8449", supplyNew: "#E67E22",
  cost: "#E67E22", costAvg: "#D9534F",
  price: "#1A5276", revenue: "#7B2D8E", axis: "#2D3748", grid: "#CBD5E0",
  label: "#718096", title: "#1E2761", bg: "#F7FAFC",
  surplus: "#85C1E9", prodSurplus: "#82E0AA", loss: "#F1948A", tax: "#F8C471",
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

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 1: MARKTFALEN — TYPOLOGIE-INFOGRAPHIC
// Centraal begrip "Marktfalen" met drie oorzaken en drie overheid-instrumenten
// ═══════════════════════════════════════════════════════════════════════════
function buildTypologieSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah1" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#718096"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">Drie oorzaken van marktfalen — drie overheidsingrepen</text>

  <!-- Centraal begrip: Marktfalen -->
  <rect x="280" y="155" width="160" height="60" rx="10" fill="#${DOMAIN.color}"/>
  <text x="360" y="182" text-anchor="middle" font-size="16" font-weight="bold" fill="#FFFFFF">Marktfalen</text>
  <text x="360" y="202" text-anchor="middle" font-size="11" fill="#FFFFFF" opacity="0.9">markt levert niet het optimum</text>

  <!-- Drie oorzaken (links) -->
  <!-- 1. Monopolie -->
  <rect x="30" y="60" width="190" height="54" rx="8" fill="#FFFFFF" stroke="#${DOMAIN.color}" stroke-width="1.5"/>
  <rect x="30" y="60" width="6" height="54" fill="#${DOMAIN.color}"/>
  <text x="45" y="82" font-size="13" font-weight="bold" fill="#${DOMAIN.color}">1. Monopolie</text>
  <text x="45" y="102" font-size="11" fill="#2D3748">te weinig concurrentie</text>

  <!-- 2. Externe effecten -->
  <rect x="30" y="160" width="190" height="54" rx="8" fill="#FFFFFF" stroke="#${DOMAIN.color}" stroke-width="1.5"/>
  <rect x="30" y="160" width="6" height="54" fill="#${DOMAIN.color}"/>
  <text x="45" y="182" font-size="13" font-weight="bold" fill="#${DOMAIN.color}">2. Externe effecten</text>
  <text x="45" y="202" font-size="11" fill="#2D3748">baten/kosten buiten de prijs</text>

  <!-- 3. Collectieve goederen -->
  <rect x="30" y="260" width="190" height="54" rx="8" fill="#FFFFFF" stroke="#${DOMAIN.color}" stroke-width="1.5"/>
  <rect x="30" y="260" width="6" height="54" fill="#${DOMAIN.color}"/>
  <text x="45" y="282" font-size="13" font-weight="bold" fill="#${DOMAIN.color}">3. Collectieve goederen</text>
  <text x="45" y="302" font-size="11" fill="#2D3748">markt levert ze niet</text>

  <!-- Pijlen oorzaken → marktfalen -->
  <line x1="222" y1="87" x2="278" y2="165" stroke="#718096" stroke-width="1.5" marker-end="url(#ah1)"/>
  <line x1="222" y1="187" x2="278" y2="185" stroke="#718096" stroke-width="1.5" marker-end="url(#ah1)"/>
  <line x1="222" y1="287" x2="278" y2="205" stroke="#718096" stroke-width="1.5" marker-end="url(#ah1)"/>

  <!-- Drie instrumenten (rechts) -->
  <!-- Mededingingsbeleid -->
  <rect x="500" y="60" width="190" height="54" rx="8" fill="#${C.dGreenLt}" stroke="#1E8449" stroke-width="1.5"/>
  <rect x="500" y="60" width="6" height="54" fill="#1E8449"/>
  <text x="515" y="82" font-size="13" font-weight="bold" fill="#186A3B">Mededingingsbeleid</text>
  <text x="515" y="102" font-size="11" fill="#2D3748">ACM, boetes, toezicht</text>

  <!-- Belasting / subsidie -->
  <rect x="500" y="160" width="190" height="54" rx="8" fill="#${C.dGreenLt}" stroke="#1E8449" stroke-width="1.5"/>
  <rect x="500" y="160" width="6" height="54" fill="#1E8449"/>
  <text x="515" y="182" font-size="13" font-weight="bold" fill="#186A3B">Belasting / subsidie</text>
  <text x="515" y="202" font-size="11" fill="#2D3748">internaliseren</text>

  <!-- Overheid levert / financiert -->
  <rect x="500" y="260" width="190" height="54" rx="8" fill="#${C.dGreenLt}" stroke="#1E8449" stroke-width="1.5"/>
  <rect x="500" y="260" width="6" height="54" fill="#1E8449"/>
  <text x="515" y="282" font-size="13" font-weight="bold" fill="#186A3B">Overheid levert</text>
  <text x="515" y="302" font-size="11" fill="#2D3748">defensie, dijken, …</text>

  <!-- Pijlen marktfalen → instrumenten -->
  <line x1="442" y1="165" x2="498" y2="87" stroke="#1E8449" stroke-width="1.5" marker-end="url(#ah1)"/>
  <line x1="442" y1="185" x2="498" y2="187" stroke="#1E8449" stroke-width="1.5" marker-end="url(#ah1)"/>
  <line x1="442" y1="205" x2="498" y2="287" stroke="#1E8449" stroke-width="1.5" marker-end="url(#ah1)"/>

  <!-- Kopjes -->
  <text x="125" y="48" text-anchor="middle" font-size="11" font-weight="bold" fill="${GC.label}">OORZAAK</text>
  <text x="595" y="48" text-anchor="middle" font-size="11" font-weight="bold" fill="${GC.label}">OVERHEIDSINGREEP</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 2: NATUURLIJK MONOPOLIE — DALENDE GTK
// GTK(Q) = 200/Q + 2, dalend. Punt A: 1 bedrijf, Q=100, GTK=4. Punt B: 2 bedrijven, Q=50, GTK=6
// ═══════════════════════════════════════════════════════════════════════════
function buildNatMonopolieSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 140, pMax = 14;  // Q 0..140, GTK 0..14
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  // GTK(Q) = 200/Q + 2  — sample at Q=10..140
  const pts = [];
  for (let Q = 10; Q <= 140; Q += 2) {
    const gtk = 200 / Q + 2;
    pts.push(`${qToX(Q)},${pToY(gtk)}`);
  }
  const path = "M " + pts.join(" L ");

  // Key points
  const xA = qToX(100), yA = pToY(4);  // 1 bedrijf
  const xB = qToX(50),  yB = pToY(6);  // 2 bedrijven (elk)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Dalende GTK: één aanbieder produceert goedkoper dan twee</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah2)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah2)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">GTK (€ per eenheid)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Dashed references for point B (Q=50, GTK=6) -->
  <line x1="${xB}" y1="${yB}" x2="${xB}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yB}" x2="${xB}" y2="${yB}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <!-- Dashed references for point A (Q=100, GTK=4) -->
  <line x1="${xA}" y1="${yA}" x2="${xA}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yA}" x2="${xA}" y2="${yA}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- GTK curve -->
  <path d="${path}" fill="none" stroke="${GC.costAvg}" stroke-width="2.5"/>
  <text x="${qToX(140)-15}" y="${pToY(200/140+2)-8}" font-size="12" font-weight="bold" fill="${GC.costAvg}">GTK</text>

  <!-- Point B: 2 bedrijven, elk Q=50 -->
  <circle cx="${xB}" cy="${yB}" r="5" fill="#${C.red}"/>
  <text x="${xB+10}" y="${yB-8}" font-size="11" font-weight="bold" fill="#${C.red}">2 bedrijven: GTK = €6</text>

  <!-- Point A: 1 bedrijf, Q=100 -->
  <circle cx="${xA}" cy="${yA}" r="5" fill="#${DOMAIN.color}"/>
  <text x="${xA+10}" y="${yA-8}" font-size="11" font-weight="bold" fill="#${DOMAIN.color}">1 bedrijf: GTK = €4</text>

  <!-- Y-axis labels -->
  <text x="72" y="${yB+4}" text-anchor="end" font-size="10" fill="${GC.axis}">6</text>
  <text x="72" y="${yA+4}" text-anchor="end" font-size="10" fill="${GC.axis}">4</text>

  <!-- X-axis labels -->
  <text x="${xB}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">Q = 50</text>
  <text x="${xA}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">Q = 100</text>

  <!-- Caption -->
  <text x="360" y="348" text-anchor="middle" font-size="11" fill="${GC.label}" font-style="italic">Meer productie → GTK daalt → één aanbieder efficiënter</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 3: NEGATIEF EXTERN EFFECT
// V: P = 50 - Q ;  MPK (private): P = Q ;  MMK (social) = MPK + 10: P = Q + 10
// Market eq (V=MPK): Q=25, P=25  ;  Social eq (V=MMK): Q=20, P=30
// DWL triangle: (Q=20, P=30) — (Q=25, P=25) — (Q=25, P=35)
// ═══════════════════════════════════════════════════════════════════════════
function buildNegExternSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 55, pMax = 55;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  // V: P = 50 - Q  (endpoints (0,50) and (50,0))
  const v1x = qToX(0),  v1y = pToY(50);
  const v2x = qToX(50), v2y = pToY(0);
  // MPK: P = Q  (endpoints (0,0) and (50,50))
  const s1x = qToX(0),  s1y = pToY(0);
  const s2x = qToX(50), s2y = pToY(50);
  // MMK: P = Q + 10  (endpoints (0,10) and (40,50))
  const m1x = qToX(0),  m1y = pToY(10);
  const m2x = qToX(40), m2y = pToY(50);

  const qMkt = 25, pMkt = 25;   // markt
  const qSoc = 20, pSoc = 30;   // sociaal optimum
  const xMkt = qToX(qMkt), yMkt = pToY(pMkt);
  const xSoc = qToX(qSoc), ySoc = pToY(pSoc);
  const xMktMMK = qToX(qMkt), yMktMMK = pToY(qMkt + 10); // MMK bij Q=25 is P=35

  // DWL polygon: social eq (xSoc,ySoc) — (xMkt, yMkt on V) — (xMktMMK, MMK at Q=25)
  const dwlPoints = `${xSoc},${ySoc} ${xMkt},${yMkt} ${xMktMMK},${yMktMMK}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah3" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Negatief extern effect: te lage prijs, te veel productie</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah3)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah3)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Welvaartsverlies (rood) — eerst zodat lijnen erop komen -->
  <polygon points="${dwlPoints}" fill="${GC.loss}" fill-opacity="0.55"/>

  <!-- Dashed refs: Qs → V & axis -->
  <line x1="${xSoc}" y1="${ySoc}" x2="${xSoc}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${ySoc}" x2="${xSoc}" y2="${ySoc}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <!-- Dashed refs: Qm -->
  <line x1="${xMkt}" y1="${yMkt}" x2="${xMkt}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yMkt}" x2="${xMkt}" y2="${yMkt}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Curves -->
  <!-- V (vraag) -->
  <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v2x-18}" y="${v2y-6}" font-size="12" font-weight="bold" fill="${GC.demand}">V</text>
  <!-- MPK (private supply) -->
  <line x1="${s1x}" y1="${s1y}" x2="${s2x}" y2="${s2y}" stroke="${GC.supply}" stroke-width="2.5"/>
  <text x="${s2x+6}" y="${s2y+4}" font-size="12" font-weight="bold" fill="${GC.supply}">MPK</text>
  <!-- MMK (social supply) -->
  <line x1="${m1x}" y1="${m1y}" x2="${m2x}" y2="${m2y}" stroke="${GC.supplyNew}" stroke-width="2.5" stroke-dasharray="7,4"/>
  <text x="${m2x+6}" y="${m2y-6}" font-size="12" font-weight="bold" fill="${GC.supplyNew}">MMK</text>

  <!-- Equilibrium dots -->
  <circle cx="${xMkt}" cy="${yMkt}" r="5" fill="${GC.demand}"/>
  <circle cx="${xSoc}" cy="${ySoc}" r="5" fill="${GC.supplyNew}"/>

  <!-- DWL label -->
  <text x="${xMkt+6}" y="${(ySoc + yMktMMK)/2 + 4}" font-size="11" font-weight="bold" fill="#922B21">welvaarts-</text>
  <text x="${xMkt+6}" y="${(ySoc + yMktMMK)/2 + 18}" font-size="11" font-weight="bold" fill="#922B21">verlies</text>

  <!-- Axis labels -->
  <text x="72" y="${pToY(50)+4}" text-anchor="end" font-size="10" fill="${GC.label}">50</text>
  <text x="72" y="${ySoc+4}" text-anchor="end" font-size="10" fill="${GC.axis}">Ps = 30</text>
  <text x="72" y="${yMkt+4}" text-anchor="end" font-size="10" fill="${GC.axis}">Pm = 25</text>
  <text x="${xSoc}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">Qs = 20</text>
  <text x="${xMkt}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">Qm = 25</text>

  <!-- Legend note -->
  <text x="360" y="348" text-anchor="middle" font-size="10" fill="${GC.label}" font-style="italic">MMK = MPK + externe kosten   |   marktoptimum Qm &gt; maatschappelijk optimum Qs</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 4: POSITIEF EXTERN EFFECT
// MPB (vraag privé): P = 30 - Q ;  MMB (social demand) = MPB + 10: P = 40 - Q
// S: P = Q
// Market eq (MPB=S): Q=15, P=15  ;  Social eq (MMB=S): Q=20, P=20
// DWL triangle: (Q=15, P=15 on S) — (Q=20, P=20 on S=MMB) — (Q=15, P=25 on MMB)
// ═══════════════════════════════════════════════════════════════════════════
function buildPosExternSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 35, pMax = 42;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  // MPB: P = 30 - Q (from (0,30) to (30,0))
  const d1x = qToX(0),  d1y = pToY(30);
  const d2x = qToX(30), d2y = pToY(0);
  // MMB: P = 40 - Q (from (0,40) to (35,5))
  const m1x = qToX(0),  m1y = pToY(40);
  const m2x = qToX(35), m2y = pToY(5);
  // S: P = Q (from (0,0) to (35,35))
  const s1x = qToX(0),  s1y = pToY(0);
  const s2x = qToX(35), s2y = pToY(35);

  const qMkt = 15, pMkt = 15;
  const qSoc = 20, pSoc = 20;
  const xMkt = qToX(qMkt), yMkt = pToY(pMkt);
  const xSoc = qToX(qSoc), ySoc = pToY(pSoc);
  // MMB at Q=15 → P = 40-15 = 25
  const yMmbAtMkt = pToY(25);

  // DWL polygon: (Qm,Pm on S) — (Qs,Ps on S=MMB) — (Qm,P=25 on MMB)
  const dwlPoints = `${xMkt},${yMkt} ${xSoc},${ySoc} ${xMkt},${yMmbAtMkt}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah4" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Positief extern effect: te weinig consumptie</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah4)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah4)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- DWL (rood) -->
  <polygon points="${dwlPoints}" fill="${GC.loss}" fill-opacity="0.55"/>

  <!-- Dashed refs -->
  <line x1="${xMkt}" y1="${yMkt}" x2="${xMkt}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yMkt}" x2="${xMkt}" y2="${yMkt}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${xSoc}" y1="${ySoc}" x2="${xSoc}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${ySoc}" x2="${xSoc}" y2="${ySoc}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Curves -->
  <!-- S -->
  <line x1="${s1x}" y1="${s1y}" x2="${s2x}" y2="${s2y}" stroke="${GC.supply}" stroke-width="2.5"/>
  <text x="${s2x+6}" y="${s2y+4}" font-size="12" font-weight="bold" fill="${GC.supply}">A</text>
  <!-- MPB (private demand) -->
  <line x1="${d1x}" y1="${d1y}" x2="${d2x}" y2="${d2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${d2x-24}" y="${d2y-6}" font-size="12" font-weight="bold" fill="${GC.demand}">MPB</text>
  <!-- MMB (social demand, shifted out) -->
  <line x1="${m1x}" y1="${m1y}" x2="${m2x}" y2="${m2y}" stroke="${GC.supplyNew}" stroke-width="2.5" stroke-dasharray="7,4"/>
  <text x="${m2x-6}" y="${m2y-8}" text-anchor="end" font-size="12" font-weight="bold" fill="${GC.supplyNew}">MMB</text>

  <!-- Equilibrium dots -->
  <circle cx="${xMkt}" cy="${yMkt}" r="5" fill="${GC.demand}"/>
  <circle cx="${xSoc}" cy="${ySoc}" r="5" fill="${GC.supplyNew}"/>

  <!-- DWL label (inside triangle) -->
  <text x="${xMkt+10}" y="${(yMkt + yMmbAtMkt)/2 - 2}" font-size="11" font-weight="bold" fill="#922B21">welvaarts-</text>
  <text x="${xMkt+10}" y="${(yMkt + yMmbAtMkt)/2 + 12}" font-size="11" font-weight="bold" fill="#922B21">verlies</text>

  <!-- Axis labels -->
  <text x="72" y="${ySoc+4}" text-anchor="end" font-size="10" fill="${GC.axis}">Ps = 20</text>
  <text x="72" y="${yMkt+4}" text-anchor="end" font-size="10" fill="${GC.axis}">Pm = 15</text>
  <text x="${xMkt}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">Qm = 15</text>
  <text x="${xSoc}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">Qs = 20</text>

  <text x="360" y="348" text-anchor="middle" font-size="10" fill="${GC.label}" font-style="italic">MMB = MPB + externe baten   |   marktoptimum Qm &lt; maatschappelijk optimum Qs</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 5: INTERNALISEREN — PIGOU-BELASTING (supply shift)
// V: P = 40 - Q ;  A: P = Q + 10 ;  A_nieuw: P = Q + 20 (belasting t=10)
// Eq oud: Q=15, P=25 ; Eq nieuw: Q=10, P=30
// ═══════════════════════════════════════════════════════════════════════════
function buildInternaliserenSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 45, pMax = 45;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  // V: P = 40 - Q  → (0,40) ... (40,0)
  const v1x = qToX(0),  v1y = pToY(40);
  const v2x = qToX(40), v2y = pToY(0);
  // A: P = Q + 10  → (0,10) ... (30,40)
  const a1x = qToX(0),  a1y = pToY(10);
  const a2x = qToX(30), a2y = pToY(40);
  // A_new: P = Q + 20 → (0,20) ... (20,40)
  const an1x = qToX(0),  an1y = pToY(20);
  const an2x = qToX(20), an2y = pToY(40);

  // Equilibria
  const qOld = 15, pOld = 25;   // V=A: 40-Q = Q+10 → Q=15
  const qNew = 10, pNew = 30;   // V=A_new: 40-Q = Q+20 → Q=10
  const xOld = qToX(qOld), yOld = pToY(pOld);
  const xNew = qToX(qNew), yNew = pToY(pNew);
  // Producer receives: P_new - t = 30 - 10 = 20
  const yProd = pToY(20);

  // Tax revenue rectangle: Q=0..Q_new, between P_new (top) and P_producer (bottom)
  const taxRect = { x: px, y: yNew, w: xNew - px, h: yProd - yNew };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah5" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Internaliseren: belasting verschuift aanbod omhoog</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah5)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah5)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Tax revenue rectangle -->
  <rect x="${taxRect.x}" y="${taxRect.y}" width="${taxRect.w}" height="${taxRect.h}" fill="${GC.tax}" fill-opacity="0.55"/>
  <text x="${(taxRect.x + taxRect.x + taxRect.w)/2}" y="${(taxRect.y + taxRect.y + taxRect.h)/2 + 4}" text-anchor="middle" font-size="11" font-weight="bold" fill="#7B4A12">belastingopbrengst</text>

  <!-- Dashed reference lines -->
  <line x1="${xOld}" y1="${yOld}" x2="${xOld}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yOld}" x2="${xOld}" y2="${yOld}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${xNew}" y1="${yNew}" x2="${xNew}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yNew}" x2="${xNew}" y2="${yNew}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="${px}" y1="${yProd}" x2="${xNew}" y2="${yProd}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Curves -->
  <!-- V -->
  <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v2x+6}" y="${v2y-6}" font-size="12" font-weight="bold" fill="${GC.demand}">V</text>
  <!-- A oud (dashed, grey-ish) -->
  <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${GC.supply}" stroke-width="2" stroke-dasharray="6,4" opacity="0.75"/>
  <text x="${a2x+6}" y="${a2y+4}" font-size="11" font-weight="bold" fill="${GC.supply}" opacity="0.85">A (oud)</text>
  <!-- A nieuw -->
  <line x1="${an1x}" y1="${an1y}" x2="${an2x}" y2="${an2y}" stroke="${GC.supplyNew}" stroke-width="2.5"/>
  <text x="${an2x+6}" y="${an2y-6}" font-size="12" font-weight="bold" fill="${GC.supplyNew}">A + belasting</text>

  <!-- Shift arrow (horizontal, at mid-height) -->
  <line x1="${qToX(20)}" y1="${pToY(30)}" x2="${qToX(20)-52}" y2="${pToY(30)}" stroke="${GC.supplyNew}" stroke-width="1.8" marker-end="url(#ah5)"/>

  <!-- Equilibrium dots -->
  <circle cx="${xOld}" cy="${yOld}" r="5" fill="${GC.supply}" opacity="0.85"/>
  <circle cx="${xNew}" cy="${yNew}" r="5" fill="${GC.supplyNew}"/>

  <!-- Tax height note inside rectangle -->
  <text x="${(taxRect.x + taxRect.x + taxRect.w)/2}" y="${(taxRect.y + taxRect.y + taxRect.h)/2 - 8}" text-anchor="middle" font-size="10" fill="#7B4A12" font-style="italic">t = €10 per eenheid</text>

  <!-- Axis labels (kept short to avoid collision) -->
  <text x="72" y="${pToY(40)+4}" text-anchor="end" font-size="10" fill="${GC.label}">40</text>
  <text x="72" y="${yNew+4}" text-anchor="end" font-size="10" fill="${GC.axis}" font-weight="bold">30</text>
  <text x="72" y="${yOld+4}" text-anchor="end" font-size="10" fill="${GC.axis}">25</text>
  <text x="72" y="${yProd+4}" text-anchor="end" font-size="10" fill="${GC.axis}">20</text>
  <text x="${xNew}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}" font-weight="bold">10</text>
  <text x="${xOld}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">15</text>

  <text x="360" y="348" text-anchor="middle" font-size="10" fill="${GC.label}" font-style="italic">Belasting t = €10 → prijs stijgt van 25 naar 30 → hoeveelheid daalt van 15 naar 10</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 6: INSTRUMENTEN-MATRIX  (probleem → passend instrument)
// ═══════════════════════════════════════════════════════════════════════════
function buildInstrumentMatrixSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">Welk instrument past bij welk probleem?</text>

  <!-- Header row -->
  <rect x="40" y="55" width="240" height="38" fill="#${DOMAIN.color}"/>
  <text x="160" y="80" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">Probleem</text>
  <rect x="280" y="55" width="200" height="38" fill="#${DOMAIN.color}"/>
  <text x="380" y="80" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">Mechanisme</text>
  <rect x="480" y="55" width="200" height="38" fill="#186A3B"/>
  <text x="580" y="80" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">Instrument</text>

  <!-- Row 1: Monopolie -->
  <rect x="40" y="93" width="240" height="58" fill="#FFFFFF" stroke="#${C.borderGray}"/>
  <rect x="40" y="93" width="5" height="58" fill="#${DOMAIN.color}"/>
  <text x="55" y="116" font-size="13" font-weight="bold" fill="#${DOMAIN.color}">Monopolie / machtspositie</text>
  <text x="55" y="136" font-size="11" fill="#2D3748">te weinig concurrentie</text>

  <rect x="280" y="93" width="200" height="58" fill="#${C.rowAlt}" stroke="#${C.borderGray}"/>
  <text x="290" y="116" font-size="11" fill="#2D3748">te hoge prijs,</text>
  <text x="290" y="134" font-size="11" fill="#2D3748">te weinig aanbod</text>

  <rect x="480" y="93" width="200" height="58" fill="#${C.dGreenLt}" stroke="#${C.borderGray}"/>
  <rect x="480" y="93" width="5" height="58" fill="#1E8449"/>
  <text x="495" y="116" font-size="12" font-weight="bold" fill="#186A3B">Mededingingsbeleid</text>
  <text x="495" y="136" font-size="11" fill="#2D3748">ACM, EC, boetes</text>

  <!-- Row 2: Negatief extern effect -->
  <rect x="40" y="151" width="240" height="58" fill="#FFFFFF" stroke="#${C.borderGray}"/>
  <rect x="40" y="151" width="5" height="58" fill="#${DOMAIN.color}"/>
  <text x="55" y="174" font-size="13" font-weight="bold" fill="#${DOMAIN.color}">Negatief extern effect</text>
  <text x="55" y="194" font-size="11" fill="#2D3748">kosten buiten de prijs</text>

  <rect x="280" y="151" width="200" height="58" fill="#${C.rowAlt}" stroke="#${C.borderGray}"/>
  <text x="290" y="174" font-size="11" fill="#2D3748">prijs te laag,</text>
  <text x="290" y="192" font-size="11" fill="#2D3748">te veel productie</text>

  <rect x="480" y="151" width="200" height="58" fill="#${C.dGreenLt}" stroke="#${C.borderGray}"/>
  <rect x="480" y="151" width="5" height="58" fill="#1E8449"/>
  <text x="495" y="174" font-size="12" font-weight="bold" fill="#186A3B">Belasting</text>
  <text x="495" y="194" font-size="11" fill="#2D3748">bijv. vliegtaks, CO₂-heffing</text>

  <!-- Row 3: Positief extern effect -->
  <rect x="40" y="209" width="240" height="58" fill="#FFFFFF" stroke="#${C.borderGray}"/>
  <rect x="40" y="209" width="5" height="58" fill="#${DOMAIN.color}"/>
  <text x="55" y="232" font-size="13" font-weight="bold" fill="#${DOMAIN.color}">Positief extern effect</text>
  <text x="55" y="252" font-size="11" fill="#2D3748">baten buiten de prijs</text>

  <rect x="280" y="209" width="200" height="58" fill="#${C.rowAlt}" stroke="#${C.borderGray}"/>
  <text x="290" y="232" font-size="11" fill="#2D3748">prijs te hoog,</text>
  <text x="290" y="250" font-size="11" fill="#2D3748">te weinig consumptie</text>

  <rect x="480" y="209" width="200" height="58" fill="#${C.dGreenLt}" stroke="#${C.borderGray}"/>
  <rect x="480" y="209" width="5" height="58" fill="#1E8449"/>
  <text x="495" y="232" font-size="12" font-weight="bold" fill="#186A3B">Subsidie</text>
  <text x="495" y="252" font-size="11" fill="#2D3748">bijv. vaccinatie, onderwijs</text>

  <!-- Row 4: Collectieve goederen -->
  <rect x="40" y="267" width="240" height="58" fill="#FFFFFF" stroke="#${C.borderGray}"/>
  <rect x="40" y="267" width="5" height="58" fill="#${DOMAIN.color}"/>
  <text x="55" y="290" font-size="13" font-weight="bold" fill="#${DOMAIN.color}">Collectieve goederen</text>
  <text x="55" y="310" font-size="11" fill="#2D3748">markt levert niet</text>

  <rect x="280" y="267" width="200" height="58" fill="#${C.rowAlt}" stroke="#${C.borderGray}"/>
  <text x="290" y="290" font-size="11" fill="#2D3748">meelifters,</text>
  <text x="290" y="308" font-size="11" fill="#2D3748">geen private prikkel</text>

  <rect x="480" y="267" width="200" height="58" fill="#${C.dGreenLt}" stroke="#${C.borderGray}"/>
  <rect x="480" y="267" width="5" height="58" fill="#1E8449"/>
  <text x="495" y="290" font-size="12" font-weight="bold" fill="#186A3B">Overheid levert zelf</text>
  <text x="495" y="308" font-size="11" fill="#2D3748">defensie, dijken, politie</text>

  <!-- Footer hint -->
  <text x="360" y="348" text-anchor="middle" font-size="10" fill="${GC.label}" font-style="italic">Koppel het probleem aan het mechanisme — dán volgt het instrument</text>
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
  if (bodyParts && bodyParts.length > 0) {
    slide.addText(bodyParts, {
      x: x + 0.2, y: y + 0.55, w: w - 0.35, h: h - 0.7,
      fontSize: 13, fontFace: "Arial", color: C.dark, valign: "top", align: "left",
      lineSpacingMultiple: 1.2, margin: 0,
    });
  }
}
function drawGraphSlide(slide, imgBase64) {
  slide.addImage({ data: imgBase64, x: 0.75, y: 0.95, w: 8.5, h: 4.25 });
}

// Graph slide with a legend strip below (4 cells max), for graphs that use
// unfamiliar abbreviations (MPK, MMK, MPB, MMB).
function drawGraphSlideWithLegend(slide, imgBase64, legendItems) {
  // Slightly smaller graph to leave room for legend
  slide.addImage({ data: imgBase64, x: 1.0, y: 0.82, w: 8.0, h: 4.0 });

  const lx = 0.5, ly = 4.90, lw = 9.0, lh = 0.62;
  slide.addShape("rect", {
    x: lx, y: ly, w: lw, h: lh,
    fill: { color: C.lightGray }, line: { color: C.borderGray, width: 0.5 },
  });

  const n = legendItems.length;
  const cellW = lw / n;
  legendItems.forEach((it, i) => {
    const cx = lx + i * cellW;
    // Swatch
    slide.addShape("rect", {
      x: cx + 0.12, y: ly + 0.17, w: 0.22, h: 0.22,
      fill: { color: it.color },
    });
    // Abbrev + description
    slide.addText([
      { text: it.abbr, options: { bold: true, color: it.color } },
      { text: "  " + it.desc, options: { color: C.dark } },
    ], {
      x: cx + 0.42, y: ly + 0.08, w: cellW - 0.5, h: lh - 0.16,
      fontSize: 11, fontFace: "Arial", valign: "middle", margin: 0,
      lineSpacingMultiple: 1.1,
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
  pres.title = "3.3.1 De rol van de overheid";

  addTitleMaster(pres);
  addContentMaster(pres);

  const svgEntries = [
    { name: "331-marktfalen-typologie", svg: buildTypologieSVG() },
    { name: "331-natuurlijk-monopolie-gtk", svg: buildNatMonopolieSVG() },
    { name: "331-negatief-extern-effect", svg: buildNegExternSVG() },
    { name: "331-positief-extern-effect", svg: buildPosExternSVG() },
    { name: "331-internaliseren-belasting", svg: buildInternaliserenSVG() },
    { name: "331-instrumenten-matrix", svg: buildInstrumentMatrixSVG() },
  ];
  const pngBufs = await Promise.all(svgEntries.map(e => svgToPng(e.svg)));
  const [gTypo, gNatMon, gNeg, gPos, gInt, gMat] = pngBufs.map(pngToBase64);

  // ────────────────────────────────────────────────────────────────────
  // DIA 1: Titel
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("De rol van de overheid", {
      x: 0.7, y: 1.2, w: 8.6, h: 2,
      fontSize: 40, fontFace: "Arial", color: C.white, bold: true,
    });
    s.addText("Paragraaf 3.3.1", {
      x: 0.7, y: 3.2, w: 8.6, h: 0.5,
      fontSize: 20, fontFace: "Arial", color: C.gray,
    });
    s.addText("Hoofdstuk 3: Overheid  |  Economie VWO", {
      x: 0.7, y: 5.15, w: 8.6, h: 0.475,
      fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle",
    });
    s.addNotes("Welkom bij §3.3.1. We onderzoeken wanneer de markt faalt en hoe de overheid ingrijpt. De rode draad: drie oorzaken (monopolie, externe effecten, collectieve goederen) → drie soorten beleid.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 2: Leerdoelen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Wat ga je leren?");
    const doelen = [
      "Herkennen wanneer er sprake is van marktfalen",
      "Een natuurlijk monopolie uitleggen via dalende GTK",
      "Een economische machtspositie bepalen (drempel 35 %)",
      "Negatieve externe effecten herkennen en in een grafiek aanwijzen",
      "Positieve externe effecten herkennen en in een grafiek aanwijzen",
      "Internaliseren uitleggen: belasting of subsidie",
    ];
    s.addText(doelen.join("\n"), {
      x: 0.7, y: 1.15, w: 8.6, h: 3.6,
      bullet: { code: "25A0" }, fontSize: 17, fontFace: "Arial", color: C.dark,
      paraSpaceAfter: 10, lineSpacingMultiple: 1.25,
    });
    s.addNotes("Kondig de zes leerdoelen aan. Benadruk dat de leerlingen aan het eind ook een grafiek voor externe effecten moeten kunnen lezen.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 3: Overzicht marktfalen — typologie (infographic)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Overzicht: drie oorzaken, drie remedies");
    drawGraphSlide(s, gTypo);
    s.addNotes("Deze dia is de kapstok van de hele les. Links staan de drie oorzaken van marktfalen, rechts de drie instrumenten waarmee de overheid ingrijpt. Elke volgende dia werkt één rij uit.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 4: Wat is marktfalen? (twee kaarten)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Wat is marktfalen?");
    drawCard(s, 0.5, 1.05, 4.3, 3.9, DOMAIN.color, C.cream,
      "Markt werkt goed", DOMAIN.dark,
      [
        { text: "Voldoende concurrentie", options: { bullet: { code: "25A0" }, color: DOMAIN.dark, bold: true, breakLine: true } },
        { text: "Alle kosten/baten zitten in de prijs", options: { bullet: { code: "25A0" }, color: DOMAIN.dark, bold: true, breakLine: true } },
        { text: "Goederen worden geleverd", options: { bullet: { code: "25A0" }, color: DOMAIN.dark, bold: true, breakLine: true } },
        { text: "\u2192 prijs bepaalt schaarse middelen efficiënt", options: { fontSize: 12, italic: true, color: C.gray } },
      ]);
    drawCard(s, 5.2, 1.05, 4.3, 3.9, C.red, C.lightRed,
      "Markt faalt", "922B21",
      [
        { text: "Te weinig concurrentie (monopolie)", options: { bullet: { code: "25A0" }, color: "922B21", bold: true, breakLine: true } },
        { text: "Kosten/baten buiten de markt (externe effecten)", options: { bullet: { code: "25A0" }, color: "922B21", bold: true, breakLine: true } },
        { text: "Markt levert niet (collectieve goederen)", options: { bullet: { code: "25A0" }, color: "922B21", bold: true, breakLine: true } },
        { text: "\u2192 overheid grijpt in", options: { fontSize: 12, italic: true, color: C.gray } },
      ]);
    s.addNotes("Stel het contrast expliciet: wanneer levert de markt wél een optimum, en wanneer niet? Herinner de leerlingen aan hoofdstuk 1 (vraag en aanbod).");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 5: Natuurlijk monopolie — theorie (twee kaarten)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Natuurlijk monopolie");
    drawCard(s, 0.5, 1.05, 4.3, 3.9, DOMAIN.color, C.cream,
      "Kenmerk", DOMAIN.dark,
      [
        { text: "Hoge vaste kosten", options: { bullet: { code: "25A0" }, breakLine: true } },
        { text: "Lage variabele kosten", options: { bullet: { code: "25A0" }, breakLine: true } },
        { text: "GTK daalt bij meer productie", options: { bullet: { code: "25A0" }, bold: true, color: DOMAIN.dark, breakLine: true } },
        { text: "\u00E9\u00E9n aanbieder is goedkoper dan twee", options: { bullet: { code: "25A0" }, breakLine: true } },
      ]);
    drawCard(s, 5.2, 1.05, 4.3, 3.9, "#B58500", "#FFF8E1",
      "Voorbeelden", "7B4A12",
      [
        { text: "Waterleidingnet — \u00E9\u00E9n net is goedkoper dan twee", options: { bullet: { code: "25A0" }, breakLine: true } },
        { text: "Spoorwegen — dubbele rails zijn onnodig duur", options: { bullet: { code: "25A0" }, breakLine: true } },
        { text: "Elektriciteitsnet — netwerk is natuurlijk monopolie", options: { bullet: { code: "25A0" }, breakLine: true } },
        { text: "Postbezorging — meer volume \u2192 lagere GTK", options: { bullet: { code: "25A0" } } },
      ]);
    s.addNotes("Leg uit dat ‘natuurlijk’ slaat op de kostenstructuur: bij hoge vaste en lage variabele kosten is één aanbieder technisch efficiënter. De overheid reguleert dan de prijs (bv. via ACM).");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 6: Natuurlijk monopolie — grafiek
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Waarom \u00E9\u00E9n aanbieder goedkoper is");
    drawGraphSlide(s, gNatMon);
    s.addNotes("Laat de GTK-curve zien en wijs beide punten aan. Eén aanbieder op Q=100: GTK=€4. Twee aanbieders elk op Q=50: GTK=€6. Dalende GTK is dé signatuur van een natuurlijk monopolie.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 7: Economische machtspositie — drempel 35 %
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Economische machtspositie");
    // Left: flow of 3 steps
    const steps = [
      { t: "1. Bepaal het marktaandeel", hi: false },
      { t: "2. \u2265 35 %?   \u2192 machtspositie", hi: true },
      { t: "3. Misbruikt het bedrijf die positie?", hi: false },
      { t: "4. Zo ja: boete / regulering door ACM of EC", hi: true },
    ];
    const sx = 0.5, sy = 1.1, sw = 4.6, sh = 0.65, gap = 0.15;
    steps.forEach((st, i) => {
      const y = sy + i * (sh + gap);
      s.addShape("rect", { x: sx, y, w: sw, h: sh,
        fill: { color: st.hi ? DOMAIN.color : C.cream }, rectRadius: 0.04, shadow: makeShadow() });
      s.addText(st.t, {
        x: sx + 0.18, y, w: sw - 0.3, h: sh,
        fontSize: 14, fontFace: "Arial",
        color: st.hi ? C.white : C.dark, bold: st.hi, valign: "middle", margin: 0,
      });
    });

    // Right: Google case card
    drawCard(s, 5.3, 1.1, 4.2, 3.3, C.red, C.lightRed,
      "Casus: Google", "922B21",
      [
        { text: "Marktaandeel zoekmachines EU", options: { fontSize: 12, color: C.gray, breakLine: true } },
        { text: ">  90 %", options: { fontSize: 22, bold: true, color: "922B21", breakLine: true } },
        { text: "Machtsmisbruik: dwong sites alleen Google-advertenties te tonen", options: { fontSize: 12, breakLine: true } },
        { text: "\u2192 boete € 1,49 mrd", options: { fontSize: 14, bold: true, color: "922B21" } },
      ]);

    s.addNotes("De drempel van 35 % is het ankerpunt. Vraag klassikaal: wat is het marktaandeel van Albert Heijn? Van Booking? Is dat boven de drempel? Daarna de Google-casus als scherp voorbeeld.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 8: Negatief extern effect — redeneerketen (flow)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Negatief extern effect \u2014 wat gebeurt er?");
    const steps = [
      { t: "Bedrijf produceert", hi: false },
      { t: "Derden lijden schade (bv. vervuiling)", hi: false },
      { t: "Kosten zitten niet in de prijs", hi: true },
      { t: "Prijs te laag \u2192 te veel productie", hi: false },
      { t: "Welvaartsverlies voor de samenleving", hi: true },
    ];
    const sx = 1.5, sy = 1.1, sw = 7, sh = 0.6, gap = 0.12;
    steps.forEach((st, i) => {
      const y = sy + i * (sh + gap);
      s.addShape("rect", { x: sx, y, w: sw, h: sh,
        fill: { color: st.hi ? C.red : C.cream }, rectRadius: 0.04, shadow: makeShadow() });
      const pref = i > 0 ? "\u2193  " : "";
      s.addText(pref + st.t, {
        x: sx + 0.2, y, w: sw - 0.3, h: sh,
        fontSize: 15, fontFace: "Arial",
        color: st.hi ? C.white : C.dark, bold: st.hi, valign: "middle", margin: 0,
      });
    });
    s.addNotes("Laat de keten stap voor stap oplopen. Vraag tussendoor: wie draagt de kosten eigenlijk? De gouden lijn: 'de prijs liegt' — hij vertelt niet de maatschappelijke kosten.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 9: Negatief extern effect — grafiek
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Negatief extern effect in de grafiek");
    drawGraphSlideWithLegend(s, gNeg, [
      { color: "1A5276", abbr: "V",   desc: "vraag" },
      { color: "1E8449", abbr: "MPK", desc: "private kosten" },
      { color: "E67E22", abbr: "MMK", desc: "MPK + externe kosten" },
      { color: "D9534F", abbr: "\u25B2", desc: "welvaartsverlies" },
    ]);
    s.addNotes("Lees de grafiek samen. V = vraag. MPK = private marginale kosten (wat het bedrijf ziet). MMK = maatschappelijke marginale kosten (inclusief vervuiling). Markt kiest Qm=25, maar optimum is Qs=20. Het rode driehoekje = welvaartsverlies.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 10: Positief extern effect — redeneerketen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Positief extern effect \u2014 wat gebeurt er?");
    const steps = [
      { t: "Iemand koopt / consumeert", hi: false },
      { t: "Derden profiteren mee (meelifter)", hi: false },
      { t: "Baten zitten niet in de prijs", hi: true },
      { t: "Prijs te hoog \u2192 te weinig consumptie", hi: false },
      { t: "Welvaartsverlies voor de samenleving", hi: true },
    ];
    const sx = 1.5, sy = 1.1, sw = 7, sh = 0.6, gap = 0.12;
    steps.forEach((st, i) => {
      const y = sy + i * (sh + gap);
      s.addShape("rect", { x: sx, y, w: sw, h: sh,
        fill: { color: st.hi ? DOMAIN.color : C.cream }, rectRadius: 0.04, shadow: makeShadow() });
      const pref = i > 0 ? "\u2193  " : "";
      s.addText(pref + st.t, {
        x: sx + 0.2, y, w: sw - 0.3, h: sh,
        fontSize: 15, fontFace: "Arial",
        color: st.hi ? C.white : C.dark, bold: st.hi, valign: "middle", margin: 0,
      });
    });
    s.addNotes("Let op de spiegelbeeld-structuur met de vorige keten. Voorbeelden: vaccinatie, onderwijs, tuinonderhoud. Het 'meelifteffect' is de sleutel.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 11: Positief extern effect — grafiek
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Positief extern effect in de grafiek");
    drawGraphSlideWithLegend(s, gPos, [
      { color: "1E8449", abbr: "A",   desc: "aanbod" },
      { color: "1A5276", abbr: "MPB", desc: "private baten" },
      { color: "E67E22", abbr: "MMB", desc: "MPB + externe baten" },
      { color: "D9534F", abbr: "\u25B2", desc: "welvaartsverlies" },
    ]);
    s.addNotes("Nu ligt het welvaartsverlies aan de andere kant: de markt kiest Qm=15, maar optimum is Qs=20. MMB ligt boven MPB omdat derden ook profiteren. Bij Qm=15 is het verschil precies het externe baten-bedrag.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 12: Neg vs Pos — vergelijkingstabel
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Negatief vs. positief extern effect");
    const rows = [
      [
        { text: "Kenmerk",              options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, fontFace: "Arial" } },
        { text: "Negatief",             options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, fontFace: "Arial" } },
        { text: "Positief",             options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, fontFace: "Arial" } },
      ],
      [
        { text: "Wat zit buiten de prijs?", options: { fill: { color: C.rowAlt }, bold: true, fontSize: 12, fontFace: "Arial" } },
        { text: "Kosten voor derden",       options: { fill: { color: C.rowAlt }, fontSize: 12, fontFace: "Arial" } },
        { text: "Baten voor derden",        options: { fill: { color: C.rowAlt }, fontSize: 12, fontFace: "Arial" } },
      ],
      [
        { text: "Effect op prijs",          options: { bold: true, fontSize: 12, fontFace: "Arial" } },
        { text: "Te laag",                  options: { fontSize: 12, fontFace: "Arial" } },
        { text: "Te hoog",                  options: { fontSize: 12, fontFace: "Arial" } },
      ],
      [
        { text: "Effect op hoeveelheid",    options: { fill: { color: C.rowAlt }, bold: true, fontSize: 12, fontFace: "Arial" } },
        { text: "Te veel productie",        options: { fill: { color: C.rowAlt }, fontSize: 12, fontFace: "Arial" } },
        { text: "Te weinig consumptie",     options: { fill: { color: C.rowAlt }, fontSize: 12, fontFace: "Arial" } },
      ],
      [
        { text: "Welke curve verschuift?",  options: { bold: true, fontSize: 12, fontFace: "Arial" } },
        { text: "A/MPK \u2192 MMK (omhoog)", options: { fontSize: 12, fontFace: "Arial" } },
        { text: "V/MPB \u2192 MMB (naar rechts)", options: { fontSize: 12, fontFace: "Arial" } },
      ],
      [
        { text: "Voorbeelden",              options: { fill: { color: C.rowAlt }, bold: true, fontSize: 12, fontFace: "Arial" } },
        { text: "Luchtvervuiling, geluidsoverlast", options: { fill: { color: C.rowAlt }, fontSize: 12, fontFace: "Arial" } },
        { text: "Vaccinatie, onderwijs",    options: { fill: { color: C.rowAlt }, fontSize: 12, fontFace: "Arial" } },
      ],
      [
        { text: "Instrument overheid",      options: { bold: true, fontSize: 12, fontFace: "Arial" } },
        { text: "Belasting (prijs stijgt)", options: { fontSize: 12, fontFace: "Arial", color: "186A3B", bold: true } },
        { text: "Subsidie (prijs daalt)",   options: { fontSize: 12, fontFace: "Arial", color: "186A3B", bold: true } },
      ],
    ];
    s.addTable(rows, {
      x: 0.5, y: 1.05, w: 9,
      border: { pt: 0.5, color: C.borderGray },
      colW: [2.8, 3.1, 3.1],
    });
    s.addNotes("Gebruik deze tabel als retrieval-oefening: dek een kolom af en laat leerlingen reconstrueren. Let op de spiegel-structuur — dat maakt het beter te onthouden.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 13: Internaliseren — stappenplan (flow)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Internaliseren: extern effect in de prijs trekken");
    const steps = [
      { t: "Extern effect signaleren (kosten of baten buiten de prijs)", hi: false },
      { t: "Negatief \u2192 belasting heffen  /  Positief \u2192 subsidie geven", hi: true },
      { t: "Prijs verandert: bij belasting omhoog, bij subsidie omlaag", hi: false },
      { t: "Hoeveelheid verschuift richting het maatschappelijke optimum", hi: false },
      { t: "Externe effect is ge\u00EFnternaliseerd", hi: true },
    ];
    const sx = 1.3, sy = 1.05, sw = 7.4, sh = 0.62, gap = 0.12;
    steps.forEach((st, i) => {
      const y = sy + i * (sh + gap);
      s.addShape("rect", { x: sx, y, w: sw, h: sh,
        fill: { color: st.hi ? "1E8449" : C.cream }, rectRadius: 0.04, shadow: makeShadow() });
      const pref = i > 0 ? "\u2193  " : "";
      s.addText(pref + st.t, {
        x: sx + 0.2, y, w: sw - 0.3, h: sh,
        fontSize: 14, fontFace: "Arial",
        color: st.hi ? C.white : C.dark, bold: st.hi, valign: "middle", margin: 0,
      });
    });
    s.addNotes("Internaliseren = de externe kosten of baten in de prijs verwerken. De volgende dia laat zien hoe dat er in een vraag-aanbodgrafiek uitziet.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 14: Internaliseren — grafiek (Pigouvian tax)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Internaliseren in de grafiek");
    drawGraphSlide(s, gInt);
    s.addNotes("Voorbeeld: vliegtaks van €10 per ticket. Het aanbod verschuift omhoog met de belasting. Consument betaalt €30 (was €25). Aanbieder ontvangt €30-€10=€20. Hoeveelheid daalt van 15 naar 10 vluchten. De gele rechthoek = belastingopbrengst.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 15: Instrumenten-matrix
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Instrumenten van de overheid");
    drawGraphSlide(s, gMat);
    s.addNotes("Deze matrix vat alles samen: welk probleem krijgt welk instrument? Gebruik hem als retrieval: noem een voorbeeld (rookverbod, kinderopvangtoeslag, ACM-boete) en laat de klas de rij invullen.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 16: Valkuilen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Valkuilen");
    const items = [
      { title: "\u201CMarktfalen = een bedrijf gaat failliet\u201D",
        body: "Onjuist. Marktfalen betekent dat de markt als gehéél niet het optimum levert, niet dat \u00E9\u00E9n bedrijf omvalt." },
      { title: "\u201CExterne effecten zijn altijd negatief\u201D",
        body: "Onjuist. Er zijn ook positieve externe effecten (vaccinatie, onderwijs). Die leiden juist tot te weinig consumptie." },
      { title: "\u201CInternaliseren = verbieden\u201D",
        body: "Onjuist. Internaliseren = de externe kosten of baten in de prijs verwerken via belasting of subsidie. Het product wordt niet verboden." },
    ];
    const sx = 0.6, sy = 1.05, sw = 8.8, sh = 1.17, gap = 0.14;
    items.forEach((it, i) => {
      const y = sy + i * (sh + gap);
      s.addShape("rect", { x: sx, y, w: sw, h: sh, fill: { color: C.lightRed }, rectRadius: 0.04 });
      s.addShape("rect", { x: sx, y, w: 0.06, h: sh, fill: { color: C.red } });
      s.addText(it.title, {
        x: sx + 0.25, y: y + 0.1, w: sw - 0.4, h: 0.4,
        fontSize: 16, fontFace: "Arial", color: "922B21", bold: true, margin: 0, valign: "top",
      });
      s.addText(it.body, {
        x: sx + 0.25, y: y + 0.48, w: sw - 0.4, h: sh - 0.55,
        fontSize: 13, fontFace: "Arial", color: C.dark, margin: 0, valign: "top",
        lineSpacingMultiple: 1.2,
      });
    });
    s.addNotes("Laat de drie valkuilen expliciet zien. Vraag bij elk: welke leerling is hier gisteren nog ingetrapt? Dit zijn de klassieke denk­fouten bij toetsen.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 17: Samenvatting (donker)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Samenvatting", {
      x: 0.7, y: 0.35, w: 8.6, h: 0.6,
      fontSize: 30, fontFace: "Arial", color: C.white, bold: true,
    });
    s.addText("Check: beheers je dit voordat je gaat oefenen?", {
      x: 0.7, y: 0.95, w: 8.6, h: 0.4,
      fontSize: 14, fontFace: "Arial", color: C.gray, italic: true,
    });
    const punten = [
      "Marktfalen = de markt levert geen optimaal resultaat (monopolie / externe effecten / collectieve goederen)",
      "Natuurlijk monopolie: dalende GTK \u2192 \u00E9\u00E9n aanbieder efficiënter",
      "Machtspositie: marktaandeel \u2265 35 % \u2192 Mededingingswet, toezicht door ACM / EC",
      "Negatief extern effect: kosten buiten de prijs \u2192 prijs te laag \u2192 te veel productie",
      "Positief extern effect: baten buiten de prijs \u2192 prijs te hoog \u2192 te weinig consumptie",
      "Overheid internaliseert met belasting (negatief) of subsidie (positief)",
    ];
    s.addText(punten.join("\n"), {
      x: 0.7, y: 1.55, w: 8.6, h: 3.5,
      bullet: { code: "25A0" }, fontSize: 15, fontFace: "Arial", color: C.white,
      paraSpaceAfter: 8, lineSpacingMultiple: 1.25,
    });
    s.addNotes("Sluit af met een ‘pair & share’: leerlingen leggen in duo's de zes punten aan elkaar uit zonder dia. Wie struikelt waar? Die paragraaf nog even terug.");
  }

  // ────────────────────────────────────────────────────────────────────
  // Output
  // ────────────────────────────────────────────────────────────────────
  const outDir = path.resolve(__dirname, "..", "output-331-pptx");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  saveSvgFiles(svgEntries, outDir);

  const outPath = path.join(outDir, "3.3.1 De rol van de overheid – presentatie.pptx");
  await pres.writeFile({ fileName: outPath });
  console.log("PPTX written to", outPath);
}

build().catch(e => { console.error(e); process.exit(1); });
