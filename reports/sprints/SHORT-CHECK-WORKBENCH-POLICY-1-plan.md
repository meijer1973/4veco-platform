# SHORT-CHECK-WORKBENCH-POLICY-1 Plan

Status: in progress.

Generated: 2026-06-11T08:52:07.5249142+02:00

## Goal

Define the advisory short-check variant of Golden Exercise Workbench before any real short-check route migration. The output must help future agents transfer the Workbench quality bar while preserving the authority difference between exit tickets and short checks.

## Starting State

```text
platform branch: codex/short-check-workbench-policy-1-20260611
platform base: 7b2d8e5e212d25f808fc9cbf5c727d95c54a94d7
lesson main: 7edfc75834e342664ae167bb174034c9b2d33092
```

The lesson repository remains a read-only reference for this goal.

## Required Inputs

```text
references/ui/README.md
references/ui/layout-registry.md
references/ui/interaction-policy.md
references/ui/exercise-workbench-policy.md
references/ui/shared-task-rollout-policy.md
reports/sprints/GOLDEN-EXERCISE-WORKBENCH-ROLLOUT-roadmap.md
reports/sprints/GOLDEN-EXERCISE-WORKBENCH-ROLLOUT-end-state.md
source-data/book-1/exit-ticket/1.1.2-exit-ticket.json
source-data/book-1/exit-ticket/1.1.3-exit-ticket.json
reports/json/exit-ticket-workbench-112-rendered-1-proof.json
reports/sprints/EXIT-TICKET-WORKBENCH-112-RENDERED-1-rendered-proof.md
```

## Required Outputs

```text
references/ui/layouts/golden-exercise-workbench-short-check.md
references/ui/layouts/golden-exercise-workbench-short-check.json
reports/sprints/SHORT-CHECK-WORKBENCH-POLICY-1-plan.md
reports/sprints/SHORT-CHECK-WORKBENCH-POLICY-1-result.md
reports/json/short-check-workbench-policy-1-proof.json
```

Policy entrypoints and JSON should be updated where needed:

```text
references/ui/README.md
references/ui/layout-registry.md
references/ui/layout-registry.json
references/ui/interaction-policy.md
references/ui/interaction-policy.json
references/ui/exercise-workbench-policy.md
references/ui/shared-task-rollout-policy.md
reports/sprints/GOLDEN-EXERCISE-WORKBENCH-ROLLOUT-roadmap.md
```

## Non-Goals

```text
no 1.1.1 migration
no extra exit-ticket migration
no real short-check generated output
no generated lesson output change
no legacy renderer deletion
no product use, Scale Gate 1, diagnostics, mastery, automatic sequencing, summative use, PV, paragraph completion, or target-equivalent completion claim
```

## Policy Requirements

The policy must preserve this distinction:

| Dimension | Exit ticket | Advisory short check |
| --- | --- | --- |
| Authority | target-equivalent candidate | advisory |
| Operation proof | same-level operation-chain proof | may be partial-skill rather than full target chain |
| Teaching flow | no hint-heavy teaching flow | route advice allowed |
| Hints | no hint-heavy learning path | local hints allowed only hidden/collapsible or after attempt |
| Completion wording | completion language held unless approved | no completion-language claim |
| Proof states | proof states required | proof states required before rendered adoption, but never as target-equivalent proof |

## Validation Plan

```text
node build-scripts/references/check-layout-registry.js
node build-scripts/references/check-interaction-policy.js
node build-scripts/sprints/check-golden-exercise-workbench.js
node build-scripts/sprints/check-short-check-workbench-policy1.js
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
npm.cmd run agent:index
npm.cmd run check:platform
git diff --check
git -C C:\Projects\4veco\4veco-lessen status --short --branch
```

Review targets:

```text
exit-ticket/short-check distinction >= 9.0
advisory-copy safety >= 9.0
layout transferability >= 8.5
future-agent usability >= 8.5
no metric below 8.0
```
