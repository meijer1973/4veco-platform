# TASK-INGEST-TRANSFORM-3-TEXTBOOK Visual Variant Map

Sprint: `TASK-INGEST-TRANSFORM-3-TEXTBOOK`

## Visuals

| Visual | Source | Context block | Review-lab variants | Raw image copied |
|---|---|---|---|---|
| Ice-cream P-Q graph | `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/_assets/1.1.3_fig_1.svg` | `ctx-icecream-graph` | Inline SVG graph, light theme; inline SVG graph, dark theme; screenshot thumbnail | no |
| Table-to-graph procedure | `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen - paragraaf.md#procedure-grafiek-tekenen-van-tabeldata` | `ctx-icecream-procedure` | Flowchart cards, light theme; flowchart cards, dark theme; screenshot thumbnail | no |

## Variant Rules Applied

- The lab reconstructs visuals from source data and procedure steps instead of embedding raw textbook images.
- The graph uses theme-aware CSS colors in the rendered lab.
- The table remains readable on mobile through horizontal scrolling only where needed.
- Dark-mode proof is captured in `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-dark.png`.
- Visual variants stay review-only and are not deployed to Book 1 output.

