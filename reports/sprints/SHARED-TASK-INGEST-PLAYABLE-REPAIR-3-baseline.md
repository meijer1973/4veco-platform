# Sprint SHARED-TASK-INGEST-PLAYABLE-REPAIR-3: Baseline

Date: 2026-06-05

## Plan reference

Plan: `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-3-plan.md`

## Human Review State

- `GATE-SHARED-TASK-INGEST-REPAIR-1` remains open.
- Renewed decision: `hold_for_playable_repair`.
- Required next repair: `SHARED-TASK-INGEST-PLAYABLE-REPAIR-3`.
- No gate closure, closure proposal, product-route adoption, generated lesson
  output, or Scale Gate authority exists.

## Current Defects

| Surface | Baseline defect |
|---|---|
| textbook graph interaction | graph task is still mainly typed five-point entry |
| graph axis/number labels | final labels and scale are visible before axis choice |
| textbook source panel | source pane is mechanically scrollable but visually cramped and exposes long source refs |
| actual-exam orientation | original exam question is not visible enough in the right task flow |
| actual-exam task 1 | repeated value/role rows create cognitive overload |
| actual-exam task 3 | conclusion does not carry the task-2 calculated value and does not use constrained direction first |

## Data integrity notes

Before implementation, platform worktree was clean on
`codex/shared-task-ingest-repair2` and tracked the pushed repair-2 branch.
Protected reference data in `references/machine/` and `references/external/`,
source-data paths, and Book 1 generated-output paths must remain clean
throughout this sprint.

## Required Direction

Repair toward a cleaner interaction:

- textbook: choose axes -> reveal labels -> click two graph points -> confirm
  the line -> read graph -> optional 50 percent check;
- exam: see original question -> select useful table cells compactly ->
  calculate threshold -> complete a direction-first carried-value conclusion.
