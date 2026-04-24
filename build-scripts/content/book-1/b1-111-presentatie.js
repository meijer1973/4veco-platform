/**
 * b1-111-presentatie.js — §1.1.1 Schaarste en economisch denken
 * Boek 1 · Hoofdstuk 1.1 · Paragraaf 1.1.1 — introductory narrative-first presentation
 *
 * Follows the editorial design system in lib-pptx.js.
 * 8 slides per the paragraph plan: title, narrative hook (Lisa),
 * schaarste, alternatieve kosten, economisch denken (3 stappen),
 * uitgewerkt voorbeeld (boer tarwe vs maïs), samenvatting, afsluiting.
 *
 * Embeds pre-rendered PNGs from _assets/ (fig_1, fig_2, fig_3, we_1).
 * Output → 4veco-lessen/Boek 1 .../1.1.1 Schaarste en economisch denken/
 */

const {
  PC, SC, T, FONT_SANS, FONT_DISPLAY, FONT_SERIF,
  defineMasters, softShadow, tightShadow,
  ICON, placeIcon,
  fixPptxFile, roundtripWithLibreOffice,
} = require("../../lib/lib-pptx.js");

const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ═══════════════════════════════════════════════════════════════════════════
// PNG ASSET LOADER — fig_1, fig_2, fig_3, we_1 are pre-rendered in _assets/
// ═══════════════════════════════════════════════════════════════════════════
function loadPngAsBase64(p) {
  const buf = fs.readFileSync(p);
  return "image/png;base64," + buf.toString("base64");
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE BUILDERS — lightweight helpers (lifted from pptx-331 reference)
// ═══════════════════════════════════════════════════════════════════════════
function editorialSlide(pres, { kicker, title, subtitle, notes }) {
  const s = pres.addSlide({ masterName: "LIGHT_ED" });
  if (kicker) {
    s.addText(kicker.toUpperCase(), {
      x: 0.5, y: 0.3, w: 9, h: 0.3,
      ...T.labelUpper, color: PC.coral, fontSize: 11, charSpacing: 4,
    });
  }
  s.addText(title, {
    x: 0.5, y: 0.6, w: 9, h: 0.8,
    ...T.displayLight, fontSize: 28, charSpacing: -0.5,
  });
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.5, y: 1.35, w: 9, h: 0.4,
      ...T.subheadLight, fontFace: FONT_SERIF, italic: true, fontSize: 18,
    });
  }
  if (notes) s.addNotes(notes);
  return s;
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD
// ═══════════════════════════════════════════════════════════════════════════
async function build() {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: "CUSTOM_16x9", width: 10, height: 5.625 });
  pres.layout = "CUSTOM_16x9";
  pres.author = "Economie VWO";
  pres.title = "1.1.1 Schaarste en economisch denken";

  // Custom footer labels for Boek 1 §1.1.1
  defineMasters(pres, {
    darkLabel:  "PARAGRAAF  ·  §1.1.1",
    lightLabel: "§ 1.1.1  ·  SCHAARSTE EN ECONOMISCH DENKEN",
  });

  // Load pre-rendered PNGs from _assets/
  const assetDir = path.resolve(__dirname,
    "../../../../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/" +
    "1.1 Hoofdstuk Economisch denken en rekenen/" +
    "1.1.1 Schaarste en economisch denken/_assets");
  const imgs = {
    fig1: loadPngAsBase64(path.join(assetDir, "1.1.1_fig_1.png")),
    fig2: loadPngAsBase64(path.join(assetDir, "1.1.1_fig_2.png")),
    fig3: loadPngAsBase64(path.join(assetDir, "1.1.1_fig_3.png")),
    we1:  loadPngAsBase64(path.join(assetDir, "1.1.1_we_1.png")),
  };

  // ────────────────────────────────────────────────────────────────────
  // DIA 1 — Editorial title slide
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("§ 1.1.1", {
      x: 0.6, y: 0.7, w: 4, h: 0.4,
      ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6,
    });
    s.addText("Schaarste en\neconomisch denken", {
      x: 0.6, y: 1.15, w: 8.8, h: 2.6,
      ...T.heroDark, fontSize: 56, charSpacing: -2, lineSpacingMultiple: 1.02,
    });
    s.addShape("rect", { x: 0.6, y: 3.75, w: 0.6, h: 0.04, fill: { color: PC.coral } });
    s.addText("Waarom kun je niet alles hebben?", {
      x: 0.6, y: 3.95, w: 8.8, h: 0.6,
      fontFace: FONT_SERIF, fontSize: 22, italic: true, color: PC.amber,
    });
    s.addText("Boek 1 · Hoofdstuk 1.1 Economisch denken en rekenen", {
      x: 0.6, y: 4.75, w: 8.8, h: 0.4,
      fontFace: FONT_SANS, fontSize: 14, color: PC.cloud,
    });
    s.addNotes("Openingsdia. Laat de vraag even hangen: waarom kun je niet alles hebben? Daar gaat de hele paragraaf over.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 2 — Narrative hook: Lisa met €20
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "LIGHT_ED" });
    s.addText("NARRATIEF VERHAAL", {
      x: 0.5, y: 0.3, w: 9, h: 0.3,
      ...T.labelUpper, color: PC.coral, fontSize: 11, charSpacing: 4,
    });
    s.addText("Lisa heeft €20", {
      x: 0.5, y: 0.6, w: 9, h: 0.9,
      ...T.displayLight, fontSize: 36, charSpacing: -0.5,
    });
    s.addText("Zaterdagmiddag. Twee verleidingen.", {
      x: 0.5, y: 1.45, w: 9, h: 0.5,
      fontFace: FONT_SERIF, fontSize: 20, italic: true, color: PC.smoke,
    });

    // Two-option cards
    // LEFT: bioscoop
    s.addShape("rect", { x: 0.6, y: 2.35, w: 4.2, h: 2.4,
      fill: { color: PC.chalk }, line: { color: PC.cloud, width: 0.75 } });
    s.addShape("rect", { x: 0.6, y: 2.35, w: 4.2, h: 0.08, fill: { color: PC.teal } });
    s.addText("OPTIE A", {
      x: 0.85, y: 2.5, w: 3.7, h: 0.3,
      ...T.labelUpper, color: PC.teal, fontSize: 12, charSpacing: 4,
    });
    s.addText("Bioscoop", {
      x: 0.85, y: 2.85, w: 3.7, h: 0.6,
      fontFace: FONT_DISPLAY, fontSize: 28, bold: true, color: PC.indigo, charSpacing: -0.5,
    });
    s.addText("€12", {
      x: 0.85, y: 3.5, w: 3.7, h: 0.7,
      fontFace: FONT_DISPLAY, fontSize: 48, bold: true, color: PC.tealDeep, charSpacing: -1,
    });
    s.addText("Een middag kijkplezier.", {
      x: 0.85, y: 4.25, w: 3.7, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 18, italic: true, color: PC.smoke,
    });

    // RIGHT: boek
    s.addShape("rect", { x: 5.2, y: 2.35, w: 4.2, h: 2.4,
      fill: { color: PC.chalk }, line: { color: PC.cloud, width: 0.75 } });
    s.addShape("rect", { x: 5.2, y: 2.35, w: 4.2, h: 0.08, fill: { color: PC.amber } });
    s.addText("OPTIE B", {
      x: 5.45, y: 2.5, w: 3.7, h: 0.3,
      ...T.labelUpper, color: PC.amberDeep, fontSize: 12, charSpacing: 4,
    });
    s.addText("Nieuw boek", {
      x: 5.45, y: 2.85, w: 3.7, h: 0.6,
      fontFace: FONT_DISPLAY, fontSize: 28, bold: true, color: PC.indigo, charSpacing: -0.5,
    });
    s.addText("€15", {
      x: 5.45, y: 3.5, w: 3.7, h: 0.7,
      fontFace: FONT_DISPLAY, fontSize: 48, bold: true, color: PC.amberDeep, charSpacing: -1,
    });
    s.addText("Avonden leesplezier.", {
      x: 5.45, y: 4.25, w: 3.7, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 18, italic: true, color: PC.smoke,
    });

    // Callout strip onderaan
    s.addShape("rect", { x: 0.5, y: 4.9, w: 9, h: 0.45, fill: { color: PC.coralDeep } });
    s.addText("Beide samen kost €27. Lisa heeft maar €20 → ze móét kiezen.", {
      x: 0.6, y: 4.92, w: 8.8, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 18, italic: true, color: PC.chalk, valign: "middle",
    });

    s.addNotes("Geen visual nodig hier — het verhaal doet het werk. Vraag klas: 'welke zou jij kiezen?' — en dan: 'wat kost die keuze je eigenlijk?' Dat is de brug naar het vakbegrip.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 3 — Concept Schaarste + tabel + fig_1 + pitfall
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Kernbegrip 1",
      title: "Schaarste: het basisprobleem van de economie",
      notes: "Hamer op de verhouding behoeften/middelen — niet op zeldzaamheid. Water is overal, maar één flesje bij drie dorstige mensen = schaarste.",
    });

    // Definitiebalk
    s.addShape("rect", { x: 0.5, y: 1.75, w: 9, h: 0.75,
      fill: { color: PC.indigo }, line: { color: PC.indigo, width: 0 } });
    s.addShape("rect", { x: 0.5, y: 1.75, w: 0.12, h: 0.75, fill: { color: PC.coral } });
    s.addText([
      { text: "DEFINITIE  ", options: { fontFace: FONT_SANS, fontSize: 11, bold: true, color: PC.coral, charSpacing: 3 } },
      { text: "Schaarste is de situatie waarin de behoeften (wensen) groter zijn dan de beschikbare middelen.", options: { fontFace: FONT_SERIF, fontSize: 18, italic: true, color: PC.chalk } },
    ], {
      x: 0.8, y: 1.78, w: 8.6, h: 0.7, valign: "middle",
    });

    // LEFT: schaarste-tabel (scholier / boer / overheid)
    s.addText("SCHAARSTE GELDT VOOR IEDEREEN", {
      x: 0.5, y: 2.7, w: 5, h: 0.3,
      ...T.labelUpper, color: PC.ash, fontSize: 11, charSpacing: 3,
    });
    const rows = [
      { who: "Scholier",  mid: "Geld (€20)",       kies: "Bioscoop of boek?" },
      { who: "Boer",      mid: "Land (10 hectare)",kies: "Tarwe of maïs?" },
      { who: "Overheid",  mid: "Budget",           kies: "Wegen of onderwijs?" },
    ];
    // Header
    s.addShape("rect", { x: 0.5, y: 3.05, w: 5, h: 0.35, fill: { color: PC.indigoMid } });
    s.addText("WIE",         { x: 0.6,  y: 3.06, w: 1.2, h: 0.33, fontFace: FONT_SANS, fontSize: 10, bold: true, color: PC.chalk, charSpacing: 2, valign: "middle" });
    s.addText("MIDDEL",      { x: 1.85, y: 3.06, w: 1.6, h: 0.33, fontFace: FONT_SANS, fontSize: 10, bold: true, color: PC.chalk, charSpacing: 2, valign: "middle" });
    s.addText("KEUZE",       { x: 3.5,  y: 3.06, w: 1.9, h: 0.33, fontFace: FONT_SANS, fontSize: 10, bold: true, color: PC.chalk, charSpacing: 2, valign: "middle" });
    rows.forEach((r, i) => {
      const y = 3.4 + i * 0.45;
      s.addShape("rect", { x: 0.5, y, w: 5, h: 0.45,
        fill: { color: i % 2 === 0 ? PC.chalk : PC.paperMid }, line: { color: PC.cloud, width: 0.5 } });
      s.addText(r.who, { x: 0.6,  y: y + 0.02, w: 1.2, h: 0.4, fontFace: FONT_SANS, fontSize: 14, bold: true, color: PC.indigo, valign: "middle" });
      s.addText(r.mid, { x: 1.85, y: y + 0.02, w: 1.6, h: 0.4, fontFace: FONT_SANS, fontSize: 13, color: PC.ink, valign: "middle" });
      s.addText(r.kies,{ x: 3.5,  y: y + 0.02, w: 1.9, h: 0.4, fontFace: FONT_SERIF, fontSize: 13, italic: true, color: PC.smoke, valign: "middle" });
    });

    // Pitfall callout onderaan links
    s.addShape("rect", { x: 0.5, y: 4.95, w: 5, h: 0.5,
      fill: { color: PC.badBg }, line: { color: PC.coralDeep, width: 1 } });
    s.addShape("rect", { x: 0.5, y: 4.95, w: 0.08, h: 0.5, fill: { color: PC.coralDeep } });
    s.addText([
      { text: "VALKUIL  ", options: { fontFace: FONT_SANS, fontSize: 10, bold: true, color: PC.coralDeep, charSpacing: 3 } },
      { text: "schaarste is niet hetzelfde als weinig of zeldzaam.", options: { fontFace: FONT_SANS, fontSize: 13, color: PC.badInk } },
    ], { x: 0.7, y: 4.97, w: 4.75, h: 0.46, valign: "middle" });

    // RIGHT: figuur 1
    s.addImage({ data: imgs.fig1, x: 5.65, y: 2.7, w: 3.85, h: 2.6 });
    s.addText("Figuur 1 · behoeften versus middelen", {
      x: 5.65, y: 5.3, w: 3.85, h: 0.25,
      ...T.captionLight, fontSize: 10, align: "center",
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 4 — Concept Alternatieve kosten + Lisa-voorbeeld + fig_2 + pitfall
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Kernbegrip 2",
      title: "Alternatieve kosten: de prijs van je keuze",
      notes: "Niet verwarren met de gelduitgave. De alternatieve kosten zijn wat je MISLOOPT — het beste alternatief dat je laat liggen.",
    });

    // Definitiebalk
    s.addShape("rect", { x: 0.5, y: 1.75, w: 9, h: 0.75,
      fill: { color: PC.indigo } });
    s.addShape("rect", { x: 0.5, y: 1.75, w: 0.12, h: 0.75, fill: { color: PC.amber } });
    s.addText([
      { text: "DEFINITIE  ", options: { fontFace: FONT_SANS, fontSize: 11, bold: true, color: PC.amber, charSpacing: 3 } },
      { text: "Alternatieve kosten = de opbrengst van het beste alternatief dat je opgeeft bij een keuze.", options: { fontFace: FONT_SERIF, fontSize: 18, italic: true, color: PC.chalk } },
    ], { x: 0.8, y: 1.78, w: 8.6, h: 0.7, valign: "middle" });

    // LEFT: Lisa uitwerking (drie regels)
    s.addText("TERUG NAAR LISA", {
      x: 0.5, y: 2.7, w: 5, h: 0.3,
      ...T.labelUpper, color: PC.ash, fontSize: 11, charSpacing: 3,
    });
    const lisaRows = [
      { lbl: "Gekozen",          val: "Bioscoop (€12) — plezier van de film",              col: PC.teal },
      { lbl: "Niet gekozen",     val: "Boek (€15) — avonden leesplezier",                   col: PC.amberDeep },
      { lbl: "Alternatieve kosten", val: "Het leesplezier van het boek — dát geef je op.", col: PC.coralDeep },
    ];
    lisaRows.forEach((r, i) => {
      const y = 3.05 + i * 0.6;
      s.addShape("rect", { x: 0.5, y, w: 5, h: 0.55,
        fill: { color: PC.chalk }, line: { color: PC.cloud, width: 0.5 } });
      s.addShape("rect", { x: 0.5, y, w: 0.08, h: 0.55, fill: { color: r.col } });
      s.addText(r.lbl.toUpperCase(), {
        x: 0.7, y: y + 0.04, w: 1.8, h: 0.2,
        fontFace: FONT_SANS, fontSize: 9, bold: true, color: r.col, charSpacing: 2,
      });
      s.addText(r.val, {
        x: 0.7, y: y + 0.24, w: 4.7, h: 0.3,
        fontFace: FONT_SANS, fontSize: 13, color: PC.ink, valign: "middle",
      });
    });

    // Pitfall
    s.addShape("rect", { x: 0.5, y: 4.95, w: 5, h: 0.5,
      fill: { color: PC.badBg }, line: { color: PC.coralDeep, width: 1 } });
    s.addShape("rect", { x: 0.5, y: 4.95, w: 0.08, h: 0.5, fill: { color: PC.coralDeep } });
    s.addText([
      { text: "VALKUIL  ", options: { fontFace: FONT_SANS, fontSize: 10, bold: true, color: PC.coralDeep, charSpacing: 3 } },
      { text: "alternatieve kosten ≠ de prijs die je betaalt.", options: { fontFace: FONT_SANS, fontSize: 13, color: PC.badInk } },
    ], { x: 0.7, y: 4.97, w: 4.75, h: 0.46, valign: "middle" });

    // RIGHT: figuur 2
    s.addImage({ data: imgs.fig2, x: 5.65, y: 2.7, w: 3.85, h: 2.6 });
    s.addText("Figuur 2 · twee alternatieven — wat geef je op?", {
      x: 5.65, y: 5.3, w: 3.85, h: 0.25,
      ...T.captionLight, fontSize: 10, align: "center",
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 5 — Economisch denken: 3-stappen procedure + fig_3
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Kernbegrip 3",
      title: "Economisch denken: kiezen bij schaarste in drie stappen",
      notes: "Dit is het schema dat je overal terug gaat zien. Elk tentamen, elke opgave: (1) alternatieven, (2) opbrengsten, (3) wat geef je op.",
    });

    // LEFT: drie stappen in genummerde blokken
    const steps = [
      { n: "01", kop: "Welke alternatieven zijn er?",         sub: "Welke opties heb je?" },
      { n: "02", kop: "Wat levert elk alternatief op?",        sub: "Waarde of opbrengst per optie." },
      { n: "03", kop: "Wat geef je op?",                       sub: "De alternatieve kosten van je keuze." },
    ];
    steps.forEach((st, i) => {
      const y = 2.0 + i * 1.05;
      s.addShape("rect", { x: 0.5, y, w: 5, h: 0.95,
        fill: { color: PC.chalk }, line: { color: PC.indigo, width: 1 } });
      s.addShape("rect", { x: 0.5, y, w: 0.08, h: 0.95, fill: { color: PC.coral } });
      s.addText(st.n, {
        x: 0.65, y: y + 0.15, w: 0.9, h: 0.65,
        fontFace: FONT_DISPLAY, fontSize: 30, bold: true, color: PC.coral, charSpacing: -0.5,
      });
      s.addText(st.kop, {
        x: 1.65, y: y + 0.1, w: 3.75, h: 0.4,
        fontFace: FONT_DISPLAY, fontSize: 18, bold: true, color: PC.indigo, valign: "middle",
      });
      s.addText(st.sub, {
        x: 1.65, y: y + 0.5, w: 3.75, h: 0.4,
        fontFace: FONT_SERIF, fontSize: 14, italic: true, color: PC.smoke, valign: "middle",
      });
    });

    // RIGHT: figuur 3
    s.addImage({ data: imgs.fig3, x: 5.65, y: 2.0, w: 3.85, h: 2.6 });
    s.addText("Figuur 3 · het keuzeproces in drie stappen", {
      x: 5.65, y: 4.6, w: 3.85, h: 0.25,
      ...T.captionLight, fontSize: 10, align: "center",
    });

    // Bottom insight bar
    s.addShape("rect", { x: 5.65, y: 5.0, w: 3.85, h: 0.45, fill: { color: PC.indigoDeep } });
    s.addText("Verstandig = opbrengst > alternatieve kosten.", {
      x: 5.75, y: 5.02, w: 3.65, h: 0.4,
      fontFace: FONT_SERIF, fontSize: 13, italic: true, color: PC.amber, valign: "middle",
    });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 6 — Worked example: boer tarwe vs maïs + we_1
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Uitgewerkt voorbeeld",
      title: "De boer, 10 hectare, twee gewassen",
      notes: "Laat de drie stappen uit dia 5 concreet worden. Benadruk: alternatieve kosten = opbrengst van het BESTE niet-gekozen alternatief, niet de som.",
    });

    // Rekentabel links
    s.addText("STAP 2 · OPBRENGSTEN BEREKENEN", {
      x: 0.5, y: 1.85, w: 5, h: 0.3,
      ...T.labelUpper, color: PC.ash, fontSize: 11, charSpacing: 3,
    });
    // Kolomkoppen
    s.addShape("rect", { x: 0.5, y: 2.2, w: 5, h: 0.38, fill: { color: PC.indigoMid } });
    s.addText("GEWAS",        { x: 0.6,  y: 2.21, w: 1.3, h: 0.36, fontFace: FONT_SANS, fontSize: 10, bold: true, color: PC.chalk, charSpacing: 2, valign: "middle" });
    s.addText("€ / HECTARE",  { x: 1.95, y: 2.21, w: 1.6, h: 0.36, fontFace: FONT_SANS, fontSize: 10, bold: true, color: PC.chalk, charSpacing: 2, valign: "middle" });
    s.addText("TOTAAL (10 ha)",{x: 3.6,  y: 2.21, w: 1.85,h: 0.36, fontFace: FONT_SANS, fontSize: 10, bold: true, color: PC.chalk, charSpacing: 2, valign: "middle" });
    const calcRows = [
      { g: "Tarwe", per: "€500", tot: "€5.000", col: PC.teal,      hl: true },
      { g: "Maïs",  per: "€350", tot: "€3.500", col: PC.amberDeep, hl: false },
    ];
    calcRows.forEach((r, i) => {
      const y = 2.6 + i * 0.5;
      s.addShape("rect", { x: 0.5, y, w: 5, h: 0.5,
        fill: { color: r.hl ? PC.goodBg : PC.chalk }, line: { color: PC.cloud, width: 0.5 } });
      s.addShape("rect", { x: 0.5, y, w: 0.08, h: 0.5, fill: { color: r.col } });
      s.addText(r.g,   { x: 0.7,  y: y + 0.05, w: 1.2, h: 0.4, fontFace: FONT_SANS, fontSize: 15, bold: true, color: PC.indigo, valign: "middle" });
      s.addText(r.per, { x: 1.95, y: y + 0.05, w: 1.6, h: 0.4, fontFace: FONT_SANS, fontSize: 15, color: PC.ink, valign: "middle" });
      s.addText(r.tot, { x: 3.6,  y: y + 0.05, w: 1.85,h: 0.4, fontFace: FONT_DISPLAY, fontSize: 18, bold: true, color: r.col, valign: "middle" });
    });

    // Stap 3 uitkomstbox
    s.addShape("rect", { x: 0.5, y: 3.75, w: 5, h: 1.6,
      fill: { color: PC.indigo } });
    s.addShape("rect", { x: 0.5, y: 3.75, w: 0.12, h: 1.6, fill: { color: PC.coral } });
    s.addText("STAP 3 · WAT GEEFT HIJ OP?", {
      x: 0.75, y: 3.85, w: 4.5, h: 0.3,
      fontFace: FONT_SANS, fontSize: 11, bold: true, color: PC.coral, charSpacing: 3,
    });
    s.addText("Kiest tarwe → alternatieve kosten =", {
      x: 0.75, y: 4.15, w: 4.5, h: 0.35,
      fontFace: FONT_SANS, fontSize: 14, color: PC.chalk, valign: "middle",
    });
    s.addText("€3.500", {
      x: 0.75, y: 4.5, w: 4.5, h: 0.6,
      fontFace: FONT_DISPLAY, fontSize: 36, bold: true, color: PC.amber, charSpacing: -1,
    });
    s.addText("de maïsopbrengst die hij misloopt", {
      x: 0.75, y: 5.1, w: 4.5, h: 0.25,
      fontFace: FONT_SERIF, fontSize: 13, italic: true, color: PC.cloud,
    });

    // RIGHT: we_1 figuur
    s.addImage({ data: imgs.we1, x: 5.65, y: 1.85, w: 3.85, h: 2.6 });
    s.addText("Uitgewerkt voorbeeld · tarwe versus maïs", {
      x: 5.65, y: 4.45, w: 3.85, h: 0.25,
      ...T.captionLight, fontSize: 10, align: "center",
    });
    // Netto-winst annotatie
    s.addShape("rect", { x: 5.65, y: 4.85, w: 3.85, h: 0.55,
      fill: { color: PC.goodBg }, line: { color: PC.goodInk, width: 1 } });
    s.addText([
      { text: "NETTO VOORDEEL  ", options: { fontFace: FONT_SANS, fontSize: 10, bold: true, color: PC.goodInk, charSpacing: 2 } },
      { text: "€5.000 − €3.500 = €1.500", options: { fontFace: FONT_DISPLAY, fontSize: 15, bold: true, color: PC.goodInk } },
    ], { x: 5.8, y: 4.88, w: 3.6, h: 0.5, valign: "middle" });
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 7 — Samenvatting (5 bullets uit plan)
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("De kern", {
      x: 0.6, y: 0.5, w: 8.8, h: 0.4,
      ...T.labelUpper, color: PC.coral, fontSize: 13, charSpacing: 6,
    });
    s.addText("Vijf dingen om te onthouden", {
      x: 0.6, y: 0.9, w: 8.8, h: 0.8,
      ...T.headlineDark, fontSize: 32, charSpacing: -1,
    });
    const items = [
      { n: "01", t: "Schaarste ontstaat wanneer behoeften groter zijn dan middelen — daardoor moet je kiezen." },
      { n: "02", t: "Elke keuze heeft alternatieve kosten: de opbrengst van het beste alternatief dat je opgeeft." },
      { n: "03", t: "Economisch denken = drie stappen: (1) alternatieven, (2) opbrengsten, (3) wat geef je op?" },
      { n: "04", t: "Alternatieve kosten ≠ de prijs die je betaalt — het gaat om wat je misloopt." },
      { n: "05", t: "Schaarste geldt voor iedereen: scholier, boer, overheid." },
    ];
    items.forEach((it, i) => {
      const y = 1.95 + i * 0.65;
      s.addText(it.n, {
        x: 0.6, y, w: 0.7, h: 0.55,
        fontFace: FONT_DISPLAY, fontSize: 24, bold: true, color: PC.coral, charSpacing: -1,
      });
      s.addText(it.t, {
        x: 1.35, y: y + 0.05, w: 8.15, h: 0.55,
        fontFace: FONT_SANS, fontSize: 18, color: PC.chalk, valign: "middle",
      });
      if (i < items.length - 1) {
        s.addShape("rect", { x: 0.6, y: y + 0.6, w: 8.8, h: 0.005, fill: { color: PC.indigoSoft } });
      }
    });
    s.addNotes("Retrieval-moment. Laat leerlingen in tweetallen de vijf punten hardop aan elkaar uitleggen zonder op de dia te kijken.");
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 8 — Afsluiting / bridge naar §1.1.2
  // ────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide({ masterName: "DARK_HERO" });
    s.addText("TOT SLOT", {
      x: 0.6, y: 1.2, w: 8.8, h: 0.35,
      ...T.labelUpper, color: PC.coral, fontSize: 14, charSpacing: 6,
    });
    s.addText("Terug naar Lisa.", {
      x: 0.6, y: 1.65, w: 8.8, h: 0.9,
      ...T.displayDark, fontSize: 44, charSpacing: -1,
    });
    s.addShape("rect", { x: 0.6, y: 2.6, w: 0.6, h: 0.04, fill: { color: PC.coral } });
    s.addText(
      "Ze weet nu dat kiezen altijd iets kost. Maar hóé vergelijk je eigenlijk plezier met plezier — of tarwe met maïs?",
      {
        x: 0.6, y: 2.85, w: 8.8, h: 1.0,
        fontFace: FONT_SERIF, fontSize: 20, italic: true, color: PC.cloud, lineSpacingMultiple: 1.25,
      });
    s.addShape("rect", { x: 0.6, y: 4.1, w: 8.8, h: 0.85,
      fill: { color: PC.indigoMid } });
    s.addShape("rect", { x: 0.6, y: 4.1, w: 0.12, h: 0.85, fill: { color: PC.amber } });
    s.addText("VOLGENDE PARAGRAAF  ·  §1.1.2", {
      x: 0.85, y: 4.2, w: 8.5, h: 0.3,
      fontFace: FONT_SANS, fontSize: 11, bold: true, color: PC.amber, charSpacing: 3,
    });
    s.addText("Hoe meten we verschillen in geld?", {
      x: 0.85, y: 4.5, w: 8.5, h: 0.45,
      fontFace: FONT_DISPLAY, fontSize: 22, bold: true, color: PC.chalk, valign: "middle",
    });
    s.addNotes("Bridge-dia. Nog geen inhoud uit §1.1.2 geven — alleen het vervolg aankondigen zodat leerlingen geactiveerd blijven.");
  }

  // ────────────────────────────────────────────────────────────────────
  // OUTPUT — write to 4veco-lessen (flat layout)
  // ────────────────────────────────────────────────────────────────────
  const outDir = path.resolve(__dirname,
    "../../../../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/" +
    "1.1 Hoofdstuk Economisch denken en rekenen/" +
    "1.1.1 Schaarste en economisch denken");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, "1.1.1 Schaarste en economisch denken – presentatie.pptx");
  await pres.writeFile({ fileName: outPath });
  const fix = await fixPptxFile(outPath);
  roundtripWithLibreOffice(outPath);

  const size = fs.statSync(outPath).size;
  console.log(`PPTX written to ${outPath}`);
  console.log(`  size: ${(size / 1024).toFixed(1)} KB`);
  console.log(`  fix:  -${fix.removedOverrides} phantom overrides, -${fix.removedEmptyDirs} empty dirs`);
  console.log(`  roundtripped via LibreOffice: OK`);
}

build().catch(e => { console.error(e); process.exit(1); });
