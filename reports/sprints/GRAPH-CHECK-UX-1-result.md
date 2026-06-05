# GRAPH-CHECK-UX-1 Result

Generated: 2026-06-05

## Status

Complete pending commit and push.

## Outcome

The `1.1.3` advisory `Korte check` now uses graph/table task-shell
interaction instead of ordinary choice-only tasks:

- source/table context blocks are present;
- three task-shell tasks are present;
- task families include `graph_construction_substitute`, `graph_reading`, and
  `table_value_selection`;
- the graph workspace has a visible grid and table-derived ticks;
- wrong/retry feedback is targeted;
- successful completion gives route advice;
- desktop, mobile, and dark-mode screenshots are recorded.

The short check remains advisory. It does not authorize target-equivalent
completion language, product-route adoption, diagnostics, mastery/sequencing,
PV, Scale Gate 1, or student/product use.

## Files Added Or Updated

- `source-data/book-1/exit-ticket/1.1.3-korte-check.json`
- `build-scripts/sprints/check-check-short-exit2.js`
- `build-scripts/sprints/check-graph-check-ux1.js`
- `build-scripts/sprints/capture-graph-check-ux1-screenshots.js`
- `reports/json/graph-check-ux1-proof.json`
- `reports/sprints/GRAPH-CHECK-UX-1-*`
- generated Book 1 short-check data output
- `references/reference-team-roadmap.md`

## Validation

Passed:

```text
node build-scripts\sprints\check-graph-check-ux1.js
node build-scripts\sprints\check-check-short-exit2.js
npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts\reports\validate-report-json.js
node build-scripts\references\check-roadmap-version-index.js
npm.cmd run check:scope-language
npm.cmd run check:platform
```

In-app browser localhost DOM check passed:

```text
contextBlocks=2
taskShells=3
graphWorkspaces=1
gridLines=12
choiceControls=0
```

`npm.cmd run check:platform` passed with existing paragraph-fixture validation
noise printed to stdout; Jest exited successfully.

## Required Next Action

Proceed to `GRAPH-EXIT-UX-1` after validation and remote publication. Do not
start the retry human gate until `GRAPH-EXIT-UX-1`, `CHECK-ROUTE-COPY-1`,
`VISUAL-QA-HARDEN-2`, and `CHECK-SURFACE-PREGATE-1` are complete.
