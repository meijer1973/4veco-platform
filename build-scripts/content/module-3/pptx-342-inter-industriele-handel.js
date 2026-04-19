/**
 * pptx-342-inter-industriele-handel.js — §3.4.2 Inter-industriële handel
 * CREATIVE editorial design — comparative advantage, Ricardo, specialisation.
 *
 * Terminology note: we use **"alternatieve kosten"** throughout (official Dutch
 * economics term per 4veco canonical terminology list). The source HTML uses
 * the older "opofferingskosten" but project rules override this.
 */

const {
  PC, SC, T, FONT_SANS, FONT_DISPLAY, FONT_SERIF,
  defineMasters, softShadow, tightShadow,
  svgToPng, pngB64, svgData,
  ICON, placeIcon,
  svgHeader, editorialTitle, fixPptxFile, roundtripWithLibreOffice,
} = require("../../lib/lib-pptx.js");

const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM SVG SCENES
// ═══════════════════════════════════════════════════════════════════════════

// Opener — stylised world-trade scene: ships + containers + globe arc
function svgTradeScene() {
  return `${svgHeader(1280, 420, SC.indigoDeep)}
    <!-- stars -->
    ${Array.from({length: 22}, (_, i) => {
      const x = 40 + (i * 131) % 1200, y = 30 + (i * 47) % 140;
      return `<circle cx="${x}" cy="${y}" r="1" fill="#ffffff" opacity="${0.15 + (i % 3) * 0.12}"/>`;
    }).join("")}

    <defs>
      <linearGradient id="oceanG" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${SC.indigoMid}"/>
        <stop offset="1" stop-color="${SC.indigoDeep}"/>
      </linearGradient>
      <linearGradient id="horizG" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${SC.amber}" stop-opacity="0"/>
        <stop offset="1" stop-color="${SC.amber}" stop-opacity="0.28"/>
      </linearGradient>
    </defs>

    <!-- horizon glow -->
    <rect x="0" y="210" width="1280" height="70" fill="url(#horizG)"/>

    <!-- ocean -->
    <rect x="0" y="270" width="1280" height="150" fill="url(#oceanG)"/>
    <path d="M0 290 Q80 284 160 290 T320 290 T480 290 T640 290 T800 290 T960 290 T1120 290 T1280 290" stroke="${SC.teal}" stroke-width="1.2" fill="none" opacity="0.6"/>
    <path d="M0 312 Q80 306 160 312 T320 312 T480 312 T640 312 T800 312 T960 312 T1120 312 T1280 312" stroke="${SC.teal}" stroke-width="1" fill="none" opacity="0.32"/>

    <!-- distant continent silhouettes -->
    <path d="M0 270 L0 250 L140 244 L220 248 L300 242 L360 246 L420 240 L480 244 L540 238 L600 244 L660 240 L740 246 L820 240 L900 244 L980 238 L1060 244 L1140 240 L1200 244 L1280 248 L1280 270 Z"
          fill="${SC.indigoDeep}" stroke="${SC.indigo}" stroke-width="1"/>

    <!-- container ship left (NL → ID) -->
    <g transform="translate(220,258)">
      <rect x="0" y="0" width="140" height="18" fill="${SC.indigo}"/>
      <!-- containers -->
      <rect x="6" y="-12" width="18" height="12" fill="${SC.coral}"/>
      <rect x="26" y="-12" width="18" height="12" fill="${SC.amber}"/>
      <rect x="46" y="-12" width="18" height="12" fill="${SC.teal}"/>
      <rect x="66" y="-12" width="18" height="12" fill="${SC.coral}"/>
      <rect x="86" y="-12" width="18" height="12" fill="${SC.olive}"/>
      <rect x="6" y="-24" width="18" height="12" fill="${SC.amberDeep}"/>
      <rect x="46" y="-24" width="18" height="12" fill="${SC.coralDeep}"/>
      <rect x="86" y="-24" width="18" height="12" fill="${SC.tealDeep}"/>
      <!-- bridge -->
      <rect x="110" y="-18" width="22" height="18" fill="${SC.indigoMid}"/>
      <rect x="118" y="-12" width="4" height="4" fill="${SC.amber}" opacity="0.8"/>
      <!-- hull bottom -->
      <polygon points="0,18 140,18 130,30 10,30" fill="${SC.indigoDeep}"/>
    </g>

    <!-- container ship right -->
    <g transform="translate(860,262)">
      <rect x="0" y="0" width="120" height="16" fill="${SC.indigo}"/>
      <rect x="6" y="-10" width="16" height="10" fill="${SC.teal}"/>
      <rect x="24" y="-10" width="16" height="10" fill="${SC.amber}"/>
      <rect x="42" y="-10" width="16" height="10" fill="${SC.coral}"/>
      <rect x="60" y="-10" width="16" height="10" fill="${SC.olive}"/>
      <rect x="78" y="-10" width="16" height="10" fill="${SC.coralDeep}"/>
      <rect x="96" y="-18" width="18" height="18" fill="${SC.indigoMid}"/>
      <rect x="102" y="-12" width="4" height="4" fill="${SC.amber}" opacity="0.8"/>
      <polygon points="0,16 120,16 112,26 8,26" fill="${SC.indigoDeep}"/>
    </g>

    <!-- curved arc connecting the two ships (trade route) -->
    <path d="M 290 240 Q 640 80 920 240" stroke="${SC.coral}" stroke-width="2" fill="none" stroke-dasharray="6 5" opacity="0.75"/>
    <circle cx="290" cy="240" r="4" fill="${SC.coral}"/>
    <circle cx="920" cy="240" r="4" fill="${SC.coral}"/>

    <!-- tiny flags -->
    <g transform="translate(278,206)">
      <rect x="0" y="0" width="24" height="14" fill="${SC.coralDeep}"/>
      <rect x="0" y="4" width="24" height="6" fill="#ffffff"/>
      <rect x="0" y="10" width="24" height="4" fill="${SC.indigo}"/>
      <text x="30" y="12" font-family="Segoe UI" font-size="11" font-weight="700" fill="${SC.cloud}">NL</text>
    </g>
    <g transform="translate(898,206)">
      <rect x="0" y="0" width="24" height="14" fill="${SC.coralDeep}"/>
      <rect x="0" y="7" width="24" height="7" fill="#ffffff"/>
      <text x="30" y="12" font-family="Segoe UI" font-size="11" font-weight="700" fill="${SC.cloud}">ID</text>
    </g>

    <!-- moon / sun -->
    <circle cx="1080" cy="110" r="28" fill="${SC.amber}" opacity="0.3"/>
    <circle cx="1080" cy="110" r="18" fill="${SC.amber}" opacity="0.6"/>
  </svg>`;
}

