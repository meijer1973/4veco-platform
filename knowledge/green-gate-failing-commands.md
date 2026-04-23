# Green Gate Failing Commands

Generated: 2026-04-23  
Scope: Phase 0 Green Gate for `4veco-platform` and existing `../4veco-lessen` output

## Purpose

This file records the current failing commands and why they fail. The roadmap should stay high-level; this document is the operational failure register for the Green Gate work.

During Phase 0, this document may be updated freely because planning and read-only health checks are allowed. It must not be used as permission to generate, deploy, overwrite, or commit student-facing output in `../4veco-lessen`.

## Current Status

The platform is not green yet. The biggest blockers are:

- the skilltree test contract is stale against the current 44-skill catalog.
- `validate-paragraph.js` still expects an older paragraph folder naming format.
- Book 1 chapters 1.2-1.5 have content quality-gate gaps.
- the proposed `check:platform` and `check:book` commands do not exist yet.

Chapter `1.1 Hoofdstuk Economisch denken en rekenen` currently passes `validate-chapter.js` and can be used as the known-good chapter validation baseline.

## Blocking Platform Commands

### `npm.cmd test -- --runInBand`

Status: failing.

Current result:

- 1 failing test suite.
- 7 passing suites.
- 4 skipped suites.
- 10 failing tests.
- 345 passing tests.

Primary failing suite:

```powershell
engines/tests/skilltree-data.test.js
```

Failure causes:

- The test expects 37 skills, but the current data has 44.
- The layer-count expectation is stale:
  - expected: `[5, 10, 3, 10, 4, 5]`
  - actual: `[7, 13, 5, 10, 4, 5]`
- At least one prerequisite reference points to a skill that is not present in `elements.SKILLS`.
- Generators are missing for `GEN.A38` through `GEN.A44`.

Likely fix direction:

- Decide whether `GEN.A38`-`GEN.A44` are interactive skilltree skills or catalog-only skills.
- If interactive, add generators and repair prerequisite wiring.
- If catalog-only, update tests so they only require generators for interactive skills.
- Replace hard-coded historical skill counts with catalog-driven expectations.

## Validator Commands

### `node scripts\validate-chapter.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen"`

Status: passing.

Current result:

- 0 errors.
- 0 warnings.

Meaning:

- This is the current chapter-validation baseline.
- It proves `validate-chapter.js` can validate at least one current `4veco-lessen` chapter successfully.

### `node scripts\validate-chapter.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.2 Hoofdstuk Vraag"`

Status: failing.

Current result:

- 12 errors.
- 3 warnings.

Failure causes:

- Missing review report for all 4 paragraphs.
- Missing `quality_ref` for all 4 paragraphs.
- Non-compliant asset names in `1.2.2`:
  - `1.2.2_ex1_pizza.png`
  - `1.2.2_ex1_pizza.svg`
  - `1.2.2_ex2_smartphones.png`
  - `1.2.2_ex2_smartphones.svg`
- Orphaned assets in `1.2.2`:
  - `1.2.2_ex_1.svg`
  - `1.2.2_ex_2.svg`
- Missing `_chapter-plan.md`.

Likely fix direction:

- Add the missing chapter plan.
- Add review reports and quality refs after the Green Gate freeze is lifted or as explicitly approved planning/QC work.
- Rename or regenerate the non-compliant assets through the accepted workflow.
- Remove or wire the orphaned assets.

### `node scripts\validate-chapter.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.3 Hoofdstuk Aanbod en kosten"`

Status: failing.

Current result:

- 8 errors.
- 1 warning.

Failure causes:

- Missing review report for all 4 paragraphs.
- Missing `quality_ref` for all 4 paragraphs.
- Missing `_chapter-plan.md`.

Likely fix direction:

- Add the missing chapter plan.
- Add review reports and quality refs after the Green Gate freeze is lifted or as explicitly approved planning/QC work.

### `node scripts\validate-chapter.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.4 Hoofdstuk Marktevenwicht en marginale analyse"`

Status: failing.

Current result:

- 10 errors.
- 0 warnings.

Failure causes:

- Missing review report for all 5 paragraphs.
- Missing `quality_ref` for all 5 paragraphs.
- `_chapter-plan.md` exists.

Likely fix direction:

- Add review reports and quality refs after the Green Gate freeze is lifted or as explicitly approved planning/QC work.

### `node scripts\validate-chapter.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.5 Hoofdstuk Toetsvoorbereiding"`

Status: failing.

Current result:

- 8 errors.
- 0 warnings.

Failure causes:

- Missing review report for all 4 test-prep paragraphs.
- Missing `quality_ref` for all 4 test-prep paragraphs.
- `_chapter-plan.md` exists.

Likely fix direction:

- Add review reports and quality refs after the Green Gate freeze is lifted or as explicitly approved planning/QC work.

### `node scripts\validate-paragraph.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.1 Schaarste en economisch denken"`

Status: failing.

Failure cause:

- `validate-paragraph.js` cannot parse the current flat paragraph folder name.
- It still expects the older format:

```text
X.Y.Z Paragraaf N - Name
```

- The actual current format is:

```text
1.1.1 Schaarste en economisch denken
```

Likely fix direction:

- Keep `validate-paragraph.js` active and required.
- Update it to support the flat `4veco-lessen` paragraph layout.
- Define exactly which files a flat paragraph pack must contain before wiring it into the book health command.

## Missing Health Commands

### `npm.cmd run check:platform`

Status: failing.

Failure cause:

- `package.json` does not define a `check:platform` script yet.

Likely fix direction:

- Add a repeatable platform health command that runs the core test suite and any stable platform checks.

### `npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"`

Status: failing.

Failure cause:

- `package.json` does not define a `check:book` script yet.

Likely fix direction:

- Add a book health command that validates every chapter in a target book path.
- Include `validate-paragraph.js` once the flat-layout contract is implemented.

## Noise That Should Not Distract The Team

- The npm update notice is irrelevant to the Green Gate.
- `validate-chapter.js` fixture output appears in the Jest console, including deliberately bad fixture names and missing files. That output is not itself the current blocking failure; the active Jest failure is the skilltree data suite.
- Module 3 deployment should not be used as the direction for Green Gate work. The gate is about making `4veco-platform` trustworthy for `../4veco-lessen`.

## Phase 0 Next Actions

1. Fix or reclassify `GEN.A38`-`GEN.A44`.
2. Repair the missing skilltree prerequisite reference.
3. Replace stale hard-coded skilltree expectations with data-driven checks.
4. Update `validate-paragraph.js` for the flat paragraph layout.
5. Add `check:platform`.
6. Add `check:book`.
7. Keep chapter 1.1 as the chapter-validator baseline.
8. Treat chapter 1.2-1.5 review, quality-ref, chapter-plan, and asset issues as known Book 1 cleanup work after the gate rules are clear.
