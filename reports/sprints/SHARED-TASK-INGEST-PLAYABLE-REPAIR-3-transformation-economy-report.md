# SHARED-TASK-INGEST-PLAYABLE-REPAIR-3 Transformation Economy Report

Generated: 2026-06-05

Status: PASS for bounded repair sprint; human gate remains open.

## Review Decision Carried Into Sprint

Renewed human review returned `hold_for_playable_repair`. Repair 2 fixed
target-task economy but left interaction-quality blockers. Repair 3 therefore
preserves the three-card limit while repairing the active controls.

## Actual-Exam Transformation

Original target:

```text
Bereken tot welk bedrag aan zorgkosten per jaar het voor een jongere voordeliger is om een verhoogd eigen risico te nemen.
```

Repaired three-card sequence:

```text
source_value_selection -> calculation_work_capture -> structured_short_response
```

| Card | Economy decision |
|---|---|
| `q3-source-values` | kept, but rendered as compact source-cell selection instead of value/role dropdown rows |
| `q3-calculation` | kept as the required visible-work calculation |
| `q3-threshold-direction` | kept, but consumes the task-2 value and constrains the direction |

Removed as required cards: formula builder, step ordering, source-chain
builder. Formula/procedure support remains collapsed source support only.

## Textbook Transformation

Original target:

```text
Teken een P-Q-grafiek bij de tabel.
```

Repaired three-card sequence:

```text
graph_construction_substitute -> graph_reading -> calculation_work_capture
```

| Card | Economy decision |
|---|---|
| `tb113-graph-construction` | primary target card; click two points in the graph workspace after axis selection |
| `tb113-graph-reading` | kept as immediate graph-reading follow-up |
| `tb113-quantity-drop-check` | kept as optional ambiguity follow-up |

Removed as required cards: table warm-up, axis-only card, graph-step ordering,
single-point placement card, interpolation source-value card, source-chain
card, and answer-form card.

## Checker Hard Fails Added

- original exam question missing from right task pane;
- actual-exam task 1 requires more than four selections or more than two
  distractors;
- actual-exam task 1 renders repeated value/role dropdown rows;
- actual-exam task 3 lacks carry-forward from task 2;
- actual-exam task 3 uses free-text direction instead of constrained
  direction;
- textbook graph task lacks click-to-place interaction;
- typed coordinate entry is open or primary;
- graph labels or numeric scale appear before correct axis selection;
- completed graph is visible before graph-construction success;
- source pane shows long file paths;
- desktop source/table layout is not readable.

## Boundary

This sprint repairs review-lab evidence only. It does not close
`GATE-SHARED-TASK-INGEST-REPAIR-1`, authorize generated lesson output, mutate
protected references or source data, adopt product routes, prove
target-equivalence, or authorize Scale Gate 1.

