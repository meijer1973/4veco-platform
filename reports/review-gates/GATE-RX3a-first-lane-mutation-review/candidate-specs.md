# RX.3a First-Lane Candidate Specs

Status: `prepared_for_mutation_review`

No CLI mutation is authorized by these specs.

## A75 Totale winst berekenen uit opbrengsten- en kostentabel

- Needs: `A04`, `A61`
- Aspects: `rekenen`, `verbaal`
- Generator: `GEN_A75` missing; generator-blocked
- Risk: low

Core procedure: select TO and TK from the same table row/situation, compute `TO - TK`, and interpret positive, zero, or negative result.

## A76 Totale winst berekenen uit P, GTK en Q

- Needs: `A14`, `A04`, `A61`
- Aspects: `rekenen`, `verbaal`
- Generator: `GEN_A76` missing; generator-blocked
- Risk: medium

HCS dependency decision: `A61` is required because `P`, `GTK`, and `Q` are often selected from producer data before applying the profit formula.

Core procedure: select `P`, `GTK`, and `Q`, calculate `P - GTK`, multiply by `Q`, and check whether `P` is above, equal to, or below `GTK`.

## A79 Maximale winst bepalen uit TO-TK-tabel

- Needs: `A75`, `A61`
- Aspects: `rekenen`, `verbaal`
- Generator: `GEN_A79` missing; generator-blocked
- Risk: low

Core procedure: calculate or inspect profit per `Q`, compare profit rows, and choose the highest profit rather than highest revenue.

## Deferred

- `A77`
- `A78`
- `A80`
- `A81`
- `HOLD_GRAPHICAL_MO_MK_OPTIMUM`
