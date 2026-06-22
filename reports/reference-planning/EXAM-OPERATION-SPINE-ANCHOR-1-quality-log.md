# EXAM-OPERATION-SPINE-ANCHOR-1 Quality Log

Status: REV-STD-1 quality log

| ID | Classification | Severity | Status | Finding | blocks | does_not_block | proof_required_to_close |
|---|---|---:|---|---|---|---|---|
| EXOP-001 | core_requirement_met | high | met | Every v6 operation row has an anchor status. | Nothing for matrix review | Official closure, product use | Preserve `EXAM-OPERATION-SPINE-ANCHOR-1-anchor-matrix.md`. |
| EXOP-002 | core_requirement_met | high | met | Official prompt/source/model anchors are cited or marked missing/partial. | Nothing for matrix review | Official operation closure | Complete operation-specific prompt, source-annex, and correction-model overlays. |
| EXOP-003 | core_requirement_met | high | met | Target-exercise anchors are cited or marked missing/partial. | Nothing for matrix review | Paragraph target production | Reviewed target-exercise packets for partial/missing rows. |
| EXOP-004 | core_requirement_met | high | met | MTU and task-family support is cited without mutation. | Nothing for matrix review | MTU minting or product reliance | Governed CLI/machine-review lane if new MTUs are needed. |
| EXOP-005 | core_spec_failure | high | open | No operation row has strict complete official exam closure. | Official exam-operation closure and production reliance | Evidence planning, target-side safe mapping awareness | Operation-specific CvTE prompt, source-annex, correction-model, and review trace. |
| EXOP-006 | core_spec_failure | high | open | Year 2/3 and several answer-form rows lack reviewed target-exercise anchors. | Year 2/3 paragraph production and target-finality claims | Book-level route planning | Y2/Y3 mapping and later target-candidate review packets. |
| EXOP-007 | core_spec_failure | medium | open | Several rows have stale, held, broad, or missing MTU/task-family support. | Production reliance on those operation rows | Identifying the blocker | MTU/task-family proof or registry review for each blocked row. |
| EXOP-008 | scale_blocker | critical | open | Product/Scale/student-use authority remains blocked. | Product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV, summative, student/product use | Evidence matrix and ordinary scoped planning | Separate product-proof and Scale/CP gates. |
| EXOP-009 | quality_improvement_available | medium | open | `Q3`, `Q15`, and `Q19` pilot evidence should be promoted or closed only through later governed exam-ingestion work. | Using pilot records as official closure | Citing them as partial evidence | Reviewed exam-ingestion closure packet with gaps resolved. |

## Carried Issues

`EXOP-005`: missing complete official exam anchors.

- blocks: official exam-operation closure, operation-spine production reliance.
- does_not_block: matrix publication for human review.
- proof_required_to_close: operation-specific prompt, source-annex,
  correction-model, answer-model, and review trace.

`EXOP-006`: missing or partial target-exercise anchors.

- blocks: Year 2/3 paragraph production and target-finality claims.
- does_not_block: book-level planning and future mapping preparation.
- proof_required_to_close: reviewed target-exercise packet for each row.

`EXOP-007`: MTU/task-family blockers.

- blocks: production reliance on blocked rows.
- does_not_block: identifying blocker classes and routing next work.
- proof_required_to_close: governed MTU/task-family review or proof, without
  unauthorized machine mutation.

`EXOP-008`: downstream authority remains blocked.

- blocks: product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV,
  summative use, student/product use.
- does_not_block: evidence classification.
- proof_required_to_close: separate REV-STD-1 product-proof and Scale/CP gates.
