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

## PR Review Round 1

Reviewer verdict: REVISE.

Blocking findings to address:

1. PR workflow packet was local only and not yet part of the remote PR.
   - Fix: add the PR workflow packet and PR review evidence to the branch,
     update the reviewed commit SHA after final push, and re-review.
2. PR was merge-conflicting with current `main`.
   - Fix: update from `origin/main`, resolve conflicts preserving both main
     authority and this sprint's guardrail fixes, regenerate indexes, and rerun
     validation.
3. CI was not sufficient for human review.
   - Fix: after the final reviewed commit is pushed, require passing
     `platform-ci / validate-platform` or an explicit CI waiver before the
     human-review handoff.

Proof required:

- PR review round 2 returns OK/PASS after conflict resolution and validation.

Fixes implemented:

- Added and committed the PR workflow packet plus PR review round 1 evidence.
- Merged current `origin/main`, resolved companion workflow conflicts, and
  preserved both `main`'s PDF lane-boundary clarification and this sprint's
  full student-web surface/profile wording.
- Regenerated the platform GitHub agent index, restored lesson-index files to
  `origin/main` because lesson inventory is outside this sprint, and reran the
  focused validation set.
- Kept the human-review handoff blocked pending final PR review and
  `platform-ci / validate-platform` pass or explicit CI waiver.
