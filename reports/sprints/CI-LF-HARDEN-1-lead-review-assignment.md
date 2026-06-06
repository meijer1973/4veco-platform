# Lead Review Assignment: CI-LF-HARDEN-1

Date: 2026-06-06

Scope: lead reviewer checks the scoped LF policy, line-ending checker, CI
workflow integration, command-log evidence, and protected-surface boundary for
`CI-LF-HARDEN-1`.

Evidence to inspect:

- `reports/sprints/CI-LF-HARDEN-1-plan.md`
- `reports/sprints/CI-LF-HARDEN-1-baseline.md`
- `build-scripts/ci/check-evidence-line-endings.js`
- `build-scripts/ci/check-evidence-line-endings.test.js`
- `reports/sprints/CI-LF-HARDEN-1-command-log.jsonl`
- `references/reference-team-roadmap.md`

Lead reviewer: main agent acting in the required lead-review role after local
implementation evidence is available.

Decision rule: PASS only if the policy is narrow, the checker passes on the
selected evidence surfaces, generated lesson output and protected references
remain untouched, and any broad historical CRLF churn is named rather than
hidden.
