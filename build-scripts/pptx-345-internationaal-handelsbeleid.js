/**
 * pptx-345-internationaal-handelsbeleid.js — §3.4.5 Internationaal handelsbeleid
 * CREATIVE version — editorial design system.
 *
 * Covers five vaardigheden from the HTML source:
 *   1. Effect invoerrechten op de markt
 *   2. Cournotduopolie met tarief berekenen
 *   3. Surplus voor en na tarief vergelijken
 *   4. Wisselkoersen berekenen
 *   5. Handelsbeleid beoordelen
 */

const {
  PC, SC, T, FONT_SANS, FONT_DISPLAY, FONT_SERIF, FONT_MONO,
  defineMasters, softShadow, tightShadow,
  svgToPng, pngB64, svgData,
  ICON, placeIcon,
  svgHeader, editorialTitle, fixPptxFile, roundtripWithLibreOffice,
} = require("./lib-pptx.js");

const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM SVG SCENES
// ═══════════════════════════════════════════════════════════════════════════

// Opener — world-port silhouette (harbor cranes + container ship)
function svgPortSilhouette() {
  return `${svgHeader(1280, 420, SC.indigoDeep)}
    <!-- stars -->
    ${Array.from({length: 22}, (_, i) => {
      const x = 40 + (i * 113) % 1200, y = 30 + (i * 47) % 140;
      return `<circle cx="${x}" cy="${y}" r="1" fill="#ffffff" opacity="${0.15 + (i % 3) * 0.1}"/>`;
    }).join("")}
    <defs>
      <linearGradient id="portGlow" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${SC.amber}" stop-opacity="0"/>
        <stop offset="1" stop-color="${SC.amber}" stop-opacity="0.35"/>
      </linearGradient>
      <linearGradient id="portWater" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${SC.indigoMid}"/>
        <stop offset="1" stop-color="${SC.indigoDeep}"/>
      </linearGradient>
    </defs>
    <rect x="0" y="220" width="1280" height="60" fill="url(#portGlow)"/>

    <!-- water -->
    <rect x="0" y="300" width="1280" height="120" fill="url(#portWater)"/>
    <path d="M0 318 Q60 310 120 318 T240 318 T360 318 T480 318 T600 318 T720 318 T840 318 T960 318 T1080 318 T1200 318" stroke="${SC.teal}" stroke-width="1.2" fill="none" opacity="0.55"/>
    <path d="M0 340 Q80 334 160 340 T320 340 T480 340 T640 340 T800 340 T960 340 T1120 340" stroke="${SC.teal}" stroke-width="1" fill="none" opacity="0.3"/>

    <!-- container ship -->
    <g transform="translate(520,260)">
      <!-- hull -->
      <path d="M0 40 L240 40 L220 60 L20 60 Z" fill="${SC.indigo}" stroke="${SC.indigoSoft}"/>
      <!-- containers -->
      ${Array.from({length: 10}, (_, i) => {
        const cx = 10 + i * 22, colors = [SC.coral, SC.amber, SC.teal, SC.olive, SC.plum];
        const c = colors[i % colors.length];
        return `<rect x="${cx}" y="18" width="20" height="22" fill="${c}" opacity="0.8" stroke="${SC.indigoDeep}" stroke-width="0.5"/>`;
      }).join("")}
      ${Array.from({length: 8}, (_, i) => {
        const cx = 22 + i * 22, colors = [SC.amber, SC.teal, SC.coral, SC.plum];
        const c = colors[i % colors.length];
        return `<rect x="${cx}" y="0" width="20" height="18" fill="${c}" opacity="0.75" stroke="${SC.indigoDeep}" stroke-width="0.5"/>`;
      }).join("")}
      <!-- bridge -->
      <rect x="180" y="10" width="30" height="30" fill="${SC.chalk}" opacity="0.9"/>
      <rect x="186" y="16" width="4" height="4" fill="${SC.amber}"/>
      <rect x="196" y="16" width="4" height="4" fill="${SC.amber}"/>
    </g>

    <!-- port cranes on right -->
    ${[0, 1, 2].map(i => {
      const x = 900 + i * 90;
      return `
        <line x1="${x}" y1="300" x2="${x}" y2="160" stroke="${SC.indigo}" stroke-width="3"/>
        <line x1="${x - 40}" y1="170" x2="${x + 50}" y2="170" stroke="${SC.indigo}" stroke-width="3"/>
        <line x1="${x - 40}" y1="170" x2="${x}" y2="160" stroke="${SC.indigo}" stroke-width="2"/>
        <line x1="${x + 50}" y1="170" x2="${x + 30}" y2="200" stroke="${SC.indigo}" stroke-width="1.5" stroke-dasharray="3,3"/>
        <rect x="${x + 27}" y="200" width="10" height="8" fill="${SC.coral}"/>
      `;
    }).join("")}

    <!-- flag poles -->
    ${[
      { x: 100, flag: SC.coral },
      { x: 180, flag: SC.teal },
      { x: 260, flag: SC.amber },
    ].map(f => `
      <line x1="${f.x}" y1="220" x2="${f.x}" y2="300" stroke="${SC.indigo}" stroke-width="2"/>
      <rect x="${f.x}" y="222" width="22" height="14" fill="${f.flag}" opacity="0.85"/>
    `).join("")}
  </svg>`;
}

