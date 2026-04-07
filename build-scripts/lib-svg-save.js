/**
 * lib-svg-save.js
 * ══════════════════════════════════════════════════════════════════════
 * Saves raw SVG strings to disk alongside build output for reuse in
 * other documents. SVGs are written to a svg/ subfolder.
 */
const fs = require("fs");
const path = require("path");

/**
 * @param {Array<{name: string, svg: string}>} entries
 * @param {string} outputDir - directory where the PPTX/DOCX lives
 */
function saveSvgFiles(entries, outputDir) {
  const svgDir = path.join(outputDir, "svg");
  if (!fs.existsSync(svgDir)) fs.mkdirSync(svgDir, { recursive: true });

  for (const { name, svg } of entries) {
    const filePath = path.join(svgDir, name.endsWith(".svg") ? name : name + ".svg");
    fs.writeFileSync(filePath, svg, "utf8");
  }
  console.log(`Saved ${entries.length} SVG file(s) to ${svgDir}`);
}

module.exports = { saveSvgFiles };
