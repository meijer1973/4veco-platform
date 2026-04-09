/**
 * SVG/PNG: 1.1.3 Toepassen - application graphs
 * Generates 4 visualizations for paragraph 1.1.3.
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/m1-113-build-assets.js
 */
process.env.NODE_PATH = "C:/Users/meije/AppData/Roaming/npm/node_modules";
require("module").Module._initPaths();

const fs = require("fs");
const path = require("path");
const { svgToPng, pngToBase64, GRAPH_COLORS } = require("./lib-svg-utils");

const OUT_DIR = path.resolve(
  __dirname,
  "../..",
  "module one claude",
  "1.1 Hoofdstuk 1 - Voor niks gaat de zon op",
  "1.1.3 Paragraaf 3 - Toepassen",
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
  navy: "#1E2761",
};

// Plot area boundaries
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
    <marker id="flowArrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0,10 3.5,0 7" fill="${GC.teal}"/>
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
// GRAPH 1: Schaarste-samenhang flowchart
// ─────────────────────────────────────────────────────────────────────────────
function buildSchaarseSamenhang() {
  // Flowchart layout — no axes needed
  // Two source boxes feed into Schaarste, which leads to Keuze, then Opofferingskosten
  //
  //  Behoeften (onbeperkt)  ──┐
  //                            ├──▶  Schaarste  ──▶  Keuze  ──▶  Opofferingskosten
  //  Middelen (beperkt)    ──┘

  const boxH = 48, boxR = 10;
  const midY = 180; // vertical center

  // Box positions (cx, cy, width)
  const boxes = [
    { label: "Behoeften",  sub: "(onbeperkt)", cx: 130, cy: midY - 60, w: 170 },
    { label: "Middelen",   sub: "(beperkt)",    cx: 130, cy: midY + 60, w: 170 },
    { label: "Schaarste",  sub: "",             cx: 330, cy: midY,      w: 140 },
    { label: "Keuze",      sub: "",             cx: 480, cy: midY,      w: 110 },
    { label: "Opofferings-", sub: "kosten",     cx: 630, cy: midY,      w: 150 },
  ];

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs>
    <marker id="flowArrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0,10 3.5,0 7" fill="${GC.teal}"/>
    </marker>
  </defs>
  <text x="360" y="32" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">Samenhang: van schaarste naar opofferingskosten</text>`;

  // Draw boxes
  for (const b of boxes) {
    const x = b.cx - b.w / 2;
    const y = b.cy - boxH / 2;
    svg += `
    <rect x="${x}" y="${y}" width="${b.w}" height="${boxH}" rx="${boxR}" fill="${GC.teal}" opacity="0.9"/>`;
    if (b.sub && b.label !== "Opofferings-") {
      svg += `
    <text x="${b.cx}" y="${b.cy - 5}" text-anchor="middle" font-size="14" font-weight="bold" fill="white">${b.label}</text>
    <text x="${b.cx}" y="${b.cy + 14}" text-anchor="middle" font-size="12" fill="white" opacity="0.9">${b.sub}</text>`;
    } else if (b.label === "Opofferings-") {
      svg += `
    <text x="${b.cx}" y="${b.cy - 5}" text-anchor="middle" font-size="14" font-weight="bold" fill="white">${b.label}</text>
    <text x="${b.cx}" y="${b.cy + 14}" text-anchor="middle" font-size="14" font-weight="bold" fill="white">${b.sub}</text>`;
    } else {
      svg += `
    <text x="${b.cx}" y="${b.cy + 5}" text-anchor="middle" font-size="14" font-weight="bold" fill="white">${b.label}</text>`;
    }
  }

  // Arrows
  // Behoeften → Schaarste
  const arrowStartX1 = boxes[0].cx + boxes[0].w / 2;
  const arrowEndX1 = boxes[2].cx - boxes[2].w / 2;
  svg += `
  <line x1="${arrowStartX1}" y1="${boxes[0].cy}" x2="${arrowEndX1 - 4}" y2="${boxes[2].cy}" stroke="${GC.teal}" stroke-width="2.5" marker-end="url(#flowArrow)"/>`;

  // Middelen → Schaarste
  const arrowStartX2 = boxes[1].cx + boxes[1].w / 2;
  svg += `
  <line x1="${arrowStartX2}" y1="${boxes[1].cy}" x2="${arrowEndX1 - 4}" y2="${boxes[2].cy}" stroke="${GC.teal}" stroke-width="2.5" marker-end="url(#flowArrow)"/>`;

  // Schaarste → Keuze
  const arrowStartX3 = boxes[2].cx + boxes[2].w / 2;
  const arrowEndX3 = boxes[3].cx - boxes[3].w / 2;
  svg += `
  <line x1="${arrowStartX3}" y1="${boxes[2].cy}" x2="${arrowEndX3 - 4}" y2="${boxes[3].cy}" stroke="${GC.teal}" stroke-width="2.5" marker-end="url(#flowArrow)"/>`;

  // Keuze → Opofferingskosten
  const arrowStartX4 = boxes[3].cx + boxes[3].w / 2;
  const arrowEndX4 = boxes[4].cx - boxes[4].w / 2;
  svg += `
  <line x1="${arrowStartX4}" y1="${boxes[3].cy}" x2="${arrowEndX4 - 4}" y2="${boxes[4].cy}" stroke="${GC.teal}" stroke-width="2.5" marker-end="url(#flowArrow)"/>`;

  svg += `\n</svg>`;
  return svg;
}

