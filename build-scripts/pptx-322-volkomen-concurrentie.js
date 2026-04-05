/**
 * PPTX Build: 3.2.2 Volkomen concurrentie – presentatie met grafieken
 *
 * 14 dia's: 11 origineel + 3 grafiekdia's (kostencurves+winst, CS/PS, nulwinst)
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/pptx-322-volkomen-concurrentie.js
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
  dBlue: "1A5276", dBlueLt: "EBF5FB", dBlueDk: "154360",
  dAmber: "E67E22", dAmberLt: "FEF5E7", dAmberDk: "BA6A1C",
  dGreen: "1E8449", dGreenLt: "E8F8F0", dGreenDk: "186A3B",
  navy: "1E2761", white: "FFFFFF", dark: "2D3748", gray: "718096",
  lightGray: "F7F8FA", borderGray: "CBD5E0", red: "D9534F", lightRed: "FDE8E8",
  cream: "F9F6F1", rowAlt: "F7FAFC",
  purple: "7B2D8E",
};
const DOMAIN = { color: C.dBlue, light: C.dBlueLt, dark: C.dBlueDk };

const GC = {
  demand: "#1A5276", supply: "#1E8449", cost: "#E67E22", costAvg: "#D9534F",
  price: "#1A5276", revenue: "#7B2D8E", axis: "#2D3748", grid: "#CBD5E0",
  label: "#718096", title: "#1E2761", bg: "#F7FAFC",
  surplus: "#85C1E9", prodSurplus: "#82E0AA",
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
// GRAPH 4: COST CURVES + PROFIT RECTANGLE (short-term)
// MK = q + 10, GTK = 0.5q + 10 + 128/q, P=30, q*=20, GTK(20)=26.4
// ═══════════════════════════════════════════════════════════════════════════
function buildCostCurvesProfitSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 45, pMax = 55;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  // MK = q + 10 (linear, rising)
  const mk = q => q + 10;
  // GTK = 0.5q + 10 + 128/q (U-shaped, min at q=16)
  const gtk = q => 0.5 * q + 10 + 128 / q;
  // P = 30 (horizontal price line)
  const pStar = 30;
  const qStar = 20; // where P = MK: 30 = q + 10 → q = 20
  const gtkStar = gtk(qStar); // 10 + 10 + 6.4 = 26.4

  // GTK curve as polyline (smooth U-shape)
  const gtkPoints = [];
  for (let q = 4; q <= 42; q += 1) {
    const p = gtk(q);
    if (p <= pMax) gtkPoints.push(`${qToX(q)},${pToY(p)}`);
  }

  // MK line endpoints
  const mk1x = qToX(0), mk1y = pToY(mk(0));   // q=0, MK=10
  const mk2x = qToX(42), mk2y = pToY(mk(42));  // q=42, MK=52

  // Price line
  const pLineY = pToY(pStar);

  // Profit rectangle: from q=0 to q*=20, between P=30 and GTK(20)=26.4
  const profitTop = pToY(pStar);       // y for P=30
  const profitBot = pToY(gtkStar);     // y for GTK=26.4
  const profitLeft = qToX(0);          // q=0 → actually start at Y-axis
  const profitRight = qToX(qStar);     // q*=20

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Winst bij volkomen concurrentie (korte termijn)</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs / Kosten</text>
  <text x="380" y="350" text-anchor="middle" font-size="12" fill="${GC.label}">Hoeveelheid (q)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Profit rectangle (draw first, behind curves) -->
  <rect x="${px}" y="${profitTop}" width="${profitRight - px}" height="${profitBot - profitTop}" fill="${GC.prodSurplus}" fill-opacity="0.45"/>
  <text x="${(px + profitRight) / 2}" y="${(profitTop + profitBot) / 2 + 4}" text-anchor="middle" font-size="11" fill="#186A3B" font-weight="bold">Winst = 72</text>

  <!-- Price line (P = MO = GO) -->
  <line x1="${px}" y1="${pLineY}" x2="${qToX(42)}" y2="${pLineY}" stroke="${GC.price}" stroke-width="2"/>
  <text x="${qToX(42) + 5}" y="${pLineY + 4}" font-size="10" font-weight="bold" fill="${GC.price}">P = MO</text>

  <!-- MK curve -->
  <line x1="${mk1x}" y1="${mk1y}" x2="${mk2x}" y2="${mk2y}" stroke="${GC.cost}" stroke-width="2.5"/>
  <text x="${mk2x + 5}" y="${mk2y + 4}" font-size="11" font-weight="bold" fill="${GC.cost}">MK</text>

  <!-- GTK curve (polyline, U-shaped) -->
  <polyline points="${gtkPoints.join(" ")}" fill="none" stroke="${GC.costAvg}" stroke-width="2.5"/>
  <text x="${qToX(42) + 5}" y="${pToY(gtk(42)) + 4}" font-size="11" font-weight="bold" fill="${GC.costAvg}">GTK</text>

  <!-- q* dashed line -->
  <line x1="${qToX(qStar)}" y1="${pLineY}" x2="${qToX(qStar)}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <circle cx="${qToX(qStar)}" cy="${pLineY}" r="4" fill="${GC.price}"/>

  <!-- GTK at q* dashed line -->
  <line x1="${px}" y1="${profitBot}" x2="${qToX(qStar)}" y2="${profitBot}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,2"/>

  <!-- Axis labels -->
  <text x="72" y="${pLineY + 4}" text-anchor="end" font-size="10" fill="${GC.axis}">30</text>
  <text x="72" y="${profitBot + 4}" text-anchor="end" font-size="10" fill="${GC.axis}">26,4</text>
  <text x="${qToX(qStar)}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">q* = 20</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 5: CS AND PS SURPLUS TRIANGLES
// V: Qv = -10p + 500 → p = -0.1Q + 50 (p_max=50)
// A: Qa = 10p - 100 → p = 0.1Q + 10 (p_min=10)
// Eq: p*=30, Q*=200, CS=2000, PS=2000
// ═══════════════════════════════════════════════════════════════════════════
function buildSurplusSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 250, pMax = 55;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  // V: p = -0.1Q + 50 → from (0,50) to (250,25) ... extends to Q=500 at p=0
  // But we clip at plot area. V at Q=250: p=25. Let me extend to Q where p=0: Q=500. Clip at right edge.
  const v1x = qToX(0), v1y = pToY(50);
  // At Q=250 (edge): p = -0.1*250+50 = 25. Not quite to zero. Let me extend to the bottom edge:
  // p=0 → Q=500, but that's beyond qMax=250. So V goes from (0,50) to edge of plot where it intersects.
  // At the right edge (Q=250): p=25. So V goes from (80, pToY(50)) to (680, pToY(25))
  // Actually, for the surplus triangles to be visible, I need V to reach the Y-axis at p=50
  // and A to reach the Y-axis at p=10. Both already do since they start at Q=0.

  // Let me use a better range. The equilibrium is at Q=200, so let me show Q up to 250.
  const v2x = qToX(250), v2y = pToY(25); // V at Q=250: p=25

  // Actually, for a clean graph I should show V going further down. Let me extend to the X-axis intersection.
  // But Q=500 is way beyond qMax=250. Let me just clip at right edge.

  // A: p = 0.1Q + 10 → from (0,10) to some endpoint
  const a1x = qToX(0), a1y = pToY(10);
  // A at Q=250: p = 0.1*250+10 = 35
  // A at Q where p=55: Q=(55-10)/0.1=450, beyond edge. At Q=250: p=35.
  const a2x = qToX(250), a2y = pToY(35);

  // Equilibrium: p*=30, Q*=200
  const eqx = qToX(200), eqy = pToY(30);

  // CS triangle: vertices (Q=0,p=50), (Q=0,p=30), (Q=200,p=30) → but in pixel coords
  // Actually: triangle is bounded by V from above, p* from below, from Q=0 to Q*=200
  // Vertices: (Y-axis at p=50), (Y-axis at p=30), (Q*=200 at p=30)
  const csPoints = `${qToX(0)},${pToY(50)} ${qToX(200)},${pToY(30)} ${qToX(0)},${pToY(30)}`;

  // PS triangle: vertices (Q=0,p=10), (Q=0,p=30), (Q=200,p=30)
  const psPoints = `${qToX(0)},${pToY(10)} ${qToX(200)},${pToY(30)} ${qToX(0)},${pToY(30)}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Consumenten- en producentensurplus</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Surplus areas (behind curves) -->
  <polygon points="${csPoints}" fill="${GC.surplus}" fill-opacity="0.45"/>
  <polygon points="${psPoints}" fill="${GC.prodSurplus}" fill-opacity="0.45"/>

  <!-- CS label -->
  <text x="${qToX(55)}" y="${pToY(38)}" font-size="12" font-weight="bold" fill="#1A5276">CS = 2.000</text>
  <!-- PS label -->
  <text x="${qToX(55)}" y="${pToY(22)}" font-size="12" font-weight="bold" fill="#186A3B">PS = 2.000</text>

  <!-- Dashed reference lines -->
  <line x1="${px}" y1="${eqy}" x2="${eqx}" y2="${eqy}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <line x1="${eqx}" y1="${eqy}" x2="${eqx}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>

  <!-- Demand curve (V) -->
  <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v2x - 15}" y="${v2y - 8}" font-size="12" font-weight="bold" fill="${GC.demand}">V</text>

  <!-- Supply curve (A) -->
  <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${GC.supply}" stroke-width="2.5"/>
  <text x="${a2x - 15}" y="${a2y - 8}" font-size="12" font-weight="bold" fill="${GC.supply}">A</text>

  <!-- Equilibrium dot -->
  <circle cx="${eqx}" cy="${eqy}" r="5" fill="${GC.demand}"/>

  <!-- Axis labels -->
  <text x="72" y="${pToY(50) + 4}" text-anchor="end" font-size="10" fill="${GC.label}">50</text>
  <text x="72" y="${eqy + 4}" text-anchor="end" font-size="10" fill="${GC.axis}">p* = 30</text>
  <text x="72" y="${pToY(10) + 4}" text-anchor="end" font-size="10" fill="${GC.label}">10</text>
  <text x="${eqx}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">Q* = 200</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 6: LONG-TERM ZERO-PROFIT EQUILIBRIUM
// Same MK and GTK as Graph 4, but P = 26 (GTK minimum)
// MK = q + 10, GTK min at q=16 → GTK(16) = 8+10+8 = 26
// At q=16: MK = 26. So P = MK = GTK = 26.
// ═══════════════════════════════════════════════════════════════════════════
function buildZeroProfitSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 45, pMax = 50;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  const mk = q => q + 10;
  const gtk = q => 0.5 * q + 10 + 128 / q;
  const pStar = 26;
  const qStar = 16;

  // GTK polyline
  const gtkPoints = [];
  for (let q = 4; q <= 42; q += 1) {
    const p = gtk(q);
    if (p <= pMax) gtkPoints.push(`${qToX(q)},${pToY(p)}`);
  }

  const mk1x = qToX(0), mk1y = pToY(10);
  const mk2x = qToX(38), mk2y = pToY(48);
  const pLineY = pToY(pStar);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Lange termijn evenwicht: MK = GTK(min)</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs / Kosten</text>
  <text x="380" y="350" text-anchor="middle" font-size="12" fill="${GC.label}">Hoeveelheid (q)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Price line (P = MO) at p=26 -->
  <line x1="${px}" y1="${pLineY}" x2="${qToX(40)}" y2="${pLineY}" stroke="${GC.price}" stroke-width="2"/>
  <text x="${qToX(40) + 5}" y="${pLineY + 4}" font-size="10" font-weight="bold" fill="${GC.price}">P = MO</text>

  <!-- MK curve -->
  <line x1="${mk1x}" y1="${mk1y}" x2="${mk2x}" y2="${mk2y}" stroke="${GC.cost}" stroke-width="2.5"/>
  <text x="${mk2x + 5}" y="${mk2y + 4}" font-size="11" font-weight="bold" fill="${GC.cost}">MK</text>

  <!-- GTK curve (U-shaped) -->
  <polyline points="${gtkPoints.join(" ")}" fill="none" stroke="${GC.costAvg}" stroke-width="2.5"/>
  <text x="${qToX(42) + 5}" y="${pToY(gtk(42)) + 4}" font-size="11" font-weight="bold" fill="${GC.costAvg}">GTK</text>

  <!-- Triple intersection point (P = MK = GTK at q=16) -->
  <line x1="${qToX(qStar)}" y1="${pLineY}" x2="${qToX(qStar)}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <circle cx="${qToX(qStar)}" cy="${pLineY}" r="5" fill="${GC.price}"/>

  <!-- "Winst = 0" annotation -->
  <text x="${qToX(qStar) + 15}" y="${pLineY - 10}" font-size="12" font-weight="bold" fill="${GC.axis}">Winst = 0</text>

  <!-- Axis labels -->
  <text x="72" y="${pLineY + 4}" text-anchor="end" font-size="10" fill="${GC.axis}">p* = 26</text>
  <text x="${qToX(qStar)}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">q* = 16</text>
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
  pres.title = "3.2.2 Volkomen concurrentie";

  addTitleMaster(pres);
  addContentMaster(pres);

  const [g4Buf, g5Buf, g6Buf] = await Promise.all([
    svgToPng(buildCostCurvesProfitSVG()),
    svgToPng(buildSurplusSVG()),
    svgToPng(buildZeroProfitSVG()),
  ]);
  const g4 = pngToBase64(g4Buf);
  const g5 = pngToBase64(g5Buf);
  const g6 = pngToBase64(g6Buf);

  // ────────────────────────────────────────────────────────────────────
  // DIA 1: Titel
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Volkomen concurrentie", {
      x: 0.7, y: 1.2, w: 8.6, h: 2,
      fontSize: 40, fontFace: "Arial", color: C.white, bold: true,
    });
    s.addText("Paragraaf 3.2.2", {
      x: 0.7, y: 3.2, w: 8.6, h: 0.5,
      fontSize: 20, fontFace: "Arial", color: C.gray,
    });
    s.addText("Hoofdstuk 2: Marktvormen en hun marktevenwicht  |  Economie VWO", {
      x: 0.7, y: 5.15, w: 8.6, h: 0.475,
      fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle",
    });
    s.addNotes("Welkom bij paragraaf 3.2.2 over volkomen concurrentie. We behandelen alle kenmerken, de afleiding van kosten naar aanbod, het marktevenwicht, winst, surplus en de lange termijn.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 2: Leerdoelen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Wat ga je leren?");
    const bullets = [
      "De kenmerken van volkomen concurrentie herkennen",
      "Van kostenfunctie naar (collectieve) aanbodfunctie afleiden",
      "Het marktevenwicht berekenen (Qv = Qa)",
      "De winst van een individuele aanbieder berekenen",
      "CS en PS berekenen en in een grafiek herkennen",
      "De lange termijn voorspellen: MK = GTK",
    ];
    s.addText(
      bullets.map(b => ({ text: b, options: { fontSize: 15, fontFace: "Arial", color: C.dark, bullet: true, breakType: "none" } })),
      { x: 0.7, y: 1.2, w: 8.6, h: 3.8, valign: "top", lineSpacingMultiple: 1.4, paraSpaceAfter: 6 }
    );
    s.addNotes("Zes leerdoelen voor deze paragraaf. Van kenmerken herkennen tot de lange termijn voorspellen. We bouwen het stap voor stap op.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 3: Kenmerken volkomen concurrentie (4 kaarten)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Kenmerken volkomen concurrentie");
    const cardW = 4.3, cardH = 1.5;
    const cards = [
      { x: 0.5, y: 1.1, title: "Veel aanbieders", body: "Geen enkele aanbieder heeft marktmacht", accent: DOMAIN.color },
      { x: 5.2, y: 1.1, title: "Homogeen product", body: "Producten zijn identiek en uitwisselbaar", accent: DOMAIN.color },
      { x: 0.5, y: 2.85, title: "Vrije toe-/uittreding", body: "Bedrijven kunnen vrij de markt betreden of verlaten", accent: C.dGreen },
      { x: 5.2, y: 2.85, title: "Prijsnemer", body: "De aanbieder accepteert de marktprijs: MO = p", accent: C.dAmber },
    ];
    cards.forEach(c => {
      drawCard(s, c.x, c.y, cardW, cardH, c.accent, C.cream, c.title, c.accent, [
        { text: c.body, options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      ]);
    });
    s.addNotes("De vier kenmerken van volkomen concurrentie. Veel aanbieders, homogeen product, vrije toetreding en het bedrijf is een prijsnemer. Het laatste punt (MO = p) is cruciaal voor de berekeningen.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 4: Van kosten naar aanbod (stroomdiagram)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Van kosten naar aanbod");
    const steps = [
      { label: "Gegeven", text: "TK = 0,5q\u00b2 + 10q + 128", bg: C.lightGray },
      { label: "Stap 1: Afleiden", text: "MK = TK\u2032 = q + 10", bg: C.dBlueLt },
      { label: "Stap 2: Prijsnemer", text: "MO = p = MK", bg: C.dBlueLt },
      { label: "Stap 3: Aanbodfunctie", text: "p = q + 10", bg: DOMAIN.color },
    ];
    const boxW = 7, boxH = 0.65, boxX = 1.5, startY = 1.1, gap = 0.2;
    steps.forEach((step, i) => {
      const y = startY + i * (boxH + gap);
      const isLast = i === steps.length - 1;
      s.addShape("rect", {
        x: boxX, y, w: boxW, h: boxH,
        fill: { color: step.bg }, rectRadius: 0.05, shadow: makeShadow(),
      });
      s.addText([
        { text: step.label + ":  ", options: { fontSize: 14, fontFace: "Arial", color: isLast ? C.white : C.gray, bold: true } },
        { text: step.text, options: { fontSize: 16, fontFace: "Consolas", color: isLast ? C.white : C.dark, bold: isLast } },
      ], {
        x: boxX + 0.2, y, w: boxW - 0.4, h: boxH, valign: "middle",
      });
      if (i < steps.length - 1) {
        s.addText("\u2193", {
          x: boxX, y: y + boxH, w: boxW, h: gap,
          fontSize: 16, fontFace: "Arial", color: DOMAIN.color, align: "center", valign: "middle", bold: true,
        });
      }
    });
    s.addText("Bij volkomen concurrentie is de MK-lijn de aanbodfunctie.", {
      x: 0.7, y: 4.6, w: 8.6, h: 0.35,
      fontSize: 14, fontFace: "Arial", color: C.dark, bold: true, italic: true,
    });
    s.addNotes("We leiden de aanbodfunctie af uit de kostenfunctie. Stap 1: differentieer TK naar q om MK te krijgen. Stap 2: bij volkomen concurrentie is MO = p. Stap 3: stel MO = MK, dus p = MK. Dit geeft de aanbodfunctie.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 5: Individueel → collectief aanbod
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Individueel \u2192 collectief aanbod");
    const steps = [
      { text: "Individueel:  p = q + 10   \u2192   Draai om: q = p \u2212 10", bg: C.lightGray },
      { text: "Vermenigvuldig met n = 10 aanbieders", bg: C.dBlueLt },
      { text: "Collectief:  Qa = 10(p \u2212 10) = 10p \u2212 100", bg: DOMAIN.color },
    ];
    const boxW = 7.5, boxH = 0.7, boxX = 1.25, startY = 1.3, gap = 0.3;
    steps.forEach((step, i) => {
      const y = startY + i * (boxH + gap);
      const isLast = i === steps.length - 1;
      s.addShape("rect", {
        x: boxX, y, w: boxW, h: boxH,
        fill: { color: step.bg }, rectRadius: 0.05, shadow: makeShadow(),
      });
      s.addText(step.text, {
        x: boxX + 0.3, y, w: boxW - 0.6, h: boxH,
        fontSize: 16, fontFace: "Consolas", color: isLast ? C.white : C.dark, bold: isLast, valign: "middle",
      });
      if (i < steps.length - 1) {
        s.addText("\u2193", {
          x: boxX, y: y + boxH, w: boxW, h: gap,
          fontSize: 18, fontFace: "Arial", color: DOMAIN.color, align: "center", valign: "middle", bold: true,
        });
      }
    });
    s.addNotes("Van individueel naar collectief aanbod. Draai de individuele aanbodfunctie om zodat q links staat. Vermenigvuldig met het aantal aanbieders. Dit geeft de collectieve aanbodfunctie.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 6: Evenwicht berekenen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Evenwicht berekenen");
    const steps = [
      { label: "Stel", formula: "Qv = Qa  (vraag = aanbod)" },
      { label: "Invullen", formula: "\u221210p + 500 = 10p \u2212 100" },
      { label: "Oplossen", formula: "20p = 600" },
      { label: "Prijs", formula: "p* = \u20ac30" },
      { label: "Hoeveelheid", formula: "Q* = 10 \u00d7 30 \u2212 100 = 200" },
    ];
    const boxW = 8, boxX = 1, startY = 1.05, lineH = 0.55;
    // Formula box background
    s.addShape("rect", {
      x: boxX, y: startY, w: boxW, h: steps.length * lineH + 0.2,
      fill: { color: C.lightGray }, line: { color: C.borderGray, width: 0.5 },
    });
    s.addShape("rect", {
      x: boxX, y: startY, w: 0.06, h: steps.length * lineH + 0.2,
      fill: { color: DOMAIN.color },
    });
    steps.forEach((step, i) => {
      const y = startY + 0.1 + i * lineH;
      s.addText([
        { text: step.label + ":  ", options: { fontSize: 14, fontFace: "Arial", color: C.gray, bold: true } },
        { text: step.formula, options: { fontSize: 16, fontFace: "Consolas", color: C.dark } },
      ], {
        x: boxX + 0.25, y, w: boxW - 0.5, h: lineH, valign: "middle",
      });
    });
    s.addNotes("Het evenwicht berekenen: stel Qv gelijk aan Qa en los op. De evenwichtsprijs is 30 euro, de evenwichtshoeveelheid is 200 stuks.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 7: Winst individuele aanbieder
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Winst individuele aanbieder");
    // Left: formula box
    const formulas = [
      "q = p \u2212 10 = 30 \u2212 10 = 20",
      "TO = p \u00d7 q = 30 \u00d7 20 = \u20ac600",
      "TK = 0,5(20)\u00b2 + 10(20) + 128 = \u20ac528",
      "W = TO \u2212 TK = 600 \u2212 528 = \u20ac72",
    ];
    drawCard(s, 0.5, 1.1, 4.6, 3.2, DOMAIN.color, C.lightGray, "Formule", DOMAIN.color, []);
    formulas.forEach((f, i) => {
      s.addText(f, {
        x: 0.9, y: 1.7 + i * 0.55, w: 4.0, h: 0.5,
        fontSize: 14, fontFace: "Consolas", color: C.dark,
      });
    });
    // Right: steps
    drawCard(s, 5.2, 1.1, 4.3, 3.2, C.dAmber, C.cream, "Stappen", C.dAmber, [
      { text: "1. Bereken individuele hoeveelheid q\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "2. Bereken totale opbrengst TO = p \u00d7 q\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "3. Bereken totale kosten TK\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "4. Winst = TO \u2212 TK", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
    ]);
    s.addNotes("De winst van een individuele aanbieder. Eerst de individuele hoeveelheid berekenen, dan TO en TK, en het verschil is de winst. Elke aanbieder maakt 72 euro winst.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 8: GRAFIEK — Kostencurves + winstrechthoek ★ NIEUW
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Winst in de grafiek");
    s.addImage({ data: g4, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("De horizontale lijn is de marktprijs. Het bedrijf produceert waar P = MK, dat is bij q* = 20. De winst is de groene rechthoek: het verschil tussen prijs en GTK, vermenigvuldigd met q*. Winst = (30 \u2212 26,4) \u00d7 20 = 72.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 9: Surplus CS en PS (tekst)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Surplus: CS en PS");
    drawCard(s, 0.5, 1.1, 4.3, 3.3, DOMAIN.color, C.cream, "Consumentensurplus (CS)", DOMAIN.color, [
      { text: "Voordeel van de consument: betaalt minder dan bereid was.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Driehoek boven p*, onder V\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, italic: true } },
      { text: "\u00bd \u00d7 200 \u00d7 (50 \u2212 30) = \u20ac2.000", options: { fontSize: 15, fontFace: "Consolas", color: C.dark, bold: true } },
    ]);
    drawCard(s, 5.2, 1.1, 4.3, 3.3, C.dGreen, C.cream, "Producentensurplus (PS)", C.dGreen, [
      { text: "Voordeel van de producent: ontvangt meer dan minimale prijs.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Driehoek onder p*, boven A\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, italic: true } },
      { text: "\u00bd \u00d7 200 \u00d7 (30 \u2212 10) = \u20ac2.000", options: { fontSize: 15, fontFace: "Consolas", color: C.dark, bold: true } },
    ]);
    s.addNotes("Het consumentensurplus is het verschil tussen wat consumenten bereid waren te betalen en wat ze daadwerkelijk betalen. Het producentensurplus is het verschil tussen de ontvangen prijs en de minimale prijs.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 10: GRAFIEK — CS/PS surplusdriehoeken ★ NIEUW
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "CS en PS in de grafiek");
    s.addImage({ data: g5, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("Het blauwe vlak is het consumentensurplus: het voordeel van consumenten die minder betalen dan hun maximale bereidheid. Het groene vlak is het producentensurplus. Beide zijn driehoeken: \u00bd \u00d7 basis \u00d7 hoogte.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 11: Lange termijn — winst verdwijnt (stroomdiagram)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Lange termijn: winst verdwijnt");
    const steps = [
      { text: "Bedrijven maken winst", bg: C.cream },
      { text: "Nieuwe aanbieders treden toe", bg: C.cream },
      { text: "Aanbod stijgt \u2192 prijs daalt", bg: C.dBlueLt },
      { text: "Winst \u2192 0  |  p = GTK(min)", bg: DOMAIN.color },
    ];
    const boxW = 7, boxH = 0.6, boxX = 1.5, startY = 1.2, gap = 0.25;
    steps.forEach((step, i) => {
      const y = startY + i * (boxH + gap);
      const isLast = i === steps.length - 1;
      s.addShape("rect", {
        x: boxX, y, w: boxW, h: boxH,
        fill: { color: step.bg }, rectRadius: 0.05, shadow: makeShadow(),
      });
      s.addText(step.text, {
        x: boxX + 0.3, y, w: boxW - 0.6, h: boxH,
        fontSize: 17, fontFace: "Arial", color: isLast ? C.white : C.dark, bold: isLast, valign: "middle",
      });
      if (i < steps.length - 1) {
        s.addText("\u2193", {
          x: boxX, y: y + boxH, w: boxW, h: gap,
          fontSize: 16, fontFace: "Arial", color: DOMAIN.color, align: "center", valign: "middle", bold: true,
        });
      }
    });
    s.addText("Op lange termijn: economische winst = 0", {
      x: 0.7, y: 4.5, w: 8.6, h: 0.4,
      fontSize: 14, fontFace: "Arial", color: C.dark, bold: true, italic: true,
    });
    s.addNotes("Op de lange termijn treden nieuwe bedrijven toe zolang er winst te behalen is. Dit verhoogt het aanbod, drukt de prijs, en uiteindelijk is de winst nul. Dan geldt: p = GTK(min).");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 12: Lange termijn — MK = GTK (berekening)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Lange termijn: MK = GTK");
    const steps = [
      { label: "Stel", formula: "MK = GTK  (geen winst, geen verlies)" },
      { label: "Invullen", formula: "q + 10 = 0,5q + 10 + 128/q" },
      { label: "Vereenvoudig", formula: "0,5q = 128/q  \u2192  0,5q\u00b2 = 128" },
      { label: "Oplossen", formula: "q\u00b2 = 256  \u2192  q = 16" },
      { label: "Prijs", formula: "p = 16 + 10 = \u20ac26" },
    ];
    const boxW = 8, boxX = 1, startY = 1.05, lineH = 0.55;
    s.addShape("rect", {
      x: boxX, y: startY, w: boxW, h: steps.length * lineH + 0.2,
      fill: { color: C.lightGray }, line: { color: C.borderGray, width: 0.5 },
    });
    s.addShape("rect", {
      x: boxX, y: startY, w: 0.06, h: steps.length * lineH + 0.2,
      fill: { color: DOMAIN.color },
    });
    steps.forEach((step, i) => {
      const y = startY + 0.1 + i * lineH;
      s.addText([
        { text: step.label + ":  ", options: { fontSize: 14, fontFace: "Arial", color: C.gray, bold: true } },
        { text: step.formula, options: { fontSize: 16, fontFace: "Consolas", color: C.dark } },
      ], {
        x: boxX + 0.25, y, w: boxW - 0.5, h: lineH, valign: "middle",
      });
    });
    s.addNotes("De lange-termijnberekening: stel MK = GTK (nulwinst). Los op naar q en p. Op lange termijn produceert elke aanbieder 16 stuks tegen een prijs van 26 euro.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 13: GRAFIEK — Lange-termijn nulwinst ★ NIEUW
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Lange termijn: winst = 0");
    s.addImage({ data: g6, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("Op lange termijn daalt de prijs tot het minimum van de GTK-curve. De winst is nul: de prijslijn raakt de GTK precies op het laagste punt. Nieuwe bedrijven treden toe zolang er winst is, waardoor het aanbod stijgt en de prijs daalt.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 14: Samenvatting
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
      "Individuele aanbodfunctie = MK-lijn (want MO = p = MK)",
      "Collectief aanbod: draai om en vermenigvuldig met n",
      "Evenwicht: stel Qv = Qa en los op naar p en Q",
      "Winst = TO \u2212 TK, surplus = driehoeken in V/A-grafiek",
      "Lange termijn: winst \u2192 0, prijs daalt tot MK = GTK",
    ];
    s.addText(
      bullets.map(b => ({ text: b, options: { fontSize: 15, fontFace: "Arial", color: C.white, bullet: true, breakType: "none" } })),
      { x: 0.7, y: 1.7, w: 8.6, h: 3.2, valign: "top", lineSpacingMultiple: 1.6, paraSpaceAfter: 6 }
    );
    s.addNotes("Vijf kernpunten. Van individueel naar collectief aanbod, het evenwicht, winstberekening, surplus en de lange termijn. Controleer of leerlingen de stappen zelfstandig kunnen doorlopen.");
  }

  // ── Save ──────────────────────────────────────────────────────────────
  const MODULE_ROOT = process.env.MODULE_ROOT ? path.resolve(process.env.MODULE_ROOT) : path.resolve(__dirname, "..");
  const outDir = path.resolve(MODULE_ROOT, "3.2 Hoofdstuk 2 - Marktvormen en hun marktevenwicht/3.2.2 Paragraaf 2 - Volkomen concurrentie/2. Leren");
  const outFile = path.join(outDir, "3.2.2 Volkomen concurrentie \u2013 presentatie.pptx");

  await pres.writeFile({ fileName: outFile });
  console.log("Saved:", outFile);
  const stats = fs.statSync(outFile);
  console.log("Size:", (stats.size / 1024).toFixed(1), "KB");
  console.log("Slides: 14 (11 original + 3 graphs)");
}

build().catch(err => { console.error("ERROR:", err); process.exit(1); });
