# Legacy Sprint Plans

This folder stores legacy sprint plans for reference/platform infrastructure work.
New and currently-active sprint plans should live beside their sprint logs under
`reports/sprints/`.

New sprint bundles should have:

- `reports/sprints/<sprint-id>-plan.md`
- `references/data/sprints/<sprint-id>.plan.json`
- `reports/sprints/<sprint-id>-baseline.md`
- `reports/sprints/<sprint-id>-result.md`
- `reports/sprints/<sprint-id>-diff-summary.md`
- `reports/sprints/<sprint-id>-lead-review-assignment.md`
- `reports/sprints/<sprint-id>-lead-review-round1.md`
- `reports/sprints/<sprint-id>-lead-review-corrections.md`
- `reports/sprints/<sprint-id>-lead-review-round2.md`
- `references/data/sprints/<sprint-id>.result.json`

Archived plans already stored in `docs/sprints/` remain valid for historical
bundles. The deterministic bundle checker prefers the co-located
`reports/sprints/<sprint-id>-plan.md` path and falls back to this folder for
legacy records.

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
6. Assign the finished bundle to the lead reviewer agent and record round 1.
7. Apply required corrections or record that no correction was required.
8. Send the corrected bundle for one lead-review recheck and record round 2.
9. Run `node build-scripts/sprints/check-sprint-bundle.js <sprint-id> --complete`.
10. Commit only the sprint files and scoped implementation changes.
11. Push and tag completed sprint checkpoints when a checkpoint tag is part of the roadmap/final-rule flow.

Do not use sprint records to bypass protected reference surfaces. `references/machine/` and `references/external/` remain read-only except through their intended CLI or refresh workflows.
