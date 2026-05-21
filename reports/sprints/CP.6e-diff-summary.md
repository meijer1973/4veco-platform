# Sprint CP.6e: Diff Summary

## Summary

CP.6e adds a focused non-mutating `1.1.3` Part A re-review packet and records failed clearance for the remaining figure-numbering flag.

## Primary additions

- `build-scripts/references/build-cp6e-113-part-a-rereview.js`
- `build-scripts/review-gates/check-cp6e-113-part-a-rereview.js`
- `references/data/sprints/CP.6e-113-part-a-rereview.json`
- `reports/reference-planning/CP.6e-113-part-a-rereview.md`
- `reports/reference-planning/CP.6e-113-part-a-remediation-handoff.md`
- CP.6e sprint plan, baseline, planning review, result, diff summary, and lead-review logs under `reports/sprints/`
- `references/data/sprints/CP.6e.plan.json`
- `references/data/sprints/CP.6e.result.json`

## Evidence changes

- Records current live `1.1.3` figure first-use sequence as `1 -> 3 -> 2`.
- Records expected first-use sequence as `1 -> 2 -> 3`.
- Records that the focused Part A flag is not cleared.
- Records the repeated worked example in `opgaven.md` as accepted standalone-exercise scaffolding, not the remaining hard blocker.
- Produces a remediation handoff for lesson-side correction/regeneration.

## Roadmap changes

- Archive `v2.58-cp6d-graph-heavy-evidence-upgrade`.
- Update active roadmap to `v2.59-cp6e-113-part-a-failed-clearance`.
- Move CP.6e into Closed Sprints as failed-clearance evidence.
- Keep CP-6 and Year 1 open.
- Make the next operational action a lesson-side `1.1.3` Part A remediation/recheck route, not EX-0 or a closure proposal.

## Protected surfaces

Protected surfaces were not changed:

- no `references/machine/` mutation;
- no `references/external/` mutation;
- no target-exercise registry mutation;
- no active v5 blueprint mutation;
- no lesson-output mutation;
- no lesson review/quality-ref hand patching.

## Generated surfaces

Normal report/map/index refresh updated reference reports, dashboard data, GitHub-agent indexes, URL index, source manifest, document inventory, and source-document registry surfaces.

## Risk notes

CP.6e deliberately does not clear the blocker. CP-6 unconditioned closure remains blocked while `1.1.3` Part A figure numbering remains unresolved in live lesson output.
