# Sprint SHARED-TASK-INGEST-PLAYABLE-REPAIR-1: Baseline

Date: 2026-06-04

Sprint: `SHARED-TASK-INGEST-PLAYABLE-REPAIR-1`

## Plan reference

Plan: `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-plan.md`

## Baseline State

`GATE-SHARED-TASK-INGEST-REPAIR-1` received direct human review comments with
decision `hold_for_playable_repair`.

Current strengths:

- actual-exam authority remains `external_primary`;
- textbook source authority remains `owned_textbook_source`;
- both labs have source/task split layout;
- both labs have proof for source scrolling and question visibility.

Current blockers:

- generic controls replace task-family affordances;
- check buttons do not semantically evaluate answers;
- source/support separation is weak;
- prompts are under-specified;
- proof lacks wrong/retry/corrected states;
- checker overweights layout and counts.

## Data integrity notes

Protected references, source data, and Book 1 generated lesson output must
remain unchanged during this sprint.

- Protected reference data status: no changes allowed under `references/machine/`
  or `references/external/`.
- Source-data status: no changes allowed under `source-data/`.
- Book 1 generated-output status: no changes allowed under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`.

## Expected Repair Target

The repaired labs must show real affordances for:

- `source_value_selection`;
- `formula_builder`;
- `step_ordering`;
- `source_chain_builder`;
- `table_value_selection`;
- `graph_reading`;
- `point_placement`;
- `calculation_work_capture`;
- `structured_short_response`.

They must also show collapsed support boxes for formula/procedure help and
wrong/retry/corrected/completed evidence in proof JSON.
