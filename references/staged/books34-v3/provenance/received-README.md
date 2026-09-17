# Books 3 and 4 — v3 complete local edition

The adopted revision is complete as an editable local delivery for repository integration and review. This is **not** the earlier recovered working package. The current documents implement the 14/17 layout, derivative/optimisation split, long-run transfer and labour-policy deferral.

| Book | Student book | Answers | Teacher guide |
|---|---|---|---|
| 3 | [132 pages](books/book-3/output/Boek_3_Compleet_v3.pdf) | [74 pages](books/book-3/output/Boek_3_Compleet_Antwoorden_v3.pdf) | [22 pages](books/book-3/output/Boek_3_Compleet_Docenteninformatie_v3.pdf) |
| 4 | [166 pages](books/book-4/output/Boek_4_Compleet_v3.pdf) | [68 pages](books/book-4/output/Boek_4_Compleet_Antwoorden_v3.pdf) | [28 pages](books/book-4/output/Boek_4_Compleet_Docenteninformatie_v3.pdf) |

## Scope and delivery

Book 3 chapters contain 48/34/38 student pages; Book 4 chapters contain 48/60/44. All 31 current paragraphs have editable manuscripts, local assets, chapter PDFs and paragraph PDF excerpts. Answers cover all **734 subquestions across 276 exercises**. The target module contains **31 actual exercises with 156 subquestions**, not empty structure placeholders.

Read [HANDOFF.md](HANDOFF.md) before integrating. Verify the unmodified delivery with `python verify_manifest.py`. The [completed revision review](checks/REVISION_REVIEW.md) states the performed checks and boundaries. [The migration note](outlines/book34-v3-decision-and-migration.md) and [CSV](outlines/paragraph-migration-v2-to-v3.csv) explain every old/new ID. The actual [page map](curriculum/book-page-map-v3.json), [lesson routes](curriculum/lesson-routes-v3.json) and [target catalogue](curriculum/target-catalog-v3.csv) are included.

## What is current and what is historical

- `books/`: current v3 editable chapters, figures, book matter and final PDFs.
- `outlines/`: adopted v3 layout and intended goals, linked to actual target candidates.
- `curriculum/`: the current local projection and version-qualified target payloads.
- `build/`: portable source-to-PDF assembly, extraction and verification. Run `python build/build_all.py`.
- `checks/`: author-side numerical, content, navigation, build and visual evidence, with explicit limits.
- `historical-inputs/`: original complete student books, selected prior source/guide material, earlier outline proposal and the deferred policy paragraph. These are not current teaching instructions.

The original covers are preserved; their miniature graphics are not the teaching or marking reference. Use chapter diagrams.

## Review boundaries

The owner's placement decision has been implemented. Independent target approval is **not fabricated**: records are candidate_review_ready. The five existing workload issues at 3.1.2, 3.1.3, 3.1.5, 4.2.4 and 4.2.5 remain visibly open. The scoped revision is complete without pretending it solved all course-wide timing issues. Other timing entries are design estimates, not measured classroom performance.

Book 1 and Book 2 are unchanged. No live repository, PR, merge or publication state was changed by this delivery. Retain previous edition identities when integrating.

## Current outline reading copies

[Book 3 v3 outline](outlines/Boek_3_Boekopzet_v3.pdf) · [Book 4 v3 outline](outlines/Boek_4_Boekopzet_v3.pdf) · [Adopted decision and migration](outlines/Boek_3_4_Besluit_en_migratie_v3.pdf). Editable Markdown versions sit beside these PDFs.
