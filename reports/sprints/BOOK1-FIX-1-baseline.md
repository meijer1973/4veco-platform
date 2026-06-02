# Sprint BOOK1-FIX-1: Baseline

Generated: 2026-06-02

Status: baseline before implementation.

## Plan reference

Plan: `reports/sprints/BOOK1-FIX-1-plan.md`

Plan JSON: `references/data/sprints/BOOK1-FIX-1.plan.json`

## Baseline Summary

Book 1 currently needs a focused generated-output correction and validator
hardening pass.

The user-reported Figure 2/Figure 3 issue is reproducible as an aggregate
asset mismatch:

- paragraph-level `1.1.3_fig_2.svg` is the economics-versus-mathematics axis
  convention figure;
- paragraph-level `1.1.3_fig_3.svg` is the interpolation figure;
- chapter-level and book-level aggregate `_assets` copies can remain stale or
  swapped because existing collection logic does not overwrite destination
  files that already exist.

The print validators currently check figure numbering, asset existence, and
basic print scope. They do not prove that the referenced SVG visible text
matches the surrounding caption or that aggregate assets match paragraph-source
assets.

## Baseline Gaps

- Book 1 TOC rows do not yet expose a page-number column backed by PDF target
  links.
- `build-scripts/books/lib_book.py` skips existing aggregate asset copies, so a
  stale asset can survive regeneration.
- `scripts/validate-chapter.js` does not compare chapter aggregate assets with
  paragraph-source assets.
- `scripts/check-book-print-scope.js` does not check semantic concordance
  between figure captions/alt text and referenced SVG visible text.
- Platform policy still has scattered language that can let the post-start
  exercise block be described as enrichment rather than `Zelfstandige
  oefening`.
- `1.1.3` does not clearly explain why the mathematical independent-variable
  convention differs from the economics `P` vertical / `Q` horizontal
  convention.
- Review/testing guidance does not explicitly state that a figure-caption or
  source-output mismatch is a revision-triggering learning-quality failure.

## Data integrity notes

The sprint must not mutate:

- `references/machine/`
- `references/external/`
- target-exercise registry records
- source exit-ticket data
- candidate-storage files
- PV projection or PV machine-promotion outputs

Generated Book 1 lesson output may change only through the platform workflow.

## Planned Evidence

Closure requires:

- focused tests for TOC page-number structure, chapter asset parity, and book
  figure-caption concordance;
- regenerated Book 1 paragraph/chapter/book output;
- validators proving the corrected output;
- active policy/spec updates;
- result, diff summary, result JSON, and structural lead-review records.
