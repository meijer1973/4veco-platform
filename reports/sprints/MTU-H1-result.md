# Sprint MTU-H1: Result

Date: 2026-05-27

Status: completed

## Plan reference

Plan: `reports/sprints/MTU-H1-plan.md`

## Summary

MTU-H1 completed as a non-mutating MTU-hardening benchmark sprint. It records
the supplied 2026 VWO economie Solo q1-q3 analysis as structured evidence and
separates content skills, calculation/source/graph/reasoning operations,
answer-form requirements, misconception targets, missing-unit flags, and
over-trigger flags.

The sprint produced:

- `reports/mtu-hardening/benchmark-sample-v1.json`
- `reports/mtu-hardening/solo-q1-q3-operation-map.md`
- `reports/mtu-hardening/failure-taxonomy-v1.md`
- `build-scripts/references/check-mtu-hardening-benchmark.js`

The roadmap now closes MTU-H1 and routes the next bounded lanes as MTU-H2
through MTU-H6. No unit or registry mutation is authorized by this result.

## Acceptance test results

All planned acceptance tests passed:

```text
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H1-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H1
node build-scripts/references/check-mtu-hardening-benchmark.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd test -- --runInBand
```

Jest result: 38 test suites passed, 6 skipped; 569 tests passed, 8 skipped.

## Changed files

Primary MTU-H1 artifacts:

- `reports/sprints/MTU-H1-plan.md`
- `references/data/sprints/MTU-H1.plan.json`
- `reports/sprints/MTU-H1-baseline.md`
- `reports/sprints/MTU-H1-planning-review.md`
- `reports/mtu-hardening/benchmark-sample-v1.json`
- `reports/mtu-hardening/solo-q1-q3-operation-map.md`
- `reports/mtu-hardening/failure-taxonomy-v1.md`
- `build-scripts/references/check-mtu-hardening-benchmark.js`
- `reports/sprints/MTU-H1-result.md`
- `reports/sprints/MTU-H1-diff-summary.md`
- `references/data/sprints/MTU-H1.result.json`

Roadmap and generated index updates:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.84-game-ux2-exit-ticket-checkpoint.md`
- refreshed report JSON/Markdown, source registry, source manifest, document
  inventory, internal dashboard, GitHub-agent indexes, and URL index.

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` were not edited. MTU-H1 did not run `unit-add`,
`unit-update`, `unit-split`, `unit-merge`, `unit-deprecate`, or any other
machine-reference mutation command.

No candidate-storage files were created. No operation candidates, answer-skill
candidates, q19 extraction records, lesson output, target exercises, PV records,
or student/product surfaces were written.

The pre-existing untracked `knowledge/exit-ticket-game-1.1.1.zip` file remains
untouched and unrelated.

## Open follow-ups

- MTU-H2 should prepare a governed review/CLI-mutation plan for the Solo q1-q3
  canonical micro-cases.
- MTU-H3 should review the D07 incidence/pass-through family.
- MTU-H4 should define answer-form MTUs and their `question_type` mapping.
- MTU-H5 should build the regression validator on a fresh sample after mapping
  rules are reviewed.
- MTU-H6 should feed only reviewed hardened MTUs into exit tickets, games,
  practice, and review gates.

## Rollback instructions

Revert the MTU-H1 commit. Rollback removes only the benchmark reports, checker,
sprint logs, roadmap/version-index updates, and generated report/index refreshes.
It must not touch `references/machine/`, `references/external/`, lesson output,
or the pre-existing untracked exit-ticket zip.
