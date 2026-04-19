/**
 * pptx-331-creative.js — §3.3.1 De rol van de overheid
 * CREATIVE/UNRESTRICTED version — editorial design system, rich illustration.
 */

const {
  PC, SC, T, FONT_SANS, FONT_DISPLAY, FONT_SERIF,
  defineMasters, softShadow, tightShadow,
  svgToPng, pngB64, svgData,
  ICON, placeIcon,
  svgHeader, editorialTitle, fixPptxFile, roundtripWithLibreOffice,
} = require("./lib-pptx.js");

const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM SVG SCENES + ANNOTATED CHARTS
// ═══════════════════════════════════════════════════════════════════════════

// Opening visual — stylized Dutch landscape silhouette (dike + water + buildings)
function svgCoastlineSilhouette() {
  return `${svgHeader(1280, 420, SC.indigoDeep)}
    <!-- stars / sparse light points -->
    ${Array.from({length: 20}, (_, i) => {
      const x = 60 + (i * 127) % 1200, y = 40 + (i * 59) % 150;
      return `<circle cx="${x}" cy="${y}" r="1" fill="#ffffff" opacity="${0.15 + (i % 3) * 0.1}"/>`;
    }).join("")}

    <!-- distant horizon glow -->
    <defs>
      <linearGradient id="glow" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${SC.coral}" stop-opacity="0"/>
        <stop offset="1" stop-color="${SC.coral}" stop-opacity="0.35"/>
      </linearGradient>
      <linearGradient id="waterG" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${SC.indigoMid}"/>
        <stop offset="1" stop-color="${SC.indigoDeep}"/>
      </linearGradient>
    </defs>
    <rect x="0" y="220" width="1280" height="60" fill="url(#glow)"/>

    <!-- water -->
    <rect x="0" y="280" width="1280" height="140" fill="url(#waterG)"/>
    <path d="M0 296 Q60 288 120 296 T240 296 T360 296 T480 296 T600 296 T720 296 T840 296 T960 296 T1080 296 T1200 296" stroke="${SC.teal}" stroke-width="1.2" fill="none" opacity="0.6"/>
    <path d="M0 312 Q80 306 160 312 T320 312 T480 312 T640 312 T800 312 T960 312 T1120 312" stroke="${SC.teal}" stroke-width="1" fill="none" opacity="0.35"/>

    <!-- dike silhouette (flat) -->
    <path d="M0 280 L0 260 L200 250 L220 242 L280 244 L300 238 L380 240 L400 244 L420 240 L460 242 L490 238 L520 240 L560 236 L580 240 L640 242 L680 236 L720 240 L760 238 L800 240 L840 244 L890 240 L940 244 L980 242 L1030 238 L1080 242 L1130 240 L1280 250 L1280 280 Z"
          fill="${SC.indigoDeep}" stroke="${SC.indigo}" stroke-width="1"/>

    <!-- distant city skyline (tiny rectangles) -->
    ${Array.from({length: 16}, (_, i) => {
      const x = 350 + i * 30, h = 6 + (i * 37) % 18, y = 244 - h;
      return `<rect x="${x}" y="${y}" width="22" height="${h}" fill="${SC.indigo}" opacity="0.8"/>
              <rect x="${x + 6}" y="${y + 3}" width="2" height="2" fill="${SC.amber}" opacity="0.7"/>`;
    }).join("")}

    <!-- church tower / landmark -->
    <rect x="640" y="216" width="14" height="28" fill="${SC.indigo}"/>
    <polygon points="640,216 647,206 654,216" fill="${SC.indigo}"/>
    <rect x="645" y="218" width="4" height="6" fill="${SC.amber}" opacity="0.8"/>

    <!-- windmill on the right -->
    <rect x="1100" y="220" width="6" height="30" fill="${SC.indigo}"/>
    <polygon points="1103,220 1098,196 1108,198" fill="${SC.indigo}"/>
    <g transform="translate(1103,220) rotate(28)">
      <rect x="-1" y="-36" width="2" height="36" fill="${SC.indigo}"/>
      <rect x="-1" y="0" width="2" height="36" fill="${SC.indigo}"/>
      <rect x="-36" y="-1" width="36" height="2" fill="${SC.indigo}"/>
      <rect x="0" y="-1" width="36" height="2" fill="${SC.indigo}"/>
    </g>
  </svg>`;
}

