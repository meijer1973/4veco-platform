# Textbook Production Roadmap

Generated: 2026-09-03
Roadmap ID: `textbook-production-roadmap`
Roadmap version: `v1.18-book2-foundation-integrated-gate0b1-active`
Roadmap status: `active`
Version index: `docs/roadmaps/roadmap-version-index.json`
Folder: `docs/roadmaps/textbook/`
Sprint ledger: `docs/roadmaps/textbook/sprint-ledger.md`
End-state draft: `docs/roadmaps/textbook/textbook-end-state.md`
Scope: textbook improvement and writing work that prepares, builds, verifies, and reviews printed textbook output in `../4veco-lessen`, with planning evidence and sprint records in this repository. `BOOK-2-FOUNDATION-OUTLINE-1` is integrated through PR #226 merge `b6e75a558e7ddb34a3e36094a2ab8367249fa357`; post-merge CI run `33724859532` passed. The approved outline remains `approved_with_holds` at semantic hash `69d803d2786e97bbd7519d2feed3ee29b79751b00a3c8a440432621927a13cde`. Issue #223 Gate 0B-1 is now the active next task: exact §2.1.1 lesson-goal and replacement-target design, specialist review, and explicit owner decisions. `H-211-GATE0B1` and `H-211-TARGET-INTEGRATION` remain open. No target-registry mutation, lesson write, paragraph production, or target-specific checker is authorized in Gate 0B-1. Chapter 2.3 output, Book 3, product-route adoption, diagnostics/mastery/PV, Scale Gate 1, check-surface closure, and student/product-use work remain outside scope.

## Operating Goal

Use the integrated, owner-approved Book 2 foundation to complete Issue #223 Gate 0B-1 without crossing into target authority or lesson production. The active sprint must finalize and hash the §2.1.1 internal/student-visible goals and clean-sheet replacement-target design, prove direct operation and answer-form coverage, obtain specialist and structural review, and stop for explicit owner decisions. Gate 0C remains a separate target-registry integration PR; lesson production remains blocked until both §2.1.1 holds are released.

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
17. `BOOK-2-FOUNDATION-OUTLINE-1` - derive and review the canonical Book 2 outline, workflow foundation check, and freshness guardrail before paragraph-level design resumes.
18. `B2-2.1.1-GOAL-TARGET-DESIGN-1` - finalize the exact §2.1.1 goal and replacement-target packages against the integrated Book 2 outline, obtain specialist/lead/owner review, and stop before Gate 0C or lesson production.

`B2-2.2-READY-1` is closed as readiness only. It did not write paragraphs or regenerate lesson output. Human instruction opened `B2-2.2.1-HARDEN` on 2026-06-17 and `B2-2.2.2-HARDEN` on 2026-06-18. Human instruction on 2026-06-19 opened `GOAL-B2-2.2-CHAPTER-COMPLETE-1`, authorizing completion of 2.2.3, 2.2.4, Chapter 2.2 target promotion, and Chapter 2.2 QA in one governed batch before returning for human review. Do not start Chapter 2.3, Book 3, product-route adoption, diagnostics/mastery/PV, Scale Gate 1, check-surface closure, or student/product-use work from this roadmap state.

## Work Lanes

| Lane | Priority | Scope | Blocking rule |
|---|---|---|---|
| Textbook production | High | Complete coordinated PR review for the locally finished Chapter 2.2 sequence before any new chapter work. | Blocks when target exercise evidence, rendered proof, validator evidence, remote CI, or human review is not sufficient for merge. |
| Blueprint hardening | Medium | Fix only blockers discovered during readiness or Chapter 2.1 production, such as non-final target records, notation contradictions, or graph-contract ambiguity. | Blocks production only when the issue directly affects Book 2 printed output or target-exercise faithfulness. |
| Product proof and companion layer | Medium | Continue separately as controlled-scope evidence. It may inform style or route planning, but it is not the driver for Book 2 Part A. | Does not block `B2-2.1-A` unless a later explicit gate says the printed textbook depends on it. |

## Sprint Ledger

Canonical ledger: `docs/roadmaps/textbook/sprint-ledger.md`

When an active sprint exists, it sits at the top. When no sprint is active, the top row names the next planned sprint but does not authorize work. Future sprints follow in sequence.

