# Sprint Y1-GOLDEN-ROLLOUT-WAVE-1: Diff Summary

## Summary

This sprint adds a first-three Golden workflow availability guard. It records
the current Year 1 Golden rollout wave as exactly the six current first-three
split check surfaces and validates that the existing rendered product-path proof
still supports workflow availability without authorizing downstream product or
scale claims.

## Implementation files

- Added `references/data/exercises/y1-golden-rollout-wave-1.json`.
- Added `build-scripts/sprints/check-y1-golden-rollout-wave-1.js`.
- Added `check:y1-golden-rollout-wave-1` to `package.json`.
- Added a platform CI step for the new checker.

## Evidence files

- Added sprint plan, baseline, quality log, evidence map, result, diff summary,
  command log, proof JSON, and review packet.
- Added plan-review evidence showing the plan was approved before
  implementation.

## Roadmaps

- Added and completed the `Y1-GOLDEN-ROLLOUT-WAVE-1` active roadmap row in
  `references/reference-team-roadmap.md`.
- Updated the Golden Workbench rollout roadmap current-gate state to name this
  rollout-control wave and the still-held Scale Gate 1 boundary.

## Protected surfaces

Protected surfaces were not changed:

- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `source-data/book-1/exit-ticket/`
- `engines/`
- generated Book 1 lesson output in `../4veco-lessen`

## Authority boundary

The diff does not authorize product-route adoption, diagnostics,
mastery/sequencing, PV, summative use, Scale Gate 1 closure, broad product use,
student/product use, or target-equivalent completion language.
