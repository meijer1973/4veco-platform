# Y2 Evidence-Backed Target Foundation Wave 1 - Book 6 Housing Target Package

Status: Year 2/v6 target-family candidate proposal, not a registry mutation

## Product End-State And Original Specs

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`

Original sprint/gate/source specs:

- `references/owned/course-blueprint-v6-three-year.md`
- `reports/reference-planning/Y2-ROOT-MAPPING-1-paragraph-candidate-matrix.md`
- `reports/reference-planning/Y2-EXAM-ANCHOR-INGESTION-WAVE-1-evidence-packet.md`
- `references/data/exam-ingestion/y2-exam-anchor-ingestion-wave-1.json`

Supersession guard: `references/data/exam-ingestion/y2-exam-anchor-ingestion-wave-1.json`
is used here only as original official-family provenance. Its older OP-row
route is superseded for this packet by the `operation_mapping` and
`op_rows` fields in the JSON record below and by the governed mutation plan.
Later mutation must use the repaired package JSON record, not the ingestion
JSON, for ownership, OP rows, or bounded-marker semantics.

## Authority Boundary

This package proposes one schema-valid Year 2/v6 target-family candidate record
for the exact proposed surface
`references/authored/year2-v6-target-foundation-candidates.json`. It does not
write any registry, mint MTUs, generate lessons, close `OP-F1`, or authorize
product/Scale/student use. It is not a registry-ready record for the active v5
Books 1-4 paragraph registry.

## Target Family

Proposed record id: `Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1`.

Target family: housing finance and rent-market mixed case using
`vw-1022-a-23-2-o:q26-q29`.

## Paragraph Candidate And Prerequisite Chain

| Candidate | Role in package | Prerequisites |
|---|---|---|
| `Y2-B6-P08` | mortgage and household-finance application | `Y2-B6-P01` to `Y2-B6-P03`, Book 5 lifecycle choice |
| `Y2-B6-P09` | housing-market constraints and price signals | `Y2-B6-P08`, Book 2 demand/supply |
| `Y2-B6-P11` | financial table/source case | `Y2-B6-P01` to `Y2-B6-P10` |
| `Y2-B6-P12` | interest/bond/housing mixed case | `Y2-B6-P01` to `Y2-B6-P11`, Book 2 cost/revenue and marginal reasoning |
| `Y2-B6-P14` | Book 6 synthesis | all Book 6 candidates |

This package uses `Y2-B6-P01` to `Y2-B6-P03` as prerequisites but does not
promote them as separate target records.

Ownership fields for the proposed Year 2/v6 candidate surface:

- `target_owner_candidate_id`: `Y2-B6-P12`
- `prerequisite_candidate_ids`: `Y2-B6-P08`, `Y2-B6-P09`, `Y2-B6-P11`
- `integrates_candidate_ids`: `Y2-B6-P08`, `Y2-B6-P09`, `Y2-B6-P11`
- `bounded_retrieval_marker_ids`: `Y2-B6-P14`

Only `Y2-B6-P12` receives paragraph-local target ownership. `Y2-B6-P14`
remains a bounded synthesis/retrieval marker and does not imply that this one
exercise proves all Book 6 paragraphs.

## Official Prompt, Source, And Correction-Model Provenance

| Evidence | Locator | Required use |
|---|---|---|
| `vw-1022-a-23-2-o:q26` | `references/external/exams/vw-1022-a-23-2-o.pdf#page=12` | calculate social-housing waiting-list households |
| `vw-1022-a-23-2-o:q27` | `references/external/exams/vw-1022-a-23-2-o.pdf#page=12` | test maximum-rent claim through revenue maximization |
| `vw-1022-a-23-2-o:q28` | `references/external/exams/vw-1022-a-23-2-o.pdf#page=12` | explain low mortgage rate and housing-shortage risk argument |
| `vw-1022-a-23-2-o:q29` | `references/external/exams/vw-1022-a-23-2-o.pdf#page=13` | explain rent increase using supply data and income elasticity |
| correction model | `references/external/exams/vw-1022-a-23-2-c.pdf#page=13-14` | point allocation and answer-form constraints |

## Source Reconstruction Requirements

- Reconstruct `tabel-1-vastwonen-financial-data` with the values needed for
  q26 and q27:
  maximum rent = EUR 850 per dwelling per month; housing stock = 6,800
  dwellings; total monthly cost function `TK = 450Q + 1,400,000`; average
  monthly rent revenue function `GO = -0.125Q + 2,150`; `Q` = number of social
  rental dwellings.
- Reconstruct `tabel-2-particuliere-huurwoningen-reder` with the supply and
  income-elasticity evidence needed for q29:
  number of released rental dwellings = -9.9% versus previous year;
  average rent = +6%; middle incomes = +3%; income elasticity of private rental housing
  for middle-income households = +0.4.
