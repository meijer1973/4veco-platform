# Sprint BOOK1-FIX-1: Book 1 TOC, Exercise Label, And Figure-Text Concordance Fix

Generated: 2026-06-02

## Goal

Repair Book 1 print and paragraph-output quality issues that affect the
student-facing product:

- add page-number support to the generated Book 1 table of contents;
- make `Zelfstandige oefening` the standard student-facing label for exercises
  after starting exercises, and record that as policy;
- repair the `1.1.3` Figure 2 / Figure 3 mismatch in assembled chapter/book
  output by fixing asset aggregation rather than hand-patching output;
- strengthen validation and review instructions so stale aggregate assets and
  figure-caption mismatches are caught before closure;
- improve the explanation of mathematical versus economic graph axes in
  `1.1.3`.

This sprint may update Book 1 generated output only through the platform
workflow. It does not authorize protected reference mutation, target-exercise
promotion, diagnostics, adaptive routing, mastery, sequencing, student-facing
AI, summative use, PV, Scale Gate 1, or product-wide use claims.

## Context

The user reported that Book 1 needs table-of-contents page numbers, that the
student-facing name after starting exercises should be `Zelfstandige oefening`
rather than `Verdieping`, and that Figures 2 and 3 on the page currently
rendered as page 22 do not match their captions/descriptions.

The figure issue is not only a content issue. Paragraph-level `1.1.3` assets
are correct, but chapter-level and book-level aggregate `_assets` copies can
remain stale because the current book asset collector skips destination files
that already exist. Existing print checks verify numbering and asset presence,
but they do not prove that the visible figure text matches the surrounding
caption and explanation.

The graph explanation in `1.1.3` also needs a clearer student-facing bridge:
in mathematics, an independent variable such as `x` in `y = ax + b` normally
goes on the horizontal axis. In a demand relation such as `q = ap + b`, price
`p` is the independent variable, so a mathematical graph would put price on
the horizontal axis and quantity on the vertical axis. Economics market
diagrams deliberately use the convention `P` vertical and `Q` horizontal, so
students need to know why the diagram breaks the pattern they learned.

## Quality Standard

The quality floor is specification fulfilment in the generated student-facing
book, not a source-only correction. The generated Book 1 rendered output must
show a table of contents with page-number structure, correct Figure 2/Figure 3
asset-caption concordance, clear `Zelfstandige oefening` naming, and a clearer
axis-convention explanation in paragraph `1.1.3`.

Passing tests alone is not sufficient. The sprint must produce proof from
source edits, generator behavior, rendered output checks, validator failures
for the old bug class, student-facing policy text, and follow-up flags for any
remaining review work.

Bounded implementation does not lower the quality bar inside the authorized
scope. If broader Book 1 typography, all-chapter exercise naming, or full
human visual review remains incomplete, those items must be recorded as
follow-up work or explicit blockers.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Book 1 TOC exposes page-number structure. | Book builder renders TOC rows with page-number cells and PDF-supported target links. | Focused book-print tests plus rendered PDF text/HTML inspection. | planned |
| Book/chapter aggregate figure assets match paragraph source assets. | Asset collection overwrites stale aggregate copies and validators compare referenced assets across paragraph, chapter, and book surfaces. | Focused chapter/book validator tests and regenerated asset diff proof. | planned |
| Figure captions and visible SVG text are semantically concordant. | Book print-scope checker compares figure alt/caption keywords with referenced SVG visible text. | Focused negative test for swapped Figure 2/Figure 3 assets. | planned |
| Post-start exercise naming is `Zelfstandige oefening`. | Platform authoring policy and lesson product specification state the label rule; active Book 1 output is checked for no core post-start `Verdieping` label. | Policy diff and text search proof. | planned |
| `1.1.3` graph-axis explanation teaches the math/economics difference. | Paragraph source explains `y = ax + b`, `q = ap + b`, independent variable placement, and economics P-Q convention. | Regenerated paragraph/chapter/book output and paragraph validation. | planned |
| Testing and review guidance catches the old failure mode. | Student-experience/testing/visual review instructions name figure-caption/source-output mismatch as a revision trigger. | Diff review plus active scope-language and sprint-bundle checks. | planned |
| Product boundaries stay intact. | No protected reference mutation, target-exercise promotion, diagnostics, mastery, sequencing, summative, PV, or Scale Gate claim is introduced. | Git diff review, scope-language check, and lead review. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Add deterministic asset overwrite in book assembly. | include_now | Directly fixes the stale aggregate-asset root cause. |
| Add semantic figure-caption validation for referenced SVGs. | include_now | Prevents a future build from passing with swapped or unrelated figure assets. |
| Add chapter-level asset parity validation. | include_now | Catches stale chapter aggregate assets before book assembly. |
| Redesign all Book 1 graph figures. | defer_named_follow_up | Useful later, but this sprint targets the concrete mismatch and axis explanation. |
| Rename every enrichment concept in all archives. | reject_scope_creep | Historical records should remain traceable; active policy and active output are the target. |
| Add full human visual review across the complete book. | defer_named_follow_up | The sprint adds validator/review-agent hardening and focused proof; full-book human review belongs to a later gate. |

