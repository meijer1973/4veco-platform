---
name: econ-pptx-templates
description: "Build rich economics PPTX presentations via PptxGenJS. Defines pedagogy mandates (graphs, speaker notes, canonical terminology) and the two non-negotiable technical fixes (LibreOffice round-trip for PowerPoint compatibility; 2-digit-number width rule). Recommends — but does not require — the editorial design system in `build-scripts/lib/lib-pptx.js`. Use whenever building presentaties, slides, lesslides, or any PowerPoint deck for economics VWO/HAVO. Always read the `pptx` skill first for PptxGenJS toolchain basics."
pipeline: "Part B producer"
---

# Economics PPTX presentations

Short skill. The previous version prescribed a rigid harness tuned for an older model. This rewrite keeps only what experience proved non-negotiable, drops the rest, and lets designers choose typography, palette, and layout freely.

**Read `pptx` first** for PptxGenJS toolchain, slide dimensions, QA loop, and SVG→PNG conversion. This skill layers economics-specific pedagogy + hard-won technical fixes on top.

---

## MANDATORY — pedagogy

These are not style choices; they come from `references/authored/didactiek-principes.md`, `references/authored/economic_mathematical_precision_reference.md`, and `references/authored/economie-terminologie.md`. Read those when in doubt.

- **≥ 3 economic graphs per presentation.** Dual coding reinforcement (text + visual). Every key concept in a slide deck should appear at least once as a labeled diagram or chart.
- **Theory + worked examples only.** NEVER include exercise instructions ("Maak opgave X", "Bereken …", "Beantwoord …"). Opgaven live in separate files.
- **Speaker notes on every slide.** Teacher-facing. Explain reasoning, anticipate misconceptions, list cues.
- **Body text ≥ 18pt.** Titles typically 28–44pt. Slide stats/hero numbers can go larger; respect the width rule below.
- **Canonical Dutch terminology.** Use terms from `references/authored/economie-terminologie.md` (e.g. "alternatieve kosten", NOT "opportuniteitskosten"). No anglicisms.
- **Economic correctness.** Supply/demand labels, curve directions, units, movement-vs-shift, ceteris paribus — all must match `references/authored/economic_mathematical_precision_reference.md`.
- **Economic graph geometry.** Read the `economic-graph` skill. Run `build-scripts/lib/verify_svg_geometry.py` after every SVG edit.

---

## MANDATORY — teacher-supporting slides

A classroom PPTX is not a textbook page and not a self-study handout. The student is **listening to the teacher and watching the slide at the same time**. When the slide is text-dense, the student's verbal working memory is forced to process speech and reading simultaneously — Sweller's *modality effect* / Mayer's *multimedia-learning* corollary. Output: overload, retention loss. The `samenvatting` and `uitleg` docs cover self-study; the PPTX covers live teaching.

Eight rules. Non-negotiable for new builders; existing builders are migrated as they are touched.

1. **Modality rule.** Slide = visual anchor + short text. On-slide prose ≤ one sentence per concept (~12 words). Long explanations, examples, and caveats live in **speaker notes**. The teacher's voice carries the verbal channel; the slide carries the visual channel.
2. **One idea per slide.** A definition, a graph, or one worked-example step. Do not stack definition + side-table + pitfall-callout + image on the same slide. Pitfalls get their own slide or live only in speaker notes.
3. **Progressive disclosure for graphs.** Build complex graphs across 2–3 slides — curve alone → second curve added → equilibrium marked. Do not show the complete diagram on one slide and narrate over it. This is Mayer's *segmenting* principle.
4. **Redundancy avoidance.** If the teacher says it aloud (per notes), it does not also appear on the slide. A slide bullet that paraphrases the teacher is cognitive noise, not reinforcement.
5. **Speaker notes are the content container.** Structured per slide:
   ```
   Vraag:    [opener prompt for the class]
   Uitleg:   [what to say while the visual is up]
   Pitfall:  [common misconception to surface — if any]
   Overgang: [cue to the next slide]
   ```
   The **Uitleg** block carries the explanation weight that used to sit on the slide. **Pitfall** replaces on-slide VALKUIL callouts.