// Redesigned marktfalen typology — editorial, with icons
function svgMarktfalenTypo() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Drie oorzaken van marktfalen — drie overheidsingrepen", "OVERZICHT")}

    <!-- Three-row layout: each row = oorzaak → mechanisme → instrument -->
    ${[
      { y: 170, icon: ICON.smokestack(SC.coralDeep, SC.smoke), title: "Monopolie / machtspositie", mech: "te weinig concurrentie", instr: "Mededingingsbeleid", instrSub: "ACM · Europese Commissie · boetes", col: SC.coral },
      { y: 325, icon: ICON.factory(SC.amberDeep),              title: "Externe effecten",           mech: "baten/kosten buiten de prijs", instr: "Belasting of subsidie", instrSub: "internaliseren van het effect", col: SC.amber },
      { y: 480, icon: ICON.badge(SC.oliveDeep, SC.coral),      title: "Collectieve goederen",        mech: "markt levert het niet", instr: "Overheid levert zelf", instrSub: "defensie, dijken, politie", col: SC.olive },
    ].map(r => `
      <!-- icon tile -->
      <rect x="80" y="${r.y}" width="120" height="120" rx="12" fill="${r.col}" fill-opacity="0.14" stroke="${r.col}" stroke-width="1.5"/>
      ${placeIcon(r.icon, 108, r.y + 28, 64)}

      <!-- oorzaak title + mechanisme -->
      <text x="230" y="${r.y + 38}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">OORZAAK</text>
      <text x="230" y="${r.y + 68}" font-family="${FONT_SANS}" font-size="24" font-weight="700" fill="${SC.indigo}">${r.title}</text>
      <text x="230" y="${r.y + 100}" font-family="${FONT_SERIF}" font-size="18" font-style="italic" fill="${SC.smoke}">${r.mech}</text>

      <!-- big arrow -->
      <g transform="translate(700,${r.y + 48})">
        <line x1="0" y1="24" x2="100" y2="24" stroke="${r.col}" stroke-width="3" stroke-linecap="round"/>
        <polyline points="88,10 100,24 88,38" fill="none" stroke="${r.col}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </g>

      <!-- instrument card -->
      <rect x="830" y="${r.y + 20}" width="370" height="82" rx="10" fill="${SC.paper}" stroke="${r.col}" stroke-width="2"/>
      <rect x="830" y="${r.y + 20}" width="8" height="82" fill="${r.col}"/>
      <text x="855" y="${r.y + 48}" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="2">OVERHEIDSINGREEP</text>
      <text x="855" y="${r.y + 76}" font-family="${FONT_SANS}" font-size="22" font-weight="700" fill="${SC.indigo}">${r.instr}</text>
      <text x="855" y="${r.y + 96}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">${r.instrSub}</text>
    `).join("")}
  </svg>`;
}

// Natural monopoly GTK — annotated editorial style
function svgNatMonAnnotated() {
  const w = 1280, h = 640;
  const px = 140, py = 140, pw = 860, ph = 400;
  const qMax = 140, pMax = 14;
  const qToX = q => px + (q / qMax) * pw;
  const pToY = p => py + ph - (p / pMax) * ph;

  // GTK(Q) = 200/Q + 2 — sample
  const pts = [];
  for (let Q = 10; Q <= 140; Q += 1) pts.push(`${qToX(Q).toFixed(1)},${pToY(200/Q + 2).toFixed(1)}`);

  const xA = qToX(100), yA = pToY(4);
  const xB = qToX(50),  yB = pToY(6);

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Eén aanbieder produceert goedkoper dan twee", "NATUURLIJK MONOPOLIE")}

    <!-- Axes -->
    <line x1="${px}" y1="${py + ph}" x2="${px}" y2="${py - 10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py + ph}" x2="${px + pw + 10}" y2="${py + ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <text x="${px - 50}" y="${py + ph/2}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 50}, ${py + ph/2})">GTK (€ per eenheid)</text>
    <text x="${px + pw/2}" y="${py + ph + 48}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle">Productiehoeveelheid Q</text>

    <!-- GTK curve -->
    <polyline points="${pts.join(" ")}" fill="none" stroke="${SC.coral}" stroke-width="3"/>
    <text x="${px + pw - 50}" y="${pToY(200/140 + 2) - 16}" font-family="${FONT_SANS}" font-size="15" font-weight="700" fill="${SC.coral}">GTK</text>

    <!-- Dashed references + dots -->
    <line x1="${xB}" y1="${yB}" x2="${xB}" y2="${py + ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yB}" x2="${xB}" y2="${yB}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xA}" y1="${yA}" x2="${xA}" y2="${py + ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yA}" x2="${xA}" y2="${yA}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>

    <circle cx="${xB}" cy="${yB}" r="8" fill="${SC.coralDeep}"/>
    <circle cx="${xB}" cy="${yB}" r="14" fill="none" stroke="${SC.coralDeep}" stroke-width="2" opacity="0.45"/>

    <circle cx="${xA}" cy="${yA}" r="8" fill="${SC.indigo}"/>
    <circle cx="${xA}" cy="${yA}" r="14" fill="none" stroke="${SC.indigo}" stroke-width="2" opacity="0.45"/>

    <!-- Axis value labels -->
    <text x="${px - 10}" y="${yB + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}" font-weight="600">€6</text>
    <text x="${px - 10}" y="${yA + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}" font-weight="600">€4</text>
    <text x="${xB}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">Q = 50</text>
    <text x="${xA}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">Q = 100</text>

    <!-- Callout 1: 2 bedrijven (linkerkant) -->
    <g>
      <rect x="540" y="180" width="280" height="68" rx="10" fill="${SC.coralDeep}" stroke="${SC.coralDeep}"/>
      <text x="560" y="206" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.coral}" letter-spacing="2" opacity="0.85">2 BEDRIJVEN, ELK Q = 50</text>
      <text x="560" y="236" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">GTK = €6 per eenheid</text>
      <line x1="540" y1="220" x2="${xB + 15}" y2="${yB - 5}" stroke="${SC.coralDeep}" stroke-width="2"/>
    </g>

    <!-- Callout 2: 1 bedrijf (rechterkant) -->
    <g>
      <rect x="${xA + 60}" y="270" width="280" height="68" rx="10" fill="${SC.indigo}"/>
      <text x="${xA + 80}" y="296" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.teal}" letter-spacing="2">1 BEDRIJF, Q = 100</text>
      <text x="${xA + 80}" y="326" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">GTK = €4 per eenheid</text>
      <line x1="${xA + 60}" y1="300" x2="${xA + 15}" y2="${yA + 5}" stroke="${SC.indigo}" stroke-width="2"/>
    </g>

    <!-- Footer insight -->
    <rect x="140" y="580" width="1000" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="160" y="606" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="#ffffff">Hoe meer productie, hoe lager de gemiddelde kosten — dát is een natuurlijk monopolie.</text>
  </svg>`;
}

