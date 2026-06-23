# Y2 Evidence-Backed Target Foundation Wave 1 - Governed Mutation Plan

Status: proposed mutation plan, no mutation executed

## Product End-State And Original Specs

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`

Original sprint/gate/source specs:

- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v6-three-year.md`
- `reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-cross-book-consistency-review.md`

## Authority Boundary

This file proposes exact Year 2/v6 target-family candidate records for a later governed mutation.
It does not edit
`references/authored/course-target-exercises.json` and does not create the
Year 2/v6 candidate surface in this PR.

The active registry remains the v5 Books 1-4 paragraph registry at
`references/authored/course-target-exercises.json`; these records are not registry-ready for that validator.

## Proposed Year 2/v6 Candidate Surface

Exact proposed future surface:
`references/authored/year2-v6-target-foundation-candidates.json`

Schema id: `year2_v6_target_family_candidate_surface_v1`

Allowed status for this wave:
`candidate_for_governed_year2_v6_target_foundation`

Required fields for each proposed record:

- `schema_surface`
- `proposed_storage_surface`
- `id`
- integer `book`, `module`, `chapter`, and `paragraph`
- `target_owner_candidate_id`
- `prerequisite_candidate_ids`
- `integrates_candidate_ids`
- `bounded_retrieval_marker_ids`
- `record_status`
- `official_evidence`
- `source_reference`
- `lesson_goal`
- `target_exercise`
- `answer_form`
- `source_reconstruction_required`
- `op_rows`
- `operation_mapping`
- `prior_skills`
- `required_task_families`
- `review_evidence`
- `blockers`
- `no_new_theory`
- `authority_boundary`

Validation rules:

1. Exactly one `target_owner_candidate_id` is allowed per record.
2. `chapter` equals the Year 2 book number and `paragraph` matches the owner
   paragraph number.
3. Prerequisite, integrated, and bounded retrieval marker IDs do not receive
   complete target coverage from the owner exercise.
4. Every record must carry the complete target exercise, answer form,
   provenance, review evidence, and blocker data.
5. `OP-D2` is forbidden in the Book 6 record for this family because no
   individual-to-collective aggregation occurs.
6. `OP-F1` is not used in the Book 5 or Book 7 record unless a later repair
   adds an explicit finance-operation justification.
7. `references/data/exam-ingestion/y2-exam-anchor-ingestion-wave-1.json` is
   provenance only for this packet; its older OP-row route is superseded by
   the package JSON records for ownership, OP rows, and bounded-marker
   semantics.

## Exact Proposed Candidate Records

The schema-valid record JSON blocks under
`## Year 2/v6 Target-Family Candidate Record` in the four package files are the
exact mutation source of truth for a later governed implementation PR:

| Record | Package source | Owner | OP rows |
|---|---|---|---|
| `Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1` | `reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book5-pension-target-package.md` | `Y2-B5-P13` | `OP-T1`, `OP-H1`, `OP-ANS2`, `OP-ANS3` |
| `Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1` | `reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book6-housing-target-package.md` | `Y2-B6-P12` | `OP-P1`, `OP-D1`, `OP-C1`, `OP-C2`, `OP-F1`, `OP-E1`, `OP-ANS2`, `OP-ANS3` |
| `Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1` | `reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book7-risk-information-target-package.md` | `Y2-B7-P13` | `OP-R1`, `OP-M1`, `OP-ANS2`, `OP-ANS3` |
| `Y2-B8-Q15-Q16-STRATEGIC-TARGET-1` | `reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book8-strategic-target-package.md` | `Y2-B8-P04` | `OP-S1`, `OP-ANS1`, `OP-ANS3` |

A later implementation PR may create or extend only the exact proposed future
surface above and must reproduce these four package JSON records without
substantive changes unless a new human review authorizes the change.

## Mutation Preconditions

Before any registry write:

1. Human approval of this wave.
2. The implementation PR must reproduce the approved records without
   substantive changes.
3. The implementation PR must run the Year 2/v6 candidate-surface schema
   validator and preserve the active v5 Books 1-4 registry validator.
4. Any field-name adaptation must be mechanical and documented.
5. Any MTU/task-family mutation must be separated into a protected CLI-governed
   plan unless already authorized by a later gate.
6. Synthesis/retrieval candidate IDs such as `Y2-B6-P14`,
   `Y2-B7-P14`, and `Y2-B8-P16` must be preserved as
   bounded target markers for the approved official family, not treated as implicit lesson coverage for every prerequisite candidate.
7. `required_task_families` must remain proposal-level labels until a
   dedicated MTU/task-family review confirms they are not a complete OP-row family union and then compares them against the full OP-row
   family union, including `source_chain_builder` and `table_value_selection`
   where required.

## Explicitly Not Proposed

- No edits to `references/machine/*`.
- No edits to `references/external/*`.
- No generated lesson output.
- No operation-registry or answer-skill registry writes.
- No CP-6, Scale Gate, diagnostics, mastery, PV, summative, or student/product
  authority.

## Proof Required After Mutation

- Year 2/v6 candidate-surface schema validator passes.
- Active v5 Books 1-4 target-registry validator remains unchanged and green.
- Changed record IDs, owner IDs, and bounded marker IDs match this plan exactly.
- Source reconstruction blockers remain explicit until source artifacts exist.
- MTU/task-family blockers remain explicit until governed review closes them.
