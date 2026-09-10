# Sprint PV.3: Baseline

## Plan reference

Plan: `docs/sprints/PV.3-plan.md`

## Baseline state

PV.2 completed the schema and validator MVP. Before PV.3, the real PV registries existed but were intentionally empty:

- `references/data/procedure-visual/procedure-templates.json`
- `references/data/procedure-visual/visual-states.json`
- `references/data/procedure-visual/unit-template-links.json`

PV.1 identified 12 ranked pilot templates, and PV.3 is the first sprint allowed to add real pilot records under `references/data/procedure-visual/`.

## Data integrity notes

Protected reference data remains unchanged at baseline. PV.3 must not hand-edit `references/machine/` or `references/external/`, must not create PV machine registries, and must not mutate authored source files, generated lesson targets, or RAG chunks.

Student-facing PV projection, diagnostics, adaptive routing, AI, automatic sequencing, mastery decisions, and summative use are not authorized.

## Baseline risks

- The existing validator still had PV.2 wording and empty-registry expectations before this sprint.
- Pilot templates may reference only provisional `exercise_operations` under CP-4 conditions.
- Any generator-blocked unit must remain non-interactive even if linked to a PV pilot template.
