# Sprint EX-7: Baseline

Date: 2026-05-26

## Plan reference

- `reports/sprints/EX-7-plan.md`

## Current state

`GATE-EX6` is closed as `pass_with_conditions` and authorizes only validators
and dry-run CLIs. The roadmap marks `EX-7 Validator And Dry-Run CLI
Implementation` as active.

Current allowed implementation is limited to:

- validator scripts;
- dry-run-only CLI scripts;
- temporary test-only fixtures;
- generated reports/indexes and sprint logs.

## Forbidden outputs absent at baseline

These files do not exist at baseline and must remain absent:

- `references/data/exam-ingestion/operation-candidates.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `references/data/exam-ingestion/source-annex-extraction-overlays.json`

## Data integrity notes

No protected reference data is authorized for mutation. No files under
`references/machine/` or `references/external/` may be edited. q19 extraction
execution remains blocked. Candidate writes remain blocked.

The unrelated untracked file `knowledge/exit-ticket-game-1.1.1.zip` exists in
the worktree and must remain unstaged and untouched.
