# Books 2–4 exercise-route revision

The owner explicitly changed the Part A pedagogical contract on 21 September 2026. Guided practice is normal learning; a challenging route with fewer intermediate steps includes the bonus and leads to the same target. Repetition is additional. The canonical definition is `skills/econ-exercise-builder.md` §2.1; active writing, review, planning and selected-outline guidance refer to it.

## Scope and preserved inputs

Platform baseline: `6298466b03fa5ddb38a72ceb157a4855494e45d8` (PR #253 merged). Lesson baseline: `e2843b47c828784ab594d004cef461cea929717f` (PR #55 merged). Lesson revision: `b946cf04b128a374301e1998653f45583ec97057`, PR #56. Dedicated paired worktrees under `C:/wt/book 2/exercise-routes-20260921/`, both branch `codex/exercise-routes-20260921`, owner `codex-root`.

All 43 paragraphs, 390 exercises, answers, numbers, goals, 726 reused answer/figure files and 31 target payloads are preserved. Book 1, prior v2 editions, historical receipts/reviews and the Part B companion route are unchanged. Book 2’s repaired economic cover geometry and overview links remain intact.

## Current build and checks

Use `build-scripts/books/EXERCISE-ROUTES.md` and the pinned combined requirements. The platform controller rebuilds the owned manuscripts and generated exports through reviewed current templates. Current evidence is separate from historical byte checks. The closed lesson manifest contains 1,291 files and SHA256 `c96c8635607855a31a23920c9dd6aadfe764ba3c325545ea93d547b8cd43abe5`.

- Final Python preservation/assembly verifier: PASS; 43 source paragraphs, 390 exercise blocks, 31 target payloads, 632 inserted chapter body pages. Books 3/4 retain all 598 edition checks, 734 questions and 734 answers, 0 failures.
- All 9 student chapters keep their designed page counts with 0 overflow. Complete student/answer/teacher volumes: Book 2 110/57/19; Book 3 132/74/22; Book 4 166/68/28.
- Contents links and chapter/book references checked. Book 2 retains 105 chapter link annotations and overview destinations 72/109.
- Full Jest run initially had 2,073 passes and 2 failures: an isolated fixture omitted the newly required pin file, and a historical-tool rule incorrectly included generated paragraph wrappers. Both were fixed and their suites passed on rerun (5 paired-CI cases and 14 selected-structure cases). Additional amendment, contract, closed-inventory, lane and currentness tests passed. The PR’s required CI supplies the final complete-suite result.
- Four Book 2 Python test methods pass, including 7 revision-input rejection cases. Governance freshness, worktree ownership, Part A lane scope and diff hygiene pass.
- 251 complete-PDF pages (changed text plus neighbours/front matter) were rendered with Poppler for review. The independent review additionally checks standalone exports and records its own coverage in the adjacent per-paragraph reports.

## Limits and review scope

All 34 theory paragraphs need a complete supported-route timing estimate; old totals omitted guided practice and sometimes selected only part of independent work. No exercise was deleted or target weakened to fit 55 minutes. Detailed lower bounds/missing times are teacher-facing. Nine mixed paragraphs retain their existing sections, including extra practice without falsely naming it bonus or repetition. Both edition revision notes list every exception and timing concern.

PDF hashes may vary with checkout paths, fonts and PDF IDs. Current hashes bind these exact outputs. Body text and rendered pixels are verified separately; the existing Books 3/4 answer/teacher footer transform is included in their pixel comparison. Independent review is scoped to this route revision, with per-paragraph current inventories; it is not native paragraph closure, new target approval or classroom timing validation.
