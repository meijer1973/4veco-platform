# Sprint BOOK1-FIX-1: Diff Summary

Generated: 2026-06-02

## Summary

The diff fixes Book 1 print output, policy wording, and validation coverage for
the reported table-of-contents, exercise-label, and figure-text mismatch
issues.

## Platform workflow changes

- `build-scripts/books/lib_book.py` now adds TOC anchors/page-number cells and
  refreshes only referenced book aggregate assets.
- `scripts/validate-chapter.js` now compares referenced chapter aggregate assets
  against paragraph source assets.
- `scripts/check-book-print-scope.js` now checks TOC page-number structure and
  figure-caption/visible-graphic concordance.
- Focused Jest coverage was added for the new book print-scope and chapter
  aggregate-asset failure modes.

## Lesson output changes

- Book 1 generated markdown, HTML, and PDF were regenerated.
- Chapter 1.1 generated markdown, HTML, PDF, answer output, and referenced
  aggregate assets were regenerated.
- Paragraph 1.1.1, 1.1.2, and 1.1.3 generated outputs were regenerated where
  the exercise label or graph explanation changed.
- `1.1.3` Figure 2 and Figure 3 aggregate copies now match the paragraph source
  assets.

## Policy and review changes

- The standard post-start exercise label is now `Zelfstandige oefening`.
- The policy/guidance files make clear that `Verdieping` is not the label for
  the normal independent exercise block.
- Student-experience, testing, graph-skill, paragraph-build, and chapter-build
  guidance now call rendered figure-caption/source-output mismatch a revision
  issue.

## Protected surfaces

No protected reference data changed. `references/machine/` and
`references/external/` remain untouched.

No target-exercise registry, source exit-ticket data, candidate storage, PV
artifact, or machine-owned reference surface changed.

## Product-boundary notes

The sprint authorizes only the Book 1 print/output fixes, policy wording, and
validation hardening described in the plan. It does not authorize diagnostics,
adaptive routing, mastery, sequencing, summative use, student-facing AI, PV,
Scale Gate 1, target-exercise-readiness claims, or broad product authority.
