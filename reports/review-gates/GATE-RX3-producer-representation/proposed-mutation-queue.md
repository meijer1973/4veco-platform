# GATE-RX3 Producer Representation: Proposed Queue

Status: `prepared_for_human_review`

No mutation is authorized by this packet.

## Recommended First Mutation-Review Lane

| Candidate | Name | Needs | Risk | Rationale |
|---|---|---|---|---|
| A75 | Totale winst berekenen uit opbrengsten- en kostentabel | A04, A61 | low | Table-based profit from TO and TK; strong target evidence. |
| A76 | Totale winst berekenen uit P, GTK en Q | A14, A04 | medium | Exam-grounded profit formula; HCS should decide whether A61 is also needed. |
| A79 | Maximale winst bepalen uit TO-TK-tabel | A75, A61 | low | Table-based comparison of profit by Q; target and exam evidence. |

## Graph-Lane Review

| Candidate | Name | Needs | Risk | Rationale |
|---|---|---|---|---|
| A77 | Break-even aflezen uit TO-TK-grafiek | A63, A29 | medium | Graph reading is now supported by A63, but PV graph-stage requirements should be explicit. |
| A78 | Winst of verlies aflezen uit TO-TK-grafiek | A63, A75 | medium | Should wait for A75; must teach vertical distance between TO and TK. |
| A80 | Winstrechthoek tekenen in producentengrafiek | A76, A45 | medium | Exam-grounded but should wait for A76 and PV producer-graph visual-state constraints. |
| A81 | Winst, verlies en break-even herkennen in producentengrafiek | A76, A80 | medium | Should wait until profit-rectangle or equivalent producer-graph modeling is approved. |

## Held Record

| Record | Name | Reason |
|---|---|---|
| HOLD_GRAPHICAL_MO_MK_OPTIMUM | Grafische MO=MK optimum bepalen | Keep held because it may overlap A20, A28, A33, and A54. |

## PV Conditions

- Graph candidates must declare title/context, axes, units, curve/line labels, exact-versus-estimated reading, and non-color fallback in later PV visual-state templates.
- Procedure steps must separate representation reading from calculation or interpretation.
- Any approved A-domain units remain generator-blocked and non-interactive until generator/projection support exists.
- No student-facing PV projection is authorized by this gate.
