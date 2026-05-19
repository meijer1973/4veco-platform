# Sprint REF-CT1: Year-1 Target Exercise And MTU Coverage Baseline For v5

## Goal

Produce the Year-1 target-exercise and micro-teaching-unit coverage baseline for the active v5 curriculum source, using REF-CT0 classifications and built evidence from `1.1.1` through `1.1.3`.

REF-CT1 is a non-mutating foundation-hardening sprint. It prepares the CP-6 review packet and identifies coverage blockers. It does not close Year 1, promote placeholders, mint units, edit target exercises, or mutate protected reference data.

## Context

The active references roadmap places `REF-CT1` after `REF-CT0`. The current active roadmap version is `v2.48-l16r-dual-coding-incident`, which keeps `REF-CT1` active and sharpens the next precision work with the L1.6R dual-coding incident in the lesson repository.

The active curriculum-source baseline is `references/owned/course-blueprint-v5.md` plus `references/owned/course-blueprint-v5.meta.json`. Year 1 / Book 1 has 12 count-bearing paragraph records in `references/authored/course-target-exercises.json`: 9 migrated records that still need v5 review and 3 placeholder records that cannot count as final coverage.

REF-CT0 produced `references/data/sprints/REF-CT0-mtu-classification.json` and a candidate review packet. For Book 1, that classification currently distinguishes 19 confirmed target-exercise-backed MTUs, 9 Year-1 backfill candidates from missing flags, and 3 placeholder records that still need evidence.

Lesson-side built evidence from `../4veco-lessen` must be treated as read-only evidence. In particular, `1.1.3` has L1.6R visual remediation evidence, but it still carries pending human-review and Part A flag status. REF-CT1 must not hide that precision gap.

## Allowed paths

- `reports/sprints/REF-CT1-plan.md`
- `references/data/sprints/REF-CT1.plan.json`
- `reports/sprints/REF-CT1-baseline.md`
- `references/data/sprints/REF-CT1.result.json`
- `references/data/sprints/REF-CT1-year1-coverage.json`
- `reports/reference-planning/REF-CT1-year1-coverage.md`
- `reports/reference-planning/REF-CT1-mtu-gap-classification.md`
- `reports/reference-planning/REF-CT1-cp6-review-packet.md`
- `build-scripts/references/build-ref-ct1-coverage-artifacts.js`
- `build-scripts/references/check-ref-ct1-coverage-artifacts.js`
- `reports/sprints/REF-CT1-result.md`
- `reports/sprints/REF-CT1-diff-summary.md`
- `reports/sprints/REF-CT1-lead-review-assignment.md`
- `reports/sprints/REF-CT1-lead-review-round1.md`
- `reports/sprints/REF-CT1-lead-review-corrections.md`
- `reports/sprints/REF-CT1-lead-review-round2.md`
- generated reports, maps, inventories, and URL indexes when regenerated through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping after completion
- `docs/roadmaps/outdated/reference-team-roadmap-v2.48-l16r-dual-coding-incident.md` if the roadmap is versioned at closure
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- direct mutation of lesson output in `../4veco-lessen/`
- unit minting or machine registry mutation
- target-exercise promotion to `reviewed_final`
- placeholder promotion or placeholder-as-final coverage claims
- student diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection or PV machine promotion
- student-facing generated output

## Inputs

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `references/owned/course-blueprint-v5.md`
- `references/owned/course-blueprint-v5.meta.json`
- `references/authored/course-target-exercises.json`
- `references/data/sprints/REF-CT0-mtu-classification.json`
- `reports/reference-planning/REF-CT0-candidate-review-packet.md`
- read-only lesson evidence in `../4veco-lessen`, especially quality refs and review logs for `1.1.1`, `1.1.2`, and `1.1.3`
- generated report diagnostics under `reports/json/` as weaker context only

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, result, diff summary, lead-review assignment, round-1 lead-review log, corrections log, round-2 lead-review log, plus metadata under `references/data/sprints/`.
- A machine-readable Year-1 coverage JSON mirror.
- A Year-1 coverage report listing all 12 Book 1 count-bearing paragraph records, target-exercise status, linked MTUs, missing flags, placeholder status, and built-evidence status for `1.1.1` through `1.1.3`.
- An MTU gap-classification report separating confirmed units, Year-1 backfill candidates, deliberately deferred items if any, duplicate or parked candidates if any, and needs-evidence placeholders.
- A CP-6 review packet that names open decisions and stop conditions before any CLI mutation or Year-1 closure claim.
- A reproducible report-side artifact builder with a HOW TO ADAPT header.
- A read-only validator for the REF-CT1 coverage artifacts.

