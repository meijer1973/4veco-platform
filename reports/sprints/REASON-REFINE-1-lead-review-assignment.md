# Lead Review Assignment: REASON-REFINE-1

Generated: 2026-05-31

## Scope

The lead reviewer agent must inspect the REASON-REFINE-1 planning bundle and
decide whether it is safe to close as planning/preparation only.

This is not a request to implement reasoning changes. The reviewer must check
the artifacts against GATE-ENGINE-1 authority, answer-form boundaries, held
lanes, generator-blocked status, and product-use blocks.

## Evidence To Inspect

- `reports/sprints/REASON-REFINE-1-plan.md`
- `reports/sprints/REASON-REFINE-1-baseline.md`
- `reports/sprints/REASON-REFINE-1-planning-review.md`
- `reports/sprints/REASON-REFINE-1-answer-form-integration-plan.md`
- `reports/sprints/REASON-REFINE-1-task-coverage-matrix.md`
- `reports/sprints/REASON-REFINE-1-implementation-prep.md`
- `reports/sprints/REASON-REFINE-1-gate-handoff.md`
- `references/data/sprints/REASON-REFINE-1.plan.json`
- `build-scripts/sprints/check-reason-refine1-evidence.js`
- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/gate-closure.md`
- `reports/sprints/REASON-UX-2-student-route-proof.md`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `reports/json/skilltree-generator-readiness.json`

## Review Plan

| Review/Test | Agent or tool | Required evidence |
|---|---|---|
| Scope and authority | Lead reviewer agent | Bundle authorizes only planning/preparation and blocks implementation, generated output, target-equivalent claims, diagnostics, mastery/sequencing, Scale Gate 1, and product use. |
| Answer-form boundaries | Lead reviewer agent | `A97`, `A98`, and `A99` remain distinct; `A81` is source-use modifier plus underlying answer form; `A96` coordinates with math/graph. |
| Held-lane handling | Lead reviewer agent | Analysis/evaluation, Type 4 motiveer/classificatie, graph lanes, and EX overlays remain held/no-write. |
| Generator exposure | Lead reviewer agent plus checker | `A80`, `A81`, and `A96`-`A99` are verified as generator-blocked/non-interactive. |
| Implementation-prep quality | Lead reviewer agent | Future file owners, validators, rendered-output proof, and gate handoff are concrete enough for later planning. |
| Deterministic validation | `node build-scripts/sprints/check-reason-refine1-evidence.js` and sprint bundle checker | Evidence checker and planned-bundle checker pass. |

## Requested Output

Produce a lead review summary with verdict `PASS`, `PASS WITH FLAGS`,
`REVISE`, `FAIL`, or `PAUSE`.

If the verdict is not PASS, name the blocking findings and required
corrections. If the verdict is PASS WITH FLAGS, name carried flags, owners, and
next actions.
