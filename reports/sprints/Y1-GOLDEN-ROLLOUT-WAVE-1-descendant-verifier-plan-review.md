# Independent descendant-verifier planning review

Reviewer: `entry_rule_review`. Date: 2026-09-08.
Reviewed plan: `Y1-GOLDEN-ROLLOUT-WAVE-1-descendant-verifier-plan.md`.

Round 1: **REVISE**. Two bounded gaps required correction before implementation:

1. Specify immutable historical/source bindings separately from current semantic
   npm/workflow wiring. Future unrelated commits, npm scripts and workflow steps
   must remain valid; lesson57 is an initial observation, not a static current ref.
2. Specify source commit P, deterministic certificate generation, evidence head H,
   and exact-H review/CI. Hash committed source objects with an explicit inventory;
   avoid self-reference and active CLI binding bypasses.

The implementing agent added the binding contract, sealing sequence, exact record
inventory, future-head behavior and the corresponding regression requirements.
The sprint-plan checker then passed.

Round 2: **PASS**. The independent reviewer confirmed that both findings are
resolved. Stable source binding permits unrelated future changes and sealing
preserves historical proof without self-reference. The constrained canonical
workflow-block comparison is acceptable if ambiguous or duplicate structures fail
closed; implementation review must verify that comments or other blocks cannot
substitute for the active step and that conditions, arguments and checkout drift
are rejected.

The reviewer authorized proceeding within the amended implementation scope.
This is a planning verdict only. Implementation review, complete current-pair CI,
independent readiness and explicit owner payload authorization remain required.

Normalization amendment: **PASS** by `entry_rule_review`. Extend the existing
platform `checkout-index` operation to all tracked files before validation,
protect its full semantic content and ordering, and retain strict runtime byte
acceptance. Test forced LF restoration and binary preservation; treat the cause
of CI's byte mismatch as unconfirmed until evidence establishes it. Diagnostics
must not accept CRLF-only equivalence. New source sealing and exact-head review
and CI remain mandatory.

Checkout-attribute amendment: **PASS** by `entry_rule_review` after one correction.
The reviewer reproduced CRLF retention in an aged, stat-clean index through both
reset and forced checkout. Add finite exact LF attributes, bind their reviewed
provenance, and check their committed semantics in an isolated object-backed Git
context. `check-attr --source` alone is insufficient because uncommitted info or
global attributes can mask missing committed rules; independent reproduction
confirmed this gap. Empty external configuration, no templates, a clean child
environment, verified temporary cleanup and masking regressions close it.
The source-bound builtin-only early inspector and protected execution immediately
after Node setup are approved. Strict final byte checks and historical blobs
remain unchanged. New source sealing, full CI and implementation review follow.
