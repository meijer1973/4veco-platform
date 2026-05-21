# GATE-EX0 Gate Closure

Gate: `GATE-EX0-exam-ingestion-contract`

Sprint: `EX-0`

Status: `pass_with_conditions`

Closed on: 2026-05-21

Human confirmation: yes

## Summary

GATE-EX0 is closed as `pass_with_conditions`.

The EX-0 contract is adequate to authorize EX-1 as a bounded pilot. EX-1 may create three pilot exam-ingestion overlays under `references/data/`: one calculation-heavy, one graph/source-heavy, and one reasoning/answer-model-heavy.

This closure authorizes no protected reference mutation, external-source mutation, unit minting, target-exercise promotion, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.

## Accepted Outcomes

- The overlay-first design is accepted for the bounded EX-1 pilot.
- Official exam prompts, source material, official correction models, point rules, decomposition, and gap classifications remain governed `references/data/` overlays.
- Prompt metadata, prompt text, source annexes, graph/table/figure records, answer-model requirements, skill decomposition, MTU gap classification, and lesson-build handoff are sufficiently separated for a pilot.
- The correction-model contract is accepted as the minimum EX-1 contract.
- Source-annex and answer-model gap semantics are explicit enough for EX-1 if downstream blocking is preserved.
- The MTU/operation classification taxonomy is accepted for EX-1 and EX-2.
- The lesson-build handoff is sufficient for L-EX0 coordination.
- EX-1 is authorized to create three bounded pilot overlays after this closure.

## Blocked Outcomes

- No protected reference mutation is authorized.
- No external-source mutation is authorized.
- Do not hand-edit `references/external/`.
- Do not hand-edit `references/machine/`.
- Do not mint units in EX-1.
- Do not promote target exercises.
- Do not finalize placeholders.
- Do not close CP-6.
- Do not close Year 1.
- Do not treat prompt-only extraction as full exam ingestion.
- Do not hide source-annex, graph-object, answer-model, precision, or unit-requirement gaps downstream.
- Do not authorize diagnostics, adaptive routing, mastery decisions, automatic sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.

## Conditions

1. Graph/source reconstruction condition: a graph/source-heavy pilot item may not be marked `reviewed_ready_for_mapping` unless the graph/table/source values needed by the official question are reconstructable. If not, the overlay must carry a blocking `graph_object_gap` or `source_annex_gap`.
2. Pilot-overlay validator condition: EX-1 must add a separate validator for real pilot overlay records. The EX-0 checker remains contract-only.
3. Lesson-handoff trace condition: L-EX0 should add explicit paragraph-plan fields for "assumed prior knowledge with MTU evidence" and "deliberately out of scope with reason."
4. No hidden gaps condition: `pass_with_gaps` is acceptable for EX-1 only when named gaps remain visible downstream and block affected use.
5. Roadmap clarity condition: EX-1 planning must repeat that GATE-EX0 authorizes only non-mutating pilot overlays and no protected mutation or student/product use.

## Allowed Next Scope

Allowed next sprint: `EX-1`

Allowed scope:

- Create three bounded exam-ingestion pilot overlays under `references/data/`.
- Select one calculation-heavy official VWO question.
- Select one graph/source-heavy official VWO question.
- Select one reasoning/answer-model-heavy official VWO question.
- Keep official prompt/source/correction-model provenance separately traceable.
- Mark source-annex, graph-object, answer-model, precision, unit, and handoff gaps explicitly.
- Add a pilot-overlay validator for the real EX-1 records.

## Blocked Next Scope

- protected reference mutation
- external-source mutation
- machine registry mutation
- unit minting
- target-exercise promotion
- placeholder finalization
- CP-6 closure
- Year-1 closure
- lesson-output mutation
- prompt-only ingestion as full ingestion
- hidden graph/source/answer-model gaps
- diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection
- PV machine promotion
- student-facing generated output
