/**
 * pptx-333-creative.js — §3.3.3 Collectieve goederen
 * CREATIVE version — dike cross-section, NL below-sea-level map,
 * recurring meelifter character, illustrated 2x2 matrix.
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
// SVG VISUALS
// ═══════════════════════════════════════════════════════════════════════════

// Illustrated dike cross-section (educational diagram)
function svgDikeCrossSection() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Een dijk: één object, de hele stad beschermd", "COLLECTIEF GOED · CASUS")}

    <!-- Ground line -->
    <line x1="100" y1="460" x2="1180" y2="460" stroke="${SC.ash}" stroke-width="1" stroke-dasharray="3,3"/>
    <text x="100" y="476" font-family="${FONT_SANS}" font-size="11" fill="${SC.ash}" font-style="italic">maaiveld (NAP)</text>

    <!-- Sky gradient -->
    <defs>
      <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${SC.sky}"/>
        <stop offset="1" stop-color="${SC.paper}"/>
      </linearGradient>
      <linearGradient id="water" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${SC.teal}" stop-opacity="0.3"/>
        <stop offset="1" stop-color="${SC.tealDeep}" stop-opacity="0.6"/>
      </linearGradient>
    </defs>

    <!-- Sea (left, higher level) -->
    <rect x="100" y="260" width="400" height="200" fill="url(#water)"/>
    <path d="M100 270 Q150 264 200 270 T300 270 T400 270 T500 270" stroke="${SC.tealDeep}" stroke-width="1.5" fill="none" opacity="0.6"/>
    <path d="M100 285 Q150 279 200 285 T300 285 T400 285 T500 285" stroke="${SC.tealDeep}" stroke-width="1" fill="none" opacity="0.45"/>
    <path d="M100 302 Q180 296 260 302 T420 302 T500 302" stroke="${SC.tealDeep}" stroke-width="1" fill="none" opacity="0.35"/>

    <!-- Waves crashing on dike -->
    <circle cx="520" cy="280" r="10" fill="${SC.tealDeep}" opacity="0.3"/>
    <circle cx="535" cy="290" r="6" fill="${SC.tealDeep}" opacity="0.25"/>

    <!-- Dike (trapezoid cross-section) -->
    <path d="M490 460 L540 300 L640 300 L690 460 Z" fill="${SC.olive}" fill-opacity="0.28" stroke="${SC.oliveDeep}" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- Dike grass top -->
    <path d="M540 300 Q570 290 590 298 Q610 290 640 300" stroke="${SC.oliveDeep}" stroke-width="1.6" fill="none"/>
    <!-- Dike layers (stone core) -->
    <path d="M555 320 L600 310 L625 320 L625 440 L555 440 Z" fill="${SC.ash}" fill-opacity="0.2" stroke="${SC.ash}" stroke-width="0.8"/>
    <text x="590" y="405" text-anchor="middle" font-family="${FONT_SANS}" font-size="10" font-weight="700" fill="${SC.smoke}" letter-spacing="2">DIJK</text>

    <!-- Land (right side, protected area) -->
    <rect x="690" y="420" width="400" height="40" fill="${SC.olive}" fill-opacity="0.15"/>
    <text x="890" y="452" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" fill="${SC.oliveDeep}" font-style="italic">droog land (onder zeeniveau)</text>

    <!-- Houses (protected) -->
    ${[740, 800, 860, 920, 980, 1040, 1100].map((x, i) => {
      const h = 40 + (i * 19) % 30;
      return `<rect x="${x}" y="${420 - h}" width="34" height="${h}" fill="${SC.indigo}"/>
              <polygon points="${x},${420 - h} ${x + 17},${420 - h - 16} ${x + 34},${420 - h}" fill="${SC.coralDeep}"/>
              <rect x="${x + 12}" y="${420 - h + 16}" width="10" height="14" fill="${SC.amber}"/>`;
    }).join("")}

    <!-- Person on top of dike -->
    ${placeIcon(ICON.personOutline(SC.ink), 575, 258, 44)}
    <!-- Sea level arrow with label -->
    <line x1="280" y1="260" x2="280" y2="220" stroke="${SC.coralDeep}" stroke-width="1.8" marker-end="url(#ah-coral)"/>
    <rect x="230" y="190" width="160" height="32" rx="4" fill="${SC.coralDeep}"/>
    <text x="310" y="211" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="#ffffff">zeespiegel</text>

    <!-- Annotation on right: iedereen profiteert -->
    <rect x="740" y="190" width="340" height="58" rx="8" fill="${SC.oliveDeep}"/>
    <text x="760" y="214" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="2">ALLE HUIZEN BESCHERMD</text>
    <text x="760" y="236" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="#ffffff">ook wie niet heeft meebetaald aan de dijk</text>

    <!-- Bottom insight -->
    <rect x="100" y="580" width="1080" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="120" y="606" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="#ffffff">Eén dijk beschermt iedereen — en niemand kan worden uitgesloten.</text>
  </svg>`;
}

// NL map with below-sea-level regions highlighted
function svgNederlandMap() {
  // Simplified abstraction of the Netherlands — blob shape + colored regions for below-sea-level
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Waar zou jij wonen zonder dijken?", "NEDERLAND · ONDER ZEENIVEAU")}

    <!-- Simplified NL outline (stylized) -->
    <g transform="translate(420, 150)">
      <!-- country shape: rough outline of NL -->
      <path d="M50 20
               Q80 5 130 10
               L175 25
               Q220 15 270 30
               L320 35
               L340 60
               L360 120
               L340 180
               L310 230
               L280 280
               L240 320
               L200 345
               L155 340
               L110 320
               L75 290
               L45 260
               L25 210
               L15 160
               L10 110
               L20 65
               Z"
            fill="${SC.paperMid}" stroke="${SC.indigo}" stroke-width="2.5"/>

      <!-- Below-sea-level zones (teal/coral overlay) — stylized polders -->
      <path d="M50 90 L130 80 L180 110 L200 170 L150 200 L90 190 L50 150 Z" fill="${SC.coral}" fill-opacity="0.35" stroke="${SC.coralDeep}" stroke-width="1"/>
      <path d="M130 150 L220 145 L240 200 L200 230 L150 220 Z" fill="${SC.coral}" fill-opacity="0.35" stroke="${SC.coralDeep}" stroke-width="1"/>
      <path d="M180 240 L240 250 L220 290 L170 280 Z" fill="${SC.coral}" fill-opacity="0.35" stroke="${SC.coralDeep}" stroke-width="1"/>

      <!-- Sea -->
      <path d="M-50 60 L25 100 L10 200 L30 300 L-20 320 Z" fill="${SC.tealDeep}" fill-opacity="0.2"/>
      <text x="-10" y="180" font-family="${FONT_SANS}" font-size="14" fill="${SC.tealDeep}" font-style="italic">Noordzee</text>

      <!-- Cities (dots) -->
      <circle cx="130" cy="160" r="5" fill="${SC.ink}"/>
      <text x="140" y="155" font-family="${FONT_SANS}" font-size="11" fill="${SC.ink}" font-weight="600">Amsterdam</text>
      <circle cx="100" cy="210" r="5" fill="${SC.ink}"/>
      <text x="60" y="230" font-family="${FONT_SANS}" font-size="11" fill="${SC.ink}" font-weight="600">Rotterdam</text>
      <circle cx="160" cy="240" r="5" fill="${SC.ink}"/>
      <text x="170" y="244" font-family="${FONT_SANS}" font-size="11" fill="${SC.ink}" font-weight="600">Utrecht</text>
    </g>

    <!-- Big stat on the side -->
    <g transform="translate(50, 200)">
      <text x="0" y="0" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.coral}" letter-spacing="3">ONDER ZEENIVEAU</text>
      <text x="0" y="100" font-family="${FONT_DISPLAY}" font-size="120" font-weight="700" fill="${SC.coralDeep}" letter-spacing="-6">26%</text>
      <text x="0" y="135" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="${SC.ink}">van het Nederlandse grondgebied</text>
      <line x1="0" y1="160" x2="60" y2="160" stroke="${SC.coralDeep}" stroke-width="3"/>
      <text x="0" y="192" font-family="${FONT_SANS}" font-size="14" fill="${SC.smoke}">Daar wonen miljoenen mensen —</text>
      <text x="0" y="212" font-family="${FONT_SANS}" font-size="14" fill="${SC.smoke}">alleen doordat we samen de</text>
      <text x="0" y="232" font-family="${FONT_SANS}" font-size="14" fill="${SC.smoke}">dijken in stand houden.</text>
    </g>

    <!-- Legend -->
    <g transform="translate(900, 450)">
      <rect x="0" y="0" width="16" height="16" fill="${SC.coral}" fill-opacity="0.35" stroke="${SC.coralDeep}"/>
      <text x="24" y="13" font-family="${FONT_SANS}" font-size="12" fill="${SC.ink}">land onder zeeniveau</text>
      <rect x="0" y="28" width="16" height="16" fill="${SC.paperMid}" stroke="${SC.indigo}"/>
      <text x="24" y="41" font-family="${FONT_SANS}" font-size="12" fill="${SC.ink}">land boven zeeniveau</text>
    </g>

    <rect x="100" y="580" width="1080" height="40" rx="6" fill="${SC.indigoDeep}"/>
    <text x="120" y="606" font-family="${FONT_SERIF}" font-size="16" font-style="italic" fill="#ffffff">Zonder collectieve voorziening — geen Amsterdam, geen Rotterdam.</text>
  </svg>`;
}

// 2×2 matrix with illustrated cells
function svgMatrix2x2Illustrated() {
  // 4 cells, each with icon + examples + color coding
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Vier typen goederen — langs twee assen", "TYPOLOGIE")}

    <!-- Column headers -->
    <text x="410" y="180" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="3">RIVALISEREND</text>
    <text x="410" y="200" text-anchor="middle" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">gebruik door één = minder voor ander</text>
    <text x="860" y="180" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="3">NIET-RIVALISEREND</text>
    <text x="860" y="200" text-anchor="middle" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">meer gebruikers, geen extra kosten</text>

    <!-- Row headers (rotated) -->
    <text x="110" y="310" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="3" transform="rotate(-90, 110, 310)">UITSLUITBAAR</text>
    <text x="125" y="310" text-anchor="middle" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}" transform="rotate(-90, 125, 310)">alleen wie betaalt</text>
    <text x="110" y="500" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ash}" letter-spacing="3" transform="rotate(-90, 110, 500)">NIET-UITSLUITBAAR</text>
    <text x="125" y="500" text-anchor="middle" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}" transform="rotate(-90, 125, 500)">iedereen kan erbij</text>

    <!-- Cell 1: Privégoed (uitsluitbaar + rivaliserend) -->
    <rect x="160" y="220" width="500" height="180" rx="10" fill="${SC.sky}" stroke="${SC.indigo}" stroke-width="1.5"/>
    ${placeIcon(ICON.coin(SC.indigoMid), 180, 232, 40)}
    <text x="232" y="260" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="${SC.indigo}">Privégoed</text>
    <text x="232" y="284" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">wie betaalt, gebruikt</text>
    <text x="180" y="332" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="2">VOORBEELDEN</text>
    <text x="180" y="358" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">• auto, ijsje, broodje</text>
    <text x="180" y="380" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">• kleding, telefoon</text>

    <!-- Cell 2: Clubgoed (uitsluitbaar + niet-rivaliserend) -->
    <rect x="660" y="220" width="500" height="180" rx="10" fill="${SC.warnBg}" stroke="${SC.amberDeep}" stroke-width="1.5"/>
    ${placeIcon(ICON.badge(SC.amberDeep, SC.coral), 680, 232, 40)}
    <text x="732" y="260" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="${SC.amberDeep}">Clubgoed</text>
    <text x="732" y="284" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">alleen leden / betalers</text>
    <text x="680" y="332" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="2">VOORBEELDEN</text>
    <text x="680" y="358" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">• Netflix, Spotify</text>
    <text x="680" y="380" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">• betaalde tunnel, bioscoop</text>

    <!-- Cell 3: Gemeenschappelijk goed (niet-uitsluitbaar + rivaliserend) -->
    <rect x="160" y="420" width="500" height="180" rx="10" fill="${SC.badBg}" stroke="${SC.coralDeep}" stroke-width="1.5"/>
    ${placeIcon(ICON.warning(SC.coralDeep), 180, 432, 40)}
    <text x="232" y="460" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="${SC.coralDeep}">Gemeenschappelijk goed</text>
    <text x="232" y="484" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">iedereen erbij, maar raakt op</text>
    <text x="180" y="532" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="2">VOORBEELDEN</text>
    <text x="180" y="558" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">• visgronden, weiland</text>
    <text x="180" y="580" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">• schone lucht</text>

    <!-- Cell 4: Collectief goed (niet-uitsluitbaar + niet-rivaliserend) — HIGHLIGHT -->
    <rect x="660" y="420" width="500" height="180" rx="10" fill="${SC.goodBg}" stroke="${SC.oliveDeep}" stroke-width="3"/>
    ${placeIcon(ICON.badge(SC.oliveDeep, SC.coral), 680, 432, 40)}
    <text x="732" y="460" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="${SC.oliveDeep}">Collectief goed</text>
    <text x="732" y="484" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.smoke}">iedereen profiteert, geen extra kosten</text>
    <text x="680" y="532" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.ash}" letter-spacing="2">VOORBEELDEN</text>
    <text x="680" y="558" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">• dijken, defensie</text>
    <text x="680" y="580" font-family="${FONT_SANS}" font-size="14" fill="${SC.ink}">• straatverlichting, politie</text>

    <!-- Callout on cell 4 -->
    <rect x="1060" y="215" width="100" height="24" rx="12" fill="${SC.oliveDeep}" transform="translate(0,0)"/>
    <text x="1110" y="231" text-anchor="middle" font-family="${FONT_SANS}" font-size="10" font-weight="700" fill="#ffffff" letter-spacing="2">FOCUS</text>
    <line x1="1110" y1="239" x2="1110" y2="415" stroke="${SC.oliveDeep}" stroke-width="1.5" stroke-dasharray="4,3"/>
  </svg>`;
}

// Recurring meelifter scene — 4 persons + dike (from original concept, redone)
function svgMeelifterScene() {
  const persons = [
    { x: 220, color: SC.oliveDeep, label: "Anna",  pays: true,  amount: "€400" },
    { x: 470, color: SC.indigo,    label: "Bo",    pays: false, amount: "€0" },
    { x: 720, color: SC.indigo,    label: "Cem",   pays: false, amount: "€0" },
    { x: 970, color: SC.indigo,    label: "Dina",  pays: false, amount: "€0" },
  ];

  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Vier buren, één dijk — wie legt geld op tafel?", "MEELIFTGEDRAG · FREE-RIDER")}

    <!-- Big dike protecting everyone (ellipse as umbrella-style shelter) -->
    <defs>
      <linearGradient id="dikeG" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${SC.oliveDeep}"/>
        <stop offset="1" stop-color="${SC.olive}"/>
      </linearGradient>
    </defs>
    <ellipse cx="595" cy="260" rx="440" ry="44" fill="url(#dikeG)"/>
    <text x="595" y="250" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="#ffffff" letter-spacing="3">DIJK (COLLECTIEF GOED)</text>
    <text x="595" y="272" text-anchor="middle" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.goodBg}">beschermt iedereen — ongeacht wie betaalt</text>

    <!-- Support posts from dike -->
    ${persons.map(p => `<line x1="${p.x}" y1="304" x2="${p.x}" y2="360" stroke="${SC.oliveDeep}" stroke-width="1" stroke-dasharray="4,3" opacity="0.5"/>`).join("")}

    <!-- Persons -->
    ${persons.map(p => `
      <g>
        <!-- head -->
        <circle cx="${p.x}" cy="388" r="22" fill="${p.color}"/>
        <!-- body -->
        <rect x="${p.x - 24}" y="412" width="48" height="66" rx="12" fill="${p.color}"/>
        <!-- legs -->
        <rect x="${p.x - 18}" y="478" width="12" height="34" fill="${p.color}"/>
        <rect x="${p.x + 6}" y="478" width="12" height="34" fill="${p.color}"/>
        <!-- label -->
        <text x="${p.x}" y="540" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.ink}">${p.label}</text>
        <!-- status -->
        <rect x="${p.x - 50}" y="555" width="100" height="30" rx="15" fill="${p.pays ? SC.oliveDeep : SC.coralDeep}"/>
        <text x="${p.x}" y="574" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="#ffffff" letter-spacing="2">${p.pays ? "BETAALT" : "LIFT MEE"}</text>
        <text x="${p.x}" y="603" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="16" font-weight="700" fill="${p.pays ? SC.oliveDeep : SC.coralDeep}">${p.amount}</text>
      </g>
    `).join("")}

    <!-- Euro over Anna -->
    <circle cx="${persons[0].x + 32}" cy="370" r="18" fill="${SC.amber}"/>
    <text x="${persons[0].x + 32}" y="377" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="20" font-weight="700" fill="#ffffff">€</text>

    <!-- Question callout -->
    <g>
      <rect x="${persons[3].x + 30}" y="380" width="230" height="80" rx="10" fill="${SC.indigoDeep}"/>
      <text x="${persons[3].x + 50}" y="408" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="#ffffff">"Waarom zou ik betalen</text>
      <text x="${persons[3].x + 50}" y="428" font-family="${FONT_SERIF}" font-size="15" font-style="italic" fill="#ffffff">als ik tóch profiteer?"</text>
      <text x="${persons[3].x + 50}" y="450" font-family="${FONT_SANS}" font-size="11" fill="${SC.amber}" letter-spacing="2">— het free-rider probleem</text>
    </g>
  </svg>`;
}

// Market faalt → overheid lost op (editorial redesign)
function svgMarktFaalt() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Markt faalt — en waarom de overheid wél kan leveren", "MECHANISME")}

    <!-- LEFT: markt faalt (coral) -->
    <rect x="80" y="150" width="530" height="400" rx="14" fill="${SC.chalk}" stroke="${SC.coral}" stroke-width="1.5"/>
    <rect x="80" y="150" width="530" height="50" fill="${SC.coralDeep}" rx="14"/>
    <rect x="80" y="188" width="530" height="12" fill="${SC.coralDeep}"/>
    <text x="345" y="182" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Markt faalt</text>

    ${[
      { title: "Niet-uitsluitbaar", sub: "iedereen kan het gebruiken" },
      { title: "Meeliften loont", sub: "niemand betaalt vrijwillig" },
      { title: "Geen winst mogelijk", sub: "aanbieder haakt af" },
      { title: "Goed wordt niet geleverd", sub: "welvaartsverlies voor allen", emph: true },
    ].map((r, i) => {
      const y = 230 + i * 72;
      return `
        <rect x="110" y="${y}" width="470" height="56" rx="8" fill="${r.emph ? SC.coralDeep : SC.paper}" stroke="${SC.coral}" stroke-width="1.2"/>
        <text x="130" y="${y + 26}" font-family="${FONT_DISPLAY}" font-size="16" font-weight="700" fill="${r.emph ? '#ffffff' : SC.coralDeep}">${r.title}</text>
        <text x="130" y="${y + 44}" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${r.emph ? SC.goodBg : SC.smoke}">${r.sub}</text>
      `;
    }).join("")}

    <!-- Arrow between -->
    <g transform="translate(620, 350)">
      <line x1="0" y1="0" x2="40" y2="0" stroke="${SC.ink}" stroke-width="3" stroke-linecap="round"/>
      <polyline points="28,-12 40,0 28,12" fill="none" stroke="${SC.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="20" y="-20" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.smoke}" letter-spacing="2">OVERHEID</text>
      <text x="20" y="28" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.smoke}" letter-spacing="2">LOST OP</text>
    </g>

    <!-- RIGHT: overheid lost op (olive) -->
    <rect x="670" y="150" width="530" height="400" rx="14" fill="${SC.chalk}" stroke="${SC.olive}" stroke-width="1.5"/>
    <rect x="670" y="150" width="530" height="50" fill="${SC.oliveDeep}" rx="14"/>
    <rect x="670" y="188" width="530" height="12" fill="${SC.oliveDeep}"/>
    <text x="935" y="182" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="22" font-weight="700" fill="#ffffff">Overheid lost op</text>

    ${[
      { title: "Verplichte belasting", sub: "iedereen betaalt mee" },
      { title: "Meeliften onmogelijk", sub: "belasting is afdwingbaar" },
      { title: "Overheid levert of financiert", sub: "Rijkswaterstaat, defensie, politie" },
      { title: "Goed is beschikbaar", sub: "iedereen profiteert én betaalt", emph: true },
    ].map((r, i) => {
      const y = 230 + i * 72;
      return `
        <rect x="700" y="${y}" width="470" height="56" rx="8" fill="${r.emph ? SC.oliveDeep : SC.paper}" stroke="${SC.olive}" stroke-width="1.2"/>
        <text x="720" y="${y + 26}" font-family="${FONT_DISPLAY}" font-size="16" font-weight="700" fill="${r.emph ? '#ffffff' : SC.oliveDeep}">${r.title}</text>
        <text x="720" y="${y + 44}" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${r.emph ? SC.goodBg : SC.smoke}">${r.sub}</text>
      `;
    }).join("")}
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
  pres.title = "3.3.3 Collectieve goederen";
  defineMasters(pres);

  const svgs = {
    dike:       svgDikeCrossSection(),
    nlMap:      svgNederlandMap(),
    matrix:     svgMatrix2x2Illustrated(),
    meelifter:  svgMeelifterScene(),
    marktFaalt: svgMarktFaalt(),
  };
  const imgs = {};
  for (const [k, v] of Object.entries(svgs)) imgs[k] = await svgData(v, 1440);

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

  // ── 1: Cinematic opener with dike ─────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("§ 3.3.3", { x: 0.6, y: 0.5, w: 4, h: 0.4, ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6 });
    s.addText("Collectieve goederen", { x: 0.6, y: 1.0, w: 8.8, h: 1.8, ...T.heroDark, fontSize: 60, charSpacing: -2, lineSpacingMultiple: 1.0 });
    s.addText("De goederen die de markt niet kan leveren — en wat we er samen mee doen.", { x: 0.6, y: 3.6, w: 8.8, h: 0.8,
      fontFace: FONT_SERIF, fontSize: 20, italic: true, color: PC.cloud });
    s.addShape("rect", { x: 0.6, y: 4.6, w: 0.8, h: 0.04, fill: { color: PC.coral } });
    s.addText("Hoofdstuk 3 · Overheid  ·  Praktische Economie VWO", { x: 0.6, y: 4.7, w: 8.8, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 14, italic: true, color: PC.cloud });
    s.addNotes("Voor Nederlanders is dit misschien wel de meest voelbare vorm van marktfalen: zonder dijken geen Amsterdam. We beginnen met die intuïtie en werken naar de theorie toe.");
  }

  // ── 2: Waar zou jij wonen? (NL map) ───────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.nlMap, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("26% van Nederland ligt onder zeeniveau. Zonder dijken: onbewoonbaar. Wie betaalt eigenlijk die dijken? En waarom kunnen we niet gewoon aan de markt overlaten?");
  }

  // ── 3: Pull quote ─────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("\u201C", { x: 0.6, y: 0.7, w: 2, h: 2, fontFace: FONT_SERIF, fontSize: 220, bold: true, color: PC.coral });
    s.addText("Sommige goederen\nkan de markt\nniet leveren.", { x: 1.8, y: 1.4, w: 8, h: 3,
      fontFace: FONT_DISPLAY, fontSize: 56, bold: true, color: PC.chalk, charSpacing: -2, lineSpacingMultiple: 1.05 });
    s.addText("Dan gaan we ze sámen betalen.", { x: 1.8, y: 4.5, w: 8, h: 0.4, fontFace: FONT_SERIF, fontSize: 18, italic: true, color: PC.amber });
  }

  // ── 4: Leerdoelen ─────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "SIDEBAR" });
    s.addText("LEERDOELEN", { x: 0.15, y: 0.4, w: 1.7, h: 0.3, ...T.labelUpper, color: PC.coral, fontSize: 10, charSpacing: 3 });
    s.addText("Vijf dingen", { x: 0.15, y: 0.75, w: 1.7, h: 1.6, fontFace: FONT_DISPLAY, fontSize: 22, bold: true, color: PC.chalk, charSpacing: -1 });
    s.addText("Na vandaag kun je een collectief goed aanwijzen, en uitleggen waarom alleen de overheid het kan leveren.",
      { x: 0.15, y: 2.5, w: 1.7, h: 2, fontFace: FONT_SERIF, fontSize: 11, italic: true, color: PC.cloud, lineSpacingMultiple: 1.4 });
    const doelen = [
      "De twee eigenschappen van een collectief goed benoemen",
      "Onderscheid maken tussen privé, club, gemeenschappelijk, collectief",
      "Collectief goed herkennen via beslisboom",
      "Uitleggen waarom de markt het niet levert",
      "Het free-rider probleem verklaren",
    ];
    doelen.forEach((d, i) => {
      const y = 0.7 + i * 0.85;
      s.addText(`0${i+1}`, { x: 2.3, y, w: 0.8, h: 0.6, fontFace: FONT_DISPLAY, fontSize: 38, bold: true, color: PC.coral, charSpacing: -2 });
      s.addText(d, { x: 3.2, y: y + 0.1, w: 6.5, h: 0.5, fontFace: FONT_SANS, fontSize: 16, color: PC.ink, valign: "middle" });
      if (i < doelen.length - 1) s.addShape("rect", { x: 2.3, y: y + 0.75, w: 7.4, h: 0.008, fill: { color: PC.cloud } });
    });
  }

  // ── 5: Twee eigenschappen ─────────────────────────────────────────
  {
    const s = editorial({ kicker: "Definitie", title: "Twee eigenschappen samen maken een goed \u2018collectief\u2019.",
      notes: "Allebei nodig — één alleen is niet genoeg. Leg nadruk op 'én'." });

    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.sky }, line: { color: PC.indigo, width: 1 } });
    s.addText("01", { x: 0.7, y: 2.15, w: 1.15, h: 0.7, fontFace: FONT_DISPLAY, fontSize: 40, bold: true, color: PC.indigo, charSpacing: -1 });
    s.addText("Niet-uitsluitbaar", { x: 1.85, y: 2.3, w: 2.95, h: 0.5,
      fontFace: FONT_DISPLAY, fontSize: 20, bold: true, color: PC.indigo, charSpacing: -0.3 });
    s.addText([
      { text: "Je kunt niemand uitsluiten van het gebruik.\n\n", options: { bold: true, breakLine: true } },
      { text: "Een dijk beschermt heel Amsterdam — je kunt niet één bewoner zeggen: \u201Cvoor jou doet ie het niet\u201D.",
        options: { italic: true, fontFace: FONT_SERIF } },
    ], { x: 0.7, y: 3.05, w: 4, h: 2, fontFace: FONT_SANS, fontSize: 14, color: PC.ink, lineSpacingMultiple: 1.4 });

    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.goodBg }, line: { color: PC.oliveDeep, width: 1 } });
    s.addText("02", { x: 5.3, y: 2.15, w: 1.15, h: 0.7, fontFace: FONT_DISPLAY, fontSize: 40, bold: true, color: PC.oliveDeep, charSpacing: -1 });
    s.addText("Niet-rivaliserend", { x: 6.45, y: 2.3, w: 2.95, h: 0.5,
      fontFace: FONT_DISPLAY, fontSize: 20, bold: true, color: PC.oliveDeep, charSpacing: -0.3 });
    s.addText([
      { text: "Gebruik door de één gaat niet ten koste van de ander.\n\n", options: { bold: true, breakLine: true } },
      { text: "Of er 100 of 10.000 mensen achter de dijk wonen — de kosten van de dijk veranderen niet.",
        options: { italic: true, fontFace: FONT_SERIF } },
    ], { x: 5.3, y: 3.05, w: 4, h: 2, fontFace: FONT_SANS, fontSize: 14, color: PC.ink, lineSpacingMultiple: 1.4 });
  }

  // ── 6: Dike cross-section ─────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.dike, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("De dijk: perfect voorbeeld van een collectief goed. Niet-uitsluitbaar (beschermt iedereen), niet-rivaliserend (extra bewoner kost niks).");
  }

  // ── 7: Section MATRIX ─────────────────────────────────────────────
  sectionDivider({ kicker: "Deel 2", title: "De matrix", subtitle: "Vier typen goederen langs twee assen — waarom alleen het laatste \u2018collectief\u2019ís.",
    notes: "De 2×2 is de kern van deze paragraaf. Als je de matrix kent, is de rest afleiding." });

  // ── 8: 2×2 matrix ─────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.matrix, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Alleen rechtsonder — niet-uitsluitbaar ÉN niet-rivaliserend — is echt collectief. De andere drie kan de markt wel leveren.");
  }

  // ── 9: Herken je het? ─────────────────────────────────────────────
  {
    const s = editorial({ kicker: "Test", title: "Wel of geen collectief goed?",
      notes: "Laat leerlingen eerst zelf elke cel indelen. Dan pas antwoord geven." });

    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.goodBg }, line: { color: PC.oliveDeep, width: 1 } });
    s.addText("WEL COLLECTIEF", { x: 0.7, y: 2.15, w: 3.9, h: 0.3, ...T.labelUpper, color: PC.oliveDeep, fontSize: 11, charSpacing: 3 });
    [
      ["Politiesurveillance", "niet uitsluitbaar, niet rivaliserend"],
      ["Straatverlichting", "verlicht voor iedereen, kost niet extra"],
      ["Dijken", "beschermt heel het dorp"],
      ["Defensie", "beschermt alle burgers tegelijk"],
    ].forEach(([t, sub], i) => {
      const y = 2.6 + i * 0.55;
      s.addShape("ellipse", { x: 0.8, y: y + 0.13, w: 0.14, h: 0.14, fill: { color: PC.oliveDeep } });
      s.addText(t, { x: 1.05, y: y, w: 3.7, h: 0.3, fontFace: FONT_SANS, fontSize: 14, bold: true, color: PC.ink });
      s.addText(sub, { x: 1.05, y: y + 0.25, w: 3.7, h: 0.25, fontFace: FONT_SERIF, fontSize: 11, italic: true, color: PC.smoke });
    });

    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.badBg }, line: { color: PC.coralDeep, width: 1 } });
    s.addText("GEEN COLLECTIEF", { x: 5.3, y: 2.15, w: 3.9, h: 0.3, ...T.labelUpper, color: PC.coralDeep, fontSize: 11, charSpacing: 3 });
    [
      ["Beveiligingsdienst", "uitsluitbaar: alleen klanten"],
      ["Privéonderwijs", "uitsluitbaar: collegegeld"],
      ["Huisarts", "rivaliserend: vol = vol"],
      ["Netflix", "uitsluitbaar: betaalmuur"],
    ].forEach(([t, sub], i) => {
      const y = 2.6 + i * 0.55;
      s.addShape("ellipse", { x: 5.4, y: y + 0.13, w: 0.14, h: 0.14, fill: { color: PC.coralDeep } });
      s.addText(t, { x: 5.65, y: y, w: 3.7, h: 0.3, fontFace: FONT_SANS, fontSize: 14, bold: true, color: PC.ink });
      s.addText(sub, { x: 5.65, y: y + 0.25, w: 3.7, h: 0.25, fontFace: FONT_SERIF, fontSize: 11, italic: true, color: PC.smoke });
    });
  }

  // ── 10: Section FREE-RIDER ────────────────────────────────────────
  sectionDivider({ kicker: "Deel 3", title: "Waarom de markt faalt", subtitle: "Het free-rider probleem — meeliften is slimmer dan betalen.",
    notes: "De economische reden waarom particuliere aanbieders geen collectief goed kunnen leveren." });

  // ── 11: Meelifter scene ───────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.meelifter, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Vier buren. Anna zet €400 op tafel voor de dijk. Bo, Cem en Dina denken: waarom zou ik? Ik profiteer tóch. Anna realiseert dat en stopt. Eindresultaat: geen dijk.");
  }

  // ── 12: Markt faalt diagram ───────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.marktFaalt, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Links: de keten van marktfalen. Rechts: de keten van overheidsoplossing. De sleutel is VERPLICHTE belasting — die is afdwingbaar.");
  }

  // ── 13: Valkuilen ────────────────────────────────────────────────
  {
    const s = editorial({ kicker: "Denkfouten", title: "Drie valkuilen bij collectieve goederen",
      notes: "Veelgemaakte fouten. Vraag: herken je ze?" });
    const items = [
      { num: "01", claim: "Als de overheid het levert, is het een collectief goed",
        truth: "Nee. Het gaat om de EIGENSCHAPPEN van het goed. Een zwembad wordt door de overheid gefinancierd maar is wél uitsluitbaar." },
      { num: "02", claim: "Een collectief goed is gratis",
        truth: "Nee. Het lijkt gratis bij gebruik, maar wordt betaald via belasting. Iedereen betaalt dus mee, ongeacht gebruik." },
      { num: "03", claim: "Gemeenschappelijk = collectief",
        truth: "Nee. Gemeenschappelijke goederen zijn RIVALISEREND (visgronden raken op), collectieve niet. Alleen het laatste kwadrant is écht collectief." },
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

  // ── 14: Samenvatting ──────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("De kern", { x: 0.6, y: 0.5, w: 8.8, h: 0.4, ...T.labelUpper, color: PC.coral, fontSize: 13, charSpacing: 6 });
    s.addText("Vijf dingen om te onthouden", { x: 0.6, y: 0.9, w: 8.8, h: 0.8, ...T.headlineDark, fontSize: 32, charSpacing: -1 });
    const items = [
      { n: "01", t: "Collectief goed = niet-uitsluitbaar \u00E9n niet-rivaliserend" },
      { n: "02", t: "Vier typen goederen: priv\u00E9 \u2194 club \u2194 gemeenschappelijk \u2194 collectief" },
      { n: "03", t: "Markt kan collectieve goederen niet leveren — geen winstmodel" },
      { n: "04", t: "Free-rider probleem: meeliften is slimmer dan betalen" },
      { n: "05", t: "Overheid lost op via verplichte belasting — afdwingbaar" },
    ];
    items.forEach((it, i) => {
      const y = 1.85 + i * 0.64;
      s.addText(it.n, { x: 0.6, y, w: 0.9, h: 0.6, fontFace: FONT_DISPLAY, fontSize: 24, bold: true, color: PC.coral, charSpacing: -0.5 });
      s.addText(it.t, { x: 1.55, y: y + 0.1, w: 7.95, h: 0.5, fontFace: FONT_SANS, fontSize: 17, color: PC.chalk, valign: "middle" });
      if (i < items.length - 1) s.addShape("rect", { x: 0.6, y: y + 0.6, w: 8.8, h: 0.005, fill: { color: PC.indigoSoft } });
    });
  }

  const outDir = path.resolve(__dirname, "../output/3.3.3");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const svgDir = path.join(outDir, "svg");
  if (!fs.existsSync(svgDir)) fs.mkdirSync(svgDir, { recursive: true });
  for (const [k, v] of Object.entries(svgs)) fs.writeFileSync(path.join(svgDir, `333c-${k}.svg`), v, "utf8");
  const outPath = path.join(outDir, "3.3.3 Collectieve goederen – presentatie.pptx");
  await pres.writeFile({ fileName: outPath });
  const fix = await fixPptxFile(outPath);
  roundtripWithLibreOffice(outPath);
  console.log(`PPTX written to ${outPath} (fix: -${fix.removedOverrides} phantom overrides, -${fix.removedEmptyDirs} empty dirs; roundtripped via LibreOffice)`);
}

build().catch(e => { console.error(e); process.exit(1); });
