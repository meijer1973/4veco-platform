# Sprint REF-CP6: Baseline

## Plan reference

`reports/sprints/REF-CP6-plan.md`

## Current state

REF-CP6 is the active references roadmap sprint at baseline.

Git baseline: `3d0698105ad6c82cd273d7b00afed5a3b944124a`.

The active roadmap version at sprint start is `v2.50-ref-ct2-precision-dual-coding-audit`. REF-CT2 completed as a non-mutating audit and inserted REF-CP6 before Year-2 skeleton work.

REF-CT2 records:

- 12 active-v5 Book 1 count-bearing target-exercise records
- 9 visual/graph-heavy records
- 3 placeholder target-exercise records
- 2 source/lesson topic mismatches: `1.3.2` and `1.3.3`
- 1 L1.6R `pass_with_flags` record with remaining `1.1.3` Part A `FLAG`
- 9 legacy quality-ref records
- 0 CP-6 quality-ready records

REF-CT1 records the supporting Year-1 coverage baseline: 9 migrated target-exercise records still needing v5 final review, 3 placeholders needing evidence, 0 reviewed-final target exercises, 19 confirmed Book 1 MTUs, and 9 Year-1 backfill candidates.

Lesson-side evidence in `../4veco-lessen` is read-only for this sprint. At baseline the lesson repository is clean on `main...origin/main` at commit `8ea857ac7aec04ad7da6c6830e1d951b046f037d` (`Close L1.6R pass with flags`).

## Data integrity notes

Protected reference data must not change in REF-CP6. `references/machine/` and `references/external/` are read-only. `references/authored/course-target-exercises.json` and `references/owned/course-blueprint-v5.md` are read-only source inputs.

No lesson output changes are authorized. REF-CP6 may inspect lesson evidence in `../4veco-lessen`, but it must not edit generated lesson files or rebuild student-facing output.

REF-CP6 is a review-readiness sprint. It must not write the CP-6 human interview or gate closure. It must not mark CP-6 or Year 1 closed.

## Baseline risks

- Source/lesson topic mismatches for `1.3.2` and `1.3.3` can make Year 1 look more complete than it is.
- Placeholder target exercises for `1.1.4`, `1.2.4`, and `1.3.4` can be mistaken for final coverage if the packet is too loose.
- Nine backfill candidates can be mistaken for mutation authority if they are not separated from later CLI-backed mutation lanes.
- Legacy quality-ref records for graph-heavy material can overstate readiness because they are not the current Part A/Part B review evidence.
- The `1.1.3` L1.6R pass-with-flags status can hide the remaining Part A `FLAG` if the packet collapses review statuses.

## Acceptance baseline

REF-CP6 closes only when the remediation/readiness JSON/report, blocker-routing report, CP-6 review packet, validator, sprint result, diff summary, roadmap bookkeeping, and complete lead-review cycle all validate. Remote state and repository maps must be refreshed and pushed before final closure.
