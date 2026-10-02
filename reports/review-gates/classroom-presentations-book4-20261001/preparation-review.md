# Book 4 preparation independent review

Result: **PASS — no actionable findings in the reviewed change.**

Reviewed on 2026-10-01 by the independent preparation reviewer. Scope was the working diff in the three files below, with read-only inspection of their dependencies, governing instructions and current lesson sources. No repository files were edited; no authors, publication or merge were started. This is a preparation-code/documentation review, not artifact acceptance or merge authority.

## Reviewed state

- Platform: `C:\wt\ppt\4veco-platform`, branch `codex/ppt-book4-20261001`, HEAD `d81db9558cc24d0671da1b2b9ecc5cdf1a092dde`.
- Lessons: `C:\wt\ppt\4veco-lessen`, HEAD `e734532a42b27732ac25ce990fc9448b12309d28`.
- Read both `AGENTS.md` files and platform `docs/review/maintenance-workflow.md`.
- The identities below are SHA-256 of exact working-file bytes (not LF-normalized). Rechecked after the focused probes; all three were unchanged.

| Reviewed file (platform-relative) | SHA-256 |
| --- | --- |
| `build-scripts/maintenance/check-classroom-edition.js` | `53edb0996901a57c27f43885350c48aa5de74de5471e6cb804f12b31155b8f2c` |
| `build-scripts/maintenance/check-classroom-edition.test.js` | `a6350cce4d9acb0c09d74694d348d9778b546fadec92d399a4c3d1d93fe7a0ce` |
| `docs/workflows/classroom-presentation.md` | `fd9bfa13e4ecfdb2b0d82fb7edee5cf9aeaceb352e25e14ae82325833c2a63c5` |

Lesson receipt consulted: `book2-notation-revision.json`, exact-byte SHA-256 `f839772d9edab8ad1f6468292ab7eab0661effa12520b721599b32e37efd9624`.

## Review conclusions

- The only validator behavior change is inside `isClassroomAddition`: Book 4 joins Book 3 for the existing v3 paragraph-PDF layout. The explicit book-to-chapter and chapter-to-paragraph guards require matching identifiers, and the exact sibling `N.M.K-leerling-v3.pdf` must already belong to the sealed receipt.
- Only the named PPTX, matching presentation PDF and paragraph evidence Markdown patterns are admitted. Already sealed files remain in the sealed checks. Other books, unsupported chapters, mismatched identifiers and missing sealed student exports are rejected.
- All source code outside the addition predicate is identical to HEAD after line-ending normalization. Receipt signatures, predecessor checks, baseline blobs, source/contract checks, historical-failure handling and staged-byte validation are preserved. The Book 2 branch is unchanged, and Book 3 candidate behavior matches the prior implementation.
- The added tests cover Book 4 admission, wrong book/chapter/paragraph, a crossed book with an otherwise matching sealed source, unsupported chapter, sealed companion non-exemption, and changed/repinned/missing student PDFs. Existing historical and Book 2/3 tests remain in place.
- The documentation points to actual current Book 4 v3 sources. All 17 sealed paragraphs (`4.1.1`–`4.1.5`, `4.2.1`–`4.2.7`, `4.3.1`–`4.3.5`) have the documented manuscript, chapter answers, teacher guidance, asset directory and complete-book student PDF. The destination paragraph-PDF folders and sealed student exports match the rule.

## Validation evidence

- Inspected `C:\wt\ppt\.book4\preparation-tests.log`: the existing run finished successfully, with **3 suites / 71 tests passed** (`check-classroom-edition`, `check-classroom-notation`, `book2-notation-revision`). This reviewer did not redundantly rerun that Jest command.
- Independently ran the actual paired checkout command `node build-scripts/maintenance/check-classroom-edition.js --require-tracked`: **PASS**, 1,561 sealed files, no failures, and the 42 existing Book 3 companion additions preserved.
- Independently ran `git diff --check` and Node syntax checks for both JavaScript files: **PASS**.
- Independently probed all 17 actual sealed Book 4 paragraphs: all 51 allowed PPTX/PDF/evidence candidates accepted, missing-source and already-sealed variants rejected.
- Exhaustively probed book-folder/chapter-book/chapter-number/paragraph-book/paragraph-chapter combinations over books 1, 2, 3, 4, 5 and 34 and chapter numbers 0 through 4. Matching supported Books 3/4 combinations alone were accepted. Together with missing-source and sealed-companion variants this produced **7,284 rejected negative probes**.
- Completed 7,603 checks consisting of non-Book-4 comparisons with the prior predicate and sealed-file non-exemption checks, plus comparisons for 36 actual Book 2 companion candidate paths: **no regression**. Existing Book 2 companions are sealed in the current receipt and correctly remain non-exempt.

No broadening beyond the intended Book 4 companion scope, source-path inaccuracy or preservation regression was found. Hosted CI was not run for this bounded preparation checkpoint; the coordinator owns the full paired CI after the completed batch.
