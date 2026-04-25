/**
 * Visual variants for Book 1 paragraph 1.1.1.
 *
 * Builds companion-specific image variants from the textbook data. The Part A
 * SVGs remain source material for concepts and numbers; these outputs are
 * adapted for slides, Word documents, summary thumbnails, and themed web pages.
 *
 * Run from 4veco-platform/:
 *   node build-scripts/content/book-1/b1-111-visual-variants.js
 */
const fs = require("fs");
const path = require("path");

const NODE_PATH = path.join(process.env.APPDATA || "", "npm", "node_modules");
process.env.NODE_PATH = NODE_PATH;
require("module").Module._initPaths();

const { svgToPng } = require("../../lib/lib-svg-utils");
const {
  SURFACES,
  THEMES,
  text,
  lineText,
  rect,
  frame,
} = require("../../lib/lib-visual-surfaces");

const ASSETS_DIR = path.resolve(
  __dirname,
  "../../../../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod",
  "1.1 Hoofdstuk Economisch denken en rekenen",
  "1.1.1 Schaarste en economisch denken",
  "_assets"
);

function scarcitySvg(cfg) {
  const { t, m, contentY, header } = frame(
    cfg,
    "Schaarste zichtbaar maken",
    "Behoeften zijn groter dan de beschikbare middelen.",
    THEMES[cfg.theme].amber
  );
  const leftX = m + 42;
  const rightW = cfg.compact ? 230 : 290;
  const leftW = cfg.compact ? 300 : 350;
  const cardH = cfg.compact ? 180 : 285;
  const rightX = cfg.w - m - 42 - rightW;
  const midX = (leftX + leftW + rightX) / 2;
  const wantLines = cfg.compact
    ? ["Bioscoop: 12", "Boek: 15", "Uit eten: 18"]
    : ["Bioscoop: 12", "Nieuw boek: 15", "Uit eten: 18", "Cadeau vriend: 10"];
  const itemY = contentY + (cfg.compact ? 58 : 64);
  const itemGap = cfg.compact ? 30 : 42;
  const wantItems = wantLines.map((line, i) => `
    ${rect(leftX + 24, itemY + i * itemGap, leftW - 48, cfg.compact ? 26 : 32, t.amberSoft, { rx: 9, stroke: t.border, sw: 1 })}
    ${text(leftX + leftW / 2, itemY + 19 + i * itemGap, line, { anchor: "middle", size: cfg.compact ? 14 : 17, weight: 700, fill: t.ink })}
  `).join("");

  return `<svg viewBox="0 0 ${cfg.w} ${cfg.h}" xmlns="http://www.w3.org/2000/svg">
    ${header}
    ${rect(leftX, contentY, leftW, cardH, t.amberSoft, { stroke: t.amber, sw: 2, rx: 22 })}
    ${text(leftX + leftW / 2, contentY + 39, "Behoeften", { anchor: "middle", size: cfg.compact ? 20 : 25, weight: 800, fill: t.amber })}
    ${wantItems}
    ${text(leftX + leftW / 2, contentY + cardH - 25, "Totaal gewenst: 55 euro", { anchor: "middle", size: cfg.compact ? 16 : 20, weight: 800, fill: t.amber })}

    <line x1="${leftX + leftW + 18}" y1="${contentY + cardH / 2}" x2="${rightX - 26}" y2="${contentY + cardH / 2}" stroke="${t.muted}" stroke-width="3"/>
    <polygon points="${rightX - 26},${contentY + cardH / 2} ${rightX - 42},${contentY + cardH / 2 - 10} ${rightX - 42},${contentY + cardH / 2 + 10}" fill="${t.muted}"/>
    ${rect(midX - 70, contentY + cardH / 2 - 35, 140, 70, t.noteBg, { stroke: t.border, sw: 1.3, rx: 16 })}
    ${text(midX, contentY + cardH / 2 - 8, "KEUZE", { anchor: "middle", size: cfg.compact ? 16 : 19, weight: 900, fill: t.ink })}
    ${text(midX, contentY + cardH / 2 + 19, "nodig", { anchor: "middle", size: cfg.compact ? 14 : 17, weight: 700, fill: t.muted })}

    ${rect(rightX, contentY + 38, rightW, cfg.compact ? 142 : 170, t.blueSoft, { stroke: t.blue, sw: 2, rx: 22 })}
    ${text(rightX + rightW / 2, contentY + 80, "Middelen", { anchor: "middle", size: cfg.compact ? 20 : 25, weight: 800, fill: t.blue })}
    ${rect(rightX + 32, contentY + 105, rightW - 64, 46, t.panel, { stroke: t.blue, sw: 1.5, rx: 12 })}
    ${text(rightX + rightW / 2, contentY + 135, "Budget: 20 euro", { anchor: "middle", size: cfg.compact ? 18 : 22, weight: 900, fill: t.blue })}
    ${text(rightX + rightW / 2, contentY + (cfg.compact ? 200 : 246), "Middelen zijn beperkt", { anchor: "middle", size: cfg.compact ? 14 : 17, weight: 700, fill: t.muted })}

    ${rect(m + 58, cfg.h - m - 58, cfg.w - 2 * m - 116, 38, t.noteBg, { stroke: t.border, sw: 1, rx: 12 })}
    ${text(cfg.w / 2, cfg.h - m - 33, "55 euro aan wensen > 20 euro budget -> schaarste", { anchor: "middle", size: cfg.compact ? 15 : 19, weight: 800, fill: t.ink })}
  </svg>`;
}

