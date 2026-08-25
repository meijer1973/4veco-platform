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

The final fresh staged result recorded 36 tests passed and 1 expected pre-payload
failure (37 total) because the still-historical proof did not yet contain the
rendered-renewal path. A filtered diagnostic confirmed all other 36 tests pass.
Full focused closure must be green after the substantive payload SHA is
committed and the commit-bound proof is regenerated.
