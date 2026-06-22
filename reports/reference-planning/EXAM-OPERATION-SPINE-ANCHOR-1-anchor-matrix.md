# EXAM-OPERATION-SPINE-ANCHOR-1 Anchor Matrix

Status: reviewed anchor-status matrix for human review

## Boundary

This matrix classifies the v6 exam-operation spine. It does not close official
exam demand, create Year 2/3 targets, mint MTUs, mutate protected references,
or authorize product/student use.

No row reaches strict `anchored_ready_for_mapping` because no operation row has
a complete operation-specific official prompt, source-annex, correction-model,
reviewed target-exercise anchor, MTU mapping, and task-family proof chain.

Rows listed as target-side safe are safe only as planning input for later
mapping. They are not production-ready.

## Classification Legend

- `needs_exam_anchor`: target/MTU evidence may exist, but official prompt,
  source-annex, or correction-model evidence is missing or only pilot/partial.
- `needs_target_exercise_anchor`: official or MTU evidence may exist, but the
  authored target anchor is missing, partial, migrated, or placeholder.
- `needs_decomposition`: the v6 row is explicitly `decomposition_needed` or is
  too broad to rely on as one production operation.
- `defer_to_later_book_review`: the row belongs to Books 5-11 and has no
  reviewed paragraph-level target yet.
- `blocked_by_missing_MTU_or_task_family`: MTU or exact answer/task-family
  support is missing, held, stale, or too broad for production reliance.

## Full Matrix

