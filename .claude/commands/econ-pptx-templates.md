---
name: econ-pptx-templates
description: "Reusable PptxGenJS templates for creating professional, visually consistent economics lesson presentations. Follows the same domain-based color system as the econ-word-templates skill (blue/amber/green) so students see a unified visual language across Word documents and PowerPoint slides. Use this skill whenever building presentations for economics lessons in combination with the pptx skill and the economic-graph skill. Trigger when the user asks for a presentatie, slides, les, or PowerPoint for economics education. Also trigger when the user mentions economie presentatie, lesslides, samenvatting slides, or any slide deck for economics VWO/HAVO."
---

# Economics PowerPoint Templates v1

Reusable PptxGenJS code for building professional, visually consistent economics lesson presentations. All templates use 16:9 slides (10" × 5.625") with a design system that matches the Word document templates — same colors, same domain system, same visual language.

**Always read the pptx skill first** for PptxGenJS setup, QA, and image conversion. This skill provides the *design system and content patterns*; the pptx skill provides the *toolchain*.

---

## MANDATORY: GRAPHS IN EVERY PRESENTATION

**Grafieken zijn een essentieel onderdeel van economieonderwijs.** Ze zijn abstract en moeilijk voor leerlingen, dus hoe vaker ze worden getoond, hoe beter. Bij het maken van elke presentatie MOET je actief controleren waar grafieken kunnen worden toegevoegd.

**Regels:**
- Analyseer bij elke presentatie welke economische concepten baat hebben bij een grafiek (V/A-diagrammen, kostencurves, surplusgebieden, verschuivingen, monopoliegrafieken, etc.)
- Voeg grafiekdia's toe op eigen dia's — proppen op bestaande dia's maakt het te druk
- Gebruik de `economic-graph` skill voor SVG-specificaties en de SVG → Sharp → PNG pipeline
- Patroon: eerst de tekstdia met uitleg, dan een aparte dia met de grafiek die het concept visualiseert
- Splits liever een dia in twee (tekst + grafiek apart) dan dat je een grafiek weglaat
- Je hebt GEEN extra prompt van de gebruiker nodig om grafieken toe te voegen — dit is standaard

**Typische grafieken per onderwerp:**
- Marktevenwicht: V/A-diagram met evenwichtspunt
- Volkomen concurrentie: kostencurves (MK, GTK) met prijslijn, winstrechthoek, CS/PS driehoeken
- Monopolie: V + MO (dubbele helling) + MK, p* op vraaglijn, winstrechthoek + CS
- Arbeidsmarkt: V/A met loon/arbeid assen, verschuivingen
- Internationale handel: comparatief voordeel, PPF, handelswinsten

---

## DESIGN SYSTEM: SHARED WITH WORD TEMPLATES

The core principle is **visual unity** — a student should recognise the same color system, the same box types, and the same domain groupings whether they open a Word document or a PowerPoint slide.

### Color Palette (identical to econ-word-templates)

```javascript
const C = {
  // ── Domain 0: Markten (teal family) ──
  dTeal:      "17A2B8",
  dTealLt:    "E8F8FB",
  dTealDk:    "117A8B",
  // ── Domain 1: Marktanalyse (blue family) ──
  dBlue:      "1A5276",
  dBlueLt:    "EBF5FB",
  dBlueDk:    "154360",
  // ── Domain 2: Bedrijfseconomie (amber family) ──
  dAmber:     "E67E22",
  dAmberLt:   "FEF5E7",
  dAmberDk:   "BA6A1C",
  // ── Domain 3: Arbeidsmarkt (green family) ──
  dGreen:     "1E8449",
  dGreenLt:   "E8F8F0",
  dGreenDk:   "186A3B",
  // ── Base colors ──
  navy:       "1E2761",   // dark backgrounds (title slide, summary slide)
  white:      "FFFFFF",
  dark:       "2D3748",   // body text on light backgrounds
  gray:       "718096",   // captions, subtitles, footers
  lightGray:  "F7F8FA",   // formula box background, card background
  borderGray: "CBD5E0",   // subtle borders
  red:        "D9534F",   // warning accents
  lightRed:   "FDE8E8",   // warning background
  cream:      "F9F6F1",   // warm neutral card backgrounds
  rowAlt:     "F7FAFC",   // alternating row shading
  // ── Scaffolding colors ──
  purple:     "7B2D8E",
  lightPurple:"F3E8F9",
  stepBg:     "FFF8E1",
  stepBorder: "F9A825",
};
```