6. **Typography as structure.** Use the `T` presets from `lib-pptx.js` (`displayLight`, `headlineLight`, `bodyLight`, `heroDark`, …). Stop redefining `fontSize` inline per call — presets already encode the ≥18pt body / ≥28pt title / ≥40pt hero contract.

   **Accessibility floor (L1.5D v2 B8 — non-negotiable):**
   - **Body / explanatory text: ≥ 18 pt.**
   - **Kicker eyebrows / labels / footers: ≥ 14 pt.** Sub-14pt is not acceptable anywhere on a student-facing slide. `T.labelUpper` defaults to 14pt; do NOT pass a `fontSize:` override that drops below 14.
   - **Speaker notes: ≥ 14 pt.** pptxgenjs has no per-run notes-styling API, so the build pipeline must call `fixNotesFontSize(outPath, 14)` after `roundtripWithLibreOffice(outPath)` to stamp the floor. The LO roundtrip must happen first — running the notes fix before LO causes LO to drop the notes entirely.
   - **Color tokens forbidden as small-text foregrounds on light backgrounds (paper / chalk):** `PC.coral` (3.0:1), `PC.amberDeep` (2.84:1), `PC.teal` (2.74:1), `PC.ash` (3.3:1). Use `PC.coralDeep` (4.57:1), `PC.amberInk` (4.93:1), `PC.tealDeep` (5.0:1), `PC.smoke` (~11:1) instead. The brighter accent colors are fine for graphical elements (rect fills, accent stripes, large display numerals at ≥18pt bold where the AA-large 3.0:1 threshold applies) — just not for small text.
7. **Signaling.** Color, arrows, and weight cue the currently-discussed element. Everything else stays neutral. If a graph has three curves, only the one being discussed is colored; the others fade to ash.
8. **Dual coding is a teacher + slide duet**, not a slide-internal pattern. Visual on slide, verbal from teacher. AGENTS.md's *Dual Coding* principle still holds — the pairing just lives across two channels, not both crammed onto one screen.

**QA gate — teacher read-through.** After every presentation build, read the speaker notes aloud at ~45s per slide while looking only at the slide PNG. Confirm: the slide never forces reading during narration, every slide has a clear visual anchor, the **Overgang** cues flow naturally into the next slide. Document failure modes in the paragraph's review notes before shipping.

---

## MANDATORY — technical (the two hard-won lessons)

### 1. PowerPoint compatibility: always round-trip through LibreOffice

Raw PptxGenJS output opens with a "Found a problem with content" repair dialog in Microsoft PowerPoint. Cause: phantom `<Override>` entries in `[Content_Types].xml` plus empty `charts/` / `embeddings/` directories. LibreOffice tolerates this silently; PowerPoint does not. `fixPptxFile()` alone does NOT fix it; python-pptx round-trip does NOT fix it. Only LibreOffice's OOXML exporter produces MS-compliant output.

After every `await pres.writeFile(...)`:

```js
const { fixPptxFile, fixNotesFontSize, roundtripWithLibreOffice } = require("./lib-pptx.js");
await pres.writeFile({ fileName: outPath });
await fixPptxFile(outPath);              // cheap cleanup
roundtripWithLibreOffice(outPath);       // THE PowerPoint-compat fix (soffice --headless --convert-to pptx)
await fixNotesFontSize(outPath, 14);     // L1.5D v2 B8 — bump notes to 14pt AFTER LO roundtrip
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

## RECOMMENDED — use the editorial design system

`build-scripts/lib/lib-pptx.js` is the shared library. New book-side builders belong under `build-scripts/content/book-N/`; older legacy reference builders remain under `build-scripts/content/` and should not be used as the default direction for new work.

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