// Inter vs intra — side-by-side conceptual diagram
function svgInterVsIntra() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Inter-industrieel: verschillende sectoren. Intra-industrieel: dezelfde sector.", "TWEE SOORTEN INTERNATIONALE HANDEL")}

    <!-- LEFT card: inter -->
    <rect x="80" y="160" width="560" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.coral}" stroke-width="2"/>
    <rect x="80" y="160" width="560" height="54" fill="${SC.coralDeep}" rx="14"/>
    <rect x="80" y="200" width="560" height="14" fill="${SC.coralDeep}"/>
    <text x="360" y="196" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Inter-industriële handel</text>
    <text x="360" y="240" text-anchor="middle" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="${SC.coralDeep}">VERSCHILLENDE producten</text>

    <!-- NL box -->
    <rect x="120" y="276" width="200" height="78" rx="8" fill="${SC.sky}" stroke="${SC.indigo}" stroke-width="1.5"/>
    <text x="220" y="306" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">NEDERLAND</text>
    <text x="220" y="336" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="${SC.indigo}">machines</text>

    <!-- swap arrows -->
    <g transform="translate(340,302)">
      <line x1="0" y1="0" x2="60" y2="0" stroke="${SC.coral}" stroke-width="2.5" marker-end="url(#ah-coral)"/>
      <line x1="60" y1="28" x2="0" y2="28" stroke="${SC.coral}" stroke-width="2.5" marker-end="url(#ah-coral)"/>
    </g>

    <!-- ID box -->
    <rect x="420" y="276" width="200" height="78" rx="8" fill="${SC.sky}" stroke="${SC.indigo}" stroke-width="1.5"/>
    <text x="520" y="306" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">INDONESIË</text>
    <text x="520" y="336" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="${SC.indigo}">koffie</text>

    <text x="360" y="414" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.ash}" letter-spacing="2">GEDREVEN DOOR</text>
    <text x="360" y="448" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="${SC.coralDeep}">comparatief voordeel</text>
    <text x="360" y="478" text-anchor="middle" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.smoke}">ieder land specialiseert in wat</text>
    <text x="360" y="500" text-anchor="middle" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.smoke}">het relatief het efficiëntst maakt</text>
    <line x1="220" y1="528" x2="500" y2="528" stroke="${SC.coral}" stroke-width="1.5"/>
    <text x="360" y="554" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">theorie van David Ricardo — 1817</text>

    <!-- RIGHT card: intra -->
    <rect x="680" y="160" width="520" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.teal}" stroke-width="2"/>
    <rect x="680" y="160" width="520" height="54" fill="${SC.tealDeep}" rx="14"/>
    <rect x="680" y="200" width="520" height="14" fill="${SC.tealDeep}"/>
    <text x="940" y="196" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Intra-industriële handel</text>
    <text x="940" y="240" text-anchor="middle" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="${SC.tealDeep}">DEZELFDE sector</text>

    <rect x="720" y="276" width="200" height="78" rx="8" fill="${SC.sky}" stroke="${SC.indigo}" stroke-width="1.5"/>
    <text x="820" y="306" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">NEDERLAND</text>
    <text x="820" y="336" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.indigo}">DAF-vrachtwagens</text>

    <g transform="translate(940,302)">
      <line x1="0" y1="0" x2="60" y2="0" stroke="${SC.teal}" stroke-width="2.5" marker-end="url(#ah-coral)"/>
      <line x1="60" y1="28" x2="0" y2="28" stroke="${SC.teal}" stroke-width="2.5" marker-end="url(#ah-coral)"/>
    </g>

    <rect x="1020" y="276" width="160" height="78" rx="8" fill="${SC.sky}" stroke="${SC.indigo}" stroke-width="1.5"/>
    <text x="1100" y="306" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">DUITSLAND</text>
    <text x="1100" y="336" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.indigo}">MAN-vrachtwagens</text>

    <text x="940" y="414" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.ash}" letter-spacing="2">GEDREVEN DOOR</text>
    <text x="940" y="448" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="${SC.tealDeep}">productdifferentiatie</text>
    <text x="940" y="478" text-anchor="middle" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.smoke}">consumenten willen keuze; schaal-</text>
    <text x="940" y="500" text-anchor="middle" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.smoke}">voordelen en merkidentiteit tellen mee</text>
    <line x1="820" y1="528" x2="1060" y2="528" stroke="${SC.teal}" stroke-width="1.5"/>
    <text x="940" y="554" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">behandelen we in §3.4.3</text>
  </svg>`;
}

// PPC diagram — two countries, linear PPCs with different slopes
function svgPPCCompare() {
  const w = 1280, h = 640;
  // Two side-by-side charts
  const chartW = 460, chartH = 360;
  const ph1x = 120, ph1y = 170;   // Frankrijk chart origin (top-left of axes)
  const ph2x = 700, ph2y = 170;   // Zweden

  // Frankrijk: 12.000 uur totaal. 1 jet = 4.000 uur, 1 auto = 4 uur (arbitrary).
  // For display we use JETS on Y, AUTOS on X.
  // Max jets = 12.000/4.000 = 3. Max autos = 12.000/4 = 3.000. Slope -1 jet per 1.000 autos.
  // Zweden: 10.000 uur. 1 jet = 2.000 uur, 1 auto = 2 uur.
  // Max jets = 5. Max autos = 5.000. Slope -1 jet per 1.000 autos? No: 1 jet = 5×(1 auto/200u? ) ...
  // Use HTML numbers: France 1 jet = 3.000 auto (alternatieve kosten); Zweden 1 jet = 5.000 auto.
  // So France: max jets 3 → autos 3×3000=9000 if total trades off. Simpler: show via slope.
  // Let's use: France PPC from (9000,0) to (0,3) — slope -3/9000 = -1/3000.
  // Sweden PPC from (10000,0) to (0,2) — slope -2/10000 = -1/5000.
  // This matches: giving up 1 jet → gain 3000 autos (FR), 5000 autos (ZW).

  const maxX = 12000, maxY = 6;
  const qToX = (q, px) => px + 60 + (q / maxX) * (chartW - 100);
  const pToY = (p, py) => py + chartH - 60 - (p / maxY) * (chartH - 100);

  function drawChart(ox, oy, title, color, jets, autos, consumePt) {
    // PPC from (autos,0) to (0,jets)
    const x0 = qToX(autos, ox), y0 = pToY(0, oy);
    const x1 = qToX(0, ox),     y1 = pToY(jets, oy);
    const cx = qToX(consumePt.a, ox), cy = pToY(consumePt.j, oy);

    return `
      <!-- frame -->
      <rect x="${ox}" y="${oy}" width="${chartW}" height="${chartH}" rx="10" fill="${SC.chalk}" stroke="${SC.cloud}" stroke-width="1"/>
      <rect x="${ox}" y="${oy}" width="${chartW}" height="40" fill="${color}" rx="10"/>
      <rect x="${ox}" y="${oy + 28}" width="${chartW}" height="12" fill="${color}"/>
      <text x="${ox + chartW/2}" y="${oy + 26}" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="#ffffff">${title}</text>

      <!-- axes -->
      <line x1="${qToX(0, ox)}" y1="${pToY(0, oy)}" x2="${qToX(0, ox)}" y2="${pToY(maxY, oy) - 10}"
            stroke="${SC.ink}" stroke-width="1.6" marker-end="url(#ah-ink)"/>
      <line x1="${qToX(0, ox)}" y1="${pToY(0, oy)}" x2="${qToX(maxX, ox) + 10}" y2="${pToY(0, oy)}"
            stroke="${SC.ink}" stroke-width="1.6" marker-end="url(#ah-ink)"/>

      <!-- axis labels -->
      <text x="${qToX(0, ox) - 35}" y="${oy + 60}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.smoke}">Jets</text>
      <text x="${qToX(maxX, ox) - 30}" y="${pToY(0, oy) + 28}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.smoke}">Auto's</text>

      <!-- axis ticks -->
      <text x="${qToX(0, ox) - 10}" y="${pToY(jets, oy) + 4}" text-anchor="end" font-family="${FONT_SANS}" font-size="11" fill="${SC.smoke}">${jets}</text>
      <line x1="${qToX(0, ox) - 4}" y1="${pToY(jets, oy)}" x2="${qToX(0, ox) + 4}" y2="${pToY(jets, oy)}" stroke="${SC.ink}" stroke-width="1.2"/>
      <text x="${qToX(autos, ox)}" y="${pToY(0, oy) + 20}" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" fill="${SC.smoke}">${autos.toLocaleString("nl-NL")}</text>
      <line x1="${qToX(autos, ox)}" y1="${pToY(0, oy) - 4}" x2="${qToX(autos, ox)}" y2="${pToY(0, oy) + 4}" stroke="${SC.ink}" stroke-width="1.2"/>

      <!-- PPC line -->
      <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="${color}" stroke-width="3"/>

      <!-- shaded production possibility area -->
      <polygon points="${qToX(0, ox)},${pToY(0, oy)} ${x0},${y0} ${x1},${y1}"
               fill="${color}" fill-opacity="0.08"/>

      <!-- consumption dot (autarky) -->
      <circle cx="${cx}" cy="${cy}" r="7" fill="${color}"/>
      <circle cx="${cx}" cy="${cy}" r="12" fill="none" stroke="${color}" stroke-width="1.6" opacity="0.5"/>
      <text x="${cx + 14}" y="${cy - 8}" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${color}">autarkie</text>

      <!-- slope annotation -->
      <text x="${ox + 24}" y="${oy + chartH - 10}" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">
        helling = alternatieve kosten van 1 jet
      </text>
    `;
  }

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Dezelfde uren, ander PPC: ieder land heeft eigen alternatieve kosten.", "PRODUCTIEMOGELIJKHEDENCURVE  ·  2 LANDEN")}

    ${drawChart(ph1x, ph1y, "Frankrijk · 12.000 uur", SC.coralDeep, 3, 9000, { a: 6000, j: 1 })}
    ${drawChart(ph2x, ph2y, "Zweden · 10.000 uur", SC.tealDeep,   2, 10000, { a: 5000, j: 1 })}

    <!-- Comparison banner -->
    <rect x="120" y="555" width="1040" height="56" rx="8" fill="${SC.indigoDeep}"/>
    <text x="140" y="582" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.amber}" letter-spacing="3">ALTERNATIEVE KOSTEN PER 1 JET</text>
    <text x="140" y="603" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.chalk}">Frankrijk geeft 3.000 auto's op · Zweden geeft 5.000 auto's op  →  Frankrijk is relatief efficiënter in jets</text>
  </svg>`;
}

