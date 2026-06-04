# Sprint TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM: Baseline

## Plan reference

Plan: `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-plan.md`

## Current state

`SOURCE-RECONSTRUCT-2-ACTUAL-EXAM` is closed and published. It created the
authorized source reconstruction for `vw-1022-a-25-1-o:opgave-1:question-3`
and explicitly left task transformation as follow-up work. The open roadmap row
`TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM` now requires transformation into shared
task-family compositions with operation-chain traces, answer-form traces,
task-family maps, sourceAuthority references, and reviewer notes.

Existing task-shell families already cover the needed action types:

- `source_value_selection`
- `source_chain_builder`
- `formula_builder`
- `step_ordering`
- `calculation_work_capture`

The current baseline has no actual-exam transformation JSON, no actual-exam
task-family map, no answer-form trace, no operation-chain trace, no rendered
task-transformation lab, and no checker for this sprint.

## Baseline evidence

- Source reconstruction: `reports/json/source-reconstruct2-actual-exam.json`
- Source proof: `reports/json/source-reconstruct2-actual-exam-proof.json`
- Authority contract: `reports/json/exam-source-authority1-contract.json`
- Source task-family runtime proof: `reports/json/task-family-source1-proof.json`
- Formula task-family runtime proof: `reports/json/task-family-formula1-proof.json`
- Step-ordering runtime proof: `reports/json/task-family-order1-proof.json`
- Calculation-work shell proof: `reports/json/task-shell-ux2-proof.json`

## Risks before implementation

| Risk | Why it matters | Stop condition |
|---|---|---|
| Source-selection-only reduction | The exam item requires calculation work and threshold direction, not just reading values. | Stop if the bundle lacks calculation work and source-chain tasks. |
| Final-answer-only reduction | The official correction gives steps; a final `649` field alone would not preserve cognitive level. | Stop if adversarial final-answer-only response passes. |
| Source-use as standalone answer form | Source use is a modifier; the underlying answer remains calculation and constructed threshold direction. | Stop if answer-form trace treats source use as the whole answer. |
| Product-route scope drift | This sprint is review evidence, not generated lesson output or product adoption. | Stop if Book 1 output, protected references, source-data, target registry, units, or product route files change. |
| Rendered proof gap | Later human review needs inspectable proof, and the platform standard now favors rendered evidence for interactive surfaces. | Stop if desktop/mobile/dark lab proof cannot be produced. |

## Data integrity notes

No protected reference data under `references/machine/` or
`references/external/` may change. No `source-data/` files may change. No
generated Book 1 lesson output may change. No unit, target-exercise,
candidate-storage, PV, diagnostics, mastery/sequencing, Scale Gate, or
student/product surface may be mutated or authorized.
