/**
 * Restyle all instapquiz.html files to use the domain-based color system.
 *
 * Domain mapping per chapter:
 *   3.1 Markten          → Teal (#17A2B8)
 *   3.2 Marktvormen      → Blue (#1A5276)
 *   3.3 Overheid         → Amber (#E67E22)
 *   3.4 Internationale   → Green (#1E8449)
 *
 * Note: 3.2.4 was already restyled manually as amber, but the correct domain
 * for 3.2 (Marktanalyse) is Blue. This script applies the correct domain colors.
 *
 * Run: NODE_PATH="$(npm root -g)" node build-scripts/restyle-instapquiz.js
 */

const fs = require("fs");
const path = require("path");

// ═══════════════════════════════════════════════════════════
// DOMAIN COLOR SYSTEM (matches econ-pptx-templates)
// ═══════════════════════════════════════════════════════════

const DOMAINS = {
  "3.1": {
    label: "Markten",
    primary: "#17A2B8",
    primaryDk: "#117A8B",
    primaryLt: "#E8F8FB",
    accent: "#F8C471",
    navy: "#1E2761",
  },
  "3.2": {
    label: "Marktanalyse",
    primary: "#1A5276",
    primaryDk: "#154360",
    primaryLt: "#EBF5FB",
    accent: "#85C1E9",
    navy: "#1E2761",
  },
  "3.3": {
    label: "Overheid",
    primary: "#E67E22",
    primaryDk: "#BA6A1C",
    primaryLt: "#FEF5E7",
    accent: "#F8C471",
    navy: "#1E2761",
  },
  "3.4": {
    label: "Internationale markten",
    primary: "#1E8449",
    primaryDk: "#186A3B",
    primaryLt: "#E8F8F0",
    accent: "#82E0AA",
    navy: "#1E2761",
  },
};

// 5 rotating category colors per quiz (from the shared palette)
const CAT_PALETTE = [
  { bg: "#FEF5E7", text: "#BA6A1C", bar: "#E67E22" },   // amber
  { bg: "#EBF5FB", text: "#154360", bar: "#1A5276" },    // blue
  { bg: "#E8F8FB", text: "#117A8B", bar: "#17A2B8" },    // teal
  { bg: "#E8F8F0", text: "#186A3B", bar: "#1E8449" },    // green
  { bg: "#F3E8F9", text: "#7B2D8E", bar: "#7B2D8E" },    // purple
];

// ═══════════════════════════════════════════════════════════
// FIND ALL INSTAPQUIZ FILES
// ═══════════════════════════════════════════════════════════

function findFiles(dir, pattern) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== ".git") results.push(...findFiles(full, pattern));
    else if (entry.name.includes(pattern)) results.push(full);
  }
  return results;
}

const ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, "..");
const files = findFiles(ROOT, "instapquiz.html").sort();

console.log(`Found ${files.length} instapquiz files.\n`);

// ═══════════════════════════════════════════════════════════
// TRANSFORM EACH FILE
// ═══════════════════════════════════════════════════════════

let processed = 0;
let skipped = 0;

