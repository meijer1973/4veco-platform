# Y2-EXAM-ANCHOR-INGESTION-WAVE-1 Evidence Packet

Status: official exam evidence wave for human review

## Boundary

This packet records official exam evidence for Year 2 mapping only. It does not
create Year 2 target-registry records, mint MTUs, mutate external or machine
sources, create operation/answer-skill candidate storage, generate lessons,
close official operation rows, authorize product routes, close CP-6 or Scale
Gate, or authorize diagnostics, mastery, PV, summative use, or student/product
use.

## Product End-State And Original Specs

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`

Original sprint/gate/source specs:

- `references/owned/course-blueprint-v6-three-year.md`
- `reports/reference-planning/Y2-ROOT-MAPPING-1-review-packet.md`
- `reports/reference-planning/Y2-ROOT-MAPPING-1-paragraph-candidate-matrix.md`
- `reports/reference-planning/Y2-ROOT-MAPPING-1-exam-anchor-backlog.md`
- `references/data/exam-ingestion/README.md`
- `references/data/exam-ingestion/review-procedure.md`

Structured overlay:

- `references/data/exam-ingestion/y2-exam-anchor-ingestion-wave-1.json`

Q3 remains complementary planning evidence only. Q19 remains HOLD.

## Wave Summary

| Book | Case | Questions | Official prompt/source trace | Correction-model trace | Decision |
|---|---|---|---|---|---|
| 5 | `Pensioenmodel` | `vw-1022-a-25-2-o:q7-q11` | prompt and figure/assumption locators on `vw-1022-a-25-2-o.pdf#page=4-5` | `vw-1022-a-25-2-c.pdf#page=8-9` | reviewed official anchor family for mapping only |
| 6 | `De woningmarkt in de knel` | `vw-1022-a-23-2-o:q26-q29` | prompt and table locators on `vw-1022-a-23-2-o.pdf#page=12-13` | `vw-1022-a-23-2-c.pdf#page=13-14` | reviewed official anchor family for mapping only |
| 7 | `Bij wanbetaling afrekenen` | `vw-1022-a-23-1-o:q12-q15` | prompt, figure/condition, and table locators on `vw-1022-a-23-1-o.pdf#page=6-7` | `vw-1022-a-23-1-c.pdf#page=9-10` | reviewed official anchor family for mapping only |
| 8 strategic | `IJssalon` | `vw-1022-a-25-1-o:q15-q16` | prompt/context locators on `vw-1022-a-25-1-o.pdf#page=7` | `vw-1022-a-25-1-c.pdf#page=11-12` | reviewed official anchor family for mapping only |
| 8 growth/public finance | `Groen ontgroeien` | `vw-1022-a-25-1-o:q22-q23` | prompt and figure locators on `vw-1022-a-25-1-o.pdf#page=10-11` | `vw-1022-a-25-1-c.pdf#page=15-16` | reviewed with boundary split required |

## Book 5: Pensioenmodel

Official prompt trace:

- q7 asks for pensions as exchange over time.
- q8 asks whether total pension outlays rise or fall when benefits are
  welfare-indexed, using model assumptions.
- q9 asks whether net accumulated pension saving is a stock or flow and why.
- q10 asks why premiums as percentage of total pension wealth fall.
- q11 asks why a higher pension age can raise current premium payers'
  purchasing power.

Source trace:

- `figuur-1-pensioenmodel-2024-2044`:
  `references/external/exams/vw-1022-a-25-2-o.pdf#page=4`.
- assumptions a-f:
  `references/external/exams/vw-1022-a-25-2-o.pdf#page=4`.

Correction-model and point allocation trace:

- q7: premium paid now delays consumption; later pension payouts can increase
  consumption.
- q8: nominal income rises through real growth plus inflation; welfare-indexed
  pensions rise with incomes.
- q9: stock classification because the amount is measured at a moment.
- q10: pension wealth rises faster than GDP; premiums stay constant as GDP
  share and fall as pension-wealth share.
- q11: more premium payers or fewer beneficiaries improves the fund balance;
  lower premiums can raise net income and purchasing power.

Mapping:

