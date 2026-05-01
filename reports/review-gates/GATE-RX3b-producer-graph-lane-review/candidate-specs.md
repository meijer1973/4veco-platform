# RX.3b Candidate Specs

Status: `prepared_for_mutation_review`

No mutation is authorized by this file.

## Scope

- `A77` Break-even aflezen uit TO-TK-grafiek
- `A78` Winst of verlies aflezen uit TO-TK-grafiek

## A77 Break-even Aflezen Uit TO-TK-Grafiek

Draft needs: `A63`, `A29`

Draft generator: `GEN_A77`

Kern: Lees in een TO-TK-grafiek het snijpunt van totale opbrengsten en totale kosten af en interpreteer dit als break-evenhoeveelheid.

Procedure focus:

- Check title/context, axes, units, and scale.
- Identify TO and TK by label or legend.
- Read the intersection point or points.
- Project to the horizontal axis to read Q.
- Interpret the point as zero profit.

Dependency note: the draft preserves the RX.1 need on `A29` because that is the current live break-even precursor.

## A78 Winst Of Verlies Aflezen Uit TO-TK-Grafiek

Draft needs: `A63`, `A75`

Draft generator: `GEN_A78`

Kern: Lees bij een hoeveelheid Q de TO- en TK-waarden in een TO-TK-grafiek af, gebruik de verticale afstand en bepaal of er winst of verlies is.

Procedure focus:

- Check title/context, axes, units, and scale.
- Identify TO and TK by label or legend.
- Read TO and TK at the same Q.
- Use the vertical distance, not horizontal distance.
- Interpret TO above TK as profit, TO below TK as loss, and TO equal to TK as break-even.

Dependency question for HCS: should `A78` add `A77` as a prerequisite after `A77` is minted, or keep the RX.1 dependency set `A63`/`A75` because this unit focuses on profit/loss at a given Q rather than break-even-point reading?

## Blocked Scope

- `A80`
- `A81`
- `HOLD_GRAPHICAL_MO_MK_OPTIMUM`
- held duplicate/overlap records
- student diagnostics, adaptive routing, student-facing AI, sequencing, mastery, summative use, or student-facing PV projection
