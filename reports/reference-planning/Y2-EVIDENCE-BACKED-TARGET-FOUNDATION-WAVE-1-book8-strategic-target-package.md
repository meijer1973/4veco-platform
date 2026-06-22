# Y2 Evidence-Backed Target Foundation Wave 1 - Book 8 Strategic Target Package

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
write any registry, mint MTUs, generate lessons, close `OP-S1` or `OP-ANS3`,
or authorize product/Scale/student use. It is not a registry-ready record for
the active v5 Books 1-4 paragraph registry.

## Target Family

Proposed record id: `Y2-B8-Q15-Q16-STRATEGIC-TARGET-1`.

Target family: Q15/Q16 dominant strategy, prisoner's dilemma, and self-binding
answer-form case using `vw-1022-a-25-1-o:q15-q16`.

## Paragraph Candidate And Prerequisite Chain

| Candidate | Role in package | Prerequisites |
|---|---|---|
| `Y2-B8-P02` | dominant-strategy reasoning | `Y2-B8-P01`, Book 7 incentive logic |
| `Y2-B8-P03` | Nash/prisoner's-dilemma outcome | `Y2-B8-P01`, `Y2-B8-P02` |
| `Y2-B8-P04` | self-binding and repeated interaction | `Y2-B8-P01` to `Y2-B8-P03` |
| `Y2-B8-P16` | strategic policy-evaluation synthesis | all Book 8 strategic candidates |

This package does not use q22/q23 green-growth evidence as target authority.
q23 remains routed to later macro/monetary-policy review.

Ownership fields for the proposed Year 2/v6 candidate surface:

- `target_owner_candidate_id`: `Y2-B8-P04`
- `prerequisite_candidate_ids`: `Y2-B8-P02`, `Y2-B8-P03`
- `integrates_candidate_ids`: `Y2-B8-P02`, `Y2-B8-P03`
- `bounded_retrieval_marker_ids`: `Y2-B8-P16`

Only `Y2-B8-P04` receives paragraph-local target ownership. `Y2-B8-P16`
remains a bounded synthesis/retrieval marker and does not imply complete Book 8
coverage.

## Official Prompt, Source, And Correction-Model Provenance

| Evidence | Locator | Required use |
|---|---|---|
| `vw-1022-a-25-1-o:q15` | `references/external/exams/vw-1022-a-25-1-o.pdf#page=7` | prisoner's dilemma from perfect-substitute ice creams |
| `vw-1022-a-25-1-o:q16` | `references/external/exams/vw-1022-a-25-1-o.pdf#page=7` | self-binding and lowest-price guarantee limiting price-war risk |
| correction model | `references/external/exams/vw-1022-a-25-1-c.pdf#page=11-12` | two-link answer-form and point allocation |

## Source Reconstruction Requirements

- Reconstruct the `IJssalon` context with the two firms, perfect-substitute
  products, price-cut incentive, and lowest-price guarantee.
- Preserve the exact official terms:
  at the beginning of 2025 Guarda loses its monopoly position because
  Orso Bianco opens; Orso Bianco has the same production costs as Guarda;
  Orso Bianco enters with a lower price; consumers view Orso Bianco ice creams as
  perfect substitutes for Guarda ice creams; the two shops can enter a price war
  and prisoner's dilemma.
- Preserve the self-binding source terms:
  Guarda advertises a fixed sales price for 2025 on social media together with
  a lowest-price guarantee; if consumers can buy an ice cream for a lower price
  from Orso Bianco, Guarda gives a discount of 25% on that lower price.
- Preserve whether a source phrase supports q15 dominant-strategy logic or q16
  commitment-device logic.
- If a payoff matrix is introduced for teaching support, mark it as a derived
  representation from the official source, not as an official source figure.
- Do not import q22/q23 macro figures into this strategic target.
- Do not substitute a generic duopoly, generic payoff matrix, or generic
  repeated-game example for the official Guarda/Orso Bianco source terms.

## Target Exercise And Subquestions

Context: Students receive the official-style ice-cream duopoly source. They must
explain dominant-strategy logic, why the outcome is a prisoner's dilemma, and
why self-binding changes price-war incentives.

| Label | Prompt |
|---|---|
| a | Identify the price choice that functions as each firm's dominant strategy and explain why. |
| b | Explain why the resulting outcome can be called a prisoner's dilemma. |
| c | Explain how a lowest-price guarantee functions as self-binding. |
| d | Explain why the self-binding device reduces the incentive for the other firm to start a price war. |

## Operation Chain And OP-Row Mapping

| Step | Operation | OP rows |
|---|---|---|
| 1 | identify strategy and payoff direction from source | `OP-S1`, `OP-ANS1` |
| 2 | explain dominant strategy for both firms | `OP-S1`, `OP-ANS3` |
| 3 | connect individual incentives to worse joint outcome | `OP-S1`, `OP-ANS3` |
| 4 | explain self-binding as commitment device | `OP-S1`, `OP-ANS3` |
| 5 | explain changed price-war incentive | `OP-S1`, `OP-ANS3` |

## Answer Form And Point Allocation Requirements

- a/b: two-link strategic explanation: both firms have a dominant strategy to
  lower price; the individually rational outcome is jointly worse.
- c/d: self-binding mechanism explanation: the guarantee commits one firm to
  follow the other's price; the other firm expects less gain from cutting price
  and has less incentive to start a price war.
- Every explanation must name the incentive and the consequence. A bare
  definition of prisoner's dilemma or self-binding is insufficient.

## Required Prior Skills And MTU/Task-Family Compatibility