// Negative externality chart — FT-style annotated
function svgNegExtAnnotated() {
  const w = 1280, h = 640;
  const px = 140, py = 140, pw = 860, ph = 400;
  const qMax = 55, pMax = 55;
  const qToX = q => px + (q / qMax) * pw;
  const pToY = p => py + ph - (p / pMax) * ph;

  // V: P = 50 - Q ; MPK: P = Q ; MMK: P = Q + 10
  const v1x = qToX(0), v1y = pToY(50), v2x = qToX(50), v2y = pToY(0);
  const s1x = qToX(0), s1y = pToY(0), s2x = qToX(50), s2y = pToY(50);
  const m1x = qToX(0), m1y = pToY(10), m2x = qToX(40), m2y = pToY(50);

  const xMkt = qToX(25), yMkt = pToY(25);
  const xSoc = qToX(20), ySoc = pToY(30);
  const yMmk = pToY(35); // MMK at Q=25

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Wat een vervuilende fabriek niét in zijn rekening heeft staan", "NEGATIEF EXTERN EFFECT")}

    <!-- Axes -->
    <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py+ph}" x2="${px+pw+10}" y2="${py+ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <text x="${px - 50}" y="${py + ph/2}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 50}, ${py + ph/2})">Prijs (€)</text>
    <text x="${px + pw/2}" y="${py + ph + 48}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle">Hoeveelheid Q</text>

    <!-- DWL triangle (coral fill, diagonal hatching) -->
    <defs>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="${SC.coralDeep}" stroke-width="1.4"/>
      </pattern>
    </defs>
    <polygon points="${xSoc},${ySoc} ${xMkt},${yMkt} ${xMkt},${yMmk}" fill="url(#hatch)" stroke="${SC.coralDeep}" stroke-width="1.5"/>

    <!-- Dashed refs to Q-axis and P-axis -->
    <line x1="${xSoc}" y1="${ySoc}" x2="${xSoc}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${ySoc}" x2="${xSoc}" y2="${ySoc}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xMkt}" y1="${yMkt}" x2="${xMkt}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yMkt}" x2="${xMkt}" y2="${yMkt}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>

    <!-- Curves -->
    <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${SC.indigo}" stroke-width="3"/>
    <text x="${v2x - 30}" y="${v2y - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.indigo}">V</text>

    <line x1="${s1x}" y1="${s1y}" x2="${s2x}" y2="${s2y}" stroke="${SC.olive}" stroke-width="3"/>
    <text x="${s2x + 10}" y="${s2y + 6}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.olive}">MPK</text>

    <line x1="${m1x}" y1="${m1y}" x2="${m2x}" y2="${m2y}" stroke="${SC.coral}" stroke-width="3" stroke-dasharray="10,5"/>
    <text x="${m2x + 10}" y="${m2y - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.coral}">MMK</text>

    <!-- Equilibrium dots -->
    <circle cx="${xMkt}" cy="${yMkt}" r="8" fill="${SC.indigo}"/>
    <circle cx="${xSoc}" cy="${ySoc}" r="8" fill="${SC.coralDeep}"/>

    <!-- Axis value labels -->
    <text x="${px - 10}" y="${ySoc + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}" font-weight="600">€30</text>
    <text x="${px - 10}" y="${yMkt + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}" font-weight="600">€25</text>
    <text x="${xSoc}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">Qs = 20</text>
    <text x="${xMkt}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">Qm = 25</text>

    <!-- Annotation: MMK = MPK + externe kosten -->
    <g>
      <rect x="${m1x + 30}" y="150" width="260" height="60" rx="8" fill="${SC.coral}" fill-opacity="0.12" stroke="${SC.coral}" stroke-width="1.5"/>
      <text x="${m1x + 48}" y="176" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.coralDeep}" letter-spacing="2">MMK =</text>
      <text x="${m1x + 48}" y="196" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">MPK + externe kosten</text>
      <line x1="${m1x + 30}" y1="180" x2="${m1x + 10}" y2="${m1y + 20}" stroke="${SC.coral}" stroke-width="1.8" marker-end="url(#ah-coral)"/>
    </g>

    <!-- Annotation: welvaartsverlies -->
    <g>
      <rect x="${xMkt + 80}" y="${yMkt - 30}" width="240" height="56" rx="8" fill="${SC.coralDeep}"/>
      <text x="${xMkt + 98}" y="${yMkt - 8}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="2">WELVAARTSVERLIES</text>
      <text x="${xMkt + 98}" y="${yMkt + 12}" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="#ffffff">de driehoek die de markt laat liggen</text>
      <line x1="${xMkt + 80}" y1="${yMkt}" x2="${xMkt + 15}" y2="${(ySoc + yMmk)/2}" stroke="${SC.coralDeep}" stroke-width="1.8" marker-end="url(#ah-coral)"/>
    </g>

    <!-- Bottom insight bar -->
    <rect x="140" y="580" width="1000" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="160" y="606" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="#ffffff">De prijs liegt: hij vertelt niet de maatschappelijke kosten.</text>
  </svg>`;
}

// Positive externality — annotated
function svgPosExtAnnotated() {
  const w = 1280, h = 640;
  const px = 140, py = 140, pw = 860, ph = 400;
  const qMax = 35, pMax = 42;
  const qToX = q => px + (q / qMax) * pw;
  const pToY = p => py + ph - (p / pMax) * ph;

  // MPB: P = 30 - Q ; MMB: P = 40 - Q ; S: P = Q
  const d1x = qToX(0), d1y = pToY(30), d2x = qToX(30), d2y = pToY(0);
  const m1x = qToX(0), m1y = pToY(40), m2x = qToX(35), m2y = pToY(5);
  const s1x = qToX(0), s1y = pToY(0), s2x = qToX(35), s2y = pToY(35);

  const xMkt = qToX(15), yMkt = pToY(15);
  const xSoc = qToX(20), ySoc = pToY(20);
  const yMmbMkt = pToY(25);

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Wanneer iedereen profiteert, maar niemand hoeft bij te dragen", "POSITIEF EXTERN EFFECT")}

    <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py+ph}" x2="${px+pw+10}" y2="${py+ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <text x="${px - 50}" y="${py + ph/2}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 50}, ${py + ph/2})">Prijs (€)</text>
    <text x="${px + pw/2}" y="${py + ph + 48}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle">Hoeveelheid Q</text>

    <!-- DWL triangle -->
    <defs>
      <pattern id="hatch2" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="${SC.coralDeep}" stroke-width="1.4"/>
      </pattern>
    </defs>
    <polygon points="${xMkt},${yMkt} ${xSoc},${ySoc} ${xMkt},${yMmbMkt}" fill="url(#hatch2)" stroke="${SC.coralDeep}" stroke-width="1.5"/>

    <line x1="${xMkt}" y1="${yMkt}" x2="${xMkt}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yMkt}" x2="${xMkt}" y2="${yMkt}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xSoc}" y1="${ySoc}" x2="${xSoc}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${ySoc}" x2="${xSoc}" y2="${ySoc}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>

    <line x1="${s1x}" y1="${s1y}" x2="${s2x}" y2="${s2y}" stroke="${SC.olive}" stroke-width="3"/>
    <text x="${s2x + 10}" y="${s2y + 6}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.olive}">A</text>

    <line x1="${d1x}" y1="${d1y}" x2="${d2x}" y2="${d2y}" stroke="${SC.indigo}" stroke-width="3"/>
    <text x="${d2x - 40}" y="${d2y - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.indigo}">MPB</text>

    <line x1="${m1x}" y1="${m1y}" x2="${m2x}" y2="${m2y}" stroke="${SC.teal}" stroke-width="3" stroke-dasharray="10,5"/>
    <text x="${m2x - 50}" y="${m2y - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.teal}">MMB</text>

    <circle cx="${xMkt}" cy="${yMkt}" r="8" fill="${SC.indigo}"/>
    <circle cx="${xSoc}" cy="${ySoc}" r="8" fill="${SC.teal}"/>

    <text x="${px - 10}" y="${ySoc + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}" font-weight="600">€20</text>
    <text x="${px - 10}" y="${yMkt + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}" font-weight="600">€15</text>
    <text x="${xMkt}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">Qm = 15</text>
    <text x="${xSoc}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">Qs = 20</text>

    <!-- MMB annotation -->
    <g>
      <rect x="${m1x + 40}" y="150" width="260" height="60" rx="8" fill="${SC.teal}" fill-opacity="0.12" stroke="${SC.teal}" stroke-width="1.5"/>
      <text x="${m1x + 58}" y="176" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.tealDeep}" letter-spacing="2">MMB =</text>
      <text x="${m1x + 58}" y="196" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">MPB + externe baten</text>
      <line x1="${m1x + 40}" y1="180" x2="${m1x + 10}" y2="${m1y + 20}" stroke="${SC.teal}" stroke-width="1.8" marker-end="url(#ah-smoke)"/>
    </g>

    <!-- DWL annotation -->
    <g>
      <rect x="${xMkt + 60}" y="${yMkt + 20}" width="280" height="56" rx="8" fill="${SC.coralDeep}"/>
      <text x="${xMkt + 78}" y="${yMkt + 44}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="2">WELVAARTSVERLIES</text>
      <text x="${xMkt + 78}" y="${yMkt + 62}" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="#ffffff">de markt vaccineert te weinig mensen</text>
      <line x1="${xMkt + 60}" y1="${yMkt + 40}" x2="${xMkt + 10}" y2="${(yMkt + yMmbMkt)/2}" stroke="${SC.coralDeep}" stroke-width="1.8" marker-end="url(#ah-coral)"/>
    </g>

    <rect x="140" y="580" width="1000" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="160" y="606" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="#ffffff">Meeliften werkt tegen je: de markt vergeet de baten die niet in de prijs zitten.</text>
  </svg>`;
}

