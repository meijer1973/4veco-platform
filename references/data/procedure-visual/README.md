# Procedure-Visual Overlay

Status: `planned_overlay`

The Procedure-Visual layer starts here as governed `references/data/` material. It is not a `references/machine/` registry yet.

Purpose: store student-visible reasoning procedures, visual states, and representation-specific operation sequences so explanation prose, answer models, procedure games, graph stages, formula traces, and surface-specific visuals can align around the same instructional data.

Planned files after PV.1/PV.2:

```text
procedure-template.schema.json
visual-state.schema.json
visual-grammar.schema.json
procedure-templates.json
visual-states.json
unit-template-links.json
procedure-visual-vocab.json
```

Boundary:

- PV records may reference provisional `exercise_operations` only after CP-4 records the PV.0 decision.
- No PV file in this folder is curriculum authority by itself.
- No PV file authorizes student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative use.
- Do not create `references/machine/procedure-templates.json` or `references/machine/visual-states.json` until schema, CLI, validators, mutation logs, reports, lesson regressions, and a human promotion gate exist.
