# Sprint TASK-FAMILY-MULTI-1: Diff Summary

Generated: 2026-06-01

## Summary

Runtime-only implementation of `multi_select` in the shared task shell, with
exact-set matching, strict string response ids, practice-only partial feedback,
distinct multi-select UI controls, wrapper collection, focused tests, checker,
proof fixture, and lead-review records.

## Runtime changes

- `engines/task-shell-engine.js`
  - declares `multi_select`;
  - validates `inputLabel`, option ids, exact-set mode, at least two expected
    values, distractor presence, and `partialFeedback: "practice_only"`;
  - rejects raw arrays, extra response keys, duplicate selections, unknown
    selections, and non-string response values;
  - compares exact sets order-insensitively;
  - returns neutral `selectionFeedback` details only for practice-only retry
    feedback.
- `engines/task-shell-ui.js`
  - renders `.ts-multi-option` controls with `data-multi-option-id`;
  - exports `collectMultiSelectResponse` and `handleMultiSelectClick`;
  - renders practice-only selection feedback.
- `engines/task-shell.css`
  - styles multi-select controls and selection-feedback groups.
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
  - delegate multi-select collection and click handling through shared
    `TaskShellUI` helpers.

## Test and proof changes

- Focused Jest tests now cover `multi_select` validation, exact-set matching,
  order-insensitivity, strict response shape, numeric/object coercion
  rejection, rendering, partial feedback, wrapper delegation, and focus plan.
- `build-scripts/sprints/check-task-family-multi1.js` provides deterministic
  sprint proof.
- `reports/json/task-family-multi1-proof.json` records runtime support and
  boundary flags.
- `reports/sprints/TASK-FAMILY-MULTI-1-rendered-fixture.html` records static
  rendered fixture proof.
- `reports/sprints/TASK-FAMILY-MULTI-1-screenshot-manifest.md` records that
  generated-route screenshots are deferred.

## Review changes

- Planning review returned PASS WITH FLAGS and required pre-code
  clarifications.
- Lead review round 1 returned REVISE for response-id coercion.
- Corrections made the selected response ids strict strings and added
  regression tests.
- Lead review round 2 returned PASS WITH FLAGS.

## Boundaries preserved

No generated lesson output, source exercise data, protected references,
target-exercise registry fields, candidate storage, product-route adoption,
target-equivalent reliance, diagnostics, mastery/sequencing, PV, Scale Gate 1,
or product-wide use changed.

Protected surfaces not changed:

- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `source-data/book-1/exit-ticket/`
- `source-data/book-1/reasoning/`
- generated Book 1 lesson output
- target-exercise registry fields
- candidate storage

## Next route

Proceed to `TASK-FAMILY-ORDER-1` or `TASK-FAMILY-SOURCE-1` after closure,
depending on whether the next priority is reasoning/procedure ordering or
graph/table source-chain construction.
