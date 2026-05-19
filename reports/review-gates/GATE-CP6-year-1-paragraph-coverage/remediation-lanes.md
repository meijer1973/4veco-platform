# GATE-CP6 Remediation Lanes

Generated: 2026-05-19

Status: five bounded remediation lanes opened by the CP-6 human routing decision; CP.6a lesson-side recheck passed with carried conditions after lesson-team L-CP6A.

CP-6 not closed. Year 1 not closed. No protected reference mutation authorized. No lesson output mutation authorized.

## Lane Summary

| Lane | Sprint | Scope | Mutate now | Stop condition |
|---|---|---|---|---|
| lesson_side_alignment | CP.6a | Align Book 1 Chapter 1.3 lesson-side sequence with active v5 for `1.3.2` and `1.3.3`. | no | Cleared with carried conditions by L-CP6A and references recheck; CP-6 closure remains stopped by the remaining lanes. |
| target_exercise_review | CP.6b | Review nine migrated target exercises and design/review three gemengde-opgaven integration target exercises. | no | Stop final coverage while placeholders or migrated records lack review artifacts. |
| mtu_backfill_classification | CP.6c | Classify nine Year-1 backfill candidates as true missing unit, existing-unit mapping, merge candidate, or defer candidate. | no | Stop protected mutation while candidates remain unreviewed. |
| graph_heavy_evidence | CP.6d | Upgrade current Part A/Part B evidence where graph-heavy records are used for CP-6 evidence. | no | Stop closure while graph-heavy records lack current review evidence. |
| part_a_113_review | CP.6e | Re-review `1.1.3` Part A and clear or explicitly fail the remaining `FLAG`. | no | Stop unconditioned CP-6 closure while `1.1.3` Part A remains `FLAG`. |

## CP.6a: Book 1 Chapter 1.3 Lesson-Side Alignment

Allowed action: produce a bounded plan and evidence packet for aligning `1.3.2` and `1.3.3` lesson-side records to active v5.

Blocked action: direct lesson-output mutation inside GATE-CP6, protected v5 mutation, or CP-6 closure.

Evidence needed:

- Active v5 titles for `1.3.2` and `1.3.3`.
- Current lesson-side Chapter 1.3 titles and plan.
- Decision record showing lesson-side remediation path.
- Later validation after any authorized lesson-side regeneration.

Stop condition: do not claim CP-6 closure while the mismatch remains unresolved or unaccepted.

Post-handoff update 2026-05-19:

- Lesson team completed `L-CP6A` at lesson commit `1aa63e4f0968c39141c1a04809f6410b5435ee34` using platform commit `6e2c06684e0c9b782cf005027a3b2ef3fd9fd230`.
- References recheck is recorded in `references/data/sprints/CP.6a-lesson-side-recheck.json` and `reports/reference-planning/CP.6a-lesson-side-recheck.md`.
- The source/lesson mismatch blocker for `1.3.2` and `1.3.3` is fixed with carried conditions.
- CP-6 and Year 1 remain open. Target-exercise review, placeholder finalization, MTU backfill classification, graph-heavy evidence, and focused `1.1.3` Part A re-review remain open.

## CP.6b: Year-1 Target-Exercise Review

Allowed action: review the nine migrated Book 1 target-exercise records and design/review integration target exercises for `1.1.4`, `1.2.4`, and `1.3.4`.

Blocked action: target-exercise promotion to `reviewed_final`, placeholder finalization, or protected reference mutation inside GATE-CP6.

Evidence needed:

- Review artifacts for nine migrated target-exercise records.
- Integration/transfer target-exercise designs for the three gemengde-opgaven paragraphs.
- Teacher-learning-quality review where final coverage is claimed.
- Protected mutation plan if later registry changes are proposed.

Stop condition: do not claim final Year-1 coverage while records remain `migrated_from_v4_needs_v5_review` or `placeholder_needs_review`.

## CP.6c: Year-1 MTU Backfill Classification

Allowed action: classify each of the nine candidates as true missing unit, existing-unit mapping, merge candidate, or defer candidate.

Blocked action: unit minting or editing `references/machine/` inside GATE-CP6.

Evidence needed:

- Candidate list from REF-CT1/REF-CP6.
- Existing live-unit mapping check.
- Merge/defer/true-missing rationale for each candidate.
- Later CLI-backed mutation plan only for reviewed true missing units.

Stop condition: do not run CLI mutation while candidates remain unreviewed.

## CP.6d: Book 1 Graph-Heavy Evidence Upgrade

Allowed action: identify and upgrade current review evidence needed for graph-heavy Book 1 records.

Blocked action: treating legacy quality-ref evidence as enough for CP-6 closure.

Evidence needed:

- Current Part A review records for graph-heavy records used as closure evidence.
- Part B review evidence where companion material exists, is used as evidence, or is in sprint scope.
- Updated quality-ref evidence only through the authorized quality workflow.

Stop condition: do not close CP-6 while graph-heavy records lack current review evidence.

## CP.6e: Focused 1.1.3 Part A Re-Review

Allowed action: perform a focused Part A re-review of `1.1.3 Grafieken en tabellen`.

Blocked action: treating L1.6R `pass_with_flags` as enough for unconditioned CP-6 closure.

Evidence needed:

- Current Part A review record for `1.1.3`.
- Explicit clear or fail decision for the remaining `FLAG`.
- Updated closure routing if the flag remains.

Stop condition: do not close CP-6 unconditionally while `1.1.3` Part A remains `FLAG`.

## Global Blocks

- CP-6 closure
- Year-1 closure
- protected reference mutation
- lesson-output mutation
- target-exercise promotion
- placeholder finalization
- unit minting
- student diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection
- PV machine promotion
- student-facing generated output
