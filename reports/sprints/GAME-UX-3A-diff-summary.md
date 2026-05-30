# Sprint GAME-UX-3A: Diff Summary

Generated: 2026-05-30

## Runtime foundation changes

- Added `engines/task-shell-engine.js` with shared task-family validation,
  deterministic checking, self-check handling, boundary flags, student-text
  claim checks, and focus-plan hooks.
- Added `engines/task-shell-ui.js` with static rendering helpers for shared
  task controls and neutral feedback cards.
- Added `engines/task-shell.css` with light/dark styling and stable responsive
  control dimensions.
- Added focused tests for task-family coverage, feedback states, no internal
  code leakage, restricted product-claim blocking, keyboard/focus-ready markup,
  feedback rendering, and shell/deploy load hooks.

## Accepted task families

- numeric input
- calculation/work capture
- final-answer entry
- unit/notation field
- short constructed response
- table-value selection
- graph reading
- point placement
- graph-construction substitute
- structured reasoning

## Integration boundary

- `scripts/deploy.js` now copies task-shell runtime files to `shared/`.
- Generated exit-ticket shells will load `task-shell.css`,
  `task-shell-engine.js`, and `task-shell-ui.js` on future deploys.
- Existing generated lesson output was not regenerated or changed.
- Existing `source-data/book-*/exit-ticket/*.json` files were not changed.
- Graph/math/reasoning engines were not converted in this sprint; their
  integrations remain under GRAPH-UX-2, MATH-UX-2, and REASON-UX-2.

## Protected surfaces

Protected reference data did not change. `references/machine/` and
`references/external/` were not edited. `references/authored/course-target-exercises.json`
was not changed and received no `question_type`, `answer_form`, or mapping
fields.

No answer-skill candidate storage was created. No candidate writes occurred.
No generated lesson output under `../4veco-lessen/Boek *` changed. No
target-equivalent proof, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, Scale
Gate 1, or student/product use was authorized.

## Generated maps and indexes

Repository maps, URL indexes, source/document registries, and internal
dashboard outputs were refreshed for remote reviewer navigation after the
runtime and roadmap changes.