// Vrijhandel vs Protectionisme — balance scale
function svgBalanceOverview() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Tussen open grenzen en eigen bescherming", "HET GROTE DEBAT")}

    <!-- central scale -->
    <g transform="translate(640,360)">
      <!-- base -->
      <rect x="-12" y="140" width="24" height="20" fill="${SC.indigo}"/>
      <rect x="-80" y="158" width="160" height="8" fill="${SC.indigo}"/>
      <!-- pole -->
      <line x1="0" y1="140" x2="0" y2="-50" stroke="${SC.indigo}" stroke-width="6" stroke-linecap="round"/>
      <!-- beam -->
      <line x1="-280" y1="-50" x2="280" y2="-50" stroke="${SC.indigo}" stroke-width="5" stroke-linecap="round"/>
      <!-- pans -->
      <line x1="-280" y1="-50" x2="-320" y2="20" stroke="${SC.indigo}" stroke-width="2"/>
      <line x1="-280" y1="-50" x2="-240" y2="20" stroke="${SC.indigo}" stroke-width="2"/>
      <ellipse cx="-280" cy="28" rx="90" ry="12" fill="${SC.teal}" opacity="0.25"/>
      <path d="M-360 20 Q-280 60 -200 20" fill="${SC.teal}" stroke="${SC.tealDeep}" stroke-width="2"/>

      <line x1="280" y1="-50" x2="240" y2="20" stroke="${SC.indigo}" stroke-width="2"/>
      <line x1="280" y1="-50" x2="320" y2="20" stroke="${SC.indigo}" stroke-width="2"/>
      <ellipse cx="280" cy="28" rx="90" ry="12" fill="${SC.coral}" opacity="0.25"/>
      <path d="M200 20 Q280 60 360 20" fill="${SC.coral}" stroke="${SC.coralDeep}" stroke-width="2"/>

      <!-- pan labels -->
      <text x="-280" y="80" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="24" font-weight="700" fill="${SC.tealDeep}">Vrijhandel</text>
      <text x="-280" y="108" text-anchor="middle" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.smoke}">grenzen open · import &amp; export vrij</text>
      <text x="280" y="80" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="24" font-weight="700" fill="${SC.coralDeep}">Protectionisme</text>
      <text x="280" y="108" text-anchor="middle" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.smoke}">eigen markt beschermen</text>
    </g>

    <!-- left cloud: vrijhandel items -->
    <g transform="translate(120,200)">
      <rect x="0" y="0" width="280" height="180" rx="10" fill="${SC.chalk}" stroke="${SC.teal}" stroke-width="1.5"/>
      <rect x="0" y="0" width="280" height="6" fill="${SC.tealDeep}"/>
      <text x="20" y="40" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.tealDeep}" letter-spacing="3">INSTRUMENTEN</text>
      ${[
        "Handelsverdragen (CETA, EU)",
        "Douane-unie, WTO-afspraken",
        "Lagere invoerheffingen",
        "Geen quota",
      ].map((t, i) => `
        <rect x="22" y="${60 + i * 26}" width="8" height="8" fill="${SC.teal}"/>
        <text x="38" y="${68 + i * 26}" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">${t}</text>
      `).join("")}
    </g>

    <!-- right cloud: protectionisme items -->
    <g transform="translate(880,200)">
      <rect x="0" y="0" width="280" height="180" rx="10" fill="${SC.chalk}" stroke="${SC.coral}" stroke-width="1.5"/>
      <rect x="0" y="0" width="280" height="6" fill="${SC.coralDeep}"/>
      <text x="20" y="40" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.coralDeep}" letter-spacing="3">INSTRUMENTEN</text>
      ${[
        "Invoerheffing (tarief)",
        "Invoerquotum",
        "Subsidie voor binnenland",
        "Wisselkoersmanipulatie",
      ].map((t, i) => `
        <rect x="22" y="${60 + i * 26}" width="8" height="8" fill="${SC.coral}"/>
        <text x="38" y="${68 + i * 26}" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">${t}</text>
      `).join("")}
    </g>

    <!-- bottom insight -->
    <rect x="140" y="580" width="1000" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="160" y="606" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="#ffffff">Handelsbeleid is altijd een keuze tussen welvaart en bescherming.</text>
  </svg>`;
}

// Invoerheffing chart: aanbod shifts up → nieuwe P (hoger), nieuwe Q (lager)
function svgInvoerheffing() {
  const w = 1280, h = 640;
  const px = 140, py = 140, pw = 860, ph = 400;
  const qMax = 60, pMax = 50;
  const qToX = q => px + (q / qMax) * pw;
  const pToY = p => py + ph - (p / pMax) * ph;

  // V: P = 40 - Q    (from q=0,p=40 to q=40,p=0)
  // A: P = Q         (from q=0,p=0 to q=50,p=50)
  // A+t: P = Q + 8   (from q=0,p=8 to q=42,p=50)
  // Old eq: Q=20, P=20
  // New eq: Q+8 = 40-Q → Q = 16, P = 24

  const vx1 = qToX(0),  vy1 = pToY(40), vx2 = qToX(40), vy2 = pToY(0);
  const ax1 = qToX(0),  ay1 = pToY(0),  ax2 = qToX(50), ay2 = pToY(50);
  const atx1 = qToX(0), aty1 = pToY(8), atx2 = qToX(42), aty2 = pToY(50);

  const xOld = qToX(20), yOld = pToY(20);
  const xNew = qToX(16), yNew = pToY(24);
  const yProd = pToY(16); // producent ontvangt P-t = 16

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Invoerheffing — aanbod schuift omhoog met het tarief", "MARKTANALYSE  ·  INVOERHEFFING")}

    <!-- Axes -->
    <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py+ph}" x2="${px+pw+10}" y2="${py+ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <text x="${px - 60}" y="${py + ph/2}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 60}, ${py + ph/2})">Prijs (€)</text>
    <text x="${px + pw/2}" y="${py + ph + 48}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle">Hoeveelheid Q</text>

    <!-- Tax revenue rectangle (Q_new × t) -->
    <rect x="${px}" y="${yNew}" width="${xNew - px}" height="${yProd - yNew}" fill="${SC.amber}" fill-opacity="0.42" stroke="${SC.amberDeep}" stroke-width="1"/>
    <text x="${(px + xNew)/2}" y="${(yNew + yProd)/2 + 5}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.amberDeep}">overheids-</text>
    <text x="${(px + xNew)/2}" y="${(yNew + yProd)/2 + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.amberDeep}">opbrengst</text>

    <!-- Deadweight loss triangle (two pieces, actually one triangle between old and new curves & quantities) -->
    <defs>
      <pattern id="dwl" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="${SC.coralDeep}" stroke-width="1.4"/>
      </pattern>
    </defs>
    <!-- DWL upper triangle: (xNew,yNew) - (xOld,yOld) - (xNew,yOld) on demand side -->
    <polygon points="${xNew},${yNew} ${xOld},${yOld} ${xNew},${yOld}" fill="url(#dwl)" stroke="${SC.coralDeep}" stroke-width="1.2"/>
    <!-- DWL lower triangle: (xNew,yProd) - (xOld,yOld) - (xNew,yOld) on supply side -->
    <polygon points="${xNew},${yProd} ${xOld},${yOld} ${xNew},${yOld}" fill="url(#dwl)" stroke="${SC.coralDeep}" stroke-width="1.2"/>

    <!-- Dashed refs -->
    <line x1="${xOld}" y1="${yOld}" x2="${xOld}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yOld}" x2="${xOld}" y2="${yOld}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xNew}" y1="${yNew}" x2="${xNew}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yNew}" x2="${xNew}" y2="${yNew}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yProd}" x2="${xNew}" y2="${yProd}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>

    <!-- Demand -->
    <line x1="${vx1}" y1="${vy1}" x2="${vx2}" y2="${vy2}" stroke="${SC.indigo}" stroke-width="3"/>
    <text x="${vx2 + 10}" y="${vy2 - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.indigo}">V</text>

    <!-- Original supply (lighter) -->
    <line x1="${ax1}" y1="${ay1}" x2="${ax2}" y2="${ay2}" stroke="${SC.olive}" stroke-width="2.5" stroke-dasharray="8,5" opacity="0.75"/>
    <text x="${ax2 + 6}" y="${ay2 + 6}" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.olive}" opacity="0.85">A</text>

    <!-- Supply after tariff -->
    <line x1="${atx1}" y1="${aty1}" x2="${atx2}" y2="${aty2}" stroke="${SC.coral}" stroke-width="3"/>
    <text x="${atx2 - 70}" y="${aty2 - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.coral}">A + heffing</text>

    <!-- Shift arrow -->
    <g>
      <line x1="${qToX(30)}" y1="${pToY(30)}" x2="${qToX(30)}" y2="${pToY(38)}" stroke="${SC.coralDeep}" stroke-width="2.4" marker-end="url(#ah-coral)"/>
      <text x="${qToX(30) + 12}" y="${pToY(34) + 5}" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.coralDeep}">+ t</text>
    </g>

    <!-- Equilibrium dots -->
    <circle cx="${xOld}" cy="${yOld}" r="8" fill="${SC.olive}" opacity="0.85"/>
    <circle cx="${xNew}" cy="${yNew}" r="8" fill="${SC.coralDeep}"/>

    <!-- Axis labels -->
    <text x="${px - 10}" y="${pToY(40) + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">€40</text>
    <text x="${px - 10}" y="${yNew + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}" font-weight="700">€24</text>
    <text x="${px - 10}" y="${yOld + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">€20</text>
    <text x="${px - 10}" y="${yProd + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">€16</text>

    <text x="${xNew - 6}" y="${py + ph + 22}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}" font-weight="700">Q = 16</text>
    <text x="${xOld + 6}" y="${py + ph + 22}" text-anchor="start" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">Q = 20</text>

    <!-- Annotation: nieuwe evenwichtsprijs -->
    <g>
      <rect x="${xNew + 80}" y="${yNew - 90}" width="260" height="66" rx="10" fill="${SC.indigo}"/>
      <text x="${xNew + 100}" y="${yNew - 62}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.coral}" letter-spacing="2">CONSUMENT BETAALT</text>
      <text x="${xNew + 100}" y="${yNew - 38}" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">€24 (+ €4)</text>
      <line x1="${xNew + 80}" y1="${yNew - 50}" x2="${xNew + 12}" y2="${yNew - 5}" stroke="${SC.indigo}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    </g>

    <!-- Annotation: welvaartsverlies -->
    <g>
      <rect x="${xOld + 80}" y="${yOld - 40}" width="270" height="66" rx="10" fill="${SC.coralDeep}"/>
      <text x="${xOld + 100}" y="${yOld - 12}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="2">WELVAARTSVERLIES</text>
      <text x="${xOld + 100}" y="${yOld + 12}" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="#ffffff">twee driehoeken — CS en PS gaan verloren</text>
      <line x1="${xOld + 80}" y1="${yOld}" x2="${xOld + 10}" y2="${yOld}" stroke="${SC.coralDeep}" stroke-width="1.8" marker-end="url(#ah-coral)"/>
    </g>

    <rect x="140" y="580" width="1000" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="160" y="606" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="#ffffff">De heffing laat het aanbod stijgen — niet de vraag.</text>
  </svg>`;
}

