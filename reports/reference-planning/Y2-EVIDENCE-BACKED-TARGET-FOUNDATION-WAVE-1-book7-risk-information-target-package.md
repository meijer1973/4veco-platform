# Y2 Evidence-Backed Target Foundation Wave 1 - Book 7 Risk/Information Target Package

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
write any registry, mint MTUs, generate lessons, close `OP-R1`, or authorize
product/Scale/student use. It is not a registry-ready record for the active v5
Books 1-4 paragraph registry.

## Target Family

Proposed record id: `Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1`.

Target family: credit insurance, moral hazard, adverse selection,
principal-agent reasoning, and expected-premium calculation using
`vw-1022-a-23-1-o:q12-q15`.

## Paragraph Candidate And Prerequisite Chain

| Candidate | Role in package | Prerequisites |
|---|---|---|
| `Y2-B7-P02` | expected value and expected loss | `Y2-B7-P01`, Book 1 percentages |
| `Y2-B7-P09` | moral hazard | `Y2-B7-P05` to `Y2-B7-P07` |
| `Y2-B7-P10` | adverse selection | `Y2-B7-P09` |
| `Y2-B7-P11` | principal-agent and incentives | `Y2-B7-P09`, `Y2-B7-P10` |
| `Y2-B7-P12` | screening, signalling, and contract design | `Y2-B7-P09` to `Y2-B7-P11` |
| `Y2-B7-P13` | credit/insurance source case | all earlier Book 7 candidates |
| `Y2-B7-P14` | Book 7 synthesis | all Book 7 candidates |

Q3 remains complementary insurance-threshold evidence only and is not used to
close this broader target family.

Ownership fields for the proposed Year 2/v6 candidate surface:

- `target_owner_candidate_id`: `Y2-B7-P13`
- `prerequisite_candidate_ids`: `Y2-B7-P02`, `Y2-B7-P09`, `Y2-B7-P10`,
  `Y2-B7-P11`, `Y2-B7-P12`
- `integrates_candidate_ids`: `Y2-B7-P02`, `Y2-B7-P09`, `Y2-B7-P10`,
  `Y2-B7-P11`, `Y2-B7-P12`
- `bounded_retrieval_marker_ids`: `Y2-B7-P14`

Only `Y2-B7-P13` receives paragraph-local target ownership. `Y2-B7-P14`
remains a bounded synthesis/retrieval marker and does not imply complete Book 7
coverage.

## Official Prompt, Source, And Correction-Model Provenance

| Evidence | Locator | Required use |
|---|---|---|
| `vw-1022-a-23-1-o:q12` | `references/external/exams/vw-1022-a-23-1-o.pdf#page=7` | principal-agent problem and insurance condition |
| `vw-1022-a-23-1-o:q13` | `references/external/exams/vw-1022-a-23-1-o.pdf#page=7` | insurance conditions that reduce supplier moral hazard |
| `vw-1022-a-23-1-o:q14` | `references/external/exams/vw-1022-a-23-1-o.pdf#page=7` | condition that reduces adverse selection |
| `vw-1022-a-23-1-o:q15` | `references/external/exams/vw-1022-a-23-1-o.pdf#page=7` | total credit-insurance premium calculation |
| correction model | `references/external/exams/vw-1022-a-23-1-c.pdf#page=9-10` | point allocation and answer-form constraints |

## Source Reconstruction Requirements

- Reconstruct `figuur-1-kredietverzekering-en-voorwaarden` with all conditions:
  indemnity percentage, collection handoff, collection-cost pass-through, and
  bonus-malus.
- Preserve the official actor/arrow structure with the supplier, buying
  company, and credit insurer:
  pijl 1 = delivered sold product x; pijl 2 = invoice amount;
  pijl 3 = credit-insurance premium; pijl 4 = amount paid out when the buying
  company does not pay; pijl 5 = possible collection service;
  pijl 6 = collection costs plus surcharge; pijl 7 = outstanding debt to be paid.
- Preserve the four official insurance conditions:
  90% indemnity of missed turnover after non-payment; the insurer takes over
  collection after the payment term expires and the buyer still has not paid;
  collection costs are charged to the buying company; the insurer uses a
  supplier bonus-malus system.
- Reconstruct `tabel-1-financiele-gegevens-digibate` with contract counts,
  turnover, default probabilities, and premium markup inputs.
- Preserve the exact table rows and units:
  20 contracts, average turnover EUR 1 million, 90-day payment term,
  0.05% default probability;
  30 contracts, average turnover EUR 0.5 million, 60-day payment term,
  0.2% default probability;
  80 contracts, average turnover EUR 0.25 million, 60-day payment term,
  0.2% default probability.