// Pigou tax annotated
function svgPigouAnnotated() {
  const w = 1280, h = 640;
  const px = 140, py = 140, pw = 860, ph = 400;
  const qMax = 45, pMax = 45;
  const qToX = q => px + (q / qMax) * pw;
  const pToY = p => py + ph - (p / pMax) * ph;

  const v1x = qToX(0), v1y = pToY(40), v2x = qToX(40), v2y = pToY(0);
  const a1x = qToX(0), a1y = pToY(10), a2x = qToX(30), a2y = pToY(40);
  const an1x = qToX(0), an1y = pToY(20), an2x = qToX(20), an2y = pToY(40);

  const xOld = qToX(15), yOld = pToY(25);
  const xNew = qToX(10), yNew = pToY(30);
  const yProd = pToY(20);

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Een belasting laat de prijs de waarheid vertellen", "INTERNALISEREN  ·  PIGOU-BELASTING")}

    <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py+ph}" x2="${px+pw+10}" y2="${py+ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <text x="${px - 50}" y="${py + ph/2}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 50}, ${py + ph/2})">Prijs (€)</text>
    <text x="${px + pw/2}" y="${py + ph + 48}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle">Hoeveelheid Q</text>

    <!-- Tax revenue rectangle -->
    <rect x="${px}" y="${yNew}" width="${xNew - px}" height="${yProd - yNew}" fill="${SC.amber}" fill-opacity="0.42"/>
    <text x="${(px + xNew)/2}" y="${(yNew + yProd)/2 + 5}" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.amberDeep}">belastingopbrengst</text>

    <!-- Dashed refs -->
    <line x1="${xOld}" y1="${yOld}" x2="${xOld}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yOld}" x2="${xOld}" y2="${yOld}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xNew}" y1="${yNew}" x2="${xNew}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yNew}" x2="${xNew}" y2="${yNew}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yProd}" x2="${xNew}" y2="${yProd}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>

    <!-- Curves -->
    <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${SC.indigo}" stroke-width="3"/>
    <text x="${v2x + 10}" y="${v2y - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.indigo}">V</text>

    <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${SC.olive}" stroke-width="2.5" stroke-dasharray="8,5" opacity="0.75"/>
    <text x="${a2x + 10}" y="${a2y + 6}" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.olive}" opacity="0.9">A (oud)</text>

    <line x1="${an1x}" y1="${an1y}" x2="${an2x}" y2="${an2y}" stroke="${SC.coral}" stroke-width="3"/>
    <text x="${an2x + 10}" y="${an2y - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.coral}">A + belasting</text>

    <!-- Shift arrow -->
    <g>
      <line x1="${qToX(25)}" y1="${pToY(30)}" x2="${qToX(25) - 80}" y2="${pToY(30)}" stroke="${SC.coralDeep}" stroke-width="2.4" marker-end="url(#ah-coral)"/>
      <text x="${qToX(25) - 40}" y="${pToY(30) - 10}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.coralDeep}">shift</text>
    </g>

    <circle cx="${xOld}" cy="${yOld}" r="8" fill="${SC.olive}" opacity="0.85"/>
    <circle cx="${xNew}" cy="${yNew}" r="8" fill="${SC.coralDeep}"/>

    <!-- Axis labels -->
    <text x="${px - 10}" y="${pToY(40) + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">€40</text>
    <text x="${px - 10}" y="${yNew + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}" font-weight="700">€30</text>
    <text x="${px - 10}" y="${yOld + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">€25</text>
    <text x="${px - 10}" y="${yProd + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">€20</text>
    <text x="${xNew}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}" font-weight="700">Qn = 10</text>
    <text x="${xOld}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">Qo = 15</text>

    <!-- Callout: burden split -->
    <g>
      <rect x="${xNew + 100}" y="${yNew - 10}" width="310" height="80" rx="10" fill="${SC.indigo}"/>
      <text x="${xNew + 120}" y="${yNew + 14}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="2">BELASTING t = €10</text>
      <text x="${xNew + 120}" y="${yNew + 38}" font-family="${FONT_SANS}" font-size="14" fill="#ffffff">Consument: +€5   ·   Producent: -€5</text>
      <text x="${xNew + 120}" y="${yNew + 58}" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.cloud}">De last wordt gedeeld.</text>
      <line x1="${xNew + 100}" y1="${yNew + 30}" x2="${xNew + 15}" y2="${yNew + 5}" stroke="${SC.indigo}" stroke-width="1.8"/>
    </g>

    <rect x="140" y="580" width="1000" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="160" y="606" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="#ffffff">Vliegtaks in beeld: prijs omhoog, consumptie omlaag, extern effect ingeprijsd.</text>
  </svg>`;
}

// Instrumenten-matrix — redesigned with icons
function svgInstrumentenMatrix() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Welk instrument past bij welk probleem?", "GEREEDSCHAPSKIST OVERHEID")}

    <!-- Grid header -->
    <rect x="80"  y="160" width="340" height="50" fill="${SC.indigo}"/>
    <rect x="420" y="160" width="320" height="50" fill="${SC.indigoMid}"/>
    <rect x="740" y="160" width="460" height="50" fill="${SC.coralDeep}"/>
    <text x="100" y="192" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="#ffffff" letter-spacing="2">PROBLEEM</text>
    <text x="440" y="192" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="#ffffff" letter-spacing="2">MECHANISME</text>
    <text x="760" y="192" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="#ffffff" letter-spacing="2">INSTRUMENT</text>

    ${[
      { y: 210, icon: ICON.smokestack(SC.coralDeep, SC.smoke), probl: "Monopolie / machtspositie", pSub: "te weinig concurrentie", mech: "prijs te hoog, Q te laag", instr: "Mededingingsbeleid", instrSub: "ACM, EC, boetes", col: SC.coral },
      { y: 310, icon: ICON.factory(SC.amberDeep),              probl: "Negatief extern effect",     pSub: "kosten buiten de prijs", mech: "prijs te laag, te veel productie", instr: "Belasting (accijns)", instrSub: "bv. vliegtaks", col: SC.amberDeep },
      { y: 410, icon: ICON.syringe(SC.teal),                   probl: "Positief extern effect",     pSub: "baten buiten de prijs",  mech: "prijs te hoog, te weinig consumptie", instr: "Subsidie", instrSub: "bv. vaccinatie, onderwijs", col: SC.teal },
      { y: 510, icon: ICON.badge(SC.oliveDeep, SC.coral),      probl: "Collectieve goederen",        pSub: "markt levert het niet", mech: "meelifters, geen prikkel", instr: "Overheid levert zelf", instrSub: "defensie, dijken, politie", col: SC.olive },
    ].map(r => `
      <rect x="80"  y="${r.y}" width="340" height="90" fill="${SC.chalk}" stroke="${SC.cloud}" stroke-width="1"/>
      <rect x="80"  y="${r.y}" width="6"   height="90" fill="${r.col}"/>
      ${placeIcon(r.icon, 104, r.y + 28, 36)}
      <text x="160" y="${r.y + 42}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.indigo}">${r.probl}</text>
      <text x="160" y="${r.y + 62}" font-family="${FONT_SANS}" font-size="12" fill="${SC.smoke}">${r.pSub}</text>

      <rect x="420" y="${r.y}" width="320" height="90" fill="${SC.paper}" stroke="${SC.cloud}" stroke-width="1"/>
      <text x="440" y="${r.y + 52}" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.smoke}">${r.mech}</text>

      <rect x="740" y="${r.y}" width="460" height="90" fill="${SC.sky}" stroke="${SC.cloud}" stroke-width="1"/>
      <text x="760" y="${r.y + 42}" font-family="${FONT_SANS}" font-size="18" font-weight="700" fill="${SC.indigo}">${r.instr}</text>
      <text x="760" y="${r.y + 66}" font-family="${FONT_SANS}" font-size="12" fill="${SC.smoke}">${r.instrSub}</text>
    `).join("")}
  </svg>`;
}

