# Textbook Production Roadmap

Generated: 2026-06-12
Roadmap ID: `textbook-production-roadmap`
Roadmap version: `v1.3-chapter-2.2-readiness`
Roadmap status: `active`
Version index: `docs/roadmaps/roadmap-version-index.json`
Folder: `docs/roadmaps/textbook/`
Sprint ledger: `docs/roadmaps/textbook/sprint-ledger.md`
End-state draft: `docs/roadmaps/textbook/textbook-end-state.md`
Scope: textbook improvement and writing work that prepares, builds, verifies, and reviews printed textbook output in `../4veco-lessen`, with planning evidence and sprint records in this repository. Book 2 Chapter 2.1 is closed for now after platform PR #48 and lesson PR #13. The next planned production direction is controlled readiness for Book 2 Chapter 2.2 Elasticiteit.

## Operating Goal

Improve and write the textbook one paragraph at a time. Chapter 2.1 now has current target evidence, rendered proof, validation evidence, and lead-review evidence, so it should not be polished further unless a concrete rendered-output defect appears. The next step is not paragraph writing yet: first prepare Chapter 2.2 through `B2-2.2-READY-1`.

## Book 2 Print Series

The current print-production series proceeds through Book 2 one controlled chapter sequence at a time. Book 2 starts with costs, revenue, break-even, and marginal concepts because those foundations support elasticity and surplus. Chapter 2.1 is closed for now; Chapter 2.2 should begin with readiness before any paragraph writing.

1. `B2-READY-1` - short readiness gate for Book 2 section 2.1.
2. `B2-2.1-A` - first Chapter 2.1 vertical slice, now treated as draft production evidence rather than the final quality bar.
3. `B2-2.1-RETRO` - retrospective and validation/layout repair after the initial vertical slice.
4. `B2-2.1.1-HARDEN` - rewrite 2.1.1 Kostenstructuren to the Book 1 paragraph model.
5. `B2-2.1.2-HARDEN` - rewrite 2.1.2 Opbrengsten, winst en break-even using lessons from 2.1.1.
6. `B2-2.1.3-HARDEN` - rewrite 2.1.3 Marginale kosten en marginale opbrengsten using lessons from 2.1.1 and 2.1.2.
7. `B2-2.1.4-HARDEN` - rebuild the 2.1.4 mixed-practice paragraph after the theory paragraphs are stable.
8. `B2-2.1-TARGET-V5-PROMOTE` - promote 2.1.1, 2.1.2, and 2.1.3 target records after the governed v5 target-quality review.
9. `MIXED-OPGAVEN-TARGET-STANDARD-1` - define the reusable mixed-exercise target standard and apply it to 2.1.4 before any reviewed-final mixed target claim.
10. `B2-2.2-READY-1` - prepare Chapter 2.2 Elasticiteit before writing: targets, notation, sign conventions, graph/table conventions, misconceptions, answer structure, and mixed-opgaven reuse.
11. `B2-2.2.1-HARDEN` - harden 2.2.1 Prijselasticiteit.
12. `B2-2.2.2-HARDEN` - harden 2.2.2 Elasticiteit en omzet.
13. `B2-2.2.3-HARDEN` - harden 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit.
14. `B2-2.2.4-HARDEN-MIXED-1` - harden 2.2.4 as a mixed-opgaven section using the new standard.
15. `B2-2.2-TARGET-V5-PROMOTE` - promote Chapter 2.2 target records only after governed evidence supports them.
16. `B2-2.2-CHAPTER-QA-1` - inspect assembled Chapter 2.2 output after the paragraph sequence.

Do not start `B2-2.2-READY-1` until a human instruction explicitly opens the sprint. Readiness should not write paragraphs or regenerate lesson output.

## Work Lanes

