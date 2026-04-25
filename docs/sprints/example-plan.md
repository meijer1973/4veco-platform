# Sprint EXAMPLE: Example Sprint Plan

## Goal

Demonstrate the required sprint-plan structure.

## Context

This example exists so `build-scripts/sprints/check-sprint-plan.js` has a known-good fixture.

## Allowed paths

- `docs/sprints/`
- `reports/sprints/`

## Forbidden paths

- `references/machine/`
- `references/external/`

## Inputs

- `references/final-codex-handoff-roadmap.md`

## Outputs

- `reports/sprints/example-result.md`

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/example-plan.md
node build-scripts/sprints/check-sprint-result.js reports/sprints/example-result.md
```

## Rollback plan

Delete the example sprint files if the scaffold is rejected.

## Human review required

Human review is required before using this example as a production sprint.