// Comparative advantage matrix — 2×2 table
function svgCompAdvMatrix() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Wie specialiseert in wat? Lees de laagste alternatieve kosten per kolom.", "COMPARATIEF VOORDEEL")}

    <!-- Header row -->
    <rect x="260" y="160" width="420" height="60" fill="${SC.indigo}"/>
    <rect x="680" y="160" width="420" height="60" fill="${SC.indigoMid}"/>
    <text x="470" y="198" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="#ffffff">Straaljagers (jets)</text>
    <text x="890" y="198" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="#ffffff">Auto's</text>

    <!-- FR row -->
    <rect x="80" y="220" width="180" height="120" fill="${SC.coralDeep}"/>
    <text x="170" y="270" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="#ffffff">Frankrijk</text>
    <text x="170" y="296" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.amber}">12.000 uur totaal</text>

    <rect x="260" y="220" width="420" height="120" fill="${SC.goodBg}" stroke="${SC.coral}" stroke-width="3"/>
    <text x="470" y="260" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">ALT. KOSTEN 1 JET</text>
    <text x="470" y="302" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="34" font-weight="700" fill="${SC.coralDeep}">3.000 auto's</text>
    <text x="470" y="326" text-anchor="middle" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.goodInk}">LAAGSTE  →  comparatief voordeel</text>

    <rect x="680" y="220" width="420" height="120" fill="${SC.chalk}" stroke="${SC.cloud}" stroke-width="1"/>
    <text x="890" y="260" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">ALT. KOSTEN 1 AUTO</text>
    <text x="890" y="302" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="34" font-weight="700" fill="${SC.smoke}">1/3.000 jet</text>
    <text x="890" y="326" text-anchor="middle" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">≈ 0,00033 jet</text>

    <!-- ZW row -->
    <rect x="80" y="340" width="180" height="120" fill="${SC.tealDeep}"/>
    <text x="170" y="390" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="#ffffff">Zweden</text>
    <text x="170" y="416" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.amber}">10.000 uur totaal</text>

    <rect x="260" y="340" width="420" height="120" fill="${SC.chalk}" stroke="${SC.cloud}" stroke-width="1"/>
    <text x="470" y="380" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">ALT. KOSTEN 1 JET</text>
    <text x="470" y="422" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="34" font-weight="700" fill="${SC.smoke}">5.000 auto's</text>
    <text x="470" y="446" text-anchor="middle" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">hoger — geen voordeel</text>

    <rect x="680" y="340" width="420" height="120" fill="${SC.goodBg}" stroke="${SC.teal}" stroke-width="3"/>
    <text x="890" y="380" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">ALT. KOSTEN 1 AUTO</text>
    <text x="890" y="422" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="34" font-weight="700" fill="${SC.tealDeep}">1/5.000 jet</text>
    <text x="890" y="446" text-anchor="middle" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.goodInk}">LAAGSTE  →  comparatief voordeel</text>

    <!-- Conclusion -->
    <rect x="80" y="490" width="1020" height="110" rx="10" fill="${SC.indigoDeep}"/>
    <text x="100" y="522" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="3">CONCLUSIE</text>
    <text x="100" y="560" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Frankrijk specialiseert in jets · Zweden specialiseert in auto's.</text>
    <text x="100" y="586" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.cloud}">Niet de absolute productiviteit telt, maar wie iets met de laagste alternatieve kosten maakt.</text>
  </svg>`;
}

// Absolute vs comparative — contrast card
function svgAbsVsComp() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Twee soorten voordeel die vaak door elkaar worden gehaald.", "ABSOLUUT VS COMPARATIEF VOORDEEL")}

    <!-- LEFT: absoluut -->
    <rect x="80" y="160" width="560" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.amber}" stroke-width="2"/>
    <rect x="80" y="160" width="560" height="54" fill="${SC.amberDeep}" rx="14"/>
    <rect x="80" y="200" width="560" height="14" fill="${SC.amberDeep}"/>
    <text x="360" y="196" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Absoluut voordeel</text>

    <text x="360" y="256" text-anchor="middle" font-family="${FONT_SERIF}" font-size="20" font-style="italic" fill="${SC.amberDeep}">"Wie maakt het meest?"</text>
    <line x1="180" y1="280" x2="540" y2="280" stroke="${SC.amber}" stroke-width="1.5"/>

    <text x="110" y="316" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.ash}" letter-spacing="2">DEFINITIE</text>
    <text x="110" y="346" font-family="${FONT_SANS}" font-size="15" fill="${SC.ink}">Een land produceert met minder uren</text>
    <text x="110" y="368" font-family="${FONT_SANS}" font-size="15" fill="${SC.ink}">per eenheid dan het andere land.</text>

    <text x="110" y="408" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.ash}" letter-spacing="2">VOORBEELD</text>
    <text x="110" y="438" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.smoke}">Zweden heeft 1 jet in 2.000 uur,</text>
    <text x="110" y="460" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.smoke}">Frankrijk in 4.000 uur.</text>
    <text x="110" y="486" font-family="${FONT_SANS}" font-size="15" font-weight="700" fill="${SC.amberDeep}">→ Zweden heeft absoluut voordeel.</text>

    <rect x="110" y="510" width="500" height="54" rx="8" fill="${SC.warnBg}" stroke="${SC.warnInk}" stroke-width="1"/>
    <text x="130" y="532" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.warnInk}" letter-spacing="2">VALKUIL</text>
    <text x="130" y="552" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.warnInk}">Alleen kijken naar wie sneller is, levert géén specialisatiebeslissing op.</text>

    <!-- RIGHT: comparatief -->
    <rect x="680" y="160" width="520" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.coral}" stroke-width="2"/>
    <rect x="680" y="160" width="520" height="54" fill="${SC.coralDeep}" rx="14"/>
    <rect x="680" y="200" width="520" height="14" fill="${SC.coralDeep}"/>
    <text x="940" y="196" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Comparatief voordeel</text>

    <text x="940" y="256" text-anchor="middle" font-family="${FONT_SERIF}" font-size="20" font-style="italic" fill="${SC.coralDeep}">"Wie geeft het minst op?"</text>
    <line x1="760" y1="280" x2="1120" y2="280" stroke="${SC.coral}" stroke-width="1.5"/>

    <text x="710" y="316" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.ash}" letter-spacing="2">DEFINITIE</text>
    <text x="710" y="346" font-family="${FONT_SANS}" font-size="15" fill="${SC.ink}">Een land heeft lagere alternatieve</text>
    <text x="710" y="368" font-family="${FONT_SANS}" font-size="15" fill="${SC.ink}">kosten dan het andere land.</text>

    <text x="710" y="408" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.ash}" letter-spacing="2">VOORBEELD</text>
    <text x="710" y="438" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.smoke}">Frankrijk geeft 3.000 auto's op per jet,</text>
    <text x="710" y="460" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.smoke}">Zweden geeft er 5.000 op.</text>
    <text x="710" y="486" font-family="${FONT_SANS}" font-size="15" font-weight="700" fill="${SC.coralDeep}">→ Frankrijk heeft comparatief voordeel.</text>

    <rect x="710" y="510" width="460" height="54" rx="8" fill="${SC.goodBg}" stroke="${SC.goodInk}" stroke-width="1"/>
    <text x="730" y="532" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.goodInk}" letter-spacing="2">DIT BESLIST SPECIALISATIE</text>
    <text x="730" y="552" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.goodInk}">Een land kan in alles langzamer zijn én toch comparatief voordeel hebben.</text>
  </svg>`;
}

