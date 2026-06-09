# GOLDEN-EXERCISE-WORKBENCH-PREP-1 Plan

Generated: 2026-06-09

## Purpose

Prepare the Golden Exercise Workbench rollout by creating durable project-control documents before implementation begins.

The project has already proven one high-quality exercise layout in the `1.1.3` Golden Ticket route. The next work must not proceed as scattered patching. It must proceed from a clear end-state, roadmap, ledger, quality metrics, and review protocol.

## Why this preparation sprint exists

Coding agents have repeatedly drifted toward specification gaming:

- implementing something that passes narrow checks but does not match the intended layout;
- patching the old `et-*`/`task-shell` framework instead of adopting the Golden framework;
- stopping at â€œpassâ€ instead of making reviewers genuinely satisfied;
- losing earlier human decisions such as graph behavior, route affordance, or formula-builder quality.

This sprint creates stable project instructions so future `/goal` runs optimize toward the end state rather than toward minimal passing changes.

## Current repository baseline

Current main has a working Golden Ticket route for `1.1.3 Grafieken en tabellen`.

Important baseline facts:

1. `build-exit-ticket-shells.js` still special-cases Golden layout for `parNr === "1.1.3"` and `layout.framework === "golden_exercise_workbench"`.
2. Non-Golden exit-ticket shells still use the legacy `et-page` / `#exit-ticket-app` route.
3. The Golden shell emits `header.ge-topbar`, `main.ge-page[data-golden-ticket-root]`, `golden-ticket-layout.css`, `golden-ticket-graph.js`, and `golden-ticket-layout.js`.
4. `references/exemplars/1.1.3-exit-ticket/` is the conceptual Golden Ticket exemplar.
5. `references/exemplars/a96-answer-form/` is the calculation/answer-form exemplar.
6. The next step is policy extraction and rollout planning, not broad migration.

## Required output files

This sprint creates:

```text
reports/sprints/GOLDEN-EXERCISE-WORKBENCH-ROLLOUT-end-state.md
reports/sprints/GOLDEN-EXERCISE-WORKBENCH-ROLLOUT-roadmap.md
reports/sprints/GOLDEN-EXERCISE-WORKBENCH-ROLLOUT-sprint-ledger.md
reports/sprints/GOLDEN-EXERCISE-WORKBENCH-ROLLOUT-quality-metrics.md
reports/sprints/GOLDEN-EXERCISE-WORKBENCH-ROLLOUT-review-protocol.md
reports/sprints/GOLDEN-EXERCISE-WORKBENCH-ROLLOUT-goal-sequence.md
````

## Forbidden work

This sprint must not:

* migrate `1.1.2`;
* migrate `1.1.1`;
* migrate advisory short checks;
* migrate graph/math/reasoning games;
* delete legacy renderers;
* change generated lesson output;
* claim product use;
* claim Scale Gate 1;
* claim target-equivalent completion language;
* claim all exercises now comply.

## Acceptance criteria

The sprint passes only if:

1. All required planning files exist.
2. The end-state is concrete and ambitious.
3. The roadmap names the next `/goal` runs.
4. The quality metrics define numeric gates above mere pass/fail.
5. The review protocol requires independent reviewer roles.
6. The sprint ledger records this preparation sprint as the first entry.
7. No implementation churn is included.
8. Repository validation and diff hygiene pass.

## Validation commands

```bash
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js --check
git diff --check
```

## Closure note

This preparation sprint is not the rollout. It creates the control documents required for the next long-running `/goal`.
