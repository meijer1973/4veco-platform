/**
 * pptx-343-intra-industriele-handel.js — §3.4.3 Intra-industriële handel
 * CREATIVE/UNRESTRICTED version — editorial design system, rich illustration.
 */

const {
  PC, SC, T, FONT_SANS, FONT_DISPLAY, FONT_SERIF,
  defineMasters,
  svgData,
  ICON, placeIcon,
  svgHeader, editorialTitle, fixPptxFile, roundtripWithLibreOffice,
} = require("./lib-pptx.js");

const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM SVG SCENES + ANNOTATED CHARTS
// ═══════════════════════════════════════════════════════════════════════════

// Opening visual — stylized European map with trade flows between cars
function svgTradeFlowsOpener() {
  return `${svgHeader(1280, 420, SC.indigoDeep)}
    <!-- sparse stars -->
    ${Array.from({ length: 28 }, (_, i) => {
      const x = 40 + (i * 137) % 1200, y = 20 + (i * 71) % 160;
      return `<circle cx="${x}" cy="${y}" r="1" fill="#ffffff" opacity="${0.12 + (i % 3) * 0.08}"/>`;
    }).join("")}

    <defs>
      <linearGradient id="glow343" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${SC.teal}" stop-opacity="0"/>
        <stop offset="1" stop-color="${SC.teal}" stop-opacity="0.35"/>
      </linearGradient>
    </defs>
    <rect x="0" y="210" width="1280" height="80" fill="url(#glow343)"/>

    <!-- Two stylized country "pills" representing NL and DE -->
    <g>
      <!-- NL pill (left) -->
      <rect x="180" y="240" width="280" height="130" rx="18" fill="${SC.indigoMid}" stroke="${SC.coral}" stroke-width="2"/>
      <text x="320" y="272" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.coral}" letter-spacing="3">NEDERLAND</text>
      <!-- little car icon left -->
      <g transform="translate(210,295) scale(1.2)">
        <rect x="0" y="10" width="44" height="14" rx="3" fill="${SC.amber}"/>
        <path d="M6 10 L12 0 L32 0 L38 10 Z" fill="${SC.amber}"/>
        <circle cx="10" cy="26" r="5" fill="${SC.indigoDeep}"/>
        <circle cx="34" cy="26" r="5" fill="${SC.indigoDeep}"/>
      </g>
      <text x="300" y="320" font-family="${FONT_SANS}" font-size="15" fill="#ffffff">exporteert</text>
      <text x="300" y="342" font-family="${FONT_SANS}" font-size="15" font-weight="700" fill="${SC.amber}">VW-achtige auto</text>

      <!-- DE pill (right) -->
      <rect x="820" y="240" width="280" height="130" rx="18" fill="${SC.indigoMid}" stroke="${SC.teal}" stroke-width="2"/>
      <text x="960" y="272" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.teal}" letter-spacing="3">DUITSLAND</text>
      <g transform="translate(850,295) scale(1.2)">
        <rect x="0" y="10" width="44" height="14" rx="3" fill="${SC.coral}"/>
        <path d="M6 10 L12 0 L32 0 L38 10 Z" fill="${SC.coral}"/>
        <circle cx="10" cy="26" r="5" fill="${SC.indigoDeep}"/>
        <circle cx="34" cy="26" r="5" fill="${SC.indigoDeep}"/>
      </g>
      <text x="940" y="320" font-family="${FONT_SANS}" font-size="15" fill="#ffffff">exporteert</text>
      <text x="940" y="342" font-family="${FONT_SANS}" font-size="15" font-weight="700" fill="${SC.coral}">BMW-achtige auto</text>
    </g>

    <!-- trade arrows -->
    <defs>
      <marker id="op-coral" markerWidth="12" markerHeight="9" refX="11" refY="4.5" orient="auto">
        <polygon points="0 0, 12 4.5, 0 9" fill="${SC.coral}"/>
      </marker>
      <marker id="op-teal" markerWidth="12" markerHeight="9" refX="11" refY="4.5" orient="auto">
        <polygon points="0 0, 12 4.5, 0 9" fill="${SC.teal}"/>
      </marker>
    </defs>
    <path d="M460 275 C 600 240, 680 240, 820 275" stroke="${SC.coral}" stroke-width="3" fill="none" marker-end="url(#op-coral)"/>
    <path d="M820 340 C 680 375, 600 375, 460 340" stroke="${SC.teal}" stroke-width="3" fill="none" marker-end="url(#op-teal)"/>

    <text x="640" y="230" text-anchor="middle" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="${SC.amber}">zelfde sector, andere variant</text>
  </svg>`;
}

