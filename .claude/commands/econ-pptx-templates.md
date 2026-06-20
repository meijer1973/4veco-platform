---
name: econ-pptx-templates
description: "Build rich economics PPTX presentations via PptxGenJS. Defines pedagogy mandates (graphs, speaker notes, canonical terminology) and the two non-negotiable technical fixes (LibreOffice round-trip for PowerPoint compatibility; 2-digit-number width rule). Recommends — but does not require — the editorial design system in `build-scripts/lib/lib-pptx.js`. Use whenever building presentaties, slides, lesslides, or any PowerPoint deck for economics VWO/HAVO. Always read the `pptx` skill first for PptxGenJS toolchain basics."
---

# Economics PPTX presentations

## Production direction - web first, PPTX second

For 4veco presentations, the preferred production route is now:

1. Build a semantic web-first presentation model.
2. Render and review the web presentation.
3. Use the web version as the source of design truth.
4. Generate PPTX only after the web version passes student, teacher, visual, and accessibility review.

Do not treat PPTX as the design source when a web presentation route exists.

Read these before building new presentation work:

- `references/exemplars/1.1.1-golden-presentation/`
- `references/presentation/presentation-policy.md`
- `references/presentation/speaker-notes-policy.md`
- `references/presentation/powerpoint-derivative-policy.md`

Every production presentation starts with a route-contract slide:

- what students will learn;
- why it matters;
- what route the lesson follows;
- what students should be able to do at the end.

Default economics presentation route:

1. Route contract.
2. Concrete narrative or source anchor.
3. Core concept.
4. Transfer to another context.
5. Misconception control.
6. Canonical procedure or model.
7. Worked example, calculation/setup.
8. Worked example, interpretation/conclusion.
9. Active formative check.
10. Summary and bridge.

Agents may deviate, but they must explain why.

Short skill. The previous version prescribed a rigid harness tuned for an older model. This rewrite keeps only what experience proved non-negotiable, drops the rest, and lets designers choose typography, palette, and layout freely.

**Read `pptx` first** for PptxGenJS toolchain, slide dimensions, QA loop, and SVG→PNG conversion. This skill layers economics-specific pedagogy + hard-won technical fixes on top.

---

## MANDATORY — pedagogy

These are not style choices; they come from `references/authored/didactiek-principes.md`, `references/authored/economic_mathematical_precision_reference.md`, and `references/authored/economie-terminologie.md`. Read those when in doubt.

- **≥ 3 economic graphs per presentation.** Dual coding reinforcement (text + visual). Every key concept in a slide deck should appear at least once as a labeled diagram or chart.
- **Theory + worked examples, plus at most a short active check.** NEVER include exercise-set instructions ("Maak opgave X", "Bereken …", "Beantwoord …"). Opgaven live in separate files. A presentation may include a short active-check slide if it checks immediate understanding and does not replace the paragraph's exercise/check surfaces.
- **Speaker notes on every slide.** Notes have two modes:
  - Web-first presentations: student-facing explanations. These notes must be readable by students and explain the slide without relying on live teacher narration.
  - PPTX live-teaching exports: teacher-supporting notes. These may include prompts, teacher cues, misconception warnings, and transitions.
  - When one semantic model feeds both outputs, keep notes structured: `studentExplanation`, `misconceptionWatch`, `teacherCue`, `transition`.
- **Body text ≥ 18pt.** Titles typically 28–44pt. Slide stats/hero numbers can go larger; respect the width rule below.
- **Canonical Dutch terminology.** Use terms from `references/authored/economie-terminologie.md` (e.g. "alternatieve kosten", NOT "opportuniteitskosten"). No anglicisms.
- **Economic correctness.** Supply/demand labels, curve directions, units, movement-vs-shift, ceteris paribus — all must match `references/authored/economic_mathematical_precision_reference.md`.
- **Economic graph geometry.** Read the `economic-graph` skill. Run `build-scripts/lib/verify_svg_geometry.py` after every SVG edit.

---

## MANDATORY — technical (the two hard-won lessons)

### 1. PowerPoint compatibility: always round-trip through LibreOffice

Raw PptxGenJS output opens with a "Found a problem with content" repair dialog in Microsoft PowerPoint. Cause: phantom `<Override>` entries in `[Content_Types].xml` plus empty `charts/` / `embeddings/` directories. LibreOffice tolerates this silently; PowerPoint does not. `fixPptxFile()` alone does NOT fix it; python-pptx round-trip does NOT fix it. Only LibreOffice's OOXML exporter produces MS-compliant output.

After every `await pres.writeFile(...)`:

```js
const { fixPptxFile, roundtripWithLibreOffice } = require("./lib-pptx.js");
await pres.writeFile({ fileName: outPath });
await fixPptxFile(outPath);         // cheap cleanup
roundtripWithLibreOffice(outPath);  // THE fix (shells to soffice --headless --convert-to pptx)
```

`roundtripWithLibreOffice` hardcodes the Windows path to `soffice.exe`. Project is Windows-only per root CLAUDE.md.

### 2. Two-digit numbered labels need room

Labels like `"01"`–`"99"` in shapes stack vertically when the container is too narrow at large font sizes. Enforce:

- `fontSize ≥ 24` → shape width **≥ 0.9"**
- `fontSize ≥ 36` → shape width **≥ 1.1"**

This bit every single §3.3.x deck. Check all numbered call-outs during visual QA.

---

## MANDATORY — visual QA after every build

Don't ship without looking at every slide.

```bash
soffice --headless --convert-to pdf --outdir /tmp/qa "<file.pptx>"
pdftoppm -r 90 /tmp/qa/<file>.pdf /tmp/qa/slide -png
```

Read each slide PNG. Look for: title/subtitle collisions, clipped text, stacked digits, overlapping shapes, missing graphs. Fix before shipping.

---

## MANDATORY — PPTX derivative requirements

When generating PPTX from a semantic web-first model:

- Preserve the route-contract slide.
- Preserve all core assertions.
- Preserve student-facing notes where possible.
- Convert notes to teacher-supporting format if the export is intended for live teaching.
- Keep body text ≥18 pt and labels ≥14 pt.
- Run LibreOffice roundtrip.
- Run visual QA on exported slide PNGs.
- Document any content lost from web to PPTX.

---

## RECOMMENDED — use the editorial design system

`build-scripts/lib/lib-pptx.js` is the shared library. Reference builder: `build-scripts/content/module-3/pptx-331-rol-overheid.js`.

Exports:

```js
const {
  PC, SC, HEX,                     // palettes: PC=bare hex for PptxGenJS, SC=#-prefixed for SVG
  FONT_SANS, FONT_DISPLAY, FONT_SERIF, FONT_MONO,
  T,                               // typography presets
  defineMasters,                   // adds DARK_HERO / LIGHT_ED / SIDEBAR masters
  softShadow, tightShadow,
  svgToPng, pngB64, svgData,       // sharp → PNG pipeline at 1440px
  ICON, placeIcon,                 // pictogram library (factory, dike, coin, scale, …)
  lineParams, intersect,           // chart geometry helpers
  svgHeader, editorialTitle,       // FT-style chart framing
  fixPptxFile, roundtripWithLibreOffice,
} = require("./lib-pptx.js");
```

Standard builder shape:

```js
async function build() {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: "CUSTOM_16x9", width: 10, height: 5.625 });
  pres.layout = "CUSTOM_16x9";
  defineMasters(pres);

  // build SVGs, rasterize to PNG base64, add slides …

  await pres.writeFile({ fileName: outPath });
  await fixPptxFile(outPath);
  roundtripWithLibreOffice(outPath);
}
```

Builders that want a different palette or typography are free to roll their own — only the two technical fixes above are non-negotiable.

---

## SVG pitfalls (librsvg / sharp)

Three repeat bugs. Pre-empt all three when writing SVG string generators.

1. **No `<foreignObject>`.** librsvg renders it as empty space with no error. Use plain `<text>` elements; split multi-line content across multiple `<text>` tags with manual `y` offsets (or `<tspan dy="...">`).
2. **Escape `<`, `>`, `&` in SVG `<text>` content.** `Pmin > P*` breaks the parser ("StartTag: invalid element name"). Use `&lt;`, `&gt;`, `&amp;`.
3. **`#`-prefixed hex inside SVG.** SVG attributes need `"#1A5276"`; PptxGenJS options take bare `"1A5276"`. `lib-pptx.js` keeps the two namespaces: `PC.xxx` (bare) and `SC.xxx` (`#`-prefixed). Mixing them: SVG silently renders black.

---

## NO LONGER MANDATORY (dropped intentionally)

These were harness rules the creative §3.3.x builds broke successfully. Designers may follow them, but the skill no longer requires them:

- Arial-only font discipline
- Fixed 4-color domain palette (teal / blue / amber / green)
- "No gradients" / "no decorative elements" / "no icons"
- Universal domain-colored header bar at y=0.75"
- Cream card backgrounds with 0.06" left accent bars
- Two-column card layout as the default
- "No hero-stat slides / no full-bleed dark slides"
- Prescribed shadow factories
- One-domain-color-per-chapter enforcement

Pedagogy + LibreOffice round-trip + 2-digit-width rule are the only non-negotiables.
