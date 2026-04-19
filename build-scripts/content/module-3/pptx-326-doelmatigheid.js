/**
 * PPTX Build: 3.2.6 Economische doelmatigheid – presentatie met grafieken
 *
 * 12 dia's met embedded SVG-grafieken voor surplus bij VC en monopolie.
 * Uses the Harberger triangle explanation from the reference docx.
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/pptx-326-doelmatigheid.js
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

const GC = {
  demand: "#1A5276", supply: "#1E8449", cost: "#E67E22", costAvg: "#D9534F",
  price: "#1A5276", revenue: "#7B2D8E", axis: "#2D3748", grid: "#CBD5E0",
  label: "#718096", title: "#1E2761", bg: "#F7FAFC",
  surplus: "#85C1E9", prodSurplus: "#82E0AA", dwl: "#E74C3C",
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
// GRAPH 1: SURPLUS BIJ VOLKOMEN CONCURRENTIE
// V: P = 60 − Q, A (= MK): P = Q. Evenwicht: Q* = 30, P* = 30
// CS = ½ × 30 × 30 = 450, PS = ½ × 30 × 30 = 450, TS = 900
// ═══════════════════════════════════════════════════════════════════════════
function buildVCSurplusSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 65, pMax = 65;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  // V: P = 60 − Q
  const v0 = { x: qToX(0), y: pToY(60) };
  const v60 = { x: qToX(60), y: pToY(0) };

  // A = MK: P = Q
  const a0 = { x: qToX(0), y: pToY(0) };
  const a55 = { x: qToX(55), y: pToY(55) };

  // Equilibrium: Q=30, P=30
  const eqX = qToX(30), eqY = pToY(30);

  // CS triangle: (0,60), (0,30), (30,30)
  const csPoints = `${qToX(0)},${pToY(60)} ${eqX},${eqY} ${qToX(0)},${eqY}`;
  // PS triangle: (0,0), (30,30), (0,30)
  const psPoints = `${qToX(0)},${pToY(0)} ${eqX},${eqY} ${qToX(0)},${eqY}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Surplus bij volkomen concurrentie</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="72" y="${py+ph+4}" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- CS triangle -->
  <polygon points="${csPoints}" fill="${GC.surplus}" fill-opacity="0.45"/>
  <text x="${qToX(6)}" y="${pToY(45)}" font-size="11" font-weight="bold" fill="#1A5276">CS = 450</text>

  <!-- PS triangle -->
  <polygon points="${psPoints}" fill="${GC.prodSurplus}" fill-opacity="0.45"/>
  <text x="${qToX(6)}" y="${pToY(12)}" font-size="11" font-weight="bold" fill="#186A3B">PS = 450</text>

  <!-- Dashed lines to equilibrium -->
  <line x1="${px}" y1="${eqY}" x2="${eqX}" y2="${eqY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <line x1="${eqX}" y1="${eqY}" x2="${eqX}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>

  <!-- Demand curve (V) -->
  <line x1="${v0.x}" y1="${v0.y}" x2="${v60.x}" y2="${v60.y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v60.x+5}" y="${v60.y-8}" font-size="12" font-weight="bold" fill="${GC.demand}">V</text>

  <!-- Supply / MK curve (A) -->
  <line x1="${a0.x}" y1="${a0.y}" x2="${a55.x}" y2="${a55.y}" stroke="${GC.supply}" stroke-width="2.5"/>
  <text x="${a55.x+5}" y="${a55.y+4}" font-size="12" font-weight="bold" fill="${GC.supply}">MK = A</text>

  <!-- Equilibrium dot -->
  <circle cx="${eqX}" cy="${eqY}" r="5" fill="${GC.demand}"/>
  <text x="${eqX+10}" y="${eqY-8}" font-size="11" font-weight="bold" fill="${GC.axis}">B (30, 30)</text>

  <!-- Axis labels -->
  <text x="72" y="${pToY(60)+4}" text-anchor="end" font-size="10" fill="${GC.label}">60</text>
  <text x="72" y="${eqY+4}" text-anchor="end" font-size="10" fill="${GC.axis}">30</text>
  <text x="${eqX}" y="${py+ph+15}" text-anchor="middle" font-size="10" fill="${GC.axis}">30</text>

  <!-- TS label -->
  <text x="${qToX(35)}" y="${pToY(32)}" font-size="12" font-weight="bold" fill="${GC.title}">TS = 900</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 2: HARBERGER TRIANGLE — SURPLUS BIJ MONOPOLIE
// V: P = 60 − Q, MK: P = Q, MO: P = 60 − 2Q
// VC: Q=30, P=30. Monopolie: MO=MK → Q=20, P=40, MK=20
// Harberger triangle C(20,40)-B(30,30)-A(20,20) = ½ × 10 × 20 = 100
// ═══════════════════════════════════════════════════════════════════════════
function buildHarbergerSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 65, pMax = 65;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  // V: P = 60 − Q
  const v0 = { x: qToX(0), y: pToY(60) };
  const v60 = { x: qToX(60), y: pToY(0) };

  // MK: P = Q
  const mk0 = { x: qToX(0), y: pToY(0) };
  const mk55 = { x: qToX(55), y: pToY(55) };

  // MO: P = 60 − 2Q (dashed)
  const mo0 = { x: qToX(0), y: pToY(60) };
  const mo30 = { x: qToX(30), y: pToY(0) };

  // Key points
  const cX = qToX(20), cY = pToY(40);  // C: monopoly price on V
  const bX = qToX(30), bY = pToY(30);  // B: VC equilibrium
  const aX = qToX(20), aY = pToY(20);  // A: MO=MK on MK line

  // Harberger triangle: C-B-A
  const dwlPoints = `${cX},${cY} ${bX},${bY} ${aX},${aY}`;

  // Surplus transfer rectangle: from P=30 to P=40, Q=0 to Q=20
  const rectX = qToX(0), rectY = pToY(40), rectW = cX - qToX(0), rectH = pToY(30) - pToY(40);

  // CS at monopoly: triangle above P=40, below V, Q=0 to Q=20
  // V at Q=0: P=60, V at Q=20: P=40. So CS = triangle (0,60)-(20,40)-(0,40)
  const csPoints = `${qToX(0)},${pToY(60)} ${cX},${cY} ${qToX(0)},${cY}`;

  // PS at monopoly: area below P=40, above MK, Q=0 to Q=20
  // = rectangle (0,20)-(20,20)-(20,40)-(0,40) minus triangle under MK
  // Actually PS = trapezoid: (0,0)-(20,20)-(20,40)-(0,40) = rectangle + triangle
  // PS polygon: (0,40)-(20,40)-(20,20)-(0,0)
  const psPoints = `${qToX(0)},${cY} ${cX},${cY} ${aX},${aY} ${qToX(0)},${pToY(0)}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Harbergerdriehoek: welvaartsverlies bij monopolie</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah2)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah2)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="72" y="${py+ph+4}" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- CS at monopoly (light blue triangle) -->
  <polygon points="${csPoints}" fill="${GC.surplus}" fill-opacity="0.35"/>
  <text x="${qToX(3)}" y="${pToY(50)}" font-size="10" font-weight="bold" fill="#1A5276">CS</text>

  <!-- PS at monopoly (light green trapezoid) -->
  <polygon points="${psPoints}" fill="${GC.prodSurplus}" fill-opacity="0.35"/>
  <text x="${qToX(4)}" y="${pToY(22)}" font-size="10" font-weight="bold" fill="#186A3B">PS</text>

  <!-- Surplus transfer rectangle (CS→PS, lighter shade) -->
  <rect x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}" fill="#85B7EB" fill-opacity="0.15" stroke="#85B7EB" stroke-width="0.5" stroke-dasharray="3,2"/>

  <!-- Harberger triangle (red) -->
  <polygon points="${dwlPoints}" fill="#F09595" fill-opacity="0.55" stroke="${GC.dwl}" stroke-width="1.5"/>
  <text x="${qToX(24)}" y="${pToY(31)}" font-size="11" font-weight="bold" fill="#C0392B">DWL</text>
  <text x="${qToX(24)}" y="${pToY(28)}" font-size="10" fill="#C0392B">= 100</text>

  <!-- Dashed lines -->
  <line x1="${px}" y1="${cY}" x2="${cX}" y2="${cY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <line x1="${cX}" y1="${cY}" x2="${cX}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <line x1="${px}" y1="${bY}" x2="${bX}" y2="${bY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <line x1="${bX}" y1="${bY}" x2="${bX}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <line x1="${px}" y1="${aY}" x2="${aX}" y2="${aY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Demand curve (V) -->
  <line x1="${v0.x}" y1="${v0.y}" x2="${v60.x}" y2="${v60.y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v60.x+5}" y="${v60.y-8}" font-size="12" font-weight="bold" fill="${GC.demand}">V</text>

  <!-- MK curve -->
  <line x1="${mk0.x}" y1="${mk0.y}" x2="${mk55.x}" y2="${mk55.y}" stroke="${GC.supply}" stroke-width="2.5"/>
  <text x="${mk55.x+5}" y="${mk55.y+4}" font-size="12" font-weight="bold" fill="${GC.supply}">MK = A</text>

  <!-- MO curve (dashed) -->
  <line x1="${mo0.x}" y1="${mo0.y}" x2="${mo30.x}" y2="${mo30.y}" stroke="${GC.revenue}" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="${mo30.x+5}" y="${mo30.y-8}" font-size="12" font-weight="bold" fill="${GC.revenue}">MO</text>

  <!-- Point C: monopoly price (20, 40) -->
  <circle cx="${cX}" cy="${cY}" r="5" fill="${GC.dwl}"/>
  <text x="${cX-40}" y="${cY-10}" font-size="11" font-weight="bold" fill="${GC.dwl}">C</text>
  <text x="${cX-50}" y="${cY+5}" font-size="9" fill="${GC.label}">(20, 40)</text>

  <!-- Point B: VC equilibrium (30, 30) -->
  <circle cx="${bX}" cy="${bY}" r="5" fill="${GC.demand}"/>
  <text x="${bX+10}" y="${bY-8}" font-size="11" font-weight="bold" fill="${GC.demand}">B</text>
  <text x="${bX+10}" y="${bY+8}" font-size="9" fill="${GC.label}">(30, 30)</text>

  <!-- Point A: MO=MK (20, 20) -->
  <circle cx="${aX}" cy="${aY}" r="5" fill="${GC.revenue}"/>
  <text x="${aX-40}" y="${aY+15}" font-size="11" font-weight="bold" fill="${GC.revenue}">A</text>
  <text x="${aX-50}" y="${aY+28}" font-size="9" fill="${GC.label}">(20, 20)</text>

  <!-- Axis labels -->
  <text x="72" y="${pToY(60)+4}" text-anchor="end" font-size="10" fill="${GC.label}">60</text>
  <text x="60" y="${cY+4}" text-anchor="end" font-size="10" fill="${GC.dwl}">P\u2098 = 40</text>
  <text x="60" y="${bY+4}" text-anchor="end" font-size="10" fill="${GC.demand}">P\u1D65\u1D04 = 30</text>
  <text x="60" y="${aY+4}" text-anchor="end" font-size="10" fill="${GC.supply}">MK = 20</text>
  <text x="${cX}" y="${py+ph+15}" text-anchor="middle" font-size="10" fill="${GC.dwl}">Q\u2098 = 20</text>
  <text x="${bX}" y="${py+ph+15}" text-anchor="middle" font-size="10" fill="${GC.demand}">Q\u1D65\u1D04 = 30</text>
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
function drawCard(slide, x, y, w, h, accentColor, bgColor, title, titleColor, bodyParts, extra) {
  slide.addShape("rect", { x, y, w, h, fill: { color: bgColor }, rectRadius: 0.05, shadow: makeShadow() });
  slide.addShape("rect", { x, y, w: 0.06, h, fill: { color: accentColor } });
  slide.addText(title, {
    x: x + 0.2, y: y + 0.15, w: w - 0.35, h: 0.4,
    fontSize: 20, fontFace: "Arial", color: titleColor, bold: true, valign: "top",
  });
  if (bodyParts && bodyParts.length > 0) {
    slide.addText(bodyParts, {
      x: x + 0.2, y: y + 0.6, w: w - 0.35, h: h - 0.75,
      fontSize: 14, fontFace: "Arial", color: C.dark, valign: "top", align: "left",
      lineSpacingMultiple: 1.15, ...(extra || {}),
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
  pres.title = "3.2.6 Economische doelmatigheid";

  addTitleMaster(pres);
  addContentMaster(pres);

  const svgEntries = [
    { name: "vc-surplus", svg: buildVCSurplusSVG() },
    { name: "harberger-driehoek", svg: buildHarbergerSVG() },
  ];
  const [g1Buf, g2Buf] = await Promise.all(
    svgEntries.map(e => svgToPng(e.svg))
  );
  const g1 = pngToBase64(g1Buf);
  const g2 = pngToBase64(g2Buf);

  // ────────────────────────────────────────────────────────────────────
  // DIA 1: Titel
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Economische\ndoelmatigheid", {
      x: 0.7, y: 1.2, w: 8.6, h: 2,
      fontSize: 40, fontFace: "Arial", color: C.white, bold: true,
    });
    s.addText("Surplus, effici\u00ebntie en Pareto", {
      x: 0.7, y: 3.2, w: 8.6, h: 0.5,
      fontSize: 20, fontFace: "Arial", color: C.gray,
    });
    s.addText("Hoofdstuk 2: Marktvormen en hun marktevenwicht  |  Economie VWO", {
      x: 0.7, y: 5.15, w: 8.6, h: 0.475,
      fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle",
    });
    s.addNotes("Welkom bij paragraaf 3.2.6 over economische doelmatigheid. We behandelen surplus (CS, PS, TS), de Harbergerdriehoek, effici\u00ebntie en Pareto.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 2: Wat is surplus?
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Wat is surplus?");
    drawCard(s, 0.3, 1.0, 3.0, 2.0, DOMAIN.color, C.cream, "CS", DOMAIN.color, [
      { text: "Consumentensurplus", options: { fontSize: 14, bold: true, color: C.dark } },
      { text: "\nVerschil tussen wat consumenten willen betalen en wat ze daadwerkelijk betalen", options: { fontSize: 13, color: C.dark } },
    ]);
    drawCard(s, 3.5, 1.0, 3.0, 2.0, C.dGreen, C.cream, "PS", C.dGreen, [
      { text: "Producentensurplus", options: { fontSize: 14, bold: true, color: C.dark } },
      { text: "\nVerschil tussen de ontvangen prijs en de minimale prijs waarvoor men wil produceren", options: { fontSize: 13, color: C.dark } },
    ]);
    drawCard(s, 6.7, 1.0, 3.0, 2.0, C.dAmber, C.cream, "TS", C.dAmber, [
      { text: "Totaal surplus", options: { fontSize: 14, bold: true, color: C.dark } },
      { text: "\nTS = CS + PS\nMaatstaf voor de totale welvaart op een markt", options: { fontSize: 13, color: C.dark } },
    ]);
    s.addText("Hoe groter het totaal surplus, hoe effici\u00ebnter de markt", {
      x: 0.5, y: 3.5, w: 9, h: 0.5,
      fontSize: 16, fontFace: "Arial", color: C.dark, bold: true, align: "center",
    });
    s.addNotes("Drie vormen van surplus. CS is het voordeel voor consumenten, PS voor producenten. Samen vormen ze het TS \u2014 de maatstaf voor totale welvaart.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 3: Surplus bij VC — grafiek + uitleg op één dia
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Surplus bij volkomen concurrentie");

    // Graph on the left (60% of width)
    s.addImage({ data: g1, x: 0.3, y: 0.85, w: 5.8, h: 2.9 });

    // Key formulas on the right
    const rx = 6.3, rw = 3.5;
    s.addShape("rect", { x: rx, y: 0.9, w: rw, h: 2.8, fill: { color: C.lightGray }, rectRadius: 0.05 });
    s.addShape("rect", { x: rx, y: 0.9, w: 0.05, h: 2.8, fill: { color: DOMAIN.color } });
    const formulas = [
      { label: "V:", val: "P = 60 \u2212 Q" },
      { label: "MK:", val: "P = Q" },
      { label: "Evenwicht:", val: "Q* = 30, P* = 30" },
      { label: "", val: "" },
      { label: "CS =", val: "\u00bd \u00d7 30 \u00d7 30 = 450" },
      { label: "PS =", val: "\u00bd \u00d7 30 \u00d7 30 = 450" },
      { label: "TS =", val: "450 + 450 = 900" },
    ];
    formulas.forEach((f, i) => {
      if (!f.label && !f.val) return;
      s.addText([
        { text: f.label + " ", options: { fontSize: 11, fontFace: "Arial", color: C.gray, bold: true } },
        { text: f.val, options: { fontSize: 12, fontFace: "Consolas", color: C.dark } },
      ], { x: rx + 0.15, y: 0.95 + i * 0.35, w: rw - 0.3, h: 0.35, valign: "middle" });
    });

    // Key insight bar at bottom
    s.addShape("rect", { x: 0.3, y: 4.05, w: 9.4, h: 0.5, fill: { color: C.dGreenLt }, rectRadius: 0.05 });
    s.addShape("rect", { x: 0.3, y: 4.05, w: 0.05, h: 0.5, fill: { color: C.dGreen } });
    s.addText("Bij VC is P = MK \u2192 TS is maximaal \u2192 effici\u00ebnt, geen welvaartsverlies", {
      x: 0.55, y: 4.05, w: 9, h: 0.5,
      fontSize: 13, fontFace: "Arial", color: C.dGreen, bold: true, valign: "middle",
    });
    s.addNotes("De blauwe driehoek is het CS (boven P*, onder V). De groene driehoek is het PS (onder P*, boven MK). Samen is het TS = 900. Punt B is het evenwicht waar V = MK. Bij VC geldt P = MK, het TS is maximaal.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 5: Monopolie — wat verandert er?
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Monopolie: wat verandert er?");
    drawCard(s, 0.3, 1.0, 4.5, 3.3, DOMAIN.color, C.cream, "Volkomen concurrentie", DOMAIN.color, [
      { text: "P = MK (= aanbodlijn)\n\n", options: { fontSize: 14, color: C.dark } },
      { text: "Maximaal totaal surplus\n", options: { fontSize: 14, color: C.dark } },
      { text: "CS = driehoek boven P*\n", options: { fontSize: 14, color: C.dark } },
      { text: "PS = driehoek onder P*\n\n", options: { fontSize: 14, color: C.dark } },
      { text: "Effici\u00ebnte uitkomst", options: { fontSize: 14, color: C.dGreen, bold: true } },
    ]);
    drawCard(s, 5.2, 1.0, 4.5, 3.3, C.red, C.cream, "Monopolie", C.red, [
      { text: "MO = MK (winstmaximalisatie)\n\n", options: { fontSize: 14, color: C.dark } },
      { text: "Lagere Q, hogere P\n", options: { fontSize: 14, color: C.dark } },
      { text: "CS daalt (kleiner!)\n", options: { fontSize: 14, color: C.dark } },
      { text: "PS stijgt door hogere prijs\n\n", options: { fontSize: 14, color: C.dark } },
      { text: "TS daalt \u2192 welvaartsverlies", options: { fontSize: 14, color: C.red, bold: true } },
    ]);
    s.addNotes("Bij VC is P = MK en het TS maximaal. Bij monopolie kiest de monopolist MO = MK, wat leidt tot een lagere Q en hogere P. Het CS daalt meer dan het PS stijgt \u2014 er is netto welvaartsverlies.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 6: Harbergerdriehoek — grafiek + uitleg op één dia
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "De Harbergerdriehoek");

    // Graph on the left (60% of width)
    s.addImage({ data: g2, x: 0.3, y: 0.85, w: 5.8, h: 2.9 });

    // Key points on the right
    const rx = 6.3, rw = 3.5;
    s.addShape("rect", { x: rx, y: 0.9, w: rw, h: 2.8, fill: { color: C.lightGray }, rectRadius: 0.05 });
    s.addShape("rect", { x: rx, y: 0.9, w: 0.05, h: 2.8, fill: { color: C.red } });

    const points = [
      [{ text: "MO = MK:", bold: true, color: C.gray }, { text: " Q\u2098 = 20" }],
      [{ text: "P\u2098:", bold: true, color: C.gray }, { text: " 60 \u2212 20 = 40 (van V)" }],
      [{ text: "MK\u2098:", bold: true, color: C.gray }, { text: " 20" }],
      [],
      [{ text: "C", bold: true, color: C.red }, { text: " (20, 40) monopolieprijs" }],
      [{ text: "B", bold: true, color: DOMAIN.color }, { text: " (30, 30) VC-evenwicht" }],
      [{ text: "A", bold: true, color: C.purple }, { text: " (20, 20) MO = MK" }],
      [],
      [{ text: "DWL = ", bold: true, color: C.red }, { text: "\u00bd \u00d7 10 \u00d7 20 = ", fontFace: "Consolas" }, { text: "100", bold: true, color: C.red, fontFace: "Consolas" }],
    ];
    points.forEach((parts, i) => {
      if (parts.length === 0) return;
      s.addText(
        parts.map(p => ({ text: p.text, options: { fontSize: 11, fontFace: p.fontFace || "Arial", color: p.color || C.dark, bold: p.bold || false } })),
        { x: rx + 0.15, y: 0.95 + i * 0.28, w: rw - 0.3, h: 0.28, valign: "middle" }
      );
    });

    // Explanation bar at bottom
    s.addShape("rect", { x: 0.3, y: 4.05, w: 9.4, h: 0.5, fill: { color: C.lightRed }, rectRadius: 0.05 });
    s.addShape("rect", { x: 0.3, y: 4.05, w: 0.05, h: 0.5, fill: { color: C.red } });
    s.addText([
      { text: "De driehoek C-B-A is surplus dat verdwijnt", options: { fontSize: 12, bold: true, color: C.red } },
      { text: " \u2014 niemand krijgt het. Het blauwe vlak is herverdeling (CS \u2192 PS), g\u00e9\u00e9n verlies.", options: { fontSize: 11, color: C.dark } },
    ], { x: 0.55, y: 4.05, w: 9, h: 0.5, valign: "middle" });
    s.addNotes("Punt B (30,30) is het VC-evenwicht. Punt A (20,20) is waar MO = MK. Punt C (20,40) is de monopolieprijs op de vraaglijn. De rode driehoek C-B-A is het welvaartsverlies = \u00bd \u00d7 10 \u00d7 20 = 100. Het lichtblauwe vlak is CS dat PS wordt \u2014 dat is geen verlies, alleen herverdeling. De driehoek is wat \u00e9cht weg is.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 8: Waarom daalt het TS?
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Waarom daalt het totaal surplus?");

    // Flow diagram
    const steps = [
      { text: "Monopolist kiest MO = MK", bg: C.cream },
      { text: "Lagere Q, hogere P", bg: C.cream },
      { text: "CS daalt, PS stijgt", bg: C.cream },
      { text: "TS daalt \u2192 welvaartsverlies", bg: C.red },
    ];
    const boxW = 4, boxH = 0.5, boxX = 0.5, startY = 1.15, gap = 0.2;
    steps.forEach((step, i) => {
      const y = startY + i * (boxH + gap);
      const isLast = i === steps.length - 1;
      s.addShape("rect", {
        x: boxX, y, w: boxW, h: boxH,
        fill: { color: step.bg }, rectRadius: 0.05, shadow: makeShadow(),
      });
      s.addText(step.text, {
        x: boxX + 0.2, y, w: boxW - 0.4, h: boxH,
        fontSize: 14, fontFace: "Arial", color: isLast ? C.white : C.dark, bold: isLast, valign: "middle",
      });
      if (i < steps.length - 1) {
        s.addText("\u2193", {
          x: boxX, y: y + boxH, w: boxW, h: gap,
          fontSize: 14, fontFace: "Arial", color: DOMAIN.color, align: "center", valign: "middle", bold: true,
        });
      }
    });

    // Calculation box
    drawCard(s, 5.2, 1.0, 4.5, 3.4, C.dAmber, C.cream, "Rekenvoorbeeld", C.dAmber, [
      { text: "Volkomen concurrentie:\n", options: { fontSize: 13, bold: true, color: C.dark } },
      { text: "CS = 450 + PS = 450 = TS = 900\n\n", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
      { text: "Monopolie:\n", options: { fontSize: 13, bold: true, color: C.dark } },
      { text: "CS = 200 + PS = 600 = TS = 800\n\n", options: { fontSize: 13, fontFace: "Consolas", color: C.dark } },
      { text: "Harbergerdriehoek:\n", options: { fontSize: 13, bold: true, color: C.red } },
      { text: "900 \u2212 800 = 100", options: { fontSize: 15, fontFace: "Consolas", color: C.red, bold: true } },
    ]);

    s.addText("De daling van het CS is groter dan de stijging van het PS \u2192 netto welvaartsverlies", {
      x: 0.5, y: 4.7, w: 9, h: 0.35,
      fontSize: 13, fontFace: "Arial", color: C.gray, italic: true,
    });
    s.addNotes("Het verschil: CS daalt van 450 naar 200 (\u2212250), PS stijgt van 450 naar 600 (+150). Netto: \u2212100. Die 100 is de Harbergerdriehoek \u2014 surplus dat niemand krijgt.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 9: Wanneer is een markt effici\u00ebnt?
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Wanneer is een markt effici\u00ebnt?");
    drawCard(s, 0.3, 1.0, 4.5, 2.6, C.dGreen, C.cream, "\u2713 Effici\u00ebnt", C.dGreen, [
      { text: "TS is maximaal\n", options: { fontSize: 14, color: C.dark } },
      { text: "P = MK\n", options: { fontSize: 14, color: C.dark } },
      { text: "Geen welvaartsverlies\n\n", options: { fontSize: 14, color: C.dark } },
      { text: "Volkomen concurrentie", options: { fontSize: 14, color: C.dGreen, bold: true } },
    ]);
    drawCard(s, 5.2, 1.0, 4.5, 2.6, C.red, C.cream, "\u2717 Ineffici\u00ebnt", C.red, [
      { text: "TS is niet maximaal\n", options: { fontSize: 14, color: C.dark } },
      { text: "P > MK (monopolist)\n", options: { fontSize: 14, color: C.dark } },
      { text: "Harbergerdriehoek > 0\n\n", options: { fontSize: 14, color: C.dark } },
      { text: "Monopolie / oligopolie", options: { fontSize: 14, color: C.red, bold: true } },
    ]);
    s.addText("Toets: vergelijk het TS met dat bij volkomen concurrentie", {
      x: 0.5, y: 4.0, w: 9, h: 0.5,
      fontSize: 15, fontFace: "Arial", color: C.dark, bold: true, align: "center",
    });
    s.addNotes("Een markt is effici\u00ebnt als het TS maximaal is (P = MK). Bij monopolie geldt P > MK, waardoor er een Harbergerdriehoek ontstaat.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 10: Toetredingsdrempels
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Rol van toetredingsdrempels");
    const steps = [
      { text: "Hoge toetredingsdrempels", bg: C.cream },
      { text: "Weinig of geen nieuwe aanbieders", bg: C.cream },
      { text: "Monopolist/oligopolist behoudt marktmacht", bg: C.cream },
      { text: "P > MK blijft bestaan", bg: C.cream },
      { text: "Effici\u00ebntieverlies blijft \u2192 Harbergerdriehoek", bg: C.red },
    ];
    const boxW = 7, boxH = 0.5, boxX = 1.5, startY = 1.1, gap = 0.18;
    steps.forEach((step, i) => {
      const y = startY + i * (boxH + gap);
      const isLast = i === steps.length - 1;
      s.addShape("rect", {
        x: boxX, y, w: boxW, h: boxH,
        fill: { color: step.bg }, rectRadius: 0.05, shadow: makeShadow(),
      });
      s.addText(step.text, {
        x: boxX + 0.3, y, w: boxW - 0.6, h: boxH,
        fontSize: 15, fontFace: "Arial", color: isLast ? C.white : C.dark, bold: isLast, valign: "middle",
      });
      if (i < steps.length - 1) {
        s.addText("\u2193", {
          x: boxX, y: y + boxH, w: boxW, h: gap,
          fontSize: 14, fontFace: "Arial", color: DOMAIN.color, align: "center", valign: "middle", bold: true,
        });
      }
    });
    s.addText("Voorbeeld: elektriciteitsmarkt \u2014 hoge kosten om toe te treden, P 25% boven GTK", {
      x: 0.7, y: 4.7, w: 8.6, h: 0.35,
      fontSize: 13, fontFace: "Arial", color: C.gray, italic: true,
    });
    s.addNotes("Hoge toetredingsdrempels houden de ineffici\u00ebntie in stand. Zolang er geen concurrenten toetreden, kan de monopolist P > MK blijven vragen.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 11: Pareto-effici\u00ebntie
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Pareto-effici\u00ebntie");
    drawCard(s, 0.3, 1.0, 4.5, 2.0, DOMAIN.color, C.cream, "Pareto-effici\u00ebnt", DOMAIN.color, [
      { text: "Een situatie is Pareto-effici\u00ebnt als het niet mogelijk is om iemand erop vooruit te laten gaan zonder dat iemand anders erop achteruitgaat.", options: { fontSize: 13, color: C.dark } },
    ]);
    drawCard(s, 5.2, 1.0, 4.5, 2.0, C.dGreen, C.cream, "Pareto-verbetering", C.dGreen, [
      { text: "Een verandering waarbij minstens \u00e9\u00e9n persoon erop vooruitgaat en niemand erop achteruitgaat.", options: { fontSize: 13, color: C.dark } },
    ]);
    s.addText("Als er g\u00e9\u00e9n Pareto-verbetering meer mogelijk is \u2192 de situatie is Pareto-effici\u00ebnt", {
      x: 0.5, y: 3.4, w: 9, h: 0.5,
      fontSize: 15, fontFace: "Arial", color: C.dark, bold: true, align: "center",
    });

    // Example box
    drawCard(s, 1.5, 4.0, 7, 1.2, C.dAmber, C.cream, "Voorbeeld: stoelruil", C.dAmber, [
      { text: "Esther zit vooraan, Mieke achteraan. Mieke wil graag vooraan, Esther maakt het niet uit. Ze wisselen: Mieke blij, Esther niet slechter af \u2192 Pareto-verbetering!", options: { fontSize: 12, color: C.dark } },
    ]);
    s.addNotes("Pareto-effici\u00ebntie kijkt niet naar totaal surplus maar naar individuele voor- en nadelen. Een Pareto-verbetering is als iemand erop vooruitgaat en niemand erop achteruitgaat. Pas als er geen verbetering meer mogelijk is, is de situatie Pareto-effici\u00ebnt.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 12: Valkuilen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Valkuilen");
    const traps = [
      {
        myth: "\u201eMeer PS bij monopolie = beter voor de markt\u201d",
        truth: "Onjuist: PS stijgt, maar CS daalt meer. Het totaal surplus (TS) daalt altijd bij monopolie.",
      },
      {
        myth: "\u201ePareto-effici\u00ebnt = eerlijk\u201d",
        truth: "Onjuist: Pareto zegt niets over verdeling. Een situatie kan Pareto-effici\u00ebnt zijn terwijl \u00e9\u00e9n persoon alles heeft.",
      },
      {
        myth: "\u201eHarbergerdriehoek = het hele welvaartsverlies\u201d",
        truth: "De Harbergerdriehoek meet het allocatieve verlies. Er kan ook dynamisch verlies zijn (minder innovatie).",
      },
    ];
    traps.forEach((trap, i) => {
      const y = 1.0 + i * 1.4;
      s.addShape("rect", { x: 0.5, y, w: 9, h: 1.2, fill: { color: C.lightRed }, rectRadius: 0.05 });
      s.addShape("rect", { x: 0.5, y, w: 0.06, h: 1.2, fill: { color: C.red } });
      s.addText(trap.myth, {
        x: 0.75, y: y + 0.05, w: 8.5, h: 0.45,
        fontSize: 14, fontFace: "Arial", color: C.red, bold: true,
      });
      s.addText(trap.truth, {
        x: 0.75, y: y + 0.5, w: 8.5, h: 0.6,
        fontSize: 13, fontFace: "Arial", color: C.dark,
      });
    });
    s.addNotes("Drie veelgemaakte fouten. Let op: de Harbergerdriehoek meet alleen het allocatieve verlies \u2014 er is ook de herverdeling van CS naar PS (geen verlies, wel verschuiving) en eventueel dynamisch verlies door minder innovatie.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 13: Samenvatting
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
      "Totaal surplus (TS) = CS + PS \u2192 maatstaf voor effici\u00ebntie",
      "Bij volkomen concurrentie is TS maximaal (P = MK)",
      "Monopolie: lagere Q, hogere P \u2192 Harbergerdriehoek = welvaartsverlies",
      "Harbergerdriehoek = \u00bd \u00d7 \u0394Q \u00d7 (P\u2098 \u2212 MK\u2098) \u2014 surplus dat niemand krijgt",
      "Hoge toetredingsdrempels houden ineffici\u00ebntie in stand",
      "Pareto-effici\u00ebnt: niemand erop vooruit zonder dat iemand erop achteruitgaat",
    ];
    s.addText(
      bullets.map(b => ({ text: b, options: { fontSize: 15, fontFace: "Arial", color: C.white, bullet: true, breakType: "none" } })),
      { x: 0.7, y: 1.7, w: 8.6, h: 3.2, valign: "top", lineSpacingMultiple: 1.6, paraSpaceAfter: 6 }
    );
    s.addNotes("Zes kernpunten. De Harbergerdriehoek-formule is nieuw: \u00bd \u00d7 \u0394Q \u00d7 (P_m \u2212 MK_m). Benadruk dat het surplus dat verdwijnt nergens heen gaat \u2014 het is gewoon weg.");
  }

  // ── Save ──────────────────────────────────────────────────────────────
  const MODULE_ROOT = process.env.MODULE_ROOT ? path.resolve(process.env.MODULE_ROOT) : path.resolve(__dirname, "..");
  const outDir = path.resolve(MODULE_ROOT, "3.2 Hoofdstuk 2 - Marktvormen en hun marktevenwicht/3.2.6 Paragraaf 6 - Marktvormen en hun economische doelmatigheid/2. Leren");
  const outFile = path.join(outDir, "3.2.6 Marktvormen en hun economische doelmatigheid \u2013 presentatie.pptx");

  await pres.writeFile({ fileName: outFile });
  console.log("Saved:", outFile);
  saveSvgFiles(svgEntries, outDir);
  const stats = fs.statSync(outFile);
  console.log("Size:", (stats.size / 1024).toFixed(1), "KB");
  console.log("Slides:", pres.slides.length);
}

build().catch(err => { console.error("ERROR:", err); process.exit(1); });
