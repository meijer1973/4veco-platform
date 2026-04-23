# Green Gate Failing Commands

Generated: 2026-04-23  
Scope: Phase 0 Green Gate for `4veco-platform` and existing `../4veco-lessen` output

## Purpose

This file records the current failing commands and why they fail. The roadmap should stay high-level; this document is the operational failure register for the Green Gate work.

During Phase 0, this document may be updated freely because planning and read-only health checks are allowed. It must not be used as permission to generate, deploy, overwrite, or commit student-facing output in `../4veco-lessen`.

## Current Status

The core platform test suite is green as of Sprint 0.1. `validate-paragraph.js` is aligned with the flat layout as of Sprint 0.2. `check:platform` and `check:book` exist as of Sprint 0.3. Reference reports were regenerated in Sprint 0.4. Remaining Green Gate blockers are:

- Book 1 chapters 1.2-1.5 have content quality-gate gaps.
- Sprint 0.5 sign-off has not happened yet.

Chapter `1.1 Hoofdstuk Economisch denken en rekenen` currently passes `validate-chapter.js` and can be used as the known-good chapter validation baseline.

## Platform Test Command

### `npm.cmd test -- --runInBand`

Status: passing.

Current result:

- 10 passing suites.
- 4 skipped suites.
- 362 passing tests.
- 5 skipped tests.
- 0 failing tests.

Resolved in Sprint 0.1:

- `GEN.A38` through `GEN.A44` are implemented as interactive skilltree generators.
- Skilltree tests now compare against the active A-domain catalog instead of hard-coded historical counts.
- Non-A catalog prerequisites are preserved in the reference catalog but filtered out of the executable skilltree dependency graph.
- The deployed skilltree bundle now applies the same prerequisite filtering.
- `validate-paragraph.js` has focused tests for flat Part A, consolidation paragraphs, Part B companion packs, and complete-mode failure behavior.

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

Status: passing.

Current result:

- Mode: `part-a (auto)`.
- 0 errors.
- 0 warnings.

Meaning:

- `validate-paragraph.js` now accepts the current flat paragraph folder name.
- A theory Part A paragraph can be validated directly.
- Markdown, PDFs, `build_pdf.py`, assets, review, and quality ref all pass for this baseline paragraph.

### `node scripts\validate-paragraph.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.4 Gemengde opgaven"`

Status: passing.

Current result:

- Mode: `part-a (auto)`.
- 0 errors.
- 0 warnings.

Meaning:

- Consolidation paragraphs are handled as a first-class Part A type.
- They require `opgaven.md`, `antwoorden.md`, `opgaven.pdf`, and `antwoorden.pdf`.
- They do not require `paragraaf.md` or `paragraaf.pdf`.

### `node scripts\validate-paragraph.js --mode complete "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.1 Schaarste en economisch denken"`

Status: expected failure.

Current result:

- Part A passes.
- Part B fails with 29 errors.

Meaning:

- The command correctly proves that Book 1 currently has a Part A textbook paragraph, not a complete Part A + Part B companion pack.
- The missing layer is the companion layer: 23 missing companion root files, `_paragraph-plan.md`, and 5 shared game-data files.
- This is not a platform-validator failure anymore; it is expected until the companion MVP work begins.

## Health Commands

### `npm.cmd run check:platform`

Status: passing.

Current result:

- Runs the platform Jest suite in-band.
- 10 passing suites.
- 4 skipped suites.
- 362 passing tests.
- 5 skipped tests.
- 0 failing tests.

Meaning:

- This is the repeatable platform-side Green Gate command.

### `npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"`

Status: failing on known Book 1 content/QC gaps.

Current result:

- The command exists and runs.
- It validates every chapter with `validate-chapter.js`.
- It validates every paragraph with `validate-paragraph.js --mode auto`.
- Book 1 result: 21 failed checks out of 26.

Failure causes:

- Chapters 1.2-1.5 fail because of missing paragraph review reports and missing `quality_ref` files.
- Chapter 1.2 also still has the known `1.2.2` asset naming/orphan issues.
- Chapters 1.2 and 1.3 still warn about missing `_chapter-plan.md`.
- Paragraphs 1.1.1-1.1.4 pass the paragraph-level check and remain the known-good baseline.

Meaning:

- This is no longer a missing-command blocker.
- The book command now exposes the remaining Book 1 cleanup work directly.

## Reference Report Commands

Status: passing or informational.

Current result:

- `reports/dag-integrity.md`: PASS.
- `reports/terminology-drift.md`: PASS.
- `reports/unresolved-refs.md`: warning only; no unresolved unit IDs, 6 deprecated-ID citations in planning docs.
- Coverage/dead-unit reports now show 190 live units instead of stale 143-145 counts.
- `reports/begrippen-coverage.md`: 225 live terms, 0 deprecated terms.

Meaning:

- Stale generated reports are no longer a Green Gate blocker.
- Detailed status lives in `knowledge/reference-report-sanity.md`.
- Dead units, missing `needs`, missing `terms`, missing pitfalls, and deprecated-ID planning citations are backlog signals, not Phase 0 blockers.

## Noise That Should Not Distract The Team

- The npm update notice is irrelevant to the Green Gate.
- `validate-chapter.js` fixture output appears in the Jest console, including deliberately bad fixture names and missing files. That output is not a current blocking failure; the full Jest suite passes.
- Module 3 deployment should not be used as the direction for Green Gate work. The gate is about making `4veco-platform` trustworthy for `../4veco-lessen`.

## Phase 0 Next Actions

1. Run Sprint 0.5 sign-off.
2. Keep chapter 1.1 as the chapter-validator baseline.
3. Treat chapter 1.2-1.5 review, quality-ref, chapter-plan, and asset issues as known Book 1 cleanup work after the gate rules are clear.
4. Keep `npm run check:platform` and `npm run check:book -- <book-path>` as the team-facing Green Gate commands.
