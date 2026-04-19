/**
 * pptx-334-creative.js — §3.3.4 Toepassen
 * CREATIVE version — FT-style casus layout, horizontal beslisboom,
 * doelmatigheid × rechtvaardigheid scatter with real Dutch policies.
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
// SVGs
// ═══════════════════════════════════════════════════════════════════════════

// Four vormen — editorial card grid with icons
function svgVierVormen() {
  const cards = [
    { x: 80,  title: "1. Externe effecten",   subTitle: "baten/kosten buiten de prijs", example: "luchtvervuiling door fabriek", instrument: "belasting / subsidie", icon: ICON.factory(SC.amberDeep), col: SC.amberDeep, lt: SC.warnBg },
    { x: 405, title: "2. Marktmacht",          subTitle: "te weinig concurrentie", example: "monopolist verhoogt prijs", instrument: "regulering / toezicht (ACM)", icon: ICON.smokestack(SC.indigo, SC.smoke), col: SC.indigo, lt: SC.sky },
    { x: 730, title: "3. Informatieongelijkheid", subTitle: "één partij weet meer", example: "tweedehands auto (verkoper weet meer)", instrument: "voorlichting / regels", icon: ICON.eye(SC.plum), col: SC.plum, lt: "#F3E8F9" },
    { x: 1055, title: "4. Collectief goed",     subTitle: "markt levert niet", example: "defensie, dijken", instrument: "overheid produceert", icon: ICON.badge(SC.oliveDeep, SC.coral), col: SC.oliveDeep, lt: SC.goodBg },
  ];
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("De vier vormen van marktfalen — elk met haar eigen instrument", "INTEGRATIE")}

    ${cards.map(c => `
      <rect x="${c.x}" y="150" width="200" height="410" rx="12" fill="${SC.chalk}" stroke="${c.col}" stroke-width="1.5"/>
      <rect x="${c.x}" y="150" width="200" height="50" fill="${c.col}" rx="12"/>
      <rect x="${c.x}" y="188" width="200" height="12" fill="${c.col}"/>
      <text x="${c.x + 100}" y="182" text-anchor="middle" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="#ffffff">${c.title}</text>

      <rect x="${c.x}" y="215" width="200" height="90" fill="${c.lt}"/>
      ${placeIcon(c.icon, c.x + 70, 230, 60)}

      <text x="${c.x + 15}" y="330" font-family="${FONT_SANS}" font-size="10" font-weight="700" fill="${SC.ash}" letter-spacing="2">WAT GAAT MIS?</text>
      <text x="${c.x + 15}" y="352" font-family="${FONT_SERIF}" font-size="13" font-style="italic" fill="${SC.ink}">${c.subTitle}</text>

      <text x="${c.x + 15}" y="400" font-family="${FONT_SANS}" font-size="10" font-weight="700" fill="${SC.ash}" letter-spacing="2">VOORBEELD</text>
      ${(() => {
        const words = c.example.split(" ");
        const mid = Math.ceil(words.length / 2);
        return `<text x="${c.x + 15}" y="420" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">${words.slice(0, mid).join(" ")}</text>
                <text x="${c.x + 15}" y="438" font-family="${FONT_SANS}" font-size="13" fill="${SC.ink}">${words.slice(mid).join(" ")}</text>`;
      })()}

      <rect x="${c.x + 15}" y="470" width="170" height="2" fill="${c.col}"/>
      <text x="${c.x + 15}" y="492" font-family="${FONT_SANS}" font-size="10" font-weight="700" fill="${c.col}" letter-spacing="2">INSTRUMENT</text>
      ${(() => {
        const words = c.instrument.split(" ");
        if (words.length <= 2) return `<text x="${c.x + 15}" y="515" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${c.col}">${c.instrument}</text>`;
        const mid = Math.ceil(words.length / 2);
        return `<text x="${c.x + 15}" y="515" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${c.col}">${words.slice(0, mid).join(" ")}</text>
                <text x="${c.x + 15}" y="534" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="${c.col}">${words.slice(mid).join(" ")}</text>`;
      })()}
    `).join("")}
  </svg>`;
}

// Horizontal beslisboom — clean horizontal flow
function svgBeslisboomHorizontal() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Diagnose: welke vorm van marktfalen speelt er?", "BESLISBOOM")}

    <!-- Central start -->
    <rect x="60" y="250" width="200" height="80" rx="10" fill="${SC.indigoDeep}"/>
    <text x="160" y="280" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.amber}" letter-spacing="2">UITGANGSPUNT</text>
    <text x="160" y="306" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="#ffffff">Markt levert niet</text>
    <text x="160" y="324" text-anchor="middle" font-family="${FONT_SANS}" font-size="14" font-weight="700" fill="#ffffff">het optimum</text>

    <!-- 4 branches fanning right -->
    ${[
      { y: 140, q: "Zitten alle kosten/\nbaten in de prijs?", out: "Externe effecten", col: SC.amberDeep, lt: SC.warnBg },
      { y: 240, q: "Is er voldoende\nconcurrentie?",           out: "Marktmacht",       col: SC.indigo,     lt: SC.sky },
      { y: 340, q: "Weet iedereen wat\nhij moet weten?",        out: "Informatie",       col: SC.plum,       lt: "#F3E8F9" },
      { y: 440, q: "Kan de markt het\ngoed leveren?",           out: "Collectief goed",   col: SC.oliveDeep,  lt: SC.goodBg },
    ].map((b, i) => {
      const qLines = b.q.split("\n");
      return `
        <!-- Arrow from start to question -->
        <line x1="260" y1="290" x2="380" y2="${b.y + 30}" stroke="${SC.ash}" stroke-width="1.5" marker-end="url(#ah-smoke)"/>

        <!-- Question box -->
        <rect x="380" y="${b.y}" width="260" height="62" rx="8" fill="${b.lt}" stroke="${b.col}" stroke-width="1.5"/>
        <text x="510" y="${b.y + 26}" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${b.col}">${qLines[0]}</text>
        <text x="510" y="${b.y + 44}" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${b.col}">${qLines[1]}</text>

        <!-- NEE label -->
        <text x="670" y="${b.y + 35}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.coralDeep}" letter-spacing="2">NEE?</text>

        <!-- Arrow to outcome -->
        <line x1="720" y1="${b.y + 31}" x2="830" y2="${b.y + 31}" stroke="${b.col}" stroke-width="2" marker-end="url(#ah-smoke)"/>

        <!-- Outcome -->
        <rect x="840" y="${b.y}" width="300" height="62" rx="8" fill="${b.col}"/>
        <text x="990" y="${b.y + 38}" text-anchor="middle" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="#ffffff">→ ${b.out}</text>
      `;
    }).join("")}

    <text x="640" y="590" text-anchor="middle" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.smoke}">Bij elk NEE is de bijbehorende vorm van marktfalen aan de orde. Soms spelen er meerdere.</text>
  </svg>`;
}

// FT-style casus article: tabaksaccijns
function svgTabaksaccijnsFT() {
  const px = 560, py = 150, pw = 620, ph = 340;
  const qMax = 22, pMax = 22;
  const qToX = q => px + (q / qMax) * pw;
  const pToY = p => py + ph - (p / pMax) * ph;

  const v1x = qToX(0), v1y = pToY(20), v2x = qToX(20), v2y = pToY(0);
  const a1x = qToX(0), a1y = pToY(5), a2x = qToX(20), a2y = pToY(15);
  const an1x = qToX(0), an1y = pToY(11), an2x = qToX(18), an2y = pToY(20);
  const xOld = qToX(10), yOld = pToY(10);
  const xNew = qToX(6), yNew = pToY(14), yProd = pToY(8);

  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Tabaksaccijns: werkt het, en is het eerlijk?", "CASUS · FT-STIJL")}

    <!-- LEFT: article-like column -->
    <g transform="translate(60,130)">
      <text x="0" y="0" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.plum}" letter-spacing="3">DEN HAAG · 2025</text>
      <text x="0" y="36" font-family="${FONT_DISPLAY}" font-size="26" font-weight="700" fill="${SC.indigo}" letter-spacing="-1">Accijns op sigaretten</text>
      <text x="0" y="62" font-family="${FONT_DISPLAY}" font-size="26" font-weight="700" fill="${SC.indigo}" letter-spacing="-1">omhoog van €11 naar €15</text>
      <line x1="0" y1="78" x2="60" y2="78" stroke="${SC.coralDeep}" stroke-width="3"/>

      <text x="0" y="110" font-family="${FONT_SERIF}" font-size="14" fill="${SC.ink}" font-style="italic">Het kabinet verhoogt de accijns per pakje</text>
      <text x="0" y="130" font-family="${FONT_SERIF}" font-size="14" fill="${SC.ink}" font-style="italic">om te stimuleren dat minder jongeren gaan</text>
      <text x="0" y="150" font-family="${FONT_SERIF}" font-size="14" fill="${SC.ink}" font-style="italic">roken. Critici vrezen dat vooral lage inkomens</text>
      <text x="0" y="170" font-family="${FONT_SERIF}" font-size="14" fill="${SC.ink}" font-style="italic">de rekening betalen.</text>

      <!-- Analysis box -->
      <rect x="0" y="200" width="450" height="230" rx="6" fill="${SC.paperMid}"/>
      <text x="20" y="228" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.coral}" letter-spacing="3">ANALYSE IN VIJF STAPPEN</text>
      ${[
        ["01", "Marktfalen?",    "negatief extern effect (gezondheid)"],
        ["02", "Instrument?",    "corrigerende belasting (Pigou)"],
        ["03", "Mechanisme?",    "prijs ↑ → consumptie ↓ → ext. kosten ↓"],
        ["04", "Doelmatig?",     "ja, minder roken = minder mij. kosten"],
        ["05", "Rechtvaardig?",  "lage inkomens betalen relatief meer"],
      ].map(([n, q, a], i) => {
        const y = 256 + i * 34;
        return `<text x="20" y="${y}" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.ash}">${n}</text>
                <text x="50" y="${y}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.indigo}">${q}</text>
                <text x="170" y="${y}" font-family="${FONT_SERIF}" font-size="12" font-style="italic" fill="${SC.ink}">${a}</text>`;
      }).join("")}
    </g>

    <!-- RIGHT: the graph -->
    <g>
      <line x1="${px}" y1="${py+ph}" x2="${px}" y2="${py-10}" stroke="${SC.ink}" stroke-width="1.5" marker-end="url(#ah-ink)"/>
      <line x1="${px}" y1="${py+ph}" x2="${px+pw+10}" y2="${py+ph}" stroke="${SC.ink}" stroke-width="1.5" marker-end="url(#ah-ink)"/>
      <text x="${px - 50}" y="${py + ph/2}" font-family="${FONT_SANS}" font-size="12" fill="${SC.smoke}" text-anchor="middle" transform="rotate(-90, ${px - 50}, ${py + ph/2})">Prijs (€)</text>
      <text x="${px + pw/2}" y="${py + ph + 42}" font-family="${FONT_SANS}" font-size="12" fill="${SC.smoke}" text-anchor="middle">Hoeveelheid Q</text>

      <!-- Tax revenue -->
      <rect x="${px}" y="${yNew}" width="${xNew - px}" height="${yProd - yNew}" fill="${SC.amber}" fill-opacity="0.55"/>

      <!-- Dashed refs -->
      <line x1="${xOld}" y1="${yOld}" x2="${xOld}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
      <line x1="${px}" y1="${yOld}" x2="${xOld}" y2="${yOld}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
      <line x1="${xNew}" y1="${yNew}" x2="${xNew}" y2="${py+ph}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>
      <line x1="${px}" y1="${yNew}" x2="${xNew}" y2="${yNew}" stroke="${SC.cloud}" stroke-width="1" stroke-dasharray="4,3"/>

      <!-- Curves -->
      <line x1="${v1x}" y1="${v1y}" x2="${v2x}" y2="${v2y}" stroke="${SC.indigo}" stroke-width="2.5"/>
      <text x="${v2x + 8}" y="${v2y - 6}" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${SC.indigo}">V</text>
      <line x1="${a1x}" y1="${a1y}" x2="${a2x}" y2="${a2y}" stroke="${SC.olive}" stroke-width="2" stroke-dasharray="6,4" opacity="0.75"/>
      <text x="${a2x + 8}" y="${a2y + 4}" font-family="${FONT_SANS}" font-size="11" font-weight="700" fill="${SC.olive}">A (oud)</text>
      <line x1="${an1x}" y1="${an1y}" x2="${an2x}" y2="${an2y}" stroke="${SC.coral}" stroke-width="2.5"/>
      <text x="${an2x + 8}" y="${an2y - 6}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.coral}">A + accijns</text>

      <circle cx="${xOld}" cy="${yOld}" r="6" fill="${SC.olive}" opacity="0.85"/>
      <circle cx="${xNew}" cy="${yNew}" r="7" fill="${SC.coralDeep}"/>

      <text x="${px - 10}" y="${yNew + 4}" text-anchor="end" font-family="${FONT_SANS}" font-size="11" fill="${SC.ink}" font-weight="700">€14</text>
      <text x="${px - 10}" y="${yOld + 4}" text-anchor="end" font-family="${FONT_SANS}" font-size="11" fill="${SC.ink}">€10</text>
      <text x="${xNew}" y="${py + ph + 18}" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" fill="${SC.ink}" font-weight="700">6</text>
      <text x="${xOld}" y="${py + ph + 18}" text-anchor="middle" font-family="${FONT_SANS}" font-size="11" fill="${SC.ink}">10</text>

      <!-- Highlight: consumption drop -->
      <g transform="translate(${xNew + 10}, ${yNew - 60})">
        <rect x="0" y="0" width="160" height="48" rx="6" fill="${SC.coralDeep}"/>
        <text x="10" y="18" font-family="${FONT_SANS}" font-size="10" font-weight="700" fill="#ffffff" letter-spacing="2">CONSUMPTIE</text>
        <text x="10" y="40" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="#ffffff">10 → 6 pakjes</text>
      </g>
    </g>
  </svg>`;
}

// Doelmatigheid × Rechtvaardigheid scatter with real Dutch policies
function svgScatterPolicies() {
  const w = 1280, h = 640;
  const px = 180, py = 120, pw = 900, ph = 420;
  const ox = px + pw/2, oy = py + ph/2;

  // Policies to plot: {x, y, label, color} where x=0..1 doelmatigheid, y=0..1 rechtvaardigheid
  const policies = [
    { x: 0.85, y: 0.80, name: "Vaccinatiesubsidie",  col: SC.oliveDeep, note: "lost extern effect op, iedereen profiteert" },
    { x: 0.70, y: 0.30, name: "Tabaksaccijns",        col: SC.plum,      note: "werkt, maar regressief" },
    { x: 0.30, y: 0.75, name: "Huurplafond",          col: SC.amberDeep, note: "helpt huurders, maar tekort" },
    { x: 0.25, y: 0.25, name: "Onuitvoerbare regel",   col: SC.coralDeep, note: "werkt niet én oneerlijk" },
    { x: 0.80, y: 0.60, name: "Minimumloon",          col: SC.indigo,    note: "beschermt, maar werkloosheid" },
    { x: 0.65, y: 0.85, name: "Onderwijsfinanciering", col: SC.teal,     note: "ideaal: efficiënt én eerlijk" },
  ];

  const toX = x => px + x * pw;
  const toY = y => py + ph - y * ph;

  return `${svgHeader(w, h, SC.paper)}
    ${editorialTitle("Beleid beoordelen: doelmatigheid én rechtvaardigheid", "HET BEOORDELINGSVELD")}

    <!-- Quadrant backgrounds -->
    <rect x="${ox}" y="${py}" width="${pw/2}" height="${ph/2}" fill="${SC.goodBg}" opacity="0.55"/>
    <rect x="${px}" y="${py}" width="${pw/2}" height="${ph/2}" fill="${SC.warnBg}" opacity="0.55"/>
    <rect x="${px}" y="${oy}" width="${pw/2}" height="${ph/2}" fill="${SC.badBg}" opacity="0.55"/>
    <rect x="${ox}" y="${oy}" width="${pw/2}" height="${ph/2}" fill="${SC.warnBg}" opacity="0.55"/>

    <!-- Quadrant labels -->
    <text x="${px + pw * 0.75}" y="${py + 30}" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.oliveDeep}" letter-spacing="3">IDEAAL</text>
    <text x="${px + pw * 0.75}" y="${py + 48}" text-anchor="middle" font-family="${FONT_SERIF}" font-size="11" font-style="italic" fill="${SC.oliveDeep}">efficiënt én eerlijk</text>

    <text x="${px + pw * 0.25}" y="${py + 30}" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.warnInk}" letter-spacing="3">EERLIJK, ONDOELMATIG</text>
    <text x="${px + pw * 0.25}" y="${py + 48}" text-anchor="middle" font-family="${FONT_SERIF}" font-size="11" font-style="italic" fill="${SC.warnInk}">goede bedoelingen, niet efficiënt</text>

    <text x="${px + pw * 0.25}" y="${oy + 24}" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.coralDeep}" letter-spacing="3">SLECHT</text>
    <text x="${px + pw * 0.25}" y="${oy + 42}" text-anchor="middle" font-family="${FONT_SERIF}" font-size="11" font-style="italic" fill="${SC.coralDeep}">geen van beide</text>

    <text x="${px + pw * 0.75}" y="${oy + 24}" text-anchor="middle" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.warnInk}" letter-spacing="3">EFFICIËNT, ONEERLIJK</text>
    <text x="${px + pw * 0.75}" y="${oy + 42}" text-anchor="middle" font-family="${FONT_SERIF}" font-size="11" font-style="italic" fill="${SC.warnInk}">werkt, maar wie betaalt?</text>

    <!-- Axes -->
    <line x1="${px}" y1="${oy}" x2="${px+pw+10}" y2="${oy}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <line x1="${ox}" y1="${py+ph}" x2="${ox}" y2="${py-10}" stroke="${SC.ink}" stroke-width="1.8" marker-end="url(#ah-ink)"/>
    <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="none" stroke="${SC.cloud}" stroke-width="1"/>

    <!-- Axis labels -->
    <text x="${px + pw + 20}" y="${oy - 6}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ink}" letter-spacing="2">DOELMATIGHEID →</text>
    <text x="${ox + 8}" y="${py - 8}" font-family="${FONT_SANS}" font-size="12" font-weight="700" fill="${SC.ink}" letter-spacing="2">↑ RECHTVAARDIGHEID</text>

    <!-- Points -->
    ${policies.map(p => {
      const cx = toX(p.x), cy = toY(p.y);
      return `
        <circle cx="${cx}" cy="${cy}" r="14" fill="${p.col}" opacity="0.25"/>
        <circle cx="${cx}" cy="${cy}" r="8" fill="${p.col}"/>
        <text x="${cx + 14}" y="${cy - 4}" font-family="${FONT_SANS}" font-size="13" font-weight="700" fill="${p.col}">${p.name}</text>
        <text x="${cx + 14}" y="${cy + 12}" font-family="${FONT_SERIF}" font-size="11" font-style="italic" fill="${SC.smoke}">${p.note}</text>
      `;
    }).join("")}

    <text x="640" y="590" text-anchor="middle" font-family="${FONT_SERIF}" font-size="14" font-style="italic" fill="${SC.smoke}">Goed beleid zit rechtsboven — maar in de praktijk is dit bijna altijd een afweging.</text>
  </svg>`;
}

// Redeneerroute in six steps — horizontal timeline style
function svgRedeneerroute() {
  return `${svgHeader(1280, 640, SC.paper)}
    ${editorialTitle("Redeneerroute: zes stappen om beleid te beoordelen", "METHODE")}

    ${[
      { n: "01", t: "Welk marktfalen\nspeelt hier?",                 col: SC.indigo },
      { n: "02", t: "Welk instrument\nwordt ingezet?",                col: SC.indigo },
      { n: "03", t: "Lost het instrument\nhet marktfalen op?",        col: SC.oliveDeep, sub: "doelmatigheid" },
      { n: "04", t: "Wie draagt\nde lasten?",                          col: SC.amberDeep, sub: "rechtvaardigheid" },
      { n: "05", t: "Onbedoelde\nneveneffecten?",                      col: SC.plum },
      { n: "06", t: "Conclusie: weeg\nbeide tegen elkaar",             col: SC.indigoDeep },
    ].map((s, i) => {
      const col = 80 + (i % 3) * 400;
      const row = 170 + Math.floor(i / 3) * 220;
      const lines = s.t.split("\n");
      return `
        <rect x="${col}" y="${row}" width="360" height="180" rx="12" fill="${SC.chalk}" stroke="${s.col}" stroke-width="1.5"/>
        <rect x="${col}" y="${row}" width="360" height="12" fill="${s.col}"/>
        <text x="${col + 20}" y="${row + 58}" font-family="${FONT_DISPLAY}" font-size="44" font-weight="700" fill="${s.col}" letter-spacing="-2">${s.n}</text>
        ${lines.map((l, j) => `<text x="${col + 20}" y="${row + 100 + j * 24}" font-family="${FONT_DISPLAY}" font-size="18" font-weight="700" fill="${SC.indigo}">${l}</text>`).join("")}
        ${s.sub ? `<rect x="${col + 20}" y="${row + 150}" width="120" height="22" rx="11" fill="${s.col}"/>
                   <text x="${col + 80}" y="${row + 166}" text-anchor="middle" font-family="${FONT_SANS}" font-size="10" font-weight="700" fill="#ffffff" letter-spacing="2">${s.sub.toUpperCase()}</text>` : ""}
      `;
    }).join("")}

    <!-- connecting arrows between cards within row and between rows -->
    <!-- Row 1 arrows -->
    <line x1="440" y1="260" x2="478" y2="260" stroke="${SC.ash}" stroke-width="2" marker-end="url(#ah-smoke)"/>
    <line x1="840" y1="260" x2="878" y2="260" stroke="${SC.ash}" stroke-width="2" marker-end="url(#ah-smoke)"/>
    <!-- Row 2 arrows -->
    <line x1="440" y1="480" x2="478" y2="480" stroke="${SC.ash}" stroke-width="2" marker-end="url(#ah-smoke)"/>
    <line x1="840" y1="480" x2="878" y2="480" stroke="${SC.ash}" stroke-width="2" marker-end="url(#ah-smoke)"/>
    <!-- Row transition: 03 → 04 -->
    <path d="M1240 260 Q1280 260 1280 310 Q1280 380 80 380 Q60 380 60 420" fill="none" stroke="${SC.ash}" stroke-width="2" stroke-dasharray="6,4" opacity="0.6"/>
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
  pres.title = "3.3.4 Toepassen";
  defineMasters(pres);

  const svgs = {
    vierVormen:    svgVierVormen(),
    beslisboom:    svgBeslisboomHorizontal(),
    tabaks:        svgTabaksaccijnsFT(),
    scatter:       svgScatterPolicies(),
    redeneerroute: svgRedeneerroute(),
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

  // ── 1: Title ──────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("§ 3.3.4", { x: 0.6, y: 0.5, w: 4, h: 0.4, ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6 });
    s.addText("Toepassen", { x: 0.6, y: 1.0, w: 8.8, h: 1.6, ...T.heroDark, fontSize: 96, charSpacing: -4 });
    s.addText("Alles samen: marktfalen herkennen, instrument kiezen, beleid beoordelen.", { x: 0.6, y: 2.8, w: 8.8, h: 0.8,
      fontFace: FONT_SERIF, fontSize: 22, italic: true, color: PC.cloud });
    s.addShape("rect", { x: 0.6, y: 3.85, w: 0.8, h: 0.04, fill: { color: PC.coral } });
    s.addText("Hoofdstuk 3 · Overheid  ·  Integratieparagraaf", { x: 0.6, y: 3.95, w: 8.8, h: 0.4, fontFace: FONT_SERIF, fontSize: 14, italic: true, color: PC.cloud });
    s.addNotes("Integratieparagraaf. Geen nieuwe theorie; wel nieuwe toepassingen. Nieuw woord vandaag: doelmatigheid vs rechtvaardigheid.");
  }

  // ── 2: Pull quote ─────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("\u201C", { x: 0.6, y: 0.7, w: 2, h: 2, fontFace: FONT_SERIF, fontSize: 220, bold: true, color: PC.coral });
    s.addText("Goed beleid\nis de kunst\nvan het kiezen.", { x: 1.8, y: 1.4, w: 8, h: 3,
      fontFace: FONT_DISPLAY, fontSize: 56, bold: true, color: PC.chalk, charSpacing: -2, lineSpacingMultiple: 1.05 });
    s.addText("Tussen efficient, eerlijk, en haalbaar.", { x: 1.8, y: 4.5, w: 8, h: 0.4, fontFace: FONT_SERIF, fontSize: 18, italic: true, color: PC.amber });
  }

  // ── 3: Leerdoelen ─────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "SIDEBAR" });
    s.addText("LEERDOELEN", { x: 0.15, y: 0.4, w: 1.7, h: 0.3, ...T.labelUpper, color: PC.coral, fontSize: 10, charSpacing: 3 });
    s.addText("Vijf vaardigheden", { x: 0.15, y: 0.75, w: 1.7, h: 1.6, fontFace: FONT_DISPLAY, fontSize: 16, bold: true, color: PC.chalk, charSpacing: -0.3 });
    s.addText("Van casus → diagnose → instrument → oordeel.", { x: 0.15, y: 2.5, w: 1.7, h: 2, fontFace: FONT_SERIF, fontSize: 11, italic: true, color: PC.cloud, lineSpacingMultiple: 1.4 });
    const doelen = [
      "Marktfalen herkennen in een casus",
      "Het juiste instrument koppelen aan het probleem",
      "Een collectief goed herkennen aan twee kenmerken",
      "Beleid beoordelen op doelmatigheid",
      "Beleid beoordelen op rechtvaardigheid",
    ];
    doelen.forEach((d, i) => {
      const y = 0.7 + i * 0.85;
      s.addText(`0${i+1}`, { x: 2.3, y, w: 0.8, h: 0.6, fontFace: FONT_DISPLAY, fontSize: 38, bold: true, color: PC.coral, charSpacing: -2 });
      s.addText(d, { x: 3.2, y: y + 0.1, w: 6.5, h: 0.5, fontFace: FONT_SANS, fontSize: 17, color: PC.ink, valign: "middle" });
      if (i < doelen.length - 1) s.addShape("rect", { x: 2.3, y: y + 0.75, w: 7.4, h: 0.008, fill: { color: PC.cloud } });
    });
  }

  // ── 4: Vier vormen ────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.vierVormen, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Herhaling met uitbreiding. Vorm 1 en 2 zaten in §3.3.1. Vorm 4 zat in §3.3.3. Vorm 3 (informatieongelijkheid) is nieuw — maar volgt dezelfde logica.");
  }

  // ── 5: Diagnose ───────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.beslisboom, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Voor élke casus op de toets: begin hier. Vier vragen, vier mogelijke antwoorden. Soms meerdere tegelijk.");
  }

  // ── 6: Section CASUS TABAKSACCIJNS ────────────────────────────────
  sectionDivider({ kicker: "Casus", title: "Accijns op sigaretten", subtitle: "€11 → €15 per pakje. Werkt het, en is het eerlijk?",
    notes: "We werken één casus volledig uit als voorbeeld. Van diagnose tot beoordeling." });

  // ── 7: FT-style casus ────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.tabaks, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Links: hoe journalisten het zouden schrijven. Rechts: hoe economen het analyseren. Allebei belangrijk. Sluit af met rij 5 — dat is waar de politiek begint.");
  }

  // ── 8: Section BEOORDELEN ────────────────────────────────────────
  sectionDivider({ kicker: "Deel 2", title: "Beleid beoordelen", subtitle: "Twee onafhankelijke criteria: doelmatigheid én rechtvaardigheid.",
    notes: "Dit is het meest nieuwe concept van de paragraaf. Twee verschillende vragen aan hetzelfde beleid." });

  // ── 9: Twee criteria ─────────────────────────────────────────────
  {
    const s = editorial({ kicker: "Twee vragen", title: "Beleid beoordelen gebeurt op twee assen.", subtitle: "Geen enkele as is 'de juiste' — het is een afweging.",
      notes: "Druk erop dat beide vragen onafhankelijk zijn — een doelmatig beleid kan oneerlijk zijn, en andersom." });

    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.goodBg }, line: { color: PC.oliveDeep, width: 1 } });
    s.addText("01", { x: 0.7, y: 2.1, w: 1.1, h: 0.7, fontFace: FONT_DISPLAY, fontSize: 36, bold: true, color: PC.oliveDeep, charSpacing: -1 });
    s.addText("Doelmatigheid", { x: 1.8, y: 2.3, w: 3, h: 0.5, fontFace: FONT_DISPLAY, fontSize: 20, bold: true, color: PC.oliveDeep });
    s.addText([
      { text: "Werkt het beleid economisch?\n\n", options: { bold: true, breakLine: true } },
      { text: "• Minder welvaartsverlies?\n", options: {} },
      { text: "• Lost het externe effect op?\n", options: {} },
      { text: "• Is het middel proportioneel?\n", options: {} },
      { text: "• Kosten vs. baten?", options: {} },
    ], { x: 0.7, y: 2.95, w: 4, h: 2.1, fontFace: FONT_SANS, fontSize: 13, color: PC.ink, lineSpacingMultiple: 1.4 });

    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.warnBg }, line: { color: PC.amberDeep, width: 1 } });
    s.addText("02", { x: 5.3, y: 2.1, w: 1.1, h: 0.7, fontFace: FONT_DISPLAY, fontSize: 36, bold: true, color: PC.amberDeep, charSpacing: -1 });
    s.addText("Rechtvaardigheid", { x: 6.4, y: 2.3, w: 3, h: 0.5, fontFace: FONT_DISPLAY, fontSize: 20, bold: true, color: PC.amberDeep });
    s.addText([
      { text: "Wie draagt de lasten?\n\n", options: { bold: true, breakLine: true } },
      { text: "• Raakt het lage inkomens harder?\n", options: {} },
      { text: "• Profijtbeginsel of solidariteit?\n", options: {} },
      { text: "• Worden zwakkeren beschermd?\n", options: {} },
      { text: "• Draagkrachtbeginsel?", options: {} },
    ], { x: 5.3, y: 2.95, w: 4, h: 2.1, fontFace: FONT_SANS, fontSize: 13, color: PC.ink, lineSpacingMultiple: 1.4 });
  }

  // ── 10: Scatter ──────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.scatter, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Kaart van zes Nederlandse beleidsstukken. Rechtsboven = ideaal, linksonder = slecht. De discussie gaat bijna altijd over de plaatsing — niet alle economen zijn het eens.");
  }

  // ── 11: Redeneerroute ────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addImage({ data: imgs.redeneerroute, x: 0.3, y: 0.3, w: 9.4, h: 5.0 });
    s.addNotes("Gebruik deze 6 stappen als template bij ELKE casus-vraag op de toets. Een sjabloon dat je invult — zo mis je niks.");
  }

  // ── 12: Marktfalen ≠ overheidsfalen ──────────────────────────────
  {
    const s = editorial({ kicker: "Nuance", title: "Marktfalen \u2260 reden tot ingrijpen.", subtitle: "Overheidsfalen bestaat ook — en kan het ergere kwaad zijn.",
      notes: "Dit is de VWO-nuance. Niet elke markt die faalt moet door de overheid worden 'opgelost'. Soms is niks doen beter." });

    s.addShape("rect", { x: 0.5, y: 2.0, w: 4.4, h: 3.1, fill: { color: PC.badBg }, line: { color: PC.coralDeep, width: 1 } });
    s.addText("MARKTFALEN", { x: 0.7, y: 2.15, w: 3.9, h: 0.3, ...T.labelUpper, color: PC.coralDeep, fontSize: 11, charSpacing: 3 });
    s.addText("De markt zelf levert niet het optimum", { x: 0.7, y: 2.5, w: 3.9, h: 0.8, fontFace: FONT_DISPLAY, fontSize: 18, bold: true, color: PC.coralDeep, charSpacing: -0.5 });
    s.addText([
      { text: "Oorzaken: externe effecten, marktmacht, informatie, collectieve goederen.\n\n", options: {} },
      { text: "Ingrijpen", options: { bold: true, color: PC.coralDeep } },
      { text: " kán nuttig zijn.", options: { italic: true } },
    ], { x: 0.7, y: 3.35, w: 4, h: 1.7, fontFace: FONT_SANS, fontSize: 13, color: PC.ink, lineSpacingMultiple: 1.4 });

    s.addShape("rect", { x: 5.1, y: 2.0, w: 4.4, h: 3.1, fill: { color: "#F3E8F9" }, line: { color: PC.plum, width: 1 } });
    s.addText("OVERHEIDSFALEN", { x: 5.3, y: 2.15, w: 3.9, h: 0.3, ...T.labelUpper, color: PC.plum, fontSize: 11, charSpacing: 3 });
    s.addText("Het ingrijpen zelf maakt het erger", { x: 5.3, y: 2.5, w: 3.9, h: 0.8, fontFace: FONT_DISPLAY, fontSize: 18, bold: true, color: PC.plum, charSpacing: -0.5 });
    s.addText([
      { text: "Oorzaken: te log apparaat, verkeerde prikkels, lobbydruk, neveneffecten.\n\n", options: {} },
      { text: "Ingrijpen is", options: { bold: true, color: PC.plum } },
      { text: " niet automatisch een verbetering.", options: { italic: true } },
    ], { x: 5.3, y: 3.35, w: 4, h: 1.7, fontFace: FONT_SANS, fontSize: 13, color: PC.ink, lineSpacingMultiple: 1.4 });
  }

  // ── 13: Valkuilen ────────────────────────────────────────────────
  {
    const s = editorial({ kicker: "Denkfouten", title: "Drie klassieke fouten bij de toets.",
      notes: "Wijs er op: deze drie komen elk jaar op de toets terug." });
    const items = [
      { num: "01", claim: "Marktfalen = overheidsfalen", truth: "Verschillende begrippen. Marktfalen = de markt werkt niet. Overheidsfalen = het ingrijpen werkt niet." },
      { num: "02", claim: "Collectief = door de overheid geleverd", truth: "Niet waar. Het gaat om de eigenschappen van het goed, niet om wie het levert." },
      { num: "03", claim: "Belasting = verbod", truth: "Een belasting stuurt via de prijs (markt blijft bestaan). Een verbod schakelt de markt uit." },
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

  // ── 14: Zelftest / samenvatting ──────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("Zelftest", { x: 0.6, y: 0.5, w: 8.8, h: 0.4, ...T.labelUpper, color: PC.coral, fontSize: 13, charSpacing: 6 });
    s.addText("Kun je deze zes dingen?", { x: 0.6, y: 0.9, w: 8.8, h: 0.8, ...T.headlineDark, fontSize: 32, charSpacing: -1 });
    const items = [
      { n: "01", t: "Vier vormen van marktfalen herkennen in een casus" },
      { n: "02", t: "Uitleggen waarom de overheid ingrijpt" },
      { n: "03", t: "Het juiste instrument koppelen aan het probleem" },
      { n: "04", t: "Collectief goed herkennen via twee kenmerken" },
      { n: "05", t: "Beleid beoordelen op doelmatigheid" },
      { n: "06", t: "Beleid beoordelen op rechtvaardigheid" },
    ];
    items.forEach((it, i) => {
      const y = 1.85 + i * 0.52;
      s.addText(it.n, { x: 0.6, y, w: 0.6, h: 0.5, fontFace: FONT_DISPLAY, fontSize: 22, bold: true, color: PC.coral });
      s.addText(it.t, { x: 1.2, y: y + 0.05, w: 8.3, h: 0.45, fontFace: FONT_SANS, fontSize: 15, color: PC.chalk, valign: "middle" });
      if (i < items.length - 1) s.addShape("rect", { x: 0.6, y: y + 0.48, w: 8.8, h: 0.005, fill: { color: PC.indigoSoft } });
    });
  }

  const outDir = path.resolve(__dirname, "../output/3.3.4");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const svgDir = path.join(outDir, "svg");
  if (!fs.existsSync(svgDir)) fs.mkdirSync(svgDir, { recursive: true });
  for (const [k, v] of Object.entries(svgs)) fs.writeFileSync(path.join(svgDir, `334c-${k}.svg`), v, "utf8");
  const outPath = path.join(outDir, "3.3.4 Toepassen – presentatie.pptx");
  await pres.writeFile({ fileName: outPath });
  const fix = await fixPptxFile(outPath);
  roundtripWithLibreOffice(outPath);
  console.log(`PPTX written to ${outPath} (fix: -${fix.removedOverrides} phantom overrides, -${fix.removedEmptyDirs} empty dirs; roundtripped via LibreOffice)`);
}

build().catch(e => { console.error(e); process.exit(1); });
