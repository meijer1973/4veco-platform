# AGENT-DOC-GOVERNANCE-CLEANUP-20260630 Plan Corrections

Status: applied after lead-review round 1.

## Corrections Applied

- Added explicit lesson worktree-safety claim using `--worktree C:/Projects/4veco-worktrees/AGENT-DOC-GOVERNANCE-CLEANUP-20260630/4veco-lessen`.
- Added required pre-implementation freshness evidence for both repositories: `git fetch --prune origin`, `git status --short --branch`, `git branch --show-current`, and `git rev-parse HEAD`.
- Changed map/index refresh from conditional to mandatory after the lesson AGENTS edit, with a requirement to record whether each command changed files.
- Added a formal test-evidence file requirement: `reports/sprints/AGENT-DOC-GOVERNANCE-CLEANUP-20260630-test-evidence.md`.
- Added explicit lead-review record files for plan and implementation review loops.
- Clarified that a lesson-only PR must use `--repo meijer1973/4veco-lessen` and must not be classified as a cross-repo bundle.
- Clarified that if platform evidence/index files are committed, the expected route is a platform controller PR plus paired lesson PR with bundle id `AGENT-DOC-GOVERNANCE-CLEANUP-20260630`, exact member SHAs, green bundle compatibility proof, and `npm.cmd run apply:bundle-readiness` where coordinated mark-ready is needed.
- Tightened the finding 2 verification so intentional `C:\Projects\4veco-worktrees\<task-id>\...` examples are not treated as absolute build-doc link failures.

## Files Updated

- `reports/sprints/AGENT-DOC-GOVERNANCE-CLEANUP-20260630-plan.md`
- `reports/sprints/AGENT-DOC-GOVERNANCE-CLEANUP-20260630-plan-lead-review-round1.md`
- `reports/sprints/AGENT-DOC-GOVERNANCE-CLEANUP-20260630-plan-corrections.md`
