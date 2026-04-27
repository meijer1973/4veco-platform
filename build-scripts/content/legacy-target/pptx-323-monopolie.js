/**
 * PPTX Build: 3.2.3 Monopolie – presentatie met grafieken
 *
 * 11 dia's: 9 origineel + 2 grafiekdia's (MO=MK winstmax, winstrechthoek+CS)
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/pptx-323-monopolie.js
 */
process.env.NODE_PATH = "C:/Users/meije/AppData/Roaming/npm/node_modules";
require("module").Module._initPaths();

const PptxGenJS = require("pptxgenjs");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { saveSvgFiles } = require("../../lib/lib-svg-save");

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
// GRAPH 7: MONOPOLY PROFIT MAXIMIZATION (MO=MK, p* from V)
// V: p = -Q + 50, MO: p = -2Q + 50, MK: p = 0.5Q
// Q*=20, MO(20)=10, p*=30 (from V)
// ═══════════════════════════════════════════════════════════════════════════
function buildMonopolyMOeqMKSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 55, pMax = 55;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  // V: p = -Q + 50
  const v1x = qToX(0), v1y = pToY(50);     // Q=0, p=50
  const v2x = qToX(50), v2y = pToY(0);     // Q=50, p=0

  // MO: p = -2Q + 50 (same intercept, double slope)
  const mo1x = qToX(0), mo1y = pToY(50);   // Q=0, p=50
  const mo2x = qToX(25), mo2y = pToY(0);   // Q=25, p=0

  // MK: p = 0.5Q
  const mk1x = qToX(0), mk1y = pToY(0);   // Q=0, p=0
  const mk2x = qToX(50), mk2y = pToY(25); // Q=50, p=25

  // MO=MK: -2Q+50 = 0.5Q → Q*=20
  const qStar = 20;
  const moAtQ = -2 * qStar + 50; // = 10
  const pStar = -qStar + 50;      // = 30 (from V)

  const qStarX = qToX(qStar);
  const moEqY = pToY(moAtQ);     // MO=MK point
  const pStarY = pToY(pStar);    // p* on demand

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Monopolist: MO = MK \u2192 p* op de vraaglijn</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- Dashed path: from MO=MK up to V, then left to Y-axis -->
  <line x1="${qStarX}" y1="${moEqY}" x2="${qStarX}" y2="${pStarY}" stroke="${GC.grid}" stroke-width="1.2" stroke-dasharray="5,3"/>
  <line x1="${px}" y1="${pStarY}" x2="${qStarX}" y2="${pStarY}" stroke="${GC.grid}" stroke-width="1.2" stroke-dasharray="5,3"/>
  <line x1="${qStarX}" y1="${pStarY}" x2="${qStarX}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Demand curve (V) -->
  <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v2x+5}" y="${v2y-8}" font-size="12" font-weight="bold" fill="${GC.demand}">V</text>

  <!-- MO curve (double slope) -->
  <line x1="${mo1x}" y1="${mo1y}" x2="${mo2x}" y2="${mo2y}" stroke="${GC.revenue}" stroke-width="2.5"/>
  <text x="${mo2x+5}" y="${mo2y-8}" font-size="12" font-weight="bold" fill="${GC.revenue}">MO</text>

  <!-- MK curve -->
  <line x1="${mk1x}" y1="${mk1y}" x2="${mk2x}" y2="${mk2y}" stroke="${GC.cost}" stroke-width="2.5"/>
  <text x="${mk2x+5}" y="${mk2y+4}" font-size="12" font-weight="bold" fill="${GC.cost}">MK</text>

  <!-- MO=MK intersection dot -->
  <circle cx="${qStarX}" cy="${moEqY}" r="4" fill="${GC.revenue}" opacity="0.6"/>

  <!-- p* dot on demand curve (THE key point) -->
  <circle cx="${qStarX}" cy="${pStarY}" r="5" fill="${GC.demand}"/>

  <!-- Annotation: p* van V! -->
  <text x="${qStarX + 12}" y="${pStarY - 8}" font-size="11" fill="${GC.demand}" font-weight="bold">p* = 30</text>
  <text x="${qStarX + 12}" y="${pStarY + 8}" font-size="10" fill="${GC.demand}" font-style="italic">(van V, niet MK!)</text>

  <!-- Axis labels -->
  <text x="72" y="${pToY(50)+4}" text-anchor="end" font-size="10" fill="${GC.label}">50</text>
  <text x="72" y="${pStarY+4}" text-anchor="end" font-size="10" fill="${GC.axis}">30</text>
  <text x="${qStarX}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">Q* = 20</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 8: MONOPOLY PROFIT RECTANGLE + CS TRIANGLE
