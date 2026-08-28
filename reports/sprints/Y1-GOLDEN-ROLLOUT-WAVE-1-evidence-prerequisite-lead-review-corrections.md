# Y1 Golden Evidence Prerequisite Lead Review — Round 1 Corrections

Recorded: 2026-08-27

## Correction status

All four round-1 findings are addressed in the corrected substantive payload
that contains this record. Terminal P-bound proof, packet, and result records
remain deliberately deferred until after this payload is frozen.

## Corrections

1. `Y1-PREREQ-R1-PATHS` — closed.
   - Replaced inherited initial-scope entries with the plan's exact 38-path
     mutation inventory.
   - Removed all trigger and allowed prefixes.
   - Replaced the P..H wildcard prefixes with an exact evidence-tail inventory.
   - Added negative coverage for workflow, package, URL-emitter, roadmap,
     root-map, old-plan, and arbitrary same-prefix paths.
2. `Y1-PREREQ-R1-AUTHORITY` — closed.
   - Added an exact 16-key wave/proof/packet/result authority inventory.
   - Every value must be false, including
     `protected_reference_data_changed`.
   - Added missing, added, renamed, protected-reference, and true-value
     regressions across the wave, proof, packet, and result surfaces.
3. `Y1-PREREQ-R1-RESULT` — closed.
   - Added a terminal result validator.
   - It cross-binds source provenance and current base/payload/lesson evidence
     to the delta proof, proof, and packet.
   - It requires exactly one changed dependency, one verified renewal, zero
     unresolved inputs, first-viewport-only scope, no below-fold attestation,
     and exact authority holds.
   - Added stale-SHA, path/count, unresolved, viewport, and authority negatives.
4. `Y1-PREREQ-R1-MANIFEST` — closed.
   - The source manifest now requires exact array length and unique artifact IDs
     before per-record validation.
   - Added duplicate-with-extra, duplicate-within-count, and extra-ID tests.

## Pre-terminal generator alignment

The first round-2 lifecycle check showed that the canonical URL-index generator
links to the Y1 gate bundle, while the checker also demanded direct URL-index
entries for the source manifest and visual review. The gate bundle already
contains and validates those direct artifact URLs. The checker now accepts that
canonical indirection and retains direct manifest/visual-review requirements in
the bundle itself. A positive regression covers the generated topology. Because
this changed the checker after the first candidate payload, that candidate was
invalidated and round 2 must review the replacement substantive payload.

## Verification before payload freeze

- JavaScript syntax checks pass for checker and tests.
- The wave JSON parses and its exact path policy validates.
- The focused suite passes every substantive unit and negative regression; the
  single full-mode test remains expected to fail until the terminal records are
  rebound to the newly frozen payload.
- Imported screenshots were not modified, so the independent visual review
  remains applicable.

Round 2 must inspect the exact corrected payload after its SHA is frozen and
must not treat this correction record as merge authorization.

## 2026-08-28 human-review correction

`Y1-PREREQ-FUTURE-CI-TRIGGER` — closed in the replacement substantive
payload pending exact-head review and CI.

- Split the changed-path policy into a 31-path Y1-specific trigger inventory
  and the existing 38-path exact allow inventory.
- Kept the URL index, four agent indexes, and two internal-dashboard outputs in
  `allowed_exact`, while removing all seven from `trigger_exact`.
- Added a regression for every shared closure path mixed with unrelated
  integration work.
- Added exact PR #215-shaped 17-path histories for both `pull_request` and
  `main_push`; neither activates the renewal scope.
- Extended the genuine Y1-trigger plus unrelated-work rejection to both event
  modes, preserving fail-closed behavior.
- Corrected the stale replacement-PR #214 instruction to corrected PR #216.
- Did not modify screenshots, rendered-renewal evidence, historical provenance,
  Lesson, product, engine, source-data, protected references, PR #208, or PR
  #215.

Focused validation passes 80/80 tests. The full local suite, P-bound evidence
rebinding, independent lead review, exact-head CI, and readiness remain required
before the PR may leave draft again.
