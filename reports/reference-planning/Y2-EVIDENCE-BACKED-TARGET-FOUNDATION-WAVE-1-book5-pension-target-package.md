# Y2 Evidence-Backed Target Foundation Wave 1 - Book 5 Pension Target Package

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
write any registry, mint MTUs, generate lessons, close `OP-T1`, or authorize
product/Scale/student use. It is not a registry-ready record for the active v5
Books 1-4 paragraph registry.

## Target Family

Proposed record id: `Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1`.

Target family: pension/time/stock-flow source case using
`vw-1022-a-25-2-o:q7-q11`.

## Paragraph Candidate And Prerequisite Chain

| Candidate | Role in package | Prerequisites |
|---|---|---|
| `Y2-B5-P08` | pension-system mechanism | `Y2-B5-P01`, `Y2-B5-P02` |
| `Y2-B5-P09` | coverage ratio, stock/flow, pension wealth source evidence | `Y2-B5-P03`, `Y2-B5-P08`, Book 1 percentages/index |
| `Y2-B5-P10` | ageing and sustainability mechanism | `Y2-B5-P08` |
| `Y2-B5-P11` | intergenerational solidarity and fairness claim | `Y2-B5-P08`, `Y2-B5-P10` |
| `Y2-B5-P13` | integrated pension/source case retrieval | `Y2-B5-P08` to `Y2-B5-P12` |

This package may reference `Y2-B5-P01`, `Y2-B5-P02`, and `Y2-B5-P03` as
prerequisites, but it does not propose separate records for them.

Ownership fields for the proposed Year 2/v6 candidate surface:

- `target_owner_candidate_id`: `Y2-B5-P13`
- `prerequisite_candidate_ids`: `Y2-B5-P08`, `Y2-B5-P09`, `Y2-B5-P10`,
  `Y2-B5-P11`
- `integrates_candidate_ids`: `Y2-B5-P08`, `Y2-B5-P09`, `Y2-B5-P10`,
  `Y2-B5-P11`
- `bounded_retrieval_marker_ids`: none

Only `Y2-B5-P13` receives paragraph-local target ownership. The prerequisite
and integrated candidates remain evidence for this source family and do not
receive complete target coverage from this one exercise.

## Official Prompt, Source, And Correction-Model Provenance

| Evidence | Locator | Required use |
|---|---|---|
| `vw-1022-a-25-2-o:q7` | `references/external/exams/vw-1022-a-25-2-o.pdf#page=4` | pensions as exchange over time |
| `vw-1022-a-25-2-o:q8` | `references/external/exams/vw-1022-a-25-2-o.pdf#page=4` | welfare-indexed pension outlays under model assumptions |
| `vw-1022-a-25-2-o:q9` | `references/external/exams/vw-1022-a-25-2-o.pdf#page=5` | stock/flow classification for accumulated pension saving |
| `vw-1022-a-25-2-o:q10` | `references/external/exams/vw-1022-a-25-2-o.pdf#page=5` | premiums as percentage of pension wealth |
| `vw-1022-a-25-2-o:q11` | `references/external/exams/vw-1022-a-25-2-o.pdf#page=5` | pension age and purchasing power of premium payers |
| correction model | `references/external/exams/vw-1022-a-25-2-c.pdf#page=8-9` | point allocation and answer-form constraints |

## Source Reconstruction Requirements

- Reconstruct `figuur-1-pensioenmodel-2024-2044` as the official 2024-2044
  pension-model figure, preserving its mixed bar/line structure rather than
  replacing it with a generic pension diagram.
- Preserve the exact time horizon `2024-2044` and the official source title
  `Pensioenmodel econoom (2024-2044)`.
- Preserve all official visual encodings: bars/columns, line series, legend,
  left/right axes where present, axis labels, units, scale/tick direction, and
  every variable needed to distinguish pension wealth, GDP-linked premiums,
  total pension outlays, and premiums as a percentage of total pension wealth.
- Preserve assumptions a-f as source text tied to q8 and q10:
  a annual inflation = 2%; b annual real economic growth = 0.5%;
  c annual pension-asset return = 3.5%; d premium pressure as percentage of GDP stays constant;
  e number of premium payers stays constant;
  f capital incomes stay constant.
