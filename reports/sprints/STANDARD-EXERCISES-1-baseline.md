# Sprint STANDARD-EXERCISES-1: Baseline

Generated: 2026-06-01

## Plan reference

Plan: `reports/sprints/STANDARD-EXERCISES-1-plan.md`

## Current task-shell standard

`GAME-ARCH-2` records the current shared task-shell families as:

- `choice`
- `numeric_input`
- `calculation_work_capture`
- `final_answer_entry`
- `unit_notation_field`
- `short_constructed_response`
- `table_value_selection`
- `graph_reading`
- `point_placement`
- `graph_construction_substitute`
- `structured_reasoning`

The stable specs now require the shared task-type UI to cover overlapping
calculation, graph/table, reasoning, and checkpoint interactions. They also
call out step/chain interactions and flow-diagram build as expected standard
families where they improve learning.

## Current surface state

Known current state before this audit:

- Graph/table practice is the strongest current operational route and uses the
  shared task shell for table selection, graph reading, point placement,
  graph-construction substitute, and calculation/work capture.
- Math/calculation practice uses task-shell steps for A38/A39-style numeric
  and calculation tasks, but later work must harden unit/notation and
  target-operation alignment.
- Reasoning practice has a `structured_reasoning` task-shell route, but
  remains the likely outlier because older modes, step/chain actions, source
  reasoning, classification, and flow-style reasoning are not yet represented
  as a full unified family set.
- Exit-ticket/checkpoint surfaces use the task shell for the reviewed `1.1.2`
  target-equivalent candidate, while `1.1.1` remains advisory and `1.1.3`
  lacks a check route.
- Procedure/stappenplan support remains a support route, not the primary math
  or target-equivalent proof route.

## Current roadmap/spec state

`CHECK-SHORT-EXIT-1` closed PASS WITH FLAGS and made
`STANDARD-EXERCISES-1` the next open Product Proof Track sprint. Scale Gate 1
remains blocked until `GATE-PRODUCT-3P` and `REV-STD-1` close or are explicitly
waived with consequences.

## Data integrity notes

This is an audit/contract sprint. No protected reference data under
`references/machine/` or `references/external/` should change. No generated
lesson output, engine code, source exit-ticket data, reasoning CSV,
skilltree/graph/procedure source data, candidate storage, target-exercise
fields, PV projection, diagnostics, adaptive routing, mastery/sequencing,
Scale Gate 1, or product-wide use is in scope.

The unrelated untracked `knowledge/exit-ticket-game-1.1.1.zip` remains present
and must not be touched.