// Gains from trade — output table before vs after
function svgGainsFromTrade() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Dezelfde uren, meer output: specialisatie creëert welvaart.", "HANDELSVOORDEEL  ·  VOOR ↔ NA SPECIALISATIE")}

    <!-- Column headers -->
    <rect x="260" y="160" width="280" height="50" fill="${SC.indigoMid}"/>
    <rect x="540" y="160" width="280" height="50" fill="${SC.indigoMid}"/>
    <rect x="820" y="160" width="280" height="50" fill="${SC.coralDeep}"/>
    <text x="400" y="192" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="#ffffff" letter-spacing="2">ZONDER HANDEL (AUTARKIE)</text>
    <text x="680" y="192" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="#ffffff" letter-spacing="2">MET SPECIALISATIE</text>
    <text x="960" y="192" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="#ffffff" letter-spacing="2">WINST</text>

    <!-- FR row -->
    <rect x="80" y="210" width="180" height="100" fill="${SC.coralDeep}"/>
    <text x="170" y="250" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="#ffffff">Frankrijk</text>
    <text x="170" y="276" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.amber}">jets</text>

    <rect x="260" y="210" width="280" height="100" fill="${SC.chalk}" stroke="${SC.cloud}"/>
    <text x="280" y="244" font-family="${FONT_SANS}" font-size="13" fill="${SC.ash}">1 jet zelf</text>
    <text x="280" y="266" font-family="${FONT_SANS}" font-size="13" fill="${SC.ash}">2.000 auto's zelf</text>
    <text x="280" y="290" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">uren: 4.000 + 8.000 = 12.000</text>

    <rect x="540" y="210" width="280" height="100" fill="${SC.sky}" stroke="${SC.cloud}"/>
    <text x="560" y="244" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">3 jets (alle 12.000 uur)</text>
    <text x="560" y="266" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">0 auto's zelf</text>
    <text x="560" y="290" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">importeert auto's uit Zweden</text>

    <rect x="820" y="210" width="280" height="100" fill="${SC.goodBg}" stroke="${SC.goodInk}" stroke-width="2"/>
    <text x="840" y="244" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.goodInk}">+ 2 jets extra</text>
    <text x="840" y="266" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.goodInk}">voor ruil met Zweden</text>
    <text x="840" y="290" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">consumeert buiten eigen PPC</text>

    <!-- ZW row -->
    <rect x="80" y="310" width="180" height="100" fill="${SC.tealDeep}"/>
    <text x="170" y="350" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="#ffffff">Zweden</text>
    <text x="170" y="376" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.amber}">auto's</text>

    <rect x="260" y="310" width="280" height="100" fill="${SC.chalk}" stroke="${SC.cloud}"/>
    <text x="280" y="344" font-family="${FONT_SANS}" font-size="13" fill="${SC.ash}">1 jet zelf</text>
    <text x="280" y="366" font-family="${FONT_SANS}" font-size="13" fill="${SC.ash}">4.000 auto's zelf</text>
    <text x="280" y="390" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">uren: 2.000 + 8.000 = 10.000</text>

    <rect x="540" y="310" width="280" height="100" fill="${SC.sky}" stroke="${SC.cloud}"/>
    <text x="560" y="344" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">0 jets zelf</text>
    <text x="560" y="366" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">5.000 auto's (alle uren)</text>
    <text x="560" y="390" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">importeert jets uit Frankrijk</text>

    <rect x="820" y="310" width="280" height="100" fill="${SC.goodBg}" stroke="${SC.goodInk}" stroke-width="2"/>
    <text x="840" y="344" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.goodInk}">+ 1.000 auto's extra</text>
    <text x="840" y="366" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.goodInk}">voor ruil met Frankrijk</text>
    <text x="840" y="390" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">consumeert buiten eigen PPC</text>

    <!-- Footer: ruilverhouding -->
    <rect x="80" y="450" width="1020" height="140" rx="10" fill="${SC.indigoDeep}"/>
    <text x="100" y="482" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="3">RUILVERHOUDING  ·  TUSSEN 3.000 EN 5.000 AUTO'S PER JET</text>
    <text x="100" y="516" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Bij ruilprijs 4.000 auto's per jet: beide landen winnen.</text>
    <text x="100" y="544" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.cloud}">Frankrijk ruilt 2 jets tegen 8.000 auto's (meer dan de 6.000 die het zelf had kunnen maken).</text>
    <text x="100" y="568" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.cloud}">Zweden ruilt 8.000 auto's tegen 2 jets (meer dan de 1,6 jets die 8.000 auto's in eigen land zouden kosten).</text>
  </svg>`;
}

// Ricardo formula card
function svgOpofferingsFormula() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("De formule die bepaalt wie in wat specialiseert.", "ALTERNATIEVE KOSTEN  ·  BEREKENEN")}

    <!-- Formula box -->
    <rect x="160" y="180" width="960" height="160" rx="14" fill="${SC.indigo}"/>
    <rect x="160" y="180" width="8" height="160" fill="${SC.coral}"/>
    <text x="200" y="218" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.amber}" letter-spacing="3">FORMULE</text>
    <text x="200" y="268" font-family="${FONT_DISPLAY}" font-size="32" font-weight="700" fill="#ffffff">Alt. kosten van A  =  (uren A / uren B)  ×  eenheid B</text>
    <text x="200" y="306" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="${SC.cloud}">"Hoeveel eenheden van B geef ik op om 1 eenheid A te maken?"</text>

    <!-- Worked example -->
    <rect x="160" y="370" width="960" height="220" rx="14" fill="${SC.chalk}" stroke="${SC.coral}" stroke-width="2"/>
    <rect x="160" y="370" width="8" height="220" fill="${SC.coral}"/>
    <text x="200" y="408" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.ash}" letter-spacing="3">VOORBEELD  ·  FRANKRIJK</text>

    <text x="200" y="442" font-family="${FONT_SANS}" font-size="15" fill="${SC.ink}">Totaal 12.000 uur. 1 jet kost 4.000 uur, 1.000 auto's kosten 4.000 uur.</text>

    <text x="200" y="484" font-family="${FONT_DISPLAY}" font-size="24" font-weight="700" fill="${SC.coralDeep}">Alt. kosten 1 jet</text>
    <text x="440" y="484" font-family="${FONT_DISPLAY}" font-size="24" font-weight="700" fill="${SC.ink}">=  (4.000 / 4.000) × 1.000</text>
    <text x="820" y="484" font-family="${FONT_DISPLAY}" font-size="24" font-weight="700" fill="${SC.indigo}">=  3.000 auto's</text>
    <text x="200" y="524" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.smoke}">Wacht — dat is 1, niet 3. Laten we de formule netjes maken:</text>

    <text x="200" y="558" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="${SC.indigo}">Alt. kosten 1 jet  =  (uren/jet) / (uren per 1.000 auto's)  ×  1.000</text>
    <text x="200" y="582" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="${SC.coralDeep}">=  (4.000 / 4.000) × 1.000 auto's  =  3.000 auto's ✓</text>
  </svg>`;
}

