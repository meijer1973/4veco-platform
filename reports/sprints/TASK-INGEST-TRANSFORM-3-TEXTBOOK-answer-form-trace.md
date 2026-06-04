# TASK-INGEST-TRANSFORM-3-TEXTBOOK Answer Form Trace

Sprint: `TASK-INGEST-TRANSFORM-3-TEXTBOOK`

## Required Answer Forms

| Answer form | Task cards | Required | Why |
|---|---|---|---|
| `axis_convention_control` | `tb113-axis-convention`, `tb113-graph-step-order`, `tb113-point-placement` | yes | The textbook target requires price vertical and quantity horizontal. |
| `graph_reading_and_interpolation` | `tb113-interpolation-source-values`, `tb113-graph-reading` | yes | P = EUR 1.75 must be read between source points. |
| `calculation_work` | `tb113-claim-calculation` | yes | The 50 percent claim needs visible percent-change work. |
| `constructed_claim_explanation` | `tb113-answer-form`, `tb113-source-chain` | yes | The answer must name interval, values, calculation, and conclusion. |

## Accepted Claim Candidates

- EUR 1.50 to EUR 2.50: 400 to 200 gives -50 percent.
- EUR 2.50 to EUR 3.00: 200 to 100 gives -50 percent.

## Anti-Reduction Rules

- `tb113-table-value` cannot stand in for the full answer.
- `tb113-claim-calculation` rejects a final interval without work text.
- `tb113-answer-form` rejects a missing calculation field.
- `tb113-source-chain` rejects a reversed or shallow source chain.
- The transformation remains review-only and does not claim target equivalence.

