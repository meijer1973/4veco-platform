# GRAPH-EXIT-UX-1 Result

Generated: 2026-06-05

## Status

Complete pending map refresh, commit, and push.

## Outcome

The `1.1.3` target-equivalent `Exit ticket` candidate now uses a split
source/task graph workspace:

- `1.1.3-exit-ticket` opts into `source_task_workspace`;
- the generated page shows source/table/formula/procedure context in a left
  source pane and task flow in a right task pane on desktop;
- the source pane is constrained and scrollable;
- the graph task and graph grid are visible with source context in the desktop
  first viewport;
- the task remains visible after source-pane scrolling;
- the graph line is drawn in the same workspace;
- all three task checks can match;
- completion language remains hidden because `1.1.3` is not gate-approved;
- desktop, mobile, and dark-mode screenshot proof is recorded.
- focused and broader validators passed.

The exit ticket remains a held target-equivalent candidate. This sprint does
not authorize product-route adoption, new completion language, diagnostics,
mastery/sequencing, PV, Scale Gate 1, or student/product use.

## Validation

Passed:

```text
node build-scripts\sprints\capture-graph-exit-ux1-screenshots.js
node build-scripts\sprints\check-graph-exit-ux1.js
node build-scripts\sprints\check-check-short-exit2.js
node build-scripts\sprints\check-graph-check-ux1.js
npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts\reports\validate-report-json.js
node build-scripts\references\check-roadmap-version-index.js
npm.cmd run check:scope-language
npm.cmd run check:platform
```

The Codex in-app browser connector was available, but opening a controllable
browser tab returned no available route in this session. The sprint therefore
uses the Playwright screenshot/proof capture as the browser-backed evidence.

## Files Added Or Updated

- `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`
- `engines/exit-ticket-ui.js`
- `engines/exit-ticket.css`
- `build-scripts/sprints/check-check-short-exit2.js`
- `build-scripts/sprints/check-graph-exit-ux1.js`
- `build-scripts/sprints/capture-graph-exit-ux1-screenshots.js`
- `reports/json/graph-exit-ux1-proof.json`
- `reports/sprints/GRAPH-EXIT-UX-1-*`
- generated Book 1 exit-ticket output
- `references/reference-team-roadmap.md`

## Required Next Action

Proceed to `CHECK-ROUTE-COPY-1` after validation and remote publication. Do
not start the retry human gate until `CHECK-ROUTE-COPY-1`,
`VISUAL-QA-HARDEN-2`, and `CHECK-SURFACE-PREGATE-1` are complete.
