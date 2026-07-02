# REVIEW-THROUGHPUT-3 Lead Review Assignment

Sprint: `REVIEW-THROUGHPUT-3`

## Scope

Lead reviewer: inspect the PR Readiness Reviewer role, routing policy, schema,
pure classifier, live read-only reviewer, safe apply executor, throughput
helper constructors, fixtures, tests, branch-protection evidence, live dry-run
evidence, sprint plan/baseline, and command-log evidence.

## Evidence

- `agents/pr-readiness-reviewer-agent.md`
- `agents/README.md`
- `agents/lead-reviewer-agent.md`
- `docs/review/pr-readiness-routing-policy.md`
- `docs/review/pr-readiness-decision.schema.json`
- `docs/review/pr-throughput-policy.md`
- `build-scripts/review-gates/pr-readiness-router.js`
- `build-scripts/review-gates/pr-readiness-router.test.js`
- `build-scripts/review-gates/review-pr-readiness.js`
- `build-scripts/review-gates/apply-pr-readiness-decision.js`
- `build-scripts/review-gates/review-throughput-fields.js`
- `build-scripts/review-gates/review-throughput-fields.test.js`
- `reports/fixtures/pr-readiness-router/`
- `reports/sprints/REVIEW-THROUGHPUT-3-branch-protection.md`
- `reports/sprints/REVIEW-THROUGHPUT-3-live-dry-run.md`
- `reports/sprints/REVIEW-THROUGHPUT-3-command-log.jsonl`

## Reviewer

Use lead-review schema version 3. Confirm that the implementation satisfies the
handoff requirements, keeps read-only review separate from mutation, refuses
stale decisions, records branch-protection limits without weakening
protection, classifies review-governance/self-modification as human review,
and does not change protected references, generated lesson output, product
authority outside review-routing policy, diagnostics, mastery, PV, Scale Gate
1, or student/product-use authority.
