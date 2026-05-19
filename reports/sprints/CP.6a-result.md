# Sprint CP.6a: Result

## Plan reference

- Plan: `reports/sprints/CP.6a-plan.md`
- Baseline: `reports/sprints/CP.6a-baseline.md`
- Plan metadata: `references/data/sprints/CP.6a.plan.json`
- Result metadata: `references/data/sprints/CP.6a.result.json`

## Summary

CP.6a completed the non-mutating Book 1 Chapter 1.3 lesson-side alignment plan.

Primary outputs:

- `references/data/sprints/CP.6a-lesson-side-alignment.json`
- `reports/reference-planning/CP.6a-lesson-side-alignment.md`
- `build-scripts/review-gates/check-cp6a-lesson-side-alignment.js`
- `reports/sprints/CP.6a-planning-review.md`

The alignment plan records:

- active v5 `1.3.2` is `Marktevenwicht`, but current lesson-side `1.3.2` is `Kostenstructuren`;
- active v5 `1.3.3` is `Verschuivingen en nieuw evenwicht`, but current lesson-side `1.3.3` is `Opbrengsten`;
- current lesson-side `1.4.1 Marktevenwicht` and `1.4.2 Verschuivingen en nieuw evenwicht` appear to be the equivalent material, but both carry `PASS WITH FLAGS`;
- current Book 1 `Kostenstructuren` and `Opbrengsten` map to active-v5 Book 2 `2.1.1` and `2.1.2`;
- the lesson repo has a mixed generated-surface state: chapter folders/chapter markdown still carry the stale costs/revenue sequence, while the aggregate Book 1 markdown already has v5-titled `1.3.2` and `1.3.3` headings;
- the mismatch remains unresolved until a later authorized lesson-side regeneration/remediation sprint executes and validates the alignment.

No lesson output was edited, renamed, moved, deleted, or rebuilt.

## Lead review results

Round 1 lead review: FAIL for sprint closure.

Required corrections from round 1:

- record the round-1 review log;
- add the correction log;
- clarify the mixed lesson-surface state across chapter folders, chapter markdown, and aggregate Book 1 markdown;
- run lead-review round 2 after corrections;
- update final result metadata only after round 2 passes.

Corrections were applied in `reports/sprints/CP.6a-lead-review-corrections.md`.

Round 2 lead review: PASS. No required corrections remain.

## Acceptance test results

Acceptance tests passed during CP.6a closure:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6a-plan.md
node build-scripts/sprints/check-sprint-bundle.js CP.6a
node build-scripts/review-gates/check-cp6a-lesson-side-alignment.js
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/CP.6a-result.md
node build-scripts/sprints/check-sprint-bundle.js CP.6a --complete
```

## Changed files

Primary CP.6a artifacts:

- `reports/sprints/CP.6a-plan.md`
- `references/data/sprints/CP.6a.plan.json`
- `references/data/sprints/CP.6a.result.json`
- `reports/sprints/CP.6a-baseline.md`
- `reports/sprints/CP.6a-planning-review.md`
- `references/data/sprints/CP.6a-lesson-side-alignment.json`
- `reports/reference-planning/CP.6a-lesson-side-alignment.md`
- `build-scripts/review-gates/check-cp6a-lesson-side-alignment.js`
- `reports/sprints/CP.6a-result.md`
- `reports/sprints/CP.6a-diff-summary.md`
- `reports/sprints/CP.6a-lead-review-assignment.md`
- `reports/sprints/CP.6a-lead-review-round1.md`
- `reports/sprints/CP.6a-lead-review-corrections.md`
- `reports/sprints/CP.6a-lead-review-round2.md`

Roadmap and map surfaces:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.52-gate-cp6-routing-decision.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- generated report, source-manifest, document-inventory, GitHub-agent-index, dashboard, and URL-index surfaces refreshed by normal tooling

## Data integrity notes

No protected reference data changed. CP.6a did not mutate `references/machine/` or `references/external/`, did not edit `references/authored/course-target-exercises.json`, did not edit `references/owned/course-blueprint-v5.md`, did not edit lesson output in `../4veco-lessen`, did not mint units, did not mark migrated target exercises as reviewed final, did not replace placeholders, and did not write a CP-6 closure record.

CP.6a does not authorize CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery decisions, automatic sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing generated output.

## Open follow-ups

- Run `CP.6b Year-1 Target-Exercise Review`.
- Post-closure update: lesson-team `L-CP6A` executed the authorized lesson-side remediation and references recheck now records the `1.3.2`/`1.3.3` source/lesson mismatch as fixed with carried conditions in `references/data/sprints/CP.6a-lesson-side-recheck.json` and `reports/reference-planning/CP.6a-lesson-side-recheck.md`.
- Do not draft a CP-6 closure proposal until CP.6b, CP.6c, CP.6d, and CP.6e evidence exists.

## Rollback instructions

Revert the CP.6a implementation commit. Because CP.6a is non-mutating, rollback removes only sprint artifacts, alignment reports, the read-only validator, generated map/report churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.