Required prior skills:

- Book 7 incentive logic.
- Basic table/source reading.
- Book 8 payoff and strategic-choice vocabulary.

MTU/task-family compatibility:

- Mirrored or partial skill IDs from source evidence: `D27`, `F03`, `F09`.
- Required task families: `matching_pairs`, `step_ordering`,
  `sentence_builder`, `constructed_response`.
- Compatibility status: planning-compatible only; Q15/Q16 does not close
  `OP-S1`, `OP-ANS1`, or `OP-ANS3`.

## No-New-Theory Rationale

The package combines Book 8 candidates already present in the Year 2 map and
uses the reviewed Q15/Q16 official strategic source family. It does not add a
new game-theory unit, a new Book 8 count-bearing slot, a new MTU, or a lesson
route.

## Year 2/v6 Target-Family Candidate Record

```json
{
  "schema_surface": "year2_v6_target_family_candidate_surface_v1",
  "proposed_storage_surface": "references/authored/year2-v6-target-foundation-candidates.json",
  "id": "Y2-B8-Q15-Q16-STRATEGIC-TARGET-1",
  "book": 8,
  "module": 2,
  "chapter": 8,
  "paragraph": 4,
  "target_owner_candidate_id": "Y2-B8-P04",
  "prerequisite_candidate_ids": ["Y2-B8-P02", "Y2-B8-P03"],
  "integrates_candidate_ids": ["Y2-B8-P02", "Y2-B8-P03"],
  "bounded_retrieval_marker_ids": ["Y2-B8-P16"],
  "record_status": "candidate_for_governed_year2_v6_target_foundation",
  "official_evidence": ["vw-1022-a-25-1-o:q15-q16"],
  "source_reference": {
    "prompt_pdf": "references/external/exams/vw-1022-a-25-1-o.pdf#page=7",
    "correction_model_pdf": "references/external/exams/vw-1022-a-25-1-c.pdf#page=11-12"
  },
  "lesson_goal": "Use the official Guarda/Orso Bianco source to explain dominant strategy, prisoner's dilemma, self-binding, and price-war incentives.",
  "target_exercise": {
    "context": "Students receive the official-style ice-cream duopoly source.",
    "subquestions": [
      {"label": "a", "prompt": "Identify the price choice that functions as each firm's dominant strategy and explain why."},
      {"label": "b", "prompt": "Explain why the resulting outcome can be called a prisoner's dilemma."},
      {"label": "c", "prompt": "Explain how a lowest-price guarantee functions as self-binding."},
      {"label": "d", "prompt": "Explain why the self-binding device reduces the incentive for the other firm to start a price war."}
    ]
  },
  "answer_form": {
    "point_allocation": ["a: dominant-strategy identification and reason", "b: individual incentive plus worse joint outcome", "c: self-binding mechanism", "d: changed incentive for the other firm"],
    "short_answer_model": ["a: each firm has an incentive to lower price because consumers see the products as perfect substitutes.", "b: both lowering price can be individually rational while making both worse off than cooperation.", "c: the guarantee commits Guarda to follow a lower price and makes the promise credible.", "d: Orso Bianco expects less gain from cutting price, so the incentive to start a price war falls."]
  },
  "source_reconstruction_required": true,
  "op_rows": ["OP-S1", "OP-ANS1", "OP-ANS3"],
  "operation_mapping": [
    {"subquestion": "a", "op_rows": ["OP-S1", "OP-ANS1", "OP-ANS3"]},
    {"subquestion": "b", "op_rows": ["OP-S1", "OP-ANS3"]},
    {"subquestion": "c", "op_rows": ["OP-S1", "OP-ANS3"]},
    {"subquestion": "d", "op_rows": ["OP-S1", "OP-ANS3"]}
  ],
  "prior_skills": ["Book 7 incentive logic", "Basic table/source reading", "Book 8 payoff and strategic-choice vocabulary"],
  "required_task_families": ["matching_pairs", "step_ordering", "sentence_builder", "constructed_response"],
  "review_evidence": ["read-only teacher/economist/exam-evidence/source-visual/MTU-quality lead review", "PR #133 conditional repair"],
  "blockers": [
    {"blocker": "Q15/Q16 two-link answer-skill route missing", "blocks": "target-registry write, broad OP-S1 closure, broad OP-ANS3 closure", "does_not_block": "this planning package", "proof_required_to_close": "governed answer-skill and task-family review"},
    {"blocker": "derived payoff matrix not yet reconstructed", "blocks": "lesson handoff and product proof", "does_not_block": "proposal review", "proof_required_to_close": "source-to-derived-representation trace or official-source-only route"}
  ],
  "no_new_theory": true,
  "authority_boundary": "proposal_only_no_registry_write_no_mtu_no_lesson_no_product_use"
}
```

## Exact Missing-Unit Or Task-Family Blockers

| Blocker | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|
| Q15/Q16 two-link answer-skill route missing | target-registry write, broad `OP-S1` closure, broad `OP-ANS3` closure | this planning package | governed answer-skill and task-family review |
| derived payoff matrix not yet reconstructed | lesson handoff and product proof | proposal review | source-to-derived-representation trace or official-source-only route |
| Book 8 q23 boundary | monetary-policy production, `OP-MP1` closure | strategic Q15/Q16 target proposal | route q23 to Book 9/10 macro review |

## Proof Required Before Lesson Production

- Approved target-registry mutation carrying this exact record.
- Source reconstruction or explicit derived-representation trace.
- MTU/task-family and answer-skill review for strategic two-link explanation.
- Product-proof gate after generated output exists.
