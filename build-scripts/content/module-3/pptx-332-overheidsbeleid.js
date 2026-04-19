/**
 * pptx-332-creative.js — §3.3.2 Overheidsbeleid
 * CREATIVE version — news headlines, hero stats, small multiples, burden split.
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
// SVG VISUALS
// ═══════════════════════════════════════════════════════════════════════════

// Four news-style headline cards — opener
function svgHeadlineStack() {
  const items = [
    { source: "NOS", date: "14 MRT 2026", h: "Vliegtaks naar €29,40: kabinet wil schoner vliegen", tag: "BELASTING", tagCol: SC.coralDeep },
    { source: "NRC",     date: "02 FEB 2026", h: "Kabinet verhoogt minimumloon opnieuw — werkgevers vrezen banenverlies", tag: "MINIMUMPRIJS", tagCol: SC.amberDeep },
    { source: "VOLKSKRANT", date: "21 JAN 2026", h: "Huurplafond geldt nu ook voor vrije sector — lange wachtlijsten dreigen", tag: "MAXIMUMPRIJS", tagCol: SC.indigoMid },
    { source: "FD",      date: "05 DEC 2025", h: "Subsidie warmtepomp loopt door: ook in 2026 tot €2.950 terug", tag: "SUBSIDIE", tagCol: SC.tealDeep },
  ];
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Vier stukjes beleid uit recente krantenkoppen", "WAT SPEELT ER?")}

    ${items.map((it, i) => {
      const y = 150 + i * 108;
      return `
        <rect x="80" y="${y}" width="1120" height="92" rx="10" fill="${SC.chalk}" stroke="${SC.cloud}" stroke-width="1"/>
        <!-- Source badge -->
        <rect x="80" y="${y}" width="6" height="92" fill="${it.tagCol}"/>
        <text x="110" y="${y + 28}" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="3">${it.source}  ·  ${it.date}</text>
        <text x="110" y="${y + 62}" font-family="${FONT_SERIF}" font-size="22" fill="${SC.ink}" font-weight="700">${it.h}</text>
        <!-- Instrument tag (right) -->
        <rect x="1010" y="${y + 28}" width="160" height="32" rx="16" fill="${it.tagCol}"/>
        <text x="1090" y="${y + 49}" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="#ffffff" letter-spacing="2">${it.tag}</text>
      `;
    }).join("")}
  </svg>`;
}

// Four-instrument overview (editorial card grid)
function svgFourInstrumentsOverview() {
  const items = [
    { x: 80,   title: "Maximumprijs", keyLine: "Pmax &lt; P*",   body: "de overheid zet een prijsplafond",       example: "huurplafond",          color: SC.indigo,     dark: true },
    { x: 385,  title: "Subsidie",     keyLine: "A omlaag",       body: "prijs daalt, hoeveelheid stijgt",         example: "warmtepomp, vaccinatie", color: SC.teal,      dark: false },
    { x: 690,  title: "Accijns",      keyLine: "A omhoog",       body: "prijs stijgt, hoeveelheid daalt",         example: "tabak, alcohol",        color: SC.amberDeep, dark: false },
    { x: 995,  title: "Minimumprijs", keyLine: "Pmin &gt; P*",   body: "de overheid zet een prijsbodem",           example: "minimumloon, melk",     color: SC.coralDeep, dark: true },
  ];
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Vier prijsinstrumenten van de overheid", "OVERZICHT")}

    <!-- Axis under the cards showing the continuum -->
    <line x1="150" y1="570" x2="1150" y2="570" stroke="${SC.cloud}" stroke-width="1.5"/>
    <text x="150" y="598" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="2">PRIJS LAGER DAN MARKT  ←</text>
    <text x="1150" y="598" text-anchor="end" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="2">→  PRIJS HOGER DAN MARKT</text>
    <circle cx="650" cy="570" r="5" fill="${SC.ink}"/>
    <text x="650" y="598" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ink}">marktprijs P*</text>

    ${items.map(c => `
      <rect x="${c.x}" y="150" width="280" height="400" rx="14" fill="${SC.chalk}" stroke="${c.color}" stroke-width="2"/>
      <rect x="${c.x}" y="150" width="280" height="80" fill="${c.color}" rx="14"/>
      <rect x="${c.x}" y="214" width="280" height="16" fill="${c.color}"/>
      <text x="${c.x + 140}" y="200" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">${c.title}</text>

      <text x="${c.x + 140}" y="278" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="28" font-weight="700" fill="${c.color}" letter-spacing="-1">${c.keyLine}</text>

      <line x1="${c.x + 40}" y1="312" x2="${c.x + 240}" y2="312" stroke="${c.color}" stroke-width="2"/>

      ${(() => {
        // Wrap body into up to 2 lines
        const words = c.body.split(" ");
        const mid = Math.ceil(words.length / 2);
        const l1 = words.slice(0, mid).join(" ");
        const l2 = words.slice(mid).join(" ");
        return `<text x="${c.x + 140}" y="360" text-anchor="middle" font-family="Georgia, serif" font-size="17" font-style="italic" fill="${SC.ink}">${l1}</text>
                <text x="${c.x + 140}" y="386" text-anchor="middle" font-family="Georgia, serif" font-size="17" font-style="italic" fill="${SC.ink}">${l2}</text>`;
      })()}

      <text x="${c.x + 140}" y="490" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="3">VOORBEELD</text>
      <text x="${c.x + 140}" y="518" text-anchor="middle" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.ink}">${c.example}</text>

      <!-- Vertical tick on continuum axis -->
      <line x1="${c.x + 140}" y1="560" x2="${c.x + 140}" y2="580" stroke="${c.color}" stroke-width="2"/>
    `).join("")}
  </svg>`;
}

// Minimumprijs annotated chart
function svgMinimumprijs() {
  const w = 1280, h = 640;
  const px = 140, py = 140, pw = 860, ph = 400;
  const qMax = 55, pMax = 55;
  const qToX = q => px + (q / qMax) * pw;
  const pToY = p => py + ph - (p / pMax) * ph;

  const v1x = qToX(0), v1y = pToY(50), v2x = qToX(50), v2y = pToY(0);
  const a1x = qToX(0), a1y = pToY(10), a2x = qToX(40), a2y = pToY(50);
  const pMin = 40, qV = 10, qA = 30;
  const yPmin = pToY(pMin);
  const xV = qToX(qV), xA = qToX(qA);
  const xEq = qToX(20), yEq = pToY(30);

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Pmin boven P*: het aanbodoverschot waar niemand op zit te wachten", "MINIMUMPRIJS")}

    <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py+ph}" x2="${px+pw+10}" y2="${py+ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <text x="${px - 50}" y="${py + ph/2}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 50}, ${py + ph/2})">Prijs (€)</text>
    <text x="${px + pw/2}" y="${py + ph + 48}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle">Hoeveelheid Q</text>

    <!-- Aanbodoverschot rectangle with hatching -->
    <defs>
      <pattern id="hatch-min" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="${SC.coralDeep}" stroke-width="1.4"/>
      </pattern>
    </defs>
    <rect x="${xV}" y="${yPmin - 30}" width="${xA - xV}" height="30" fill="url(#hatch-min)" stroke="${SC.coralDeep}" stroke-width="1.5"/>

    <!-- Dashed refs -->
    <line x1="${xEq}" y1="${yEq}" x2="${xEq}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yEq}" x2="${xEq}" y2="${yEq}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xV}" y1="${yPmin}" x2="${xV}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xA}" y1="${yPmin}" x2="${xA}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>

    <!-- Curves -->
    <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${SC.indigo}" stroke-width="3"/>
    <text x="${v2x - 30}" y="${v2y - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.indigo}">V</text>
    <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${SC.olive}" stroke-width="3"/>
    <text x="${a2x + 10}" y="${a2y - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.olive}">A</text>

    <!-- Pmin line -->
    <line x1="${px}" y1="${yPmin}" x2="${px + pw}" y2="${yPmin}" stroke="${SC.coralDeep}" stroke-width="2.5" stroke-dasharray="10,5"/>
    <text x="${px + pw - 60}" y="${yPmin - 8}" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.coralDeep}">Pmin</text>

    <!-- Dots -->
    <circle cx="${xV}" cy="${yPmin}" r="8" fill="${SC.indigo}"/>
    <circle cx="${xA}" cy="${yPmin}" r="8" fill="${SC.olive}"/>
    <circle cx="${xEq}" cy="${yEq}" r="5" fill="${SC.ash}" opacity="0.7"/>

    <!-- Axis labels -->
    <text x="${px - 10}" y="${yPmin + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.coralDeep}" font-weight="700">€40</text>
    <text x="${px - 10}" y="${yEq + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">€30</text>
    <text x="${xV}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.indigo}" font-weight="600">Q_V = 10</text>
    <text x="${xEq}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">Q* = 20</text>
    <text x="${xA}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.olive}" font-weight="600">Q_A = 30</text>

    <!-- Callout: aanbodoverschot -->
    <g>
      <rect x="${xV - 100}" y="${yPmin - 100}" width="280" height="62" rx="10" fill="${SC.coralDeep}"/>
      <text x="${xV - 80}" y="${yPmin - 72}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="2">AANBODOVERSCHOT</text>
      <text x="${xV - 80}" y="${yPmin - 50}" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="#ffffff">20 eenheden</text>
      <line x1="${xV + 60}" y1="${yPmin - 38}" x2="${(xV + xA)/2}" y2="${yPmin - 20}" stroke="${SC.coralDeep}" stroke-width="1.8"/>
    </g>

    <rect x="140" y="580" width="1000" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="160" y="606" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="#ffffff">Aanbieders willen veel leveren, consumenten kopen weinig — wie koopt het overschot?</text>
  </svg>`;
}

// Maximumprijs annotated (spiegelbeeld)
function svgMaximumprijs() {
  const w = 1280, h = 640;
  const px = 140, py = 140, pw = 860, ph = 400;
  const qMax = 55, pMax = 55;
  const qToX = q => px + (q / qMax) * pw;
  const pToY = p => py + ph - (p / pMax) * ph;

  const v1x = qToX(0), v1y = pToY(50), v2x = qToX(50), v2y = pToY(0);
  const a1x = qToX(0), a1y = pToY(10), a2x = qToX(40), a2y = pToY(50);
  const pMax_ = 20, qA = 10, qV = 30;
  const yPmax = pToY(pMax_);
  const xA = qToX(qA), xV = qToX(qV);
  const xEq = qToX(20), yEq = pToY(30);

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Pmax onder P*: het tekort waar iedereen achteraan gaat", "MAXIMUMPRIJS")}

    <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py+ph}" x2="${px+pw+10}" y2="${py+ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <text x="${px - 50}" y="${py + ph/2}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 50}, ${py + ph/2})">Prijs (€)</text>
    <text x="${px + pw/2}" y="${py + ph + 48}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle">Hoeveelheid Q</text>

    <defs>
      <pattern id="hatch-max" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="${SC.coralDeep}" stroke-width="1.4"/>
      </pattern>
    </defs>
    <rect x="${xA}" y="${yPmax}" width="${xV - xA}" height="30" fill="url(#hatch-max)" stroke="${SC.coralDeep}" stroke-width="1.5"/>

    <line x1="${xEq}" y1="${yEq}" x2="${xEq}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yEq}" x2="${xEq}" y2="${yEq}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xA}" y1="${yPmax}" x2="${xA}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xV}" y1="${yPmax}" x2="${xV}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>

    <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${SC.indigo}" stroke-width="3"/>
    <text x="${v2x - 30}" y="${v2y - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.indigo}">V</text>
    <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${SC.olive}" stroke-width="3"/>
    <text x="${a2x + 10}" y="${a2y - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.olive}">A</text>

    <line x1="${px}" y1="${yPmax}" x2="${px + pw}" y2="${yPmax}" stroke="${SC.indigo}" stroke-width="2.5" stroke-dasharray="10,5"/>
    <text x="${px + pw - 70}" y="${yPmax + 20}" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.indigo}">Pmax</text>

    <circle cx="${xA}" cy="${yPmax}" r="8" fill="${SC.olive}"/>
    <circle cx="${xV}" cy="${yPmax}" r="8" fill="${SC.indigo}"/>
    <circle cx="${xEq}" cy="${yEq}" r="5" fill="${SC.ash}" opacity="0.7"/>

    <text x="${px - 10}" y="${yPmax + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.indigo}" font-weight="700">€20</text>
    <text x="${px - 10}" y="${yEq + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">€30</text>
    <text x="${xA}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.olive}" font-weight="600">Q_A = 10</text>
    <text x="${xEq}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">Q* = 20</text>
    <text x="${xV}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.indigo}" font-weight="600">Q_V = 30</text>

    <g>
      <rect x="${xA + 30}" y="${yPmax + 60}" width="280" height="62" rx="10" fill="${SC.coralDeep}"/>
      <text x="${xA + 50}" y="${yPmax + 88}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="2">VRAAGOVERSCHOT (TEKORT)</text>
      <text x="${xA + 50}" y="${yPmax + 110}" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="#ffffff">20 eenheden</text>
      <line x1="${(xA + xV)/2}" y1="${yPmax + 30}" x2="${xA + 130}" y2="${yPmax + 60}" stroke="${SC.coralDeep}" stroke-width="1.8"/>
    </g>

    <rect x="140" y="580" width="1000" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="160" y="606" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="#ffffff">Meer vraag dan aanbod — wachtlijsten, zwarte markt, kwaliteitsverlies.</text>
  </svg>`;
}

// Minimumloon annotated
function svgMinimumloon() {
  const w = 1280, h = 640;
  const px = 140, py = 140, pw = 860, ph = 400;
  const lMax = 80, wMax = 45;
  const lToX = l => px + (l / lMax) * pw;
  const wToY = wv => py + ph - (wv / wMax) * ph;

  const v1x = lToX(0), v1y = wToY(40), v2x = lToX(80), v2y = wToY(0);
  const a1x = lToX(0), a1y = wToY(10), a2x = lToX(60), a2y = wToY(40);
  const wMin = 30, lVraag = 20, lAanbod = 40;
  const yWmin = wToY(wMin);
  const xV = lToX(lVraag), xA = lToX(lAanbod);
  const xEq = lToX(30), yEq = wToY(25);

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Minimumloon boven het evenwichtsloon — hoe werkloosheid ontstaat", "ARBEIDSMARKT")}

    <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py+ph}" x2="${px+pw+10}" y2="${py+ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <text x="${px - 50}" y="${py + ph/2}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 50}, ${py + ph/2})">Loon (W)</text>
    <text x="${px + pw/2}" y="${py + ph + 48}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle">Arbeid L (aantal werknemers)</text>

    <defs>
      <pattern id="hatch-ml" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="${SC.coralDeep}" stroke-width="1.4"/>
      </pattern>
    </defs>
    <rect x="${xV}" y="${yWmin - 30}" width="${xA - xV}" height="30" fill="url(#hatch-ml)" stroke="${SC.coralDeep}" stroke-width="1.5"/>

    <line x1="${xEq}" y1="${yEq}" x2="${xEq}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yEq}" x2="${xEq}" y2="${yEq}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xV}" y1="${yWmin}" x2="${xV}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xA}" y1="${yWmin}" x2="${xA}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>

    <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${SC.indigo}" stroke-width="3"/>
    <text x="${v2x - 40}" y="${v2y - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.indigo}">V_a</text>
    <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${SC.olive}" stroke-width="3"/>
    <text x="${a2x + 10}" y="${a2y - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.olive}">A_a</text>

    <line x1="${px}" y1="${yWmin}" x2="${px + pw}" y2="${yWmin}" stroke="${SC.coralDeep}" stroke-width="2.5" stroke-dasharray="10,5"/>
    <text x="${px + pw - 70}" y="${yWmin - 10}" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.coralDeep}">Wmin</text>

    <circle cx="${xV}" cy="${yWmin}" r="8" fill="${SC.indigo}"/>
    <circle cx="${xA}" cy="${yWmin}" r="8" fill="${SC.olive}"/>
    <circle cx="${xEq}" cy="${yEq}" r="5" fill="${SC.ash}" opacity="0.7"/>

    <text x="${px - 10}" y="${yWmin + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.coralDeep}" font-weight="700">€30</text>
    <text x="${px - 10}" y="${yEq + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">€25</text>
    <text x="${xV}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.indigo}" font-weight="600">L_V = 20</text>
    <text x="${xEq}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">L* = 30</text>
    <text x="${xA}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.olive}" font-weight="600">L_A = 40</text>

    <g>
      <rect x="${xV - 60}" y="${yWmin - 100}" width="280" height="62" rx="10" fill="${SC.coralDeep}"/>
      <text x="${xV - 40}" y="${yWmin - 72}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="2">WERKLOOSHEID</text>
      <text x="${xV - 40}" y="${yWmin - 50}" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="#ffffff">20 werknemers</text>
      <line x1="${xV + 80}" y1="${yWmin - 38}" x2="${(xV + xA)/2}" y2="${yWmin - 20}" stroke="${SC.coralDeep}" stroke-width="1.8"/>
    </g>
  </svg>`;
}

// Burden-split stacked column chart — much clearer than S/D for accijns burden
function svgBurdenSplit() {
  const w = 1280, h = 640;
  const cx = 640;

  // Before: price 10, all consumer; After: price 13 to consumer, producer receives 7, tax = 6 wedge
  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Wie draagt de accijns? De last wordt gedeeld.", "BURDEN SPLIT")}

    <!-- Two stacked columns side by side -->
    <!-- Labels -->
    <text x="330" y="170" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.ash}" letter-spacing="3">VOOR DE ACCIJNS</text>
    <text x="950" y="170" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.ash}" letter-spacing="3">NA DE ACCIJNS</text>

    <!-- Before column: price €10, all to producer (no tax) -->
    <!-- producer revenue segment -->
    <rect x="260" y="260" width="140" height="260" fill="${SC.olive}"/>
    <text x="330" y="400" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="32" font-weight="700" fill="#ffffff">€10</text>
    <text x="330" y="430" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="#ffffff" letter-spacing="0">ONTVANGT</text>

    <!-- Before label under -->
    <text x="330" y="550" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" fill="${SC.smoke}">markt­prijs: <tspan font-weight="700" fill="${SC.ink}">€10</tspan></text>

    <!-- After column: consumer pays €13 (top), split into producer €7 + tax €6 -->
    <!-- Calculate heights proportionally to €13 vs €10 scale (use same scaling) -->
    <!-- Top segment: tax €6 amber -->
    <rect x="880" y="260" width="140" height="156" fill="${SC.amber}"/>
    <text x="950" y="348" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="28" font-weight="700" fill="${SC.amberDeep}">€6</text>
    <text x="950" y="372" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" fill="${SC.amberDeep}" letter-spacing="1" font-weight="700">ACCIJNS → OVERHEID</text>

    <!-- Bottom segment: producer receives €7 olive -->
    <rect x="880" y="416" width="140" height="182" fill="${SC.olive}"/>
    <text x="950" y="508" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="28" font-weight="700" fill="#ffffff">€7</text>
    <text x="950" y="530" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" fill="#ffffff" letter-spacing="0" font-weight="700">ONTVANGT</text>

    <!-- After label under -->
    <text x="950" y="622" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" fill="${SC.smoke}">consument betaalt: <tspan font-weight="700" fill="${SC.ink}">€13</tspan></text>

    <!-- Arrow between columns -->
    <g transform="translate(470,370)">
      <line x1="0" y1="20" x2="340" y2="20" stroke="${SC.coralDeep}" stroke-width="3" stroke-linecap="round"/>
      <polyline points="320,8 340,20 320,32" fill="none" stroke="${SC.coralDeep}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="170" y="10" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.coralDeep}" font-weight="700" letter-spacing="2">ACCIJNS t = €6</text>
    </g>

    <!-- Burden annotations -->
    <g>
      <!-- Consumer burden: +€3 (from €10 to €13) -->
      <line x1="1040" y1="260" x2="1080" y2="260" stroke="${SC.coralDeep}" stroke-width="1.8"/>
      <line x1="1080" y1="260" x2="1080" y2="330" stroke="${SC.coralDeep}" stroke-width="1.8"/>
      <line x1="1040" y1="330" x2="1080" y2="330" stroke="${SC.coralDeep}" stroke-width="1.8"/>
      <rect x="1090" y="278" width="160" height="40" rx="6" fill="${SC.coralDeep}"/>
      <text x="1170" y="302" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="1">CONSUMENT: +€3</text>
    </g>
    <g>
      <!-- Producer burden: −€3 (from €10 to €7) -->
      <line x1="1040" y1="416" x2="1080" y2="416" stroke="${SC.indigo}" stroke-width="1.8"/>
      <line x1="1080" y1="416" x2="1080" y2="490" stroke="${SC.indigo}" stroke-width="1.8"/>
      <line x1="1040" y1="490" x2="1080" y2="490" stroke="${SC.indigo}" stroke-width="1.8"/>
      <rect x="1090" y="438" width="160" height="40" rx="6" fill="${SC.indigo}"/>
      <text x="1170" y="462" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff" letter-spacing="1">PRODUCENT: −€3</text>
    </g>

    <!-- Reference: old price dashed line -->
    <line x1="260" y1="416" x2="1020" y2="416" stroke="${SC.ash}" stroke-width="1" stroke-dasharray="5,4"/>
    <text x="220" y="420" text-anchor="end" font-family="${FONT_SANS}" font-size="11" fill="${SC.ash}" font-style="italic">oude prijs €10</text>
  </svg>`;
}

// Subsidie — supply shift down
function svgSubsidie() {
  const w = 1280, h = 640;
  const px = 140, py = 140, pw = 860, ph = 400;
  const qMax = 22, pMax = 22;
  const qToX = q => px + (q / qMax) * pw;
  const pToY = p => py + ph - (p / pMax) * ph;

  // V: P = 20 - Q ; A: P = Q ; A' = Q - 4
  const v1x = qToX(0), v1y = pToY(20), v2x = qToX(20), v2y = pToY(0);
  const a1x = qToX(0), a1y = pToY(0), a2x = qToX(20), a2y = pToY(20);
  const an1x = qToX(4), an1y = pToY(0), an2x = qToX(20), an2y = pToY(16);

  const xOld = qToX(10), yOld = pToY(10);
  const xNew = qToX(12), yNew = pToY(8);
  const yProd = pToY(12);

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Subsidie: aanbod omlaag, prijs daalt, iedereen wint — maar wie betaalt?", "SUBSIDIE")}

    <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${px}" y1="${py+ph}" x2="${px+pw+10}" y2="${py+ph}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <text x="${px - 50}" y="${py + ph/2}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 50}, ${py + ph/2})">Prijs (€)</text>
    <text x="${px + pw/2}" y="${py + ph + 48}" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}" text-anchor="middle">Hoeveelheid Q</text>

    <!-- Subsidiekosten -->
    <rect x="${px}" y="${yProd}" width="${xNew - px}" height="${yNew - yProd}" fill="${SC.teal}" fill-opacity="0.28"/>
    <text x="${(px + xNew)/2}" y="${(yProd + yNew)/2 + 5}" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.tealDeep}">subsidiekosten</text>

    <!-- Dashed refs -->
    <line x1="${xOld}" y1="${yOld}" x2="${xOld}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yOld}" x2="${xOld}" y2="${yOld}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${xNew}" y1="${yNew}" x2="${xNew}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yNew}" x2="${xNew}" y2="${yNew}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
    <line x1="${px}" y1="${yProd}" x2="${xNew}" y2="${yProd}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>

    <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${SC.indigo}" stroke-width="3"/>
    <text x="${v2x + 10}" y="${v2y - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.indigo}">V</text>

    <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${SC.olive}" stroke-width="2.5" stroke-dasharray="8,5" opacity="0.75"/>
    <text x="${a2x + 10}" y="${a2y + 6}" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${SC.olive}" opacity="0.9">A (oud)</text>

    <line x1="${an1x}" y1="${an1y}" x2="${an2x}" y2="${an2y}" stroke="${SC.teal}" stroke-width="3"/>
    <text x="${an2x + 10}" y="${an2y - 10}" font-family="${FONT_SANS}" font-size="16" font-weight="700" fill="${SC.teal}">A − subsidie</text>

    <!-- Shift arrow down -->
    <g>
      <line x1="${qToX(15)}" y1="${pToY(13)}" x2="${qToX(15)}" y2="${pToY(13) + 70}" stroke="${SC.tealDeep}" stroke-width="2.4" marker-end="url(#ah-smoke)"/>
      <text x="${qToX(15) + 10}" y="${pToY(13) + 40}" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.tealDeep}">shift</text>
    </g>

    <circle cx="${xOld}" cy="${yOld}" r="8" fill="${SC.olive}" opacity="0.85"/>
    <circle cx="${xNew}" cy="${yNew}" r="8" fill="${SC.tealDeep}"/>

    <text x="${px - 10}" y="${pToY(20) + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">€20</text>
    <text x="${px - 10}" y="${yProd + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">€12</text>
    <text x="${px - 10}" y="${yOld + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">€10</text>
    <text x="${px - 10}" y="${yNew + 5}" text-anchor="end" font-family="${FONT_SANS}" font-size="13" fill="${SC.tealDeep}" font-weight="700">€8</text>
    <text x="${xOld}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.smoke}">10</text>
    <text x="${xNew}" y="${py + ph + 22}" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" fill="${SC.tealDeep}" font-weight="700">12</text>

    <rect x="140" y="580" width="1000" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="160" y="606" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="#ffffff">Subsidie s = €4: consument betaalt €8, producent ontvangt €12, overheid legt €48 bij.</text>
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
  pres.title = "3.3.2 Overheidsbeleid";
  defineMasters(pres);

  const svgs = {
    headlines:   svgHeadlineStack(),
    overview:    svgFourInstrumentsOverview(),
    minPrijs:    svgMinimumprijs(),
    maxPrijs:    svgMaximumprijs(),
    minLoon:     svgMinimumloon(),
    burden:      svgBurdenSplit(),
    subsidie:    svgSubsidie(),
  };
  const imgs = {};
  for (const [k, v] of Object.entries(svgs)) imgs[k] = await svgData(v, 1440);

  // Helper: section divider
  const sectionDivider = ({ kicker, title, subtitle, notes }) => {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText(kicker.toUpperCase(), { x: 0.6, y: 1.9, w: 8.8, h: 0.4, ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6 });
    s.addText(title, { x: 0.6, y: 2.35, w: 8.8, h: 1.3, ...T.heroDark, fontSize: 56, charSpacing: -2 });
    if (subtitle) s.addText(subtitle, { x: 0.6, y: 3.85, w: 8.8, h: 0.6, ...T.subheadDark, fontFace: FONT_SERIF, italic: true });
    s.addShape("rect", { x: 0.6, y: 3.6, w: 0.6, h: 0.04, fill: { color: PC.coral } });
    if (notes) s.addNotes(notes);
    return s;
  };

  const editorial = ({ kicker, title, subtitle, notes }) => {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    if (kicker) s.addText(kicker.toUpperCase(), { x: 0.5, y: 0.3, w: 9, h: 0.3, ...T.labelUpper, color: PC.coral, fontSize: 11, charSpacing: 4 });
    s.addText(title, { x: 0.5, y: 0.6, w: 9, h: 0.8, ...T.displayLight, fontSize: 32, charSpacing: -1 });
    if (subtitle) s.addText(subtitle, { x: 0.5, y: 1.35, w: 9, h: 0.4, ...T.subheadLight, fontFace: FONT_SERIF, italic: true });
    if (notes) s.addNotes(notes);
    return s;
  };

  // ── 1: Title ──────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("§ 3.3.2", { x: 0.6, y: 0.5, w: 4, h: 0.4, ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6 });
    s.addText("Overheidsbeleid", { x: 0.6, y: 1.0, w: 8.8, h: 1.6, ...T.heroDark, fontSize: 80, charSpacing: -3 });
    s.addText("Hoe de overheid markten stuurt via de prijs", { x: 0.6, y: 2.8, w: 8.8, h: 0.6,
      fontFace: FONT_SERIF, fontSize: 22, italic: true, color: PC.cloud });
    // Decorative divider
    s.addShape("rect", { x: 0.6, y: 3.6, w: 0.8, h: 0.04, fill: { color: PC.coral } });
    s.addText("Hoofdstuk 3 · Overheid  ·  Praktische Economie VWO", { x: 0.6, y: 3.75, w: 8.8, h: 0.4, fontFace: FONT_SERIF, fontSize: 14, italic: true, color: PC.cloud });
    s.addNotes("Deze paragraaf: vier concrete prijsinstrumenten. Minimumprijs, maximumprijs, accijns, subsidie. We beginnen met waar ze in het nieuws verschijnen.");
  }

  // ── 2: News headlines opener ──────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.headlines, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Vier koppen uit de Nederlandse pers. Laat de klas even raden: welk instrument speelt er in elke kop? (vliegtaks=belasting, minimumloon=minimumprijs, huurplafond=maximumprijs, warmtepomp=subsidie).");
  }

  // ── 3: Pull quote ─────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("\u201C", { x: 0.6, y: 0.7, w: 2, h: 2, fontFace: FONT_SERIF, fontSize: 220, bold: true, color: PC.coral });
    s.addText("De overheid kan de prijs\nniet afschaffen —\nmaar wel duwen.", { x: 1.8, y: 1.4, w: 8, h: 3,
      fontFace: FONT_DISPLAY, fontSize: 56, bold: true, color: PC.chalk, charSpacing: -2, lineSpacingMultiple: 1.05 });
    s.addText("De rode draad van deze paragraaf.", { x: 1.8, y: 4.5, w: 8, h: 0.4, fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.amber });
    s.addNotes("De kern: geen enkele overheid kan een markt 'afschaffen'. Maar met prijzen kan ze wel duwen in een richting die meer welvaart oplevert.");
  }

  // ── 4: Leerdoelen ─────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "SIDEBAR" });
    s.addText("LEERDOELEN", { x: 0.15, y: 0.4, w: 1.7, h: 0.3, ...T.labelUpper, color: PC.coral, fontSize: 10, charSpacing: 3 });
    s.addText("Vijf vaardigheden", { x: 0.15, y: 0.75, w: 1.7, h: 1.6,
      fontFace: FONT_DISPLAY, fontSize: 16, bold: true, color: PC.chalk, charSpacing: -0.3 });
    s.addText("Na vandaag weet je wat een prijsmaatregel bindend maakt — en welk ongewenst neveneffect erbij hoort.",
      { x: 0.15, y: 2.5, w: 1.7, h: 2, fontFace: FONT_SERIF, fontSize: 11, italic: true, color: PC.cloud, lineSpacingMultiple: 1.4 });
    const doelen = [
      "Begrijpen waarom de overheid ingrijpt",
      "Minimumprijs en maximumprijs analyseren",
      "Minimumloon toepassen op de arbeidsmarkt",
      "Het effect van een accijns uitleggen (burden split)",
      "Het effect van een subsidie analyseren",
    ];
    doelen.forEach((d, i) => {
      const y = 0.7 + i * 0.85;
      s.addText(`0${i+1}`, { x: 2.3, y, w: 0.8, h: 0.6,
        fontFace: FONT_DISPLAY, fontSize: 38, bold: true, color: PC.coral, charSpacing: -2 });
      s.addText(d, { x: 3.2, y: y + 0.1, w: 6.5, h: 0.5, fontFace: FONT_SANS, fontSize: 17, color: PC.ink, valign: "middle" });
      if (i < doelen.length - 1) s.addShape("rect", { x: 2.3, y: y + 0.75, w: 7.4, h: 0.008, fill: { color: PC.cloud } });
    });
  }

  // ── 5: Four instruments overview ──────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.overview, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("De vier instrumenten in één oogopslag. Links: prijs onder de markt (Pmax, subsidie). Rechts: prijs boven de markt (accijns, Pmin). Elk krijgt zijn eigen dia.");
  }

  // ── 6: Section MINIMUMPRIJS ───────────────────────────────────────
  sectionDivider({ kicker: "Deel 1", title: "Minimumprijs", subtitle: "Als de overheid een prijsbodem legt — boeren, werknemers, en de wet.",
    notes: "De overheid beschermt producenten/werknemers tegen te lage prijzen. Klassiek voorbeeld: melkgarantieprijs + minimumloon." });

  // ── 7: Minimumprijs grafiek ───────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.minPrijs, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Pmin=40. Bij die prijs wordt Q=10 gevraagd (consumenten haken af), maar Q=30 aangeboden (aanbieders stromen toe). Verschil = aanbodoverschot.");
  }

  // ── 8: Minimumprijs — wanneer bindend + voorbeeld melk ────────────
  {
    const s = editorial({ kicker: "Mechanisme", title: "Een prijsbodem is alleen bindend als hij boven P* ligt.", notes: "De ezelsbrug: Pmin werkt alleen omhoog. Onder P* verandert er niets." });
    // Left: rule card
    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.sky } });
    s.addText("REGEL", { x: 0.7, y: 2.15, w: 3.9, h: 0.3, ...T.labelUpper, color: PC.indigo, fontSize: 11, charSpacing: 3 });
    s.addText([
      { text: "Pmin > P*", options: { bold: true, color: PC.coralDeep, fontSize: 32, fontFace: FONT_DISPLAY, breakLine: true } },
      { text: "→ bindend, aanbodoverschot\n\n", options: { color: PC.ink, fontSize: 15, breakLine: true } },
      { text: "Pmin < P*", options: { bold: true, color: PC.ash, fontSize: 32, fontFace: FONT_DISPLAY, breakLine: true } },
      { text: "→ niet bindend, markt mag boven uitkomen", options: { color: PC.smoke, fontSize: 15, italic: true } },
    ], { x: 0.7, y: 2.5, w: 3.9, h: 2.5, lineSpacingMultiple: 1.3 });

    // Right: voorbeeld melk (dark)
    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.indigo } });
    s.addText("KLASSIEK VOORBEELD", { x: 5.3, y: 2.15, w: 4, h: 0.3, ...T.labelUpper, color: PC.amber, fontSize: 11, charSpacing: 3 });
    s.addText("De melkgarantieprijs", { x: 5.3, y: 2.5, w: 4, h: 0.5, fontFace: FONT_DISPLAY, fontSize: 22, bold: true, color: PC.chalk, charSpacing: -0.5 });
    s.addText([
      { text: "In de jaren '80 kocht de EEG het melkoverschot op.\n\n", options: {} },
      { text: "Resultaat:", options: { bold: true, color: PC.amber, breakLine: true } },
      { text: "de beruchte ‘boterberg’ en ‘melkplas’ — miljarden euro's opgeslagen.", options: { italic: true, fontFace: FONT_SERIF } },
    ], { x: 5.3, y: 3.1, w: 4, h: 2, fontFace: FONT_SANS, fontSize: 13, color: PC.cloud, lineSpacingMultiple: 1.4 });
  }

  // ── 9: Section MAXIMUMPRIJS ───────────────────────────────────────
  sectionDivider({ kicker: "Deel 2", title: "Maximumprijs", subtitle: "Als de overheid een prijsplafond legt — huurders, farma, oorlog.",
    notes: "Spiegelbeeld van Pmin: overheid beschermt consumenten. Voorbeelden: huurplafond, max-prijs voor urgente medicijnen, rantsoenering in oorlogstijd." });

  // ── 10: Maximumprijs grafiek ──────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.maxPrijs, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Pmax=20 onder P*=30. Vraag stijgt naar 30, aanbod zakt naar 10. Tekort = 20. De wachtlijsten beginnen.");
  }

  // ── 11: Maximumprijs — ongewenste effecten ────────────────────────
  {
    const s = editorial({ kicker: "De keerzijde", title: "Wat gebeurt er als de prijs niet mag stijgen?",
      notes: "Drie bekende neveneffecten. Bij elk: vraag de klas om een Nederlands voorbeeld." });
    const effs = [
      { num: "01", title: "Wachtlijsten", desc: "De prijs kan niet schaars maken — iets anders moet dat doen. Vaak: wachttijd." },
      { num: "02", title: "Zwarte markt", desc: "Wie écht wil, betaalt buiten de regel om. Zie huur in Amsterdam." },
      { num: "03", title: "Kwaliteitsverlies", desc: "Aanbieders leveren minder goed product — de prijs kan toch niet verder omlaag." },
    ];
    effs.forEach((e, i) => {
      const x = 0.5 + i * 3.13, y = 2.1, w = 2.95, h = 3;
      s.addShape("rect", { x, y, w, h, fill: { color: PC.chalk }, line: { color: PC.coral, width: 1 } });
      s.addShape("rect", { x, y, w, h: 0.06, fill: { color: PC.coral } });
      s.addText(e.num, { x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.5,
        fontFace: FONT_DISPLAY, fontSize: 38, bold: true, color: PC.coral, charSpacing: -2 });
      s.addText(e.title, { x: x + 0.2, y: y + 0.85, w: w - 0.4, h: 0.5, fontFace: FONT_DISPLAY, fontSize: 20, bold: true, color: PC.indigo });
      s.addText(e.desc, { x: x + 0.2, y: y + 1.45, w: w - 0.4, h: 1.4,
        fontFace: FONT_SERIF, fontSize: 14, italic: true, color: PC.ink, lineSpacingMultiple: 1.4 });
    });
  }

  // ── 12: Section MINIMUMLOON ───────────────────────────────────────
  sectionDivider({ kicker: "Deel 3", title: "Minimumloon", subtitle: "De minimumprijs op de arbeidsmarkt — bescherming en een bijwerking.",
    notes: "Minimumloon is een minimumprijs — maar nu op de arbeidsmarkt. Zelfde logica, andere variabelen." });

  // ── 13: Minimumloon grafiek ───────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.minLoon, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Bij Wmin=30: bedrijven vragen 20 arbeiders, 40 willen werken. Werkloosheid=20. Let op: dit zijn dezelfde mechanismen als de melkgarantieprijs.");
  }

  // ── 14: Minimumloon — voordeel/nadeel ─────────────────────────────
  {
    const s = editorial({ kicker: "Afweging", title: "Minimumloon — wie wint, wie verliest?",
      notes: "Geen eenvoudig oordeel. De afweging is politiek én economisch." });

    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.goodBg }, line: { color: PC.goodInk, width: 1 } });
    s.addText("VOORDEEL", { x: 0.7, y: 2.15, w: 3.9, h: 0.3, ...T.labelUpper, color: PC.goodInk, fontSize: 11, charSpacing: 3 });
    s.addText("Wie werkt verdient genoeg", { x: 0.7, y: 2.5, w: 3.9, h: 0.6,
      fontFace: FONT_DISPLAY, fontSize: 22, bold: true, color: PC.goodInk, charSpacing: -0.5 });
    s.addText([
      { text: "Bescherming tegen uitbuiting aan de onderkant van de arbeidsmarkt.\n\n", options: {} },
      { text: "Winnaars:", options: { bold: true, color: PC.goodInk, breakLine: true } },
      { text: "werknemers met een laag loon die hun baan houden.", options: { italic: true, fontFace: FONT_SERIF } },
    ], { x: 0.7, y: 3.2, w: 3.9, h: 1.8, fontFace: FONT_SANS, fontSize: 13, color: PC.ink, lineSpacingMultiple: 1.4 });

    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.badBg }, line: { color: PC.coralDeep, width: 1 } });
    s.addText("NADEEL", { x: 5.3, y: 2.15, w: 3.9, h: 0.3, ...T.labelUpper, color: PC.coralDeep, fontSize: 11, charSpacing: 3 });
    s.addText("Werkloosheid neemt toe", { x: 5.3, y: 2.5, w: 3.9, h: 0.6,
      fontFace: FONT_DISPLAY, fontSize: 22, bold: true, color: PC.coralDeep, charSpacing: -0.5 });
    s.addText([
      { text: "Bedrijven vragen minder arbeid bij een hoger loon.\n\n", options: {} },
      { text: "Verliezers:", options: { bold: true, color: PC.coralDeep, breakLine: true } },
      { text: "vooral jongeren en laagopgeleiden die helemaal geen baan vinden.", options: { italic: true, fontFace: FONT_SERIF } },
    ], { x: 5.3, y: 3.2, w: 3.9, h: 1.8, fontFace: FONT_SANS, fontSize: 13, color: PC.ink, lineSpacingMultiple: 1.4 });
  }

  // ── 15: Section ACCIJNS ──────────────────────────────────────────
  sectionDivider({ kicker: "Deel 4", title: "Accijns", subtitle: "Een belasting per eenheid — en de vraag wie haar écht betaalt.",
    notes: "Accijns = belasting die de overheid per eenheid heft. Klassiek: tabak, alcohol, brandstof. De truc: prijs stijgt NIET met het volle accijnsbedrag." });

  // ── 16: Hero stat — vliegtaks €29,40 ─────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("VLIEGTAKS  ·  2024", { x: 0.6, y: 1.0, w: 8.8, h: 0.4, ...T.labelUpper, color: PC.coral, fontSize: 13, charSpacing: 6 });
    s.addText("€29,40", { x: 0.3, y: 1.45, w: 9.4, h: 2.4, fontFace: FONT_DISPLAY, fontSize: 220, bold: true, color: PC.chalk, charSpacing: -8, align: "center" });
    s.addText("per ticket bij vertrek uit Nederland", { x: 0.6, y: 3.95, w: 8.8, h: 0.5, ...T.subheadDark, fontSize: 22, align: "center" });
    s.addText("\u201CHet doel: luchtvaart afremmen en externe kosten inprijzen.\u201D", { x: 1.5, y: 4.45, w: 7, h: 0.6, fontFace: FONT_SERIF, fontSize: 15, italic: true, color: PC.cloud, align: "center" });
    s.addNotes("De vliegtaks is bijna verdrievoudigd sinds 2021 (€7,50). Kabinet-Schoof stelde verdere verhoging voor in 2026. Voor studenten: dit is de klassieke casus voor accijns = Pigou-belasting.");
  }

  // ── 17: Burden split ─────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.burden, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("De KERNINZICHT van deze paragraaf. Voor accijns: consument betaalt €10, producent ontvangt €10. Na accijns (€6): consument betaalt €13 (+3), producent ontvangt €7 (-3). Geen 50/50 split — hangt af van elasticiteit.");
  }

  // ── 18: Section SUBSIDIE ─────────────────────────────────────────
  sectionDivider({ kicker: "Deel 5", title: "Subsidie", subtitle: "Spiegelbeeld van de accijns — en een creditnota van de overheid.",
    notes: "Subsidie = negatieve belasting. Alles werkt precies andersom. Hoeveelheid omhoog, prijs omlaag, beiden winnen, overheid betaalt." });

  // ── 19: Subsidie grafiek ─────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.subsidie, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Subsidie s=€4. Consument betaalt €8 (was €10). Producent ontvangt €12 (was €10). Overheid legt €4 × 12 = €48 bij. De subsidiekosten zijn de gele rechthoek.");
  }

  // ── 20: Valkuilen ────────────────────────────────────────────────
  {
    const s = editorial({ kicker: "Denkfouten", title: "Drie valkuilen die bij de toets altijd terugkomen.",
      notes: "De klassieker is valkuil 2: 'prijs stijgt met het volle accijnsbedrag'. Fout — de burden split maakt de prijsstijging kleiner." });
    const items = [
      { num: "01", claim: "Een minimumprijs helpt altijd",
        truth: "Alleen bindend als Pmin > P*. En er ontstaat een aanbodoverschot waar niemand op zit te wachten." },
      { num: "02", claim: "De prijs stijgt met het volle accijnsbedrag",
        truth: "De prijsstijging is kleiner dan de accijns — de last wordt gedeeld tussen consument en producent." },
      { num: "03", claim: "Een maximumprijs maakt alles goedkoper voor iedereen",
        truth: "Er ontstaat een tekort — sommigen betalen minder, anderen krijgen het product helemaal niet." },
    ];
    items.forEach((it, i) => {
      const y = 2.05 + i * 1.02;
      s.addShape("rect", { x: 0.5, y, w: 9, h: 0.95, fill: { color: PC.chalk }, line: { color: PC.coral, width: 1 } });
      s.addShape("rect", { x: 0.5, y, w: 0.08, h: 0.95, fill: { color: PC.coral } });
      s.addText(it.num, { x: 0.65, y: y + 0.15, w: 0.9, h: 0.6, fontFace: FONT_DISPLAY, fontSize: 26, bold: true, color: PC.coral, charSpacing: -0.5 });
      s.addText([
        { text: "\u201C" + it.claim + "\u201D", options: { fontFace: FONT_SERIF, fontSize: 14, italic: true, color: PC.coralDeep, bold: true, breakLine: true } },
        { text: it.truth, options: { fontFace: FONT_SANS, fontSize: 12, color: PC.ink } },
      ], { x: 1.65, y: y + 0.1, w: 7.8, h: 0.8, lineSpacingMultiple: 1.3, valign: "top" });
    });
  }

  // ── 21: Closing samenvatting ─────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("De kern", { x: 0.6, y: 0.5, w: 8.8, h: 0.4, ...T.labelUpper, color: PC.coral, fontSize: 13, charSpacing: 6 });
    s.addText("Zes dingen om te onthouden", { x: 0.6, y: 0.9, w: 8.8, h: 0.8, ...T.headlineDark, fontSize: 32, charSpacing: -1 });
    const items = [
      { n: "01", t: "Minimumprijs boven P* → aanbodoverschot" },
      { n: "02", t: "Maximumprijs onder P* → vraagoverschot (tekort)" },
      { n: "03", t: "Minimumloon = minimumprijs op de arbeidsmarkt → werkloosheid" },
      { n: "04", t: "Accijns: A omhoog, prijsstijging < accijnsbedrag (burden split)" },
      { n: "05", t: "Subsidie: A omlaag, prijs omlaag, overheid betaalt het verschil" },
      { n: "06", t: "Prijsmaatregel is alleen bindend als hij het evenwicht blokkeert" },
    ];
    items.forEach((it, i) => {
      const y = 1.85 + i * 0.52;
      s.addText(it.n, { x: 0.6, y, w: 0.6, h: 0.5, fontFace: FONT_DISPLAY, fontSize: 22, bold: true, color: PC.coral });
      s.addText(it.t, { x: 1.2, y: y + 0.05, w: 8.3, h: 0.45, fontFace: FONT_SANS, fontSize: 15, color: PC.chalk, valign: "middle" });
      if (i < items.length - 1) s.addShape("rect", { x: 0.6, y: y + 0.48, w: 8.8, h: 0.005, fill: { color: PC.indigoSoft } });
    });
  }

  const outDir = path.resolve(__dirname, "../../../output/3.3.2");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const svgDir = path.join(outDir, "svg");
  if (!fs.existsSync(svgDir)) fs.mkdirSync(svgDir, { recursive: true });
  for (const [k, v] of Object.entries(svgs)) fs.writeFileSync(path.join(svgDir, `332c-${k}.svg`), v, "utf8");
  const outPath = path.join(outDir, "3.3.2 Overheidsbeleid – presentatie.pptx");
  await pres.writeFile({ fileName: outPath });
  const fix = await fixPptxFile(outPath);
  roundtripWithLibreOffice(outPath);
  console.log(`PPTX written to ${outPath} (fix: -${fix.removedOverrides} phantom overrides, -${fix.removedEmptyDirs} empty dirs; roundtripped via LibreOffice)`);
}

build().catch(e => { console.error(e); process.exit(1); });
