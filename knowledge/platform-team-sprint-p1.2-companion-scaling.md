# Sprint P1.2 Companion Scaling Triage

Generated: 2026-04-24  
Owner: Platform team  
Status: complete  
Freeze state: platform/output freeze lifted on 2026-04-24

## Purpose

Record the first repeatability probe after the `1.1.1` companion proof sprint. The probe is now complete: `1.1.2` has been produced and passes complete-mode validation.

## Selected Probe

Paragraph:

- `1.1.2 Percentages en indexcijfers`

Why this paragraph:

- It is the next registered Book 1 paragraph after the proven `1.1.1` MVP.
- It lives in the same chapter and therefore avoids adding a new chapter-layout variable.
- Its Part A textbook outputs already exist and pass validation.
- It exposes the real Part B scaling question: can the companion path repeat once content/data inputs are produced?

## Commands Run

Green-gate checks:

```powershell
npm.cmd run check:platform
npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
```

Observed result:

- `check:platform` exited cleanly.
- `check:book` passed 26/26 checks in Part A mode.

Paragraph validation:

```powershell
node scripts\validate-paragraph.js --mode complete "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.1 Schaarste en economisch denken"
node scripts\validate-paragraph.js --mode complete "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.2 Percentages en indexcijfers"
node scripts\validate-paragraph.js --mode part-b "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.2 Percentages en indexcijfers"
```

Observed result:

- `1.1.1` passed complete validation.
- `1.1.2` passed its Part A checks.
- `1.1.2` failed complete and Part B validation with 29 errors because companion inputs/outputs are not built yet.

Completion commands:

```powershell
node build-scripts\content\book-1\b1-112-game-data.js
$env:MODULE_ROOT="..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"; node build-scripts\platform\build-reasoning-questions.js 1.1.2 math-economics source-data\book-1\reasoning\1.1.2.csv
node build-scripts\content\book-1\b1-112-companions.js
node scripts\deploy.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
node scripts\validate-paragraph.js --mode complete "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.2 Percentages en indexcijfers"
node scripts\validate-paragraph.js --mode complete "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.1 Schaarste en economisch denken"
```

Completion result:

- `scripts/deploy.js` completed successfully for Book 1.
- `1.1.2` passed complete validation with 24/24 Part B files present.
- `1.1.1` still passed complete validation after the deploy.
- Book health passed 26/26 checks.
- Platform tests passed.

## Current `1.1.2` State

Present Part A/root files:

- paragraaf/opgaven/antwoorden markdown
- paragraaf/opgaven/antwoorden PDFs
- paragraaf/opgaven/antwoorden HTML exports
- `build_pdf.py`
- `1.1.2-review.md`
- `1.1.2-quality-ref.yaml`
- `index.html`
- `_assets/` with four SVG/PNG pairs

Resolved Part B items:

- all 24 required companion root files exist
- `_paragraph-plan.md` exists
- `shared/questions/1.1.2.js` exists
- `shared/newsdetective/1.1.2.js` exists
- `shared/reasoning/1.1.2.js` exists
- `shared/procedure/1.1.2.js` exists
- `shared/skilltree/1.1.2.js` exists

## Initial Ownership Read

No new platform-owned layout/deploy blocker was proven by the second paragraph.

The initial failures were expected because the second companion paragraph had not been produced. After the inputs existed, the flat Book 1 path repeated cleanly.

Platform-owned if discovered later:

- validator rejects valid flat-layout files
- generator cannot resolve a registered Book 1 paragraph
- shared runtime paths are wrong for the flat Book 1 layout
- valid game data fails because of stale or Module 3-specific assumptions

Content/data-owned at this point:

- writing `_paragraph-plan.md`
- creating quiz/newsdetective/reasoning/procedure data
- deciding and registering the skilltree mapping
- copying the static helper file
- producing rich companion docs and converted HTML
- running deploy/build steps intentionally as part of the controlled production workflow

## Safe Next Actions After Unfreeze

Allowed:

- keep this triage note and roadmap status updated
- inspect existing `1.1.2` files read-only
- draft planning/checklists
- run read-only validation commands
- produce the missing `1.1.2` companion inputs/outputs under the normal `BUILD-PARAGRAPH.md` workflow
- run deploy/generator steps when intentionally building production output, followed by validation

Still not allowed:

- treating `scripts/deploy.js` as a read-only probe
- untracked/manual patchwork that bypasses the paragraph build workflow
- writing dashboard/internal review output into student-facing material
- changing the separately frozen legacy Module 3 production target

## Handoff Checklist For `1.1.2`

Completed items:

- `_paragraph-plan.md` filled for `1.1.2`
- static `Lees dit als je niet weet hoe je moet beginnen met deze les.docx`
- quiz data in `shared/questions/1.1.2.js`
- source reasoning CSV in `source-data/book-1/reasoning/1.1.2.csv`
- compiled reasoning data in `shared/reasoning/1.1.2.js`
- newsdetective data in `shared/newsdetective/1.1.2.js`
- procedure data in `shared/procedure/1.1.2.js`
- skilltree manifest decision and resulting `shared/skilltree/1.1.2.js`
- rich companion files listed in `BUILD-PARAGRAPH.md` Part B
- HTML for voorkennis, vaardigheden, and begeleide inoefening

## Exit Condition For This Sprint

Sprint P1.2 is complete: at least two Book 1 companion paragraphs pass:

```powershell
node scripts\validate-paragraph.js --mode complete "<paragraph-folder>"
```

Current count:

- passed: `1.1.1`
- passed: `1.1.2`

Residual risk:

- This proves repeatability for a second paragraph, not safe bulk production across the whole book.
- The companion quality-gate backlog in `knowledge/platform-team-companion-quality-gate-review.md` should be handled before broad scaling.
