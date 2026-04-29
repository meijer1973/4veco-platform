# CP-3 Human Interview

Gate: `GATE-CP3-schema-extension-dry-run`

Sprint: `S4`

Reviewer role: Head of Content Strategy

Decision: `pass_with_conditions`

Bulk extension authorized: no

## Answers

### CP3-Q1 Overall Round Trip

Answer: B. Mostly, with minor additions

Decision: The Tier C target exercise is reconstructable. The Tier A exam question is reconstructable as a task, but not fully calculable because `bron 1` values are not extracted.

### CP3-Q2 Tier A Source Values

Answer: B. Yes, but must be a follow-up before bulk extension

Decision: `source_values_not_extracted` is acceptable for CP-3 because the overlay honestly records the extraction gap, but it must not become normal bulk behavior for Tier A exam overlays that require source annex values.

### CP3-Q3 Required Units

Answer: A. Yes

Decision: The overlay uses `required_units` while the source still uses `required_skills`, matching CP-1 migration strategy without protected-source mutation.

### CP3-Q4 Exercise Operations

Answer: B. Yes, but mark provisional more strongly

Decision: `exercise_operations` are useful in the dry run, but remain provisional until a governed operation registry exists.

### CP3-Q5 Role Split

Answer: A. Yes

Decision: The schema and overlays preserve `instructional_role` and `assessment_role` as separate fields.

### CP3-Q6 Assessment Role Absence

Answer: A. Yes

Decision: Omitting `assessment_role` for the target exercise correctly follows CP-1; do not use `null` or `not_applicable`.

### CP3-Q7 Scaffolding Object

Answer: B. Mostly, needs wording/range notes

Decision: The scaffolding object is structurally adequate, but needs reviewer calibration notes before scale-up.

### CP3-Q8 Graph Specs And Precision

Answer: B. Mostly, add representation values later

Decision: `graph_spec` and `precision_lint_status` are adequate for this dry run, but the representation enum will likely need expansion during broader coverage.

### CP3-Q9 Authority And Product Boundaries

Answer: B. Mostly, strengthen warnings

Decision: Authority and product boundaries are correctly separated, but warnings should remain highly visible because `instructional_role: diagnostic` can be misunderstood.

### CP3-Q10 Gate Status

Answer: `pass_with_conditions`

Decision: Close CP-3 as `pass_with_conditions`.

## Pattern Analysis

The answers approve the S4 dry-run overlay shape while preserving strict limits. The schema is good enough to continue with overlay-first planning and bounded follow-up implementation, but not good enough for untracked bulk metadata backfill or source mutation.

## Targeted Follow-Ups

- Track Tier A source annex extraction gaps before broad Tier A overlay backfill.
- Mark `exercise_operations` as provisional until a governed operation registry exists.
- Add reviewer calibration notes for scaffolding scale values.
- Refine `graph_spec` representation values during broader coverage work.
- Strengthen product-boundary warnings around `instructional_role: diagnostic`.

Plain pass authorized: no
