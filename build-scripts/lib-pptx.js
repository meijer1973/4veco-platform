/**
 * lib-pptx.js — editorial design system for economics PPTX builds.
 * Canonical shared library for all pptx-*.js builders.
 *
 * Key departures from the harness design system:
 *   • Segoe UI (Windows-system) with variable weights (300/400/600/700/900)
 *     paired with Georgia for serif accents.
 *   • 8-color editorial palette (indigo / coral / amber / teal / olive / etc.)
 *   • Multiple slide masters (dark hero, light editorial, sidebar)
 *   • Icon/pictogram SVG library (factory, dike, coin, person, scale, …)
 *   • FT-style annotated charts (inline callouts with arrows)
 *
 * Two color namespaces to avoid the #-prefix footgun:
 *   PC.xxx → bare hex for PptxGenJS options ("0B1B3D")
 *   SC.xxx → #-prefixed hex for SVG strings ("#0B1B3D")
 */

process.env.NODE_PATH = "C:/Users/meije/AppData/Roaming/npm/node_modules";
require("module").Module._initPaths();

const sharp = require("sharp");

// ═══════════════════════════════════════════════════════════════════════════
// COLOR PALETTE (editorial, semantic)
// ═══════════════════════════════════════════════════════════════════════════
const HEX = {
  // Core brand
  indigo:       "0B1B3D",
  indigoDeep:   "050F25",
  indigoMid:    "1B3060",
  indigoSoft:   "3A4F7F",

  // Accents
  coral:        "FF6B5B",
  coralDeep:    "D94A3A",
  amber:        "F4B740",
  amberDeep:    "C78E1F",
  teal:         "0FA3A3",
  tealDeep:     "076E6E",
  olive:        "5B7F3D",
  oliveDeep:    "3E5A26",
  plum:         "6E2E8A",

  // Neutrals
  ink:          "0A0E1A",        // primary text on light
  paper:        "F9F7F1",        // off-white bg (warmer than white)
  paperMid:     "EDEAE3",        // light panels
  chalk:        "FFFFFF",        // pure white for emphasis
  smoke:        "2D3748",        // secondary dark text
  cloud:        "D4D1CA",        // dividers on paper
  ash:          "8B8779",        // muted labels
  sky:          "E8F0F7",        // ultra-light blue accent panels

  // Semantic (state)
  goodBg:       "E8F4EC",
  goodInk:      "2E5E3A",
  warnBg:       "FDF3E0",
  warnInk:      "8A5A0E",
  badBg:        "FBEAE6",
  badInk:       "8B2A20",
};

// PptxGenJS variant — bare hex
const PC = { ...HEX };
// SVG variant — #-prefixed
const SC = Object.fromEntries(Object.entries(HEX).map(([k, v]) => [k, "#" + v]));

// ═══════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY (Segoe UI stack with Georgia serif accent)
// ═══════════════════════════════════════════════════════════════════════════
const FONT_SANS    = "Segoe UI";
const FONT_DISPLAY = "Segoe UI"; // Semibold/Bold via bold:true in PptxGenJS
const FONT_SERIF   = "Georgia";
const FONT_MONO    = "Consolas";