// Same curves + GTK = 0.25Q. Winst = (30-5)×20 = 500. CS = ½×20×20 = 200
// ═══════════════════════════════════════════════════════════════════════════
function buildMonopolyProfitCSSVG() {
  const px = 80, py = 45, pw = 600, ph = 265;
  const qMax = 55, pMax = 55;
  const qToX = q => Math.round(px + (q / qMax) * pw);
  const pToY = p => Math.round(py + ph - (p / pMax) * ph);

  const qStar = 20, pStar = 30, gtkStar = 5;

  // V, MO, MK same as graph 7
  const v1x = qToX(0), v1y = pToY(50);
  const v2x = qToX(50), v2y = pToY(0);
  const mo1x = qToX(0), mo1y = pToY(50);
  const mo2x = qToX(25), mo2y = pToY(0);
  const mk1x = qToX(0), mk1y = pToY(0);
  const mk2x = qToX(50), mk2y = pToY(25);

  // GTK = 0.25Q (linear, since TK = 0.25Q^2, no fixed costs)
  const gtk1x = qToX(0), gtk1y = pToY(0);
  const gtk2x = qToX(50), gtk2y = pToY(12.5); // GTK(50) = 12.5

  const qStarX = qToX(qStar);
  const pStarY = pToY(pStar);
  const gtkStarY = pToY(gtkStar);

  // Profit rectangle: from Y-axis to Q*, between p*=30 and GTK*=5
  // CS triangle: above p*=30, below V, from Q=0 to Q*=20
  // V at Q=0: p=50, V at Q=20: p=30. So CS triangle vertices:
  const csPoints = `${qToX(0)},${pToY(50)} ${qStarX},${pStarY} ${qToX(0)},${pStarY}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${GC.axis}"/>
    </marker>
  </defs>

  <!-- Title -->
  <text x="360" y="28" text-anchor="middle" font-size="14" font-weight="bold" fill="${GC.title}">Winst en consumentensurplus bij monopolie</text>

  <!-- Axes -->
  <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-5}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <line x1="${px}" y1="${py+ph}" x2="${px+pw+5}" y2="${py+ph}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#ah)"/>
  <text x="15" y="180" transform="rotate(-90, 15, 180)" text-anchor="middle" font-size="12" fill="${GC.label}">Prijs (P)</text>
  <text x="72" y="325" text-anchor="end" font-size="10" fill="${GC.label}">0</text>

  <!-- CS triangle (draw first, behind curves) -->
  <polygon points="${csPoints}" fill="${GC.surplus}" fill-opacity="0.45"/>
  <text x="${qToX(4)}" y="${pToY(38)}" font-size="11" font-weight="bold" fill="#1A5276">CS = 200</text>

  <!-- Profit rectangle -->
  <rect x="${px}" y="${pStarY}" width="${qStarX - px}" height="${gtkStarY - pStarY}" fill="${GC.prodSurplus}" fill-opacity="0.45"/>
  <text x="${(px + qStarX) / 2}" y="${(pStarY + gtkStarY) / 2 + 4}" text-anchor="middle" font-size="11" font-weight="bold" fill="#186A3B">Winst = 500</text>

  <!-- Dashed reference lines -->
  <line x1="${px}" y1="${pStarY}" x2="${qStarX}" y2="${pStarY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>
  <line x1="${px}" y1="${gtkStarY}" x2="${qStarX}" y2="${gtkStarY}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="4,2"/>
  <line x1="${qStarX}" y1="${pStarY}" x2="${qStarX}" y2="${py+ph}" stroke="${GC.grid}" stroke-width="1" stroke-dasharray="5,3"/>

  <!-- Demand curve (V) -->
  <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${GC.demand}" stroke-width="2.5"/>
  <text x="${v2x+5}" y="${v2y-8}" font-size="12" font-weight="bold" fill="${GC.demand}">V</text>

  <!-- MO curve -->
  <line x1="${mo1x}" y1="${mo1y}" x2="${mo2x}" y2="${mo2y}" stroke="${GC.revenue}" stroke-width="2"/>
  <text x="${mo2x+5}" y="${mo2y-8}" font-size="11" font-weight="bold" fill="${GC.revenue}">MO</text>

  <!-- MK curve -->
  <line x1="${mk1x}" y1="${mk1y}" x2="${mk2x}" y2="${mk2y}" stroke="${GC.cost}" stroke-width="2"/>
  <text x="${mk2x+5}" y="${mk2y+4}" font-size="11" font-weight="bold" fill="${GC.cost}">MK</text>

  <!-- GTK curve -->
  <line x1="${gtk1x}" y1="${gtk1y}" x2="${gtk2x}" y2="${gtk2y}" stroke="${GC.costAvg}" stroke-width="2"/>
  <text x="${gtk2x+5}" y="${gtk2y+4}" font-size="11" font-weight="bold" fill="${GC.costAvg}">GTK</text>

  <!-- p* dot on demand curve -->
  <circle cx="${qStarX}" cy="${pStarY}" r="5" fill="${GC.demand}"/>

  <!-- Axis labels -->
  <text x="72" y="${pToY(50)+4}" text-anchor="end" font-size="10" fill="${GC.label}">50</text>
  <text x="72" y="${pStarY+4}" text-anchor="end" font-size="10" fill="${GC.axis}">p* = 30</text>
  <text x="72" y="${gtkStarY+4}" text-anchor="end" font-size="10" fill="${GC.axis}">GTK* = 5</text>
  <text x="${qStarX}" y="325" text-anchor="middle" font-size="10" fill="${GC.axis}">Q* = 20</text>
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
  pres.title = "3.2.3 Monopolie";

  addTitleMaster(pres);
  addContentMaster(pres);

  const svgEntries = [
    { name: "monopoly-mo-eq-mk", svg: buildMonopolyMOeqMKSVG() },
    { name: "monopoly-profit-cs", svg: buildMonopolyProfitCSSVG() },
  ];
  const [g7Buf, g8Buf] = await Promise.all(
    svgEntries.map(e => svgToPng(e.svg))
  );
  const g7 = pngToBase64(g7Buf);
  const g8 = pngToBase64(g8Buf);

  // ────────────────────────────────────────────────────────────────────
  // DIA 1: Titel
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Monopolie", {
      x: 0.7, y: 1.2, w: 8.6, h: 2,
      fontSize: 40, fontFace: "Arial", color: C.white, bold: true,
    });
    s.addText("Paragraaf 3.2.3", {
      x: 0.7, y: 3.2, w: 8.6, h: 0.5,
      fontSize: 20, fontFace: "Arial", color: C.gray,
    });
    s.addText("Hoofdstuk 2: Marktvormen en hun marktevenwicht  |  Economie VWO", {
      x: 0.7, y: 5.15, w: 8.6, h: 0.475,
      fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle",
    });
    s.addNotes("Welkom bij paragraaf 3.2.3 over monopolie. We behandelen de monopolist als prijszetter, het afleiden van MO en MK, winstmaximalisatie, de grafiek, en prijsdiscriminatie.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 2: Leerdoelen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Wat ga je leren?");
    const bullets = [
      "De monopolist als prijszetter herkennen",
      "MO, MK en GTK afleiden uit V en TK",
      "Winstmaximalisatie toepassen: MO = MK",
      "De monopoliegrafiek tekenen en lezen",
      "Winst en CS bij monopolie berekenen",
      "Prijsdiscriminatie herkennen en toepassen",
    ];
    s.addText(
      bullets.map(b => ({ text: b, options: { fontSize: 15, fontFace: "Arial", color: C.dark, bullet: true, breakType: "none" } })),
      { x: 0.7, y: 1.2, w: 8.6, h: 3.8, valign: "top", lineSpacingMultiple: 1.4, paraSpaceAfter: 6 }
    );
    s.addNotes("Zes leerdoelen. Van herkennen tot berekenen. We eindigen met prijsdiscriminatie als extra toepassing.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 3: Monopolist = prijszetter
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Monopolist = prijszetter");
    drawCard(s, 0.5, 1.1, 4.3, 2.0, C.purple, C.cream, "E\u00e9n aanbieder", C.purple, [
      { text: "De monopolist is de enige aanbieder. Hij kiest zelf de prijs op de vraaglijn.", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(s, 5.2, 1.1, 4.3, 2.0, DOMAIN.color, C.cream, "Vraaglijn = prijsafzetlijn", DOMAIN.color, [
      { text: "De vraaglijn bepaalt welke prijs de monopolist kan vragen bij elke hoeveelheid.", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    s.addText("Kernpunt: Bij monopolie geldt MO < p (de MO daalt sneller dan de prijs)", {
      x: 0.5, y: 3.5, w: 9, h: 0.5,
      fontSize: 15, fontFace: "Arial", color: C.dark, bold: true,
    });
    s.addNotes("De monopolist is een prijszetter: hij kiest zijn eigen prijs op de vraaglijn. Omdat hij de enige aanbieder is, bepaalt de marktvraag hoeveel hij kan verkopen bij elke prijs. Cruciaal: MO < p.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 4: Formules afleiden
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Formules afleiden");
    const formulas = [
      { label: "Vraaglijn", formula: "V: p = \u2212Q + 50" },
      { label: "TO", formula: "TO = p \u00d7 Q = (\u2212Q + 50) \u00d7 Q = \u2212Q\u00b2 + 50Q" },
      { label: "MO", formula: "MO = TO\u2032 = \u22122Q + 50" },
      { label: "TK", formula: "TK = 0,25Q\u00b2" },
      { label: "MK", formula: "MK = TK\u2032 = 0,5Q" },
      { label: "GTK", formula: "GTK = TK/Q = 0,25Q" },
    ];
    const boxW = 8, boxX = 1, startY = 0.95, lineH = 0.5;
    s.addShape("rect", {
      x: boxX, y: startY, w: boxW, h: formulas.length * lineH + 0.2,
      fill: { color: C.lightGray }, line: { color: C.borderGray, width: 0.5 },
    });
    s.addShape("rect", {
      x: boxX, y: startY, w: 0.06, h: formulas.length * lineH + 0.2,
      fill: { color: C.purple },
    });
    formulas.forEach((f, i) => {
      const y = startY + 0.1 + i * lineH;
      s.addText([
        { text: f.label + ":  ", options: { fontSize: 13, fontFace: "Arial", color: C.gray, bold: true } },
        { text: f.formula, options: { fontSize: 15, fontFace: "Consolas", color: C.dark } },
      ], {
        x: boxX + 0.25, y, w: boxW - 0.5, h: lineH, valign: "middle",
      });
    });
    s.addNotes("De formuleafleiding. Start met de vraaglijn, bereken TO door p maal Q, leid af naar MO. Let op: MO heeft dubbele helling van de vraaglijn maar hetzelfde startpunt. De kosten worden apart afgeleid.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 5: Winstmax MO = MK (4 stappen)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Winstmax: MO = MK");
    const steps = [
      { label: "Stap 1: MO = MK", formula: "\u22122Q + 50 = 0,5Q" },
      { label: "Stap 2: Oplossen", formula: "2,5Q = 50  \u2192  Q* = 20" },
      { label: "Stap 3: Prijs", formula: "p* = \u221220 + 50 = \u20ac30" },
      { label: "Stap 4: Winst", formula: "(30 \u2212 5) \u00d7 20 = \u20ac500" },
    ];
    const boxW = 7.5, boxX = 1.25, startY = 1.1, lineH = 0.6;
    s.addShape("rect", {
      x: boxX, y: startY, w: boxW, h: steps.length * lineH + 0.2,
      fill: { color: C.lightGray }, line: { color: C.borderGray, width: 0.5 },
    });
    s.addShape("rect", {
      x: boxX, y: startY, w: 0.06, h: steps.length * lineH + 0.2,
      fill: { color: C.purple },
    });
    steps.forEach((step, i) => {
      const y = startY + 0.1 + i * lineH;
      s.addText([
        { text: step.label + ":  ", options: { fontSize: 14, fontFace: "Arial", color: C.gray, bold: true } },
        { text: step.formula, options: { fontSize: 17, fontFace: "Consolas", color: C.dark } },
      ], {
        x: boxX + 0.25, y, w: boxW - 0.5, h: lineH, valign: "middle",
      });
    });

    // Warning box
    s.addShape("rect", {
      x: 1.25, y: 3.85, w: 7.5, h: 0.55,
      fill: { color: C.lightRed }, rectRadius: 0.05,
    });
    s.addShape("rect", { x: 1.25, y: 3.85, w: 0.06, h: 0.55, fill: { color: C.red } });
    s.addText("Lees de prijs af op de VRAAGLIJN, niet op de MK-lijn!", {
      x: 1.5, y: 3.85, w: 7, h: 0.55,
      fontSize: 14, fontFace: "Arial", color: C.red, bold: true, valign: "middle",
    });
    s.addNotes("De winstmaximalisatie in vier stappen. Belangrijk: na het berekenen van Q* lees je de prijs af op de VRAAGLIJN, niet op de MK-lijn. Dit is een veelgemaakte fout. GTK bij Q=20 is 0,25 maal 20 = 5.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 6: GRAFIEK — Monopolie MO=MK ★ NIEUW
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Monopolie: winstmaximalisatie in de grafiek");
    s.addImage({ data: g7, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("De monopolist produceert waar MO = MK (bij Q* = 20). De prijs leest hij af op de vraaglijn: p* = 30. LET OP: de prijs is 30, niet 10! De meestgemaakte fout is de prijs aflezen op de MK-lijn.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 7: Winst en CS berekenen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Winst en CS berekenen");
    drawCard(s, 0.5, 1.1, 4.3, 3.3, C.dGreen, C.cream, "Maximale winst", C.dGreen, [
      { text: "W = TO \u2212 TK\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: "TO = 30 \u00d7 20 = \u20ac600\n", options: { fontSize: 14, fontFace: "Consolas", color: C.dark } },
      { text: "TK = 0,25 \u00d7 400 = \u20ac100\n\n", options: { fontSize: 14, fontFace: "Consolas", color: C.dark } },
      { text: "W = \u20ac500", options: { fontSize: 16, fontFace: "Consolas", color: C.dark, bold: true } },
    ]);
    drawCard(s, 5.2, 1.1, 4.3, 3.3, DOMAIN.color, C.cream, "Consumentensurplus", DOMAIN.color, [
      { text: "CS = \u00bd \u00d7 Q* \u00d7 (p_max \u2212 p*)\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: "CS = \u00bd \u00d7 20 \u00d7 (50 \u2212 30)\n", options: { fontSize: 14, fontFace: "Consolas", color: C.dark } },
      { text: "CS = \u00bd \u00d7 20 \u00d7 20\n\n", options: { fontSize: 14, fontFace: "Consolas", color: C.dark } },
      { text: "CS = \u20ac200", options: { fontSize: 16, fontFace: "Consolas", color: C.dark, bold: true } },
    ]);
    s.addNotes("De winst is TO minus TK = 500 euro. Het consumentensurplus is de driehoek boven de prijs en onder de vraaglijn = 200 euro. Vergelijk dit met volkomen concurrentie: de monopolist maakt meer winst, maar het CS is kleiner.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 8: GRAFIEK — Winstrechthoek + CS-driehoek ★ NIEUW
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Winst en CS bij monopolie");
    s.addImage({ data: g8, x: 0.75, y: 0.9, w: 8.5, h: 4.25 });
    s.addNotes("De groene rechthoek is de winst van de monopolist: (p* \u2212 GTK*) \u00d7 Q* = (30 \u2212 5) \u00d7 20 = 500. De blauwe driehoek is het consumentensurplus: \u00bd \u00d7 20 \u00d7 (50 \u2212 30) = 200. Vergelijk: bij volkomen concurrentie was CS = 2.000.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 9: Prijsdiscriminatie
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Prijsdiscriminatie");
    const cardH = 1.5, cardW = 4.3;
    drawCard(s, 0.5, 1.1, cardW, cardH, C.purple, C.cream, "Wat is het?", C.purple, [
      { text: "Verschillende prijzen vragen aan verschillende groepen voor hetzelfde product", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(s, 5.2, 1.1, cardW, cardH, C.dAmber, C.cream, "Waarom?", C.dAmber, [
      { text: "Hogere winst: ook consumenten met lagere betalingsbereidheid kopen", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(s, 0.5, 2.9, cardW, 1.3, DOMAIN.color, C.cream, "Voorwaarde 1", DOMAIN.color, [
      { text: "Marktsegmenten zijn te onderscheiden (bijv. jongeren vs. ouderen)", options: { fontSize: 13, fontFace: "Arial", color: C.dark } },
    ]);
    drawCard(s, 5.2, 2.9, cardW, 1.3, DOMAIN.color, C.cream, "Voorwaarde 2", DOMAIN.color, [
      { text: "Doorverkoop is niet mogelijk (kaart op naam, digitaal product)", options: { fontSize: 13, fontFace: "Arial", color: C.dark } },
    ]);
    s.addNotes("Prijsdiscriminatie is een strategie die monopolisten gebruiken om meer winst te maken. Ze vragen verschillende prijzen aan verschillende groepen. Twee voorwaarden: groepen moeten te onderscheiden zijn en doorverkoop moet onmogelijk zijn.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 10: Waarom levert PD meer winst? (stroom)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Waarom levert prijsdiscriminatie meer winst?");
    const steps = [
      { text: "Twee groepen onderscheiden", bg: C.cream },
      { text: "Lagere prijs voor groep met lagere betalingsbereidheid", bg: C.cream },
      { text: "Meer klanten (extra omzet)", bg: C.dBlueLt },
      { text: "Winst stijgt (zolang p > MK)", bg: DOMAIN.color },
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
        fontSize: 16, fontFace: "Arial", color: isLast ? C.white : C.dark, bold: isLast, valign: "middle",
      });
      if (i < steps.length - 1) {
        s.addText("\u2193", {
          x: boxX, y: y + boxH, w: boxW, h: gap,
          fontSize: 16, fontFace: "Arial", color: DOMAIN.color, align: "center", valign: "middle", bold: true,
        });
      }
    });
    s.addText("Jongeren betalen minder, maar nog boven de MK \u2192 winstgevend", {
      x: 0.7, y: 4.6, w: 8.6, h: 0.35,
      fontSize: 13, fontFace: "Arial", color: C.gray, italic: true,
    });
    s.addNotes("De logica: door een lagere prijs te vragen aan groepen met een lagere betalingsbereidheid, krijg je extra klanten. Zolang de prijs boven de marginale kosten ligt, is elke extra verkoop winstgevend.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 11: Samenvatting
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
      "De monopolist kiest zijn prijs op de vraaglijn (MO < p)",
      "MO heeft dubbele helling van V, zelfde startpunt",
      "Winstmax: MO = MK \u2192 Q*, dan prijs aflezen op V",
      "Winst = (p* \u2212 GTK) \u00d7 Q*, CS = driehoek boven p*",
      "Prijsdiscriminatie verhoogt de winst als p > MK",
    ];
    s.addText(
      bullets.map(b => ({ text: b, options: { fontSize: 15, fontFace: "Arial", color: C.white, bullet: true, breakType: "none" } })),
      { x: 0.7, y: 1.7, w: 8.6, h: 3.2, valign: "top", lineSpacingMultiple: 1.6, paraSpaceAfter: 6 }
    );
    s.addNotes("Vijf kernpunten. Controleer of leerlingen de prijs op de vraaglijn aflezen, de MO-formule kennen, en begrijpen waarom prijsdiscriminatie winstgevend is.");
  }

  // ── Save ──────────────────────────────────────────────────────────────
  const MODULE_ROOT = process.env.MODULE_ROOT ? path.resolve(process.env.MODULE_ROOT) : path.resolve(__dirname, "../../..");
  const outDir = path.resolve(MODULE_ROOT, "3.2 Hoofdstuk 2 - Marktvormen en hun marktevenwicht/3.2.3 Paragraaf 3 - Monopolie/2. Leren");
  const outFile = path.join(outDir, "3.2.3 Monopolie \u2013 presentatie.pptx");

  await pres.writeFile({ fileName: outFile });
  console.log("Saved:", outFile);
  saveSvgFiles(svgEntries, outDir);
  const stats = fs.statSync(outFile);
  console.log("Size:", (stats.size / 1024).toFixed(1), "KB");
  console.log("Slides: 11 (9 original + 2 graphs)");
}

build().catch(err => { console.error("ERROR:", err); process.exit(1); });