// Inter vs intra industriële handel — two-column comparison
function svgInterVsIntra() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Twee soorten internationale handel naast elkaar", "VERGELIJKING  ·  INTER vs INTRA")}

    <!-- LEFT: inter -->
    <rect x="80"  y="160" width="560" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.amberDeep}" stroke-width="2"/>
    <rect x="80"  y="160" width="560" height="60" fill="${SC.amberDeep}" rx="14"/>
    <rect x="80"  y="210" width="560" height="14" fill="${SC.amberDeep}"/>
    <text x="360" y="198" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="24" font-weight="700" fill="#ffffff">Inter-industriële handel</text>

    <text x="108" y="258" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.ash}" letter-spacing="3">VERSCHILLENDE SECTOREN</text>

    <!-- NL bloemen -> DE -->
    <g transform="translate(108,280)">
      <rect x="0" y="0" width="210" height="70" rx="8" fill="${SC.paperMid}"/>
      <text x="14" y="24" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.indigo}">NL</text>
      <text x="14" y="46" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">🌷 bloemen</text>
      <text x="14" y="62" font-family="${FONT_SANS}" font-size="11" fill="${SC.smoke}">landbouw</text>
      <line x1="210" y1="35" x2="260" y2="35" stroke="${SC.amberDeep}" stroke-width="2.5" marker-end="url(#ah-ink)"/>
    </g>
    <g transform="translate(378,280)">
      <rect x="0" y="0" width="210" height="70" rx="8" fill="${SC.paperMid}"/>
      <text x="14" y="24" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.indigo}">DE</text>
      <text x="14" y="46" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">🚗 auto's</text>
      <text x="14" y="62" font-family="${FONT_SANS}" font-size="11" fill="${SC.smoke}">industrie</text>
    </g>

    <!-- verklaring -->
    <text x="108" y="400" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.ash}" letter-spacing="3">VERKLARING</text>
    <text x="108" y="428" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="${SC.indigo}">Comparatief voordeel</text>
    <text x="108" y="454" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.smoke}">landen specialiseren waar ze</text>
    <text x="108" y="474" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.smoke}">relatief efficiënter zijn.</text>

    <line x1="108" y1="500" x2="612" y2="500" stroke="${SC.cloud}"/>
    <text x="108" y="526" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">RICHTING</text>
    <text x="612" y="526" text-anchor="end" font-family="${FONT_SERIF}" font-size="16" font-style="italic" font-weight="700" fill="${SC.amberDeep}">één richting per product</text>
    <text x="108" y="558" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">MODEL</text>
    <text x="612" y="558" text-anchor="end" font-family="${FONT_SERIF}" font-size="16" font-style="italic" font-weight="700" fill="${SC.amberDeep}">Ricardo (1817)</text>

    <!-- RIGHT: intra -->
    <rect x="660" y="160" width="560" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.tealDeep}" stroke-width="2"/>
    <rect x="660" y="160" width="560" height="60" fill="${SC.tealDeep}" rx="14"/>
    <rect x="660" y="210" width="560" height="14" fill="${SC.tealDeep}"/>
    <text x="940" y="198" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="24" font-weight="700" fill="#ffffff">Intra-industriële handel</text>

    <text x="688" y="258" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.ash}" letter-spacing="3">DEZELFDE SECTOR</text>

    <g transform="translate(688,280)">
      <rect x="0" y="0" width="210" height="70" rx="8" fill="${SC.paperMid}"/>
      <text x="14" y="24" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.indigo}">NL</text>
      <text x="14" y="46" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">🚲 Gazelle</text>
      <text x="14" y="62" font-family="${FONT_SANS}" font-size="11" fill="${SC.smoke}">fietsen</text>
      <line x1="210" y1="25" x2="260" y2="25" stroke="${SC.tealDeep}" stroke-width="2.5" marker-end="url(#ah-ink)"/>
      <line x1="260" y1="45" x2="210" y2="45" stroke="${SC.coral}" stroke-width="2.5" marker-end="url(#ah-coral)"/>
    </g>
    <g transform="translate(958,280)">
      <rect x="0" y="0" width="210" height="70" rx="8" fill="${SC.paperMid}"/>
      <text x="14" y="24" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.indigo}">DE</text>
      <text x="14" y="46" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">🚲 Cube</text>
      <text x="14" y="62" font-family="${FONT_SANS}" font-size="11" fill="${SC.smoke}">fietsen</text>
    </g>

    <text x="688" y="400" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.ash}" letter-spacing="3">VERKLARING</text>
    <text x="688" y="428" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="${SC.indigo}">Productdifferentiatie + schaal</text>
    <text x="688" y="454" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.smoke}">varianten en lage stuk­kosten</text>
    <text x="688" y="474" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.smoke}">maken ruil in beide richtingen aantrekkelijk.</text>

    <line x1="688" y1="500" x2="1192" y2="500" stroke="${SC.cloud}"/>
    <text x="688" y="526" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">RICHTING</text>
    <text x="1192" y="526" text-anchor="end" font-family="${FONT_SERIF}" font-size="16" font-style="italic" font-weight="700" fill="${SC.tealDeep}">twee richtingen, zelfde product</text>
    <text x="688" y="558" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">MODEL</text>
    <text x="1192" y="558" text-anchor="end" font-family="${FONT_SERIF}" font-size="16" font-style="italic" font-weight="700" fill="${SC.tealDeep}">Krugman (1979)</text>
  </svg>`;
}

// Schaalvoordelen — dalende GTK-curve met annotaties
function svgSchaalvoordelen() {
  const w = 1280, h = 640;
  const px = 150, py = 160, pw = 840, ph = 380;
  const qMax = 200, pMax = 110;
  const qToX = q => px + (q / qMax) * pw;
  const pToY = p => py + ph - (p / pMax) * ph;

  // GTK(Q) = 2000/Q + 10  — dalend richting plateau
  const pts = [];
  for (let Q = 30; Q <= 200; Q += 2) pts.push(`${qToX(Q).toFixed(1)},${pToY(2000 / Q + 10).toFixed(1)}`);

  const xA = qToX(30), yA = pToY(2000 / 30 + 10); // klein, GTK ~ 76
  const xB = qToX(80), yB = pToY(2000 / 80 + 10); // middel, GTK ~ 35
  const xC = qToX(180), yC = pToY(2000 / 180 + 10); // groot, GTK ~ 21

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Hoe schaalvoordelen de stuk­kosten doen dalen", "SCHAALVOORDELEN  ·  ECONOMIES OF SCALE")}

    <!-- Axes -->
    <line x1="${px}" y1="${py + ph}" x2="${px}" y2="${py - 10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py + ph}" x2="${px + pw + 10}" y2="${py + ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <text x="${px - 55}" y="${py + ph / 2}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 55}, ${py + ph / 2})">GTK (€ per auto)</text>
    <text x="${px + pw / 2}" y="${py + ph + 48}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle">Productie Q (auto's per dag)</text>

    <!-- GTK curve -->
    <polyline points="${pts.join(" ")}" fill="none" stroke="${SC.coral}" stroke-width="3"/>
    <text x="${qToX(190)}" y="${pToY(2000 / 190 + 10) - 14}" font-family="${FONT_SANS}" font-size="15" font-weight="700" fill="${SC.coral}">GTK</text>

    <!-- Dashed refs + dots -->
    <line x1="${xA}" y1="${yA}" x2="${xA}" y2="${py + ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yA}" x2="${xA}" y2="${yA}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xB}" y1="${yB}" x2="${xB}" y2="${py + ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yB}" x2="${xB}" y2="${yB}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xC}" y1="${yC}" x2="${xC}" y2="${py + ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yC}" x2="${xC}" y2="${yC}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>

    <circle cx="${xA}" cy="${yA}" r="7" fill="${SC.coralDeep}"/>
    <circle cx="${xB}" cy="${yB}" r="9" fill="${SC.amberDeep}"/>
    <circle cx="${xC}" cy="${yC}" r="10" fill="${SC.indigo}"/>

    <!-- Axis value labels -->
    <text x="${px - 10}" y="${yA + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}" font-weight="600">€77</text>
    <text x="${px - 10}" y="${yB + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}" font-weight="600">€35</text>
    <text x="${px - 10}" y="${yC + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}" font-weight="600">€21</text>
    <text x="${xA}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">Q = 30</text>
    <text x="${xB}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">Q = 80</text>
    <text x="${xC}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">Q = 180</text>

    <!-- Callout A: kleine schaal -->
    <g>
      <rect x="${xA + 40}" y="190" width="260" height="68" rx="10" fill="${SC.coralDeep}"/>
      <text x="${xA + 60}" y="216" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="2">KLEINE SCHAAL</text>
      <text x="${xA + 60}" y="242" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="#ffffff">hoge stuk­kosten</text>
      <line x1="${xA + 40}" y1="230" x2="${xA + 8}" y2="${yA - 4}" stroke="${SC.coralDeep}" stroke-width="2"/>
    </g>

    <!-- Callout B: middelgroot -->
    <g>
      <rect x="${xB - 130}" y="320" width="260" height="68" rx="10" fill="${SC.amberDeep}"/>
      <text x="${xB - 110}" y="346" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="2">MIDDELGROOT</text>
      <text x="${xB - 110}" y="372" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="#ffffff">stuk­kosten dalen snel</text>
      <line x1="${xB}" y1="320" x2="${xB + 2}" y2="${yB + 8}" stroke="${SC.amberDeep}" stroke-width="2"/>
    </g>

    <!-- Callout C: grote schaal -->
    <g>
      <rect x="${xC - 230}" y="${py + ph - 90}" width="220" height="75" rx="10" fill="${SC.indigo}"/>
      <text x="${xC - 215}" y="${py + ph - 64}" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.teal}" letter-spacing="2">GROTE SCHAAL · EXPORT</text>
      <text x="${xC - 215}" y="${py + ph - 40}" font-family="${FONT_DISPLAY}" font-size="17" font-weight="700" fill="#ffffff">laagste GTK = €21</text>
      <text x="${xC - 215}" y="${py + ph - 22}" font-family="${FONT_SERIF}" font-size="11" font-style="italic" fill="${SC.cloud}">alleen haalbaar met export</text>
      <line x1="${xC - 10}" y1="${py + ph - 52}" x2="${xC - 2}" y2="${yC + 10}" stroke="${SC.indigo}" stroke-width="2"/>
    </g>

    <!-- Footer insight -->
    <rect x="150" y="580" width="990" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="170" y="606" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="#ffffff">Grotere markt → grotere fabriek → lagere stuk­kosten. Export maakt de schaal mogelijk.</text>
  </svg>`;
}