### Domain Lookup

```javascript
const DOMAINS = {
  markten: { label: "Markten",           color: C.dTeal,  light: C.dTealLt,  dark: C.dTealDk  },
  markt:   { label: "Marktanalyse",      color: C.dBlue,  light: C.dBlueLt,  dark: C.dBlueDk  },
  bedrijf: { label: "Bedrijfseconomie",  color: C.dAmber, light: C.dAmberLt, dark: C.dAmberDk },
  arbeid:  { label: "Arbeidsmarkt",      color: C.dGreen, light: C.dGreenLt, dark: C.dGreenDk },
};
```

### Typography

```
Font pairing: Arial (headers) + Arial (body) — matches Word documents exactly
Header font:  Arial Bold
Body font:    Arial Regular
Monospace:    Consolas (formulas only)
```

| Element | Size | Color |
|---------|------|-------|
| Slide title (dark bg) | 36pt bold | white |
| Slide title (light bg) | 28-32pt bold | dark or domain.dark |
| Section header | 20-24pt bold | domain.color |
| Body text | 14-16pt | dark |
| Captions / footers | 10-12pt | gray |
| Formula text | 14pt Consolas | dark |

---

## PART 1: SETUP

```javascript
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Economie VWO";
pres.title = "Presentatie";
```

### Slide Dimensions Reference

```
16:9 = 10" × 5.625"
Margins: 0.5" all sides
Content area: 9" × 4.625"
Two-column split: left 4.25", gap 0.5", right 4.25"
```

### Helper: Fresh Shadow Factory

PptxGenJS mutates option objects. Always use a factory.

```javascript
const makeShadow = () => ({
  type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.10,
});
```

### Helper: SVG Icon to Base64

```javascript
async function iconToBase64(svgString, size = 256) {
  const buf = await sharp(Buffer.from(svgString)).resize(size, size).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
```

---

## PART 2: SLIDE MASTERS

Define these once per presentation. They establish the consistent visual structure.

### Title Slide Master (dark navy background)

Used for: lesson title, section dividers, summary/closing.

```javascript
function addTitleMaster(pres, domain = "markt") {
  const d = DOMAINS[domain];
  pres.defineSlideMaster({
    title: "TITLE_DARK",
    background: { color: C.navy },
    objects: [
      // Domain accent bar (top, full width)
      { rect: { x: 0, y: 0, w: 10, h: 0.06, fill: { color: d.color } } },
      // Footer bar
      { rect: { x: 0, y: 5.15, w: 10, h: 0.475, fill: { color: "151D4A" } } },
    ],
  });
}
```

### Content Slide Master (light background)

Used for: all content slides.

```javascript
function addContentMaster(pres, domain = "markt") {
  const d = DOMAINS[domain];
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: C.white },
    objects: [
      // Header bar (domain color, full width)
      { rect: { x: 0, y: 0, w: 10, h: 0.75, fill: { color: d.color } } },
    ],
  });
}
```

---

## PART 3: REUSABLE SLIDE COMPONENTS

### Title Slide