## Allowed paths

Allowed platform paths:

- `build-scripts/books/lib_book.py`
- `scripts/check-book-print-scope.js`
- `scripts/validate-chapter.js`
- `scripts/tests/check-book-print-scope.test.js`
- `scripts/tests/validate-chapter.test.js`
- `BUILD-PARAGRAPH.md`
- `BUILD-CHAPTER.md`
- `skills/econ-exercise-builder.md`
- `skills/econ-textbook-paragraph.md`
- `skills/economic-graph.md`
- `references/authored/didactiek-principes.md`
- `references/authored/vraagtypen-en-opgaveontwerp.md`
- `agents/student-experience-review-agent.md`
- `agents/testing-agent.md`
- `agents/econ-companion-visual-review.md`
- `references/reference-team-roadmap.md`

Allowed lesson paths:

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`

Allowed sprint/proof/index paths:

- `reports/sprints/BOOK1-FIX-1-*`
- `references/data/sprints/BOOK1-FIX-1.plan.json`
- `references/data/sprints/BOOK1-FIX-1.result.json`
- `docs/roadmaps/roadmap-version-index.json`
- `reports/github-agent-index-*`
- `reports/url-index.md`

## Forbidden paths

Forbidden paths and surfaces:

- `references/machine/`
- `references/external/`
- target-exercise registry records
- source exit-ticket data
- candidate-storage files
- PV projection or PV machine-promotion outputs
- hand-patched generated output that bypasses the platform build workflow

## Inputs

- User-reported Book 1 TOC, exercise-label, figure, testing-pipeline, and
  graph-explanation issues.
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- Book 1 generated lesson output.
- Book/chapter/paragraph builders and validators.
- Existing review-agent guidance.

## Outputs

- Updated sprint plan, baseline, result, diff summary, and result JSON.
- Updated active roadmaps in both repositories.
- Book 1 generated output refreshed through the platform workflow.
- Updated platform builder/validator tests that fail on stale aggregate assets
  and mismatched figure-caption output.
- Updated authoring/review policy for `Zelfstandige oefening` and figure
  concordance.
- Updated `1.1.3` graph-axis explanation.
- Structural lead-review records before closure.

## Operationalized sprint procedure

1. Record baseline evidence for the Book 1 TOC, exercise-label policy, Figure
   2/Figure 3 asset mismatch, and graph-axis explanation gap.
2. Update platform book assembly so stale aggregate assets are overwritten and
   generated TOC rows include page-number structure.
3. Add focused validators/tests for chapter asset parity, book figure-caption
   concordance, and TOC page-number structure.
4. Update platform and lesson policy files so `Zelfstandige oefening` is the
   standard label after starting exercises and review agents treat
   figure-caption/source-output mismatch as a revision condition.
5. Update the paragraph `1.1.3` source explanation of mathematical versus
   economic graph axes.
6. Regenerate paragraph, chapter, and Book 1 output through the platform
   workflow. Stop if generation would require hand patching generated output.
7. Run focused Jest tests, paragraph/chapter/book validators, sprint checkers,
   scope-language check, roadmap/index checks, and diff checks.
8. Write result, diff summary, result JSON, and structural lead-review records.
   Stop before closure if any core product requirement remains unproven.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/BOOK1-FIX-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js BOOK1-FIX-1
npx.cmd jest --runInBand --runTestsByPath scripts/tests/check-book-print-scope.test.js scripts/tests/validate-chapter.test.js
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen"
node scripts/validate-chapter.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen"
node scripts/check-book.js --paragraph-mode part-a --paragraph-profile publisher-print "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node scripts/check-book-print-scope.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-scope-language.js --active
node build-scripts/sprints/check-sprint-result.js reports/sprints/BOOK1-FIX-1-result.md
node build-scripts/sprints/check-sprint-bundle.js BOOK1-FIX-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

To close this sprint, closure requires proof that:

- Book 1 TOC rows include page-number cells and PDF target links;
- regenerated Book 1 aggregate `1.1.3_fig_2` and `1.1.3_fig_3` assets match
  the paragraph-level Figure 2/Figure 3 assets;
- a negative test fails when a figure caption points to a semantically
  mismatched SVG;
- chapter validation fails when aggregate chapter assets differ from the
  paragraph source assets they reference;
- active Book 1 output and policy use `Zelfstandige oefening` for post-start
  exercises;
- `1.1.3` output explains why a mathematical demand graph could put price on
  the horizontal axis and why economics uses `P` vertical and `Q` horizontal;
- structural lead review records PASS or PASS WITH FLAGS with any remaining
  items named as follow-up work.

## Rollback plan

If the generated output or validation hardening introduces regressions, revert
only the files touched by `BOOK1-FIX-1` and restore Book 1 output through the
previous platform workflow state. Do not use destructive repository-wide reset
commands. If a platform generator cannot represent the requested TOC, label, or
asset behavior safely, stop and record a blocker instead of hand-patching
generated output.

## Human review required

No separate human interview is required for this implementation sprint unless
the lead review returns REVISE, FAIL, or PAUSE. Structural lead review is
required before sprint closure because this sprint changes student-facing Book
1 output, authoring policy, and validation behavior.
