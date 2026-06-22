# REVIEW-THROUGHPUT-3 Lead Review Corrections

Sprint: `REVIEW-THROUGHPUT-3`

## Round-1 verdict

Round 1 returned REVISE with three blocking findings:

- `BF-1`: live readiness could miss unresolved review-thread blockers and mergeability blockers.
- `BF-2`: router normalization did not consume the actual throughput helper/packet field shape.
- `BF-3`: live dry-run evidence retained per-PR decision artifacts in the branch, contradicting the comment-based live decision policy.

## Corrections applied

| Finding | Correction | Evidence |
|---|---|---|
| `BF-1` | `review-pr-readiness.js` now queries PR review threads and requested-changes reviews through GraphQL, records unavailable review-thread evidence as fail-closed proof, and `pr-readiness-router.js` routes explicit merge conflicts or blocked merge state to `KEEP_DRAFT_REVISE`. | `build-scripts/review-gates/review-pr-readiness.js`, `build-scripts/review-gates/pr-readiness-router.js`, `reports/fixtures/pr-readiness-router/merge-conflict-revise.json` |
| `BF-2` | Router normalization now consumes top-level `review_autonomy.level`, top-level `human_decision_required`, nested `review_autonomy.owner_preapproval`, and helper-produced proof fields. Tests now route direct outputs from all L0/L1/L2 helper constructors. | `build-scripts/review-gates/pr-readiness-router.js`, `build-scripts/review-gates/pr-readiness-router.test.js`, `build-scripts/review-gates/review-throughput-fields.js` |
| `BF-3` | Removed per-PR live decision artifacts from the branch and updated the dry-run report to state that live decisions are retained as command-log output or idempotent GitHub comments, not committed per-head branch artifacts. | `reports/sprints/REVIEW-THROUGHPUT-3-live-dry-run.md`, `reports/sprints/REVIEW-THROUGHPUT-3-command-log.jsonl` |

## Recheck evidence

The following post-correction commands have passed in the command log:

- `node node_modules/jest/bin/jest.js build-scripts/review-gates/pr-readiness-router.test.js build-scripts/review-gates/review-throughput-fields.test.js build-scripts/sprints/check-review-throughput-packet.test.js --runInBand`
- `npm.cmd run check:pr-readiness`
- `node build-scripts/review-gates/review-pr-readiness.js --repo meijer1973/4veco-platform --pr 132 --format json`
- `node build-scripts/review-gates/review-pr-readiness.js --repo meijer1973/4veco-platform --pr 133 --format json`
- `node build-scripts/review-gates/apply-pr-readiness-decision.js --fixture-pr reports/fixtures/pr-readiness-router/apply-ready-pr.json --decision reports/fixtures/pr-readiness-router/apply-ready-decision.json --dry-run`
- `npm.cmd run check:branch-protection`
- `git diff --check`

## Round-2 readiness

Ready for round 2 after final validation and generated-index refresh. Subsequent
changes to router, collector, executor, policy, schema, fixtures, or evidence
records require re-review.
