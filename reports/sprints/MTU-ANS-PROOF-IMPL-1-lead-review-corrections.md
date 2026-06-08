# Lead Review Corrections: MTU-ANS-PROOF-IMPL-1

Generated: 2026-06-08

## Sprint

Sprint: `MTU-ANS-PROOF-IMPL-1`

## Round-1 Verdict

Round 1 returned REVISE.

## Correction Record

| Round-1 finding | Correction applied | Evidence |
|---|---|---|
| Rendered proof hid too much of the A96 answer form inside generic work entry. | Added bounded shared-shell family `calculation_answer_form_capture` with visible formula/method builder, labelled substitution fields, final answer, unit/notation, and contextual conclusion. | `engines/task-shell-engine.js`; `engines/task-shell-ui.js`; `engines/task-shell.css`; `reports/sprints/MTU-ANS-PROOF-IMPL-1-rendered-lab.html` |
| Formula/method selection needed distractors and must not be solved by left-to-right clicking. | Added an out-of-answer-order token bank with plausible distractors and checker proof that the display order is not the accepted token sequence. | `build-scripts/sprints/mtu-ans-proof-impl1-a96-data.js`; `build-scripts/sprints/check-mtu-ans-proof-impl1-a96.js`; `reports/json/mtu-ans-proof-impl1-a96-proof.json` |
| The repeated `oude prijs` concept needed one reusable visible token, not visually identical hidden correct tokens. | Represented `oude prijs` as one answer token with `maxUses: 2` and added an invalid fixture that rejects visually identical answer labels backed by distinct IDs. | `build-scripts/sprints/mtu-ans-proof-impl1-a96-data.js`; `engines/task-shell-engine.js`; `reports/sprints/MTU-ANS-PROOF-IMPL-1-screenshots/manifest.json` |
| Negative proof needed v3 fixture coverage beyond final-answer-only. | Added checker/test coverage for source-only, direction-free, example-only, notation omission, standalone-A81, wrong denominator, missing substitution, left-to-right token order, and duplicate-hidden-token policy. | `engines/tests/task-shell-engine.test.js`; `engines/tests/task-shell-ui.test.js`; `build-scripts/sprints/check-mtu-ans-proof-impl1-a96.js` |
| Screenshots and DOM proof needed to show the corrected structured surface. | Regenerated initial, retry-feedback, next-action, completed, mobile, and dark-mode screenshots; manifest proves zero old work fields, four answer-form steps, eleven token buttons, three substitution fields, final-answer field, notation field, and conclusion field. | `build-scripts/sprints/capture-mtu-ans-proof-impl1-screenshots.js`; `reports/sprints/MTU-ANS-PROOF-IMPL-1-screenshot-manifest.md`; `reports/sprints/MTU-ANS-PROOF-IMPL-1-screenshots/` |

## Recheck Evidence

Recheck commands to be recorded in the sprint command log:

```bash
node build-scripts/sprints/run-sprint-command.js MTU-ANS-PROOF-IMPL-1 -- node build-scripts/sprints/capture-mtu-ans-proof-impl1-screenshots.js
node build-scripts/sprints/run-sprint-command.js MTU-ANS-PROOF-IMPL-1 -- node build-scripts/sprints/check-mtu-ans-proof-impl1-a96.js
node build-scripts/sprints/run-sprint-command.js MTU-ANS-PROOF-IMPL-1 -- npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js
node build-scripts/sprints/run-sprint-command.js MTU-ANS-PROOF-IMPL-1 -- npx.cmd jest --runInBand engines/tests/task-shell-ui.test.js
```

The corrected visual artifacts were inspected directly after recapture. The
desktop and mobile completed screenshots now display the structured formula,
substitution, final answer, notation, and conclusion fields, and the mobile
dark completed screenshot shows the active dark theme.

## Round-2 Readiness

Round 2 may inspect the corrected capture harness, screenshot manifest, proof
JSON, desktop/mobile/dark screenshots, and command log. The remaining closure
work is to rerun the full acceptance suite and verify the complete sprint
bundle.
