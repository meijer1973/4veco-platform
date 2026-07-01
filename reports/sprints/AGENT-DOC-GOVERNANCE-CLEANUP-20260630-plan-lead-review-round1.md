# Lead Review Summary

## Scope

- Artifact/task: `AGENT-DOC-GOVERNANCE-CLEANUP-20260630-plan.md`
- Requested outcome: verify the plan safely fixes audit findings 1, 2, 3, and 8, then supports PR/readiness/human-review workflow.
- Evidence inspected: lead-reviewer spec, sprint plan, platform/lesson `AGENTS.md`, PR throughput/readiness policies, readiness/router scripts, active governance and retired mirror checkers, package scripts, testing-agent spec.
- Reviewed repository and PR: local paired worktrees; no PR yet.
- Reviewed commit SHA: platform `99a9dde56e5606658ea5f744a6efd819eed708c1`; lesson `aefab74fb4d609e42140723b3e01db61e1f3644e`.
- PR-readiness routing suitability: suitable after revisions below.
- Human-authority trigger: yes, `AGENTS.md` governance/instruction surface change; stop at `READY_FOR_HUMAN_REVIEW`.
- Batching recommendation: no batching required; this is a coherent bounded governance cleanup.
- Subsequent changes require re-review: yes, any source/governance/checker/evidence change after lead review.

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Plan/spec conformance | lead-reviewer-agent | This review | REVISE |
| Platform findings 1/2/8 baseline proof | shell/checkers | exact SHA + command/exit-code proof | Acceptable, evidence must be recorded |
| Lesson finding 3 implementation | source diff + link resolver checks | changed `AGENTS.md`, referenced files exist | Planned OK |
| Test evidence | testing-agent or test report | command, cwd, exit code, changed-output note | Missing from plan |
| PR readiness | PR readiness reviewer/tooling | exact remote PR head, changed paths, CI/checkers, lead review, branch protection | Needs routing clarification |
| Human review handoff | readiness route | `READY_FOR_HUMAN_REVIEW` packet/PR body | Planned OK after fixes |

## Consolidated Verdict

- Verdict: REVISE
- Reason: The central implementation idea is sound, including treating platform findings 1, 2, and 8 as already-fixed baseline state on `origin/main`. But the plan is not yet ready because it omits lesson-side worktree/freshness proof, leaves repository-map refresh too discretionary, and does not make PR-readiness routing precise enough for lesson-only versus paired bundle cases.

## Blocking Findings

- Add lesson-side safety/freshness evidence before implementation: `git fetch --prune origin`, `git status --short --branch`, `git branch --show-current`, and `npm.cmd run check:agent-worktree-safety -- --claim --task agent-doc-governance-cleanup-20260630 --agent codex --require-prefix codex/,agent/ --require-clean --worktree C:/Projects/4veco-worktrees/AGENT-DOC-GOVERNANCE-CLEANUP-20260630/4veco-lessen`.
- Make the lesson-only PR path explicit: open only the lesson PR if only `4veco-lessen` changes, and run readiness with `--repo meijer1973/4veco-lessen`. Do not classify that as `cross_repo_bundle`.
- Make the paired path explicit if platform generated maps/evidence are committed: platform controller PR + lesson PR, same `bundle_id`, exact member SHAs, green bundle compatibility proof, and `npm.cmd run apply:bundle-readiness` where coordinated mark-ready is needed.
- Run repository map/index refresh commands after the AGENTS edit and record whether they changed files.
- Add a bounded testing-agent/test-report step with command, cwd, exit code, and changed-output evidence.

## Required Next Action

Revise the plan with the concrete safety, freshness, testing, map-refresh, and PR-routing changes above, then resubmit for lead-review approval before implementation.
