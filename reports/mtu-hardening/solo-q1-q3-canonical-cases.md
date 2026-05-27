# Solo q1-q3 Canonical Micro-Case Review Package

Generated: 2026-05-27

Status: MTU-H2 review package ready, no mutation authorized.

No protected reference mutation authorized. No external-source mutation
authorized. No machine-reference mutation authorized. No unit minting
authorized. No operation-registry mutation authorized. No answer-skill mutation
authorized. No candidate-storage creation authorized. No lesson-output mutation
authorized. No student/product use authorized.

## Purpose

MTU-H2 turns the MTU-H1 benchmark into a human-reviewable set of canonical
micro-cases. It does not decide the mutation. It shows exactly which candidate
lanes need review, which existing units are support only, and which over-trigger
guardrails must bind any later CLI-governed mutation sprint.

Candidate lane IDs in this report are not live MTU IDs.

## Q1: Verbal External-Cost Explanation

Correction-model operations:

| Operation | Required move |
|---|---|
| `q1-op-1` | Give a context-specific example of social costs caused by diesel use |
| `q1-op-2` | Explain that the cost is borne by society or non-users and is not in the direct user price |

Existing-unit fit:

| Unit | Review fit | Guardrail |
|---|---|---|
| `F16` | partial, over-formal | Use as formal support only; do not require full MPC/MSC or welfare-loss machinery |

Candidate lanes:

| Lane | Proposed label | Layer | Recommended review route |
|---|---|---|---|
| `MTUH2-Q1-F-VERBAL-EXTERNAL-COST` | Maatschappelijke kosten / externe kosten verbaal herkennen | content MTU | add or refactor after gate |
| `MTUH2-Q1-F-EXTERNAL-COST-EXAMPLE` | Maatschappelijke kosten uitleggen met voorbeeld | content + reasoning MTU | add, or merge with the verbal-recognition candidate after gate |
| `MTUH2-Q1-A-LEG-UIT-WITH-EXAMPLE` | Leg-uit-vraag met voorbeeld beantwoorden | answer-form MTU | route to MTU-H4 unless the gate authorizes a bounded q1 answer-form lane |

Review issue: decide whether q1 needs one combined external-cost unit or two
separate units: recognition plus explanation with example.

## Q2: Unknown Fixed Costs From Profit

Correction-model operations:

| Operation | Required move |
|---|---|
| `q2-op-1` | Solve the price/output relation for `Q` |
| `q2-op-2` | Calculate `TO = P x Q` at one point |
| `q2-op-3` | Calculate `TVK = v x Q` |
| `q2-op-4` | Solve `W = TO - (TVK + TCK)` for unknown `TCK` |

Existing-unit fit:

| Unit | Review fit | Guardrail |
|---|---|---|
| `A21` | too broad | Formula support only; not full reverse fixed-cost operation coverage |
| `D02` | wrong route for this operation | Do not route through break-even or MO=MK constant-cost reasoning |

Candidate lanes:

| Lane | Proposed label | Layer | Recommended review route |
|---|---|---|---|
| `MTUH2-Q2-A-TO-POINT-CALCULATION` | Totale opbrengst puntberekening: TO = P x Q | calculation operation MTU | add after gate |
| `MTUH2-Q2-A-TVK-CONSTANT-VARIABLE-COST` | TVK berekenen uit constante variabele kosten | calculation operation MTU | add after gate |
| `MTUH2-Q2-A-UNKNOWN-FIXED-COST-FROM-PROFIT` | Onbekende vaste kosten berekenen uit winstvergelijking | calculation operation MTU | add after gate |
| `MTUH2-Q2-A-SCALE-FACTOR-UNIT-HANDLING` | Schaalfactoren in examencijfers toepassen | calculation reliability MTU | add or attach after gate |
| `MTUH2-Q2-A-BEREKEN-ANSWER-FORM` | Bereken-vraag beantwoorden | answer-form MTU | route to MTU-H4 unless the gate authorizes a bounded q2 answer-form lane |

Review issue: decide whether the three calculation operations should be added
as separate MTUs, or whether one combined reverse-profit route should own the
chain with pointwise TO and TVK as dependencies.

## Q3: GO to MO, Given MK, New Price, Price Rise

Correction-model operations:

| Operation | Required move |
|---|---|
| `q3-op-1` | Recognise GO as the monopolist price/demand relation and determine MO |
| `q3-op-2` | Solve `MO = given MKbio` |
| `q3-op-3` | Substitute Q into GO to determine the new price |
| `q3-op-4` | Calculate the percentage price rise with the old price denominator |

Existing-unit fit:

| Unit | Review fit | Guardrail |
|---|---|---|
| `A20` | too broad | Split or refactor; do not hide given-MK versus derived-MK and non-calculus versus derivative routes |
| `A38` | partial | Generic percentage support only; not incidence/pass-through coverage |
| `D07` | related but too narrow | Route broader incidence/pass-through family to MTU-H3 |

Candidate lanes:

| Lane | Proposed label | Layer | Recommended review route |
|---|---|---|---|
| `MTUH2-Q3-A-GO-AS-MONOPOLY-PRICE-RELATION` | GO herkennen als prijsfunctie van de monopolist | calculation operation MTU | add or attach after gate |
| `MTUH2-Q3-A-MO-WITHOUT-DERIVATIVES` | MO bepalen zonder afgeleiden | calculation operation MTU | add after gate |
| `MTUH2-Q3-A-MO-WITH-DERIVATIVE` | MO bepalen met afgeleide | calculation operation MTU | add or split route after gate |
| `MTUH2-Q3-A-MO-EQUALS-GIVEN-MK` | MO = gegeven MK oplossen | calculation operation MTU | add after gate |
| `MTUH2-Q3-A-MO-EQUALS-DERIVED-MK` | MO = afgeleide MK oplossen | calculation operation MTU | split or hold after gate |
| `MTUH2-Q3-A-NEW-MONOPOLY-PRICE-AFTER-Q` | Nieuwe prijs bepalen na winstmaximaliserende Q | calculation operation MTU | add after gate |
| `MTUH2-Q3-A-PERCENTAGE-PRICE-CHANGE-AFTER-COST-CHANGE` | Procentuele prijsverandering na kostenverandering | calculation operation MTU | add or route to MTU-H3 after gate |
| `MTUH2-Q3-D07-PASS-THROUGH-DEPENDENCY` | Kostenstijging doorberekenen in prijs en incidence-misvatting | incidence dependency | route to MTU-H3 |

Review issue: decide whether q3's A20 problem should be handled as a split of
A20, as new dependent A-units, or as a lighter update to A20 plus new route
guardrails.

## Cross-Case Guardrails

- Existing broad units may be support only when the correction model requires a
  narrower operation.
- Answer-form needs remain visible and must not be hidden inside content units.
- MTU-H2 candidate lanes are review candidates only, not live registry IDs.
- Any later mutation must be CLI-governed and explicitly authorized after
  GATE-MTU-H2.

## Held For Later Sprints

| Dependency | Route |
|---|---|
| General incidence/pass-through family | MTU-H3 |
| General answer-form policy and `question_type` mapping | MTU-H4 |
| Regression validator for fresh samples | MTU-H5 |
| Student route integration | MTU-H6 |
