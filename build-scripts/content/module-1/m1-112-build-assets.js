/**
 * SVG/PNG: 1.1.2 Kiezen of delen - budget line graphs
 * Generates 4 budget line visualizations for paragraph 1.1.2.
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-112-build-assets.js
 */
process.env.NODE_PATH = "C:/Users/meije/AppData/Roaming/npm/node_modules";
require("module").Module._initPaths();

const fs = require("fs");
const path = require("path");
const { svgToPng, pngToBase64, GRAPH_COLORS } = require("../../lib/lib-svg-utils");

const OUT_DIR = path.resolve(
  __dirname,
  "../../../..",
  "module one claude",
  "1.1 Hoofdstuk 1 - Voor niks gaat de zon op",
  "1.1.2 Paragraaf 2 - Kiezen of delen",
  "_assets"
);

// Graph constants
const GC = {
  axis: GRAPH_COLORS.axis,
  grid: GRAPH_COLORS.grid,
  label: GRAPH_COLORS.label || "#718096",
  title: GRAPH_COLORS.title || "#1E2761",
  bg: GRAPH_COLORS.bg,
  teal: "#17A2B8",
  tealDk: "#0E6B7A",
};

// Plot area boundaries (from economic-graph.md spec)
const PX = 80, PY = 45, PX2 = 680, PY2 = 310;
const PW = PX2 - PX; // 600
const PH = PY2 - PY; // 265

/** Map data coordinates to SVG pixel coordinates */
function mapX(val, maxVal) {
  return PX + (val / maxVal) * PW;
}
function mapY(val, maxVal) {
  return PY2 - (val / maxVal) * PH;
}

/** Generate horizontal grid lines */
function gridLinesH(maxVal, step) {
  let lines = "";
  for (let v = step; v <= maxVal; v += step) {
    const y = mapY(v, maxVal).toFixed(1);
    lines += `<line x1="${PX}" y1="${y}" x2="${PX2}" y2="${y}" stroke="${GC.grid}" stroke-width="0.8" stroke-dasharray="4,3"/>`;
  }
  return lines;
}

/** Generate vertical grid lines */
function gridLinesV(maxVal, step) {
  let lines = "";
  for (let v = step; v <= maxVal; v += step) {
    const x = mapX(v, maxVal).toFixed(1);
    lines += `<line x1="${x}" y1="${PY}" x2="${x}" y2="${PY2}" stroke="${GC.grid}" stroke-width="0.8" stroke-dasharray="4,3"/>`;
  }
  return lines;
}

/** Generate X-axis tick labels */
function ticksX(maxVal, step) {
  let ticks = "";
  for (let v = 0; v <= maxVal; v += step) {
    const x = mapX(v, maxVal).toFixed(1);
    ticks += `<text x="${x}" y="${PY2 + 18}" text-anchor="middle" font-size="11" fill="${GC.label}">${v}</text>`;
    ticks += `<line x1="${x}" y1="${PY2}" x2="${x}" y2="${PY2 + 4}" stroke="${GC.axis}" stroke-width="1"/>`;
  }
  return ticks;
}

/** Generate Y-axis tick labels */
function ticksY(maxVal, step, fmt) {
  let ticks = "";
  for (let v = 0; v <= maxVal; v += step) {
    const y = mapY(v, maxVal).toFixed(1);
    const label = fmt ? fmt(v) : v;
    ticks += `<text x="${PX - 8}" y="${(+y + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="${GC.label}">${label}</text>`;
    ticks += `<line x1="${PX - 4}" y1="${y}" x2="${PX}" y2="${y}" stroke="${GC.axis}" stroke-width="1"/>`;
  }
  return ticks;
}

/** Standard SVG header with background and arrow markers */
function svgHead(title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="axisArrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0,10 3.5,0 7" fill="${GC.axis}"/>
    </marker>
    <marker id="shiftArrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0,10 3.5,0 7" fill="${GC.tealDk}"/>
    </marker>
  </defs>
  <text x="360" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">${title}</text>`;
}

