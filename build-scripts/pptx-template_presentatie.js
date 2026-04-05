/**
 * PPTX Template: Lesson Presentation
 * Reference implementation from 3.1.1 Markt en marktstructuur.
 *
 * HOW TO ADAPT FOR ANOTHER PARAGRAPH:
 * 1. Change DOMAIN to match the chapter's domain (markt/bedrijf/arbeid)
 * 2. Update slide content in the BUILD section (search for "SLIDE 1", "SLIDE 2", etc.)
 * 3. Update the output path (outDir/outFile) at the bottom
 * 4. Add/remove slides as needed for the paragraph's content
 * 5. Write speaker notes for every slide
 *
 * Run: node pptx-template_presentatie.js
 */
process.env.NODE_PATH = "C:/Users/meije/AppData/Roaming/npm/node_modules";
require("module").Module._initPaths();

const PptxGenJS = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ── Color palette ──────────────────────────────────────────────────────────
const C = {
  dBlue: "1A5276", dBlueLt: "EBF5FB", dBlueDk: "154360",
  dAmber: "E67E22", dAmberLt: "FEF5E7", dAmberDk: "BA6A1C",
  dGreen: "1E8449", dGreenLt: "E8F8F0", dGreenDk: "186A3B",
  navy: "1E2761", white: "FFFFFF", dark: "2D3748", gray: "718096",
  lightGray: "F7F8FA", borderGray: "CBD5E0", red: "D9534F", lightRed: "FDE8E8",
  cream: "F9F6F1", rowAlt: "F7FAFC",
};

const DOMAIN = { color: C.dBlue, light: C.dBlueLt, dark: C.dBlueDk };

// Shadow factory - always fresh objects
const makeShadow = () => ({
  type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.10,
});

// ── Slide Masters ──────────────────────────────────────────────────────────
function addTitleMaster(pres) {
  pres.defineSlideMaster({
    title: "TITLE_DARK",
    background: { color: C.navy },
    objects: [
      { rect: { x: 0, y: 0, w: 10, h: 0.06, fill: { color: DOMAIN.color } } },
      { rect: { x: 0, y: 5.15, w: 10, h: 0.475, fill: { color: "151D4A" } } },
    ],
  });
}

function addContentMaster(pres) {
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: C.white },
    objects: [
      { rect: { x: 0, y: 0, w: 10, h: 0.75, fill: { color: DOMAIN.color } } },
    ],
  });
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function addContentSlide(pres, title) {
  const slide = pres.addSlide({ masterName: "CONTENT" });
  slide.addText(title, {
    x: 0.5, y: 0, w: 9, h: 0.75,
    fontSize: 24, fontFace: "Arial", color: C.white, bold: true,
    valign: "middle",
  });
  return slide;
}

/**
 * Draw a card with left accent bar.
 * @param {object} slide
 * @param {number} x - left edge
 * @param {number} y - top edge
 * @param {number} w - width
 * @param {number} h - height
 * @param {string} accentColor - hex without #
 * @param {string} bgColor - hex without #
 * @param {string} title - card title text
 * @param {string} titleColor - hex
 * @param {Array} bodyParts - array of text objects for the body
 * @param {object} [extra] - optional overrides
 */
function drawCard(slide, x, y, w, h, accentColor, bgColor, title, titleColor, bodyParts, extra) {
  // Card background
  slide.addShape("rect", {
    x: x, y: y, w: w, h: h,
    fill: { color: bgColor },
    rectRadius: 0.05,
    shadow: makeShadow(),
  });
  // Left accent bar
  slide.addShape("rect", {
    x: x, y: y, w: 0.06, h: h,
    fill: { color: accentColor },
  });
  // Card title
  const titleY = y + 0.15;
  slide.addText(title, {
    x: x + 0.2, y: titleY, w: w - 0.35, h: 0.4,
    fontSize: 20, fontFace: "Arial", color: titleColor, bold: true,
    valign: "top",
  });
  // Card body
  const bodyY = titleY + 0.45;
  const bodyH = h - 0.75;
  if (bodyParts && bodyParts.length > 0) {
    slide.addText(bodyParts, {
      x: x + 0.2, y: bodyY, w: w - 0.35, h: bodyH,
      fontSize: 14, fontFace: "Arial", color: C.dark,
      valign: "top", align: "left",
      lineSpacingMultiple: 1.15,
      ...(extra || {}),
    });
  }
}

