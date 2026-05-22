# Sprint EX-2: Diff Summary

## Summary

EX-2 records the GATE-EX2 human-review decision and closes the gate as
`pass_with_conditions` for classification and routing only.

## Added gate closure evidence

- `human-interview.md` and `human-interview.json` preserve the eight recorded
  human answers after the full planned question list was shown.
- `gate-closure.md` and `gate-closure.json` record the final classification
  table, carried conditions, blocked outcomes, and allowed next sprint.

## Classification changes recorded

- q3 keeps the calculation as `operation_registry_need`, adds `A61` as
  source-reading support, and marks `A15` stale/incorrect for this task.
- q3 answer wording is `answer_skill_need`.
- q19 keeps `q19-source-annex-gap` and `q19-graph-object-gap` blocking.
- q19 graph routing adds `A42`, keeps `D10` support, and downgrades `A45` to
  weak support.
- q19 reasoning remains provisional `operation_registry_need`.
- q15 content maps to `D27`, `F03`, and `F09` for content coverage only.
- q15 answer-model structure remains `answer_skill_need`.

## Validator changes

- `check-exam-to-mtu-mapping-gate.js` now validates optional gate-closure
  artifacts when they exist, including the q3 `A61` correction, q19 `A42`
  correction, q19 blocking gaps, q3/q15 answer-skill needs, and no-mutation
  boundaries.

## Protected surfaces

No protected reference data changed. The sprint did not edit
`references/external/`, `references/machine/`, authored target exercises, owned
blueprints, or lesson output.

## Closure boundary

EX-2 does not close CP-6 or Year 1. It does not authorize unit minting,
operation-registry mutation, answer-skill mutation, target-exercise promotion,
placeholder finalization, lesson-output mutation, diagnostics, adaptive
routing, mastery, sequencing, student-facing AI, summative use, PV projection,
PV machine promotion, or student-facing output.

## Next step

Complete the lead-review round, correction pass, recheck, final validations,
repository-map refresh, commit, tag, and push. Then start EX-3 as a bounded
dashboard/reporting sprint.