// Winnaars vs verliezers — surplus breakdown voor en na heffing
function svgSurplusBreakdown() {
  const w = 1280, h = 640;
  const px = 160, py = 140, pw = 820, ph = 400;
  const qMax = 60, pMax = 50;
  const qToX = q => px + (q / qMax) * pw;
  const pToY = p => py + ph - (p / pMax) * ph;

  // Same market: V: P=40-Q ; A: P=Q ; A+t: P=Q+8
  // Old: Q=20, P=20 (CS = ½·20·20=200, PS = ½·20·20=200, TS=400)
  // New: Q=16, P=24, Prod ontvangt 16
  //   CS_new = ½·(40-24)·16 = ½·16·16 = 128  (verlies 72)
  //   PS_new = ½·16·16 = 128  (verlies 72)
  //   Gov = 8·16 = 128
  //   TS_new = 128+128+128 = 384  → DWL = 16 = ½·4·4·2? check: DWL = ½·(Qold-Qnew)·t = ½·4·8 = 16 ✓

  const xOld = qToX(20), yOld = pToY(20);
  const xNew = qToX(16), yNew = pToY(24);
  const yProd = pToY(16);
  const y40 = pToY(40);

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Winnaars en verliezers — wie krijgt welk stuk?", "BEDRIJFSECONOMIE  ·  SURPLUSVERDELING")}

    <!-- Axes -->
    <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py+ph}" x2="${px+pw+10}" y2="${py+ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <text x="${px - 60}" y="${py + ph/2}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 60}, ${py + ph/2})">Prijs (€)</text>
    <text x="${px + pw/2}" y="${py + ph + 48}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle">Hoeveelheid Q</text>

    <!-- CS (consumentensurplus na heffing): driehoek boven Pnew tot V -->
    <polygon points="${px},${y40} ${px},${yNew} ${xNew},${yNew}" fill="${SC.teal}" fill-opacity="0.3" stroke="${SC.tealDeep}" stroke-width="1.3"/>
    <text x="${px + (xNew-px)/3}" y="${(y40 + yNew)/2 + 5}" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.tealDeep}">CS</text>

    <!-- PS (producentensurplus na heffing): driehoek tussen A (origine → Q=16, P=€16) en horizontale lijn P=€16 -->
    <polygon points="${px},${py+ph} ${xNew},${yProd} ${px},${yProd}" fill="${SC.olive}" fill-opacity="0.3" stroke="${SC.oliveDeep}" stroke-width="1.3"/>
    <text x="${px + (xNew-px)*0.22}" y="${yProd + (py+ph - yProd)*0.45}" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.oliveDeep}">PS</text>

    <!-- Overheidsinkomsten -->
    <rect x="${px}" y="${yNew}" width="${xNew-px}" height="${yProd-yNew}" fill="${SC.amber}" fill-opacity="0.55" stroke="${SC.amberDeep}" stroke-width="1.3"/>
    <text x="${(px + xNew)/2}" y="${(yNew + yProd)/2 + 5}" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.amberDeep}">Overheid</text>

    <!-- DWL driehoeken -->
    <defs>
      <pattern id="dwlS" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="${SC.coralDeep}" stroke-width="1.4"/>
      </pattern>
    </defs>
    <polygon points="${xNew},${yNew} ${xOld},${yOld} ${xNew},${yOld}" fill="url(#dwlS)" stroke="${SC.coralDeep}" stroke-width="1.2"/>
    <polygon points="${xNew},${yProd} ${xOld},${yOld} ${xNew},${yOld}" fill="url(#dwlS)" stroke="${SC.coralDeep}" stroke-width="1.2"/>

    <!-- Lines -->
    <line x1="${px}" y1="${y40}" x2="${qToX(40)}" y2="${pToY(0)}" stroke="${SC.indigo}" stroke-width="3"/>
    <text x="${qToX(40) + 10}" y="${pToY(0) - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.indigo}">V</text>
    <line x1="${px}" y1="${pToY(0)}" x2="${qToX(50)}" y2="${pToY(50)}" stroke="${SC.olive}" stroke-width="2.3" stroke-dasharray="8,5" opacity="0.7"/>
    <line x1="${px}" y1="${pToY(8)}" x2="${qToX(42)}" y2="${pToY(50)}" stroke="${SC.coral}" stroke-width="3"/>
    <text x="${qToX(42) - 70}" y="${pToY(50) - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.coral}">A + heffing</text>

    <!-- Dots -->
    <circle cx="${xOld}" cy="${yOld}" r="7" fill="${SC.olive}" opacity="0.7"/>
    <circle cx="${xNew}" cy="${yNew}" r="8" fill="${SC.coralDeep}"/>

    <!-- Side callouts -->
    <g transform="translate(1040, 160)">
      <rect x="0" y="0" width="220" height="380" rx="10" fill="${SC.chalk}" stroke="${SC.cloud}" stroke-width="1"/>
      <rect x="0" y="0" width="220" height="6" fill="${SC.indigo}"/>
      <text x="16" y="36" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="3">BALANS</text>
      <text x="16" y="60" font-family="${FONT_DISPLAY}" font-size="16" font-weight="700" fill="${SC.indigo}">Wie wint, wie verliest?</text>
      ${[
        { c: SC.tealDeep, l: "Consument", v: "verliest", arrow: "▼" },
        { c: SC.oliveDeep, l: "Producent binnenland", v: "wint", arrow: "▲" },
        { c: SC.amberDeep, l: "Overheid", v: "wint", arrow: "▲" },
        { c: SC.coralDeep, l: "Totaal (welvaart)", v: "verliest", arrow: "▼" },
      ].map((r, i) => `
        <rect x="12" y="${90 + i * 62}" width="196" height="52" rx="6" fill="${r.c}" fill-opacity="0.08" stroke="${r.c}" stroke-width="1"/>
        <text x="24" y="${112 + i * 62}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${r.c}">${r.arrow}  ${r.l}</text>
        <text x="24" y="${131 + i * 62}" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.ink}">${r.v}</text>
      `).join("")}
    </g>

    <!-- Axis labels -->
    <text x="${px - 10}" y="${y40 + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">€40</text>
    <text x="${px - 10}" y="${yNew + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}" font-weight="700">€24</text>
    <text x="${px - 10}" y="${yProd + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">€16</text>
    <text x="${xNew}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">Q = 16</text>

    <rect x="160" y="580" width="880" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="180" y="606" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="#ffffff">Surplusverlies &gt; belastingopbrengst → doelmatigheid daalt.</text>
  </svg>`;
}

// Argumenten voor/tegen protectionisme — 2-kolom
function svgArgumenten() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Argumenten voor en tegen protectionisme", "HET EVENWICHT")}

    <!-- LEFT: voor -->
    <rect x="80"  y="160" width="560" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.olive}" stroke-width="2"/>
    <rect x="80"  y="160" width="560" height="50" fill="${SC.oliveDeep}" rx="14"/>
    <rect x="80"  y="198" width="560" height="12" fill="${SC.oliveDeep}"/>
    <text x="360" y="192" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Vóór protectionisme</text>
    ${placeIcon(ICON.badge(SC.oliveDeep, SC.amber), 108, 232, 44)}
    <text x="170" y="258" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.ink}">bescherm eigen industrie</text>
    <text x="170" y="282" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">(werk, strategie, opbouw)</text>

    <line x1="108" y1="308" x2="612" y2="308" stroke="${SC.cloud}"/>

    ${[
      ["infant industry", "jonge sector groeit veilig"],
      ["werkgelegenheid", "banen in beschermde sector"],
      ["strategisch belang", "voedsel, wapens, energie"],
      ["oneerlijke concurrentie", "weerwoord op dumping"],
    ].map(([k, v], i) => `
      <text x="108" y="${340 + i * 50}" font-family="${FONT_SANS}" font-size="12" fill="${SC.ash}" letter-spacing="1">${k.toUpperCase()}</text>
      <text x="612" y="${340 + i * 50}" text-anchor="end" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="${SC.oliveDeep}" font-weight="700">${v}</text>
    `).join("")}

    <!-- RIGHT: tegen -->
    <rect x="660" y="160" width="560" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.coral}" stroke-width="2"/>
    <rect x="660" y="160" width="560" height="50" fill="${SC.coralDeep}" rx="14"/>
    <rect x="660" y="198" width="560" height="12" fill="${SC.coralDeep}"/>
    <text x="940" y="192" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Tégen protectionisme</text>
    ${placeIcon(ICON.warning(SC.coralDeep), 688, 232, 44)}
    <text x="750" y="258" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.ink}">welvaart daalt voor het geheel</text>
    <text x="750" y="282" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">(verlies &gt; opbrengst)</text>

    <line x1="688" y1="308" x2="1192" y2="308" stroke="${SC.cloud}"/>

    ${[
      ["welvaartsverlies", "driehoeken in de grafiek"],
      ["consument lijdt", "hogere prijzen, minder keuze"],
      ["retaliation", "buitenland vergeldt met eigen tarief"],
      ["inefficiëntie", "zwakke sector blijft zwak"],
    ].map(([k, v], i) => `
      <text x="688" y="${340 + i * 50}" font-family="${FONT_SANS}" font-size="12" fill="${SC.ash}" letter-spacing="1">${k.toUpperCase()}</text>
      <text x="1192" y="${340 + i * 50}" text-anchor="end" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="${SC.coralDeep}" font-weight="700">${v}</text>
    `).join("")}
  </svg>`;
}

