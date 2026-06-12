# Sprint MIXED-OPGAVEN-TARGET-STANDARD-1: Mixed-Exercise Target Standard And 2.1.4 Application

## Goal

Define a reusable target standard for `gemengde_opgaven` paragraphs and apply
it first to `2.1.4 Gemengde opgaven: kosten en opbrengsten`.

This sprint must end the ambiguity between a placeholder pile of exercises and
a governed mixed-exercise target. A reviewed mixed paragraph may be
`reviewed_final` only when it has a non-placeholder target record, explicit
review acceptance, and evidence that the student-facing section supports
context-heavy transfer without introducing new economic theory.

## Context

Book 2 Chapter 2.1 now has reviewed-final target records for `2.1.1`,
`2.1.2`, and `2.1.3` after `B2-2.1-TARGET-V5-PROMOTE`. The remaining
Chapter 2.1 target gap is `2.1.4`, which is a count-bearing
`gemengde_opgaven` paragraph.

`B2-2.1.4-HARDEN` accepted the repository implementation of 2.1.4 as a
consolidation-only student-facing section with `opgaven` and `antwoorden`, no
official theory paragraph, and no new economic theory. It deliberately did not
mutate the upstream target record. The active target registry still has
`target_exercise.placeholder: true` and `record_status:
placeholder_needs_review` for `2.1.4`.

The current v5 target checker also contains a Phase A guard that rejects
`reviewed_final` on all `gemengde_opgaven` records. This sprint must update
that policy intentionally rather than bypassing it.

REV-STD-1 now governs review evidence, lead reviews, product-proof gates, and
Scale Gate preparation. This sprint must use REV-STD-1 for its review evidence
package and lead-review evidence.

## Quality Standard

The governing specification is the textbook end-state plus REV-STD-1. The
textbook end-state requires every count-bearing paragraph to have target
exercise evidence that is reviewed-final or explicitly accepted by a documented
human decision, and it preserves the distinction between normal theory
paragraphs and `gemengde_opgaven` sections. The operational product end-state
also requires context-first student routes where source-dependent tasks use
text, tables, graphs, formulas, source labels, and answer-construction
requirements where relevant.

The quality floor is not only a passing registry edit. Proof must show that the
new standard is specific enough to guide future mixed sections, that the 2.1.4
target is no longer placeholder-backed, that the rendered output remains
aligned with the target, and that any student-facing changes are regenerated
through the normal workflow rather than hand-patched. Any non-core follow-up
must be named with ownership and proof required to close.

Under REV-STD-1, the review evidence package and lead reviews must cite:

- product end-state: `docs/roadmaps/textbook/textbook-end-state.md` and
  `../4veco-lessen/specifications/product-end-state.md`;
- original sprint/gate spec: this plan, `reports/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1-plan.md`;
- non-negotiable requirements;
- a core-requirement checklist;
- classified findings;
- carried issues with `blocks`, `does_not_block`, and
  `proof_required_to_close`.

