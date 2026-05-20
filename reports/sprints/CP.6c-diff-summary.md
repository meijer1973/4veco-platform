# Sprint CP.6c: Diff Summary

## Summary

CP.6c adds a non-mutating Year-1 MTU backfill classification packet and moves the references roadmap from CP.6c to CP.6d.

## Primary additions

- `build-scripts/references/build-cp6c-mtu-backfill-classification.js`
- `build-scripts/review-gates/check-cp6c-mtu-backfill-classification.js`
- `references/data/sprints/CP.6c-mtu-backfill-classification.json`
- `reports/reference-planning/CP.6c-mtu-backfill-classification.md`
- CP.6c sprint plan, baseline, planning review, result, diff summary, and lead-review logs under `reports/sprints/`
- `references/data/sprints/CP.6c.plan.json`
- `references/data/sprints/CP.6c.result.json`

## Roadmap changes

- Archived `v2.56-cp6b-target-exercise-review`.
- Updated active roadmap to `v2.57-cp6c-mtu-backfill-classification`.
- Moved CP.6c into Closed Sprints.
- Moved CP.6d to the active top ledger row.

## Protected surfaces

Protected surfaces were not changed:

- no `references/machine/` mutation;
- no `references/external/` mutation;
- no target-exercise registry mutation;
- no active v5 blueprint mutation;
- no lesson-output mutation.

## Generated surfaces

Normal report/map/index refresh updated reference reports, dashboard data, GitHub-agent indexes, URL index, source manifest, and document inventory.

## Risk notes

CP.6c is not mutation authority. Six candidates now map to live units, one normal/inferior-goods item remains a merge/design candidate, one kink edge case is deferred, and one simultaneous-shift operation is a true missing candidate for later governed review. CP.6d and CP.6e remain required before any responsible CP-6 closure proposal.
