# Sprint MTU-H3C: Baseline

Generated: 2026-05-28

Plan: `reports/sprints/MTU-H3C-plan.md`

## Remote And Worktree Baseline

- `HEAD`: `1c52050f81de60fd57473f3600159315b7c3f530`
- `origin/main`: `1c52050f81de60fd57473f3600159315b7c3f530`
- Worktree status before planning: clean except pre-existing untracked
  `knowledge/exit-ticket-game-1.1.1.zip`.
- Reviewed H3B remote commit: `ad7d69c3836176a10111384aeb640d49e93b705d`.

## Authorization Baseline

`reports/review-gates/GATE-MTU-H3B-incidence-cli-execution/gate-closure.json`
closed as `pass_with_conditions` and authorized `MTU-H3C` bounded execution.

Authorized lanes:

- `unit-add D41`
- `unit-add D42`
- `unit-add D43`
- `unit-add D45`
- `unit-add D46`
- `unit-update D07` after dry-run
- exact authored mapping patches for `3.1.1`, `3.1.2`, and `3.1.3`
- generated projection refresh only after authorized source mutations

Held lane:

- `D44` remains held and unmapped.

## Unit Baseline

Live units required before execution:

| Unit | Baseline status |
|---|---|
| `D07` | live; name `Heffing doorberekenen in prijs`; needs `D05`, `A15`; kern mentions percentage |
| `D05` | live prerequisite for tax/equilibrium context |
| `A38` | live prerequisite for percentage change calculation |
| `A41` | live prerequisite for subsidy supply-function route |
| `A93` | live price percentage-change unit; remains bounded from pass-through share |
| `A15` | live numeric demand elasticity prerequisite for `D45` |

Absent units before execution:

- `D41`
- `D42`
- `D43`
- `D44`
- `D45`
- `D46`

## Target-Exercise Baseline

`3.1.1` currently requires:

```json
["A06", "A23", "A41", "D05", "D07"]
```

`3.1.2` currently requires:

```json
["A10", "A19", "A23", "A32", "A40", "D03", "D07"]
```

`3.1.3` currently requires:

```json
["A06", "A10", "A19", "A27", "A41", "D19", "D29"]
```

All three records currently have `record_status:
migrated_from_v4_needs_v5_review` and source refs tied to their same paragraph
IDs. Those metadata fields must not change.

## Stop Conditions Carried Into H3C

- Stop if `D41`, `D42`, `D43`, `D45`, or `D46` already exists before execution.
- Stop if `D44` exists or appears in the command set.
- Stop if `D07`, `D05`, `A38`, `A41`, `A93`, or `A15` is missing.
- Stop if `D07` dry-run retains `A15` or hidden elasticity explanation.
- Stop if `D42` depends on `D41`.
- Stop if `D45` hides the supply-elasticity boundary.
- Stop if `A93` is modified or generalized into pass-through share.
- Stop if mapping changes differ from reviewed arrays or alter promotion/status/source metadata.
- Stop if projection refresh happens before source mutation.
- Stop if lesson output, PV projection, PV machine promotion, diagnostics,
  adaptive routing, mastery/sequencing, student-facing AI, summative use, or
  student/product use is attempted.
