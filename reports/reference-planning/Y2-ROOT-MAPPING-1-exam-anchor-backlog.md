# Y2-ROOT-MAPPING-1 Exam-Anchor Backlog

Status: Year 2 official-exam anchor backlog

## Boundary

This backlog identifies which official exam evidence should be ingested or
reviewed next for Year 2. It does not ingest sources, mutate external records,
write operation candidates, create target-registry rows, mint MTUs, generate
lessons, or authorize downstream product or Scale use.

## Product End-State And Original Specs

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`

Original sprint/gate/source specs:

- `references/owned/course-blueprint-v6-three-year.md`
- `reports/reference-planning/BLUEPRINT-3Y-RECONCILE-1-book-level-matrix.md`
- `reports/reference-planning/EXAM-OPERATION-SPINE-ANCHOR-1-anchor-matrix.md`
- `reports/reference-planning/EXAM-ANCHOR-ATOMIC-CLOSURE-BUNDLE-1-atomic-status.md`
- `reports/json/exam-question-extraction-gaps.json`
- `reports/sprints/Y2-ROOT-MAPPING-1-plan.md`

## Backlog By Book

| Book | Families lacking official anchors | Partial support | Next CvTE questions to inspect | Evidence required before closure |
|---|---|---|---|---|
| Book 5 | `OP-T1` time/stock-flow/generation reasoning, pension source cases, long-horizon sustainability explanations | none closed | `vw-1022-a-25-1-o:q7` to `q11` ("Concurreren met zekerheid"); `vw-1022-a-25-2-o:q7` to `q11` ("Pensioenmodel") | prompt text, source tables/figures, correction model, point allocation, source locators, explicit stock/flow or coverage-ratio operation fit, target-exercise comparison |
| Book 6 | `OP-F1` interest/finance mechanisms, bond-price/yield direction, housing finance, financial source cases | none closed | `vw-1022-a-23-2-o:q26` to `q29` ("De woningmarkt in de knel"); `vw-1022-a-24-1-o:q7`, `q11`, `q12` ("Staat van de schulden"); possible finance/housing follow-up from `vw-1022-a-24-2-o:q13` to `q14` | official prompt/source/correction model, calculation steps, answer form, finance mechanism operation fit, Book 10 monetary-policy boundary check |
| Book 7 | `OP-R1` expected value/loss, insurance contracts, moral hazard, adverse selection, principal-agent, risk source cases | Q3 gives partial planning support only | approved Q3 `vw-1022-a-25-1-o:q3`; `vw-1022-a-24-2-o:q25` ("Cyberrisicoverzekering"); `vw-1022-a-23-1-o:q12` to `q15` ("Bij wanbetaling afrekenen"); `vw-1022-a-24-1-o:q13` to `q15` ("Valutaverzekering") | prompt/source/correction model, source table provenance, calculation decomposition, answer-form evidence, Q3 compound parent/child route decision, target-exercise anchor |
| Book 8 | `OP-S1` strategic interaction and `OP-H1` public finance/growth bridge; answer construction for two-link strategic explanations | Q15 gives partial planning support only | approved Q15 `vw-1022-a-25-1-o:q15`; `vw-1022-a-25-1-o:q16`; `vw-1022-a-25-1-o:q22` to `q23` ("Groen ontgroeien"); `vw-1022-a-24-1-o:q26` to `q27` ("Groeien tot de top"); `vw-1022-a-23-1-o:q17`; `vw-1022-a-24-1-o:q10` to `q12` ("Staat van de schulden") | payoff/policy prompt text, source figures, correction model, point allocation, answer-construction evidence, Book 9 boundary proof, target-exercise comparison |

## Q3 Backlog Detail

Current usable support:

- `Q3-ATOM-ANNUAL-PREMIUM-DEDUCTIBLE-COST-COMPARISON`
- `Q3-ATOM-BREAK_EVEN-THRESHOLD-CALCULATION`
- `Q3-ANS-THRESHOLD-CONCLUSION-UNIT-DIRECTION`

Backlog status:

- Q3 informs Book 7 insurance/cost-threshold architecture.
- Q3 does not close broad `OP-R1`, `OP-ANS2`, or `OP-ANS1`.
- `Y2-Q3-COMPOUND-INSURANCE-THRESHOLD` is the mapping-level grouping until a
  later governed schema decides whether child operation records are stored.
- A15 remains rejected or weak for the Q3 threshold calculation; A61 remains
  source-table support.

Proof required before closure:

- official prompt/source/correction-model packet for Q3;
- target-exercise anchor or explicit gap disposition;
- approved parent/child or compound storage schema;
- governed repair of stale A15 reliance where applicable.

## Q15 Backlog Detail

Current usable support:

- `Q15-ATOM-DOMINANT-STRATEGY-REASONING`
- `Q15-ATOM-MUTUALLY-WORSE-PRISONERS-DILEMMA-CONCLUSION`
- `Q15-ANS-TWO-LINK-CORRECTION-MODEL-EXPLANATION`

Backlog status:

- Q15 informs Book 8 game-theory and answer-construction architecture.
- Q15 does not close broad `OP-S1`, `OP-ANS3`, or `OP-ANS1`.
- D27/F03/F09 remain planning evidence for the two-link explanation route.

Proof required before closure:

- official prompt/source/correction-model packet for Q15 and Q16 follow-up;
- target-exercise anchor or explicit gap disposition;
- answer-skill route approval for two-link correction-model explanations;
- governed metadata decision for required-skill recommendations.

## Q19 Hold Boundary

Q19 remains HOLD. It blocks its own source/graph reconstruction route and the
affected later broad rows, including graph/PV and monetary-policy routes. It
does not block this Year 2 curriculum map because Books 5-8 can remain at
planning-candidate status without executing Q19 source-annex extraction or
using Q19 as production evidence.

Carried issue:

- blocks: Q19 closure, graph/PV adoption, MTU-H5 closure, monetary-policy
  closure, and any lesson handoff that depends on Q19 source/graph evidence.
- does_not_block: Year 2 root mapping as report-only architecture.
- proof_required_to_close: reconstructable source figure, worksheet, axes,
  units, curve geometry, source locators, and human-reviewed gate authority.
