# Book 1 Textbook Renewal Plan

Date: 2026-08-25
Bundle ID: `BOOK1-TEXTBOOK-RENEWAL-20260825`
Controller PR: `meijer1973/4veco-platform#208`
Lesson PR: `meijer1973/4veco-lessen#43`

## Goal

Renew the existing coordinated Book 1 pull requests against current `main`,
preserve the accepted content and TOC-anchor changes, and close every blocker
from the 2026-08-25 human review without merging either PR.

## Quality floor

- Book HTML/PDF generation is deterministic across the recorded supported
  Pandoc 3.x and pinned WeasyPrint toolchain.
- Cover rendering, HTML-image embedding, block anchors, and Pandoc stylesheet
  removal have direct automated regression coverage.
- Each exercise stays together when it fits on one page; Opgave 5 must render
  intact in both the paragraph and complete-book PDFs.
- `1.1.2-review.md` and the `partA:` quality record truthfully describe the
  inline exercise topology and bind the rendered review to the refreshed PDFs.
- Bundle evidence binds one shared bundle ID to exact current platform and
  lesson heads and proves `platform-first`, `lesson-first`, and `bundle-final`.
- Both PRs remain draft until exact-head CI, lead review, readiness routing,
  and coordinated `MARK_READY` are green. No merge or payload authorization is
  in scope.

## Specification and evidence matrix

| Requirement | Implementation evidence | Review/proof |
|---|---|---|
| Merge current main into both branches | Conflict-free merge commits with current `origin/main` as ancestor | Freshness and ancestry checks |
| Version-independent Pandoc CSS handling | Head-scoped removal of all Pandoc-emitted style blocks before project CSS injection | Unit fixtures for commented and uncommented Pandoc styles |
| Recorded build toolchain | Book-builder toolchain record and README instructions | Build log with observed Pandoc, Python, and WeasyPrint versions |
| New book-rendering behavior covered | Direct tests for cover HTML, Markdown/HTML image embedding, block anchors, and stylesheet removal | Focused Python/Jest test run plus full platform suite |
| Exercise pagination repaired | Generator-owned CSS in paragraph, chapter, and book builders | Rendered-page inspection of Opgave 5 in paragraph and book PDFs |
| Review evidence current | Refreshed Part A review and quality-ref `partA:` block | Independent paragraph reviewer and independent quality-record reviewer |
| Reproducible generated lesson outputs | Clean rebuild of paragraph, Chapter 1.1, and full Book 1 | Source/output diff audit, page count, print-scope and paragraph/chapter/book validators |
| Current cross-repo bundle proof | Exact-member metadata and three-state workflow summary | Green `bundle-final` plus at least one green intermediate state |
| Review lifecycle complete | Exact-head lead review, CI, PR readiness, coordinated apply | Both PRs transitioned only by `apply:bundle-readiness` |

## Execution

1. Merge current `origin/main` into both published branches without rebasing or
   force-pushing.
2. Repair the platform book builder, add direct regression tests, and document
   the supported toolchain.
3. Update paragraph/chapter/book pagination rules in generator-owned sources.
4. Regenerate the paragraph, Chapter 1.1, and complete book; normalize only
   generated text line endings required by repository policy.
5. Run independent Part A and quality-record review, then commit the refreshed
   lesson evidence.
6. Run focused/full validation and visual PDF review. Stop on any split fitting
   exercise, stylesheet leakage, missing asset, broken TOC target, or material
   source/output mismatch.
7. Commit and push both existing PR branches, obtain exact-head platform CI,
   create exact-member bundle evidence, and dispatch the three-state bundle
   compatibility workflow.
8. Complete exact-head structural lead review and readiness routing. Apply a
   coordinated `MARK_READY` only when the controller decision permits it.
9. Return both ready PRs for one consolidated human review. Do not merge and do
   not create authorization comments.

## Stop conditions

Stop and keep both PRs draft if any of the following remains true:

- current `main` is not an ancestor of either head;
- deterministic rebuild changes unrelated lesson artifacts;
- Opgave 5 still splits while it fits on one page;
- a Part A review or quality record is stale or fails;
- exact-member bundle provenance is missing or any required state is not green;
- platform exact-head `validate-platform`, lead review, or readiness fails;
- readiness does not explicitly allow coordinated `MARK_READY`.

## Explicitly out of scope

- Merging either PR.
- Creating or inferring human payload/bundle authorization.
- Repairing the pre-existing Chapter 1.4 aggregate omissions.
- Changing companion/student-web outputs or the `companion:` quality block.
