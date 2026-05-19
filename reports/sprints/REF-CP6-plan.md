# Sprint REF-CP6: Year-1 CP-6 Remediation And Review Readiness

## Goal

Turn the REF-CT2 CP-6 blockers into a deterministic remediation and human-review readiness packet for Year 1.

REF-CP6 is a non-mutating readiness sprint. It routes blockers, prepares the formal CP-6 review packet, and records stop conditions. It does not edit lesson output, mutate protected references, close CP-6, close Year 1, promote target exercises, finalize placeholders, or authorize student-facing/product uses.

## Context

REF-CT2 found that Year 1 is not ready for CP-6 closure. The active-v5 Book 1 baseline still has 12 count-bearing records, 3 placeholder target exercises, 9 migrated target-exercise records needing final v5 review, 9 Year-1 backfill candidates, 2 source/lesson topic mismatches (`1.3.2`, `1.3.3`), graph-heavy 1.2/1.3 evidence that relies on legacy quality-ref records, and a remaining `1.1.3` Part A `FLAG` even though L1.6R is now `pass_with_flags`.

REF-CP6 must make those blockers actionable without pretending they are resolved. Source records in `references/authored/course-target-exercises.json` and `references/owned/course-blueprint-v5.md` remain read-only. Lesson-side files in `../4veco-lessen` remain read-only evidence.

The output should be review-ready: a human reviewer should be able to inspect the packet and answer bounded CP-6 questions one at a time in a later formal gate sprint.

## Allowed paths

