/**
 * pptx-344-internationale-productieketens.js — §3.4.4 Internationale productieketens
 * Creative editorial presentation, uses lib-pptx.js design system.
 */

const {
  PC, SC, T, FONT_SANS, FONT_DISPLAY, FONT_SERIF, FONT_MONO,
  defineMasters, softShadow, tightShadow,
  svgToPng, pngB64, svgData,
  ICON, placeIcon,
  svgHeader, editorialTitle, fixPptxFile, roundtripWithLibreOffice,
} = require("../../lib/lib-pptx.js");

const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ═══════════════════════════════════════════════════════════════════════════
// SVG SCENES
// ═══════════════════════════════════════════════════════════════════════════

// Opening visual — stylized world map silhouette with shipping routes
function svgWorldRoutes() {
  return `${svgHeader(1280, 420, SC.indigoDeep)}
    <!-- faint grid / longitudes -->
    ${Array.from({length: 12}, (_, i) => {
      const x = 40 + i * 104;
      return `<line x1="${x}" y1="40" x2="${x}" y2="380" stroke="${SC.indigoSoft}" stroke-width="0.5" opacity="0.25"/>`;
    }).join("")}
    ${Array.from({length: 6}, (_, i) => {
      const y = 60 + i * 55;
      return `<line x1="40" y1="${y}" x2="1240" y2="${y}" stroke="${SC.indigoSoft}" stroke-width="0.5" opacity="0.25"/>`;
    }).join("")}

    <defs>
      <linearGradient id="oceanG" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${SC.indigoMid}" stop-opacity="0.2"/>
        <stop offset="1" stop-color="${SC.indigoDeep}" stop-opacity="0.6"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="1280" height="420" fill="url(#oceanG)"/>

    <!-- Stylized continent blobs (Americas, Europe/Africa, Asia) -->
    <!-- Americas -->
    <path d="M160 120 Q140 160 180 200 Q170 240 200 280 Q190 320 230 340 Q240 300 220 260 Q250 220 230 180 Q250 140 210 110 Z"
          fill="${SC.indigoMid}" opacity="0.55"/>
    <!-- Europe -->
    <path d="M560 120 Q550 140 570 170 Q600 165 620 150 Q640 130 610 110 Q585 105 560 120 Z"
          fill="${SC.indigoMid}" opacity="0.6"/>
    <!-- Africa -->
    <path d="M580 180 Q570 230 590 270 Q610 300 640 280 Q650 240 635 200 Q615 175 580 180 Z"
          fill="${SC.indigoMid}" opacity="0.55"/>
    <!-- Asia -->
    <path d="M760 110 Q720 140 760 170 Q800 160 860 180 Q920 170 960 200 Q980 160 940 130 Q880 110 820 115 Q800 100 760 110 Z"
          fill="${SC.indigoMid}" opacity="0.55"/>
    <!-- SE Asia / islands -->
    <path d="M960 230 Q980 240 1000 230 Q1010 250 990 260 Q970 255 960 230 Z" fill="${SC.indigoMid}" opacity="0.5"/>
    <path d="M1020 250 Q1040 258 1050 270 Q1035 280 1020 270 Z" fill="${SC.indigoMid}" opacity="0.5"/>

    <!-- Port nodes -->
    ${[
      { x: 210, y: 250, name: "USA" },
      { x: 590, y: 150, name: "EU" },
      { x: 850, y: 160, name: "China" },
      { x: 930, y: 140, name: "Korea" },
      { x: 900, y: 195, name: "Taiwan" },
      { x: 985, y: 245, name: "Vietnam" },
      { x: 260, y: 305, name: "Mexico" },
    ].map(p => `
      <circle cx="${p.x}" cy="${p.y}" r="6" fill="${SC.amber}"/>
      <circle cx="${p.x}" cy="${p.y}" r="12" fill="none" stroke="${SC.amber}" stroke-width="1.2" opacity="0.4"/>
      <text x="${p.x}" y="${p.y - 18}" text-anchor="middle" font-family="Segoe UI" font-size="11" font-weight="700" fill="${SC.amber}">${p.name}</text>
    `).join("")}

    <!-- Shipping routes (dashed arcs) -->
    <g fill="none" stroke="${SC.coral}" stroke-width="2" stroke-dasharray="8,6" opacity="0.85">
      <path d="M900 195 Q760 120 590 150"/>   <!-- Taiwan → EU -->
      <path d="M930 140 Q820 80 590 150"/>    <!-- Korea → EU -->
      <path d="M985 245 Q700 320 260 305"/>   <!-- Vietnam → Mexico -->
      <path d="M850 160 Q540 60 210 250"/>    <!-- China → USA -->
    </g>
  </svg>`;
}

