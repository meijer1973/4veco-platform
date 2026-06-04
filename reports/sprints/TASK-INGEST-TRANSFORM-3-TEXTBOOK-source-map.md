# TASK-INGEST-TRANSFORM-3-TEXTBOOK Source Map

Sprint: `TASK-INGEST-TRANSFORM-3-TEXTBOOK`

## Authority Boundary

This transformation uses an owned textbook source:

- `sourceAuthority.kind`: `owned_textbook_source`
- Paragraph: `1.1.3 Grafieken en tabellen`
- Source material: `textbook-1-1-3-icecream-pq-table-graph`
- Paragraph source: `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen - paragraaf.md`
- Target registry context: `references/authored/course-target-exercises.json#paragraph_id=1.1.3`
- Visual source refs:
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/_assets/1.1.3_fig_1.svg`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/_assets/1.1.3_fig_3.svg`

It is not official exam authority, not external-primary evidence, not target-equivalent proof, and not a production route.

## Context Block Map

| Context block | Type | Source fragment | Used by |
|---|---|---|---|
| `ctx-icecream-prompt` | markdown | Target exercise prompt: draw P-Q graph, read P = EUR 1.75, evaluate 50 percent drop claim | all task cards |
| `ctx-icecream-source` | source_excerpt | Paragraph setup: ice-cream price and quantity source context | all task cards |
| `ctx-icecream-table` | table | Price/quantity table: 1.00/500, 1.50/400, 2.00/300, 2.50/200, 3.00/100 | all task cards |
| `ctx-icecream-graph` | graph | Reconstructed P-Q graph with quantity horizontal and price vertical | all task cards |
| `ctx-icecream-formula` | formula | Percent-change formula for claim checking | all task cards |
| `ctx-icecream-procedure` | flowchart | Six-step textbook procedure from table to graph | all task cards |

## Task-To-Source Map

| Task | Source dependency | Preserved requirement |
|---|---|---|
| `tb113-table-value` | `ctx-icecream-table` | Direct table reading |
| `tb113-axis-convention` | `ctx-icecream-graph`, `ctx-icecream-procedure` | Price vertical, quantity horizontal |
| `tb113-graph-step-order` | `ctx-icecream-procedure` | Textbook procedure order |
| `tb113-point-placement` | `ctx-icecream-table`, `ctx-icecream-graph` | Convert a table row into a P-Q point |
| `tb113-interpolation-source-values` | `ctx-icecream-table`, `ctx-icecream-graph` | Pick the two rows around P = EUR 1.75 |
| `tb113-graph-reading` | `ctx-icecream-graph`, `ctx-icecream-table` | Read approximately 350 at P = EUR 1.75 |
| `tb113-claim-calculation` | `ctx-icecream-table`, `ctx-icecream-formula` | Show source values plus percent-change calculation |
| `tb113-source-chain` | all context blocks | Bind source, axes, graph, interpolation, calculation, and conclusion |
| `tb113-answer-form` | `ctx-icecream-table`, `ctx-icecream-formula` | State interval, values, calculation, and conclusion |

## Ambiguity Record

The paragraph explicitly teaches EUR 1.50 to EUR 2.50 as 400 to 200, a 50 percent drop. The same source table also supports EUR 2.50 to EUR 3.00 as 200 to 100, also a 50 percent drop.

The transformation records both as source-valid candidates. A complete answer must include the interval, the two quantities, the percent-change calculation, and the conclusion.

