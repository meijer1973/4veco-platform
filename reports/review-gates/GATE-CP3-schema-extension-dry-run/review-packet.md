# GATE-CP3-schema-extension-dry-run Review Packet

Status: `prepared_for_human_review`

Sprint: `S4 Exercise Metadata Overlay MVP`

## Purpose

Review whether the first protected-source-safe exercise metadata overlay is good enough to proceed toward broader exercise metadata extension.

This gate does not authorize:

- student diagnostics
- adaptive routing
- student-facing AI
- automatic mastery decisions
- summative assessment decisions
- bulk source mutation

## Artifacts

- `references/schemas/exercise-metadata-overlay.schema.json`
- `references/data/exercises/README.md`
- `references/data/exercises/exam-question-overlays.json`
- `references/data/exercises/target-exercise-overlays.json`
- `build-scripts/references/check-exercise-overlays.js`
- `reports/review-gates/GATE-CP3-schema-extension-dry-run/schema-dry-run.json`
- `reports/review-gates/GATE-CP3-schema-extension-dry-run/schema-dry-run.md`

## Acceptance Check

Passed:

```bash
node build-scripts/references/check-exercise-overlays.js
```

## Dry-Run Summary

Tier A external exam item:

- source: `references/external/exam-questions.json`
- source stable ID: `external_exam_question:ha-1022-a-23-1-o:opgave-1:question-2`
- required units: `A04`
- assessment role: `exam_mirror`
- evidence status: `source_values_not_extracted`

Tier C target exercise:

- source: `references/authored/course-target-exercises.json`
- source stable ID: `target_exercise:1.1.3`
- required units: `A38`, `A45`, `A46`
- instructional role: `target`
- assessment role: omitted, as CP-1 required when absent
- evidence status: `owned_exercise_evidence`

## Human Review Questions

### CP3-Q1 Overall Round Trip

Can a reviewer reconstruct what the Tier A exam question and Tier C target exercise are asking from the source record plus overlay metadata?

Options:

- A. Yes
- B. Mostly, with minor additions
- C. No, schema repair needed
- D. Not enough evidence

### CP3-Q2 Tier A Source Values

Is it acceptable that the Tier A exam overlay records `source_values_not_extracted` when the question refers to `bron 1` but the source annex values are not in `exam-questions.json`?

Options:

- A. Yes, acceptable for dry run
- B. Yes, but must be a follow-up before bulk extension
- C. No, source annex extraction required before CP-3 can pass
- D. Not enough evidence

### CP3-Q3 Required Units

Does the overlay correctly use `required_units` as the canonical micro-teaching-unit field while leaving source `required_skills` untouched?

Options:

- A. Yes
- B. Mostly, add wording
- C. No, naming or migration risk remains
- D. Not enough evidence

### CP3-Q4 Exercise Operations

Are provisional `exercise_operations` useful enough for dry-run metadata without pretending the future operation registry already exists?

Options:

- A. Yes
- B. Yes, but mark provisional more strongly
- C. No, leave operations empty until Sprint 7/Sprint 12
- D. Not enough evidence

### CP3-Q5 Role Split

Does the dry run preserve `instructional_role` and `assessment_role` as separate orthogonal fields?

Options:

- A. Yes
- B. Mostly, clarify wording
- C. No, schema repair needed
- D. Not enough evidence

### CP3-Q6 Assessment Role Absence

Is the target-exercise overlay correct to omit `assessment_role` entirely when no assessment role applies?

Options:

- A. Yes
- B. Yes, but add documentation
- C. No, use a different absence representation
- D. Not enough evidence

### CP3-Q7 Scaffolding Object

Does the four-field scaffolding object preserve enough information for verbal level, visual stage, fading position, and dual coding?

Options:

- A. Yes
- B. Mostly, needs wording/range notes
- C. No, schema repair needed
- D. Not enough evidence

### CP3-Q8 Graph Specs And Precision

Are `graph_spec` and `precision_lint_status` adequate for distinguishing graph/table exercises from non-graph calculation exercises at this stage?

Options:

- A. Yes
- B. Mostly, add representation values later
- C. No, precision or graph metadata is under-specified
- D. Not enough evidence

### CP3-Q9 Authority And Product Boundaries

Do the overlays preserve the boundaries that external exam records are `external_primary`, target exercises are `owned_exercise_evidence`, and no student diagnostics/adaptive/summative use is authorized?

Options:

- A. Yes
- B. Mostly, strengthen warnings
- C. No, authority boundary is unclear
- D. Not enough evidence

### CP3-Q10 Gate Status

What CP-3 gate status is appropriate before any bulk exercise metadata extension?

Options:

- A. pass
- B. pass_with_conditions
- C. hold
- D. fail

## Likely Conditions If CP-3 Passes

- Bulk extension must remain overlay-first until a source migration sprint is approved.
- Tier A overlays with source annex gaps must mark `source_values_not_extracted` or equivalent.
- `assessment_role` must remain optional and omitted when absent.
- `instructional_role: diagnostic` must not authorize student diagnostics.
- `exercise_operations` remain provisional until the governed operation registry/backfill sprint.
- No student diagnostics, adaptive routing, student-facing AI, mastery decisions, or summative decisions are authorized by CP-3.
