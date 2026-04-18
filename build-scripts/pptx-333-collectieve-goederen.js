/**
 * PPTX Build: 3.3.3 Collectieve goederen — presentatie met dual coding
 *
 * 13 dia's met 4 visuals:
 *   1. 2×2 matrix (uitsluitbaar × rivaliserend → 4 soorten goederen)
 *   2. Meelifter-pictogram (4 personen, 1 betaalt, 4 profiteren)
 *   3. Beslisboom: is het een collectief goed?
 *   4. Keten: waarom markt faalt → overheid lost op
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/pptx-333-collectieve-goederen.js
 */
process.env.NODE_PATH = "C:/Users/meije/AppData/Roaming/npm/node_modules";
require("module").Module._initPaths();

const PptxGenJS = require("pptxgenjs");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { saveSvgFiles } = require("./lib-svg-save");

const C = {
  dBlue: "1A5276", dBlueLt: "EBF5FB", dBlueDk: "154360",
  dAmber: "E67E22", dAmberLt: "FEF5E7", dAmberDk: "BA6A1C",
  dGreen: "1E8449", dGreenLt: "E8F8F0", dGreenDk: "186A3B",
  navy: "1E2761", white: "FFFFFF", dark: "2D3748", gray: "718096",
  lightGray: "F7F8FA", borderGray: "CBD5E0", red: "D9534F", lightRed: "FDE8E8",
  cream: "F9F6F1", rowAlt: "F7FAFC",
  purple: "7B2D8E", lightPurple: "F3E8F9",
};
const DOMAIN = { color: C.dBlue, light: C.dBlueLt, dark: C.dBlueDk };
const GC = { label: "#718096", title: "#1E2761", bg: "#F7FAFC", axis: "#2D3748" };
const makeShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.10 });
async function svgToPng(svg, w = 720) { return sharp(Buffer.from(svg)).resize(w).png().toBuffer(); }
function pngToBase64(buf) { return "image/png;base64," + buf.toString("base64"); }

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 1: 2×2 MATRIX — uitsluitbaar × rivaliserend
// ═══════════════════════════════════════════════════════════════════════════
function buildMatrix2x2SVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>

  <text x="360" y="24" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">Vier typen goederen — uitsluitbaar × rivaliserend</text>

  <!-- Column headers: rivaliserend -->
  <text x="290" y="56" text-anchor="middle" font-size="12" font-weight="bold" fill="${GC.label}">RIVALISEREND</text>
  <text x="290" y="73" text-anchor="middle" font-size="11" fill="#2D3748" font-style="italic">(gebruik = ander kan niet)</text>
  <text x="520" y="56" text-anchor="middle" font-size="12" font-weight="bold" fill="${GC.label}">NIET-RIVALISEREND</text>
  <text x="520" y="73" text-anchor="middle" font-size="11" fill="#2D3748" font-style="italic">(meer gebruikers = geen extra kosten)</text>

  <!-- Row headers: uitsluitbaar (rotated) -->
  <text x="30" y="160" text-anchor="middle" font-size="12" font-weight="bold" fill="${GC.label}" transform="rotate(-90, 30, 160)">UITSLUITBAAR</text>
  <text x="45" y="160" text-anchor="middle" font-size="11" fill="#2D3748" font-style="italic" transform="rotate(-90, 45, 160)">(alleen wie betaalt)</text>
  <text x="30" y="270" text-anchor="middle" font-size="12" font-weight="bold" fill="${GC.label}" transform="rotate(-90, 30, 270)">NIET-UITSLUITBAAR</text>
  <text x="45" y="270" text-anchor="middle" font-size="11" fill="#2D3748" font-style="italic" transform="rotate(-90, 45, 270)">(iedereen kan erbij)</text>

  <!-- Cell 1: uitsluitbaar + rivaliserend = PRIVÉGOED -->
  <rect x="65" y="90" width="310" height="135" rx="8" fill="#EBF5FB" stroke="#1A5276" stroke-width="1.5"/>
  <text x="80" y="115" font-size="14" font-weight="bold" fill="#1A5276">Privégoed</text>
  <text x="80" y="140" font-size="11" fill="#2D3748">wie betaalt gebruikt het,</text>
  <text x="80" y="156" font-size="11" fill="#2D3748">verbruikt door de gebruiker</text>
  <text x="80" y="185" font-size="11" font-style="italic" fill="${GC.label}">voorbeelden:</text>
  <text x="80" y="202" font-size="11" fill="#2D3748">• auto, ijsje, broodje</text>
  <text x="80" y="218" font-size="11" fill="#2D3748">• kleding, telefoon</text>

  <!-- Cell 2: uitsluitbaar + niet-rivaliserend = CLUBGOED -->
  <rect x="385" y="90" width="310" height="135" rx="8" fill="#FEF5E7" stroke="#E67E22" stroke-width="1.5"/>
  <text x="400" y="115" font-size="14" font-weight="bold" fill="#E67E22">Clubgoed</text>
  <text x="400" y="140" font-size="11" fill="#2D3748">alleen leden/betalers,</text>
  <text x="400" y="156" font-size="11" fill="#2D3748">maar gebruik botst niet</text>
  <text x="400" y="185" font-size="11" font-style="italic" fill="${GC.label}">voorbeelden:</text>
  <text x="400" y="202" font-size="11" fill="#2D3748">• Netflix, Spotify</text>
  <text x="400" y="218" font-size="11" fill="#2D3748">• betaalde tunnel, bioscoop</text>

  <!-- Cell 3: niet-uitsluitbaar + rivaliserend = GEMEENSCHAPPELIJK GOED -->
  <rect x="65" y="235" width="310" height="115" rx="8" fill="#FDE8E8" stroke="#D9534F" stroke-width="1.5"/>
  <text x="80" y="260" font-size="14" font-weight="bold" fill="#922B21">Gemeenschappelijk goed</text>
  <text x="80" y="285" font-size="11" fill="#2D3748">iedereen mag erbij, maar</text>
  <text x="80" y="301" font-size="11" fill="#2D3748">gebruik raakt op \u2192 overbevissing</text>
  <text x="80" y="325" font-size="11" font-style="italic" fill="${GC.label}">voorbeelden: visgronden, vrij</text>
  <text x="80" y="341" font-size="11" fill="#2D3748">weiland, schone lucht</text>

  <!-- Cell 4: niet-uitsluitbaar + niet-rivaliserend = COLLECTIEF GOED -->
  <rect x="385" y="235" width="310" height="115" rx="8" fill="#E8F8F0" stroke="#186A3B" stroke-width="2.5"/>
  <text x="400" y="260" font-size="14" font-weight="bold" fill="#186A3B">Collectief goed</text>
  <text x="400" y="285" font-size="11" fill="#2D3748">iedereen profiteert, geen</text>
  <text x="400" y="301" font-size="11" fill="#2D3748">extra kosten per gebruiker</text>
  <text x="400" y="325" font-size="11" font-style="italic" fill="${GC.label}">voorbeelden: dijken, defensie,</text>
  <text x="400" y="341" font-size="11" fill="#2D3748">straatverlichting, politie</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 2: MEELIFTER-PICTOGRAM — vier personen profiteren, één betaalt
