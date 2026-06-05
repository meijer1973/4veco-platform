# TASK-INGEST-TRANSFORM-3-TEXTBOOK Reviewer Notes

Generated: 2026-06-05

Status: revised for repair-4 interaction clarity, source-pane visual QA, and
reviewer correction pass.

## What Changed

The prior nine-card sequence was replaced by three cards:

1. `tb113-graph-construction`: graph-construction substitute;
2. `tb113-graph-reading`: read `Q` at `P = EUR 1.75`;
3. `tb113-quantity-drop-check`: optional 50 percent follow-up.

The active assignment is no longer rendered in the source pane. The completed
graph is not rendered as default source before the graph-construction task.

Repair 4 makes the graph workspace tighter: axis controls are attached to the
graph, the grid is visible from the start, labels and numeric scale reveal
only after correct axis selection, the scale uses table-derived numbers, the
student clicks two table points, and the line appears inside the same graph
workspace after `Trek lijn door punten`. Typed coordinate entry remains
collapsed fallback only. The 50 percent follow-up is simplified to interval
choice plus auto-filled quantities, a relation selection, and a conclusion
choice so the answer is not interval-only.

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
- the line is drawn outside the active graph workspace;
- a separate `Gemaakte grafiek` completed-graph block appears;
- the grid is hidden before axis selection;
- table-derived graph tick labels are missing after axis selection;
- graph axis or number labels are visible before axis selection;
- typed point entry is open or primary instead of collapsed fallback;
- the 50 percent task uses unclear free-form interval/unit fields;
- the 50 percent task can be completed only by entering an interval string;
- the interval-halving interaction is not represented as a shared
  `calculation_work_capture` task variant;
- long source refs are visible in the source pane;
- desktop source/table layout is not readable;
- the task set exceeds three cards without waiver.

## Boundary

Owned textbook-source authority remains bounded. This is not official exam
authority, product-route adoption, target-equivalent proof, or student use.