// Productvariëteit — voor en na handel
function svgVarieteit() {
  const w = 1280, h = 640;
  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Meer landen → meer varianten voor elke consument", "LOVE-OF-VARIETY  ·  CONSUMENTENWINST")}

    <!-- LEFT: Gesloten markt -->
    <rect x="80" y="160" width="560" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.cloud}" stroke-width="1.5"/>
    <rect x="80" y="160" width="560" height="52" fill="${SC.smoke}" rx="14"/>
    <rect x="80" y="200" width="560" height="12" fill="${SC.smoke}"/>
    <text x="360" y="194" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Gesloten markt (alleen NL)</text>

    <text x="108" y="248" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="3">VARIANTEN BESCHIKBAAR</text>

    <!-- 3 variantjes -->
    ${[
      { x: 140, color: SC.coral, label: "Merk A" },
      { x: 300, color: SC.amber, label: "Merk B" },
      { x: 460, color: SC.olive, label: "Merk C" },
    ].map(v => `
      <g transform="translate(${v.x},290)">
        <rect x="0" y="15" width="110" height="60" rx="8" fill="${v.color}"/>
        <rect x="10" y="0" width="90" height="25" rx="4" fill="${v.color}"/>
        <circle cx="25" cy="80" r="10" fill="${SC.indigoDeep}"/>
        <circle cx="95" cy="80" r="10" fill="${SC.indigoDeep}"/>
        <text x="55" y="108" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.ink}">${v.label}</text>
      </g>
    `).join("")}

    <line x1="108" y1="440" x2="612" y2="440" stroke="${SC.cloud}"/>
    <text x="108" y="470" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.ash}" letter-spacing="2">CONSUMENT</text>
    <text x="108" y="500" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="${SC.smoke}">3 keuzes</text>
    <text x="108" y="534" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.smoke}">klein, duur, weinig concurrentie</text>

    <!-- RIGHT: Open markt -->
    <rect x="660" y="160" width="560" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.tealDeep}" stroke-width="2"/>
    <rect x="660" y="160" width="560" height="52" fill="${SC.tealDeep}" rx="14"/>
    <rect x="660" y="200" width="560" height="12" fill="${SC.tealDeep}"/>
    <text x="940" y="194" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Open markt (EU, Krugman)</text>

    <text x="688" y="248" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="3">VARIANTEN BESCHIKBAAR</text>

    <!-- 8 varianten, kleiner, in grid -->
    ${[
      { x: 0, color: SC.coral,    f: "🇳🇱", lbl: "A" },
      { x: 1, color: SC.amber,    f: "🇳🇱", lbl: "B" },
      { x: 2, color: SC.olive,    f: "🇳🇱", lbl: "C" },
      { x: 3, color: SC.teal,     f: "🇩🇪", lbl: "D" },
      { x: 0, color: SC.plum,     f: "🇩🇪", lbl: "E", row: 1 },
      { x: 1, color: SC.coralDeep,f: "🇫🇷", lbl: "F", row: 1 },
      { x: 2, color: SC.amberDeep,f: "🇮🇹", lbl: "G", row: 1 },
      { x: 3, color: SC.tealDeep, f: "🇪🇸", lbl: "H", row: 1 },
    ].map(v => {
      const col = v.x, row = v.row || 0;
      const xx = 700 + col * 128, yy = 280 + row * 90;
      return `
        <g transform="translate(${xx},${yy})">
          <rect x="0" y="10" width="80" height="40" rx="5" fill="${v.color}"/>
          <rect x="7" y="0" width="66" height="18" rx="3" fill="${v.color}"/>
          <circle cx="18" cy="54" r="7" fill="${SC.indigoDeep}"/>
          <circle cx="68" cy="54" r="7" fill="${SC.indigoDeep}"/>
          <text x="40" y="75" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ink}">${v.lbl} · ${v.f}</text>
        </g>
      `;
    }).join("")}

    <line x1="688" y1="470" x2="1192" y2="470" stroke="${SC.cloud}"/>
    <text x="688" y="500" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.ash}" letter-spacing="2">CONSUMENT</text>
    <text x="688" y="530" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="${SC.tealDeep}">8+ keuzes</text>
    <text x="688" y="558" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.tealDeep}">grotere markt, lagere prijs, meer variëteit</text>
  </svg>`;
}

// Drie factoren die intra-industriële handel drijven
function svgDrieFactoren() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Drie factoren die elkaar versterken", "WAAROM INTRA-INDUSTRIËLE HANDEL?")}

    ${[
      { y: 170, icon: ICON.badge(SC.tealDeep, SC.coral),
        title: "Productdifferentiatie",
        mech: "honderden varianten van hetzelfde type goed",
        ex: "BMW, VW, Renault, Fiat — allemaal auto's",
        col: SC.teal },
      { y: 325, icon: ICON.factory(SC.amberDeep),
        title: "Schaalvoordelen",
        mech: "grotere productie → lagere stuk­kosten",
        ex: "VW-fabriek Wolfsburg: 700.000 auto's/jaar",
        col: SC.amber },
      { y: 480, icon: ICON.arrowRight(SC.indigo),
        title: "Lage transactiekosten",
        mech: "binnen de EU: geen tarieven, één munt",
        ex: "Euro sinds 2002 — geen wisselkoersrisico",
        col: SC.indigo },
    ].map(r => `
      <!-- icon tile -->
      <rect x="80" y="${r.y}" width="120" height="120" rx="12" fill="${r.col}" fill-opacity="0.14" stroke="${r.col}" stroke-width="1.5"/>
      ${placeIcon(r.icon, 108, r.y + 28, 64)}

      <!-- factor title + mechanisme -->
      <text x="230" y="${r.y + 38}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">FACTOR</text>
      <text x="230" y="${r.y + 68}" font-family="${FONT_SANS}" font-size="24" font-weight="700" fill="${SC.indigo}">${r.title}</text>
      <text x="230" y="${r.y + 100}" font-family="${FONT_SERIF}" font-size="17" font-style="italic" fill="${SC.smoke}">${r.mech}</text>

      <!-- arrow -->
      <g transform="translate(700,${r.y + 48})">
        <line x1="0" y1="24" x2="100" y2="24" stroke="${r.col}" stroke-width="3" stroke-linecap="round"/>
        <polyline points="88,10 100,24 88,38" fill="none" stroke="${r.col}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </g>

      <!-- voorbeeld-card -->
      <rect x="830" y="${r.y + 20}" width="370" height="82" rx="10" fill="${SC.paper}" stroke="${r.col}" stroke-width="2"/>
      <rect x="830" y="${r.y + 20}" width="8" height="82" fill="${r.col}"/>
      <text x="855" y="${r.y + 48}" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="2">VOORBEELD</text>
      <text x="855" y="${r.y + 80}" font-family="${FONT_SANS}" font-size="16" fill="${SC.ink}">${r.ex}</text>
    `).join("")}
  </svg>`;
}