- Preserve the premium rule: expected damage plus a 20% markup on expected
  damage.
- Preserve the official correction-model calculation: q15 uses contract count
  x average turnover x default probability, for EUR 80,000 expected damage and
  EUR 96,000 total premium. The 90% indemnity condition supports the incentive
  explanations but is not multiplied into the q15 premium base.
- Mark which source elements support q12-q14 explanation and which support q15
  calculation.
- Keep Q3 insurance-threshold evidence as complementary, not a production
  closure.
- Do not substitute a generic insurance diagram, generic principal-agent
  triangle, or generic expected-value table for the official actor/arrow figure
  and Digibate table.

## Target Exercise And Subquestions

Context: Students receive a credit-insurance source with conditions and a table
of contract/default data. They must identify information problems, explain how
insurance conditions change incentives, and calculate an expected premium.

| Label | Prompt |
|---|---|
| a | Explain the principal-agent problem in the case and name the insurance condition that reduces it. |
| b | Identify two conditions that reduce supplier moral hazard and explain the incentive effect. |
| c | Identify one condition that can reduce adverse selection and explain why. |
| d | Calculate expected damage from contract counts, turnover, and default probabilities. |
| e | Add the premium markup and state the total credit-insurance premium with a conclusion. |

## Operation Chain And OP-Row Mapping

| Step | Operation | OP rows |
|---|---|---|
| 1 | identify conflicting interests and asymmetric information | `OP-R1`, `OP-M1`, `OP-ANS3` |
| 2 | connect deductible/bonus-malus to moral-hazard incentives | `OP-R1`, `OP-ANS3` |
| 3 | connect bonus-malus, voluntary deductible, or compulsory insurance to selection | `OP-R1`, `OP-ANS3` |
| 4 | calculate expected damage | `OP-R1`, `OP-ANS2` |
| 5 | add markup and conclude premium | `OP-R1`, `OP-ANS2`, `OP-ANS3` |

## Answer Form And Point Allocation Requirements

- a: three-part explanation: conflicting interests, asymmetric information, and
  the condition that reduces the problem.
- b: condition identification plus incentive chain: deductible and bonus-malus
  reduce the financial incentive to claim.
- c: adverse-selection explanation: bonus-malus or voluntary deductible attracts
  good risks, or compulsory insurance removes selection.
- d/e: expected-value calculation with markup and final premium conclusion,
  using the official EUR 80,000 expected damage and EUR 96,000 premium.

## Required Prior Skills And MTU/Task-Family Compatibility

Required prior skills:

- Book 1 percentages and weighted calculations.
- Book 6 household/finance context.
- Book 7 risk, insurance, moral hazard, and adverse-selection vocabulary.

MTU/task-family compatibility:

- Mirrored skill IDs from source evidence: `G02`, `F09`, `G04`, `A04`.
- Required task families: `calculation_work`, `assertion_reason`,
  `source_value_selection`, `constructed_response`.
- Compatibility status: planning-compatible only; `OP-R1`, `OP-M1`,
  `OP-ANS2`, and `OP-ANS3` remain unclosed for production. `OP-F1` is not used
  here because the expected-premium calculation is routed as a risk/insurance
  expected-value task, not Book 6 finance mechanics.

## No-New-Theory Rationale

The package combines Book 7 candidates already present in the Year 2 map and
uses one reviewed official credit-insurance source family. It does not add a
new information-economics unit, a new Book 7 count-bearing slot, a new MTU, or
a lesson route.

## Year 2/v6 Target-Family Candidate Record

