# Sprint BOOK1-FIX-1: Result

Generated: 2026-06-02

Verdict: PASS WITH FLAGS.

## Plan reference

Plan: `reports/sprints/BOOK1-FIX-1-plan.md`

Baseline: `reports/sprints/BOOK1-FIX-1-baseline.md`

## Summary

`BOOK1-FIX-1` repaired the Book 1 print and learning-quality issues reported
for the active student-facing output.

Implemented:

- Book 1 table-of-contents rows now include target anchors and generated PDF
  page-number cells.
- The standard post-start exercise label is now `Zelfstandige oefening` in
  Book 1 paragraph/chapter/book output and in authoring policy.
- The `1.1.3` Figure 2/Figure 3 aggregate-asset mismatch was corrected by
  refreshing generated output through the platform workflow.
- Chapter and book aggregate asset collection now refreshes referenced assets
  from source and removes stale aggregate copies.
- Chapter validation now checks aggregate asset parity against paragraph source
  assets.
- Book print-scope validation now checks table-of-contents page-number
  structure and figure-caption/visible-SVG concordance.
- The `1.1.3` explanation now explicitly distinguishes the mathematical axis
  convention from the economics P-Q convention using `y = ax + b` and
  `q = ap + b`.
- Student-experience, testing, graph-skill, chapter-build, paragraph-build, and
  exercise-builder guidance now says figure-caption/source-output mismatch is a
  revision issue.

No protected reference data, target-exercise registry, source exit-ticket data,
candidate storage, diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, PV, Scale Gate 1, or product-wide authority
was changed or authorized.

## Acceptance test results

| Command | Status |
|---|---|
| `python build_chapter.py` in `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen` | passed |
| `python build-scripts/books/build-book.py --book 1` | passed |
| `npx.cmd jest --runInBand --runTestsByPath scripts/tests/check-book-print-scope.test.js scripts/tests/validate-chapter.test.js` | passed |
| `node scripts/validate-paragraph.js --mode part-a --profile publisher-print "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen"` | passed |
| `node scripts/validate-chapter.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen"` | passed |
| `node scripts/check-book.js --paragraph-mode part-a --paragraph-profile publisher-print "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node scripts/check-book-print-scope.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts/sprints/check-scope-language.js --active` | passed |
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/BOOK1-FIX-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js BOOK1-FIX-1` | passed |
| `python -m py_compile build-scripts/books/lib_book.py` | passed |
| `python -m py_compile "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/build_chapter.py"` | passed |
| `node --check scripts/check-book-print-scope.js` and `node --check scripts/validate-chapter.js` | passed |
| `rg -n "Verdiepende opgaven|\bVerdieping\b|\bverdieping\b" "Boek 1 - Grondslagen, vraag en aanbod" -g "*.md" -g "*.html"` | passed with no matches |
| `npm.cmd run agent:index` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `node build-scripts/sprints/emit-url-index.js` | passed |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/BOOK1-FIX-1-result.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js BOOK1-FIX-1 --complete` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `git diff --check` | passed with line-ending warnings only |
| `git -C ../4veco-lessen diff --check` | passed |

## Changed files

Platform workflow and validation:

- `build-scripts/books/lib_book.py`
- `scripts/check-book-print-scope.js`
- `scripts/validate-chapter.js`
- `scripts/tests/check-book-print-scope.test.js`
- `scripts/tests/validate-chapter.test.js`

Platform policy and review guidance:

- `BUILD-CHAPTER.md`
- `BUILD-PARAGRAPH.md`
- `agents/student-experience-review-agent.md`
- `agents/testing-agent.md`
- `skills/econ-exercise-builder.md`
- `skills/economic-graph.md`
- `references/authored/didactiek-principes.md`
- `references/authored/vraagtypen-en-opgaveontwerp.md`
- `references/reference-team-roadmap.md`

Lesson-side generated and policy output:

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- Book 1 generated book, chapter, paragraph, exercise, answer, and referenced
  aggregate asset outputs under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/build_chapter.py`

Sprint artifacts:

- `reports/sprints/BOOK1-FIX-1-plan.md`
- `reports/sprints/BOOK1-FIX-1-baseline.md`
- `reports/sprints/BOOK1-FIX-1-lead-review-assignment.md`
- `reports/sprints/BOOK1-FIX-1-lead-review-round1.md`
- `reports/sprints/BOOK1-FIX-1-lead-review-corrections.md`
- `reports/sprints/BOOK1-FIX-1-lead-review-round2.md`
- `reports/sprints/BOOK1-FIX-1-result.md`
- `reports/sprints/BOOK1-FIX-1-diff-summary.md`
- `references/data/sprints/BOOK1-FIX-1.plan.json`
- `references/data/sprints/BOOK1-FIX-1.result.json`

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` remain untouched.

No target-exercise registry, source exit-ticket data, candidate storage,
machine-owned reference data, PV output, or product-authority gate was changed.

Generated lesson output was refreshed only through the platform/chapter build
workflow.

## Lead Review State

Structural lead review completed:

- assignment: `reports/sprints/BOOK1-FIX-1-lead-review-assignment.md`
- round 1: PASS WITH FLAGS, recorded in
  `reports/sprints/BOOK1-FIX-1-lead-review-round1.md`
- correction log: no blocking corrections required, recorded in
  `reports/sprints/BOOK1-FIX-1-lead-review-corrections.md`
- round 2: PASS WITH FLAGS, recorded in
  `reports/sprints/BOOK1-FIX-1-lead-review-round2.md`

## Carried Flags

- The figure-caption concordance check is intentionally conservative. Future
  figure-heavy surfaces should still receive rendered human review, especially
  when the visual carries the concept.
- Book 1 aggregate asset parity is now checked for referenced assets. Paragraph
  folders may still contain unused alternate variants; those are warnings, not
  closure blockers.
- `Zelfstandige oefening` is now the policy label for standard post-start
  exercise blocks. Existing future-source generators should continue to use
  this label and reserve enrichment labels for genuinely optional stretch work.
- This sprint fixes Book 1 output and validation. It does not authorize any
  broader companion, target-exercise-readiness, diagnostic, mastery, sequencing,
  PV, or Scale Gate claim.

## Open follow-ups

- Apply the same TOC page-number and figure-concordance expectations to future
  book-output review checklists.
- Continue the exit-ticket readiness sequence after this sprint; the next
  planned path remains `L1.7B-Q2` or the platform task-type support needed for
  that work.

## Rollback instructions

Revert the `BOOK1-FIX-1` changes in platform workflow/guidance files and rerun
the platform Book 1 build to restore generated lesson output. No protected
reference data, target-exercise registry, source exit-ticket data, candidate
storage, or PV artifact needs rollback because none was changed.
