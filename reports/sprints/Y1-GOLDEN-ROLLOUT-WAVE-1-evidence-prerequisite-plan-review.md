# Y1-GOLDEN-ROLLOUT-WAVE-1 Evidence Prerequisite Plan Review

Reviewed: 2026-08-27

Reviewer: `/root/repair_plan_review`

## Round 1 verdict

REVISE

## Round 1 findings

1. The plan did not use the canonical headings and matrix columns required by
   `check-sprint-plan.js`.
2. The proposed commit sequence could bind a payload before substantive lead
   corrections and then append implementation changes after that binding.
3. Outputs were class-based rather than an exact path allowlist, and the plan
   lacked a per-artifact source-provenance manifest and complete negative
   lineage/blob/path/hash cases.
4. The previous fail-closed requirements were not explicit enough for the exact
   14-key authority object, selector/capture settings, screenshot/diff/manifest
   cross-bindings, changed dependency, and first-viewport limitation.
5. The remote closure rule did not enumerate every post-Y1 CI stage.

## Corrections

- Added every canonical heading and exact fulfilment-matrix column; the plan now
  passes `node build-scripts/sprints/check-sprint-plan.js`.
- Replaced the unsafe sequence with:
  `9c9 base -> provisional implementation -> corrected substantive payload P ->
  round-2 review of P -> evidence-only terminal head H -> exact-head CI and
  readiness at H`.
- Added the complete path-level mutation allowlist and an exact source-manifest
  contract for unchanged and adapted artifacts.
- Separated and fully specified historical provenance
  `8f612ac... -> 4b49d82... -> aa06ada...` from current lineage
  `9c9d3cc... -> P -> H`, including fail-closed rejection of PR #208 SHAs in
  current binding roles.
- Enumerated negative tests for source objects/lineage/blob/path/hash, current
  lineage and tails, changed dependency counts/paths, selector and canonical
  settings, image/pixel/diff/manifest/inspection drift, first-viewport wording,
  and exact 14-key all-false authority semantics.
- Enumerated all nine post-Y1 workflow stages which must execute and pass at the
  exact remote head.

## Round 2 verdict

PASS — all five round-1 findings are closed. Implementation may begin within
the corrected plan and exact path allowlist.
