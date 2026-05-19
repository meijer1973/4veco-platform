# Sprint REF-CT2: Baseline

## Plan reference

`reports/sprints/REF-CT2-plan.md`

## Current state

REF-CT2 is the active references roadmap sprint at baseline. The roadmap had labelled it "Content Track 2"; this sprint formalizes the row as `REF-CT2` for sprint-bundle tooling while preserving the roadmap name `Year-1 Precision And Dual-Coding Audit`.

Git baseline: `66de77a5da0fd385cfe1103dac249fdd06ad34a1`.

The active roadmap version at sprint start is `v2.49-ref-ct1-year1-coverage-baseline`. A snapshot of that state was archived to `docs/roadmaps/outdated/reference-team-roadmap-v2.49-ref-ct1-year1-coverage-baseline.md` before REF-CT2 roadmap edits.

REF-CT1 is the required coverage baseline. It records:

- 12 active-v5 Book 1 count-bearing paragraph records
- 9 migrated target-exercise records needing v5 review
- 3 placeholder records needing evidence
- 0 reviewed-final target-exercise records
- 19 confirmed Book 1 MTUs
- 9 Year-1 backfill candidates
- `1.1.3` L1.6R and Part A blockers

Lesson-side evidence in `../4veco-lessen` is read-only for this sprint. At baseline the lesson repository is clean on `main...origin/main` at commit `8ea857a` (`Close L1.6R pass with flags`).

Initial lesson evidence scan shows quality refs for all Book 1 lesson paragraphs are present, but only `1.1.1`, `1.1.2`, and `1.1.3` have companion visual-review files. The current lesson-side `1.1.3` L1.6R status is `pass_with_flags`, while Part A remains `FLAG`. The 1.2 and 1.3 lesson-side quality refs use an older quality-ref shape with asset counts and dual-coding prose, not the newer Part A/Part B review-record separation.

Known baseline risk: active-v5 target-exercise records for `1.3.2` and `1.3.3` name market-equilibrium topics, while lesson-side directories currently name `1.3.2 Kostenstructuren` and `1.3.3 Opbrengsten`. REF-CT2 must record that source/lesson mismatch; it must not correct it by hand.

## Data integrity notes

Protected reference data must not change in REF-CT2. `references/machine/` and `references/external/` are read-only. `references/authored/course-target-exercises.json` and `references/owned/course-blueprint-v5.md` are read-only source inputs.

No lesson output changes are authorized. REF-CT2 may inspect quality refs, Markdown/HTML surfaces, and assets in `../4veco-lessen`, but it must not edit generated lesson files or rebuild student-facing output.

The audit is evidence for CP-6 review. It is not CP-6 closure, Year-1 closure, target-exercise promotion, placeholder finalization, unit minting, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, or student-facing publication authority.

## Baseline risks

- Asset counts can hide semantic dual-coding failure; REF-CT2 must require inspectable learning-object evidence.
- Procedure parity can hide missing graph/table learning objects; L1.6R must stay visible as the calibration case even though the lesson-side status has advanced to `pass_with_flags`.
- Older quality-ref schema for 1.2 and 1.3 can overstate readiness because companion review evidence is absent.
- Source/lesson mismatches in 1.3 can make a paragraph look covered when the built lesson surface is about a different target.
- The old "Immediate Next Sprint" prose later in the roadmap still points at REF-CT1; REF-CT2 closure should refresh that stale pointer.

## Acceptance baseline

REF-CT2 closes only when the audit JSON/report, surface-evidence report, CP-6 status update, validator, sprint result, diff summary, roadmap bookkeeping, and complete lead-review cycle all validate. Remote state and repository maps must be refreshed and pushed before final closure.
