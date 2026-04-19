/**
 * Shared SVG utilities for all builders that produce graphics.
 *
 * Usage:
 *   const { svgToPng, pngToBase64, GRAPH_COLORS } = require('./lib-svg-utils');
 *
 * This library replaces the inline svgToPng / pngToBase64 / color-palette
 * copies that previously lived in every pptx-*.js and nieuws-*.js script.
 * Import it — don't copy it.
 */

const sharp = require("sharp");

// ═══════════════════════════════════════════════════════════════════════════
// SVG → PNG PIPELINE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Render an SVG string to a PNG buffer.
 * @param {string} svgStr  - Complete SVG markup
 * @param {number} [width=720] - Output width in pixels (height scales proportionally)
 * @returns {Promise<Buffer>} PNG image buffer
 */
async function svgToPng(svgStr, width = 720) {
  return sharp(Buffer.from(svgStr)).resize(width).png().toBuffer();
}

/**
 * Convert a PNG buffer to a base64 data string for PptxGenJS / docx embedding.
 * @param {Buffer} buf - PNG buffer (from svgToPng)
 * @returns {string} Data URI string: "image/png;base64,..."
 */
function pngToBase64(buf) {
  return "image/png;base64," + buf.toString("base64");
}

// ═══════════════════════════════════════════════════════════════════════════
// STANDARD GRAPH COLOR PALETTE
// ═══════════════════════════════════════════════════════════════════════════
// Matches the canonical palette from skills/economic-graph.md.
// All values include the # prefix for direct use in SVG markup.

const GRAPH_COLORS = {
  demand:      "#1A5276",
  supply:      "#1E8449",
  supplyNew:   "#E67E22",
  cost:        "#E67E22",
  costAvg:     "#D9534F",
  revenue:     "#7B2D8E",
  axis:        "#2D3748",
  grid:        "#CBD5E0",
  label:       "#718096",
  title:       "#1E2761",
  bg:          "#F7FAFC",
  surplus:     "#85C1E9",
  prodSurplus: "#82E0AA",
  loss:        "#F1948A",
  tax:         "#F8C471",
};

module.exports = { svgToPng, pngToBase64, GRAPH_COLORS };