// The smile curve — value added along the global value chain
function svgSmileCurve() {
  const w = 1280, h = 640;
  const px = 140, py = 160, pw = 1000, ph = 380;
  const stages = [
    { x: 0.00, y: 0.85, label: "R&amp;D /\nontwerp", country: "VS",        color: SC.indigo },
    { x: 0.17, y: 0.55, label: "Chips /\nmerken",   country: "Korea · Taiwan", color: SC.teal },
    { x: 0.34, y: 0.30, label: "Onder-\ndelen",     country: "Vietnam",       color: SC.olive },
    { x: 0.50, y: 0.15, label: "Assem-\nblage",     country: "China",         color: SC.coral },
    { x: 0.66, y: 0.35, label: "Logistiek\n&amp; transport", country: "wereldwijd", color: SC.olive },
    { x: 0.83, y: 0.62, label: "Marketing\n&amp; dienst", country: "wereldwijd",   color: SC.teal },
    { x: 1.00, y: 0.88, label: "Retail /\nmerk",    country: "VS · EU",       color: SC.indigo },
  ];

  const xAt = f => px + f * pw;
  const yAt = f => py + (1 - f) * ph; // f=1 → top, f=0 → bottom

  // Smooth curve through the stages
  const pts = stages.map(s => [xAt(s.x), yAt(s.y)]);
  let pathD = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    pathD += ` Q ${cx} ${y0} ${cx} ${(y0 + y1) / 2} T ${x1} ${y1}`;
  }

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("De smile curve — waar in de keten zit de waarde?", "TOEGEVOEGDE WAARDE PER SCHAKEL")}

    <!-- Axes -->
    <line x1="${px}" y1="${py + ph}" x2="${px}" y2="${py - 10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py + ph}" x2="${px + pw + 10}" y2="${py + ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>

    <text x="${px - 60}" y="${py + ph / 2}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 60}, ${py + ph / 2})">Toegevoegde waarde per schakel</text>
    <text x="${px + pw / 2}" y="${py + ph + 80}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle">Productieketen: van idee → assemblage → klant</text>

    <!-- Value zones (shaded background) -->
    <rect x="${px}" y="${py}" width="${pw}" height="${ph * 0.3}" fill="${SC.teal}" fill-opacity="0.05"/>
    <rect x="${px}" y="${py + ph * 0.7}" width="${pw}" height="${ph * 0.3}" fill="${SC.coral}" fill-opacity="0.05"/>
    <text x="${px + 10}" y="${py + 22}" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.tealDeep}" letter-spacing="2" opacity="0.8">HOGE WAARDE</text>
    <text x="${px + 10}" y="${py + ph - 10}" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.coralDeep}" letter-spacing="2" opacity="0.8">LAGE WAARDE</text>

    <!-- The smile curve -->
    <path d="${pathD}" fill="none" stroke="${SC.coral}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Stage points with labels -->
    ${stages.map((s, i) => {
      const x = xAt(s.x), y = yAt(s.y);
      const aboveCurve = s.y > 0.5; // labels at top of smile go up, bottom go down
      const labelY = aboveCurve ? y - 60 : y + 58;
      return `
        <circle cx="${x}" cy="${y}" r="9" fill="${s.color}"/>
        <circle cx="${x}" cy="${y}" r="15" fill="none" stroke="${s.color}" stroke-width="2" opacity="0.45"/>
        <text x="${x}" y="${labelY}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.indigo}">
          ${s.label.split("\n").map((l, j) => `<tspan x="${x}" dy="${j === 0 ? 0 : 16}">${l}</tspan>`).join("")}
        </text>
        <text x="${x}" y="${aboveCurve ? labelY + 36 : labelY + 36}" text-anchor="middle" font-family="${FONT_SERIF}" font-size="11" font-style="italic" fill="${SC.smoke}">${s.country}</text>
      `;
    }).join("")}

    <!-- Annotation: assemblage (centered, below the trough) -->
    <g>
      <rect x="${xAt(0.50) - 110}" y="${yAt(0.15) + 50}" width="220" height="64" rx="10" fill="${SC.coralDeep}"/>
      <text x="${xAt(0.50)}" y="${yAt(0.15) + 72}" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.amber}" letter-spacing="2">ASSEMBLAGE</text>
      <text x="${xAt(0.50)}" y="${yAt(0.15) + 92}" text-anchor="middle" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.chalk}">lage loonkosten · dunne marges</text>
    </g>

    <!-- Bottom insight bar -->
    <rect x="${px}" y="${h - 56}" width="${pw}" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="${px + 20}" y="${h - 30}" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="${SC.chalk}">Wie de uiteinden van de glimlach bezit, vangt het meeste van de waarde.</text>
  </svg>`;
}

// Production chain flow — horizontal chain of stages with country flags
function svgProductionChain() {
  const w = 1280, h = 640;
  const stages = [
    { label: "Ontwerp",      country: "Verenigde Staten", flag: "VS",       note: "R&amp;D · software",        color: SC.indigo },
    { label: "Chips",        country: "Taiwan",          flag: "TW",       note: "TSMC halfgeleiders",    color: SC.teal },
    { label: "Batterij",     country: "Zuid-Korea",      flag: "KR",       note: "LG · Samsung",          color: SC.olive },
    { label: "Behuizing",    country: "Vietnam",         flag: "VN",       note: "metaal · plastic",      color: SC.amberDeep },
    { label: "Assemblage",   country: "China",           flag: "CN",       note: "Foxconn · inpakken",    color: SC.coral },
    { label: "Distributie",  country: "Nederland",       flag: "NL",       note: "haven · logistiek",     color: SC.indigoMid },
  ];

  const n = stages.length;
  const boxW = 170, boxH = 200, gap = 20;
  const totalW = n * boxW + (n - 1) * gap;
  const startX = (w - totalW) / 2;
  const yTop = 200;

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Een laptop reist de wereld rond voordat hij in Nederland ligt", "INTERNATIONALE PRODUCTIEKETEN")}

    <!-- Chain track -->
    <rect x="${startX - 20}" y="${yTop + boxH + 40}" width="${totalW + 40}" height="6" rx="3" fill="${SC.cloud}"/>

    ${stages.map((s, i) => {
      const x = startX + i * (boxW + gap);
      const isLast = i === n - 1;
      return `
        <!-- Card -->
        <rect x="${x}" y="${yTop}" width="${boxW}" height="${boxH}" rx="12" fill="${SC.chalk}" stroke="${s.color}" stroke-width="2"/>
        <rect x="${x}" y="${yTop}" width="${boxW}" height="40" rx="12" fill="${s.color}"/>
        <rect x="${x}" y="${yTop + 28}" width="${boxW}" height="12" fill="${s.color}"/>

        <!-- Flag badge (circular country code) -->
        <text x="${x + boxW/2}" y="${yTop + 27}" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.chalk}" letter-spacing="2">${s.flag}</text>

        <!-- Step number -->
        <circle cx="${x + boxW - 18}" cy="${yTop + boxH - 18}" r="14" fill="${s.color}"/>
        <text x="${x + boxW - 18}" y="${yTop + boxH - 13}" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="14" font-weight="700" fill="${SC.chalk}">${i + 1}</text>

        <!-- Stage label -->
        <text x="${x + boxW/2}" y="${yTop + 82}" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.indigo}">${s.label}</text>

        <!-- Country (sub) -->
        <text x="${x + boxW/2}" y="${yTop + 108}" text-anchor="middle" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">${s.country}</text>

        <!-- Divider -->
        <line x1="${x + 20}" y1="${yTop + 128}" x2="${x + boxW - 20}" y2="${yTop + 128}" stroke="${SC.cloud}" stroke-width="1"/>

        <!-- Note -->
        <text x="${x + boxW/2}" y="${yTop + 155}" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" fill="${SC.ink}">${s.note}</text>

        <!-- Track node -->
        <circle cx="${x + boxW/2}" cy="${yTop + boxH + 43}" r="9" fill="${s.color}"/>
        <circle cx="${x + boxW/2}" cy="${yTop + boxH + 43}" r="14" fill="none" stroke="${s.color}" stroke-width="1.5" opacity="0.45"/>

        ${!isLast ? `
          <!-- Arrow to next -->
          <line x1="${x + boxW + 2}" y1="${yTop + boxH/2}" x2="${x + boxW + gap - 4}" y2="${yTop + boxH/2}" stroke="${SC.ash}" stroke-width="2" marker-end="url(#ah-ink)"/>
        ` : ""}
      `;
    }).join("")}

    <!-- Bottom: total -->
    <rect x="${startX}" y="${yTop + boxH + 90}" width="${totalW}" height="70" rx="10" fill="${SC.indigoDeep}"/>
    <text x="${startX + 30}" y="${yTop + boxH + 124}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="3">TOTAAL</text>
    <text x="${startX + 30}" y="${yTop + boxH + 150}" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="${SC.chalk}">6 landen  ·  4 continenten  ·  1 laptop</text>
    <text x="${startX + totalW - 30}" y="${yTop + boxH + 134}" text-anchor="end" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.cloud}">Kosten internationaal: €480</text>
    <text x="${startX + totalW - 30}" y="${yTop + boxH + 154}" text-anchor="end" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.cloud}">Alleen NL: €650  (+35 %)</text>
  </svg>`;
}

