# Textbook Production Roadmap

Generated: 2026-06-11
Roadmap ID: `textbook-production-roadmap`
Roadmap version: `v1.2-chapter-2.1-scope`
Roadmap status: `active`
Version index: `docs/roadmaps/roadmap-version-index.json`
Folder: `docs/roadmaps/textbook/`
Sprint ledger: `docs/roadmaps/textbook/sprint-ledger.md`
End-state draft: `docs/roadmaps/textbook/textbook-end-state.md`
Scope: textbook improvement and writing work that prepares, builds, verifies, and reviews printed textbook output in `../4veco-lessen`, with planning evidence and sprint records in this repository. Human clarification on 2026-06-09 narrows the current integration assignment to Book 2 Chapter 2.1.x only.

## Operating Goal

Improve and write the textbook one paragraph at a time. For the current assignment, stop at Book 2 Chapter 2.1.x. The human quality finding after `B2-2.1-RETRO` changed the cadence to paragraph-sized hardening, and the four Chapter 2.1 paragraphs now have Book 1-level didactic structure, exercise route, rendered proof, validation evidence, and lead-review evidence.

## Book 2 Print Series

The current print-production series is limited to Book 2 Chapter 2.1.x. It starts with Book 2 because Book 1 print scope is already aligned and Book 2 now carries the costs, revenue, break-even, and marginal-concept material that was removed from Book 1 print. The series uses one paragraph per sprint so that each paragraph can teach the next one:

1. `B2-READY-1` - short readiness gate for Book 2 section 2.1.
2. `B2-2.1-A` - first Chapter 2.1 vertical slice, now treated as draft production evidence rather than the final quality bar.
3. `B2-2.1-RETRO` - retrospective and validation/layout repair after the initial vertical slice.
4. `B2-2.1.1-HARDEN` - rewrite 2.1.1 Kostenstructuren to the Book 1 paragraph model.
5. `B2-2.1.2-HARDEN` - rewrite 2.1.2 Opbrengsten, winst en break-even using lessons from 2.1.1.
6. `B2-2.1.3-HARDEN` - rewrite 2.1.3 Marginale kosten en marginale opbrengsten using lessons from 2.1.1 and 2.1.2.
7. `B2-2.1.4-HARDEN` - rebuild the 2.1.4 mixed-practice paragraph after the theory paragraphs are stable.
8. `B2-2.1-TARGET-V5-PROMOTE` - promote 2.1.1, 2.1.2, and 2.1.3 target records after the governed v5 target-quality review.
9. `MIXED-OPGAVEN-TARGET-STANDARD-1` - define the reusable mixed-exercise target standard and apply it to 2.1.4 before any reviewed-final mixed target claim.
10. Later Chapter 2.2 work is outside the current assignment.

Do not resume Chapter 2.2 production unless a later human instruction explicitly expands the assignment beyond Chapter 2.1.x.

## Work Lanes

| Lane | Priority | Scope | Blocking rule |
|---|---|---|---|
| Textbook production | High | Build and improve Book 2 Chapter 2.1.x one paragraph at a time, ending with 2.1.4. | Blocks when target exercise evidence, printed-output workflow, or student-facing quality floor is not sufficient for Chapter 2.1.x. |
| Blueprint hardening | Medium | Fix only blockers discovered during readiness or Chapter 2.1 production, such as non-final target records, notation contradictions, or graph-contract ambiguity. | Blocks production only when the issue directly affects Book 2 printed output or target-exercise faithfulness. |
| Product proof and companion layer | Medium | Continue separately as controlled-scope evidence. It may inform style or route planning, but it is not the driver for Book 2 Part A. | Does not block `B2-2.1-A` unless a later explicit gate says the printed textbook depends on it. |

## Sprint Ledger

Canonical ledger: `docs/roadmaps/textbook/sprint-ledger.md`

The currently active sprint sits at the top. Future sprints follow in sequence.

