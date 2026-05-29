# Sprint SPEC-ET-1: Baseline

Date: 2026-05-29

## Plan reference

Plan: `reports/sprints/SPEC-ET-1-plan.md`

## Current specification state

`../4veco-lessen/specifications/product-end-state.md` currently says the
student route goes from current readiness to target-exercise readiness and
that the exit ticket checks whether the student is ready to try the target
exercise.

`../4veco-lessen/specifications/companion-core-specifications.md` currently
allows Q2-approved output to say `Je bent klaar om de eindopgave te proberen`
and prohibits stronger proof wording unless a later gate authorizes it.

The human report states this underclaims the desired end state. The exit ticket
must instead be the paragraph target-equivalent proof task: same operation
chain, same cognitive level, matching answer forms, local non-summative
completion claim only.

## Roadmap baseline

The lesson roadmap already includes the shared task-type UI and engine
operationalization track from SYNC-4, but the active rows still use
target-exercise-readiness wording for `L1.7B-Q2`, `GATE-L1.7B-Q2`, and Scale
Gate 1. The platform roadmap tracks `GAME-UX-3A`, but it should explicitly
serve target-equivalent exit tickets and exam-style answer-form requirements.

## Data integrity notes

This sprint is specification and roadmap work only. It must not edit
`references/machine/`, `references/external/`, generated lesson output, engine
source, candidate storage, target-exercise records, or generated projections.
Protected reference data status at baseline: no protected reference data
changes are authorized.

## Stop conditions

- Stop if the requested correction requires protected reference data mutation.
- Stop if the correction would activate or regenerate student-facing lesson
  output.
- Stop if the roadmap would allow grade, mastery, diagnostic, adaptive,
  sequencing, summative, student-facing AI, PV, or product-use authority.
- Stop if Scale Gate 1 could treat weak checkpoint-only output as
  target-equivalent proof without an explicit waiver and checkpoint-only label.
