# Sprint RX.1: Baseline

## Plan reference

`docs/sprints/RX.1-plan.md`

## Starting state

RX.1 starts after S4.1 completed CP-3 condition calibration. CP-3 remains `pass_with_conditions`, so exercise metadata is still overlay-first and bulk metadata backfill remains blocked.

The live A-domain catalog currently runs through `A60`; candidate IDs `A61` through `A84` are provisional only and must be rechecked before any later mutation sprint.

## Source state

- `references/machine/micro-teaching-units.json` is the canonical live unit catalog and is protected.
- `references/external/exam-questions.json` is external authority and is protected.
- `references/authored/course-target-exercises.json` is an authored input for target-exercise evidence; RX.1 must not bulk mutate it.
- `references/data/exercises/graph-spec-representation-plan.json` records the current representation-value plan and still treats operation-registry work as future.
- `references/data/owned-content-graph.json` provides projection context, not curriculum evidence authority.

## Data integrity notes

No protected reference data is allowed to change in RX.1.

RX.1 must not hand-edit:

- `references/machine/`
- `references/external/`

RX.1 must not create a governed machine operation registry or mutate target-exercise sources. The output is an inventory and review packet only.

## Baseline risks

- Some chart-specific candidates may have didactic-prior rationale but thin direct exercise evidence.
- Producer-graph and welfare-graph candidates overlap existing A-domain units and must be held unless a human gate approves otherwise.
- Candidate IDs are placeholders; a later mutation sprint must re-check live numbering.
