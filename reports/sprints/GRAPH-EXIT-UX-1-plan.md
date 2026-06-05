# GRAPH-EXIT-UX-1 Plan

Generated: 2026-06-05

## Objective

Repair the generated `1.1.3 Grafieken en tabellen` target-equivalent
exit-ticket candidate so its source material and graph tasks render as one
source/task workspace instead of a source block above hidden-below-the-fold
tasks.

This is the second product-quality repair after
`GATE-CHECK-SHORT-EXIT-2` returned `REVISE / hold_for_surface_repair`.

## Quality Floor

The repaired exit ticket must let a student see the source/table context and
the graph task together on desktop. The graph workspace may not be buried
below a long source section. Source context must be independently scrollable
or otherwise constrained, while the task/question flow remains visible.

The surface remains a held target-equivalent candidate. This sprint must not
authorize completion language, product-route adoption, diagnostics,
mastery/sequencing, PV, Scale Gate 1, or student/product use.

## Specification Requirements Fulfilled

This sprint fulfills the product-end-state requirement that source-dependent
target-equivalent exit tickets use context-first task structure in a student
usable way. For a graph/table paragraph, context-first does not mean "sources
above everything"; it means the source and the graph task can be inspected
together.

Required product behavior:

1. `1.1.3-exit-ticket` opts into a source/task workspace layout.
2. Desktop layout shows a left source pane and right task pane.
3. The source pane is constrained and scrollable.
4. The graph task and first question are visible with the source/table pane.
5. The graph workspace has visible grid and table-derived ticks.
6. Wrong/retry, corrected, completed, mobile, and dark-mode states are
   inspectable.
7. `1.1.3` completion language remains held.
8. Reviewed `1.1.2` completion-language authority is preserved.

## Evidence Needed

- Updated `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json` layout
  metadata.
- Updated `engines/exit-ticket-ui.js` and `engines/exit-ticket.css` for an
  opt-in source/task workspace.
- Deployed generated Book 1 output through `node scripts/deploy.js`.
- `build-scripts/sprints/check-graph-exit-ux1.js`.
- `build-scripts/sprints/capture-graph-exit-ux1-screenshots.js`.
- `reports/json/graph-exit-ux1-proof.json`.
- Screenshot evidence:
  - desktop initial source/task split;
  - desktop source-scrolled with task still visible;
  - desktop wrong/retry state;
  - desktop line-confirmed/corrected state;
  - desktop completed state;
  - mobile initial state;
  - mobile dark completed state.
- Planning review, lead review, visual QA, verification review, and result
  artifacts.

## Review Gate

No human gate is requested by this sprint. The next human retry gate remains
blocked until `CHECK-SURFACE-PREGATE-1` produces a green product packet.

## Procedure

1. Record plan, baseline, and planning review.
2. Add opt-in `source_task_workspace` layout metadata to `1.1.3-exit-ticket`.
3. Extend the exit-ticket renderer with source-pane/task-pane layout support.
4. Add responsive styling for desktop split layout, source scrolling, and
   mobile stacked layout.
5. Harden `check-check-short-exit2.js` for the split workspace requirement.
6. Add focused `GRAPH-EXIT-UX-1` checker and screenshot/proof capture.
7. Deploy Book 1 generated output.
8. Run validators, browser check, lead review, and verification.
9. Update roadmap, maps, URL indexes, dashboard, commit, and push.

## Stop Conditions

Stop if:

- `1.1.3-exit-ticket` still renders source context above the task flow only;
- the graph task remains below the fold on desktop initial proof;
- the source pane is not independently scrollable or constrained;
- the graph workspace/grid/ticks are missing;
- a separate completed graph block appears outside the active workspace;
- `1.1.3` completion language becomes eligible;
- reviewed `1.1.2` authority changes;
- generated lesson output is hand-edited instead of deployed;
- product authority is broadened;
- a retry human gate is requested before `CHECK-SURFACE-PREGATE-1`.

## Follow-Up Work

This sprint does not repair landing-card route copy or harden the full
visual-QA standard. Those are owned by `CHECK-ROUTE-COPY-1` and
`VISUAL-QA-HARDEN-2`.

