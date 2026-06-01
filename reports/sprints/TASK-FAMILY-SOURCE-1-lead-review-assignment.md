# TASK-FAMILY-SOURCE-1 Lead Review Assignment

Generated: 2026-06-01

Status: assigned for structural lead review.

Assigned lead reviewer agent: Turing (`019e8507-c39b-72b2-9bb4-229be894ad72`).

## Reviewer Brief

Review `TASK-FAMILY-SOURCE-1` as a runtime-only shared task-shell
implementation sprint. Decide whether the implementation can close, requires
corrections, or must pause before closure.

The review must inspect the actual changed files, tests, checker, proof JSON,
rendered fixture, screenshot manifest, result report, and plan. Do not treat
the result file as sufficient proof.

## Scope To Review

- `source_value_selection`
- `source_chain_builder`
- strict engine validation and matching
- practice-only feedback
- source-specific UI rendering and collection
- exit-ticket, skilltree, and graph wrapper delegation
- focused Jest coverage and custom checker
- report fixture and boundary claims

## Required Questions

1. Do both families satisfy the accepted `TASK-FAMILY-CONSTRUCT-1` contract?
2. Does `source_value_selection` require exact value-role pair matching and
   reject omitted answer values, wrong roles, selected distractors, duplicate
   selected values, non-string ids, unknown values/roles, raw arrays,
   array-with-`selections`, and extra response keys?
3. Does `source_chain_builder` require exact ordered-chain matching and reject
   omitted answer nodes, wrong order, selected distractors, duplicate selected
   nodes, non-string ids, unknown nodes, raw arrays, array-with-`chain`, and
   extra response keys?
4. Do validation rules prevent weak authored tasks, including missing
   distractors, expected distractors, omitted answer values/nodes, duplicate
   expected values/nodes, and missing required chain node roles?
5. Are rendered controls source-specific, accessible enough for this runtime
   proof, and distinct from sentence/formula/step selectors?
6. Do exit-ticket, skilltree, and graph wrappers delegate through shared
   `TaskShellUI` helpers rather than duplicating response logic?
7. Do tests and `check-task-family-source1.js` cover the planning-review flags,
   especially arrays with attached `selections` / `chain` properties and
   keyboard/screen-reader proof?
8. Does the sprint preserve the no-generated-output, no-source-data-adoption,
   no-target-equivalent, no-diagnostic, no-mastery, no-sequencing, no-PV, and
   no-Scale-Gate boundaries?
9. Are any corrections required before closure?

## Verdict Options

- PASS
- PASS WITH FLAGS
- REVISE
- PAUSE

PASS WITH FLAGS may carry adoption/product-route flags. It may not carry a
broken runtime contract, missing required validation, missing wrapper support,
or missing checker coverage.
