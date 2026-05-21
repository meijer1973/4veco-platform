# EX-1 Exam Ingestion Pilot

Generated: 2026-05-21

Status: pilot overlays created, EX-2 mapping review still required.

No protected reference mutation, external-source mutation, unit minting, target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure, or student/product use is authorized.

## Pilot Items

| Role | Exam item | Status | Main result |
|---|---|---|---|
| calculation-heavy | `vw-1022-a-25-1-o:opgave-1:question-3` | `extracted_pending_review` | Table values and answer-model steps are represented; A15 source mapping is questionable and routed to EX-2. |
| graph/source-heavy | `vw-1022-a-25-1-o:opgave-4:question-19` | `reviewed_with_gaps` | Source figure and uitwerkbijlage are not fully reconstructable; blocking `source_annex_gap` and `graph_object_gap` are carried. |
| reasoning/answer-model-heavy | `vw-1022-a-25-1-o:opgave-3:question-15` | `extracted_pending_review` | Dominant-strategy and prisoner-dilemma answer steps are represented; answer-writing sufficiency routes to EX-2. |

## Files

- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`
- `build-scripts/references/check-exam-ingestion-pilots.js`

## Gap Policy

The graph/source-heavy item is deliberately not marked `reviewed_ready_for_mapping`.

It carries:

- `q19-source-annex-gap`, blocking full reconstruction, MTU mapping, lesson handoff, and human review.
- `q19-graph-object-gap`, blocking full reconstruction, MTU mapping, lesson handoff, and human review.

These gaps must remain visible downstream unless a later source-annex extraction workflow resolves them or a human gate explicitly accepts the limitation.

## EX-2 Routing

EX-2 should review:

- whether question 3 maps to an existing arithmetic/cost-comparison unit, a weak A15 mirror mapping, or a missing operation;
- whether question 19 can map to D10/D13 plus PV graph templates, or whether it needs a separate multi-market shift operation after source reconstruction;
- whether question 15 is covered by D27, F03, and F09, or whether its two-step correction-model wording needs a dedicated answer-skill/procedure record.

EX-2 remains a review gate only. It does not authorize mutation by itself.