- Preserve q28 context: social rent maximum of EUR 850, VastWonen as only
  social-housing provider in Reder, low mortgage-rate claim, purchase and
  conversion of old office buildings, financing through mortgage loans with
  collateral, and housing-shortage risk argument.
- Preserve which table values support calculation and which values support
  explanation.
- Keep rent-market context separate from Book 10 monetary-policy claims.
- Do not substitute generic housing-market tables, a generic rent-control
  diagram, or a generic mortgage case for these official VastWonen/Reder tables
  and q28 context.

## Target Exercise And Subquestions

Context: Students receive two official-style housing-market tables. They must
combine waiting-list calculation, revenue-maximization reasoning, mortgage-rate
risk explanation, and private-rent market source interpretation.

| Label | Prompt |
|---|---|
| a | Calculate the social-housing waiting-list count from the demand and housing-stock data. |
| b | Test whether abolishing the maximum rent removes the waiting list under the provider's revenue-maximizing choice. |
| c | Explain why a low mortgage rate can reduce interest-cost risk for a housing investor. |
| d | Explain why a housing shortage can support stable rental income and lower loss risk. |
| e | Use private-rental table data and income elasticity to explain why rent can rise. |

## Operation Chain And OP-Row Mapping

| Step | Operation | OP rows |
|---|---|---|
| 1 | calculate demand gap and waiting list | `OP-P1`, `OP-D1`, `OP-ANS2` |
| 2 | derive marginal revenue from average revenue and choose output | `OP-C1`, `OP-C2`, `OP-P1`, `OP-ANS2` |
| 3 | explain mortgage-rate cost channel | `OP-F1`, `OP-ANS3` |
| 4 | explain housing-shortage income-risk channel | `OP-F1`, `OP-ANS3` |
| 5 | use rent-market table and income elasticity | `OP-E1`, `OP-P1`, `OP-ANS3` |

## Answer Form And Point Allocation Requirements

- a: calculation with unit: current demand at maximum rent minus housing stock.
- b: calculation with conclusion: derive marginal revenue from average revenue,
  compare quantity with capacity, and accept or reject the claim.
- c: two-link mechanism: lower mortgage rate lowers interest costs; lower costs
  reduce pressure on returns or default risk.
- d: two-link mechanism: shortage supports rental demand; stable rent income
  reduces loss risk.
- e: source-supported two-sided market explanation: rising income with positive
  income elasticity raises demand; fewer rentals reduces supply and raises rent.

## Required Prior Skills And MTU/Task-Family Compatibility

Required prior skills:

- Book 1 table and percentage reading.
- Book 2 demand/supply and elasticity basics.
- Book 2 cost, revenue, marginal reasoning, and output choice.
- Book 5 lifecycle and stock/flow reasoning.
- Book 6 interest-rate vocabulary.

MTU/task-family compatibility:

- Mirrored skill IDs from source evidence: `A14`, `A06`, `A25`, `D11`.
- Required task families: `calculation_work`, `source_value_selection`,
  `sentence_builder`, `constructed_response`.
- Compatibility status: planning-compatible only; `OP-P1`, `OP-D1`, `OP-C1`,
  `OP-C2`, `OP-F1`, `OP-E1`, `OP-ANS2`, and `OP-ANS3` remain unclosed for
  production. `OP-D2` is not used because no individual-to-collective
  aggregation occurs.

## No-New-Theory Rationale

The package combines Book 6 housing-finance candidates already present in the
Year 2 map and uses one reviewed official housing source family. It does not
add monetary-policy theory, a new count-bearing Book 6 slot, a new MTU, or a
lesson route.

## Year 2/v6 Target-Family Candidate Record

