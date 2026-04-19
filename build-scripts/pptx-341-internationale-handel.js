/**
 * pptx-341-internationale-handel.js — §3.4.1 Internationale handel
 * Editorial design system, rich illustration, 5 vaardigheden.
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

// Opening visual — stylized world map silhouette with trade routes
function svgWorldTradeSilhouette() {
  return `${svgHeader(1280, 420, SC.indigoDeep)}
    <!-- stars / sparse light points -->
    ${Array.from({length: 30}, (_, i) => {
      const x = 40 + (i * 127) % 1200, y = 30 + (i * 59) % 120;
      return `<circle cx="${x}" cy="${y}" r="1" fill="#ffffff" opacity="${0.15 + (i % 3) * 0.1}"/>`;
    }).join("")}

    <defs>
      <linearGradient id="waterG" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${SC.indigoMid}"/>
        <stop offset="1" stop-color="${SC.indigoDeep}"/>
      </linearGradient>
      <linearGradient id="routeGlow" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="${SC.coral}" stop-opacity="0"/>
        <stop offset="0.5" stop-color="${SC.coral}" stop-opacity="0.9"/>
        <stop offset="1" stop-color="${SC.coral}" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <!-- water/ocean -->
    <rect x="0" y="180" width="1280" height="240" fill="url(#waterG)"/>

    <!-- wave lines -->
    <path d="M0 210 Q60 202 120 210 T240 210 T360 210 T480 210 T600 210 T720 210 T840 210 T960 210 T1080 210 T1200 210" stroke="${SC.teal}" stroke-width="1.2" fill="none" opacity="0.5"/>
    <path d="M0 240 Q80 234 160 240 T320 240 T480 240 T640 240 T800 240 T960 240 T1120 240" stroke="${SC.teal}" stroke-width="1" fill="none" opacity="0.3"/>

    <!-- Abstract continent silhouettes (stylized) -->
    <!-- Americas -->
    <path d="M80 140 Q120 130 160 140 L170 180 L180 200 L160 210 L140 200 L120 180 Z"
          fill="${SC.indigoSoft}" fill-opacity="0.35"/>
    <!-- Europe -->
    <path d="M530 130 Q570 125 610 140 Q640 150 640 175 L590 180 L560 170 L530 165 Z"
          fill="${SC.indigoSoft}" fill-opacity="0.5"/>
    <!-- Rotterdam/NL marker -->
    <circle cx="575" cy="158" r="5" fill="${SC.coral}"/>
    <circle cx="575" cy="158" r="11" fill="none" stroke="${SC.coral}" stroke-width="1.5" opacity="0.6"/>
    <text x="590" y="152" font-family="Segoe UI" font-size="11" font-weight="700" fill="${SC.coral}" letter-spacing="2">NL</text>
    <!-- Africa -->
    <path d="M570 190 Q590 205 590 240 Q585 260 565 255 Q550 240 555 215 Z"
          fill="${SC.indigoSoft}" fill-opacity="0.35"/>
    <!-- Asia -->
    <path d="M700 130 Q790 120 880 140 Q920 155 940 175 Q910 185 870 180 L790 175 L720 165 Z"
          fill="${SC.indigoSoft}" fill-opacity="0.4"/>
    <!-- China marker -->
    <circle cx="880" cy="165" r="4" fill="${SC.amber}"/>
    <text x="895" y="160" font-family="Segoe UI" font-size="11" font-weight="700" fill="${SC.amber}" letter-spacing="2">CN</text>

    <!-- Trade route arcs (dashed) -->
    <path d="M575 158 Q720 80 880 165" stroke="${SC.coral}" stroke-width="1.8" fill="none" stroke-dasharray="6,4" opacity="0.85"/>
    <path d="M575 158 Q350 110 160 170" stroke="${SC.amber}" stroke-width="1.8" fill="none" stroke-dasharray="6,4" opacity="0.85"/>
    <path d="M575 158 Q590 210 575 250" stroke="${SC.teal}" stroke-width="1.5" fill="none" stroke-dasharray="4,4" opacity="0.7"/>

    <!-- tiny ships along routes -->
    ${[
      { x: 720, y: 115 }, { x: 360, y: 135 }, { x: 580, y: 220 },
    ].map(s => `
      <g transform="translate(${s.x},${s.y})">
        <path d="M-6 0 L6 0 L4 3 L-4 3 Z" fill="${SC.chalk}"/>
        <rect x="-1" y="-4" width="2" height="4" fill="${SC.chalk}"/>
      </g>
    `).join("")}
  </svg>`;
}

// Vijf vaardigheden overzicht
function svgFiveSkills() {
  // Use SC.paper for all icons so they show up on colored header backgrounds
  const skills = [
    { icon: ICON.scale(SC.paper),       title: "Waarom handelen landen?",       sub: "klein land, groot aandeel",     col: SC.indigo,    bgCol: SC.indigo },
    { icon: ICON.arrowRight(SC.paper),  title: "Factoren handelsstromen",        sub: "ligging, achterland, EU",       col: SC.amberDeep, bgCol: SC.amberDeep },
    { icon: ICON.coin(SC.paper),        title: "Omzet ≠ vrachtwaarde",           sub: "haven verdient aan diensten",   col: SC.tealDeep,  bgCol: SC.tealDeep },
    { icon: ICON.personOutline(SC.paper), title: "Arbeidsmigratie",             sub: "aanbod ↑, loon ↓, banen ↑",     col: SC.oliveDeep, bgCol: SC.oliveDeep },
    { icon: ICON.bank(SC.paper),        title: "Graviteitsvergelijking",        sub: "massa × massa / afstand²",      col: SC.coralDeep, bgCol: SC.coralDeep },
  ];
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Vijf vaardigheden voor internationale handel", "OVERZICHT PARAGRAAF")}

    ${skills.map((sk, i) => {
      const x = 80 + i * 232;
      const y = 170;
      return `
        <rect x="${x}" y="${y}" width="212" height="400" rx="12" fill="${SC.chalk}" stroke="${SC.cloud}" stroke-width="1"/>
        <rect x="${x}" y="${y}" width="212" height="130" rx="12" fill="${sk.bgCol}"/>
        <rect x="${x}" y="${y + 118}" width="212" height="12" fill="${sk.bgCol}"/>
        ${placeIcon(sk.icon, x + 86, y + 30, 40)}
        <text x="${x + 190}" y="${y + 34}" text-anchor="end" font-family="Segoe UI" font-size="24" font-weight="900" fill="${SC.chalk}" opacity="0.6">0${i+1}</text>
        <text x="${x + 106}" y="${y + 172}" text-anchor="middle" font-family="Segoe UI" font-size="12" font-weight="700" fill="${sk.col}" letter-spacing="2">VAARDIGHEID</text>
        <text x="${x + 106}" y="${y + 210}" text-anchor="middle" font-family="Segoe UI" font-size="17" font-weight="700" fill="${SC.indigo}">${sk.title}</text>
        <line x1="${x + 50}" y1="${y + 238}" x2="${x + 162}" y2="${y + 238}" stroke="${sk.col}" stroke-width="2"/>
        <text x="${x + 106}" y="${y + 274}" text-anchor="middle" font-family="Georgia, serif" font-size="13" font-style="italic" fill="${SC.smoke}">${sk.sub}</text>
      `;
    }).join("")}
  </svg>`;
}

// Handel als % van bbp — vergelijkende staafgrafiek
function svgHandelAlsAandeel() {
  const w = 1280, h = 640;
  const px = 140, py = 180, pw = 900, ph = 340;
  // Fictieve maar realistische waarden (% van bbp voor export+import)
  const bars = [
    { land: "Nederland", pct: 156, col: SC.coral,     note: "klein land · extreem open" },
    { land: "België",    pct: 168, col: SC.amberDeep, note: "klein land · doorvoerland" },
    { land: "Duitsland", pct: 88,  col: SC.teal,      note: "middelgroot · exportland" },
    { land: "VS",        pct: 25,  col: SC.olive,     note: "grote binnenmarkt" },
    { land: "China",     pct: 35,  col: SC.indigoSoft,note: "grote binnenmarkt" },
  ];
  const maxP = 180;
  const barW = 140;
  const gap = 30;

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Kleine landen handelen relatief méér", "HANDEL ALS % VAN BBP")}

    <!-- Y axis -->
    <line x1="${px}" y1="${py}" x2="${px}" y2="${py + ph}" stroke="${SC.ink}" stroke-width="1.5"/>
    <line x1="${px}" y1="${py + ph}" x2="${px + pw}" y2="${py + ph}" stroke="${SC.ink}" stroke-width="1.5"/>

    <!-- Gridlines at 50, 100, 150 -->
    ${[50, 100, 150].map(g => {
      const gy = py + ph - (g / maxP) * ph;
      return `
        <line x1="${px}" y1="${gy}" x2="${px + pw}" y2="${gy}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,4"/>
        <text x="${px - 10}" y="${gy + 5}" text-anchor="end" font-family="Segoe UI" font-size="12" fill="${SC.ash}">${g}%</text>
      `;
    }).join("")}

    <!-- Bars -->
    ${bars.map((b, i) => {
      const bx = px + 40 + i * (barW + gap);
      const bh = (b.pct / maxP) * ph;
      const by = py + ph - bh;
      return `
        <rect x="${bx}" y="${by}" width="${barW}" height="${bh}" fill="${b.col}"/>
        <text x="${bx + barW/2}" y="${by - 12}" text-anchor="middle" font-family="Segoe UI" font-size="22" font-weight="700" fill="${b.col}">${b.pct}%</text>
        <text x="${bx + barW/2}" y="${py + ph + 28}" text-anchor="middle" font-family="Segoe UI" font-size="15" font-weight="700" fill="${SC.indigo}">${b.land}</text>
        <text x="${bx + barW/2}" y="${py + ph + 48}" text-anchor="middle" font-family="Georgia, serif" font-size="11" font-style="italic" fill="${SC.smoke}">${b.note}</text>
      `;
    }).join("")}

    <!-- Y label -->
    <text x="60" y="${py + ph/2}" text-anchor="middle" font-family="Segoe UI" font-size="13" fill="${SC.smoke}" transform="rotate(-90, 60, ${py + ph/2})">Export + import als % van bbp</text>

    <!-- Callout on Nederland -->
    <g>
      <rect x="760" y="200" width="360" height="80" rx="8" fill="${SC.coralDeep}"/>
      <text x="780" y="228" font-family="Segoe UI" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="2">WAAROM ZO HOOG?</text>
      <text x="780" y="252" font-family="Segoe UI" font-size="14" fill="#ffffff">Nederland heeft een kleine eigen productie</text>
      <text x="780" y="272" font-family="Segoe UI" font-size="14" fill="#ffffff">en moet veel importeren + exporteren.</text>
    </g>

    <!-- Bottom insight -->
    <rect x="140" y="575" width="1000" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="160" y="601" font-family="Georgia, serif" font-size="16" font-style="italic" fill="#ffffff">Hoe kleiner het land, hoe groter het aandeel van handel in het bbp. Absoluut ≠ relatief.</text>
  </svg>`;
}

// Rotterdam handelsfactoren — center hub with cards arranged on left + right columns
function svgRotterdamFactoren() {
  const w = 1280, h = 640;
  const cx = 640, cy = 360;
  const r = 110;

  // 5 factoren — left column (2 kaarten) + right column (3 kaarten)
  const cardW = 320, cardH = 78;
  const factors = [
    // Left column (2 kaarten)
    { side: "L", row: 0, title: "Ligging aan zee",     sub: "diepzeehaven, toegang tot wereld",                 col: SC.teal       },
    { side: "L", row: 1, title: "Cultuur &amp; taal",  sub: "meertalig, internationale oriëntatie",              col: SC.plum       },
    // Right column (3 kaarten)
    { side: "R", row: 0, title: "Achterland",           sub: "Duitsland &amp; België: groot &amp; welvarend",     col: SC.amberDeep  },
    { side: "R", row: 1, title: "Infrastructuur",       sub: "Betuweroute, snelwegen, pijpleidingen",             col: SC.coral      },
    { side: "R", row: 2, title: "Handelsblok (EU)",     sub: "geen tarieven, vrij verkeer",                        col: SC.olive      },
  ];

  // layout: left column x = 60, right column x = 900. vertical: start y=180, gap 110.
  const leftX = 60, rightX = 900;
  const startYL = 240, startYR = 170, gap = 108;

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Waarom is Rotterdam de grootste haven van Europa?", "VIJF HANDELSFACTOREN")}

    <!-- Center hub -->
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${SC.indigo}"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 8}" fill="none" stroke="${SC.coral}" stroke-width="2"/>
    <text x="${cx}" y="${cy - 18}" text-anchor="middle" font-family="Segoe UI" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="3">ROTTERDAM</text>
    <text x="${cx}" y="${cy + 12}" text-anchor="middle" font-family="Segoe UI" font-size="26" font-weight="700" fill="#ffffff">Haven</text>
    <text x="${cx}" y="${cy + 40}" text-anchor="middle" font-family="Georgia, serif" font-size="13" font-style="italic" fill="${SC.cloud}">#1 Europa</text>

    <!-- Cards with spokes -->
    ${factors.map((f, i) => {
      const isLeft = f.side === "L";
      const bx = isLeft ? leftX : rightX;
      const by = (isLeft ? startYL : startYR) + f.row * gap;
      const cardCx = bx + cardW / 2;
      const cardCy = by + cardH / 2;
      // Spoke: from hub edge to card inner edge
      const dx = cardCx - cx, dy = cardCy - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hubX = cx + (dx / dist) * r;
      const hubY = cy + (dy / dist) * r;
      const cardInnerX = isLeft ? bx + cardW : bx;
      return `
        <line x1="${hubX}" y1="${hubY}" x2="${cardInnerX}" y2="${cardCy}" stroke="${f.col}" stroke-width="2.5"/>
        <rect x="${bx}" y="${by}" width="${cardW}" height="${cardH}" rx="10" fill="${SC.chalk}" stroke="${f.col}" stroke-width="2"/>
        <rect x="${bx}" y="${by}" width="8" height="${cardH}" fill="${f.col}"/>
        <text x="${bx + 20}" y="${by + 30}" font-family="Segoe UI" font-size="16" font-weight="700" fill="${SC.indigo}">${i+1}. ${f.title}</text>
        <text x="${bx + 20}" y="${by + 56}" font-family="Georgia, serif" font-size="12" font-style="italic" fill="${SC.smoke}">${f.sub}</text>
      `;
    }).join("")}

    <!-- Bottom insight -->
    <rect x="140" y="582" width="1000" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="160" y="608" font-family="Georgia, serif" font-size="15" font-style="italic" fill="#ffffff">Een grote haven is zelden het gevolg van één factor — het is de combinatie die telt.</text>
  </svg>`;
}

// Arbeidsmarkt met migratie — aanbod schuift naar rechts
function svgArbeidsmarktMigratie() {
  const w = 1280, h = 640;
  const px = 140, py = 140, pw = 760, ph = 370;
  const qMax = 40, pMax = 26;
  const qToX = q => px + (q / qMax) * pw;
  const pToY = p => py + ph - (p / pMax) * ph;

  // V (vraag): neergaand; passes through (20, 15) and goes (0, 25) down
  // V: W = 25 - 0.5 L → (0, 25) to (40, 5), but we cap at L=40
  // Original S1 (aanbod oud): opgaand, passeert (20, 15). Bijv: W = 5 + 0.5 L
  // New S2 (aanbod na migratie): parallel rechts, passeert (24, 13). Shift: 4 naar rechts
  // S1: W = 5 + 0.5L ; S2: W = 5 + 0.5(L - 4) = 3 + 0.5L
  // Intersect V=S1: 25 - 0.5L = 5 + 0.5L → L = 20, W = 15. Klopt.
  // Intersect V=S2: 25 - 0.5L = 3 + 0.5L → L = 22, W = 14.
  // Paragraph zegt L2=24, W2=13. Dus V en S2 anders: maken V steiler of S2 rechter.
  // V: W = 25 - 0.5L (passeert 20,15 en 24,13). Check: 25 - 0.5*24 = 25-12 = 13. Klopt!
  // S1: W = 5 + 0.5L (passeert 20,15).
  // S2 moet (24, 13) snijden met V. Helling gelijk: W = b + 0.5L, door (24,13): b = 13-12 = 1.
  // S2: W = 1 + 0.5L. Bij W=0: L=-2 (niet zichtbaar). Bij L=0: W=1.
  // Hmm liever beginnen vanaf L=0. Laten we S1 horizontal shift:
  // S1: passeert (0, 5) en (20, 15) → slope = 0.5
  // S2: passeert (0, 1) en (24, 13) → shift 4 omlaag = shift 8 naar rechts. Ok.

  const vLine = { m: -0.5, b: 25 };
  const s1Line = { m: 0.5, b: 5 };
  const s2Line = { m: 0.5, b: 1 };

  const v1 = { L: 0,  W: 25 };
  const v2 = { L: 40, W: 5 };
  const s1_1 = { L: 0,  W: 5 };
  const s1_2 = { L: 40, W: 25 };
  const s2_1 = { L: 0,  W: 1 };
  const s2_2 = { L: 40, W: 21 };

  const e1 = { L: 20, W: 15 };
  const e2 = { L: 24, W: 13 };

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Arbeidsmigratie — meer aanbod, lager loon, meer banen", "ARBEIDSMARKT · VERSCHUIVING AANBODCURVE")}

    <!-- Axes -->
    <line x1="${px}" y1="${py + ph}" x2="${px}" y2="${py - 10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py + ph}" x2="${px + pw + 10}" y2="${py + ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <text x="${px - 52}" y="${py + ph/2}" font-family="Segoe UI" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 52}, ${py + ph/2})">Loon W (euro per uur)</text>
    <text x="${px + pw/2}" y="${py + ph + 48}" font-family="Segoe UI" font-size="13" fill="${SC.smoke}" text-anchor="middle">Hoeveelheid arbeid L (werknemers)</text>

    <!-- Dashed refs before curves so they are behind -->
    <line x1="${qToX(e1.L)}" y1="${pToY(e1.W)}" x2="${qToX(e1.L)}" y2="${py + ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${pToY(e1.W)}" x2="${qToX(e1.L)}" y2="${pToY(e1.W)}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${qToX(e2.L)}" y1="${pToY(e2.W)}" x2="${qToX(e2.L)}" y2="${py + ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${pToY(e2.W)}" x2="${qToX(e2.L)}" y2="${pToY(e2.W)}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>

    <!-- V -->
    <line x1="${qToX(v1.L)}" y1="${pToY(v1.W)}" x2="${qToX(v2.L)}" y2="${pToY(v2.W)}" stroke="${SC.indigo}" stroke-width="3"/>
    <text x="${qToX(2) + 8}" y="${pToY(vLine.m * 2 + vLine.b) - 8}" font-family="Segoe UI" font-size="20" font-weight="700" fill="${SC.indigo}">V</text>

    <!-- A1 (oud aanbod) -->
    <line x1="${qToX(s1_1.L)}" y1="${pToY(s1_1.W)}" x2="${qToX(s1_2.L)}" y2="${pToY(s1_2.W)}" stroke="${SC.olive}" stroke-width="3"/>
    <text x="${qToX(36) + 4}" y="${pToY(s1Line.m * 36 + s1Line.b) - 10}" font-family="Segoe UI" font-size="20" font-weight="700" fill="${SC.olive}">A₁</text>

    <!-- A2 (nieuw aanbod na migratie) -->
    <line x1="${qToX(s2_1.L)}" y1="${pToY(s2_1.W)}" x2="${qToX(s2_2.L)}" y2="${pToY(s2_2.W)}" stroke="${SC.coral}" stroke-width="3"/>
    <text x="${qToX(36) + 4}" y="${pToY(s2Line.m * 36 + s2Line.b) + 24}" font-family="Segoe UI" font-size="20" font-weight="700" fill="${SC.coral}">A₂</text>

    <!-- Shift arrow from A1 to A2 (at a midpoint) -->
    <g>
      <line x1="${qToX(6)}" y1="${pToY(s1Line.m * 6 + s1Line.b)}" x2="${qToX(10)}" y2="${pToY(s2Line.m * 10 + s2Line.b)}" stroke="${SC.coralDeep}" stroke-width="2.4" marker-end="url(#ah-coral)"/>
      <text x="${qToX(3)}" y="${pToY(s2Line.m * 6 + s2Line.b) + 24}" font-family="Segoe UI" font-size="12" font-weight="700" fill="${SC.coralDeep}" letter-spacing="1">migratie</text>
    </g>

    <!-- Equilibria -->
    <circle cx="${qToX(e1.L)}" cy="${pToY(e1.W)}" r="8" fill="${SC.olive}"/>
    <circle cx="${qToX(e1.L)}" cy="${pToY(e1.W)}" r="14" fill="none" stroke="${SC.olive}" stroke-width="2" opacity="0.4"/>
    <circle cx="${qToX(e2.L)}" cy="${pToY(e2.W)}" r="8" fill="${SC.coralDeep}"/>
    <circle cx="${qToX(e2.L)}" cy="${pToY(e2.W)}" r="14" fill="none" stroke="${SC.coralDeep}" stroke-width="2" opacity="0.4"/>

    <!-- Axis value labels -->
    <text x="${px - 10}" y="${pToY(e1.W) + 5}" text-anchor="end" font-family="Segoe UI" font-size="14" fill="${SC.ink}" font-weight="700">€15</text>
    <text x="${px - 10}" y="${pToY(e2.W) + 5}" text-anchor="end" font-family="Segoe UI" font-size="14" fill="${SC.ink}" font-weight="700">€13</text>
    <text x="${qToX(e1.L)}" y="${py + ph + 22}" text-anchor="middle" font-family="Segoe UI" font-size="13" fill="${SC.ink}" font-weight="700">L₁ = 20</text>
    <text x="${qToX(e2.L)}" y="${py + ph + 22}" text-anchor="middle" font-family="Segoe UI" font-size="13" fill="${SC.ink}" font-weight="700">L₂ = 24</text>

    <!-- Callout: oud evenwicht — rechter gutter, boven -->
    <g>
      <rect x="940" y="180" width="260" height="72" rx="8" fill="${SC.olive}" fill-opacity="0.18" stroke="${SC.olive}" stroke-width="2"/>
      <text x="958" y="208" font-family="Segoe UI" font-size="12" font-weight="700" fill="${SC.oliveDeep}" letter-spacing="2">OUD EVENWICHT</text>
      <text x="958" y="236" font-family="Segoe UI" font-size="16" fill="${SC.ink}">L₁ = 20,  W₁ = €15</text>
      <line x1="940" y1="220" x2="${qToX(e1.L) + 12}" y2="${pToY(e1.W) - 4}" stroke="${SC.oliveDeep}" stroke-width="1.5" stroke-dasharray="4,3"/>
    </g>

    <!-- Callout: nieuw evenwicht — rechter gutter, midden -->
    <g>
      <rect x="940" y="290" width="260" height="72" rx="8" fill="${SC.coralDeep}"/>
      <text x="958" y="318" font-family="Segoe UI" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="2">NA MIGRATIE</text>
      <text x="958" y="346" font-family="Segoe UI" font-size="16" fill="#ffffff">L₂ = 24,  W₂ = €13</text>
      <line x1="940" y1="326" x2="${qToX(e2.L) + 12}" y2="${pToY(e2.W) + 6}" stroke="${SC.coralDeep}" stroke-width="1.5" stroke-dasharray="4,3"/>
    </g>

    <!-- Bottom insight -->
    <rect x="80" y="572" width="1120" height="44" rx="6" fill="${SC.indigoDeep}"/>
    <text x="100" y="600" font-family="Georgia, serif" font-size="15" font-style="italic" fill="#ffffff">Meer aanbod drukt het loon omlaag én vergroot de werkgelegenheid — werkgevers winnen, werknemers leveren in.</text>
  </svg>`;
}

// Graviteitsvergelijking — analogie zwaartekracht, NL-België visualisatie
function svgGraviteit() {
  const w = 1280, h = 640;
  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("De graviteitsvergelijking — handel werkt als zwaartekracht", "ANALOGIE UIT DE NATUURKUNDE")}

    <!-- Formule panel -->
    <g>
      <rect x="80" y="160" width="460" height="120" rx="10" fill="${SC.indigo}"/>
      <text x="100" y="192" font-family="Segoe UI" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="3">DE VERGELIJKING</text>
      <text x="100" y="236" font-family="Georgia, serif" font-size="32" font-weight="700" fill="#ffffff">Handel ≈ </text>
      <text x="260" y="224" font-family="Georgia, serif" font-size="20" fill="${SC.chalk}">massa × massa</text>
      <line x1="260" y1="236" x2="430" y2="236" stroke="#ffffff" stroke-width="1.5"/>
      <text x="280" y="262" font-family="Georgia, serif" font-size="20" fill="${SC.chalk}">afstand²</text>
    </g>

    <!-- Legenda -->
    <g>
      <rect x="80" y="300" width="460" height="220" rx="10" fill="${SC.chalk}" stroke="${SC.cloud}"/>
      <text x="100" y="332" font-family="Segoe UI" font-size="12" font-weight="700" fill="${SC.coral}" letter-spacing="2">WAT BETEKENT ELKE TERM?</text>

      <rect x="100" y="350" width="12" height="12" fill="${SC.coral}"/>
      <text x="122" y="360" font-family="Segoe UI" font-size="14" font-weight="700" fill="${SC.ink}">massa</text>
      <text x="122" y="378" font-family="Georgia, serif" font-size="13" fill="${SC.smoke}" font-style="italic">economische omvang (bbp)</text>

      <rect x="100" y="400" width="12" height="12" fill="${SC.teal}"/>
      <text x="122" y="410" font-family="Segoe UI" font-size="14" font-weight="700" fill="${SC.ink}">afstand</text>
      <text x="122" y="428" font-family="Georgia, serif" font-size="13" fill="${SC.smoke}" font-style="italic">geografisch + cultureel + handelsbarrières</text>

      <rect x="100" y="450" width="12" height="12" fill="${SC.amber}"/>
      <text x="122" y="460" font-family="Segoe UI" font-size="14" font-weight="700" fill="${SC.ink}">resultaat</text>
      <text x="122" y="478" font-family="Georgia, serif" font-size="13" fill="${SC.smoke}" font-style="italic">verwachte omvang van de handel</text>
    </g>

    <!-- NL-België visualisatie rechts -->
    <g>
      <rect x="580" y="160" width="620" height="360" rx="10" fill="${SC.chalk}" stroke="${SC.cloud}"/>
      <text x="600" y="192" font-family="Segoe UI" font-size="12" font-weight="700" fill="${SC.coral}" letter-spacing="2">TOEPASSING · NEDERLAND — BELGIË</text>

      <!-- NL cirkel -->
      <circle cx="720" cy="360" r="68" fill="${SC.coral}" fill-opacity="0.85"/>
      <text x="720" y="350" text-anchor="middle" font-family="Segoe UI" font-size="22" font-weight="700" fill="#ffffff">NL</text>
      <text x="720" y="376" text-anchor="middle" font-family="Georgia, serif" font-size="12" font-style="italic" fill="#ffffff">bbp ≈ €1.000 mrd</text>

      <!-- België cirkel -->
      <circle cx="1030" cy="360" r="60" fill="${SC.teal}" fill-opacity="0.85"/>
      <text x="1030" y="350" text-anchor="middle" font-family="Segoe UI" font-size="22" font-weight="700" fill="#ffffff">BE</text>
      <text x="1030" y="376" text-anchor="middle" font-family="Georgia, serif" font-size="12" font-style="italic" fill="#ffffff">bbp ≈ €560 mrd</text>

      <!-- Verbindings "gravitatiekracht" -->
      <line x1="788" y1="360" x2="970" y2="360" stroke="${SC.amber}" stroke-width="6"/>
      <polyline points="962,350 974,360 962,370" fill="none" stroke="${SC.amber}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="796,350 784,360 796,370" fill="none" stroke="${SC.amber}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="879" y="345" text-anchor="middle" font-family="Segoe UI" font-size="13" font-weight="700" fill="${SC.amberDeep}" letter-spacing="2">HANDEL</text>
      <text x="879" y="388" text-anchor="middle" font-family="Georgia, serif" font-size="12" font-style="italic" fill="${SC.smoke}">afstand ≈ 200 km</text>

      <!-- 4 factoren onderin -->
      <text x="600" y="450" font-family="Segoe UI" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="2">WAAROM HEEL VEEL HANDEL?</text>
      ${[
        { x: 600, t: "nabijheid" },
        { x: 755, t: "grote bbp's" },
        { x: 910, t: "EU-lidmaatschap" },
        { x: 1075, t: "cultuur &amp; taal" },
      ].map(f => `
        <circle cx="${f.x + 8}" cy="477" r="4" fill="${SC.coral}"/>
        <text x="${f.x + 20}" y="482" font-family="Segoe UI" font-size="13" fill="${SC.ink}">${f.t}</text>
      `).join("")}
    </g>

    <!-- Bottom insight -->
    <rect x="80" y="560" width="1120" height="50" rx="6" fill="${SC.indigoDeep}"/>
    <text x="100" y="592" font-family="Georgia, serif" font-size="16" font-style="italic" fill="#ffffff">Meer massa + minder afstand = meer handel. De formule verklaart waarom NL-België zó veel handelt.</text>
  </svg>`;
}

// Omzet vs. vrachtwaarde — denkfout visualisatie
function svgOmzetVsVracht() {
  const w = 1280, h = 640;
  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("De denkfout: omzet haven ≠ waarde van de vracht", "BEDRIJFSECONOMIE · VEELGEMAAKTE FOUT")}

    <!-- LEFT: Omzet haven -->
    <rect x="80" y="160" width="540" height="400" rx="14" fill="${SC.chalk}" stroke="${SC.teal}" stroke-width="2"/>
    <rect x="80" y="160" width="540" height="60" rx="14" fill="${SC.tealDeep}"/>
    <rect x="80" y="208" width="540" height="12" fill="${SC.tealDeep}"/>
    <text x="350" y="198" text-anchor="middle" font-family="Segoe UI" font-size="22" font-weight="700" fill="#ffffff">Omzet van de haven</text>

    <text x="350" y="265" text-anchor="middle" font-family="Segoe UI" font-size="13" font-weight="700" fill="${SC.ash}" letter-spacing="2">INKOMSTEN UIT DIENSTVERLENING</text>
    <text x="350" y="325" text-anchor="middle" font-family="Segoe UI" font-size="52" font-weight="700" fill="${SC.tealDeep}">€ 707,2 mln</text>
    <text x="350" y="360" text-anchor="middle" font-family="Georgia, serif" font-size="15" font-style="italic" fill="${SC.smoke}">(laden, lossen, opslaan, doorvoer)</text>

    <line x1="140" y1="390" x2="560" y2="390" stroke="${SC.cloud}"/>

    ${[
      { k: "eigenaar", v: "havenbedrijf" },
      { k: "bron", v: "dienstverlening aan schepen" },
      { k: "blijft bij", v: "de haven" },
    ].map((r, i) => `
      <text x="110" y="${420 + i * 36}" font-family="Segoe UI" font-size="12" fill="${SC.ash}" letter-spacing="1">${r.k.toUpperCase()}</text>
      <text x="590" y="${420 + i * 36}" text-anchor="end" font-family="Georgia, serif" font-size="15" font-style="italic" fill="${SC.tealDeep}" font-weight="700">${r.v}</text>
    `).join("")}

    <!-- RIGHT: Waarde vracht -->
    <rect x="660" y="160" width="540" height="400" rx="14" fill="${SC.chalk}" stroke="${SC.coral}" stroke-width="2"/>
    <rect x="660" y="160" width="540" height="60" rx="14" fill="${SC.coralDeep}"/>
    <rect x="660" y="208" width="540" height="12" fill="${SC.coralDeep}"/>
    <text x="930" y="198" text-anchor="middle" font-family="Segoe UI" font-size="22" font-weight="700" fill="#ffffff">Waarde van de vracht</text>

    <text x="930" y="265" text-anchor="middle" font-family="Segoe UI" font-size="13" font-weight="700" fill="${SC.ash}" letter-spacing="2">TOTALE GOEDERENWAARDE</text>
    <text x="930" y="325" text-anchor="middle" font-family="Segoe UI" font-size="52" font-weight="700" fill="${SC.coralDeep}">veel hoger</text>
    <text x="930" y="360" text-anchor="middle" font-family="Georgia, serif" font-size="15" font-style="italic" fill="${SC.smoke}">(olie, containers, auto's, voedsel...)</text>

    <line x1="720" y1="390" x2="1140" y2="390" stroke="${SC.cloud}"/>

    ${[
      { k: "eigenaar", v: "importeurs / exporteurs" },
      { k: "bron", v: "de goederen zelf" },
      { k: "blijft bij", v: "eigenaar van de goederen" },
    ].map((r, i) => `
      <text x="690" y="${420 + i * 36}" font-family="Segoe UI" font-size="12" fill="${SC.ash}" letter-spacing="1">${r.k.toUpperCase()}</text>
      <text x="1170" y="${420 + i * 36}" text-anchor="end" font-family="Georgia, serif" font-size="15" font-style="italic" fill="${SC.coralDeep}" font-weight="700">${r.v}</text>
    `).join("")}

    <!-- Bottom warning insight -->
    <rect x="80" y="582" width="1120" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="100" y="608" font-family="Georgia, serif" font-size="15" font-style="italic" fill="#ffffff">Delen van de havenomzet door het aantal schepen geeft géén omzet per schip — de vracht is niet van de haven.</text>
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
    ...T.heroDark, fontSize: 54, charSpacing: -2,
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.6, y: 3.9, w: 8.8, h: 0.6,
      ...T.subheadDark, fontFace: FONT_SERIF, italic: true,
    });
  }
  s.addShape("rect", { x: 0.6, y: 3.65, w: 0.6, h: 0.04, fill: { color: PC.coral } });
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

// ═══════════════════════════════════════════════════════════════════════════
// BUILD
// ═══════════════════════════════════════════════════════════════════════════
async function build() {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: "CUSTOM_16x9", width: 10, height: 5.625 });
  pres.layout = "CUSTOM_16x9";
  pres.author = "Economie VWO";
  pres.title = "3.4.1 Internationale handel";

  defineMasters(pres, {
    darkLabel:  "PARAGRAAF  ·  §3.4",
    lightLabel: "§ 3.4  ·  INTERNATIONALE MARKTEN",
  });

  // Build SVGs
  const svgs = {
    worldMap:       svgWorldTradeSilhouette(),
    fiveSkills:     svgFiveSkills(),
    handelAandeel:  svgHandelAlsAandeel(),
    rotterdam:      svgRotterdamFactoren(),
    arbeidsmarkt:   svgArbeidsmarktMigratie(),
    omzetVracht:    svgOmzetVsVracht(),
    graviteit:      svgGraviteit(),
  };
  const imgs = {};
  for (const [k, v] of Object.entries(svgs)) imgs[k] = await svgData(v, 1440);

  // ────────────────────────────────────────────────────────────────────
  // DIA 1 — Cinematic opener: wereldkaart met handelsroutes
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addImage({ data: imgs.worldMap, x: 0, y: 2.4, w: 10, h: 3.28 });

    s.addText("§ 3.4.1", {
      x: 0.6, y: 0.5, w: 4, h: 0.4,
      ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6,
    });
    s.addText("Internationale handel", {
      x: 0.6, y: 0.95, w: 8.8, h: 1.3,
      ...T.heroDark, fontSize: 60, charSpacing: -2,
    });
    s.addText("Hoofdstuk 4 · Internationale markten  ·  Praktische Economie VWO", {
      x: 0.6, y: 2.3, w: 8.8, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.cloud,
    });

    s.addNotes("Welkom. Nederland is een klein land met een enorme haven en een open economie. In deze paragraaf kijken we waarom landen eigenlijk handelen, welke factoren dat bepalen en welke denkfouten leerlingen maken. Vijf vaardigheden — in ongeveer 60 minuten.");
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
    s.addText("Waarom handelen\nlanden eigenlijk?", {
      x: 1.8, y: 1.4, w: 8, h: 2.6,
      fontFace: FONT_DISPLAY, fontSize: 56, bold: true, color: PC.chalk, charSpacing: -2, lineSpacingMultiple: 1.05,
    });
    s.addText("En waarom handelt Nederland — relatief — zóveel?", {
      x: 1.8, y: 4.3, w: 8, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.amber,
    });
    s.addNotes("Laat de vraag even hangen. Zonder direct antwoord. Dit is de denkvraag van de les. Kom er aan het einde op terug.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 3 — Leerdoelen (sidebar)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = sidebarSlide(pres, {
      sidebarKicker: "Wat ga je leren",
      sidebarTitle: "Vijf vaardigheden voor één uur",
      sidebarBody: "Na deze paragraaf kun je verklaren waarom landen handelen en herken je klassieke denkfouten.",
    });
    const doelen = [
      { n: "01", t: "Uitleggen waarom kleine landen relatief meer handelen" },
      { n: "02", t: "Vijf factoren voor handelsstromen benoemen" },
      { n: "03", t: "Omzet en vrachtwaarde zuiver onderscheiden" },
      { n: "04", t: "Effecten van arbeidsmigratie grafisch analyseren" },
      { n: "05", t: "De graviteitsvergelijking toepassen op bilaterale handel" },
    ];
    doelen.forEach((d, i) => {
      const y = 0.75 + i * 0.88;
      s.addText(d.n, {
        x: 2.3, y, w: 1.1, h: 0.7,
        fontFace: FONT_DISPLAY, fontSize: 34, bold: true, color: PC.coral, charSpacing: -1,
      });
      s.addText(d.t, {
        x: 3.4, y: y + 0.1, w: 6.3, h: 0.6,
        fontFace: FONT_SANS, fontSize: 16, color: PC.ink, valign: "middle",
      });
      if (i < doelen.length - 1) {
        s.addShape("rect", { x: 2.3, y: y + 0.78, w: 7.4, h: 0.01, fill: { color: PC.cloud } });
      }
    });
    s.addNotes("Vijf leerdoelen — elke vaardigheid krijgt een eigen blok in de paragraaf. Alle vijf komen ook in opdrachten terug.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 4 — Vijf vaardigheden overzicht SVG
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.fiveSkills, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("De kapstok van de les. Vijf vaardigheden — de eerste twee en de laatste horen bij marktanalyse, de derde bij bedrijfseconomie, de vierde bij arbeidsmarkt.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 5 — Section divider: VAARDIGHEID 1
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Vaardigheid 01",
    title: "Waarom handelen landen?",
    subtitle: "Niet elk land kan alles zelf produceren. Kleine landen kunnen het al helemaal niet.",
    notes: "Start met het intuïtieve voorbeeld: Nederland produceert geen eigen olie, geen bananen, geen koffie. Dus moet het ruilen — export in ruil voor import.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 6 — Kernbegrip: kleine landen handelen relatief meer
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Kernidee · vaardigheid 1",
      title: "Hoe kleiner het land, hoe groter het handelsaandeel.",
      notes: "Benadruk het woord 'relatief'. China handelt in absolute euro's meer dan Nederland, maar als percentage van het bbp veel minder.",
    });

    // LEFT: waarom
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.sky }, line: { color: PC.cloud, width: 0.75 } });
    s.addText("WAAROM HANDELEN LANDEN?", {
      x: 0.7, y: 2.15, w: 4, h: 0.3,
      ...T.labelUpper, color: PC.indigo, fontSize: 11, charSpacing: 3,
    });
    s.addText([
      { text: "Niet elk land", options: { bold: true, color: PC.indigo } },
      { text: " kan alles zelf produceren.\n\n", options: {} },
      { text: "Landen ", options: { color: PC.ink } },
      { text: "importeren", options: { bold: true, color: PC.coralDeep } },
      { text: " wat ze niet hebben en ", options: {} },
      { text: "exporteren", options: { bold: true, color: PC.tealDeep } },
      { text: " wat ze goed kunnen maken.", options: {} },
    ], {
      x: 0.7, y: 2.55, w: 4, h: 2.4,
      fontFace: FONT_SERIF, fontSize: 17, color: PC.ink, italic: true, lineSpacingMultiple: 1.35,
    });

    // RIGHT: denk-voorbeeld
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.indigo } });
    s.addText("NEDERLAND IN CIJFERS", {
      x: 5.3, y: 2.15, w: 4, h: 0.3,
      ...T.labelUpper, color: PC.amber, fontSize: 11, charSpacing: 3,
    });
    s.addText([
      { text: "klein land", options: { bold: true, color: PC.chalk, fontSize: 18 } },
      { text: " — weinig grondstoffen,\n", options: { color: PC.cloud, fontSize: 15 } },
      { text: "beperkte interne markt\n\n", options: { color: PC.cloud, fontSize: 15 } },
      { text: "→ export + import samen\n", options: { color: PC.cloud, fontSize: 15 } },
      { text: "meer dan 150 % van het bbp\n\n", options: { bold: true, color: PC.amber, fontSize: 17 } },
      { text: "Vergelijk VS: ongeveer 25 %.", options: { italic: true, color: PC.coral, fontSize: 14, fontFace: FONT_SERIF } },
    ], {
      x: 5.3, y: 2.55, w: 4, h: 2.4,
      fontFace: FONT_SANS, lineSpacingMultiple: 1.4,
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 7 — Handel als % van bbp (staafgrafiek)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.handelAandeel, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Wijs expliciet: Nederland en België zitten boven 150 %. De VS onder 30 %. Het verschil is niet dat de VS 'slechter' is — het is dat de VS een enorme interne markt heeft, waardoor internationale handel relatief minder belangrijk is.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 8 — Hero stat: 156 % van bbp
  // ────────────────────────────────────────────────────────────────────
  heroStat(pres, {
    kicker: "NEDERLAND  ·  EXPORT + IMPORT",
    stat: "156 %",
    subtitle: "van het bbp gaat via internationale handel",
    body: "\u201C… dus ruim anderhalf keer zoveel als onze hele binnenlandse productie.\u201D",
    notes: "Zet deze cijfer in perspectief: meer dan 1,5× het bbp. Geen enkel groot land komt in de buurt. Dit is typisch voor kleine, open economieën.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 9 — Section divider: VAARDIGHEID 2
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Vaardigheid 02",
    title: "Wat bepaalt de handelsstromen?",
    subtitle: "Niet alle landen handelen evenveel met elkaar — vijf factoren verklaren de verschillen.",
    notes: "Rotterdam is niet toevallig de grootste haven van Europa. Het is de combinatie van vijf factoren. Deze vaardigheid brengt ze systematisch in kaart.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 10 — Rotterdam factoren radial infographic
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.rotterdam, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Vijf factoren: ligging, achterland, infrastructuur, handelsblok, cultuur. Elke factor apart is niet genoeg — het is de combinatie. Laat leerlingen nadenken: welke factor zou je kunnen veranderen? (alleen EU-beleid en infrastructuur zijn beleidsmatig te sturen).");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 11 — Tip: meerdere factoren noemen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Examentip · vaardigheid 2",
      title: "Bij een vraag over Rotterdam: noem altijd meerdere factoren.",
      notes: "Bij toetsen: als ze vragen 'waarom is de haven zo groot', is één factor nooit genoeg. Minstens 3 — bij voorkeur 4 of 5. Elke factor kort toelichten.",
    });

    // Good vs insufficient answer comparison
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.chalk }, line: { color: PC.coral, width: 2 } });
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 0.08, fill: { color: PC.coral } });
    s.addText("ONVOLDOENDE ANTWOORD", {
      x: 0.75, y: 2.2, w: 3.9, h: 0.3,
      ...T.labelUpper, color: PC.coralDeep, fontSize: 11, charSpacing: 3,
    });
    s.addText("\u201COmdat Rotterdam aan zee ligt.\u201D", {
      x: 0.75, y: 2.6, w: 3.9, h: 0.9,
      fontFace: FONT_SERIF, fontSize: 18, italic: true, color: PC.coralDeep, lineSpacingMultiple: 1.3,
    });
    s.addText("Eén factor is niet genoeg. Veel andere havensteden liggen óók aan zee.", {
      x: 0.75, y: 3.9, w: 3.9, h: 1,
      fontFace: FONT_SANS, fontSize: 13, color: PC.ink, italic: true,
    });

    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.chalk }, line: { color: PC.olive, width: 2 } });
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 0.08, fill: { color: PC.olive } });
    s.addText("VOLLEDIG ANTWOORD", {
      x: 5.35, y: 2.2, w: 3.9, h: 0.3,
      ...T.labelUpper, color: PC.oliveDeep, fontSize: 11, charSpacing: 3,
    });
    [
      "ligging aan zee (diepzeehaven)",
      "groot, welvarend achterland (DE, BE)",
      "Betuweroute + snelwegnetwerk",
      "EU-lidmaatschap (geen tarieven)",
    ].forEach((t, i) => {
      s.addShape("rect", { x: 5.35, y: 2.7 + i * 0.45, w: 0.12, h: 0.12, fill: { color: PC.olive } });
      s.addText(t, {
        x: 5.55, y: 2.62 + i * 0.45, w: 3.75, h: 0.35,
        fontFace: FONT_SANS, fontSize: 14, color: PC.ink, valign: "middle",
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 12 — Section divider: VAARDIGHEID 3
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Vaardigheid 03",
    title: "Omzet of vrachtwaarde?",
    subtitle: "De klassieke denkfout: de haven verdient niet aan de goederen in de schepen.",
    notes: "Dit is dé valkuil in de bedrijfseconomische deelvraag. Lees altijd precies wat het getal betekent.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 13 — Omzet vs vracht grote illustratie
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.omzetVracht, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Benadruk: de haven levert een dienst. Het is een service-provider. De goederen zelf zijn van iemand anders — de importeurs en exporteurs. Als je 'omzet per schip' uitrekent door te delen, behandel je de haven alsof hij eigenaar van de goederen is. Dat klopt niet.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 14 — Denkfout: delen is fout (werkvoorbeeld)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Uitgewerkt voorbeeld",
      title: "Johan deelt € 707,2 mln door 29.476 schepen.",
      subtitle: "Waarom is de uitkomst (€ 23.992) niet de 'omzet per schip' die hij zoekt?",
      notes: "Het is technisch wél een deling. Maar de € 707,2 mln is totale omzet uit dienstverlening — laden, lossen, doorvoer. De haven ontvangt geld voor de dienst die ze leveren aan elk schip; dat kán de gemiddelde dienstvergoeding per schip zijn, maar Johan noemt het 'omzet per schip' in de context alsof het de vrachtwaarde is. Dat is de fout.",
    });

    // Stepped breakdown
    const steps = [
      { num: "01", title: "Wat is € 707,2 mln?", body: "Totale omzet uit dienstverlening van het havenbedrijf.", col: PC.teal },
      { num: "02", title: "Wat is 29.476?", body: "Aantal zeeschepen dat de haven in één jaar aandeed.", col: PC.amberDeep },
      { num: "03", title: "Wat is de uitkomst?", body: "Gemiddelde dienstvergoeding per schip. Niét de vrachtwaarde.", col: PC.coralDeep },
    ];
    steps.forEach((st, i) => {
      const y = 2.05 + i * 0.96;
      s.addShape("rect", { x: 0.5, y, w: 9, h: 0.86, fill: { color: PC.chalk }, line: { color: st.col, width: 1.5 } });
      s.addShape("rect", { x: 0.5, y, w: 0.1, h: 0.86, fill: { color: st.col } });
      s.addText(st.num, {
        x: 0.75, y: y + 0.15, w: 1.0, h: 0.55,
        fontFace: FONT_DISPLAY, fontSize: 28, bold: true, color: st.col, charSpacing: -0.5,
      });
      s.addText(st.title, {
        x: 1.85, y: y + 0.05, w: 3.2, h: 0.75,
        fontFace: FONT_SANS, fontSize: 17, bold: true, color: PC.indigo, valign: "middle",
      });
      s.addText(st.body, {
        x: 5.15, y: y + 0.05, w: 4.3, h: 0.75,
        fontFace: FONT_SERIF, fontSize: 13, italic: true, color: PC.smoke, valign: "middle",
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 15 — Section divider: VAARDIGHEID 4
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Vaardigheid 04",
    title: "Arbeidsmigratie",
    subtitle: "Wat gebeurt er als buitenlandse werknemers de Nederlandse arbeidsmarkt betreden?",
    notes: "Begrip: buitenlandse werknemers behoren tot het binnenlandse arbeidsaanbod. Ze bieden arbeid aan, ze vragen het niet. Aanbodcurve schuift naar rechts.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 16 — Kernidee: aanbod schuift naar rechts
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Kernidee · vaardigheid 4",
      title: "Migratie = meer arbeidsaanbod = rechtse shift van A.",
      notes: "Let op: veel leerlingen denken dat buitenlandse werknemers arbeid 'vragen'. Dat is fout. Ze bieden arbeid aan. Daarom schuift het aanbod, niet de vraag.",
    });

    // Causal chain
    const chain = [
      { t: "Buitenlandse\nwerknemers\nkomen",     col: PC.indigo,    emph: false },
      { t: "Arbeidsaanbod\nneemt toe",             col: PC.coral,     emph: false },
      { t: "A schuift\nnaar rechts",                col: PC.coralDeep, emph: true  },
      { t: "Loon daalt,\nbanen toenemen",           col: PC.olive,     emph: false },
    ];
    const n = chain.length, w = 2.05, gap = 0.17, startX = 0.5, y = 2.3, h = 1.85;
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
          x: x + w - 0.02, y: y + h/2 - 0.2, w: 0.22, h: 0.4,
          fontFace: FONT_SANS, fontSize: 22, bold: true, color: PC.ash, align: "center",
        });
      }
    });
    s.addShape("rect", { x: 0.5, y: 4.35, w: 9, h: 0.75, fill: { color: PC.indigoDeep } });
    s.addText([
      { text: "LET OP  ·  ", options: { bold: true, color: PC.amber, fontSize: 11, charSpacing: 3 } },
      { text: "Buitenlandse werknemers vragen géén arbeid — ze bieden het aan. Daarom schuift A, niet V.",
        options: { color: PC.chalk, fontSize: 14, fontFace: FONT_SERIF, italic: true } },
    ], {
      x: 0.7, y: 4.4, w: 8.6, h: 0.65, valign: "middle",
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 17 — Arbeidsmarkt grafiek (SVG)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.arbeidsmarkt, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("De grafiek. Oud evenwicht E₁ op A₁ en V: L₁ = 20, W₁ = €15. Na migratie schuift A naar rechts (A₂). Nieuw evenwicht E₂: L₂ = 24 (meer banen), W₂ = €13 (lager loon). Twee effecten tegelijk — werkgevers winnen, werknemers leveren loon in.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 18 — Wie wint, wie verliest
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Gevolgen · vaardigheid 4",
      title: "Wie profiteert — en wie levert in?",
      notes: "Benadruk dat beide gevolgen tegelijk optreden. Het is geen 'of-of', het is 'en-en'. Politiek debat gaat meestal over de tweede groep.",
    });

    // Left: winnaars
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.chalk }, line: { color: PC.olive, width: 2 } });
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 0.08, fill: { color: PC.olive } });
    s.addText("WINNAARS", {
      x: 0.75, y: 2.2, w: 3.9, h: 0.3,
      ...T.labelUpper, color: PC.oliveDeep, fontSize: 12, charSpacing: 4,
    });
    s.addText("Werkgevers & consumenten", {
      x: 0.75, y: 2.55, w: 3.9, h: 0.5,
      fontFace: FONT_DISPLAY, fontSize: 20, bold: true, color: PC.indigo, charSpacing: -0.5,
    });
    [
      "meer keuze aan werknemers",
      "lagere loonkosten",
      "goedkopere producten/diensten",
      "meer productie mogelijk",
    ].forEach((t, i) => {
      s.addShape("rect", { x: 0.9, y: 3.25 + i * 0.38, w: 0.12, h: 0.12, fill: { color: PC.olive } });
      s.addText(t, {
        x: 1.1, y: 3.18 + i * 0.38, w: 3.7, h: 0.3,
        fontFace: FONT_SANS, fontSize: 13, color: PC.ink, valign: "middle",
      });
    });

    // Right: verliezers
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.chalk }, line: { color: PC.coral, width: 2 } });
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 0.08, fill: { color: PC.coral } });
    s.addText("VERLIEZERS", {
      x: 5.35, y: 2.2, w: 3.9, h: 0.3,
      ...T.labelUpper, color: PC.coralDeep, fontSize: 12, charSpacing: 4,
    });
    s.addText("Binnenlandse werknemers", {
      x: 5.35, y: 2.55, w: 3.9, h: 0.5,
      fontFace: FONT_DISPLAY, fontSize: 20, bold: true, color: PC.indigo, charSpacing: -0.5,
    });
    [
      "meer concurrentie om banen",
      "lagere lonen (W daalt)",
      "vooral in laaggeschoolde sectoren",
      "politiek: gevoelig thema",
    ].forEach((t, i) => {
      s.addShape("ellipse", { x: 5.5, y: 3.25 + i * 0.38, w: 0.12, h: 0.12, fill: { color: PC.coral } });
      s.addText(t, {
        x: 5.7, y: 3.18 + i * 0.38, w: 3.7, h: 0.3,
        fontFace: FONT_SANS, fontSize: 13, color: PC.ink, valign: "middle",
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 19 — Section divider: VAARDIGHEID 5
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Vaardigheid 05",
    title: "De graviteitsvergelijking",
    subtitle: "Handel werkt als zwaartekracht: meer massa én minder afstand = meer aantrekking.",
    notes: "Een mooi bruggetje naar de natuurkunde. De formule klinkt abstract, maar voorspelt verbluffend goed welke landen veel en welke weinig handelen.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 20 — Graviteit grote infographic
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.graviteit, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("De analogie. 'Massa' is bbp — hoe groter de economie, hoe meer er te handelen valt. 'Afstand' is niet alleen kilometers — ook cultuur, taal, en handelsbarrières. NL en België: klein in afstand, groot in bbp, veel handel.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 21 — Tip: vier factoren geven
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Examentip · vaardigheid 5",
      title: "Vier factoren die je altijd kunt gebruiken.",
      subtitle: "Bij een vraag 'noem vier factoren die de handel tussen twee landen verklaren'.",
      notes: "Deze vier zijn robuust — toepasbaar op vrijwel elke casus. Geef bij elke factor een korte toelichting uit de casus.",
    });

    const factors = [
      { num: "01", title: "Nabijheid", body: "kleine geografische afstand verlaagt transportkosten", col: PC.indigo },
      { num: "02", title: "Omvang economieën", body: "twee grote bbp's betekent veel potentieel om te ruilen", col: PC.teal },
      { num: "03", title: "Handelsblok", body: "EU-lidmaatschap betekent geen invoertarieven", col: PC.amberDeep },
      { num: "04", title: "Cultuur & politiek", body: "vergelijkbare systemen vergemakkelijken contracten", col: PC.coral },
    ];
    factors.forEach((f, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = 0.5 + col * 4.7;
      const y = 2.05 + row * 1.5;
      s.addShape("rect", { x, y, w: 4.3, h: 1.3, fill: { color: PC.chalk }, line: { color: f.col, width: 1.5 } });
      s.addShape("rect", { x, y, w: 0.1, h: 1.3, fill: { color: f.col } });
      s.addText(f.num, {
        x: x + 0.2, y: y + 0.15, w: 1.0, h: 0.6,
        fontFace: FONT_DISPLAY, fontSize: 26, bold: true, color: f.col, charSpacing: -0.5,
      });
      s.addText(f.title, {
        x: x + 1.2, y: y + 0.12, w: 3.0, h: 0.45,
        fontFace: FONT_SANS, fontSize: 17, bold: true, color: PC.indigo,
      });
      s.addText(f.body, {
        x: x + 1.2, y: y + 0.55, w: 3.0, h: 0.7,
        fontFace: FONT_SERIF, fontSize: 12, italic: true, color: PC.smoke, lineSpacingMultiple: 1.3,
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 22 — Valkuilen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Denkfouten",
      title: "Drie valkuilen die bij de toets altijd terugkomen.",
      notes: "Laat de klas eerst de claims lezen, en voorspellen waarom ze fout zijn. Daarna de waarheid onthullen.",
    });
    const items = [
      { num: "01", claim: "Omzet haven = waarde van de vracht",
        truth: "Onjuist. De haven verdient aan dienstverlening. De vracht zelf is van de importeurs en exporteurs." },
      { num: "02", claim: "Buitenlandse werknemers vragen arbeid",
        truth: "Onjuist. Ze bieden arbeid aan en horen bij het binnenlandse arbeidsaanbod. Daarom schuift A, niet V." },
      { num: "03", claim: "China handelt meer dan Nederland",
        truth: "Alleen absoluut. Relatief (als % van bbp) handelt Nederland véél meer — 156 % vs 35 %." },
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
    s.addText("Vijf dingen om te onthouden", {
      x: 0.6, y: 0.9, w: 8.8, h: 0.8,
      ...T.headlineDark, fontSize: 32, charSpacing: -1,
    });
    const items = [
      { n: "01", t: "Kleine landen handelen relatief meer (% van bbp)" },
      { n: "02", t: "Vijf factoren bepalen handelsstromen — nooit maar één" },
      { n: "03", t: "Omzet haven ≠ vrachtwaarde; de haven verkoopt diensten" },
      { n: "04", t: "Arbeidsmigratie: A schuift rechts, W daalt, L stijgt" },
      { n: "05", t: "Graviteit: meer massa + minder afstand = meer handel" },
    ];
    items.forEach((it, i) => {
      const y = 1.95 + i * 0.58;
      s.addText(it.n, {
        x: 0.6, y, w: 0.7, h: 0.5,
        fontFace: FONT_DISPLAY, fontSize: 24, bold: true, color: PC.coral, charSpacing: -1,
      });
      s.addText(it.t, {
        x: 1.4, y: y + 0.05, w: 8.1, h: 0.45,
        fontFace: FONT_SANS, fontSize: 16, color: PC.chalk, valign: "middle",
      });
      if (i < items.length - 1) {
        s.addShape("rect", { x: 0.6, y: y + 0.52, w: 8.8, h: 0.005, fill: { color: PC.indigoSoft } });
      }
    });
    s.addNotes("Retrieval: laat leerlingen deze vijf punten aan elkaar uitleggen zonder slide. Wie struikelt, gaat terug naar dat concept.");
  }

  // ────────────────────────────────────────────────────────────────────
  // OUTPUT
  // ────────────────────────────────────────────────────────────────────
  const outDir = path.resolve(__dirname, "../../output-341");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Save raw SVGs for debugging
  const svgDir = path.join(outDir, "svg");
  if (!fs.existsSync(svgDir)) fs.mkdirSync(svgDir, { recursive: true });
  for (const [k, v] of Object.entries(svgs)) {
    fs.writeFileSync(path.join(svgDir, `341-${k}.svg`), v, "utf8");
  }

  const outPath = path.join(outDir, "3.4.1 Internationale handel – presentatie.pptx");
  await pres.writeFile({ fileName: outPath });
  const fix = await fixPptxFile(outPath);
  roundtripWithLibreOffice(outPath);
  console.log(`PPTX written to ${outPath} (fix: -${fix.removedOverrides} phantom overrides, -${fix.removedEmptyDirs} empty dirs; roundtripped via LibreOffice)`);
}

build().catch(e => { console.error(e); process.exit(1); });
