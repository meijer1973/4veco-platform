# Sprint MTU-H3B: Baseline

Generated: 2026-05-28

## Plan reference

Plan: `reports/sprints/MTU-H3B-plan.md`

## Source authorization

`reports/review-gates/GATE-MTU-H3A-incidence-cli-mutation-plan/gate-closure.json`
closed as `pass_with_conditions` and authorized only `MTU-H3B` execution-packet
preparation. It did not authorize `D07` mutation, `D41`-`D46` minting,
target-exercise mutation, projection refresh, lesson output, or product use.

## Baseline evidence

- `D07` is live and still broad: needs `D05` and `A15`, calculates consumer
  tax pass-through percentage, includes producer burden remainder, and still
  contains elasticity explanation.
- `D41`, `D42`, `D43`, `D44`, `D45`, and `D46` are absent before any later
  execution.
- `A93` is live and remains bounded to percentage price change, explicitly
  distinguishing that calculation from pass-through share.
- Target exercise `3.1.1` still lists `D07` even though the task asks for a tax
  wedge graph and `Pc`/`Pp` labeling.
- Target exercise `3.1.2` still lists `D07` for both burden amount and
  afwentelingspercentage work.
- Target exercise `3.1.3` has subsidy equilibrium, effective prices, welfare
  and subsidy-cost work, but no dedicated subsidy incidence unit.

## Data integrity notes

No protected reference data is changed by the sprint baseline. `references/machine/`
and `references/external/` are read-only evidence. `references/authored/course-target-exercises.json`
is read-only evidence until a later execution sprint is explicitly authorized.
The pre-existing untracked `knowledge/exit-ticket-game-1.1.1.zip` is unrelated
and must remain untouched.

## Stop conditions carried into H3B

- Stop if the remote branch has not been updated before review-packet
  publication.
- Stop if `D42` depends on `D41` without explicit review approval.
- Stop if `D45` hides supply-elasticity status.
- Stop if `D07` keeps `A15` or elasticity explanation.
- Stop if `D44` is minted or mapped without target evidence.
- Stop if target-exercise mapping writes are treated as generated projections
  or promotion.
