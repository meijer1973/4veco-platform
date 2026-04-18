# Promote the creative PPTX approach to become the platform default

## Status at time of writing

**DONE (already shipped to the Module 3 folder, verified in PowerPoint):**
- 4 creative PPTX presentations for §3.3.1–§3.3.4 (De rol van de overheid / Overheidsbeleid / Collectieve goederen / Toepassen) exist at `C:/Projects/4veco/3. Module 3 - Markt en overheid/3.3 Hoofdstuk 3 - Overheid/3.3.X [name]/2. Leren/3.3.X [name] – presentatie – creatief.pptx`. They open cleanly in PowerPoint (no repair dialog), pass visual QA, and are pedagogically equivalent to the harness versions but dramatically better looking.
- 4 creative builders exist at `C:/Projects/4veco/4veco-platform/build-scripts/creative/pptx-33{1,2,3,4}-creative.js` + shared lib `build-scripts/creative/lib-creative.js` + helpers `roundtrip-pptx.py`, `fix-pptx.js`.
- Two memory entries saved:
  - `feedback_svg_rendering_pitfalls.md` — no `<foreignObject>` (librsvg ignores it), escape `<`/`>` in SVG text, `#`-prefix hex inside SVG strings.
  - `feedback_pptx_powerpoint_compat.md` — PptxGenJS output triggers PowerPoint repair dialog; fix is `soffice --headless --convert-to pptx` round-trip (LibreOffice's OOXML exporter produces MS-compliant output). Python-pptx round-trip does NOT fix it. `fixPptxFile()` alone does NOT fix it.

**TO DO (this plan):**
- Promote creative → platform default. Simplify skills and rules. Delete old harness code. Rename files.

## Context for future-me (post-compact)

The user ran an experiment: they asked me (Opus 4.6 / 1M context) to produce PPTX presentations "without harness restrictions" to see whether the previous platform rules (tuned for an older, less capable model) had become over-constraining. I built creative versions that broke many rules and produced editorial-quality decks. Only two problems came out of the whole experiment:

1. **PowerPoint opens the PptxGenJS output with a "found a problem with content" repair dialog.** Root cause: PptxGenJS emits phantom `<Override>` entries in `[Content_Types].xml` and empty `charts/`/`embeddings/` directories. LibreOffice tolerates this silently; PowerPoint chokes. Fix: shell out to `soffice --headless --convert-to pptx` and overwrite the original file with LibreOffice's re-exported version. This was the ONE thing that actually worked — I tried `fixPptxFile()` (strip phantom overrides) and `python-pptx` round-trip first; neither fixed the repair dialog.
2. **Two-digit numbers (`"01"`–`"99"`) stack vertically when the container is too narrow at large font sizes.** Rule: `w ≥ 0.9"` for `fontSize ≥ 24`; `w ≥ 1.1"` for `fontSize ≥ 36`. This bit me repeatedly across the 4 decks.

Everything else the creative approach broke worked out fine — Arial-only, 4-color domain palette, no gradients, no decorative SVG, fixed header bar at y=0.75, cream cards with 0.06" accent bars, two-column-slide mandate. All of these can be dropped.

The user's verdict: "only two errors needed fixing and be put into memory. So now we can update the platform with the simplifications of the skills and builds etc to represent this so future bills will also follow this more creative path with less restrictions."

## Guiding principle

**Delete more than you add.** The new pptx skill should be substantially shorter than the old one. The only rules worth *adding* are the two hard-won lessons above. Everything else is pedagogy that already lives in `references/didactiek-principes.md`, `references/economic_mathematical_precision_reference.md`, `references/economie-terminologie.md` — don't duplicate.

## Three moves

### Move 1: Flatten `build-scripts/creative/` → `build-scripts/`

Promote the creative files to canonical names; delete the harness equivalents. Keep using git so history is preserved.

| Current | Action | Becomes |
|---|---|---|
| `build-scripts/creative/lib-creative.js` | `git mv` | `build-scripts/lib-pptx.js` |
| `build-scripts/creative/pptx-331-creative.js` | `git mv` (overwrite) | `build-scripts/pptx-331-rol-overheid.js` |
| `build-scripts/creative/pptx-332-creative.js` | `git mv` (overwrite) | `build-scripts/pptx-332-overheidsbeleid.js` |
| `build-scripts/creative/pptx-333-creative.js` | `git mv` (overwrite) | `build-scripts/pptx-333-collectieve-goederen.js` |
| `build-scripts/creative/pptx-334-creative.js` | `git mv` (overwrite) | `build-scripts/pptx-334-toepassen.js` |
| `build-scripts/creative/roundtrip-pptx.py` | `git mv` | `build-scripts/roundtrip-pptx.py` |
| `build-scripts/creative/fix-pptx.js` | `git rm` | — (logic is in `lib-pptx.js`) |
| `build-scripts/pptx-template_presentatie.js` | `git rm` | — (reference is now `pptx-331-rol-overheid.js`) |
| `build-scripts/lib-svg-save.js` | `git rm` | — (unused by canonical builders) |
| `build-scripts/creative/` folder | delete after empty | — |

**In each moved builder, edit the `require()` line:** `require("./lib-creative.js")` → `require("./lib-pptx.js")`. (5 files: lib itself is fine; 4 builders need the edit.)

**Rename deployed files in Module 3:** for each of §3.3.1–§3.3.4, rename `3.3.X [name] – presentatie – creatief.pptx` → `3.3.X [name] – presentatie.pptx` in the `2. Leren/` folder (overwrites the existing harness output — that's fine, we're about to delete the scripts that built it). **Check nothing is open in PowerPoint first.**

### Move 2: Rewrite `skills/econ-pptx-templates.md` as a short skill

Target: **under 200 lines** (current is ~670). Remove the prescriptive design-system code — it now lives in `build-scripts/lib-pptx.js`. Builders that don't want to use the lib don't have to.

Body of the new skill (skeleton):

```markdown
---
name: econ-pptx-templates
description: ...
---

# Economics PPTX presentations

## MANDATORY — pedagogy (keep)
- ≥ 3 economic graphs per presentation (dual coding; reinforces didactiek-principes.md)
- Theory + worked examples only — NEVER exercise instructions ("maak opgave X" etc.)
- Speaker notes on every slide
- Body text ≥ 18pt
- Canonical Dutch terminology from `references/economie-terminologie.md`
- Economic correctness per `references/economic_mathematical_precision_reference.md`

## MANDATORY — technical (the two hard-won lessons)
- After `pres.writeFile()`, run `roundtripWithLibreOffice(outPath)` from `lib-pptx.js`.
  PowerPoint rejects raw PptxGenJS output with a "found a problem with content" dialog;
  LibreOffice's OOXML exporter produces the MS-compliant output PowerPoint needs.
- For 2-digit numbered labels (`"01"`–`"99"`) in shapes:
  width ≥ 0.9" for font ≥ 24pt, width ≥ 1.1" for font ≥ 36pt — otherwise digits stack.
- After every build, run a visual QA pass:
  `soffice --headless --convert-to pdf --outdir <tmp> <file.pptx>` + `pdftoppm -r 90 <pdf> <tmp>/slide -png`
  Read each slide PNG and fix any layout collisions before shipping.

## RECOMMENDED — use the editorial design system
`build-scripts/lib-pptx.js` exports:
- `PC` / `SC` / `HEX` — 8-color editorial palette (two namespaces: PC=bare hex for PptxGenJS, SC=#-prefixed for SVG)
- `T` — typography presets (Segoe UI + Georgia, variable weights)
- `defineMasters(pres)` — 3 masters: DARK_HERO, LIGHT_ED, SIDEBAR
- `ICON`, `placeIcon()` — pictogram library (factory, dike, coin, scale, syringe, …)
- `svgHeader()`, `editorialTitle()` — FT-style chart framing
- `svgToPng()`, `svgData()` — sharp pipeline at 1440px
- `fixPptxFile()`, `roundtripWithLibreOffice()` — the two technical fixes above

Reference builder: `build-scripts/pptx-331-rol-overheid.js`. Structure to follow:
build SVGs → rasterize → define masters → add slides → writeFile → fixPptxFile → roundtripWithLibreOffice.

## SVG pitfalls (librsvg / sharp)
- No `<foreignObject>` — librsvg renders it as empty space. Use plain `<text>` elements; wrap multi-line manually.
- Escape `<`, `>`, `&` in SVG `<text>` content (`&lt;`, `&gt;`, `&amp;`).
- Use `#`-prefixed hex inside SVG (`fill="#1A5276"`). Bare hex (`fill="1A5276"`) silently renders black.

## NO LONGER MANDATORY (dropped intentionally)
These were harness rules; creative builds broke them and still produced better results:
- Arial-only font discipline
- Fixed 4-color domain palette (teal/blue/amber/green)
- "No gradients" / "no decorative elements / no icons"
- Universal domain-colored header bar at y=0.75"
- Cream card backgrounds with 0.06" left accent bars
- Two-column card layout as default
- "No hero-stat slides / no full-bleed dark slides"
- Shadow factory prescriptions
- Domain-color-per-chapter enforcement

Designers are free to choose typography, palette, layouts, and decoration. Pedagogy + LibreOffice round-trip are the only non-negotiables.
```

### Move 3: Update the few docs pointing at deleted harness filenames

- `AGENTS.md` — remove the `pptx-template_presentatie.js` row from the builders table; scan for lines repeating constraints now covered by the slimmer skill (e.g. "witte achtergrond voor grafieken", "rustige compositie") and trim them.
- `BUILD-PARAGRAPH.md` — replace `pptx-351-afsluiting.js` reference (line ~184) with `pptx-331-rol-overheid.js`.
- `build-scripts/README.md` — rewrite the pptx taxonomy section to list only the 4 canonical builders + `lib-pptx.js` + `roundtrip-pptx.py`.
- `.claude/commands/econ-pptx-templates.md` — copy the new `skills/econ-pptx-templates.md` over this file so they stay in sync.
- Scan for any other references to `pptx-template_presentatie.js`, `lib-svg-save.js`, or `creative/` and fix.

**Explicitly NOT changing:**
- `skills/economic-graph.md` — economic-correctness rules the creative charts still follow. The creative version *extends* them (annotations, callouts, stylized backgrounds) rather than breaking them. Leave alone.
- `references/*.md` — pedagogy references stay untouched.
- Word / docx builders — out of scope (user said "future bills will also follow this more creative path" — bill = build, scope is PPTX).

## Critical files

**To modify:**
- `4veco-platform/skills/econ-pptx-templates.md` — rewrite (→ ~200 lines, down from ~670)
- `4veco-platform/.claude/commands/econ-pptx-templates.md` — mirror of the above
- `4veco-platform/AGENTS.md` — trim redundant rules + remove reference to deleted template file
- `4veco-platform/BUILD-PARAGRAPH.md` — update reference filename
- `4veco-platform/build-scripts/README.md` — new pptx taxonomy

**To move/rename (via `git mv`):**
- `build-scripts/creative/lib-creative.js` → `build-scripts/lib-pptx.js`
- `build-scripts/creative/pptx-33{1..4}-creative.js` → `build-scripts/pptx-33{1..4}-<slug>.js`
- `build-scripts/creative/roundtrip-pptx.py` → `build-scripts/roundtrip-pptx.py`
- Module 3 deployed files: drop the " – creatief" suffix (standard `mv`, not git)

**To delete (via `git rm`):**
- `build-scripts/pptx-template_presentatie.js`
- `build-scripts/lib-svg-save.js`
- `build-scripts/creative/fix-pptx.js`
- `build-scripts/creative/` folder (after empty)

**To preserve (these are the pieces that worked — do not touch):**
- `build-scripts/verify_svg_geometry.py` — graph-integrity verifier; still useful
- `build-scripts/lib-begeleide-inoefening.js` and other docx builders — out of scope
- `build-scripts/creative/lib-creative.js` code itself — just needs renaming, no internal edits except JSZip require path (see risks below)

## Existing helpers to reuse (already in `lib-creative.js` / will be `lib-pptx.js`)

All the infrastructure is already written. Post-rename the API is:

```js
const {
  PC, SC, HEX,                     // colors
  FONT_SANS, FONT_DISPLAY, FONT_SERIF, FONT_MONO,
  T,                               // typography presets
  defineMasters,                   // adds DARK_HERO / LIGHT_ED / SIDEBAR
  softShadow, tightShadow,
  svgToPng, pngB64, svgData,       // sharp pipeline
  ICON, placeIcon,                 // pictogram library
  lineParams, intersect,           // chart geometry
  svgHeader, editorialTitle,       // FT-style chart framing
  fixPptxFile, roundtripWithPythonPptx, roundtripWithLibreOffice,
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
  await fixPptxFile(outPath);          // cheap cleanup
  roundtripWithLibreOffice(outPath);   // THE fix for PowerPoint
}
```

## Risks / pitfalls

- **`lib-creative.js` contains a hardcoded require path** to `C:/Users/meije/AppData/Roaming/npm/node_modules/pptxgenjs/node_modules/jszip`. When it becomes `lib-pptx.js`, that path still works. Don't touch.
- **`roundtripWithLibreOffice` hardcodes** `C:/Program Files/LibreOffice/program/soffice.exe`. Windows-only per the project CLAUDE.md. Don't touch.
- **`__dirname` for the roundtrip-pptx.py lookup** — `lib-pptx.js` calls `path.join(__dirname, "roundtrip-pptx.py")`. After the move, both files are in `build-scripts/` so the path still resolves.
- **Module 3 file rename fails if PowerPoint has a file open** ("Device or resource busy"). The instructions in the skill already cover this — pause, ask user to close, retry.
- **Git move keeps history cleanly** — use `git mv` not `rm + cp`, so blame survives.

## Verification

After executing the plan:

1. `cd 4veco-platform && NODE_PATH="C:/Users/meije/AppData/Roaming/npm/node_modules" node build-scripts/pptx-331-rol-overheid.js` — runs cleanly from the new location. Repeat for 332/333/334.
2. Each build output reports `roundtripped via LibreOffice`.
3. Open each deployed `.pptx` in Microsoft PowerPoint — no "Found a problem with content" dialog.
4. Open each in LibreOffice — visual identical to pre-promotion versions (same 23/21/14/14 slide counts, same key slides: §3.3.1 slide 3/11/12, §3.3.2 slide 17, etc.).
5. `git status` shows: 4 modified skills/docs, 5 moved files (with `R`-prefix in status), 3 deleted files. Clean and minimal.
6. `wc -l skills/econ-pptx-templates.md` < 200 lines (down from ~670).
7. No remaining references to `creative/`, `pptx-template_presentatie.js`, `lib-svg-save.js`, or `fix-pptx.js` anywhere in the repo: `grep -r "pptx-template_presentatie\|lib-svg-save\|creative/fix-pptx\|creative/lib-creative" 4veco-platform/` returns nothing.

## Execution order (when the user says go)

**Step A — Git hygiene first (requested by user, pre-compact):**
```bash
cd "C:/Projects/4veco/4veco-platform"
git add -A
git commit -m "Creative PPTX build for §3.3.1–§3.3.4 + LibreOffice round-trip fix"
git push origin main
```
Also commit in the Module 3 repo if it's a separate repo.

**Step B — Execute the plan (move/rename/rewrite):**
1. `git mv build-scripts/creative/lib-creative.js build-scripts/lib-pptx.js`
2. `git mv build-scripts/creative/roundtrip-pptx.py build-scripts/roundtrip-pptx.py`
3. `git mv build-scripts/creative/pptx-331-creative.js build-scripts/pptx-331-rol-overheid.js` (overwrite with `-f`)
4. Same for 332/333/334 with their proper slugs
5. Edit each moved builder: `require("./lib-creative.js")` → `require("./lib-pptx.js")`
6. `git rm build-scripts/creative/fix-pptx.js`
7. `git rm build-scripts/pptx-template_presentatie.js`
8. `git rm build-scripts/lib-svg-save.js`
9. `rmdir build-scripts/creative/` (should be empty)
10. Rewrite `skills/econ-pptx-templates.md` per the skeleton above
11. Copy to `.claude/commands/econ-pptx-templates.md`
12. Trim AGENTS.md, BUILD-PARAGRAPH.md, build-scripts/README.md
13. Rename Module 3 deployed files: in each `3.3.X [name]/2. Leren/`, `mv '3.3.X [name] – presentatie – creatief.pptx' '3.3.X [name] – presentatie.pptx'` (check nothing open in PowerPoint first)
14. Run verification steps

**Step C — Post-verification commit:**
```bash
git add -A
git commit -m "Promote creative PPTX approach to platform default

- Rename build-scripts/creative/* → build-scripts/*
- Delete harness pptx builders + pptx-template_presentatie.js + lib-svg-save.js
- Rewrite skills/econ-pptx-templates.md as a short skill (~200 lines, was ~670)
- Require LibreOffice round-trip after every PPTX build
- Drop Arial-only, 4-color palette, no-gradient, no-decoration rules
- Module 3 creative decks become the canonical presentations"
git push origin main
```

## Memory entries already saved (do NOT re-save on execute)

- `~/.claude/projects/C--Projects-4veco-4veco-platform/memory/feedback_svg_rendering_pitfalls.md`
- `~/.claude/projects/C--Projects-4veco-4veco-platform/memory/feedback_pptx_powerpoint_compat.md`

Indexed in `~/.claude/projects/C--Projects-4veco-4veco-platform/memory/MEMORY.md`.

## Summary for compact survival

After compaction, re-reading this file tells the next turn:
1. WHY: harness rules over-constrained a now-capable model; creative build proved it; promote creative to default.
2. WHAT'S DONE: 4 creative PPTX files shipped to Module 3, verified in PowerPoint, pass visual QA.
3. WHAT'S LEFT: move/rename files, rewrite 1 skill, trim a few docs, redeploy Module 3 PPTX with stripped suffix.
4. THE TWO NEW RULES: LibreOffice round-trip + 2-digit-number-width rule (everything else drops).
5. EXECUTION: the step-by-step git/node commands above are literal and complete.
