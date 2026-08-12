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
  student-web validator-profile wording.
- Regenerated the platform GitHub agent index, restored lesson-index files to
  `origin/main` because lesson inventory is outside this sprint, and reran the
  focused validation set.
- Kept the human-review handoff blocked pending final PR review and
  `platform-ci / validate-platform` pass or explicit CI waiver.

## Owner Hold/Revise Review

Reviewer verdict: HOLD_REVISE.

Blocking findings addressed in the August refresh:

1. The branch was 61 commits behind `main` and conflicting.
   - Fix: moved PR #198 back to draft, fetched current `main`, merged it, and
     regenerated the GitHub-facing indexes with the current generator.
2. Exact-head lead-review and readiness evidence was not inspectable.
   - Fix: supersede the July packet snapshot, publish the final lead-review
     result on PR #198 for the exact remote head, and run the current PR
     Readiness router so its durable comment is the lifecycle authority.
3. The 14 files were described as the full student-web surface.
   - Fix: call them the `student-web` validation baseline, separate the 13
     additional Office/legacy DOCX files, and require separate review of the
     `Start -> Leer -> Check -> Oefen -> Exit ticket` route, advisory short
     check, and target-equivalent exit ticket.

Proof required:

- Current agent-index freshness checker passes.
- Focused validator, scope/governance, finalization-freshness, and full
  exact-head CI pass.
- Exact-remote-head lead review returns PASS/OK.
- PR Readiness returns `READY_FOR_HUMAN_REVIEW` and marks the draft ready.

## August Lead Review Round 1

Reviewer verdict: REVISE.

Blocking findings addressed:

1. Default folder setup still copied the Office-only static helper DOCX.
   - Fix: moved the copy command behind an explicit `office`/`legacy-full`
     condition and prohibited it for default `student-web`.
2. Phase 4b still instructed builders to create every rich output through the
   DOCX-heavy script family.
   - Fix: split native baseline HTML/PPTX production from a counted table of
     the 13 additional Office/legacy DOCX exports.
3. The verification checklist still required DOCX dual coding unconditionally.
   - Fix: added a baseline HTML/PPTX dual-coding check and a separately scoped
     Office/legacy DOCX check.

Proof required:

- Regenerate the platform index, rerun focused checks, and obtain PASS/OK on
  the corrected exact head.
