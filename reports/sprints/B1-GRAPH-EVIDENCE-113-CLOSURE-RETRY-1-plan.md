# B1-GRAPH-EVIDENCE-113-CLOSURE-RETRY-1 Plan

Date: 2026-06-16

## Purpose

Start the renewed human review lane for `1.1.3` graph/table
target-equivalent evidence after the alignment repair bundle merged:

- Platform PR #76, merge commit `2d8a16a4`.
- Lesson PR #17, merge commit `efc4fc2`.

This sprint does not assume closure. It assembles the refreshed proof and asks
human review to decide the three held flags explicitly:

- `gateApproved`
- `targetReadinessEvidence`
- `completionLanguageEligible`

## Product End-State And Original Spec

Product end-state: advisory `Korte check` and target-equivalent `Exit ticket`
surfaces remain separate. Target-equivalent proof must require real student
work, be rendered and inspectable, and avoid product, diagnostic, mastery, PV,
Scale Gate, or student/product-use authority unless later gates authorize it.

Original sprint/gate spec:

- `reports/reference-planning/B1-MIGRATED-V5-TARGET-QUALITY-1-review-packet.md`
- `reports/sprints/CHECK-SHORT-EXIT-2-plan.md`
- `reports/sprints/CHECKSURFACE-GATE-RETRY-EXCELLENT-1-plan.md`
- `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/gate-closure.json`
- `reports/reference-planning/B1-GRAPH-EVIDENCE-113-CLOSURE-1-review-packet.md`
- `reports/reference-planning/B1-GRAPH-EVIDENCE-113-ALIGNMENT-REPAIR-1-review-packet.md`

## Non-Negotiable Requirements

1. Treat the reviewed-final `1.1.3` mapping as `A38/A45/A46`.
2. Confirm the evidence covers P vertical, Q horizontal, table-to-graph
   construction, graph reading/interpolation, and source-claim checking.
3. Confirm generated lesson output is merged and matches platform source
   metadata.
4. Decide `gateApproved`, `targetReadinessEvidence`, and
   `completionLanguageEligible` explicitly; no implicit closure.
5. Do not infer Year 1, CP-6, Scale Gate, product-route, diagnostics, mastery,
   PV, or student/product-use authority.

## Work Items

1. Review current `1.1.3` source metadata and generated lesson output.
2. Review refreshed proof JSON and screenshots.
3. Prepare a REV-STD-1 closure-retry packet and quality log.
4. Keep source authority flags unchanged until human review returns a verdict.
5. Run focused graph/check validators and packet/report checks.

## Acceptance Criteria

- Closure retry packet cites product end-state and original specs.
- Core-requirement checklist distinguishes met evidence from proof still
  required to close.
- Findings are classified and include `blocks`, `does_not_block`, and
  `proof_required_to_close`.
- Machine-readable review packet uses L4 / human decision required.
- No source-data authority flag is flipped by this preparation sprint.

