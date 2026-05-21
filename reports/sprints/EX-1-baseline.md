# Sprint EX-1: Baseline

## Plan reference

Plan: `reports/sprints/EX-1-plan.md`

## Current state

`GATE-EX0-exam-ingestion-contract` is closed as `pass_with_conditions` and authorizes EX-1 as a bounded non-mutating pilot.

Before EX-1 implementation, no pilot overlay files exist under `references/data/exam-ingestion/`:

- `exam-item-overlays.json`
- `exam-answer-model-overlays.json`
- `exam-source-annex-overlays.json`

The EX-0 contract checker still includes the original no-pilot-data assertion, which must be updated in a gate-aware way once authorized pilot files exist.

## Selected pilot inputs

All three pilot questions use the local official VWO 2025 tijdvak 1 files:

- `references/external/exam-questions.json`
- `references/external/exams/vw-1022-a-25-1-o.pdf`
- `references/external/exams/vw-1022-a-25-1-c.pdf`

Pilot selection:

| Role | Exam item ID | Rationale |
|---|---|---|
| calculation-heavy | `vw-1022-a-25-1-o:opgave-1:question-3` | Tests table/source-value extraction, calculation threshold logic, point rules, and precision expectations. |
| graph/source-heavy | `vw-1022-a-25-1-o:opgave-4:question-19` | Tests graph/source-annex gap visibility because the uitwerkbijlage and graph/source layout are not fully reconstructable from mirrored prompt text. |
| reasoning/answer-model-heavy | `vw-1022-a-25-1-o:opgave-3:question-15` | Tests answer-model decomposition for a causal/dominant-strategy explanation and correction-model wording requirements. |

## Data integrity notes

No protected reference data has changed at baseline. EX-1 must not edit `references/external/`, `references/machine/`, `references/authored/course-target-exercises.json`, or `references/owned/course-blueprint-v5.md`.

No lesson output, lesson review file, or lesson quality-ref has changed at baseline.

EX-1 may create non-mutating `references/data/exam-ingestion/` overlays only under the closed `GATE-EX0` conditions.

## Initial risks

- The graph/source-heavy pilot item must carry blocking `graph_object_gap` and `source_annex_gap` unless source values and graph geometry are fully reconstructable.
- The pilot validator must prevent prompt-only extraction from being misread as full exam ingestion.
- The pilot records may classify MTU requirements only as review evidence for EX-2; they must not mint or edit units.
