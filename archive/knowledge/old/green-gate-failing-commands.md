# Green Gate Command Register

Generated: 2026-04-23  
Updated: 2026-04-24 after explicit platform unfreeze sign-off  
Scope: Phase 0 Green Gate for `4veco-platform` and existing `../4veco-lessen` output

## Current Status

There are no remaining Phase 0 Green Gate command failures.

Sprint 0.5 is signed off and the deployment/output freeze is lifted for controlled `../4veco-lessen` production under the normal build/validation workflow.

The first Part B companion path has been proven end-to-end for `1.1.1 Schaarste en economisch denken`. Scaling the companion path beyond that paragraph remains Sprint P1.2 work.

## Green Commands

### `npm.cmd run check:platform`

Status: passing.

Current result:

- 10 passing suites.
- 4 skipped suites.
- 362 passing tests.
- 5 skipped tests.
- 0 failing tests.

Meaning:

- This is the repeatable platform-side Green Gate command.
- The skipped suites/tests are existing intentional skips, not current blockers.

### `npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"`

Status: passing.

Current result:

- 5/5 chapters pass.
- 21/21 paragraphs pass.
- 26/26 total checks pass.

Meaning:

- Book 1 Part A textbook/chapter validation is green.
- All missing review and quality-ref artifacts have been backfilled.
- All unresolved review `FAIL` items found during Sprint 0.5 have been fixed.
- The book health command is now suitable as the routine guardrail before and after Part A material changes.

## Companion Verification

### `node scripts\validate-paragraph.js --mode complete "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.1 Schaarste en economisch denken"`

Status: expected failure.

Current result:

- Part A passes.
- Part B fails with 30 errors.
- 0/24 required Part B files are present.
- `_paragraph-plan.md` is missing.
- Shared game data are missing:
  - `shared/questions/1.1.1.js`
  - `shared/newsdetective/1.1.1.js`
  - `shared/reasoning/1.1.1.js`
  - `shared/procedure/1.1.1.js`
  - `shared/skilltree/1.1.1.js`

Meaning:

- The validator correctly distinguishes Part A textbook output from complete Part A + Part B companion packs.
- Book 1 can deliver textbook/chapter products now.
- Book 1 cannot yet deliver a complete companion paragraph without first building the Part B layer.

## Companion Pipeline Gaps

Observed on 2026-04-23:

- `build-scripts/content/book-1/` does not exist.
- Book 1 root currently has no `deploy-config.json`.
- Book 1 root currently has no `shared/` game-data/engine layer.
- Existing Book 1 paragraph folders contain Part A markdown/HTML/PDF/QC artifacts, not the 24 required Part B companion files.

Next action:

1. Build one representative companion MVP paragraph.
2. Add the Book 1 `deploy-config.json` and `shared/` data layer needed by `scripts/deploy.js`.
3. Save reusable/adapted companion build scripts under `build-scripts/content/book-1/`.
4. Run `scripts/deploy.js` against Book 1.
5. Pass `validate-paragraph.js --mode complete` for the MVP paragraph before scaling.

## Historical Failures Resolved In Sprint 0.5

Previously, `check:book` failed on chapters 1.2-1.5 because of missing QC artifacts and real review blockers. Sprint 0.5 resolved these:

- Added missing `_chapter-plan.md` for chapters 1.2 and 1.3.
- Added 17 missing review files.
- Added 17 missing quality-ref files.
- Fixed the remaining student-facing blockers in:
  - `1.2.3 Van individuele naar collectieve vraag`
  - `1.3.1 Aanbod`
  - `1.5.1 Actieve samenvatting`
  - `1.5.3 Integratieoefening`
  - `1.5.4 Proeftoets`
- Rebuilt affected paragraph and chapter outputs.

## Noise That Should Not Distract The Team

- The npm update notice is irrelevant to the Green Gate.
- `validate-chapter.js` fixture output appears in the Jest console, including deliberately bad fixture names and missing files. That output is not a current blocking failure; the full Jest suite passes.
- Module 3 deployment should not be used as the direction for Green Gate work. The gate is about making `4veco-platform` trustworthy for `../4veco-lessen`.
