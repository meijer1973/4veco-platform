# GRAPH-CHECK-UX-1 Plan

Generated: 2026-06-05

## Objective

Repair the `1.1.3 Grafieken en tabellen` advisory `Korte check` so it is a
real graph/table route check instead of a choice-only page. This sprint is the
first product-quality repair after `GATE-CHECK-SHORT-EXIT-2` returned
`REVISE / hold_for_surface_repair`.

## Quality Floor

The repaired short check must let a student see the table, use a graph
workspace, perform a graph/table action, receive local feedback, and understand
what to practise next. Page existence, screenshots, and authority flags are
not enough.

The short check remains advisory. It must not claim target-equivalent proof,
completion, diagnostics, mastery, sequencing, summative use, PV, Scale Gate 1,
or student/product authorization.

## Specification Requirements Fulfilled

This sprint fulfills the product-end-state requirement that advisory short
checks are part of the student route and must practise the right task through
the right interaction. For a graph/table paragraph, a generic multiple-choice
check is not enough.

Required product behavior:

1. `1.1.3-korte-check` has source/table context.
2. It uses shared task-shell tasks, not ordinary choice-only tasks.
3. It includes a graph/table task family:
   `graph_construction_substitute`, `graph_reading`, or
   `table_value_selection`.
4. It shows a graph workspace with visible grid/table-derived ticks.
5. It gives route advice through feedback/practice routes.
6. It remains advisory and does not enable completion language.

## Evidence Needed

- Updated `source-data/book-1/exit-ticket/1.1.3-korte-check.json`.
- Deployed generated Book 1 output through `node scripts/deploy.js`.
- Historical `reports/json/check-short-exit2-proof.json` remains the failed
  gate baseline. This sprint does not overwrite that returned-review proof.
- `reports/json/graph-check-ux1-proof.json`.
- `build-scripts/sprints/check-check-short-exit2.js` validates the repaired
  current source/rendered surface so `1.1.3-short.task_shell_count > 0`,
  `context_block_count > 0`, and graph workspace requirements are enforced.
- Screenshot evidence for `1.1.3` short check:
  - desktop initial graph/table workspace;
  - desktop wrong/retry state;
  - desktop route-advice/correct state;
  - mobile short-check state;
  - dark-mode short-check state.
- `build-scripts/sprints/check-graph-check-ux1.js`.
- Updated `build-scripts/sprints/check-check-short-exit2.js` hard failures.
- Planning review, lead review, verification review, and result artifacts.

## Review Gate

No human gate is requested by this sprint. The next human retry gate remains
blocked until the later `CHECK-SURFACE-PREGATE-1` sprint produces a green
product packet.

## Procedure

1. Record plan, baseline, and planning review.
2. Replace the choice-only `1.1.3-korte-check` with a context-first
   task-shell advisory check.
3. Harden `check-check-short-exit2.js` so graph/table paragraphs cannot have
   a choice-only short check.
4. Add a focused `GRAPH-CHECK-UX-1` checker and proof JSON.
5. Deploy Book 1 generated output.
6. Capture meaningful short-check screenshots.
7. Run validators and lead-review/verification.
8. Update roadmap, maps, URL indexes, dashboard, commit, and push.

## Stop Conditions

Stop if:

- `1.1.3-korte-check` remains ordinary choice-only;
- `1.1.3-short` has no context blocks;
- `1.1.3-short` has no graph/table task family;
- the rendered short check has no graph workspace/grid;
- new target-equivalent completion language is enabled for `1.1.1` or
  `1.1.3`;
- reviewed `1.1.2` exit-ticket authority is changed;
- generated lesson output is hand-edited instead of deployed;
- product authority is broadened;
- a retry human gate is requested before the full reset series reaches
  `CHECK-SURFACE-PREGATE-1`.

## Follow-Up Work

This sprint does not repair the `1.1.3` exit-ticket source/task layout. That is
owned by `GRAPH-EXIT-UX-1`.