```javascript
function addTitleSlide(pres, title, paragraafNr, hoofdstuk, domain = "markt") {
  const d = DOMAINS[domain];
  const slide = pres.addSlide({ masterName: "TITLE_DARK" });

  // Main title
  slide.addText(title, {
    x: 0.7, y: 1.2, w: 8.6, h: 2,
    fontSize: 40, fontFace: "Arial", color: C.white, bold: true,
    margin: 0,
  });

  // Paragraaf subtitle
  slide.addText(`Paragraaf ${paragraafNr}`, {
    x: 0.7, y: 3.2, w: 8.6, h: 0.5,
    fontSize: 20, fontFace: "Arial", color: C.gray,
    margin: 0,
  });

  // Footer
  slide.addText(`${hoofdstuk}  |  Economie VWO`, {
    x: 0.7, y: 5.15, w: 8.6, h: 0.475,
    fontSize: 12, fontFace: "Arial", color: C.gray, valign: "middle",
    margin: 0,
  });

  return slide;
}
```

### Content Slide with Header Bar

```javascript
function addContentSlide(pres, title, domain = "markt") {
  const d = DOMAINS[domain];
  const slide = pres.addSlide({ masterName: "CONTENT" });

  // Title text on header bar
  slide.addText(title, {
    x: 0.5, y: 0, w: 9, h: 0.75,
    fontSize: 24, fontFace: "Arial", color: C.white, bold: true,
    valign: "middle", margin: 0,
  });

  return slide;
}
```

### Leerdoelen Slide

```javascript
function addLeerdoelenSlide(pres, leerdoelen, domain = "markt") {
  const d = DOMAINS[domain];
  const slide = addContentSlide(pres, "Wat moet je kunnen?", domain);

  // IMPORTANT: Use \n-joined string so PptxGenJS creates separate <a:p> paragraphs.
  // Do NOT use breakLine (creates <a:br/> soft breaks = all text in one paragraph).
  slide.addText(leerdoelen.join("\n"), {
    x: 0.7, y: 1.2, w: 8.6, h: 3.5,
    bullet: true, fontSize: 16, fontFace: "Arial", color: C.dark,
    paraSpaceAfter: 8,
  });

  return slide;
}
```

### Two-Column Card Slide

The signature content layout. Two cards side by side with left accent borders (mirrors the tipBox/warningBox from Word).

```javascript
function addTwoColumnSlide(pres, title, leftCard, rightCard, domain = "markt") {
  const d = DOMAINS[domain];
  const slide = addContentSlide(pres, title, domain);

  const cardY = 1.1, cardH = 3.2;
  const leftX = 0.5, rightX = 5.2;
  const cardW = 4.3;
  const accentW = 0.06;

  // Left card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: leftX, y: cardY, w: cardW, h: cardH,
    fill: { color: C.cream }, shadow: makeShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: leftX, y: cardY, w: accentW, h: cardH,
    fill: { color: leftCard.accentColor || d.color },
  });
  slide.addText(leftCard.title, {
    x: leftX + 0.25, y: cardY + 0.15, w: cardW - 0.4, h: 0.45,
    fontSize: 20, fontFace: "Arial", color: leftCard.accentColor || d.color, bold: true, margin: 0,
  });
  const leftItems = leftCard.body.map((item, i) => ({
    text: item,
    options: { fontSize: 14, fontFace: "Arial", color: C.dark, breakLine: i < leftCard.body.length - 1 },
  }));
  slide.addText(leftItems, {
    x: leftX + 0.25, y: cardY + 0.65, w: cardW - 0.4, h: cardH - 0.8,
  });

  // Right card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: rightX, y: cardY, w: cardW, h: cardH,
    fill: { color: C.cream }, shadow: makeShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: rightX, y: cardY, w: accentW, h: cardH,
    fill: { color: rightCard.accentColor || C.dAmber },
  });
  slide.addText(rightCard.title, {
    x: rightX + 0.25, y: cardY + 0.15, w: cardW - 0.4, h: 0.45,
    fontSize: 20, fontFace: "Arial", color: rightCard.accentColor || C.dAmber, bold: true, margin: 0,
  });
  const rightItems = rightCard.body.map((item, i) => ({
    text: item,
    options: { fontSize: 14, fontFace: "Arial", color: C.dark, breakLine: i < rightCard.body.length - 1 },
  }));
  slide.addText(rightItems, {
    x: rightX + 0.25, y: cardY + 0.65, w: cardW - 0.4, h: cardH - 0.8,
  });

  return slide;
}
```

