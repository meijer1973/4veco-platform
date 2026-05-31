# Sprint GAME-ARCH-1: Operation-Chain Coverage

Generated: 2026-05-31

## Purpose

This table compares current practice/check evidence against the paragraph
target exercises for `1.1.1`, `1.1.2`, and `1.1.3`.

The goal is not to approve target-equivalent exit tickets. The goal is to
decide whether the current engines can be kept and refactored around the
shared route and shared task shell, or whether a rebuild path is needed.

## Coverage Table

| Paragraph | Target-exercise operation chain | Current coverage | Missing before target-equivalent proof | Architecture implication |
|---|---|---|---|---|
| `1.1.1` Schaarste en economisch denken | Calculate wheat revenue; identify opportunity costs; calculate mixed profit; compare choices; explain the better choice using scarcity. | Reasoning route now exposes schaarste/alternatieve-kosten route labels and structured reasoning self-check. Current `Korte check` covers local schaarste/alternatieve-kosten understanding with `targetReadinessEvidence: false`. | A separate target-equivalent task must combine calculation, opportunity-cost identification, comparison, and scarcity explanation at target level. The current short check does not cover the complete operation chain. | Keep short check as advisory. Build target-equivalent exit-ticket composition separately through shared task shell. |
| `1.1.2` Percentages en indexcijfers | Calculate percentage change; calculate price index; calculate percentage change from index values; explain why index-point change is not the same as percentage change. | Math route covers `A38` and `A39` through shared task-shell numeric input, calculation/work capture, final-answer entry, and unit/notation fields. Reasoning route can support explanation practice. | No published exit-ticket source/page covers all four subquestions at target level. The explanation of the index-point trap needs answer-form quality, not only numeric self-check. | Refactor math around target-chain coverage and connect with reasoning/short-response answer forms in a later target-equivalent exit-ticket sprint. |
| `1.1.3` Grafieken en tabellen | Draw a P-Q graph from table data with price on vertical axis and quantity on horizontal axis; read/interpolate sales at a price; identify a 50 percent drop between prices and explain with table evidence. | Graph route covers table-value selection, graph reading, axis convention, interpolation, point placement, graph-construction substitute, calculation/work capture, and a less-labelled graph variant. | No published exit-ticket source/page composes these operations into a target-equivalent proof. The source-use/explanation part of the 50 percent claim still needs answer-form quality and reviewed target-chain mapping. | Keep/refactor graph as the strongest route. Use it as reference pattern, but require target-chain validation before exit-ticket publication. |

## Coverage By Task Family

| Task family | Current route evidence | Target-equivalent readiness status |
|---|---|---|
| Numeric input | Graph and math routes use shared task-shell numeric input. | Good practice evidence; target-equivalent composition still needed. |
| Calculation/work capture | Math route covers calculation work; graph route includes calculation/work capture for data use. | Good practice evidence; target-level multi-step composition still needed. |
| Final-answer entry | Math route covers final-answer entry for `A38`/`A39`. | Needs integration with target-answer forms and feedback rules. |
| Unit/notation field | Math route covers percentage/index notation. | Needs target-chain proof for notation traps. |
| Short constructed response | Reasoning route uses structured self-check, not evaluated answer quality. | Refactor around answer-form MTUs and reviewed answer-quality criteria. |
| Table-value selection | Graph route covers table-value selection. | Strong practice evidence; needs exit-ticket composition. |
| Graph reading | Graph route covers graph reading and interpolation. | Strong practice evidence; needs target-chain proof. |
| Point placement / graph construction substitute | Graph route covers point placement and construction substitute. | Strong practice evidence; exact drawing/proof boundary needs later review. |
| Source use | Graph and short-check routes use source observations locally. | Needs explicit source-use plus underlying answer-form mapping before proof. |
| Feedback and advice | Graph, math, and reasoning now provide local feedback; short check can advise practice. | Keep local and non-summative. Stronger completion language belongs only to target-equivalent exit ticket after review. |

## Conclusion

The current engines are strong enough to keep and refactor around the shared
route/task-shell model. They are not yet strong enough to authorize
target-equivalent exit-ticket claims or Scale Gate 1 reliance.

The next architecture step should be `GAME-ARCH-2`: an integrated practice
engine architecture plan that defines how current engine files are kept,
wrapped, deprecated, or rebuilt around operation-chain coverage and the shared
task shell.