/** X and Y axes with arrows */
function axes(xLabel, yLabel) {
  return `
  <!-- Y-axis -->
  <line x1="${PX}" y1="${PY2}" x2="${PX}" y2="${PY - 8}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#axisArrow)"/>
  <!-- X-axis -->
  <line x1="${PX}" y1="${PY2}" x2="${PX2 + 8}" y2="${PY2}" stroke="${GC.axis}" stroke-width="1.5" marker-end="url(#axisArrow)"/>
  <!-- Axis labels -->
  <text x="${(PX + PX2) / 2}" y="${PY2 + 40}" text-anchor="middle" font-size="13" fill="${GC.axis}">${xLabel}</text>
  <text x="18" y="${(PY + PY2) / 2}" text-anchor="middle" font-size="13" fill="${GC.axis}" transform="rotate(-90,18,${(PY + PY2) / 2})">${yLabel}</text>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// GRAPH 1: Budgetlijn basis
// ─────────────────────────────────────────────────────────────────────────────
function buildBudgetLineBasis() {
  const maxX = 18, maxY = 3;
  const stepX = 3, stepY = 1;

  // Budget line endpoints
  const x1 = mapX(0, maxX), y1 = mapY(3, maxY);
  const x2 = mapX(18, maxX), y2 = mapY(0, maxY);

  // Point (6,2)
  const px = mapX(6, maxX), py = mapY(2, maxY);

  // Shaded feasible region (polygon under the line)
  const originX = mapX(0, maxX), originY = mapY(0, maxY);

  return `${svgHead("Budgetlijn: kiezen binnen je budget")}
  ${gridLinesH(maxY, stepY)}
  ${gridLinesV(maxX, stepX)}
  ${axes("Broodjes kroket (q\u2081)", "Boeken (q\u2082)")}
  ${ticksX(maxX, stepX)}
  ${ticksY(maxY, stepY)}

  <!-- Feasible region -->
  <polygon points="${x1},${y1} ${x2},${y2} ${originX},${originY}" fill="#85C1E9" fill-opacity="0.25" stroke="none"/>
  <text x="${mapX(5, maxX)}" y="${mapY(0.5, maxY)}" text-anchor="middle" font-size="11" fill="${GC.label}" font-style="italic">haalbaar gebied</text>

  <!-- Budget line -->
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${GC.teal}" stroke-width="2.5"/>

  <!-- Point (6,2) -->
  <circle cx="${px}" cy="${py}" r="5" fill="${GC.teal}"/>
  <line x1="${px}" y1="${py}" x2="${px}" y2="${mapY(0, maxY)}" stroke="${GC.teal}" stroke-width="0.8" stroke-dasharray="4,3"/>
  <line x1="${mapX(0, maxX)}" y1="${py}" x2="${px}" y2="${py}" stroke="${GC.teal}" stroke-width="0.8" stroke-dasharray="4,3"/>
  <text x="${px + 10}" y="${py - 10}" font-size="12" fill="${GC.axis}" font-weight="bold">Productcombinatie (6, 2)</text>

  <!-- Label -->
  <text x="${mapX(11, maxX)}" y="${mapY(2.2, maxY)}" font-size="12" fill="${GC.tealDk}" font-weight="bold">Budgetlijn: 36 = 2q\u2081 + 12q\u2082</text>

</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// GRAPH 2: Budgetlijn verschuiving (parallel shift)
// ─────────────────────────────────────────────────────────────────────────────
function buildBudgetLineVerschuiving() {
  const maxX = 27, maxY = 5;
  const stepX = 3, stepY = 1;

  // Original: B=36 → (0,3) to (18,0)
  const ox1 = mapX(0, maxX), oy1 = mapY(3, maxY);
  const ox2 = mapX(18, maxX), oy2 = mapY(0, maxY);

  // New: B=54 → (0,4.5) to (27,0)
  const nx1 = mapX(0, maxX), ny1 = mapY(4.5, maxY);
  const nx2 = mapX(27, maxX), ny2 = mapY(0, maxY);

  // Arrow midpoint (from old line midpoint to new line midpoint)
  const aMidOldX = mapX(9, maxX), aMidOldY = mapY(1.5, maxY);
  const aMidNewX = mapX(13.5, maxX), aMidNewY = mapY(2.25, maxY);

  return `${svgHead("Budgetlijn: verschuiving bij hoger budget")}
  ${gridLinesH(maxY, stepY)}
  ${gridLinesV(maxX, stepX)}
  ${axes("Broodjes kroket (q\u2081)", "Boeken (q\u2082)")}
  ${ticksX(maxX, stepX)}
  ${ticksY(maxY, stepY)}

  <!-- Original line (dashed) -->
  <line x1="${ox1}" y1="${oy1}" x2="${ox2}" y2="${oy2}" stroke="${GC.teal}" stroke-width="2" stroke-dasharray="8,4" opacity="0.6"/>
  <text x="${mapX(16, maxX)}" y="${mapY(0.7, maxY)}" font-size="12" fill="${GC.teal}" opacity="0.7">B = 36</text>

  <!-- New line (solid) -->
  <line x1="${nx1}" y1="${ny1}" x2="${nx2}" y2="${ny2}" stroke="${GC.tealDk}" stroke-width="2.5"/>
  <text x="${mapX(24, maxX)}" y="${mapY(1.2, maxY)}" font-size="12" fill="${GC.tealDk}" font-weight="bold">B = 54</text>

  <!-- Shift arrow -->
  <line x1="${aMidOldX}" y1="${aMidOldY}" x2="${aMidNewX}" y2="${aMidNewY}" stroke="${GC.tealDk}" stroke-width="2" marker-end="url(#shiftArrow)"/>
  <text x="${(aMidOldX + aMidNewX) / 2 + 12}" y="${(aMidOldY + aMidNewY) / 2 - 8}" font-size="11" fill="${GC.tealDk}" font-weight="bold">budget \u2191</text>

</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// GRAPH 3: Budgetlijn prijseffect (pivot)
// ─────────────────────────────────────────────────────────────────────────────
function buildBudgetLinePrijseffect() {
  const maxX = 12, maxY = 6;
  const stepX = 2, stepY = 1;

  // Original: B=180, p1=15, p2=30 → (0,6) to (12,0)
  const ox1 = mapX(0, maxX), oy1 = mapY(6, maxY);
  const ox2 = mapX(12, maxX), oy2 = mapY(0, maxY);

  // New: B=180, p1=20, p2=30 → (0,6) to (9,0)
  const nx1 = mapX(0, maxX), ny1 = mapY(6, maxY);
  const nx2 = mapX(9, maxX), ny2 = mapY(0, maxY);

  return `${svgHead("Budgetlijn: effect van prijsstijging")}
  ${gridLinesH(maxY, stepY)}
  ${gridLinesV(maxX, stepX)}
  ${axes("T-shirts (q\u2081)", "Broeken (q\u2082)")}
  ${ticksX(maxX, stepX)}
  ${ticksY(maxY, stepY)}

  <!-- Original line (dashed) -->
  <line x1="${ox1}" y1="${oy1}" x2="${ox2}" y2="${oy2}" stroke="${GC.teal}" stroke-width="2" stroke-dasharray="8,4" opacity="0.6"/>
  <text x="${mapX(10.5, maxX)}" y="${mapY(1.2, maxY)}" font-size="11" fill="${GC.teal}" opacity="0.7">p\u2081 = 15</text>

  <!-- New line (solid) -->
  <line x1="${nx1}" y1="${ny1}" x2="${nx2}" y2="${ny2}" stroke="${GC.tealDk}" stroke-width="2.5"/>
  <text x="${mapX(7, maxX)}" y="${mapY(0.6, maxY)}" font-size="11" fill="${GC.tealDk}" font-weight="bold">p\u2081 = 20</text>

  <!-- Pivot indicator at Y-intercept -->
  <circle cx="${nx1}" cy="${ny1}" r="5" fill="${GC.tealDk}" stroke="white" stroke-width="1.5"/>
  <text x="${mapX(0.3, maxX) + 8}" y="${mapY(5.6, maxY)}" font-size="11" fill="${GC.tealDk}" font-style="italic">draaipunt</text>

  <!-- Label -->
  <text x="${mapX(7, maxX)}" y="${mapY(4.5, maxY)}" font-size="13" fill="${GC.tealDk}" font-weight="bold">p\u2081 stijgt: 15 \u2192 20</text>

  <!-- Curved arrow showing inward pivot -->
  <path d="M ${mapX(11, maxX)} ${mapY(0.8, maxY)} Q ${mapX(11, maxX)} ${mapY(0.2, maxY)} ${mapX(9.5, maxX)} ${mapY(0.3, maxY)}" fill="none" stroke="${GC.tealDk}" stroke-width="1.5" marker-end="url(#shiftArrow)"/>

</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// GRAPH 4: Arbeidsmarkt / vrije tijd
// ─────────────────────────────────────────────────────────────────────────────
function buildLabourMarketFreeTime() {
  const maxX = 24, maxY = 288;
  const stepX = 4, stepY = 48;

  // w=10: (24,0) to (0,240)
  const ox1 = mapX(24, maxX), oy1 = mapY(0, maxY);
  const ox2 = mapX(0, maxX), oy2 = mapY(240, maxY);

  // w=12: (24,0) to (0,288)
  const nx1 = mapX(24, maxX), ny1 = mapY(0, maxY);
  const nx2 = mapX(0, maxX), ny2 = mapY(288, maxY);

  // Point: 8 uur werken = 16 uur vrije tijd, inkomen = 80
  const px = mapX(16, maxX), py = mapY(80, maxY);

  return `${svgHead("Arbeids-vrije-tijdkeuze")}
  ${gridLinesH(maxY, stepY)}
  ${gridLinesV(maxX, stepX)}
  ${axes("Vrije tijd (uren)", "Inkomen (\u20AC)")}
  ${ticksX(maxX, stepX)}
  ${ticksY(maxY, stepY, v => "\u20AC" + v)}

  <!-- w=10 line (solid) -->
  <line x1="${ox1}" y1="${oy1}" x2="${ox2}" y2="${oy2}" stroke="${GC.teal}" stroke-width="2.5"/>
  <text x="${mapX(3, maxX)}" y="${mapY(215, maxY)}" font-size="12" fill="${GC.teal}" font-weight="bold">w = \u20AC10/uur</text>

  <!-- w=12 line (dashed) -->
  <line x1="${nx1}" y1="${ny1}" x2="${nx2}" y2="${ny2}" stroke="${GC.tealDk}" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="${mapX(4.5, maxX)}" y="${mapY(260, maxY)}" font-size="12" fill="${GC.tealDk}" font-weight="bold">w = \u20AC12/uur</text>

  <!-- Point: 8 uur werken (16 uur vrije tijd) -->
  <circle cx="${px}" cy="${py}" r="5" fill="${GC.teal}"/>
  <line x1="${px}" y1="${py}" x2="${px}" y2="${mapY(0, maxY)}" stroke="${GC.teal}" stroke-width="0.8" stroke-dasharray="4,3"/>
  <line x1="${mapX(0, maxX)}" y1="${py}" x2="${px}" y2="${py}" stroke="${GC.teal}" stroke-width="0.8" stroke-dasharray="4,3"/>
  <text x="${px + 8}" y="${py - 10}" font-size="11" fill="${GC.axis}" font-weight="bold">8 uur werken = \u20AC80</text>

  <!-- Pivot at (24,0) -->
  <circle cx="${ox1}" cy="${oy1}" r="4" fill="${GC.axis}" stroke="white" stroke-width="1.5"/>

</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD AND SAVE
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const graphs = [
    { name: "budgetlijn-basis", builder: buildBudgetLineBasis },
    { name: "budgetlijn-verschuiving", builder: buildBudgetLineVerschuiving },
    { name: "budgetlijn-prijseffect", builder: buildBudgetLinePrijseffect },
    { name: "arbeidsmarkt-vrije-tijd", builder: buildLabourMarketFreeTime },
  ];

  for (const { name, builder } of graphs) {
    const svg = builder();
    const svgPath = path.join(OUT_DIR, `${name}.svg`);
    const pngPath = path.join(OUT_DIR, `${name}.png`);

    fs.writeFileSync(svgPath, svg, "utf8");
    console.log(`  SVG  ${svgPath}`);

    const pngBuf = await svgToPng(svg, 1440);
    fs.writeFileSync(pngPath, pngBuf);
    console.log(`  PNG  ${pngPath}`);
  }

  console.log(`\nDone — ${graphs.length} graphs saved to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