| Lane | Priority | Scope | Blocking rule |
|---|---|---|---|
| Textbook production | High | Move from closed-for-now Chapter 2.1 into controlled Chapter 2.2 readiness, then paragraph-by-paragraph hardening. | Blocks when target exercise evidence, notation conventions, printed-output workflow, or student-facing quality floor is not sufficient for the next planned paragraph. |
| Blueprint hardening | Medium | Fix only blockers discovered during readiness or Chapter 2.1 production, such as non-final target records, notation contradictions, or graph-contract ambiguity. | Blocks production only when the issue directly affects Book 2 printed output or target-exercise faithfulness. |
| Product proof and companion layer | Medium | Continue separately as controlled-scope evidence. It may inform style or route planning, but it is not the driver for Book 2 Part A. | Does not block `B2-2.1-A` unless a later explicit gate says the printed textbook depends on it. |

## Sprint Ledger

Canonical ledger: `docs/roadmaps/textbook/sprint-ledger.md`

When an active sprint exists, it sits at the top. When no sprint is active, the top row names the next planned sprint but does not authorize work. Future sprints follow in sequence.

| Sprint | Name | Completed | Current State |
|---|---|---|---|
| B2-2.2-READY-1 | Book 2 Chapter 2.2 Readiness | no | Planned next, not started. Prepare target readiness, elasticity notation/sign conventions, graph/table conventions, misconception list, answer-model route, and mixed-opgaven reuse decision before paragraph writing. |
| B2-2.2.1-HARDEN | Book 2 Paragraph 2.2.1 Prijselasticiteit Quality Hardening | no | Planned after readiness. Focus on price elasticity calculation, sign/absolute-value interpretation, and elastic/inelastic classification. |
| B2-2.2.2-HARDEN | Book 2 Paragraph 2.2.2 Elasticiteit En Omzet Quality Hardening | no | Planned after 2.2.1. Connect elasticity to total revenue effects with tables and carefully bounded visuals. |
| B2-2.2.3-HARDEN | Book 2 Paragraph 2.2.3 Inkomenselasticiteit En Kruiselingse Elasticiteit Quality Hardening | no | Planned after 2.2.2. Cover income elasticity, cross-price elasticity, and classification language. |
| B2-2.2.4-HARDEN-MIXED-1 | Book 2 Paragraph 2.2.4 Mixed Elasticity Practice | no | Planned after 2.2.1-2.2.3. Reuse the `gemengde_opgaven` target standard for source-heavy mixed elasticity practice. |
| B2-2.2-TARGET-V5-PROMOTE | Book 2 Chapter 2.2 Target V5 Promotion | no | Candidate after Chapter 2.2 has current quality evidence. |
| B2-2.2-CHAPTER-QA-1 | Book 2 Chapter 2.2 Chapter QA | no | Candidate after the Chapter 2.2 paragraph sequence. |
| MIXED-OPGAVEN-TARGET-STANDARD-1 | Mixed-Exercise Target Standard And 2.1.4 Application | yes | Closed PASS after lead review and merged through platform PR #48 and lesson PR #13. Created the reusable `gemengde_opgaven` target standard, applied it to 2.1.4, and resolved the placeholder target without carrying a missing core requirement. |
| B2-2.1-TARGET-V5-PROMOTE | Book 2 Chapter 2.1 Target V5 Promotion | yes | Closed PASS WITH FLAGS after lead review. Promoted only 2.1.1 through 2.1.3 target records to `reviewed_final`; kept 2.1.4 placeholder and Chapter 2.2 outside scope. |
| B2-2.1.1-HARDEN | Book 2 Paragraph 2.1.1 Quality Hardening | yes | Closed PASS WITH FLAGS after lead review. Rewrote 2.1.1 to the Book 1 didactic model and rebuilt Chapter 2.1 without duplicate 2.1.1 exercises. |
| B2-2.1.2-HARDEN | Book 2 Paragraph 2.1.2 Quality Hardening | yes | Closed PASS WITH FLAGS after lead review. Imported the root golden package, repaired assembled-chapter duplication, strengthened graph-production practice, and rebuilt paragraph/chapter output. |
| B2-2.1.3-HARDEN | Book 2 Paragraph 2.1.3 Quality Hardening | yes | Closed PASS WITH FLAGS after lead review. Imported the root golden package, added the one-step `MO = MK` interpretation without profit-maximisation scope creep, rebuilt paragraph/chapter output, and passed validators. |
| B2-2.1.4-HARDEN | Book 2 Paragraph 2.1.4 Quality Hardening | yes | Closed PASS WITH FLAGS after lead review. Imported the newer root golden package, preserved the consolidation-only `opgaven`/`antwoorden` shape, rebuilt paragraph/chapter output, and passed validators. |
| B2-2.2-A | Book 2 Chapter 2.2 Part A | no | Superseded broad chapter sprint. Replaced by the controlled readiness-plus-paragraph sequence beginning with `B2-2.2-READY-1`. |
| B2-2.1-RETRO | Book 2 Section 2.1 Retrospective | yes | Closed PASS WITH FLAGS after lead review. Repaired the validation gap that allowed assembled chapters to omit paragraph exercises, rebuilt Chapter 2.1 with theory exercises in the chapter/book, aligned chapter margins and line distance with Book 1 rhythm, and approved proceeding to 2.2 with carried flags. |
| B2-2.1-A | Book 2 Chapter 2.1 Part A Vertical Slice | yes | Closed PASS WITH FLAGS after lead review. Built 2.1.1 through 2.1.4 as printed textbook output, generated paragraph/chapter PDFs and answer models, recorded review evidence, and passed paragraph/chapter/book validation. |
| B2-READY-1 | Book 2 Section 2.1 Readiness Gate | yes | Closed PASS WITH FLAGS after lead review. It created the Book 2 production brief, Chapter 2.1 plan, target-exercise readiness check, notation/graph contract, Book 1 style extraction, textbook sprint ledger, and end-state draft. Carried flags: 2.1.4 placeholder, 2.1.1-2.1.3 migrated target review status, and end-state draft not locked. |

