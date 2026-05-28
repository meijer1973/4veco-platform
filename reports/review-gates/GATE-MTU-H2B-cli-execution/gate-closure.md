# GATE-MTU-H2B Gate Closure

Date: 2026-05-28

Decision: PARTIAL PASS WITH CONDITIONS.

GATE-MTU-H2B reviewed the Solo q1-q3 CLI execution authorization packet. The
packet may continue toward execution, but the full execution-ready set is not
authorized as written.

This gate itself authorizes no protected reference mutation, external-source
mutation, machine-reference mutation, unit minting, unit update execution, unit
split execution, candidate writes, lesson-output mutation, CP-6/Year-1 closure,
diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, or student/product use.

## Approved After Final Preflight

- `F19`
- `F20`
- `A85`
- `A86`
- `A87`
- `A91`

## Approved Only After Dependency Resolution

- `A92`, because the reviewed `A92` spec depends on `A89`. The next sprint must
  either include and explicitly accept `A89`, revise the `A92` dependency, or
  hold `A92`.

## Conditional Or Revise First

- `A88`, due dependency risk around `A61`.
- `A89`, due dependency risk around `A04` and understand-level generator
  handling.
- `A90`, due mixed table/graph/rule route concerns.
- `A93`, due dependency risk around `A66`/`A61` and price-change/pass-through
  distinction.

## Held

- `A12` update is held until the update spec retains `A2.11` or explicitly
  justifies removing it.
- `A20` update/split is held because active target exercise `4.1.2` uses `A20`
  in a given-MK context.

## Required Before Any Execution

1. Run `git status --short`.
2. Run a fresh ID collision check for `F19`, `F20`, and `A85-A93`.
3. Confirm `A12` and `A20` still exist.
4. Echo the extracted JSON spec before each dynamic CLI command.
5. Prove the plan JSON is unchanged from the reviewed commit or revalidate it.
6. Confirm `A20` is not executed.
7. Exclude `A12` unless its update spec retains `A2.11` or a later gate
   authorizes removal.
8. Resolve the `A92`/`A89` dependency before executing `A92`.
9. Run post-execution build-unit-index, schema, report, reference-health, Jest,
   and git diff checks.

## Operational Next Action

Start `MTU-H2C` as a reduced-scope Solo q1-q3 CLI execution preflight/sprint.
Do not execute H2B as-is. `A12` and `A20` remain held unless a later reviewed
packet resolves them.
