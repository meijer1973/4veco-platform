# Y1-GOLDEN-ROLLOUT-WAVE-1 Evidence Renewal Lead Review Corrections

Corrected: 2026-08-25

Responds to:
`reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-evidence-renewal-lead-review-round1.md`

## Corrections

1. The checker now rejects every unresolved rendered input while building the
   delta proof. Packet/proof validation requires one raw changed input, one
   verified renewal, zero unresolved inputs, reusable screenshots, no pending
   recapture, one replacement capture, and one exact-equivalence result, and it
   cross-binds the proof counts to the delta summary.
2. The renewal now requires an exact fourteen-key held-authority set covering
   lesson, merge, engine, source-data, protected-reference, rollout/adoption,
   product-route, student/product-use, completion, diagnostics,
   mastery/sequencing, adaptive routing, summative use, and PV.
3. Focused regressions reject an unresolved delta even when packet/proof counts
   are made consistent, and reject required authority-key substitution.

Post-payload closure is green: all 42 focused tests pass after the substantive
payload commit and commit-bound proof regeneration. The added lineage cases
prove that the authorized pre-renewal event range scopes at `e2deb65...`, later
events retain their full range, and divergent heads fail closed. Selector
provenance is read from its committed Git object, so worktree line-ending
normalization cannot invalidate the evidence binding.
