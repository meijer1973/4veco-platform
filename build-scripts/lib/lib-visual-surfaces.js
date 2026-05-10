/**
 * Shared companion-visual surfaces and themes.
 *
 * Usage:
 *   const { SURFACES, THEMES, esc, text, lineText, rect, frame } =
 *     require('../../lib/lib-visual-surfaces');
 *
 * This library is the single source of truth for
 *   - which output surfaces companion visuals support
 *     (slide / doc / summary / web_light / web_dark)
 *   - the light/dark color palette each surface draws from
 *   - a small set of SVG primitives (escape, text, rect, panel frame)
 *     that keep paragraph-specific renderers thin.
 *
 * Paragraph builders import this module rather than defining their own
 * SURFACES/THEMES. That way figures, worked examples, exercises, and the
 * news visual share one palette and one frame chrome per surface.
 */

const SURFACES = {
  slide:     { suffix: "slide",     w:  960, h: 648, pngW:  960, theme: "light" },
  doc:       { suffix: "doc",       w: 1000, h: 640, pngW: 1000, theme: "light" },
  summary:   { suffix: "summary",   w:  760, h: 440, pngW:  760, theme: "light", compact: true },
  web_light: { suffix: "web_light", w:  960, h: 540, pngW:  960, theme: "light" },
  web_dark:  { suffix: "web_dark",  w:  960, h: 540, pngW:  960, theme: "dark" },
};

const THEMES = {
  light: {
    bg:        "#fbf8ef",
    panel:     "#ffffff",
    ink:       "#1b1a17",
    soft:      "#4a463d",
    muted:     "#82796d",
    border:    "#d9d0be",
    grid:      "#e9dfcc",
    blue:      "#17A2B8",
    blueSoft:  "#dff6f8",
    green:     "#2f7d4a",
    greenSoft: "#e5f4ea",
    amber:     "#d08732",
    amberSoft: "#f5ead8",
    red:       "#c65345",
    redSoft:   "#f5dfdc",
    noteBg:    "#efe8d7",
  },
  dark: {
    bg:        "#0f1419",
    panel:     "#1c232c",
    ink:       "#f2efe8",
    soft:      "#c9c2b8",
    muted:     "#909aa8",
    border:    "#364253",
    grid:      "#2a3440",
    blue:      "#2dd4bf",
    blueSoft:  "#12333b",
    green:     "#4ade80",
    greenSoft: "#123022",
    amber:     "#fbbf24",
    amberSoft: "#352813",
    red:       "#fb7185",
    redSoft:   "#3a1720",
    noteBg:    "#0c1015",
  },
};

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function text(x, y, value, opts = {}) {
  const {
    size = 20,
    weight = 500,
    fill,
    anchor = "start",
    family = "Inter, Arial, sans-serif",
    style = "",
    spacing = 0,
  } = opts;
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" font-style="${style}" fill="${fill}">${esc(value)}</text>`;
}

function lineText(x, y, lines, opts = {}) {
  const gap = opts.gap || Math.round((opts.size || 18) * 1.35);
  return lines.map((line, i) => text(x, y + i * gap, line, opts)).join("");
}

function rect(x, y, w, h, fill, opts = {}) {
  const stroke = opts.stroke ? ` stroke="${opts.stroke}"` : "";
  const sw = opts.sw ? ` stroke-width="${opts.sw}"` : "";
  const dash = opts.dash ? ` stroke-dasharray="${opts.dash}"` : "";
  const opacity = opts.opacity ? ` opacity="${opts.opacity}"` : "";
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${opts.rx || 14}" fill="${fill}"${stroke}${sw}${dash}${opacity}/>`;
}

/**
 * Companion panel chrome: background, inner panel, label, title, subtitle.
 * Returns { t, m, contentY, header } so the caller can drop `header` into
 * the SVG and continue drawing content from y = contentY onward.
 *
 * Slide surface: the text chrome (label / title / subtitle) is suppressed
 * because the host slide's own kicker + title + definition bar already label
 * the visual. Chrome on top of chrome is the redundancy effect from the
 * teacher-supporting slides rules in the econ-pptx-templates skill.
 */
function frame(cfg, title, subtitle, accent) {
  const t = THEMES[cfg.theme];
  const m = cfg.compact ? 22 : 32;

  if (cfg.suffix === "slide") {
    const contentY = m + 18;
    const header = `
      <rect width="${cfg.w}" height="${cfg.h}" rx="${cfg.compact ? 20 : 28}" fill="${t.bg}"/>
      ${rect(m, m, cfg.w - 2 * m, cfg.h - 2 * m, t.panel, { stroke: t.border, sw: 1.5, rx: cfg.compact ? 18 : 24 })}
    `;
    return { t, m, contentY, header };
  }

  const titleSize = cfg.compact ? 25 : 34;
  const subtitleSize = cfg.compact ? 15 : 18;
  const contentY = cfg.compact ? 142 : 154;
  const header = `
    <rect width="${cfg.w}" height="${cfg.h}" rx="${cfg.compact ? 20 : 28}" fill="${t.bg}"/>
    ${rect(m, m, cfg.w - 2 * m, cfg.h - 2 * m, t.panel, { stroke: t.border, sw: 1.5, rx: cfg.compact ? 18 : 24 })}
    ${text(m + 32, m + 82, title, { size: titleSize, weight: 700, fill: t.ink, family: "Fraunces, Georgia, serif", style: "italic" })}
    ${text(m + 32, m + 114, subtitle, { size: subtitleSize, weight: 500, fill: t.soft })}
  `;
  return { t, m, contentY, header };
}

module.exports = {
  SURFACES,
  THEMES,
  esc,
  text,
  lineText,
  rect,
  frame,
};