function opportunitySvg(cfg) {
  const { t, m, contentY, header } = frame(
    cfg,
    "Alternatieve kosten",
    "De waarde van het beste alternatief dat je niet kiest.",
    THEMES[cfg.theme].blue
  );
  const chart = { x: m + 95, y: contentY + 18, w: cfg.w - 2 * (m + 95), h: cfg.compact ? 150 : 265 };
  const baseY = chart.y + chart.h;
  const max = 20;
  const scale = chart.h / max;
  const bars = [
    { label: "Bioscoop", value: 12, color: t.blue, soft: t.blueSoft, chosen: true },
    { label: "Boek", value: 15, color: t.amber, soft: t.amberSoft, chosen: false },
  ];
  const barW = cfg.compact ? 120 : 160;
  const gap = cfg.compact ? 110 : 170;
  const startX = cfg.w / 2 - barW - gap / 2;
  const barSvg = bars.map((b, i) => {
    const h = b.value * scale;
    const x = startX + i * (barW + gap);
    const y = baseY - h;
    return `
      ${rect(x, y, barW, h, b.soft, { stroke: b.color, sw: 2.3, rx: 14, dash: b.chosen ? "" : "8,5" })}
      ${text(x + barW / 2, y - 15, `${b.value} euro`, { anchor: "middle", size: cfg.compact ? 17 : 22, weight: 900, fill: b.color })}
      ${text(x + barW / 2, baseY + 33, b.label, { anchor: "middle", size: cfg.compact ? 16 : 20, weight: 800, fill: t.ink })}
      ${rect(x + 15, y + h / 2 - 18, barW - 30, 36, b.chosen ? t.green : t.amber, { rx: 10 })}
      ${text(x + barW / 2, y + h / 2 + 7, b.chosen ? "GEKOZEN" : "ALT. KOSTEN", { anchor: "middle", size: cfg.compact ? 12 : 15, weight: 900, fill: cfg.theme === "dark" ? "#07100b" : "#ffffff" })}
    `;
  }).join("");

  return `<svg viewBox="0 0 ${cfg.w} ${cfg.h}" xmlns="http://www.w3.org/2000/svg">
    ${header}
    ${[5, 10, 15, 20].map((tick) => {
      const y = baseY - tick * scale;
      return `<line x1="${chart.x}" y1="${y}" x2="${chart.x + chart.w}" y2="${y}" stroke="${t.grid}" stroke-width="1"/>${text(chart.x - 15, y + 6, String(tick), { anchor: "end", size: 14, weight: 500, fill: t.muted })}`;
    }).join("")}
    <line x1="${chart.x}" y1="${chart.y}" x2="${chart.x}" y2="${baseY}" stroke="${t.muted}" stroke-width="2"/>
    <line x1="${chart.x}" y1="${baseY}" x2="${chart.x + chart.w}" y2="${baseY}" stroke="${t.muted}" stroke-width="2"/>
    ${text(chart.x - 55, chart.y + chart.h / 2, "waarde (euro)", { anchor: "middle", size: cfg.compact ? 14 : 17, weight: 700, fill: t.muted, style: "", family: "Inter, Arial, sans-serif" }).replace("<text ", `<text transform="rotate(-90 ${chart.x - 55} ${chart.y + chart.h / 2})" `)}
    ${barSvg}
    <path d="M ${startX + barW + 12} ${baseY - 45} C ${cfg.w / 2 - 40} ${baseY - 118}, ${cfg.w / 2 + 40} ${baseY - 118}, ${startX + barW + gap - 12} ${baseY - 75}" fill="none" stroke="${t.amber}" stroke-width="3" stroke-dasharray="7,5"/>
    <polygon points="${startX + barW + gap - 12},${baseY - 75} ${startX + barW + gap - 29},${baseY - 80} ${startX + barW + gap - 22},${baseY - 61}" fill="${t.amber}"/>
    ${rect(m + 58, cfg.h - m - 58, cfg.w - 2 * m - 116, 38, t.noteBg, { stroke: t.border, sw: 1, rx: 12 })}
    ${text(cfg.w / 2, cfg.h - m - 33, "Kies je bioscoop, dan geef je het boek van 15 euro op.", { anchor: "middle", size: cfg.compact ? 14 : 18, weight: 800, fill: t.ink })}
  </svg>`;
}