// Offshoring trade-off — 2D scatter: kostenvoordeel vs. kwetsbaarheid
function svgOffshoringTradeoff() {
  const w = 1280, h = 640;
  const px = 160, py = 140, pw = 900, ph = 340;
  const xToX = fx => px + fx * pw;
  const yToY = fy => py + (1 - fy) * ph;

  const points = [
    { x: 0.85, y: 0.80, label: "Verre offshoring", sub: "China · Vietnam",    color: SC.coralDeep, r: 16 },
    { x: 0.60, y: 0.55, label: "Nearshoring",      sub: "Oost-Europa · Marokko", color: SC.amberDeep, r: 14 },
    { x: 0.30, y: 0.25, label: "Reshoring",         sub: "terug naar NL/EU",  color: SC.teal,      r: 14 },
    { x: 0.15, y: 0.10, label: "Nationale productie", sub: "alles in NL",     color: SC.olive,     r: 14 },
  ];

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Lage kosten of lage kwetsbaarheid — kies je strategie", "OFFSHORING · NEARSHORING · RESHORING")}

    <!-- Axes -->
    <line x1="${px}" y1="${py + ph}" x2="${px}" y2="${py - 10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py + ph}" x2="${px + pw + 10}" y2="${py + ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>

    <text x="${px - 70}" y="${py + ph/2}" font-family="${FONT_SANS}" font-size="14" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 70}, ${py + ph/2})">Kwetsbaarheid bij verstoring</text>
    <text x="${px + pw/2}" y="${py + ph + 50}" font-family="${FONT_SANS}" font-size="14" fill="${SC.smoke}" text-anchor="middle">Kostenvoordeel (hoe verder, hoe goedkoper)</text>

    <!-- Axis endpoint labels -->
    <text x="${px}" y="${py + ph + 24}" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" fill="${SC.ash}">laag</text>
    <text x="${px + pw}" y="${py + ph + 24}" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" fill="${SC.ash}">hoog</text>
    <text x="${px - 22}" y="${py + ph}" text-anchor="end" font-family="${FONT_SANS}" font-size="11" fill="${SC.ash}">laag</text>
    <text x="${px - 22}" y="${py + 8}" text-anchor="end" font-family="${FONT_SANS}" font-size="11" fill="${SC.ash}">hoog</text>

    <!-- Quadrant guides -->
    <line x1="${px + pw/2}" y1="${py}" x2="${px + pw/2}" y2="${py + ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,4"/>
    <line x1="${px}" y1="${py + ph/2}" x2="${px + pw}" y2="${py + ph/2}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,4"/>

    <!-- Quadrant labels — placed near corners, away from point clusters -->
    <text x="${px + pw - 10}" y="${py + 20}" text-anchor="end" font-family="${FONT_SANS}" font-size="10" font-weight="700" fill="${SC.coralDeep}" letter-spacing="2" opacity="0.7">GOEDKOOP &amp; KWETSBAAR</text>
    <text x="${px + pw - 10}" y="${py + ph - 10}" text-anchor="end" font-family="${FONT_SANS}" font-size="10" font-weight="700" fill="${SC.ash}" letter-spacing="2" opacity="0.7">GOEDKOOP &amp; ROBUUST</text>

    <!-- Trade-off arrow -->
    <g opacity="0.55">
      <line x1="${xToX(0.15)}" y1="${yToY(0.10)}" x2="${xToX(0.85)}" y2="${yToY(0.80)}" stroke="${SC.ash}" stroke-width="2" stroke-dasharray="10,6"/>
      <text x="${xToX(0.5) - 40}" y="${yToY(0.5) - 14}" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.smoke}" transform="rotate(38, ${xToX(0.5)}, ${yToY(0.5)})">trade-off</text>
    </g>

    <!-- Points -->
    ${points.map(p => {
      const x = xToX(p.x), y = yToY(p.y);
      return `
        <circle cx="${x}" cy="${y}" r="${p.r + 6}" fill="${p.color}" fill-opacity="0.2"/>
        <circle cx="${x}" cy="${y}" r="${p.r}" fill="${p.color}"/>
        <text x="${x + p.r + 14}" y="${y - 4}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.indigo}">${p.label}</text>
        <text x="${x + p.r + 14}" y="${y + 14}" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">${p.sub}</text>
      `;
    }).join("")}

    <!-- Callout: COVID (placed in upper-left quadrant, away from scatter points) -->
    <g>
      <rect x="${xToX(0.05)}" y="${yToY(0.95)}" width="250" height="72" rx="10" fill="${SC.coralDeep}"/>
      <text x="${xToX(0.05) + 16}" y="${yToY(0.95) + 24}" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.amber}" letter-spacing="2">COVID · CHIP-TEKORT</text>
      <text x="${xToX(0.05) + 16}" y="${yToY(0.95) + 44}" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.chalk}">keten valt stil →</text>
      <text x="${xToX(0.05) + 16}" y="${yToY(0.95) + 62}" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.chalk}">bedrijven overwegen reshoring</text>
    </g>

    <!-- Bottom insight -->
    <rect x="${px}" y="${h - 56}" width="${pw}" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="${px + 20}" y="${h - 30}" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="${SC.chalk}">Verder weg = goedkoper, maar ook kwetsbaarder. Na 2020 verschuift de keuze.</text>
  </svg>`;
}

// Cost comparison bars — internationaal vs nationaal (stacked breakdown)
function svgCostComparison() {
  const w = 1280, h = 640;
  const px = 200, py = 170, pw = 880, ph = 380;

  // Max for scaling: €700
  const scale = ph / 700;
  const barW = 140;
  const gap = 60;

  // International
  const intParts = [
    { label: "Chips (Taiwan)",    val: 200, color: SC.teal },
    { label: "Batterij (Korea)",  val: 150, color: SC.olive },
    { label: "Behuizing (Vietnam)", val: 80, color: SC.amberDeep },
    { label: "Montage (China)",   val: 50,  color: SC.coral },
  ];
  const natParts = [
    { label: "Chips (NL)",        val: 120, color: SC.teal },
    { label: "Batterij (NL)",     val: 180, color: SC.olive },
    { label: "Behuizing (NL)",    val: 200, color: SC.amberDeep },
    { label: "Montage (NL)",      val: 150, color: SC.coral },
  ];

  function stackedBar(x, parts, total, titleLabel, color) {
    let cursor = py + ph; // bottom
    const segs = parts.map(p => {
      const segH = p.val * scale;
      cursor -= segH;
      return { ...p, y: cursor, h: segH };
    });
    return `
      ${segs.map((s, i) => `
        <rect x="${x}" y="${s.y}" width="${barW}" height="${s.h}" fill="${s.color}" stroke="${SC.chalk}" stroke-width="1"/>
        <text x="${x + barW/2}" y="${s.y + s.h/2 + 5}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.chalk}">€${s.val}</text>
      `).join("")}
      <!-- Total on top -->
      <rect x="${x}" y="${py + ph - total * scale - 40}" width="${barW}" height="34" rx="4" fill="${color}"/>
      <text x="${x + barW/2}" y="${py + ph - total * scale - 16}" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.chalk}">€${total}</text>
      <!-- Title below -->
      <text x="${x + barW/2}" y="${py + ph + 30}" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.indigo}">${titleLabel}</text>
    `;
  }

  const x1 = px + 60;
  const x2 = px + 60 + barW + gap + 120;
  const intTotal = intParts.reduce((s, p) => s + p.val, 0);
  const natTotal = natParts.reduce((s, p) => s + p.val, 0);

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("€480 of €650 — waarom bedrijven de wereld inschakelen", "KOSTENVERGELIJKING · LAPTOP PER STUK")}

    <!-- Axes -->
    <line x1="${px}" y1="${py + ph}" x2="${px}" y2="${py - 20}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py + ph}" x2="${px + pw}" y2="${py + ph}" stroke="${SC.ink}" stroke-width="1.8"/>
    <text x="${px - 60}" y="${py + ph/2}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 60}, ${py + ph/2})">Kosten per laptop (€)</text>

    <!-- y-axis gridlines -->
    ${[0, 200, 400, 600].map(v => `
      <line x1="${px}" y1="${py + ph - v * scale}" x2="${px + pw - 40}" y2="${py + ph - v * scale}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="3,4"/>
      <text x="${px - 10}" y="${py + ph - v * scale + 4}" text-anchor="end" font-family="${FONT_SANS}" font-size="12" fill="${SC.ash}">€${v}</text>
    `).join("")}

    ${stackedBar(x1, intParts, intTotal, "INTERNATIONAAL", SC.indigo)}
    ${stackedBar(x2, natParts, natTotal, "ALLEEN NEDERLAND", SC.coralDeep)}

    <!-- Savings arrow between -->
    <g>
      <line x1="${x1 + barW + 20}" y1="${py + ph - intTotal * scale - 20}"
            x2="${x2 - 20}" y2="${py + ph - natTotal * scale - 20}"
            stroke="${SC.amber}" stroke-width="3" stroke-dasharray="8,5"/>
      <rect x="${(x1 + x2)/2 + barW/2 - 80}" y="${py + ph - 600 * scale - 44}" width="160" height="44" rx="8" fill="${SC.amber}"/>
      <text x="${(x1 + x2)/2 + barW/2}" y="${py + ph - 600 * scale - 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.indigoDeep}" letter-spacing="2">BESPARING</text>
      <text x="${(x1 + x2)/2 + barW/2}" y="${py + ph - 600 * scale - 6}" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.indigoDeep}">€170  ·  35 %</text>
    </g>

    <!-- Legend (right side): kostencomponent per kleur -->
    <g transform="translate(${px + pw - 60}, ${py + 20})">
      <text x="0" y="0" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="2">KOSTENCOMPONENT</text>
      ${[
        { c: SC.teal,      l: "Chips / onderdelen" },
        { c: SC.olive,     l: "Batterij / modules" },
        { c: SC.amberDeep, l: "Behuizing / casco" },
        { c: SC.coral,     l: "Montage / assemblage" },
      ].map((it, i) => `
        <rect x="0" y="${20 + i * 34}" width="20" height="20" fill="${it.c}" stroke="${SC.chalk}" stroke-width="1"/>
        <text x="28" y="${20 + i * 34 + 15}" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">${it.l}</text>
      `).join("")}
    </g>

    <!-- Sub-note -->
    <text x="${px}" y="${h - 30}" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.smoke}">Let op: internationaal produceren lijkt goedkoper — maar transactiekosten (transport, communicatie, coördinatie) vreten een deel van de besparing op.</text>
  </svg>`;
}

