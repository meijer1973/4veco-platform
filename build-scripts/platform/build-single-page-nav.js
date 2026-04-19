/**
 * Generate a single-page HTML navigation for GitHub Pages.
 * Scans the module folder, builds collapsible accordion with file links.
 *
 * Run: node build-scripts/build-single-page-nav.js
 */
const fs = require("fs");
const path = require("path");

const MODULE = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.join(__dirname, "..");
const OUT = path.join(MODULE, "index.html");

// Chapter colors matching the domain system
const CH_COLORS = {
  "3.1": { main: "#17A2B8", light: "#E8F8FB", dark: "#117A8B", name: "Markten" },
  "3.2": { main: "#1A5276", light: "#EBF5FB", dark: "#154360", name: "Marktvormen" },
  "3.3": { main: "#E67E22", light: "#FEF5E7", dark: "#BA6A1C", name: "Overheid" },
  "3.4": { main: "#1E8449", light: "#E8F8F0", dark: "#186A3B", name: "Internationale markten" },
};

// File type icons (Unicode)
const ICONS = {
  ".pptx": "\uD83D\uDCCA", // chart
  ".docx": "\uD83D\uDCC4", // page
  ".html": "\uD83C\uDF10", // globe
  ".pdf":  "\uD83D\uDCC4",
  ".zip":  "\uD83D\uDCE6",
};

const SKIP = new Set(["desktop.ini", "index.html", ".claude", "Thumbs.db"]);

function getIcon(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ICONS[ext] || "\uD83D\uDCC1";
}

function encPath(p) {
  return p.split("/").map(s => encodeURIComponent(s)).join("/");
}

// Scan the module folder
function scanModule() {
  const chapters = [];
  const entries = fs.readdirSync(MODULE, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^3\.\d+ Hoofdstuk/.test(d.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const chDir of entries) {
    const chNum = chDir.name.match(/^(3\.\d+)/)[1];
    const chName = chDir.name.replace(/^3\.\d+\s+Hoofdstuk\s+\d+\s*-\s*/, "");
    const chPath = path.join(MODULE, chDir.name);
    const color = CH_COLORS[chNum] || CH_COLORS["3.1"];

    const paragraphs = [];
    const parDirs = fs.readdirSync(chPath, { withFileTypes: true })
      .filter(d => d.isDirectory() && /^3\.\d+\.\d+ Paragraaf/.test(d.name))
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const parDir of parDirs) {
      const parNum = parDir.name.match(/^(3\.\d+\.\d+)/)[1];
      const parName = parDir.name.replace(/^3\.\d+\.\d+\s+Paragraaf\s+\d+\s*-\s*/, "");
      const parPath = path.join(chPath, parDir.name);

      const phases = [];
      const phaseDirs = fs.readdirSync(parPath, { withFileTypes: true })
        .filter(d => d.isDirectory() && /^\d+\./.test(d.name))
        .sort((a, b) => a.name.localeCompare(b.name));

      for (const phDir of phaseDirs) {
        const phPath = path.join(parPath, phDir.name);
        const files = scanFiles(phPath, `${chDir.name}/${parDir.name}/${phDir.name}`);
        phases.push({ name: phDir.name, files });
      }

      // Also scan root-level files in paragraph folder
      const rootFiles = fs.readdirSync(parPath, { withFileTypes: true })
        .filter(d => d.isFile() && !SKIP.has(d.name))
        .map(d => ({
          name: d.name,
          href: `${chDir.name}/${parDir.name}/${d.name}`,
          icon: getIcon(d.name),
        }));

      paragraphs.push({ num: parNum, name: parName, folder: parDir.name, phases, rootFiles });
    }

    // Chapter-level files
    const chFiles = fs.readdirSync(chPath, { withFileTypes: true })
      .filter(d => d.isFile() && !SKIP.has(d.name))
      .map(d => ({
        name: d.name,
        href: `${chDir.name}/${d.name}`,
        icon: getIcon(d.name),
      }));

    chapters.push({ num: chNum, name: chName, folder: chDir.name, color, paragraphs, files: chFiles });
  }

  return chapters;
}

