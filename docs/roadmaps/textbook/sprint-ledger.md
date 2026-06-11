# Textbook Sprint Ledger

Updated: 2026-06-11
Roadmap: `docs/roadmaps/textbook/textbook-production-roadmap.md`

## Current Rule

The active sprint sits at the top. Planned sprints stay in sequence until a sprint result, lead review, or human decision explicitly changes the order. A sprint is marked completed only after its result packet, validators, and required review evidence support closure.

## Sprint Protocol Reminder

Every agent working from this ledger must use the repository sprint protocol before doing textbook work. Create the sprint plan first in `reports/sprints/<sprint-id>-plan.md`, create `references/data/sprints/<sprint-id>.plan.json`, record the baseline, and run the planned/active bundle check before treating the sprint as active work.

## Protocol Summary

1. Plan: include the required sprint-plan headings, quality standard, specification fulfilment matrix, allowed/forbidden paths, operationalized procedure, acceptance tests, proof to close, and rollback plan.
2. Baseline: record the starting source/output state and protected-data status before implementation.
3. Execute: stay inside allowed paths and preserve `references/machine/` and `references/external/` unless a later authorized workflow says otherwise.
4. Verify: run the acceptance tests named in the plan and record command evidence in `reports/sprints/<sprint-id>-command-log.jsonl`.
5. Result: write the result and diff summary, including changed files, data-integrity notes, open follow-ups, and rollback instructions.
6. Lead review: give the finished bundle to the lead review agent, record round 1, apply required corrections or record that none were needed, then record round 2.
7. Close: run `node build-scripts/sprints/check-sprint-bundle.js <sprint-id> --complete` before marking the sprint completed or moving the next sprint to active.
8. Handoff: end status reports and final answers with concrete advice on the next step, so the next agent knows exactly where to continue.

## Active And Planned Sprints

| Sprint | Name | Completed | Current State | Required Next Action |
|---|---|---|---|---|
| MIXED-OPGAVEN-TARGET-STANDARD-1 | Mixed-Exercise Target Standard And 2.1.4 Application | no | Active planning sprint. Define the reusable `gemengde_opgaven` target standard and apply it to 2.1.4 under REV-STD-1. | Run the planned bundle check, then implement the standard, 2.1.4 audit, validator update, and non-placeholder target only if the audit supports target acceptance. |
| B2-2.1-TARGET-V5-PROMOTE | Book 2 Chapter 2.1 Target V5 Promotion | yes | Closed PASS WITH FLAGS after lead review. Promoted only 2.1.1 through 2.1.3 target records to `reviewed_final`; kept 2.1.4 placeholder and Chapter 2.2 outside scope. | Use the reviewed-final target records for 2.1.1 through 2.1.3; carry 2.1.4 target-placeholder and Chapter 2.1 PDF-size flags into their separate follow-ups. |
| B2-2.1.1-HARDEN | Book 2 Paragraph 2.1.1 Quality Hardening | yes | Closed PASS WITH FLAGS after lead review. Rewrote 2.1.1 to Book 1-quality didactic structure, exercises, answer model, and rendered output; rebuilt Chapter 2.1 without duplicate 2.1.1 exercises. | Target-v5 flag resolved by `B2-2.1-TARGET-V5-PROMOTE`; otherwise use its quality notes before downstream Chapter 2.1 work. |
| B2-2.1.2-HARDEN | Book 2 Paragraph 2.1.2 Quality Hardening | yes | Closed PASS WITH FLAGS after lead review. Imported the root golden package, repaired assembled-chapter duplication, strengthened the target-equivalent graph-production route, rebuilt paragraph/chapter output, and passed validators. | Target-v5 flag resolved by `B2-2.1-TARGET-V5-PROMOTE`; carry chapter-PDF-size monitoring into later assembly work. |
| B2-2.1.3-HARDEN | Book 2 Paragraph 2.1.3 Quality Hardening | yes | Closed PASS WITH FLAGS after lead review. Imported the root golden package, added the one-step `MO = MK` interpretation without profit-maximisation scope creep, rebuilt paragraph/chapter output, and passed validators. | Target-v5 flag resolved by `B2-2.1-TARGET-V5-PROMOTE`; carry chapter-PDF-size monitoring into later assembly work. |
| B2-2.1.4-HARDEN | Book 2 Paragraph 2.1.4 Quality Hardening | yes | Closed PASS WITH FLAGS after lead review. Imported the newer root golden package, preserved the consolidation-only `opgaven`/`antwoorden` shape, removed unused package assets from canonical folders, rebuilt paragraph/chapter output, and passed validators. | Carry target-placeholder and Chapter 2.1 PDF-size flags into later target review and print assembly work. |
| B2-2.2-A | Book 2 Chapter 2.2 Part A | no | Paused outside current scope. Human direction now limits this assignment to Chapter 2.1.x. | Do not resume unless a later human instruction expands the assignment beyond Chapter 2.1.x. |
| B2-2.1-RETRO | Book 2 Section 2.1 Retrospective | yes | Closed PASS WITH FLAGS after lead review. Repaired the assembled-exercise validation gap, rebuilt Chapter 2.1 so theory exercises appear in the chapter/book, aligned chapter margins and line distance with Book 1 rhythm, and dispositioned carry flags. | Superseded by human direction to open `B2-2.1.1-HARDEN` before any further chapter-wide production. |
| B2-2.1-A | Book 2 Chapter 2.1 Part A Vertical Slice | yes | Closed PASS WITH FLAGS after lead review. Built printed output for 2.1.1 through 2.1.4, generated paragraph and chapter PDFs, recorded QC artifacts, and passed paragraph/chapter/book validators. | Carry flags into `B2-2.1-RETRO`: migrated target v5 review, local 2.1.4 source-registry decision, pagination polish, `MO = MK` equality-case decision, and chapter PDF size warning. |
| B2-READY-1 | Book 2 Section 2.1 Readiness Gate | yes | Closed PASS WITH FLAGS after lead review. The readiness packet exists and validator checks are green. It records that 2.1.4 is placeholder-backed and 2.1.1 through 2.1.3 are migrated targets needing v5 review. | Carry flags into `B2-2.1-A`. |
| B2-2.3-A | Book 2 Chapter 2.3 Part A | no | Candidate. Covers surplus and welfare foundations. | Plan only after 2.2 has review evidence or a human-approved reorder. |
| B2-BOOK-REVIEW | Book 2 Print Assembly Review | no | Candidate. Assemble and review Book 2 as a printed whole. | Start only after all Book 2 chapters have current paragraph and chapter proof. |
| B3-READY-1 | Book 3 Readiness Gate | no | Candidate. Prepare government intervention and market-structure production. | Start only after Book 2 is stable enough to supply the prerequisite foundation. |
| B4-READY-1 | Book 4 Readiness Gate | no | Candidate. Prepare marktvormen, marktfalen, and arbeidsmarkt production. | Start only after Book 3 prerequisites and target evidence are stable. |
| COURSE-PRINT-GATE | Complete Three-Year Textbook Set Gate | no | Candidate. Review the full textbook set across the complete three-year course. | Start only when every book has current source, rendered output, answer models, and review evidence. |

## Ledger Guardrails

Do not mark a sprint complete because files merely exist. Closure requires evidence that the printed output satisfies the specification, student-facing quality floor, target-exercise intent, rendered-output checks, and required review process.

Do not use this ledger to authorize diagnostics, adaptive routing, mastery/sequencing, student-facing AI, summative decisions, product-wide use, or broad companion scaling. Those remain separate product gates.
