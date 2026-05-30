# GAME-UX-3A Task-Family Fixture Summary

Generated: 2026-05-30

Status: source-controlled fixture summary for focused task-shell tests.

## Purpose

This record names the task families covered by the GAME-UX-3A runtime tests.
The actual executable fixtures live in `engines/tests/task-shell-engine.test.js`
and `engines/tests/task-shell-ui.test.js`.

## Accepted Families

| Family | Student action | Validation mode | Feedback state |
|---|---|---|---|
| `numeric_input` | numeric input | deterministic number with tolerance | retry / matched |
| `calculation_work_capture` | calculation/work capture | self-check criteria | retry / self_check |
| `final_answer_entry` | final-answer entry | deterministic number or accepted text | retry / matched |
| `unit_notation_field` | unit/notation field | accepted text | retry / matched |
| `short_constructed_response` | short constructed response | self-check criteria | retry / self_check |
| `table_value_selection` | table-value selection | deterministic option id | retry / matched |
| `graph_reading` | graph reading | deterministic number with tolerance | retry / matched |
| `point_placement` | point placement | x/y values with tolerance | retry / matched |
| `graph_construction_substitute` | graph-construction substitute | self-check criteria | retry / self_check |
| `structured_reasoning` | structured reasoning | self-check criteria | retry / self_check |

## Boundaries

These fixtures prove runtime representation and static rendering only. They do
not authorize generated lesson output, target-equivalent completion language,
diagnostics, mastery, sequencing, summative use, PV, Scale Gate 1, or
student/product use.