```json
{
  "schema_surface": "year2_v6_target_family_candidate_surface_v1",
  "proposed_storage_surface": "references/authored/year2-v6-target-foundation-candidates.json",
  "id": "Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1",
  "book": 6,
  "module": 2,
  "chapter": 6,
  "paragraph": 12,
  "target_owner_candidate_id": "Y2-B6-P12",
  "prerequisite_candidate_ids": ["Y2-B6-P08", "Y2-B6-P09", "Y2-B6-P11"],
  "integrates_candidate_ids": ["Y2-B6-P08", "Y2-B6-P09", "Y2-B6-P11"],
  "bounded_retrieval_marker_ids": ["Y2-B6-P14"],
  "record_status": "candidate_for_governed_year2_v6_target_foundation",
  "official_evidence": ["vw-1022-a-23-2-o:q26-q29"],
  "source_reference": {
    "prompt_pdf": "references/external/exams/vw-1022-a-23-2-o.pdf#page=12-13",
    "correction_model_pdf": "references/external/exams/vw-1022-a-23-2-c.pdf#page=13-14"
  },
  "lesson_goal": "Use the VastWonen/Reder source case to calculate a waiting list, derive revenue-maximising output, explain mortgage-risk channels, and interpret rent-market table evidence.",
  "target_exercise": {
    "context": "Students receive two official-style housing-market tables.",
    "subquestions": [
      {"label": "a", "prompt": "Calculate the social-housing waiting-list count from the demand and housing-stock data."},
      {"label": "b", "prompt": "Test whether abolishing the maximum rent removes the waiting list under the provider's revenue-maximizing choice."},
      {"label": "c", "prompt": "Explain why a low mortgage rate can reduce interest-cost risk for a housing investor."},
      {"label": "d", "prompt": "Explain why a housing shortage can support stable rental income and lower loss risk."},
      {"label": "e", "prompt": "Use private-rental table data and income elasticity to explain why rent can rise."}
    ]
  },
  "answer_form": {
    "point_allocation": ["a: waiting-list calculation with unit", "b: marginal-revenue/output calculation with conclusion", "c: two-link mortgage-rate risk explanation", "d: two-link shortage/rental-income explanation", "e: source-supported demand/supply and elasticity explanation"],
    "short_answer_model": ["a: calculate demand at the maximum rent and subtract 6,800 dwellings.", "b: derive marginal revenue from average revenue, choose the revenue-maximising quantity, and compare it with capacity/waiting-list pressure.", "c: a low mortgage rate lowers interest costs and reduces pressure on returns/default risk.", "d: shortage sustains rental demand and stabilises rent income, reducing loss risk.", "e: middle-income demand rises because income rises with positive elasticity, while fewer released rentals restrict supply and pushes rent upward."]
  },
  "source_reconstruction_required": true,
  "op_rows": ["OP-P1", "OP-D1", "OP-C1", "OP-C2", "OP-F1", "OP-E1", "OP-ANS2", "OP-ANS3"],
  "operation_mapping": [
    {"subquestion": "a", "op_rows": ["OP-P1", "OP-D1", "OP-ANS2"], "note": "OP-D1 is used only for demand-function solving; OP-D2 is excluded."},
    {"subquestion": "b", "op_rows": ["OP-C1", "OP-C2", "OP-P1", "OP-ANS2"]},
    {"subquestion": "c", "op_rows": ["OP-F1", "OP-ANS3"]},
    {"subquestion": "d", "op_rows": ["OP-F1", "OP-ANS3"]},
    {"subquestion": "e", "op_rows": ["OP-E1", "OP-P1", "OP-ANS3"]}
  ],
  "prior_skills": ["Book 1 table and percentage reading", "Book 2 demand/supply and elasticity basics", "Book 2 cost/revenue and marginal reasoning", "Book 5 lifecycle and stock/flow reasoning", "Book 6 interest-rate vocabulary"],
  "required_task_families": ["calculation_work", "source_value_selection", "sentence_builder", "constructed_response"],
  "review_evidence": ["read-only teacher/economist/exam-evidence/source-visual/MTU-quality lead review", "PR #133 conditional repair"],
  "blockers": [
    {"blocker": "Housing finance and rent-market task-family proof missing", "blocks": "target-registry write, target-equivalent proof, lesson production", "does_not_block": "this planning package", "proof_required_to_close": "governed MTU/task-family review for housing finance, cost/revenue, elasticity, and rent-market source work"},
    {"blocker": "source-table reconstruction not yet rendered", "blocks": "lesson handoff and product proof", "does_not_block": "proposal review", "proof_required_to_close": "reconstructable tables, formulas, units, and value-selection trace"}
  ],
  "no_new_theory": true,
  "authority_boundary": "proposal_only_no_registry_write_no_mtu_no_lesson_no_product_use"
}
```

## Exact Missing-Unit Or Task-Family Blockers

| Blocker | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|
| Housing finance task-family proof missing | target-registry write, target-equivalent proof, lesson production | this planning package | governed MTU/task-family review for housing finance and rent-market source work |
| `OP-P1`/`OP-D1`/`OP-C1`/`OP-C2`/`OP-F1`/`OP-E1`/`OP-ANS2`/`OP-ANS3` not production closed | operation closure and production route | Year 2/v6 candidate proposal | operation-specific target comparison and answer-form proof |
| source-table reconstruction not yet rendered | lesson handoff and product proof | proposal review | reconstructable tables, formulas, units, and value-selection trace |

## Proof Required Before Lesson Production

- Approved target-registry mutation carrying this exact record.
- Reconstructed official tables with value-selection annotations.
- MTU/task-family review for housing finance, rent-market calculation, and
  source-supported explanation.
- Answer-form review for calculation-with-conclusion and two-link mechanisms.
- Product-proof gate after generated output exists.
