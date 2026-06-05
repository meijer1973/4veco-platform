# GRAPH-CHECK-UX-1 Baseline

Generated: 2026-06-05

## Current Blocker

`GATE-CHECK-SHORT-EXIT-2` returned `REVISE / hold_for_surface_repair`.
The reset audit records the primary blocker:

- `1.1.3` advisory `Korte check` has no graph/table interaction;
- `1.1.3-short.context_block_count = 0`;
- `1.1.3-short.task_shell_count = 0`;
- `1.1.3-short.graph_workspace_required = false`;
- the source data contains three ordinary `choice` tasks.

## Source Baseline

`source-data/book-1/exit-ticket/1.1.3-korte-check.json` currently contains:

- task `pq-assen`, type `choice`;
- task `tabelrij-lezen`, type `choice`;
- task `halvering-herkennen`, type `choice`;
- no `contextBlocks`;
- no task-shell families;
- no graph workspace.

## Runtime Baseline

The exit-ticket wrapper already supports `task_shell` tasks. The shared
task-shell runtime already supports:

- `graph_construction_substitute`;
- `graph_reading`;
- `table_value_selection`;
- visible grid lines in graph construction;
- same-workspace graph line confirmation;
- feedback and practice-route links.

Therefore this sprint should not need a broad engine rewrite.

## Authority Baseline

- `1.1.2` exit ticket remains the only locally approved completion-language
  case.
- `1.1.1` and `1.1.3` exit-ticket completion language remains held.
- The `1.1.3` short check remains advisory only.
