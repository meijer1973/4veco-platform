# TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM Operation-Chain Trace

## Authority

- Exam item: `vw-1022-a-25-1-o:opgave-1:question-3`
- Source reconstruction: `reports/json/source-reconstruct2-actual-exam.json`
- Transformation JSON: `reports/json/task-ingest-transform2-actual-exam.json`
- Prompt PDF: `references/external/exams/vw-1022-a-25-1-o.pdf#question-3`
- Correction PDF: `references/external/exams/vw-1022-a-25-1-c.pdf#question-3`

## Operation Chain

| Order | Operation | Inputs | Output | Task-family coverage |
|---:|---|---|---|---|
| 1 | Select and role-label source values | 108,25; 385; 86,25; 885 | Source values with variant, unit, and role | `q3-source-values`, `q3-source-chain` |
| 2 | Annualize monthly premium | 108,25 and 86,25 times 12 | 1299 and 1035 | `q3-annual-premium-formula`, `q3-operation-order`, `q3-calculation` |
| 3 | Compare deductible exposure | 1299 plus 385 | 1684 | `q3-operation-order`, `q3-calculation`, `q3-source-chain` |
| 4 | Derive equal-cost threshold | 1684 minus 1035 | 649 | `q3-calculation`, `q3-source-chain` |
| 5 | State threshold with direction | 649 and the prompt direction | Increased deductible is cheaper up to that yearly care-cost amount | `q3-source-chain`, `q3-threshold-direction` |

## Cognitive-Level Guard

The transformed bundle is not a source-selection exercise by itself. It
requires source use, formula/procedure control, visible calculation work, and a
constructed threshold direction. The checker must reject final-answer-only work
and must reject any transformed bundle that lacks the calculation or direction
tasks.

## Answer-Model Tie

The first point-rule path is preserved through annualizing the standard
premium and adding the standard deductible. The second point-rule path is
preserved through annualizing the increased-premium variant, deriving the
threshold, and stating the direction.
