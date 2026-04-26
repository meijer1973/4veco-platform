/**
 * b1-111-youtube-videos.js
 * ══════════════════════════════════════════════════════════════════════
 * Generates the YouTube-video's overview page for Boek 1 §1.1.1
 * "Schaarste en economisch denken".
 *
 * The page lists three Dutch-language educational videos chosen per the
 * selection criteria in `b1-111-youtube-videos.md` (search URLs are used
 * as stable references; refresh procedure lives in that markdown file).
 *
 * Uses the shared companion engine (engines/voorkennis.css) so the page
 * adopts the same sidebar, hero band, callout, and light/dark theming as
 * every other §1.1.1 companion surface.
 *
 * Run from 4veco-platform/:
 *   node build-scripts/content/book-1/b1-111-youtube-videos.js
 * ══════════════════════════════════════════════════════════════════════
 */

const fs = require("fs");
const path = require("path");

const PARAGRAAF_NR = "1.1.1";
const ONDERWERP = "Schaarste en economisch denken";
const CHAPTER_FULL = "1.1 Hoofdstuk Economisch denken en rekenen";

// Accent token mirrors the shared voorkennis.css tokens and is kept in sync
// with the paragraaf-level landing page. Deploy-config says the chapter domain
// is "teal" which build-landing-page.js maps to "wiskunde" — the three
// page-level surfaces (index.html, begeleide inoefening, youtube-videos)
// therefore all render with the same accent.
const ACCENT = "wiskunde";

const OUTPUT_DIR = path.resolve(
  __dirname,
  "../../../../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken"
);
const OUTPUT_FILE = path.join(
  OUTPUT_DIR,
  `${PARAGRAAF_NR} ${ONDERWERP} – youtube-videos.html`
);

const VIDEOS = [
  {
    title: "Schaarste — wat is het en waarom moeten we kiezen?",
    channel: "Ikbeneconomie (Nederlandstalig VWO/HAVO)",
    href: "https://www.youtube.com/results?search_query=schaarste+economie+VWO",
    description:
      "Introductie van het begrip <strong>schaarste</strong>: behoeften zijn onbegrensd, maar tijd, geld en grondstoffen zijn beperkt. De video laat met voorbeelden (zakgeld, studietijd, land) zien dat schaarste niet hetzelfde is als &quot;weinig&quot;, en dat schaarste altijd keuzes afdwingt. Sluit direct aan op concept 1 van paragraaf 1.1.1.",
  },
  {
    title: "Alternatieve kosten — wat geef je op als je kiest?",
    channel: "Havisten Economie / Economie VMBO VWO (Peter Boerman)",
    href: "https://www.youtube.com/results?search_query=alternatieve+kosten+economie",
    description:
      "Uitleg van <strong>alternatieve kosten</strong> met sprekende voorbeelden: een boer die tussen tarwe en ma&iuml;s kiest, of een scholier die een avond moet verdelen over leren en sporten. De video benadrukt de valkuil dat alternatieve kosten niet de prijs zijn, maar de opbrengst van het <em>beste niet-gekozen alternatief</em>. Sluit aan op concept 2.",
  },
  {
    title: "Economisch denken — systematisch kiezen in 3 stappen",
    channel: "Studyflix Nederland / Ikbeneconomie",
    href: "https://www.youtube.com/results?search_query=economisch+denken+alternatieven+kiezen",
    description:
      "De <strong>3-stappenprocedure</strong> van economisch denken: (1) welke alternatieven heb je? (2) wat levert elk alternatief op? (3) wat geef je op bij je keuze? De video laat zien hoe je met deze procedure een keuze uitwerkt, bijvoorbeeld bij de besteding van een beperkt budget. Sluit aan op concept 3 en de worked example (tarwe vs ma&iuml;s).",
  },
];

function esc(s) {
  return String(s).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[ch]));
}

function renderVideoCard(v, i) {
  return `        <article class="video-card">
          <a class="video-thumb" href="${esc(v.href)}" target="_blank" rel="noopener" aria-label="Open video ${i + 1} op YouTube">
            <svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4"/></svg>
          </a>
          <div class="video-body">
            <h3><a href="${esc(v.href)}" target="_blank" rel="noopener">${esc(v.title)}</a></h3>
            <p class="video-channel">Kanaal: ${esc(v.channel)}</p>
            <p class="video-description">${v.description}</p>
            <a class="video-cta" href="${esc(v.href)}" target="_blank" rel="noopener">&#9654;&nbsp;Bekijk op YouTube</a>
          </div>
        </article>`;
}

