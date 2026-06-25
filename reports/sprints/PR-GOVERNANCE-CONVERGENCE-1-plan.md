# PR-GOVERNANCE-CONVERGENCE-1 Plan

Status: repair plan for PR #149.

## Objective

Converge active PR-readiness governance so implementation agents automatically
apply valid draft-ready transitions while owner authorization remains a merge
gate bound to reviewed payload lineage.

## Scope

- Make `route-and-apply:pr-readiness` operational with explicit supplemental
  proof and expected-transition failure semantics.
- Make finalization freshness query remote `main`, compare local tracking state,
  record ancestry, and hash both branch and remote-main policy surfaces.
- Expand active governance wording checks across active agent instructions,
  commands, skills, and sibling lesson instructions.
- Refresh GitHub-facing maps and generated indexes for the new entry points.

## Out Of Scope

- No new service identity, bypass ruleset, or autonomous merge path.
- No change to branch protection requirements.
- No paired-bundle redesign beyond wording and map convergence.

## Closure Criteria

- Focused readiness, integration-lane, wording, freshness, report, and index
  checks pass.
- Remote `validate-platform` passes on the repaired PR head.
- Independent lead review passes on the implementation SHA.
- `route-and-apply:pr-readiness` promotes PR #149 with
  `--expect-transition MARK_READY` using explicit evidence.