- Mark which source elements are moment values and which are period flows.
- Keep any numerical reconstruction traceable to the official page locator.
- Do not substitute a generic pension diagram for the official source family.

## Target Exercise And Subquestions

Context: Students receive the official-style pension model figure and assumption
set. They must use the source to connect pension exchange over time, stock/flow
classification, indexation, pension wealth, ageing, and purchasing power.

| Label | Prompt |
|---|---|
| a | Explain why pension premiums and pension payouts can be described as exchange over time. |
| b | Use the model assumptions to explain why welfare-indexed pension outlays rise when income rises. |
| c | Classify net accumulated pension saving as a stock or a flow, and justify from the source. |
| d | Explain why premiums can fall as a percentage of total pension wealth even when they stay constant as a percentage of GDP. |
| e | Explain one route through which a higher pension age can raise current premium payers' purchasing power. |

## Operation Chain And OP-Row Mapping

| Step | Operation | OP rows |
|---|---|---|
| 1 | identify time exchange and lifecycle direction | `OP-T1`, `OP-ANS3` |
| 2 | use source assumptions to trace indexed pension outlays | `OP-T1`, `OP-H1`, `OP-ANS3` |
| 3 | classify source variable as stock or flow | `OP-T1`, `OP-ANS3` |
| 4 | compare GDP-share and pension-wealth-share reasoning | `OP-T1`, `OP-ANS2`, `OP-ANS3` |
| 5 | explain pension-age policy mechanism and purchasing power effect | `OP-T1`, `OP-H1`, `OP-ANS3` |

## Answer Form And Point Allocation Requirements

- a: two-step explanation: premiums reduce current consumption; later payouts
  support future consumption.
- b: two-link source explanation: nominal income rises through real growth plus
  inflation; welfare-indexed pensions rise with incomes.
- c: classification with motivation: stock because the amount is measured at a
  moment.
- d: two-link source explanation: pension wealth rises faster than GDP; a
  constant GDP-share premium falls as a wealth-share premium.
- e: policy mechanism explanation: more premium payers or fewer beneficiaries
  improves fund balance; lower premiums can raise net income and purchasing
  power.

## Required Prior Skills And MTU/Task-Family Compatibility

Required prior skills:

- Book 1 percentage/index reading.
- Book 1 table/source reading.
- Book 5 stock/flow vocabulary.
- Book 5 intertemporal exchange vocabulary.

MTU/task-family compatibility:

- Mirrored skill IDs from source evidence: `E02`, `E06`.
- Required task families: `source_value_selection`, `sentence_builder`,
  `constructed_response`.
- Compatibility status: planning-compatible only; `OP-T1`, `OP-H1`,
  `OP-ANS2`, and `OP-ANS3` do not receive production closure. `OP-F1` is not
  used here because the GDP-share/pension-wealth-share explanation is routed as
  time/stock-flow reasoning, not Book 6 finance mechanics.

## No-New-Theory Rationale

The package combines candidates already present in the Year 2 map and uses the
reviewed official pension source family. It does not add a new pension-theory
domain, a new Book 5 count-bearing slot, a new MTU, or a new lesson route.

## Year 2/v6 Target-Family Candidate Record

