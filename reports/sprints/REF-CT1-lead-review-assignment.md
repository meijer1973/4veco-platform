# Sprint REF-CT1: Lead Review Assignment

Assigned on: 2026-05-19

## Scope

Review the `REF-CT1` Year-1 coverage baseline sprint bundle. The review must decide whether the non-mutating coverage artifacts, CP-6 packet, validators, and sprint logs are complete enough for off-site GitHub review, and whether corrections are required before REF-CT1 can be closed as a reporting sprint.

REF-CT1 must not be reviewed as a Year-1 closure gate. It only prepares the baseline and CP-6 review packet.

## Requested outcome

Produce a `Lead Review Summary` using the format in `agents/lead-reviewer-agent.md`, with one of these verdicts:

- `PASS`
- `PASS WITH FLAGS`
- `REVISE`
- `FAIL`
- `PAUSE`

Treat `REVISE`, `FAIL`, and `PAUSE` as non-closing outcomes.

## Evidence to inspect

- `reports/sprints/REF-CT1-plan.md`
- `reports/sprints/REF-CT1-baseline.md`
- `references/data/sprints/REF-CT1.plan.json`
- `references/data/sprints/REF-CT1-year1-coverage.json`
- `reports/reference-planning/REF-CT1-year1-coverage.md`
- `reports/reference-planning/REF-CT1-mtu-gap-classification.md`
- `reports/reference-planning/REF-CT1-cp6-review-packet.md`
- `build-scripts/references/build-ref-ct1-coverage-artifacts.js`
- `build-scripts/references/check-ref-ct1-coverage-artifacts.js`
- `references/data/sprints/REF-CT0-mtu-classification.json`
- `reports/reference-planning/REF-CT0-candidate-review-packet.md`
- read-only lesson evidence paths recorded in `references/data/sprints/REF-CT1-year1-coverage.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/roadmap-version-index.json`

## Required checks

- Confirm the REF-CT1 plan is co-located with the sprint logs under `reports/sprints/`.
- Confirm the coverage JSON/report contains exactly 12 Book 1 count-bearing paragraphs.
- Confirm the summary preserves the current v5 status: 9 migrated records needing v5 review, 3 placeholder records, 0 reviewed-final records, 19 confirmed Book 1 MTUs, 9 Year-1 backfill candidates, and 3 needs-evidence placeholders.
- Confirm the `1.1.3` lesson evidence remains visible as pending L1.6R human review with Part A `FLAG`.
- Confirm the CP-6 packet says CP-6 is not closed, Year 1 is not closed, and no CLI mutation is authorized.
- Confirm protected surfaces remain unchanged: no hand edit to `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen`.
- Confirm off-site reviewers can use GitHub-facing maps once the normal map refresh and final roadmap bookkeeping are run.
- Identify required corrections before the round-2 recheck, including any missing result/diff/roadmap metadata.

## Commands expected before final close

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REF-CT1-plan.md
node build-scripts/sprints/check-sprint-bundle.js REF-CT1
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/references/build-ref-ct1-coverage-artifacts.js
node build-scripts/references/check-ref-ct1-coverage-artifacts.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/REF-CT1-result.md
node build-scripts/sprints/check-sprint-bundle.js REF-CT1 --complete
```

The round-1 review may request corrections before all final roadmap/result/map checks pass, because the correction pass and recheck are part of the sprint closure procedure.