function processSvg(cfg) {
  const { t, m, contentY, header } = frame(
    cfg,
    "Economisch denken in stappen",
    "Zelfde aanpak: alternatieven, opbrengsten, wat geef je op?",
    THEMES[cfg.theme].green
  );
  const top = contentY + 8;
  const cardW = cfg.compact ? 205 : 250;
  const cardH = cfg.compact ? 112 : 158;
  const gap = (cfg.w - 2 * (m + 42) - 3 * cardW) / 2;
  const x0 = m + 42;
  const steps = [
    { nr: "1", title: "Alternatieven", lines: ["Welke opties", "heb je?"], example: "Tarwe of Mais", color: t.blue, soft: t.blueSoft },
    { nr: "2", title: "Opbrengsten", lines: ["Wat levert", "elk op?"], example: "5000 vs 3500", color: t.green, soft: t.greenSoft },
    { nr: "3", title: "Opgeven", lines: ["Wat mis je", "door te kiezen?"], example: "3500 gemist", color: t.amber, soft: t.amberSoft },
  ];
  const stepSvg = steps.map((s, i) => {
    const x = x0 + i * (cardW + gap);
    const y = top;
    return `
      ${rect(x, y, cardW, cardH, s.soft, { stroke: s.color, sw: 2, rx: 20 })}
      <circle cx="${x + 36}" cy="${y + 34}" r="${cfg.compact ? 18 : 22}" fill="${s.color}"/>
      ${text(x + 36, y + (cfg.compact ? 41 : 42), s.nr, { anchor: "middle", size: cfg.compact ? 18 : 22, weight: 900, fill: cfg.theme === "dark" ? "#07100b" : "#ffffff" })}
      ${text(x + cardW / 2 + 20, y + 40, s.title, { anchor: "middle", size: cfg.compact ? 16 : 21, weight: 900, fill: s.color })}
      ${lineText(x + cardW / 2, y + (cfg.compact ? 70 : 88), s.lines, { anchor: "middle", size: cfg.compact ? 12 : 17, weight: 650, fill: t.ink, gap: cfg.compact ? 15 : 22 })}
      ${cfg.compact ? "" : text(x + cardW / 2, y + cardH - 17, s.example, { anchor: "middle", size: 16, weight: 700, fill: t.muted, style: "italic" })}
    `;
  }).join("");
  const arrows = [0, 1].map((i) => {
    const x1 = x0 + (i + 1) * cardW + i * gap + 12;
    const x2 = x0 + (i + 1) * (cardW + gap) - 12;
    const y = top + cardH / 2;
    return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${t.muted}" stroke-width="3"/><polygon points="${x2},${y} ${x2 - 14},${y - 9} ${x2 - 14},${y + 9}" fill="${t.muted}"/>`;
  }).join("");
  const bottomY = top + cardH + (cfg.compact ? 38 : 58);

  return `<svg viewBox="0 0 ${cfg.w} ${cfg.h}" xmlns="http://www.w3.org/2000/svg">
    ${header}
    ${stepSvg}
    ${arrows}
    ${rect(m + 58, bottomY, cfg.w - 2 * m - 116, cfg.compact ? 74 : 94, t.noteBg, { stroke: t.border, sw: 1.3, rx: 18 })}
    ${text(cfg.w / 2, bottomY + (cfg.compact ? 28 : 35), "Voorbeeld boer met 10 hectare", { anchor: "middle", size: cfg.compact ? 16 : 21, weight: 900, fill: t.ink })}
    ${text(cfg.w / 2, bottomY + (cfg.compact ? 55 : 68), "Tarwe kiezen -> 5000 euro opbrengst; Mais is het beste alternatief dat je opgeeft.", { anchor: "middle", size: cfg.compact ? 13 : 17, weight: 650, fill: t.soft })}
  </svg>`;
}