// ─────────────────────────────────────────────────────────────────────────────
// GRAPH 2: Waterverbruik vergelijking (bar chart)
// ─────────────────────────────────────────────────────────────────────────────
function buildWaterverbruikVergelijking() {
  const maxY = 12000;
  const stepY = 2000;

  const products = [
    { label: "Spijkerbroek", value: 10000 },
    { label: "T-shirt",      value: 2700 },
    { label: "Avocado",      value: 320 },
    { label: "Kop koffie",   value: 140 },
  ];

  const barCount = products.length;
  const barGap = 30;
  const totalGaps = (barCount + 1) * barGap;
  const barWidth = (PW - totalGaps) / barCount;

  let svg = `${svgHead("Waterverbruik per product (liter)")}
  ${gridLinesH(maxY, stepY)}
  ${axes("Product", "Liter water")}
  ${ticksY(maxY, stepY, v => v.toLocaleString("nl-NL"))}`;

  for (let i = 0; i < barCount; i++) {
    const p = products[i];
    const barX = PX + barGap + i * (barWidth + barGap);
    const barTop = mapY(p.value, maxY);
    const barH = PY2 - barTop;

    svg += `
    <rect x="${barX.toFixed(1)}" y="${barTop.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barH.toFixed(1)}" rx="4" fill="${GC.teal}"/>`;

    // Value label on top
    svg += `
    <text x="${(barX + barWidth / 2).toFixed(1)}" y="${(barTop - 8).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="bold" fill="${GC.tealDk}">${p.value.toLocaleString("nl-NL")}</text>`;

    // Product label below x-axis
    svg += `
    <text x="${(barX + barWidth / 2).toFixed(1)}" y="${PY2 + 20}" text-anchor="middle" font-size="11" fill="${GC.label}">${p.label}</text>`;
  }

  // Y-axis base line
  svg += `
  <line x1="${PX}" y1="${PY2}" x2="${PX2}" y2="${PY2}" stroke="${GC.axis}" stroke-width="1"/>`;

  svg += `\n</svg>`;
  return svg;
}

