# Sprint Records

This folder stores sprint plans for reference/platform infrastructure work.

Each sprint should have:

- `docs/sprints/<sprint-id>-plan.md`
- `references/data/sprints/<sprint-id>.plan.json`
- `reports/sprints/<sprint-id>-baseline.md`
- `reports/sprints/<sprint-id>-result.md`
- `reports/sprints/<sprint-id>-diff-summary.md`
- `references/data/sprints/<sprint-id>.result.json`

## Commit And Tag Flow

1. Create or update the sprint plan.
2. Record baseline checks before implementation.
3. Implement only the declared allowed paths.
4. Run the acceptance tests named in the plan.
5. Record result and diff summary.
6. Commit only the sprint files and scoped implementation changes.
7. Tag completed sprint checkpoints as `refsprint-<sprint-id>-complete` when the user asks for a release-style checkpoint.

Do not use sprint records to bypass protected reference surfaces. `references/machine/` and `references/external/` remain read-only except through their intended CLI or refresh workflows.
