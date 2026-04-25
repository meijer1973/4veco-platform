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

- `references/reference-team-roadmap.md`

## Outputs

- `reports/sprints/example-result.md`

## Operationalized sprint procedure

1. Read the roadmap or fixture requirement the sprint is meant to demonstrate.
2. Confirm allowed and forbidden paths before making changes.
3. Create or update the declared output files.
4. Run the sprint-plan and sprint-result validators listed below.
5. Stop before any protected reference data change. Human review is required before using this example as a production sprint template.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/example-plan.md
node build-scripts/sprints/check-sprint-result.js reports/sprints/example-result.md
```

## Rollback plan

Delete the example sprint files if the scaffold is rejected.

## Human review required

Human review is required before using this example as a production sprint.
