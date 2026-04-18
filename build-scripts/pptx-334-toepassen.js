/**
 * PPTX Build: 3.3.4 Toepassen: Overheid — presentatie met dual coding
 *
 * 15 dia's met 5 visuals:
 *   1. 4 vormen marktfalen — rich matrix (probleem, mechanisme, instrument, voorbeeld)
 *   2. Diagnose-beslisboom — "welk marktfalen?"
 *   3. Probleem → instrument koppeling (flow)
 *   4. Tabaksaccijns grafiek (S shift up, consumption ↓)
 *   5. Doelmatigheid × rechtvaardigheid quadrant
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/pptx-334-toepassen.js
 */
process.env.NODE_PATH = "C:/Users/meije/AppData/Roaming/npm/node_modules";
require("module").Module._initPaths();

const PptxGenJS = require("pptxgenjs");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { saveSvgFiles } = require("./lib-svg-save");

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
  axis: "#2D3748", grid: "#CBD5E0", label: "#718096", title: "#1E2761", bg: "#F7FAFC",
  tax: "#F8C471", loss: "#F1948A",
};
const makeShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.10 });
async function svgToPng(svg, w = 720) { return sharp(Buffer.from(svg)).resize(w).png().toBuffer(); }
function pngToBase64(buf) { return "image/png;base64," + buf.toString("base64"); }

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 1: 4 VORMEN MARKTFALEN — overzicht-infographic
// ═══════════════════════════════════════════════════════════════════════════
function buildVierVormenSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <text x="360" y="22" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">De vier vormen van marktfalen</text>

  <!-- 4 kaarten 2×2 -->
  <!-- Links-boven: Externe effecten (oranje) -->
  <rect x="40" y="45" width="320" height="130" rx="10" fill="#FEF5E7" stroke="#E67E22" stroke-width="2"/>
  <rect x="40" y="45" width="320" height="28" fill="#E67E22" rx="10"/>
  <rect x="40" y="60" width="320" height="13" fill="#E67E22"/>
  <text x="200" y="64" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">1. Externe effecten</text>
  <text x="55" y="92" font-size="11" fill="${GC.label}" font-weight="bold">WAT GAAT ER MIS?</text>
  <text x="55" y="108" font-size="11" fill="#2D3748">kosten/baten zitten niet in de prijs</text>
  <text x="55" y="128" font-size="11" fill="${GC.label}" font-weight="bold">VOORBEELD:</text>
  <text x="55" y="144" font-size="11" fill="#2D3748">luchtvervuiling door fabriek</text>
  <text x="55" y="164" font-size="11" fill="${GC.label}" font-weight="bold">INSTRUMENT:</text>
  <text x="170" y="164" font-size="11" font-weight="bold" fill="#BA6A1C">belasting / subsidie</text>

  <!-- Rechts-boven: Marktmacht (blauw) -->
  <rect x="370" y="45" width="310" height="130" rx="10" fill="#EBF5FB" stroke="#1A5276" stroke-width="2"/>
  <rect x="370" y="45" width="310" height="28" fill="#1A5276" rx="10"/>
  <rect x="370" y="60" width="310" height="13" fill="#1A5276"/>
  <text x="525" y="64" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">2. Marktmacht</text>
  <text x="385" y="92" font-size="11" fill="${GC.label}" font-weight="bold">WAT GAAT ER MIS?</text>
  <text x="385" y="108" font-size="11" fill="#2D3748">te hoge prijs, te lage hoeveelheid</text>
  <text x="385" y="128" font-size="11" fill="${GC.label}" font-weight="bold">VOORBEELD:</text>
  <text x="385" y="144" font-size="11" fill="#2D3748">monopolist verhoogt prijs</text>
  <text x="385" y="164" font-size="11" fill="${GC.label}" font-weight="bold">INSTRUMENT:</text>
  <text x="500" y="164" font-size="11" font-weight="bold" fill="#154360">regulering / toezicht (ACM)</text>

  <!-- Links-onder: Informatie-asymmetrie (paars) -->
  <rect x="40" y="190" width="320" height="130" rx="10" fill="#F3E8F9" stroke="#7B2D8E" stroke-width="2"/>
  <rect x="40" y="190" width="320" height="28" fill="#7B2D8E" rx="10"/>
  <rect x="40" y="205" width="320" height="13" fill="#7B2D8E"/>
  <text x="200" y="209" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">3. Informatieongelijkheid</text>
  <text x="55" y="237" font-size="11" fill="${GC.label}" font-weight="bold">WAT GAAT ER MIS?</text>
  <text x="55" y="253" font-size="11" fill="#2D3748">één partij weet meer</text>
  <text x="55" y="273" font-size="11" fill="${GC.label}" font-weight="bold">VOORBEELD:</text>
  <text x="55" y="289" font-size="11" fill="#2D3748">tweedehands auto (verkoper weet meer)</text>
  <text x="55" y="309" font-size="11" fill="${GC.label}" font-weight="bold">INSTRUMENT:</text>
  <text x="165" y="309" font-size="11" font-weight="bold" fill="#6C3483">voorlichting / regels</text>

  <!-- Rechts-onder: Collectieve goederen (groen) -->
  <rect x="370" y="190" width="310" height="130" rx="10" fill="#E8F8F0" stroke="#186A3B" stroke-width="2"/>
  <rect x="370" y="190" width="310" height="28" fill="#186A3B" rx="10"/>
  <rect x="370" y="205" width="310" height="13" fill="#186A3B"/>
  <text x="525" y="209" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">4. Collectieve goederen</text>
  <text x="385" y="237" font-size="11" fill="${GC.label}" font-weight="bold">WAT GAAT ER MIS?</text>
  <text x="385" y="253" font-size="11" fill="#2D3748">markt levert het niet (free-rider)</text>
  <text x="385" y="273" font-size="11" fill="${GC.label}" font-weight="bold">VOORBEELD:</text>
  <text x="385" y="289" font-size="11" fill="#2D3748">defensie, dijken, straatverlichting</text>
  <text x="385" y="309" font-size="11" fill="${GC.label}" font-weight="bold">INSTRUMENT:</text>
  <text x="495" y="309" font-size="11" font-weight="bold" fill="#186A3B">overheid produceert</text>

  <!-- Footer hint -->
  <text x="360" y="346" text-anchor="middle" font-size="11" fill="${GC.label}" font-style="italic">Probleem herkennen \u2192 mechanisme begrijpen \u2192 instrument kiezen</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 2: DIAGNOSE-BESLISBOOM — welk marktfalen speelt er?