// ─────────────────────────────────────────────────────────────────────────────
// GRAPH 3: Budgetlijn gecombineerd (budget + price change)
// ─────────────────────────────────────────────────────────────────────────────
function buildBudgetlijnGecombineerd() {
  const maxX = 180, maxY = 30;
  const stepX = 30, stepY = 5;

  // Line I (dashed): from (0,20) to (120,0)
  const ix1 = mapX(0, maxX),   iy1 = mapY(20, maxY);
  const ix2 = mapX(120, maxX), iy2 = mapY(0, maxY);

  // Line II (solid): from (0,25) to (180,0)
  const iix1 = mapX(0, maxX),   iiy1 = mapY(25, maxY);
  const iix2 = mapX(180, maxX), iiy2 = mapY(0, maxY);

  // Arrow from midpoint of I to midpoint of II
  const aMidIx = mapX(60, maxX),  aMidIy = mapY(10, maxY);
  const aMidIIx = mapX(90, maxX), aMidIIy = mapY(12.5, maxY);

  return `${svgHead("Budgetlijn: gecombineerde verandering")}
  ${gridLinesH(maxY, stepY)}
  ${gridLinesV(maxX, stepX)}
  ${axes("Goed x (stuks)", "Goed y (stuks)")}
  ${ticksX(maxX, stepX)}
  ${ticksY(maxY, stepY)}

  <!-- Line I (dashed) -->
  <line x1="${ix1}" y1="${iy1}" x2="${ix2}" y2="${iy2}" stroke="${GC.teal}" stroke-width="2" stroke-dasharray="8,4" opacity="0.6"/>
  <text x="${mapX(105, maxX).toFixed(1)}" y="${mapY(3, maxY).toFixed(1)}" font-size="13" fill="${GC.teal}" font-weight="bold" opacity="0.7">I</text>

  <!-- Line II (solid teal) -->
  <line x1="${iix1}" y1="${iiy1}" x2="${iix2}" y2="${iiy2}" stroke="${GC.teal}" stroke-width="2.5"/>
  <text x="${mapX(160, maxX).toFixed(1)}" y="${mapY(5, maxY).toFixed(1)}" font-size="13" fill="${GC.tealDk}" font-weight="bold">II</text>

  <!-- Shift arrow -->
  <line x1="${aMidIx.toFixed(1)}" y1="${aMidIy.toFixed(1)}" x2="${aMidIIx.toFixed(1)}" y2="${aMidIIy.toFixed(1)}" stroke="${GC.tealDk}" stroke-width="2" marker-end="url(#shiftArrow)"/>

  <!-- Note -->
  <text x="${mapX(120, maxX).toFixed(1)}" y="${mapY(22, maxY).toFixed(1)}" font-size="12" fill="${GC.tealDk}" font-style="italic">Budget + prijs verandering</text>

</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// GRAPH 4: Arbeidsmarkt-vacatures (labor-leisure with wage increase)
// ─────────────────────────────────────────────────────────────────────────────
function buildArbeidsmarktVacatures() {
  const maxX = 40, maxY = 720;
  const stepX = 8, stepY = 120;

  // Old wage: 15/hr, 40 hrs max → (40,0) to (0,600)
  const ox1 = mapX(40, maxX), oy1 = mapY(0, maxY);
  const ox2 = mapX(0, maxX),  oy2 = mapY(600, maxY);

  // New wage: 18/hr, 40 hrs max → (40,0) to (0,720)
  const nx1 = mapX(40, maxX), ny1 = mapY(0, maxY);
  const nx2 = mapX(0, maxX),  ny2 = mapY(720, maxY);

  return `${svgHead("Vrije tijd vs. weekinkomen: loonstijging")}
  ${gridLinesH(maxY, stepY)}
  ${gridLinesV(maxX, stepX)}
  ${axes("Vrije tijd (uren/week)", "Weekinkomen (\u20AC)")}
  ${ticksX(maxX, stepX)}
  ${ticksY(maxY, stepY, v => "\u20AC" + v)}

  <!-- Old wage line (dashed) -->
  <line x1="${ox1}" y1="${oy1}" x2="${ox2}" y2="${oy2}" stroke="${GC.teal}" stroke-width="2" stroke-dasharray="8,4" opacity="0.6"/>
  <text x="${mapX(6, maxX).toFixed(1)}" y="${mapY(520, maxY).toFixed(1)}" font-size="12" fill="${GC.teal}" opacity="0.7">\u20AC15/uur</text>

  <!-- New wage line (solid teal) -->
  <line x1="${nx1}" y1="${ny1}" x2="${nx2}" y2="${ny2}" stroke="${GC.teal}" stroke-width="2.5"/>
  <text x="${mapX(6, maxX).toFixed(1)}" y="${mapY(650, maxY).toFixed(1)}" font-size="12" fill="${GC.tealDk}" font-weight="bold">\u20AC18/uur</text>

  <!-- Pivot point at (40, 0) -->
  <circle cx="${ox1}" cy="${oy1}" r="4" fill="${GC.axis}" stroke="white" stroke-width="1.5"/>

  <!-- Wage increase label -->
  <text x="${mapX(22, maxX).toFixed(1)}" y="${mapY(660, maxY).toFixed(1)}" font-size="13" fill="${GC.tealDk}" font-weight="bold">Loonstijging: \u20AC15 \u2192 \u20AC18/uur</text>

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
    { name: "schaarste-samenhang",      builder: buildSchaarseSamenhang },
    { name: "waterverbruik-vergelijking", builder: buildWaterverbruikVergelijking },
    { name: "budgetlijn-gecombineerd",  builder: buildBudgetlijnGecombineerd },
    { name: "arbeidsmarkt-vacatures",   builder: buildArbeidsmarktVacatures },
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