### Flow/Chain Slide

Horizontal or vertical chain of steps — used for redeneerkettingen (causality chains).

```javascript
function addFlowSlide(pres, title, steps, domain = "markt") {
  const d = DOMAINS[domain];
  const slide = addContentSlide(pres, title, domain);

  const startY = 1.5;
  const stepH = 0.55;
  const gap = 0.12;
  const stepW = 7;
  const stepX = 1.5;

  steps.forEach((step, i) => {
    const y = startY + i * (stepH + gap);
    const isHighlight = step.highlight;
    const bg = isHighlight ? d.color : C.cream;
    const textColor = isHighlight ? C.white : C.dark;

    slide.addShape(pres.shapes.RECTANGLE, {
      x: stepX, y, w: stepW, h: stepH,
      fill: { color: bg }, shadow: makeShadow(),
    });

    const prefix = i > 0 ? "\u2193  " : "";
    slide.addText(prefix + step.text, {
      x: stepX + 0.2, y, w: stepW - 0.4, h: stepH,
      fontSize: 16, fontFace: "Arial", color: textColor,
      bold: isHighlight, valign: "middle", margin: 0,
    });
  });

  return slide;
}
```

### Valkuilen / Warning Slide

Matches the warningBox and tipBox from Word documents.

```javascript
function addValkuilenSlide(pres, title, items, domain = "markt") {
  const d = DOMAINS[domain];
  const slide = addContentSlide(pres, title, domain);

  const startY = 1.1;
  const itemH = 1.1;
  const gap = 0.15;
  const itemW = 8.6;
  const itemX = 0.7;

  items.forEach((item, i) => {
    const y = startY + i * (itemH + gap);

    // Card background
    slide.addShape(pres.shapes.RECTANGLE, {
      x: itemX, y, w: itemW, h: itemH,
      fill: { color: C.lightRed },
    });
    // Red accent bar (left)
    slide.addShape(pres.shapes.RECTANGLE, {
      x: itemX, y, w: 0.06, h: itemH,
      fill: { color: C.red },
    });
    // Bold header
    slide.addText(item.title, {
      x: itemX + 0.25, y: y + 0.08, w: itemW - 0.5, h: 0.35,
      fontSize: 16, fontFace: "Arial", color: C.red, bold: true, margin: 0,
    });
    // Explanation
    slide.addText(item.body, {
      x: itemX + 0.25, y: y + 0.45, w: itemW - 0.5, h: itemH - 0.55,
      fontSize: 13, fontFace: "Arial", color: C.dark, margin: 0,
    });
  });

  return slide;
}
```

### Samenvatting / Checklist Slide

```javascript
function addSamenvattingSlide(pres, items, domain = "markt") {
  const d = DOMAINS[domain];
  const slide = pres.addSlide({ masterName: "TITLE_DARK" });

  // Accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: d.color },
  });

  slide.addText("Samenvatting", {
    x: 0.7, y: 0.3, w: 8.6, h: 0.6,
    fontSize: 28, fontFace: "Arial", color: C.white, bold: true, margin: 0,
  });

  slide.addText("Beheers je dit voordat je gaat oefenen?", {
    x: 0.7, y: 0.85, w: 8.6, h: 0.4,
    fontSize: 14, fontFace: "Arial", color: C.gray, italic: true, margin: 0,
  });

  // IMPORTANT: Use \n-joined string so PptxGenJS creates separate <a:p> paragraphs.
  // Do NOT use breakLine (creates <a:br/> soft breaks = all text in one paragraph).
  slide.addText(items.join("\n"), {
    x: 0.7, y: 1.5, w: 8.6, h: 3.5,
    bullet: true, fontSize: 15, fontFace: "Arial", color: C.white,
    paraSpaceAfter: 8,
  });

  // Footer bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.15, w: 10, h: 0.475,
    fill: { color: "151D4A" },
  });

  return slide;
}
```