function barChartSvg(cfg, concept) {
  const t = THEMES[cfg.theme];
  const meta = {
    ex1: {
      title: "Winst per hectare vergelijken",
      subtitle: "Lees eerst de assen. De hoogste balk geeft de hoogste opbrengst.",
      yLabel: "winst per hectare (euro)",
      max: 600,
      ticks: [0, 100, 200, 300, 400, 500, 600],
      note: "Tarwe is 150 euro per hectare hoger dan Mais.",
      data: [
        { label: "Tarwe", value: 500, color: t.blue },
        { label: "Mais", value: 350, color: t.green },
        { label: "Zonnebloemen", value: 300, color: t.amber },
      ],
    },
    we1: {
      title: "Tarwe versus Mais",
      subtitle: "Vergelijk totale winst en benoem het beste niet-gekozen alternatief.",
      yLabel: "totale winst (euro)",
      max: 6000,
      ticks: [0, 1000, 2000, 3000, 4000, 5000, 6000],
      note: "Alternatieve kosten bij tarwe = 3500 euro gemiste Maisopbrengst.",
      data: [
        { label: "Tarwe (10 ha)", value: 5000, color: t.blue, badge: "GEKOZEN" },
        { label: "Mais (10 ha)", value: 3500, color: t.amber, dash: true, badge: "ALT. KOSTEN" },
      ],
    },
  }[concept];
  const { m, contentY, header } = frame(cfg, meta.title, meta.subtitle, concept === "we1" ? t.green : t.blue);
  const chart = { x: m + 100, y: contentY + (cfg.compact ? 18 : 30), w: cfg.w - 2 * (m + 100), h: cfg.compact ? 150 : 255 };
  const baseY = chart.y + chart.h;
  const scale = chart.h / meta.max;
  const barW = concept === "we1" ? (cfg.compact ? 130 : 165) : (cfg.compact ? 92 : 130);
  const gap = concept === "we1" ? (cfg.compact ? 95 : 150) : (cfg.compact ? 52 : 80);
  const totalW = meta.data.length * barW + (meta.data.length - 1) * gap;
  const startX = cfg.w / 2 - totalW / 2;
  const bars = meta.data.map((d, i) => {
    const h = d.value * scale;
    const x = startX + i * (barW + gap);
    const y = baseY - h;
    return `
      ${rect(x, y, barW, h, d.color, { stroke: d.color, sw: 2, rx: 14, opacity: cfg.theme === "dark" ? 0.82 : 0.76, dash: d.dash ? "8,5" : "" })}
      ${text(x + barW / 2, y - 13, `${d.value} euro`, { anchor: "middle", size: cfg.compact ? 15 : 21, weight: 900, fill: d.color })}
      ${text(x + barW / 2, baseY + 33, d.label, { anchor: "middle", size: cfg.compact ? 13 : 18, weight: 800, fill: t.ink })}
      ${d.badge ? `${rect(x + 14, y + h / 2 - 18, barW - 28, 36, d.dash ? t.amber : t.green, { rx: 10 })}${text(x + barW / 2, y + h / 2 + 7, d.badge, { anchor: "middle", size: cfg.compact ? 11 : 14, weight: 900, fill: cfg.theme === "dark" ? "#07100b" : "#ffffff" })}` : ""}
    `;
  }).join("");

  return `<svg viewBox="0 0 ${cfg.w} ${cfg.h}" xmlns="http://www.w3.org/2000/svg">
    ${header}
    ${meta.ticks.slice(1).map((tick) => {
      const y = baseY - tick * scale;
      const label = tick >= 1000 ? String(tick / 1000) + "k" : String(tick);
      return `<line x1="${chart.x}" y1="${y}" x2="${chart.x + chart.w}" y2="${y}" stroke="${t.grid}" stroke-width="1"/>${text(chart.x - 15, y + 6, label, { anchor: "end", size: 14, weight: 500, fill: t.muted })}`;
    }).join("")}
    <line x1="${chart.x}" y1="${chart.y}" x2="${chart.x}" y2="${baseY}" stroke="${t.muted}" stroke-width="2"/>
    <line x1="${chart.x}" y1="${baseY}" x2="${chart.x + chart.w}" y2="${baseY}" stroke="${t.muted}" stroke-width="2"/>
    ${text(chart.x - 58, chart.y + chart.h / 2, meta.yLabel, { anchor: "middle", size: cfg.compact ? 13 : 17, weight: 700, fill: t.muted }).replace("<text ", `<text transform="rotate(-90 ${chart.x - 58} ${chart.y + chart.h / 2})" `)}
    ${bars}
    ${concept === "we1" ? `
      <line x1="${startX + barW + gap / 2}" y1="${baseY - 5000 * scale}" x2="${startX + barW + gap / 2}" y2="${baseY - 3500 * scale}" stroke="${t.green}" stroke-width="3"/>
      ${text(startX + barW + gap / 2 + 18, baseY - 4250 * scale + 7, "+1500", { size: cfg.compact ? 15 : 19, weight: 900, fill: t.green })}
    ` : ""}
    ${rect(m + 58, cfg.h - m - 58, cfg.w - 2 * m - 116, 38, t.noteBg, { stroke: t.border, sw: 1, rx: 12 })}
    ${text(cfg.w / 2, cfg.h - m - 33, meta.note, { anchor: "middle", size: cfg.compact ? 13 : 17, weight: 800, fill: t.ink })}
  </svg>`;
}