// ═══════════════════════════════════════════════════════════════════════════
function buildDiagnoseSVG() {
  // 4 parallel columns, each with Q → outcome
  const colors = [
    { q1: "Zitten alle kosten/",   q2: "baten in de prijs?", out: "Externe effecten",  main: "#E67E22", lt: "#FEF5E7", dk: "#BA6A1C" },
    { q1: "Is er voldoende",       q2: "concurrentie?",      out: "Marktmacht",        main: "#1A5276", lt: "#EBF5FB", dk: "#154360" },
    { q1: "Weet iedereen wat",     q2: "hij moet weten?",    out: "Informatie",        main: "#7B2D8E", lt: "#F3E8F9", dk: "#6C3483" },
    { q1: "Kan de markt het",      q2: "goed leveren?",      out: "Collectief goed",   main: "#186A3B", lt: "#E8F8F0", dk: "#186A3B" },
  ];
  const colW = 155, colGap = 15, startX = 30;
  let col = "";
  colors.forEach((c, i) => {
    const x = startX + i * (colW + colGap);
    const cx = x + colW/2;
    col += `
    <line x1="360" y1="102" x2="${cx}" y2="135" stroke="#718096" stroke-width="1.5" marker-end="url(#ahd)"/>
    <text x="${(360 + cx)/2 + (i<2?-8:8)}" y="122" text-anchor="middle" font-size="10" font-weight="bold" fill="#D9534F">NEE?</text>
    <rect x="${x}" y="140" width="${colW}" height="70" rx="8" fill="${c.lt}" stroke="${c.main}" stroke-width="1.5"/>
    <text x="${cx}" y="170" text-anchor="middle" font-size="11" font-weight="bold" fill="${c.dk}">${c.q1}</text>
    <text x="${cx}" y="188" text-anchor="middle" font-size="11" font-weight="bold" fill="${c.dk}">${c.q2}</text>
    <line x1="${cx}" y1="210" x2="${cx}" y2="238" stroke="${c.main}" stroke-width="1.8" marker-end="url(#ahd)"/>
    <rect x="${x}" y="243" width="${colW}" height="48" rx="8" fill="${c.main}"/>
    <text x="${cx}" y="272" text-anchor="middle" font-size="12" font-weight="bold" fill="#FFFFFF">\u2192 ${c.out}</text>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs><marker id="ahd" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#718096"/></marker></defs>

  <text x="360" y="22" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">Diagnose: welke vorm van marktfalen speelt er?</text>

  <!-- Start: centraal -->
  <rect x="260" y="50" width="200" height="48" rx="8" fill="#1E2761"/>
  <text x="360" y="70" text-anchor="middle" font-size="12" font-weight="bold" fill="#FFFFFF">Markt levert niet het</text>
  <text x="360" y="87" text-anchor="middle" font-size="12" font-weight="bold" fill="#FFFFFF">maatschappelijk optimum</text>

  ${col}

  <!-- Footer note -->
  <text x="360" y="320" text-anchor="middle" font-size="11" font-style="italic" fill="${GC.label}">Bij elk NEE is de bijbehorende vorm van marktfalen aan de orde.</text>
  <text x="360" y="337" text-anchor="middle" font-size="11" font-style="italic" fill="${GC.label}">Soms spelen meerdere vormen tegelijk.</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 3: TABAKSACCIJNS — prijs 11→15, consumption ↓
// V: P = 20 - 0.5Q (Q=0..40; bij Q=18, P=11 = markt)
// A: P = 0.25Q + 6.5  (bij Q=18, P=11)  — Market eq: (18, 11)
// Accijns t=4: A' = A + 4  → New eq where V = A+4: 20-0.5Q = 0.25Q+10.5 → Q=12.67
// Let me pick cleaner numbers.
// V: P = 20 - Q  (intercept 20, Q-intercept 20)
// A: P = 0.5Q + 5 → eq: 20-Q = 0.5Q+5 → Q=10, P=10
// Tax t=6: A' = 0.5Q + 11. New eq: 20-Q = 0.5Q+11 → Q=6, P=14 (clean!)
// Consumer: 10→14 (+4), producer: 10→8 (-2)
// ═══════════════════════════════════════════════════════════════════════════
function buildTabaksaccijnsSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 22, pMax = 22;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  // V: P = 20 - Q → (0,20)..(20,0)
  const v1x = qToX(0), v1y = pToY(20), v2x = qToX(20), v2y = pToY(0);
  // A: P = 0.5Q + 5 → (0,5)..(20,15)
  const a1x = qToX(0), a1y = pToY(5), a2x = qToX(20), a2y = pToY(15);
  // A_new: P = 0.5Q + 11 → (0,11)..(18,20)
  const an1x = qToX(0), an1y = pToY(11), an2x = qToX(18), an2y = pToY(20);

  const qOld = 10, pOld = 10;
  const qNew = 6,  pNew = 14, pProd = 8;
  const xOld = qToX(qOld), yOld = pToY(pOld);
  const xNew = qToX(qNew), yNew = pToY(pNew);
  const yProd = pToY(pProd);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs><marker id="aht" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/></marker></defs>

  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Casus: tabaksaccijns  t = €6  \u2192  minder roken</text>

  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#aht)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#aht)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Belastingopbrengst -->
  <rect x="${px}" y="${yNew}" width="${xNew - px}" height="${yProd - yNew}" fill="${GC.tax}" fill-opacity="0.60"/>
  <text x="${(px + xNew)/2}" y="${(yNew + yProd)/2 + 4}" text-anchor="middle" font-size="11" font-weight="bold" fill="#7B4A12">belastingopbrengst</text>

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
  <line x1="${qToX(15)}" y1="${pToY(13)}" x2="${qToX(15)-52}" y2="${pToY(13)}" stroke="${GC.supplyNew}" stroke-width="1.8" marker-end="url(#aht)"/>

  <!-- Dots -->
  <circle cx="${xOld}" cy="${yOld}" r="5" fill="${GC.supply}" opacity="0.85"/>
  <circle cx="${xNew}" cy="${yNew}" r="6" fill="${GC.supplyNew}"/>

  <!-- Axis labels -->
  <text x="72" y="${pToY(20)+4}" text-anchor="end" font-size="10" fill="${GC.label}">20</text>
  <text x="72" y="${yNew+4}" text-anchor="end" font-size="10" fill="${GC.axis}" font-weight="bold">14</text>
  <text x="72" y="${yOld+4}" text-anchor="end" font-size="10" fill="${GC.axis}">10</text>
  <text x="72" y="${yProd+4}" text-anchor="end" font-size="10" fill="${GC.axis}">8</text>
  <text x="${xNew}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}" font-weight="bold">6</text>
  <text x="${xOld}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">10</text>

  <text x="360" y="348" text-anchor="middle" font-size="10" fill="${GC.label}" font-style="italic">Prijs: €10 \u2192 €14   |   Consumptie: 10 \u2192 6 pakjes   |   Belastingopbrengst: 6 × 6 = €36</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 4: DOELMATIGHEID × RECHTVAARDIGHEID (2D quadrant)
// ═══════════════════════════════════════════════════════════════════════════
function buildQuadrantSVG() {
  const px = 100, py = 55, pw = 520, ph = 240;
  const ox = px + pw/2;  // origin in middle
  const oy = py + ph/2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs><marker id="ahq" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/></marker></defs>

  <text x="360" y="24" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">Beleid beoordelen: doelmatigheid \u00EDn rechtvaardigheid</text>

  <!-- 4 kwadranten als achtergrond -->
  <!-- Q1 rechts-boven: hoog doelmatig + rechtvaardig (GROEN) -->
  <rect x="${ox}" y="${py}" width="${pw/2}" height="${ph/2}" fill="#E8F8F0" opacity="0.7"/>
  <!-- Q2 links-boven: laag doelmatig + hoog rechtvaardig (GEEL) -->
  <rect x="${px}" y="${py}" width="${pw/2}" height="${ph/2}" fill="#FFF8E1" opacity="0.7"/>
  <!-- Q3 links-onder: laag doelmatig + laag rechtvaardig (ROOD) -->
  <rect x="${px}" y="${oy}" width="${pw/2}" height="${ph/2}" fill="#FDE8E8" opacity="0.7"/>
  <!-- Q4 rechts-onder: hoog doelmatig + laag rechtvaardig (GEEL) -->
  <rect x="${ox}" y="${oy}" width="${pw/2}" height="${ph/2}" fill="#FFF8E1" opacity="0.7"/>

  <!-- Kwadrantranden -->
  <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="none" stroke="${GC.grid}" stroke-width="1"/>
  <!-- Asssen (kruis midden) -->
  <line x1="${px}" y1="${oy}" x2="${px+pw}" y2="${oy}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ahq)"/>
  <line x1="${ox}" y1="${py+ph}" x2="${ox}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ahq)"/>

  <!-- Asteksten -->
  <text x="${px + pw + 10}" y="${oy - 6}" font-size="11" font-weight="bold" fill="${GC.axis}">doelmatigheid \u2192</text>
  <text x="${ox + 6}" y="${py - 6}" font-size="11" font-weight="bold" fill="${GC.axis}">rechtvaardigheid \u2191</text>

  <!-- Kwadrantlabels -->
  <text x="${px + pw*0.75}" y="${py + 22}" text-anchor="middle" font-size="12" font-weight="bold" fill="#186A3B">IDEAAL</text>
  <text x="${px + pw*0.75}" y="${py + 38}" text-anchor="middle" font-size="10" fill="#186A3B">efficient \u00E9n eerlijk</text>

  <text x="${px + pw*0.25}" y="${py + 22}" text-anchor="middle" font-size="12" font-weight="bold" fill="#7B4A12">WEL EERLIJK,</text>
  <text x="${px + pw*0.25}" y="${py + 38}" text-anchor="middle" font-size="10" fill="#7B4A12">niet efficient</text>

  <text x="${px + pw*0.25}" y="${oy + 24}" text-anchor="middle" font-size="12" font-weight="bold" fill="#922B21">SLECHT:</text>
  <text x="${px + pw*0.25}" y="${oy + 40}" text-anchor="middle" font-size="10" fill="#922B21">beide niet</text>

  <text x="${px + pw*0.75}" y="${oy + 24}" text-anchor="middle" font-size="12" font-weight="bold" fill="#7B4A12">WEL EFFICIENT,</text>
  <text x="${px + pw*0.75}" y="${oy + 40}" text-anchor="middle" font-size="10" fill="#7B4A12">niet eerlijk</text>

  <!-- Voorbeelden (dots) -->
  <!-- Tabaksaccijns: hoog doelmatig (lost externalia op), matig rechtvaardig (regressief): Q4 -->
  <circle cx="${ox + 70}" cy="${oy + 70}" r="6" fill="#7B2D8E"/>
  <text x="${ox + 82}" y="${oy + 74}" font-size="11" font-weight="bold" fill="#7B2D8E">Tabaksaccijns</text>

  <!-- Subsidie vaccinatie: hoog doelmatig + hoog rechtvaardig (Q1) -->
  <circle cx="${ox + 100}" cy="${oy - 60}" r="6" fill="#186A3B"/>
  <text x="${ox + 112}" y="${oy - 56}" font-size="11" font-weight="bold" fill="#186A3B">Vaccinatie-</text>
  <text x="${ox + 112}" y="${oy - 42}" font-size="11" font-weight="bold" fill="#186A3B">subsidie</text>

  <!-- Huurplafond: laag doelmatig (tekort), hoog rechtvaardig (helpt arme huurders) Q2 -->
  <circle cx="${px + 75}" cy="${oy - 55}" r="6" fill="#BA6A1C"/>
  <text x="${px + 87}" y="${oy - 51}" font-size="11" font-weight="bold" fill="#BA6A1C">Huurplafond</text>

  <!-- Vuurwerkverbod lokaal + soepele handhaving: beide mager Q3 -->
  <circle cx="${px + 100}" cy="${oy + 50}" r="6" fill="#D9534F"/>
  <text x="${px + 112}" y="${oy + 54}" font-size="11" font-weight="bold" fill="#D9534F">Slecht uitgevoerd</text>
  <text x="${px + 112}" y="${oy + 68}" font-size="11" font-weight="bold" fill="#D9534F">beleid</text>

  <!-- Bottom hint -->
  <text x="360" y="343" text-anchor="middle" font-size="11" font-style="italic" fill="${GC.label}">Goed beleid zit rechtsboven — maar in de praktijk is dit bijna altijd een afweging.</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 5: REDENEERROUTE — 6-staps flowchart
// ═══════════════════════════════════════════════════════════════════════════
function buildRedeneerrouteSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs><marker id="ahr" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#718096"/></marker></defs>

  <text x="360" y="26" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">Redeneerroute: beleid beoordelen in zes stappen</text>

  ${[
    { t: "1. Welk marktfalen speelt hier?",                              c: "#1A5276" },
    { t: "2. Welk instrument wordt ingezet?",                             c: "#1A5276" },
    { t: "3. Lost het instrument het marktfalen op? (doelmatigheid)",    c: "#186A3B" },
    { t: "4. Wie draagt de lasten? (rechtvaardigheid)",                   c: "#E67E22" },
    { t: "5. Zijn er onbedoelde neveneffecten?",                          c: "#7B2D8E" },
    { t: "6. Conclusie: weeg doelmatigheid tegen rechtvaardigheid",       c: "#1E2761" },
  ].map((st, i) => {
    const y = 55 + i * 46;
    return `<rect x="80" y="${y}" width="560" height="36" rx="6" fill="${st.c}"/>
      <text x="100" y="${y + 23}" font-size="13" font-weight="bold" fill="#FFFFFF">${st.t}</text>
      ${i < 5 ? `<line x1="360" y1="${y + 36}" x2="360" y2="${y + 46}" stroke="#718096" stroke-width="1.5" marker-end="url(#ahr)"/>` : ""}`;
  }).join("")}
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
  slide.addText(title, { x: 0.5, y: 0, w: 9, h: 0.75,
    fontSize: 24, fontFace: "Arial", color: C.white, bold: true, valign: "middle" });
  return slide;
}
function drawCard(slide, x, y, w, h, accentColor, bgColor, title, titleColor, bodyParts) {
  slide.addShape("rect", { x, y, w, h, fill: { color: bgColor }, rectRadius: 0.05, shadow: makeShadow() });
  slide.addShape("rect", { x, y, w: 0.06, h, fill: { color: accentColor } });
  slide.addText(title, { x: x + 0.2, y: y + 0.12, w: w - 0.35, h: 0.4,
    fontSize: 18, fontFace: "Arial", color: titleColor, bold: true, valign: "top", margin: 0 });
  if (bodyParts && bodyParts.length) {
    slide.addText(bodyParts, { x: x + 0.2, y: y + 0.55, w: w - 0.35, h: h - 0.7,
      fontSize: 13, fontFace: "Arial", color: C.dark, valign: "top", align: "left",
      lineSpacingMultiple: 1.2, margin: 0 });
  }
}
function drawGraph(slide, img) { slide.addImage({ data: img, x: 0.75, y: 0.95, w: 8.5, h: 4.25 }); }
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
  const sx = opts.x ?? 1.3, sy = opts.y ?? 1.1, sw = opts.w ?? 7.4, sh = opts.h ?? 0.55, gap = 0.1;
  const hiColor = opts.hiColor || DOMAIN.color;
  steps.forEach((st, i) => {
    const y = sy + i * (sh + gap);
    slide.addShape("rect", { x: sx, y, w: sw, h: sh,
      fill: { color: st.hi ? hiColor : C.cream }, rectRadius: 0.04, shadow: makeShadow() });
    const pref = i > 0 ? "\u2193  " : "";
    slide.addText(pref + st.t, { x: sx + 0.2, y, w: sw - 0.3, h: sh,
      fontSize: 14, fontFace: "Arial", color: st.hi ? C.white : C.dark, bold: st.hi,
      valign: "middle", margin: 0 });
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
  pres.title = "3.3.4 Toepassen: Overheid";

  addTitleMaster(pres);
  addContentMaster(pres);

  const svgEntries = [
    { name: "334-vier-vormen",         svg: buildVierVormenSVG() },
    { name: "334-diagnose-beslisboom", svg: buildDiagnoseSVG() },
    { name: "334-tabaksaccijns",       svg: buildTabaksaccijnsSVG() },
    { name: "334-doelm-rechtv-kwad",   svg: buildQuadrantSVG() },
    { name: "334-redeneerroute",       svg: buildRedeneerrouteSVG() },
  ];
  const bufs = await Promise.all(svgEntries.map(e => svgToPng(e.svg)));
  const [gVV, gDiag, gTab, gKw, gRed] = bufs.map(pngToBase64);

  // ── DIA 1: Titel ──────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Toepassen: Overheid", { x: 0.7, y: 1.2, w: 8.6, h: 2,
      fontSize: 40, fontFace: "Arial", color: C.white, bold: true });
    s.addText("Paragraaf 3.3.4", { x: 0.7, y: 3.2, w: 8.6, h: 0.5,
      fontSize: 20, fontFace: "Arial", color: C.gray });
    s.addText("Hoofdstuk 3: Overheid  |  Economie VWO", { x: 0.7, y: 5.15, w: 8.6, h: 0.475,
      fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle" });
    s.addNotes("Integratieparagraaf: alles uit §3.3.1 t/m §3.3.3 komt samen. We oefenen met casussen: welk marktfalen? welk instrument? werkt het? is het eerlijk?");
  }

  // ── DIA 2: Wat moet je kunnen? ────────────────────────────────────
  {
    const s = addContentSlide(pres, "Wat moet je kunnen?");
    const doelen = [
      "Marktfalen herkennen en classificeren in casussen",
      "Het juiste beleidsinstrument koppelen aan het probleem",
      "Collectieve goederen herkennen aan twee kenmerken",
      "Beleid beoordelen op doelmatigheid (werkt het?)",
      "Beleid beoordelen op rechtvaardigheid (wie draagt de lasten?)",
    ];
    s.addText(doelen.join("\n"), { x: 0.7, y: 1.15, w: 8.6, h: 3.6,
      bullet: { code: "25A0" }, fontSize: 17, fontFace: "Arial", color: C.dark,
      paraSpaceAfter: 10, lineSpacingMultiple: 1.25 });
    s.addNotes("Deze paragraaf is pure toepassing — geen nieuwe theorie. Wel een belangrijke uitbreiding: doelmatigheid ÉN rechtvaardigheid als twee afzonderlijke beoordelingscriteria.");
  }

  // ── DIA 3: De vier vormen van marktfalen ──────────────────────────
  {
    const s = addContentSlide(pres, "De vier vormen van marktfalen");
    drawGraph(s, gVV);
    s.addNotes("Overzichtsdia. Vier kleuren, vier vormen. §3.3.1 behandelde vorm 1 en 2 (externe effecten + marktmacht), §3.3.3 behandelde vorm 4 (collectief). Vorm 3 (informatie) wordt hier toegevoegd.");
  }

  // ── DIA 4: Diagnose beslisboom ────────────────────────────────────
  {
    const s = addContentSlide(pres, "Diagnose: welk marktfalen speelt er?");
    drawGraph(s, gDiag);
    s.addNotes("Gebruik de beslisboom als diagnose-instrument. Begin altijd met: ‘zitten alle kosten/baten in de prijs?’ Als het antwoord nee is, is het altijd een extern effect.");
  }

  // ── DIA 5: Van marktfalen naar instrument ─────────────────────────
  {
    const s = addContentSlide(pres, "Van marktfalen naar instrument");
    const rows = [
      [
        { text: "Marktfalen",   options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, fontFace: "Arial" } },
        { text: "Probleem",     options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, fontFace: "Arial" } },
        { text: "Instrument",   options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, fontFace: "Arial" } },
      ],
      [
        { text: "Negatief extern effect", options: { fill: { color: C.rowAlt }, bold: true, color: "BA6A1C", fontSize: 12, fontFace: "Arial" } },
        { text: "prijs te laag, te veel productie", options: { fill: { color: C.rowAlt }, fontSize: 12, fontFace: "Arial" } },
        { text: "Belasting (accijns)", options: { fill: { color: C.rowAlt }, fontSize: 12, fontFace: "Arial", bold: true, color: "186A3B" } },
      ],
      [
        { text: "Positief extern effect", options: { bold: true, color: "BA6A1C", fontSize: 12, fontFace: "Arial" } },
        { text: "prijs te hoog, te weinig consumptie", options: { fontSize: 12, fontFace: "Arial" } },
        { text: "Subsidie", options: { fontSize: 12, fontFace: "Arial", bold: true, color: "186A3B" } },
      ],
      [
        { text: "Marktmacht", options: { fill: { color: C.rowAlt }, bold: true, color: "154360", fontSize: 12, fontFace: "Arial" } },
        { text: "prijs te hoog, Q te laag", options: { fill: { color: C.rowAlt }, fontSize: 12, fontFace: "Arial" } },
        { text: "Regulering / toezicht (ACM)", options: { fill: { color: C.rowAlt }, fontSize: 12, fontFace: "Arial", bold: true, color: "186A3B" } },
      ],
      [
        { text: "Informatieongelijkheid", options: { bold: true, color: "6C3483", fontSize: 12, fontFace: "Arial" } },
        { text: "één partij weet meer", options: { fontSize: 12, fontFace: "Arial" } },
        { text: "Voorlichting / verplichte regels", options: { fontSize: 12, fontFace: "Arial", bold: true, color: "186A3B" } },
      ],
      [
        { text: "Collectief goed", options: { fill: { color: C.rowAlt }, bold: true, color: "186A3B", fontSize: 12, fontFace: "Arial" } },
        { text: "markt levert het niet (free-rider)", options: { fill: { color: C.rowAlt }, fontSize: 12, fontFace: "Arial" } },
        { text: "Overheid produceert zelf", options: { fill: { color: C.rowAlt }, fontSize: 12, fontFace: "Arial", bold: true, color: "186A3B" } },
      ],
    ];
    s.addTable(rows, { x: 0.5, y: 1.05, w: 9, border: { pt: 0.5, color: C.borderGray }, colW: [3.0, 3.2, 2.8] });
    s.addNotes("Koppel de vijf rijen expliciet aan eerdere paragrafen. Gebruik de tabel als retrieval: dek een kolom af en laat de leerlingen hem reconstrueren.");
  }

  // ── DIA 6: Is het een collectief goed? ────────────────────────────
  {
    const s = addContentSlide(pres, "Herken een collectief goed");
    drawFlow(s, [
      { t: "Stap 1: kan iemand worden uitgesloten van gebruik?", hi: false },
      { t: "Ja \u2192 priv\u00E9- of clubgoed (markt kan het leveren)", hi: false },
      { t: "Nee \u2192 stap 2: gaat gebruik door de \u00E9\u00E9n ten koste van de ander?", hi: true },
      { t: "Ja \u2192 gemeenschappelijk goed (bv. visgronden)", hi: false },
      { t: "Nee \u2192 collectief goed (bv. dijken, defensie)", hi: true },
    ]);
    s.addNotes("Eenzelfde beslisboom als in §3.3.3, maar nu als applicatie-oefening. Test met: Wikipedia? Lantarenpaal in jouw straat? Natuurreservaat?");
  }

  // ── DIA 7: Casus tabaksaccijns — opzet ────────────────────────────
  {
    const s = addContentSlide(pres, "Casus: tabaksaccijns");
    drawCard(s, 0.5, 1.05, 9, 1.1, "#7B2D8E", C.lightPurple, "De maatregel", "6C3483",
      [
        { text: "\u201CDe overheid verhoogt de accijns op sigaretten van €11 naar €15 per pakje.\u201D", options: { fontSize: 15, italic: true } },
      ]);
    const rows = [
      ["1", "Welk marktfalen?",          "Negatief extern effect (gezondheidskosten voor de samenleving)"],
      ["2", "Welk instrument?",           "Corrigerende belasting (pigou-belasting / accijns)"],
      ["3", "Hoe werkt het?",             "Prijs stijgt \u2192 consumptie daalt \u2192 externe kosten dalen"],
      ["4", "Doelmatig?",                 "Ja: minder roken betekent minder maatschappelijke kosten"],
      ["5", "Rechtvaardig?",              "Discussie: lagere inkomens betalen relatief meer (regressief)"],
    ];
    const sy = 2.25, sh = 0.52, sx = 0.5, sw = 9, gap = 0.06;
    rows.forEach((r, i) => {
      const y = sy + i * (sh + gap);
      s.addShape("rect", { x: sx, y, w: sw, h: sh, fill: { color: i % 2 ? C.rowAlt : C.white }, line: { color: C.borderGray, width: 0.5 } });
      s.addShape("rect", { x: sx, y, w: 0.4, h: sh, fill: { color: "7B2D8E" } });
      s.addText(r[0], { x: sx, y, w: 0.4, h: sh, fontSize: 15, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
      s.addText(r[1], { x: sx + 0.5, y, w: 2.6, h: sh, fontSize: 13, fontFace: "Arial", color: "6C3483", bold: true, valign: "middle", margin: 0 });
      s.addText(r[2], { x: sx + 3.15, y, w: sw - 3.3, h: sh, fontSize: 12, fontFace: "Arial", color: C.dark, valign: "middle", margin: 0 });
    });
    s.addNotes("Loop de 5 rijen samen door. Let op rij 5: dit is GEEN simpele vraag — het gaat om een waardeoordeel. Laat leerlingen beide kanten verdedigen.");
  }

  // ── DIA 8: Tabaksaccijns — grafiek ────────────────────────────────
  {
    const s = addContentSlide(pres, "Tabaksaccijns in de grafiek");
    drawGraphWithLegend(s, gTab, [
      { color: "1A5276", abbr: "V",      desc: "vraag naar sigaretten" },
      { color: "E67E22", abbr: "A+acc.", desc: "aanbod na accijns" },
      { color: "F8C471", abbr: "\u25A0", desc: "belastingopbrengst" },
      { color: "1E8449", abbr: "\u2193Q", desc: "consumptie daalt" },
    ]);
    s.addNotes("De accijns van €6 (11→15 in de casus, hier gemodelleerd als €10→€14 voor ronde getallen) verschuift de aanbodlijn omhoog. Consumptie daalt van 10 naar 6 pakjes. Dat is precies wat de overheid wil: minder roken.");
  }

  // ── DIA 9: Beleid beoordelen — twee assen ─────────────────────────
  {
    const s = addContentSlide(pres, "Beleid beoordelen: twee vragen");
    drawCard(s, 0.5, 1.05, 4.3, 3.9, "#186A3B", C.dGreenLt, "1. Doelmatigheid", "186A3B",
      [
        { text: "Leidt het beleid tot een betere allocatie?", options: { breakLine: true, bold: true } },
        { text: "\u2022  minder welvaartsverlies?", options: { fontSize: 12, breakLine: true } },
        { text: "\u2022  externe effecten gecorrigeerd?", options: { fontSize: 12, breakLine: true } },
        { text: "\u2022  is het middel proportioneel?", options: { fontSize: 12, breakLine: true } },
        { text: "\u2022  kosten vs. baten van het beleid?", options: { fontSize: 12 } },
      ]);
    drawCard(s, 5.2, 1.05, 4.3, 3.9, "#E67E22", C.dAmberLt, "2. Rechtvaardigheid", "BA6A1C",
      [
        { text: "Wie draagt de lasten?", options: { breakLine: true, bold: true } },
        { text: "\u2022  raakt het lagere inkomens harder?", options: { fontSize: 12, breakLine: true } },
        { text: "\u2022  profijtbeginsel vs. solidariteit?", options: { fontSize: 12, breakLine: true } },
        { text: "\u2022  worden zwakkeren beschermd?", options: { fontSize: 12, breakLine: true } },
        { text: "\u2022  draagkrachtbeginsel toegepast?", options: { fontSize: 12 } },
      ]);
    s.addNotes("DOELMATIGHEID = werkt het economisch? RECHTVAARDIGHEID = is het eerlijk verdeeld? Geen van beide is ‘beter’ — het is een afweging.");
  }

  // ── DIA 10: Doelmatigheid × rechtvaardigheid kwadrant ─────────────
  {
    const s = addContentSlide(pres, "Het beoordelingsveld");
    drawGraph(s, gKw);
    s.addNotes("Plot elk beleid in deze ruimte. Vaccinatiesubsidie: rechtsboven (ideal). Tabaksaccijns: rechtsonder (werkt, maar regressief). Huurplafond: linksboven (eerlijk bedoeld, maar ondoelmatig). Het mooie: het DEBAT gaat vaak over de plaatsing.");
  }

  // ── DIA 11: Redeneerroute ─────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Redeneerroute: beleid beoordelen");
    drawGraph(s, gRed);
    s.addNotes("Gebruik deze 6 stappen als sjabloon voor elke casus-vraag op de toets. Leerlingen kunnen het per stap noteren — dat borgt volledigheid.");
  }

  // ── DIA 12: Marktfalen vs. overheidsfalen ─────────────────────────
  {
    const s = addContentSlide(pres, "Marktfalen \u2260 overheidsfalen");
    drawCard(s, 0.5, 1.05, 4.3, 3.9, C.red, C.lightRed, "Marktfalen", "922B21",
      [
        { text: "De markt zelf levert niet het optimum.", options: { breakLine: true, bold: true } },
        { text: "", options: { breakLine: true } },
        { text: "Oorzaken: externe effecten, marktmacht, informatie, collectieve goederen.", options: { breakLine: true } },
        { text: "", options: { breakLine: true } },
        { text: "\u2192 ingrijpen kan nuttig zijn", options: { fontSize: 12, italic: true, color: C.gray } },
      ]);
    drawCard(s, 5.2, 1.05, 4.3, 3.9, "#6C3483", C.lightPurple, "Overheidsfalen", "6C3483",
      [
        { text: "Het ingrijpen maakt het probleem groter of creëert nieuwe problemen.", options: { breakLine: true, bold: true } },
        { text: "", options: { breakLine: true } },
        { text: "Oorzaken: te log apparaat, verkeerde prikkels, lobbydruk, onbedoelde neveneffecten.", options: { breakLine: true } },
        { text: "", options: { breakLine: true } },
        { text: "\u2192 ingrijpen is niet automatisch een verbetering", options: { fontSize: 12, italic: true, color: C.gray } },
      ]);
    s.addNotes("Dit is de nuancering die VWO-leerlingen altijd moeten meenemen: dat de markt faalt, betekent niet automatisch dat de overheid het beter kan. Voorbeelden van overheidsfalen: wachttijden in de zorg, hoge administratieve lasten.");
  }

  // ── DIA 13: Veelgemaakte fouten ───────────────────────────────────
  {
    const s = addContentSlide(pres, "Veelgemaakte fouten");
    const items = [
      { title: "\u201CMarktfalen = overheidsfalen\u201D",
        body: "Onjuist. Marktfalen = de markt faalt. Overheidsfalen = het ingrijpen zelf maakt het erger. Niet hetzelfde." },
      { title: "\u201CCollectief goed = door de overheid geleverd\u201D",
        body: "Onjuist. Een goed is collectief vanwege zijn EIGENSCHAPPEN (niet-uitsluitbaar + niet-rivaliserend), niet omdat de overheid het levert." },
      { title: "\u201CBelasting = verbod\u201D",
        body: "Onjuist. Een belasting stuurt via de prijs (de markt blijft bestaan). Een verbod schakelt de markt uit. Heel verschillende instrumenten." },
    ];
    const sx = 0.6, sy = 1.05, sw = 8.8, sh = 1.17, gap = 0.14;
    items.forEach((it, i) => {
      const y = sy + i * (sh + gap);
      s.addShape("rect", { x: sx, y, w: sw, h: sh, fill: { color: C.lightRed }, rectRadius: 0.04 });
      s.addShape("rect", { x: sx, y, w: 0.06, h: sh, fill: { color: C.red } });
      s.addText(it.title, { x: sx + 0.25, y: y + 0.1, w: sw - 0.4, h: 0.4,
        fontSize: 15, fontFace: "Arial", color: "922B21", bold: true, margin: 0, valign: "top" });
      s.addText(it.body, { x: sx + 0.25, y: y + 0.48, w: sw - 0.4, h: sh - 0.55,
        fontSize: 12, fontFace: "Arial", color: C.dark, margin: 0, valign: "top", lineSpacingMultiple: 1.2 });
    });
    s.addNotes("Dit zijn toets-klassiekers. Vraag bij elk expliciet: wie kent een voorbeeld van deze fout uit gisteren?");
  }

  // ── DIA 14: Checklist (voor de toets) ─────────────────────────────
  {
    const s = addContentSlide(pres, "Zelftest: kun je deze zes dingen?");
    const doelen = [
      "\u2713  Ik herken de vier vormen van marktfalen in een casus",
      "\u2713  Ik kan uitleggen waarom de overheid ingrijpt",
      "\u2713  Ik koppel het juiste instrument aan het probleem",
      "\u2713  Ik herken een collectief goed aan beide kenmerken",
      "\u2713  Ik leg het free-riderprobleem uit",
      "\u2713  Ik beoordeel beleid op doelmatigheid \u00E9n rechtvaardigheid",
    ];
    s.addText(doelen.join("\n"), { x: 0.7, y: 1.15, w: 8.6, h: 3.6,
      fontSize: 16, fontFace: "Arial", color: C.dark,
      paraSpaceAfter: 12, lineSpacingMultiple: 1.3 });
    s.addNotes("Laat leerlingen per check eerlijk ‘groen / oranje / rood’ zetten. Waar staat rood? Daar nog even terug naar de paragraaf.");
  }

  // ── DIA 15: Samenvatting ──────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Samenvatting", { x: 0.7, y: 0.35, w: 8.6, h: 0.6,
      fontSize: 30, fontFace: "Arial", color: C.white, bold: true });
    s.addText("Alles uit hoofdstuk 3 op \u00E9\u00E9n dia", { x: 0.7, y: 0.95, w: 8.6, h: 0.4,
      fontSize: 14, fontFace: "Arial", color: C.gray, italic: true });
    const punten = [
      "Vier vormen van marktfalen: externe effecten, marktmacht, informatie, collectieve goederen",
      "Vier instrumenten: belasting/subsidie, regulering, voorlichting, overheid produceert",
      "Diagnose: eerst vaststellen WELK marktfalen, dan pas het instrument kiezen",
      "Beoordeel altijd op twee assen: doelmatigheid (werkt het?) en rechtvaardigheid (eerlijk?)",
      "Marktfalen \u2260 overheidsfalen — ingrijpen is niet automatisch beter",
      "Redeneerroute: marktfalen \u2192 instrument \u2192 doelmatigheid \u2192 rechtvaardigheid \u2192 neveneffecten \u2192 conclusie",
    ];
    s.addText(punten.join("\n"), { x: 0.7, y: 1.55, w: 8.6, h: 3.5,
      bullet: { code: "25A0" }, fontSize: 14, fontFace: "Arial", color: C.white,
      paraSpaceAfter: 8, lineSpacingMultiple: 1.25 });
    s.addNotes("Sluit af met een open casus die alle vier de vormen combineert (bv. luchtvaartsector: externe effecten + marktmacht + informatie). Leerlingen kiezen instrumenten en beoordelen.");
  }

  const outDir = path.resolve(__dirname, "..", "output-334-pptx");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  saveSvgFiles(svgEntries, outDir);
  const outPath = path.join(outDir, "3.3.4 Toepassen – presentatie.pptx");
  await pres.writeFile({ fileName: outPath });
  console.log("PPTX written to", outPath);
}

build().catch(e => { console.error(e); process.exit(1); });
