# Sprint Log Bundles

This folder is the home for new and currently-active sprint logs.

Each sprint bundle should keep its operational plan beside the rest of its log:

- `reports/sprints/<sprint-id>-plan.md`
- `reports/sprints/<sprint-id>-baseline.md`
- `reports/sprints/<sprint-id>-result.md`
- `reports/sprints/<sprint-id>-diff-summary.md`
- `reports/sprints/<sprint-id>-lead-review-assignment.md`
- `reports/sprints/<sprint-id>-lead-review-round1.md`
- `reports/sprints/<sprint-id>-lead-review-corrections.md`
- `reports/sprints/<sprint-id>-lead-review-round2.md`

Metadata remains under `references/data/sprints/`:

- `references/data/sprints/<sprint-id>.plan.json`
- `references/data/sprints/<sprint-id>.result.json`

Completed sprint bundles with `lead_review_required: true` must record one
lead-review pass, one correction pass, and one lead-review recheck. If the
recheck verdict is not `PASS` or `PASS WITH FLAGS`, stop and report back instead
of closing the sprint.

Archived plans under `docs/sprints/` remain valid for legacy bundles. New sprint
plans should not be split away from their baseline, result, diff, and review
logs.