| Sprint | Name | Completed | Current State |
|---|---|---|---|
| B2-2.1.1-GOAL-TARGET-DESIGN-1 | Book 2 Paragraph 2.1.1 Goal And Target Design | no | Active platform-only Gate 0B-1 from exact integrated baseline `b6e75a558e7ddb34a3e36094a2ab8367249fa357`. Produce hashable goal/target packages, specialist timing, teacher/economic review, structural lead review, and explicit owner decisions. Keep the target registry and lesson unchanged; `H-211-GATE0B1` and `H-211-TARGET-INTEGRATION` remain open. |
| BOOK-2-FOUNDATION-OUTLINE-1 | Book 2 Foundation And Outline | yes | Integrated through PR #226 merge `b6e75a558e7ddb34a3e36094a2ab8367249fa357`; post-merge CI run `33724859532` passed. The outline remains `approved_with_holds` at semantic hash `69d803d2786e97bbd7519d2feed3ee29b79751b00a3c8a440432621927a13cde`. `H-OUTLINE-OWNER` and `H-MERGE-GOVERNANCE` are released; all 13 other holds remain open. |
| B2-2.2-CHAPTER-QA-1 | Book 2 Chapter 2.2 Chapter QA | yes | Closed locally after final assembled Chapter 2.2 output, answer-model output, rendered proof, validators, and lead review. Chapter 2.2 contains exactly 2.2.1, 2.2.2, 2.2.3, and 2.2.4. |
| B2-2.2-TARGET-V5-PROMOTE | Book 2 Chapter 2.2 Target V5 Promotion | yes | Closed locally after promoting 2.2.1 through 2.2.4 target records to `reviewed_final`, replacing the 2.2.4 placeholder with a governed mixed-opgaven target, and rerunning the v5 target validator. |
| B2-2.2.4-HARDEN-MIXED-1 | Book 2 Paragraph 2.2.4 Mixed Elasticity Practice | yes | Closed locally after building consolidation-only mixed elasticity practice with source-heavy transfer, answer guidance, rendered proof, validators, and explicit mixed-target acceptance. |
| B2-2.2.3-HARDEN | Book 2 Paragraph 2.2.3 Inkomenselasticiteit En Kruiselingse Elasticiteit Quality Hardening | yes | Closed locally after building income elasticity, cross-price elasticity, and demand-function practice with sign-first classification and ceteris-paribus reasoning, rendered proof, validators, and lead review. |
| B2-2.2.2-HARDEN | Book 2 Paragraph 2.2.2 Elasticiteit En Omzet Quality Hardening | yes | Closed PASS WITH FLAGS after 2.2.2-only output, Chapter 2.2 aggregate rebuild with 2.2.1 + 2.2.2 only, rendered-page proof, no-new-figure rationale, validators, result evidence, and lead review. |
| B2-2.2.1-HARDEN | Book 2 Paragraph 2.2.1 Prijselasticiteit Quality Hardening | yes | Closed PASS WITH FLAGS after stale-output disposition, rendered-page proof, figure proof, validators, result evidence, and lead review. |
| B2-2.2-READY-1 | Book 2 Chapter 2.2 Readiness | yes | Closed PASS WITH FLAGS after lead review. Prepared target readiness, elasticity notation/sign conventions, graph/table conventions, misconception list, answer-model route, rendered-page and figure-proof expectations, and the 2.2.4 mixed-opgaven reuse decision. No paragraphs, generated lesson output, target records, Book 2 Chapter 2.3, or Book 3 files changed. |
| TEXTBOOK-FIGURE-STANDARD-1 | Textbook Figure Standard | yes | Closed as platform-only policy sprint. Added durable figure and graph source-asset standard so future textbook sprints treat SVG/PNG pairing, labels, graph conventions, density, color-not-sole-meaning, and graph/text concordance as preflight proof while final rendered pages remain acceptance proof. No lesson content or generated output edits. |
| TEXTBOOK-RENDERED-PAGE-ACCEPTANCE-1 | Rendered-Page Acceptance Policy | yes | Closed as platform-only policy sprint. Added durable rendered-page acceptance standard so future textbook sprints treat final rendered PDF/HTML as student-facing readability/layout proof while markdown remains the content source of truth. No lesson content or generated output edits. |
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

Execute `B2-2.1.1-GOAL-TARGET-DESIGN-1` as the active Issue #223 Gate 0B-1 sprint: preserve PR #224's accepted Gate 0A evidence with exact provenance, close PR #224 as superseded, finalize and review exact goal/target packages, and stop for owner decisions. Do not mutate the target registry, edit lessons, begin paragraph production, or start Gate 0C, Chapter 2.3, Book 3, product-route adoption, diagnostics/mastery/PV, Scale Gate 1, check-surface closure, or student/product-use work.
