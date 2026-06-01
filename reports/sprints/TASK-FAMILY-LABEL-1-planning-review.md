# Sprint TASK-FAMILY-LABEL-1: Planning Review

Generated: 2026-06-01

Reviewer: Turing (`019e8507-c39b-72b2-9bb4-229be894ad72`)

## Scope

Reviewed:

- `reports/sprints/TASK-FAMILY-LABEL-1-plan.md`
- `reports/sprints/TASK-FAMILY-LABEL-1-baseline.md`
- `references/data/sprints/TASK-FAMILY-LABEL-1.plan.json`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-contract.md`
- `reports/json/task-family-construction-contract.json`
- prior `TASK-FAMILY-SOURCE-1` runtime sprint pattern

## Round 1 Verdict

REVISE.

Blocking finding: the plan example used `targetRole: "caption"` for a
distractor target while the reviewed target-role enum did not include
`caption`. A faithful implementation would either reject the plan's own
example or silently expand the schema beyond the reviewed rules.

Required correction: change the example target role to an allowed role or add
`caption` to the reviewed enum.

## Correction

The plan was revised so the example distractor target keeps id/label
`caption`, but uses reviewed `targetRole: "structure_part"`.

The plan was also tightened to make planning flags concrete:

- every label and target now requires a non-empty `description`;
- every distractor label and distractor target now requires `distractorFor`;
- checker/test expectations explicitly include accessible descriptions and
  non-ambiguous distractors.

After correction, these commands passed:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-LABEL-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-LABEL-1
```

## Round 2 Verdict

PASS.

Implementation can proceed.

## Carried Planning Flags

| Flag | Implementation handling required |
|---|---|
| Description and distractor intent enforcement | The custom checker must enforce label/target `description` and distractor `distractorFor` rules, not only engine tests. |
| Fixture proof only | Report-fixture proof is acceptable for this runtime sprint; generated-route screenshots remain deferred to later adoption/gate work. |
| Representation proof boundary | `label_placement` proves representation placement only, not full graph/table target-equivalent proof. |

## Operational Next Action

Proceed to implementation. Ensure the custom checker and tests enforce the
three carried planning flags before lead review.
