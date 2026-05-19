# Sprint GATE-CP6: Baseline

## Plan reference

`reports/sprints/GATE-CP6-plan.md`

## Current state

GATE-CP6 is the active references roadmap sprint at baseline.

Git baseline: `abf3243` (`Complete REF-CP6 remediation readiness`).

The active roadmap version at sprint start is `v2.51-ref-cp6-remediation-readiness`. REF-CP6 prepared the CP-6 review packet but did not record a human interview or closure record.

REF-CP6 records:

- 12 active-v5 Book 1 records
- 0 CP-6 quality-ready records
- 3 placeholder target-exercise records
- 2 source/lesson topic mismatches: `1.3.2` and `1.3.3`
- 9 Year-1 backfill candidates
- 9 legacy quality-ref records needing current review routing
- 1 remaining `1.1.3` Part A `FLAG`
- 9 migrated target-exercise records needing final review
- 9 planned CP-6 review questions

The human reviewer has now supplied answers to all nine questions after the full planned question list was visible in `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/review-packet.md`.

## Data integrity notes

Protected reference data must not change in GATE-CP6. `references/machine/` and `references/external/` are read-only. `references/authored/course-target-exercises.json` and `references/owned/course-blueprint-v5.md` are read-only source inputs.

No lesson output changes are authorized. GATE-CP6 may cite lesson-side evidence from REF-CP6 and the human answer set, but it must not edit generated lesson files or rebuild student-facing output.

GATE-CP6 records a routing decision only. It must not create `gate-closure.json`, close CP-6, close Year 1, promote target exercises, replace placeholders, mint units, or authorize protected mutation.

## Baseline risks

- Recording the human answer set could be mistaken for CP-6 closure if the decision artifact is not explicit enough.
- The active-v5 versus lesson-side mismatch could be routed too broadly if `CP.6a` is not isolated from protected source mutation and lesson output mutation.
- Placeholder review, target-exercise review, backfill classification, graph-heavy evidence upgrade, and `1.1.3` Part A re-review could be collapsed into one unbounded remediation task unless the lanes are split.
- Off-site reviewers need current GitHub-facing maps and indexes after the roadmap changes.

## Acceptance baseline

GATE-CP6 closes only when the interview record, routing decision, remediation-lane artifacts, validator, sprint result, diff summary, roadmap bookkeeping, map refresh, and complete lead-review cycle all validate. Remote state and repository maps must be refreshed and pushed before final closure.
