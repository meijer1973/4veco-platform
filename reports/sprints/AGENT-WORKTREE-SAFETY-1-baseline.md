# Sprint AGENT-WORKTREE-SAFETY-1: Baseline

Generated: 2026-06-07

## Plan reference

Plan: `reports/sprints/AGENT-WORKTREE-SAFETY-1-plan.md`

## Baseline Inputs

- Platform anchor preflight: `git fetch --prune origin`, `git status --short
  --branch`, and `git branch --show-current` showed clean `main` before a
  dedicated task worktree was created.
- Lesson anchor preflight: `git fetch --prune origin`, `git status --short
  --branch`, and `git branch --show-current` showed clean `main` before a
  dedicated task worktree was created.
- Platform task worktree: `C:\wt\AGENT-WORKTREE-SAFETY-1\4veco-platform` on
  `codex/agent-worktree-safety-20260607`.
- Lesson task worktree: `C:\wt\AGENT-WORKTREE-SAFETY-1\4veco-lessen` on
  `codex/agent-worktree-safety-20260607`.
- Default lesson task path
  `C:\Projects\4veco-worktrees\AGENT-WORKTREE-SAFETY-1\4veco-lessen` was
  attempted first and failed on an existing long DOCX filename. The shorter
  `C:\wt\...` root is the recorded path-length-safe task root.
- Worktree ownership lock for platform was written to
  `C:\Projects\4veco\4veco-platform\.git\worktrees\4veco-platform\4veco-agent-worktree-lock.json`.
- Worktree ownership lock for lesson was written to
  `C:\Projects\4veco\4veco-lessen\.git\worktrees\4veco-lessen\4veco-agent-worktree-lock.json`.
- Lock owner / agent id:
  `codex-AGENT-WORKTREE-SAFETY-1-20260607`.
- Required baseline files read:
  - `RESEARCH_AGENT_MAP.md`
  - `../4veco-lessen/RESEARCH_AGENT_MAP.md`
  - `AGENTS.md`
  - `../4veco-lessen/AGENTS.md`
  - `build-scripts/README.md`
  - `build-scripts/ci/check-agent-branch-safety.js`
  - `build-scripts/ci/check-agent-branch-safety.test.js`
  - `reports/sprints/AGENT-BRANCH-SAFETY-1-result.md`
  - `reports/sprints/AGENT-BRANCH-SAFETY-1-plan.md`
  - `references/reference-team-roadmap.md`
  - `../4veco-lessen/specifications/product-vision.md`
  - `../4veco-lessen/specifications/product-end-state.md`
  - `../4veco-lessen/specifications/companion-core-specifications.md`
  - `../4veco-lessen/lessen-team-roadmap.md`
- Product vision fit: this sprint strengthens the agent-scalable production
  system pillar. It has no direct student-visible improvement and no rendered
  output requirement.

## Current Evidence Gap

The previous baseline proves branch-per-agent safety, but agents can still
share one physical working tree. Branch switching in that shared folder can
silently move other agents to the wrong branch. There is no worktree ownership
policy in the AGENTS files and no local checker that claims or verifies a
per-worktree lock.

## Data integrity notes

No protected reference data changed during baseline capture.
`references/machine/` and `references/external/` remain unchanged. The baseline
does not mutate `source-data/`, generated Book 1 lesson output,
target-exercise registries, candidate storage, PV outputs, or product routes.

## Stop Condition Review

The platform and lesson repos are both on coordinated dedicated worktrees,
coordinated dedicated branches, and owned by the recorded task lock before
tracked-file implementation begins. The only baseline complication was the
Windows filename-length failure for the deeper lesson worktree path; it was
handled by relocating both task worktrees to the shorter shared `C:\wt\...`
root without using force checkout or force worktree operations.