// Three natural-monopoly examples — card layout with icons
function svgNatMonExamples() {
  const cards = [
    { x: 80,   title: "Waterleidingnet",   note: "Eén net per wijk: dubbele leidingen zouden zinloos duur zijn.", color: SC.teal, bgColor: SC.tealDeep },
    { x: 490,  title: "Spoorwegen",         note: "Extra rails naast de bestaande levert niemand iets op.",         color: SC.amber, bgColor: SC.amberDeep },
    { x: 900,  title: "Elektriciteitsnet",  note: "Twee kabelnetten kruisen? Verspilling voor dezelfde woningen.",   color: SC.coral, bgColor: SC.coralDeep },
  ];
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Drie klassieke natuurlijke monopolies", "VOORBEELDEN UIT NEDERLAND")}

    ${cards.map(c => {
      // Wrap note into 3 lines by word count
      const words = c.note.split(" ");
      const t = Math.ceil(words.length / 3);
      const lines = [
        words.slice(0, t).join(" "),
        words.slice(t, 2*t).join(" "),
        words.slice(2*t).join(" "),
      ].filter(Boolean);
      const textLines = lines.map((l, i) =>
        `<text x="${c.x + 155}" y="${400 + i * 26}" text-anchor="middle" font-family="Georgia, serif" font-size="16" font-style="italic" fill="${SC.ink}">${l}</text>`
      ).join("");
      return `
        <rect x="${c.x}" y="160" width="310" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.cloud}" stroke-width="1"/>
        <rect x="${c.x}" y="160" width="310" height="120" fill="${c.bgColor}" rx="14"/>
        <rect x="${c.x}" y="248" width="310" height="32" fill="${c.bgColor}"/>
        ${placeIcon(ICON.factory(SC.paper), c.x + 125, 185, 60)}
        <text x="${c.x + 155}" y="316" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="${SC.indigo}">${c.title}</text>
        <line x1="${c.x + 50}" y1="340" x2="${c.x + 260}" y2="340" stroke="${c.color}" stroke-width="2"/>
        ${textLines}
      `;
    }).join("")}
  </svg>`;
}

// Side-by-side comparison — negatief vs positief extern effect
function svgNegVsPos() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Spiegelbeeld: negatief ↔ positief extern effect", "VERGELIJKING")}

    <!-- LEFT: negatief -->
    <rect x="80"  y="160" width="560" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.coral}" stroke-width="2"/>
    <rect x="80"  y="160" width="560" height="50" fill="${SC.coralDeep}" rx="14"/>
    <rect x="80"  y="198" width="560" height="12" fill="${SC.coralDeep}"/>
    <text x="360" y="192" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Negatief extern effect</text>
    ${placeIcon(ICON.factory(SC.coralDeep), 108, 232, 44)}
    <text x="170" y="258" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.ink}">kosten voor derden</text>
    <text x="170" y="282" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">(vervuiling, geluid)</text>

    <line x1="108" y1="308" x2="608" y2="308" stroke="${SC.cloud}"/>

    ${[
      ["prijs is", "te laag"],
      ["markt produceert", "te veel"],
      ["welvaartsverlies zit", "bij overproductie"],
      ["instrument", "belasting"],
    ].map(([k, v], i) => `
      <text x="108" y="${340 + i * 46}" font-family="${FONT_SANS}" font-size="13" fill="${SC.ash}" letter-spacing="1">${k.toUpperCase()}</text>
      <text x="608" y="${340 + i * 46}" text-anchor="end" font-family="${FONT_SERIF}" font-size="18" font-style="italic" fill="${SC.coralDeep}" font-weight="700">${v}</text>
    `).join("")}

    <!-- RIGHT: positief -->
    <rect x="660" y="160" width="560" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.teal}" stroke-width="2"/>
    <rect x="660" y="160" width="560" height="50" fill="${SC.tealDeep}" rx="14"/>
    <rect x="660" y="198" width="560" height="12" fill="${SC.tealDeep}"/>
    <text x="940" y="192" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Positief extern effect</text>
    ${placeIcon(ICON.syringe(SC.tealDeep), 688, 232, 44)}
    <text x="750" y="258" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.ink}">baten voor derden</text>
    <text x="750" y="282" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">(vaccinatie, onderwijs)</text>

    <line x1="688" y1="308" x2="1188" y2="308" stroke="${SC.cloud}"/>

    ${[
      ["prijs is", "te hoog"],
      ["markt consumeert", "te weinig"],
      ["welvaartsverlies zit", "bij onderconsumptie"],
      ["instrument", "subsidie"],
    ].map(([k, v], i) => `
      <text x="688" y="${340 + i * 46}" font-family="${FONT_SANS}" font-size="13" fill="${SC.ash}" letter-spacing="1">${k.toUpperCase()}</text>
      <text x="1188" y="${340 + i * 46}" text-anchor="end" font-family="${FONT_SERIF}" font-size="18" font-style="italic" fill="${SC.tealDeep}" font-weight="700">${v}</text>
    `).join("")}
  </svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE BUILDERS (high-level layouts)
// ═══════════════════════════════════════════════════════════════════════════
function sectionDivider(pres, { kicker, title, subtitle, notes }) {
  const s = pres.addSlide({ masterName: "DARK_HERO" });
  s.addText(kicker.toUpperCase(), {
    x: 0.6, y: 1.9, w: 8.8, h: 0.4,
    ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6,
  });
  s.addText(title, {
    x: 0.6, y: 2.35, w: 8.8, h: 1.3,
    ...T.heroDark, fontSize: 56, charSpacing: -2,
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.6, y: 3.85, w: 8.8, h: 0.6,
      ...T.subheadDark, fontFace: FONT_SERIF, italic: true,
    });
  }
  // Decorative coral line
  s.addShape("rect", { x: 0.6, y: 3.6, w: 0.6, h: 0.04, fill: { color: PC.coral } });
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
    ...T.stat, fontSize: 130, charSpacing: -4, align: "center",
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
    ...T.displayLight, fontSize: 28, charSpacing: -0.5,
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

function fullBleedImage(slide, img) {
  // Image takes the full content area below the header
  slide.addImage({ data: img, x: 0.4, y: 1.85, w: 9.2, h: 3.5 });
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

  defineMasters(pres);

  // Build all SVGs first in parallel
  const svgs = {
    coastline:    svgCoastlineSilhouette(),
    typology:     svgMarktfalenTypo(),
    natMon:       svgNatMonAnnotated(),
    natMonEx:     svgNatMonExamples(),
    negExt:       svgNegExtAnnotated(),
    posExt:       svgPosExtAnnotated(),
    negVsPos:     svgNegVsPos(),
    pigou:        svgPigouAnnotated(),
    instruments:  svgInstrumentenMatrix(),
  };
  const imgs = {};
  for (const [k, v] of Object.entries(svgs)) imgs[k] = await svgData(v, 1440);

  // ────────────────────────────────────────────────────────────────────
  // DIA 1 — Cinematic opener
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    // Background silhouette image
    s.addImage({ data: imgs.coastline, x: 0, y: 2.4, w: 10, h: 3.28 });

    s.addText("§ 3.3.1", {
      x: 0.6, y: 0.5, w: 4, h: 0.4,
      ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6,
    });
    s.addText("De rol van de overheid", {
      x: 0.6, y: 0.95, w: 8.8, h: 1.3,
      ...T.heroDark, fontSize: 60, charSpacing: -2,
    });
    s.addText("Hoofdstuk 3 · Overheid  ·  Praktische Economie VWO", {
      x: 0.6, y: 2.3, w: 8.8, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.cloud,
    });

    s.addNotes("Welkom. We beginnen met het grote beeld: Nederland is een land van dijken, polders en markten. Soms werkt de markt prima. Soms gaat het mis — en dan komt de overheid in beeld.");
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
    s.addText("Als de markt faalt,\nwie grijpt in?", {
      x: 1.8, y: 1.4, w: 8, h: 2.6,
      fontFace: FONT_DISPLAY, fontSize: 60, bold: true, color: PC.chalk, charSpacing: -2, lineSpacingMultiple: 1.05,
    });
    s.addText("De kernvraag van dit hoofdstuk.", {
      x: 1.8, y: 4.3, w: 8, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.amber,
    });
    s.addNotes("Laat de vraag even hangen. Zonder meteen antwoord te geven. Dit is de denkvraag van de les.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 3 — Leerdoelen (sidebar layout)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = sidebarSlide(pres, {
      sidebarKicker: "Wat ga je leren",
      sidebarTitle: "Zes vaardigheden voor één uur",
      sidebarBody: "Na deze paragraaf weet je waarom de overheid ingrijpt — en met welk instrument.",
    });
    const doelen = [
      { n: "01", t: "Marktfalen herkennen in een casus" },
      { n: "02", t: "Natuurlijk monopolie uitleggen via dalende GTK" },
      { n: "03", t: "Economische machtspositie bepalen (drempel 35 %)" },
      { n: "04", t: "Negatief extern effect aanwijzen in een grafiek" },
      { n: "05", t: "Positief extern effect aanwijzen in een grafiek" },
      { n: "06", t: "Internaliseren uitleggen: belasting of subsidie" },
    ];
    doelen.forEach((d, i) => {
      const y = 0.55 + i * 0.75;
      s.addText(d.n, {
        x: 2.3, y, w: 1.1, h: 0.7,
        fontFace: FONT_DISPLAY, fontSize: 34, bold: true, color: PC.coral, charSpacing: -1,
      });
      s.addText(d.t, {
        x: 3.4, y: y + 0.1, w: 6.3, h: 0.6,
        fontFace: FONT_SANS, fontSize: 16, color: PC.ink, valign: "middle",
      });
      if (i < doelen.length - 1) {
        s.addShape("rect", { x: 2.3, y: y + 0.68, w: 7.4, h: 0.01, fill: { color: PC.cloud } });
      }
    });
    s.addNotes("Zes leerdoelen. Benadruk dat elk leerdoel ook in een oefening terugkomt.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 4 — Section divider: MARKTFALEN
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 1",
    title: "Marktfalen",
    subtitle: "Wanneer de markt niet het optimum levert — en waarom het dan aan de overheid is.",
    notes: "Drie oorzaken volgen: monopolie, externe effecten, collectieve goederen. Vandaag: de eerste twee.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 5 — Wat is marktfalen (two-column magazine)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Begrip · marktfalen",
      title: "De markt doet haar werk — tot ze dat niet meer doet.",
      notes: "Stel het contrast scherp: wanneer werkt de markt wel, en wanneer niet? Gebruik de definitie letterlijk: 'de markt levert niet het optimum'.",
    });

    // LEFT: markt werkt
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.chalk }, line: { color: PC.cloud, width: 0.75 } });
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 0.08, fill: { color: PC.olive } });
    s.addText("WERKT", {
      x: 0.75, y: 2.2, w: 3.9, h: 0.3,
      ...T.labelUpper, color: PC.olive, fontSize: 12, charSpacing: 4,
    });
    s.addText("Markt levert het optimum", {
      x: 0.75, y: 2.55, w: 3.9, h: 0.5,
      fontFace: FONT_DISPLAY, fontSize: 20, bold: true, color: PC.indigo, charSpacing: -0.5,
    });
    [
      "Voldoende concurrentie",
      "Alle kosten en baten in de prijs",
      "Iedereen wordt bereikt",
      "Prijs stuurt schaarse middelen efficiënt",
    ].forEach((t, i) => {
      s.addShape("rect", { x: 0.9, y: 3.25 + i * 0.38, w: 0.12, h: 0.12, fill: { color: PC.olive } });
      s.addText(t, {
        x: 1.1, y: 3.18 + i * 0.38, w: 3.7, h: 0.3,
        fontFace: FONT_SANS, fontSize: 13, color: PC.ink, valign: "middle",
      });
    });

    // RIGHT: markt faalt
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.chalk }, line: { color: PC.cloud, width: 0.75 } });
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 0.08, fill: { color: PC.coral } });
    s.addText("FAALT", {
      x: 5.35, y: 2.2, w: 3.9, h: 0.3,
      ...T.labelUpper, color: PC.coral, fontSize: 12, charSpacing: 4,
    });
    s.addText("Markt mist het optimum", {
      x: 5.35, y: 2.55, w: 3.9, h: 0.5,
      fontFace: FONT_DISPLAY, fontSize: 20, bold: true, color: PC.indigo, charSpacing: -0.5,
    });
    [
      "Te weinig concurrentie (monopolie)",
      "Kosten/baten buiten de markt",
      "Markt levert goederen niet",
      "Overheid moet corrigeren",
    ].forEach((t, i) => {
      s.addShape("ellipse", { x: 5.5, y: 3.25 + i * 0.38, w: 0.12, h: 0.12, fill: { color: PC.coral } });
      s.addText(t, {
        x: 5.7, y: 3.18 + i * 0.38, w: 3.7, h: 0.3,
        fontFace: FONT_SANS, fontSize: 13, color: PC.ink, valign: "middle",
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 6 — Typologie infographic
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.typology, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("De kapstok van de les. Drie oorzaken, drie instrumenten. De volgende dia's werken elke rij uit.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 7 — Section: MONOPOLIE
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 2",
    title: "Als één koning regeert",
    subtitle: "Natuurlijk monopolie, machtspositie, en de rol van de mededingingsautoriteit.",
    notes: "De monopolie-dimensie van marktfalen. Begin met natuurlijk monopolie (soms onvermijdelijk), dan machtspositie (vaak niet).",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 8 — Natuurlijk monopolie concept (split content)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Concept 01",
      title: "Natuurlijk monopolie — als twee duurder is dan één.",
      notes: "Bij hoge vaste kosten + lage variabele kosten is één aanbieder technisch efficiënter. Dat is wat 'natuurlijk' hier betekent.",
    });

    // LEFT: definition
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.2, h: 3.1, fill: { color: PC.sky }, line: { color: PC.cloud, width: 0.75 } });
    s.addText("DEFINITIE", {
      x: 0.7, y: 2.15, w: 3.8, h: 0.3,
      ...T.labelUpper, color: PC.indigo, fontSize: 11, charSpacing: 3,
    });
    s.addText([
      { text: "Eén aanbieder", options: { bold: true, color: PC.indigo } },
      { text: " heeft structureel lagere gemiddelde kosten dan twee of meer aanbieders bij elkaar.", options: {} },
    ], {
      x: 0.7, y: 2.5, w: 3.8, h: 1.5,
      fontFace: FONT_SERIF, fontSize: 18, color: PC.ink, italic: true, lineSpacingMultiple: 1.3,
    });
    s.addShape("rect", { x: 0.7, y: 4.1, w: 0.4, h: 0.03, fill: { color: PC.coral } });
    s.addText("Kenmerk: dalende GTK", {
      x: 0.7, y: 4.2, w: 3.8, h: 0.4,
      fontFace: FONT_SANS, fontSize: 14, bold: true, color: PC.coralDeep,
    });
    s.addText("hoge vaste kosten + lage variabele kosten per eenheid", {
      x: 0.7, y: 4.55, w: 3.8, h: 0.4,
      fontFace: FONT_SANS, fontSize: 12, color: PC.smoke,
    });

    // RIGHT: mental model (numbers)
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.indigo } });
    s.addText("DENK AAN POSTBEZORGING", {
      x: 5.3, y: 2.15, w: 4, h: 0.3,
      ...T.labelUpper, color: PC.amber, fontSize: 11, charSpacing: 3,
    });
    s.addText([
      { text: "1 miljoen brieven", options: { bold: true, color: PC.chalk, fontSize: 18 } },
      { text: "  →  GTK hoog\n", options: { color: PC.cloud, fontSize: 16 } },
      { text: "10 miljoen brieven", options: { bold: true, color: PC.chalk, fontSize: 18 } },
      { text: "  →  GTK veel lager\n\n", options: { color: PC.cloud, fontSize: 16 } },
      { text: "PostNL + Sandd samen zou leiden tot hogere kosten per brief.", options: { italic: true, color: PC.amber, fontSize: 14, fontFace: FONT_SERIF } },
    ], {
      x: 5.3, y: 2.55, w: 4, h: 2.4,
      fontFace: FONT_SANS, lineSpacingMultiple: 1.4,
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 9 — GTK chart (annotated)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.natMon, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Wijs beide punten aan. 1 aanbieder op Q=100 → GTK=€4. 2 aanbieders elk op Q=50 → GTK=€6 per bedrijf. Het verschil van €2 per eenheid is het efficiëntieverlies van concurrentie.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 10 — Drie voorbeelden
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.natMonEx, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Drie klassieke voorbeelden. Vraag de klas: kan je er zelf nog een bedenken? (pijpleidingen, riolering, 5G-dekking op platteland).");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 11 — Hero stat: €1,49 mrd
  // ────────────────────────────────────────────────────────────────────
  heroStat(pres, {
    kicker: "GOOGLE · 2019 · EUROPESE COMMISSIE",
    stat: "€1,49 mrd",
    subtitle: "boete voor misbruik van economische machtspositie",
    body: "\u201C… Google dwong websites om alleen Google-advertenties te tonen.\u201D",
    notes: "Zet de boete even in perspectief: €1,49 miljard is meer dan de hele Nederlandse cultuurbegroting per jaar. De EU neemt marktmacht serieus.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 12 — Machtspositie flow + 35% threshold
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Concept 02",
      title: "Economische machtspositie",
      subtitle: "De 35 %-drempel — een bedrijf met veel marktaandeel kan concurrenten wegdrukken.",
      notes: "De Mededingingswet verbiedt misbruik. ACM handhaaft in Nederland, EC in Europa. Google-zaak als scherp voorbeeld.",
    });
    // Timeline-style flow
    const steps = [
      { n: "01", t: "Bepaal marktaandeel", s: "hoeveel % van de markt?", col: PC.indigoSoft },
      { n: "02", t: "≥ 35 %?", s: "machtspositie volgens EU-regels", col: PC.coral },
      { n: "03", t: "Wordt die positie misbruikt?", s: "uitsluiten concurrenten, afdwingen prijzen", col: PC.amberDeep },
      { n: "04", t: "ACM/EC grijpt in", s: "boete, ontvlechting, regulering", col: PC.indigo },
    ];
    const w = 2.15, gap = 0.18, startX = 0.5, y = 2.25, h = 2.6;
    steps.forEach((st, i) => {
      const x = startX + i * (w + gap);
      s.addShape("rect", { x, y, w, h, fill: { color: PC.chalk }, line: { color: PC.cloud, width: 0.5 } });
      s.addShape("rect", { x, y, w, h: 0.06, fill: { color: st.col } });
      s.addText(st.n, {
        x: x + 0.2, y: y + 0.25, w: w - 0.4, h: 0.6,
        fontFace: FONT_DISPLAY, fontSize: 40, bold: true, color: st.col, charSpacing: -2,
      });
      s.addText(st.t, {
        x: x + 0.2, y: y + 1.0, w: w - 0.4, h: 0.8,
        fontFace: FONT_SANS, fontSize: 16, bold: true, color: PC.indigo, lineSpacingMultiple: 1.15,
      });
      s.addText(st.s, {
        x: x + 0.2, y: y + 1.85, w: w - 0.4, h: 0.65,
        fontFace: FONT_SERIF, fontSize: 12, italic: true, color: PC.smoke, lineSpacingMultiple: 1.3,
      });
      // Arrow between
      if (i < steps.length - 1) {
        s.addShape("rightTriangle", { x: x + w + 0.02, y: y + h/2 - 0.09, w: 0.15, h: 0.18,
          fill: { color: PC.ash }, rotate: 90 });
      }
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 13 — Section: EXTERNE EFFECTEN
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 3",
    title: "De prijs liegt",
    subtitle: "Wat gebeurt er als kosten of baten buiten de markt vallen?",
    notes: "Externe effecten zijn onze volgende vorm van marktfalen. Eerst de negatieve, dan de positieve.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 14 — Negatief extern effect: de keten
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Concept 03",
      title: "Negatief extern effect — wat de rekening niet vertelt",
      subtitle: "Vliegverkeer veroorzaakt luchtvervuiling. Maar zit die schade in de ticketprijs?",
      notes: "De keten: produceren → derden lijden schade → kosten niet in prijs → te lage prijs → te veel productie.",
    });
    // Causal chain, horizontal with arrows
    const chain = [
      { t: "Bedrijf\nproduceert",            col: PC.indigo,    emph: false },
      { t: "Derden lijden\nschade",           col: PC.amberDeep, emph: false },
      { t: "Kosten zitten\nniet in de prijs", col: PC.coral,     emph: true  },
      { t: "Prijs te laag,\nte veel productie", col: PC.coralDeep, emph: false },
      { t: "Welvaarts-\nverlies",              col: PC.indigoDeep,emph: true  },
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
    // Bottom anecdote
    s.addShape("rect", { x: 0.4, y: 4.3, w: 9.2, h: 0.75, fill: { color: PC.indigoDeep } });
    s.addText([
      { text: "VOORBEELD  ·  ", options: { bold: true, color: PC.amber, fontSize: 11, charSpacing: 3 } },
      { text: "Vliegtuig naar Barcelona: de reiziger betaalt het ticket, maar de CO₂-uitstoot wordt door iedereen gedragen.",
        options: { color: PC.chalk, fontSize: 13, fontFace: FONT_SERIF, italic: true } },
    ], {
      x: 0.6, y: 4.35, w: 8.8, h: 0.65, valign: "middle",
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 15 — Negatief extern effect: grafiek
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.negExt, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Lees de grafiek. MPK = wat het bedrijf ziet aan kosten. MMK = maatschappelijke kosten incl. vervuiling. De gehatchte driehoek = welvaartsverlies.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 16 — Positief extern effect: keten
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Concept 04",
      title: "Positief extern effect",
      subtitle: "Waarom niemand vrijwillig genoeg bijdraagt — en een vaccinatie óók anderen beschermt.",
      notes: "Spiegelbeeld van vorige keten. Let op de woorden: baten ipv kosten, consumptie ipv productie, te weinig ipv te veel.",
    });
    const chain = [
      { t: "Iemand\nconsumeert",            col: PC.indigo,    emph: false },
      { t: "Derden\nprofiteren mee",        col: PC.teal,      emph: false },
      { t: "Baten zitten\nniet in de prijs", col: PC.tealDeep,  emph: true  },
      { t: "Prijs te hoog,\nte weinig consumptie", col: PC.coral, emph: false },
      { t: "Welvaarts-\nverlies",            col: PC.indigoDeep,emph: true  },
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
    s.addShape("rect", { x: 0.4, y: 4.3, w: 9.2, h: 0.75, fill: { color: PC.tealDeep } });
    s.addText([
      { text: "VOORBEELD  ·  ", options: { bold: true, color: PC.amber, fontSize: 11, charSpacing: 3 } },
      { text: "Een kind laten vaccineren tegen mazelen: kosten €50, maar klasgenoten en buren profiteren mee.",
        options: { color: PC.chalk, fontSize: 13, fontFace: FONT_SERIF, italic: true } },
    ], {
      x: 0.6, y: 4.35, w: 8.8, h: 0.65, valign: "middle",
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 17 — Positief extern effect: grafiek
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.posExt, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("MPB = private baten (wat de koper zelf waardeert). MMB = maatschappelijke baten (incl. bescherming van anderen). MMB ligt hoger. Het verschil = externe baten. Welvaartsverlies: de markt vaccineert te weinig.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 18 — Vergelijking neg vs pos
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.negVsPos, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Spiegel-structuur maakt het onthouden makkelijker. Laat de klas de rechterkant voorspellen terwijl je de linker uitlegt.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 19 — Section: INTERNALISEREN
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 4",
    title: "De prijs laten kloppen",
    subtitle: "Internaliseren: externe kosten of baten in de prijs verwerken.",
    notes: "Brug naar beleid. Belasting bij negatief effect, subsidie bij positief effect.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 20 — Pigou-belasting grafiek
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.pigou, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Vliegtaks als klassiek voorbeeld. Belasting t=€10. Prijs voor consument stijgt van €25 naar €30 (+€5). Producent ontvangt €20 (-€5). De last wordt gedeeld — de prijsstijging is NIET gelijk aan de belasting.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 21 — Instrumenten-matrix
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.instruments, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Complete matrix: alle vier de vormen met hun instrument. Gebruik dit als retrieval: noem een casus, laat leerlingen de rij invullen.");
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
      { num: "01", claim: "Alle monopolies zijn slecht",
        truth: "Een natuurlijk monopolie is efficiënter dan meerdere aanbieders. De overheid reguleert, maar heft het monopolie niet op." },
      { num: "02", claim: "Externe effecten zijn altijd negatief",
        truth: "Er bestaan ook positieve externe effecten (onderwijs, vaccinatie). Die leiden juist tot te wéínig productie." },
      { num: "03", claim: "Internaliseren = verbieden",
        truth: "Internaliseren = kosten/baten in de prijs verwerken via belasting of subsidie. Het product wordt niet verboden." },
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
  // DIA 23 — Closing: samenvatting (dark hero)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("De kern", {
      x: 0.6, y: 0.5, w: 8.8, h: 0.4,
      ...T.labelUpper, color: PC.coral, fontSize: 13, charSpacing: 6,
    });
    s.addText("Zes dingen om te onthouden", {
      x: 0.6, y: 0.9, w: 8.8, h: 0.8,
      ...T.headlineDark, fontSize: 32, charSpacing: -1,
    });
    const items = [
      { n: "01", t: "Marktfalen = markt levert niet het optimum" },
      { n: "02", t: "Natuurlijk monopolie: dalende GTK → één aanbieder efficiënter" },
      { n: "03", t: "Machtspositie: marktaandeel ≥ 35 %, ACM/EC grijpt in" },
      { n: "04", t: "Negatief extern effect: prijs te laag, te veel productie" },
      { n: "05", t: "Positief extern effect: prijs te hoog, te weinig consumptie" },
      { n: "06", t: "Overheid internaliseert met belasting of subsidie" },
    ];
    items.forEach((it, i) => {
      const y = 1.85 + i * 0.52;
      s.addText(it.n, {
        x: 0.6, y, w: 0.6, h: 0.5,
        fontFace: FONT_DISPLAY, fontSize: 22, bold: true, color: PC.coral, charSpacing: -1,
      });
      s.addText(it.t, {
        x: 1.2, y: y + 0.05, w: 8.3, h: 0.45,
        fontFace: FONT_SANS, fontSize: 16, color: PC.chalk, valign: "middle",
      });
      if (i < items.length - 1) {
        s.addShape("rect", { x: 0.6, y: y + 0.48, w: 8.8, h: 0.005, fill: { color: PC.indigoSoft } });
      }
    });
    s.addNotes("Retrieval: laat leerlingen de 6 punten aan elkaar uitleggen zonder dia. Wie struikelt, gaat terug naar dat concept.");
  }

  // ────────────────────────────────────────────────────────────────────
  // OUTPUT
  // ────────────────────────────────────────────────────────────────────
  const outDir = path.resolve(__dirname, "../output/3.3.1");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Save raw SVGs for debugging
  const svgDir = path.join(outDir, "svg");
  if (!fs.existsSync(svgDir)) fs.mkdirSync(svgDir, { recursive: true });
  for (const [k, v] of Object.entries(svgs)) {
    fs.writeFileSync(path.join(svgDir, `331c-${k}.svg`), v, "utf8");
  }

  const outPath = path.join(outDir, "3.3.1 De rol van de overheid – presentatie.pptx");
  await pres.writeFile({ fileName: outPath });
  const fix = await fixPptxFile(outPath);
  roundtripWithLibreOffice(outPath);
  console.log(`PPTX written to ${outPath} (fix: -${fix.removedOverrides} phantom overrides, -${fix.removedEmptyDirs} empty dirs; roundtripped via LibreOffice)`);
}

build().catch(e => { console.error(e); process.exit(1); });
