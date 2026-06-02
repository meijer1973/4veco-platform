# Sprint TASK-FAMILY-MATCH-1: Diff Summary

Generated: 2026-06-02

## Summary

Runtime-only implementation of `matching_pairs` in the shared task shell, with
strict one-to-one pair validation, exact response matching, practice-only
feedback, matching-specific UI controls, wrapper collection, focused tests,
custom checker, proof fixture, and lead-review records.

## Runtime changes

- `engines/task-shell-engine.js`
  - declares `matching_pairs`;
  - validates left/right item banks, item descriptions, answer/distractor
    semantics, same-bank `distractorFor`, and one-to-one answer counts;
  - validates `expected.kind: "matching_pairs"` and full expected pair coverage;
  - rejects invalid response shapes, unknown ids, duplicate ids, omitted
    answers, distractor selections, and extra response keys;
  - compares exact pair sets order-insensitively;
  - returns neutral practice-only `matchingPairsFeedback`.
- `engines/task-shell-ui.js`
  - renders left/right matching banks, pair summary, remove/clear controls, and
    matching-pairs feedback;
  - exports `collectMatchingPairsResponse` and `handleMatchingPairsClick`.
- `engines/task-shell.css`
  - styles matching banks, options, selected-pair summary, feedback, and narrow
    layout.
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
  - delegate matching-pairs collection and click handling through shared
    `TaskShellUI` helpers.

## Test and proof changes

- Focused Jest tests now cover `matching_pairs` validation, exact set matching,
  order-insensitivity, strict response shape, distractor rejection, rendering,
  feedback, wrapper delegation, exports, and focus plan.
- `build-scripts/sprints/check-task-family-match1.js` provides deterministic
  sprint proof.
- `reports/json/task-family-match1-proof.json` records runtime support,
  strict response-shape coverage, old archive no-change status, and boundary
  flags.
- `reports/sprints/TASK-FAMILY-MATCH-1-rendered-fixture.html` records static
  rendered fixture proof.
- `reports/sprints/TASK-FAMILY-MATCH-1-screenshot-manifest.md` records
  standard, after-click, feedback, narrow, dark-mode, keyboard, and
  screen-reader fixture proof.

## Review changes

- Planning review returned PASS WITH FLAGS and required strict response-shape
  negatives plus old exit-ticket archive no-change evidence.
- Lead review round 1 returned PASS WITH FLAGS with no blocking findings.
- Correction log records no blocking corrections and carries fixture-only,
  one-to-one-only, and no-product-authority flags.
- Lead review round 2 returned PASS WITH FLAGS.

## Protected surfaces preserved

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
- `knowledge/exit-ticket-game-1.1.1.zip`

## Next route

Proceed to `TASK-FAMILY-TWO-TIER-1` after closure, or to
`GAME-ROUTE-AFFORDANCE-1` if the next priority is non-exit practice-game route
affordance. Do not adopt `matching_pairs` into generated routes until a later
reviewed adoption sprint supplies product-route rendered proof.
