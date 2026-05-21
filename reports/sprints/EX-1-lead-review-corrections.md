# EX-1 Lead Review Corrections

Date: 2026-05-21

Round 1 verdict: PASS WITH FLAGS

## Corrections Applied

No content corrections were required.

The correction pass records the round-1 review and updates the sprint state from pending round-1 review to pending round-2 recheck. The flags are procedural and must remain visible:

- complete closure waits for round-2 review;
- `check-exam-ingestion-pilots.js` remains required alongside the EX-0 contract checker;
- q19 remains blocked by visible `source_annex_gap` and `graph_object_gap` records until later source-annex/graph extraction or human acceptance.

## Validation After Correction Pass

Run before round-2 recheck:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-1
node build-scripts/sprints/check-sprint-result.js reports/sprints/EX-1-result.md
node build-scripts/references/check-exam-ingestion-contract.js
node build-scripts/references/check-exam-ingestion-pilots.js
```

## Next Action

Request round-2 lead-review recheck. If round 2 returns `PASS` or `PASS WITH FLAGS`, save the round-2 log, set final lead-review metadata, run complete-bundle validation, refresh maps one final time, then commit, tag, and push.