// ═══════════════════════════════════════════════════════════════════════════
function buildMeelifterSVG() {
  // Four persons standing under an umbrella = collectief goed
  // Person 1 (betaler) holds umbrella + euro sign. Persons 2-4 profit free.
  const personY = 220;
  const persons = [
    { x: 130, color: "#1E8449", label: "Anna",  pays: true },
    { x: 280, color: "#1A5276", label: "Bo",    pays: false },
    { x: 430, color: "#1A5276", label: "Cem",   pays: false },
    { x: 580, color: "#1A5276", label: "Dina",  pays: false },
  ];

  let personsSvg = "";
  persons.forEach(p => {
    personsSvg += `
      <!-- Head -->
      <circle cx="${p.x}" cy="${personY - 30}" r="18" fill="${p.color}"/>
      <!-- Body -->
      <rect x="${p.x - 18}" y="${personY - 12}" width="36" height="50" rx="10" fill="${p.color}"/>
      <!-- Legs -->
      <rect x="${p.x - 14}" y="${personY + 38}" width="10" height="26" fill="${p.color}"/>
      <rect x="${p.x + 4}"  y="${personY + 38}" width="10" height="26" fill="${p.color}"/>
      <!-- Label -->
      <text x="${p.x}" y="${personY + 85}" text-anchor="middle" font-size="13" font-weight="bold" fill="#2D3748">${p.label}</text>
      <text x="${p.x}" y="${personY + 102}" text-anchor="middle" font-size="11" fill="${p.pays ? "#186A3B" : "#D9534F"}">${p.pays ? "betaalt" : "liftmee"}</text>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>

  <text x="360" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">Meeliftgedrag: iedereen profiteert, één betaalt</text>

  <!-- Collectief goed: dijk / umbrella / parasol -->
  <ellipse cx="360" cy="120" rx="310" ry="30" fill="#186A3B" opacity="0.85"/>
  <text x="360" y="110" text-anchor="middle" font-size="14" font-weight="bold" fill="#FFFFFF">DIJK (collectief goed)</text>
  <text x="360" y="130" text-anchor="middle" font-size="11" fill="#FFFFFF" opacity="0.95">beschermt iedereen, ongeacht of ze betalen</text>
  <!-- "Support poles" from dijk down to each person -->
  ${persons.map(p => `<line x1="${p.x}" y1="150" x2="${p.x}" y2="${personY - 48}" stroke="#186A3B" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>`).join("")}

  <!-- Euro sign above betaler -->
  <circle cx="${persons[0].x + 28}" cy="${personY - 55}" r="14" fill="#F9A825"/>
  <text x="${persons[0].x + 28}" y="${personY - 50}" text-anchor="middle" font-size="15" font-weight="bold" fill="#FFFFFF">€</text>

  ${personsSvg}

  <!-- Conclusion caption -->
  <rect x="90" y="330" width="540" height="26" rx="4" fill="#FDE8E8" stroke="#D9534F" stroke-width="1"/>
  <text x="360" y="348" text-anchor="middle" font-size="12" font-weight="bold" fill="#922B21">Waarom zou Bo nog betalen als Anna al zorgt voor de dijk?</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 3: BESLISBOOM — is het een collectief goed?
// ═══════════════════════════════════════════════════════════════════════════
function buildBeslisboomSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs><marker id="ahb" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#718096"/></marker></defs>

  <text x="360" y="24" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">Is het een collectief goed? — beslisboom</text>

  <!-- Q1 -->
  <rect x="230" y="48" width="260" height="54" rx="8" fill="#1A5276"/>
  <text x="360" y="72" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">Kan iemand worden</text>
  <text x="360" y="90" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">uitgesloten van gebruik?</text>

  <!-- Ja branch → privégoed/clubgoed -->
  <line x1="270" y1="102" x2="140" y2="135" stroke="#718096" stroke-width="1.5" marker-end="url(#ahb)"/>
  <text x="190" y="124" font-size="11" font-weight="bold" fill="#D9534F">JA</text>

  <rect x="30" y="140" width="220" height="54" rx="8" fill="#EBF5FB" stroke="#1A5276" stroke-width="1.5"/>
  <text x="140" y="163" text-anchor="middle" font-size="13" font-weight="bold" fill="#1A5276">Priv\u00E9goed / clubgoed</text>
  <text x="140" y="183" text-anchor="middle" font-size="11" fill="#2D3748">markt kan dit leveren</text>

  <!-- Nee branch → Q2 -->
  <line x1="450" y1="102" x2="580" y2="135" stroke="#718096" stroke-width="1.5" marker-end="url(#ahb)"/>
  <text x="530" y="124" font-size="11" font-weight="bold" fill="#186A3B">NEE</text>

  <rect x="450" y="140" width="260" height="54" rx="8" fill="#1A5276"/>
  <text x="580" y="164" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">Gaat gebruik door één</text>
  <text x="580" y="182" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">ten koste van de ander?</text>

  <!-- Q2 Ja → gemeenschappelijk -->
  <line x1="490" y1="194" x2="360" y2="235" stroke="#718096" stroke-width="1.5" marker-end="url(#ahb)"/>
  <text x="420" y="222" font-size="11" font-weight="bold" fill="#D9534F">JA</text>

  <rect x="240" y="240" width="240" height="54" rx="8" fill="#FDE8E8" stroke="#D9534F" stroke-width="1.5"/>
  <text x="360" y="263" text-anchor="middle" font-size="13" font-weight="bold" fill="#922B21">Gemeenschappelijk goed</text>
  <text x="360" y="283" text-anchor="middle" font-size="11" fill="#2D3748">bv. visgronden, wei, lucht</text>

  <!-- Q2 Nee → collectief -->
  <line x1="670" y1="194" x2="590" y2="235" stroke="#718096" stroke-width="1.5" marker-end="url(#ahb)"/>
  <text x="650" y="222" font-size="11" font-weight="bold" fill="#186A3B">NEE</text>

  <rect x="490" y="240" width="220" height="54" rx="8" fill="#E8F8F0" stroke="#186A3B" stroke-width="2.5"/>
  <text x="600" y="263" text-anchor="middle" font-size="13" font-weight="bold" fill="#186A3B">Collectief goed</text>
  <text x="600" y="283" text-anchor="middle" font-size="11" fill="#2D3748">bv. dijken, defensie, politie</text>

  <!-- Bottom key insight -->
  <rect x="40" y="310" width="640" height="40" rx="6" fill="#FFF8E1" stroke="#F9A825" stroke-width="1.2"/>
  <text x="360" y="328" text-anchor="middle" font-size="12" font-weight="bold" fill="#7B4A12">Alleen het laatste vakje — niet-uitsluitbaar \u00E9n niet-rivaliserend — is een collectief goed.</text>
  <text x="360" y="345" text-anchor="middle" font-size="11" fill="#2D3748" font-style="italic">De markt levert het niet \u2192 overheid financiert via belasting.</text>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH 4: WAAROM DE MARKT FAALT (infographic keten)
// ═══════════════════════════════════════════════════════════════════════════
function buildMarktFaaltSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 360" font-family="Arial">
  <rect x="0" y="0" width="720" height="360" rx="8" fill="${GC.bg}"/>
  <defs><marker id="ahf" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#718096"/></marker></defs>

  <text x="360" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="${GC.title}">Waarom de markt collectieve goederen niet levert</text>

  <!-- Two tracks side by side: MARKT vs OVERHEID -->
  <!-- MARKT track (red) -->
  <text x="180" y="60" text-anchor="middle" font-size="13" font-weight="bold" fill="#922B21">MARKT FAALT</text>
  <rect x="50" y="75" width="260" height="52" rx="8" fill="#FDE8E8" stroke="#D9534F" stroke-width="1.2"/>
  <text x="180" y="98" text-anchor="middle" font-size="12" font-weight="bold" fill="#922B21">Niet-uitsluitbaar</text>
  <text x="180" y="115" text-anchor="middle" font-size="11" fill="#2D3748">iedereen kan het gebruiken</text>

  <rect x="50" y="140" width="260" height="52" rx="8" fill="#FDE8E8" stroke="#D9534F" stroke-width="1.2"/>
  <text x="180" y="163" text-anchor="middle" font-size="12" font-weight="bold" fill="#922B21">Meeliften loont</text>
  <text x="180" y="180" text-anchor="middle" font-size="11" fill="#2D3748">niemand betaalt vrijwillig</text>

  <rect x="50" y="205" width="260" height="52" rx="8" fill="#FDE8E8" stroke="#D9534F" stroke-width="1.2"/>
  <text x="180" y="228" text-anchor="middle" font-size="12" font-weight="bold" fill="#922B21">Geen winst mogelijk</text>
  <text x="180" y="245" text-anchor="middle" font-size="11" fill="#2D3748">particuliere aanbieder stopt</text>

  <rect x="50" y="270" width="260" height="52" rx="8" fill="#D9534F"/>
  <text x="180" y="295" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">Goed wordt niet geleverd</text>
  <text x="180" y="312" text-anchor="middle" font-size="11" fill="#FFFFFF" opacity="0.95">welvaartsverlies voor iedereen</text>

  <line x1="180" y1="127" x2="180" y2="138" stroke="#D9534F" stroke-width="1.5" marker-end="url(#ahf)"/>
  <line x1="180" y1="192" x2="180" y2="203" stroke="#D9534F" stroke-width="1.5" marker-end="url(#ahf)"/>
  <line x1="180" y1="257" x2="180" y2="268" stroke="#D9534F" stroke-width="1.5" marker-end="url(#ahf)"/>

  <!-- Arrow between tracks -->
  <line x1="320" y1="200" x2="395" y2="200" stroke="#2D3748" stroke-width="2.5" marker-end="url(#ahf)"/>
  <text x="360" y="190" text-anchor="middle" font-size="11" font-style="italic" fill="${GC.label}">overheid</text>
  <text x="360" y="218" text-anchor="middle" font-size="11" font-style="italic" fill="${GC.label}">springt in</text>

  <!-- OVERHEID track (green) -->
  <text x="540" y="60" text-anchor="middle" font-size="13" font-weight="bold" fill="#186A3B">OVERHEID LOST OP</text>
  <rect x="410" y="75" width="260" height="52" rx="8" fill="#E8F8F0" stroke="#186A3B" stroke-width="1.2"/>
  <text x="540" y="98" text-anchor="middle" font-size="12" font-weight="bold" fill="#186A3B">Verplichte belasting</text>
  <text x="540" y="115" text-anchor="middle" font-size="11" fill="#2D3748">iedereen betaalt mee</text>

  <rect x="410" y="140" width="260" height="52" rx="8" fill="#E8F8F0" stroke="#186A3B" stroke-width="1.2"/>
  <text x="540" y="163" text-anchor="middle" font-size="12" font-weight="bold" fill="#186A3B">Meeliften onmogelijk</text>
  <text x="540" y="180" text-anchor="middle" font-size="11" fill="#2D3748">belasting afdwingen kan</text>

  <rect x="410" y="205" width="260" height="52" rx="8" fill="#E8F8F0" stroke="#186A3B" stroke-width="1.2"/>
  <text x="540" y="228" text-anchor="middle" font-size="12" font-weight="bold" fill="#186A3B">Overheid levert/betaalt</text>
  <text x="540" y="245" text-anchor="middle" font-size="11" fill="#2D3748">Rijkswaterstaat, defensie</text>

  <rect x="410" y="270" width="260" height="52" rx="8" fill="#186A3B"/>
  <text x="540" y="295" text-anchor="middle" font-size="13" font-weight="bold" fill="#FFFFFF">Goed is beschikbaar</text>
  <text x="540" y="312" text-anchor="middle" font-size="11" fill="#FFFFFF" opacity="0.95">iedereen profiteert \u00E9n betaalt</text>

  <line x1="540" y1="127" x2="540" y2="138" stroke="#186A3B" stroke-width="1.5" marker-end="url(#ahf)"/>
  <line x1="540" y1="192" x2="540" y2="203" stroke="#186A3B" stroke-width="1.5" marker-end="url(#ahf)"/>
  <line x1="540" y1="257" x2="540" y2="268" stroke="#186A3B" stroke-width="1.5" marker-end="url(#ahf)"/>
</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE HELPERS
// ═══════════════════════════════════════════════════════════════════════════
function addTitleMaster(pres) {
  pres.defineSlideMaster({
    title: "TITLE_DARK", background: { color: C.navy },
    objects: [
      { rect: { x: 0, y: 0, w: 10, h: 0.06, fill: { color: DOMAIN.color } } },
      { rect: { x: 0, y: 5.15, w: 10, h: 0.475, fill: { color: "151D4A" } } },
    ],
  });
}
function addContentMaster(pres) {
  pres.defineSlideMaster({
    title: "CONTENT", background: { color: C.white },
    objects: [{ rect: { x: 0, y: 0, w: 10, h: 0.75, fill: { color: DOMAIN.color } } }],
  });
}
function addContentSlide(pres, title) {
  const slide = pres.addSlide({ masterName: "CONTENT" });
  slide.addText(title, { x: 0.5, y: 0, w: 9, h: 0.75,
    fontSize: 24, fontFace: "Arial", color: C.white, bold: true, valign: "middle" });
  return slide;
}
function drawCard(slide, x, y, w, h, accentColor, bgColor, title, titleColor, bodyParts) {
  slide.addShape("rect", { x, y, w, h, fill: { color: bgColor }, rectRadius: 0.05, shadow: makeShadow() });
  slide.addShape("rect", { x, y, w: 0.06, h, fill: { color: accentColor } });
  slide.addText(title, { x: x + 0.2, y: y + 0.12, w: w - 0.35, h: 0.4,
    fontSize: 18, fontFace: "Arial", color: titleColor, bold: true, valign: "top", margin: 0 });
  if (bodyParts && bodyParts.length) {
    slide.addText(bodyParts, { x: x + 0.2, y: y + 0.55, w: w - 0.35, h: h - 0.7,
      fontSize: 13, fontFace: "Arial", color: C.dark, valign: "top", align: "left",
      lineSpacingMultiple: 1.2, margin: 0 });
  }
}
function drawGraph(slide, img) { slide.addImage({ data: img, x: 0.75, y: 0.95, w: 8.5, h: 4.25 }); }
function drawFlow(slide, steps, opts = {}) {
  const sx = opts.x ?? 1.3, sy = opts.y ?? 1.1, sw = opts.w ?? 7.4, sh = opts.h ?? 0.6, gap = 0.12;
  const hiColor = opts.hiColor || DOMAIN.color;
  steps.forEach((st, i) => {
    const y = sy + i * (sh + gap);
    slide.addShape("rect", { x: sx, y, w: sw, h: sh,
      fill: { color: st.hi ? hiColor : C.cream }, rectRadius: 0.04, shadow: makeShadow() });
    const pref = i > 0 ? "\u2193  " : "";
    slide.addText(pref + st.t, { x: sx + 0.2, y, w: sw - 0.3, h: sh,
      fontSize: 14, fontFace: "Arial", color: st.hi ? C.white : C.dark, bold: st.hi,
      valign: "middle", margin: 0 });
  });
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

  addTitleMaster(pres);
  addContentMaster(pres);

  const svgEntries = [
    { name: "333-matrix-2x2",      svg: buildMatrix2x2SVG() },
    { name: "333-meelifter",       svg: buildMeelifterSVG() },
    { name: "333-beslisboom",      svg: buildBeslisboomSVG() },
    { name: "333-markt-faalt",     svg: buildMarktFaaltSVG() },
  ];
  const bufs = await Promise.all(svgEntries.map(e => svgToPng(e.svg)));
  const [gMat, gMeelifter, gBB, gMF] = bufs.map(pngToBase64);

  // ── DIA 1: Titel ──────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Collectieve goederen", { x: 0.7, y: 1.2, w: 8.6, h: 2,
      fontSize: 40, fontFace: "Arial", color: C.white, bold: true });
    s.addText("Paragraaf 3.3.3", { x: 0.7, y: 3.2, w: 8.6, h: 0.5,
      fontSize: 20, fontFace: "Arial", color: C.gray });
    s.addText("Hoofdstuk 3: Overheid  |  Economie VWO", { x: 0.7, y: 5.15, w: 8.6, h: 0.475,
      fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle" });
    s.addNotes("Deze paragraaf behandelt één specifieke vorm van marktfalen: goederen die de markt niet levert. Dijken, defensie, straatverlichting. Waarom niet? En wie lost het op?");
  }

  // ── DIA 2: Leerdoelen ─────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Wat ga je leren?");
    const doelen = [
      "De twee eigenschappen van een collectief goed benoemen",
      "Onderscheid maken tussen priv\u00E9goed, clubgoed, gemeenschappelijk goed en collectief goed",
      "Herkennen of iets een collectief goed is (beslisboom)",
      "Uitleggen waarom de markt collectieve goederen niet levert",
      "Het meeliftgedrag (free-riderprobleem) verklaren",
    ];
    s.addText(doelen.join("\n"), { x: 0.7, y: 1.15, w: 8.6, h: 3.6,
      bullet: { code: "25A0" }, fontSize: 17, fontFace: "Arial", color: C.dark,
      paraSpaceAfter: 10, lineSpacingMultiple: 1.25 });
    s.addNotes("Benadruk dat de 2×2 matrix (komt zo) de kern van deze paragraaf is: als je de matrix kunt invullen, ben je er.");
  }

  // ── DIA 3: Twee eigenschappen ─────────────────────────────────────
  {
    const s = addContentSlide(pres, "Twee eigenschappen definiëren een collectief goed");
    drawCard(s, 0.5, 1.05, 4.3, 3.9, DOMAIN.color, C.dBlueLt, "1. Niet-uitsluitbaar", DOMAIN.dark,
      [
        { text: "Je kunt niemand uitsluiten van het gebruik.", options: { breakLine: true, bold: true } },
        { text: "Iedereen profiteert — ook wie niet betaalt.", options: { breakLine: true } },
        { text: "", options: { breakLine: true } },
        { text: "Voorbeeld: een dijk beschermt het hele dorp — je kunt niet tegen één bewoner zeggen: \u201Cvoor jou doet \u00EDe het niet\u201D.", options: { fontSize: 12, italic: true, color: C.gray } },
      ]);
    drawCard(s, 5.2, 1.05, 4.3, 3.9, "#186A3B", C.dGreenLt, "2. Niet-rivaliserend", "186A3B",
      [
        { text: "Gebruik door de één gaat niet ten koste van de ander.", options: { breakLine: true, bold: true } },
        { text: "Meer gebruikers = geen extra kosten.", options: { breakLine: true } },
        { text: "", options: { breakLine: true } },
        { text: "Voorbeeld: of er nu 100 of 10.000 mensen achter de dijk wonen, de kosten van de dijk veranderen niet.", options: { fontSize: 12, italic: true, color: C.gray } },
      ]);
    s.addNotes("Laat de leerlingen zelf beide eigenschappen terugvinden in het voorbeeld dijk. Pas daarna volgt de matrix — eerst de twee 'assen' apart begrijpen.");
  }

  // ── DIA 4: 2x2 matrix ─────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "De 2×2 matrix — vier soorten goederen");
    drawGraph(s, gMat);
    s.addNotes("Dit is DE kapstok voor deze paragraaf. Leg elke cel even uit. Benadruk: alleen rechtsonder — niet-uitsluitbaar ÉN niet-rivaliserend — is een collectief goed. De andere drie kan de markt wel leveren.");
  }

  // ── DIA 5: Herken je het? (oefenrij) ──────────────────────────────
  {
    const s = addContentSlide(pres, "Wel of geen collectief goed?");
    drawCard(s, 0.5, 1.05, 4.3, 3.9, "#186A3B", C.dGreenLt, "WEL collectief", "186A3B",
      [
        { text: "Politiesurveillance", options: { bullet: { code: "25A0" }, bold: true, breakLine: true } },
        { text: "Straatverlichting",    options: { bullet: { code: "25A0" }, bold: true, breakLine: true } },
        { text: "Dijken",                options: { bullet: { code: "25A0" }, bold: true, breakLine: true } },
        { text: "Defensie",              options: { bullet: { code: "25A0" }, bold: true, breakLine: true } },
        { text: "\u2192 niet-uitsluitbaar \u00E9n niet-rivaliserend", options: { fontSize: 12, italic: true, color: C.gray } },
      ]);
    drawCard(s, 5.2, 1.05, 4.3, 3.9, C.red, C.lightRed, "GEEN collectief", "922B21",
      [
        { text: "Beveiligingsdienst", options: { bullet: { code: "25A0" }, bold: true, breakLine: true } },
        { text: "   uitsluitbaar: alleen klanten", options: { fontSize: 11, italic: true, color: C.gray, breakLine: true } },
        { text: "Priv\u00E9onderwijs", options: { bullet: { code: "25A0" }, bold: true, breakLine: true } },
        { text: "   uitsluitbaar: collegegeld", options: { fontSize: 11, italic: true, color: C.gray, breakLine: true } },
        { text: "Huisarts", options: { bullet: { code: "25A0" }, bold: true, breakLine: true } },
        { text: "   rivaliserend: vol = vol", options: { fontSize: 11, italic: true, color: C.gray, breakLine: true } },
        { text: "Netflix", options: { bullet: { code: "25A0" }, bold: true, breakLine: true } },
        { text: "   uitsluitbaar: betaalmuur", options: { fontSize: 11, italic: true, color: C.gray } },
      ]);
    s.addNotes("Laat de leerlingen eerst een minuut nadenken per voorbeeld: welke eigenschap ontbreekt? Dan pas de uitleg.");
  }

  // ── DIA 6: Beslisboom ─────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Beslisboom: is het een collectief goed?");
    drawGraph(s, gBB);
    s.addNotes("Twee vragen beslissen alles. Test met nieuwe voorbeelden: Wikipedia? Openbare bieb? Snelweg zonder tol? Vuurwerkshow?");
  }

  // ── DIA 7: Meeliftgedrag — concept ────────────────────────────────
  {
    const s = addContentSlide(pres, "Meeliftgedrag (free-rider probleem)");
    drawFlow(s, [
      { t: "Een collectief goed is beschikbaar voor iedereen", hi: false },
      { t: "Niet-uitsluitbaar: je kunt niet-betalers niet tegenhouden",    hi: false },
      { t: "Slim om NIET te betalen: je profiteert tóch",                   hi: true  },
      { t: "Niemand wil als enige betalen",                                  hi: false },
      { t: "Betalingsbereidheid is veel lager dan de waarde",                hi: true  },
    ], { hiColor: "#D9534F" });
    s.addNotes("Free-rider = meelifter. De denkfout die niemand maakt maar iedereen verzwijgt: als ik niet betaal, gebeurt het tóch — dus waarom zou ik?");
  }

  // ── DIA 8: Meelifter-pictogram ────────────────────────────────────
  {
    const s = addContentSlide(pres, "Meelifter: één betaalt, vier profiteren");
    drawGraph(s, gMeelifter);
    s.addNotes("Dit is precies waarom een markt zou falen. Anna bouwt een dijk met haar eigen geld; Bo, Cem en Dina profiteren gratis. Anna realiseert dat en stopt. Eindresultaat: geen dijk.");
  }

  // ── DIA 9: Waarom faalt de markt? ─────────────────────────────────
  {
    const s = addContentSlide(pres, "Waarom faalt de markt?");
    drawFlow(s, [
      { t: "Collectief goed is niet-uitsluitbaar", hi: false },
      { t: "Consumenten betalen niet vrijwillig",   hi: false },
      { t: "Particuliere aanbieder maakt geen winst", hi: true },
      { t: "Markt levert het goed niet — welvaartsverlies", hi: true },
    ], { hiColor: "#D9534F" });
    s.addNotes("De keten van marktfalen in 4 stappen. Dit is de klassieke redenering die op toetsen terugkomt.");
  }

  // ── DIA 10: Markt faalt — infographic met overheid ─────────────────
  {
    const s = addContentSlide(pres, "Markt faalt — overheid lost op");
    drawGraph(s, gMF);
    s.addNotes("Links het probleem, rechts de oplossing. De sleutel is VERPLICHTE belasting: de overheid kan iedereen laten meebetalen — een particuliere aanbieder kan dat niet.");
  }

  // ── DIA 11: Overheid als oplossing — keten ────────────────────────
  {
    const s = addContentSlide(pres, "De overheid als oplossing");
    drawFlow(s, [
      { t: "Markt faalt: geen private aanbieder", hi: false },
      { t: "Overheid biedt collectief goed aan",   hi: false },
      { t: "Betaling via VERPLICHTE belasting",     hi: true  },
      { t: "Iedereen profiteert \u00E9n betaalt mee", hi: false },
    ], { hiColor: "#186A3B" });

    // Key-insight card at bottom
    const y = 4.15, h = 0.95;
    const sx = 0.6, sw = 8.8;
    const s2 = s;
    s2.addShape("rect", { x: sx, y, w: sw, h, fill: { color: "FFF8E1" }, rectRadius: 0.04, shadow: makeShadow() });
    s2.addShape("rect", { x: sx, y, w: 0.06, h, fill: { color: "F9A825" } });
    s2.addText("Kernpunt", { x: sx + 0.22, y: y + 0.08, w: sw - 0.4, h: 0.32,
      fontSize: 14, fontFace: "Arial", color: "7B4A12", bold: true, margin: 0 });
    s2.addText("De overheid kan iedereen laten meebetalen via belastingheffing — dat kan een particuliere aanbieder niet.", {
      x: sx + 0.22, y: y + 0.40, w: sw - 0.4, h: h - 0.45,
      fontSize: 13, fontFace: "Arial", color: C.dark, margin: 0, lineSpacingMultiple: 1.2 });

    s.addNotes("Verplichte belasting is het sleutelmechanisme. Omdat niemand kan ontsnappen, verdwijnt het free-riderprobleem.");
  }

  // ── DIA 12: Valkuilen ─────────────────────────────────────────────
  {
    const s = addContentSlide(pres, "Valkuilen");
    const items = [
      { title: "\u201CAls de overheid het levert, is het een collectief goed\u201D",
        body: "Onjuist. Of iets collectief is hangt af van de EIGENSCHAPPEN (niet-uitsluitbaar + niet-rivaliserend), niet van wie het levert. Zwembaden worden door de overheid betaald maar zijn wél uitsluitbaar — géén collectief goed." },
      { title: "\u201CEen collectief goed is gratis\u201D",
        body: "Onjuist. Het lijkt gratis bij gebruik, maar het wordt betaald via belasting. Iedereen betaalt dus mee, ongeacht gebruik." },
      { title: "\u201CEen gemeenschappelijk goed is hetzelfde als een collectief goed\u201D",
        body: "Onjuist. Gemeenschappelijke goederen zijn RIVALISEREND (visgronden raken op), collectieve goederen niet. Alleen het tweede kwadrant rechtsonder in de matrix is écht collectief." },
    ];
    const sx = 0.6, sy = 1.05, sw = 8.8, sh = 1.17, gap = 0.14;
    items.forEach((it, i) => {
      const y = sy + i * (sh + gap);
      s.addShape("rect", { x: sx, y, w: sw, h: sh, fill: { color: C.lightRed }, rectRadius: 0.04 });
      s.addShape("rect", { x: sx, y, w: 0.06, h: sh, fill: { color: C.red } });
      s.addText(it.title, { x: sx + 0.25, y: y + 0.1, w: sw - 0.4, h: 0.4,
        fontSize: 15, fontFace: "Arial", color: "922B21", bold: true, margin: 0, valign: "top" });
      s.addText(it.body, { x: sx + 0.25, y: y + 0.48, w: sw - 0.4, h: sh - 0.55,
        fontSize: 12, fontFace: "Arial", color: C.dark, margin: 0, valign: "top", lineSpacingMultiple: 1.2 });
    });
    s.addNotes("Valkuil 1 is de klassieker: leerlingen verwarren ‘door de overheid geleverd’ met ‘collectief goed’. Het is een eigenschap van het GOED, niet van de aanbieder.");
  }

  // ── DIA 13: Samenvatting ──────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "TITLE_DARK" });
    s.addText("Samenvatting", { x: 0.7, y: 0.35, w: 8.6, h: 0.6,
      fontSize: 30, fontFace: "Arial", color: C.white, bold: true });
    s.addText("Check: beheers je dit voordat je gaat oefenen?", { x: 0.7, y: 0.95, w: 8.6, h: 0.4,
      fontSize: 14, fontFace: "Arial", color: C.gray, italic: true });
    const punten = [
      "Collectief goed = niet-uitsluitbaar \u00E9n niet-rivaliserend",
      "Vier soorten goederen: priv\u00E9 \u2194 club \u2194 gemeenschappelijk \u2194 collectief",
      "Particuliere aanbieder kan geen winst maken op een collectief goed",
      "Meelifter / free-rider: niemand wil als enige betalen",
      "De overheid biedt collectieve goederen aan",
      "Betaling via VERPLICHTE belasting — dat lost het free-riderprobleem op",
    ];
    s.addText(punten.join("\n"), { x: 0.7, y: 1.55, w: 8.6, h: 3.5,
      bullet: { code: "25A0" }, fontSize: 15, fontFace: "Arial", color: C.white,
      paraSpaceAfter: 8, lineSpacingMultiple: 1.25 });
    s.addNotes("Retrieval-opdracht: laat leerlingen de 2×2 matrix op een leeg blad natekenen en een eigen voorbeeld in elk vak schrijven. Die oefening legt beide eigenschappen tegelijk vast.");
  }

  const outDir = path.resolve(__dirname, "..", "output-333-pptx");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  saveSvgFiles(svgEntries, outDir);
  const outPath = path.join(outDir, "3.3.3 Collectieve goederen – presentatie.pptx");
  await pres.writeFile({ fileName: outPath });
  console.log("PPTX written to", outPath);
}

build().catch(e => { console.error(e); process.exit(1); });