| Operation | Official exam prompt/source/model | Target-exercise anchor | MTU / task-family status | Primary classification | Production readiness |
|---|---|---|---|---|---|
| OP-A1 Basic percentage change | missing / missing / missing | present: `1.1.2` reviewed final | live MTUs `A38`, `A67-A70`; calculation/numeric support | needs_exam_anchor | not production-ready; target-side safe only |
| OP-A2 Index and CPI arithmetic | missing / missing / missing | present: `1.1.2` reviewed final | live MTUs `A39`, `A72-A74`, `D31`; formula proof exists | needs_exam_anchor | not production-ready; target-side safe only |
| OP-A3 Real/nominal and deflator operations | missing / missing / missing | missing; v6 `TBD` | partial `I18`; no explicit deflator operation MTU | needs_decomposition | blocked |
| OP-G1 P-Q graph reading and interpolation | missing / missing / missing | present: `1.1.3` reviewed final | live `A46`, `A61`; table/numeric support | needs_exam_anchor | not production-ready; target-side safe only |
| OP-G2 Table-to-graph construction with economist axes | missing / missing / missing | present: `1.1.3` reviewed final | live/partial `A45`, `A49`; label support; graph substitute only | needs_exam_anchor | not production-ready; target-side safe only |
| OP-G3 Shift versus movement and before-after graph state | partial / partial / partial via Q19 | present: `1.2.2`, `1.3.3` reviewed final | live but registry-held `A42`, `D32`; label/sentence support | needs_exam_anchor | blocked by Q19 source/graph gaps |
| OP-D1 Demand/supply equilibrium solving | missing / missing / missing | present: `1.3.2` reviewed final | live `A06` plus `A01`, `A02`, `A04`; calculation support | needs_exam_anchor | not production-ready; target-side safe only |
| OP-D2 Individual-to-collective aggregation | missing / missing / missing | present: `1.2.3` reviewed final | broad live support `A09`, `A24`, `A31`, `A47`, `A48`, `A61` | needs_exam_anchor | not production-ready; target-side safe only |
| OP-C1 Cost, revenue, and profit calculation | missing / missing / missing | present: `2.1.1`, `2.1.2` reviewed final | live/stale `A21`, `A75`, `A76`; calculation/formula support | needs_exam_anchor | not production-ready; target-side safe only |
| OP-C2 Marginal reasoning and output choice | missing / missing / missing | present: `2.1.3` reviewed final | live `A12`, `A13`, `A20`, `A52`, `A54`; step-ordering support | needs_exam_anchor | not production-ready; target-side safe only |
| OP-E1 Elasticity calculation and interpretation | missing / missing / missing | partial: `2.2.1` exists but needs v5 review | live/stale `A15-A17`, `A55`, `A82-A84`; two-tier proof exists | needs_target_exercise_anchor | blocked |
| OP-W1 Surplus and deadweight-loss area selection | missing / missing / missing | partial: `2.3.1`, `2.3.3` migrated/not final | live/held `A19`, `A32`, `A40`, `D28-D40` | needs_target_exercise_anchor | blocked |
| OP-P1 Tax/subsidy/price-control mechanics | missing / missing / missing | partial: `3.1.1-3.1.5` migrated/not final | live `A23`, `A25-A27`, `A34`, `A41`, `A56-A59`, `D41-D45` | needs_target_exercise_anchor | blocked |
| OP-M1 Market-structure and market-failure evaluation | missing / missing / missing | partial: `3.2`, `3.3`, `4.1` migrated/placeholder | live `D14`, `D15`, `F16-F18`; constructed-response proof absent | blocked_by_missing_MTU_or_task_family | blocked |
| OP-LT1 Labour and trade market application | partial / partial / partial via Q19 | partial: `4.2`, `4.3` migrated/placeholder | broad `L01-L21`, `A18`, `A34`, `H03`, `G11`; no explicit OP mapping | needs_target_exercise_anchor | blocked by target review and Q19 source/graph gaps |
| OP-T1 Time, stock-flow, pension sustainability | missing / missing / missing | missing: Book 5 `TBD` | broad `E01-E06`, `H01`, `H07`, `H12`; no explicit OP mapping | defer_to_later_book_review | blocked |
| OP-F1 Interest, bond, housing, and finance mechanics | missing / missing / missing | missing: Book 6 `TBD` | broad `H15`, `H26`, `H29-H31`, `E07`; no explicit OP mapping | defer_to_later_book_review | blocked |
| OP-R1 Risk, insurance, and asymmetric information | partial / partial / partial via Q3 | missing: Book 7 `TBD` | broad `G01-G12`; assertion proof exists; constructed-response proof absent | defer_to_later_book_review | blocked |
| OP-S1 Game-theory and collective-action reasoning | partial / partial / partial via Q15 | missing: Book 8 `TBD` | live `F02-F04`, `F09`, `F12`; matching/ordering support; constructed-response proof absent | defer_to_later_book_review | blocked |
| OP-H1 Growth, redistribution, public-finance trade-offs | missing / missing / missing | missing: Book 8 `TBD` | broad `H04`, `H05`, `H08`, `H11`, `H12`, `H18`, `H21`; constructed-response proof absent | blocked_by_missing_MTU_or_task_family | blocked |
| OP-K1 Keynesian macro and fiscal policy | missing / missing / missing | missing: Book 9 `TBD` | broad `I01`, `I02`, `I07`, `I08`, `I14-I16`; task families exist | defer_to_later_book_review | blocked |
| OP-MP1 Monetary transmission and open-economy channels | partial / partial / partial via Q19 | missing: Book 10 `TBD` | broad `I05`, `I11-I13`, `I17`, `I19`, `I20`, `H24`, `H25` | defer_to_later_book_review | blocked |
| OP-ANS1 Command-word handling and point allocation | partial / missing / partial via Q3/Q15/Q19 metadata | missing: no dedicated answer target | partial `A80`; no explicit point-allocation MTU | needs_decomposition | blocked |
| OP-ANS2 Calculation-answer formatting | partial / partial / partial via Q3 | partial: calculation answer forms appear in reviewed targets; no dedicated OP target | live `A96`; calculation-answer proof exists but route-specific | needs_decomposition | blocked from production; useful design input |
| OP-ANS3 Source-supported explanation and evaluation answer | partial / partial / partial via Q15/Q19 | partial: source/explanation forms appear across targets; no dedicated OP target | partial `A81`, `A97-A99`; constructed-response proof absent | needs_decomposition | blocked |

## Target-Side Safe Rows

The following rows have reviewed target-side anchors and usable MTU/task-family
support, but still need official exam anchors before production reliance:

- `OP-A1`
- `OP-A2`
- `OP-G1`
- `OP-G2`
- `OP-G3`
- `OP-D1`
- `OP-D2`
- `OP-C1`
- `OP-C2`

## Blocked Rows By Reason

Need target-exercise review:

- `OP-E1`
- `OP-W1`
- `OP-P1`
- `OP-M1`
- `OP-LT1`
- `OP-ANS2`
- `OP-ANS3`

Missing target-exercise anchors:

- `OP-A3`
- `OP-T1`
- `OP-F1`
- `OP-R1`
- `OP-S1`
- `OP-H1`
- `OP-K1`
- `OP-MP1`
- `OP-ANS1`

Hard missing/decomposition or task-family blockers:

- `OP-A3`
- `OP-M1`
- `OP-R1`
- `OP-S1`
- `OP-H1`
- `OP-ANS1`
- `OP-ANS3`

Official exam anchor blockers:

- all rows. `Q3`, `Q15`, and `Q19` are useful pilot evidence, but no row has
  strict operation-specific official closure.
