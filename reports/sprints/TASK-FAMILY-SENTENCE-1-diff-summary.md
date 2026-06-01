# Sprint TASK-FAMILY-SENTENCE-1: Diff Summary

Generated: 2026-06-01

## Summary

Implemented runtime-only `sentence_builder` support in the shared task shell
with strict token-sequence validation, shared rendering/helpers, wrapper
collection, focused tests, checker proof, and sprint closure artifacts.

## Runtime changes

- `engines/task-shell-engine.js`
  - declares `sentence_builder`;
  - validates token banks, token kinds, distractor policy, `distractorFor`
    references, canonical tokens, accepted sequences, no-reuse defaults, and
    exact response shape;
  - evaluates exact ordered token-id sequences only;
  - rejects raw token arrays;
  - adds sentence-builder focus selectors.
- `engines/task-shell-ui.js`
  - renders a fragment bank, ordered construction zone, clear control, and
    stable selectors;
  - exports `collectSentenceBuilderResponse` and
    `handleSentenceBuilderClick`;
  - adds dynamic add/remove/reorder behavior through shared helpers.
- `engines/task-shell.css`
  - adds sentence-builder styling for token bank, sequence zone, selected
    tokens, controls, focus, mobile wrapping, and dark-mode variables.
- `engines/exit-ticket-ui.js`, `engines/skilltree-ui.js`, and
  `engines/graphical-ui.js`
  - collect `{ tokens: [...] }`;
  - delegate interaction to shared task-shell helpers.

## Test and proof changes

- focused task-shell and wrapper tests cover the new family;
- `build-scripts/sprints/check-task-family-sentence1.js` validates runtime,
  source, proof, and boundary expectations;
- `reports/json/task-family-sentence1-proof.json` records runtime proof and
  product-boundary flags;
- `reports/sprints/TASK-FAMILY-SENTENCE-1-rendered-fixture.html` and
  `reports/sprints/TASK-FAMILY-SENTENCE-1-screenshot-manifest.md` provide
  report-fixture proof only.

## Sprint artifacts

Added the plan, baseline, planning review, lead-review assignment, round-1
review, correction log, round-2 recheck, result, diff summary, and sprint
metadata files for `TASK-FAMILY-SENTENCE-1`.

## Protected surfaces

No changes were made under:

- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `source-data/book-1/`
- generated Book 1 lesson output
- target-exercise registry fields
- candidate storage or candidate writes

No diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, or
product-wide use was authorized.

## Carried flags

- `knowledge/exit-ticket-game-1.1.1.zip` remains unrelated and unstaged.
- Product-route screenshots remain required before adoption.
- Dynamic after-click remove/reorder proof is source/checker-based in this
  runtime sprint; generated-route adoption should include rendered interaction
  proof.
