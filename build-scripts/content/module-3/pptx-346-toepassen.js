/**
 * pptx-346-toepassen.js — §3.4.6 Toepassen (Internationale markten)
 * Integratieparagraaf: vijf vaardigheden uit §3.4.1–§3.4.5 toegepast op
 * concrete casussen (Brexit, exportwaarde, Philips, VS-handelstekort,
 * globalisering en arbeidsmarkt).
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
// SVGs
// ═══════════════════════════════════════════════════════════════════════════

// Editorial card grid — de vijf vaardigheden
function svgVijfVaardigheden() {
  const cards = [
    { title: "1. Handels&#173;politiek",     sub: "keten beschrijven",              ex: "Brexit → Rotterdam",           ic: ICON.warning(SC.coralDeep),          col: SC.coralDeep, lt: SC.badBg },
    { title: "2. Export&#173;waarde",        sub: "prijs × volume",                  ex: "waarde \u2212 8%, volume \u2212 10%", ic: ICON.coin(SC.amberDeep),             col: SC.amberDeep, lt: SC.warnBg },
    { title: "3. Inter / intra",              sub: "handelsvorm herkennen",           ex: "Philips ruilt scanners",       ic: ICON.arrowRight(SC.indigo),          col: SC.indigo,    lt: SC.sky   },
    { title: "4. Handels&#173;balans",        sub: "geldstromen",                     ex: "VS: import > export",          ic: ICON.scale(SC.oliveDeep),            col: SC.oliveDeep, lt: SC.goodBg },
    { title: "5. Globali&#173;sering",        sub: "arbeidsmarkt",                    ex: "hoog vs laag opgeleid",        ic: ICON.person(SC.plum),                col: SC.plum,      lt: "#F3E8F9" },
  ];
  const W = 1280, H = 640;
  const cardW = 220, gap = 18;
  const totalW = cards.length * cardW + (cards.length - 1) * gap;
  const xStart = (W - totalW) / 2;
  return `${svgHeader(W, H, SC.paper)}
    ${editorialTitle("Vijf vaardigheden \u2014 elk op een eigen casus", "INTEGRATIE")}

    ${cards.map((c, i) => {
      const x = xStart + i * (cardW + gap);
      return `
      <rect x="${x}" y="150" width="${cardW}" height="420" rx="12" fill="${SC.chalk}" stroke="${c.col}" stroke-width="1.5"/>
      <rect x="${x}" y="150" width="${cardW}" height="56" fill="${c.col}" rx="12"/>
      <rect x="${x}" y="194" width="${cardW}" height="12" fill="${c.col}"/>
      <text x="${x + cardW/2}" y="184" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="#ffffff">${c.title}</text>

      <rect x="${x}" y="220" width="${cardW}" height="100" fill="${c.lt}"/>
      ${placeIcon(c.ic, x + cardW/2 - 34, 238, 68)}

      <text x="${x + 16}" y="345" font-family="${FONT_SANS}" font-size="10" font-weight="700" fill="${SC.ash}" letter-spacing="2">KERN</text>
      <text x="${x + 16}" y="368" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.ink}">${c.sub}</text>

      <rect x="${x + 16}" y="400" width="${cardW - 32}" height="2" fill="${c.col}"/>
      <text x="${x + 16}" y="425" font-family="${FONT_SANS}" font-size="10" font-weight="700" fill="${SC.ash}" letter-spacing="2">CASUS</text>
      <text x="${x + 16}" y="450" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${c.col}">${c.ex}</text>

      <rect x="${x + 16}" y="500" width="40" height="24" rx="4" fill="${c.col}"/>
      <text x="${x + 36}" y="517" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff">0${i+1}</text>
      `;
    }).join("")}

    <text x="640" y="615" text-anchor="middle" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.smoke}">Alle vijf vaardigheden kunnen in één examenvraag over internationale markten voorkomen.</text>
  </svg>`;
}

// Brexit causal chain — horizontal flow
function svgBrexitKeten() {
  const W = 1280, H = 640;
  const stages = [
    { n: "01", t: "Maatregel",       body: "VK verlaat EU",              col: SC.indigoDeep, lt: SC.sky },
    { n: "02", t: "Direct effect",   body: "Geen vrij verkeer\nvan goederen",  col: SC.indigo,     lt: SC.sky },
    { n: "03", t: "Effect op handel",body: "Handel EU \u2013 VK\ndaalt",        col: SC.amberDeep,  lt: SC.warnBg },
    { n: "04", t: "Sectoraal gevolg",body: "Minder overslag\nhaven Rotterdam",  col: SC.coralDeep,  lt: SC.badBg },
  ];
  const boxW = 248, boxH = 220;
  const gap = 36;
  const totalW = stages.length * boxW + (stages.length - 1) * gap;
  const xStart = (W - totalW) / 2;
  const y = 210;
  return `${svgHeader(W, H, SC.paper)}
    ${editorialTitle("Brexit: beschrijf de keten maatregel \u2192 handel \u2192 sector", "VAARDIGHEID 01")}

    ${stages.map((s, i) => {
      const x = xStart + i * (boxW + gap);
      const lines = s.body.split("\n");
      return `
      <rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="14" fill="${SC.chalk}" stroke="${s.col}" stroke-width="2"/>
      <rect x="${x}" y="${y}" width="${boxW}" height="44" fill="${s.col}" rx="14"/>
      <rect x="${x}" y="${y + 32}" width="${boxW}" height="12" fill="${s.col}"/>
      <text x="${x + 20}" y="${y + 28}" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${s.col === SC.indigoDeep ? SC.amber : '#ffffff'}">${s.n}</text>
      <text x="${x + boxW - 20}" y="${y + 28}" text-anchor="end" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="2">${s.t.toUpperCase()}</text>

      <rect x="${x}" y="${y + 44}" width="${boxW}" height="8" fill="${s.lt}"/>

      ${lines.map((l, j) =>
        `<text x="${x + boxW/2}" y="${y + 110 + j * 28}" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="${SC.ink}">${l}</text>`
      ).join("")}
      `;
    }).join("")}

    ${stages.slice(0, -1).map((_, i) => {
      const x1 = xStart + (i + 1) * boxW + i * gap + 2;
      const x2 = x1 + gap - 6;
      const yy = y + boxH / 2;
      return `<line x1="${x1}" y1="${yy}" x2="${x2}" y2="${yy}" stroke="${SC.coralDeep}" stroke-width="3" marker-end="url(#ah-coral)"/>`;
    }).join("")}

    <!-- Footer: template -->
    <rect x="80" y="490" width="1120" height="80" rx="10" fill="${SC.paperMid}"/>
    <text x="110" y="520" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.coral}" letter-spacing="3">TEMPLATE VOOR DE TOETS</text>
    <text x="110" y="552" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.indigo}">Maatregel \u2192 direct effect \u2192 effect op handelsstroom \u2192 specifiek sectoraal gevolg</text>
  </svg>`;
}

// Exportwaarde decomposition — decision tree / calculation
function svgExportwaarde() {
  const W = 1280, H = 640;
  // Left: formula + decomposition of waarde change. Right: decision tree for werkgelegenheid
  return `${svgHeader(W, H, SC.paper)}
    ${editorialTitle("Exportwaarde ontleden \u2014 wat daalt er nou eigenlijk?", "VAARDIGHEID 02")}

    <!-- LEFT: formula card -->
    <g transform="translate(60,150)">
      <rect x="0" y="0" width="540" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.amberDeep}" stroke-width="1.5"/>
      <rect x="0" y="0" width="540" height="48" fill="${SC.amberDeep}" rx="14"/>
      <rect x="0" y="36" width="540" height="12" fill="${SC.amberDeep}"/>
      <text x="270" y="32" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="#ffffff" letter-spacing="3">FORMULE &amp; CASUS</text>

      <!-- Formula -->
      <text x="270" y="110" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="30" font-weight="700" fill="${SC.indigo}">Exportwaarde = prijs \u00D7 volume</text>

      <!-- Casus numbers -->
      <rect x="30" y="140" width="480" height="2" fill="${SC.cloud}"/>
      <text x="30" y="172" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="3">CASUS</text>

      <g>
        <rect x="30" y="190" width="220" height="80" rx="8" fill="${SC.badBg}"/>
        <text x="140" y="215" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.coralDeep}" letter-spacing="2">EXPORTWAARDE</text>
        <text x="140" y="252" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="32" font-weight="700" fill="${SC.coralDeep}">\u2212 8 %</text>
      </g>
      <g>
        <rect x="290" y="190" width="220" height="80" rx="8" fill="${SC.badBg}"/>
        <text x="400" y="215" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.coralDeep}" letter-spacing="2">VOLUME</text>
        <text x="400" y="252" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="32" font-weight="700" fill="${SC.coralDeep}">\u2212 10 %</text>
      </g>

      <!-- Conclusion -->
      <rect x="30" y="290" width="480" height="110" rx="8" fill="${SC.goodBg}" stroke="${SC.oliveDeep}" stroke-width="1.5"/>
      <text x="50" y="318" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.oliveDeep}" letter-spacing="3">CONCLUSIE</text>
      <text x="50" y="348" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.oliveDeep}">Volume daalt sterker dan waarde.</text>
      <text x="50" y="378" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.ink}">Dus: prijzen per eenheid zijn gestegen.</text>
    </g>

    <!-- RIGHT: werkgelegenheid vs prijs decision -->
    <g transform="translate(660,150)">
      <rect x="0" y="0" width="560" height="420" rx="14" fill="${SC.chalk}" stroke="${SC.indigo}" stroke-width="1.5"/>
      <rect x="0" y="0" width="560" height="48" fill="${SC.indigo}" rx="14"/>
      <rect x="0" y="36" width="560" height="12" fill="${SC.indigo}"/>
      <text x="280" y="32" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="#ffffff" letter-spacing="3">WAT TELT VOOR WERK?</text>

      <!-- Branch A: price -->
      <g transform="translate(30,90)">
        <rect x="0" y="0" width="240" height="140" rx="10" fill="${SC.warnBg}" stroke="${SC.amberDeep}" stroke-width="1.5"/>
        <text x="120" y="30" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.amberDeep}" letter-spacing="3">PRIJS DAALT</text>
        <text x="120" y="65" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="17" font-weight="700" fill="${SC.ink}">Zelfde productie</text>
        <text x="120" y="90" text-anchor="middle" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.smoke}">alleen de omzet</text>
        <text x="120" y="108" text-anchor="middle" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.smoke}">daalt</text>
        <rect x="30" y="120" width="180" height="10" rx="5" fill="${SC.amberDeep}"/>
      </g>

      <!-- Branch B: volume -->
      <g transform="translate(290,90)">
        <rect x="0" y="0" width="240" height="140" rx="10" fill="${SC.badBg}" stroke="${SC.coralDeep}" stroke-width="1.5"/>
        <text x="120" y="30" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.coralDeep}" letter-spacing="3">VOLUME DAALT</text>
        <text x="120" y="65" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="17" font-weight="700" fill="${SC.ink}">Minder productie</text>
        <text x="120" y="90" text-anchor="middle" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.smoke}">minder arbeid nodig</text>
        <text x="120" y="108" text-anchor="middle" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.smoke}">banen onder druk</text>
        <rect x="30" y="120" width="180" height="10" rx="5" fill="${SC.coralDeep}"/>
      </g>

      <!-- Conclusion strip -->
      <rect x="30" y="260" width="500" height="130" rx="10" fill="${SC.indigoDeep}"/>
      <text x="50" y="290" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.amber}" letter-spacing="3">KERNINZICHT</text>
      <text x="50" y="325" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="#ffffff">Voor werkgelegenheid telt volume,</text>
      <text x="50" y="352" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="#ffffff">niet prijs.</text>
      <text x="50" y="378" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.cloud}">Een prijsdaling kost geen banen; een volumedaling wel.</text>
    </g>
  </svg>`;
}

// Inter vs intra decision flow with Philips example
function svgInterIntra() {
  const W = 1280, H = 640;
  return `${svgHeader(W, H, SC.paper)}
    ${editorialTitle("Inter- of intra-industrieel? \u00C9\u00E9n vraag beslist.", "VAARDIGHEID 03")}

    <!-- Central question -->
    <rect x="440" y="140" width="400" height="100" rx="12" fill="${SC.indigoDeep}"/>
    <text x="640" y="172" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="3">VRAAG</text>
    <text x="640" y="203" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="#ffffff">Ruilen landen VERSCHILLENDE</text>
    <text x="640" y="228" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="#ffffff">soorten producten?</text>

    <!-- Left branch: JA -> inter -->
    <g transform="translate(80,310)">
      <rect x="0" y="0" width="520" height="280" rx="12" fill="${SC.chalk}" stroke="${SC.oliveDeep}" stroke-width="2"/>
      <rect x="0" y="0" width="520" height="50" fill="${SC.oliveDeep}" rx="12"/>
      <rect x="0" y="38" width="520" height="12" fill="${SC.oliveDeep}"/>
      <text x="26" y="33" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="#ffffff" letter-spacing="3">JA \u2192 INTER-INDUSTRIEEL</text>

      <text x="26" y="92" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="2">VERKLARING</text>
      <text x="26" y="118" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.oliveDeep}">Comparatief voordeel</text>
      <text x="26" y="142" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.ink}">lage alternatieve kosten in iets</text>

      <rect x="26" y="170" width="468" height="2" fill="${SC.cloud}"/>
      <text x="26" y="196" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="2">VOORBEELD</text>
      <text x="26" y="228" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.ink}">NL exporteert bloemen,</text>
      <text x="26" y="254" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.ink}">importeert auto's uit Duitsland.</text>
    </g>

    <!-- Right branch: NEE -> intra -->
    <g transform="translate(680,310)">
      <rect x="0" y="0" width="520" height="280" rx="12" fill="${SC.chalk}" stroke="${SC.coralDeep}" stroke-width="2"/>
      <rect x="0" y="0" width="520" height="50" fill="${SC.coralDeep}" rx="12"/>
      <rect x="0" y="38" width="520" height="12" fill="${SC.coralDeep}"/>
      <text x="26" y="33" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="#ffffff" letter-spacing="3">NEE \u2192 INTRA-INDUSTRIEEL</text>

      <text x="26" y="92" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="2">VERKLARING</text>
      <text x="26" y="118" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.coralDeep}">Productdifferentiatie</text>
      <text x="26" y="142" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.ink}">variatie binnen dezelfde soort</text>

      <rect x="26" y="170" width="468" height="2" fill="${SC.cloud}"/>
      <text x="26" y="196" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="2">VOORBEELD</text>
      <text x="26" y="228" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.ink}">Philips exporteert scanners,</text>
      <text x="26" y="254" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.ink}">importeert ook medische apparaten.</text>
    </g>

    <!-- Connecting arrows -->
    <line x1="500" y1="240" x2="340" y2="305" stroke="${SC.oliveDeep}" stroke-width="2.5" marker-end="url(#ah-smoke)"/>
    <line x1="780" y1="240" x2="940" y2="305" stroke="${SC.coralDeep}" stroke-width="2.5" marker-end="url(#ah-coral)"/>

    <text x="390" y="283" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.oliveDeep}" letter-spacing="3">JA</text>
    <text x="890" y="283" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.coralDeep}" letter-spacing="3">NEE</text>
  </svg>`;
}

// Handelsbalans — geldstromen diagram
function svgHandelsbalans() {
  const W = 1280, H = 640;
  return `${svgHeader(W, H, SC.paper)}
    ${editorialTitle("Handelsbalans VS \u2014 geldstromen en schuld", "VAARDIGHEID 04")}

    <!-- Two country circles -->
    <g>
      <!-- VS -->
      <circle cx="350" cy="330" r="140" fill="${SC.badBg}" stroke="${SC.coralDeep}" stroke-width="3"/>
      <text x="350" y="300" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="44" font-weight="700" fill="${SC.coralDeep}" letter-spacing="-1">VS</text>
      <text x="350" y="340" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.ink}" letter-spacing="2">TEKORT</text>
      <rect x="260" y="360" width="180" height="2" fill="${SC.coralDeep}"/>
      <text x="350" y="388" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="${SC.coralDeep}">\u2212 $ 200 mld</text>
    </g>

    <g>
      <!-- Rest of World -->
      <circle cx="930" cy="330" r="140" fill="${SC.goodBg}" stroke="${SC.oliveDeep}" stroke-width="3"/>
      <text x="930" y="300" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="32" font-weight="700" fill="${SC.oliveDeep}" letter-spacing="-1">Rest wereld</text>
      <text x="930" y="340" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.ink}" letter-spacing="2">OVERSCHOT</text>
      <rect x="840" y="360" width="180" height="2" fill="${SC.oliveDeep}"/>
      <text x="930" y="388" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="${SC.oliveDeep}">+ $ 200 mld</text>
    </g>

    <!-- Import arrow (top) VS <- ROW -->
    <g>
      <path d="M 820 240 Q 640 160 460 240" fill="none" stroke="${SC.coralDeep}" stroke-width="4" marker-end="url(#ah-coral)"/>
      <rect x="540" y="160" width="200" height="44" rx="6" fill="${SC.coralDeep}"/>
      <text x="640" y="180" text-anchor="middle" font-family="${FONT_SANS}" font-size="10" font-weight="700" fill="#ffffff" letter-spacing="2">IMPORT \u2192 VS</text>
      <text x="640" y="198" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="16" font-weight="700" fill="#ffffff">$ 2.200 mld</text>
    </g>

    <!-- Export arrow (bottom) VS -> ROW -->
    <g>
      <path d="M 460 420 Q 640 500 820 420" fill="none" stroke="${SC.oliveDeep}" stroke-width="4" marker-end="url(#ah-smoke)"/>
      <rect x="540" y="458" width="200" height="44" rx="6" fill="${SC.oliveDeep}"/>
      <text x="640" y="478" text-anchor="middle" font-family="${FONT_SANS}" font-size="10" font-weight="700" fill="#ffffff" letter-spacing="2">EXPORT VS \u2192</text>
      <text x="640" y="496" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="16" font-weight="700" fill="#ffffff">$ 2.000 mld</text>
    </g>

    <!-- Bottom conclusion bar -->
    <rect x="80" y="540" width="1120" height="70" rx="10" fill="${SC.indigoDeep}"/>
    <text x="110" y="572" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.amber}" letter-spacing="3">GELDSTROOM</text>
    <text x="110" y="598" font-family="${FONT_DISPLAY}" font-size="17" font-weight="700" fill="#ffffff">Import > export \u2192 de VS leent per saldo $ 200 mld bij de rest van de wereld \u2192 schuld loopt op.</text>
  </svg>`;
}

// Globalisering arbeidsmarkt — twee vraag-aanbod diagrammen
function svgGlobaliseringArbeid() {
  const W = 1280, H = 640;

  // Left plot: hoogopgeleiden — V shifts right, A stays tight -> w up
  // Right plot: laagopgeleiden — V shifts left (offshoring), A stays -> w down
  const mkPlot = (xOff, title, titleCol, shiftDir, wChange) => {
    const px = xOff + 80, py = 160, pw = 440, ph = 330;
    const axisY = py + ph;
    const axisX = px;
    const isHoog = shiftDir === "right";

    // Supply line (near-vertical). Placed so it crosses horizontally around xAnchor.
    const xAnchor = px + pw * 0.45;
    const S_x1 = isHoog ? xAnchor - 10 : xAnchor - 50;
    const S_y1 = axisY - 10;
    const S_x2 = isHoog ? xAnchor + 10 : xAnchor + 50;
    const S_y2 = py + 20;

    // Helper: x on supply line at a given y (linear interpolation).
    const xOnSupply = (y) => S_x1 + (y - S_y1) * (S_x2 - S_x1) / (S_y2 - S_y1);

    // Old demand D1: downsloping straight line through the plot.
    const D1_x1 = px,           D1_y1 = py + 20;
    const D1_x2 = px + pw - 10, D1_y2 = axisY - 40;
    const slope = (D1_y2 - D1_y1) / (D1_x2 - D1_x1);

    // Old equilibrium = intersect(S, D1). Solve numerically.
    //   D1: y = D1_y1 + slope * (x - D1_x1)
    //   S:  x = S_x1 + (y - S_y1) * dxS/dyS
    const dxS = S_x2 - S_x1, dyS = S_y2 - S_y1;
    // Substitute: x = S_x1 + ((D1_y1 + slope*(x - D1_x1)) - S_y1) * dxS/dyS
    // Rearranged: x - S_x1 = (D1_y1 - S_y1 + slope*(x - D1_x1)) * dxS/dyS
    //             x - S_x1 - slope*dxS/dyS * x = (D1_y1 - S_y1 - slope*D1_x1) * dxS/dyS
    //             x * (1 - slope*dxS/dyS) = S_x1 + (D1_y1 - S_y1 - slope*D1_x1) * dxS/dyS
    const k1 = slope * dxS / dyS;
    const xEq0 = (S_x1 + (D1_y1 - S_y1 - slope * D1_x1) * dxS / dyS) / (1 - k1);
    const yEq0 = D1_y1 + slope * (xEq0 - D1_x1);

    // New demand D2 parallel to D1, passing through a shifted reference point.
    // For hoog: shift right by ~20% of pw ; for laag: shift left by ~20% of pw.
    const dx = (isHoog ? +1 : -1) * pw * 0.18;
    // D2 at x=D1_x1 has y = D1_y1 - slope*dx (shifting the line horizontally by dx)
    const D2_y_at_px = D1_y1 - slope * dx;
    // Intersect D2 with S.
    const xEq1 = (S_x1 + (D2_y_at_px - S_y1 - slope * D1_x1) * dxS / dyS) / (1 - k1);
    const yEq1 = D2_y_at_px + slope * (xEq1 - D1_x1);

    // D2 endpoints for rendering, clamped to plot bounds.
    const yMax = axisY - 8, yMin = py + 10;
    let D2_x_left = px, D2_y_left = D2_y_at_px;
    let D2_x_right = px + pw - 10, D2_y_right = D2_y_at_px + slope * ((px + pw - 10) - D1_x1);
    if (D2_y_right > yMax) {
      D2_x_right = D1_x1 + (yMax - D2_y_at_px) / slope;
      D2_y_right = yMax;
    } else if (D2_y_right < yMin) {
      D2_x_right = D1_x1 + (yMin - D2_y_at_px) / slope;
      D2_y_right = yMin;
    }
    if (D2_y_left > yMax) {
      D2_x_left = D1_x1 + (yMax - D2_y_at_px) / slope;
      D2_y_left = yMax;
    } else if (D2_y_left < yMin) {
      D2_x_left = D1_x1 + (yMin - D2_y_at_px) / slope;
      D2_y_left = yMin;
    }

    return `
      <g>
        <!-- Title bar -->
        <rect x="${xOff + 30}" y="120" width="${pw + 100}" height="34" rx="6" fill="${titleCol}"/>
        <text x="${xOff + 30 + (pw+100)/2}" y="143" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="#ffffff" letter-spacing="3">${title.toUpperCase()}</text>

        <!-- Axes -->
        <line x1="${axisX}" y1="${axisY}" x2="${axisX}" y2="${py - 6}" stroke="${SC.ink}" stroke-width="1.5" marker-end="url(#ah-ink)"/>
        <line x1="${axisX}" y1="${axisY}" x2="${px + pw + 10}" y2="${axisY}" stroke="${SC.ink}" stroke-width="1.5" marker-end="url(#ah-ink)"/>
        <text x="${axisX - 12}" y="${py + 6}" text-anchor="end" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ink}">w</text>
        <text x="${px + pw + 14}" y="${axisY + 16}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ink}">L</text>

        <!-- Supply -->
        <line x1="${S_x1}" y1="${S_y1}" x2="${S_x2}" y2="${S_y2}" stroke="${SC.indigo}" stroke-width="2.5"/>
        <text x="${S_x2 + 6}" y="${S_y2 + 4}" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.indigo}">A</text>

        <!-- Original demand -->
        <line x1="${D1_x1}" y1="${D1_y1}" x2="${D1_x2}" y2="${D1_y2}" stroke="${SC.olive}" stroke-width="2" stroke-dasharray="6,4" opacity="0.7"/>
        <text x="${D1_x2 + 4}" y="${D1_y2 + 4}" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.olive}">V (oud)</text>

        <!-- New demand -->
        <line x1="${D2_x_left}" y1="${D2_y_left}" x2="${D2_x_right}" y2="${D2_y_right}" stroke="${SC.coralDeep}" stroke-width="2.8"/>
        <text x="${D2_x_right + 4}" y="${D2_y_right - 6}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.coralDeep}">V (nieuw)</text>

        <!-- Old equilibrium -->
        <circle cx="${xEq0}" cy="${yEq0}" r="5" fill="${SC.olive}" opacity="0.8"/>
        <!-- New equilibrium -->
        <circle cx="${xEq1}" cy="${yEq1}" r="7" fill="${SC.coralDeep}"/>

        <!-- Dashed wage refs -->
        <line x1="${axisX}" y1="${yEq0}" x2="${xEq0}" y2="${yEq0}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
        <line x1="${axisX}" y1="${yEq1}" x2="${xEq1}" y2="${yEq1}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>

        <text x="${axisX - 10}" y="${yEq0 + 4}" text-anchor="end" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.olive}">w\u2080</text>
        <text x="${axisX - 10}" y="${yEq1 + 4}" text-anchor="end" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.coralDeep}">w\u2081</text>

        <!-- Wage arrow -->
        ${shiftDir === "right"
          ? `<line x1="${axisX - 36}" y1="${yEq0}" x2="${axisX - 36}" y2="${yEq1 + 4}" stroke="${SC.coralDeep}" stroke-width="2" marker-end="url(#ah-coral)"/>
             <text x="${axisX - 52}" y="${(yEq0 + yEq1)/2 + 4}" text-anchor="end" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.coralDeep}">${wChange}</text>`
          : `<line x1="${axisX - 36}" y1="${yEq0}" x2="${axisX - 36}" y2="${yEq1 - 4}" stroke="${SC.coralDeep}" stroke-width="2" marker-end="url(#ah-coral)"/>
             <text x="${axisX - 52}" y="${(yEq0 + yEq1)/2 + 4}" text-anchor="end" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.coralDeep}">${wChange}</text>`}
      </g>
    `;
  };

  return `${svgHeader(W, H, SC.paper)}
    ${editorialTitle("Globalisering splitst de arbeidsmarkt", "VAARDIGHEID 05")}

    ${mkPlot(10,  "Hoogopgeleiden",  SC.oliveDeep, "right", "w \u2191")}
    ${mkPlot(640, "Laagopgeleiden",  SC.coralDeep, "left",  "w \u2193")}

    <!-- Bottom explainer -->
    <rect x="60" y="560" width="580" height="60" rx="8" fill="${SC.goodBg}"/>
    <text x="80" y="584" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.oliveDeep}" letter-spacing="3">HOOG</text>
    <text x="80" y="608" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.ink}">Innovatie \u2192 meer vraag, beperkt aanbod \u2192 lonen omhoog.</text>

    <rect x="660" y="560" width="580" height="60" rx="8" fill="${SC.badBg}"/>
    <text x="680" y="584" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.coralDeep}" letter-spacing="3">LAAG</text>
    <text x="680" y="608" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.ink}">Offshoring \u2192 minder vraag, zelfde aanbod \u2192 lonen onder druk.</text>
  </svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD
// ═══════════════════════════════════════════════════════════════════════════
async function build() {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: "CUSTOM_16x9", width: 10, height: 5.625 });
  pres.layout = "CUSTOM_16x9";
  pres.author = "Economie VWO";
  pres.title = "3.4.6 Toepassen";
  defineMasters(pres, { darkLabel: "PARAGRAAF  \u00B7  \u00A73.4", lightLabel: "\u00A7 3.4  \u00B7  INTERNATIONALE MARKTEN" });

  const svgs = {
    vijf:         svgVijfVaardigheden(),
    brexit:       svgBrexitKeten(),
    exportwaarde: svgExportwaarde(),
    interIntra:   svgInterIntra(),
    handelsbalans:svgHandelsbalans(),
    globalisering:svgGlobaliseringArbeid(),
  };
  const imgs = {};
  for (const [k, v] of Object.entries(svgs)) imgs[k] = await svgData(v, 1440);

  // ─── Helpers ────────────────────────────────────────────────────────
  const sectionDivider = ({ kicker, title, subtitle, notes }) => {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText(kicker.toUpperCase(), { x: 0.6, y: 1.6, w: 8.8, h: 0.4, ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6 });
    s.addText(title, { x: 0.6, y: 2.05, w: 8.8, h: 1.8, ...T.heroDark, fontSize: 48, charSpacing: -2, lineSpacingMultiple: 1.02 });
    s.addShape("rect", { x: 0.6, y: 4.15, w: 0.6, h: 0.04, fill: { color: PC.coral } });
    if (subtitle) s.addText(subtitle, { x: 0.6, y: 4.3, w: 8.8, h: 0.8, ...T.subheadDark, fontFace: FONT_SERIF, italic: true, fontSize: 20 });
    if (notes) s.addNotes(notes);
    return s;
  };
  const editorial = ({ kicker, title, subtitle, notes }) => {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    if (kicker) s.addText(kicker.toUpperCase(), { x: 0.5, y: 0.3, w: 9, h: 0.3, ...T.labelUpper, color: PC.coral, fontSize: 11, charSpacing: 4 });
    s.addText(title, { x: 0.5, y: 0.6, w: 9, h: 0.8, ...T.displayLight, fontSize: 32, charSpacing: -1 });
    if (subtitle) s.addText(subtitle, { x: 0.5, y: 1.35, w: 9, h: 0.4, ...T.subheadLight, fontFace: FONT_SERIF, italic: true, fontSize: 18 });
    if (notes) s.addNotes(notes);
    return s;
  };

  // ── 1: Title ────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("\u00A7 3.4.6", { x: 0.6, y: 0.5, w: 4, h: 0.4, ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6 });
    s.addText("Toepassen", { x: 0.6, y: 1.0, w: 8.8, h: 1.6, ...T.heroDark, fontSize: 96, charSpacing: -4 });
    s.addText("Vijf vaardigheden over internationale markten \u2014 in \u00E9\u00E9n casus.",
      { x: 0.6, y: 2.8, w: 8.8, h: 0.8, fontFace: FONT_SERIF, fontSize: 22, italic: true, color: PC.cloud });
    s.addShape("rect", { x: 0.6, y: 3.85, w: 0.8, h: 0.04, fill: { color: PC.coral } });
    s.addText("Hoofdstuk 4 \u00B7 Internationale markten \u00B7 Integratieparagraaf",
      { x: 0.6, y: 3.95, w: 8.8, h: 0.4, fontFace: FONT_SERIF, fontSize: 14, italic: true, color: PC.cloud });
    s.addNotes("Integratieparagraaf §3.4.6. Geen nieuwe theorie — we passen §3.4.1 t/m §3.4.5 toe op echte casussen: Brexit, exportwaarde, Philips, VS-handelstekort en de arbeidsmarkt onder globalisering.");
  }

  // ── 2: Pull quote ───────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("\u201C", { x: 0.6, y: 0.7, w: 2, h: 2, fontFace: FONT_SERIF, fontSize: 220, bold: true, color: PC.coral });
    s.addText("E\u00E9n grafiek,\nvijf vragen.",
      { x: 1.8, y: 1.4, w: 8, h: 3,
        fontFace: FONT_DISPLAY, fontSize: 64, bold: true, color: PC.chalk, charSpacing: -2, lineSpacingMultiple: 1.05 });
    s.addText("Internationale handel zit vol ketens \u2014 leer ze stap voor stap uit elkaar te halen.",
      { x: 1.8, y: 4.4, w: 8, h: 0.6, fontFace: FONT_SERIF, fontSize: 18, italic: true, color: PC.amber });
    s.addNotes("Haak: een enkele casus (zoals Brexit) raakt vrijwel altijd meerdere vaardigheden — de keten beschrijven, de handelsbalans duiden, de arbeidsmarkt analyseren.");
  }

  // ── 3: Leerdoelen (SIDEBAR) ─────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "SIDEBAR" });
    s.addText("LEERDOELEN", { x: 0.15, y: 0.4, w: 1.7, h: 0.3, ...T.labelUpper, color: PC.coral, fontSize: 10, charSpacing: 3 });
    s.addText("Vijf vaardigheden", { x: 0.15, y: 0.75, w: 1.7, h: 1.6, fontFace: FONT_DISPLAY, fontSize: 16, bold: true, color: PC.chalk, charSpacing: -0.3 });
    s.addText("Van casus \u2192 analyse \u2192 oordeel.", { x: 0.15, y: 2.5, w: 1.7, h: 2, fontFace: FONT_SERIF, fontSize: 11, italic: true, color: PC.cloud, lineSpacingMultiple: 1.4 });
    const doelen = [
      "Effecten van handelspolitiek stapsgewijs beschrijven",
      "Exportwaarde ontleden in prijs en volume",
      "Inter- en intra-industri\u00EBle handel herkennen",
      "Handelsbalans en geldstromen begrijpen",
      "Effecten van globalisering op de arbeidsmarkt analyseren",
    ];
    doelen.forEach((d, i) => {
      const y = 0.7 + i * 0.85;
      s.addText(`0${i+1}`, { x: 2.3, y, w: 1.1, h: 0.6, fontFace: FONT_DISPLAY, fontSize: 38, bold: true, color: PC.coral, charSpacing: -2 });
      s.addText(d, { x: 3.4, y: y + 0.1, w: 6.3, h: 0.5, fontFace: FONT_SANS, fontSize: 18, color: PC.ink, valign: "middle" });
      if (i < doelen.length - 1) s.addShape("rect", { x: 2.3, y: y + 0.75, w: 7.4, h: 0.008, fill: { color: PC.cloud } });
    });
    s.addNotes("Vijf eindvaardigheden uit het leerplan. Drie domeinen: marktanalyse (1,3,4), bedrijfseconomie (2), arbeidsmarkt (5).");
  }

  // ── 4: Overview — SVG: vijf vaardigheden ────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.vijf, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Elke vaardigheid krijgt een eigen kernachtige casus. Wijs in de les naar de kaart die hoort bij het examenthema van de week.");
  }

  // ── 5: Section divider — Vaardigheid 1 ──────────────────────────────
  sectionDivider({
    kicker: "Vaardigheid 01",
    title: "Handelspolitiek: beschrijf de keten",
    subtitle: "Maatregel \u2192 direct effect \u2192 handel \u2192 sectoraal gevolg.",
    notes: "Kernaanpak voor elke vraag over tarieven, Brexit, verdragen, sancties. Altijd de complete keten — nooit één stap overslaan.",
  });

  // ── 6: SVG Brexit keten ─────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.brexit, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Brexit als schoolvoorbeeld: VK verlaat EU → geen vrij verkeer → EU-VK handel daalt → minder overslag in Rotterdam. Op de toets: noem altijd alle vier stappen. Haal er punten mee.");
  }

  // ── 7: Brexit — uitgewerkt voorbeeld (editorial) ────────────────────
  {
    const s = editorial({
      kicker: "Worked example",
      title: "Brexit \u2014 zo schrijf je het op.",
      subtitle: "Niet \u00E9\u00E9n zin, maar een keten van vier.",
      notes: "Toon welk zinsniveau op de toets volledig punten oplevert. Laat leerlingen elkaars formulering controleren.",
    });
    const items = [
      { num: "01", label: "Maatregel",        text: "Het VK verlaat de Europese interne markt." },
      { num: "02", label: "Direct effect",    text: "Er ontstaan importheffingen en douanecontroles tussen EU en VK." },
      { num: "03", label: "Effect op handel", text: "De handelsstroom tussen EU en VK daalt (minder export \u00E9n import)." },
      { num: "04", label: "Sectoraal gevolg", text: "De Rotterdamse haven slaat minder VK-goederen over; banen in overslag komen onder druk." },
    ];
    items.forEach((it, i) => {
      const y = 1.9 + i * 0.78;
      s.addShape("rect", { x: 0.5, y, w: 9, h: 0.70, fill: { color: PC.chalk }, line: { color: PC.coral, width: 1 } });
      s.addShape("rect", { x: 0.5, y, w: 0.08, h: 0.70, fill: { color: PC.coral } });
      s.addText(it.num, { x: 0.65, y: y + 0.08, w: 0.9, h: 0.55, fontFace: FONT_DISPLAY, fontSize: 26, bold: true, color: PC.coral, charSpacing: -0.5 });
      s.addText([
        { text: it.label + "  ", options: { fontFace: FONT_SANS, fontSize: 13, bold: true, color: PC.indigo, charSpacing: 2 } },
        { text: it.text, options: { fontFace: FONT_SERIF, fontSize: 16, color: PC.ink } },
      ], { x: 1.65, y: y + 0.06, w: 7.85, h: 0.6, valign: "middle", lineSpacingMultiple: 1.25 });
    });
  }

  // ── 8: Section divider — Vaardigheid 2 ──────────────────────────────
  sectionDivider({
    kicker: "Vaardigheid 02",
    title: "Exportwaarde = prijs \u00D7 volume",
    subtitle: "Wie daalt hier \u2014 de prijs of het volume? Het antwoord bepaalt de banen.",
    notes: "Kern: een daling in de exportwaarde is pas banen-bedreigend als het over volume gaat. Leerlingen moeten actief uitsplitsen.",
  });

  // ── 9: SVG Exportwaarde ─────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.exportwaarde, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Casus: exportwaarde daalt 8%, volume daalt 10%. Omdat volume harder daalt dan waarde, moet de prijs per eenheid zijn gestegen. Voor werkgelegenheid telt echter het volume — dus: banenverlies ondanks gestegen prijzen.");
  }

  // ── 10: Section divider — Vaardigheid 3 ─────────────────────────────
  sectionDivider({
    kicker: "Vaardigheid 03",
    title: "Inter- of intra-industrieel?",
    subtitle: "\u00C9\u00E9n vraag beslist: ruilen landen verschillende soorten producten?",
    notes: "Inter = comparatief voordeel (Ricardo). Intra = productdifferentiatie + schaalvoordelen. Dit is één van de meest gemaakte fouten op de toets.",
  });

  // ── 11: SVG Inter/intra ─────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.interIntra, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Let op: het gaat om de SOORT product. Philips die scanners exporteert én medische apparaten importeert = intra (dezelfde productsoort). Nederland bloemen ↔ Duitse auto's = inter (verschillende soorten).");
  }

  // ── 12: Section divider — Vaardigheid 4 ─────────────────────────────
  sectionDivider({
    kicker: "Vaardigheid 04",
    title: "Handelsbalans en geldstromen",
    subtitle: "Overschot = geld binnen. Tekort = lenen bij de rest van de wereld.",
    notes: "Belangrijkste misvatting: een tekort = arm land. Onjuist. Wijs op de VS — rijkste economie, grootste tekort.",
  });

  // ── 13: SVG Handelsbalans ───────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.handelsbalans, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("VS importeert $2.200 mld, exporteert $2.000 mld. Per saldo stroomt $200 mld naar buiten. De VS financiert dit door staatsobligaties aan buitenlanders te verkopen — hun schuld aan het buitenland groeit.");
  }

  // ── 14: Section divider — Vaardigheid 5 ─────────────────────────────
  sectionDivider({
    kicker: "Vaardigheid 05",
    title: "Globalisering splitst de arbeidsmarkt",
    subtitle: "Hoogopgeleiden profiteren, laagopgeleiden voelen de concurrentie.",
    notes: "Dit is de evaluatievraag-stof. Altijd via vraag EN aanbod redeneren — niet slechts één kant.",
  });

  // ── 15: SVG Globalisering arbeidsmarkt ──────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.globalisering, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Links: hoogopgeleiden. Innovatie verhoogt de vraag (V schuift naar rechts). Aanbod is relatief vast — loon stijgt. Rechts: laagopgeleiden. Offshoring laat de vraag dalen (V schuift naar links). Aanbod blijft gelijk — loon daalt. Altijd BEIDE curves benoemen op de toets.");
  }

  // ── 16: Valkuilen (editorial, 3 items) ──────────────────────────────
  {
    const s = editorial({
      kicker: "Valkuilen",
      title: "Drie fouten die elk jaar terugkomen.",
      notes: "Wijs er scherp op: dit zijn de drie meest gemaakte fouten op de vaardigheden van §3.4.",
    });
    const items = [
      { num: "01", claim: "Exportwaarde daalt = volume daalt",     truth: "Niet per se. De waarde daalt pas door volume \u00E9n/of prijs. Altijd uitsplitsen met waarde = prijs \u00D7 volume." },
      { num: "02", claim: "Handelstekort = arm land",               truth: "Onjuist. De VS heeft het grootste tekort ter wereld en is een van de rijkste landen. Tekort = meer kopen dan verkopen \u2014 niet armoede." },
      { num: "03", claim: "Globalisering is slecht voor iedereen",  truth: "Te stellig. Hoogopgeleiden profiteren (loon \u2191), laagopgeleiden ondervinden concurrentie (loon \u2193). Verschil per groep." },
    ];
    items.forEach((it, i) => {
      const y = 1.9 + i * 1.18;
      s.addShape("rect", { x: 0.5, y, w: 9, h: 1.10, fill: { color: PC.chalk }, line: { color: PC.coral, width: 1 } });
      s.addShape("rect", { x: 0.5, y, w: 0.08, h: 1.10, fill: { color: PC.coral } });
      s.addText(it.num, { x: 0.65, y: y + 0.18, w: 0.9, h: 0.6, fontFace: FONT_DISPLAY, fontSize: 26, bold: true, color: PC.coral, charSpacing: -0.5 });
      s.addText([
        { text: "\u201C" + it.claim + "\u201D", options: { fontFace: FONT_SERIF, fontSize: 15, italic: true, color: PC.coralDeep, bold: true, breakLine: true } },
        { text: it.truth, options: { fontFace: FONT_SANS, fontSize: 13, color: PC.ink } },
      ], { x: 1.65, y: y + 0.1, w: 7.85, h: 0.98, lineSpacingMultiple: 1.25, valign: "top" });
    });
  }

  // ── 17: Redeneerroute — vijfstappenplan ─────────────────────────────
  {
    const s = editorial({
      kicker: "Methode",
      title: "Aanpak voor elke casus over internationale markten.",
      subtitle: "Dezelfde vijf stappen, elke keer \u2014 zo mis je niets.",
      notes: "Sjabloon voor elke vraag. Laat leerlingen het met potlood naast de toetsvraag schrijven.",
    });
    const steps = [
      { n: "01", label: "Diagnose",      t: "Welke\nmaatregel\nof schok?",          col: PC.coralDeep },
      { n: "02", label: "Handels&shy;stroom", t: "Waarde\nof volume?",              col: PC.amberDeep },
      { n: "03", label: "Vorm",          t: "Inter of\nintra?",                    col: PC.indigo },
      { n: "04", label: "Balans",        t: "Effect op\nde balans?",                col: PC.oliveDeep },
      { n: "05", label: "Arbeid",        t: "Effect op\nde banen?",                 col: PC.plum },
    ];
    steps.forEach((st, i) => {
      const cols = 5;
      const totalW = 9.0;
      const gap = 0.18;
      const cardW = (totalW - (cols - 1) * gap) / cols;
      const x = 0.5 + i * (cardW + gap);
      const y = 2.2;
      s.addShape("rect", { x, y, w: cardW, h: 2.6, fill: { color: PC.chalk }, line: { color: st.col, width: 1.5 } });
      s.addShape("rect", { x, y, w: cardW, h: 0.18, fill: { color: st.col } });
      s.addText(st.n, { x: x + 0.12, y: y + 0.28, w: cardW - 0.24, h: 0.7, fontFace: FONT_DISPLAY, fontSize: 32, bold: true, color: st.col, charSpacing: -2 });
      s.addText(st.t, { x: x + 0.12, y: y + 1.05, w: cardW - 0.24, h: 1.45, fontFace: FONT_DISPLAY, fontSize: 16, bold: true, color: PC.indigo, lineSpacingMultiple: 1.2, valign: "top" });
    });
  }

  // ── 18: Zelftest ────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("Zelftest", { x: 0.6, y: 0.5, w: 8.8, h: 0.4, ...T.labelUpper, color: PC.coral, fontSize: 13, charSpacing: 6 });
    s.addText("Kun je deze vijf dingen?", { x: 0.6, y: 0.9, w: 8.8, h: 0.8, ...T.headlineDark, fontSize: 34, charSpacing: -1 });
    const items = [
      { n: "01", t: "De keten beschrijven: maatregel \u2192 handel \u2192 sector" },
      { n: "02", t: "Exportwaarde ontleden in prijs en volume" },
      { n: "03", t: "Inter- en intra-industri\u00EBle handel herkennen" },
      { n: "04", t: "Handelsoverschot vs handelstekort duiden" },
      { n: "05", t: "Effect globalisering op hoog- en laagopgeleiden" },
    ];
    items.forEach((it, i) => {
      const y = 2.0 + i * 0.58;
      s.addText(it.n, { x: 0.6, y, w: 0.9, h: 0.5, fontFace: FONT_DISPLAY, fontSize: 24, bold: true, color: PC.coral });
      s.addText(it.t, { x: 1.5, y: y + 0.05, w: 8.0, h: 0.5, fontFace: FONT_SANS, fontSize: 18, color: PC.chalk, valign: "middle" });
      if (i < items.length - 1) s.addShape("rect", { x: 0.6, y: y + 0.52, w: 8.8, h: 0.005, fill: { color: PC.indigoSoft } });
    });
    s.addNotes("Vijf checkvragen. Alleen doorlopen naar de opgaven als leerlingen bij elke bolletje met vertrouwen ja antwoorden. Bij twijfel terug naar het bijbehorende SVG-overzicht.");
  }

  // ── Write + fix + round-trip ────────────────────────────────────────
  const outDir = path.resolve(__dirname, "../../../output/3.4.6");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const svgDir = path.join(outDir, "svg");
  if (!fs.existsSync(svgDir)) fs.mkdirSync(svgDir, { recursive: true });
  for (const [k, v] of Object.entries(svgs)) fs.writeFileSync(path.join(svgDir, `346-${k}.svg`), v, "utf8");

  const outPath = path.join(outDir, "3.4.6 Toepassen \u2013 presentatie.pptx");
  await pres.writeFile({ fileName: outPath });
  const fix = await fixPptxFile(outPath);
  roundtripWithLibreOffice(outPath);
  console.log(`PPTX written to ${outPath} (fix: -${fix.removedOverrides} phantom overrides, -${fix.removedEmptyDirs} empty dirs; roundtripped via LibreOffice)`);
}

build().catch(e => { console.error(e); process.exit(1); });
