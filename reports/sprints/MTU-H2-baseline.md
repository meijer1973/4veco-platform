# Sprint MTU-H2: Baseline

Date: 2026-05-27

## Plan reference

Plan: `reports/sprints/MTU-H2-plan.md`

## Current state

- MTU-H1 is closed and provides the seed benchmark:
  `reports/mtu-hardening/benchmark-sample-v1.json`.
- The roadmap now places MTU-H2 as the active operational next action at the
  top of the Sprint Ledger.
- The live MTU registry remains unchanged by MTU-H1. Units such as A20, A21,
  D07, and F16 are read-only context for MTU-H2.
- The current benchmark identifies q1, q2, and q3 as canonical micro-cases, but
  no human review has yet accepted any candidate unit/refactor for mutation.

## Repository state

- Platform worktree has one unrelated pre-existing untracked file:
  `knowledge/exit-ticket-game-1.1.1.zip`.
- Lesson output is not in scope for MTU-H2.
- No MTU-H2 canonical-case package or GATE-MTU-H2 review packet existed before
  this sprint.

## Data integrity notes

No protected reference data changes are planned. `references/machine/` and
`references/external/` are read-only context for this sprint. MTU-H2 must not
run `unit-add`, `unit-update`, `unit-split`, `unit-merge`, `unit-deprecate`, or
any other CLI command that mutates the live machine registry.

## Stop conditions

- Stop if a candidate package authorizes direct mutation.
- Stop if a candidate package creates persistent candidate storage under
  `references/data/exam-ingestion/`.
- Stop if q1 is treated as requiring full formal MPC/MSC or welfare-loss
  machinery.
- Stop if q2 is treated as requiring a full TO-function construction.
- Stop if q3 is treated as requiring MK derivation where MK is given, or as
  requiring a calculus-only MO route.
- Stop if broad answer-form or incidence-family work is silently folded into
  H2 instead of routed to MTU-H3 or MTU-H4.
