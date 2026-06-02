# Sprint TASK-FAMILY-TWO-TIER-1: Diff Summary

Generated: 2026-06-02

## Summary

Runtime-only implementation of `two_tier_choice` in the shared task shell, with
strict answer-plus-reason validation, exact response matching, practice-only
feedback, two-tier UI controls, wrapper collection, focused tests, custom
checker, proof fixture, and lead-review records.

## Runtime changes

- `engines/task-shell-engine.js`
  - declares `two_tier_choice`;
  - validates answer and reason option banks, option descriptions, minimum
    option counts, duplicate ids within tiers, and duplicate ids across tiers;
  - validates `expected.kind: "two_tier_choice"` with expected answer id from
    the answer tier and expected reason id from the reason tier;
  - rejects invalid response shapes, answer-only responses, reason-only
    responses, wrong answer/reason combinations, unknown ids, cross-tier ids,
    nested values, non-string ids, raw strings, raw arrays, and extra keys;
  - returns neutral practice-only `twoTierFeedback`.
- `engines/task-shell-ui.js`
  - renders separate answer and reason option groups, selected-state summary,
    and two-tier feedback;
  - exports `collectTwoTierChoiceResponse` and `handleTwoTierChoiceClick`.
- `engines/task-shell.css`
  - styles two-tier groups, options, selected-state summary, feedback, focus
    states, narrow layout, and dark-mode-compatible surfaces.
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
  - delegate two-tier choice collection and click handling through shared
    `TaskShellUI` helpers.

## Test and proof changes

- Focused Jest tests now cover `two_tier_choice` validation, exact
  answer-plus-reason matching, strict response shape, schema rejection, UI
  rendering, feedback rendering, wrapper delegation, exports, and focus plan.
- `build-scripts/sprints/check-task-family-two-tier1.js` provides
  deterministic sprint proof.
- `reports/json/task-family-two-tier1-proof.json` records runtime support,
  strict response-shape coverage, old archive no-change status, and boundary
  flags.
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-rendered-fixture.html` records
  static rendered fixture proof.
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-screenshot-manifest.md` records
  standard, after-click, feedback, narrow, dark-mode, keyboard, and
  screen-reader fixture proof.

## Review changes

- Planning review returned PASS WITH FLAGS and required strict adversarial
  response-shape coverage, schema tests, cross-tier duplicate-id rejection,
  neutral feedback, and old exit-ticket archive no-change evidence.
- Lead review round 1 returned PASS WITH FLAGS with no blocking findings.
- Correction log records no blocking corrections and carries fixture-only,
  no-diagnostic-output, and no-product-authority flags.
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

Proceed to `TASK-FAMILY-ASSERTION-1` after closure, or to
`GAME-ROUTE-AFFORDANCE-1` if the next priority is non-exit practice-game route
affordance. Do not adopt `two_tier_choice` into generated routes until a later
reviewed adoption sprint supplies product-route rendered proof.
