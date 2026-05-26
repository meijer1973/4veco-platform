# Exam Ingestion Coverage

Generated: 2026-05-26T05:43:40.148Z
Status: warn

Diagnostic EX-3 report. This report records reviewed EX-2 classifications for EX-1 pilot exam items. It does not authorize protected reference mutation, external-source mutation, unit minting, operation-registry mutation, answer-skill mutation, target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure, or student/product use.

No protected reference mutation is authorized by this report.

## Summary

| Metric | Value |
|---|---:|
| Pilot items | 3 |
| Reviewed classifications | 8 |
| Blocking gaps | 2 |
| Lesson handoff ready with gaps | 2 |
| Lesson handoff blocked | 1 |
| Answer-skill needs | 2 |
| Operation-registry needs | 2 |

## Pilot Items

| Exam item | Pilot role | Prompt | Source status | Answer model | Handoff | Blocking gaps |
|---|---|---|---|---|---|---|
| vw-1022-a-25-1-o:opgave-1:question-3 | calculation_heavy | extracted | extracted_pending_review | extracted_pending_review | ready_with_gaps | - |
| vw-1022-a-25-1-o:opgave-4:question-19 | graph_source_heavy | extracted | partially_extracted | extracted_pending_review | blocked | q19-graph-object-gap, q19-source-annex-gap |
| vw-1022-a-25-1-o:opgave-3:question-15 | reasoning_answer_model_heavy | extracted | extracted_pending_review | extracted_pending_review | ready_with_gaps | - |

## Reviewed Classifications

| Requirement | Classification | Accepted/support units | Weak/stale units | Blocking gaps | Mutation authorized |
|---|---|---|---|---|---|
| q3-calc-1 | operation_registry_need | A61 | A15 | - | false |
| q3-answer-1 | answer_skill_need | - | - | - | false |
| q19-source-annex-gap | source_annex_gap | - | - | - | false |
| q19-graph-object-gap | graph_object_gap | - | - | - | false |
| q19-graph-op-1 | existing_mtu_but_procedure_too_weak_plus_pv_graph_need | A42, D10 | A45 | q19-source-annex-gap, q19-graph-object-gap | false |
| q19-reason-1 | operation_registry_need | D10, D13 | - | q19-source-annex-gap, q19-graph-object-gap | false |
| q15-content | existing_mtu | D27, F03, F09 | - | - | false |
| q15-answer-1 | answer_skill_need | - | - | - | false |

## Gate Conditions Carried Forward

- q3 source-reading support must be corrected from stale A15 to A61; q3-calc-1 remains operation_registry_need.
- q3 threshold-conclusion wording remains answer_skill_need.
- q19 graph-operation candidates must include A42 and D10; A45 is weak prerequisite/support only.
- q19 remains blocked by q19-source-annex-gap and q19-graph-object-gap.
- q15 content maps to D27, F03, and F09 only for content coverage; the correction-model explanation remains answer_skill_need.
- q3 and q15 may proceed only to planning/dry-run lesson coordination with visible gaps.
- EX-3 is reporting/dashboard work only unless a later explicit gate changes scope.
- EX-4 may be planned later as governed mutation planning, but EX-2 itself does not authorize mutation.

## Proof Required Before Next Use

- q19 must remain blocked for lesson handoff and full MTU mapping until the source figure and uitwerkbijlage are reconstructable, or a later human gate explicitly accepts a visible limitation.
- q3 may move only to planning or dry-run lesson coordination while q3-calc-1 remains an operation-registry need and q3-answer-1 remains an answer-skill need.
- q15 may move only to planning or dry-run lesson coordination while q15-answer-1 remains an answer-skill need.
- Any unit, operation, answer-skill, or PV/graph mutation requires a later governed plan and explicit human authorization; EX-3 is reporting only.

## Authority Boundary

| Boundary | Authorized |
|---|---:|
| protected_reference_mutation_authorized | false |
| external_source_mutation_authorized | false |
| machine_reference_mutation_authorized | false |
| unit_minting_authorized | false |
| operation_registry_mutation_authorized | false |
| answer_skill_mutation_authorized | false |
| target_exercise_promotion_authorized | false |
| lesson_output_mutation_authorized | false |
| cp6_closure_authorized | false |
| year1_closure_authorized | false |
| diagnostics_authorized | false |
| adaptive_routing_authorized | false |
| mastery_decisions_authorized | false |
| automatic_sequencing_authorized | false |
| student_facing_ai_authorized | false |
| summative_use_authorized | false |
| pv_projection_authorized | false |
| pv_machine_promotion_authorized | false |
| student_facing_output_authorized | false |

## Issues

- **medium** q3-calc-1 (operation_registry_need)
  - evidence: `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json`
  - next: Keep q3 annual cost-threshold comparison as an operation-registry need; use A61 only as source-reading support and keep A15 marked stale/incorrect for this task.
  - close: A later governed EX-4 plan or review decides whether the annual threshold operation becomes an operation entry, a strengthened existing procedure, or another reviewed route.
- **medium** q3-answer-1 (answer_skill_need)
  - evidence: `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json`
  - next: Keep the threshold conclusion with unit and direction visible as a separate answer-skill need.
  - close: A reviewed answer-skill route exists for threshold-conclusion wording, or a later gate explicitly assigns it to a governed procedure.
- **high** q19-source-annex-gap (blocking_source_annex_gap)
  - evidence: `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json`
  - next: Keep q19 blocked for full mapping and lesson handoff until the official source figure and worksheet are reconstructed or a later gate accepts a visible limitation.
  - close: The q19 overlay contains reconstructable source figure and uitwerkbijlage evidence, or the blocking gap remains explicitly carried forward.
- **high** q19-graph-object-gap (blocking_graph_object_gap)
  - evidence: `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json`
  - next: Keep q19 PV/graph projection and lesson handoff blocked until the three market graph objects are reconstructable.
  - close: The q19 overlay contains graph axes, units, line geometry, source locators, and worksheet context, or the blocking graph gap remains explicit.
- **medium** q19-graph-op-1 (existing_mtu_but_procedure_too_weak_plus_pv_graph_need)
  - evidence: `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json`
  - next: Carry A42 and D10 as stronger candidates, keep A45 as weak prerequisite/support only, and do not mutate graph/PV registries from EX-3.
  - close: A later governed sprint either strengthens reviewed graph-shift procedures or creates a reviewed PV/graph route after source/graph gaps are resolved.
- **medium** q19-reason-1 (operation_registry_need)
  - evidence: `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json`
  - next: Keep chained multi-market reasoning as a provisional operation-registry need with D10/D13 partial support.
  - close: A later reviewed plan decides the chained market-shift operation route without hidden source/graph gaps.
- **medium** q15-answer-1 (answer_skill_need)
  - evidence: `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json`
  - next: Keep the two-step correction-model explanation visible as an answer-skill need even though D27/F03/F09 cover content.
  - close: A reviewed answer-skill route exists for two-step correction-model explanations, or a later gate assigns it to governed strengthened MTU procedures.