// Typography presets — spread into PptxGenJS addText options.
// Each preset sets fontFace + fontSize + bold + color + character spacing.
const T = {
  // Dark backgrounds
  heroDark:     { fontFace: FONT_DISPLAY, fontSize: 64, bold: true,  color: PC.chalk,   charSpacing: -2 },
  displayDark:  { fontFace: FONT_DISPLAY, fontSize: 44, bold: true,  color: PC.chalk,   charSpacing: -1 },
  headlineDark: { fontFace: FONT_DISPLAY, fontSize: 30, bold: true,  color: PC.chalk    },
  subheadDark:  { fontFace: FONT_SANS,    fontSize: 18,              color: PC.cloud    },
  bodyDark:     { fontFace: FONT_SANS,    fontSize: 16,              color: PC.paperMid },
  captionDark:  { fontFace: FONT_SANS,    fontSize: 12,              color: PC.cloud    },

  // Light backgrounds
  heroLight:    { fontFace: FONT_DISPLAY, fontSize: 64, bold: true,  color: PC.indigo,     charSpacing: -2 },
  displayLight: { fontFace: FONT_DISPLAY, fontSize: 40, bold: true,  color: PC.indigo,     charSpacing: -1 },
  headlineLight:{ fontFace: FONT_DISPLAY, fontSize: 28, bold: true,  color: PC.indigo     },
  subheadLight: { fontFace: FONT_SANS,    fontSize: 17,              color: PC.smoke      },
  bodyLight:    { fontFace: FONT_SANS,    fontSize: 15,              color: PC.ink        },
  captionLight: { fontFace: FONT_SANS,    fontSize: 11, italic: true,color: PC.ash        },

  // Accent / serif pull quotes
  pullQuote:    { fontFace: FONT_SERIF,   fontSize: 28, italic: true,color: PC.indigo,    charSpacing: -1 },

  // Numerical
  stat:         { fontFace: FONT_DISPLAY, fontSize: 180, bold: true, color: PC.chalk,     charSpacing: -6 },
  statMid:      { fontFace: FONT_DISPLAY, fontSize: 96,  bold: true, color: PC.chalk,     charSpacing: -3 },
  statSmall:    { fontFace: FONT_DISPLAY, fontSize: 48,  bold: true, color: PC.indigo,    charSpacing: -2 },

  // UI
  labelUpper:   { fontFace: FONT_SANS,    fontSize: 10, bold: true,  color: PC.ash,       charSpacing: 2 },
  kicker:       { fontFace: FONT_SANS,    fontSize: 11, bold: true,  color: PC.coral,     charSpacing: 3 },

  // Code / formulas
  mono:         { fontFace: FONT_MONO,    fontSize: 14,              color: PC.ink        },
};

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE MASTERS
// ═══════════════════════════════════════════════════════════════════════════
function defineMasters(pres, opts = {}) {
  // Footer labels — override via opts for non-§3.3 chapters
  const darkLabel  = opts.darkLabel  || "PARAGRAAF  ·  §3.3";
  const lightLabel = opts.lightLabel || "§ 3.3  ·  OVERHEID";

  // Full-bleed dark — section openers, hero stats, closing slides
  pres.defineSlideMaster({
    title: "DARK_HERO",
    background: { color: PC.indigoDeep },
    objects: [
      // Thin coral accent line along the top
      { rect: { x: 0, y: 0, w: 10, h: 0.03, fill: { color: PC.coral } } },
      // Subtle watermark-style paragraph id (bottom-left)
      { text: {
          text: darkLabel,
          options: { x: 0.4, y: 5.23, w: 4, h: 0.3,
            fontFace: FONT_SANS, fontSize: 9, color: PC.indigoSoft,
            charSpacing: 4, bold: true, margin: 0, valign: "middle" } } },
    ],
  });

  // Light editorial — main content slides, no heavy header bar
  pres.defineSlideMaster({
    title: "LIGHT_ED",
    background: { color: PC.paper },
    objects: [
      // Thin indigo hairline along the top
      { rect: { x: 0, y: 0, w: 10, h: 0.02, fill: { color: PC.indigo } } },
      // Footer: paragraph id on left
      { text: {
          text: lightLabel,
          options: { x: 0.4, y: 5.28, w: 4, h: 0.3,
            fontFace: FONT_SANS, fontSize: 9, color: PC.ash,
            charSpacing: 3, bold: true, margin: 0, valign: "middle" } } },
    ],
  });

  // Sidebar — main content + persistent sidebar with section context
  pres.defineSlideMaster({
    title: "SIDEBAR",
    background: { color: PC.paper },
    objects: [
      // Sidebar column (dark, vertical)
      { rect: { x: 0, y: 0, w: 2.0, h: 5.625, fill: { color: PC.indigo } } },
      // Coral accent at the top of the sidebar
      { rect: { x: 0, y: 0, w: 2.0, h: 0.06, fill: { color: PC.coral } } },
    ],
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SHADOW + EFFECTS FACTORIES (PptxGenJS mutates options — always fresh)
// ═══════════════════════════════════════════════════════════════════════════
const softShadow = () => ({ type: "outer", color: "000000", blur: 10, offset: 3, angle: 90, opacity: 0.12 });
const tightShadow = () => ({ type: "outer", color: "000000", blur: 4, offset: 1, angle: 90, opacity: 0.08 });

// ═══════════════════════════════════════════════════════════════════════════
// SVG RASTERIZATION
// ═══════════════════════════════════════════════════════════════════════════
async function svgToPng(svg, w = 1440) {
  return sharp(Buffer.from(svg)).resize(w).png().toBuffer();
}
function pngB64(buf) { return "image/png;base64," + buf.toString("base64"); }
async function svgData(svg, w = 1440) { return pngB64(await svgToPng(svg, w)); }

// ═══════════════════════════════════════════════════════════════════════════
// PPTX POST-PROCESS — strip phantom Override entries from [Content_Types].xml
// and remove empty directories. PptxGenJS sometimes emits these; Microsoft
// PowerPoint shows "found a problem with content" when it does. LibreOffice
// tolerates them.
// ═══════════════════════════════════════════════════════════════════════════
const fs = require("fs");
const { execFileSync } = require("child_process");
const JSZip = require("C:/Users/meije/AppData/Roaming/npm/node_modules/pptxgenjs/node_modules/jszip");

async function fixPptxFile(pptxPath) {
  const buf = fs.readFileSync(pptxPath);
  const zip = await JSZip.loadAsync(buf);
  const present = new Set();
  zip.forEach((p, f) => { if (!f.dir) present.add("/" + p); });

  const ct = await zip.file("[Content_Types].xml").async("string");
  const re = /<Override\s+PartName="([^"]+)"\s+ContentType="[^"]*"\s*\/>/g;
  let removed = 0;
  const cleaned = ct.replace(re, (full, partName) => {
    if (present.has(partName)) return full;
    removed++;
    return "";
  });
  if (removed) zip.file("[Content_Types].xml", cleaned);

  // Drop empty directories
  const emptyDirs = [];
  zip.forEach((p, f) => {
    if (!f.dir) return;
    const prefix = p.endsWith("/") ? p : p + "/";
    let hasKid = false;
    zip.forEach((q) => { if (q !== p && q.startsWith(prefix)) hasKid = true; });
    if (!hasKid) emptyDirs.push(p);
  });
  for (const d of emptyDirs) zip.remove(d);

  const out = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  });
  fs.writeFileSync(pptxPath, out);
  return { removedOverrides: removed, removedEmptyDirs: emptyDirs.length };
}