- OP rows: `OP-T1`, `OP-H1`, `OP-F1`, `OP-ANS3`.
- Year 2 candidates: `Y2-B5-P01`, `Y2-B5-P02`, `Y2-B5-P08`,
  `Y2-B5-P09`, `Y2-B5-P10`, `Y2-B5-P11`, `Y2-B5-P13`, `Y2-B5-P14`.
- MTU/task-family status: mirrored `E02` and `E06` skill IDs only; no MTU or
  task-family closure.

Blocker:

- blocks: target-registry rows, production paragraphs, target-equivalent proof.
- does_not_block: Year 2 evidence-wave review and Book 5 mapping refinement.
- proof_required_to_close: reviewed target-exercise anchor and governed
  MTU/task-family review for pension source reasoning.

## Book 6: De Woningmarkt In De Knel

Official prompt trace:

- q26 calculates the social-housing waiting-list count.
- q27 tests whether abolishing the maximum rent removes the waiting list under
  revenue maximization.
- q28 explains low mortgage-rate and housing-shortage risk logic.
- q29 explains rent increases using private-rental table data and income
  elasticity.

Source trace:

- `tabel-1-vastwonen-financial-data`:
  `references/external/exams/vw-1022-a-23-2-o.pdf#page=12`.
- `tabel-2-particuliere-huurwoningen-reder`:
  `references/external/exams/vw-1022-a-23-2-o.pdf#page=13`.

Correction-model and point allocation trace:

- q26: solve current demand at maximum rent and subtract housing stock.
- q27: derive marginal revenue from average revenue and compare
  revenue-maximizing quantity with capacity.
- q28: low mortgage rate lowers interest costs; shortage supports stable rent
  income and low debt-loss risk.
- q29: positive income elasticity with income growth increases demand; fewer
  available rentals reduces supply.

Mapping:

- OP rows: `OP-F1`, `OP-P1`, `OP-D1`, `OP-D2`, `OP-ANS2`, `OP-ANS3`.
- Year 2 candidates: `Y2-B6-P08`, `Y2-B6-P09`, `Y2-B6-P11`,
  `Y2-B6-P12`, `Y2-B6-P14`.
- MTU/task-family status: mirrored `A14`, `A06`, `A25`, and `D11` skill IDs
  only; no Year 2 MTU or task-family closure.

Blocker:

- blocks: Book 6 production route, target-registry rows, broad `OP-F1`
  closure.
- does_not_block: Book 6 mapping refinement and official-anchor-family
  coverage.
- proof_required_to_close: governed target-exercise comparison plus
  task-family/MTU review for housing finance and market-table explanation.

## Book 7: Bij Wanbetaling Afrekenen

Official prompt trace:

- q12 asks for a principal-agent problem and the insurance condition that can
  reduce it.
- q13 asks which two insurance conditions reduce supplier moral hazard.
- q14 asks which condition reduces adverse selection.
- q15 calculates the total credit-insurance premium.

Source trace:

- `figuur-1-kredietverzekering-en-voorwaarden`:
  `references/external/exams/vw-1022-a-23-1-o.pdf#page=6`. This page
  records the credit-insurance figure and four conditions used by q12-q14:
  90 percent indemnity of missed turnover, collection handoff after the
  payment term, collection costs passed to the buyer, and a supplier
  bonus-malus system.
- `tabel-1-financiele-gegevens-digibate`:
  `references/external/exams/vw-1022-a-23-1-o.pdf#page=7`.

Correction-model and point allocation trace:

- q12: conflicting interests, asymmetric information, and incasso-cost
  pass-through condition.
- q13: deductible plus bonus-malus condition and financial incentive to claim
  less.
- q14: bonus-malus or voluntary deductible attracts good risks, or compulsory
  insurance removes adverse selection.
- q15: expected damage from contracts, turnover, and default probabilities,
  plus 20 percent premium markup.

Mapping:

- OP rows: `OP-R1`, `OP-M1`, `OP-F1`, `OP-ANS2`, `OP-ANS3`.
- Year 2 candidates: `Y2-B7-P02`, `Y2-B7-P09`, `Y2-B7-P10`,
  `Y2-B7-P11`, `Y2-B7-P12`, `Y2-B7-P13`, `Y2-B7-P14`.
