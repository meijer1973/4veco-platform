# Sprint MTU-EVIDENCE-HARDEN-1: Result

Generated: 2026-06-07

Status: completed MTU evidence-layer hardening sprint; PASS pending final
remote publication and GitHub Actions inspection.

## Plan reference

- Plan: `reports/sprints/MTU-EVIDENCE-HARDEN-1-plan.md`
- Baseline: `reports/sprints/MTU-EVIDENCE-HARDEN-1-baseline.md`
- Plan metadata: `references/data/sprints/MTU-EVIDENCE-HARDEN-1.plan.json`
- Result metadata: `references/data/sprints/MTU-EVIDENCE-HARDEN-1.result.json`

## Summary

`MTU-EVIDENCE-HARDEN-1` found generated-report drift, not protected-reference
drift. The canonical MTU projection remains 256 total units, 253 live units,
and 3 deprecated units, and the stored JSON projection matched the markdown
catalog during the non-mutating audit.

Implemented:

- Added `build-scripts/references/check-mtu-evidence-layer.js`, a read-only
  freshness checker that compares the canonical MTU projection with stored
  JSON and generated report/readiness summaries.
- Wired the checker into `.github/workflows/platform-ci.yml`.
- Regenerated stale generated reports through intended builders.
- Refreshed roadmap/index/dashboard artifacts.
- Recorded the verification review, lead-review cycle, result, diff summary,
  command log, and result metadata.

Remaining stale, missing, or intentionally informational MTU count reports:
none known after the checker pass. Any future checked-report drift now fails
locally and in CI.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-EVIDENCE-HARDEN-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js MTU-EVIDENCE-HARDEN-1` | passed |
| `node build-scripts/references/build-unit-index.js` | passed |
| `node build-scripts/references/validate-core-schemas.js` | passed |
| `node build-scripts/references/audit-empty-needs.js` | passed |
| `node build-scripts/reports/generate-all.js` | passed |
| `node build-scripts/references/build-skilltree-generator-readiness.js` | passed |
| `node build-scripts/references/build-procedure-visual-coverage.js` | passed |
| `node build-scripts/reports/generate-reference-health.js` | passed |
| `node build-scripts/references/check-mtu-evidence-layer.js` | passed |
| `node build-scripts/references/check-skilltree-generator-readiness.js` | passed |
| `node build-scripts/references/check-procedure-visual-coverage.js` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `node build-scripts/reports/check-reference-health.js` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run agent:index` | passed |
| `node build-scripts/sprints/emit-url-index.js` | passed |
| `npm.cmd run dashboard:internal` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `npm.cmd run check:scope-language` | passed |
| `npm.cmd run check:platform` | passed |
| `node build-scripts/ci/check-evidence-line-endings.js` | passed |
| `git diff --check` | passed |
| `node build-scripts/sprints/check-sprint-command-log.js MTU-EVIDENCE-HARDEN-1` | passed |
| `node build-scripts/sprints/check-lead-review-substance.js MTU-EVIDENCE-HARDEN-1` | passed |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/MTU-EVIDENCE-HARDEN-1-result.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js MTU-EVIDENCE-HARDEN-1 --complete` | passed |

`npm.cmd run check:platform` passed with the existing expected fixture
warnings from negative book-check test cases; Jest reported 46 passed suites,
6 skipped suites, 709 passed tests, and 8 skipped tests.

## Changed files

- Added `build-scripts/references/check-mtu-evidence-layer.js`.
- Updated `.github/workflows/platform-ci.yml`.
- Updated `references/reference-team-roadmap.md`.
- Regenerated JSON/Markdown report outputs under `reports/json/` and
  `reports/markdown/`.
- Regenerated `references/data/audits/empty-needs-audit.json` and
  `reports/reference-audits/empty-needs-audit.md`.
- Regenerated `references/data/sprints/RX.6-generator-blocked-units.json`.
- Regenerated review-gate packet side-effect files:
  `reports/review-gates/GATE-PV6-coverage-dashboard/review-packet.json`,
  `reports/review-gates/GATE-PV6-coverage-dashboard/technical-closure.json`,
  and `reports/review-gates/GATE-RX6-skilltree-generator-integration/review-packet.json`.
- Refreshed `reports/github-agent-index-platform.*`,
  `reports/github-agent-index-lessen.*`, `reports/url-index.md`, and
  `reports/internal-dashboard/*`.
- Added sprint plan, baseline, planning review, verification review,
  lead-review assignment, round-1 review, correction log, round-2 review,
  result, diff summary, command log, and metadata.

## Data integrity notes

No protected reference data changed. The sprint did not edit or leave a diff
in:

- `references/machine/`;
- `references/external/`;
- `source-data/`;
- lesson-target output under `../4veco-lessen/`;
- target-exercise registries;
- engine runtime files.

The updated reports were regenerated through intended scripts. No protected
reference mutation, source-data write, target-exercise mutation, unit minting,
unit deprecation, candidate storage, diagnostics, adaptive routing, mastery,
sequencing, summative use, student-facing AI, PV projection, PV machine
promotion, Scale Gate 1, product-route adoption, product-wide use, or
student/product authority was authorized or performed.

## Open follow-ups

| Follow-up | Owner |
|---|---|
| Future hardening can add semantic `--check` modes to individual report builders, but the current stale-count defect is covered by `check-mtu-evidence-layer.js`. | future reference-governance sprint |
| GitHub Actions `platform-ci / validate-platform` must be inspected after the pushed commit because CI cannot run before remote publication. | main closure agent |

No remaining stale or missing active MTU count report is known after this
sprint. No report was intentionally excluded from the new checker without a
named rationale.

## Rollback instructions

If rollback is required, revert the platform sprint commit. That removes the
new checker, CI wiring, generated report refreshes, roadmap/index/dashboard
updates, and sprint records.

Do not revert unrelated user work, protected references, source data, engine
runtime code, target-exercise registries, or lesson output outside this sprint.

## Required next action

Run the post-save closure checks, fetch/prune origin, commit and push the
completed platform sprint, then inspect GitHub Actions
`platform-ci / validate-platform`.