// Round-trip through python-pptx to produce strictly Microsoft-compliant OOXML.
function roundtripWithPythonPptx(pptxPath) {
  const script = require("path").join(__dirname, "roundtrip-pptx.py");
  execFileSync("python", [script, pptxPath], { stdio: "pipe" });
}

// Round-trip through LibreOffice's pptx exporter. LibreOffice's Office Open
// XML filter produces Microsoft-compliant output — opening with PptxGenJS
// output, saving via LibreOffice, drops phantom Override entries, cleans up
// empty directories, and fixes other OOXML quirks that make PowerPoint
// display "Found a problem with content" repair dialogs.
//
// Requires LibreOffice to be installed and accessible at SOFFICE_PATH below.
function roundtripWithLibreOffice(pptxPath) {
  const path = require("path");
  const SOFFICE = "C:/Program Files/LibreOffice/program/soffice.exe";
  const uniq = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  const tmpDir = path.join(require("os").tmpdir(), "pptx-lores-" + uniq);
  const profileDir = path.join(require("os").tmpdir(), "lo-profile-" + uniq);
  fs.mkdirSync(tmpDir, { recursive: true });
  try {
    // -env:UserInstallation isolates the user profile so concurrent headless
    // invocations don't trip over each other's locks.
    const profileUri = "file:///" + profileDir.replace(/\\/g, "/");
    execFileSync(SOFFICE,
      ["-env:UserInstallation=" + profileUri,
       "--headless", "--convert-to", "pptx", "--outdir", tmpDir, pptxPath],
      { stdio: "pipe" });
    const outFile = path.join(tmpDir, path.basename(pptxPath));
    if (!fs.existsSync(outFile)) throw new Error("LibreOffice did not produce output file");
    fs.copyFileSync(outFile, pptxPath);
  } finally {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch {}
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SVG PICTOGRAM LIBRARY (24×24 grid, 2px stroke, monochrome by default)
// Every icon accepts a fill/stroke color. Returns a string you can drop into
// a larger SVG with <g transform="translate(x,y) scale(s)">${ICON.foo(color)}</g>
// ═══════════════════════════════════════════════════════════════════════════
const ICON = {
  factory: (c = SC.ink) => `
    <g fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 22h20"/>
      <path d="M4 22V10l5 3V10l5 3V8l6 4v10"/>
      <path d="M6 6v2"/><path d="M8 4v1"/>
      <path d="M14 14h1"/><path d="M18 14h1"/><path d="M14 18h1"/><path d="M18 18h1"/>
    </g>`,
  smokestack: (c = SC.ink, smoke = SC.ash) => `
    <g fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round">
      <path d="M6 22h12"/><path d="M8 22V8h8v14"/><path d="M10 12h4"/>
      <path d="M8 8l-2-2"/><path d="M16 8l2-2"/>
    </g>
    <g fill="none" stroke="${smoke}" stroke-width="1.8" stroke-linecap="round" opacity="0.7">
      <path d="M11 6c1-1 0-2 0-3"/>
      <path d="M14 6c1-2-1-3 0-4"/>
    </g>`,
  dike: (c = SC.ink, water = SC.teal) => `
    <g>
      <!-- water on left -->
      <path d="M0 16 Q3 14 6 16 T12 16" fill="none" stroke="${water}" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M0 19 Q3 17 6 19 T12 19" fill="none" stroke="${water}" stroke-width="1.8" stroke-linecap="round"/>
      <!-- dike (trapezoid) -->
      <path d="M10 22 L13 8 L18 8 L21 22 Z" fill="${c}" fill-opacity="0.14" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>
      <!-- grass top -->
      <path d="M13.5 8 Q15.5 7 17.5 8" stroke="${c}" stroke-width="1.6" fill="none"/>
    </g>`,
  coin: (c = SC.amberDeep) => `
    <g fill="none" stroke="${c}" stroke-width="2">
      <circle cx="12" cy="12" r="9"/>
      <path d="M15 8c-1-1-2-1-3-1s-3 1-3 3 3 2 4 3 3 1 3 3-2 3-4 3-3-1-3-1" stroke-linecap="round"/>
    </g>`,
  person: (c = SC.indigo) => `
    <g fill="${c}">
      <circle cx="12" cy="7" r="3.3"/>
      <path d="M5 22 Q5 13 12 13 Q19 13 19 22 Z"/>
    </g>`,
  personOutline: (c = SC.indigo) => `
    <g fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round">
      <circle cx="12" cy="7" r="3.3"/>
      <path d="M5 22 Q5 13 12 13 Q19 13 19 22"/>
    </g>`,
  scale: (c = SC.ink) => `
    <g fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3v18"/><path d="M7 21h10"/>
      <path d="M4 8h16"/>
      <path d="M4 8l-2 5a3 3 0 0 0 6 0z"/>
      <path d="M20 8l-2 5a3 3 0 0 0 6 0z"/>
    </g>`,
  badge: (c = SC.ink, accent = SC.coral) => `
    <g>
      <path d="M12 2l8 3v6c0 5-4 9-8 11-4-2-8-6-8-11V5z" fill="${c}" fill-opacity="0.08" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M9 12l2 2 4-4" fill="none" stroke="${accent}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`,
  syringe: (c = SC.teal) => `
    <g fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 3l5 5"/><path d="M14 5l5 5"/>
      <path d="M18 7 7 18a3 3 0 0 0 0 4h0"/>
      <path d="M3 21l3-3"/>
      <path d="M11 11l2 2"/>
    </g>`,
  lightbulb: (c = SC.amberDeep) => `
    <g fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 18h6"/><path d="M10 21h4"/>
      <path d="M7 12a5 5 0 1 1 10 0c0 2-1 3-2 4v2H9v-2c-1-1-2-2-2-4z"/>
    </g>`,
  arrowRight: (c = SC.ink) => `
    <g fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 12h16"/><path d="M14 6l6 6-6 6"/>
    </g>`,
  warning: (c = SC.coralDeep) => `
    <g fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3l10 17H2z"/>
      <path d="M12 10v4"/><circle cx="12" cy="17" r="0.5" fill="${c}"/>
    </g>`,
  check: (c = SC.goodInk) => `
    <g fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 13l4 4L20 7"/>
    </g>`,
  cross: (c = SC.coralDeep) => `
    <g fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round">
      <path d="M6 6l12 12"/><path d="M18 6L6 18"/>
    </g>`,
  eye: (c = SC.ink) => `
    <g fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </g>`,
  bank: (c = SC.ink) => `
    <g fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 10h18"/><path d="M5 10v8"/><path d="M9 10v8"/><path d="M15 10v8"/><path d="M19 10v8"/>
      <path d="M3 18h18"/><path d="M3 22h18"/><path d="M3 10L12 4l9 6"/>
    </g>`,
};

// Helper to inject an icon into an SVG string at a position/size
function placeIcon(iconSvg, x, y, size = 24) {
  const scale = size / 24;
  return `<g transform="translate(${x},${y}) scale(${scale})">${iconSvg}</g>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// CHART MATH
// ═══════════════════════════════════════════════════════════════════════════
function lineParams(x1, y1, x2, y2) {
  const m = (y2 - y1) / (x2 - x1);
  return { m, b: y1 - m * x1 };
}
function intersect(l1, l2) {
  const x = (l2.b - l1.b) / (l1.m - l2.m);
  return { x, y: l1.m * x + l1.b };
}

// ═══════════════════════════════════════════════════════════════════════════
// SVG BUILDING BLOCKS — shared across charts
// ═══════════════════════════════════════════════════════════════════════════
function svgHeader(w = 1280, h = 640, bg = SC.paper) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" font-family="Segoe UI, sans-serif">
  <rect x="0" y="0" width="${w}" height="${h}" fill="${bg}"/>
  <defs>
    <marker id="ah-ink" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${SC.ink}"/>
    </marker>
    <marker id="ah-coral" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${SC.coral}"/>
    </marker>
    <marker id="ah-smoke" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="${SC.smoke}"/>
    </marker>
  </defs>`;
}

// Editorial-style chart title
function editorialTitle(text, kicker, w = 1280) {
  return `
    <text x="80" y="52" font-family="Segoe UI" font-size="14" font-weight="700" fill="${SC.coral}" letter-spacing="3">${(kicker || "").toUpperCase()}</text>
    <text x="80" y="92" font-family="Segoe UI" font-size="28" font-weight="700" fill="${SC.indigo}">${text}</text>
    <line x1="80" y1="108" x2="${w - 80}" y2="108" stroke="${SC.cloud}" stroke-width="1"/>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════
module.exports = {
  PC, SC, HEX,
  FONT_SANS, FONT_DISPLAY, FONT_SERIF, FONT_MONO,
  T,
  defineMasters,
  softShadow, tightShadow,
  svgToPng, pngB64, svgData,
  ICON, placeIcon,
  lineParams, intersect,
  svgHeader, editorialTitle,
  fixPptxFile, roundtripWithPythonPptx, roundtripWithLibreOffice,
};
