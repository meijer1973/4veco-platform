# GOAL-REASONING-GOLDEN-FAMILY-1 Result

Generated: 2026-06-20

## Summary

Implemented the reasoning-game golden family adoption package as durable
repository capability, not merely stored prototypes.

Implemented:

- versioned golden-exemplar library with manifest, hashes, schema, package
  origin, catalog entry, policy traceability, and change notes;
- cross-exemplar product standard, transfer matrix, and reasoning archetype
  decision tree;
- dedicated `skills/econ-reasoning-game.md` plus checklist, archetypes, and
  prompt template;
- routing from `skills/econ-companion-artifacts.md` and `AGENTS.md` to the new
  reasoning-game skill;
- shared task-shell support for `functional_answer_builder`,
  `graph_evidence_selector`, and `stableSessionShuffle`;
- `engines/reasoning-composer.js` as a data-driven composition layer over the
  shared task shell, not a new mode-overloaded engine;
- negative fixtures for recurring defects;
- rendered gallery for four exemplars plus one blind transfer;
- 40 screenshot proof states across initial, partial, retry, correct, answer
  preview, next action, mobile dark, and keyboard focus;
- blind transfer to unseen paragraph `1.2.2 Vraagfactoren`;
- specialist review, two-round lead review, and final human gate packet;
- lesson specification updates only, with no generated lesson output edits.

Core rule:

```text
copy product grammar
re-derive reasoning grammar
```

## Authority Boundary

All adoption artifacts preserve:

- student product adoption: false
- target-equivalent proof: false
- diagnostics: false
- mastery or sequencing: false
- summative use: false
- scale gate: false

The result is ready for human review at
`GATE-REASONING-GOLDEN-FAMILY-1`; it does not itself authorize rollout.

## Key Evidence

- exemplar checker:
  `build-scripts/exemplars/check-reasoning-golden-exemplars.js`
- skill checker:
  `build-scripts/sprints/check-reasoning-game-skill.js`
- gallery checker:
  `build-scripts/sprints/check-reasoning-golden-family-gallery.js`
- gate checker:
  `build-scripts/sprints/check-gate-reasoning-golden-family-1.js`
- proof JSON:
  `reports/json/reasoning-golden-family-proof.json`
- gallery:
  `reports/reasoning-golden-family/gallery.html`
- screenshot manifest:
  `reports/reasoning-golden-family/screenshots/manifest.json`
- human gate packet:
  `reports/review-gates/GATE-REASONING-GOLDEN-FAMILY-1/human-review-packet.md`

## Validation

Passed before gate packet materialization:

- `npm.cmd run check:reasoning-golden:exemplars`
- `npm.cmd run check:reasoning-golden:skill`
- `npm.cmd run check:reasoning-golden:gallery`
- `npx.cmd jest engines/tests/reasoning-composer.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js --runInBand`
- `npm.cmd run check:platform`

`npm.cmd run check:platform` passed after `npm.cmd ci` installed dependencies:
55 suites passed, 818 tests passed, 6 suites skipped. The command printed
existing fixture warnings but returned success.

Final aggregate validation is `npm.cmd run check:reasoning-golden`.

## Lesson Repository Update

Updated only:

- `specifications/companion-core-specifications.md`
- `specifications/product-end-state.md`

No generated lesson output was edited.

## Review Outcome

- Specialist review: REVISE, blockers recorded and corrected.
- Lead review round 1: REVISE, blockers recorded and corrected.
- Lead review round 2: PASS WITH FLAGS; only final artifact materialization
  remained.

## Remaining Human Decision

Human decision required at `GATE-REASONING-GOLDEN-FAMILY-1`:

- accept the adoption package as the canonical reasoning-game family standard;
- request corrections before adoption;
- or reject the adoption package and keep the current legacy reasoning-game
  route unchanged.
