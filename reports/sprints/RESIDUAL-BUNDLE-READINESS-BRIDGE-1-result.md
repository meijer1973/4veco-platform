# Residual Bundle Readiness Bridge 1 — Result

Status: implementation complete; exact-commit lead review and remote CI pending

## Result

The trusted lesson-first partial-resume lane can now construct current
integration-head readiness without requiring or fabricating a historical
controller payload-head readiness comment.

It also has a bounded trusted preparation phase, so a conflict-free base sync,
canonical generated-index refresh, and exact-pair CI can complete before the
required green dry run. Preparation stops before readiness publication,
reusable success status, merge, or post-merge CI.

The residual bridge requires an explicit machine-readable controller payload
lead review, validates the merged lesson's exact payload readiness and lead
proof, and recomputes a conservative L4 `READY_FOR_HUMAN_REVIEW` decision from
live PR facts plus exact authorization, compatibility, lineage, branch
protection, deterministic refresh, review, and CI evidence.

## Implemented controls

1. `--payload-lead-review <file>` accepts only schema version 1 records with a
   passing result, inspectable path, and exact repository, PR, bundle, and
   reviewed-payload identities.
2. The lesson review is obtained from the exact authorized lesson payload's
   existing readiness record; missing, stale, or mismatched lesson proof fails
   closed.
3. Dry-run mode canonically verifies the already-present index-only refresh,
   compatibility workflow provenance, exact-pair CI artifact coordinates, live
   review threads, and current heads/bases. It constructs the decision in
   memory, reports `would_create_exact_head_readiness`, performs no mutation,
   and stops at `validated_dry_run`.
4. A dry run cannot dispatch CI or create an index refresh. Missing or stale
   reusable evidence fails rather than becoming simulated success.
5. Live mode recomputes and publishes the current integration-head decision,
   re-fetches the exact comment, and requires its canonical decision digest,
   route, repository, PR, and head to match before final preflight and merge.
6. Head/base movement, substantive lineage, altered membership, wrong CI
   coordinates, invalid authorization, publication failure, malformed re-fetch,
   and unresolved review evidence remain fail-closed.
7. `--prepare-only` is restricted to a validated partial resume. It may update
   an exact behind branch and stop for retry, or create/reuse the canonical
   refresh and exact-pair CI before returning `prepared_integration_head`.
8. Preparation and dry-run are mutually exclusive. Repeated preparation is
   idempotent, and the required operational sequence is `prepare -> dry-run ->
   live`.
9. The hosted trusted-main workflow can carry the narrowly scoped payload lead
   JSON through runner-temporary storage and exposes the bounded preparation
   input. It does not infer review from bundle authorization and still cannot
   transport an integration-delta review.

## Regression coverage

- Positive residual partial-resume dry run and live publication/refetch/merge.
- Live restart reusing an already-pushed deterministic refresh descendant.
- Existing payload-readiness-backed path remains compatible.
- Initial preparation, repeated preparation, completely green dry-run reuse,
  and final live integration as one stateful sequence.
- Preparation branch-update retry, invalid mode/scope, exact-pair CI failure,
  and head/base movement after CI.
- Missing, non-passing, malformed, wrong-repository, wrong-PR, wrong-bundle,
  wrong-payload, and stale lesson review records.
- Missing/stale/wrong-coordinate exact-pair CI, including dry-run.
- Missing/tampered published readiness, publication failure, decision digest
  mismatch, and post-readiness head movement in both live and dry-run paths.
- Existing stale-head, base movement, substantive tail, lineage, authorization,
  compatibility, bundle membership, and thread-state regressions remain green.

## Validation

| Check | Result |
| --- | --- |
| Focused residual integrator + workflow/index-refresh tests | PASS: 3 suites, 119 tests |
| `npm.cmd run check:integration-lane` | PASS: 10 suites, 205 tests |
| `npm.cmd run check:pr-readiness` | PASS: 6 suites, 180 tests |
| Full `npm.cmd test -- --runInBand` with lesson `f09fd6e8...` | PASS: 104 suites, 1,486 tests; 6 suites and 8 tests skipped |
| Governance wording/freshness and scope language | PASS |
| Worktree ownership, JavaScript syntax, workflow YAML, `git diff --check` | PASS |

The first full run, before the exact lesson companion worktree was attached,
had one environment-only missing-fixture failure. The exact lesson-main rerun is
the authoritative full-suite result above.

## Authority boundary

This repair does not modify or merge Platform PR #208 and does not change the
Book 1/Y1 payload. It grants no merge authority. The governance PR must receive
independent exact-commit lead review, green exact-head remote CI, fresh
readiness evidence, and explicit human review before integration.

After this repair is independently merged, PR #208 still requires newly
generated compatibility evidence against the advanced platform `main`, trusted
preparation (including any conflict-free base sync and deterministic index
refresh), a completely green dry run, and a separate live trusted-lane
invocation under its existing bundle authorization.