PASS WITH FLAGS may not carry a missing core requirement. If the mixed-target
standard, non-placeholder 2.1.4 target, validator support, explicit target
acceptance, or no-new-theory boundary is missing, the sprint must not close as
PASS WITH FLAGS.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| [CORE] Define the general `gemengde_opgaven` target standard. | Add a platform-owned standard describing mixed sections as no-new-theory transfer sections with richer sources, skill integration, operation selection, table/graph interpretation, and answer construction. | Review evidence checks the standard is reusable for future mixed sections, not only 2.1.4. | Planned |
| [CORE] Replace the 2.1.4 placeholder target with a real mixed target. | `references/authored/course-target-exercises.json` has a non-placeholder `target_exercise` for `2.1.4`, `paragraph_kind: gemengde_opgaven`, `introduces_new_theory: false`, and `record_status: reviewed_final` only after acceptance. | Target validator passes, diff proves `placeholder: true` is removed for 2.1.4, and review explicitly accepts the target form. | Planned |
| [CORE] Update validator policy for reviewed mixed targets. | `scripts/check-course-target-exercises-v5.js` no longer rejects reviewed-final `gemengde_opgaven` records that meet the new standard; tests cover placeholder and reviewed-final mixed cases. | `node scripts/check-course-target-exercises-v5.js` and its test suite pass. | Planned |
| [CORE] Audit 2.1.4 against the new standard. | Produce review evidence for no new theory, skill integration from 2.1.1-2.1.3, source selection, context depth, answer structure, table/graph transfer, target visibility, and registry clarity. | Review evidence classifies each criterion as pass, blocking finding, or accepted non-blocking follow-up under REV-STD-1. | Planned |
| [CORE] Add or verify compact answering-skill guidance. | Either current 2.1.4 output already contains sufficient answer-structure guidance, or scoped source markdown changes add formula -> substitution -> result -> unit -> conclusion, table/graph interpretation, and explanation structure. | If lesson source changes, regenerated HTML/PDF and paragraph/chapter validators pass; if unchanged, evidence explains why guidance is already sufficient. | Planned |
| [CORE] Preserve the no-new-theory boundary. | Standard, target record, 2.1.4 review evidence, and quality refs all state that mixed sections deepen through transfer and answer construction, not new economic theory. | Lead review must block closure if any new economic rule is introduced as 2.1.4 theory. | Planned |
| [CORE] Use REV-STD-1 review evidence. | Review evidence and lead-review records cite product end-state and this plan, name non-negotiables, include a core checklist, classify findings, and use carried-issue fields. | Lead review verifies PASS WITH FLAGS does not carry a missing core requirement. | Planned |
| Keep platform and lesson boundaries clear. | Platform owns the standard, registry, validators, roadmap, and sprint evidence; `../4veco-lessen` changes only if student-facing source or aligned mirrors require it. | Diff summary separates platform source/status changes from lesson generated output regeneration. | Planned |
| Preserve Chapter 2.2 and product-scaling boundaries. | No Chapter 2.2 content, companion scaling, diagnostics, mastery, sequencing, summative, PV, Scale Gate, or student/product-use authorization. | Scope-language and diff checks pass; lead review confirms no widened authority. | Planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add a reusable mixed-exercise target standard | `include_now` | Future `gemengde_opgaven` sections need one governed standard rather than repeated placeholder exceptions. |
| Replace the 2.1.4 placeholder target with a non-placeholder integrated target | `include_now` | A reviewed-final placeholder is conceptually wrong and would violate the current target-quality boundary. |
| Update target-registry validation for reviewed mixed sections | `include_now` | The current Phase A guard blocks the intended final state and must be replaced by stricter mixed-target requirements. |
| Add compact answering-skill guidance only if the audit finds a real gap | `include_now` | Mixed sections are where students move into context-heavy answer construction; guidance must be present without becoming new theory. |
| Apply the new standard to all future mixed sections in this sprint | `defer_named_follow_up` | This sprint applies the standard to 2.1.4 only; later sections should reuse the standard in separate governed work. |
| Rewrite 2.1.4 as a normal theory paragraph | `reject_scope_creep` | The paragraph kind is consolidation and transfer, not new theory. |
| Start Chapter 2.2 production | `reject_scope_creep` | Current assignment remains Chapter 2.1.x and target-standard work. |

## Allowed paths

- `references/authored/gemengde-opgaven-target-standard.md`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`
- `scripts/check-course-target-exercises-v5.js`
- `scripts/tests/check-course-target-exercises-v5.test.js`
- `reports/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1-*`
- `references/data/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1.plan.json`
- `references/data/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1.result.json`
- `docs/roadmaps/textbook/textbook-production-roadmap.md`
- `docs/roadmaps/textbook/sprint-ledger.md`
- `../4veco-lessen/course_blueprint_v5.md`
- `../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/_chapter-plan.md`
- `../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/2.1.4-review.md`
- `../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/2.1.4-quality-ref.yaml`
- `../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/2.1.4 Gemengde opgaven – opgaven.md`
- `../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/2.1.4 Gemengde opgaven – antwoorden.md`
- Regenerated 2.1.4 and Chapter 2.1 HTML/PDF outputs only if scoped source markdown changes require regeneration.

## Forbidden paths

- No edits under `references/machine/` or `references/external/`.
- No Chapter 2.2 or later paragraph production.
- No generated lesson output edits unless 2.1.4 source markdown changes require normal regeneration.
- No broad rewrite of 2.1.4 as a normal theory paragraph.
- No new economic theory in 2.1.4.
- No target promotion for other `gemengde_opgaven` records.
- No companion/product scaling, diagnostics, adaptive routing, mastery,
  sequencing, student-facing AI, summative use, PV projection, PV machine
  promotion, Scale Gate 1, or student/product-use authorization.

## Inputs

- `reports/sprints/B2-2.1.4-HARDEN-*`
- `reports/sprints/B2-2.1-TARGET-V5-PROMOTE-*`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`
- `references/authored/vraagtypen-en-opgaveontwerp.md`
- `references/authored/didactiek-principes.md`
- `docs/roadmaps/textbook/textbook-end-state.md`
- `../4veco-lessen/specifications/product-end-state.md`
- Current 2.1.4 lesson folder under `../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/`
- User direction that REV-STD-1 has landed and PASS WITH FLAGS may not carry missing core requirements.

## Outputs

- Reusable platform standard for `gemengde_opgaven` target records.
- Non-placeholder 2.1.4 mixed target record, if accepted.
- Validator support for reviewed-final mixed records that satisfy the standard.
- 2.1.4 audit and target-acceptance review evidence under REV-STD-1.
- Optional 2.1.4 source/output adjustment only if the audit finds a concrete target-evidence gap.
- Updated blueprint, lesson mirror/status notes, roadmap, ledger, result, diff summary, command log, and lead-review records.

