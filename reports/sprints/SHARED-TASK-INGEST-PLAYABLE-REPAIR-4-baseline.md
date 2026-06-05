# Sprint SHARED-TASK-INGEST-PLAYABLE-REPAIR-4: Baseline

Generated: 2026-06-05

Status: baseline before final interaction clarity repair.

## Plan reference

This baseline implements
`reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-4-plan.md`.

## Review Decision

`GATE-SHARED-TASK-INGEST-REPAIR-1: REVISE`

Gate direction: `hold_for_playable_repair`.

This is a narrowed revise, not a failure. The gate remains open and no product
authority exists.

## Baseline Defects

| Surface | Baseline issue | Required repair |
|---|---|---|
| textbook graph line | separate `Gemaakte grafiek` block appears after success | draw line in same active graph workspace |
| textbook graph grid | grid/label reveal needs clearer proof | grid visible from start; labels/scale delayed |
| textbook 50 percent task | free-form interval/unit/calculation fields unclear | interval choice with auto-filled quantities, or remove from required proof |
| exam task 1 | compact source selection is still artificial select-all-numbers work | conceptual setup choice or fold into calculation |
| exam task 2 | `649` plus `euros` can fail; feedback is generic | accept variants and target unit/work/number feedback |
| exam support | repeated failed attempts do not unlock useful support | add review-only progressive hint/setup/solution path |
| source/table labels | visible `Bron 1` / `Tabel 1` repeated | one visible identifier per block |
| visual QA | misses duplicate labels, line placement, grid, feedback/support blockers | hard-fail those issues |

## Data integrity notes

- Protected reference data in `references/machine/` and
  `references/external/`: unchanged at baseline.
- Source data: unchanged at baseline.
- Generated Book 1 lesson output: unchanged at baseline.
- Gate closure files: none authorized for this sprint.
