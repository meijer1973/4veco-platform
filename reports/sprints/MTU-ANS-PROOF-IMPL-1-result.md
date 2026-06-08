# Sprint MTU-ANS-PROOF-IMPL-1: Result

Generated: 2026-06-08

Verdict: PASS.

## Plan reference

Plan: `reports/sprints/MTU-ANS-PROOF-IMPL-1-plan.md`

## Summary

`MTU-ANS-PROOF-IMPL-1` closed as a bounded route-specific A96
answer-form proof sprint.

The sprint implemented a review-only shared task-shell lab tied to the reviewed
`1.1.2` fietsprijs calculation prompt. The proof task uses the bounded
`calculation_answer_form_capture` shared-shell family and visibly requires all
six A96 answer-action parts: formula/method, labelled substitution,
intermediate work, final answer, required percent notation, and a short
contextual conclusion.

The checker proves that final-answer-only, source-only, direction-free,
example-only, notation-omission, wrong-denominator, missing-substitution,
left-to-right token-order, visually identical duplicate old-price token, and
standalone-A81 responses cannot pass. The rendered proof includes initial,
retry-feedback, next-action, completed, mobile, and mobile dark-mode
screenshots. Lead review round 1 returned REVISE for the too-hidden answer-form
surface; the correction log records the structured-form implementation and
v3 fixture fixes, and round 2 returned PASS.

No `GEN_A96` generator was added. `A96` was not exposed as a generic
`ROUTE_SKILLS` row. `A81` remains modifier-only, and `A99` remains blocked.
No generated lesson output, source-data, protected reference data, product-route
adoption, target-equivalent authority, diagnostics, mastery, sequencing, PV
projection, Scale Gate 1, or student/product use is authorized by this sprint.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-ANS-PROOF-IMPL-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js MTU-ANS-PROOF-IMPL-1` | passed |
| `npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js` | passed |
| `npx.cmd jest --runInBand engines/tests/task-shell-ui.test.js` | passed |
| `node build-scripts/sprints/capture-mtu-ans-proof-impl1-screenshots.js` | passed |
| `node build-scripts/sprints/check-mtu-ans-proof-impl1-a96.js` | passed |
| `node build-scripts/references/check-mtu-answerform-generator-design.js` | passed |
| `node build-scripts/references/check-skilltree-generator-readiness.js` | passed |
| `node build-scripts/references/check-mtu-evidence-layer.js` | passed |
| `npm.cmd run check:platform` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `npm.cmd run agent:index` | passed |
| `node build-scripts/sprints/emit-url-index.js` | passed |
| `npm.cmd run dashboard:internal` | passed |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/MTU-ANS-PROOF-IMPL-1-result.md` | passed |
| `node build-scripts/sprints/check-sprint-command-log.js MTU-ANS-PROOF-IMPL-1` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js MTU-ANS-PROOF-IMPL-1 --complete` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `git diff --check` | passed |

## Changed files

Implementation and tests:

- `build-scripts/sprints/mtu-ans-proof-impl1-a96-data.js`
- `build-scripts/sprints/capture-mtu-ans-proof-impl1-screenshots.js`
- `build-scripts/sprints/check-mtu-ans-proof-impl1-a96.js`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/tests/task-shell-engine.test.js`
- `engines/tests/task-shell-ui.test.js`

Sprint proof and governance artifacts:

- `reports/sprints/MTU-ANS-PROOF-IMPL-1-plan.md`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-baseline.md`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-planning-review.md`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-rendered-lab.html`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-screenshot-manifest.md`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-screenshots/`
- `reports/json/mtu-ans-proof-impl1-a96-proof.json`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-lead-review-assignment.md`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-lead-review-round1.md`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-lead-review-corrections.md`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-lead-review-round2.md`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-result.md`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-diff-summary.md`
- `references/data/sprints/MTU-ANS-PROOF-IMPL-1.plan.json`
- `references/data/sprints/MTU-ANS-PROOF-IMPL-1.result.json`
- `references/reference-team-roadmap.md`
- repository map, URL index, internal dashboard, and command-log refreshes
  required for normal sprint closure

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` remain untouched.

No target-exercise registry fields were written. No source-data under
`source-data/book-1/exit-ticket/` was changed. No generated lesson output under
`../4veco-lessen/` was changed. No `engines/skilltree/base-elements.js` or
`engines/skilltree/generators.js` changes were made, and no `GEN_A96`
implementation exists.

## Open follow-ups

- Owner note after v3 review: A96 is improved enough to merge as bounded proof
  and handoff evidence for another team, but it is not yet sufficient for
  generated exercises, product-route adoption, target-equivalent reliance, or
  student/product use.
- A future human-reviewed route-adoption sprint is still required before this
  A96 proof can support generated lesson output, product-route adoption, or
  target-equivalent reliance.
- A future generator-design/implementation sprint would be required before any
  general `GEN_A96` generator exists.
- `A80`, `A81`, `A97`, `A98`, and `A99` remain outside this sprint except for
  non-regression checks; `A81` remains modifier-only and `A99` remains blocked.

## Rollback instructions

Before commit, revert only the MTU-ANS-PROOF-IMPL-1 sprint proof data, capture
script, checker, focused test addition, rendered lab, screenshots, proof JSON,
lead-review/result/diff artifacts, plan/result metadata, roadmap ledger row,
and generated closure maps/logs from this sprint. After commit, revert the
sprint commit. Do not revert unrelated user work, protected references,
source-data, generated lesson output, or prior sprint records.