## B2-2.2-READY-1 Contract

`B2-2.2-READY-1` must produce:

1. A Chapter 2.2 production brief for 2.2.1 Prijselasticiteit, 2.2.2 Elasticiteit en omzet, 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit, and 2.2.4 Gemengde opgaven: elasticiteit.
2. A target-exercise readiness check for 2.2.1 through 2.2.4.
3. An elasticity notation contract: `Ev`/prijselasticiteit wording, negative sign versus absolute-value interpretation, percentage change in `Q` divided by percentage change in `P`, old/new value convention, elastic/inelastic classification, and revenue-effect language.
4. A graph/table contract for movement along demand, price/quantity table interpretation, and omzet rectangles if used.
5. A misconception list covering percentage-point confusion, missing minus signs, inconsistent denominators, "inelastic means quantity does not change", and unexplained positive-only elasticity.
6. A style extraction from Book 1 and Chapter 2.1, including answer-skill routines from 2.1.4.
7. A decision on whether and how 2.2.4 reuses the mixed-opgaven target standard.

Exit criterion: a lead reviewer can say "2.2.1 is ready for a hardening sprint" or name exact target, notation, graph/table, or answer-model gaps that must be resolved before paragraph writing.

## Guardrails

Do not mutate `references/machine/`, `references/external/`, protected reference data, or target-exercise source records inside `B2-2.2-READY-1` unless the sprint plan explicitly authorizes a bounded source-record decision. Do not write paragraphs or modify generated lesson output during readiness. Do not treat migrated target exercises or placeholders as reviewed-final evidence. Do not close or reinterpret the check-surface gate. Do not authorize diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative decisions, PV, Scale Gate 1, product-wide use, or broad companion scaling from this roadmap.

## Next Action

Do not start a sprint yet. When the user explicitly opens the next production step, create `B2-2.2-READY-1` as a readiness sprint for Chapter 2.2 Elasticiteit. The first sprint must plan targets, notation/sign conventions, graph/table conventions, misconceptions, answer-model routines, and the 2.2.4 mixed-opgaven reuse decision before any paragraph writing or lesson-output regeneration.
