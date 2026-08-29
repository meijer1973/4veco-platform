# Bundle Lane CI Reliability — Lead Review Assignment

Date: 2026-08-29
Reviewer: `/root/residual_bridge_lead_review`
Mode: independent read-only structural lead review
Repository: `meijer1973/4veco-platform`
Pull request: `#217`
Base commit: `11c7a0286776064a694efa4e3cc9e91b4e62fa5c`
Substantive commit: `ce4f77d710431b29c4d2a1d589ebb2942953cf1d`

## Review scope

- Verify the repair implements the exact authorized automatic-push-first and
  exact-input fallback contract without changing PR #208 or any product/Y1
  payload.
- Verify queued/running automatic CI cannot trigger a duplicate, while absence
  alone may dispatch one fallback newer than a captured floor.
- Verify the real `gh workflow run` argument vector carries full exact
  `y1_base_sha` and `y1_head_sha` values.
- Verify transition ranges for lesson-first, platform-first, residual, and
  unchanged-Platform Lesson-only states, including ancestry or identity.
- Verify automatic and fallback evidence bind the exact Platform/Lesson SHAs
  and fail closed for red, stale, wrong-event, wrong-coordinate, or timed-out
  runs.
- Verify every returned failure after a completed merge is classified
  `merged_but_postmerge_verification_failed` with the original subphase,
  diagnostics, and completed merge records, while pre-merge phases remain
  unchanged.
- Verify the delta-required dry-run exception remains fail-closed and the
  policy describes it accurately.
- Inspect the entire diff for unintended workflow, Lesson, product, engine,
  source-data, Y1 evidence, protected-reference, authorization, or authority
  changes.

## Required independent tests

Run at least the focused bundle-integrator suite and `git diff --check` from the
substantive commit. Add any targeted test or static inspection needed to
challenge the state machine. Do not edit the branch.

## Required output

Return `PASS`, `PASS WITH FLAGS`, or `REVISE`; bind the verdict to
`ce4f77d710431b29c4d2a1d589ebb2942953cf1d`; cite concrete file/line evidence;
separate blocking and non-blocking findings; record independent commands and
results; and restate that human merge authorization remains required.
