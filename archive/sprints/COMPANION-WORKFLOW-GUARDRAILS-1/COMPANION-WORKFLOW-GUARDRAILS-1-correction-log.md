# COMPANION-WORKFLOW-GUARDRAILS-1 Correction Log

## Plan Review Round 1

Reviewer verdict: REVISE.

Blocking findings addressed:

1. PR / human-review workflow was named but not operationalized.
   - Fix: added `PR And Human-Review Workflow` with branch/worktree safety,
     `git fetch --prune origin`, map/index refresh decision, commit/push, draft
     PR, PR lead-review packet, CI/waiver reporting, and human-review handoff.
2. Historical 24-file conflict proof was too thin.
   - Fix: added a targeted historical proposal check for 24-file wording and the
     required historical-note/active-contract pointer.
3. Lead-review evidence files and correction-log outputs were underspecified.
   - Fix: added `Lead-Review Artifacts` section naming plan, work, PR review,
     correction log, validation log, and human-review handoff paths.

Proof required:

- Plan review round 2 returns OK/PASS.

## Plan Review Round 2

Reviewer verdict: REVISE.

Blocking findings addressed:

1. Missing required worktree/branch safety preflight.
   - Fix: added explicit `git fetch --prune origin`, `git status --short --branch`,
     `git branch --show-current`, and `check:agent-worktree-safety` command
     requirements. The plan uses `--check` for this already-dirty in-progress
     task and documents the stricter `--claim --require-clean` form for future
     fresh mutating runs.
2. CI-pending was allowed as human-review handoff proof.
   - Fix: changed PR/human-review workflow and proof requirements to require a
     passing `platform-ci / validate-platform` result for the reviewed commit or
     an explicit CI waiver. Plain CI-pending is no longer sufficient.

Proof required:

- Plan review round 3 returns OK/PASS.
