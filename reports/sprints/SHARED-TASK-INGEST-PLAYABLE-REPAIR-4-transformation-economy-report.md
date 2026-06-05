# SHARED-TASK-INGEST-PLAYABLE-REPAIR-4 Transformation Economy Report

Generated: 2026-06-05

Status: target-task economy check passed after reviewer correction pass for
review-lab evidence only; gate remains open and unauthorized for product use.

Scope:

- `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM`
- `TASK-INGEST-TRANSFORM-3-TEXTBOOK`

## Max 3 Rule

Both transformations preserve the human-review max 3 required-card rule.

| Surface | Required sequence | Card count | Result |
|---|---|---:|---|
| actual exam | `choice -> calculation_work_capture -> structured_short_response` | 3 | pass |
| textbook | `graph_construction_substitute -> graph_reading -> calculation_work_capture` | 3 | pass |

## Actual Exam Economy

The previous low-value source-selection card is removed as required evidence.
The first card now asks what must be compared:

```text
Jaarpremie + eigen-risico exposure
```

This keeps source use meaningful without making the student select every table
number. The calculation card carries the target operation and now accepts both
the full annual-cost route and the premium-difference shortcut
`22x12 = 264, 264 + 385 = 649`, accepts reasonable yearly unit variants, gives
targeted feedback, and offers progressive support in the review lab. The
conclusion card consumes the calculated `EUR 649 per jaar` value and uses
constrained direction controls.

Rejected overbuild:

- select-all-numbers source-value card;
- required formula-builder card;
- required step-ordering card;
- required source-chain card;
- free-text conclusion that repeats the threshold.

## Textbook Economy

The original target task remains primary:

```text
Teken een P-Q-grafiek bij de tabel.
```

The graph-construction card handles axis choice, click-to-place points, line
confirmation, visible grid, delayed labels/scale, table-derived tick labels,
and the same-workspace line. The graph-reading card is a direct follow-up. The
50 percent ambiguity is kept as a simplified follow-up with interval choice,
auto-filled quantities, relation selection, and a conclusion choice, not as a
free-form formatting puzzle and not as an interval-only answer.

Rejected overbuild:

- table-reading warm-up before graph construction;
- separate axis-only card;
- typed coordinate entry as primary path;
- separate completed graph below the workspace;
- free-form interval plus unit fields for the 50 percent task;
- interval-only completion for the 50 percent task;
- generic quarter-scale graph ticks detached from the table values;
- broad family-coverage cards that do not serve the target task.

## Shared-Task Support

The 50 percent follow-up remains a `calculation_work_capture` shared task
variant with `selectionMode: interval_halving_check`. `TaskShellEngine`
validates the interval, relation, and conclusion controls and exposes a shared
focus plan for those controls, so this task shape is no longer a review-lab
HTML-only affordance.

## Boundary

This report supports renewed review of `GATE-SHARED-TASK-INGEST-REPAIR-1`
only. It does not authorize gate closure, generated output, source-data or
protected-reference mutation, product-route adoption, target-equivalent proof,
diagnostics, mastery/sequencing, PV, Scale Gate 1, broad product use, or
student use.
