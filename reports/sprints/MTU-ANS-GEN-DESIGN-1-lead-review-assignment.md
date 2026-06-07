# Lead Review Assignment

Sprint: `MTU-ANS-GEN-DESIGN-1`

Generated: 2026-06-07

## Scope

Artifact/task: answer-form generator/proof design for `A80`, `A81`, and
`A96`-`A99`.

Lead reviewer: lead-review agent.

Evidence to inspect:

- `reports/sprints/MTU-ANS-GEN-DESIGN-1-plan.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-baseline.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-generator-proof-design.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-implementation-handoff.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-verification-review.md`
- `build-scripts/references/check-mtu-answerform-generator-design.js`
- `reports/json/skilltree-generator-readiness.json`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-command-log.jsonl`

## Review Questions

1. Does the design cover all six answer-form/source-use units?
2. Does it preserve the generator-blocked no-exposure boundary?
3. Does it correctly treat `A81` as modifier-only with an underlying answer form?
4. Does it keep `A99` held until live evidence exists?
5. Does it avoid shallow generic skill-tree randomizer implementation?
6. Does the implementation handoff name the right proof artifacts for a later sprint?
7. Are diagnostics, mastery/sequencing, Scale Gate 1, product-route adoption,
   and student/product authority still blocked?

## Expected Outputs

- `reports/sprints/MTU-ANS-GEN-DESIGN-1-lead-review-round1.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-lead-review-corrections.md`
- `reports/sprints/MTU-ANS-GEN-DESIGN-1-lead-review-round2.md`

## Required Next Action

Run lead-review round 1. If the verdict is REVISE, FAIL, or PAUSE, apply or
record the required correction before round 2. Only proceed to closure if
round 2 returns PASS or PASS WITH FLAGS.
