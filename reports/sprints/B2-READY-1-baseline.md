# Sprint B2-READY-1: Baseline

## Plan reference

Plan: `reports/sprints/B2-READY-1-plan.md`

## Source state

Book 2 is the active v5 home for costs, revenue, break-even, marginal concepts, elasticity, and surplus. The blueprint states that Book 2 absorbs the production material removed from Book 1 print and preserves prerequisite order before later government-intervention and market-structure books.

Chapter 2.1 contains:

| Section | Title | Current target status | Baseline implication |
|---|---|---|---|
| 2.1.1 | Kostenstructuren | `migrated_from_v4_needs_v5_review` | Usable as draft source evidence, not final reviewed target evidence. |
| 2.1.2 | Opbrengsten, winst en break-even | `migrated_from_v4_needs_v5_review` | Usable as draft source evidence, not final reviewed target evidence. |
| 2.1.3 | Marginale kosten en marginale opbrengsten | `migrated_from_v4_needs_v5_review` | Usable as draft source evidence, not final reviewed target evidence. |
| 2.1.4 | Gemengde opgaven: kosten en opbrengsten | `placeholder_needs_review` | Blocks final production closure unless replaced or explicitly carried as a named target gap. |

## Production baseline

Printed paragraph output must follow the paragraph and chapter build contracts:

- Part A paragraphs require `paragraaf.md`, `opgaven.md`, and `antwoorden.md`.
- Gemengde-opgaven sections do not require a theory `paragraaf.md`, but do require exercises, answers, generated PDFs, and review evidence.
- Figure work must keep SVG/PNG pairs, referenced assets, captions, and rendered output aligned.
- A chapter is not complete until paragraph validators, chapter validation, generated output, and review evidence all support the student-facing result.

## Product-boundary baseline

Book 2 production is a printed-textbook lane. Companion/product proof may continue separately but does not authorize diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative use, product-wide use, or broad companion scaling.

## Data integrity notes

No protected reference data changes are authorized. The sprint must not mutate `references/machine/`, `references/external/`, target-exercise source records, external-source records, generated lesson output, or `../4veco-lessen/`.
