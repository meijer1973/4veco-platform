# TASK-INGEST-TRANSFORM-3-TEXTBOOK Reviewer Notes

Generated: 2026-06-05

Status: revised for repair-3 interaction quality and source-pane visual QA.

## What Changed

The prior nine-card sequence was replaced by three cards:

1. `tb113-graph-construction`: graph-construction substitute;
2. `tb113-graph-reading`: read `Q` at `P = EUR 1.75`;
3. `tb113-quantity-drop-check`: optional 50 percent follow-up.

The active assignment is no longer rendered in the source pane. The completed
graph is not rendered as default source before the graph-construction task.

Repair 3 makes the graph workspace the primary interaction: after correct axis
selection, labels and numeric scale reveal, the student clicks two table
points, and typed coordinate entry remains collapsed fallback only.

## Checker Focus

`TaskShellEngine` validates the graph-construction substitute response shape:

- P/Q axis convention;
- two clicked table points;
- decreasing line confirmation.

The proof checker also fails if:

- a prompt block appears in `.source-pane`;
- the completed graph is visible before graph-construction success;
- the graph workspace is not in the task pane;
- the desktop graph workspace is narrower than the visual QA threshold;
- the primary path is not click-to-place graph construction;
- graph axis or number labels are visible before axis selection;
- typed point entry is open or primary instead of collapsed fallback;
- long source refs are visible in the source pane;
- desktop source/table layout is not readable;
- the task set exceeds three cards without waiver.

## Boundary

Owned textbook-source authority remains bounded. This is not official exam
authority, product-route adoption, target-equivalent proof, or student use.
