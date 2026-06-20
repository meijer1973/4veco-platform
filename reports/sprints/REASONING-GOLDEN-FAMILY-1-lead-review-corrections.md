# GOAL-REASONING-GOLDEN-FAMILY-1 Lead Review Corrections

Generated: 2026-06-20

## Correction Plan

Round 1 and specialist review returned REVISE. Required corrections:

| Finding | Correction |
|---|---|
| Missing review and human-gate artifacts | Add specialist review, lead-review round 1, corrections, lead-review round 2, result, and `reports/review-gates/GATE-REASONING-GOLDEN-FAMILY-1/human-review-packet.md`. |
| Authority drift accepted by composer | Require `authority` and assert all restricted flags remain false in `ReasoningComposer.validateComposition()`. Add Jest regression. |
| Missing gate checker | Add `build-scripts/sprints/check-gate-reasoning-golden-family-1.js` and wire it into `npm run check:reasoning-golden`. |
| Validators manual-only | Add npm scripts and CI step for reasoning-golden guardrails. |
| Next-action proof not explicit | Add `answer_preview`, `next_action`, and `keyboard_focus` screenshot states; make gallery checker require them. |
| Correct-only answer row could pass | Require at least one local distractor per functional answer row; add Jest regression. |
| Graph construction allowed outside graph archetype | Ban `graph_construction_substitute` in reasoning-game compositions globally; add Jest regression. |
| Blind-transfer path broken | Record the actual lesson paragraph path with en dash and make gallery checker assert the path exists. |

## Correction Evidence

Completed corrections:

- `engines/reasoning-composer.js` now requires `authority` and rejects any
  restricted flag set to true.
- `engines/reasoning-composer.js` now rejects
  `graph_construction_substitute` in every reasoning-game composition.
- `engines/task-shell-engine.js` now requires at least one local distractor in
  every `functional_answer_builder` answer row.
- `build-scripts/exemplars/reasoning-golden-family-data.js` records the actual
  blind-transfer lesson source path with the en dash used in the filename.
- `build-scripts/sprints/check-reasoning-golden-family-gallery.js` verifies the
  blind-transfer source path exists.
- `build-scripts/exemplars/capture-reasoning-golden-family-screenshots.js` now
  captures eight states per composition: initial, partial, wrong/retry,
  correct, answer preview, next action, mobile dark correct, and keyboard
  focus.
- `build-scripts/sprints/check-reasoning-golden-family-gallery.js` now requires
  visible answer-preview and next-action proof.
- `package.json` exposes reasoning-golden scripts, including the explicit
  screenshot refresh command.
- `.github/workflows/platform-ci.yml` runs `npm run check:reasoning-golden`.
- `build-scripts/sprints/check-gate-reasoning-golden-family-1.js` was added as
  the final gate validator referenced from policy traceability.

Validation completed before lead-review round 2:

- `npm.cmd run check:reasoning-golden:exemplars` passed.
- `npm.cmd run check:reasoning-golden:skill` passed.
- `npm.cmd run check:reasoning-golden:gallery` passed.
- `npx.cmd jest engines/tests/reasoning-composer.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js --runInBand` passed with 84 tests.
- `node build-scripts/exemplars/capture-reasoning-golden-family-screenshots.js`
  captured 40 screenshot states.

Pending before final gate:

- record lead-review round 2 verdict;
- create final human review packet;
- run `npm.cmd run check:reasoning-golden` including the new gate checker.
