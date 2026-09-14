# Textbook Production Roadmap

Generated: 2026-09-14
Roadmap ID: `textbook-production-roadmap`
Roadmap version: `v1.23-book2-integrated`
Roadmap status: `active`
Version index: `docs/roadmaps/roadmap-version-index.json`
Folder: `docs/roadmaps/textbook/`
Sprint ledger: `docs/roadmaps/textbook/sprint-ledger.md`
End-state draft: `docs/roadmaps/textbook/textbook-end-state.md`
Scope: import the owner-selected completed Book 2 edition, preserve its editable sources and provenance, make it discoverable, and check technical integrity. Writing/assembly is complete; repository integration and existing target/companion/product obligations are tracked separately.

## Operating Goal

Current 2026-09-14 decision: **Book 2 writing and assembly are complete.** The owner selected the externally authored chat edition covering Chapters 2.1–2.3 and all twelve paragraphs. The supplied student book, separate answers, teacher guides and editable chapter sources are the import baseline. The unchanged edition and superseded-chapter archive are integrated on main with technical preservation and navigation checks complete. Do not commission fresh Book 2 chapter writing or a new full content-review cycle for this import. Repository integration status is recorded separately from content completion. Existing target-approval and companion/product obligations are not automatically closed by the import.

`BOOK2-CHAT-IMPORT-1`: **writing/assembly complete; import and archive cleanup integrated on main**. [Delivered edition and editable sources](https://github.com/meijer1973/4veco-lessen/blob/main/Boek%202%20-%20Kosten%2C%20opbrengsten%2C%20elasticiteit%20en%20surplus/README.md). Owner-authorized integration on 2026-09-14: [platform PR #246](https://github.com/meijer1973/4veco-platform/pull/246), merge `9da770b410a76b9257cf946861676da4d104a09c`; [lessons PR #50](https://github.com/meijer1973/4veco-lessen/pull/50), merge `a8b25eb8f475b7aabe053f58b494997ac8bf8f97`. Issues #223/#229 are not automatically closed.

[PR #231](https://github.com/meijer1973/4veco-platform/pull/231) merged on 2026-09-05 at `96416b6b5bd57094576e9aba0a42d682584ec479`. Do not replay that activation; the import does not release any remaining hold or change the target registry.

## Book 2 Print Series

The selected complete edition is the default delivered print baseline. Superseded repository chapters 2.1/2.2 are archived byte-for-byte to `archive/book-2-pre-chat-2026/`, with per-file relocation metadata; their historical reviews retain their original scope. The supplied student book, answers, teacher guides, chapter PDFs and editable sources are available on main; preserve layout, numbering, assets and source relationships. Rebuild or repair only for a concrete substantial defect. Technical checks and required repository CI do not constitute a new target-content review.

### Historical production sequence

The sequence and dated decisions below describe the older repository production. Fresh H2/H3 writing and book assembly are superseded by the selected edition; historical review records retain only their original scope.

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
19. `BOOK2-TARGET-AUTHORITY-REMEDIATION-1` - repair and review all twelve Book 2 target records as one exact candidate package under Issue #229, with lesson and merge gates left closed.

`B2-2.2-READY-1` is closed as readiness only. It did not write paragraphs or regenerate lesson output. Human instruction opened `B2-2.2.1-HARDEN` on 2026-06-17 and `B2-2.2.2-HARDEN` on 2026-06-18. Human instruction on 2026-06-19 opened `GOAL-B2-2.2-CHAPTER-COMPLETE-1`, authorizing completion of 2.2.3, 2.2.4, Chapter 2.2 target promotion, and Chapter 2.2 QA in one governed batch before returning for human review. Do not start Chapter 2.3, Book 3, product-route adoption, diagnostics/mastery/PV, Scale Gate 1, check-surface closure, or student/product-use work from this roadmap state.

## Work Lanes

| Lane | Priority | Scope | Blocking rule |
|---|---|---|---|
| Book 2 import | High | BOOK2-CHAT-IMPORT-1 is integrated: preserve the completed edition, sources and archive. | Any later substantial defect needs a separately scoped repair. Formal target alignment is separate. |
| Blueprint hardening | Medium | Fix only blockers discovered during readiness or Chapter 2.1 production, such as non-final target records, notation contradictions, or graph-contract ambiguity. | Blocks production only when the issue directly affects Book 2 printed output or target-exercise faithfulness. |
| Product proof and companion layer | Medium | Continue separately as controlled-scope evidence. It may inform style or route planning, but it is not the driver for Book 2 Part A. | Does not block `B2-2.1-A` unless a later explicit gate says the printed textbook depends on it. |

## Sprint Ledger

Canonical ledger: `docs/roadmaps/textbook/sprint-ledger.md`

BOOK2-CHAT-IMPORT-1 is integrated on main. Older rows retain their historical facts and decisions; their production instructions are superseded for this edition. They do not certify a new formal review of the import.

| Sprint | Name | Completed | Current State |
|---|---|---|---|
| BOOK2-CHAT-IMPORT-1 | Import completed Book 2 chat edition | yes | **Writing/assembly complete; import and archive cleanup integrated on main.** Unchanged edition and editable sources; old chapters 2.1/2.2 archived byte-for-byte with relocation metadata. Technical import/archive checks only; target/companion/product obligations remain separate. Owner-authorized integration on 2026-09-14: [platform PR #246](https://github.com/meijer1973/4veco-platform/pull/246), merge `9da770b410a76b9257cf946861676da4d104a09c`; [lessons PR #50](https://github.com/meijer1973/4veco-lessen/pull/50), merge `a8b25eb8f475b7aabe053f58b494997ac8bf8f97`. |
| BOOK2-TARGET-INTEGRATION-1 | Governed Book 2 Target Activation | yes | [PR #231](https://github.com/meijer1973/4veco-platform/pull/231) merged on 2026-09-05 at `96416b6b5bd57094576e9aba0a42d682584ec479`. Activation is already integrated; historical review evidence remains scoped to that activation. Remaining holds and target/product obligations are unchanged by this import. |
| BOOK2-TARGET-AUTHORITY-REMEDIATION-1 | Book 2 Target Authority Remediation | yes | Issue #229 Phase A complete with structural lead `PASS WITH FLAGS` on exact package `914d1a39…71310`; only empirical classroom timing is carried to Phase B. The owner approved frozen target content and Ei semantics; lifecycle/evidence corrections and fresh CI/readiness are in progress. Target integration, lesson work, Phase B, and merge remain unauthorized. |
| B2-2.1.1-GOAL-TARGET-DESIGN-1 | Book 2 Paragraph 2.1.1 Goal And Target Design | yes | Both exact package hashes are owner-approved in PR #227 comment `5524345692`. `H-211-GATE0B1` is released; `H-211-TARGET-INTEGRATION` remains open with the approved replacement binding. The target registry and lesson are unchanged. Exact-head transition CI and separate payload authorization remain before governed PR #227 integration. |
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

## Historical B2-2.2-READY-1 Contract

`B2-2.2-READY-1` must produce:

1. A Chapter 2.2 production brief for 2.2.1 Prijselasticiteit, 2.2.2 Elasticiteit en omzet, 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit, and 2.2.4 Gemengde opgaven: elasticiteit.
2. A target-exercise readiness check for 2.2.1 through 2.2.4.
3. An elasticity notation contract: `Ev`/prijselasticiteit wording, negative sign versus absolute-value interpretation, percentage change in `Q` divided by percentage change in `P`, old/new value convention, elastic/inelastic classification, and revenue-effect language.
4. A graph/table contract for movement along demand, price/quantity table interpretation, and omzet rectangles if used.
5. A misconception list covering percentage-point confusion, missing minus signs, inconsistent denominators, "inelastic means quantity does not change", and unexplained positive-only elasticity.
6. A style extraction from Book 1 and Chapter 2.1, including answer-skill routines from 2.1.4.
7. A decision on whether and how 2.2.4 reuses the mixed-opgaven target standard.

Exit criterion: a lead reviewer can say "2.2.1 is ready for a hardening sprint" or name exact target, notation, graph/table, or answer-model gaps that must be resolved before paragraph writing.

## Historical readiness guardrails

Do not mutate `references/machine/`, `references/external/`, protected reference data, or target-exercise source records inside `B2-2.2-READY-1` unless the sprint plan explicitly authorizes a bounded source-record decision. Do not write paragraphs or modify generated lesson output during readiness. Do not treat migrated target exercises or placeholders as reviewed-final evidence. Do not close or reinterpret the check-surface gate. Do not authorize diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative decisions, PV, Scale Gate 1, product-wide use, or broad companion scaling from this roadmap.

## Next Action

The technical import/archive work in `BOOK2-CHAT-IMPORT-1` is complete and integrated on main. Owner-authorized integration on 2026-09-14: [platform PR #246](https://github.com/meijer1973/4veco-platform/pull/246), merge `9da770b410a76b9257cf946861676da4d104a09c`; [lessons PR #50](https://github.com/meijer1973/4veco-lessen/pull/50), merge `a8b25eb8f475b7aabe053f58b494997ac8bf8f97`. Do not begin fresh Book 2 chapter writing, repeat PR #231 activation, or claim an unperformed formal content review.