// Simpler formula worked example — replace the above with a cleaner single card
function svgFormulaClean() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Alternatieve kosten berekenen — Frankrijk als voorbeeld.", "REKENVOORBEELD")}

    <!-- Step 1: uren per product -->
    <rect x="80" y="160" width="320" height="200" rx="12" fill="${SC.sky}" stroke="${SC.indigo}" stroke-width="1.5"/>
    <text x="100" y="190" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">STAP 1</text>
    <text x="100" y="222" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.indigo}">Uren per product</text>
    <line x1="100" y1="238" x2="380" y2="238" stroke="${SC.cloud}"/>
    <text x="100" y="272" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">1 jet  →  4.000 uur</text>
    <text x="100" y="300" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">1.000 auto's  →  4.000 uur</text>
    <text x="100" y="342" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">(totaal 12.000 uur beschikbaar)</text>

    <!-- Step 2: formule -->
    <rect x="420" y="160" width="400" height="200" rx="12" fill="${SC.paperMid}" stroke="${SC.ash}" stroke-width="1.5"/>
    <text x="440" y="190" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="2">STAP 2</text>
    <text x="440" y="222" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.indigo}">Invullen in de formule</text>
    <line x1="440" y1="238" x2="800" y2="238" stroke="${SC.cloud}"/>
    <text x="440" y="278" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.ink}">alt. kosten 1 jet =</text>
    <text x="440" y="312" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.ink}">(4.000 / 4.000) × 1.000</text>
    <text x="440" y="342" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">breuk × eenheid van het andere product</text>

    <!-- Step 3: uitkomst -->
    <rect x="840" y="160" width="360" height="200" rx="12" fill="${SC.coralDeep}"/>
    <text x="860" y="190" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="2">STAP 3  ·  UITKOMST</text>
    <text x="860" y="222" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="#ffffff">Alternatieve kosten</text>
    <line x1="860" y1="238" x2="1180" y2="238" stroke="#ffffff" stroke-width="0.8" opacity="0.35"/>
    <text x="1020" y="300" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="44" font-weight="700" fill="#ffffff" letter-spacing="-1">3.000 auto's</text>
    <text x="1020" y="330" text-anchor="middle" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.amber}">per 1 jet</text>

    <!-- Check omgekeerd -->
    <rect x="80" y="400" width="1120" height="180" rx="12" fill="${SC.indigoDeep}"/>
    <text x="100" y="432" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="3">CONTROLE  ·  ANDERE RICHTING</text>
    <text x="100" y="468" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Alt. kosten 1 auto  =  (4.000 / 4.000) × (1/1.000) jet  =  1/3.000 jet</text>
    <text x="100" y="504" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.cloud}">De twee alternatieve kosten zijn elkaars omgekeerde:  1 jet = 3.000 auto's  ⇔  1 auto = 1/3.000 jet.</text>
    <text x="100" y="540" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.cloud}">Voor Zweden doe je hetzelfde met 2.000 en 2.000 uur → 1 jet = 5.000 auto's.</text>
  </svg>`;
}

// Specialisation for/against — scales
function svgVoorTegen() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Waarom landen soms toch niet volledig specialiseren.", "SPECIALISATIE  ·  VOOR EN TEGEN")}

    <!-- LEFT: voordelen -->
    <rect x="80" y="160" width="560" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.goodInk}" stroke-width="2"/>
    <rect x="80" y="160" width="560" height="54" fill="${SC.goodInk}" rx="14"/>
    <rect x="80" y="200" width="560" height="14" fill="${SC.goodInk}"/>
    <text x="360" y="196" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Voordelen van specialisatie</text>

    ${[
      { t: "Lagere productiekosten per eenheid", s: "schaalvoordelen in de specialisatiesector" },
      { t: "Meer totale productie", s: "dezelfde uren → meer output wereldwijd" },
      { t: "Lagere consumentenprijzen", s: "efficiëntere productie komt in de prijs terug" },
      { t: "Toegang tot bredere variatie", s: "je consumeert buiten je eigen PPC" },
    ].map((v, i) => `
      <circle cx="120" cy="${260 + i * 70}" r="16" fill="${SC.goodBg}" stroke="${SC.goodInk}" stroke-width="2"/>
      <path d="M112 ${260 + i * 70} l6 6 l12 -12" fill="none" stroke="${SC.goodInk}" stroke-width="2.5" stroke-linecap="round"/>
      <text x="150" y="${256 + i * 70}" font-family="${FONT_SANS}" font-size="15" font-weight="700" fill="${SC.indigo}">${v.t}</text>
      <text x="150" y="${278 + i * 70}" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">${v.s}</text>
    `).join("")}

    <!-- RIGHT: nadelen -->
    <rect x="680" y="160" width="520" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.coralDeep}" stroke-width="2"/>
    <rect x="680" y="160" width="520" height="54" fill="${SC.coralDeep}" rx="14"/>
    <rect x="680" y="200" width="520" height="14" fill="${SC.coralDeep}"/>
    <text x="940" y="196" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Nadelen van specialisatie</text>

    ${[
      { t: "Strategische goederen", s: "voedsel, wapens, medicijnen — zelf maken" },
      { t: "Werkgelegenheid in oude sector", s: "banen verdwijnen bij herstructurering" },
      { t: "Afhankelijkheid van partnerlanden", s: "oorlog, sancties, pandemieën kunnen leveringen breken" },
      { t: "Monocultuur-risico", s: "één sector wegvallen treft de hele economie" },
    ].map((v, i) => `
      <circle cx="720" cy="${260 + i * 70}" r="16" fill="${SC.badBg}" stroke="${SC.coralDeep}" stroke-width="2"/>
      <path d="M714 ${254 + i * 70} l12 12 M726 ${254 + i * 70} l-12 12" fill="none" stroke="${SC.coralDeep}" stroke-width="2.5" stroke-linecap="round"/>
      <text x="750" y="${256 + i * 70}" font-family="${FONT_SANS}" font-size="15" font-weight="700" fill="${SC.indigo}">${v.t}</text>
      <text x="750" y="${278 + i * 70}" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">${v.s}</text>
    `).join("")}
  </svg>`;
}

