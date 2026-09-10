# Sprint S8: Baseline

## Plan reference

- Plan: `docs/sprints/S8-plan.md`
- Plan metadata: `references/data/sprints/S8.plan.json`
- Roadmap label: Sprint 8 / `S8`

## Current roadmap state

`PV-G4 Lesson Regression Proof` is closed as `pass_with_conditions`. Current conditions remain active: no PV machine promotion, no student-facing PV projection, no adaptive diagnostics, no mastery routing, no sequencing, no student-facing AI, and no summative use.

The reference roadmap lists the misconception registry as the next planned reference sprint. S8 is therefore a planning-to-implementation candidate, but only as an internal diagnostic overlay.

## Existing misconception assets

- `references/schemas/misconception.schema.json` exists, but is minimal: ID, title, unit IDs, optional Dutch description, and optional evidence IDs.
- No `references/data/misconceptions/` registry exists yet.
- No `build-scripts/references/check-misconceptions.js` validator exists yet.
- Existing misconception mentions appear in authored didactics, target-exercise flags, blueprint triage, representation-operation notes, and generated reports.

## Data integrity notes

Protected reference data status: S8 must not hand-edit `references/machine/` or `references/external/`. The planned misconception registry is a governed `references/data/` overlay, not a machine registry and not curriculum authority.

Generated lesson output is out of scope. S8 must not write to `4veco-lessen/`, must not publish student-facing diagnostics, and must not use PV-G4 closure to reopen PV machine promotion or student-facing PV projection.

## Baseline acceptance expectation

The planning bundle should pass before implementation:

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/S8-plan.md
node build-scripts/sprints/check-sprint-bundle.js S8
```
