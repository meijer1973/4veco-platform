# TASK-FAMILY-LABEL-1 Lead Review Assignment

Generated: 2026-06-01

Status: assigned for structural lead review.

Assigned lead reviewer agent: Turing (`019e8507-c39b-72b2-9bb4-229be894ad72`).

## Reviewer Brief

Review `TASK-FAMILY-LABEL-1` as a runtime-only shared task-shell
implementation sprint. Decide whether the implementation can close, requires
corrections, or must pause before closure.

The review must inspect the actual changed files, tests, checker, proof JSON,
rendered fixture, screenshot manifest, diff summary, and plan. Do not treat
the diff summary or checker output as sufficient proof by itself.

## Scope To Review

- `label_placement`
- strict engine validation and matching
- practice-only feedback
- visual target-region UI rendering and collection
- exit-ticket, skilltree, and graph wrapper delegation
- focused Jest coverage and custom checker
- report fixture and boundary claims

## Required Questions

1. Does `label_placement` satisfy the accepted
   `TASK-FAMILY-CONSTRUCT-1` contract?
2. Does `label_placement` require exact label-target placement matching and
   reject omitted labels/targets, swapped placements, selected distractor
   labels/targets, duplicate labels/targets, non-string ids, unknown ids, raw
   arrays, array-with-`placements`, and extra response keys?
3. Do validation rules prevent weak authored tasks, including missing label or
   target descriptions, missing `distractorFor`, expected distractors, omitted
   answer labels/targets, duplicate expected labels/targets, invalid target
   roles, and out-of-range coordinates?
4. Are rendered controls visual and accessible enough for this runtime proof:
   label bank, target region, target buttons, placement summary,
   screen-reader labels, and keyboard focus plan?
5. Do exit-ticket, skilltree, and graph wrappers delegate through shared
   `TaskShellUI` helpers rather than duplicating response logic?
6. Do tests and `check-task-family-label1.js` cover the planning-review flags,
   especially descriptions, `distractorFor`, arrays with attached
   `placements`, visual/keyboard/screen-reader fixture proof, and target-role
   enum bounds?
7. Does the sprint preserve the no-generated-output, no-source-data-adoption,
   no-target-equivalent, no-diagnostic, no-mastery, no-sequencing, no-PV, and
   no-Scale-Gate boundaries?
8. Are any corrections required before closure?

## Verdict Options

- PASS
- PASS WITH FLAGS
- REVISE
- PAUSE

PASS WITH FLAGS may carry adoption/product-route flags. It may not carry a
broken runtime contract, missing required validation, missing wrapper support,
or missing checker coverage.
