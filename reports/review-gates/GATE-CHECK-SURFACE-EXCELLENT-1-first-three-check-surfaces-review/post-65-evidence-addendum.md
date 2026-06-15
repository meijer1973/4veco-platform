# Post-65 Evidence Addendum

Gate: `GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review`

Sprint: `CHECKSURFACE-POST65-EVIDENCE-REFRESH-1`

Generated: 2026-06-15

Status: current-main evidence refresh passed.

## Purpose

This addendum reconciles the formal check-surface packet with current `main`
after platform PR #65 and lesson PR #15.

The 2026-06-12 gate-closure history is preserved. This addendum does not create
a new gate closure date and does not broaden authority.

## Current Main Baseline

- Platform main: `406f6358f477cfd50361855c45183da8c9f90990`
- Lesson main: `9758f1da5e0c2aeb9e707f749235916df45b3509`

These commits are after:

- platform PR #65 merge commit
  `41ace8300a7e344c80d22e9da5512e5eebd391ae`;
- lesson PR #15 merge commit
  `9758f1da5e0c2aeb9e707f749235916df45b3509`.

## Evidence Refreshed

`reports/json/graph-exit-ux1-proof.json` was regenerated against canonical
lesson output at:

```text
C:\Projects\4veco\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod
```

The refreshed proof was generated at:

```text
2026-06-15T12:43:34.705Z
```

It supersedes the stale pre-PR #65 `GRAPH-EXIT-UX-1` token evidence.

## Token Evidence

Pre-repair formula-token IDs are absent from the refreshed current proof.

Repaired token IDs are present in the refreshed current proof:

```text
oldQBase
oldQBeforeChange
newQBase
```

The current `GOLDEN-SURFACE-VISUAL-REVIEW-1` proof also records duplicate
visible formula-token labels absent.

## Findings

| ID | Classification | Blocks | Does not block | Proof required to close |
|---|---|---|---|---|
| CHECKSURFACE-RR1 | `core_requirement_met` | Nothing at surface-repair level | Evidence refresh work | `golden-surface-visual-review-1-proof.json` records mobile overflow absent and duplicate visible labels absent |
| CHECKSURFACE-RR2 | `core_requirement_met` | Nothing after this addendum | Narrow check-surface current-main reconciliation | `graph-exit-ux1-proof.json` regenerated on current main with old token IDs absent and repaired IDs present |
| CHECKSURFACE-RR3 | `scale_blocker` | Product-route adoption, diagnostics, mastery/PV, Scale Gate 1, student/product use | Narrow evidence refresh | Separate downstream product-proof gate |

## Authority Boundary

This addendum does not authorize:

- product-route adoption;
- new target-equivalent completion language;
- diagnostics;
- mastery/sequencing;
- PV;
- Scale Gate 1;
- broad product use;
- student/product use.

## Result

`CHECKSURFACE-POST65-EVIDENCE-REFRESH-1`: PASS.

The check-surface packet remains narrowly acceptable, and its formal evidence
is current after platform PR #65 and lesson PR #15.