- `reports/sprints/REF-CP6-plan.md`
- `references/data/sprints/REF-CP6.plan.json`
- `reports/sprints/REF-CP6-baseline.md`
- `references/data/sprints/REF-CP6.result.json`
- `references/data/sprints/REF-CP6-remediation-readiness.json`
- `reports/reference-planning/REF-CP6-remediation-readiness.md`
- `reports/reference-planning/REF-CP6-blocker-routing.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/review-packet.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/review-packet.json`
- `build-scripts/references/build-ref-cp6-remediation-readiness.js`
- `build-scripts/references/check-ref-cp6-remediation-readiness.js`
- `reports/sprints/REF-CP6-result.md`
- `reports/sprints/REF-CP6-diff-summary.md`
- `reports/sprints/REF-CP6-lead-review-assignment.md`
- `reports/sprints/REF-CP6-lead-review-round1.md`
- `reports/sprints/REF-CP6-lead-review-corrections.md`
- `reports/sprints/REF-CP6-lead-review-round2.md`
- generated reports, maps, inventories, and URL indexes when regenerated through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping
- `docs/roadmaps/outdated/reference-team-roadmap-v2.50-ref-ct2-precision-dual-coding-audit.md`
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
- placeholder replacement, promotion, or finalization
- CP-6 closure or Year-1 closure
- writing a CP-6 human interview or gate-closure record in this sprint
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
- `references/data/sprints/REF-CT1-year1-coverage.json`
- `references/data/sprints/REF-CT2-precision-dual-coding-audit.json`
- `reports/reference-planning/REF-CT1-cp6-review-packet.md`
- `reports/reference-planning/REF-CT2-cp6-status-update.md`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`
- read-only lesson evidence in `../4veco-lessen`, especially Book 1 quality refs and review files
- `../4veco-lessen/archive/sprints/L1.6R/L1.6R-dual-coding-incident-record.md`
- `../4veco-lessen/archive/sprints/L1.6R/L1.6R-semantic-visual-qa-report.md`

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, result, diff summary, lead-review assignment, round-1 lead-review log, corrections log, round-2 lead-review log, plus metadata under `references/data/sprints/`.
- A machine-readable remediation/readiness JSON that groups each REF-CT2 blocker into an explicit decision lane.
- A remediation/readiness report that states whether Year 1 is ready for CP-6 closure, ready for human review, or blocked before human review.
- A blocker-routing report that maps every paragraph and blocker type to its required next authority: human decision, lesson-side remediation, target-exercise design review, MTU backfill review, or later CLI-backed mutation.
- A formal CP-6 review packet with the complete planned review-question list for a later interactive human gate. The packet must not include a completed interview or closure record.
- A reproducible read-only readiness builder with a HOW TO ADAPT header.
- A read-only validator for the REF-CP6 readiness artifacts.

## Operationalized sprint procedure

1. Record this plan, plan JSON, and baseline before generating readiness artifacts. Stop if the active roadmap row for `REF-CP6` is missing or if REF-CT1/REF-CT2 source artifacts are missing.
2. Confirm source boundaries. Treat active v5 source and target-exercise records as read-only; treat lesson output as read-only evidence. Do not use lesson files to silently override active v5 target records.
3. Build a blocker inventory from REF-CT2: source/lesson mismatches, placeholders, backfill candidates, migrated-not-final records, legacy review evidence, `1.1.3` Part A `FLAG`, and CP-6/Year-1 closure blocks.
4. Convert the blocker inventory into decision lanes. Each lane must name required evidence, authority needed, allowed next action, blocked action, and stop condition.
5. Produce a formal CP-6 review packet that shows all planned calibration questions before the future interview begins. The packet must include enough context for the human reviewer to answer without looking up shorthand labels.
6. Include the future human-gate procedure in the review packet: record every answer, run pattern analysis across answers, ask targeted follow-ups where the answers expose ambiguity, draft a closure proposal only after evidence is complete, and require explicit human confirmation before any later gate-closure record can be written.
7. Run the REF-CP6 validator. Stop if the artifacts mark CP-6 as closed, mark Year 1 as closed, hide any REF-CT2 blocker, authorize protected mutation, or omit the planned review-question list.
8. Run acceptance tests, regenerate normal reports/indexes when needed, and record result and diff artifacts.
9. Assign the completed sprint bundle to the lead reviewer agent. Log the round-1 review in `reports/sprints/REF-CP6-lead-review-round1.md`.
10. Apply required corrections or explicitly record that no correction was needed. Log the correction pass in `reports/sprints/REF-CP6-lead-review-corrections.md`.
11. Send the corrected bundle back to the lead reviewer for one recheck. Log the round-2 review in `reports/sprints/REF-CP6-lead-review-round2.md`. Stop and report back if the recheck verdict is not `PASS` or `PASS WITH FLAGS`.
12. Mark REF-CP6 complete only as a non-mutating review-readiness sprint. Do not write the future CP-6 interview log or closure record in this sprint. Move the next appropriate CP-6 human gate or remediation sprint to the active top ledger row, refresh maps and indexes, fetch/prune remote, commit, tag, push, and report the pushed hash.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REF-CP6-plan.md
node build-scripts/sprints/check-sprint-bundle.js REF-CP6
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/references/build-ref-cp6-remediation-readiness.js
node build-scripts/references/check-ref-cp6-remediation-readiness.js
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
node build-scripts/sprints/check-sprint-result.js reports/sprints/REF-CP6-result.md
node build-scripts/sprints/check-sprint-bundle.js REF-CP6 --complete
```

## Rollback plan

Revert the REF-CP6 implementation commit. Because REF-CP6 is non-mutating, rollback should remove only sprint artifacts, readiness reports, review-packet files, read-only builder/checker scripts, generated report/index churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.

## Human review required

No formal CP-6 human review is completed inside REF-CP6. This sprint prepares the packet for the later formal human-review gate.

Human review remains required before CP-6 closure, Year-1 closure, target-exercise promotion, placeholder replacement/finalization, protected reference mutation, and any student-facing/product-use claim.

When the later CP-6 human gate starts, the reviewer must first see the full list of planned questions, then answer one question at a time. Each answer must be recorded in a formal interview log before any closure JSON can be written.

The structural lead-review cycle is still required for sprint closure. It is an internal review/recheck procedure and does not replace CP-6 human review.
