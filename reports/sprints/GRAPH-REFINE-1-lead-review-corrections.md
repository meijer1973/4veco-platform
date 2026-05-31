# Sprint GRAPH-REFINE-1: Lead-Review Corrections

Generated: 2026-05-31

## Round-1 Verdict

Round-1 lead review returned REVISE.

## Corrections Applied

| Finding | Correction | Files changed |
|---|---|---|
| Evidence checker could pass positive target-equivalent authorization wording | Changed checker to require the exact negative phrase `No target-equivalent completion language is authorized` and to fail if positive `target-equivalent completion language is authorized` remains after removing the exact negative phrase | `build-scripts/sprints/check-graph-refine1-evidence.js` |
| Round-1 report needed durable record | Added full round-1 lead-review report with REVISE verdict and BF-1 | `reports/sprints/GRAPH-REFINE-1-lead-review-round1.md` |

## Validation After Corrections

To be rerun before round 2:

```bash
node build-scripts/sprints/check-graph-refine1-evidence.js
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GRAPH-REFINE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js GRAPH-REFINE-1
node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

## Round-2 Readiness

The correction set addresses the round-1 blocker and is ready for lead-review
round 2.