const VISUALS = {
  "1.1.1_fig_1": { surfaces: ["slide", "doc", "summary", "web_light", "web_dark"], render: scarcitySvg },
  "1.1.1_fig_2": { surfaces: ["slide", "doc", "summary", "web_light", "web_dark"], render: opportunitySvg },
  "1.1.1_fig_3": { surfaces: ["slide", "doc", "summary", "web_light", "web_dark"], render: processSvg },
  "1.1.1_we_1": { surfaces: ["slide", "doc", "summary", "web_light", "web_dark"], render: (cfg) => barChartSvg(cfg, "we1") },
  "1.1.1_ex_1": { surfaces: ["doc", "web_light", "web_dark"], render: (cfg) => barChartSvg(cfg, "ex1") },
};

async function writeVariant(base, surfaceName) {
  const surface = SURFACES[surfaceName];
  const svg = VISUALS[base].render(surface);
  const stem = `${base}_${surface.suffix}`;
  const svgPath = path.join(ASSETS_DIR, `${stem}.svg`);
  const pngPath = path.join(ASSETS_DIR, `${stem}.png`);
  fs.writeFileSync(svgPath, svg, "utf8");
  fs.writeFileSync(pngPath, await svgToPng(svg, surface.pngW));
  console.log(`wrote ${path.basename(svgPath)} and ${path.basename(pngPath)}`);
}

(async () => {
  if (!fs.existsSync(ASSETS_DIR)) {
    throw new Error(`Assets directory does not exist: ${ASSETS_DIR}`);
  }

  for (const [base, entry] of Object.entries(VISUALS)) {
    for (const surfaceName of entry.surfaces) {
      await writeVariant(base, surfaceName);
    }
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