// Wisselkoers grafiek — Q vs prijs van euro in $ (of iets dergelijks)
function svgWisselkoers() {
  const w = 1280, h = 640;
  const px = 150, py = 140, pw = 880, ph = 400;
  // Use the paragraph numbers: Qv = -50p+86, Qa = 25p+17
  //   Old eq: p=0,92; Q=40
  //   New Qa = 25p+20 → p=0,88; Q=?  (=-50·0,88+86 = 42)
  // Scale: x=Q (0..60), y=p (0..1,4)
  const qMax = 60, pMax = 1.4;
  const qToX = q => px + (q / qMax) * pw;
  const pToY = p => py + ph - (p / pMax) * ph;

  // Vraag: Qv = -50p+86 → p(Q) = (86-Q)/50 ; at Q=0 → p=1.72 (out of range), Q=86 → p=0
  //   Clip: p=1.2 → Q=26 ; p=0 → Q=86
  const vx1 = qToX(26), vy1 = pToY(1.2), vx2 = qToX(60), vy2 = pToY(0.52);
  // Aanbod oud: Qa=25p+17 → at p=0 → Q=17, p=1.2 → Q=47
  const ax1 = qToX(17), ay1 = pToY(0), ax2 = qToX(47), ay2 = pToY(1.2);
  // Aanbod nieuw: Qa'=25p+20 → at p=0 → Q=20, p=1.2 → Q=50
  const ax1n = qToX(20), ay1n = pToY(0), ax2n = qToX(50), ay2n = pToY(1.2);

  const xOld = qToX(40),  yOld = pToY(0.92);
  const xNew = qToX(42),  yNew = pToY(0.88);

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Een extra aanbod van euro's laat de koers dalen", "VALUTAMARKT  ·  WISSELKOERS")}

    <!-- Axes -->
    <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py+ph}" x2="${px+pw+10}" y2="${py+ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <text x="${px - 70}" y="${py + ph/2}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 70}, ${py + ph/2})">Koers (€ per $)</text>
    <text x="${px + pw/2}" y="${py + ph + 48}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle">Hoeveelheid euro's (miljard)</text>

    <!-- Demand -->
    <line x1="${vx1}" y1="${vy1}" x2="${vx2}" y2="${vy2}" stroke="${SC.indigo}" stroke-width="3"/>
    <text x="${vx2 + 10}" y="${vy2 + 6}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.indigo}">V</text>

    <!-- Supply oud -->
    <line x1="${ax1}" y1="${ay1}" x2="${ax2}" y2="${ay2}" stroke="${SC.olive}" stroke-width="2.5" stroke-dasharray="8,5" opacity="0.7"/>
    <text x="${ax2 + 6}" y="${ay2 - 10}" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.olive}" opacity="0.8">A (oud)</text>

    <!-- Supply nieuw -->
    <line x1="${ax1n}" y1="${ay1n}" x2="${ax2n}" y2="${ay2n}" stroke="${SC.coral}" stroke-width="3"/>
    <text x="${ax2n + 10}" y="${ay2n + 6}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.coral}">A (nieuw)</text>

    <!-- Shift arrow -->
    <g>
      <line x1="${qToX(30)}" y1="${pToY(0.45)}" x2="${qToX(33)}" y2="${pToY(0.45)}" stroke="${SC.coralDeep}" stroke-width="2.4" marker-end="url(#ah-coral)"/>
      <text x="${qToX(22)}" y="${pToY(0.45) + 5}" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.coralDeep}">+ aanbod</text>
    </g>

    <!-- Dashed refs -->
    <line x1="${xOld}" y1="${yOld}" x2="${xOld}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yOld}" x2="${xOld}" y2="${yOld}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xNew}" y1="${yNew}" x2="${xNew}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yNew}" x2="${xNew}" y2="${yNew}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>

    <!-- Dots -->
    <circle cx="${xOld}" cy="${yOld}" r="8" fill="${SC.olive}" opacity="0.85"/>
    <circle cx="${xNew}" cy="${yNew}" r="8" fill="${SC.coralDeep}"/>

    <!-- Labels -->
    <text x="${px - 10}" y="${yOld + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">0,92</text>
    <text x="${px - 10}" y="${yNew + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}" font-weight="700">0,88</text>
    <text x="${xOld}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">40</text>
    <text x="${xNew}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">42</text>

    <!-- Callout: koersdaling -->
    <g>
      <rect x="${xNew + 60}" y="${yNew + 50}" width="300" height="70" rx="10" fill="${SC.coralDeep}"/>
      <text x="${xNew + 78}" y="${yNew + 78}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="2">KOERSDALING</text>
      <text x="${xNew + 78}" y="${yNew + 102}" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">−4,3 %</text>
      <line x1="${xNew + 60}" y1="${yNew + 70}" x2="${xNew + 10}" y2="${yNew + 5}" stroke="${SC.coralDeep}" stroke-width="1.8" marker-end="url(#ah-coral)"/>
    </g>

    <rect x="150" y="580" width="1000" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="170" y="606" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="#ffffff">Meer aanbod van een munt → lagere koers. Net als elke andere markt.</text>
  </svg>`;
}

// Cournot-duopolie — reactielijnen verschuiven door tarief
function svgCournotTarief() {
  const w = 1280, h = 640;
  const px = 160, py = 140, pw = 820, ph = 400;
  const qMax = 80, qMaxY = 80;
  const xToX = q => px + (q / qMax) * pw;
  const yToY = q => py + ph - (q / qMaxY) * ph;

  // R_VS (binnenland): q_VS = 66.667 - (1/3)·q_China   → op (q_China-as as y): when q_China=0,q_VS=66.67
  // R_China (oud): q_China = 66.667 - (1/3)·q_VS       → when q_VS=0,q_China=66.67
  // R_China (na tarief): q_China = 56 - (1/3)·q_VS
  // Evenwicht oud: (50, 50), nieuw: (54, 38)  (according to HTML)

  // Axis: X = q_VS, Y = q_China
  const RvsX1 = xToX(66.67), RvsY1 = yToY(0);
  const RvsX2 = xToX(0),     RvsY2 = yToY(200); // too high, use slope directly
  // Parametric: q_China=f → q_VS=66.67 - f/3 ; f=0 → (66.67,0) ; f=66.67 → (44.44,66.67)
  const a1x = xToX(66.67), a1y = yToY(0);
  const a2x = xToX(44.44), a2y = yToY(66.67);

  // R_China oud: q_China = 66.67 - q_VS/3 ; q_VS=0→q_China=66.67 ; q_VS=66.67→q_China=44.44
  const b1x = xToX(0),      b1y = yToY(66.67);
  const b2x = xToX(66.67),  b2y = yToY(44.44);

  // R_China na: q_China = 56 - q_VS/3 ; q_VS=0→q_China=56 ; q_VS=66.67→q_China=33.78
  const c1x = xToX(0),      c1y = yToY(56);
  const c2x = xToX(66.67),  c2y = yToY(33.78);

  // Old equilibrium (50,50), new (54, 38)
  const xOld = xToX(50), yOld = yToY(50);
  const xNew = xToX(54), yNew = yToY(38);

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Cournot-duopolie — tarief drukt reactielijn buitenland omlaag", "BEDRIJFSECONOMIE  ·  REACTIELIJNEN")}

    <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py+ph}" x2="${px+pw+10}" y2="${py+ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <text x="${px - 60}" y="${py + ph/2}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 60}, ${py + ph/2})">q_China</text>
    <text x="${px + pw/2}" y="${py + ph + 48}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle">q_VS</text>

    <!-- R_VS (binnenland, ongewijzigd) -->
    <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${SC.indigo}" stroke-width="3"/>
    <text x="${a1x + 10}" y="${a1y - 10}" font-family="${FONT_SANS}" font-size="15" font-weight="700" fill="${SC.indigo}">R_VS</text>

    <!-- R_China oud (gestippeld) -->
    <line x1="${b1x}" y1="${b1y}" x2="${b2x}" y2="${b2y}" stroke="${SC.olive}" stroke-width="2.3" stroke-dasharray="8,5" opacity="0.75"/>
    <text x="${b1x + 6}" y="${b1y - 8}" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.olive}" opacity="0.85">R_China (oud)</text>

    <!-- R_China nieuw -->
    <line x1="${c1x}" y1="${c1y}" x2="${c2x}" y2="${c2y}" stroke="${SC.coral}" stroke-width="3"/>
    <text x="${c1x + 6}" y="${c1y + 20}" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.coral}">R_China (met tarief)</text>

    <!-- Shift arrow -->
    <g>
      <line x1="${xToX(20)}" y1="${yToY(60)}" x2="${xToX(20)}" y2="${yToY(49.33)}" stroke="${SC.coralDeep}" stroke-width="2.4" marker-end="url(#ah-coral)"/>
      <text x="${xToX(20) + 8}" y="${yToY(55)}" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.coralDeep}">shift</text>
    </g>

    <!-- Evenwichten -->
    <line x1="${xOld}" y1="${yOld}" x2="${xOld}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yOld}" x2="${xOld}" y2="${yOld}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xNew}" y1="${yNew}" x2="${xNew}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yNew}" x2="${xNew}" y2="${yNew}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>

    <circle cx="${xOld}" cy="${yOld}" r="8" fill="${SC.olive}" opacity="0.8"/>
    <circle cx="${xNew}" cy="${yNew}" r="8" fill="${SC.coralDeep}"/>

    <text x="${xOld}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">50</text>
    <text x="${xNew}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}" font-weight="700">54</text>
    <text x="${px - 10}" y="${yOld + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">50</text>
    <text x="${px - 10}" y="${yNew + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}" font-weight="700">38</text>

    <!-- Callout -->
    <g>
      <rect x="${xNew + 80}" y="${yNew - 80}" width="280" height="70" rx="10" fill="${SC.indigo}"/>
      <text x="${xNew + 100}" y="${yNew - 52}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.coral}" letter-spacing="2">NA HET TARIEF</text>
      <text x="${xNew + 100}" y="${yNew - 28}" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="#ffffff">VS: 50 → 54  ·  China: 50 → 38</text>
      <line x1="${xNew + 80}" y1="${yNew - 50}" x2="${xNew + 10}" y2="${yNew - 5}" stroke="${SC.indigo}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    </g>

    <rect x="160" y="580" width="880" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="180" y="606" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="#ffffff">Alleen de buitenlandse aanbieder krijgt hogere kosten — dát verklaart de shift.</text>
  </svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE BUILDERS
// ═══════════════════════════════════════════════════════════════════════════
function sectionDivider(pres, { kicker, title, subtitle, notes }) {
  const s = pres.addSlide({ masterName: "DARK_HERO" });
  s.addText(kicker.toUpperCase(), {
    x: 0.6, y: 1.9, w: 8.8, h: 0.4,
    ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6,
  });
  s.addText(title, {
    x: 0.6, y: 2.35, w: 8.8, h: 1.3,
    ...T.heroDark, fontSize: 52, charSpacing: -2,
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.6, y: 3.75, w: 8.8, h: 0.8,
      ...T.subheadDark, fontFace: FONT_SERIF, italic: true, fontSize: 18,
    });
  }
  s.addShape("rect", { x: 0.6, y: 3.55, w: 0.6, h: 0.04, fill: { color: PC.coral } });
  if (notes) s.addNotes(notes);
  return s;
}

function heroStat(pres, { kicker, stat, subtitle, body, notes }) {
  const s = pres.addSlide({ masterName: "DARK_HERO" });
  s.addText(kicker.toUpperCase(), {
    x: 0.6, y: 1.0, w: 8.8, h: 0.35,
    ...T.labelUpper, color: PC.coral, fontSize: 13, charSpacing: 6,
  });
  s.addText(stat, {
    x: 0.3, y: 1.45, w: 9.4, h: 2.4,
    ...T.stat, fontSize: 120, charSpacing: -4, align: "center",
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.6, y: 3.95, w: 8.8, h: 0.5,
      ...T.subheadDark, fontSize: 22, align: "center",
    });
  }
  if (body) {
    s.addText(body, {
      x: 1.5, y: 4.45, w: 7, h: 0.6,
      fontFace: FONT_SERIF, fontSize: 15, italic: true, color: PC.cloud, align: "center",
    });
  }
  if (notes) s.addNotes(notes);
  return s;
}

function editorialSlide(pres, { kicker, title, subtitle, notes }) {
  const s = pres.addSlide({ masterName: "LIGHT_ED" });
  if (kicker) {
    s.addText(kicker.toUpperCase(), {
      x: 0.5, y: 0.3, w: 9, h: 0.3,
      ...T.labelUpper, color: PC.coral, fontSize: 11, charSpacing: 4,
    });
  }
  s.addText(title, {
    x: 0.5, y: 0.6, w: 9, h: 0.8,
    ...T.displayLight, fontSize: 26, charSpacing: -0.5,
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.5, y: 1.35, w: 9, h: 0.4,
      ...T.subheadLight, fontFace: FONT_SERIF, italic: true,
    });
  }
  if (notes) s.addNotes(notes);
  return s;
}

function sidebarSlide(pres, { sidebarKicker, sidebarTitle, sidebarBody, notes }) {
  const s = pres.addSlide({ masterName: "SIDEBAR" });
  s.addText(sidebarKicker.toUpperCase(), {
    x: 0.15, y: 0.4, w: 1.7, h: 0.3,
    ...T.labelUpper, color: PC.coral, fontSize: 10, charSpacing: 3,
  });
  s.addText(sidebarTitle, {
    x: 0.15, y: 0.75, w: 1.7, h: 1.6,
    fontFace: FONT_DISPLAY, fontSize: 16, bold: true, color: PC.chalk, charSpacing: -0.3,
  });
  if (sidebarBody) {
    s.addText(sidebarBody, {
      x: 0.15, y: 2.5, w: 1.7, h: 2,
      fontFace: FONT_SERIF, fontSize: 11, italic: true, color: PC.cloud, lineSpacingMultiple: 1.4,
    });
  }
  if (notes) s.addNotes(notes);
  return s;
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD
// ═══════════════════════════════════════════════════════════════════════════
async function build() {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: "CUSTOM_16x9", width: 10, height: 5.625 });
  pres.layout = "CUSTOM_16x9";
  pres.author = "Economie VWO";
  pres.title = "3.4.5 Internationaal handelsbeleid";

  defineMasters(pres, {
    darkLabel: "PARAGRAAF  ·  §3.4",
    lightLabel: "§ 3.4  ·  INTERNATIONALE MARKTEN",
  });

  const svgs = {
    port:        svgPortSilhouette(),
    balance:     svgBalanceOverview(),
    tariff:      svgInvoerheffing(),
    surplus:     svgSurplusBreakdown(),
    arguments:   svgArgumenten(),
    fx:          svgWisselkoers(),
    cournot:     svgCournotTarief(),
  };
  const imgs = {};
  for (const [k, v] of Object.entries(svgs)) imgs[k] = await svgData(v, 1440);

  // ────────────────────────────────────────────────────────────────────
  // DIA 1 — Cinematic opener: port
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addImage({ data: imgs.port, x: 0, y: 2.4, w: 10, h: 3.28 });

    s.addText("§ 3.4.5", {
      x: 0.6, y: 0.5, w: 4, h: 0.4,
      ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6,
    });
    s.addText("Internationaal handelsbeleid", {
      x: 0.6, y: 0.95, w: 8.8, h: 1.3,
      ...T.heroDark, fontSize: 48, charSpacing: -2,
    });
    s.addText("Hoofdstuk 4 · Internationale markten  ·  Praktische Economie VWO", {
      x: 0.6, y: 2.3, w: 8.8, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.cloud,
    });
    s.addNotes("Rotterdam — de grootste haven van Europa. Elke container hier is internationale handel: geïmporteerd of geëxporteerd. Vandaag: wat gebeurt er als de overheid die handel probeert te sturen?");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 2 — Pull quote opener
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("\u201C", {
      x: 0.6, y: 0.7, w: 2, h: 2,
      fontFace: FONT_SERIF, fontSize: 220, bold: true, color: PC.coral, charSpacing: -5,
    });
    s.addText("Wie wint,\nwie verliest?", {
      x: 1.8, y: 1.4, w: 8, h: 2.6,
      fontFace: FONT_DISPLAY, fontSize: 60, bold: true, color: PC.chalk, charSpacing: -2, lineSpacingMultiple: 1.05,
    });
    s.addText("Als een land zijn eigen industrie beschermt — wie betaalt dan de rekening?", {
      x: 1.8, y: 4.3, w: 8, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.amber,
    });
    s.addNotes("Denkvraag. Laat hem even hangen. De hele paragraaf draait om deze afweging.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 3 — Leerdoelen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = sidebarSlide(pres, {
      sidebarKicker: "Wat ga je leren",
      sidebarTitle: "Vier vaardigheden",
      sidebarBody: "Na deze paragraaf kun je handelsbeleid met grafiek, berekening én perspectief beoordelen.",
    });
    const doelen = [
      { n: "01", t: "Effect van invoerrechten op de markt beschrijven" },
      { n: "02", t: "Surplus voor en na tarief vergelijken" },
      { n: "03", t: "Wisselkoers berekenen via vraag en aanbod" },
      { n: "04", t: "Handelsbeleid beoordelen vanuit meerdere perspectieven" },
    ];
    doelen.forEach((d, i) => {
      const y = 0.6 + i * 0.88;
      s.addText(d.n, {
        x: 2.25, y, w: 1.1, h: 0.7,
        fontFace: FONT_DISPLAY, fontSize: 34, bold: true, color: PC.coral, charSpacing: -1,
      });
      s.addText(d.t, {
        x: 3.4, y: y + 0.1, w: 6.3, h: 0.7,
        fontFace: FONT_SANS, fontSize: 18, color: PC.ink, valign: "middle",
      });
      if (i < doelen.length - 1) {
        s.addShape("rect", { x: 2.25, y: y + 0.78, w: 7.5, h: 0.01, fill: { color: PC.cloud } });
      }
    });
    s.addNotes("Vier leerdoelen. Elk leerdoel komt terug in een oefening. Twee van de vier vragen om een grafiek.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 4 — Section: VRIJHANDEL VS PROTECTIONISME
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 1",
    title: "Open of gesloten grenzen?",
    subtitle: "Vrijhandel, protectionisme, en wat ertussen zit.",
    notes: "Het theoretische kader. Twee uitersten, vier instrumenten per kant. Vandaag focus op één instrument: het tarief.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 5 — Balans overview (image)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.balance, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("De weegschaal: in werkelijkheid mengen alle landen beide kanten. De EU heeft bijvoorbeeld vrijhandel binnen, invoertarief daarbuiten.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 6 — Definitie: vrijhandel vs protectionisme (split)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Begrip · handelsbeleid",
      title: "Twee kanten van één medaille.",
      notes: "Definitie strak. Vrijhandel = geen barrières. Protectionisme = barrières om eigen markt te beschermen. Let op: doel ≠ gevolg.",
    });

    // LEFT: vrijhandel
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.chalk }, line: { color: PC.cloud, width: 0.75 } });
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 0.08, fill: { color: PC.teal } });
    s.addText("VRIJHANDEL", {
      x: 0.75, y: 2.2, w: 3.9, h: 0.3,
      ...T.labelUpper, color: PC.tealDeep, fontSize: 12, charSpacing: 4,
    });
    s.addText("Grenzen open voor goederen", {
      x: 0.75, y: 2.55, w: 3.9, h: 0.5,
      fontFace: FONT_DISPLAY, fontSize: 20, bold: true, color: PC.indigo, charSpacing: -0.5,
    });
    [
      "Geen (of lage) invoerheffingen",
      "Geen quota's of verboden",
      "Handelsverdragen verlagen barrières",
      "WTO, EU, CETA als voorbeeld",
    ].forEach((t, i) => {
      s.addShape("rect", { x: 0.9, y: 3.2 + i * 0.4, w: 0.12, h: 0.12, fill: { color: PC.teal } });
      s.addText(t, {
        x: 1.1, y: 3.13 + i * 0.4, w: 3.7, h: 0.35,
        fontFace: FONT_SANS, fontSize: 14, color: PC.ink, valign: "middle",
      });
    });

    // RIGHT: protectionisme
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.chalk }, line: { color: PC.cloud, width: 0.75 } });
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 0.08, fill: { color: PC.coral } });
    s.addText("PROTECTIONISME", {
      x: 5.35, y: 2.2, w: 3.9, h: 0.3,
      ...T.labelUpper, color: PC.coralDeep, fontSize: 12, charSpacing: 4,
    });
    s.addText("Eigen markt afschermen", {
      x: 5.35, y: 2.55, w: 3.9, h: 0.5,
      fontFace: FONT_DISPLAY, fontSize: 20, bold: true, color: PC.indigo, charSpacing: -0.5,
    });
    [
      "Invoerheffing (tarief) op import",
      "Invoerquotum: max. hoeveelheid",
      "Subsidie voor binnenlandse sector",
      "Wisselkoersmanipulatie",
    ].forEach((t, i) => {
      s.addShape("ellipse", { x: 5.5, y: 3.2 + i * 0.4, w: 0.12, h: 0.12, fill: { color: PC.coral } });
      s.addText(t, {
        x: 5.7, y: 3.13 + i * 0.4, w: 3.7, h: 0.35,
        fontFace: FONT_SANS, fontSize: 14, color: PC.ink, valign: "middle",
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 7 — Section: INVOERHEFFING
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 2",
    title: "Het tarief",
    subtitle: "Wat gebeurt er op de markt als de overheid €8 per geïmporteerd product heft?",
    notes: "Nu de grafiek. Eerst conceptueel: wat schuift, waarheen en waarom.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 8 — Mechanisme: keten
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Concept 01",
      title: "Invoerheffing — een belasting op geïmporteerde goederen.",
      subtitle: "Het aanbod schuift omhoog met het tarief, niet de vraag.",
      notes: "Dé klassieke misconceptie: 'de vraag daalt'. Fout. De vraag blijft gelijk. Het aanbod verschuift: produceren kost €8 meer per eenheid.",
    });
    const chain = [
      { t: "Overheid\nheft tarief t",           col: PC.indigo,    emph: false },
      { t: "Kosten van\nimport stijgen",        col: PC.amberDeep, emph: false },
      { t: "Aanbod\nschuift omhoog",            col: PC.coral,     emph: true  },
      { t: "Prijs stijgt,\nhoeveelheid daalt",  col: PC.coralDeep, emph: false },
      { t: "Welvaarts-\nverlies",                col: PC.indigoDeep,emph: true  },
    ];
    const n = chain.length, w = 1.65, gap = 0.12, startX = 0.4, y = 2.3, h = 1.7;
    chain.forEach((c, i) => {
      const x = startX + i * (w + gap);
      s.addShape("rect", { x, y, w, h,
        fill: { color: c.emph ? c.col : PC.chalk },
        line: { color: c.col, width: 2 } });
      s.addText(c.t, {
        x: x + 0.1, y: y + 0.15, w: w - 0.2, h: h - 0.3,
        fontFace: FONT_DISPLAY, fontSize: 15, bold: true,
        color: c.emph ? PC.chalk : c.col,
        align: "center", valign: "middle", lineSpacingMultiple: 1.2,
      });
      if (i < n - 1) {
        s.addText("→", {
          x: x + w - 0.05, y: y + h/2 - 0.2, w: 0.25, h: 0.4,
          fontFace: FONT_SANS, fontSize: 22, bold: true, color: PC.ash, align: "center",
        });
      }
    });
    s.addShape("rect", { x: 0.4, y: 4.3, w: 9.2, h: 0.75, fill: { color: PC.indigoDeep } });
    s.addText([
      { text: "VOORBEELD  ·  ", options: { bold: true, color: PC.amber, fontSize: 11, charSpacing: 3 } },
      { text: "VS heft €32 per Chinese zonnepaneel. Prijs stijgt van €100 naar €108, q_China daalt van 50 naar 38.",
        options: { color: PC.chalk, fontSize: 13, fontFace: FONT_SERIF, italic: true } },
    ], {
      x: 0.6, y: 4.35, w: 8.8, h: 0.65, valign: "middle",
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 9 — Grafiek: invoerheffing (SVG)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.tariff, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Wijs aan. Oud evenwicht: P=€20, Q=20. Na tarief van €8: P stijgt naar €24 (+€4), Q daalt naar 16. Producent ontvangt slechts €16. Geel blok = overheidsopbrengst (€8 × 16 = €128). Twee driehoekjes = welvaartsverlies (samen €16).");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 10 — Stat-slide: doorwerking
  // ────────────────────────────────────────────────────────────────────
  heroStat(pres, {
    kicker: "VS · 2018 · TRUMP-TARIEVEN",
    stat: "€32",
    subtitle: "heffing per geïmporteerd zonnepaneel",
    body: "\u201C… met als gevolg: prijs +€8 voor de Amerikaanse consument, −12 eenheden van China.\u201D",
    notes: "Concrete casus. De tarieven van 2018 waren reëel. Laat klas inschatten: wie betaalde uiteindelijk die €32? Antwoord: deels consument (€8), deels producent via lagere prijs (€4), deels verloren als DWL.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 11 — Section: WINNAARS EN VERLIEZERS
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 3",
    title: "De rekening verdelen",
    subtitle: "CS, PS, overheidsinkomsten en welvaartsverlies — wie krijgt wat?",
    notes: "Brug van grafiek naar surplusverdeling. Vier vlakken: CS (teal), PS (olive), overheid (amber), DWL (coral).",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 12 — Grafiek: surplus breakdown
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.surplus, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Lees per gebied af. CS = driehoek boven €24. PS = driehoek onder €16. Overheid = rechthoek €8 × 16. Gehatchte driehoeken = welvaartsverlies. Sommeer: voor tarief TS=400. Na tarief TS=384 (CS+PS+Gov). Dus DWL=16.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 13 — Berekening surplus (worked example)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Berekening",
      title: "Surplus vóór en ná — het rekenvoorbeeld.",
      subtitle: "Getallen uit het HTML-voorbeeld: V: p = 200 − Q, TK = 100 + ½q².",
      notes: "Stap voor stap. Laat leerlingen het verschil TS_voor − TS_na vergelijken met belastingopbrengst. Surplusverlies > opbrengst → doelmatigheid daalt.",
    });

    // Two columns: voor / na
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.sky }, line: { color: PC.cloud, width: 0.75 } });
    s.addText("VÓÓR HET TARIEF", {
      x: 0.7, y: 2.15, w: 3.8, h: 0.3,
      ...T.labelUpper, color: PC.indigo, fontSize: 11, charSpacing: 3,
    });
    s.addText([
      { text: "CS", options: { bold: true, color: PC.indigo } },
      { text: "   = 5.000\n", options: {} },
      { text: "PS", options: { bold: true, color: PC.indigo } },
      { text: "   = 7.500\n", options: {} },
      { text: "TS", options: { bold: true, color: PC.indigoDeep } },
      { text: "   = 12.500", options: { bold: true } },
    ], {
      x: 0.7, y: 2.5, w: 3.8, h: 2.4,
      fontFace: FONT_MONO, fontSize: 22, color: PC.ink, lineSpacingMultiple: 1.5,
    });

    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.coral }, fillOpacity: 0.1, line: { color: PC.coral, width: 0.75 } });
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: "FCECE9" }, line: { color: PC.coral, width: 0.75 } });
    s.addText("NÁ HET TARIEF", {
      x: 5.3, y: 2.15, w: 3.8, h: 0.3,
      ...T.labelUpper, color: PC.coralDeep, fontSize: 11, charSpacing: 3,
    });
    s.addText([
      { text: "CS", options: { bold: true, color: PC.coralDeep } },
      { text: "   = 4.232\n", options: {} },
      { text: "PS", options: { bold: true, color: PC.coralDeep } },
      { text: "   = 6.540\n", options: {} },
      { text: "Gov", options: { bold: true, color: PC.amberDeep } },
      { text: " = 1.216\n", options: {} },
      { text: "TS", options: { bold: true, color: PC.coralDeep } },
      { text: "   = 10.772", options: { bold: true } },
    ], {
      x: 5.3, y: 2.5, w: 4, h: 2.4,
      fontFace: FONT_MONO, fontSize: 19, color: PC.ink, lineSpacingMultiple: 1.4,
    });

    // Bottom conclusion
    s.addShape("rect", { x: 0.5, y: 5.18, w: 9, h: 0.4, fill: { color: PC.indigoDeep } });
    s.addText([
      { text: "Surplusverlies 1.728  >  belastingopbrengst 1.216  ", options: { color: PC.chalk, bold: true, fontSize: 14 } },
      { text: "→  doelmatigheid daalt", options: { color: PC.amber, italic: true, fontFace: FONT_SERIF, fontSize: 14 } },
    ], {
      x: 0.6, y: 5.18, w: 8.8, h: 0.4, valign: "middle",
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // Section: WISSELKOERS
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 4",
    title: "De valutamarkt",
    subtitle: "Wisselkoersen worden bepaald door vraag en aanbod — net als een gewone markt.",
    notes: "Koppel dit aan de vorige grafiek: dezelfde V-A-logica, andere context. Hier is 'Q' de hoeveelheid euro's en 'P' de koers.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 18 — Wisselkoers grafiek
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.fx, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Vraag Qv = −50p + 86, aanbod Qa = 25p + 17. Oud evenwicht: p = 0,92, Q = 40 miljard. Extra aanbod (+3): Qa' = 25p + 20 → p = 0,88. Koersdaling = (0,88 − 0,92)/0,92 = −4,3 %.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 19 — Wisselkoersmanipulatie
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Concept 02",
      title: "Wisselkoersmanipulatie.",
      subtitle: "De munt kunstmatig laag houden — zo wordt export goedkoper.",
      notes: "China werd jarenlang beschuldigd van koersmanipulatie. Let op de nuance: de importerende consument profiteert wél (goedkoper). Dus twee perspectieven — altijd.",
    });

    // Visual: causal chain
    const chain = [
      { t: "Overheid\ndrukt munt\nomlaag",     col: PC.indigo,    emph: false },
      { t: "Export\nwordt\ngoedkoper",          col: PC.teal,      emph: false },
      { t: "Buitenlandse\nproducenten\nverliezen", col: PC.coralDeep, emph: true  },
      { t: "Import-\nconsumenten\nprofiteren",     col: PC.tealDeep,  emph: true  },
    ];
    const n = chain.length, w = 2.1, gap = 0.15, startX = 0.5, y = 2.3, h = 2.2;
    chain.forEach((c, i) => {
      const x = startX + i * (w + gap);
      s.addShape("rect", { x, y, w, h,
        fill: { color: c.emph ? c.col : PC.chalk },
        line: { color: c.col, width: 2 } });
      s.addText(c.t, {
        x: x + 0.1, y: y + 0.15, w: w - 0.2, h: h - 0.3,
        fontFace: FONT_DISPLAY, fontSize: 16, bold: true,
        color: c.emph ? PC.chalk : c.col,
        align: "center", valign: "middle", lineSpacingMultiple: 1.2,
      });
      if (i < n - 1) {
        s.addText("→", {
          x: x + w - 0.05, y: y + h/2 - 0.2, w: 0.25, h: 0.4,
          fontFace: FONT_SANS, fontSize: 22, bold: true, color: PC.ash, align: "center",
        });
      }
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 20 — Section: BEOORDELEN
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 5",
    title: "Goed of slecht?",
    subtitle: "Argumenten voor en tegen — altijd meerdere perspectieven.",
    notes: "Evaluatievragen op de toets vragen om twee perspectieven. Noem altijd producent én consument, of binnenland én buitenland.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 21 — Argumenten (image)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.arguments, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Vier vs vier. Laat leerlingen bij elke casus twee kanten noemen. Welk argument woog het zwaarst bij de Trump-tarieven? (werkgelegenheid en strategisch belang). Welk tegenargument bleek waar? (retaliation van China).");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 22 — Valkuilen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Denkfouten",
      title: "Drie valkuilen die bij de toets altijd terugkomen.",
      notes: "Benadruk elk: dit zijn de klassieke fouten. Wie ze kent, struikelt er niet meer over.",
    });
    const items = [
      { num: "01", claim: "Invoerrechten beschermen de consument",
        truth: "Onjuist! Invoerrechten beschermen de binnenlandse producent. De consument betaalt juist méér." },
      { num: "02", claim: "Een invoerheffing verschuift de vraagcurve",
        truth: "Onjuist! Een invoerheffing verhoogt de kosten van aanbieders — dus schuift de aanbodcurve omhoog, niet de vraagcurve." },
      { num: "03", claim: "Wisselkoersmanipulatie is altijd slecht",
        truth: "Genuanceerd. Buitenlandse producenten lijden, maar importconsumenten profiteren van lagere prijzen." },
    ];
    items.forEach((it, i) => {
      const y = 2.05 + i * 1.02;
      s.addShape("rect", { x: 0.5, y, w: 9, h: 0.95,
        fill: { color: PC.chalk }, line: { color: PC.coral, width: 1 } });
      s.addShape("rect", { x: 0.5, y, w: 0.08, h: 0.95, fill: { color: PC.coral } });
      s.addText(it.num, {
        x: 0.65, y: y + 0.15, w: 0.9, h: 0.6,
        fontFace: FONT_DISPLAY, fontSize: 26, bold: true, color: PC.coral, charSpacing: -0.5,
      });
      s.addText([
        { text: "\u201C" + it.claim + "\u201D", options: { fontFace: FONT_SERIF, fontSize: 14, italic: true, color: PC.coralDeep, bold: true, breakLine: true } },
        { text: it.truth, options: { fontFace: FONT_SANS, fontSize: 12, color: PC.ink } },
      ], {
        x: 1.65, y: y + 0.1, w: 7.8, h: 0.8,
        lineSpacingMultiple: 1.3, valign: "top",
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 23 — Closing: samenvatting
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("De kern", {
      x: 0.6, y: 0.5, w: 8.8, h: 0.4,
      ...T.labelUpper, color: PC.coral, fontSize: 13, charSpacing: 6,
    });
    s.addText("Vier dingen om te onthouden", {
      x: 0.6, y: 0.9, w: 8.8, h: 0.8,
      ...T.headlineDark, fontSize: 30, charSpacing: -1,
    });
    const items = [
      { n: "01", t: "Invoerheffing schuift A omhoog → P↑, Q↓, CS↓, PS binnenland↑" },
      { n: "02", t: "Surplusverlies > belastingopbrengst → doelmatigheid daalt" },
      { n: "03", t: "Wisselkoers: extra aanbod van een munt → koers daalt" },
      { n: "04", t: "Beoordelen = altijd twee perspectieven noemen" },
    ];
    items.forEach((it, i) => {
      const y = 2.0 + i * 0.58;
      s.addText(it.n, {
        x: 0.6, y, w: 0.7, h: 0.5,
        fontFace: FONT_DISPLAY, fontSize: 22, bold: true, color: PC.coral, charSpacing: -1,
      });
      s.addText(it.t, {
        x: 1.3, y: y + 0.05, w: 8.2, h: 0.5,
        fontFace: FONT_SANS, fontSize: 15, color: PC.chalk, valign: "middle",
      });
      if (i < items.length - 1) {
        s.addShape("rect", { x: 0.6, y: y + 0.54, w: 8.8, h: 0.005, fill: { color: PC.indigoSoft } });
      }
    });
    s.addNotes("Retrieval: laat leerlingen de 5 punten zonder dia uitleggen. Wie struikelt gaat terug naar dat concept.");
  }

  // ────────────────────────────────────────────────────────────────────
  // OUTPUT
  // ────────────────────────────────────────────────────────────────────
  const outDir = path.resolve(__dirname, "../output/3.4.5");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const svgDir = path.join(outDir, "svg");
  if (!fs.existsSync(svgDir)) fs.mkdirSync(svgDir, { recursive: true });
  for (const [k, v] of Object.entries(svgs)) {
    fs.writeFileSync(path.join(svgDir, `345-${k}.svg`), v, "utf8");
  }

  const outPath = path.join(outDir, "3.4.5 Internationaal handelsbeleid – presentatie.pptx");
  await pres.writeFile({ fileName: outPath });
  const fix = await fixPptxFile(outPath);
  roundtripWithLibreOffice(outPath);
  console.log(`PPTX written to ${outPath} (fix: -${fix.removedOverrides} phantom overrides, -${fix.removedEmptyDirs} empty dirs; roundtripped via LibreOffice)`);
}

build().catch(e => { console.error(e); process.exit(1); });
