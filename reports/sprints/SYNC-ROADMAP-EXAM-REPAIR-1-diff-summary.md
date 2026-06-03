# Sprint SYNC-ROADMAP-EXAM-REPAIR-1: Diff Summary

Generated: 2026-06-03

## Summary

Roadmap-only synchronization sprint plus a deterministic checker and sprint
evidence.

## Platform repo changes

- `references/reference-team-roadmap.md` now records
  `SYNC-ROADMAP-EXAM-REPAIR-1` as closed, adds `EXAM-SOURCE-AUTH-1`, marks
  `SYNC-TASK-CONTEXT-INGEST-1` as superseded/open, replaces old active
  reconstruction/transform/gate rows with actual-exam/textbook repair rows,
  and blocks downstream product proof on
  `GATE-SHARED-TASK-INGEST-REPAIR-1`.
- `build-scripts/sprints/check-sync-roadmap-exam-repair1.js` validates both
  roadmap ledgers, repair sequence ordering, source-authority row requirements,
  stale old active rows, false completion status, and duplicate open blocker
  rows.
- `reports/sprints/SYNC-ROADMAP-EXAM-REPAIR-1-*` and
  `references/data/sprints/SYNC-ROADMAP-EXAM-REPAIR-1.*.json` record sprint
  plan, baseline, planning review, command log, lead-review cycle, result, and
  diff summary.
- GitHub-facing maps, URL index, and internal dashboard were refreshed.

## Lesson repo changes

- `../4veco-lessen/lessen-team-roadmap.md` now mirrors the repaired sequence,
  records `SPRINT-PROTOCOL-HARDEN-2`, corrects false-complete context/source
  rows to open/superseded, and blocks duplicate Scale Gate rows on the repaired
  ingestion gate.

## Protected surfaces

No protected reference data changed. No edits were made under
`references/machine/` or `references/external/`.

No `source-data/`, generated Book 1 lesson output, target-exercise registry,
candidate storage, PV projection, or PV machine-promotion files were changed.

## Review

Lead review round 1 returned REVISE for a duplicate lesson `Scale Gate 1` row
and checker duplicate-row weakness. Corrections updated the duplicate row and
hardened checker duplicate handling for named blocker rows. Round 2 returned
PASS WITH FLAGS.
