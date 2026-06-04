# TASK-INGEST-TRANSFORM-3-TEXTBOOK Reviewer Notes

Generated: 2026-06-04

Status: revised for target-task simplification and visual QA.

## What Changed

The prior nine-card sequence was replaced by three cards:

1. `tb113-graph-construction`: graph-construction substitute;
2. `tb113-graph-reading`: read `Q` at `P = EUR 1.75`;
3. `tb113-quantity-drop-check`: optional 50 percent follow-up.

The active assignment is no longer rendered in the source pane. The completed
graph is not rendered as default source before the graph-construction task.

## Checker Focus

`TaskShellEngine` validates the graph-construction substitute response shape:

- P/Q axis convention;
- all five table points;
- decreasing line confirmation.

The proof checker also fails if:

- a prompt block appears in `.source-pane`;
- the completed graph is visible before graph-construction success;
- the graph workspace is not in the task pane;
- the desktop graph workspace is narrower than the visual QA threshold;
- the task set exceeds three cards without waiver.

## Boundary

Owned textbook-source authority remains bounded. This is not official exam
authority, product-route adoption, target-equivalent proof, or student use.
