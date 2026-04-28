# CP-1 Human Interview

Gate: `GATE-CP1-schema-audit`
Sprint: `S1`
Recorded: 2026-04-28
Decision: `pass_with_conditions`

## Summary

The human reviewer approved CP-1 with conditions. R9.1 is unblocked only for owned-source registry, blueprint source-reference repair, and owned-source scope work. Exercise metadata backfill remains reserved for Sprint 4 and later schema dry-run gates.

## Answers

### CP1-Q1

Question: Approve `required_units` as the canonical field for micro-teaching-unit IDs?

Answer: approve.

Notes: `required_units` is canonical for micro-teaching-unit IDs. Migration from `required_skills` lands in Sprint 4 via overlay. Source-file rename of `references/external/exam-questions.json` waits for an approved migration sprint.

### CP1-Q2

Question: Approve `exercise_operations` as the canonical field for fine-grained exercise actions?

Answer: approve.

Notes: This field may be sparsely populated until Sprint 12 bootstraps the operations registry. Schema must allow it to be empty without validation failure.

### CP1-Q3

Question: Should the broader taxonomy field be named `skill_tags` or `skill_category_tags`?

Answer: `skill_tags`.

Notes: `skill_tags` is shorter and does not pre-commit to category as the organizing principle. If a legacy use of `skill_tags` is found before Sprint 4 closes, escalate before proceeding.

### CP1-Q4

Question: Approve `instructional_role` and `assessment_role` as separate fields rather than one flat exercise role enum?

Answer: approve.

Notes: These are orthogonal axes and must remain separate fields.

### CP1-Q5

Question: Approve the initial `instructional_role` vocabulary?

Answer: approve the HCS list.

Approved v1 values:

- `worked_example`
- `startoefening`
- `independent_practice`
- `interleaving`
- `target`
- `verdieping`
- `consolidatie`
- `instapquiz`
- `diagnostic`
- `nieuws`

Notes: Treat the list as v1. Schema must allow extension through a registry or CLI-managed pattern without breaking validators.

### CP1-Q6

Question: For `assessment_role`, should non-assessment items use `null`, `not_applicable`, or omit the field?

Answer: omit the field.

Notes: A record with no assessment role has no value for that axis. Retrieval filters by `assessment_role` should skip records without the field.

### CP1-Q7

Question: Approve `scaffolding` as a four-field object with `verbal_level`, `visual_stage`, `fading_position`, and `dual_coding_present`?

Answer: approve.

Approved object:

```json
{
  "verbal_level": "integer 0-5",
  "visual_stage": "integer 1-4",
  "fading_position": "integer",
  "dual_coding_present": "boolean"
}
```

### CP1-Q8

Question: Approve `references/data/exercises/` overlays for external exam-question metadata?

Answer: approve.

Notes: Overlay file format must carry the source record's stable ID and the curriculum version it was overlaid against so external refresh drift is detectable.

### CP1-Q9

Question: For authored target exercises, should Sprint 4 use overlays first and leave source mutation to a later approved migration?

Answer: approve overlay-first.

Notes: Source mutation of `course-target-exercises.json` waits for a later approved migration with plan, baseline, CLI mutation script, and validators.

### CP1-Q10

Question: Approve `build-scripts/lib/verify_svg_geometry.py` as the canonical precision verifier path, with optional wrapper later?

Answer: approve.

Notes: Wrapper is deferred unless Sprint 4 surfaces an actual ergonomic problem. The schema field `precision_lint_status` references the verifier by name, not path.

### CP1-Q11

Question: May R9.1 proceed after CP-1 if it repairs blueprint references and owned-source registry only, without exercise metadata backfill?

Answer: approve.

Notes: R9.1 is unblocked for owned-source surfaces, projection-edge preparation, and blueprint reference repair. Exercise metadata remains Sprint 4 scope and depends on CP-3.

### CP1-Q12

Question: Gate status: `pass`, `pass_with_conditions`, `hold`, or `fail`?

Answer: `pass_with_conditions`.

## Pattern Analysis

The answers are internally consistent:

- Vocabulary decisions are approved.
- Protected-source overlay strategy is approved.
- Role split and scaffolding object are non-negotiable.
- R9.1 is unblocked only at limited owned-source scope.
- Bulk exercise metadata waits for Sprint 4 and CP-3.

No targeted follow-up questions are required before closure.

## Explicit Human Confirmation

The human reviewer explicitly authorized closing CP-1 as `pass_with_conditions` and proceeding to R9.1 when the team is ready.
