# TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM Operation Chain Trace

Generated: 2026-06-05

Status: revised for `SHARED-TASK-INGEST-PLAYABLE-REPAIR-4`; final
interaction-clarity repair plus reviewer calculation-shortcut correction only;
no product authority.

## Original Target

`vw-1022-a-25-1-o:opgave-1:question-3`

> Bereken tot welk bedrag aan zorgkosten per jaar het voor een jongere
> voordeliger is om een verhoogd eigen risico te nemen.

The operation is a focused source-based calculation. It should not require a
formula-builder, step-ordering, or source-chain card as separate mandatory
interactions.

## Revised Operation Chain

| Operation | Required task | Evidence |
|---|---|---|
| identify comparison basis | `q3-source-values` | choose annual premium plus deductible exposure, not lowest monthly premium or all table values |
| calculate threshold with visible work | `q3-calculation` | full annual-cost route or premium-difference shortcut (`22x12 = 264; 264 + 385 = 649`), exact yearly unit validation, targeted feedback, and progressive support |
| state threshold with direction | `q3-threshold-direction` | carried `EUR 649 per jaar` plus constrained direction |

## Collapsed Support Policy

Formula conversion and optional source-value marking remain available only as
support around the calculation because the target is a focused threshold
calculation. They are not required cards.

Removed required support cards:

- `q3-source-values` as a source-value selection/select-all-numbers task
- `q3-annual-premium-formula`
- `q3-operation-order`
- `q3-source-chain`

Review-lab support after failed calculation attempts is allowed because this is
guided review evidence, not an exit-ticket or summative gate.

## Boundary

This trace proves review-only task transformation. It authorizes no generated
lesson output, product-route adoption, target-equivalent proof, diagnostics,
mastery/sequencing, Scale Gate 1, or student/product use.
