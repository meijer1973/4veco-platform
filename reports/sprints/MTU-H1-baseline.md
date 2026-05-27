# Sprint MTU-H1: Baseline

Date: 2026-05-27

## Plan reference

Plan: `reports/sprints/MTU-H1-plan.md`

## Current state

- The live MTU registry contains broad or currently over-trigger-prone units
  such as A20 `MO = MK oplossen`, A21 `Winst = TO - TK`, D07 `Heffing
  doorberekenen in prijs`, and F16 `MPC-MSC en MPB-MSB onderscheiden`.
- EX-0 through EX-7 established a non-mutating exam-ingestion and validator
  planning path, but there is no dedicated MTU-hardening benchmark that checks
  content, operation, answer-form, and misconception mapping separately.
- Question-type metadata exists in schema and exam records, but there is not
  yet a benchmark tying `berekenen`, `leg uit`, `analyseer`, and graphical
  question forms to answer-construction units.
- The Solo q1-q3 review is user-provided current exam analysis. MTU-H1 records
  it as planning evidence and does not claim to refresh official external
  sources.

## Repository state

- Platform worktree has one unrelated pre-existing untracked file:
  `knowledge/exit-ticket-game-1.1.1.zip`.
- Lesson worktree was clean at baseline.
- No `reports/mtu-hardening/` benchmark files existed before this sprint.

## Data integrity notes

No protected reference data changes are planned. `references/machine/` and
`references/external/` are read-only context for this sprint. MTU-H1 must not
run `unit-add`, `unit-update`, `unit-split`, `unit-merge`, `unit-deprecate`, or
any other CLI command that mutates the live machine registry.

## Stop conditions

- Stop if the benchmark requires hand edits to `references/machine/` or
  `references/external/`.
- Stop if a benchmark artifact authorizes unit minting, machine mutation,
  candidate writes, q19 extraction execution, or lesson-output mutation.
- Stop if q1 is mapped as requiring formal MPC/MSC welfare-loss machinery.
- Stop if q2 is mapped as requiring full TO-function construction rather than
  pointwise TO.
- Stop if q3 is mapped as requiring MK derivation or calculus-only MO routing
  where the official operation gives MK and can be taught through a
  non-calculus route.
- Stop if answer-form requirements are hidden inside content MTUs.
