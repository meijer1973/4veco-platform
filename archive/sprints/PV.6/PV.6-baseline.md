# Sprint PV.6: Baseline

## Plan reference

Plan: `docs/sprints/PV.6-plan.md`

## Current state

PV.5 proves report-side rendering with 28 SVG projection proof artifacts. The proof report is not yet summarized in `reference-health`.

Existing `reference-health` covers units, graphs, QC issues, retrieval, and blocked downstream uses, but it does not yet include a Procedure-Visual coverage summary.

## Data integrity notes

No protected reference data changes are allowed in PV.6. The sprint must not hand-edit `references/machine/` or `references/external/`, must not create PV machine registries, must not mutate authored source files or RAG chunks, and must not touch lesson repositories.

## Baseline risks

- A dashboard summary could be mistaken for curriculum authority unless explicit policy flags are carried into the report.
- Generator-blocked units must remain visible as blocked.
- PV coverage is pilot coverage, not full curriculum coverage.
- Student-facing PV projection remains blocked.
