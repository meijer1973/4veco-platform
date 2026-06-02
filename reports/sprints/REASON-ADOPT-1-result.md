# Sprint REASON-ADOPT-1: Result

Generated: 2026-06-02

Verdict: PASS WITH FLAGS

## Plan reference

Plan: `reports/sprints/REASON-ADOPT-1-plan.md`

## Summary

`REASON-ADOPT-1` adopted the `REASON-STD-1` wrapped standard-family reasoning
tasks into the generated Book 1 reasoning route.

Implemented:

- mode 0 `Stappen ordenen` now renders and plays through shared
  `step_ordering`;
- mode 1 `Deelvragen opbouwen` now renders and plays through shared
  `step_ordering` as a `claim_reason_evidence` bridge;
- mode 3 `Stroomdiagram bouwen` now renders and plays through shared
  `step_ordering` as an ordered-chain bridge;
- mode 5 `Redeneerantwoord opbouwen` remains shared `structured_reasoning` and
  self-check only;
- modes 2 and 4 remain held/private/refactor-scoped.

The generated Book 1 route was redeployed through `scripts/deploy.js`; unrelated
deploy side effects were restored, leaving only shared reasoning/task-shell
generated diffs.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/REASON-ADOPT-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js REASON-ADOPT-1` | passed |
| `npx.cmd jest --runInBand engines/tests/reasoning-engine.test.js engines/tests/reasoning-ui.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js` | passed, 123 tests |
| `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `git -C "../4veco-lessen" diff --name-only` | passed after unrelated deploy side effects were restored |
| `node build-scripts/sprints/check-reason-adopt1-route-output.js` | passed |
| `node build-scripts/sprints/capture-reason-adopt1-screenshots.js` | passed, 5 screenshots |
| `npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `git diff --check` | passed |
| `git -C ../4veco-lessen diff --check` | passed |

## Changed files

Platform:

- `engines/reasoning-ui.js`
- `engines/tests/reasoning-ui.test.js`
- `build-scripts/sprints/check-reason-adopt1-route-output.js`
- `build-scripts/sprints/capture-reason-adopt1-screenshots.js`
- `reports/sprints/REASON-ADOPT-1-*`
- `reports/json/reason-adopt1-proof.json`
- `references/data/sprints/REASON-ADOPT-1.plan.json`
- `references/data/sprints/REASON-ADOPT-1.result.json`

Generated lesson output:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-engine.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-ui.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell-engine.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell-ui.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell.css`

Evidence:

- `reports/sprints/REASON-ADOPT-1-playable-proof.md`
- `reports/json/reason-adopt1-proof.json`
- `reports/sprints/REASON-ADOPT-1-screenshot-manifest.md`
- `reports/sprints/REASON-ADOPT-1-screenshots/manifest.json`
- `reports/sprints/REASON-ADOPT-1-screenshots/*.png`
- `reports/sprints/REASON-ADOPT-1-diff-summary.md`
- `reports/sprints/REASON-ADOPT-1-planning-review.md`
- `reports/sprints/REASON-ADOPT-1-lead-review-round1.md`
- `reports/sprints/REASON-ADOPT-1-lead-review-corrections.md`
- `reports/sprints/REASON-ADOPT-1-lead-review-round2.md`

## Lead Review

Planning review:

- initial verdict: REVISE
- final status after corrections: PASS

Structural lead review:

- round 1: PASS WITH FLAGS
- round 2: PASS WITH FLAGS

## Carried Flags

1. Dual feedback remains controlled but is still UX debt: local task-shell
   feedback plus global reasoning summary/next-action.
2. Mobile route panel remains visible but too low after long checked tasks.
3. Dark-mode proof clears mode-5 task-shell/self-check only; route-panel
   contrast remains flagged.
4. Capture automation checks task family, feedback state, and next action; manual
   screenshot review remains needed for feedback-region count, route placement,
   and contrast.
5. Mode 3 is still an ordered-chain bridge, not full visual flow-diagram
   construction.
6. Modes 2 and 4 remain held/refactor-scoped.
7. This remains route-adoption proof only, not target-equivalent or product
   authority.

## Authority Boundary

This sprint does not authorize target-equivalent reasoning claims, completion
language, diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use.

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` remain untouched.

No source reasoning CSV changed. No source exit-ticket data changed. No
target-exercise registry fields were written. No answer-skill candidate
storage was created or written. Generated Book 1 lesson output changed only
through `scripts/deploy.js` and was scoped to shared reasoning/task-shell files
after unrelated deploy side effects were restored.

## Open follow-ups

- `REASON-PLAY-1`: run usability-agent tests against the playable reasoning
  route and repair unclear goal/control/feedback/next-action behavior.
- `REASON-ANSWERFORM-2`: connect reasoning practice to answer-form and
  source-use scaffolds, including decisions for modes 2 and 4.
- `GATE-REASON-STD-1`: direct-comment human evidence gate with playable output,
  screenshots, validators, usability-agent traces, and carried flags.
- Full visual flow-diagram construction remains follow-up work beyond this
  ordered-chain bridge.
- Target-equivalent reasoning readiness remains blocked until a later reviewed
  gate explicitly authorizes it.

## Rollback instructions

Before commit, revert only the `REASON-ADOPT-1` reasoning UI/test changes,
generated Book 1 shared reasoning/task-shell output, sprint artifacts,
checker/capture scripts, screenshot proof, repository maps, URL index, and
dashboard refreshes from this sprint.

After commit, revert the sprint commit(s). Do not revert REASON-STD-1, earlier
reasoning/task-family work, protected-reference data, source reasoning CSVs,
source exit-ticket data, or human-gate artifacts.

## Next Action

Proceed to `REASON-PLAY-1` or the next named reasoning sprint. Do not start
`GATE-REASON-STD-1` until the remaining reasoning sprints have produced their
evidence package and pre-gate lead review.