- MTU/task-family status: mirrored `G02`, `F09`, `G04`, and `A04` skill IDs
  only; Q3 remains complementary insurance-threshold evidence only.

Blocker:

- blocks: broad `OP-R1` closure, target-registry rows, production paragraphs.
- does_not_block: Book 7 mapping refinement and Q3 complementary planning use.
- proof_required_to_close: target-exercise anchor plus governed
  operation/answer-skill review for moral hazard, adverse selection, and
  expected-premium calculations.

## Book 8 Strategic: IJssalon

Official prompt trace:

- q15 asks why perfect-substitute ice creams can create a prisoner's dilemma.
- q16 asks why a fixed price plus lowest-price guarantee limits price-war risk.

Source trace:

- context on perfect substitutes and price guarantee:
  `references/external/exams/vw-1022-a-25-1-o.pdf#page=7`.

Correction-model and point allocation trace:

- q15: both firms have a dominant strategy to lower price; lower joint outcome
  creates a prisoner's dilemma.
- q16: Guarda is committed to follow Orso Bianco's price; Orso Bianco expects
  lower revenue from a price cut and has less incentive to start a price war.

Mapping:

- OP rows: `OP-S1`, `OP-ANS1`, `OP-ANS3`.
- Year 2 candidates: `Y2-B8-P02`, `Y2-B8-P03`, `Y2-B8-P04`,
  `Y2-B8-P16`.
- MTU/task-family status: Q15 has partial D27/F03/F09 support; Q16 extends the
  self-binding family but does not close the answer-skill route.

Blocker:

- blocks: broad `OP-S1` closure, broad `OP-ANS3` closure, target-registry rows.
- does_not_block: Book 8 strategic placement and planning use of Q15/Q16.
- proof_required_to_close: governed two-link answer-skill approval and
  target-exercise comparison.

## Book 8 Growth/Public Finance: Groen Ontgroeien

Official prompt trace:

- q22 asks why higher government spending can raise or lower green GDP.
- q23 asks whether monetary policy has become more or less effective after a
  changed IS-curve slope.

Source trace:

- `figuur-1-keynesiaans-kruis`:
  `references/external/exams/vw-1022-a-25-1-o.pdf#page=10`.
- `figuur-2-is-mb-model`:
  `references/external/exams/vw-1022-a-25-1-o.pdf#page=11`.

Correction-model and point allocation trace:

- q22: higher government spending raises GDP and can raise green GDP if the
  environmental value balance is non-negative or only mildly negative; green
  GDP can fall if environmental damage exceeds the GDP increase.
- q23: a lower interest rate has weaker consumption/saving response with the
  steeper IS curve; output gap and inflation adjustment improve less, so
  monetary policy is less effective.

Mapping:

- OP rows: `OP-H1`, `OP-M1`, `OP-MP1`, `OP-ANS3`.
- Year 2 candidates: `Y2-B8-P13`, `Y2-B8-P14`, `Y2-B8-P15`,
  `Y2-B8-P16`.
- MTU/task-family status: no mirrored required skill IDs; green GDP/public
  finance and monetary-policy boundary task-family route requires governed
  review.

Boundary decision:

- q22 supports the Book 8 green-GDP and sustainability-measurement anchor.
- q23 is useful evidence that the green-growth case crosses into monetary
  policy and should be routed to Book 9/10 macro evidence review, not Book 8
  production authority.

Blocker:

- blocks: Book 8 macro-policy production, `OP-MP1` closure, monetary-policy
  route.
- does_not_block: Book 8 green-GDP planning anchor and Book 9/10 backlog
  routing.
- proof_required_to_close: split q22 as Book 8 support and route q23
  monetary-policy effectiveness to later macro evidence review.

## Decision

Decision status: Y2 official exam evidence wave ready for human review.

Every Year 2 book now has at least one reviewed official anchor family, and
Book 8 has two. These anchors improve mapping confidence, but they do not
authorize production status, target records, MTUs, operation closure, lessons,
product routes, Scale Gate use, diagnostics, mastery, PV, summative use, or
student/product use.
