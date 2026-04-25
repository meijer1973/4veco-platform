# Sprint Records

This folder stores sprint plans for reference/platform infrastructure work.

Each sprint should have:

- `docs/sprints/<sprint-id>-plan.md`
- `references/data/sprints/<sprint-id>.plan.json`
- `reports/sprints/<sprint-id>-baseline.md`
- `reports/sprints/<sprint-id>-result.md`
- `reports/sprints/<sprint-id>-diff-summary.md`
- `references/data/sprints/<sprint-id>.result.json`

## Planning Standard

A sprint plan must fully operationalize the roadmap sprint. It is not enough to list outputs.

Every sprint plan must include an `Operationalized sprint procedure` section that explains:

- exact work sequence
- roadmap instructions carried forward
- decision points and stop conditions
- required artifacts
- validators and acceptance tests
- human-review protocol when relevant

If a roadmap instruction is not represented in the sprint plan, the plan is incomplete. Fix the plan before executing the sprint.

## Agent Structure

Use separated review roles for substantial sprints:

- planning/review subagent: checks the outline, baseline needs, required logs, stop conditions, and missing roadmap instructions
- main agent: executes the sprint and integrates changes
- specialist subagents: review bounded pedagogy, evidence, data-integrity, code, or dashboard questions when needed
- verification subagent: checks finished artifacts or test evidence before completion when risk is meaningful

The main agent remains accountable for the final state.

## Deterministic Bundle Check

Use `build-scripts/sprints/check-sprint-bundle.js` to verify sprint logging completeness.

For a planned or active sprint:

```bash
node build-scripts/sprints/check-sprint-bundle.js R2.3
```

For a completed sprint:

```bash
node build-scripts/sprints/check-sprint-bundle.js R2.2 --complete
```

The bundle checker verifies the mechanical evidence trail. It does not replace human review, subagent review, or pedagogical judgement.

## Commit And Tag Flow

1. Create or update the sprint plan.
2. Record baseline checks before implementation.
3. Implement only the declared allowed paths.
4. Run the acceptance tests named in the plan.
5. Record result and diff summary.
6. Run `node build-scripts/sprints/check-sprint-bundle.js <sprint-id> --complete`.
7. Commit only the sprint files and scoped implementation changes.
8. Tag completed sprint checkpoints as `refsprint-<sprint-id>-complete` when the user asks for a release-style checkpoint.

Do not use sprint records to bypass protected reference surfaces. `references/machine/` and `references/external/` remain read-only except through their intended CLI or refresh workflows.
