# EXAM-OPERATION-SPINE-ANCHOR-1 Plan

Status: high-authority evidence-classification sprint

## Product End-State And Original Specs

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`

Original sprint/gate/source specs:

- `references/owned/course-blueprint-v6-three-year.md`
- `references/owned/course-blueprint-v6-three-year.meta.json`
- `reports/review-gates/BLUEPRINT-V6-AUTHORITY-PROMOTION-1/review-packet.json`
- `reports/reference-planning/BLUEPRINT-V6-AUTHORITY-PROMOTION-1-review-packet.md`
- `reports/sprints/BLUEPRINT-V6-AUTHORITY-PROMOTION-1-result.md`

## Goal

Turn the v6 exam-operation spine from owned book-level planning into a reviewed
anchor-status matrix tied to actual repository evidence. The sprint classifies
every operation row from `OP-A1` through `OP-ANS3` by official exam evidence,
target-exercise anchor, MTU support, answer-form/task-family support, and
production readiness.

This sprint does not create paragraphs, target exercises, MTUs, generated
lessons, product routes, or protected-reference mutations.

## Non-Negotiable Requirements

1. Every v6 operation row must receive a status.
2. Official exam prompt, source-annex, and correction-model anchors must be
   cited when present and marked missing when absent.
3. Target-exercise anchors must be cited when present and marked missing or
   partial when absent or still under review.
4. MTU and task-family support must be cited without mutating
   `references/machine/*`.
5. Rows marked `decomposition_needed` in v6 must not be allowed into paragraph
   production.
6. Year 2/3 paragraph target creation remains blocked.
7. Product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV,
   summative use, student/product use, and generated lesson output remain
   false.
8. REV-STD-1 classification must include `blocks`, `does_not_block`, and
   `proof_required_to_close` for carried issues.
9. `PASS WITH FLAGS` must not carry a missing core requirement.

## Deliverables

- `reports/reference-planning/EXAM-OPERATION-SPINE-ANCHOR-1-anchor-matrix.md`
- `reports/reference-planning/EXAM-OPERATION-SPINE-ANCHOR-1-evidence-packet.md`
- `reports/reference-planning/EXAM-OPERATION-SPINE-ANCHOR-1-subagent-review.md`
- `reports/reference-planning/EXAM-OPERATION-SPINE-ANCHOR-1-quality-log.md`
- `reports/reference-planning/EXAM-OPERATION-SPINE-ANCHOR-1-review-packet.md`
- `reports/review-gates/EXAM-OPERATION-SPINE-ANCHOR-1/review-packet.json`
- `reports/sprints/EXAM-OPERATION-SPINE-ANCHOR-1-result.md`

## Required Review Roles

- Exam-evidence reviewer.
- Target-exercise reviewer.
- MTU/task-family reviewer.
- Downstream-authority reviewer.

## Acceptance Criteria

- Every v6 operation row has an explicit status.
- Official exam anchors are cited or explicitly missing.
- Target-exercise anchors are cited or explicitly missing/partial.
- Decomposition rows remain blocked from paragraph production.
- The next Year 2/3 mapping work knows which rows are target-side safe and
  which remain blocked.
- Product/Scale/diagnostics/mastery/PV/student-use authority remains false.
- Review-throughput and platform validation pass.
