# Sprint EX-0: Baseline

## Plan reference

Plan: `reports/sprints/EX-0-plan.md`

## Baseline snapshot

Generated: 2026-05-21

Platform commit at baseline: `ebb2838f7f3c0446762d5fcfd41a7cb6b6c74987`

Lesson commit at baseline: `a31f2e11320035f6a616f899fe91a68d8a204c01`

Roadmap state: `EX-0` is the active sprint in `references/reference-team-roadmap.md`.

Existing exam and exercise surfaces:

- `references/external/exam-questions.json` mirrors prompt-level exam-question records.
- `references/schemas/exam-question.schema.json` covers prompt-level metadata, source document ID, question number, required units, question type, and evidence IDs.
- `references/schemas/exercise-metadata-overlay.schema.json` covers protected-source-safe exercise overlays and already separates required units, provisional operations, source annex status, graph spec, scaffolding, and product boundaries.
- `references/data/exercises/README.md` already states that exam-question overlays must distinguish prompt metadata from answer-model metadata.

Known baseline gap:

The existing exam-question records do not yet model official correction-model steps, point rules, accepted alternatives, precision/unit requirements, graph requirements, source-annex objects, or answer-writing operations as first-class traceable objects.

## Data integrity notes

EX-0 starts from a clean non-mutating boundary. Protected reference data under `references/external/` and `references/machine/` must not be edited. Authored target exercises and owned blueprint sources must not be mutated. Lesson output is outside the EX-0 scope.

EX-0 may define schema and review-procedure contracts only. It may not create real pilot overlay records, mint units, promote target exercises, finalize placeholders, close CP-6, close Year 1, or authorize student-facing/product use.
