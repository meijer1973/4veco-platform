# Canonical Single-PR Dry Run — Lead Review Assignment

Date: 2026-08-30
Sprint: `SINGLE-PR-DRY-RUN-REPAIR-1`
Lead reviewer: `/root/residual_bridge_lead_review`
Mode: independent read-only structural lead review
Repository: `meijer1973/4veco-platform`
Pull request: `#220`
Base commit: `e6103d3127780d59b36410c2dbccf86314b10dd1`
Round-1 substantive commit: `870aa3f228eb7289f9ef63dcd3394b5d309c5413`

## Review scope

- Verify plain `--dry-run` is the canonical read-only pre-merge validation
  mode and cannot reach branch updates, retry polling, status/comment/readiness
  publication, CI dispatch, merge invocation, merge observation, containment,
  or post-merge CI.
- Verify a clean current head returns `validated_dry_run` with an exact and
  truthful operation report instead of a synthetic merge or post-merge state.
- Verify a stable behind head reports the exact would-update coordinates and
  stops before refreshed-head CI/readiness claims or mutation.
- Verify main/head movement and missing exact-head CI remain fail-closed in one
  read-only attempt with retry recommendation but no automatic polling.
- Verify plain `--dry-run` and the temporary `--dry-run --no-merge`
  compatibility form have equivalent results.
- Verify every pre-existing live-lane path remains unchanged in behavior.
- Inspect the entire diff for unintended bundle-runner, workflow, Lesson,
  product, engine, source-data, Y1, protected-reference, authorization-model,
  authority, or merge changes.

## Required independent tests

Run at least the focused single-PR integrator suite and `git diff --check` from
the substantive commit. Add any targeted static or adversarial inspection
needed to challenge dry-run non-mutation and unchanged live behavior. Do not
edit the branch.

## Required output

Return `PASS`, `PASS WITH FLAGS`, or `REVISE`; bind the verdict to
`870aa3f228eb7289f9ef63dcd3394b5d309c5413`; cite concrete file/line evidence;
separate blocking and non-blocking findings; record independent commands and
results; and restate that exact-head CI, readiness, human review, and explicit
merge authorization remain required.
