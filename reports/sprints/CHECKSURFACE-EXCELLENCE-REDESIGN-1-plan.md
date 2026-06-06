# CHECKSURFACE-EXCELLENCE-REDESIGN-1 Redesign Plan

Generated: 2026-06-06

## Status

Planned after `CHECKSURFACE-POLICY-REGRESSION-1`.

## Goal

Repair the student-facing `1.1.3` short check and exit ticket so the renewed
gate can show a genuinely stronger product surface: separate contexts, no
answer-giving procedure, no correct-only controls, delayed graph labels, and
same-workspace graph work.

## Authorized Scope

This sprint may:

- update platform runtime validation for shared task controls;
- update graph-construction UI so axis labels/scale can stay hidden until the
  student makes an axis choice;
- update `1.1.3-korte-check` and `1.1.3-exit-ticket` source data;
- regenerate Book 1 output through `scripts/deploy.js`;
- refresh proof JSON, screenshots, and existing checkers that cite changed
  `1.1.3` values.

This sprint may not:

- hand-edit generated lesson output;
- weaken `1.1.2` approved completion authority;
- enable completion language for `1.1.1` or `1.1.3`;
- send or close the human-review gate;
- authorize product-route adoption, diagnostics, mastery/sequencing, PV,
  Scale Gate 1, or student/product use.

## Quality Floor

The redesigned surfaces must satisfy all of these:

1. `1.1.3` short check is an advisory mini-context distinct from the exit
   ticket.
2. `1.1.3` exit ticket does not include a procedure/flowchart context or
   pre-attempt instruction that tells the student the graph procedure.
3. Axis labels and tick values that would reveal the intended convention are
   hidden until the student selects axes.
4. Interval-halving controls include plausible incorrect intervals and
   conclusions.
5. Graph construction, graph reading, and table/source use remain active task
   actions.
6. Feedback gives targeted retry or next action without target-equivalent
   completion language.

## Specification Requirements Fulfilled

- Product end-state: short check gives local route advice; exit ticket remains
  the separate target-equivalent candidate.
- Companion core: graph/table skills use graph/table interactions.
- Companion core: exit tickets do not expose answer-revealing scaffolds before
  the attempt.
- Shared task shell: reusable runtime validation prevents weak controls.

## Evidence Needed

- updated `engines/task-shell-engine.js`
- updated `engines/task-shell-ui.js`, `engines/task-shell.css`, and host UI
  bindings
- updated `source-data/book-1/exit-ticket/1.1.3-korte-check.json`
- updated `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`
- refreshed generated Book 1 output in `../4veco-lessen`
- refreshed screenshot/proof JSON for graph short check, graph exit ticket,
  visual QA, and CHECK-SHORT-EXIT-2
- focused runtime/UI tests

## Procedure

1. Apply runtime validation for interval and conclusion distractors.
2. Add delayed-axis-guide rendering and event handling for graph construction.
3. Redesign the short check around a distinct local context.
4. Remove procedure-giving context from the exit ticket and add distractors to
   interval/conclusion controls.
5. Update affected checkers and capture scripts.
6. Run focused tests.
7. Regenerate Book 1 output through deploy.
8. Refresh screenshots and proof JSON.
9. Run policy/regression and prior repair checkers.

## Acceptance Tests

```text
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/graphical-ui.test.js engines/tests/skilltree-ui.test.js
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/capture-graph-check-ux1-screenshots.js
node build-scripts/sprints/capture-graph-exit-ux1-screenshots.js
node build-scripts/sprints/capture-check-short-exit2-screenshots.js
node build-scripts/sprints/check-checksurface-policy-regression1.js
node build-scripts/sprints/check-check-short-exit2.js
node build-scripts/sprints/check-graph-check-ux1.js
node build-scripts/sprints/check-graph-exit-ux1.js
node build-scripts/sprints/check-visual-qa-harden2.js
```

## Stop Conditions

Stop if:

- a selector can be valid with only correct options;
- `1.1.3` exit ticket still contains a procedure block;
- the short check and exit ticket are still near-duplicates;
- axis labels reveal the correct graph convention before axis selection;
- generated output changes are not produced through deploy.

## Review Gate

This sprint is judged by lead review and the later
`CHECKSURFACE-EXCELLENCE-AUDIT-3P`. It prepares repaired surfaces but does not
replace the human gate.

## Higher-Quality Improvements In Scope

- Use a student-friendly local short-check context rather than a thin
  variation of the same ice-cream table.
- Preserve the useful shared-task graph behavior accepted in the repaired
  ingestion gate.

## Omitted Follow-Up Work

- Full three-paragraph excellence comparison belongs to
  `CHECKSURFACE-EXCELLENCE-AUDIT-3P`.
- Renewed review-packet publication belongs to
  `CHECKSURFACE-GATE-RETRY-EXCELLENT-1`.