// Cournot duopolie vs monopolie — annotated bar comparison
function svgMonopolieVsDuopolie() {
  const w = 1280, h = 640;
  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Wat doet een buitenlandse toetreder met prijs en welvaart?", "MONOPOLIE → COURNOT-DUOPOLIE")}

    <!-- LEFT: before -->
    <rect x="80" y="160" width="560" height="400" rx="14" fill="${SC.chalk}" stroke="${SC.coralDeep}" stroke-width="2"/>
    <rect x="80" y="160" width="560" height="56" fill="${SC.coralDeep}" rx="14"/>
    <rect x="80" y="206" width="560" height="12" fill="${SC.coralDeep}"/>
    <text x="360" y="196" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Vóór: monopolie</text>

    <text x="360" y="260" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="3">GEGEVEN: P = 180 − Q · MK = Q</text>

    <!-- Big stats -->
    <text x="360" y="330" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="72" font-weight="700" fill="${SC.coralDeep}" letter-spacing="-2">Q* = 60</text>
    <text x="360" y="400" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="72" font-weight="700" fill="${SC.coralDeep}" letter-spacing="-2">p* = 120</text>

    <line x1="130" y1="440" x2="590" y2="440" stroke="${SC.cloud}"/>

    <text x="130" y="474" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.ash}" letter-spacing="2">AFLEIDING</text>
    <text x="130" y="500" font-family="Consolas, monospace" font-size="13" fill="${SC.ink}">MO = −2Q + 180 = Q  →  3Q = 180</text>
    <text x="130" y="522" font-family="Consolas, monospace" font-size="13" fill="${SC.ink}">Q* = 60  →  p* = 180 − 60 = 120</text>
    <text x="130" y="548" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">Prijs altijd op V, niet op MK!</text>

    <!-- RIGHT: after -->
    <rect x="660" y="160" width="560" height="400" rx="14" fill="${SC.chalk}" stroke="${SC.tealDeep}" stroke-width="2"/>
    <rect x="660" y="160" width="560" height="56" fill="${SC.tealDeep}" rx="14"/>
    <rect x="660" y="206" width="560" height="12" fill="${SC.tealDeep}"/>
    <text x="940" y="196" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Na: Cournot-duopolie</text>

    <text x="940" y="260" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="3">BUITENLANDSE TOETREDER</text>

    <text x="940" y="330" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="72" font-weight="700" fill="${SC.tealDeep}" letter-spacing="-2">Q↑ meer</text>
    <text x="940" y="400" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="72" font-weight="700" fill="${SC.tealDeep}" letter-spacing="-2">p↓ lager</text>

    <line x1="710" y1="440" x2="1170" y2="440" stroke="${SC.cloud}"/>

    <text x="710" y="474" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.ash}" letter-spacing="2">GEVOLG</text>
    <text x="710" y="500" font-family="${FONT_SANS}" font-size="15" fill="${SC.ink}">· Totale Q stijgt</text>
    <text x="710" y="522" font-family="${FONT_SANS}" font-size="15" fill="${SC.ink}">· Prijs daalt richting concurrentie-niveau</text>
    <text x="710" y="544" font-family="${FONT_SANS}" font-size="15" font-weight="700" fill="${SC.tealDeep}">· Consumentensurplus stijgt ↑</text>
  </svg>`;
}

// Euro-effect flowchart
function svgEuroEffect() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("De euro: drie kanalen, één richting", "2002  ·  EURO INVOERING")}

    <!-- Top box: euro invoering -->
    <rect x="440" y="150" width="400" height="70" rx="10" fill="${SC.indigoDeep}"/>
    <text x="640" y="180" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.amber}" letter-spacing="3">2002 · START</text>
    <text x="640" y="206" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Euro vervangt nationale munten</text>

    <!-- 3 columns of effects -->
    ${[
      { x: 100, kicker: "EFFECT 1", title: "Geen wisselkoers­risico", body: "Fietsprijs NL→ES blijft stabiel — geen onzekerheid over koers.", col: SC.teal },
      { x: 460, kicker: "EFFECT 2", title: "Lagere transactie­kosten", body: "Geen omwisselkosten meer bij betalingen over de grens.", col: SC.amber },
      { x: 820, kicker: "EFFECT 3", title: "Meer prijs­transparantie", body: "Consumenten vergelijken prijzen direct — scherpere concurrentie.", col: SC.coral },
    ].map(c => `
      <!-- arrow down from top -->
      <line x1="640" y1="220" x2="${c.x + 180}" y2="290" stroke="${c.col}" stroke-width="2.5" marker-end="url(#ah-ink)"/>
      <rect x="${c.x}" y="295" width="360" height="170" rx="12" fill="${SC.chalk}" stroke="${c.col}" stroke-width="2"/>
      <rect x="${c.x}" y="295" width="360" height="40" fill="${c.col}" rx="12"/>
      <rect x="${c.x}" y="325" width="360" height="10" fill="${c.col}"/>
      <text x="${c.x + 180}" y="322" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="3">${c.kicker}</text>
      <text x="${c.x + 180}" y="370" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="${SC.indigo}">${c.title}</text>
      <text x="${c.x + 20}" y="410" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.smoke}">
        <tspan x="${c.x + 20}" dy="0">${c.body.split(" — ")[0] || c.body}</tspan>
        <tspan x="${c.x + 20}" dy="22">${c.body.split(" — ")[1] || ""}</tspan>
      </text>

      <!-- arrow down to bottom -->
      <line x1="${c.x + 180}" y1="475" x2="640" y2="530" stroke="${c.col}" stroke-width="2" stroke-dasharray="6,4"/>
    `).join("")}

    <!-- Bottom result -->
    <rect x="340" y="540" width="600" height="70" rx="10" fill="${SC.tealDeep}"/>
    <text x="640" y="570" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.amber}" letter-spacing="3">RESULTAAT</text>
    <text x="640" y="596" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Intra-industriële handel neemt toe</text>
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
    ...T.heroDark, fontSize: 52, charSpacing: -2,
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.6, y: 3.85, w: 8.8, h: 0.6,
      ...T.subheadDark, fontFace: FONT_SERIF, italic: true, fontSize: 18,
    });
  }
  s.addShape("rect", { x: 0.6, y: 3.6, w: 0.6, h: 0.04, fill: { color: PC.coral } });
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
      x: 0.5, y: 1.35, w: 9, h: 0.45,
      ...T.subheadLight, fontFace: FONT_SERIF, italic: true, fontSize: 18,
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
      x: 0.15, y: 2.5, w: 1.7, h: 2.3,
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
  pres.title = "3.4.3 Intra-industriele handel";

  defineMasters(pres, {
    darkLabel: "PARAGRAAF  ·  §3.4",
    lightLabel: "§ 3.4  ·  INTERNATIONALE MARKTEN",
  });

  // Build all SVGs first
  const svgs = {
    opener:       svgTradeFlowsOpener(),
    interVsIntra: svgInterVsIntra(),
    drieFactoren: svgDrieFactoren(),
    schaal:       svgSchaalvoordelen(),
    varieteit:    svgVarieteit(),
    monoDuo:      svgMonopolieVsDuopolie(),
    euro:         svgEuroEffect(),
  };
  const imgs = {};
  for (const [k, v] of Object.entries(svgs)) imgs[k] = await svgData(v, 1440);

  // ────────────────────────────────────────────────────────────────────
  // DIA 1 — Cinematic opener
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addImage({ data: imgs.opener, x: 0, y: 2.4, w: 10, h: 3.28 });

    s.addText("§ 3.4.3", {
      x: 0.6, y: 0.5, w: 4, h: 0.4,
      ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6,
    });
    s.addText("Intra-industriële handel", {
      x: 0.6, y: 0.95, w: 8.8, h: 1.3,
      ...T.heroDark, fontSize: 54, charSpacing: -2,
    });
    s.addText("Hoofdstuk 4 · Internationale markten  ·  Praktische Economie VWO", {
      x: 0.6, y: 2.3, w: 8.8, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.cloud,
    });
    s.addNotes("Welkom bij §3.4.3. We zoomen in op een opvallend verschijnsel: Nederland exporteert auto's (Mini Oxford werd in NL geassembleerd) én importeert auto's (BMW, Fiat). Waarom ruilen landen producten UIT DEZELFDE sector?");
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
    s.addText("Waarom exporteert NL fietsen\nén importeert het fietsen?", {
      x: 1.8, y: 1.4, w: 8, h: 2.6,
      fontFace: FONT_DISPLAY, fontSize: 44, bold: true, color: PC.chalk, charSpacing: -2, lineSpacingMultiple: 1.1,
    });
    s.addText("De kernvraag van deze paragraaf.", {
      x: 1.8, y: 4.3, w: 8, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 18, italic: true, color: PC.amber,
    });
    s.addNotes("Laat de paradox even landen. Comparatief voordeel (Ricardo) verklaart dit NIET — landen ruilen immers hetzelfde type goed. Krugman (1979) leverde de nieuwe verklaring.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 3 — Leerdoelen (sidebar layout)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = sidebarSlide(pres, {
      sidebarKicker: "Wat ga je leren",
      sidebarTitle: "Vier vaardigheden",
      sidebarBody: "Na deze paragraaf begrijp je waarom landen dezelfde producten naar elkaar toe exporteren — en wat de euro ermee te maken heeft.",
    });
    const doelen = [
      { n: "01", t: "Intra- vs. inter-industriële handel onderscheiden" },
      { n: "02", t: "Drie factoren voor intra-industriële handel benoemen" },
      { n: "03", t: "Monopolie vs. Cournot-duopolie doorrekenen" },
      { n: "04", t: "Drie effecten van de euro op handel beschrijven" },
    ];
    doelen.forEach((d, i) => {
      const y = 0.75 + i * 1.05;
      s.addText(d.n, {
        x: 2.3, y, w: 1.1, h: 0.8,
        fontFace: FONT_DISPLAY, fontSize: 42, bold: true, color: PC.coral, charSpacing: -1,
      });
      s.addText(d.t, {
        x: 3.4, y: y + 0.2, w: 6.3, h: 0.8,
        fontFace: FONT_SANS, fontSize: 18, color: PC.ink, valign: "middle",
      });
      if (i < doelen.length - 1) {
        s.addShape("rect", { x: 2.3, y: y + 0.95, w: 7.4, h: 0.01, fill: { color: PC.cloud } });
      }
    });
    s.addNotes("Vier leerdoelen. 1 = begripsonderscheid, 2 = oorzaken, 3 = rekenvaardigheid (B2), 4 = toepassing (euro).");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 4 — Section divider: DEEL 1 ONDERSCHEID
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 1",
    title: "Twee soorten handel",
    subtitle: "Inter (verschillende sectoren) versus intra (dezelfde sector). Het verschil zit in het TYPE product.",
    notes: "We contrasteren twee modellen. Eerst Ricardo (inter), dan Krugman (intra). Belangrijk: leerlingen moeten het onderscheid snel kunnen maken in een casus.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 5 — Definitie van intra
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Begrip · intra-industriële handel",
      title: "Hetzelfde type product — in beide richtingen.",
      notes: "Definitie scherp stellen: het gaat om hetzelfde TYPE, niet exact hetzelfde merk. NL exporteert Gazelle-fietsen en importeert Cube-fietsen: beide behoren tot de sector fietsen.",
    });

    // LEFT: definitie card
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.sky }, line: { color: PC.cloud, width: 0.75 } });
    s.addText("DEFINITIE", {
      x: 0.75, y: 2.15, w: 3.9, h: 0.3,
      ...T.labelUpper, color: PC.indigo, fontSize: 12, charSpacing: 4,
    });
    s.addText([
      { text: "Intra-industriële handel", options: { bold: true, color: PC.indigo } },
      { text: " is handel waarbij landen dezelfde soort goederen in beide richtingen uitwisselen.", options: {} },
    ], {
      x: 0.75, y: 2.55, w: 3.9, h: 1.6,
      fontFace: FONT_SERIF, fontSize: 19, color: PC.ink, italic: true, lineSpacingMultiple: 1.3,
    });
    s.addShape("rect", { x: 0.75, y: 4.25, w: 0.4, h: 0.03, fill: { color: PC.coral } });
    s.addText("Kenmerk: zelfde sector, tweezijdig", {
      x: 0.75, y: 4.35, w: 3.9, h: 0.4,
      fontFace: FONT_SANS, fontSize: 14, bold: true, color: PC.coralDeep,
    });

    // RIGHT: voorbeelden
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.indigo } });
    s.addText("VOORBEELD  ·  FIETSENMARKT", {
      x: 5.3, y: 2.15, w: 4, h: 0.3,
      ...T.labelUpper, color: PC.amber, fontSize: 11, charSpacing: 3,
    });
    s.addText([
      { text: "NL exporteert ", options: { fontSize: 18, color: PC.chalk } },
      { text: "Gazelle", options: { bold: true, fontSize: 18, color: PC.coral } },
      { text: " → DE\n", options: { fontSize: 18, color: PC.chalk } },
      { text: "NL importeert ", options: { fontSize: 18, color: PC.chalk } },
      { text: "Cube", options: { bold: true, fontSize: 18, color: PC.teal } },
      { text: " ← DE\n\n", options: { fontSize: 18, color: PC.chalk } },
      { text: "Beide: sector ‘fietsen’. Maar: andere merken, andere varianten.", options: { italic: true, fontSize: 14, fontFace: FONT_SERIF, color: PC.amber } },
    ], {
      x: 5.3, y: 2.55, w: 4, h: 2.4,
      fontFace: FONT_SANS, lineSpacingMultiple: 1.4,
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 6 — Inter vs intra graphic
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.interVsIntra, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("De kern-vergelijking. Inter: verschillende sectoren, één richting per product, Ricardo. Intra: dezelfde sector, beide richtingen, Krugman. Vraag de klas eerst de verschillen te voorspellen voor je het laat zien.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 7 — Section: DEEL 2 FACTOREN
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 2",
    title: "Drie motoren",
    subtitle: "Wat drijft intra-industriële handel? Productdifferentiatie, schaalvoordelen en lage transactiekosten — samen.",
    notes: "Drie factoren die elkaar versterken. De redenering loopt via Krugman: bij monopolistische concurrentie + schaalvoordelen is intra-industriële handel een logisch gevolg.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 8 — Drie factoren overzicht
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.drieFactoren, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Kapstok-dia. Drie factoren, drie voorbeelden. De volgende twee dia's werken schaalvoordelen en productdifferentiatie/variëteit verder uit.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 9 — Schaalvoordelen grafiek
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.schaal, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("GTK-curve. Dalend: hoe meer productie, hoe lager de stuk­kosten. Bij Q=180 is GTK slechts €21; bij Q=80 nog €35. Grote afzet is alleen haalbaar als de binnenlandse markt wordt aangevuld met EXPORT. Zonder internationale markt: geen schaal, geen lage prijs.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 10 — Productdifferentiatie / variëteit
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.varieteit, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Love-of-variety. In een gesloten markt: 3 varianten. In een open markt (EU): 8+ varianten. De consument wint op TWEE manieren: meer keuze (variëteit) én lagere prijs (schaal + concurrentie).");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 11 — Monopolistische concurrentie context
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Marktvorm",
      title: "Monopolistische concurrentie",
      subtitle: "Veel aanbieders, elk met een eigen variant. Geen volmaakte concurrentie, geen monopolie.",
      notes: "Belangrijke tussenstap: intra-industriële handel speelt zich af in een markt met veel aanbieders die elk een gedifferentieerd product leveren. Denk auto's, smartphones, bier.",
    });
    // Properties grid
    const props = [
      { t: "Veel aanbieders",         s: "geen van allen dominant",              col: PC.teal },
      { t: "Gedifferentieerde producten", s: "elk merk heeft eigen variant",     col: PC.coral },
      { t: "Vrije toetreding",        s: "nieuwe merken kunnen de markt op",     col: PC.amberDeep },
      { t: "Enige prijszettende macht", s: "merk = beperkt monopolie",           col: PC.indigo },
    ];
    props.forEach((p, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = 0.5 + col * 4.6, y = 2.05 + row * 1.45;
      s.addShape("rect", { x, y, w: 4.4, h: 1.25, fill: { color: PC.chalk }, line: { color: PC.cloud, width: 0.75 } });
      s.addShape("rect", { x, y, w: 0.1, h: 1.25, fill: { color: p.col } });
      s.addText(p.t, {
        x: x + 0.3, y: y + 0.15, w: 4.0, h: 0.5,
        fontFace: FONT_DISPLAY, fontSize: 20, bold: true, color: PC.indigo,
      });
      s.addText(p.s, {
        x: x + 0.3, y: y + 0.65, w: 4.0, h: 0.5,
        fontFace: FONT_SERIF, fontSize: 15, italic: true, color: PC.smoke,
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 12 — Section: DEEL 3 MONOPOLIE → DUOPOLIE
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 3",
    title: "Als de grens opengaat",
    subtitle: "Een binnenlands monopolie wordt een Cournot-duopolie zodra een buitenlandse toetreder de markt betreedt.",
    notes: "Rekenvaardigheid. Eerst uitleggen welk model: binnenlandse monopolist krijgt één buitenlandse concurrent → duopolie.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 13 — Rekenvoorbeeld monopolie
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Rekenstap  ·  monopolie",
      title: "Stap-voor-stap: MO = MK",
      subtitle: "Gegeven: p = 180 − Q,  MK = Q.  Vind Q* en p*.",
      notes: "Vier stappen. Let op: we DUBBELEN de helling bij MO. Prijs ALTIJD aflezen op V, nooit op MK!",
    });
    const steps = [
      { n: "01", t: "MO afleiden", f: "p = 180 − Q  →  MO = 180 − 2Q", col: PC.indigoSoft },
      { n: "02", t: "MO = MK",      f: "180 − 2Q = Q",                  col: PC.teal },
      { n: "03", t: "Los Q op",      f: "180 = 3Q  →  Q* = 60",         col: PC.coral },
      { n: "04", t: "p op V aflezen", f: "p* = 180 − 60 = 120",          col: PC.indigoDeep },
    ];
    const w = 2.15, gap = 0.18, startX = 0.5, y = 2.2, h = 2.7;
    steps.forEach((st, i) => {
      const x = startX + i * (w + gap);
      s.addShape("rect", { x, y, w, h, fill: { color: PC.chalk }, line: { color: PC.cloud, width: 0.5 } });
      s.addShape("rect", { x, y, w, h: 0.06, fill: { color: st.col } });
      s.addText(st.n, {
        x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.65,
        fontFace: FONT_DISPLAY, fontSize: 38, bold: true, color: st.col, charSpacing: -1.5,
      });
      s.addText(st.t, {
        x: x + 0.2, y: y + 0.95, w: w - 0.4, h: 0.55,
        fontFace: FONT_SANS, fontSize: 15, bold: true, color: PC.indigo,
      });
      s.addText(st.f, {
        x: x + 0.15, y: y + 1.6, w: w - 0.3, h: 0.9,
        fontFace: "Consolas", fontSize: 14, color: PC.ink, lineSpacingMultiple: 1.3,
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 14 — Valkuil prijs op V
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Let op · klassieke fout",
      title: "Prijs lees je af op V — nooit op MK.",
      notes: "Dit is dé klassieke toetsfout. Bij Q* = 60 geldt MK = 60 (ja, toevallig in dit voorbeeld). Maar de PRIJS die de consument betaalt = wat de vraaglijn op Q=60 teruggeeft = 120. Altijd op V.",
    });
    // Two columns: correct vs incorrect
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.0, fill: { color: PC.chalk }, line: { color: PC.coralDeep, width: 2 } });
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 0.4, fill: { color: PC.coralDeep } });
    s.addText("FOUT", {
      x: 0.5, y: 2.02, w: 4.4, h: 0.36,
      fontFace: FONT_SANS, fontSize: 14, bold: true, color: PC.chalk, align: "center", valign: "middle", charSpacing: 3,
    });
    s.addText("p* = MK = 60", {
      x: 0.7, y: 2.7, w: 4, h: 0.8,
      fontFace: FONT_DISPLAY, fontSize: 30, bold: true, color: PC.coralDeep,
    });
    s.addText("De MK-lijn geeft niet de prijs — zij geeft de extra kosten per eenheid.", {
      x: 0.7, y: 3.6, w: 4, h: 1.2,
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.smoke, lineSpacingMultiple: 1.3,
    });

    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.0, fill: { color: PC.chalk }, line: { color: PC.tealDeep, width: 2 } });
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 0.4, fill: { color: PC.tealDeep } });
    s.addText("GOED", {
      x: 5.1, y: 2.02, w: 4.4, h: 0.36,
      fontFace: FONT_SANS, fontSize: 14, bold: true, color: PC.chalk, align: "center", valign: "middle", charSpacing: 3,
    });
    s.addText("p* = 180 − 60 = 120", {
      x: 5.3, y: 2.7, w: 4, h: 0.8,
      fontFace: FONT_DISPLAY, fontSize: 30, bold: true, color: PC.tealDeep,
    });
    s.addText("Invullen in de vraagvergelijking V: p = 180 − Q.", {
      x: 5.3, y: 3.6, w: 4, h: 1.2,
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.smoke, lineSpacingMultiple: 1.3,
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 15 — Monopolie vs duopolie grafiek
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.monoDuo, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Zodra een buitenlandse toetreder de markt betreedt, wordt de binnenlandse monopolist een Cournot-duopolist. Gevolg: hogere totale Q, lagere prijs, hoger consumentensurplus. Intra-industriële handel = de facto meer concurrentie.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 16 — Section: DEEL 4 EURO-EFFECT
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 4",
    title: "De euro als handelsmotor",
    subtitle: "2002: één munt voor twaalf landen. Wat deed dat met de intra-industriële handel binnen de eurozone?",
    notes: "Empirische koppeling. De euro zijnde lagere transactiekosten in actie. Drie kanalen.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 17 — Euro effecten flowchart
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.euro, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Drie kanalen, alle drie positief: geen wisselkoersrisico, lagere transactiekosten, meer prijstransparantie. Samen: meer handel. Benadruk: alle drie versterken elkaar, alle drie POSITIEF voor volume intra-industriële handel.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 18 — Voorbeeld: Nederlandse fietsexporteur
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Concreet",
      title: "Een Nederlandse fietsfabrikant exporteert naar Spanje.",
      subtitle: "Hoe zag de wereld eruit vóór en na de euro?",
      notes: "Contrast maken. Voor 2002: gulden <-> peseta, wisselkoers risicovol, banken namen marge, prijzen moesten steeds omgerekend. Na: één munt, één prijs, één markt.",
    });
    // Vóór
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.0, fill: { color: PC.chalk }, line: { color: PC.ash, width: 1 } });
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 0.45, fill: { color: PC.smoke } });
    s.addText("VÓÓR 2002", {
      x: 0.5, y: 2.02, w: 4.4, h: 0.4,
      fontFace: FONT_SANS, fontSize: 14, bold: true, color: PC.chalk, align: "center", valign: "middle", charSpacing: 4,
    });
    [
      "Wisselkoers gulden ↔ peseta schommelt",
      "Omwisselkosten bij iedere betaling",
      "Prijslijsten in 12 valuta's",
      "Vergelijken met concurrenten moeilijk",
    ].forEach((t, i) => {
      s.addShape("ellipse", { x: 0.75, y: 2.75 + i * 0.48, w: 0.12, h: 0.12, fill: { color: PC.coralDeep } });
      s.addText(t, {
        x: 1.0, y: 2.65 + i * 0.48, w: 3.8, h: 0.4,
        fontFace: FONT_SANS, fontSize: 15, color: PC.ink, valign: "middle",
      });
    });

    // Na
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.0, fill: { color: PC.chalk }, line: { color: PC.tealDeep, width: 1.5 } });
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 0.45, fill: { color: PC.tealDeep } });
    s.addText("NA 2002", {
      x: 5.1, y: 2.02, w: 4.4, h: 0.4,
      fontFace: FONT_SANS, fontSize: 14, bold: true, color: PC.chalk, align: "center", valign: "middle", charSpacing: 4,
    });
    [
      "Prijs in euro's — stabiel",
      "Geen omwisselkosten meer",
      "Eén prijslijst voor de eurozone",
      "Consument vergelijkt direct",
    ].forEach((t, i) => {
      s.addShape("rect", { x: 5.35, y: 2.75 + i * 0.48, w: 0.12, h: 0.12, fill: { color: PC.tealDeep } });
      s.addText(t, {
        x: 5.6, y: 2.65 + i * 0.48, w: 3.8, h: 0.4,
        fontFace: FONT_SANS, fontSize: 15, color: PC.ink, valign: "middle",
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 19 — Valkuilen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Denkfouten",
      title: "Drie valkuilen die bij de toets altijd terugkomen.",
      notes: "Benadruk elk: dit zijn de klassieke fouten. Wie ze kent, struikelt er niet meer over.",
    });
    const items = [
      { num: "01", claim: "Intra-industriële handel wordt verklaard door comparatief voordeel",
        truth: "Onjuist. Intra wordt verklaard door productdifferentiatie, schaalvoordelen en lage transactiekosten. Comparatief voordeel verklaart juist INTER-industriële handel." },
      { num: "02", claim: "Bij MO = MK lees je de prijs af op de MK-lijn",
        truth: "Onjuist. De prijs lees je af op de vraaglijn V. Bij Q* = 60 → p* = 180 − 60 = 120." },
      { num: "03", claim: "De euro heeft alleen voordelen voor handel",
        truth: "Voor de handel wél — alle drie effecten zijn positief. Maar landen verliezen hun eigen monetair beleid: ze kunnen niet meer devalueren bij een crisis." },
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
        x: 1.65, y: y + 0.08, w: 7.8, h: 0.85,
        lineSpacingMultiple: 1.3, valign: "top",
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 20 — Closing: samenvatting
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
      { n: "01", t: "Intra = zelfde sector in beide richtingen (NL ↔ DE fietsen)" },
      { n: "02", t: "Inter = verschillende sectoren; verklaard door comparatief voordeel" },
      { n: "03", t: "Drie factoren: productdifferentiatie, schaalvoordelen, lage transactiekosten" },
      { n: "04", t: "Schaalvoordelen: meer productie → lagere stuk­kosten" },
      { n: "05", t: "Monopolie → duopolie bij toetreding: p ↓, Q ↑, CS ↑" },
      { n: "06", t: "Euro (2002): geen wisselkoersrisico, lagere kosten, prijs­transparantie" },
    ];
    items.forEach((it, i) => {
      const y = 1.85 + i * 0.52;
      s.addText(it.n, {
        x: 0.6, y, w: 0.75, h: 0.5,
        fontFace: FONT_DISPLAY, fontSize: 22, bold: true, color: PC.coral, charSpacing: -1,
      });
      s.addText(it.t, {
        x: 1.35, y: y + 0.05, w: 8.15, h: 0.45,
        fontFace: FONT_SANS, fontSize: 15, color: PC.chalk, valign: "middle",
      });
      if (i < items.length - 1) {
        s.addShape("rect", { x: 0.6, y: y + 0.48, w: 8.8, h: 0.005, fill: { color: PC.indigoSoft } });
      }
    });
    s.addNotes("Retrieval-moment: laat leerlingen deze 6 punten zonder hulp herhalen. Wie struikelt bij punt 3 of 5: terug naar de bijbehorende dia.");
  }

  // ────────────────────────────────────────────────────────────────────
  // OUTPUT
  // ────────────────────────────────────────────────────────────────────
  const outDir = path.resolve(__dirname, "../../output-343");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Save raw SVGs for debugging
  const svgDir = path.join(outDir, "svg");
  if (!fs.existsSync(svgDir)) fs.mkdirSync(svgDir, { recursive: true });
  for (const [k, v] of Object.entries(svgs)) {
    fs.writeFileSync(path.join(svgDir, `343-${k}.svg`), v, "utf8");
  }

  const outPath = path.join(outDir, "3.4.3 Intra-industriele handel – presentatie.pptx");
  await pres.writeFile({ fileName: outPath });
  const fix = await fixPptxFile(outPath);
  roundtripWithLibreOffice(outPath);
  console.log(`PPTX written to ${outPath} (fix: -${fix.removedOverrides} phantom overrides, -${fix.removedEmptyDirs} empty dirs; roundtripped via LibreOffice)`);
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
