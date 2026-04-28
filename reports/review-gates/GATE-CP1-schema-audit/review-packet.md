# CP-1 Review Packet

Generated: 2026-04-28T21:18:06.045Z

Gate: `GATE-CP1-schema-audit`
Sprint: `S1`
Status: prepared for human review, not closed.

## Proposed Status

`pass_with_conditions`

## Rationale

The schema audit found real compatibility issues, but they are exactly the issues CP-1 was meant to surface. R9.1 can proceed after CP-1 if the naming contract and overlay strategy are approved, because R9.1 is owned-source registry and blueprint-reference repair, not bulk exercise metadata backfill.

## Review Questions

### CP1-Q1

Approve required_units as the canonical field for micro-teaching-unit IDs?

Recommended answer: approve

### CP1-Q2

Approve exercise_operations as the canonical field for fine-grained exercise actions?

Recommended answer: approve

### CP1-Q3

Should the broader taxonomy field be named skill_tags or skill_category_tags?

Recommended answer: skill_tags unless the reviewer wants maximum explicitness.

### CP1-Q4

Approve instructional_role and assessment_role as separate fields rather than one flat exercise role enum?

Recommended answer: approve

### CP1-Q5

Approve the initial instructional_role vocabulary?

Recommended answer: approve_with_conditions: allow CP-3 to refine values during dry run.

### CP1-Q6

For assessment_role, should non-assessment items use null, not_applicable, or omit the field?

Recommended answer: not_applicable for explicitness in overlays.

### CP1-Q7

Approve scaffolding as a four-field object with verbal_level, visual_stage, fading_position, and dual_coding_present?

Recommended answer: approve

### CP1-Q8

Approve references/data/exercises/ overlays for external exam-question metadata?

Recommended answer: approve

### CP1-Q9

For authored target exercises, should Sprint 4 use overlays first and leave source mutation to a later approved migration?

Recommended answer: approve overlays first.

### CP1-Q10

Approve build-scripts/lib/verify_svg_geometry.py as the canonical precision verifier path, with optional wrapper later?

Recommended answer: approve

### CP1-Q11

May R9.1 proceed after CP-1 if it repairs blueprint references and owned-source registry only, without exercise metadata backfill?

Recommended answer: approve

### CP1-Q12

Gate status: pass, pass_with_conditions, hold, or fail?

Recommended answer: pass_with_conditions

## Proposed Conditions

- Do not bulk-extend exercise metadata until CP-3 schema-extension dry run passes.
- Do not hand-edit references/external/ for exercise metadata.
- Treat required_skills as legacy/source field until migration is approved.
- R9.1 may proceed only with owned-source registry and blueprint reference repair scope.

## Blocked Until Later

- bulk exercise metadata backfill
- machine registry creation without CLI
- student diagnostics
- adaptive routing
- student-facing AI
- automatic lesson sequencing
- automatic mastery decisions
- summative assessment decisions
