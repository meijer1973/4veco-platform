# Sprint REASON-ADOPT-1: Diff Summary

Generated: 2026-06-02

## Platform Diff

Tracked source/test changes:

- `engines/reasoning-ui.js`
- `engines/tests/reasoning-ui.test.js`

New sprint artifacts:

- `build-scripts/sprints/check-reason-adopt1-route-output.js`
- `build-scripts/sprints/capture-reason-adopt1-screenshots.js`
- `references/data/sprints/REASON-ADOPT-1.plan.json`
- `reports/json/reason-adopt1-proof.json`
- `reports/sprints/REASON-ADOPT-1-baseline.md`
- `reports/sprints/REASON-ADOPT-1-lead-review-assignment.md`
- `reports/sprints/REASON-ADOPT-1-plan.md`
- `reports/sprints/REASON-ADOPT-1-planning-review.md`
- `reports/sprints/REASON-ADOPT-1-playable-proof.md`
- `reports/sprints/REASON-ADOPT-1-screenshot-manifest.md`
- `reports/sprints/REASON-ADOPT-1-screenshots/`

## Lesson Generated Diff

Remaining generated lesson diffs after restoring unrelated deploy side effects:

- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-engine.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-ui.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell-engine.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell-ui.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell.css`

Unrelated deploy side effects restored:

- `Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket-ui.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/graphical-ui.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/skilltree-ui.js`

## Boundary Notes

- Protected surfaces: no protected reference data changed.
- No source reasoning CSV edits.
- No source exit-ticket data edits.
- No protected reference edits in `references/machine/` or
  `references/external/`.
- No target-exercise field writes.
- No candidate storage writes.
- No target-equivalent, diagnostics, mastery, sequencing, Scale Gate 1, or
  product-use authority.

## Diff Checks

- `git diff --check`: PASS
- `git -C ../4veco-lessen diff --check`: PASS