// Voorwaarden for productieketens — 4-icon grid
function svgVoorwaarden() {
  const items = [
    { title: "Communicatie",   note: "internet, e-mail, video-calls",        icon: ICON.lightbulb(SC.indigoDeep), color: SC.indigo },
    { title: "Transport",      note: "containerschepen, luchtvracht",       icon: ICON.arrowRight(SC.tealDeep),   color: SC.teal },
    { title: "Coördinatie",    note: "IT-systemen, just-in-time planning",  icon: ICON.scale(SC.amberDeep),      color: SC.amber },
    { title: "Stabiliteit",    note: "handelsverdragen, vrede, open grenzen", icon: ICON.badge(SC.oliveDeep, SC.coral), color: SC.olive },
  ];

  const w = 1280, h = 640;
  const cardW = 260, cardH = 300, gap = 30;
  const totalW = 4 * cardW + 3 * gap;
  const startX = (w - totalW) / 2;
  const yTop = 180;

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Vier voorwaarden — zonder deze geen globale keten", "RANDVOORWAARDEN")}

    ${items.map((it, i) => {
      const x = startX + i * (cardW + gap);
      return `
        <rect x="${x}" y="${yTop}" width="${cardW}" height="${cardH}" rx="14" fill="${SC.chalk}" stroke="${it.color}" stroke-width="2"/>
        <rect x="${x}" y="${yTop}" width="${cardW}" height="60" rx="14" fill="${it.color}"/>
        <rect x="${x}" y="${yTop + 48}" width="${cardW}" height="12" fill="${it.color}"/>

        <!-- Number -->
        <text x="${x + 24}" y="${yTop + 42}" font-family="${FONT_DISPLAY}" font-size="26" font-weight="700" fill="${SC.chalk}" letter-spacing="-1">0${i + 1}</text>

        <!-- Icon circle -->
        <circle cx="${x + cardW/2}" cy="${yTop + 140}" r="50" fill="${it.color}" fill-opacity="0.12" stroke="${it.color}" stroke-width="1.5"/>
        ${placeIcon(it.icon, x + cardW/2 - 28, yTop + 112, 56)}

        <!-- Title -->
        <text x="${x + cardW/2}" y="${yTop + 225}" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="${SC.indigo}">${it.title}</text>

        <!-- Divider -->
        <line x1="${x + 40}" y1="${yTop + 242}" x2="${x + cardW - 40}" y2="${yTop + 242}" stroke="${it.color}" stroke-width="2"/>

        <!-- Note -->
        <text x="${x + cardW/2}" y="${yTop + 270}" text-anchor="middle" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">${it.note}</text>
      `;
    }).join("")}

    <!-- Bottom bar -->
    <rect x="${startX}" y="${h - 80}" width="${totalW}" height="56" rx="8" fill="${SC.indigoDeep}"/>
    <text x="${startX + 24}" y="${h - 52}" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.amber}" letter-spacing="3">HISTORISCH PERSPECTIEF</text>
    <text x="${startX + 24}" y="${h - 32}" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="${SC.chalk}">Vóór 1990 was dit onmogelijk: communicatie en transport waren te duur.</text>
  </svg>`;
}

// Disruption / supply-chain risk — chain with a break
function svgDisruption() {
  const w = 1280, h = 640;
  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Wat gebeurt er als één schakel breekt?", "KETENRISICO · SUPPLY CHAIN RISK")}

    <!-- Normal chain (top) -->
    <text x="140" y="170" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.tealDeep}" letter-spacing="3">NORMAAL · ALLE SCHAKELS WERKEN</text>

    ${["Ontwerp", "Chips", "Batterij", "Assemblage", "Retail"].map((s, i) => {
      const x = 140 + i * 200;
      return `
        <rect x="${x}" y="188" width="160" height="60" rx="8" fill="${SC.teal}" fill-opacity="0.15" stroke="${SC.tealDeep}" stroke-width="1.5"/>
        <text x="${x + 80}" y="225" text-anchor="middle" font-family="${FONT_SANS}" font-size="15" font-weight="700" fill="${SC.tealDeep}">${s}</text>
        ${i < 4 ? `<line x1="${x + 162}" y1="218" x2="${x + 198}" y2="218" stroke="${SC.tealDeep}" stroke-width="2" marker-end="url(#ah-ink)"/>` : ""}
      `;
    }).join("")}

    <text x="${140 + 4 * 200 + 80}" y="270" text-anchor="middle" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.tealDeep}">✓ laptop op tijd</text>

    <!-- Broken chain (middle) -->
    <text x="140" y="310" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.coralDeep}" letter-spacing="3">VERSTORING · CHIPTEKORT 2021</text>

    ${["Ontwerp", "Chips", "Batterij", "Assemblage", "Retail"].map((s, i) => {
      const x = 140 + i * 200;
      const broken = i === 1;
      return `
        <rect x="${x}" y="328" width="160" height="60" rx="8"
              fill="${broken ? SC.coralDeep : SC.cloud}"
              fill-opacity="${broken ? 1 : 0.3}"
              stroke="${broken ? SC.coralDeep : SC.ash}"
              stroke-width="${broken ? 2.5 : 1.5}"
              stroke-dasharray="${broken ? "" : "6,4"}"/>
        <text x="${x + 80}" y="365" text-anchor="middle" font-family="${FONT_SANS}" font-size="15" font-weight="700"
              fill="${broken ? SC.chalk : SC.ash}">${s}</text>
        ${broken ? `<text x="${x + 80}" y="320" text-anchor="middle" font-family="${FONT_SANS}" font-size="22">⚡</text>` : ""}
        ${i < 4 ? `<line x1="${x + 162}" y1="358" x2="${x + 198}" y2="358" stroke="${i >= 1 ? SC.ash : SC.ink}" stroke-width="2" stroke-dasharray="${i >= 1 ? "4,4" : ""}" marker-end="url(#ah-smoke)"/>` : ""}
      `;
    }).join("")}

    <text x="${140 + 4 * 200 + 80}" y="410" text-anchor="middle" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.coralDeep}">✗ geen laptops</text>

    <!-- Consequences panel -->
    <rect x="140" y="430" width="1000" height="150" rx="12" fill="${SC.indigoDeep}"/>
    <text x="160" y="460" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="3">GEVOLGEN VAN ÉÉN KAPOTTE SCHAKEL</text>

    ${[
      { x: 160, t: "Productie stopt", sub: "fabrieken liggen stil" },
      { x: 420, t: "Prijzen stijgen", sub: "schaarste drijft kostprijs op" },
      { x: 680, t: "Levertijden lopen op", sub: "maanden in plaats van dagen" },
      { x: 940, t: "Alternatieven duur", sub: "reshoring overwegen" },
    ].map(c => `
      <text x="${c.x}" y="500" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.chalk}">${c.t}</text>
      <text x="${c.x}" y="528" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.cloud}">${c.sub}</text>
    `).join("")}

    <!-- Bottom insight -->
    <text x="140" y="615" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.smoke}">Hoe langer de keten, hoe hoger het ketenrisico. Dit is de keerzijde van goedkope internationale productie.</text>
  </svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE BUILDERS
// ═══════════════════════════════════════════════════════════════════════════
function sectionDivider(pres, { kicker, title, subtitle, notes }) {
  const s = pres.addSlide({ masterName: "DARK_HERO" });
  s.addText(kicker.toUpperCase(), {
    x: 0.6, y: 1.5, w: 8.8, h: 0.4,
    ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6,
  });
  s.addText(title, {
    x: 0.6, y: 1.95, w: 8.8, h: 2.0,
    ...T.heroDark, fontSize: 44, charSpacing: -2, lineSpacingMultiple: 1.0,
  });
  s.addShape("rect", { x: 0.6, y: 4.05, w: 0.6, h: 0.04, fill: { color: PC.coral } });
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.6, y: 4.2, w: 8.8, h: 1.0,
      ...T.subheadDark, fontFace: FONT_SERIF, italic: true, fontSize: 17,
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
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.cloud, align: "center",
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
  pres.title = "3.4.4 Internationale productieketens";

  defineMasters(pres, {
    darkLabel: "PARAGRAAF  ·  §3.4",
    lightLabel: "§ 3.4  ·  INTERNATIONALE MARKTEN",
  });

  // Render all SVGs
  const svgs = {
    world:       svgWorldRoutes(),
    smile:       svgSmileCurve(),
    chain:       svgProductionChain(),
    tradeoff:    svgOffshoringTradeoff(),
    costs:       svgCostComparison(),
    voorwaarden: svgVoorwaarden(),
    disruption:  svgDisruption(),
  };
  const imgs = {};
  for (const [k, v] of Object.entries(svgs)) imgs[k] = await svgData(v, 1440);

  // ────────────────────────────────────────────────────────────────────
  // DIA 1 — Cinematic opener
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addImage({ data: imgs.world, x: 0, y: 3.25, w: 10, h: 2.28 });

    s.addText("§ 3.4.4", {
      x: 0.6, y: 0.5, w: 4, h: 0.4,
      ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6,
    });
    s.addText("Internationale\nproductieketens", {
      x: 0.6, y: 0.95, w: 8.8, h: 2.0,
      ...T.heroDark, fontSize: 46, charSpacing: -2, lineSpacingMultiple: 1.0,
    });
    s.addText("Hoofdstuk 4 · Internationale markten  ·  Praktische Economie VWO", {
      x: 0.6, y: 2.85, w: 8.8, h: 0.35,
      fontFace: FONT_SERIF, fontSize: 14, italic: true, color: PC.cloud,
    });

    s.addNotes("Welkom. Elk product dat je dagelijks gebruikt — telefoon, laptop, kleding — heeft een wereldreis achter de rug voordat het in Nederland ligt. Vandaag ontrafelen we die reis.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 2 — Pull quote opener
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("\u201C", {
      x: 0.6, y: 0.5, w: 2, h: 2,
      fontFace: FONT_SERIF, fontSize: 200, bold: true, color: PC.coral, charSpacing: -5,
    });
    s.addText("Designed in California,\nassembled in China.", {
      x: 1.8, y: 1.2, w: 8, h: 2.4,
      fontFace: FONT_DISPLAY, fontSize: 44, bold: true, color: PC.chalk, charSpacing: -2, lineSpacingMultiple: 1.1,
    });
    s.addText("De tekst op de achterkant van elke iPhone.", {
      x: 1.8, y: 3.8, w: 8, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.amber,
    });
    s.addText("Waarom staat het ontwerpland apart van het assemblageland?", {
      x: 1.8, y: 4.35, w: 8, h: 0.4,
      fontFace: FONT_SANS, fontSize: 16, color: PC.cloud,
    });
    s.addNotes("Laat deze zin even hangen. Bijna elk elektronisch product draagt zo'n tekst. Het verklapt meteen: de productie is versnipperd over de wereld. Dit is de kernvraag van de les.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 3 — Leerdoelen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Wat ga je leren",
      title: "Vier vaardigheden voor één uur",
      subtitle: "Na deze paragraaf begrijp je waarom en hoe productie over de wereld verdeeld wordt.",
      notes: "Vier leerdoelen. Elk komt terug in oefeningen en toets.",
    });
    const doelen = [
      { n: "01", t: "Internationale productieketen herkennen", sub: "welke landen doen welke stap?", col: PC.indigo },
      { n: "02", t: "Waarom internationaal produceren?", sub: "comparatief voordeel, schaal, lagere kosten", col: PC.coral },
      { n: "03", t: "Voorwaarden voor productieketens", sub: "communicatie, transport, coördinatie, stabiliteit", col: PC.amberDeep },
      { n: "04", t: "Kosten vergelijken: internationaal vs. nationaal", sub: "inclusief transactiekosten", col: PC.teal },
    ];
    doelen.forEach((d, i) => {
      const y = 2.05 + i * 0.72;
      s.addShape("rect", { x: 0.5, y, w: 9, h: 0.64,
        fill: { color: PC.chalk }, line: { color: PC.cloud, width: 0.75 } });
      s.addShape("rect", { x: 0.5, y, w: 0.08, h: 0.64, fill: { color: d.col } });
      s.addText(d.n, {
        x: 0.7, y: y + 0.05, w: 0.95, h: 0.55,
        fontFace: FONT_DISPLAY, fontSize: 26, bold: true, color: d.col, charSpacing: -1, valign: "middle",
      });
      s.addText(d.t, {
        x: 1.7, y: y + 0.04, w: 6.0, h: 0.3,
        fontFace: FONT_SANS, fontSize: 16, bold: true, color: PC.indigo, valign: "middle",
      });
      s.addText(d.sub, {
        x: 1.7, y: y + 0.32, w: 7.6, h: 0.3,
        fontFace: FONT_SERIF, fontSize: 13, italic: true, color: PC.smoke, valign: "middle",
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 4 — Section divider: Wat is het?
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 1",
    title: "Wat is een internationale productieketen?",
    subtitle: "Een product dat in meerdere landen gemaakt wordt — elk land doet de stap waarvoor het het goedkoopst is.",
    notes: "Begin met herkenning. De definitie is simpel: productie verdeeld over landen. De kracht zit in de voorbeelden.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 5 — Definitie: wat is een productieketen?
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Begrip · productieketen",
      title: "Eén product, veel landen",
      notes: "Benadruk: het is niet één bedrijf dat alles doet, het zijn verschillende bedrijven in verschillende landen. Elk doet één stap.",
    });

    // LEFT: definitie
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.sky }, line: { color: PC.cloud, width: 0.75 } });
    s.addText("DEFINITIE", {
      x: 0.7, y: 2.15, w: 4, h: 0.3,
      ...T.labelUpper, color: PC.indigo, fontSize: 11, charSpacing: 3,
    });
    s.addText([
      { text: "Een internationale productieketen", options: { bold: true, color: PC.indigo } },
      { text: " is een productieproces dat verdeeld is over meerdere landen. Elk land maakt het onderdeel waarvoor het de laagste kosten heeft.", options: {} },
    ], {
      x: 0.7, y: 2.55, w: 4, h: 2.1,
      fontFace: FONT_SERIF, fontSize: 16, color: PC.ink, italic: true, lineSpacingMultiple: 1.25,
    });
    s.addShape("rect", { x: 0.7, y: 4.72, w: 0.4, h: 0.03, fill: { color: PC.coral } });
    s.addText("Ook wel: global value chain", {
      x: 0.7, y: 4.8, w: 4, h: 0.3,
      fontFace: FONT_SANS, fontSize: 12, color: PC.coralDeep, italic: true,
    });

    // RIGHT: iPhone voorbeeld
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.indigo } });
    s.addText("VOORBEELD · iPHONE", {
      x: 5.3, y: 2.15, w: 4, h: 0.3,
      ...T.labelUpper, color: PC.amber, fontSize: 11, charSpacing: 3,
    });
    s.addText([
      { text: "Ontwerp", options: { bold: true, color: PC.chalk, fontSize: 16 } },
      { text: "  →  Verenigde Staten\n", options: { color: PC.cloud, fontSize: 15 } },
      { text: "Chips", options: { bold: true, color: PC.chalk, fontSize: 16 } },
      { text: "  →  Taiwan (TSMC)\n", options: { color: PC.cloud, fontSize: 15 } },
      { text: "Geheugen", options: { bold: true, color: PC.chalk, fontSize: 16 } },
      { text: "  →  Zuid-Korea\n", options: { color: PC.cloud, fontSize: 15 } },
      { text: "Assemblage", options: { bold: true, color: PC.chalk, fontSize: 16 } },
      { text: "  →  China (Foxconn)\n", options: { color: PC.cloud, fontSize: 15 } },
      { text: "Verkoop", options: { bold: true, color: PC.chalk, fontSize: 16 } },
      { text: "  →  wereldwijd\n", options: { color: PC.cloud, fontSize: 15 } },
    ], {
      x: 5.3, y: 2.55, w: 4, h: 2.5,
      fontFace: FONT_SANS, lineSpacingMultiple: 1.35,
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 6 — Production chain flow (SVG)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.chain, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Loop de laptop-keten langs: Ontwerp (VS) → Chips (Taiwan) → Batterij (Korea) → Behuizing (Vietnam) → Assemblage (China) → Distributie (NL). Zes landen, vier continenten. De kosten komen uit op €480 — in Nederland zou hetzelfde product €650 kosten, 35% meer.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 7 — Hero stat: 6 landen · 1 laptop
  // ────────────────────────────────────────────────────────────────────
  heroStat(pres, {
    kicker: "EEN LAPTOP · TOT DE KLANT",
    stat: "6 landen",
    subtitle: "vier continenten, één product",
    body: "Bijna elk elektronisch product heeft zo'n wereldreis achter de rug.",
    notes: "Laat de cijfer hangen. Vraag de klas: wie zou er geweten hebben dat er zes landen nodig zijn voor één laptop? De schaal verrast leerlingen vrijwel altijd.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 8 — Section divider: Waarom?
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 2",
    title: "Waarom zo ingewikkeld?",
    subtitle: "Drie redenen waarom bedrijven de productie uit elkaar trekken.",
    notes: "De logica erachter. Waarom al die moeite als één land het ook zou kunnen? Antwoord in drie woorden: voordeel, schaal, kosten.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 9 — Drie redenen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "De drie drijvende krachten",
      title: "Waarom bedrijven internationaal produceren",
      notes: "Drie redenen. Comparatief voordeel (verschillende landen zijn goed in verschillende dingen), schaalvoordelen (één grote fabriek voor alle iPhones is goedkoper dan duizend kleine), lagere totale kosten (het saldo van alle deelvoordelen).",
    });
    const redenen = [
      {
        n: "01", kicker: "VOORDEEL PER ONDERDEEL",
        title: "Comparatief voordeel",
        body: "Elk land maakt wat het relatief het goedkoopst kan. Taiwan heeft kennis voor chips. Vietnam heeft lage lonen voor assemblage.",
        col: PC.indigo,
      },
      {
        n: "02", kicker: "ÉÉN ONDERDEEL, VEEL STUKS",
        title: "Schaalvoordelen",
        body: "Grote gespecialiseerde fabrieken voor één onderdeel produceren veel goedkoper per stuk dan kleine algemene fabrieken.",
        col: PC.coral,
      },
      {
        n: "03", kicker: "DE OPTELSOM",
        title: "Lagere totale kosten",
        body: "Internationaal: €480 per laptop. Alleen in Nederland: €650. Dat is 35% verschil — de besparing zit in elke schakel.",
        col: PC.amberDeep,
      },
    ];
    const cardW = 2.95, cardH = 3.1, gap = 0.13, startX = 0.5, y = 2.0;
    redenen.forEach((r, i) => {
      const x = startX + i * (cardW + gap);
      s.addShape("rect", { x, y, w: cardW, h: cardH,
        fill: { color: PC.chalk }, line: { color: PC.cloud, width: 0.5 } });
      s.addShape("rect", { x, y, w: cardW, h: 0.08, fill: { color: r.col } });
      s.addText(r.n, {
        x: x + 0.2, y: y + 0.25, w: cardW - 0.4, h: 0.55,
        fontFace: FONT_DISPLAY, fontSize: 34, bold: true, color: r.col, charSpacing: -1,
      });
      s.addText(r.kicker, {
        x: x + 0.2, y: y + 0.82, w: cardW - 0.4, h: 0.3,
        ...T.labelUpper, color: PC.ash, fontSize: 10, charSpacing: 2,
      });
      s.addText(r.title, {
        x: x + 0.2, y: y + 1.1, w: cardW - 0.4, h: 0.5,
        fontFace: FONT_DISPLAY, fontSize: 19, bold: true, color: PC.indigo, charSpacing: -0.5, lineSpacingMultiple: 1.1,
      });
      s.addText(r.body, {
        x: x + 0.2, y: y + 1.75, w: cardW - 0.4, h: 1.3,
        fontFace: FONT_SERIF, fontSize: 13, italic: true, color: PC.ink, lineSpacingMultiple: 1.35,
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 10 — Smile curve (SVG)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.smile, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("De smile curve laat zien waar in de keten de toegevoegde waarde zit. Hoog aan beide uiteinden (R&D en merk/retail), laag in het midden (assemblage). Het iPhone-voorbeeld: Apple retail-prijs rond €1000, assemblage China captureert slechts ~€6 per toestel. Verdiepingsvraag: welke kant wil Nederland bezetten?");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 11 — iPhone value capture hero stat
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("APPLE iPHONE · TOEGEVOEGDE WAARDE", {
      x: 0.6, y: 0.7, w: 8.8, h: 0.35,
      ...T.labelUpper, color: PC.coral, fontSize: 12, charSpacing: 5,
    });
    s.addText("Van €1000 verkoopprijs...", {
      x: 0.6, y: 1.15, w: 8.8, h: 0.6,
      ...T.headlineDark, fontSize: 24,
    });

    // Two contrasting stats side by side
    s.addShape("rect", { x: 0.6, y: 1.95, w: 4.3, h: 3.1, fill: { color: PC.indigoMid } });
    s.addText("APPLE (VS)", {
      x: 0.8, y: 2.1, w: 3.9, h: 0.3,
      ...T.labelUpper, color: PC.amber, fontSize: 11, charSpacing: 3,
    });
    s.addText("~€350", {
      x: 0.6, y: 2.4, w: 4.3, h: 1.5,
      fontFace: FONT_DISPLAY, fontSize: 96, bold: true, color: PC.chalk, align: "center", charSpacing: -3,
    });
    s.addText("ontwerp, merk, software", {
      x: 0.6, y: 3.85, w: 4.3, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 15, italic: true, color: PC.cloud, align: "center",
    });
    s.addText("per toestel aan winst", {
      x: 0.6, y: 4.25, w: 4.3, h: 0.4,
      fontFace: FONT_SANS, fontSize: 14, color: PC.amber, align: "center",
    });

    s.addShape("rect", { x: 5.1, y: 1.95, w: 4.3, h: 3.1, fill: { color: PC.coralDeep } });
    s.addText("FOXCONN (CHINA)", {
      x: 5.3, y: 2.1, w: 3.9, h: 0.3,
      ...T.labelUpper, color: PC.amber, fontSize: 11, charSpacing: 3,
    });
    s.addText("~€6", {
      x: 5.1, y: 2.4, w: 4.3, h: 1.5,
      fontFace: FONT_DISPLAY, fontSize: 96, bold: true, color: PC.chalk, align: "center", charSpacing: -3,
    });
    s.addText("assemblage, inpakken", {
      x: 5.1, y: 3.85, w: 4.3, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 15, italic: true, color: PC.cloud, align: "center",
    });
    s.addText("per toestel aan loon", {
      x: 5.1, y: 4.25, w: 4.3, h: 0.4,
      fontFace: FONT_SANS, fontSize: 14, color: PC.amber, align: "center",
    });

    s.addNotes("Dit contrast is de kernboodschap van de smile curve. Apple houdt €350 per telefoon over — China vangt €6. Wie ontwerp en merk bezit, bezit de waarde. Wie assembleert, bezit dunne marges.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 12 — Section divider: Voorwaarden
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 3",
    title: "Waarom nu pas?",
    subtitle: "Internationale ketens zijn pas sinds circa 1990 mogelijk. Vier voorwaarden maken ze werkbaar.",
    notes: "Historisch perspectief. Vóór de jaren 80 was wereldproductie te duur. Goedkope communicatie (internet), goedkope zeecontainers, IT-systemen en stabiele handelsverdragen maakten het mogelijk.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 13 — Voorwaarden (SVG grid)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.voorwaarden, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Vier voorwaarden. Zonder één ervan werkt de keten niet: (1) communicatie — internet maakt coördinatie tussen continenten mogelijk, (2) transport — containerschepen en luchtvracht drukken kosten, (3) coördinatie — IT-systemen en just-in-time planning, (4) stabiliteit — handelsverdragen (WTO), vrede, open grenzen. Het is geen toeval dat globalisering pas na 1990 echt opkwam.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 14 — Section divider: Kosten vergelijken
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 4",
    title: "Loont het eigenlijk wel?",
    subtitle: "Kosten vergelijken: internationaal vs. nationaal — inclusief transactiekosten.",
    notes: "Vaardigheid 4. We rekenen het door voor een laptop. Maar let op: transactiekosten (transport, communicatie, coördinatie) maken het verschil kleiner dan de bruto besparing suggereert.",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 15 — Kostenvergelijking SVG
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.costs, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("De staafdiagram laat zien: internationaal €480 versus NL €650. Besparing €170, oftewel 35%. Maar: transactiekosten komen er nog bij. Volgende dia rekent die mee.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 16 — Stappenplan berekening (werkvoorbeeld)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Werkvoorbeeld · laptop",
      title: "Stappenplan: loont internationaal produceren?",
      subtitle: "In vier stappen van losse kostenposten naar winstmarge.",
      notes: "Loop stap voor stap. Stap 1 en 2 zijn optellen per keten. Stap 3 is de ruwe besparing. Stap 4 voegt transactiekosten (8%) toe en vergelijkt met verkoopprijs €600.",
    });

    const steps = [
      { n: "01", title: "Kosten internationaal optellen", body: "Chips €200 + Batterij €150 + Behuizing €80 + Montage €50 = €480", col: PC.indigo },
      { n: "02", title: "Kosten nationaal optellen",       body: "Chips €120 + Batterij €180 + Behuizing €200 + Montage €150 = €650", col: PC.coral },
      { n: "03", title: "Bruto besparing bepalen",         body: "€650 − €480 = €170  ·  dat is 35,4 % lagere kosten", col: PC.amberDeep },
      { n: "04", title: "Transactiekosten (8 %) meenemen", body: "€480 × 1,08 = €518,40 totale kostprijs  ·  winst = €600 − €518 = €82", col: PC.teal },
    ];
    steps.forEach((st, i) => {
      const y = 2.0 + i * 0.78;
      s.addShape("rect", { x: 0.5, y, w: 9, h: 0.7,
        fill: { color: PC.chalk }, line: { color: PC.cloud, width: 0.5 } });
      s.addShape("rect", { x: 0.5, y, w: 0.08, h: 0.7, fill: { color: st.col } });
      s.addText(st.n, {
        x: 0.72, y: y + 0.05, w: 0.95, h: 0.6,
        fontFace: FONT_DISPLAY, fontSize: 26, bold: true, color: st.col, charSpacing: -1, valign: "middle",
      });
      s.addText(st.title, {
        x: 1.8, y: y + 0.05, w: 7.3, h: 0.3,
        fontFace: FONT_SANS, fontSize: 15, bold: true, color: PC.indigo, valign: "middle",
      });
      s.addText(st.body, {
        x: 1.8, y: y + 0.35, w: 7.3, h: 0.3,
        fontFace: FONT_MONO, fontSize: 13, color: PC.smoke, valign: "middle",
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 17 — Section divider: Offshoring / reshoring
  // ────────────────────────────────────────────────────────────────────
  sectionDivider(pres, {
    kicker: "Deel 5",
    title: "Dichtbij of ver weg?",
    subtitle: "Offshoring, nearshoring, reshoring — en de prijs van kwetsbaarheid.",
    notes: "Na COVID en het chiptekort is deze trade-off urgent. Lage kosten ver weg? Of hogere kosten dichtbij met minder risico?",
  });

  // ────────────────────────────────────────────────────────────────────
  // DIA 18 — Offshoring trade-off (SVG scatter)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.tradeoff, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Scatter: horizontaal kostenvoordeel, verticaal kwetsbaarheid. Verre offshoring (China, Vietnam): goedkoop maar kwetsbaar. Nearshoring (Oost-Europa): minder korting maar minder risico. Reshoring: productie terug naar huis. Trade-off langs de stippellijn.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 19 — Disruption (SVG: broken chain)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.disruption, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Ketenrisico in beeld. Bovenste rij: normaal. Onderste rij: chiptekort 2021 — één schakel breekt, de hele keten valt stil. Autofabrieken in Europa moesten hun productie tijdelijk stilleggen omdat er geen chips meer kwamen uit Taiwan. Gevolgen: productie stopt, prijzen stijgen, levertijden lopen op.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 20 — Valkuilen
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Denkfouten",
      title: "Twee valkuilen die in elke toets terugkomen.",
      notes: "Twee klassieke fouten. Benadruk elk.",
    });
    const items = [
      { num: "01",
        claim: "Internationaal produceren is altijd goedkoper",
        truth: "Niet per se! Transactiekosten (transport, communicatie, coördinatie) kunnen de besparing grotendeels opeten. En bij verstoringen kunnen de kosten fors oplopen." },
      { num: "02",
        claim: "Productieketens zijn een oud verschijnsel",
        truth: "Onjuist. Internationale productieketens zijn pas mogelijk sinds goedkope communicatie (internet) en goedkoop zeetransport (containers). Vóór circa 1990 was het technisch onhaalbaar." },
    ];
    items.forEach((it, i) => {
      const y = 2.0 + i * 1.55;
      s.addShape("rect", { x: 0.5, y, w: 9, h: 1.45,
        fill: { color: PC.chalk }, line: { color: PC.coral, width: 1 } });
      s.addShape("rect", { x: 0.5, y, w: 0.08, h: 1.45, fill: { color: PC.coral } });
      s.addText(it.num, {
        x: 0.7, y: y + 0.2, w: 0.95, h: 0.6,
        fontFace: FONT_DISPLAY, fontSize: 28, bold: true, color: PC.coral, charSpacing: -0.5,
      });
      s.addText([
        { text: "\u201C" + it.claim + "\u201D", options: { fontFace: FONT_SERIF, fontSize: 15, italic: true, color: PC.coralDeep, bold: true, breakLine: true } },
        { text: it.truth, options: { fontFace: FONT_SANS, fontSize: 13, color: PC.ink } },
      ], {
        x: 1.75, y: y + 0.12, w: 7.1, h: 1.28,
        lineSpacingMultiple: 1.35, valign: "top",
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 21 — Samenvatting (dark hero)
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
      { n: "01", t: "Internationale productieketen = productie verdeeld over landen" },
      { n: "02", t: "Drijfveer: elk land doet wat het relatief goedkoopst kan" },
      { n: "03", t: "Smile curve: waarde zit aan de uiteinden (R&D en merk), niet in de assemblage" },
      { n: "04", t: "Voorwaarden: communicatie, transport, coördinatie, stabiliteit" },
      { n: "05", t: "Internationaal €480 vs NL €650 — let op transactiekosten (8%)" },
      { n: "06", t: "Hoe langer de keten, hoe groter het ketenrisico (COVID, chiptekort)" },
    ];
    items.forEach((it, i) => {
      const y = 1.85 + i * 0.52;
      s.addText(it.n, {
        x: 0.6, y, w: 0.9, h: 0.5,
        fontFace: FONT_DISPLAY, fontSize: 22, bold: true, color: PC.coral, charSpacing: -1,
      });
      s.addText(it.t, {
        x: 1.45, y: y + 0.05, w: 8.1, h: 0.45,
        fontFace: FONT_SANS, fontSize: 15, color: PC.chalk, valign: "middle",
      });
      if (i < items.length - 1) {
        s.addShape("rect", { x: 0.6, y: y + 0.48, w: 8.8, h: 0.005, fill: { color: PC.indigoSoft } });
      }
    });
    s.addNotes("Retrieval: laat leerlingen de 6 punten aan elkaar uitleggen zonder dia. Wie struikelt, gaat terug naar dat concept.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 22 — Closing quote
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("\u201C", {
      x: 0.6, y: 0.5, w: 2, h: 2,
      fontFace: FONT_SERIF, fontSize: 180, bold: true, color: PC.coral, charSpacing: -5,
    });
    s.addText("De wereld is één fabriek —\nmaar niet zonder kwetsbaarheid.", {
      x: 1.6, y: 1.3, w: 8.2, h: 2.4,
      fontFace: FONT_DISPLAY, fontSize: 38, bold: true, color: PC.chalk, charSpacing: -1.5, lineSpacingMultiple: 1.15,
    });
    s.addText("Volgende paragraaf: de rol van de overheid bij internationale handel.", {
      x: 1.6, y: 3.9, w: 8.2, h: 0.5,
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.amber,
    });
    s.addNotes("Afsluiter. De kernboodschap: globale productie is efficiënt én kwetsbaar. Beide kanten blijven relevant. Kondig volgende les aan.");
  }

  // ────────────────────────────────────────────────────────────────────
  // OUTPUT
  // ────────────────────────────────────────────────────────────────────
  const outDir = path.resolve(__dirname, "../../../output/3.4.4");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const svgDir = path.join(outDir, "svg");
  if (!fs.existsSync(svgDir)) fs.mkdirSync(svgDir, { recursive: true });
  for (const [k, v] of Object.entries(svgs)) {
    fs.writeFileSync(path.join(svgDir, `344-${k}.svg`), v, "utf8");
  }

  const outPath = path.join(outDir, "3.4.4 Internationale productieketens – presentatie.pptx");
  await pres.writeFile({ fileName: outPath });
  const fix = await fixPptxFile(outPath);
  roundtripWithLibreOffice(outPath);
  console.log(`PPTX written to ${outPath} (fix: -${fix.removedOverrides} phantom overrides, -${fix.removedEmptyDirs} empty dirs; roundtripped via LibreOffice)`);
}

build().catch(e => { console.error(e); process.exit(1); });
