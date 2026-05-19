# Sprint REF-CT0: Lead Review Assignment

Assigned on: 2026-05-19

## Scope

Review the completed `REF-CT0` sprint bundle after the sprint-log consolidation
update. The review must decide whether the REF-CT0 closure evidence is complete
enough for off-site GitHub review and whether any corrections are required
before the sprint remains closed.

## Requested outcome

Produce a `Lead Review Summary` using the format in
`agents/lead-reviewer-agent.md`, with one of these verdicts:

- `PASS`
- `PASS WITH FLAGS`
- `REVISE`
- `FAIL`
- `PAUSE`

Treat `REVISE`, `FAIL`, and `PAUSE` as non-closing outcomes.

## Evidence to inspect

- `reports/sprints/REF-CT0-plan.md`
- `reports/sprints/REF-CT0-baseline.md`
- `reports/sprints/REF-CT0-result.md`
- `reports/sprints/REF-CT0-diff-summary.md`
- `references/data/sprints/REF-CT0.plan.json`
- `references/data/sprints/REF-CT0.result.json`
- `references/data/sprints/REF-CT0-mtu-classification.json`
- `reports/reference-planning/REF-CT0-source-authority-boundary.md`
- `reports/reference-planning/REF-CT0-three-year-prototype.md`
- `reports/reference-planning/REF-CT0-mtu-classification.md`
- `reports/reference-planning/REF-CT0-candidate-review-packet.md`
- `build-scripts/references/build-ref-ct0-planning-artifacts.js`
- `build-scripts/references/check-ref-ct0-planning-artifacts.js`
- `build-scripts/sprints/check-sprint-bundle.js`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/roadmap-version-index.json`

## Required checks

- Confirm the REF-CT0 plan is co-located with the sprint logs under
  `reports/sprints/`.
- Confirm REF-CT0 preserves its non-mutating source boundary: no protected
  `references/machine/` or `references/external/` mutation, no target-exercise
  mutation, no unit minting, no student-facing output authorization, and no
  promotion of the rough blueprint into owned authority.
- Confirm result and diff logs point to the same evidence as the plan metadata.
- Confirm the lead-review cycle is represented structurally in the plan and
  bundle tooling.
- Confirm off-site reviewers can use GitHub-facing maps once the normal map
  refresh is run.
- Identify any required corrections before the round-2 recheck.

## Commands expected before final close

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REF-CT0-plan.md
node build-scripts/sprints/check-sprint-bundle.js REF-CT0 --complete
node build-scripts/references/check-ref-ct0-planning-artifacts.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
```

The round-1 review may request corrections before all final map/inventory
checks pass, because the correction pass and recheck are now part of the sprint
closure procedure.