## Operationalized sprint procedure

1. Create the sprint plan, baseline, plan JSON, roadmap/ledger row, and run the planned bundle validators before implementation.
2. Draft `references/authored/gemengde-opgaven-target-standard.md` from existing consolidation-exercise and didactic references. The standard must include definition, allowed behavior, forbidden behavior, target-record fields, source complexity, skill integration, answering-skill evidence, table/graph interpretation evidence, review checklist, promotion rule, reusable target template, and 2.1.4 application notes. Stop if the draft would redefine mixed sections as theory paragraphs or authorize product/companion behavior.
3. Audit current 2.1.4 student-facing source against the new standard. Record one explicit outcome: A) current 2.1.4 is accepted unchanged and only target registry/status references change; B) current 2.1.4 is accepted after a small answering-skill or graph/table-transfer repair; or C) current 2.1.4 does not meet the standard and the sprint stops with a blocking result instead of promotion.
4. If the audit finds a real student-facing gap, edit only scoped 2.1.4 source markdown and rebuild through the lesson workflow. If no gap exists, leave generated output unchanged and record why.
5. Replace the 2.1.4 target placeholder with a non-placeholder mixed target only after the audit supports the target. The record must remain visibly distinct from a theory target: `paragraph_kind: gemengde_opgaven`, `introduces_new_theory: false`, no `target_exercise.placeholder: true`, integrated source-selection/calculation/table-or-graph/conclusion subquestions, and a `mixed_target_profile` only if the schema and validator can support it cleanly. Update blueprint and lesson mirror/status notes accordingly.
6. Update `scripts/check-course-target-exercises-v5.js` and tests so reviewed-final mixed records are allowed only when they meet the new standard. Stop if the validator would permit placeholder-backed reviewed-final records.
7. Prepare REV-STD-1 review evidence with product end-state citations, this sprint plan as the original spec, non-negotiable requirements, a core checklist, classified findings, and carried-issue fields.
8. Run acceptance validators. If any core requirement fails, do not close as PASS WITH FLAGS; either fix inside scope or stop with a blocking result.
9. Complete lead review round 1, corrections, and round 2 before closure. Close only after the complete sprint bundle validator passes.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js MIXED-OPGAVEN-TARGET-STANDARD-1
node build-scripts/sprints/check-scope-language.js --active
node build-scripts/references/check-roadmap-version-index.js
node scripts/check-course-target-exercises-v5.js
npm.cmd test -- scripts/tests/check-course-target-exercises-v5.test.js
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven"
node scripts/validate-chapter.js "../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten"
node scripts/check-book.js --paragraph-mode part-a --paragraph-profile publisher-print "../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus"
git diff --check
git -C ../4veco-lessen diff --check
node build-scripts/sprints/check-sprint-result.js reports/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1-result.md
node build-scripts/sprints/check-sprint-bundle.js MIXED-OPGAVEN-TARGET-STANDARD-1 --complete
```

If no student-facing source changes occur, paragraph/chapter/book validators
must still pass against existing rendered output and the result must explicitly
state that no regeneration was required.

## Proof Required to Close

Closure proof must include the planned bundle check, the reusable mixed-target
standard, the 2.1.4 audit, a non-placeholder 2.1.4 target record, target
validator and test results, paragraph/chapter/book validation, roadmap/index
checks, scope-language checks, diff checks in both repositories, result and
complete-bundle checks, and lead review under REV-STD-1.

The close decision must state whether 2.1.4 is accepted as the intended target
form for a mixed-exercise section. Any carried issue must include `blocks`,
`does_not_block`, and `proof_required_to_close`. PASS WITH FLAGS may carry only
non-core follow-up items; it may not carry a missing mixed-target standard,
placeholder-backed 2.1.4 target, missing validator support, missing explicit
target acceptance, or missing no-new-theory proof.

## Rollback plan

If this sprint is rejected, revert only the files changed by this sprint.
Restore the 2.1.4 target record to `placeholder_needs_review` with
`target_exercise.placeholder: true`, restore the Phase A checker behavior or
supersede it with an explicit failed-standard note, restore blueprint/status
notes, remove or mark superseded sprint result records, and rerun the same
acceptance validators. Do not edit protected references, Chapter 2.2, or
generated lesson output outside the scoped 2.1.4 regeneration path.

## Human review required

Human review approved the planning direction after the remote planning review.
No additional interactive human gate is required inside implementation unless
the audit requires a substantive student-facing redesign beyond the scoped
2.1.4 answering-skill or graph/table-transfer adjustment. A strict lead-review
cycle is required before closure. The lead review must use REV-STD-1 and must
not return PASS WITH FLAGS if any core requirement is missing.
