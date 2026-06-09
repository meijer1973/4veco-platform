# UI Policy Reference

Status: policy extraction for `GOLDEN-EXERCISE-POLICY-1`.

This folder is the canonical UI policy entrypoint for the Golden Exercise Workbench rollout. It turns the implemented `1.1.3` Golden Ticket route and the A96 answer-form exemplar into repository guidance that future agents can read without chat context.

## Files

```text
references/ui/layout-registry.md
references/ui/layout-registry.json
references/ui/interaction-policy.md
references/ui/interaction-policy.json
references/ui/exercise-workbench-policy.md
references/ui/shared-task-rollout-policy.md
```

## Source Trail

Policy is extracted from:

```text
reports/sprints/GOLDEN-EXERCISE-WORKBENCH-ROLLOUT-end-state.md
reports/sprints/GOLDEN-EXERCISE-WORKBENCH-ROLLOUT-roadmap.md
reports/sprints/GOLDEN-EXERCISE-WORKBENCH-ROLLOUT-quality-metrics.md
reports/sprints/GOLDEN-EXERCISE-WORKBENCH-ROLLOUT-review-protocol.md
build-scripts/platform/build-exit-ticket-shells.js
engines/golden-ticket-layout.js
engines/golden-ticket-graph.js
source-data/book-1/exit-ticket/1.1.3-exit-ticket.json
references/exemplars/1.1.3-exit-ticket/
references/exemplars/a96-answer-form/
```

## Current Contract

Golden Exercise Workbench is a layout contract, not a style suggestion. A source-dependent exercise route that opts into:

```text
layout.framework: golden_exercise_workbench
```

must render through the direct Golden route structure:

```text
header.ge-topbar
main.ge-page[data-golden-ticket-root]
ge-* workbench sections
golden-ticket-layout.css
golden-ticket-graph.js when graph controls are present
golden-ticket-layout.js
```

It must not render through `#exit-ticket-app`, `et-page`, mixed `ge-*`/`et-*`, legacy task-shell CSS, legacy exit-ticket CSS, or legacy visible shell scripts.

## Boundary

This policy package does not migrate routes, generalize the renderer, alter generated lesson output, remove legacy renderers, or authorize student/product use. It is the policy base for later goals:

```text
GOLDEN-EXEMPLAR-PROMOTION-1
GOLDEN-EXERCISE-CHECKERS-1
GOLDEN-EXERCISE-RENDERER-1
EXIT-TICKET-WORKBENCH-112-1
SHORT-CHECK-WORKBENCH-POLICY-1
```

## Review Threshold

A policy or implementation goal using this folder is not complete unless reviewers can score:

```text
overall >= 8.5
layout contract clarity >= 9.0
anti-spec-gaming strength >= 9.0
shared-task integration >= 8.5
didactic operation-chain quality >= 8.5
human-oversight reduction >= 9.0
no metric below 8.0
```
