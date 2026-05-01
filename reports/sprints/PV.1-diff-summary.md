# Sprint PV.1: Diff Summary

## Summary

PV.1 adds the first Procedure-Visual inventory and reports. It is an inventory layer only: no machine registry, no protected-source mutation, and no student-facing projection.

## Added

- `build-scripts/references/build-procedure-visual-inventory.js`
- `build-scripts/references/check-procedure-visual-inventory.js`
- `references/data/procedure-visual/inventory.json`
- `reports/json/procedure-visual-inventory.json`
- `reports/markdown/procedure-visual-inventory.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.20-cp4-skill-operation-gate-closed.md`
- PV.1 sprint plan, baseline, result, diff summary, and sprint metadata

## Updated

- Roadmap version moved to `v2.21-pv1-procedure-visual-inventory`.
- Sprint ledger marks PV.1 completed and PV.2 as the next open sprint.
- Roadmap version index now archives v2.20 and points active work to v2.21.

## Protected surfaces

No protected reference surfaces were changed.

PV.1 did not modify:

- `references/machine/`
- `references/external/`

## Boundary

The Procedure-Visual inventory remains a governed `references/data/` planning overlay:

- `machine_registry_created: false`
- `protected_reference_data_changed: false`
- `student_facing_projection_authorized: false`
- provisional operation references only, under CP-4 conditions

PV.1 does not authorize procedure templates, visual states, renderers, student diagnostics, adaptive routing, AI, sequencing, mastery decisions, or summative use.