| Sprint | Name | Completed | Current State |
|---|---|---|---|
| MIXED-OPGAVEN-TARGET-STANDARD-1 | Mixed-Exercise Target Standard And 2.1.4 Application | no | Active planning sprint. Define the reusable `gemengde_opgaven` target standard, apply it to 2.1.4, and use REV-STD-1 so PASS WITH FLAGS cannot carry a missing core requirement. |
| B2-2.1-TARGET-V5-PROMOTE | Book 2 Chapter 2.1 Target V5 Promotion | yes | Closed PASS WITH FLAGS after lead review. Promoted only 2.1.1 through 2.1.3 target records to `reviewed_final`; kept 2.1.4 placeholder and Chapter 2.2 outside scope. |
| B2-2.1.1-HARDEN | Book 2 Paragraph 2.1.1 Quality Hardening | yes | Closed PASS WITH FLAGS after lead review. Rewrote 2.1.1 to the Book 1 didactic model and rebuilt Chapter 2.1 without duplicate 2.1.1 exercises. |
| B2-2.1.2-HARDEN | Book 2 Paragraph 2.1.2 Quality Hardening | yes | Closed PASS WITH FLAGS after lead review. Imported the root golden package, repaired assembled-chapter duplication, strengthened graph-production practice, and rebuilt paragraph/chapter output. |
| B2-2.1.3-HARDEN | Book 2 Paragraph 2.1.3 Quality Hardening | yes | Closed PASS WITH FLAGS after lead review. Imported the root golden package, added the one-step `MO = MK` interpretation without profit-maximisation scope creep, rebuilt paragraph/chapter output, and passed validators. |
| B2-2.1.4-HARDEN | Book 2 Paragraph 2.1.4 Quality Hardening | yes | Closed PASS WITH FLAGS after lead review. Imported the newer root golden package, preserved the consolidation-only `opgaven`/`antwoorden` shape, rebuilt paragraph/chapter output, and passed validators. |
| B2-2.2-A | Book 2 Chapter 2.2 Part A | no | Paused candidate. Superseded by the one-paragraph sprint series until 2.1.1 through 2.1.4 have current quality evidence. |
| B2-2.1-RETRO | Book 2 Section 2.1 Retrospective | yes | Closed PASS WITH FLAGS after lead review. Repaired the validation gap that allowed assembled chapters to omit paragraph exercises, rebuilt Chapter 2.1 with theory exercises in the chapter/book, aligned chapter margins and line distance with Book 1 rhythm, and approved proceeding to 2.2 with carried flags. |
| B2-2.1-A | Book 2 Chapter 2.1 Part A Vertical Slice | yes | Closed PASS WITH FLAGS after lead review. Built 2.1.1 through 2.1.4 as printed textbook output, generated paragraph/chapter PDFs and answer models, recorded review evidence, and passed paragraph/chapter/book validation. |
| B2-READY-1 | Book 2 Section 2.1 Readiness Gate | yes | Closed PASS WITH FLAGS after lead review. It created the Book 2 production brief, Chapter 2.1 plan, target-exercise readiness check, notation/graph contract, Book 1 style extraction, textbook sprint ledger, and end-state draft. Carried flags: 2.1.4 placeholder, 2.1.1-2.1.3 migrated target review status, and end-state draft not locked. |

## B2-READY-1 Contract

`B2-READY-1` must produce:

1. A Book 2 production brief that names why Book 2 starts with costs, revenue, break-even, marginal concepts, elasticity, and surplus.
2. A Chapter 2.1 plan for 2.1.1 Kostenstructuren, 2.1.2 Opbrengsten, winst en break-even, 2.1.3 Marginale kosten en marginale opbrengsten, and 2.1.4 Gemengde opgaven: kosten en opbrengsten.
3. A target-exercise check for 2.1.1 through 2.1.4. The 2.1.4 placeholder must be replaced before final production or explicitly flagged in the next sprint as a target gap.
4. A notation and graph contract for TK/TCK/TVK, GTK/GCK/GVK, TO/GO, MK/MO, break-even, marginal table changes, and graph requirements.
5. A Book 1 style extraction covering page rhythm, target-opgave structure, worked examples, visual density, answer-model style, and gemengde-opgaven handling.

Exit criterion: a lead reviewer can say "2.1 is production-ready" or name exact target gaps that `B2-2.1-A` must resolve before printed output closure.

## Guardrails

Do not mutate `references/machine/`, `references/external/`, protected reference data, or target-exercise source records inside `B2-READY-1`. Do not modify generated lesson output during readiness. Do not treat migrated target exercises or placeholders as reviewed-final evidence. Do not authorize diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative decisions, product-wide use, or broad companion scaling from this roadmap.

## Next Action

Execute `MIXED-OPGAVEN-TARGET-STANDARD-1`: define the reusable `gemengde_opgaven` target standard, audit 2.1.4, update validator policy/tests, and replace the 2.1.4 placeholder target only if the audit and REV-STD-1 review support explicit target acceptance. Do not start Chapter 2.2 or unrelated lesson production.
