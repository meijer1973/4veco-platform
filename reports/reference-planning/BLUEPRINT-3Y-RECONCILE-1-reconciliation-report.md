# BLUEPRINT-3Y-RECONCILE-1 Reconciliation Report

Status: non-mutating reconciliation report

## Scope

This report reconciles the active v5 blueprint, the superseded v4 blueprint, and the older three-year concept into an 11-book three-year draft. It creates no machine-reference mutation, target-exercise mutation, or lesson output.

## Evidence Read

Primary local evidence:

- `4veco-platform/RESEARCH_AGENT_MAP.md`
- `4veco-lessen/RESEARCH_AGENT_MAP.md`
- `4veco-platform/RESEARCH_AGENT_MAP_REFERENCES.md`
- `4veco-platform/AGENTS.md`
- `4veco-platform/CLAUDE.md`
- `4veco-platform/references/owned/README.md`
- `4veco-platform/references/owned/course-blueprint-v4.md`
- `4veco-platform/references/owned/course-blueprint-v4.meta.json`
- `4veco-platform/references/owned/course-blueprint-v5.md`
- `4veco-platform/references/owned/course-blueprint-v5.meta.json`
- `4veco-platform/knowledge/three Year blue print.md`
- `4veco-lessen/specifications/product-vision.md`
- `4veco-lessen/specifications/product-end-state.md`
- `4veco-platform/references/reference-team-roadmap.md`
- `4veco-platform/build-scripts/references/README.md`
- `4veco-platform/reports/reference-planning/REF-CT0-source-authority-boundary.md`
- `4veco-platform/reports/reference-planning/REF-CT0-three-year-prototype.md`
- `4veco-platform/reports/reference-planning/REF-CT0-mtu-classification.md`
- `4veco-platform/reports/reference-planning/CP.6c-mtu-backfill-classification.md`

## Verified Findings

### v4 assumptions

- Verified from source: `course-blueprint-v4.meta.json` labels v4 as `partial_year_1_of_3`.
- Verified from source: v4 uses a four-book model with Chapter 5 test-preparation sections in each book.
- Interpretation: v4 is valuable for migration traceability and older target-exercise logic, but it is not the final three-year course blueprint.

### v5 assumptions

- Verified from source: `course-blueprint-v5.md` is the active 2026/27 curriculum-source document for the four-book model.
- Verified from source: v5 maps one formal test week to one book.
- Verified from source: v5 has 54 count-bearing records across Books 1-4 with 12 / 12 / 14 / 16 paragraph counts.
- Verified from source: v5 replaces printed test-preparation chapters with web-only test-preparation packages.
- Verified from source: v5 parks inflation/CPI and late macro content outside the v5 count-bearing print scope.

### Three-year concept assumptions

- Verified from source: `knowledge/three Year blue print.md` recommends stabilising Year 1, backfilling foundations, and extending into Years 2-3 through registry and CLI workflow.
- Verified from source: the same concept proposes a larger 13-book shape with a separate final exam-training book.
- Verified from current planning reports: `REF-CT0-source-authority-boundary.md` treats the concept as rough scaffolding only and records known drift against current v5 and current registry state.

### Product and roadmap assumptions

- Verified from source: `product-vision.md` defines 4veco as an exercise-first route to exam-capable performance.
- Verified from source: `product-end-state.md` requires exam-target paragraphs to trace prompt, source annexes, figures/tables/graphs, correction model, point allocation, answer-construction requirements, concepts, operations, MTUs, practice route, exit ticket, answer model, and review gates.
- Verified from source: `reference-team-roadmap.md` defines exam ingestion as prompt + source material + figures/tables/graphs + official correction model + point allocation + answer requirements, followed by MTU and operation decomposition.
- Verified from source: `build-scripts/references/README.md` states the reference CLI exists and that protected machine references must not be hand-edited.

## Conflicts

| Conflict | Evidence | Resolution |
|---|---|---|
| v4 printed test-prep chapters vs v5 web-only test prep | v4 blueprint; v5 core decisions | Preserve v5 policy. Book 11 may be exam-training-heavy, but Books 1-10 do not regain printed test-prep chapters by default. |
| v4 partial Year 1 vs final three-year need | v4 meta | Treat v4 as historical owned evidence only. |
| v5 active but only four books | v5 blueprint and meta | Embed v5 as Year 1 / Books 1-4 inside the draft v6 umbrella. |
| Older concept 13 books vs intended 11 books | `knowledge/three Year blue print.md` | Compress Year 2 to Books 5-8 and Year 3 to Books 9-11. |
| Older A45+ proposed-label framing vs current registry facts | `REF-CT0-source-authority-boundary.md`, `CP.6c-mtu-backfill-classification.md` | Keep the Year 1 foundation repair lane, but describe it as review/mapping/closure against live MTUs, not automatic minting. |
| Syllabus/content sequence vs exam-operation route | product specs and roadmap | Make the v6 central table an exam-operation spine rather than only a content list. |

## Proposed 11-Book Resolution

| Year | Books | Resolution |
|---|---|---|
| Year 1 | Books 1-4 | Preserve active v5: micro foundations, demand/supply, costs/revenue/elasticity/surplus, intervention, market structures, market failure, labour, trade basics. |
| Year 2 | Books 5-8 | Place time/pensions, finance/interest/housing, risk/insurance/information, game theory/public goods/redistribution/growth/public-finance bridge. |
| Year 3 | Books 9-11 | Place Keynesian/fiscal macro, monetary/open-economy macro, integrated policy and final exam training. |

The older Book 9 bridge is folded into Book 8 and Book 9. The older Book 12 advanced integration and Book 13 final exam training are folded into Book 11.

## Current-State Adjustment To Year 1 Backfill

The older concept's "first curation set" remains directionally useful but is stale in detail. Current reports show several listed items are already live registry records or existing-unit mappings:

- A45, A46, A47, A48, A49, and A51 are live existing-unit mappings in `CP.6c-mtu-backfill-classification.md`.
- A50, A57, D40, and D41 are live machine-registry ids, but their current names and roles do not match the older concept exactly.
- D04 has already been retired by later CLI-only work according to the roadmap and `REF-CT0-source-authority-boundary.md`.

Therefore, the next Year 1 action is not "mint A45/A46/etc." It is to close foundation repair through reviewed target-exercise mapping, placeholder replacement, graph-heavy evidence, and any later CLI-backed mutations that are specifically authorized.

## Deliverables Created

- `references/owned/course-blueprint-v6-three-year.md`
- `references/owned/course-blueprint-v6-three-year.meta.json`
- `reports/reference-planning/BLUEPRINT-3Y-RECONCILE-1-book-level-matrix.md`
- `reports/reference-planning/BLUEPRINT-3Y-RECONCILE-1-quality-log.md`

## Stop Boundary

No protected reference data changed. This report does not authorize mutation, target-exercise promotion, placeholder finalization, lesson-output generation, diagnostics, adaptive routing, mastery decisions, automatic sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or Scale Gate authority.