### Definition Table Slide

Two-column table mirroring the defTable from Word.

```javascript
function addDefTableSlide(pres, title, rows, domain = "markt") {
  const d = DOMAINS[domain];
  const slide = addContentSlide(pres, title, domain);

  const tableData = [
    [
      { text: "Begrip", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 14, fontFace: "Arial" } },
      { text: "Betekenis", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 14, fontFace: "Arial" } },
    ],
    ...rows.map((r, i) => [
      { text: r[0], options: { fill: { color: i % 2 === 0 ? C.rowAlt : C.white }, bold: true, fontSize: 13, fontFace: "Arial" } },
      { text: r[1], options: { fill: { color: i % 2 === 0 ? C.rowAlt : C.white }, fontSize: 13, fontFace: "Arial" } },
    ]),
  ];

  slide.addTable(tableData, {
    x: 0.7, y: 1.1, w: 8.6,
    border: { pt: 0.5, color: C.borderGray },
    colW: [2.8, 5.8],
  });

  return slide;
}
```

### Formula Slide

Shows key formulas in a styled box — mirrors formulaBox from Word.

```javascript
function addFormulaSlide(pres, title, formulas, domain = "markt") {
  const d = DOMAINS[domain];
  const slide = addContentSlide(pres, title, domain);

  const boxX = 0.7, boxY = 1.2, boxW = 8.6;
  const lineH = 0.42;
  const boxH = formulas.length * lineH + 0.3;

  // Background
  slide.addShape(pres.shapes.RECTANGLE, {
    x: boxX, y: boxY, w: boxW, h: boxH,
    fill: { color: C.lightGray },
    line: { color: C.borderGray, width: 0.5 },
  });
  // Domain accent (left bar)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: boxX, y: boxY, w: 0.06, h: boxH,
    fill: { color: d.color },
  });

  formulas.forEach((formula, i) => {
    slide.addText(formula, {
      x: boxX + 0.3, y: boxY + 0.15 + i * lineH, w: boxW - 0.6, h: lineH,
      fontSize: 16, fontFace: "Consolas", color: C.dark, margin: 0,
    });
  });

  return slide;
}
```

---

## PART 4: SLIDE DECK TEMPLATES

### Standard Lesson Presentation

The typical flow for a single paragraaf:

```javascript
async function buildLesPresentation(config) {
  // config = {
  //   title: "Monopolie",
  //   paragraafNr: "X.Y.Z",
  //   hoofdstuk: "Hoofdstuk Y: [Naam]",
  //   domain: "bedrijf",
  //   leerdoelen: ["Winstmaximalisatie bij monopolie berekenen", ...],
  //   slides: [
  //     { type: "twoColumn", title: "...", left: {...}, right: {...} },
  //     { type: "flow", title: "...", steps: [...] },
  //     { type: "formula", title: "...", formulas: [...] },
  //     { type: "defTable", title: "...", rows: [...] },
  //     { type: "valkuilen", title: "...", items: [...] },
  //     { type: "custom", builder: (pres, slide) => { ... } },
  //   ],
  //   samenvatting: ["Punt 1", "Punt 2", ...],
  //   speakerNotes: { 1: "Notes for slide 1", ... },
  // }

  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Economie VWO";
  pres.title = config.title;

  addTitleMaster(pres, config.domain);
  addContentMaster(pres, config.domain);

  // 1. Title slide
  addTitleSlide(pres, config.title, config.paragraafNr, config.hoofdstuk, config.domain);

  // 2. Leerdoelen
  addLeerdoelenSlide(pres, config.leerdoelen, config.domain);

  // 3. Content slides
  config.slides.forEach(s => {
    switch (s.type) {
      case "twoColumn":
        addTwoColumnSlide(pres, s.title, s.left, s.right, config.domain);
        break;
      case "flow":
        addFlowSlide(pres, s.title, s.steps, config.domain);
        break;
      case "formula":
        addFormulaSlide(pres, s.title, s.formulas, config.domain);
        break;
      case "defTable":
        addDefTableSlide(pres, s.title, s.rows, config.domain);
        break;
      case "valkuilen":
        addValkuilenSlide(pres, s.title, s.items, config.domain);
        break;
      case "custom":
        const slide = addContentSlide(pres, s.title, config.domain);
        s.builder(pres, slide);
        break;
    }
  });

  // 4. Samenvatting
  addSamenvattingSlide(pres, config.samenvatting, config.domain);

  return pres;
}
```

