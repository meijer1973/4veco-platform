# Sprint REF-CT1: Baseline

## Plan reference

`reports/sprints/REF-CT1-plan.md`

## Current state

REF-CT1 is the active references roadmap sprint at baseline. It follows REF-CT0 and precedes the next precision/coverage audit work.

Git baseline: `8cf0b787cb69cf894a6bf4230b2a06e8efd097a1`.

The active roadmap version is `v2.48-l16r-dual-coding-incident`. REF-CT1 must use the active v5 curriculum source and must account for the L1.6R dual-coding incident before any Year-1 closure claim.

The active v5 curriculum-source baseline is `references/owned/course-blueprint-v5.md` plus `references/owned/course-blueprint-v5.meta.json`. The active target-exercise registry is `references/authored/course-target-exercises.json`.

Book 1 / Year 1 currently has 12 count-bearing target-exercise records:

- 9 `migrated_from_v4_needs_v5_review` records
- 3 `placeholder_needs_review` records: `1.1.4`, `1.2.4`, and `1.3.4`
- 0 `reviewed_final` records

REF-CT0 classified the Book 1 surface as:

- 19 `year_1_confirmed` target-exercise-backed live MTUs
- 9 `year_1_backfill_candidate` missing-flag records
- 3 `needs_evidence` placeholder records

Lesson-side evidence in `../4veco-lessen` is read-only for this sprint. At baseline, the lesson repository is clean at commit `f16918d669b663c7038d52a29802055041155fea`.

Built evidence for the required early sequence is present but not equivalent to final Year-1 closure:

- `1.1.1`: Part A and companion reviews are `PASS WITH FLAGS`.
- `1.1.2`: Part A and companion reviews are `PASS WITH FLAGS`.
- `1.1.3`: Part A remains flagged, companion review is `PASS WITH FLAGS`, and L1.6R visual remediation is still pending human review.

## Data integrity notes

Protected reference data must not change in REF-CT1. `references/machine/` and `references/external/` are read-only. `references/authored/course-target-exercises.json` and `references/owned/course-blueprint-v5.md` are read-only source inputs for this sprint.

No CLI mutation is authorized by REF-CT1. Missing flags may become later candidate work, but this sprint only classifies and reports them. Placeholder records must remain non-final and may not be counted as reviewed target-exercise coverage.

Generated reports under `reports/` are diagnostics. They can expose risks and review questions, but they cannot override the active v5 source, REF-CT0 classifications, lesson review files, or protected reference boundaries.

## Baseline risks

- The presence of 12 Book 1 records can be mistaken for final Year-1 coverage; REF-CT1 must keep migrated and placeholder statuses visible.
- The 3 placeholder paragraphs can be mistaken for deliberately complete deferred work; REF-CT1 must keep them in `needs_evidence`.
- `1.1.3` has visual remediation evidence but not final closure; REF-CT1 must not flatten L1.6R into a pass.
- REF-CT0 backfill candidates are review candidates only; REF-CT1 must not imply unit minting, target-exercise edits, or CP-6 closure.

## Acceptance baseline

REF-CT1 closes only when the Year-1 coverage JSON/report, MTU gap classification report, CP-6 review packet, validator, sprint result, diff summary, roadmap bookkeeping, and complete lead-review cycle all validate. Remote state and repository maps must be refreshed and pushed before final closure.
