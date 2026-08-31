# GATE-SINGLE-PR-DRY-RUN-REPAIR-1 — Human Review Packet

## Decision requested

Review PR #220 as a bounded trusted single-PR governance repair. The requested
decision is whether the exact terminal head may enter the trusted serialized
single-PR integration lane. This packet does not authorize merge by itself.

## Reviewed payload

- Platform base: `e6103d3127780d59b36410c2dbccf86314b10dd1`
- Corrected substantive head: `57757b15c5c1b4c849894ad2ec303acb809d7017`
- Rejected intermediate: `8211c4838c52ede6a4d39842928abb7007d673c3`
- Lesson companion: `f09fd6e88edc5049b026b16b0158e7e188091d2d`
- Pull request: `https://github.com/meijer1973/4veco-platform/pull/220`

The terminal head may contain only the reviewer-approved mechanical evidence,
URL/map and deterministic index tail on top of the reviewed substantive head.

## Core requirements

1. Plain `--dry-run` is the canonical read-only single-PR preflight.
2. A ready current head returns `validated_dry_run` with truthful non-execution
   reporting and no synthetic merge state.
3. A behind head reports exact would-update coordinates without mutation,
   polling or refreshed-head claims.
4. Movement and missing exact-head CI fail closed in one attempt.
5. Plain and compatibility-form dry runs are result-equivalent.
6. Existing live-lane behavior remains unchanged.
7. Only the two canonical internal-dashboard closure outputs receive shared
   classification; neighboring report paths remain fail-closed.
8. Exactly five raw-byte-hashed Y1 renewal text artifacts are pinned and
   scanned as LF by the general CI line-ending gate; every sealed Y1
   checker/test/evidence blob remains unchanged.

## Review evidence

- `reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-result.md`
- `reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-diff-summary.md`
- `reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-round1.md`
- `reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-corrections.md`
- `reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-round2.md`
- `reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-lead-review-ci-portability-renewal.md`
- `reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-command-log.jsonl`

Hosted run `33307624508` at `c751f26a...` failed because Windows checkout
converted the raw manifest to CRLF. `8211c483...` was rejected because it
changed the manifest-bound Y1 test. The reviewed correction restores that
sealed blob and moves the regression to the general CI line-ending gate.

## Authority boundary

No Lesson, textbook, product, engine, source-data, rendered-output, Y1
checker/test/evidence payload,
protected-reference, workflow-definition, coordinated-bundle runner,
authorization-model, rollout, completion, diagnostics, mastery, sequencing, PV,
summative, student-use or product-use authority is included. Administrative
bypass is prohibited.

## Required remote proof

Before integration authorization, require exact-head green Platform CI against
Lesson `f09fd6e8...`, exact-head PR readiness, zero unresolved review threads,
unchanged base/head identity, and explicit owner payload authorization.