function scanFiles(dirPath, relPrefix) {
  const result = [];
  if (!fs.existsSync(dirPath)) return result;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(d => !SKIP.has(d.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    if (entry.isFile()) {
      result.push({
        name: entry.name,
        href: `${relPrefix}/${entry.name}`,
        icon: getIcon(entry.name),
      });
    } else if (entry.isDirectory()) {
      // Subfolders like basisopgaven, middenopgaven, etc.
      const subFiles = fs.readdirSync(path.join(dirPath, entry.name), { withFileTypes: true })
        .filter(d => d.isFile() && !SKIP.has(d.name))
        .sort((a, b) => a.name.localeCompare(b.name));
      for (const sf of subFiles) {
        result.push({
          name: sf.name,
          href: `${relPrefix}/${entry.name}/${sf.name}`,
          icon: getIcon(sf.name),
          sub: entry.name,
        });
      }
    }
  }
  return result;
}

function phaseName(raw) {
  if (raw.startsWith("1.")) return "Voorbereiden";
  if (raw.startsWith("2.")) return "Leren";
  if (raw.startsWith("3.")) return "Oefenen";
  return raw;
}

function phaseIcon(raw) {
  if (raw.startsWith("1.")) return "\uD83D\uDD0D"; // magnifying glass
  if (raw.startsWith("2.")) return "\uD83D\uDCDA"; // books
  if (raw.startsWith("3.")) return "\u270D\uFE0F";  // writing hand
  return "\uD83D\uDCC1";
}

// Build HTML
function buildHTML(chapters) {
  const chapterCards = chapters.map(ch => {
    const parSections = ch.paragraphs.map(par => {
      const phaseSections = par.phases.map(ph => {
        if (ph.files.length === 0) return "";
        const fileItems = ph.files.map(f => {
          const label = f.name.replace(/^3\.\d+\.\d+\s+/, "").replace(/\.\w+$/, "");
          const ext = path.extname(f.name).toLowerCase().replace(".", "").toUpperCase();
          const sub = f.sub ? `<span class="badge">${f.sub}</span> ` : "";
          return `<a class="file" href="${encPath(f.href)}" target="_blank">${f.icon} ${sub}${esc(label)} <span class="ext">${ext}</span></a>`;
        }).join("\n          ");
        return `
        <div class="phase">
          <div class="phase-title">${phaseIcon(ph.name)} ${phaseName(ph.name)}</div>
          ${fileItems}
        </div>`;
      }).join("");

      return `
      <details class="par">
        <summary style="border-left-color:${ch.color.main}">
          <span class="par-num">${par.num}</span> ${esc(par.name)}
        </summary>
        <div class="par-body">${phaseSections}</div>
      </details>`;
    }).join("");

    const chFileItems = ch.files.length > 0 ? `
      <div class="phase ch-files">
        <div class="phase-title">\uD83D\uDCC1 Hoofdstuk-bestanden</div>
        ${ch.files.map(f => {
          const ext = path.extname(f.name).toLowerCase().replace(".", "").toUpperCase();
          return `<a class="file" href="${encPath(f.href)}" target="_blank">${f.icon} ${esc(f.name.replace(/\.\w+$/, ""))} <span class="ext">${ext}</span></a>`;
        }).join("\n        ")}
      </div>` : "";

    return `
    <details class="chapter" open>
      <summary style="background:${ch.color.main}">
        <span class="ch-num">H${ch.num.split(".")[1]}</span> ${esc(ch.name)}
      </summary>
      <div class="ch-body">
        ${chFileItems}
        ${parSections}
      </div>
    </details>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Module 3 \u2014 Markt en overheid</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,Helvetica,sans-serif;background:#f0f2f5;color:#2D3748;line-height:1.5}
.hero{background:#1E2761;color:#fff;padding:2rem 1.5rem 1.5rem;text-align:center}
.hero h1{font-size:1.8rem;margin-bottom:.3rem}
.hero p{color:#718096;font-size:1rem}
.container{max-width:900px;margin:0 auto;padding:1rem}
.search{width:100%;padding:.75rem 1rem;border:2px solid #CBD5E0;border-radius:8px;font-size:1rem;margin-bottom:1rem;outline:none}
.search:focus{border-color:#1A5276}
details{margin-bottom:.5rem}
summary{cursor:pointer;list-style:none;user-select:none}
summary::-webkit-details-marker{display:none}
summary::before{content:"\\25B6";display:inline-block;margin-right:.5rem;transition:transform .2s;font-size:.7em}
details[open]>summary::before{transform:rotate(90deg)}
.chapter>summary{color:#fff;padding:.8rem 1rem;border-radius:8px;font-size:1.1rem;font-weight:bold;display:flex;align-items:center;gap:.5rem}
.ch-num{background:rgba(255,255,255,.2);padding:.1rem .5rem;border-radius:4px;font-size:.85rem}
.ch-body{padding:.5rem 0 .5rem 0}
.par>summary{background:#fff;padding:.6rem 1rem;border-radius:6px;margin:.3rem 0;border-left:4px solid #ccc;font-weight:600;font-size:.95rem;display:flex;align-items:center;gap:.5rem;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.par>summary:hover{background:#f7f8fa}
.par-num{color:#718096;font-weight:400;font-size:.85rem;min-width:2.5rem}
.par-body{padding:.3rem 0 .3rem 1.2rem}
.phase{margin:.4rem 0}
.phase-title{font-size:.85rem;font-weight:600;color:#718096;padding:.3rem 0;text-transform:uppercase;letter-spacing:.03em}
.file{display:block;padding:.45rem .7rem;margin:.15rem 0;background:#fff;border-radius:5px;text-decoration:none;color:#2D3748;font-size:.88rem;border:1px solid #e2e8f0;transition:all .15s}
.file:hover{background:#EBF5FB;border-color:#1A5276;transform:translateX(3px)}
.ext{float:right;font-size:.7rem;color:#718096;background:#f0f2f5;padding:.1rem .4rem;border-radius:3px}
.badge{font-size:.7rem;color:#fff;background:#E67E22;padding:.1rem .4rem;border-radius:3px;vertical-align:middle}
.ch-files{margin-bottom:.5rem}
.hidden{display:none}
footer{text-align:center;padding:2rem;color:#718096;font-size:.8rem}
@media(max-width:600px){
  .hero h1{font-size:1.4rem}
  .container{padding:.5rem}
  .file{font-size:.82rem;padding:.4rem .5rem}
}
</style>
</head>
<body>

<div class="hero">
  <h1>Module 3 \u2014 Markt en overheid</h1>
  <p>Praktische Economie VWO 4</p>
</div>

<div class="container">
  <input type="text" class="search" placeholder="Zoek materiaal..." id="search" autocomplete="off">
  ${chapterCards}
</div>

<footer>Economie VWO 4 \u2014 Lesmateriaal Module 3</footer>

<script>
document.getElementById("search").addEventListener("input",function(){
  const q=this.value.toLowerCase().trim();
  document.querySelectorAll(".file").forEach(f=>{
    f.classList.toggle("hidden",q&&!f.textContent.toLowerCase().includes(q));
  });
  if(q){
    document.querySelectorAll("details").forEach(d=>d.open=true);
  }
});
</script>
</body>
</html>`;
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Main
const chapters = scanModule();
const html = buildHTML(chapters);
fs.writeFileSync(OUT, html, "utf8");
console.log(`Generated: index.html (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
console.log(`Chapters: ${chapters.length}, Paragraphs: ${chapters.reduce((s, c) => s + c.paragraphs.length, 0)}`);
