# Residual Bundle Readiness Bridge 1 — Planning Review

Date: 2026-08-27
Reviewer: `/root/repair_plan_review`
Mode: read-only structural planning review

## Verdict

`PASS WITH REQUIRED CLARIFICATIONS`

The repair is feasible without weakening the readiness router, but the residual path must not treat the human bundle authorization as lead review and must not fabricate a payload-readiness decision for the reviewed controller payload.

## Required design clarifications

1. Require an explicit machine-readable payload lead-review record bound to the bundle, controller repository/PR, and reviewed payload SHA. `PASS` or `PASS WITH FLAGS`, a non-empty review path, and all exact identities must be validated.
2. Obtain and validate the lesson payload lead proof from the already-existing exact lesson readiness record.
3. Keep the residual route conservatively fixed at `READY_FOR_HUMAN_REVIEW`; never downgrade it.
4. Run the same live evidence checks in dry-run mode. Dry-run suppresses mutations, not compatibility provenance, canonical index verification, exact-pair CI evidence, thread inspection, or head/base re-fetches.
5. Re-fetch a live-published exact-head readiness comment and require its canonical decision digest and target to match the just-recomputed decision.
6. Stop the dry-run after exact final preflight with a validation result; do not report a simulated merged bundle.

## Required negative coverage

- Missing, malformed, non-passing, stale, or identity-mismatched payload/lesson lead proof.
- Wrong compatibility provenance or exact member coordinates, including dry-run.
- Non-ancestor or substantive controller descendants; stale/tampered deterministic refresh.
- Missing, failed, or wrong-coordinate exact-pair CI, including dry-run.
- Publication failure, absent/malformed re-fetch, digest mismatch, and post-readiness head/base movement.
- Altered authorization or bundle membership and unresolved/unavailable review evidence.

## Disallowed shortcuts

- Mapping `APPROVE_BUNDLE_AND_MERGE` to lead-review `PASS`.
- Discovering arbitrary `PASS` files from the candidate branch.
- Reusing an old readiness marker as if it covered the current integration head.
- Making dry-run green with simulated compatibility, refresh, or CI evidence.

## Disposition

Accepted into the implementation plan. The hosted workflow will transport the explicit lead-review JSON to trusted-main code through runner-temporary storage, mirroring the existing explicit delta-review boundary; the integrator will validate every semantic binding before using it.
