# Sprint REF-CP6: Lead Review Assignment

## Scope

Review REF-CP6 as a non-mutating CP-6 remediation/readiness sprint.

The lead reviewer must decide whether the sprint bundle is ready for closure as review readiness only. It must not be treated as CP-6 closure, Year-1 closure, protected mutation authority, target-exercise promotion, placeholder finalization, or lesson-output approval.

## Required evidence to inspect

- `reports/sprints/REF-CP6-plan.md`
- `reports/sprints/REF-CP6-baseline.md`
- `reports/sprints/REF-CP6-result.md`
- `reports/sprints/REF-CP6-diff-summary.md`
- `references/data/sprints/REF-CP6.plan.json`
- `references/data/sprints/REF-CP6.result.json`
- `references/data/sprints/REF-CP6-remediation-readiness.json`
- `reports/reference-planning/REF-CP6-remediation-readiness.md`
- `reports/reference-planning/REF-CP6-blocker-routing.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/review-packet.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/review-packet.json`
- `build-scripts/references/build-ref-cp6-remediation-readiness.js`
- `build-scripts/references/check-ref-cp6-remediation-readiness.js`
- `references/data/sprints/REF-CT1-year1-coverage.json`
- `references/data/sprints/REF-CT2-precision-dual-coding-audit.json`
- `reports/reference-planning/REF-CT2-cp6-status-update.md`
- `references/reference-team-roadmap.md`

## Required checks

- Verify REF-CP6 preserves 12 active-v5 Book 1 records and 0 CP-6 quality-ready records.
- Verify it routes all known blockers: 3 placeholders, 2 source/lesson topic mismatches, 9 backfill candidates, 9 legacy quality-ref records, 1 remaining `1.1.3` Part A `FLAG`, and 9 migrated records needing final review.
- Verify it prepares `GATE-CP6-year-1-paragraph-coverage` as a review packet only; no interview or closure is written.
- Verify the review packet lists the full planned question list before the future interview and includes one-question-at-a-time protocol, answer recording, pattern analysis, targeted follow-ups, closure proposal, and explicit human confirmation.
- Verify it does not mutate or authorize mutation of `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen`.
- Verify it does not claim CP-6 closure, Year-1 closure, target-exercise promotion, placeholder finalization, student diagnostics, adaptive routing, mastery, automatic sequencing, student-facing AI, summative use, PV projection, or student-facing output.
- Verify the likely next step is either formal `GATE-CP6-year-1-paragraph-coverage` human review or an explicitly inserted narrower remediation sprint before that gate.

## Expected validation evidence

The main agent must run and report:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REF-CP6-plan.md
node build-scripts/sprints/check-sprint-bundle.js REF-CP6
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/references/build-ref-cp6-remediation-readiness.js
node build-scripts/references/check-ref-cp6-remediation-readiness.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/REF-CP6-result.md
```

Final complete-bundle validation is expected only after round-2 lead-review metadata is recorded:

```bash
node build-scripts/sprints/check-sprint-bundle.js REF-CP6 --complete
```

## Required output

Produce a `Lead Review Summary` with the standard sections from `agents/lead-reviewer-agent.md`.

Round 1 may return `PASS`, `PASS WITH FLAGS`, `REVISE`, `FAIL`, or `PAUSE`. If Round 1 requires corrections, list exact corrections. Round 2 must recheck the corrected bundle.
