# GAME-UX-1 Lead Review Round 1

Date: 2026-05-23

Verdict: FAIL

Reviewer: lead reviewer agent

## Findings

- Core shared-engine behavior is mostly in place. `engines/skill-map-engine.js`
  defines scoped surface defaults, aspect filters, compact/route/restricted-full
  handling, local `practiceProgressOnly`, and forced-false boundary flags.
- MTU aspects are exposed without protected reference edits through
  `engines/skilltree/base-elements.js` and deploy bundle data in
  `scripts/deploy.js`.
- Reasoning, procedure/calculation, and graphical consumers have scoped route
  request hooks.
- Default full/all-skill exposure is reduced by compact `skillMapDefaults` in
  the skill-tree shell builder and skill-tree engine.
- Required correction: remaining visible mastery/achievement language existed
  in `engines/skilltree-ui.js`: `Meesterschap!` and `Doel al behaald`.
- Required correction: add focused UI/string coverage so these labels cannot
  regress.
- Required correction: record that mobile, dark-mode, screenshot, and
  keyboard-focus evidence is deliberately deferred to lesson L1.7C because
  GAME-UX-1 does not generate or deploy lesson output.
- Closure metadata remained incomplete at review time:
  `references/data/sprints/GAME-UX-1.result.json` and round-2 review logs were
  not yet recorded.

## Commands Reported By Reviewer

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/GAME-UX-1-plan.md` -> PASS
- `node build-scripts/sprints/check-sprint-bundle.js GAME-UX-1` -> PASS
- `npm.cmd test -- --runInBand engines/tests/skill-map-engine.test.js engines/tests/skilltree-engine.test.js engines/tests/skilltree-data.test.js` -> PASS
- `npm.cmd test -- --runInBand engines/tests/reasoning-engine.test.js engines/tests/procedure-engine.test.js engines/tests/graphical-engine.test.js` -> PASS
- `node build-scripts/references/check-roadmap-version-index.js` -> PASS
- `node build-scripts/reports/validate-report-json.js` -> PASS
- `node build-scripts/sprints/emit-url-index.js --check` -> PASS
- `node build-scripts/sprints/check-sprint-bundle.js GAME-UX-1 --complete` -> FAIL because `references/data/sprints/GAME-UX-1.result.json` was not yet recorded.

## Required Corrections

1. Replace the remaining visible mastery/achievement labels.
2. Add focused visible-copy regression coverage.
3. Explicitly log the DOM/screenshot/focus-order deferral to lesson L1.7C.
4. Record correction, round-2, and result JSON artifacts before complete
   closure validation.
