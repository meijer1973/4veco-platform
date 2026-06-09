# Sprint MTU-ANS-PROOF-IMPL-1: Baseline

Generated: 2026-06-08

## Plan reference

Plan: `reports/sprints/MTU-ANS-PROOF-IMPL-1-plan.md`

## Starting point

- Safety gate: `AGENT-WORKTREE-SAFETY-1` is merged into `origin/main` through
  `ae01b1e4` (`Merge PR #16: Add agent worktree safety preflight`).
- Worktree: `C:/wt/MTU-ANS-PROOF-IMPL-1/4veco-platform`
- Branch: `codex/mtu-ans-proof-impl-1-20260608`
- Worktree safety claim: `MTU-ANS-PROOF-IMPL-1` / `codex-gpt5`
- Starting HEAD: `ae01b1e4bc9eaa696755c5aa40ded1e714ba06e1`

## Source baseline

- Reviewed route context: `source-data/book-1/exit-ticket/1.1.2-exit-ticket.json`
- Reviewed source task: `prijsstijging-procent`
- Existing family: `calculation_work_capture`
- Existing reviewed `1.1.2` exit-ticket source remains unchanged by this
  sprint.

## Data integrity notes

Protected reference data status: no edits are planned or authorized under
`references/machine/` or `references/external/`.

`A96` is present in the A-domain catalog but generator-blocked. The current
blocked-unit file lists `A96`, `A81`, and `A99` among generator-blocked units,
with student-facing route use and product authority set to false.

## Boundary baseline

- `GEN_A96` is absent from `engines/skilltree/generators.js`.
- `A96` is absent from generic `ROUTE_SKILLS` source export because missing
  A-domain generators are filtered from route rows.
- `A81` remains a source-use modifier boundary, not a standalone complete
  answer form.
- `A99` remains generator-blocked.

## Initial risks

- A final-answer-only checker could appear to pass if the proof only checks
  final answer and notation. This sprint must prove the structured
  answer-form parts are required.
- Unit/notation could be accidentally optional if the proof reuses the
  reviewed exit-ticket task unchanged. This sprint must use a stricter proof
  task without mutating reviewed source.
- A report lab can look convincing while failing negative cases. This sprint
  must include deterministic negative checks and screenshots.