```json
{
  "schema_surface": "year2_v6_target_family_candidate_surface_v1",
  "proposed_storage_surface": "references/authored/year2-v6-target-foundation-candidates.json",
  "id": "Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1",
  "book": 5,
  "module": 2,
  "chapter": 5,
  "paragraph": 13,
  "target_owner_candidate_id": "Y2-B5-P13",
  "prerequisite_candidate_ids": ["Y2-B5-P08", "Y2-B5-P09", "Y2-B5-P10", "Y2-B5-P11"],
  "integrates_candidate_ids": ["Y2-B5-P08", "Y2-B5-P09", "Y2-B5-P10", "Y2-B5-P11"],
  "bounded_retrieval_marker_ids": [],
  "record_status": "candidate_for_governed_year2_v6_target_foundation",
  "official_evidence": ["vw-1022-a-25-2-o:q7-q11"],
  "source_reference": {
    "prompt_pdf": "references/external/exams/vw-1022-a-25-2-o.pdf#page=4-5",
    "correction_model_pdf": "references/external/exams/vw-1022-a-25-2-c.pdf#page=8-9"
  },
  "lesson_goal": "Use the official pension model to explain exchange over time, stock/flow classification, indexation, pension-wealth ratios, and pension-age purchasing-power effects.",
  "target_exercise": {
    "context": "Students receive the official-style pension model figure and assumption set.",
    "subquestions": [
      {"label": "a", "prompt": "Explain why pension premiums and pension payouts can be described as exchange over time."},
      {"label": "b", "prompt": "Use the model assumptions to explain why welfare-indexed pension outlays rise when income rises."},
      {"label": "c", "prompt": "Classify net accumulated pension saving as a stock or a flow, and justify from the source."},
      {"label": "d", "prompt": "Explain why premiums can fall as a percentage of total pension wealth even when they stay constant as a percentage of GDP."},
      {"label": "e", "prompt": "Explain one route through which a higher pension age can raise current premium payers' purchasing power."}
    ]
  },
  "answer_form": {
    "point_allocation": ["a: two-step exchange-over-time explanation", "b: two-link income-indexation explanation", "c: stock/flow classification with source justification", "d: ratio comparison with conclusion", "e: policy mechanism and purchasing-power effect"],
    "short_answer_model": ["a: premiums reduce current consumption and payouts support future consumption.", "b: real growth plus inflation raises nominal income, so welfare-indexed outlays rise.", "c: accumulated saving is a stock because it is measured at a moment.", "d: pension wealth rises faster than GDP, so a constant GDP-share premium falls as wealth share.", "e: a higher pension age can improve the fund balance and lower premium pressure, raising net purchasing power."]
  },
  "source_reconstruction_required": true,
  "op_rows": ["OP-T1", "OP-H1", "OP-ANS2", "OP-ANS3"],
  "operation_mapping": [
    {"subquestion": "a", "op_rows": ["OP-T1", "OP-ANS3"]},
    {"subquestion": "b", "op_rows": ["OP-T1", "OP-H1", "OP-ANS3"]},
    {"subquestion": "c", "op_rows": ["OP-T1", "OP-ANS3"]},
    {"subquestion": "d", "op_rows": ["OP-T1", "OP-ANS2", "OP-ANS3"]},
    {"subquestion": "e", "op_rows": ["OP-T1", "OP-H1", "OP-ANS3"]}
  ],
  "prior_skills": ["Book 1 percentage/index reading", "Book 1 table/source reading", "Book 5 stock/flow vocabulary", "Book 5 intertemporal exchange vocabulary"],
  "required_task_families": ["source_value_selection", "sentence_builder", "constructed_response"],
  "review_evidence": ["read-only teacher/economist/exam-evidence/source-visual/MTU-quality lead review", "PR #133 conditional repair"],
  "blockers": [
    {"blocker": "Book 5 pension task-family proof missing", "blocks": "target-registry write, target-equivalent proof, lesson production", "does_not_block": "this planning package", "proof_required_to_close": "governed MTU/task-family review for pension source reasoning"},
    {"blocker": "official source reconstruction not yet rendered", "blocks": "lesson handoff and product proof", "does_not_block": "proposal review", "proof_required_to_close": "reconstructable source figure, assumptions, and value trace"}
  ],
  "no_new_theory": true,
  "authority_boundary": "proposal_only_no_registry_write_no_mtu_no_lesson_no_product_use"
}
```

## Exact Missing-Unit Or Task-Family Blockers

| Blocker | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|
| Book 5 pension task-family proof missing | target-registry write, target-equivalent proof, lesson production | this planning package | governed MTU/task-family review for pension source reasoning |
| `OP-T1`/`OP-H1`/`OP-ANS2`/`OP-ANS3` not production closed | operation closure and production route | Year 2/v6 candidate proposal | operation-specific target comparison and answer-form proof |
| official source reconstruction not yet rendered | lesson handoff and product proof | proposal review | reconstructable source figure, assumptions, and value trace |

## Proof Required Before Lesson Production

- Approved target-registry mutation carrying this exact record.
- Source reconstruction artifact with official locators.
- MTU/task-family review proving compatible task shells.
- Answer-form review proving point allocation and correction-model fit.
- Product-proof gate after generated output exists.