// Ruilverhouding — number line
function svgRuilverhouding() {
  const w = 1280, h = 640;
  const x0 = 160, x1 = 1120;
  const yLine = 340;

  // Domain: 0 to 6.000 autos per jet
  const mapX = v => x0 + (v / 6000) * (x1 - x0);
  const fr = 3000, zw = 5000;
  const xFr = mapX(fr), xZw = mapX(zw);
  const xEx = mapX(4000);

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("De ruilverhouding moet TUSSEN de alternatieve kosten van beide landen liggen.", "WANNEER WINNEN BEIDE LANDEN?")}

    <!-- number line -->
    <line x1="${x0}" y1="${yLine}" x2="${x1}" y2="${yLine}" stroke="${SC.ink}" stroke-width="2"/>
    ${Array.from({length: 7}, (_, i) => {
      const v = i * 1000;
      const x = mapX(v);
      return `
        <line x1="${x}" y1="${yLine - 6}" x2="${x}" y2="${yLine + 6}" stroke="${SC.ink}" stroke-width="1.5"/>
        <text x="${x}" y="${yLine + 28}" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" fill="${SC.smoke}">${v.toLocaleString("nl-NL")}</text>
      `;
    }).join("")}
    <text x="${(x0 + x1)/2}" y="${yLine + 56}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.ash}" letter-spacing="2">AUTO'S PER 1 JET</text>

    <!-- Valid zone bar -->
    <rect x="${xFr}" y="${yLine - 18}" width="${xZw - xFr}" height="36" fill="${SC.goodBg}" stroke="${SC.goodInk}" stroke-width="2"/>
    <text x="${(xFr + xZw)/2}" y="${yLine + 5}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.goodInk}" letter-spacing="2">GELDIGE RUILVERHOUDING</text>

    <!-- FR marker -->
    <circle cx="${xFr}" cy="${yLine}" r="10" fill="${SC.coralDeep}"/>
    <circle cx="${xFr}" cy="${yLine}" r="18" fill="none" stroke="${SC.coralDeep}" stroke-width="2" opacity="0.4"/>
    <line x1="${xFr}" y1="${yLine - 26}" x2="${xFr}" y2="${yLine - 90}" stroke="${SC.coralDeep}" stroke-width="1.5"/>
    <rect x="${xFr - 120}" y="${yLine - 160}" width="240" height="70" rx="8" fill="${SC.coralDeep}"/>
    <text x="${xFr}" y="${yLine - 138}" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="2">FRANKRIJK</text>
    <text x="${xFr}" y="${yLine - 112}" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="#ffffff">alt. kosten: 3.000</text>

    <!-- ZW marker -->
    <circle cx="${xZw}" cy="${yLine}" r="10" fill="${SC.tealDeep}"/>
    <circle cx="${xZw}" cy="${yLine}" r="18" fill="none" stroke="${SC.tealDeep}" stroke-width="2" opacity="0.4"/>
    <line x1="${xZw}" y1="${yLine - 26}" x2="${xZw}" y2="${yLine - 90}" stroke="${SC.tealDeep}" stroke-width="1.5"/>
    <rect x="${xZw - 120}" y="${yLine - 160}" width="240" height="70" rx="8" fill="${SC.tealDeep}"/>
    <text x="${xZw}" y="${yLine - 138}" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="2">ZWEDEN</text>
    <text x="${xZw}" y="${yLine - 112}" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="#ffffff">alt. kosten: 5.000</text>

    <!-- Example marker -->
    <polygon points="${xEx},${yLine + 50} ${xEx - 10},${yLine + 70} ${xEx + 10},${yLine + 70}" fill="${SC.amberDeep}"/>
    <rect x="${xEx - 90}" y="${yLine + 78}" width="180" height="56" rx="8" fill="${SC.amberDeep}"/>
    <text x="${xEx}" y="${yLine + 100}" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="2">VOORBEELD</text>
    <text x="${xEx}" y="${yLine + 122}" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="16" font-weight="700" fill="#ffffff">4.000 auto's / jet</text>

    <!-- Bottom insight -->
    <rect x="80" y="520" width="1120" height="72" rx="10" fill="${SC.indigoDeep}"/>
    <text x="100" y="548" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.amber}" letter-spacing="3">REGEL</text>
    <text x="100" y="576" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="#ffffff">Buiten de groene zone heeft minstens één land géén reden om te handelen — dan blijft de markt gewoon in autarkie.</text>
  </svg>`;
}

// Arbeidsbesparing cards — three big numbers
function svgArbeidsbesparing() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Specialisatie verkort de totale werktijd — bij gelijke consumptie.", "ARBEIDSBESPARING  ·  REKENVOORBEELD")}

    <!-- Scenario description bar -->
    <rect x="80" y="160" width="1120" height="60" rx="8" fill="${SC.paperMid}"/>
    <text x="100" y="186" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="3">GEWENSTE CONSUMPTIE</text>
    <text x="100" y="210" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="${SC.ink}">Beide landen willen hun oorspronkelijke consumptie halen — maar nu via ruil in plaats van autarkie.</text>

    <!-- Three cards -->
    ${[
      { x: 80, label: "FRANKRIJK", sub: "voorheen 60.000 uur · nu 56.000 uur", big: "4.000 uur", caption: "bespaard", color: SC.coralDeep, accent: SC.amber },
      { x: 480, label: "ZWEDEN", sub: "voorheen 34.000 uur · nu 32.000 uur", big: "2.000 uur", caption: "bespaard", color: SC.tealDeep, accent: SC.amber },
      { x: 880, label: "TOTAAL", sub: "de wereld als geheel", big: "6.000 uur", caption: "bespaard", color: SC.indigoDeep, accent: SC.coral },
    ].map(c => `
      <rect x="${c.x}" y="240" width="320" height="320" rx="14" fill="${c.color}"/>
      <text x="${c.x + 160}" y="290" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${c.accent}" letter-spacing="3">${c.label}</text>
      <text x="${c.x + 160}" y="400" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="64" font-weight="700" fill="#ffffff" letter-spacing="-2">${c.big}</text>
      <text x="${c.x + 160}" y="440" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="${c.accent}">${c.caption}</text>
      <line x1="${c.x + 60}" y1="470" x2="${c.x + 260}" y2="470" stroke="${c.accent}" stroke-width="1" opacity="0.6"/>
      <text x="${c.x + 160}" y="502" text-anchor="middle" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.cloud}">${c.sub}</text>
    `).join("")}

    <!-- Formula reminder -->
    <text x="640" y="600" text-anchor="middle" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.smoke}">besparing = uren autarkie − uren specialisatie</text>
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
      x: 0.6, y: 3.85, w: 8.8, h: 0.6,
      ...T.subheadDark, fontFace: FONT_SERIF, italic: true,
    });
  }
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
  pres.title = "3.4.2 Inter-industriele handel";

  defineMasters(pres, {
    darkLabel: "PARAGRAAF  ·  §3.4",
    lightLabel: "§ 3.4  ·  INTERNATIONALE MARKTEN",
  });

  const svgs = {
    trade:       svgTradeScene(),
    interIntra:  svgInterVsIntra(),
    ppc:         svgPPCCompare(),
    matrix:      svgCompAdvMatrix(),
    absVsComp:   svgAbsVsComp(),
    gains:       svgGainsFromTrade(),
    formula:     svgFormulaClean(),
    voortegen:   svgVoorTegen(),
    ruil:        svgRuilverhouding(),
    besparing:   svgArbeidsbesparing(),
  };
  const imgs = {};
  for (const [k, v] of Object.entries(svgs)) imgs[k] = await svgData(v, 1440);

  // ────────────────────────────────────────────────────────────────────
  // DIA 1 — Cinematic opener
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addImage({ data: imgs.trade, x: 0, y: 2.4, w: 10, h: 3.28 });

    s.addText("§ 3.4.2", {
      x: 0.6, y: 0.5, w: 4, h: 0.4,
      ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6,
    });
    s.addText("Inter-industriële handel", {
      x: 0.6, y: 0.95, w: 8.8, h: 1.3,
      ...T.heroDark, fontSize: 54, charSpacing: -2,
    });
    s.addText("Hoofdstuk 4 · Internationale markten  ·  Praktische Economie VWO", {
      x: 0.6, y: 2.3, w: 8.8, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.cloud,
    });
    s.addNotes("Welkom. Nederland haalt koffie uit Indonesië, exporteert machines naar Duitsland. Waarom? Omdat landen verschillen. In deze les: de klassieke theorie van David Ricardo — handel tussen sectoren.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 2 — Pull quote
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("\u201C", {
      x: 0.6, y: 0.7, w: 2, h: 2,
      fontFace: FONT_SERIF, fontSize: 220, bold: true, color: PC.coral, charSpacing: -5,
    });
    s.addText("Waarom ruilt een\nrijker land überhaupt?", {
      x: 1.8, y: 1.4, w: 8, h: 2.6,
      fontFace: FONT_DISPLAY, fontSize: 48, bold: true, color: PC.chalk, charSpacing: -2, lineSpacingMultiple: 1.05,
    });
    s.addText("De puzzel van Ricardo — 1817.", {
      x: 1.8, y: 4.3, w: 8, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.amber,
    });
    s.addNotes("Een rijker, productiever land kán alles zelf maken. Waarom dan handelen? Ricardo's antwoord: het gaat niet om wie iets het snelst maakt, maar wie iets het goedkoopst maakt in alternatieve kosten.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 3 — Leerdoelen (sidebar)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = sidebarSlide(pres, {
      sidebarKicker: "Wat ga je leren",
      sidebarTitle: "Zes vaardigheden voor één uur",
      sidebarBody: "Na deze paragraaf kun je de theorie van comparatief voordeel uitleggen en toepassen.",
    });
    const doelen = [
      { n: "01", t: "Inter-industriële handel begrijpen en herkennen" },
      { n: "02", t: "Comparatief voordeel bepalen (2 landen × 2 producten)" },
      { n: "03", t: "Alternatieve kosten berekenen met de formule" },
      { n: "04", t: "Geldige ruilverhouding vinden TUSSEN de alt. kosten" },
      { n: "05", t: "Arbeidsbesparing door specialisatie berekenen" },
      { n: "06", t: "Redenen vóór en tégen specialisatie benoemen" },
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
    s.addNotes("Zes leerdoelen. Elk komt terug in een oefening. Leerdoel 2-4 is de rekenkern; 5 is de uitkomst; 6 is nuance.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 4 — Section: WAT IS INTER-INDUSTRIELE HANDEL
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 1",
    title: "Wat is deze handel?",
    subtitle: "Verschillende landen, verschillende sectoren — machines tegen koffie.",
    notes: "We starten met het onderscheid tussen inter- (verschillende sectoren) en intra-industriële handel (dezelfde sector). Deze paragraaf gaat alleen over inter.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 5 — Inter vs intra graphic
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.interIntra, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Rechts zie je intra-industriële handel (zelfde sector, productdifferentiatie) — dat komt in §3.4.3 terug. In deze paragraaf: links, inter-industriële handel.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 6 — Definition split
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Begrip · inter-industriële handel",
      title: "Handel tussen sectoren: ik maak iets, jij maakt iets anders, we ruilen.",
      notes: "Vraag de klas om NL-voorbeelden: wat exporteert Nederland vooral? (landbouwproducten, chemie, machines). Wat importeert het? (olie, kleding, tropische landbouw).",
    });

    // LEFT: definition
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.2, h: 3.1, fill: { color: PC.sky }, line: { color: PC.cloud, width: 0.75 } });
    s.addText("DEFINITIE", {
      x: 0.7, y: 2.15, w: 3.8, h: 0.3,
      ...T.labelUpper, color: PC.indigo, fontSize: 11, charSpacing: 3,
    });
    s.addText([
      { text: "Inter-industriële handel", options: { bold: true, color: PC.indigo } },
      { text: " is handel waarbij landen ", options: {} },
      { text: "verschillende", options: { bold: true } },
      { text: " soorten producten uitwisselen — elk land specialiseert in een andere sector.", options: {} },
    ], {
      x: 0.7, y: 2.5, w: 3.8, h: 2.2,
      fontFace: FONT_SERIF, fontSize: 17, color: PC.ink, italic: true, lineSpacingMultiple: 1.3,
    });

    // RIGHT: examples
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.indigo } });
    s.addText("NEDERLAND EXPORTEERT / IMPORTEERT", {
      x: 5.3, y: 2.15, w: 4, h: 0.3,
      ...T.labelUpper, color: PC.amber, fontSize: 11, charSpacing: 3,
    });
    s.addText([
      { text: "uit → ", options: { color: PC.cloud, fontSize: 14 } },
      { text: "machines, bloemen, kaas, chips", options: { bold: true, color: PC.chalk, fontSize: 16, breakLine: true } },
      { text: "in ← ", options: { color: PC.cloud, fontSize: 14 } },
      { text: "koffie, olie, kleding, bananen", options: { bold: true, color: PC.chalk, fontSize: 16, breakLine: true } },
      { text: "\n", options: {} },
      { text: "Die stromen zijn niet toevallig — ze volgen het patroon van comparatief voordeel.", options: { italic: true, color: PC.amber, fontSize: 14, fontFace: FONT_SERIF } },
    ], {
      x: 5.3, y: 2.55, w: 4, h: 2.5,
      lineSpacingMultiple: 1.5,
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 7 — Section: PPC & ALTERNATIEVE KOSTEN
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 2",
    title: "Wat kost je eigenlijk wat?",
    subtitle: "De PPC laat zien: elk extra jet kost X auto's — dat zijn de alternatieve kosten.",
    notes: "De centrale rekensleutel. We gebruiken het boekvoorbeeld: Frankrijk 12.000 uur, Zweden 10.000 uur. Producten: straaljagers (jets) en auto's.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 8 — PPC graph (both countries)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.ppc, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Twee PPC's met verschillende hellingen. Frankrijk: -3 jets / 9.000 auto's, helling (-1/3.000). Zweden: -2 jets / 10.000 auto's, helling (-1/5.000). Hoe steiler de PPC, hoe hoger de alternatieve kosten van auto's in jets — en omgekeerd.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 9 — Formule + rekenvoorbeeld
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.formula, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Drie stappen. Stap 1: verzamel uren per product. Stap 2: vul in in de breuk × eenheid. Stap 3: uitkomst. Belangrijk: 1 auto en 1 jet zijn elkaars omgekeerde alternatieve kosten.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 10 — Section: COMPARATIEF VOORDEEL
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 3",
    title: "Wie doet wat?",
    subtitle: "Vergelijk de alternatieve kosten per product — de laagste wint.",
    notes: "Nu de sleutelvraag: wie specialiseert zich in jets, wie in auto's? Niet wie het snelst is, maar wie het minst opgeeft.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 11 — Comparative advantage matrix
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.matrix, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Per KOLOM (product) zoeken we het laagste getal. Jets: 3.000 < 5.000 → Frankrijk. Auto's: 1/5.000 < 1/3.000 → Zweden. Elk land specialiseert in precies één product. Geen land specialiseert in beide.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 12 — Absoluut vs comparatief
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.absVsComp, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("De klassieke verwarring. Absoluut: wie maakt met minder uren? Comparatief: wie geeft het minst op? In het voorbeeld heeft Zweden ABSOLUUT voordeel bij jets (2.000 uur < 4.000 uur), maar FRANKRIJK heeft COMPARATIEF voordeel bij jets. Dat klinkt paradoxaal — en dat IS het ook. Maar het werkt.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 13 — Hero stat: 6.000 uur
  // ────────────────────────────────────────────────────────────────────
  heroStat(pres, {
    kicker: "BESPARING DOOR SPECIALISATIE",
    stat: "6.000 uur",
    subtitle: "die beide landen samen besparen — bij dezelfde consumptie",
    body: "\u201C… zonder extra grondstoffen, machines of mensen. Alleen door slim te ruilen.\u201D",
    notes: "Dit is het 'wauw'-moment. Zonder iets extra's te doen — geen nieuwe fabrieken, geen extra arbeiders — produceert de wereld meer met dezelfde input. Dat is het wonder van specialisatie.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 14 — Section: RUILVERHOUDING
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 4",
    title: "Tegen welke prijs ruilen?",
    subtitle: "De ruilverhouding moet TUSSEN de alternatieve kosten van beide landen liggen.",
    notes: "Specialisatie zonder handel werkt niet. Dus: tegen welke prijs gaan jets tegen auto's? Dat mag niet lager dan Frankrijk opgeeft (3.000) en niet hoger dan Zweden opgeeft (5.000).",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 15 — Ruilverhouding number line
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.ruil, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("De groene zone is de onderhandelingsruimte. Onder 3.000: Frankrijk geeft meer op dan autarkie — doet niet mee. Boven 5.000: Zweden geeft meer auto's dan autarkie vereist — doet niet mee. Bij exact 3.000 of 5.000: één land haalt geen winst. TUSSEN: beide winnen.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 16 — Gains from trade table
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.gains, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Bij ruilverhouding 4.000 auto's per jet: Frankrijk ruilt 2 jets met Zweden en krijgt 8.000 auto's — meer dan de 6.000 die het met die uren zelf had kunnen maken. Zweden krijgt 2 jets voor 8.000 auto's (4.000 per jet) — minder dan de 10.000 auto's die 2 jets in eigen land zouden kosten. Beide consumeren buiten hun PPC.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 17 — Section: ARBEIDSBESPARING
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 5",
    title: "Minder uren, zelfde spullen",
    subtitle: "Specialisatie in uren uitgedrukt: hoe groot is de 'wereldbesparing'?",
    notes: "Zelfde consumptie-pakket, maar via handel hebben beide landen minder uren nodig. Die arbeidsbesparing is de economische 'winst' van specialisatie.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 18 — Arbeidsbesparing cards
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.besparing, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Formule: besparing = uren autarkie − uren specialisatie. Frankrijk: 4.000 uur uitgespaard. Zweden: 2.000 uur. Wereldwijd: 6.000 uur besparing — oftewel het equivalent van 3 extra werknemersjaren bij 2.000 uur per jaar.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 19 — Section: VOOR & TEGEN
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 6",
    title: "Voor én tegen",
    subtitle: "Omdat efficiëntie niet het enige belang is — strategie, werk en afhankelijkheid tellen mee.",
    notes: "De nuance-dia. Specialisatie levert economisch voordeel, maar landen wegen ook strategische, sociale en geopolitieke factoren mee.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 20 — Voor en tegen graphic
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.voortegen, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Linker kolom: economisch voordeel. Rechter kolom: waarom landen toch niet volledig specialiseren. Voorbeelden: NL blijft tarwe telen ondanks duurder (voedselzekerheid); FR maakt straaljagers zelf (defensie); Taiwan-chips laten zien hoe kwetsbaar extreme specialisatie is.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 21 — Valkuilen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Denkfouten",
      title: "Drie valkuilen die bij de toets altijd terugkomen.",
      notes: "Bespreek elk met een voorbeeld. Dit zijn de klassieke fouten — ken ze, dan struikel je niet meer.",
    });
    const items = [
      { num: "01", claim: "Absoluut voordeel = comparatief voordeel",
        truth: "Een land kan in alles langzamer zijn én toch comparatief voordeel hebben — kijk naar alternatieve kosten, niet naar totale uren." },
      { num: "02", claim: "Ruilverhouding = alternatieve kosten",
        truth: "De ruilverhouding ligt TUSSEN de alternatieve kosten van beide landen. Precies op de grens: één land heeft geen voordeel meer." },
      { num: "03", claim: "Specialisatie is altijd beter",
        truth: "Strategische goederen, werkgelegenheid en afhankelijkheid zijn goede redenen om niet volledig te specialiseren." },
    ];
    items.forEach((it, i) => {
      const y = 2.05 + i * 1.02;
      s.addShape("rect", { x: 0.5, y, w: 9, h: 0.95,
        fill: { color: PC.chalk }, line: { color: PC.coral, width: 1 } });
      s.addShape("rect", { x: 0.5, y, w: 0.08, h: 0.95, fill: { color: PC.coral } });
      s.addText(it.num, {
        x: 0.75, y: y + 0.15, w: 0.9, h: 0.6,
        fontFace: FONT_DISPLAY, fontSize: 26, bold: true, color: PC.coral, charSpacing: -0.5,
      });
      s.addText([
        { text: "\u201C" + it.claim + "\u201D", options: { fontFace: FONT_SERIF, fontSize: 14, italic: true, color: PC.coralDeep, bold: true, breakLine: true } },
        { text: it.truth, options: { fontFace: FONT_SANS, fontSize: 12, color: PC.ink } },
      ], {
        x: 1.75, y: y + 0.1, w: 7.7, h: 0.8,
        lineSpacingMultiple: 1.3, valign: "top",
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 22 — Closing: samenvatting (dark hero)
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
      { n: "01", t: "Inter-industrieel = verschillende sectoren ruilen (machines ↔ koffie)" },
      { n: "02", t: "Comparatief voordeel = lagere alternatieve kosten (niet: absoluut sneller)" },
      { n: "03", t: "Alt. kosten 1 A = (uren A / uren B) × eenheid B" },
      { n: "04", t: "Geldige ruilverhouding ligt TUSSEN de alt. kosten" },
      { n: "05", t: "Arbeidsbesparing = uren autarkie − uren specialisatie" },
      { n: "06", t: "Tegen: strategische goederen, werk, afhankelijkheid" },
    ];
    items.forEach((it, i) => {
      const y = 1.85 + i * 0.52;
      s.addText(it.n, {
        x: 0.6, y, w: 0.6, h: 0.5,
        fontFace: FONT_DISPLAY, fontSize: 22, bold: true, color: PC.coral, charSpacing: -1,
      });
      s.addText(it.t, {
        x: 1.2, y: y + 0.05, w: 8.3, h: 0.45,
        fontFace: FONT_SANS, fontSize: 15, color: PC.chalk, valign: "middle",
      });
      if (i < items.length - 1) {
        s.addShape("rect", { x: 0.6, y: y + 0.48, w: 8.8, h: 0.005, fill: { color: PC.indigoSoft } });
      }
    });
    s.addNotes("Retrieval-oefening: laat leerlingen de 6 punten aan elkaar uitleggen zonder dia. Wie struikelt, pakt het bijbehorende deel van de les er weer bij.");
  }

  // ────────────────────────────────────────────────────────────────────
  // OUTPUT
  // ────────────────────────────────────────────────────────────────────
  const outDir = path.resolve(__dirname, "../../../output/3.4.2");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const svgDir = path.join(outDir, "svg");
  if (!fs.existsSync(svgDir)) fs.mkdirSync(svgDir, { recursive: true });
  for (const [k, v] of Object.entries(svgs)) {
    fs.writeFileSync(path.join(svgDir, `342-${k}.svg`), v, "utf8");
  }

  const outPath = path.join(outDir, "3.4.2 Inter-industriele handel – presentatie.pptx");
  await pres.writeFile({ fileName: outPath });
  const fix = await fixPptxFile(outPath);
  roundtripWithLibreOffice(outPath);
  console.log(`PPTX written to ${outPath} (fix: -${fix.removedOverrides} phantom overrides, -${fix.removedEmptyDirs} empty dirs; roundtripped via LibreOffice)`);
}

build().catch(err => { console.error(err); process.exit(1); });
