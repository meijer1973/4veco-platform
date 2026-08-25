# BUNDLE-INTEGRATION-DELTA-REVIEW-BRIDGE-1 plan

## Objective

Repair the trusted partial-resume bundle lane so a current integration head can
be reviewed without replacing or weakening the immutable review of the
owner-authorized payload.

The observed failure occurred before merge while resuming bundle
`COMPANION-ROUTE-CONSISTENCY-20260813-1`. The platform payload review remained
bound to `4b4ad45bb2454f9b7f69169a75dc0c0c83f8e9a2`, while base synchronization and
the terminal index refresh produced integration head
`3c9e214c7cbe90958a3cb938c3de437468c8331c`. The readiness router correctly
rejected the stale single-review representation.

## Quality floor

- Keep the original payload lead review immutable and exact.
- Require a separate passing review for the exact integration head whenever
  lineage or base-drift classification requires one.
- Validate both review bindings before publishing readiness or attempting a
  merge.
- Fail closed for missing, non-passing, mismatched, malformed, or unexpected
  delta-review evidence.
- Preserve all existing authorization, lineage, compatibility, CI, refresh,
  branch-protection, and merge controls.

## Requirements

1. Store the integration-head review under
   `proof.integration.delta_review`; do not rewrite `proof.lead_review`.
2. Bind the delta review to both the reviewed payload SHA and the exact
   integration-head SHA.
3. Extend machine-decision validation and the decision schema so evidence and
   rendered decisions cannot diverge.
4. Accept a local review record through an explicit trusted-lane CLI option.
5. State that the hosted workflow cannot transport this local review file and
   must stop for the owner-run local lane when the review is required.
6. Add regression coverage for valid dual binding and every fail-closed case.

## Procedure

1. Reproduce and preserve the original fail-closed lane result without merging.
2. Add the local `--delta-review` input and validate it before readiness review
   or publication.
3. Teach the readiness router to treat a valid dual review as current while
   retaining the payload review SHA.
4. Extend schema, documentation, workflow-contract checks, and focused tests.
5. Run focused lane/router tests, integration-lane checks, readiness checks,
   policy freshness checks, and the full repository suite.
6. Commit the substantive implementation and submit that exact commit to Rawls.
7. Resolve every Rawls finding and repeat review until the exact commit receives
   `OK`.
8. Add the review record, regenerate repository indexes as the terminal commit,
   push, open a draft PR, and complete exact-head CI, Rawls PR review, and PR
   Readiness.

## Evidence

- Regressions proving the valid dual-review partial-resume route is ready.
- Negative tests for absent evidence, wrong payload, wrong integration head,
  non-passing verdict, missing path, unexpected evidence, schema tampering, and
  decision tampering.
- Static proof that only the local lane accepts `--delta-review` and the hosted
  lane retains its fail-closed boundary.
- Passing exact-head CI and repository checkers.
- Rawls reviews bound to the substantive commit and terminal PR head.

## Review gate

Rawls is the lead reviewer. The plan, substantive implementation commit, and
terminal PR head each require `OK`. A `REVISE` result returns to implementation
and a new exact review round.

## Stop conditions

- Any repository tip, authorization member, compatibility member, or reviewed
  payload moves unexpectedly.
- Any test shows payload review replacement, authorization weakening, or merge
  execution before delta-review validation.
- Rawls reports a blocking finding.
- Exact-head CI or PR Readiness is not current and green.

## Higher-quality additions

Improve fail-closed diagnostics by reporting both attested and classified
readiness bindings and the classifier reason codes.

## Explicitly omitted

This sprint does not merge the bridge PR or PR #198 without the required human
authorization. Resuming PR #198 remains follow-up work after the bridge is
integrated and platform `main` CI passes.
