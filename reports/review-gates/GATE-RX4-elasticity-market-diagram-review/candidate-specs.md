# RX.4 Candidate Specs

Sprint: `RX.4`
Gate: `GATE-RX4-elasticity-market-diagram-review`

Status: `prepared_for_mutation_review`

No mutation is authorized by these specs.

## Policy

- Lower-risk first lane: `A82`, `A84`
- Conditional graph lane: `A83`
- Candidate IDs remain provisional until live numbering is checked immediately before CLI mutation.
- All approved units remain generator-blocked and non-interactive until generator/projection support exists and validates.
- Market/welfare duplicate areas remain held in this gate.

## A82

Name: `Elasticiteit berekenen uit tabelwaarden`

Draft needs: `A15`, `A61`, `A66`

Aspects: `rekenen`, `verbaal`

Draft kern:

> Bereken elasticiteit nadat je twee waardenparen uit een tabel hebt geselecteerd en de procentuele verandering van oorzaak en gevolg correct hebt gekoppeld.

Procedure focus:

- select the correct old/new table values for both variables;
- label basis and comparison values;
- calculate percentage changes, not absolute changes;
- divide response change by driver change;
- preserve sign and absolute-value interpretation.

## A84

Name: `Omzetverandering beoordelen met elasticiteit uit bron`

Draft needs: `A15`, `A67`

Aspects: `rekenen`, `verbaal`

Draft kern:

> Beoordeel met elasticiteit en brongegevens of totale omzet stijgt, daalt of gelijk blijft na een prijs- of hoeveelheidsverandering.

Decision point:

Should `A84` keep the RX.1 needs `A15`/`A67`, or should HCS require an explicit conceptual prerequisite for elasticity-and-omzet before mutation?

## A83

Name: `Elasticiteit berekenen uit vraaggrafiek`

Draft needs: `A15`, `A46`, `A66`

Aspects: `grafisch`, `rekenen`

Draft kern:

> Lees twee prijs-hoeveelheidsparen uit een vraaggrafiek af en bereken de prijselasticiteit met correcte procentuele veranderingen.

Decision point:

RX.1 evidence says graph extraction is the bottleneck, but the cited external example is supply-side. HCS should approve the demand-graph name, generalize to P-Q graph elasticity, or hold `A83` until demand-graph-specific evidence is stronger.

## Held Market/Welfare Areas

This gate does not mint new surplus, welfare, short-side, intervention-quantity, or graphical MO=MK units.

Existing units to respect:

- `A19`
- `A32`
- `A40`
- `D39`
- `D40`
- `A51`
- `A56`
- `A59`
