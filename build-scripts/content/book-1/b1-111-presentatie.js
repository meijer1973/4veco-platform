/**
 * b1-111-presentatie.js — §1.1.1 Schaarste en economisch denken
 * Boek 1 · Hoofdstuk 1.1 · Paragraaf 1.1.1 — introductory narrative-first presentation
 *
 * Follows the editorial design system in lib-pptx.js + the teacher-supporting
 * slides rules in the econ-pptx-templates skill (modality, one idea per slide,
 * progressive disclosure, speaker notes as content container).
 *
 * 9 slides: title · narratief (Lisa) · schaarste · alternatieve kosten ·
 * economisch denken (4 stappen B02) · uitgewerkt voorbeeld stap 2 ·
 * uitgewerkt voorbeeld stap 3 · samenvatting · bridge-afsluiting.
 *
 * Speaker notes follow the Vraag / Uitleg / Pitfall / Overgang template.
 *
 * Embeds slide-adapted PNG variants from _assets/ (fig_1, fig_2, fig_3, we_1).
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

const ALT = require("./b1-111-alt-text");

// ═══════════════════════════════════════════════════════════════════════════
// PNG ASSET LOADER — slide variants are pre-rendered in _assets/
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

  // Load slide-adapted PNGs from _assets/
  const assetDir = path.resolve(__dirname,
    "../../../../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/" +
    "1.1 Hoofdstuk Economisch denken en rekenen/" +
    "1.1.1 Schaarste en economisch denken/_assets");
  const imgs = {
    fig1: loadPngAsBase64(path.join(assetDir, "1.1.1_fig_1_slide.png")),
    fig2: loadPngAsBase64(path.join(assetDir, "1.1.1_fig_2_slide.png")),
    fig3: loadPngAsBase64(path.join(assetDir, "1.1.1_fig_3_slide.png")),
    we1:  loadPngAsBase64(path.join(assetDir, "1.1.1_we_1_slide.png")),
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
    s.addNotes(
      "Vraag:    Waarom kun je niet alles hebben? Laat de klas één antwoord roepen.\n" +
      "Uitleg:   Zeg dat deze paragraaf precies om die vraag draait. Nog niks uitleggen — alleen nieuwsgierigheid oprekken.\n" +
      "Pitfall:  —\n" +
      "Overgang: Naar Lisa met haar zakgeld."
    );
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

    s.addNotes(
      "Vraag:    Welke zou jij kiezen, bioscoop of boek? Hand omhoog.\n" +
      "Uitleg:   Beide opties samen kosten €27, Lisa heeft €20. Kiezen is dus verplicht. Wat kost die keuze haar eigenlijk?\n" +
      "Pitfall:  —\n" +
      "Overgang: Dit is schaarste — en schaarste geldt niet alleen voor Lisa."
    );
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 3 — Concept Schaarste: één-zin definitie + gecentreerde visual
  // Tabel (scholier/boer/overheid) en valkuil staan in de speaker notes.
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Kernbegrip 1",
      title: "Schaarste",
    });

    // Eén-zin definitiebalk — volle breedte
    s.addShape("rect", { x: 0.5, y: 1.75, w: 9, h: 0.75, fill: { color: PC.indigo } });
    s.addShape("rect", { x: 0.5, y: 1.75, w: 0.12, h: 0.75, fill: { color: PC.coral } });
    s.addText(
      "Je behoeften zijn groter dan je middelen — dus móét je kiezen.",
      { x: 0.8, y: 1.78, w: 8.6, h: 0.7, valign: "middle",
        fontFace: FONT_SERIF, fontSize: 20, italic: true, color: PC.chalk }
    );

    // Grote, gecentreerde visual — geen concurrerende tekstblokken
    s.addImage({ data: imgs.fig1, x: 3.075, y: 2.75, w: 3.85, h: 2.6, altText: ALT["1.1.1_fig_1"] });

    s.addNotes(
      "Vraag:    Wat heb jij deze week wel gewild en niet gekregen? Waardoor?\n" +
      "Uitleg:   Schaarste is de verhouding tussen wensen en middelen — niet een kwestie van zeldzaam zijn. " +
      "Schaarste geldt voor iedereen:\n" +
      "          • Scholier — geld (€20) → bioscoop of boek?\n" +
      "          • Boer — land (10 hectare) → tarwe of maïs?\n" +
      "          • Overheid — budget → wegen of onderwijs?\n" +
      "Pitfall:  Schaarste ≠ weinig of zeldzaam. Water is overal, maar één flesje bij drie dorstige mensen is ook schaarste.\n" +
      "Overgang: Omdat kiezen móét, heeft elke keuze een prijs — niet in euro's, maar in wat je laat liggen."
    );
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 4 — Concept Alternatieve kosten: één-zin definitie + visual
  // Lisa-uitwerking (gekozen/niet gekozen) en valkuil leven in de notes.
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Kernbegrip 2",
      title: "Alternatieve kosten",
    });

    // Eén-zin definitiebalk — volle breedte
    s.addShape("rect", { x: 0.5, y: 1.75, w: 9, h: 0.75, fill: { color: PC.indigo } });
    s.addShape("rect", { x: 0.5, y: 1.75, w: 0.12, h: 0.75, fill: { color: PC.amber } });
    s.addText(
      "De opbrengst van het beste alternatief dat je laat liggen.",
      { x: 0.8, y: 1.78, w: 8.6, h: 0.7, valign: "middle",
        fontFace: FONT_SERIF, fontSize: 20, italic: true, color: PC.chalk }
    );

    // Grote, gecentreerde visual
    s.addImage({ data: imgs.fig2, x: 3.075, y: 2.75, w: 3.85, h: 2.6, altText: ALT["1.1.1_fig_2"] });

    s.addNotes(
      "Vraag:    Lisa kiest de bioscoop. Wat kost haar dat — in euro's, en daarnaast?\n" +
      "Uitleg:   Terug naar Lisa:\n" +
      "          • Gekozen — bioscoop (€12), het plezier van de film.\n" +
      "          • Niet gekozen — boek (€15), avonden leesplezier.\n" +
      "          • Alternatieve kosten — het leesplezier dat ze laat liggen.\n" +
      "          Benadruk: niet het geldbedrag, maar wat ze misloopt.\n" +
      "Pitfall:  Alternatieve kosten ≠ de prijs die je betaalt. Dat is de gewone uitgave.\n" +
      "Overgang: Hoe vind je bij élke keuze systematisch de alternatieve kosten? In vier stappen."
    );
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 5 — Economisch denken: 4-stappen procedure (B02) + fig_3
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Kernbegrip 3",
      title: "Economisch denken in vier stappen",
    });
    s.addNotes(
      "Vraag:    Als je voor een lastige keuze staat, waarmee begin je?\n" +
      "Uitleg:   Vier stappen, altijd dezelfde volgorde: (1) benoem alternatieven, (2) bereken opbrengst per alternatief, " +
      "(3) rangschik — beste niet-gekozen = alternatieve kosten, (4) bereken nettowaarde = opbrengst − alternatieve kosten. " +
      "Dit is het schema dat in elk tentamen en elke opgave terugkomt.\n" +
      "Pitfall:  Stap 4 wordt vaak overgeslagen. Zonder stap 4 weet je wel de alternatieve kosten, maar niet of de keuze achteraf goed uitpakte.\n" +
      "Overgang: We passen het meteen toe op een boer met 10 hectare."
    );

    // LEFT: vier stappen in genummerde blokken (compactere block-hoogte dan de eerdere 3-blok layout)
    const steps = [
      { n: "01", kop: "Benoem alternatieven",     sub: "Welke opties heb je?" },
      { n: "02", kop: "Bereken opbrengsten",      sub: "Wat levert elk alternatief op?" },
      { n: "03", kop: "Rangschik",                sub: "Beste niet-gekozen = alternatieve kosten." },
      { n: "04", kop: "Bereken nettowaarde",      sub: "Opbrengst − alternatieve kosten." },
    ];
    steps.forEach((st, i) => {
      const y = 1.85 + i * 0.78;
      s.addShape("rect", { x: 0.5, y, w: 5, h: 0.72,
        fill: { color: PC.chalk }, line: { color: PC.indigo, width: 1 } });
      s.addShape("rect", { x: 0.5, y, w: 0.08, h: 0.72, fill: { color: PC.coral } });
      s.addText(st.n, {
        x: 0.65, y: y + 0.08, w: 0.9, h: 0.55,
        fontFace: FONT_DISPLAY, fontSize: 26, bold: true, color: PC.coral, charSpacing: -0.5,
      });
      s.addText(st.kop, {
        x: 1.65, y: y + 0.04, w: 3.75, h: 0.34,
        fontFace: FONT_DISPLAY, fontSize: 16, bold: true, color: PC.indigo, valign: "middle",
      });
      s.addText(st.sub, {
        x: 1.65, y: y + 0.36, w: 3.75, h: 0.32,
        fontFace: FONT_SERIF, fontSize: 12, italic: true, color: PC.smoke, valign: "middle",
      });
    });

    // RIGHT: figuur 3 (4-stappen flowchart)
    s.addImage({ data: imgs.fig3, x: 5.65, y: 2.0, w: 3.85, h: 2.6, altText: ALT["1.1.1_fig_3"] });
    s.addText("Figuur 3 · het keuzeproces in vier stappen", {
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
  // DIA 6a — Uitgewerkt voorbeeld · Stap 2: opbrengsten berekenen
  // Progressive disclosure — alleen de rekenstap, nog geen conclusie.
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Uitgewerkt voorbeeld · Stap 2",
      title: "Wat levert elk gewas op?",
    });

    // Tabel (2 rijen: tarwe, maïs) — linker helft
    // Kolomkoppen
    s.addShape("rect", { x: 0.5, y: 2.2, w: 5, h: 0.4, fill: { color: PC.indigoMid } });
    s.addText("GEWAS",         { x: 0.6,  y: 2.22, w: 1.3, h: 0.36, fontFace: FONT_SANS, fontSize: 10, bold: true, color: PC.chalk, charSpacing: 2, valign: "middle" });
    s.addText("€ / HECTARE",   { x: 1.95, y: 2.22, w: 1.6, h: 0.36, fontFace: FONT_SANS, fontSize: 10, bold: true, color: PC.chalk, charSpacing: 2, valign: "middle" });
    s.addText("TOTAAL (10 ha)",{ x: 3.6,  y: 2.22, w: 1.85,h: 0.36, fontFace: FONT_SANS, fontSize: 10, bold: true, color: PC.chalk, charSpacing: 2, valign: "middle" });
    const calcRows = [
      { g: "Tarwe", per: "€500", tot: "€5.000", col: PC.teal      },
      { g: "Maïs",  per: "€350", tot: "€3.500", col: PC.amberDeep },
    ];
    calcRows.forEach((r, i) => {
      const y = 2.6 + i * 0.6;
      s.addShape("rect", { x: 0.5, y, w: 5, h: 0.6,
        fill: { color: PC.chalk }, line: { color: PC.cloud, width: 0.5 } });
      s.addShape("rect", { x: 0.5, y, w: 0.08, h: 0.6, fill: { color: r.col } });
      s.addText(r.g,   { x: 0.7,  y: y + 0.08, w: 1.2, h: 0.45, fontFace: FONT_SANS, fontSize: 18, bold: true, color: PC.indigo, valign: "middle" });
      s.addText(r.per, { x: 1.95, y: y + 0.08, w: 1.6, h: 0.45, fontFace: FONT_SANS, fontSize: 18, color: PC.ink, valign: "middle" });
      s.addText(r.tot, { x: 3.6,  y: y + 0.08, w: 1.85,h: 0.45, fontFace: FONT_DISPLAY, fontSize: 22, bold: true, color: r.col, valign: "middle" });
    });

    // RIGHT: we_1 figuur — gecentreerd in de rechthelft
    s.addImage({ data: imgs.we1, x: 5.65, y: 2.2, w: 3.85, h: 2.6, altText: ALT["1.1.1_we_1"] });

    s.addNotes(
      "Vraag:    Een boer heeft 10 hectare. Tarwe levert €500/ha op, maïs €350/ha. Wat verdient hij per gewas?\n" +
      "Uitleg:   Snel voorrekenen: 10 × €500 = €5.000 voor tarwe; 10 × €350 = €3.500 voor maïs. " +
      "We hebben nu de opbrengst van élke optie — dat was stap 2.\n" +
      "Pitfall:  Niet meteen zeggen welke hij moet kiezen. We berekenen hier alleen.\n" +
      "Overgang: De getallen staan. Wat geeft hij op als hij tarwe kiest?"
    );
  }

  // ────────────────────────────────────────────────────────────────────
  // DIA 6b — Uitgewerkt voorbeeld · Stap 3: alternatieve kosten aanwijzen
  // Conclusie-dia — één groot getal, één zin, dezelfde visual als 6a.
  // ────────────────────────────────────────────────────────────────────
  {
    const s = editorialSlide(pres, {
      kicker: "Uitgewerkt voorbeeld · Stap 3",
      title: "Wat geeft hij op?",
    });

    // LEFT: groot uitkomstblok
    s.addShape("rect", { x: 0.5, y: 2.2, w: 5, h: 2.6, fill: { color: PC.indigo } });
    s.addShape("rect", { x: 0.5, y: 2.2, w: 0.12, h: 2.6, fill: { color: PC.coral } });
    s.addText("Kiest tarwe → alternatieve kosten", {
      x: 0.8, y: 2.45, w: 4.5, h: 0.4,
      fontFace: FONT_SANS, fontSize: 16, color: PC.chalk, valign: "middle",
    });
    s.addText("€3.500", {
      x: 0.8, y: 2.95, w: 4.5, h: 1.1,
      fontFace: FONT_DISPLAY, fontSize: 72, bold: true, color: PC.amber, charSpacing: -2,
    });
    s.addText("de maïsopbrengst die hij laat liggen", {
      x: 0.8, y: 4.15, w: 4.5, h: 0.45,
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: PC.cloud, valign: "middle",
    });

    // RIGHT: dezelfde visual — herkenningspunt voor de leerling
    s.addImage({ data: imgs.we1, x: 5.65, y: 2.2, w: 3.85, h: 2.6, altText: ALT["1.1.1_we_1"] });

    s.addNotes(
      "Vraag:    Hij kiest tarwe. Wat láát hij dan liggen?\n" +
      "Uitleg:   De maïsopbrengst van €3.500 — dát zijn zijn alternatieve kosten. " +
      "Niet de som van opties, niet de prijs die hij betaalt: het beste alternatief dat hij niet neemt.\n" +
      "          Netto: €5.000 − €3.500 = €1.500 voordeel. Kiezen loont dus — zolang de opbrengst de alternatieve kosten overtreft.\n" +
      "Pitfall:  Alternatieve kosten optellen over alle niet-gekozen opties is fout. Het is altijd het BESTE alternatief.\n" +
      "Overgang: Even samenvatten: vijf dingen om vast te houden."
    );
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
      { n: "03", t: "Economisch denken = vier stappen: (1) alternatieven, (2) opbrengsten, (3) rangschik (= alternatieve kosten), (4) nettowaarde." },
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
    s.addNotes(
      "Vraag:    Welke van de vijf punten kun je uit je hoofd aan je buurman uitleggen?\n" +
      "Uitleg:   Retrieval-moment. Twee minuten: leerlingen leggen de vijf punten hardop aan elkaar uit, zonder op de dia te kijken.\n" +
      "Pitfall:  —\n" +
      "Overgang: Terug naar Lisa — met één vraag die openblijft."
    );
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
    s.addNotes(
      "Vraag:    Hoe vergelijk je eigenlijk het plezier van een film met dat van een boek — of tarwe met maïs?\n" +
      "Uitleg:   Bridge-dia. Laat de vraag open. Nog geen inhoud uit §1.1.2 geven — alleen het vervolg aankondigen, zodat leerlingen geactiveerd blijven.\n" +
      "Pitfall:  —\n" +
      "Overgang: Einde paragraaf 1.1.1. Volgende les: hoe meten we dat in geld?"
    );
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
