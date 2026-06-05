# CHECKSURFACE-RESET-1 Product Quality Audit

Generated: 2026-06-05

## Audit Verdict

`GATE-CHECK-SHORT-EXIT-2` is held for surface repair.

```text
GATE-CHECK-SHORT-EXIT-2: REVISE
Gate direction: hold_for_surface_repair
Additional direction: replan before the next human gate
```

This is not a failure. It is a product-quality reset before any retry gate.
The current packet proves generated pages, screenshots, and authority flags,
but it does not prove the 4veco product end-state: a coherent route from
current readiness to target-equivalent proof through the right task
interaction, useful feedback, and clear next action.

## Product-End-State Gap

The current first-three-paragraph check packet is too administrative. It asks
whether pages exist, whether screenshots exist, whether landing cards render,
and whether authority is held. Those are necessary, but they are not enough.

For `1.1.3 Grafieken en tabellen`, the core student operation is graph/table
work. A short check may be advisory, but it still needs to use graph/table
interaction. The current `Korte check` is only multiple choice. That makes the
surface weak exactly where the paragraph needs the strongest visual and
interactive proof.

## Required Findings

### F1 - `1.1.3` Short Check Lacks Graph/Table Interaction

Severity: blocking.

Evidence:

- `source-data/book-1/exit-ticket/1.1.3-korte-check.json` contains three
  ordinary `choice` tasks.
- No `contextBlocks` are present.
- No graph workspace is present.
- `reports/json/check-short-exit2-proof.json` records
  `graph_workspace_required: false` for `1.1.3-short`.

Next action: `GRAPH-CHECK-UX-1` must rebuild the advisory short check as a
graph/table route check with a rendered graph/table workspace.

### F2 - `1.1.3-short` Proof Has No Context Or Task Shell

Severity: blocking.

Evidence:

- `reports/json/check-short-exit2-proof.json` records
  `1.1.3-short.context_block_count = 0`.
- `reports/json/check-short-exit2-proof.json` records
  `1.1.3-short.task_shell_count = 0`.

Next action: `GRAPH-CHECK-UX-1` must add graph/table task-family evidence and
rendered proof.

### F3 - `1.1.3` Exit Ticket Has Better Data But Weak Rendered Product

Severity: blocking for `1.1.3` product proof.

Evidence:

- `1.1.3-exit` data includes `graph_construction_substitute`,
  `graph_reading`, and `calculation_work_capture`.
- The generated exit-ticket shell renders source context before the tasks as a
  separate block, not as the source-left/task-right graph workspace that the
  shared-task ingestion repair established for source-heavy graph work.

Next action: `GRAPH-EXIT-UX-1` must add split source/task layout support for
context-heavy exit tickets.

### F4 - Visual QA Was Insufficient

Severity: high.

Evidence:

- Screenshot proof exists and all captures succeeded.
- The proof does not judge whether the graph paragraph short check actually
  uses a graph/table interaction.
- The review lab is a navigation and screenshot aid, not a strong playable
  product-quality proof.

Next action: `VISUAL-QA-HARDEN-2` must add hard failures for graph paragraphs
with no graph/table interaction, source-heavy exit tickets without split
layout, weak workspace proof, and missing student-experience judgment.

### F5 - Lead Review Missed Product-Experience Blockers

Severity: high.

Evidence:

- `reports/sprints/CHECK-SHORT-EXIT-2-lead-review-round2.md` recorded
  `PASS WITH FLAGS`.
- It said no blocking findings remained after screenshot repair and label
  hygiene.
- It did not identify that the graph paragraph short check has no graph.

Next action: `CHECK-SURFACE-PREGATE-1` must include a lead review that checks
against `product-end-state.md` and explicitly judges student experience, not
only validator and screenshot presence.

## Required Sprint Series

The reset sequence before any new human gate is:

```text
CHECKSURFACE-RESET-1
GRAPH-CHECK-UX-1
GRAPH-EXIT-UX-1
CHECK-ROUTE-COPY-1
VISUAL-QA-HARDEN-2
CHECK-SURFACE-PREGATE-1
GATE-CHECK-SHORT-EXIT-2-RETRY
```

## Stop Conditions

Stop downstream reliance if:

- this gate is treated as passed;
- a closure proposal or gate-closure record appears;
- `1.1.3` short check remains multiple-choice-only;
- `1.1.3` exit ticket remains source context above tasks instead of split
  source/task workspace;
- visual QA continues to prove screenshots and labels without judging student
  product quality;
- the next human gate is requested before the reset series produces a green
  product packet;
- any authority is broadened.

## Operational Next Action

Proceed to `GRAPH-CHECK-UX-1` after this reset sprint is committed and pushed.
Do not request `GATE-CHECK-SHORT-EXIT-2-RETRY` until
`CHECK-SURFACE-PREGATE-1` has passed.
