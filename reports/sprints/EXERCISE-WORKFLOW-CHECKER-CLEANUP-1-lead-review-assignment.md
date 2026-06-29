# Lead Review Assignment: EXERCISE-WORKFLOW-CHECKER-CLEANUP-1

Sprint: `EXERCISE-WORKFLOW-CHECKER-CLEANUP-1`

Reviewer: subagent lead reviewer

## Scope

Review the completed checker/evidence cleanup for the current split
exit-ticket source model. Evidence inspected should include changed checkers,
active evidence JSON, gate-packet checker changes, sprint result files, and
the sprint command log.

## Evidence to inspect

- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-plan.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-result.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-diff-summary.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-quality-log.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-command-log.jsonl`
- `build-scripts/sprints/check-exercise-workflow-checker-cleanup.js`
- `build-scripts/sprints/check-standard-exercises1-coverage.js`
- `build-scripts/sprints/check-task-shell-ux2.js`
- `build-scripts/sprints/check-l1-7b-q2-implementation.js`
- `build-scripts/sprints/check-l1-7b-q2-copy.js`
- `build-scripts/sprints/check-l1-7b-q2-d31-struct.js`
- `build-scripts/sprints/check-check-short-exit1-inventory.js`
- `build-scripts/sprints/check-math-ux2-route-output.js`
- `build-scripts/sprints/check-reason-ux2-route-output.js`
- `build-scripts/review-gates/check-gate-l1-7b-q2-review-packet.js`
- `reports/json/standard-exercise-family-coverage.json`
- `reports/json/check-short-exit-inventory.json`
- `reports/json/procedure-visual-inventory.json`
- `reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/review-packet.json`

## Review questions

1. Do live validators now prove the current split source model instead of
   masking stale paths?
2. Do active evidence records cite existing current files as current evidence?
3. Are historical unsuffixed references either removed from active evidence or
   explicitly guarded as legacy/unsuffixed?
4. Are source-data, generated lesson output, engines, protected references,
   target registry, candidate storage, product authority, and student-use
   boundaries intact?
5. Is the command-log evidence sufficient for PR readiness?

## Required verdict

Return `PASS` only if there are no blocking findings and no missing core
requirement. If there are issues, classify each finding using REV-STD-1:
`core_requirement_met`, `quality_improvement_available`, `minor_carry_flag`,
`scale_blocker`, or `core_spec_failure`; include `blocks`,
`does_not_block`, and `proof_required_to_close`.
