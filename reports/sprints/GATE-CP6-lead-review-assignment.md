# Sprint GATE-CP6: Lead Review Assignment

## Scope

Review GATE-CP6 as a non-closing human routing decision sprint.

The lead reviewer must decide whether the sprint bundle is ready for closure as routing only. It must not be treated as CP-6 closure, Year-1 closure, protected mutation authority, target-exercise promotion, placeholder finalization, unit minting, or lesson-output approval.

## Required evidence to inspect

- `reports/sprints/GATE-CP6-plan.md`
- `reports/sprints/GATE-CP6-baseline.md`
- `reports/sprints/GATE-CP6-result.md`
- `reports/sprints/GATE-CP6-diff-summary.md`
- `references/data/sprints/GATE-CP6.plan.json`
- `references/data/sprints/GATE-CP6.result.json`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/review-packet.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/review-packet.json`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/human-interview.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/human-interview.json`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/gate-routing-decision.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/gate-routing-decision.json`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/remediation-lanes.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/remediation-lanes.json`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/bundle-urls.md`
- `build-scripts/review-gates/check-gate-cp6-routing-decision.js`
- `references/data/sprints/REF-CP6-remediation-readiness.json`
- `reports/reference-planning/REF-CP6-remediation-readiness.md`
- `reports/reference-planning/REF-CP6-blocker-routing.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`

## Required checks

- Verify the human answer set records all nine CP-6 answers and says the full question list was shown first.
- Verify the decision status is `routing_decision_recorded_not_closed`.
- Verify no closure proposal was drafted and no `gate-closure.json` exists.
- Verify CP-6 and Year 1 remain open.
- Verify no protected mutation, lesson-output mutation, target-exercise promotion, placeholder finalization, or unit minting is authorized.
- Verify the five remediation lanes are present: `CP.6a`, `CP.6b`, `CP.6c`, `CP.6d`, and `CP.6e`.
- Verify the roadmap moves `GATE-CP6` to Closed Sprints as routing-only and places `CP.6a` at the top of the active Sprint Ledger.
- Verify generated maps and indexes were refreshed.
- Verify the likely next step is `CP.6a Book 1 Chapter 1.3 Lesson-Side Alignment`.

## Expected validation evidence

The main agent must run and report:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GATE-CP6-plan.md
node build-scripts/sprints/check-sprint-bundle.js GATE-CP6
node build-scripts/review-gates/check-gate-cp6-routing-decision.js
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run agent:index
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-CP6-year-1-paragraph-coverage
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/GATE-CP6-result.md
```

Final complete-bundle validation is expected only after round-2 lead-review metadata is recorded:

```bash
node build-scripts/sprints/check-sprint-bundle.js GATE-CP6 --complete
```

## Required output

Produce a `Lead Review Summary` with the standard sections from `agents/lead-reviewer-agent.md`.

Round 1 may return `PASS`, `PASS WITH FLAGS`, `REVISE`, `FAIL`, or `PAUSE`. If Round 1 requires corrections, list exact corrections. Round 2 must recheck the corrected bundle.