// ── Build ──────────────────────────────────────────────────────────────────
async function build() {
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 — actually let's use standard 10x5.63
  pres.defineLayout({ name: "CUSTOM_10x5625", width: 10, height: 5.625 });
  pres.layout = "CUSTOM_10x5625";

  addTitleMaster(pres);
  addContentMaster(pres);

  // ──────────────────────────────────────────────────────────────────────
  // SLIDE 1: Title
  // ──────────────────────────────────────────────────────────────────────
  {
    const slide = pres.addSlide({ masterName: "TITLE_DARK" });
    slide.addText("Markt en marktstructuur", {
      x: 0.7, y: 1.2, w: 8.6, h: 2,
      fontSize: 40, fontFace: "Arial", color: C.white, bold: true,
    });
    slide.addText("Paragraaf 1", {
      x: 0.7, y: 3.2, w: 8.6, h: 0.5,
      fontSize: 20, fontFace: "Arial", color: C.gray,
    });
    slide.addText("Hoofdstuk 1: Markten  |  Economie VWO", {
      x: 0.7, y: 5.15, w: 8.6, h: 0.475,
      fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle",
    });
    slide.addNotes("Welkom bij paragraaf 1 over markt en marktstructuur. Vandaag leren we de basisconcepten die nodig zijn om markten te begrijpen.");
  }

  // ──────────────────────────────────────────────────────────────────────
  // SLIDE 2: Leerdoelen
  // ──────────────────────────────────────────────────────────────────────
  {
    const slide = addContentSlide(pres, "Wat moet je kunnen?");

    // Section label
    slide.addText("Leerdoelen", {
      x: 0.5, y: 1.0, w: 9, h: 0.4,
      fontSize: 20, fontFace: "Arial", color: DOMAIN.color, bold: true,
    });

    const bullets = [
      "Concrete en abstracte markten onderscheiden",
      "Homogene en heterogene producten herkennen",
      "Toetredingsdrempels analyseren en voorbeelden noemen",
      "De redeneerketen van drempels naar prijs toepassen",
    ];

    slide.addText(
      bullets.map(b => ({
        text: b,
        options: { fontSize: 15, fontFace: "Arial", color: C.dark, bullet: true, breakType: "none" },
      })),
      {
        x: 0.7, y: 1.5, w: 8.6, h: 3.2,
        valign: "top", align: "left",
        lineSpacingMultiple: 1.5,
        paraSpaceAfter: 8,
      }
    );

    slide.addNotes("Dit zijn de vier dingen die je na deze les moet kunnen. We werken ze \u00E9\u00E9n voor \u00E9\u00E9n door.");
  }

  // ──────────────────────────────────────────────────────────────────────
  // SLIDE 3: De markt (twoColumn)
  // ──────────────────────────────────────────────────────────────────────
  {
    const slide = addContentSlide(pres, "De markt");

    // Left card: Concreet
    drawCard(slide, 0.5, 1.1, 4.3, 3.2, DOMAIN.color, C.cream, "Concreet", DOMAIN.color, [
      { text: "Fysieke ontmoetingsplek, vragers en aanbieders op \u00E9\u00E9n locatie.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Voorbeelden: ", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: "vismarkt, veiling, straatmarkt.", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);

    // Right card: Abstract
    drawCard(slide, 5.2, 1.1, 4.3, 3.2, DOMAIN.color, C.cream, "Abstract", DOMAIN.color, [
      { text: "Geen fysieke plek, kopers en verkopers via communicatie.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Voorbeelden: ", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: "huizenmarkt, wereldgraanmarkt, oliemarkt.", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);

    slide.addNotes("We beginnen met het verschil tussen concrete en abstracte markten. Een concrete markt is een fysieke plek waar kopers en verkopers samenkomen. Bij een abstracte markt is er geen vaste plek - handel gaat via communicatie.");
  }

  // ──────────────────────────────────────────────────────────────────────
  // SLIDE 4: Homogeen of heterogeen? (twoColumn)
  // ──────────────────────────────────────────────────────────────────────
  {
    const slide = addContentSlide(pres, "Product: homogeen of heterogeen?");

    // Left card: Homogeen
    drawCard(slide, 0.5, 1.1, 4.3, 2.8, DOMAIN.color, C.cream, "Homogeen", DOMAIN.color, [
      { text: "Consument ziet geen verschil tussen aanbieders. Alleen prijs telt.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Voorbeelden: ", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: "stroom, benzine, prei.", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);

    // Right card: Heterogeen
    drawCard(slide, 5.2, 1.1, 4.3, 2.8, DOMAIN.color, C.cream, "Heterogeen", DOMAIN.color, [
      { text: "Consument ziet wel verschil. Merk, kwaliteit, sfeer spelen mee.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Voorbeelden: ", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: "smartphones, auto\u2019s, caf\u00E9s.", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);

    // Bottom note
    slide.addText("Het gaat om de perceptie van de consument, niet om objectieve verschillen.", {
      x: 0.5, y: 4.15, w: 9, h: 0.45,
      fontSize: 12, fontFace: "Arial", color: C.gray, italic: true,
      align: "left", valign: "middle",
    });

    slide.addNotes("Nu kijken we naar het product. Bij homogene producten ziet de consument geen verschil - alleen prijs telt. Bij heterogene producten zijn er merkvoorkeuren. Let op: het gaat om perceptie, niet om objectieve verschillen.");
  }

  // ──────────────────────────────────────────────────────────────────────
  // SLIDE 5: Toetredingsdrempels (twoColumn + flow)
  // ──────────────────────────────────────────────────────────────────────
  {
    const slide = addContentSlide(pres, "Toetredingsdrempels");

    // Left card: Voorbeelden
    drawCard(slide, 0.5, 1.1, 4.3, 3.6, DOMAIN.color, C.cream, "Voorbeelden", DOMAIN.color, [
      { text: "Startkapitaal", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true, bullet: true } },
      { text: "\ngasnetwerk: miljarden\n", options: { fontSize: 13, fontFace: "Arial", color: C.gray } },
      { text: "Naamsbekendheid", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true, bullet: true } },
      { text: "\nCoca-Cola sinds 1886\n", options: { fontSize: 13, fontFace: "Arial", color: C.gray } },
      { text: "Vergunningen", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true, bullet: true } },
      { text: "\nelektriciteitscentrale\n", options: { fontSize: 13, fontFace: "Arial", color: C.gray } },
      { text: "Specifiek netwerk", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true, bullet: true } },
      { text: "\ntelecom: kabels", options: { fontSize: 13, fontFace: "Arial", color: C.gray } },
    ]);

    // Right side: Flow chain - using connected boxes
    const flowX = 5.2;
    const flowW = 4.3;
    const boxW = 3.8;
    const boxH = 0.5;
    const boxX = flowX + (flowW - boxW) / 2;
    const steps = [
      "Hoge drempels",
      "Weinig aanbieders",
      "Minder concurrentie",
      "Hogere prijzen",
    ];
    const startY = 1.2;
    const gap = 0.22;

    // Section label for right side
    slide.addText("Redeneerketen", {
      x: flowX, y: 1.0, w: flowW, h: 0.35,
      fontSize: 16, fontFace: "Arial", color: DOMAIN.color, bold: true,
      align: "center",
    });

    steps.forEach((step, i) => {
      const y = startY + 0.4 + i * (boxH + gap);
      // Box
      slide.addShape("rect", {
        x: boxX, y: y, w: boxW, h: boxH,
        fill: { color: i === steps.length - 1 ? DOMAIN.color : C.cream },
        rectRadius: 0.05,
        shadow: makeShadow(),
        line: { color: DOMAIN.color, width: 1 },
      });
      slide.addText(step, {
        x: boxX, y: y, w: boxW, h: boxH,
        fontSize: 14, fontFace: "Arial",
        color: i === steps.length - 1 ? C.white : C.dark,
        bold: true, align: "center", valign: "middle",
      });
      // Arrow between boxes
      if (i < steps.length - 1) {
        const arrowY = y + boxH;
        slide.addText("\u2193", {
          x: boxX, y: arrowY, w: boxW, h: gap,
          fontSize: 16, fontFace: "Arial", color: DOMAIN.color,
          align: "center", valign: "middle", bold: true,
        });
      }
    });

    slide.addNotes("De hoogte van toetredingsdrempels bepaalt hoeveel bedrijven er op een markt zijn. Hoge drempels leiden tot weinig aanbieders en hogere prijzen. Dit is de kern van het hele verhaal.");
  }

  // ──────────────────────────────────────────────────────────────────────
  // SLIDE 6: Netwerksectoren (twoColumn)
  // ──────────────────────────────────────────────────────────────────────
  {
    const slide = addContentSlide(pres, "Netwerksectoren");

    // Left card: Verkopen
    drawCard(slide, 0.5, 1.1, 4.3, 2.8, DOMAIN.color, C.cream, "Verkopen", DOMAIN.color, [
      { text: "Markt werkt, overheid niet belast.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Maar: ", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: "monopolist kan hoge prijzen vragen.", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);

    // Right card: Behouden
    drawCard(slide, 5.2, 1.1, 4.3, 2.8, DOMAIN.color, C.cream, "Behouden", DOMAIN.color, [
      { text: "Eerlijke prijzen, iedereen toegang.\n\n", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
      { text: "Maar: ", options: { fontSize: 14, fontFace: "Arial", color: C.dark, bold: true } },
      { text: "overheid moet onderhouden en toezicht houden.", options: { fontSize: 14, fontFace: "Arial", color: C.dark } },
    ]);

    // Bottom examples
    slide.addText([
      { text: "Voorbeelden: ", options: { fontSize: 12, fontFace: "Arial", color: C.gray, bold: true } },
      { text: "elektriciteitsnet, gasnet, waterleidingen, spoorwegen.", options: { fontSize: 12, fontFace: "Arial", color: C.gray } },
    ], {
      x: 0.5, y: 4.15, w: 9, h: 0.45,
      align: "left", valign: "middle",
    });

    slide.addNotes("Bij netwerksectoren zijn de drempels zo hoog dat zelfs grote bedrijven niet kunnen toetreden. De overheid staat voor een dilemma: verkopen geeft marktwerking maar monopolie-risico, behouden geeft eerlijke prijzen maar vraagt overheidstoezicht.");
  }

  // ──────────────────────────────────────────────────────────────────────
  // SLIDE 7: Valkuilen (3 red-accent cards)
  // ──────────────────────────────────────────────────────────────────────
  {
    const slide = addContentSlide(pres, "Valkuilen");

    const valkuilen = [
      {
        title: "\"Homogeen = identiek product\"",
        body: "Onjuist: gaat om consumentenperceptie. Taxi\u2019s kunnen identiek zijn maar toch heterogeen in de ogen van de consument.",
      },
      {
        title: "\"Abstracte markt = markt bestaat niet\"",
        body: "Onjuist: abstracte markten zijn heel re\u00EBel (huizenmarkt).",
      },
      {
        title: "\"Lage drempels = geen concurrentie\"",
        body: "Onjuist: lage drempels leiden juist tot meer concurrentie.",
      },
    ];

    const cardH = 1.05;
    const cardGap = 0.2;
    const startY = 1.05;

    valkuilen.forEach((v, i) => {
      const y = startY + i * (cardH + cardGap);

      // Card background
      slide.addShape("rect", {
        x: 0.5, y: y, w: 9, h: cardH,
        fill: { color: C.lightRed },
        rectRadius: 0.05,
        shadow: makeShadow(),
      });
      // Red left accent
      slide.addShape("rect", {
        x: 0.5, y: y, w: 0.06, h: cardH,
        fill: { color: C.red },
      });
      // Title
      slide.addText(v.title, {
        x: 0.72, y: y + 0.08, w: 8.6, h: 0.35,
        fontSize: 14, fontFace: "Arial", color: C.red, bold: true,
        valign: "top", align: "left",
      });
      // Body
      slide.addText(v.body, {
        x: 0.72, y: y + 0.42, w: 8.6, h: 0.55,
        fontSize: 13, fontFace: "Arial", color: C.dark,
        valign: "top", align: "left",
      });
    });

    slide.addNotes("Dit zijn drie veelgemaakte fouten. Bespreek ze klassikaal: homogeen gaat over perceptie, abstracte markten bestaan echt, en lage drempels leiden juist tot meer concurrentie.");
  }

  // ──────────────────────────────────────────────────────────────────────
  // SLIDE 8: Samenvatting (TITLE_DARK master)
  // ──────────────────────────────────────────────────────────────────────
  {
    const slide = pres.addSlide({ masterName: "TITLE_DARK" });

    slide.addText("Samenvatting", {
      x: 0.7, y: 0.5, w: 8.6, h: 0.7,
      fontSize: 28, fontFace: "Arial", color: C.white, bold: true,
    });

    slide.addText("Beheers je dit voordat je gaat oefenen?", {
      x: 0.7, y: 1.15, w: 8.6, h: 0.4,
      fontSize: 14, fontFace: "Arial", color: C.gray, italic: true,
    });

    const bullets = [
      "Concrete vs abstracte markten onderscheiden",
      "Homogeen vs heterogeen: consumentenperceptie telt",
      "Toetredingsdrempels herkennen",
      "Redeneerketen: drempels \u2192 aanbieders \u2192 concurrentie \u2192 prijs",
      "Rol overheid bij netwerksectoren",
    ];

    slide.addText(
      bullets.map(b => ({
        text: b,
        options: { fontSize: 15, fontFace: "Arial", color: C.white, bullet: true, breakType: "none" },
      })),
      {
        x: 0.7, y: 1.7, w: 8.6, h: 3.2,
        valign: "top", align: "left",
        lineSpacingMultiple: 1.6,
        paraSpaceAfter: 6,
      }
    );

    slide.addNotes("Loop deze punten na voordat de leerlingen gaan oefenen. Controleer of ze de redeneerketen kunnen toepassen.");
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  const outDir = "C:/Users/meije/Documents/0. claude/3. Module 3 \uF03A Markt en overheid/3.1 Hoofdstuk 1 \uF03A Markten/3.1.1 Paragraaf 1 \uF03A Markt en marktstructuur";
  const outFile = path.join(outDir, "3.1.1 Markt en marktstructuur \u2013 presentatie.pptx");

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
    console.log("Created directory:", outDir);
  }

  await pres.writeFile({ fileName: outFile });
  console.log("Presentation saved to:", outFile);

  // Verify
  const stats = fs.statSync(outFile);
  console.log("File size:", (stats.size / 1024).toFixed(1), "KB");
  console.log("Slides: 8");
}

build().catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});
