# SHARED-TASK-INGEST-PLAYABLE-REPAIR-2 Visual QA Report

Generated: 2026-06-04

Status: prepared for validation after regenerated screenshots.

## Scope

Reviewed visual QA requirements for `TASK-INGEST-TRANSFORM-3-TEXTBOOK` and
`TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM` after target-task simplification.

## Criteria

| Criterion | Expected evidence |
|---|---|
| graph workspace in main task pane | proof field `graphWorkspaceInTaskPane: true` |
| desktop graph workspace size | proof field `graphWorkspaceWidthPass: true` |
| prompt not in source pane | proof field `promptInSourcePaneCount: 0` |
| completed graph not visible before graph construction | proof field `completedGraphVisibleBeforeAttempt: false` on initial state |
| table and graph task orientation | desktop initial screenshot shows source table and right-panel graph workspace |
| mobile/dark proof | completed screenshots exist for mobile light and mobile dark |

## Review Notes

The graph construction workspace is deliberately placed inside the right/main
task pane. The source pane contains source text, table, and collapsed support,
not the completed graph output. The completed graph can appear only after the
graph-construction card is corrected or in completed proof states.

This visual QA report treats scrollability as necessary but not sufficient:
the graph workspace must be large enough for construction work.