function renderHTML() {
  const cards = VIDEOS.map(renderVideoCard).join("\n");

  return `<!DOCTYPE html>
<html lang="nl" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script>(function(){try{var m=localStorage.getItem('quizMode')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',m);}catch(e){}})();</script>
<title>${PARAGRAAF_NR} ${esc(ONDERWERP)} – YouTube-video's</title>
<link rel="stylesheet" href="../../shared/voorkennis.css">
<style>
  .video-grid {
    display: grid; gap: 1rem;
    grid-template-columns: 1fr;
  }
  .video-card {
    display: flex; gap: 1rem;
    background: var(--bg-lift);
    border: 1px solid var(--border);
    border-left: 4px solid var(--accent);
    border-radius: 10px;
    padding: 1rem 1.1rem;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .video-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  }
  .video-thumb {
    flex-shrink: 0;
    width: 180px; height: 108px;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dk, var(--accent)));
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    text-decoration: none;
    transition: opacity 0.15s;
  }
  .video-thumb:hover { opacity: 0.88; }
  .video-thumb svg {
    width: 44px; height: 44px;
    fill: currentColor; stroke: none;
  }
  .video-body { flex: 1; min-width: 0; }
  .video-body h3 {
    font-size: 1.02rem; font-weight: 600;
    color: var(--ink); margin: 0 0 0.25rem;
  }
  .video-body h3 a { color: inherit; text-decoration: none; }
  .video-body h3 a:hover { color: var(--accent); text-decoration: underline; }
  .video-channel {
    font-size: 0.78rem; font-weight: 600;
    color: var(--accent);
    margin: 0 0 0.5rem;
  }
  .video-description {
    font-size: 0.88rem; line-height: 1.55;
    color: var(--ink-soft);
    margin: 0 0 0.7rem;
  }
  .video-cta {
    display: inline-block;
    background: var(--accent); color: #fff;
    padding: 0.45rem 0.95rem;
    border-radius: 6px;
    font-size: 0.82rem; font-weight: 600;
    text-decoration: none;
    transition: opacity 0.15s;
  }
  .video-cta:hover { opacity: 0.9; }

  @media (max-width: 560px) {
    .video-card { flex-direction: column; }
    .video-thumb { width: 100%; height: 140px; }
  }
</style>
</head>
<body data-layout="youtube-v1" data-accent-domain="${ACCENT}">

<div class="page-layout">
  <div class="content">
    <header class="hero">
      <div class="hero-inner">
        <a class="back-link" href="index.html"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg> Terug naar overzicht</a>
        <span class="hero-badge">${PARAGRAAF_NR} &middot; YouTube-video's</span>
        <h1>${esc(ONDERWERP)} &mdash; Video-uitleg</h1>
        <p class="hero-sub">Drie korte Nederlandstalige filmpjes bij de kernbegrippen van deze paragraaf.</p>
      </div>
    </header>

    <main>
      <section class="section">
        <div class="section-header border-${ACCENT}">
          <span class="section-num bg-${ACCENT}">1</span>
          <div class="section-title-group">
            <div class="section-title">Over deze video's</div>
            <span class="section-badge">${esc(CHAPTER_FULL)}</span>
          </div>
        </div>
        <div class="callout callout-tip">
          <span class="callout-icon">&#10024;</span>
          <strong>Tip:</strong> bekijk de video's als extra uitleg naast de lestekst, of om de theorie
          te herhalen voor een toets. De drie video's vullen elkaar aan &mdash; samen dekken ze
          schaarste, alternatieve kosten en de 3-stappenprocedure van economisch denken.
        </div>
      </section>

      <section class="section">
        <div class="section-header border-${ACCENT}">
          <span class="section-num bg-${ACCENT}">2</span>
          <div class="section-title-group">
            <div class="section-title">Video-lijst</div>
            <span class="section-badge">Schaarste &middot; Alternatieve kosten &middot; Economisch denken</span>
          </div>
        </div>
        <div class="video-grid">
${cards}
        </div>
      </section>
    </main>
  </div>
</div>

<script src="../../shared/voorkennis.js"></script>
</body>
</html>`;
}

function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.error(`[ERROR] Output dir missing: ${OUTPUT_DIR}`);
    process.exit(1);
  }
  const html = renderHTML();
  fs.writeFileSync(OUTPUT_FILE, html, "utf8");
  console.log(`[write] ${path.relative(process.cwd(), OUTPUT_FILE)} (${(html.length / 1024).toFixed(1)} KB)`);
  console.log(`[info]  ${VIDEOS.length} video entries, accent=${ACCENT}`);
}

main();
