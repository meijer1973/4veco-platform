# B1-GRAPH-EVIDENCE-113-ALIGNMENT-REPAIR-1 Plan

Date: 2026-06-15

Goal: repair the `1.1.3` graph/table metadata/proof mismatch identified by
`B1-GRAPH-EVIDENCE-113-CLOSURE-1`, then prepare renewed human review for
target-equivalent closure.

## Product End-State And Original Spec

Product end-state: the first-three student path keeps advisory `Korte check`
and target-equivalent `Exit ticket` surfaces separate. Target-equivalent proof
must require real student work, be rendered and inspectable, and avoid
product/diagnostic/mastery authority until human review explicitly authorizes
it.

Original sprint/gate spec:

- `reports/reference-planning/B1-MIGRATED-V5-TARGET-QUALITY-1-review-packet.md`
  records the reviewed-final `1.1.3` registry mapping as `A38`, `A45`, and
  `A46`.
- `reports/sprints/CHECK-SHORT-EXIT-2-plan.md` defines the advisory short-check
  and target-equivalent exit-ticket roles.
- `reports/sprints/CHECKSURFACE-GATE-RETRY-EXCELLENT-1-plan.md` and
  `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/gate-closure.json`
  close only the check-surface gate and hold downstream authority.
- `reports/reference-planning/B1-GRAPH-EVIDENCE-113-CLOSURE-1-review-packet.md`
  records the non-closure finding this repair addresses.

## Non-Negotiable Requirements

1. Align `1.1.3` source metadata to `A38`, `A45`, and `A46`.
2. Update both `1.1.3-korte-check.json` and `1.1.3-exit-ticket.json`.
3. Preserve advisory `Korte check` versus target-equivalent `Exit ticket`
   separation.
4. Do not flip `gateApproved`, `targetReadinessEvidence`, or
   `completionLanguageEligible` to true in this repair.
5. Refresh rendered/check-surface proof from generated output.
6. Do not claim Year 1, CP-6, Scale Gate, product-route, diagnostics, mastery,
   PV, or student/product-use authority.

## Work Plan

1. Update the two `1.1.3` source-data files from `A38/A61/A63` to
   `A38/A45/A46`.
2. Regenerate the Book 1 `1.1.3` shared output from current lesson `main` for
   rendered proof.
3. Refresh graph/check-surface proof JSON and screenshots.
4. Run graph/check-surface validators and repository hygiene checks.
5. Publish a REV-STD-1 packet that requests human review for the next closure
   decision.

## Out Of Scope

- Target registry edits.
- Machine reference edits.
- Automatic target-equivalent closure.
- Automatic completion-language eligibility.
- Year 1, CP-6, Scale Gate, product-route, diagnostics, mastery, PV, or
  student/product-use authority.

