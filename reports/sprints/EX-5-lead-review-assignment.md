# Sprint EX-5: Lead Review Assignment

## Scope

Review the completed EX-5 bundle for governance, evidence completeness, and
boundary preservation.

## Required checks

- Verify `reports/sprints/EX-5-plan.md`, baseline, planning review, result,
  diff summary, and metadata exist.
- Verify the operation/answer-skill contract is design-only.
- Verify no future candidate-storage files were created.
- Verify q19 source/graph gaps remain blocking.
- Verify q3 and q15 answer-skill needs remain visible.
- Verify GATE-EX5 includes calibration questions, one-question-at-a-time
  interview protocol, pattern analysis, targeted follow-ups, closure proposal,
  and explicit human confirmation.
- Verify no protected mutation, lesson output, closure, or product-use
  authority is granted.

## Files to inspect

- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.md`
- `references/schemas/operation-answer-skill-contract.schema.json`
- `build-scripts/references/check-ex5-operation-answer-skill-contract.js`
- `reports/review-gates/GATE-EX5-operation-answer-skill-contract/review-packet.md`
- `reports/review-gates/GATE-EX5-operation-answer-skill-contract/review-packet.json`
- `references/reference-team-roadmap.md`

## Expected outcome

Return `PASS`, `PASS WITH FLAGS`, or `REVISE`. Any finding that authorizes
mutation, hides q19 blockers, hides q3/q15 answer-skill needs, or skips the
human gate should be a blocker.
