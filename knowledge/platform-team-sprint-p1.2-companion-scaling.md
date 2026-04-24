# Sprint P1.2 Companion Scaling Triage

Generated: 2026-04-24  
Owner: Platform team  
Status: active, not complete

## Purpose

Record the first repeatability probe after the `1.1.1` companion proof sprint. This note is internal planning/triage only. It must not generate or overwrite student-facing output.

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

Missing Part B items:

- 23 of the 24 required companion root files; only `index.html` exists.
- `_paragraph-plan.md`
- `shared/questions/1.1.2.js`
- `shared/newsdetective/1.1.2.js`
- `shared/reasoning/1.1.2.js`
- `shared/procedure/1.1.2.js`
- `shared/skilltree/1.1.2.js`

## Initial Ownership Read

No new platform-owned blocker has been proven yet.

The current failures are expected because the second companion paragraph has not been produced. Treat them as content/data work until the missing inputs exist and a builder, converter, validator, or generator fails despite valid inputs.

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
- running deploy/build steps only when production-output writes are allowed again

## Safe Next Actions During The Freeze

Allowed:

- keep this triage note and roadmap status updated
- inspect existing `1.1.2` files read-only
- draft planning/checklists
- run read-only validation commands
- use scratch copies outside production output paths if a platform hypothesis needs reproduction

Not allowed:

- run `scripts/deploy.js` against `../4veco-lessen`
- generate or overwrite `1.1.2` companion files in `../4veco-lessen`
- edit production Book 1 shared data or manifest files as part of this platform sprint without explicit unfreeze/approval

## Handoff Checklist For `1.1.2`

Before the next complete validation can prove platform repeatability, `1.1.2` needs:

- `_paragraph-plan.md` filled from `build-scripts/templates/template-paragraph-plan.md`
- static `Lees dit als je niet weet hoe je moet beginnen met deze les.docx`
- quiz data in `shared/questions/1.1.2.js`
- source reasoning CSV in `source-data/book-1/reasoning/1.1.2.csv`
- compiled reasoning data in `shared/reasoning/1.1.2.js`
- newsdetective data in `shared/newsdetective/1.1.2.js`
- procedure data in `shared/procedure/1.1.2.js`
- skilltree manifest decision and resulting `shared/skilltree/1.1.2.js`
- rich companion files listed in `BUILD-PARAGRAPH.md` Part B
- converted HTML for voorkennis, vaardigheden, and begeleide inoefening

## Exit Condition For This Sprint

Sprint P1.2 is complete only when at least two Book 1 companion paragraphs pass:

```powershell
node scripts\validate-paragraph.js --mode complete "<paragraph-folder>"
```

Current count:

- passed: `1.1.1`
- not yet passed: `1.1.2`
