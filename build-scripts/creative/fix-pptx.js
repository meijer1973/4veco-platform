/**
 * fix-pptx.js — post-process PptxGenJS output to remove OOXML issues that
 * make Microsoft PowerPoint show "found a problem with content" dialogs.
 *
 * Issues fixed:
 *   1. Phantom slideMaster2..N Override entries in [Content_Types].xml for
 *      slideMaster files that don't exist.
 *   2. Empty charts/ and embeddings/ directories (PptxGenJS artifact).
 *   3. Any other Override entry pointing to a missing part.
 *
 * LibreOffice tolerates all three. Microsoft PowerPoint does not (it triggers
 * repair mode and sometimes fails to recover content).
 *
 * Usage:
 *   node fix-pptx.js /path/to/file.pptx [/path/to/other.pptx ...]
 */

process.env.NODE_PATH = "C:/Users/meije/AppData/Roaming/npm/node_modules";
require("module").Module._initPaths();

const fs = require("fs");
const path = require("path");
const JSZip = require("C:/Users/meije/AppData/Roaming/npm/node_modules/pptxgenjs/node_modules/jszip");

async function fixPptx(inPath) {
  const buf = fs.readFileSync(inPath);
  const zip = await JSZip.loadAsync(buf);

  // Collect actual file parts (skip directories)
  const presentParts = new Set();
  zip.forEach((relPath, file) => {
    if (!file.dir) presentParts.add("/" + relPath);
  });

  // Read and rewrite [Content_Types].xml
  const ctFile = zip.file("[Content_Types].xml");
  if (!ctFile) throw new Error("[Content_Types].xml missing");
  let ct = await ctFile.async("string");

  // Parse Override entries, drop any pointing to a part that doesn't exist
  const overrideRe = /<Override\s+PartName="([^"]+)"\s+ContentType="[^"]*"\s*\/>/g;
  const removed = [];
  const kept = ct.replace(overrideRe, (full, partName) => {
    if (presentParts.has(partName)) return full;
    removed.push(partName);
    return "";
  });

  if (removed.length) {
    zip.file("[Content_Types].xml", kept);
    console.log(`  cleaned ${removed.length} phantom Override(s)`);
  }

  // Remove empty directories (some ZIP readers complain about them)
  // JSZip doesn't always emit them on save, but be explicit:
  const emptyDirs = [];
  zip.forEach((relPath, file) => {
    if (file.dir) {
      // Check if any file is inside this directory
      const prefix = relPath.endsWith("/") ? relPath : relPath + "/";
      let hasChildren = false;
      zip.forEach((p) => { if (p !== relPath && p.startsWith(prefix)) hasChildren = true; });
      if (!hasChildren) emptyDirs.push(relPath);
    }
  });
  for (const d of emptyDirs) {
    zip.remove(d);
    console.log(`  removed empty dir: ${d}`);
  }

  // Re-zip (preserve deflate settings)
  const out = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  });
  fs.writeFileSync(inPath, out);
}

async function main() {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("Usage: fix-pptx.js <file1.pptx> [file2.pptx ...]");
    process.exit(1);
  }
  for (const f of files) {
    console.log(`Fixing ${path.basename(f)}`);
    try {
      await fixPptx(f);
      console.log(`  ok`);
    } catch (e) {
      console.error(`  FAILED: ${e.message}`);
      process.exitCode = 1;
    }
  }
}
main();
