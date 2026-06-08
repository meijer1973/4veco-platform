# Lead Review Assignment: AGENT-WORKTREE-SAFETY-1

Generated: 2026-06-07

## Assignment

Sprint: `AGENT-WORKTREE-SAFETY-1`

Lead reviewer: verification subagent plus main-agent integration review.

## Scope

Review the workflow-isolation implementation and evidence for:

- `AGENTS.md`
- `../4veco-lessen/AGENTS.md`
- `build-scripts/ci/check-agent-worktree-safety.js`
- `build-scripts/ci/check-agent-worktree-safety.test.js`
- `package.json`
- `reports/sprints/AGENT-WORKTREE-SAFETY-1-command-log.jsonl`
- `reports/sprints/AGENT-WORKTREE-SAFETY-1-plan.md`
- `reports/sprints/AGENT-WORKTREE-SAFETY-1-baseline.md`

## Evidence To Inspect

- Worktree policy exists in both AGENTS files.
- Checker stores locks under the per-worktree Git metadata directory.
- Checker fails for anchor/main mutating mode, detached HEAD, divergence,
  invalid prefix, dirty `--require-clean`, missing lock in `--check`, another
  owner, and wrong task.
- Checker warns without failing for ahead/behind, dirty when clean is not
  required, and old same-owner locks.
- Focused tests and real platform/lesson worktree checks pass.
- Protected references, source data, and generated Book 1 lesson output remain
  unchanged.

## Required Output

Lead review must produce:

- `reports/sprints/AGENT-WORKTREE-SAFETY-1-lead-review-round1.md`
- `reports/sprints/AGENT-WORKTREE-SAFETY-1-lead-review-corrections.md`
- `reports/sprints/AGENT-WORKTREE-SAFETY-1-lead-review-round2.md`

Round 2 must give a concrete go/no-go verdict before closure artifacts are
finalized.
