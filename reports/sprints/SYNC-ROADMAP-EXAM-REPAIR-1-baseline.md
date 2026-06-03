# Sprint SYNC-ROADMAP-EXAM-REPAIR-1: Baseline

Generated: 2026-06-03

## Plan reference

Plan: `reports/sprints/SYNC-ROADMAP-EXAM-REPAIR-1-plan.md`

## Current git state

- Platform repo: `main` aligned with `origin/main` at
  `b662e8a Harden sprint protocol evidence`.
- Lesson repo: `main` aligned with `origin/main` at
  `b48a9bb Add shared task context ingestion spec updates`.
- Both worktrees were clean before sprint planning edits.

## Roadmap mismatch baseline

- Platform roadmap records `SPRINT-PROTOCOL-HARDEN-2` as closed and leaves the
  context/ingestion rows open.
- Platform roadmap still names the old active rows `SOURCE-RECONSTRUCT-1`,
  `TASK-INGEST-TRANSFORM-1`, and `GATE-SHARED-TASK-INGEST-1`.
- Lesson roadmap records the context/ingestion rows as completed, including
  `SYNC-TASK-CONTEXT-INGEST-1`, `TASK-CONTEXT-SPEC-1`,
  `TASK-CONTEXT-RUNTIME-1`, `CONTEXT-VISUAL-STD-1`,
  `SOURCE-RECONSTRUCT-1`, and `TASK-INGEST-TRANSFORM-1`.
- Lesson roadmap does not yet record `SPRINT-PROTOCOL-HARDEN-2`.
- Neither roadmap currently names `EXAM-SOURCE-AUTH-1` as the next authorized
  repair sprint.

## Data integrity notes

This sprint starts with no authorized protected reference data changes. It may
not edit `references/machine/`, `references/external/`, source data, candidate
storage, target-exercise records, PV machine-promotion files, or generated
Book 1 lesson output.

The only lesson-repo edits allowed are roadmap text changes in
`../4veco-lessen/lessen-team-roadmap.md`.

## Stop conditions

- Stop if the planning review finds a conflict with the product end-state or
  companion core specifications.
- Stop if a roadmap edit would imply generated lesson output, product-route
  adoption, target-equivalent proof, diagnostics, mastery/sequencing, PV, Scale
  Gate 1, or student/product use.
- Stop if the checker cannot reject old completed invalid evidence.
- Stop if either repository is behind or diverged and cannot be reconciled with
  a normal non-destructive pull/rebase strategy.
