# GOLDEN-TICKET-RESET-0 Baseline

Date: 2026-06-08

## Product Decision

The `1.1.3 Grafieken en tabellen - exit-ticket` failure is a layout-framework failure, not a content failure. The old exit-ticket/task-shell route is frozen as a negative baseline for this target route. The target route must render as a standalone golden-ticket route.

## Frozen Fixture States

Executable checker fixtures:

- `build-scripts/sprints/fixtures/legacy-exit-ticket.html`
- `build-scripts/sprints/fixtures/hybrid-frankenstein-exit-ticket.html`
- `build-scripts/sprints/fixtures/golden-ticket-reference.html`

Report fixture copies:

- `reports/fixtures/golden-ticket-layout/legacy-exit-ticket.html`
- `reports/fixtures/golden-ticket-layout/hybrid-frankenstein-exit-ticket.html`
- `reports/fixtures/golden-ticket-layout/golden-ticket-reference.html`

## Hard Boundary

For the target route, the following are blockers:

- `#exit-ticket-app`
- `task-shell.css`
- `exit-ticket.css`
- `skill-map-route.css`
- `task-shell-engine.js`
- `task-shell-ui.js`
- `exit-ticket-engine.js`
- `exit-ticket-ui.js`
- mixed `ge-*` and `et-*` class attributes such as `ge-page et-page`

Required golden route signals:

- `main.ge-page[data-golden-ticket-root]`
- `.ge-workbench`
- `.ge-source-card`
- `.ge-task-card`
- `svg.ge-graph[data-graph-id="golden-ticket-113"]`
- `golden-ticket-layout.css`
- `golden-ticket-graph.js`
- `golden-ticket-layout.js`

## Current Status

The hard boundary is enforced by:

- `build-scripts/sprints/check-golden-ticket-layout-boundary.js`
- `build-scripts/sprints/check-golden-ticket-no-legacy.js`
- `build-scripts/sprints/check-golden-ticket-rendered-proof.js`

The target route is generated from `4veco-platform` and deployed into `4veco-lessen`; lesson output must not be hand-edited.
