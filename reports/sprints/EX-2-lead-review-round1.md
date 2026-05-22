# EX-2 Lead Review Round 1

Date: 2026-05-22

Reviewer: lead reviewer agent

Verdict: PASS WITH FLAGS

## Summary

The EX-2 closure bundle is substantively ready. The gate closure stays
classification and routing only: it records reviewed mappings, authorizes only
EX-3 dashboard/reporting work, and does not authorize protected mutation,
external-source mutation, unit minting, operation/answer-skill mutation, lesson
output, CP-6/Year-1 closure, or student/product use.

No file edits were made by the reviewer.

## Findings

1. The human interview and gate closure artifacts exist and record
   `pass_with_conditions` for routing only.

2. The q3 correction is present: `q3-calc-1` remains
   `operation_registry_need`, `A61` is recorded as support, and `A15` is marked
   stale/incorrect for this task.

3. The q19 correction is present: `A42` is added as a graph-shift candidate,
   `D10` remains support, `A45` is downgraded to weak support, and both
   `q19-source-annex-gap` and `q19-graph-object-gap` remain blocking.

4. q3 and q15 answer-model wording remain `answer_skill_need`.

5. The closure preserves the no-mutation and no-student/product-use boundary.

## Validation Evidence

The reviewer ran:

```powershell
node build-scripts\references\check-exam-to-mtu-mapping-gate.js
node build-scripts\review-gates\validate-gate.js reports\review-gates\GATE-EX2-exam-to-mtu-mapping\gate-closure.json
node build-scripts\sprints\check-sprint-plan.js reports\sprints\EX-2-plan.md
node build-scripts\sprints\check-sprint-bundle.js EX-2
node build-scripts\sprints\check-sprint-result.js reports\sprints\EX-2-result.md
node build-scripts\sprints\check-sprint-bundle.js EX-2 --complete
git status --short
git status --short -- references\external references\machine references\authored\course-target-exercises.json references\owned\course-blueprint-v5.md
git -C ..\4veco-lessen status --short
```

All focused validators passed except `check-sprint-bundle.js EX-2 --complete`,
which is expected to fail before final metadata and roadmap closure updates.

## Flags To Carry

- `references/data/sprints/EX-2.result.json` is still pre-lead-review with
  `status: pending_lead_review`.
- `check-sprint-bundle.js EX-2 --complete` is expected to fail until result
  JSON is completed.
- `references/reference-team-roadmap.md` still marks EX-2 active and incomplete.
- Final full validation, generated report/index refresh, commit, tag, and push
  remain pending after the lead-review cycle.

## Next Action

Record this round-1 review, perform the correction pass, run round-2 lead-review
recheck, then update final metadata only after round 2 returns `PASS` or
`PASS WITH FLAGS`.
