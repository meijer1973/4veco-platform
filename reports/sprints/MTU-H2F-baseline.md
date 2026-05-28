# Sprint MTU-H2F: Baseline

Generated: 2026-05-28

## Plan reference

`reports/sprints/MTU-H2F-plan.md`

## Reviewed Gate

GATE-MTU-H2E closed as PASS WITH CONDITIONS and authorized a bounded CLI
execution sprint for `A12`, `A88`, `A89`, `A90`, `A92`, and `A93`, with
`A20` held.

Reviewed remote commit:

```text
52ffc484b270182964283e20cd696aca6ce5f9e6
```

## Data integrity notes

- `A12` and `A20` are expected to be live before execution.
- `A88`, `A89`, `A90`, `A92`, and `A93` are expected to be absent before
  execution.
- `A20` must not be executed or changed in H2F.
- Protected reference data may change only through the reference CLI; no hand
  edits to `references/machine/` or `references/external/` are allowed.
- Missing generators `GEN_A88`, `GEN_A89`, `GEN_A90`, `GEN_A92`, and
  `GEN_A93` must be recorded as generator-blocked/not-yet-interactive unless
  implemented in a separately reviewed lane.
- No lesson output, target-exercise promotion, candidate writes, or
  student/product use is authorized.
- The pre-existing untracked `knowledge/exit-ticket-game-1.1.1.zip` remains
  outside sprint scope.
