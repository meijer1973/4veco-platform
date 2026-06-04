# TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM Operation Chain Trace

Generated: 2026-06-04

Status: revised for `SHARED-TASK-INGEST-PLAYABLE-REPAIR-2`; target-task
economy repair only; no product authority.

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
| select source values | `q3-source-values` | four table values selected with roles |
| calculate threshold with visible work | `q3-calculation` | yearly premiums, deductible exposure, and difference |
| state threshold with direction | `q3-threshold-direction` | `649 euro per jaar` plus direction |

## Collapsed Support Policy

Formula conversion remains available as collapsed support because the
calculation needs `jaarpremie = maandpremie * 12`. It is not a required
`formula_builder` card.

Removed required support cards:

- `q3-annual-premium-formula`
- `q3-operation-order`
- `q3-source-chain`

## Boundary

This trace proves review-only task transformation. It authorizes no generated
lesson output, product-route adoption, target-equivalent proof, diagnostics,
mastery/sequencing, Scale Gate 1, or student/product use.
