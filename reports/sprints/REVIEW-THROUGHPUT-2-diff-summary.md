# Sprint REVIEW-THROUGHPUT-2: Diff Summary

Generated: 2026-06-14

## Summary

This diff adds a shared review-throughput field helper, tests it, adopts it in
selected MTU human-gate packet builders, and validates the adopted JSON packet
envelopes. It also records the decision not to add a broad CI gate until
historical packets are migrated or an active-packet allowlist exists.

## Changed surfaces

- `build-scripts/review-gates/review-throughput-fields.js`
- `build-scripts/review-gates/review-throughput-fields.test.js`
- `build-scripts/references/build-mtu-h2e-conditional-lane-execution-packet.js`
- `build-scripts/references/build-mtu-h4b-answer-form-cli-execution-packet.js`
- `build-scripts/references/check-mtu-h4b-answer-form-cli-execution-packet.js`
- `reports/review-gates/GATE-MTU-H2E-conditional-lane-execution/review-packet.json`
- `reports/review-gates/GATE-MTU-H4B-answer-form-cli-execution/review-packet.json`
- `docs/review/pr-throughput-policy.md`
- `reports/sprints/REVIEW-THROUGHPUT-2-*`
- `references/data/sprints/REVIEW-THROUGHPUT-2.plan.json`
- `references/data/sprints/REVIEW-THROUGHPUT-2.result.json`
- `references/reference-team-roadmap.md`

## Protected surfaces

No protected reference data changed. `references/machine/` and
`references/external/` remain unmodified. No generated lesson output, product
authority, diagnostics, mastery, PV, Scale Gate 1, student-facing AI,
summative use, or student/product-use authority changed.

## CI decision

`reports/sprints/REVIEW-THROUGHPUT-2-ci-decision.md` keeps repository-wide CI
promotion as a named follow-up because archived review packets predate the new
throughput field contract.
