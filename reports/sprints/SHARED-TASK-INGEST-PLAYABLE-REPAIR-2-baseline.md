# Sprint SHARED-TASK-INGEST-PLAYABLE-REPAIR-2: Baseline

Date: 2026-06-04

## Plan reference

Plan: `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-2-plan.md`

## Human Review State

- `GATE-SHARED-TASK-INGEST-REPAIR-1` remains open.
- Renewed decision: `hold_for_playable_repair`.
- Required next repair: `SHARED-TASK-INGEST-PLAYABLE-REPAIR-2`.
- No gate closure, closure proposal, product-route adoption, generated lesson
  output, or Scale Gate authority exists.

## Current Defects

| Surface | Baseline defect |
|---|---|
| textbook transform | nine required cards; no primary graph-construction task |
| textbook prompt | `ctx-icecream-prompt` rendered as source context |
| textbook graph | completed P-Q graph available before construction attempt |
| textbook visual QA | source pane scrollability was treated as sufficient for graph work |
| actual-exam transform | six required cards for a two-point calculation |
| packet/checkers | no target-task economy or prompt-in-source hard fail |

## Data integrity notes

Before implementation, platform worktree was clean and `main` tracked
`origin/main`. Protected reference data in `references/machine/` and
`references/external/`, source-data paths, and Book 1 generated-output paths
must remain clean throughout this sprint.

## Required Direction

Repair toward a clean target experience:

- textbook: table -> draw/construct P-Q graph -> read graph -> optional 50
  percent check;
- exam: table -> select values -> calculate threshold -> write conclusion.
