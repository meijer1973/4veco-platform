# Book 1 Textbook Renewal: Rendered-Page Closure

Date: 2026-08-25
Bundle: `BOOK1-TEXTBOOK-RENEWAL-20260825`

## Authority and scope

- Product end state: `../4veco-lessen/specifications/product-end-state.md` and the textbook publisher-print lane.
- Governing visual standard: `references/authored/textbook-rendered-page-acceptance-standard.md`.
- Original gate: the 2026-08-25 human request-changes review for platform PR #208 and lesson PR #43.
- Proof manifest: `reports/rendered-proof/BOOK1-TEXTBOOK-RENEWAL-20260825/manifest.json`.
- Student-facing surfaces: §1.1.2 paragraph, Chapter 1.1 publisher print, and the complete Book 1 publisher print.

## Non-negotiable requirements

- Use final repository-generated PDF and HTML artifacts.
- Inspect every final PDF page as a full-page 144-dpi PNG at normal reading scale.
- Persist all page renders and whole-artifact contact sheets.
- Keep Opgave 5 with its Denkertje label and all subquestions on one page wherever it fits.
- Explicitly dispose clipping, overlap, figure-label legibility, table overflow, missing images, blank pages, broken glyphs, stale generated output, and answer-model readability.

## Rendered proof inspected

- §1.1.2: all 9 full-page renders and `paragraph-1.1.2-contact-sheet.png`.
- Chapter 1.1: all 32 full-page renders and `chapter-1.1-contact-sheet.png`.
- Book 1: all 136 full-page renders and four contact sheets spanning pages 1-34, 35-68, 69-102, and 103-136.
- Book 1 named full-page checks: cover (1), contents (4), §1.1.2 start (15), figure pages (16, 18, 19, 21), Opgave 5 (23), next-section transition (24), and final formula overview (136).

The source-level figure guard is intentionally conservative. Figures 1.1.2_2 and 1.1.2_3 use source SVG text below 30 pt, so their final paragraph, chapter, and book pages were explicitly inspected at normal page scale. All labels, values, captions, fraction notation, and source notes are readable in the final pages.

## Core-requirement checklist

| Requirement | Result | Proof |
|---|---|---|
| Every page opens and renders | PASS | 177/177 expected full-page PNGs are present |
| No clipped or overlapping text | PASS | All page renders inspected; zero visible defects |
| No broken glyphs or encoding boxes | PASS | All paragraph, chapter, and book renders |
| No missing or broken images | PASS | Figures render on paragraph pages 2, 4, 5, and 7 and corresponding chapter/book pages |
| Figure labels readable at normal scale | PASS | Explicit inspection of all four §1.1.2 figure pages |
| Tables and formulas stay within margins | PASS | All pages inspected; long §1.1.2 formula wraps without clipping |
| Page breaks keep headings with content | PASS | All section transitions inspected; no title-only defect |
| Exercises stay together where they fit | PASS | Exercise wrappers across the complete book; no visible avoidable split |
| Opgave 5 remains intact | PASS | Paragraph p.9, chapter p.19, book p.23 |
| Answer-model readability | PASS | §1.1.2 answer PDF was independently inspected; no changed answer-model defect |
| Generated output current | PASS | PDF/HTML SHA-256 values are bound in the manifest; clean rebuild was hash-stable |

## Defect disposition

- Clipping: none observed.
- Overlap: none observed.
- Unreadable labels or captions: none observed.
- Table overflow: none observed.
- Missing images: none observed.
- Unintended blank pages: none observed. Short Denkertje/answer pages are intentional content pages.
- Broken glyphs: none observed.
- Stale generated output: none observed; paragraph, chapter, and book rebuild hashes were stable.
- Answer-model readability: no defect observed in the independently reviewed §1.1.2 answer packet.

Known warnings: none for rendered output. The independent Part A didactic flags remain non-rendering future improvements and do not affect page acceptance.

## Validation and classified findings

- Direct builder regressions: PASS (7 Python tests).
- Book/lane regressions: PASS (3 Jest suites, 31 tests).
- Part A validator: PASS.
- Reproducibility: PASS for the 38 generated paragraph/chapter/book artifacts.
- Finding classification: zero open `core_spec_failure`; zero open rendered-output defect; no carried rendered warning.
- Target-trace evidence: not applicable; this repair does not create or promote target records.

## Boundary

This record closes only final rendered-page readability, layout, figure legibility, and exercise-pagination proof for the Book 1 renewal bundle. It does not authorize merge, payload acceptance, diagnostics, adaptive routing, mastery, sequencing, PV promotion, Scale Gate 1, or student/product use.
