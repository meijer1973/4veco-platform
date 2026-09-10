# Lead Review Assignment: CI-EVIDENCE-1

Date: 2026-06-06

Scope: lead reviewer checks the cross-repo checkout evidence helper, workflow
artifact path, local evidence JSON readback, and cleanliness boundary for
`CI-EVIDENCE-1`.

Evidence to inspect:

- `reports/sprints/CI-EVIDENCE-1-plan.md`
- `reports/sprints/CI-EVIDENCE-1-baseline.md`
- `build-scripts/ci/platform-ci-evidence.js`
- `build-scripts/ci/platform-ci-evidence.test.js`
- `reports/sprints/CI-EVIDENCE-1-command-log.jsonl`
- `.github/workflows/platform-ci.yml`

Lead reviewer: main agent acting in the required lead-review role after local
implementation evidence is available.

Decision rule: PASS only if evidence is written outside both checked-out repos,
records both platform and lessen SHAs, validates required fields, and is
uploaded through the existing diagnostic artifact path.