## Operationalized sprint procedure

1. Record this plan, plan JSON, and baseline before building reports. Stop if the active roadmap no longer lists `REF-CT1` as the active sprint, or if the active v5 target-exercise validator fails.
2. Confirm source boundaries. Use active v5 only; do not use v4 or the rough three-year blueprint as authority. Treat REF-CT0 as the classification baseline and generated reports as diagnostics only.
3. Read lesson-side evidence for `1.1.1`, `1.1.2`, and `1.1.3`. Record the lesson repository commit, quality-ref verdicts, L1.6R status, and any pending human-review or precision flags. Stop if the report would imply `1.1.3` is fully closed while L1.6R or Part A review remains pending.
4. Build the Year-1 coverage JSON and report. Include exactly 12 Book 1 count-bearing paragraph records. For each paragraph, record target-exercise status, source reference, required/introduced/assumed MTUs, missing flags, placeholder status, and whether it may count as final coverage.
5. Classify gaps using REF-CT0 categories. Separate missing target-exercise flags from placeholders. Use `year_1_backfill_candidate` for target-exercise-backed Year-1 missing flags, `needs_evidence` for placeholders or thin evidence, and only use future-year, duplicate, or parked categories when the evidence explicitly supports them.
6. Produce the CP-6 review packet. It must state that no CLI mutation is authorized, CP-6 is not closed by this sprint, and final Year-1 closure remains blocked until placeholders, missing flags, and the `1.1.3` review chain are resolved.
7. Add and run the read-only REF-CT1 validator. Stop if the artifacts mutate protected surfaces, claim placeholder records are reviewed final, omit Book 1 records, miscount REF-CT0 classifications, or mark Year 1 ready for final closure.
8. Run acceptance tests, regenerate normal reports/indexes when needed, and record result and diff artifacts.
9. Assign the completed sprint bundle to the lead reviewer agent. Log the round-1 review in `reports/sprints/REF-CT1-lead-review-round1.md`.
10. Apply required corrections or explicitly record that no correction was needed. Log the correction pass in `reports/sprints/REF-CT1-lead-review-corrections.md`.
11. Send the corrected bundle back to the lead reviewer for one recheck. Log the round-2 review in `reports/sprints/REF-CT1-lead-review-round2.md`. Stop and report back if the recheck verdict is not `PASS` or `PASS WITH FLAGS`.
12. Mark REF-CT1 complete in the roadmap only as a non-mutating baseline/reporting sprint. Do not mark Year 1 or CP-6 closed. Move the next appropriate roadmap sprint to the active top ledger row, refresh maps and indexes, fetch/prune remote, commit, tag, push, and report the pushed hash.

## Acceptance tests

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

## Rollback plan

Revert the REF-CT1 implementation commit. Because REF-CT1 is non-mutating, rollback should remove only sprint artifacts, planning reports, read-only builder/checker scripts, regenerated report/index churn, and roadmap bookkeeping. Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or lesson output during rollback.

If the coverage validator exposes a contradiction in REF-CT0 counts or v5 target-exercise shape, stop for a roadmap/source decision before changing protected references.

## Human review required

REF-CT1 produces the CP-6 review packet, but it does not complete CP-6 and does not require a new formal human-review interview inside this sprint.

Human review becomes required before CP-6 closure, before any target-exercise record is promoted to `reviewed_final`, before any placeholder is replaced by a reviewed target exercise, before CLI mutation based on REF-CT1 backfill candidates, and before any claim that Year 1 coverage is final.

The structural lead-review cycle is still required for sprint closure. It is an internal review/recheck procedure and does not replace CP-6 human review.
