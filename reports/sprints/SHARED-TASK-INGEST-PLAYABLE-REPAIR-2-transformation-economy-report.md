# SHARED-TASK-INGEST-PLAYABLE-REPAIR-2 Transformation Economy Report

Generated: 2026-06-04

Status: target-task economy evidence.

## Rule

Target-first transformation beats family coverage.

The repair enforces max 3 required cards unless a human waiver exists. No
waiver exists.

## Actual-Exam Economy

Original target:

```text
Bereken tot welk bedrag aan zorgkosten per jaar het voordeliger is om verhoogd eigen risico te nemen.
```

Revised sequence:

```text
source values -> calculation -> conclusion
```

Removed as required cards:

- formula builder;
- step ordering;
- source-chain builder.

## Textbook Economy

Original target:

```text
Teken een P-Q-grafiek bij de tabel.
```

Revised sequence:

```text
graph construction -> graph reading -> optional 50 percent follow-up
```

Removed as required cards:

- table-value warm-up;
- axis-only prompt;
- graph-step ordering;
- single-point placement;
- interpolation source-value selection;
- source-chain builder;
- answer-form checker.

## Result

Both transformed task sets now satisfy `max 3` and every required card maps to
the target operation or an explicit follow-up. The human gate remains open.