```json
{
  "schema_surface": "year2_v6_target_family_candidate_surface_v1",
  "proposed_storage_surface": "references/authored/year2-v6-target-foundation-candidates.json",
  "id": "Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1",
  "book": 7,
  "module": 2,
  "chapter": 7,
  "paragraph": 13,
  "target_owner_candidate_id": "Y2-B7-P13",
  "prerequisite_candidate_ids": ["Y2-B7-P02", "Y2-B7-P09", "Y2-B7-P10", "Y2-B7-P11", "Y2-B7-P12"],
  "integrates_candidate_ids": ["Y2-B7-P02", "Y2-B7-P09", "Y2-B7-P10", "Y2-B7-P11", "Y2-B7-P12"],
  "bounded_retrieval_marker_ids": ["Y2-B7-P14"],
  "record_status": "candidate_for_governed_year2_v6_target_foundation",
  "official_evidence": ["vw-1022-a-23-1-o:q12-q15"],
  "source_reference": {
    "prompt_pdf": "references/external/exams/vw-1022-a-23-1-o.pdf#page=7",
    "correction_model_pdf": "references/external/exams/vw-1022-a-23-1-c.pdf#page=9-10"
  },
  "lesson_goal": "Use the official credit-insurance case to identify information problems, explain incentive effects, and calculate expected damage plus markup.",
  "target_exercise": {
    "context": "Students receive a credit-insurance source with conditions and a table of contract/default data.",
    "subquestions": [
      {"label": "a", "prompt": "Explain the principal-agent problem in the case and name the insurance condition that reduces it."},
      {"label": "b", "prompt": "Identify two conditions that reduce supplier moral hazard and explain the incentive effect."},
      {"label": "c", "prompt": "Identify one condition that can reduce adverse selection and explain why."},
      {"label": "d", "prompt": "Calculate expected damage from contract counts, turnover, and default probabilities."},
      {"label": "e", "prompt": "Add the premium markup and state the total credit-insurance premium with a conclusion."}
    ]
  },
  "answer_form": {
    "point_allocation": ["a: insurer-principal, buying-company-agent, asymmetric information, and collection-cost condition", "b: two condition-and-incentive chains", "c: adverse-selection condition and reason", "d: expected-value calculation", "e: markup calculation and final conclusion"],
    "short_answer_model": ["a: the credit insurer is principal and the buying company is agent; charging collection costs to the buying company reduces the agency problem.", "b: deductible-like indemnity and bonus-malus reduce the incentive to claim carelessly.", "c: bonus-malus, voluntary deductible, or compulsory insurance can reduce selection by changing who enters the pool.", "d: multiply contract count, turnover, and default probability for each row; expected damage is EUR 80,000.", "e: add the 20% markup; total premium is EUR 96,000."]
  },
  "source_reconstruction_required": true,
  "op_rows": ["OP-R1", "OP-M1", "OP-ANS2", "OP-ANS3"],
  "operation_mapping": [
    {"subquestion": "a", "op_rows": ["OP-R1", "OP-M1", "OP-ANS3"]},
    {"subquestion": "b", "op_rows": ["OP-R1", "OP-ANS3"]},
    {"subquestion": "c", "op_rows": ["OP-R1", "OP-ANS3"]},
    {"subquestion": "d", "op_rows": ["OP-R1", "OP-ANS2"]},
    {"subquestion": "e", "op_rows": ["OP-R1", "OP-ANS2", "OP-ANS3"]}
  ],
  "prior_skills": ["Book 1 percentages and weighted calculations", "Book 6 household/finance context", "Book 7 risk, insurance, moral hazard, and adverse-selection vocabulary"],
  "required_task_families": ["calculation_work", "assertion_reason", "source_value_selection", "constructed_response"],
  "review_evidence": ["read-only teacher/economist/exam-evidence/source-visual/MTU-quality lead review", "PR #133 conditional repair"],
  "blockers": [
    {"blocker": "Broad risk/information task-family proof missing", "blocks": "target-registry write, broad OP-R1 closure, lesson production", "does_not_block": "this planning package", "proof_required_to_close": "governed MTU/task-family review for expected premium and information-problem explanations"},
    {"blocker": "source reconstruction not yet rendered", "blocks": "lesson handoff and product proof", "does_not_block": "proposal review", "proof_required_to_close": "reconstructable conditions figure, financial table, calculation trace, and markup rule"}
  ],
  "no_new_theory": true,
  "authority_boundary": "proposal_only_no_registry_write_no_mtu_no_lesson_no_product_use"
}
```

## Exact Missing-Unit Or Task-Family Blockers

| Blocker | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|
| Broad risk/information task-family proof missing | target-registry write, broad `OP-R1` closure, lesson production | this planning package | governed MTU/task-family review for expected premium and information-problem explanations |
| Q3 parent/child storage unresolved | broad insurance operation closure | credit-insurance proposal review | separate governed Q3 storage decision if Q3 is used as production evidence |
| source reconstruction not yet rendered | lesson handoff and product proof | proposal review | reconstructable conditions figure, financial table, calculation trace, and markup rule |

## Proof Required Before Lesson Production

- Approved target-registry mutation carrying this exact record.
- Reconstructed official figure/table with value-selection annotations.
- MTU/task-family review for information-problem explanation and expected
  premium calculation.
- Answer-form review for condition identification, incentive chains, and
  expected-value calculation.
- Product-proof gate after generated output exists.
