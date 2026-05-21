# EX-1 Lead Review Round 1

Date: 2026-05-21

Reviewer: lead reviewer agent

Verdict: PASS WITH FLAGS

## Summary

The EX-1 bundle is ready for the correction/recheck cycle. No file edits were made by the reviewer.

## Findings

1. Exactly three pilot records are present across the item, answer-model, and source-annex overlays: q3, q19, and q15.

2. The graph/source-heavy item q19 is not `reviewed_ready_for_mapping`. It is `reviewed_with_gaps`, carries `source_annex_gap` and `graph_object_gap`, and the source-annex mirror keeps both blocking gap IDs visible.

3. Product and mutation boundaries are explicit and false in the overlays. The reviewer observed no changes in `references/external`, `references/machine`, authored target exercises, owned blueprint files, or `../4veco-lessen`.

4. Validator coverage is sufficient for EX-1. `check-exam-ingestion-pilots.js` enforces the exact item set, no ready-for-mapping status, blocking q19 gaps, no product authorization, and no MTU mutation authorization.

5. The EX-0 checker was not materially weakened. It still validates the EX-0 contract and permits pilot files only when the closed GATE-EX0 authorization and pilot validator exist.

## Validation Evidence

The reviewer ran:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-1
node build-scripts/sprints/check-sprint-result.js reports/sprints/EX-1-result.md
node build-scripts/references/check-exam-ingestion-contract.js
node build-scripts/references/check-exam-ingestion-pilots.js
```

All passed.

## Flags To Carry

- Closure is not yet possible while `references/data/sprints/EX-1.result.json` is still `pending_lead_review`, final verdict is `PENDING`, and `check-sprint-bundle.js EX-1 --complete` is expected to fail.
- Keep running `check-exam-ingestion-pilots.js` alongside the EX-0 contract checker; the contract checker verifies authorization and validator presence, while the pilot checker validates the actual pilot data.

## Next Action

Record this round-1 review, record the correction pass, run round-2 lead-review recheck, then update final metadata only after round 2 returns `PASS` or `PASS WITH FLAGS`.
