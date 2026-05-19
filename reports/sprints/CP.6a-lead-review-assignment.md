# Sprint CP.6a: Lead Review Assignment

## Scope

Review CP.6a as a non-mutating lesson-side alignment-plan sprint.

The lead reviewer must decide whether CP.6a can close as alignment planning only. It must not be treated as lesson-output remediation completion, CP-6 closure, Year-1 closure, protected mutation authority, target-exercise promotion, placeholder finalization, or unit minting.

## Required evidence to inspect

- `reports/sprints/CP.6a-plan.md`
- `reports/sprints/CP.6a-baseline.md`
- `reports/sprints/CP.6a-planning-review.md`
- `reports/sprints/CP.6a-result.md`
- `reports/sprints/CP.6a-diff-summary.md`
- `references/data/sprints/CP.6a.plan.json`
- `references/data/sprints/CP.6a.result.json`
- `references/data/sprints/CP.6a-lesson-side-alignment.json`
- `reports/reference-planning/CP.6a-lesson-side-alignment.md`
- `build-scripts/review-gates/check-cp6a-lesson-side-alignment.js`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/gate-routing-decision.json`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/remediation-lanes.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`

## Required checks

- Verify CP.6a records the active-v5 `1.3.2` and `1.3.3` mismatch.
- Verify it identifies current lesson-side `1.4.1` and `1.4.2` as equivalent material and preserves their `PASS WITH FLAGS` state.
- Verify it maps current lesson-side `Kostenstructuren` and `Opbrengsten` to active-v5 Book 2 `2.1.1` and `2.1.2`.
- Verify it does not claim the source/lesson mismatch is resolved.
- Verify it does not mutate or authorize mutation of protected references or lesson output.
- Verify it does not claim CP-6 closure, Year-1 closure, target-exercise promotion, placeholder finalization, or unit minting.
- Verify the roadmap moves CP.6a to Closed Sprints as planning-only and places CP.6b at the active top row.
- Verify generated maps, dashboard, and indexes were refreshed.
- Verify the likely next step is `CP.6b Year-1 Target-Exercise Review`.

## Expected validation evidence

The main agent must run and report:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6a-plan.md
node build-scripts/sprints/check-sprint-bundle.js CP.6a
node build-scripts/review-gates/check-cp6a-lesson-side-alignment.js
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/CP.6a-result.md
```

Final complete-bundle validation is expected only after round-2 lead-review metadata is recorded:

```bash
node build-scripts/sprints/check-sprint-bundle.js CP.6a --complete
```

## Required output

Produce a `Lead Review Summary` with the standard sections from `agents/lead-reviewer-agent.md`.

Round 1 may return `PASS`, `PASS WITH FLAGS`, `REVISE`, `FAIL`, or `PAUSE`. If Round 1 requires corrections, list exact corrections. Round 2 must recheck the corrected bundle.
