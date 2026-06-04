# TASK-INGEST-TRANSFORM-3-TEXTBOOK Planning Review
Sprint: `TASK-INGEST-TRANSFORM-3-TEXTBOOK`
Verdict: REVISE

## Evidence Inspected

- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-plan.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-baseline.md`
- `references/data/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK.plan.json`
- `references/reference-team-roadmap.md` rows `TASK-INGEST-TRANSFORM-3-TEXTBOOK` and `GATE-SHARED-TASK-INGEST-REPAIR-1`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-result.md`
- `build-scripts/sprints/check-sprint-plan.js`
- `build-scripts/sprints/check-sprint-result.js`
- `build-scripts/sprints/check-sprint-bundle.js`
- `package.json`

## Plan Readiness

The plan is substantially ready on roadmap substance. It states a clear quality floor, names the specification requirements, lists the needed evidence, preserves the lead-review gate, and defers human-review comments to `GATE-SHARED-TASK-INGEST-REPAIR-1`. It also correctly frames the output as a review-only textbook-source transformation rather than student-facing production output.

The source-authority boundary is well handled: the plan requires an owned textbook source label, forbids `external_primary`, rejects official-exam or exam-equivalence wording, and names protected reference and Book 1 output paths as read-only. The baseline explicitly records the 50 percent interval ambiguity and requires source values plus calculation evidence instead of hiding the ambiguity.

## Required Corrections Before Implementation

1. In `references/data/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK.plan.json`, change the acceptance command `node build-scripts/sprints/check-sprint-plan.js TASK-INGEST-TRANSFORM-3-TEXTBOOK` to `node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-plan.md`.

2. In `references/data/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK.plan.json`, change the acceptance command `node build-scripts/sprints/check-sprint-result.js TASK-INGEST-TRANSFORM-3-TEXTBOOK` to `node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-result.md`.

3. Replace `npm.cmd run validate:report-json` in both the markdown plan and plan JSON with `node build-scripts/reports/validate-report-json.js`, unless a `validate:report-json` package script is added before implementation. `package.json` does not currently define that npm script.

4. In the plan Inputs section, replace nonexistent `../4veco-lessen/references/reference-team-roadmap.md` with the actual lesson roadmap path `../4veco-lessen/lessen-team-roadmap.md` if the lesson roadmap is part of closure.

## Non-Blocking Notes

- The generated-output list is explicit and operational enough for implementation.
- The plan should carry the baseline's two valid 50 percent intervals into the checker, answer-form trace, and reviewer notes so the ambiguity remains visible at proof time.
- `check-sprint-bundle.js TASK-INGEST-TRANSFORM-3-TEXTBOOK --active` should be acceptable because the bundle checker ignores unknown non-complete flags, but the active flag is not a meaningful validator mode in the script.

## Generated Output Check

The plan explicitly names the generated output bundle: task-set JSON, proof JSON, source map, visual variant map, operation-chain trace, answer-form trace, task-family map, reviewer notes, rendered lab, screenshot manifest, three screenshot files, capture script, checker script, lead-review files, result files, and diff summary. It also says this generated output is review-only and not a student-facing deployment.

## Stop Conditions Check

Stop conditions are adequate. The plan stops on missing operational details, planning-review blockers, unsupported task-family validation, unmapped source fragments, missing screenshots or proof JSON, validator failure, lead-review failure, and protected-path writes.

## Final Recommendation

Revise the plan and plan JSON for the four command/path corrections above, then proceed with implementation. No roadmap, source-authority, protected-path, ambiguity, generated-output, or stop-condition blocker remains after those corrections.