for (const filePath of files) {
  let html = fs.readFileSync(filePath, "utf8");

  // Extract paragraph number (e.g. "3.2.4")
  const parMatch = filePath.match(/(\d+\.\d+\.\d+)/);
  if (!parMatch) { console.log(`SKIP (no par nr): ${filePath}`); skipped++; continue; }
  const parNr = parMatch[1];
  const chapter = parNr.split(".").slice(0, 2).join(".");
  const domain = DOMAINS[chapter];
  if (!domain) { console.log(`SKIP (no domain for ${chapter}): ${filePath}`); skipped++; continue; }

  // Extract paragraph name from filename
  const baseName = path.basename(filePath);
  const nameMatch = baseName.match(/\d+\.\d+\.\d+\s+(.+?)\s+[–—-]\s+instapquiz/);
  const parName = nameMatch ? nameMatch[1] : parNr;

  // Extract categories from questionBank
  const catMatches = html.match(/"category"\s*:\s*"([^"]+)"/g) || [];
  const categories = [...new Set(catMatches.map(c => c.replace(/"category"\s*:\s*"/, "").replace(/"$/, "")))];

  // Build catColors map
  const catColorsMap = {};
  categories.forEach((cat, i) => {
    catColorsMap[cat] = CAT_PALETTE[i % CAT_PALETTE.length];
  });

  // ── CSS replacements ──

  // Header: blue → navy + domain accent stripe
  // Handle both original blue and already-restyled versions
  html = html.replace(
    /\.header\s*\{[^}]*\}/,
    `.header { background-color: ${domain.navy}; color: white; padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; z-index: 10; flex-shrink: 0; border-bottom: 4px solid ${domain.primary}; }`
  );

  // Button: blue → domain primary
  html = html.replace(
    /\.btn\s*\{[^}]*\}/,
    `.btn { background-color: ${domain.primary}; color: white; border: none; border-radius: 8px; padding: 12px 22px; font-size: 15px; font-weight: bold; cursor: pointer; transition: background-color 0.2s; font-family: 'Poppins', sans-serif; align-self: flex-end; margin-top: auto; }`
  );
  html = html.replace(
    /\.btn:hover\s*\{[^}]*\}/,
    `.btn:hover { background-color: ${domain.primaryDk}; }`
  );

  // Category badge: remove hardcoded colors (will be set by JS)
  html = html.replace(
    /\.category-badge\s*\{[^}]*\}/,
    `.category-badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }`
  );

  // Sidebar title: gray underline → domain primary
  html = html.replace(
    /\.sidebar-title\s*\{[^}]*\}/,
    `.sidebar-title { font-size: 18px; margin-bottom: 25px; color: #1e293b; border-bottom: 2px solid ${domain.primary}; padding-bottom: 10px; }`
  );

  // ── Header HTML ──

  // Replace header h1 content (handle various formats)
  html = html.replace(
    /<h1>[^<]*(?:<[^>]*>[^<]*)*<\/h1>/,
    `<h1><span style="background:${domain.primary};color:white;padding:3px 10px;border-radius:6px;font-size:16px;margin-right:10px;">${parNr}</span> ${parName} – Instapquiz</h1>`
  );

  // ── Start screen info box ──

  // Restyle the "Wat we gaan toetsen" box
  html = html.replace(
    /style="text-align: left; background: [^"]*; padding: 25px; border-radius: 12px; margin-bottom: 30px; border:[^"]*"/,
    `style="text-align: left; background: ${domain.primaryLt}; padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 1px solid ${domain.accent}; border-left: 5px solid ${domain.primary}"`
  );
  // Icon color
  html = html.replace(
    /fa-bullseye" style="color:[^"]*"/,
    `fa-bullseye" style="color:${domain.primary}"`
  );

  // ── End screen score color ──
  html = html.replace(
    /font-weight: bold; color: #[0-9a-fA-F]{6};"><\/span>/,
    `font-weight: bold; color: ${domain.primary};"></span>`
  );

  // ── JavaScript: inject catColors and update mastery + badge logic ──

  if (categories.length > 0) {
    const catColorsJSON = JSON.stringify(catColorsMap);

    // Add catColors after catNames definition
    if (!html.includes("catColors")) {
      html = html.replace(
        /(const catNames\s*=\s*\{[^}]+\};)/,
        `$1\n    const catColors = ${catColorsJSON};`
      );
    } else {
      // Already has catColors — replace it
      html = html.replace(
        /const catColors\s*=\s*\{[^;]+\};/,
        `const catColors = ${catColorsJSON};`
      );
    }

    // Update mastery dashboard to use per-category colors
    if (html.includes("'#3b82f6'")) {
      html = html.replace("'#3b82f6'", "(catColors[cat]||{bar:'" + domain.primary + "'}).bar");
    } else if (!html.includes("catColors[cat]")) {
      // If it still uses a hardcoded color for mastery bar
      html = html.replace(
        /let barColor=\(percentage===100\)\?'#10b981':'[^']+'/,
        `let barColor=(percentage===100)?'#10b981':(catColors[cat]||{bar:'${domain.primary}'}).bar`
      );
    }

    // Update category badge display to use per-category colors
    if (!html.includes("catBadge.style.backgroundColor")) {
      html = html.replace(
        /document\.getElementById\('category-display'\)\.innerText=`\$\{catNames\[currentQuestionData\.category\]\}/,
        `const cc=catColors[currentQuestionData.category]||{bg:'${domain.primaryLt}',text:'${domain.primaryDk}'};const catBadge=document.getElementById('category-display');catBadge.style.backgroundColor=cc.bg;catBadge.style.color=cc.text;catBadge.innerText=\`\${catNames[currentQuestionData.category]}`
      );
      // Remove the duplicate .innerText that's left over
      html = html.replace(
        /catBadge\.innerText=`\$\{catNames\[currentQuestionData\.category\]\}[^`]*`;[^;]*document\.getElementById\('category-display'\)\.innerText=[^;]+;/,
        (match) => match.split(";")[0] + ";"
      );
    }
  }

  fs.writeFileSync(filePath, html, "utf8");
  console.log(`✓ ${parNr} ${parName} (${domain.label}, ${categories.length} categories)`);
  processed++;
}

console.log(`\nDone: ${processed} processed, ${skipped} skipped.`);