---

## PART 5: WORD ↔ POWERPOINT MAPPING

This table shows how each Word component maps to its PowerPoint equivalent. Use this when converting materials between formats.

| Word component | PowerPoint equivalent | Visual match |
|---|---|---|
| `domainBanner()` | Header bar on content slide (domain color) | Same color, same domain label feel |
| `formulaBox()` | `addFormulaSlide()` — gray box with domain accent bar | Same left accent stripe + Consolas font |
| `tipBox()` | Card with left accent bar on light background | Same accent color + cream background |
| `warningBox()` | `addValkuilenSlide()` — red accent cards | Same red + light red scheme |
| `summarySchema()` | `addSamenvattingSlide()` — dark slide with bullets | Navy background matches schema header |
| `defTable()` | `addDefTableSlide()` — table with navy header | Same color scheme, alternating rows |
| `visualTOC()` | Leerdoelen slide (simplified overview) | Domain colors in headers |
| `domainLegend()` | Accent bar color on title slide | Domain color identification |
| `denkstapBox()` | Flow/chain slide with yellow accent steps | Same stepBorder color |
| `hintBox()` | Card with purple accent | Same purple accent |

---

## PART 6: QA CHECKLIST

### Every presentation
1. Does every content slide have the **domain-colored header bar**?
2. Is the title slide **dark navy** with domain accent bar at top?
3. Are all colors from the **shared palette** (no random blues or grays)?
4. Is the font **Arial throughout** (except Consolas for formulas)?
5. Do cards use **left accent bars** (not borders all around)?
6. Is text **left-aligned** on content slides (not centered body text)?
7. Are slide backgrounds either **navy (dark)** or **white (light)** — no in-between?
8. Does the closing slide match the **dark style** of the title slide?
9. Are there **speaker notes** for every slide?
10. Has visual QA been run with **thumbnail conversion**?

### Design consistency with Word
11. Would a student recognize the **same domain color** in both the document and the slide?
12. Are **formula boxes** visually similar? (gray background, domain accent left bar, Consolas)
13. Do **warning elements** use the same red accent in both formats?
14. Is the **samenvatting** visually related to the summary schema in Word?

**If any answer is "no", fix before delivering.**

---

## NEVER DO

- Use "#" prefix for hex colors (corrupts PptxGenJS files)
- Encode opacity in 8-char hex strings (use `opacity` property instead)
- Use Unicode bullets (use `bullet: true`)
- Use `breakLine: true` for bullet lists — it creates `<a:br/>` soft breaks inside ONE paragraph, merging all bullets into a single text block. Instead, use `items.join("\n")` with `bullet: true` so PptxGenJS creates separate `<a:p>` paragraphs
- Reuse option objects across addShape/addText calls (PptxGenJS mutates them)
- Use negative shadow offsets (corrupts file)
- Use ROUNDED_RECTANGLE with rectangular accent bars (corners won't align)
- Center body text (left-align everything except titles)
- Use random colors not in the palette (breaks visual unity with Word)
- Mix fonts (Arial + Consolas only, matching Word)
- Skip speaker notes (they're the teaching script)
- Use accent lines under titles (AI-generated look)
- Label begeleide inoefening slides as "makkelijk" or "hulp" — same naming policy as Word

---

Apply this skill to the following task: $ARGUMENTS
