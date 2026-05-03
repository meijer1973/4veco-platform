# GATE-RX6-skilltree-generator-integration: Technical Closure

Sprint: `RX.6`
Status: `pass_with_conditions`

RX.6 completed skill-tree generator integration by separating generator-backed interactive nodes from explicit non-interactive generator-blocked catalog units.

## Outputs

- `reports/json/skilltree-generator-readiness.json`
- `reports/markdown/skilltree-generator-readiness.md`
- `references/data/sprints/RX.6-generator-blocked-units.json`

## Summary

- Active A-domain units: 81
- Interactive skilltree units: 44
- Generator-blocked units: 37
- Untracked missing generators: 0
- Deployed blocked rows: 37

## Conditions

- Keep generator-blocked A-domain units non-interactive until their generators exist and validate.
- Do not expose generator-blocked units in student-facing skill-tree or PV projection.
- Do not authorize diagnostics, adaptive routing, AI, sequencing, mastery, or summative use.
- Remove a unit from the generator-block list only through a later validated generator sprint.
